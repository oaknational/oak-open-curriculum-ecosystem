/**
 * ESLint Configuration for graph-ingest library.
 *
 * Transport-agnostic graph ingestion modes. See ADR-173 and ADR-179.
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
  boundaryRules: createLibBoundaryRules('graph-ingest'),
  configFileTsconfig: wsTsProject,
});

export default config;
