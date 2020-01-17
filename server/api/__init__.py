from flask import request, jsonify
from flask_restplus import Api, Resource, fields
from datetime import datetime
from config import config 
from api.services.stock_service import StockService
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
			example="2019-12-30",
			help="format: yyyy-MM-dd"
		),
		"end": fields.String(
			description="Analysis end date",
			example="2019-12-31",
			help="format: yyyy-MM-dd"
		)
	})

@api.route("/stocks")
class StocksAPI(Resource):
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

			# Get data from the stock service and return it
			stocks_service = StockService()
			return jsonify(result="OK", data=stocks_service.get_stocks(stocks = stocks, start = start, end = end))
		except:
            # Return a 400 Internal Server Error
			return {"result": "KO"}, 400
