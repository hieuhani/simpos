from odoo import api, fields, models

class ResPartner(models.Model):
    _inherit = "res.partner"

    url = fields.Char('URL')
    db = fields.Char('Database name')
    username = fields.Char('Username')
    password = fields.Char('Password')
