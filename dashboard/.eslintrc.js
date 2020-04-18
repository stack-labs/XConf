module.exports = {
  plugins: ['prettier'],
  extends: ['react-app', 'plugin:prettier/recommended', 'plugin:react/recommended'],
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
    // * prettier-react
    'react/prop-types': [0],
    'react/display-name': [0],
  },
};
