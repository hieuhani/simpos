import os
import jinja2
import json
import werkzeug.utils
import threading
from odoo import http
from odoo.http import request
from odoo.osv.expression import AND

path = os.path.realpath(os.path.join(os.path.dirname(__file__), '../views'))
loader = jinja2.FileSystemLoader(path)

jinja_env = jinja2.Environment(loader=loader, autoescape=True)
jinja_env.filters["json"] = json.dumps

pos_display_template = jinja_env.get_template('pos_display.html')

class SimposCustomerDisplay(http.Controller):
    def __init__(self):
        super(SimposCustomerDisplay, self).__init__()
        self.event_data = threading.Event()
        self.rendered_html = ''

    @http.route('/simpos_customer_display', type='http', auth='user')
    def index(self, config_id=False, **kw):
        domain = [
                ('state', '=', 'opened'),
                ('user_id', '=', request.session.uid),
                ('rescue', '=', False)
                ]
        if config_id:
            domain = AND([domain,[('config_id', '=', int(config_id))]])
        pos_session = request.env['pos.session'].sudo().search(domain, limit=1)
        if not pos_session:
            return werkzeug.utils.redirect('/web#action=point_of_sale.action_client_pos_menu')

        cust_js = None
        with open(os.path.join(os.path.dirname(__file__), "../static/src/js/worker.js")) as js:
            cust_js = js.read()
        return pos_display_template.render({
            'title': "Chateraise",
            'breadcrumb': 'POS Client display',
            'cust_js': cust_js,
        })

    @http.route('/simpos_customer_display/get_serialized_order', type='json', auth='user')
    def get_serialized_order(self, config_id=False, **kw):
        domain = [
                ('state', '=', 'opened'),
                ('user_id', '=', request.session.uid),
                ('rescue', '=', False)
                ]
        if config_id:
            domain = AND([domain,[('config_id', '=', int(config_id))]])
        pos_session = request.env['pos.session'].sudo().search(domain, limit=1)
        if not pos_session:
            return werkzeug.utils.redirect('/web#action=point_of_sale.action_client_pos_menu')
        if self.event_data.wait(28):
            self.event_data.clear()
            return {'rendered_html': self.rendered_html}
        return {'rendered_html': False}

    @http.route('/simpos_customer_display/update_html', type='json', auth='user')
    def take_control(self, html=None):
        self.rendered_html = html
        self.event_data.set()
