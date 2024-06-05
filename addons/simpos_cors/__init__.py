from odoo import http
import werkzeug.datastructures

load_addons_org = http.root.load_addons


class CORSMiddleware(object):
    """Add Cross-origin resource sharing headers to every request."""

    def __init__(self, app):
        self.app = app

    def __call__(self, environ, start_response):
        def add_cors_headers(status, headers):
            headers = werkzeug.datastructures.Headers(headers)
            headers['Access-Control-Allow-Origin'] = '*'
            headers['Access-Control-Allow-Headers'] = 'origin, x-csrftoken, content-type, accept, x-openerp-session-id, authorization'
            headers['Access-Control-Allow-Credentials'] = 'true'
            headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, OPTIONS'
        
            return start_response(status, headers.to_wsgi_list())

        if environ.get("REQUEST_METHOD") == "OPTIONS":
            add_cors_headers("200 Ok", [("Content-Type", "text/plain")])
            return [b'200 Ok']

        return self.app(environ, add_cors_headers)


def load_addons(*k, **kw):
    load_addons_org(*k, **kw)
    http.root.dispatch.app = CORSMiddleware(http.root.dispatch.app)


http.root.load_addons = load_addons
