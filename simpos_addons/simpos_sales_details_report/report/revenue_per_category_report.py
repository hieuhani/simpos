# -*- coding: utf-8 -*-

import logging
from odoo import api, fields, models, tools, _

_logger = logging.getLogger(__name__)


class ReportRevenuePerCategoryXlsx(models.AbstractModel):
    _name = 'report.simpos_sales_details_report.report_revenue_category_xlsx'
    _inherit = 'report.report_xlsx.abstract'
    _description = 'Point of Sale Revenue per category'

    def generate_xlsx_report(self, workbook, data, objs):
        header_titles = [
            _('Internal Reference'),
            _('Product Name'),
            _('Quantity'),
            _('Price Unit'),
            _('Subtotal'),
            _('Tax'),
            _('Subtotal w/o Tax'),
        ]
        bold_format = workbook.add_format({'bold': True})
        title_format = workbook.add_format({'bold': True})
        title_format.set_font_color('blue')
        title_format.set_align('center')
        title_format.set_font_size(16)

        subtitle_format = workbook.add_format({})
        subtitle_format.set_align('center')

        table_title_format = workbook.add_format({'bold': True})
        table_title_format.set_align('center')

        order_cell_format = workbook.add_format({})
        order_cell_format.set_font_color('red')

        money_format = workbook.add_format({'num_format': '#,##'})

        money_red_format = workbook.add_format({'num_format': '#,##'})
        money_red_format.set_font_color('red')
        for obj in objs:
            sheet = workbook.add_worksheet(_('Revenue per Category'))
            sheet.write(0, 0, '%s - %s' %
                        (data['company_name'], data['company_address']), bold_format)
            sheet.merge_range('A2:G2', _('Revenue per category'), title_format)
            sheet.merge_range('A3:G3', "{from_text} {date_start} {to_text} {date_stop}".format(
                from_text=_('From'),
                date_start=data['date_start'],
                to_text=_('to'),
                date_stop=data['date_stop']
            ), subtitle_format)
            sheet.set_column('A:A', 20)
            sheet.set_column('B:B', 36)
            sheet.set_column('C:C', 8)
            sheet.set_column('D:D', 15)
            sheet.set_column('E:E', 15)
            sheet.set_column('G:G', 15)

            row = 3
            for idx, title in enumerate(header_titles):
                sheet.write(row, idx, title, table_title_format)

            for category_name, products in data['category_products'].items():
                row += 1
                order_row = row
                sheet.write(order_row, 0, category_name, order_cell_format)
                products.sort(key=lambda product: product['code'])
                total_price_subtotal_incl = 0
                total_tax = 0
                total_price_subtotal = 0
                for product in products:
                    row += 1
                    sheet.write(row, 0, product['code'])
                    sheet.write(row, 1, product['product_name'])
                    sheet.write(row, 2, product['qty'])
                    sheet.write(row, 3, product['price_unit'], money_format)
                    sheet.write(
                        row, 4, product['price_subtotal_incl'], money_format)

                    sheet.write(
                        row, 5, product['price_subtotal_incl'] - product['price_subtotal'], money_format)

                    sheet.write(
                        row, 6, product['price_subtotal'], money_format)

                    total_price_subtotal_incl += product['price_subtotal_incl']
                    total_tax += product['price_subtotal_incl'] - \
                        product['price_subtotal']
                    total_price_subtotal += product['price_subtotal']

                sheet.write(
                    order_row, 4, total_price_subtotal_incl, money_red_format)
                sheet.write(order_row, 5, total_tax, money_red_format)
                sheet.write(order_row, 6, total_price_subtotal,
                            money_red_format)
