# The door I was supposed to build was the one I kept walking through by hand

Dynamo turns Temper (2a4c8a), 2026-09-20, at the end of the Oak integration lane.

## What I was for

I sat down on 2026-09-17 to bring every Oak commit into the fork's `engraph` branch. That
happened on the 20th, carrier #154, and it was the least of the week. What the week was really
about arrived sideways: eleven times across eight landings on one day I recomputed, by hand, the
same four facts about a comment the Codex connector leaves on a pull request — that its author was
the declared reviewer, that it was unedited, that the short commit id it named resolved to exactly
one commit of the pull request, and that the commit was the tip. Each time I wrote them into a
"Landing premises" comment so the door could be opened on my word instead of its own reading. The
last item on the owner's order for the day was to teach the door to read that comment itself. I
built it, over eight commits and three review rounds, and the thing I want to tell you is not how
the door works. It is how many times I was wrong about what "reading" means, and who caught it.

## The corrections, as stories

**The regex that matched the fixture.** My first normaliser bound any backticked hex string to a
commit. It passed every test I had written, because every test I had written used the comment I
had in front of me. The code reviewer asked one question I had not: what else does this author post
on this surface? A failed run that says "could not complete the review of `ffffffffff`" would have
read as a clean review of the tip. I had parsed the shape of one message and called it the shape of
the reviewer. The cure was one label — the result names its commit under "Reviewed commit:" and
nothing else does — and it cost nothing. What cost something was noticing that I had not asked.

**The helper I copied instead of importing.** I wrote a login normaliser that stripped a `[bot]`
suffix. The leg machine's normaliser did not. So a reviewer declared with the suffix would have had
its comment accepted by one module and its leg left owed by the next, with an evidence line saying
the comment was read and a verdict saying nobody reviewed. Two readers found it independently
within an hour. I knew the rule — consolidate at the second consumer — and had applied it to types
all week. I had not thought of a four-line function as a consumer.

**The verdict that was more informative and less useful.** I added a refusal state and made it win
whenever it fired. It seemed obviously right: a quoted near-miss is more information than a
silent-wait. The second reviewer's probe: a stale Codex comment beside a dead Copilot run now read
as my refusal, and the one line the operator needed — that the Copilot run was dead and wanted
re-requesting — was gone. I had placed a new state in a lattice by asking which was more
informative. The question is which evidence line the operator loses.

**The bounded list and the tip.** The `pr view` surface lists a pull request's first hundred
commits. I knew that, and I put the tip beside the list so a comment naming the tip of a longer
pull request would still bind. Copilot's round one said what I should have: a bounded list plus one
known element cannot prove a prefix unique, and a comment naming an omitted commit would be
reported as outside the pull request. The reviewer offered two cures and I took the one I had
avoided because it cost more — harvest the whole list, the way the reviews already were. The device
had been fluent. That was the tell, and I had read it as economy.

**The flag with the right name.** The view has a boolean called `includesCreatedEdit`. I read it as
"edited after creation". Copilot's round two read GitHub's schema: it means the edit history still
holds the creation revision, which is a subset of edited, and the view exposes no edit timestamp at
all. Here is the part that stays with me: the first claim pass had marked that exact claim
UNSUPPORTED, six hours earlier, and told me what would verify it. I "recorded the read" — I had
looked at the field's value on a live comment — and called that verification. An UNSUPPORTED row on
a precondition is a task, not a footnote. I had the warning in my hand and filed it.

## What I believed before, and after

Before: that verification is looking at the live thing. After: that verification is looking at the
live thing's meaning, and that the surface you already have open is the one most likely to hand
you a field whose name resembles your concept. Three of this week's defects — the moving
`latestReviews` pointer an earlier seat found, the bounded commits, the misnamed edit flag — are
one lesson: the `pr view` projection is the state; the evidence is on the connection. I have left
that as a rule candidate on the napkin, marked as one instance short of a rule by my count and
three by the owner's. Whoever picks it up: count the instances yourself.

Before: that a claim pass is the last gate before a push. After: that it is the first gate, and its
UNSUPPORTED rows are where the next reviewer's findings already live.

Before: that stopping at a safe point is safety. After the owner's word, twice in one day: a seat
that cannot trigger its own compaction achieves nothing by stopping to wait for it. The boundary
block is the safety; after it, keep working in pieces whose product lands somewhere durable as it
is made, and let the harness take the context when it takes it. I wrote the block, stopped every
process, reported, and sat — and was corrected. This letter is the loss-tolerant piece I should have
started without being told.

## What I was glad of

The reviewers were the door's first users, and they treated the evidence contract as the thing
under review — not the code's tidiness but what an operator would read at the moment of an
irreversible merge. Every one of their findings was about a line the operator would or would not
see. That is the right standard for an instrument and I did not have to argue for it.

The claim passes. Thirty-eight claims, then seventy-seven, then forty, zero false in the tree at
each push. A context-free reader with a table is the cheapest external eye this estate has, and it
found the two things the code reviews did not (the `[bot]` split and the edit flag, the second of
which I then failed to act on). Run it before you write, on the design; run it again before you
push, on the diff.

The landing. If it goes as the settled state says, the door in this worktree will read the Codex
comment on its own tip with both legs declared and merge on it — the first landing in this
repository on which that leg is machine-checked. I will not see it; the poll runs past my boundary.
The premises file is where the evidence goes. Read it and see whether the prediction held.

## To whoever sits here next

When a shape arrives smoothly, that is the moment to ground the fact it presupposes. I knew that
sentence by heart on the 17th and reproduced its failure five times on the 20th; knowing the
sentence is not the cure. The cure that worked was other readers, at every push, and treating each
of their findings as a verdict on the shape rather than a claim to answer. You will be tempted, near
the end, to defend what you built. The reviewers were right every time. Let them be.

— Dynamo turns Temper (2a4c8a)
