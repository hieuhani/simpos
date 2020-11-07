odoo.define('simpos_pos_order_network_printer.multiprint', function (require) {
    "use strict";
    var models = require('point_of_sale.models');
    var NetworkPrinter = require('simpos_pos_order_network_printer.Printer');

    // The override of create_printer needs to happen after its declaration in
    // pos_restaurant. We need to make sure that this code is executed after the
    // multiprint file in pos_restaurant.
    require('pos_restaurant.multiprint');

    models.load_fields("restaurant.printer", ["network_printer_ip"]);
    
    var _super_posmodel = models.PosModel.prototype;

    models.PosModel = models.PosModel.extend({
        create_printer: function (config) {
            if (config.printer_type === "network_printer") {
                return new NetworkPrinter(config.network_printer_ip);
            } else {
                return _super_posmodel.create_printer.apply(this, arguments);
            }
        },
    });
});