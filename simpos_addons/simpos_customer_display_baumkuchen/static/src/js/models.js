odoo.define('simpos_customer_display_baumkuchen.models', function (require) {
    "use strict";
    var models = require('point_of_sale.models');

    var posmodel_super = models.PosModel.prototype;
    models.PosModel = models.PosModel.extend({
        after_load_server_data: function() {
            var self = this;
            return posmodel_super.after_load_server_data.apply(this, arguments).then(function () {
                self.on('change:selectedOrder', self.simpos_send_current_order_to_customer_facing_display, self);
            });
        },
        simpos_send_current_order_to_customer_facing_display: function() {
            var self = this;
            this.render_html_for_customer_facing_display().then(function (rendered_html) {
                self.chrome.update_customer_screen(rendered_html);
            });
        },
    });

    var PaymentlineSuper = models.Paymentline;
    models.Paymentline = models.Paymentline.extend({
        set_amount: function(value){
            PaymentlineSuper.prototype.set_amount.apply(this, arguments);
            this.pos.simpos_send_current_order_to_customer_facing_display();
        },
    });

    var posorder_super = models.Order.prototype;
    models.Order = models.Order.extend({
        initialize: function(attributes,options){
            var parent = posorder_super.initialize.apply(this, arguments);
            this.paymentlines.on('add', this.pos.simpos_send_current_order_to_customer_facing_display, this.pos);
            this.paymentlines.on('remove', this.pos.simpos_send_current_order_to_customer_facing_display, this.pos);
            return parent
        },
        add_product: function(product, options){
            posorder_super.add_product.apply(this, arguments);
            this.pos.simpos_send_current_order_to_customer_facing_display();
        },
    });
});
