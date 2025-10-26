from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.ai_service import ai_service
from services.finance_service import finance_service
import time

router = APIRouter()

class QueryRequest(BaseModel):
    query: str

class QueryResponse(BaseModel):
    summary: str
    key_data: list
    sources: list

@router.post("/ask", response_model=QueryResponse)
async def ask_question(request: QueryRequest):
    try:
        start_time = time.time()
        
        # Search for financial information
        search_results = await finance_service.search_financial_info(request.query)
        
        # Process search results
        context = ""
        sources = []
        if 'organic' in search_results:
            for i, result in enumerate(search_results['organic'][:3]):
                title = result.get('title', '')
                snippet = result.get('snippet', '')
                link = result.get('link', '')
                context += f"Source {i+1}: {title}. {snippet}\n\n"
                sources.append({
                    "id": i + 1,
                    "title": title,
                    "url": link
                })
        
        # Get AI response
        ai_response = await ai_service.get_ai_response(request.query, context)
        
        # Parse the AI response to extract key data (simplified for now)
        key_data = []
        
        # Extract price information if available
        if "bitcoin" in request.query.lower() or "btc" in request.query.lower():
            from services.crypto_service import crypto_service
            btc_data = await crypto_service.get_bitcoin_price()
            if btc_data:
                key_data.extend([
                    {"label": "Current Price", "value": f"${btc_data['price']:,.2f}"},
                    {"label": "24h Change", "value": f"{btc_data['change_24h']:+.2f}%", "positive": btc_data['change_24h'] > 0},
                    {"label": "Market Cap", "value": f"${btc_data['market_cap']:,.0f}"},
                    {"label": "24h Volume", "value": f"${btc_data['volume_24h']:,.0f}"}
                ])
        
        response_time = time.time() - start_time
        
        return QueryResponse(
            summary=ai_response,
            key_data=key_data,
            sources=sources
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing query: {str(e)}")