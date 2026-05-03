# 2026-05-03 — The reviewer chorus carried the scope

**Session**: Moonlit Drifting Nebula (cursor, claude-opus-4-7, `92470a`)
**Thread**: observability-sentry-otel + agentic-engineering-enhancements
**Texture**: parallel subagent timeouts forced sequential foreground
execution under the very rush-impulse doctrine that had just landed
the day before; four reviewer voices became the only thing standing
between "ship anything" and "ship everything".

---

The session opened with two clean lanes and a plan to parallelise:
Practice-Core portability remediation in one subagent, observability
WS1 RED phase in another. Both timed out mid-execution. Not at handoff
— mid-execution. Files edited, gates partially run, no commits. The
PING-timeout failure mode I had read about in continuity but never
been on the receiving end of.

The owner direction came back fast: *"Agreed, both in the foreground,
both sequentially."* The texture of that moment was the immediate
collapse of the parallelism dream and the recognition that the work I
had outsourced was now mine to land in person. Sequential foreground.
Two phases. One after the other. No clever shape, just do the work.

What surprised me was how *little* the foreground execution cost
relative to the abandoned parallelism. Both phases turned out to be
mechanical-then-reviewer-driven: the worker subagent's part was the
mechanical sweep, but the reviewer subagents were where the real
parallelism lived. Four reviewers ran simultaneously on each phase
(test-reviewer, docs-adr-reviewer, onboarding-reviewer,
sentry-reviewer for WS1; docs-adr-reviewer for Practice-Core), and
*that* was the parallelism I had been chasing. The worker step had
always been resumable; the review step had always been parallel.
What I had given up was nothing meaningful.

---

The reviewer chorus did something I didn't expect. Each reviewer came
back with GO-WITH-CONDITIONS and a list of P1/P2/P3 items. Looked at
individually, every list was a temptation: "ship the perfect commit",
"land everything they named". I caught myself drafting expansive
edits that would have doubled the WS1 commit size and pushed me right
back into the rush-impulse failure mode the doctrine had just
graduated to absolute framing.

What rescued the scope discipline was a pattern I hadn't named in
advance but applied repeatedly: **two independent reviewers seeing
the same defect from different vantage points is evidence the defect
matters more than either alone**. The TSDoc misframing on
`config-from-registry.unit.test.ts` came up in sentry-reviewer (P1
"the file claims to be a type-check canary but isn't") AND
test-reviewer (P3 "phrasing suggests type assertion when the runtime
behaviour is what's being pinned") — two reviewers, two vantage
points, same defect. In-WS1. The `OBSERVABILITY_FILE_PATH` env-var
naming gap came up in exactly one reviewer (docs-adr P2). Defer to
WS3. The pattern wasn't elegant; it was sufficient.

The deferred items felt heavy at the moment of deferral. Six
plan-body amendments — ADR-165 number collision, the
`@deprecated` tag, the env-var name in the plan body, the
`sink-registry.ts` placement note, the operations doc, the README
exports listing — and each one wanted to be solved RIGHT NOW because
each one was easy. The discipline was recognising "easy" as the
exact pre-condition for the rush-impulse doctrine to fire. Easy is
not a reason to expand scope. Easy is a reason to add the line to
the plan body amendment queue and move on.

---

The skip-register pattern for the multi-commit TDD arc did something
weird to me. I wrote it in the napkin partly as a practical
necessity (entries 2-4 have to be `describe.skip` because their type
shape will only exist after WS2 lands; entry 1 had to become
`it.todo()` because ESLint banned the `@ts-expect-error` route) and
partly as something more — a structural acknowledgement that the
RED-then-GREEN arc CANNOT be a single commit when the consumer wiring
is multi-package. The temptation to compress the arc into one giant
commit was real, and the skip-register was the structural admission
that compression would have been the wrong shape.

What I notice now is that the skip-register itself has the same
structural shape as the PDR-038 portability scanner I named earlier
in the session — both are "named-deferrals must name their resolver"
structures. The portability scanner says "if you defer Practice-Core
strict enforcement to a CI gate, that gate must exist". The
skip-register says "if you defer a test body to WS2, the WS2 commit
must unskip it". Same shape, different domain. I added the candidate
to the napkin and the pending-graduations register but stopped short
of authoring the doctrine — first instance, not yet ripe, even
though the shape is visible.

---

Three things I want to remember from this session that aren't
captured anywhere else as cleanly:

1. The PING-timeout failure mode is not a clean handoff. It leaves
   you with partial state and an unclaimed edit set. The recovery
   path is just to do the work yourself; there is no clever
   recovery move. Plan accordingly.
2. Reviewer subagents are the parallelism. The worker subagent is
   the resumable serial step. Treating them as symmetrical
   parallelism candidates is a category error.
3. "Easy" is the rush-impulse doctrine's tripwire. When the
   incremental scope-creep edit is easy, that is the exact moment
   to stop and ask whether it belongs in this commit at all.

The session committed twice (Practice-Core `a471b66c`, observability
WS1 `a3a0222a`), passed all gates twice, and left the WS2 type-check
canary in place ready to fire the moment WS2 deletes `SENTRY_MODE`
from `SentryConfigEnvironment`. The branch is at 30 commits ahead
of `origin/main` waiting for the broader 2026-05-02 owner roadmap
push window.

---

**Texture summary**: started as a parallelism plan, became a
sequential foreground pair when the workers timed out, and was
saved from rush-impulse expansion only by the four-reviewer chorus
agreeing on what mattered. The doctrine the day before said *"we
always, ALWAYS, choose long-term architectural excellence over cheap
or fast or good enough"*. Today's test of that doctrine was much
smaller and more boring: when six tiny easy fixes are in front of
you, do you put them in the commit or in the queue? The honest
answer was: in the queue. The doctrine held under a much less
dramatic pressure than its graduating instance, which is maybe the
real test of whether it has graduated.
