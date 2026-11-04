/**
 * The per-section renderers behind `renderStrandMarkdown`, one function per
 * corpus section so each stays small and each optional section's presence
 * check is bound to a local before it is read (`in` narrows a binding, not a
 * property expression).
 *
 * Every line is corpus text or a fixed structural label; nothing is
 * paraphrased. Sections a strand does not carry are simply absent from its
 * rendering. `school_context_relevance` is not rendered: it is the block the
 * evidence tools select on, and for some strands it also carries per-phase
 * and per-application impact figures and a study count; rendering those
 * figures is a named follow-up in the delivery node, not a silent drop. The
 * key set each section reads is pinned at compile time in
 * `./eef-markdown-rendered-keys.ts`, so a corpus refresh that adds a key
 * fails the build rather than dropping data silently.
 */
import { typeSafeEntries } from '@oaknational/type-helpers';

import { corpusMeta } from './corpus-meta.js';
import { autolink, bullets, code, heading, labelFromKey, link } from './eef-markdown-blocks.js';
import { CORPUS_REFERENCE_LINK_FROM_STRAND, strandLinkFromStrand } from './eef-markdown-paths.js';
import type { HeadlineImpactMonths } from './raw-domains.js';
import { strandById, type EefStrand, type StrandCarrying } from './strand-lookup.js';

/** The `behind_the_average` shapes across the strands that carry one. */
export type BehindTheAverage = StrandCarrying<'behind_the_average'>['behind_the_average'];
/** Distributes over a union of object types, yielding the union of their property values. */
type ValuesOfUnion<T> = T extends unknown ? T[keyof T] : never;
type ByPhase = Extract<BehindTheAverage, Record<'by_phase', unknown>>['by_phase'];
/**
 * One phase's entry under `behind_the_average.by_phase`, derived from the
 * corpus as the union of every literal shape a phase entry takes (months
 * only, notes only, or both), never restated by hand.
 */
export type PhaseDetail = ValuesOfUnion<ByPhase>;

/** The provenance bullets that open every strand file. */
export function provenanceSection(strand: EefStrand): string {
  return bullets([
    `Corpus: ${corpusMeta.source.name}, data version ${corpusMeta.data_version}, corpus last updated ${corpusMeta.last_updated}`,
    `Strand id: ${code(strand.id)}`,
    `EEF page: ${autolink(strand.eef_url)}`,
    `Source, methodology and caveats: ${link('EEF corpus reference', CORPUS_REFERENCE_LINK_FROM_STRAND)}`,
    'Rendered from the corpus; do not edit by hand',
  ]);
}

function impactLine(impactMonths: HeadlineImpactMonths): string {
  const value = impactMonths === null ? 'no figure in the corpus' : String(impactMonths);
  return `Months of additional progress: ${value}`;
}

/**
 * The headline metrics, each as the corpus's own label and rating; the scales
 * behind the ratings are stated once, in the corpus reference file. The
 * corpus's one-line summary is carried verbatim.
 */
export function headlineSection(strand: EefStrand): readonly string[] {
  const { headline } = strand;
  const lines = [
    impactLine(headline.impact_months),
    `Implementation cost: ${headline.cost_label} (rating ${String(headline.cost_rating)})`,
    `Evidence strength: ${headline.evidence_strength_label} (rating ${String(headline.evidence_strength_rating)})`,
  ];
  if ('number_of_studies' in headline) {
    lines.push(`Number of studies: ${String(headline.number_of_studies)}`);
  }
  lines.push(`Summary: ${headline.headline_summary}`);
  return [heading(2, 'Headline'), bullets(lines)];
}

/** `effectiveness`: summary and the mechanisms the corpus names. */
export function effectivenessSection(strand: EefStrand): readonly string[] {
  if (!('effectiveness' in strand)) {
    return [];
  }
  const detail = strand.effectiveness;
  return [
    heading(2, 'Effectiveness'),
    detail.summary,
    heading(3, 'Mechanisms'),
    bullets(detail.mechanisms),
  ];
}

function phaseLine(phase: string, detail: PhaseDetail): string {
  const parts: string[] = [];
  if ('impact_months' in detail) {
    parts.push(`${String(detail.impact_months)} months of additional progress`);
  }
  if ('notes' in detail) {
    parts.push(detail.notes);
  }
  return `${labelFromKey(phase)}: ${parts.join('; ')}`;
}

function byPhaseBlocks(detail: BehindTheAverage): readonly string[] {
  if (!('by_phase' in detail)) {
    return [];
  }
  // `keyof` over the union of `by_phase` shapes is the INTERSECTION of their
  // keys (measured: `primary | secondary`), so iterating `detail.by_phase`
  // directly would type its entries as if `early_years` did not exist while
  // the runtime still yields it: a lying type. Reading the object as a
  // string-keyed record of the derived entry type keeps every key at the type
  // level as well.
  const phases: Readonly<Record<string, PhaseDetail>> = detail.by_phase;
  return [
    heading(3, 'By phase'),
    bullets(typeSafeEntries(phases).map(([phase, entry]) => phaseLine(phase, entry))),
  ];
}

function bySubjectBlocks(detail: BehindTheAverage): readonly string[] {
  if (!('by_subject' in detail)) {
    return [];
  }
  return [
    heading(3, 'By subject'),
    bullets(detail.by_subject.map((entry) => `${entry.subject}: ${entry.notes}`)),
  ];
}

function moderatingFactorBlocks(detail: BehindTheAverage): readonly string[] {
  if (!('moderating_factors' in detail)) {
    return [];
  }
  return [heading(3, 'Moderating factors'), bullets(detail.moderating_factors)];
}

/** `behind_the_average`: any of a summary, per-phase detail, per-subject detail and moderating factors. */
export function behindTheAverageSection(strand: EefStrand): readonly string[] {
  if (!('behind_the_average' in strand)) {
    return [];
  }
  const detail = strand.behind_the_average;
  const summary = 'summary' in detail ? [detail.summary] : [];
  return [
    heading(2, 'Behind the average'),
    ...summary,
    ...byPhaseBlocks(detail),
    ...bySubjectBlocks(detail),
    ...moderatingFactorBlocks(detail),
  ];
}

/** `closing_the_disadvantage_gap`: the corpus's summary. */
export function disadvantageGapSection(strand: EefStrand): readonly string[] {
  if (!('closing_the_disadvantage_gap' in strand)) {
    return [];
  }
  return [heading(2, 'Closing the disadvantage gap'), strand.closing_the_disadvantage_gap.summary];
}

/** `implementation`: key considerations, plus common pitfalls and the digital-technology note where the corpus carries them. */
export function implementationSection(strand: EefStrand): readonly string[] {
  if (!('implementation' in strand)) {
    return [];
  }
  const detail = strand.implementation;
  const blocks = [
    heading(2, 'Implementation'),
    heading(3, 'Key considerations'),
    bullets(detail.key_considerations),
  ];
  if ('common_pitfalls' in detail) {
    blocks.push(heading(3, 'Common pitfalls'), bullets(detail.common_pitfalls));
  }
  if ('digital_technology_application' in detail) {
    blocks.push(
      heading(3, 'Digital technology application'),
      detail.digital_technology_application,
    );
  }
  return blocks;
}

/** `related_guidance_reports`: the EEF guidance reports the corpus links from this strand. */
export function guidanceReportsSection(strand: EefStrand): readonly string[] {
  if (!('related_guidance_reports' in strand)) {
    return [];
  }
  return [
    heading(2, 'Related guidance reports'),
    bullets(strand.related_guidance_reports.map((report) => link(report.title, report.url))),
  ];
}

/** `related_strands`: sibling files, linked by strand name with the id beside it. */
export function relatedStrandsSection(strand: EefStrand): readonly string[] {
  if (!('related_strands' in strand)) {
    return [];
  }
  return [
    heading(2, 'Related strands'),
    bullets(
      strand.related_strands.map(
        (id) => `${link(strandById(id).name, strandLinkFromStrand(id))} (${code(id)})`,
      ),
    ),
  ];
}

/** `update_history`: the corpus's dated update notes for the strand. */
export function updateHistorySection(strand: EefStrand): readonly string[] {
  if (!('update_history' in strand)) {
    return [];
  }
  return [
    heading(2, 'Update history'),
    bullets(strand.update_history.map((entry) => `${entry.date}: ${entry.notes}`)),
  ];
}
