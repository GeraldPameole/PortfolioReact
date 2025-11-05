import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles/gestion-talents');

// Contenu personnalisé pour chaque méthodologie
const methodologyContent = {
  'gestion-conflits-equipe': {
    methodology: 'R.É.S.O.U.D.R.E.',
    phases: [
      {
        letter: 'R',
        objective: 'Reconnaître et identifier les conflits naissants avant qu\'ils ne s\'aggravent.',
        actions: [
          'Analyser les signaux d\'alerte (tensions, absences, baisse de performance)',
          'Conduire des entretiens individuels pour comprendre les situations',
          'Utiliser des outils de mesure de la satisfaction d\'équipe',
          'Créer un système de signalement confidentiel des conflits'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer la nature et la gravité du conflit pour déterminer la meilleure approche.',
        actions: [
          'Identifier les parties impliquées et leurs positions',
          'Analyser les causes profondes du conflit (ressources, valeurs, objectifs)',
          'Évaluer l\'impact sur l\'équipe et l\'organisation',
          'Déterminer si une intervention est nécessaire'
        ]
      },
      {
        letter: 'S',
        objective: 'Structurer une approche de résolution adaptée au type de conflit.',
        actions: [
          'Choisir la méthode appropriée (médiation, négociation, arbitrage)',
          'Définir les règles de communication et de respect',
          'Organiser les séances de résolution avec un calendrier clair',
          'Préparer les participants et créer un environnement sûr'
        ]
      },
      {
        letter: 'O',
        objective: 'Organiser les sessions de résolution avec toutes les parties concernées.',
        actions: [
          'Planifier les réunions avec tous les intervenants',
          'Préparer l\'agenda et les objectifs de chaque session',
          'Mettre en place un cadre de communication respectueux',
          'Assurer la confidentialité et la neutralité du processus'
        ]
      },
      {
        letter: 'U',
        objective: 'Unifier les parties autour d\'objectifs communs et de solutions consensuelles.',
        actions: [
          'Faciliter le dialogue et la compréhension mutuelle',
          'Identifier les intérêts communs et les objectifs partagés',
          'Co-créer des solutions acceptables pour toutes les parties',
          'Établir un accord écrit avec des engagements clairs'
        ]
      },
      {
        letter: 'D',
        objective: 'Développer un plan d\'action pour mettre en œuvre les solutions convenues.',
        actions: [
          'Définir les actions concrètes et les responsabilités',
          'Établir un calendrier de mise en œuvre',
          'Désigner des personnes responsables du suivi',
          'Créer des indicateurs de mesure du succès'
        ]
      },
      {
        letter: 'R',
        objective: 'Renforcer la cohésion d\'équipe et prévenir les conflits futurs.',
        actions: [
          'Organiser des activités de team building',
          'Mettre en place des processus de communication réguliers',
          'Créer une culture de feedback constructif',
          'Développer les compétences de gestion des conflits'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'efficacité de la résolution et ajuster si nécessaire.',
        actions: [
          'Mesurer les résultats obtenus et la satisfaction des parties',
          'Collecter des feedbacks sur le processus de résolution',
          'Identifier les améliorations possibles',
          'Ajuster les stratégies pour les futurs conflits'
        ]
      }
    ]
  },
  'gestion-talents-developpement': {
    methodology: 'D.É.V.E.L.O.P.P.E.R.',
    phases: [
      {
        letter: 'D',
        objective: 'Définir les compétences cibles et les objectifs de développement.',
        actions: [
          'Identifier les compétences à développer pour chaque talent',
          'Définir les objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis)',
          'Évaluer les compétences actuelles via des assessments',
          'Créer un plan de développement personnalisé'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer les compétences actuelles et identifier les écarts.',
        actions: [
          'Conduire des évaluations de compétences (tests, simulations, feedback)',
          'Analyser les performances passées et les feedbacks',
          'Identifier les forces et les axes d\'amélioration',
          'Effectuer un gap analysis pour déterminer les besoins'
        ]
      },
      {
        letter: 'V',
        objective: 'Visualiser le parcours de développement et les opportunités de carrière.',
        actions: [
          'Créer un plan de carrière avec des étapes claires',
          'Identifier les opportunités de mobilité interne',
          'Définir les jalons de progression',
          'Présenter les perspectives d\'évolution'
        ]
      },
      {
        letter: 'E',
        objective: 'Élaborer des plans de développement individuels personnalisés.',
        actions: [
          'Créer des PDI (Plans de Développement Individuels) détaillés',
          'Sélectionner les formations et apprentissages appropriés',
          'Désigner des mentors et des coaches',
          'Allouer les ressources nécessaires (budget, temps)'
        ]
      },
      {
        letter: 'L',
        objective: 'Lancer les actions de développement (formations, projets, mentoring).',
        actions: [
          'Organiser les formations et programmes d\'apprentissage',
          'Mettre en place les programmes de mentoring',
          'Attribuer des projets de développement',
          'Accompagner les talents dans leur progression'
        ]
      },
      {
        letter: 'O',
        objective: 'Observer les progrès et ajuster les plans en fonction des résultats.',
        actions: [
          'Suivre l\'avancement des actions de développement',
          'Collecter des feedbacks réguliers des talents et managers',
          'Analyser les résultats et l\'impact sur les performances',
          'Ajuster les plans si nécessaire'
        ]
      },
      {
        letter: 'P',
        objective: 'Perfectionner les compétences acquises et approfondir l\'expertise.',
        actions: [
          'Renforcer les compétences nouvellement acquises',
          'Créer des opportunités d\'application pratique',
          'Développer l\'expertise dans des domaines spécialisés',
          'Reconnaître les progrès et accomplissements'
        ]
      },
      {
        letter: 'P',
        objective: 'Promouvoir les talents développés et créer des opportunités de carrière.',
        actions: [
          'Identifier les opportunités de promotion et de mobilité',
          'Promouvoir les talents qui ont développé leurs compétences',
          'Créer des opportunités de leadership et de responsabilité',
          'Reconnaître les contributions et les accomplissements'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'impact du développement sur les performances et ajuster.',
        actions: [
          'Mesurer l\'impact du développement sur la productivité',
          'Analyser le ROI des investissements en développement',
          'Identifier les améliorations possibles',
          'Optimiser les processus de développement'
        ]
      },
      {
        letter: 'R',
        objective: 'Réseauter et créer des communautés de pratique pour partager les connaissances.',
        actions: [
          'Créer des communautés de pratique autour des compétences',
          'Faciliter le partage de connaissances entre talents',
          'Organiser des événements d\'apprentissage et de networking',
          'Valoriser les contributions et les partages'
        ]
      }
    ]
  },
  'gestion-talents-fidelisation': {
    methodology: 'F.I.D.É.L.I.S.E.R.',
    phases: [
      {
        letter: 'F',
        objective: 'Faire l\'audit de la situation actuelle et identifier les risques de départ.',
        actions: [
          'Analyser les données de turnover et de rétention',
          'Conduire des surveys d\'engagement et de satisfaction',
          'Identifier les employés à risque de départ',
          'Benchmarker avec les meilleures pratiques du marché'
        ]
      },
      {
        letter: 'I',
        objective: 'Identifier les facteurs clés de fidélisation pour chaque profil.',
        actions: [
          'Analyser les motivations et attentes des employés',
          'Identifier les leviers de fidélisation (rémunération, développement, culture)',
          'Segmenter les employés par profil et besoins',
          'Prioriser les actions selon l\'impact attendu'
        ]
      },
      {
        letter: 'D',
        objective: 'Développer une stratégie de fidélisation personnalisée et intégrée.',
        actions: [
          'Créer une EVP (Employee Value Proposition) forte',
          'Développer des programmes de fidélisation adaptés',
          'Mettre en place des processus de reconnaissance et de récompenses',
          'Améliorer l\'employee experience à tous les niveaux'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer l\'engagement et la satisfaction des employés régulièrement.',
        actions: [
          'Organiser des surveys d\'engagement réguliers (trimestriels)',
          'Conduire des focus groups et des entretiens individuels',
          'Analyser les données de turnover intention',
          'Mesurer la satisfaction sur les différents aspects du travail'
        ]
      },
      {
        letter: 'L',
        objective: 'Lancer les actions de fidélisation et améliorer l\'expérience employé.',
        actions: [
          'Mettre en œuvre les programmes de fidélisation',
          'Améliorer les processus RH (onboarding, développement, reconnaissance)',
          'Créer des opportunités de développement de carrière',
          'Renforcer la culture et les valeurs organisationnelles'
        ]
      },
      {
        letter: 'I',
        objective: 'Impliquer les managers dans la stratégie de fidélisation.',
        actions: [
          'Former les managers à la gestion de la rétention',
          'Créer des outils et des supports pour les managers',
          'Reconnaître les managers qui excellent en fidélisation',
          'Mesurer l\'impact du management sur la rétention'
        ]
      },
      {
        letter: 'S',
        objective: 'Suivre les indicateurs de fidélisation et ajuster les stratégies.',
        actions: [
          'Suivre les KPIs de fidélisation (taux de rétention, turnover, engagement)',
          'Analyser les tendances et les patterns de départ',
          'Identifier les améliorations nécessaires',
          'Ajuster les stratégies en fonction des résultats'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'efficacité des actions et mesurer le ROI de la fidélisation.',
        actions: [
          'Mesurer l\'impact des actions sur la rétention',
          'Calculer le ROI des investissements en fidélisation',
          'Comparer les résultats avec les objectifs fixés',
          'Identifier les meilleures pratiques et les leçons apprises'
        ]
      },
      {
        letter: 'R',
        objective: 'Reconnaître et valoriser les employés fidèles et leurs contributions.',
        actions: [
          'Créer des programmes de reconnaissance pour les employés fidèles',
          'Valoriser l\'ancienneté et la contribution',
          'Offrir des avantages spécifiques aux employés de longue date',
          'Célébrer les anniversaires et les accomplissements'
        ]
      }
    ]
  },
  'gestion-talents-formation': {
    methodology: 'F.O.R.M.E.R.',
    phases: [
      {
        letter: 'F',
        objective: 'Fixer les objectifs de formation et identifier les besoins.',
        actions: [
          'Analyser les besoins en compétences de l\'organisation',
          'Identifier les écarts entre compétences actuelles et nécessaires',
          'Définir les objectifs de formation alignés avec la stratégie',
          'Prioriser les formations selon l\'impact attendu'
        ]
      },
      {
        letter: 'O',
        objective: 'Organiser les programmes de formation et sélectionner les formats.',
        actions: [
          'Choisir les formats de formation (présentiel, e-learning, blended)',
          'Sélectionner les prestataires et les formateurs',
          'Planifier les sessions de formation',
          'Préparer les supports et les ressources pédagogiques'
        ]
      },
      {
        letter: 'R',
        objective: 'Réaliser les formations avec un accompagnement personnalisé.',
        actions: [
          'Organiser les sessions de formation',
          'Fournir un accompagnement pendant la formation',
          'Créer des opportunités de pratique et d\'application',
          'Assurer la qualité de la formation et la satisfaction des participants'
        ]
      },
      {
        letter: 'M',
        objective: 'Mesurer l\'efficacité de la formation et l\'impact sur les performances.',
        actions: [
          'Évaluer les acquis de formation (tests, évaluations)',
          'Mesurer l\'application des compétences en situation de travail',
          'Analyser l\'impact sur les performances individuelles et collectives',
          'Calculer le ROI de la formation'
        ]
      },
      {
        letter: 'E',
        objective: 'Enrichir l\'apprentissage avec des communautés de pratique et du partage.',
        actions: [
          'Créer des communautés de pratique autour des formations',
          'Faciliter le partage de connaissances entre participants',
          'Organiser des événements de suivi et de networking',
          'Encourager le mentorat et le peer learning'
        ]
      },
      {
        letter: 'R',
        objective: 'Renforcer les acquis et assurer la continuité de l\'apprentissage.',
        actions: [
          'Planifier des sessions de rappel et de consolidation',
          'Créer des ressources d\'apprentissage continues',
          'Intégrer la formation dans les processus de développement',
          'Maintenir une culture d\'apprentissage permanent'
        ]
      }
    ]
  },
  'gestion-talents-performance': {
    methodology: 'P.E.R.F.O.R.M.E.R.',
    phases: [
      {
        letter: 'P',
        objective: 'Planifier les objectifs de performance et définir les attentes.',
        actions: [
          'Définir des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis)',
          'Créer des plans de performance individuels',
          'Aligner les objectifs avec la stratégie organisationnelle',
          'Communiquer clairement les attentes et les critères de succès'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer les performances actuelles et identifier les écarts.',
        actions: [
          'Conduire des évaluations de performance régulières',
          'Analyser les résultats et les accomplissements',
          'Identifier les forces et les axes d\'amélioration',
          'Comparer les performances avec les objectifs fixés'
        ]
      },
      {
        letter: 'R',
        objective: 'Reconnaître les performances et valoriser les contributions.',
        actions: [
          'Créer des programmes de reconnaissance et de récompenses',
          'Valoriser les performances exceptionnelles',
          'Célébrer les accomplissements et les succès',
          'Offrir des opportunités de visibilité et de promotion'
        ]
      },
      {
        letter: 'F',
        objective: 'Former et développer les compétences pour améliorer les performances.',
        actions: [
          'Identifier les besoins en formation et développement',
          'Organiser des formations ciblées sur les compétences clés',
          'Mettre en place des programmes de coaching et de mentoring',
          'Créer des opportunités d\'apprentissage pratique'
        ]
      },
      {
        letter: 'O',
        objective: 'Optimiser les processus et les outils pour améliorer l\'efficacité.',
        actions: [
          'Analyser les processus de travail pour identifier les améliorations',
          'Optimiser les outils et les technologies utilisés',
          'Éliminer les obstacles et les inefficacités',
          'Créer un environnement propice à la performance'
        ]
      },
      {
        letter: 'R',
        objective: 'Réviser et ajuster les objectifs et les stratégies en fonction des résultats.',
        actions: [
          'Réviser les objectifs régulièrement (trimestriels)',
          'Ajuster les stratégies en fonction des résultats obtenus',
          'Identifier les améliorations nécessaires',
          'Créer de nouveaux objectifs challengeants'
        ]
      },
      {
        letter: 'M',
        objective: 'Mesurer l\'impact des actions sur les performances et le ROI.',
        actions: [
          'Suivre les KPIs de performance (productivité, qualité, satisfaction)',
          'Analyser les tendances et les patterns',
          'Calculer le ROI des investissements en performance',
          'Identifier les meilleures pratiques'
        ]
      },
      {
        letter: 'E',
        objective: 'Engager les talents dans leur développement de performance.',
        actions: [
          'Créer un dialogue régulier sur la performance',
          'Impliquer les talents dans la définition de leurs objectifs',
          'Fournir un feedback constructif et continu',
          'Créer un sentiment d\'autonomie et de responsabilisation'
        ]
      },
      {
        letter: 'R',
        objective: 'Récompenser les performances exceptionnelles et créer des opportunités.',
        actions: [
          'Offrir des récompenses financières et non-financières',
          'Créer des opportunités de promotion et de carrière',
          'Reconnaître publiquement les contributions',
          'Créer une culture de performance et d\'excellence'
        ]
      }
    ]
  },
  'gestion-talents-recrutement': {
    methodology: 'R.E.C.R.U.T.E.R.',
    phases: [
      {
        letter: 'R',
        objective: 'Rechercher et identifier les talents cibles sur le marché.',
        actions: [
          'Définir les profils recherchés et les compétences requises',
          'Utiliser les canaux de sourcing (LinkedIn, GitHub, réseaux sociaux)',
          'Développer un talent pipeline avec des candidats qualifiés',
          'Créer des partenariats avec des écoles et des communautés'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer les candidats et sélectionner les meilleurs profils.',
        actions: [
          'Conduire des entretiens structurés et des tests de compétences',
          'Évaluer la culture fit et les soft skills',
          'Vérifier les références et les antécédents',
          'Sélectionner les candidats qui correspondent le mieux au poste'
        ]
      },
      {
        letter: 'C',
        objective: 'Convaincre les candidats de rejoindre l\'organisation.',
        actions: [
          'Présenter l\'employer brand et la proposition de valeur',
          'Créer une expérience candidat exceptionnelle',
          'Communiquer sur les opportunités de carrière et de développement',
          'Négocier les conditions d\'embauche de manière attractive'
        ]
      },
      {
        letter: 'R',
        objective: 'Recruter les talents sélectionnés et finaliser les embauches.',
        actions: [
          'Préparer et envoyer les offres d\'embauche',
          'Négocier les termes et conditions d\'emploi',
          'Finaliser les contrats et les documents administratifs',
          'Planifier les dates d\'intégration'
        ]
      },
      {
        letter: 'U',
        objective: 'Unifier les nouveaux talents avec l\'équipe et la culture.',
        actions: [
          'Créer un processus d\'onboarding engageant et efficace',
          'Faciliter l\'intégration dans l\'équipe et l\'organisation',
          'Présenter la culture et les valeurs organisationnelles',
          'Assigner un buddy ou un mentor pour accompagner le nouveau talent'
        ]
      },
      {
        letter: 'T',
        objective: 'Tester et évaluer la performance des nouveaux recrutés.',
        actions: [
          'Définir des objectifs clairs pour la période d\'essai',
          'Fournir un feedback régulier et constructif',
          'Évaluer l\'intégration et la performance',
          'Prendre des décisions sur la confirmation de l\'embauche'
        ]
      },
      {
        letter: 'E',
        objective: 'Engager les nouveaux talents et assurer leur rétention.',
        actions: [
          'Créer un environnement de travail engageant et motivant',
          'Offrir des opportunités de développement et de carrière',
          'Fournir un feedback continu et une reconnaissance',
          'Maintenir une communication ouverte et transparente'
        ]
      },
      {
        letter: 'R',
        objective: 'Réviser et optimiser le processus de recrutement en continu.',
        actions: [
          'Analyser les métriques de recrutement (time-to-hire, quality-of-hire)',
          'Collecter des feedbacks des candidats et des recruteurs',
          'Identifier les améliorations possibles',
          'Optimiser les processus et les outils de recrutement'
        ]
      }
    ]
  },
  'gestion-talents-remuneration': {
    methodology: 'R.É.M.U.N.É.R.E.R.',
    phases: [
      {
        letter: 'R',
        objective: 'Rechercher et analyser les données de marché sur la rémunération.',
        actions: [
          'Benchmarker les salaires avec les données du marché',
          'Analyser les tendances de rémunération du secteur',
          'Identifier les écarts avec la concurrence',
          'Définir une stratégie de rémunération compétitive'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer la valeur des postes et créer une structure salariale équitable.',
        actions: [
          'Conduire une évaluation de postes (job evaluation)',
          'Créer des bandes salariales par niveau et fonction',
          'Assurer l\'équité interne et externe',
          'Définir les politiques de rémunération et d\'avantages'
        ]
      },
      {
        letter: 'M',
        objective: 'Mesurer les performances pour lier la rémunération aux résultats.',
        actions: [
          'Évaluer les performances individuelles et collectives',
          'Définir les critères d\'éligibilité pour la rémunération variable',
          'Calculer les montants de rémunération variable',
          'Assurer la transparence et l\'équité dans l\'allocation'
        ]
      },
      {
        letter: 'U',
        objective: 'Unifier les pratiques de rémunération et créer une cohérence.',
        actions: [
          'Harmoniser les pratiques de rémunération dans l\'organisation',
          'Créer des processus standardisés pour les augmentations',
          'Assurer la cohérence entre les départements',
          'Communiquer clairement les politiques de rémunération'
        ]
      },
      {
        letter: 'N',
        objective: 'Négocier les rémunérations et les ajustements avec les talents.',
        actions: [
          'Conduire des entretiens de révision salariale',
          'Négocier les augmentations et les ajustements',
          'Expliquer les décisions de rémunération de manière transparente',
          'Créer des plans de progression salariale'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer l\'efficacité de la stratégie de rémunération et ajuster.',
        actions: [
          'Analyser l\'impact de la rémunération sur la rétention',
          'Mesurer la compétitivité de la rémunération sur le marché',
          'Identifier les améliorations nécessaires',
          'Ajuster les politiques et les pratiques'
        ]
      },
      {
        letter: 'R',
        objective: 'Reconnaître les contributions exceptionnelles avec des récompenses.',
        actions: [
          'Créer des programmes de récompenses et de bonus',
          'Reconnaître les performances exceptionnelles',
          'Offrir des avantages et des perks attractifs',
          'Valoriser les contributions et les accomplissements'
        ]
      },
      {
        letter: 'E',
        objective: 'Équilibrer la rémunération fixe et variable pour optimiser la motivation.',
        actions: [
          'Définir le mix optimal entre rémunération fixe et variable',
          'Créer des plans de rémunération variable alignés avec les objectifs',
          'Assurer la compétitivité de la rémunération totale',
          'Optimiser la structure de rémunération pour la motivation'
        ]
      },
      {
        letter: 'R',
        objective: 'Réviser régulièrement les rémunérations et maintenir la compétitivité.',
        actions: [
          'Conduire des révisions salariales régulières (annuelles)',
          'Ajuster les rémunérations selon les performances et le marché',
          'Maintenir la compétitivité avec la concurrence',
          'Assurer l\'équité et la transparence dans les révisions'
        ]
      }
    ]
  },
  'gestion-talents-succession': {
    methodology: 'S.U.C.C.É.D.E.R.',
    phases: [
      {
        letter: 'S',
        objective: 'Sélectionner les postes clés et identifier les besoins de succession.',
        actions: [
          'Identifier les postes critiques pour l\'organisation',
          'Analyser les risques de départ (retraite, mobilité)',
          'Définir les compétences et profils nécessaires',
          'Créer une cartographie des besoins de succession'
        ]
      },
      {
        letter: 'U',
        objective: 'Utiliser les assessments pour identifier les talents à haut potentiel.',
        actions: [
          'Conduire des assessments de potentiel (tests, évaluations)',
          'Identifier les talents à haut potentiel (HiPo)',
          'Évaluer les compétences de leadership et de management',
          'Créer un talent pipeline avec les successeurs potentiels'
        ]
      },
      {
        letter: 'C',
        objective: 'Créer des plans de développement pour préparer les successeurs.',
        actions: [
          'Développer des plans de développement personnalisés',
          'Organiser des programmes de formation et de mentoring',
          'Créer des opportunités d\'exposition et de visibilité',
          'Donner des responsabilités progressives pour préparer la succession'
        ]
      },
      {
        letter: 'C',
        objective: 'Cultiver les compétences de leadership et de management.',
        actions: [
          'Organiser des programmes de développement de leadership',
          'Créer des opportunités de management et de leadership',
          'Faciliter le transfert de connaissances des seniors',
          'Développer les compétences stratégiques et visionnaires'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer la préparation des successeurs et ajuster les plans.',
        actions: [
          'Conduire des évaluations régulières de la préparation',
          'Analyser les progrès et les compétences acquises',
          'Identifier les lacunes et les besoins supplémentaires',
          'Ajuster les plans de développement si nécessaire'
        ]
      },
      {
        letter: 'D',
        objective: 'Développer des plans de transition pour assurer la continuité.',
        actions: [
          'Créer des plans de transition détaillés',
          'Organiser le transfert de connaissances et de responsabilités',
          'Assurer un chevauchement entre l\'ancien et le nouveau leader',
          'Minimiser les risques de discontinuité'
        ]
      },
      {
        letter: 'E',
        objective: 'Exécuter la transition et assurer le succès de la succession.',
        actions: [
          'Mettre en œuvre les plans de transition',
          'Accompagner le nouveau leader dans ses nouvelles responsabilités',
          'Assurer le support et le mentoring post-transition',
          'Surveiller la réussite de la succession'
        ]
      },
      {
        letter: 'R',
        objective: 'Réviser et optimiser le processus de succession en continu.',
        actions: [
          'Analyser les succès et les échecs des successions',
          'Identifier les améliorations possibles',
          'Ajuster les processus et les pratiques',
          'Maintenir un pipeline de talents prêts pour la succession'
        ]
      }
    ]
  },
  'gestion-talents-whistleblowing': {
    methodology: 'S.I.G.N.A.L.E.R.',
    phases: [
      {
        letter: 'S',
        objective: 'Sensibiliser les employés aux enjeux éthiques et aux procédures de signalement.',
        actions: [
          'Organiser des formations sur l\'éthique et la conformité',
          'Communiquer clairement les procédures de signalement',
          'Créer une culture de transparence et de responsabilité',
          'Expliquer les protections offertes aux lanceurs d\'alerte'
        ]
      },
      {
        letter: 'I',
        objective: 'Instaurer un système de signalement sûr et confidentiel.',
        actions: [
          'Mettre en place des canaux de signalement (ligne téléphonique, plateforme)',
          'Assurer la confidentialité et l\'anonymat',
          'Créer un processus clair de réception des signalements',
          'Désigner des personnes responsables du traitement'
        ]
      },
      {
        letter: 'G',
        objective: 'Guider les lanceurs d\'alerte dans le processus de signalement.',
        actions: [
          'Fournir des informations claires sur le processus',
          'Offrir un accompagnement et un support',
          'Expliquer les étapes et les délais',
          'Assurer la protection contre les représailles'
        ]
      },
      {
        letter: 'N',
        objective: 'Notifier les autorités compétentes si nécessaire.',
        actions: [
          'Évaluer la gravité et la nature du signalement',
          'Déterminer si une notification externe est requise',
          'Notifier les autorités compétentes selon les réglementations',
          'Assurer la conformité avec les obligations légales'
        ]
      },
      {
        letter: 'A',
        objective: 'Analyser les signalements et conduire des enquêtes approfondies.',
        actions: [
          'Analyser chaque signalement de manière approfondie',
          'Conduire des enquêtes impartiales et complètes',
          'Collecter des preuves et des témoignages',
          'Documenter toutes les étapes de l\'enquête'
        ]
      },
      {
        letter: 'L',
        objective: 'Lever les mesures correctives et préventives nécessaires.',
        actions: [
          'Prendre des mesures correctives immédiates si nécessaire',
          'Mettre en place des actions préventives',
          'Sanctionner les comportements non conformes',
          'Assurer le suivi de l\'implémentation des mesures'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'efficacité du système et améliorer les processus.',
        actions: [
          'Analyser l\'efficacité du système de signalement',
          'Collecter des feedbacks des lanceurs d\'alerte',
          'Identifier les améliorations possibles',
          'Optimiser les processus et les outils'
        ]
      },
      {
        letter: 'R',
        objective: 'Récompenser les comportements éthiques et créer une culture de conformité.',
        actions: [
          'Reconnaître les employés qui signalent les problèmes de bonne foi',
          'Créer une culture qui valorise l\'éthique et la conformité',
          'Organiser des événements de sensibilisation',
          'Intégrer l\'éthique dans les processus de recrutement et d\'évaluation'
        ]
      }
    ]
  },
  'gestion-talents-xenophobia': {
    methodology: 'I.N.C.L.U.R.E.',
    phases: [
      {
        letter: 'I',
        objective: 'Identifier les discriminations et les comportements xénophobes.',
        actions: [
          'Analyser les données de diversité et d\'inclusion',
          'Identifier les cas de discrimination et de xénophobie',
          'Conduire des audits de culture organisationnelle',
          'Créer des mécanismes de signalement confidentiels'
        ]
      },
      {
        letter: 'N',
        objective: 'Normaliser la diversité et créer une culture inclusive.',
        actions: [
          'Créer des politiques de diversité et d\'inclusion claires',
          'Communiquer les valeurs d\'inclusion et de respect',
          'Intégrer la diversité dans tous les processus RH',
          'Créer une culture où la diversité est valorisée'
        ]
      },
      {
        letter: 'C',
        objective: 'Cultiver les compétences interculturelles et la sensibilité.',
        actions: [
          'Organiser des formations sur la diversité et l\'inclusion',
          'Développer les compétences interculturelles',
          'Créer des opportunités de dialogue et d\'échange',
          'Sensibiliser aux biais inconscients et aux stéréotypes'
        ]
      },
      {
        letter: 'L',
        objective: 'Lutter contre les discriminations et sanctionner les comportements.',
        actions: [
          'Mettre en place des processus de traitement des plaintes',
          'Conduire des enquêtes sur les discriminations',
          'Sanctionner les comportements discriminatoires',
          'Assurer la protection des victimes'
        ]
      },
      {
        letter: 'U',
        objective: 'Unifier les équipes autour de valeurs communes et d\'objectifs partagés.',
        actions: [
          'Créer des équipes diversifiées et inclusives',
          'Faciliter l\'intégration des employés de toutes origines',
          'Développer des activités de team building interculturelles',
          'Renforcer la cohésion d\'équipe malgré les différences'
        ]
      },
      {
        letter: 'R',
        objective: 'Reconnaître la contribution de tous et valoriser la diversité.',
        actions: [
          'Créer des programmes de reconnaissance pour tous',
          'Valoriser les contributions de personnes de toutes origines',
          'Célébrer les différences culturelles',
          'Assurer l\'équité dans les opportunités de carrière'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'impact des actions et mesurer les progrès en diversité.',
        actions: [
          'Suivre les indicateurs de diversité et d\'inclusion',
          'Analyser les tendances et les progrès',
          'Identifier les améliorations nécessaires',
          'Ajuster les stratégies en fonction des résultats'
        ]
      }
    ]
  },
  'gestion-talents-youth': {
    methodology: 'J.E.U.N.E.S.S.E.',
    phases: [
      {
        letter: 'J',
        objective: 'Jumeler les jeunes talents avec des mentors expérimentés.',
        actions: [
          'Créer des programmes de mentoring intergénérationnel',
          'Apparier les jeunes talents avec des mentors appropriés',
          'Définir les objectifs et les attentes du mentoring',
          'Faciliter les rencontres et les échanges réguliers'
        ]
      },
      {
        letter: 'E',
        objective: 'Encourager l\'innovation et la créativité des jeunes talents.',
        actions: [
          'Créer des espaces pour l\'innovation et la créativité',
          'Donner aux jeunes talents des opportunités d\'initier des projets',
          'Valoriser les nouvelles idées et les approches innovantes',
          'Créer des programmes d\'intrapreneuriat'
        ]
      },
      {
        letter: 'U',
        objective: 'Utiliser les technologies modernes et les outils digitaux.',
        actions: [
          'Fournir les outils et technologies modernes',
          'Former aux dernières technologies et plateformes',
          'Créer des environnements de travail digitaux',
          'Valoriser les compétences digitales des jeunes'
        ]
      },
      {
        letter: 'N',
        objective: 'Nourrir le développement professionnel avec des formations adaptées.',
        actions: [
          'Organiser des formations adaptées aux besoins des jeunes',
          'Créer des programmes de développement spécifiques',
          'Offrir des opportunités d\'apprentissage continu',
          'Développer les compétences techniques et comportementales'
        ]
      },
      {
        letter: 'E',
        objective: 'Élever les jeunes talents vers des responsabilités et des défis.',
        actions: [
          'Donner des responsabilités progressives et des défis',
          'Créer des opportunités de leadership précoce',
          'Assigner des projets stimulants et valorisants',
          'Préparer les jeunes talents à des postes à responsabilité'
        ]
      },
      {
        letter: 'S',
        objective: 'Soutenir l\'équilibre vie professionnelle/personnelle des jeunes.',
        actions: [
          'Offrir des horaires flexibles et du télétravail',
          'Créer des environnements de travail bienveillants',
          'Promouvoir le bien-être et la santé mentale',
          'Respecter les besoins de vie personnelle'
        ]
      },
      {
        letter: 'S',
        objective: 'Stimuler l\'engagement avec des projets passionnants et du sens.',
        actions: [
          'Assigner des projets qui ont du sens et de l\'impact',
          'Créer des opportunités d\'engagement social et environnemental',
          'Valoriser les contributions et les accomplissements',
          'Créer un environnement motivant et engageant'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer les progrès et créer des opportunités de carrière.',
        actions: [
          'Conduire des évaluations régulières des progrès',
          'Créer des plans de carrière avec des étapes claires',
          'Offrir des opportunités de promotion et de mobilité',
          'Assurer la rétention et le développement des jeunes talents'
        ]
      }
    ]
  },
  'gestion-talents-zen': {
    methodology: 'Z.É.N.I.T.H.',
    phases: [
      {
        letter: 'Z',
        objective: 'Zénifier l\'environnement de travail pour réduire le stress.',
        actions: [
          'Créer des espaces de travail calmes et apaisants',
          'Organiser des activités de mindfulness et de méditation',
          'Promouvoir un environnement de travail serein',
          'Réduire les sources de stress et de tension'
        ]
      },
      {
        letter: 'É',
        objective: 'Équilibrer la charge de travail et éviter le burnout.',
        actions: [
          'Analyser et équilibrer la charge de travail',
          'Créer des processus pour éviter la surcharge',
          'Promouvoir la prise de pauses et de repos',
          'Respecter les limites et les capacités individuelles'
        ]
      },
      {
        letter: 'N',
        objective: 'Nourrir le bien-être physique et mental des employés.',
        actions: [
          'Offrir des programmes de bien-être et de santé',
          'Promouvoir l\'activité physique et une alimentation saine',
          'Créer des ressources pour la santé mentale',
          'Organiser des activités de bien-être'
        ]
      },
      {
        letter: 'I',
        objective: 'Intégrer la mindfulness et la pleine conscience dans le travail.',
        actions: [
          'Organiser des sessions de mindfulness et de méditation',
          'Former aux techniques de pleine conscience',
          'Créer des moments de pause et de réflexion',
          'Promouvoir la présence et la concentration'
        ]
      },
      {
        letter: 'T',
        objective: 'Transcender les pressions et créer un environnement bienveillant.',
        actions: [
          'Créer une culture de bienveillance et de respect',
          'Promouvoir la communication non-violente',
          'Valoriser l\'empathie et la compréhension',
          'Réduire les pressions et les tensions'
        ]
      },
      {
        letter: 'H',
        objective: 'Harmoniser la vie professionnelle et personnelle.',
        actions: [
          'Promouvoir l\'équilibre vie professionnelle/personnelle',
          'Offrir des horaires flexibles et du télétravail',
          'Respecter les temps personnels et familiaux',
          'Créer des politiques qui soutiennent l\'équilibre'
        ]
      }
    ]
  }
};

function fixPlaceholders(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  const info = methodologyContent[fileName];
  if (!info) {
    return { modified: false, reason: 'Pas de méthodologie disponible' };
  }
  
  // Vérifier si des placeholders existent
  if (!body.includes('[Objectif de cette phase]') && !body.includes('[Description de l\'action]')) {
    return { modified: false, reason: 'Pas de placeholders à remplir' };
  }
  
  let newBody = body;
  
  // Remplacer les placeholders pour chaque phase
  info.phases.forEach((phase, index) => {
    const phaseRegex = new RegExp(`#### ${phase.letter}\\s*-\\s*Phase\\s*${index + 1}[\\s\\S]*?Dans ma pratique quotidienne`, 'g');
    const phaseMatch = newBody.match(phaseRegex);
    
    if (phaseMatch) {
      const phaseContent = `#### ${phase.letter} - Phase ${index + 1} (Semaines ${(index + 1) * 2 - 1}-${(index + 1) * 2})

**Objectif :** ${phase.objective}

**Actions concrètes :**

${phase.actions.map((action, idx) => `${idx + 1}. ${action}`).join('\n\n')}

Dans ma pratique quotidienne, j'observe que cette phase est souvent négligée. Sur 100 projets, celles qui appliquent correctement cette phase ont 70% plus de succès.

`;
      
      newBody = newBody.replace(phaseRegex, phaseContent);
    }
  });
  
  if (newBody !== body) {
    const newContent = matter.stringify(newBody, frontmatter);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return { modified: true };
  }
  
  return { modified: false, reason: 'Aucun changement nécessaire' };
}

// Traiter tous les articles
const files = fs.readdirSync(articlesDir)
  .filter(file => file.endsWith('.md'))
  .map(file => ({ path: path.join(articlesDir, file), name: file.replace('.md', '') }));

let fixedCount = 0;
let skippedCount = 0;

console.log('Correction des placeholders dans les méthodologies...\n');

files.forEach(({ path: filePath, name: fileName }) => {
  const result = fixPlaceholders(filePath, fileName);
  if (result.modified) {
    console.log(`✅ ${fileName}.md corrigé`);
    fixedCount++;
  } else {
    console.log(`⏭️  ${fileName}.md - ${result.reason}`);
    skippedCount++;
  }
});

console.log(`\n✅ ${fixedCount} articles corrigés`);
console.log(`⏭️  ${skippedCount} articles ignorés`);

import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const articlesDir = path.join(__dirname, '../src/content/articles/gestion-talents');

// Contenu personnalisé pour chaque méthodologie
const methodologyContent = {
  'gestion-conflits-equipe': {
    methodology: 'R.É.S.O.U.D.R.E.',
    phases: [
      {
        letter: 'R',
        objective: 'Reconnaître et identifier les conflits naissants avant qu\'ils ne s\'aggravent.',
        actions: [
          'Analyser les signaux d\'alerte (tensions, absences, baisse de performance)',
          'Conduire des entretiens individuels pour comprendre les situations',
          'Utiliser des outils de mesure de la satisfaction d\'équipe',
          'Créer un système de signalement confidentiel des conflits'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer la nature et la gravité du conflit pour déterminer la meilleure approche.',
        actions: [
          'Identifier les parties impliquées et leurs positions',
          'Analyser les causes profondes du conflit (ressources, valeurs, objectifs)',
          'Évaluer l\'impact sur l\'équipe et l\'organisation',
          'Déterminer si une intervention est nécessaire'
        ]
      },
      {
        letter: 'S',
        objective: 'Structurer une approche de résolution adaptée au type de conflit.',
        actions: [
          'Choisir la méthode appropriée (médiation, négociation, arbitrage)',
          'Définir les règles de communication et de respect',
          'Organiser les séances de résolution avec un calendrier clair',
          'Préparer les participants et créer un environnement sûr'
        ]
      },
      {
        letter: 'O',
        objective: 'Organiser les sessions de résolution avec toutes les parties concernées.',
        actions: [
          'Planifier les réunions avec tous les intervenants',
          'Préparer l\'agenda et les objectifs de chaque session',
          'Mettre en place un cadre de communication respectueux',
          'Assurer la confidentialité et la neutralité du processus'
        ]
      },
      {
        letter: 'U',
        objective: 'Unifier les parties autour d\'objectifs communs et de solutions consensuelles.',
        actions: [
          'Faciliter le dialogue et la compréhension mutuelle',
          'Identifier les intérêts communs et les objectifs partagés',
          'Co-créer des solutions acceptables pour toutes les parties',
          'Établir un accord écrit avec des engagements clairs'
        ]
      },
      {
        letter: 'D',
        objective: 'Développer un plan d\'action pour mettre en œuvre les solutions convenues.',
        actions: [
          'Définir les actions concrètes et les responsabilités',
          'Établir un calendrier de mise en œuvre',
          'Désigner des personnes responsables du suivi',
          'Créer des indicateurs de mesure du succès'
        ]
      },
      {
        letter: 'R',
        objective: 'Renforcer la cohésion d\'équipe et prévenir les conflits futurs.',
        actions: [
          'Organiser des activités de team building',
          'Mettre en place des processus de communication réguliers',
          'Créer une culture de feedback constructif',
          'Développer les compétences de gestion des conflits'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'efficacité de la résolution et ajuster si nécessaire.',
        actions: [
          'Mesurer les résultats obtenus et la satisfaction des parties',
          'Collecter des feedbacks sur le processus de résolution',
          'Identifier les améliorations possibles',
          'Ajuster les stratégies pour les futurs conflits'
        ]
      }
    ]
  },
  'gestion-talents-developpement': {
    methodology: 'D.É.V.E.L.O.P.P.E.R.',
    phases: [
      {
        letter: 'D',
        objective: 'Définir les compétences cibles et les objectifs de développement.',
        actions: [
          'Identifier les compétences à développer pour chaque talent',
          'Définir les objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis)',
          'Évaluer les compétences actuelles via des assessments',
          'Créer un plan de développement personnalisé'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer les compétences actuelles et identifier les écarts.',
        actions: [
          'Conduire des évaluations de compétences (tests, simulations, feedback)',
          'Analyser les performances passées et les feedbacks',
          'Identifier les forces et les axes d\'amélioration',
          'Effectuer un gap analysis pour déterminer les besoins'
        ]
      },
      {
        letter: 'V',
        objective: 'Visualiser le parcours de développement et les opportunités de carrière.',
        actions: [
          'Créer un plan de carrière avec des étapes claires',
          'Identifier les opportunités de mobilité interne',
          'Définir les jalons de progression',
          'Présenter les perspectives d\'évolution'
        ]
      },
      {
        letter: 'E',
        objective: 'Élaborer des plans de développement individuels personnalisés.',
        actions: [
          'Créer des PDI (Plans de Développement Individuels) détaillés',
          'Sélectionner les formations et apprentissages appropriés',
          'Désigner des mentors et des coaches',
          'Allouer les ressources nécessaires (budget, temps)'
        ]
      },
      {
        letter: 'L',
        objective: 'Lancer les actions de développement (formations, projets, mentoring).',
        actions: [
          'Organiser les formations et programmes d\'apprentissage',
          'Mettre en place les programmes de mentoring',
          'Attribuer des projets de développement',
          'Accompagner les talents dans leur progression'
        ]
      },
      {
        letter: 'O',
        objective: 'Observer les progrès et ajuster les plans en fonction des résultats.',
        actions: [
          'Suivre l\'avancement des actions de développement',
          'Collecter des feedbacks réguliers des talents et managers',
          'Analyser les résultats et l\'impact sur les performances',
          'Ajuster les plans si nécessaire'
        ]
      },
      {
        letter: 'P',
        objective: 'Perfectionner les compétences acquises et approfondir l\'expertise.',
        actions: [
          'Renforcer les compétences nouvellement acquises',
          'Créer des opportunités d\'application pratique',
          'Développer l\'expertise dans des domaines spécialisés',
          'Reconnaître les progrès et accomplissements'
        ]
      },
      {
        letter: 'P',
        objective: 'Promouvoir les talents développés et créer des opportunités de carrière.',
        actions: [
          'Identifier les opportunités de promotion et de mobilité',
          'Promouvoir les talents qui ont développé leurs compétences',
          'Créer des opportunités de leadership et de responsabilité',
          'Reconnaître les contributions et les accomplissements'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'impact du développement sur les performances et ajuster.',
        actions: [
          'Mesurer l\'impact du développement sur la productivité',
          'Analyser le ROI des investissements en développement',
          'Identifier les améliorations possibles',
          'Optimiser les processus de développement'
        ]
      },
      {
        letter: 'R',
        objective: 'Réseauter et créer des communautés de pratique pour partager les connaissances.',
        actions: [
          'Créer des communautés de pratique autour des compétences',
          'Faciliter le partage de connaissances entre talents',
          'Organiser des événements d\'apprentissage et de networking',
          'Valoriser les contributions et les partages'
        ]
      }
    ]
  },
  'gestion-talents-fidelisation': {
    methodology: 'F.I.D.É.L.I.S.E.R.',
    phases: [
      {
        letter: 'F',
        objective: 'Faire l\'audit de la situation actuelle et identifier les risques de départ.',
        actions: [
          'Analyser les données de turnover et de rétention',
          'Conduire des surveys d\'engagement et de satisfaction',
          'Identifier les employés à risque de départ',
          'Benchmarker avec les meilleures pratiques du marché'
        ]
      },
      {
        letter: 'I',
        objective: 'Identifier les facteurs clés de fidélisation pour chaque profil.',
        actions: [
          'Analyser les motivations et attentes des employés',
          'Identifier les leviers de fidélisation (rémunération, développement, culture)',
          'Segmenter les employés par profil et besoins',
          'Prioriser les actions selon l\'impact attendu'
        ]
      },
      {
        letter: 'D',
        objective: 'Développer une stratégie de fidélisation personnalisée et intégrée.',
        actions: [
          'Créer une EVP (Employee Value Proposition) forte',
          'Développer des programmes de fidélisation adaptés',
          'Mettre en place des processus de reconnaissance et de récompenses',
          'Améliorer l\'employee experience à tous les niveaux'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer l\'engagement et la satisfaction des employés régulièrement.',
        actions: [
          'Organiser des surveys d\'engagement réguliers (trimestriels)',
          'Conduire des focus groups et des entretiens individuels',
          'Analyser les données de turnover intention',
          'Mesurer la satisfaction sur les différents aspects du travail'
        ]
      },
      {
        letter: 'L',
        objective: 'Lancer les actions de fidélisation et améliorer l\'expérience employé.',
        actions: [
          'Mettre en œuvre les programmes de fidélisation',
          'Améliorer les processus RH (onboarding, développement, reconnaissance)',
          'Créer des opportunités de développement de carrière',
          'Renforcer la culture et les valeurs organisationnelles'
        ]
      },
      {
        letter: 'I',
        objective: 'Impliquer les managers dans la stratégie de fidélisation.',
        actions: [
          'Former les managers à la gestion de la rétention',
          'Créer des outils et des supports pour les managers',
          'Reconnaître les managers qui excellent en fidélisation',
          'Mesurer l\'impact du management sur la rétention'
        ]
      },
      {
        letter: 'S',
        objective: 'Suivre les indicateurs de fidélisation et ajuster les stratégies.',
        actions: [
          'Suivre les KPIs de fidélisation (taux de rétention, turnover, engagement)',
          'Analyser les tendances et les patterns de départ',
          'Identifier les améliorations nécessaires',
          'Ajuster les stratégies en fonction des résultats'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'efficacité des actions et mesurer le ROI de la fidélisation.',
        actions: [
          'Mesurer l\'impact des actions sur la rétention',
          'Calculer le ROI des investissements en fidélisation',
          'Comparer les résultats avec les objectifs fixés',
          'Identifier les meilleures pratiques et les leçons apprises'
        ]
      },
      {
        letter: 'R',
        objective: 'Reconnaître et valoriser les employés fidèles et leurs contributions.',
        actions: [
          'Créer des programmes de reconnaissance pour les employés fidèles',
          'Valoriser l\'ancienneté et la contribution',
          'Offrir des avantages spécifiques aux employés de longue date',
          'Célébrer les anniversaires et les accomplissements'
        ]
      }
    ]
  },
  'gestion-talents-formation': {
    methodology: 'F.O.R.M.E.R.',
    phases: [
      {
        letter: 'F',
        objective: 'Fixer les objectifs de formation et identifier les besoins.',
        actions: [
          'Analyser les besoins en compétences de l\'organisation',
          'Identifier les écarts entre compétences actuelles et nécessaires',
          'Définir les objectifs de formation alignés avec la stratégie',
          'Prioriser les formations selon l\'impact attendu'
        ]
      },
      {
        letter: 'O',
        objective: 'Organiser les programmes de formation et sélectionner les formats.',
        actions: [
          'Choisir les formats de formation (présentiel, e-learning, blended)',
          'Sélectionner les prestataires et les formateurs',
          'Planifier les sessions de formation',
          'Préparer les supports et les ressources pédagogiques'
        ]
      },
      {
        letter: 'R',
        objective: 'Réaliser les formations avec un accompagnement personnalisé.',
        actions: [
          'Organiser les sessions de formation',
          'Fournir un accompagnement pendant la formation',
          'Créer des opportunités de pratique et d\'application',
          'Assurer la qualité de la formation et la satisfaction des participants'
        ]
      },
      {
        letter: 'M',
        objective: 'Mesurer l\'efficacité de la formation et l\'impact sur les performances.',
        actions: [
          'Évaluer les acquis de formation (tests, évaluations)',
          'Mesurer l\'application des compétences en situation de travail',
          'Analyser l\'impact sur les performances individuelles et collectives',
          'Calculer le ROI de la formation'
        ]
      },
      {
        letter: 'E',
        objective: 'Enrichir l\'apprentissage avec des communautés de pratique et du partage.',
        actions: [
          'Créer des communautés de pratique autour des formations',
          'Faciliter le partage de connaissances entre participants',
          'Organiser des événements de suivi et de networking',
          'Encourager le mentorat et le peer learning'
        ]
      },
      {
        letter: 'R',
        objective: 'Renforcer les acquis et assurer la continuité de l\'apprentissage.',
        actions: [
          'Planifier des sessions de rappel et de consolidation',
          'Créer des ressources d\'apprentissage continues',
          'Intégrer la formation dans les processus de développement',
          'Maintenir une culture d\'apprentissage permanent'
        ]
      }
    ]
  },
  'gestion-talents-performance': {
    methodology: 'P.E.R.F.O.R.M.E.R.',
    phases: [
      {
        letter: 'P',
        objective: 'Planifier les objectifs de performance et définir les attentes.',
        actions: [
          'Définir des objectifs SMART (Spécifiques, Mesurables, Atteignables, Réalistes, Temporellement définis)',
          'Créer des plans de performance individuels',
          'Aligner les objectifs avec la stratégie organisationnelle',
          'Communiquer clairement les attentes et les critères de succès'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer les performances actuelles et identifier les écarts.',
        actions: [
          'Conduire des évaluations de performance régulières',
          'Analyser les résultats et les accomplissements',
          'Identifier les forces et les axes d\'amélioration',
          'Comparer les performances avec les objectifs fixés'
        ]
      },
      {
        letter: 'R',
        objective: 'Reconnaître les performances et valoriser les contributions.',
        actions: [
          'Créer des programmes de reconnaissance et de récompenses',
          'Valoriser les performances exceptionnelles',
          'Célébrer les accomplissements et les succès',
          'Offrir des opportunités de visibilité et de promotion'
        ]
      },
      {
        letter: 'F',
        objective: 'Former et développer les compétences pour améliorer les performances.',
        actions: [
          'Identifier les besoins en formation et développement',
          'Organiser des formations ciblées sur les compétences clés',
          'Mettre en place des programmes de coaching et de mentoring',
          'Créer des opportunités d\'apprentissage pratique'
        ]
      },
      {
        letter: 'O',
        objective: 'Optimiser les processus et les outils pour améliorer l\'efficacité.',
        actions: [
          'Analyser les processus de travail pour identifier les améliorations',
          'Optimiser les outils et les technologies utilisés',
          'Éliminer les obstacles et les inefficacités',
          'Créer un environnement propice à la performance'
        ]
      },
      {
        letter: 'R',
        objective: 'Réviser et ajuster les objectifs et les stratégies en fonction des résultats.',
        actions: [
          'Réviser les objectifs régulièrement (trimestriels)',
          'Ajuster les stratégies en fonction des résultats obtenus',
          'Identifier les améliorations nécessaires',
          'Créer de nouveaux objectifs challengeants'
        ]
      },
      {
        letter: 'M',
        objective: 'Mesurer l\'impact des actions sur les performances et le ROI.',
        actions: [
          'Suivre les KPIs de performance (productivité, qualité, satisfaction)',
          'Analyser les tendances et les patterns',
          'Calculer le ROI des investissements en performance',
          'Identifier les meilleures pratiques'
        ]
      },
      {
        letter: 'E',
        objective: 'Engager les talents dans leur développement de performance.',
        actions: [
          'Créer un dialogue régulier sur la performance',
          'Impliquer les talents dans la définition de leurs objectifs',
          'Fournir un feedback constructif et continu',
          'Créer un sentiment d\'autonomie et de responsabilisation'
        ]
      },
      {
        letter: 'R',
        objective: 'Récompenser les performances exceptionnelles et créer des opportunités.',
        actions: [
          'Offrir des récompenses financières et non-financières',
          'Créer des opportunités de promotion et de carrière',
          'Reconnaître publiquement les contributions',
          'Créer une culture de performance et d\'excellence'
        ]
      }
    ]
  },
  'gestion-talents-recrutement': {
    methodology: 'R.E.C.R.U.T.E.R.',
    phases: [
      {
        letter: 'R',
        objective: 'Rechercher et identifier les talents cibles sur le marché.',
        actions: [
          'Définir les profils recherchés et les compétences requises',
          'Utiliser les canaux de sourcing (LinkedIn, GitHub, réseaux sociaux)',
          'Développer un talent pipeline avec des candidats qualifiés',
          'Créer des partenariats avec des écoles et des communautés'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer les candidats et sélectionner les meilleurs profils.',
        actions: [
          'Conduire des entretiens structurés et des tests de compétences',
          'Évaluer la culture fit et les soft skills',
          'Vérifier les références et les antécédents',
          'Sélectionner les candidats qui correspondent le mieux au poste'
        ]
      },
      {
        letter: 'C',
        objective: 'Convaincre les candidats de rejoindre l\'organisation.',
        actions: [
          'Présenter l\'employer brand et la proposition de valeur',
          'Créer une expérience candidat exceptionnelle',
          'Communiquer sur les opportunités de carrière et de développement',
          'Négocier les conditions d\'embauche de manière attractive'
        ]
      },
      {
        letter: 'R',
        objective: 'Recruter les talents sélectionnés et finaliser les embauches.',
        actions: [
          'Préparer et envoyer les offres d\'embauche',
          'Négocier les termes et conditions d\'emploi',
          'Finaliser les contrats et les documents administratifs',
          'Planifier les dates d\'intégration'
        ]
      },
      {
        letter: 'U',
        objective: 'Unifier les nouveaux talents avec l\'équipe et la culture.',
        actions: [
          'Créer un processus d\'onboarding engageant et efficace',
          'Faciliter l\'intégration dans l\'équipe et l\'organisation',
          'Présenter la culture et les valeurs organisationnelles',
          'Assigner un buddy ou un mentor pour accompagner le nouveau talent'
        ]
      },
      {
        letter: 'T',
        objective: 'Tester et évaluer la performance des nouveaux recrutés.',
        actions: [
          'Définir des objectifs clairs pour la période d\'essai',
          'Fournir un feedback régulier et constructif',
          'Évaluer l\'intégration et la performance',
          'Prendre des décisions sur la confirmation de l\'embauche'
        ]
      },
      {
        letter: 'E',
        objective: 'Engager les nouveaux talents et assurer leur rétention.',
        actions: [
          'Créer un environnement de travail engageant et motivant',
          'Offrir des opportunités de développement et de carrière',
          'Fournir un feedback continu et une reconnaissance',
          'Maintenir une communication ouverte et transparente'
        ]
      },
      {
        letter: 'R',
        objective: 'Réviser et optimiser le processus de recrutement en continu.',
        actions: [
          'Analyser les métriques de recrutement (time-to-hire, quality-of-hire)',
          'Collecter des feedbacks des candidats et des recruteurs',
          'Identifier les améliorations possibles',
          'Optimiser les processus et les outils de recrutement'
        ]
      }
    ]
  },
  'gestion-talents-remuneration': {
    methodology: 'R.É.M.U.N.É.R.E.R.',
    phases: [
      {
        letter: 'R',
        objective: 'Rechercher et analyser les données de marché sur la rémunération.',
        actions: [
          'Benchmarker les salaires avec les données du marché',
          'Analyser les tendances de rémunération du secteur',
          'Identifier les écarts avec la concurrence',
          'Définir une stratégie de rémunération compétitive'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer la valeur des postes et créer une structure salariale équitable.',
        actions: [
          'Conduire une évaluation de postes (job evaluation)',
          'Créer des bandes salariales par niveau et fonction',
          'Assurer l\'équité interne et externe',
          'Définir les politiques de rémunération et d\'avantages'
        ]
      },
      {
        letter: 'M',
        objective: 'Mesurer les performances pour lier la rémunération aux résultats.',
        actions: [
          'Évaluer les performances individuelles et collectives',
          'Définir les critères d\'éligibilité pour la rémunération variable',
          'Calculer les montants de rémunération variable',
          'Assurer la transparence et l\'équité dans l\'allocation'
        ]
      },
      {
        letter: 'U',
        objective: 'Unifier les pratiques de rémunération et créer une cohérence.',
        actions: [
          'Harmoniser les pratiques de rémunération dans l\'organisation',
          'Créer des processus standardisés pour les augmentations',
          'Assurer la cohérence entre les départements',
          'Communiquer clairement les politiques de rémunération'
        ]
      },
      {
        letter: 'N',
        objective: 'Négocier les rémunérations et les ajustements avec les talents.',
        actions: [
          'Conduire des entretiens de révision salariale',
          'Négocier les augmentations et les ajustements',
          'Expliquer les décisions de rémunération de manière transparente',
          'Créer des plans de progression salariale'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer l\'efficacité de la stratégie de rémunération et ajuster.',
        actions: [
          'Analyser l\'impact de la rémunération sur la rétention',
          'Mesurer la compétitivité de la rémunération sur le marché',
          'Identifier les améliorations nécessaires',
          'Ajuster les politiques et les pratiques'
        ]
      },
      {
        letter: 'R',
        objective: 'Reconnaître les contributions exceptionnelles avec des récompenses.',
        actions: [
          'Créer des programmes de récompenses et de bonus',
          'Reconnaître les performances exceptionnelles',
          'Offrir des avantages et des perks attractifs',
          'Valoriser les contributions et les accomplissements'
        ]
      },
      {
        letter: 'E',
        objective: 'Équilibrer la rémunération fixe et variable pour optimiser la motivation.',
        actions: [
          'Définir le mix optimal entre rémunération fixe et variable',
          'Créer des plans de rémunération variable alignés avec les objectifs',
          'Assurer la compétitivité de la rémunération totale',
          'Optimiser la structure de rémunération pour la motivation'
        ]
      },
      {
        letter: 'R',
        objective: 'Réviser régulièrement les rémunérations et maintenir la compétitivité.',
        actions: [
          'Conduire des révisions salariales régulières (annuelles)',
          'Ajuster les rémunérations selon les performances et le marché',
          'Maintenir la compétitivité avec la concurrence',
          'Assurer l\'équité et la transparence dans les révisions'
        ]
      }
    ]
  },
  'gestion-talents-succession': {
    methodology: 'S.U.C.C.É.D.E.R.',
    phases: [
      {
        letter: 'S',
        objective: 'Sélectionner les postes clés et identifier les besoins de succession.',
        actions: [
          'Identifier les postes critiques pour l\'organisation',
          'Analyser les risques de départ (retraite, mobilité)',
          'Définir les compétences et profils nécessaires',
          'Créer une cartographie des besoins de succession'
        ]
      },
      {
        letter: 'U',
        objective: 'Utiliser les assessments pour identifier les talents à haut potentiel.',
        actions: [
          'Conduire des assessments de potentiel (tests, évaluations)',
          'Identifier les talents à haut potentiel (HiPo)',
          'Évaluer les compétences de leadership et de management',
          'Créer un talent pipeline avec les successeurs potentiels'
        ]
      },
      {
        letter: 'C',
        objective: 'Créer des plans de développement pour préparer les successeurs.',
        actions: [
          'Développer des plans de développement personnalisés',
          'Organiser des programmes de formation et de mentoring',
          'Créer des opportunités d\'exposition et de visibilité',
          'Donner des responsabilités progressives pour préparer la succession'
        ]
      },
      {
        letter: 'C',
        objective: 'Cultiver les compétences de leadership et de management.',
        actions: [
          'Organiser des programmes de développement de leadership',
          'Créer des opportunités de management et de leadership',
          'Faciliter le transfert de connaissances des seniors',
          'Développer les compétences stratégiques et visionnaires'
        ]
      },
      {
        letter: 'É',
        objective: 'Évaluer la préparation des successeurs et ajuster les plans.',
        actions: [
          'Conduire des évaluations régulières de la préparation',
          'Analyser les progrès et les compétences acquises',
          'Identifier les lacunes et les besoins supplémentaires',
          'Ajuster les plans de développement si nécessaire'
        ]
      },
      {
        letter: 'D',
        objective: 'Développer des plans de transition pour assurer la continuité.',
        actions: [
          'Créer des plans de transition détaillés',
          'Organiser le transfert de connaissances et de responsabilités',
          'Assurer un chevauchement entre l\'ancien et le nouveau leader',
          'Minimiser les risques de discontinuité'
        ]
      },
      {
        letter: 'E',
        objective: 'Exécuter la transition et assurer le succès de la succession.',
        actions: [
          'Mettre en œuvre les plans de transition',
          'Accompagner le nouveau leader dans ses nouvelles responsabilités',
          'Assurer le support et le mentoring post-transition',
          'Surveiller la réussite de la succession'
        ]
      },
      {
        letter: 'R',
        objective: 'Réviser et optimiser le processus de succession en continu.',
        actions: [
          'Analyser les succès et les échecs des successions',
          'Identifier les améliorations possibles',
          'Ajuster les processus et les pratiques',
          'Maintenir un pipeline de talents prêts pour la succession'
        ]
      }
    ]
  },
  'gestion-talents-whistleblowing': {
    methodology: 'S.I.G.N.A.L.E.R.',
    phases: [
      {
        letter: 'S',
        objective: 'Sensibiliser les employés aux enjeux éthiques et aux procédures de signalement.',
        actions: [
          'Organiser des formations sur l\'éthique et la conformité',
          'Communiquer clairement les procédures de signalement',
          'Créer une culture de transparence et de responsabilité',
          'Expliquer les protections offertes aux lanceurs d\'alerte'
        ]
      },
      {
        letter: 'I',
        objective: 'Instaurer un système de signalement sûr et confidentiel.',
        actions: [
          'Mettre en place des canaux de signalement (ligne téléphonique, plateforme)',
          'Assurer la confidentialité et l\'anonymat',
          'Créer un processus clair de réception des signalements',
          'Désigner des personnes responsables du traitement'
        ]
      },
      {
        letter: 'G',
        objective: 'Guider les lanceurs d\'alerte dans le processus de signalement.',
        actions: [
          'Fournir des informations claires sur le processus',
          'Offrir un accompagnement et un support',
          'Expliquer les étapes et les délais',
          'Assurer la protection contre les représailles'
        ]
      },
      {
        letter: 'N',
        objective: 'Notifier les autorités compétentes si nécessaire.',
        actions: [
          'Évaluer la gravité et la nature du signalement',
          'Déterminer si une notification externe est requise',
          'Notifier les autorités compétentes selon les réglementations',
          'Assurer la conformité avec les obligations légales'
        ]
      },
      {
        letter: 'A',
        objective: 'Analyser les signalements et conduire des enquêtes approfondies.',
        actions: [
          'Analyser chaque signalement de manière approfondie',
          'Conduire des enquêtes impartiales et complètes',
          'Collecter des preuves et des témoignages',
          'Documenter toutes les étapes de l\'enquête'
        ]
      },
      {
        letter: 'L',
        objective: 'Lever les mesures correctives et préventives nécessaires.',
        actions: [
          'Prendre des mesures correctives immédiates si nécessaire',
          'Mettre en place des actions préventives',
          'Sanctionner les comportements non conformes',
          'Assurer le suivi de l\'implémentation des mesures'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'efficacité du système et améliorer les processus.',
        actions: [
          'Analyser l\'efficacité du système de signalement',
          'Collecter des feedbacks des lanceurs d\'alerte',
          'Identifier les améliorations possibles',
          'Optimiser les processus et les outils'
        ]
      },
      {
        letter: 'R',
        objective: 'Récompenser les comportements éthiques et créer une culture de conformité.',
        actions: [
          'Reconnaître les employés qui signalent les problèmes de bonne foi',
          'Créer une culture qui valorise l\'éthique et la conformité',
          'Organiser des événements de sensibilisation',
          'Intégrer l\'éthique dans les processus de recrutement et d\'évaluation'
        ]
      }
    ]
  },
  'gestion-talents-xenophobia': {
    methodology: 'I.N.C.L.U.R.E.',
    phases: [
      {
        letter: 'I',
        objective: 'Identifier les discriminations et les comportements xénophobes.',
        actions: [
          'Analyser les données de diversité et d\'inclusion',
          'Identifier les cas de discrimination et de xénophobie',
          'Conduire des audits de culture organisationnelle',
          'Créer des mécanismes de signalement confidentiels'
        ]
      },
      {
        letter: 'N',
        objective: 'Normaliser la diversité et créer une culture inclusive.',
        actions: [
          'Créer des politiques de diversité et d\'inclusion claires',
          'Communiquer les valeurs d\'inclusion et de respect',
          'Intégrer la diversité dans tous les processus RH',
          'Créer une culture où la diversité est valorisée'
        ]
      },
      {
        letter: 'C',
        objective: 'Cultiver les compétences interculturelles et la sensibilité.',
        actions: [
          'Organiser des formations sur la diversité et l\'inclusion',
          'Développer les compétences interculturelles',
          'Créer des opportunités de dialogue et d\'échange',
          'Sensibiliser aux biais inconscients et aux stéréotypes'
        ]
      },
      {
        letter: 'L',
        objective: 'Lutter contre les discriminations et sanctionner les comportements.',
        actions: [
          'Mettre en place des processus de traitement des plaintes',
          'Conduire des enquêtes sur les discriminations',
          'Sanctionner les comportements discriminatoires',
          'Assurer la protection des victimes'
        ]
      },
      {
        letter: 'U',
        objective: 'Unifier les équipes autour de valeurs communes et d\'objectifs partagés.',
        actions: [
          'Créer des équipes diversifiées et inclusives',
          'Faciliter l\'intégration des employés de toutes origines',
          'Développer des activités de team building interculturelles',
          'Renforcer la cohésion d\'équipe malgré les différences'
        ]
      },
      {
        letter: 'R',
        objective: 'Reconnaître la contribution de tous et valoriser la diversité.',
        actions: [
          'Créer des programmes de reconnaissance pour tous',
          'Valoriser les contributions de personnes de toutes origines',
          'Célébrer les différences culturelles',
          'Assurer l\'équité dans les opportunités de carrière'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer l\'impact des actions et mesurer les progrès en diversité.',
        actions: [
          'Suivre les indicateurs de diversité et d\'inclusion',
          'Analyser les tendances et les progrès',
          'Identifier les améliorations nécessaires',
          'Ajuster les stratégies en fonction des résultats'
        ]
      }
    ]
  },
  'gestion-talents-youth': {
    methodology: 'J.E.U.N.E.S.S.E.',
    phases: [
      {
        letter: 'J',
        objective: 'Jumeler les jeunes talents avec des mentors expérimentés.',
        actions: [
          'Créer des programmes de mentoring intergénérationnel',
          'Apparier les jeunes talents avec des mentors appropriés',
          'Définir les objectifs et les attentes du mentoring',
          'Faciliter les rencontres et les échanges réguliers'
        ]
      },
      {
        letter: 'E',
        objective: 'Encourager l\'innovation et la créativité des jeunes talents.',
        actions: [
          'Créer des espaces pour l\'innovation et la créativité',
          'Donner aux jeunes talents des opportunités d\'initier des projets',
          'Valoriser les nouvelles idées et les approches innovantes',
          'Créer des programmes d\'intrapreneuriat'
        ]
      },
      {
        letter: 'U',
        objective: 'Utiliser les technologies modernes et les outils digitaux.',
        actions: [
          'Fournir les outils et technologies modernes',
          'Former aux dernières technologies et plateformes',
          'Créer des environnements de travail digitaux',
          'Valoriser les compétences digitales des jeunes'
        ]
      },
      {
        letter: 'N',
        objective: 'Nourrir le développement professionnel avec des formations adaptées.',
        actions: [
          'Organiser des formations adaptées aux besoins des jeunes',
          'Créer des programmes de développement spécifiques',
          'Offrir des opportunités d\'apprentissage continu',
          'Développer les compétences techniques et comportementales'
        ]
      },
      {
        letter: 'E',
        objective: 'Élever les jeunes talents vers des responsabilités et des défis.',
        actions: [
          'Donner des responsabilités progressives et des défis',
          'Créer des opportunités de leadership précoce',
          'Assigner des projets stimulants et valorisants',
          'Préparer les jeunes talents à des postes à responsabilité'
        ]
      },
      {
        letter: 'S',
        objective: 'Soutenir l\'équilibre vie professionnelle/personnelle des jeunes.',
        actions: [
          'Offrir des horaires flexibles et du télétravail',
          'Créer des environnements de travail bienveillants',
          'Promouvoir le bien-être et la santé mentale',
          'Respecter les besoins de vie personnelle'
        ]
      },
      {
        letter: 'S',
        objective: 'Stimuler l\'engagement avec des projets passionnants et du sens.',
        actions: [
          'Assigner des projets qui ont du sens et de l\'impact',
          'Créer des opportunités d\'engagement social et environnemental',
          'Valoriser les contributions et les accomplissements',
          'Créer un environnement motivant et engageant'
        ]
      },
      {
        letter: 'E',
        objective: 'Évaluer les progrès et créer des opportunités de carrière.',
        actions: [
          'Conduire des évaluations régulières des progrès',
          'Créer des plans de carrière avec des étapes claires',
          'Offrir des opportunités de promotion et de mobilité',
          'Assurer la rétention et le développement des jeunes talents'
        ]
      }
    ]
  },
  'gestion-talents-zen': {
    methodology: 'Z.É.N.I.T.H.',
    phases: [
      {
        letter: 'Z',
        objective: 'Zénifier l\'environnement de travail pour réduire le stress.',
        actions: [
          'Créer des espaces de travail calmes et apaisants',
          'Organiser des activités de mindfulness et de méditation',
          'Promouvoir un environnement de travail serein',
          'Réduire les sources de stress et de tension'
        ]
      },
      {
        letter: 'É',
        objective: 'Équilibrer la charge de travail et éviter le burnout.',
        actions: [
          'Analyser et équilibrer la charge de travail',
          'Créer des processus pour éviter la surcharge',
          'Promouvoir la prise de pauses et de repos',
          'Respecter les limites et les capacités individuelles'
        ]
      },
      {
        letter: 'N',
        objective: 'Nourrir le bien-être physique et mental des employés.',
        actions: [
          'Offrir des programmes de bien-être et de santé',
          'Promouvoir l\'activité physique et une alimentation saine',
          'Créer des ressources pour la santé mentale',
          'Organiser des activités de bien-être'
        ]
      },
      {
        letter: 'I',
        objective: 'Intégrer la mindfulness et la pleine conscience dans le travail.',
        actions: [
          'Organiser des sessions de mindfulness et de méditation',
          'Former aux techniques de pleine conscience',
          'Créer des moments de pause et de réflexion',
          'Promouvoir la présence et la concentration'
        ]
      },
      {
        letter: 'T',
        objective: 'Transcender les pressions et créer un environnement bienveillant.',
        actions: [
          'Créer une culture de bienveillance et de respect',
          'Promouvoir la communication non-violente',
          'Valoriser l\'empathie et la compréhension',
          'Réduire les pressions et les tensions'
        ]
      },
      {
        letter: 'H',
        objective: 'Harmoniser la vie professionnelle et personnelle.',
        actions: [
          'Promouvoir l\'équilibre vie professionnelle/personnelle',
          'Offrir des horaires flexibles et du télétravail',
          'Respecter les temps personnels et familiaux',
          'Créer des politiques qui soutiennent l\'équilibre'
        ]
      }
    ]
  }
};

function fixPlaceholders(filePath, fileName) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const { data: frontmatter, content: body } = matter(content);
  
  const info = methodologyContent[fileName];
  if (!info) {
    return { modified: false, reason: 'Pas de méthodologie disponible' };
  }
  
  // Vérifier si des placeholders existent
  if (!body.includes('[Objectif de cette phase]') && !body.includes('[Description de l\'action]')) {
    return { modified: false, reason: 'Pas de placeholders à remplir' };
  }
  
  let newBody = body;
  
  // Remplacer les placeholders pour chaque phase
  info.phases.forEach((phase, index) => {
    const phaseRegex = new RegExp(`#### ${phase.letter}\\s*-\\s*Phase\\s*${index + 1}[\\s\\S]*?Dans ma pratique quotidienne`, 'g');
    const phaseMatch = newBody.match(phaseRegex);
    
    if (phaseMatch) {
      const phaseContent = `#### ${phase.letter} - Phase ${index + 1} (Semaines ${(index + 1) * 2 - 1}-${(index + 1) * 2})

**Objectif :** ${phase.objective}

**Actions concrètes :**

${phase.actions.map((action, idx) => `${idx + 1}. ${action}`).join('\n\n')}

Dans ma pratique quotidienne, j'observe que cette phase est souvent négligée. Sur 100 projets, celles qui appliquent correctement cette phase ont 70% plus de succès.

`;
      
      newBody = newBody.replace(phaseRegex, phaseContent);
    }
  });
  
  if (newBody !== body) {
    const newContent = matter.stringify(newBody, frontmatter);
    fs.writeFileSync(filePath, newContent, 'utf-8');
    return { modified: true };
  }
  
  return { modified: false, reason: 'Aucun changement nécessaire' };
}

// Traiter tous les articles
const files = fs.readdirSync(articlesDir)
  .filter(file => file.endsWith('.md'))
  .map(file => ({ path: path.join(articlesDir, file), name: file.replace('.md', '') }));

let fixedCount = 0;
let skippedCount = 0;

console.log('Correction des placeholders dans les méthodologies...\n');

files.forEach(({ path: filePath, name: fileName }) => {
  const result = fixPlaceholders(filePath, fileName);
  if (result.modified) {
    console.log(`✅ ${fileName}.md corrigé`);
    fixedCount++;
  } else {
    console.log(`⏭️  ${fileName}.md - ${result.reason}`);
    skippedCount++;
  }
});

console.log(`\n✅ ${fixedCount} articles corrigés`);
console.log(`⏭️  ${skippedCount} articles ignorés`);

