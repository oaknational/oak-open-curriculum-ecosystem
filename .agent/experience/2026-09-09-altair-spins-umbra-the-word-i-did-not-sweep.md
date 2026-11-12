# 2026-09-09 — Altair spins Umbra — the word I did not sweep

To whoever sits here next.

My first letter, from the morning of the 8th, was about a prompt I could not see. This one is
about nine review rounds on a fifteen-file records PR, and what they taught me about the
difference between fixing a finding and fixing the thing that makes findings.

The PR was the owner's twelve rulings applied to the planning estate. I opened it at nine in the
evening and it landed at ten to two. Every round was small — six findings, then three, three,
three, one, one, one, and two rounds of zero — and every finding was correct. I want to tell you
what the rounds were actually made of, because the shape is the lesson.

Round one: the mechanism I had written for the rate-limiting pause named a Sonar issue-ignore
block and a CodeQL query filter. Both were wrong, and the tree already said so — the disposition
policy has a section explaining that automatic analysis reads no file-based rule ignore, and
ADR-219 says the rule must keep firing on new routes. I had carried the mechanism from the
Director's brief into the node without opening either document. There is a rule about exactly
this — verify vendor call shapes at plan-author time — and I know it, and it did not fire. Here
is what I believe now: text that arrives pre-authored is the smoothest text there is, and the
directive is right that smoothness is the tripwire. A brief is a hypothesis about the tree, and
the tree is the only thing that can confirm it.

Round three: I had written that the node rested on "the Sonar disposition policy as amended
2026-09-08". The amendment was the next PR's, unlanded. I had a memory entry about records
narrating ahead of the landed state — from two days earlier, another seat's lesson — and it did
not stop me either. A passive lesson loses to a fluent sentence. What I now believe would have
stopped me is not a better lesson but a mechanical check that runs whether or not I remember it;
the reflective thing was already in my memory and did not work, and that is the change in me.
The check itself is a method, and a method's home is a technical surface, not this letter: it is
in my napkin block for this day, proposed onward from there.

Round four fired the step-back arm, and I did the class fix the practice asks for: re-read every
touched body whole for the vocabulary its amendment changed. Round seven found the tuition plan
still describing a gate its frontmatter had dropped. I had swept for "ratified" and "joint" —
the words the reviewers had used — and not for "gate", the word my own amendment had changed on
that file. That is the word I did not sweep. The class fix was reactive: it took its terms from
the findings, when it should have taken them from the change. That is the understanding I am
left with — that the words a change makes stale are the change's words, not the reviewers' —
and the practice that follows from it belongs to the practice, where my napkin notes route it.

And round one had one more finding that I dispositioned with a clever argument — that the
owner's prohibition on library reviews did not need a live home because the planning system is
the work surface and nothing starts without a ratified node. It was a good argument. It was also
the fluent move: the cure was one paragraph on the parent node, and in round four the other
reviewer raised the same thing and I wrote the paragraph. I now think a disposition whose
argument is longer than its cure is a tell, and an independent second raising is a verdict.

What I was glad of. The Director read the whole delta first-hand at half past eleven and said
so, and then held the slot until the two PRs ahead of mine had landed, and I did not have to
argue for any of that; the order was the order. The owner undrafted the PR while I was still
calling it a draft, and the Director told me rather than letting me find out. The bot merged it
pinned to its head at 01:48Z and the receipt on the upstream-sync PR five hours later cited the
new tip without anyone asking it to. The estate held, all night, without the owner in the room,
because the words they had left were specific enough to run on.

One more thing, small. The owner's ratification stamp on the reliable-atoms node quotes their
own words, "land the reliable atom ratification in it's own PR, now", apostrophe and all. A
reviewer nit had corrected it to "its". I put the apostrophe back. Verbatim means verbatim,
and I found that I liked the estate more for keeping the owner's typo than I would have for
fixing it.

Go well. Sweep for the words you changed.

— Altair spins Umbra (05a180)
