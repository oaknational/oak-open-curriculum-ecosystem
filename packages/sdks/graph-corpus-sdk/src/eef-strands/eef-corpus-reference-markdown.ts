/**
 * The EEF corpus reference rendered as one markdown file: source and
 * attribution, methodology, every caveat, and the complete strand index
 * linking each strand's own file. It renders the corpus's `meta`,
 * `methodology` and strand headline fields; the `school_context_schema` and
 * `uk_context` sections have no exported handle and are not rendered.
 *
 * A pure projection of the fixed `as const` corpus, in the repository
 * formatter's normal form.
 */
import { typeSafeValues } from '@oaknational/type-helpers';

import { corpusCaveats, corpusMeta, corpusMethodology } from './corpus-meta.js';
import { autolink, bullets, document, heading, labelFromKey, link } from './eef-markdown-blocks.js';
import { strandLinkFromReference } from './eef-markdown-paths.js';
import { EEF_STRAND_IDS, strandById } from './strand-lookup.js';

function openingParagraph(): string {
  return [
    `Rendered from the corpus's metadata, methodology and strand headline fields: data version ${corpusMeta.data_version} (schema version ${corpusMeta.schema_version}), corpus last updated ${corpusMeta.last_updated}.`,
    "The corpus's school-context schema and UK-context sections are not rendered, and the strand files do not render each strand's school-context relevance block.",
    'Do not edit by hand.',
  ].join(' ');
}

function sourceBlock(): string {
  const { source, licence, coverage } = corpusMeta;
  return bullets([
    `Source: ${source.name} (${source.organisation})`,
    `EEF page: ${autolink(source.url)}`,
    `Authors: ${source.original_authors.join('; ')}`,
    `Licence: ${licence.name} (${autolink(licence.url)})`,
    `Attribution note: ${licence.attribution_note}`,
    `Coverage: ${coverage.age_range}; ${coverage.jurisdiction_focus}; ${coverage.evidence_scope}`,
  ]);
}

function impactMeasureBlocks(): readonly string[] {
  const measure = corpusMethodology.impact_measure;
  return [
    heading(3, measure.name),
    bullets([
      `Unit: ${measure.unit}`,
      `Derivation: ${measure.derivation}`,
      `Interpretation: ${measure.interpretation_guidance}`,
    ]),
  ];
}

function costMeasureBlocks(): readonly string[] {
  const measure = corpusMethodology.cost_measure;
  return [
    heading(3, measure.name),
    bullets(
      typeSafeValues(measure.scale).map(
        (band) =>
          `Rating ${String(band.rating)} (${band.label}): ${band.range_per_pupil_per_year_gbp} per pupil per year; ${band.range_per_class_per_year_gbp} per class per year`,
      ),
    ),
  ];
}

function evidenceStrengthBlocks(): readonly string[] {
  const measure = corpusMethodology.evidence_strength_measure;
  return [
    heading(3, measure.name),
    bullets([
      `Scale: ${String(measure.scale_min)} to ${String(measure.scale_max)}`,
      `Interpretation: ${measure.interpretation_guidance}`,
    ]),
    heading(3, `${measure.name}: factors`),
    bullets(measure.factors),
  ];
}

function conversionBlocks(): readonly string[] {
  const conversion = corpusMethodology.effect_size_to_months_conversion;
  return [
    heading(3, labelFromKey('effect_size_to_months_conversion')),
    bullets(
      conversion.table.map(
        (row) => `Effect size ${row.effect_size_range}: ${String(row.months_progress)} months`,
      ),
    ),
    conversion.notes,
  ];
}

function strandIndex(): string {
  return bullets(
    EEF_STRAND_IDS.map((id) => {
      const strand = strandById(id);
      return `${link(strand.name, strandLinkFromReference(id))} — ${strand.headline.headline_summary} — ${autolink(strand.eef_url)}`;
    }),
  );
}

/**
 * Render the corpus reference file.
 *
 * @returns The complete markdown text, ending in one newline.
 */
export function renderCorpusReferenceMarkdown(): string {
  return document([
    heading(1, `${corpusMeta.source.name} — corpus reference`),
    openingParagraph(),
    heading(2, 'Source and attribution'),
    sourceBlock(),
    heading(2, 'Methodology'),
    ...impactMeasureBlocks(),
    ...costMeasureBlocks(),
    ...evidenceStrengthBlocks(),
    ...conversionBlocks(),
    heading(2, 'Caveats'),
    bullets(corpusCaveats),
    heading(2, 'Strand index'),
    strandIndex(),
  ]);
}
