# -*- coding: utf-8 -*-
{
    'name': "Baumkuchen",

    'summary': """
        Baumkuchen customization""",

    'description': """
        Baumkuchen customization
    """,

    'author': "Hieu Tran",
    'website': "https://youngtailors.com",
    'category': 'Uncategorized',
    'version': '0.1',
    'depends': ['polaco', 'simpos', 'simpos_vibration_card'],
    'qweb': [
        'static/src/xml/*.xml',
    ],
    'data': [
        'views/webclient_templates.xml',
    ],
}
