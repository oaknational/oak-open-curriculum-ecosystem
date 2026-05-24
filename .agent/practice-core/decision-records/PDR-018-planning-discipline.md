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

- **2026-05-09 amendment — five planning-discipline rules graduated
  from distilled.md (Woodland Sheltering Glade / claude-code /
  claude-opus-4-7-1m; owner-directed graduation during the focused
  consolidation pass on `distilled.md`).** The rules had been "held
  pending Planning expert triplet execution"; that triplet has not
  arrived and held-on-future-plan is the exact failure-mode
  Sequenced-Deferral discipline names. Graduating now without
  vaporware-citation gating. Substance:
  - **Lead with narrative, not infrastructure.** On a multi-workstream
    initiative, write the ADR and README first. WS-0 (narrative) →
    WS-1 (factory) → WS-2+ (consumers). Infrastructure that arrives
    before its narrative justification produces shape-without-purpose.
  - **CLI-first enumeration before owner questions.** Research the
    generic REST or CLI surface (`sentry api`, `clerk api`,
    vendor-equivalent) before raising any owner question about
    observability or infrastructure state. "The specialist tool
    doesn't surface X" ≠ "X is unknowable from automation." Extends
    to workspace sizing: when owner direction names a repo-level
    mechanism (build cancellation, env-var policy, release
    resolution), search the repo for prior implementation before
    sizing a workstream. "Stated many times" or "should already be
    true" signals the substance may exist and the gap is
    documentation/linkage, not implementation.
  - **Validation closures: produce locally-producible evidence
    first.** For deployment-validation lanes, generate every
    locally-producible proof under a session-specific release tag
    before asking the owner. Only ask for owner action when tooling
    cannot reach the artefact.
  - **Split client-compatibility out of deployment-validation
    lanes.** A client-specific compat issue emerging in an active
    deployment-validation lane spins into its own follow-up plan.
    Shared preview infrastructure ≠ shared plan ownership.
  - **Dry-run multi-step workflows against accumulated state**
    before committing to the recipe. The dry-run produces a *proceed*
    or *stage differently* signal; treating multi-step workflows as
    fire-and-confirm risks landing the wrong serialisation.

- **2026-05-04 amendment — beneficial prerequisites must not block
  the work they were meant to enable (Verdant Sprouting Leaf /
  claude-code / claude-opus-4-7-1m; owner-named pattern surfaced
  during the post-`/insights` reflection round, three host
  instances in evidence).** Planning discipline now distinguishes
  *blocking* prerequisites (the dependent work cannot exist or
  function without them) from *beneficial* prerequisites (the
  dependent work ships better with them but ships without them).
  Beneficial prerequisites must not be expressed as blocking
  dependencies; if they are, the dependent work — usually the
  higher-value capability — stalls behind a lower-leverage
  refinement. New §"Beneficial prerequisites must not block"
  names the discipline, the at-plan-time classification, the
  audit cadence, and the additive-shape-as-default cure.

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
    skip-understanding. Instance patterns: `tool-error-as-question`,
    `hook-as-question-not-obstacle`, `ground-before-framing`
    (host-local pattern files; bridged via the practice-index Pattern
    instances section).
  - **Reviewer scope equals prompted scope.** A reviewer's verdict is
    scoped to the prompt that briefed them; "GO WITH CONDITIONS" reads
    as a green merge signal only when the reviewer's brief matches the
    merge-gate scope. When asking a reviewer to gate merge, brief them
    with the full merge-gate criteria (zero failing gates, no warning
    toleration, all merge conditions named), not just the arc you are
    working on. Failure mode: instrumental work treated as terminal
    because the work-list was full. Instance pattern: `scope-as-goal`
    (host-local pattern file; bridged via the practice-index Pattern
    instances section). Cross-reference under PDR-015 amendment of
    the same date.

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

- **2026-05-14 amendment — DECISION-COMPLETE is the readiness gate
  (Riverine Swimming Hull / claude-code / claude-opus-4-7-1m;
  agentic-engineering-enhancements thread; owner-ratified during the
  graduation-triage D1–D5 per-diff review pass).** DECISION-COMPLETE
  is the readiness gate for plan promotion, not a status label
  applied after execution. Every execution-time decision that *can*
  be settled at plan-author time *must* be settled there. The
  diagnostic phrase "verify at execution time" inside a plan body is
  the failure mode this gate forbids. New §DECISION-COMPLETE is the
  readiness gate section in the Decision area names the principle.

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

### Beneficial prerequisites must not block (2026-05-04 amendment)

Plans declare prerequisites in two distinct kinds:

| Kind | Definition | Default treatment |
|---|---|---|
| `blocking` | The dependent work cannot exist or function in the prerequisite's absence. | Sequence the prerequisite first; the dependent work is gated. |
| `beneficial` | The dependent work ships better with the prerequisite but ships without it. | Run the prerequisite in parallel or defer it; the dependent work is **not** gated. |

A prerequisite labelled `blocking` when the substance is `beneficial`
silently turns a refinement into a gate. The dependent work — which is
typically the higher-leverage capability — stalls behind the
lower-leverage prerequisite. The shape recurs across planning surfaces:
infrastructure work framed as prerequisite for feature work; redesign
work framed as prerequisite for direct fix work; coordinated migration
work framed as prerequisite for additive new capability. Each instance
is internally coherent ("doing the prerequisite first is tidier"); the
cumulative effect is that the higher-value work never lands.

**At plan-time discipline:**

1. Every named prerequisite carries a one-word classification:
   `blocking` or `beneficial`.
2. For each `beneficial` prerequisite, the plan states the dependent
   work's *minimum shippable shape without it*. If the plan cannot
   describe this shape, the prerequisite is not actually `beneficial`
   — either it is `blocking` (state the constraint) or the
   classification is itself confused (re-derive).
3. The default cure for a beneficial-but-coupled-as-blocking shape
   is *additive*: ship the new capability alongside the existing
   surface; defer the migration of the existing surface to a later
   plan. The integrated rename / migration / consolidation is the
   *optimisation*, not the *prerequisite*.

**At plan-estate audit cadence (consolidation pass):**

A consolidation step asks: *what plan is currently gated behind
which prerequisite, and is the gate real?* Each gated plan answers
in one of three shapes:

1. **Real gate** — the prerequisite is genuinely `blocking`; the gate
   stays.
2. **False gate** — the prerequisite is `beneficial`; the gate
   dissolves; the dependent plan promotes per its own readiness.
3. **Confused classification** — the prerequisite is unclear;
   re-derive at the next planning round.

**Compliance triggers:**

- A plan declares a prerequisite without one-word classification.
- A plan with a `beneficial` prerequisite does not state the
  minimum shippable shape without it.
- A plan-estate audit finds a `beneficial` prerequisite that has
  gated higher-leverage work for more than one consolidation pass
  without an explicit promotion decision.

**Why this is planning discipline.** The pattern is not a property
of any single plan; it emerges from how plans declare relationships
to other plans. Planning discipline is the only surface where the
shape can be caught at authoring time. At execution time, the
gating has already cost the dependent work the time it lost.

### DECISION-COMPLETE is the readiness gate (2026-05-14 amendment)

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
