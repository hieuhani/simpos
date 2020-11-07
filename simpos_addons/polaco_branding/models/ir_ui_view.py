# -*- coding: utf-8 -*-
from odoo import api, fields, models, _


class View(models.Model):
    _inherit = 'ir.ui.view'

    @api.model
    def render_template(self, template, values=None, engine='ir.qweb'):
        if template in ['web.login', 'web.webclient_bootstrap']:
            if not values:
                values = {}
            values['title'] = 'Procolla'
        return super(View, self).render_template(template, values=values, engine=engine)