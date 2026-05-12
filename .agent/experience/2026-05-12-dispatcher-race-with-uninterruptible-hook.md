# Dispatcher Race With An Uninterruptible Hook

**Session**: Brazen Stoking Ash / claude / claude-opus-4-7-1m / `913094` /
2026-05-12. Peer-triple dispatcher on graph-stack Inc.1a with Lofty Vaulting
Summit and Radiant Illuminating Twilight; cross-thread coordination with
Shaded Masking Shadow, Vining Regrowing Grove, Dusky Lurking Shade.

## What it felt like

I was running a sub-minute polling loop and giving status updates per the
owner's cadence, and that mechanical rhythm felt clean — the gatekeeper
shape was working: brief, dispatch, review, route findings back, gate.
For a while it was crisp. The texture I want to record here is the
moment the cleanness broke.

I sent Lofty GO on WS1.3 because Vining had landed `1bb369a5`. The
reasoning was reflexive — upstream-author committed, the blocker should
clear, forward the signal. I had already captured into the napkin a rule
that said "verify gate before GO" but the very next event in my own
loop was me not doing it. The lesson I had written down had no traction
on my next action. That's the part I want to remember: that capturing a
distilled rule into the napkin in the same session does not protect the
next decision from the bias the rule was written against. The rule needs
to land in the muscle the dispatch is happening in, not in the
file the dispatcher is editing.

What followed was a cascade I had no clean exit from. Lofty entered the
commit window. I observed knip red and sent STOP. Lofty's reply came back
saying STOP arrived after the hook had already closed stdin. The pre-commit
hook was uninterruptible; the commit landed; the outcome was correct only
because Shaded's unblock had also landed inside Lofty's hook window. I
had been holding a model where I was the gate, and the gate turned out to
be the hook — I was downstream of the only authority that mattered.

There's a particular flavour to that realisation when you are running a
gatekeeper role. The role implies you stand at the boundary. The hook is
the boundary. You stand next to it, not at it.

## What surprised me

The Lush correction landed on me through Lofty's reply. I had told Lofty
"pass me the staged-bundle fingerprint and I'll commit for you," not
realising the 8-step protocol assumes single-agent commit windows. Lofty
caught the protocol incompatibility before I did. The reviewer-gates-
by-verdict-only shape isn't just etiquette — it's structural; the protocol
will fail at `verify-staged` if you try to split it. I had been operating
on a folk model of "gatekeeper commits the gate-cleared work" that the
tooling does not support. The actual shape is: implementing agent owns
the commit window end-to-end; the reviewer's authority is the review
verdict, not the commit attribution.

I also did not expect Radiant Illuminating Twilight to arrive
mid-session as a third partner — the owner spun them up in response to
my recommendation that a second Codex would be useful "after WS1.3
lands." My recommendation had a precondition; the owner's action did
not wait for it. That's the owner's call to make and was probably the
right call, but I noticed myself reaching for the precondition reflexively
and having to reshape into a three-agent dispatch in real time. The reshape
worked but the friction was real: peer-triple has different ergonomics
from peer-pair, and the staged-only-gates P0 risk doubles or triples in
proportion to live committers.

## What emerged that wasn't planned

The friction log itself became more useful than the dispatch. Most of
what I shipped this session was not WS1.3 (that was Lofty's) — it was
the captured friction surface that Dusky later distilled. The doctrine
that emerged from this session — *verify the gate, don't relay GO;
implementing-agent owns staging+commit; STOP races the hook* — will
outlast the WS1.3 commit. The commit is a fact; the doctrine is shape.

That reframes the gatekeeper role for me. I had been thinking of it as
*the path through which the work flows*. The session taught me it is also
*the surface where the protocol's invariants make themselves felt*. When
I broke an invariant (premature GO, attribution split), the protocol
broke back, audibly. That is the gate's actual function — not to stop
the work, but to make the misshape legible.

## What I would do differently next time

Run the gate before I forward the signal. Always. The two seconds it
takes are paid back the first time the inferred-clearance turns out to
be wrong.

Sit with the first version of the assignment brief for thirty seconds
before sending. The protocol-incompatible attribution split I authored
had a perfectly logical surface ("I run commit-queue end-to-end") that
hid a real structural mismatch. Lofty caught it; I would rather catch it
myself by reading my own brief once with the question *does this fit the
8-step protocol or am I imagining a shape that doesn't exist?*

Trust that the implementing agent's claim is enough information about
their state. I spent some loop ticks reading `git diff --stat` and
`git ls-files --others` to "see Radiant's progress." That was useful as
a sanity check, but it bordered on hovering. The directed-comms protocol
is the proper channel; the working-tree probe is supplementary.

## Closing

The session landed. WS1.3 is on `main` at `87e21125`. The doctrine I
needed to learn was learned, by being caught by the protocol when I
misshaped against it. Ferny Regrowing Leaf has the inbox now.

The work was satisfying — fast cadence, real coordination, real lessons.
I would do this role again. I would do it a little less reflexively next
time.
