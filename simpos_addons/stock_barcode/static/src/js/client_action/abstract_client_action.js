odoo.define('stock_barcode.ClientAction', function (require) {
'use strict';

var concurrency = require('web.concurrency');
var core = require('web.core');
var AbstractAction = require('web.AbstractAction');
var BarcodeParser = require('barcodes.BarcodeParser');

var ViewsWidget = require('stock_barcode.ViewsWidget');
var HeaderWidget = require('stock_barcode.HeaderWidget');
var LinesWidget = require('stock_barcode.LinesWidget');
var SettingsWidget = require('stock_barcode.SettingsWidget');
var utils = require('web.utils');

var _t = core._t;

function isChildOf(locationParent, locationChild) {
    return _.str.startsWith(locationChild.parent_path, locationParent.parent_path);
}

var ClientAction = AbstractAction.extend({
    custom_events: {
        show_information: '_onShowInformation',
        show_settings: '_onShowSettings',
        exit: '_onExit',
        edit_line: '_onEditLine',
        add_line: '_onAddLine',
        next_page: '_onNextPage',
        previous_page: '_onPreviousPage',
        reload: '_onReload',
        listen_to_barcode_scanned: '_onListenToBarcodeScanned',
    },

    init: function (parent, action) {
        this._super.apply(this, arguments);

        // We keep a copy of the action's parameters in order to make the calls to `this._getState`.
        this.actionParams = {
            pickingId: action.params.picking_id,
            inventoryId: action.params.inventory_id,
            model: action.params.model,
        };

        // Temp patch for the height issue
        this.actionManager = parent;
        this.actionManagerInitHeight = this.actionManager.$el.height;
        this.actionManager.$el.height('100%');

        this.mutex = new concurrency.Mutex();

        this.commands = {
            'O-CMD.PREV': this._previousPage.bind(this),
            'O-CMD.NEXT': this._nextPage.bind(this),
            'O-CMD.PAGER-FIRST': this._firstPage.bind(this),
            'O-CMD.PAGER-LAST': this._lastPage.bind(this),
            'O-CMD.MAIN-MENU': this._onMainMenu.bind(this),
        };

        // State variables
        this.initialState = {};     // Will be filled by getState.
        this.currentState = {};     // Will be filled by getState and updated when operations occur.
        this.pages = [];            // Groups separating the pages.
        this.currentPageIndex = 0;  // The displayed page index related to `this.pages`.
        this.groups = {};
        this.title = this.actionParams.model === 'stock.inventory' ? // title of
            _('Inventory ') : ''; // the main navbar

        this.mode = undefined;      // supported mode: `receipt`, `internal`, `delivery`, `inventory`
        this.scannedLocation = undefined;
        this.scannedLines = [];
        this.scannedLocationDest = undefined;

        // Steps
        this.currentStep = undefined;
        this.stepsByName = {};
        for (var m in this) {
            if (typeof this[m] === 'function' && _.str.startsWith(m, '_step_')) {
                this.stepsByName[m.split('_step_')[1]] = this[m].bind(this);
            }
        }
    },

    willStart: function () {
        var self = this;
        var recordId = this.actionParams.pickingId || this.actionParams.inventoryId;
        return Promise.all([
            self._super.apply(self, arguments),
            self._getState(recordId),
            self._getProductBarcodes(),
            self._getLocationBarcodes()
        ]).then(function () {
            return self._loadNomenclature();
        });
    },

    start: function () {
        var self = this;
        this.$('.o_content').addClass('o_barcode_client_action');
        core.bus.on('barcode_scanned', this, this._onBarcodeScannedHandler);

        this.headerWidget = new HeaderWidget(this);
        this.settingsWidget = new SettingsWidget(this, this.actionParams.model, this.mode, this.allow_scrap);
        return this._super.apply(this, arguments).then(function () {
            return Promise.all([
                self.headerWidget.prependTo(self.$('.o_content')),
                self.settingsWidget.appendTo(self.$('.o_content'))
            ]).then(function () {
                self.settingsWidget.do_hide();
                return self._save();
            }).then(function () {
                return self._reloadLineWidget(self.currentPageIndex);
            });
        });
    },

    destroy: function () {
        core.bus.off('barcode_scanned', this, this._onBarcodeScannedHandler);
        this._super();
    },

    //--------------------------------------------------------------------------
    // Private
    //--------------------------------------------------------------------------

    /**
     * Make an rpc to get the state and afterwards set `this.currentState` and `this.initialState`.
     * It also completes `this.title`. If the `state` argument is passed, use it instead of doing
     * an extra RPC.
     *
     * @private
     * @param {Object} [recordID] Id of the active picking or inventory adjustment.
     * @param {Object} [state] state
     * @return {Promise}
     */
    _getState: function (recordId, state) {
        var self = this;
        var def;
        if (state) {
            def = Promise.resolve(state);
        } else {
            def = this._rpc({
                'route': '/stock_barcode/get_set_barcode_view_state',
                'params': {
                    'record_id': recordId,
                    'mode': 'read',
                    'model_name': self.actionParams.model,
                },
            });
        }
        return def.then(function (res) {
            self.currentState = res[0];
            self.initialState = $.extend(true, {}, res[0]);
            self.title += self.initialState.name;
            self.groups = {
                'group_stock_multi_locations': self.currentState.group_stock_multi_locations,
                'group_tracking_owner': self.currentState.group_tracking_owner,
                'group_tracking_lot': self.currentState.group_tracking_lot,
                'group_production_lot': self.currentState.group_production_lot,
                'group_uom': self.currentState.group_uom,
            };
            self.show_entire_packs = self.currentState.show_entire_packs;

            return res;
        });
    },

    /**
     * Make an rpc to get the products barcodes and afterwards set `this.productsByBarcode`.
     *
     * @private
     * @return {Promise}
     */
    _getProductBarcodes: function () {
        var self = this;
        return this._rpc({
            'model': 'product.product',
            'method': 'get_all_products_by_barcode',
            'args': [],
        }).then(function (res) {
            self.productsByBarcode = res;
        });
    },

    _loadNomenclature: function () {
        // barcode nomenclature
        this.barcodeParser = new BarcodeParser({'nomenclature_id': this.currentState.nomenclature_id});
        if (this.barcodeParser) {
            return this.barcodeParser.load();
        }
    },

    _isProduct: function (barcode) {
        var parsed = this.barcodeParser.parse_barcode(barcode);
        if (parsed.type === 'weight') {
            var product = this.productsByBarcode[parsed.base_code];
            // if base barcode is not a product, error will be thrown in _step_product()
            if (product) {
                product.qty = parsed.value;
            }
            return product;
        } else {
            return this.productsByBarcode[barcode];
        }
    },

    /**
     * Make an rpc to get the locations barcodes and afterwards set `this.locationsByBarcode`.
     *
     * @private
     * @return {Promise}
     */
    _getLocationBarcodes: function () {
        var self = this;
        return this._rpc({
            'model': 'stock.location',
            'method': 'get_all_locations_by_barcode',
            'args': [],
        }).then(function (res) {
            self.locationsByBarcode = res;
        });
    },

    /**
     * Return an unique location, even if the model have a x2m field.
     * Could also return undefined if it's from an inventory adjustment with no
     * locations.
     *
     * @returns {Object|undefined}
     */
    _getLocationId: function () {
        return this.currentState.location_id || this.currentState.location_ids[0];
    },

    /**
     * Return an array of objects representing the lines displayed in `this.linesWidget`.
     * To implement by specialized client action.
     * actions.
     *
     * @abstract
     * @private
     * @returns {Array} array of objects (lines) to be displayed
     */
    _getLines: function (state) {  // jshint ignore:line
        return [];
    },

    /**
    *
     * @returns {Boolean} True if the lot_name for product is already present.
     */
    _lot_name_used: function (product, lot_name) {
        return false;
    },

    /**
     * Return an array of string used to group the lines into pages. The string are keys the
     * `lines` objects.
     * To implement by specialized client actions.
     *
     * @abstract
     * @private
     * @returns {Array} array of fields to group (a group is actually a page)
     */
    _getPageFields: function () {
        return [];
    },

    /**
     * Return an array string representing the keys of `lines` objects the client action is
     * allowed to write on. It ll be used by `this._compareStates` to generate the write commands.
     * To implement by specialized client actions.
     *
     * @abstract
     * @private
     * @returns {Array} array of fields that can be scanned or modified
     */
    _getWriteableFields: function () {
        return [];
    },

    /**
     * Will compare `this._getLines(this.initialState)` and `this._getLines(this.currentState)` to
     * get created or modified lines. The result of this method will be used by `this._applyChanges`
     * to actually make the RPC call that will write the update values to the database.
     *
     * New lines are always pushed at the end of `this._getLines(this.currentState)`, so we assume
     * all lines having a greater index than the higher one in `_getLines(this.initialState)` are
     * new.
     *
     * @private
     * @returns {Array} array of objects representing the new or modified lines
     */
    _compareStates: function () {
        var modifiedMovelines = [];
        var writeableFields = this._getWriteableFields();

        // Get the modified lines.
        for (var i = 0; i < this._getLines(this.initialState).length; i++) {
            var currentLine = this._getLines(this.currentState)[i];
            var initialLine = this._getLines(this.initialState)[i];
            for (var j = 0; j < writeableFields.length; j++) {
                var writeableField = writeableFields[j];
                if (!_.isEqual(utils.into(initialLine, writeableField), utils.into(currentLine, writeableField))) {
                    modifiedMovelines.push(currentLine);
                    break;
                }
            }
        }

        // Get the new lines.
        if (this._getLines(this.initialState).length < this._getLines(this.currentState).length) {
            modifiedMovelines = modifiedMovelines.concat(
                this._getLines(this.currentState).slice(this._getLines(this.initialState).length)
            );
        }
        return modifiedMovelines;
    },

    /**
     * Helper used in `this._onShowInformation`. This should be overidden by specialized client
     * actions to display something, usually a form view. What this method does is display
     * `this.headerWidget` into specialized mode and return the save promise.
     *
     * @private
     * @returns {Promise}
     */
    _showInformation: function () {
        var self = this;
        return this.mutex.exec(function () {
            self.headerWidget.toggleDisplayContext('specialized');
            return self._save();
        });
    },

    /**
     * Build a list of command from `changes` and make the `write` rpc.
     * To implement by specialized client actions.
     *
     * @private
     * @param {Array} changes lines in the current record needing to be created or updated
     * @returns {Promise} resolved when the rpc is done ; failed if nothing has to be updated
     */
    _applyChanges: function (changes) {  // jshint ignore:line
        return Promise.resolve();
    },

    /**
     * This method will return a list of pages with grouped by source and destination locations from
     * `this.currentState.lines`. We may add pages not related to the lines in the following cases:
     *   - if there isn't any lines yet, we create a group with the default source and destination
     *     location of the picking
     *   - if the user scanned a different source location than the one in the current page, we'll
     *     create a page with the scanned source location and the default destination location of
     *     the picking.
     *
     * We do not need to apply the second logic in the case the user scans a destination location
     * in a picking client action as the lines will be impacted before calling this method.
     *
     * This method will *NOT* update `this.currentPageIndex`.
     *
     * @private
     * @returns {Array} array of objects representing the pages
     */
    _makePages: function () {
        var pages = [];
        var defaultPage = {};
        var self = this;
        if (this._getLines(this.currentState).length) {
            // from https://stackoverflow.com/a/25551041
            var groups = _.groupBy(this._getLines(this.currentState), function (line) {
                return _.map(self._getPageFields({line: true}), function (field) {
                    return utils.into(line, field[1]);
                }).join('#');
            });
            pages = _.map(groups, function (group) {
                var page = {};
                _.map(self._getPageFields({line: true}), function (field) {
                    page[field[0]] = utils.into(group[0], field[1]);
                });
                page.lines = group;
                return page;
            });
        } else {
            _.each(self._getPageFields(), function (field) {
                defaultPage[field[0]] = utils.into(self.currentState, field[1]);
            });
            defaultPage.lines = [];
        }
        pages = _.sortBy(pages, 'location_name');

        // Create a new page if the pair scanned location / default destination location doesn't
        // exist yet and the scanned location isn't the one of current page.
        var currentPage = this.pages[this.currentPageIndex];
        if (this.scanned_location && currentPage.location_id !== this.scanned_location.id) {
            var alreadyInPages = _.find(pages, function (page) {
                return page.location_id === self.scanned_location.id &&
                    (self.actionParams.model === 'stock.inventory' || page.location_dest_id === self.currentState.location_dest_id.id);
            });
            if (! alreadyInPages) {
                var pageValues = {
                    location_id: this.scanned_location.id,
                    location_name: this.scanned_location.display_name,
                    lines: [],
                };
                if (self.actionParams.model === 'stock.picking') {
                    pageValues.location_dest_id = this.currentState.location_dest_id.id;
                    pageValues.location_dest_name = this.currentState.location_dest_id.display_name;
                }
                pages.push(pageValues);
            }
        }

        if (pages.length === 0) {
            pages.push(defaultPage);
        }

        return pages;
    },

    /**
     * String identifying lines created in the client actions.

     * @private
     * @returns {string}
     */
    _getNewVirtualId: function () {
        return _.uniqueId('virtual_line_');
    },

    /**
     * Helper to create a new line.
     * To implement by specialized client actions.
     *
     * @abstract
     * @private
     * @param {Object} product product on the new line
     * @param {Object} barcode barcode of the product
     * @param {Object} qty_done
     * @returns {object} created line
     */
    _makeNewLine: function (product, barcode, qty_done) {  // jshint ignore:line
        return {};
    },

    /**
     * Refresh the displayed page/lines on the screen. It destroys and reinstantiate
     * `this.linesWidget`.
     *
     * @private
     * @param {Object} pageIndex page index
     * @returns {Promise}
     */
     _reloadLineWidget: function (pageIndex) {
        var self = this
        if (this.linesWidget) {
            this.linesWidget.destroy();
        }
        var nbPages = this.pages.length;
        var preparedPage = $.extend(true, {}, this.pages[pageIndex]);
        this.linesWidget = new LinesWidget(this, preparedPage, pageIndex, nbPages);
        return this.linesWidget.appendTo(this.$('.o_content')).then(function() {
            // In some cases, we want to restore the GUI state of the linesWidget
            // (on a reload not calling _endBarcodeFlow)
            if (self.linesWidgetState) {
                self.linesWidget.highlightLocation(self.linesWidgetState.highlightLocationSource);
                self.linesWidget.highlightDestinationLocation(self.linesWidgetState.highlightLocationDestination);
                self.linesWidget._toggleScanMessage(self.linesWidgetState.scan_message);
                delete self.linesWidgetState;
            }
            if (self.lastScannedPackage) {
                self.linesWidget.highlightPackage(self.lastScannedPackage);
                delete self.lastScannedPackage;
            }
        });
    },

    /**
     * Main method to make the changes done in the client action persistent in the database through
     * RPC calls. It'll compare `this.currentState` to `this.initialState`, make an RPC with the
     * commands generated by the previous step, re-read the `this.model` state, re-prepare the
     * groups and move `this.currentIndex` to the page of the same group. It also tries to not make
     * an RPC if there aren't changes to save.
     *
     * @private
     * @param {Object} params.forceReload boolean to know if we want to force a read even if no
     *   changes were found.
     * @param {Object} params.new_location_id new source location on the line
     * @param {Object} params.new_location_dest_id new destinationlocation on the line
     * @returns {Promise}
     */
    _save: function (params) {
        params = params || {};
        var self = this;

        // keep a reference to the currentGroup
        var currentPage = this.pages[this.currentPageIndex];
        if (! currentPage) {
            currentPage = {};
        }
        var currentLocationId = currentPage.location_id;
        var currentLocationDestId = currentPage.location_dest_id;


        // make a write with the current changes
        var recordId = this.actionParams.pickingId || this.actionParams.inventoryId;
        var applyChangesDef =  this._applyChanges(this._compareStates()).then(function (state) {
            // Fixup virtual ids in `self.scanned_lines`
            var virtual_ids_to_fixup = _.filter(self._getLines(state[0]), function (line) {
                return line.dummy_id;
            });
            _.each(virtual_ids_to_fixup, function (line) {
                if (self.scannedLines.indexOf(line.dummy_id) !== -1) {
                    self.scannedLines = _.without(self.scannedLines, line.dummy_id);
                    self.scannedLines.push(line.id);
                }
            });

            return self._getState(recordId, state);
        }, function (error) {
            // on server error, let error be displayed and do nothing
            if (error !== undefined) {
                return Promise.reject();
            }
            if (params.forceReload) {
                return self._getState(recordId);
            } else {
                return Promise.resolve();
            }
        });

        return applyChangesDef.then(function () {
            self.pages = self._makePages();

            var newPageIndex = _.findIndex(self.pages, function (page) {
                return page.location_id === (params.new_location_id || currentLocationId) &&
                    (self.actionParams.model === 'stock.inventory' ||
                    page.location_dest_id === (params.new_location_dest_id || currentLocationDestId));
            }) || 0;
            if (newPageIndex === -1) {
                newPageIndex = 0;
            }
            self.currentPageIndex = newPageIndex;
        });
    },

    /**
     * Handles the actions when a barcode is scanned, mainly by executing the appropriate step. If
     * we need to change page after the step is executed, it calls `this._save` and
     * `this._reloadLineWidget` with the new page index. Afterwards, we apply the appropriate logic
     * to `this.linesWidget`.
     *
     * @private
     * @param {String} barcode the scanned barcode
     * @returns {Promise}
     */
    _onBarcodeScanned: function (barcode) {
        var self = this;
        return this.stepsByName[this.currentStep || 'source'](barcode, []).then(function (res) {
            /* We check now if we need to change page. If we need to, we'll call `this.save` with the
             * `new_location_id``and `new_location_dest_id` params so `this.currentPage` will
             * automatically be on the new page. We need to change page when we scan a source or a
             * destination location ; if the source or destination is different than the current
             * page's one.
             */
            var prom = Promise.resolve();
            var currentPage = self.pages[self.currentPageIndex];
            if (
                (self.scanned_location &&
                 ! self.scannedLines.length &&
                 self.scanned_location.id !== currentPage.location_id
                ) ||
                (self.scanned_location_dest &&
                 self.scannedLines.length &&
                 self.scanned_location_dest.id !== currentPage.location_dest_id
                )
            ) {
                // The expected locations are the scanned locations or the default picking locations.
                var expectedLocationId = self.scanned_location.id;
                var expectedLocationDestId;
                if (self.actionParams.model === 'stock.picking'){
                    expectedLocationDestId = self.scanned_location_dest &&
                                             self.scanned_location_dest.id ||
                                             self.currentState.location_dest_id.id;
                }

                if (expectedLocationId !== currentPage.location_id ||
                    expectedLocationDestId !== currentPage.location_dest_id
                ) {
                    var params = {
                        new_location_id: expectedLocationId,
                    };
                    if (expectedLocationDestId) {
                        params.new_location_dest_id = expectedLocationDestId;
                    }
                    prom = self._save(params).then(function () {
                        return self._reloadLineWidget(self.currentPageIndex);
                    });
                }
            }

            // Apply now the needed actions on the different widgets.
            if (self.scannedLines && self.scanned_location_dest) {
                self._endBarcodeFlow();
            }
            var linesActions = res.linesActions;
            var always = function () {
                _.each(linesActions, function (action) {
                    action[0].apply(self.linesWidget, action[1]);
                });
            };
            prom.then(always).guardedCatch(always);
            return prom;
        }, function (errorMessage) {
            self.do_warn(_t('Warning'), errorMessage);
        });
    },

    /**
     * Clear the states variables of the barcode flow. It should be used before beginning a new
     * flow.
     *
     * @private
     */
    _endBarcodeFlow: function () {
        this.scanned_location = undefined;
        this.scannedLines = [];
        this.scanned_location_dest = undefined;
        this.currentStep = undefined;
    },

    /**
     * Loop over the lines displayed in the current pages and try to find a candidate to increment
     * according to the `params` argument.
     *
     * @private
     * @param {Object} params information needed to find the candidate line
     * @param {Object} params.product
     * @param {Object} params.lot_id
     * @param {Object} params.lot_name
     * @returns object|boolean line or false if nothing match
     */
    _findCandidateLineToIncrement: function (params) {
        var product = params.product;
        var lotId = params.lot_id;
        var lotName = params.lot_name;
        var packageId = params.package_id;
        var currentPage = this.pages[this.currentPageIndex];
        var res = false;
        for (var z = 0; z < currentPage.lines.length; z++) {
            var lineInCurrentPage = currentPage.lines[z];
            if (lineInCurrentPage.product_id.id === product.id) {
                // If the line is empty, we could re-use it.
                if (lineInCurrentPage.virtual_id &&
                    (this.actionParams.model === 'stock.picking' &&
                     ! lineInCurrentPage.qty_done &&
                     ! lineInCurrentPage.product_uom_qty &&
                     ! lineInCurrentPage.lot_id &&
                     ! lineInCurrentPage.lot_name &&
                     ! lineInCurrentPage.package_id
                    ) ||
                    (this.actionParams.model === 'stock.inventory' &&
                     ! lineInCurrentPage.product_qty &&
                     ! lineInCurrentPage.prod_lot_id
                    )
                ) {
                    res = lineInCurrentPage;
                    break;
                }

                if (product.tracking === 'serial' &&
                    ((this.actionParams.model === 'stock.picking' &&
                      lineInCurrentPage.qty_done > 0
                     ) ||
                    (this.actionParams.model === 'stock.inventory' &&
                     lineInCurrentPage.product_qty > 0
                    ))) {
                    continue;
                }
                if (lineInCurrentPage.qty_done &&
                (this.actionParams.model === 'stock.inventory' ||
                lineInCurrentPage.location_dest_id.id === currentPage.location_dest_id) &&
                this.scannedLines.indexOf(lineInCurrentPage.virtual_id || lineInCurrentPage.id) === -1 &&
                lineInCurrentPage.qty_done >= lineInCurrentPage.product_uom_qty) {
                    continue;
                }
                if (lotId &&
                    ((this.actionParams.model === 'stock.picking' &&
                     lineInCurrentPage.lot_id &&
                     lineInCurrentPage.lot_id[0] !== lotId
                     ) ||
                    (this.actionParams.model === 'stock.inventory' &&
                     lineInCurrentPage.prod_lot_id &&
                     lineInCurrentPage.prod_lot_id[0] !== lotId
                    )
                )) {
                    continue;
                }
                if (lotName &&
                    lineInCurrentPage.lot_name &&
                    lineInCurrentPage.lot_name !== lotName
                    ) {
                    continue;
                }
                if (packageId &&
                    (! lineInCurrentPage.package_id ||
                    lineInCurrentPage.package_id[0] !== packageId[0])
                    ) {
                    continue;
                }
                if(lineInCurrentPage.product_uom_qty && lineInCurrentPage.qty_done >= lineInCurrentPage.product_uom_qty) {
                    continue;
                }
                res = lineInCurrentPage;
                break;
            }
        }
        return res;
    },

    /**
     * Main method called when a quantity needs to be incremented or a lot set on a line.
     * it calls `this._findCandidateLineToIncrement` first, if nothing is found it may use
     * `this._makeNewLine`.
     *
     * @private
     * @param {Object} params information needed to find the potential candidate line
     * @param {Object} params.product
     * @param {Object} params.lot_id
     * @param {Object} params.lot_name
     * @param {Object} params.package_id
     * @param {Object} params.result_package_id
     * @param {Boolean} params.doNotClearLineHighlight don't clear the previous line highlight when
     *     highlighting a new one
     * @return {object} object wrapping the incremented line and some other informations
     */
    _incrementLines: function (params) {
        var line = this._findCandidateLineToIncrement(params);
        var isNewLine = false;
        if (line) {
            // Update the line with the processed quantity.
            if (params.product.tracking === 'none' ||
                params.lot_id ||
                params.lot_name
                ) {
                if (this.actionParams.model === 'stock.picking') {
                    line.qty_done += params.product.qty || 1;
                    if (params.package_id) {
                        line.package_id = params.package_id;
                    }
                    if (params.result_package_id) {
                        line.result_package_id = params.result_package_id;
                    }
                } else if (this.actionParams.model === 'stock.inventory') {
                    line.product_qty += params.product.qty || 1;
                }
            }
        } else {
            isNewLine = true;
            // Create a line with the processed quantity.
            if (params.product.tracking === 'none' ||
                params.lot_id ||
                params.lot_name
                ) {
                line = this._makeNewLine(params.product, params.barcode, params.product.qty || 1, params.package_id, params.result_package_id);
            } else {
                line = this._makeNewLine(params.product, params.barcode, 0, params.package_id, params.result_package_id);
            }
            this._getLines(this.currentState).push(line);
            this.pages[this.currentPageIndex].lines.push(line);
        }
        if (this.actionParams.model === 'stock.picking') {
            if (params.lot_id) {
                line.lot_id = [params.lot_id];
            }
            if (params.lot_name) {
                line.lot_name = params.lot_name;
            }
        } else if (this.actionParams.model === 'stock.inventory') {
            if (params.lot_id) {
                line.prod_lot_id = [params.lot_id, params.lot_name];
            }
        }
        return {
            'id': line.id,
            'virtualId': line.virtual_id,
            'lineDescription': line,
            'isNewLine': isNewLine,
        };
    },

    // -------------------------------------------------------------------------
    // Private: flow steps
    // -------------------------------------------------------------------------

    /**
     * Handle what needs to be done when a source location is scanned.
     *
     * @param {string} barcode scanned barcode
     * @param {Object} linesActions
     * @returns {Promise}
     */
    _step_source: function (barcode, linesActions) {
        var self = this;
        this.currentStep = 'source';
        var errorMessage;

        /* Bypass this step in the following cases:
           - the picking is a receipt
           - the multi location group isn't active
        */
        var sourceLocation = this.locationsByBarcode[barcode];
        if (sourceLocation  && ! (this.mode === 'receipt' || this.mode === 'no_multi_locations')) {
            const locationId = this._getLocationId();
            if (locationId && !isChildOf(locationId, sourceLocation)) {
                errorMessage = _t('This location is not a child of the main location.');
                return Promise.reject(errorMessage);
            } else {
                // There's nothing to do on the state here, just mark `this.scanned_location`.
                linesActions.push([this.linesWidget.highlightLocation, [true]]);
                if (this.actionParams.model === 'stock.picking') {
                    linesActions.push([this.linesWidget.highlightDestinationLocation, [false]]);
                }
                this.scanned_location = sourceLocation;
                this.currentStep = 'product';
                return Promise.resolve({linesActions: linesActions});
            }
        }
        /* Implicitely set the location source in the following cases:
            - the user explicitely scans a product
            - the user explicitely scans a lot
            - the user explicitely scans a package
        */
        // We already set the scanned_location even if we're not sure the
        // following steps will succeed. They need scanned_location to work.
        this.scanned_location = {
            id: this.pages ? this.pages[this.currentPageIndex].location_id : this.currentState.location_id.id,
            display_name: this.pages ? this.pages[this.currentPageIndex].location_name : this.currentState.location_id.display_name,
        };
        linesActions.push([this.linesWidget.highlightLocation, [true]]);
        if (this.actionParams.model === 'stock.picking') {
            linesActions.push([this.linesWidget.highlightDestinationLocation, [false]]);
        }

        return this._step_product(barcode, linesActions).then(function (res) {
            return Promise.resolve({linesActions: res.linesActions});
        }, function (specializedErrorMessage) {
            delete self.scanned_location;
            self.currentStep = 'source';
            if (specializedErrorMessage){
                return Promise.reject(specializedErrorMessage);
            }
            var errorMessage = _t('You are expected to scan a source location.');
            return Promise.reject(errorMessage);
        });
    },

    /**
     * Handle what needs to be done when a product is scanned.
     *
     * @param {string} barcode scanned barcode
     * @param {Object} linesActions
     * @returns {Promise}
     */
    _step_product: function (barcode, linesActions) {
        var self = this;
        this.currentStep = 'product';
        var errorMessage;

        var product = this._isProduct(barcode);
        if (product) {
            if (product.tracking !== 'none') {
                this.currentStep = 'lot';
            }
            var res = this._incrementLines({'product': product, 'barcode': barcode});
            if (res.isNewLine) {
                if (this.actionParams.model === 'stock.inventory') {
                    // FIXME sle: add owner_id, prod_lot_id, owner_id, product_uom_id
                    return this._rpc({
                        model: 'product.product',
                        method: 'get_theoretical_quantity',
                        args: [
                            res.lineDescription.product_id.id,
                            res.lineDescription.location_id.id,
                        ],
                    }).then(function (theoretical_qty) {
                        res.lineDescription.theoretical_qty = theoretical_qty;
                        linesActions.push([self.linesWidget.addProduct, [res.lineDescription, self.actionParams.model]]);
                        self.scannedLines.push(res.id || res.virtualId);
                        return Promise.resolve({linesActions: linesActions});
                    });
                } else {
                    linesActions.push([this.linesWidget.addProduct, [res.lineDescription, this.actionParams.model]]);
                }
            } else {
                if (product.tracking === 'none') {
                    linesActions.push([this.linesWidget.incrementProduct, [res.id || res.virtualId, product.qty || 1, this.actionParams.model]]);
                } else {
                    linesActions.push([this.linesWidget.incrementProduct, [res.id || res.virtualId, 0, this.actionParams.model]]);
                }
            }
            this.scannedLines.push(res.id || res.virtualId);
            return Promise.resolve({linesActions: linesActions});
        } else {
            var success = function (res) {
                return Promise.resolve({linesActions: res.linesActions});
            };
            var fail = function (specializedErrorMessage) {
                self.currentStep = 'product';
                if (specializedErrorMessage){
                    return Promise.reject(specializedErrorMessage);
                }
                if (! self.scannedLines.length) {
                    if (self.groups.group_tracking_lot) {
                        errorMessage = _t("You are expected to scan one or more products or a package available at the picking's location");
                    } else {
                        errorMessage = _t('You are expected to scan one or more products.');
                    }
                    return Promise.reject(errorMessage);
                }

                var destinationLocation = self.locationsByBarcode[barcode];
                if (destinationLocation) {
                    return self._step_destination(barcode, linesActions);
                } else {
                    errorMessage = _t('You are expected to scan more products or a destination location.');
                    return Promise.reject(errorMessage);
                }
            };
            return self._step_lot(barcode, linesActions).then(success, function () {
                return self._step_package(barcode, linesActions).then(success, fail);
            });
        }
    },

    _step_package: function (barcode, linesActions) {
        // search stock.quant.packe location_id child_of main location ; name barcode
        // then make a search on quants package_id chilf of barcode
        // call a `_packageMakeNewLines` methode overriden by picking and inventory or increment the existing lines
        // fill linesActions + scannedLines
        // if scannedLines isn't set, the caller will warn
        if (! this.groups.group_tracking_lot) {
            return Promise.reject();
        }
        this.currentStep = 'product';
        var destinationLocation = this.locationsByBarcode[barcode];
        if (destinationLocation) {
            return Promise.reject();
        }

        var self = this;
        var search_read_quants = function () {
            return self._rpc({
                model: 'stock.quant.package',
                method: 'search_read',
                domain: [['name', '=', barcode], ['location_id', 'child_of', self.scanned_location.id]],
                limit: 1,
            });
        };
        var read_products = function (product) {
            return self._rpc({
                model: 'product.product',
                method: 'read',
                args: [product, ['barcode', 'display_name', 'uom_id', 'tracking']],
            });
        };
        var get_contained_quants = function (quant_ids) {
            return self._rpc({
                model: 'stock.quant',
                method: 'read',
                args: [quant_ids],
            });
        };
        var package_already_scanned = function (package_id, quants) {
            // FIXME: to improve, at the moment we consider that a package is already scanned if
            // there are as many lines having result_package_id set to the concerned package in
            // the current page as there should be if the package was scanned.
            var expectedNumberOfLines = quants.length;
            var currentNumberOfLines = 0;

            var qtyField = self.actionParams.model === 'stock.inventory' ? "product_qty" : "qty_done";
            var currentPage = self.pages[self.currentPageIndex];
            for (var i=0; i < currentPage.lines.length; i++) {
                var currentLine = currentPage.lines[i];
                // FIXME sle: float_compare?
                if (currentLine.package_id && currentLine.package_id[0] === package_id && currentLine[qtyField] > 0) {
                    currentNumberOfLines += 1;
                }
            }
            return currentNumberOfLines === expectedNumberOfLines;
        };
        return search_read_quants().then(function (packages) {
            if (packages.length) {
                self.lastScannedPackage = packages[0].name;
                return get_contained_quants(packages[0].quant_ids).then(function (quants) {
                    var packageAlreadyScanned = package_already_scanned(packages[0].id, quants);
                    if (packageAlreadyScanned) {
                        return Promise.reject(_t('This package is already scanned.'));
                    }
                    var products_without_barcode = _.map(quants, function (quant) {
                        if (! (quant.product_id[0] in self.productsByBarcode)) {
                            return quant.product_id[0];
                        }
                    });
                    return read_products(products_without_barcode).then(function (products_without_barcode) {
                        _.each(quants, function (quant) {
                            // FIXME sle: not optimal
                            var product_barcode = _.findKey(self.productsByBarcode, function (product) {
                                return product.id === quant.product_id[0];
                            });
                            var product = _.clone(self.productsByBarcode[product_barcode]);
                            if (! product) {
                                var product_key = _.findKey(products_without_barcode, function (product) {
                                    return product.id === quant.product_id[0];
                                });
                                product = products_without_barcode[product_key];
                            }
                            product.qty = quant.quantity;
                            var res = self._incrementLines({
                                product: product,
                                barcode: product_barcode,
                                product_barcode: product_barcode,
                                package_id: [packages[0].id, packages[0].display_name],
                                result_package_id: [packages[0].id, packages[0].display_name],
                                lot_id: quant.lot_id[0],
                                lot_name: quant.lot_id[1]
                            });
                            self.scannedLines.push(res.lineDescription.virtual_id);
                            if (! self.show_entire_packs) {
                                if (res.isNewLine) {
                                    linesActions.push([self.linesWidget.addProduct, [res.lineDescription, self.actionParams.model, true]]);
                                } else {
                                    linesActions.push([self.linesWidget.incrementProduct, [res.id || res.virtualId, quant.quantity, self.actionParams.model, true]]);
                                }
                            }
                        });
                        return Promise.resolve({linesActions: linesActions});
                    });
                });
            } else {
                return Promise.reject();
            }
        });
    },

    /**
     * Handle what needs to be done when a lot is scanned.
     *
     * @param {string} barcode scanned barcode
     * @param {Object} linesActions
     * @returns {Promise}
     */
    _step_lot: function (barcode, linesActions) {
        if (! this.groups.group_production_lot) {
            return Promise.reject();
        }
        this.currentStep = 'lot';
        var errorMessage;
        var self = this;

        // Bypass this step if needed.
        if (this.productsByBarcode[barcode]) {
            return this._step_product(barcode, linesActions);
        } else if (this.locationsByBarcode[barcode]) {
            return this._step_destination(barcode, linesActions);
        }

        var getProductFromLastScannedLine = function () {
            if (self.scannedLines.length) {
                var idOrVirtualId = self.scannedLines[self.scannedLines.length - 1];
                var line = _.find(self._getLines(self.currentState), function (line) {
                    return line.virtual_id === idOrVirtualId || line.id === idOrVirtualId;
                });
                if (line) {
                    var product = self.productsByBarcode[line.product_barcode || line.product_id.barcode];
                    // Product was added by lot or package
                    if (!product) {
                        return false;
                    }
                    product.barcode = line.product_barcode || line.product_id.barcode;
                    return product;
                }
            }
            return false;
        };

        var getProductFromCurrentPage = function () {
            return _.map(self.pages[self.currentPageIndex].lines, function (line) {
                return line.product_id.id;
            });
        };

        var getProductFromOperation = function () {
            return _.map(self._getLines(self.currentState), function (line) {
                return line.product_id.id;
            });
        };

        var readProduct = function (product_id) {
            var product_barcode = _.findKey(self.productsByBarcode, function (product) {
                return product.id === product_id;
            });

            if (product_barcode) {
                var product = self.productsByBarcode[product_barcode];
                product.barcode = product_barcode;
                return Promise.resolve(product);
            } else {
                return self._rpc({
                    model: 'product.product',
                    method: 'read',
                    args: [product_id],
                }).then(function (product) {
                    return Promise.resolve(product[0]);
                });
            }
        };

        var getLotInfo = function (lots) {
            var products_in_lots = _.map(lots, function (lot) {
                return lot.product_id[0];
            });
            var products = getProductFromLastScannedLine();
            var product_id = _.intersection(products, products_in_lots);
            if (! product_id.length) {
                products = getProductFromCurrentPage();
                product_id = _.intersection(products, products_in_lots);
            }
            if (! product_id.length) {
                products = getProductFromOperation();
                product_id = _.intersection(products, products_in_lots);
            }
            if (! product_id.length) {
                product_id = [lots[0].product_id[0]];
            }
            return readProduct(product_id[0]).then(function (product) {
                var lot = _.find(lots, function (lot) {
                    return lot.product_id[0] === product.id;
                });
                return Promise.resolve({lot_id: lot.id, lot_name: lot.display_name, product: product});
            });
        };

        var searchRead = function (barcode) {
            // Check before if it exists reservation with the lot.
            var line_with_lot = _.find(self.currentState.move_line_ids, function (line) {
                return (line.lot_id && line.lot_id[1] === barcode) || line.lot_name === barcode;
            });
            var def;
            if (line_with_lot) {
                def = Promise.resolve([{
                    name: barcode,
                    display_name: barcode,
                    id: line_with_lot.lot_id[0],
                    product_id: [line_with_lot.product_id.id, line_with_lot.display_name],
                }]);
            } else {
                def = self._rpc({
                    model: 'stock.production.lot',
                    method: 'search_read',
                    domain: [['name', '=', barcode]],
                });
            }
            return def.then(function (res) {
                if (! res.length) {
                    errorMessage = _t('The scanned lot does not match an existing one.');
                    return Promise.reject(errorMessage);
                }
                return getLotInfo(res);
            });
        };

        var create = function (barcode, product) {
            return self._rpc({
                model: 'stock.production.lot',
                method: 'create',
                args: [{
                    'name': barcode,
                    'product_id': product.id,
                    'company_id': self.currentState.company_id[0],
                }],
            });
        };

        var def;
        if (this.currentState.use_create_lots &&
            ! this.currentState.use_existing_lots) {
            // Do not create lot if product is not set. It could happens by a
            // direct lot scan from product or source location step.
            var product = getProductFromLastScannedLine();
            if (! product  || product.tracking === "none") {
                return Promise.reject();
            }
            def = Promise.resolve({lot_name: barcode, product: product});
        } else if (! this.currentState.use_create_lots &&
                    this.currentState.use_existing_lots) {
            def = searchRead(barcode);
        } else {
            def = searchRead(barcode).then(function (res) {
                return Promise.resolve(res);
            }, function (errorMessage) {
                var product = getProductFromLastScannedLine();
                if (product && product.tracking !== "none") {
                    return create(barcode, product).then(function (lot_id) {
                        return Promise.resolve({lot_id: lot_id, lot_name: barcode, product: product});
                    });
                }
                return Promise.reject(errorMessage);
            });
        }
        return def.then(function (lot_info) {
            var product = lot_info.product;
            if (product.tracking === 'serial' && self._lot_name_used(product, barcode)){
                errorMessage = _t('The scanned serial number is already used.');
                return Promise.reject(errorMessage);
            }
            var res = self._incrementLines({
                'product': product,
                'barcode': lot_info.product.barcode,
                'lot_id': lot_info.lot_id,
                'lot_name': lot_info.lot_name
            });
            if (res.isNewLine) {
                self.scannedLines.push(res.lineDescription.virtual_id);
                linesActions.push([self.linesWidget.addProduct, [res.lineDescription, self.actionParams.model]]);
            } else {
                if (self.scannedLines.indexOf(res.lineDescription.id) === -1) {
                    self.scannedLines.push(res.lineDescription.id || res.lineDescription.virtual_id);
                }
                linesActions.push([self.linesWidget.incrementProduct, [res.id || res.virtualId, 1, self.actionParams.model]]);
                linesActions.push([self.linesWidget.setLotName, [res.id || res.virtualId, barcode]]);
            }
            return Promise.resolve({linesActions: linesActions});
        });
    },

    /**
     * Handle what needs to be done when a destination location is scanned.
     *
     * @param {string} barcode scanned barcode
     * @param {Object} linesActions
     * @returns {Promise}
     */
    _step_destination: function (barcode, linesActions) {
        var errorMessage;

        // Bypass the step if needed.
        if (this.mode === 'delivery' || this.actionParams.model === 'stock.inventory') {
            this._endBarcodeFlow();
            return this._step_source(barcode, linesActions);
        }

        var destinationLocation = this.locationsByBarcode[barcode];
        if (! isChildOf(this.currentState.location_dest_id, destinationLocation)) {
            errorMessage = _t('This location is not a child of the main location.');
            return Promise.reject(errorMessage);
        } else {
            if (! this.scannedLines.length || this.mode === 'no_multi_locations') {
                if (this.groups.group_tracking_lot) {
                    errorMessage = _t("You are expected to scan one or more products or a package available at the picking's location");
                } else {
                    errorMessage = _t('You are expected to scan one or more products.');
                }
                return Promise.reject(errorMessage);
            }
            var self = this;
            // FIXME: remove .uniq() once the code is adapted.
            _.each(_.uniq(this.scannedLines), function (idOrVirtualId) {
                var currentStateLine = _.find(self._getLines(self.currentState), function (line) {
                    return line.virtual_id &&
                           line.virtual_id.toString() === idOrVirtualId ||
                           line.id  === idOrVirtualId;
                });
                if (currentStateLine.qty_done - currentStateLine.product_uom_qty >= 0) {
                    // Move the line.
                    currentStateLine.location_dest_id.id = destinationLocation.id;
                    currentStateLine.location_dest_id.display_name = destinationLocation.display_name;
                } else {
                    // Split the line.
                    var qty = currentStateLine.qty_done;
                    currentStateLine.qty_done -= qty;
                    var newLine = $.extend(true, {}, currentStateLine);
                    newLine.qty_done = qty;
                    newLine.location_dest_id.id = destinationLocation.id;
                    newLine.location_dest_id.display_name = destinationLocation.display_name;
                    newLine.product_uom_qty = 0;
                    var virtualId = self._getNewVirtualId();
                    newLine.virtual_id = virtualId;
                    delete newLine.id;
                    self._getLines(self.currentState).push(newLine);
                }
            });
            linesActions.push([this.linesWidget.clearLineHighlight, [undefined]]);
            linesActions.push([this.linesWidget.highlightLocation, [true]]);
            linesActions.push([this.linesWidget.highlightDestinationLocation, [true]]);
            this.scanned_location_dest = destinationLocation;
            return Promise.resolve({linesActions: linesActions});
        }
    },

    /**
     * Helper used when we want to go the next page. It calls `this._endBarcodeFlow`.
     *
     * @return {Promise}
     */
    _nextPage: function (){
        var self = this;
        this.mutex.exec(function () {
            return self._save().then(function () {
                if (self.currentPageIndex < self.pages.length - 1) {
                    self.currentPageIndex++;
                }
                var prom =  self._reloadLineWidget(self.currentPageIndex);
                self._endBarcodeFlow();
                return prom;
            });
        });
    },

    /**
     * Helper used when we want to go the previous page. It calls `this._endBarcodeFlow`.
     *
     * @return {Promise}
     */
    _previousPage: function () {
        var self = this;
        this.mutex.exec(function () {
            return self._save().then(function () {
                if (self.currentPageIndex > 0) {
                    self.currentPageIndex--;
                } else {
                    self.currentPageIndex = self.pages.length - 1;
                }
                var prom = self._reloadLineWidget(self.currentPageIndex);
                self._endBarcodeFlow();
                return prom;
            });
        });
    },
    /**
     * Helper used when we want to go the first page. It calls `this._endBarcodeFlow`.
     * @private
     * @returns {Promise}
     */
    _firstPage: function () {
        var self = this;
        return self._save().then(function () {
            if (self.currentPageIndex !== 0) {
                self.currentPageIndex = 0;
                self._endBarcodeFlow();
                return self._reloadLineWidget(0);
            }
        });
    },
    /**
     * Helper used when we want to go the last page. It calls `this._endBarcodeFlow`.
     * @private
     * @returns {Promise}
     */
    _lastPage: function () {
        var self = this;
        return self._save().then(function () {
            if (self.currentPageIndex !== self.pages.length - 1) {
                self.currentPageIndex = self.pages.length - 1;
                var prom = self._reloadLineWidget(self.pages.length - 1);
                self._endBarcodeFlow();
                return prom;
            }
        });
    },


    //--------------------------------------------------------------------------
    // Handlers
    //--------------------------------------------------------------------------

    /**
     * Handles the barcode scan event. Dispatch it to the appropriate method if it is a
     * commande, else use `this._onBarcodeScanned`.
     *
     * @private
     * @param {String} barcode scanned barcode
     */
    _onBarcodeScannedHandler: function (barcode) {
        var self = this;
        this.mutex.exec(function () {
            if (self.mode === 'done' || self.mode === 'cancel') {
                self.do_warn(_t('Warning'), _t('Scanning is disabled in this state.'));
                return Promise.resolve();
            }
            var commandeHandler = self.commands[barcode];
            if (commandeHandler) {
                return commandeHandler();
            }
            return self._onBarcodeScanned(barcode).then(function () {
                // FIXME sle: not the right place to do that
                if (self.show_entire_packs && self.lastScannedPackage) {
                    return self._reloadLineWidget(self.currentPageIndex);
                }
            });
        });
    },

    /**
     * Handles the `exit` OdooEvent. We disable the fullscreen mode and trigger_up an
     * `history_back`.
     *
     * @private
     * @param {OdooEvent} ev
     */
     _onExit: function (ev) {
        ev.stopPropagation();
        var self = this;
        this.mutex.exec(function () {
            return self._save().then(function () {
                self.actionManager.$el.height(self.actionManagerInitHeight);
                self.trigger_up('history_back');
            });
        });
    },

    /**
     * Handles the `add_product` OdooEvent. It destroys `this.linesWidget` and displays an instance
     * of `ViewsWidget` for the line model.
     * `this.ViewsWidget`
     *
     * @private
     * @param {OdooEvent} ev
     */
     _onAddLine: function (ev) {
        ev.stopPropagation();
        var self = this;
        this.mutex.exec(function () {
            self.linesWidgetState = self.linesWidget.getState();
            self.linesWidget.destroy();
            self.headerWidget.toggleDisplayContext('specialized');
            // Get the default locations before calling save to not lose a newly created page.
            var currentPage = self.pages[self.currentPageIndex];
            var default_location_id = currentPage.location_id;
            var default_location_dest_id = currentPage.location_dest_id;
            var default_company_id = self.currentState.company_id[0];
            return self._save().then(function () {
                if (self.actionParams.model === 'stock.picking') {
                    self.ViewsWidget = new ViewsWidget(
                        self,
                        'stock.move.line',
                        'stock_barcode.stock_move_line_product_selector',
                        {
                            'default_picking_id': self.currentState.id,
                            'default_company_id': default_company_id,
                            'default_location_id': default_location_id,
                            'default_location_dest_id': default_location_dest_id,
                            'default_qty_done': 1,
                        },
                        false
                    );
                } else if (self.actionParams.model === 'stock.inventory') {
                    self.ViewsWidget = new ViewsWidget(
                        self,
                        'stock.inventory.line',
                        'stock_barcode.stock_inventory_line_barcode',
                        {
                            'default_company_id': default_company_id,
                            'default_inventory_id': self.currentState.id,
                            'default_location_id': default_location_id,
                            'default_product_qty': 1,
                        },
                        false
                    );
                }
                return self.ViewsWidget.appendTo(self.$('.o_content'));
            });
        });
    },

    /**
     * Handles the `edit_product` OdooEvent. It destroys `this.linesWidget` and displays an instance
     * of `ViewsWidget` for the line model.
     *
     * Editing a line should not "end" the barcode flow, meaning once the changes are saved or
     * discarded in the opened form view, the user should be able to scan a destination location
     * (if the current flow allows it) and enforce it on `this.scanned_lines`.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onEditLine: function (ev) {
        ev.stopPropagation();
        this.linesWidgetState = this.linesWidget.getState();
        this.linesWidget.destroy();
        this.headerWidget.toggleDisplayContext('specialized');

        // If we want to edit a not yet saved line, keep its virtual_id to match it with the result
        // of the `applyChanges` RPC.
        var virtual_id = _.isString(ev.data.id) ? ev.data.id : false;

        var self = this;
        this.mutex.exec(function () {
            return self._save().then(function () {
                var id = ev.data.id;
                if (virtual_id) {
                    var currentPage = self.pages[self.currentPageIndex];
                    var rec = _.find(currentPage.lines, function (line) {
                        return line.dummy_id === virtual_id;
                    });
                    id = rec.id;
                }

                if (self.actionParams.model === 'stock.picking') {
                    self.ViewsWidget = new ViewsWidget(
                        self,
                        'stock.move.line',
                        'stock_barcode.stock_move_line_product_selector',
                        {},
                        {currentId: id}
                    );
                } else {
                    self.ViewsWidget = new ViewsWidget(
                        self,
                        'stock.inventory.line',
                        'stock_barcode.stock_inventory_line_barcode',
                        {},
                        {currentId: id}
                    );
                }
                return self.ViewsWidget.appendTo(self.$('.o_content'));
            });
        });
    },

    /**
     * Handles the `show_information` OdooEvent. It hides the main widget and
     * display a standard form view with information about the current record.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onShowInformation: function (ev) {  // jshint ignore:line
        this._showInformation();
    },

    /**
     * Handles the `show_settings` OdooEvent. It hides `this.linesWidget` and dipslays
     * `this.settinsWidget`.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onShowSettings: function (ev) {
        ev.stopPropagation();
        var self = this;
        this.mutex.exec(function () {
            return self._save().then(function () {
                if (self.ViewsWidget) {
                    self.ViewsWidget.destroy();
                }
                if (self.linesWidget) {
                    self.linesWidget.destroy();
                }
                self.headerWidget.toggleDisplayContext('specialized');
                self.settingsWidget.do_show();
            });
        });
    },

    /**
     * Handles the `reload` OdooEvent.
     * Currently, this event is only triggered by `this.ViewsWidget`.
     *
     * @private
     * @param {OdooEvent} ev ev.data could contain res_id
     */
    _onReload: function (ev) {
        ev.stopPropagation();
        if (this.ViewsWidget) {
            this.ViewsWidget.destroy();
        }
        if (this.settingsWidget) {
            this.settingsWidget.do_hide();
        }
        this.headerWidget.toggleDisplayContext('init');
        this.$('.o_show_information').toggleClass('o_hidden', true);
        var self = this;
        this._save({'forceReload': true}).then(function () {
            var record = ev.data.record;
            if (record) {
                var newPageIndex = _.findIndex(self.pages, function (page) {
                    return page.location_id === record.data.location_id.res_id &&
                           (self.actionParams.model === 'stock.inventory' ||
                            page.location_dest_id === record.data.location_dest_id.res_id);
                });
                if (newPageIndex === -1) {
                    new Error('broken');
                }
                self.currentPageIndex = newPageIndex;

                // Add the edited/added product in `this.scannedLines` if not already present. The
                // goal is to impact them on the potential next step.
                if (self.scannedLines.indexOf(record.data.id) === -1) {
                    self.scannedLines.push(record.data.id);
                }
            }

            self._reloadLineWidget(self.currentPageIndex);
            self.$('.o_show_information').toggleClass('o_hidden', false);
        });
    },

    /**
     * Handles the `next_move` OdooEvent. It makes `this.linesWidget` display
     * the next group of lines.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onNextPage: function (ev) {
        ev.stopPropagation();
        this._nextPage();
    },

    /**
     * Handles the `previous_move` OdooEvent. It makes `this.linesWidget` display
     * the previous group of lines.
     *
     * @private
     * @param {OdooEvent} ev
     */
    _onPreviousPage: function (ev) {
        ev.stopPropagation();
        this._previousPage();
    },

    /**
     * Handles the 'main_menu' OdooEvent. It's used when we want to go back the
     * main app menu.
     * @private
     */
    _onMainMenu: function () {
        var self = this;
        self._save().then(function () {
            self.do_action('stock_barcode.stock_barcode_action_main_menu', {
                clear_breadcrumbs: true,
            });
        });
    },

    /**
     * Handles the 'listen_to_barcode_scanned' OdooEvent.
     *
     * @private
     * @param {OdooEvent} ev ev.data.listen
     */
    _onListenToBarcodeScanned: function (ev) {
        if (ev.data.listen) {
            core.bus.on('barcode_scanned', this, this._onBarcodeScannedHandler);
        } else {
            core.bus.off('barcode_scanned', this, this._onBarcodeScannedHandler);
        }
    },

});

core.action_registry.add('stock_barcode_client_action', ClientAction);

return ClientAction;

});
