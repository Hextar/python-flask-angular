import os
import sys
import pytest
import json 
from datetime import datetime


def test_get_average(app_context, stockService):
	assert stockService.get_average(sum = 50, len = 2) == 25

def test_get_average_error(app_context, stockService):
	assert stockService.get_average() == 0

def test_get_stocks(app_context, stockService):
	stocks = ["CORN"]
	start = datetime(2019, 1, 1)
	end = datetime(2020, 1, 1)
	response = stockService.get_stocks(stocks, start, end)
	

	result = response[0]["result"]
	assert result == "OK"
	data = response[0]["data"]
	assert len(data) >= 1

def test_get_stocks_error(app_context, stockService):
	response = stockService.get_stocks()
	print(response)
	result = response[0]["result"]
	assert result == "KO"
	mssage = response[0]["message"]
	assert mssage == "Could not find any stock"