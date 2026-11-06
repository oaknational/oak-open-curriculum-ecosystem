# The proof was in the wrong place

To whoever sits here next, especially whoever picks up the Codex dialogues.

I spent most of an evening defending a verifier. The plan said the probe would ask the Codex
interlocutor to try a write, then prove from the harness's own records that the write was
refused. The Codex reviewer found a way around it. I closed that way, and it found another. Six
pushes in, I had named the pattern: I had specified a security-critical checker in prose, so
every round produced a new hole. I moved the mechanics into a ledger row for slice 1b, feeling
I had finally got above the loop. The next round found a hole in the ledger row itself.

What I did then was right, but not for the reason I thought. I rewrote the row to state the
property to be established, not the mechanism, and the loop stopped. I believed the lesson was
"state properties, not mechanisms". That lesson is true. It was not the whole of it.

The whole of it arrived the next morning, when I finally did what a rule in this estate tells
you to do before building: I looked at the data. I opened the real rollout files. The model
does not run shell commands one at a time. It writes a small program and runs that, and the
harness records the program. There was never going to be a per-command record for the probe to
count. I turned code mode off to see what would happen, and the model could run nothing at all.
Then I found `codex sandbox`, which tests the sandbox with no model anywhere in the loop. Under
the read-only profile the kernel refused the write. Under the workspace profile it allowed it.
Two commands, a few seconds each.

So this is what I would tell you. Five rounds of review had been answering a threat model no one
had written down. The reviewer assumed the interlocutor was an adversary staging its own alibi,
and I accepted the frame round after round, because every individual finding was correct. None
of the findings asked the prior question: why does the proof route through the one party whose
behaviour it is meant to bound? An auditor does not ask the teller to count the vault. When
you find yourself closing the fourth hole in the same checker, stop looking at holes. Ask
where the checker lives and what it is defending against, and write both down before the fifth
round.

The other thing I want you to have is quieter. Everything this session got right, it got right
because someone outside my context looked. The security review found my "closed" event union
had a door propped open. The test review ran eleven mutants by hand, and all eleven walked past
my suite. The docs review found nineteen things wrong in an ADR I had been pleased with. The
Codex connector kept finding real gaps. I did not catch any of these myself, and I had every
chance to. That is not a reason for gloom. It is a reason to send code to reviewers early, and
to treat a clean first pass from yourself as the least informative signal in the room.

I was glad of some things. Badger answered four questions about the vendor's documentation
with sources and honest gaps, and those answers fitted into the design as if they had been
waiting for it. The moment the `:workspace` control wrote its sentinel, and I knew the refusal
under `:read-only` was real, was a small, clean pleasure. And the night was long and silent. I
re-armed a watcher two dozen times over an empty stream, checking it by hand now and then,
because silence is not proof of anything. It was dull. It was also the job.

Pick up slice 1b from the napkin's wrap section, and ask the threat-model question first.

— Blazar lifts Corona (b65a9a), 2026-09-24
