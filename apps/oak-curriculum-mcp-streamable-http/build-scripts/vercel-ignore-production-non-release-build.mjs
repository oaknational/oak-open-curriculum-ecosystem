#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

import { lte, valid } from 'semver';

function trimToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function safeReadCurrentVersion(readFile, packageJsonPath) {
  try {
    const parsed = JSON.parse(readFile(packageJsonPath, 'utf8'));
    const version = trimToUndefined(parsed.version);
    return version && valid(version) ? version : undefined;
  } catch {
    return undefined;
  }
}

function safeReadPreviousVersion(executeGitCommand, repositoryRoot, previousSha) {
  if (!previousSha) {
    return undefined;
  }
  try {
    let text;
    try {
      text = executeGitCommand(['show', `${previousSha}:package.json`], repositoryRoot);
    } catch {
      executeGitCommand(['fetch', '--depth=1', 'origin', previousSha], repositoryRoot);
      text = executeGitCommand(['show', `${previousSha}:package.json`], repositoryRoot);
    }
    const parsed = JSON.parse(text);
    const previousVersion = trimToUndefined(parsed.version);
    return previousVersion && valid(previousVersion) ? previousVersion : undefined;
  } catch {
    return undefined;
  }
}

function runGitCommand(args, cwd) {
  return execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  });
}

/**
 * Implements the production-build cancellation truth table from
 * ADR-163 §10 (second amendment, 2026-04-24). Consumed by the Vercel
 * `ignoreCommand` wired in this workspace's `vercel.json`; exit `0`
 * cancels, exit `1` continues.
 *
 * Rule (§10 truth table):
 *
 * - `VERCEL_GIT_COMMIT_REF !== 'main'` → continue (no file IO).
 * - `main`, current unresolvable → CANCEL with stderr diagnostic.
 * - `main`, previous unresolvable / unset → continue (no previous to
 *   beat; first build).
 * - `main`, current ≤ previous (semver.lte) → CANCEL.
 * - `main`, current \> previous → continue.
 *
 * Asymmetry rationale: current unresolvable is a deterministic repo
 * defect under Oak's single-root-package.json topology; previous
 * unresolvable is dominated by transient causes. The first amendment's
 * single fail-open clause is superseded by this asymmetry.
 */
export function runVercelIgnoreCommand(options) {
  const stdout = options.stdout ?? process.stdout;
  const stderr = options.stderr ?? process.stderr;
  const readFile = options.readFile ?? readFileSync;
  const executeGitCommand = options.executeGitCommand ?? runGitCommand;
  const env = options.env;
  const repositoryRoot = options.repositoryRoot;

  if (env.VERCEL_GIT_COMMIT_REF !== 'main') {
    const branchLabel = env.VERCEL_GIT_COMMIT_REF ?? '(unset)';
    stdout.write(
      `Branch is "${branchLabel}", not main; production cancellation gate skipped, build will continue.\n`,
    );
    return { exitCode: 1 };
  }

  const currentVersion = safeReadCurrentVersion(
    readFile,
    path.resolve(repositoryRoot, 'package.json'),
  );
  if (!currentVersion) {
    stderr.write(
      'The current app version could not be determined from the root package.json file. This is a build error; cancelling.\n',
    );
    return { exitCode: 0 };
  }

  const previousSha = trimToUndefined(env.VERCEL_GIT_PREVIOUS_SHA);
  const previousVersion = safeReadPreviousVersion(executeGitCommand, repositoryRoot, previousSha);

  if (previousVersion && lte(currentVersion, previousVersion)) {
    stdout.write(
      `Cancelling production build: root package.json version ${currentVersion} did not advance beyond previous deployed version ${previousVersion} (${previousSha}).\n`,
    );
    return { exitCode: 0 };
  }

  const previousLabel = previousVersion ?? 'unknown (treating as first build)';
  stdout.write(
    `Continuing production build: current=${currentVersion}, previous=${previousLabel}.\n`,
  );
  return { exitCode: 1 };
}

const thisFileUrl = import.meta.url;
const invokedUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : undefined;
if (thisFileUrl === invokedUrl) {
  const thisDir = path.dirname(fileURLToPath(thisFileUrl));
  const repositoryRoot = path.resolve(thisDir, '../../..');
  const result = runVercelIgnoreCommand({
    repositoryRoot,
    env: process.env,
  });
  process.exit(result.exitCode);
}
