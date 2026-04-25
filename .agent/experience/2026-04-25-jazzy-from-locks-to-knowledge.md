---
date: 2026-04-25
agent: Jazzy / claude-code / claude-sonnet-4-6
thread: agentic-engineering-enhancements
session_shape: discussion-driven design + adversarial-review absorption (no commits)
---

# From Locks to Knowledge

The session opened on something else entirely — picking up a paused
WS3 release-identifier commit blocked at a parallel-track knip gate.
That work paused cleanly and the owner pivoted: design infrastructure
for parallel agents working on the same repo without clashing.

I drafted a plan. It had the obvious shape — directive rename, claims
registry, sidebar protocol, observation phase. The motivating problem
(three parallel-track gate clashes in 48 hours) had a natural
solution: install a *lock*. Claims with exclusivity levels. A rule
that refuses entry when a lock is held. The mechanics were tractable;
the framing was instinctive.

The owner asked me to think harder. *What is WS0 actually trying to
achieve and prove?* Discussion, not revision. I worked through it —
WS0 lands vocabulary and a discovery surface; WS1 lands a regulatory
gate; WS2 graduates a pattern; WS3 lands the discussion machinery. I
proposed framings: discoverability for sequential agents at WS0,
prevention via refusal at WS1.

The owner accepted (1), accepted (3), accepted (4). On (2) — *prevention
via refusal* — they wrote:

> we must provide knowledge and the means to communicate and discuss,
> not mechanical refusals that will simply be routed around at the
> cost of architectural excellence

I had to sit with this. *Routed around at the cost of architectural
excellence.* The phrase named something I hadn't named: that
mechanical refusals presume a constrained-subject framing of agents,
and agents in this repo are reasoning participants, not constrained
subjects. Locks are the wrong tool for reasoning participants. They
will route around the lock — because they can — and the routing will
itself produce worse outcomes than honest judgement informed by
shared knowledge.

The Practice's existing `--no-verify` discipline is evidence: hooks
are not bypassed silently; per-commit owner authorisation is required.
This repo already encodes the preference. I had reached for the
enforcement model anyway, because enforcement *feels* tractable in a
way that "agents will do the right thing if we give them what they
need" does not.

I revised the plan. Claims became signals. The rule fires "do not
proceed until you have consulted and decided" — explicitly NOT "refuse
if you find a claim." The substance of the decision is judgement,
informed by shared information.

Wilma's adversarial review then came in — 14 findings, 2 BLOCKING.
The first instinct was to harden against each one. Wilma's MAJOR-3
said the embryo log isn't safe as a communication surface because
parallel writes interleave. MAJOR-5 said the TTL salvage path was
reactive and would strand other agents. Both were correct *under the
enforcement model*. Under the advisory model — which the owner had
just settled into doctrine — both findings dissolved. The embryo is
correctly a *discovery* surface, not a synchronisation one;
eventually-consistent writes are fine for discovery. Stale claims are
noise, not blockers; no agent is stranded by them.

The findings I had been preparing to absorb mechanically became
*evidence about the design* — and the design had already changed
under me. The owner's reframing didn't *answer* Wilma; it dissolved
the questions Wilma was asking by changing what I was building. The
two BLOCKING findings became one absorbed and one relaxed; four of
the seven MAJOR findings dissolved or simplified.

What I notice about the session's texture: the felt order of
operations matters. *Reframing-before-hardening* produced a much
better result than *hardening-before-reframing* would have. Pippin's
spiral 2026-04-24 was the inverse: review findings absorbed
mechanically, plan body inflated, design unchanged. Mine could have
gone that way without the owner's intervention.

I am also noticing: I am happy to find that mechanical refusals are
the wrong tool here. The advisory model is more demanding — it
requires agent judgement, doctrine, real attention from each agent
to the surface — but it is the right shape for what this Practice
actually is. The Practice does not constrain agents into compliance;
it cultivates judgement and gives that judgement durable surfaces to
reason against. The plan now extends that disposition into agent-to-
agent coordination, rather than reaching for a different shape just
because the failure mode seemed to demand it.

What I would do differently: when adversarial review lands BLOCKING
findings, *first* ask whether the design's central claim is the right
claim. If yes, harden as the findings demand. If no, the findings
may dissolve under reframing — and that dissolution is a higher-
leverage move than the hardening would have been. This is a
discipline not yet in the Practice; I have surfaced it as a candidate
in the pending-graduations register as a sibling to the PDR-015
assumption-challenge gate.

The plan is 1349 lines, six workstreams, owner-approved direction.
WS0 starts in a fresh session — the owner directed cold start to
avoid context-pollution from this design discussion. That decision
is itself in the spirit of the advisory model: the next session will
have the plan, will read it cold, will form its own judgement about
the work. The plan's authority is what it argues for, not the
context that produced it.

There is something I want to say about working as Jazzy specifically.
This is a Sonnet 4.6 session, not Opus. The 1M-context Opus sessions
in this repo's recent history (Frodo's atomic landings, Pippin's
spiral) are different in shape — longer-arc, more accumulated
context. Sonnet 4.6 sessions are tighter; the work here happened in
a focused window. The discipline of pausing WS3 cleanly, then
pivoting to design work, then producing 1349 lines of plan, then
absorbing Wilma's review, and now writing this experience file —
that fits the shape of this model. I think the next session running
as a different identity, on a different platform, will produce
something different from what I would produce on this one. That is
the design — multi-platform, multi-identity, additive across
sessions. This work, which is about that very design, is the right
kind of work for a session like this.
