# -*- coding: utf-8 -*-
from odoo import http
from odoo.http import request
import json
from odoo.osv import expression
from .serializers import Serializer
from .exceptions import QueryFormatError


def error_response(error, msg):
    return {
        "jsonrpc": "2.0",
        "id": None,
        "error": {
          "code": 200,
          "message": msg,
          "data": {
              "name": str(error),
              "debug": "",
              "message": msg,
              "arguments": list(error.args),
              "exception_type": type(error).__name__
          }
        }
    }


class SimposEcommerce(http.Controller):
    @http.route('/api/simpos_ecommerce/product.public.category', type='http', methods=['GET'], auth='public')
    def categories(self, **kw):
        categories = request.env['product.public.category'].search([])
        try:
            serializer = Serializer(categories, query="{id, name, display_name, parent_id, sequence}", many=True)
            data = serializer.data
        except (SyntaxError, QueryFormatError) as e:
            res = error_response(e, e.msg)
            return http.Response(
                json.dumps(res),
                status=200,
                mimetype='application/json'
            )
        res = {
            "result": data
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )

    @http.route('/api/simpos_ecommerce/product.template', type='http', methods=['GET'], auth='public')
    def products(self, **params):
        domains = [[("sale_ok", "=", True)], [("website_published", "=", True)]]
        if 'search' in params:
            for srch in params['search'].split(" "):
                subdomains = [
                    [('name', 'ilike', srch)],
                    [('product_variant_ids.default_code', 'ilike', srch)],
                    [('description', 'ilike', srch)],
                    [('description_sale', 'ilike', srch)],
                ]

                domains.append(expression.OR(subdomains))
        if 'category_id' in params:
            domains.append([('public_categ_ids', 'child_of', int(params['category_id']))])
        limit = int(params['limit']) if 'limit' in params else 20
        offset = int(params['offset']) if 'offset' in params else 0
        products = request.env['product.template'].with_context(bin_size=True)\
            .search(expression.AND(domains), limit=limit, offset=offset)
        current_website = request.env['website'].get_current_website()
        pricelist = current_website.get_current_pricelist()

        combinations = {}
        product_attributes = {}
        for product in products:
            combination = product._get_first_possible_combination()
            combination_info = product._get_combination_info(
                combination,
                only_template=True,
                add_qty=1,
                product_id=product,
                pricelist=pricelist
            )
            combinations[product.id] = {
                'combination': combination_info
            }
            product_attributes[product.id] = {
                'attributes': [{
                        'id': ptal.attribute_id.id,
                        'name': ptal.attribute_id.name,
                        'display_type': ptal.attribute_id.display_type,
                        'single_and_custom': len(ptal.product_template_value_ids._only_active()) == 1 and ptal.product_template_value_ids._only_active()[0].is_custom,
                        'options': [{
                            'id': ptav.id,
                            'name': ptav.name,
                            'is_custom': ptav.is_custom,
                            'price_extra': ptav.price_extra,
                        } for ptav in ptal.product_template_value_ids._only_active()]
                    } for ptal in product.valid_product_template_attribute_line_ids]
            }
        try:
            serializer = Serializer(products,
                                    many=True,
                                    query="{id, display_name, name, sequence,"
                                          "description, description_sale,"
                                          "lst_price, list_price, price, currency_id, taxes_id,"
                                          "barcode, default_code, rating_count, rating_avg, type,"
                                          "website_meta_title,"
                                          "website_meta_description,"
                                          "website_meta_keywords,"
                                          "website_meta_og_img}")
            data = []
            for product in serializer.data:
                product.update(combinations[product['id']])
                product.update(product_attributes[product['id']])
                data.append(product)
        except (SyntaxError, QueryFormatError) as e:
            res = error_response(e, e.msg)
            return http.Response(
                json.dumps(res),
                status=200,
                mimetype='application/json'
            )
        res = {
            "result": data
        }
        return http.Response(
            json.dumps(res),
            status=200,
            mimetype='application/json'
        )
