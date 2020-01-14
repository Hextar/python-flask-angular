from src import app
from datetime import datetime
from src.services.financial_service import FinancialService


# expose a blank page with the label 'OK'
@app.route('/')
def het_home():
    return 'OK'

# expose a GET endpoint to be called from the front-end
@app.route('/stocks', methods=("GET", "POST"))
def get_financials():
    try:
        # Get Corn, Gasoline and Nasdaq stocks
        stocks = ["CROP", "UGA", "NDAQ"]
        
        # Ask for 5 years of data
        start = datetime(2020, 1, 1)
        end = datetime(2020, 1, 10)

        # Get data from the financial service and return it
        financial_service = FinancialService()
        return financial_service.get_stocks(stocks = stocks, start = start, end = end)
    except:
        # Return a 500 Internal Server Error
        return {"result": "KO"}, 500