/**
 * HybridDataSource - Composes bulk download data with API supplementation.
 *
 * @remarks
 * This data source implements the bulk-first ingestion strategy:
 * 1. Primary data comes from bulk downloads (fast, complete)
 * 2. API supplements missing data (KS4 tiers, categories)
 *
 * @see ADR-080 KS4 Metadata Denormalisation Strategy
 */

import type {
  BulkDownloadFile,
  Lesson,
  Unit,
} from '@oaknational/oak-curriculum-sdk/public/bulk.js';
import type { SearchLessonsIndexDoc, SearchUnitsIndexDoc, SearchSubjectSlug } from '../types/oak';
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
  readonly ks4LessonsEnriched: number;
  readonly ks4UnitsEnriched: number;
}

/** Interface for the hybrid data source */
export interface HybridDataSource {
  readonly sequenceSlug: string;
  readonly subjectSlug: SearchSubjectSlug;
  readonly subjectTitle: string;
  getUnits(): readonly Unit[];
  getLessons(): readonly Lesson[];
  transformLessonsToES(): readonly SearchLessonsIndexDoc[];
  transformUnitsToES(): readonly SearchUnitsIndexDoc[];
  toBulkOperations(
    lessonsIndex: string,
    unitsIndex: string,
  ): readonly (BulkIndexAction | SearchLessonsIndexDoc | SearchUnitsIndexDoc)[];
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

// ============================================================================
// Factory
// ============================================================================

/**
 * Create a hybrid data source from bulk file data.
 */
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

  const transformLessons = (): readonly SearchLessonsIndexDoc[] =>
    enrichLessons(bulkAdapter.transformLessonsToES(), ks4Context, tracker);

  const transformUnits = (): readonly SearchUnitsIndexDoc[] =>
    enrichUnits(bulkAdapter.transformUnitsToES(), ks4Context, tracker);

  return {
    sequenceSlug: bulkFile.sequenceSlug,
    subjectSlug,
    subjectTitle: bulkFile.subjectTitle,
    getUnits: () => bulkAdapter.getUnits(),
    getLessons: () => bulkAdapter.getLessons(),
    transformLessonsToES: transformLessons,
    transformUnitsToES: transformUnits,
    toBulkOperations(lessonsIndex, unitsIndex) {
      const ops: (BulkIndexAction | SearchLessonsIndexDoc | SearchUnitsIndexDoc)[] = [];
      for (const doc of transformLessons()) {
        ops.push({ index: { _index: lessonsIndex, _id: doc.lesson_id } });
        ops.push(doc);
      }
      for (const doc of transformUnits()) {
        ops.push({ index: { _index: unitsIndex, _id: doc.unit_id } });
        ops.push(doc);
      }
      return ops;
    },
    getStats: () => ({
      lessonCount: bulkAdapter.getLessons().length,
      unitCount: bulkAdapter.getUnits().length,
      ks4LessonsEnriched: tracker.lessonsEnriched,
      ks4UnitsEnriched: tracker.unitsEnriched,
    }),
  };
}
