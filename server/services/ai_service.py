import aiohttp
import json
import time
from typing import List, Dict
from datetime import datetime
from config import settings as config
from services.finance_service import FinanceService
from services.cache_service import cache

class AIService:
    def __init__(self):
        self.finance_service = FinanceService()
        self.aimlapi_key = config.AIMLAPI_KEY
        self.serper_api = config.SERPER_API
        self.news_api_key = config.NEWS_API_KEY

    async def get_finance_response(self, query: str) -> Dict:
        """Get AI response for financial questions"""
        start_time = time.time()
        
        try:
            # Get context from various sources
            search_context = await self._search_financial_info(query)
            market_context = await self._get_market_context(query)
            
            enhanced_context = f"{search_context}\n\n{market_context}"
            
            # Get AI response
            response = await self._get_ai_completion(query, enhanced_context)
            
            end_time = time.time()
            response_time = end_time - start_time
            
            return {
                "response": response,
                "sources": await self._extract_sources(search_context),
                "response_time": response_time,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            return {
                "response": f"I apologize, but I encountered an error: {str(e)}",
                "sources": [],
                "response_time": 0,
                "timestamp": datetime.now().isoformat()
            }

    async def _search_financial_info(self, query: str) -> str:
        """Search for financial information using Serper API"""
        cache_key = f"search_{hash(query)}"
        cached = await cache.get(cache_key)
        if cached:
            return cached

        try:
            async with aiohttp.ClientSession() as session:
                url = "https://google.serper.dev/search"
                payload = json.dumps({
                    "q": f"finance {query}",
                    "num": 3
                })
                headers = {
                    'X-API-KEY': self.serper_api,
                    'Content-Type': 'application/json'
                }
                
                async with session.post(url, headers=headers, data=payload, timeout=10) as response:
                    result = await response.json()
                    
                    context = ""
                    if 'organic' in result:
                        for i, item in enumerate(result['organic'][:3]):
                            context += f"Source {i+1}: {item.get('title', '')}. {item.get('snippet', '')}\n\n"
                    
                    await cache.set(cache_key, context, ttl=600)  # 10 minutes
                    return context
                    
        except Exception as e:
            print(f"Search error: {e}")
            return ""

    async def _get_market_context(self, query: str) -> str:
        """Get relevant market context based on query"""
        query_lower = query.lower()
        context = ""
        
        # Add crypto data if query mentions crypto
        if any(term in query_lower for term in ['crypto', 'bitcoin', 'btc', 'ethereum', 'eth']):
            crypto_data = await self.finance_service.get_live_crypto_data(10)
            if crypto_data:
                context += "**Real-time Cryptocurrency Data:**\n"
                for coin in crypto_data[:5]:
                    context += f"• {coin['name']} ({coin['symbol']}): ${coin['price']:,.2f} ({coin['price_chg']:+.2f}%)\n"
                context += "\n"
        
        # Add stock data if query mentions stocks
        if any(term in query_lower for term in ['stock', 'stocks', 'equity', 'apple', 'microsoft', 'google']):
            stock_data = await self.finance_service.get_live_stock_data()
            if stock_data:
                context += "**Real-time Stock Data:**\n"
                for stock in stock_data[:5]:
                    context += f"• {stock['symbol']}: ${stock['price']:,.2f} ({stock['change_percent']:+.2f}%)\n"
                context += "\n"
        
        # Add Bitcoin price for Bitcoin-specific queries
        if 'bitcoin' in query_lower or 'btc' in query_lower:
            btc_data = await self.finance_service.get_bitcoin_price()
            if btc_data:
                context += f"**Bitcoin (BTC) Current Price:** ${btc_data['price']:,.2f} ({btc_data['change_24h']:+.2f}%)\n\n"
        
        return context

    async def _get_ai_completion(self, query: str, context: str) -> str:
        """Get AI completion from AIMLAPI"""
        cache_key = f"ai_{hash(query + context)}"
        cached = await cache.get(cache_key)
        if cached:
            return cached

        try:
            async with aiohttp.ClientSession() as session:
                url = "https://api.aimlapi.com/v1/chat/completions"
                
                system_prompt = """You are Aladin.AI, a financial research assistant. Provide comprehensive, 
                accurate information about finance, investing, stocks, cryptocurrencies, and economics.
                Always cite sources and be transparent about data limitations. Format responses clearly
                with sections and bullet points when appropriate."""
                
                payload = json.dumps({
                    "model": "gpt-4",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": f"Context and Real-time Data: {context}\n\nQuestion: {query}"}
                    ],
                    "max_tokens": 1500,
                    "temperature": 0.3
                })
                
                headers = {
                    'Authorization': f'Bearer {self.aimlapi_key}',
                    'Content-Type': 'application/json'
                }
                
                async with session.post(url, headers=headers, data=payload, timeout=15) as response:
                    result = await response.json()
                    
                    if 'choices' in result and len(result['choices']) > 0:
                        ai_response = result['choices'][0]['message']['content']
                        await cache.set(cache_key, ai_response, ttl=600)  # 10 minutes cache
                        return ai_response
                    else:
                        return "I couldn't generate a response. Please try again."
                        
        except Exception as e:
            print(f"AI API error: {e}")
            return "I'm having trouble connecting to the AI service. Please try again later."

    async def _extract_sources(self, search_context: str) -> List[Dict[str, str]]:
        """Extract sources from search context"""
        # This is a simplified implementation
        # In a real app, you'd parse the search results properly
        sources = []
        lines = search_context.split('\n')
        
        for line in lines:
            if line.startswith('Source'):
                parts = line.split(':')
                if len(parts) > 1:
                    sources.append({
                        'title': parts[1].strip(),
                        'url': '#'  # You'd extract actual URLs from search results
                    })
        
        return sources[:3]  # Return top 3 sources

    async def get_financial_news(self, query: str = "", limit: int = 10) -> List[Dict]:
        """Get financial news"""
        cache_key = f"news_{query}_{limit}"
        cached = await cache.get(cache_key)
        if cached:
            return cached

        try:
            async with aiohttp.ClientSession() as session:
                url = "https://newsapi.org/v2/everything"
                params = {
                    'q': query or 'finance OR cryptocurrency OR stock market',
                    'language': 'en',
                    'sortBy': 'publishedAt',
                    'pageSize': limit,
                    'apiKey': self.news_api_key
                }
                
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        news_data = []
                        
                        if data.get('status') == 'ok' and 'articles' in data:
                            for article in data['articles'][:limit]:
                                news_data.append({
                                    'title': article.get('title', ''),
                                    'description': article.get('description', ''),
                                    'url': article.get('url', ''),
                                    'publishedAt': article.get('publishedAt', ''),
                                    'source': article.get('source', {}).get('name', '')
                                })
                        
                        await cache.set(cache_key, news_data, ttl=600)  # 10 minutes
                        return news_data
                    else:
                        return []
                        
        except Exception as e:
            print(f"News API error: {e}")
            return []