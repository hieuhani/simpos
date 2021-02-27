# -*- coding: utf-8 -*-

from odoo import api, fields, models, _
from odoo.exceptions import ValidationError
import collections


class SaleOrder(models.Model):
  _inherit = "sale.order"

  @api.model_create_multi
  def create_from_po(self, vals_list):
    partner = self.env['res.partner'].search([('name', 'ilike', self.env.user.name)], limit=1)
    if not partner:
      raise ValidationError(_('Partner database is not configured properly'))
    product_codes = set()
    uom_names = set()
    for order in vals_list:
      for line in order['order_lines']:
        product_codes.add(line['product']['default_code'])
        uom_names.add(line['uom']['name'])
    products = self.env['product.product'].search([('default_code', 'in', list(product_codes))])
    products_dict = { product.default_code : product for product in products }

    uoms = self.env['uom.uom'].search([('name', 'in', list(uom_names))])
    uoms_dict = { uom.name : uom for uom in uoms }

    created_orders = []
    for order in vals_list:
      order_lines = []

      warn_message = ''
      for line in order['order_lines']:
        uom = uoms_dict[line['uom']['name']]
        if line['product']['default_code'] in products_dict:
          product = products_dict[line['product']['default_code']]
          order_lines.append({
            'name': product.name,
            'product_id': product.id,
            'product_uom_qty': line['product_qty'],
            'product_uom': uom.id if uom else prod.uom_id.id,
            'price_unit': product.lst_price,
          })
        else:
          warn_message += _('%s %s of %s is not available') % (line['product_qty'], line['uom']['name'], line['product']['display_name']) + '\n'

      sale_order = self.env['sale.order'].create({
            'partner_id': partner.id,
            'client_order_ref': order['name'],
            'validity_date': order['date_planned'],
            'date_order': order['date'],
            'order_line': [(0, 0, order_line) for order_line in order_lines],
        })

      if warn_message:
        sale_order.message_post(body=warn_message, message_type='comment')

      created_orders.append(sale_order)
    return self.browse().concat(*(vals for vals in created_orders))
