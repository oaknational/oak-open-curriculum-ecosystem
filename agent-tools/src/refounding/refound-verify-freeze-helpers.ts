import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { assertPathWithinBase } from '@oaknational/safe-path';
import { glob } from 'tinyglobby';

import {
  compareByCodeUnit,
  countLines,
  parseDenominator,
  parseJsonDocument,
  sha256Hex,
  type Denominator,
  type DenominatorFile,
} from './refounding-artefacts.js';
import { readAmendments } from './refound-amendments.js';
import { DENOMINATOR_BASENAME, FROZEN_TREE_SEGMENT } from './refound-freeze-helpers.js';
import { mergeDenominator, type FreezeViolation } from './refound-verify-freeze-model.js';

/**
 * Pure logic and orchestration for `refound-verify-freeze` (F1 §5 row 2, §6
 * layer 2).
 *
 * @remarks
 * The verifier is the freeze's read-only contract made mechanical: it
 * re-hashes every frozen file against the denominator and goes RED on any hash
 * difference, any missing or unreadable frozen file, any EXTRA file the
 * denominator does not name, any per-row byte/line count disagreeing with a
 * recount of the copy's bytes, and any recorded totals disagreeing with totals
 * recomputed from the file list (`validators-must-recompute-not-just-record`).
 * It never trusts a recorded green — a consistently tampered denominator (row
 * edited, totals adjusted to match) still goes red, the recount deriving from
 * the frozen bytes, not the document. Its unit tests are the D8 discrimination
 * proofs: a flipped byte, a deleted copy, and a planted extra file must each go
 * red before any green is trusted — a zero from a detector never shown to fire
 * is not a finding.
 *
 * @packageDocumentation
 */

/** The verifier's recomputed verdict over one freeze. */
export interface VerifyReport {
  readonly checkedFiles: number;
  readonly violations: readonly FreezeViolation[];
}

/** Inputs for {@link verifyFreeze}; the artefact home, absolute. */
export interface VerifyFreezeInput {
  readonly outDirAbs: string;
}

/**
 * Read and parse the committed denominator artefact as a `Result`. Shared by
 * the verifier and the downstream inventory/residue runners
 * (`consolidate-at-second-consumer`) — every consumer divides by the same
 * artefact through the same strict boundary.
 */
export async function readDenominator(outDirAbs: string): Promise<Result<Denominator, Error>> {
  const denominatorAbsPath = path.join(outDirAbs, DENOMINATOR_BASENAME);
  let text: string;
  try {
    text = await readFile(denominatorAbsPath, 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read denominator at '${denominatorAbsPath}': ${message}`));
  }
  const json = parseJsonDocument('denominator', text);
  if (isErr(json)) {
    return json;
  }
  return parseDenominator(json.value);
}

/**
 * Read the committed denominator AND its amendments, returning the merged
 * effective denominator (`v1 + all amendments`, F1 §7). The single read
 * boundary every denominator consumer divides through
 * (`consolidate-at-second-consumer`) — identity-proof refusals included
 * (`mergeDenominator`).
 */
export async function readEffectiveDenominator(
  outDirAbs: string,
): Promise<Result<Denominator, Error>> {
  const denominatorV1 = await readDenominator(outDirAbs);
  if (isErr(denominatorV1)) {
    return denominatorV1;
  }
  const amendments = await readAmendments(outDirAbs);
  if (isErr(amendments)) {
    return amendments;
  }
  return mergeDenominator(denominatorV1.value, amendments.value);
}

/** Recompute totals from the file list and diff them against the recorded ones. */
function checkTotals(denominator: Denominator): FreezeViolation[] {
  let lines = 0;
  let bytes = 0;
  for (const file of denominator.files) {
    lines += file.lines;
    bytes += file.bytes;
  }
  const recomputed = { files: denominator.files.length, lines, bytes };
  const recorded = denominator.totals;
  const differences: string[] = [];
  if (recomputed.files !== recorded.files) {
    differences.push(
      `files recomputed ${String(recomputed.files)} != recorded ${String(recorded.files)}`,
    );
  }
  if (recomputed.lines !== recorded.lines) {
    differences.push(
      `lines recomputed ${String(recomputed.lines)} != recorded ${String(recorded.lines)}`,
    );
  }
  if (recomputed.bytes !== recorded.bytes) {
    differences.push(
      `bytes recomputed ${String(recomputed.bytes)} != recorded ${String(recorded.bytes)}`,
    );
  }
  if (differences.length === 0) {
    return [];
  }
  return [{ kind: 'totals-mismatch', detail: differences.join('; ') }];
}

/**
 * Enumerate every file under the frozen tree (repo-relative POSIX paths). A
 * wholly absent tree yields an empty list — each denominator entry then
 * reports `missing` individually rather than the enumeration throwing.
 */
async function enumerateFrozenTree(frozenRootAbs: string): Promise<readonly string[]> {
  try {
    return await glob(['**'], { cwd: frozenRootAbs, dot: true });
  } catch {
    return [];
  }
}

/**
 * Re-hash every frozen file against the (merged) denominator and enumerate
 * the frozen tree for extras. Infrastructure failures (unreadable or
 * unparseable denominator) are the `Err` arm; RED findings are
 * {@link FreezeViolation} values inside an `Ok` report so the entry can list
 * every violation, not just the first.
 */
export async function verifyFreeze(input: VerifyFreezeInput): Promise<Result<VerifyReport, Error>> {
  const denominatorV1 = await readDenominator(input.outDirAbs);
  if (isErr(denominatorV1)) {
    return denominatorV1;
  }
  const amendments = await readAmendments(input.outDirAbs);
  if (isErr(amendments)) {
    return amendments;
  }
  const denominator = mergeDenominator(denominatorV1.value, amendments.value);
  if (isErr(denominator)) {
    return denominator;
  }
  const frozenRootAbs = path.join(input.outDirAbs, FROZEN_TREE_SEGMENT);
  const violations: FreezeViolation[] = [
    // The totals check recomputes against the COMMITTED v1 artefact (the
    // merged totals are recomputed by construction and would mask a tamper).
    ...checkTotals(denominatorV1.value),
    ...(await checkFrozenFiles(denominator.value.files, frozenRootAbs)),
    ...(await checkForExtras(denominator.value.files, frozenRootAbs)),
  ];
  return ok({ checkedFiles: denominator.value.files.length, violations });
}

/** True when a filesystem failure means "no such file" rather than "unreadable". */
function isFileMissingError(cause: unknown): boolean {
  return cause instanceof Error && 'code' in cause && cause.code === 'ENOENT';
}

/**
 * Recompute one denominator row from the frozen copy's actual bytes: hash,
 * byte count, and LF line count. The recount catches a consistently
 * tampered denominator (row `lines`/`bytes` edited with totals adjusted to
 * match) that hash comparison alone cannot see.
 */
function compareRow(file: DenominatorFile, copyBytes: Buffer): FreezeViolation[] {
  const violations: FreezeViolation[] = [];
  const actualSha256 = sha256Hex(copyBytes);
  if (actualSha256 !== file.sha256) {
    violations.push({
      kind: 'hash-mismatch',
      path: file.path,
      expectedSha256: file.sha256,
      actualSha256,
    });
  }
  const differences: string[] = [];
  if (copyBytes.length !== file.bytes) {
    differences.push(
      `bytes recomputed ${String(copyBytes.length)} != recorded ${String(file.bytes)}`,
    );
  }
  const actualLines = countLines(copyBytes);
  if (actualLines !== file.lines) {
    differences.push(`lines recomputed ${String(actualLines)} != recorded ${String(file.lines)}`);
  }
  if (differences.length > 0) {
    violations.push({ kind: 'recount-mismatch', path: file.path, detail: differences.join('; ') });
  }
  return violations;
}

/**
 * Re-hash and recount every denominator-named frozen file; missing and
 * unreadable copies are distinct violations (both RED).
 */
async function checkFrozenFiles(
  files: readonly DenominatorFile[],
  frozenRootAbs: string,
): Promise<readonly FreezeViolation[]> {
  const violations: FreezeViolation[] = [];
  for (const file of files) {
    let copyBytes: Buffer;
    try {
      // Defence-in-depth: re-anchor within the frozen root before reading.
      const copyAbsPath = assertPathWithinBase(path.join(frozenRootAbs, file.path), frozenRootAbs);
      copyBytes = await readFile(copyAbsPath);
    } catch (error: unknown) {
      if (isFileMissingError(error)) {
        violations.push({ kind: 'missing', path: file.path });
      } else {
        const detail = error instanceof Error ? error.message : String(error);
        violations.push({ kind: 'unreadable', path: file.path, detail });
      }
      continue;
    }
    violations.push(...compareRow(file, copyBytes));
  }
  return violations;
}

/** Flag every file under the frozen tree that the denominator does not name. */
async function checkForExtras(
  files: readonly DenominatorFile[],
  frozenRootAbs: string,
): Promise<readonly FreezeViolation[]> {
  const frozenPaths = await enumerateFrozenTree(frozenRootAbs);
  const namedPaths = new Set(files.map((file) => file.path));
  return [...frozenPaths]
    .sort(compareByCodeUnit)
    .filter((frozenPath) => !namedPaths.has(frozenPath))
    .map((frozenPath) => ({ kind: 'extra' as const, path: frozenPath }));
}
