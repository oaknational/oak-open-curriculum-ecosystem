import { createLibConfig } from '../../../tsup.config.base.js';

export default createLibConfig({
  dts: true,
  external: [
    'fs',
    'path',
    'node:fs',
    'node:path',
    'eslint',
    'typescript',
    '@eslint/js',
    '@next/eslint-plugin-next',
    '@typescript-eslint/eslint-plugin',
    '@typescript-eslint/parser',
    '@typescript-eslint/utils',
    'eslint-config-next',
    'eslint-config-prettier',
    'eslint-plugin-import-x',
    'eslint-plugin-prettier',
    'eslint-plugin-react',
    'eslint-plugin-react-hooks',
    'eslint-plugin-sonarjs',
    'eslint-plugin-tsdoc',
    'typescript-eslint',
    'globals',
    'minimatch',
  ],
});
