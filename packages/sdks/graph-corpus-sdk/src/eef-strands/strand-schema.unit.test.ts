import { describe, expect, it } from 'vitest';

import { EefStrandSchema, EefToolkitSchema } from './strand-schema.js';
import { EEF_PRIORITIES, EEF_KEY_STAGES } from './school-context.js';

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

  it('preserves implementation.common_pitfalls and digital_technology_application', () => {
    const result = EefStrandSchema.safeParse({
      ...VALID_STRAND,
      implementation: {
        key_considerations: ['teach it explicitly'],
        common_pitfalls: ['treating it as generic study skills'],
        digital_technology_application: 'tools can support structured prompts',
      },
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.implementation).toEqual({
        key_considerations: ['teach it explicitly'],
        common_pitfalls: ['treating it as generic study skills'],
        digital_technology_application: 'tools can support structured prompts',
      });
    }
  });

  it('rejects a strand whose related_strands contains duplicate ids', () => {
    const result = EefStrandSchema.safeParse({
      ...VALID_STRAND,
      related_strands: ['eef-tl-feedback', 'eef-tl-feedback'],
    });
    expect(result.success).toBe(false);
  });

  it('models school_context_relevance precisely (no longer an open record)', () => {
    const result = EefStrandSchema.safeParse({
      ...VALID_STRAND,
      school_context_relevance: {
        most_relevant_phases: ['primary', 'secondary'],
        most_relevant_key_stages: ['KS1', 'KS2', 'KS3', 'KS4'],
        most_relevant_priorities: ['improving_behaviour', 'closing_disadvantage_gap'],
        pp_relevance: 'high',
        pp_relevance_note: 'Disproportionately affects disadvantaged pupils.',
        implementation_requirements: {
          cpd_intensity: 'moderate',
          additional_staff_needed: false,
          resource_cost: 'low',
          time_to_embed: '2-6 months',
          key_staff: ['classroom_teachers'],
        },
      },
    });
    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error('expected a strand with full school_context_relevance to parse');
    }
    // The selection-critical fields are now typed (not `unknown`): a consumer
    // can read them without a cast.
    expect(result.data.school_context_relevance?.most_relevant_priorities).toEqual([
      'improving_behaviour',
      'closing_disadvantage_gap',
    ]);
  });

  it('rejects a most_relevant_priorities value outside EEF_PRIORITIES', () => {
    const result = EefStrandSchema.safeParse({
      ...VALID_STRAND,
      school_context_relevance: { most_relevant_priorities: ['numeracy'] },
    });
    expect(result.success).toBe(false);
  });

  it('rejects a most_relevant_key_stages value outside EEF_KEY_STAGES', () => {
    const result = EefStrandSchema.safeParse({
      ...VALID_STRAND,
      school_context_relevance: { most_relevant_key_stages: ['KS9'] },
    });
    expect(result.success).toBe(false);
  });
});

describe('EefToolkitSchema school_context_schema drift guard', () => {
  const MINIMAL_META = {
    schema_version: '1.0.0',
    data_version: '0.0.0',
    source: {
      name: 'EEF Toolkit',
      url: 'https://educationendowmentfoundation.org.uk/',
      organisation: 'EEF',
      original_authors: ['EEF'],
    },
    licence: {
      name: 'CC BY',
      url: 'https://creativecommons.org/licenses/by/4.0/',
      attribution_note: 'Attribute the EEF.',
    },
    last_updated: '2026-04-02',
    coverage: { age_range: '3-16', jurisdiction_focus: 'England', evidence_scope: 'meta-analytic' },
    caveats: ['Population averages.'],
  } as const;

  const buildToolkit = (priorityEnum: readonly string[]) => ({
    meta: MINIMAL_META,
    strands: [],
    school_context_schema: {
      properties: {
        key_stage: { enum: [...EEF_KEY_STAGES] },
        priorities: { items: { enum: priorityEnum } },
      },
    },
  });

  it('accepts a snapshot whose vocabulary matches the consts', () => {
    expect(EefToolkitSchema.safeParse(buildToolkit([...EEF_PRIORITIES])).success).toBe(true);
  });

  it('fails closed when the snapshot priority vocabulary diverges from EEF_PRIORITIES', () => {
    const diverged = [...EEF_PRIORITIES.slice(0, 14), 'a_new_priority'];
    expect(EefToolkitSchema.safeParse(buildToolkit(diverged)).success).toBe(false);
  });
});
