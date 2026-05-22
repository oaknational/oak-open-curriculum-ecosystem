/**
 * ESLint Configuration for graph-core library
 *
 * RDF/JS-aligned graph primitives. See ADR-173 and ADR-179.
 */

import { coreBoundaryRules, createGraphBaseConfig } from '@oaknational/eslint-plugin-standards';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

export default createGraphBaseConfig({
  thisDir,
  wsTsProject,
  boundaryRules: coreBoundaryRules,
  configFileTsconfig: './tsconfig.json',
});
