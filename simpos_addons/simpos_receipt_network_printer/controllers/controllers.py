# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import tempfile
from odoo.exceptions import UserError
import os
from contextlib import closing
import logging
from odoo.tools.misc import find_in_path
from odoo import _
import subprocess
import lxml.html
from escpos.printer import Network


_logger = logging.getLogger(__name__)

def _get_wkhtmltopdf_bin():
    return find_in_path('wkhtmltoimage')

class SimposPosReceitNetworkPrinter(http.Controller):
    @http.route('/simpos_pos_receit_network_printer/simpos_pos_receit_network_printer/', auth='public')
    def index(self, **kw):
        html = request.env['ir.ui.view'].render_template("simpos_receipt_network_printer.simpos_receipt_bill")
        html = html.decode('utf-8')
        command_args = [
            '--disable-smart-width',
            '--width',
            '560',
        ]
        temporary_files = []
        body_file_fd, body_file_path = tempfile.mkstemp(suffix='.html', prefix='simpos_receipt')
        with closing(os.fdopen(body_file_fd, 'wb')) as body_file:
            body_file.write(bytearray(html, 'utf-8'))
        temporary_files.append(body_file_path)

        pdf_report_fd, pdf_report_path = tempfile.mkstemp(suffix='.jpg', prefix='simpos_receipt.tmp.')
        os.close(pdf_report_fd)
        temporary_files.append(pdf_report_path)

        try:
            wkhtmltopdf = [_get_wkhtmltopdf_bin()] + command_args + [body_file_path] + [pdf_report_path]
            process = subprocess.Popen(wkhtmltopdf, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
            out, err = process.communicate()
            if process.returncode not in [0, 1]:
                if process.returncode == -11:
                    message = _(
                        'Wkhtmltoimage failed (error code: %s). Memory limit too low or maximum file number of subprocess reached. Message : %s')
                else:
                    message = _('Wkhtmltoimage failed (error code: %s). Message: %s')
                raise UserError(message % (str(process.returncode), err[-1000:]))
            else:
                if err:
                    _logger.warning('wkhtmltoimage: %s' % err)
        except:
            raise
        kitchen = Network("192.168.97.11")
        kitchen.image(pdf_report_path)
        kitchen.cut()
        for temporary_file in temporary_files:
            try:
                os.unlink(temporary_file)
            except (OSError, IOError):
                _logger.error('Error when trying to remove file %s' % temporary_file)

        return 'printed'
