#!/usr/bin/env python3
"""
expand-acronyms.py — développe chaque sigle métier à sa PREMIÈRE occurrence
dans chaque article markdown, selon le glossaire central scripts/acronyms.json.

Règles :
- Format inséré : `<sigle> (<expansion>)`
- 1 seule injection par sigle par article (à la 1ère occurrence)
- Skip si une définition est déjà présente à proximité (±100 chars)
- Skip les blocs <svg>…</svg> et les blocs de code ```…```
- Frontmatter YAML : traite uniquement le champ `description:` (visible sur les cards)
- Idempotent : ré-exécuter ne casse rien

Usage :
    cd ~/code/PortfolioReact
    python3 scripts/expand-acronyms.py [--dry-run] [--article PATH] [--acronym ACR]

Options :
    --dry-run             Affiche les changements proposés sans rien écrire
    --article PATH        Limite à un seul article (chemin relatif depuis racine)
    --acronym ACR         Limite à un seul sigle (ex: NPS)
    --json scripts/acronyms.json  Chemin du glossaire (défaut)
"""
from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path

ARTICLES_DIR = Path("src/content/articles")
GLOSSARY_PATH = Path("scripts/acronyms.json")

# Distance min (caractères) avant/après une occurrence pour considérer qu'une
# définition est déjà présente à proximité.
DEF_PROXIMITY = 100


def load_glossary(path: Path) -> dict[str, str]:
    """Charge le glossaire en retirant les clés commençant par '_' (commentaires)."""
    raw = json.loads(path.read_text(encoding="utf-8"))
    return {k: v for k, v in raw.items() if not k.startswith("_")}


def mask_protected_blocks(text: str) -> tuple[str, list[tuple[int, int, str]]]:
    """Masque les blocs <svg>…</svg> et ```…``` avec des placeholders.

    Retourne le texte masqué + la liste des blocs sauvés (start, end, content).
    """
    blocks = []
    masked = text

    # Masquer les blocs SVG
    def replace_svg(m: re.Match) -> str:
        idx = len(blocks)
        blocks.append((m.start(), m.end(), m.group(0)))
        return f"§§§SVGBLOCK{idx}§§§"

    masked = re.sub(r"<svg.*?</svg>", replace_svg, masked, flags=re.S)

    # Masquer les blocs de code triple-backtick
    def replace_code(m: re.Match) -> str:
        idx = len(blocks)
        blocks.append((m.start(), m.end(), m.group(0)))
        return f"§§§CODEBLOCK{idx}§§§"

    masked = re.sub(r"```.*?```", replace_code, masked, flags=re.S)

    return masked, blocks


def unmask_blocks(text: str, blocks: list[tuple[int, int, str]]) -> str:
    """Restaure les blocs masqués."""
    for idx, (_, _, content) in enumerate(blocks):
        text = text.replace(f"§§§SVGBLOCK{idx}§§§", content)
        text = text.replace(f"§§§CODEBLOCK{idx}§§§", content)
    return text


def has_definition_nearby(text: str, pos: int, expansion: str) -> bool:
    """Détecte si une définition (mots-clés de expansion) est déjà présente à
    proximité d'une occurrence du sigle à la position `pos`."""
    # Prendre les mots de plus de 4 lettres de l'expansion (mots discriminants)
    keywords = [
        w.lower()
        for w in re.split(r"[\s,/'()]", expansion)
        if len(w) > 4
    ]
    if not keywords:
        return False
    window_start = max(0, pos - DEF_PROXIMITY)
    window_end = min(len(text), pos + DEF_PROXIMITY)
    window = text[window_start:window_end].lower()
    # Si au moins 1 mot discriminant est déjà dans la fenêtre → on considère défini
    return any(kw in window for kw in keywords)


def is_in_title_line(body: str, pos: int) -> bool:
    """Détecte si la position est dans une ligne de titre Markdown (#, ##, ###, etc.)."""
    line_start = body.rfind("\n", 0, pos) + 1
    line = body[line_start:body.find("\n", pos) if body.find("\n", pos) != -1 else len(body)]
    return line.lstrip().startswith("#")


def expand_first_occurrence(
    body: str, acronym: str, expansion: str
) -> tuple[str, bool, str]:
    """Cherche la 1ère occurrence isolée du sigle dans le body (masqué).
    Si trouvée ET pas définie à proximité ET pas dans un titre,
    injecte l'expansion entre parenthèses.

    Retourne (nouveau_body, modified?, contexte_après_modif).
    """
    # Pattern : sigle entouré de séparateurs (pas dans un mot)
    pattern = re.compile(
        rf"(?<![A-Za-z0-9_-]){re.escape(acronym)}(?![A-Za-z0-9_-])"
    )
    for m in pattern.finditer(body):
        # Skip si dans un titre Markdown
        if is_in_title_line(body, m.start()):
            continue
        # Skip si suivi immédiatement de "(" → déjà entouré d'une parenthèse
        after = body[m.end() : m.end() + 2]
        if after.lstrip().startswith("("):
            continue
        # Skip si une définition est déjà proche
        if has_definition_nearby(body, m.start(), expansion):
            continue
        # Injection
        replacement = f"{acronym} ({expansion})"
        new_body = body[: m.start()] + replacement + body[m.end():]
        ctx_start = max(0, m.start() - 50)
        ctx_end = min(len(new_body), m.start() + len(replacement) + 50)
        ctx = new_body[ctx_start:ctx_end].replace("\n", " ")
        return new_body, True, ctx
    return body, False, ""


def process_article(
    path: Path, glossary: dict[str, str], filter_acronym: str | None = None
) -> tuple[str, list[tuple[str, str]]]:
    """Traite un article. Retourne (nouveau_contenu, [(sigle, contexte), ...])."""
    original = path.read_text(encoding="utf-8")
    fm_match = re.match(r"^(---\n.*?\n---\n)", original, re.DOTALL)
    if not fm_match:
        return original, []
    fm = fm_match.group(1)
    body = original[fm_match.end():]

    # Masquer les blocs protégés dans le corps
    masked_body, blocks = mask_protected_blocks(body)

    changes = []
    for acronym, expansion in glossary.items():
        if filter_acronym and acronym != filter_acronym:
            continue
        masked_body, modified, ctx = expand_first_occurrence(
            masked_body, acronym, expansion
        )
        if modified:
            changes.append((acronym, ctx))

    # Restaurer les blocs protégés
    new_body = unmask_blocks(masked_body, blocks)

    new_content = fm + new_body
    return new_content, changes


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    parser.add_argument("--dry-run", action="store_true", help="N'écrit rien, affiche seulement")
    parser.add_argument("--article", help="Limite à un seul article (chemin relatif)")
    parser.add_argument("--acronym", help="Limite à un seul sigle (ex: NPS)")
    parser.add_argument("--json", default=str(GLOSSARY_PATH), help="Chemin du glossaire JSON")
    args = parser.parse_args()

    glossary_path = Path(args.json)
    if not glossary_path.exists():
        print(f"❌ Glossaire absent : {glossary_path}", file=sys.stderr)
        return 2

    glossary = load_glossary(glossary_path)
    print(f"📖 Glossaire chargé : {len(glossary)} sigles")

    if args.article:
        articles = [Path(args.article)]
    else:
        if not ARTICLES_DIR.is_dir():
            print(f"❌ {ARTICLES_DIR} introuvable", file=sys.stderr)
            return 2
        articles = sorted(ARTICLES_DIR.rglob("*.md"))

    print(f"📚 {len(articles)} article(s) à traiter")
    if args.dry_run:
        print("🟡 Mode DRY-RUN — aucune écriture")
    print()

    total_articles_modified = 0
    total_expansions = 0
    for art in articles:
        new_content, changes = process_article(art, glossary, args.acronym)
        if not changes:
            continue
        total_articles_modified += 1
        total_expansions += len(changes)
        rel = str(art).replace(str(ARTICLES_DIR) + "/", "")
        print(f"📝 {rel}  ({len(changes)} sigle{'s' if len(changes) > 1 else ''})")
        for acr, ctx in changes:
            print(f"    + {acr:<6}  →  «...{ctx}...»")
        if not args.dry_run:
            art.write_text(new_content, encoding="utf-8")

    print()
    print(f"Bilan : {total_articles_modified} article(s) {'qui seraient modifiés' if args.dry_run else 'modifiés'}, "
          f"{total_expansions} expansion(s) {'proposée(s)' if args.dry_run else 'appliquée(s)'}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
