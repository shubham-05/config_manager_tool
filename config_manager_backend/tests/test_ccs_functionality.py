import pytest
from fastapi.testclient import TestClient
from config_manager_backend.config_manager import app
from unittest.mock import patch, AsyncMock
import aiohttp

# Initialize the FastAPI test client
client = TestClient(app)

BASE_URL = "https://central-config-service.prod.conviva.com"


@pytest.mark.asyncio
async def test_get_resource():
    async with aiohttp.ClientSession() as session:
        async with session.get(f"{BASE_URL}/get/32829") as response:
            assert response.status == 200
            json_data = await response.json()
            print(response.json())
            assert isinstance(json_data, dict)  # Check if the response is a dictionary