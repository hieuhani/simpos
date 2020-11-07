# -*- coding: utf-8 -*-
{
    'name': "Polaco Branding",

    'summary': """
        Polaco Branding""",

    'description': """
        Polaco Branding
    """,

    'author': "Hieu Tran",
    'website': "http://youngtailors.com",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/12.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'Uncategorized',
    'version': '0.1',
    'qweb': [
        'static/src/xml/*.xml',
    ],
    # any module necessary for this one to work correctly
    'depends': ['portal', 'web', 'mail'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/ir_model_view.xml',
        'data/ir_menu_data.xml',
        'data/mailbot_data.xml',
    ],
}