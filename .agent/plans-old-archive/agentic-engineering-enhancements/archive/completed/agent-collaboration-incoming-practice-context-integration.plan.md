---
name: Agent-Collaboration Incoming Practice Context Integration and Write-Back
overview: >
  Integrate the 2026-04-05 incoming Practice Context batch below Practice
  Core, repair workspace participation honesty, and create a targeted
  write-back pack for agent-collaboration.
todos:
  - id: phase-0-baseline
    content: "Phase 0: Baseline the incoming batch, local absorption state, and task-export gaps."
    status: completed
  - id: phase-1-design
    content: "Phase 1: Decide what becomes local doctrine, what stays support-only, and what to write back."
    status: completed
  - id: phase-2-integration
    content: "Phase 2: Land the current plan, local pattern, docs, and outgoing-pack structure."
    status: completed
  - id: phase-3-pilot
    content: "Phase 3: Run the focused rollout on the agent-collaboration batch and capture evidence."
    status: completed
  - id: phase-4-rollout
    content: "Phase 4: Repair workspace contract truth, clear the incoming batch, and close documentation propagation."
    status: completed
---

# Agent-Collaboration Incoming Practice Context Integration and Write-Back

**Last Updated**: 2026-04-05
**Status**: ✅ COMPLETE
**Scope**: Incoming Practice Context integration and focused repo-targeted
write-back for `agent-collaboration`

**Closeout note**: The rollout and consolidation closed on 2026-04-05. This
plan is archived because the durable outcomes already live in permanent docs,
the local pattern set, the napkin, and the repo-targeted outgoing pack. No
follow-on Practice Core or ADR promotion is required from this round.

---

## Context

OOCE received a 13-file incoming Practice Context batch from
`agent-collaboration`. Most of the hydration, continuity, and self-sufficiency
cluster was already promoted locally into Practice Core, ADR, or pattern
surfaces. The two strongest net-new signals were different:

- `canonical-gate-and-strict-foundation.md` sharpened the monorepo doctrine
  around executable aggregate gates, single-owner gate discoverability, and
  honest workspace participation.
- `shared-strictness-requires-workspace-adoption.md` captured the reusable
  process lesson that shared strictness is not real until each claimed
  workspace composes it and passes under it.

The same analysis exposed a concrete honesty gap inside OOCE: root scripts and
docs described a repo-wide `clean` story, but `@oaknational/agent-tools` did
not export a `clean` task.

This rollout keeps Practice Core unchanged. It captures the reusable lesson as
a local pattern, records the companion gate doctrine in permanent engineering
docs, creates a targeted write-back pack for the source repo, and then clears
the transient incoming batch.

## Goal

Integrate the incoming batch truthfully and leave behind durable local surfaces
for the net-new doctrine by:

- creating a current execution anchor for the rollout
- admitting one new process pattern
- documenting the canonical aggregate-gate doctrine in permanent engineering
  docs
- repairing the concrete workspace task-export gap
- creating a focused repo-targeted write-back pack under
  `.agent/practice-context/outgoing/agent-collaboration/`
- clearing the incoming batch once adoption is recorded

## Non-Goals

- No Practice Core mutation in this round
- No provenance UUID, ADR, or changelog changes for already-promoted hydration
  doctrine
- No bulk rewrite of the existing flat outgoing support-note set
- No build-system refactor to collapse `pnpm check` into a new root-script
  topology during this docs/process rollout

---

## Phase 0 — Baseline Audit

### Task 0.1: Inventory the incoming batch against local canonical homes

- Output:
  `.agent/memory/napkin.md` analysis entry plus this plan's baseline/context
- Completed work:
  - read all 13 incoming notes
  - mapped which notes were already absorbed into local Practice Core, ADR, and
    pattern surfaces
  - identified the two strongest net-new signals and the stale/support-only
    notes
- Validation:
  - napkin records the integration analysis
  - this plan names the adopted vs support-only split

### Task 0.2: Identify task-export and gate-truth gaps

- Output: task-export audit outcome captured in this plan and follow-on docs
- Completed work:
  - compared root gate claims against workspace task exports
  - found `@oaknational/agent-tools` missing `clean`
- Validation:
  - workspace-task scan reports zero missing claimed tasks after the fix lands

---

## Phase 1 — Policy and Design Contract

### Task 1.1: Decide what graduates locally and what stays support-only

- Output:
  - local pattern:
    `.agent/memory/patterns/shared-strictness-requires-workspace-adoption.md`
  - local engineering doctrine: `docs/engineering/build-system.md`
- Completed work:
  - classified the strictness note as a reusable local pattern
  - classified the companion gate note as local engineering doctrine rather
    than Practice Core or outgoing flat-note replacement
- Validation:
  - pattern is indexed in `.agent/memory/patterns/README.md`
  - build-system docs capture the aggregate-gate doctrine

### Task 1.2: Define the focused write-back scope

- Output:
  `.agent/practice-context/outgoing/agent-collaboration/`
- Completed work:
  - chose a small repo-targeted pack (`README.md` + 2 notes)
  - scoped the pack to the strongest net-new signals and outgoing-pack hygiene
- Validation:
  - outgoing pack contains exactly the intended files

---

## Phase 2 — Workflow Integration

### Task 2.1: Create the current execution anchor and discoverability links

- Outputs:
  - this plan
  - collection indexes and prompt updates:
    - `.agent/plans/agentic-engineering-enhancements/README.md`
    - `.agent/plans/agentic-engineering-enhancements/current/README.md`
    - `.agent/plans/agentic-engineering-enhancements/roadmap.md`
    - `.agent/prompts/session-continuation.prompt.md`
- Completed work:
  - added the plan to the collection surfaces the repo uses to resume work
  - made the docs/process lane visible without displacing WS3 as the default
    session anchor
- Validation:
  - all four discoverability surfaces point to this plan

### Task 2.2: Add the local doctrine, outgoing structure, and write-back pack

- Outputs:
  - `.agent/memory/patterns/shared-strictness-requires-workspace-adoption.md`
  - `docs/engineering/build-system.md`
  - `.agent/practice-context/README.md`
  - `.agent/practice-context/outgoing/README.md`
  - `.agent/practice-context/outgoing/agent-collaboration/*`
- Completed work:
  - added the local pattern and index entry
  - documented aggregate-gate doctrine and honest workspace participation
  - added repo-targeted outgoing-pack guidance
  - created the focused `agent-collaboration` write-back pack
- Validation:
  - targeted grep checks pass for the new doctrine and pattern names

---

## Phase 3 — Pilot and Evidence

### Task 3.1: Run the rollout on the live incoming batch

- Output: live repository changes plus cleared incoming batch
- Completed work:
  - used the actual 2026-04-05 incoming batch as the pilot
  - promoted the net-new signal locally and left already-absorbed notes below
    Practice Core
- Validation:
  - incoming directory is empty after adoption is captured

### Task 3.2: Capture the reasoning and source-repo feedback

- Outputs:
  - `.agent/memory/napkin.md`
  - `.agent/practice-context/outgoing/agent-collaboration/`
- Completed work:
  - recorded the durable local lessons in the napkin
  - wrote the focused source-repo feedback pack
- Validation:
  - napkin and outgoing pack agree on the adopted/support-only split

---

## Phase 4 — Rollout and Enforcement

### Task 4.1: Repair the workspace task-export contract

- Output: `agent-tools/package.json`
- Completed work:
  - added `clean` to `@oaknational/agent-tools`
- Validation:
  - workspace-task scan reports zero missing `build`, `clean`, `type-check`,
    `lint`, and `test` exports across `apps/`, `packages/`, and `agent-tools/`
  - `pnpm --filter @oaknational/agent-tools clean` removes `dist/` and
    `.turbo`

### Task 4.2: Clear the transient incoming batch

- Output: `.agent/practice-context/incoming/` emptied for this round
- Completed work:
  - deleted the integrated incoming files after local adoption and write-back
    capture landed
- Validation:
  - `rg --files .agent/practice-context/incoming` returns no note files

### Task 4.3: Documentation propagation and closeout record

- Outputs:
  - `.agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
  - verification evidence from the commands below
- Completed work:
  - recorded the documentation propagation outcome in the collection sync log
  - ran the deterministic verification commands for the rollout
  - confirmed that all requested commands passed except `pnpm practice:fitness`,
    which still fails because of pre-existing repo-wide fitness violations
    outside this change set
  - ran the `jc-consolidate-docs` workflow and confirmed the plan is safe to
    archive: no additional doctrine remained trapped in the plan, no further
    pattern extraction was warranted, and the relevant platform-side plans did
    not contain uncaptured doctrine for this round
- Validation:
  - documentation sync log has an entry for this adjacent work
  - verification commands pass or produce a documented no-pass rationale

---

## Quality Gates

- `pnpm markdownlint-check:root`
- `pnpm practice:fitness`
- `pnpm --filter @oaknational/agent-tools build`
- `pnpm --filter @oaknational/agent-tools test`
- `pnpm check`

## Foundation Alignment

- Keep Practice Core unchanged; land only below-Core doctrine in this round
- Treat `pnpm check` as the canonical aggregate gate surface
- Bound repo-wide gate claims by actual workspace task exports
- Use repo-targeted outgoing subdirectories only when the write-back value is
  genuinely source-specific

## Documentation Propagation

- ADR-119: expected no-change rationale
- `.agent/practice-core/practice.md`: expected no-change rationale
- Other impacted docs: build-system doc, Practice Context READMEs, collection
  indexes, roadmap, session prompt, and outgoing write-back pack

## Consolidation

Completed 2026-04-05. The consolidation pass confirmed that the durable content
from this rollout already lives in the local pattern, engineering docs,
Practice Context docs, outgoing write-back pack, and napkin.

## Risk Assessment

- The strongest incoming lessons are partly implementation-shaped; writing them
  as Practice Core would overfit this repo's current gate topology
- The build-system doctrine must stay honest about present implementation while
  still recording the stricter design target
- Clearing the incoming batch too early would destroy auditability; clear only
  after local adoption and outgoing write-back both exist
