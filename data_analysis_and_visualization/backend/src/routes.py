from src import app
from datetime import datetime
from src.services.financial_service import FinancialService
from flask import request


# expose a blank page with the label 'OK'
@app.route('/')
def het_home():
    return 'OK'

# expose a GET endpoint to be called from the front-end
@app.route('/stocks', methods=("GET", "POST"))
def get_financials():
    if request.method == 'POST':
        try:
            # Get payload
            data = request.get_json(force=True, silent=True)

            # Get args
            stocks = data['stocks']
            start_str = data['start']
            end_str = data['end']

            # Parse the str to datetime
            start = datetime.strptime(start_str, '%Y-%m-%d')
            end =  datetime.strptime(end_str, '%Y-%m-%d')

            # Get data from the financial service and return it
            financial_service = FinancialService()
            return financial_service.get_stocks(stocks = stocks, start = start, end = end)
        except:
            # Return a 500 Internal Server Error
            return {"result": "KO"}, 400
    else:
        # Return a 405 Internal Server Error
        return {"result": "KO"}, 405