---
fitness_line_target: 200
fitness_line_limit: 220
fitness_char_limit: 13000
fitness_line_length: 100
split_strategy: 'Split by workflow surface if continuity doctrine grows beyond one page'
---

# Continuity Practice

**Last Updated**: 2026-04-24
**Status**: Active guidance

Continuity is an engineering property: the next session can recover
orientation quickly and truthfully after interruption, handoff,
compaction, or restart.

This is not a claim about model consciousness or private memory. It is
a practice design problem handled through directives, commands,
plans, operational memory, active memory, and permanent documentation.

## Surface Roles

Each continuity surface has one job. Do not let live state, doctrine,
and historical explanation collapse into one file.

| Surface | Role |
| --- | --- |
| This directive | Strategy, rules, and process for continuity |
| `.agent/memory/operational/repo-continuity.md` | Compact repo-level active state |
| `.agent/memory/operational/threads/<slug>.next-session.md` | Per-thread identity, landing target, and lane state |
| `.agent/memory/operational/tracks/*.md` | Short-lived tactical coordination cards |
| `.agent/memory/active/napkin.md` | Session observations, surprises, and corrections |
| `.agent/memory/active/distilled.md` | Refined cross-session learning awaiting graduation |
| Permanent docs, ADRs, PDRs, rules | Graduated doctrine and enforcement |

The rule of thumb: if a claim should remain true across many sessions,
it belongs here or in permanent doctrine. If it answers "what is live
right now?", it belongs in operational memory.

## Continuity Questions

### Operational continuity

Can the next session answer:

- which thread is active?
- which plan is authoritative?
- what must not be violated?
- what is the next safe step?

### Epistemic continuity

Can the next session recover recent corrections, uncertainty, and
changed understanding rather than just a task list?

### Institutional continuity

Can learning survive beyond the current session and become shared
repo practice?

## Process Loops

Two loops exist, and they are not the same.

### Lightweight Continuity Loop

Use `session-handoff` at ordinary session end.

Its responsibilities are deliberately narrow:

- record landed or unlanded outcome against the landing target;
- refresh compact active state in `repo-continuity.md`;
- update touched thread records and tactical track cards;
- capture surprises and corrections in the napkin;
- run the consolidation gate.

It does not imply full review, commit, push, or deep convergence.

### Deep Consolidation Loop

Use `jc-consolidate-docs` only when deep convergence is due.

Triggers include:

- plan or milestone closure;
- settled doctrine or design rationale stranded in ephemeral artefacts;
- practice exchange that needs processing;
- napkin, distilled, pattern, or fitness pressure that requires action;
- repeated surprises suggesting a rule, pattern, ADR, or PDR;
- documentation drift or stale cross-references that need graduation.

Deep consolidation owns graduation, pattern extraction, napkin
rotation, fitness management, and practice exchange.

## Continuity Contract

The live continuity contract belongs in
`.agent/memory/operational/repo-continuity.md`.

`session-handoff` refreshes it using these fields:

- `Active threads`;
- `Branch-primary lane state`;
- `Current session focus`, only when distinct from the branch-primary lane;
- `Repo-wide invariants / non-goals`;
- `Next safe step`;
- `Deep consolidation status`.

Keep that file compact and operational. Active plans remain
authoritative for scope, sequencing, acceptance criteria, and
validation. Thread records carry per-thread identity and lane state.
Track cards are tactical and must resolve, promote, or delete at
session close.

Do not create a generic "standing decisions" bucket. Standing
decisions live in their proper homes: ADRs, PDRs, directives, rules,
plans, or thread records.

The retired `workstreams/<slug>.md` surface is historical. Lane state
now folds into `threads/<slug>.next-session.md` per PDR-027.

## GO

`GO` is a complementary execution cadence, not a handoff surface.

Use it after `start-right-quick` when:

- the session is likely to span more than one focused execution block;
- multiple active plan surfaces are in play;
- the risk of drift is rising and the todo list needs re-grounding.

`GO` starts from the session-start workflow, `repo-continuity.md`,
the relevant thread record, and the active plan set. Close ordinary
sessions with `session-handoff`. Use `jc-consolidate-docs` only when
the trigger checklist says deep convergence is due.

## Surprise Pipeline

Surprise is useful when it changes behaviour.

The pipeline is:

`capture -> distil -> graduate -> enforce`

- **Capture** surprises and corrections in the napkin as they happen.
- **Distil** recurring or high-signal observations into `distilled.md`
  or a pattern candidate.
- **Graduate** stable understanding into an ADR, PDR, governance doc,
  README, TSDoc, or rule.
- **Enforce** recurring failure modes through a command boundary,
  pattern, rule, quality gate, or amended decision record.

Use the napkin surprise shape: expected, actual, why the expectation
failed, and behaviour change.

## Non-Goals

- No new continuity reviewer or specialist by default.
- No giant opaque memory layer.
- No vector-memory substitute for disciplined handoff.
- No default full consolidation at every session end.
- No operational history in this directive; history belongs in
  archives, git, plans, or active-state records while still live.
