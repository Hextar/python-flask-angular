# coding=utf-8
from flask import Flask
from flask_cors import CORS


# creating the Flask application
app = Flask(__name__,
    static_folder='./backend/app/static',
    template_folder='./backend/app/templates')

# allowing cors for google-chrome
CORS(app)

# run app
if __name__ == "__main__":
	app.run(debug=True, host='0.0.0.0', port=5000)
