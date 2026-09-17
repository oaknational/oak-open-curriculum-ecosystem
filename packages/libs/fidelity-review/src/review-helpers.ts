/*
 * The summarise / report-write mechanics the run orchestrator composes
 * (each demo app's tools/fidelity-review.ts CLI keeps only its
 * composition root: paths, capture arms, main). Paths and IO arrive as
 * parameters: this module lives in a shared package, never derives an
 * app location from its own, and never touches the filesystem — the
 * report files land through the orchestrator's injected ReportWriteIo
 * leg (register loading likewise moved behind that seam, 2026-08-09).
 */
// Explicit module import, never the ambient global (lib boundary rule):
// the summary lines are stdout UX.
import process from 'node:process';

import { type Result } from '@oaknational/result';

import { type FidelityRegister } from './register';
import { renderReportHtml, type PairResult, type RunMeta } from './report';
import type { PairingMap } from './pairing-types';

/** The report-file writer the orchestrator's EvidenceIo supplies. */
interface ReportFileWriter {
  readonly writeReportFile: (name: string, content: string) => Result<void, string>;
}

/** One line per pair: diff ratio (or the status when there is no diff)
 *  and whether the register carries a disposition for it. Pure — the
 *  three decisions here (two-decimal percentage, status fallback,
 *  recorded/UNREGISTERED verdict) are the summary's behaviour, and they
 *  test as data-in/data-out. */
export function summaryLines(
  results: readonly PairResult[],
  register: FidelityRegister,
): readonly string[] {
  return results.map((result) => {
    const ratio =
      result.diff === undefined ? result.status : `${(result.diff.changedRatio * 100).toFixed(2)}%`;
    const judged = register.entries.some((entry) => entry.pairId === result.pair.id);
    return `PAIR ${result.pair.id}: ${ratio} disposition=${judged ? 'recorded' : 'UNREGISTERED'}`;
  });
}

/** Thin writer over {@link summaryLines}. */
export function summariseToStdout(
  results: readonly PairResult[],
  register: FidelityRegister,
): void {
  for (const line of summaryLines(results, register)) {
    process.stdout.write(`${line}\n`);
  }
}

/** Write results.json and the rendered index.html through the injected
 *  writer; a failed write is a mechanical run failure. */
export function writeReport(
  results: readonly PairResult[],
  register: FidelityRegister,
  meta: RunMeta,
  map: PairingMap,
  io: ReportFileWriter,
): Result<void, string> {
  const wroteResults = io.writeReportFile(
    'results.json',
    JSON.stringify({ meta, results }, null, 2),
  );
  if (!wroteResults.ok) {
    return wroteResults;
  }
  const wroteHtml = io.writeReportFile(
    'index.html',
    renderReportHtml(results, register, meta, map),
  );
  if (!wroteHtml.ok) {
    return wroteHtml;
  }
  process.stdout.write('report -> index.html + results.json in the fidelity-report dir\n');
  return wroteHtml;
}
