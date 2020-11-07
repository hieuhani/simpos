# -*- coding: utf-8 -*-
{
    'name': "Simpos Customer Display",

    'summary': """
        Simpos Customer Display""",

    'description': """
        Simpos Customer Display
    """,

    'author': "Hieu Tran",
    'website': "https://youngtailors.com",

    'category': 'Uncategorized',
    'version': '0.1',
    'depends': ['point_of_sale'],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    'data': [
        'views/views.xml'
    ],
}
