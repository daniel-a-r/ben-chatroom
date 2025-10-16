import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import pluginQuery from '@tanstack/eslint-plugin-query';
import testingLibrary from 'eslint-plugin-testing-library';
import jestDom from 'eslint-plugin-jest-dom';
import { defineConfig } from 'eslint/config';

export default defineConfig([
  { ignores: ['dist', 'src/components/ui'] },
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    plugins: { js },
    extends: [
      'js/recommended',
      tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat['jsx-runtime'],
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
      pluginQuery.configs['flat/recommended'],
    ],
    languageOptions: { globals: globals.browser },
    rules: {
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  {
    files: ['**/src/testing/*.test.{ts,tsx}'],
    extends: [
      testingLibrary.configs['flat/react'],
      jestDom.configs['flat/recommended'],
    ],
  },
  eslintPluginPrettierRecommended,
]);
