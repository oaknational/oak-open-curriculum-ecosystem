---
pdr_kind: governance
---

# PDR-012: Review-Findings Routing Discipline

**Status**: Accepted
**Date**: 2026-04-18
**Related**:
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md)
(new Core contract);
[PDR-010](PDR-010-domain-specialist-capability-pattern.md)
(reviewer classification and invocation — this PDR governs what
happens with the output);
[PDR-011](PDR-011-continuity-surfaces-and-surprise-pipeline.md)
(findings that become surprises enter the same pipeline).

## Context

Reviewer systems produce findings. Plans produce unaddressed items.
Both are open obligations with no automatic home. If they are not
explicitly routed to a named destination, they become **smuggled
drops** — concerns that disappeared into chat history, a
resolved-looking summary, or a vague "we'll come back to that"
without anyone owning the return.

Four distinct failure modes observed:

1. **Review findings treated as advisory rather than binding**. A
   specialist reviewer surfaces 12 findings; the implementer mentions
   them in passing and closes the lane; three months later a
   disproportionate fraction of those findings remain unaddressed,
   not because they were rejected but because no lane owned them.
2. **Unplanned items parked without triggers**. A scope analysis
   surfaces 14 in-scope items. Five land in active work, three are
   rejected as out-of-scope, six are "parked for later" without any
   criterion for when "later" becomes "now" — they drift into
   indefinite backlog.
3. **Leading reviewer prompts narrow the finding surface**. A prompt
   like "does the proposed approach look sound?" invites validation
   on the proposal's own framing; reviewers return agreement with
   the implicit answer rather than orthogonal concerns. The review
   appears positive while real issues remain unraised.
4. **Plans reviewed only at the code stage**. Architectural problems
   in the plan surface during code review when rework is expensive.
   The plan review opportunity — where specialist reviewers could
   challenge the plan's premises before any code exists — is not
   exercised.

Underlying cause: reviewer output and planning output both create
obligations whose natural fate is disappearance unless explicit
routing discipline captures them. Discipline at three points —
**prompting**, **timing**, and **routing** — closes the three leaks.

## Decision

**Every reviewer finding and every unplanned item has exactly one of
three outcomes: actioned now (with edit cited), attached to a named
owning lane (with scheduled edit and promotion trigger), or
explicitly rejected (with written rationale). There is no fourth
outcome. Reviewer prompts are non-leading by design. Plan review
precedes implementation review.**

### The three-outcome routing rule

Every reviewer finding, and every item surfaced by scope or
assumption analysis, resolves to one of three states:

| State | Requires |
|---|---|
| **ACTIONED** | The exact edit location (plan / code / ADR / PDR); verified applied. |
| **TO-ACTION** | A named owning lane + specific scheduled edit + promotion trigger (if the lane is `future/`). |
| **REJECTED** | Written rationale citing the principle being upheld. |

"Deferred as a follow-up" without an owning lane is a smuggled drop
and is not a permitted state. "Noted" without an explicit action is
a smuggled drop. "Maybe later" is a smuggled drop.

### The findings register

After every reviewer matrix run, the implementer builds a findings
register that accounts for every returned finding. The register lives
in a durable artefact (the executable plan, a session report, a PDR's
closure notes) — never in chat or a session-only note. Future
sessions verify against the register to check that TO-ACTION items
actually landed in their named lanes.

### Non-leading reviewer prompts

A reviewer prompt has three jobs and the third is load-bearing:

1. **Ground the reviewer** with enough self-contained context that
   they can read the artefact cold.
2. **Frame the review lens** for their specialism.
3. **Pose open questions** that let the reviewer tell us what they
   see, not agree with what we already believe.

Leading prompts ("does the proposed approach look sound?") narrow
the finding surface. Open prompts ("what do you see?") widen it. The
rule: never include your proposed answer in the question.

### Pre-implementation plan review

Complex implementation work is reviewed by specialists at the **plan
stage**, before any code exists. Plans that introduce new data
sources, new MCP surfaces, new boundaries, new cross-workspace
dependencies, or significant architectural commitments get a
reviewer pass on the plan file. Findings that would have been
expensive rework at code-review time are absorbed into the plan
instead.

### Promotion triggers for `future/` lanes

Every `future/` plan carries a **named, testable promotion trigger** —
a concrete event or piece of evidence whose occurrence promotes the
plan to `current/` or `active/`. Examples of real triggers:

- "When retrieval latency on queries of type X exceeds 500ms p95"
- "When a second receiving repo reports the same drift pattern"
- "When the deprecating upstream API reaches its sunset date"

A `future/` plan without a trigger is a zombie backlog item. The
trigger is what distinguishes work we are deliberately deferring
(with criteria for resuming) from work we are hoping will go away.

## Rationale

**Why no fourth outcome.** The three-outcome rule closes the
smuggled-drop failure mode by making every finding or unplanned item
end in a named state. Adding a fourth state (e.g. "deferred") opens
the leak again: "deferred" becomes the bucket where things go to
disappear. The discipline works only because the three states are
the only three.

**Why written rationale for REJECTED.** A rejection without
rationale is indistinguishable from a drop. Writing the rationale
forces articulation of the principle being upheld; it also creates a
citable record when the same finding recurs later.

**Why non-leading prompts.** Leading prompts narrow the finding
surface by pre-supposing the answer. The specialist reviewer adds
value when exposing what the author cannot see; asking the reviewer
to validate what the author already believes eliminates that value.
Two reviewer rounds on related questions with different prompt
framings produce qualitatively different finding surfaces — the
non-leading framing widens the surface.

**Why plan review precedes code review.** Architectural errors in
plans are cheaper to fix as plan edits than as code rework. A
specialist pass at plan stage catches premise errors, boundary
mistakes, and scope overextension before the code exists. Plan
review does not replace code review; it complements it at a
different cost point.

**Why promotion triggers.** A plan that sits in `future/` without a
trigger is a perpetual deferral. Writing the trigger forces the
author to name what would actually cause the work to be important
enough to prioritise — exposing plans that are wishful thinking from
plans that are genuinely time-conditional.

Alternatives rejected:

- **Findings as advisory unless marked urgent.** Allows drift; urgency
  is subjective; everything ends up non-urgent.
- **Single open-backlog list for everything.** Collapses the three
  states; the backlog absorbs drift without distinction.
- **Review only at code stage.** Misses the plan-stage cost
  advantage; produces expensive rework.

## Consequences

### Required

- Every reviewer finding resolves to ACTIONED, TO-ACTION, or REJECTED.
- Findings registers are durable artefacts, not session-only notes.
- Reviewer prompts are non-leading; open questions, not suggestive
  ones.
- Every `future/` plan names a promotion trigger; items without
  triggers either get triggers added or are absorbed into a `current/`
  plan or rejected.
- Plans that introduce new surfaces, boundaries, or architectural
  commitments receive specialist review at plan stage.

### Forbidden

- "Deferred without a lane" as a finding status.
- "We'll come back to that" as a closure statement.
- Leading prompts that include the proposed answer.
- `future/` plans without a named, testable promotion trigger.

### Accepted cost

- Writing rejections takes effort. The payoff is the citation record.
- Naming promotion triggers for future plans takes effort. The payoff
  is honest prioritisation.
- Non-leading prompts take more drafting effort than quick-and-dirty
  leading ones. The payoff is orthogonal findings.

## Notes

### Host-local context (this repo only)

The Practice-governance patterns this PDR absorbs, with file paths
preserved as proven instances:

- `.agent/memory/active/patterns/findings-route-to-lane-or-rejection.md` —
  proven in Sentry L-0b reviewer findings register (commit `d08c6969`).
- `.agent/memory/active/patterns/nothing-unplanned-without-a-promotion-trigger.md`
  — proven in observability strategy restructure (commit `2319a614`),
  fourteen items each absorbed into current/ or future/-with-trigger.
- `.agent/memory/active/patterns/non-leading-reviewer-prompts.md` — proven
  in Sentry maximisation pivot, two reviewer rounds with different
  framings.
- `.agent/memory/active/patterns/pre-implementation-plan-review.md` — proven
  2026-04-10 (7 blocking findings) and 2026-04-11 (12 findings
  resolved at plan stage).

These instance files remain in place with `related_pdr: PDR-012`
frontmatter linking them to this general abstraction.
