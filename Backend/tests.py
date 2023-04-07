import unittest
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from . import create_app, db
from models import UserHome, Boards, Actuators


class TestApp(unittest.TestCase):
    def setUp(self):
        self.app = create_app('testing')
        self.client = self.app.test_client()
        with self.app.app_context():
            db.create_all()
            userhome1 = UserHome(username='admin', password='password', role='admin')
            db.session.add(userhome1)
            db.session.commit()

    def tearDown(self):
        with self.app.app_context():
            db.session.remove()
            db.drop_all()

    def test_userhome_creation(self):
        with self.app.app_context():
            userhome2 = UserHome(username='guest', password='password', role='guest')
            db.session.add(userhome2)
            db.session.commit()
            self.assertEqual(userhome2.username, 'guest')
            self.assertEqual(userhome2.password, 'password')
            self.assertEqual(userhome2.role, 'guest')

    def test_board_creation(self):
        with self.app.app_context():
            board1 = Boards(name='board1', privacy='public')
            db.session.add(board1)
            db.session.commit()
            self.assertEqual(board1.name, 'board1')
            self.assertEqual(board1.privacy, 'public')

    def test_actuator_creation(self):
        with self.app.app_context():
            board1 = Boards(name='board1', privacy='public')
            db.session.add(board1)
            db.session.commit()

            actuator1 = Actuators(name='light1', pin=1, board_id=board1.id, type='light', state=True)
            db.session.add(actuator1)
            db.session.commit()
            self.assertEqual(actuator1.name, 'light1')
            self.assertEqual(actuator1.pin, 1)
            self.assertEqual(actuator1.board_id, board1.id)
            self.assertEqual(actuator1.type, 'light')
            self.assertEqual(actuator1.state, True)

    def test_userhome_board_association(self):
        with self.app.app_context():
            board1 = Boards(name='board1', privacy='public')
            db.session.add(board1)

            userhome1 = UserHome.query.filter_by(username='admin').first()
            userhome1.boards.append(board1)
            db.session.commit()

            self.assertEqual(len(userhome1.boards), 1)
            self.assertEqual(userhome1.boards[0].name, 'board1')

    def test_board_actuator_association(self):
        with self.app.app_context():
            board1 = Boards(name='board1', privacy='public')
            db.session.add(board1)

            actuator1 = Actuators(name='light1', pin=1, board_id=board1.id, type='light', state=True)
            db.session.add(actuator1)

            board1.board_id.append(actuator1)
            db.session.commit()

            self.assertEqual(len(board1.board_id), 1)
            self.assertEqual(board1.board_id[0].name, 'light1')


if __name__ == '__main__':
    unittest.main()
