import json
import pandas as pd 
from datetime import datetime
import pandas_datareader as web
from typing import List
from sklearn.linear_model import LinearRegression

pd.plotting.register_matplotlib_converters()

LAST_N_DAYS = 3

class FinancialService():


	def get_stocks(stocks = List[str], start = datetime, end = datetime):
		# prepare the response json
		response_dict = {
    	    "result": "OK",
    	    "data": {}
    	}
		try:
			print (LAST_N_DAYS)
			# for each stock in the list
			for idx, s in enumerate(stocks):
				# get data from pandas_datareader 
				stock_data = web.data.get_data_yahoo(s, start, end)

				# parse stocks as json
				json_stock_data = json.loads(stock_data.to_json(orient="index"))

				# pretty parse of timestamp, value couples
				values = {}
				average = 0
				for idy, ts in enumerate(json_stock_data.keys()):
					values[idy] = {
						"timestamp": ts,
						"value": json_stock_data[ts]['Close'],
					}
					# use the last 3 days to calculate the average
					if idy >= len(values) - LAST_N_DAYS:
						average += json_stock_data[ts]['Close']

				# final stock parsing
				response_dict["data"][idx] = {
					"label": s,
					"values": values,
					"forecasted_value": average / LAST_N_DAYS
	        	}
			return response_dict, 200
		except:
			response_dict["result"] = 'KO'
			response_dict["message"] = 'Could not find any stock'
			return response_dict, 500