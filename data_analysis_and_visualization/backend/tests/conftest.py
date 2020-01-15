import sys
import os

folder = os.path.join(os.path.dirname(__file__), "../src/")
sys.path.append(folder)

from src import app as testApp
import pytest


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # app = testApp.create_app()
    yield app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return testApp.test_client()
