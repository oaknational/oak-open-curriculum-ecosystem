/**
 * Reviewed post-baseline semantic deltas — codegen generator sources (templates, typegen, constants).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 */
import {
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  TEST_ONLY,
  TYPE_ONLY,
  type CurrentSourceDeltaReview,
  UPSTREAM_BULK_ONLY,
} from './current-source-delta-review-helpers.js';

export const SDK_CODEGEN_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  'packages/sdks/oak-sdk-codegen/code-generation/apply-deferred-paths.ts': excluded(
    '7d95eb732a06a198166ebf3733a387e66e6c177c1974d4f3d3f194ec3b546ee0',
    IMPLEMENTATION_ONLY,
  ),
  'packages/sdks/oak-sdk-codegen/code-generation/codegen.ts': excluded(
    '1dadef4f96511ba3a7c8ed3defb8db835173e856dc034a816efe74c6617a81e9',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-653: DEFERRED_PATHS gained the dead changelog pair (retired by the
  // MCP-630 schema-cache refresh); SKIPPED_PATHS unchanged.
  'packages/sdks/oak-sdk-codegen/code-generation/excluded-paths.ts': reviewed(
    '850f69ab6b7bc73763ad1bead4571f98cf49056af83877e5b33f81e17b59d05f',
    ['A002', 'C470'],
  ),
  'packages/sdks/oak-sdk-codegen/code-generation/resolve-schema-source.ts': excluded(
    'da1edf8b6b885c8894207e04480ed1f77d54fcfb029cfe2921cd1f781a67d26a',
    IMPLEMENTATION_ONLY,
  ),
  'packages/sdks/oak-sdk-codegen/code-generation/schema-separation-core.ts': excluded(
    '096ce2c5a613a5fa33212ecc6ca1eeba4a575f7d960da32fc3acd1ffd20a4ac9',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-462: keyword records are excluded from oakUrl decoration. Naming the
  // keywords response component pulled it into the name-incidental decorator
  // net, advertising a field the runtime cannot produce (the path resolves to
  // no content type, so augmentArrayResponseWithOakUrl returns the records
  // unchanged). The served oakUrl description strings this file carries are
  // unchanged; only the set of schemas receiving them narrows.
  'packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts': reviewed(
    'de071f45e9fb5cdc04261feb0dc40d4a67a4f51f5d375a1f5e20cc0bdb253ef3',
    ['C430', 'C431', 'C432'],
  ),
  // MCP-462: two OpenAPI fixtures added for the numeric-bound propagation and
  // unpropagated-keyword tests.
  'packages/sdks/oak-sdk-codegen/code-generation/test-fixtures.ts': excluded(
    'a4f3215a92efe4c1ecff01fc51abd54b36d2e2e481cbd288e72d0f1f3a0d6ee3',
    TEST_ONLY,
  ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/schema-templates-part2.ts': excluded(
    '81b743427311cec21ad4a97dff8559e11ee9bfa9df73f3f668d38c7f8f997229',
    UPSTREAM_BULK_ONLY,
  ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/schema-templates-part3.ts': excluded(
    '21cd5d519ee7e3885674fbdb1e74082abad84b75112eb942bb14722d7405b2bf',
    UPSTREAM_BULK_ONLY,
  ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/schema-templates.ts': excluded(
    'd7cefcfc67a83313bc6a88cffdd09ca510e8d34415f8ab3b3afd5e354cd5ac9b',
    UPSTREAM_BULK_ONLY,
  ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/cross-domain-constants.ts': reviewed(
    'fd2db884860762272d0c2824c930d09082e46db88f918e2d47a0035483afcb7b',
    ['C479', 'C480'],
  ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/generate-widget-constants.ts': excluded(
    '2655cff78ca4a1cfb2dd0452f194f6cb33579f2372a0eb1e7ed09e1065e630d5',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-462: reads upstream's numeric bounds off the parameter schema and
  // refuses to emit input surfaces that would silently drop a validation
  // keyword. No change to the served tool prose this file carries.
  // Pagination echo (2026-09-01 payload audit): collects the offset/limit
  // operations into the paginated set threaded to the execute-file emitter.
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts': reviewed(
    'ba9d423ddd3c014bd1f63a0a2c9a80c2ea11b5ddc5182603e5087649fd2f77c2',
    ['C471'],
  ),
  // MCP-462: numeric-bound propagation into the tools/list JSON Schema and
  // both Zod input surfaces, plus the fail-loud unpropagated-keyword check.
  // Generator plumbing; no authored agent-facing prose.
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/build-json-schema-property.ts':
    excluded(
      'af617a17777f90bded1a653d4fb112bd1758be8ee89a08ab8639b95c2780e8a3',
      IMPLEMENTATION_ONLY,
    ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/build-zod-type.ts':
    excluded(
      '3fd17c0fa37d9f59b4ee037db515f6f43c4cfc8313a819fe73b6bbd401ef241b',
      IMPLEMENTATION_ONLY,
    ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/json-schema-types.ts':
    excluded('bc2d7a94e432e246d061fc3f3afbe20d6cbd3f363aab4fbd77268a9cc812b74a', TYPE_ONLY),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/param-constraints.ts':
    excluded(
      '2ecced49925a77dc6d52406f8eba3550ca610a50344a7889e5554856eed35f7b',
      IMPLEMENTATION_ONLY,
    ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/param-metadata.ts':
    excluded(
      'ac36fbb5a03d7d0abcda97628333ab655d4a6c183e9781a1bd934e8eb11e857d',
      IMPLEMENTATION_ONLY,
    ),
  // Pagination echo (2026-09-01 payload audit): paginated invokes derive
  // {hasMore, nextOffset, nextLimit} from the upstream Link header. Emitted
  // runtime plumbing; the served prose the cited items pin is unchanged.
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts': reviewed(
    'cfd851fc8306cd8fcd02975e7d39c756f23824f759a3ab175d07202f0c4e8766',
    ['C475', 'C476', 'C477', 'C478'],
  ),
  // PR 949 review cure: the public mcp-tools barrel now exports the
  // PaginationEcho type consumers see on ToolResultForName. Type export
  // only; no authored agent-facing prose.
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-index-file.ts':
    excluded('f3aec45038f81fd15fd0a5ab8ab6278cedd440a4852dcdd49ae7f0c99465ec15', TYPE_ONLY),
  // Pagination echo (2026-09-01 payload audit): the four emitters below gained
  // the pagination wiring (per-tool passthrough, contract re-export, value
  // import, optional result field). No authored agent-facing prose.
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-execute-file.ts':
    excluded(
      '87f0611682b13d74b0530b2d0dc4cb10cdb068f58211b62e7cba2ef2906cd062',
      IMPLEMENTATION_ONLY,
    ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts':
    excluded(
      '7b3efb0ee10a132148b6d2eb4339b326e44b2921cd6a844260500296d70cc8c9',
      IMPLEMENTATION_ONLY,
    ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-file.ts':
    excluded(
      '77a7a1a80c0faa9b0e59b215601626ec50f084059b731df1befdc61ba8079051',
      IMPLEMENTATION_ONLY,
    ),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-types-file.ts':
    excluded('9f653c2ed20ce865621dac2fea454fe2e04d0c04b8d6ef143bd992848ee4a17c', TYPE_ONLY),
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/widget-uri-suffix.ts': excluded(
    '8c8c63616d88ddc3a467810c92fb899b241b539e958110d09a1013cdc332238a',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-462: upstreamBuggyDescription strings re-pinned to upstream's new
  // wording (2026-08-03 owner card, keep + re-pin); the module carries the
  // served correctDescription content for the lessons offset/limit params.
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/param-description-overrides.ts':
    reviewed('e69a36e5d66cab7ea033dfa5787235e22086b5070634b561c87d32a49e4bddb1', ['C464', 'C465']),
  // MCP-462: shared schema-cache reader consolidated at its second test
  // consumer; test infrastructure only.
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/test-helpers/schema-cache-reader.ts':
    excluded('f5b9dab9db0897facc78f5d565844ec2ce84e40dd6621eb6f843d19d182988cc', TEST_ONLY),
  // PR 949 review cure (Claude review finding): the get-keywords pagination
  // note now points agents at the result's pagination signal (hasMore /
  // nextOffset) instead of prescribing a blind limit-300 walk — the note's
  // own removal condition ("when that signal exists") arrived with the echo.
  'packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/tool-description.ts':
    reviewed('f4ebac6b2dd5ae1d705d3e3b51e4af905d75b268845238cd8f60703c026f4355', [
      'C453',
      'C454',
      'C456',
      'C457',
      'C458',
      'C459',
      'C460',
      'C461',
      'C462',
      'C463',
    ]),
  // MCP-653: the dead changelog pair left PUBLIC_TOOLS with the tools'
  // disable; no new authored agent-facing content.
  'packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.ts': excluded(
    'c42fd325da92d26edb5673528079b3747e205756a12cad6431712c5c0f40ad11',
    IMPLEMENTATION_ONLY,
  ),
};
