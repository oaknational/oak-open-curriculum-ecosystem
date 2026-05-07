---
fitness_line_target: 200
fitness_line_limit: 275
fitness_char_limit: 16500
fitness_line_length: 100
split_strategy: "Extract settled entries to permanent docs (ADRs, PDRs, governance, READMEs)"
---

# Distilled Learnings

Hard-won rules extracted from napkin sessions. Read this before
every session. Every entry earned its place by changing behaviour.

**Source**: Distilled from archived napkins
`napkin-2026-02-16.md` through `napkin-2026-05-04.md`
(sessions 2026-02-10 to 2026-05-04).

**Permanent documentation**: Entries graduate to permanent docs
when stable and a natural home exists. Always graduate useful
understanding — fitness management handles the consequences. What
remains here is repo/domain-specific context with no natural
permanent home, plus entries explicitly held pending plan
execution or queued for a directive-edit session.

**Recent graduations (2026-05-06)**: Practice-Core portability,
directive-file <30% context budget, validators-must-recompute, and
re-apply-first-question-at-elaboration-boundaries graduated to new
files in `.agent/rules/`. Discoverable+actionable plans,
parent-reconciliation, narrative-section-drift-first, and
plan-following-vs-principle-following landed in
`docs/governance/development-practice.md` § Documentation Practice.
Apparently-orphaned-claim policy landed in
`.agent/memory/operational/collaboration-state-lifecycle.md`.
Citation-directionality is in
`.agent/rules/no-moving-targets-in-permanent-docs.md`.
TDD-compositionality and the multi-agent pointer/platform-
independence paragraphs were subsumed by existing directive content
(`testing-strategy.md`, `tdd-as-design.md`,
`agent-collaboration.md`) and deleted here.

---

## Routed Entries (Held Pending Plan Execution)

### Planning Discipline

Held for the planning-specialist-capability plan. The Planning
expert triplet has not executed; entries remain here until it does.

- **Lead with narrative, not infrastructure**: on a multi-workstream
  initiative, write the ADR and README first. WS-0 (narrative) →
  WS-1 (factory) → WS-2+ (consumers).
- **CLI-first enumeration before owner questions**: research the
  generic REST surface (`sentry api`, `clerk api`, vendor-
  equivalent) before raising any owner question about observability
  or infrastructure state. "The specialist tool doesn't surface X"
  ≠ "X is unknowable from automation." **Extends to workstream
  sizing**: when owner direction names a repo-level mechanism
  (build cancellation, env-var policy, release resolution), search
  the repo for prior implementation before sizing a workstream.
  "Stated many times" or "should already be true" signals the
  substance may exist and the gap is documentation/linkage, not
  implementation.
- **Validation closures: produce locally-producible evidence
  first**. For deployment validation lanes, generate every locally-
  producible proof under a session-specific release tag before
  asking. Only ask for owner action when tooling cannot reach the
  artefact.
- **Split client-compatibility out of deployment-validation
  lanes**: a client-specific compat issue emerging in an active
  deployment-validation lane spins into its own follow-up plan.
  Shared preview infra ≠ shared plan ownership.
- **Dry-run multi-step workflows against accumulated state** before
  committing to the recipe; produces *proceed* or *stage
  differently*.

### Sequenced-Deferral Discipline

The doctrine itself is settled and useful; what was held was the
PDR-026 amendment that would land it as Practice-permanent. The
prior held-reason cited the doctrine-scanner CLI as the enforcement
infrastructure the amendment was sequenced behind. That citation
was vaporware-shaped: the doctrine-scanner CLI lives in
`future/memetic-immune-system-and-progressive-disclosure.plan.md`
with promotion gates that have not been hit. Gating the amendment
on a never-promoted future plan is the precise failure-mode the
discipline names — "hidden declaration of non-action" wearing the
costume of a sequenced deferral.

Three modes (the doctrine):

1. **Sequenced deferral** (preferred) — "we will do X after Y, per
   plan Z phase N", where plan Z is `current/` or has hit its
   promotion gate, not parked indefinitely in `future/`.
2. **Sequencing-sequenced deferral** (rare) — "we will decide when
   to do X at decision point Y, per plan Z phase N".
3. **Hidden declaration of non-action** (forbidden) — "we'll do X
   later" without structural placement, OR with structural
   placement that points at unmet/unmet-able promotion gates. The
   second shape is the more dangerous of the two because it looks
   like discipline.

Non-action can be the architecturally correct answer; it must be
visible, explicit, and sometimes discussed. Currently queued for
the next directive-edit session: graduate this whole block to
PDR-026 amendment without the vaporware-citation gating.

### Repo-Specific Codegen

Held — `src/bulk/generators/` / `vocab-gen/generators/` duplication
is routed to the SDK codegen workspace decomposition plan for a
separate session.

---

## Queued for Next Directive-Edit Session

The following items have natural homes in `.agent/directives/`. The
standing 30%-context-budget rule
(`.agent/rules/directive-file-context-budget.md`) sequences
directive edits as the final step of a fresh consolidation pass.
The substance is preserved here so the next session can graduate
cleanly.

### Coordination Surface Discipline → `agent-collaboration.md`

Before adding a new always-visible coordination surface, widen the
regular state audit first. Active claims, closure history, decision
threads, unresolved decision requests, evidence bundles, and schema
validation became usable once `consolidate-docs` reported them
together. Structured state plus consolidation output is usually the
first dashboard.

Split evidenced durability gaps from speculative coordination
mechanisms. Claim-history / decision-thread work was grounded in
real harvest evidence; sidebar, timeout, and file-backed owner
escalation remained promotion-gated until async decision threads
proved insufficient. The discipline: ground each new coordination
mechanism in observed need before promoting it.

### Inter-Agent Comms Is a First-Class Primitive → `agent-collaboration.md`

Not all coordination needs owner-mediation. When another agent's
state blocks mine and they may still be active, the correct first
move is a direct comms-event to that agent (with a deadline + a
named default action if no response), brief poll for reply, then
escalate to owner only if no response by deadline. The reverse
order — surface options to the owner first — over-uses owner
mediation for coordination the agents can resolve between
themselves.

Worked instance: doc-cleanup `verify-staged` blocked on three
pre-staged-but-deferred files from a peer's session. Initial
options surfaced to the owner were all owner-mediated (you
authorise me to unstage; you commit peer's first; I wait). Owner
direction: send a message to the peer with a bounded-deadline +
default action; coordination resolved between the two agents within
the deadline. Owner-stated principle on close: communicating with
other agents is always an option; not all communication needs to
be mediated through the owner.

Operating shape: bounded-deadline + default-action format on the
comms-event; agent posts, polls briefly, acts on default if silent.
Owner-mediation remains the right channel for owner-owned decisions
(authorisation chain lifts on owner-directed deferrals; strategic
redirection; cross-thread scope changes). The discipline: route
through the lowest-authority resolver that can decide.

### Per-Session Closure Owns the Loop → `agent-collaboration.md` or PDR amendment

Earlier framing (since reframed by owner 2026-05-06): "Cyclical
learning-loop maintenance is a full-time process even at small N."
That framing treated the loop's maintenance cost as **inherent**.

Reframe: the cost is **artefactual** — a symptom of letting fitness
pressure accumulate across sessions rather than each session
running its own handoff plus consolidation at close. With proper
per-session discipline (each session graduates its own captured
substance into napkin → distilled → rules/governance, then trims
before closing), the loop stays in steady state. Pressure
accumulates only when sessions skip closure discipline. The
"full-time process" observation reflects historical practice, not
necessary cost.

Implications:

- The diagnostic is closure discipline, not loop cost. When fitness
  goes hard or distilled bloats, the question is *which sessions
  skipped closure* — not *the loop is overweight again, queue
  another graduation pass*.
- Each session **owns** its loop contribution; closure is
  non-negotiable. `jc-session-handoff` plus `jc-consolidate-docs`
  at session-end is the unit of loop maintenance.
- The reactive graduation passes (this one, prior ones) are the
  recovery work after closure was skipped. The cure is structural:
  closure discipline is the steady-state, not graduation passes.

This entry graduates as a closure-discipline rule or as an
amendment to the relevant PDR (per-session landing or capture-and-
distil), not as a fatalistic observation about cost.

### Hypothesis-Layer Routing for Multi-Agent Cures → `hypothesis.md` family

Multi-agent collaboration cures route through the hypothesis layer
before graduating to doctrine. Substance lives at
[`hypothesis.md`][n-agent-hypothesis] (per-primitive coordination
cures), [`falsification-criteria.md`][n-agent-falsify]
(per-primitive falsifiability), and [`experiments.md`][n-agent-experiments]
(empirical validation at N≥3). Capture → hypothesis → empirical
validation → graduate. Treated-as-hypothesis they get tested;
shipped-as-design they get defended. Substrate validated at N=2;
not yet at N≥3.

[n-agent-hypothesis]: ../../prompts/agentic-engineering/collaboration/hypothesis.md
[n-agent-falsify]: ../../prompts/agentic-engineering/collaboration/falsification-criteria.md
[n-agent-experiments]: ../../prompts/agentic-engineering/collaboration/experiments.md

---

## Recently Distilled — 2026-05-07 Doctor Safe-Merge Rotation

### Validation And Substrate Gates

- **Focused validation lanes must prove selection.** A targeted fixture lane is
  not credible until its no-match case fails. Use exact test paths or equivalent
  selectors with `--passWithNoTests=false`.
- **Every product branch in a fixture slice needs a literal fixture.**
  Defensive branches are product behaviour; if they classify or reject a
  substrate shape, they need a fixture in the same landing.
- **Generated read models need same-session refresh after source writes.**
  Passing parser checks on immutable fragments does not prove generated
  Markdown is current.

### Continuity And State Discipline

- **Portability review includes examples and narrative.** Host-shaped examples
  can leak concrete paths even after the main normative prose is fixed.
- **Git index operations are serial work.** `git mv`, staging, and commit-window
  actions all touch the shared index and must not be parallelised.
- **Deleted live state is gone, not a continuity topic.** Once owner direction
  deletes a live state tree, follow-up work is cleanup of stale live references
  and validation of absence, not repeated defence of the deleted tree.
