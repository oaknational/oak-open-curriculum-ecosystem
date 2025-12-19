/**
 * BM25 Configuration for Phase 3e Ablation Testing.
 * @see `.agent/plans/semantic-search/phase-3-multi-index-and-fields.md`
 */

import type { estypes } from '@elastic/elasticsearch';

type QueryContainer = estypes.QueryDslQueryContainer;

/** BM25 retriever configuration options. */
export interface Bm25Config {
  /** Fuzziness: 'AUTO' (default) or 'AUTO:3,6' (enhanced). */
  readonly fuzziness: 'AUTO' | 'AUTO:3,6' | 0 | 1 | 2;
  /** Prefix length requirement (0 = none, 1 = first char). */
  readonly prefixLength: 0 | 1 | 2;
  /** Allow ab→ba transpositions. */
  readonly fuzzyTranspositions: boolean;
  /** Min terms to match: '75%', '50%', or undefined. */
  readonly minimumShouldMatch: '75%' | '50%' | '25%' | undefined;
  /** Enable phrase prefix (doubles query complexity). */
  readonly enablePhrasePrefix: boolean;
  /** Phrase prefix boost factor. */
  readonly phrasePrefixBoost: number;
}

/** Baseline: pre-Phase-3e (control group). */
const BASE: Bm25Config = {
  fuzziness: 'AUTO',
  prefixLength: 0,
  fuzzyTranspositions: false,
  minimumShouldMatch: undefined,
  enablePhrasePrefix: false,
  phrasePrefixBoost: 0.5,
};

/** Phase 3e: all enhancements. */
const P3E: Bm25Config = {
  fuzziness: 'AUTO:3,6',
  prefixLength: 1,
  fuzzyTranspositions: true,
  minimumShouldMatch: '75%',
  enablePhrasePrefix: true,
  phrasePrefixBoost: 0.5,
};

/** Fuzzy only: enhanced fuzziness, no phrase prefix. */
const FUZZY: Bm25Config = {
  ...BASE,
  fuzziness: 'AUTO:3,6',
  prefixLength: 1,
  fuzzyTranspositions: true,
};

/** Phrase prefix only: test latency impact. */
const PHRASE: Bm25Config = { ...BASE, enablePhrasePrefix: true };

/** Min match only: test precision. */
const MINM: Bm25Config = { ...BASE, minimumShouldMatch: '75%' };

/** No phrase prefix: all except phrase prefix (latency fix hypothesis). */
const NO_PHRASE: Bm25Config = { ...P3E, enablePhrasePrefix: false };

/** Min match 50%: relaxed for better recall. */
const MINM50: Bm25Config = { ...P3E, minimumShouldMatch: '50%' };

/** Named configurations for ablation testing. */
export const BM25_CONFIGS = {
  baseline: BASE,
  phase_3e: P3E,
  fuzzy_only: FUZZY,
  phrase_prefix_only: PHRASE,
  min_match_only: MINM,
  no_phrase_prefix: NO_PHRASE,
  min_match_50: MINM50,
} as const;

/** Configuration name type */
export type Bm25ConfigName = keyof typeof BM25_CONFIGS;

/** All configuration names for iteration */
export const BM25_CONFIG_NAMES: readonly Bm25ConfigName[] = [
  'baseline',
  'fuzzy_only',
  'phrase_prefix_only',
  'min_match_only',
  'no_phrase_prefix',
  'min_match_50',
  'phase_3e',
] as const;

/** Build primary multi_match query with config options. */
function buildPrimaryMatch(
  text: string,
  fields: string[],
  config: Bm25Config,
): estypes.QueryDslMultiMatchQuery {
  const q: estypes.QueryDslMultiMatchQuery = {
    query: text,
    type: 'best_fields',
    tie_breaker: 0.2,
    fuzziness: config.fuzziness,
    fields,
  };
  if (config.prefixLength > 0) {
    q.prefix_length = config.prefixLength;
  }
  if (config.fuzzyTranspositions) {
    q.fuzzy_transpositions = true;
  }
  if (config.minimumShouldMatch) {
    q.minimum_should_match = config.minimumShouldMatch;
  }
  return q;
}

/** Build phrase prefix match for bool.should. */
function buildPhrasePrefix(text: string, fields: string[], boost: number): QueryContainer {
  return { multi_match: { query: text, type: 'phrase_prefix', fields, boost } };
}

/** Creates a configurable BM25 retriever for ablation testing. */
export function createConfigurableBm25Retriever(
  text: string,
  fields: string[],
  filter: QueryContainer | undefined,
  config: Bm25Config,
): estypes.RetrieverContainer {
  const primary = buildPrimaryMatch(text, fields, config);
  if (!config.enablePhrasePrefix) {
    return { standard: { query: { multi_match: primary }, filter } };
  }
  return {
    standard: {
      query: {
        bool: {
          should: [
            { multi_match: primary },
            buildPhrasePrefix(text, fields, config.phrasePrefixBoost),
          ],
          minimum_should_match: 1,
        },
      },
      filter,
    },
  };
}
