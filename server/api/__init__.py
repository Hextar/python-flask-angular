from flask import jsonify
from flask_restplus import Api, Resource, fields
import json
from config import config 
from api.services.financial_service import FinancialService

api = Api(prefix=config.API_PREFIX)

stock_label = fields.String(
		description="The market stock abbreviation",
		example="CROP"
	)
stock_payload = api.model("stock_request", {
		"stocks": fields.List(stock_label),
		"start": fields.String(
				description="Analysis start date",
				example="2020-12-30",
				help="format: yyyy-MM-dd"
			),
		"end": fields.String(
				description="Analysis end date",
				example="2020-12-30",
				help="format: yyyy-MM-dd"
			)
	})

@api.route("/stocks")
class StocksAPI(Resource):
	@api.doc(response={200: """{}"""})
	@api.expect(stock_payload)

	def post(self, stock_payload):
		"""Getting the analysis for a stock list and start-end date"""
		try:
			data = json.loads(request.data.decode('utf-8'))
			print(data)
			return jsonify(result="OK")
		except KeyError as key_error:
			api.abort(500, key_error.__doc__, status="Could not save information", statusCode="500")
			return jsonify(str(key_error.__doc__)), 500
		except Exception as exp:
			api.abort(400, exp.__doc__, status="Could not save information", statusCode="400")
			return jsonify(str(exp.__doc__)), 400


'''
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
'''