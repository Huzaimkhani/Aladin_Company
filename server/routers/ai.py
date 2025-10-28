from fastapi import APIRouter, HTTPException
from services.ai_service import AIService
from models.schemas import FinanceQuery, AIResponse

router = APIRouter()
ai_service = AIService()

@router.post("/ask", response_model=AIResponse)
async def ask_finance_question(query: FinanceQuery):
    """Ask financial questions to AI"""
    try:
        response = await ai_service.get_finance_response(query.query)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")

@router.get("/news")
async def get_financial_news(
    query: str = "",
    limit: int = 10
):
    """Get financial news"""
    try:
        news = await ai_service.get_financial_news(query, limit)
        return {"news": news}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch news: {str(e)}")