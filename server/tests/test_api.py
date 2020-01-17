import os
import sys
import pytest
from flask import json
import requests


def test_home_path(client):
	"""swagger is working"""
	r = client.get('/')
	assert r.status_code == 200

def test_stocks_path(client):
	"""stocks is working"""
	data = {
		"stocks": ["CORN"],
		"start": "2019-1-1",
		"end": "2020-1-1"
	}
	r = client.post('/api/stocks', data=json.dumps(data), content_type='application/json')
	assert r.status_code == 200
	assert "result" in r.json
	assert "data" in r.json
	result = r.json["result"]
	assert result == "OK"
	data = r.json["data"]
	assert len(data) >= 1

def test_stocks_path_no_data(client):
	"""stocks is working"""
	data = {
		"stocks": [],
		"start": "2019-1-1",
		"end": "2020-1-1"
	}
	r = client.post('/api/stocks', data=json.dumps(data), content_type='application/json')
	assert r.status_code == 200
	assert "result" in r.json
	assert "data" in r.json
	result = r.json["result"]
	assert result == "OK"
	data = r.json["data"]
	assert len(data) == 0

def test_stocks_wrong_method(client):
	#########################
	"""stocks is not working"""
	r = client.get('/api/stocks')
	assert "message" in r.json
	message = r.json["message"]
	assert message == "The method is not allowed for the requested URL."

def test_raises_wrong_payload(client):
	###################
	"""stocks is not working"""
	r = client.post('/api/stocks')
	assert "result" in r.json
	result = r.json["result"]
	assert result == "KO"

def test_wrong_path(client):
	"""wrong path is working"""
	r = client.post('/stonks')
	assert r.status_code == 404