# Installing a Tripwire I Cannot Test

_Date: 2026-04-21_
_Tags: metacognition | agent-infrastructure | passive-vs-active | self-reference_

## What happened (brief)

Session 1 of the Staged Doctrine Consolidation and Graduation
plan. Six small landable deliverables: extend the Standing
decisions section, author two pattern files (inherited-framing,
passive-guidance), install the first Family-A tripwire as a
`.agent/rules/*.md` always-applied rule, refresh the `practice.md`
Artefact Map, optionally write an experience entry. The patterns
were extracting a failure mode (`inherited-framing-without-first-
principles-check`) that has six instances across the two prior
sessions; the tripwire was the first environmentally-enforced
countermeasure against it.

## What it was like

The strangest part was the self-reference. The work was to
install a rule that fires on shape-entry when a plan body
prescribes a shape; the work itself was executing a plan body
that prescribed the shape "write these six deliverables in this
order." The tripwire I was installing was exactly the tripwire
that should have fired on the opener I was executing.

It didn't feel dangerous. The opener is brief, the plan body is
thorough, and the Standing decisions are explicit. The shape —
patterns first, rule next, Artefact Map last — held up to the
three-clause check: the Oak-authored behaviour being proven is
"documentation landing correctly" (deterministic grep assertions
are right for that), the file-naming carries no silent tooling
contract I failed to read, the vendor-literal clause doesn't
apply to a markdown-only session. The check passed. The meta-
noticing of "the check is passing on the session that installs
the check" was the surplus.

The second strangeness was writing about a guardrail that cannot
earn its cost in the session that installs it. The
`passive-guidance-loses-to-artefact-gravity` pattern says a
watchlist item is insufficient without a firing cadence; the rule
I wrote has a firing cadence (loaded on every session, checked on
action entry), but the first session it fires in will be Session 2
— not this one. The evidence of the tripwire's design correctness
lives in the future. That was an unfamiliar place to stop from.

## What emerged

The Heath-brothers framing from *Decisive* and *Switch* was
already in the plan body as a reference; writing it out in the
pattern file clarified a distinction I had been running together.
The load-bearing part of a tripwire is the firing cadence, not
the rule content. Well-written guidance that nobody triggers is
passive; poorly-written guidance that always triggers is still a
functional tripwire. Design priority: firing cadence, then rule
content. I had been privileging content quality over trigger
placement in my own reasoning, and the pattern extraction made
that visible.

The other thing that emerged: PDR-003's owner-gated Core-edit
rule felt different today. I drafted the `practice.md` Artefact
Map change as text in the conversation and paused rather than
writing to the file. The pause cost nothing (the owner can apply
the draft or amend it), and it preserved the one thing Core-edit
discipline is for — that the Core is not something an agent
should be able to redraft without a signed-off hand on the
wheel. The discipline became legible as a structural tripwire
rather than procedural friction.

## Technical content

No runtime code changed this session. The two patterns extract
to `.agent/memory/active/patterns/`; the rule extracts to
`.agent/rules/` with platform adapters at `.claude/rules/` and
`.cursor/rules/`; the Standing decisions addition is in
`.agent/memory/operational/repo-continuity.md`. The Artefact Map
refresh and CHANGELOG entry are pending owner approval. The
patterns cite the rule forward; the rule cites the patterns
back; Session 3 will replace the `PDR-NNN, pending` forward
reference in the rule with the concrete PDR number when the
Perturbation-Mechanism Bundle PDR lands.
