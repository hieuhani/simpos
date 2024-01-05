# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import fields, models

class RestaurantPrinter(models.Model):

    _inherit = 'restaurant.printer'

    printer_type = fields.Selection(selection_add=[('network_printer', 'Use a network printer')])
    network_printer_ip = fields.Char(string='Receipt Printer IP Address', help="Local IP address of a printer.")
