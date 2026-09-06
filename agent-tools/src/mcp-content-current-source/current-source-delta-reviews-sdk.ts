/**
 * Reviewed post-baseline semantic deltas — Curriculum-SDK governed sources (aggregated tools, guidance, orientation).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 */
import {
  TEST_ONLY,
  DELETED_SOURCE,
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  type CurrentSourceDeltaReview,
  TYPE_ONLY,
} from './current-source-delta-review-helpers.js';

export const SDK_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  // MCP-366: generateContextHint deleted with the per-response hint; its
  // anchored body (C056) retired via lineage. The seven surviving metadata
  // and instruction rows are unchanged by the deletion.
  // MCP-365: the generated instructions gained the owner-signed
  // brand-provenance closing paragraph (attribution + non-endorsement per
  // LICENCE-DATA.md); C055 re-anchored on its unchanged routing paragraph.
  // Stated-statements refactor: the server-instructions sequencing sentence
  // now names each unit's stated prior knowledge rather than claiming a
  // prior-knowledge graph is served.
  'packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts': reviewed(
    '028902c67f37ef6fc777738f6ebb83b4994cdcbf64ea49d8d777f33b36840e5d',
    ['C049', 'C050', 'C051', 'C052', 'C053', 'C054', 'C055'],
  ),
  // MCP-438: the description's embedded presentation directive (the fonts
  // tip, C163) retired via lineage — directory policy bars descriptions
  // from instructing the model. The six surviving rows are unchanged.
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/definition.ts': reviewed(
    'd3a9820d7ade25c35e5c7d860fe07ac43b797d8defba55e0758a9c024116d525',
    ['C161', 'C162', 'C164', 'C165', 'C166', 'C177'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-asset-download/execution.ts': reviewed(
    '4c88fec1899e18a3f934ddabe4ad79daaabf48300bf9271506c0bca266ee99d6',
    ['C167', 'C168', 'C169'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts': reviewed(
    '38a24f8e5ada622c4a39c872dec240b9f2a70b7073296748248b56059248f55e',
    ['C137', 'C138', 'C139', 'C140', 'C141'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-curriculum-model/definition.ts': reviewed(
    '2df4fe95e40a23b172d9d6b43466c1a55d6135433f9b87001a2728f4e27f9f14',
    ['C172', 'C173', 'C174', 'C175'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts': reviewed(
    'a5e9441a87fb7974b4fa6bf4f81dc238691536bed1b70cf6c31a322561c58f95',
    ['C261', 'C262', 'C263', 'C264', 'C265', 'C266', 'C267', 'C268', 'C269', 'C270'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts': reviewed(
    '927759645750d64ee0096122a3201b2ea48b49602270075e00ea34092027ba6c',
    ['C100', 'C101', 'C102', 'C103', 'C104', 'C105'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/execution.ts': reviewed(
    '56b062278ecd92c465eacaf96bdf787e2a5b23b10f92a6a9f143485462319550',
    ['C151', 'C152', 'C153', 'C154', 'C155', 'C156', 'C157', 'C158', 'C159'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-keyword-graph.ts': reviewed(
    '0d540c388d80a7aed260e7b5cbe1329736d38ec5b6e95a5e040c6c0a59fceee4',
    [
      'C221',
      'C222',
      'C223',
      'C224',
      'C225',
      'C226',
      'C227',
      'C228',
      'C229',
      'C230',
      'C231',
      'C232',
    ],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts': reviewed(
    'd1890c49b2aede5ea09d7cda118ac83d9471f14ab72d9f7ea9813af5580a5d60',
    ['C233', 'C234', 'C235', 'C236', 'C237', 'C238', 'C239', 'C240', 'C241'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts': reviewed(
    'b2ee07ef1e5550084db0171499306ca06c5ab4bd04bff76a1e6e013ae0a5117b',
    ['C065', 'C066', 'C067', 'C068'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts': reviewed(
    'b3a4fcb15ae2f9cf053cd8945e9a5f5df7611eddee2532d5acd5d2edae67c11f',
    ['C252', 'C253', 'C254', 'C255', 'C256', 'C257', 'C258', 'C259', 'C260'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-user-search/tool-definition.ts': reviewed(
    '5349c6faa562a23619b7f4176b137aa1e6e5682baf1d7dfac8fbb8d5cf6a0a75',
    [
      'C118',
      'C119',
      'C120',
      'C121',
      'C122',
      'C123',
      'C124',
      'C125',
      'C126',
      'C127',
      'C128',
      'C129',
    ],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/all-resources.ts': excluded(
    'b33adeff668f1bcb72b3d8098e03240db460f02e2ae3d5aced76041335d7f10f',
    IMPLEMENTATION_ONLY,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/mcp-resource-types.ts': excluded(
    '0e31c4103c0b45fb5d4f59ff7522684e77adf56978336d8ba7cda817f0580c20',
    TYPE_ONLY,
  ),
  // MCP-366: the per-response hint export deleted; C005 retired via lineage.
  'packages/sdks/oak-curriculum-sdk/src/mcp/orientation-guidance.ts': reviewed(
    '0e1f5773d678f5177dcce1cf0e0ebb2e4906956c39f8458d858a70470ad42589',
    ['C001', 'C006'],
  ),
  // MCP-366: the hint-inclusion row (C062) retired via lineage with its line.
  'packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts': reviewed(
    '712365ea40c230c55580d0ea74d1ae1f23a189a16959e89b6899800866f73599',
    ['C059', 'C060', 'C061'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts': excluded(
    'da82fc8370788eefc4a61b2778b78a2f6b56ec457dec7a146bd50fa774937f65',
    IMPLEMENTATION_ONLY,
  ),
  // Pagination echo (2026-09-01 payload audit): the generated-tool envelope
  // now surfaces the upstream Link-header signal beside status and data.
  // Plumbing only; the served prose the cited items pin is unchanged.
  'packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts': reviewed(
    'c83e633368cd3ccb5791e97dac57e58d586b9afa187a47040173dfd02ca57f03',
    ['C057', 'C058'],
  ),
  // MCP-366: requiresDomainContext removed from the registry-descriptor
  // subset with its only runtime reader (the hint inclusion).
  'packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts': excluded(
    '1b5e4bfbcafbd4246cf35452f576fe503f748ab78f2309605c4627c6df3312e4',
    TYPE_ONLY,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts': excluded(
    '915c46784747690ff766918985423872733b85fc07a503b558bc50506113ba9e',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-types.ts': excluded(
    '809f2f9b7475694e99cedc9435978c6ad53eadf5ae0eea740aedb361a96679c9',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts': excluded(
    'fb8ebc1efd1c3847e5becf4212f7aa117160f2b22d92b11fe1f26624e5d93224',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts': excluded(
    '6412a3bf0e7f1f76ea0228101806e6189b7211183bcde4f3664f283f3d7995e9',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/adapt-lesson.ts': excluded(
    '865c28ed699a864501169c4bcfe45f0fff5c4ec43bdc8282f6ccdca8cbb8595c',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/continue-progression.ts': excluded(
    '481e5c709f8f65f706adcf04f47e442f2dccc1dcb16bb5ce4e335d2b2549b8d0',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/curriculum-mapping.ts': excluded(
    'f819abb277bbd2062a484aa7e06adfe42df44f33958f1fe0725e014a0dd2d1ea',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/explore-curriculum.ts': excluded(
    '3f0faff48daf58a880f9d638bf9a0af07ddf931900d03fcc0b6c25530bde8668',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/find-lessons.ts': excluded(
    '5e30b3e76c07e5c9eded93ec8a4af065c7f286b07006879e39cda352a547d4dc',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/learning-progression.ts': excluded(
    'a2d731768e4ab1378919e58c1cc09c80842d1e5d3efd59e7935fa9a8041287f6',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/prompt-messages/lesson-planning.ts': excluded(
    '2868c68e526f5d137fdec81722731059369a3005e33973940ae48c88da5a283b',
    DELETED_SOURCE,
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch/flat-zod-schema.ts': reviewed(
    '5044b06ba31c104a3f1a76d43dc5d0ce5e5cb0c1a5b1e557017c9e2bdd8333c0',
    ['C160'],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/flat-zod-schema.ts': reviewed(
    '08abd4d8b30890ee797d2c67e0ae7ad092f27a4fe82b92c28457449af004e984',
    [
      'C069',
      'C070',
      'C071',
      'C072',
      'C073',
      'C074',
      'C075',
      'C076',
      'C077',
      'C078',
      'C079',
      'C080',
      'C081',
      'C082',
      'C083',
      'C084',
    ],
  ),
  'packages/sdks/oak-curriculum-sdk/src/mcp/test-helpers/advertised-examples.ts': excluded(
    '41be855cff939c4a7f95b36bdc2e3d1fecceecdb0a425b791d4d9af7da766d3a',
    TEST_ONLY,
  ),
};
