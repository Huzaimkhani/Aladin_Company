from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# Request Schemas
class FinanceQuery(BaseModel):
    query: str = Field(..., min_length=1, max_length=500, description="Financial question to research")

class ChartRequest(BaseModel):
    symbol: str = Field(..., description="Symbol for chart data")
    days: int = Field(30, ge=1, le=365, description="Number of days for chart")

# Response Schemas  
class CryptoData(BaseModel):
    symbol: str
    name: str
    price: float
    price_chg: float
    volume_24h: float
    market_cap: float
    market_cap_rank: Optional[int] = None

class StockData(BaseModel):
    symbol: str
    price: float
    change: float
    change_percent: str
    volume: int
    high: Optional[float] = None
    low: Optional[float] = None
    open: Optional[float] = None

class AIResponse(BaseModel):
    response: str
    sources: List[Dict[str, str]] = []
    response_time: float
    timestamp: datetime

class ChartData(BaseModel):
    prices: List[List[float]]  # [[timestamp, price], ...]
    market_caps: List[List[float]]
    total_volumes: List[List[float]]
    symbol: str
    days: int

class MarketData(BaseModel):
    crypto: List[CryptoData]
    stocks: List[StockData]
    forex: List[Dict[str, Any]]
    timestamp: datetime

class APIStatus(BaseModel):
    status: str
    message: str
    version: str
    timestamp: datetime