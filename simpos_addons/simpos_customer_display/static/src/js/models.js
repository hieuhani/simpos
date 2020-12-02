odoo.define('simpos_customer_display_baumkuchen.models', function (require) {
  "use strict";
  var models = require('point_of_sale.models');
  var core = require('web.core');
  var QWeb = core.qweb;

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
      render_html_for_customer_facing_display: function () {
        var self = this;
        var order = this.get_order();
        var rendered_html = this.config.customer_facing_display_html;


        // If we're using an external device like the IoT Box, we
        // cannot get /web/image?model=product.product because the
        // IoT Box is not logged in and thus doesn't have the access
        // rights to access product.product. So instead we'll base64
        // encode it and embed it in the HTML.
        var get_image_promises = [];

        if (order) {
            order.get_orderlines().forEach(function (orderline) {
                var product = orderline.product;
                var image_url = window.location.origin + '/web/image?model=product.product&field=image_128&id=' + product.id;

                // only download and convert image if we haven't done it before
                if (! product.image_base64) {
                    get_image_promises.push(self._convert_product_img_to_base64(product, image_url));
                }
            });
        }
        if (!order || order && order.orderlines.length === 0) {
          return Promise.resolve(this.config.customer_welcome_html);
        }

        // when all images are loaded in product.image_base64
        return Promise.all(get_image_promises).then(function () {
            var rendered_order_lines = "";
            var rendered_payment_lines = "";
            var order_total_with_tax = self.chrome.format_currency(0);

            if (order) {
                rendered_order_lines = QWeb.render('CustomerFacingDisplayOrderLines', {
                    'orderlines': order.get_orderlines(),
                    'widget': self.chrome,
                });
                rendered_payment_lines = QWeb.render('CustomerFacingDisplayPaymentLines', {
                    'order': order,
                    'widget': self.chrome,
                });
                order_total_with_tax = self.chrome.format_currency(order.get_total_with_tax());
            }

            var $rendered_html = $(rendered_html);
            $rendered_html.find('.pos_orderlines_list').html(rendered_order_lines);
            $rendered_html.find('.pos-total').find('.pos_total-amount').html(order_total_with_tax);
            var pos_change_title = $rendered_html.find('.pos-change_title').text();
            $rendered_html.find('.pos-paymentlines').html(rendered_payment_lines);
            $rendered_html.find('.pos-change_title').text(pos_change_title);

            // prop only uses the first element in a set of elements,
            // and there's no guarantee that
            // customer_facing_display_html is wrapped in a single
            // root element.
            rendered_html = _.reduce($rendered_html, function (memory, current_element) {
                return memory + $(current_element).prop('outerHTML');
            }, ""); // initial memory of ""

            rendered_html = QWeb.render('CustomerFacingDisplayHead', {
                origin: window.location.origin
            }) + rendered_html;
            return rendered_html;
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
