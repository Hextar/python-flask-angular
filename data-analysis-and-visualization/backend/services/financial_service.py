import json
import pandas as pd 
from datetime import datetime
import pandas_datareader as web
from typing import List
from sklearn.linear_model import LinearRegression
pd.plotting.register_matplotlib_converters()

LAST_N_DAYS = 3

class FinancialService:

	def __init__(self):
		pass

	def get_average(self, sum = int, len = int):
		try:
			return sum / min(len, LAST_N_DAYS)
		except:
			return 0

	def get_stocks(self, stocks = List[str], start = datetime, end = datetime):
		# prepare the response json
		response_dict = {
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

				# pretty parse of timestamp, value couples
				values = {}
				average_sum = 0
				for idy, ts in enumerate(json_stock_data.keys()):
					values[idy] = {
						"timestamp": ts,
						"value": json_stock_data[ts]['Close'],
					}
					# use the last 3 days to calculate the average
					if idy >= len(values) - LAST_N_DAYS:
						average_sum += json_stock_data[ts]['Close']

				# final stock parsing
				response_dict["data"][idx] = {
					"label": s,
					"values": values,
					"forecasted_value": self.get_average(average_sum, len(json_stock_data))
	        	}
			return response_dict, 200
		except:
			response_dict["result"] = 'KO'
			response_dict["message"] = 'Could not find any stock'
			return response_dict, 500