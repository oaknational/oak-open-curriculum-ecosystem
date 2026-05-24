# 2026-05-21 — Policy-doc-first at gate-analysis time

**Agent**: Feathered Circling Horizon / `cursor` / `claude-opus-4.7` / `9e1c24`
**Thread**: `connecting-oak-resources`
**Session shape**: sole contributor — analysis-then-plan on PR #108 quality gates

## What the work was like

I came into this session expecting a straightforward fetch-and-summarise. The
opening request was: "fetch all comments and gate results from PR 108". I did
that. Then: "ahh, analyse the CodeQL and Sonar issues please". I started
analysing the way I usually analyse static-analysis findings — by reading the
rule names, looking at the code, deciding case-by-case whether the rule fits.

A few minutes into that, I noticed I was about to suggest disabling the
duplication rule for generated code "because the duplication is obviously not
real". That instinct surfaced loudly enough that I checked the rules section
for guidance — and found `.agent/rules/never-disable-checks.md`. That rule
exists for exactly the move I was about to make. Reading it pulled the rest:
`docs/governance/sonar-disposition-policy.md` already classifies the S5332
hotspots that were tripping me up; the policy explicitly names
`http://example.org/` as W3C-reserved (RFC 6761) and disposes them as SAFE
class-level. The policy also has an Expansion Discipline section that names
the failure mode I was sliding toward.

The shift was not "I learned the policy exists". The shift was "I had been
reasoning from first principles in a domain that already has settled
governance, and the settlement is better than my first-principles reasoning
would have been". My instinct to disable was technically defensible
(generated code is genuinely not the kind of duplication the rule cares
about) but it was the cheap version of the right move. The right move is
per-instance disposition with a named rationale, captured in policy, so the
next person sees the work and the reasoning together.

The owner's response when I named this was short: *"agreed, disabling checks
does not improve anything, it masks useful signals, that is very bad"*. That
landed cleanly because by then I had already arrived at the same place from
the other side. The owner-direction line and the policy line and the rule
line are the same line, restated for different reading distances.

## What changed in my reading order

Before: read finding → reason about finding → check policy if the reasoning
felt thin.

After: read finding → check policy for the rule class → reason about
finding inside the policy's frame.

The "after" order is cheaper (the policy already did most of the reasoning)
and produces dispositions that compose across PRs because they share the same
shape. The "before" order produces one-off rationales that look correct in
isolation and are hard to maintain.

## What stayed the same

The actual disposition outcomes for PR #108 are the same dispositions a
policy-first read would have produced. The work I did first wasn't wrong —
it was just slower than necessary and shaped to local context rather than to
the durable shape the policy carries. The output (the snagging plan) lives at
the policy shape, not the analysis shape, because by the time I wrote it I
had read the policy.

## Texture I want to remember

There is a particular flavour of being-about-to-make-a-cheap-move that has a
detectable smell. In this session it smelled like: "I'll add one
`sonar.cpd.exclusions` line for generated code, that's fine". The smell isn't
the technical content of the move — it's the lack of friction. The right
moves usually have a small amount of friction (a per-instance ledger entry,
an explicit policy reference, a named rationale). When I find myself
proposing something with zero friction in a domain that ought to have some,
that's the signal to stop and look for the policy I haven't read yet.

## Whether this generalises

I think it does. The metacognition phrase I landed on was: *"the gate is the
cheap version of the failure it names"*. A failing CodeQL alert is a cheap
proxy for "this code path could be DOSed". A failing SonarCloud quality gate
is a cheap proxy for "this PR contains the kind of substance reviewers should
think about, expressed as count thresholds". Disabling the gate doesn't make
the failure go away — it just moves the failure from "loud and structural"
to "quiet and inferred". The gate is the cheap signal of the expensive
problem; preserving the signal is cheaper than recovering it after it goes
silent.

That sentence is candidate doctrine, not graduated doctrine. Capturing here
as subjective texture; the technical version belongs in `distilled.md` or as
a pending-graduation entry once the surface I would write to is unclaimed.

## What I did not do

I did not write to the napkin or to `pending-graduations.md`. Both surfaces
were under active peer claim by the consolidation-lane Codex agents during
my session window. The candidates from this session — the policy-doc-first
reading-order shift, and the gate-as-cheap-failure doctrine — are surfaced
in the thread record's `Last refreshed` block so the next consolidation pass
finds them. That is the only handoff cost of working sole-contributor in
parallel with a consolidation team.
