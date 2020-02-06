import os
import io
import sys
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
DATASET = './engine/dataset/CORN_1_1_2015_1_1_2020.csv'


class MachineLearning:

	def __init__(self, forecast_out = 1, model_path = LR_MODEL):
		lr = self.load_model(model_path)
		if lr is None:
			self.train_lr_model(forecast_out)

	def save_model(self, lr, model_path):
		try:
			# save the model to disk
			log.info("Saving lr model to memory")
			pickle.dump(lr, open(model_path, 'wb'))
			log.info("Saving lr model to memory SUCCESS")
		except:
			log.info("Saving lr model to memory FAILED")

	def load_model(self, model_path):
		try:
			# save the model to disk
			log.info("Loading lr model from memory")
			lr = pickle.load(open(model_path, 'rb'))
			log.info("Loading lr model from memory SUCCESS")
			return lr
		except:
			log.info("Loading lr model from memory FAILED")

	def get_closing_price_forecast(self, stock, df, forecast_out = 1, model_path = LR_MODEL):
		# Load the model
		lr = self.load_model(model_path)

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
			lr = self.train_lr_model(forecast_out)
			lr_forecast = lr.predict(x_forecast)
			return lr_forecast


	def train_lr_model(self, forecast_out = 1, model_path = LR_MODEL):
		try:
			log.info("===========================")
			log.info("  Start training lr model  ")
			log.info("===========================")
		
			#load the dataset
			df = pd.read_csv(DATASET)
			
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

			# Create and train the Linear Regression  Model
			lr = LinearRegression()
			
			# Train the model
			lr.fit(x_train, y_train)

			log.info("Training lr model SUCCESS, confidence=" + str(lr.score(x_test, y_test)))

			# Save the model
			self.save_model(lr, model_path)
		except:
			err = sys.exc_info()[0]
			log.error(err)
			log.error("Training LR model FAILED")
			return 0

		try:
			# Testing Model: Score returns the coefficient of determination R^2 of the forecast. 
			# The best possible score is 1.0
			log.info("LR Confidence=" + str(lr.score(x_test, y_test)))
			return lr
		except:
			log.error("LR NOT RETURNED")
