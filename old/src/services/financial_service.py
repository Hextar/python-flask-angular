import json
import pandas as pd 
from datetime import datetime
import pandas_datareader as web
from sklearn.linear_model import LinearRegression
from typing import List

pd.plotting.register_matplotlib_converters()

class FinancialService():

	def get_stocks(stocks = List[str], start = datetime, end = datetime):
		response_dict = {
    	    "result": "OK",
    	    "data": {}
    	}
		try:
			for idx, s in enumerate(stocks):
				# prepare the response json
				response_dict["result"] = "OK"

				# get data from pandas_datareader 
				stock_data = web.data.get_data_yahoo(s, start, end)

				# parse stocks as json
				json_stock_data = json.loads(stock_data.to_json(orient="index"))

				# pretty parse of timestamp, value
				values = {}
				average = 0
				for idy, ts in enumerate(json_stock_data.keys()):
					values[idy] = {
						"timestamp": ts,
						"value": json_stock_data[ts]['Close'],
					}
					average += json_stock_data[ts]['Close']
				print("<========", average)
				response_dict["data"][idx] = {
					"label": s,
					"values": values,
					"forecasted_value": average / len(values)
	        	}
			return response_dict, 200
		except:
			response_dict["result"] = 'KO'
			response_dict["message"] = 'Could not find any stock'
			return response_dict, 500    
