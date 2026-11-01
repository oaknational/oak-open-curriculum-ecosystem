import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';

import {
  countLines,
  renderJsonArtefact,
  renderJsonlArtefact,
  type DenominatorFile,
} from './refounding-artefacts.js';
import { writeArtefactSet } from './refound-artefact-writes.js';
import { FROZEN_TREE_SEGMENT } from './refound-freeze-helpers.js';
import {
  buildInventoryRecords,
  buildNetDiffReport,
  checkAnchorRatioBand,
  INVENTORY_BASENAME,
  NET_DIFF_BASENAME,
  percentRounded,
  sortInventoryRecords,
  type InventoryRecord,
  type NetDiffReport,
} from './refound-inventory-model.js';
import { readDenominator } from './refound-verify-freeze-helpers.js';

/**
 * The IO orchestration of `refound-inventory` (F1 §5 row 3): read the
 * denominator, scan every `inventory_mode: lines` frozen file through the
 * three nets, cross-check the recounted line totals against the denominator
 * rows (a disagreement between the hashing and line-counting layers is a
 * halt condition, F1 §6), apply the H2 anchor-ratio sanity band, and only
 * then write `inventory.v1.jsonl` and `net-diff.v1.report.json`. Every halt
 * happens BEFORE the write phase, so a halted run leaves no artefact a
 * downstream residue run could mistake for a completed inventory.
 *
 * The tree-scanning half ({@link scanTreeInventory}) is exported so the
 * planted-defect proofs (`refound-plant-orphan`) can scan staged scratch
 * copies through the IDENTICAL net code path — a discrimination proof over
 * different scanning code would prove nothing.
 *
 * @packageDocumentation
 */

/** One scanned file's arithmetic (recounted from its actual bytes). */
interface ScannedFile {
  readonly path: string;
  readonly lines: number;
  readonly anchors: number;
}

/** The in-memory result of scanning one tree (before any artefact write). */
export interface TreeInventory {
  readonly records: readonly InventoryRecord[];
  readonly perFile: readonly ScannedFile[];
  readonly totalLines: number;
}

/**
 * Scan `relPaths` under `rootAbs` through the three nets, recounting lines
 * from the actual bytes. Pure over the tree contents: same bytes, same
 * result. Fails as a typed `Result` on any unreadable file.
 */
export async function scanTreeInventory(input: {
  readonly rootAbs: string;
  readonly relPaths: readonly string[];
}): Promise<Result<TreeInventory, Error>> {
  const records: InventoryRecord[] = [];
  const perFile: ScannedFile[] = [];
  let totalLines = 0;
  for (const relPath of input.relPaths) {
    let bytes: Buffer;
    try {
      bytes = await readFile(path.join(input.rootAbs, relPath));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      return err(new Error(`cannot read frozen file '${relPath}': ${message}`));
    }
    const fileRecords = buildInventoryRecords(relPath, bytes);
    const lines = countLines(bytes);
    records.push(...fileRecords);
    perFile.push({ path: relPath, lines, anchors: fileRecords.length });
    totalLines += lines;
  }
  return ok({ records: sortInventoryRecords(records), perFile, totalLines });
}

/** What the inventory run measured, for the entry's operator summary. */
export interface InventorySummary {
  readonly mdFiles: number;
  readonly mdLines: number;
  readonly anchors: number;
  readonly anchorRatioPercent: number;
}

/**
 * Cross-check every recounted per-file line total against its denominator
 * row (F1 §6: hashing layer vs line-counting layer). Any disagreement is a
 * halt to be understood, never absorbed.
 */
function crossCheckLineCounts(
  denominatorRows: readonly DenominatorFile[],
  scanned: readonly ScannedFile[],
): Result<void, Error> {
  const scannedByPath = new Map(scanned.map((file) => [file.path, file]));
  const disagreements: string[] = [];
  for (const row of denominatorRows) {
    const recount = scannedByPath.get(row.path);
    if (recount !== undefined && recount.lines !== row.lines) {
      disagreements.push(
        `${row.path}: line recount ${String(recount.lines)} != denominator ${String(row.lines)}`,
      );
    }
  }
  if (disagreements.length > 0) {
    return err(
      new Error(
        `line-count cross-check halt (encoding or EOL surprise — understand it, never absorb ` +
          `it): ${disagreements.join('; ')}`,
      ),
    );
  }
  return ok(undefined);
}

/** Write both inventory artefacts; failures return as typed errors. */
async function writeInventoryArtefacts(input: {
  readonly outDirAbs: string;
  readonly records: readonly InventoryRecord[];
  readonly netDiff: NetDiffReport;
}): Promise<Result<void, Error>> {
  const written = await writeArtefactSet([
    {
      absPath: path.join(input.outDirAbs, INVENTORY_BASENAME),
      content: renderJsonlArtefact(input.records),
    },
    {
      absPath: path.join(input.outDirAbs, NET_DIFF_BASENAME),
      content: renderJsonArtefact(input.netDiff),
    },
  ]);
  if (isErr(written)) {
    return err(new Error(`inventory ${written.error.message}`));
  }
  return ok(undefined);
}

/**
 * Execute the inventory over a committed artefact home: denominator in,
 * `inventory.v1.jsonl` + `net-diff.v1.report.json` out, every halt BEFORE
 * the first write.
 */
export async function runInventory(input: {
  readonly outDirAbs: string;
}): Promise<Result<InventorySummary, Error>> {
  const denominator = await readDenominator(input.outDirAbs);
  if (isErr(denominator)) {
    return denominator;
  }
  const linesModeRows = denominator.value.files.filter((row) => row.inventory_mode === 'lines');
  const scan = await scanTreeInventory({
    rootAbs: path.join(input.outDirAbs, FROZEN_TREE_SEGMENT),
    relPaths: linesModeRows.map((row) => row.path),
  });
  if (isErr(scan)) {
    return scan;
  }
  const recounted = crossCheckLineCounts(linesModeRows, scan.value.perFile);
  if (isErr(recounted)) {
    return recounted;
  }
  const band = checkAnchorRatioBand({
    anchorLines: scan.value.records.length,
    totalLines: scan.value.totalLines,
  });
  if (isErr(band)) {
    return band;
  }
  const netDiff = buildNetDiffReport({
    records: scan.value.records,
    totalFiles: linesModeRows.length,
    totalLines: scan.value.totalLines,
  });
  const written = await writeInventoryArtefacts({
    outDirAbs: input.outDirAbs,
    records: scan.value.records,
    netDiff,
  });
  if (isErr(written)) {
    return written;
  }
  return ok({
    mdFiles: linesModeRows.length,
    mdLines: scan.value.totalLines,
    anchors: scan.value.records.length,
    anchorRatioPercent: percentRounded(scan.value.records.length, scan.value.totalLines),
  });
}
