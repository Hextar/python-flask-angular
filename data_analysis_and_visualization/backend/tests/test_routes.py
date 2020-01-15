import os
import sys
import pytest
import json 


def test_home_path(client):
	"""homepage is working"""
	r = client.get('/')
	assert r.status_code == 200

def test_financial_path(client):
	"""financial is working"""
	data = {
		"stocks": ["CORN"],
		"start": "2019-1-1",
		"end": "2020-1-1"
	}
	r = client.post('/stocks', data=json.dumps(data), content_type='application/json')
	assert r.status_code == 200
	assert "result" in r.json
	assert "data" in r.json
	result = r.json["result"]
	assert result == "OK"
	data = r.json["data"]
	assert len(data) >= 1

def test_financial_path_no_data(client):
	"""financial is working"""
	data = {
		"stocks": [],
		"start": "2019-1-1",
		"end": "2020-1-1"
	}
	r = client.post('/stocks', data=json.dumps(data), content_type='application/json')
	assert r.status_code == 200
	assert "result" in r.json
	assert "data" in r.json
	result = r.json["result"]
	assert result == "OK"
	data = r.json["data"]
	assert len(data) == 0

def test_raises_wrong_method(client):
	"""financial is not working"""
	r = client.get('/stocks')
	assert r.status_code == 405
	assert "result" in r.json
	result = r.json["result"]
	assert result == "KO"

def test_raises_wrong_payload(client):
	"""financial is not working"""
	r = client.post('/stocks')
	assert r.status_code == 400
	assert "result" in r.json
	result = r.json["result"]
	assert result == "KO"

def test_wrong_path(client):
	"""homepage is working"""
	r = client.post('/stonks')
	assert r.status_code == 404