import aiohttp
import asyncio
import pandas as pd
from datetime import datetime, timedelta
from typing import List, Dict, Optional, Tuple
import json
from ..config import config
from .cache_service import cache

class FinanceService:
    def __init__(self):
        self.coingecko_base = config.COINGECKO_API
        self.alpha_vantage_key = config.ALPHA_VANTAGE_KEY
        self.finnhub_key = config.FINNHUB_KEY

    async def get_comprehensive_market_data(self) -> Dict:
        """Get all market data in parallel"""
        try:
            crypto_task = self.get_live_crypto_data(50)
            stocks_task = self.get_live_stock_data()
            forex_task = self.get_live_forex_data()
            
            crypto, stocks, forex = await asyncio.gather(
                crypto_task, stocks_task, forex_task,
                return_exceptions=True
            )
            
            # Handle any exceptions
            crypto = [] if isinstance(crypto, Exception) else crypto
            stocks = [] if isinstance(stocks, Exception) else stocks
            forex = [] if isinstance(forex, Exception) else forex
            
            return {
                "crypto": crypto,
                "stocks": stocks,
                "forex": forex,
                "timestamp": datetime.now().isoformat()
            }
            
        except Exception as e:
            print(f"Market data error: {e}")
            return {"crypto": [], "stocks": [], "forex": [], "timestamp": datetime.now().isoformat()}

    async def get_live_crypto_data(self, limit: int = 100) -> List[Dict]:
        """Get cryptocurrency data from CoinGecko"""
        cache_key = f"crypto_data_{limit}"
        cached = await cache.get(cache_key)
        if cached:
            return cached

        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.coingecko_base}/coins/markets"
                params = {
                    'vs_currency': 'usd',
                    'order': 'market_cap_desc',
                    'per_page': limit,
                    'page': 1,
                    'sparkline': 'false',
                    'price_change_percentage': '24h'
                }
                
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        crypto_data = []
                        for item in data:
                            crypto_data.append({
                                'symbol': item['symbol'].upper(),
                                'name': item['name'],
                                'price': item['current_price'],
                                'price_chg': item.get('price_change_percentage_24h', 0),
                                'volume_24h': item.get('total_volume', 0),
                                'market_cap': item.get('market_cap', 0),
                                'market_cap_rank': item.get('market_cap_rank')
                            })
                        
                        await cache.set(cache_key, crypto_data, ttl=300)
                        return crypto_data
                    else:
                        print(f"CoinGecko API error: {response.status}")
                        return []
                        
        except Exception as e:
            print(f"Error fetching crypto data: {e}")
            return []

    async def get_crypto_chart_data(self, coin_id: str, days: int = 30) -> Dict:
        """Get cryptocurrency chart data"""
        cache_key = f"crypto_chart_{coin_id}_{days}"
        cached = await cache.get(cache_key)
        if cached:
            return cached

        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.coingecko_base}/coins/{coin_id}/market_chart"
                params = {
                    'vs_currency': 'usd',
                    'days': str(days),
                    'interval': 'daily' if days > 90 else 'hourly'
                }
                
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        chart_data = {
                            'prices': data.get('prices', []),
                            'market_caps': data.get('market_caps', []),
                            'total_volumes': data.get('total_volumes', []),
                            'coin_id': coin_id,
                            'days': days
                        }
                        await cache.set(cache_key, chart_data, ttl=60)
                        return chart_data
                    else:
                        print(f"Chart API error: {response.status}")
                        return {}
                        
        except Exception as e:
            print(f"Error fetching crypto chart: {e}")
            return {}

    async def get_live_stock_data(self) -> List[Dict]:
        """Get live stock data using Alpha Vantage"""
        cache_key = "stock_data"
        cached = await cache.get(cache_key)
        if cached:
            return cached

        symbols = ['AAPL', 'MSFT', 'GOOGL', 'AMZN', 'TSLA', 'META', 'NVDA', 'JPM', 'V', 'WMT']
        
        try:
            # Fetch stock data concurrently
            tasks = [self.get_stock_quote(symbol) for symbol in symbols]
            stock_data = await asyncio.gather(*tasks, return_exceptions=True)
            
            # Filter out exceptions and None values
            valid_stocks = [stock for stock in stock_data 
                          if stock is not None and not isinstance(stock, Exception)]
            
            await cache.set(cache_key, valid_stocks, ttl=120)
            return valid_stocks
            
        except Exception as e:
            print(f"Error fetching stock data: {e}")
            return []

    async def get_stock_quote(self, symbol: str) -> Optional[Dict]:
        """Get individual stock quote from Alpha Vantage"""
        try:
            async with aiohttp.ClientSession() as session:
                url = "https://www.alphavantage.co/query"
                params = {
                    'function': 'GLOBAL_QUOTE',
                    'symbol': symbol,
                    'apikey': self.alpha_vantage_key
                }
                
                async with session.get(url, params=params, timeout=10) as response:
                    if response.status == 200:
                        data = await response.json()
                        
                        if 'Global Quote' in data:
                            quote = data['Global Quote']
                            return {
                                'symbol': symbol,
                                'price': float(quote.get('05. price', 0)),
                                'change': float(quote.get('09. change', 0)),
                                'change_percent': quote.get('10. change percent', '0%').replace('%', ''),
                                'volume': int(quote.get('06. volume', 0)),
                                'high': float(quote.get('03. high', 0)),
                                'low': float(quote.get('04. low', 0)),
                                'open': float(quote.get('02. open', 0))
                            }
                    return None
                    
        except Exception as e:
            print(f"Error fetching stock {symbol}: {e}")
            return None

    async def get_live_forex_data(self) -> List[Dict]:
        """Get live forex data"""
        cache_key = "forex_data"
        cached = await cache.get(cache_key)
        if cached:
            return cached

        # Simplified forex implementation
        try:
            # Using a free forex API or creating mock data
            forex_data = [
                {'pair': 'EUR/USD', 'price': 1.0950, 'change': 0.0020},
                {'pair': 'GBP/USD', 'price': 1.2750, 'change': -0.0015},
                {'pair': 'USD/JPY', 'price': 145.20, 'change': 0.3000},
                {'pair': 'USD/CAD', 'price': 1.3400, 'change': -0.0010},
                {'pair': 'AUD/USD', 'price': 0.6680, 'change': 0.0030},
            ]
            
            await cache.set(cache_key, forex_data, ttl=300)
            return forex_data
            
        except Exception as e:
            print(f"Error fetching forex data: {e}")
            return []

    async def get_bitcoin_price(self) -> Dict:
        """Get real-time Bitcoin price"""
        cache_key = "bitcoin_price"
        cached = await cache.get(cache_key)
        if cached:
            return cached

        try:
            async with aiohttp.ClientSession() as session:
                url = f"{self.coingecko_base}/simple/price"
                params = {
                    'ids': 'bitcoin',
                    'vs_currencies': 'usd',
                    'include_24hr_change': 'true',
                    'include_24hr_vol': 'true',
                    'include_market_cap': 'true'
                }
                
                async with session.get(url, params=params, timeout=5) as response:
                    if response.status == 200:
                        data = await response.json()
                        if 'bitcoin' in data:
                            btc_data = data['bitcoin']
                            result = {
                                'price': btc_data['usd'],
                                'change_24h': btc_data.get('usd_24h_change', 0),
                                'volume_24h': btc_data.get('usd_24h_vol', 0),
                                'market_cap': btc_data.get('usd_market_cap', 0)
                            }
                            await cache.set(cache_key, result, ttl=60)
                            return result
                    return {}
                    
        except Exception as e:
            print(f"Error fetching Bitcoin price: {e}")
            return {}