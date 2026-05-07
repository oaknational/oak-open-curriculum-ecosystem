/**
 * Typed snapshot contracts for pure Practice substrate health evaluators.
 */

/**
 * Portable severity vocabulary from the substrate contract.
 */
export type SubstrateSeverity = 'blocking' | 'review-required' | 'informational';

/**
 * Portable repair vocabulary from the substrate contract.
 */
export type SubstrateRepairClass = 'deterministic' | 'manual-with-provenance' | 'forbidden';

/**
 * Structured output emitted by pure substrate evaluators.
 */
export interface SubstrateFinding {
  readonly id: string;
  readonly surface: string;
  readonly severity: SubstrateSeverity;
  readonly repair: SubstrateRepairClass;
  readonly message: string;
  readonly evidence?: readonly string[];
}

/**
 * One injected entry from the legacy collaboration event directory.
 */
interface LegacyEventRootEntry {
  readonly path: string;
  readonly kind: 'gitkeep' | 'json' | 'other';
}

/**
 * Injected snapshot for the retired legacy communication event root.
 */
export interface LegacyEventRootSnapshot {
  readonly surface: string;
  readonly legacyRoot: string;
  readonly entries: readonly LegacyEventRootEntry[];
}

/**
 * Injected prose surface used to classify retired-path references.
 */
export interface RetiredPathReferenceSnapshot {
  readonly surface: string;
  readonly path: string;
  readonly lifecycle: 'live' | 'archived' | 'historical';
  readonly text: string;
  readonly retiredPath: string;
  readonly canonicalPath: string;
}

/**
 * Injected metadata for a surface that should declare a PDR-049 merge class.
 */
export interface MergeClassSnapshot {
  readonly surface: string;
  readonly path: string;
  readonly surfaceKind: 'markdown' | 'json-schema' | 'directory-readme';
  readonly mergeClass?: string;
}

/**
 * One record with a stable substrate identity.
 */
export interface StableIdentityEntry {
  readonly stableId: string;
  readonly contentIdentity: string;
  readonly context: string;
}

/**
 * Injected identity set used to classify duplicate keys.
 */
export interface StableIdentitySnapshot {
  readonly surface: string;
  readonly duplicateClass: 'invalid-duplicate' | 'semantic-collision';
  readonly entries: readonly StableIdentityEntry[];
}

/**
 * Injected committed and regenerated versions of a generated read model.
 */
export interface GeneratedReadModelSnapshot {
  readonly surface: string;
  readonly outputPath: string;
  readonly committedText: string;
  readonly regeneratedText: string;
}

/**
 * Injected parse/schema result for a JSON-backed substrate surface.
 */
export interface ParseStateSnapshot {
  readonly surface: string;
  readonly path: string;
  readonly json: 'valid' | 'invalid';
  readonly schema: 'valid' | 'invalid' | 'not-applicable';
}

/**
 * Injected text body for marker-oriented structural checks.
 */
export interface TextSurfaceSnapshot {
  readonly surface: string;
  readonly path: string;
  readonly text: string;
}

/**
 * Injected git-topology facts for a claimed memory/state merge.
 */
export interface MergeTopologySnapshot {
  readonly surface: string;
  readonly candidateCommit: string;
  readonly targetRef: string;
  readonly parentCount: number;
  readonly targetRefReachable: boolean;
  readonly touchedMemoryStatePaths: readonly string[];
  readonly claim: 'completed-memory-state-merge' | 'ordinary-snapshot';
  readonly workflow: 'merge' | 'squash' | 'cherry-pick';
  readonly nonMergeTreatment: 'blocking' | 'report-only';
}

/**
 * Fixture cases for preservation-aware repair classification.
 */
/**
 * Injected preservation case for deterministic vs forbidden repair routing.
 */
export interface RepairPreservationCase {
  readonly surface: string;
  readonly path: string;
  readonly kind: 'exact-duplicate' | 'same-prose-different-context' | 'archived-reference';
}

/**
 * Classification result for preservation-aware repair routing.
 */
export interface RepairPreservationClassification {
  readonly surface: string;
  readonly path: string;
  readonly kind: RepairPreservationCase['kind'];
  readonly severity: SubstrateSeverity;
  readonly repair: SubstrateRepairClass;
  readonly message: string;
}
