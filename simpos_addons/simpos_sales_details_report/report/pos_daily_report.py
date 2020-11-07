# -*- coding: utf-8 -*-

import logging
from odoo import api, fields, models, tools, _

_logger = logging.getLogger(__name__)


class ReportPosDailyXlsx(models.AbstractModel):
    _name = 'report.simpos_sales_details_report.report_pos_daily_xlsx'
    _inherit = 'report.report_xlsx.abstract'
    _description = 'Point of Sale Details'

    def generate_xlsx_report(self, workbook, data, objs):
        bold_format = workbook.add_format({'bold': True})
        title_format = workbook.add_format({'bold': True})
        title_format.set_font_color('blue')
        title_format.set_align('center')
        title_format.set_font_size(16)

        subtitle_format = workbook.add_format({})
        subtitle_format.set_align('center')

        table_title_format = workbook.add_format({'bold': True})
        table_title_format.set_align('center')
        table_data = {
            _('Total Sales'): data['total_sale'],
            _('VAT'): data['vat'],
            _('Net sale before VAT'): data['net_sale_before_vat'],
            _('Total transaction'): data['total_transaction'],
            _('Cash sale amount'): data['cash_sale_amount'],
            _('Credit Card sale amount'): data['credit_card_sale_amount'],
            _('Number of Credit Card Transaction'): data['number_of_credit_card_transaction'],
        }
        for obj in objs:
            sheet = workbook.add_worksheet(_('Daily Report'))
            sheet.set_column('A:A', 50)
            sheet.set_column('B:B', 20)
            sheet.write(0, 0, '%s - %s' % (data['company_name'], data['company_address']), bold_format)
            sheet.merge_range('A2:B2', _('Sales details report'), title_format)
            sheet.merge_range('A3:B3', "{from_text} {date_start} {to_text} {date_stop}".format(
                from_text=_('From'),
                date_start=data['date_start'],
                to_text=_('to'),
                date_stop=data['date_stop']
            ), subtitle_format)

            row = 4
            sheet.write(row, 0, _('Content'), table_title_format)
            sheet.write(row, 1, _('Amount'), table_title_format)

            for key, value in table_data.items():
                row += 1
                sheet.write(row, 0, key)
                sheet.write(row, 1, value)
