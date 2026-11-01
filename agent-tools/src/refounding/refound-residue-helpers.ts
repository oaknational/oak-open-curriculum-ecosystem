import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import { renderJsonArtefact, splitLineBytes } from './refounding-artefacts.js';
import { FROZEN_TREE_SEGMENT } from './refound-freeze-helpers.js';
import { readInventoryRecords } from './refound-inventory-read.js';
import { type InventoryRecord } from './refound-inventory-model.js';
import {
  DISCRIMINATION_PROOF_SEGMENT,
  parseDiscriminationTranscript,
} from './refound-plant-orphan-transcript.js';
import {
  analyseFileResidue,
  buildResidueReport,
  RESIDUE_BASENAME,
  type FileResidue,
  type ResidueReport,
} from './refound-residue-model.js';
import { readDenominator } from './refound-verify-freeze-helpers.js';

/**
 * The IO orchestration of `refound-residue` (F1 §5 row 4, §9): read the
 * denominator and the committed inventory, cluster every
 * `inventory_mode: lines` file into anchored blocks, apply the orphan rules,
 * and write `residue.v1.report.json`. Every refusal — missing inputs, an
 * inventory record citing a file the denominator does not name, a doubled
 * `(file, line)` anchor, or a line beyond its file's end — happens BEFORE
 * the write.
 *
 * The tree-level computation ({@link computeResidue}) is exported so the
 * planted-defect proofs (`refound-plant-orphan`) cluster staged scratch
 * copies through the IDENTICAL code path.
 *
 * A zero-orphan result is only acceptable alongside a committed
 * discrimination proof (F1 §9), and the acceptance is MECHANICAL and
 * CONTENT-VERIFIED: a zero-candidate run REFUSES (nothing written) unless
 * `proofs/orphan-discrimination.v1.md` re-parses as a committed proof with
 * the every-detector-fired invariants intact.
 *
 * @packageDocumentation
 */

/** What the residue run measured, for the entry's operator summary. */
export interface ResidueSummary {
  readonly files: number;
  readonly blocks: number;
  readonly orphanCandidates: number;
}

/**
 * Group inventory anchors by file, refusing a record citing a file outside
 * the lines-mode set and any doubled `(file, line)` anchor — a doubled
 * anchor would silently invert its block's clustering.
 */
function collectAnchorsByFile(
  relPaths: readonly string[],
  records: readonly InventoryRecord[],
): Result<ReadonlyMap<string, readonly number[]>, Error> {
  const anchorsByFile = new Map<string, Set<number>>(
    relPaths.map((relPath) => [relPath, new Set<number>()]),
  );
  for (const record of records) {
    const anchors = anchorsByFile.get(record.file);
    if (anchors === undefined) {
      return err(
        new Error(
          `inventory record cites '${record.file}', which the denominator's lines-mode file ` +
            'set does not contain',
        ),
      );
    }
    if (anchors.has(record.line)) {
      return err(
        new Error(
          `inventory carries a doubled anchor: '${record.file}' line ${String(record.line)} ` +
            'appears more than once — refusing (a doubled anchor would silently invert its block)',
        ),
      );
    }
    anchors.add(record.line);
  }
  return ok(new Map([...anchorsByFile].map(([file, anchors]) => [file, [...anchors]])));
}

/**
 * Cluster `files` under `rootAbs` into anchored blocks using `records` as
 * the anchor set, refusing records that disagree with the tree (unknown
 * file, doubled `(file, line)` anchor, line beyond EOF).
 */
export async function computeResidue(input: {
  readonly rootAbs: string;
  readonly relPaths: readonly string[];
  readonly records: readonly InventoryRecord[];
}): Promise<Result<ResidueReport, Error>> {
  const collected = collectAnchorsByFile(input.relPaths, input.records);
  if (isErr(collected)) {
    return collected;
  }
  const anchorsByFile = collected.value;
  const analyses: FileResidue[] = [];
  for (const relPath of input.relPaths) {
    let bytes: Buffer;
    try {
      bytes = await readFile(path.join(input.rootAbs, relPath));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return err(new Error(`cannot read frozen file '${relPath}': ${message}`));
    }
    const lineTexts = splitLineBytes(bytes).map((raw) => Buffer.from(raw).toString('utf8'));
    const anchorLines = [...(anchorsByFile.get(relPath) ?? [])].sort((a, b) => a - b);
    const overshoot = anchorLines.find((line) => line > lineTexts.length);
    if (overshoot !== undefined) {
      return err(
        new Error(
          `inventory record cites line ${String(overshoot)} of '${relPath}', but the file has ` +
            `only ${String(lineTexts.length)} line(s)`,
        ),
      );
    }
    analyses.push(analyseFileResidue({ file: relPath, lineTexts, anchorLines }));
  }
  return ok(buildResidueReport(analyses));
}

/**
 * The F1 §9 zero-orphan acceptance gate, MECHANICAL: zero candidates are
 * refused unless the committed discrimination-proof transcript exists AND
 * its machine-readable outcome re-parses with the every-detector-fired
 * invariants intact — a stale, truncated, or hand-touched transcript is a
 * refusal, never an acceptance (`validators-must-recompute`).
 */
async function checkZeroOrphanAcceptance(
  outDirAbs: string,
  report: ResidueReport,
): Promise<Result<void, Error>> {
  if (report.totals.orphanCandidates > 0) {
    return ok(undefined);
  }
  let transcript: string;
  try {
    transcript = await readFile(path.join(outDirAbs, DISCRIMINATION_PROOF_SEGMENT), 'utf8');
  } catch {
    return err(
      new Error(
        `zero-orphan acceptance refused: no committed ${DISCRIMINATION_PROOF_SEGMENT} in the ` +
          'artefact home — a zero-candidate residue result is acceptable ONLY alongside the ' +
          'discrimination proof (F1 §9; run refound-plant-orphan first)',
      ),
    );
  }
  const outcome = parseDiscriminationTranscript(transcript);
  if (isErr(outcome)) {
    return err(
      new Error(
        `zero-orphan acceptance refused: ${DISCRIMINATION_PROOF_SEGMENT} does not verify as a ` +
          `committed proof (${outcome.error.message}) — re-run refound-plant-orphan; a ` +
          'transcript is trusted for what it records, never for existing',
      ),
    );
  }
  return ok(undefined);
}

/**
 * Execute the residue audit over a committed artefact home: denominator +
 * inventory in, `residue.v1.report.json` out, every refusal — including the
 * mechanical zero-orphan acceptance gate — BEFORE the write.
 */
export async function runResidue(input: {
  readonly outDirAbs: string;
}): Promise<Result<ResidueSummary, Error>> {
  const denominator = await readDenominator(input.outDirAbs);
  if (isErr(denominator)) {
    return denominator;
  }
  const records = await readInventoryRecords(input.outDirAbs);
  if (isErr(records)) {
    return records;
  }
  const report = await computeResidue({
    rootAbs: path.join(input.outDirAbs, FROZEN_TREE_SEGMENT),
    relPaths: denominator.value.files
      .filter((row) => row.inventory_mode === 'lines')
      .map((row) => row.path),
    records: records.value,
  });
  if (isErr(report)) {
    return report;
  }
  const zeroAccepted = await checkZeroOrphanAcceptance(input.outDirAbs, report.value);
  if (isErr(zeroAccepted)) {
    return zeroAccepted;
  }
  try {
    await writeFile(
      path.join(input.outDirAbs, RESIDUE_BASENAME),
      renderJsonArtefact(report.value),
      'utf8',
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`residue artefact write failed: ${message}`));
  }
  return ok({
    files: report.value.totals.files,
    blocks: report.value.totals.blocks,
    orphanCandidates: report.value.totals.orphanCandidates,
  });
}
