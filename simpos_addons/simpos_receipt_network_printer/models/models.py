# -*- coding: utf-8 -*-

# from odoo import models, fields, api


# class simpos_pos_receit_network_printer(models.Model):
#     _name = 'simpos_pos_receit_network_printer.simpos_pos_receit_network_printer'
#     _description = 'simpos_pos_receit_network_printer.simpos_pos_receit_network_printer'

#     name = fields.Char()
#     value = fields.Integer()
#     value2 = fields.Float(compute="_value_pc", store=True)
#     description = fields.Text()
#
#     @api.depends('value')
#     def _value_pc(self):
#         for record in self:
#             record.value2 = float(record.value) / 100
