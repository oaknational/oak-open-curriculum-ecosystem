import { finding } from './finding.js';
import {
  type LegacyEventRootSnapshot,
  type RetiredPathReferenceSnapshot,
  type SubstrateFinding,
} from './types.js';

/**
 * Evaluate the retired collaboration event root from an injected directory
 * snapshot.
 */
export function evaluateLegacyEventRoot(
  snapshot: LegacyEventRootSnapshot,
): readonly SubstrateFinding[] {
  if (snapshot.rootExists === false) {
    return [];
  }
  if (snapshot.entries.length === 0 && snapshot.rootExists !== true) {
    return [];
  }

  const liveEntries = snapshot.entries.filter((entry) => entry.kind === 'json');
  if (liveEntries.length === 0) {
    return [
      finding({
        id: 'legacy-event-root-present',
        surface: snapshot.surface,
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: `Legacy event root ${snapshot.legacyRoot} still exists on disk.`,
        evidence:
          snapshot.entries.length === 0
            ? [snapshot.legacyRoot]
            : snapshot.entries.map((entry) => entry.path),
      }),
    ];
  }

  return [
    finding({
      id: 'legacy-event-root-live-json',
      surface: snapshot.surface,
      severity: 'blocking',
      repair: 'manual-with-provenance',
      message: `Legacy event root ${snapshot.legacyRoot} contains live JSON fragments.`,
      evidence: liveEntries.map((entry) => entry.path),
    }),
  ];
}

/**
 * Classify references to retired paths without reading files.
 */
export function evaluateRetiredPathReferences(
  snapshots: readonly RetiredPathReferenceSnapshot[],
): readonly SubstrateFinding[] {
  return snapshots.flatMap(evaluateRetiredPathReference);
}

function evaluateRetiredPathReference(
  snapshot: RetiredPathReferenceSnapshot,
): readonly SubstrateFinding[] {
  if (!snapshot.text.includes(snapshot.retiredPath)) {
    return [];
  }
  if (snapshot.lifecycle === 'live') {
    return [
      finding({
        id: 'retired-path-live-reference',
        surface: snapshot.surface,
        severity: 'blocking',
        repair: 'deterministic',
        message:
          `Live surface references retired path ${snapshot.retiredPath}; ` +
          `use ${snapshot.canonicalPath}.`,
        evidence: [snapshot.path],
      }),
    ];
  }

  return [
    finding({
      id: 'retired-path-historical-reference',
      surface: snapshot.surface,
      severity: 'informational',
      repair: 'forbidden',
      message: `Historical surface preserves retired path ${snapshot.retiredPath} as evidence.`,
      evidence: [snapshot.path],
    }),
  ];
}
