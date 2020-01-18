import os
import io
import numpy as np 
import logging as log
import pandas as pd 
import requests
import pickle
from sklearn.linear_model import LinearRegression
from sklearn.svm import SVR
from sklearn.model_selection import train_test_split
from api.services.data_frame_const import DataFrameConst as DF
pd.options.mode.chained_assignment = None  # default='warn'

FORECAST = "Forecast"
LR_MODEL = './engine/model/lr_model.sav'
DATASET = 'dataset/crop_dataset_2011_1_1_2020_1_1.csv'


class MachineLearning:

	def __init__(self, forecast_out = 1):
		lr = self.load_model()
		if lr is None:
			self.train_lr_model(forecast_out)

	def save_model(self, lr):
		try:
			# save the model to disk
			log.info("Saving lr model to memory")
			pickle.dump(lr, open(LR_MODEL, 'wb'))
			log.info("Saving lr model to memory SUCCESS")
		except:
			log.info("Saving lr model to memory FAILED")

	def load_model(self):
		try:
			# save the model to disk
			log.info("Loading lr model from memory")
			lr = pickle.load(open(LR_MODEL, 'rb'))
			log.info("Loading lr model from memory SUCCESS")
			return lr
		except:
			log.info("Loading lr model from memory FAILED")

	def get_closing_price_forecast(self, stock, df, forecast_out = 1):
		# Load the model
		lr = self.load_model()

		if lr:
			# Get the Adjusted Close Price
			df = df[[DF.ADJ_CLOSE]]

			#Create another column (the target or dependent variable) shifted 'n' units up
			df[FORECAST] = df[[DF.ADJ_CLOSE]].shift(-forecast_out)

			# Set x_forecast equal to the last N rows of the original data set from Adj. Close column
			x_forecast = np.array(df.drop([FORECAST],1))[-forecast_out:]
			
			lr_forecast = lr.predict(x_forecast)
			return lr_forecast
		else:
			pass
			# self.train_lr_model(forecast_out)
			# self.get_closing_price_forecast(stock, df, forecast_out)


	def train_lr_model(self, forecast_out = 1):
		try:
			log.info("Start training lr model")
			
			# Load the dataset
			url="https://query1.finance.yahoo.com/v7/finance/download/CORN?period1=1420070400&period2=1577836800&interval=1d&events=history&crumb=TjNAMHrOgWR"
			df = pd.read_csv(io.StringIO(requests.get(url).content.decode('utf-8')))

			# Get the Adjusted Close Price
			df = df[[DF.ADJ_CLOSE]]

			#Create another column (the target or dependent variable) shifted 'n' units up
			df[FORECAST] = df[[DF.ADJ_CLOSE]].shift(-forecast_out)

			### Create the independent data set (X)  #######
			# Convert the dataframe to a numpy array
			X = np.array(df.drop([FORECAST], 1))

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
			
			# Testing Model: Score returns the coefficient of determination R^2 of the prediction. 
			# The best possible score is 1.0
			svm_confidence = svr_rbf.score(x_test, y_test)
			print("svm confidence: ", svm_confidence)

			# Create and train the Linear Regression  Model
			lr = LinearRegression()
			# Train the model
			lr.fit(x_train, y_train)

			# Testing Model: Score returns the coefficient of determination R^2 of the forecast. 
			# The best possible score is 1.0
			print("Training lr model SUCCESS, confidence=" + str(lr.score(x_test, y_test)))

			# Save the model
			self.save_model(lr)
		except:
			log.error("Training lr model FAILED")
			return 0