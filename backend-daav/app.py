# coding=utf-8
from flask import Flask
from flask_cors import CORS
from flask import request
from flask import jsonify

from datetime import datetime
from services.financial_service import FinancialService

# creating the Flask application
app = Flask(__name__,
    static_folder='./backend-daav/src/static',
    template_folder='./backend-daav/src/templates')

# allowing cors for google-chrome
CORS(app)

# expose a blank page with the label 'OK'
@app.route('/')
def het_home():
    return jsonify('OK')

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
            return jsonify(financial_service.get_stocks(stocks = stocks, start = start, end = end))
        except:
            # Return a 500 Internal Server Error
            return jsonify({"result": "KO"}), 400
    else:
        # Return a 405 Internal Server Error
        return jsonify({"result": "KO"}), 405

# run app
if __name__ == "__main__":
	app.run(debug=True, host='0.0.0.0', port=5000)
