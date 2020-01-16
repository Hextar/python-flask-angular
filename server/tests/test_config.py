import os
import sys
import config 


def test_as_dict():
	res = config.as_dict()
	assert res
	assert type(res) is dict
