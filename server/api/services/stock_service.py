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

	def get_forecast(self, df):
		dfreg = df.loc[:,["Adj Close","Volume"]]
		dfreg["HL_PCT"] = (df["High"] - df["Low"]) / df["Close"] * 100.0
		dfreg["PCT_change"] = (df["Close"] - df["Open"]) / df["Open"] * 100.0

	def get_stocks(self, stocks = List[str], start = datetime, end = datetime):
		# Prepare the response json
		stock_data = []
		try:
			# For each stock in the list
			for s in stocks:
				# Get the data frame from pandas_datareader 
				df = web.data.get_data_yahoo(s, start, end)

				# Parse the data frame as a json
				jdf = json.loads(df.to_json(orient="index"))

				forecast = self.get_forecast(df)

				# Pretty parse of timestamp, value couples
				points = []
				average_sum = 0
				for idy, timestamp in enumerate(jdf.keys()):
					# Append the timestamp/couple
					points.append({
						"timestamp": timestamp,
						"value": jdf[timestamp]['Close']
					})
		
					# Use the last 3 days to calculate the average
					if (idy >= (len(jdf) - self.last_n_days)):
						average_sum += jdf[timestamp]['Close']

				# Final stock parsing
				stock_data.append({
					"label": s,
					"points": points,
					"closing_price_forecast": self.get_average(average_sum, len(jdf))
	        	})
			return stock_data
		except:
			return []
