import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    # API Keys
    COINGECKO_API = "https://api.coingecko.com/api/v3"
    COINGECKO_KEY = os.getenv("COINGECKO_KEY", "CG-2UeiWeYFX2aSqEf8E6MSLn3M")
    ALPHA_VANTAGE_KEY = os.getenv("ALPHA_VANTAGE_KEY", "J4JR4K6HSSRZI0XQ")
    ALPHA_VANTAGE_FOREX_KEY = os.getenv("ALPHA_VANTAGE_FOREX_KEY", "287VYXVHSBYQ2K3D")
    NEWS_API_KEY = os.getenv("NEWS_API_KEY", "2a23841bd725419c8879a162aba88d0f")
    FRED_API_KEY = os.getenv("FRED_API_KEY", "f17ce42fa92ba97d74fa58962176a4c0")
    AIMLAPI_KEY = os.getenv("AIMLAPI_KEY", "66d901f08be441119a4cfda40d4089e1")
    SERPER_API = os.getenv("SERPER_API", "1c06f769b862ff008429dc55a4873d1b91e76c0a")
    
    # Fallback APIs
    FINNHUB_KEY = os.getenv("FINNHUB_KEY", "d34oho9r01qhorbf1uqgd34oho9r01qhorbf1ur0") # Legacy, but can be used for parallel stock fetching
    COINMARKETCAP_KEY = os.getenv("COINMARKETCAP_KEY", "425ba6fa-9653-4518-80e2-670c889d38a2")
    CURRENCYLAYER_KEY = os.getenv("CURRENCYLAYER_KEY", "22bd072872251a32787e8ab6ec5f2de1")
    
    # App Settings
    FREE_QUERIES_PER_DAY = 100
    CACHE_DURATION = {
        'crypto': 300,
        'forex': 300,
        'stocks': 120,
        'bitcoin': 60
    }
    
    # Solana
    RECEIVER_WALLET = "EqdQrA4HVc9Y8Lg4pADSaghrxFA4GZPUV3phTaUeQKni"

settings = Settings()