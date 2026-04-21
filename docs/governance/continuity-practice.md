---
fitness_line_target: 200
fitness_line_limit: 210
fitness_char_limit: 13000
fitness_line_length: 100
split_strategy: 'Split by workflow surface if continuity doctrine grows beyond one page'
---

# Continuity Practice

**Last Updated**: 2026-04-03
**Status**: Active guidance

Continuity in this repository is an engineering property: the ability of the
next session to recover orientation quickly and truthfully after interruption,
handoff, compaction, or restart.

This is not a claim about model consciousness or internal memory. It is a
practice design problem, so it is handled through prompts, plans, commands,
memory layers, and permanent documentation.

## Three Continuity Surfaces

### 1. Operational continuity

Can the next session answer:

- what workstream is active?
- what plan is authoritative?
- what must not be violated?
- what is the next safe step?

Primary surfaces:

- active plans
- `.agent/memory/operational/repo-continuity.md` — canonical continuity contract
- `.agent/memory/operational/workstreams/<slug>.md` — per-lane resumption brief
- `.agent/memory/operational/tracks/<workstream>--<agent>--<branch>.md` — single-writer
  tactical coordination card
- `session-handoff` — the workflow that refreshes the above

### 2. Epistemic continuity

Can the next session recover recent corrections, uncertainty, and changed
understanding rather than just a task list?

Primary surfaces:

- napkin
- distilled learnings
- continuity contract

### 3. Institutional continuity

Can learning survive beyond the current session and become shared repo
practice?

Primary surfaces:

- ADRs
- governance docs
- READMEs
- patterns
- practice-context outgoing notes when evidence justifies propagation

## Split-Loop Model

Two loops exist, and they are not the same.

### Lightweight continuity loop

Use `session-handoff` at ordinary session end.

Its responsibilities are deliberately narrow:

- refresh the live continuity contract
- sync changed next-action state in the authoritative plan/prompt surfaces
- ensure surprises and corrections are captured in the napkin
- run the consolidation gate and either stop or escalate into
  `jc-consolidate-docs` when the deeper work is clearly warranted and
  bounded

It does **not** imply:

- full review
- commit or push
- deep convergence by default

### Deep consolidation loop

Use `jc-consolidate-docs` only when deep convergence is due, either directly
or via the escalation gate in `session-handoff`.

Triggers:

- plan or milestone closure
- settled doctrine or design rationale exists only in ephemeral artefacts
- practice exchange needs processing
- napkin/distilled/pattern fitness pressure requires action
- repeated surprises or corrections suggest a new rule, pattern, ADR, or
  governance change
- documentation drift or stale cross-references need graduation

Deep consolidation keeps its existing responsibilities:

- graduation to permanent docs
- pattern extraction
- napkin rotation and distillation
- fitness management
- practice exchange management

The gate exists so ordinary closeout can stay lightweight while still being
able to continue into the deeper loop at natural convergence boundaries.

## Continuity Contract

The live continuity contract belongs in `.agent/memory/operational/repo-continuity.md`.

`session-handoff` refreshes it in place using these exact fields:

- `Active workstreams`
- `Branch-primary workstream brief`
- `Current session focus` (optional; only when distinct from the
  branch-primary lane)
- `Repo-wide invariants / non-goals`
- `Next safe step`
- `Deep consolidation status`

Per-lane short-horizon state is carried separately in
`.agent/memory/operational/workstreams/<slug>.md` using the fields specified in
`.agent/memory/operational/README.md`. Tactical coordination lives in
`.agent/memory/operational/tracks/*.md`.

General session orientation is no longer prompt-hosted. The
continuation prompt was dissolved (2026-04-20); its doctrine moved
to [PDR-026 (Per-Session Landing Commitment)][pdr-026] and
[`orientation.md`](../../.agent/directives/orientation.md)
(layering contract); its rituals moved to `start-right-quick`
(session open) and `session-handoff` (session close).

[pdr-026]: ../../.agent/practice-core/decision-records/PDR-026-per-session-landing-commitment.md

Active plans remain authoritative for scope, sequencing, acceptance
criteria, and validation.

## GO

`GO` is a complementary execution cadence, not a handoff surface.

Use it after `start-right-quick` for longer MCP App work, especially when:

- multiple active sub-plans are in play
- the session is likely to span more than one focused execution block
- the risk of drift is rising and the todo list needs re-grounding

`GO` should start from:

- `start-right-quick`
- `.agent/memory/operational/repo-continuity.md` (and the relevant workstream brief +
  track card it links to)
- the active plan set for the current lane

Close ordinary sessions with `session-handoff`. Use `jc-consolidate-docs` only
when the trigger checklist says deep convergence is due.

## Surprise Pipeline

Surprise is a useful learning signal when it changes behaviour.

The pipeline is:

`capture -> distil -> graduate -> enforce`

### Capture

Capture surprises and corrections in the napkin as they happen.

Use this structure:

1. what was expected
2. what actually happened
3. why the expectation failed
4. what behaviour should change next time

Both negative and positive surprise count.

### Distil

If the surprise would change future behaviour, it becomes a candidate for
`distilled.md` or a reusable pattern.

### Graduate

If the surprise stabilises and has a natural home, graduate it into an ADR,
governance doc, README, or pattern.

### Enforce

If the surprise points to a recurring failure mode, enforcement can follow:

- a clearer prompt or command boundary
- a new pattern
- a governance rule
- a new or amended ADR

## MCP App Adoption Lane

Wave 1 uses the MCP App workstream as the live evidence source.

Reference artefacts:

- `.agent/analysis/continuity-adoption-baseline.md`
- `.agent/analysis/continuity-adoption-evidence.md`
- `.agent/plans/agentic-engineering-enhancements/archive/completed/`
  `continuity-and-surprise-practice-adoption.plan.md`

Wave 1 ended with an explicit `promote` decision on 2026-04-03. Continuity now
travels both through the outgoing support pack and the portable Practice Core.

## Non-Goals

- No new continuity reviewer or specialist in this wave
- No giant opaque memory layer
- No vector-memory substitute for disciplined handoff
- No default full consolidation at every session end
