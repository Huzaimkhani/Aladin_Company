from fuzzywuzzy import fuzz, process
from .finance_keywords import FINANCE_KEYWORDS, CRYPTO_ABBREVIATIONS

def fuzzy_match_finance_term(query_word: str, threshold: int = 70) -> tuple:
    """Use fuzzy matching to find the best match for a finance term"""
    all_finance_terms = []
    
    # Add finance keywords
    all_finance_terms.extend(FINANCE_KEYWORDS)
    
    # Add crypto abbreviations
    all_finance_terms.extend(CRYPTO_ABBREVIATIONS.keys())
    all_finance_terms.extend(CRYPTO_ABBREVIATIONS.values())
    
    # Remove duplicates and convert to lowercase
    all_finance_terms = list(set([term.lower() for term in all_finance_terms]))
    
    # Use fuzzy matching to find the best match
    best_match = process.extractOne(query_word.lower(), all_finance_terms, scorer=fuzz.ratio)
    
    if best_match and best_match[1] >= threshold:
        return best_match[0], best_match[1]
    
    return None, 0

def normalize_query(query: str) -> str:
    """Enhanced normalization with fuzzy matching for typos"""
    import re
    
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
    
    return False