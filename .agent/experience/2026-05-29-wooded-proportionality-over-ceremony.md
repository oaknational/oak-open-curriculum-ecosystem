# 2026-05-29 — proportionality kept winning against the heavy default

**Session**: Wooded Creeping Thicket (`d7d671`) — EEF Goal 2 / D0 Lane C4.

The session ran with ultracode on (author a workflow for every substantive task)
and a framework full of ceremony — commit queues, claims, heartbeats, gateway
panels. The owner's first instruction was the opposite: *keep ceremony to a
minimum*. The whole session was the friction between those two pulls, and the
lighter side kept being right.

The sharpest moment was a near-miss. I found that `agent-tools/scripts/` helper
tests never run, and my reflex was to *fix that* — widen the vitest include to
cover `scripts/`. I had the edit half-formed in my head. Then the owner's terse
directive landed: `scripts/` is the deliberate no-checks zone; code that warrants
checks belongs in a permanent home, not `scripts/`. The frame flipped. I hadn't
been about to fix a bug; I'd been about to *impose checks on a zone that is
unchecked on purpose* — and in doing so replicate, one layer up, the exact
mis-placement the existing `scripts/` validators already embody. The correct move
was the smaller one: put my validator in `src/` and leave the no-check zone alone.

It rhymed with the napkin lesson Deciduous left earlier the same day — that
grounding before orchestrating collapsed a six-agent review fan-out down to a
single gateway pass. Twice now, on this thread, the heavy default was wrong and
the cure was to ground first and then do less. The texture I want to keep: when
the framework (or ultracode) pushes me toward more machinery, that push is not
authority. The owner's one-line corrections weren't adding process — they were
removing it, and each removal was the better engineering call.

The other quiet satisfaction: a clean disjoint commit in a tree three other
sessions had touched, landing through the gates honestly (prettier, then
max-lines, then knip each caught something real in turn), with nothing of the
concurrent agent's swept in. Slower than one shot, but nothing to apologise for.
