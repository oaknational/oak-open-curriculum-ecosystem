import { isAbsolute } from 'node:path';

import { err, ok, type Result } from '@oaknational/result';
import { z } from 'zod';

import {
  type AdapterDeployment,
  type LocalActivationManifest,
  type RuntimeExecutablePins,
  type RuntimeFingerprint,
} from './activation.js';
import { type CodexReviewBenchmarkReport } from './benchmark.js';
import { clearLocalActivationManifest } from './local-activation-state.js';
import {
  readBoundedLocalFile,
  sha256,
  writePrivateAtomic,
  type LocalStatePath,
} from './local-state-io.js';
import {
  TOURNAMENT_CELLS,
  type TournamentCellAssessment,
  type TournamentCellId,
} from './tournament-types.js';

export {
  clearLocalActivationManifest,
  LOCAL_ACTIVATION_MANIFEST,
} from './local-activation-state.js';
export const LOCAL_BENCHMARK_REPORT = '.claude/logs/codex-review-benchmark.json';

export interface LocalStateError {
  readonly kind: 'missing' | 'invalid' | 'read-failed' | 'write-failed';
}

const fingerprintSchema = z
  .object({
    adapterBuildSha256: z.string().min(1),
    nodeBinarySha256: z.string().min(1),
    nodeVersion: z.string().min(1),
    claudeBinarySha256: z.string().min(1),
    claudeVersion: z.string().min(1),
    codexBinarySha256: z.string().min(1),
    codexVersion: z.string().min(1),
    modelConfigurationSha256: z.string().min(1),
    authMode: z.string().min(1),
    invocationSha256: z.string().min(1),
    instructionAssetSha256: z.string().min(1),
    outputSchemaSha256: z.string().min(1),
    effectivePromptSha256: z.string().min(1),
    gitleaksBinarySha256: z.string().min(1),
    gitleaksVersion: z.string().min(1),
    gitleaksConfigSha256: z.string().min(1),
    corpusSha256: z.string().min(1),
    benchmarkVersion: z.string().min(1),
  })
  .strict();
const tournamentCellIdSchema = z.custom<TournamentCellId>(
  (value): value is TournamentCellId => typeof value === 'string' && isTournamentCellId(value),
);
const benchmarkSummarySchema = z
  .object({
    reportSha256: z.string().regex(/^[a-f0-9]{64}$/u),
    winnerCellId: tournamentCellIdSchema,
    qualified: z.literal(true),
    concernDetectionRate: z.number().min(0).max(1),
    falseAlertRate: z.number().min(0).max(1),
    p50LatencyMs: z.number().nonnegative(),
    p95LatencyMs: z.number().nonnegative(),
  })
  .strict();
const executablePinSchema = z
  .object({
    path: z.string().refine(isAbsolute),
    size: z.number().int().nonnegative(),
    mtimeMs: z.number().int().nonnegative(),
  })
  .strict();
const manifestSchema = z
  .object({
    schemaVersion: z.literal(1),
    enabled: z.boolean(),
    selectedCellId: tournamentCellIdSchema,
    benchmarkReport: benchmarkSummarySchema,
    fingerprint: fingerprintSchema,
    executables: z
      .object({
        node: executablePinSchema,
        claude: executablePinSchema,
        codex: executablePinSchema,
        gitleaks: executablePinSchema,
      })
      .strict(),
    deployment: z
      .object({
        entryPath: z.string().refine(isAbsolute),
        sha256: z.string().regex(/^[a-f0-9]{64}$/u),
      })
      .strict(),
  })
  .strict();
const qualifiedReportSchema = z.object({
  qualified: z.literal(true),
  selection: z.object({
    winner: z.object({ cell: z.object({ id: tournamentCellIdSchema }) }),
  }),
});

/** Read and strictly validate the local activation manifest. */
export async function readLocalActivationManifest(
  projectRoot: string,
): Promise<Result<LocalActivationManifest, LocalStateError>> {
  const content = await readBoundedLocalFile(activationManifestPath(projectRoot));
  if (!content.ok) {
    return content;
  }
  try {
    const parsed: unknown = JSON.parse(content.value);
    const validation = manifestSchema.safeParse(parsed);
    return validation.success ? ok(validation.data) : err({ kind: 'invalid' });
  } catch {
    return err({ kind: 'invalid' });
  }
}

/** Verify that the local report bytes and selected winner still match the owned manifest. */
export async function verifyLocalBenchmarkReport(
  projectRoot: string,
  manifest: LocalActivationManifest,
): Promise<Result<void, LocalStateError>> {
  const reportFile = await readBoundedLocalFile(benchmarkReportPath(projectRoot));
  if (!reportFile.ok) {
    return reportFile;
  }
  const reportText = reportFile.value;
  if (sha256(reportText) !== manifest.benchmarkReport.reportSha256) {
    return err({ kind: 'invalid' });
  }
  try {
    const report: unknown = JSON.parse(reportText);
    const parsed = qualifiedReportSchema.safeParse(report);
    if (
      !parsed.success ||
      parsed.data.selection.winner.cell.id !== manifest.selectedCellId ||
      parsed.data.selection.winner.cell.id !== manifest.benchmarkReport.winnerCellId
    ) {
      return err({ kind: 'invalid' });
    }
    return ok(undefined);
  } catch {
    return err({ kind: 'invalid' });
  }
}

/** Persist a qualified benchmark and a disabled-by-default activation manifest. */
export async function writeQualifiedBenchmarkState(input: {
  readonly projectRoot: string;
  readonly report: CodexReviewBenchmarkReport;
  readonly winner: TournamentCellAssessment;
  readonly fingerprint: RuntimeFingerprint;
  readonly executables: RuntimeExecutablePins;
  readonly deployment: AdapterDeployment;
}): Promise<Result<LocalActivationManifest, LocalStateError>> {
  const reportText = `${JSON.stringify(input.report, null, 2)}\n`;
  const reportSha256 = sha256(reportText);
  const manifest: LocalActivationManifest = {
    schemaVersion: 1,
    enabled: false,
    selectedCellId: input.winner.cell.id,
    benchmarkReport: {
      reportSha256,
      winnerCellId: input.winner.cell.id,
      qualified: true,
      concernDetectionRate: input.winner.concernDetectionRate,
      falseAlertRate: input.winner.falseAlertRate,
      p50LatencyMs: input.winner.p50LatencyMs,
      p95LatencyMs: input.winner.p95LatencyMs,
    },
    fingerprint: input.fingerprint,
    executables: input.executables,
    deployment: input.deployment,
  };
  const reportWritten = await writePrivateAtomic(
    benchmarkReportPath(input.projectRoot),
    reportText,
  );
  if (!reportWritten.ok) {
    return reportWritten;
  }
  const manifestWritten = await writePrivateAtomic(
    activationManifestPath(input.projectRoot),
    `${JSON.stringify(manifest, null, 2)}\n`,
  );
  return manifestWritten.ok ? ok(manifest) : manifestWritten;
}

/** Persist a non-qualifying report and invalidate any stale activation manifest. */
export async function writeUnqualifiedBenchmarkState(input: {
  readonly projectRoot: string;
  readonly report: CodexReviewBenchmarkReport;
}): Promise<Result<void, LocalStateError>> {
  const reportWritten = await writePrivateAtomic(
    benchmarkReportPath(input.projectRoot),
    `${JSON.stringify(input.report, null, 2)}\n`,
  );
  if (!reportWritten.ok) {
    return reportWritten;
  }
  return clearLocalActivationManifest(input.projectRoot);
}

/** Rewrite only the enabled bit of a validated owned manifest. */
export async function setManifestEnabled(
  projectRoot: string,
  manifest: LocalActivationManifest,
  enabled: boolean,
): Promise<Result<LocalActivationManifest, LocalStateError>> {
  const updated = { ...manifest, enabled };
  const written = await writePrivateAtomic(
    activationManifestPath(projectRoot),
    `${JSON.stringify(updated, null, 2)}\n`,
  );
  return written.ok ? ok(updated) : written;
}

export function isTournamentCellId(value: string): value is TournamentCellId {
  return TOURNAMENT_CELLS.some((cell) => cell.id === value);
}

function activationManifestPath(projectRoot: string): LocalStatePath {
  return { anchor: projectRoot, directories: ['.claude'], basename: 'codex-review.local.json' };
}

function benchmarkReportPath(projectRoot: string): LocalStatePath {
  return {
    anchor: projectRoot,
    directories: ['.claude', 'logs'],
    basename: 'codex-review-benchmark.json',
  };
}
