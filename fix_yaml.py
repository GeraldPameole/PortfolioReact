import os
import re

def fix_yaml_frontmatter(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Extraire le frontmatter
    frontmatter_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not frontmatter_match:
        return False

    frontmatter = frontmatter_match.group(1)
    rest_of_content = content[frontmatter_match.end():]

    # Remplacer les guillemets simples par des guillemets doubles
    fixed_frontmatter = re.sub(r"'([^']*)'", r'"\1"', frontmatter)

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
    for line in fixed_frontmatter.split('\n'):
        if ':' in line:
            key = line.split(':', 1)[0].strip()
            value = line.split(':', 1)[1].strip()
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
