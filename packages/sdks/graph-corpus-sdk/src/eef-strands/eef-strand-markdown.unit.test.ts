import { typeSafeEntries } from '@oaknational/type-helpers';
import { describe, expect, it } from 'vitest';

import { corpusMeta } from './corpus-meta.js';
import { omittedKeys, RENDERED_KEY_COVERAGE } from './eef-markdown-rendered-keys.js';
import type { PhaseDetail } from './eef-strand-markdown-sections.js';
import { renderStrandMarkdown } from './eef-strand-markdown.js';
import { EEF_STRAND_IDS, strandById } from './strand-lookup.js';
import { leafValues } from './test-helpers.js';

/**
 * Corpus keys whose values the rendering omits, read from the same coverage
 * map that pins the strand's key set at compile time.
 */
const OMITTED_KEYS = omittedKeys(RENDERED_KEY_COVERAGE.strand);

const cases = EEF_STRAND_IDS.map((id) => ({
  id,
  strand: strandById(id),
  text: renderStrandMarkdown(id),
}));

/** The strands whose headline carries a study count, with the count. */
const studyCountCases = cases.flatMap(({ id, strand, text }) => {
  const { headline } = strand;
  return 'number_of_studies' in headline ? [{ id, text, count: headline.number_of_studies }] : [];
});

/** Every per-phase entry in the corpus, with the strand's rendering. */
const phaseCases = cases.flatMap(({ id, strand, text }) => {
  if (!('behind_the_average' in strand)) {
    return [];
  }
  const detail = strand.behind_the_average;
  if (!('by_phase' in detail)) {
    return [];
  }
  const phases: Readonly<Record<string, PhaseDetail>> = detail.by_phase;
  return typeSafeEntries(phases).map(([phase, entry]) => ({ id, phase, entry, text }));
});

const phaseMonthCases = phaseCases.flatMap(({ id, phase, entry, text }) =>
  'impact_months' in entry ? [{ id, phase, months: entry.impact_months, text }] : [],
);

const phaseNoteCases = phaseCases.flatMap(({ id, phase, entry, text }) =>
  'notes' in entry ? [{ id, phase, notes: entry.notes, text }] : [],
);

/** The rendered bullet for a phase: `- <Label>: ...`, found by its label. */
function phaseBullet(text: string, phase: string): string {
  const label = phase.replaceAll('_', ' ');
  const prefix = `- ${label.charAt(0).toUpperCase()}${label.slice(1)}: `;
  return text.split('\n').find((line) => line.startsWith(prefix)) ?? '';
}

describe('renderStrandMarkdown', () => {
  it.each(cases)('$id opens with its name and its provenance block', ({ strand, text }) => {
    expect(text.startsWith(`# ${strand.name}\n\n`)).toBe(true);
    expect(text).toContain(
      `- Corpus: ${corpusMeta.source.name}, data version ${corpusMeta.data_version}, corpus last updated ${corpusMeta.last_updated}`,
    );
    expect(text).toContain(`- Strand id: \`${strand.id}\``);
    expect(text).toContain(`- EEF page: <${strand.eef_url}>`);
    expect(text).toContain(
      '- Source, methodology and caveats: [EEF corpus reference](../eef-corpus-reference.md)',
    );
    expect(text).toContain('- Rendered from the corpus; do not edit by hand');
  });

  it.each(cases)('$id carries its headline lines and every key finding', ({ strand, text }) => {
    const { headline } = strand;

    expect(text).toContain(
      `- Implementation cost: ${headline.cost_label} (rating ${String(headline.cost_rating)})`,
    );
    expect(text).toContain(
      `- Evidence strength: ${headline.evidence_strength_label} (rating ${String(headline.evidence_strength_rating)})`,
    );
    expect(text).toContain(`- Summary: ${headline.headline_summary}`);
    expect(strand.key_findings.every((finding) => text.includes(`- ${finding}`))).toBe(true);
  });

  it.each(cases)(
    '$id states its months of additional progress, or that the corpus holds no figure',
    ({ strand, text }) => {
      const { impact_months } = strand.headline;
      const expected =
        impact_months === null
          ? '- Months of additional progress: no figure in the corpus'
          : `- Months of additional progress: ${String(impact_months)}`;

      expect(text).toContain(expected);
    },
  );

  it.each(cases)('$id closes with its tags as one line', ({ strand, text }) => {
    expect(text.endsWith(`\n\n## Tags\n\n${strand.tags.join(', ')}\n`)).toBe(true);
  });

  it.each(cases)('$id renders every corpus value outside the omitted keys', ({ strand, text }) => {
    const missing = leafValues(strand, OMITTED_KEYS).filter((leaf) => !text.includes(leaf));

    expect(missing).toEqual([]);
  });

  it('finds strands whose headline carries a study count', () => {
    expect(studyCountCases.length).toBeGreaterThan(0);
  });

  it.each(studyCountCases)('$id carries its number of studies', ({ text, count }) => {
    expect(text).toContain(`- Number of studies: ${String(count)}`);
  });

  it('finds per-phase entries carrying months and entries carrying notes', () => {
    expect(phaseMonthCases.length).toBeGreaterThan(0);
    expect(phaseNoteCases.length).toBeGreaterThan(0);
  });

  it.each(phaseMonthCases)(
    '$id renders its $phase months of additional progress on the phase bullet',
    ({ phase, months, text }) => {
      expect(phaseBullet(text, phase)).toContain(`${String(months)} months of additional progress`);
    },
  );

  it.each(phaseNoteCases)(
    '$id renders its $phase notes on the phase bullet',
    ({ phase, notes, text }) => {
      expect(phaseBullet(text, phase)).toContain(notes);
    },
  );

  it('renders the phase key set a strand actually carries, including early years', () => {
    const text = renderStrandMarkdown('eef-tl-phonics');

    expect(text).toContain('### By phase');
    expect(phaseBullet(text, 'early_years')).not.toBe('');
    expect(phaseBullet(text, 'primary')).not.toBe('');
    expect(phaseBullet(text, 'secondary')).not.toBe('');
  });

  it('renders the implementation sub-sections a strand carries and no others', () => {
    const metacognition = renderStrandMarkdown('eef-tl-metacognition-and-self-regulation');
    const teachingAssistants = renderStrandMarkdown('eef-tl-teaching-assistant-interventions');

    expect(metacognition).toContain('### Common pitfalls');
    expect(metacognition).toContain('### Digital technology application');
    expect(teachingAssistants).toContain('### Key considerations');
    expect(teachingAssistants).not.toContain('### Common pitfalls');
  });

  it('links related strands to their sibling files under the related strand name', () => {
    const text = renderStrandMarkdown('eef-tl-arts-participation');
    const related = strandById('eef-tl-collaborative-learning');

    expect(text).toContain(
      `- [${related.name}](./eef-tl-collaborative-learning.md) (\`eef-tl-collaborative-learning\`)`,
    );
  });

  it('omits the curation index: neither its labelled keys nor its values appear', () => {
    const feedback = strandById('eef-tl-feedback');
    const text = renderStrandMarkdown('eef-tl-feedback');

    expect(text).not.toContain('Most relevant');
    expect(text).not.toContain('Pp relevance');
    expect(text).not.toContain(feedback.school_context_relevance.pp_relevance_note);
  });
});
