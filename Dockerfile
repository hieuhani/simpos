FROM docker.io/bitnami/odoo:16

COPY ./addons /opt/bitnami/odoo/addons

RUN pip3 install --upgrade pip; pip3 install PyJWT
