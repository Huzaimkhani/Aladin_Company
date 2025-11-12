import os
import re

def fix_relative_imports(file_path):
    """Replace relative imports with absolute imports"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace ..services. with services.
    content = re.sub(r'from \.\.services\.', 'from services.', content)
    
    # Replace ..models. with models.
    content = re.sub(r'from \.\.models\.', 'from models.', content)
    
    # Replace ..config with config
    content = re.sub(r'from \.\.config', 'from config', content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print(f"✅ Fixed: {file_path}")

# Fix all router files
router_files = [
    'routers/ai.py',
    'routers/crypto.py',
    'routers/stocks.py',
    'routers/finance.py',
    'routers/charts.py'
]

for file in router_files:
    if os.path.exists(file):
        fix_relative_imports(file)
    else:
        print(f"⚠️  File not found: {file}")

print("\n🎉 All imports fixed! Try running your server again.")