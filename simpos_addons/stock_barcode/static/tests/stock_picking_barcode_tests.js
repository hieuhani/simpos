odoo.define('stock_barcode.stock_picking_barcode_tests', function (require) {
"use strict";

var testUtils = require('web.test_utils');
var FormView = require('web.FormView');

var createActionManager = testUtils.createActionManager;
var createView = testUtils.createView;
var triggerKeypressEvent = testUtils.dom.triggerKeypressEvent;

QUnit.module('stock_barcode', {}, function () {

QUnit.module('Barcode', {
    beforeEach: function () {
        var self = this;

        this.clientData = {
            action: {
                tag: 'stock_barcode_picking_client_action',
                type: 'ir.actions.client',
                params: {
                    model: "stock.inventory",
                },
                context: {},
            },
            currentState: [{
                location_id: {},
                location_dest_id: {},
                move_line_ids: [],
            }],
        };
        this.mockRPC = function (route, args) {
            if (route === '/stock_barcode/get_set_barcode_view_state') {
                return Promise.resolve(self.clientData.currentState);
            } else if (args.method === "get_all_products_by_barcode") {
                return Promise.resolve({});
            } else if (args.method === "get_all_locations_by_barcode") {
                return Promise.resolve({});
            }
        };
        this.data = {
            product: {
                fields: {
                    name: {string : "Product name", type: "char"},
                },
                records: [{
                    id: 1,
                    name: "Large Cabinet",
                }, {
                    id: 4,
                    name: "Cabinet with Doors",
                }],
            },
            'stock.move.line': {
                fields: {
                    product_id: {string: "Product", type: 'many2one', relation: 'product'},
                    product_qty: {string: "To Do", type: 'float', digits: [16,1]},
                    qty_done: {string: "Done", type: 'float', digits: [16,1]},
                    product_barcode: {string: "Product Barcode", type: 'char'},
                    lots_visible: {string: "Product tracked by lots", type: 'boolean'},
                },
                records: [{
                    id: 3,
                    product_id: 1,
                    product_qty: 2.0,
                    qty_done: 0.0,
                    product_barcode: "543982671252",
                }, {
                    id: 5,
                    product_id: 4,
                    product_qty: 2.0,
                    qty_done: 0.0,
                    product_barcode: "678582670967",
                }],
            },
            stock_picking: {
                fields: {
                    _barcode_scanned: {string: "Barcode Scanned", type: 'char'},
                    move_line_ids_without_package: {
                        string: "one2many field",
                        relation: 'stock.move.line',
                        type: 'one2many',
                    },
                },
                records: [{
                    id: 2,
                    move_line_ids_without_package: [3],
                }, {
                    id: 5,
                    move_line_ids_without_package: [5],
                }],
            },
        };
    }
});

QUnit.test('scan a product (no tracking)', async function (assert) {
    assert.expect(5);

    var form = await createView({
        View: FormView,
        model: 'stock_picking',
        data: this.data,
        arch: '<form string="Products">' +
                '<field name="_barcode_scanned" widget="picking_barcode_handler"/>' +
                '<sheet>' +
                    '<notebook>' +
                        '<page string="Operations">' +
                            '<field name="move_line_ids_without_package">' +
                                '<tree>' +
                                    '<field name="product_id"/>' +
                                    '<field name="product_qty"/>' +
                                    '<field name="qty_done"/>' +
                                    '<field name="product_barcode"/>' +
                                    '<field name="lots_visible" invisible="1"/>' +
                                '</tree>' +
                            '</field>' +
                        '</page>' +
                    '</notebook>' +
                '</sheet>' +
            '</form>',
        res_id: 2,
        mockRPC: function (route, args) {
            assert.step(args.method);
            return this._super.apply(this, arguments);
        },
        viewOptions: {
            mode: 'edit',
        },
    });

    assert.strictEqual(form.$('.o_data_row .o_data_cell:nth(2)').text(), '0.0',
        "quantity done should be 0");

    _.each(['5','4','3','9','8','2','6','7','1','2','5','2','Enter'], triggerKeypressEvent);
    await testUtils.nextTick();
    assert.strictEqual(form.$('.o_data_row .o_data_cell:nth(2)').text(), '1.0',
        "quantity done should be 1");
    assert.verifySteps(['read', 'read'], "no RPC should have been done for the barcode scanned");

    form.destroy();
});

QUnit.test('scan a product tracked by lot', async function (assert) {
    assert.expect(8);

    // simulate a PO for a tracked by lot product
    this.data['stock.move.line'].records[0].lots_visible = true;

    var form = await createView({
        View: FormView,
        model: 'stock_picking',
        data: this.data,
        arch: '<form string="Products">' +
                '<field name="_barcode_scanned" widget="picking_barcode_handler"/>' +
                '<sheet>' +
                    '<notebook>' +
                        '<page string="Operations">' +
                            '<field name="display_name"/>' +
                            '<field name="move_line_ids_without_package">' +
                                '<tree>' +
                                    '<field name="product_id"/>' +
                                    '<field name="product_qty"/>' +
                                    '<field name="qty_done"/>' +
                                    '<field name="product_barcode"/>' +
                                    '<field name="lots_visible" invisible="1"/>' +
                                '</tree>' +
                            '</field>' +
                        '</page>' +
                    '</notebook>' +
                '</sheet>' +
            '</form>',
        res_id: 2,
        mockRPC: function (route, args) {
            assert.step(args.method);
            if (args.method === 'get_po_to_split_from_barcode') {
                return Promise.resolve({action_id: 1});
            }
            return this._super.apply(this, arguments);
        },
        intercepts: {
            do_action: function (event) {
                assert.deepEqual(event.data.action, {action_id: 1}, "should trigger a do_action");
            },
        },
        viewOptions: {
            mode: 'edit',
        },
    });

    assert.strictEqual(form.$('.o_data_row .o_data_cell:nth(2)').text(), '0.0',
        "quantity done should be 0");

    // trigger a change on a field to be able to check that the record is correctly
    // saved before calling get_po_to_split_from_barcode
    await testUtils.fields.editInput(form.$('.o_field_widget[name="display_name"]'), 'new value');
    _.each(['5','4','3','9','8','2','6','7','1','2','5','2','Enter'], triggerKeypressEvent);
    await testUtils.nextTick();
    assert.strictEqual(form.$('.o_data_row .o_data_cell:nth(2)').text(), '0.0',
        "quantity done should still be 0");
    assert.verifySteps(['read', 'read', 'write', 'get_po_to_split_from_barcode'],
        "get_po_to_split_from_barcode method call verified");

    form.destroy();
});

QUnit.test('scan a product verify onChange', async function (assert) {
    assert.expect(7);

    this.data.stock_picking.onchanges = {
        move_line_ids: function () {},
    };
    this.data['stock.move.line'].onchanges = {
        qty_done: function () {},
    };
    var form = await createView({
        View: FormView,
        model: 'stock_picking',
        data: this.data,
        arch: '<form string="Products">' +
                '<field name="_barcode_scanned" widget="picking_barcode_handler"/>' +
                '<sheet>' +
                    '<notebook>' +
                        '<page string="Operations">' +
                            '<field name="display_name"/>' +
                            '<field name="move_line_ids_without_package">' +
                                '<tree>' +
                                    '<field name="product_id"/>' +
                                    '<field name="product_qty"/>' +
                                    '<field name="qty_done"/>' +
                                    '<field name="product_barcode"/>' +
                                '</tree>' +
                            '</field>' +
                        '</page>' +
                    '</notebook>' +
                '</sheet>' +
            '</form>',
        res_id: 2,
        mockRPC: function (route, args) {
            assert.step(args.method);
            return this._super.apply(this, arguments);
        },
        viewOptions: {
            mode: 'edit',
        },
    });

    assert.strictEqual(form.$('.o_data_row .o_data_cell:nth(2)').text(), '0.0',
        "quantity done should be 0");

    assert.strictEqual(form.activeBarcode._barcode_scanned.notifyChange, false,
        "_barcode_scanned should not notify change");

    // trigger a change on a field to be able to check that the record is correctly
    // saved before calling get_po_to_split_from_barcode
    await testUtils.fields.editInput(form.$('.o_field_widget[name="display_name"]'), 'new value');
    _.each(['5','4','3','9','8','2','6','7','1','2','5','2','Enter'], triggerKeypressEvent);
    await testUtils.nextTick();
    assert.strictEqual(form.$('.o_data_row .o_data_cell:nth(2)').text(), '1.0',
        "quantity done should be 1");
    // We won't be able to block onchange calls on x2many since the notifyChange
    // is not propagated in basic model.
    assert.verifySteps(['read', 'read', 'onchange']);

    form.destroy();
});

QUnit.test('exclamation-triangle when picking is done', async function (assert) {
    assert.expect(1);
    this.clientData.currentState[0].state = 'done';
    var actionManager = await createActionManager({
        mockRPC: this.mockRPC,
    });
    await actionManager.doAction(this.clientData.action);
    assert.containsOnce(actionManager, '.o_js_has_warning_msg', "Should have warning icon");
    actionManager.destroy();
});

QUnit.test('barcode pic when picking is not done or cancelled', async function (assert) {
    assert.expect(2);
    this.clientData.currentState[0].group_stock_multi_locations = false;
    var actionManager = await createActionManager({
        mockRPC: this.mockRPC,
    });
    await actionManager.doAction(this.clientData.action);
    assert.containsOnce(actionManager, '.o_barcode_pic', "Should have barcode picture");
    assert.containsNone(actionManager, '.o_js_has_warning_msg', "Should not have warning icon");
    actionManager.destroy();
});

});
});
