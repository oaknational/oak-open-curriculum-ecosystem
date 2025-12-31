/**
 * Bulk unit to ES document transformer.
 */

import type { Unit } from '@oaknational/oak-curriculum-sdk/public/bulk.js';
import type { SearchUnitsIndexDoc, SearchSubjectSlug } from '../types/oak';
import { isKeyStage } from './sdk-guards';
import {
  generateUnitUrl,
  normaliseYearsFromUnit,
  getKeyStageTitle,
} from './bulk-transform-helpers.js';

/** Parameters for transforming a bulk unit to ES document */
export interface BulkToESUnitParams {
  readonly unit: Unit;
  readonly subjectSlug: SearchSubjectSlug;
  readonly subjectTitle: string;
  readonly subjectProgrammesUrl: string;
}

/** Extract thread information from unit */
function extractThreadInfo(unit: Unit) {
  return {
    slugs: unit.threads.map((t) => t.slug),
    titles: unit.threads.map((t) => t.title),
    orders: unit.threads.map((t) => t.order),
  };
}

/** Build core fields for unit document */
function buildUnitCoreFields(
  unit: Unit,
  subjectSlug: SearchSubjectSlug,
  subjectTitle: string,
  phaseSlug: string,
) {
  const keyStage = isKeyStage(unit.keyStageSlug)
    ? unit.keyStageSlug
    : (() => {
        throw new Error(`Invalid key stage: ${unit.keyStageSlug}`);
      })();

  return {
    unit_id: unit.unitSlug,
    unit_slug: unit.unitSlug,
    unit_title: unit.unitTitle,
    subject_slug: subjectSlug,
    subject_title: subjectTitle,
    key_stage: keyStage,
    key_stage_title: getKeyStageTitle(keyStage),
    years: normaliseYearsFromUnit(unit.year, unit.yearSlug),
    unit_url: generateUnitUrl(unit.unitSlug, subjectSlug, phaseSlug),
  };
}

/** Build lesson fields for unit document */
function buildUnitLessonFields(unit: Unit) {
  const lessonIds = unit.unitLessons.map((l) => l.lessonSlug);
  return {
    lesson_ids: lessonIds,
    lesson_count: lessonIds.length,
  };
}

/** Build thread and sequence fields for unit document */
function buildUnitThreadFields(unit: Unit) {
  const threadInfo = extractThreadInfo(unit);
  return {
    sequence_ids: threadInfo.slugs.length > 0 ? threadInfo.slugs : undefined,
    thread_slugs: threadInfo.slugs.length > 0 ? threadInfo.slugs : undefined,
    thread_titles: threadInfo.titles.length > 0 ? threadInfo.titles : undefined,
    thread_orders: threadInfo.orders.length > 0 ? threadInfo.orders : undefined,
  };
}

/** Unit enrichment fields */
interface UnitEnrichmentFields {
  readonly unit_topics: string[] | undefined;
  readonly description: string | undefined;
  readonly why_this_why_now: string | undefined;
  readonly prior_knowledge_requirements: string[] | undefined;
  readonly national_curriculum_content: string[] | undefined;
}

/** Build enrichment fields for unit document */
function buildUnitEnrichmentFields(unit: Unit): UnitEnrichmentFields {
  return {
    unit_topics: undefined, // Categories not in bulk
    description: unit.description || undefined,
    why_this_why_now: unit.whyThisWhyNow || undefined,
    prior_knowledge_requirements:
      unit.priorKnowledgeRequirements.length > 0 ? unit.priorKnowledgeRequirements : undefined,
    national_curriculum_content:
      unit.nationalCurriculumContent.length > 0 ? unit.nationalCurriculumContent : undefined,
  };
}

/**
 * Transform a bulk unit into an ES unit document.
 */
export function transformBulkUnitToESDoc(params: BulkToESUnitParams): SearchUnitsIndexDoc {
  const { unit, subjectSlug, subjectTitle, subjectProgrammesUrl } = params;

  const keyStage = isKeyStage(unit.keyStageSlug)
    ? unit.keyStageSlug
    : (() => {
        throw new Error(`Invalid key stage: ${unit.keyStageSlug}`);
      })();

  const phaseSlug = keyStage === 'ks1' || keyStage === 'ks2' ? 'primary' : 'secondary';

  const threadInfo = extractThreadInfo(unit);

  return {
    ...buildUnitCoreFields(unit, subjectSlug, subjectTitle, phaseSlug),
    ...buildUnitLessonFields(unit),
    ...buildUnitThreadFields(unit),
    ...buildUnitEnrichmentFields(unit),
    subject_programmes_url: subjectProgrammesUrl,
    title_suggest: {
      input: [unit.unitTitle],
      contexts: {
        subject: [subjectSlug],
        key_stage: [keyStage],
        sequence: threadInfo.slugs,
      },
    },
    doc_type: 'unit',
  };
}
