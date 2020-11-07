odoo.define('stock_barcode.inventory_client_action', function (require) {
'use strict';

var core = require('web.core');
var ClientAction = require('stock_barcode.ClientAction');
var ViewsWidget = require('stock_barcode.ViewsWidget');

var _t = core._t;

var InventoryClientAction = ClientAction.extend({
    custom_events: _.extend({}, ClientAction.prototype.custom_events, {
        validate: '_onValidate',
        cancel: '_onCancel',
        show_information: '_onShowInformation',
        picking_print_inventory: '_onPrintInventory'
    }),

    init: function (parent, action) {
        this._super.apply(this, arguments);
        this.commands['O-BTN.validate'] = this._validate.bind(this);
        this.commands['O-BTN.cancel'] = this._cancel.bind(this);
        this.mode = 'inventory';
        if (! this.actionParams.inventoryId) {
            this.actionParams.inventoryId = action.context.active_id;
            this.actionParams.model = 'stock.inventory';
        }
    },

    willStart: function () {
        var self = this;
        var res = this._super.apply(this, arguments);
        res.then(function () {
            if (self.currentState.group_stock_multi_locations === false) {
                self.mode = 'no_multi_locations';
            } else  {
                self.mode = 'inventory';
            }
            if (self.currentState.state === 'done') {
                self.mode = 'done';
            }
        });
        return res;
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * @override
     */
    _getWriteableFields: function () {
        return ['product_qty', 'location_id.id', 'prod_lot_id.id'];
    },


    /**
     * @override
     */
     _getPageFields: function (options) {
         if (options && options.line) {
            return [
                ['location_id', 'location_id.id'],
                ['location_name', 'location_id.display_name'],
            ];
         }
         return [
             ['location_id', 'location_ids.0.id'],
             ['location_name', 'location_ids.0.display_name'],
         ];
     },

    /**
     * @override
     */
    _getLines: function (state) {
        return state.line_ids;
    },

    /**
     * @override
     */
    _lot_name_used: function (product, lot_name) {
        var lines = this._getLines(this.currentState);
        for (var i = 0; i < lines.length; i++) {
            var line = lines[i];
            if (line.product_qty !== 0 && line.product_id.id === product.id &&
                line.prod_lot_id && line.prod_lot_id[1] === lot_name) {
                return true;
            }
        }
        return false;
    },

    /**
     * @override
     */
    _makeNewLine: function (product, barcode, qty_done, package_id) {
        var virtualId = this._getNewVirtualId();
        var currentPage = this.pages[this.currentPageIndex];
        var newLine = {
            'inventory_id': this.currentState.id,
            'product_id': {
                'id': product.id,
                'display_name': product.display_name,
                'barcode': barcode,
                'tracking': product.tracking,
            },
            'product_barcode': barcode,
            'display_name': product.display_name,
            'product_qty': qty_done,
            'theoretical_qty': 0,
            'product_uom_id': product.uom_id[0],
            'location_id': {
                'id': currentPage.location_id,
                'name': currentPage.location_name,
            },
            'package_id': package_id,
            'state': 'confirm',
            'reference': this.name,
            'virtual_id': virtualId,
        };
        return newLine;
    },

    /**
     * @override
     */
    _applyChanges: function (changes) {
        var formattedCommands = [];
        var cmd = [];
        for (var i in changes) {
            var line = changes[i];

            // Lines needs to be updated
            if (line.id) {
                cmd = [1, line.id, {
                    'product_qty' : line.product_qty,
                    'prod_lot_id': line.prod_lot_id && line.prod_lot_id[0],
                    'package_id': line.package_id && line.package_id[0],
                }];
                formattedCommands.push(cmd);
            // Lines needs to be created
            } else {
                cmd = [0, 0, {
                    'product_id':  line.product_id.id,
                    'product_uom_id': line.product_uom_id,
                    'product_qty': line.product_qty,
                    'location_id': line.location_id.id,
                    'prod_lot_id': line.prod_lot_id && line.prod_lot_id[0],
                    'package_id': line.package_id && line.package_id[0],
                    'dummy_id': line.virtual_id,
                }];
                formattedCommands.push(cmd);
            }
        }
        if (formattedCommands.length > 0){
            var params = {
                'mode': 'write',
                'model_name': this.actionParams.model,
                'record_id': this.currentState.id,
                'write_vals': formattedCommands,
                'write_field': 'line_ids',
            };

            return this._rpc({
                'route': '/stock_barcode/get_set_barcode_view_state',
                'params': params,
            });
        } else {
            return Promise.reject();
        }
    },

    /**
     * @override
     */
    _showInformation: function () {
        var self = this;
        return this._super.apply(this, arguments).then(function () {
            if (self.ViewsWidget) {
                self.ViewsWidget.destroy();
            }
            self.linesWidget.destroy();
            self.ViewsWidget = new ViewsWidget(
                self,
                'stock.inventory',
                'stock_barcode.stock_inventory_barcode2',
                {},
                {currentId :self.currentState.id},
                'readonly'
            );
            self.ViewsWidget.appendTo(self.$('.o_content'));
        });
    },

    /**
     * Makes the rpc to `action_validate`.
     * This method could open a wizard so it takes care of removing/adding the "barcode_scanned"
     * event listener.
     *
     * @private
     * @returns {Promise}
     */
     _validate: function (ev) {
        var self = this;
        this.mutex.exec(function () {
            return self._save().then(function () {
                self._rpc({
                    'model': self.actionParams.model,
                    'method': 'action_validate',
                    'args': [[self.currentState.id]],
                }).then(function () {
                    self.do_notify(_t("Success"), _t("The inventory adjustment has been validated"));
                    return self.trigger_up('exit');
                });
            });
        });
    },

    /**
     * Makes the rpc to `action_cancel`.
     *
     * @private
     */
    _cancel: function () {
        var self = this;
        this.mutex.exec(function () {
            return self._save().then(function () {
                return self._rpc({
                    'model': self.actionParams.model,
                    'method': 'action_cancel_draft',
                    'args': [[self.currentState.id]],
                }).then(function () {
                    self.do_notify(_t("Cancel"), _t("The inventory adjustment has been cancelled"));
                    self.trigger_up('exit');
                });
            });
        });
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handles the `validate` OdooEvent.
     *
     * @private
     * @param {OdooEvent} ev
     */
     _onValidate: function (ev) {
         ev.stopPropagation();
         this._validate();
     },

    /**
    * Handles the `cancel` OdooEvent.
    *
    * @private
    * @param {OdooEvent} ev
    */
    _onCancel: function (ev) {
        ev.stopPropagation();
        this._cancel();
    },

    /**
     * Handles the `print_inventory` OdooEvent. It makes an RPC call
     * to the method 'do_action' on a 'ir.action_window' with the additional context
     * needed
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onPrintInventory: function (ev) {
        ev.stopPropagation();
        var self = this;
        this.mutex.exec(function () {
            return self._save().then(function () {
                return self.do_action(self.currentState.actionReportInventory, {
                    'additional_context': {
                        'active_id': self.actionParams.id,
                        'active_ids': [self.actionParams.inventoryId],
                        'active_model': 'stock.inventory',
                    }
                });
            });
        });
    },

});

core.action_registry.add('stock_barcode_inventory_client_action', InventoryClientAction);

return InventoryClientAction;

});
