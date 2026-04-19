## 2026-04-19 — Governance-concept integration lane closeout

### What Was Done

- Closed the governance-concept integration lane as a docs/plans-only slice by
  adding
  `active/governance-concepts-and-agentic-mechanism-integration.execution.plan.md`,
  marking the source plan complete, and updating the collection lifecycle
  surfaces (`active/README.md`, `current/README.md`, collection `README.md`,
  `roadmap.md`).
- Tightened the evidence lane so it extracts concrete value from the governance
  comparison rather than just moving wording:
  `current/hallucination-and-evidence-guard-adoption.plan.md`,
  `active/phase-2-evidence-based-claims-execution.md`, and
  `evidence-bundle.template.md` now distinguish `attempt`, `observed outcome`,
  and `proven result`.
- Tightened the operational-awareness lane so it explicitly frames itself as
  the bounded work-plane pilot for `supervised execution`, without widening
  scope into the broader runtime-governance model.
- Tightened the reviewer-gateway lane so it explicitly treats the gateway as
  one layer in the `layered-safeguard stack` and names review-signal inputs,
  including `relationship-confidence signals`.
- Tightened the future mechanism-taxonomy lane so the remaining abstraction
  debt now has one explicit future home: `action-governance boundary`,
  `boundary model`, `signal ecology`, `residual-risk surface`, and
  `governance-plane vocabulary`.
- Recorded doctrine no-change rationale in the collection sync surface instead
  of touching canon.

### What Was Deliberately Deferred or Rejected

- `graduated authority` stays explicitly deferred. The repo does not yet have
  enough operational-awareness or reviewer-gateway evidence to justify a
  formal authority ladder.
- `adoption ladder` stays explicitly deferred. The repo has not yet moved a
  mechanism family far enough from repo-local pilot to doctrine candidate to
  need staged uptake machinery.
- `layered safeguards` do NOT become fresh taxonomy debt. They stay in the
  reference/deep-dive lane plus the reviewer-gateway's local manifestation.
- No edits were made to `docs/foundation/agentic-engineering-system.md`,
  `.agent/practice-core/practice.md`, ADR-119, ADR-150, or any PDR. That was
  deliberate: the findings remain repo-local routing and evidence-shape work,
  not settled canon.

### Why This Counted as Real Extraction

- I added a value-extraction rule to the lane: a concept only counted if it
  changed a local contract, evidence shape, routing rule, future-slice
  boundary, or explicit defer/reject decision.
- I also made room for concepts that did **not** already have a clean local
  equivalent. Net-new abstractions from the source material and reflective
  ideas produced by comparing both corpora still counted, but only when they
  earned a clear local definition and home.
- This prevented "routing only" from being treated as success. The practical
  test became: what concrete local surface behaves differently now because the
  source material was mined?

### Validation and Review Record

- Ran the repo-defined quality gates for this lane's closeout surface:
  `pnpm markdownlint-check:root` passed, and
  `pnpm practice:fitness:informational` exited `0` while reporting the same
  pre-existing repo-wide `Result: HARD (2 hard, 12 soft) — informational
  mode` posture outside this lane's scope.
- Prior planning findings from `docs-adr-reviewer` and
  `architecture-reviewer-fred` were absorbed before editing.
- Execution-time repair rounds absorbed findings from `assumptions-reviewer`,
  `docs-adr-reviewer`, and `architecture-reviewer-fred` covering the evidence
  example overclaim, unrouted net-new concepts, residual-risk routing,
  three-plane and awareness-plane homes, propagation-surface naming, and the
  need for an explicit closure record.

### Follow-Up Slices

- Promote the operational-awareness plan into active execution once the
  markdown-first pilot lane is accepted.
- Promote the reviewer-gateway plan when the taxonomy rename mechanics or live
  review-noise evidence justify it.
- Use the updated evidence lane to implement the attempt / observed outcome /
  proven result structure in real Phase 2 execution work.
- Promote the future mechanism-taxonomy plan only after adjacent lanes produce
  enough evidence for a bounded first executable slice.

## 2026-04-19 — Phase 5 ESLint rule landing (observability track)

### What Was Done

- Authored `require-observability-emission` ESLint rule at
  `packages/core/oak-eslint/src/rules/` with 20 valid + 6 invalid
  RuleTester cases. Rule tracks *export declaration anchors* rather
  than inner function nodes. Scope filter uses regex path-segment
  anchors, not minimatch globs. Sentinel opt-out:
  `// observability-emission-exempt: <reason>`.
- Registered rule in inline `@oaknational` plugin in `recommended.ts`.
  Wired at `warn` in all 5 `apps/*` and `packages/sdks/*` workspace
  `eslint.config.ts` files — 96 coverage-gap warnings surface
  (each is a lane surface for Wave 3+ emitter work to close).
- Codified axis-coverage question in
  `.agent/directives/invoke-code-reviewers.md §Coverage Tracking`.
- Flipped ADR-162 Proposed → Accepted (2026-04-19). Added History
  block recording Wave-1 scope + Wave-2-deferred mechanisms.
- Commit `fc0a0602` landed; reviewer matrix dispatched
  (architecture-reviewer-fred + type-reviewer); 4 TO-ACTION
  findings all ACTIONED in-place.
- Parallel-agent docs work committed as `3455d26c` at session close
  (53 files; agentic-engineering corpus scaffolding).

### Patterns to Remember

- **TSESLint vs core Rule typing is contravariant at the plugin slot.**
  A `TSESLint.RuleModule<'messageId'>` fails to satisfy
  `ESLint.Plugin.rules` when embedded in `Linter.Config.plugins`
  because TSESLint's rule context has more methods than core ESLint's,
  and TypeScript's contravariance rejects the substitution. For a
  rule that must live in `recommended.ts`'s inline `@oaknational`
  plugin, type it as core `Rule.RuleModule` (ESTree node types from
  `estree`). For a rule that only lives in the plugin's `rules`
  export (not a preset plugin), TSESLint typing works (e.g.
  `no-export-trivial-type-aliases`). Trade-off: lose typed
  messageIds; gain structural compatibility.
- **`MaybeNamedFunctionDeclaration` subtyping friction on default
  exports.** ESTree's `ExportDefaultDeclaration.declaration` is
  `MaybeNamedFunctionDeclaration | MaybeNamedClassDeclaration |
  Expression`. `MaybeNamedFunctionDeclaration` is a SUPERTYPE of
  `FunctionDeclaration` (non-nullable id widened to nullable); not
  assignable to an `ESTree.Node`-typed slot. Fix by tracking
  *export declaration anchors* (the wrapper nodes) rather than the
  inner function; ancestor-walk identifies the anchor regardless
  of inner sub-type. Behaviourally equivalent, sidesteps friction
  entirely.
- **ESLint rule scope filters must not assume repo-root cwd.**
  `context.cwd` is the WORKSPACE root under per-workspace lint,
  not the repo root. A glob like `apps/*/src/**/*` matched against
  a workspace-relative `src/foo.ts` never fires. Fix with regex
  path-segment anchors (`(?:^|/)apps/[^/]+/src/`) that work for
  both absolute and relative POSIX paths. One-instance observation;
  watch for a second rule hitting this.
- **Emission predicates validated only against synthetic RuleTester
  cases miss real shapes.** fred's reviewer pass caught two real
  sites (`fetchUpstreamMetadata`, `proxyUpstreamAsset`) emitting
  solely via `observability.withSpan` — a legitimate engineering-
  axis emission that the initial predicate didn't cover. Rule: for
  any new lint rule with a behavioural predicate, audit the
  predicate against real call sites in-tree before escalating
  severity. Don't escalate `warn` → `error` on synthetic-test
  confidence alone.
- **`@types/estree` is not transitively self-declaring.** A
  workspace that imports `import type * as ESTree from 'estree'`
  needs `@types/estree` in its own `devDependencies` — knip flags
  the unlisted dep. Small but live instance.
- **SHA references in the commit that creates them are unstable.**
  Amending a commit to record the commit's own SHA shifts the SHA
  again, recursively. Owner's correction: don't couple plan docs
  to commit SHAs. Keep cross-references symbolic (phase names,
  lane IDs). Watchlist candidate for pattern extraction if a
  second instance surfaces. File-level candidate name:
  `plan-and-commit-are-independent-systems`.
- **Commitlint body-max-line-length: 100 enforces wrap in message
  bodies.** A commit message body with 100+ char lines (e.g. full
  plan file paths) is rejected. Convention: use unqualified file
  names in commit bodies when the context is clear; full paths
  only when disambiguation matters and can be broken across lines.

### Mistakes Made

- **Initial plan over-counted files (11 vs 12).** My plan table
  listed 6 plugin+governance + 5 workspace = 11 files. Actual:
  12 (I had forgotten to count `recommended.ts`'s edit as separate
  from the new-file pair). Added `@types/estree` dep-declaration
  edit during execution → 14 staged. Lesson: when enumerating
  files to touch during planning, walk the import graph too, not
  just the semantic deliverables.
- **First commit subject had plan-file paths in the body that
  exceeded 100 chars.** Commitlint rejected. Retry with shortened
  paths was clean. Could have caught this by eyeballing line
  lengths before invoking commit.
- **Amended to add SHA, then had to amend again to remove SHA.**
  Three amend cycles before settling on "delete the SHA entirely."
  Owner's course-correction arrived on the third, made the
  principle obvious in retrospect. Could have asked before the
  first amend.

### Key Insight

**Reviewer audit of real code beats synthetic test confidence.**
Phase 5's test suite was 16 valid + 5 invalid cases — structurally
complete but synthetic. fred's review of actual emitter shapes
surfaced a real false positive (span-based emission) that the tests
didn't cover. Before escalating any behavioural lint rule from `warn`
to `error`, audit the predicate against real in-tree call sites. The
`warn` phase exists precisely so this audit can happen before the
rule blocks CI.

### Watch Items

- **E2E flakiness under parallel `pnpm check` load.** Two separate
  `pnpm check` runs produced two DIFFERENT E2E test failures
  (`enum-validation-failure.e2e.test.ts` timeout;
  `built-server.e2e.test.ts` unexpected 404), each passing cleanly
  in isolated e2e runs (all 24 files, 161 tests green in ~4s). Not
  caused by Phase 5 (lint-only). Pattern: parallel-load inter-test
  race (shared port? cache invalidation?). Per PDR-025 this is a
  test-stability lane, not a pre-existing dismissal. Watchlist —
  named lane if a second session confirms.
- **Asymmetric rule registration in `recommended.ts`'s inline
  plugin.** `no-export-trivial-type-aliases` is exported from the
  plugin's `rules` record (src/index.ts) but NOT registered in the
  inline `@oaknational` plugin in `recommended.ts` — so it's
  name-resolvable only if a workspace imports the plugin's default
  export. Cosmetic inconsistency; mention to docs-adr-reviewer if
  it compounds.

---

## 2026-04-19 — Docs-hygiene parallel track (3 reviewer rounds, fix-and-ship)

### What Was Done

Three rounds of reviewer-driven docs hygiene on the
onboarding/Practice surface, layered on top of the observability
work-in-progress branch (`feat/otel_sentry_enhancements`,
working tree on top of `d0cfaeea`). Round 1 dispatched the
onboarding-reviewer + docs-adr-reviewer at the root README;
Round 2 fixed everything Round 1 surfaced, then re-dispatched
onboarding-reviewer; Round 3 fixed everything Round 2 surfaced.
Substantive outputs:

- PDR-001 supersession marker present in both Status block and
  Decision section; Related field deduped; ADR-131/ADR-144 titles
  in host-local context corrected.
- AGENT.md back inside its `fitness_line_limit` (268/275 fitness
  lines) after a Round 1 condensation pass that overshot to 287
  and a Round 2 prose-line-width fix at line 143.
- `practice-index.md` surface counts refreshed against actual
  filesystem (25 rules / 12 commands / 23 skills).
- Legacy stdio mentions removed from onboarding paths
  (`README.md` directory table, `quick-start.md` architecture
  diagram, `troubleshooting.md`, `environment-variables.md`).
- E2E (mocks/DI, no creds) explicitly separated from credential-
  requiring smoke / search / OAuth workflows in
  `troubleshooting.md` and `environment-variables.md`.
- `apps/oak-curriculum-mcp-streamable-http/README.md` and
  `apps/oak-search-cli/README.md` gained "New here?" repo-
  onboarding signposts at the top (Round 3 reciprocity fix).
- Stale CLI commands repaired:
  - `pnpm qg` → `pnpm check` in `apps/oak-search-cli/README.md`
    (the `qg` script does not exist; canonical is `check`).
  - `pnpm es:setup reset` → `pnpm es:reset` in
    `troubleshooting.md` (the `reset` positional arg was never
    a real script form; the alias is `es:reset`).
- ADR-144 filename/title divergence (`-two-threshold-fitness-model.md`
  filename + "Three-Zone Fitness Model" title) annotated in the
  ADR index so path-based navigation does not surprise readers.

`pnpm practice:fitness` baseline unchanged: `HARD: 2 hard, 12
soft`. Both hards (`principles.md` characters,
`testing-strategy.md` lines + 2 prose-width lines) are
pre-existing and untouched by this work.

### Surprise

- **Expected**: a single round of reviewer-driven docs cleanup
  would clear the Practice/onboarding surface to defensible.
- **Actual**: three rounds were required, and each round caught
  something the previous round did not, including
  self-inflicted regressions from the previous round's own
  fixes (Round 2 caught a 106-char prose-line-width violation
  Round 1 introduced; Round 3 caught a stale `pnpm qg` reference
  in a workspace README that no prior round had visited).
- **Why expectation failed**: docs hygiene work has the same
  shape as code refactoring — fixes can introduce new defects
  whose discovery surface is not the same as the original
  defect's discovery surface. A reviewer scoped to "the root
  README onboarding journey" will not naturally walk into a
  workspace README, and a reviewer scoped to "the file we just
  edited" will not catch a width violation introduced by the
  edit unless explicitly asked.
- **Behaviour change**: when a docs-hygiene pass touches more
  than ~5 files, plan for ≥2 review rounds from the outset, and
  on each round dispatch the reviewer to the *path* (entry
  point → leaf), not to the *files known to have changed*.

### Surprise

- **Expected**: numbered claims in Practice surface docs (rule
  count, command count, skill count, pattern count) would
  drift one or two at a time, caught reactively when they
  failed a sanity check.
- **Actual**: four numbered claims drifted simultaneously and
  silently in a single document (`practice-index.md`): pattern
  count (claimed 56/57, actual 77 — a previous session caught
  this); rule count (claimed 34, actual 25); stable command
  count (claimed 10, actual 12); skill count (claimed 27,
  actual 23). All four lived together for an unknown but
  non-trivial number of sessions.
- **Why expectation failed**: no fitness function ties a
  written numeric claim to its source enumeration (the
  filesystem). Numbered claims are write-once and never
  re-validated against reality unless a human reads them
  carefully. The mental model of "numbers drift one at a time"
  was wrong; they drift in clusters because the same writer
  often updates several at once and then nobody re-checks.
- **Behaviour change**: when authoring or editing a numbered
  claim about a filesystem-discoverable population (rules,
  skills, commands, patterns, ADRs, PDRs), include the count
  in the same edit as a verification command (e.g.
  `ls .agent/rules/*.md | wc -l`) and either commit the
  command output as a comment or replace the literal count
  with a script-rendered placeholder. Watch-list candidate
  for pattern extraction if a second cross-session instance
  surfaces; extraction trigger = next consolidation finds a
  third or later occurrence.

### Surprise

- **Expected**: workspace READMEs and root-level onboarding
  docs would already form a closed loop, since the root README
  routes into them.
- **Actual**: routing was one-way. Root README →
  `apps/*/README.md` worked, but the workspace READMEs had no
  back-link to `CONTRIBUTING.md`, `quick-start.md`, or
  `AGENT.md`. A contributor who lands in a workspace README
  via an external link or a `cd` from the terminal loses the
  global onboarding context.
- **Why expectation failed**: I assumed reciprocity because
  the first hop was present. Reciprocity is a property of the
  *pair*, not of either side; verifying the outgoing link does
  not verify the return link.
- **Behaviour change**: when adding a cross-link from A to B,
  also check whether B should reciprocate to A (or to A's
  parent index). If the link is part of an onboarding mesh,
  the answer is almost always yes. Other apps in this repo
  (e.g. `apps/oak-curriculum-mcp-stdio`-style workspaces if
  any future ones are added) should default-include a
  back-link block.

---

## 2026-04-19 — Surprises from the consolidation pass itself

Two corrective observations surfaced while running the 2026-04-19 deep
consolidation (commits 2dc4d40b + d0cfaeea):

1. **The "known-deferred hard zone" was under-counted.** Prior handoffs
   tracked three foundational directives (AGENT.md, principles.md,
   testing-strategy.md) as the deferred hard-zone population. Step 9
   fitness surfaced three more: the Core trinity (practice-bootstrap,
   practice-lineage, practice.md) was also hard, and had been for
   multiple sessions without explicit acknowledgement in the handoff
   chain. Owner-directed resolution: raise limits modestly; defer
   full Core refinement to a dedicated future session. Rule extracted:
   fitness-state claims in handoffs must enumerate EVERY hard-zone
   file by name, not summarise as "the three deferred directives".
   Incomplete enumeration lets new hard-zone members accumulate
   silently. Watchlist for pattern extraction if a second instance
   surfaces.

2. **Outgoing PDR reservations create a soft coupling that can be
   missed under consolidation.** My PDR-025 draft (Quality-Gate
   Dismissal Discipline) conflicted with a slot reserved in
   `.agent/practice-context/outgoing/README.md` for
   Three-Zone Fitness Model. The reservation was authored 2026-04-18
   and not surfaced to me before I drafted. Resolved by shifting
   reservations to 026-029. Candidate rule: any consolidation that
   may produce a new PDR should grep outgoing/ for reserved PDR
   numbers before choosing the next-in-sequence. Single instance;
   watchlist.

Both surprises are consolidation-meta — observations ABOUT running the
pass — rather than direction-correcting for the technical tracks.
They're recorded here so the capture→distil→graduate→enforce pipeline
can process them next consolidation if a second instance surfaces.

---

## 2026-04-19 — Napkin rotation after deep consolidation pass

Rotated at 533 lines after a structural-change-heavy window covering
four commits on the observability strategy restructure (2e0be715 Phase
4, f1f2c259 status markers, 7f5b18e7 5-wave reshape, 2e8a140d physical
reorder) plus parallel ChatGPT research normalisation work. Archived
to [`archive/napkin-2026-04-19.md`](archive/napkin-2026-04-19.md).

High-signal entries absorbed this rotation:

- **Patterns extracted** (three new files in
  [`.agent/memory/patterns/`](patterns/)):
  - `stage-what-you-commit.md` — 2 cross-session instances (2026-03-24
    + 2026-04-19). Git index is durable state between edits; inspect
    `git diff --cached` before committing.
  - `foundations-before-consumers.md` — owner-approved. Multi-emitter
    plans must land foundations (schemas, ESLint rules, extracted
    cores) in earlier waves than their consumers, or every consumer
    retrofits. Related: `warning-severity-is-off-severity`.
  - `collapse-authoritative-frames-when-settled.md` — owner-approved.
    Document-structure-layer instance of the no-smuggled-drops
    principle: multiple authoritative frames for the same concept are
    a drift trap; "transitional dual-frame with sunset note" is
    unstable.
- **Distilled additions**:
  - Forward-pointing planning references need "planned, not yet code"
    markers (watchlist; single instance pending cross-session
    validation).
- **Step 7 graduations applied**:
  - `@ts-expect-error` distilled entry **refined** (owner chose
    refine-and-keep) to emphasise the test-design-specific scope
    distinct from PDR-020's RED-phase framing.
  - `All gates blocking, no "pre-existing" exceptions` distilled
    entry **graduated to PDR-025 Quality-Gate Dismissal Discipline**
    (owner-approved). Distilled entry pruned; PDR-025 pointer added
    to the distilled pointer block.
- **Step 8 Core amendment applied**:
  - `practice-lineage.md` Active Learned Principle
    `Compressed neutral labels smuggle scope and uncertainty`
    **extended** (owner-approved) to cover the document-structure
    layer as a third sibling alongside review and planning layers.
    Paired with the new `collapse-authoritative-frames-when-settled`
    pattern as the concrete application.

**Plans and prompts touched this rotation**:

- `.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`
  — Status line + Phase 3 todo note corrected to reflect completion;
  Phase 4 todo note extended with the three post-Phase-4 hardening
  commits (status markers; 5-wave reshape; physical reorder).
- `.agent/practice-core/decision-records/README.md` — PDR-025 entry.
- `.agent/practice-core/CHANGELOG.md` — 2026-04-19 entry recording
  PDR-025, principle extension, pattern authorship, fitness limit
  raises.
- `.agent/practice-context/outgoing/README.md` — future-PDR
  reservations shifted +1 (PDR-025 claimed by Quality-Gate Dismissal;
  fitness-functions / transfer-operations / merge-methodology /
  practice-maturity reservations now 026–029).

**Fitness state at rotation closure (post step 9)**:

- **Core trinity limits raised modestly** per owner direction
  ("raise somewhat, not totally; defer full refinement and
  reflection of the Core to another session"):
  - `practice-bootstrap.md`: target 590 → 680, limit 750 → 830,
    chars 31000 → 40500.
  - `practice-lineage.md`: target 590 → 680, limit 725 → 830,
    chars 36000 → 48500.
  - `practice.md`: chars 23000 → 29000 (lines unchanged at 375/500);
    prose-line-width violation at line 201 fixed by wrapping.
- **Post-raise strict-hard state**: 3 hard items (AGENT.md,
  principles.md, testing-strategy.md) — matching the known-deferred
  directives; no new hard violations introduced. Trinity files now
  soft-zone, not hard.
- **Deferred to future session**: full refinement and reflection of
  the Core trinity (compression, graduation, split decisions);
  remediation of the three deferred directives.
- `distilled.md` final at ~253 lines (soft zone, target 200, limit
  275) after prune + refine + watchlist-add.
- `napkin.md` starts fresh at this rotation record.

**Previous rotation**: 2026-04-18 at 557 lines →
[`archive/napkin-2026-04-18.md`](archive/napkin-2026-04-18.md).

---

## 2026-04-19 — Agentic corpus discoverability review

### Patterns to Remember

- `AGENT.md` already points to ADRs generally (starter block, ADR index, and a
  few specific ADR anchors), but that is not the same as surfacing the
  practice-specific ADR cluster explicitly. If the intent is "agentic doctrine
  should be impossible to miss", add a dedicated practice-ADR cluster rather
  than assuming the general ADR entry path is enough.
- `.agent/reference/README.md` currently omits
  `agentic-engineering/workbench-agent-operating-topology.md`, and there is no
  `agentic-engineering/README.md`. A source corpus can exist without becoming
  discoverable; directory-local indexes matter.
- `docs/README.md`, `docs/foundation/README.md`, `docs/governance/README.md`,
  `docs/engineering/README.md`, `docs/architecture/README.md`, and
  `docs/explorations/README.md` already form a useful human-facing discovery
  mesh. A future agentic hub should index these as source/discovery surfaces
  rather than trying to replace them.

## 2026-04-19 — Agentic corpus implementation notes

- The first implementation batch created the local `.agent` mesh:
  source/current plan, active execution plan, hub README, seed deep dives,
  research lanes, reports lanes, and reciprocal links from the key `.agent`
  indexes.
- Multiple agents are editing the repo concurrently. Before touching any
  overlapping docs surface, re-read the live file and inspect the diff rather
  than assuming the earlier snapshot is still current. Materialised here on
  `docs/foundation/README.md`, `docs/governance/README.md`, and
  `docs/architecture/architectural-decisions/README.md`.
- Treat concurrent edits as a merge problem, not a justification to pause the
  whole lane. Only escalate if the overlapping change directly changes the same
  concept contract this lane needs to edit.
- Closure state for this lane:
  - `pnpm markdownlint:root` passed.
  - `pnpm practice:fitness:informational` still reports the known pre-existing
    directive/core-document issues rather than anything introduced here.
  - `pnpm check` reached `knip` and then failed on an unrelated concurrent code
    change in `packages/core/oak-eslint/src/rules/require-observability-emission.ts`
    (`estree` unlisted dependency). Treat that as out of scope for the
    documentation lane unless the owning implementation asks for help.
  - Final `docs-adr-reviewer` pass was requested after the validation run so the
    review reflects the true end state plus the validation caveat.
  - Follow-up `docs-adr-reviewer` confirmation after the last fixes reported no
    remaining documentation findings in the touched lane files.

## 2026-04-19 — Operational awareness planning notes

### Patterns to Remember

- The continuation prompt's size and mixed content are at least partly the
  result of utility. Treat the current surface as evidence of a missing
  operational-awareness layer, not as a hygiene failure to be "cleaned up"
  blindly.
- Multi-agent continuity hygiene must be thread-aware. A single shared mutable
  prompt is the wrong default home for tactical coordination once parallel
  tracks are normal.
- The missing layer is short-horizon operational awareness, not a replacement
  memory doctrine. Tactical state that changes understanding should promote
  into the existing learning loop rather than evolving into a second memory
  system.

## 2026-04-19 — Workbench topology extraction notes

### Patterns to Remember

- `workbench-agent-operating-topology.md` is broader than the continuity
  problem that first pulled it into view. It is a compact map of interaction
  planes, control-loop stages, posture selection, temporary work ledgers,
  authority order, and special feeds.
- Utility-rich surfaces bloat when the underlying mechanism family lacks a
  named home. The continuation prompt absorbed a work ledger; reviewer gateway
  work is absorbing posture selection and signal routing; evidence discipline
  is split across several surfaces.
- The right response is routing, not flattening:
  - operational-awareness plan for work-ledger and precedence concerns
  - reviewer-gateway plan for review posture and signal routing
  - future mechanism-taxonomy plan for the broader abstraction work

## 2026-04-19 — L-EH initial lane (preserve-caught-error enable)

### What Was Done

- Re-scoped L-EH initial from authoring a custom `require-error-cause`
  ESLint rule in `@oaknational/eslint-plugin-standards` to enabling
  ESLint core's built-in `preserve-caught-error` (added in 9.35.0,
  a documented superset). Owner prompt "please look at the built-in
  first" triggered the survey; finding: repo already runs
  eslint@^10.2.0 and @eslint/js@^10.0.1, so the rule was available.
- Enabled at `error` severity with `requireCatchParameter: true`
  scoped to `src/**/*.ts` in the 5 Wave-1 workspaces. Pre-enable
  audit: **0 violations** across all 5 workspaces.
- Reviewer matrix: code-reviewer + architecture-reviewer-fred.
  Fred's primary TO-ACTION flipped `warn` → `error` mid-lane (audit
  condition pre-satisfied; `warn` with no named backlog trigger
  violates `warning-severity-is-off-severity.md`). ACTIONED.
- Incidental: my first-draft preamble comment referenced the literal
  `eslint-disable-next-line` directive syntax and the
  `@oaknational/no-eslint-disable` rule name — both matched the
  `@oaknational/no-eslint-disable` rule's own matcher regex when
  present in a comment. Rewrote to reference ADR-162 History for the
  opt-out protocol instead.
- Docs propagation: maximisation plan (multiple sections), high-level
  plan, restructure plan, strategic parent, ADR-162 History,
  `use-result-pattern.md` expanded 5→20 lines.
- `pnpm check` exit 0 (88/88 tasks) at `error` severity.
- Commit pending owner approval. 12 files in scope, isolated from
  the parallel agentic-engineering track.

### Surprise

- **Expected**: L-EH initial would be a straightforward reuse of the
  Phase 5 `Rule.RuleModule` authoring pattern — write a custom
  `require-error-cause` rule mirroring `require-observability-emission`.
- **Actual**: before I opened the rule file, owner surfaced
  `preserve-caught-error` as an ESLint-core built-in added in 9.35.0.
  It is a documented **superset** of the planned custom rule's
  predicate — catching missing cause, cause-mismatch, destructured-
  parameter loss, and variable shadowing; the planned custom rule
  would have covered only the first two.
- **Why expectation failed**: I read the Phase 5 handoff's "natural
  first-pick: reuses the validated authoring pattern" as a
  *recommendation* when it was actually the handoff author's
  *convenience ranking*, not an architectural assertion that the
  authoring was required. A 30-second check of ESLint's recent
  releases would have surfaced the built-in before the plan
  committed to authorship.
- **Behaviour change**: before authoring any custom rule (ESLint,
  typescript-eslint, or any upstream tool), spend the 30 seconds
  needed to scan the upstream's recent release notes and rule/feature
  index. "Custom authorship is the default because Phase 5 did it"
  is a wrong default. Phase 5's custom rule has no upstream
  equivalent; L-EH initial did. The distinction is visible only when
  you check.

### Surprise

- **Expected**: a comment in an `eslint.config.ts` that describes a
  rule's opt-out protocol (`// eslint-disable-next-line <rule-name>
  -- <reason>`) is benign — comments are not parsed as code.
- **Actual**: `pnpm check` failed with 2 errors per workspace from
  `@oaknational/no-eslint-disable`. The rule's matcher regex
  (`/eslint-disable(?!d)(?:-next-line|-line)?(?!\w)/u`) scans comment
  *text* and matched the literal string inside my explanatory
  comment. The rule also matched `@oaknational/no-eslint-disable`
  itself (i.e. the rule's own name referenced in the same comment)
  because the regex matches `eslint-disable` regardless of what
  precedes it.
- **Why expectation failed**: I treated the rule's scan surface as
  "actionable suppression directives in comments" when the actual
  scan surface is "any comment text matching the regex, with an
  approval-marker exception."
- **Behaviour change**: code-configuration comments that document a
  rule's opt-out syntax, or that name the rule itself, must avoid
  the literal trigger strings. Use references to external docs
  (ADR sections, URLs) instead. Single-instance pattern candidate;
  second instance would promote to `.agent/memory/patterns/` as
  "code config must not reference its own suppression syntax in
  comments."

### Surprise

- **Expected**: a lint rule landed at `warn` with "escalate once
  audit is clean" as the escalation trigger is a defensible soft-
  launch shape, matching the Phase 5 `require-observability-emission`
  precedent.
- **Actual**: architecture-reviewer-fred's TO-ACTION applied
  `warning-severity-is-off-severity.md` and
  `foundations-before-consumers.md` against my own plan text. The
  pattern is explicit: a lint configuration should contain only
  `'error'` and `'off'`. With 0 violations and no concrete backlog
  trigger, the `warn`-with-deadline was vacuous before the rule even
  shipped. `warn` would have left Wave 3's future catch-throw-new
  code at risk of landing non-conformant and scrolling past in CI
  output.
- **Why expectation failed**: I defaulted to the Phase 5 precedent
  (warn with named escalation trigger = "Phase 2 emitter lanes land")
  without checking whether L-EH initial had an analogous trigger. It
  didn't. Phase 5 was a precedent-match for rule *infrastructure*;
  it was not a precedent-match for *severity semantics*. Two
  different axes of decision, conflated.
- **Behaviour change**: when mirroring a precedent, decompose the
  precedent into its constituent decisions before reusing. Phase 5's
  severity choice, scope choice, and wiring pattern are three
  independent decisions that happened to land together. Reuse each
  only if its rationale applies in the new lane. Second instance of
  "reviewer real-code audit catches a plan's own blind spot" (first
  instance: Phase 5 span-predicate gap). Promotion candidate to
  distilled.md.

### Observation (not a surprise — a positive signal)

- **Expected**: at audit time, find violations needing fixes.
- **Actual**: 0 violations across 5 workspaces' src/. Sample of 3
  real catch+throw-new sites in `oak-curriculum-sdk` all passed
  `{ cause }` correctly.
- **Interpretation**: ADR-088 Result pattern + the (previously 5-line)
  `.agent/rules/use-result-pattern.md` are observably followed in
  practice without being compile-time-enforced. The compile-time gate
  now ratifies existing behaviour rather than correcting it — the
  *good* case for foundations-before-consumers. Worth noting because
  it's easy to assume unenforced rules are routinely violated; in
  this case, the evidence says otherwise.

## 2026-04-19 — Abstract governance-concept extraction notes

### Patterns to Remember

- When importing ideas from an external governance corpus, the durable value is
  usually the **mechanism semantics**, not the source taxonomy. If the repo
  keeps the source names, the work has not really been integrated.
- The most useful comparative insights here were governance-plane concepts:
  decision layers outside reasoning, boundary models, layered safeguards,
  supervised execution, attempt / observed outcome / proven result structure,
  residual-risk surfaces, adoption ladders, and signal ecology.
- Many "new" concepts are actually local capabilities that are already present
  but unnamed. The route is often `present but unnamed` or `partial`, not
  `missing`.
- A good abstracted import pass must force a destination for every concept:
  existing plan, future plan, reference/deep dive, doctrine candidate, or
  explicit no adoption. Otherwise the work becomes a clever but homeless
  comparison exercise.
