/**
 * Reviewed post-baseline semantic deltas — the generated MCP runtime files
 * (contract, executor, alias types). These entered the walked current-source
 * set when the pagination echo gave paginated tools a value import of the
 * contract's Link-header helper (2026-09-01 payload audit). Each hash pins
 * the exact reviewed state; every entry is plumbing or types only, with no
 * authored agent-facing prose.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  TYPE_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const SDK_GENERATED_RUNTIME_DELTA_REVIEWS: Readonly<
  Record<string, CurrentSourceDeltaReview>
> = {
  'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/aliases/types.ts':
    excluded('fb9f88dab2aa595bd9066c625f7bdcc99bd68e16950c5ad928c6d3e59d759ee0', TYPE_ONLY),
  // PR 949 review cure: the generated barrel gained the PaginationEcho type
  // export (public reachability of a public result-shape type).
  'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/index.ts': excluded(
    '87a28a7983aea360a1256439b28e975e9f8d48e18c1f90c142f390a18d49c976',
    TYPE_ONLY,
  ),
  'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts':
    excluded(
      'a2042994fb991fe4039a3474638e6afb745a7b5f32e9066076bda140329474d7',
      IMPLEMENTATION_ONLY,
    ),
  'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/runtime/execute.ts':
    excluded(
      '4d89ab01ff55059c0d1c3f6e297df31d073d45dd29a4b9ff88f504517918a1a6',
      IMPLEMENTATION_ONLY,
    ),
};
