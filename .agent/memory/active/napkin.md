---
fitness_line_target: 220
fitness_line_limit: 300
fitness_char_limit: 18000
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs, PDRs, rules, or archived napkins"
---

# Napkin

Active session observations. Distilled entries live at
[`distilled.md`](distilled.md). Pattern library is at
[`patterns/`](patterns/README.md). Cross-session pending graduations
live in
[`pending-graduations.md`](../operational/pending-graduations.md).

The most recent rotation is archived at
[`napkin-2026-05-06-evening-graduation-pass.md`][archive-pass];
the prior pre-step napkins are at
[`archive/napkin-2026-05-06-evening.md`](archive/napkin-2026-05-06-evening.md)
and
[`archive/napkin-2026-05-06.md`](archive/napkin-2026-05-06.md).

[archive-pass]: archive/napkin-2026-05-06-evening-graduation-pass.md

## 2026-05-06 — Clouded Lifting Aerie / claude-code / opus-4-7-1m / `1e2244`

### Rotation summary — graduation pass on five 2026-05-06 napkin sessions

This session executed Step 1 of the
`2026-05-06-napkin-and-pending-graduations-processing-opener.md`
opener: walked the prior rotation's five 2026-05-06 sessions
(Embered Melting Kiln, Briny Plumbing Fjord, Cindery Charring
Pyre, Umbral Cloaking Silhouette, Hidden Slipping Moth) and
routed substance to permanent homes per the always-graduate
rule. Boundary applied: substance > destination fitness.

Verified destinations as at archive time:

- Three new patterns landed in
  [`.agent/memory/active/patterns/`](patterns/README.md):
  - `consolidation-output-shape-pattern-vs-report.md` (process,
    pattern) — Briny's "one repeating shape across N findings →
    contract; N independents → report" diagnostic.
  - `audit-rule-body-on-prohibition-extension.md` (agent,
    pattern) — Hidden's lesson from extending
    `no-moving-targets-in-permanent-docs.md` and the rule body
    self-violating the new clause.
  - `in-session-contract-authoring-conditions.md` (process,
    pattern) — Hidden's three-condition gate for authoring a
    directive in the same session as the plan that proposes it.
- Patterns README index updated; Process count 29→31, Agent
  count 9→10.
- Markdown-prose-acceptance-criteria insight from Cindery
  landed in
  [`docs/governance/development-practice.md`](../../../docs/governance/development-practice.md)
  § Documentation Practice (one bullet, prose-vs-code-contracts
  doctrine).
- Friction register updates in
  [`frictions-register.md`](../../plans/agent-tooling/frictions-register.md):
  - F-15 added — commit-queue fingerprint recursion when claim
    file is in staged set; workflow-that-works documented.
  - F-14 evidence note appended — Clouded Lifting Aerie session
    reproducer of `--area-pattern` last-write-wins.
  - F-09 evidence note appended — Clouded Lifting Aerie session
    five-round-trip composition cost on `claims open`.
  - F-05 related-shape note appended — Hidden's `comms send`
    legacy-event-schema render failure; cure should extend to
    schema-shape mismatches not only parse failures.
- Archived to [`napkin-2026-05-06-evening-graduation-pass.md`][archive-pass]
  with full pre-archive content preserved.

Substance archived as instances-of-existing-rules (no new
graduation, just historical evidence preserved in archive):

- Embered: substance-trim mistake → already covered by
  [`learning-before-fitness.md`](patterns/substance-before-fitness.md)
  pattern; Embered's instance preserved in commit `40f7da45`
  ("re-add substance trimmed for fitness limits").
- Embered: review-fix-as-real-time → covered by user-memory
  `feedback_no_backfill_reviews`.
- Briny: doctrine-scanner vaporware → already in
  [`distilled.md`](distilled.md) preamble.
- Briny: learning-loop framing reframe → already in
  [`distilled.md`](distilled.md) preamble + plan exists.
- Briny: foreign-stage absorption recurrence → cure named in
  `agent-collaboration.md` directive (`git commit -- pathspec`);
  recurrence noted only.
- Umbral: reviewer-brief-scope-opens-closed-decision → covered
  by user-memory `feedback_reviewer_brief_respects_decided_scope`.
- Umbral: npx skills lifecycle → covered by user-memory
  `feedback_build_vs_buy_first`.
- Umbral: bootstrap fast-path missed → covered by
  `register-active-areas-at-session-open` rule.
- Hidden: `+` bullet misread as diff marker → small behavioural
  note; archived without graduation.

Surfaced for the next-audit input (per opener boundary):

- `agent-collaboration.md` extraction question — surfaced in
  commit `40f7da45` and `ca0794fc`'s body. Companion item
  retained in opener as "deferred to other sessions".
- `practice-bootstrap.md` recalibration question — companion
  item.
- `testing-patterns.md` stub question — companion item.

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
