# Nothing Unplanned Without a Promotion Trigger

**Type**: Transferable Pattern
**Origin**: oak-open-curriculum-ecosystem (2026-04-18)
**Related**: `findings-route-to-lane-or-rejection.md` (the review-layer
sibling)

## Summary

Every unplanned work item identified in scope-spanning analysis must be
absorbed into a plan with explicit lifecycle placement. `current/` (MVP)
plans carry acceptance criteria; `future/` plans carry a **named,
testable promotion trigger** — a concrete event or piece of evidence
whose occurrence would promote the plan to `current/` or `active/`.
Items parked "for later" without triggers are smuggled drops.

## Problem

Gap analyses and scope-spanning audits surface N unplanned items. The
tempting outcome is a "future enhancements" or "nice to have" block
listing them. This functionally drops them — no future session has a
cue to pick them up, no trigger event to notice, no owner obligated to
re-raise the item. Backlogs grow; items rot; the analysis that
identified them becomes a one-time observation rather than an ongoing
commitment to the work.

## Key Moves

### 1. Every unplanned item routes to one of four outcomes

- **Actioned now** (in existing active plan with acceptance criterion).
- **MVP** (new `current/` plan with acceptance + dependencies).
- **Future** (new `future/` plan with named promotion trigger).
- **Rejected** (written rationale naming the principle upheld).

No fifth outcome. No unnamed backlog.

### 2. Promotion triggers are testable

A valid trigger:

- Names the event or evidence: "when the first LLM-calling tool lands";
  "after thirty days of baseline traffic data"; "when cross-system
  debug session surfaces the correlation gap."
- Can be checked by a future session without re-deriving the author's
  intent.
- Implies or explicitly names an owner who would notice.

Invalid triggers:

- "When time allows."
- "When it feels right to revisit."
- "Someday post-launch."

### 3. Triggers surface structural gaps

The exercise of naming a trigger often reveals that an item has no real
owner, no real event that would promote it, or no real evidence that
would matter. That is useful information. Items with no identifiable
trigger are often speculation dressed as plans; they should be
rejected with a written rationale rather than parked.

## What This Unlocks

- **Falsifiable planning state**: a future session can grep the
  `future/` directory, check each trigger against current reality, and
  either promote or confirm-still-deferred. No ambiguous rot.
- **MVP vs post-MVP becomes clear**: items that cannot find a post-MVP
  trigger often turn out to be MVP (the author had been hiding scope).
  Conversely, items the author intuited as MVP sometimes have natural
  post-MVP triggers that justify deferral.
- **Structural gaps visible**: an item with no owner, no event, and no
  evidence test is a signal — the work is either premature, redundant,
  or genuinely unreachable at this time. All three are better surfaced
  than parked.

## Evidence

**Origin session (2026-04-18)**. A gap analysis across the project's
observability capability surfaced fourteen unplanned items. Initial
attempt: list them as "future enhancements worth doing someday."
Owner correction: "By the end of this exercise nothing on the above
list should be unplanned, it should exist as at least a well defined
bullet in a parent plan." Applying the routing discipline:

- Three items had unambiguous triggers tied to other concrete work
  landing — easy.
- Four items had triggers tied to operational maturity events
  (baseline data collected; cost pressure observed) — these were
  planning-level, not speculation.
- Three items had triggers tied to prior dependencies landing — these
  naturally sequenced.
- Two items turned out to be MVP, not future — the trigger analysis
  revealed the owner-priority.
- Two items split: one became MVP scoped narrowly; one's broader
  scope became future with an exploration-led trigger.

Without the trigger discipline, most would have been parked as "maybe
later" items and drifted.

**Prior instance (sibling pattern)**:
`findings-route-to-lane-or-rejection` (origin 2026-04-17) applies the
same "no smuggled drops" principle to reviewer findings.

## Adoption

For receiving repos:

1. After any gap analysis, audit, or quarterly review, refuse to write
   a "future enhancements" block without named triggers.
2. When a trigger cannot be identified, pause before parking — consider
   whether the item is speculation that should be rejected with a
   written rationale instead.
3. Review `future/` plan directories quarterly: for each plan, check
   the trigger and ask "has this fired?" If yes, promote. If the
   trigger is vague, rewrite it.

Scales with plan volume — cheap for small portfolios, load-bearing
for large ones.
