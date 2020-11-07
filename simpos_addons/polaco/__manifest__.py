# -*- encoding: utf-8 -*-

{
    'name': 'Polaco Backend Theme',
    'description': 'Polaco Backend Theme',
    'category': 'Themes/Backend',
    'version': '1.0',
    'author': 'Young Tailor',
    'live_test_url': 'http://45.77.38.140:8012',
    'description':
        """
Polaco Theme
===========================
Polaco Theme
        """,
    'depends': ['web'],
    'qweb': [
        "static/src/xml/*.xml",
    ],
    'data': [
        'views/webclient_templates.xml',
    ],
    'auto_install': True,
    'support': 'youngtailor92@gmail.com',
    'license': 'LGPL-3',
    'price': 85,
    'images': [
        'static/description/a_screenshot.png',
        'static/description/zala.jpg',
    ],
    'currency': 'EUR',
}
