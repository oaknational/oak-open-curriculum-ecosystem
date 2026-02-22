/**
 * Integration contract tests for the browse-curriculum renderer.
 *
 * The browse tool returns `{ facets, filters, summary, status }` where
 * `facets.sequences` is an array of `SequenceFacet` objects in camelCase.
 * Fixtures are validated against the SDK's `SequenceFacetSchema` to
 * catch schema drift between renderer expectations and SDK types.
 *
 * @see ./browse-renderer.ts
 */

import { describe, expect, it } from 'vitest';
import { SequenceFacetSchema } from '@oaknational/curriculum-sdk/public/search';

import { createRendererHarness } from '../../tests/widget/renderer-test-harness.js';
import { buildBrowseFixture } from '../../tests/widget/fixture-builder-browse-explore.js';

const BROWSE_SEQUENCES = [
  {
    subjectSlug: 'science' as const,
    sequenceSlug: 'science-ks3',
    keyStage: 'ks3' as const,
    keyStageTitle: 'KS3',
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    years: ['7', '8', '9'],
    units: [
      { unitSlug: 'plant-biology', unitTitle: 'Plant Biology' },
      { unitSlug: 'ecosystems', unitTitle: 'Ecosystems' },
    ],
    unitCount: 15,
    lessonCount: 120,
    hasKs4Options: false,
    sequenceUrl: 'https://teachers.thenational.academy/sequences/science-ks3',
  },
  {
    subjectSlug: 'science' as const,
    sequenceSlug: 'biology-ks4',
    keyStage: 'ks4' as const,
    keyStageTitle: 'KS4',
    phaseSlug: 'secondary',
    phaseTitle: 'Secondary',
    years: ['10', '11'],
    units: [{ unitSlug: 'cellular-biology', unitTitle: 'Cellular Biology' }],
    unitCount: 10,
    lessonCount: 85,
    hasKs4Options: true,
    sequenceUrl: 'https://teachers.thenational.academy/sequences/biology-ks4',
  },
];

const BROWSE_FIXTURE = buildBrowseFixture(
  {
    facets: { sequences: BROWSE_SEQUENCES },
    filters: { subject: 'science' },
  },
  undefined,
  'success',
);

describe('browse renderer contract', () => {
  const { renderBrowse } = createRendererHarness();

  it('renders sequence titles from facets', () => {
    const html = renderBrowse(BROWSE_FIXTURE);
    expect(html).toContain('science-ks3');
    expect(html).toContain('biology-ks4');
  });

  it('renders key stage labels', () => {
    const html = renderBrowse(BROWSE_FIXTURE);
    expect(html).toContain('KS3');
    expect(html).toContain('KS4');
  });

  it('renders unit count per sequence', () => {
    const html = renderBrowse(BROWSE_FIXTURE);
    expect(html).toContain('15');
    expect(html).toContain('10');
  });

  it('renders lesson count per sequence', () => {
    const html = renderBrowse(BROWSE_FIXTURE);
    expect(html).toContain('120');
    expect(html).toContain('85');
  });

  it('renders sequence URLs as links', () => {
    const html = renderBrowse(BROWSE_FIXTURE);
    expect(html).toContain('https://teachers.thenational.academy/sequences/science-ks3');
    expect(html).toContain('View on Oak');
  });

  it('renders unit titles within each sequence', () => {
    const html = renderBrowse(BROWSE_FIXTURE);
    expect(html).toContain('Plant Biology');
    expect(html).toContain('Ecosystems');
    expect(html).toContain('Cellular Biology');
  });

  it('renders "No programmes found" for empty facets', () => {
    const html = renderBrowse({ facets: { sequences: [] }, filters: {} });
    expect(html).toContain('No programmes found');
  });

  it('handles missing sequenceUrl gracefully', () => {
    const noUrlSequence = {
      subjectSlug: 'maths' as const,
      sequenceSlug: 'maths-ks3',
      keyStage: 'ks3' as const,
      phaseSlug: 'secondary',
      phaseTitle: 'Secondary',
      years: ['7'],
      units: [],
      unitCount: 5,
      lessonCount: 40,
      hasKs4Options: false,
    };
    const fixture = buildBrowseFixture({
      facets: { sequences: [noUrlSequence] },
      filters: {},
    });
    const html = renderBrowse(fixture);
    expect(html).toContain('maths-ks3');
    expect(html).not.toContain('undefined');
  });

  it('fixture sequences validate against SequenceFacetSchema', () => {
    for (const seq of BROWSE_SEQUENCES) {
      expect(() => SequenceFacetSchema.parse(seq)).not.toThrow();
    }
  });
});
