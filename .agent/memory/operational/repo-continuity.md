---
fitness_line_target: 400
fitness_line_limit: 525
fitness_char_limit: 35000
fitness_line_length: 200
split_strategy: 'Archive historical session-close summaries to a companion archive file; keep only live operational state and most recent session summary here'
merge_class: index-narrative-tables
---

# Repo Continuity

Repo-level operational index for active thread state. Historical session-close
prose was archived verbatim during the 2026-05-12 consolidation pass at
[`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md).
Earlier archives remain under [`archive/`](archive/).

## Current State

- Current branch: `feat/mcp-graph-support-foundation`.
- **🛑 PR #108 IS MERGE-BLOCKED ON QUALITY GATES (2026-05-21, Feathered Circling Horizon / `cursor` / Opus 4.7 / `9e1c24`)** — PR #108 (`feat/mcp-graph-support-foundation` → `main`) is failing two quality gates: CodeQL alert #90 (`js/missing-rate-limiting` on `bootstrap-helpers.ts:151`, false-positive on `createRequestLogger` of the same misclassification shape as the already-disposed alert #69 on `createCorrelationMiddleware`) and SonarCloud Quality Gate (40 new issues across 17 rules, 12 unreviewed security hotspots, 6.0% new-code duplication ≥ 3.0% threshold). **The PR must not merge until those gates clear.** Disposition strategy and execution lane: [`pr-108-snagging.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md) — type `quality-fix`, status `planning`, 12 cycles across 3 phases, per-finding ledger inside the plan body, aligned with `docs/governance/sonar-disposition-policy.md` and `.agent/rules/never-disable-checks.md` (no gate-weakening tactics). Cross-referenced as a `🛑 PR #108 MERGE BLOCKER` block at the top of [`active/graph-stack.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md). **Substantive graph implementation work (WS2.2, WS2.3, WS3.3, Inc.1b, Inc.1c, Inc.1d) on this branch is parked behind the snagging plan**: either complete the snagging plan on `feat/mcp-graph-support-foundation` and merge clean, or merge after a green-gate rebase. No code touched this session; analysis-and-plan-authoring only; no commits; no claims opened.
- **2026-05-21 (Cirrus Circling Plume / `claude` / Opus 4.7 / `fba398`, continued — post-team-session strategic-brief authoring under owner direction)** —
  After the team-session closeout, owner directed an ultrathink-level
  analysis of how to throw compute at the remaining substrate +
  delivery sequence (WS2.2 → WS2.3 → WS4.1 → WS4.2 → WS4.3 → WS4.4 →
  WS4.5 → ff1–ff6) without rushing or compromising. Applied
  architectural-excellence lens to six open questions raised earlier;
  resolved most to fact-finding/operational; surfaced one substrate
  architectural amendment (WS4.4 test partition by ownership-of-invariant,
  not by ownership-of-implementation) and four rotating-cast
  coordination-protocol questions (mid-cycle retirement, coordinator
  handoff under token pressure, grounding-cost amortisation,
  comms-events as failure-mode channel). Authored addendum plan at
  `.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/gate-1a-delivery-parallel-execution-addendum.plan.md`
  with 12 frontmatter todos, dependency-graph-dictated 4-round
  structure (~8–11 hours wall-clock through first tool shipped), and
  10 inviolate quality invariants. Also committed the inherited
  working-tree residual from prior 2026-05-21 sessions at `f4ca84f6`
  (Molten WS3.3 adjacency primitives + Pelagic search-cli fixes +
  Torrid agent-tools surface refactor + Celestial start-right-team
  SKILL update + ADR-173 amendment + upstream-api-v0.7.0 plan + thread
  records). Metacognition insight: my own first parallelisation
  proposal pulled WS4.4 forward by deferring T7a smoke-test —
  parallelism-driven re-shape that violated atomic-landing. The
  architectural-excellence lens resolved it to a different re-shape
  (separate type-invariant smoke-test in graph-core from
  instantiation smoke-test in corpus-sdk) that is correct on its
  own merits AND happens to enable the same parallelism. Captured
  for next consolidation as a worked instance of the "good
  architecture vs rushed architecture" distinction.
- **2026-05-21 (Cirrus Circling Plume / `claude` / Opus 4.7 / `fba398`, six-agent team session, closeout owner)** —
  **landed the Inc.1d EEF concurrent-tenant planning amendment-set at commit `0cdaf58c`** (`docs(plans): land Inc.1d EEF concurrent-tenant amendment-set`; 7 files, +657/−129; all pre-commit gates green on first attempt; 87/87 turbo tasks, 28 cached, 1m44s). Team shape: four-slice file-disjoint partition + cross-cutting reviewer + elected gatekeeper. Slice owners: Gilded Beaming Eclipse (`0467d0`, Slice A graph-query-layer.plan.md), Stratospheric Gusting Squall (`cfe7da`, Slice B graph-stack.plan.md), Salty Snorkelling Pier (`5eb191`, Slice C graph-mvp-arc.plan.md + §1a gate-runner + elected gatekeeper), Opalescent Illuminating Galaxy (`2aa615`, Slice D eef-evidence-corpus + portfolio + conservation-map + new eef-first-feature.plan.md). Cross-cutting reviewer: Evergreen Climbing Canopy (`4a365e`) — per-slice PDR-044 vocabulary second-eye on all four slices (all CLEAN) + 8-row bidirectional cross-reference matrix verification + final coherence verdict GO. Coordinator handoff: Stratospheric opened the four-slice partition and routed §1a gate-runner; coordinator role transferred to Cirrus at 19:33Z via explicit active-acknowledgement (owner-corrected timing: pre-positioning is distinct from authority transfer). §1a inherited-tree gate-state at session-open: ALL GREEN per Salty's per-workspace run (agent-tools / search-cli / env / graph-project; 1505 tests passing at HEAD `688ccef2`); cascade-class failure mode cured. PDR-044 vocabulary discipline applied across all four slices + 3 supplements. Mid-session incident: Cirrus accidentally triggered shell command-substitution from markdown backticks in a double-quoted `--body` argument, causing a phantom `git commit` during Salty's gatekeeper-window; pre-commit hook failed on a flaky lifecycle-lease test and aborted; no on-disk damage; captured as rule candidate + `--body-file` CLI evidence point 2. Five peer team-member closeouts received (Stratospheric, Salty, Evergreen, Gilded, Opalescent) — no retained claims. Coordinator-side closeout: thread record refreshed; 5 pending-graduations entries captured (3 coordination patterns from Stratospheric, 1 napkin-refinement for closure-shape vs structural-antonym vocabulary, 1 backtick-substitution rule + CLI evidence point); napkin entry written; entry-point sweep clean.
- **2026-05-21 (Sunlit Weaving Aurora / `claude` / Opus 4.7 (1M) / `a6574f`)** —
  **HTTP MCP test-suite quality pass** in
  `apps/oak-curriculum-mcp-streamable-http`. Triggered by an intermittent
  `Parse Error: Expected HTTP/, RTSP/ or ICE/` flake under `pnpm check`.
  Landed: (1) commit `ab0dac3f` deleted `e2e-tests/header-redaction.e2e.test.ts`
  (per-test comments admitted it could not verify redaction; real proof
  at `src/logging/header-redaction.unit.test.ts`, 503 lines). (2) Three
  architectural shared-state fixes: deleted dead `createMcpReadinessMiddleware`
  in `src/app/bootstrap-helpers.ts` (leaked `setTimeout` per request,
  racing `ready: Promise.resolve()`); made `rateLimiterFactory` required
  on `CreateAppOptions` (production callsites inject
  `createDefaultRateLimiterFactory` explicitly; tests use new
  `createNoOpRateLimiterFactory` in `e2e-tests/helpers/test-config.ts`);
  encapsulated `let appCounter` from `application.ts` into private
  module-scoped counter in `bootstrap-helpers.ts`. (3) Plan landed at
  `.agent/plans/sdk-and-mcp-enhancements/current/http-mcp-test-suite-improvements.plan.md`
  covering 7 follow-on cycles (proportionality pushdown, immediate-fail
  assertions, audit-shaped duplicate deletion, out-of-process E2E
  decision, appId elimination, security-expert Sentry confirmation).
  Reviewer transcripts: test-expert `a7b66b32ca44df2e8`, code-expert
  `a2245c63224d1fbe5`. Owner correction absorbed: supertest-based e2e
  files in HTTP-transport workspaces are correctly classified as e2e
  per `testing-strategy.md`'s "runner harness boots the system" rule;
  STDIO-transport's "separate process" requirement does not generalise.
  E2E suite duration dropped from ~5s to 3.09s (consistent with the
  leaked-timer fix). Charcoal Searing Ember handling parallel planning
  work.
- **2026-05-21 (Torrid Glowing Flame / `claude` / Opus 4.7 (1M) / `5ab0ec`, second round of the same session)** —
  **gate-cure pass + reviewer absorption on the knip / depcruise / markdownlint
  surface that was red at the end of the first round.** Owner-directed
  six-file cure set: (1) dropped `export` on `DEFAULT_BULK_DIR_NAME`
  (`apps/oak-search-cli/src/cli/shared/resolve-bulk-dir.ts` — internal use
  only); (2) dropped `type EventView` re-export from
  `agent-tools/src/collaboration-state/comms-use-cases.ts` AND dropped
  `export` from the source declaration in `comms-relevant-events.ts`
  (type used internally only across 7 sites in the source file); (3)
  moved `DirectedInboxDrainResult` interface from `comms-use-cases.ts`
  to the shared `types.ts` and updated two import sites — this broke a
  pre-existing `no-circular` depcruise cycle exposed once the knip
  failure cleared (the cycle was type-only:
  `comms-relevant-events → comms-use-cases → comms-relevant-events`,
  with `comms-relevant-events` importing the result type from
  `comms-use-cases` and `comms-use-cases` re-exporting the function
  that returns it); (4) markdownlint MD004 cure on two thread records
  — `markdownlint --fix` was misinterpreting `+` commit-ref separators
  in prose as bullet markers; replaced with commas. Then both
  reviewers (code-expert + type-expert) dispatched on the cure set;
  two convergent follow-ups absorbed: (a) merged the duplicate
  `./types.js` import declarations in `comms-relevant-events.ts`
  (one combined import with seven named members); (b) reshaped the
  TSDoc on `DirectedInboxDrainResult` to lead with the type contract
  (`output` is formatted text; `eventCount` is drain count) and move
  the file-structure rationale (cycle prevention) to `@remarks`.
  **knip and depcruise are now green**; one residual prettier-check
  warning remains on a peer-agent file
  (`apps/oak-curriculum-mcp-streamable-http/src/app/bootstrap-helpers.ts`
  — not from my session). Owner direction: skip further gate
  verification this session. **Reviewer findings flagged but not
  actioned (pre-existing, out of scope)**: `BulkDirError` not exported
  from `resolve-bulk-dir.ts` (consumers can narrow by `.type` but
  cannot name it); throw-paths in `comms-use-cases.ts` violate the
  Result-pattern principle per `principles.md` (pre-existing standing
  concern, not introduced by this cure). The first round's planning
  amendment set (11 plan/ADR files) is unchanged in the working tree
  and ready for refinement by Charcoal Searing Ember per the owner's
  handoff direction.
- **2026-05-21 (Torrid Glowing Flame / `claude` / Opus 4.7 (1M) / `5ab0ec`)** —
  **EEF Inc.1d sequencing pull-forward planning amendment set authored
  across 11 plan/ADR surfaces; NO source code changed.** Owner-directed
  sequencing change moves the EEF strands adapter into a new graph-stack
  Inc.1d sub-increment as a concurrent tenant of `graph-corpus-sdk`
  alongside the Threads adapter (per ADR-173 §First-wave ingestion scope
  2026-05-21 amendment), enabling the first user-facing EEF MCP feature
  to ship at a new MVP-arc gate-1a ahead of substrate completion without
  scope reduction. Amendment set: ADR-173 (workspace #6 Inc.1 activation
  - §First-wave ingestion scope + §Corpus source authority +
  §Consequences); graph-stack.plan.md (WS4.4 + WS4.5 todos at
  `sub_increment: 1d`); graph-query-layer.plan.md (T2 interface home
  correction to `graph-corpus-sdk`; `findByTag` signature uniformised to
  `Result<readonly TNode[], FindByTagError>`; per-adapter sequencing
  notes on T3/T4/T5); eef-evidence-corpus.plan.md (new `t6a-explore-tool`
  todo for the gate-1a first-feature tool `eef-explore-evidence-for-context`;
  §Gate grouping table mapping t1–t20+t6a); graph-mvp-arc.plan.md (gate-0/
  gate-1 split into gate-0a/gate-1a/gate-0b/gate-1b; sequencing diagram
  restructured); graph-portfolio-index.md (MVP arc table; Foundation
  ingestion-scope row 4); high-level-plan.md (combinatorial-arc activation);
  graph-combinatorial-arc.plan.md (substrate_floor + promotion_trigger
  updated to gate-1a); oak-kg-threads-surface.plan.md +
  oak-misconceptions-subgraph-mcp-surface.plan.md +
  oak-misconceptions-eef-cross-corpus-surface.plan.md (gate-name
  propagation; parallel-safety updated). Both reviewers ran (code-expert
  - docs-adr-expert); all 5 findings absorbed (2 docs-adr MUST-FIX on
  ADR-173 singular-corpus contradictions; 1 code-expert CONCERN on
  findByTag Result-discipline tension; 2 code-expert NITs on
  FieldPredicate semantic-collision propagation + portfolio-index
  Foundation row staleness). Working tree carries +2035/-249 lines net
  across 11 files plus thread records, napkin entry, and one comms event.
  **Non-negotiable architectural commitments declared at gate-1a**: full
  GraphView<TNode, TEdgeType> interface (all 7 method signatures, all 5
  unimplemented operations as typed `NotImplementedYet` Result stubs);
  T7a DeepKeyPath compile-time smoke-test (array-stop discipline);
  structural citation/caveat/freshness envelope at the tool boundary;
  ADR-175 freshness CI gate (180-day binding); ADR-157 `eef-*` namespace
  - `_meta` attribution; Sentry telemetry seam pattern; atomic TDD
  landing; `graph-corpus-sdk` as the long-term home for the EEF adapter
  (no transient stub in `oak-curriculum-sdk`). Net additional work over
  the unsplit sequencing roughly +10–15% (ADR-123 amends twice; T7/T19
  extend across two passes), accepted per owner direction as the price
  of earlier first-feature delivery without future drift. **Cascade
  status**: Opalescent Twinkling Supernova's session cleared the v0.7.0
  upstream-API cascade earlier today (3 commits b1afd5bf/5613eee4/
  8fcd3200); my session is downstream of that clear and adds
  planning-only amendments to the (post-cascade) feature branch.
  **`pnpm check` gate**: known red on two pre-existing peer-agent knip
  violations (`DEFAULT_BULK_DIR_NAME` in Pelagic's bug-fix branch
  uncommitted in `apps/oak-search-cli/src/cli/shared/resolve-bulk-dir.ts:96`;
  `EventView` re-export in
  `agent-tools/src/collaboration-state/comms-use-cases.ts:8`). Both pre-date
  my session; neither caused by planning amendments. Per
  `all-quality-gates-blocking-always`, this session does NOT declare
  handoff complete in the cleanliness-gate sense; surfacing the residual
  red to owner. **Next session entry shape**: pick up refining the
  amendment set, dispatch the three remaining specialist reviewers
  (type-expert at WS4.4 authoring time — load-bearing for the
  `NotImplementedYet` variant typing + DeepKeyPath array-stop discipline;
  architecture-expert-betty for the GraphView-in-`graph-corpus-sdk`-vs-
  `graph-core` boundary question; assumptions-expert for the
  sparse-relations carry-over from the 2026-04-30 verdict). Owner may
  also choose to commit the amendment set ahead of further reviewer
  cycles. Working tree files mine: see `git diff --stat HEAD --`
  enumeration in shared-comms-log entry at 2026-05-21T15:31:49Z.
- **2026-05-21 (Opalescent Twinkling Supernova / `claude` / Opus 4.7 (1M) / `5c3963`)** —
  **upstream API v0.7.0 alignment landed + schema-flow cleanup + two future plans**.
  Three commits on `feat/mcp-graph-support-foundation`:
  (1) [`b1afd5bf`](https://example/commit/b1afd5bf) `chore(sdk): update repo for upstream
  API v0.7.0` — 15 codegen artefacts + 7 search-cli source/test files + 3 JSON fixtures
  - 1 curriculum-sdk test (26 files; +1286/-619).
  (2) [`5613eee4`](https://example/commit/5613eee4) `refactor(search-cli): remove
  hardcoded slug oracle and dual-path facet emission` — deletes `KNOWN_EXAM_BOARDS`,
  `parseExamBoardFromSlug`, `Ks4Option`/`extractKs4Option`/`SubjectSequenceInfo.ks4Options`
  dead surface, hardcoded `hasKs4Options: false`, and the live-API sequence-facet
  emission path. Bulk pipeline is now sole emitter of `oak_sequence_facets` docs
  (13 files; +108/-569). 1001/1001 search-cli + 728/728 curriculum-sdk tests pass.
  (3) [`8fcd3200`](https://example/commit/8fcd3200) `docs(plans): add search-cli
  ingestion consolidation strategic brief` — new future plan
  [`search-cli-ingestion-pipeline-consolidation.plan.md`](../plans/architecture-and-infrastructure/future/search-cli-ingestion-pipeline-consolidation.plan.md)
  paired with cross-references in/out of
  [`bulk-schema-driven-code-generation.md`](../plans/semantic-search/future/02-schema-authority-and-codegen/bulk-schema-driven-code-generation.md).
  Behaviour-failure pattern caught and corrected this session: **rounding
  principle-driven work to gate-green work under cognitive load** — corrected
  three times by owner ("ceremony" / "made-up cascade phrase" / "dead code never
  okay, hardcoded values are antithesis of schema-first"). Each correction landed
  the next principle-aligned cut. No `--no-verify` invoked; all gates green at
  every commit. Working tree carries 60 uncommitted files belonging to other
  agents' in-flight work — none mine, not closed by this session.
  **Cleanliness gate red at session close**: `pnpm check` exits 1 on two knip
  unused-export violations in uncommitted peer-agent work — neither caused by
  this session. (1) `DEFAULT_BULK_DIR_NAME` exported from
  `apps/oak-search-cli/src/cli/shared/resolve-bulk-dir.ts:96` (Pelagic's
  bug-fix branch); used internally only — drop `export`. (2) `EventView`
  re-exported from `agent-tools/src/collaboration-state/comms-use-cases.ts:8`
  (pre-existing); internally referenced only — drop the re-export OR drop
  `export` on the source definition in `comms-relevant-events.ts:26`. Both
  fixes are surface-level export-keyword removals. Handoff not declared
  complete per `all-quality-gates-blocking-always`; surfacing for owner
  direction.
- **2026-05-21 (Molten Igniting Hearth / `claude` / Opus 4.7 (1M) / `078515`)** —
  **three-agent team session on `connecting-oak-resources`; NO graph product
  code landed; upstream-API v0.7.0 cascade discovered + cascade-clear plan
  authored**. Agents: Celestial Glimmering Moon `46d23a` (WS2.2 + gate-running),
  Molten Igniting Hearth `078515` (WS3.3), Pelagic Sailing Beacon `f72405`
  (Inc.1a gate-sweeper + WS2.3 scout + reviewer cadence). Rendezvous resolved
  via comms-event cycle-collision protocol (earliest-timestamp wins per §3 of
  `start-right-team` First Moves). Mid-session **cascade discovered**: the
  dirty SDK codegen tree inherited from `84638bc9` is an intentional upstream
  API v0.6.0 → v0.7.0 bump (subject path-param enum constraint; `ks4Options`
  removed from `sequenceSlugs[]`; `ks4ProgrammeFactors` added as required on
  `/subjects/{subject}` response); 5 search-cli type errors + 2 lint errors +
  1 curriculum-sdk middleware-test failure cascade locally. Per AGENT.md
  Cardinal Rule, codegen + workspace alignment is one atomic operation. Plan
  authored at
  [`upstream-api-v0.7.0-alignment.plan.md`](../plans/sdk-and-mcp-enhancements/current/upstream-api-v0.7.0-alignment.plan.md)
  with 4 workstreams and 8 explicit assumptions. **All commits blocked** on
  owner authorisation of A1 (v0.7.0 intent confirm) + chore(sdk) commit
  shape. **WS3.3 atomic bundle ready-to-commit** in Molten's working tree
  (3 files: `packages/libs/graph-project/src/adjacency/index.ts`,
  `src/adjacency/index.unit.test.ts`, `src/index.ts` +1 line; 22 vitest
  green; in-cycle reviewers absorbed — type-expert GO, architecture-expert-
  barney KEEP-SEPARATE on the three-barrel split, test-expert GO-WITH-
  CONDITIONS absorbed). Team coordinated cleanly via comms substrate through
  the all-quality-gates-blocking surfacing — no agent attempted
  `--no-verify` or bypass. **Behaviour-failure entries captured in napkin**:
  (a) `bypass-as-progress` impulse when shell argv long-body comms-append
  failed (Celestial; owner caught); (b) `preparation-as-progress` during
  plan authoring (Celestial; owner caught); (c) honesty-correction on
  overstated foundation-completeness in initial team-start broadcast
  (Molten; self-corrected mid-session before any commit attempt). All
  three agent sessions closed; no retained claims; Molten's working-tree
  WS3.3 files remain in the tree for the next agent to pick up after the
  cascade clears. Inc.1a remaining cycles unchanged at 3 (WS2.2, WS2.3,
  WS3.3); WS3.2 LANDED `abe6fcb3` (Foamy, 2026-05-21 morning) remains
  the most-recent Inc.1a landing.

- **2026-05-21 (Fiery Firing Cinder / `claude` / Opus 4.7 (1M) / `40c178`)** —
  **two-agent collaborative session, empirical-test outcome WORKING**.
  Session opened as the owner-directed two-Claude empirical test of the
  WS2.2 ↔ WS3.2 parallel pair on the `connecting-oak-resources` graph thread.
  Both agents (Fiery Firing Cinder `40c178` + Foamy Charting Fjord `86dbd1`)
  reached for WS3.2 in their team-start broadcasts; first-to-claim deferral
  resolved cleanly (Foamy 16 seconds ahead). Mid-session pivot per owner
  direction: paused WS2.2 work to encode the **all-channels-matter principle**
  in the canonical `agent-tools` comms commands — *the comms event stream is
  canonical truth; broadcast, group, directed, and lifecycle messages are all
  valid views; all matter*. **Commits this session**: `a9d0b8cf` (Fiery,
  `feat(agent-tools)`: all-channels comms CLI + SKILL §0 amendment + 14 new
  tests), `abe6fcb3` (Foamy, `feat(graph-project)`: WS3.2 toPropertyGraph
  round-trip projection + invariant #6 contract test, 11 tests), `35b49858`
  (Foamy, `chore(plan)`: WS3.2 landing record). Inc.1a remaining: 3 cycles
  (WS2.2, WS2.3, WS3.3). **Staged-only-gates P0 defect re-fired empirically**:
  Foamy's first WS3.2 commit attempt was blocked by Fiery's dirty
  comms-use-cases.ts at 415 lines (max-lines 250) via the repo pre-commit
  hook's whole-tree lint scan, even though the file was entirely outside
  Foamy's staged bundle; retried ~30s later after Fiery refactored to 222
  lines. Lucky-timing pass; remains the named structural P0 in
  pending-graduations. **Memory-scope clarification landed**:
  `feedback_worktree_isolation_unreliable` is scoped to Agent-tool
  `isolation: "worktree"` sub-agent dispatch only; shared-checkout
  two-main-session collaboration is a distinct empirical class which today's
  evidence confirms WORKS. **Honest scope flagged for follow-up**:
  two-participant invariant for narrative-directed events not yet refused at
  write time; `[SYNC]` view not yet wired (schema has no urgency
  representation). Foamy closed at 09:02:30Z; Fiery solo for the closeout.
- **2026-05-21 (Uplifted Swooping Wing / `claude` / Opus 4.7 (1M) / `8d9999`)**:
  WS1.6 vocab registry LANDED at `3add41f9` (seven standard W3C/community
  vocabularies — RDFS, SKOS, PROV-O, DCTERMS, OWL, SHACL, schema.org — as
  file-per-vocabulary const-typed NamedNode tables, every entry constructed
  via `DataFactory.namedNode()` for single canonical construction path; byIri
  reverse-lookup; `@oaknational/type-helpers` added as dep; 20 unit tests
  including type-level RDFS.label literal-narrowing assertion and
  cross-namespace collision invariant; CURRIC + EEF deferred to WS4.2 / EEF
  corpus plan when source IRIs are pinned). WS3.1 graph-project scaffold
  LANDED at `84bfffa5` (workspace + three reserved sub-path barrels —
  `./property-graph` types, `./projection` toPropertyGraph, `./adjacency` —
  three-barrel split keeps adjacency dependency-direction clean;
  graph-project added to `FOUNDATION_LIB_PACKAGES` with boundary tests
  updated). Two lifecycle commits `db9d2e60` (WS1.6 plan plus napkin entry
  capturing decision-moment heuristic candidate) and `8e441bd0` (WS3.1 plan
  plus parallel-pair boundary marker). Inc.1a remaining: 4 cycles (WS2.2,
  WS2.3, WS3.2, WS3.3). **First parallel graph tooling work boundary now
  open**: WS2.2 ↔ WS3.2 are dispatchable; their file scopes are empirically
  disjoint, both depend on landed WS1.3, reviewer dispatch is independent.
  Owner direction at close: next session is two-agent collaborative Claude
  on the parallel pair — empirical test of intra-vendor multi-agent
  collaboration shape. **Owner correction on reasoning hygiene received**
  during dispatch-shape verdict: plans are records of past reasoning, not
  evidence; memory entries about reliability issues are flags-to-verify
  not permanent prohibitions; "preferred / forbidden" dogma vocabulary
  closes inquiry. Captured in napkin (2026-05-21 entry). Decision-moment
  heuristic candidate (single decision-time heuristic — long-term
  architectural excellence — may subsume many topic-decomposed rules at
  fire time) captured for promotion on third instance or owner direction.
- **2026-05-20 (Shaded Creeping Cloak / `claude` / opus-4-7-1m / `4ef359`)**:
  multi-commit disposition + reviewer dispatch + WS0 sign-off + WS1
  opening session continuing from Stormy Plumbing Atoll's under-reported
  handoff. Commits in order: `e0e9ad0d` chore(sdk-codegen) upstream
  schema-hash refresh; `2d38cb27` chore(continuity) corrected handoff
  bundle plus closure-pressure research/exploration artefacts plus
  session-open comms event; `ccfe8948` refactor(graph-core) absorbing
  4 of 5 WS1.5 reviewer findings (D1 typed `TermReconstructionError` +
  sibling-file extraction; D2 exhaustive switches with default-never;
  N1 redundant utf8 dropped; N2 ambient `algorithm` literal-narrowing
  reverted per type-expert verdict); `db5b8bc0` docs absorbing N3
  (ten Class B line-by-line dispositions); `21579675` chore(continuity)
  full disposition recorded; `45e54736` chore(consolidation) napkin +
  pending-graduations refresh with over-correction-during-absorption
  candidate; `c3627b69` docs(graph-core) TSDoc backfill on
  term-reconstruction helpers; `340bdbda` chore(napkin) capture of
  review-as-re-decision failure mode after owner correction "that isn't
  a decision, that is hand wringing"; `4025b795` chore(continuity)
  session handoff close; `ee06a682` chore(consolidation) second pass
  promoting review-as-re-decision candidate + absorption-failure-mode
  family observation; `5a55fa4d` chore(plans,memory) absorbing
  architecture-expert-fred condition 1 (manifest.json:200 is WS3-coupled
  not WS4) plus recording four owner-parsed decisions. All 5 previously
  under-disposed WS1.5/WS0 reviewer findings disposed via absorb.
  **Late-session decision arc**: owner directed reviewer dispatch on the
  WS0 ledger; assumptions-expert returned APPROVE; architecture-expert-fred
  returned GO-WITH-CONDITIONS with condition 1 absorbed and condition 2
  (missing ADR-125 citation) invalid (ADR exists at
  125-agent-artefact-portability.md). Owner signed off "Fine, consider it
  approved" and authorised WS1 opening. WS1 §Register Presence amendment
  landed in working tree (Intended boundary + Claim status fields
  replacing Claimed paths; singleton-lane rendezvous rule; role-labels-
  as-examples wording) but the first-overlap response naming is owed for
  next session per owner direction "save implementation for the next
  session, keep any you already have but flag for review". Authorisations
  also recorded: PDR-044 amendment (draft now); absorption-failure-mode
  family PDR with three children closure-pressure/over-correction/
  re-litigate (draft now). Parks: knowledge-flow pipeline-mechanisms
  plan and closure-pressure 10-todo exploration both parked until graph
  tooling resumes.
- **2026-05-20 (Stormy Plumbing Atoll / `claude` / opus-4-7-1m / `2e2764`)**:
  WS1.5 RDFC-1.0 canonicalisation landed at `ebd0e8dc` (graph-core canon
  module; rdf-canonize@^5.0.0 added; 5 atomic tests + 2 absorbed-from-review
  for 7 total). WS0 disposition ledger for singleton-lane remediation landed
  at `8227d3f7` as companion report. Pre-work residue commit `4ffef192`.
  Continuity commit `5f1551c3` UNDER-REPORTED reviewer-finding disposition
  state. Owner probing during closeout surfaced a closure-pressure
  rationalisation failure mode; preserved in
  [`closure-pressure-and-workflow-composition-2026-05-20.md`](../../research/agentic-engineering/closure-pressure-and-workflow-composition-2026-05-20.md)
  (research) and
  [`closure-pressure-remediation-design-space.plan.md`](../../plans/agentic-engineering-enhancements/future/closure-pressure-remediation-design-space.plan.md)
  (exploration plan with 10 todo questions). The 5 under-disposed reviewer
  findings (D1, D2, N1, N2, N3) carried into the next session and have
  since been disposed — see the 2026-05-20 Shaded Creeping Cloak entry
  above.
- **2026-05-19 (Shaded Passing Candle)**: broken/accelerator lens applied
  to all sequenced work for graph-multi-vendor priority (Claude + Codex,
  most multi-agent yet). Token-remediation program advancement rule
  superseded for graph priority. Three gating plans flipped to
  decision-complete: singleton-lane remediation (lean scope WS0+WS1+WS2+WS3
  with WS3 absorbing the full-tuple identity-filter widening),
  graph-query-layer (arch-session conclusions approved), graph-stack
  Inc.1a/1b (already active). Liveness-floor plan deferred to `future/`
  with Phase 2 absorbed into singleton-lane WS3. New reachability invariant
  documented at `.agent/plans/README.md`; new portable reference
  `.agent/reference/comms-watch-mechanism.md` landed. Commit `3ef0a23a`.
  Next safe step: WS0 baseline disposition on singleton-lane, in parallel
  with unblocking graph-stack WS1.5 lockfile collision.
- **2026-05-17 (Solar Orbiting Asteroid)**: cross-thread program
  Interrupt Log entry 2026-05-14 #2 (upstream Oak API schema
  adoption + gate-green cleanup) **resolved at `ee41cd49`**;
  `pnpm check` fully green for the first time this branch
  (100/100 turbo tasks). Seven commits this session, each
  unmasked the next downstream gate as its upstream gate cleared:
  knip config gap → practice-fitness barrel slim →
  collaboration-state barrel slim → `test-coverage-review-lens`
  pattern → e2e file deletions (18 tests, duplicates of existing
  unit/integration coverage) → two pre-existing circular type
  imports broken (graph-core/jsonld and agent-tools/tui) →
  program plan interrupt closure. Step 2 (singleton-lane
  remediation) opens next session.
- The branch-primary lane remains `connecting-oak-resources`; its detailed
  state lives in
  [`threads/connecting-oak-resources.next-session.md`](threads/connecting-oak-resources.next-session.md).
- The Practice/tooling substrate lane for this branch remains
  `agentic-engineering-enhancements`; its detailed state lives in
  [`threads/agentic-engineering-enhancements.next-session.md`](threads/agentic-engineering-enhancements.next-session.md).
- Cost-of-collaboration P0 implementation is complete. Direct evidence:
  [`.husky/pre-commit`](../../../.husky/pre-commit) now routes staged
  formatting and Markdown checks through `agent-tools:repo-check` while keeping
  shell lint and Turbo `type-check lint test` in the pre-commit broken-code
  guard. Knip and depcruise are now classified as higher-standard gates owned
  by pre-push, `pnpm check`, and CI rather than the commit boundary.
- Cost-of-collaboration P0.QG has new evidence from the Kilned Brazing Forge
  pass: staged Prettier/Markdownlint regression coverage landed under
  `agent-tools/tests/repo-check.integration.test.ts`, the `repo-check` dry
  graph now matches root `pnpm check` by using `lint` rather than `lint:fix`,
  and a warm `pnpm check:profile` completed green in 130561 ms. Hushed
  Shrouding Mist then disposed the suspected flaky-test candidates as not
  reproduced and captured representative busy-checkout green baselines:
  cold-like `.logs/check-profiles/check-profile-2026-05-12T07-33-57-773Z.json`
  at 147613 ms and warm
  `.logs/check-profiles/check-profile-2026-05-12T07-36-18-375Z.json` at
  131695 ms. P0.QG is complete: trigger contract, pre-push/CI assurance
  rebalance evidence, profile hardening, and post-change measurement are
  recorded in the cost-of-collaboration plan.
- The `pnpm check` profiling brief has a durable deep dive:
  [`pnpm-check-profiling-deep-dive-2026-05-12.md`](../../plans/agent-tooling/pnpm-check-profiling-deep-dive-2026-05-12.md).
  The final full-profile attempt reached the real workload and failed on
  `@oaknational/oak-curriculum-mcp-streamable-http#test` at
  `src/correlation/middleware.integration.test.ts:203`; the owner subsequently
  reported multiple green full `pnpm check` runs, so this is historical profile
  evidence rather than the current blocker.
- [`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md)
  now contains explicit P0 quality-gate performance tasks: baseline/unblock,
  trigger-contract, staged content scanners, pre-push/CI rebalance, profile
  hardening, and post-change measurement.
- Owner live change on 2026-05-12: root `pnpm check` has moved its lint,
  Markdown, and format proof steps to non-mutating commands. The next
  quality-gate baseline should verify and measure this before further tuning.
- P0, P-Foundation, P1, and P2 have landed. The Agent-tools hot collaboration
  scripts now route through the built unified `agent-tools` entrypoint without
  rebuilding on every invocation, `collaboration-state comms direct/reply` now
  author directed messages without hand-written JSON, and
  `collaboration-state comms watch` now provides a long-lived directed-message
  watcher with `fs.watch` plus polling fallback. P1 landed at `f88d0d67` after
  the owner gave fresh one-commit `--no-verify` authorisation because unrelated
  dirty `codex-exec` work blocked the repo-wide pre-commit hook; focused B-11
  validation had passed. P2 landed at `0d3af914`; its collaboration closeout
  state landed at `a2845659`; P3 commit-queue enforcement landed at
  `c083a1ab`. P4 identity disambiguation / active-agent visibility landed at
  `1bb369a5`; its post-P4 knip unblock landed at `730766ad`.
  `claims active-agents` now exposes active/stale/inactive/uncertain
  visibility, and write paths guard live routing-tuple collisions.
  Owner-requested collaboration TUI work is captured as pending P8 in the same
  plan, now sequenced immediately after P5. P8 is mandatory, not optional
  polish: the live TUI is the human-visible proof surface for this
  cost-of-collaboration arc.
  State/memory files remain always commit-includable when dirty; owner
  clarified on 2026-05-12 that every commit should include current memory/state
  files.
- P5 unified comms storage/parser/renderer migration landed at `30c8ad15`,
  with collaboration closeout at `6a1d8d9e`. Owner review then corrected the
  completion claim, and the follow-up P5 DI/no-IO boundary repair landed at
  `07ffee1d` with collaboration closeout at `d45944b4` and napkin note at
  `16425adf`. P5 is now complete: direct comms use cases can be invoked with
  simple fakes, imported comms commands do not acquire production IO defaults,
  and filesystem/stdout/watch wiring lives in CLI composition. Mandatory P8
  live collaboration TUI is now active and remains open: the current foundation
  starts, refreshes, shows inactive agents, has sensible defaults, and has
  distinct unit/integration/E2E/smoke proof surfaces. Operator-value signals
  landed at `2791be3c`, and the smallest interaction-hardening slice landed at
  `6e804485`, but P8 completion still requires attention workflow, reader
  resilience, remaining boundary review, and full `P8-A1` through `P8-A4`
  proof.
- The owner-directed consolidation drain of `repo-continuity.md` and
  [`pending-graduations.md`](pending-graduations.md) is complete for this
  pass: historical closeout prose was archived, the live state was preserved,
  the pending-graduations due index was reconciled, and ADR/PDR promotion
  decisions were surfaced explicitly.
- Conservation-first consolidation advanced again on 2026-05-12: the
  distilled-stage and `pending-graduations.md` passes are complete. The
  2026-05-14 Sylvan Budding Forest deep-dive then rotated the active
  napkin (CRITICAL → fresh; substance preserved in `distilled.md` + the
  `napkin-2026-05-14.md` archive). The next staged consolidation session
  should process `practice-bootstrap.md`.
- Next `agentic-engineering-enhancements` implementation continuation is
  **Step 2 — singleton-lane remediation** of the cross-thread
  [`token-remediation-p8-parallel-program.plan.md`](../../plans/agentic-engineering-enhancements/current/token-remediation-p8-parallel-program.plan.md).
  Step 1 (token work) closed at the WS2 boundary on 2026-05-14: WS1 landed at
  `7a050c2a`; WS2 token-frontmatter zone classification landed at `72d31ca8`
  with ADR-144 amended in place; the program snapshot updated at `737942c0`.
  First sub-step of Step 2 is owner/reviewer review of
  [`start-right-team-singleton-lane-remediation.plan.md`](../../plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md);
  the plan is **not decision-complete** and must promote before WS execution.
- Completion-claim proof pipeline is now a queued agentic-engineering lane.
  Verdant Foraging Copse authored the findings report, executable plan, thread
  routing, and the first small skill amendment on 2026-05-13. The immediate
  next execution step is WS1 in
  [`completion-claim-proof-pipeline.plan.md`](../../plans/agentic-engineering-enhancements/current/completion-claim-proof-pipeline.plan.md):
  add the `completion-claims-must-match-plan` rule and smallest `jc-plan`
  proof-contract/template amendment. Do not start `agent-tools` code until the
  plan's WS4 bridge creates or amends the owning `agent-tooling` execution
  surface.
- External-substrate learning is now a future strategic-learning lane, not an
  implementation lane. The source-neutral study, companion non-plan insights
  note, and
  [`external-skills-substrate-learning.plan.md`](../../plans/agentic-engineering-enhancements/future/external-skills-substrate-learning.plan.md)
  route the work; this landed at `289f190b`. The plan is decision-complete for
  strategic routing but not ready for execution; the first executable slice is
  candidate-register creation plus Practice-fit review for C1/C2 only, after
  the recorded readiness gates are satisfied. The same closeout also landed
  `92826c91` context-cost reviewer hardening, `41acffcc` token-measurement
  plan routing, and `2ee8905d` doctrine/skill graduations.
- `connecting-oak-resources` lane advanced through multiple 2026-05-12 graph
  foundation commits. Holistic Inc.1a re-plan landed at `f73c42f5` (Clouded
  Vaulting Squall / `claude` / opus-4-7-1m / `866472`): WS1.4+WS1.5 collapsed,
  WS1.8 GraphDocument deferred to Inc.2 with retrospective-review tripwire,
  WS2.1/WS3.1 scaffold serialisation recorded, and WS3.3 adjacency scope
  sharpened. WS1.1 (`ad2abb69`), WS1.2 (`1885fbcf`), WS1.3 (`87e21125`),
  WS2.1 (`0f895070`), WS1.6 prep (`f36f98b1`), and WS1.4 (`95f42cb7`) are now
  landed. Luminous Threading Asteroid's closeout at `0d6f080a` records WS1.4
  coordination evidence: Solar support plus type/assumptions/test review
  resolved test classification, graph-core no-I/O remote-context guarding,
  Oak-specific fixture semantics, jsonld.js v9 wording, and typed
  runtime/options wrapper. Next graph implementation choices are WS1.5 canon,
  WS1.6 vocab implementation after the prep-note owner decisions, WS2.2
  jsonld-compatible ingestion, or WS3.1 graph-project scaffold after a fresh
  root-file check.

## Active Threads

A **thread** is the continuity unit. Full identity tables and lane state live in
each thread record; this table is the repo-level index.

| Thread | Purpose | Record | Latest identity |
| --- | --- | --- | --- |
| `main-critical-sonar-remediation` | Sonar remediation | [record][main-critical] | Stormy / `claude-code` / `228bc5` / 2026-05-06 |
| `observability-sentry-otel` | Sentry/OTel integration | [record][observability] | Umbral Creeping Night (commit-only) / `claude-code` / opus-4.7 / `188baa` / 2026-05-10 |
| `agentic-engineering-enhancements` (alias: "agent communication improvements") | Practice continuity + agent-tools improvement | [record][agentic] | Torrid Glowing Flame / `claude` / Opus 4.7 (1M) / `5ab0ec` / 2026-05-21, Fiery Firing Cinder / `claude` / Opus 4.7 (1M) / `40c178` / 2026-05-21 |
| `connecting-oak-resources` | Oak resource graph; **PR #108 blocked on quality-gate snagging plan** | [record][connecting] | Feathered Circling Horizon / `cursor` / Opus 4.7 / `9e1c24` / 2026-05-21 (pr-108-snagging-plan author), Cirrus Circling Plume / `claude` / Opus 4.7 / `fba398` / 2026-05-21 (closeout owner) |
| `exploring-open-education-resources` | Third-party OER | [record][oer] | Gnarled / `claude-code` / `e18e2c` / 2026-05-01 |
| `architectural-budget-system` | Architectural budget | [record][budget] | Nebulous / `codex` / 2026-04-29 |
| `cloudflare-mcp-security-and-token-economy-plans` | Cloudflare MCP | [record][cloudflare] | Glassy / `codex` / 2026-04-28 |
| `sector-engagement` | External adoption | [record][sector] | Squally / `cursor` / 2026-04-30 |
| `eef` | EEF evidence corpus | [record][eef] | Torrid Glowing Flame / `claude` / Opus 4.7 (1M) / `5ab0ec` / 2026-05-21 |

Compact identity rule (per [PDR-027](../../practice-core/decision-records/PDR-027-threads-sessions-and-agent-identity.md)
and the 2026-05-17 structural refactor): this column carries only the
**latest** identity — `agent_name / platform / model / session_id_prefix /
last_session`. Full per-thread identity history and per-session context live
in each thread's next-session record.

[main-critical]: threads/main-critical-sonar-remediation.next-session.md
[observability]: threads/observability-sentry-otel.next-session.md
[agentic]: threads/agentic-engineering-enhancements.next-session.md
[connecting]: threads/connecting-oak-resources.next-session.md
[oer]: threads/exploring-open-education-resources.next-session.md
[budget]: threads/architectural-budget-system.next-session.md
[cloudflare]: threads/cloudflare-mcp-security-and-token-economy-plans.next-session.md
[sector]: threads/sector-engagement.next-session.md
[eef]: threads/eef.next-session.md

## Next Safe Steps

### Active Cross-Thread Program (2026-05-14 — sequence-live)

**Sequence routing**: defer to
[`token-remediation-p8-parallel-program.plan.md`](../../plans/agentic-engineering-enhancements/current/token-remediation-p8-parallel-program.plan.md)
for the four-step owner-stated program: (1) finish token work →
(2) singleton-lane remediation → (3) P8 to acceptance →
(4) cost-of-collaboration residual and graph foundations in parallel.
**Current step: 2** (Step 1 closed at WS2 boundary 2026-05-14). Sessions
advancing the program MUST update the program's §Current Snapshot per its
Anti-Decay Handoff Clause.

**2026-05-19 lens-applied override (Shaded Passing Candle)**: program
advancement rule is **superseded for graph priority**. Step 3 (P8 TUI),
Step 4A (cost-of-collab P6/P7), and hardening tail waves 2–6 defer past
graph. Step 2 lean scope (WS0+WS1+WS2+WS3) plus graph-stack Inc.1a/1b plus
graph-query-layer plus hardening tail wave 1 form the gating set. See
`threads/agentic-engineering-enhancements.next-session.md § Lens-Applied
Sequence` for the authoritative gating list and rationale.

### Agentic-Engineering Enhancements

Owner direction: program-step 2 next — singleton-lane remediation. Step 1
closed at the WS2 inclusive boundary: WS1 (`ws1-token-measurement`) landed
at `7a050c2a`, WS2 (`ws2-token-frontmatter`) landed at `72d31ca8` with
ADR-144 amended in place, and the program snapshot updated at `737942c0`.
Controlling plan for Step 2:
[`start-right-team-singleton-lane-remediation.plan.md`](../../plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md).
**Status update 2026-05-20 (Shaded Creeping Cloak)**: WS0 baseline
disposition is owner-approved (reviewer dispatch complete; assumptions
APPROVE, fred GO-WITH-CONDITIONS condition 1 absorbed, condition 2
invalid). WS1 opening is partial-in-flight (Register Presence template
amended; first-overlap response naming owed). **Next safe step**:
complete WS1 (name the first-overlap response: route proposal / one
provisional reconciler / support roles by boundary / silent default /
closeout owner; run markdownlint; run the parent plan's rg validation),
then WS2 (claim-overlap routing signal), then WS3 (canonical comms path
interface plus the atomic manifest.json:200 co-change required by
architecture-expert-fred condition 1). After WS3 lands, multi-vendor
parallel fan-out opens for graph-stack Inc.1a remaining cycles plus
the two `due` PDR drafts on a separate agent or session.

P8 remains the paused active collaboration spine, not complete. P0,
P-Foundation, P1, P2, P3, P4, and P5 are complete. The P8 operator-value and
smallest interaction-hardening slices landed at `2791be3c` and `6e804485`.
Resume mandatory P8 live collaboration TUI from `p8-attention-state` after the
token-cost lane unless newer owner direction changes the sequence. P8 must not
be called complete until the plan's `P8-A1` through `P8-A4` proof contract is
satisfied. P6/P7 resume after the P8 operator-view path unless owner direction
changes.

Agentic-engineering collaboration sequence for the next session:

1. **Owner-selected implementation lane** — land the completed WS1 bundle, then
   complete
   [`fitness-token-measurements-and-frontmatter-mandation.plan.md`](../../plans/agentic-engineering-enhancements/current/fitness-token-measurements-and-frontmatter-mandation.plan.md)
   from WS2 through WS6 in dependency order.
2. **Paused active spine** — P8 `p8-attention-state` remains open and resumes
   after token-cost unless the owner reprioritises.
3. **Strategic exercise lane** — if the owner asks to exercise the
   external-substrate learning plan, open
   [`external-skills-substrate-learning.plan.md`](../../plans/agentic-engineering-enhancements/future/external-skills-substrate-learning.plan.md),
   create the decided candidate register, review C1/C2 for Practice fit and
   existing homes, then stop before C3-C8 adoption work. This does not supersede
   the token-cost next-session route unless owner direction explicitly says it
   does.
4. **Guardrail lane** — use
   [`completion-claim-proof-pipeline.plan.md`](../../plans/agentic-engineering-enhancements/current/completion-claim-proof-pipeline.plan.md)
   to keep P8/P5 completion language evidence-bound.
5. **Team-remediation planning lane** — the N=7 WS1 self-organisation
   experiment produced a first-pass remediation plan:
   [`start-right-team-singleton-lane-remediation.plan.md`](../../plans/agent-tooling/current/start-right-team-singleton-lane-remediation.plan.md).
   It is not decision-complete; first safe step is owner/reviewer review, then
   WS0 baseline disposition. It does not supersede the token-cost commit
   boundary unless owner direction explicitly changes the sequence.
6. **Knowledge-graduation disposition lane** — **COMPLETE 2026-05-14**.
   The cross-platform graduation triage plan executed all owner-approved
   scope: Batches A/B/C landed at commit `c6008dee`; all five D1–D5
   amendments landed after owner per-diff review (commits `22d1980d`,
   `54425b6d`, `7821636b`); PDR-060 (Tooling Friction Is First-Class User
   Feedback) landed in closeout commit `0b585435`. Both plans archived
   to `.agent/plans/agentic-engineering-enhancements/archive/completed/`.
   Plan-pre-empted substance remains held against the singleton-lane
   plan; the paused coordinator-PDR stays paused.

Team collaboration research from the P8 controller window now has focused
artefacts: `start-right-team`, proposed ADR-181, the
`team-start-ritual-and-action-trace-2026-05-14.md` research note, and a
conditional team/sole-contributor branch in `session-handoff`. This advances
the agent-collaboration practice surface only; it does not change the next
P8 implementation target.

Current closeout note: the WS1 token-measurement team converged on one coherent
implementation and reported green acceptance evidence, but the session exposed
coordination friction: duplicate WS1 claims opened in parallel, one
consolidation pass initially missed live claims by probing `.active_claims`
instead of `.claims`, stale comms retention cleanup overlapped the WS1 window,
and a transient peer-staged rename made git/index work unsafe until the final
staged diff cleared. The working tree still contains source plus
collaboration-state residue. This handoff captures the positives, blockers,
and exact next step without starting WS2.

Completion-proof lane: continue from
[`completion-claim-proof-pipeline.plan.md`](../../plans/agentic-engineering-enhancements/current/completion-claim-proof-pipeline.plan.md).
The first implementation slice is doctrine/skill level only:
`completion-claims-must-match-plan` plus the smallest `jc-plan` proof-contract
and template amendment. This lane exists to prevent recurrence of the P5/P8
false-completion reports; it must preserve the distinction between
`partial-slice-landed`, `pending`, and `complete`.
The suspected flaky tests
listed in
[`cost-of-collaboration.flaky-tests.md`](../../plans/agent-tooling/current/cost-of-collaboration.flaky-tests.md)
are disposed as not reproduced, and representative busy-checkout cold/warm
`pnpm check:profile` baselines are green. Do not reopen the "make pre-commit
staged-only" framing. The preserved evidence and trigger map live in
[`pnpm-check-profiling-deep-dive-2026-05-12.md`](../../plans/agent-tooling/pnpm-check-profiling-deep-dive-2026-05-12.md);
the implementation tasks live in
[`cost-of-collaboration.plan.md`](../../plans/agent-tooling/current/cost-of-collaboration.plan.md).
P2 committed through the normal pre-commit hook after formatting the new source
files; do not preserve the earlier `codex-exec` dirty-tree blocker as current
state.

Workflow skill review lane remains available but is not the immediate
cost-of-collaboration continuation: the paired `jc-session-handoff` /
`jc-consolidate-docs` and `jc-metacognition` remediation pass is complete;
remaining skills can resume from the thread record if the owner reopens that
lane.

Conservation-first consolidation is staged across four sessions by owner
direction. The active napkin was processed first: the outgoing file was archived
intact as
[`napkin-2026-05-12b.md`](../active/archive/napkin-2026-05-12b.md), and its
behaviour-changing learning was distilled into
[`distilled.md`](../active/distilled.md) without treating fitness numbers as
brevity targets. The distilled-stage pass is now complete: mature lessons were
routed to durable doctrine and pattern homes, and unresolved or owner-shaped
items were kept in [`pending-graduations.md`](pending-graduations.md). The
`pending-graduations.md` pass is also complete: the due queue is empty, stale
body statuses are corrected, and remaining pending items are explicitly retained
by trigger/carrier. The next consolidation session should process
`practice-bootstrap.md`. At every stage, knowledge curation and conservation
outrank brevity; fitness numbers are advisory routing signals.

The acceptance bar remains:

- live state remains in this file;
- historical closeout prose remains archived, not deleted;
- distilled learning and pending-graduations are fully processed;
  practice-bootstrap is the next drain;
- pending-graduations index/counts match body entries marked `status: due`;
- ADR-shaped and PDR-shaped promotion decisions are visible to the owner;
- cost-of-collaboration P0 remains named as the blocker for multi-agent
  implementation windows.

Implementation lane after profiling and consolidation: follow the thread
record's cost-of-collaboration opener. P0, P-Foundation, P1, P2, P3, P4, and
P5 have landed; mandatory P8 live collaboration TUI is the next implementation
step.

### Connecting-Oak-Resources

Branch-primary graph work continues from
[`threads/connecting-oak-resources.next-session.md`](threads/connecting-oak-resources.next-session.md).

**🛑 IMMEDIATE NEXT STEP — PR #108 quality-gate snagging plan**: PR #108 is failing CodeQL (alert #90) + SonarCloud Quality Gate (40 issues, 12 hotspots, 6.0% duplication). The snagging plan at [`.agent/plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md`](../../plans/connecting-oak-resources/knowledge-graph-integration/current/pr-108-snagging.plan.md) is the authoritative execution surface — `type: quality-fix`, `status: planning`, 12 cycles, per-finding disposition ledger, aligned with `docs/governance/sonar-disposition-policy.md` and `.agent/rules/never-disable-checks.md`. **Substantive graph implementation work (Inc.1a WS2.2/WS2.3/WS3.3, Inc.1b, Inc.1c, Inc.1d) on PR #108 is parked behind the snagging plan landing.** The next session opening this thread should: (1) read the snagging plan; (2) decide between completing it on `feat/mcp-graph-support-foundation` before merge OR rebasing the substantive cycles onto a fresh branch after PR #108 merges clean; (3) execute Phase 0 (disposition ledger commit) as the first cycle.

**Current state (2026-05-21 close, second session of the day)**: Inc.1a
is **half-complete on the first parallel-pair**: WS3.2 LANDED at
`abe6fcb3` (Foamy Charting Fjord, claude opus-4-7-1m, session 86dbd1)
plus chore(plan) record at `35b49858`. WS2.2 NOT landed this session —
owner-directed mid-session pivot to all-channels comms CLI work
(see `agentic-engineering-enhancements` thread). Landed cycles: WS0
(5ec5004d), WS1.1 (ad2abb69), WS1.2 (1885fbcf), WS1.3 (87e21125), WS1.4
(95f42cb7), WS1.5 (ebd0e8dc), WS1.6 (3add41f9), WS2.1 (0f895070), WS3.1
(84bfffa5), WS3.2 (abe6fcb3). Inc.1a remaining: 3 cycles (WS2.2, WS2.3,
WS3.3).
**Next safe step (post-Cirrus six-agent team session 2026-05-21 evening)**: **the Inc.1d EEF concurrent-tenant amendment-set has LANDED at `0cdaf58c`** (7 files, +657/−129; per-slice PDR-044 vocabulary + integrated coherence pass + atomic commit; all gates green). Substrate dependencies remain unchanged: resume Inc.1a completion (WS2.2 jsonld-compatible + Turtle/SKOS parser, WS2.3, WS3.3 adjacency primitives), then Inc.1b (WS4.1 graph-corpus-sdk scaffold + WS4.2 Threads adapter) and Inc.1c (WS4.3 query proof). Inc.1d (WS4.4 GraphView interface + WS4.5 EefStrandsGraphView adapter) opens once Inc.1a + WS4.1 + WS4.2 + WS4.3 land per the amendment-set's sequencing. Three remaining specialist reviewers still required at Inc.1d authoring time per the prior thread record: **type-expert** (load-bearing for the `Result<T, NotImplementedYet>` variant typing across 5 EEF stub operations + `DeepKeyPath<TNode, Depth>` recursive type + array-stop discipline); **architecture-expert-betty** for the GraphView placement (already resolved to `packages/core/graph-core/src/graph-view/` per the amendment-set; verify holds at WS4.4 author time); **assumptions-expert** for the sparse-relations-on-manifest WS4.5 stub criterion. After Inc.1d landing,
Inc.1b (WS4.1 scaffold + WS4.2 Threads adapter) + Inc.1c (WS4.3 query
proof) + Inc.1d (WS4.4 GraphView interface + WS4.5 EEF adapter — new
sub-increment per the 2026-05-21 amendment). Then the three
pieces of session-output that remained in the working tree from earlier
2026-05-21 sessions: (a) Molten's WS3.3 atomic bundle on
`packages/libs/graph-project/src/adjacency/**` (3 files, 22/22 green,
three in-cycle reviewers absorbed clean — see thread record);
(b) Celestial's `start-right-team` SKILL update encoding the new
inherited-tree gate-verification First Move and the dialogue-over-
competition vocabulary reframe; (c) Pelagic's `apps/oak-search-cli`
bug fixes — verify post-cascade-clear which of these are still in the
tree vs absorbed into the v0.7.0 cascade-clear commits. After the cascade
clears, three pieces of session-output remain in the working tree from
the 2026-05-21 three-agent session and should land as separate
follow-on commits: (a) Molten's WS3.3 atomic bundle on
`packages/libs/graph-project/src/adjacency/**` (3 files, 22/22 green,
three in-cycle reviewers absorbed clean — see thread record);
(b) Celestial's `start-right-team` SKILL update encoding the new
inherited-tree gate-verification First Move and the
dialogue-over-competition vocabulary reframe;
(c) continuity-state updates (this file, thread record, napkin,
pending-graduations). After all of that, **then** resume WS2.2 —
`packages/libs/graph-ingest/src/jsonld-compatible/**` plus a Turtle
parser location (recommended: new `src/turtle/` sub-path peer to the six
WS2.1 pre-declared barrels; n3.js is the W3C-aligned Turtle parser
choice). Lands §Test discipline invariant #2 contract test (every
emitted edge predicate is `NamedNode`, never a bare string). The next
team session may also dispatch WS2.3 ↔ WS3.3 in parallel per plan §Cycle
dependencies; single-agent through WS2.2 → WS2.3 → WS3.3 remains the
explicitly preferred default. The empirical two-agent collaboration
shape (shared physical checkout, coordination via active-claims + comms
on disjoint workspace trees) is now confirmed WORKING from earlier
2026-05-21 sessions; the three-agent shape (Celestial + Molten +
Pelagic) is also confirmed WORKING for coordination, with the
inherited-tree-state failure mode (cascade-discovered-late) now
structurally cured in the updated `start-right-team` SKILL First Moves.
Multi-vendor open of the thread remains forbidden until WS3.3 lands.
Inc.1a continues under the 2026-05-12 holistic re-plan (`f73c42f5`):
WS1.8 is deferred to Inc.2.

**Deep consolidation status**: **due — owner-directed at session close 2026-05-21 evening** (Cirrus closeout). The six-agent team session produced 5 pending-graduations entries (3 coordination-pattern candidates from Stratospheric, 1 napkin-refinement for closure-shape vs structural-antonym vocabulary, 1 backtick-substitution rule + `--body-file` CLI evidence point 2) and 5 napkin surprise entries. The next session-handoff step is to escalate immediately into `jc-consolidate-docs` per the owner's direction "run a reasonable /jc-consolidate-docs and then commit". This refreshes to `completed this handoff` once consolidation lands.

**`pnpm check` cleanliness gate** (Step 11 of `session-handoff`): pending verification post-handoff edits. Salty's pre-commit hook chain at `0cdaf58c` was green across 87/87 turbo tasks on the planning-files-only bundle; the post-commit working tree still carries the inherited residual (Molten WS3.3, Pelagic bulk-download, agent-tools surface, ADR-173 touch) that was NOT in scope of the four-slice partition. Will be re-verified before this handoff is declared complete.

**WS1.5 status (2026-05-13, Quiet Stalking Mirror)**: design fully absorbed inline in
the active graph-stack plan under `ws1-canon`. Three-reviewer pre-implementation
pass complete (code-expert APPROVE-WITH-NITS; assumptions-expert
GO-WITH-CONDITIONS; architecture-expert-betty GO-WITH-RESHAPE). Owner-stated
doctrinal rules (`no aliases, no fallbacks, fail fast and hard with helpful
error message, replace old with new`) recorded in plan body; URDNA2015 → RDFC-1.0
plan-text remediation applied in §ws1-canon and §Build-vs-Buy Attestation.
Implementation did NOT land in this session. Resume by: (1) verifying the
owner-known closeout bundle (pnpm/dependency refresh + P8 foundation repair —
see Agentic lane note above) has landed and the lockfile is clean; (2) adding
`rdf-canonize@^5` to `packages/core/graph-core/package.json` direct deps and
regenerating the lockfile; (3) implementing `src/canon/{runtime.ts,
canonicalize.ts, index.ts}` exactly to the absorbed design; (4) running the
five tests atomic-landing with product; (5) plan-text remediation already
applied so no follow-up doc churn required. Reviewer flags for the
implementation cycle remain type-expert (rdf-canonize wrapper shape + literal
preservation) and test-expert (deterministic order across blank-node fixtures).

## Open Owner-Decision Items

1. `practice.md` HARD character pressure remains owner-gated under the Core
   care-and-consult rule. Falsifiability:
   `pnpm practice:fitness:strict-hard`.
2. [`pending-graduations.md`](pending-graduations.md) is a consolidation-pass
   queue, not a daily session-open file. Its 2026-05-12 due queue is drained;
   future passes should preserve pending entries until their trigger fires and
   must not trim for metrics.
3. Monorepo workspace topology (superseding ADR-108, S0-S6 strategic plan) is
   parked until after the graph MVP implementation tranche unless the owner
   explicitly reopens it.
4. Cost-of-collaboration P0, P-Foundation, P1, P2, P3, P4, and P5 are
   complete; P1 landed at `f88d0d67`, P2 at `0d3af914`, P3 at `c083a1ab`, P4
   at `1bb369a5`, and the P5 DI/no-IO repair at `07ffee1d`.

## Repo-Wide Invariants / Non-Goals

Each invariant below has a canonical home; this section is a resume aid, not
the authority.

- no compatibility layers; replace, do not bridge —
  [`replace-dont-bridge`](../../rules/replace-dont-bridge.md);
- distinct architectural layers live in distinct workspaces —
  [ADR-154](../../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  and [`principles.md`](../../directives/principles.md);
- TDD at all levels —
  [`tdd-as-design.md`](../../directives/tdd-as-design.md);
- tests prove product behaviour, not configuration or file presence —
  [`testing-strategy.md`](../../directives/testing-strategy.md);
- strict boundary validation only —
  [`strict-validation-at-boundary`](../../rules/strict-validation-at-boundary.md);
- no `process.env` read/write in test files or setup files —
  [`no-global-state-in-tests`](../../rules/no-global-state-in-tests.md);
- `--no-verify` requires fresh per-invocation owner authorisation —
  [`no-verify-requires-fresh-authorisation`](../../rules/no-verify-requires-fresh-authorisation.md);
- no warning toleration —
  [`no-warning-toleration`](../../rules/no-warning-toleration.md);
- owner direction beats plan —
  [`AGENT.md`](../../directives/AGENT.md);
- curriculum data in this monorepo comes only through the published Oak Open
  Curriculum HTTP API and generated SDK;
- knowledge preservation is absolute — writing to shared-state knowledge
  surfaces is never blocked by fitness limits —
  [PDR-026](../../practice-core/decision-records/PDR-026-per-session-landing-commitment.md);
- shared-state files are always writable and commit-includable regardless of
  active claims —
  [`respect-active-agent-claims`](../../rules/respect-active-agent-claims.md).
- current memory/state files should be included in every commit when dirty —
  owner clarification, 2026-05-12.

Current branch non-goals:

- do not reopen broader canonicalisation opportunistically;
- do not guess Vercel, Sentry, SonarCloud, or GitHub state before checking
  primary evidence;
- do not treat monitor setup or owner-handled preview validation as in-repo
  acceptance work.

## Deep Consolidation Status

**Status (2026-05-21 — Feathered Circling Horizon / `cursor` / Opus 4.7 / `9e1c24`)**: **not due — sole-contributor analysis-and-plan-authoring session, no consolidation triggers fired**. Session substance is the PR #108 snagging plan (`current/pr-108-snagging.plan.md`) plus continuity refreshes (this file, `connecting-oak-resources.next-session.md`, `active/graph-stack.plan.md`). Two pending-graduation candidates surfaced inline in the thread record rather than written to the (currently peer-claimed) `pending-graduations.md` surface: (a) tighter policy-doc-first reading at gate-analysis time (read `docs/governance/sonar-disposition-policy.md` BEFORE proposing dispositions, not after); (b) doctrine candidate "the gate is the cheap version of the failure it names" from the metacognition pass. Both should be picked up by the next consolidation drain. Prior status preserved below for the audit trail.

**Prior status (2026-05-21 evening — Torrid Glowing Flame / `claude` / Opus 4.7
(1M) / `5ab0ec`)**: **not due — planning-only session, no consolidation
triggers fired**. Session substance is captured in session-scoped
surfaces (one substantial napkin entry on sequence-first vs
smallest-first epistemic stance + cross-surface amendment-landing
pattern + carve-out vocabulary hook block; 11 plan/ADR amendments;
thread-record updates on both `connecting-oak-resources` and `eef`;
one comms event). The earlier 2026-05-21 "due — not well-bounded"
status from Uplifted Swooping Wing's session has been partially
addressed by Opalescent Twinkling Supernova's cascade-clear commits +
this session's continuity refresh; the residual "due" portion (cross-
session pattern extraction, doctrine graduation, napkin-rotation
consideration) carries to the next deliberate `consolidate-docs` run.
Three new candidate insights captured in napkin this session
(sequence-first stance; cross-surface amendment landing pattern;
hook-blocked vocabulary) are session-scoped capture only — graduation
at next `consolidate-docs`. Prior status preserved below for the
audit trail.

**Prior status (2026-05-21 — Uplifted Swooping Wing / `claude` / Opus 4.7 (1M) /
`8d9999`)**: **due — not well-bounded for this closeout**. Triggers
fired: (1) plan/milestone closures — WS1.6 vocab registry `3add41f9` and
WS3.1 graph-project scaffold `84bfffa5`, plus the Inc.1a first-parallel-
pair boundary itself; (2) fitness pressure on
[`napkin.md`](../active/napkin.md) — 328 lines above 300 hard limit
after the decision-moment heuristic entry; per `knowledge-preservation-
over-fitness-warnings` the entry was correctly preserved and rotation
is owner-cadenced (not blocking the session); (3) thread-record
identity drift on `connecting-oak-resources` — the Latest identity
column was at Riverine Swimming Hull 2026-05-14 despite Stormy
Plumbing Atoll (2026-05-20) and Shaded Creeping Cloak (2026-05-20)
sessions touching the thread in between; identity row updated for
this session but the intervening gap remains; (4) candidate
captured at step 6b — decision-moment heuristic (single
decision-time heuristic — long-term architectural excellence — may
subsume many topic-decomposed rules at fire time), single instance,
promote on third instance or owner direction; (5) reasoning-hygiene
correction surfaced by owner this session (plans-as-evidence,
memory-as-permanent, dogma vocabulary), single instance, candidate
pattern. Deferring to a future session because: owner directed at
session close that the next session is a two-agent collaborative
Claude implementation session on the WS2.2 ↔ WS3.2 parallel pair —
focused execution boundary, not a deep-consolidation boundary.
Constraint: owner direction (named); evidence: explicit direction
"Let's close out this session, and then start a two agent
collaborative session, both Claude, and see how that goes";
falsifiability: a future session can verify by reading this entry
plus the connecting-oak-resources thread record's "Next anticipated
work" field.

**Prior status (2026-05-20 — Shaded Creeping Cloak / `claude` / Opus 4.7 (1M) /
`4ef359` — second pass at second handoff)**: **completed this handoff —
three consolidation passes total across the extended session window**:
(1) inline-with-D close-out pass capturing over-correction candidate;
(2) post-handoff promotion pass for review-as-re-decision candidate
plus naming the absorption-failure-mode family observation; (3) this
final pass after WS0 sign-off and WS1 opening — recording the four
owner-parsed decisions, the reviewer dispatch outcomes, and the
WS1-partial-in-flight state in pending-graduations + thread record.
No additional ADR/PDR candidates surfaced in pass 3; no Practice Core
amendments queued. Critical-zone fitness signals on napkin.md and
pending-graduations.md continue as owner-acknowledged back-pressure.
No napkin rotation due. Comms-events younger than 7 days; no retention
processing required.

**Prior pass (2026-05-20 — Shaded Creeping Cloak — first handoff)**: **completed this handoff — light consolidation pass alongside
session close**. Triggers fired: plan/milestone closures (WS1.5 RDFC-1.0
canon `ebd0e8dc`, WS0 ledger `8227d3f7`, N3 ledger absorption `db5b8bc0`);
settled doctrine candidate captured (over-correction-during-absorption
pattern, single-instance); repeated surprise (review-as-re-decision
failure mode after owner correction). Outcomes: 1 new entry in
pending-graduations.md (over-correction-during-absorption candidate);
1 new candidate in napkin (review-as-re-decision failure mode);
session-scoped TSDoc gap addressed (c3627b69). Critical-zone fitness
signals on napkin.md and pending-graduations.md preserved as owner-
acknowledged back-pressure; no compression applied. Three-question
Loop Health post-mortem: earlier zones are flashing as designed; limits
deliberately tight to surface back-pressure; structural cure is the
existing knowledge-flow-pipeline-mechanisms.plan.md awaiting owner
execution order. No Practice Core refinement candidates surfaced.
No napkin rotation due (177 lines, under 500). Comms-events younger
than 7 days; no retention processing required.

**Prior status (2026-05-20 — Stormy Plumbing Atoll / `claude` / Opus 4.7 (1M) /
`2e2764`)**: **due — not well-bounded for this closeout**. Triggers fired:
WS1.5 RDFC-1.0 canon milestone closed at `ebd0e8dc`; WS0 disposition
ledger milestone closed at `8227d3f7`; closure-pressure rationalisation
failure mode surfaced through three rounds of metacognition (new entry
in pending-graduations.md targeting Practice-governance PDR or amendment
to ADR-172/PDR-029; companion research + future-collection plan with 10
todo questions); PDR-044 refusal-vs-approval mechanism choice surfaced as
a second candidate. Five reviewer-finding items remain under-disposed
against the WS1.5/WS0 work (carried in agentic-engineering-enhancements
thread record). Deferring to next session because: (1) the failure-mode
preservation work itself was the session's late-stage workload and a
second metacognition cycle to drive graduation would be cognitively
expensive in the same window; (2) owner direction during closeout
explicitly placed action-decisions in the next session's scope. Next
session should consider whether to consume the trigger list as a deep
consolidation pass, or whether to land WS1 of singleton-lane remediation
first and consolidate after.

**Status (2026-05-19 — Shaded Passing Candle / `claude` / Opus 4.7 (1M) /
`ab4290`)**: completed this handoff — light consolidation pass alongside
session handoff. Triggers fired: plan/milestone closures (singleton-lane
decision-complete, comms-watch reference landed), settled doctrine
graduating from ephemeral surface to README (leaf-to-root reachability
invariant), repeated surprise candidate (portable-reference-arrives-
without-plan-slot). Outcomes: 2 new entries in pending-graduations.md
(reachability invariant ADR-shaped; pattern card pending second
instance). No Practice Core refinement candidates surfaced. No napkin
rotation due. Comms-events not yet at 7-day threshold (last live
activity 2026-05-14, today 2026-05-19). Practice-box incoming empty;
outgoing directory retired. Fitness pressure on pending-graduations.md
and repo-continuity.md noted; both pre-existing, route via PDR-046
§Move 3 graduation upward.

**Status (2026-05-17 — Swift Winging Gust / `claude` / Opus 4.7 (1M) /
`50492a`)**: completed this handoff — owner-directed full structural
pass `/jc-consolidate-docs` targeting fitness functions for knowledge
curation and homing. Four moves landed:
(A) **Archive of historical session-close prose**: 425 lines of
"Deep Consolidation Status" prose (2026-05-12 → 2026-05-14) moved
verbatim to
[`archive/repo-continuity-session-history-2026-05-17.md`](archive/repo-continuity-session-history-2026-05-17.md)
per this file's own `split_strategy`. Result: repo-continuity
CRITICAL → soft.
(B) **Archive of graduations-log sections from distilled.md**: 158
lines of back-cite-only "Graduations Log — 2026-05-14" + already-
graduated "Recently Distilled — 2026-05-12 / 05-10 Napkin Rotation"
sections moved to
[`../active/archive/distilled-graduations-log-2026-05-14.md`](../active/archive/distilled-graduations-log-2026-05-14.md).
Substance lives at named permanent homes; archive carries the
audit trail. Result: distilled critical → still critical on lines
(455) and hard on chars; remaining 455 lines are durable substance,
not graduations log.
(C) **Two pending-graduation entries graduated**:
`skill-amend:session-handoff` for the `pnpm check` cleanliness gate
landed as new step 11 in
[`.agent/skills/session-handoff/SKILL-CANONICAL.md`](../../skills/session-handoff/SKILL-CANONICAL.md);
`rule-amend:no-verify-requires-fresh-authorisation` for hook-bypass
equivalence verified as already-landed at commit `da2a4aac`
(Luminous Waxing Twilight 2026-05-15) — entry marked graduated.
(D) **Active Threads identity-column structural refactor**: the
"Latest identity" column in this file pruned to compact form
(`agent_name / platform / model / session_id_prefix / last_session`)
per PDR-027; multi-paragraph per-session narrative removed;
accumulated identity-refresh paragraphs removed. Per-session detail
lives in thread records. Refactor pending-graduation entry marked
graduated.

Owner-directed limit adjustments after the structural pass:
distilled.md raised modestly (target 200→350, limit 275→500, chars
16500→28000) to accommodate durable cross-session learning substance.
pending-graduations.md tightened (target 2000→500, limit 2500→750)
after owner reframe — *"that is ridiculous, pending graduation is a
buffer location until write, not a dumping ground"* and *"500 soft
limit, 750 hard limit, and we revisit the pipeline to figure out why
it has become a broken accumulator in the system instead of a flow
control mechanism to balance back pressure."* The 3635-line buffer is
a flow-control failure, not a substance-preservation problem; back-
pressure signal preserved by tightening limits so the validator
continues to flash the underlying pipeline-repair need.

Generative-metacognition outcomes captured this pass (per the second
`/jc-metacognition` invocation, then the owner-named broadening of
metacognition from retrospective-only to retrospective-plus-generative):

- New `distilled.md` section "Recently Distilled — 2026-05-17 Swift
  Winging Gust pipeline-reframe" carrying three substance entries:
  surface classification for fitness-response routing
  (memory/state/buffer/doctrine), pipeline back-pressure as
  structural-cure signal, and doctrine-first vs first-principles
  cognitive-approach diversity in agent-owner pairs.
- Three buffer-shape PDR-candidate entries in
  `pending-graduations.md` (demonstrating the buffer-shape contract by
  example): `pdr:surface-classification-for-fitness-response`,
  `pdr:pipeline-back-pressure-is-structural-cure-signal`,
  `pdr:cognitive-approach-diversity-in-agent-owner-pairs`.
- Two Claude per-user feedback memories:
  `feedback_pending_graduations_is_buffer_not_dump` and
  `feedback_metacognition_impact_test` (the latter naming both
  retrospective and generative modes plus the shared pre-action
  ratification reflex).

Pipeline-repair work is now registered as a DECISION-COMPLETE-
FOR-STRATEGIC-ROUTING plan at
[`knowledge-flow-pipeline-mechanisms.plan.md`](../../plans/agentic-engineering-enhancements/current/knowledge-flow-pipeline-mechanisms.plan.md)
(authored 2026-05-18 Swift Winging Gust continuation). Six WSes:
WS1 producer-side buffer-shape contract; WS2 consumer-side trigger-
scan cadence + recurring-signal tripwire rule; WS3 drain pass for
existing backlog (first executable slice); WS4 ADR-144 surface-
classification amendment; WS5 declared-workflow-steps-require-
evidence rule; WS6 PDR-drafting lane for the five 2026-05-17
candidates. Suggested execution order WS3 → WS4 → WS1 → WS2 → WS5 →
WS6; owner-direction selects.

**Prior status (2026-05-17 — Solar Orbiting Asteroid / `claude` / Opus 4.7 (1M) /
`01ff58`)**: completed this handoff — owner-directed
`/jc-session-handoff` followed by `/jc-consolidate-docs`. Napkin
rotated to [`archive/napkin-2026-05-17.md`](../active/archive/napkin-2026-05-17.md);
fresh napkin started; behaviour-changing entries from the
2026-05-15 plus 2026-05-17 window distilled into new section
[`distilled.md` §"Recently Distilled — 2026-05-17 Solar Orbiting Asteroid gate-green cascade"](../active/distilled.md).
Four pending-graduations entries captured this pass:
`pattern:gates-hide-gates` (pending second-instance);
`doc-amend:testing-patterns` for the supertest classification
conflict (pending owner-direction); `skill-amend:session-handoff`
for the `pnpm check` cleanliness step (due — owner direction fired
2026-05-14); `rule-amend:no-verify-requires-fresh-authorisation`
for hook-bypass equivalence (due — owner direction fired
2026-05-14). The `test-coverage-review-lens` pattern was already
graduated mid-session at commit `0c083409`. Fitness state post-pass:
napkin healthy ✓; distilled critical (substance preserved per the
learning-preservation rule — graduation upward is the next move;
candidate sections for graduation upward are the older "Recently
Distilled — 2026-05-09 / 05-10 / 05-12 / 05-13" blocks and
"Graduations Log" sections); pending-graduations critical on
characters (queue churn — same story); repo-continuity critical
(named structural cure remains the Active Threads identity column
refactor, pending in the register). No Practice Core contradiction
or extension surfaced this pass.

Previous deep-consolidation and session-close prose lives in:

- [`archive/repo-continuity-session-history-2026-05-17.md`](archive/repo-continuity-session-history-2026-05-17.md)
- [`archive/repo-continuity-session-history-2026-05-12.md`](archive/repo-continuity-session-history-2026-05-12.md)
- [`archive/repo-continuity-session-history-2026-05-10.md`](archive/repo-continuity-session-history-2026-05-10.md)
- [`archive/repo-continuity-session-history-2026-05-07.md`](archive/repo-continuity-session-history-2026-05-07.md)
- earlier dated archive files under [`archive/`](archive/)
