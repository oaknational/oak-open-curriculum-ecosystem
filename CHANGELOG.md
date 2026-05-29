# [1.15.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.14.2...v1.15.0) (2026-05-29)


### Bug Fixes

* **agent-tools:** harden external-data validator to a file-wide no-logic invariant ([e76b9b7](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/e76b9b7c24c234099070deff570de2850701bafe))
* **agent-tools:** keep internal external-data symbols unexported (knip) ([fc14463](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/fc14463d32d697d412585b14804ae087c26049f4))
* **agent-tools:** prevent buffer split lifecycle escape ([a4c4c04](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a4c4c0479f13f919b3e8dfe7b2070c4d79899650))
* **agent-tools:** resolve S4624 nested template literal in external-data formatter ([90714ea](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/90714ea5a037aa9921514c64eeccf675a239a5b0)), closes [#122](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/122)
* **collab:** reword retired-vocab line; refresh gate-debt handoff ([66f5987](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/66f59872f176cdce2f2e8b9d53d2a3f39bdcfd8e))
* Commit 1 - Fully fix AZ5rZYZQCv0_1Y1L8PEv, AZ5rZYZQCv0_1Y1L8PEw, AZ5rZYZQCv0_1Y1L8PEx, AZ5rZYZQCv0_1Y1L8PEy, AZ5rZYZQCv0_1Y1L8PEz, AZ5rZYZQCv0_1Y1L8PE0, AZ5rZYZQCv0_1Y1L8PE1, AZ5rZYZQCv0_1Y1L8PE2 ([ccd8b2b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ccd8b2bd2b164c0bfa50e0c705e5f6a0d6cb1031))
* Commit 2 - Fully fix AZ5rZYY6Cv0_1Y1L8PEt, AZ5rZYY6Cv0_1Y1L8PEu ([68c9a96](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/68c9a9610fe07a33b034efde61d7035a0dda33ad))
* Commit 3 - Fully fix AZ5rZYYkCv0_1Y1L8PEs ([05e3cd7](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/05e3cd7fc995617344438cf45e5b2f902f7e9711))
* Commit 4 - Fully fix AZ5rZYXfCv0_1Y1L8PEr ([0fc762c](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0fc762ced3953ed088a62669f8d2ced840f3e094))
* Commit 5 - Fully fix AZ5tQ3DneB431-anZeC6 ([625ffd5](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/625ffd5b1b341be7f6a65d70fd2fd10b3261c75c))
* **graph-corpus-sdk:** harden eef substrate freshness gate and schema fidelity ([6823848](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6823848d7f3abfa10b0c84568861d8ece4b6fc4e))
* **mcp:** co-gate the EEF landing-page listing behind the feature flag ([28bb7ac](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/28bb7ace4ce9abe0a59762be59bb3f482604851e))


### Features

* **agent-tools:** enforce the external-data file convention with a repo-validator ([0d45cf0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0d45cf07f9c73117a003c40815dfb6d48f38cea2))
* **agent-tools:** expand Claude statusline rendering ([0911a0d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0911a0db215739c4c170bd0918005bcf09bc92f5))
* **curriculum-sdk:** add eef-explore-evidence-for-context evidence tool ([8a44fd4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/8a44fd445a94eb537bf5632c710f2c0daf273418))
* **cursor:** delegate statusline shim to Claude pipeline ([59d5026](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/59d5026533ecc5ede3901338758d2d743c099a53))
* **eef:** deliver contextual, budget-bounded EEF explore tool ([2214f0b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/2214f0b2b4fcd903672dd78f6f4cf06030d717a0))
* **eef:** model school-context vocabulary and add seed selection ([9f6eb21](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/9f6eb21528201ca7ec16407e12f43945156eb0c6))
* **graph-corpus-sdk:** add eef strands graphview adapter with live subgraph and manifest ([aa7cb96](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/aa7cb964985f41c545237fb82fa556985f7dfee3))
* **graph-corpus-sdk:** load and validate the real EEF corpus with freshness gating ([afdaa99](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/afdaa9909315040bba0287e6bb906524644169ef))
* **mcp:** co-gate EEF tool and prompt behind OAK_CURRICULUM_MCP_EEF_ENABLED ([9554ffb](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/9554ffbcbb88305f9ec29a1bbea95a7dfd26131f))

## [1.14.2](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.14.1...v1.14.2) (2026-05-27)


### Bug Fixes

* Address 5 SonarQube issues ([02f4eb2](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/02f4eb24ac9af3756d0099a7153512dafa7ba6b7))
* Address 5 SonarQube issues ([98a3147](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/98a3147fd63720f89ac17b44be3df43d5a4f12a0))

## [1.14.1](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.14.0...v1.14.1) (2026-05-27)


### Bug Fixes

* **agent-tools:** absorb reviewer findings on comms-event schema and identity converter ([cdff0fe](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cdff0fefdacd9711ad92edc2cc3a740905916afa))
* **agent-tools:** reject empty identity strings in agent-id schema ([9226606](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/922660611f44e78f650fa64d67e4a04b52a39acc))
* **agent-tools:** state-schemas accepts optional UUID v5 id on agent identity ([c0942d4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c0942d488652ea3906dbd22672922b73c0f554bb))

# [1.14.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.13.0...v1.14.0) (2026-05-26)


### Bug Fixes

* **agent-tools:** consume UuidV5 + CollaborationAgentIdWrite types in schema ([ae36440](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ae36440cb7c0cb5bb4ad053fa65c118eca8abcfd))
* **agent-tools:** resolve PR 118 sonar findings ([cd1810b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cd1810bc45376f5656e6d7f01adf1803f3e2dd98))
* **practice-fitness:** per-file detail uses inventoryGlyph for ready-zone consistency ([83c79fa](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/83c79fa6dd78a9c2308547f7ea302fb36394a57a))


### Features

* **agent-tools:** --to-id flag wired for comms direct (phase 0c cycle 9) ([dee89e0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/dee89e09c91d91e731ca1d6665b188878ea66d48))
* **agent-tools:** add UuidV5 brand + read/write schema split for agent identity (phase 0b cycle 1) ([c11f698](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c11f698b73e37f68453e16527afb950ab63ffb72))
* **agent-tools:** commit-queue createIntent requires UUID v5 id (phase 0b cycle 5) ([b977dba](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/b977dbabc56bd3259f8f129b0dacded6618c3ef2))
* **agent-tools:** derive UUID v5 id from session seed (phase 0b cycle 3) ([57084c1](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/57084c15e5acd842eeff01c3eef80afa44a365aa))
* **agent-tools:** heartbeat emitter typed-origin gate (A1 / PDR-078 §5) ([97f06e1](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/97f06e1618c387b9b3fedc71f3cb5387b9ee8c2b))
* **agent-tools:** json schemas accept optional UUID v5 id (phase 0b cycle 2) ([bed24b5](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/bed24b57b81a4522fe539e51fe43c108c0ef5314))
* **agent-tools:** legacy-fallback diagnostic emission (phase 0c cycle 10) ([6dad98b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6dad98b0f6d0589f09181c98994b4a3ee530cffa))
* **agent-tools:** parseAgentId via schema.parse (phase 0b cycle 4) ([2a501e9](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/2a501e9717b2cb8a8e884693adbc4b11c08b9d7c))
* **agent-tools:** routing prefers id (phase 0c cycles 6+7+8 bundled) ([30ef437](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/30ef437b79f98fdca36c53dca50d7517f10c9f2b))
* **agent-tools:** tighten createDirectedCommsMessage write entry (phase 0c cycle 11) ([597b094](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/597b094587a8f100299d755370099508f88ff142))
* collaboration enhancement refinement ([ed28e0d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ed28e0dfe6a2e3633e84663511b84f53394d94ee))
* **comms:** reject --body argv over 1500 chars on all comms verbs (B2) ([66e77d7](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/66e77d7360ef5a39c8c7718f68e5a2f3d7b9ad51))
* **hooks:** add menu-framing scoped_blocks for owner-decision phrasings ([ecc1e83](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ecc1e834a164871b831da387122eaec42580c8a4))
* **plans:** add MCP analytics exploration and Path-to-GA Programme ([09eda6f](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/09eda6f43282d5288d06ed31046723ce5deb73a6)), closes [hi#level-observability](https://github.com/hi/issues/level-observability)
* **rules:** add ping-before-escalate retirement-broadcast discipline ([29ebda4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/29ebda41b8b93104568958aab1574e4e003d6307))

# [1.13.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.12.0...v1.13.0) (2026-05-25)


### Features

* **plan:** author human-composer-tui (mini-Slack write surface) ([97a470d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/97a470dd8373bbc3d90bc59ee081c4bdcdf45d7d))

# [1.12.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.11.0...v1.12.0) (2026-05-25)


### Bug Fixes

* **adr:** repair prettier-mangled inline-code span in ADR-186 §Render rule (cycle 7.1) ([75a2cd2](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/75a2cd250f6f4f986f2908d9ae4da512736b448e))
* migrate pnpm config to v11 ([5de276b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/5de276b74fbcd71e7914894a70c7403b86bd5f9b))
* **plan:** cure 7 markdownlint errors in post-m1-attestation-tidy-up.plan.md ([26f8e7c](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/26f8e7cbcf530dd8b102c01880fc96dce272f239))
* **practice-substrate:** use String.raw for 2 regex patterns (PR114 Sonar S7780) ([9f746c2](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/9f746c2a33cd810ed36ef8d8aa702408688b9353)), closes [#114](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/114) [#114](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/114)
* security updates ([b40eeb0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/b40eeb042bcb31c5f4ebee952d51849e6f6daf81))


### Features

* **adr:** land ADR-186 (comms-event-heartbeat-lifecycle-substrate) (tidy cycle 7) ([48c8ac2](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/48c8ac225d26bd43603c3e1ea880c21ae794f8ae))
* **adr:** land ADR-187 (Claude self-modification authz cure-shape, WS-8) (tidy cycle 8a) ([7f7ad86](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7f7ad862bb5f37cd87970def0c61810bed164a00))
* **agent-tools:** comms-watch auto-seed + --seed-from-now/--no-auto-seed flags (tidy cycle 9) ([75e4792](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/75e479239a04338eba7840de31ff680143709f74))
* **oak-curriculum-mcp:** add agent preview smoke and remote probe scripts ([dcf92bb](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/dcf92bb5bdb3d261db1d95b438f028aafcf4cd90))
* **pdr:** land PDR-077 Commit Marshal cycle-discipline + 063/064 §Related (tidy cycle 5) ([7c2f85f](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7c2f85f431b4e294e1e1536ddce19ae364292a33))
* **pdr:** land PDR-078 (Liveness-Heartbeat Contract, portable, Candidate) (tidy cycle 6) ([9725ae0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/9725ae0940a642c72619e016578fbb5a652b7ddb))
* **pdr:** land PDR-079 portability distinction + rule + hook update (tidy cycle 5a) ([e8bc678](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/e8bc6781bc60d18acb2771a19bc271a678958a17))
* **plan:** land role-emission citation-binding (post-reviewer-absorption, no-impl) ([626e43d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/626e43d84dac89e96cbe4a80753d1f05081a31f5))
* **practice:** wire open-questions memory system ([ee241b4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ee241b4b9bc7758bebc8e6b71b74d73c40884bd5))
* **skill:** collapse §0.5 to PDR-078 pointer + PDR-027/063/064 §Related (tidy cycle 8) ([9e57290](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/9e57290d0c7cfcfb52e6bcd8b6aaeaa9150ffc68)), closes [#21](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/21) [#20](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/20) [#20](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/20)

# [1.11.0](https://github.com/oaknational/oak-open-curriculum-ecosystem/compare/v1.10.0...v1.11.0) (2026-05-24)


### Bug Fixes

* **agent-tools:** guard active-claims fingerprint recursion ([70e746a](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/70e746a3be48b2941e6788625ffafcb6ed2117aa))
* **agent-tools:** harden comms render and inbox polling ([0be469a](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0be469a96392e06b6fce729c8884755b074d1d91))
* **agent-tools:** remove unused active-agent exports ([730766a](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/730766adfb90488a8180be585bf0aa99542549c5))
* **agent-tools:** seal parseFrontmatter return + drop dead legacy fallback ([17176e2](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/17176e292016a20291188d3e7a06a2e562e95dc7))
* **agent-tools:** use Array.at for path segment ([604f64b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/604f64b7e26c9c35db8afa9dcbeb7479f9c7a8ae))
* **agent-tools:** use Object.hasOwn for cli option checks ([73ab162](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/73ab1624413232629b9a8eced5c9decb7ac9c0bc))
* **agent-tools:** use RegExp.exec for frontmatter extraction ([ca28bd8](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ca28bd83880760b43d46acd6e16566bcd141773e))
* **format:** prettier-normalize two graph-ingest source-path and turtle files ([644c937](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/644c937b46a39878f041232ff6b99aa89b59a0d9))
* **oak-eslint:** correct boundary error message for design-tokens-core multi-restrict ([6ad17c1](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6ad17c1481709539c65cbdff30cde15afa4b9642))
* **rules-adapters:** add .agents/rules wrapper for loop-exit-criteria-required ([92c953e](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/92c953e7b922d4a1941c3bfc4e2f2ee16fc6da73))
* **rules:** activate loop-exit-criteria-required + sha-prefix rules (Class B unified) ([cc3039e](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cc3039ebe7003ea18d5c9fdd8b56f4c5dd1c3c7c))
* **sdk-codegen:** apply useful Sonar remediation hunks ([c697d18](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c697d18b86e482f50b8ed8dadf2dba4281aba7f4))
* **sdks,libs:** land R2 mechanical Sonar cures S7735/S7763/S7781/S7750 ([927d459](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/927d459e7630c76ff878c07d509f47b025a28809))
* **skill:** add /rename timing rule to start-right-team First Moves ([52d50e3](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/52d50e3e1ab7c3949a9120ecaea809a5ca429228))
* **skill:** encode team-bootstrap infrastructure in start-right-team so openers stop duplicating it ([dc67d0f](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/dc67d0fb964faeba63535c3b59a3358cdbf7d968))
* **skill:** move /rename rule to shared start-right; route follow-ups to pending-graduations ([84638bc](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/84638bc98f7155d94042af699aa2a7bcc7ebda31))
* **skills:** re-add 6 adapter-only skills wiped by --clear ([4b931cc](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/4b931ccad2461902a4029ae6ba4ec32e3d0fb88d))
* **sonar:** clear PR-108 SonarCloud gate via violation refactors and cpd policy amendment ([51a02a9](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/51a02a9305fd008a026ceb654ded870ed9f0cd48)), closes [#108](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/108)
* **tooling:** preserve pre-commit broken-code guard ([72c5cde](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/72c5cde12bac0a9591d03f5db30b017fff9e6884))
* **tooling:** use local commitlint for message checks ([42f2e72](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/42f2e721b2c36bbab39dedfcc574a6a303365943))
* **tooling:** wire repo validators into pre-commit ([1cd0850](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/1cd0850f72c8dbbee66842619dc805eddef522f0))


### Features

* **agent-tools:** add --body-file to comms commands to cure shell-quoting hazards ([675bb83](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/675bb83b93e1761bd139cc9ccca785e2566d4fe7))
* **agent-tools:** add active-agent visibility ([1bb369a](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/1bb369a50d3090516832bf2d2a30b1674befde31))
* **agent-tools:** add codex-exec last-message and codex-helper skill ([6027e18](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6027e18231f593ec019958444192d3e1825a28f7))
* **agent-tools:** add collaboration tui with design primitives ([cdfb895](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/cdfb8959c7bed9ae0c712609536abd571c1e93f9))
* **agent-tools:** add comms watch ([0d3af91](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0d3af91481fe0de95219aa86db012632ffb0bfaa))
* **agent-tools:** add context-cost tokenization core ([7bf05c6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7bf05c6b436dc67868cdad2e6b61955c9cd69cb9))
* **agent-tools:** add directed comms authoring ([f88d0d6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/f88d0d67c27eeb071c58d8f1ca546cc40a96231d))
* **agent-tools:** add live refresh to collaboration TUI ([64617e3](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/64617e31d94c73c6b8d9224abd392288c514b453))
* **agent-tools:** add skills adapter generator ([41831d5](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/41831d5c15eeccfa8ce21ac7d820f77e6141c49f))
* **agent-tools:** add strict comms event parsing ([dd5b9e5](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/dd5b9e54f50075d9252d00c6185affbc157f79e3))
* **agent-tools:** comms --tag CLI flag with ADR-183 namespace validation ([24eb6c9](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/24eb6c910314256dab578458b2404675572a6c52))
* **agent-tools:** encode all-channels-matter principle in comms watch/inbox CLI ([a9d0b8c](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a9d0b8cfcf214c638e209b88a87ea8ec9a649d92)), closes [hi#urgency](https://github.com/hi/issues/urgency)
* **agent-tools:** enforce commit-queue stage guard ([c083a1a](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c083a1abaa051c308db8df69855e565d4bb8eeea))
* **agent-tools:** harden check profile artifacts for P0 ([fb90ebd](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/fb90ebd2454f367b2a8a7d35add80138fec73db1))
* **agent-tools:** harden context-cost cli ([92826c9](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/92826c917967604ac5773be44f687f380740d539))
* **agent-tools:** harden p8 tui interactions ([6e80448](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6e804485e727aa2f4fc331c6e91f0e4f11cd01d5))
* **agent-tools:** land FM-2 Monitor-harness liveness cure (heartbeat + step-runner + S7786) ([86f340b](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/86f340b59f178bbfb9bf045e0364f861bca957b5))
* **agent-tools:** land p8 tui foundation and dep refresh ([fb33261](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/fb332619091d3691eb0b786fe7a6ab0ed068a71f))
* **agent-tools:** land skills-lock loader with Ajv schema (WS1.1) ([a5d7fb1](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a5d7fb121a93b8845a546ff0a190621f67f1071d))
* **agent-tools:** land watcher-staleness consumer + CollaborationAgentId schema dedupe ([43e0928](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/43e092871d28595a2d8150cba7d275f6922009de)), closes [#10](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/10) [#1](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/1) [#3](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/3)
* **agent-tools:** repair p5 comms di boundary ([07ffee1](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/07ffee1db5c853cbe1574bc3bd3589ef9db2ced9))
* **agent-tools:** strengthen primary collaboration tooling ([05adba8](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/05adba8714dcb7fdfedefbf4d6aa3158b8d6e1e6))
* **agent-tools:** surface p8 operator value signals ([2791be3](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/2791be3cd1b61fdc48cd0a3ed6d76b198aa27b0a))
* **agent-tools:** unify collaboration comms format ([30c8ad1](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/30c8ad1578c26aae7e4909106c74318f29210ebe))
* **agent-tools:** unify hot collaboration CLI ([e010c07](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/e010c07bde9d6c2a3b0dc5ad0b9350946ca48194))
* **agent-tools:** wire skills-adapter --check drift gate ([a8351b3](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a8351b33ce4054369c348dedc1c6476c37b6c22e))
* **agent:** add team start and handoff routing ([bfa26e0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/bfa26e0175810d2f20321d23e9662b7e86c43fe7))
* **collaboration-state:** project canonical comms-event schema into three kinds ([b529fa6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/b529fa6e392de9b599a703b30097472b8ef6db5e))
* **collaboration:** author canonical comms-event schema with three $defs ([f756033](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/f7560339b21c8234647c503b7ec6671aae1916f3))
* **commit-queue:** add commit workflow primitive and revise commit SKILL ([97bf9e9](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/97bf9e972874d1c724f8e41996157de4154293f6))
* **commit-queue:** add list/show inspection filters ([e298723](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/e298723cff3c86b796f2f66bfa68b4a301b14fb8))
* **commit-queue:** land workflow-level system-state surface for intent-scope discipline ([896312d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/896312d068e9b068155a08996ebc06c498602134))
* **commit-queue:** scope record-staged to intent.files via getStagedBundleScoped (Cycle 1.1) ([fb0833a](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/fb0833a47671998aae0510cf1ddf8fb3f0d81a07))
* **commit-queue:** scope verify-staged to intent.files ([381d64f](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/381d64f9b3796d650a52be603c298e0dd18accd9))
* **commit-queue:** scope verify-staged to intent.files ([6b5c9b4](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6b5c9b4e2e6c59bc611a5e949fd8a6a1f089246d))
* **curriculum-sdk:** adopt upstream multi-unit lesson shape across SDK and consumers ([da2a4aa](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/da2a4aaca4b40803fb518f34801bdaa6132f774b)), closes [#2](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/2)
* **eef-evidence-corpus:** land t1 EvidenceCorpus type substrate + t16-partial public re-export ([7d8f0b0](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/7d8f0b0c45219edc0aa693e3f32f9e9d6660d6d3))
* **eef-evidence-corpus:** land t13a freshness check function + unit tests ([745fe91](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/745fe919d686a2658a7062eb2d4e2b7f246743c9)), closes [#3](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/3)
* **eef-evidence-corpus:** land t14 telemetry seam pattern (gate-1a partial) ([72cd93f](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/72cd93f0a12a3cd2797c5ebf8f914dc652678b71))
* **eef-evidence-corpus:** land t9 AGGREGATED_EEF_EVIDENCE_GUIDANCE ([acd2a3f](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/acd2a3f340e9211754e6c56c8056192793d02be4))
* **evidence-corpus:** land t12 citation shape primitives ([0b7289e](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0b7289e9fb46f32d9b0e6419161f11036485b6a3))
* **graph-core:** add DatasetCore + DataFactory (WS1.3) ([87e2112](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/87e21125f9d5bac9e3a109acd2f321d53b8d4af4))
* **graph-core:** add JSON-LD processor adapter ([95f42cb](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/95f42cb7dbb171c9e1843deaf82d331d88995a3b))
* **graph-core:** add RDF 1.2 Term hierarchy and Quad equality (WS1.2) ([1885fbc](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/1885fbcfa0ff458e71714652d91cec7dd20a9d79))
* **graph-core:** add RDFC-1.0 canonicalisation with sha256 hash and dataset round-trip ([ebd0e8d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ebd0e8dc98a75809c22070f61315406c264ba125))
* **graph-core:** add WS1.6 vocab registry with reverse-lookup ([3add41f](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/3add41f9d54ab20a264b28ec4b4328857445fc67))
* **graph-core:** land WS4.4 GraphView interface + T7a array-stop smoke-test ([1fc5b49](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/1fc5b491314cf0b46fa03511dd9b900368e5bf29))
* **graph-corpus-sdk:** scaffold @oaknational/graph-corpus-sdk workspace (WS4.1) ([3241893](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/3241893d41e19a7be65c02e28459974458bd80a6))
* **graph-corpus-sdk:** scaffold @oaknational/graph-corpus-sdk workspace (WS4.1) ([e1b9561](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/e1b9561e3a1152421fd1abdba0ca6134ff61e7a8))
* **graph-ingest:** land ws2-source-map-parser-integration with root-pointer placeholder ([6ac1f32](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6ac1f329ba0b1b9724cff56c2ebb948cc114b0c0))
* **graph-ingest:** land WS2.2 jsonld-compatible + turtle parsers + invariant-2 contract ([ce0abe2](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ce0abe2677420f240aa7c481094cf8809ad2061e)), closes [#2](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/2)
* **graph-ingest:** scaffold workspace (WS2.1) ([0f89507](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/0f8950703ea9ce8588ab039cd4390fae2f5d1f4c))
* **graph-ingest:** scaffold WS2.3 source-path primitives (JsonPointer + quadKey + SourceLocation) ([6cc7b33](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/6cc7b339650819abc6488c9e791ff00ffa1cd681))
* **graph-project:** add WS3.2 toPropertyGraph round-trip projection ([abe6fcb](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/abe6fcb3bdb7ca125f0cdca7d8e0b21d291eddb5)), closes [#6](https://github.com/oaknational/oak-open-curriculum-ecosystem/issues/6)
* **graph-project:** scaffold workspace with three reserved sub-path barrels ([84bfffa](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/84bfffa590ddbbabc1f0b3db947431c7b233e335))
* **graph:** accept ADR-173/179; promote graph-stack plan to active; refine WS1.1 scaffold ([5ec5004](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/5ec5004d198dffc341dcbe6e1bf781f181f4b758))
* **graph:** scaffold graph-core workspace per ADR-173/179 ([ad2abb6](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/ad2abb690805cc9908d62bc6ea1f198939256b59))
* **mcp-prompts:** land t10 eef-evidence-grounded-lesson-plan prompt ([a213655](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/a21365579364cdb316716b8d203758232bd21efb))
* **practice-fitness:** add token frontmatter zone classification ([72d31ca](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/72d31ca877a4725271784a273767df47e441ce5d))
* **practice-substrate:** land ADR-182 + ADR-183 Tranche 1 + PDR-064 SKILL amendments ([c4bacfc](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c4bacfc5182bb7a4b62fc103a7c1f7328db023d7))
* **skills:** add curator-pass skill and amend start-right-team role list ([c04c996](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/c04c996ea5a2be8520b7e1fc6979d4a4c7bbacb6))
* **skills:** canonicalise 6 adapter-only skills (Wave 2 Item 1) ([fae5731](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/fae57312854586aabaeee01df7d55de484ada495))
* **skills:** mirror 6 adapter-only skills into .claude/skills/ ([939900c](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/939900c7e05036d0b2fa85df5a7c52756438e968))
* **skills:** standardise all adapters to jc- prefix via generator ([708e296](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/708e296495e2f90bf2e070ac0157c0bbef91ad01))
* **start-right-team:** land WS1 opening, defer first-overlap response naming to next session ([92ae64d](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/92ae64d929e9d8503910a8d146d1fb18a2b4e5cd))
* **sub-agents:** extend experts with active-workflow guidance ([57de914](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/57de914f3f598adce62e7551184dc56b76c40fc4))
* **sub-agents:** finish elasticsearch expert adapters ([16c10ce](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/16c10ceac619c110ffa9c97d35e1664d39b16369))
* **sub-agents:** merge react component expert guidance ([31a2a9e](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/31a2a9e115314bf2e208f85b3f9cb59f1d77f5ec))
* **sub-agents:** merge sentry/clerk/mcp experts with active-workflow content (1B partial) ([52c139c](https://github.com/oaknational/oak-open-curriculum-ecosystem/commit/52c139c7f614dc4915e4f834f782ff6a2b3f9f82))

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
