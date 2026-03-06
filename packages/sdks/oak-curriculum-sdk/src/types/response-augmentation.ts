/**
 * Types for response augmentation with canonical URLs.
 *
 * `ContentType` is re-exported from the generated `url-helpers.ts` to
 * ensure a single source of truth anchored to the schema.
 */

export type { ContentType } from '@oaknational/sdk-codegen/api-schema';

/**
 * Unit context for canonical URL generation.
 *
 * The `sequenceSlug` is derived from the unit's `subjectSlug` and `phaseSlug`
 * fields in the API response (e.g. `maths-primary`), normalising legacy phase
 * values like `ks1`, `ks2`, `ks3`, and `ks4` into canonical URL-safe phases.
 */
export interface UnitContext {
  sequenceSlug?: string;
}

export interface SubjectContext {
  keyStageSlugs?: readonly string[];
}

export interface ResponseContext {
  unit?: UnitContext;
  subject?: SubjectContext;
}
