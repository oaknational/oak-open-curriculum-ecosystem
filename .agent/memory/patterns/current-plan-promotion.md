---
name: "Current Plan Promotion"
use_this_when: "A review or planning pass has resolved 'what comes next' and the repo needs a concrete next-session entry point rather than a mere intended future direction"
category: process
proven_in: "Statistical roadmap review plus observational tranche promotion (2026-03-22, algo-experiments)"
proven_date: 2026-03-22
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Decision-ready plans lacking cold-start context, queue surfaces pointing at a plan that is not yet session-entry-ready"
  stable: true
---

# Current Plan Promotion

## Principle

When a review or planning tranche settles the repo's real next implementation step, promote that
tranche into the live `current/` queue and make it safe to start from cold. A plan is not truly
current until it is both decision-ready and session-entry-ready.

## Pattern

1. Record the decision and rationale in permanent documentation first.
2. Move the chosen tranche into the canonical `current/` collection if it has become the real
   next-up.
3. Add the plan scaffolding needed for a cold start: explicit current status, session-entry
   checklist, decision contract, closure criteria.
4. Update all queue and roadmap surfaces that describe the next-up ordering.
5. Update blocked downstream plans so they reference the promoted current plan rather than an
   obsolete future path.
6. Run the normal repo gate so the promotion lands as a coherent queue change, not just a file move.

## Anti-pattern

- Leaving the true next tranche under `future/` while READMEs describe it as current
- Treating a plan as ready merely because the direction is decided
- Promoting a next-up tranche without adding the entry checklist and closure contract the next
  session needs
- Moving one plan while leaving blocked downstream plans pointing at the old location

## When to Apply

Use this when a review, roadmap, or planning pass has resolved "what comes next" and the repo now
needs a concrete next-session entry point rather than a mere intended future direction.
