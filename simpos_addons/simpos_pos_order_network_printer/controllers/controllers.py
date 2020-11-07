# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import logging
import base64
import io
from PIL import Image, ImageOps
from escpos.printer import Network

_logger = logging.getLogger(__name__)

class SimposPosReceitNetworkPrinter(http.Controller):
    @http.route('/simpos_pos_order_network_printer/print_pos_order', type='json', auth='user')
    def print(self, ip, img, **kw):
        receipt = base64.b64decode(img)
        im = Image.open(io.BytesIO(receipt))

        kitchen = Network(ip)
        kitchen.image(im)
        kitchen.cut()
        return im
