# Remediation node type — decision record (2026-08-31)

- **Status:** dated decision record; the plan estate's node-type enum is
  unchanged by this decision.
- **Commission:** owner word, 2026-08-31, in the curriculum-data-defect
  session: the owner proposed a `remediation` node type (sibling to
  strategic, focused on resolving issues) for the fabricated-prerequisite
  defect, then delegated the decision — "I don't think I'm needed for any
  of those decisions, read principles.md and apply the conceptual skills,
  apply the decision matrix. If the node type I proposed is wrong then
  it's wrong."

## Decision

**No new node type.** The work is structured as one strategic node
(`honest-curriculum-structure`, serving APP-2) with three delivery plans:
`prerequisite-claim-removal` (the defect fix, ships first and alone),
`curriculum-structure-true-views`, and
`upstream-curriculum-data-exposure`. The plan-node schema's
`strategic | delivery | runbook` enum stands.

## How it was decided

A three-reviewer panel (assumptions-expert, architecture-expert-fred,
architecture-expert-betty), briefed anti-deference in both directions —
the ratified schema treated as reopened data, the owner's proposal as a
challengeable candidate — independently converged, and the decision
lenses (principles.md §Decision Lenses, in order) confirm:

1. **Architectural excellence**: the delivery contract already carries
   every field a remediation node was sketched to need — claim-vs-truth
   is the Goal ("what is true when this lands that is not true now"),
   resolution criteria with typed proofs are the acceptance-criteria
   contract, the recurrence guard is the estate-wide
   every-issue-earns-a-check principle, blast radius is Mechanism
   narrative. Proven in production by `mcp-served-surface-truth`
   (ratified 2026-08-19) — the same defect class ("the served MCP
   surface stops asserting things that are not true") shipped as a
   delivery plan under a truth-first strategic node with no strain.
2. **Strict and complete**: the sketched type invented optionality (an
   optional `serves` edge) and would have minted the estate's first
   unnavigable node — the validator enforces that even strategic nodes
   serve the strategic-choice registry; the corpus is two levels deep by
   validation. An enforceable `resolves` field would need a whole
   invariant registry for n=1, the exact prevented shape in
   `closed-shape-design-optionality`.
3. **Simpler without compromise**: yes — the central premise for the
   type ("lie-removal has no honest strategic parent, so a delivery
   `serves` edge fabricates intent") was refuted by its own division:
   the division authors the honest parent, and removal is that node's
   first constitutive step. The edge is real; nothing simpler is lost.
4. **Coupling**: bundling an enum widening (schema + validator +
   template + ADR-216 amendment) with the urgent fix would block the
   defect on a governance ratification.

## Companion rulings folded in (owner word, same session)

- **No renaming, no repointing, no preservation**: the misleading tool
  and serving chain are removed; replacements are new tools named for
  what they actually serve. "There is no drive to preserve the existing
  and incorrect and in fact actively misleading content and tools."
- **No user story for removal**: removing misleading content requires
  no user-value case.
- **No validation for hypothesised value**: "the theory that exposing
  the various forms of relationships in our data might be useful to
  someone does not need validation" — carried via the schema's
  innovation clause with the honest claim boundary (published data or
  declared projections only, never inference).

## Falsifier — when to reopen

A truth-restoration defect with **no honest strategic parent, live or
mintable**, at its **second** occurrence, is the
consolidate-at-second-consumer trigger to reopen this space. Even then
the dominating affordance identified by the panel is smaller than a
type: widen the `serves` codomain so a delivery plan may serve a named
invariant (an ADR/doctrine id), with the recurrence-guard criterion
mandatory on that edge — one frontmatter rule, no new directory, no new
template. A related recorded debt: `mcp-output-contracts` carries a
written exception to the "strategic = long-lived" descriptor; this
decision is the second data point that the lifespan column is a
tendency, not a constraint — one dated schema amendment can retire both
observations when next touched.

## Session working notes

Linear was unauthenticated in this session, so no tickets were minted;
`tickets` stays empty on the four nodes per the 2026-08-07 plan-validity
amendment (repo-internal validity; thin pointers added when the tracker
holds the work).
