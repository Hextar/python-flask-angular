#!/bin/bash
sudo bash scripts/install-requirements.sh
sudo bash scripts/init-db.sh
export FLASK_APP=./src/main.py
source $(pipenv --venv)/bin/activate
flask run -h 0.0.0.0
