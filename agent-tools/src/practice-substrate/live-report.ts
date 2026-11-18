import { listIgnoredPaths } from '../core/repository-paths.js';
import { type InstanceTierProbe } from './instance-tier.js';
import { evaluateLegacyEventsRoot, evaluateOptionalGitTopology } from './live-files.js';
import { evaluateLiveOpenQuestions } from './live-open-questions.js';
import { evaluateRetiredPathScan } from './live-retired-paths.js';
import {
  evaluateCollaborationJsonSurfaces,
  evaluateMigrationLedgers,
  readManifest,
} from './live-json.js';
import { CLAIM_REGISTRIES } from './live-collaboration-records.js';
import { evaluateSharedCommsLog } from './live-shared-comms-log.js';
import {
  createPracticeSubstrateReport,
  type PracticeSubstrateCliOptions,
  type PracticeSubstrateReport,
} from './report.js';
import { evaluateManifestSnapshot, type ManifestSurfaceSnapshot } from './report-evaluators.js';
import { finding } from './finding.js';
import {
  SHARED_COMMS_LOG,
  readOptionalString,
  readString,
  type ManifestDocument,
} from './live-types.js';
import { type SubstrateFinding } from './types.js';

// Subtraction guard, not a moving mirror: this pin forces a provenance-carrying
// edit here whenever a manifest surface is added or retired. 24 since 2026-09-13,
// when the documentation-sync-logs and deferred-controls-register surfaces were
// declared; update this constant in the same PR as any future surface addition
// or retirement.
const EXPECTED_MANIFEST_SURFACES = 24;

/**
 * The surfaces whose absence the readers classify, taken from the readers
 * themselves. The audit names what it reads; the ignore rules and the tracked
 * tree say which of these are instance tier, so no list here does.
 */
const CLASSIFIED_SURFACES: readonly string[] = [
  ...CLAIM_REGISTRIES.map((registry) => registry.path),
  SHARED_COMMS_LOG,
];

/**
 * Build the read-only report from live repo state.
 */
export async function createLivePracticeSubstrateReport(
  options: PracticeSubstrateCliOptions,
): Promise<PracticeSubstrateReport> {
  const repoRoot = options.repoRoot ?? '.';
  const manifestResult = await safeReadManifest(repoRoot);
  const probe = readInstanceTierProbe(repoRoot);

  return createPracticeSubstrateReport(
    [
      ...manifestResult.findings,
      ...(await evaluateManifestRelatedLiveFindings(repoRoot, manifestResult.manifest)),
      ...(await evaluateAlwaysLiveFindings(repoRoot, probe)),
      ...(await evaluateTargetRefLiveFindings(repoRoot, options.targetRef)),
    ],
    options.mode,
  );
}

/**
 * The repository's own answer, read once per report: which classified surfaces
 * git keeps out of every checkout. A git failure is carried, not thrown, and
 * fails only a surface that turns out to be absent.
 */
function readInstanceTierProbe(repoRoot: string): InstanceTierProbe {
  return listIgnoredPaths(repoRoot, CLASSIFIED_SURFACES);
}

async function safeReadManifest(repoRoot: string): Promise<{
  readonly manifest?: ManifestDocument;
  readonly findings: readonly SubstrateFinding[];
}> {
  try {
    return await readManifest(repoRoot);
  } catch (error) {
    return {
      findings: [liveReadFailureFinding('substrate-inventory', error)],
    };
  }
}

async function collectLiveFindings(
  surface: string,
  read: () => Promise<readonly SubstrateFinding[]>,
): Promise<readonly SubstrateFinding[]> {
  try {
    return await read();
  } catch (error) {
    return [liveReadFailureFinding(surface, error)];
  }
}

function liveReadFailureFinding(surface: string, error: unknown): SubstrateFinding {
  return finding({
    id: 'live-reader-failure',
    surface,
    severity: 'blocking',
    repair: 'manual-with-provenance',
    message: `Live substrate reader failed: ${error instanceof Error ? error.message : String(error)}.`,
  });
}

async function evaluateManifestRelatedLiveFindings(
  repoRoot: string,
  manifest: ManifestDocument | undefined,
): Promise<readonly SubstrateFinding[]> {
  if (manifest === undefined) {
    return [];
  }

  return [
    ...evaluateManifestFromLiveSnapshot(manifest),
    ...(await collectLiveFindings('legacy-comms-events-migration-ledger', () =>
      evaluateMigrationLedgers(repoRoot, manifest),
    )),
    ...(await collectLiveFindings('retired-path-scan', () =>
      evaluateRetiredPathScan(repoRoot, manifest),
    )),
  ];
}

async function evaluateAlwaysLiveFindings(
  repoRoot: string,
  probe: InstanceTierProbe,
): Promise<readonly SubstrateFinding[]> {
  return [
    ...(await collectLiveFindings('collaboration-comms-legacy', () =>
      evaluateLegacyEventsRoot(repoRoot),
    )),
    ...(await collectLiveFindings('collaboration-json-surfaces', () =>
      evaluateCollaborationJsonSurfaces(repoRoot, probe),
    )),
    ...(await collectLiveFindings('collaboration-shared-comms-log', () =>
      evaluateSharedCommsLog(repoRoot, probe),
    )),
    ...(await collectLiveFindings('memory-operational-open-questions', () =>
      evaluateLiveOpenQuestions(repoRoot),
    )),
  ];
}

async function evaluateTargetRefLiveFindings(
  repoRoot: string,
  targetRef: string | undefined,
): Promise<readonly SubstrateFinding[]> {
  if (targetRef === undefined) {
    return [];
  }

  return collectLiveFindings('git-topology', () =>
    evaluateOptionalGitTopology(repoRoot, targetRef),
  );
}

function evaluateManifestFromLiveSnapshot(manifest: ManifestDocument): readonly SubstrateFinding[] {
  return evaluateManifestSnapshot({
    manifestPath: '.agent/memory/executive/memory-state-substrate-contracts.manifest.json',
    expectedSurfaceCount: EXPECTED_MANIFEST_SURFACES,
    requiredContractFields: manifest.surface_defaults?.required_contract_fields ?? [],
    surfaces: (manifest.surfaces ?? []).map(toManifestSurfaceSnapshot),
  });
}

function toManifestSurfaceSnapshot(
  surface: ManifestSurfaceSnapshot['fields'],
): ManifestSurfaceSnapshot {
  const path = readString(surface, 'path');
  return {
    id: readString(surface, 'id'),
    path,
    fields: surface,
    surfaceKind: surfaceKindForPath(path, readOptionalString(surface, 'schema_or_parser')),
  };
}

function surfaceKindForPath(
  path: string,
  schemaOrParser: string | undefined,
): ManifestSurfaceSnapshot['surfaceKind'] {
  if (path.endsWith('/') && schemaOrParser?.includes('.schema.json') === true) {
    return 'json-schema';
  }
  if (path.endsWith('/')) {
    return 'directory-readme';
  }

  return path.endsWith('.schema.json') ? 'json-schema' : 'markdown';
}
