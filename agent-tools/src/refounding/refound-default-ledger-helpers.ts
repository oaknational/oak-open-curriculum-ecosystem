import { access, mkdir } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { compareByCodeUnit, renderJsonlArtefact } from './refounding-artefacts.js';
import { writeArtefactSet, type ArtefactWrite } from './refound-artefact-writes.js';
import { collectAnchorsForFiles } from './refound-anchor-map.js';
import { buildDefaultLedgerRows } from './refound-default-ledger-model.js';
import { LEDGER_DIR_SEGMENT, ledgerBasenameForArea, type LedgerRow } from './refound-ledger-row.js';
import { readInventoryRecords } from './refound-inventory-read.js';
import { readEffectiveDenominator } from './refound-verify-freeze-helpers.js';

/**
 * The IO orchestration of the default-ledger emitter: effective denominator
 * + inventory in, one `ledger/<area>.ledger.jsonl` of sentinel
 * `default-block` rows per area out — the S2 starting state `refound-tile`
 * verifies.
 *
 * @remarks
 * Refusals — typed `Err`, NOTHING written: missing/invalid denominator or
 * inventory, any amendment lacking its identity proof (via the effective
 * merge), a denominator↔inventory layer disagreement (the same halt the
 * tile applies), and ANY pre-existing target ledger file — a ledger may
 * carry judgement-bearing rows, and overwriting judgement with sentinels
 * would be destruction, so every target is existence-checked BEFORE the
 * first write. Output is byte-stable for identical inputs: sorted files,
 * ascending blocks, `renderJsonlArtefact`, no timestamps.
 *
 * @packageDocumentation
 */

/** What the emitter derived and wrote, for the entry's operator summary. */
export interface DefaultLedgerSummary {
  readonly areas: number;
  readonly rows: number;
}

/** Refuse when any target ledger already exists (checked before ANY write). */
async function refuseExistingLedgers(
  ledgerDirAbs: string,
  areas: readonly string[],
): Promise<Result<void, Error>> {
  for (const area of areas) {
    const basename = ledgerBasenameForArea(area);
    try {
      await access(path.join(ledgerDirAbs, basename));
    } catch {
      continue;
    }
    return err(
      new Error(
        `refusing to overwrite existing ledger ${LEDGER_DIR_SEGMENT}/${basename} — a ledger may ` +
          'carry judgement-bearing rows; remove or route it deliberately, never by emitter',
      ),
    );
  }
  return ok(undefined);
}

/**
 * Execute the emitter: derive every area's default rows, refuse before any
 * write, then write each area's ledger.
 */
export async function runDefaultLedger(input: {
  readonly outDirAbs: string;
}): Promise<Result<DefaultLedgerSummary, Error>> {
  const denominator = await readEffectiveDenominator(input.outDirAbs);
  if (isErr(denominator)) {
    return denominator;
  }
  const records = await readInventoryRecords(input.outDirAbs);
  if (isErr(records)) {
    return records;
  }
  const anchorsByFile = collectAnchorsForFiles({
    files: denominator.value.files.filter((file) => file.inventory_mode === 'lines'),
    records: records.value,
  });
  if (isErr(anchorsByFile)) {
    return anchorsByFile;
  }
  const rowsByArea = buildDefaultLedgerRows({
    files: denominator.value.files,
    anchorsByFile: anchorsByFile.value,
  });
  if (isErr(rowsByArea)) {
    return rowsByArea;
  }
  const ledgerDirAbs = path.join(input.outDirAbs, LEDGER_DIR_SEGMENT);
  const areas = [...rowsByArea.value.keys()].sort(compareByCodeUnit);
  const existing = await refuseExistingLedgers(ledgerDirAbs, areas);
  if (isErr(existing)) {
    return existing;
  }
  return writeLedgers({ ledgerDirAbs, areas, rowsByArea: rowsByArea.value });
}

/**
 * Write every area ledger all-or-nothing: a failed write rolls back the
 * ledgers this run wrote, so a partial ledger set never survives to brick a
 * rerun on the existing-ledger refusal.
 */
async function writeLedgers(input: {
  readonly ledgerDirAbs: string;
  readonly areas: readonly string[];
  readonly rowsByArea: ReadonlyMap<string, readonly LedgerRow[]>;
}): Promise<Result<DefaultLedgerSummary, Error>> {
  try {
    await mkdir(input.ledgerDirAbs, { recursive: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`default-ledger write failed: ${message}`));
  }
  let rowCount = 0;
  const writes: ArtefactWrite[] = [];
  for (const area of input.areas) {
    const rows = input.rowsByArea.get(area) ?? [];
    writes.push({
      absPath: path.join(input.ledgerDirAbs, ledgerBasenameForArea(area)),
      content: renderJsonlArtefact(rows),
    });
    rowCount += rows.length;
  }
  const written = await writeArtefactSet(writes);
  if (isErr(written)) {
    return written;
  }
  return ok({ areas: input.areas.length, rows: rowCount });
}
