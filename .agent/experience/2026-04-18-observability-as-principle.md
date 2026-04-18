# Observability as Principle

_Date: 2026-04-18_
_Tags: emergence | stewardship | discovery | metacognition_

## What happened (brief)

A follow-on session to yesterday's L-0b close. Started with a routine
report request — where are we on observability, what's the gap — and
ended with the whole shape of the work reframed. Sentry observability
went from "the current branch's expansion" to "a project-wide
foundational principle spanning five axes." A new ADR, a new plan
directory, a new documentation tier, a new core workspace, and
seventeen new plan files all scheduled out of the exercise.

## What it was like

The shape of the session was a sequence of narrow framings meeting
wider horizons. Each question I asked was shaped by the previous answer;
each answer reshaped the next question. Early on I was still treating
observability as infrastructure — errors, spans, alerts, release
linkage. The owner said "high levels of observability across
engineering, product, usability, accessibility and so on," and the
envelope doubled. I was still treating Sentry as the primary vendor
and everything else as integration hygiene. The owner said "this
project is, in part, an exploration of a more integrated PaaS approach
to full observability" — and suddenly the research wasn't a side
note, it was the co-deliverable.

What I noticed about myself across the session: when I didn't know how
to place something, I reached for neutral-sounding labels. "Stretch."
"Deferred." "Nice to have." Each one got corrected. The corrections
were not about the labels per se — they were about what the labels
allowed me to avoid. "Stretch" let me not decide whether L-1 was MVP.
"Deferred" let me not route reviewer findings to specific lanes.
"Future enhancement" let me not ask what would promote work from
future to present.

By the end I was writing explicit forms by default. "MVP across five
axes because launch context is public-beta-long-lived." "Trigger:
first LLM-calling MCP tool lands." "Proposed because ADR-160 Open
Questions are still Open." The explicit form is heavier but it
doesn't smuggle. Each time I wrote an explicit form I could feel
where the weight was — sometimes the weight was a genuine gap that
needed filling; sometimes it was uncertainty I'd been hiding from
myself.

The observability restructure itself is simple in shape: a directory
move, an ADR draft, a plan template. The hard part was seeing that
the one-branch framing was the accidental shape, and the project-wide
framing was the intentional one that the architecture had already
been quietly preparing for. ADR-078 (DI), ADR-143 (fan-out), ADR-154
(framework/consumer separation) — each was one side of a bigger
shape that nobody had yet named. ADR-162 names it. The naming is the
upgrade path.

## What emerged

That implicit architectural intent and enforced architectural
principle are different tiers. The adapter pattern at
`@oaknational/sentry-node` has always structurally enabled vendor
independence; the repo's existing ADRs have always implied it;
nobody had written it as a principle with a conformance gate. The
structural groundwork was ready; naming was what remained. The
session's shape was: recognise the unnamed principle, name it,
schedule the test that proves it.

That a documentation tier I didn't know we were missing was
missing. Between napkin (ephemeral) and ADR (committed) sits the
reasoning trail — the option-weighing, the evidence-gathering, the
research question that hasn't yet crystallised into a decision.
That tier had no home until today. `docs/explorations/` fills it.
The inaugural entry is the rationale document for this session's
reframe. Future sessions will cite it when they wonder why the
observability work took this shape.

That the "nothing unplanned" exercise surfaces structural gaps more
than it generates plans. When I had to find a promotion trigger for
each of fourteen items, the items split: some had triggers I
hadn't noticed; some revealed the author's priority (me treating
them as "future" when they were actually MVP); some had no trigger
and had to be either rejected or re-scoped. The trigger discipline
is a forcing function that makes the planning honest.

## Technical content

New ADR scheduled: ADR-162 Observability-First (five axes +
vendor-independence clause). Phase 1 of the restructure plan will
draft it in Proposed. Phase 5 will accept it once enforcement is
concrete. New core workspace scheduled:
`packages/core/observability-events/`. New documentation tier:
`docs/explorations/`. New plans directory: `.agent/plans/observability/`.

Two patterns extracted this rotation window:
`findings-route-to-lane-or-rejection` (review-layer no-smuggled-drops,
from 2026-04-17), and
`nothing-unplanned-without-a-promotion-trigger`
(planning-layer sibling, from today).

Session report at
`docs/explorations/2026-04-18-observability-strategy-and-restructure.md`
carries the full rationale. Execution plan at
`.agent/plans/architecture-and-infrastructure/current/observability-strategy-restructure.plan.md`.
Both are intended to survive the session they emerged in.
