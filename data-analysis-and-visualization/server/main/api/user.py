# -*- coding: utf-8 -*-
"""User Route for Demo application."""

from flask import Blueprint

from server.main.services.financial_service import FinancialService

route = Blueprint('user', __name__)

user_service = UserService()

@route.route("/api/users")
def test_db():
    users = user_service.all()
    return users