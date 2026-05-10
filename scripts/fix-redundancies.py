#!/usr/bin/env python3
"""
Supprime les redondances textuelles systématiques dans les articles :
- "**X** X..." où X est répété (bold label + même texte en clair)
- Doubles points ".."
- Sections filler numérotées (SOURCES ET RÉFÉRENCES, LIVRES RECOMMANDÉS, ARTICLES ANNEXES)
- Headers "### N.N Définition et Concepts Clés" / "### N.N Ma Méthodologie Éprouvée : Le Framework..."
- Fausses stats ("Sur 80 équipes accompagnées", "90% des organisations", etc.)
- Marqueurs "**Ce que révèle mon expérience :**" isolés sans valeur
"""
import os, re, sys

ARTICLES_DIR = "src/content/articles"

# Articles gérés par agents en arrière-plan — ne pas toucher
AGENT_FILES = {
    'gestion-projet/gestion-projet-agile.md',
    'gestion-projet/gestion-performance-equipe.md',
    'gestion-projet/gestion-projet-risques.md',
    'developpement-web/tendances-developpement-web-2025.md',
    'developpement-web/react-performance-optimisation.md',
    'transformation-digitale/transformation-digitale-telecom.md',
    'leadership-management/leadership-equipes-performance.md',
    'productivite-methodes/deep-work.md',
    'innovation-technologies/ia-transformation-societe-2024-analyse.md',
    'qualite-process/gestion-qualite-entreprise.md',
}

def clean_body(body: str) -> str:
    # ── 1. Redondance "**X** X..." ─────────────────────────────────────────
    # Détecte quand le texte en gras est immédiatement suivi du même texte
    def fix_bold_repeat(m):
        bold_text = m.group(1).strip()
        rest = m.group(2).strip()
        # Si rest commence par le même texte que bold_text (tolérance casse)
        rest_lower = rest.lower()
        bold_lower = bold_text.lower()
        if rest_lower.startswith(bold_lower[:20]):
            # Supprimer le préfixe en gras, garder la phrase complète
            return rest
        # Sinon garder (le bold est un vrai label)
        return m.group(0)

    body = re.sub(
        r'\*\*([^*]{5,120})\*\*\s+([A-ZÀ-Ö][^.\n]{10,})',
        fix_bold_repeat,
        body
    )

    # ── 2. Suppression sections filler ────────────────────────────────────
    # Supprimer depuis "## N. SOURCES ET RÉFÉRENCES" jusqu'à la fin (ou fin de section)
    body = re.sub(
        r'\n## \d+\. (?:SOURCES ET RÉFÉRENCES|LIVRES RECOMMANDÉS|ARTICLES ANNEXES).*',
        '',
        body,
        flags=re.DOTALL
    )
    # Version sans numéro
    body = re.sub(
        r'\n## (?:SOURCES ET RÉFÉRENCES|LIVRES RECOMMANDÉS|ARTICLES ANNEXES).*',
        '',
        body,
        flags=re.DOTALL
    )

    # ── 3. Headers génériques de type "### N.N Définition et Concepts Clés" ──
    body = re.sub(
        r'\n### \d+\.\d+ Définition et Concepts Clés\n',
        '\n',
        body
    )
    body = re.sub(
        r'\n### \d+\.\d+ Ma Méthodologie[^\n]*\n',
        '\n',
        body
    )
    body = re.sub(
        r'\n### Comparatif d\'Outils - Retour d\'Expérience Personnel\n',
        '\n',
        body
    )

    # ── 4. Double points ".." → "." ───────────────────────────────────────
    body = re.sub(r'\.\.+', '.', body)

    # ── 5. Fausses stats génériques ───────────────────────────────────────
    # "Sur X équipes/organisations/projets accompagnés" avec chiffres ronds suspicieux
    body = re.sub(
        r'Sur \d+ (?:équipes?|organisations?|projets?|professionnels?) accompagn[eéés]+,\s*',
        '',
        body
    )

    # ── 6. Bold markers isolés sans valeur ────────────────────────────────
    # "**Ce que révèle mon expérience :**" suivi de son propre contenu
    body = re.sub(r'\*\*Ce que révèle mon expérience :\*\*\s*', '', body)
    body = re.sub(r'\*\*Impact mesuré :\*\*\s*', '', body)
    body = re.sub(r'\*\*Résultat observé :\*\*\s*', '', body)

    # ── 7. Lignes vides multiples → max 2 ─────────────────────────────────
    body = re.sub(r'\n{4,}', '\n\n\n', body)

    # ── 8. Sections "### N.N Défis Principaux" génériques ─────────────────
    body = re.sub(
        r'\n### \d+\.\d+ Défis Principaux\n',
        '\n',
        body
    )

    return body.rstrip() + '\n'


def process_file(path: str, rel: str) -> bool:
    with open(path) as f:
        content = f.read()

    parts = content.split('---', 2)
    if len(parts) < 3:
        return False

    fm   = parts[1]
    body = parts[2]
    new_body = clean_body(body)

    if new_body == body:
        return False

    with open(path, 'w') as f:
        f.write('---' + fm + '---' + new_body)
    return True


# ── Run ────────────────────────────────────────────────────────────────────
fixed = 0
checked = 0
for root, dirs, files in os.walk(ARTICLES_DIR):
    dirs.sort()
    for fname in sorted(files):
        if not fname.endswith('.md'):
            continue
        domain = os.path.basename(root)
        rel = f'{domain}/{fname}'
        if rel in AGENT_FILES:
            continue
        path = os.path.join(root, fname)
        checked += 1
        if process_file(path, rel):
            fixed += 1
            print(f'Fixed: {rel}')

print(f'\nChecked: {checked} | Fixed: {fixed}')
