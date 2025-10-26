import asyncio
from typing import Any, Optional
from datetime import datetime, timedelta

class CacheService:
    def __init__(self):
        self._cache = {}
        self._timestamps = {}

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key in self._cache and await self._is_valid(key):
            return self._cache[key]
        return None

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        """Set value in cache with TTL"""
        self._cache[key] = value
        self._timestamps[key] = datetime.now()

    async def delete(self, key: str) -> None:
        """Delete value from cache"""
        self._cache.pop(key, None)
        self._timestamps.pop(key, None)

    async def clear(self) -> None:
        """Clear all cache"""
        self._cache.clear()
        self._timestamps.clear()

    async def _is_valid(self, key: str) -> bool:
        """Check if cache entry is still valid"""
        if key not in self._timestamps:
            return False
        
        cache_time = self._timestamps[key]
        current_time = datetime.now()
        return (current_time - cache_time).seconds < 300  # Default 5 minutes

# Global cache instance
cache = CacheService()