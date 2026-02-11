/**
 * Analyzer Configuration Variants for Phase B Ablation Testing
 *
 * Unlike BM25 config (query-time), analyzer changes require reindexing.
 * This file defines the variants to test.
 *
 * **Testing Procedure** (for each variant):
 * 1. Update ES_FILTER_CONFIG and ES_ANALYZER_CONFIG in es-analyzer-config.ts
 * 2. Run: pnpm type-gen && pnpm build
 * 3. Run: pnpm -C apps/oak-search-cli es:setup reset
 * 4. Run: pnpm -C apps/oak-search-cli es:ingest-live
 * 5. Run: pnpm -C apps/oak-search-cli vitest run four-retriever-ablation
 *
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

/** Analyzer variant identifier. */
export type AnalyzerVariant =
  | 'baseline'
  | 'stemming_only'
  | 'minimal_stop_only'
  | 'stemming_minimal_stop'
  | 'stemming_full_stop';

/** Variant configuration for documentation. */
export interface AnalyzerVariantConfig {
  readonly name: AnalyzerVariant;
  readonly description: string;
  readonly hypothesis: string;
  readonly indexFilters: readonly string[];
  readonly searchFilters: readonly string[];
}

/** All analyzer variants to test, ordered from least to most aggressive. */
export const ANALYZER_VARIANTS: readonly AnalyzerVariantConfig[] = [
  {
    name: 'baseline',
    description: 'Current: lowercase only',
    hypothesis: 'Control group',
    indexFilters: ['lowercase'],
    searchFilters: ['lowercase', 'oak_syns_filter'],
  },
  {
    name: 'stemming_only',
    description: 'Light English stemmer (KStem), no stop words',
    hypothesis: 'Stemming alone helps without stop word issues',
    indexFilters: ['lowercase', 'light_english_stemmer'],
    searchFilters: ['lowercase', 'light_english_stemmer', 'oak_syns_filter'],
  },
  {
    name: 'minimal_stop_only',
    description: 'Only remove articles (the, a, an)',
    hypothesis: 'Minimal stop words reduce noise safely',
    indexFilters: ['lowercase', 'minimal_stop'],
    searchFilters: ['lowercase', 'minimal_stop', 'oak_syns_filter'],
  },
  {
    name: 'stemming_minimal_stop',
    description: 'Light stemmer + minimal stop words',
    hypothesis: 'Best of both without over-aggressive removal',
    indexFilters: ['lowercase', 'minimal_stop', 'light_english_stemmer'],
    searchFilters: ['lowercase', 'minimal_stop', 'light_english_stemmer', 'oak_syns_filter'],
  },
  {
    name: 'stemming_full_stop',
    description: 'Light stemmer + full English stop words',
    hypothesis: 'KNOWN TO REGRESS - for documentation only',
    indexFilters: ['lowercase', 'english_stop', 'light_english_stemmer'],
    searchFilters: ['lowercase', 'english_stop', 'light_english_stemmer', 'oak_syns_filter'],
  },
] as const;

/** Get variant by name. */
export function getVariant(name: AnalyzerVariant): AnalyzerVariantConfig {
  const variant = ANALYZER_VARIANTS.find((v) => v.name === name);
  if (!variant) {
    throw new Error(`Unknown variant: ${name}`);
  }
  return variant;
}

/** Phase B results tracking template for documentation. */
export const PHASE_B_RESULTS_TEMPLATE = `
#### Phase B Results (Analyzer Changes)

| Variant | Hard MRR | Std MRR | Zero-Hit | p95 ms | Notes |
|---------|----------|---------|----------|--------|-------|
| baseline | | | | | Control |
| stemming_only | | | | | |
| minimal_stop_only | | | | | |
| stemming_minimal_stop | | | | | |
| stemming_full_stop | | | | | KNOWN REGRESSION |
`;
