import os
import sys
import pytest

def test_home_path(client):
	"""homepage is working"""
	r = client.get('/')
	assert r.status_code == 200

def test_financial_path(client):
	"""financial is working"""
	r = client.post('/stocks')
	assert r.status_code == 200
	assert "result" in r.json
	result = r.json["result"]
	assert result == "OK"

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