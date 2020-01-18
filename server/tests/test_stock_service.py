import os
import sys
import pytest
from datetime import datetime
from api.services.data_frame_const import DataFrameConst as DF
import pandas as pd


def test_get_ml_forecast(app_context, stock_service, machine_learning):
	stocks = "CORN"
	df = pd.DataFrame({
		DF.DATE: ["2010-1-1", "2010-1-2", "2010-1-3", "2010-1-3", "2010-1-5"],
		DF.HIGH: [25.010000, 25.010000, 25.010000, 25.010000, 25.010000],
		DF.LOW: [24.910000, 24.910000, 24.910000, 24.910000, 24.910000],
		DF.OPEN: [25.000000, 25.000000, 25.000000, 25.010000, 25.010000],
		DF.CLOSE: [24.910000, 24.910000, 24.910000, 24.910000, 24.910000],
		DF.VOLUME: [4400.0, 4400.0, 4400.0, 4400.0, 4400.0],
		DF.ADJ_CLOSE: [23.580917, 23.580917, 23.580917, 23.580917, 23.580917]
	})
	days = 1
	closing_price = stock_service.get_ml_forecast(stocks, df, days)
	print("CLOSING PRICE =====>", closing_price)
	# assert closing_price > 0

def test_get_ml_forecast_wrong_df(app_context, stock_service):
	stocks = "CORN"
	df = pd.DataFrame({'a':[1,2,3,4,5]})
	days = 1
	closing_price = stock_service.get_ml_forecast(stocks, df, days)
	assert closing_price == 0

def test_get_ml_forecast_arguments_expected(app_context, stock_service):
	try:
		closing_price = stock_service.get_ml_forecast()
	except:
		pass

def test_get_stocks(app_context, stock_service):
	stocks = ["CORN"]
	start = datetime(2019, 1, 1)
	end = datetime(2020, 1, 1)
	data = stock_service.get_stocks(stocks, start, end)
	assert len(data) >= 1

def test_get_stocks_error(app_context, stock_service):
	data = stock_service.get_stocks()
	assert len(data) == 0
