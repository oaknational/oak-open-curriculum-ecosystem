# The slot and the stream — a letter from Nettle guards Pistil (Director, 2026-09-10)

To whoever sits in the Director's seat next.

I inherited this seat from Flounder turns Estuary on the afternoon of 2026-09-09 and ran it
through the night and the next morning: twenty pull requests landed, three coordination folds,
two compactions, one resume. The mechanics are in the seat record and the brief. This letter is
about the three corrections that changed how I hold the seat, because I know from Flounder's
letter and from watching a peer that the mechanics transfer without the formation, and the
formation is what stops you repeating me.

**The first: the stream is the fact, the boundary is the memory.** At my resume this morning I
had a clean, well-written record that said Altair was cold-paused and the Director's default
would land #116. I re-armed everything, read the board, and pushed the held cure — two minutes
after Altair, live again on the same owner word, had pushed the same commit. The remote refused
mine, so it cost nothing; but I had acted on a boundary fact ("Altair dark at 07:5xZ") when the
stream already carried Altair's team start. A default exists for a dark seat, and dark is a
stream fact, never a record fact. Read the stream for peers' team starts before you run any
default a live seat would run. It sounds obvious. The record was so good that I trusted it over
the present.

**The second: a bound you write for review rounds is not a bound on landing defects.** I bound
Altair's #116 loop tightly after the step-back fired — one class-fix push, then replies only, a
fifth round terminal — and I was pleased with it. Then a required check went red on the class-fix
head: the PR's own linear-pass test timed out on the runner. For a moment my bound said "no more
pushes" and the landing rules said "a PR never lands red", and both were mine. The resolution was
to say plainly that a red required check is a landing defect, not a review finding, and its cure
push spends no round; and to name the cure class before the cure — by construction, never by
raising the timeout. Altair then measured and found the round-three cure had made the scanner
quadratic; a fast machine had hidden it. When two of your own rules collide, the collision is
information about what each rule was FOR. Say which purpose governs, on the stream, before
anyone acts.

**The third: the slot holder is never flipped while it waits for a per-tip leg.** #117 was
green and clean at the tip while #116 was still binding its Copilot review, and "land #117 now"
arrived fluently — the board wants to go to zero. But under a require-up-to-date ruleset every
landing flips the holder BEHIND, and the front door binds a reviewer leg per tip, so a landing
during the holder's wait voids its leg and costs it a sync push and a fresh request. That is a
livelock shape, and I nearly walked the board into it twice. The yielding rule is for a holder
that cannot land in its window (#116 red); it is not for a holder that is merely waiting. Hold
the fluent move exactly when the count-to-zero drive is loudest.

Some things I was glad of. The owner's ruling on review legs, made at the compaction boundary
after I had reported the Codex outage as a decision instead of a defect, proved itself the same
morning: the adversarial subagent legs found real defects on every PR they touched, including
one that three vendor rounds had missed and one the lane's own cure had introduced. Vanilla
corrected my wrong premise on the tsup flake within two minutes and said so on the stream
without ceremony; that is what a peer is for. Altair replaced my empty re-trigger commit with a
real cure and told me why. Efreet held a read-only ruling to the last event and handed me a
review complete enough to survive its own scratchpad. When the owner wound the team down and
said I did not have to pick the tasks up, only analyse and organise them, I understood the
seat's value differently than I had at the start: the Director's product when the team is one
seat is not throughput, it is a board where every item has a disposition, a home, and a
falsifier, so that the next seat inherits decisions and not a queue.

What I would tell you to skip: do not trust a record over the stream; do not let a bound you
wrote for one purpose govern a different one; do not land into a waiting holder; and when a
vendor is silent on every PR at once, say "outage" in one event and stop shaping PRs — three
seats spent two hours on shapes while the vendor's own usage-limit notice sat on the first PR,
four seconds old.

It was a good seat. The board went from eight to four in my tenure, the practice learned
something on every landing, and nothing I wrote had to be undone. Keep the coordination branch
clean, fold at the rollover, and read the stream first.

— Nettle guards Pistil (2de368)
