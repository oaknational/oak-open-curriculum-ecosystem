import { SUBJECT_TO_PARENT } from '@oaknational/curriculum-sdk';
import type {
  AllSubjectSlug,
  KeyStage,
  SearchUnitRollupDoc,
  SearchUnitSummary,
} from '../../types/oak';
import {
  createEnrichedRollupText,
  extractKs4DocumentFields,
  extractPedagogicalData,
  extractRollupDocumentFields,
  extractUnitEnrichmentFields,
} from './document-transform-helpers';
import { getKs4ContextForUnit, type UnitContextMap } from './ks4-context-builder';
import { generateUnitSemanticSummary } from './semantic-summary-generator';
import { normaliseYears } from './document-transform-utils';

/**
 * Parameters for creating a rollup document via API path.
 */
interface CreateRollupDocumentParams {
  summary: SearchUnitSummary;
  snippets: string[];
  /** Subject slug including KS4 variants (AllSubjectSlug). @see ADR-101 */
  subject: AllSubjectSlug;
  subjectTitle?: string;
  keyStage: KeyStage;
  keyStageTitle?: string;
  subjectProgrammesUrl: string;
  /** Fully qualified Oak URL for this unit, pre-validated by the caller. */
  unitUrl: string;
  unitContextMap: UnitContextMap;
  /** Aggregated lesson data per unit - if provided, overrides summary.unitLessons */
  lessonsByUnit?: ReadonlyMap<string, readonly string[]>;
}

function derivePhaseFromKeyStage(keyStage: KeyStage): 'primary' | 'secondary' {
  return keyStage === 'ks1' || keyStage === 'ks2' ? 'primary' : 'secondary';
}

/** Creates a rollup document for Elasticsearch indexing. */
export function createRollupDocument(p: CreateRollupDocumentParams): SearchUnitRollupDoc {
  const fields = extractRollupDocumentFields(p.summary, normaliseYears, p.lessonsByUnit);
  const rollupText = createEnrichedRollupText(p.snippets, extractPedagogicalData(p.summary));
  const ks4 = extractKs4DocumentFields(getKs4ContextForUnit(p.unitContextMap, p.summary.unitSlug));
  const unitSemantic = generateUnitSemanticSummary(
    p.summary,
    p.keyStageTitle ?? p.keyStage,
    p.subjectTitle ?? p.subject,
  );

  return {
    unit_id: fields.unitSlug,
    unit_slug: fields.unitSlug,
    unit_title: fields.unitTitle,
    subject_slug: p.subject,
    subject_parent: SUBJECT_TO_PARENT[p.subject],
    subject_title: p.subjectTitle,
    key_stage: p.keyStage,
    key_stage_title: p.keyStageTitle,
    phase_slug: derivePhaseFromKeyStage(p.keyStage),
    years: fields.years,
    lesson_ids: fields.lessonIds,
    lesson_count: fields.lessonIds.length,
    unit_topics: fields.unitTopics,
    unit_content: rollupText,
    unit_structure: unitSemantic,
    unit_content_semantic: rollupText,
    unit_structure_semantic: unitSemantic,
    unit_url: p.unitUrl,
    subject_programmes_url: p.subjectProgrammesUrl,
    sequence_ids: fields.sequenceIds,
    thread_slugs: fields.threadSlugs,
    thread_titles: fields.threadTitles,
    thread_orders: fields.threadOrders,
    ...extractUnitEnrichmentFields(p.summary),
    ...ks4,
    doc_type: 'unit',
  };
}
