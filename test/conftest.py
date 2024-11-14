# conftest.py

import pytest
from Backend import create_app, db  # import your Flask application instance and your database instance

@pytest.fixture
def app():

    test_config = {
        "DATABASE_URI": 'postgresql://admin_db:password_db@db:5432/test_home_db'
    }

    app = create_app(test_config)
    app.config.update({
        "TESTING": True,
    })

    with app.app_context():
        # Setup: create the database tables
        db.create_all()
        
    yield app

    with app.app_context():
        # Teardown: drop the database tables
        db.session.remove()
        db.drop_all()


@pytest.fixture
def client(app):
    with app.test_client() as client:
        yield client


@pytest.fixture
def mock_db_session(mocker):
    """Test double for database session"""
    mock_session = mocker.MagicMock()
    mocker.patch('Backend.models.db.session', mock_session)
    return mock_session

@pytest.fixture
def auth_headers():
    """Test double for admin authentication"""
    return {"Authorization": f"Bearer {create_admin_token()}"} 