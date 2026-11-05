#!/usr/bin/env node

import path from 'node:path';
import { pathToFileURL } from 'node:url';

import { isErr, ok, type Result } from '@oaknational/result';

import { resolveRepoRoot } from '../core/repo-root.js';
import { writeErrorLine, writeLine } from '../core/terminal-output.js';
import { freezeUsageText, parseFreezeArgs, type FreezeArgs } from './refound-freeze-args.js';
import { validateOutDirChoice, type SecretScan } from './refound-freeze-helpers.js';
import { makeGitleaksSecretScan, probeGitleaksVersion } from './refound-gitleaks.js';
import { runFreeze } from './refound-freeze-runner.js';
import {
  resolveReadPathWithinRepo,
  resolveWriteTargetWithinRepo,
} from '../core/flag-path-resolve.js';

/**
 * `refound-freeze` — the plan-corpus refounding's S0 conservation event
 * (F1 §5 row 1).
 *
 * Copies every file the ratified freeze rule marks `in` byte-verbatim under
 * `<out>/archive/frozen-v1/`, derives `denominator.v1.json`, and writes
 * `proofs/freeze-identity.v1.json`, refusing outright — nothing written —
 * when the rule is unratified, when the secret scan reports a hit, or when a
 * non-empty frozen tree already exists. The S0 commit itself is staged by
 * explicit pathspec by the operating agent; this script never runs git.
 *
 * Flags: `--rule <path>` (default `.agent/plans-refounding/freeze-rule.json`)
 * and `--out <dir>` (default `.agent/plans-refounding`), both constrained to
 * the repository with read/write-appropriate resolution
 * (`flag-path-resolve.ts`).
 *
 * @packageDocumentation
 */

const TOOL = 'refound-freeze';
const repoRoot = resolveRepoRoot(import.meta.url);

/**
 * Resolve the out dir against the repo root and constrain it there WITHOUT
 * creating anything (`resolveWriteTargetWithinRepo`: lexical containment,
 * then the symlink-resolving assertion on the nearest EXISTING ancestor).
 * Directory creation is deferred to the freeze runner's write phase, after
 * every refusal has passed.
 */
function resolveOutDir(outDirFlag: string): Result<string, Error> {
  const outDirAbs = resolveWriteTargetWithinRepo(repoRoot, outDirFlag);
  if (isErr(outDirAbs)) {
    return outDirAbs;
  }
  const choiceVerdict = validateOutDirChoice(repoRoot, outDirAbs.value);
  if (isErr(choiceVerdict)) {
    return choiceVerdict;
  }
  return outDirAbs;
}

/** Constrain the rule path (which must already exist) to the repository. */
function resolveRulePath(rulePathFlag: string): Result<string, Error> {
  return resolveReadPathWithinRepo(repoRoot, rulePathFlag);
}

/** Resolve and constrain both flag-supplied paths against the repo root. */
function resolvePaths(args: FreezeArgs): Result<{ ruleAbsPath: string; outDirAbs: string }, Error> {
  const ruleAbsPath = resolveRulePath(args.rulePath);
  if (isErr(ruleAbsPath)) {
    return ruleAbsPath;
  }
  const outDirAbs = resolveOutDir(args.outDir);
  if (isErr(outDirAbs)) {
    return outDirAbs;
  }
  return ok({ ruleAbsPath: ruleAbsPath.value, outDirAbs: outDirAbs.value });
}

/** Everything `runFreeze` needs, proven refusal-free before it starts. */
interface FreezeSetup {
  readonly ruleAbsPath: string;
  readonly outDirAbs: string;
  readonly secretScan: SecretScan;
}

/** Resolve both flag paths AND prepare the scanner; refusals are `Err`. */
function prepareFreeze(args: FreezeArgs): Result<FreezeSetup, Error> {
  const paths = resolvePaths(args);
  if (isErr(paths)) {
    return paths;
  }
  const secretScan = prepareSecretScan();
  if (isErr(secretScan)) {
    return secretScan;
  }
  return ok({ ...paths.value, secretScan: secretScan.value });
}

/**
 * Probe the scanner's version and report the attestation line; any refusal
 * surfaces as `Err` before the freeze starts.
 */
function prepareSecretScan(): Result<SecretScan, Error> {
  const gitleaksVersion = probeGitleaksVersion(repoRoot);
  if (isErr(gitleaksVersion)) {
    return gitleaksVersion;
  }
  writeLine(`${TOOL}: secret scan by gitleaks ${gitleaksVersion.value}`);
  return ok(makeGitleaksSecretScan(repoRoot));
}

async function main(): Promise<void> {
  const args = parseFreezeArgs(process.argv.slice(2), TOOL);
  if (isErr(args)) {
    writeErrorLine(`${TOOL}: ${args.error.message}`);
    process.exitCode = 1;
    return;
  }
  if (args.value.help) {
    writeLine(freezeUsageText(TOOL));
    return;
  }
  const setup = prepareFreeze(args.value);
  if (isErr(setup)) {
    writeErrorLine(`${TOOL}: ${setup.error.message}`);
    process.exitCode = 1;
    return;
  }
  const frozen = await runFreeze({ repoRoot, ...setup.value });
  if (isErr(frozen)) {
    writeErrorLine(`${TOOL}: ${frozen.error.message}`);
    process.exitCode = 1;
    return;
  }
  writeLine(
    `${TOOL}: froze ${String(frozen.value.fileCount)} file(s), ` +
      `${String(frozen.value.totalLines)} line(s), ${String(frozen.value.totalBytes)} byte(s); ` +
      `denominator and freeze-identity proof written under ${args.value.outDir}.`,
  );
  writeLine(`${TOOL}: stage the S0 commit by explicit pathspec (the script never commits).`);
}

/** True when this module is the process's CLI entry (repo-check.ts pattern). */
function isCliEntryPoint(): boolean {
  const entryPoint = process.argv[1];
  if (entryPoint === undefined) {
    return false;
  }
  return import.meta.url === pathToFileURL(path.resolve(entryPoint)).href;
}

if (isCliEntryPoint()) {
  await main();
}
