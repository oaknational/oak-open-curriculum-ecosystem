import { createHash } from 'node:crypto';

import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import { parseWithSchema } from '../core/schema-parse.js';

/**
 * Shared artefact types, schemas, and byte-level primitives for the
 * plan-corpus refounding's mechanical substrate (F1 §3, §6).
 *
 * @remarks
 * Two committed artefacts are defined here, both with closed shapes
 * (`strict-validation-at-boundary`):
 *
 * - **The denominator** (`denominator.v1.json`): per-file
 *   `{path, bytes, sha256, lines, inventory_mode}` plus totals — THE number
 *   every later loss claim divides by. `files` is sorted by `path`
 *   (UTF-16 code-unit order) as part of the determinism contract.
 * - **The freeze-identity proof** (`proofs/freeze-identity.v1.json`): per-file
 *   `{path, source_sha256, copy_sha256, bytes}` with source == copy asserted
 *   by the freeze script before exit.
 *
 * Paths in both artefacts are POSIX and relative to the frozen tree root
 * (`archive/frozen-v1/`), e.g. `plans/foo.plan.md` — the same coordinate
 * system the inventory and ledger cite (F1 §3). The source path is recovered
 * by the documented inverse mapping (prefix `.agent/`), and the freeze script
 * refuses colliding mappings, keeping the inverse unambiguous.
 *
 * **`inventory_mode` rule** (F1 D5): `.md` files are inventoried per line
 * (`lines`); other text files conserve as single whole-file rows
 * (`whole-file`); binary files — detected by a null-byte sniff over the first
 * {@link BINARY_SNIFF_WINDOW_BYTES} bytes — are `opaque`, and byte-identity is
 * their whole conservation obligation. The binary sniff wins over the
 * extension: a `.md` file carrying null bytes is `opaque`.
 *
 * **Line counting**: a line count is the LF-split of the raw bytes — the
 * number of LF (0x0A) bytes, plus one when the file is non-empty and does not
 * end in LF. No EOL normalisation: CRLF content keeps its CR bytes and counts
 * by its LFs. For `opaque` files the count is recorded mechanically and is
 * informational only.
 *
 * @packageDocumentation
 */

const nonEmptyString = z.string().min(1);
const nonNegativeInt = z.number().int().nonnegative();
/** One digest primitive estate-wide: 64 lowercase hex chars of SHA-256. */
export const sha256HexSchema = z.string().regex(/^[0-9a-f]{64}$/);

/** A relative POSIX path (path-traversal defence): no `..`, absolute, or backslash. */
export const relativePosixPath = nonEmptyString.refine((p) => {
  const norm = p.replaceAll('\\', '/');
  return !norm.startsWith('/') && !norm.split('/').includes('..') && !p.includes('\\');
}, 'must be a relative POSIX path with no .. segments');

/** Bytes inspected for a null byte when classifying a file as binary. */
export const BINARY_SNIFF_WINDOW_BYTES = 8192;

/** How a frozen file is inventoried downstream (see the module remarks). */
const inventoryModeSchema = z.enum(['lines', 'whole-file', 'opaque']);
export type InventoryMode = z.infer<typeof inventoryModeSchema>;

/** One denominator row: the identity of a single frozen file. */
export const denominatorFileSchema = z.strictObject({
  path: relativePosixPath,
  bytes: nonNegativeInt,
  sha256: sha256HexSchema,
  lines: nonNegativeInt,
  inventory_mode: inventoryModeSchema,
});
export type DenominatorFile = z.infer<typeof denominatorFileSchema>;

/**
 * The denominator artefact (`denominator.v1.json`): every arithmetic claim in
 * the refounding divides by these totals (F1 D3).
 */
const denominatorSchema = z.strictObject({
  version: z.number().int().positive(),
  generatedFrom: z.strictObject({
    freezeRuleVersion: z.number().int().positive(),
    ratifiedBy: nonEmptyString,
  }),
  files: z.array(denominatorFileSchema),
  totals: z.strictObject({
    files: nonNegativeInt,
    lines: nonNegativeInt,
    bytes: nonNegativeInt,
  }),
});
export type Denominator = z.infer<typeof denominatorSchema>;

/** One freeze-identity row: source and copy hashes for a single frozen file. */
export const freezeIdentityEntrySchema = z.strictObject({
  path: relativePosixPath,
  source_sha256: sha256HexSchema,
  copy_sha256: sha256HexSchema,
  bytes: nonNegativeInt,
});
export type FreezeIdentityEntry = z.infer<typeof freezeIdentityEntrySchema>;

/** The freeze-identity proof artefact (`proofs/freeze-identity.v1.json`). */
const freezeIdentityProofSchema = z.array(freezeIdentityEntrySchema);
export type FreezeIdentityProof = z.infer<typeof freezeIdentityProofSchema>;

/** Parse an unknown value as a {@link Denominator} at the read boundary. */
export const parseDenominator = (value: unknown): Result<Denominator, Error> =>
  parseWithSchema({ label: 'denominator', schema: denominatorSchema, value });

/** Parse an unknown value as a {@link FreezeIdentityProof} at the read boundary. */
export const parseFreezeIdentityProof = (value: unknown): Result<FreezeIdentityProof, Error> =>
  parseWithSchema({ label: 'freeze-identity proof', schema: freezeIdentityProofSchema, value });

/**
 * Parse a JSON document read from disk into an unknown value as a `Result`.
 *
 * @param label - Boundary name used in the error message.
 * @param text - The raw file text.
 * @returns The parsed value, or an `Error` naming the boundary.
 */
export function parseJsonDocument(label: string, text: string): Result<unknown, Error> {
  try {
    return ok(JSON.parse(text));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`${label} is not valid JSON: ${message}`));
  }
}

/**
 * Render an artefact value as the canonical committed JSON form: two-space
 * indentation plus a trailing newline. Key order follows construction order,
 * which the builders keep fixed — this is half of the byte-determinism
 * contract (the other half is sorted file lists).
 */
export function renderJsonArtefact(value: unknown): string {
  return `${JSON.stringify(value, null, 2)}\n`;
}

/**
 * Render a JSONL artefact: one compact JSON document per record, each line
 * LF-terminated (`inventory.v1.jsonl`, `sweep/sweep-hits.v1.jsonl`). Key
 * order follows construction order, which the builders keep fixed — the same
 * byte-determinism contract as {@link renderJsonArtefact}.
 */
export function renderJsonlArtefact(records: readonly unknown[]): string {
  return records.map((record) => `${JSON.stringify(record)}\n`).join('');
}

/**
 * Compare strings by UTF-16 code units — deliberately NOT `localeCompare`,
 * whose order varies by locale and would break the byte-determinism contract
 * for sorted artefact file lists. (Astral-plane characters order by their
 * surrogate code units, which differs from Unicode codepoint order; any fixed
 * total order satisfies the determinism contract, and this is JavaScript's
 * native `<`/`>` string order.)
 */
export function compareByCodeUnit(a: string, b: string): number {
  if (a < b) {
    return -1;
  }
  return a > b ? 1 : 0;
}

/**
 * SHA-256 of raw bytes as lowercase hex — the identity primitive for the
 * whole proof set (F1 §6) AND the per-line digest recorded in
 * `inventory.v1.jsonl` and `sweep/sweep-hits.v1.jsonl`. F1 §3 recorded the
 * per-line digest as SHA-1; landed = SHA-256, superseding it (one digest
 * primitive estate-wide; the weak-hash class is gate-checked — panel README
 * supersession note).
 */
export function sha256Hex(bytes: Uint8Array): string {
  return createHash('sha256').update(bytes).digest('hex');
}

/**
 * Split raw bytes into one buffer per line by the SAME LF-split definition
 * {@link countLines} counts by: the LF terminator is not part of the line, a
 * CR before it is (no EOL normalisation, F1 D7), and a trailing LF does not
 * open an empty final line. `splitLineBytes(bytes).length` always equals
 * `countLines(bytes)`.
 */
export function splitLineBytes(bytes: Uint8Array): readonly Uint8Array[] {
  if (bytes.length === 0) {
    return [];
  }
  const lines: Uint8Array[] = [];
  let lineStart = 0;
  for (let index = 0; index < bytes.length; index += 1) {
    if (bytes[index] === 0x0a) {
      lines.push(bytes.subarray(lineStart, index));
      lineStart = index + 1;
    }
  }
  if (lineStart < bytes.length) {
    lines.push(bytes.subarray(lineStart));
  }
  return lines;
}

/**
 * Count lines by LF-split of raw bytes (see the module remarks for the exact
 * definition; F1 §5 "Line = LF-split of raw bytes").
 */
export function countLines(bytes: Uint8Array): number {
  if (bytes.length === 0) {
    return 0;
  }
  let lineFeeds = 0;
  for (const byte of bytes) {
    if (byte === 0x0a) {
      lineFeeds += 1;
    }
  }
  const endsWithLineFeed = bytes.at(-1) === 0x0a;
  return endsWithLineFeed ? lineFeeds : lineFeeds + 1;
}

/** True when a null byte appears within the sniff window (binary content). */
function hasNullByteInSniffWindow(bytes: Uint8Array): boolean {
  const window = Math.min(bytes.length, BINARY_SNIFF_WINDOW_BYTES);
  for (let index = 0; index < window; index += 1) {
    if (bytes[index] === 0x00) {
      return true;
    }
  }
  return false;
}

/**
 * Classify a file's {@link InventoryMode} from its path and raw bytes.
 * The binary sniff wins over the extension (see the module remarks).
 *
 * @param filePath - POSIX path (only the `.md` suffix is consulted).
 * @param bytes - The file's raw bytes.
 */
export function classifyInventoryMode(filePath: string, bytes: Uint8Array): InventoryMode {
  if (hasNullByteInSniffWindow(bytes)) {
    return 'opaque';
  }
  return filePath.endsWith('.md') ? 'lines' : 'whole-file';
}
