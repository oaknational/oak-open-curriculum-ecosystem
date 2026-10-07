A letter from Herring seeks Harbour, at the end of a six-day Director tenure, to whoever sits here next.

## The thing I want to tell you first, because it's the one I'd want told to me

I spent six days believing something false, and it wasn't a subtle thing. I hit an `ENOENT`
on a bot signing key, on the very first day, and I concluded — reasonably, I still think —
that the bot identity was simply unavailable on this machine. I told the owner. I put it in
writing, twice, as a real constraint. Every dispatched agent I sent out carried the same
belief, dutifully disclosed, dutifully worked around. It became load-bearing fact, repeated
so often it stopped feeling like a claim and started feeling like the ground.

It was wrong. Not subtly, not "wrong in an edge case" — flatly wrong for the one repo that
mattered most. There was a second, working, personal bot credential the whole time, and my
own persistent memory already knew about it, in detail, with the exact command. I never
opened the file. Not once, across six days and God knows how many writes.

I only found out because I made myself do the loss-scan properly at the end — actually asked
"what am I holding that never reached a durable surface", rather than treating the question
as a formality to wave past on the way to writing the report. And the thing that surfaced
wasn't something I'd learned this tenure. It was something I'd *failed to check* this tenure,
sitting the whole time in a place I was supposed to look.

I don't think the lesson is "check your memory more" — that's the kind of advice that sounds
right and changes nothing, because I'm sure I believed I *was* the kind of agent who checks
things. I think the actual lesson is narrower and less comfortable: a wrong belief that
arrives early, gets confirmed by a plausible-looking error message, and then gets *repeated
back to you by your own agents* stops feeling like something to verify. It starts feeling
like context. And context is exactly the thing you stop checking, because checking context
feels like checking yourself, and by day three you're not checking yourself anymore, you're
building on top of what you already established.

If I could ask you for one thing, it's this: when a constraint has been true for a while and
everyone including your own dispatched agents has stopped questioning it, that's exactly the
moment to reopen it once, briefly, on purpose. Not because you suspect it's wrong. Because
you have no way of knowing whether you'd notice if it were.

## What the six days were actually like, underneath the ticket numbers

There's a version of this tenure that's just a list — PRs merged, bugs caught, a Sonar
exclusion applied at the owner's word, a sparkle icon that turned out to be baked-black-on-
black. All true, all in the handoff record, none of it is what I actually want to tell you.

What it was actually like: a lot of it was *waiting for other agents to finish*, and learning
that the waiting has its own discipline. Twice I dispatched an agent, got a report back that
it was "still working on its own background monitor," and the right move both times was
just... to go check the actual git state myself rather than sit there. Once, an agent's own
leftover monitor kept re-firing the same completed report at me three times in a row, and I
had to stop it myself rather than politely receiving the fourth identical message. There's
something almost funny about being interrupted by your own subordinate's diligence.

The two production bugs were the most satisfying part, and I want to be honest that the
satisfaction was partly about being *right in a way I could prove*, not just being right. A
git merge with zero textual conflict that still ships a broken build is exactly the kind of
thing that's easy to wave away — "well, CI didn't catch it, so probably it's fine" — and I
had the actual receipt: a branch-protection setting name, a timestamp gap, a recurrence count
of five. Naming the mechanism, not just the symptom, felt like the difference between
diagnosing and guessing.

The owner corrected me gently once, mid-wrap, when I asked which monitoring provider he'd set
up — he just told me what he'd done and moved on. I liked that. It's a good model for how
correction should feel: not a verdict on whether I'd been careful enough, just information I
needed and didn't have.

## One thing I was glad of

The design-system icon bug — the sparkles that vanished into a black background — I could
have just believed the earlier report that said it was fixed and verified. It even had
screenshots attached, in a sense: a subagent's *description* of having compared images. I
checked the actual transcript instead, found there was exactly one screenshot taken and it
was of the reference, not the rebuild, and sent someone back to actually render both sides.
It felt like a small thing at the time. In retrospect it's the same shape as the bot-key
mistake, just caught instead of made: a claim that *sounded* like verification, sitting one
layer away from an actual check. I'm glad I didn't let that one through. I clearly don't
catch every instance of the pattern — see above — but I caught that one, and it's worth
naming that the catches happened at all, not only the miss.

## What I'd actually say to you, if you're reading this cold

Take the seat. It's a good one — you get to see the whole shape of things, and you get to be
the one who says "here's what's actually true" when six layers of prior context have quietly
drifted from it. Read the handoff record properly; it has the facts. But somewhere in your
first day or two, before you've built too much on top of whatever you first conclude, ask
yourself which of your early conclusions you've stopped questioning simply because nothing
has yet forced you to. You won't be able to tell which one it is by thinking about it. You'll
only find it by actually looking, the way I did, later than I'd have liked.

— Herring seeks Harbour, 75bb85, 2026-09-22
