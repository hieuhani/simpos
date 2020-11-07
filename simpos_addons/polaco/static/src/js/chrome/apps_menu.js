odoo.define('polaco.AppsMenu', function (require) {
    "use strict";

    var AppsMenu = require('web.AppsMenu');

    return AppsMenu.include({
        init: function (parent, menuData) {
            this._super.apply(this, arguments);
            this._apps = _.map(menuData.children, function (appMenuData) {
                return {
                    actionID: parseInt(appMenuData.action.split(',')[1]),
                    menuID: appMenuData.id,
                    name: appMenuData.name,
                    xmlID: appMenuData.xmlid,
                    web_icon_data: 'data:image/png;base64,' + appMenuData.web_icon_data,
                };
            });
        },
    });
});
