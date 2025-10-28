from fastapi import APIRouter, HTTPException, Query
from services.finance_service import FinanceService
from models.schemas import ChartData

router = APIRouter()
finance_service = FinanceService()

@router.get("/crypto/{coin_id}", response_model=ChartData)
async def get_crypto_chart(
    coin_id: str,
    days: int = Query(30, ge=1, le=365, description="Number of days for chart data")
):
    """Get cryptocurrency chart data for a specific coin."""
    try:
        chart_data = await finance_service.get_crypto_chart_data(coin_id, days)
        if not chart_data or not chart_data.get('prices'):
            raise HTTPException(status_code=404, detail=f"Chart data not found for coin '{coin_id}'")
        return chart_data
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch chart data: {str(e)}")