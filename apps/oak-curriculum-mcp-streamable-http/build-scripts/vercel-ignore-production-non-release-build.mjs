#!/usr/bin/env node

import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { runVercelIgnoreCommand } from '../../../packages/core/build-metadata/build-scripts/vercel-ignore-production-non-release-build.mjs';

const thisDir = path.dirname(fileURLToPath(import.meta.url));
const repositoryRoot = path.resolve(thisDir, '../../..');

const result = runVercelIgnoreCommand({
  repositoryRoot,
  env: process.env,
});

process.exit(result.exitCode);
