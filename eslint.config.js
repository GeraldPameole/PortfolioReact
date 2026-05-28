import js from '@eslint/js';
import astro from 'eslint-plugin-astro';
import globals from 'globals';

export default [
  // Ignorés (sorties de build, cache, deps, scripts one-shot de maintenance)
  { ignores: ['dist/', '.astro/', 'node_modules/', 'scripts/'] },

  js.configs.recommended,
  ...astro.configs['flat/recommended'],

  {
    // Le site tourne dans le navigateur (scripts Astro, fond WebGL) → globals browser
    languageOptions: {
      globals: { ...globals.browser },
    },
    rules: {
      // Projet perso : on tolère, on ne bloque pas le build pour du style
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-empty': ['warn', { allowEmptyCatch: true }],
    },
  },

  {
    // Fichiers exécutés sous Node : configs + scripts de build/outillage
    files: ['**/*.config.{js,mjs,cjs}', 'src/scripts/**', 'scripts/**'],
    languageOptions: {
      globals: { ...globals.node },
    },
  },

  {
    // Tests Cypress (cy, describe, it…)
    files: ['cypress/**', '**/*.cy.{js,ts}', '**/*.spec.{js,ts}'],
    languageOptions: {
      globals: {
        ...globals.mocha,
        cy: 'readonly',
        Cypress: 'readonly',
        expect: 'readonly',
        assert: 'readonly',
      },
    },
  },
];
