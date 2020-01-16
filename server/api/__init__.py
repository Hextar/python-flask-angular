from flask import request, jsonify
from flask_restplus import Api, Resource, fields
from datetime import datetime
from config import config 
from api.services.financial_service import FinancialService
import json

api = Api(prefix=config.API_PREFIX)

stock_payload = api.model("stock_request", {
		"stocks": fields.List(
			fields.String(
				description="The market stock abbreviation",
				example="CROP"
			),
		),
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

	def post(self):
		"""Getting the analysis for a stock list and start-end date"""
		try:
			# Decode the payload
			data = json.loads(request.data.decode("utf-8"))

			# Parse the start/end strings to datetime
			stocks = data["stocks"]
			start = datetime.strptime(data["start"], "%Y-%m-%d")
			end =  datetime.strptime(data["end"], "%Y-%m-%d")

			# Get data from the financial service and return it
			financial_service = FinancialService()
			return jsonify(financial_service.get_stocks(stocks = stocks, start = start, end = end))
		except KeyError as key_error:
			api.abort(500, key_error.__doc__, status="Could not save information", statusCode="500")
			return jsonify(str(key_error.__doc__)), 500
		except Exception as exp:
			api.abort(400, exp.__doc__, status="Could not save information", statusCode="400")
			return jsonify(str(exp.__doc__)), 400