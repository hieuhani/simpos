# -*- coding: utf-8 -*-

import logging
from odoo import api, fields, models, tools, _

_logger = logging.getLogger(__name__)


class ReportSalesDetailsXlsx(models.AbstractModel):
    _name = 'report.simpos_sales_details_report.report_saledetails_xlsx'
    _inherit = 'report.report_xlsx.abstract'
    _description = 'Point of Sale Details'

    def generate_xlsx_report(self, workbook, data, objs):
        header_titles = [
            _('Order Ref'),
            _('Date'),
            _('Receipt Number'),
            _('Internal Reference'),
            _('Product Name'),
            _('Quantity'),
            _('Discount (%)'),
            _('Subtotal w/o discount'),
            _('Discount'),
            _('Tax'),
            _('Amount'),
        ]
        title_format = workbook.add_format({'bold': True})
        title_format.set_font_color('blue')
        title_format.set_align('center')
        title_format.set_font_size(16)

        subtitle_format = workbook.add_format({})
        subtitle_format.set_align('center')

        table_title_format = workbook.add_format({'bold': True})
        table_title_format.set_align('center')
        date_format = workbook.add_format({'num_format': 'HH:mm d-mm-yyyy'})
        order_cell = workbook.add_format({})
        order_cell.set_font_color('red')

        money_format = workbook.add_format({'num_format': '#,##'})
        order_cell_with_money = workbook.add_format({'num_format': '#,##'})
        order_cell_with_money.set_font_color('red')

        for obj in objs:
            sheet = workbook.add_worksheet(_('Sales Details'))
            sheet.set_column('A:A', 10)
            sheet.set_column('B:B', 18)
            sheet.set_column('C:C', 20)
            sheet.set_column('D:D', 16)
            sheet.set_column('E:E', 30)
            sheet.set_column('G:G', 16)
            sheet.set_column('H:H', 22)
            sheet.set_column('I:I', 15)

            row = 0
            sheet.merge_range('A1:K1', _('Sales details report'), title_format)
            row += 1
            sheet.merge_range('A2:K2', "{from_text} {date_start} {to_text} {date_stop}".format(
                from_text=_('From'),
                date_start=data['date_start'],
                to_text=_('to'),
                date_stop=data['date_stop']
            ), subtitle_format)
            row += 1
            for idx, title in enumerate(header_titles):
                sheet.write(row, idx, title, table_title_format)

            for order in data['orders']:
                row += 1
                order_row = row
                sheet.write(order_row, 0, order['name'], order_cell)

                order_qty = 0
                order_subtotal_wo_discount = 0
                order_discount = 0
                order_tax = 0
                order_amount = 0
                for line in order['lines']:
                    row += 1
                    order_subtotal_wo_discount += line['price_wo_discount']
                    discount_value = line['discount'] * line['price_wo_discount'] / 100
                    order_discount += discount_value
                    tax = line['price_subtotal_incl'] - line['price_subtotal']
                    order_tax += tax
                    sheet.write(row, 9, tax, money_format)

                    sheet.write(row, 1, line['date_order'], date_format)
                    sheet.write(row, 2, line['pos_reference'])
                    sheet.write(row, 3, line['code'])
                    sheet.write(row, 4, line['product_name'])
                    order_qty += line['qty']
                    sheet.write(row, 5, line['qty'])
                    sheet.write(row, 6, line['discount'])
                    sheet.write(row, 7, line['price_wo_discount'], money_format)
                    sheet.write(row, 8, discount_value, money_format)
                    order_amount += line['price_subtotal_incl']
                    sheet.write(row, 10, line['price_subtotal_incl'], money_format)

                sheet.write(order_row, 5, order_qty, order_cell)
                sheet.write(order_row, 7, order_subtotal_wo_discount, order_cell_with_money)

                sheet.write(order_row, 8, order_discount, order_cell_with_money)
                sheet.write(order_row, 9, order_tax, order_cell_with_money)
                sheet.write(order_row, 10, order_amount, order_cell_with_money)
