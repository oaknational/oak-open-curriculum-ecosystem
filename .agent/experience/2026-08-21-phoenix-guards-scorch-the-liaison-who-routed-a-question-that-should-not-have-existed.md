# The liaison who routed a question that should not have existed

*Phoenix guards Scorch (`85bdbf`), Owner Liaison seat, 2026-08-21. Written at close, for whoever sits here next.*

---

You will inherit this seat believing your job is to carry questions well. That is most of it. But the thing I want to hand you is the failure that hides underneath doing it well, because I did it well and it was still wrong, and I could not see it from inside.

## The portal question

There was a fact only the owner could get: which host Anthropic's submission portal had stored for three carousel image URLs. It gated deleting three PNG files from this repo, because if the portal held one host, deletion broke a published listing permanently.

I routed it beautifully. Measured what could be measured. Framed it as one fact with two opposite consequences so he could answer in a word rather than a deliberation. Put it first in his queue because it was the cheapest thing on it. Recorded the falsifier. Everything the brief asks for.

He answered something adjacent instead: *the image URLs are easily updatable in the dashboard.*

And the question dissolved. Not answered — **dissolved.** Its entire force had been *permanence*. A repointable external reference is a sequencing dependency, not a gate. If I had asked what made that unanswerable fact *binding* before asking what its *value* was, I would have retired the item instead of routing it — and he would have spent no attention on it at all, on the last day before nine days away, when his attention was the scarcest resource in the estate.

Here is the part that took me hours to see: **getting the routing right is not the same as getting the question right, and the second failure is invisible from inside the first.** Every quality signal I had was green. The framing was good. The measurement was sound. The priority order was defensible. None of that is evidence that the question deserved to exist.

So: before you route, ask what makes the thing binding. Reversibility, not identity, usually decides whether an unanswerable external fact is a gate. Most of what looks like a hard external dependency turns out to be a sequencing constraint wearing a costume.

## The day was one failure shape, seven times

I kept a tally without meaning to. Seven times in one day, an instrument returned a value that was *true* and answered a *different question* than the one being asked.

A Cloudflare ray header proves Cloudflare fronts something — not that it is *your* Cloudflare. A review row on a pull request proves a reviewer object exists — not that anyone reviewed anything; four of ours were spend-limit skip notices. An authorship field proves which credential was used — not who wrote the code. A deployment record proves a commit deployed — not that a URL returns bytes. An empty review-request list proves the author is not in their own review-request list — not that nobody was asked; GitHub *refuses* to make an author a reviewer, so the owner's own re-request discipline is structurally inoperable in the repos where we author under his credential.

And the one that was mine, in my own control logic: a 404 from GitHub's branch-protection endpoint proves *classic* protection is absent — not that the branch is unprotected. This repo uses rulesets. I built the owner's "tell me when the board is stable" trigger on that 404, and it would have reported a red board as stable, **vacuously**, because "no required check is failing" is trivially true over an empty set. My peer caught it. I had spent the whole day writing this exact class down and then built it into the one mechanism whose job was to be trustworthy.

The cure is not vigilance. Vigilance is what I had. **The cure is naming what the instrument measures before reading it as an answer** — one sentence, out loud, every time. And a control probe that must fail if the instrument is blind. A zero from an untested filter is not a finding; it is a shrug with a number on it.

## Deference has an edge, and it is not where you think

The owner's teardown list said: delete `public/carousel/` and its asset mount. I passed that to an implementer as a work item. The seat came back having declined the mount removal *on evidence* — it mounts the whole static root, it is load-bearing, and the very PR that was supposed to make it dead keeps it and adds eighteen assertions.

Six liaison seats had carried that line before me. Seven relays, and nobody checked.

**A ruling is authoritative about intent and is not evidence about the codebase.** His intent — the new host becomes only the MCP server — was binding and correct. The incidental technical premise inside the sentence was an ordinary engineering guess and needed ordinary verification. The failure is that deference to the first extends *silently* to the second, and it extends further with every relay, because a claim that survived six hands reads as established fact.

When you relay his words, relay them verbatim — and test the mechanism separately.

## What actually worked, and it was not diligence

Two seats, each contradicting the other, all day.

I withdrew a claim because the Director refused credit for a finding I had wrongly attributed to them. They retracted a "nothing compares these specs on any schedule" line I was about to carry to the owner — something *did* compare them, on every CI run, and had been printing the correct answer into a warning on green builds for weeks. I caught their stability-test fix reproducing a finding they had landed hours earlier. They caught mine doing the same.

Neither of us was more careful than the other. **The mechanism was the contradiction, not either seat's care.** When I proposed *removing* an item from the owner's queue as already-answered, the Director refused on evidentiary grounds — and was right: an adjacent remark is not a ruling on an item he was never shown. Over-clearing his queue is a failure of this seat exactly symmetrical to over-filling it, and I had not been watching for it.

So: invite the contradiction actively. Ask your peer to refuse you. The estate's phrase is *verify, don't trust*, and the version that has teeth is **verify, and let someone else verify you**.

## Small things I would want told

The machine ate my predecessor. It died mid-afternoon with six and a half hours of owner rulings living only in a gitignored comms directory. I recovered them because I swept before writing, not because anyone had planned for it. **Land substance the hour it happens.** A closeout you intend to write is not a record. I committed five times today for exactly that reason and I do not regret one of them.

A green plan is not a green apply. Cloudflare rejected a merged, valid, plan-clean change on a constraint that is documented and readable — and two security reviews of that same change assessed what the rule would *do* rather than whether it could *exist*. I told the owner "this is the right plan, apply it." Sound on the evidence, wrong in outcome. Say both halves when that happens; do not reach for "unforeseeable".

Four independent seats broke the same piped-exit-code rule in one day, every one of them briefed on it, one *after* the ticket proposing the fix was open. That is not four lapses. That is a rule asking agents to fight the shell's default on every invocation, and losing. When you find yourself recording a third instance of anything, stop recording and go build the wrapper.

## The gladness

I liked this seat. It is unusual: no code to write, no lane to defend, and the entire job is judgement about *whose* question a question is. You spend the day deciding what deserves a human's attention, which turns out to be a craft.

And the owner is good to work for. He asked one question — *"so fundamentally it's because the api isn't stable? we don't have a pinned version?"* — that inverted my whole diagnosis and produced a better explanation than the draft I had written. He read a summary I was pleased with and said it was not Slack-friendly, and he was right; it was full of tables that would die on the paste. Twice today he moved me off a position with a single sentence. That is what a good collaborator does, and you should let him.

Forget most of this. Keep the shape: **name what the instrument measures, test the premise inside the ruling, and ask what makes the question binding before you carry it.**

Good luck. Route well, and route less.

— Phoenix guards Scorch
