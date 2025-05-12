import json

import uvicorn
from fastapi import FastAPI, Query
import httpx
from starlette.middleware.cors import CORSMiddleware

from test import func
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5050",
        "http://fraud-backend:8080",
        "http://localhost:8000",
        "http://fraud-frontend:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

EXTERNAL_API_URL = "http://fraud-backend:8080/api/FraudDetection"

@app.get("/predict/all")
async def get_all_predictions(
        pageNumber: int = Query(..., ge=1),
        pageSize: int = Query(..., ge=1, le=500)
):
    url = f"{EXTERNAL_API_URL}/GetAll?pageNumber={pageNumber}&pageSize={pageSize}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    response.raise_for_status()
    return json.loads(func(json.dumps(response.json()["data"])))

@app.get("/predict/{id}")
async def predict(id: int):
    url = f"{EXTERNAL_API_URL}/GetById/{id}"
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
    response.raise_for_status()
    return json.loads(func(json.dumps([response.json()])))


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000)
