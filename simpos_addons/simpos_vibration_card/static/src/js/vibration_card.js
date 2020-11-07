odoo.define('simpos_vibration_card.vibration_card', function (require) {
"use strict";

var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var gui = require("point_of_sale.gui");
var _t   = core._t;
var PopupWidget = require("point_of_sale.popups");

var _super_order = models.Order.prototype;

models.Order = models.Order.extend({
    initialize: function(attr, options) {
        _super_order.initialize.call(this,attr,options);
        this.vibration_card = this.vibration_card || "";
        this.table_no = this.table_no || "";
    },
    set_vibration_card: function(vibration_card){
        this.vibration_card = vibration_card;
        this.trigger('change',this);
    },
    get_vibration_card: function(){
        return this.vibration_card;
    },
    set_table_no: function(table_no){
        this.table_no = table_no;
        this.trigger('change',this);
    },
    get_table_no: function(){
        return this.table_no;
    },
    export_as_JSON: function() {
        var json = _super_order.export_as_JSON.call(this);
        json.vibration_card = this.vibration_card;
        json.table_no = this.table_no;
        return json;
    },
    export_for_printing: function(){
        var receipt = _super_order.export_for_printing.apply(this,arguments);
        receipt.vibration_card = this.get_vibration_card();
        receipt.table_no = this.get_table_no();
        return receipt;
    },
    init_from_JSON: function(json) {
        _super_order.init_from_JSON.apply(this,arguments);
        this.vibration_card = json.vibration_card;
        this.table_no = json.table_no;
    },
});

var OrderlineVibrationCardButton = screens.ActionButtonWidget.extend({
    template: 'OrderlineVibrationCardButton',
    vibrationCardNumber: function() {
        if (this.pos.get_order()) {
            return this.pos.get_order().vibration_card;
        }
    },
    button_click: function(){
        var order = this.pos.get_order();
        var self = this;
        if (order) {
            this.gui.show_popup("vibration_card_selector", {
                title: _t('Set Vibration Card Number'),
                value:   order.get_vibration_card(),
                list: [1,2,3,4,5,6,7,8,9,10],
                is_selected: function (item) {
                    return item === self.vibrationCardNumber();
                },
                confirm: function(vibration_card) {
                    order.set_vibration_card(vibration_card);
                    self.renderElement();
                },
            });
        }
    },
});

screens.define_action_button({
    'name': 'orderline_vibration_card',
    'widget': OrderlineVibrationCardButton,
}, {
    'after': 'discount',
});


var OrderlineTableNoButton = screens.ActionButtonWidget.extend({
    template: 'OrderlineTableNoButton',
    tableNo: function() {
        if (this.pos.get_order()) {
            return this.pos.get_order().table_no;
        }
    },
    button_click: function(){
        var order = this.pos.get_order();
        var self = this;
        if (order) {
            this.gui.show_popup("vibration_card_selector", {
                title: _t('Set Table'),
                value:   order.get_table_no(),
                list: [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20],
                is_selected: function (item) {
                    return item === self.tableNo();
                },
                confirm: function(tableNo) {
                    order.set_table_no(tableNo);
                    self.renderElement();
                },
            });
        }
    },
});

screens.define_action_button({
    'name': 'orderline_table_no',
    'widget': OrderlineTableNoButton,
}, {
    'after': 'orderline_vibration_card',
});
var SelectVibrationCardPopupWidget = PopupWidget.extend({
    template: "SelectVibrationCardPopupWidget",
    show: function(options){
        options = options || {};
        this._super(options);

        this.list = options.list || [];
        this.is_selected = options.is_selected || function (item) { return false; };
        this.renderElement();
    },
    click_item : function(event) {
        this.gui.close_popup();
        if (this.options.confirm) {
            this.options.confirm.call(self,parseInt($(event.target).data('item-index')));
        }
    },
    click_confirm: function(){
        this.gui.close_popup();
        if (this.options.confirm) {
            this.options.confirm.call(self, undefined);
        }
    },
})

gui.define_popup({name: "vibration_card_selector", widget: SelectVibrationCardPopupWidget});

return {
    OrderlineVibrationCardButton: OrderlineVibrationCardButton,
    OrderlineTableNoButton: OrderlineTableNoButton,
}
});
