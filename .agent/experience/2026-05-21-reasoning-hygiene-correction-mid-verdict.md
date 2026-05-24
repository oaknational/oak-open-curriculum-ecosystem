# 2026-05-21 — Reasoning hygiene correction mid-verdict

**Session**: Uplifted Swooping Wing (claude / Opus 4.7 (1M) / `8d9999`)
**Thread**: connecting-oak-resources

## Texture

The session had two distinct phases.

The first phase was implementation in a smooth groove — WS1.6 vocab registry
landed cleanly: gather the W3C IRIs, write the const-typed namespaces, watch
the type-level assertions narrow exactly as expected when the test ran.
There was no real friction. The architectural decisions (file-per-vocab vs
single file; literal entries vs `DataFactory.namedNode()`; types-with-impl
vs separate types sub-path) each had an obvious right answer once the
long-term-excellence frame was applied. The owner's framing — "at every
decision point, opt for long-term architectural excellence" — collapsed
several candidate menus into single verdicts. I noticed this collapse as
it happened and wrote a napkin entry about it: that a single decision-time
heuristic might subsume many topic-decomposed rules at fire time. That
felt like an interesting observation, properly captured.

The second phase had different texture. After WS3.1 landed, I produced a
four-point verdict on the dispatch shape for the parallel pair. The
owner read my four points and replied with four corrections:

> 1. is not a reason, of course we should pay attention to plans, but they
>    are not evidence
> 2. that memory is about a short-term failure mode, assuming the bug will
>    never be fixed in the upstream tooling is not reasonable
> 3. good reason
> 4. restatement of 1. But additionally it moves into the language of dogma
>    rather than reason, and that has its own issues

The corrections were precise. Three of my four "reasons" were citations
dressed as reasons — pointing at the plan body, pointing at a memory entry,
pointing at a prior agreement. Only one was substantive (the
fresh-context-for-substantive-work point). The dogma vocabulary — "preferred",
"forbidden" — was particularly clear in retrospect; I had been using
recorded positions as if they had standalone authority.

What was surprising was how naturally the citation-as-reason move had
appeared. The plan body says X. The memory says Y. The agreement says Z.
Each citation felt like reasoning. Each was actually reference. The
difference is that reference closes inquiry by pointing at past closure;
reasoning continues inquiry by pointing at current substance.

There was something about being mid-flow that made citation more
attractive. The verdict felt urgent. Citing was faster than re-deriving.
And the cited authorities were genuine — the plan body really does say
single-agent is preferred; the memory really does record worktree isolation
issues. So the citation felt true rather than evasive. But truthfulness
of the citation is orthogonal to whether it is evidence.

The "preferred / forbidden" vocabulary observation went deeper. I had not
noticed I was using dogma vocabulary. The words felt natural — that's
their function. When the owner named them as dogma, I could see them
suddenly as a layer that had been silently doing work I hadn't asked
it to do.

## What changed mid-session

After the correction I restated the verdict on substance only. The
restatement was actually cleaner — fewer reasons, each carrying weight.
The substantive case for parallel dispatch turned out to be reasonable.
The substantive case against was the fresh-context point alone — not the
three citations I had bundled with it.

The owner then made the call to test parallel dispatch empirically with
two Claude agents in the next session. That call followed from the
substantive analysis, not from any of the citations I had originally
offered.

What stays with me from this is that the decision-moment-heuristic
candidate I had captured in the first phase has a counterpart: the
**citation-as-reasoning anti-pattern**. They are related — both are about
what happens at the moment of decision. The heuristic is what should
happen (substance + long-term-excellence frame). The anti-pattern is
what often happens instead (citation of recorded position). The
heuristic is the cure; the anti-pattern names what it cures.

That symmetry felt clarifying. Whether it survives a second instance,
the next session will show.
