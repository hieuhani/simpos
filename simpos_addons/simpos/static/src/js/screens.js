odoo.define('simpos.screens', function (require) {
    "use strict";

    var PosBaseWidget = require('point_of_sale.BaseWidget');
    var screens = require('point_of_sale.screens');
    var core = require('web.core');
    var QWeb = core.qweb;
    var _t = core._t;

    var ProductCategoriesWidget = screens.ProductCategoriesWidget.include({
        init: function(parent, options){
            this._super(parent,options);
            var db = this.pos.db;
            this.rootcategories = this.pos.db.get_category_by_id(db.get_category_childs_ids(0));
        },
        set_category : function(category){
            var db = this.pos.db;
            if(!category){
                this.category = db.get_category_by_id(db.root_category_id);
            }else{
                this.category = category;
            }

            this.subcategories = db.get_category_by_id(db.get_category_childs_ids(this.category.id));
        },
        renderElement: function () {
            var el_str = QWeb.render(this.template, { widget: this });
            var el_node = document.createElement('div');

            el_node.innerHTML = el_str;
            el_node = el_node.childNodes[1];

            if (this.el && this.el.parentNode) {
                this.el.parentNode.replaceChild(el_node, this.el);
            }

            this.el = el_node;

            var withpics = this.pos.config.iface_display_categ_images;

            var list_container = el_node.querySelector('.category-list');
            if (list_container) {
                if (!withpics) {
                    list_container.classList.add('simple');
                } else {
                    list_container.classList.remove('simple');
                }
                for (var i = 0, len = this.subcategories.length; i < len; i++) {
                    list_container.appendChild(this.render_category(this.subcategories[i], withpics));
                }
            }

            var buttons = el_node.querySelectorAll('.js-category-switch');
            for (var i = 0; i < buttons.length; i++) {
                buttons[i].addEventListener('click', this.switch_category_handler);
            }
            

            var products = this.pos.db.get_product_by_category(this.category.id);
            this.product_list_widget.set_product_list(products); // FIXME: this should be moved elsewhere ... 

            this.el.querySelector('.searchbox input').addEventListener('keypress', this.search_handler);

            this.el.querySelector('.searchbox input').addEventListener('keydown', this.search_handler);

            this.el.querySelector('.search-clear').addEventListener('click', this.clear_search_handler);

            if (this.pos.config.iface_vkeyboard && this.chrome.widget.keyboard) {
                this.chrome.widget.keyboard.connect($(this.el.querySelector('.searchbox input')));
            }
        },
    });

    var OrderWidget = screens.OrderWidget.include({
        update_summary: function () {
            var order = this.pos.get_order();
            if (!order.get_orderlines().length) {
                return;
            }

            var total = order ? order.get_total_with_tax() : 0;
            var total_items = order ? order.get_total_items() : 0;

            this.el.querySelector('.summary .total > .value').textContent = this.format_currency(total);
            this.el.querySelector('.summary .total_items > .value').textContent = total_items;
        },
        renderElement: function (scrollbottom) {
            var order = this.pos.get_order();
            if (!order) {
                return;
            }
            var orderlines = order.get_orderlines();

            var el_str = QWeb.render('OrderWidget', { widget: this, order: order, orderlines: orderlines });

            var el_node = document.createElement('div');
            el_node.innerHTML = _.str.trim(el_str);
            el_node = el_node.childNodes[0];


            var list_container = el_node.querySelector('.orderlines');
            for (var i = 0, len = orderlines.length; i < len; i++) {
                var orderline = this.render_orderline(orderlines[i]);
                list_container.appendChild(orderline);
            }

            if (this.el && this.el.parentNode) {
                this.el.parentNode.replaceChild(el_node, this.el);
            }
            this.el = el_node;
            this.update_summary();

            if (scrollbottom) {
                this.el.querySelector('.sidebar .order-container .orderlines').scrollTop = 100 * orderlines.length;
            }
        },
    });

    var CustomerWidget = PosBaseWidget.extend({
        template: 'CustomerWidget',
        init: function (parent, options) {
            var self = this;
            this._super(parent, options);

            this.pos.bind('change:selectedClient', function () {
                self.renderElement();
            });
        },
        renderElement: function () {
            var self = this;
            this._super();
            this.$('.set-customer').click(function () {
                self.gui.show_screen('clientlist');
            });
        }
    });

    var ProductScreenWidget = screens.ProductScreenWidget.include({
        start: function () {
            this.customer = new CustomerWidget(this, {});
            this.customer.replace(this.$('.placeholder-CustomerWidget'));

            this.payment = new PaymentWidget(this, {});
            this.payment.replace(this.$('.placeholder-PaymentWidget'));

            this._super.apply(this, arguments);
        },
        _handleBufferedKeys: function () {
            // If more than 2 keys are recorded in the buffer, chances are high that the input comes
            // from a barcode scanner. In this case, we don't do anything.
            if (this.buffered_key_events.length > 2) {
                this.buffered_key_events = [];
                return;
            }

            for (var i = 0; i < this.buffered_key_events.length; ++i) {
                var ev = this.buffered_key_events[i];
                if ((ev.key >= "0" && ev.key <= "9") || ev.key === ".") {
                    // TODO: Improve
                }
                else {
                    switch (ev.key) {
                        case "Backspace":
                            this.numpad.state.deleteLastChar();
                            break;
                        case "Delete":
                            this.numpad.state.resetValue();
                            break;
                        case ",":
                            this.numpad.state.appendNewChar(".");
                            break;
                        case "+":
                            this.numpad.state.positiveSign();
                            break;
                        case "-":
                            this.numpad.state.negativeSign();
                            break;
                    }
                }
            }
            this.buffered_key_events = [];
        },
    });

    var PaymentWidget = PosBaseWidget.extend({
        template: 'PaymentWidget',
        init: function (parent, options) {
            this._super(parent, options);
            var self = this;
            this.pos.bind('change:selectedClient', function () {
                self.renderElement();
            });
        },
        renderElement: function () {
            var self = this;
            this._super();
            this.$('.pay').click(function () {
                var order = self.pos.get_order();
                var has_valid_product_lot = _.every(order.orderlines.models, function (line) {
                    return line.has_valid_product_lot();
                });
                if (!has_valid_product_lot) {
                    self.gui.show_popup('confirm', {
                        'title': _t('Empty Serial/Lot Number'),
                        'body': _t('One or more product(s) required serial/lot number.'),
                        confirm: function () {
                            self.gui.show_screen('payment');
                        },
                    });
                } else {
                    self.gui.show_screen('payment');
                }
            });
        }
    });

    var ClientListScreenWidget = screens.ClientListScreenWidget.include({
        show: function () {
            var self = this;
            this._super();

            this.renderElement();
            this.details_visible = false;
            this.old_client = this.pos.get_order().get_client();

            this.$('.back').click(function () {
                self.gui.back();
            });

            this.$('.next').click(function () {
                self.save_changes();
                self.gui.back();    // FIXME HUH ?
            });

            this.$('.new-customer').click(function () {
                self.display_client_details('edit', {
                    'country_id': self.pos.company.country_id,
                    'state_id': self.pos.company.state_id,
                });
            });

            var partners = this.pos.db.get_partners_sorted(1000);
            this.render_list(partners);

            this.reload_partners();

            if (this.old_client) {
                this.toggle_save_button();
            }

            this.$('.client-list-contents').on('click', '.client-line', function (event) {
                self.line_select(event, $(this), parseInt($(this).data('id')));
            });
            this.$('.client-list-contents').delegate('.btn-show-details', 'click', function (event) {
                event.stopPropagation();
                var id = parseInt($(this).data('id'));
                var partner = self.pos.db.get_partner_by_id(id);
                self.display_client_details('show', partner);
            });

            var search_timeout = null;

            if (this.pos.config.iface_vkeyboard && this.chrome.widget.keyboard) {
                this.chrome.widget.keyboard.connect(this.$('.searchbox input'));
            }

            this.$('.searchbox input').on('keypress', function (event) {
                clearTimeout(search_timeout);

                var searchbox = this;

                search_timeout = setTimeout(function () {
                    self.perform_search(searchbox.value, event.which === 13);
                }, 70);
            });

            this.$('.searchbox .search-clear').click(function () {
                self.clear_search();
            });
        },
        toggle_save_button: function () {
            var $button = this.$('.button.next');
            if (this.editing_client) {
                $button.attr('disabled', 'disabled');
                return;
            } else if (this.new_client) {
                if (!this.old_client) {
                    $button.text(_t('Set Customer'));
                } else {
                    $button.text(_t('Change Customer'));
                }
            } else {
                $button.text(_t('Deselect Customer'));
            }
            if (this.has_client_changed()) {
                $button.removeAttr('disabled')
            } else {
                $button.attr('disabled', 'disabled');
            }
        },
        // Shows,hides or edit the customer details box :
        // visibility: 'show', 'hide' or 'edit'
        // partner:    the partner object to show or edit
        // clickpos:   the height of the click on the list (in pixel), used
        //             to maintain consistent scroll.
        display_client_details: function (visibility, partner, clickpos) {
            var self = this;
            var searchbox = this.$('.searchbox input');
            var contents = this.$('.client-details-contents');
            var parent = this.$('.client-list').parent();
            contents.off('click', '.button.edit');
            contents.off('click', '.button.close');
            contents.off('click', '.button.save');
            contents.off('click', '.button.undo');
            contents.on('click', '.button.edit', function () { self.edit_client_details(partner); });
            contents.on('click', '.button.save', function () { self.save_client_details(partner); });
            contents.on('click', '.button.undo', function () { self.undo_client_details(partner); });
            contents.on('click', '.button.close', function () {
                self.display_client_details('hide');
            });
            this.editing_client = false;
            this.uploaded_picture = null;
            if (visibility === 'hide') {
                contents.addClass('oe_hidden');
            } else {
                contents.removeClass('oe_hidden');
            }
            if (visibility === 'show') {
                contents.empty();
                contents.append($(QWeb.render('ClientDetails', { widget: this, partner: partner })));
                this.details_visible = true;
                this.toggle_save_button();
            } else if (visibility === 'edit') {
                // Connect the keyboard to the edited field
                if (this.pos.config.iface_vkeyboard && this.chrome.widget.keyboard) {
                    contents.off('click', '.detail');
                    searchbox.off('click');
                    contents.on('click', '.detail', function (ev) {
                        self.chrome.widget.keyboard.connect(ev.target);
                        self.chrome.widget.keyboard.show();
                    });
                    searchbox.on('click', function () {
                        self.chrome.widget.keyboard.connect($(this));
                    });
                }

                this.editing_client = true;
                contents.empty();
                contents.append($(QWeb.render('ClientDetailsEdit', { widget: this, partner: partner })));
                this.toggle_save_button();

                // Browsers attempt to scroll invisible input elements
                // into view (eg. when hidden behind keyboard). They don't
                // seem to take into account that some elements are not
                // scrollable.
                contents.find('input').blur(function () {
                    setTimeout(function () {
                        self.$('.window').scrollTop(0);
                    }, 0);
                });

                contents.find('.client-address-country').on('change', function (ev) {
                    var $stateSelection = contents.find('.client-address-states');
                    var value = this.value;
                    $stateSelection.empty()
                    $stateSelection.append($("<option/>", {
                        value: '',
                        text: 'None',
                    }));
                    self.pos.states.forEach(function (state) {
                        if (state.country_id[0] == value) {
                            $stateSelection.append($("<option/>", {
                                value: state.id,
                                text: state.name
                            }));
                        }
                    });
                });

                contents.find('.image-uploader').on('change', function (event) {
                    self.load_image_file(event.target.files[0], function (res) {
                        if (res) {
                            contents.find('.client-picture img, .client-picture .fa').remove();
                            contents.find('.client-picture').append("<img src='" + res + "'>");
                            contents.find('.detail.picture').remove();
                            self.uploaded_picture = res;
                        }
                    });
                });
            } else if (visibility === 'hide') {
                contents.empty();
                parent.height('100%');
                // if( height > scroll ){
                //     contents.css({height:height+'px'});
                //     contents.animate({height:0},400,function(){
                //         contents.css({height:''});
                //     });
                // }else{
                //     parent.scrollTop( parent.scrollTop() - height);
                // }
                this.details_visible = false;
                this.toggle_save_button();
            }
        },
        line_select: function (event, $line, id) {
            var partner = this.pos.db.get_partner_by_id(id);
            this.$('.client-list .lowlight').removeClass('lowlight');
            if ($line.hasClass('highlight')) {
                $line.removeClass('highlight');
                $line.addClass('lowlight');
                this.new_client = null;
                this.toggle_save_button();
            } else {
                this.$('.client-list .highlight').removeClass('highlight');
                $line.addClass('highlight');
                this.new_client = partner;
                this.toggle_save_button();
            }
        },
    });

    screens.NumpadWidget.include({
        changedMode: function () {
            this._super();
            var mode = this.state.get("mode");
            $(".order-container").data('mode', mode).attr('data-mode', mode);
        },
        clickChangeMode: function (event) {
            if (event.currentTarget.attributes['data-mode'].nodeValue === "remove_order_line") {
                var order = this.pos.get_order();
                if (order && order.get_selected_orderline()) {
                    order.get_selected_orderline().set_quantity('remove');
                }
            } else {
               this._super(event);
            }
        },
    });

    return {
        ProductCategoriesWidget: ProductCategoriesWidget,
        OrderWidget: OrderWidget,
        ProductScreenWidget: ProductScreenWidget,
        ClientListScreenWidget: ClientListScreenWidget,
    };
});