# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
import xmlrpc.client
from odoo.exceptions import ValidationError

class PurchaseOrder(models.Model):
  _inherit = "purchase.order"

  def button_confirm(self):
    res = super(PurchaseOrder, self).button_confirm()
    for order in self:
      if order.state == 'purchase':
        order.trigger_create_partner_sales_order()

    return res

  def trigger_create_partner_sales_order(self):
    partner = self.partner_id if not self.partner_id.parent_id else self.partner_id.parent_id
    if not partner.url:
      raise ValidationError(_('Partner database is not configured properly'))

    currency = partner.property_purchase_currency_id or self.env.company.currency_id
    context = (self._context or {})
    order = {
      'order_lines': [],
      'date': self.date_order and self.date_order.date(),
      'user': {
        'id': self.user_id.id,
        'login': self.user_id.login,
        'name': self.user_id.name,
        'email': self.user_id.email,
      } if self.user_id else null,
      'date_planned': self.date_planned,
      'notes': self.notes,
      'name': self.name,
    }

    for line in self.order_line:
      order['order_lines'].append({
        'partner': {
          'id': line.partner_id.id,
          'db': line.partner_id.db,
          'url': line.partner_id.url,
          'display_name': line.partner_id.display_name,
        } if line.partner_id else null,
        'product_qty': line.product_qty,
        'uom': {
          'id': line.product_uom.id,
          'name': line.product_uom.name,
          'display_name': line.product_uom.display_name,
          'factor': line.product_uom.factor,
          'factor_inv': line.product_uom.factor_inv,
          'rounding': line.product_uom.rounding,
          'uom_type': line.product_uom.uom_type,
        } if line.product_uom else null,
        'product': {
          'id': line.product_id.id,
          'barcode': line.product_id.barcode,
          'code': line.product_id.code,
          'display_name': line.product_id.display_name,
          'default_code': line.product_id.default_code,
        } if line.product_id else null,
        'currency': {
          'id': currency.id,
          'name': currency.name,
          'rate': currency.rate,
        } if currency else null,
      })
    common = xmlrpc.client.ServerProxy('{}/xmlrpc/2/common'.format(partner.url))
    uid = common.authenticate(partner.db, partner.username, partner.password, {})
    if not uid:
      raise ValidationError(_('User or password is invalid'))
    models = xmlrpc.client.ServerProxy('{}/xmlrpc/2/object'.format(partner.url))
    clean_context = { key: context[key] for key in ['tz', 'lang'] }
    so_id = models.execute_kw(partner.db, uid, partner.password, 'sale.order', 'create_from_po', [order], { 'context': clean_context })
    print(so_id)
