---
name: "Collaboration Directive Decomposition and Layer-Routing"
overview: "Decompose the two collaboration directives (agent-collaboration.md, user-collaboration.md) by shape, routing every unit of doctrine to its single correct layer (PDR / rule / principle / skill / executive-memory / pattern) per the new-rule-vs-pdr-clause classifier, then retire the directives. A doctrine-surface counterpart to the substrate right-sizing keystone: that brief decides WHICH coordination machinery survives; this one decides WHERE each surviving unit of doctrine lives, and removes the two layer-blender surfaces that drift because they predate the PDR corpus that now owns their substance."
status: future
type: developer-experience
specialist_reviewer: "assumptions-expert, docs-adr-expert, onboarding-expert, architecture-expert-fred"
sibling_plans:
  - "collaboration-substrate-coordination-rightsizing.plan.md"
  - "coordination-watcher-canonicalisation.plan.md"
  - "comms-watch-liveness-floor.plan.md"
related_rules:
  - ".agent/rules/new-rule-vs-pdr-clause.md"
  - ".agent/rules/no-tombstones-for-removed-ideas.md"
  - ".agent/rules/practice-core-portability.md"
last_updated: 2026-06-16
isProject: false
todos:
  - id: m1-inventory-and-classify
    content: "M1: Inventory every unit of doctrine in both collaboration directives and classify each by shape through the new-rule-vs-pdr-clause classifier. Output: a routing table (unit -> shape -> target layer -> existing-home-or-new), the first deliverable. No file moves."
    status: pending
  - id: m2-route-the-residue
    content: "M2: For every unit with no existing home, author the destination — PDR clause, new rule, principles.md line, executive-memory entry, or pattern file. Includes the genuinely-homeless residue (owner-signal-interpretation heuristics; threat model; coordination-surface discipline; agents-classify-humans-accept-risk). No file moves yet."
    status: pending
    depends_on: [m1-inventory-and-classify]
  - id: m3-decompose-and-retire
    content: "M3: Once every unit has a single home, decompose and retire both directives (delete, or reduce to thin pointers), updating every referrer (RULES_INDEX, start-right reading order, orientation layer table, cross-refs). Clean break, no tombstones."
    status: pending
    depends_on: [m2-route-the-residue]
  - id: m4-verify
    content: "M4: Verify no collaboration fact lives in more than one place, every former directive claim is traceable to its single new home, no dangling references remain, and both human and AI-agent onboarding paths still resolve. Run portability:check, fitness, markdownlint, relative-link integrity."
    status: pending
    depends_on: [m3-decompose-and-retire]
---

# Collaboration Directive Decomposition and Layer-Routing

**Last Updated**: 2026-06-16
**Status**: 🔵 FUTURE — strategic brief; not promoted to `current/`.
**Activation trigger**: the substrate right-sizing keystone's M2 ratifies
the survival / re-polarisation model (so rehoming targets stable, surviving
units), **OR** the owner prioritises the doc-layer-hygiene axis directly.

---

## Problem and Intent

[`agent-collaboration.md`](../../../directives/agent-collaboration.md) and
[`user-collaboration.md`](../../../directives/user-collaboration.md) are
**layer-blenders**. Each holds, in one prose surface, content of five
different shapes that
[`orientation.md`](../../../directives/orientation.md) §Routing Rule says
must live at different layers and be *referenced*, not *contained*:

- decisions with rationale (shape of a **PDR**),
- always-fired disciplines (shape of a **rule**),
- procedures (shape of a **skill**),
- interpretive context and catalogues (shape of **executive memory**),
- founding patterns (shape of a **pattern file**).

Both directives predate the decision corpus that now owns their substance.
`agent-collaboration.md` cites owner direction of 2026-04-25;
[PDR-056](../../../practice-core/decision-records/PDR-056-inter-agent-collaboration-protocol.md)
and PDR-053 — which decide the protocol and the advisory-not-mechanical
stance the directive narrates — were accepted 2026-05-10. Today there are
101 PDRs. The directives are the *earliest* rendering of a doctrine that has
since been decided properly elsewhere, and a rendering that is never
regenerated drifts: the prior session's instinct to "re-sync the directive"
by hand is the drift, not the cure.

This is genuinely new work, distinct from the substrate keystone. The
keystone
([`collaboration-substrate-coordination-rightsizing.plan.md`](collaboration-substrate-coordination-rightsizing.plan.md))
decides **which coordination machinery survives** (keep / fold / delete /
gate, re-polarised by a context predicate). This brief decides **where each
surviving unit of doctrine lives** and removes the two surfaces that hold it
in the wrong shape. The keystone is the design exploration; its own text
says "build, refactor, and deletion plans are authored only after M2
ratifies the target design" — this is one of those downstream plans.

A correction this brief feeds back into the keystone: its M1 inventory
(§4.5 item 2 and §5 of
[`...rightsizing.m1-inventory.md`](collaboration-substrate-coordination-rightsizing.m1-inventory.md))
plans to graduate the new operating-context-mode **into**
`agent-collaboration.md`. By the classifier, that re-commits the blend — the
tiered model is a *decision* (a PDR, carrying the falsifier the predicate
already implies) plus a *firing tripwire* (a rule or skill-gate). Graduating
it into the directive grows the layer-blender it should be dissolving.

## End Goal, Mechanism, Means

**End goal**: no unit of collaboration doctrine lives in more than one
place; both directives are gone (or reduced to thin pointers); every claim
they once carried is traceable to a single canonical home of the correct
shape; and a reader arriving at any layer finds exactly what that layer is
for.

**Mechanism**: the directives accreted because prose has no shape-discipline —
any sentence can sit beside any other regardless of whether it is a decision,
a tripwire, or a procedure. Routing each unit through the
[`new-rule-vs-pdr-clause`](../../../rules/new-rule-vs-pdr-clause.md)
classifier forces the shape question per unit and assigns exactly one home.
Once every unit has a home, the directive has no residual job and can be
deleted — and there is no prose surface left to drift, because the canonical
homes are the ones agents already read at their structural moments.

**Means (strategic moves — exploration and refactor, not new doctrine
invention)**:

- **M1 — Inventory and classify.** Enumerate every unit in both directives.
  Run each through the classifier; record shape, target layer, and whether
  an existing home already owns it (first-matching-home; no duplication).
  The routing table is the deliverable and makes "what excellent looks like"
  enumerable. First-hand decomposition already exists for both directives in
  this thread's analysis and seeds the table.
- **M2 — Route the residue.** For every unit with no existing home, author
  the destination. The genuinely-homeless residue identified so far:
  - owner-signal-interpretation heuristics (read silence / reframe / pause) →
    **executive memory** (interpretive context, not a falsifiable contract);
  - the threat model (trusted-agents / advisory / don't-harden-surface-to-owner) →
    a **clause on PDR-056** (it bounds the protocol's scope and names its own
    falsifier);
  - coordination-surface discipline (ground each mechanism in observed need;
    widen the audit before adding a surface) → a **rule** (or a clause on
    `consolidate-at-third-consumer`), because it fires at an authoring moment;
  - "agents classify risk; humans accept risk" → a **principles.md** line or
    its own PDR if PDR-025 does not already imply it.
- **M3 — Decompose and retire.** With every unit homed, delete the directives
  (or reduce to thin pointers) and update every referrer: `RULES_INDEX.md`,
  the `start-right-quick` reading order, the `orientation.md` layer table,
  and all cross-references. Clean break, no tombstones
  ([`no-tombstones-for-removed-ideas`](../../../rules/no-tombstones-for-removed-ideas.md)).
- **M4 — Verify.** Prove the invariant holds (below).

## Domain Boundaries and Non-Goals

- **Not the substrate keep/fold/delete decision.** Which coordination
  machinery survives is the keystone's M2. This brief rehomes survivors;
  units the keystone deletes are simply not rehomed.
- **Not the watcher mechanism.** Watcher canonicalisation, the
  `coord how-to-start` CLI, multi-surface watch, and rehoming the
  *watcher reference doc's* doctrine are owned by
  [`coordination-watcher-canonicalisation.plan.md`](coordination-watcher-canonicalisation.plan.md).
  This brief generalises the same rehome-by-shape pattern to the two
  *collaboration directives*, not the watcher doc.
- **Not the liveness/heartbeat primitive.** Owned by
  [`comms-watch-liveness-floor.plan.md`](comms-watch-liveness-floor.plan.md).
- **Not building the SessionStart auto-arm.** The insight that must-always-run
  mechanism (watcher / heartbeat / identity) should be *armed by the platform,
  not remembered by the agent* is real, but it is a mechanism extension that
  routes to the two watcher/liveness plans. This brief owns only the
  **doctrine consequence**: once mechanism is auto-armed, doctrine stops
  *prescribing* it as agent First Moves — and that rehoming coordinates with,
  rather than blocks on, the mechanism work.
- **Not inventing new collaboration doctrine.** Every unit either has an
  existing home or gets the minimal correct one. M2 mints a new home only
  when no existing surface can own the unit by amendment.

## Dependencies and Sequencing

| Dependency | Classification | Note |
| --- | --- | --- |
| Keystone M2 (survival / re-polarisation ratified) | **beneficial** | M2's keep/fold/delete verdicts tell us which units to rehome vs ignore. Shippable without it by classifying independently and rehoming only units not at risk of deletion; final rehoming reconciles against M2. The layer-hygiene correction (operating-context-mode → PDR+rule) feeds *into* keystone M2. |
| [`new-rule-vs-pdr-clause`](../../../rules/new-rule-vs-pdr-clause.md) | **blocking** | The routing mechanism. M1 is undefined without it. Present and stable. |
| `coordination-watcher-canonicalisation` content-migration pattern | **beneficial** | Worked precedent for rehoming doctrine off a wrong-shaped surface; this brief reuses its shape. Independent file scope (directives vs watcher doc). |
| 101-PDR corpus, the rules corpus, `orientation.md` layer table | **beneficial** | The existing-home set M1 classifies against. |

Sequencing within the plan is internal (M1→M2→M3→M4) and finalised at
promotion; M3 (the only destructive move) is gated behind M2 completeness
so no unit is deleted before its home exists.

## Strategic Acceptance Criteria and Success Signals

- A complete routing table exists: every unit of both directives mapped to
  shape, target layer, and a single home — with zero units routed to two
  homes.
- Every genuinely-homeless unit has a recorded destination and the rationale
  tied to its shape.
- Both directives are deleted or reduced to thin pointers; no referrer points
  at vanished content.
- **Primary signal**: a `grep` for any former directive claim finds it in
  exactly one canonical surface of the correct shape — and an agent reading
  that layer finds only content that belongs there.
- **Secondary signal**: the keystone's M2 graduates the operating-context-mode
  to a PDR + rule (not into the directive), confirming the layer-blend habit
  was corrected rather than perpetuated.
- **Tertiary signal**: the next collaboration-doctrine insight lands at its
  shape's home on the first try, because there is no longer a catch-all
  directive to absorb it.

## Risks and Unknowns

- **Churn against a moving substrate.** The keystone and live agents edit the
  same doctrine; M1's classification and M3's referrer-updates must be
  re-derived against the tree at promotion, not frozen now.
- **A unit that genuinely fits no existing layer.** If M2 finds a unit that is
  neither decision, tripwire, procedure, context, nor pattern, that is a
  signal the layer model is incomplete — an owner-facing escalation, not a
  silent new directive.
- **Onboarding-path breakage.** Both directives sit on grounding-reading
  orders; retiring them without updating `start-right` and the onboarding
  flows would strand newcomers. M4 verifies both human and AI-agent paths;
  `onboarding-expert` is a named reviewer.
- **Owner-specific content in a portable tier.** `user-collaboration.md`'s
  Owner Working Style is owner-specific context sitting in a nominally
  portable directive; its correct home (repo-local / per-user vs executive
  memory) must respect `practice-core-portability` and may be an owner
  decision at M2.
- **The decomposition becomes its own ceremony.** Bias to deletion and to
  existing homes; minting new homes is the exception, sized to unique
  substance, not to the unit count.

## Promotion

This is a strategic brief; M1–M4 are investigation and refactor moves whose
execution shape (single decomposition session, or a sequence of cycles per
target layer) is finalised at promotion to `current/`. Promote on the
activation trigger; record the trigger evidence and the readiness verdict.
The first executable output is the M1 routing table, from which the M2/M3
homing and retirement cycles are authored — never the reverse. Execution
decisions, including the disposition of owner-specific content and the
final keystone-reconciliation, are finalised only at promotion.
