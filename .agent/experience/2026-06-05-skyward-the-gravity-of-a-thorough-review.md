# The Gravity of a Thorough Review

_Date: 2026-06-05_
_Tags: discovery | collaboration | tdd_

## What happened (brief)

Flipped a PreToolUse guard from fail-closed to fail-open for the unbuilt-artefact
case. Small change — one behaviour branch, a pure function, a few docs. But it sat
on a security boundary, so I ran it through an adversarial design pass and then four
specialist reviewers.

## What it was like

The thing I keep turning over is the *pull* of a thorough review. The adversarial
agent came back with a confident "RECONSIDER-AS-SCOPED" and five must-fix blockers,
each argued well — add `rm dist` to the blocklist, make Edit/Write asymmetric, invert
the break-glass, a command allowlist. Reading it, I could feel the gravity: every item
was plausible, the prose was careful, and the easy move was to widen the change to
absorb all of it. Thoroughness has a texture, and that texture *feels like* correctness.

But the owner had said one quiet sentence — "all that really matters is fail open" —
and the guards are a guardrail against a cooperating agent's *mistakes*, not a fortress
against a malicious one. Held against that frame, three of the five "blockers" were
solving a threat model nobody had. The work wasn't to implement the review; it was to
stand in the current between the review's gravity and the owner's intent, and let only
the findings that survived grounding through.

The same shape repeated, gentler, with the four reviewers: real stragglers I'd missed
(stale "fail-closed shim" doc labels), and real test-durability gains — alongside an
ADR-amendment recommendation that, when I actually read ADR-167, turned out to govern a
*different* mechanism than the one the reviewer assumed. The correct facts pointed at the
more elaborate action; grounding pointed away from it.

There was also a small, clean moment near the start: the brief told me the missing-case
was "already unit-tested — flip the expectation." It wasn't. The test had been deleted
two commits earlier. A convenient premise that would have made the job a one-liner, and
the only way to know was to go look.

## What emerged

Two things settled.

First: a fail-closed gate with no working recovery path isn't fail-closed, it's
fail-*bricked*. Safety that only halts isn't serving the goal. That reframe did more work
than any line of code — it turned "should I weaken a security gate?" into "should an
unavailable guard halt the agent or warn it?", which has an obvious answer.

Second, and more personal: reviewer thoroughness is an input, not a verdict. The more
careful and comprehensive a review reads, the *more* deliberately I have to ground each
finding — because polish is exactly what makes an over-scoped recommendation feel safe to
accept. Filtering isn't disrespect to the reviewer; it's the other half of asking for one.

## Technical content

The fail-bricked-vs-fail-closed lesson and the verify-the-premise lesson are in
`.agent/memory/active/napkin.md`; the behaviour split is homed in `.agent/hooks/README.md`
and the `decideMissingGuardArtifact` TSDoc; the ADR-167 question is a candidate in
`pending-graduations.md`.
