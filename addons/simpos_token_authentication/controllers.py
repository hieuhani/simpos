# -*- coding: utf-8 -*-
import logging
from odoo import http
from odoo.http import request
from datetime import datetime, timedelta
import jwt


def make_error(message):
    return dict(success=False, error=message)


class AuthTokenController(http.Controller):
    @http.route('/simpos/v1/sign_in', type='json', auth='none')
    def get_token(self, **args):
        db_name = request.session.db
        user_id = request.session.authenticate(
            db_name, args.get('login'), args.get('password'))

        if user_id:
            request.session.uid = user_id
            request.session.login = args.get('login')

            user = request.env['res.users'].sudo().browse(user_id)
            user._update_last_login()
            secret_key = request.env['ir.config_parameter'].sudo(
            ).get_param('database.secret')
            token = jwt.encode({
                'uid': user_id,
                'iat': datetime.utcnow(),
                'exp': datetime.utcnow() + timedelta(days=90)
            }, secret_key, algorithm="HS256")
            return {
                'success': True,
                'data': {
                    'access_token': token,
                    'db_name': db_name,
                    'uid': user_id,
                    "name": user.name,
                    "username": user.login,
                },
            }

        return make_error('Incorrect login name or password')
