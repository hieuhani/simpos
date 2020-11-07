odoo.define('stock_barcode.RunningTourActionHelper', function(require) {
"use strict";

var RunningTourActionHelper = require('web_tour.RunningTourActionHelper');

RunningTourActionHelper.include({
    _scan: function (element, barcode) {
        odoo.__DEBUG__.services['web.core'].bus.trigger('barcode_scanned', barcode, element);
    },
    scan: function(barcode, element) {
        this._scan(this._get_action_values(element), barcode);
    },
});

});
