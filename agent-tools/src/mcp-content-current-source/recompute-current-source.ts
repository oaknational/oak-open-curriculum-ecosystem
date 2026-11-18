import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { buildCurrentSourceTruthSet } from './build-current-source-truth-set.js';
import {
  AUDIT_REPORT,
  BASELINE_ARTIFACT,
  BASELINE_COMMIT,
  BASELINE_REGISTRY_SHA256,
  CURRENT_SOURCE_ANCHORS,
} from './current-source-config.js';
import {
  buildCurrentSourceAdditions,
  currentSourceAdditionFiles,
} from './current-source-additions.js';
import { buildAnchoredDispositions } from './current-source-dispositions.js';
import {
  currentTargetsByAuditId,
  parseBaselineRows,
  readCurrentContent,
  resolveAnchorManifest,
  type BaselineEvidenceRow,
} from './current-source-evidence-files.js';
import type {
  CurrentAuditDisposition,
  CurrentSourceAdditionDisposition,
  CurrentSourceAnchorManifest,
  CurrentSourceTruthSet,
  RegistrationRoot,
  RegistrationSourceEvidence,
} from './current-source-model.js';
import { updateCurrentSourceReportSummary } from './current-source-report-summary.js';
import { requireGuidanceRegistrationParity } from './guidance-registration-parity.js';
import { normaliseLineEndings } from './normalise-line-endings.js';
import { CURRENT_ITEM_LINEAGE_ENTRIES, GUIDANCE_SOURCE_ENTRIES } from './prompt-era-lineage.js';
import { requireSameStringMembers } from './require-same-string-members.js';
import { walkHttpRegistrationRoot } from './walk-http-registration-root.js';

type RegistrationIndex = Readonly<Record<string, RegistrationSourceEvidence>>;
type RegistrationWalk = Awaited<ReturnType<typeof walkHttpRegistrationRoot>>;

export interface RecomputedCurrentSource {
  readonly serialised: string;
  readonly anchorSerialised: string | null;
  readonly reportSerialised: string;
  readonly itemCount: number;
}

const guidanceSourcePaths = GUIDANCE_SOURCE_ENTRIES.map((entry) => entry[0]);
const currentItemLineage = new Map<string, readonly string[]>(CURRENT_ITEM_LINEAGE_ENTRIES);

function sha256(content: string): string {
  return createHash('sha256').update(content).digest('hex');
}

async function loadImmutableBaseline(repoRoot: string): Promise<readonly BaselineEvidenceRow[]> {
  const baselineJson = normaliseLineEndings(
    await readFile(path.join(repoRoot, BASELINE_ARTIFACT), 'utf8'),
  );
  const actualHash = sha256(baselineJson);
  if (actualHash !== BASELINE_REGISTRY_SHA256) {
    throw new Error(
      `${BASELINE_ARTIFACT} changed; phase-(a) is immutable\n` +
        `expected sha256: ${BASELINE_REGISTRY_SHA256}\nactual sha256:   ${actualHash}`,
    );
  }
  return parseBaselineRows(baselineJson);
}

function requireCurrentSourceCoverage(
  current: readonly CurrentAuditDisposition[],
  missingAuditIds: readonly string[],
  registrationsBySource: RegistrationIndex,
): void {
  requireSameStringMembers(
    'Absent baseline rows and explicit current item lineage',
    CURRENT_ITEM_LINEAGE_ENTRIES.map((entry) => entry[0]),
    missingAuditIds,
  );
  const classifiedSources = new Set(current.flatMap((item) => item.files));
  requireSameStringMembers(
    'Current guidance replacements and classified current sources',
    guidanceSourcePaths,
    guidanceSourcePaths.filter((source) => classifiedSources.has(source)),
  );
  requireGuidanceRegistrationParity(GUIDANCE_SOURCE_ENTRIES, registrationsBySource);
}

function buildTruthSet(
  baseline: readonly BaselineEvidenceRow[],
  dispositions: {
    readonly current: readonly CurrentAuditDisposition[];
    readonly retiredAuditIds: readonly string[];
  },
  additions: readonly CurrentSourceAdditionDisposition[],
  registrationRoot: RegistrationRoot,
): CurrentSourceTruthSet {
  return buildCurrentSourceTruthSet({
    provenance: {
      title: 'Oak MCP agent-facing content current-source truth set',
      baselineCommit: BASELINE_COMMIT,
      baselineArtifact: BASELINE_ARTIFACT,
      baselineSha256: BASELINE_REGISTRY_SHA256,
      currentEvidence: [
        registrationRoot.rootRef,
        registrationRoot.registrationRef,
        'apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts',
        'packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/agent-guidance-resources.ts',
      ],
      evidenceCeiling: [
        'Every immutable phase-(a) id has reviewed item-level token anchors, not source-file existence alone.',
        'Post-baseline additions are source-owned review entries.',
        'Workspace scope and word authority are independent: scope follows workspace_scope; authority follows source_locus.',
        'The HTTP registration root is recomputed over an in-memory MCP transport; allowlist policy alone is not proof of liveness.',
        'Exact channel bindings cover the prompt-to-guidance replacements; later migration slices add bindings for other rows.',
        'Host delivery is not inferred from Oak registration. Host evidence remains empty until separately verified and dated.',
      ],
    },
    baseline,
    current: dispositions.current,
    additions,
    retiredAuditIds: dispositions.retiredAuditIds,
    registrationRoots: [registrationRoot],
  });
}

interface CurrentContext {
  readonly anchorManifest: CurrentSourceAnchorManifest;
  readonly dispositions: ReturnType<typeof buildAnchoredDispositions>;
  readonly additions: readonly CurrentSourceAdditionDisposition[];
  readonly registrationWalk: RegistrationWalk;
}

async function loadCurrentContext(
  repoRoot: string,
  baseline: readonly BaselineEvidenceRow[],
  refreshAnchors: boolean,
): Promise<CurrentContext> {
  const targetsByAuditId = await currentTargetsByAuditId(repoRoot, baseline, currentItemLineage);
  const anchorManifest = await resolveAnchorManifest({
    repoRoot,
    anchorArtifact: CURRENT_SOURCE_ANCHORS,
    baselineCommit: BASELINE_COMMIT,
    baselineSha256: BASELINE_REGISTRY_SHA256,
    baseline,
    targetsByAuditId,
    refresh: refreshAnchors,
  });
  const registrationWalk = await walkHttpRegistrationRoot(repoRoot);
  const contentByFile = await readCurrentContent(repoRoot, [
    ...anchorManifest.items.flatMap((item) => item.evidence.targets.map((target) => target.file)),
    ...currentSourceAdditionFiles(),
  ]);
  const dispositions = buildAnchoredDispositions({
    baseline,
    registrationsBySource: registrationWalk.guidanceRegistrationsBySource,
    targetsByAuditId,
    anchorManifest,
    contentByFile,
    baselineCommit: BASELINE_COMMIT,
    baselineSha256: BASELINE_REGISTRY_SHA256,
    anchorArtifact: CURRENT_SOURCE_ANCHORS,
  });
  requireCurrentSourceCoverage(
    dispositions.current,
    dispositions.missingAuditIds,
    registrationWalk.guidanceRegistrationsBySource,
  );
  return {
    anchorManifest,
    dispositions,
    additions: buildCurrentSourceAdditions(
      contentByFile,
      registrationWalk.guidanceRegistrationsBySource,
    ),
    registrationWalk,
  };
}

/** Recomputes every current-source artifact before any write is attempted. */
export async function recomputeCurrentSource(
  repoRoot: string,
  refreshAnchors: boolean,
): Promise<RecomputedCurrentSource> {
  const baseline = await loadImmutableBaseline(repoRoot);
  const context = await loadCurrentContext(repoRoot, baseline, refreshAnchors);
  const truthSet = buildTruthSet(
    baseline,
    context.dispositions,
    context.additions,
    context.registrationWalk.root,
  );
  const report = normaliseLineEndings(await readFile(path.join(repoRoot, AUDIT_REPORT), 'utf8'));
  return {
    serialised: `${JSON.stringify(truthSet, null, 2)}\n`,
    anchorSerialised: refreshAnchors
      ? `${JSON.stringify(context.anchorManifest, null, 2)}\n`
      : null,
    reportSerialised: updateCurrentSourceReportSummary(report, truthSet.summary),
    itemCount: truthSet.summary.itemCount,
  };
}
