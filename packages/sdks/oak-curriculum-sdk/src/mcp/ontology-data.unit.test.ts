/**
 * Unit tests for the static curriculum ontology data.
 *
 * The ontology's subject list is the domain model the get-curriculum-model
 * orientation tool serves. It must stay in lockstep with the canonical
 * OpenAPI-derived subject set (AllSubjectsResponseSchema) so the orientation
 * cannot drift from the live API — the drift that motivated this change was a
 * hand-typed 13-subject list against a live set of 17.
 */

import { rawCurriculumSchemas } from '@oaknational/sdk-codegen/zod';
import { describe, expect, it } from 'vitest';
import { ontologyData } from './ontology-data.js';

describe('ontologyData curriculum subjects', () => {
  const canonicalSubjectSlugs = [...rawCurriculumSchemas.AllSubjectsResponseSchema.element.options];
  const ontologySubjectSlugs = ontologyData.curriculumStructure.subjects.map(
    (subject) => subject.slug,
  );

  it('covers exactly the canonical OpenAPI subject set (no drift)', () => {
    const byLocale = (a: string, b: string): number => a.localeCompare(b);
    expect([...ontologySubjectSlugs].sort(byLocale)).toEqual(
      [...canonicalSubjectSlugs].sort(byLocale),
    );
  });

  it('exposes every subject with a non-empty display name and key-stage coverage', () => {
    for (const subject of ontologyData.curriculumStructure.subjects) {
      expect(subject.name.length).toBeGreaterThan(0);
      expect(subject.keyStages.length).toBeGreaterThan(0);
    }
  });
});
