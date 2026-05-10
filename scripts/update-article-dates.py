#!/usr/bin/env python3
"""
Redistribue les dates de publication des articles sur un rythme
de 1 article par semaine depuis le 2025-01-06 (lundi semaine 2).
Les articles sont triés par dossier/nom pour assurer une répartition cohérente.
"""
import os, re
from datetime import date, timedelta

ARTICLES_DIR = "src/content/articles"
START_DATE   = date(2025, 1, 6)   # premier lundi 2025
INTERVAL     = timedelta(weeks=1)

# Collecter tous les articles
all_files = []
for root, dirs, files in os.walk(ARTICLES_DIR):
    dirs.sort()
    for f in sorted(files):
        if f.endswith('.md'):
            all_files.append(os.path.join(root, f))

all_files.sort()  # ordre alphabétique stable

print(f"Articles trouvés : {len(all_files)}")

current_date = START_DATE
fixed = 0

for path in all_files:
    with open(path) as fh:
        content = fh.read()

    parts = content.split('---', 2)
    if len(parts) < 3:
        current_date += INTERVAL
        continue

    fm   = parts[1]
    body = parts[2]
    new_date = current_date.strftime('%Y-%m-%d')

    # Remplacer publishDate
    new_fm = re.sub(
        r'(publishDate:\s*["\']?)[\d-]+(["\']?)',
        lambda m: f'{m.group(1)}{new_date}{m.group(2)}',
        fm
    )

    if new_fm != fm:
        with open(path, 'w') as fh:
            fh.write('---' + new_fm + '---' + body)
        fixed += 1
        domain = os.path.basename(os.path.dirname(path))
        print(f"  {new_date}  {domain}/{os.path.basename(path)}")

    current_date += INTERVAL

print(f"\nTotal mis à jour : {fixed}")
last = current_date - INTERVAL
print(f"Dernière date    : {last}")
