---
name: "multi-agent-collaboration-protocol Concept-Home Refinement"
overview: >
  Refine the source plan body to its execution-status role by routing
  each Design-Principle and per-WS authoring narrative to the
  canonical home its concept already lives in. WS0–WS4A + WS3B
  doctrine has graduated to canonical surfaces during the 2026-04-29
  consolidation; the plan body still narrates concepts that now live
  elsewhere. This work is concept placement, not artefact-size
  reduction — the substance is decided by where each concept
  currently lives, not by line count.
parent: 2026-04-29-deferred-items-coordination.md
todos:
  - id: pre-refinement-snapshot
    content: "Walk the plan top to bottom; classify each section by where its concept already lives (canonical surface name) or whether it is plan-scoped substance that stays. Save the section-by-section concept-home table as a phase-0 evidence file."
    status: pending
  - id: design-principles-cite-back
    content: "Replace lines 201–319 (`## Design Principles`, 13 numbered principles) with a one-paragraph cross-reference paragraph naming the five canonical surfaces (agent-collaboration directive, respect-active-agent-claims rule, distilled.md, consolidate-docs §7e, PDR-029 Family A.3)."
    status: pending
  - id: ws-task-narrative-refinement
    content: "Refinement lines 342–1143 (per-WS task specifications). For each WS section: keep Goal (one sentence), Status, Completion evidence (commit refs, file paths). Drop authoring narratives whose substance has landed in the canonical surfaces."
    status: pending
  - id: preserve-wilma-review
    content: "Preserve lines 1289+ (`Wilma's Adversarial Review — Findings Absorbed`) verbatim — this table is unique to this plan and is genuine audit history."
    status: pending
  - id: preserve-ws5
    content: "Preserve §WS5 Observation and Refinement Harvest as forward scope; do not refinement."
    status: pending
  - id: preserve-critical-files
    content: "Preserve §Critical Files (lines 1144–1184) — audit trail of what landed."
    status: pending
  - id: cross-reference-canonical-surfaces
    content: "Verify canonical surfaces explicitly cite this plan as originating authority (so future authors of those rules can navigate back to the rationale)."
    status: pending
  - id: pending-graduations-flip
    content: "Flip the Pending-Graduations Register entry to graduated."
    status: pending
isProject: false
---

# multi-agent-collaboration-protocol — Concept-Home Refinement

**Parent**:
[`2026-04-29-deferred-items-coordination.md`](2026-04-29-deferred-items-coordination.md).
**Created**: 2026-04-29 (deferred from 2026-04-29 deeper convergence
pass).
**Status**: QUEUED — owner direction required.

The framing matters: this is not a "trim" or a "size reduction" — it
is a **refinement of which concepts live in which homes**. Each
section the plan body currently narrates is either (a) substance now
canonically homed elsewhere (cite the home, drop the local
narrative), or (b) execution status / audit history / forward scope
that genuinely belongs in this plan (preserve). The work is concept
placement, decided by where each concept already lives, not by an
artefact-size target. Line count is a downstream consequence, not
the goal.

## Context

The 2026-04-29 displaced-doctrine sub-agent report identified that
`multi-agent-collaboration-protocol.plan.md` is in a hybrid state:
WS0–WS4A complete, WS3B implemented, WS5 paused. The Design
Principles block (lines 201–319) and per-WS authoring narratives
(lines 342–1143) describe protocol behaviour that has now graduated
to canonical surfaces:

- `.agent/directives/agent-collaboration.md` (Directive)
- `.agent/rules/respect-active-agent-claims.md` (Rule, including
  the 2026-04-29 §Shared-state always writable amendment)
- `.agent/memory/active/distilled.md` (claims-registry summary +
  shared-state writability)
- `.agent/commands/consolidate-docs.md` §7e (stale-claim audit)
- `.agent/practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md`
  Family A Class A.3 (commit-window mechanism)

The plan body still narrates the doctrine alongside execution
status; the doctrine portion duplicates the canonical surfaces.

## Decision shape

For each section in the source plan body, decide: **does this
concept already live in a canonical home?** If yes, the plan cites
the home and drops the local restatement. If no (genuine plan-scoped
substance: execution status, completion evidence, unique audit
record, forward scope), the plan preserves it. No canonical surface
is edited and no doctrine is changed; the plan body simply stops
being a duplicate authority for concepts whose primary home is now
elsewhere. Line count falls because duplication is removed, not
because content was decided to be cuttable.

## Phases

### Phase 0 — Concept-home table

1. Walk the source plan top-to-bottom; for each section produce a
   row: `<section heading> | <concept it carries> | <current home> |
   <disposition>`.
2. Disposition values:
   - `concept-canonical-elsewhere` — the concept's primary home is
     a canonical surface (directive, rule, distilled, command,
     PDR). Plan cites the home; local narrative drops.
   - `plan-scoped-substance` — execution status, completion
     evidence, audit record, forward scope. Stays.
   - `unique-audit-record` — substance that exists only in this
     plan and is genuine history (e.g. Wilma's review findings).
     Stays verbatim.
3. Capture the resulting table as a phase-0 evidence file alongside
   this plan. The table is the audit substrate for the refinement;
   any future question of "why was this section dropped?" resolves
   to "the concept's canonical home is X."

### Phase 1 — Design Principles cite-back

Replace lines 201–319 (the 13 numbered principles) with:

```markdown
## Design Principles

The protocol's design doctrine now lives in canonical surfaces:

- **Directive**: [`agent-collaboration.md`](../../../directives/agent-collaboration.md)
  — channels, working model, knowledge-not-enforcement framing,
  bootstrap fast-path, sub-agent vs peer distinction, threat model.
- **Area consultation rule**: [`respect-active-agent-claims.md`](../../../rules/respect-active-agent-claims.md)
  — tripwire mechanics, definition of "area", shared-state always-
  writable absolutism, commit-window claim handling, discovery
  surfaces.
- **Distilled doctrine**: [`distilled.md`](../../../memory/active/distilled.md)
  — claims-registry summary, shared-state writability summary.
- **Lifecycle integration**: [`consolidate-docs § 7e`](../../../commands/consolidate-docs.md)
  — stale-claim audit; start-right-quick / start-right-thorough /
  session-handoff skills — protocol registration and closure.
- **Commit-window mechanism**: [PDR-029 Family A Class A.3](../../../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  — git:index/head as short-lived claim; queue-first ordering;
  schema v1.3.0 advisory commit_queue.

This plan no longer narrates the doctrine; it carries execution
status only.
```

### Phase 2 — Per-WS concept-home pass

For each WS section in lines 342–1143, apply the same concept-home
question as Phase 0:

- Concepts whose canonical home is the directive / rule / distilled
  / command / PDR are cited from those homes; the plan keeps Goal
  (one sentence), Status, Completion evidence (commit refs, file
  paths), Acceptance evidence.
- Plan-scoped substance (operational seeds WS5 will need for
  harvest, sequencing decisions specific to the protocol's lifecycle,
  cross-thread coordination evidence unique to this plan) stays.

Output length is a downstream consequence of where each concept lives;
the goal is correct placement, not a target length.

### Phase 3 — Preserve audit and forward scope

Verify the following are preserved verbatim:

- **§Critical Files** (lines 1144–1184) — audit trail of what
  landed; necessary for cross-session WS5 harvest.
- **§Wilma's Adversarial Review — Findings Absorbed** (lines 1289+)
  — unique to this plan; preserves the structural-then-pre-landing
  review evidence that grounded PDR-015 amendment.
- **§WS5 Observation and Refinement Harvest** — forward scope;
  remains the source of truth for WS5 work.
- **§Sequencing Discipline + Risk Register** — apply concept-home
  pass to embedded doctrine in row prose (cite canonical homes), but
  preserve the rows themselves as risk register.

### Phase 4 — Verify cross-references

For each canonical surface named in Phase 1, confirm it explicitly
cites this plan as the originating authority (so a future author of
respect-active-agent-claims.md or consolidate-docs.md can navigate
back here for rationale). If any are missing, add them.

### Phase 5 — Pending-Graduations Register flip

Update `repo-continuity § Pending-Graduations Register` entry dated
2026-04-29 ("multi-agent-collaboration-protocol.plan.md plan-body
refinement"): change `status: pending` to
`status: graduated 2026-04-XX (concept-home refinement; doctrine
cited from canonical surfaces)`.

## Acceptance Criteria

- [ ] Phase 0 concept-home table documents every section's
      disposition (concept-canonical-elsewhere / plan-scoped-substance
      / unique-audit-record).
- [ ] Every concept marked `concept-canonical-elsewhere` is cited
      from the plan body to its canonical home; no inline doctrine
      remains for those concepts.
- [ ] §Critical Files preserved verbatim.
- [ ] §Wilma's Adversarial Review preserved verbatim.
- [ ] §WS5 Observation and Refinement Harvest preserved.
- [ ] All gates green (markdownlint, format).
- [ ] Phase 0 evidence file documents the section-by-section
      disposition for audit reconstruction.

## Reviewers

- `docs-adr-reviewer` — verify the refinement preserves load-bearing
  audit evidence.
- `code-reviewer` — final pass.

## Risk

Moderate. The plan currently functions as the *audit trail* of how
the protocol was authored. The Design Principles list is also the
rationale for *why* each rule says what it says.

Mitigations:

1. Phase 4 verifies canonical surfaces cite back to this plan, so
   navigation from the canonical doctrine to the originating plan
   remains.
2. §Wilma's Adversarial Review and §Critical Files (the unique
   audit content) are preserved verbatim.
3. WS5's forward scope is preserved.
4. Pre-refinement snapshot in Phase 0 makes the refinement auditable: a future
   session can reconstruct the section-by-section disposition.

## Cross-References

- Parent:
  [`2026-04-29-deferred-items-coordination.md`](2026-04-29-deferred-items-coordination.md).
- Source plan:
  [`multi-agent-collaboration-protocol.plan.md`](multi-agent-collaboration-protocol.plan.md).
- Sub-agent report from 2026-04-29 displaced-doctrine extraction §6.
