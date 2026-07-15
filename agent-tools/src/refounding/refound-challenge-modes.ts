import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { runChallengePlant } from './refound-challenge-helpers.js';
import { entryUsageText } from './refound-entry-args.js';
import {
  CHALLENGE_COMMITMENT_SEGMENT,
  CHALLENGE_STREAM_SEGMENT,
  type ChallengeScore,
} from './refound-challenge-model.js';
import { runChallengeScore, runChallengeSeal } from './refound-challenge-scoring.js';
import { resolveReadPathWithinRepo, resolveWriteTargetWithinRepo } from './refound-path-resolve.js';

/**
 * The three CLI modes of `refound-plant-challenge-canary` as
 * operator-message-producing functions, parameterised by the repo root so
 * the entry point stays thin. Every flag-supplied path is constrained to
 * the repository with read/write-appropriate resolution
 * (`refound-path-resolve.ts`): inputs must exist and canonicalise; output
 * paths need not exist — the modes create them. The key set NEVER has a
 * default location adjacent to the stream: `--keys-out` (plant) and
 * `--keys` (seal/score) are REQUIRED, because the keys and the sealed salt
 * inside them must sit outside the challenge fleet's read scope.
 *
 * @packageDocumentation
 */

/** The parsed canary CLI flags (empty string = flag not supplied). */
export interface CanaryArgs {
  mode: string;
  ledgerPath: string;
  rate: string;
  salt: string;
  outDir: string;
  keysOutPath: string;
  keysPath: string;
  commitmentPath: string;
  findingsPath: string;
}

/** The shared usage line, appended to every mode's flag error. */
export const CANARY_USAGE = entryUsageText(
  'refound-plant-challenge-canary',
  '--mode <plant|seal|score> ' +
    '[--ledger <path>] [--rate <percent>] [--salt <value>] [--keys-out <path>] ' +
    '[--findings <path>] [--keys <path>] [--commitment <path>] [--out <dir>]',
);

/**
 * Resolve a mode file path: explicit flag override, else the out-dir
 * default. `resolveWithin` names the read/write semantics: the commitment
 * is a WRITE target in seal mode but a READ target in score mode.
 */
function resolveArtefactPath(
  repoRoot: string,
  override: string,
  outDir: string,
  segment: string,
  resolveWithin: (repoRoot: string, flagPath: string) => Result<string, Error>,
): Result<string, Error> {
  return resolveWithin(repoRoot, override === '' ? path.join(outDir, segment) : override);
}

/**
 * Plant mode: derive the challenge stream + dispatcher-held key set.
 * `--keys-out` is REQUIRED and has no default adjacent to the stream: the
 * key set (planted ids + sealed salt) sits outside the challenge fleet's
 * read scope.
 */
export async function runPlantMode(
  repoRoot: string,
  args: CanaryArgs,
): Promise<Result<string, Error>> {
  const requiredFlags = [args.ledgerPath, args.rate, args.salt, args.keysOutPath];
  if (requiredFlags.includes('')) {
    return err(
      new Error(`plant mode requires --ledger, --rate, --salt, and --keys-out\n\n${CANARY_USAGE}`),
    );
  }
  const ledgerAbsPath = resolveReadPathWithinRepo(repoRoot, args.ledgerPath);
  if (isErr(ledgerAbsPath)) {
    return ledgerAbsPath;
  }
  const outDirAbs = resolveWriteTargetWithinRepo(repoRoot, args.outDir);
  if (isErr(outDirAbs)) {
    return outDirAbs;
  }
  const keysOutAbsPath = resolveWriteTargetWithinRepo(repoRoot, args.keysOutPath);
  if (isErr(keysOutAbsPath)) {
    return keysOutAbsPath;
  }
  const summary = await runChallengePlant({
    ledgerAbsPath: ledgerAbsPath.value,
    ratePercent: Number(args.rate),
    salt: args.salt,
    outDirAbs: outDirAbs.value,
    keysOutAbsPath: keysOutAbsPath.value,
  });
  if (isErr(summary)) {
    return summary;
  }
  return ok(
    `planted ${String(summary.value.planted)} of ${String(summary.value.rows)} row(s); ` +
      `stream at ${path.relative(repoRoot, path.join(outDirAbs.value, CHALLENGE_STREAM_SEGMENT))}, ` +
      `KEY SET at ${args.keysOutPath} ` +
      `(dispatcher-held — keep it outside the challenge fleet's read scope); ` +
      `seal it before the batch.`,
  );
}

/** Seal mode: commit sha256 of the key set's exact bytes, pre-batch. */
export async function runSealMode(
  repoRoot: string,
  args: CanaryArgs,
): Promise<Result<string, Error>> {
  if (args.keysPath === '') {
    return err(
      new Error(
        `seal mode requires --keys (the key set has no default location)\n\n${CANARY_USAGE}`,
      ),
    );
  }
  const keysAbsPath = resolveReadPathWithinRepo(repoRoot, args.keysPath);
  if (isErr(keysAbsPath)) {
    return keysAbsPath;
  }
  const commitmentAbsPath = resolveArtefactPath(
    repoRoot,
    args.commitmentPath,
    args.outDir,
    CHALLENGE_COMMITMENT_SEGMENT,
    resolveWriteTargetWithinRepo,
  );
  if (isErr(commitmentAbsPath)) {
    return commitmentAbsPath;
  }
  const sealed = await runChallengeSeal({
    keysAbsPath: keysAbsPath.value,
    commitmentAbsPath: commitmentAbsPath.value,
  });
  if (isErr(sealed)) {
    return sealed;
  }
  return ok(
    `sealed key set (sha256 ${sealed.value.keySetSha256}) into ` +
      `${path.relative(repoRoot, commitmentAbsPath.value)}; ` +
      `commit the commitment BEFORE the batch runs.`,
  );
}

/** Score mode: verify the reveal against the seal, then judge the catch. */
export async function runScoreMode(
  repoRoot: string,
  args: CanaryArgs,
): Promise<Result<string, Error>> {
  if (args.findingsPath === '' || args.keysPath === '') {
    return err(
      new Error(
        `score mode requires --findings and --keys (the key set has no default ` +
          `location)\n\n${CANARY_USAGE}`,
      ),
    );
  }
  const findingsAbsPath = resolveReadPathWithinRepo(repoRoot, args.findingsPath);
  if (isErr(findingsAbsPath)) {
    return findingsAbsPath;
  }
  const keysAbsPath = resolveReadPathWithinRepo(repoRoot, args.keysPath);
  if (isErr(keysAbsPath)) {
    return keysAbsPath;
  }
  const commitmentAbsPath = resolveArtefactPath(
    repoRoot,
    args.commitmentPath,
    args.outDir,
    CHALLENGE_COMMITMENT_SEGMENT,
    resolveReadPathWithinRepo,
  );
  if (isErr(commitmentAbsPath)) {
    return commitmentAbsPath;
  }
  const score = await runChallengeScore({
    findingsAbsPath: findingsAbsPath.value,
    keysAbsPath: keysAbsPath.value,
    commitmentAbsPath: commitmentAbsPath.value,
  });
  if (isErr(score)) {
    return score;
  }
  return scoreVerdictMessage(score.value);
}

/** Render the scored verdict: RED (a miss) is an error, GREEN a message. */
function scoreVerdictMessage(score: ChallengeScore): Result<string, Error> {
  const caught = String(score.caught.length);
  const unplanted = String(score.unplantedFindings.length);
  if (!score.pass) {
    return err(
      new Error(
        `challenge RED — planted loss(es) MISSED: ${score.missed.join(', ')} ` +
          `(caught ${caught}; unplanted findings ${unplanted}). ` +
          'The batch challenge pass is not acceptable (P4).',
      ),
    );
  }
  return ok(
    `challenge GREEN — all ${caught} planted loss(es) caught; ` +
      `${unplanted} unplanted finding(s) routed to adjudication as real loss candidates.`,
  );
}
