from fastapi import FastAPI, HTTPException
from utils.ccs_api_utils import retriable_api_call, logger
import aiohttp
from logger import main as logger_main
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Initialise logger
logger = logger_main(__name__)

# Remote service base URL (replace with your actual service URL)
REMOTE_SERVICE_URL = "https://central-config-service.qe2.conviva.com"
WORKFLOW_NAME = "batch"
REQUEST_API_PATH = "/v1/config/"
CONFIG_META_PATH = "/v1/config/meta"
CONFIG_CREATE_PATH = "/v1/config/create"
CONFIG_HISTORY_PATH = "/v2.1/config/"


# Common function to handle all API Requests
async def fetch_config(target_url, request_type, workflow_type="DEFAULT_WORKFLOW", payload=None):
    try:
        if payload is None:
            payload = dict()
        headers = {"Content-Type": "application/json"}
        response = await retriable_api_call(
            request_type,
            target_url,
            headers=headers,
            json=payload
        )
        return response
    except aiohttp.ClientError as ce:
        logger.error(
            f"Client errors occurred while interacting with CCS for the workflow : {workflow_type} . Error stacktrace as follows : {ce}"
        )
    except Exception as e:
        logger.error(f"Unexpected errors occurred while interacting with CCS for the workflow : {workflow_type}. Error stacktrace as follows : {e}")


# Function to fetch the config for a given config id
@app.get("/get_config_with_id/{config_id}")
async def get_config_with_id(config_id):
    target_url = "".join((REMOTE_SERVICE_URL, REQUEST_API_PATH, config_id))
    logger.info(f"The CCS url is : {target_url}")
    return await fetch_config(target_url=target_url,
                              request_type="GET",
                              workflow_type="GET_CONFIG_USING_ID")


# Function to get the config history for a given config
@app.post("/get_config_history/{config_id}")
async def get_config_history(config_id, payload:dict):
    target_url = "".join((REMOTE_SERVICE_URL, CONFIG_HISTORY_PATH, config_id, "/history"))
    return await fetch_config(target_url=target_url,
                              request_type="POST",
                              workflow_type="GET_CONFIG_HISTORY",
                              payload=payload)


# Function to add a new version to an existing config
@app.put("/put_config_with_id/{config_id}")
async def put_config_with_id(config_id, payload:dict):
    target_url = "".join((REMOTE_SERVICE_URL, REQUEST_API_PATH, config_id))
    return await fetch_config(target_url=target_url,
                              request_type="PUT",
                              workflow_type="PUT_CONFIG_USING_ID",
                              payload=payload)


# Function to get the metadata information for a given namespace
@app.post("/meta")
async def get_config_meta(payload:dict):
    target_url = "".join((REMOTE_SERVICE_URL, CONFIG_META_PATH))
    return await fetch_config(target_url=target_url,
                              request_type="POST",
                              workflow_type="GET_CONFIG_META",
                              payload=payload)


# Function to delete the config using config_id
@app.delete("/delete_config_with_id/{config_id}")
async def delete_resource(config_id, payload: dict):
    target_url = "".join((REMOTE_SERVICE_URL, REQUEST_API_PATH, config_id))
    return await fetch_config(target_url=target_url,
                              request_type="DELETE",
                              workflow_type="DELETE_CONFIG_WITH_ID",
                              payload=payload)


# Function to create a new config on an existing namespace
@app.post("/create_new_config")
async def create_new_config(payload:dict):
    target_url = "".join((REMOTE_SERVICE_URL, CONFIG_CREATE_PATH))
    return await fetch_config(target_url=target_url,
                              request_type="POST",
                              workflow_type="CREATE_NEW_CONFIG",
                              payload=payload)