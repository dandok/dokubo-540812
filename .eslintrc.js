module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:json/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-empty-function': 'off',
    '@typescript-eslint/no-explicit-any': ['error'],
    '@typescript-eslint/no-empty-function': 'off',
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/quotes': [
      'warn',
      'single',
      {
        allowTemplateLiterals: true,
        avoidEscape: true,
      },
    ],
    'json/*': [
      'error',
      {
        allowComments: true,
      },
    ],
    'quote-props': ['error', 'as-needed'],
  },
};