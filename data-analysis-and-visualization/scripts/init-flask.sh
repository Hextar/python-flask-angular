#!/bin/bash

# run flask
echo "bootstrapping backend (Flask)"
{ # try
	cd ..
	flask run -h 0.0.0.0
} || { #catch
	echo "backend bootstrap failed"
}
