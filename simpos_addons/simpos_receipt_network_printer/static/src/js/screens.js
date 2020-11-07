odoo.define('simpos_receipt_network_printer.screens', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');

    screens.ReceiptScreenWidget.include({
        print: function() {
            var self = this;
            var order = self.pos.get_order().export_for_printing();
            var data = {
                company: {
                    phone: order.company.phone,
                    contact_address: order.company.contact_address,
                },
                client: order.client,
                cashier: order.cashier,
                name: order.name,
                change: self.chrome.format_currency_no_symbol(order.change),
                total_with_tax: self.chrome.format_currency_no_symbol(order.total_with_tax),
                paymentlines: order.paymentlines.map(function (line) {
                    return {
                        amount: self.chrome.format_currency_no_symbol(line.amount),
                        payment_method: line.payment_method,
                    }
                })
            }
        },
    });
});