# coding=utf-8
from flask_cors import CORS
from flask import Flask, jsonify, request, render_template, redirect, session
from datetime import datetime
from .services.financial_service import FinancialService

# creating the Flask application
app = Flask(__name__,
    static_folder='./src/static',
    template_folder='./src/templates')

# allowing cors for google-chrome
CORS(app)

# expose a GET endpoint to be called from the front-end
@app.route('/stocks', methods=("GET", "POST"))
def get_financials():
    try:
        # Get Corn, Gasoline and Nasdaq stocks
        stocks = ["CROP", "UGA", "NDAQ"]
        
        # Ask for 5 years of data
        start = datetime(2020, 1, 1)
        end = datetime(2020, 1, 3)

        # Get data from the financial service and return it
        financial_service = FinancialService()
        return financial_service.get_stocks(stocks = stocks, start = start, end = end)
    except:
        # Return a 500 Internal Server Error
        return {"result": "KO"}, 500

if __name__ == "__main__":
    app.run(debug=True)