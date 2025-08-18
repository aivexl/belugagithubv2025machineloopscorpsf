import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config([
	{
		ignores: ['dist/**', 'node_modules/**', '.next/**', 'out/**']
	},
	{
		files: ['**/*.{ts,tsx}'],
		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
		],
		languageOptions: {
			ecmaVersion: 2020,
			sourceType: 'module',
			parserOptions: { ecmaFeatures: { jsx: true } },
			globals: globals.browser,
		},
		rules: {
			'react-refresh/only-export-components': 'off'
		}
	},
	{
		files: ['**/*.{js,jsx}'],
		extends: [
			js.configs.recommended,
			reactHooks.configs['recommended-latest'],
			reactRefresh.configs.vite,
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
])
