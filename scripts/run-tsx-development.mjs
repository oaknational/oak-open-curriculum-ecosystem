#!/usr/bin/env node

import { spawnSync } from 'node:child_process';
import { isAbsolute, resolve } from 'node:path';

const [entrypoint, ...args] = process.argv.slice(2);

if (!entrypoint) {
  console.error('Usage: node scripts/run-tsx-development.mjs <entrypoint> [...args]');
  process.exit(1);
}

const resolvedEntrypoint = isAbsolute(entrypoint) ? entrypoint : resolve(process.cwd(), entrypoint);

const result = spawnSync(
  process.execPath,
  ['--conditions=development', '--import', 'tsx', resolvedEntrypoint, ...args],
  {
    env: process.env,
    stdio: 'inherit',
  },
);

if (result.error) {
  throw result.error;
}

if (result.signal) {
  process.kill(process.pid, result.signal);
}

process.exit(result.status ?? 1);
