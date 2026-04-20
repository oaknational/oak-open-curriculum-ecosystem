---
prompt_id: session-continuation
title: "Session Continuation"
type: workflow
status: active
last_updated: 2026-04-20-oac-phase-4-retirement
---

# Session Continuation

This prompt is a **behavioural entry surface**. It owns read order, routing,
and operating instructions. It does **not** host continuity state.

State lives in three repo-local surfaces, in authority order:

1. `.agent/memory/operational/repo-continuity.md` — canonical continuity contract.
2. `.agent/memory/operational/workstreams/<slug>.md` — per-lane resumption brief.
3. `.agent/memory/operational/tracks/<workstream>--<agent>--<branch>.md` — single-writer
   tactical coordination card (optional, session-scoped).

See [`.agent/memory/operational/README.md`](../memory/operational/README.md) and
[`.agent/memory/operational/tracks/README.md`](../memory/operational/tracks/README.md) for the contracts.

## Ground First

1. Read and internalise the durable directives:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Scan the [Start Here: 5 ADRs in 15 Minutes](../../docs/architecture/architectural-decisions/README.md#start-here-5-adrs-in-15-minutes)
   block in the ADR index, and open any ADR whose slug matches your current
   workstream from the [full ADR index](../../docs/architecture/architectural-decisions/README.md).
3. Read the learning-loop surfaces:
   - `.agent/memory/active/distilled.md`
   - `.agent/memory/active/napkin.md`
4. Read the live state surfaces, in authority order:
   - `.agent/memory/operational/repo-continuity.md` — active workstreams, branch-primary
     workstream brief, repo-wide invariants, next safe step, deep-consolidation
     status.
   - `.agent/memory/operational/workstreams/<slug>.md` — the workstream brief for the lane
     you are about to resume. Follow the "Active track links" field to any
     live tactical track card(s).
   - `.agent/memory/operational/tracks/*.md` — any relevant tactical track card(s).
5. Read the active plan(s) named in the workstream brief. Plans are
   authoritative for scope, sequencing, acceptance, and validation.
6. Re-establish live branch state:

```bash
git status --short
git log --oneline --decorate -5
```

## This Prompt's Role

- Behavioural entry surface only — grounding order, role statement, and the
  per-session landing commitment.
- Active plans are authoritative for scope, sequencing, acceptance, and
  validation.
- State surfaces are authoritative for continuity, lane resumption, and
  tactical coordination.
- If the prompt text conflicts with an active plan or state surface, the plan
  / state surface wins.

## Per-Session Landing Commitment

Every session opens by stating what it **will land** (a concrete,
externally-verifiable outcome) or explicitly naming that no landing
is targeted and why. A landing target is a specific invariant
achieved in code — a rule enabled, a test added, a file authored, a
commit made, a deployment registered — not a plan edit or a "lane
opened." If the session completes without the landing, the close
records what prevented it and what the next session will re-attempt.

**Why this matters**: auto-mode makes it easy to spend a session
refining plans, updating prompts, and opening review loops without
leaving any externally-observable change in the system. Naming the
landing target at open forces the session's work to compose toward
it; reviewing against it at close distinguishes "session produced
evidence" from "session produced more plans."

**Structure at open**:

> Target: `<lane-id or artefact>` — `<specific outcome>`.
> If no target is appropriate: "no-landing session — reason: `<reason>`."

**Structure at close**:

> Landed: `<outcome>` — `<evidence link>`.
> If unlanded: `<what was attempted>` — `<what prevented>` —
> `<what next session re-attempts>`.

**Exceptions**: deep-consolidation sessions, Core-trinity refinement
sessions, and root-cause investigation sessions legitimately have
no code-landing target; they record their exception reason up-front
and close with a shape-specific artefact (consolidation commit,
trinity diff, investigation report).

This field composes with
[`what-the-system-emits-today.md`](../plans/observability/what-the-system-emits-today.md)
for observability work specifically: if the landing moved a matrix
cell from empty to populated, update the artefact in the same
commit.

## Reviewer Discipline

Run specialist reviewers per phase per the matrix in the executable
plan. Prompts must be:

- **Self-contained** — the reviewer sees nothing from this conversation.
- **Non-leading** — pose questions, do not pre-suppose answers.
- **Scoped** — word-capped, with a clear review lens.

Reviewer phases are aligned: plan-time (solution-class) → mid-cycle
(solution-execution) → close (coherence). Close-only scheduling is the
anti-pattern.

Findings are actioned unless explicitly rejected with written
rationale. Reviewer results that contradict this prompt or the plan
win.

## Core Invariants

- DI is always used — enables testing with trivial fakes (ADR-078).
- `principles.md` is the source of truth; rules operationalise it.
- Separate framework from consumer in all new work (ADR-154).
- Decompose at tensions rather than classifying around compromises.
- Apps are thin interfaces over SDK/codegen capabilities.
- Widget HTML is generated metadata — same codegen constant pattern
  as `WIDGET_URI`, tool descriptions, documentation content.

## Durable Guidance

- **The quality-gate criterion is always `pnpm check` from the repo
  root, with no filtering, green.** Individual gates may be invoked
  one at a time while iterating to narrow a failure, but the
  phase-boundary and merge criterion is `pnpm check` exit 0 with no
  filter. No exceptions; no "pre-existing" dismissals.
- Run `pnpm fix` to apply auto-fixes.
- Keep this prompt concise and operational; do not duplicate plan
  authority or state-surface content. If a piece of information
  resumes sessions, it belongs in a state surface. If it governs
  scope, it belongs in an active plan. If it governs behaviour on
  every session, it belongs here.
