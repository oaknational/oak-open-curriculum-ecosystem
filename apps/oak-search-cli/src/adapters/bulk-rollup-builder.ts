/**
 * Bulk rollup document builder.
 *
 * Transforms bulk download unit data into SearchUnitSummary format
 * for rollup document generation, and collects lesson snippets for
 * unit content enrichment.
 */
import type { Unit, Lesson } from '@oaknational/sdk-codegen/bulk';
import type {
  KeyStage,
  SearchSubjectSlug,
  SearchUnitSummary,
  SearchUnitRollupDoc,
} from '../types/oak';
import type { UnitContextMap } from '../lib/indexing/ks4-context-builder';
import { createRollupDocument } from '../lib/indexing/document-transforms';
import { isKeyStage } from './sdk-guards';
import {
  generateOakUrlWithContext,
  normalisePhaseSlug,
  derivePhaseSlugFromSequence,
  generateSubjectProgrammesUrl,
} from '@oaknational/curriculum-sdk';
import { ok, err, type Result } from '@oaknational/result';

/** Valid lesson state values */
type LessonState = 'published' | 'new';

/**
 * Validates and transforms a lesson state string to the expected union type.
 * Defaults to 'published' if the state is not recognized.
 *
 * @param state - The state string from bulk data
 * @returns A valid LessonState ('published' | 'new')
 */
function validateLessonState(state: string): LessonState {
  if (state === 'published' || state === 'new') {
    return state;
  }
  return 'published';
}

/**
 * Transforms a bulk Unit into a SearchUnitSummary for rollup document generation.
 *
 * @remarks
 * Maps bulk download unit fields to the API-compatible SearchUnitSummary format.
 * This enables reuse of the existing `createRollupDocument` function.
 *
 * Field differences between bulk Unit and SearchUnitSummary:
 * - Bulk `year` accepts `number | "All years"`, API `year` accepts `number | string`
 * - Bulk has no `subjectSlug` or `keyStageSlug` - must be passed as parameters
 * - Bulk has no `oakUrl` - generated from unitSlug + sequenceSlug
 * - Bulk has no `categories`, `notes`, `phaseSlug` - set to undefined
 *
 * @param unit - The bulk Unit to transform
 * @param subjectSlug - The subject slug (derived from sequence)
 * @param keyStageSlug - The key stage slug
 * @param sequenceSlug - The sequence slug for Oak URL generation
 * @returns A SearchUnitSummary compatible with rollup document generation
 */
export function transformBulkUnitToSummary(
  unit: Unit,
  subjectSlug: SearchSubjectSlug,
  keyStageSlug: KeyStage,
  sequenceSlug: string,
): SearchUnitSummary {
  const phaseSlug = normalisePhaseSlug(keyStageSlug);
  const oakUrl =
    generateOakUrlWithContext('unit', unit.unitSlug, { unit: { sequenceSlug } }) ?? undefined;

  return {
    unitSlug: unit.unitSlug,
    unitTitle: unit.unitTitle,
    yearSlug: unit.yearSlug,
    year: unit.year,
    phaseSlug,
    subjectSlug,
    keyStageSlug,
    description: unit.description,
    priorKnowledgeRequirements: [...unit.priorKnowledgeRequirements],
    nationalCurriculumContent: [...unit.nationalCurriculumContent],
    threads: unit.threads.map((t) => ({ slug: t.slug, title: t.title, order: t.order })),
    unitLessons: unit.unitLessons.map((l) => ({
      lessonSlug: l.lessonSlug,
      lessonTitle: l.lessonTitle,
      lessonOrder: l.lessonOrder,
      state: validateLessonState(l.state),
    })),
    whyThisWhyNow: unit.whyThisWhyNow,
    oakUrl,
    // Fields not present in bulk data - API-only fields
    notes: undefined,
    categories: undefined,
  };
}

/**
 * Collects lesson transcript content grouped by unit slug for rollup snippet generation.
 *
 * @remarks
 * Creates a Map where each key is a unit slug and the value is an array
 * of lesson transcript content belonging to that unit. Lessons without
 * transcripts (null or undefined) are skipped. Order is preserved as received.
 *
 * @param lessons - Array of bulk lessons
 * @returns Map of unit slug to transcript content array
 */
export function collectLessonSnippets(lessons: readonly Lesson[]): Map<string, string[]> {
  const snippets = new Map<string, string[]>();

  for (const lesson of lessons) {
    const transcript = lesson.transcript_sentences;
    // Skip lessons without transcripts
    if (transcript === null || transcript === undefined) {
      continue;
    }

    const existing = snippets.get(lesson.unitSlug);
    if (existing) {
      existing.push(transcript);
    } else {
      snippets.set(lesson.unitSlug, [transcript]);
    }
  }

  return snippets;
}

/**
 * Generates the subject programmes URL based on subject and key stage.
 *
 * Delegates to `generateSubjectProgrammesUrl` from the canonical URL generator
 * for a single source of truth.
 *
 * @param subjectSlug - The subject slug
 * @param keyStage - The key stage slug (e.g., 'ks2', 'ks3')
 * @returns The subject programmes URL
 */
export function getSubjectProgrammesUrl(subjectSlug: string, keyStage: string): string {
  return generateSubjectProgrammesUrl(subjectSlug, keyStage);
}

/**
 * Derives key stage from sequence slug when unit doesn't have a valid key stage.
 *
 * @param sequenceSlug - The sequence slug (e.g., 'maths-primary')
 * @returns A valid KeyStage
 */
export function deriveKeyStageFromSequence(sequenceSlug: string): KeyStage {
  const phase = derivePhaseSlugFromSequence(sequenceSlug);
  const defaultKs = phase === 'primary' ? 'ks2' : 'ks3';
  return isKeyStage(defaultKs) ? defaultKs : 'ks2';
}

/**
 * Transforms a unit to a validated summary, returning `err` when the
 * transformation throws or produces no Oak URL.
 */
function transformUnitSafe(
  unit: Unit,
  subjectSlug: SearchSubjectSlug,
  keyStage: KeyStage,
  sequenceSlug: string,
): Result<SearchUnitSummary & { readonly oakUrl: string }, Error> {
  let summary: SearchUnitSummary;
  try {
    summary = transformBulkUnitToSummary(unit, subjectSlug, keyStage, sequenceSlug);
  } catch (caught: unknown) {
    return err(
      new Error(
        `Failed to transform unit "${unit.unitSlug}" with sequenceSlug "${sequenceSlug}": ` +
          `${caught instanceof Error ? caught.message : String(caught)}`,
      ),
    );
  }
  if (!summary.oakUrl) {
    return err(
      new Error(
        `transformBulkUnitToSummary produced no oakUrl for unit "${unit.unitSlug}" ` +
          `with sequenceSlug "${sequenceSlug}" — this should not happen when sequenceSlug is provided.`,
      ),
    );
  }
  return ok({ ...summary, oakUrl: summary.oakUrl });
}

/**
 * Builds rollup documents from bulk data for unit search.
 *
 * @remarks
 * Creates SearchUnitRollupDoc entries for each unit, combining:
 * - Unit metadata (title, description, threads, etc.)
 * - Lesson transcript snippets for content search
 * - Semantic summaries for ELSER embeddings
 *
 * @param units - Array of bulk units to process
 * @param lessons - Array of bulk lessons (for snippet extraction)
 * @param subjectSlug - The subject slug
 * @param subjectTitle - The subject display title
 * @param sequenceSlug - The sequence slug (for key stage derivation fallback)
 * @param unitContextMap - KS4 context map for tier enrichment
 * @returns `ok` with rollup documents, or `err` when a unit produces no Oak URL
 */
export function buildRollupDocs(
  units: readonly Unit[],
  lessons: readonly Lesson[],
  subjectSlug: SearchSubjectSlug,
  subjectTitle: string,
  sequenceSlug: string,
  unitContextMap: UnitContextMap,
): Result<SearchUnitRollupDoc[], Error> {
  const lessonSnippets = collectLessonSnippets(lessons);
  const rollupDocs: SearchUnitRollupDoc[] = [];

  for (const unit of units) {
    const keyStage = isKeyStage(unit.keyStageSlug)
      ? unit.keyStageSlug
      : deriveKeyStageFromSequence(sequenceSlug);
    const summaryResult = transformUnitSafe(unit, subjectSlug, keyStage, sequenceSlug);
    if (!summaryResult.ok) {
      return summaryResult;
    }
    const summary = summaryResult.value;
    const snippets = lessonSnippets.get(unit.unitSlug) ?? [];
    const subjectProgrammesUrl = getSubjectProgrammesUrl(subjectSlug, keyStage);

    rollupDocs.push(
      createRollupDocument({
        summary,
        snippets,
        subject: subjectSlug,
        subjectTitle,
        keyStage,
        keyStageTitle: unit.keyStageSlug.toUpperCase().replace('KS', 'Key Stage '),
        subjectProgrammesUrl,
        unitUrl: summary.oakUrl,
        unitContextMap,
      }),
    );
  }

  return ok(rollupDocs);
}
