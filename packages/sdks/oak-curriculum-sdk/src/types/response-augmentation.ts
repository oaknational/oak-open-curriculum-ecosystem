/**
 * Types for response augmentation with canonical URLs.
 *
 * `ContentType` is re-exported from the generated `url-helpers.ts` to
 * ensure a single source of truth anchored to the schema.
 */

export type { ContentType } from '@oaknational/sdk-codegen/api-schema';

export interface UnitContext {
  subjectSlug?: string;
  phaseSlug?: string;
}

export interface SubjectContext {
  keyStageSlugs?: readonly string[];
}

export interface ResponseContext {
  unit?: UnitContext;
  subject?: SubjectContext;
}
