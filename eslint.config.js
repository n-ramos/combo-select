import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import globals from 'globals';

export default [
  // Ignorer les dossiers
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      'examples/**',
      '*.config.js',
      '*.config.ts',
      'coverage/**',
      '.github/**'
    ]
  },
  
  // Configuration de base JavaScript
  js.configs.recommended,
  
  // Configuration TypeScript
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json'
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node
      }
    },
    plugins: {
      '@typescript-eslint': tseslint
    },
    rules: {
      // Rules TypeScript recommandées
      ...tseslint.configs.recommended.rules,
      
      // Rules personnalisées
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      
      // Rules générales
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      'eqeqeq': ['error', 'always'],
      'curly': ['error', 'all'],
      'no-unused-expressions': 'error',
      'no-duplicate-imports': 'error'
    }
  }
];