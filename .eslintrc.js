module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: [
    '@react-native-community',
    'eslint:recommended',
    'airbnb-base',
    'plugin:jest/recommended',
    'plugin:prettier/recommended',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['babel', 'json', 'jest', 'prettier'],
  root: true,
  rules: {
    'camelcase': 0,
    'new-cap': 0,
    'no-invalid-this': 0,
    'no-unused-expressions': 0,
    'object-curly-spacing': 0,
    'quotes': 0,
    'semi': 0,
    'valid-typeof': 0,
    'babel/camelcase': 2,
    'babel/new-cap': 2,
    'babel/no-invalid-this': 2,
    'babel/no-unused-expressions': 2,
    'babel/object-curly-spacing': [2, 'always'],
    'babel/quotes': ['error', 'single', { avoidEscape: true, allowTemplateLiterals: false }],
    'babel/semi': 2,
    'babel/valid-typeof': 2,
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
      },
    },
  },
};
