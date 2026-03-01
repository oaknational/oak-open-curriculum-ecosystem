# Napkin

## Session 2026-03-01f — Upstream error handling improvement

### Context loaded
- Full error path traced: generator (`emit-index.ts`) → generated `invoke` → `callTool` → `mapErrorToResult` → MCP response
- Key issue: `resolveDescriptorForStatus(400)` returns undefined for transcript/assets endpoints (only 200/404 documented), throws TypeError, discards response body, misclassifies as `McpParameterError`
- User wants to: (1) improve handling of unexpected error codes, (2) analyse error responses from upstream API

### Actual upstream 400 response body (from user)
```json
{
  "message": "Lesson not available: \"volcanoes-and-their-features\"",
  "data": {
    "cause": "Error: Lesson (volcanoes-and-their-features) not available, and subject (geography) and unit (mountains-and-volcanoes-what-where-and-why) are blocked for assets"
  },
  "code": "BAD_REQUEST"
}
```
- `message` — human-readable summary
- `data.cause` — detailed reason including subject/unit context
- `code` — tRPC error code string
- Pattern: "blocked for assets" in `data.cause` distinguishes content-gate from genuine bad request
- User direction: pattern match to distinguish, always log the message, accept it's brittle

### Live verification (HTTP dev server)
- Restarted dev server with `DANGEROUSLY_DISABLE_AUTH=true LOG_LEVEL=debug`
- **Test 1: Blocked transcript** (`get-lessons-transcript`, `volcanoes-and-their-features`)
  - MCP response: `"Content not available (400): Transcript not available: \"volcanoes-and-their-features\""`, `isError: true`
  - Server log: WARN, `classified: "CONTENT_NOT_AVAILABLE"`, structured attributes
- **Test 2: Nonexistent lesson** (`get-lessons-transcript`, `some-definitely-nonexistent-lesson-slug-xyz123`)
  - MCP response: `"Upstream API error (400): Transcript not available: ..."`
  - Server log: WARN, `classified: "UPSTREAM_API_ERROR"` — correctly distinguished from content-blocked
- **Test 3: Blocked assets** (`get-lessons-assets`, `volcanoes-and-their-features`)
  - MCP response: `"Content not available (400): Lesson not available: \"volcanoes-and-their-features\""`
  - Server log: `classified: "CONTENT_NOT_AVAILABLE"` — works across all tools, not just transcript
- **Test 4: Non-blocked endpoint for same lesson** (`get-lessons-quiz`, `volcanoes-and-their-features`)
  - Returned 200 with full quiz data — confirms blocking is per-endpoint/asset-type, not per-lesson

### Implementation complete
- Generated `UndocumentedResponseError` class in `contract/undocumented-response-error.ts`
- Barrel export missing: `src/mcp-tools.ts` didn't re-export the new class → `instanceof` was `undefined` at runtime. Must always add new public exports to the barrel file, not just the generated index.
- Complexity lint: initial `classifyUndocumentedResponse` hit complexity 9/8. Fixed by extracting `classifyUpstreamErrorCode` pure function.
- Three error codes: `UPSTREAM_SERVER_ERROR` (5xx), `CONTENT_NOT_AVAILABLE` (400 + "blocked" in cause), `UPSTREAM_API_ERROR` (all other undocumented).
- MISTAKE: Used `console.warn` initially — project forbids direct console calls, must use `@oaknational/logger`.
- MISTAKE: Then injected Logger into SDK's `executeToolCall` — WRONG. The app layer already has a logger instance. SDK functions should not own logging. The app layer is responsible for observability.
- CORRECT PATTERN: SDK returns classified errors in `ToolExecutionResult`. App layer (`validation-logger.ts` / `tool-handler-with-auth.ts`) inspects the result and logs using the existing logger. Same pattern as `logValidationFailureIfPresent`.
- Added `logUpstreamErrorIfPresent` alongside `logValidationFailureIfPresent` in the HTTP app's tool handler.
- Added `no-console: 'warn'` to `@oaknational/eslint-plugin-standards` recommended config. 231 pre-existing violations as warnings — separate cleanup task. Rule was not previously configured, which is why my `console.warn` slipped through lint.

## Session 2026-03-01e — 400 investigation and MCP resource pattern

### Investigation findings: transcript/assets 400

**Root cause identified** via GitHub source review of `oaknational/oak-openapi`:

- The 400 is a **third-party copyright licensing gate** in `queryGate.ts`
- Transcript and assets use `checkLessonAllowedAsset` — an **allowlist**:
  only `maths` is fully supported; other subjects need explicit entries in
  `supportedUnits.json` / `supportedLessons.json` (~500KB allowlist)
- Summary and quiz use `blockLessonForCopyrightText` / `isBlockedUnitOrSubject`
  — a **blocklist**: only `english` and `financial-education` are blocked
- The gate throws `TRPCError({ code: 'BAD_REQUEST' })` with a reason string
- Originally used HTTP 451 but tRPC doesn't support it, reverted to 400
- The `errorResponses: []` in OpenAPI metadata means 400 is undocumented
- Prisma warnings in Vercel logs are a separate unrelated issue (appear on 200s too)

**Error path traced through our SDK:**
1. Generated `invoke` receives HTTP 400 with reason body
2. `resolveDescriptorForStatus(400)` finds no descriptor (only 200/404 documented)
3. Throws `TypeError('Undocumented response status 400...')` — **response body never extracted**
4. `mapErrorToResult` catches TypeError, wraps as `McpParameterError` (wrong classification)
5. MCP client sees: generic "Undocumented response status 400..." — no upstream reason

### Key mistake this session
- Made Vercel API request without API key → got 401. The `web_fetch_vercel_url` tool
  handles Vercel Authentication but not the Oak API's own bearer token auth.

### Patterns
- GitHub API via `gh` is excellent for cross-repo investigation — read source code
  from private repos without cloning
- Vercel MCP logs truncate message bodies in table format — full bodies require
  the Vercel dashboard
- Tracing error paths through generated code requires reading the generator AND the
  generated output — the generator shows the pattern, the output shows the specifics
  (which statuses are documented for which tool)

## Session 2026-03-01d — Post-completion MCP tool assessment

### What was done

1. Live assessment of all 30 oak-local MCP tools via `CallMcpTool` — called
   every tool with representative parameters
2. Verified all WS1-WS6 changes reflected in running server
3. Identified two follow-up items: a 400 failure anomaly and a resource
   pattern opportunity for large datasets
4. Updated plan and prompt for next session handover

### Corrections from the user

- **Do not speculate about failure causes**: I attributed the 400 from
  "volcanoes-and-their-features" to "v0.6.0 content blocking" without
  evidence. The user asked: "v0.6 of what?" and correctly pointed out
  that content blocked for legal reasons should return 404, not 400.
  The right response is to investigate, not assume.
- **Know what each tool does**: I conflated `get-lessons-assets` (returns
  download URLs) with `get-asset-by-type` (triggers actual binary download,
  excluded from MCP). The user corrected this: "we disabled get-asset-by-type
  because we can't trigger a download from the remote mcp server,
  get-lesson-assets should return urls, not assets." Getting the tool
  semantics wrong undermines the assessment.
- **Prerequisite graph as resource**: The user identified that the 1.4MB
  prerequisite graph "could probably be an optional resource intended for
  agents and humans (indirectly, via agents)". This is a design insight:
  large, static, reference data that agents use to answer human questions
  is a prime candidate for MCP resource exposure with appropriate annotations.

### Patterns

- **Systematic tool assessment via MCP calls**: Batching 4 calls per round
  by category (discovery, browsing, fetching, progression) was efficient.
  30 tools assessed in ~6 rounds.
- **Resource pattern**: `curriculum://model` establishes the dual-exposure
  pattern (tool + annotated resource). The prerequisite graph and thread
  progressions are natural extensions of this pattern for large static data.
- **Suggest now works**: `search(text: "frac", scope: "suggest", subject: "maths")`
  returned 10 results. Previously noted as returning 0 in the napkin. The
  suggest index is populated.

## Session: 2026-03-01 — Guidance surface audit and pedagogical context plan update

### What was done

1. Comprehensive audit of all 16 "how to use this service" guidance
   surfaces across the MCP server and curriculum SDK
2. Updated `improve-pedagogical-context.plan.md` with audit findings,
   resolved open questions, and clarified WS1 promotion criteria
3. Resolved all 4 open questions:
   - Glossary source → curated list (not scraped)
   - Payload size → ~68KB acceptable (13% of 128K context)
   - Backwards compatibility → additive (keep get-help, get-ontology)
   - Tool vs resource → both (MCP spec control model)
4. Named the tool `get-curriculum-model` — "model" conveys structured
   knowledge and authority, not just ambient context

### Learnings

- The guidance surface inventory revealed 16 distinct surfaces across
  6 delivery channels. The phrase "call get-ontology first" appears
  in 13 places across 6 channels. This is acceptable redundancy
  (belt-and-braces for different client capabilities) not duplication.
  The key distinction: duplication is the same CONTENT served from
  multiple SOURCES. Redundancy is the same MESSAGE delivered through
  multiple CHANNELS that a client may or may not support.
- `AGENT_SUPPORT_TOOL_METADATA` is an excellent single source of truth
  pattern — it drives SERVER_INSTRUCTIONS and OAK_CONTEXT_HINT
  automatically. When `get-curriculum-model` is added, updating the
  metadata propagates to both downstream surfaces.
- The CTA prompt in `widget-cta/registry.ts` is already a workaround
  for the two-tool problem: it tells the model to call `get-help`,
  then "all agent support tools". `get-curriculum-model` eliminates
  this workaround pattern.
- **Naming**: "get-curriculum-model" is better than "get-started"
  because it describes what you GET (a structured knowledge model),
  not what you DO (start). "context" was the MCP spec's word but
  the user correctly noted this is structured knowledge, not just
  information. "model" signals authority and completeness.
- Plan structure insight: the "what's already well-placed" section
  is just as important as "what needs to change" — it prevents
  over-engineering by establishing what should NOT be touched.
- **MCP spec control models resolve the tool-vs-resource question**:
  The spec defines three primitives with distinct controllers —
  tools (model-controlled), resources (application-driven), prompts
  (user-controlled). The 2025-06-18 resource annotations add
  `priority: 1.0` ("effectively required") and
  `audience: ["assistant"]` ("for the model"). This is the spec's
  mechanism for essential orientation data. Answer: expose as both
  tool AND resource with annotations. The tool is the universal
  pragmatic path; the annotated resource is the spec-aligned ideal
  for clients that support auto-injection.

## Session: 2026-03-01 — M1-S009 completion, ISP refactor, and dead code removal

### What was done

1. Completed M1-S009 GREEN: dual-query suggest pipeline in SDK
   (`suggestions.ts` + `suggest-completion.ts` + `suggest-bool-prefix.ts`)
2. Completed M1-S009 REFACTOR: deleted dead CLI suggest code
   (`apps/oak-search-cli/src/lib/suggestions/` — 4 files, ~23KB)
3. Completed M1-S003: binary endpoint exclusion (from prior session)
4. Fixed lint: split `suggestions.ts` (397→128 lines) into three files
5. Fixed lint: eliminated all `unsafe-assignment` errors via ISP refactor
6. Full quality gates pass: sdk-codegen, build, type-check, lint,
   format, tests (all workspaces), e2e tests
7. Secrets scan clean

### Learnings

- **Interface Segregation eliminates `any` in test fakes**: `EsSearchFn`
  is generic (`<T>(body) => Promise<EsSearchResponse<T>>`). You can't
  create a typed fake for a generic function without a type assertion —
  the generic T means "for all T" but a fake returns a specific type.
  The fix: define `BoolPrefixSearchFn` (non-generic, concrete
  `TitleSourceDoc`) at the boundary. The generic `EsSearchFn` IS
  assignable to the specific type (instantiation), so production wiring
  works unchanged. Tests use the narrow type and get full type safety
  with zero assertions
- **Capturing calls in a typed array beats `vi.fn().mock.calls`**:
  `vi.fn()` without a type parameter leaks `any` from `.mock.calls`.
  Instead: `const calls: EsSearchRequest[] = []` inside the fake, push
  on each call, assert against `calls[0]?.query?.bool`. Fully typed,
  no spy needed for call inspection
- When deleting dead code, verify the FULL import chain: the CLI's
  `SuggestionItem` type was also defined in `openapi.schemas.ts` and
  `types/oak.ts` as separate types from the SDK. Only the local
  `suggestions/types.ts` versions were dead
- The test file (`index.unit.test.ts`) used `vi.mock('../es-client')`
  and `vi.mock('../logger')` — global mocks that violate the testing
  strategy. Deleting the dead code also eliminated the anti-pattern

## Session: 2026-02-28 — Post-validation quality fixes and consolidation

### What was done

1. M1-S004 complete: `normaliseParamName()` strips `Slug` suffix in flat
   MCP schemas. Canonical name preserved in SDK internals (`ToolPathParams`,
   nested Zod). Applied in `emit-input-schema.ts` and `emit-schema.ts`.
2. M1-S006 closed: tool description updated via `appendToolEnhancements()`
   for `get-rate-limit` (0/0/0 = unlimited)
3. Text-less thread search: `text` made optional for `threads` scope when
   `subject` or `keyStage` filter provided. Uses `match_all` + filter +
   sort by `unit_count desc` when no text (no RRF retriever)
4. User decisions applied: (a) M1-S009 registered — `bool_prefix` is
   the correct ES feature for mid-word matching, not a fallback. Fix at
   source: complete the SDK suggest pipeline, CLI consumes SDK;
   (b) M1-S003 revised — exclude binary endpoint from MCP tools entirely,
   `get-lessons-assets` provides download URLs
5. Cursor plans deleted, release plan updated, prompt updated as entry point

### Learnings

- **Framing error corrected**: I initially called `bool_prefix` a "fallback"
  and cancelled it under the "no fallbacks" rule. The user challenged this:
  `bool_prefix` on `search_as_you_type` fields IS the correct ES feature for
  mid-word matching. Completion is an optimisation for start-of-input. Using
  both is not a fallback pattern — it's a complete implementation. The "no
  fallbacks" rule means don't paper over failures; it doesn't mean don't use
  the right tool for the job
- **Fix at source**: when MCP exposes functionality and there's an issue,
  fix it in the SDK, not in the consumer. Search logic belongs in the SDK;
  CLI and MCP are consumers. Duplicating suggest logic in the CLI violates
  DRY — the CLI should consume the SDK's suggest pipeline
- When an MCP tool returns binary content that the protocol can't transport,
  the answer is exclusion (remove the tool) not compensation (try to hack
  a download). The metadata endpoint already exists and provides URLs
- Context budget awareness: the user correctly identified when context was
  full and redirected from implementation to consolidation. Plan and prompt
  updates are higher-value than another partial implementation that would
  need re-reading next session

## Session: 2026-02-28 — M1-S001a verification: all 32 MCP tools validated

### Key findings

1. `thread_semantic` confirmed populated: 164/164 via ES|QL count, spot-checked algebra, geometry-and-measure, bq14-physics (full slug: `bq14-physics-how-does-the-earth-fit-into-the-universe`, not abbreviated `bq14-physics` used in release plan)
2. Thread search fully functional via ELSER: `search(scope: threads, text: "algebra")` returns 25 results with Algebra #1 (score 0.049). "electricity" returns BQ13 electricity/magnetism thread #1. Previously returned 0.
3. `explore-topic` returns threads in unified response — tested algebra+maths, electricity+science, volcanos (cross-subject), the Romans+history. All return 5 lessons, 5 units, 5 threads.
4. All 32 oak-local MCP tools pass systematic validation including known snags (M1-S002 year normalisation, M1-S003 binary warning, M1-S005 suggest filter, M1-S006 rate-limit 0/0/0)

### Observations (not blocking)

- `search(scope: threads, text: "")` rejects empty text — documented in tool description ("text is required"). Workaround: use non-empty text like "threads" or the subject name.
- Nonexistent query ("xyznonexistent") returns 25 results with uniform low scores (~0.024) — this is RRF BM25 fallback. ELSER leg returns nothing but BM25 leg still returns. Expected search engine behaviour.
- `search(scope: suggest, text: "frac", subject: "maths")` returns 0 suggestions. May be a prefix-matching data issue in the suggest index. Not a regression — suggest was previously untested.
- `bq14-physics` as used in release plan is an abbreviated slug; the actual ES document ID is `bq14-physics-how-does-the-earth-fit-into-the-universe`. The release plan referenced the abbreviated form — a minor documentation inaccuracy, not a data gap.

### Patterns that worked

- Batching parallel MCP tool calls (4-6 at a time) made the 32-tool sweep efficient
- Phased approach (verify ES data first, then MCP layer) caught the abbreviated slug issue early without it being misdiagnosed as a data gap

## Session: 2026-02-28 — Knowledge flow and Practice evolution

### What was done (continued from consolidation session)

1. Refined frontmatter rule: all docs carry `fitness_ceiling` frontmatter
   EXCEPT shallow-browsing entry points (README.md, quick-start.md, VISION.md).
   "The geeks will love it" — deeper contributors appreciate metadata
2. Rewrote practice.md §The Knowledge Flow: merged the old "Learning Loop"
   and "Feedback Loops" sections into a single unified treatment. Added:
   - Full cycle diagram (Capture → Refine → Graduate → Enforce → Apply)
   - Three-audience model (session → agents → everyone)
   - Fitness functions at every stage
   - Feedback properties (negative + positive, compressed)
   - The transmission dimension (the flow is self-replicating via plasmid)
   - Artefact locations
3. Compressed Sustainability section in practice.md (35 lines → 12 lines)
4. Raised practice.md ceiling 200 → 250 (the knowledge flow is the heart)
5. Rewrote practice-lineage.md §The Learning Loop → §The Knowledge Flow:
   references practice.md for the full treatment, adds the two critical
   propagation properties (self-replicating, self-applicable)
6. Raised practice-lineage.md ceiling 300 → 320
7. Updated consolidation command step 8 with frontmatter rule
8. Updated Learned Principle and "Beyond the Trinity" section for
   frontmatter scope (exempt: README, quickstart, VISION)

### Learnings

- "The Learning Loop" was a good name for the capture-refine-enforce cycle
  but it missed the graduation step (permanent docs). "The Knowledge Flow"
  names the full cycle including graduation. The renaming wasn't cosmetic —
  it changed what the concept includes
- The three-audience model (session → agents → everyone) is genuinely the
  reason the stages exist, not just a property of them. Each stage exists
  because a new audience needs to find the knowledge. This insight reframes
  the entire learning loop from "how knowledge accumulates" to "how
  knowledge becomes discoverable"
- Merging Feedback Loops into Knowledge Flow was the right structural move.
  The feedback properties are characteristics of the flow, not a separate
  system. Separate sections created the false impression of two independent
  mechanisms
- The frontmatter exemption rule is elegant: only 3 files (README,
  quickstart, VISION) are exempt. These are the "shop window" — everything
  behind the window is for people who've already decided to come inside

## Session: 2026-02-28 — Knowledge consolidation and fitness functions

### What was done

1. Ran /jc-start-right + /jc-consolidate-docs + /perspective/metacognition
2. Analysed distilled.md (378 lines) and napkin (100 lines) for mature
   content suitable for permanent documentation
3. Extracted settled patterns to 7 permanent documentation targets:
   - `docs/governance/typescript-practice.md` — Zod v4, `as const satisfies`,
     interface segregation, spread widening, indexed access, compile-time
     validation, common type gotchas
   - `.agent/directives/testing-strategy.md` — refactoring TDD, test config
     gotchas, test data anchoring, test isolation patterns
   - `CONTRIBUTING.md` — workspace/turbo protocol, self-referencing imports,
     commitlint conventions
   - `apps/.../docs/widget-rendering.md` — 3 dev gotchas
   - `docs/operations/troubleshooting.md` — file move issues, TSDoc issues,
     rootDir ambiguity, second-level barrels
   - `docs/governance/development-practice.md` — error handling (void promise,
     HTTP semantics), validation after rewrites, git worktree, documentation
     practice
   - `.agent/memory/code-patterns/interface-segregation-for-test-fakes.md` —
     new code pattern
4. Pruned distilled.md from 378 to 145 lines (62% reduction, target <200)
5. Practice box: empty (checked)
6. Added `fitness_ceiling` and `split_strategy` frontmatter to 9 key documents:
   AGENT.md (200), rules.md (200), testing-strategy.md (400),
   schema-first-execution.md (100), typescript-practice.md (150),
   development-practice.md (150), troubleshooting.md (200),
   CONTRIBUTING.md (400), distilled.md (200)
7. Updated consolidation command (step 8) to check fitness functions
8. Added "Fitness functions at every stage" as a Learned Principle in
   practice-lineage.md
9. Extended practice-lineage.md §Fitness Functions with "Beyond the Trinity"

### Learnings

- The primary mechanism for reducing distilled.md is extraction to permanent
  docs, not compression or deletion. Every entry that has settled belongs
  somewhere discoverable by humans navigating the docs hierarchy, not just
  agents reading distilled.md at session start
- TypeScript Practice was the thinnest permanent doc (45 lines) despite being
  the area with the most accumulated learnings in distilled — the gap between
  accumulation rate and extraction rate was largest there
- Some entries don't have a natural permanent home: Elasticsearch operational
  gotchas are too specific for general docs but too important to delete. They
  stay in distilled until the search CLI grows a dedicated operational guide
- Agent-specific troubleshooting (StrReplace Unicode issues, reviewer false
  positives) is a distinct category — it's permanent knowledge but only for
  agents, not for the codebase docs. distilled.md is the right home for these
- The consolidation command's step ordering matters: extract THEN prune. Writing
  the pruned distilled.md required knowing exactly what was extracted where,
  which meant the permanent doc edits had to come first
- Fitness functions at every stage: the user spotted that the consolidation
  cycle moves unbounded growth from ephemeral to permanent without constraint.
  Every document in the knowledge flow needs a ceiling and a split strategy.
  The response to hitting a ceiling is splitting by responsibility, not
  compression — discoverability matters more than density
- practice-lineage.md is now 320/300 — the fitness function additions pushed it
  over its own ceiling. Meta-irony noted. Tightening pass needed next session

## Session: 2026-02-28 — Full reindex and parameter tuning

### What was done

1. Ran full bulk reindex: `pnpm es:ingest --verbose` from
   `bulk-downloads/`. 16,443 docs across 114 chunks, ~20.8 min
2. Analysed ELSER failure pattern: 26 initial failures (0.16%),
   all recovered in single retry round. Failures clustered in
   chunks 64-89 (ELSER queue saturation mid-run)
3. Increased `DEFAULT_CHUNK_DELAY_MS` from 7001ms to 8000ms for
   headroom as curriculum grows
4. Updated ADR-096 with Run 7 data and new default
5. Updated release plan (reindex done, verification outstanding)
   and onboarding prompt (shifted from "Reindex and Validate" to
   "Verify and Ship")

### Learnings

- When presenting cost comparisons, account for the FULL cost of
  both alternatives. I initially said "15 seconds vs 2 minutes"
  for retry cost vs delay increase — the user rightly pointed out
  that worst-case retry (multiple rounds with progressive backoff)
  is ~125s, making the comparison much closer (125s vs 114s). The
  conclusion held but the margin was misrepresented
- ELSER failure rate varies between runs even with identical
  parameters (0.10% on Run 6 vs 0.16% on Run 7). The dominant
  factor is cluster-side queue state, not client-side delay. This
  means optimisation beyond the current range is chasing noise
- ADR-096's optimisation history table is genuinely useful as a
  decision record — it let us compare today's run against
  historical baselines and make an informed parameter choice
- The user's reasoning for the 8000ms change was about headroom
  for future growth (more lessons, more subjects), not about
  eliminating today's failures. Good reminder: parameter decisions
  should account for where the system is going, not just where it
  is now

## Session: 2026-02-28 — Ingest CLI refactor and consolidation

### What was done

1. Committed outstanding M1-S008 work (callTool type alignment + generated files)
2. Refactored ingest CLI: renamed `es:ingest-live` to `es:ingest`, made bulk mode default, added `--api` flag, per-index filtering for both bulk and API paths
3. Updated all 12+ doc files referencing the old command name
4. Updated release plan and onboarding prompt as standalone handoff
5. Revised ADR-093 with CLI interface changes
6. Deleted cursor plan (content integrated into release plan)

### Learnings

- When refactoring CLI defaults (inverting a flag), the blast radius
  extends to: unit tests, E2E tests, doc files, smoke test comments,
  source code comments, README examples, ADRs. Subagent batching the
  doc updates was effective — 12 files updated in one pass
- Per-index filtering is a "skip early" pattern: check what's needed
  at the top of the pipeline and avoid creating work that will be
  discarded. Applied in two places: bulk-ingestion.ts (skip processing
  phases) and index-batch-generator.ts (skip generator phases)
- `VocabularyMiningStats` has 11 fields — when creating a zero-value
  fallback, a factory function (`emptyVocabularyStats()`) is cleaner
  than an inline object literal that will fail if the interface changes.
  Pattern: zero-value factories co-located with the type definition
- distilled.md: 383 lines (target <200). Still overweight from prior
  sessions. Needs dedicated pruning session.

## Session: 2026-02-28 — Lint fix: complexity refactoring

### What was done

1. Fixed 3 ESLint errors from previous session's ingest CLI refactor:
   - `ingest-live.ts` (252→241 lines): removed unnecessary shebang,
     inlined single-use `generateLogFilePath`
   - `bulk-ingestion.ts` (284→96 lines, fn 62→28 lines): extracted
     processing phases to `bulk-ingestion-phases.ts`, created
     `collectPhaseResults` orchestrator function
   - Also removed unnecessary shebang from `ingest-bulk.ts`
2. Encoded refactoring lint awareness for future agents:
   - Updated `rules.md` Refactoring section with explicit ESLint
     thresholds (250 max-lines, 50 max-lines-per-function)
   - Created `.cursor/rules/lint-after-edit.mdc` — auto-attaches on
     `.ts` files, reminds agents to check lint after edits

### Learnings

- The previous session's agent didn't run lint after substantive
  changes — the system prompt says to use `ReadLints` after edits,
  but it wasn't followed. A Cursor rule auto-attached to `.ts` files
  is more effective than a directive buried in a long rules.md because
  rules are injected into every prompt for matching files
- When splitting a file by responsibility, check that vitest module
  mocks still resolve correctly: `vi.mock('../../adapters/foo')` works
  transitively when the mock target is imported by an extracted file
  in the same directory (same relative path)
- Shebangs (`#!/usr/bin/env npx tsx`) on non-executable files waste a
  line and are misleading. Only the CLI entry point needs them
- For a refactoring TDD cycle that doesn't change public API, the
  existing tests ARE the safety net — run them before and after the
  split, no new tests needed for internal restructuring

## 2026-03-01: WS1 get-curriculum-model implementation

### Patterns that worked
- RED phase: import from non-existent modules, tests fail at import resolution
- Followed aggregated-help/ pattern exactly (definition.ts, execution.ts, index.ts)
- AGGREGATED_HANDLERS map in executor.ts is the single dispatch table — no type-guard updates needed since `isAggregatedToolName` derives from `AGGREGATED_TOOL_DEFS` keys
- agent-support-tool-metadata.ts drives surfaces 1-2 automatically via `generateServerInstructions()` and `generateContextHint()`

### Mistakes / corrections
- E2E resources/list test: used `parseJsonRpcResult` which types for tool results — resources responses need `parseSseEnvelope` + direct Zod parse of `envelope.result`
- `composeCurriculumModelData` needed explicit return type for ESLint `explicit-module-boundary-types` rule
- Updating prompt/tip text broke 6+ existing tests that checked for old tool names — need to search for ALL references to old tool names in test files during REFACTOR
- max-lines limit (250) is tight — adding a new metadata entry pushed agent-support-tool-metadata.ts over; trimmed TSDoc to fix
- `pnpm test` with turbo cache can serve stale results — use `--force` to confirm actual state
- Case sensitivity: test checked for lowercase "curriculum" but summary had uppercase "Curriculum" — use regex match instead of `.toContain()`
- **CRITICAL**: When updating string-checking tests, I was swapping one tool name string for another (`get-ontology` → `get-curriculum-model`). The user caught this: "tests should prove useful behaviour, not constrain implementation, and certainly not check for strings!" The fix is to assert the BEHAVIOUR (e.g. "prerequisite guidance is present", "cross-references exist", "description is non-empty and includes negative guidance") not the specific string content. Every `toContain('get-some-tool-name')` in a test is a red flag — it will break on every rename.
- When collapsing plans (WS2+WS3 → review checkpoint), the key insight was: don't implement speculatively. WS1 already provides substantial pedagogical context. Whether additional glossary data is needed should be evaluated empirically, not pre-emptively built.

## Session: Plan Consolidation and Correction (2026-03-01)

### Critical correction
- **get-ontology and get-help must be REPLACED, not kept alongside.** The previous
  implementation treated `get-curriculum-model` as additive (design principle 3:
  "Additive, not breaking"). The user corrected this: the standalone tools are to
  be removed. `get-curriculum-model` subsumes both entirely. This was captured as
  a non-goal ("No deprecation of get-help or get-ontology") — that non-goal was
  wrong. The consolidated plan now reflects replacement as the design intent.
- The strategic brief (`improve-pedagogical-context.plan.md`) has been archived.
  Its content is folded into the consolidated active plan.
- When an agent incorrectly reports "no remnants" of old tools because the tools
  are "still active", challenge the premise: are they supposed to be active? The
  question was about incomplete work, not about live tools.

### What was done
1. Consolidated WS1 plan and strategic brief into a single plan
2. Updated design decisions: replacement, not addition
3. Added ALL reviewer issues to the plan (not just critical/high)
4. Archived strategic brief, deleted completed Cursor plans
5. Updated onboarding prompt, collection READMEs
6. Extracted drift-detection test code pattern
7. Checked fitness functions (CONTRIBUTING.md at 401/400 ceiling)

## Session: WS1 Review and Validation (2026-03-01)

### Mistakes / corrections
- Used `Object.keys()` instead of `typeSafeKeys()` — ESLint `no-restricted-properties` catches this. Always use `typeSafeKeys<T>()` from type-helpers for typed keys.
- Zod `.passthrough()` is deprecated in Zod v4 — use `.loose()` instead. ESLint `@typescript-eslint/no-deprecated` catches this.
- `typeSafeKeys(AGGREGATED_TOOL_DEFS)` returns narrow literal types. Using `.includes(t.name)` where `t.name` is a wider type fails type-check. Fix: `new Set<string>(typeSafeKeys(AGGREGATED_TOOL_DEFS))` then `.has()`.
- Circular imports: `help-content.ts` cannot import from `universal-tools/definitions.ts` because definitions imports `GET_HELP_TOOL_DEF` from the help module. The error manifests at runtime as `Cannot convert undefined or null to object`. Solution: keep the manual list with TSDoc explaining the constraint, add a drift-detection test in a separate test file.
- `/curriculum/i` in regex for orientation guidance is vacuously true in a curriculum MCP server — everything mentions "curriculum". Tightened to `/orientation|domain model/i` for genuine discriminating power.
- Turbo cache can mask failures — first `pnpm lint:fix` run failed, second (with `--force`) passed. Similarly `pnpm smoke:dev:stub` failed from root but passed from app directory. The `--force` flag is essential for final verification.

### Patterns that worked
- Running triage (E2E + unit/integration tests) before fixing anything provides clear baseline of actual failures vs. phantom claims.
- Code reviewer as gateway reviewer at each phase transition (triage → fixes → gates → final) catches issues early.
- Regex alternation pattern `toMatch(/get-curriculum-model|get-ontology|get-help/)` tests "references an agent support tool" without coupling to a specific one.
- `Set<string>` from narrow literal types bridges the `includes()` type compatibility gap cleanly.
- Drift-detection test pattern: import canonical source in test file, iterate its keys, verify the system works for each. This catches both directions of drift.
- agent-support-tools-specification.md was extensively stale — referencing a removed tool (`get-knowledge-graph`). Reference docs must be updated when the system they describe changes.

## Session: Plan Review — 6 Specialists (2026-03-01)

### Findings integrated
- Barney BLOCKER: 2.4 validation conflicts with 3.5 ordering → folded module deletion into WS2
- Barney BLOCKER: 3.2 non-deterministic → locked in "move to shared module" design
- Fred W1: help-content.ts has runtime `toolName: 'get-help'` output (not just comments)
- Fred W2: getGeneralHelp() becomes dead code after WS2
- Fred W5: WS6 omits required canonical docs from documentation-propagation component
- Type BLOCKER-1: AGGREGATED_TOOL_NAMES must derive from AGGREGATED_TOOL_DEFS after 3.2 relocation
- Type BLOCKER-2: Zod replacements must use concrete protocol shapes, not z.record(z.string(), z.unknown())
- Test B1: aggregated-help.unit.test.ts must be DELETED not updated (all imports point to deleted modules)
- Test B2: WS1.5 test file must be tool-help-lookup.unit.test.ts (survives all phases)
- Wilma BLOCKER: WS3.2 must be single commit (create, update import, delete directory)
- Docs BLOCKER: ADR-058 (context grounding) missing — 15+ stale refs, foundational ADR
- Docs BLOCKER: ADR-059 (knowledge graph), ADR-108 (workspace decomposition) missing
- Docs BLOCKER: prerequisite-graph-generator.ts (both copies) generates stale seeAlso into runtime output
- Docs WARNING: ADR-060 needs "Accepted (Revised)" structural rewrite, not just count fix
- Docs WARNING: semantic-search.prompt.md, ground-truth-session-template.md missing from WS6

### Patterns observed
- Docs reviewer found the most BLOCKERs (4) — documentation drift is the biggest hidden risk in tool replacement plans. The rg sweep only catches TS files; ADRs and .agent/ prompts are easily missed.
- Running reviewers in groups with plan updates between groups means later reviewers review a better plan. Group 3 found issues Group 1 would have also caught, but the plan was already fixed.
- Folding module deletion into the same phase as tool removal resolves validation conflicts — deferred deletion creates contradictory acceptance criteria.
- "As unknown as X" double-cast in test mocks is a root cause, not a symptom. Fixing downstream as assertions without fixing the mock just moves the problem.

## Session 2026-03-01b — WS1 RED + WS2 GREEN execution

### Learnings
- `as const` on `audience: ['assistant']` creates `readonly ['assistant']` which is NOT assignable to MCP SDK's `("user" | "assistant")[]`. Fix: spread into mutable array `[...audience]`. This is a genuine readonly-vs-mutable boundary, not a hack.
- Generated vocab files at `src/generated/vocab/` are NOT regenerated by `pnpm sdk-codegen`. They need `pnpm vocab-gen` or manual update. Both the bulk generators AND the vocab-gen generators must be updated for full coverage.
- `AGGREGATED_TOOL_DEFS` `as const` + `keyof typeof` means removing a key from the object automatically narrows the type union — no separate type declarations needed. The `Record<AggregatedToolName, AggregatedHandler>` pattern enforces exhaustiveness at compile time.
- Atomic removal needs to include test files that import from deleted modules (e.g. `aggregated-help.unit.test.ts`). Type-check catches this immediately — deletion of source + test in same commit.
- tool-guidance-data.ts `tools: []` array is typed via `AllToolName`, so removing tools from AGGREGATED_TOOL_DEFS immediately causes type errors in the guidance data. Good — forces cleanup.

### Files deleted this session
- `aggregated-ontology.ts`, `aggregated-help/definition.ts`, `aggregated-help/execution.ts`, `aggregated-help/index.ts`
- `ontology-resource.ts`, `ontology-resource.unit.test.ts`
- `aggregated-help.unit.test.ts`

### Review findings to track
- E2E tests still reference removed tools — FIXED in WS4
- Dead export `HELP_PREREQUISITE_GUIDANCE` in `prerequisite-guidance.ts` — FIXED in WS3
- Stale docs: widget-rendering.md, GROUND-TRUTH-GUIDE.md, synonyms/README.md — for WS6

## Session 2026-03-01c — WS4 Quality Gates + WS5 Adversarial Review

### WS4 E2E fixes
- Deleted `get-ontology.e2e.test.ts` and `get-help-tool.e2e.test.ts` after backfilling coverage into `get-curriculum-model.e2e.test.ts`
- Backfill included: tool annotations, domain model structure (subjects, propertyGraph, workflows), all 4 key stages, toolGuidance fields, tool-specific help fields, unknown tool_name behaviour
- Fixed `widget-metadata.e2e.test.ts` tool name arrays
- Removed "Ontology Resource E2E" block from `documentation-resources.e2e.test.ts`
- All 11 quality gates green: clean, sdk-codegen, build, type-check, format, markdownlint, lint, test (693), E2E (185), UI, smoke

### WS5 Adversarial review findings
All 7 specialists: code-reviewer, test-reviewer, type-reviewer, barney, fred, wilma, docs-adr-reviewer

**Actionable (for WS6):**
- ADR-058: 17 stale references, structural rewrite needed (P0)
- ADR-060: 12+ stale references, structural rewrite needed (P0)
- agent-support-tools-specification.md: 10+ stale references, full rewrite (P0)
- ADR-108: 3 tool list corrections (P1)
- ADR-061: factual error in superseded note (P1)
- ADR-059: 5 references + update note (P1)
- 4 P2 docs (trivial string replacements): semantic-search.prompt.md, widget-rendering.md, ground-truth-session-template.md, GROUND-TRUTH-GUIDE.md

**Actionable (improvement, not blocking):**
- `widget-metadata.e2e.test.ts` still has 3 pre-existing `as` casts (follow-up, not WS scope)
- `universal-tools.unit.test.ts:176` stale @todo about validating get-curriculum-model content, not ontologyData
- `conditional-clerk-middleware` tests use `curriculum://ontology` URI as example (cosmetic)
- Dead regex alternatives in `documentation-resources.unit.test.ts` and `mcp-prompts.unit.test.ts`

**Architecture decisions confirmed:**
- Barrel import in definitions.ts: KEEP (Fred ruling — consistency across all 4 directory-based aggregated tools)
- Unknown tool_name returning base orientation (not error): CORRECT (Wilma — more useful than error)
- Type flow: SAFE (type-reviewer)

### Patterns
- E2E backfill pattern: extract helpers (`callToolsList`, `callGetCurriculumModel`) to reduce duplication, use Zod schemas for all validation
- 54 stale references across 10 documents — docs drift is consistently the largest hidden cost of tool replacement
- **Refactors as a diagnostic tool**: Refactoring reveals where the system is too tightly coupled (e.g. the circular dependency through `isKnownAggregatedTool` only surfaced when relocating `tool-help-lookup.ts`) and where tests are coupled to implementation rather than proving behaviour (e.g. E2E tests hardcoding `get-ontology`/`get-help` tool names instead of testing "an orientation tool exists", regex patterns with dead `|get-ontology|get-help` alternatives that would match even if old tools leaked back). If a refactor breaks many tests, the tests were testing structure not behaviour. If it reveals hidden imports, the modules had undeclared coupling. Treat refactor breakage as a signal, not just a cost.

## 2026-03-01 — MCP Prompts Rationalisation

### Vitest v4 CLI
- `--testPathPattern` does NOT work in vitest v4. The vitest run command takes file paths directly as positional args: `pnpm vitest run path/to/test.ts`
- E2E tests in the HTTP MCP app use a separate config: `pnpm vitest run --config vitest.e2e.config.ts`

### max-lines-per-function lint rule
- The outer describe callback in E2E tests is subject to `max-lines-per-function: 220`. Adding two new prompt test cases put it at 221. Fix: extract helper + `it.each` to consolidate repeated patterns.

### Docs reviewer catches
- "30 generated tools" is wrong — 23 are generated from OpenAPI, 7 are aggregated (hand-authored). "Generated" has precise meaning in this repo (ADR-029/030). Always distinguish generated vs aggregated.
- Resource annotations (priority, audience) exist on ALL three resources, not just `curriculum://model`. The graph/progression resources have `priority: 0.5`. Omitting this from docs misrepresents the design intent.

### TDD pattern for prompt removal
- RED phase: add count assertion (expect 4), add returns-empty assertion for removed prompt. Both fail against current code (5 prompts, progression-map still returns messages).
- GREEN phase: remove prompt from SDK + switch, add Zod schemas + registrations at app layer.
- Clean separation: unit tests prove SDK-level removal, E2E tests prove protocol-level registration.

### Template literal types vs expressions in for-of loops
- TypeScript widens `` `${subject}:${keyStage}` `` to `string` in for-of loop bodies even when `subject` and `keyStage` are narrow literal unions from `as const` arrays. A type-safe builder function `makeKey(subject: S, keyStage: K): `${S}:${K}`` solves this cleanly — the function's return type annotation forces TypeScript to produce the template literal type.
- Pattern: when you have a hand-written union that is really `${A}:${B}`, derive it from `as const` arrays and a builder function. Eliminates hand-written 68-member unions AND assertion casts in one move.
