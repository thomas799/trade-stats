import eslint from '@eslint/js';
import perfectionistPlugin from 'eslint-plugin-perfectionist';
import prettierRecommendedPlugin from 'eslint-plugin-prettier/recommended';
import reactPlugin from 'eslint-plugin-react';
import hooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
  eslint.configs.recommended,
  reactPlugin.configs.flat['jsx-runtime'],
  prettierRecommendedPlugin,
  {
    ignores: ['**/build/**', '**/dist/**', '**/node_modules/**', '**/.next/**']
  },
  {
    files: ['**/*.{js,jsx,mjs,cjs}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        JSX: 'writable',
        React: 'writable',
        ...Object.fromEntries(
          Object.entries(globals.browser).map(([key, value]) => [
            key.trim(),
            value
          ])
        ),
        ...Object.fromEntries(
          Object.entries(globals.node).map(([key, value]) => [
            key.trim(),
            value
          ])
        )
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        },
        sourceType: 'module'
      },
      sourceType: 'module'
    },
    plugins: {
      perfectionist: perfectionistPlugin,
      react: reactPlugin,
      'react-hooks': hooksPlugin
    },
    rules: {
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          caughtErrors: 'none',
          varsIgnorePattern: '^_'
        }
      ],
      'perfectionist/sort-imports': [
        'error',
        {
          customGroups: {
            value: {
              'custom-assets': ['^assets/'],
              'custom-common': ['^common/'],
              react: ['^react$', '^react-dom$', '^react-router-dom$']
            }
          },
          groups: [
            ['react'],
            ['builtin', 'external'],
            ['internal', 'internal-type'],
            ['custom-common'],
            [
              'parent-type',
              'sibling-type',
              'index-type',
              'parent',
              'sibling',
              'index'
            ],
            'object',
            'unknown',
            'custom-assets'
          ],
          partitionByNewLine: false
        }
      ],
      'perfectionist/sort-named-imports': [
        'error',
        {
          groupKind: 'values-first'
        }
      ],
      'perfectionist/sort-objects': ['error'],
      'prettier/prettier': [
        'error',
        {
          parser: 'babel',
          singleQuote: true,
          trailingComma: 'none'
        }
      ],
      'react-hooks/exhaustive-deps': 'off',
      'react-hooks/rules-of-hooks': 'warn',
      'react/jsx-boolean-value': ['error', 'never'],
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-sort-props': [
        'error',
        {
          callbacksLast: true,
          ignoreCase: true,
          reservedFirst: true,
          shorthandFirst: true
        }
      ],
      'react/jsx-uses-vars': 'warn',
      'react/prop-types': 'off'
    },
    settings: {
      perfectionist: {
        order: 'asc',
        partitionByComment: true,
        partitionByNewLine: true,
        type: 'natural'
      }
    }
  }
];
