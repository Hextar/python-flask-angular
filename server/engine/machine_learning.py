import numpy as np 
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
from api.services.data_frame_const import DataFrameConst as DF
import logging as log
import pandas as pd 
pd.options.mode.chained_assignment = None  # default='warn'

FORECAST = "Forecast"

class MachineLearning:

	def __init__(self):
		pass

	def get_closing_price_forecast(self, stock, df, forecast_out = 1):
		try:
			STOCK = "[" + stock + "]   "
			# Get the Adjusted Close Price
			df = df[[DF.ADJ_CLOSE]]

			#Create another column (the target or dependent variable) shifted 'n' units up
			df[FORECAST] = df[[DF.ADJ_CLOSE]].shift(-forecast_out)
		
			### Create the independent data set (X)  #######
			# Convert the dataframe to a numpy array
			X = np.array(df.drop([FORECAST],1))

			#Remove the last 'n' rows
			X = X[:-forecast_out]

			### Create the dependent data set (y)  #####
			# Convert the dataframe to a numpy array (All of the values including the NaN's)
			y = np.array(df[FORECAST])
			# Get all of the y values except the last 'n' rows
			y = y[:-forecast_out]

			# Split the data into 80% training and 20% testing
			x_train, x_test, y_train, y_test = train_test_split(X, y, test_size=0.2)
		
			# Create and train the Support Vector Machine (Regressor)
			svr_rbf = SVR(kernel='rbf', C=1e3, gamma=0.1)
			svr_rbf.fit(x_train, y_train)

			# Testing Model: Score returns the coefficient of determination R^2 of the forecast. 
			# The best possible score is 1.0
			svm_confidence = svr_rbf.score(x_test, y_test)
			log.info(STOCK + "SUPPORT VECTOR MACHINE CONFIDENCE: ", svm_confidence)

			# Create and train the Linear Regression  Model
			lr = LinearRegression()
			# Train the model
			lr.fit(x_train, y_train)

			# Testing Model: Score returns the coefficient of determination R^2 of the forecast. 
			# The best possible score is 1.0
			lr_confidence = lr.score(x_test, y_test)
			log.info(STOCK + "LINEAR REGRESSION CONFIDENCE: ", lr_confidence)

			# Set x_forecast equal to the last N rows of the original data set from Adj. Close column
			x_forecast = np.array(df.drop([FORECAST],1))[-forecast_out:]
			log.info(STOCK + "X FORECAST: ", x_forecast)

			# Print linear regression model forecast for the next 'n' days
			lr_forecast = lr.predict(x_forecast)
			log.info(STOCK + "LINEAR REGRESSION FORECAST: ", lr_forecast)
			return lr_forecast, lr_confidence
		except:
			log.error("Machine learning method failed")
			return -1, 0