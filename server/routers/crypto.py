from fastapi import APIRouter, HTTPException, Query
from services.finance_service import FinanceService

router = APIRouter()
finance_service = FinanceService()

@router.get("/list")
async def get_crypto_list(
    limit: int = Query(100, ge=1, le=250),
    page: int = Query(1, ge=1)
):
    """Get cryptocurrency list"""
    try:
        crypto_data = await finance_service.get_live_crypto_data(limit)
        return {
            "data": crypto_data,
            "count": len(crypto_data),
            "limit": limit,
            "page": page
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch crypto data: {str(e)}")

@router.get("/{symbol}")
async def get_crypto_by_symbol(symbol: str):
    """Get specific cryptocurrency data"""
    try:
        crypto_data = await finance_service.get_live_crypto_data(250)
        symbol_upper = symbol.upper()
        
        for crypto in crypto_data:
            if crypto['symbol'] == symbol_upper:
                return crypto
        
        raise HTTPException(status_code=404, detail=f"Cryptocurrency {symbol} not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch crypto data: {str(e)}")