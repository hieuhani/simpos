from odoo import http, _
from odoo.http import request


class StockBarcodeController(http.Controller):

    @http.route('/stock_barcode/scan_from_main_menu', type='json', auth='user')
    def main_menu(self, barcode, **kw):
        """ Receive a barcode scanned from the main menu and return the appropriate
            action (open an existing / new picking) or warning.
        """
        ret_open_picking = self.try_open_picking(barcode)
        if ret_open_picking:
            return ret_open_picking

        ret_open_picking_type = self.try_open_picking_type(barcode)
        if ret_open_picking_type:
            return ret_open_picking_type

        if request.env.user.has_group('stock.group_stock_multi_locations'):
            ret_new_internal_picking = self.try_new_internal_picking(barcode)
            if ret_new_internal_picking:
                return ret_new_internal_picking

        if request.env.user.has_group('stock.group_stock_multi_locations'):
            return {'warning': _('No picking or location corresponding to barcode %(barcode)s') % {'barcode': barcode}}
        else:
            return {'warning': _('No picking corresponding to barcode %(barcode)s') % {'barcode': barcode}}

    def try_open_picking_type(self, barcode):
        """ If barcode represent a picking type, open a new
        picking with this type
        """
        picking_type = request.env['stock.picking.type'].search([
            ('barcode', '=', barcode),
        ], limit=1)
        if picking_type:
            # Find source and destination Locations
            location_dest_id, location_id = picking_type.warehouse_id._get_partner_locations()
            if picking_type.default_location_src_id:
                location_id = picking_type.default_location_src_id
            if picking_type.default_location_dest_id:
                location_dest_id = picking_type.default_location_dest_id

            # Create and confirm the picking
            picking = request.env['stock.picking'].create({
                'user_id': False,
                'picking_type_id': picking_type.id,
                'location_id': location_id.id,
                'location_dest_id': location_dest_id.id,
                'immediate_transfer': True,
            })

            return self.get_action(picking.id)
        return False

    def try_open_picking(self, barcode):
        """ If barcode represents a picking, open it
        """
        corresponding_picking = request.env['stock.picking'].search([
            ('name', '=', barcode),
        ], limit=1)
        if corresponding_picking:
            return self.get_action(corresponding_picking.id)
        return False

    def try_new_internal_picking(self, barcode):
        """ If barcode represents a location, open a new picking from this location
        """
        corresponding_location = request.env['stock.location'].search([
            ('barcode', '=', barcode),
            ('usage', '=', 'internal')
        ], limit=1)
        if corresponding_location:
            internal_picking_type = request.env['stock.picking.type'].search([('code', '=', 'internal')])
            warehouse = corresponding_location.get_warehouse()
            if warehouse:
                internal_picking_type = internal_picking_type.filtered(lambda r: r.warehouse_id == warehouse)
            dest_loc = corresponding_location
            while dest_loc.location_id and dest_loc.location_id.usage == 'internal':
                dest_loc = dest_loc.location_id
            if internal_picking_type:
                # Create and confirm an internal picking
                picking = request.env['stock.picking'].create({
                    'picking_type_id': internal_picking_type[0].id,
                    'user_id': False,
                    'location_id': corresponding_location.id,
                    'location_dest_id': dest_loc.id,
                    'immediate_transfer': True,
                })
                picking.action_confirm()

                return self.get_action(picking.id)
            else:
                return {'warning': _('No internal operation type. Please configure one in warehouse settings.')}
        return False

    def get_action(self, picking_id):
        """
        return the action to display the picking. We choose between the traditionnal
        form view and the new client action
        """
        use_form_handler = request.env['ir.config_parameter'].sudo().get_param('stock_barcode.use_form_handler')
        if use_form_handler:
            view_id = request.env.ref('stock.view_picking_form').id
            return {
                'action': {
                    'name': _('Open picking form'),
                    'res_model': 'stock.picking',
                    'view_mode': 'form',
                    'view_id': view_id,
                    'views': [(view_id, 'form')],
                    'type': 'ir.actions.act_window',
                    'res_id': picking_id,
                }
            }
        else:
            action = request.env.ref('stock_barcode.stock_barcode_picking_client_action').read()[0]
            params = {
                'model': 'stock.picking',
                'picking_id': picking_id,
            }
            action = dict(action, target='fullscreen', params=params)
            action['context'] = {'active_id': picking_id}
            action = {'action': action}
            return action

    @http.route('/stock_barcode/rid_of_message_demo_barcodes', type='json', auth='user')
    def rid_of_message_demo_barcodes(self, **kw):
        """ Edit the main_menu client action so that it doesn't display the 'print demo barcodes sheet' message """
        action = request.env.ref('stock_barcode.stock_barcode_action_main_menu')
        action and action.sudo().write({'params': {'message_demo_barcodes': False}})

    @http.route('/stock_barcode/get_set_barcode_view_state', type='json', auth='user')
    def get_set_barcode_view_state(self, model_name, record_id, mode, write_field=None, write_vals=None):
        if mode != 'read':
            request.env[model_name].browse(record_id).write({write_field: write_vals})
        return request.env[model_name].browse(record_id).get_barcode_view_state()

