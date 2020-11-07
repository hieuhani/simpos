odoo.define('stock_barcode.ViewsWidget', function (require) {
'use strict';

var Widget = require('web.Widget');
var FormView = require('web.FormView');
var KanbanView = require('web.KanbanView');

var ViewsWidget = Widget.extend({
    'template': 'stock_barcode_views_widget',
    events: {
        'click .o_save': '_onClickSave',
        'click .o_discard': '_onClickDiscard',
    },

    init: function (clientAction, model, view, defaultValue, params, mode, view_type) {
        this._super.apply(this, arguments);
        this.model = model;
        this.view = view;
        this.params = params || {};
        this.defaultValue = defaultValue;
        this.mode = mode || 'edit';
        this.view_type = view_type || 'form';
    },


    willStart: function () {
        var self = this;
        return this._super().then(function () {
            return self._getViewController().then(function (controller) {
                self.controller = controller;
            });
        });
    },

    start: function () {
        var self = this;
        var def = this.controller.appendTo(this.$el.filter('.o_barcode_generic_view'));
        return Promise.all([def, this._super()]).then(function () {
            self.$el.find('.o_form_view').addClass('o_xxs_form_view');
            self.trigger_up('listen_to_barcode_scanned', {'listen': false});
        });
    },
    /**
     * @override
     */
    destroy: function () {
        this.trigger_up('listen_to_barcode_scanned', {'listen': true});
        this._super();
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Create a controller for a given model, view and record.
     *
     * @private
     */
    _getViewController: function () {
        var self = this;
        var views = [[false, 'form']];
        if (self.view_type === "kanban") {
            views = [[false, 'kanban']];
        }
        var views_ref = {
            form: {form_view_ref: this.view},
            kanban: {kanban_view_ref: this.view},
        };
        var context = _.extend({}, this.defaultValue, this.context || {}, views_ref[self.view_type]);
        return this.loadViews(this.model, context, views).then(function (fieldsViews) {
            var params = _.extend(self.params || {}, {
                context: context,
                modelName: self.model,
                userContext: self.getSession().user_context,
                mode: self.mode,
                withControlPanel: false,
            });
            var View;
            if (self.view_type === 'form') {
                View = new FormView(fieldsViews.form, params);
            } else if (self.view_type === 'kanban') {
                View = new KanbanView(fieldsViews.kanban, params);
            }
            return View.getController(self);
        });
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handles the click on the `confirm button`.
     *
     * @private
     * @param {MouseEvent} ev
     */
    _onClickSave: function (ev) {
        ev.stopPropagation();
        var self = this;
        var def = this.controller.saveRecord(this.controller.handle, {stayInEdit: true, reload: false});
        def.then(function () {
            var record = self.controller.model.get(self.controller.handle);
            self.trigger_up('reload', {'record': record});
        });
    },

    /**
     * Handles the click on the `discard button`.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickDiscard: function (ev) {
        ev.stopPropagation();
        this.trigger_up('reload');
    },
});

return ViewsWidget;

});
