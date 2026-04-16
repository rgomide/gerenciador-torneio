import js from '@eslint/js'
import eslintPluginReact from 'eslint-plugin-react'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'

export default [
  {
    settings: {
      react: {
        version: 'detect'
      }
    }
  },
  {
    ignores: [
      'dist/**',
      'coverage/**',
      '.next/**',
      'node_modules/**',
      'public/mockServiceWorker.js',
      'src/stories/**'
    ]
  },
  js.configs.recommended,
  eslintPluginReact.configs.flat.recommended,
  eslintPluginReact.configs.flat['jsx-runtime'],
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      globals: { ...globals.browser },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module'
      }
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh
    },
    rules: {
      'react/prop-types': 'off',
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }]
    }
  }
]
