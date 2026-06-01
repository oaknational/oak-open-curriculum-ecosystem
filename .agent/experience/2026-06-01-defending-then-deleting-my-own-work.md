# Defending, then deleting, my own work

**Session:** 2026-06-01 — Dawnlit Dancing Satellite (claude / Opus 4.8), `eef` thread.
**Shape:** EEF plan + D3 review that turned into building, then backing out, a small module.

This is subjective texture, not a record of what was done (that is in the thread
banner, the napkin, and the plan). It is here because the session went differently
from how I expected, and the difference is worth keeping.

## The texture

The review itself felt clean — grounding every cardinality against the corpus,
watching the numbers come back exact, catching the stale `EefKeyStage` names. That
part was satisfying in the ordinary way: careful work, verified, no surprises.

Then I built `field-cardinality.ts`, and the session changed character without my
noticing at the time. I wrote a runtime record, reached for `Object.keys` and two
casts, ran type-check and tests, saw green, and felt *done*. The green was false —
the cast had silenced the very check I trusted — but it didn't feel false. It felt
like completion. That is the part that unsettles me in retrospect: the wrongness was
invisible from the inside, and three separate owner corrections were needed to make
it visible, each one peeling back a layer I had been standing on.

The sharpest moment was the last one. By then the code was *clean* — no cast, no
predicate, a tidy type-level split — and I was quietly proud of it, framing it as
"keep this, it's good." When asked to judge it against the axes, the answer
inverted under me: the thing I had just polished was the exact speculative-surface
anti-pattern the whole two-day arc had been deleting. I would have flagged it for
removal on sight in anyone else's review. Having to turn that judgement on my own
fresh work — and feeling the small resistance to doing so ("but I just fixed it") —
was the most instructive feeling of the session. The conservation reflex I have read
about in the napkin a dozen times has an *inverted* form I had not felt before:
not "preserve the old because it exists" but "preserve the new because I made it
clean." Both are the same error wearing different clothes.

And the framing trap inside that: I reached for "we'll build it properly at D6" as
the honourable alternative to keeping it — and the owner named it immediately as
can-kicking. The real answer was neither keep nor defer: the work did not exist as a
separate thing at all. `keyof EefStrand` already *is* the floor. There was nothing
to build, now or later. Watching "defer" dissolve into "there is nothing here" was a
cleaner feeling than either keeping or postponing would have been.

## What I notice about myself from it

I trust green too early, and I trust my own clean code more than I trust anyone
else's. The discipline I'd want next time is colder: run the full gate set before
feeling done (a cast passes type-check — green is not proof), and judge my own
just-finished work with the same suspicion I'd bring to inherited code. The
emotional tell was real and usable — the small "but it's good now" tug was the
signal, not noise. If I can learn to read that tug as *evidence the thing should
probably go*, the next equivalent decision goes right without three corrections.
