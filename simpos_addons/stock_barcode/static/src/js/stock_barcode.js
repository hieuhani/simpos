odoo.define('stock_barcode.MainMenu', function (require) {
"use strict";

var AbstractAction = require('web.AbstractAction');
var core = require('web.core');
var Dialog = require('web.Dialog');
var Session = require('web.session');

var _t = core._t;

var MainMenu = AbstractAction.extend({
    contentTemplate: 'main_menu',

    events: {
        "click .button_operations": function(){
            this.do_action('stock_barcode.stock_picking_type_action_kanban');
        },
        "click .button_inventory": function(){
            this.open_inventory();
        },
        "click .o_stock_barcode_menu": function(){
            this.trigger_up('toggle_fullscreen');
            this.trigger_up('show_home_menu');
        },
    },

    init: function(parent, action) {
        this._super.apply(this, arguments);
        this.message_demo_barcodes = action.params.message_demo_barcodes;
    },

    willStart: function () {
        var self = this;
        return this._super.apply(this, arguments).then(function () {
            return Session.user_has_group('stock.group_stock_multi_locations').then(function (has_group) {
                self.group_stock_multi_location = has_group;
            });
        });
    },

    start: function() {
        var self = this;
        core.bus.on('barcode_scanned', this, this._onBarcodeScanned);
        return this._super().then(function() {
            if (self.message_demo_barcodes) {
                self.setup_message_demo_barcodes();
            }
        });
    },

    destroy: function () {
        core.bus.off('barcode_scanned', this, this._onBarcodeScanned);
        this._super();
    },

    setup_message_demo_barcodes: function() {
        var self = this;
        // Upon closing the message (a bootstrap alert), propose to remove it once and for all
        self.$(".message_demo_barcodes").on('close.bs.alert', function () {
            var message = _t("Do you want to permanently remove this message ?\
                It won't appear anymore, so make sure you don't need the barcodes sheet or you have a copy.");
            var options = {
                title: _t("Don't show this message again"),
                size: 'medium',
                buttons: [
                    { text: _t("Remove it"), close: true, classes: 'btn-primary', click: function() {
                        Session.rpc('/stock_barcode/rid_of_message_demo_barcodes');
                    }},
                    { text: _t("Leave it"), close: true }
                ],
            };
            Dialog.confirm(self, message, options);
        });
    },

    _onBarcodeScanned: function(barcode) {
        var self = this;
        if (!$.contains(document, this.el)) {
            return;
        }
        Session.rpc('/stock_barcode/scan_from_main_menu', {
            barcode: barcode,
        }).then(function(result) {
            if (result.action) {
                self.do_action(result.action);
            } else if (result.warning) {
                self.do_warn(result.warning);
            }
        });
    },

    open_inventory: function() {
        var self = this;
        return this._rpc({
                model: 'stock.inventory',
                method: 'open_new_inventory',
            })
            .then(function(result) {
                self.do_action(result);
            });
    },
});

core.action_registry.add('stock_barcode_main_menu', MainMenu);

return {
    MainMenu: MainMenu,
};

});
