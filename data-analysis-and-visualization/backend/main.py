# coding=utf-8

from flask_cors import CORS
from flask import Flask, jsonify, request, render_template, redirect, session

from datetime import datetime
import matplotlib.pyplot as plt
import numpy as np

from .services.financial_service import FinancialService

# creating the Flask application
app = Flask(__name__,
    static_folder='./src/static',
    template_folder='./src/templates')
CORS(app)

if __name__ == "__main__":
    app.run(debug=True)

@app.route('/stocks', methods=("POST", "GET"))
def get_financials():
    try:
        # Get Corn, Gasoline and Nasdaq stocks
        stocks = ["CROP", "UGA", "NDAQ"]
        
        # Ask for 5 years of data
        start = datetime(2020, 1, 1)
        end = datetime(2020, 1, 3)

        # Get data from the financial service
        financial_service = FinancialService
        return financial_service.get_stocks(stocks = stocks, start = start, end = end)
    except:
        return {"result": "KO"}, 500