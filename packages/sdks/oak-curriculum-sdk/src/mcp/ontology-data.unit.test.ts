/**
 * Unit tests for the static curriculum ontology data.
 *
 * The ontology's subject list is the domain model the get-curriculum-model
 * orientation tool serves. It must stay in lockstep with the canonical
 * OpenAPI-derived subject set (AllSubjectsResponseSchema) so the orientation
 * cannot drift from the live API — the drift that motivated this change was a
 * hand-typed 13-subject list against a live set of 17.
 */

import { KEY_STAGES } from '@oaknational/sdk-codegen/api-schema';
import { KS4_SCIENCE_VARIANTS } from '@oaknational/sdk-codegen/search';
import { rawCurriculumSchemas } from '@oaknational/sdk-codegen/zod';
import { describe, expect, it } from 'vitest';
import { ontologyData } from './ontology-data.js';

const byLocale = (a: string, b: string): number => a.localeCompare(b);

describe('ontologyData curriculum subjects', () => {
  const canonicalSubjectSlugs = [...rawCurriculumSchemas.AllSubjectsResponseSchema.element.options];
  const ontologySubjectSlugs = ontologyData.curriculumStructure.subjects.map(
    (subject) => subject.slug,
  );

  it('covers exactly the canonical OpenAPI subject set (no drift)', () => {
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

describe('ontologyData key stages and KS4 factors', () => {
  it('key-stage slugs equal the canonical KEY_STAGES set (drift guard)', () => {
    const ontologyKeyStageSlugs = ontologyData.curriculumStructure.keyStages.map((ks) => ks.slug);
    expect([...ontologyKeyStageSlugs].sort(byLocale)).toEqual([...KEY_STAGES].sort(byLocale));
  });

  it('KS4 examSubject values equal the canonical KS4_SCIENCE_VARIANTS set (drift guard)', () => {
    const examSubjects = ontologyData.ks4Complexity.programmeFactors.examSubject.values;
    expect([...examSubjects].sort(byLocale)).toEqual([...KS4_SCIENCE_VARIANTS].sort(byLocale));
  });

  it('KS4 examBoard values include wjec (the board the ontology had been missing)', () => {
    expect(ontologyData.ks4Complexity.programmeFactors.examBoard.values).toContain('wjec');
  });
});

describe('ontologyData generation honesty', () => {
  it('version no longer carries the -poc suffix now that lists are schema-derived', () => {
    expect(ontologyData.version).not.toContain('poc');
  });

  it('notice no longer claims a wholly static POC', () => {
    expect(ontologyData.notice).not.toContain('static POC');
  });
});
