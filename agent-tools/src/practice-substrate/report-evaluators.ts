import { duplicateIdentityGroups, finding } from './finding.js';
import { evaluateMergeClassDeclarations } from './metadata-evaluators.js';
import { type SubstrateFinding } from './types.js';

type JsonPrimitive = string | number | boolean | null;
type JsonValue = JsonPrimitive | JsonFieldMap | readonly JsonValue[];
export interface JsonFieldMap extends Readonly<Record<string, JsonValue | undefined>> {
  readonly __jsonFieldMapBrand?: never;
}

export interface ManifestSurfaceSnapshot {
  readonly id: string;
  readonly path: string;
  readonly fields: JsonFieldMap;
  readonly surfaceKind: 'markdown' | 'json-schema' | 'directory-readme';
}

export interface ManifestSnapshot {
  readonly manifestPath: string;
  readonly expectedSurfaceCount: number;
  readonly requiredContractFields: readonly string[];
  readonly surfaces: readonly ManifestSurfaceSnapshot[];
}

export interface MigrationLedgerEntrySnapshot {
  readonly originalPath: string;
  readonly targetPath: string;
  readonly recordedSha256: string;
  readonly actualSha256?: string;
  readonly recordedByteCount: number;
  readonly actualByteCount?: number;
}

export interface MigrationLedgerSnapshot {
  readonly ledgerPath: string;
  readonly expectedEntryCount: number;
  readonly entries: readonly MigrationLedgerEntrySnapshot[];
}

const LEDGER_SURFACE = 'legacy-comms-events-migration-ledger';

/**
 * Classify the manifest inventory snapshot without touching the filesystem.
 */
export function evaluateManifestSnapshot(snapshot: ManifestSnapshot): readonly SubstrateFinding[] {
  return [
    ...evaluateManifestSurfaceCount(snapshot),
    ...evaluateManifestDuplicateSurfaceIds(snapshot),
    ...evaluateManifestRequiredFields(snapshot),
    ...evaluateMergeClassDeclarations(
      snapshot.surfaces.map((surface) => ({
        surface: surface.id,
        path: surface.path,
        surfaceKind: surface.surfaceKind,
        mergeClass: readStringField(surface.fields, 'merge_class'),
      })),
    ),
  ];
}

/**
 * Classify the legacy comms migration ledger snapshot without reading targets.
 */
export function evaluateMigrationLedgerSnapshot(
  snapshot: MigrationLedgerSnapshot,
): readonly SubstrateFinding[] {
  return [
    ...evaluateMigrationLedgerCount(snapshot),
    ...evaluateDuplicateLedgerPaths(
      snapshot.entries.map((entry) => entry.originalPath),
      'migration-ledger-duplicate-original-path',
      'original',
    ),
    ...evaluateDuplicateLedgerPaths(
      snapshot.entries.map((entry) => entry.targetPath),
      'migration-ledger-duplicate-target-path',
      'target',
    ),
    ...evaluateLedgerTargetByteCounts(snapshot.entries),
    ...evaluateLedgerTargetHashes(snapshot.entries),
  ];
}

function evaluateManifestSurfaceCount(snapshot: ManifestSnapshot): readonly SubstrateFinding[] {
  if (snapshot.surfaces.length === snapshot.expectedSurfaceCount) {
    return [];
  }

  return [
    finding({
      id: 'manifest-surface-count-drift',
      surface: 'substrate-inventory',
      severity: 'blocking',
      repair: 'manual-with-provenance',
      message:
        `Manifest ${snapshot.manifestPath} declares ${snapshot.surfaces.length} surfaces; ` +
        `expected ${snapshot.expectedSurfaceCount}.`,
      evidence: [snapshot.manifestPath],
    }),
  ];
}

function evaluateManifestDuplicateSurfaceIds(
  snapshot: ManifestSnapshot,
): readonly SubstrateFinding[] {
  return duplicateIdentityGroups(
    snapshot.surfaces.map((surface) => ({
      stableId: surface.id,
      contentIdentity: surface.id,
      context: surface.path,
    })),
  ).map((group) => {
    const stableId = group[0]?.stableId ?? '';
    return finding({
      id: 'duplicate-stable-id',
      surface: 'substrate-inventory',
      severity: 'blocking',
      repair: 'deterministic',
      message: `Stable identity ${stableId} is duplicated with identical content.`,
      evidence: group.map((entry) => entry.context),
    });
  });
}

function evaluateManifestRequiredFields(snapshot: ManifestSnapshot): readonly SubstrateFinding[] {
  return snapshot.surfaces.flatMap((surface) =>
    snapshot.requiredContractFields.flatMap((field) => {
      if (hasPresentField(surface.fields, field)) {
        return [];
      }

      return [
        finding({
          id: 'surface-contract-field-missing',
          surface: surface.id,
          severity: 'blocking',
          repair: 'manual-with-provenance',
          message: `Surface ${surface.id} is missing required contract field ${field}.`,
          evidence: [surface.path],
        }),
      ];
    }),
  );
}

function evaluateMigrationLedgerCount(
  snapshot: MigrationLedgerSnapshot,
): readonly SubstrateFinding[] {
  if (snapshot.entries.length === snapshot.expectedEntryCount) {
    return [];
  }

  return [
    finding({
      id: 'migration-ledger-count-drift',
      surface: LEDGER_SURFACE,
      severity: 'blocking',
      repair: 'manual-with-provenance',
      message:
        `Migration ledger ${snapshot.ledgerPath} declares ${snapshot.entries.length} entries; ` +
        `expected ${snapshot.expectedEntryCount}.`,
      evidence: [snapshot.ledgerPath],
    }),
  ];
}

function evaluateDuplicateLedgerPaths(
  paths: readonly string[],
  id: 'migration-ledger-duplicate-original-path' | 'migration-ledger-duplicate-target-path',
  pathKind: 'original' | 'target',
): readonly SubstrateFinding[] {
  const duplicates = new Set(paths.filter((path, index) => paths.indexOf(path) !== index));
  return [...duplicates].map((path) =>
    finding({
      id,
      surface: LEDGER_SURFACE,
      severity: 'blocking',
      repair: 'manual-with-provenance',
      message: `Migration ledger contains duplicate ${pathKind} path ${path}.`,
      evidence: [path],
    }),
  );
}

function evaluateLedgerTargetByteCounts(
  entries: readonly MigrationLedgerEntrySnapshot[],
): readonly SubstrateFinding[] {
  return entries.flatMap((entry) => {
    if (entry.actualByteCount === undefined || entry.actualByteCount === entry.recordedByteCount) {
      return [];
    }

    return [
      finding({
        id: 'migration-ledger-target-byte-count-drift',
        surface: LEDGER_SURFACE,
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: `Migration target ${entry.targetPath} byte count does not match the ledger.`,
        evidence: [entry.targetPath],
      }),
    ];
  });
}

function evaluateLedgerTargetHashes(
  entries: readonly MigrationLedgerEntrySnapshot[],
): readonly SubstrateFinding[] {
  return entries.flatMap((entry) => {
    if (entry.actualSha256 === undefined || entry.actualSha256 === entry.recordedSha256) {
      return [];
    }

    return [
      finding({
        id: 'migration-ledger-target-hash-drift',
        surface: LEDGER_SURFACE,
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: `Migration target ${entry.targetPath} SHA-256 does not match the ledger.`,
        evidence: [entry.targetPath],
      }),
    ];
  });
}

function readStringField(fields: JsonFieldMap, field: string): string | undefined {
  const value = fields[field];
  return typeof value === 'string' && value.trim().length > 0 ? value : undefined;
}

function hasPresentField(fields: JsonFieldMap, field: string): boolean {
  const value = fields[field];
  return typeof value === 'string' ? value.trim().length > 0 : value !== undefined;
}
