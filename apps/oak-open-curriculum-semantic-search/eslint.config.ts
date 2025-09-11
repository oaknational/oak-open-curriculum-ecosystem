/**
 * ESLint Configuration for Oak Open Curriculum Semantic Search
 */

import type { ConfigArray } from 'typescript-eslint';
import { baseConfig } from '../../eslint.config.base';
import {
  appBoundaryRules,
  appArchitectureRules,
  commonSettings,
} from '../../eslint-rules/index.js';
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import nextPlugin from '@next/eslint-plugin-next';

const thisDir = dirname(fileURLToPath(import.meta.url));
const rootTsProject = fileURLToPath(new URL('../../tsconfig.lint.root.json', import.meta.url));
const repoRootDir = dirname(rootTsProject);
const wsTsProject = fileURLToPath(new URL('./tsconfig.json', import.meta.url));
const wsTsLintProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const compat = new FlatCompat({ baseDirectory: thisDir });

const config: ConfigArray = [
  // Ignore Next.js build outputs
  { ignores: ['.next/**'] },
  // Ensure Next.js plugin is registered for Next to detect
  { plugins: { '@next/next': nextPlugin } },
  // Base repo config (includes @typescript-eslint) — ensure this comes first
  ...baseConfig,
  // Next.js plugin (do NOT include next/typescript to avoid redefining @typescript-eslint)
  ...compat.config({
    extends: ['plugin:@next/next/recommended', 'next/core-web-vitals'],
    settings: { next: { rootDir: '.' } },
  }),
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parserOptions: {
        projectService: true,
        project: [rootTsProject, wsTsProject, wsTsLintProject],
        tsconfigRootDir: repoRootDir,
      },
    },
    settings: {
      ...commonSettings,
      'import-x/resolver': {
        ...commonSettings['import-x/resolver'],
        typescript: {
          ...commonSettings['import-x/resolver'].typescript,
          project: [rootTsProject, wsTsProject, wsTsLintProject],
        },
      },
    },
    rules: {
      // App architecture & boundaries
      ...appBoundaryRules,
      ...appArchitectureRules,
      // React specifics
      'react/jsx-key': 'error',
      'react/jsx-no-duplicate-props': 'error',
      'react/jsx-no-undef': 'error',
      'react/jsx-uses-react': 'off',
      'react/jsx-uses-vars': 'error',
      'react/no-children-prop': 'error',
      'react/no-danger-with-children': 'error',
    },
  },
  // App Router specific rules
  {
    files: ['app/**/*.ts', 'app/**/*.tsx'],
    rules: {
      'import-x/no-default-export': 'off',
    },
  },
];

export default config;
