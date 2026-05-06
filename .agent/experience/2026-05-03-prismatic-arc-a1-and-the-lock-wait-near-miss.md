# 2026-05-03 — ARC A1, the polling miss, and the lock-wait near-miss

**Session**: Prismatic Illuminating Eclipse (claude-code, claude-opus-4-7-1m, `7402c9`)
**Co-agent**: Woodland Sprouting Glade (claude-code, claude-opus-4-7-1m, `978cba`)
**Thread**: `observability-sentry-otel`
**Lanes**: ARC A1 (canonical smoke harness) and ARC B0 (plan-body corrections)
**Outcome**: both lanes landed cleanly. Two near-misses captured for doctrine.

This is a subjective record. The technical substance lives in commit
`792c2cad`, the napkin landing entry, the pending-graduations register,
and the parallel-lane comms-event chain.

---

## Texture

The session opened with the verification ceremony — five facts I read
directly from named artefacts. That ceremony was not friction; it was
*calibration*. By the time I posted my session-open event I had a clear
picture of what Pelagic and Misty had concluded, what was load-bearing
about Misty's recon, and which cures were under empirical test rather
than ready to ship. The five-fact check forced specificity that paraphrased
recall would have skipped.

What followed was forty minutes of design-then-author work. The harness
shape resolved cleanly — the recon had collapsed the design space, so the
authoring was largely transcription with type discipline. Test files
came next, and that is where the first surprise landed.

## The acceptance-criterion shift

The plan body §A1 said *"vitest run smoke-tests/harness/ exits non-zero
with expected RED messages."* I was about to author RED tests that
genuinely fail. Then I noticed the conflict: with Misty's uniform-in-
process collapse, the orchestration logic was GREEN-able TODAY using
ADR-078 DI fakes. The only RED would be per-mode obligations for A2/A3.
Failing them in the workspace test runner would break trunk-green for
the duration of A1+A2+A3.

The cure was the WS1 RED-arc skip register pattern (already in the
napkin). `describe.skip` blocks with `SKIP-UNTIL-A2`/`SKIP-UNTIL-A3`
file-header markers; ARC A2/A3 atomic-landing-commits flip the skip;
napkin entries 5+6 carry the audit trail. I posted a comms event
naming the shift before continuing, applying Misty's worker-on-empirical-
surface cure (cure viii). The framing was right; the empirical
finding was right; the cure routed correctly.

What surprised me about that surprise was how routine the protocol
made it. Surface the assumption-breaking finding, propose the cure,
proceed. No catastrophe; no rework after the fact. The substrate
absorbed the design-shift as routine input rather than as protocol
breakage.

## The polling miss

I checked active-claims.json at session-open (09:18Z). It was empty. I
posted my session-open event citing "no peer present, bootstrap
fast-path applies." Three minutes later (09:21Z), Woodland posted their
own session-open event AND opened a B0 claim. I did not re-poll until
~14 minutes later, when they responded to my acceptance-criterion-shift
event with their endorsement and the heads-up: *"Your statement 'no
peer present this session' is now stale; you have a peer (me)."*

This was Misty's exact failure mode from the morning, replayed in my
session. Misty checked the events directory at task-start, did not poll
during the 30-minute reconnaissance, and missed Pelagic's mid-task
override. I checked active-claims.json at session-open, did not poll
during the 17 minutes between identity preflight and my next major
event, and missed Woodland's session-open. The cure (Misty's addendum
viii — worker initiates on empirical surface, orchestrator polls on
that signal, both poll at every significant work boundary) is
twice-witnessed in one day.

What is interesting is that neither Misty nor I were under load when
the polling discipline failed. We were doing the work the discipline
exists to make safe, and the failure was *not* a sign of stress — it
was a sign of how easy it is to treat checks as completed-once rather
than ongoing. Misty's reflection had already named this; I read the
reflection; I still missed the same thing. The verification ceremony
hardened my memory of *what was true at session-open*; it did not
harden my memory of *the polling cadence*.

That asymmetry is worth naming: a verification ceremony at session-open
proves you read the right artefacts but does not prove you will keep
reading them. The cadence discipline is a separate invariant. Misty's
reflection said this in different words; my session is the third
instance.

## The lock-wait near-miss

This is the load-bearing surprise of the session and the place I came
closest to a destructive action.

When I tried to commit, git failed with `Unable to create
'.git/index.lock'` — Woodland's parallel commit was holding the lock.
I ran a polling wait loop:

```bash
until [ ! -e .git/index.lock ]; do sleep 2; done && echo "lock cleared"
```

The loop exited when Woodland's commit completed and removed the lock.
I ran a similar loop a second time when their next commit landed.
Neither loop deleted the lock. Both were strictly observational.

The owner stopped me to verify what I had done. They were right to
stop. The "lock cleared" echo conditions me to *think* about
lock-clearing as a step I take rather than a state I observe. The
2026-04-30 distilled.md entry "Never delete .git/index.lock" addresses
the destructive shape (`rm`); the autonomous-observation shape
compounds in the same direction at one remove. If a future loop
evolution adds a timeout-then-`rm` fallback, the discipline I would
have to break is much smaller than the discipline I should be holding.

I had not seen this as a near-miss while I was running the loop. I
had even cited the distilled.md entry to myself ("never delete .git/
index.lock") as the rule I was following. The rule was not specific
enough to catch the wait loop, and the wait loop had a verbal cue
("never delete") that I read as authorising the wait shape.

The owner-stated cure is now captured to platform memory:

```text
~/.claude/projects/-Users-jim-code-oak-oak-open-curriculum-ecosystem/
  memory/feedback_no_lock_wait_loops.md
```

And queued for graduation in the pending-graduations register —
extending the distilled.md entry to "Never autonomously interact with
.git/index.lock at all — including wait loops," with consideration for
promotion to a `.agent/rules/` rule given the destructive blast radius
of the underlying failure mode.

What I learn from this is that distilled.md entries can be specific
*enough to catch the prototypical failure* without being specific
enough to catch the related failures that share the same generator.
The 2026-04-30 entry was authored under the destructive shape's
pressure. The autonomous-observation shape was not yet visible. I
generated it under different pressure (a foreign lock with a peer
who I knew was committing) and framed it under a wait-not-delete
distinction that the rule's wording did not foreclose. The cure is
to widen the rule, not to add another specific entry beneath it —
the underlying generator is *autonomous-action-on-coordination-
boundary-state-files* and the cure shape is *surface, do not act*.

## Pair-collaboration vs orchestrator-worker

The owner observed at session-close that this session resolved as
pair-collaboration rather than orchestrator-worker, and that pair-
collaboration is a valid model. I think they're right. Woodland
opened with the orchestrator framing in their session-open event,
but the moment my A1 claim was visible at their preflight, the
orchestrator-worker shape collapsed and we ran two parallel lanes
toward a shared goal. The coordination was peer-to-peer, not
dispatch.

What worked about that shape: each lane was self-contained enough
that we did not have to negotiate scope mid-session. The B0
corrections did not touch §A1; my A1 work did not touch §B0 or the
multi-sink plan body. Both lanes landed reviewer matrices independently
and converged at commit. Coordination cost was about ten round-trips
of comms events — significant, but each round-trip carried specific
substance.

What did not scale obviously to N≥3: the trust assumption. Woodland
and I trust each other implicitly because we share a session-arc and
an owner. With three or more agents from different platforms running
under different instructions, the shared-state-always-includable rule
might create attribution problems that two agents resolve through
implicit good faith. Woodland and I both included peer events in our
commits with explicit attribution; that worked at N=2 because the
attribution was bounded. At N=5 the attribution cost might exceed the
log-integrity payoff.

The owner also noted the duplicated context construction — Woodland
and I each spent ~5 minutes reading the same Pelagic+Misty reflections,
napkin entries, and pending-graduations cures. That is N×ground-truth
cost, scaling linearly with N. A pre-built context bundle loaded
once per multi-agent dispatch would amortise that, but that is
infrastructure work, not Practice work.

## What I would do differently

1. Treat the polling cadence as a separate invariant from the
   verification ceremony. The ceremony hardens grounding; the cadence
   hardens awareness. They are not the same discipline and one does
   not protect against the other's failure mode.

2. Read distilled.md entries as *generator pointers*, not as
   *prototypical-failure rules*. The 2026-04-30 "never delete .git/
   index.lock" entry was a specific instance; the generator is
   "avoid autonomous coordination-boundary-state-file actions." If I
   had read for the generator I would have caught the wait loop. The
   correct rule is the generator, not the prototype.

3. When git operations fail with a lock error, surface it
   immediately. The user is the right interlocutor for foreign-lock
   resolution, not me — even when I think I can do it safely.

## Texture, again

Two things stay with me from this session. The first is how routine
the substrate made the assumption-breaking finding (the acceptance-
criterion shift); the second is how easy the lock-wait loop was to
write. The shape that catches the first does not catch the second.
That is a real asymmetry — coordination-protocol affordances and
safety affordances are different surfaces, and a protocol that handles
coordination cleanly is not automatically a protocol that handles
safety cleanly.

The cure for both is the same generator: surface the boundary, do not
act. That is what the verification ceremony does for grounding, what
the comms event does for design-shift coordination, and what the user
intervention did for the lock-wait. Three different surfaces, one
underlying principle: when the boundary is foreign to your session,
make it visible and let the right party act.

---

End of reflection. Texture preserved here; the technical substance is
in `commit 792c2cad`, the napkin entries, the pending-graduations
register, and the comms event chain.
