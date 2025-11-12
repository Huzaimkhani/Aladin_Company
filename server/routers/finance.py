from fastapi import APIRouter, HTTPException, Query
from typing import Optional
import asyncio
from services.finance_service import FinanceService
from models.schemas import MarketData, ChartData

router = APIRouter()
finance_service = FinanceService()

@router.get("/crypto/live-chart/{coin_id}")
async def get_live_crypto_chart(coin_id: str, days: int = Query(7, ge=1, le=365)):
    """Get real-time chart with live price"""
    try:
        chart_data = await finance_service.get_live_chart_with_current_price(coin_id, days)
        if not chart_data:
            raise HTTPException(status_code=404, detail=f"Chart not found for {coin_id}")
        return chart_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/crypto/chart-multi")
async def get_multiple_crypto_charts(
    coin_ids: str = Query(..., description="bitcoin,ethereum,cardano"),
    days: int = Query(7, ge=1, le=90)
):
    """Get multiple charts at once"""
    try:
        coins = [c.strip() for c in coin_ids.split(',')]
        if len(coins) > 5:
            raise HTTPException(status_code=400, detail="Max 5 coins")
        
        tasks = [finance_service.get_live_chart_with_current_price(coin, days) for coin in coins]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        charts = {}
        for coin, result in zip(coins, results):
            charts[coin] = result if not isinstance(result, Exception) else {"error": str(result)}
        
        from datetime import datetime
        return {"charts": charts, "timestamp": datetime.now().isoformat()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

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