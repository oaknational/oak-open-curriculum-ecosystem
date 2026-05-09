---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
merge_class: append-only-narrative
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-07-doctor-safe-merge.md`][archive-pass]. The prior
rotation is
[`napkin-2026-05-06-evening-graduation-pass.md`][previous-pass].

[archive-pass]: archive/napkin-2026-05-07-doctor-safe-merge.md
[previous-pass]: archive/napkin-2026-05-06-evening-graduation-pass.md
[graph-planning-pass]: archive/napkin-2026-05-07-graph-mvp-planning.md

The graph MVP-arc planning observations from Windward Darting Horizon,
Pelagic Rolling Harbour, and Breezy Navigating Sail are preserved in
[`napkin-2026-05-07-graph-mvp-planning.md`][graph-planning-pass].

The previous two archived napkins still need a deep analysis and
consolidation pass before treating their captured material as fully
homed: [`napkin-2026-05-07-doctor-safe-merge.md`][archive-pass] and
[`napkin-2026-05-06-evening-graduation-pass.md`][previous-pass].

## 2026-05-07 — Doctor safe-merge consolidation / codex / GPT-5 / `019e03`

### Rotation Summary — memory/state doctor safe-merge arc

This consolidation rotated the active napkin after it crossed the critical
fitness threshold. The outgoing napkin is preserved verbatim in
[`napkin-2026-05-07-doctor-safe-merge.md`][archive-pass].

Distilled behaviour changes from the rotation:

+ focused validation lanes must prove they selected tests;
+ fixture-slice branches need literal fixtures;
+ generated read models must be refreshed after event writes;
+ portability review must include examples and narrative, not only normative
  prose;
+ git index operations are serial commit-window work, not parallel work;
+ deleted live state is gone and should not remain a continuity topic.

The memory/state substrate doctrine and merge semantics are already durable in
PDR-049, PDR-050, the local substrate contract, and the archived doctor plan.
The consolidation therefore did not create a new ADR or PDR. Future arcs remain
repair mode and consolidation integration, each requiring its own plan.

## 2026-05-07 — Sonar remediation follow-up / codex / GPT-5 / `019e03`

### Practice/tooling feedback

+ **Surface**: `agent-tools:collaboration-state claims open`
+ **Signal**: bug / recurrence
+ **Observation**: Repeated `--area-pattern` flags still behave as
  last-write-wins. During the Sonar remediation claim I supplied four
  patterns, but the persisted claim retained only the final
  `.agent/state/collaboration/**` pattern. I manually edited
  `active-claims.json` to restore the intended areas.
+ **Behaviour change / candidate follow-up**: F-14 in
  `.agent/plans/agent-tooling/frictions-register.md` now has a fresh
  recurrence note and should be treated as a real CLI bug: either make
  `--area-pattern` repeatable like `--file`, or reject repeated usage
  with an explicit error and full help.

The single small new pending-graduations entry from this
napkin pass — Briny's "/doctor is session-local evidence, not
a shell gate" behavioural correction — is added directly to
[`pending-graduations.md`](../operational/pending-graduations.md)
as part of Step 2 processing.

### Session-shape note: Step 1 of the opener completed; Step 2 (pending-graduations) follows

This session uses checkpoint-commit discipline between Steps 1
and 2 to keep the diff readable and let the napkin-graduation
batch land cleanly before the larger pending-graduations walk
begins. Step 2 may not fully drain in this session — that is
honest output per the opener; the residual queue substance
becomes the next audit's input rather than this session's brake.

## 2026-05-07 — PR 102 snagging close / codex / GPT-5 / `019e03`

### Surprise: green checks do not exhaust the PR feedback surface

**Expectation**: after PR #102 snagging landed, GitHub checks and Sonar
would be the closeout verification surface.

**What happened**: the checks all passed and Sonar became clean, but the
owner explicitly named a separate next-session duty: fetch remaining PR
comments and analyse them. The four known Copilot review threads are
obsolete/outdated, yet top-level comments, review summaries, or newly
created comments can still carry live feedback outside that check surface.

**Insight**: PR closeout has two distinct evidence loops: gate state and
reviewer-comment state. A green PR can still need a comment-harvest pass
before the next edit. This reinforces the existing PR lifecycle skill
promotion watchlist rather than creating a new ADR/PDR candidate.

**Behaviour change**: the next `planning/graph-tooling` session starts by
fetching PR #102 top-level comments, review summaries, review threads with
resolved/outdated state, and Sonar/check state, then classifies comments
before editing.

## 2026-05-07 — PR 102 follow-up and lint hardening close / codex / GPT-5 / `019e03`

### Practice/tooling feedback

+ **Surface**: `@oaknational/eslint-plugin-standards` self-lint
+ **Signal**: insight
+ **Observation**: adding `@typescript-eslint/no-deprecated` to the package
  self-lint immediately caught the deprecated `typescript-eslint.config()`
  helper in the shared config exports. Replacing it with ESLint core
  `defineConfig()` was straightforward for standard plugins, but the local
  `@oaknational` plugin had to stay in a separately typed
  `TSESLint.FlatConfig.Config` segment because core `defineConfig()` expects
  the newer ESLint plugin type surface.
+ **Behaviour change / candidate follow-up**: keep new candidate rules in the
  self-lint lane when practical: they are useful for surfacing maintenance
  drift early. When core ESLint helper types do not accept a local plugin
  typed through `@typescript-eslint/utils`, split the config at the type
  boundary rather than weakening the plugin type.

## 2026-05-08 — PR 102 fresh-session handoff / codex / GPT-5 / `019e03`

### Surprise: PR metadata is an active review surface, not a wrapper

**Expectation**: after code/config/documentation fixes land, the remaining PR
work is source comments and quality gates.

**What happened**: the PR body still described the branch as
"Documentation-only / Low Risk" even though the current diff now includes
agent-tools runtime code, Oak ESLint config changes, and search/codegen
generator edits. Copilot correctly flagged the PR description itself as a live
review issue.

**Insight**: PR title/body need the same source-of-truth discipline as code
comments: when branch scope changes, stale metadata can mislead reviewers and
become an actionable defect. A comment-harvest pass should classify PR metadata
comments separately from source-code comments.

**Behaviour change**: the next PR #102 session rewrites title/body after
`origin/main...HEAD` comparison before disposing the metadata comment as
`fixed`. No ADR/PDR candidate: this reinforces existing review-surface
discipline rather than changing governance.

## 2026-05-08 — PR 102 final closeout / codex / GPT-5 / `019e06`

### Practice/tooling feedback

+ **Surface**: `agent-tools:collaboration-state claims open`
+ **Signal**: friction
+ **Observation**: The session-open claim attempt used `--area-kind file`,
  mirroring the natural language of "file paths", but the CLI accepts
  `files`, `workspace`, `plan`, `adr`, or `git`. The command failed cleanly
  with `unsupported area kind: file`, and the schema confirmed `files` is the
  correct area kind for explicit file path lists.
+ **Behaviour change / candidate follow-up**: Prefer checking
  `active-claims.schema.json` or `claims open --help` before authoring claims
  from memory. If this repeats, consider making the CLI error list the accepted
  values.

### Surprise: ground-truth generation needs real bulk data present

**Expected**: rerunning the ground-truth generator after a schema-emitter fix
would refresh only the generated schema/docstring surfaces.

**Actual**: the first direct generator invocation ran against an empty
`apps/oak-search-cli/bulk-downloads` directory and collapsed the generated
lesson data to zero lessons. Running the real `bulk:download` composition root
with `BULK_DOWNLOAD_DIR=bulk-downloads` fetched the 30 bulk files and the
post-download generator restored the 12,391-lesson generated data shape.

**Why expectation failed**: the generator is source-of-truth, but it is only
valid when its source data directory is populated. A code-only generator run in
a sparse checkout can produce structurally valid but semantically empty output.

**Behaviour change**: for ground-truth generated files, use the full
download-then-codegen path when local bulk data is absent; verify
`Total lessons: 12391` or equivalent before trusting generated output.

### Surprise: merge-ready can still be planning-blocked

**Expected**: once PR #102 technical checks, review threads, Sonar, and PR
metadata were clean, the branch would be ready to merge.

**Actual**: owner direction added a stronger pre-merge gate: the branch should
not merge until the graph MVP plans themselves are finalised and
decision-complete. The remaining blockers are not PR mechanics; they are plan
truthfulness issues: topology findings, slice-plan findings, and the EEF t19
contradiction.

**Why expectation failed**: I treated "merge-ready" as a property of the pull
request surface. For planning branches, the merge gate can also be a property
of the planning artefacts' decision completeness.

**Behaviour change**: when closing a planning PR, report two verdicts
separately: PR technical readiness and plan decision-completeness. Do not let a
green PR collapse unresolved planning questions into implicit acceptance.

### Handoff note: remote metadata is part of the state transition

**Observation**: after the closeout commits were pushed and the final
`emit-index.ts` review thread was resolved, the PR body and continuity files
still described the pre-push state.

**Behaviour change**: when a closeout changes from local/pending to pushed,
refresh the live PR body and next-session records in the same handoff pass so
the next session does not inherit stale blockers.

## 2026-05-09 — Fronded Bending Blossom / cursor / Composer / `60775a` (workspace topology session)

### What worked

+ Owner pushed unbundling **“codegen”** into explicit pipeline stages
  (**S0–S6**) plus three producer roles; the strategic plan is now the
  durable capture surface until the superseding ADR is drafted.
+ **Multi-stage** workspace membership as a **review signal** (not automatic
  shame) matches how `core` and mixed CLI apps actually behave.

### candidate: adr:supersedes-108-workspace-topology

Registered in `pending-graduations.md` 2026-05-09; plan file:
`architecture-and-infrastructure/future/monorepo-workspace-topology-adr-and-canonical-plan.plan.md`.

### Owner direction — sequencing (2026-05-09)

+ **Next**: graph MVP **implementation** (after PR #102 merge prep / gates).
+ **Later**: reopen repo topology / superseding-ADR-108 work — candidate stays
  `pending` with explicit sequencing note in `pending-graduations.md`.

## 2026-05-09 — Synthesis Pass Marker / Luminous Twinkling Dawn / claude-code / Opus 4.7 / `c03c02`

Luminous Twinkling Dawn ran the historical-napkin-synthesis pass over the
current napkin plus the three prior archived rotations
(`napkin-2026-05-06-evening-graduation-pass.md`,
`napkin-2026-05-07-graph-mvp-planning.md`,
`napkin-2026-05-07-doctor-safe-merge.md`) per `/jc-consolidate-docs`
Step 6a, owner-directed fitness-blind. Synthesis report at
[`.agent/research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md`](../../research/agentic-engineering/continuity-memory-and-knowledge-flow/historical-napkin-synthesis-2026-05-09.md).

Twelve emergent findings; six rejected near-patterns. Routing applied:

+ **Three new patterns** under `.agent/memory/active/patterns/`:
  `comprehensive-cataloguing-drift.md` (anti-pattern; F2 — three-instance
  cross-artefact: spine + reviewer-pass + rule-extension);
  `long-arc-finish-line-not-tail.md` (pattern; F8 — three-instance: doctor
  arc, Sonar arc, skills arc); `mechanical-sequence-is-activity-bias-diagnostic.md`
  (anti-pattern; F9 — three-instance: Sonar bulk disposition, skills attempt-1,
  Windward minimal-application).
+ **Four new pending-graduations entries**: fitness-output inline-discipline-reminder
  (F1 cure 2); verify-reviewer-text-claims-against-diff (F3b);
  reviewer-convergence-points-at-conceptual-root (F3c);
  owner-bounded-reviewer-scope (F10).
+ **Existing pending-graduations updates**: `spine-drift-via-comprehensive-cataloguing`
  marked partially-graduated with cross-reference to broader pattern;
  `sequence-or-admit-not-doing` marked owner-gated three-corpus-window
  instances; `lifecycle-aware-fitness-model` cross-referenced.
+ **Owner-gated candidates surfaced** for separate decision (PDR-026
  amendment per F4; sequence-or-admit graduation target per F11; synthesis
  PDR `pdr_kind: pattern` consolidating F2 + F9 per F12).
+ **distilled.md** updated with §F1 meta-observation and §F4 status note;
  no entries pruned.

Source archived napkins not modified (verified by Phase H continuity check).

### Surprise: pre-commit gate scope is whole-tree, not staged-set

**Expectation**: a clean staged-set + clean staged-file markdownlint + clean
staged-file format-check would land the workflow-doc commit through the
husky pre-commit hook.

**What happened**: pre-commit ran `prettier --check .` and
`markdownlint --dot .` over the *entire* working tree. The first commit
attempt failed on MD038 in `repo-continuity.md` line 405 — a line introduced
by Cosmic Glowing Star's earlier commit, not mine. The second commit attempt
failed on prettier in `agent-tools/tests/skills-adapter-generate/fixtures/lock-malformed.json`
— a *parallel-agent's untracked WIP fixture* file, also not mine. Neither
defect was in my staged 2-file edit.

**Insight**: this is an architectural property of the repo's pre-commit
gate. `prettier --check .` and `markdownlint --dot .` are
*tree-scoped* not *staged-set-scoped*; any working-tree noise from any
agent (including untracked files from concurrent sessions running WIP
work) breaks every commit until that noise is cleaned. The class is a
coordination tax on multi-agent work: my clean change cannot land while
another agent's WIP is in progress, even though our changes don't touch
the same files.

**Behaviour change**: when pre-commit fails on a file outside the staged
set, the diagnostic is *gate scope*, not file content. The cure shapes
are: (a) narrow the gate to staged-set only (architectural change to the
hook); (b) coordinate via comms-event so concurrent-agent WIP is committed
or stashed before any of us tries to land; (c) accept the coordination
tax and queue commits to clean-tree windows. Captured as PDR/ADR
candidate below.

**ADR/PDR candidate**: pre-commit gate scope (whole-tree vs staged-set)
— ADR-shaped (host architectural property); affects every multi-agent
session. Capture in pending-graduations §6b below.

### Surprise: foreign-stage absorption recurred (4th documented instance)

**Expectation**: my staged 8-file output from the historical-napkin-synthesis
pass would commit under my own commit subject after pre-commit hooks ran.

**What happened**: my synthesis report (1 file) committed as `5071c8e6`.
Then before I could commit the remaining 7 files, Cosmic Glowing Star
absorbed them into their own session-handoff commit `c63e3816` (with
co-authorship attribution to me). Substance preserved; ceremony split
across two commits under different subjects.

**Insight**: this is the same shape Briny logged 2026-05-06 (3rd instance
in `Iridescent Waxing Orbit` 2026-05-06 thread record), Dawnlit logged
2026-05-05 (2nd), and the original at `cc8866a8` from earlier. Pattern
is durable: when two agents share a working tree and the staged-bundle
windows overlap, the first commit subject in the queue absorbs the
shared content. Cure named in `agent-collaboration.md` (`git commit --
pathspec` discipline) reduces but does not eliminate the recurrence —
the Cosmic Glowing Star commit honoured `git add -- pathspec` and *still*
absorbed because the pre-staged content was already in the index when
they ran their staging.

**Behaviour change**: nothing new — the cure is already named and the
recurrence is itself the diagnostic. Pattern is well-known. Recording
the 4th instance as evidence accumulation; no new graduation.

---

## 2026-05-09 — WS0 dispatch produced concrete cycle-shape correctives, not just nudges (Cosmic Glowing Star)

**Surprise**: I expected the four parallel WS0 reviewers to surface mostly proportionality WARNs and a small number of edge-case notes, given the plan had been authored carefully after attempt-1's failure note. Instead each reviewer (test, fred, docs-adr) returned at least one concrete BLOCKER plus multiple cycle-reshape WARNs. Aggregate: 3 BLOCKERs + 7 must-fix WARNs across 11 plan sections — substantial reshape, not a tightening pass.

**What this updates**: WS0's value is not only "catch the obvious failure mode before code". It is also "every reviewer lens shrinks a different part of the audit-shape surface". Test-reviewer caught literal-text assertions that read fluent in plan English; fred caught a deferred boundary decision the plan had explicitly written as "decide at write time"; docs-adr caught five missing propagation surfaces. Each was invisible to the other two lenses.

**Candidate** (`candidate:`): when a plan defers a substantive decision into "decide at write time" (WS2.3's import-vs-duplicate), that's not flexibility — it's a load-bearing decision the plan owner has declined to make, which the cycle author will then be forced to make under implementation pressure. WS0 turned the deferral into a structural choice (subprocess delegation) before any code was written. Pattern-name candidate: **"deferred-at-write-time decisions are unmade load-bearing decisions"**. Flag for next consolidation.

**Owner-direction substance affirmed**: locked decisions held under all four reviewer lenses. None surfaced primary-source evidence to reopen. The brief framing ("execution-legitimacy only, not design re-litigation") worked: reviewers respected scope without flattening their lens.
