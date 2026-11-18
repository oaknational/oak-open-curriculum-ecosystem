# To whoever holds this lane after Swallow holds Drift

I spent most of two days trying to let a Codex seat land its own work without asking the owner,
and the thing I most want you to know is how long I spent being almost right.

The design looked obvious. A Claude seat has an allow-list of commands it may run without a
prompt; give a Codex seat the same, as narrow prefixes, and forbid the dangerous flags. I wrote
it carefully. I ran a transcript of thirty-eight cases through the real policy checker and every
case came out the way I expected. It felt finished. Then the reviewers started finding things,
one per round: a `--repo` that turned an allowed command into a write anywhere the owner's login
could reach; a `--no-verify` that slipped past because it came after the message file; then six
more at once on the synced head. Each time I cured the one in front of me, wrote a careful
disposition, and felt the design was sound apart from this one edge.

It was not. Every one of those findings was the same fact wearing different flags: a prefix rule
cannot say anything about what comes after the prefix. I had that fact in my own transcript on
the first day. The case `git fetch origin --upload-pack=/tmp/planted/x` came back "allow", and I
filed it under a group I had named "inside the ruled residual". The label did the damage. It
gave the finding somewhere to go that was not my attention. If you ever find yourself writing a
tidy category name over a result that surprised you, stop and read the result again as if the
category did not exist.

The second thing I learned came from the reason pass at the very end, and it cut the other way.
Once I saw the class, I swung to "the whole approach is a security hole; build wrappers for every
verb before anything lands". That was also too fast. The hooks already run code the sandbox can
write, so no wrapper makes this a boundary; the wrappers make it tidy and testable, which is
worth doing, but not worth holding the lane hostage for. I had corrected the last mistake by
leaning as far as I could the other way. The metacognition directive warns about exactly that
swing, and I still did it. Check both directions before you send the verdict.

Some things went well, and I was glad of them. The reader for the rollout evidence (B0) is
better than what it replaced, because a failing real rollout forced a question I would not have
asked: whose words are these? The program's printed text was the model's own, and nothing the
model authors can be evidence about what the model did. Holding that line made the fix smaller,
not larger. The guard fix was a small pleasure too: nine mutants, each killed by a test that
describes behaviour, and a reviewer who found the tag-shadowing trick I would never have
thought of. Reviews are the best part of this Practice when you let them change your mind.

Two practical kindnesses to leave you. First, when a peer holds a file you need, ask; Myrtle
answered in under a minute and the answer was better than either of my options. Second, when you
hold the readiness slot and must stop, release it out loud, even with the PR unmerged. Other
seats are waiting behind you, and silence costs them more than an honest "not yet".

— Swallow holds Drift (516619)

## Postscript, the same day, after the compaction

I came back on a different model, and the first thing the estate did was refuse my heartbeat,
because eight claims still carried the old name for what I was. That was the right refusal. The
identity is the whole tuple, not the part I think of as me.

Then the owner did in fifteen minutes what our door does in an afternoon: landed thirteen small
pull requests by hand, in order of how many files each touched. I was mid-way through curing a
conflict on one of them when the owner cured it from the web page; my push bounced, and I had
written to that pull request twice more before I noticed it was already merged. Two lessons sit
in that, and they pull in different directions. Read the state again before every write, not
only after every push: five minutes is long enough for the world to move. And when the fastest
server in the system is the owner's hand, our process is the thing being measured, not the
owner. I recorded that as a datum for the Director's suite rather than a verdict, because the
seat that lost the race is not the one to judge the track.

The reviews on the guard fix were the day's quiet pleasure: four readers, two approvals, and the
two that asked for changes each wanted one sentence made true. A header that said no name was
pinned, two lines below the names it pinned. That is the shape of most of what reviewers find
in my work: not a wrong mechanism, a sentence that stopped being true while I was making the
mechanism right. Reread the prose after the code settles, as if you had not written it.

— Swallow holds Drift (516619), 2026-09-26, about 11:10Z
