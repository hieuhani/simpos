# -*- coding: utf-8 -*-

import logging
from odoo import api, fields, models, tools, _

_logger = logging.getLogger(__name__)


class ReportDailyQuantityXlsx(models.AbstractModel):
    _name = 'report.simpos_sales_details_report.report_daily_quantity_xlsx'
    _inherit = 'report.report_xlsx.abstract'
    _description = 'Daily Quantity'

    def generate_xlsx_report(self, workbook, data, objs):
        title_format = workbook.add_format({'bold': True})
        title_format.set_font_color('blue')
        title_format.set_align('center')
        title_format.set_font_size(16)

        subtitle_format = workbook.add_format({})
        subtitle_format.set_align('center')

        table_title_format = workbook.add_format({'bold': True})
        table_title_format.set_align('center')

        for obj in objs:
            sheet = workbook.add_worksheet(_('Daily quantity Report'))
            sheet.set_column('A:A', 10)
            sheet.set_column('B:B', 40)
            row = 2
            current_row = row
            header_day_col = 2
            for (idx, day) in enumerate(data['days']):
                sheet.write(current_row, header_day_col, day)
                sheet.set_column(current_row, idx + 2, 9)
                header_day_col += 1
            sheet.write(current_row, header_day_col, _('Total'))
            sheet.merge_range(0, 0, 0, header_day_col, _('Daily quantity Report'), title_format)
            sheet.merge_range(1, 0, 1, header_day_col, "{from_text} {date_start} {to_text} {date_stop}".format(
                from_text=_('From'),
                date_start=data['date_start'],
                to_text=_('to'),
                date_stop=data['date_stop']
            ), subtitle_format)

            sheet.write(2, 0, _('Internal Reference'))
            sheet.write(2, 1, _('Product Name'),)

            for (product_id, day_map) in data['data_map'].items():
                row += 1
                product_total = 0
                if product_id in data['products_map']:
                    sheet.write(row, 0, data['products_map'][product_id]['code'])
                    sheet.write(row, 1, data['products_map'][product_id]['product_name'])
                for (idx, day) in enumerate(data['days']):
                    if day in day_map:
                        sheet.write(row, idx + 2, day_map[day])
                        product_total += day_map[day]
                sheet.write(row, header_day_col, product_total)
