/**
 * Reviewed post-baseline semantic deltas — graph-corpus-sdk EEF-strand governed
 * sources changed by the markdown projection (delivery node
 * `eef-corpus-markdown-projection`, 2026-09-06).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state, and one explicit exclusion reason says why the change adds
 * no governed content.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  TEST_ONLY,
  TYPE_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

/**
 * The projection renders the corpus into files a consumer commits elsewhere.
 * It is registered on no served surface and reaches no MCP consumer (ADR-179
 * amendment, 2026-09-06); its only authored text is fixed structural labels,
 * and every other rendered line is corpus text verbatim.
 */
const PROJECTION_ONLY =
  'Markdown projection for a file export: corpus text verbatim plus fixed structural labels; registered on no served surface and reached by no MCP consumer (ADR-179 amendment, 2026-09-06).';

export const SDK_CORPUS_PROJECTION_DELTA_REVIEWS: Readonly<
  Record<string, CurrentSourceDeltaReview>
> = {
  'packages/sdks/graph-corpus-sdk/src/eef-strands/eef-corpus-reference-markdown.ts': excluded(
    'eb53f4ff105f3e4266c96397025d0acf5e860b0e429ea041c476603a3c9bc179',
    PROJECTION_ONLY,
  ),
  'packages/sdks/graph-corpus-sdk/src/eef-strands/eef-markdown-blocks.ts': excluded(
    'fe8e128ad18285b4adda70b7def3190147738739c2711221a875368b0ff4c58e',
    PROJECTION_ONLY,
  ),
  'packages/sdks/graph-corpus-sdk/src/eef-strands/eef-markdown-files.ts': excluded(
    '55edcd943cd84e81c3cc46039fbb8da77423f27a719d754e4f869adc33226489',
    PROJECTION_ONLY,
  ),
  'packages/sdks/graph-corpus-sdk/src/eef-strands/eef-markdown-paths.ts': excluded(
    '670ead32b5c400af4cb64acd7e04aa79ad514e23e8860788fa787c82ab976f99',
    PROJECTION_ONLY,
  ),
  // Key-coverage maps pinned by `satisfies` over the corpus shapes; the tests
  // derive their omission sets from them. No authored agent-facing content.
  'packages/sdks/graph-corpus-sdk/src/eef-strands/eef-markdown-rendered-keys.ts': excluded(
    'b4d1c6b972661979988b05c811be0b633290616c2586d15994dd292867e3b819',
    IMPLEMENTATION_ONLY,
  ),
  'packages/sdks/graph-corpus-sdk/src/eef-strands/eef-strand-markdown-sections.ts': excluded(
    'e88c1144f005f80ef76bfe02870d2d181d93f69d9a5675cb41dbbd0106db7cdd',
    PROJECTION_ONLY,
  ),
  'packages/sdks/graph-corpus-sdk/src/eef-strands/eef-strand-markdown.ts': excluded(
    'd73b8134cf7537fc1671445872dc0d64d6995967727983c4d2eda4a0722b59e6',
    PROJECTION_ONLY,
  ),
  // The package barrel re-exports the projection; the served exports are unchanged.
  'packages/sdks/graph-corpus-sdk/src/eef-strands/index.ts': excluded(
    'fe0db030560b4683e9303e304de79511f98c103b57c9f485c846b653b2c15b28',
    IMPLEMENTATION_ONLY,
  ),
  // One local type alias re-expressed through `StrandCarrying`; no value changes.
  'packages/sdks/graph-corpus-sdk/src/eef-strands/raw-domains.ts': excluded(
    '54791063b7359c2a9bde96e3961b43a9441029fe0481839da8d71c90b73a49bd',
    TYPE_ONLY,
  ),
  // Two exported type helpers (`KeysOfUnion`, `StrandCarrying`); no value changes.
  'packages/sdks/graph-corpus-sdk/src/eef-strands/strand-lookup.ts': excluded(
    'cae7308d2fb96d1d8688cf7755122005afdfb89f647d9a4ac0b8596e51d695bc',
    TYPE_ONLY,
  ),
  'packages/sdks/graph-corpus-sdk/src/eef-strands/test-helpers.ts': excluded(
    'c9196fb3e2d230b705faaef15f6af93e487217da6827c7c35c614cd573069e7b',
    TEST_ONLY,
  ),
};
