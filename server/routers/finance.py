from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import asyncio
from services.finance_service import FinanceService
from models.schemas import MarketData, ChartData

router = APIRouter()
finance_service = FinanceService()

@router.get("/market-data", response_model=MarketData)
async def get_market_data():
    """Get comprehensive market data (crypto, stocks, forex)"""
    try:
        market_data = await finance_service.get_comprehensive_market_data()
        return market_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch market data: {str(e)}")

@router.get("/bitcoin/price")
async def get_bitcoin_price():
    """Get current Bitcoin price"""
    try:
        btc_data = await finance_service.get_bitcoin_price()
        return btc_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch Bitcoin price: {str(e)}")