odoo.define('simpos_pos_order_network_printer.screens', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var QWeb = core.qweb;
    screens.ReceiptScreenWidget.include({
        printOrder: async function() {
            var self = this
            var order = this.pos.get_order();
            var printers = this.pos.printers;
            var orderlines = order.get_orderlines();
            var order_print_data = {
                table_no: order.table_no,
                vibration_card: order.vibration_card,
                name: order.name,
                formatted_validation_date: order.formatted_validation_date,
                orderlines: [],
            }
            for(var i = 0; i < printers.length; i++){
                orderlines.forEach(function (line) {
                    var category_ids = printers[i].config.product_categories_ids
                    if (category_ids.length === 0 || self.pos.db.is_product_in_category(category_ids,line.product.id)) {
                        order_print_data.orderlines.push({
                            qty: line.quantity,
                            note: line.note,
                            product_name: line.product.display_name,
                            default_code: line.product.default_code,
                        })
                    }
                });
                if (order_print_data.orderlines.length > 0) {
                    var kitchen_ticket = QWeb.render('KitchenTicket', order_print_data);
                    await printers[i].print_receipt(kitchen_ticket);
                }
            }
        }
    });
});