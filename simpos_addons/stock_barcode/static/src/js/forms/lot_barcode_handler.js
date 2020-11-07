odoo.define('stock_barcode.LotBarcodeHandler', function (require) {
"use strict";

var field_registry = require('web.field_registry');
var AbstractField = require('web.AbstractField');

var LotBarcodeHandler = AbstractField.extend({
    init: function() {
        this._super.apply(this, arguments);

        this.trigger_up('activeBarcode', {
            name: this.name,
            fieldName: 'stock_barcode_lot_line_ids',
            quantity: 'qty_done',
            setQuantityWithKeypress: true,
            commands: {
                'O-CMD.MAIN-MENU': _.bind(this.do_action, this, 'stock_barcode.stock_barcode_action_main_menu', {clear_breadcrumbs: true}),
                barcode: '_barcodeAddX2MQuantity',
            }
        });
    },
});

field_registry.add('lot_barcode_handler', LotBarcodeHandler);

});
