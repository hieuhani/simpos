odoo.define('simpos.gui', function (require) {
    "use strict";
    // this file contains the Gui, which is the pos 'controller'. 
    // It contains high level methods to manipulate the interface
    // such as changing between screens, creating popups, etc.
    //
    // it is available to all pos objects trough the '.gui' field.
    
    var GuiParent = require('point_of_sale.gui');
    
    
    GuiParent.Gui = GuiParent.Gui.extend({
        // display a screen. 
        // If there is an order, the screen will be saved in the order
        // - params: used to load a screen with parameters, for
        // example loading a 'product_details' screen for a specific product.
        // - refresh: if you want the screen to cycle trough show / hide even
        // if you are already on the same screen.
        show_screen: function(screen_name,params,refresh,skip_close_popup) {
            var screen = this.screen_instances[screen_name];
            if (!screen) {
                console.error("ERROR: show_screen("+screen_name+") : screen not found");
            }
            if (!skip_close_popup){
                this.close_popup();
            }
            var order = this.pos.get_order();
            if (order) {
                var old_screen_name = order.get_screen_data('screen');
    
                order.set_screen_data('screen',screen_name);
    
                if(params){
                    order.set_screen_data('params',params);
                }
    
                if( screen_name !== old_screen_name ){
                    order.set_screen_data('previous-screen',old_screen_name);
                }
            }
    
            if (refresh || screen !== this.current_screen) {
                if (this.current_screen) {
                    if (!~this.current_screen.el.className.indexOf('product-screen')) {
                        this.current_screen.close();
                        this.current_screen.hide();
                    }
                    
                }
                this.current_screen = screen;
                this.current_screen.show(refresh);
            }
        },
    });
});
