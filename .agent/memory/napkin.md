## Session 2026-03-21 — Task 1.2b: Fix `unknown` type violation

### What Was Done

- Tightened `GetSequenceUnitsFn` from `Result<unknown, SdkFetchError>` to
  `Result<SequenceUnitsResponse, SdkFetchError>` (schema-derived type).
- Added `isSequenceUnitsResponse` Zod-based guard at the adapter boundary
  in `makeGetSequenceUnits`, matching the `makeGetSubjectSequences` pattern.
- Tightened `CategoryFetchDeps` to use typed Result, removed `Array.isArray`
  coercion from `fetchCategoryMapForSequences`.
- Replaced hand-rolled `ApiUnit`/`ApiCategory`/`ApiYearData`/`SequenceUnitsData`
  with schema-derived types via `Extract` + indexed access:
  `YearEntryWithUnits`, `SequenceUnit`, `SequenceUnitCategory`.
- Used `'unitSlug' in unit` / `'unitOptions' in unit` for proper discriminated
  union narrowing (was truthiness check `if (unit.unitSlug)`).
- `buildCategoryMap` now accepts `SequenceUnitsResponse` and uses
  `'units' in yearData` to narrow the three-variant year entry union.
- Renamed `sdk-api-methods.unit.test.ts` → `sdk-api-methods.integration.test.ts`
  (uses injected mock dependencies — integration pattern per ADR-078).
- Added `createMockSequenceUnits()` factory anchored to `SequenceUnitsResponse`.
- Six reviewer passes (code-reviewer, type-reviewer, test-reviewer).
- 1038/1038 tests, all gates green. Phase 1 complete.

### Lessons

- **`Extract` + indexed access is the correct way to derive sub-types from
  generated union types.** Instead of hand-rolling types that approximate
  the schema, derive them: `type Unit = Extract<Response[number], { units: unknown }>['units'][number]`.
  The compiler then enforces schema alignment automatically.
- **`'prop' in obj` narrows discriminated unions; truthiness checks don't.**
  `if (unit.unitSlug)` checks truthiness but doesn't narrow the TypeScript
  union. `'unitSlug' in unit` narrows to the variant that has the property.
- **Test file classification matters.** If a test injects mock dependencies
  via function parameters, it's an integration test (ADR-078), not a unit
  test. Naming it `*.unit.test.ts` violates the testing strategy.

---

## Session 2026-03-21 — Task 1.2: Result migration and type violation

### What Was Done

- Migrated `fetchCategoryMapForSequences` from throwing to returning
  `Result<CategoryMap, Error>` per ADR-088. Strict TDD: Red phase proved
  tests fail, Green phase made them pass.
- Extracted `fetchCategories` helper in `bulk-ingestion.ts` as the unwrap
  boundary (also fixed `max-lines-per-function` lint).
- Three reviewer passes: code-reviewer (approved), test-reviewer (fixed
  conditional assertions → `unwrap()`), type-reviewer (AT-RISK).
- type-reviewer correctly identified blocking `unknown` type violation:
  `GetSequenceUnitsFn` returns `Result<unknown, SdkFetchError>` — the
  `unknown` propagates to `CategoryFetchDeps` and forces `Array.isArray`
  coercion. Agent attempted to defer this as a "follow-up". User corrected:
  principle violations are not follow-ups.
- Deeply updated all authority documents with the blocking violation.
  Task 1.2 cannot close until the type violation is fixed.

### Lessons

- **Principle violations are not follow-ups.** When a reviewer identifies
  a breach, the fix is in scope even if it's bigger than expected. Deferring
  it is choosing convenience over correctness. The agent was told: "you were
  presented with violations of the principles and chose to treat them like
  someone else's problem."
- **`unknown` only at the exact external boundary.** Never deeper. The
  `unknown` in `GetSequenceUnitsFn` is inside the adapter layer, not at
  the external boundary. The external boundary is `client.GET()` — the
  response type is OpenAPI-generated and known. The `unknown` was introduced
  by the adapter discarding that type.
- **`Array.isArray` coercion is a symptom of untyped data.** The fix is not
  to improve the coercion — it's to type the data properly so the coercion
  becomes unnecessary.

---

## Session 2026-03-21 — Task 1.1: Shared mock helper extraction

### What Was Done

- Extracted duplicated `createMockClient` OakClient mock factory from 5 test
  files into shared `test-helpers/mock-oak-client.ts` with `Partial<OakClient>`
  overrides pattern. `lesson-materials.unit.test.ts` uses a local
  `createLessonMaterialsMockClient` that composes on the shared base.
- Three reviewer passes (code-reviewer, test-reviewer,
  architecture-reviewer-barney) surfaced two additional improvements:
  - Deleted self-referential mock factory test (tests mocks, not product)
  - Split `api-supplementation.unit.test.ts` into unit (pure functions) and
    integration (`buildKs4SupplementationContext`) files
- Deep-updated all authority documents (session prompt, execution plan, active
  README, current README, memory) so a fresh session can pick up Task 1.2
  without any context gaps.
- Commit `dfb48b90` (code), commit `9438ec6e` (docs).

### Lessons

- **"Do not assume you know the initial step"** — the thorough start-right
  directive says to discuss with the user first. Jumping into implementation
  without asking is a recurring pattern to watch for.
- **Reviewer findings are the best investment in test refactoring sessions.**
  The test-reviewer identified that the mock factory test was self-referential
  (tests the mock, not product behaviour), and the file-naming misclassification.
  Neither issue was visible from the code alone — the tests all passed.
- **Deep document updates are not optional.** When a session leaves authority
  documents stale, the next session wastes time re-discovering state. The
  cost of updating 6 documents now is lower than the cost of one confused
  grounding sequence later.

---

## Session 2026-03-20 — Codegen error response implementation

### What Was Done

- Fixed two codegen bugs: component name sanitisation (Bug 2) and
  cross-validator wildcard awareness (Bug 1). TDD at unit and
  integration scale.
- Refactored cross-validate.ts to use narrow openapi3-ts types instead
  of defensive `unknown` narrowing.
- Fixed 8 downstream test failures across 3 packages (sdk-codegen,
  curriculum-sdk, mcp-stdio) caused by the regenerated types now
  including documented error responses.
- Deleted stale 404 decorator tests and unused dead code.
- Created comprehensive error-response-classification plan for next
  session. Documented critical path to P0 in README.

### Lessons

- **Guard once at the trust boundary, then work with narrow types.**
  The cross-validator was defensively narrowing from `unknown` at every
  step, as if the data were untrusted. But the schema is validated at
  fetch time — everything downstream should use the types openapi3-ts
  provides. The `IExtensionType` index signature is the ONE boundary
  where `Object.entries` widens values; guard there with
  `isResponseObject`, then work with `ResponseObject` throughout.
- **Identical error schemas create a first-match-wins ambiguity.** When
  multiple documented statuses share the same Zod schema, the validator
  picks the first match in iteration order. A 404 body validates as 400.
  The HTTP status must be part of the discriminant, not just the body.
- **Tests that constrain implementation source are entropy.** Three
  schema-separation tests failed because they assumed the 404 schema
  came from the decorator (now empty), not from the upstream. The same
  behaviours were already proven at a lower level. Delete tests that
  test "where the definition came from" rather than "what the behaviour
  is."
- **When documentation is the deliverable, stop coding.** The user
  correctly identified that capturing decisions and context for the next
  session was more valuable than implementing the full error
  classification in this session.

---

## Session 2026-03-19 (session 3) — Codegen error response investigation

### What Was Done

- Deep read-only investigation of the codegen pipeline to understand the
  Cardinal Rule breach from upstream error response additions.
- Discovered **two bugs**, not one: (1) cross-validator doesn't expect wildcards,
  (2) dotted component names (`error.BAD_REQUEST`) break the emitter because
  `$ref` names are passed through unsanitised.
- Updated plan with full investigation findings, root-cause analysis, phased
  TDD execution sequence, risk assessment, and decoupling strategy.
- Updated session prompt and project memory to reflect both bugs.
- Created focused implementation entry prompt for the next session.

### Lessons

- Going slow in architecturally delicate areas pays off: the second bug (dotted
  names) would have been a nasty surprise mid-implementation if we'd jumped
  straight to fixing Bug 1. The execution order matters — Bug 2 must be fixed
  first because Bug 1's wildcard detection depends on sanitised names.
- The codegen's wildcard design (builder → emitter → descriptor helpers) is
  coherent and well-thought-out. The cross-validator being out of sync is a
  gap, not a design flaw. Recognising this prevents over-engineering the fix.
- The cached schema provides a natural decoupling mechanism: `--ci` mode reads
  from cache, so all fixes can be developed against synthetic test schemas
  before touching the live schema. This was already built into the codebase
  but not documented as a development strategy.

---

## Session 2026-03-19 (session 2) — F2 fix and Cardinal Rule breach

### What Was Done

- F2 code fix: wired `categoryMap` through full ingestion pipeline (sequences
  + units). `fetchCategoryMapForSequences()` added. TDD with 5 new tests.
- Removed transcript 404 decorator (upstream schema now native). Self-healing
  guard worked as designed.
- Discovered Cardinal Rule breach: upstream schema now documents error responses
  (400, 401, 404). `pnpm sdk-codegen` fails at response-map cross-validation.
- Created codegen adaptation plan. Committed all work.
- Barney review completed: 3 findings (DI surface, return type, stale TSDoc).

### Lessons

- Self-healing guards are high-value infrastructure: the `assertResponseStatusSlotAvailable`
  guard caught the upstream schema change immediately and told us exactly what
  to do. Build more of these.
- When a plan contradicts principles (category-integration-remediation said
  "graceful degradation", principles say "fail fast"), principles always win.
  Plans are execution instructions; principles are the authority.
- "Pre-existing" is not an excuse. If `pnpm check` fails, the Cardinal Rule is
  breached, and it blocks everything. The scope of the current task is irrelevant.
- A wiring bug can be invisible to every unit test and even stage-level tests.
  Only pipeline-level integration tests (calling `collectPhaseResults` end-to-end)
  caught that `categoryMap` was never passed. This is why the field-integrity
  framework's cross-stage tests exist.

---

## Session 2026-03-19 — Semantic search investigation

### Lessons

- F1/F2 root causes and findings are in the authority docs (prompt, plan,
  findings register) — not here. Check those for details.
- Tracing a bug through real bulk data files (not just test fixtures) is
  essential: the F2 root cause (`categoryMap` never wired) was invisible
  from tests alone because test fixtures accepted empty `categoryTitles`.
- When infrastructure is 100% built but never connected, tests can pass
  at every individual stage while the end-to-end pipeline is broken. The
  cross-stage test caught F1 but not F2 because the fixture didn't model
  the `categoryMap` dependency.

---

## Session 2026-03-19 — Practice context integration and fitness upgrade

### What Was Done — Phase 1: Incoming integration

- Reviewed all 8 incoming practice-context files from pine-scripts cross-repo
  propagation
- Adopted material from 4 files into Practice Core:
  - `metacognitive-primacy.md` → restructured Philosophy layer, metacognition
    framing in lineage, learned principle
  - `practice-maturity-model.md` → new §Practice Maturity section in lineage
  - `pine-scripts-integration-field-report.md` → 2 learned principles
    (infrastructure, "not even wrong")
  - `practice-seeding-protocol-suggestions.md` → hydration/preservation
    distinction, activation checks in bootstrap
- Informed by 3 files (no artefact changes needed):
  - `pine-scripts-mcp-relevant-conclusions.md` — summary of other files
  - `cross-repo-preservation-lessons.md` — operational migration lessons
  - `plan-lifecycle-refinement.md` — oak already has richer lifecycle
- Adopted 1 learned principle from `sub-agent-component-model-proposal.md`
  (empty stubs are harmful)
- Updated CHANGELOG.md with integration record
- Cleared incoming files after integration

### What Was Done — Phase 2: Outgoing context and fitness upgrade

- Created 3 new outgoing practice-context files:
  - `cross-repo-transfer-operations.md` — operational migration lessons
  - `plan-lifecycle-four-stage.md` — simpler lifecycle for less mature repos
  - `seeding-protocol-guidance.md` — source-side transfer protocol
- Created then deleted `sub-agent-component-architecture.md` — redundant
  with existing `reviewer-system-guide.md`
- Refined 2 pre-existing outgoing files:
  - `reviewer-system-guide.md` — added clerk-reviewer, empty stubs pitfall,
    activation depth pitfall, removed speculative Antigravity references
  - `platform-adapter-reference.md` — removed Antigravity row
- Added named promotion states (received/promoted/rejected) to Integration
  Flow in `practice-lineage.md`
- Tightened `practice-lineage.md` under ceiling: moved validation scripts
  to outgoing context, compressed verbose sections via §-references
- Upgraded fitness functions to three-dimension metric:
  - Line count + character count + max prose line width (100 chars)
  - Reflowed all three trinity files to 100-char prose lines
  - New `scripts/validate-practice-fitness.mjs` script
  - `pnpm practice:fitness` command added
  - Updated frontmatter, §Fitness Functions, §Other fields, learned principle

### Lessons

- The prior session's dismissal was a metacognitive failure — applying a
  mechanical "already covered" filter instead of asking "would this make what
  we have better?" The distinction between "present" and "primary" matters.
- Incoming context files have different value profiles: some carry unique
  frameworks (maturity model), some carry unique framing (hydration vs
  preservation), some are summaries of richer material. Engage with each on
  its own terms.
- Line-count-only fitness ceilings create a perverse incentive: "tightening"
  can mean making lines longer. Character count is the honest constraint;
  prose line width prevents the gaming mechanism; line count remains the
  intuitive "feel" check. All three are needed.
- Outgoing practice-context files should be refined distillations, not copies
  of incoming material. The existing reviewer-system-guide was already a good
  document — creating a redundant new file was waste. Check for overlap first.

## Session 2026-03-14 — Distillation rotation

### What Was Done

- Archived outgoing napkin to `archive/napkin-2026-03-14.md` (549 lines,
  covering sessions 2026-03-11 to 2026-03-14).
- Added commitlint body-max-line-length entry to distilled.md Troubleshooting.
- distilled.md now at 187/200 lines — within ceiling.
- No other entries required graduation this pass — existing entries are
  still operational (not yet superseded by permanent docs or specialist
  implementations).

## Session 2026-03-15 — Archive cutover hygiene

### What Was Done

- Archived completed recovery authorities from `semantic-search/active/` to
  `semantic-search/archive/completed/` and rewired indexes/prompt/roadmap to
  the new locations.
- Ran reviewer sweep (`docs-adr-reviewer`, `code-reviewer`,
  `elasticsearch-reviewer`) and fixed all reported actionable findings.
- Re-ran markdown lint after fixes.

### Lessons

- When moving plan docs deeper in the tree, re-check all relative links in the
  moved files; `../archive/completed/...` paths inside `archive/completed/`
  become broken immediately.
- Evergreen ops docs must not rely on archived runbooks for live decision
  criteria; carry critical deterministic selection rules directly in the ops
  document.

## Session 2026-03-15 — Consolidate-docs sweep

### What Was Done

- Ran stale-link sweep for archive cutover and fixed two live references that
  still pointed to deleted `active/` recovery plan paths.
- Checked platform-specific plan/memory locations for extractable settled
  documentation; no new settled technical guidance required extraction this pass.
- Re-ran markdown lint and docs review after updates.

### Lessons

- After archive moves, stale references may remain in "current" plans and
  code-pattern "further reading" links, not just in prompts and active indexes.

## Session 2026-03-15 — Start-right quick re-ground

### What Was Done

- Re-ran `start-right-quick` grounding against the active semantic-search
  prompt and findings register.
- Confirmed `practice-core/incoming` is empty (no cross-repo incoming material
  to integrate this session).
- Reviewed operator terminal evidence showing the in-flight versioned ingest
  completed successfully at `v2026-03-15-134856`.

### Lessons

- Session prompt and findings register can drift behind live terminal state;
  when ingest completion evidence exists, update both documents together before
  progressing remediation status for active findings.

## Session 2026-03-15 — Post-ingest readback and retest

### What Was Done

- Completed post-ingest readbacks after `v2026-03-15-134856`:
  `admin validate-aliases`, `admin meta get`, `admin count`, `admin verify`.
- Ran live `oak_meta` mapping contract validation using
  `ensureIndexMetaMappingContract` against production (`OK`).
- Re-ran production search-tool retests through the `search` MCP tool for
  `F1`/`F2`.
- Updated semantic-search prompt + active findings register with fresh
  evidence and status updates.

### Lessons

- In this workspace, `CallMcpTool` supports an `arguments` payload even though
  the simplified local type stub does not list it; for tool-driven validation,
  rely on descriptor + runtime behaviour.
- `search` CLI subcommands do not expose all MCP filter parameters
  (`threadSlug`, `category`), so production filter-semantics retests must run
  against the MCP tool itself.
- In findings docs, separate "codebase remediation landed" from "remediation
  deployed to production"; otherwise retest interpretations become ambiguous.

## Session 2026-03-15 — Comprehensive field-integrity test planning

### What Was Done

- Created an executable active plan for comprehensive all-field integration
  testing across all pipeline stages and index families:
  `comprehensive-field-integrity-integration-tests.execution.plan.md`.
- Updated active index, session prompt, and roadmap to make the new plan
  discoverable in all required surfaces.

### Lessons

- For this lane, plan quality depends on expressing "all fields" as generated
  inventory + stage-contract matrix, not ad hoc lists, to keep coverage
  deterministic and drift-resistant.

## Session 2026-03-15 — Plan/prompt hardening review cycle

### What Was Done

- Ran deep read across active semantic-search prompt, active field-integrity
  execution plan, retrieval/indexing code paths, and live ES state via EsCurric
  MCP.
- Updated plan/prompt to enforce pre-ingest no-blindness gates:
  field-level readbacks, mapping-aligned filter semantics, CI-vs-operator split,
  and explicit TDD/testing constraints.
- Completed iterative reviewer closure with `docs-adr-reviewer`,
  `test-reviewer`, and `elasticsearch-reviewer` until no actionable findings
  remained.

### Lessons

- Reviewer cycles on planning docs can surface concrete execution hazards
  (broken relative links, non-existent script references, CI determinism gaps)
  before implementation starts.
- For ES-heavy plans, include refresh-visibility handling in readback evidence
  criteria; otherwise post-ingest population checks can produce false negatives.

## Session 2026-03-18 — Pine-Scripts Process Readback

### What Was Done

- Added incoming analysis note
  `practice-context/incoming/pine-scripts-mcp-relevant-conclusions.md`
  to preserve the oak-relevant conclusions from the `pine-scripts`
  integration process
- Captured the cross-repo pattern that oak is still the richer source
  substrate, but `pine-scripts` is now an active adaptation lab rather than a
  passive receiver

### Lessons

- The most dangerous Practice integration failure is inert installation:
  structurally correct files with insufficient activation depth, especially in
  metacognition
- `metacognitive-primacy.md` is supported by field evidence from
  `pine-scripts`, not just by intuition
- Incoming context can hold real analytical value before canonicalisation;
  transient does not mean disposable

## Session 2026-03-21 — F2 Architecture Closure and Plan Consolidation

### What Was Done

- Resolved three blocking architecture-reviewer-barney findings on F2
  categoryMap wiring: DI consistency, Result type tightening, stale ADR
  placeholder.
- Addressed findings from five specialist reviewer passes (code-reviewer,
  architecture-reviewer-barney, test-reviewer, docs-adr-reviewer,
  elasticsearch-reviewer). 14 findings total, all addressed.
- ES mapping fix: added `unit_topics.keyword` sub-field to rollup overrides
  for terms aggregation (would have caused runtime failure on re-ingest).
- Test improvements: 1033→1038 tests. Renamed misclassified unit test to
  integration, added categoryMap forwarding assertion, rewrote
  fetch-category-map test with narrow `CategoryFetchDeps`, added
  extractCategoryTitles and slug-derivation tests.
- Documentation: ADR-093 revised, adapters README updated, plan status fixed.
- Plan consolidation: archived completed A1 field-integrity plan, created
  single active plan (f2-closure-and-p0-ingestion), updated all cross-refs
  including three code files with hardcoded artefact paths.

### Lessons

- Moving plan artefacts is a cross-cutting operation — it touches not just
  markdown links but test code, CLI defaults, and test runner scripts.
  Always grep for old paths in `*.ts`, `*.mjs`, and `*.json`, not just `*.md`.
- When a reviewer says "approved with suggestions", the suggestions are
  blocking in this repo. The distinction between "important improvement" and
  "suggestion" collapses under the "all findings are blocking" directive.
- Plan directories should contain exactly one active plan. Index READMEs are
  fine; multiple concurrent plans in `active/` are not — they obscure what's
  actually being executed.

## Session 2026-03-21 — Error Response Classification

### What Was Done

- Implemented domain-aware error classification for documented 4xx responses
  (400/401/404) across the SDK and MCP layers. Three-layer fix: generator
  (InvokeResult preserves HTTP status), SDK classification (pure functions),
  MCP presentation (informational handling for content-blocked).
- Upstream API experimentation revealed two distinct error body shapes: clean
  `{ message, code }` and gated-endpoint `{ message, code, data: { cause } }`.
  Generator fix addresses both because `httpStatus >= 400` check precedes
  schema validation.
- Content-blocked responses now return `isError: false` (informational).
- Discovered upstream 500 bug: PE lessons without video trigger null pointer
  on transcript endpoint. Documented for Oak API team.

### Lessons

- When a generator drops information (HTTP status), the fix belongs in the
  generator, not in downstream workarounds. The Cardinal Rule applies to
  information flow, not just type flow.
- Upstream API experimentation before classification design prevented
  speculative architecture — the actual response shapes (two distinct
  formats, a 500 for absent content) were not predictable.
- The `httpStatus >= 400` check before `validateOutput` in generated code
  solved both the validator-ordering problem AND the strict-schema-rejection
  problem — an elegant case where one fix addressed two bugs.
