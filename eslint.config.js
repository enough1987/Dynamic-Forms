import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import react from 'eslint-plugin-react'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'src/mocks/**', 'src/**/__tests__/**', 'src/**/__tests/**', 'src/test/**']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      ...tseslint.configs.strictTypeChecked,
      ...tseslint.configs.stylisticTypeChecked,
      react.configs.flat.recommended,
      react.configs.flat['jsx-runtime'],
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // Possible problems
      'no-console': 'warn',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-duplicate-imports': 'error',
      'no-self-compare': 'error',
      'no-unreachable-loop': 'error',

      '@typescript-eslint/consistent-type-definitions': 'off',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/explicit-function-return-type': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/no-unnecessary-condition': 'off',
      '@typescript-eslint/no-unnecessary-type-assertion': 'error',
      '@typescript-eslint/no-floating-promises': 'error',
      '@typescript-eslint/await-thenable': 'error',
      '@typescript-eslint/no-misused-promises': 'error',
      '@typescript-eslint/prefer-nullish-coalescing': 'off',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/naming-convention': [
        'error',
        // Default: camelCase for everything
        { selector: 'default', format: ['camelCase'] },
        // Imports: allow PascalCase for React components and named exports (e.g. MUI)
        { selector: 'import', format: ['camelCase', 'PascalCase'] },
        // Variables: camelCase or UPPER_CASE (for module-level consts) or PascalCase (for React components)
        { selector: 'variable', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        // Functions: camelCase or PascalCase (for React components/HOCs)
        { selector: 'function', format: ['camelCase', 'PascalCase'] },
        // Parameters: camelCase, allow leading underscore for unused params
        { selector: 'parameter', format: ['camelCase'], leadingUnderscore: 'allow' },
        // Types, interfaces, enums, classes: PascalCase, no "I" prefix on interfaces
        { selector: 'typeLike', format: ['PascalCase'] },
        { selector: 'interface', format: ['PascalCase'], custom: { regex: '^I[A-Z]', match: false } },
        // Enum members: PascalCase
        { selector: 'enumMember', format: ['PascalCase'] },
        // Object properties and type properties: camelCase or UPPER_CASE (for const-like objects like DateFormat)
        { selector: 'objectLiteralProperty', format: ['camelCase', 'UPPER_CASE', 'PascalCase'] },
        { selector: 'objectLiteralProperty', modifiers: ['requiresQuotes'], format: null },
        { selector: 'typeProperty', format: ['camelCase'] },
        // Allow any format for properties that require quotes (e.g. HTTP headers, data keys)
        { selector: 'property', modifiers: ['requiresQuotes'], format: null },
        // Booleans: must be prefixed with `is` or `has`
        { selector: 'variable', types: ['boolean'], format: ['PascalCase'], prefix: ['is', 'has'] },
        { selector: 'parameter', types: ['boolean'], format: ['PascalCase'], prefix: ['is', 'has'] },
        // typeProperty booleans: is/has prefix, but allow `touched` (Formik convention)
        { selector: 'typeProperty', types: ['boolean'], format: ['PascalCase'], prefix: ['is', 'has'], filter: { regex: '^touched$', match: false } },
      ],

      // Complexity
      'max-depth': ['error', 3],
      'max-nested-callbacks': ['error', 3],

      // React
      'react/prop-types': 'off', // TypeScript handles this
      'react/self-closing-comp': 'error',
      'react/no-array-index-key': 'warn',
      'react/jsx-no-useless-fragment': 'error',
      'react/jsx-curly-brace-presence': ['error', { props: 'never', children: 'never' }],
      'react-hooks/exhaustive-deps': 'error',
    },
  },
])
