# -*- coding: utf-8 -*-
import logging
from odoo import http
from odoo.http import request
from odoo.addons.web.controllers.main import ensure_db
from datetime import datetime, timedelta
from odoo.osv.expression import AND
import jwt

_logger = logging.getLogger(__name__)


def make_error(message):
    return dict(success=False, error=message)

class AuthTokenController(http.Controller):
    @http.route('/exchange_token', type='json', auth='none', cors='*')
    def get_token(self, **args):
        ensure_db()
        request.env['res.users'].sudo()
        db_name = request.session.db
        user_id = request.session.authenticate(db_name, args.get('login'), args.get('password'))

        if user_id:
            request.session.uid = user_id
            request.session.login = args.get('login')
            request.session.get_context()

            user = request.env['res.users'].sudo().browse(user_id)
            user._update_last_login()

            token = jwt.encode({
                'uid': user_id,
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(days=90)
            }, request.env['ir.config_parameter'].sudo().get_param('database.secret'), algorithm="HS256")
            return {
                'success': True,
                'data': {
                    'access_token': token,
                    'db_name': db_name,
                    'uid': user_id,
                    'user_context': request.session.get_context() if request.session.uid else {},
                    "name": user.name,
                    "username": user.login,
                },
            }

        return make_error('Incorrect login name or password')

    @http.route('/pos_metadata', type='json', auth='none', cors='*')
    def pos_metadata(self, **args):
        ensure_db()
        token = request.httprequest.headers.get('Authorization')
        if token:
            token = token.replace('Bearer ', '')
            payload = jwt.decode(token, request.env['ir.config_parameter'].sudo().get_param('database.secret'), algorithms=["HS256"])
            request.uid = payload.get('uid')
            config_id = args.get('login')

            domain = [
                ('state', '=', 'opened'),
                ('user_id', '=', request.session.uid),
                ('rescue', '=', False)
                ]

            if config_id:
              domain = AND([domain,[('config_id', '=', int(config_id))]])

            pos_session = request.env['pos.session'].sudo().search(domain, limit=1)

            # The same POS session can be opened by a different user => search without restricting to
            # current user. Note: the config must be explicitly given to avoid fallbacking on a random
            # session.
            if not pos_session and config_id:
                domain = [
                    ('state', '=', 'opened'),
                    ('rescue', '=', False),
                    ('config_id', '=', int(config_id)),
                ]
                pos_session = request.env['pos.session'].sudo().search(domain, limit=1)

            if not pos_session:
              return make_error('No POS Session found')
            session_info = request.env['ir.http'].session_info()
            session_info['user_context']['allowed_company_ids'] = pos_session.company_id.ids
            context = {
                'session_info': session_info,
                'login_number': pos_session.login(),
            }
            return context

        return make_error('No token specified')
