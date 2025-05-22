import os
import re

def is_numeric(value):
    try:
        float(value)
        return True
    except ValueError:
        return False

def is_boolean(value):
    return value.lower() in ['true', 'false']

def fix_yaml_frontmatter(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extraire le frontmatter
    frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not frontmatter_match:
        return False

    frontmatter = frontmatter_match.group(1)
    rest_of_content = content[frontmatter_match.end():]

    # Standardiser l'ordre des champs
    field_order = [
        'draft',
        'title',
        'description',
        'date',
        'author',
        'type',
        'featured',
        'readingTime',
        'hasMermaid',
        'targetAudience',
        'domain',
        'tags',
        'pillColor',
        'skills',
        'relatedArticles'
    ]

    # Extraire tous les champs
    fields = {}
    for line in frontmatter.split('\n'):
        if ':' in line:
            key, value = line.split(':', 1)
            key = key.strip()
            value = value.strip()
            
            # Traiter les listes
            if value.startswith('['):
                value = value.strip('[]')
                items = [item.strip().strip("'").strip('"') for item in value.split(',')]
                value = '[' + ', '.join(f'"{item}"' for item in items if item) + ']'
            else:
                # Traiter les valeurs simples
                value = value.strip("'").strip('"')
                
                # Ne pas mettre de guillemets pour les booléens et les nombres
                if is_boolean(value):
                    value = value.lower()
                elif is_numeric(value):
                    value = value
                else:
                    # Remplacer les apostrophes par des apostrophes typographiques
                    value = value.replace("'", "'")
                    # Échapper les guillemets doubles
                    value = value.replace('"', '\\"')
                    value = f'"{value}"'
            
            fields[key] = value

    # Reconstruire le frontmatter dans l'ordre correct
    new_frontmatter = []
    for field in field_order:
        if field in fields:
            new_frontmatter.append(f'{field}: {fields[field]}')

    # Reconstruire le fichier complet
    new_content = '---\n' + '\n'.join(new_frontmatter) + '\n---' + rest_of_content

    # Sauvegarder les modifications
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

    return True

def main():
    articles_dir = 'src/content/articles'
    for filename in os.listdir(articles_dir):
        if filename.endswith('.md'):
            file_path = os.path.join(articles_dir, filename)
            if fix_yaml_frontmatter(file_path):
                print(f'Fixed {filename}')

if __name__ == '__main__':
    main()
