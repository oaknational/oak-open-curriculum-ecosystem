/**
 * The identity-naming validator's INPUT boundaries: the CLI argv and the
 * committed census file.
 *
 * @remarks
 * Both are untrusted input to a security-critical gate, so both are parsed
 * into typed values by pure functions here rather than inline in the CLI
 * entry. The entry keeps only the IO and the exit codes, and every rejection
 * path — a stray argument, an extra census key, a negative count, a duplicated
 * row, a breakdown that does not add up — is unit-testable without spawning a
 * process.
 *
 * The census schema is STRICT at every object level (the
 * `strict-validation-at-boundary` rule): an unrecognised key is a typo or a
 * stale field, and in a ratchet contract either one silently means "this row
 * does not say what its author thought". The `breakdown` rows are part of the
 * schema and are cross-checked
 * against `countByVariant` — a row whose provenance rows do not sum to its
 * occurrence total is internally inconsistent, and a contract that disagrees
 * with itself cannot adjudicate anything.
 *
 * @packageDocumentation
 */

import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../../core/schema-parse.js';

import { findDuplicateKeys, type CensusEntry } from './validate-identity-naming-census.js';

/** The only argument the validator accepts. */
const PRINT_COUNTS_FLAG = '--print-counts';

/** One authoring-provenance row: how a slice of a file's occurrences maps. */
const censusBreakdownRowSchema = z.strictObject({
  mappingRole: z.string().min(1),
  contextKind: z.string().min(1),
  dispositionClass: z.string().min(1),
  count: z.number().int().nonnegative(),
});

/** The three per-case-variant counts; integers, never negative. */
const variantCountsSchema = z.strictObject({
  name: z.number().int().nonnegative(),
  initialismUpper: z.number().int().nonnegative(),
  initialismLower: z.number().int().nonnegative(),
});

/** One census row: the ratchet contract for a single (kind, file) cell. */
const censusRowSchema = z.strictObject({
  file: z.string().min(1),
  kind: z.union([z.literal('content'), z.literal('path')]),
  countByVariant: variantCountsSchema,
  breakdown: z.array(censusBreakdownRowSchema),
});

/**
 * The census file's top level. `$comment` carries the contract's own prose and
 * `generated` its authoring date; both are part of the committed artefact, so
 * a strict schema must name them rather than reject the file it governs.
 */
const censusFileSchema = z.strictObject({
  $comment: z.string().optional(),
  generated: z.string(),
  entries: z.array(censusRowSchema),
});

/** One provenance row inside a census entry. */
export interface CensusBreakdownRow {
  /** Which mapping surface adjudicates this slice (e.g. the plan's D1 table). */
  readonly mappingRole: string;
  /** The kind of context the occurrences sit in. */
  readonly contextKind: string;
  /** How this slice is disposed of by the rename. */
  readonly dispositionClass: string;
  /** How many of the row's occurrences this slice accounts for. */
  readonly count: number;
}

/** One census FILE row: a contract cell plus its authoring provenance. */
export interface CensusFileRow extends CensusEntry {
  readonly breakdown: readonly CensusBreakdownRow[];
}

/** One census row whose breakdown counts do not sum to its variant total. */
export interface BreakdownSumMismatch {
  readonly file: string;
  readonly kind: 'content' | 'path';
  /** The row's total occurrences across the three case variants. */
  readonly variantTotal: number;
  /** The sum of the row's breakdown counts. */
  readonly breakdownTotal: number;
}

/**
 * The validator's operating mode, carrying the contract it enforces.
 *
 * @remarks
 * A discriminated union rather than a bare string so the ratchet branch holds
 * its own census — the entry never needs a fallback for a census that "cannot"
 * be absent in ratchet mode.
 */
export type CensusModeSelection =
  | { readonly mode: 'ratchet'; readonly census: readonly CensusEntry[] }
  | { readonly mode: 'strict' };

/** The parsed CLI invocation. */
export interface IdentityNamingInvocation {
  /** True when the live projection should be emitted as JSON on stdout. */
  readonly printCounts: boolean;
}

/**
 * Every census row whose breakdown counts do not sum to its occurrence total.
 *
 * @param rows - The parsed census rows.
 * @returns One mismatch per internally inconsistent row; empty when all agree.
 */
export function findBreakdownSumMismatches(rows: readonly CensusFileRow[]): BreakdownSumMismatch[] {
  const mismatches: BreakdownSumMismatch[] = [];
  for (const row of rows) {
    const variantTotal =
      row.countByVariant.name +
      row.countByVariant.initialismUpper +
      row.countByVariant.initialismLower;
    const breakdownTotal = row.breakdown.reduce((total, slice) => total + slice.count, 0);
    if (variantTotal !== breakdownTotal) {
      mismatches.push({ file: row.file, kind: row.kind, variantTotal, breakdownTotal });
    }
  }
  return mismatches;
}

/** Parse census text as JSON, labelling the failure with the boundary name. */
function parseCensusJson(input: {
  readonly label: string;
  readonly text: string;
}): Result<unknown, Error> {
  try {
    const value: unknown = JSON.parse(input.text);
    return ok(value);
  } catch (error) {
    return err(new Error(`${input.label} is not valid JSON`, { cause: error }));
  }
}

/**
 * Parse the census file's text into contract rows.
 *
 * @remarks
 * Four rejections, in order: invalid JSON, schema violation (strict at every
 * level), a duplicated (kind, file) key — two rows for one cell means the
 * contract's own adjudication depends on map insertion order — and a breakdown
 * that does not sum to the row's occurrence total.
 *
 * @param input - The boundary `label` used in errors, and the census `text`.
 * @returns The census rows, or the first failure as a labelled error.
 */
export function parseCensusText(input: {
  readonly label: string;
  readonly text: string;
}): Result<CensusFileRow[], Error> {
  const json = parseCensusJson(input);
  if (!json.ok) {
    return json;
  }
  const parsed = parseWithSchema({
    label: input.label,
    schema: censusFileSchema,
    value: json.value,
  });
  if (!parsed.ok) {
    return parsed;
  }
  const rows = parsed.value.entries;
  const duplicates = findDuplicateKeys(rows);
  if (duplicates.length > 0) {
    return err(
      new Error(`${input.label} has duplicate (kind, file) rows: ${duplicates.join(', ')}`),
    );
  }
  const mismatches = findBreakdownSumMismatches(rows);
  if (mismatches.length > 0) {
    const detail = mismatches
      .map(
        (row) =>
          `${row.kind} ${row.file} (variants ${row.variantTotal}, breakdown ${row.breakdownTotal})`,
      )
      .join(', ');
    return err(
      new Error(`${input.label} has breakdown counts that do not sum to countByVariant: ${detail}`),
    );
  }
  return ok(rows);
}

/**
 * Choose the validator's mode from the loaded census.
 *
 * @param census - The census rows, or `undefined` when the file is absent.
 * @returns Ratchet (carrying the census) when rows exist; strict otherwise —
 * an absent OR empty census means the end state is due: zero occurrences.
 */
export function selectCensusMode(census: readonly CensusEntry[] | undefined): CensusModeSelection {
  if (census === undefined || census.length === 0) {
    return { mode: 'strict' };
  }
  return { mode: 'ratchet', census };
}

/**
 * Parse the validator's argv.
 *
 * @remarks
 * Strict by design: an unrecognised argument is a mistyped invocation, and a
 * gate that silently ignores one can be silently mis-driven (`--print-count`
 * would have scanned and reported nothing while exiting 0).
 *
 * @param argv - The arguments after the script name (`process.argv.slice(2)`).
 * @returns The invocation, or a message naming the offending argument.
 */
export function parseIdentityNamingArgv(
  argv: readonly string[],
): Result<IdentityNamingInvocation, string> {
  for (const argument of argv) {
    if (argument !== PRINT_COUNTS_FLAG) {
      return err(
        `unexpected argument '${argument}' — the only accepted argument is ${PRINT_COUNTS_FLAG}`,
      );
    }
  }
  return ok({ printCounts: argv.includes(PRINT_COUNTS_FLAG) });
}
