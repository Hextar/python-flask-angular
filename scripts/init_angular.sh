#!/bin/bash

# run angular 
echo "bootstrapping frontend (Angular 8)"
{ # try
	cd ./frontend
	npm run build && npm run start
} || { #catch
	echo "frontend bootstrap failed"
}