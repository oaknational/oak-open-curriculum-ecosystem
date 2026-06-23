---
name: "Graduation-Triage D1–D5 Amendment Drafts 2026-05-14"
overview: >
  Drafted-but-not-landed amendments for D1 through D5 from the
  graduation-triage-disposition-2026-05-14 plan. Owner reviews each
  diff before any commit. No amendment lands without owner approval.
todos:
  - id: d1-pdr-018-decision-complete-readiness
    content: "D1 draft: PDR-018 amendment — DECISION-COMPLETE is the readiness gate, not paperwork after execution."
    status: completed
  - id: d2-vendor-call-shape-verification
    content: "D2 draft: new rule .agent/rules/verify-vendor-call-shapes-at-plan-author-time.md OR PDR-018 amendment — owner picks shape."
    status: completed
  - id: d3-acceptance-value-proxies
    content: "D3 draft: testing-strategy.md OR principles.md amendment — acceptance value-proxies must compare against independent ground-truth measures. Owner picks home."
    status: completed
  - id: d4-pr-closeout-discipline
    content: "D4 draft: agent-collaboration.md new section PR Closeout Discipline (four entries)."
    status: completed
  - id: d5-pdr-015-multi-reviewer-audit-shape
    content: "D5 draft: PDR-015 amendment — each reviewer lens shrinks a different part of the audit-shape surface."
    status: completed
  - id: docs-adr-expert-review
    content: "Reviewer dispatch: docs-adr-expert review of D1–D5 drafts before owner final approval."
    status: completed
  - id: owner-review-cycle
    content: "Owner reviews each diff; agent applies each amendment in its own commit after approval."
    status: completed
    depends_on: [d1-pdr-018-decision-complete-readiness, d2-vendor-call-shape-verification, d3-acceptance-value-proxies, d4-pr-closeout-discipline, d5-pdr-015-multi-reviewer-audit-shape, docs-adr-expert-review]
isProject: false
---

# Graduation-Triage D1–D5 Amendment Drafts 2026-05-14

**Last Updated**: 2026-05-14
**Status**: ✅ COMPLETE — all five drafts (D1–D5) accepted verbatim
by owner per-diff review and landed. D1+D5 commit 22d1980d; D2 commit
54425b6d; D3+D4 commit 7821636b. Ready for archive.
**Collection**: `agentic-engineering-enhancements/current`
**Thread**: `agentic-engineering-enhancements`
**Authoring agent**: Riverine Swimming Hull / `claude` / `claude-opus-4-7-1m` / `304dde`

**Origin**: Promoted out of deferral from
[`graduation-triage-disposition-2026-05-14.plan.md`](graduation-triage-disposition-2026-05-14.plan.md)
§"Deferred to Next Session". Owner-approved scope for this session is
*draft D1–D5 for owner review per diff* — no amendment lands without
owner approval. Companion to Batches A/B/C which landed in the same
session.

## Context

Three distilled entries in §"Plan-author discipline reinforcement"
(2026-05-14 Sylvan Budding Forest distillation) plus the
2026-05-09 PR Closeout Discipline cluster and Multi-Reviewer Dispatch
Discipline entries identify five amendment-shaped substance items with
verified-novel content and clear permanent homes. Each is paragraph- to
short-section-sized; together they are too dense for a single review
pass. Owner reviews each diff independently.

## Mechanism

For each D, this document carries: (i) source citation; (ii) target
home; (iii) proposed amendment text **verbatim** as it would land; (iv)
fitness check (does it duplicate existing doctrine? does it carry
portability violations? does it conflict with an active plan?). Owner
applies a verdict per item: ACCEPT, REVISE, REJECT, or DEFER.

## D1 — PDR-018 §"DECISION-COMPLETE is the readiness gate"

**Source**: `.agent/memory/active/distilled.md` §"Plan-author discipline
reinforcement" entry 1 (2026-05-14 Sylvan Budding Forest distillation).

**Target**: [`.agent/practice-core/decision-records/PDR-018-planning-discipline.md`](../../../practice-core/decision-records/PDR-018-planning-discipline.md)
— amendment under existing planning-discipline content.

**Placement**: Insert as a new `### 2026-05-14 amendment — …` entry
inside PDR-018's existing `## Amendment Log` section (consistent with
the 2026-04-25, 2026-04-28, and 2026-05-04 amendment headers in that
log).

**Proposed amendment (verbatim)**:

```markdown
### 2026-05-14 amendment — DECISION-COMPLETE is the readiness gate

`DECISION-COMPLETE` is the **readiness gate** for plan promotion, not a
status label applied after execution. When the owner asks for an
implementation plan, every execution-time decision that *can* be
settled at plan-author time *must* be settled there: vendor literals,
output schemas, interface signatures, exit codes, sort order, encoding
decisions, help-text shape, error-message wording, and any other
artefact a downstream WS would otherwise have to invent. The
plan-body first-principles check's vendor-literal clause permits
deferral only when the dependency is added inside the same WS that
consumes it, and even then the plan must pin the expected call shape so
the WS becomes drift-detection rather than decision-making.

The diagnostic phrase "verify at execution time" inside a plan body is
the failure mode this gate forbids. If a plan body contains
target-selection wording like "verify which home is the cleaner fit at
execution time" or "create new minimal rule if poor fit," that wording
*is* the unresolved decision: resolve it before promoting the plan,
not by adding "verify" prose.

Worked example (2026-05-14 triage batch): a Batch B row originally
read "verify which is the cleaner home at execution time"; an
assumptions-expert review flagged this as an unresolved plan-author
decision leaking into execution. The plan author resolved each target
home before execution began.
```

**Fitness**:

- Duplicates existing doctrine? No — PDR-018 covers planning discipline
  but the *DECISION-COMPLETE-as-gate* sharpening is new framing.
- Portability violation? None — vendor-agnostic; references PDR-018's
  own clauses.
- Conflicts with active plan? No — sharpens disposition-ledger plan's
  own self-correction shape.

## D2 — Vendor Call-Shape Verification

**Source**: `.agent/memory/active/distilled.md` §"Plan-author discipline
reinforcement" entry 2 (worked example: tinyglobby).

**Target (owner picks one)**:

- **Option A**: NEW rule `.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md`
  plus RULES_INDEX.md entry plus Claude/Cursor forwarders. Companion rule
  to [`read-before-asking.md`](../../../rules/read-before-asking.md).
- **Option B**: PDR-018 amendment §"Vendor Call-Shape Verification"
  (single paragraph, bundles with D1).

**Recommended**: Option A. Rule shape is correct: this is a
behavioural cure (read the docs, do not pin from memory) that fires at
plan-author time. A rule's always-applied behavioural-modifier
semantics match the substance better than a PDR's portable-doctrine
shape. Companion to `read-before-asking.md` makes the rule cluster
coherent.

**Proposed rule body (Option A)**:

```markdown
# Verify Vendor Call Shapes At Plan-Author Time

When a plan body pins the call shape of an external dependency — an
npm package, a CLI vendor binary, a system tool with named flags — the
plan author MUST verify the pinned shape against the dependency's
installed-or-published documentation at plan-author time. "Well-known
utility library" is not permission to pin a call shape from memory.
Stable API across a v0.x line is necessary but insufficient evidence
that the call shape *I remember* matches the *current* shape.

## Why This Rule Exists

Worked example 2026-05-14: a plan body pinned `tinyglobby` as
`glob({ patterns, ... })` from memory; the actual current export is
`glob(patterns, options)` positional. The drift was caught at WS
execution rather than plan author time — cheap at plan-author time;
expensive at WS execution. The drift sits at exactly the layer where
"verify at execution time" should have been "verify now": the literal
function signature.

## How To Apply

- Open the dependency's published README or installed `.d.ts` types
  before pinning any call shape in a plan body. Cite the version
  pinned in the lockfile, not a memory of a prior version.
- If the dependency is not yet installed and not published, name the
  pin as a WS-internal decision (the WS that adds the dep also pins
  the shape); the plan body records the *expected* shape and the
  WS becomes drift-detection rather than decision-making.
- Re-verify on each major dependency upgrade if the call shape is
  named in any active plan body.

## Related Surfaces

- [`read-before-asking.md`](read-before-asking.md) — sibling discipline
  for project-internal shapes.
- [`plan-body-first-principles-check.md`](plan-body-first-principles-check.md)
  — the vendor-literal clause that permits deferral only inside the
  consuming WS.
- [PDR-018](../practice-core/decision-records/PDR-018-planning-discipline.md)
  — the parent planning-discipline doctrine that this rule operationalises.
```

**Sequencing note**: if D1 has landed before this rule lands, the
"Related Surfaces" entry above can sharpen to cite
PDR-018 §"DECISION-COMPLETE is the readiness gate" specifically.
Apply that sharpening at land time only after D1 lands — never as
conditional wording in the rule body.

**Fitness**:

- Duplicates existing doctrine? No — read-before-asking covers
  project-internal shapes; this covers external dependencies.
- Portability violation? None — vendor-agnostic.
- Conflicts with active plan? No.

## D3 — Acceptance Value-Proxies Need Independent Ground Truth

**Source**: `.agent/memory/active/distilled.md` §"Plan-author discipline
reinforcement" entry 3 (chars/4 reproducing chars/4 example).

**Target (owner picks one)**:

- **Option A**: [`.agent/directives/testing-strategy.md`](../../../directives/testing-strategy.md)
  amendment under acceptance-criteria guidance.
- **Option B**: [`.agent/directives/principles.md`](../../../directives/principles.md)
  amendment under engineering-principles section.

**Recommended**: Option A (`testing-strategy.md`). The substance is
about acceptance-test design — what counts as a valid proof — which is
testing-strategy substance not engineering-principle substance.
`principles.md` would dilute the principles surface with
test-design specifics.

**Placement**: insert as a new `## Acceptance Value-Proxies` H2 after
`## Test Assertion Placement` (current line ~391) in
`testing-strategy.md`.

**Proposed amendment (verbatim, target Option A)**:

```markdown
## Acceptance Value-Proxies

Acceptance value-proxies must compare against independent ground-truth
measures. A value-proxy acceptance criterion ("the new CLI produces a
value within ±N% of the prior baseline") is **tautological** if the
new implementation and the baseline use the same method. Reproducing
the baseline value does not validate correctness; it validates only
internal consistency.

Worked example: a token-count CLI defines acceptance as "the chars/4
output agrees with the prior chars/4 baseline ±5%." The baseline is
itself chars/4. The CLI cannot fail the acceptance check by
construction — chars/4 reproducing chars/4 proves nothing.

The cure is to compare against a **method-independent ground-truth
measure**. For token-count, that is `wc -c` for total characters; the
chars/4 conversion then becomes a mechanical step verified
independently. For other domains, the ground-truth measure is the
authoritative external observation (file size from `stat`, byte count
from the filesystem, response time from a stopwatch, etc.) that the
proxy is supposed to approximate.

Acceptance criteria framed as "agrees with prior baseline ±N%" without
naming an independent ground-truth measure are tautological and fail
under normal churn (any drift looks like baseline error rather than
proxy error). Reject the framing at plan-author time, not at WS
execution.
```

**Fitness**:

- Duplicates existing doctrine? No — testing-strategy.md does not
  currently cover value-proxy validity.
- Portability violation? None.
- Conflicts with active plan? No.

## D4 — agent-collaboration.md §"PR Closeout Discipline"

**Source**: `.agent/memory/active/distilled.md` §"Recently Distilled —
2026-05-09" §"PR Closeout Discipline" (4 entries, stable since
2026-05-09 — 5 days).

**Target**: [`.agent/directives/agent-collaboration.md`](../../../directives/agent-collaboration.md)
— new H2 section "PR Closeout Discipline" inserted **after** §"d. Cleanup
Ethics for Apparently Orphaned Claims" (so it is sibling to that H2,
not interleaved into the `a/b/c/d` lettered sub-series of §"Treat
Commit as a Short-Lived Shared Transaction Surface"). The four entries
in the proposed text below are H3 children of the new H2. Also add a
back-cite to PDR-015 in agent-collaboration.md §Cross-references so
the reviewer-comment-state↔reviewer-authority linkage is hardened.

**Proposed amendment (verbatim)**:

```markdown
## PR Closeout Discipline

A PR closeout has two **independent** evidence loops — both must
report green before the PR is considered closed.

### Gate State And Reviewer-Comment State Are Distinct

Gate state (checks, Sonar, CI) and reviewer-comment state are
independent. A green PR can still need a comment-harvest pass:
top-level comments, review summaries, and threads marked
`resolved`/`outdated` may carry live feedback outside the check
surface. Fetch and classify reviewer comments before the next edit;
do not infer comment state from check state.

### PR Title And Body Are An Active Review Surface

Branch scope drift makes stale PR metadata an actionable defect, not
a wrapper. After every push that materially changes scope, rewrite
the title and body against `origin/main...HEAD` before disposing of
any metadata-shaped review comment as `fixed`. The PR description is
the document reviewers read first; stale wording wastes their cycles.

### Planning PRs Report Two Verdicts Separately

For PRs whose primary substance is a plan or set of plans, the gate
state ("PR technical readiness") and the plan substance state ("plan
decision-completeness") are independent gates. A green PR must not
collapse unresolved planning questions (topology findings, slice-plan
findings, plan-internal contradictions) into implicit acceptance. Each
verdict is reported separately in the closeout summary.

### Remote Metadata Transitions Are Part Of State Handoff

When a closeout moves from local/pending to pushed, refresh the live
PR body and next-session records in the same handoff pass so the next
session does not inherit stale blockers or stale "ready to land"
wording. State handoff is a complete operation; partial refreshes are
themselves the bug they appear to fix.
```

**Fitness**:

- Duplicates existing doctrine? No — agent-collaboration.md covers
  commit windows and inter-agent comms; PR-closeout is genuinely new
  section substance.
- Portability violation? None.
- Conflicts with active plan? No.

## D5 — PDR-015 Amendment §"Audit-Shape Surface Framing"

**Source**: `.agent/memory/active/distilled.md` §"Recently Distilled —
2026-05-09" §"Multi-Reviewer Dispatch Discipline".

**Target**: [`PDR-015-reviewer-authority-and-dispatch.md`](../../../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md)
(slug resolved by docs-adr-expert review).

**Placement**: insert as a new `### Audit-shape surface framing
(2026-05-14 amendment)` H3 under PDR-015's `## Decision` section, after
§"Assumption-challenge gate before absorbing adversarial-review
findings (2026-04-25 amendment)" (current line ~384). PDR-015's
Amendment Log dates are 2026-04-21, 2026-04-25, and 2026-04-29 — the
draft's original "2026-04-26 amendment block" reference was incorrect
and is now superseded by this placement.

**Proposed amendment (verbatim)**:

```markdown
### Audit-shape surface framing (2026-05-14 amendment)

Each parallel reviewer lens shrinks a **different part** of the
audit-shape surface; reviewers are not redundant proxies for one
another. Empirical observation (WS0 dispatch, 2026-05-09):

- `test-expert` caught literal-text assertions in test bodies that
  no other reviewer surfaced.
- `architecture-expert-fred` caught a deferred boundary decision that
  no other reviewer surfaced.
- `docs-adr-expert` caught propagation-surface omissions (README,
  thread record, ADR back-cite) that no other reviewer surfaced.

The corollary for plan WS0 dispatch: expect **concrete cycle-shape
correctives** from each reviewer, not just nudges. Each reviewer's
absence is a specific gap in the audit-shape coverage, not a
generic loss of redundancy.
```

**Fitness**:

- Duplicates existing doctrine? No — PDR-015 covers parallel dispatch
  but the audit-shape-surface framing is new sharpening.
- Portability violation? None.
- Conflicts with active plan? No.

## Aggregate Owner-Review Process

For each D in {D1, D2, D3, D4, D5}, the owner-review cycle is:

1. Owner reads the proposed amendment text in this document.
2. Owner verdict per D: ACCEPT (apply verbatim), REVISE (with notes),
   REJECT (discard), DEFER (move to a later plan).
3. Agent applies each ACCEPTED amendment in its own commit with
   explicit pathspec; commit message references the source distilled
   entry and this drafts document.
4. Agent updates this drafts document's todo status as each D lands.
5. When all D verdicts are recorded, this drafts plan archives.

For D2 and D3, the shape decision (new rule vs amendment; testing-strategy
vs principles) is part of the owner verdict.

## Critical Files Referenced

**Source distilled entries**:

- [`.agent/memory/active/distilled.md`](../../../memory/active/distilled.md)
  §"Plan-author discipline reinforcement" (D1, D2, D3)
- [`.agent/memory/active/distilled.md`](../../../memory/active/distilled.md)
  §"Recently Distilled — 2026-05-09" §"PR Closeout Discipline" (D4)
- [`.agent/memory/active/distilled.md`](../../../memory/active/distilled.md)
  §"Recently Distilled — 2026-05-09" §"Multi-Reviewer Dispatch Discipline" (D5)

**Target homes**:

- [`PDR-018-planning-discipline.md`](../../../practice-core/decision-records/PDR-018-planning-discipline.md) (D1, D2 alternative)
- [`.agent/rules/verify-vendor-call-shapes-at-plan-author-time.md`](../../../rules/) (D2 preferred — NEW FILE)
- [`.agent/directives/testing-strategy.md`](../../../directives/testing-strategy.md) (D3 preferred)
- [`.agent/directives/principles.md`](../../../directives/principles.md) (D3 alternative)
- [`.agent/directives/agent-collaboration.md`](../../../directives/agent-collaboration.md) (D4)
- [`.agent/practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md`](../../../practice-core/decision-records/PDR-015-reviewer-authority-and-dispatch.md) (D5)

## Reviewer History

- 2026-05-14 assumptions-expert on parent plan: PROPORTIONAL with two
  execution-legitimacy concerns (stale blocker, B2/B3/B4 target
  uncertainty); both resolved in the parent plan before Batch B
  executed.
- 2026-05-14 docs-adr-expert on these drafts: ACCEPT D1/D3/D4/D5 with
  small placement and citation fixes; REVISE D2 to remove conditional
  cross-reference wording. All findings folded into this revision.
