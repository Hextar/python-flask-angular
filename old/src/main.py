# coding=utf-8

try:
    import sys
except ImportError:
    pass
from flask_cors import CORS
from flask import Flask, jsonify, request, render_template, redirect, session

from pandas_datareader import data as pdr
import datetime    

from .entities.entity import Session, engine, Base
from .entities.exam import Exam, ExamSchema
from .services.financial_service import FinancialService

# creating the Flask application
app = Flask(__name__, template_folder='templates')
CORS(app)

if __name__ == "__main__":
    app.run(debug=True)

# if needed, generate database schema
Base.metadata.create_all(engine)


@app.route('/')
def home():
    return "Home"


@app.route('/financials', methods=("POST", "GET"))
def get_financials():
    # Set DataFrame key
    ls_key = 'Adj Close'

    # Set the stocks label
    stocks = ["CROP", "UGA", "NDAQ"]

    # Set start and end dates
    start = datetime.datetime(2013, 1, 1)
    end = datetime.datetime(2020, 1, 1)

    # Request the stocks data
    df = FinancialService.get_stocks(stocks, start, end)

    try:
        return render_template('templates/simple.html', tables=[df.to_html(classes='data', header="true")])
    except:
        return 'Template not found'


@app.route('/exams')
def get_exams():
    # fetching from the database
    session = Session()
    exam_objects = session.query(Exam).all()

    # transforming into JSON-serializable objects
    schema = ExamSchema(many=True)
    exams = schema.dump(exam_objects)

    # serializing as JSON
    session.close()
    print(exams)
    return jsonify(exams)


@app.route('/exams', methods=['POST'])
def add_exam():
    # mount exam object
    posted_exam = ExamSchema(only=('title', 'description'))\
        .load(request.get_json())

    exam = Exam(**posted_exam, created_by="HTTP post request")

    # persist exam
    session = Session()
    session.add(exam)
    session.commit()

    # return created exam
    new_exam = ExamSchema().dump(exam).data
    session.close()
    return jsonify(new_exam), 201