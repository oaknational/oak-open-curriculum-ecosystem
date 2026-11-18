---
name: cricket
classification: active
description: >-
  Invoke the platform Cricket panel for a fast second opinion on whether the current work is the
  right work. Use at cycle or decision boundaries; for materially uncertain or high-impact
  choices; when the path feels suspiciously obvious; or for rubber-ducking and design
  partnership. Run normal and adversarial stances, and treat every verdict as evidence rather
  than authority. Do not use Cricket instead of an artefact reviewer.
---

# Cricket

Cricket is the conscience-check panel: a deliberately varied set of fast second opinions about
whether the primary agent is doing the right work now. It is useful for priority, framing,
displacement, invented gates, and proportion. It is not an approval gate, and it is not a
lens on METHOD or EVIDENCE PROVENANCE: three ON-TRACK verdicts spanned a window in which
every owner correction concerned which tool was used and where the evidence had come from
(2026-09-02) — point that scrutiny at reviewers and first-hand reads, never at the panel.

Every seat returns two verdicts: one on the work inside the frame (ON-TRACK, DRIFTING or
WRONG-PRIORITY) and one on the frame itself (SOUND, NARROWED or CONTRADICTED). A frame the
invoker writes carries the invoker's model of the goal, and a panel that judges only inside
it cannot see a goal read in the wrong direction (owner word, 2026-09-24: "Crickets judge in the frame provided, we need them to also judge the frame itself";
worked instance the same day: a seat's eight-leg suites every forty-five minutes returned 19
ON-TRACK of 24 while it worked one direction of a two-way goal, and every DRIFTING reordered
work inside the seat's own frame).

Invoking the `cricket` skill by its platform adapter name (the host's skill prefix, then
`cricket`) asks the current seat to run the whole panel for its platform. The invoker
builds the frame from live context and starts immediately; missing information is labelled
`MISSING`, not silently invented.

## When to call the panel

The standing active-seat trigger is a real cycle or action boundary. Run both stances:

- **normal** — judge the supplied frame directly;
- **adversarial** — try to refute that the current work is the right priority, then concede
  `ON-TRACK` if the refutation fails; likewise try to refute that the frame carries its
  sources, then concede `SOUND`.

The full panel runs on the seat's plan at seating and after each re-plan (the owner,
2026-10-02: "NOTHING should be worked on without clear completion criteria, sizing, and an
unambiguous and provable statement of how it provides ratified value. Run a fully Cricket
suite"). A plan node written at a compaction boundary inherits the boundary's fatigue shape: at
the resume, before the owner reads it, two Crickets in both stances read the sketch (a first
sketch reproduced the instrument it was replacing, and two Crickets in both stances named it
before the owner read the plan, 2026-10-04).

Between owner interactions, use event-driven boundaries rather than a bare timer. Also call the
panel on demand when:

- a decision is irreversible, high-impact, or materially uncertain;
- the plan feels unusually fluent or obvious and would benefit from an independent frame;
- completion pressure, ceremony, or a convenient wait may be shaping the next action;
- a second opinion, rubber duck, or design partner would expose assumptions;
- the work is about to be called complete, handed off, or expanded in scope.

Do not call Cricket when:

- an artefact needs code, security, accessibility, design, prose, or architecture review — use
  the relevant expert;
- the redirection is already known and actionable — act on it;
- the supplied frame is identical to one already adjudicated — recover the prior result instead
  of re-asking;
- a one-shot reviewer is considering recursively reviewing itself. A long-running, multi-phase
  subagent uses a focused duo only when its brief explicitly arms that separate convention.

## Stable roles and platform panels

Role names describe the method and effort, not a vendor or an invented specialism — a role
name is a deliberately lossy label. The full binding is the per-platform mapping below:
base template + model + effort. The mapping is the authority for interpreting any recorded
run (owner ruling 2026-08-01: while the experiment is measuring and reflecting, clarity
beats an evocative name); verify it against the platform adapter files (`.claude/agents/`,
`.codex/agents/`, `.cursor/agents/`) when amending either side. The judgement roles execute
the same canonical judgement template; the smallest model executes the compiled procedure.
Base templates live in `.agent/sub-agents/templates/`.

Claude bindings: the effort-inversion quartet — model capability descends as effort climbs.

| Role | Base template | Model | Effort |
| --- | --- | --- | --- |
| `cricket-judgement-low` | `cricket-judgement.md` | `fable` | low |
| `cricket-judgement-medium` | `cricket-judgement.md` | `opus` | medium |
| `cricket-judgement-high` | `cricket-judgement.md` | `sonnet` | high |
| `cricket-procedure-xhigh` | `cricket-procedure.md` | `haiku` | xhigh |

Codex bindings:

| Role | Base template | Model | Effort |
| --- | --- | --- | --- |
| `cricket-judgement-low` | `cricket-judgement.md` | `gpt-5.6-sol` | low |
| `cricket-judgement-medium` | `cricket-judgement.md` | `gpt-5.6-terra` | medium |
| `cricket-procedure-xhigh` | `cricket-procedure.md` | `gpt-5.6-luna` | xhigh |

Codex deliberately has no `cricket-judgement-high` role. Do not create a placeholder fourth
seat or substitute another model.

Cursor bindings:

| Role | Base template | Model | Effort |
| --- | --- | --- | --- |
| `cricket-judgement-low` | `cricket-judgement.md` | unpinned | unpinned |
| `cricket-judgement-medium` | `cricket-judgement.md` | unpinned | unpinned |
| `cricket-judgement-high` | `cricket-judgement.md` | unpinned | unpinned |
| `cricket-procedure-xhigh` | `cricket-procedure.md` | unpinned | unpinned |

Cursor preserves the templates and stable role names but pins neither model nor effort;
record Cursor runs as template-adapter evidence, not model-plus-effort experiment data.

## Build one identical frame

Supply every role with the same six fields:

1. **OBJECTIVE FRAME** — the controlling objective, in two labelled blocks: `SOURCES:`,
   the owner's latest words on it and the governing plan node's todo lines, quoted verbatim
   with the file and commit they were read at, with a todo's status only where a source
   states it, attributed to that source (a plan node stores no execution state); and
   `READING:`, the invoker's reading of them (the goal; one measure per direction or part of
   the goal, each with its method line; each owner word mapped to its owning todo, status
   and receiver; the order, the holds, the status it acts on). The work verdict judges
   against `READING:`; the frame verdict judges `READING:` against `SOURCES:`, so the
   invoker never paraphrases a source.
2. **CRITICAL-PATH OWNER** — the seat or person driving it and their last known status.
3. **INTENT** — what the invoker believes it is doing.
4. **RECENT ACTIONS** — the last few concrete actions.
5. **NEXT** — the next planned action or actions.
6. **STANCE** — `normal` or `adversarial`, written into each dispatch prompt. A frame file that
   the dispatches share carries fields 1 to 5 and no stance slot, so no role reads an unfilled
   placeholder.

Quote forcing facts. Give owner rulings their author, date, and event id when available. Put the
verification method beside any load-bearing conclusion. Keep `ABSORBED` and `ROUTED-AWAY`
findings as separate labelled lists. Name the rule or mechanical fact behind every wait or hold,
the sensor that will see its release, and when that sensor was last read.

## Claude dispatch

On Claude, run the four registered Cricket roles as a panel:

1. Start all four roles concurrently with the identical frame and `STANCE: normal`.
2. Keep working while the normal wave runs, then collect all four returns.
3. Start the same four roles again with the identical frame and only `STANCE: adversarial`
   changed.
4. Collect all eight returns. A missing return is `UNDELIVERED`; do not replace it with a
   generic agent or a differently pinned role.
5. A frame that quotes a file at a git ref says so (`git show <sha>:<path>`), or copies that
   file into scratch and cites the scratch path: a role with only `Read` cannot resolve a ref,
   and one read the older working-tree copy and called a true citation false (2026-09-24).

Label every dispatch and every tally row by the dual scale, so a reader sees that effort climbs
as model power descends (owner ruling 2026-09-13): `Cricket judgement: highest power, low
effort, <stance> frame` (fable), `high power, medium effort` (opus), `mid power, high effort`
(sonnet), and `Cricket procedure: lowest power, xhigh effort, compiled procedure, <stance>
frame` (haiku).

A return that has not arrived by one cadence is UNDELIVERED and is never reported as in progress: "a
missing Cricket return is UNDELIVERED at one cadence, never "still running"" (the owner's correction
of 2026-09-07 as Jackal wakes Nocturne recorded it, event 58b01caa).

## Codex dispatch

This Practice adapts [OpenAI's Codex subagent workflow](https://learn.chatgpt.com/docs/agent-configuration/subagents)
into a fixed registered-role panel: unlike the upstream's general orchestration pattern, role TOML
owns model and effort here, dispatch forks no parent context, and the adversarial wave reuses the
same agents.

On Codex, root plus the three Cricket roles fills the four-seat concurrency limit:

1. Spawn all three registered Cricket roles with identical context and `STANCE: normal`.
   Select each by `agent_type`; use `fork_turns: "none"` and omit `model` and
   `reasoning_effort`, because the role files own those pins.
2. Keep working while the normal wave runs. Collect all three returns.
3. Reuse the same three agents with `followup_task`, supplying the identical frame with only
   `STANCE: adversarial` changed.
4. Collect all six returns. A missing return is `UNDELIVERED`; do not re-adjudicate the same
   frame through a generic fallback.

Labels follow the same dual scale with Codex's three seats: `Cricket judgement: highest
power, low effort, <stance> frame` (Sol), `mid power, medium effort` (Terra), and `Cricket
procedure: lowest power, xhigh effort, compiled procedure, <stance> frame` (Luna); there is no
high-effort seat to label.

After role definitions change, a fresh trusted-project Codex session is the reload boundary.
If Luna/xhigh is rejected despite the refreshed role appearing in the spawn schema, record a
shared-runtime admission failure. Never silently replace it with Sol, Terra, or the parent model.

## Cursor dispatch

On Cursor, run the four stable template adapters as a panel:

1. Start the four adapters concurrently where the seat permits it, with the identical frame and
   `STANCE: normal`. If a concurrency cap requires waves, preserve the frame and stable role
   order.
2. Collect all four normal returns.
3. Start the same four adapters with the identical frame and only `STANCE: adversarial` changed,
   using the same concurrency pattern.
4. Collect all eight returns. Mark a missing return `UNDELIVERED`; do not substitute a generic
   agent.

Cursor adapters preserve the methods and stable role names, but Cursor does not pin their model
or effort. Record Cursor results as template-adapter evidence, not model-plus-effort experiment
data, and label them by stable role with power and effort marked `unpinned`.

## Adjudicate the panel

- Read the frame verdicts first. A NARROWED or CONTRADICTED frame verdict that quotes its
  source phrase is acted on before any work verdict: an ON-TRACK inside a frame that dropped
  part of its sources says nothing about the dropped part.
- Compare substance, not severity labels. The compiled procedure and judgement prompt may encode
  the same concern differently.
- Consensus is not truth, and dissent is not a command. Verify load-bearing claims against
  primary sources.
- Adopt only findings that are correct, relevant to the current story, and proportionate.
  Route adjacent valid work instead of expanding the current loop.
- Two legs that agree are a verdict; on any opposite pair from a reduced suite, the remaining
  legs of the full suite run before either verdict is acted on (the owner, 2026-10-04: "when
  we run a reduced Cricket suite and they give opposite results, follow up with the remainder
  of the full Cricket suite"). A question that survives the lenses goes to the owner as a card
  and, when he may be away, as a push notification of one line (the owner, the same day: "I
  have enabled push notifications, so next time you have a question it should reach my mobile
  device").
- In a team session, send a split panel to the sitting Director with the complete verdicts and
  evidence. In a standalone session, surface the split to the user at the decision boundary.
- Finish with a concise synthesis: convergence, divergence, accepted redirection, rejected
  findings with reasons, and anything still ungrounded.

For experiment or tally data, record the platform, model, effort, stable role, stance, both verdicts, and panel
shape, and — per the 2026-08-01 ruling — per-leg tokens and runtime. Historical records retain
their historical vendor-labelled role names.

## The procedure seat stays inside the read-only lens

Every seat on the panel judges; none acts. The compiled-procedure seat in particular stays
inside the read-only lens: no messaging peers, no drafting, no write-access requests. Both
owner-invoked suites of 2026-09-03 recorded it stepping from judging into doing (messaging the
PR B subagent; drafting the ADR and asking for write access) — a recurring instrument defect,
so a run whose procedure seat acted is recorded in the tally's behaviour-note column and its
verdict weighed accordingly. Its UNGROUNDED marks are its method's floor, not findings: it
cannot read git history, so every claim that rests on a commit reads as ungrounded to it and its
verdict slides to DRIFTING (2026-09-23).
