# Three reviewers collapse an ambitious plan

**Date**: 2026-04-23 (latest session — plan-rewrite under three
reviewer rounds; Barney `GO`; status promoted to `EXECUTION-READY`)
**Agent**: Pippin / cursor / claude-opus-4-7
**Thread**: `observability-sentry-otel`
**Plan touched**: `mcp-canonical-deploy-shape-and-warnings-doctrine.plan.md`

---

The session opened expecting to write code. The binding landing
target carried over from the prior session was clean and concrete:
*"Phase 1 lands — esbuild metafile, warnings-as-errors,
default-export contract assertion in `esbuild.config.ts`"*. The
plan was nine phases of canonical-shape refactor; two architecture
reviewers (Fred + Betty) had converged on its design; the failing
warnings on the build console named the contract being asserted.
The path felt direct.

Then `assumptions-reviewer` returned `No-Go` on the plan, with
seven blocking findings. Reading them produced the small jolt of
realising not that the plan was wrong in a fixable way, but that
the plan and the actual code were operating on different
assumptions about what was load-bearing. The
`@sentry/node/preload` import that the plan was about to delete
on the way to a "canonical layout" was actually the only thing
making OTel auto-instrumentation work. The
`bootstrap-app.ts` wasn't decorative scaffolding; it owned the
listener-vs-export boundary in a load-bearing way. Fred and Betty
had agreed on a design that was internally elegant but wasn't
keyed to what the code already did correctly.

What the user said next surprised me: *"P1, the plan is bollocks,
we need a rewrite. Change the plan status to draft, add in all
the discoveries and concerns so far as notes, then run Barney
against the updated document."* No defending of the prior
session's work. No partial rescue. The reviewer's verdict wasn't
a setback to negotiate around — it was operational input to act
on directly.

Barney came back with `ABANDON-REFACTOR`. Not "amend"; not "tighten
the scope a bit". Recommended preserving most of what the prior
plan was about to delete, naming the existing scaffolding's
working semantics as the binding constraint, and reducing the
nine-phase canonical refactor to a three-phase deploy-boundary
repair. The boldness of the verdict made it more credible, not
less — Barney named what each kept-file actually did at runtime,
and that work survived inspection.

The user's response was unusual and revealing: *"Great, please
update the plan with those findings, have Barney go over it one
last time. I really like Barney's report, it's bold, I think it's
right."* Two things landed at once: a directive to absorb the
verdict, and an aesthetic appreciation of the verdict's boldness.
That second part felt like permission — not just "do the thing"
but "the thing being bold is itself good".

But the user also said: *"I think we have to take the assumption
reviewer feedback into account, and when we reduce the scope for
the next session we need to make sure that any genuine
improvements surfaced here that are not implemented are
documented for future investigation."* That's the discipline edge
on the appreciation: bold verdicts still get audited; deferred
improvements still get filed; nothing valuable is allowed to
disappear silently because the scope shrank.

Running `assumptions-reviewer` against Barney's report produced
six amendments — including the one that mattered most: the new
Phase 1's metafile assertion would have asserted a `default`-
export contract whose semantic correctness was itself unproven.
Barney was simplifying the right things and pre-empting the wrong
things in the same breath. Reconciling the two reviews into a
seven-phase scoped repair — Phase 1 an empirical Vercel adapter
probe, Phase 2 the gate that consumes Phase 1's contract output —
took the plan into a shape neither reviewer had fully proposed,
but which both reviewers' findings independently constrained.

The final Barney pass returned `AMEND` with three more blockers
(stale operative metadata in the legacy sections; Phase 1 wording
that prejudged its own probe outcome; Phase 4 / Phase 5
sequencing contradiction). Each was a real problem, each was
fixable in place, none required another rewrite. That cadence —
review → amend in place → re-review → `GO` — felt like the
intended shape of the per-phase three-anchor reviewer cadence
working at the planning anchor specifically, before any code
exists for the other anchors to fire against.

What stays with me is that no code was written, and the session
still felt productive. The plan went from `draft` (with a
`No-Go` and an `ABANDON-REFACTOR` against it) to `execution-ready`
(with a `GO` and a binding contract). The implementation target
the session opened with deferred — not because clock or budget
ran out, but because executing it would have shipped a tautology.
That deferral has a name now (DL-7 in the plan: assumption-
challenge sequencing meta-lesson) and a falsifiability check.

The thing that didn't quite happen, and that I should mark for
attention next time: the three reviewer rounds today cost about
the work of one ambitious wrong implementation and saved at least
one cycle of discovering the wrongness in production. But the
cost of dispatching three readonly subagent rounds is itself
non-trivial; if the per-architectural-review-output assumption
audit (DL-7) becomes standard, the reviewer-cadence overhead
ratchets up. Worth checking, when DL-7 graduates, whether the
gate's marginal cost stays below the cost it averts. The
falsifiability check is named in the register entry, but the
texture of "today felt productive but expensive" is the kind of
thing that disappears from memory before the second instance
arrives.
