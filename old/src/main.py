# coding=utf-8

from flask_cors import CORS
from flask import Flask, jsonify, request, render_template, redirect, session

import sys
import matplotlib.pyplot as plt
import numpy as np
from datetime import datetime
import pandas as pd 
from sklearn.linear_model import LinearRegression
import pandas_datareader as web
pd.plotting.register_matplotlib_converters()

from .services.financial_service import FinancialService

# creating the Flask application
app = Flask(__name__,
    static_folder='./src/static',
    template_folder='./src/templates')
CORS(app)

if __name__ == "__main__":
    app.run(debug=True)


@app.route('/')
def home():
    # get and process 5 years of data
    start = datetime(2015, 1, 1)
    end = datetime(2020, 1, 1)
    stocks = ["CROP", "UGA", "NDAQ"]
    data_SP = web.data.get_data_yahoo(stocks, start = start, end = end)

    print("===== INFO =====")
    print(data_SP['Close'])
    print("type", type(data_SP))
    print("length", len(data_SP))

    dates = list(map(lambda x: datetime.strptime(str(x),"%Y-%m-%d %H:%M:%S"),list(data_SP.index)))
    days_since = list(map(lambda x: (x-start).days,dates))

    model = LinearRegression(fit_intercept=True)
    model.fit(np.array(days_since)[1:][:, np.newaxis],data_SP['Close'][1:])
    
    yfit = model.predict(np.array(days_since)[:, np.newaxis])

    print("===== LINEAR REGRESSION =====")
    print("length", len(yfit))
    print(yfit)

    # linear
    try:
        plt.figure(1)
        plt.plot(dates, data_SP['Close'])
        plt.xlabel('Date')
        plt.ylabel('Close')
        plt.legend()
        plt.savefig('./src/static/images/linear_plot.png')
    except: 
        print("linear plot failed")

    # scatter forecast
    try:
        plt.figure(2)
        plt.scatter(dates, yfit)
        plt.scatter(dates, data_SP['Close'].pct_change(1))
        plt.xlabel('Date')
        plt.ylabel('Close')
        plt.savefig('./src/static/images/scatter_forecast_plot.png')
    except: 
        print("scatter forecast plot failed")

    try:
        return render_template('./src/templates/plot.html', name = 'new_plot', url ='./src/static/images/new_plot.png')
    except:
        return 'template rendering failed'


@app.route('/stocks', methods=("POST", "GET"))
def get_financials():
    try:
        response_dict = {
            "result": "OK",
            "data": {}
        }
         # get and process 5 years of data
        start = datetime(2020, 1, 1)
        end = datetime(2020, 1, 3)
        stocks = ["CROP", "UGA", "NDAQ"]
        for idx, s in enumerate(stocks): 
            data_SP = web.data.get_data_yahoo(s, start = start, end = end)
            response_dict["result"] = 'OK'
            response_dict["data"][idx] = {
                "label": s,
                "values": json.loads(data_SP.to_json(orient="split"))
            }
        return jsonify(response_dict), 200
    except:
        response_dict["result"] = 'KO'
        return jsonify(response_dict), 500    