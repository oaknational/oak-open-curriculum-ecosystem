---
name: "Skills Oversized-Core Decomposition"
overview: "Decompose the canonical skill bodies that exceed the Agent Skills progressive-disclosure budget into a thin SKILL-CANONICAL.md body plus on-demand `references/` files with explicit when-to-load triggers, following the external oak-skills repo's reference pattern."
status: future
type: agent-tooling
last_updated: 2026-06-14
isProject: false
---

# Skills Oversized-Core Decomposition

**Status**: FUTURE strategic brief. Not executable until promoted to `current/`.
**Source**: skills audit 2026-06-14 (this session) against the
[Agent Skills specification](https://agentskills.io/specification) and
[best practices](https://agentskills.io/skill-creation/best-practices),
cross-referenced with the external
[`oak-skills`](https://github.com/oaknational/oak-skills) reference implementation.

## Problem And Intent

The Agent Skills spec recommends a `SKILL.md` body stay under **500 lines / ~5000
tokens** — just the instructions needed on every activation — and pushes detail
into `references/` files loaded only when the task calls for them
(progressive disclosure). Four canonical bodies in `.agent/skills/` exceed that
budget today, measured 2026-06-14:

| Skill | Lines | Over budget |
|---|---|---|
| `start-right-team` | 802 | yes |
| `consolidate-docs` | 793 | yes |
| `session-handoff` | 714 | yes |
| `commit` | 652 | yes |

Because the Claude adapter is a redirect stub, **the entire canonical body loads
into context on activation** — so the over-budget cost is paid in full every time
one of these skills fires. The external `oak-skills` repo already demonstrates the
target pattern: every skill there is a thin body (≤340 lines) plus a `references/`
directory, with the body acting as a routing table ("for X, load
`references/x.md`").

The intent is to bring these four canonicals under budget by moving depth into
`references/` (or the existing in-repo `shared/` convention) behind explicit
load-on-demand triggers, without losing any doctrine.

## End Goal

Each of the four canonicals is a thin instruction body under the spec budget, with
detail in `references/` files the agent loads only when its instructions say to.
Activating one of these skills costs materially fewer tokens, and no doctrine is
lost.

## Mechanism

The spec's progressive disclosure is the mechanism: a small always-loaded body
plus on-demand reference files. `oak-skills/skills/oak-accessibility/SKILL.md` is
the concrete template — a thin floor plus a routing block ("The criteria
themselves → `references/wcag-2-2-aa.md`; Documents/decks → …"). Reducing the
always-loaded body shrinks the per-activation context cost; explicit when-to-load
triggers keep the agent from loading detail it does not need.

## Means

- Per skill, separate the always-needed instructions (stay in the body) from
  load-when-X detail (move to `references/<topic>.md`), adding an explicit
  when-to-load trigger for each reference file.
- Reconcile the existing `shared/<id>.md` convention (used by `start-right-quick`,
  `go`, `complex-merge`, `start-right-thorough`) with the spec's `references/`
  name — decide one convention at promotion and apply it consistently.
- Regenerate adapters and confirm the drift gate (`pnpm skills:check`) passes.
- Verify each decomposed skill still activates and behaves identically by
  exercising it (run-the-thing, not source inspection).

## Domain Boundaries And Non-Goals

- **In scope**: the four named over-budget canonicals; the body/`references` split;
  the `shared/` vs `references/` convention decision.
- **Non-goals**: rewriting skill doctrine content; touching skills already under
  budget; the owned/ingested or `classification` frontmatter questions (those are
  PDR-051 reconciliation, recorded as friction F-37); evals (separate brief
  [`skills-eval-harness.plan.md`](skills-eval-harness.plan.md)).

## Dependencies And Sequencing

- **Blocking**: the generator's **bytewise supporting-file copy** (PDR-051
  §Required gap #4, recorded in friction **F-37** and the owning plan's
  §Reality Reconciliation). The current generator does **not** copy `references/`
  into the two adapter surfaces. Adding `references/` to a canonical before that
  gap is closed would leave the `.agents/skills/` and `.claude/skills/` adapters
  without the reference files — the redirect resolves in-repo, but the two-surface
  contract (PDR-051) would be silently violated. This brief cannot execute until
  that gap is closed or explicitly waived for the in-repo redirect case.
- **Beneficial**: the deferred PDR-051 review (F-37) settling the `shared/` vs
  `references/` convention. Minimum shippable shape without it: adopt `references/`
  (the spec name) and note the `shared/` reconciliation as follow-up.

## Strategic Acceptance Criteria And Success Signals

- All four canonical bodies under 500 lines / ~5000 tokens after decomposition.
- No doctrine lost: a diff review confirms every instruction survives, in body or
  in a reference file with a load trigger.
- `pnpm skills:check` green; each decomposed skill exercised and behaves as before.
- Per-activation token cost for these skills measurably reduced.

## Risks And Unknowns

- **Over-splitting** — moving always-needed content behind a trigger the agent
  fails to fire, silently degrading behaviour. Mitigation: only move genuinely
  conditional detail; keep the floor in the body.
- **Convention churn** — `shared/` vs `references/` decided inconsistently.
  Mitigation: decide once at promotion, apply uniformly.
- **Promotion-gate dependency** — the supporting-file-copy gate (below) and the
  F-37 review are upstream of this work; until they resolve, this brief stays in
  `future/` behind its named trigger, which is the intended lifecycle state.

## Promotion Trigger

Promote to `current/` when the PDR-051 supporting-file-copy gap (F-37 #4) is
closed or explicitly waived for the in-repo redirect case, **and** the
`shared/`-vs-`references/` convention is settled — or on owner-direct promotion.

## Execution Note

Execution decisions (per-skill split boundaries, exact reference file names, the
convention choice, TDD cycle structure) finalise only at promotion to `current/`.
This brief names intent and constraints, not an execution commitment.
