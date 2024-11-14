import pytest
from unittest.mock import MagicMock

@pytest.fixture
def mock_mqtt_client():
    mock = MagicMock()
    mock.publish = MagicMock(return_value=True)
    return mock

@pytest.fixture
def mock_cache():
    mock = MagicMock()
    mock.get = MagicMock(return_value=None)
    mock.set = MagicMock(return_value=True)
    return mock