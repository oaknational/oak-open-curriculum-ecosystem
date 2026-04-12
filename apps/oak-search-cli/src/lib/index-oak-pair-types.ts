/**
 * Shared types for Oak curriculum pair-building operations.
 *
 * Leaf module extracted to break the circular dependency between
 * `index-oak-helpers.ts` and `index-oak-build-helpers.ts`.
 *
 * @packageDocumentation
 */

import type { KeyStage, SearchSubjectSlug } from '../types/oak';
import type { OakClient, SubjectSequenceEntry } from '../adapters/oak-adapter-types';
import type { SequenceFacetSource } from './indexing/sequence-facets';
import type { DataIntegrityReport } from './indexing/data-integrity-report';
import type { UnitContextMap } from './indexing/ks4-context-builder';

/** Context for building a subject/keystage pair. */
export interface PairBuildContext {
  readonly client: OakClient;
  readonly ks: KeyStage;
  readonly subject: SearchSubjectSlug;
  readonly subjectSequences: readonly SubjectSequenceEntry[];
  readonly sequenceSources: ReadonlyMap<string, SequenceFacetSource>;
  /** KS4 metadata context for units (tiers, exam boards, etc.) per ADR-080 */
  readonly unitContextMap: UnitContextMap;
  readonly dataIntegrityReport: DataIntegrityReport;
}

/** Single unit entry in a subject/keystage pair. */
export interface PairUnit {
  readonly unitSlug: string;
  readonly unitTitle: string;
}
