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
