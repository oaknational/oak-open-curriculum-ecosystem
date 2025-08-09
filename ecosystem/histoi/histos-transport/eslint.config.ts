import { createHistoiBoundaryRules, commonSettings } from '../../../eslint-rules/index.js';
import { getOtherTissues } from '../../../eslint-rules/utils.js';

import jseslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import-x';
import prettierConfig from 'eslint-config-prettier';

export default tseslint.config(
  { ignores: ['dist/**', 'node_modules/**', '*.config.js', 'coverage/**'] },
  jseslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.lint.json',
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      'import-x': importPlugin,
    },
    settings: commonSettings,
    rules: createHistoiBoundaryRules('histos-transport', getOtherTissues('histos-transport')),
  },
  {
    files: ['**/*.js'],
    ...tseslint.configs.disableTypeChecked,
  },
);
