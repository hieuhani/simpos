odoo.define('simpos_customer_display_baumkuchen.chrome', function (require) {
    "use strict";

    var PosBaseWidget = require('point_of_sale.BaseWidget');
    var chrome = require('point_of_sale.chrome');
    var core = require('web.core');
    var _t = core._t;
    var ajax = require('web.ajax');

    /* User interface for distant control over the Client display on the IoT Box */
    // The boolean posbox_supports_display (in devices.js) will allow interaction to the IoT Box on true, prevents it otherwise
    // We don't want the incompatible IoT Box to be flooded with 404 errors on arrival of our many requests as it triggers losses of connections altogether
    var CustomerDisplayScreenWidget = PosBaseWidget.extend({
        template: 'ClientScreenWidget',

        change_status_display: function(status) {
            var msg = ''
            if (status === 'success') {
                this.$('.js_warning').addClass('oe_hidden');
                this.$('.js_disconnected').addClass('oe_hidden');
                this.$('.js_connected').removeClass('oe_hidden');
            } else if (status === 'warning') {
                this.$('.js_disconnected').addClass('oe_hidden');
                this.$('.js_connected').addClass('oe_hidden');
                this.$('.js_warning').removeClass('oe_hidden');
                msg = _t('Connected, Not Owned');
            } else {
                this.$('.js_warning').addClass('oe_hidden');
                this.$('.js_connected').addClass('oe_hidden');
                this.$('.js_disconnected').removeClass('oe_hidden');
                msg = _t('Disconnected')
                if (status === 'not_found') {
                    msg = _t('Client Screen Unsupported. Please upgrade the IoT Box')
                }
            }

            this.$('.oe_customer_display_text').text(msg);
        },

        start: function(){
            this.show();
            var self = this;
            this.$el.click(function(){
                self.pos.simpos_send_current_order_to_customer_facing_display()
            });
        },
    });

    var Chrome = chrome.Chrome.include({
        build_widgets: function () {
            this.append_widgets([{
                'name': 'customer_display',
                'widget': CustomerDisplayScreenWidget,
                'append': '.pos-rightheader',
            }], {'after': 'screen_status'});
            return this._super()
        },
        append_widgets(new_widgets, options) {
            if (!(new_widgets instanceof Array)) {
                new_widgets = [new_widgets];
            }
            var widgets = this.widgets
            var index = this.widgets.length;
            if (options.before) {
                for (var i = 0; i < widgets.length; i++) {
                    if (widgets[i].name === options.before) {
                        index = i;
                        break;
                    }
                }
            } else if (options.after) {
                for (var i = 0; i < widgets.length; i++) {
                    if (widgets[i].name === options.after) {
                        index = i + 1;
                    }
                }
            }
            widgets.splice.apply(widgets, [index, 0].concat(new_widgets));
        },
        update_customer_screen: function(html) {
            return ajax.rpc("/simpos_customer_display/update_html", {
                html: html,
            });
        },
    });
    return {
        Chrome: Chrome,
        CustomerDisplayScreenWidget: CustomerDisplayScreenWidget,
    };
    });
