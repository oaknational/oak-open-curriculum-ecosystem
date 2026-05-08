# [1.10.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.9.0...v1.10.0) (2026-05-08)


### Bug Fixes

* **agent-tools:** address PR 102 follow-up threads ([7d09edb](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7d09edb2b2cbe88eb2d3473c14b1c96048dd9d61))
* **agent-tools:** clear PR 102 snagging blockers ([e805040](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/e8050400383011fe0275718c04a0571001159a96))
* **codegen:** remove emitted schema message spacing ([2de81a4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/2de81a4cf8b5f9de19bc9d9df3abdcd2f2ce0eae))
* **eslint:** replace deprecated config helper ([8ad0f1e](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/8ad0f1e8e443fbe682055294791e5c5e5bbb14e1))
* **pr-102:** clear closeout review blockers ([6e42a58](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6e42a588fd2da3852526566543a9a196977f2b70))


### Features

* **agent-tools:** report branch touched file count ([b95de26](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/b95de268b802fa133c1f957f51cc52c5fe5ee3d4))

# [1.9.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.8.1...v1.9.0) (2026-05-07)


### Bug Fixes

* code quality ([7bc930e](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7bc930e50cf4b7ea541b8eaaa5f0f89fab2d9889))
* **codegen:** harden synonym regex and operation guard ([deec6a0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/deec6a00808c81d77d12d1c10f49d7be36c0d18a))
* **practice:** show fitness response discipline ([dc04d80](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/dc04d80b4c248172040cdb7efd9d7a805f53af6d))
* **sonar:** close S7781 + bound synonym-miner regex input ([5b5b9d4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/5b5b9d4a541078d64f82bc777354f09499eafd23))
* **sonar:** preserve useful remediation cleanups ([c2f5402](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c2f5402b27365049f7658ee28609c18767c6cc74))
* **sonar:** remediate quality gate blockers ([457fa1f](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/457fa1f01399de95a275784a914804154a1ebfea))


### Features

* **agent-tools:** add practice substrate evaluators ([1392527](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/1392527081c335c1e5a1c8cb8023805f2f45b905))
* **agent-tools:** add practice substrate report mode ([44c73e4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/44c73e4d6aa44d2d3f3b1084a3c83e5a6f1c9aca))
* **agent-tools:** finish substrate doctor safe merge ([a09fec3](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a09fec3c24ae2e2e8aac8a9e3418f4fd74e90786))

## [1.8.1](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.8.0...v1.8.1) (2026-05-07)


### Bug Fixes

* Address 5 SonarQube issues ([510d466](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/510d466183cdb68fda6bc386e8c0835ea143e633))

# [1.8.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.7.2...v1.8.0) (2026-05-06)


### Bug Fixes

* **ci:** remove retired smoke:dev:stub from pre-push hook and CI workflow ([ef593be](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ef593be9386a872224019c83bd66ef014db2bd61))
* **hooks:** repair WS4 SHA-block citation after distilled.md rotation ([aa6e37d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/aa6e37d5879bc1364275ed2e9d48cdd8ee07f35e))
* **observability:** dev boot falls through to local-dev; delete dead error kind and skipped tests ([2a2d1b0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/2a2d1b05c3c1ba848df447563053d785809fef15))
* **sdk:** align thread-units adapter to upstream schema dropping unitOrder ([9e657ad](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/9e657ad3542ddb936a014deb17f8d9ebfd85ee3e))


### Features

* **agent-tools:** expand identity wordlists and cache session names ([ea7d3e0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ea7d3e013166c9fedb47e592e31c3987001054d2))
* **agent-tools:** improve collaboration cli ergonomics ([33aeec4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/33aeec409f638c54443edfcac94e3715f4b66357))
* **commit-skill:** orchestrate fitness, vocabulary, message-check gates ([767ee23](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/767ee23a64198ae4a11619b8d7c10a60129ad4b2))
* **cursor:** add repo-owned status-line identity shim ([c1a63a8](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c1a63a81ddcc7e703f10518467eecf21054e07f3))
* **hooks:** block wildcard git add staging with citations ([0fffc55](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0fffc55e41aa38b5e670711a9f9903d5c8947b7f))
* **hooks:** scoped hedging-vocabulary trip-list at write-time ([c256f32](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c256f325bbff957ca2a7761e06d31341d38a78f0))
* **hooks:** scoped sha-in-permanent-doc regex with context exclusions ([8b0fe82](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/8b0fe826f823e704612ea3d813fbe517b75fbc97)), closes [#3](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/3)
* **oak-eslint:** add no-real-io-in-tests rule and clear gate blockers ([368e5af](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/368e5affccb055c7ee61f1dd0259a27336533a2b))
* **oak-eslint:** wire no-real-io-in-tests at warn with frozen allowlist (close step 07) ([483a9e3](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/483a9e329c63e0389421268b20725f25dc63585c)), closes [#5](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/5)
* **observability:** add WS1 multi-sink + fixtures axes scaffolding (RED) ([a3a0222](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a3a0222ab2d1ee8ebdd781df72cff1d195fc9bd8))
* **observability:** land ARC A1 canonical smoke harness + skip-arc RED tests ([792c2ca](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/792c2cada25ffb9f0d9dde54a8514d47e7e61b7f))

## [1.7.2](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.7.1...v1.7.2) (2026-04-30)


### Bug Fixes

* **build:** pin pnpm/action-setup to maintainer-Latest v5.0.0 ([8a92882](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/8a928821a550644ad26d548633e38ff706caea61)), closes [pnpm/action-setup#228](https://github.com/pnpm/action-setup/issues/228) [pnpm/action-setup#228](https://github.com/pnpm/action-setup/issues/228) [pnpm/pnpm#11264](https://github.com/pnpm/pnpm/issues/11264)

## [1.7.1](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.7.0...v1.7.1) (2026-04-30)


### Bug Fixes

* **observability:** also pass through TEST_ERROR_SECRET in turbo.json ([c9e3007](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c9e300757860d2485a7372fd34d7746977f11147))
* **observability:** resolve Sentry build-plugin identity from env, not source ([f2a71d4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/f2a71d4c97b44e323ed561538a996c6d82377d47))
* remove unecessary complexity ([ee06114](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ee061144dd7b8cf237c6dd665e748f6c863259b6))
* resolve recurring pnpm lock corruption ([837fcfd](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/837fcfde29b24cc2ca758afa8f33419169f9b950))

# [1.7.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.6.1...v1.7.0) (2026-04-29)


### Features

* fix repeat merge error in pnpm-lock ([bb4f2d0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/bb4f2d02a407e1d1712a4d26e2c99baf5ce0d044))

## [1.6.1](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.6.0...v1.6.1) (2026-04-29)


### Bug Fixes

* **build:** unblock Vercel release pipeline + TS6 migration + workspace-script rules ([#90](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/90)) ([54f07f6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/54f07f63dba39364f5088fcdb25bd471c2a356d5)), closes [#80](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/80) [hi#context](https://github.com/hi/issues/context) [#70](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/70)

# [1.6.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.5.0...v1.6.0) (2026-04-28)


### Features

* **observability:** Sentry/OTel public-alpha foundations — esbuild-native build, rate limiting, Search CLI adoption, agent-memory taxonomy ([#87](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/87)) ([05f994c](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/05f994c09c582afa7dac09550db8a34dc13efa27)), closes [hi#level-](https://github.com/hi/issues/level-) [hi#level](https://github.com/hi/issues/level)

# [1.5.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.4.0...v1.5.0) (2026-04-11)


### Features

* **sdk,mcp-app:** open education knowledge surfaces — WS-0/1/2 + EEF plan ([#78](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/78)) ([779ab47](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/779ab475a267e9e2dda0f156e8f70b463e54a039))

# [1.4.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.3.0...v1.4.0) (2026-04-10)


### Features

* **mcp-app,design:** fresh React MCP App with Oak branding, design tokens, and SDK alignment ([#76](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/76)) ([028dc21](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/028dc2171009a2cebc91536c3662be5efa39ae9b)), closes [#1](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/1) [#2](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/2) [#bef2bd](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/bef2bd) [#222222](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/222222) [#008237](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/008237) [#008237](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/008237)

# [1.3.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.2.0...v1.3.0) (2026-03-31)


### Features

* **observability:** add Sentry + OTel foundation for HTTP MCP server ([#73](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/73)) ([54309a6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/54309a6a2992c7fbd33a03fd2ad92eace5fc142f)), closes [#70](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/70) [#67](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/67) [5-#8](https://github.com/5-/issues/8)

# [1.2.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.1.1...v1.2.0) (2026-03-30)


### Features

* adopt MCP Apps standard — Part 1 (WS1+WS2, runtime simplification, quality remediation) ([#70](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/70)) ([4762400](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/4762400186e1b8e865aa78008882e63921e4dcd8))

## [1.1.1](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.1.0...v1.1.1) (2026-03-11)


### Bug Fixes

* harden blue-green re-indexing infrastructure for Elasticsearch ([#67](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/67)) ([7ca5089](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7ca50899cc1353b156b349f02df6402778d565ea))

# [1.1.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.0.1...v1.1.0) (2026-03-06)


### Features

* asset download proxy, canonical URL fixes, and Vitest 4 cleanup ([#60](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/60)) ([978ae86](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/978ae86b88ba2de8fac512b039b8c8536799c0f4))

## [1.0.1](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.0.0...v1.0.1) (2026-03-05)


### Bug Fixes

* resolve 22 Dependabot alerts, 47 CodeQL dismissals, and 29 outdated deps ([#58](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/58)) ([23dd6b5](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/23dd6b5a39b5bc54a4a93c79f112451943dda7b7))

# 1.0.0 (2026-03-03)


### Bug Fixes

* correct package version and improve semantic-release config ([7ad6956](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7ad69567599eae99ae0bbd127f0571db561c902b))
* enable running mcp server from source code ([0af85f9](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0af85f99b9969801992cbcd4678fa46eff9cdb40))
* exclude .mjs scripts from ESLint TypeScript rules ([a5fbc32](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a5fbc321db862cff8941170718977371c35f6a6e))
* handle .mjs config files in ESLint configuration ([cab997b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cab997b3fc6dbb6e8ce9a0a00fa7202fc5876a47))
* **http-mcp:** allow data: scheme in connect-src CSP ([#47](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/47)) ([0d522a7](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0d522a7e011b921ece01e26e1b4a9c4ec5f038bb))
* **http-mcp:** await local AS setup before auth middleware ([e998791](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/e998791e7cad38db5bdf766188cee41ea6d2328b))
* move the Vercel config file to the relevant directory ([46daea7](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/46daea7bb37b098a5420ade5f47b7637f91d5c06))
* pass env through turbo ([c4f29d6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c4f29d6fe73a8a369b65f09c7483d7bb68617723))
* pass env through turbo more ([3f39c09](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/3f39c09debbb03d779f304188e94af65cb3c3f53))
* reduce function complexity to meet linting standards ([7d9e201](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7d9e201f9b752c397fc8f7be74ed3ca4870a607a))
* release ([3bba811](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/3bba8119effe01843ea524bbfcdd8e7ad5b723cd))
* release more ([29e3e77](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/29e3e773fdec6235ec339d6047a00810a7da5de8))
* remove unecessary strict env check ([803a964](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/803a96404070490f70e39aa786d183a83794f0f5))
* resolve all TypeScript lint errors and improve type safety ([c8d9595](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c8d9595b44035d2d1a9c2ae3d866db3d7b0e70b4))
* vercel.json syntax ([a2fd284](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a2fd284d7a47097373b6e0b04ec0e2cb9e7c451f))
* **vercel:** add routing to Node fn and root health endpoint ([f4bacfd](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/f4bacfd5ee020cb00e0bebb6da325eaed4cdeae3))


### Code Refactoring

* centralize environment validation with type-safe boundary ([d78dab4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/d78dab49c50c86b975957deb84d1eb776b1f4b1c))
* remove custom Notion type duplicates and fix complexity issues ([58cb186](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/58cb186aed2660755a30d5d7cef05d95e2478210))


### Features

* add commit-msg guard to prevent major version bumps ([cd3d879](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cd3d8791e2031ace5caa80ea953e53c6a90a4ea6))
* add early startup logging to improve MCP server debuggability ([3a22a38](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/3a22a3820a6b624826b99a52ee76bad44ae9c400))
* add file logging to Consola configuration and fix deprecated code ([df094c3](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/df094c34cc0d3e55011c5fb41a08f13a0a290015))
* add version guard script to prevent accidental major version bumps ([c7bb1d7](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c7bb1d737fa78f85d57e6be91499ea0a3fafe73c))
* complete biological architecture with integrated life functions ([581ab46](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/581ab461422ce183071f6cc3bc71433567a69286))
* complete logging flattening with domain-driven splitting ([1511ae5](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/1511ae59bdc8c81c4f689e766d0d1925149195bc))
* complete phase 1 development environment setup ([ec3c46b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ec3c46bc479c164c6726ec5aa400c84ecf0162fb))
* complete Phase 3 Sub-Phase 7 - enforce architecture through clean linting ([cbb6d10](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cbb6d1035fe23d2608666ee1d6737f056d9dd6e0))
* **http-mcp:** health handlers for GET/HEAD/OPTIONS on /mcp ([13143f2](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/13143f2bfca94fa01656eb29b2ece8fc8be68778))
* implement complete biological architecture with mathematical foundation ([d428f50](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/d428f50f9334f8e81bd7d9d7046c3eda7b7ffe25)), closes [hi#level](https://github.com/hi/issues/level)
* implement comprehensive logging framework for Phase 3 ([cfcf172](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cfcf1729230c14e46855e7f6d19ff53e5a90aff0))
* implement data scrubbing for PII protection ([e89c3a8](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/e89c3a8430150599ba44c4c547214175bdbc4bea))
* implement E2E tests and improve development documentation ([7d6ee3d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7d6ee3dd57887ae4cb385f3605d221ca16129427))
* implement environment configuration module with TDD ([97f50d6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/97f50d6356d394174ed4a03ed8d737cf37d00b29))
* implement minimal working MCP server with Notion integration ([aacd99b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/aacd99b468d3b973e03e53912a16ca3ea5d2a59a))
* implement Moria/Histoi/Psycha architecture evolution (Phase 5) ([#12](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/12)) ([b91edfe](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/b91edfebf745a11f8b33b90003c7f5ede3fd64be)), closes [hi#level](https://github.com/hi/issues/level) [Hi#level](https://github.com/Hi/issues/level) [Hi#level](https://github.com/Hi/issues/level) [hi#level](https://github.com/hi/issues/level)
* implement Phase 2 MCP server with type-safe resource and tool handlers ([26957bf](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/26957bfeba79230a45d43bc6872c0870bd1ec86f))
* integrate test-helpers as chora/eidola (phantoms/simulacra) ([5581aa7](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/5581aa783843f428f7b6377c3da226a76c12c8a1))
* **mcp:** enhance tool metadata with examples and git-commit-style descriptions ([#35](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/35)) ([dcfad3a](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/dcfad3aec75dd6bc6076470963b74c4310e3fb6d))
* milestone restructuring, release workflow, and invite-only alpha ([#54](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/54)) ([12bf526](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/12bf526fa6be7ec571708c73fcba6f05ef6e0a51))
* **organs:** implement dependency injection to eliminate cross-organ imports ([cb49266](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cb492666b26aba6dc6da535800744e6c62cf7f2a))
* Phase 4 Sub-phase 1 - Monorepo architecture with genotype/phenotype separation ([#11](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/11)) ([179c600](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/179c600a3fca8d62d00bb7f987201d80570a8388)), closes [hi#level](https://github.com/hi/issues/level)
* prepare for npm package usage ([d75152c](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/d75152cb5487f63c1de67cfbc1656ace7e782285))
* **sdk:** add context grounding hints for AI agents ([#40](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/40)) ([9b086b4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/9b086b4ad9b823a6dcff330b10dc5f2cedcc2eb3)), closes [#tool-results](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/tool-results)
* **sdk:** normalise mcp args via synonym map ([#26](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/26)) ([fcbcb4e](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/fcbcb4ea76efa829d6c576c2815f1234d71ec1bc))
* **substrate:** complete Infrastructure Phase - establish systems layer ([473ff44](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/473ff4433cf21447df4621c9b235447b556f2ab5))
* **substrate:** establish system physics foundation ([088e79b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/088e79b0093341fd704984ada4d86cca12052d92))
* support dynamic host filtering ([792e663](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/792e66379901476c0cfb5110d72648f4183b0623))
* transform Phase 3 plan with metacognitive analysis and semantic phases ([414f756](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/414f756ed396ce2057599efc09bb07518b81d08d)), closes [hi#level](https://github.com/hi/issues/level)
* **widget:** refactor SVG knowledge graph to component-based archite… ([#45](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/45)) ([fd14a44](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/fd14a44f1c58d5cc00c630de91ce0fd67be63bd3))
* **wishlist:** add comprehensive OpenAPI best practices and type standardisation ([#32](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/32)) ([470a4f6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/470a4f64f6367f24b51c196cb904c9594c8d006b))


### BREAKING CHANGES

* Major architectural restructuring to implement complete biological model

This commit represents a fundamental evolution of our architecture based on complex systems
theory and mathematical validation. The changes establish a complete biological model that
distinguishes between substrate (foundation), systems (pervasive infrastructure), and organs
(discrete business logic).

## Key Changes

### Architectural Evolution
- Implemented complete 8-level biological architecture
- Distinguished between pervasive systems and discrete organs
- Added substrate layer for types, contracts, and event schemas
- Created ADR-018 documenting the complete biological architecture

### Mathematical Foundation
- Integrated complex systems research (Meena 2023, Scheffer 2009, Beggs 2003)
- Validated architecture operates at criticality for optimal performance
- Reframed 103 import warnings as early warning signals
- Added cross-disciplinary validation

### Documentation Restructuring
- Reorganized docs into specialized directories
- Enhanced all ADRs with mathematical foundation references
- Updated README with complete biological architecture explanation
- Created comprehensive tissue and organ interface documentation

### Experience Records
- Documented key insights from the architectural evolution journey
- Recorded transformation from biological metaphor to mathematical implementation
- Captured the revelation about implementing universal principles

### Plan Updates
* Functions now use SDK types directly instead of custom type aliases
* Environment validation now happens on module load.
Invalid environment variables will cause immediate failure with
descriptive error messages.

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>
* None - all changes maintain existing API contracts

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>

# Changelog

All notable changes to this project will be documented in this file.
This changelog is managed by [semantic-release](https://github.com/semantic-release/semantic-release).
