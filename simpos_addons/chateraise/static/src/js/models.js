odoo.define('chateraise.models', function (require) {
    "use strict";

    var models = require('point_of_sale.models');

    var _super_order = models.Order.prototype;

    models.Order = models.Order.extend({
        export_for_printing: function () {
            var receipt = _super_order.export_for_printing.apply(this, arguments);
            var client = this.get('client');
            receipt.customer = client ? { name: client.name, phone: client.phone } : null
            if (receipt.name) {
                var parts = receipt.name.split(' ')
                receipt.order_no = parts[parts.length - 1]
            }
            receipt.date_hour = String(receipt.date.hour).padStart(2, '0') + ':' + String(receipt.date.minute).padStart(2, '0') + ' ' + receipt.date.date + '/' + (receipt.date.month + 1) + '/' + receipt.date.year
            receipt.company.street = this.pos.company.street
            return receipt;
        },
    });
});
