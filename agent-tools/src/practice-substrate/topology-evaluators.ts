import { finding } from './finding.js';
import {
  type MergeTopologySnapshot,
  type RepairPreservationCase,
  type RepairPreservationClassification,
  type SubstrateFinding,
  type SubstrateSeverity,
} from './types.js';

/**
 * Classify injected git-topology facts for memory/state merge claims.
 */
export function evaluateMergeTopology(
  snapshot: MergeTopologySnapshot,
): readonly SubstrateFinding[] {
  if (snapshot.claim !== 'completed-memory-state-merge') {
    return [];
  }
  if (snapshot.workflow !== 'merge') {
    return [
      finding({
        id: 'memory-state-non-merge-topology',
        surface: snapshot.surface,
        severity: nonMergeSeverity(snapshot.nonMergeTreatment),
        repair: 'forbidden',
        message:
          `${snapshot.workflow} workflow cannot prove memory/state merge parentage ` +
          `for ${snapshot.targetRef}.`,
        evidence: snapshot.touchedMemoryStatePaths,
      }),
    ];
  }
  if (snapshot.parentCount < 2 || !snapshot.targetRefReachable) {
    return [
      finding({
        id: 'memory-state-single-parent-merge-claim',
        surface: snapshot.surface,
        severity: 'blocking',
        repair: 'forbidden',
        message: `Commit ${snapshot.candidateCommit} does not prove merge topology.`,
        evidence: snapshot.touchedMemoryStatePaths,
      }),
    ];
  }

  return [];
}

/**
 * Classify whether a repair may be automatic while preserving evidence.
 */
export function classifyRepairPreservation(
  input: RepairPreservationCase,
): RepairPreservationClassification {
  if (input.kind === 'exact-duplicate') {
    return {
      ...input,
      severity: 'blocking',
      repair: 'deterministic',
      message: 'Exact duplicate identity and content can be deduplicated deterministically.',
    };
  }
  if (input.kind === 'same-prose-different-context') {
    return {
      ...input,
      severity: 'review-required',
      repair: 'forbidden',
      message: 'Same prose in different historical contexts is evidence, not a duplicate.',
    };
  }

  return {
    ...input,
    severity: 'informational',
    repair: 'forbidden',
    message: 'Archived retired-path reference must remain preserved as historical evidence.',
  };
}

function nonMergeSeverity(treatment: 'blocking' | 'report-only'): SubstrateSeverity {
  return treatment === 'blocking' ? 'blocking' : 'informational';
}
