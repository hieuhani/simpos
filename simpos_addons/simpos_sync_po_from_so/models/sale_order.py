# -*- coding: utf-8 -*-

from odoo import api, fields, models


class SaleOrder(models.Model):
  _inherit = "sale.order"

  @api.model_create_multi
  def create_from_po(self, vals_list):
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

    sale_orders = []
    for order in vals_list:
      order_lines = []

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
          print('log this product to process manually')

      sale_orders.append({
            'partner_id': 18,
            'client_order_ref': order['name'],
            'validity_date': order['date_planned'],
            'date_order': order['date'],
            'order_line': [(0, 0, order_line) for order_line in order_lines],
        }
      )
    return self.env['sale.order'].create(sale_orders)
