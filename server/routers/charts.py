from fastapi import APIRouter, HTTPException, Query
import asyncio
from services.finance_service import FinanceService

router = APIRouter()
finance_service = FinanceService()

@router.get("/crypto/{coin_id}")
async def get_crypto_chart(
    coin_id: str,
    days: int = Query(7, ge=1, le=365)
):
    """Get real-time crypto chart with live price"""
    try:
        chart_data = await finance_service.get_live_chart_with_current_price(coin_id, days)
        
        if not chart_data:
            raise HTTPException(status_code=404, detail=f"Chart not found for {coin_id}")
        
        return chart_data
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/crypto/search/{query}")
async def search_crypto(query: str):
    """Search for cryptocurrencies"""
    try:
        # Get all crypto data
        all_crypto = await finance_service.get_live_crypto_data(250)
        
        # Filter by query
        query_lower = query.lower()
        filtered = [
            crypto for crypto in all_crypto
            if query_lower in crypto['name'].lower() or query_lower in crypto['symbol'].lower()
        ]
        
        return {"results": filtered[:20]}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))