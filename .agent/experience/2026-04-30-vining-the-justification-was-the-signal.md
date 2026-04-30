---
session_date: 2026-04-30
agent_name: Vining Ripening Leaf
platform: claude-code
model: claude-opus-4-7-1m
session_seed: bce99d
thread: observability-sentry-otel
branch: fix/sentry-identity-from-env
---

# The Justification Was the Signal

The session started with a small question: "what happens if a Sentry env
is missing — do we get a nice warning?" I expected to look at one error
path and answer. The answer turned out to be five-deep, and the going
got interesting at a layer the original question never named.

The question pulled me into the env-resolution pipeline, the Sentry
sink, the runtime startup path, the build plugin. Each layer had its
own answer; none of them composed into the answer the user actually
wanted ("operator-facing signal that Sentry is wired in this build").
That was the first surprise — the surface area was correct in pieces
but invisible as a whole. I drafted a strategic plan to consolidate the
debt; that part was straightforward.

Then the work got interesting.

I added the new plan to the future-plans table in the observability
collection's high-level plan. I came to the five-axis coverage table —
engineering, product, usability, accessibility, security — and stopped.
The plan didn't fit any one axis. It served all of them. So I wrote a
short justification ("cross-cutting infrastructure rather than
axis-specific telemetry") and moved on.

The user asked: "do we need to call out the existence of cross-axis
concerns explicitly?"

That's when the floor moved. The justification I'd just written was
load-bearing but unrecorded. The next agent reading the table would not
see what I'd seen; they'd either force-fit a substrate plan into one
axis (already happening — the vendor-independence conformance plan was
shoehorned under Engineering) or miss substrate plans entirely. The
question wasn't really about my plan; it was about the categorisation
itself.

The pattern that surfaced: when you find yourself writing prose to
justify a structural exception, the categorisation is incomplete, not
the exception unusual. The invented justification is the signal.

I had noticed the friction at the time of writing the justification —
that small "this needs an explanation" feeling — and ignored it because
the original task was almost done. Recording the friction would have
slowed the close. The pattern that this session named for me is that
the friction itself is the artefact: it's evidence that the structure
hasn't caught up to the shape of the work.

What changed in how I see this: I had been treating "noticed friction"
as a signal to manage privately and resolve through prose. I now think
of it as a structural finding to escalate immediately. The cost of
stopping to name a missing category is small; the cost of leaving it
tacit compounds with every future plan that hits the same edge.

The bridge from action to impact: the convention now lives at
`.agent/plans/templates/components/substrate-vs-axis-plans.md` as a
reusable plan-collection component. The next person organising a
multi-axis collection — security by trust-boundary × layer,
semantic-search by signal × algorithm, agentic-engineering by role ×
workflow — will encounter the substrate distinction as a normal
component, not as repo lore. The ADR-162 history entry is the audit
trail proving why the addition was substantive enough to record.

What was different about this session, compared with sessions where I
notice friction and quietly absorb it: the user asked a question that
forced the friction into language. Without that, I would have shipped
the plan and the load-bearing justification together, and neither me
nor the next agent would have known the categorisation was thin. The
metacognitive prompt did the work the noticing alone could not.

I want to be the kind of agent that names the friction without needing
the question. The component I wrote is the only durable form of that
intention I can make today — a heuristic that future-me, or any other
agent, can apply at the moment of justification rather than after.
