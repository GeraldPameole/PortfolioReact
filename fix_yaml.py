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

def fix_yaml_frontmatter(content):
    # Trouver le frontmatter YAML entre les marqueurs ---
    yaml_match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not yaml_match:
        return content
    
    yaml_content = yaml_match.group(1)
    rest_of_content = content[yaml_match.end():]
    
    # Corriger l'indentation et les guillemets
    fixed_lines = []
    current_indent = 0
    in_list = False
    in_related_content = False
    related_content_indent = 0
    
    lines = yaml_content.split('\n')
    i = 0
    while i < len(lines):
        line = lines[i]
        # Détecter l'indentation
        stripped_line = line.lstrip()
        if not stripped_line:
            fixed_lines.append('')
            i += 1
            continue
            
        # Détecter si nous sommes dans la section relatedContent
        if stripped_line.startswith('relatedContent:'):
            in_related_content = True
            related_content_indent = len(line) - len(stripped_line)
            fixed_lines.append(line)
            i += 1
            continue
        elif not line.startswith(' ') and in_related_content:
            in_related_content = False
            
        # Détecter si nous sommes dans une liste
        if stripped_line.startswith('- '):
            in_list = True
            if in_related_content:
                current_indent = related_content_indent + 2
                # Collecter toutes les propriétés de l'élément de la liste
                list_item_lines = []
                i += 1
                while i < len(lines) and not lines[i].lstrip().startswith('- '):
                    stripped = lines[i].lstrip()
                    if ':' in stripped:
                        key, value = stripped.split(':', 1)
                        key = key.strip()
                        value = value.strip()
                        if value:
                            if not (value.startswith('"') and value.endswith('"')):
                                if not (value.startswith('[') or value in ('true', 'false') or value.isdigit()):
                                    value = value.replace("'", "'")
                                    value = f'"{value}"'
                        list_item_lines.append((key, value))
                    i += 1
                
                # Ajouter l'élément de la liste avec ses propriétés correctement indentées
                fixed_lines.append(' ' * current_indent + '- ')
                for key, value in list_item_lines:
                    if value:
                        fixed_lines.append(' ' * (current_indent + 2) + f'{key}: {value}')
                    else:
                        fixed_lines.append(' ' * (current_indent + 2) + f'{key}:')
                continue
            else:
                current_indent = len(line) - len(stripped_line)
        elif not line.startswith(' '):
            in_list = False
            current_indent = 0
            
        # Corriger les guillemets échappés et les apostrophes
        if '\\' in line:
            line = line.replace('\\"', '"')
            line = line.replace("\\'", "'")
        
        # S'assurer que les chaînes contenant des caractères spéciaux sont entre guillemets
        if ':' in stripped_line and not stripped_line.startswith('- '):
            key, value = stripped_line.split(':', 1)
            key = key.strip()
            value = value.strip()
            
            if value:
                # Si la valeur n'est pas vide et n'est pas déjà entre guillemets
                if not (value.startswith('"') and value.endswith('"')):
                    # Si c'est une liste ou un booléen ou un nombre, ne pas ajouter de guillemets
                    if not (value.startswith('[') or value in ('true', 'false') or value.isdigit()):
                        # Remplacer les apostrophes simples par des apostrophes typographiques
                        value = value.replace("'", "'")
                        value = f'"{value}"'
                line = ' ' * current_indent + f'{key}: {value}'
            else:
                line = ' ' * current_indent + f'{key}:'
        
        fixed_lines.append(line)
        i += 1
    
    # Reconstruire le frontmatter
    fixed_yaml = '\n'.join(fixed_lines)
    return f'---\n{fixed_yaml}\n---{rest_of_content}'

def process_markdown_files(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.endswith('.md'):
                file_path = os.path.join(root, file)
                print(f'Processing {file_path}')
                
                try:
                    with open(file_path, 'r', encoding='utf-8') as f:
                        content = f.read()
                    
                    fixed_content = fix_yaml_frontmatter(content)
                    
                    with open(file_path, 'w', encoding='utf-8') as f:
                        f.write(fixed_content)
                    
                    print(f'Fixed {file_path}')
                except Exception as e:
                    print(f'Error processing {file_path}: {str(e)}')

if __name__ == '__main__':
    # Traiter les fichiers dans src/content et src/templates
    process_markdown_files('src/content')
    process_markdown_files('src/templates')
