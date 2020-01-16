from flask import request, jsonify
from datetime import datetime
from typing import List
import json
import pandas as pd 
import pandas_datareader as web
pd.plotting.register_matplotlib_converters()

class StockService:

	def __init__(self, last_n_days = 3):
		self.last_n_days = last_n_days

	def get_average(self, sum = int, len = int):
		try:
			return sum / min(len, self.last_n_days)
		except:
			return 0

	def get_stocks(self, stocks = List[str], start = datetime, end = datetime):
		# prepare the response json
		response = {
    	    "result": "OK",
    	    "data": {}
    	}
		try:
			# for each stock in the list
			for idx, s in enumerate(stocks):
				# get data from pandas_datareader 
				stock_data = web.data.get_data_yahoo(s, start, end)

				# parse stocks as json
				json_stock_data = json.loads(stock_data.to_json(orient="index"))
				json_length = len(json_stock_data)

				# pretty parse of timestamp, value couples
				values = {}
				average_sum = 0
				for idy, ts in enumerate(json_stock_data.keys()):
					values[idy] = {
						"timestamp": ts,
						"value": json_stock_data[ts]['Close'],
					}
					# use the last 3 days to calculate the average
					if (idy >= (json_length - self.last_n_days)):
						average_sum += json_stock_data[ts]['Close']

				# final stock parsing
				response["data"][idx] = {
					"label": s,
					"values": values,
					"forecasted_value": self.get_average(average_sum, json_length)
	        	}
			return response, 200
		except:
			response["result"] = "KO"
			response["message"] = "Could not find any stock"
			return response, 500
