import os
import sys
import pytest
import json 
from datetime import datetime


def test_get_average(app_context, stock_service):
	assert stock_service.get_average(sum = 50, len = 2) == 25

def test_get_average_error(app_context, stock_service):
	assert stock_service.get_average() == 0

def test_get_stocks(app_context, stock_service):
	stocks = ["CORN"]
	start = datetime(2019, 1, 1)
	end = datetime(2020, 1, 1)
	data = stock_service.get_stocks(stocks, start, end)
	assert len(data) >= 1

def test_get_stocks_error(app_context, stock_service):
	data = stock_service.get_stocks()
	assert len(data) == 0
