import sys
import os

folder = os.path.join(os.path.dirname(__file__), "../")
sys.path.append(folder)

import app
import pytest
from api.services.stock_service import StockService

@pytest.fixture
def testApp():
    """Create and configure a new app instance for each test."""
    temp = app.create_app()
    yield temp

@pytest.fixture
def app_context(testApp):
    with testApp.app_context():
        yield

@pytest.fixture
def client(testApp):
    """A test client forl the app."""
    return testApp.test_client()


@pytest.fixture
def stockService(testApp):
    """A test client forl the app."""
    ss = StockService()
    yield ss