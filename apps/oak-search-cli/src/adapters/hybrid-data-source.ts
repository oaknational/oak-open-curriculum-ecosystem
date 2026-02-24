/**
 * HybridDataSource - Composes bulk download data with API supplementation.
 *
 * @remarks
 * This data source implements the bulk-first ingestion strategy:
 * 1. Primary data comes from bulk downloads (fast, complete)
 * 2. API supplements missing data (KS4 tiers, categories)
 * 3. Generates rollup documents for unit search
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 * @see ADR-093 Bulk-First Ingestion Strategy
 */

import type { BulkDownloadFile, Lesson, Unit } from '@oaknational/curriculum-sdk-generation/bulk';
import type {
  SearchLessonsIndexDoc,
  SearchUnitsIndexDoc,
  SearchUnitRollupDoc,
  SearchSubjectSlug,
} from '../types/oak';
import type { OakClient } from './oak-adapter';
import { createBulkDataAdapter, type BulkIndexAction } from './bulk-data-adapter';
import {
  buildKs4SupplementationContext,
  enrichLessonDocWithKs4,
  enrichUnitDocWithKs4,
  isKs4,
  subjectHasKs4Tiers,
  type Ks4SupplementationContext,
} from './api-supplementation';
import { isSubject } from './sdk-guards';
import { buildRollupDocs } from './bulk-rollup-builder';
import { createEmptyUnitContextMap } from '../lib/indexing/ks4-context-builder';

// ============================================================================
// Types
// ============================================================================

/** Configuration for hybrid data source */
export interface HybridDataSourceConfig {
  readonly enableKs4Supplementation: boolean;
}

/** Statistics from hybrid data source processing */
export interface HybridDataSourceStats {
  readonly lessonCount: number;
  readonly unitCount: number;
  readonly rollupCount: number;
  readonly ks4LessonsEnriched: number;
  readonly ks4UnitsEnriched: number;
}

/** Bulk operation entry (action or document) */
type BulkOperationEntry =
  | BulkIndexAction
  | SearchLessonsIndexDoc
  | SearchUnitsIndexDoc
  | SearchUnitRollupDoc;

/** Interface for the hybrid data source */
export interface HybridDataSource {
  readonly sequenceSlug: string;
  readonly subjectSlug: SearchSubjectSlug;
  readonly subjectTitle: string;
  getUnits(): readonly Unit[];
  getLessons(): readonly Lesson[];
  transformLessonsToES(): readonly SearchLessonsIndexDoc[];
  transformUnitsToES(): readonly SearchUnitsIndexDoc[];
  transformUnitsToRollupDocs(): readonly SearchUnitRollupDoc[];
  toBulkOperations(
    lessonsIndex: string,
    unitsIndex: string,
    rollupIndex: string,
  ): readonly BulkOperationEntry[];
  getStats(): HybridDataSourceStats;
}

// ============================================================================
// Default Configuration
// ============================================================================

const DEFAULT_CONFIG: HybridDataSourceConfig = {
  enableKs4Supplementation: true,
};

// ============================================================================
// Helpers
// ============================================================================

/** Derive subject slug from sequence slug */
function deriveSubjectSlug(sequenceSlug: string): SearchSubjectSlug {
  const parts = sequenceSlug.split('-');
  const phase = parts[parts.length - 1];
  const subjectPart = parts.slice(0, -1).join('-');

  const candidate = phase === 'primary' || phase === 'secondary' ? subjectPart : parts[0];

  if (!candidate || !isSubject(candidate)) {
    throw new Error(`Cannot derive valid subject from sequence: ${sequenceSlug}`);
  }
  return candidate;
}

/** Build KS4 context if needed */
async function buildKs4Context(
  client: OakClient | null,
  subjectSlug: SearchSubjectSlug,
  enabled: boolean,
): Promise<Ks4SupplementationContext | null> {
  if (!enabled || !subjectHasKs4Tiers(subjectSlug) || !client) {
    return null;
  }
  return buildKs4SupplementationContext(client, subjectSlug);
}

// ============================================================================
// Enrichment Functions
// ============================================================================

/** Track enrichment stats */
interface EnrichmentTracker {
  lessonsEnriched: number;
  unitsEnriched: number;
}

function createEnrichmentTracker(): EnrichmentTracker {
  return { lessonsEnriched: 0, unitsEnriched: 0 };
}

/** Enrich lesson documents with KS4 data */
function enrichLessons(
  docs: readonly SearchLessonsIndexDoc[],
  ks4Context: Ks4SupplementationContext | null,
  tracker: EnrichmentTracker,
): SearchLessonsIndexDoc[] {
  if (!ks4Context) {
    return [...docs];
  }

  return docs.map((doc) => {
    if (!isKs4(doc.key_stage)) {
      return doc;
    }
    const enriched = enrichLessonDocWithKs4(doc, ks4Context);
    if (enriched !== doc) {
      tracker.lessonsEnriched++;
    }
    return enriched;
  });
}

/** Enrich unit documents with KS4 data */
function enrichUnits(
  docs: readonly SearchUnitsIndexDoc[],
  ks4Context: Ks4SupplementationContext | null,
  tracker: EnrichmentTracker,
): SearchUnitsIndexDoc[] {
  if (!ks4Context) {
    return [...docs];
  }
  return docs.map((doc) => {
    if (!isKs4(doc.key_stage)) {
      return doc;
    }
    const enriched = enrichUnitDocWithKs4(doc, ks4Context);
    if (enriched !== doc) {
      tracker.unitsEnriched++;
    }
    return enriched;
  });
}

/** Build bulk operations from transformed documents */
function buildBulkOps(
  lessons: readonly SearchLessonsIndexDoc[],
  units: readonly SearchUnitsIndexDoc[],
  rollups: readonly SearchUnitRollupDoc[],
  lessonsIndex: string,
  unitsIndex: string,
  rollupIndex: string,
): BulkOperationEntry[] {
  const ops: BulkOperationEntry[] = [];
  for (const doc of lessons) {
    ops.push({ index: { _index: lessonsIndex, _id: doc.lesson_id } }, doc);
  }
  for (const doc of units) {
    ops.push({ index: { _index: unitsIndex, _id: doc.unit_id } }, doc);
  }
  for (const doc of rollups) {
    ops.push({ index: { _index: rollupIndex, _id: doc.unit_id } }, doc);
  }
  return ops;
}

/** Create a hybrid data source from bulk file data. */
export async function createHybridDataSource(
  bulkFile: BulkDownloadFile,
  client: OakClient | null,
  config: Partial<HybridDataSourceConfig> = {},
): Promise<HybridDataSource> {
  const fullConfig = { ...DEFAULT_CONFIG, ...config };
  const bulkAdapter = createBulkDataAdapter(bulkFile);
  const subjectSlug = deriveSubjectSlug(bulkFile.sequenceSlug);
  const ks4Context = await buildKs4Context(
    client,
    subjectSlug,
    fullConfig.enableKs4Supplementation,
  );
  const tracker = createEnrichmentTracker();
  const unitContextMap = ks4Context?.unitContextMap ?? createEmptyUnitContextMap();
  const transformLessons = () =>
    enrichLessons(bulkAdapter.transformLessonsToES(), ks4Context, tracker);
  const transformUnits = () => enrichUnits(bulkAdapter.transformUnitsToES(), ks4Context, tracker);
  const transformRollups = () =>
    buildRollupDocs(
      bulkAdapter.getUnits(),
      bulkAdapter.getLessons(),
      subjectSlug,
      bulkFile.subjectTitle,
      bulkFile.sequenceSlug,
      unitContextMap,
    );

  return {
    sequenceSlug: bulkFile.sequenceSlug,
    subjectSlug,
    subjectTitle: bulkFile.subjectTitle,
    getUnits: () => bulkAdapter.getUnits(),
    getLessons: () => bulkAdapter.getLessons(),
    transformLessonsToES: transformLessons,
    transformUnitsToES: transformUnits,
    transformUnitsToRollupDocs: transformRollups,
    toBulkOperations: (li, ui, ri) =>
      buildBulkOps(transformLessons(), transformUnits(), transformRollups(), li, ui, ri),
    getStats: () => ({
      lessonCount: bulkAdapter.getLessons().length,
      unitCount: bulkAdapter.getUnits().length,
      rollupCount: bulkAdapter.getUnits().length,
      ks4LessonsEnriched: tracker.lessonsEnriched,
      ks4UnitsEnriched: tracker.unitsEnriched,
    }),
  };
}
