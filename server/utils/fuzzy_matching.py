from fuzzywuzzy import fuzz, process
from .finance_keywords import FINANCE_KEYWORDS, CRYPTO_ABBREVIATIONS
import re

FINANCE_VARIATIONS = {
    'price': ['price', 'cost', 'value', 'worth', 'rate', 'quote'],
    'bitcoin': ['bitcoin', 'btc', 'bit coin', 'bit-coin'],
    'ethereum': ['ethereum', 'eth', 'ether'],
    'crypto': ['crypto', 'cryptocurrency', 'crypto currency', 'digital currency', 'virtual currency'],
    'stock': ['stock', 'stocks', 'share', 'shares', 'equity', 'equities'],
    'market': ['market', 'markets', 'exchange', 'trading'],
    'invest': ['invest', 'investment', 'investing', 'investor'],
    'buy': ['buy', 'purchase', 'acquire', 'get'],
    'sell': ['sell', 'sale', 'dispose', 'liquidate']
}

def fuzzy_match_finance_term(query_word: str, threshold: int = 70) -> tuple:
    """Use fuzzy matching to find the best match for a finance term"""
    all_finance_terms = []
    
    # Add finance keywords
    all_finance_terms.extend(FINANCE_KEYWORDS)
    
    # Add crypto abbreviations
    all_finance_terms.extend(CRYPTO_ABBREVIATIONS.keys())
    all_finance_terms.extend(CRYPTO_ABBREVIATIONS.values())

    # Add finance variations
    for variations in FINANCE_VARIATIONS.values():
        all_finance_terms.extend(variations)
    
    # Remove duplicates and convert to lowercase
    all_finance_terms = list(set([term.lower() for term in all_finance_terms]))
    
    # Use fuzzy matching to find the best match
    best_match = process.extractOne(query_word.lower(), all_finance_terms, scorer=fuzz.ratio)
    
    if best_match and best_match[1] >= threshold:
        return best_match[0], best_match[1]
    
    return None, 0

def normalize_query(query: str) -> str:
    """Enhanced normalization with fuzzy matching for typos"""
    
    query_lower = query.lower().strip()
    words = query_lower.split()
    normalized_words = []
    
    for word in words:
        # Clean the word (remove punctuation)
        clean_word = re.sub(r'[^\w]', '', word)
        
        if len(clean_word) > 2:  # Only process words longer than 2 characters
            # Try fuzzy matching for finance terms
            matched_term, confidence = fuzzy_match_finance_term(clean_word, threshold=75)
            
            if matched_term and confidence >= 75:
                normalized_words.append(matched_term)
            else:
                normalized_words.append(clean_word)
        else:
            normalized_words.append(clean_word)
    
    # Join words back
    normalized_query = ' '.join(normalized_words)
    
    # Replace crypto abbreviations with full names
    for abbrev, full_name in CRYPTO_ABBREVIATIONS.items():
        pattern = r'\b' + re.escape(abbrev) + r'\b'
        normalized_query = re.sub(pattern, full_name, normalized_query)
    
    # Handle common variations
    for base_term, variations in FINANCE_VARIATIONS.items():
        for variation in variations:
            if variation in normalized_query:
                normalized_query = normalized_query.replace(variation, base_term)

    return normalized_query

def is_finance_related(query: str) -> bool:
    """Check if query is finance-related"""
    query_lower = query.lower()
    normalized_query = normalize_query(query)
    
    # Check against finance keywords
    for keyword in FINANCE_KEYWORDS:
        if re.search(r'\b' + re.escape(keyword) + r'\b', query_lower):
            return True
        if re.search(r'\b' + re.escape(keyword) + r'\b', normalized_query):
            return True
    
    # Check for crypto abbreviations
    for abbrev in CRYPTO_ABBREVIATIONS.keys():
        if re.search(r'\b' + re.escape(abbrev) + r'\b', query_lower):
            return True
    
    # Check for stock symbols (1-5 uppercase letters)
    if re.search(r'\b[A-Z]{1,5}\b', query):
        return True
    
    # Check for forex pairs (e.g., USD/EUR, BTC/USD)
    if re.search(r'[A-Z]{3}/[A-Z]{3}', query.upper()):
        return True
    
    # Check for financial symbols and patterns
    if re.search(r'\d+\.?\d*\%', query) or re.search(r'\$\d+', query):
        return True

    # Check if any word in the query has a high fuzzy match with finance terms
    words = re.findall(r'\b\w+\b', query_lower)
    for word in words:
        if len(word) > 2:  # Only check words longer than 2 characters
            matched_term, confidence = fuzzy_match_finance_term(word, threshold=80)
            if matched_term and confidence >= 80:
                return True

    # Check for partial matches in the normalized query
    for keyword in FINANCE_KEYWORDS:
        if fuzz.partial_ratio(keyword, normalized_query) >= 80:
            return True

    return False