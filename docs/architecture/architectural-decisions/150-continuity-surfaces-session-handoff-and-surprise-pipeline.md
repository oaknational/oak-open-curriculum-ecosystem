# ADR-150: Continuity Surfaces, Session Handoff, and Surprise Pipeline

**Status**: Accepted
**Date**: 2026-04-02
**Related**: [ADR-117](117-plan-templates-and-components.md),
[ADR-119](119-agentic-engineering-practice.md),
[ADR-124](124-practice-propagation-model.md),
[ADR-125](125-agent-artefact-portability.md),
[ADR-131](131-self-reinforcing-improvement-loop.md),
[ADR-144](144-two-threshold-fitness-model.md)

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

### 3. The continuity contract lives in the MCP App continuation prompt

The operational continuity surface is a fixed `Live continuity contract`
section in `.agent/prompts/session-continuation.prompt.md`.

Its fields are:

- `Workstream`
- `Active plans`
- `Current state`
- `Current objective`
- `Hard invariants / non-goals`
- `Recent surprises / corrections`
- `Open questions / low-confidence areas`
- `Next safe step`
- `Deep consolidation status`

The prompt remains operational only. Active plans remain authoritative for
scope, sequencing, acceptance criteria, and validation.

### 4. `GO` is a mid-session execution cadence

Retain `GO` as a complementary execution workflow. It starts from
`start-right-quick`, the latest continuity contract, and the active MCP App
plan set.

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

### Why keep the continuity contract in the prompt

The continuation prompt is already the live operational entry point for the MCP
App lane. Adding a compact contract there makes recovery fast while leaving
plans authoritative for everything that should not be duplicated.

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
- The MCP App lane gains a durable operational contract for resumptions.
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
