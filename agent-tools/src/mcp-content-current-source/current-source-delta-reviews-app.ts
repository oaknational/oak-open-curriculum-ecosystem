/**
 * Reviewed post-baseline semantic deltas — App-served governed sources
 * (bootstrap, tool, and proof surfaces; the auth family lives in
 * current-source-delta-reviews-app-auth.ts).
 *
 * Every entry is a compliance review act: the semantic hash pins the exact
 * reviewed state; item ids cite the audit rows the file carries, or one
 * explicit exclusion reason says why the change adds no governed content.
 */
import {
  DELETED_SOURCE,
  excluded,
  IMPLEMENTATION_ONLY,
  reviewed,
  TEST_ONLY,
  type CurrentSourceDeltaReview,
} from './current-source-delta-review-helpers.js';

export const APP_DELTA_REVIEWS: Readonly<Record<string, CurrentSourceDeltaReview>> = {
  'apps/oak-curriculum-mcp-streamable-http/src/app/app-version-header.ts': excluded(
    '9871f2ded345a8785aabf2d70baa2368690e398c3edfae900eca5073ea2c6891',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-finalize.ts': excluded(
    '35db06b7e8a8eef7d9c768aa76addc8e99fa36dc2b974ef18e3e173404735293',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-security.ts': excluded(
    'dc2928ae4481038f30a4d19abc3c81747cf73f37b1711b284acdc568e59f8d02',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts': reviewed(
    '06c3e987f2603d36c3405a9dd1c08a99728000f931555a3ea04f6ecbfa3348e6',
    ['C323', 'C324'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/create-app-options.ts': excluded(
    '9be38b5d3ef623e943a6ddff0d0d008acfeee81c2e53f34173b45f80886b1522',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/landing-page-artefact.ts': excluded(
    'e62f6c8466af6c86bf6eba00b7d1c3085d0032d0f4ce4c0a821e6fe76d33f08e',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/landing-page-baked.ts': excluded(
    '2a1b210c2232d07408a1a1730c315b0c33ce77346beff3210ee56d2ed2098fc5',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/oauth-and-caching-setup.ts': excluded(
    '98eed582f23cb0bba00b08099e3c1c16000b3e3e649fd22ea723a91348924689',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/orchestration.ts': excluded(
    '884bb199bff48ee638c33fc827fe5d3cb547be740d47cf6ca4ecd484c34055f4',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/app/static-asset-paths.ts': excluded(
    'ff135d5160da12e36b0f4ae6f7acd42e61748d3f21315e2bb0b7a75474197bfe',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-518: `/` now sets the `Vary: Accept` and `no-store` its `/mcp` twin
  // already sets. Response headers only; the document is byte-identical.
  'apps/oak-curriculum-mcp-streamable-http/src/app/static-content.ts': excluded(
    '80673279324e14c6ffc5b83aa97a96f6850b591f8d5baa458fc254e36fa6475b',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/application.ts': excluded(
    'f16f8e80a7f92af82f82408e5365e92a6f2758afdd6d2d6d43886a212bb11f67',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-517: states the configured canonical origin in the forwarded headers
  // origin-deriving middleware reads. Request plumbing only — it authors no
  // served text and reaches no MCP consumer's content.
  'apps/oak-curriculum-mcp-streamable-http/src/canonical-forwarded-headers.ts': excluded(
    '8bc762cc936a9cc86a398a6f2009700f8c1a196977dabd6fe56ecad7076321fd',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/canonical-origin.ts': excluded(
    '01d279a964b9f05d18c8a7b56724aafe1e17f71c2eb98897d15fa7fd5199cabe',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/compose-product-analytics-runtime.ts': excluded(
    'df0cfab0201177986caa0454d94407077f5930f45a8e34d6d15f6ea4b625b35b',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/env-clerk-guards.ts': excluded(
    'fceb09166d44b587a2093664fd9595c3a9741662ad5efb3efd197ce59e083274',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/env-product-analytics.ts': excluded(
    '8a67d2cb8ce836a2b2c34bb7782d8b0bee67dadf437ba9e0a60b0be0baf62a36',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-143 pull request 759: Guard 1b's auth-valve condition restated as its
  // allowed set negated (isLocalRun) for reviewer clarity. Behaviour-identical
  // refactor of a startup validation rule; disposition unchanged — no authored
  // agent-facing content reaches an MCP consumer from this file.
  'apps/oak-curriculum-mcp-streamable-http/src/env.ts': excluded(
    '0537f72528f0ae1c0de9ff41f1e43e99b16fdc5a26890885bee7d6f16288723b',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/feature-flags.ts': excluded(
    '0078dfaf0635235210ac1be277692f97d6b87a1e6e7c49ac7f6169c87bbb17aa',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/generated/oak-under-the-hood-content.ts': reviewed(
    '775eeb6826d2538daa5c92905be153b0a7d46de53a9b60258f1d1a52e8852254',
    ['A010'],
  ),
  // MCP-368: regenerated via build:widget after the wordmark swap — the
  // embed now carries the wide-wordmark geometry and the merged
  // visually-hidden accessible name (+20.2KB, matching the review's
  // predicted +19KB). MCP-434: regenerated again after safe-area insets
  // moved from inline padding to composed custom properties; the
  // embedded text content is unchanged.
  'apps/oak-curriculum-mcp-streamable-http/src/generated/widget-html-content.ts': reviewed(
    '4f74b032fc7ba9e144b43ee2434869a6ff2e28aa3933a7473b0ff86b033181a3',
    ['C394'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/handlers.ts': excluded(
    '54ef89d4c749af313238024e7fe64012c509202d09ecd8bc4d326b47fb116dbf',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-392: wildcard host matching no longer builds a RegExp from
  // allow-list entries (structural CodeQL cure) — pure engineering, no
  // agent-facing content in this file.
  'apps/oak-curriculum-mcp-streamable-http/src/host-header-validation.ts': excluded(
    '22a5ce24820a998f391c89ded676191d64e4761275766cac748747a222662bf1',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/host-validation-error.ts': reviewed(
    '3873184adb7f9ef5dbb9344487a412a8fa7e891a0ddcc6aa9b2b7513a583134b',
    ['C702', 'C703', 'C704'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/index.ts': excluded(
    '895ee6647d2eab509c63d8384643b35dd354cbfec0b97fb9699667a91dbbc281',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/logging/index.ts': excluded(
    '2cfad19d9ebd98c1c417b7641c651ae271e399a3448d1b26fbc7da1bd11e6d2f',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-middleware.ts': excluded(
    '330e97824013a4fd69bfc0c259ba7fb977e1127f11359d597a333c8d58428250',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-353 (§2.F cure): the fetch trigger, canonical URL, and resource_link
  // rows (C375, C377, C380–C383) retired via lineage; the baked orientation
  // body is A010 in src/generated/oak-under-the-hood-content.ts.
  'apps/oak-curriculum-mcp-streamable-http/src/oak-under-the-hood/oak-under-the-hood-tool.ts':
    reviewed('2c28587c89c4b3c691c9f39a3b8e3e28946f470b74b235325d8c1fd7085f7a1f', [
      'C371',
      'C372',
      'C373',
      'C374',
      'C376',
      'C378',
      'C379',
    ]),
  'apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-handlers.ts': reviewed(
    'ab2dd71908871e8552d0b53a92f275541bdb73fc06e95081f0f2f8b44e49aee4',
    ['C401'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/oauth-proxy/oauth-proxy-redirect-uri-validation.ts':
    excluded(
      'e558e4cecc9d7e8cb6dbb20b2cc4734efc09a2a0e5f074cbb7bc7db235b0663a',
      IMPLEMENTATION_ONLY,
    ),
  // MCP-243: process-level close funnel for analytics + observability —
  // pure lifecycle plumbing, serves no agent-facing content.
  'apps/oak-curriculum-mcp-streamable-http/src/process-close-owner.ts': excluded(
    'dca53600544a92785e66fd3a48fb0f59e4bcc5d2ffce20aff4dfd853a9218d66',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/product-analytics-config.ts': excluded(
    '19d598ca413c7eeb9e509ddc38d44e006b761f8654c0a7e641b68b232d7c8610',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/runtime-config-from-validated-env.ts': excluded(
    '1b0a02d27b6f29e88a0cc9c4aa5576ee72bbf0770f44a56ccab423668acb1043',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/runtime-config-support.ts': excluded(
    '4b9051b733ea0e6cef7e072352c597117d24b330c3df3697978332bf0c6af4f3',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/runtime-config.ts': excluded(
    'd0efa55d83f113991bacb5f629c918067ae1907665b4df12670ccae605c603da',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/security-config.ts': excluded(
    '5ffd8c944b7485aa399b8c317db92acfb636b40e1ae4963f8dd028dcf33e4f19',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/security-headers.ts': excluded(
    '34c260d44df8b6314b7b3958c627a3491264d916ca41aff0aafef07f2e8ab24d',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-351: the landing page's canonical-URL resolution promoted here as the
  // one per-deployment self-description derivation; C355's endpoint URL
  // strings relocated with it.
  // MCP-511: adds `resolveServedPrmUrl` and the well-known prefix constant, so
  // this module is now the one home for both self-descriptions — the endpoint
  // and its protected-resource metadata URL. C355 re-anchors on the same
  // endpoint construction; the addition is a derived address built from the
  // constants already here, carrying no new authored text.
  'apps/oak-curriculum-mcp-streamable-http/src/served-origin.ts': reviewed(
    '24c3c95488ee833c38c519badc175eab7d37406fd7276b7014013eee4aa61bee',
    ['C355'],
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/served-surface/filter-guidance-content.ts': excluded(
    '9a97e4382a301bc9b2b6ea0461f8ba0dffd087d7d026e4634855e3d5682e7a12',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/served-surface/served-surface.ts': reviewed(
    '15c76f4100bec4a96aa51d7b082262b02043666b8fb74a3cf2d1b6250ad09efb',
    ['A001'],
  ),
  // MCP-243: HTTP server bootstrap wiring the close funnel into every exit
  // path — pure lifecycle plumbing, serves no agent-facing content.
  'apps/oak-curriculum-mcp-streamable-http/src/server-runtime.ts': excluded(
    'b408cd0cd9df7ff44374befbb87a7ed14a505fd36bf7b80dc706151cd495b28f',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/server.ts': excluded(
    '54f8c8f08eddc4f862d3cb66382db80ce07c15ea1822d91cab6e97a0767ddcbe',
    IMPLEMENTATION_ONLY,
  ),
  // MCP-403 review round: check-then-patch guard on the fetch sentinel so a
  // second in-process execution cannot capture the blocking fetch as original.
  'apps/oak-curriculum-mcp-streamable-http/src/test.setup.ts': excluded(
    'b01e9673dddd262878ca8a768bce108bb697af23ad4a9d6957a9ed1ddaa0c1f2',
    TEST_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/prompt-schemas.ts': excluded(
    'b72ba8cceb54d32bf4346f202d1c13193bd9c4006a3426a555869ad7f112f7ca',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts': excluded(
    '3260d7418fadfadd67e209a927f0a87d30645dfcbd94beb1f75833cf1f8d2842',
    DELETED_SOURCE,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-handler.ts': excluded(
    '7f58aa789c930b5e95a9cc1cc18330be5b6f9ebf99c6464e7a6af2865766d7f7',
    IMPLEMENTATION_ONLY,
  ),
  'apps/oak-curriculum-mcp-streamable-http/src/mcp-request-context.ts': excluded(
    'c9a8034e012985e0178537f7381243f5b461a97c444b0fe02f1df28efdd5d1f8',
    IMPLEMENTATION_ONLY,
  ),
};
