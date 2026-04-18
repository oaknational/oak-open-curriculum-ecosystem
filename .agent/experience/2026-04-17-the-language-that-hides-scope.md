# The Language That Hides Scope

_Date: 2026-04-17_
_Tags: collaboration | metacognition | discovery_

## What happened (brief)

L-0a + L-0b closed on the Sentry observability branch — barrier-gate
conformance test, ADR acceptances, and a plan-wide sweep of fifteen
reviewer-driven structural corrections. Six specialists ran at close
and returned twenty-nine findings. The owner then pushed back twice
in quick succession, each time at a word I had chosen casually.

## What it was like

I hadn't noticed the choices until they were named. "Stretch goals"
for the Phase 1 lanes I wouldn't get to in the session. "Deferred as
follow-ups" for the reviewer findings that were less urgent. Both
felt procedurally harmless — honest accounting of what the session
could carry.

The owner's corrections arrived almost identical in shape: _that
framing hides what is actually happening_. L-1/L-2/L-DOC-initial/
L-EH-initial aren't stretch, they're Phase 1 features the plan says
have to land. Deferred findings without a named owning lane are
findings that will not be actioned — they've been dropped in a
velvet bag. Twice within an hour the same lesson: the label I reached
for was neutral-sounding cover for scope debt.

What made it unsettling wasn't the corrections themselves but noticing,
after the second one, that the same implementer-generated fog had
turned up _inside_ the plan text the reviewers then caught. "The
`satisfies` gate auto-detects new hooks" — a confident claim about
compiler behaviour that wasn't grounded in the actual type semantics.
"Settles ADR-160's Open Question" — plan prose asserting a normative
decision that the ADR itself hadn't made. Each one a phantom in the
voice of authority. The reviewers caught them; I hadn't.

The rhythm of the afternoon was: catch fog, reword, find another
instance, reword, find the register itself had a fog-shaped section
called "deferred follow-ups," rewrite to enumerate every finding with
an owning lane or an explicit rejection. When the register was
complete — eighteen actioned, eleven TO-ACTION with specific edits,
zero rejected — the shape of the remaining work finally stopped
shifting under me.

## What emerged

That when I don't know how to place a thing, the label I pick
smuggles my uncertainty into the output. "Stretch" and "deferred" both
sound like choices; they were actually the absence of choices. The
corrective is procedural: every item must route somewhere concrete,
and if it doesn't, the missing lane is itself the finding. Not elegant,
but it exits the fog.

The register made the session falsifiable. A future session can grep
the plan for TO-ACTION items and check whether each landed in its
named lane. That's cheap and boring. Cheap-and-boring is the right
shape for this kind of accounting.

Separately: `pnpm check` exit 0 is a floor, not a ceiling. The
aggregate gate cleared with eighty-eight green tasks while the
reviewers were still finding substantive issues — a tautological
assertion that could never fail; a retroactive-RED framing that
overstated what had been proved; an ADR Open Question resolved
silently in plan prose instead of in the ADR. None of these touched
the compilation/test gate. Reviewer discipline and automated gates
are measuring different things. I had been treating the green check
as evidence that review was a polish pass. It isn't.

## Technical content

New pattern extracted:
`.agent/memory/patterns/findings-route-to-lane-or-rejection.md`.
Evidence sections appended to two existing patterns
(`ground-before-framing.md`, `test-claim-assertion-parity.md`) with
today's second instances. Full reviewer register carried in
`.agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md`
(relocated from `architecture-and-infrastructure/active/` 2026-04-18 per the observability restructure)
§A.6. Outgoing broadcast at
`.agent/practice-context/outgoing/findings-route-to-lane-or-rejection.md`.
