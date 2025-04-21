#!/bin/bash

# Script pour ajouter le champ type à tous les livres
echo "Mise à jour du champ type pour tous les livres..."

# Répertoire des livres
BOOKS_DIR="src/content/books"

# Liste tous les fichiers de livres
for book in "$BOOKS_DIR"/*.md; do
  echo "Traitement de $book..."
  
  # Vérifie si le champ type existe déjà
  if ! grep -q 'type: "book"' "$book"; then
    # Ajoute le champ type après le titre
    sed -i '' -e '/title:/a\
type: "book"' "$book"
    echo "  ✅ Ajout du champ type: \"book\" à $book"
  else
    echo "  ℹ️ Le champ type existe déjà"
  fi
done

echo "Tous les livres ont été mis à jour!" 