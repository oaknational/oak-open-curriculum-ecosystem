/**
 * CLI entry for the Sentry release-and-deploy orchestrator (ADR-163 §6).
 *
 * This file is the COMPOSITION ROOT for the build-time orchestrator
 * described in `sentry-release-and-deploy.ts`. It is a STANDALONE SCRIPT
 * — not part of the server runtime — invoked directly by the Vercel
 * Build Command via `tsx` after `pnpm install` has completed:
 *
 *     "build:vercel": "pnpm build && tsx build-scripts/sentry-release-and-deploy-cli.ts"
 *
 * @remarks Why process.env is LEGITIMATE here (and banned elsewhere):
 *
 * - This script does not run inside the server process. Nothing it
 *   reads will leak into request handlers, middleware, or shared
 *   module state. There is no possibility of coupling independent
 *   runtime subsystems through system-level shared state.
 *
 * - This script does not participate in the oak-env configuration
 *   workspace. It reads a small, fixed set of Vercel-injected build
 *   variables (VERCEL_GIT_COMMIT_SHA, VERCEL_GIT_COMMIT_REF, VERCEL_ENV,
 *   SENTRY_AUTH_TOKEN, SENTRY_RELEASE_*). These are Vercel's contract,
 *   not Oak's; binding them through runtime config would add indirection
 *   without safety benefit.
 *
 * - This file is the ONLY place in the orchestrator boundary that
 *   touches process.env. The testable orchestrator
 *   (`sentry-release-and-deploy.ts`) accepts env as a parameter. Tests
 *   pass literal env objects; this CLI file is never imported by them.
 *
 * - This file MUST be listed in `eslint.config.ts` `ignores` for the
 *   `no-restricted-syntax` rule. That listing is the audit record of
 *   the exception; the comment above each process.env access is the
 *   local rationale.
 *
 * Fail-fast philosophy: every env-var read is validated either here or
 * by the orchestrator's preflight gate. Missing or malformed values
 * abort the build with a helpful message before any Sentry CLI call.
 */

import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import {
  runSentryReleaseAndDeploy,
  type CliResponse,
  type RunSentryReleaseAndDeployOptions,
} from './sentry-release-and-deploy.js';

interface ExecFailure {
  readonly status?: number;
  readonly stdout?: Buffer | string;
  readonly stderr?: Buffer | string;
}

function isExecFailure(value: unknown): value is ExecFailure {
  if (value === null || typeof value !== 'object') {
    return false;
  }
  return 'status' in value || 'stdout' in value || 'stderr' in value;
}

function mapExecFailure(caught: unknown): CliResponse {
  if (!isExecFailure(caught)) {
    return {
      exitCode: 1,
      stdout: '',
      stderr: caught instanceof Error ? caught.message : 'unknown exec failure',
    };
  }
  return {
    exitCode: typeof caught.status === 'number' ? caught.status : 1,
    stdout: caught.stdout ? caught.stdout.toString() : '',
    stderr: caught.stderr ? caught.stderr.toString() : '',
  };
}

function buildSentryCliExecutor(
  appDir: string,
  env: Readonly<Record<string, string | undefined>>,
): RunSentryReleaseAndDeployOptions['execCli'] {
  return (argv) => {
    try {
      const stdout = execFileSync('pnpm', ['exec', 'sentry-cli', ...argv], {
        cwd: appDir,
        env,
        encoding: 'utf8',
      });
      return { exitCode: 0, stdout, stderr: '' };
    } catch (caught) {
      return mapExecFailure(caught);
    }
  };
}

function buildScriptExecutor(
  appDir: string,
  env: Readonly<Record<string, string | undefined>>,
): RunSentryReleaseAndDeployOptions['execScript'] {
  return (scriptPath, scriptEnv) => {
    try {
      const stdout = execFileSync('bash', [scriptPath], {
        cwd: appDir,
        env: { ...env, ...scriptEnv },
        encoding: 'utf8',
      });
      return { exitCode: 0, stdout, stderr: '' };
    } catch (caught) {
      return mapExecFailure(caught);
    }
  };
}

function main(): void {
  const thisFile = fileURLToPath(import.meta.url);
  const appDir = path.resolve(thisFile, '..', '..');
  const repositoryRoot = path.resolve(appDir, '..', '..');

  // process.env: Vercel-injected build environment; see module-level
  // TSDoc for why direct access is legitimate in this composition-root
  // script and forbidden elsewhere.
  const env = process.env;

  const result = runSentryReleaseAndDeploy({
    env,
    repositoryRoot,
    appDir,
    readFile: (p) => readFileSync(p, 'utf8'),
    readdirSync: (p) => readdirSync(p),
    existsSync: (p) => existsSync(p),
    execCli: buildSentryCliExecutor(appDir, env),
    execScript: buildScriptExecutor(appDir, env),
    stdout: process.stdout,
    stderr: process.stderr,
  });

  if (result.exitCode !== 0) {
    process.stderr.write(
      `[sentry-release] FAIL kind=${result.kind}${result.failedStep ? ` step=${result.failedStep}` : ''}: ${result.reason}\n`,
    );
  }

  process.exit(result.exitCode);
}

// Invoke only when the file is run directly (e.g. `tsx
// sentry-release-and-deploy-cli.ts`). Tests never import this file.
const invokedDirectly =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;

if (invokedDirectly) {
  main();
}
