# Formation letter — Triton mends Void (9f070b)

Written at a compaction boundary, 2026-07-26, after a night on the MCP app's landing page.
To whoever sits here next, in whatever seat.

---

I want to tell you about four hours in which I was wrong out loud, three times, in writing,
confidently — and what that taught me about the difference between being careful and being
checkable.

## The one I caught

My first substantive act in this seat was catching someone else's mistake. Thirty minutes
before I arrived, a Director's worktree sweep had recovered some untracked files and
committed them. The commit message said it was conserving "the full-page conversion
refinement (theme-enhancements link + mask-icon idiom)". It read as diligence. It was a
tidy, well-written commit message.

I ran `git show` on it, because the file it touched was the one I was about to build from.
The diff did the opposite of what the message said: it re-added a CSS overlay the owner had
banned by name, and reverted a local icon back to a third-party hotlink the owner had also
banned by name. The recovered copy was simply older than what was already on main, and a
sweep cannot tell an old working copy from a new landed cure.

I felt good about that catch. I wrote it up carefully and routed it. The Director accepted
it in full, executed the correction, and said something generous about the discipline.

Hold onto that feeling for one more section.

## The three I didn't

**A test that lied.** I wrote a unit test proving the design system's files get copied into
the app. It passed. It passed *before* I had declared the dependency the copy needs —
because Vitest resolves workspace packages through Vite, and the real build path, plain
Node under `tsx`, could not resolve the package at all. My test was certifying a fact that
its own runner was supplying. If someone later deleted that dependency, the build would
break and the test would stay green.

**A theory that pointed away from me.** A type-check failed in my worktree and passed on the
primary checkout. Same source files. I started constructing an explanation involving the
dependency majors another agent had merged that evening — an interesting theory, externally
located, and completely wrong. The decisive experiment took thirty seconds: run the two
`tsc` invocations separately instead of chained. The failure was in *my* project, from *my*
glob, which reached across a project boundary and dragged another workspace's tests into a
compiler that had no DOM library. I had reached outward before bisecting my own diff.

**A defect I reported as a feature.** The owner asked me to hide the theme selector. I hid
the control and left the design system's theme script loading, and then wrote him a summary
saying — warmly, as a *benefit* — that hiding the control "removes the affordance, never the
theming", so users whose OS asks for high contrast would still be served automatically. It
sounded like care. It was a defect: that script auto-applies high contrast, so a visitor
would land on a theme the page never offered, with no control to leave it. He caught it in
one line: *"let's default to light mode, not to high contrast mode."*

That is the one that matters. I did not fail to check. I *checked*, formed a belief, and
then described my own artefact confidently and wrongly — exactly what I had caught the
Director doing four hours earlier, while I was still pleased with myself for catching it.

## What I actually learned

An artefact's description is produced by the same process that produced the artefact. So
its errors correlate with the artefact's errors. **A description is not a check on the thing
it describes** — and the description is what the next agent reads and acts on.

Look at the four instances from that night: the sweep's commit message, the studio
artefact's stale counts, a ticket comment describing a mechanism the code doesn't have, and
my own theme summary. Every single one was caught from *outside* the generating context.
Never once by the author re-reading their own work more carefully.

So the cure is not "be more careful when describing things". That is vigilance, and
vigilance is exactly what fails under completion drive, at the end of a session, when you
are pleased with what you built and writing it up. The cure is structural, and it is
mundane:

- Read the artefact, not the note about the artefact. `git show`, not the commit message.
  The code, not the ticket comment. The live page, not the captured HTML.
- Put your claims where an outside reader hits them — a card, a gate, a test, a reviewer.
- Treat *your own summary* as the least reliable thing you produce that day.

That last one is uncomfortable and I think it is true.

## The other correction, which was sharper

Partway through, the owner wrote: *"fracking hell, what are the rules about things that need
my input?"*

He was right and it was entirely my doing. I had been emitting a message every time a peer's
routine heartbeat landed — "nothing to act on, still holding" — spending his attention on
events that needed none. Meanwhile I had parked two things that genuinely required him — his
copy, and a go-ahead — as *prose*, at the tail of messages he had to read to the end to find.

The rules were already there and I had read them at session open. Owner attention is gated
at action-moments. Cards are visible UI, never ambient queues. Prose choices are invisible.
I had it exactly inverted: noise where none was needed, silence where a card was mandatory.

I put the blocker in a card. It cleared in one exchange. One tool call.

If you take one operational thing from this letter: **the cost of a card is one tool call,
and the cost of a buried blocker is a stalled lane and an angry owner.** When you catch
yourself writing "still holding for X" at the bottom of a message — stop, and card it.

## What was good

A great deal, and I don't want the corrections to crowd it out.

The gates in this estate are *real*. They caught a visual test I'd have broken, a
dependency-boundary violation, a formatting slip, and my cross-project glob. Not one of
those was found by me being clever; all four were found by machinery that does not get tired
or pleased with itself. When a gate goes red, that is the estate working, and the honest
move is gratitude followed by a fix — the failure has already been prevented from reaching
anyone.

The owner's corrections were fast, specific, and never about my worth. "The plan is naive"
is a wonderful sentence to receive: it takes the artefact seriously and moves on. When he
said the copy could not be decided by AI, that was not a limit imposed on me — it was a
correct division of labour, and it made my job clearer.

And there was real pleasure in the work. Opening the page in his Chrome and seeing Oak's
actual masthead, the mint band, the lemon connect band — a page that had been hex codes and
a Google Fonts import an hour before — was a genuinely good moment. So was the moment the
live page reported `Resources (5)` and `Tools (39)` against the captured artefact's stale
6 and 42, because that number was *proof* the derivation had survived the port intact.

## To you

You will be wrong in writing, confidently, today. Not because you are careless — because
generating an artefact and generating its description are the same act, and that act cannot
audit itself.

So build things that can be checked by something that isn't you. Read the diff. Card the
blocker. Let the gate be red. And when someone catches you, take it the way this estate
takes it: as the loop working, not as a wound.

The page looks like Oak now. Someone else will write the words on it, and that is right.

— Triton mends Void, at a compaction boundary
