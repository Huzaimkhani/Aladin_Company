import asyncio
from typing import Any, Optional
from datetime import datetime, timedelta

class CacheService:
    def __init__(self):
        self._cache = {}
        self._timestamps = {}
        self._ttls = {}  # Store TTL for each key

    async def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if key in self._cache and await self._is_valid(key):
            return self._cache[key]
        
        # Clean up expired entry
        if key in self._cache:
            await self.delete(key)
        
        return None

    async def set(self, key: str, value: Any, ttl: int = 300) -> None:
        """Set value in cache with TTL (in seconds)"""
        self._cache[key] = value
        self._timestamps[key] = datetime.now()
        self._ttls[key] = ttl

    async def delete(self, key: str) -> None:
        """Delete value from cache"""
        self._cache.pop(key, None)
        self._timestamps.pop(key, None)
        self._ttls.pop(key, None)

    async def clear(self) -> None:
        """Clear all cache"""
        self._cache.clear()
        self._timestamps.clear()
        self._ttls.clear()

    async def _is_valid(self, key: str) -> bool:
        """Check if cache entry is still valid based on its TTL"""
        if key not in self._timestamps or key not in self._ttls:
            return False
        
        cache_time = self._timestamps[key]
        ttl = self._ttls[key]
        current_time = datetime.now()
        
        elapsed_seconds = (current_time - cache_time).total_seconds()
        return elapsed_seconds < ttl
    
    async def get_stats(self) -> dict:
        """Get cache statistics"""
        return {
            "total_entries": len(self._cache),
            "keys": list(self._cache.keys())
        }

# Global cache instance
cache = CacheService()