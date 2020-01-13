# -*- coding: utf-8 -*-
"""Default api blueprints for Demo application."""

from flask import Blueprint, jsonify


route = Blueprint('financial', __name__)


@route.route("/api/financial")
def get():
    return "financial"