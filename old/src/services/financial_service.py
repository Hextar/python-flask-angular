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
				stock_data = web.data.get_data_yahoo(s, start, end)
				response_dict["result"] = "OK"

				temp = json.loads(stock_data.to_json(orient="index"))

				print(temp.keys())
				values = {}
				for idy, ts in enumerate(temp.keys()):
					values[idy] = {
						"timestamp": ts,
						"value": temp[ts]['Close']
					}

				response_dict["data"] [idx] = {
					"label": s,
					"values": values
	        	}
			return response_dict, 200
		except:
			response_dict["result"] = 'KO'
			response_dict["message"] = 'Could not find any stock'
			return response_dict, 500    
