#!/usr/bin/env python3
"""
fix-tags.py
Corrige les tags qui contiennent des objets YAML (- domain: x) au lieu de strings.
Remplace le bloc tags entier par une liste de strings propres dérivées du domaine.
"""
import os, re, glob

BASE = "/Users/geraldpameole/code/PortfolioReact/src/content/articles"

DOMAIN_TAGS = {
    "gestion-talents":         ["gestion-talents", "recrutement", "rh", "management"],
    "productivite-methodes":   ["productivite", "methodes", "organisation", "efficacite"],
    "service-client":          ["service-client", "relation-client", "satisfaction"],
    "leadership-management":   ["leadership", "management", "equipe", "organisation"],
    "qualite-process":         ["qualite", "processus", "amelioration-continue"],
    "marketing-communication": ["marketing", "communication", "digital", "strategie"],
    "gestion-projet":          ["gestion-projet", "agile", "methodologie", "performance"],
    "outils-techniques":       ["outils", "techniques", "digital", "technologie"],
    "innovation-technologies": ["innovation", "technologies", "ia", "transformation"],
    "transformation-digitale": ["transformation-digitale", "numerique", "strategie"],
    "developpement-web":       ["developpement-web", "javascript", "frontend", "web"],
    "gestion-connaissances":   ["gestion-connaissances", "knowledge-management", "organisation"],
    "formation":               ["formation", "competences", "apprentissage", "developpement"],
    "developpement-commercial":["developpement-commercial", "vente", "negociation"],
    "reconversion-carriere":   ["reconversion", "carriere", "transition-professionnelle"],
}

def fix_tags_in_frontmatter(fm_raw, domain):
    """Replace the tags block with a clean string list."""
    # Find the tags block (tags: followed by lines starting with '  -')
    tags_pattern = re.compile(
        r'^(tags:\s*\n)((?:[ \t]*-[^\n]*\n)*)',
        re.MULTILINE
    )
    clean_tags = DOMAIN_TAGS.get(domain, ["article", "professionnel"])
    tags_str = "tags:\n" + "".join(f"  - {t}\n" for t in clean_tags)

    if tags_pattern.search(fm_raw):
        new_fm = tags_pattern.sub(tags_str, fm_raw)
    else:
        new_fm = fm_raw + f"\ntags:\n" + "".join(f"  - {t}\n" for t in clean_tags)

    return new_fm

fixed = 0
for filepath in sorted(glob.glob(f"{BASE}/**/*.md", recursive=True)):
    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match:
        continue

    fm_raw = fm_match.group(1)

    # Check if tags contain objects (lines like "  - domain: x" or "  - pillColor:")
    if not re.search(r'^  - (?:domain|pillColor|theme|keywords):', fm_raw, re.MULTILINE):
        continue

    body = content[fm_match.end():]

    # Determine domain
    rel = os.path.relpath(filepath, BASE)
    domain = rel.split(os.sep)[0]
    dm = re.search(r'^domain:\s*(.+)$', fm_raw, re.MULTILINE)
    if dm:
        domain = dm.group(1).strip()

    new_fm = fix_tags_in_frontmatter(fm_raw, domain)
    new_content = f"---\n{new_fm}\n---{body}"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ {rel}")
    fixed += 1

print(f"\n✅ {fixed} fichiers corrigés")
