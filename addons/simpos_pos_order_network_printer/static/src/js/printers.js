odoo.define("simpos_pos_order_network_printer.Printer", function (require) {
  "use strict";
  var core = require("web.core");
  var PrinterMixin = require("point_of_sale.Printer").PrinterMixin;
  var NetworkPrinter = core.Class.extend(PrinterMixin, {
    init: function (ip) {
      PrinterMixin.init.call(this, arguments);
      this.ip = ip;
    },

    /**
     * @override
     */
    send_printing_job: function (img) {
      if (typeof simpos !== "undefined") {
        var ip = this.ip;
        javascript: simpos.printRestaurantOrder(ip + "SIMPOS" + img);
      }
    },
    _onIoTActionFail: function () {},
    _onIoTActionResult: function () {},
  });
  return NetworkPrinter;
});
