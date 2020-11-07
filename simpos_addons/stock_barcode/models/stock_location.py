# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import models, api


class Location(models.Model):
    _inherit = 'stock.location'

    @api.model
    def get_all_locations_by_barcode(self):
        locations = self.env['stock.location'].search_read(
            [('barcode', '!=', None)], ['display_name', 'barcode', 'parent_path'])
        locationsByBarcode = {location.pop('barcode'): location for location in locations}
        return locationsByBarcode
