from fastapi import APIRouter, HTTPException
from ..services.finance_service import FinanceService

router = APIRouter()
finance_service = FinanceService()

@router.get("/list")
async def get_stocks_list():
    """Get stock list"""
    try:
        stock_data = await finance_service.get_live_stock_data()
        return {
            "data": stock_data,
            "count": len(stock_data)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock data: {str(e)}")

@router.get("/{symbol}")
async def get_stock_by_symbol(symbol: str):
    """Get specific stock data"""
    try:
        stock_data = await finance_service.get_live_stock_data()
        symbol_upper = symbol.upper()
        
        for stock in stock_data:
            if stock['symbol'] == symbol_upper:
                return stock
        
        # Try to fetch individual stock if not in list
        individual_stock = await finance_service.get_stock_quote(symbol_upper)
        if individual_stock:
            return individual_stock
        
        raise HTTPException(status_code=404, detail=f"Stock {symbol} not found")
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stock data: {str(e)}")