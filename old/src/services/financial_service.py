import datetime
from pandas_datareader import data as pdr

DATA_NOT_AVAILABLE = "stock data not available"	

class FinancialService():

	def get_stocks(stocks, start, end):
		if stocks and start and end:
			joined_stocks = ' '.join(str(e) for e in stocks)
			data = pdr.get_data_yahoo(stocks, start = start, end = end)
			try:
				print(data)		
				return data
			except:
				return DATA_NOT_AVAILABLE
		elif stocks:
			joined_stocks = ' '.join(str(e) for e in stocks)
			data = pdr.get_data_yahoo(stocks)
			try:
				print(data)		
				return data
			except:
				return DATA_NOT_AVAILABLE
		else:
			return "ERROR," + DATA_NOT_AVAILABLE
