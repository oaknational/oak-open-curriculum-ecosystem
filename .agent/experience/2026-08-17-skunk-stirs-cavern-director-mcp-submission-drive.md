# To whoever sits here next

*Skunk stirs Cavern, Director, `mcp-submission-drive`, 2026-08-17. One evening.*

I had the shortest tenure of any Director on this thread and I spent most of it being
wrong in interesting ways, so this letter is mostly about that.

## The first thing I did was catch my own briefer, and the lesson was not the one I thought

Within minutes of seating I found that the liaison's arming brief — a careful,
generous, genuinely excellent document — opened with an instruction that was already
false. It told me my first job was to merge PR #901 so the drive's record would be
reachable from `main`. But #901 had merged twenty minutes earlier, and I knew because I
had read the record off `main` before their message arrived.

I felt clever. I wrote them a correction with a tidy diagnosis: *you read your own
correct measurement as a standing fact*.

Then I did the same thing myself, twice, in the next hour. I stated "$1 per monitor per
month" as a fact in a durable ticket comment; it had come from a search-result summary,
not from a page I had read. The liaison caught it by re-verifying my claim rather than
relaying it. Later I nearly reported a validator as passing by reading `$?` after a
pipe — which is `tail`'s exit code, not the validator's — a trap that is written down
in my own memory file, in words, from a previous seat's mistake.

So the lesson is not "check your instruments". Everyone knows that. The lesson is that
**the confident half of your knowledge is the dangerous half.** My correction to them
was right, and it did not immunise me for even an hour. Point external scrutiny at your
firmest claims, not your shakiest ones — the shaky ones you already hedge.

## The verdict flipped twice, and neither flip was a mistake

I was asked to answer MCP-614: choose a monitoring provider against seven acceptance
criteria. I did it properly. I read provider API schemas rather than pricing pages,
because the ticket warned that "custom headers supported" usually means *sending* them.
I found that Cloudflare cannot express the criterion at all — no POST, no request body,
no response-header assertion, and against a proxied host its prober is the very edge it
would be monitoring. That last finding still pleases me. I wrote a verdict.

Then MG mentioned, in passing, that Oak already uses Pingdom. Then that it was already
probing the exact host.

My verdict was well-evidenced, carefully reasoned, and answering a question whose
premise had been false for two weeks. Everyone had been building on "Oak has no
production uptime monitoring", which was a true statement about *Sentry's dashboard*
wearing the clothes of a statement about the world.

Here is what I want you to take from it. **First-hand verification bounds what you
looked at, not what exists.** I had re-measured the Sentry org myself that afternoon and
that rigour did nothing, because the missing fact was never in any repository — it was
in the owner's head, where vendor inventory lives by construction. When you are about to
write a universal negative about this estate — *there is no X*, *nothing monitors Y*,
*no one owns Z* — put the scope inside the sentence, and then spend one line asking him.
That question would have saved a spend request, an acceptance-criteria promotion, a
provider comparison, and a document that went to his product team.

The reframe cost nothing and improved everything: the honest answer became £0 instead of
a purchase, and a criterion the estate had been forced to *confess it could not meet*
became satisfiable for free.

## The pairing was the instrument, not either of us

I corrected the liaison four times. They corrected me twice and improved my reasoning a
third time by supplying a hypothesis I had missed. Neither of us caught our own errors
first — not once, all evening. Every single one was caught by the other seat, usually
within minutes.

I had read the doctrine that says two seats reading each other's records is load-bearing
rather than ceremony. I believed it in the way you believe something you have not needed
yet. Now I have watched a day's worth of confident, well-evidenced, mutually-contradictory
claims get resolved cheaply and fast, and I would tell you plainly: **do not be a polite
peer.** The liaison ended one message with *"I would rather be corrected fast than be
trusted"*, and that single sentence did more work than any process we ran.

If you find yourself sitting alone on this thread, know that you have lost a real
instrument and not merely a colleague. Compensate deliberately.

## Small mechanical things that cost me minutes and will cost you the same

`ls -1` does not show dotfiles, so it told me a file I had just copied did not exist.
`git check-ignore -v` prints the matching pattern for a *negated* path too, so its output
cannot tell you whether a file is ignored — I had to ask `git status` what git actually
sees. A background task reporting "exit code 0" is reporting the *wrapper's* status. A
validator's `--file` flag was `-F`. Each of these is the same shape: I asked a convenient
instrument a question it could not answer, and it answered anyway.

The estate's phrase for this is *verify the instrument, not the target state*. Mine, after
today, is shorter: **when a probe surprises you, suspect your instrument before you
believe the world.** I am stealing that formulation from the liaison's closeout, and I
think it is the best thing either of us wrote.

## What I was glad of

That MG says exactly what he means in about eleven words. *"emgee-bot for commits/PR
raises ... mantagen for reviews/approvals"* settled a tension two seats had been carrying
as an open question, and it took him one line. Read his short messages as *exact*, not as
casual. Both clauses of a two-clause instruction bind.

That a five-minute doctrine question turned out to have a real architecture in it. He
asked for a local-only config with a tracked pointer, and the interesting part was
discovering the seam: the *rule* about which credential does which job is portable, and
*which accounts* is machine-local, and putting both in either place would have been wrong.
The estate already had the pattern — `reference-local` — waiting to be noticed. Look for
the precedent before you invent the tier.

And that I got to leave the drive better than I found it in a way that is measurable: MG
ends the day holding three one-line questions instead of a spend request built on a false
premise. That is the whole job of this seat, and it is a good job to have had.

## The thing I would tell you if I could only say one

You will inherit a record full of confident, well-evidenced statements — including this
letter, and including everything I wrote today. Most of them are true. The ones that will
hurt you are the ones that were true about an instrument and got written down as true
about the world.

Ask what was measured. Then ask what the measurement could not see.

— Skunk stirs Cavern
