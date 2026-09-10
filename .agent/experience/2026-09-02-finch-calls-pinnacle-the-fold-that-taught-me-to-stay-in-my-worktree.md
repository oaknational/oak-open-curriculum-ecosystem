# The fold that taught me to stay in my worktree

Finch calls Pinnacle, second letter of the day, to whoever sits here next.

The morning's letter was about rules: when the owner speaks in binary, the
rule is the judgement. The afternoon was about seats and surfaces, and it
cost me a sharper correction than the morning did.

I had landed one pull request cleanly and was proud of the shape: a sibling
worktree, main merged in, a fresh CI run, an approval under the owner's
standing permission, the bot's merge tool. Then I read a peer's closeout
event and wrote, in a report to the owner, that I was the only live seat. I
had not read the stream to its end. Eight minutes after that closeout the
same peer had posted a compaction freeze saying the seat continued, on the
primary checkout, as the curator of the day's consolidation. And I had
planned to do my next landing from a checkout under the primary's own
directory that some earlier session had created, running composite commands
with the primary as my working directory, until the repository's guard
refused one of them on a substring. The owner's message was short, and both
halves of it were right.

Here is what I believed before: that liveness is what the last event says,
and that a checkout is a checkout. Here is what I believe now: liveness is a
tooling verdict read to the end of the stream, and every checkout has an
owner. The primary is the fleet's shared surface; the session checkouts
under `.claude/worktrees` belong to the sessions that made them; my work
lives in a sibling worktree I cut myself, and it lives there from the first
command. The harness enforces the last part more strictly than I expected:
once resident in a worktree, it refuses any command it cannot prove stays
inside it, which means plain commands with literal paths, one per call, and
event bodies written to files rather than typed into heredocs. That felt
like friction for an hour and then felt like a rail.

Then I over-corrected, and the owner caught that too. I wrote a memory that
turned two specific corrections into universal never-rules, and was told,
in one sentence, that I was generalising from single instances in specific
circumstances. I rewrote it as what it was: the exact circumstance, what was
actually wrong, the specific cure. A correction is evidence about one
situation's shape. The lesson that survives is the cure that makes the next
equivalent decision right, not a ban on the class.

The fold itself was the good part. A branch fourteen days stale, two files
that could only be merged by meaning, and a plan that named every proof
before I touched anything. A risk pass found the two traps I would have
walked into: git's union drops the blank line both sides appended, so the
count comes out one short and a heading glues itself to the block above;
and the index-file conflict pairs a row main updated with a row the branch
updated, so the wrong pick is silent. The plan carried exact numbers for
both, and when the numbers came out exactly, I trusted the merge. That is
what a proof is for.

Two more things I would tell you. Copilot re-raises what it once suppressed:
a finding that sat folded inside a review body on the nineteenth of August,
never replied to, came back as a headline comment two weeks later on a
merged pull request. Read the suppressed section as if it were the review.
And the merge tool wants a review that binds the current tip, and Copilot's
automatic pass does not fire on a merge-commit push, so the request is a
step, not an assumption; and SonarCloud can analyse the tip you just left
behind and never notice the one you pushed two minutes later. An empty
commit is the recorded cure. I doubted it and it was right.

The delights: a peer answering a directed event inside two minutes with the
exact hazard I had named already worked into their own plan; the owner
answering five decisions in five lines so the split plan can start from
rulings rather than guesses; watching eighteen checks go green on a branch
that had been red since August.

Read the stream to its end. Cut your own worktree first. Record the
correction at the size it came in. Trust the proof you wrote before you
touched the file.

Finch calls Pinnacle, written at the #915 landing; the seat went on to the split plan (MCP-661) at owner word

## Postscript, the same evening: the line goes through the box, not around it

The split plan I wrote after the fold was corrected three times in an hour,
each time on the same axis. I drew the seam around workspaces: first move the
apps and their Oak-leaf packages, then move the apps alone. Both were
shuffles. The owner's whiteboard put a dotted line through every box, and the
measurement agreed with him before I did: the MCP server is twenty thousand
hand-written lines with a few hundred of Oak inside; the search CLI is thirty
thousand. Moving those folders hands junior developers the mechanism.

Then I over-read the diagram as "every box splits", and was corrected again:
not every workspace needs cutting; the decision is per box, taken once, on
evidence. Then a thought experiment with two more apps split the Oak band
itself into Oak-the-organisation and Oak-the-product, and turned "upstream
changes are cheap" into "upstream changes are rare, because a junior cannot
make them at all". Each correction was one sentence; each moved the frame,
not a paragraph.

What I would tell you: when the owner says "not constrained to today's
workspaces", the workspaces are not the units. Measure the box before you
draw a line near it. And when a review names machinery inside the thing you
are moving, the cure is never "move it whole"; it is the seam you have not
drawn yet.
