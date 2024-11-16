from fastapi import FastAPI, HTTPException
from utils.ccs_api_utils import retriable_api_call
import aiohttp
import logger

# Initialize FastAPI app
app = FastAPI()

# Initialise logger
logger = logger.main(__name__)

# Remote service base URL (replace with your actual service URL)
REMOTE_SERVICE_URL = "https://central-config-service.prod.conviva.com"
GET_API_PATH = "/v1/config/"
WORKFLOW_NAME = "batch"

# Function to make HTTP requests using aiohttp
async def fetch_remote_data(endpoint: str, params=None, method="GET", data=None):
    async with aiohttp.ClientSession() as session:
        url = f"{REMOTE_SERVICE_URL}/{endpoint}"
        try:
            if method == "GET":
                async with session.get(url, params=params) as response:
                    response.raise_for_status()
                    return await response.json()
            elif method == "POST":
                async with session.post(url, json=data) as response:
                    response.raise_for_status()
                    return await response.json()
            elif method == "PUT":
                async with session.put(url, json=data) as response:
                    response.raise_for_status()
                    return await response.json()
            elif method == "DELETE":
                async with session.delete(url) as response:
                    response.raise_for_status()
                    return await response.json()
            else:
                raise HTTPException(status_code=405, detail="Method not allowed")
        except aiohttp.ClientResponseError as e:
            raise HTTPException(status_code=e.status, detail=e.message)
        except Exception as e:
            raise HTTPException(status_code=500, detail=str(e))

# Function to fetch the config for a given config id
@app.get("/get/{config_id}", response_model=dict)
async def get_resource(config_id):
    try:
        target_url = REMOTE_SERVICE_URL + GET_API_PATH + config_id
        headers = {"Content-Type": "application/json"}
        return await retriable_api_call(
            "GET",
            target_url,
            headers=headers
        )
    except aiohttp.ClientError as ce:
        logger.error(
            f"There was an issue in fetching data for config with config_id = {config_id}. Error stacktrace as follows : {ce}"
        )
    except Exception as e:
        raise Exception(f"Cannot get metadata caused by {e}") from e

# Example endpoint that proxies a POST request to the remote service
@app.post("/proxy/{resource}", response_model=dict)
async def post_resource(resource: str, payload: dict):
    response = await fetch_remote_data(endpoint=resource, method="POST", data=payload)
    return response

# Example endpoint that proxies a PUT request to the remote service
@app.put("/proxy/{resource}/{resource_id}", response_model=dict)
async def update_resource(resource: str, resource_id: int, payload: dict):
    response = await fetch_remote_data(endpoint=f"{resource}/{resource_id}", method="PUT", data=payload)
    return response

# Example endpoint that proxies a DELETE request to the remote service
@app.delete("/proxy/{resource}/{resource_id}", response_model=dict)
async def delete_resource(resource: str, resource_id: int):
    response = await fetch_remote_data(endpoint=f"{resource}/{resource_id}", method="DELETE")
    return response
