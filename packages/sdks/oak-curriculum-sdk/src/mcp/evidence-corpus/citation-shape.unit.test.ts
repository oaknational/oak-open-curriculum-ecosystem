/**
 * Tests for the structural citation discipline at the EEF tool boundary.
 *
 * Each test describes a behavioural invariant of the citation envelope:
 * non-empty caveats per citation, non-empty citations per response,
 * required fields cannot be omitted, URL validation on `eef_url`,
 * and acceptance of the canonical single- and multi-citation shapes.
 */

import { describe, it, expect } from 'vitest';

import {
  CaveatsSchema,
  CitationSchema,
  CitationsSchema,
  type Caveats,
  type Citation,
  type Citations,
} from './citation-shape.js';

const validCitation = {
  strand_id: 'feedback',
  strand_name: 'Feedback',
  data_version: '1.0.0',
  last_updated: '2026-04-01',
  eef_url: 'https://educationendowmentfoundation.org.uk/toolkit/feedback',
  caveats: ['Effects vary substantially by subject and key stage.'],
} satisfies Citation;

const secondValidCitation = {
  strand_id: 'metacognition',
  strand_name: 'Metacognition and self-regulation',
  data_version: '1.0.0',
  last_updated: '2026-04-01',
  eef_url: 'https://educationendowmentfoundation.org.uk/toolkit/metacognition-and-self-regulation',
  caveats: ['Implementation requires teacher CPD.', 'Younger pupils need more scaffolding.'],
} satisfies Citation;

describe('CaveatsSchema', () => {
  it('accepts a single-caveat tuple', () => {
    const input: Caveats = ['Effects vary substantially by subject.'];

    const result = CaveatsSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it('accepts a multi-caveat tuple', () => {
    const input: Caveats = ['Effects vary by subject.', 'Implementation requires teacher CPD.'];

    const result = CaveatsSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it('rejects an empty array at runtime', () => {
    const result = CaveatsSchema.safeParse([]);

    expect(result.success).toBe(false);
  });

  it('rejects a non-string element', () => {
    const result = CaveatsSchema.safeParse([42]);

    expect(result.success).toBe(false);
  });
});

describe('CitationSchema', () => {
  it('accepts a citation with all required fields', () => {
    const result = CitationSchema.safeParse(validCitation);

    expect(result.success).toBe(true);
  });

  it('rejects an empty caveats array on a citation', () => {
    const input = { ...validCitation, caveats: [] };

    const result = CitationSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  it('rejects a malformed eef_url', () => {
    const input = { ...validCitation, eef_url: 'not-a-url' };

    const result = CitationSchema.safeParse(input);

    expect(result.success).toBe(false);
  });

  const requiredFields: readonly (keyof Citation)[] = [
    'strand_id',
    'strand_name',
    'data_version',
    'last_updated',
    'eef_url',
    'caveats',
  ];

  it.each(requiredFields)('rejects a citation missing the required %s field', (omittedField) => {
    const input = Object.fromEntries(
      Object.entries(validCitation).filter(([key]) => key !== omittedField),
    );

    const result = CitationSchema.safeParse(input);

    expect(result.success).toBe(false);
  });
});

describe('CitationsSchema', () => {
  it('accepts a single-citation tuple', () => {
    const input: Citations = [validCitation];

    const result = CitationsSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it('accepts a multi-citation tuple', () => {
    const input: Citations = [validCitation, secondValidCitation];

    const result = CitationsSchema.safeParse(input);

    expect(result.success).toBe(true);
  });

  it('rejects an empty array at runtime', () => {
    const result = CitationsSchema.safeParse([]);

    expect(result.success).toBe(false);
  });

  it('rejects a tuple containing a malformed citation', () => {
    const malformed = { ...validCitation, eef_url: 'not-a-url' };

    const result = CitationsSchema.safeParse([validCitation, malformed]);

    expect(result.success).toBe(false);
  });
});
