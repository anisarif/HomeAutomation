# conftest.py

import pytest
from Backend import create_app, db  # import your Flask application instance and your database instance

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
    })

    # If you are using a separate test database
    # app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://home:admin@localhost:5432/test_home_db'

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
