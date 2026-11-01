import { err, isErr, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';
import { type DenominatorFile } from './refounding-artefacts.js';

/**
 * The canonical v1 ledger-row schema and the shared ledger coordinate rules
 * (F1 §3), consolidated here at the second consumer: `refound-tile` and the
 * default-ledger emitter read/write rows through this module, and
 * `refound-challenge-model.ts` layers its own boundary on top of it.
 *
 * @remarks
 * **The seven fields are the whole v1 row** — closed shape
 * (`strict-validation-at-boundary`). F2's verification fields and F3's
 * challenge fields are NOT speculatively reserved here: a field addition is
 * a versioned schema change that lands WITH its consumer
 * (`closed-shape-design-optionality`), never an optional placeholder.
 *
 * **`binding` and `home` may be EMPTY at the row layer.** The non-empty
 * `binding` requirement is a CHALLENGE-boundary rule (an input row with no
 * binding would be indistinguishable from a plant), not a row-schema rule —
 * mechanical sentinel rows (`default-block`) legitimately carry neither a
 * home nor a binding, and the challenge boundary refuses them.
 *
 * **`block_id` rule (BINDING).** Ids are COORDINATE-DERIVED from the frozen
 * path plus the line span — `<file>:<line_start>-<line_end>` — never
 * counters: re-segmenting a block changes its span and therefore correctly
 * mints a NEW id, so no stale citation can silently survive a re-tiling.
 * {@link deriveBlockId} is the one derivation.
 *
 * **The area rule.** `areaOfFrozenPath` is the mechanical file→area map the
 * per-area ledgers (`ledger/<area>.ledger.jsonl`) and `--area` slices share:
 * a frozen path's first two segments joined with `--` (`plans/foo/…` →
 * `plans--foo`), or its single root segment for class-root files
 * (`plans/README.md` → `plans`; F1 §10's "root-level files as their own
 * small batch"). Batch ORDER stays F6's rule over this enumeration — nothing
 * here depends on it.
 *
 * @packageDocumentation
 */

/** Ledger directory relative to the artefact home (F1 §3). */
export const LEDGER_DIR_SEGMENT = 'ledger';

/**
 * The mechanical sentinel disposition the default-ledger emitter writes: it
 * asserts the ABSENCE of judgement — the block exists and is covered, and
 * nobody has judged it yet. Every real disposition replaces it row-by-row in
 * the F2/F3 stages.
 */
export const DEFAULT_BLOCK_DISPOSITION = 'default-block';

const nonEmptyString = z.string().min(1);
const positiveInt = z.number().int().positive();

/** The canonical v1 ledger row (F1 §3; see the module remarks). */
export const ledgerRowSchema = z.strictObject({
  block_id: nonEmptyString,
  file: nonEmptyString,
  line_start: positiveInt,
  line_end: positiveInt,
  disposition: nonEmptyString,
  home: z.string(),
  binding: z.string(),
});
export type LedgerRow = z.infer<typeof ledgerRowSchema>;

/** Parse an unknown value as a {@link LedgerRow} at the read boundary. */
export const parseLedgerRow = (value: unknown): Result<LedgerRow, Error> =>
  parseWithSchema({ label: 'ledger row', schema: ledgerRowSchema, value });

/** The one coordinate-derived block-id derivation (see the module remarks). */
export function deriveBlockId(file: string, lineStart: number, lineEnd: number): string {
  return `${file}:${String(lineStart)}-${String(lineEnd)}`;
}

/** The mechanical file→area rule (see the module remarks). */
export function areaOfFrozenPath(frozenPath: string): string {
  const segments = frozenPath.split('/');
  const first = segments[0] ?? frozenPath;
  const second = segments[1];
  return segments.length > 2 && second !== undefined ? `${first}--${second}` : first;
}

/** The area's ledger basename under {@link LEDGER_DIR_SEGMENT}. */
export function ledgerBasenameForArea(area: string): string {
  return `${area}.ledger.jsonl`;
}

/** The directory prefix an area id derives from (collision detection). */
function areaPrefixOfFrozenPath(frozenPath: string): string {
  const segments = frozenPath.split('/');
  const first = segments[0] ?? frozenPath;
  const second = segments[1];
  return segments.length > 2 && second !== undefined ? `${first}/${second}` : first;
}

/**
 * Group denominator files by derived area, refusing when two DISTINCT
 * directory prefixes collide onto one area id (possible only via `--` inside
 * a segment name) — a collision would silently merge two areas' slices.
 */
export function groupFilesByArea(
  files: readonly DenominatorFile[],
): Result<ReadonlyMap<string, readonly DenominatorFile[]>, Error> {
  const byArea = new Map<string, DenominatorFile[]>();
  const prefixByArea = new Map<string, string>();
  for (const file of files) {
    const area = areaOfFrozenPath(file.path);
    const prefix = areaPrefixOfFrozenPath(file.path);
    const existingPrefix = prefixByArea.get(area);
    if (existingPrefix !== undefined && existingPrefix !== prefix) {
      return err(
        new Error(
          `area id '${area}' is ambiguous: directory prefixes '${existingPrefix}' and ` +
            `'${prefix}' both derive it — refusing to merge two areas' slices`,
        ),
      );
    }
    prefixByArea.set(area, prefix);
    const bucket = byArea.get(area);
    if (bucket === undefined) {
      byArea.set(area, [file]);
    } else {
      bucket.push(file);
    }
  }
  return ok(byArea);
}

/**
 * Parse a ledger JSONL document (pure over its text): one row per non-blank
 * line through the strict canonical schema; a malformed or schema-invalid
 * line refuses, citing the artefact `label` AND the 1-based line number.
 * Duplicate block ids are NOT refused here — duplicate detection is the tile
 * verifier's RED finding, not a parse failure.
 */
export function parseLedgerJsonl(label: string, text: string): Result<readonly LedgerRow[], Error> {
  const rows: LedgerRow[] = [];
  const lines = text.split('\n');
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index] ?? '';
    if (line === '') {
      continue;
    }
    let json: unknown;
    try {
      json = JSON.parse(line);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return err(new Error(`${label} line ${String(index + 1)} is not valid JSON: ${message}`));
    }
    const row = parseLedgerRow(json);
    if (isErr(row)) {
      return err(new Error(`${label} line ${String(index + 1)}: ${row.error.message}`));
    }
    rows.push(row.value);
  }
  return ok(rows);
}
