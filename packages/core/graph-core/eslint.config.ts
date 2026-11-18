/**
 * ESLint Configuration for graph-core library
 *
 * RDF/JS-aligned graph primitives. See ADR-173 and ADR-179.
 */

import {
  coreBoundaryRules,
  createGraphBaseConfig,
  defineConfigArray,
} from '@oaknational/eslint-plugin-standards';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

export default defineConfigArray(
  createGraphBaseConfig({
    thisDir,
    wsTsProject,
    boundaryRules: coreBoundaryRules,
    configFileTsconfig: './tsconfig.json',
  }),
  {
    // The owner's ruling of 2026-09-08 on `no-throw-statement`: off where the
    // throw debt lives (this workspace), error everywhere else and in every new
    // workspace; the migration waits for the merge-back into the upstream. The
    // ruling is quoted in the plugin's configs/recommended.ts; the
    // no-throw-remediation plan owns the migration.
    rules: { '@oaknational/no-throw-statement': 'off' },
  },
);
