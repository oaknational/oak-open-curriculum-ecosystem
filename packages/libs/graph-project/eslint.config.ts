/**
 * ESLint Configuration for graph-project library.
 *
 * Property-graph projection over RDF datasets. See ADR-173 and ADR-179.
 *
 * Delegates to the shared `createGraphBaseConfig` factory; this file only
 * supplies the workspace-differentiating concerns (anchor directory,
 * tsconfig project path, and boundary rules).
 */

import {
  createGraphBaseConfig,
  createLibBoundaryRules,
} from '@oaknational/eslint-plugin-standards';

import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const thisDir = dirname(fileURLToPath(import.meta.url));
const wsTsProject = fileURLToPath(new URL('./tsconfig.lint.json', import.meta.url));

const config = createGraphBaseConfig({
  thisDir,
  wsTsProject,
  boundaryRules: createLibBoundaryRules('graph-project'),
  configFileTsconfig: wsTsProject,
});

export default config;
