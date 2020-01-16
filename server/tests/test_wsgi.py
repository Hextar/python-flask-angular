import os
import sys
import pytest
from app import create_app


def test_create_app():
	flaskApp = create_app()
	assert flaskApp
