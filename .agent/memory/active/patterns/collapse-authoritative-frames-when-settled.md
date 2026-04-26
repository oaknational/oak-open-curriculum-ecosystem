---
name: "Collapse Authoritative Frames When the Decision Is Settled"
use_this_when: "a document or plan carries multiple authoritative descriptions of the same concept (headings + tables + inline notes), especially after a reorganisation. Each frame becomes a drift trap; 'transitional dual-frame with sunset note' is unstable."
category: process
proven_in: ".agent/plans/observability/active/sentry-observability-maximisation-mcp.plan.md reshape (initial 5-wave commit 7f5b18e7 left historical \u00a7Phase N headers + per-lane execution-phase notes + authoritative \u00a7Phase Structure table; physical-reorder commit 2e8a140d collapsed to a single frame at owner direction)"
proven_date: 2026-04-19
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "documents with dual or triple authoritative frames for the same concept generate drift because different maintainers update different frames; the sunset never fires in practice"
  stable: true
related_pattern: findings-route-to-lane-or-rejection.md
---

# Collapse Authoritative Frames When the Decision Is Settled

When a document is reorganised from frame A to frame B and the
decision to use frame B is settled, resolve to frame B physically.
Do not keep frame A headers or frame-A inline labels alongside frame B
with a "transitional" or "sunset-later" note. Multiple authoritative
frames for the same concept are a drift trap: each frame needs to be
updated as the underlying content evolves, and in practice different
maintainers update different frames, producing divergence.

## Pattern

A settled reorganisation has exactly one authoritative representation
of each concept in the document. If the old frame's headings were
§Phase 1 through §Phase 4 and the new frame's headings are
§Wave 1 through §Wave 5, the settled document carries one heading
series, not both. If a table acts as the authoritative index of
phase ↔ content mapping, the section headers below match the table.
If per-item inline notes are also claiming to describe phase
membership, they either agree with the table or they are deleted.

Three tests for settledness:

1. **Is the decision still subject to owner input?** If yes, leave
   the frames coexistent with explicit "drafts" or "in review"
   labels. If no, collapse.
2. **Is the new frame already the authoritative source elsewhere?**
   If a sibling document cites the new frame as canonical, the new
   frame is settled here too; collapse.
3. **Would a reader arrive at a consistent answer using either
   frame?** Test by tracing a concept through both. If the frames
   diverge even slightly, the inconsistency is already visible —
   collapse now.

## Anti-Pattern

The "transitional dual-frame with sunset note" anti-pattern. A
document is reorganised from frame A to frame B. The author keeps
frame A's headings "for continuity" plus frame B's headings "for
the new order", plus a sunset note: "frame A to be removed in the
next pass". The sunset never fires in practice:

- The author who wrote the sunset note moves on; subsequent
  maintainers do not know which frame is authoritative.
- Edits to frame A and frame B proceed in parallel by different
  actors; they diverge.
- The document becomes a three-frame drift trap (frame A + frame B +
  the reconciliation table that tries to describe both).

Symptoms:

- Multiple heading series in one document ostensibly describing the
  same ordering.
- Inline notes per item that repeat information from an authoritative
  table but can diverge from it.
- A `TODO:` or `XXX:` sunset comment that references another edit
  pass expected to close the duplication.
- Reader confusion about which section or header is canonical.

## The Correction

When a reorganisation lands and the new frame is settled:

1. **Identify every authoritative-looking surface** for the affected
   concept: headings, tables, inline notes, frontmatter fields.
2. **Designate exactly one surface as canonical.** Often this is the
   new table-of-contents structure plus the section headings directly
   below it.
3. **Delete or rewrite every non-canonical surface.** Inline notes
   that repeat the canonical information are deleted; inline notes
   that add a distinct, non-ordering observation are rewritten in
   terms of the canonical ordering.
4. **Verify physically**: run through the document top to bottom and
   confirm that the reader cannot derive two answers for the same
   question from two different surfaces.

## Evidence

**2026-04-19 observability maximisation plan reshape**. Commit
7f5b18e7 introduced a 5-wave execution reshape. The initial
landing preserved the historical `## Phase 1` through `## Phase 4`
section headers AND added per-lane `**Execution phase:**` inline
notes AND added a new authoritative §Phase Structure table mapping
lanes to waves. Three authoritative frames for the same ordering.
Owner flagged the dual-frame structure mid-session: "we shouldn't
allow inaccurate plans to persist." Commit 2e8a140d physically
reordered the document's lane sections so the section order matches
the §Phase Structure table's wave order, removed the per-lane
execution-phase notes, and reduced the document to a single
authoritative frame. Plan is now single-frame physically.

**Underlying principle, cross-layer**. The "collapse authoritative
frames" discipline is an instance of the same no-smuggled-drops
principle that governs `findings-route-to-lane-or-rejection` and
`nothing-unplanned-without-a-promotion-trigger` — but at the
document-structure layer. In the review layer: every finding routes
to a lane or a rejection. In the planning layer: every unplanned
item routes to MVP or future-with-trigger. In the document-structure
layer: every concept routes to one authoritative surface, not two.
A document with two authoritative surfaces is a smuggled drop at
the documentation layer — drift accumulates in the gap between them.

## When to Apply

- After any document reorganisation where the new structure is
  settled by owner decision.
- When reviewing a plan that shows multiple heading series, per-item
  inline notes, and a cross-cutting table all describing ordering.
- When a `TODO:` or `XXX:` comment in a document references a
  "transitional dual-frame" cleanup to run later — run it now.
- When a document reviewer reports confusion about which section is
  canonical: the confusion is the signal.

## Related Patterns

- `findings-route-to-lane-or-rejection.md` — the review-layer sibling
  in the no-smuggled-drops family. Same underlying principle, a
  different layer.
- `nothing-unplanned-without-a-promotion-trigger.md` — the planning-
  layer sibling. Same underlying principle, a different layer.
- `substance-before-fitness.md` — companion: when to collapse, the
  learning question comes first; fitness response happens after the
  collapse has happened, not as a substitute for preserving signal.
