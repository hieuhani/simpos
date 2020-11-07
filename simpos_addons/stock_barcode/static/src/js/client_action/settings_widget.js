odoo.define('stock_barcode.SettingsWidget', function (require) {
'use strict';

var Widget = require('web.Widget');

var SettingsWidget = Widget.extend({
    'template': 'stock_barcode_settings_widget',
    events: {
        'click .o_validate': '_onClickValidate',
        'click .o_cancel': '_onClickCancel',
        'click .o_print_picking': '_onClickPrintPicking',
        'click .o_print_delivery_slip': '_onClickPrintDeliverySlip',
        'click .o_print_barcodes_zpl': '_onClickPrintBarcodesZpl',
        'click .o_print_barcodes_pdf': '_onClickPrintBarcodesPdf',
        'click .o_print_inventory': '_onClickPrintInventory',
        'click .o_scrap': '_onClickScrap',
    },

    init: function (parent, model, mode, allow_scrap) {
        this._super.apply(this, arguments);
        // Set the model. According to the model, some buttons will be displayed or hidden.
        this.model = model;
        this.mode = mode;
        this.allow_scrap = allow_scrap
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handles the click on the `validate button`.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickValidate: function (ev) {
        ev.stopPropagation();
        this.trigger_up('validate');
    },

    /**
     * Handles the click on the `cancel button`.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickCancel: function (ev) {
        ev.stopPropagation();
        this.trigger_up('cancel');
    },

    /**
     * Handles the click on the `print picking` button. This is specific to the `stock.picking`
     * model.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickPrintPicking: function (ev) {
        ev.stopPropagation();
        this.trigger_up('picking_print_picking');
    },

    /**
     * Handles the click on the `print delivery slip` button. This is specific to the
     * `stock.picking` model.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickPrintDeliverySlip: function (ev) {
        ev.stopPropagation();
        this.trigger_up('picking_print_delivery_slip');
    },

    /**
     * Handles the click on the `print barcodes zpl` button. This is specific to the
     * `stock.picking` model.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickPrintBarcodesZpl: function (ev) {
        ev.stopPropagation();
        this.trigger_up('picking_print_barcodes_zpl');
    },

    /**
     * Handles the click on the `print barcodes pdf` button. This is specific to the
     * `stock.picking` model.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickPrintBarcodesPdf: function (ev) {
        ev.stopPropagation();
        this.trigger_up('picking_print_barcodes_pdf');
    },

    /**
     * Handles the click on the `print inventory` button. This is specific to the
     * `stock.inventory` model.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickPrintInventory: function (ev) {
        ev.stopPropagation();
        this.trigger_up('picking_print_inventory');
    },

    /**
     * Handles the click on the `scrap button`. This is specific to the `stock.picking` model.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickScrap: function (ev) {
        ev.stopPropagation();
        this.trigger_up('picking_scrap');
    },
});

return SettingsWidget;

});

