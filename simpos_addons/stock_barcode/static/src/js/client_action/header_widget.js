odoo.define('stock_barcode.HeaderWidget', function (require) {
'use strict';

var Widget = require('web.Widget');

var HeaderWidget = Widget.extend({
    'template': 'stock_barcode_header_widget',
    events: {
        'click .o_exit': '_onClickExit',
        'click .o_show_information': '_onClickShowInformation',
        'click .o_show_settings': '_onClickShowSettings',
        'click .o_close': '_onClickClose',
    },

    init: function (parent) {
        this._super.apply(this, arguments);
        this.title = parent.title;
    },

    //--------------------------------------------------------------------------
    // Public
    //--------------------------------------------------------------------------

    /**
     * Toggle the header between two display modes: `init` and `specialized`.
     * - in init mode: exit, informations and settings button are displayed;
     * - in settings mode: close button is displayed.
     *
     * @param {string} mode: "init" or "settings".
     */
    toggleDisplayContext: function (mode) {
        var $showInformation = this.$('.o_show_information');
        var $showSettings = this.$('.o_show_settings');
        var $close = this.$('.o_close');
        var $exit = this.$('.o_exit');

        if (mode === 'init') {
            $showInformation.toggleClass('o_hidden', false);
            $showSettings.toggleClass('o_hidden', false);
            $close.toggleClass('o_hidden', true);
            $exit.toggleClass('o_invisible', false);
        } else if (mode === 'specialized') {
            $showInformation.toggleClass('o_hidden', true);
            $showSettings.toggleClass('o_hidden', true);
            $close.toggleClass('o_hidden', false);
            $exit.toggleClass('o_invisible', true);
        }
    },

    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handles the click on the `exit button`.
     *
     * @private
     * @param {MouseEvent} ev
     */
    _onClickExit: function (ev) {
        ev.stopPropagation();
        this.trigger_up('exit');
    },

    /**
     * Handles the click on the `settings button`.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickShowInformation: function (ev) {
        ev.stopPropagation();
        this.trigger_up('show_information');
    },

    /**
     * Handles the click on the `settings button`.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickShowSettings: function (ev) {
        ev.stopPropagation();
        this.trigger_up('show_settings');
    },

    /**
     * Handles the click on the `close button`.
     *
     * @private
     * @param {MouseEvent} ev
     */
     _onClickClose: function (ev) {
        ev.stopPropagation();
        this.trigger_up('reload');
    },
});

return HeaderWidget;

});
