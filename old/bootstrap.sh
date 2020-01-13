#!/bin/bash

## activate virutal env
echo "activate virtual env"
export FLASK_APP=./src/main.py
source $(pipenv --venv)/bin/activate

## freeze and install requirements
echo "freeze and install the requirements"
{ # try
	sudo bash scripts/install-requirements.sh
	sudo bash scripts/init-db.sh
} || { #catch
	echo "install failed"
}

# run angular 
echo "bootstrapping frontend (Angular 8)"
{ # try
	cd ./frontend
	npm run build && npm run start
} || { #catch
	echo "frontend bootstrap failed"
}

# run flask
echo "bootstrapping backend (Flask)"
{ # try
	cd ..
	flask run -h 0.0.0.0
} || { #catch
	echo "backend bootstrap failed"
}
