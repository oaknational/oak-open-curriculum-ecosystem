---
pdr_kind: governance
---

# PDR-018: Planning Discipline — End Goals and Workflow Contracts

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-012](PDR-012-review-findings-routing-discipline.md)
(findings about plans — including missing end goals — route under
PDR-012);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md)
(plans that promote to `current/` follow both-readiness-criteria
discipline from PDR-014);
[PDR-029](PDR-029-perturbation-mechanism-bundle.md)
(tripwire doctrine for making phase-boundary checks fire as artefacts, not
aspirations).

## Amendment Log

- **2026-04-29 amendment — tool error as question; reviewer-scope
  equals prompted-scope (Nebulous Illuminating Satellite / claude-code
  / claude-opus-4-7-1m; owner-directed graduation during the
  2026-04-29 deep consolidation pass after the TS6-migration session
  surfaced five distinct manifestations of the same anti-pattern).**
  Two related disciplines graduate to portable Practice doctrine:
  - **Tool error as question.** When a tool, signal, hook, or reviewer
    returns a non-pass result, the first response is to understand
    what is being asked, not to find a way past it. The instinct of
    "tool returns error → find bypass" recurs across reviewer findings,
    diff reading, pre-commit hooks, fitness signals, the Edit-tool
    safety contract, CI gates, type checkers, and validators. The fix
    is one of three valid responses (understand-and-address,
    understand-and-dismiss-with-rationale, understand-and-stop) — never
    skip-understanding. Instance patterns:
    [`tool-error-as-question.md`](../../memory/active/patterns/tool-error-as-question.md),
    [`hook-as-question-not-obstacle.md`](../../memory/active/patterns/hook-as-question-not-obstacle.md),
    [`ground-before-framing.md`](../../memory/active/patterns/ground-before-framing.md).
  - **Reviewer scope equals prompted scope.** A reviewer's verdict is
    scoped to the prompt that briefed them; "GO WITH CONDITIONS" reads
    as a green merge signal only when the reviewer's brief matches the
    merge-gate scope. When asking a reviewer to gate merge, brief them
    with the full merge-gate criteria (zero failing gates, no warning
    toleration, all merge conditions named), not just the arc you are
    working on. Failure mode: instrumental work treated as terminal
    because the work-list was full. Instance pattern:
    [`scope-as-goal.md`](../../memory/active/patterns/scope-as-goal.md).
    Cross-reference under PDR-015 amendment of the same date.

- **2026-04-28 amendment — disposition drift under context pressure
  (Coastal Mooring Atoll / codex / GPT-5; owner-directed deep
  consolidation after PR-87 planning drift recurred across Vining,
  Pelagic, Tidal, and Luminous sessions).** Planning discipline now
  forbids presenting check-side dispositions as fallback options once
  the plan's governing principle says the work item is the architecture.
  The amendment graduates the distilled "investigation-mode drifts into
  disposition-mode" entry into portable Practice doctrine. New
  §Disposition drift at phase boundaries names the trigger vocabulary,
  the required phase-boundary re-read, and the artefact requirement that
  makes the check observable under PDR-029.

- **2026-04-25 amendment — plan placement follows ownership and
  actionability, not numerical density caps (Fresh Prince /
  claude-code / claude-opus-4-7-1m; agentic-engineering-enhancements
  thread; owner-ratified during pending-graduations promotion pass).**
  Plan placement (which lifecycle directory under which collection
  a plan file lives in) is determined by **ownership** (which lane
  the plan serves) and **actionability** (active / current / future
  per the lifecycle), not by arbitrary numerical caps on plan count
  per directory. The corrective instance (2026-04-24, observability
  lane) was an owner correction when a plan was misrouted to a
  lower-density directory rather than its natural home; the
  numerical-cap heuristic was a false economy. New §Plan placement
  follows ownership section in the Decision area names the
  principle.

## Context

Plans and workflows structure work. Two planning failure modes
consistently produce low-value work despite apparent productivity:

1. **Means goals substitute for end goals**. A plan is framed
   around the means ("close 15 gaps", "reduce line count by 30%",
   "migrate to framework X") without a clear end ("what does the
   user actually need from this?"). The means-framed plan
   generates activity — gaps get closed, lines get cut, migration
   happens — but the activity does not correspond to user-impact
   outcomes. The work appears productive by its own metrics
   while delivering little.

2. **Workflow contracts with ambiguous verbs**. A workflow or
   repair process uses verbs that could mean multiple things
   ("update", "sync", "reconcile", "propagate"). When the workflow
   runs against multiple artefacts or locations, ambiguity in the
   verb allows each application to interpret differently. The
   workflow produces inconsistent results across artefacts without
   any single application being wrong by its own interpretation.

Underlying cause: planning prose is cheap; plan substance requires
clarity about purpose (end goal) and contract (what verbs commit
to). Without explicit discipline, prose races ahead of substance.

## Decision

**Every non-trivial plan names its end goal — the user-impact
outcome sought — before naming means. Workflow contracts use
unambiguous verbs; ambiguous vocabulary is replaced or
disambiguated before the workflow runs.**

### End goals over means goals

A non-trivial plan states:

1. **End goal** — the user-impact outcome the plan aims to
   deliver. Answers: "what does the user ultimately need?" or
   "what changes for the user when this plan completes?"
2. **Mechanism** — how the means produce the end. Answers: "why
   do these specific means deliver that end?"
3. **Means** — the specific work items.

The mechanism is the bridge. A plan with end goal + means but no
mechanism is working on faith that the means will produce the
end. A plan with means + mechanism but no end is optimising
without a target.

**Anti-pattern**: "Close all 15 knip findings" (means only; no
named end goal; no mechanism from "no knip findings" to
user-impact). Corrected: "Prevent downstream consumers from
silently relying on code the author meant to remove (end) by
removing exports knip confirms are unreferenced (means), so each
removed export reduces the surface of latent breakage
(mechanism)."

**Symptoms of a means-dominated plan**:

- Acceptance criteria measure activity ("15 items closed", "line
  count reduced"), not outcomes.
- The work completes and the plan closes, but nobody can articulate
  what changed for the user.
- Follow-up plans cite "we did X but then had to do Y" — X was
  means without end; Y is the real work surfacing after.

### Plan placement follows ownership and actionability (2026-04-25 amendment)

**Plan files live in the lifecycle directory of their natural
ownership lane**, not the directory whose plan-count is currently
lowest. Numerical density caps on a directory ("only N plans per
collection") are a false economy: a plan placed against its
ownership produces friction at every cross-reference and at every
re-reading; a plan placed with ownership reads cleanly and the
directory size grows or shrinks honestly with the work the lane
carries.

The placement decision is:

1. **Which lane owns this work?** Identify the collection
   (`agentic-engineering-enhancements`, `observability`, etc.)
   that the plan serves.
2. **What is its actionability?** Active (executing now) →
   `active/`; queued and ready → `current/`; strategic backlog
   → `future/`.
3. **Place at lane × actionability**, regardless of how many
   other plans currently sit there. If the resulting directory
   feels crowded, the response is *split the collection* or
   *archive completed plans*, not *redirect the new plan to a
   thinner directory*.

A plan misrouted by density-cap heuristic produces silent
friction: cross-references confuse readers about ownership,
roadmap entries miss the new plan, and the next agent picks up
the misrouting as evidence the lane has shifted. The corrective
direction is owner-led re-placement; the prevention is to choose
ownership first and density-not-at-all.

### Disposition drift at phase boundaries (2026-04-28 amendment)

When a plan is under quality-gate, security-review, or static-analysis
pressure, it must not offer issue-side disposition as a fallback for
architecture work. If the governing principle says the finding is a
diagnostic signal, the plan asks: **what does long-term architectural
excellence look like at this site, and what is stopping us achieving it?**

Forbidden fallback shapes include:

- "if the cure is not recognised, dismiss with rationale";
- "accept the issue if refactoring is hard";
- "add an exclusion if the generated output is awkward";
- "resolve in the vendor UI" where the evidence says code, docs, or
  architecture must change.

The legitimate outcomes are narrower:

1. implement the architectural cure;
2. prove the finding is a true non-issue with reproducible evidence;
3. escalate a named blocker to the owner with file:line evidence while
   leaving the finding open.

At every phase boundary in a plan that touches gate dispositions, the
runner re-reads the governing principle and records the re-derivation in
the plan, commit body, or review disposition. The artefact is load-bearing:
"I remembered the principle" is not evidence.

Trigger vocabulary that forces re-derivation includes: "stylistic",
"false-positive", "out of scope", "convention", "language idiom",
"well-known name", "canonical TS idiom", "all done", "all pushed",
"all clean", "fall back to", "if recognition does not propagate", and
"the TSDoc already explains it".

### Workflow contract clarity

A workflow that repairs, transforms, or propagates content across
multiple artefacts uses **unambiguous verbs**. Ambiguous verbs
create drift:

| Ambiguous | Disambiguated |
|---|---|
| "update" | "rewrite from scratch" / "edit in place" / "append" |
| "sync" | "copy verbatim" / "reconcile differences" / "overwrite destination" |
| "propagate" | "broadcast unchanged" / "adapt per receiver" / "promote to authoritative" |
| "migrate" | "move files" / "rewrite content" / "adapt and relocate" |
| "refactor" | "rename" / "extract module" / "change structure without changing behaviour" |

When a workflow uses an ambiguous verb, one of two responses is
required before the workflow runs:

1. **Replace** the verb with an unambiguous one.
2. **Disambiguate** by naming which of the possible meanings
   applies to this workflow, in the workflow's definition.

A workflow with ambiguous verbs that runs against N artefacts
without disambiguation produces N interpretations and N different
outcomes. The drift is invisible at single-artefact application
and becomes visible only when the outcomes are compared.

## Rationale

**Why end goals.** Means without ends produce activity without
impact. The means can be executed correctly while the plan
delivers nothing useful. Naming the end goal first forces the
question "is this means-set actually the right path to the end?"
to be asked before work starts, when redirection is cheap.

**Why mechanism.** End + means without mechanism is belief:
"these means, when done, will produce that end." Writing the
mechanism forces the belief to be examined. Sometimes the
mechanism is obvious and the writing is ceremonial; sometimes
the mechanism turns out not to exist, and the plan is revised.

**Why unambiguous workflow verbs.** A workflow is a contract
between the author who writes it and every agent that runs it.
Ambiguous verbs mean the contract has no single interpretation —
each runner interprets. Across N runs, N interpretations. The
drift compounds silently.

Alternatives rejected:

- **Implicit end goals.** Authors claim the end is "obvious";
  downstream agents interpret differently; the plan produces
  inconsistent work.
- **Ambiguous verbs as a shorthand.** Saves drafting effort; costs
  more in reconciliation and drift.

## Consequences

### Required

- Non-trivial plans state end goal + mechanism + means explicitly.
- Acceptance criteria measure outcome, not just activity.
- Workflow contracts use unambiguous verbs or explicitly
  disambiguate.
- Findings about missing end goals or ambiguous verbs route per
  PDR-012.
- Plans under gate-disposition pressure record a phase-boundary
  principle re-read and must not present check-side disposition as a
  fallback for architectural work.

### Forbidden

- Plans whose acceptance criteria are purely activity-measuring
  without any outcome measure.
- Workflows that use ambiguous verbs against multiple artefacts
  without explicit disambiguation.
- Fallback dispositions that make a finding disappear when the plan has
  not either implemented the architectural cure or proved the finding is
  a true non-issue.

### Accepted cost

- Writing end goals and mechanisms takes more effort than
  writing means-only plans. Justified by the plans that get
  cancelled when the mechanism doesn't hold up.
- Replacing ambiguous verbs in workflows takes more drafting
  effort. Justified by consistent outcomes across N applications.
- Re-reading principles and recording the re-derivation at phase
  boundaries adds ceremony. Justified because the repeated PR-87
  evidence showed passive memory did not stop drift once context
  pressure rose.

## Notes

### Host-local context (this repo only)

Proven instances retained with `related_pdr: PDR-018`:

- `.agent/memory/active/patterns/end-goals-over-means-goals.md` —
  originated from knip-triage planning where "close 96 unused
  exports" was the means-framed plan; the end-goal-framed
  rewrite was materially smaller and more targeted.
- `.agent/memory/active/patterns/repair-workflow-contract-clarity.md` —
  originated from repair workflows using ambiguous verbs that
  produced divergent outcomes across artefacts.
- `distilled.md` entry "Drift recurs while authoring the enforcement of
  the principle it violates" — graduated 2026-04-28 into this PDR as
  §Disposition drift at phase boundaries.
