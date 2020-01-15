import os
import sys
import pytest
import json 
from datetime import datetime

from src.services.financial_service import FinancialService as FinancialServiceTest


def test_get_average():
	fs = FinancialServiceTest()
	assert fs.get_average(sum = 50, len = 2) == 25

def test_get_average_error():
	fs = FinancialServiceTest()
	assert fs.get_average() == 0

def test_get_stocks():
	fs = FinancialServiceTest()
	stocks = ["CORN"]
	start = datetime(2019, 1, 1)
	end = datetime(2020, 1, 1)
	response = fs.get_stocks(stocks, start, end)
	result = response[0]["result"]
	assert result == "OK"
	data = response[0]["data"]
	assert len(data) >= 1

def test_get_stocks_error():
	fs = FinancialServiceTest()
	response = fs.get_stocks()
	result = response[0]["result"]
	assert result == "KO"
	data = response[0]["data"]
	assert len(data) == 0
