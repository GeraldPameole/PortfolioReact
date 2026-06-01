#!/usr/bin/env python3
"""
clean-articles.py
Nettoyage automatique des articles markdown :
- Supprime les paragraphes dupliqués
- Supprime les titres consécutifs sans contenu entre eux
- Supprime les phrases génériques répétitives
- Supprime les items de liste identiques
- Corrige les sections numérotées (2) qui dupliquent des sections existantes
"""
import os, re, glob, difflib

BASE = "/Users/geraldpameole/code/PortfolioReact/src/content/articles"

GENERIC_PHRASES = [
    "Ce domaine évolue rapidement avec l'intégration de nouvelles technologies et méthodologies.",
    "Selon les études récentes (2025), l'adoption de bonnes pratiques améliore les performances de 28-38% en moyenne.",
    "Cette approche permet d'optimiser les résultats tout en maintenant un niveau élevé de qualité.",
    "Les recherches montrent que cette méthode est particulièrement efficace dans le contexte actuel.",
    "Il est important de noter que ces pratiques évoluent constamment avec les nouvelles découvertes.",
]

def split_frontmatter(content):
    """Returns (frontmatter, body) where frontmatter includes the --- delimiters."""
    if not content.startswith('---'):
        return '', content
    end = content.find('\n---', 3)
    if end == -1:
        return '', content
    fm = content[:end + 4]  # include closing ---
    body = content[end + 4:]
    return fm, body

def remove_duplicate_paragraphs(text):
    """Remove paragraphs that appear more than once (keep first occurrence)."""
    paragraphs = text.split('\n\n')
    seen = []
    result = []
    for para in paragraphs:
        stripped = para.strip()
        if not stripped:
            result.append(para)
            continue
        # Normalize for comparison (ignore minor whitespace differences)
        normalized = re.sub(r'\s+', ' ', stripped.lower())
        # Check for near-duplicates (>90% similarity)
        is_dup = False
        for s in seen:
            ratio = difflib.SequenceMatcher(None, normalized, s).ratio()
            if ratio > 0.90 and len(stripped) > 80:
                is_dup = True
                break
        if not is_dup:
            seen.append(normalized)
            result.append(para)
    return '\n\n'.join(result)

def remove_generic_phrases(text):
    """Remove lines that contain only generic filler phrases."""
    lines = text.split('\n')
    result = []
    for line in lines:
        stripped = line.strip()
        skip = False
        for phrase in GENERIC_PHRASES:
            if phrase.lower() in stripped.lower() and len(stripped) < len(phrase) + 100:
                skip = True
                break
        if not skip:
            result.append(line)
    return '\n'.join(result)

def remove_empty_headers(text):
    """Remove a header if the next non-empty line is also a header."""
    lines = text.split('\n')
    result = []
    i = 0
    while i < len(lines):
        line = lines[i]
        if re.match(r'^#{1,4}\s+', line):
            # Look ahead: find next non-empty line
            j = i + 1
            while j < len(lines) and not lines[j].strip():
                j += 1
            # If next non-empty line is also a header (same or higher level), skip this one
            if j < len(lines) and re.match(r'^#{1,4}\s+', lines[j]):
                i += 1
                continue
        result.append(line)
        i += 1
    return '\n'.join(result)

def remove_duplicate_list_items(text):
    """Remove duplicate consecutive list items."""
    lines = text.split('\n')
    result = []
    prev_item = None
    for line in lines:
        if re.match(r'^\s*[-*]\s+', line):
            content = re.sub(r'^\s*[-*]\s+', '', line).strip().lower()
            if content and content == prev_item:
                continue  # skip duplicate
            prev_item = content
        else:
            prev_item = None
        result.append(line)
    return '\n'.join(result)

def remove_numbered_duplicates(text):
    """Remove sections suffixed with (2) that duplicate existing sections."""
    # Pattern: ### Title (2) or ## Title (2)
    pattern = re.compile(r'^(#{1,4})\s+(.+?)\s+\(2\)\s*$', re.MULTILINE)
    return pattern.sub('', text)

def collapse_blank_lines(text):
    """Collapse more than 2 consecutive blank lines into 2."""
    return re.sub(r'\n{4,}', '\n\n\n', text)

def clean_article(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    fm, body = split_frontmatter(content)

    original_body = body
    body = remove_generic_phrases(body)
    body = remove_numbered_duplicates(body)
    body = remove_empty_headers(body)
    body = remove_duplicate_list_items(body)
    body = remove_duplicate_paragraphs(body)
    body = collapse_blank_lines(body)

    if body.strip() == original_body.strip():
        return False  # no changes

    new_content = fm + body
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)
    return True

# Run on all articles
files = sorted(glob.glob(f"{BASE}/**/*.md", recursive=True))
fixed = 0
skipped = 0

for fp in files:
    try:
        changed = clean_article(fp)
        rel = fp.replace(BASE + '/', '')
        if changed:
            print(f"✅ {rel}")
            fixed += 1
        else:
            skipped += 1
    except Exception as e:
        print(f"❌ {fp}: {e}")

print(f"\n{'─'*50}")
print(f"✅ {fixed} articles nettoyés")
print(f"⏭️  {skipped} articles déjà propres")
print(f"📁 {len(files)} articles total")
