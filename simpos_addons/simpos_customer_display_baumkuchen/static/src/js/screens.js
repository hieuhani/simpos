odoo.define("simpos_customer_display.screens", function(require) {
    "use strict";

    var OrderWidget = require("point_of_sale.screens").OrderWidget;

    OrderWidget.include({
        set_value: function(val) {
            var order = this.pos.get_order();
            if (order.get_selected_orderline()) {
                this._super(val);
                this.pos.simpos_send_current_order_to_customer_facing_display();
            }
        },
    });
});
