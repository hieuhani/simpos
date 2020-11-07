odoo.define('test_barcode_flows.tour', function(require) {
'use strict';

var tour = require('web_tour.tour');

// ----------------------------------------------------------------------------
// Test helpers
// ----------------------------------------------------------------------------
function fail (errorMessage) {
    tour._consume_tour(tour.running_tour, errorMessage);
}

function getLine (description) {
    var $res;
    $('.o_barcode_line').each(function () {
        var $line = $(this);
        var barcode = $line.data('barcode').trim();
        if (description.barcode === barcode) {
            if ($res) {
                $res.add($line);
            } else {
                $res = $line;
            }
        }
    });
    if (! $res) {
        fail('cannot get the line with the barcode ' + description.barcode);
    }
    return $res;
}

function assert (current, expected, info) {
    if (current !== expected) {
        fail(info + ': "' + current + '" instead of "' + expected + '".');
    }
}

function assertPageSummary (expected) {
    // FIXME sle: fix the tests instead of fixing the assert method
    var res = '';
    var $src = $('.o_barcode_summary_location_src');
    if ($src.length) {
        res = "From " + $src.text() + " ";
    }
    var $dest = $('.o_barcode_summary_location_dest');
    if ($dest.length) {
        res += "To " + $dest.text();
    }
    assert(res.trim(), expected.trim(), 'Page summary');
}

function assertPreviousVisible (expected) {
    var $previousButton = $('.o_previous_page');
    var current = (!$previousButton.length && !expected) || $previousButton.hasClass('o_hidden');
    assert(!current, expected, 'Previous visible');
}

function assertPreviousEnabled (expected) {
    var $previousButton = $('.o_previous_page');
    var current = (!$previousButton.length && !expected) || $previousButton.prop('disabled');
    assert(!current, expected, 'Previous button enabled');
}

function assertNextVisible (expected) {
    var $nextButton = $('.o_next_page');
    var current = (!$nextButton.length && !expected) || $nextButton.hasClass('o_hidden');
    assert(!current, expected, 'Next visible');
}

function assertNextEnabled (expected) {
    var $nextButton = $('.o_next_page');
    var current = (!$nextButton.length && !expected) || $nextButton.prop('disabled');
    assert(!current, expected, 'Next button enabled');
}

function assertNextIsHighlighted (expected) {
    var $nextButton = $('.o_next_page');
    var current = $nextButton.hasClass('btn-primary');
    assert(current, expected, 'Next button is highlighted');
}

function assertValidateVisible (expected) {
    var $validate = $('.o_validate_page');
    var current = (!$validate.length && !expected) || $validate.hasClass('o_hidden');
    assert(!current, expected, 'Validate visible');
}

function assertValidateEnabled (expected) {
    var $validate = $('.o_validate_page');
    var current = (!$validate.length && !expected) || $validate.prop('disabled');
    assert(!current, expected, 'Validate enabled');
}

function assertValidateIsHighlighted (expected) {
    var $validate = $('.o_validate_page');
    var current = $validate.hasClass('btn-success');
    assert(current, expected, 'Validte button is highlighted');
}

function assertLinesCount (expected) {
    var $lines = $('.o_barcode_line');
    var current = $lines.length;
    assert(current, expected, "Number of lines");
}

function assertScanMessage (expected) {
    var $helps = $('.o_scan_message');
    var $help = $helps.filter('.o_scan_message_' + expected);
    if (! $help.length || $help.hasClass('o_hidden')) {
        fail('assertScanMessage: "' + expected + '" is not displayed');
    }
}

function assertLocationHighlight (expected) {
    var $locationElem = $('.o_barcode_summary_location_src');
    assert($locationElem.hasClass('o_strong'), expected, 'Location source is not bold');
}

function assertDestinationLocationHighlight (expected) {
    var $locationElem = $('.o_barcode_summary_location_dest');
    assert($locationElem.hasClass('o_strong'), expected, 'Location destination is not bold');
}

function assertPager (expected) {
    var $pager = $('.o_barcode_move_number');
    assert($pager.text(), expected, 'Pager is wrong');
}

function assertLineIsHighlighted ($line, expected) {
    assert($line.hasClass('o_highlight'), expected, 'line should be highlighted');
}

function assertLineQty($line, qty) {
    assert($line.find('.qty-done').text(), qty, 'line quantity is wrong');
}

function assertFormLocationSrc(expected) {
    var $location = $('.o_field_widget[name="location_id"] input')
    assert($location.val(), expected, 'Wrong source location')
}

function assertFormLocationDest(expected) {
    var $location = $('.o_field_widget[name="location_dest_id"] input')
    assert($location.val(), expected, 'Wrong destination location')
}
function assertFormQuantity(expected) {
    var $location = $('.o_field_widget[name="qty_done"]')
    assert($location.val(), expected, 'Wrong destination location')

}

function assertInventoryFormQuantity(expected) {
    var $location = $('.o_field_widget[name="product_qty"]')
    assert($location.val(), expected, 'Wrong quantity')

}

function assertErrorMessage(expected) {
    var $errorMessage = $('.o_notification_content').eq(-1);
    assert($errorMessage[0].innerText, expected, 'wrong or absent error message');
}

function assertQuantsCount(expected) {
    var $quantity = $('.o_kanban_view .o_kanban_record:not(.o_kanban_ghost)').length;
    assert($quantity, expected, 'Wrong number of cards');
}

// ----------------------------------------------------------------------------
// Tours
// ----------------------------------------------------------------------------
tour.register('test_internal_picking_from_scratch_1', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(0);
            assertScanMessage('scan_src');
            assertLocationHighlight(false);
            assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
        }
    },

    //Check show information.
    {
        trigger: '.o_show_information',
    },

    {
        trigger: '.o_form_label:contains("Status")',
    },

    {
        trigger: '.o_close',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("Stock")',
    },

    /* We'll create a movement for 2 product1 from shelf1 to shelf2. The flow for this to happen is
     * to scan shelf1, product1, shelf2.
     */
    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(0);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_more_dest');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_more_dest');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, true);
            assertLineQty($line, "2");
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00'
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 2")',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_src');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(true);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, false);
        }
    },

    /* We'll create a movement for product2 from shelf1 to shelf3. The flow for this to happen is
     * to scan shelf1, product2, shelf3.
     */
    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, false);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_more_dest');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, false);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan shelf3'
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 3")',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 3');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_src');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(true);
            assertPager('2/2');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, false);
        }
    },

    /* We'll now move a product2 from shelf1 to shelf2. As we're still on the shel1 to shelf3 page
     * where a product2 was processed, we make sure the newly scanned product will be added in a
     * new move line that will change page at the time we scan shelf2.
     */
    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 3');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('2/2');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, false);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 3');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_more_dest');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('2/2');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $lines = getLine({barcode: 'product2'});
            if ($lines.filter('.o_highlight').length !== 1) {
                fail('one of the two lins of product2 should be highlighted.');
            }
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00'
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 2")',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(true);
            assertLinesCount(2);
            assertScanMessage('scan_src');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(true);
            assertPager('1/2');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
            var $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, false);
        }
    },
]);

tour.register('test_internal_picking_from_scratch_2', {test: true}, [
    /* Move 2 product1 from WH/Stock/Shelf 1 to WH/Stock/Shelf 2.
     */
    {
        trigger: '.o_add_line',
    },

    {
        extra_trigger: '.o_form_label:contains("Product")',
        trigger: "input.o_field_widget[name=qty_done]",
        run: 'text 2',
    },

    {
        trigger: ".o_field_widget[name=product_id] input",
        run: 'text product1',
    },

    {
        trigger: ".ui-menu-item > a:contains('product1')",
    },

    {
        trigger: ".o_field_widget[name=location_id] input",
        run: 'text Shelf 1',
    },

    {
        trigger: ".ui-menu-item > a:contains('Shelf 1')",
    },

    {
        trigger: ".o_field_widget[name=location_dest_id] input",
        run: 'text Shelf 2',
    },

    {
        trigger: ".ui-menu-item > a:contains('Shelf 2')",
    },

    {
        trigger: '.o_save',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("Shelf 2")',
        run: function() {
            assertLinesCount(1);
        },
    },

    /* Move 1 product2 from WH/Stock/Shelf 1 to WH/Stock/Shelf 3.
     */
    {
        trigger: '.o_add_line',
    },

    {
        extra_trigger: '.o_form_label:contains("Product")',
        trigger: ".o_field_widget[name=product_id] input",
        run: 'text product2',
    },

    {
        trigger: ".ui-menu-item > a:contains('product2')",
    },

    {
        trigger: ".o_field_widget[name=location_id] input",
        run: 'text Shelf 1',
    },

    {
        trigger: ".ui-menu-item > a:contains('Shelf 1')",
    },

    {
        trigger: ".o_field_widget[name=location_dest_id] input",
        run: 'text WH/Stock/Shelf 3',
    },

    {
        trigger: ".ui-menu-item > a:contains('Shelf 3')",
    },

    {
        trigger: '.o_save',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("Shelf 3")',
        run: function() {
            assertLinesCount(1);
        },
    },
    /*
    * Go back to the previous page and edit the first line. We check the transaction
    * doesn't crash and the form view is correctly filled.
    */

    {
        trigger: '.o_previous_page',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("Shelf 2")',
        run: function() {
            assertPager('1/2');
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertLinesCount(1);
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(true);
            var $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, false);
        },
    },

    {
        trigger: '.o_edit',
    },

    {
        trigger: '.o_form_label:contains("Product")',
        run: function() {
            assertFormLocationSrc("WH/Stock/Shelf 1");
            assertFormLocationDest("WH/Stock/Shelf 2");
            assertFormQuantity("2");
        },
    },

    {
        trigger: '.o_save',
    },

    /* Move 1 product2 from WH/Stock/Shelf 1 to WH/Stock/Shelf 2.
     */
    {
        trigger: '.o_add_line',
    },

    {
        extra_trigger: '.o_form_label:contains("Product")',
        trigger: ".o_field_widget[name=product_id] input",
        run: 'text product2',
    },

    {
        trigger: ".ui-menu-item > a:contains('product2')",
    },

    {
        trigger: ".o_field_widget[name=location_id] input",
        run: 'text Shelf 1',
    },

    {
        trigger: ".ui-menu-item > a:contains('Shelf 1')",
    },

    {
        trigger: ".o_field_widget[name=location_dest_id] input",
        run: 'text Shelf 2',
    },

    {
        trigger: ".ui-menu-item > a:contains('Shelf 2')",
    },

    {
        trigger: '.o_save',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("Shelf 2")',
        run: function() {
            assertLinesCount(2);
        },
    },
    /* on this page, scan a product and then edit it through with the form view without explicitly saving it first.
    */
    {
        trigger: '.o_next_page',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_edit',
    },

    {
        trigger: '.o_form_label:contains("Product")',
    },

    {
        trigger :'.o_save',
    },

    {
        trigger: '.o_validate_page',
    }
]);

tour.register('test_internal_picking_reserved_1', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_src');
            assertLocationHighlight(false);
            assertDestinationLocationHighlight(false);
            assertPager('1/2');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, false);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, false);
        }
    },

    /* We first move a product1 fro shef3 to shelf2.
     */
    {
        trigger: '.o_barcode_client_action',
        run: 'scan shelf3'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 3 To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(0);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('3/3');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 3 To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_more_dest');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('3/3');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00'
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 2")',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 3 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_src');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(true);
            assertPager('3/3');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, false);
        }
    },

    /* Hit two times previous to get to the shelf1 to fhel2 page.
     */
    {
        'trigger': '.o_previous_page',
    },

    {
        'trigger': '.o_previous_page',
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_src');
            assertLocationHighlight(false);
            assertDestinationLocationHighlight(false);
            assertPager('1/3');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateVisible(false);
            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, false);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, false);
        }
    },

    /* Process the reservation.
     */
    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/3');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, false);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, false);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_more_dest');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/3');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, true);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, false);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(true);
            assertLinesCount(2);
            assertScanMessage('scan_more_dest');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/3');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, false);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock/Shelf 2');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(true);
            assertLinesCount(2);
            assertScanMessage('scan_src');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(true);
            assertPager('1/3');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);

            $('.o_barcode_line .fa-cubes').parent().each(function() {
                var qty = $(this).text().trim();
                if (qty !== '1 / 1') {
                    fail();
                }
            });

            var $lineproduct1 = getLine({barcode: 'product1'});
            assertLineIsHighlighted($lineproduct1, false);
            var $lineproduct2 = getLine({barcode: 'product2'});
            assertLineIsHighlighted($lineproduct2, false);
        }
    },

    /* Hit next. The write should happen.
     */
    {
        'trigger': '.o_next_page',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 4")',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 3 To WH/Stock/Shelf 4');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_src');
            assertLocationHighlight(false);
            assertDestinationLocationHighlight(false);
            assertPager('2/3');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);

            $('.o_barcode_line .fa-cubes').parent().each(function() {
                var qty = $(this).text().trim();
                if (qty !== '0 / 1') {
                    fail();
                }
            });

            var $line = getLine({barcode: 'product2'});
            assertLineIsHighlighted($line, false);
        }
    },
]);

tour.register('test_receipt_reserved_1', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary(' To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_products');
            assertLocationHighlight(false);
            assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 1")',
        run: function() {
            assertPageSummary(' To WH/Stock/Shelf 1');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_products');
            // not relevant in receipt mode
            // assertLocationHighlight(false);
            assertDestinationLocationHighlight(true);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);

            $('.o_barcode_line .fa-cubes').parent().each(function() {
                var qty = $(this).text().trim();
                if (qty !== '1 / 4') {
                    fail();
                }
            });
        }
    },

    {
        trigger: '.o_add_line',
    },

    {
        trigger: '.o_form_label:contains("Product")',
        run: function() {
            assertFormLocationDest('WH/Stock/Shelf 1');
        },
    },
]);

tour.register('test_delivery_reserved_1', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock ');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_src');
            assertLocationHighlight(false);
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-00-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('From WH/Stock ');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertPager('1/1');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_summary_location_src:contains("WH/Stock/Shelf 1")',
        run: function() {
            assertPageSummary('From WH/Stock/Shelf 1 ');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(0);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertPager('2/2');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
        }
    },
]);

tour.register('test_delivery_reserved_2', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_products');
            assertLocationHighlight(false);
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2'
    },

    {
        trigger: '.o_barcode_line_title:contains("product2")',
        run: function() {
            assertPageSummary('');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(3);
            assertScanMessage('scan_products');
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_line_title:contains("product2")',
        run: function() {
            assertPageSummary('');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(3);
            assertScanMessage('scan_products');
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $lines = getLine({barcode: 'product1'});
            for (var i = 0; i < $lines.length; i++) {
                assertLineQty($($lines[i]), "2");
            }

        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertPageSummary('');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(4);
            assertScanMessage('scan_products');
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
        }
    },
]);


tour.register('test_delivery_reserved_3', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('');
            assertPreviousVisible(true);
            assertPreviousEnabled(false);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_products');
            assertLocationHighlight(false);
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(true);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan this_is_not_a_barcode_dude'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_products');
            // not relevant in delivery mode
            // assertDestinationLocationHighlight(false);
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, true);
            assertLineQty($line, "1");
        }
    },
]);


tour.register('test_receipt_from_scratch_with_lots_1', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary(' To WH/Stock');
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_notification_title:contains("Warning")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertErrorMessage('You are expected to scan one or more products.');
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-00-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 1")',
        run: function() {
            assertPageSummary(' To WH/Stock/Shelf 1');
            assertPreviousVisible(true);
        }
    },
]);

tour.register('test_receipt_from_scratch_with_lots_2', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary(' To WH/Stock');
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productlot1'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 1")',
        run: function() {
            assertPageSummary(' To WH/Stock/Shelf 1');
            assertPreviousVisible(true);
        }
    },
]);

tour.register('test_receipt_from_scratch_with_lots_3', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertPageSummary('To WH/Stock');
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_barcode_line',
        run: function() {
            assertLinesCount(1);
            const $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, true);
            assertLineQty($line, "1");
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productlot1'
    },

    {
        trigger: '.o_barcode_line:nth-child(2)',
        run: function() {
            assertLinesCount(2);
            const $line1 = getLine({barcode: 'product1'});
            const $line2 = getLine({barcode: 'productlot1'});
            assertLineIsHighlighted($line1, false);
            assertLineQty($line1, "1");
            assertLineIsHighlighted($line2, true);
            assertLineQty($line2, "0");
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.qty-done:contains(2)',
        run: function() {
            assertLinesCount(2);
            const $line1 = getLine({barcode: 'product1'});
            const $line2 = getLine({barcode: 'productlot1'});
            assertLineIsHighlighted($line1, false);
            assertLineQty($line1, "1");
            assertLineIsHighlighted($line2, true);
            assertLineQty($line2, "2");
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate'
    },
]);

tour.register('test_delivery_from_scratch_with_lots_1', {test: true}, [

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },
    // Open the form view to trigger a save
    {
        trigger: '.o_add_line',
    },

    {
        trigger: '.o_form_label:contains("Product")',
    },

]);

tour.register('test_delivery_from_scratch_with_sn_1', {test: true}, [
    /* scan a product tracked by serial number. Then scan 4 a its serial numbers.
    */
    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn1',
    },

    {
        trigger: '.o_notification_title:contains("Warning")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertErrorMessage('The scanned serial number is already used.');
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn3',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn4',
    },
    // Open the form view to trigger a save
    {
        trigger: '.o_add_line',
    },

    {
        trigger: '.o_form_label:contains("Product")',
    },

]);
tour.register('test_delivery_reserved_lots_1', {test: true}, [

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productlot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },
    // Open the form view to trigger a save
    {
        trigger: '.o_add_line',
    },

    {
        trigger: '.o_form_label:contains("Product")',
    },

]);

tour.register('test_delivery_reserved_with_sn_1', {test: true}, [
    /* scan a product tracked by serial number. Then scan 4 a its serial numbers.
    */
    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn3',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn3',
    },

    {
        trigger: '.o_notification_title:contains("Warning")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertErrorMessage('The scanned serial number is already used.');
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn4',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn2',
    },
    // Open the form view to trigger a save
    {
        trigger: '.o_add_line',
    },

    {
        trigger: '.o_form_label:contains("Product")',
    },

]);

tour.register('test_receipt_reserved_lots_multiloc_1', {test: true}, [
    /* Receipt of a product tracked by lots. Open an existing picking with 4
    * units initial demands. Scan 2 units in lot1 in location WH/Stock. Then scan
    * 2 unit in lot2 in location WH/Stock/Shelf 2
    */

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productlot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productlot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00',
    },
    // Open the form view to trigger a save
    {
        trigger: '.o_add_line',
    },

    {
        trigger: '.o_form_label:contains("Product")',
    },

]);

tour.register('test_receipt_duplicate_serial_number', {test: true}, [
    /* Create a receipt. Try to scan twice the same serial in different
    * locations.
    */
    {
        trigger: '.o_stock_barcode_main_menu:contains("Barcode Scanning")',
    },
    // reception
    {
        trigger: '.o_stock_barcode_main_menu',
        run: 'scan WH-RECEIPTS',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn1',
    },

    {
        trigger: '.o_notification_title:contains("Warning")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertErrorMessage('The scanned serial number is already used.');
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The transfer has been validated');
        },
    },
]);

tour.register('test_delivery_duplicate_serial_number', {test: true}, [
    /* Create a delivery. Try to scan twice the same serial in different
    * locations.
    */
    {
        trigger: '.o_stock_barcode_main_menu',
        run: 'scan WH-DELIVERY',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn1',
    },

    {
        trigger: '.o_notification_title:contains("Warning")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertErrorMessage('The scanned serial number is already used.');
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan sn2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The transfer has been validated');
        },
    },
]);

tour.register('test_bypass_source_scan', {test: true}, [
    /* Scan directly a serial number, a package or a lot in delivery order.
    * It should implicitely trigger the same action than a source location
    * scan with the state location.
    */
    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertPageSummary('From WH/Stock/Shelf 1');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(false);
            assertLinesCount(1);
            assertScanMessage('scan_src');
            assertLocationHighlight(false);
            assertDestinationLocationHighlight(false);
            assertPager('1/2');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
        }
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan THEPACK',
    },

    {
        trigger: '.o_notification_title:contains("Warning")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertErrorMessage("You are expected to scan one or more products or a package available at the picking's location");
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan serial1',
    },

    {
        trigger: '.o_edit'
    },

    {
        trigger: '.o_field_many2one[name=lot_id]',
        extra_trigger: '.o_form_label:contains("Product")',
        position: "bottom",
        run: function (actions) {
            actions.text("", this.$anchor.find("input"));
        },
    },

    {
        trigger: 'input.o_field_widget[name=qty_done]',
        run: 'text 0',
    },

    {
        trigger: '.o_save'
    },

    {
        trigger: '.o_barcode_client_action',
        extra_trigger: '.o_barcode_line',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan THEPACK',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan serial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },
]);

tour.register('test_inventory_adjustment', {test: true}, [

    {
        trigger: '.button_inventory',
    },

    //Check show information.
    {
        trigger: '.o_show_information',
    },

    {
        trigger: '.o_form_label:contains("Status")',
    },

    {
        trigger: '.o_close',
    },

    {
        trigger: '.o_barcode_message:contains("Scan products")',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_edit',
    },

    {
        trigger: '.o_form_label:contains("Product")',
        run: function () {
            assertInventoryFormQuantity('2.000');
        }
    },

    {
        trigger :'.o_save',
    },

    {
        trigger: '.o_add_line',
    },

    {
        trigger: ".o_field_widget[name=product_id] input",
        run: 'text product2',
    },

    {
        trigger: ".ui-menu-item > a:contains('product2')",
    },

    {
        trigger: "input.o_field_widget[name=product_qty]",
        run: 'text 2',
    },

    {
        trigger: '.o_save',
    },

    {
        extra_trigger: '.o_barcode_message:contains("Scan products")',
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The inventory adjustment has been validated');
        },
    },

]);

tour.register('test_inventory_adjustment_mutli_location', {test: true}, [

    {
        trigger: '.button_inventory',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-00-00'
    },

    {
        trigger: '.o_barcode_summary_location_src:contains("WH/Stock")',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_summary_location_src:contains("WH/Stock/Shelf 1")',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00'
    },

    {
        trigger: '.o_barcode_summary_location_src:contains("WH/Stock/Shelf 2")',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_add_line',
    },

    {
        trigger: '.o_form_label:contains("Product")',
    },

]);

tour.register('test_inventory_adjustment_tracked_product', {test: true}, [

    {
        trigger: '.button_inventory',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productlot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan serial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan serial1',
    },

    {
        trigger: '.o_notification_title:contains("Warning")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertErrorMessage('The scanned serial number is already used.');
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan serial2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productlot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan productserial1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan serial3',
    },

    // Edit a line to trigger a save.
    {
        trigger: '.o_add_line',
    },
    {
        trigger: '.o_form_label:contains("Product")',
    },
    {
        trigger: '.o_discard',
    },

    // Scan tracked by lots product, then scan new lots.
    {
        extra_trigger: '.o_barcode_message',
        trigger: '.o_barcode_client_action',
        run: 'scan productlot1',
    },
    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot2',
    },
    {
        trigger: '.o_barcode_client_action',
        run: 'scan lot3',
    },

    // Must have 6 lines (lot1, serial1, serial2, serial3, lot2, lot3).
    {
        trigger: '.o_barcode_line:nth-child(6)',
        run: function () {
            assertLinesCount(6);
        }
    },
]);

tour.register('test_inventory_nomenclature', {test: true}, [

    {
        trigger: '.button_inventory',
    },

    {
        trigger: '.o_barcode_client_action',
        run: function() {
            assertScanMessage('scan_products');
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan 2145631123457', // 12.345 kg
    },

    {
        trigger: '.product-label:contains("product_weight")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The inventory adjustment has been validated');
        },
    },
]);

tour.register('test_inventory_package', {test: true}, [

    {
        trigger: '.button_inventory',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan PACK001',
    },

    {
        trigger: '.o_barcode_line:contains("product2") .o_edit',
    },

    {
        trigger: '[name="product_qty"]',
        run: 'text 21'
    },

    {
        trigger: '.o_save',
    },

    {
        trigger: '.o_validate_page',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The inventory adjustment has been validated');
        },
    },
]);

tour.register('test_pack_multiple_scan', {test: true}, [

    {
        trigger: '.o_stock_barcode_main_menu:contains("Barcode Scanning")',
    },
// reception
    {
        trigger: '.o_stock_barcode_main_menu',
        run: 'scan WH-RECEIPTS',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.pack',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The transfer has been validated');
        },
    },
// Delivery transfer to check the error message
    {
        trigger: '.o_stock_barcode_main_menu',
        run: 'scan WH-DELIVERY',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan PACK0001000',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan PACK0001000',
    },

    {
        trigger: '.o_notification_title:contains("Warning")'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertErrorMessage('This package is already scanned.');
            var $line = getLine({barcode: 'product1'});
            assertLineIsHighlighted($line, true);
            var $line = getLine({barcode: 'product2'});
            assertLineIsHighlighted($line, true);
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The transfer has been validated');
        },
    },
]);

tour.register('test_pack_common_content_scan', {test: true}, [
    /* Scan 2 packages PACK1 and PACK2 that contains both product1 and
     * product 2. It also scan a single product1 before scanning both pacakges.
     * the purpose is to check that lines with a same product are not merged
     * together. For product 1, we should have 3 lines. One with PACK 1, one
     * with PACK2 and the last without package.
     */
    {
        trigger: '.o_stock_barcode_main_menu:contains("Barcode Scanning")',
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: 'scan WH-DELIVERY',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan PACK1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan PACK2',
    },

    {
        trigger: '.o_barcode_client_action:contains("PACK2")',
        run: function () {
            assertLinesCount(5);
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The transfer has been validated');
        },
    },
]);


tour.register('test_pack_multiple_location', {test: true}, [

    {
        trigger: '.o_stock_barcode_main_menu:contains("Barcode Scanning")',
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: 'scan WH-INTERNAL',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_summary_location_src:contains("WH/Stock/Shelf 1")',
        run: 'scan PACK0000666',
    },

    {
        trigger: '.o_package_content',
    },

    {
        trigger: '.o_kanban_view:contains("product1")',
        run: function () {
            assertQuantsCount(2);
        },
    },

    {
        trigger: '.o_close',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 2")',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

    {
        trigger: '.o_stock_barcode_main_menu',
        run: function () {
            assertErrorMessage('The transfer has been validated');
        },
    },
]);

tour.register('test_put_in_pack_from_multiple_pages', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_src');
            assertLocationHighlight(false);
            assertDestinationLocationHighlight(false);
            assertPager('1/2');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00'
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(true);
            assertNextEnabled(true);
            assertNextIsHighlighted(false);
            assertLinesCount(2);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('1/2');
            assertValidateVisible(false);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2',
    },

    {
        trigger: '.o_next_page',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-02-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.pack',
    },

    {
        trigger: '.o_barcode_summary_location_src:contains("WH/Stock/Shelf 2")',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")'
    },

]);

tour.register('test_reload_flow', {test: true}, [
    {
        trigger: '.o_stock_barcode_main_menu',
        run: 'scan WH-RECEIPTS'
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1'
    },

    {
        trigger: '.o_edit',
    },

    {
        extra_trigger: '.o_form_label:contains("Product")',
        trigger: 'input.o_field_widget[name=qty_done]',
        run: 'text 2',
    },

    {
        trigger: '.o_save',
    },

    {
        trigger: '.o_add_line',
    },

    {
        trigger: ".o_field_widget[name=product_id] input",
        run: 'text product2',
    },

    {
        trigger: ".ui-menu-item > a:contains('product2')",
    },

    {
        trigger: '.o_save',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock")',
        run: function () {
            assertScanMessage('scan_more_dest');
            assertLocationHighlight(false);
            assertDestinationLocationHighlight(true);
        },
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock")',
        run: 'scan LOC-01-01-00',
    },

    {
        trigger: '.o_barcode_summary_location_dest:contains("WH/Stock/Shelf 1")',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")',
    },

]);

tour.register('test_highlight_packs', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertLinesCount(1);
            assertScanMessage('scan_products');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(true);
            var $line = $('.o_barcode_line');
            assertLineIsHighlighted($line, false);

        },
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan PACK002',
    },

    {
        trigger: '.o_barcode_client_action:contains("PACK002")',
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertLinesCount(2);
            assertScanMessage('scan_products');
            assertValidateVisible(true);
            assertValidateIsHighlighted(true);
            assertValidateEnabled(true);
            var $line = $('.o_barcode_line').eq(1);
            assertLineIsHighlighted($line, true);
        },
    },

]);

tour.register('test_put_in_pack_from_different_location', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_next_page',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan shelf3',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.pack',
    },

    {
        trigger: '.fa-truck',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00',
    },

    {
        trigger: '.o_barcode_summary_location_src:contains("WH/Stock/Shelf 1")',
    },

    {
        trigger: '.o_barcode_client_action',
        run: function () {
            assertPageSummary('From WH/Stock/Shelf 1 To WH/Stock');
            assertPreviousVisible(true);
            assertPreviousEnabled(true);
            assertNextVisible(false);
            assertNextEnabled(false);
            assertNextIsHighlighted(false);
            assertLinesCount(0);
            assertScanMessage('scan_products');
            assertLocationHighlight(true);
            assertDestinationLocationHighlight(false);
            assertPager('3/3');
            assertValidateVisible(true);
            assertValidateIsHighlighted(false);
            assertValidateEnabled(false);
        },
    },

    {
        trigger: '.o_previous_page',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")',
    },
]);

tour.register('test_put_in_pack_before_dest', {test: true}, [
    {
        trigger: '.o_barcode_client_action',
        run: 'scan LOC-01-01-00',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product1',
    },

    {
        trigger: '.o_next_page',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan shelf3',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan product2',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan shelf4',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.pack'
    },

    {
        trigger: '.modal-title:contains("Choose destination location")',
    },

    {
        trigger: '.btn-primary',
    },

    {
        trigger: '.o_barcode_client_action',
        run: 'scan O-BTN.validate',
    },

    {
        trigger: '.o_notification_title:contains("Success")',
    },

]);

});
