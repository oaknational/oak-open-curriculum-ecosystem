import { mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { renderJsonArtefact, renderJsonlArtefact } from './refounding-artefacts.js';
import { writeArtefactSet } from './refound-artefact-writes.js';
import {
  buildChallengeKeySet,
  CHALLENGE_STREAM_SEGMENT,
  derivePlantedVariant,
  parseChallengeLedgerRow,
  selectDonorRow,
  selectPlantedBlockIds,
  type ChallengeLedgerRow,
  type ChallengeStreamRow,
} from './refound-challenge-model.js';

/**
 * The plant half of `refound-plant-challenge-canary` (plan P4, cross-estate
 * review B1): read a ledger-rows fixture, deterministically derive the
 * plausible-but-wrong planted variants at the declared salted rate, and
 * write the challenge stream (planted bindings re-pointed, no key material,
 * no salt) plus the dispatcher-held key set. The key set goes to the
 * CALLER-NAMED `keysOutAbsPath` — there is deliberately no default adjacent
 * to the stream, because the keys (and the salt inside them) must sit
 * OUTSIDE the challenge fleet's read scope. The seal/score halves live in
 * `refound-challenge-scoring.ts`.
 *
 * @packageDocumentation
 */

const asMessage = (cause: unknown): string =>
  cause instanceof Error ? cause.message : String(cause);

/** Parse one non-empty ledger JSONL line through the strict boundary. */
function parseLedgerLine(line: string, lineNumber: number): Result<ChallengeLedgerRow, Error> {
  let json: unknown;
  try {
    json = JSON.parse(line);
  } catch (error: unknown) {
    return err(
      new Error(`ledger line ${String(lineNumber)} is not valid JSON: ${asMessage(error)}`),
    );
  }
  const row = parseChallengeLedgerRow(json);
  if (isErr(row)) {
    return err(new Error(`ledger line ${String(lineNumber)}: ${row.error.message}`));
  }
  return row;
}

/** Read and strictly parse a ledger-rows JSONL file, refusing duplicates. */
async function readLedgerRows(
  ledgerAbsPath: string,
): Promise<Result<readonly ChallengeLedgerRow[], Error>> {
  let text: string;
  try {
    text = await readFile(ledgerAbsPath, 'utf8');
  } catch (error: unknown) {
    return err(new Error(`cannot read ledger at '${ledgerAbsPath}': ${asMessage(error)}`));
  }
  const rows: ChallengeLedgerRow[] = [];
  const seen = new Set<string>();
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (line === '') {
      continue;
    }
    const row = parseLedgerLine(line, index + 1);
    if (isErr(row)) {
      return row;
    }
    if (seen.has(row.value.block_id)) {
      return err(new Error(`ledger carries a duplicate block_id: '${row.value.block_id}'`));
    }
    seen.add(row.value.block_id);
    rows.push(row.value);
  }
  return ok(rows);
}

/** What plant mode produced, for the entry's operator summary. */
export interface ChallengePlantSummary {
  readonly rows: number;
  readonly planted: number;
}

/** Build the stream rows: planted rows re-pointed at salted donor spans. */
function buildStreamRows(input: {
  readonly rows: readonly ChallengeLedgerRow[];
  readonly plantedIds: readonly string[];
  readonly salt: string;
}): Result<readonly ChallengeStreamRow[], Error> {
  const plantedSet = new Set(input.plantedIds);
  const streamRows: ChallengeStreamRow[] = [];
  for (const row of input.rows) {
    if (!plantedSet.has(row.block_id)) {
      streamRows.push(row);
      continue;
    }
    const donor = selectDonorRow({ rows: input.rows, row, salt: input.salt });
    if (isErr(donor)) {
      return donor;
    }
    streamRows.push(derivePlantedVariant(row, donor.value));
  }
  return ok(streamRows);
}

/** Refuse a rate outside (0, 100] or the empty (recomputable, M5) salt. */
function checkRateAndSalt(ratePercent: number, salt: string): Result<void, Error> {
  if (!Number.isFinite(ratePercent) || ratePercent <= 0 || ratePercent > 100) {
    return err(new Error('--rate must be a percentage greater than 0 and at most 100'));
  }
  if (salt === '') {
    return err(
      new Error(
        '--salt must be non-empty: an unsalted selection is recomputable from the stream and ' +
          'rate alone (M5); the salt seals with the key set',
      ),
    );
  }
  return ok(undefined);
}

/**
 * Plant mode: derive the challenge stream + dispatcher-held key set at the
 * declared salted rate. Refuses a rate outside (0, 100], an empty salt (an
 * unsalted selection is publicly recomputable — the M5 contamination hole),
 * and a selection that plants nothing — a batch whose challenge carries
 * zero plants cannot prove its challengers can see (P4). `keysOutAbsPath`
 * is caller-named and must sit outside the challenge fleet's read scope.
 */
export async function runChallengePlant(input: {
  readonly ledgerAbsPath: string;
  readonly ratePercent: number;
  readonly salt: string;
  readonly outDirAbs: string;
  readonly keysOutAbsPath: string;
}): Promise<Result<ChallengePlantSummary, Error>> {
  const guarded = checkRateAndSalt(input.ratePercent, input.salt);
  if (isErr(guarded)) {
    return guarded;
  }
  const rows = await readLedgerRows(input.ledgerAbsPath);
  if (isErr(rows)) {
    return rows;
  }
  if (rows.value.length === 0) {
    return err(new Error('the ledger carries no rows; nothing to challenge'));
  }
  const plantedIds = selectPlantedBlockIds(
    rows.value.map((row) => row.block_id),
    input.ratePercent,
    input.salt,
  );
  if (plantedIds.length === 0) {
    return err(
      new Error(
        `rate ${String(input.ratePercent)}% selected no rows to plant — a plant-free challenge ` +
          'is vacuous (P4); raise the rate',
      ),
    );
  }
  const streamRows = buildStreamRows({ rows: rows.value, plantedIds, salt: input.salt });
  if (isErr(streamRows)) {
    return streamRows;
  }
  const written = await writePlantArtefacts({
    outDirAbs: input.outDirAbs,
    keysOutAbsPath: input.keysOutAbsPath,
    streamRows: streamRows.value,
    plantedIds,
    ratePercent: input.ratePercent,
    salt: input.salt,
  });
  if (isErr(written)) {
    return written;
  }
  return ok({ rows: rows.value.length, planted: plantedIds.length });
}

/** Write the challenge stream and the caller-located key set. */
async function writePlantArtefacts(input: {
  readonly outDirAbs: string;
  readonly keysOutAbsPath: string;
  readonly streamRows: readonly ChallengeStreamRow[];
  readonly plantedIds: readonly string[];
  readonly ratePercent: number;
  readonly salt: string;
}): Promise<Result<void, Error>> {
  const keySet = buildChallengeKeySet({
    ratePercent: input.ratePercent,
    salt: input.salt,
    plantedBlockIds: input.plantedIds,
  });
  const streamAbsPath = path.join(input.outDirAbs, CHALLENGE_STREAM_SEGMENT);
  try {
    await mkdir(path.dirname(streamAbsPath), { recursive: true });
    await mkdir(path.dirname(input.keysOutAbsPath), { recursive: true });
  } catch (error: unknown) {
    return err(new Error(`challenge artefact write failed: ${asMessage(error)}`));
  }
  const written = await writeArtefactSet([
    { absPath: streamAbsPath, content: renderJsonlArtefact(input.streamRows) },
    { absPath: input.keysOutAbsPath, content: renderJsonArtefact(keySet) },
  ]);
  if (isErr(written)) {
    return err(new Error(`challenge ${written.error.message}`));
  }
  return ok(undefined);
}
