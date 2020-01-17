from flask import request, jsonify
from datetime import datetime
from typing import List
from api.services.data_frame_const import DataFrameConst as DF
from engine.machine_learning import MachineLearning
from enum import Enum     # for enum34, or the stdlib version
import json
import pandas as pd 
import pandas_datareader as web
pd.plotting.register_matplotlib_converters()
import threading
import logging as log


class StockService:

	def __init__(self):
		pass

	def get_ml_forecast(self, stock, df, days ):
		try:
			ml = MachineLearning()
			log.info("==== ML STARTS ====")
			forecast, confidence = ml.get_closing_price_forecast(stock, df, days)
			return forecast[0], confidence
		except:
			log.error("==== ML ERROR ====")
			return 0, 0

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

				# Pretty parse of timestamp, value couples
				points = []
				for timestamp in jdf.keys():
					# Append the timestamp/couple
					points.append({
						"timestamp": timestamp,
						"high": jdf[timestamp][DF.HIGH],
						"low": jdf[timestamp][DF.LOW],
						"open": jdf[timestamp][DF.OPEN],
						"close": jdf[timestamp][DF.CLOSE],
						"volume": jdf[timestamp][DF.VOLUME],
						"adj_close": jdf[timestamp][DF.ADJ_CLOSE]
					})

				closing_price, confidence = self.get_ml_forecast(s, df, 1)
				# Final stock parsing
				stock_data.append({
					"label": s,
					"points": points,
					"forecast": {
						"closing_price": closing_price,
						"confidene": confidence
					}
				})

							# Return the final JSONObject
			return stock_data
		except:
			log.error("Empty list")
			return []
