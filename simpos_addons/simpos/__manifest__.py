# -*- coding: utf-8 -*-
{
    'name': "Simpos",

    'summary': """
        Simpos""",

    'description': """
        Simpos
    """,

    'author': "Hieu Tran",
    'website': "http://hieutran.youngtailors.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/12.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['point_of_sale'],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
    ],
}