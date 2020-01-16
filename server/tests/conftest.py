import sys
import os

folder = os.path.join(os.path.dirname(__file__), "../")
sys.path.append(folder)

from main import app as testApp
import pytest


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    yield app


@pytest.fixture
def client(app):
    """A test client forl the app."""
    return testApp.test_client()
