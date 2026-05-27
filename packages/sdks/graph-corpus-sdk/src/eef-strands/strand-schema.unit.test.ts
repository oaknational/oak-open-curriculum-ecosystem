import { describe, expect, it } from 'vitest';

import { EEF_PHASES, EefStrandSchema } from './strand-schema.js';

const VALID_STRAND = {
  id: 'eef-tl-example',
  name: 'Example strand',
  slug: 'example',
  eef_url: 'https://educationendowmentfoundation.org.uk/example',
  headline: {
    impact_months: 4,
    cost_rating: 2,
    cost_label: 'Low',
    evidence_strength_rating: 3,
    evidence_strength_label: 'Moderate',
    headline_summary: 'A worked example strand.',
  },
  definition: { short: 'short', full: 'full' },
  key_findings: ['a finding'],
  tags: ['example'],
} as const;

describe('EefStrandSchema', () => {
  it('accepts a minimal valid strand (required fields only)', () => {
    expect(EefStrandSchema.safeParse(VALID_STRAND).success).toBe(true);
  });

  it('accepts a null impact_months (insufficient-evidence strands)', () => {
    const result = EefStrandSchema.safeParse({
      ...VALID_STRAND,
      headline: { ...VALID_STRAND.headline, impact_months: null },
    });
    expect(result.success).toBe(true);
  });

  it('accepts an early_years entry in behind_the_average.by_phase', () => {
    const result = EefStrandSchema.safeParse({
      ...VALID_STRAND,
      behind_the_average: {
        summary: 'varies by phase',
        by_phase: { early_years: { notes: 'highest impact here' } },
      },
    });
    expect(result.success).toBe(true);
  });

  it('rejects a strand missing a required block (headline)', () => {
    const withoutHeadline = {
      id: VALID_STRAND.id,
      name: VALID_STRAND.name,
      slug: VALID_STRAND.slug,
      eef_url: VALID_STRAND.eef_url,
      definition: VALID_STRAND.definition,
      key_findings: VALID_STRAND.key_findings,
      tags: VALID_STRAND.tags,
    };
    expect(EefStrandSchema.safeParse(withoutHeadline).success).toBe(false);
  });

  it('rejects a non-URL eef_url', () => {
    const result = EefStrandSchema.safeParse({ ...VALID_STRAND, eef_url: 'not a url' });
    expect(result.success).toBe(false);
  });

  it('rejects a cost_rating outside the 1–5 scale', () => {
    const result = EefStrandSchema.safeParse({
      ...VALID_STRAND,
      headline: { ...VALID_STRAND.headline, cost_rating: 6 },
    });
    expect(result.success).toBe(false);
  });
});

describe('EEF_PHASES', () => {
  it('is the canonical phase vocabulary including early_years', () => {
    expect(EEF_PHASES).toEqual(['early_years', 'primary', 'secondary']);
  });
});
