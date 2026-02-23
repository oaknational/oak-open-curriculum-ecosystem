---
name: Search Snagging Deep Analysis
overview: "Three-phase plan: (1) deep-dive analysis and document updates for search-snagging.md, roadmap.md, and semantic-search.prompt.md with metacognitive reframing; (2) architectural review of updated documents; (3) TDD implementation of all 5 fixes across three execution tracks."
todos:
  - id: phase1-analysis
    content: "Deep-dive metacognitive analysis: identify architectural root causes across all 5 snags, determine what tests/checks would have caught them, and what architectural changes prevent this class of bug"
    status: completed
  - id: phase1-update-snagging
    content: Update search-snagging.md with architectural root cause analysis, metacognitive reframing, and prevention strategies
    status: completed
  - id: phase1-update-roadmap
    content: Update roadmap.md with expanded snagging context and future Phase 4 schema-driven augmentation item
    status: completed
  - id: phase1-update-prompt
    content: Update semantic-search.prompt.md with deeper analysis framing and architectural insights
    status: completed
  - id: phase2-arch-reviews
    content: Invoke architecture reviewers (barney, fred, wilma) and docs-adr-reviewer against updated documents; incorporate feedback
    status: completed
  - id: phase3-track-a-tests
    content: "Track A RED: Write failing tests for response-augmentation-helpers (new file), response-augmentation (keyStages shape), aggregated-fetch (canonicalUrl), middleware (error containment)"
    status: completed
  - id: phase3-track-a-impl
    content: "Track A GREEN: Fix isSingleEntityEndpoint (positive regex), extractSubjectContext (keyStages objects), augmentBody (try-catch), runFetchTool (pass context)"
    status: completed
  - id: phase3-track-b-tests
    content: "Track B RED: Write failing tests for suggest contexts in execution.integration.test.ts and new suggestions test"
    status: completed
  - id: phase3-track-b-impl
    content: "Track B GREEN: Fix suggest() to include contexts field in ES completion query"
    status: completed
  - id: phase3-track-c-investigate
    content: "Track C: Capture raw API response, compare against generated schema, identify mismatch, fix schema or codegen"
    status: completed
  - id: phase3-track-c-impl
    content: "Track C GREEN: Fix schema via pnpm type-gen, add conformance test with captured fixture"
    status: completed
  - id: phase3-quality-gates
    content: Run full quality gate chain after all tracks complete
    status: completed
  - id: phase3-post-impl-reviews
    content: Invoke code-reviewer, test-reviewer, and type-reviewer against implementation changes
    status: completed
isProject: false
---

# Search Snagging: Deep Analysis, Document Updates, and Implementation

## Phase 1: Metacognitive Analysis and Document Updates

### Root Cause Analysis — The Architectural Disease

The five snags share a single architectural weakness: **the response augmentation system was built outside the schema-first discipline**. Specifically:

- **Heuristic path dispatch** (Snags 3, 4): `isSingleEntityEndpoint` in `[response-augmentation-helpers.ts](packages/sdks/oak-curriculum-sdk/src/response-augmentation-helpers.ts)` uses `path.includes('/subjects/')` — a substring heuristic that over-broadly matches nested resource paths like `/subjects/maths/key-stages`. A schema-derived path-to-content-type map would make this class of bug impossible.
- **Manual contract assumption** (Snag 2): `extractSubjectContext` in `[response-augmentation.ts](packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts)` checks for `keyStageSlugs` (a flat string array) but the API returns `keyStages` (array of objects with `keyStageSlug`). The test suite encoded the same wrong assumption. Schema-driven validation against `SubjectResponseSchema` would prevent property name drift.
- **Missing error boundary** (Snags 2, 3, 4): `augmentBody()` in `[client/middleware/response-augmentation.ts](packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts)` has no error handling. Canonical URL decoration is supplementary — it should never kill the API call. This conflates best-effort enhancement with critical functionality.
- **Silent parameter acceptance** (Snag 1): `suggest()` in `[suggestions.ts](packages/sdks/oak-search-sdk/src/retrieval/suggestions.ts)` accepts `subject` and `keyStage` parameters but never uses them in the ES completion query. The `oak-search-cli` has a working implementation (`buildSubjectContexts`) that shows how contexts should be built.
- **No schema conformance testing** (Snag 5): Generated Zod schemas are never tested against captured real API responses. Schema drift is invisible until a user hits it at runtime.

### What Tests Would Have Caught These

- **Zero tests for `response-augmentation-helpers.ts`** — 6 exported pure functions, no test file. Any sub-resource path test catches Snags 3/4.
- **Tests use wrong API shape** — subject tests use `keyStageSlugs` (matching buggy code) instead of `keyStages` (actual API). Contract tests against the generated schema would prevent this.
- **Suggest test asserts dispatch, not params** — existing test verifies `retrieval.suggest` is called but not the query shape. Asserting the `contexts` field catches Snag 1.
- **No `canonicalUrl` assertion for context-dependent types** — integration tests for fetch never test subjects or assert non-null canonical URLs.
- **No schema conformance test with real fixtures** — a single test parsing a captured response catches Snag 5.

### Architectural Changes That Would Prevent This Class of Bug

**Immediate** (part of this snagging work):

- Positive exact-depth regex matching instead of `path.includes()`
- Error containment at middleware boundary
- Missing test file for helpers module

**Medium-term** (roadmap Phase 4):

- Schema-driven path-to-content-type mapping at `pnpm type-gen` time
- Schema-driven context extraction using generated Zod schemas
- Schema conformance tests as part of type-gen quality gates

### Document Updates

#### 1. Update `[search-snagging.md](/.agent/plans/semantic-search/archive/completed/search-snagging.md)`

Add three new sections after the existing "Discovery Context":

- **Architectural Root Cause Analysis** — The common disease behind the 5 symptoms (schema-first discipline violation in response augmentation)
- **What Would Prevent This Class of Bug** — immediate fixes vs medium-term architectural corrections
- **Metacognitive Reframing** — the insight that response augmentation was built outside the schema-first discipline; the bridge from fixing symptoms to addressing causes

Update the execution strategy to reference the architectural insight and note which fixes are symptom-level vs cause-level.

#### 2. Update `[roadmap.md](/.agent/plans/semantic-search/roadmap.md)`

- Expand the "MCP Tool Snagging" entry under "Post-Merge Work" with the architectural insight
- Add a Phase 4 item: "Response Augmentation Schema Alignment" — bring path matching and context extraction into the schema-first discipline
- Reference the snagging analysis as the origin of this future work

#### 3. Update `[semantic-search.prompt.md](/.agent/prompts/semantic-search/semantic-search.prompt.md)`

- Update the snagging status entry with the deeper analysis framing
- Add a "Lessons Learned" or "Critical Insights" note about the test coverage gap pattern (tests encoding wrong assumptions)
- Reference the architectural insight about schema-first augmentation

---

## Phase 2: Architectural Review

Invoke the following specialist reviewers (readonly) against the updated documents and plan:

- `architecture-reviewer-barney` — simplification opportunities; can the fix be simpler?
- `architecture-reviewer-fred` — ADR/principles compliance; does the plan honour schema-first?
- `architecture-reviewer-wilma` — resilience/failure modes; is error containment sufficient?
- `docs-adr-reviewer` — document quality and drift detection

Incorporate reviewer feedback into the documents before Phase 3.

---

## Phase 3: TDD Implementation

### Track A — Response Augmentation (Snags 2, 3, 4)

**Files to modify:**

- `[response-augmentation-helpers.ts](packages/sdks/oak-curriculum-sdk/src/response-augmentation-helpers.ts)` — fix `isSingleEntityEndpoint` with positive exact-depth regex
- `[response-augmentation.ts](packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts)` — fix `extractSubjectContext` to handle `keyStages` array of objects; export `extractContextFromResponse`
- `[client/middleware/response-augmentation.ts](packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts)` — add try-catch error containment in `augmentBody`
- `[aggregated-fetch.ts](packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts)` — pass extracted context to `generateCanonicalUrlWithContext`

**New test file:**

- `response-augmentation-helpers.unit.test.ts` — full coverage for 6 exported pure functions

**Test extensions:**

- `response-augmentation.unit.test.ts` — add tests for real API response shape (keyStages objects)
- `aggregated-fetch.integration.test.ts` — add tests for subject/unit fetch with canonicalUrl assertions

### Track B — Suggest Search (Snag 1)

**Files to modify:**

- `[suggestions.ts](packages/sdks/oak-search-sdk/src/retrieval/suggestions.ts)` — add `contexts` field to ES completion query, using `subject` and `keyStage` params

**Test extensions:**

- `execution.integration.test.ts` — assert subject/keyStage are passed through
- New test for `suggest()` asserting ES query includes contexts field

### Track C — Schema Validation (Snag 5)

**Investigation required:**

- Capture raw API response via curl for `/key-stages/ks3/subjects/science/questions`
- Compare against generated `QuestionsForKeyStageAndSubjectResponseSchema`
- Fix either OpenAPI spec or codegen, then `pnpm type-gen`

**New test:**

- Schema conformance test with captured fixture

### Execution Order

1. Track A first (highest impact, addresses 3 snags)
2. Track B second (independent, ~2h)
3. Track C last (requires investigation, may trigger `pnpm type-gen` which affects other tracks)

### Quality Gates

After all tracks: run the full gate chain (`pnpm clean` through `pnpm smoke:dev:stub`).

### Reviewer Invocations (post-implementation)

- `code-reviewer` — gateway review
- `test-reviewer` — TDD compliance and test quality
- `type-reviewer` — schema-first compliance for context extraction
