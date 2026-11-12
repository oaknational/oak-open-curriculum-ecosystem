# PDR-132: Changeset health — round budgets bind at authoring time

**Status**: Accepted (owner-commissioned fast-lane 2026-07-20; the owner's
framing: the shaping principle must reach work at planning time, because at
PR time "that is too late to plan work"; amended 2026-09-14 and 2026-09-26 — see
Amendment Log).

## Context

The 2026-07-20 measurement pass over 89 merged PRs (the 2026-07-13 → 07-20
merge window) decomposed ready→merged latency. The corpus and companion
analysis are conserved in the delivering estate's reports surface and
referenced from the delivery record that landed with this PDR — this Core
file stays repo-independent per the portability rule:

- **Review rounds dominate.** Commit count (the cure-push proxy for rounds)
  predicts latency at Spearman +0.63; raw diff size manages +0.25, while
  size→rounds and size→findings associations (both +0.62) are consistent
  with the size effect acting through rounds — an associative reading whose
  caveats (uncontrolled mediator, possible reverse path) the companion
  analysis states. The observed per-COMMIT associations are roughly 35–40
  minutes and ~3 comments (commits proxy rounds; round-level cost
  instrumentation is a named follow-up), and the convergence reading they
  support is that reviews do not converge by attrition.
- **The latency tail is silent waiting, not work.** Of the window's 11
  slowest PRs, 9 went ready in the owner-away evening; the same night
  produced four live silent-wait instances across three state classes: an armed auto-merge sitting
  behind red checks, two PRs whose pushed tips had no reviewer requested,
  and a PR with unresolved threads and no shepherd.
- **Class matters (qualitative).** From named worked instances rather
  than a class-stratified corpus — the evidence CSV carries no class
  field, and the register's class dimension is a named follow-up:
  archival/record PRs (retrospectives, handoff records, coordination
  folds) carry large diffs with low finding density and land fast; code
  and doctrine diffs bind tight.

This record is the authoring-side twin of the estate's merge-mechanics
decision (PDR-131), which established that merge concurrency is free and
quality binds at settled-READY; each record is self-contained and the two
land through different folds. The authoring-side claim here: the round
count a changeset will need is substantially fixed at the moment it is
shaped.

## Decision

1. **The health gate is a round budget, never a size gate: a healthy
   changeset settles in at most two review rounds — every class; the
   archival exemption below narrows only the size warnings.** When a third
   round opens on any PR, the shepherd records budget-exceeded and runs
   the generator question THEN — ahead of the state machine's mechanical
   step-back arms, which remain the failure backstop. After round two,
   every remaining finding is dispositioned in the same turn as the last
   push: over-bar cures ride that push, and the rest are signed
   `Rejected` or `Routed to <home>` lines. On prose-class changesets a
   further push opens only through PDR-140's doors (clause 4's rebudget
   by recorded decision, or clause 4's late-cure push for an over-bar
   finding, which 9(b) states for records-class); code-class changesets
   keep the review-round state machine's budget and step-back arms. The
   owner's word of 2026-09-14: "I don't want the number of rounds of PRs
   to go up".
2. **Size thresholds are authoring-time warnings, never blocks**: more than
   ~300 added lines or more than ~8 changed files each predict a heavy
   review (a changeset's final commit count is the outcome proxy itself,
   not an authoring-time predictor; opening-commit instrumentation is a
   named follow-up) (the measured heavy-review
   probability triples past 300 additions). A changeset crossing them is
   re-examined for hidden second stories before it opens — and may still
   legitimately proceed.
3. **Class-aware application**: archival/record-class changesets are exempt
   from the size warnings but keep the round budget.
4. **The Goodhart caution is part of the doctrine**: gating on size would
   incentivise fragmenting one story into many PRs, moving cost into
   integration. The budget binds on rounds because the only ways to beat it
   are genuinely smaller scope or genuinely better first-pass quality.
5. **Slicing happens at planning time.** Executable plan steps are sliced
   to PR-shaped units when the plan is authored — each step names its
   changeset class and is stateable as a two-round PR, or it is
   under-decomposed. The plan, pr-lifecycle, and start-right skills carry
   pointers here; this record is the single source and the numbers above
   never restate in operational skill text (dated evidence artefacts and
   delivery records may quote them as historical fact).
6. **Silent-wait states are part of changeset health.** After every push
   the expected reviewer is verified REQUESTED on the new tip; after every
   arm the checks are verified green-or-progressing; every open PR names a
   shepherd. A PR in a state nobody is watching is unhealthy regardless of
   its diff.
7. **A pull request's cost has a flat part, so the optimum slice is well
   above one line.** Every pull request pays a fixed cost whatever its
   size: a branch and its worktree, a claim, a gate run, a
   continuous-integration run, the reviewer legs, the records and
   deletions after merge, and a landing turn where the default branch
   requires currency. Complexity-based cost then rises steeply. The fixed
   part dominates a tiny change, so effort per unit of value is lowest at
   a moderate slice, not the smallest one. Slices are sized to that
   optimum: changes that share one story travel as one pull request, with
   item 2's size warnings still applying, never one pull request per line
   or per register row. Item 4's caution
   still binds: the optimum is found by story, never by fragmenting one
   story or by bundling two. The owner's word of 2026-09-26: "there are
   flat costs that dominate for tiny PRs, and while complexity based cost
   rises exponetially with complexity, the fixed cost suggests that there
   is an optimum in the effort to value curve that is well above a single
   line change".

## Prediction and falsifier

Stated as an expected-observable-effect plus falsifier pair, the form the
estate's two-speed-learning discipline (PDR-130) requires of enacted
doctrine; the pair below is self-contained. Prediction: with plan-time slicing and the round budget loaded, the
median rounds-per-PR (all classes) for PRs born after this lands falls
within one month; the class-stratified read is additive once the
register's class dimension lands. Measurement: re-run the delivery
corpus methodology (per-PR
commits, review threads, and latency over the trailing window) at the
one-month mark; the pr-throughput register gains commits-per-PR and
changeset-class dimensions as the standing instrument — a named follow-up,
not an assumed present capability. Falsifier: if the
median does not fall, or plan-time slicing produces fragment-PR churn whose
integration cost exceeds the round savings, the plan-skill slicing
requirement reverts to advisory and this record says so in a dated
amendment.

## Consequences

- `plan` SKILL: PR-shaped-units requirement in §Requirements for All
  Non-Trivial Plans (pointer form).
- `pr-lifecycle` SKILL: round-budget expectation note in the review-round
  state machine; silent-wait verification legs in Phases 6 and 7; Phase 1
  changeset-shape check (pointer form).
- `start-right-team` SKILL: this record joins the foundation reading.
- `design-work-for-small-prs` rule: the lower bound of item 7 (pointer form).
- The falsifier's measurement is the corpus-methodology re-run above; the
  register's added dimensions are the standing instrument once landed.

## Amendment Log

### 2026-09-14 — the number of review rounds per pull request does not go up

Owner word (2026-09-14, 15:15Z, spoken to the Director in chat; the closure
record's item 100 records it as "the number of review rounds per pull request
does not go up"), as the Director carried it to the Implementer seat: "I don't
want the number of rounds of PRs to go up." Applied from the next pull request
on (2b-ii slice A1, pull request #81; the closure record's item 100): the
two-round budget of Decision 1 binds as written; after round
two every remaining finding is dispositioned in the same slot turn as the last
push — a trivial cure rides that push; everything else is a signed Rejected
line carrying its rationale or its routed home; a round three is a Director
call on a correctness defect only. The slice size the closure measured over
sixteen pull requests (about eight claims per slice, the closure record's
item 92) stands as an operating default and changes no threshold in
Decision 2 (owner card, 2026-09-14, about 15:20Z: "the item 92 sizing stands as
an operating default with no PDR-132 text change").

### 2026-09-26 — a pull request's flat cost puts the optimum slice above one line

Owner word (2026-09-26, to the Director, after merging thirteen small pull requests in OCE
by hand in fifteen minutes), verbatim: "Perhaps we need to update our cost model for
PRs, there are flat costs that dominate for tiny PRs, and while complexity based cost rises
exponetially with complexity, the fixed cost suggests that there is an optimum in the effort to
value curve that is well above a single line change". The Director's ruling of the same hour
sized slices to that optimum, with changes that share a story going as one pull request, and
made it this record's text. §Decision item 7 states the flat cost and the optimum it implies;
`design-work-for-small-prs` carries the lower bound as a pointer here. Item 1 now names clause
4's late-cure push for an over-bar finding as the door a further push opens through, where it
named clause 9(b), which binds records-class only.
