# -*- coding: utf-8 -*-

{
    'name': "Barcode",
    'summary': "Use barcode scanners to process logistics operations",
    'description': """
This module enables the barcode scanning feature for the warehouse management system.
    """,
    'category': 'Operations/Inventory',
    'version': '1.0',
    'depends': ['barcodes', 'stock', 'web_tour'],
    'data': [
        'views/stock_inventory_views.xml',
        'views/stock_picking_views.xml',
        'views/stock_move_line_views.xml',
        'views/stock_barcode_templates.xml',
        'views/stock_barcode_views.xml',
        'views/res_config_settings_views.xml',
        'views/stock_scrap_views.xml',
        'views/stock_location_views.xml',
        'wizard/stock_barcode_lot_view.xml',
        'data/data.xml',
    ],
    'qweb': [
        "static/src/xml/stock_barcode.xml",
        "static/src/xml/qweb_templates.xml",
    ],
    'demo': [
        'data/demo.xml',
    ],
    'installable': True,
    'application': True,
    'license': 'OEEL-1',
}
