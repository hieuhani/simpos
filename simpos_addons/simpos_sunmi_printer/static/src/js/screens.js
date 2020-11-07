odoo.define('simpos_receipt_network_printer.screens', function (require) {
    "use strict";

    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var QWeb = core.qweb;

    screens.ReceiptScreenWidget.include({
        handle_auto_print: function() {
            if (this.should_auto_print() && !this.pos.get_order().is_to_email()) {
                this.print(2);
                if (this.should_close_immediately()){
                    this.click_next();
                }
            } else {
                this.lock_screen(false);
            }
        },
        print: function (time) {
            var receipt = QWeb.render('OrderReceipt', this.get_receipt_render_env());
            var self = this;
            
            return this.htmlToImg(receipt).then(function (result) {
                if (typeof simpos === 'undefined') {
                    self.print_web();
                } else {
                    if (time === 2) {
                        javascript: simpos.printDoubleReceipt(result);
                    } else {
                        javascript: simpos.printReceipt(result);
                    }
                }
                
                
                self.pos.get_order()._printed = true;
                if (self.printOrder) {
                    self.printOrder()
                }
            });
        },
        htmlToImg: function (receipt) {
            var self = this;
            $('.pos-receipt-print').html(receipt);
            var promise = new Promise(function (resolve, reject) {
                self.receipt = $('.pos-receipt-print .pos-receipt');
                html2canvas(self.receipt[0], {
                    onparsed: function (queue) {
                        queue.stack.ctx.height = Math.ceil(self.receipt.outerHeight() + self.receipt.offset().top);
                    },
                    onrendered: function (canvas) {
                        $('.pos-receipt-print').empty();
                        resolve(self.process_canvas(canvas));
                    }
                })
            });
            return promise;
        },
        process_canvas: function (canvas) {
            return canvas.toDataURL('image/jpeg').replace('data:image/jpeg;base64,', '');
        },
    });
});