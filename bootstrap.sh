#!/bin/bash

### activate virutal env
sudo bash scripts/init_venv.sh

### freeze and install requirements
# echo "freeze and install the requirements"
# { # try
#	sudo bash scripts/install-requirements.sh
# } || { #catch
#	echo "install failed"
# }

### run angular 
# echo "frontend bootstrap [Angular 8]"
# { # try
#	cd ./frontend
#	npm run build && npm run start
# } || { #catch
# 	echo "frontend bootstrap failed"
# }

### run flask
echo "backend bootstrap [Flask]"
sudo bash ./scripts/init_flask.sh
