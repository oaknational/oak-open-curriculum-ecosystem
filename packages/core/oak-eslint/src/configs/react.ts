import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

const reactHooksRulePlugin = {
  rules: reactHooksPlugin.rules,
};

export const react = tseslint.config({
  plugins: {
    react: reactPlugin,
    'react-hooks': reactHooksRulePlugin,
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    ...reactHooksPlugin.configs.recommended.rules,
    'react/react-in-jsx-scope': 'off',
    'react/jsx-uses-react': 'off',
    'react/prop-types': 'off',
    'react/no-direct-mutation-state': 'error',
    'react/no-array-index-key': 'error',
    'react/jsx-key': 'error',
    'react/jsx-no-bind': ['error', { allowArrowFunctions: true, allowBind: false }],
    'react/no-children-prop': 'error',
    'react/no-danger-with-children': 'error',
    'react/no-deprecated': 'error',
    'react/no-unescaped-entities': 'error',
    'react/self-closing-comp': 'error',
  },
});
