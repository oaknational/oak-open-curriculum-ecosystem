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

Held — owner-sharpened amendment to PDR-026 §Deferral-honesty
discipline is itself sequenced behind enforcement infrastructure
(doctrine-scanner CLI extension). Authoring it without the
enforcement would be the failure mode the amendment names.

Three modes:

1. **Sequenced deferral** (preferred) — "we will do X after Y, per
   plan Z phase N".
2. **Sequencing-sequenced deferral** (rare) — "we will decide when
   to do X at decision point Y, per plan Z phase N".
3. **Hidden declaration of non-action** (forbidden) — "we'll do X
   later" without structural placement, which conceals the choice.

Non-action can be the architecturally correct answer; it must be
visible, explicit, and sometimes discussed.

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

### Cyclical Learning-Loop Maintenance → `agent-collaboration.md` or PDR amendment

Cyclical learning-loop maintenance is a full-time process even at
small N. Owner-named meta-observation: *"the cyclical nature, even
with only two agents running, managing the learning loop is a full
time process"*.

The full loop is napkin (capture) → other sources → distilled
(refinement) → pending-graduations (queue) → directives (permanent
doctrine), then restart from napkin against the new ground. Each
pass produces both new substance (the work itself) AND new
substance about the loop (this observation is itself an instance).
The loop is self-feeding by design and does not asymptote — every
consolidation pass discovers new candidate-substance that requires
future passes.

Operational implication: the loop is not "consolidation work that
happens sometimes between feature work"; it is the substrate that
future feature work runs on, and its maintenance cost is
*baseline*, not overhead. At N=2 agents producing substance, the
maintenance cost is already a full-time process; this scales
superlinearly with N because cross-agent coordination substance
accumulates faster than any single agent's substance graduates
upward.

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
