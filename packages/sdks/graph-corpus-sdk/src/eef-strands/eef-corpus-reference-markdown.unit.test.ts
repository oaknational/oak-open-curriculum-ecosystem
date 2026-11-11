import { typeSafeValues } from '@oaknational/type-helpers';
import { describe, expect, it } from 'vitest';

import { corpusCaveats, corpusMeta, corpusMethodology } from './corpus-meta.js';
import { renderCorpusReferenceMarkdown } from './eef-corpus-reference-markdown.js';
import { omittedKeys, RENDERED_KEY_COVERAGE } from './eef-markdown-rendered-keys.js';
import { EEF_STRAND_IDS, strandById } from './strand-lookup.js';
import { leafValues } from './test-helpers.js';

const text = renderCorpusReferenceMarkdown();
const META_OMISSIONS = omittedKeys(RENDERED_KEY_COVERAGE.meta);
const METHODOLOGY_OMISSIONS = omittedKeys(RENDERED_KEY_COVERAGE.methodology);

describe('renderCorpusReferenceMarkdown', () => {
  it('opens with the corpus versions and says which corpus sections it does not render', () => {
    expect(text.startsWith(`# ${corpusMeta.source.name} — corpus reference\n\n`)).toBe(true);
    expect(text).toContain(
      `data version ${corpusMeta.data_version} (schema version ${corpusMeta.schema_version})`,
    );
    expect(text).toContain(`corpus last updated ${corpusMeta.last_updated}`);
    expect(text).toContain('school-context schema and UK-context sections are not rendered');
    expect(text).toContain(
      "the strand files do not render each strand's school-context relevance block",
    );
  });

  it('carries the source, every author, the licence and the attribution note verbatim', () => {
    const { source, licence, coverage } = corpusMeta;

    expect(text).toContain(
      `## Source and attribution\n\n- Source: ${source.name} (${source.organisation})`,
    );
    expect(text).toContain(`- EEF page: <${source.url}>`);
    expect(source.original_authors.every((author) => text.includes(author))).toBe(true);
    expect(text).toContain(`- Licence: ${licence.name} (<${licence.url}>)`);
    expect(text).toContain(`- Attribution note: ${licence.attribution_note}`);
    expect(text).toContain(
      `- Coverage: ${coverage.age_range}; ${coverage.jurisdiction_focus}; ${coverage.evidence_scope}`,
    );
  });

  it('carries every caveat as a bullet under its heading', () => {
    expect(text).toContain('\n## Caveats\n\n');
    expect(corpusCaveats.every((caveat) => text.includes(`- ${caveat}`))).toBe(true);
  });

  it('carries the impact measure, every cost band, the evidence-strength scale and factors', () => {
    const { impact_measure, cost_measure, evidence_strength_measure } = corpusMethodology;

    expect(text).toContain(`### ${impact_measure.name}\n\n- Unit: ${impact_measure.unit}`);
    expect(text).toContain(`- Derivation: ${impact_measure.derivation}`);
    expect(text).toContain(`- Interpretation: ${impact_measure.interpretation_guidance}`);
    expect(text).toContain(`### ${cost_measure.name}\n\n`);
    expect(
      typeSafeValues(cost_measure.scale).every((band) =>
        text.includes(
          `- Rating ${String(band.rating)} (${band.label}): ${band.range_per_pupil_per_year_gbp} per pupil per year; ${band.range_per_class_per_year_gbp} per class per year`,
        ),
      ),
    ).toBe(true);
    expect(text).toContain(
      `### ${evidence_strength_measure.name}\n\n- Scale: ${String(evidence_strength_measure.scale_min)} to ${String(evidence_strength_measure.scale_max)}`,
    );
    expect(text).toContain(
      `- Interpretation: ${evidence_strength_measure.interpretation_guidance}`,
    );
    expect(text).toContain(`### ${evidence_strength_measure.name}: factors\n\n`);
    expect(evidence_strength_measure.factors.every((factor) => text.includes(`- ${factor}`))).toBe(
      true,
    );
  });

  it('carries every effect-size conversion row and its note under its heading', () => {
    const conversion = corpusMethodology.effect_size_to_months_conversion;

    expect(text).toContain('### Effect size to months conversion\n\n');
    expect(
      conversion.table.every((row) =>
        text.includes(
          `- Effect size ${row.effect_size_range}: ${String(row.months_progress)} months`,
        ),
      ),
    ).toBe(true);
    expect(text).toContain(conversion.notes);
  });

  it('renders every value of the corpus metadata and methodology', () => {
    const missing = [
      ...leafValues(corpusMeta, META_OMISSIONS),
      ...leafValues(corpusMethodology, METHODOLOGY_OMISSIONS),
    ].filter((leaf) => !text.includes(leaf));

    expect(missing).toEqual([]);
  });

  it('indexes every strand by name with its summary and EEF page, linking its own file', () => {
    const missing = EEF_STRAND_IDS.filter((id) => {
      const strand = strandById(id);
      return !text.includes(
        `- [${strand.name}](./strands/${id}.md) — ${strand.headline.headline_summary} — <${strand.eef_url}>`,
      );
    });

    expect(text).toContain('\n## Strand index\n\n');
    expect(missing).toEqual([]);
  });
});
