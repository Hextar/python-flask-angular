# coding=utf-8

import logging
import os
import config
from api import api

from flask import Flask

# Creating the logger
logging.basicConfig(level=logging.DEBUG,
                    format='[%(asctime)s]: {} %(levelname)s %(message)s'.format(os.getpid()),
                    datefmt='%Y-%m-%d %H:%M:%S',
                    handlers=[logging.StreamHandler()])

logger = logging.getLogger()

# Creating the Flask application
def create_app():
    logger.info(f'Starting app in {config.APP_ENV.upper()} environment')
    app = Flask(__name__)
    app.config.from_object('config')
    api.init_app(app)
    return app

# run app
if __name__ == "__main__":
    app = create_app()
    app.run(host='0.0.0.0', debug=True)


