#!/bin/bash

# init the FLASK_APP
export FLASK_APP=./backend/main.py

# run flask
echo "bootstrapping backend (Flask)"
{ # try
	flask run -h 0.0.0.0
} || { #catch
	echo "backend bootstrap failed"
}
