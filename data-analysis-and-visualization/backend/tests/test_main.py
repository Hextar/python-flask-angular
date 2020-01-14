Learn more or give us feedback
import requests
from flask import json

from sa.config.S3Engine import S3Engine
from sa.lib.mailing import Mailing
from sa.models.user import *
from sa.models.plan import Plan
from sa.models.tweet import Tweet
from sa.models.subscription import Subscription
import datetime
import tempfile
from dateutil.relativedelta import relativedelta


userTest = User(name="test", surname="test", username="istella.development@gmail.com", tw_auth_id="1", email="istella.development@gmail.com")



def test_home(client):
	"""homepage is working"""

	r = client.get('/')
	r.status == '200'

def test_users_twitter_auth_get(client):
	"""twitter auth"""

	r = client.get('/users/twitter-auths')
	assert r.status_code == 200
	assert "result" in r.json
	result = r.json["result"]
	assert result == "OK"



## test on reports

# def test_report_rt_tempcharts(client):
#
#     payload = {'event_id': 'b6ea4f485dee4af9845419cdb8a3fd1c', 'first_minute': '1561123920'}
#
#     r = client.post('/reports/rttempcharts', data=json.dumps(payload), content_type='application/json')
#     assert r.status_code == 200
#     assert "minutes" in r.json
"""
{
  "function": "report-regen",
  "user_id": "4428",
  "company_id": "4449",
  "episode": {
	"event_id": "ef82563ef8264862a71da41144cac911",
	"regen_description": "test 1 di rigenerazione",
	"start_time": 1564422480,
	"edited_start_time": 1564422600,
	"end_time": 1564465680,
	"edited_end_time": 1564444800,
	"keywords": [
	  {
		"keyword": "statodidiritto",
		"start_time": 1564422600,
		"end_time": 1564444800,
		"checked": 1
	  }
	]
  }
}
"""