import { type TournamentCellId } from './tournament-types.js';

const FINGERPRINT_FIELDS = [
  'adapterBuildSha256',
  'nodeBinarySha256',
  'nodeVersion',
  'claudeBinarySha256',
  'claudeVersion',
  'codexBinarySha256',
  'codexVersion',
  'modelConfigurationSha256',
  'authMode',
  'invocationSha256',
  'instructionAssetSha256',
  'outputSchemaSha256',
  'effectivePromptSha256',
  'gitleaksBinarySha256',
  'gitleaksVersion',
  'gitleaksConfigSha256',
  'corpusSha256',
  'benchmarkVersion',
] as const;
type FingerprintField = (typeof FINGERPRINT_FIELDS)[number];

export interface RuntimeFingerprint {
  readonly adapterBuildSha256: string;
  readonly nodeBinarySha256: string;
  readonly nodeVersion: string;
  readonly claudeBinarySha256: string;
  readonly claudeVersion: string;
  readonly codexBinarySha256: string;
  readonly codexVersion: string;
  readonly modelConfigurationSha256: string;
  readonly authMode: string;
  readonly invocationSha256: string;
  readonly instructionAssetSha256: string;
  readonly outputSchemaSha256: string;
  readonly effectivePromptSha256: string;
  readonly gitleaksBinarySha256: string;
  readonly gitleaksVersion: string;
  readonly gitleaksConfigSha256: string;
  readonly corpusSha256: string;
  readonly benchmarkVersion: string;
}

interface QualifiedBenchmarkReport {
  readonly reportSha256: string;
  readonly winnerCellId: TournamentCellId;
  readonly qualified: true;
  readonly concernDetectionRate: number;
  readonly falseAlertRate: number;
  readonly p50LatencyMs: number;
  readonly p95LatencyMs: number;
}

export interface ExecutablePin {
  readonly path: string;
  readonly size: number;
  readonly mtimeMs: number;
}

export interface RuntimeExecutablePins {
  readonly node: ExecutablePin;
  readonly claude: ExecutablePin;
  readonly codex: ExecutablePin;
  readonly gitleaks: ExecutablePin;
}

export interface AdapterDeployment {
  readonly entryPath: string;
  readonly sha256: string;
}

export interface LocalActivationManifest {
  readonly schemaVersion: 1;
  readonly enabled: boolean;
  readonly selectedCellId: TournamentCellId;
  readonly benchmarkReport: QualifiedBenchmarkReport;
  readonly fingerprint: RuntimeFingerprint;
  readonly executables: RuntimeExecutablePins;
  readonly deployment: AdapterDeployment;
}

export interface FingerprintMismatch {
  readonly field: FingerprintField;
  readonly expected: string;
  readonly actual: string;
}

export type ActivationDecision =
  | { readonly enabled: true; readonly selectedCellId: TournamentCellId }
  | {
      readonly enabled: false;
      readonly reason:
        | 'manifest-disabled'
        | 'winner-mismatch'
        | 'fingerprint-drift'
        | 'runtime-drift';
      readonly mismatches: readonly FingerprintMismatch[];
    };

function mismatch(
  field: FingerprintField,
  expected: string,
  actual: string,
): FingerprintMismatch | undefined {
  return expected === actual ? undefined : { field, expected, actual };
}

/** Compare every activation-relevant binary, configuration, asset, and corpus input. */
export function compareRuntimeFingerprint(
  expected: RuntimeFingerprint,
  actual: RuntimeFingerprint,
): readonly FingerprintMismatch[] {
  const candidates = FINGERPRINT_FIELDS.map((field) =>
    mismatch(field, expected[field], actual[field]),
  );
  return candidates.filter((candidate) => candidate !== undefined);
}

/** Enable only the locally selected, qualified, and still-fingerprinted tournament winner. */
export function evaluateLocalActivation(
  manifest: LocalActivationManifest,
  currentFingerprint: RuntimeFingerprint,
): ActivationDecision {
  if (!manifest.enabled) {
    return { enabled: false, reason: 'manifest-disabled', mismatches: [] };
  }
  if (manifest.selectedCellId !== manifest.benchmarkReport.winnerCellId) {
    return { enabled: false, reason: 'winner-mismatch', mismatches: [] };
  }
  const mismatches = compareRuntimeFingerprint(manifest.fingerprint, currentFingerprint);
  return mismatches.length === 0
    ? { enabled: true, selectedCellId: manifest.selectedCellId }
    : { enabled: false, reason: 'fingerprint-drift', mismatches };
}
