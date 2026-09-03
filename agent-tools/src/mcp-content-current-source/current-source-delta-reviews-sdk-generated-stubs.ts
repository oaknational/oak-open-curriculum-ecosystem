/**
 * Reviewed post-baseline semantic deltas — the generated stub-mode tool
 * mirrors. Stubs carry no audited items of their own (the served items live
 * on the tools files), so entries here are exclusions pinning the exact
 * reviewed state of generated propagation.
 */
import {
  DELETED_SOURCE,
  excluded,
  IMPLEMENTATION_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const SDK_GENERATED_STUBS_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> =
  {
    // MCP-653: the dead changelog pair disabled via DEFERRED_PATHS ahead of
    // the MCP-630 schema-cache refresh; the stub mirrors and their index
    // entry regenerated away with the tools.
    'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-changelog.ts':
      excluded('4a1cdb7a62fd3b85de9ef96e88dec8c199c10166e019fb165ad86432047fba31', DELETED_SOURCE),
    'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-changelog-latest.ts':
      excluded('f4b610f94f82a4f1501fc14eabefe9a9ce938fca6c66a2e6a4cadf49016c8ce3', DELETED_SOURCE),
    'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/index.ts':
      excluded(
        '96938351932409c50b9599d02966cc9d57b651b6281134051c86f0c5a245f3d8',
        IMPLEMENTATION_ONLY,
      ),
    // MCP-462: the stub mirrors gained upstream's new thread-parameter
    // description via regeneration.
    'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-threads-units.ts':
      excluded(
        '1e2c1d601897ebf8ca317ecbcd4acb4eadb9d25ac1edd59d9ac8fbbac43d7c46',
        IMPLEMENTATION_ONLY,
      ),
    'packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/stubs/tools/get-threads.ts':
      excluded(
        '9d1880bf2a71fa11164344cd91000cfffb415b07c39d8e3fbde4a9b2f730b775',
        IMPLEMENTATION_ONLY,
      ),
  };
