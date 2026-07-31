#!/usr/bin/env node
import { argv, stderr, stdout } from 'node:process';

import { isErr } from '@oaknational/result';

import { resolveRepoRoot } from '../core/repo-root.js';
import {
  AGENTS_PATH,
  NODE_FILE_IO,
  checkTeamAlertBootstrap,
  generateTeamAlertBootstrap,
} from './team-alert-bootstrap.js';
import {
  TEAM_ALERT_BOOTSTRAP_HELP_TEXT,
  parseTeamAlertBootstrapMode,
} from './team-alert-bootstrap-cli-args.js';

async function main(): Promise<number> {
  const mode = parseTeamAlertBootstrapMode(argv.slice(2));
  if (isErr(mode)) {
    return writeError(mode.error);
  }
  if (mode.value === 'help') {
    stdout.write(`${TEAM_ALERT_BOOTSTRAP_HELP_TEXT}\n`);
    return 0;
  }
  const repoRoot = resolveRepoRoot(import.meta.url);
  return mode.value === 'check' ? runCheck(repoRoot) : runGenerate(repoRoot);
}

async function runGenerate(repoRoot: string): Promise<number> {
  const generated = await generateTeamAlertBootstrap(repoRoot, NODE_FILE_IO);
  if (isErr(generated)) {
    return writeError(generated.error);
  }
  stdout.write(`Generated ${AGENTS_PATH}\n`);
  return 0;
}

async function runCheck(repoRoot: string): Promise<number> {
  const outcome = await checkTeamAlertBootstrap(repoRoot, NODE_FILE_IO);
  if (isErr(outcome)) {
    return writeError(outcome.error);
  }
  if (outcome.value.upToDate) {
    stdout.write('Codex team-alert bootstrap projection is up to date.\n');
    return 0;
  }
  stderr.write(
    `Generated Codex team-alert projection is stale: ${AGENTS_PATH}\n` +
      `Regenerate with \`pnpm codex-team-alert-bootstrap:generate\` and commit the result.\n`,
  );
  return 1;
}

try {
  process.exitCode = await main();
} catch (error: unknown) {
  stderr.write(`${formatError(error instanceof Error ? error : new Error(String(error)))}\n`);
  process.exitCode = 1;
}

function formatError(error: Error): string {
  return error.cause instanceof Error
    ? `${error.message}: ${formatError(error.cause)}`
    : error.message;
}

function writeError(error: Error): 1 {
  stderr.write(`${formatError(error)}\n`);
  return 1;
}
