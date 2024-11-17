import json
import logger
import pytest
import aiohttp
import pprint
from fastapi.testclient import TestClient
from config_manager import app

# Initialize the FastAPI test client
client = TestClient(app)
logger = logger.main(__name__)

BASE_URL = "https://central-config-service.qe2.conviva.com"

@pytest.mark.asyncio
async def test_get_config_with_id():
    response = client.get("/get_config_with_id/12345")
    response_json = response.json()
    indented_response_json = json.dumps(response_json, indent=4)
    pprint.pprint(indented_response_json)
    assert response_json is not None

@pytest.mark.asyncio
async def test_get_config_meta():
    payload_string = {
        "namespace_id": "f9e5e301-99f5-49fb-970c-d711d1c3064e",
        "meta_fields": [
            "config_version",
            "scope",
        ],
        "pagination": {
            "page": 1,
            "limit": 0
        }
    }
    print(f"The payload is : {payload_string}")
    response = client.post("/meta", json=payload_string)
    response_json = response.json()
    indented_response_json = json.dumps(response_json, indent=4)
    pprint.pprint(indented_response_json)
    assert response_json is not None

@pytest.mark.asyncio
async def test_get_config_history():
    payload_string = {
        "namespace_id": "ef134768-5465-48de-8ce3-b68197980fee",
        "pagination": {
            "limit": 1
        }
    }
    response = client.post("/get_config_history/31406", json=payload_string)
    response_json = response.json()
    indented_response_json = json.dumps(response_json, indent=4)
    pprint.pprint(indented_response_json)
    assert response_json is not None

@pytest.mark.asyncio
async def test_put_config():
    payload_string = {
        "namespace_id": "ef134768-5465-48de-8ce3-b68197980fee",
        "config": {
            "test_config_data_key": "test_config_data_value"
        },
        "updated_by": "config-manager-tool service test",
        "comment": f"Latest update => Writing test config for customer in dev namespace"
    }
    response = client.put("/put_config_with_id/31406", json=payload_string)
    response_json = response.json()
    indented_response_json = json.dumps(response_json, indent=4)
    pprint.pprint(indented_response_json)
    assert response_json is not None

@pytest.mark.asyncio
async def test_delete_config():
    payload_string = {
        "namespace_id": "ef134768-5465-48de-8ce3-b68197980fee",
        "deleted_by": "config manager tool service test"
    }
    # TODO : This is not an ideal way to call the delete API but starting version 0.87.0 , TestClient library does not
    #  support the usage of json within the delete request. This is because the underlying Starlette library moved to
    #  using httpx instead of the requests library. We can revisit this in future.
    response = client.request("DELETE","/delete_config_with_id/131069", json=payload_string)
    response_json = response.json()
    indented_response_json = json.dumps(response_json, indent=4)
    pprint.pprint(indented_response_json)
    assert response_json is not None

@pytest.mark.asyncio
async def test_create_new_config():
    payload_string = {
        "namespace_id": "ef134768-5465-48de-8ce3-b68197980fee",
        "scope": {
            "name": "config_manager_tool_id",
            "value": "1"
        },
        "config": {
            "test_key_id" : "test_key_data"
        },
        "created_by": "config-manager-tool for test",
        "comment": "Creating new config for config updates via config manager tool"
    }
    response = client.post("/create_new_config", json=payload_string)
    response_json = response.json()
    indented_response_json = json.dumps(response_json, indent=4)
    pprint.pprint(indented_response_json)
    assert response_json is not None

# TODO : Write a unified test that creates a new config , reads it and deletes the config later