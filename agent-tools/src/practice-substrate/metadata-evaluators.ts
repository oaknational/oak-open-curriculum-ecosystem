import { duplicateIdentityGroups, finding } from './finding.js';
import {
  type MergeClassSnapshot,
  type StableIdentitySnapshot,
  type SubstrateFinding,
} from './types.js';

const MERGE_CLASSES = new Set([
  'append-only-narrative',
  'mostly-append-register',
  'index-narrative-tables',
  'exclusive-create-fragments',
]);

/**
 * Detect missing or invalid merge-class declarations from injected metadata.
 */
export function evaluateMergeClassDeclarations(
  snapshots: readonly MergeClassSnapshot[],
): readonly SubstrateFinding[] {
  return snapshots.flatMap(evaluateMergeClassDeclaration);
}

/**
 * Detect duplicate stable identities and classify semantic collisions.
 */
export function evaluateStableIdentityCollisions(
  snapshot: StableIdentitySnapshot,
): readonly SubstrateFinding[] {
  const duplicates = duplicateIdentityGroups(snapshot.entries);
  return duplicates.map((entries) => {
    const stableId = entries[0]?.stableId ?? '';
    const sameContent = entries.every(
      (entry) => entry.contentIdentity === entries[0]?.contentIdentity,
    );
    if (snapshot.duplicateClass === 'invalid-duplicate' && sameContent) {
      return finding({
        id: 'duplicate-stable-id',
        surface: snapshot.surface,
        severity: 'blocking',
        repair: 'deterministic',
        message: `Stable identity ${stableId} is duplicated with identical content.`,
        evidence: entries.map((entry) => entry.context),
      });
    }

    return finding({
      id: 'same-key-semantic-collision',
      surface: snapshot.surface,
      severity: 'review-required',
      repair: 'forbidden',
      message: `Stable identity ${stableId} has competing semantic content.`,
      evidence: entries.map((entry) => entry.context),
    });
  });
}

function evaluateMergeClassDeclaration(snapshot: MergeClassSnapshot): readonly SubstrateFinding[] {
  if (snapshot.mergeClass === undefined || snapshot.mergeClass.trim().length === 0) {
    return [
      finding({
        id: 'merge-class-missing',
        surface: snapshot.surface,
        severity: 'review-required',
        repair: 'manual-with-provenance',
        message: `${snapshot.surfaceKind} surface is missing merge_class metadata.`,
        evidence: [snapshot.path],
      }),
    ];
  }
  if (!isKnownMergeClass(snapshot.mergeClass)) {
    return [
      finding({
        id: 'merge-class-invalid',
        surface: snapshot.surface,
        severity: 'blocking',
        repair: 'manual-with-provenance',
        message: `merge_class ${snapshot.mergeClass} is not a PDR-049 token.`,
        evidence: [snapshot.path],
      }),
    ];
  }

  return [];
}

function isKnownMergeClass(value: string): boolean {
  return MERGE_CLASSES.has(value) || isStructuredAppendMergeClass(value);
}

function isStructuredAppendMergeClass(value: string): boolean {
  const prefix = 'append-only-structured-by-';
  return value.startsWith(prefix) && value.slice(prefix.length).trim().length > 0;
}
