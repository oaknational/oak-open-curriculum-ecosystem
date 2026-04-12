## Napkin rotation — 2026-04-11

Rotated at 523 lines after 6 sessions (2026-04-10m through
2026-04-11g) covering WS-0/1/2, pre-commit fixes, NC accuracy
and oak-kg namespace, attribution metadata, type extraction from
generated contracts, TS2430 gate fix (`Omit<Tool, '_meta'>`), and
quality gate hardening plan audit.
Archived to `archive/napkin-2026-04-11.md`. Merged 6 new entries
into `distilled.md`:
- Ground plans in verified data (Process)
- Never weaken gates to solve testing problems (Process)
- lint:fix can silently revert manual edits (Build System)
- Blanket replace_all corrupts mixed-case code (Build System)
- Verify reviewer fixes are on disk (Process)
- ESLint lint:fix can merge value+type imports was already present
Graduated 0 entries to permanent docs (distilled.md at 234 lines,
above 200 target — graduation deferred to next consolidation when
ADR-121 reconciliation provides a natural home for gate-surface
entries).
Previous rotation: 2026-04-10b at 570 lines.

---

### Session 2026-04-11g: Quality gate hardening plan audit

**Root cause: session started badly — planned from assumptions**
The session objective was to classify gate hardening by effort and
impact. The first plan attempt was rejected because it:
1. Assumed flaky tests were resolved (they weren't — never verified)
2. Proposed "forbidden-comment test exemptions" (weakening gates
   when the stated goal was strengthening them)
3. Skipped specialist plan review (user had to ask for it)

The structural failure: treated "produce a plan" as the task instead
of "verify the ground truth, then produce a plan." The correct
sequence: gather data → verify assumptions → draft plan → review
with specialists → present. Distilled as a process rule.

**Correction: ADR-121 drift is wider than the matrix**
The initial audit found 6 matrix errors. Specialist reviewers
(docs-adr, assumptions, architecture) expanded this to: 5 factual
errors + 2 verify-vs-mutate discrepancies + stale prose (Rationale,
Consequences, Design Principle #4 falsified) + ADR-147 contradiction
+ downstream doc drift (build-system.md, workflow.md,
accessibility-practice.md). The plan scope grew from "fix the
matrix" to "amend the ADR + reconcile the documentation estate."

**Surprise: eslint-disable remediation has zero progress**
The assumptions-reviewer surfaced that
`eslint-disable-remediation.plan.md` is "IN PROGRESS" but every
single todo is `pending`. Item 3 (promote no-eslint-disable to
error) is blocked indefinitely. This was a hidden assumption.

**Architectural decision: ESLint config standardisation is Tier 1**
Both assumptions and architecture reviewers independently flagged
that ESLint config standardisation was mis-tiered at Tier 3. It's
a prerequisite for all lint-rule promotions — must be Tier 1. The
effort estimate was also revised from 1-2 days to 2-3 days.

**Carry-forward items from archived napkin:**
- Generated tools have no human-friendly title (deferred, no plan)
- Synonym builders should become codegen-time (no plan)
- `static-content.ts` `process.cwd()` bug (tracked nowhere)
- Consolidate `security-types.ts` with `mcp-protocol-types.ts`
- Note contract re-export surface change for semver

**Open question: 3 owner decisions block ADR reconciliation**
1. Restore or redefine ADR-121 principle #4 (CI strict subset of
   pre-push)?
2. Is `pnpm check` verify-vs-mutate intentional or oversight?
3. Should `pnpm check` use `secrets:scan:all`?

---

### Session 2026-04-11h: Plan promotion and knip child plan

**Quality gate hardening promoted to current/**
Moved `quality-gate-hardening.plan.md` from `future/` to `current/`.
Owner decisions from session 2026-04-11g are resolved. ADR-121
reconciliation (`reconcile-gate-docs`) marked complete. Status updated
to reflect current lifecycle position. Updated both `future/README.md`
(struck-through row) and `current/README.md` (added quality-gate and
knip child plan rows).

**Knip triage: 904 findings across 8 categories**
Ran `pnpm knip` and captured verified data before planning:
- 96 unused files (dominated by oak-search-cli ground-truth-archive
  and hybrid-search experiments)
- 2 unused deps + 9 unused devDeps (likely real — manifest hygiene)
- 515 unused exports + 234 unused exported types (bulk is barrel
  re-exports in oak-search-cli and streamable-http)
- 45 config hints (stale ignores, drifted entry patterns)
- 2 unlisted binaries (lsof, ps — system utilities, not npm)
- 1 duplicate export (vitest.e2e.config.base.ts)

**Key open question: ground-truth-archive consumption**
~78 of the 96 unused files are in oak-search-cli, many in
`ground-truth-archive/`. Whether these are consumed via dynamic/glob
discovery or are genuinely dead is an open investigation — no
conclusion without evidence.

**Decision principle: evidence first, never presume false positive**
User directive: no finding may be labelled a false positive without
evidence-based proof. When investigation proves consumption via a
non-standard pattern, fix the pattern to be standard rather than
adding ignores. Reducing knip sensitivity is a gate weakness.

**Process learning: verified-data-first continues to pay off**
Running `pnpm knip` and recording the exact output before creating
the plan meant the plan has concrete counts, specific file lists,
and workspace-scoped triage. This avoids the session-2026-04-11g
anti-pattern of planning from assumptions.

**Owner input: stdio MCP server is deprecated**
The `apps/oak-curriculum-mcp-stdio` workspace is deprecated. Removing
it entirely is a valid remediation for its knip findings (2 unused
deps plus associated exports/files), but requires: (1) scanning for
useful learnings to extract, (2) removing all references except a
historical note. The HTTP server will eventually support stdio
transport but that is not a current priority — out of scope.

**Owner input: knip on all four gate surfaces**
At plan completion, knip must run on pnpm check, pre-commit, pre-push,
AND CI. This is stricter than the pre-push === CI principle alone —
pre-commit also gets knip so unused code never enters the repo at all.

---

### Session 2026-04-11i: Knip Phase 0 — unused deps triage

**Stdio workspace removed entirely**
Deleted `apps/oak-curriculum-mcp-stdio/` (~5000 lines, 55 files).
Already commented out of pnpm-workspace.yaml, no turbo/CI references.
ADR-128 documents the retirement. No unique code needed extraction —
HTTP app has its own equivalents for all patterns (stubbed server,
file logging, CLI binary).

**Unused deps resolved: 2 deps + 9 devDeps → 0**
- 2 unused deps: resolved by stdio removal
- 4 root devDeps removed: `@axe-core/playwright`, `@eslint/js`,
  `tsup`, `typescript-eslint` — all redundant at root, workspaces
  have their own declarations
- 3 knip config fixes: `scripts/**/*.ts` and `evaluation/**/*.ts`
  added as entries+project for oak-search-cli (standalone scripts
  not imported by CLI entry)
- 2 ignoreDependencies added with docs:
  `@types/express-serve-static-core` (TS module augmentation),
  `@oaknational/oak-design-tokens` (CSS @import)

**Knip findings after Phase 0**: 53 unused files (down from 96),
630 unused exports (recount after wider scope), 2 unlisted
binaries, ~40 config hints. Zero unused deps/devDeps.

**Config reviewer caught pre-existing entry path bug**
`knip.config.ts` had `src/bin/oaksearch.ts` but actual CLI entry
is `bin/oaksearch.ts` (no `src/` prefix). Fixed during this session.

**Code reviewer caught 2 missed doc references**
`packages/sdks/oak-curriculum-sdk/docs/logging-guide.md` had a
broken link to deleted stdio README.
`docs/architecture/programmatic-tool-generation.md` listed stdio
as a "current" runtime registration surface. Both fixed.

**Process observation: standalone scripts need entry, not just project**
Adding `scripts/**/*.ts` to knip's `project` is not enough — knip
only traces dependency trees from `entry` points. Standalone scripts
invoked via `tsx` (not imported by the main entry) must also be
listed as entries. Project just defines the workspace file set;
entry defines the dependency graph roots.

### Session 2026-04-11j: Knip Phase 1 — triage 53 unused files

**Result: 53 → 0 unused files. Phase 1 complete.**
- Batch A: deleted 38 genuinely dead files (5 sub-groups)
- Batch B: fixed 13 non-standard consumption patterns via `knip.config.ts`
- Batch C: wired `bulk-data-manifest` consumption (was a bug, not dead code)

**Architecture reviewer guidance (Barney + Betty):**
Both agreed: delete barrels 1-5 (dead convenience layers).
Diverged on barrel 6 (`generated/index.ts`):
- Barney: keep it, route through it (generator emits it deliberately)
- Betty: delete it, import directly (coupling trap with heavyweight data)
Decision: followed Barney — barrel is generated, serves as sentinel,
and rewiring is smaller than updating generator + sentinel logic.

**Knip root workspace config:**
Top-level `entry`/`project` fields are ignored when `workspaces` is
defined. Must use `workspaces["."]` for root workspace entries.
This is a knip behaviour, not documented prominently.

**Remaining knip scope:** 614 unused exports, 2 unlisted binaries,
config hints. Phase 2 (exports) is next.

---

### Session 2026-04-11k: Knip Phase 2 + 3 — 850 exports/types → 0, config hints → 0

**Result: 850 → 0 unused exports/types, 43 → 0 config hints. Phases 2 + 3 complete.**

Executed across 4 batches in GO cadence with code and architecture reviewers:
- Batch A: 526 ground-truth barrel findings (scripted barrel trimming,
  generator fix for `TOTAL_LESSON_COUNT`/`GENERATED_AT`, 16 file deletions)
- Batch B: 153 oak-search-cli non-ground-truth (de-exports, dead code
  deletion, TypeDoc re-exports for 9 public API types)
- Batch C: 118 streamable-http + agent-tools + packages (de-exports,
  8 dead auth-response-helpers deleted, barrel trims)
- Batch D (Phase 3): 43 config hints resolved + 14 remaining type
  findings via knip.config.ts cleanup

**Key learnings:**
- TypeDoc entry points must be declared in knip `entry` arrays, not
  just `project` — otherwise types consumed only by doc generation
  appear as false positives
- Removing `export` from a type used in a public function's return
  type breaks `pnpm doc-gen` with a warning — must re-export via
  the TypeDoc entry point chain
- `e2e-tests/**/*.ts` needs to be a knip entry (not just project)
  for streamable-http to capture type consumption in e2e tests
- Knip's redundant-ignore detection is thorough — after Phase 0/1
  fixes, most `ignoreDependencies` entries were stale
- Sub-agents for bulk ripgrep analysis across workspaces massively
  accelerated evidence gathering for 600+ findings

**Phase 2.5 follow-ups (blocking Phase 4):**
1. Consolidate `auth-response-helpers.ts` with `mcp-auth.ts`
2. Restructure ground-truth barrel hierarchy (excessive nesting)
3. Fix schema-emitter to stop generating unused validation schemas
4. Resolve cli/shared barrel (dead-on-arrival, zero importers)

**Process observation: batched GO cadence scales well**
The 4-batch structure (each with ACTION/REVIEW/GATE) kept quality
high across 850 findings. Invoking code reviewers after each batch
caught TypeDoc drift and import cleanup issues early.

---

### Session 2026-04-11l: Knip Phase 4 — gate promotion

**Result: knip promoted to all 4 gate surfaces. Phase 4 complete.**

Added `pnpm knip` to pre-commit, pre-push, CI, and `pnpm check`.
ADR-121 coverage matrix updated with knip row. 7 cross-reference
documents updated. Config-reviewer and docs-adr-reviewer invoked.

**Docs-ADR reviewer caught 2 gaps:**
1. `build-system.md` coverage matrix was missing the knip row
   (the ADR-121 matrix had been updated but the duplicate in
   build-system.md was missed)
2. `CONTRIBUTING.md` `pnpm check` description didn't mention knip

Both fixed immediately. Lesson: when ADR-121 coverage matrix
changes, always update BOTH copies (ADR-121 and build-system.md).

**Config reviewer observation: ordering asymmetry**
`pnpm check` runs knip after turbo (post-build), while CI and
pre-push run knip before turbo (pre-build). Not a bug — knip
analyses source files, not build output — but worth documenting
if the ordering ever matters for codegen-generated entries.

**Parent plan updated:** `enable-knip` in quality-gate-hardening
marked complete. Section 4 text updated to reflect completion.

**Phase 2.5 is next:** 4 follow-ups from Phase 2, each needing
owner decision. This will require a detailed investigation plan
for the next session.

---

### Session 2026-04-12: Knip Phase 2.5 — follow-up implementation

**Result: all 4 Phase 2.5 follow-ups resolved. Knip plan fully complete.**

Implemented the 4 decisions from the prior session's investigation:
- 2.5.1: Deleted `auth-response-helpers.ts` + 2 test files (dead,
  redundant with `check-mcp-client-auth.ts`)
- 2.5.2: No code change — barrel hierarchy kept, GT archive
  retirement tracked as separate future plan
- 2.5.3: Fixed 3 generator files (schema-emitter, type-emitter,
  generate-ground-truth-types), updated 2 test files, regenerated
  6 output files, updated README
- 2.5.4: Closed as no-action (plan was wrong)

**Surprise: plan assumptions were wrong for 3 of 4 follow-ups**
(Captured in prior session's investigation, but worth noting as a
pattern: investigation BEFORE implementation consistently reveals
materially different ground truth than plan assumptions.)

**Surprise: cascading API surface changes from schema de-export**
Removing `AnyLessonSlugSchema` from `schema-emitter.ts` removed
the only consumer of the `allData` parameter in
`emitGroundTruthSchemas()`. This required updating: the function
signature, the generator call site, and 11 test call sites. Also,
regeneration exposed a previously unreported dead export
(`SubjectPhaseMetadata` in manifest generator). Lesson: when
narrowing a generator's output API, always regenerate and run
knip to catch secondary dead exports.

**Process observation: "never edit generated files" is load-bearing**
The entire 2.5.3 footgun existed because Phase 2 hand-trimmed
generated files instead of fixing generators. The fix was
straightforward once the correct approach (edit generators, not
output) was applied. This principle from `principles.md` is not
advisory — it prevents a real class of regeneration footguns.

**Milestone: knip plan fully complete**
All 904 findings remediated. All phases (0-4 and 2.5) done.
Knip is a blocking gate on all four surfaces. The `enable-knip`
item in `quality-gate-hardening.plan.md` is fully closed.

---

### Session 2026-04-12d: Cross-platform discoverability fixes

**Patterns skill made universal across all platforms:**
Added `.claude/skills/patterns/SKILL.md` adapter — the last missing
platform. Also added `Skill(patterns)` to `.claude/settings.json`
allowlist. Patterns skill now discoverable on Cursor, Claude Code,
and Codex.

**Memory section added to AGENT.md:**
All vendors read AGENT.md as the entry point. Previously, the
memory/patterns directory was not linked from AGENT.md — agents
would only find it by following practice-index.md deeply. Added
a "Memory and Patterns" section with direct links to distilled.md,
patterns/README.md, and napkin.md.

**Cross-platform artefact creation recipes documented:**
`artefact-inventory.md` previously listed WHERE things go but not
HOW to create them. Added "How to Create New Artefacts" section
with exact adapter formats for skills, commands, rules, and
sub-agents across all four platforms. This eliminates the need to
grep through existing instances to discover the correct pattern.

**Session-continuation prompt discoverability gap:**
The prompt still says to read it as the first thing, but doesn't
mention the patterns library. The "Ground First" section should
include patterns checking as part of the grounding sequence. Not
fixed this session — minor and not blocking.

---

### Session 2026-04-12c: Plan consolidation and owner decisions

**Owner decisions resolved:**
- Strict end state: all depcruise rules promoted to `error`
  severity (including `no-orphans` from `warn` → `error`). The
  clean baseline is 0 errors, 0 warnings — no warning-level
  rules remain.
- All four gate surfaces: `pnpm check`, pre-commit, pre-push, CI.

**Cursor plan graduated to canonical plan:**
Merged all detailed Phase 0 audit content from
`.cursor/plans/depcruise_phase_0_audit_18246fac.plan.md` into
the canonical plan at `.agent/plans/.../depcruise-triage-and-remediation.plan.md`.
The canonical plan now contains full per-SCC analysis (traced
imports, key tensions, reviewer-endorsed fixes), detailed
orphan inventory (all 43 files classified with paths), hidden
assumptions table, and owner decisions section.

**Session-continuation prompt was stale:**
The prompt still pointed to Phase 0 as next despite Phase 0
being complete. Updated all fields: current state, current
objective, recent surprises, open questions, next safe step.
The "Active Workstreams" section was also stale. Pattern: the
session-continuation prompt tends to lag behind the plan —
always verify both are in sync during handoff.

**No code changes this session** — planning and documentation only.

---

### Session 2026-04-12b: Depcruise plan deep-audit revision

**Key correction: plan must start with assumption verification**
The initial depcruise plan (drafted from a single `pnpm depcruise`
run) jumped straight to config fixes and remediation. User
correctly flagged this as the same anti-pattern that plagued the
knip Phase 2.5 follow-ups — acting on unverified assumptions.

Revised the plan to insert Phase 0: Deep Audit before any code
changes. Added an explicit "Assumptions to Verify" table with 12
specific assumptions (A1-A12), each with risk-if-wrong and
how-to-verify. All subsequent phases (renumbered 1-4) are now
gated on Phase 0's verified evidence.

**Pattern: plans from single tool runs inherit framing bias**
This is now a repeated observation across 3 instances:
1. Quality gate hardening plan (session 2026-04-11g) — planned
   from assumptions, rejected by user
2. Knip Phase 2.5 follow-ups — 3 of 4 assumptions materially wrong
3. Depcruise plan — jumped to remediation without audit

The pattern is clear enough to be a candidate for extraction to
`.agent/memory/patterns/` at next consolidation.

**Confirmed: all knip plans fully complete**
Verified every knip plan across both `.agent/plans/` and
`.cursor/plans/`: 26/26 todos completed, 0 pending. No stale
status anywhere.

---

### Session 2026-04-12e: Depcruise Phases 1-4 execution

**Result: 87 → 0. Depcruise promoted to all four gate surfaces.**

Executed all phases of the depcruise remediation plan in one
session. 44 circular dep errors (7 SCCs) and 43 orphan
warnings (4 categories) resolved to 0. `no-orphans` promoted
from `warn` to `error`. `pnpm depcruise` added to pre-commit,
pre-push, CI, and `pnpm check`. ADR-121 updated.

**Phase 1 — config + dead code (43 warnings → 0)**
Deleted 5 dead files (incl. 2 empty placeholders). Cascading
dep removal: `@elastic/elasticsearch` from oak-sdk-codegen.
Added 3 `exclude.path` entries and 6 `pathNot` patterns.

**Phase 2 — 7 SCCs broken (44 errors → 0)**
- SCC-B1 (20 errors): explicit `AggregatedToolName` union +
  `satisfies Record<AggregatedToolName, ...>` guard. SCC-C
  (2 errors) collapsed as predicted (shared back-edge).
- SCC-A (16 errors): `es-field-types.ts` leaf extraction,
  10 override files rewired.
- 5 small SCCs (6 errors): leaf-type extraction pattern ×5.

**Key architectural decision: explicit union + satisfies**
The `AggregatedToolName` fix reverses the dependency direction
— `definitions.ts` now depends on `types.ts` (framework types
own the contract, consumer provides the data). The `satisfies`
guard is bidirectional: catches both missing map entries and
missing union members. This is architecturally superior to the
previous `keyof typeof` derivation because it resolves the
"Separate Framework from Consumer" violation.

**Reviewer coverage (8 specialist sub-agents)**
- Barney (mid-session + full): COMPLIANT; found 3 stale docs,
  1 import path (fixed)
- Betty (mid-session): COMPLIANT; zero hidden coupling
- Wilma (full): COMPLIANT; logger types.ts growth (monitor)
- Type-reviewer (2 passes): PromptArgs alias (fixed),
  DtcgTokenValue/PairUnits/TokenTier aliases (all fixed)
- Code-reviewer: APPROVED; OtelLogRecord readonly (fixed),
  PromptMessageContent export (fixed), pre-commit --continue
  (fixed), PromptMessage re-export removed
- Assumptions-reviewer: PROPORTIONAL; 4 doc gaps (all fixed),
  static-analysis plan marked SUPERSEDED
- Test-reviewer: 1 useless test file deleted
  (oak-adapter.unit.test.ts)

**Surprises**
- `@elastic/elasticsearch` cascading removal was the only
  unexpected consequence of dead file deletion
- 3 type alias violations found in the new leaf modules by
  type-reviewer — the no-type-aliases principle is absolute,
  even for small utility types like `DtcgTokenValue`
- `oak-adapter.unit.test.ts` contained 3 tests that tested
  local object literals, not product code — deleted

**Pattern: leaf-type extraction for cycle breaking**
The same structural pattern was applied 6 times across 5
packages: extract shared types to a zero-dependency leaf
module, have both cycle participants import from the leaf,
re-export from the original location for API continuity.
This is the standard depcruise cycle-breaking technique.

---

### Session 2026-04-12f: MCP App UI preview regression discovered

**Bug**: MCP App UI renders on `oak-prod` but not on `oak-preview`
(Vercel preview deployment for `feat/gate_hardening_part1`). Tool
call succeeds (41.5 KB returned) but widget doesn't appear. Vercel
logs show GET `/mcp` SSE connection timing out at 300s.

**Irony**: The gate-hardening branch (knip, depcruise) broke a key
feature that the hardened gates didn't catch.

**Root cause (unverified)**: Possibly SSE transport failure, barrel
deletion side-effect, or `_meta` handling change. Phase 0
investigation required before fixing.

**Structural insight — composition test gap materialised**: The
distilled learning at line 151 ("pieces vs composition") predicted
this exact failure class. E2E tests prove individual links
(`_meta.ui` → `tools/list`, widget HTML → `resources/read`) but no
test proves the full MCP client session lifecycle. The gap allowed
39 files of changes (knip + depcruise cleanup) to silently break
the MCP App UI.

**Plan created**: `mcp-app-ui-preview-regression.plan.md` in
`active/`. Four phases: investigate, fix, composition tests, harden.

**Metacognitive observation**: The "pieces vs composition" entry has
been in distilled.md since 2026-04-10 but was never acted on. It
took a real regression to provide the forcing function. Distilled
learnings without enforcement mechanisms are advisory, not
structural. The composition test in Phase 2 is the enforcement.

---

### Session 2026-04-12h: MCP App UI regression — plan overhaul + composition test

**4 specialist reviewers invoked (assumptions, MCP, test, code)**

All four converged on key corrections:
1. The "supertest POST vs SSE transport" framing was overstated —
   existing E2E already parses SSE envelopes. The real gap is the
   full MCP client SDK lifecycle (connect → listTools → readResource).
2. The SDK's `StreamableHTTPServerTransport` does NOT strip `_meta`.
3. The `Omit<Tool, '_meta'>` is compile-time only; not credible runtime cause.
4. Knip/depcruise cleanup was underweight as a hypothesis — user
   confirmed this is the most likely cause.

**Critical test infrastructure finding**: The no-network E2E setup
(`test.setup.no-network.ts`) replaces `globalThis.fetch` with a
blocking stub. The MCP SDK's `StreamableHTTPClientTransport` uses
`fetch` internally (confirmed in SDK source: `(this._fetch ?? fetch)`).
Fix: pass `globalThis.__ORIGINAL_FETCH__` to the transport constructor
(SDK accepts custom `fetch` option), avoiding global state mutation.

**Composition test written**: `mcp-app-composition.e2e.test.ts` with
debug instrumentation. Server-side instrumentation added to
`handlers.ts` (tool registration) and `register-widget-resource.ts`
(widget resource registration). Test exercises full Client SDK
lifecycle against `createStubbedHttpApp()` on random port.

**Test design corrections from reviewers**:
- No `as AddressInfo` → runtime narrowing
- `await once(server, 'listening')` before reading address
- Promisified `server.close()` for clean teardown
- Vacuous pass guard: assert `WIDGET_TOOL_NAMES.size > 0`

**If test passes**: pivot to Cursor-specific or resource-read analysis
**If test fails**: root cause found — fix the server code

---

### Session 2026-04-12g: MCP App UI regression — deep investigation

**Confirmed: regression is branch-code, not environment**
Called `get-curriculum-model` on `oak-local` (local dev server
running this branch). UI did NOT render. Same tool on `oak-prod`
(`main`) renders fine. This eliminates Vercel, network, and Cursor
as variables. The bug is in source control on this branch.

**All existing tests pass — the composition gap is real**
Ran the full test suite for `oak-curriculum-mcp-streamable-http`:
581 of 582 tests pass (1 unrelated timeout in
`register-prompts.integration.test.ts`). `widget-metadata.e2e.test.ts`
passes — it verifies `_meta.ui.resourceUri` is present in the
`tools/list` JSON-RPC response via supertest POST. But the real MCP
client (Cursor) connects via SSE GET + POST, a different transport
path that no test exercises.

**Key diagnostic insight: supertest vs MCP client SDK**
Supertest sends a direct HTTP POST and parses the SSE text envelope.
The real MCP client (`StreamableHTTPClientTransport`) first
establishes an SSE GET connection, then sends POST requests. The
response goes through the MCP SDK's `StreamableHTTPServerTransport`
serialisation. If the SDK's `Tool` schema strips `_meta` during SSE
serialisation, supertest would never notice — it bypasses that layer.

**Suspicious commits narrowed to 3**
- `a03f3b32`: `ToolDescriptor` changed from `extends Tool` to
  `extends Omit<Tool, '_meta'>` — type-level change, but the MCP
  SDK uses Zod schemas for wire serialisation and `Tool` schema
  validation might interact with this
- `23360be7`: 850 unused exports removed (knip Phase 2+3)
- `d74c0b5d`: 87 depcruise violations resolved

**Composition test approach designed**
Use `Client` + `StreamableHTTPClientTransport` from
`@modelcontextprotocol/sdk` against `createStubbedHttpApp()` on a
random port. Call `listTools()` and check `_meta.ui.resourceUri`.
This is both the diagnostic (Phase 0) and the permanent guard
(Phase 2). Full design in the plan.

**Pattern: supertest E2E tests have a transport blind spot**
Supertest tests the JSON-RPC contract but not the SSE transport
serialisation. For MCP servers, the transport layer IS part of the
product contract — `_meta` fields, session lifecycle, and event
streaming all happen there. A test that bypasses the transport
layer cannot catch transport-layer regressions. This may warrant
extraction to a pattern if it recurs.

---

### Session 2026-04-12 (cont): Deep investigation and `_meta` architecture

**Composition test passes — server-side is correct**
The `mcp-app-composition.e2e.test.ts` using real MCP client SDK
(`Client` + `StreamableHTTPClientTransport`) confirms:
- `listTools()` returns `_meta.ui.resourceUri === WIDGET_URI` for
  all tools in `WIDGET_TOOL_NAMES`
- `readResource(WIDGET_URI)` returns HTML with correct MIME type
- Widget HTML fetched from `oak-local` and `oak-prod` via
  `FetchMcpResource` is byte-identical

**Exhaustive git diff: no runtime change in app tool path**
Compared `main..HEAD` for every file in the registration chain:
- `handlers.ts`: the `if (isAppToolEntry)` branch is IDENTICAL
  between main and branch — both use `registerAppTool(server,
  tool.name, { ...config, _meta: { ...tool._meta } }, handler)`
- `listUniversalTools`, `isAppToolEntry`, `register-widget-resource.ts`,
  `application.ts` — all unchanged vs main
- Only the `else` branch (non-app tools) has a committed runtime
  change: `_meta: tool._meta` → `_meta: tool._meta ? { ...tool._meta } : undefined`

**`_meta` architecture finding: scattered with no single source**
- `_meta` values hand-written in 11 aggregated definitions + codegen
- Widget membership duplicated: `WIDGET_TOOL_NAMES` (codegen) vs
  inline `_meta.ui` in each aggregated definition
- Before this session, some tools had `_meta: undefined` — compile
  time did not enforce its presence
- `securitySchemes` was repeated verbatim in every definition
- Codegen `emit-index.ts` stamps `_meta.ui.resourceUri` for generated
  tools in `WIDGET_TOOL_NAMES` — currently dead code (all widget
  tools are aggregated)

**Fix: `AggregatedToolDefShape` now requires `_meta: ToolMeta`**
Changed from optional to required. All 11 aggregated tools now
define `_meta` with `securitySchemes`. This may be the root cause
fix — if some tools having `_meta: undefined` caused the MCP SDK
or Cursor to skip `_meta` processing for the entire tool list.

**Proposed pattern: `buildToolMeta()` factory**
Derives `_meta` from tool name using `WIDGET_TOOL_NAMES.has(name)`.
Eliminates all five architectural problems (duplication, scattered
values, missing enforcement, dead code, DRY violation).

**URI consistency verified**
All 27 files referencing `WIDGET_URI` import the same constant from
`@oaknational/sdk-codegen/widget-constants`. The chain:
`cross-domain-constants.ts` → `generate-widget-constants.ts` →
`widget-constants.ts` (generated) → re-exported by SDK → consumed
by tool definitions, resource registration, and auth bypass.

**`registerAppTool` from ext-apps@1.5.0 normalises `_meta`**
De-minified source: copies `_meta.ui.resourceUri` to legacy
`_meta["ui/resourceUri"]` key. This is the library's backward
compatibility — we don't need it but can't disable it without
patching. Harmless (just adds a redundant key on the wire).

**CRITICAL FINDING: Server is correct, Cursor refuses to render**

The MCP Apps reference host (`ext-apps@1.5.0 basic-host`) connected
to the same local server on `localhost:3333` and **rendered the
widget successfully**. In the same session, Cursor was also
connected to the same server (confirmed via `lsof` — both Cursor
and Firefox had ESTABLISHED connections to port 3333). Cursor
returned tool results but did NOT render the widget.

After disconnecting and reconnecting `oak-local` in Cursor MCP
settings — still no widget.

The widget DOES render in Cursor for `oak-prod` (HTTPS hosted).

**Hypotheses for next session** (in priority order):
1. Check if `oak-local` widget EVER worked in Cursor on `main`.
   If not, this was never a branch regression — it's a Cursor
   limitation with localhost/HTTP servers.
2. If it works on `main`, `git bisect` to find the breaking commit.
3. Investigate Cursor-specific MCP Apps requirements (HTTPS? specific
   capability declaration? stale cache?).

See plan: `mcp-app-ui-preview-regression.plan.md` Phase 3.
