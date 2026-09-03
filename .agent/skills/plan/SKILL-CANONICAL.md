---
name: plan
classification: active
description: Author a plan node in the ratified plan-node estate.
---

# Author a Plan

Create a plan node aligned with the foundation documents, the planning
discipline in
[PDR-018](../../practice-core/decision-records/PDR-018-planning-discipline.md),
and the plan-node estate defined in
[ADR-216](../../../docs/architecture/architectural-decisions/216-plan-node-estate.md).
The machine-enforced contract is the
[plan-node schema](../../plans/plan-node-schema.md); the estate validator
runs in CI and at pre-commit.

## Before Writing

1. **Design gate**: Has the design intent been explored and confirmed
   with the project owner? If the scope is ambiguous or the approach
   has multiple valid paths, run `oak-metacognition` first to explore
   intent, constraints, and trade-offs before committing to a plan
   structure. Do not skip this step for non-trivial work.

   When "plan X" spans **altitudes** — the downstream product/strategy
   vs synthesising our own plan estate; future strategy vs immediate
   executable work — surface the altitude fork (or state the
   lighter/immediate verdict) BEFORE drafting; never default to the
   heavier altitude, and never bake an open decision in as a
   load-bearing thesis. A reviewer can validate a plan's facts but
   cannot catch a wrong altitude — the frame is the owner's to set.

   **Verdict-vs-menu discipline** (per
   [`.agent/rules/present-verdicts-not-menus.md`](../../rules/present-verdicts-not-menus.md)):

   - *Unknown-to-agent design intent* — the agent has no strong basis
     for a verdict: surface 2–3 approaches with trade-offs via
     `AskUserQuestion`. One question at a time; this is the case this
     design-gate step is written for.
   - *Agent has analysed and has a verdict* — present the verdict
     with cited evidence. Do not convert completed findings into a
     multiple-choice form. `AskUserQuestion` is for genuine permission
     gates and decisions only the owner can make, not for offloading
     synthesis the agent has already done. The diagnostic is: *could
     the agent rank these options by evidence already in context?* If
     yes, the quiz is evasion.

   **Frame the problem, not the solution.** Before choosing a structure,
   state the problem as gap + who it harms + mechanism (your causal
   hypothesis) + constraints + what success looks like. A statement that
   already names a solution ("we need X") has skipped the framing. For
   complex plans, rewrites, or high-stakes work, read the
   [grammar of thinking](../../reference/grammar-of-thinking.md) as the
   yardstick, and use [`reason`](../cognition/reason/SKILL-CANONICAL.md) to structure
   the framing before committing to plan shape.

2. Read the directives:
   - `../../directives/principles.md`
   - `../../directives/testing-strategy.md`
   - `../../directives/schema-first-execution.md`

3. Read the estate contract and templates:
   - `../../plans/plan-node-schema.md` (the contract)
   - `../../plans/templates/README.md` (one template per node type)
   - `../../plans/impact-areas.md` (the closed registry)

4. Resolve discoverable unknowns before asking the owner. Search the
   repo, relevant plans, ADRs/PDRs, vendor docs or CLIs, and existing
   code first. Ask specific questions only for owner-only decisions or
   genuinely undiscoverable intent. Do not guess scope, intent, or
   acceptance criteria.

## Choose the Node Type First

Three node types, typed by directory — a plan's type never changes and
its file never moves while live:

| Node type | Purpose | Lives in |
|-----------|---------|----------|
| `strategic` | The outcome and the bet — long-lived, few | `.agent/plans/strategic/` |
| `delivery` | One bounded lane of routed work, authored by its implementer at pickup | `.agent/plans/delivery/` |
| `runbook` | A repeatable operational procedure | `.agent/plans/runbooks/` |

Milestones are **not** a plan type: they are named observable states of
the product, held in Linear with tickets mapped. Delivery state is a
Linear projection, never a repo field — the sorting test: if it moves
when the schedule moves, it lives in Linear; if it only moves when the
product moves, it lives in the repo.

Copy the skeleton from the matching template in
[`../../plans/templates/README.md`](../../plans/templates/README.md),
fill it, delete the guidance text.

## Born-Sketch Ratification

Every plan is born `status: sketch` — however green its checks — and
**governs no work** until it carries a complete owner ratification stamp
(`ratified_by` + `ratified_date` + `ratified_where`, the last a
traceable pointer to where the owner's word lives). The `status` enum
(`sketch | ratified | superseded | archived`) carries ratification state
only; `superseded` requires a named `superseded_by` successor. Executed
is not ratified.

## Frontmatter Contract (validator-enforced)

- `serves` — the node this plan serves (delivery plans name their
  strategic node; strategic nodes name the goal above them). Enumerate a
  strategic node's delivery plans by searching `serves:`, never by a
  hand-kept list.
- `impact_areas` — the product areas the plan changes, drawn from the
  closed, additive [registry](../../plans/impact-areas.md).
- `tickets` — optional visibility metadata, always (plan-node schema
  §2026-08-07 amendment: validity is repo-internal, never dependent on
  an external service). When the operator's tracker holds the work,
  name it as a thin pointer (ticket-first as working practice).
- `depends_on` — each dependency classified `blocking` or `beneficial`;
  for each `beneficial` dependency, the body states the minimum
  shippable shape without it.
- `owner_gates` — every gate names `awaiting`, `clears_when`, and an
  absolute `expires` date. No open-ended holding states; the default
  expiry horizon is set by the governing strategic node
  (`gate_expiry_default`), not by a schema constant.

## Body Requirements

Every non-trivial plan MUST define:

1. **Goal** — the user-impact outcome sought.
2. **User groups and value** — the groups who will experience or consume
   the outcome (end users — including deliberately proxy ones with an
   honest claim boundary, stakeholders and audiences, developers and
   agents, operators), and for each group the value provided, stated in
   experience terms. Pure innovation is often not meeting a pre-existing
   need, so proving a pre-existing need in advance is not required where
   the work's purpose is to reveal possibility: declared offered or
   hypothesised value (possibility, comprehension, inspiration) with an
   honest claim boundary satisfies this requirement (owner ruling,
   2026-08-31; worked instance: the semantic-search-showcase plan, whose
   first sketch met every then-current requirement while missing its
   users). Falsifier: if this section fills with interchangeable
   boilerplate rather than decision-bearing content, the requirement has
   become ceremony and must be reshaped, not deleted silently.
3. **Mechanism** — why the named means produce that outcome.
4. **Acceptance criteria, each with a proof** — outcome-measuring, not
   activity-measuring, and each proof typed (`repo-safe` for
   test/CI-provable, `owner-held` for the owner's confirming act).
5. **Out of scope** — what the plan explicitly will not do (YAGNI).
6. **Todos** — sliced at pickup by the implementer, each slice a
   single-story PR within its round budget
   ([PDR-132](../../practice-core/decision-records/PDR-132-changeset-health-round-budgets-bind-at-authoring-time.md):
   round budgets bind at authoring time; slicing at plan time is free,
   slicing at the first over-budget review round is the measured
   expensive path). Slicing at pickup CONSUMES the plan's disposition
   ledger
   ([PDR-140](../../practice-core/decision-records/PDR-140-review-response-pricing.md)):
   the canonical ledger surface is a `## Review dispositions` section
   in the plan file itself — one dated row per routed finding, naming
   the source PR, the finding in one line, and the routing rationale —
   with the plan's linked ticket as the carrier only when the ticket
   exists and the disposition says so. At pickup the implementer
   enumerates that section (and the named ticket, when cited), reading
   and dispositioning every row before implementation begins; an
   absent section means an empty ledger, never an unchecked one.

Plans are public-repository artefacts: **mechanism only**. Anything
internal — dates, vendor detail, organisational specifics — rides the
linked Linear ticket, never the plan body.

A plan that a FRESH session must implement is a self-contained repo
artefact, never a chat artefact (owner ruling 2026-09-01, verbatim: "it
must be copied to the repo, so a fresh session can implement it, that
means it needs to be self contained and not rely on hidden context"):
mechanism, exact files, tests, any registry ceremony, sequence and proofs
in the node; dates, versions and deployment URLs on the ticket; the
seat-facing state (branch, worktree, uncommitted edits) on the thread
record — three homes, no hidden context.

## Authoring Disciplines (unchanged by estate structure)

### Build-vs-Buy Before Build-Shape

Before committing a plan that integrates with a vendor (Sentry, Vercel,
Clerk, etc.), answer first: **which first-party integrations does the
vendor ship (plugin, SDK, managed flow, official GitHub Action), and why
are we not choosing one of them?** Name the vendor's first-party
ecosystem explicitly in the plan. Build-vs-buy is a different question
from build-shape and must be answered first — once the plan is weighing
bespoke shapes, the cheapest option has already been lost.

Two companion disciplines:

- **ADR intent-vs-implementation audit.** An ADR that names specific
  CLI commands, argv shapes, or per-step error postures is
  implementation spec in ADR form, foreclosing alternatives without
  evaluating them. ADRs state WHAT outcome the vendor must reach; HOW
  belongs in the plan.
- **Friction ratchet — stop the line at three.** Count signals against
  the solution *shape* (not against individual tactics): a lint
  size/complexity cap, a dependency cycle, a reviewer finding that
  requires more code, an ADR amendment to match implementation, a
  vendor-rule exception. When three or more have fired, the next
  response is a shape-reconsideration pause, never another tactical
  fix. Sunk-cost detector phrases in your own reasoning — "we'd have
  to throw away…", "the current implementation is valuable because
  it's tested" — are paid costs, not reasons to continue; future
  maintenance cost is the only cost that matters.

### Pre-Author Scope-Vocabulary Check

Before saving any forward-looking framing in a plan body (`Cycle N`,
`Phase N`, `Round N`, `Wave N`, `Next session`, `Follow-on`), ask: *am I
authoring vocabulary that implies scope or commitments the owner did not
authorise?* A series that exists in no owner direction or ratified
artefact is invented obligation — future readers treat "Cycle 2" as
ratified scope and plan accordingly. Strip it and use neutral language
naming only what is authorised; where a future commitment IS authorised,
cite the authorising source inline. The check runs at compose time —
especially under coordination rush — never left to review time.

### Schedule It, Sequence It — No Imaginary Flows

Plans commit to concrete scheduled sequence positions, never conditional
triggers ("when X ships", "tripwire fires on Z"). Conditional-trigger
soup creates the illusion of activation flow while quietly stalling;
work happens on definite ordering, not imagined event chains. Where
genuine schedule uncertainty exists, name it as a real owner decision
needing resolution now — that is what `owner_gates` with absolute
expiries are for. Automatic firing conditions for maintenance/meta items
whose timing no owner should own, and `depends_on` ordering (which IS
the definite-sequence shape), remain legitimate.

### A Boundary Move Reshapes Every Surface It Lived On

When the owner moves a plan boundary (an out-of-scope item into scope, a
scope item out), it is never a single-spot patch: search the artefact
for every assertion the old boundary was holding up — out-of-scope,
acceptance criteria, mechanism, risks — and move them coherently, then
report the blast radius transparently when the ask named only one
section. Editing only the named section leaves live contradictions on
every other surface the old boundary touched.

### Disposition Ledger For "Apply All Of X" Inputs

When a plan's input is *"apply all of X"* — every audit finding, every
reviewer comment, every entry in a list — thoroughness is **every item
having a recorded decision**, not every item triggering a separate
execution cycle:

- **Every input gets a recorded decision** — `applied`,
  `already-covered`, `superseded`, `out-of-scope`, etc. The ledger is
  the proof that nothing was silently dropped.
- **Implementation work is sized to the unique substance**, not to the
  input count.
- **Counts derived from the input list are derivation-anchored** —
  re-derive at execution time and let substance preservation outrank
  stale arithmetic.

## Readiness and Review

Before presenting a plan for ratification, invoke required reviewers by
substance: `assumptions-expert` for plan-readiness/proportionality,
docs/onboarding reviewers for significant Practice or documentation
changes, and technical specialists where the work shape requires them.
State in the plan where the
[`plan-body-first-principles-check`](../../rules/plan-body-first-principles-check.md)
shape, landing-path, and vendor-literal clauses fire.

Ratification itself is the owner's act: present the sketch, receive the
word, land the stamp with `ratified_where` pointing at it.

## Completion and Archival

A delivery plan completes when its acceptance criteria are proven at
their declared proof types; it then moves to `archive/` with its
disposition recorded (`status: archived`, or `superseded` with the named
successor). Completion claims follow the proof contract — a landed
slice, session close, or green gate is not completion unless the
acceptance criteria for the scope are proven. Plan completion and
archival reference the consolidation workflow so learning is conserved.

## First Question

Before every decision in the plan: **could it be simpler
without compromising quality or value or functionality?**
