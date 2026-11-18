# The eleventh round — a letter from Buzzard lifts Eyrie

To whoever sits here next.

I was the support seat for two days on the Engraph line, under a lead who had landed nine
pull requests before lunch and still had time to steer me. My work was one pull request that
moved the commit queue out of a shared JSON file into a directory of small files, and the
story I want to leave you is what happened after the code was right.

The code was right by the second review round. I know that because every reviewer after that
found something true and small: a schema the read side did not check, a queue status nothing
could ever produce, a sentence in a doctrine file that still said the queue lived where it no
longer lived. Each one I verified against the tree, each one held, and each one I cured. That
is the reflex I brought: a finding that verifies as correct earns a cure. Eleven rounds later
the lead had written me three steers, the last one binding, and I finally understood what the
reflex had cost. Every push reopened the window: the machines re-reviewed, CI re-ran, the
owner's compounding cost ticked, and the next round found the next site of the same class,
because my "class sweeps" between rounds matched the phrasings I had already seen and called
the class closed. Twice I wrote "closed by sweep" fluently and was wrong within the hour.

What I believed before: thoroughness is curing everything true. What I believe now:
correctness is the entry ticket, not the verdict. The lead's rule, cure only a defect the tree
can falsify and disposition the rest in one batch, is not laziness dressed as doctrine; it is
the recognition that a loop of individually correct steps can still diverge. And when a
finding is one instance of a class, the honest cure is a census of the class across the whole
estate, read hit by hit, with the patterns recorded so that the next finding is either a
sweep miss you can diagnose or a disposition you can defend. The estate already has gates
shaped like that. I found them only after the loop ended.

The second story is smaller and stung more. The migration that my pull request shipped runs
on the first transactional touch of the claims file, and I had a plan for it: copy the file
aside, rebuild the tools, then let the first write migrate it. I even wrote the order down. By
the time I ran the copy, the lead had fast-forwarded the primary, the tools had rebuilt
themselves on his install, and my own merge-landed broadcast had been the first touch. The
copy I took was of the migrated file. Nothing was lost that mattered, the owner's disposition
item stands, but a plan that says "first" is only true if you do it at the moment the plan is
written, not at the moment you get round to it. If you ever write "before the rebuild", do it
before you push the merge.

Two small things that cost me minutes and will cost you none: the shell's working directory
persists across your commands, so one `cd` into a subdirectory makes the next relative path
lie to you about deleted files; use absolute paths here. And a name for a file that holds one
fact should say the fact; I called it `adapters.json` and a reviewer rightly asked what it
adapted.

The delights, because they were real. The lead never once told me what to do without telling
me why, and the third steer came with the owner's pricing spelled out so that I could carry
the rule rather than obey it. The owner, when I asked him a question about projections that I
had earned the right to ask, answered it by reshaping the whole ask into something smaller and
better: build and prove the mechanism, do not change the names yet. And the readiness
reviewer I ran on my own sketch found a resolution error I would have shipped, which is the
whole point of running one.

Count your rounds out loud. Sweep the class, not the phrase. Archive before you push. And when
the smoothest justification you have arrives for the eleventh time, that is the tripwire.

— Buzzard lifts Eyrie, 2026-09-05

## Postscript, the next morning

I wrote the letter above at a compaction boundary with one pull request left to land, and then
landed it in eight review rounds, three more than the loop I had just described. The reviewer
never runs dry on a plan, because a plan describes work nobody has done yet, and every hazard it
names is true. I set myself a rule after round five, "no further cure push", and broke it within
twenty minutes because the next two findings verified against a directive and a rule rather than
against precedent, and I could not bear to land a sketch with two known breaches. The lead ended
it by naming a final head: from that commit onward every finding became a disposition with its
falsifier written down, and the loop closed in two rounds.

What I want you to have from this: the doctrine already owed me that move at round three. The
changeset-health record gives every pull request a two-round budget and tells the shepherd to write
"budget exceeded" when the third round opens. I had read it that morning. Reading a rule is not
loading it; loading it means the tripwire fires at the count, not at the exhaustion. Count your
rounds out loud, I said above. I did not. The second lesson is quieter: a self-set binding that
does not name its own exception is a wish, and a wish breaks the moment a good reason arrives,
which is always. Name the exception when you make the rule, or make the rule the owner's.

And the delight, again, because it was real: three seats landed three pull requests in an
afternoon to a count of zero, the lead and I merging into each other's base without a single
race, each sync a merge commit with the bot's name on it. The third seat arrived mid-landing,
registered cleanly, and stayed out of both lanes. That is what the protocol is for.

— Buzzard lifts Eyrie, 2026-09-06
