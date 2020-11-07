# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models, _
from odoo.exceptions import UserError


class StockBarcodeLot(models.TransientModel):
    _name = "stock_barcode.lot"
    _inherit = ['barcodes.barcode_events_mixin']
    _description = "Wizard to scan SN/LN for specific product"

    picking_id = fields.Many2one('stock.picking')
    product_id = fields.Many2one('product.product')
    qty_reserved = fields.Float()
    qty_done = fields.Float()
    default_move_id = fields.Many2one('stock.move')
    stock_barcode_lot_line_ids = fields.One2many('stock_barcode.lot.line', 'stock_barcode_lot_id')

    @api.model
    def default_get(self, fields):
        res = super(StockBarcodeLot, self).default_get(fields)
        qty_reserved = 0.0
        qty_done = 0.0
        if 'stock_barcode_lot_line_ids' in fields and self.env.context.get('candidates'):
            candidates = self.env['stock.move.line'].browse(self.env.context['candidates'])
            lines = []
            res['default_move_id'] = candidates[0].move_id.id
            for ml in candidates:
                if ml.lot_id:
                    lot_name = ml.lot_id.name
                else:
                    lot_name = ml.lot_name
                lines.append({
                    'lot_name': lot_name,
                    'qty_reserved': ml.product_uom_qty,
                    'qty_done': ml.qty_done,
                    'move_line_id': ml.id,
                })
                qty_reserved += ml.product_uom_qty
                qty_done += ml.qty_done
            res['stock_barcode_lot_line_ids'] = [(0, 0, x) for x in lines]
        if 'qty_reserved' in fields:
            res['qty_reserved'] = qty_reserved
        if 'qty_done' in fields:
            res['qty_done'] = qty_done

        return res

    def _update_quantity_done(self):
        self.qty_done = sum(self.stock_barcode_lot_line_ids.mapped('qty_done'))

    def on_barcode_scanned(self, barcode):
        suitable_line = self.stock_barcode_lot_line_ids.filtered(lambda l: l.lot_name == barcode or not l.lot_name)
        vals = {}
        if suitable_line:
            if suitable_line[0].lot_name and self.product_id.tracking =='serial' and suitable_line[0].qty_done > 0:
                raise UserError(_('You cannot scan two times the same serial number'))
            else:
                vals['lot_name'] = barcode
            vals['qty_done'] = suitable_line[0].qty_done + 1
            suitable_line[0].update(vals)
        else:
            vals['lot_name'] = barcode
            vals['qty_done'] = 1
            vals['stock_barcode_lot_id'] = self.id
            self.env['stock_barcode.lot.line'].new(vals)
        self.update({'qty_done': self.qty_done + 1})
        return

    def validate_lot(self):
        for line in self.stock_barcode_lot_line_ids:
            if line.lot_name:
                vals = {}
                vals['qty_done'] = line.qty_done
                if self.picking_id.picking_type_id.use_create_lots and not self.picking_id.picking_type_id.use_existing_lots:
                    vals['lot_name'] = line.lot_name
                else:
                    vals['lot_id'] = self.get_lot_or_create(line.lot_name).id
                if line.move_line_id:
                    line.move_line_id.write(vals)
                elif self.default_move_id:
                    vals.update({
                        'picking_id': self.picking_id.id,
                        'move_id': self.default_move_id.id,
                        'product_id': self.product_id.id,
                        'product_uom_id': self.default_move_id.product_uom.id,
                        'location_id': self.default_move_id.location_id.id,
                        'location_dest_id': self.default_move_id.location_dest_id.id,
                    })
                    self.env['stock.move.line'].create(vals)
                else:
                    vals.update({
                        'picking_id': self.picking_id.id,
                        'product_id': self.product_id.id,
                        'product_uom_id': self.product_id.uom_id.id,
                        'location_id': self.picking_id.location_id.id,
                        'location_dest_id': self.picking_id.location_dest_id.id,
                    })
                    new_move = self.env['stock.move'].create({
                        'name': self.picking_id.name,
                        'picking_id': self.picking_id.id,
                        'picking_type_id': self.picking_id.picking_type_id.id,
                        'location_id': self.picking_id.location_id.id,
                        'location_dest_id': self.picking_id.location_dest_id.id,
                        'product_id': self.product_id.id,
                        'product_uom': self.product_id.uom_id.id,
                        'move_line_ids': [(0, 0, vals)]
                    })
                    self.default_move_id = new_move


    def get_lot_or_create(self, barcode):
        lot = self.env['stock.production.lot'].search([('name', '=', barcode), ('product_id', '=', self.product_id.id)])
        if not lot:
            lot = self.env['stock.production.lot'].create({'name': barcode, 'product_id': self.product_id.id})
        return lot

class StockBarcodeLotLine(models.TransientModel):
    _name = "stock_barcode.lot.line"
    _description = "LN/SN Product Lines"

    lot_name = fields.Char('Lot')
    qty_reserved = fields.Float('Quantity Reserved')
    qty_done = fields.Float('Quantity Done')
    stock_barcode_lot_id = fields.Many2one('stock_barcode.lot')
    move_line_id = fields.Many2one('stock.move.line')
    product_barcode = fields.Char('Barcode', compute='_compute_product_barcode')

    @api.onchange('qty_done')
    def onchange_qty_done(self):
        if self.stock_barcode_lot_id.product_id.tracking == 'serial' and self.qty_done > 1:
            raise UserError(_('You cannot scan two times the same serial number'))
        self.stock_barcode_lot_id._update_quantity_done()

    @api.depends('lot_name')
    def _compute_product_barcode(self):
        for line in self:
            line.product_barcode = line.lot_name
