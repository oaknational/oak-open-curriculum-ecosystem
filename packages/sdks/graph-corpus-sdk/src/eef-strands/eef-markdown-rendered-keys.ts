/**
 * Compile-time coverage of the corpus keys the markdown projection renders.
 *
 * Each map names every key its source shape carries and marks it `rendered`
 * or `omitted`; the `satisfies` clause pins the map to the exact key set the
 * corpus carries, so a corpus refresh that adds a key (or drops one) fails the
 * build at that map, naming the key, before any file is rendered. The maps
 * are values, not types: the tests derive their omission sets from them, so
 * the leaf walk and the pins cannot drift apart, and no test tests a type.
 */
import { typeSafeEntries } from '@oaknational/type-helpers';

import type { CorpusMeta, CorpusMethodology } from './corpus-meta.js';
import type { BehindTheAverage, PhaseDetail } from './eef-strand-markdown-sections.js';
import type { EEF_TOOLKIT_DATA } from './eef-toolkit.external-data.js';
import type { EefStrand, KeysOfUnion, StrandCarrying } from './strand-lookup.js';

/** Whether the projection renders a key's value or omits it by name. */
export type KeyCoverage = 'rendered' | 'omitted';
type CoverageOf<K extends string> = Readonly<Record<K, KeyCoverage>>;

/** The corpus's top-level sections: the school-context schema and UK context have no exported handle. */
const CORPUS_SECTIONS = {
  meta: 'rendered',
  methodology: 'rendered',
  strands: 'rendered',
  school_context_schema: 'omitted',
  uk_context: 'omitted',
} as const satisfies CoverageOf<keyof typeof EEF_TOOLKIT_DATA>;

/** Strand keys: the evidence tools' selector block (its figures on some strands are a named follow-up) and the URL slug are omitted. */
const STRAND_KEYS = {
  id: 'rendered',
  name: 'rendered',
  eef_url: 'rendered',
  headline: 'rendered',
  definition: 'rendered',
  key_findings: 'rendered',
  effectiveness: 'rendered',
  behind_the_average: 'rendered',
  closing_the_disadvantage_gap: 'rendered',
  implementation: 'rendered',
  related_guidance_reports: 'rendered',
  related_strands: 'rendered',
  update_history: 'rendered',
  tags: 'rendered',
  slug: 'omitted',
  school_context_relevance: 'omitted',
} as const satisfies CoverageOf<KeysOfUnion<EefStrand>>;

const HEADLINE_KEYS = {
  impact_months: 'rendered',
  cost_rating: 'rendered',
  cost_label: 'rendered',
  evidence_strength_rating: 'rendered',
  evidence_strength_label: 'rendered',
  headline_summary: 'rendered',
  number_of_studies: 'rendered',
} as const satisfies CoverageOf<KeysOfUnion<EefStrand['headline']>>;

const DEFINITION_KEYS = {
  short: 'rendered',
  full: 'rendered',
} as const satisfies CoverageOf<KeysOfUnion<EefStrand['definition']>>;

const EFFECTIVENESS_KEYS = {
  summary: 'rendered',
  mechanisms: 'rendered',
} as const satisfies CoverageOf<KeysOfUnion<StrandCarrying<'effectiveness'>['effectiveness']>>;

const BEHIND_THE_AVERAGE_KEYS = {
  summary: 'rendered',
  by_phase: 'rendered',
  by_subject: 'rendered',
  moderating_factors: 'rendered',
} as const satisfies CoverageOf<KeysOfUnion<BehindTheAverage>>;

const PHASE_FIELDS = {
  impact_months: 'rendered',
  notes: 'rendered',
} as const satisfies CoverageOf<KeysOfUnion<PhaseDetail>>;

type BySubjectEntry = Extract<
  BehindTheAverage,
  Record<'by_subject', unknown>
>['by_subject'][number];
const SUBJECT_FIELDS = {
  subject: 'rendered',
  notes: 'rendered',
} as const satisfies CoverageOf<KeysOfUnion<BySubjectEntry>>;

const DISADVANTAGE_GAP_KEYS = {
  summary: 'rendered',
} as const satisfies CoverageOf<
  KeysOfUnion<StrandCarrying<'closing_the_disadvantage_gap'>['closing_the_disadvantage_gap']>
>;

const IMPLEMENTATION_KEYS = {
  key_considerations: 'rendered',
  common_pitfalls: 'rendered',
  digital_technology_application: 'rendered',
} as const satisfies CoverageOf<KeysOfUnion<StrandCarrying<'implementation'>['implementation']>>;

const GUIDANCE_REPORT_FIELDS = {
  title: 'rendered',
  url: 'rendered',
} as const satisfies CoverageOf<
  KeysOfUnion<StrandCarrying<'related_guidance_reports'>['related_guidance_reports'][number]>
>;

const UPDATE_HISTORY_FIELDS = {
  date: 'rendered',
  notes: 'rendered',
} as const satisfies CoverageOf<
  KeysOfUnion<StrandCarrying<'update_history'>['update_history'][number]>
>;

const META_KEYS = {
  schema_version: 'rendered',
  data_version: 'rendered',
  source: 'rendered',
  licence: 'rendered',
  last_updated: 'rendered',
  coverage: 'rendered',
  caveats: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMeta>;

const SOURCE_KEYS = {
  name: 'rendered',
  url: 'rendered',
  organisation: 'rendered',
  original_authors: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMeta['source']>;

const LICENCE_KEYS = {
  name: 'rendered',
  url: 'rendered',
  attribution_note: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMeta['licence']>;

const COVERAGE_KEYS = {
  age_range: 'rendered',
  jurisdiction_focus: 'rendered',
  evidence_scope: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMeta['coverage']>;

const METHODOLOGY_KEYS = {
  impact_measure: 'rendered',
  cost_measure: 'rendered',
  evidence_strength_measure: 'rendered',
  effect_size_to_months_conversion: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMethodology>;

const IMPACT_MEASURE_KEYS = {
  name: 'rendered',
  unit: 'rendered',
  derivation: 'rendered',
  interpretation_guidance: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMethodology['impact_measure']>;

const COST_MEASURE_KEYS = {
  name: 'rendered',
  scale: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMethodology['cost_measure']>;

type CostScale = CorpusMethodology['cost_measure']['scale'];
const COST_BAND_KEYS = {
  rating: 'rendered',
  label: 'rendered',
  range_per_pupil_per_year_gbp: 'rendered',
  range_per_class_per_year_gbp: 'rendered',
} as const satisfies CoverageOf<KeysOfUnion<CostScale[keyof CostScale]>>;

const EVIDENCE_STRENGTH_KEYS = {
  name: 'rendered',
  scale_min: 'rendered',
  scale_max: 'rendered',
  factors: 'rendered',
  interpretation_guidance: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMethodology['evidence_strength_measure']>;

const CONVERSION_KEYS = {
  table: 'rendered',
  notes: 'rendered',
} as const satisfies CoverageOf<keyof CorpusMethodology['effect_size_to_months_conversion']>;

const CONVERSION_ROW_KEYS = {
  effect_size_range: 'rendered',
  months_progress: 'rendered',
} as const satisfies CoverageOf<
  keyof CorpusMethodology['effect_size_to_months_conversion']['table'][number]
>;

/** Every coverage map, by the source shape it pins. */
export const RENDERED_KEY_COVERAGE = {
  corpus: CORPUS_SECTIONS,
  strand: STRAND_KEYS,
  headline: HEADLINE_KEYS,
  definition: DEFINITION_KEYS,
  effectiveness: EFFECTIVENESS_KEYS,
  behindTheAverage: BEHIND_THE_AVERAGE_KEYS,
  phase: PHASE_FIELDS,
  subject: SUBJECT_FIELDS,
  disadvantageGap: DISADVANTAGE_GAP_KEYS,
  implementation: IMPLEMENTATION_KEYS,
  guidanceReport: GUIDANCE_REPORT_FIELDS,
  updateHistory: UPDATE_HISTORY_FIELDS,
  meta: META_KEYS,
  source: SOURCE_KEYS,
  licence: LICENCE_KEYS,
  coverage: COVERAGE_KEYS,
  methodology: METHODOLOGY_KEYS,
  impactMeasure: IMPACT_MEASURE_KEYS,
  costMeasure: COST_MEASURE_KEYS,
  costBand: COST_BAND_KEYS,
  evidenceStrength: EVIDENCE_STRENGTH_KEYS,
  conversion: CONVERSION_KEYS,
  conversionRow: CONVERSION_ROW_KEYS,
} as const;

/**
 * The keys a coverage map marks omitted, as a leaf walk's omission set.
 *
 * @param coverage - One of the maps in {@link RENDERED_KEY_COVERAGE}.
 * @returns The omitted keys.
 */
export function omittedKeys(coverage: Readonly<Record<string, KeyCoverage>>): ReadonlySet<string> {
  return new Set(
    typeSafeEntries(coverage).flatMap(([key, value]) => (value === 'omitted' ? [key] : [])),
  );
}
