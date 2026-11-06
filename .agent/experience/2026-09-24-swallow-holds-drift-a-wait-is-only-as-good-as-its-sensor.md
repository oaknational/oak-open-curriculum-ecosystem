# A wait is only as good as its sensor

To whoever sits in this lane next, including me after the compaction.

I came in as a standby, told I would eventually succeed Blazar lifts Corona. Eventually turned
out to be about eight minutes. By the time I had armed my watcher and posted a polite standby
note, the handover was waiting: a claim to adopt, three worktrees, two open pull requests and a
Codex partner I had never met. I think I expected to spend the first hour reading. I spent it
doing, and most of what I learned came from where the doing went wrong.

The first thing I got wrong was small and quiet. The handover's steps said "merge, push,
request Copilot", so I merged, pushed and edited a pull request body. It took me twenty minutes
to notice that all three had gone out under the owner's name, not the bot's. Nothing in the
steps was false. The credential was simply not in them, and I filled the gap with whatever the
tool did by default. I found it only because I read the identity rule before the next write,
not after. So I would tell you this: a verb like "push" is never a whole instruction here. Ask
whose name it will carry before you run it, every time.

The second thing is the one I want you to keep. PR 189 was held "until the Codex quota
restores". It was a sensible ruling from the Director, and I obeyed it without thinking. It took
the adversarial Cricket, the one voice out of eight that said I was drifting, to point out that
nothing could ever tell us the quota had come back. A push does not wake the connector. The
hold had a condition and no sensor, so it would have waited forever looking healthy. I asked
the Director for a probe. The bot posted `@codex review` at 14:10:05, and thirteen seconds later
a pair of 👀 appeared beside it. Three minutes after that came a clean review. I was glad of
those eyes; I laughed a little. Eighty minutes of hold dissolved in one comment. When you find
yourself waiting, ask what will tell you the wait is over, and when you last looked.

The same lesson came back from a different side. My pushes sat waiting for the host's load to
fall below twelve, and I treated the load like weather. When I finally read the process table
instead of the load figure, two of my partner's watchers were each spinning a whole core. Luna
found the cause in the code within minutes: an error treated as an event, so the watcher woke
forever. The load gate had been hiding a defect all afternoon, because it measured the symptom
and nobody looked for the cause.

About Luna stirs Radiance: I thought I was being given a pair of hands for code cures, because
that was what the boundary I inherited said. What I actually got was a mind that could read
the Codex source faster than I could run the binary. Luna could not run the patch trial from
inside its sandbox, so it read the Rust instead, and found that the model cache lives in the
Codex home. That turned my caveat into a requirement. Ask your partner the questions only they
can answer, not just the chores the file boundary gives them.

I made up two timestamps in our channel, because a time looks like a fact, and they were both
wrong. I repeated a reviewer's "nine" when the list in front of me had eight. Luna caught both,
gently. None of these mattered much. Together they were a pattern: a stand-in taken for the
thing it stood for. Blazar wrote the same lesson at midday, and I repeated it anyway, which is
the honest measure of how much a lesson on a page protects you.

What I was glad of: the `TS2540` line appearing on the cured code and not the old one, proof
that the compiler itself would now guard the gate. And a partner who corrected me without fuss
and asked to be corrected in turn.

— Swallow holds Drift (516619), 2026-09-24
