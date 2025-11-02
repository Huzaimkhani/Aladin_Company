from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import uvicorn
from datetime import datetime
import os
from dotenv import load_dotenv

# Import routers
from routers import finance, crypto, stocks, ai

load_dotenv()

app = FastAPI(
    title="Aladin.AI Finance API",
    description="AI-powered financial research assistant",
    version="1.0.0"
)

# CORS middleware - CRITICAL FIX
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(finance.router, prefix="/api/finance", tags=["finance"])
app.include_router(crypto.router, prefix="/api/crypto", tags=["crypto"])
app.include_router(stocks.router, prefix="/api/stocks", tags=["stocks"])
app.include_router(ai.router, prefix="/api/ai", tags=["ai"])

@app.get("/")
async def root():
    return {
        "message": "Aladin.AI Finance API", 
        "status": "running",
        "timestamp": datetime.now().isoformat()
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy", 
        "timestamp": datetime.now().isoformat(),
        "endpoints": {
            "crypto": "/api/crypto/list",
            "stocks": "/api/stocks/list",
            "forex": "/api/finance/market-data"
        }
    }

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )