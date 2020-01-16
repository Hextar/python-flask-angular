from flask import jsonify
from flask_restful import Api, Resource
import config

api = Api(prefix=config.API_PREFIX)