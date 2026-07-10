module.exports = [
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        module: 'readonly',
        require: 'readonly',
        window: 'readonly',
        document: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-console': 'off',
      eqeqeq: 'warn',
      'no-var': 'warn',
      'no-empty': 'warn',
      'no-dupe-keys': 'error',
      'no-unreachable': 'error',
    },
  },
];