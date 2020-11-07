# -*- coding: utf-8 -*-

from odoo import models, fields, api, _
from odoo.exceptions import UserError
from odoo.tools.float_utils import float_compare, float_round

import json


class StockMoveLine(models.Model):
    _name= 'stock.move.line'
    _inherit = ['stock.move.line', 'barcodes.barcode_events_mixin']

    product_barcode = fields.Char(related='product_id.barcode')
    location_processed = fields.Boolean()
    dummy_id = fields.Char(compute='_compute_dummy_id', inverse='_inverse_dummy_id')

    def _compute_dummy_id(self):
        self.dummy_id = ''

    def _inverse_dummy_id(self):
        pass


class StockPicking(models.Model):
    _name = 'stock.picking'
    _inherit = ['stock.picking', 'barcodes.barcode_events_mixin']

    def get_barcode_view_state(self):
        """ Return the initial state of the barcode view as a dict.
        """
        fields_to_read = self._get_picking_fields_to_read()
        pickings = self.read(fields_to_read)
        for picking in pickings:
            picking['move_line_ids'] = self.env['stock.move.line'].browse(picking.pop('move_line_ids')).read([
                'product_id',
                'location_id',
                'location_dest_id',
                'qty_done',
                'display_name',
                'product_uom_qty',
                'product_uom_id',
                'product_barcode',
                'owner_id',
                'lot_id',
                'lot_name',
                'package_id',
                'result_package_id',
                'dummy_id',
            ])

            # Prefetch data
            product_ids = tuple(set([move_line_id['product_id'][0] for move_line_id in picking['move_line_ids']]))
            tracking_and_barcode_per_product_id = {}
            for res in self.env['product.product'].search_read([('id', 'in', product_ids)], ['tracking', 'barcode']):
                tracking_and_barcode_per_product_id[res.pop("id")] = res

            for move_line_id in picking['move_line_ids']:
                id = move_line_id.pop('product_id')[0]
                move_line_id['product_id'] = {"id": id, **tracking_and_barcode_per_product_id[id]}
                id, name = move_line_id.pop('location_id')
                move_line_id['location_id'] = {"id": id, "display_name": name}
                id, name = move_line_id.pop('location_dest_id')
                move_line_id['location_dest_id'] = {"id": id, "display_name": name}
            id, name = picking.pop('location_id')
            picking['location_id'] = self.env['stock.location'].search_read([("id", "=", id)], [
                'parent_path'
            ])[0]
            picking['location_id'].update({"id": id, "display_name": name})
            id, name = picking.pop('location_dest_id')
            picking['location_dest_id'] = self.env['stock.location'].search_read([("id", "=", id)], [
                'parent_path'
            ])[0]
            picking['location_dest_id'].update({"id": id, "display_name": name})
            picking['group_stock_multi_locations'] = self.env.user.has_group('stock.group_stock_multi_locations')
            picking['group_tracking_owner'] = self.env.user.has_group('stock.group_tracking_owner')
            picking['group_tracking_lot'] = self.env.user.has_group('stock.group_tracking_lot')
            picking['group_production_lot'] = self.env.user.has_group('stock.group_production_lot')
            picking['group_uom'] = self.env.user.has_group('uom.group_uom')
            picking['use_create_lots'] = self.env['stock.picking.type'].browse(picking['picking_type_id'][0]).use_create_lots
            picking['use_existing_lots'] = self.env['stock.picking.type'].browse(picking['picking_type_id'][0]).use_existing_lots
            picking['show_entire_packs'] = self.env['stock.picking.type'].browse(picking['picking_type_id'][0]).show_entire_packs
            picking['actionReportDeliverySlipId'] = self.env.ref('stock.action_report_delivery').id
            picking['actionReportBarcodesZplId'] = self.env.ref('stock.action_label_transfer_template_zpl').id
            picking['actionReportBarcodesPdfId'] = self.env.ref('stock.action_label_transfer_template_pdf').id
            if self.env.company.nomenclature_id:
                picking['nomenclature_id'] = [self.env.company.nomenclature_id.id]
        return pickings

    def _get_picking_fields_to_read(self):
        """ Return the default fields to read from the picking.
        """
        return [
            'move_line_ids',
            'picking_type_id',
            'location_id',
            'location_dest_id',
            'name',
            'state',
            'picking_type_code',
            'company_id',
        ]

    def get_po_to_split_from_barcode(self, barcode):
        """ Returns the lot wizard's action for the move line matching
        the barcode. This method is intended to be called by the
        `picking_barcode_handler` javascript widget when the user scans
        the barcode of a tracked product.
        """
        product_id = self.env['product.product'].search([('barcode', '=', barcode)])
        candidates = self.env['stock.move.line'].search([
            ('picking_id', 'in', self.ids),
            ('product_barcode', '=', barcode),
            ('location_processed', '=', False),
            ('result_package_id', '=', False),
        ])

        action_ctx = dict(self.env.context,
            default_picking_id=self.id,
            serial=self.product_id.tracking == 'serial',
            default_product_id=product_id.id,
            candidates=candidates.ids)
        view_id = self.env.ref('stock_barcode.view_barcode_lot_form').id
        return {
            'name': _('Lot/Serial Number Details'),
            'type': 'ir.actions.act_window',
            'view_mode': 'form',
            'res_model': 'stock_barcode.lot',
            'views': [(view_id, 'form')],
            'view_id': view_id,
            'target': 'new',
            'context': action_ctx}

    def new_product_scanned(self, barcode):
        # TODO: remove this method in master, it's not used anymore
        product_id = self.env['product.product'].search([('barcode', '=', barcode)])
        if not product_id or product_id.tracking == 'none':
            return self.on_barcode_scanned(barcode)
        else:
            return self.get_po_to_split_from_barcode(barcode)

    def _check_product(self, product, qty=1.0):
        """ This method is called when the user scans a product. Its goal
        is to find a candidate move line (or create one, if necessary)
        and process it by incrementing its `qty_done` field with the
        `qty` parameter.
        """
        # Get back the move line to increase. If multiple are found, chose
        # arbitrary the first one. Filter out the ones processed by
        # `_check_location` and the ones already having a # destination
        # package.
        picking_move_lines = self.move_line_ids_without_package
        if not self.show_reserved:
            picking_move_lines = self.move_line_nosuggest_ids

        corresponding_ml = picking_move_lines.filtered(lambda ml: ml.product_id.id == product.id and not ml.result_package_id and not ml.location_processed and not ml.lots_visible)[:1]

        if corresponding_ml:
            corresponding_ml.qty_done += qty
        else:
            # If a candidate is not found, we create one here. If the move
            # line we add here is linked to a tracked product, we don't
            # set a `qty_done`: a next scan of this product will open the
            # lots wizard.
            picking_type_lots = (self.picking_type_id.use_create_lots or self.picking_type_id.use_existing_lots)
            new_move_line = self.move_line_ids.new({
                'product_id': product.id,
                'product_uom_id': product.uom_id.id,
                'location_id': self.location_id.id,
                'location_dest_id': self.location_dest_id.id,
                'qty_done': (product.tracking == 'none' and picking_type_lots) and qty or 0.0,
                'product_uom_qty': 0.0,
                'date': fields.datetime.now(),
            })
            if self.show_reserved:
                self.move_line_ids_without_package += new_move_line
            else:
                self.move_line_nosuggest_ids += new_move_line
        return True

    def _check_source_package(self, package):
        corresponding_po = self.move_line_ids.filtered(lambda r: r.package_id.id == package.id and r.result_package_id.id == package.id)
        for po in corresponding_po:
            po.qty_done = po.product_uom_qty
        if corresponding_po:
            self.entire_package_detail_ids.filtered(lambda p: p.name == package.name).is_processed = True
            return True
        else:
            return False

    def _check_destination_package(self, package):
        """ This method is called when the user scans a package currently
        located in (or in any of the children of) the destination location
        of the picking. Its goal is to set this package as a destination
        package for all the processed move lines not having a destination
        package.
        """
        corresponding_ml = self.move_line_ids.filtered(lambda ml: not ml.result_package_id and float_compare(ml.qty_done, 0, precision_rounding=ml.product_uom_id.rounding) == 1)
        # If the user processed the whole reservation (or more), simply
        # write the `package_id` field.
        # If the user processed less than the reservation, split the
        # concerned move line in two: one where the `package_id` field
        # is set with the processed quantity as `qty_done` and another
        # one with the initial values.
        for ml in corresponding_ml:
            rounding = ml.product_uom_id.rounding
            if float_compare(ml.qty_done, ml.product_uom_qty, precision_rounding=rounding) == -1:
                self.move_line_ids += self.move_line_ids.new({
                    'product_id': ml.product_id.id,
                    'package_id': ml.package_id.id,
                    'product_uom_id': ml.product_uom_id.id,
                    'location_id': ml.location_id.id,
                    'location_dest_id': ml.location_dest_id.id,
                    'qty_done': 0.0,
                    'move_id': ml.move_id.id,
                    'date': fields.datetime.now(),
                })
            ml.result_package_id = package.id
        return True

    def _check_destination_location(self, location):
        """ This method is called when the user scans a location. Its goal
        is to find the move lines previously processed and write the scanned
        location as their `location_dest_id` field.
        """
        # Get back the move lines the user processed. Filter out the ones where
        # this method was already applied thanks to `location_processed`.
        corresponding_ml = self.move_line_ids.filtered(lambda ml: not ml.location_processed and float_compare(ml.qty_done, 0, precision_rounding=ml.product_uom_id.rounding) == 1)

        # If the user processed the whole reservation (or more), simply
        # write the `location_dest_id` and `location_processed` fields
        # on the concerned move line.
        # If the user processed less than the reservation, split the
        # concerned move line in two: one where the `location_dest_id`
        # and `location_processed` fields are set with the processed
        # quantity as `qty_done` and another one with the initial values.
        for ml in corresponding_ml:
            rounding = ml.product_uom_id.rounding
            if float_compare(ml.qty_done, ml.product_uom_qty, precision_rounding=rounding) == -1:
                self.move_line_ids += self.move_line_ids.new({
                    'product_id': ml.product_id.id,
                    'package_id': ml.package_id.id,
                    'product_uom_id': ml.product_uom_id.id,
                    'location_id': ml.location_id.id,
                    'location_dest_id': ml.location_dest_id.id,
                    'qty_done': 0.0,
                    'move_id': ml.move_id.id,
                    'date': fields.datetime.now(),
                })
            ml.update({
                'location_processed': True,
                'location_dest_id': location.id,
            })
        return True

    def on_barcode_scanned(self, barcode):
        if not self.env.company.nomenclature_id:
            # Logic for products
            product = self.env['product.product'].search(['|', ('barcode', '=', barcode), ('default_code', '=', barcode)], limit=1)
            if product:
                if self._check_product(product):
                    return

            product_packaging = self.env['product.packaging'].search([('barcode', '=', barcode)], limit=1)
            if product_packaging.product_id:
                if self._check_product(product_packaging.product_id,product_packaging.qty):
                    return

            # Logic for packages in source location
            if self.move_line_ids:
                package_source = self.env['stock.quant.package'].search([('name', '=', barcode), ('location_id', 'child_of', self.location_id.id)], limit=1)
                if package_source:
                    if self._check_source_package(package_source):
                        return

            # Logic for packages in destination location
            package = self.env['stock.quant.package'].search([('name', '=', barcode), '|', ('location_id', '=', False), ('location_id','child_of', self.location_dest_id.id)], limit=1)
            if package:
                if self._check_destination_package(package):
                    return

            # Logic only for destination location
            location = self.env['stock.location'].search(['|', ('name', '=', barcode), ('barcode', '=', barcode)], limit=1)
            if location and location.search_count([('id', '=', location.id), ('id', 'child_of', self.location_dest_id.ids)]):
                if self._check_destination_location(location):
                    return
        else:
            parsed_result = self.env.company.nomenclature_id.parse_barcode(barcode)
            if parsed_result['type'] in ['weight', 'product']:
                if parsed_result['type'] == 'weight':
                    product_barcode = parsed_result['base_code']
                    qty = parsed_result['value']
                else: #product
                    product_barcode = parsed_result['code']
                    qty = 1.0
                product = self.env['product.product'].search(['|', ('barcode', '=', product_barcode), ('default_code', '=', product_barcode)], limit=1)
                if product:
                    if self._check_product(product, qty):
                        return

            if parsed_result['type'] == 'package':
                if self.move_line_ids:
                    package_source = self.env['stock.quant.package'].search([('name', '=', parsed_result['code']), ('location_id', 'child_of', self.location_id.id)], limit=1)
                    if package_source:
                        if self._check_source_package(package_source):
                            return
                package = self.env['stock.quant.package'].search([('name', '=', parsed_result['code']), '|', ('location_id', '=', False), ('location_id','child_of', self.location_dest_id.id)], limit=1)
                if package:
                    if self._check_destination_package(package):
                        return

            if parsed_result['type'] == 'location':
                location = self.env['stock.location'].search(['|', ('name', '=', parsed_result['code']), ('barcode', '=', parsed_result['code'])], limit=1)
                if location and location.search_count([('id', '=', location.id), ('id', 'child_of', self.location_dest_id.ids)]):
                    if self._check_destination_location(location):
                        return

            product_packaging = self.env['product.packaging'].search([('barcode', '=', parsed_result['code'])], limit=1)
            if product_packaging.product_id:
                if self._check_product(product_packaging.product_id,product_packaging.qty):
                    return

        return {'warning': {
            'title': _('Wrong barcode'),
            'message': _('The barcode "%(barcode)s" doesn\'t correspond to a proper product, package or location.') % {'barcode': barcode}
        }}

    def open_picking(self):
        """ method to open the form view of the current record
        from a button on the kanban view
        """
        self.ensure_one()
        view_id = self.env.ref('stock.view_picking_form').id
        return {
            'name': _('Open picking form'),
            'res_model': 'stock.picking',
            'view_mode': 'form',
            'view_id': view_id,
            'type': 'ir.actions.act_window',
            'res_id': self.id,
        }

    def open_picking_client_action(self):
        """ method to open the form view of the current record
        from a button on the kanban view
        """
        self.ensure_one()
        use_form_handler = self.env['ir.config_parameter'].sudo().get_param('stock_barcode.use_form_handler')
        if use_form_handler:
            view_id = self.env.ref('stock.view_picking_form').id
            return {
                'name': _('Open picking form'),
                'res_model': 'stock.picking',
                'view_mode': 'form',
                'view_id': view_id,
                'type': 'ir.actions.act_window',
                'res_id': self.id,
            }
        else:
            action = self.env.ref('stock_barcode.stock_barcode_picking_client_action').read()[0]
            params = {
                'model': 'stock.picking',
                'picking_id': self.id,
                'nomenclature_id': [self.env.company.nomenclature_id.id],
            }
            return dict(action, target='fullscreen', params=params)


class StockPickingType(models.Model):

    _inherit = 'stock.picking.type'

    def get_action_picking_tree_ready_kanban(self):
        return self._get_action('stock_barcode.stock_picking_action_kanban')
