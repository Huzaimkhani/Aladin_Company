from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

from routers import finance, crypto, stocks, ai, charts
from config import settings

load_dotenv()

app = FastAPI(
    title="Aladin.AI Finance API",
    description="AI-powered financial research assistant",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(finance.router, prefix="/api/finance", tags=["finance"])
app.include_router(crypto.router, prefix="/api/crypto", tags=["crypto"])
app.include_router(stocks.router, prefix="/api/stocks", tags=["stocks"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])
app.include_router(charts.router, prefix="/api/charts", tags=["charts"])

@app.get("/")
async def root():
    return {"message": "Aladin.AI Finance API", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )