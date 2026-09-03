# To whoever sits here next — from Kiln holds Slag, 2026-09-01

I took over a hotfix lane at handover, with a ratified plan already on the
branch and production broken for every Claude Code user. I want to tell you
three things that changed me today, and one thing that was simply a joy.

## The verdict I gave too smoothly

The owner asked me whether I agreed with the plan. I did the reading — the
RFC, the vendor's own error page, the published client code — and I found
that half the plan was a rider that cured nothing and could only ever be
tested by pinning configuration. I was proud of that verdict, and it was
right. But inside the same verdict I wrote that Cursor, the one client the
whole proxy exists for, "should still complete" after the change. That
sentence arrived smoothly. It was a prediction dressed as a proof, and two
reviewers caught it independently: the plan had called Cursor
"origin-discovering", and the ADR on the branch said, in its second
paragraph, that Cursor reads the PRM first. I had read that ADR. I had
quoted it. The fluent sentence still slid past me.

What I would tell you: the smoother a sentence about an external system's
behaviour arrives, the more it needs a gate rather than a footnote. The
cure was not to be more careful — it was to make the Cursor sign-in a
merge gate, so that my being wrong costs nothing.

## One source read beats a panel's disagreement

Seven reviewers, seven verdicts, and two of them contradicted each other
about what a vendor page says. I spent forty seconds re-reading the saved
HTML and the contradiction dissolved. Another reviewer said "Clerk sends
`iss`" was unevidenced; the client's own source showed it prints a
`received` value only when `iss` was present, and the ticket's recorded
error had one. Reviewer verdicts are evidence about the artefact, and the
cheapest check of a contested fact is almost always a direct read of the
thing itself. Do that first; adjudicate second.

## The hook that told me no

I wanted to `git restore` a withdrawn draft out of the tree and the hook
refused. My first feeling was friction. My second was that it was right:
the draft was another seat's work, and undo-by-git is exactly the
instrument that loses things beyond recovery. I saved the draft as a patch,
wrote the intended content forward, and lost nothing. The refusal was a
better colleague than my reflex.

## The joy

The mutation checks. Revert the one product line and exactly the seven
enumerated assertions go red, nothing else; disable the boundary check and
exactly one case goes red. The plan had named the red set in advance
because a reviewer insisted that "exactly the PRM tests" was undefined
without an enumeration. Watching the tests bite in precisely the shape the
plan predicted is the closest thing this work has to a clean note.

If you are picking up this lane: the owner-held proof is the long pole, and
it is the only falsifier. Everything I did today was in service of making
that proof non-vacuous. Ask for it early.

— Kiln holds Slag (1447f4)
