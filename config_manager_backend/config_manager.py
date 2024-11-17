from fastapi import FastAPI, HTTPException, Depends, Security
from utils.ccs_api_utils import retriable_api_call, logger
from fastapi.security import OAuth2AuthorizationCodeBearer
from jose import jwt, JWTError
import aiohttp
from logger import main as logger_main
from pydantic import BaseModel

# Initialize FastAPI app
app = FastAPI()

# Initialise logger
logger = logger_main(__name__)

############################################################################################################
#                                                                                                          #
#                           BASE CONFIGURATIONS                                                            #
#                                                                                                          #
############################################################################################################

# Remote service base URL (replace with your actual service URL)
REMOTE_SERVICE_URL = "https://central-config-service.qe2.conviva.com"
WORKFLOW_NAME = "batch"
REQUEST_API_PATH = "/v1/config/"
CONFIG_META_PATH = "/v1/config/meta"
CONFIG_CREATE_PATH = "/v1/config/create"
CONFIG_HISTORY_PATH = "/v2.1/config/"


############################################################################################################
#                                                                                                          #
#                           OAUTH CONFIGURATIONS                                                           #
#                                                                                                          #
############################################################################################################

# Configuration variables (replace with your actual values)
OKTA_DOMAIN = "https://test-auth.conviva.com/"
CLIENT_ID = "0oa95jozwsmT5TdRn0x7"
CLIENT_SECRET = "{yourClientSecret}"
AUTHORIZATION_URL = f"{OKTA_DOMAIN}/oauth2/default/v1/authorize"
TOKEN_URL = f"{OKTA_DOMAIN}/oauth2/default/v1/token"
JWK_URL = f"{OKTA_DOMAIN}/oauth2/default/v1/keys"

# OAuth2 configuration for Okta
oauth2_scheme = OAuth2AuthorizationCodeBearer(
    authorizationUrl=AUTHORIZATION_URL,
    tokenUrl=TOKEN_URL
)

# Function to get public keys from Okta using aiohttp
async def get_jwk_keys():
    async with aiohttp.ClientSession() as session:
        async with session.get(JWK_URL) as response:
            if response.status == 200:
                return await response.json()
            raise HTTPException(status_code=500, detail="Failed to retrieve public keys")

# Function to verify JWT token using aiohttp for key retrieval
async def verify_token(token: str):
    keys = await get_jwk_keys()
    try:
        header = jwt.get_unverified_header(token)
        jwk_key = next(key for key in keys["keys"] if key["kid"] == header["kid"])
        payload = jwt.decode(
            token,
            jwk_key,
            algorithms=["RS256"],
            audience=CLIENT_ID,
            issuer=f"{OKTA_DOMAIN}/oauth2/default",
        )
        return payload
    except (JWTError, StopIteration):
        raise HTTPException(status_code=401, detail="Invalid token")

# Dependency for routes that require authentication
async def get_current_user(token: str = Depends(oauth2_scheme)):
    return await verify_token(token)

@app.get("/secure-data")
async def secure_data(current_user: dict = Depends(get_current_user)):
    return {"message": "This is secured data", "user": current_user}

@app.get("/")
async def public_data():
    return {"message": "This is public data"}

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