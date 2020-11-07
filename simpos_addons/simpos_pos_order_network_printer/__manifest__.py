# -*- coding: utf-8 -*-
{
    'name': "Simpos Order Network Printer",

    'summary': """
        Simpos Order Network Printer""",

    'description': """
        Simpos Order Network Printer
    """,

    'author': "Hieu Tran",
    'website': "http://www.youngtailors.com",
    'category': 'Uncategorized',
    'version': '0.1',
    'depends': ['pos_restaurant'],

    'qweb': [
        'static/src/xml/multiprint.xml',
    ],
    'data': [
        'views/views.xml',
        'views/pos_restaurant_views.xml',
    ],
}
