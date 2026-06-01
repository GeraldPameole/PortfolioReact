#!/usr/bin/env python3
"""
fix-frontmatter.py
Ajoute les champs obligatoires manquants dans le frontmatter des articles.
Champs requis par le schéma Astro : title, description, publishDate, type
"""
import os, re, glob

BASE = "/Users/geraldpameole/code/PortfolioReact/src/content/articles"

# Derive a readable title from filename
def slug_to_title(filename):
    name = os.path.splitext(filename)[0]
    # Replace hyphens with spaces and capitalize
    words = name.replace("-", " ").replace("_", " ").split()
    return " ".join(w.capitalize() for w in words)

# Map domain slug to a default description suffix
DOMAIN_DESCS = {
    "gestion-talents":         "Stratégies et bonnes pratiques pour la gestion des talents en entreprise.",
    "productivite-methodes":   "Méthodes et outils pour améliorer la productivité et l'efficacité professionnelle.",
    "service-client":          "Techniques et stratégies pour exceller dans la relation et le service client.",
    "leadership-management":   "Approches modernes du leadership et du management d'équipe.",
    "qualite-process":         "Démarches qualité et optimisation des processus en entreprise.",
    "marketing-communication": "Stratégies marketing et communication digitale pour les professionnels.",
    "gestion-projet":          "Méthodes et outils pour une gestion de projet efficace et performante.",
    "outils-techniques":       "Outils techniques et ressources pour les professionnels du digital.",
    "innovation-technologies": "Innovation, intelligence artificielle et nouvelles technologies.",
    "transformation-digitale": "Accompagner et réussir la transformation digitale de l'entreprise.",
    "developpement-web":       "Développement web moderne : frameworks, tendances et bonnes pratiques.",
    "gestion-connaissances":   "Gestion et partage des connaissances pour l'organisation apprenante.",
    "formation":               "Formation professionnelle et développement des compétences.",
    "developpement-commercial":"Stratégies et techniques pour le développement commercial.",
    "reconversion-carriere":   "Accompagnement et conseils pour une reconversion professionnelle réussie.",
}

DOMAIN_THEMES = {
    "gestion-talents":         "management",
    "productivite-methodes":   "productivite",
    "service-client":          "management",
    "leadership-management":   "leadership",
    "qualite-process":         "qualite",
    "marketing-communication": "marketing",
    "gestion-projet":          "gestion",
    "outils-techniques":       "technique",
    "innovation-technologies": "innovation",
    "transformation-digitale": "transformation",
    "developpement-web":       "web",
    "gestion-connaissances":   "connaissances",
    "formation":               "formation",
    "developpement-commercial":"commercial",
    "reconversion-carriere":   "carriere",
}

DOMAIN_PILLS = {
    "gestion-talents":         "green",
    "productivite-methodes":   "blue",
    "service-client":          "teal",
    "leadership-management":   "purple",
    "qualite-process":         "orange",
    "marketing-communication": "pink",
    "gestion-projet":          "indigo",
    "outils-techniques":       "gray",
    "innovation-technologies": "cyan",
    "transformation-digitale": "violet",
    "developpement-web":       "blue",
    "gestion-connaissances":   "yellow",
    "formation":               "green",
    "developpement-commercial":"orange",
    "reconversion-carriere":   "purple",
}

fixed = 0
skipped = 0

for filepath in sorted(glob.glob(f"{BASE}/**/*.md", recursive=True)):
    with open(filepath, encoding="utf-8") as f:
        content = f.read()

    # Parse existing frontmatter
    fm_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not fm_match:
        print(f"⚠️  No frontmatter: {os.path.relpath(filepath, BASE)}")
        skipped += 1
        continue

    fm_raw = fm_match.group(1)
    body = content[fm_match.end():]

    # Check what's missing
    has_title       = bool(re.search(r'^title:', fm_raw, re.MULTILINE))
    has_desc        = bool(re.search(r'^description:', fm_raw, re.MULTILINE))
    has_publishDate = bool(re.search(r'^publishDate:', fm_raw, re.MULTILINE))
    has_type        = bool(re.search(r'^type:', fm_raw, re.MULTILINE))

    if has_title and has_desc and has_publishDate and has_type:
        skipped += 1
        continue

    # Determine domain from path
    rel = os.path.relpath(filepath, BASE)
    domain = rel.split(os.sep)[0]
    filename = os.path.basename(filepath)
    title = slug_to_title(filename)

    # Extract existing domain/pillColor/theme if present
    existing_domain = re.search(r'^domain:\s*(.+)$', fm_raw, re.MULTILINE)
    if existing_domain:
        domain = existing_domain.group(1).strip()

    desc = DOMAIN_DESCS.get(domain, "Article professionnel sur les pratiques et stratégies métier.")
    theme = DOMAIN_THEMES.get(domain, "general")
    pill = DOMAIN_PILLS.get(domain, "blue")

    # Build additions (only what's missing)
    additions = []
    if not has_title:
        additions.append(f'title: "{title}"')
    if not has_desc:
        additions.append(f'description: "{desc}"')
    if not has_publishDate:
        additions.append('publishDate: "2025-01-01"')
    if not has_type:
        additions.append('type: article')

    # Also ensure domain, pillColor, theme are present
    if not re.search(r'^domain:', fm_raw, re.MULTILINE):
        additions.append(f'domain: {domain}')
    if not re.search(r'^pillColor:', fm_raw, re.MULTILINE):
        additions.append(f'pillColor: {pill}')
    if not re.search(r'^theme:', fm_raw, re.MULTILINE):
        additions.append(f'theme: {theme}')

    # Prepend additions to existing frontmatter
    new_fm = "\n".join(additions) + "\n" + fm_raw
    new_content = f"---\n{new_fm}\n---{body}"

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ {rel}")
    fixed += 1

print(f"\n✅ {fixed} articles corrigés, {skipped} déjà valides")
