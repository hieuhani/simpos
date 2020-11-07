# -*- coding: utf-8 -*-

import logging
from datetime import timedelta


from odoo import api, fields, models, tools, _
from odoo.osv.expression import AND
from odoo.tools import DEFAULT_SERVER_DATE_FORMAT as DATE_FORMAT
from pytz import timezone, UTC

_logger = logging.getLogger(__name__)


class PosDetails(models.TransientModel):
    _inherit = 'pos.details.wizard'

    def format_dt(self, dt):
        user_tz = self.env.user.tz or 'UTC'
        localized_dt = timezone('UTC').localize(
            dt).astimezone(timezone(user_tz))
        return localized_dt

    @api.model
    def get_orders(self):
        date_start = self.start_date
        date_stop = self.end_date
        config_ids = self.pos_config_ids.ids
        domain = [('state', 'in', ['paid', 'invoiced', 'done'])]

        if date_start:
            date_start = fields.Datetime.from_string(date_start)
        else:
            # start by default today 00:00:00
            user_tz = pytz.timezone(self.env.context.get(
                'tz') or self.env.user.tz or 'UTC')
            today = user_tz.localize(fields.Datetime.from_string(
                fields.Date.context_today(self)))
            date_start = today.astimezone(pytz.timezone('UTC'))

        if date_stop:
            date_stop = fields.Datetime.from_string(date_stop)
            # avoid a date_stop smaller than date_start
            if date_stop < date_start:
                date_stop = date_start + timedelta(days=1, seconds=-1)
        else:
            # stop by default today 23:59:59
            date_stop = date_start + timedelta(days=1, seconds=-1)

        domain = AND([domain,
                      [('date_order', '>=', fields.Datetime.to_string(date_start)),
                       ('date_order', '<=', fields.Datetime.to_string(date_stop))]
                      ])

        if config_ids:
            domain = AND([domain, [('config_id', 'in', config_ids)]])

        orders = self.env['pos.order'].search(domain, order='date_order asc')

        return orders

    def sales_details_report(self):
        orders = self.get_orders()
        return {
            'date_start': self.format_dt(self.start_date),
            'date_stop': self.format_dt(self.end_date),
            'orders': [{
                'name': order.name,
                'lines': [{
                    'date_order': self.format_dt(order.date_order),
                    'pos_reference': order.pos_reference,
                    'code': line.product_id.default_code or '',
                    'product_name': line.product_id.display_name,
                    'qty': line.qty,
                    'discount': line.discount,
                    'price_unit': line.price_unit,
                    'price_subtotal': line.price_subtotal,
                    'price_subtotal_incl': line.price_subtotal_incl,
                    'price_wo_discount': line.qty * line.price_unit
                } for line in order.lines]
            } for order in orders]
        }

    def pos_daily_report(self):
        orders = self.get_orders()
        user_currency = self.env.company.currency_id
        total = 0.0
        taxes = {}
        for order in orders:
            if user_currency != order.pricelist_id.currency_id:
                total += order.pricelist_id.currency_id._convert(
                    order.amount_total, user_currency, order.company_id, order.date_order or fields.Date.today())
            else:
                total += order.amount_total
            currency = order.session_id.currency_id

            for line in order.lines:
                if line.tax_ids_after_fiscal_position:
                    line_taxes = line.tax_ids_after_fiscal_position.compute_all(
                        line.price_unit * (1-(line.discount or 0.0)/100.0), currency, line.qty, product=line.product_id, partner=line.order_id.partner_id or False)
                    for tax in line_taxes['taxes']:
                        taxes.setdefault(
                            tax['id'], {'name': tax['name'], 'tax_amount': 0.0, 'base_amount': 0.0})
                        taxes[tax['id']]['tax_amount'] += tax['amount']
                        taxes[tax['id']]['base_amount'] += tax['base']
                else:
                    taxes.setdefault(
                        0, {'name': _('No Taxes'), 'tax_amount': 0.0, 'base_amount': 0.0})
                    taxes[0]['base_amount'] += line.price_subtotal_incl
        payment_ids = self.env["pos.payment"].search(
            [('pos_order_id', 'in', orders.ids)]).ids
        if payment_ids:
            self.env.cr.execute("""
                        SELECT method.name, sum(amount) total, count(method.name) as count
                        FROM pos_payment AS payment,
                             pos_payment_method AS method
                        WHERE payment.payment_method_id = method.id
                            AND payment.id IN %s
                        GROUP BY method.name
                    """, (tuple(payment_ids),))
            payments = self.env.cr.dictfetchall()
        else:
            payments = []

        cash_sale_amount = 0
        credit_card_sale_amount = 0
        number_of_credit_card_transaction = 0
        for payment in payments:
            if payment['name'] == 'Cash':
                cash_sale_amount += payment['total']
            elif payment['name'] == 'Bank':
                credit_card_sale_amount += payment['total']
                number_of_credit_card_transaction += payment['count']

        total_tax = 0
        for tax in taxes.values():
            total_tax += tax['tax_amount']
        return {
            'date_start': self.format_dt(self.start_date),
            'date_stop': self.format_dt(self.end_date),
            'company_name': self.env.company.name,
            'company_address': self.env.company.street,
            'total_sale': total,
            'vat': total_tax,
            'net_sale_before_vat': total - total_tax,
            'total_transaction': len(orders),
            'cash_sale_amount': cash_sale_amount,
            'credit_card_sale_amount': credit_card_sale_amount,
            'number_of_credit_card_transaction': number_of_credit_card_transaction,
        }

    def revenue_per_category_report(self):
        orders = self.get_orders()
        products_sold = {}
        for order in orders:
            for line in order.lines:
                key = line.product_id.id
                products_sold.setdefault(key, {})
                products_sold[key] = {
                    'code': line.product_id.default_code or '',
                    'product_id': line.product_id.id,
                    'product_name': line.product_id.display_name,
                    'qty': products_sold[key].get('qty', 0) + line.qty,
                    'price_unit': line.price_unit,
                    'price_subtotal': products_sold[key].get('price_subtotal', 0) + line.price_subtotal,
                    'price_subtotal_incl': products_sold[key].get('price_subtotal_incl', 0) + line.price_subtotal_incl,
                    'category': line.product_id.pos_categ_id.name,
                }
        category_products = {}
        for product in products_sold.values():
            key = product['category']
            category_products.setdefault(key, [])
            category_products[key].append(product)
        return {
            'date_start': self.format_dt(self.start_date),
            'date_stop': self.format_dt(self.end_date),
            'company_name': self.env.company.name,
            'company_address': self.env.company.street,
            'category_products': category_products,
        }

    def daily_quantity_report(self):
        delta = self.end_date - self.start_date
        days = []
        for idx in range(delta.days + 1):
            days.append(
                (self.start_date + timedelta(days=idx)).strftime(DATE_FORMAT))
        orders = self.get_orders()

        data_map = {}
        products_map = {}

        for order in orders:
            for line in order.lines:
                product_id = line.product_id.id
                if product_id not in products_map:
                    products_map[product_id] = {
                        'code': line.product_id.default_code or '',
                        'product_name': line.product_id.display_name,
                    }
                if product_id not in data_map:
                    data_map[product_id] = {}
                order_date = order.date_order.strftime(DATE_FORMAT)
                if order_date not in data_map[product_id]:
                    data_map[product_id] = {
                        order_date: line.qty,
                    }
                else:
                    data_map[product_id][order_date] += line.qty

                return {
                    'date_start': self.format_dt(self.start_date),
                    'date_stop': self.format_dt(self.end_date),
                    'days': days,
                    'data_map': data_map,
                    'products_map': products_map,
                }

    def generate_sales_details_report_xlsx(self):
        return self.env.ref('simpos_sales_details_report.sales_details_report_xlsx').report_action(
            [],
            data=self.sales_details_report()
        )

    def generate_pos_daily_report_xlsx(self):
        return self.env.ref('simpos_sales_details_report.sales_pos_daily_report_xlsx').report_action(
            [],
            data=self.pos_daily_report()
        )

    def generate_revenue_per_category_report_xlsx(self):
        return self.env.ref('simpos_sales_details_report.sales_revenue_per_category_report_xlsx').report_action(
            [],
            data=self.revenue_per_category_report()
        )

    def generate_daily_quantity_report_xlsx(self):
        return self.env.ref('simpos_sales_details_report.sales_daily_quantity_report_xlsx').report_action(
            [],
            data=self.daily_quantity_report()
        )
