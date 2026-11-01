import { readFile } from 'node:fs/promises';
import path from 'node:path';

import { err, isErr, ok, type Result } from '@oaknational/result';
import { assertPathWithinBase } from '@oaknational/safe-path';

import {
  countLines,
  renderJsonArtefact,
  renderJsonlArtefact,
  type DenominatorFile,
} from './refounding-artefacts.js';
import { writeArtefactSet } from './refound-artefact-writes.js';
import {
  buildCensusRecords,
  CLAIM_CENSUS_BASENAME,
  sortCensusRecords,
  type CensusRecord,
} from './refound-claim-census-model.js';
import {
  buildCensusReport,
  CLAIM_CENSUS_REPORT_BASENAME,
  parseStatusMappingTable,
  type CensusReport,
  type ClaimCensusSummary,
  type StatusMappingTable,
} from './refound-claim-census-report.js';
import { FROZEN_TREE_SEGMENT } from './refound-freeze-helpers.js';
import { readEffectiveDenominator } from './refound-verify-freeze-helpers.js';

/**
 * The IO orchestration of `refound-claim-census` (R0a cycle 3): read the
 * effective denominator (`v1 + all amendments`), scan the FROZEN tree's
 * line-inventoried files — never live files (P5 determinism, no TOCTOU, no
 * locator rot; post-freeze claim drift surfaces as an arrival via
 * `refound-merge-recheck` and routes by amendment) — and write the census
 * records plus the counted-summary report.
 *
 * Refusals — typed `Err`, nothing written: a missing or invalid denominator,
 * any amendment lacking its identity proof, an unreadable or escaping frozen
 * path (the tranche-1 symlink guard recurs at this read sink), an unreadable
 * or invalid status-mapping table, and the over-20-percent UNMAPPED halt.
 *
 * `whole-file` and `opaque` denominator rows are not scanned: they conserve
 * by byte identity and whole-file ledger rows (F1 D5) and carry no
 * line-shaped status claims; the report's totals count SCANNED files and
 * lines only.
 *
 * @packageDocumentation
 */

/** Read and parse the injected mapping table; `null` path means no mapping. */
async function readMappingTable(
  mappingAbsPath: string | null,
): Promise<Result<StatusMappingTable | null, Error>> {
  if (mappingAbsPath === null) {
    return ok(null);
  }
  let raw: string;
  try {
    raw = await readFile(mappingAbsPath, 'utf8');
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read status-mapping table: ${message}`));
  }
  let document: unknown;
  try {
    document = JSON.parse(raw);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`status-mapping table is not valid JSON: ${message}`));
  }
  return parseStatusMappingTable(document);
}

/** The scan phase's yield: sorted records plus the scanned denominators. */
interface FrozenCensusScan {
  readonly records: readonly CensusRecord[];
  readonly scannedFiles: number;
  readonly scannedLines: number;
}

/** Read one frozen file's bytes through the tranche-1 containment guard. */
async function readFrozenFileBytes(
  frozenRootAbs: string,
  frozenPath: string,
): Promise<Result<Buffer, Error>> {
  let frozenAbsPath: string;
  try {
    frozenAbsPath = assertPathWithinBase(path.join(frozenRootAbs, frozenPath), frozenRootAbs);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`frozen path '${frozenPath}' escapes the frozen tree: ${message}`));
  }
  try {
    return ok(await readFile(frozenAbsPath));
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return err(new Error(`cannot read frozen file '${frozenPath}': ${message}`));
  }
}

/** Scan every line-inventoried frozen file through the census predicates. */
async function readFrozenCensus(input: {
  readonly outDirAbs: string;
  readonly files: readonly DenominatorFile[];
}): Promise<Result<FrozenCensusScan, Error>> {
  const frozenRootAbs = path.join(input.outDirAbs, FROZEN_TREE_SEGMENT);
  const records: CensusRecord[] = [];
  let scannedFiles = 0;
  let scannedLines = 0;
  for (const file of input.files) {
    if (file.inventory_mode !== 'lines') {
      continue;
    }
    const bytes = await readFrozenFileBytes(frozenRootAbs, file.path);
    if (isErr(bytes)) {
      return bytes;
    }
    records.push(...buildCensusRecords(file.path, bytes.value));
    scannedFiles += 1;
    scannedLines += countLines(bytes.value);
  }
  return ok({ records: sortCensusRecords(records), scannedFiles, scannedLines });
}

/** Write the census pair all-or-nothing; a failed run leaves nothing behind. */
async function writeCensusArtefacts(
  outDirAbs: string,
  records: readonly CensusRecord[],
  report: CensusReport,
): Promise<Result<void, Error>> {
  return writeArtefactSet([
    {
      absPath: path.join(outDirAbs, CLAIM_CENSUS_BASENAME),
      content: renderJsonlArtefact(records),
    },
    {
      absPath: path.join(outDirAbs, CLAIM_CENSUS_REPORT_BASENAME),
      content: renderJsonArtefact(report),
    },
  ]);
}

/**
 * Execute the claim census: effective denominator + frozen tree in,
 * `claim-census.v1.jsonl` + `claim-census.v1.report.json` out, every refusal
 * (including the UNMAPPED halt) BEFORE anything is written.
 */
export async function runClaimCensus(input: {
  readonly outDirAbs: string;
  readonly mappingAbsPath: string | null;
}): Promise<Result<ClaimCensusSummary, Error>> {
  const denominator = await readEffectiveDenominator(input.outDirAbs);
  if (isErr(denominator)) {
    return denominator;
  }
  const table = await readMappingTable(input.mappingAbsPath);
  if (isErr(table)) {
    return table;
  }
  const scan = await readFrozenCensus({
    outDirAbs: input.outDirAbs,
    files: denominator.value.files,
  });
  if (isErr(scan)) {
    return scan;
  }
  const report = buildCensusReport({
    records: scan.value.records,
    totalFiles: scan.value.scannedFiles,
    totalLines: scan.value.scannedLines,
    table: table.value,
  });
  if (isErr(report)) {
    return report;
  }
  const written = await writeCensusArtefacts(input.outDirAbs, scan.value.records, report.value);
  if (isErr(written)) {
    return written;
  }
  return ok({
    files: report.value.totals.files,
    records: report.value.totals.records,
    statusLines: report.value.totals.statusLines,
    keywordLines: report.value.totals.keywordLines,
    mapping:
      report.value.mapping === null
        ? null
        : {
            verdicts: report.value.mapping.verdicts.length,
            unmapped: report.value.mapping.unmapped.count,
          },
  });
}
