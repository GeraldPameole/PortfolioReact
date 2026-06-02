#!/usr/bin/env python3
"""
update-book-covers.py — récupère les couvertures officielles des livres
depuis l'API publique Open Library et les sauve dans public/assets/books/.

Source : https://openlibrary.org/dev/docs/api/covers
- API gratuite, sans clé, libre de droits pour usage éditorial
- Pas de rate-limit déclaré au-delà de 100 covers/5min/IP pour les tailles L+

Méthode :
1. Parse chaque src/content/books/*.md
2. Extrait `title` et `author` depuis le frontmatter YAML
3. Query openlibrary.org/search.json?title=X&author=Y
4. Récupère le 1er doc avec cover_i renseigné
5. Télécharge covers.openlibrary.org/b/id/{cover_id}-L.jpg
6. Sauve dans public/assets/books/{slug}.jpg

Usage :
    cd ~/code/PortfolioReact
    python3 scripts/update-book-covers.py [--force] [--dry-run]

Options :
    --force    Retélécharge même si l'image existe déjà
    --dry-run  Affiche ce qui serait fait sans rien télécharger

Idempotent : ré-exécuter ne casse rien (et permet de récupérer les couvertures
de nouveaux livres ajoutés à la collection).
"""
from __future__ import annotations  # type hints lazy-eval : compat Python 3.7+

import argparse
import json
import re
import sys
import time
import urllib.parse
import urllib.request
from pathlib import Path

BOOKS_DIR = Path("src/content/books")
OUT_DIR = Path("public/assets/books")
API_SEARCH = "https://openlibrary.org/search.json"
API_COVER = "https://covers.openlibrary.org/b/id/{}-L.jpg"
DELAY_SEC = 0.5  # politesse API entre 2 requêtes


def extract_frontmatter(md_text: str) -> dict:
    """Extrait les clés title et author du frontmatter YAML d'un fichier .md."""
    m = re.match(r"^---\n(.*?)\n---", md_text, re.DOTALL)
    if not m:
        return {}
    fm = m.group(1)
    out = {}
    for key in ("title", "author"):
        km = re.search(rf'^{key}:\s*"?(.+?)"?\s*$', fm, re.M)
        if km:
            out[key] = km.group(1).strip().strip('"')
    return out


def clean_title(title: str) -> str:
    """Retire le sous-titre après ':' ou '—' pour matcher Open Library."""
    return re.split(r"[:—\-]\s+", title, maxsplit=1)[0]


def clean_author(author: str) -> str:
    """Garde le 1er auteur si plusieurs (séparés par ' & ')."""
    return re.split(r"\s*&\s*", author, maxsplit=1)[0]


def query_openlibrary(title: str, author: str) -> tuple[int, str] | None:
    """Retourne (cover_id, matched_title) ou None si rien trouvé."""
    q = urllib.parse.urlencode({"title": title, "author": author, "limit": 3})
    url = f"{API_SEARCH}?{q}"
    try:
        with urllib.request.urlopen(url, timeout=10) as resp:
            data = json.load(resp)
        for doc in data.get("docs", [])[:3]:
            if doc.get("cover_i"):
                return doc["cover_i"], doc.get("title", "?")
    except Exception as e:
        print(f"  ⚠️  ERROR querying Open Library: {e}", file=sys.stderr)
    return None


def download_cover(cover_id: int, target: Path) -> int:
    """Télécharge la cover L et retourne sa taille en octets."""
    url = API_COVER.format(cover_id)
    urllib.request.urlretrieve(url, target)
    return target.stat().st_size


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.split("\n")[1])
    parser.add_argument(
        "--force",
        action="store_true",
        help="Retélécharge même si l'image existe déjà",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Affiche ce qui serait fait sans rien télécharger",
    )
    args = parser.parse_args()

    if not BOOKS_DIR.is_dir():
        print(
            f"❌ {BOOKS_DIR} n'existe pas. "
            "Lance ce script depuis la racine du repo.",
            file=sys.stderr,
        )
        return 2

    OUT_DIR.mkdir(parents=True, exist_ok=True)

    md_files = sorted(BOOKS_DIR.glob("*.md"))
    if not md_files:
        print(f"❌ Aucun .md trouvé dans {BOOKS_DIR}", file=sys.stderr)
        return 2

    print(f"📚 {len(md_files)} livres à traiter\n")
    print(
        f"{'slug':<22} {'title':<26} {'author':<24} "
        f"{'cover_id':<10} {'size':>7}  status"
    )
    print("-" * 110)

    ok, skipped, not_found, errors = 0, 0, 0, 0
    for md in md_files:
        slug = md.stem
        fm = extract_frontmatter(md.read_text(encoding="utf-8"))
        title = fm.get("title", "")
        author = fm.get("author", "")
        if not title or not author:
            print(f"{slug:<22} ⚠️  title ou author manquant dans le frontmatter")
            errors += 1
            continue

        target = OUT_DIR / f"{slug}.jpg"
        if target.exists() and not args.force:
            size = target.stat().st_size
            if size > 5000:  # image valide, pas un stub
                print(
                    f"{slug:<22} {title[:25]:<26} {author[:23]:<24} "
                    f"{'-':<10} {size:>7}  SKIPPED (--force pour écraser)"
                )
                skipped += 1
                continue

        result = query_openlibrary(clean_title(title), clean_author(author))
        if not result:
            print(
                f"{slug:<22} {title[:25]:<26} {author[:23]:<24} "
                f"{'None':<10} {0:>7}  NOT FOUND on Open Library"
            )
            not_found += 1
            time.sleep(DELAY_SEC)
            continue

        cover_id, matched = result
        if args.dry_run:
            print(
                f"{slug:<22} {title[:25]:<26} {author[:23]:<24} "
                f"{cover_id:<10} {'?':>7}  WOULD DOWNLOAD (dry-run)"
            )
            ok += 1
            time.sleep(DELAY_SEC)
            continue

        try:
            size = download_cover(cover_id, target)
            status = "OK" if size > 5000 else "PLACEHOLDER (cover absent)"
            print(
                f"{slug:<22} {title[:25]:<26} {author[:23]:<24} "
                f"{cover_id:<10} {size:>7}  {status}"
            )
            ok += 1
        except Exception as e:
            print(
                f"{slug:<22} {title[:25]:<26} {author[:23]:<24} "
                f"{cover_id:<10} {0:>7}  ERROR: {e}"
            )
            errors += 1
        time.sleep(DELAY_SEC)

    print("-" * 110)
    print(
        f"Bilan : {ok} OK · {skipped} SKIPPED · "
        f"{not_found} NOT FOUND · {errors} ERREURS"
    )
    return 0 if errors == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
