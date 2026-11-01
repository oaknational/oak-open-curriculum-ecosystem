import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { renderJsonArtefact, sha256Hex } from './refounding-artefacts.js';
import {
  buildChallengeCommitment,
  parseChallengeCommitment,
  parseChallengeFindings,
  parseChallengeKeySet,
  scoreChallenge,
  type ChallengeScore,
} from './refound-challenge-model.js';

/**
 * The seal and score halves of `refound-plant-challenge-canary` (plan P4):
 * commit `sha256` of the dispatcher-held key set's exact bytes BEFORE the
 * batch, verify the reveal against that commitment AFTER it (a mismatch is
 * a REFUSAL, never a score — a swapped key set could launder a miss), and
 * judge the catch: the pass is `true` only when every planted loss was
 * caught. The plant half lives in `refound-challenge-helpers.ts`.
 *
 * @packageDocumentation
 */

const asMessage = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

/** Read + parse one JSON artefact through a strict boundary. */
async function readJsonFile<TValue>(
  label: string,
  absPath: string,
  parse: (value: unknown) => Result<TValue, Error>,
): Promise<Result<{ value: TValue; bytes: Buffer }, Error>> {
  let bytes: Buffer;
  try {
    bytes = await readFile(absPath);
  } catch (error: unknown) {
    return err(new Error(`cannot read ${label} at '${absPath}': ${asMessage(error)}`));
  }
  let json: unknown;
  try {
    json = JSON.parse(bytes.toString('utf8'));
  } catch (error: unknown) {
    return err(new Error(`${label} is not valid JSON: ${asMessage(error)}`));
  }
  const parsed = parse(json);
  if (isErr(parsed)) {
    return parsed;
  }
  return ok({ value: parsed.value, bytes });
}

/**
 * Seal mode: commit `sha256` of the key set's EXACT bytes. The key set
 * itself stays dispatcher-held; only the commitment travels with the batch.
 */
export async function runChallengeSeal(input: {
  readonly keysAbsPath: string;
  readonly commitmentAbsPath: string;
}): Promise<Result<{ readonly keySetSha256: string }, Error>> {
  const keys = await readJsonFile('challenge key set', input.keysAbsPath, parseChallengeKeySet);
  if (isErr(keys)) {
    return keys;
  }
  const commitment = buildChallengeCommitment(keys.value.bytes);
  try {
    await mkdir(path.dirname(input.commitmentAbsPath), { recursive: true });
    await writeFile(input.commitmentAbsPath, renderJsonArtefact(commitment), 'utf8');
  } catch (error: unknown) {
    return err(new Error(`commitment write failed: ${asMessage(error)}`));
  }
  return ok({ keySetSha256: commitment.keySetSha256 });
}

/**
 * Score mode: verify the reveal against the commitment FIRST (hash of the
 * revealed key-set bytes must equal the sealed hash), then score.
 */
export async function runChallengeScore(input: {
  readonly findingsAbsPath: string;
  readonly keysAbsPath: string;
  readonly commitmentAbsPath: string;
}): Promise<Result<ChallengeScore, Error>> {
  const commitment = await readJsonFile(
    'challenge commitment',
    input.commitmentAbsPath,
    parseChallengeCommitment,
  );
  if (isErr(commitment)) {
    return commitment;
  }
  const keys = await readJsonFile('challenge key set', input.keysAbsPath, parseChallengeKeySet);
  if (isErr(keys)) {
    return keys;
  }
  const revealedSha256 = sha256Hex(keys.value.bytes);
  if (revealedSha256 !== commitment.value.value.keySetSha256) {
    return err(
      new Error(
        `revealed key set does not match the sealed commitment — refusing to score ` +
          `(sealed ${commitment.value.value.keySetSha256}, revealed ${revealedSha256})`,
      ),
    );
  }
  if (keys.value.value.plantedBlockIds.length === 0) {
    return err(
      new Error(
        'revealed key set contains no planted ids — a vacuous challenge proves nothing (P4); ' +
          'refusing to score',
      ),
    );
  }
  const findings = await readJsonFile(
    'challenge findings',
    input.findingsAbsPath,
    parseChallengeFindings,
  );
  if (isErr(findings)) {
    return findings;
  }
  return ok(
    scoreChallenge({
      plantedBlockIds: keys.value.value.plantedBlockIds,
      findingBlockIds: findings.value.value.lossBlockIds,
    }),
  );
}
