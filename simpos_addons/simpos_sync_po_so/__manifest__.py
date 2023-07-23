# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.
{
    'name': 'Generate Sale Order from Purchase Order',
    'version': '2.1',
    'category': 'Tools',
    'description': """
Generate Sale Order from Purchase Order
========================
    """,
    'depends': ['purchase'],
    'data': [
        'views/res_partner_views.xml',
    ],
    'installable': True,
}
