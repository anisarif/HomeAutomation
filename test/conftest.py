# conftest.py

import pytest
from Backend import create_app, db  # import your Flask application instance and your database instance

@pytest.fixture
def app():

    test_config = {
        "DATABASE_URI": 'postgresql://admin_db:password_db@localhost:5432/test_home_db'
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
