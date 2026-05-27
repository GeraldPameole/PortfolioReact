# Skill: Claude Code — Assistances répétitives pour devs

## Objectif
Fournir un assistant réutilisable pour automatiser et accélérer les tâches de développement répétitives (tests, revue de code, documentation, debugging, refactoring, configuration). Ce SKILL est scoped au workspace et destiné aux développeurs travaillant dans ce dépôt.

## Entrées
- Code source (fichiers modifiés ou nouveau code)
- Historique Git (pour changelogs / context)
- Logs d'exécution / erreurs (pour debugging)
- Spécifications ou ticket (pour contexte fonctionnel)

## Résultat attendu
- Artefact produit automatiquement selon la tâche : tests, checklist de revue, docstrings/README, rapport d'erreurs, suggestions de refactor, fichiers de configuration.

## Processus étape-par-étape (générique)
1. Recevoir la tâche : type (tests, revue, doc, debug, refactor, config) + scope (fichier(s), module, PR).
2. Collecter le contexte : lire les fichiers concernés, extraire les signatures/fonctions, récupérer messages Git/PR et logs si fournis.
3. Générer une proposition initiale (tests, commentaires de revue, docstring, patch de refactor, Dockerfile, CI config).
4. Vérifier contre critères qualité (voir section Critères).
5. Retourner un patch (diff) ou un ensemble de fichiers et un court rapport expliquant les choix.
6. Si demandé, appliquer le patch ou créer une PR draft.

## Points de décision / logique de branchement
- Si la couverture de test existante est faible → prioriser génération de tests unitaires.
- Si erreurs runtime présentes dans les logs → générer diagnostic et tests reproduisant l'erreur.
- Si PR > 200 lignes → produire revue automatisée priorisant risques de sécurité/perf/complexité.
- Si changement touche config/CI → proposer tests d'intégration et checks CI.

## Critères de qualité / checklist
- Tests : assertions claires, mocks minimaux, temps d'exécution raisonnable.
- Revue : détecte antipatterns, risques de sécurité, erreurs d'API, et suggestions actionnables.
- Docs : docstrings conformes au style du projet et README succinct expliquant usage.
- Refactor : préserve comportement (pas de modification sémantique) et améliore lisibilité/complexité cyclomatique.
- Config : fichiers idempotents et portables (Dockerfile reproductible, CI déclarative).

## Tâches répétitives couvertes & gains estimés
| Tâche Répétitive | Comment Claude Code Peut Aider | Gain de Temps Estimé |
| --- | --- | --- |
| Écrire des tests | Générer des tests unitaires/intégration pour chaque nouvelle fonction. | 50-70% |
| Revue de code | Automatiser les revues de PR pour détecter les problèmes avant les revues humaines. | 30-50% |
| Documentation | Générer des docstrings, README, ou CHANGELOG à partir du code et de l’historique Git. | 60-80% |
| Debugging | Analyser les logs ou les erreurs pour identifier la cause racine. | 40-60% |
| Refactoring | Proposer des améliorations de code (lisibilité, performances). | 30-50% |
| Configuration | Générer des fichiers Dockerfile, .gitignore, ou CI/CD. | 70-90% |

## Exemples de prompts (à utiliser avec l'agent)
- "Génère des tests unitaires pour la fonction X dans file Y, en couvrant les cas limites".
- "Analyse cette PR et produis les commentaires de revue prioritaires (sécurité, perf, style)".
- "Produis un README minimal pour le module Z, incluant exemples d'usage".
- "Diagnostique l'erreur ci-jointe (stacktrace) et propose un test reproduisant le bug".
- "Propose un Dockerfile minimal pour ce service Node.js et une étape CI pour le build".

## Itérations et validation
1. Générer le premier brouillon automatique.
2. Demander confirmation au mainteneur pour appliquer ou affiner.
3. Si retours, itérer (max 3 passes automatiques) puis proposer PR draft.

## Suggestions de personnalisations futures
- Intégration automatique dans hooks Git (`pre-push` / `pre-commit`) pour exécuter checks rapides.
- Action GitHub / pipeline CI pour exécuter l'agent en mode PR-label-trigger.
- Templates spécifiques par langage (JS/TS, Python, Go) pour adapter style et frameworks de test.

## Notes techniques
- Prioriser patchs sous forme de diffs clairs (un fichier = un patch) pour faciliter revue humaine.
- Toujours inclure un court résumé (3-4 lignes) expliquant les changements et risques éventuels.

---
Créé automatiquement par l'assistant de dépôt — ajuster la portée (`workspace` vs `global`) si nécessaire.
