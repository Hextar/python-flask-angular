import sys
import os

folder = os.path.join(os.path.dirname(__file__), "../")
sys.path.append(folder)

import app as saApp
import pytest


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    app = saApp.create_app()
    yield app


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()