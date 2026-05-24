/**
 * Helpers for working with the API lesson resource's structured
 * multi-unit shape (`LessonSummaryResponseSchema.units[]`).
 *
 * The upstream API exposes lesson↔unit cardinality structurally on
 * the lesson resource: a single lesson belongs to many units across
 * programme variants, and each entry carries optional
 * `programmeFactors` (`examBoard`, `pathway`, `tier`, `childSubject`)
 * identifying which programme variant of the unit the lesson sits in.
 * See ADR-080 §"Context" for the cardinality decision; this module
 * exposes the consumer-facing helpers that adopt that shape.
 *
 * For unit-resource extraction (where the resource IS a unit and
 * `unitSlug` is a top-level scalar), see `extractUnitSlug` in
 * `response-augmentation-helpers.ts`.
 */

import { rawCurriculumSchemas } from '@oaknational/sdk-codegen/zod';
import type { z } from 'zod';

const lessonUnitsArraySchema = rawCurriculumSchemas.LessonSummaryResponseSchema.shape.units;

/** A lesson resource as exposed by the API at `/lessons/\{lesson\}/summary`. */
type LessonResource = z.infer<typeof rawCurriculumSchemas.LessonSummaryResponseSchema>;

/** One entry on a lesson's `units` array, with optional programme variants. */
type LessonUnitEntry = LessonResource['units'][number];

/**
 * Narrowing target for `isNonNullObject` — a non-null object whose
 * properties can then be inspected with the `in` operator. Mirrors the
 * pattern used in `response-augmentation-helpers.ts`.
 */
interface ObjectResponse {
  readonly [Symbol.toStringTag]?: string;
}

function isNonNullObject(value: unknown): value is ObjectResponse {
  return typeof value === 'object' && value !== null;
}

/**
 * Extracts the structured `units` array from a lesson-resource response.
 *
 * Each entry in the returned array describes one unit the lesson belongs
 * to, with optional `programmeFactors` carrying the variant identity
 * (`examBoard`, `pathway`, `tier`, `childSubject`). Consumers that need a
 * single primary unit (display rows, URL generation) should pair this
 * helper with `formatPrimaryUnit`; consumers that genuinely need to
 * enumerate all units iterate the returned array directly.
 *
 * For unit-resource responses (where the resource IS a unit and
 * `unitSlug` is correctly a top-level scalar), use `extractUnitSlug`
 * from `response-augmentation-helpers.ts` instead.
 *
 * The narrowing uses the generated Zod schema's `units` sub-schema, so
 * the return type flows directly from `LessonSummaryResponseSchema` and
 * no type assertion is required.
 *
 * @param response - An unknown value.
 * @returns The lesson's `units` array if present and conforming, else
 *   `undefined`.
 * @example
 *   const lesson = await client.getLessonSummary('add-fractions');
 *   const units = extractLessonUnits(lesson);
 *   // units[0] has `unitSlug`, `unitTitle`, and optional `programmeFactors`.
 *
 * @see ADR-080 §"Context" for the lesson↔unit many-to-many decision.
 */
export function extractLessonUnits(response: unknown): LessonResource['units'] | undefined {
  if (!isNonNullObject(response) || !('units' in response)) {
    return undefined;
  }
  const parsed = lessonUnitsArraySchema.safeParse(response.units);
  return parsed.success ? parsed.data : undefined;
}

/**
 * Projects a lesson's `units` array to a single primary unit.
 *
 * Returns `lesson.units[0]`. The API spec describes each `units` entry
 * as "a unique combination of unit slug and programme factors", so the
 * first element is a deterministic projection per response. Display
 * surfaces and any single-unit consumer (URL generation, table-row
 * display, semantic-summary context) call this helper rather than
 * reading `lesson.units[0]` inline — the projection convention lives in
 * one named place that reviewers can verify and future plans can evolve.
 *
 * For multi-unit consumers (an "appears in N units" list), iterate the
 * full `lesson.units` array (or `extractLessonUnits`) instead.
 *
 * @param lesson - A value carrying the lesson resource's `units` field.
 *   Accepts a structural subset so callers can pass `SearchLessonSummary`
 *   directly or a narrower fixture in tests.
 * @returns The first `units` element, or `undefined` if the array is
 *   empty. An empty `units` array is a data-shape anomaly worth
 *   surfacing rather than masking with a placeholder.
 * @example
 *   const lesson = await client.getLessonSummary('add-fractions');
 *   const primary = formatPrimaryUnit(lesson);
 *   if (primary) console.log(`In unit: ${primary.unitTitle}`);
 *
 * @see ADR-080 §"Context" for the lesson↔unit many-to-many decision.
 */
export function formatPrimaryUnit(
  lesson: Pick<LessonResource, 'units'>,
): LessonUnitEntry | undefined {
  return lesson.units[0];
}
