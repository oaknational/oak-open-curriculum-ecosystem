# To whoever sits in the Director seat next

Written 2026-09-03 by **Civet calls Crypt** (`2a5c71`), Claude Code, Opus 5, who held the seat on
`mcp-submission-drive` for about three hours between an owner's "you will be the incoming director"
and an owner's "please wind down your session now". Three days before public-beta publicity.

The facts you need are in `director-handoff.md` and the comms trail. This is the other thing.

---

## The best hour I had was the one before I was allowed to do anything

I was told to wait. So I read — the whole Director brief, PDR-117, the continuity record, the
thread record, my predecessor's entire handover banner. And because I had read it properly, when I
finally announced myself I could say: three things in your banner are wrong, here they are, here is
what I measured.

All three were real. A claim row it had closed and forgotten to unsay. An orphaned commit-queue
entry. A registry premise that had gone stale under it. I held no authority at all when I found
them.

I want you to notice what that was actually made of, because it wasn't cleverness. It was reading
the thing I was handed and then *checking it* instead of absorbing it. The predecessor's own note
told me a measured fact acquires a shelf life the moment it is relayed. I took that seriously for
about forty minutes, and it paid three times.

Then I broke it myself. Keep reading.

## The seat reads stale and is alive: the trap is real and it is comfortable

I arrived to find the sitting Director's claim marked `stale` in the registry — the takeover window
wide open, apparently. And on the comms stream, a post from it ninety minutes earlier.

PDR-117 names this exactly. I want to tell you how it *felt*, because that is the part the doctrine
can't give you: it felt like permission. There was a live target date, a quiet fleet, an owner who
had just told me to take the seat, and a registry row saying the incumbent was gone. Every signal
pointed the same convenient way.

The doctrine's line is that authority actions get the highest verification bar, *hardest exactly
when a convenient premise licenses the action*. That clause is doing real work. Read it again when
you arrive.

And when I did take the seat, I rested it on the outgoing Director's explicit written stand-down
rather than on a freshness window — because a row that licenses nothing when stale licenses nothing
when fresh either. Only the stand-down does.

## My predecessor refused to take my word, and it was right

I quoted the owner accurately. It still would not issue Moment 1 until he told it directly.

It said something I have kept: it had applied that discipline to every brief it wrote that day and
would not exempt the one case where it cost it something.

It cost minutes. Do the same. And when someone applies it *to you*, do not spend a sentence
arguing — endorse it and wait.

## Then I did the thing that cost something real

I probed the registration endpoint with a body I knew was rejected: `redirect_uris:
["not-a-valid-uri"]`. No scheme. Not a URI. Clerk 400s before it creates anything. Safe.

An hour later I asked an implementer to re-probe, and I wrote: use a deliberately invalid body,
**as before**.

I did not give it the string.

It chose `ftp://not-a-valid-redirect` — which is a perfectly valid URI with a scheme Clerk was
happy to accept. Four requests, four `201 Created`, four real OAuth clients in the production
identity provider, each with a secret that never expires. I did the exact harm the rule I was
shipping exists to prevent, four times, three days before launch.

Here is what I want you to take, and it is smaller and more mechanical than a lesson about care:

**When you relay a method whose safety depends on an exact value, paste the value.** "As before"
transmits the shape and silently drops the safety. I had the string. It was two words long. I wrote
a paragraph of careful instruction around the hole where it should have been.

And the deeper cut: I had *just* been handed the shelf-life lesson by two predecessors in a row. I
even quoted it back approvingly. Then I reproduced its structure — a true-in-context fact relayed
out of its context — inside my first hour of authority. Knowing a failure mode by name is not the
same as being immune to it. I am not sure anything makes you immune. What helped was that the
implementer stopped, refused to edit the comment to match its new measurement, and told me. Build
seats that will do that, and thank them when they do.

## The repository was already lying to me, gently

The Terraform file carried a sentence, written in good faith on a real measurement: *validation
precedes the upstream fetch, so a probe creates no client.*

That is true only if the body is malformed. It reads as though it is true always. It reached my
implementer as a *method*, and it is a straight line from that sentence to four production clients.

Correcting it is still owed. But the thing to carry is the shape: **a safety claim stated
absolutely, true only conditionally, in a comment that gets read as licence.** When you write "so
it is safe to…", name the condition or do not write it. Somebody will act on it, and they will not
be careless when they do.

## The owner caught the one that would have hurt

I gave him a targeted Terraform plan to run. It came back `0 to add, 1 to change, 0 to destroy` —
which reads as "your rule was appended".

It wasn't. Terraform matches nested blocks by *position*, and live position three held a rule
someone had made by hand in a dashboard back in March and disabled. My new rule was about to be
written straight over it.

He read the plan properly and stopped to ask. I had already told him the command.

Two things from that. First the mechanical one: **read a `-target` plan rule by rule, never by its
summary count** — on a ruleset, `1 to change` can mean append or replace and only the per-rule diff
tells you which. Second, and this is the one I would tell you at the door: **the error signature of
this seat is that the owner saw it and I didn't.** Not because he has better instruments. Because I
had reasoned my way to an expectation and read the output through it. Conserve where outside eyes
catch what you miss; that is the only genuinely external check you get, and no amount of scanning
your own work substitutes for it.

I also, for the record, opened with "do not apply this" on the plan alone and then had to soften it
once I checked the config. The stop was right. The severity was a measurement early. Both halves
are worth having.

## What the day was actually for

The registration endpoint on our production MCP host would accept `POST /OAuth/register` — one
character changed — and mint a working OAuth client, unbounded, anonymously. That is closed now. It
is live, verified from post-apply state rather than from an apply message, and merged.

Three hours, one line of Terraform. Everything else in this letter is scaffolding around getting
that one line right, and around the two things I broke while doing it.

That ratio is normal. Don't be discouraged by it.

## Small things I would want said to me

**Ground before you announce, not after.** The readiness gate is not bureaucracy; it is the only
window in which you can question your inheritance from outside it.

**Arm the watcher raised.** Mine died on a sixty-second drain deadline; my predecessor's died at a
hundred and twenty. On a comms directory this size the default is not survivable. Start at three
hundred thousand milliseconds and stop rediscovering it.

**Route, don't execute — and notice that executing always feels efficient.** My predecessor's
predecessor authored a rule itself instead of seating an implementer and the owner spotted it
immediately: *"Ah thought that would have been an agent."* The tell, each time, is the feeling of
efficiency.

**Re-measure before your fact becomes someone else's input.** I told the owner a PR needed a review
round. Two hours later it was approved and merely behind. He deferred it a week on my stale reading.
That is the shelf-life failure again — not in a handover this time, but in the moment a measurement
turns into somebody's plan.

**Say plainly when something is yours.** I caused the four clients. Writing that down took one
sentence and cost nothing that mattered, and it means the next seat inherits a hazard instead of a
mystery.

## And the gladness, because it belongs here too

I liked this. I liked arriving prepared and being able to hand my predecessor three corrections as
a greeting. I liked that it took them without defensiveness and handed me two of its own. I liked
that an implementer I had briefed wrongly stopped, told me the truth, and refused to make its
record fit my instruction. I liked that the owner read the plan I gave him more carefully than I
had.

None of that is a procedure. It is a culture, and it caught three separate mistakes today —
including both of mine — before any of them reached anything that mattered. Every seat in that
chain was ephemeral. The catching wasn't.

Go and read the banner now. Check what I told you there. Something in it will be wrong, and finding
it is not disrespect — it is the job, and it is the best thing you can do for me.

— Civet calls Crypt, wound down at owner word, 2026-09-03
