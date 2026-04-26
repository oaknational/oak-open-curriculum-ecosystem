#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// Vercel runs this script as the ignoreCommand BEFORE pnpm install, so it
// must depend on Node built-ins only. Inline semver parsing covers the §10
// truth-table semantics: a strict X.Y.Z (with optional prerelease + build
// metadata per semver §2) and a `lte` comparison that follows semver §11
// precedence rules. Build-metadata is ignored in precedence per the spec.
//
// @see ../../../../packages/core/build-metadata/src/semver.ts —
// canonical npm-`semver`-backed implementation. The two implementations
// MUST stay byte-equivalent on the regex pattern and behaviour-equivalent
// on validity + ≤ comparison; the parity test at
// `packages/core/build-metadata/tests/semver-parity.test.ts` is the
// anti-drift gate.
const SEMVER_PATTERN =
  /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

function parseSemver(version) {
  const match = SEMVER_PATTERN.exec(version);
  if (!match) {
    return null;
  }
  const [, major, minor, patch, prerelease] = match;
  return {
    major: Number(major),
    minor: Number(minor),
    patch: Number(patch),
    prerelease: prerelease ? prerelease.split('.') : [],
  };
}

function isValidSemver(version) {
  return parseSemver(version) !== null;
}

function comparePrereleaseIdentifiers(a, b) {
  const aIsNumeric = /^\d+$/.test(a);
  const bIsNumeric = /^\d+$/.test(b);
  if (aIsNumeric && bIsNumeric) {
    const aNumber = Number(a);
    const bNumber = Number(b);
    if (aNumber < bNumber) {
      return -1;
    }
    if (aNumber > bNumber) {
      return 1;
    }
    return 0;
  }
  if (aIsNumeric) {
    return -1;
  }
  if (bIsNumeric) {
    return 1;
  }
  if (a < b) {
    return -1;
  }
  if (a > b) {
    return 1;
  }
  return 0;
}

function comparePrereleaseArrays(a, b) {
  const length = Math.min(a.length, b.length);
  for (let index = 0; index < length; index += 1) {
    const result = comparePrereleaseIdentifiers(a[index], b[index]);
    if (result !== 0) {
      return result;
    }
  }
  if (a.length < b.length) {
    return -1;
  }
  if (a.length > b.length) {
    return 1;
  }
  return 0;
}

function isLessThanOrEqual(currentVersion, previousVersion) {
  const current = parseSemver(currentVersion);
  const previous = parseSemver(previousVersion);
  if (!current || !previous) {
    return false;
  }
  for (const key of ['major', 'minor', 'patch']) {
    if (current[key] < previous[key]) {
      return true;
    }
    if (current[key] > previous[key]) {
      return false;
    }
  }
  // Major/minor/patch are equal — apply semver §11 prerelease precedence:
  // a version with prerelease has lower precedence than one without.
  if (current.prerelease.length === 0 && previous.prerelease.length === 0) {
    return true;
  }
  if (current.prerelease.length > 0 && previous.prerelease.length === 0) {
    return true;
  }
  if (current.prerelease.length === 0 && previous.prerelease.length > 0) {
    return false;
  }
  return comparePrereleaseArrays(current.prerelease, previous.prerelease) <= 0;
}

function trimToUndefined(value) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : undefined;
}

function safeReadCurrentVersion(readFile, packageJsonPath) {
  try {
    const parsed = JSON.parse(readFile(packageJsonPath, 'utf8'));
    const version = trimToUndefined(parsed.version);
    return version && isValidSemver(version) ? version : undefined;
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
    return previousVersion && isValidSemver(previousVersion) ? previousVersion : undefined;
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
 * - `main`, current ≤ previous (semver-precedence) → CANCEL.
 * - `main`, current \> previous → continue.
 *
 * Asymmetry rationale: current unresolvable is a deterministic repo
 * defect under Oak's single-root-package.json topology; previous
 * unresolvable is dominated by transient causes. The first amendment's
 * single fail-open clause is superseded by this asymmetry.
 *
 * Dependency posture: this script runs as Vercel's `ignoreCommand`,
 * which executes BEFORE `pnpm install`. It MUST therefore depend only
 * on Node built-ins. Semver validation and precedence comparison are
 * inlined above per semver.org §2 / §11.
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

  if (previousVersion && isLessThanOrEqual(currentVersion, previousVersion)) {
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
