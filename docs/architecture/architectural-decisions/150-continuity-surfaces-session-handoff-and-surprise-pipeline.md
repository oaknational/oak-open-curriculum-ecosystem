# ADR-150: Continuity Surfaces, Session Handoff, and Surprise Pipeline

**Status**: Accepted (amended 2026-04-20)
**Date**: 2026-04-02 (amended 2026-04-20 — §3 abstracted from
prompt-host to canonical repo-local surface; §4 generalised; Rationale
and Consequences language aligned to the amendment per OAC Phase 4.3)
**Related**: [ADR-117](117-plan-templates-and-components.md),
[ADR-119](119-agentic-engineering-practice.md),
[ADR-124](124-practice-propagation-model.md),
[ADR-125](125-agent-artefact-portability.md),
[ADR-131](131-self-reinforcing-improvement-loop.md),
[ADR-144](144-two-threshold-fitness-model.md)

## Amendment Log

- **2026-04-20** (OAC Phase 4.3): §3 rewritten to abstract the continuity
  contract from the session-continuation prompt to a canonical repo-local
  surface whose exact path is host-local. §4 generalised from "the active
  MCP App plan set" to "the active plan set for the current lane".
  Rationale and Consequences language aligned. Doctrine unchanged (three
  continuity types, split-loop model, contract field set, surprise
  pipeline all preserved). See
  [operational-awareness-and-continuity-surface-separation.plan.md](../../../.agent/plans/agentic-engineering-enhancements/active/operational-awareness-and-continuity-surface-separation.plan.md).

## Context

This repository already has strong memory and documentation machinery:

- active plans carry execution authority
- session prompts carry live operational state
- the napkin and distilled layers capture recent and stabilised learning
- `consolidate-docs` graduates stable understanding into permanent surfaces

What it lacked was a clean boundary between ordinary session continuity and
deep convergence.

The previous `wrap-up` surface bundled too much into one end-of-session ritual:
plan updates, review, deep consolidation, commit, push, and handover. It was
rarely used in practice, and it made simple session recovery depend on a much
heavier closeout path than the MCP App lane needs.

At the same time, surprise and correction were clearly important learning
signals, but they were captured informally rather than as an explicit pipeline.

## Decision

Treat continuity as a first-class engineering concern with three surfaces:

1. **Operational continuity** — the next session can recover orientation and
   act safely.
2. **Epistemic continuity** — the next session can recover understanding,
   uncertainty, and recent corrections truthfully.
3. **Institutional continuity** — learning can outlive the current session,
   model instance, or operator.

Adopt the following split-loop model:

### 1. Ordinary session end uses `session-handoff`

Replace `wrap-up` with a lightweight `session-handoff` command. Its job is only
to:

- refresh the live continuity contract
- sync any changed next-action state in plans/prompts
- ensure recent surprises or corrections are in the napkin
- run a consolidation gate that either stops cleanly or escalates into
  `consolidate-docs` when the deeper work is clearly warranted and bounded

It must not implicitly trigger full review, commit/push, or make deep
convergence the default.

### 2. Deep convergence stays in `consolidate-docs`

Keep `consolidate-docs` as the convergence workflow for graduation,
distillation, pattern extraction, practice exchange, and fitness management.

Run it only when one or more explicit triggers hold, whether invoked directly
or reached through the `session-handoff` consolidation gate:

- plan or milestone closure
- settled doctrine or design rationale exists only in ephemeral artefacts
- practice exchange needs processing
- napkin/distilled/pattern fitness pressure requires action
- repeated surprises or corrections suggest a new rule, pattern, ADR, or
  governance change
- documentation drift or stale cross-references need graduation

### 3. The continuity contract lives in a canonical repo-local surface

The operational continuity surface is a canonical, compact repo-local
file that every workflow reads first. Its required fields are:

- `Active workstreams`
- `Branch-primary workstream brief`
- `Current session focus` (optional; only when distinct from the
  branch-primary lane)
- `Repo-wide invariants / non-goals`
- `Next safe step`
- `Deep consolidation status`

Per-lane short-horizon state (current objective, blockers, promotion
watchlist) is carried in a per-workstream brief surface, and tactical
coordination in single-writer track cards. The exact file paths are a
host-local implementation detail. _(Illustrative only, non-normative:_
_this repository implements the surface set under `.agent/state/` and_
_`.agent/runtime/tracks/`; see the state scaffolding docs for the_
_realising paths.)_

The continuity surface set is operational only. Active plans remain
authoritative for scope, sequencing, acceptance criteria, and validation.
The continuation prompt is a behavioural entry surface; it does not host
continuity state.

### 4. `GO` is a mid-session execution cadence

Retain `GO` as a complementary execution workflow. It starts from
`start-right-quick`, the canonical continuity surface (plus the relevant
workstream brief it links to), and the active plan set for the current
lane.

It is not a handoff surface. Ordinary closeout goes through `session-handoff`.
Deep convergence goes through `consolidate-docs` when the trigger checklist
fires.

### 5. Surprise becomes an explicit pipeline

Formalise the learning path for surprise and correction:

`capture -> distil -> graduate -> enforce`

Initial capture happens in the napkin using a structured surprise format.
Promotion still follows the existing bar for distilled learnings, patterns,
governance updates, or ADRs. No automatic shortcut to permanent doctrine is
introduced.

## Rationale

### Why continuity is an engineering property

The useful question here is not whether a model "remembers". The useful
question is whether the human-agent system can recover orientation after
interruption, restart, or handoff. That is a workflow and documentation design
problem, so it belongs in engineering practice.

### Why split the loops

Ordinary session resumption and deep convergence are both valuable, but they
operate at different weights and cadences. Conflating them makes simple
handover expensive and encourages people to skip the workflow altogether.

The consolidation gate preserves the distinction: ordinary closeout remains
lightweight until the trigger is clear, but the workflow can still continue
into deep convergence when the session has genuinely reached a natural
consolidation boundary.

### Why a canonical repo-local surface for the contract

A canonical repo-local surface (separate from any behavioural entry
prompt) keeps resumption fast while keeping each surface single-purpose.
Co-hosting the contract inside an operational prompt conflates two jobs:
grounding the session (behavioural) and describing its live state
(content that changes every session). Separating them makes each
surface easier to reason about, easier to multi-write safely via
per-workstream briefs and single-writer track cards, and easier to
discover on a fresh checkout. Active plans remain authoritative for
everything that should not be duplicated.

### Why revive `GO`

`GO` proved useful as a structured execution cadence in longer sessions. Its
value is in mid-session re-grounding, not in end-of-session closure.

### Why formalise surprise

Corrections and surprises are where mental models change. Making that signal
explicit increases the chance that useful learning graduates into stable
practice instead of disappearing into chat history.

## Consequences

### Positive

- Ordinary session handoff becomes lighter and more likely to be used.
- Deep consolidation keeps its full role, but no longer blocks everyday
  continuity.
- The repo gains a durable operational continuity contract decoupled
  from any single workflow prompt, so resumption, handoff, and
  multi-agent coordination share the same surface set.
- Surprise and correction gain a clearer path into institutional memory.
- The practice stays portable by design while remaining repo-local first.

### Negative

- One more persistent surface now needs to stay in sync with active plans.
- A badly maintained continuity contract could drift into duplicated authority.
- The split-loop model adds another distinction contributors must learn.

## Non-Goals

- This ADR does not claim model consciousness or internal continuity.
- This ADR does not change `.agent/practice-core/*`.
- This ADR does not introduce a new reviewer or specialist for continuity in
  wave 1.
- This ADR does not make full consolidation the default session closeout path.
