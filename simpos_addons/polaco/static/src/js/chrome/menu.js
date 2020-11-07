odoo.define('polaco.Menu', function (require) {
    "use strict";
    var session = require('web.session');
    var Menu = require('web.Menu');
    
    return Menu.include({
        events: _.extend({}, Menu.prototype.events, {
            'click .o_mobile_menu_toggle': '_onOpenMobileMenu',
            'click .in_mobile_menu': '_onOpenMobileMenu',
        }),
        start: function () {
    
            return this._super.apply(this, arguments);
        },
        _onOpenMobileMenu: function(ev) {
            ev.preventDefault();
            this.$section_placeholder.toggleClass('in_mobile_menu');
        },
    });
});
