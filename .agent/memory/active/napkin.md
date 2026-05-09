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
