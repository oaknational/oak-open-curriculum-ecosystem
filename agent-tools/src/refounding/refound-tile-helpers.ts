import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { compareByCodeUnit, type DenominatorFile } from './refounding-artefacts.js';
import {
  LEDGER_DIR_SEGMENT,
  groupFilesByArea,
  ledgerBasenameForArea,
  parseLedgerJsonl,
  type LedgerRow,
} from './refound-ledger-row.js';
import { collectAnchorsForFiles } from './refound-anchor-map.js';
import { readInventoryRecords } from './refound-inventory-read.js';
import {
  findCrossAreaDuplicateIds,
  verifyExactCover,
  type TiledFileInput,
} from './refound-tile-model.js';
import { sortTilingViolations, type TilingViolation } from './refound-tile-violations.js';
import { readEffectiveDenominator } from './refound-verify-freeze-helpers.js';

/**
 * The IO orchestration of `refound-tile` (F1 §5 row `refound-tile`, D5).
 *
 * @remarks
 * Tile is a VERIFIER ONLY: read-only over the effective denominator
 * (`v1 + all amendments`), the committed inventory, and the per-area ledger
 * files — it writes NOTHING, ever. Each area's ledger is verified against
 * exactly its own denominator slice (a row citing another area's file is an
 * `unknown-file` violation, never a skip), and a global run additionally
 * checks block-id uniqueness ACROSS areas.
 *
 * Refusals (`Err`, nothing computed) vs RED violations (`Ok` with
 * violations, exit 1 at the entry) stay distinct exactly as in
 * `refound-verify-freeze`. Refusals: a missing/unparseable/strict-invalid
 * denominator; any amendment lacking its identity proof (F1 §7 verbatim, via
 * the merge); a missing/unparseable inventory; a denominator↔inventory
 * disagreement (layer halt); a malformed ledger line (cited by artefact file
 * + line); an `--area` matching no denominator file; and a requested area
 * whose ledger file is ABSENT — absent means "not yet tiled" and is NEVER
 * conflated with an EMPTY ledger file, which is a computed RED total-gap
 * verdict.
 *
 * @packageDocumentation
 */

/** The recomputed tiling verdict over the requested scope. */
export interface TileReport {
  readonly areas: number;
  readonly files: number;
  readonly rows: number;
  readonly violations: readonly TilingViolation[];
}

/** One area's denominator slice paired with its parsed ledger rows. */
interface AreaSlice {
  readonly area: string;
  readonly files: readonly DenominatorFile[];
  readonly rows: readonly LedgerRow[];
}

/** Read one area's ledger; ENOENT is the "not yet tiled" refusal. */
async function readAreaLedger(
  outDirAbs: string,
  area: string,
): Promise<Result<readonly LedgerRow[], Error>> {
  const basename = ledgerBasenameForArea(area);
  const label = `${LEDGER_DIR_SEGMENT}/${basename}`;
  let text: string;
  try {
    text = await readFile(path.join(outDirAbs, LEDGER_DIR_SEGMENT, basename), 'utf8');
  } catch (error: unknown) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      return err(
        new Error(
          `area '${area}' is not yet tiled: no ledger file at ${label} — an ABSENT ledger is a ` +
            'refusal, never an empty (RED) verdict',
        ),
      );
    }
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read ${label}: ${message}`));
  }
  return parseLedgerJsonl(label, text);
}

/** Resolve the target areas: the requested one, or every denominator area. */
function resolveTargetAreas(
  byArea: ReadonlyMap<string, readonly DenominatorFile[]>,
  area: string | undefined,
): Result<readonly string[], Error> {
  if (area === undefined) {
    return ok([...byArea.keys()].sort(compareByCodeUnit));
  }
  if (!byArea.has(area)) {
    return err(new Error(`--area '${area}' matches no denominator file`));
  }
  return ok([area]);
}

/** Read every target area's slice (denominator files + ledger rows). */
async function readAreaSlices(input: {
  readonly outDirAbs: string;
  readonly byArea: ReadonlyMap<string, readonly DenominatorFile[]>;
  readonly targetAreas: readonly string[];
}): Promise<Result<readonly AreaSlice[], Error>> {
  const slices: AreaSlice[] = [];
  for (const area of input.targetAreas) {
    const rows = await readAreaLedger(input.outDirAbs, area);
    if (isErr(rows)) {
      return rows;
    }
    slices.push({ area, files: input.byArea.get(area) ?? [], rows: rows.value });
  }
  return ok(slices);
}

/** Verify each slice against its own area, then cross-area id uniqueness. */
function verifySlices(
  slices: readonly AreaSlice[],
  anchorsByFile: ReadonlyMap<string, readonly number[]>,
): readonly TilingViolation[] {
  const violations: TilingViolation[] = [];
  for (const slice of slices) {
    const files: TiledFileInput[] = slice.files.map((file) => ({
      path: file.path,
      lines: file.lines,
      inventoryMode: file.inventory_mode,
      anchorLines: anchorsByFile.get(file.path) ?? [],
    }));
    violations.push(...verifyExactCover({ files, rows: slice.rows }));
  }
  if (slices.length > 1) {
    violations.push(
      ...findCrossAreaDuplicateIds(new Map(slices.map((slice) => [slice.area, slice.rows]))),
    );
  }
  return sortTilingViolations(violations);
}

/**
 * Execute the tiling verification over a committed artefact home: effective
 * denominator + inventory + ledgers in, a recomputed {@link TileReport} out,
 * nothing written.
 */
export async function runTile(input: {
  readonly outDirAbs: string;
  readonly area?: string;
}): Promise<Result<TileReport, Error>> {
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
  const byArea = groupFilesByArea(denominator.value.files);
  if (isErr(byArea)) {
    return byArea;
  }
  const targetAreas = resolveTargetAreas(byArea.value, input.area);
  if (isErr(targetAreas)) {
    return targetAreas;
  }
  const slices = await readAreaSlices({
    outDirAbs: input.outDirAbs,
    byArea: byArea.value,
    targetAreas: targetAreas.value,
  });
  if (isErr(slices)) {
    return slices;
  }
  return ok({
    areas: slices.value.length,
    files: slices.value.reduce((total, slice) => total + slice.files.length, 0),
    rows: slices.value.reduce((total, slice) => total + slice.rows.length, 0),
    violations: verifySlices(slices.value, anchorsByFile.value),
  });
}
