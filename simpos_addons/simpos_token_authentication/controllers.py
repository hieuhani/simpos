# -*- coding: utf-8 -*-
import logging
from odoo import http
from odoo.http import request
from odoo.addons.web.controllers.main import ensure_db
from datetime import datetime, timedelta
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
            }, request.env['ir.config_parameter'].sudo().get_param('database.secret'))
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
