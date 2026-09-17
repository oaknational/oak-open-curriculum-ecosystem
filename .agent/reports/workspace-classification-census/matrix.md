# Workspace classification census — matrix

**GENERATED FILE — do not hand-edit.** Rendered from `rows.json` by
`pnpm agent-tools:workspace-census -- render`; the same instrument's `check`
validates the row data (coverage, closed vocabularies, two distinct evidence
kinds per judged row) and recomputes this rendering for parity. Evidence
pointers live in `rows.json`; detector facts in `facts.json`. Governing record:
`.agent/plans/delivery/workspace-classification-census.plan.md`.

Subjects: 43 (36 classified — 12 generic-foundation, 9 mixed, 15 oak-leaf; 7 recorded exclusions; 0 needs-construct-evidence).

## Classification matrix

| Subject (dir) | Published name | Classification | Leakage (type, depth) | Target state | Tranche | Licence |
|---|---|---|---|---|---|---|
| `.` | — | **oak-leaf** | none found | Hold as the Oak estate's composition and identity root; keep the tri-licence declaration (MIT code, OGL curriculum data, reserved Oak brand) authoritative at this surface and keep root configs thin delegations to the workspace-config foundation. | none-assigned | code-mit + content-ogl + brand-reserved | 
| `agent-tools` | `@oaknational/agent-tools` | **mixed** | emitted-surfaces (runtime-emitted); defaults (runtime-emitted); names (runtime-emitted); domain-assumptions (runtime-emitted) | Split the portable agent-ops core (agent-identity, collaboration-state, commit-queue, context-cost, validators, workflow machinery) from the Oak-bound modules; put the OAK_* runtime env namespace and emitted schema ids behind a configurable prefix; keep oak-logo, mcp-content-current-source, and under-the-hood content generation in the Oak leaf. | 3 | code-mit + brand-reserved | 
| `apps/oak-curriculum-mcp-streamable-http` | `@oaknational/oak-curriculum-mcp-streamable-http` | **oak-leaf** | none found | Hold as the canonical Oak curriculum MCP server, a tranche 6 product leaf; push any genuinely generic MCP/OAuth plumbing down into foundation packages before reuse — never publish it from here. | 6 | code-mit + brand-reserved | 
| `apps/oak-search-cli` | `@oaknational/search-cli` | **oak-leaf** | none found | Hold as the Oak search operator CLI. The legacy '5 / 6' value names a split: reusable search primitives ride tranche 5 with the search stack (oak-search-sdk, search-contracts), while the CLI application shell belongs with the tranche 6 app leaves; tranche recorded as '5' per the census inheritance rule. | 5 | code-mit + content-ogl | 
| `demos/oak-curriculum-hub` | `@oaknational/oak-curriculum-hub` | **oak-leaf** | none found | Hold as the demos-tier Oak-branded curriculum hub reference app (Tailwind-mapped kit consumption path); keep reusable fidelity tooling flowing into @oaknational/fidelity-review rather than accreting app-local copies. Not in the 2026-04-28 matrix — tranche assignment is brief/owner work. | none-assigned | code-mit + content-ogl + brand-reserved | 
| `demos/oak-design-showcase` | `@oaknational/oak-design-showcase` | **oak-leaf** | none found | Hold as the plain-CSS consumption showcase for the Oak design system; keep counter-brand assets demo-local and consume the kit only through its published entries. Not in the 2026-04-28 matrix — tranche assignment is brief/owner work. | none-assigned | code-mit + brand-reserved | 
| `packages/core/build-metadata` | `@oaknational/build-metadata` | **mixed** | domain-assumptions (runtime-emitted); names (runtime-emitted); names (source-embedded-docs) | Keep resolver core generic; move Oak release-policy wording and thenational.academy example strings into consumer-injected message copy. | none-assigned | code-mit | 
| `packages/core/env` | `@oaknational/env` | **mixed** | emitted-surfaces (runtime-emitted); domain-assumptions (source-embedded-docs); names (docs-level) | Split the Oak-specific contracts (oak-api.ts, bulk-data.ts) from the generic env-contract composition core. | 1 | code-mit | 
| `packages/core/graph-core` | `@oaknational/graph-core` | **generic-foundation** | none found | Keep as the generic RDF/JSON-LD graph foundation. | none-assigned | code-mit | 
| `packages/core/oak-eslint` | `@oaknational/eslint-plugin-standards` | **mixed** | names (runtime-emitted); emitted-surfaces (runtime-emitted); domain-assumptions (runtime-emitted); names (docs-level) | Separate the generic rules and config presets from the Oak workspace-topology boundary data. | 3 | code-mit | 
| `packages/core/observability` | `@oaknational/observability` | **generic-foundation** | defaults (runtime-emitted); names (source-embedded-docs); names (docs-level) | Keep provider-neutral; rename the internal oak.local parsing base to a neutral host. | 1 | code-mit | 
| `packages/core/openapi-zod-client-adapter` | `@oaknational/openapi-zod-client-adapter` | **generic-foundation** | names (source-embedded-docs); names (docs-level) | Keep generic; retire when Castr replaces openapi-zod-client per ADR-108. | 4 | code-mit | 
| `packages/core/result` | `@oaknational/result` | **generic-foundation** | names (source-embedded-docs) | Keep as a clean generic Result<T,E> foundation. | 1 | code-mit | 
| `packages/core/safe-path` | `@oaknational/safe-path` | **generic-foundation** | names (docs-level) | Keep as a clean generic path-containment guard. | none-assigned | code-mit | 
| `packages/core/type-helpers` | `@oaknational/type-helpers` | **generic-foundation** | none found | Keep as a clean generic typed-iteration foundation. | 1 | code-mit | 
| `packages/core/workspace-config` | `@oaknational/workspace-config` | **generic-foundation** | names (source-embedded-docs) | Keep generic; neutralise the oaksearch TSDoc example. | none-assigned | code-mit | 
| `packages/design/design-tokens-core` | `@oaknational/design-tokens-core` | **mixed** | emitted-surfaces (runtime-emitted); names (source-embedded-docs) | Parameterise the CSS variable prefix so the DTCG core emits brand-neutral custom properties. | 2 | code-mit | 
| `packages/design/oak-design-assets` | `@oaknational/oak-design-assets` | **oak-leaf** | emitted-surfaces (runtime-emitted) | Keep as the single home for Oak raster brand artwork; white-label consumers replace it wholesale. | none-assigned | brand-reserved | 
| `packages/design/oak-design-ink` | `@oaknational/oak-design-ink` | **oak-leaf** | names (runtime-emitted) | Keep as the Oak terminal binding tier; adopt it in repo-owned Ink tools. | none-assigned | code-mit | 
| `packages/design/oak-design-react` | `@oaknational/oak-design-react` | **oak-leaf** | names (runtime-emitted) | Keep as the Oak design system's React-covariant tier; ship components only after the ADR-147 accessibility gate lands. | none-assigned | code-mit | 
| `packages/design/oak-design-system` | `@oaknational/oak-design-system` | **oak-leaf** | emitted-surfaces (runtime-emitted) | Remain the estate's single design source of truth (ADR-213); white-label consumers re-brand via brand.css and replace Oak marks. | none-assigned | code-mit + content-ogl + brand-reserved | 
| `packages/design/oak-design-tokens` | `@oaknational/oak-design-tokens` | **oak-leaf** | emitted-surfaces (runtime-emitted) | Keep as the Oak token source of truth; hold the generated CSS and terminal theme consistent with the design system via the consistency gate. | 2 | code-mit | 
| `packages/libs/env-resolution` | `@oaknational/env-resolution` | **generic-foundation** | names (source-embedded-docs) | Keep generic; move the Oak-named example schemas out of source TSDoc into consumer docs, after which the package is publishable as-is. | 1 | code-mit | 
| `packages/libs/fidelity-review` | `@oaknational/fidelity-review` | **mixed** | names (runtime-emitted); names (source-embedded-docs) | Parameterise the oak-app sentinel meta-name on ServerSentinel and re-seed test fixtures with neutral ids; the capture/diff/stats/report machinery is then fully generic. | none-assigned | code-mit | 
| `packages/libs/graph-ingest` | `@oaknational/graph-ingest` | **generic-foundation** | none found | Keep the substrate generic; hold the ADR-179 boundary that Oak corpus mapping lands in graph-corpus-sdk, never here. | none-assigned | code-mit | 
| `packages/libs/graph-project` | `@oaknational/graph-project` | **generic-foundation** | none found | Keep the projection/adjacency substrate generic per ADR-179; consumers inject their own datasets. | none-assigned | code-mit | 
| `packages/libs/logger` | `@oaknational/logger` | **mixed** | defaults (runtime-emitted); names (runtime-emitted); names (source-embedded-docs) | Evict the oak-curriculum-mcp default log path from DEFAULT_STDIO_SINK_CONFIG to the consuming MCP app; the UnifiedLogger/sink/redaction core is then a clean tranche-1 generic foundation. Diverges from the 2026-04-28 'generic' reading because the Oak-app default is shipped runtime state, not docs. | 1 | code-mit | 
| `packages/libs/posthog-node` | `@oaknational/posthog-node` | **oak-leaf** | none found | Own as Oak's privacy-preserving product-analytics boundary for the MCP runtime; the allowlist event policy IS Oak's analytics model, not a generic adapter. | none-assigned | code-mit | 
| `packages/libs/search-contracts` | `@oaknational/search-contracts` | **oak-leaf** | none found | Own as Oak search contract data. The 2026-04-28 'mixed' reading no longer holds: createFieldInventory() takes no parameters and every runtime export is Oak-bound, so there is no generic entry point to extract; if a second domain ever appears, the matrix pattern (not this package) is the reusable part. | 5 | code-mit | 
| `packages/libs/sentry-node` | `@oaknational/sentry-node` | **generic-foundation** | domain-assumptions (runtime-emitted); names (source-embedded-docs) | Keep generic; relocate the TestError* fingerprint families from KNOWN_ERROR_FAMILIES to the MCP app's post-redaction beforeSend hook, per the README's own rule that the library list is reserved for consumer-stable families. | 1 | code-mit | 
| `packages/sdks/graph-corpus-sdk` | `@oaknational/graph-corpus-sdk` | **mixed** | domain-assumptions (runtime-emitted); ownership-metadata (runtime-emitted) | Hold as the multi-corpus graph substrate; when separation executes, split the Oak curriculum subpath out and keep eef-strands as the vendor-neutral corpus foundation. | none-assigned | code-mit | 
| `packages/sdks/oak-curriculum-sdk` | `@oaknational/curriculum-sdk` | **oak-leaf** | none found | Keep as the published Oak-leaf typed client for the Oak Curriculum API; no genericisation intended. | 4 | code-mit | 
| `packages/sdks/oak-sdk-codegen` | `@oaknational/sdk-codegen` | **mixed** | emitted-surfaces (runtime-emitted); names (runtime-emitted); domain-assumptions (runtime-emitted) | Extract the generic OpenAPI-to-types/Zod/MCP generation machinery when tranche 4 executes; keep the Oak schema cache and generated Oak artefacts Oak-side. | 4 | code-mit + content-ogl | 
| `packages/sdks/oak-search-sdk` | `@oaknational/oak-search-sdk` | **oak-leaf** | none found | Keep as the Oak-leaf semantic-search SDK over Oak's index contracts and curriculum scopes. | 5 | code-mit | 
| `plugins/oak-open-curriculum` | — | **oak-leaf** | none found | Hold as the Oak agent-platform plugin leaf (subject derived by the owner-approved manifest arm ii-b, 2026-08-14); keep skill content grounded in the live Oak API per the plugin description, never embedded curriculum snapshots. | none-assigned | code-mit + content-ogl + brand-reserved | 
| `runtime-only-scripts` | — | **generic-foundation** | names (docs-level) | Keep as the ADR-168 pre-install exception home; every script stays dependency-free Node-builtin ESM (.mjs) with a typed .d.mts sibling, and anything without the pre-install constraint moves to a TypeScript workspace. | none-assigned | code-mit | 

## Thinnest-Oak-slice dispositions (mixed rows only)

- `agent-tools` — Move: the generic agent-ops core — src/core, src/collaboration-state, src/commit-queue, src/bin CLI dispatch, src/context-cost, branch-touched-files, and the validator/workflow machinery — as a portable foundation once the OAK_* env keys and oak.* schema ids are re-namespaced. Stay: src/claude/oak-logo.ts (Oak acorn brand mark), src/mcp-content-current-source (bound to @oaknational/oak-curriculum-mcp-streamable-http), src/under-the-hood-content-generate, and the --prefix=oak- skills-adapter default. Split: package.json scripts that turbo-filter on Oak workspaces separate from the generic script surface.
- `packages/core/build-metadata` — Stays: the pure resolver core (semver.ts, git-sha.ts, release-branch-url.ts parsing, release derivation) — generic Vercel/semver machinery. Moves/splits: Oak release-policy assertions and Oak deploy-domain examples baked into runtime error messages (release-internals.ts:137, release-branch-url.ts:70) become consumer-supplied policy/copy.
- `packages/core/env` — Stays: the opt-in Zod contract-composition pattern and generic contracts (logging.ts, elasticsearch.ts, sentry.ts, observability*.ts, build-env.ts). Moves/splits: OakApiKeyEnvSchema/OAK_API_KEY (schemas/oak-api.ts) and the oak-search-cli-shaped bulk-data.ts contract into an Oak-leaf contracts module.
- `packages/core/oak-eslint` — Stays: generic rule machinery and rules (no-throw-statement, no-dynamic-import, no-eslint-disable, max-files-per-dir, no-export-trivial-type-aliases, no-real-io-in-tests) plus base/react/next/strict config presets. Moves/splits: the hard-coded @oaknational/* workspace package lists, layer-boundary factories, and vendor fences keyed to Oak workspace names (src/rules/boundary.ts) into an Oak-leaf boundary-config layer.
- `packages/design/design-tokens-core` — Move the hard-coded `--oak-` prefix out of toCssVariable into a caller-supplied prefix owned by oak-design-tokens; the DTCG tier validation, contrast, colour-literal, overlay-coverage, and flattening machinery stays as the generic core; the Oak-convention prose in root-convention.ts moves with the prefix to the Oak consumer.
- `packages/libs/fidelity-review` — Move: the 'oak-app' meta-name literal in src/server-identity.ts (becomes a caller-supplied sentinel field) and the Oak-named test fixture ids (picker-oak-fold, oak-curriculum-hub/oak-design-showcase markers). Stay: image-diff, png-codec, visual-stats/correlation/calibration, static-path-guard, orchestrator, register, dev-server spawn/attach mechanics. No split needed — one parameterisation removes the runtime Oak contract.
- `packages/libs/logger` — Move: the '.logs/oak-curriculum-mcp.log' default path in DEFAULT_STDIO_SINK_CONFIG (src/sink-config.ts:100-106) to the MCP app's composition root as a caller-supplied default. Stay: UnifiedLogger, LogEvent/LogSink contracts, error normalisation, express middleware, sink-config parsing. Judgement call: the Symbol('oak.logger.normalized-error') marker mirrors package identity and may stay with the package name.
- `packages/sdks/graph-corpus-sdk` — Move: src/curriculum (Oak curriculum corpus bridge plus the prior-knowledge/misconception/thread-progression/keyword views over Oak curriculum shapes) goes with the Oak estate. Stay: src/eef-strands (vendor-neutral EEF Toolkit corpus foundation — third-party EEF content whose provenance/licence is pending per meta.licence.attribution_note, outside the Oak licence model) and the root barrel re-exporting generic GraphView/Result types.
- `packages/sdks/oak-sdk-codegen` — Split: the generation machinery (code-generation/ typegen/codegen pipelines, response-map subsystem, bulk/vocab-gen mechanics) could stand as a vendor-neutral generator over any OpenAPI spec. Stay Oak-side: schema-cache/ (Oak's cached OpenAPI spec), src/types/generated/ (Oak API types, Zod schemas, MCP tool descriptors), src/generated/vocab/ (Oak vocabulary and the curriculum graph corpus data), and the OAK_*_MAPPING / oak_* Elasticsearch mapping export surface.

## Recorded exclusions

| Subject (dir) | Recorded exclusion |
|---|---|
| `.agent` | Agent-practice estate records — the named exclusion class. .agent/ is the canonical Practice layer (rules, skills, memory, plans, reports, directives): 4513 tracked files with only 36 code files of hook/instrument glue, no manifest, no internal dependents. Its own charter declares 'Practice, not product' — nothing here is a workspace or published package, and with one deliberate charter-recorded carve-out none of it is product surface: the under-the-hood skill's content is served as public orientation via the MCP app, but the serving code surface lives in apps/, so the exception adds no foundational code surface under .agent/. The Oak-specificity axis, which prices foundational code surfaces for separation, tranche ownership, and licence mapping, does not apply. The high mechanical Oak-marker counts (32636 doc hits) are the Practice writing about Oak, not Oak identity leaking into a foundational surface. |
| `.agents` | Third-party vendor-managed skills tier (`pnpm skills`-managed, lock-pinned, vendored — the code files are upstream-owned scripts and templates) plus platform mirror surfaces; not an estate code workspace. Owner clarification 2026-08-17: this tier, the Practice skills (.agent/skills), and the user-facing plugin skills (plugins/oak-open-curriculum) are three unrelated conceptual entities. |
| `.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth` | Template fixture inside the vendored third-party Clerk skill: .agents/skills/clerk-nextjs-patterns/SKILL.md frontmatter records metadata.author: clerk (version 2.2.0), and this directory is the scaffolding the skill copies into consumer projects (package.json name 'clerk-nextjs', deps only next/react/@clerk/nextjs). It is not registered in the OCE pnpm workspace, has no internal dependents or dependencies, and carries zero Oak markers (facts.json oakMarkers all 0). The Oak-specificity axis judges Oak workspace code/product surfaces for extraction; it does not apply to vendored third-party template fixtures in the agent-skill estate. |
| `.claude` | Platform-config dot-dir — the named exclusion class. .claude/ is the Claude Code adapter layer of the ADR-125 three-layer model: rules/ files are one-line pointers back to .agent/rules/, agents/ are thin reviewer-role adapters, hooks/ delegate to the shared agent-tools implementation, settings.json is harness configuration. No manifest, no internal dependents, nothing consumable or publishable — the Oak-specificity axis classifies product/foundation code surfaces for separation and has no purchase on per-platform activation config. |
| `.codex` | Platform-config dot-dir — the named exclusion class. .codex/ is the Codex CLI activation layer: config.toml (trusted-project policy, hooks, agents, MCP), thin per-role adapter TOMLs in agents/, and one SessionStart hook adapter that delegates to agent-tools. Its README states canonical Practice content 'remain[s] under .agent/; .codex/ translates only the parts Codex needs to activate them'. Not a workspace, no manifest, no internal dependents, no consumable code surface — the Oak-specificity axis does not apply to platform activation config. |
| `.cursor` | Platform-config dot-dir — the named exclusion class. .cursor/ is the Cursor adapter layer: rules/*.mdc are frontmatter-wrapped one-line pointers back to canonical .agent/rules content (every .mdc body reads 'Read and follow `.agent/rules/<rule>.md`.'), plus mcp.json, hooks.json, settings.json, and statusline platform configuration. No manifest, no internal dependents, nothing published or consumed as code — the Oak-specificity axis classifies product/foundation code surfaces for separation and does not apply to per-platform activation config. |
| `.husky` | Platform-config dot-dir — git client-hook wiring (husky). Eight sh hook files that enforce the repo's own development process: pre-commit runs the repo's gates (pnpm agent-tools:repo-check prettier-staged, pnpm repo-validators:check, turbo build/type-check/lint/test, depcruise, knip:gate) and every commit-creating hook sources refuse-commit-on-main.sh, the wiring for the .agent/rules/never-commit-to-main.md Practice rule. No manifest, no internal dependents. facts.json oakMarkers are all zero, but that is scoped by the instrument's docs/code extension predicate — the extensionless hook files are outside the scan, and .husky/pre-push does reference the repo's own tooling by name ('pnpm --filter @oaknational/agent-tools ci-schema-drift-check', '--prefix=oak-'). Those are the repository invoking its own gates, not Oak identity leaking into a consumable surface: commit-time gate plumbing for this repository is not a code/product surface the Oak-specificity axis prices for separation, tranche, or licence. |

## Falsifier rows (needs-construct-evidence)

None — every judged row reached two distinct evidence kinds from the named instrument set; the recorded falsifier never fired.

## Delta against the 2026-04-28 matrix (superseded)

The 2026-04-28 matrix carried 20 rows. This census supersedes it; the delta is keyed on directory path over EVERY subject row (renames are declared on rows and read as renames, never as disappear-plus-appear).

**Classification changed (3):**
- `agent-tools`: generic-foundation → mixed
- `packages/libs/logger`: generic-foundation → mixed
- `packages/libs/search-contracts`: mixed → oak-leaf

**Appeared since 2026-04-28 (25):**
- `.`
- `.agent`
- `.agents`
- `.agents/skills/clerk-nextjs-patterns/templates/nextjs-basic-auth`
- `.claude`
- `.codex`
- `.cursor`
- `.husky`
- `demos/oak-curriculum-hub`
- `demos/oak-design-showcase`
- `packages/core/build-metadata`
- `packages/core/graph-core`
- `packages/core/safe-path`
- `packages/core/workspace-config`
- `packages/design/oak-design-assets`
- `packages/design/oak-design-ink`
- `packages/design/oak-design-react`
- `packages/design/oak-design-system`
- `packages/libs/fidelity-review`
- `packages/libs/graph-ingest`
- `packages/libs/graph-project`
- `packages/libs/posthog-node`
- `packages/sdks/graph-corpus-sdk`
- `plugins/oak-open-curriculum`
- `runtime-only-scripts`

**Disappeared since 2026-04-28 (2):**
- `packages/libs/sentry-mcp`
- `apps/oak-curriculum-mcp-stdio`

**Renamed (0):**
- (none)

**Declared renames with no matching baseline row (0) — validation problems:**
- (none)
