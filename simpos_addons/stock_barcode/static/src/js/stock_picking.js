odoo.define('stock_barcode.picking_kanban', function (require) {
'use strict';

var KanbanRecord = require('web.KanbanRecord');

KanbanRecord.include({
    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------
    
    /**
     * @override
     * @private
     */
    _openRecord: function () {
        if (this.modelName === 'stock.picking') {
            this.$('button').first().click();
        } else {
            this._super.apply(this, arguments);
        }
    }
});

});