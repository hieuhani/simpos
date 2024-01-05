# -*- coding: utf-8 -*-

from odoo import models, fields, api


class PosOrder(models.Model):
    _inherit = 'pos.order'

    vibration_card = fields.Char(string='Vibration card')
    table_no = fields.Char(string='Table number')
