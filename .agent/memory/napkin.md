# Napkin

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
