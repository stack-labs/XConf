module.exports = {
  extends: ['react-app', 'plugin:prettier/recommended'],
  rules: {
    'no-var': 'error',
    'no-console': ['error', { allow: ['info', 'warn', 'error'] }],
    'brace-style': ['error', '1tbs', { allowSingleLine: true }],
    'sort-imports': [
      'error',
      {
        ignoreCase: false,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
      },
    ],
  },
};
