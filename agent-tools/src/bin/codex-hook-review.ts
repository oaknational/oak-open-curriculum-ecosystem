#!/usr/bin/env node

import { resolve } from 'node:path';

import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { runCodexHookReviewOperator } from '../codex-hook-review/operator.js';

const exitCode = await runCodexHookReviewOperator({
  args: process.argv.slice(2),
  projectRoot: resolve(process.cwd()),
  environment: process.env,
  output: { writeLine, writeErrorLine },
});

process.exitCode = exitCode;
