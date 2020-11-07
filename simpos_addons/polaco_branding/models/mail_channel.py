from odoo import models, api

class Channel(models.Model):
    _inherit = 'mail.channel'

    @api.model
    def init_odoobot(self):
        channel = super(Channel, self).init_odoobot()
        channel.write({
            'name': 'Bot'
        })
        return channel
