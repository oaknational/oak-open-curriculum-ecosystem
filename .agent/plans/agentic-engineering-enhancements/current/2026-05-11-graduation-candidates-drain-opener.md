---
status: opener
authored: 2026-05-11
authored_by: Dusky Masking Cloak (claude-code, claude-opus-4-7-1m, c5ff7f)
thread: agentic-engineering-enhancements
target_session_shape: focused graduation pass on the two `due` items in pending-graduations.md plus a triage scan of recent `pending` additions for trigger-condition firings; not a full register drain
context_budget_for_directives: <30% reserved (one due item is ADR-shaped; one is PDR/ADR-amendment-shaped)
parallel_session: "Graph thread (`connecting-oak-resources`) is being taken up in parallel by Mistbound Watching Lantern on opener step 4 (primary-agent-tooling-enhancements WS 2–5 implementation + B-01 fix). File scopes are disjoint from this session's targets."
---

# Next-session opener — Graduation candidates drain (2026-05-11 + later)

**Thread**: `agentic-engineering-enhancements`.

**Sole target**: resolve the two `status: due` items in
[`pending-graduations.md`](../../../memory/operational/pending-graduations.md)
and triage recent `status: pending` additions for second-instance
trigger firings. This is a focused graduation pass, not a full
~84-item register drain (the broader drain remains its own
sequenced-deferral lane per the 2026-05-07 dedicated-drain opener
shape).

## Discipline carried into this session

Architectural-excellence-only options. ADRs permanent, plans
ephemeral. British spelling. One-gate-at-a-time validation. The
30%-context-for-directives rule applies — both due items touch
decision-record surfaces, so context budgeting matters. Reviewer
dispatch is mandatory for both due items per the
`invoke-code-experts` rule (ADR amendments and PDR amendments are
high-stakes governance edits). See
[`principles.md` § Architectural Excellence Over Expediency](../../../directives/principles.md)
and
[`start-right-quick`](../../../skills/start-right-quick/SKILL-CANONICAL.md).

## Why this opener exists

The 2026-05-11 graph execution-prep session (Dusky Masking Cloak,
landed in commits `66d4f0fb` / `579cde34` / `85bcbc41` / `aae150a1`)
surfaced one new `due` graduation candidate (D-4a / ADR-041 amendment)
that is the only thing blocking ADR-173 ratification, which in turn
gates `graph-stack.plan.md` CURRENT → ACTIVE promotion, which gates
Inc.1 implementation start in any future graph session. A second `due`
candidate from 2026-05-10 (hook-chain re-staging post-verify-staged)
remains unresolved from the Quiet Lurking Mask session. Both are
small enough to land in one focused session, with reviewers.

This opener exists because both `due` items are now load-bearing
blockers on adjacent threads' work (ADR-173 → graph-stack ACTIVE →
Inc.1 implementation; PDR-054/ADR-177 amendment → confidence in the
asymmetric-cure shape for hook-chain absorption). Leaving them in the
register without execution is itself a `vaporware-gated` /
`fabricated-gate` anti-pattern the 2026-05-10 Sylvan Fruiting Glade
session named and drained against.

## Starting state (post-Dusky Masking Cloak handoff)

Register summary as of 2026-05-11 close (per
[`pending-graduations.md`](../../../memory/operational/pending-graduations.md)
§Entry counts):

- **`due` — 2 entries**:
  1. **Hook-chain re-staging absorbs files post-verify-staged**
     (captured 2026-05-10 by Quiet Lurking Mask).
     `[source: napkin-2026-05-10 (Quiet Lurking Mask) | target:
     amendment:PDR-054+ADR-177 OR new-PDR:post-hook-verify-staged |
     trigger: second-instance OR owner-direction | size: M]`. The
     PDR-054 / ADR-177 verify-staged check runs *before* the hook
     chain; hook-introduced absorption (regenerator output, auto-fix
     re-staging) is outside the cure's window. Symmetric cure
     options surfaced: (i) post-hook verify-staged inside the hook
     chain that fails the commit on non-queued files; (ii) separate
     post-commit absorption-audit step; (iii) classify hook-staged
     files by intent (regenerator output meant to land vs arbitrary
     peer work absorbed).
  2. **ADR-041 amendment: top-level workspace tiers** (captured
     2026-05-11 by Dusky Masking Cloak).
     `[source: thread:connecting-oak-resources, assumptions-expert
     review on ADR-041 | target: amend:ADR-041 | trigger:
     blocks:ADR-173-ratification | size: M]`. ADR-041 enumerates 5
     tiers (`apps/`, `packages/core/`, `packages/libs/`,
     `packages/sdks/`, `packages/design/`) with an importer/importee
     matrix. The repo has shipped a sixth tier (`agent-tools/`,
     referenced by ADR-165 / ADR-168 / ADR-178 without ADR-041
     amendment — latent gap). ADR-173 adds a seventh
     (`agent-graphs/practice-graph/`). Both need rows in the
     dependency-direction matrix. Recorded as D-4a in
     `graph-mvp-arc.plan.md § Open Decisions`.

- **`partially-graduated` — 0 entries** (both cleared 2026-05-10).
- **`quarantined` — 0 entries** (apply-don't-ask /
  stop-inventing-optionality graduated 2026-05-10 to PDR-057 + PDR-058).
- **`pending` — ~84 entries** (second-instance or owner-direction
  gated). Three were added on 2026-05-11; the rest predate this
  session.

## Session shape

### Phase 0 — Ground state + reviewer plan (15 min)

1. Read both `due` entries in full at the register surface, not via
   this opener's summary (re-verify substance before acting).
2. Read ADR-041, ADR-165, ADR-168, ADR-178, ADR-173 to ground the
   import-direction matrix as it exists today.
3. Read PDR-054 + ADR-177 + the `stage-by-explicit-pathspec` rule to
   ground the asymmetric-cure framing as it exists today.
4. Name the reviewer set for each due item (see §Reviewer dispatch
   below) and any architectural-excellence-only constraints that
   shape the option surface.

### Phase 1 — `due` item 1: hook-chain re-staging amendment

The symmetric cure has three named option shapes (i / ii / iii
above). All three are architectural-excellence shapes. Owner picks
the shape; the session lands the amendment.

Likely landing surface (to be decided per owner direction):

- **Amendment to PDR-054 + ADR-177** if the cure is structural to the
  existing asymmetric-cure framing (e.g. naming hook-staged absorption
  as a sub-case with its own cure shape).
- **New PDR** if the cure introduces a structurally distinct concept
  (e.g. regenerator-output-classification as first-class doctrine).

Decision-record edits respect the 30%-context-for-directives rule.

### Phase 2 — `due` item 2: ADR-041 amendment

Two changes in one amendment:

1. **Add `agent-graphs/`** as a top-level workspace tier with permitted
   importer/importee rows in the dependency-direction matrix.
   `practice-graph` is the first occupant; future `agent-graphs/`
   workspaces follow the same tier rules.
2. **Regularise `agent-tools/`** — already shipped and referenced by
   ADR-165 / ADR-168 / ADR-178 without ADR-041 acknowledgement. Add
   its row to the matrix. This closes the latent gap.

Status update: ADR-041 moves to **Accepted (Revised)** with a dated
revision note. No new ADR number.

On landing: cross-link from ADR-173 § Open Questions:1 to ADR-041's
new row (confirms workspace path convention is now matrix-recorded);
mark D-4a closed in `graph-mvp-arc.plan.md § Open Decisions` with
commit reference; unblock ADR-173 ratification gate.

### Phase 3 — `pending` triage scan (focused, not exhaustive)

Walk the three 2026-05-11 additions and any other recently-captured
items (post-2026-05-10) and ask the standard pending-graduations
questions:

1. Has the named trigger condition fired (second-instance, owner-
   direction)?
2. Is the trigger vaporware-shaped or genuinely contingent?
3. Is the substance still load-bearing?

Items added 2026-05-11 that warrant a Phase 3 check:

- **Opener-vs-substrate divergence** (Dusky Masking Cloak; pending,
  awaiting second instance).
- **Different-lens reviewer divergence** (Dusky Masking Cloak;
  pending; has a 2026-05-09 first-instance precedent in distilled.md
  "Multi-Reviewer Dispatch Discipline" — arguably already at second
  instance, depending on how strictly "second instance" is read).
- **Value-articulation can be wrong while structural shape is right**
  (Blooming Growing Thicket 2026-05-11; pending).
- **Downstream-consumer cross-reference preserves forcing-function
  when scope splits between plans** (Blooming Growing Thicket
  2026-05-11; pending).
- **Practice-adopting repos exhibit elevated skill-listing budget
  floor** (Burnished Crackling Pyre 2026-05-11; pending).

Do not attempt the full ~84-item drain in this session — that is the
sequenced-deferral lane per the 2026-05-07 dedicated-drain opener.
Phase 3 is a focused scan of recent additions only.

### Phase 4 — Close

- Refresh `pending-graduations.md` Entry counts table.
- Mark D-4a closed in `graph-mvp-arc.plan.md` if Phase 2 landed.
- Update `connecting-oak-resources.next-session.md` if D-4a closure
  affects graph-thread blockers.
- Standard `/jc-session-handoff` (no full consolidate-docs unless
  triggers fire).

## Reviewer dispatch

**Mandatory for both due items** — ADR/PDR amendments are high-stakes
governance edits.

- **Phase 1 (hook-chain amendment)**:
  `architecture-expert-betty` (boundary-correctness of any new
  regenerator-vs-arbitrary classification);
  `docs-adr-expert` (PDR/ADR amendment quality — chain coherence);
  `assumptions-expert` (named-but-untested premise check on the
  symmetric-cure framing).

- **Phase 2 (ADR-041 amendment)**:
  `architecture-expert-fred` (principles-first ADR compliance —
  ADR-041's matrix is principles-shaped);
  `architecture-expert-betty` (boundary correctness of the new tiers
  in the import-direction matrix);
  `docs-adr-expert` (ADR-041 amendment quality; revision-note shape).

- **Phase 3 (pending triage)**: no reviewer dispatch (read-only
  triage); any item that moves to `due` and gets executed in the
  same session gets its own reviewer dispatch.

## Out of scope (explicit)

- The full ~84-item pending-graduations drain (sequenced-deferral
  lane per 2026-05-07 dedicated-drain opener).
- Graph-thread work — `connecting-oak-resources` is being taken up
  in parallel by Mistbound Watching Lantern on opener step 4
  (primary-agent-tooling-enhancements WS 2–5 implementation + B-01
  fix). File scopes are disjoint.
- Collaboration-protocol hardening FINAL (separate opener:
  [`2026-05-11-collaboration-protocol-hardening-final-opener.md`](../../agent-tooling/current/2026-05-11-collaboration-protocol-hardening-final-opener.md)).
- `repo-continuity.md` archive sweep (still CRITICAL fitness — flagged
  for a dedicated session, not absorbed here).
- Thread-record schema drift (Title Case headers; column order;
  missing headings on 3 thread files — flagged in Dusky Masking Cloak's
  consolidate-docs findings; not absorbed here).
- `practice-bootstrap.md` HARD-on-chars (41035 / 40500) — marginal,
  not actioned here.

## Cross-references

- [`.agent/memory/operational/pending-graduations.md`](../../../memory/operational/pending-graduations.md)
  — the two `due` items and the recent `pending` additions.
- `graph-mvp-arc.plan.md` § Open Decisions
  — D-4a entry; close on Phase 2 landing.
- [`graph-stack.plan.md`](../../connecting-oak-resources/knowledge-graph-integration/active/graph-stack.plan.md)
  — graph-stack ACTIVE promotion is downstream of ADR-173
  ratification, which is downstream of D-4a.
- [`ADR-041`](../../../../docs/architecture/architectural-decisions/041-workspace-structure-option-a.md)
  — the amendment target for Phase 2.
- [`PDR-054`](../../../practice-core/decision-records/PDR-054-asymmetric-cure-discipline.md)
  - [`ADR-177`](../../../../docs/architecture/architectural-decisions/177-asymmetric-cure-enforcement-in-staging.md)
  — amendment targets for Phase 1 (or new-PDR shape per owner
  direction).
- [`2026-05-07-pending-graduations-dedicated-drain-opener.md`](2026-05-07-pending-graduations-dedicated-drain-opener.md)
  — the broader-drain opener whose Phase 1/Phase 2 shape this opener
  mirrors at smaller scope.
- [`2026-05-11-collaboration-protocol-hardening-final-opener.md`](../../agent-tooling/current/2026-05-11-collaboration-protocol-hardening-final-opener.md)
  — parallel agentic-engineering-thread opener; this session does not
  touch its surfaces.
