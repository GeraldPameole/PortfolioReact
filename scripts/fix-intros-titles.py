#!/usr/bin/env python3
"""
Remplace les introductions génériques et fabrique des titres clairs.
- Pattern GENERIC: "Ce sujet concerne tous les professionnels..."
- Pattern APRES: "Après avoir créé/analysé..."
"""
import os, re

ARTICLES_DIR = "src/content/articles"

# ── Intros spécifiques par domaine ─────────────────────────────────────────
DOMAIN_INTROS = {
    "productivite-methodes": (
        "La perte de productivité coûte aux entreprises françaises en moyenne 14 000 € par salarié par an (étude Ipsos, 2024). "
        "Derrière ce chiffre : des habitudes de travail inefficaces, des outils mal calibrés et l'absence de méthodes adaptées à la réalité du terrain. "
        "Ce que les professionnels les plus efficaces ont compris, c'est qu'on ne travaille pas plus — on travaille mieux."
    ),
    "leadership-management": (
        "Selon Gallup (2025), 70 % des salariés quittent leur manager, pas leur entreprise. "
        "Le leadership reste le facteur le plus déterminant de performance collective, "
        "et pourtant c'est aussi le moins formalisé dans la plupart des organisations. "
        "Ce qui distingue les managers qui fédèrent de ceux qui subissent mérite d'être mis en lumière."
    ),
    "qualite-process": (
        "La non-qualité représente entre 5 et 20 % du chiffre d'affaires des entreprises industrielles et de services — "
        "un coût largement sous-estimé parce qu'il reste invisible dans les tableaux de bord. "
        "Structurer une démarche qualité n'est pas une contrainte administrative : c'est un levier direct de performance et de différenciation."
    ),
    "innovation-technologies": (
        "En 2025, les entreprises ayant intégré l'IA dans leurs processus métier affichent un gain de productivité moyen de 22 % par rapport à leurs concurrentes (McKinsey, 2025). "
        "La transformation technologique n'est plus un projet IT à long terme — "
        "c'est une réalité opérationnelle qui redéfinit les modèles économiques chaque trimestre."
    ),
    "transformation-digitale": (
        "McKinsey estime que 70 % des programmes de transformation digitale échouent — non par manque de budget ou de technologies, "
        "mais par déficit de méthode, de vision partagée et d'adoption humaine. "
        "Comprendre pourquoi ces initiatives déraillent est la première étape pour en faire une réussite durable."
    ),
    "developpement-web": (
        "Le développement web évolue à un rythme qui rend obsolètes les bonnes pratiques d'hier en moins de deux ans. "
        "Ce qui compte aujourd'hui n'est pas de maîtriser toutes les technologies, "
        "mais de savoir lesquelles choisir — et pourquoi — pour construire des applications pérennes et maintenables."
    ),
    "gestion-projet": (
        "Selon le PMI Pulse of the Profession 2024, seulement 47 % des projets atteignent leurs objectifs dans les délais et budgets initiaux. "
        "La gestion de projet reste l'une des disciplines les plus sous-estimées de l'entreprise moderne : "
        "trop souvent réduite à de la planification, elle est en réalité un exercice permanent d'arbitrage et de décision."
    ),
    "gestion-talents": (
        "Attirer et fidéliser les bons profils est devenu l'un des défis majeurs des organisations : "
        "le coût de remplacement d'un salarié représente en moyenne 50 à 200 % de son salaire annuel. "
        "Pourtant, les leviers d'action sont connus — ils sont simplement sous-exploités."
    ),
    "marketing-communication": (
        "Le consommateur est exposé à plus de 10 000 messages publicitaires par jour. "
        "Dans ce bruit permanent, seules les marques qui communiquent avec précision, cohérence et sincérité parviennent à créer une vraie connexion. "
        "La question n'est plus de diffuser plus — mais de toucher juste."
    ),
    "service-client": (
        "Un client insatisfait en parle en moyenne à 11 personnes dans son entourage ; un client satisfait, à 3. "
        "L'excellence du service client n'est pas une question de budget — c'est une question de culture, de processus et de posture. "
        "Voici ce qui fait concrètement la différence entre un service acceptable et un service mémorable."
    ),
    "gestion-connaissances": (
        "Les entreprises perdent en moyenne 5,3 heures par semaine et par salarié à chercher des informations qui existent déjà en interne (IDC, 2024). "
        "Le capital de connaissances d'une organisation est son actif le plus sous-valorisé. "
        "Le structurer, c'est multiplier la valeur de chaque expertise individuelle."
    ),
    "outils-techniques": (
        "La maîtrise des bons outils peut réduire le temps passé sur des tâches répétitives de 30 à 60 % selon le contexte. "
        "Mais l'outillage n'est utile que s'il s'intègre dans un processus cohérent et maîtrisé par ceux qui l'utilisent. "
        "Voici une approche structurée pour en tirer le meilleur."
    ),
    "reconversion-carriere": (
        "En France, un actif sur cinq envisage une reconversion professionnelle — et la moitié de ceux qui franchissent le cap "
        "déclarent que c'est l'une des meilleures décisions de leur vie professionnelle. "
        "Réussir une reconversion ne relève pas du hasard : cela se prépare, se structure et s'anticipe."
    ),
    "developpement-commercial": (
        "Le marché B2B a profondément changé : 70 % du processus de décision d'achat est réalisé en autonomie avant tout contact commercial (Gartner, 2025). "
        "Les organisations commerciales qui performent sont celles qui ont su s'adapter à ces nouveaux comportements "
        "en proposant de la valeur avant de proposer un produit."
    ),
    "formation": (
        "Les entreprises qui investissent dans la formation continue affichent une productivité 24 % plus élevée "
        "et un taux de rétention 30 à 50 % supérieur à celles qui ne le font pas (LinkedIn Learning Report, 2025). "
        "Former n'est pas un coût — c'est le levier le plus rentable pour développer une organisation apprenante."
    ),
}

# ── Titres améliorés pour les articles vagues ──────────────────────────────
TITLE_FIXES = {
    "mermaid-example.md":                           "Diagrammes Mermaid : guide complet pour documenter vos architectures",
    "pillcolor-guide.md":                           "Systèmes de classification visuelle : choisir les bonnes couleurs",
    "visualisations-mermaid.md":                    "Visualiser données et processus avec Mermaid : exemples concrets",
    "gestion-temps.md":                             "Gérer son temps efficacement : méthodes éprouvées pour professionnels",
    "gestion-temps-productivite.md":                "Temps et productivité : reprendre le contrôle de son agenda",
    "gestion-temps-professionnels.md":              "Gestion du temps pour managers : sortir de l'urgence permanente",
    "gestion-stress-performance.md":                "Stress et performance : maintenir l'efficacité sous pression",
    "gestion-surcharge-informationnelle.md":        "Surcharge informationnelle : comment filtrer et reprendre le contrôle",
    "productivite-professionnelle.md":              "Productivité professionnelle : les habitudes qui changent vraiment tout",
    "methode-gtd-expliquee.md":                     "La méthode GTD expliquée : vider son esprit pour gagner en clarté",
    "methode-pomodoro.md":                          "La technique Pomodoro : travailler par cycles pour doubler sa concentration",
    "procrastination-solutions-efficaces.md":       "Procrastination : identifier les causes et appliquer les solutions",
    "comment-planifier-mon-travail.md":             "Planifier son travail : de l'intention à l'organisation concrète",
    "gestion-qualite-entreprise.md":                "Qualité en entreprise : construire une culture d'amélioration continue",
    "gestion-qualite-processus.md":                 "Optimisation des processus qualité : méthodes et outils opérationnels",
    "gestion-qualite-strategie.md":                 "Stratégie qualité : aligner exigence opérationnelle et objectifs business",
    "optimisation-processus-entreprise.md":         "Optimiser les processus d'entreprise : diagnostic, méthode et résultats",
    "qualite-processus-entreprise.md":              "Processus et qualité : les fondamentaux pour une organisation efficace",
    "gestion-qualite-amelioration.md":              "Amélioration continue : déployer un programme qualité qui dure",
    "gestion-qualite-certification.md":             "Certification qualité : ce que ça change vraiment pour une organisation",
    "intelligence-artificielle-transformation-marketing.md": "IA et marketing : les transformations concrètes à anticiper dès maintenant",
    "nouvelles-tendances-developpement-web.md":     "Tendances du développement web : ce qui compte vraiment en 2025",
    "transformation-digitale-telecom.md":           "Transformation digitale dans les télécoms : enjeux et leviers concrets",
    "transformation-numerique-entreprise.md":       "Transformation numérique : pourquoi 70 % échouent — et comment réussir",
    "transformation-numerique-talents.md":          "Numérique et talents : former ses équipes aux enjeux de la transformation",
    "technologies-javascript-2024.md":              "JavaScript en 2025 : les technologies et patterns qui dominent le marché",
    "web-tendances-2024.md":                        "Web en 2025 : les tendances qui redéfinissent l'expérience utilisateur",
    "management-hybride-defis-opportunites.md":     "Management hybride : dépasser les défis et saisir les opportunités",
    "management-diversite-inclusion.md":            "Diversité et inclusion : du discours aux pratiques managériales concrètes",
    "formation-leadership.md":                      "Formation au leadership : développer une posture de manager impactant",
    "service-client-performance.md":                "Excellence du service client : mesurer, piloter et progresser",
    "gestion-projet-agile.md":                      "Gestion de projet Agile : principes, pièges et bonnes pratiques",
    "gestion-projet-performance.md":                "Performance projet : les leviers pour tenir délais, budget et qualité",
    "gestion-projet-risques.md":                    "Gestion des risques projet : anticiper pour ne pas subir",
    "agile-scrum-methodologies.md":                 "Scrum et méthodes Agile : comment en tirer le meilleur en équipe",
    "gestion-performance-equipe.md":                "Performance d'équipe : piloter sans micro-manager",
    "gestion-performance-evaluation.md":            "Évaluation de la performance : outils et postures pour un dialogue utile",
    "gestion-talents-attraction.md":                "Attirer les talents : ce qui fait la différence dans un marché tendu",
    "gestion-talents-valuation.md":                 "Valoriser ses collaborateurs : reconnaissance, progression et engagement",
}

def make_generic_replacement(domain, title, desc):
    """Génère une intro spécifique basée sur le domaine + titre."""
    base = DOMAIN_INTROS.get(domain, "")
    if not base:
        # Fallback générique sans formule inclusive
        return (
            f"Le sujet de {title.lower()} est au cœur des enjeux actuels de performance organisationnelle. "
            f"Les pratiques qui font la différence ne sont pas complexes — elles sont méthodiques. "
            f"Cet article expose les fondements et les leviers d'action les plus efficaces."
        )
    return base

def fix_apres_avoir(intro_text, domain, title, desc):
    """Remplace une intro 'Après avoir X' par une formulation factuelle."""
    base = DOMAIN_INTROS.get(domain, "")
    if base:
        return base
    # Sinon: garder uniquement la conclusion de l'intro originale
    # (supprimer la phrase "Après avoir...")
    lines = intro_text.split('\n')
    cleaned = [l for l in lines if not l.strip().startswith("Après avoir")]
    result = '\n'.join(cleaned).strip()
    return result if result else make_generic_replacement(domain, title, desc)

def process_file(filepath):
    with open(filepath, 'r') as f:
        content = f.read()

    parts = content.split('---', 2)
    if len(parts) < 3:
        return False

    fm_raw = parts[1]
    body   = parts[2]

    domain   = os.path.basename(os.path.dirname(filepath))
    fname    = os.path.basename(filepath)
    title_m  = re.search(r'title:\s*["\'](.+?)["\']', fm_raw)
    title    = title_m.group(1) if title_m else fname
    desc_m   = re.search(r'description:\s*["\'](.+?)["\']', fm_raw)
    desc     = desc_m.group(1) if desc_m else ''

    changed = False

    # ── 1. Fix title ───────────────────────────────────────────────────────
    if fname in TITLE_FIXES:
        new_title = TITLE_FIXES[fname]
        fm_new = re.sub(
            r'(title:\s*["\'])(.+?)(["\'])',
            lambda m: m.group(1) + new_title + m.group(3),
            fm_raw
        )
        if fm_new != fm_raw:
            fm_raw = fm_new
            changed = True

    # ── 2. Fix intro ───────────────────────────────────────────────────────
    GENERIC_PATTERN = r'(## Introduction\s*\n+)(Ce sujet concerne tous les professionnels[^\n]+(?:\n[^\n#]+)*)'
    APRES_PATTERN   = r'(## Introduction\s*\n+)(Après avoir [^\n]+(?:\n[^\n#]+)*)'
    ACCESSIBLE_PATTERN = r'(## Introduction\s*\n+)(La formation professionnelle est un investissement accessible à tous[^\n]+(?:\n[^\n#]+)*)'

    def replace_intro(m):
        new_intro = make_generic_replacement(domain, title, desc)
        return m.group(1) + new_intro + '\n'

    def replace_apres(m):
        new_intro = fix_apres_avoir(m.group(2), domain, title, desc)
        return m.group(1) + new_intro + '\n'

    new_body = re.sub(GENERIC_PATTERN, replace_intro, body, count=1)
    new_body = re.sub(ACCESSIBLE_PATTERN, replace_intro, new_body, count=1)
    new_body = re.sub(APRES_PATTERN, replace_apres, new_body, count=1)

    if new_body != body:
        changed = True
        body = new_body

    if changed:
        with open(filepath, 'w') as f:
            f.write('---' + fm_raw + '---' + body)
        return True
    return False

# ── Run ────────────────────────────────────────────────────────────────────
fixed = 0
for root, dirs, files in os.walk(ARTICLES_DIR):
    for fname in sorted(files):
        if fname.endswith('.md'):
            path = os.path.join(root, fname)
            if process_file(path):
                fixed += 1
                print(f"Fixed: {os.path.basename(root)}/{fname}")

print(f"\nTotal fixed: {fixed}")
