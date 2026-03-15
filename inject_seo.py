import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]

og_img = '<meta property="og:image" content="https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1200&auto=format&fit=crop&q=80">'
twitter_card = '<meta name="twitter:card" content="summary_large_image">'

for filename in html_files:
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.read()

    # Add general tags
    if 'property="og:image"' not in content:
        content = re.sub(r'</head>', f'  {og_img}\n</head>', content, count=1, flags=re.IGNORECASE)
        
    if 'name="twitter:card"' not in content:
        content = re.sub(r'</head>', f'  {twitter_card}\n</head>', content, count=1, flags=re.IGNORECASE)
        
    canon_href = f"https://shonowear.com/{filename if filename != 'index.html' else ''}"
    canonical = f'<link rel="canonical" href="{canon_href}">'
    if 'rel="canonical"' not in content:
        content = re.sub(r'</head>', f'  {canonical}\n</head>', content, count=1, flags=re.IGNORECASE)
        
    # Check title and descriptions
    title_match = re.search(r'<title>([^<]*)</title>', content)
    desc_match = re.search(r'<meta name="description" content="([^"]*)">', content)
    
    if title_match and 'property="og:title"' not in content:
        og_title = f'<meta property="og:title" content="{title_match.group(1)}">'
        content = re.sub(r'</head>', f'  {og_title}\n</head>', content, count=1, flags=re.IGNORECASE)
        
    if desc_match and 'property="og:description"' not in content:
        og_desc = f'<meta property="og:description" content="{desc_match.group(1)}">'
        content = re.sub(r'</head>', f'  {og_desc}\n</head>', content, count=1, flags=re.IGNORECASE)
        
    # Specifics for collection search
    if filename == 'collection.html':
        content = re.sub(r'placeholder="Search products\.\.\."', r'placeholder="Search styles, anime, drops…"', content)
        
    # JSON-LD for index.html
    if filename == 'index.html' and 'application/ld+json' not in content:
        json_ld = """  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Shonowear",
    "url": "https://shonowear.com",
    "logo": "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=1200&auto=format&fit=crop&q=80",
    "founder": {
      "@type": "Person",
      "name": "Kavin J.S"
    }
  }
  </script>"""
        content = re.sub(r'</head>', f'{json_ld}\n</head>', content, count=1, flags=re.IGNORECASE)
        
    with open(filename, 'w', encoding='utf-8') as f:
        f.write(content)

print("SEO update complete.")
