import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', '.next/**', 'out/**']
  },
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    extends: [
      js.configs.recommended,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: { ecmaFeatures: { jsx: true } },
      globals: {
        ...globals.browser,
        process: 'readonly'
      },
    },
    rules: {
      'no-undef': 'off',
      'no-unused-vars': 'warn',
      'react-refresh/only-export-components': 'off'
    }
  },
]
