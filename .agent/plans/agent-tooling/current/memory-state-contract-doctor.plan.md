---
name: "Memory/State Contract Doctor"
overview: >
  Implement a repo-local doctor for Practice state and memory surfaces. The
  doctor recomputes substrate health from current files, schemas, frontmatter,
  directory READMEs, generated headers, git topology, and known state roots;
  blocks deterministic defects; reports semantic ambiguity; and offers safe
  repair paths.
todos:
  - id: phase-0-current-defect-ledger
    content: "Phase 0: Confirm the surface-inventory/template dependency, build the current defect ledger from live state/memory surfaces, and lock the command contract."
    status: pending
  - id: phase-1-red-fixtures
    content: "Phase 1 (RED/GREEN landing design): Author fixture-driven tests for stale paths, missing merge_class, duplicate IDs, generated drift, invalid JSON/schema, conflict markers, and improper merge topology; RED states remain uncommitted and land atomically with GREEN implementation."
    status: pending
  - id: phase-2-green-report-mode
    content: "Phase 2 (GREEN): Implement read-only report mode that recomputes all deterministic checks and exits non-zero on structural defects."
    status: pending
  - id: phase-3-strict-mode
    content: "Phase 3: Add strict mode for low-ambiguity blocking invariants and CI/merge workflow integration."
    status: pending
  - id: phase-4-repair-mode
    content: "Phase 4: Add deterministic repair dry-run/apply flows; keep semantic repairs as routed remediation items."
    status: pending
  - id: phase-5-consolidation-integration
    content: "Phase 5: Integrate doctor output with consolidate-docs and update local state/memory entry points."
    status: pending
  - id: phase-6-closure
    content: "Phase 6: Full validation, reviewers, consolidation pass, and archive readiness."
    status: pending
isProject: false
---

# Memory/State Contract Doctor

**Last Updated**: 2026-05-07
**Status**: QUEUED
**Scope**: Repo-local enforcement for
[PDR-050](../../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md)
and [PDR-049](../../../practice-core/decision-records/PDR-049-memory-and-state-file-merge-semantics.md).

---

## Context

The current collaboration-state check parses the narrow collaboration state
happy path, but the broader substrate can still drift. Recent inspection found
both the canonical `comms-events/` surface and legacy `comms/events/` state in
the tree, with at least one recent event written to the old path. The
pre-doctor local-instance slice has now completed the terminal migration for
that specific transition: 114 legacy fragments were collision-checked,
JSON-parse-checked, ledgered with provenance, and moved into the canonical
`comms-events/` root. The legacy root remains historical only and should contain
only `.gitkeep`. A checker should validate that terminal state without
depending on a human remembering which path is canonical.

This plan implements the repo-local doctor promised by the portable substrate
contract. It does not replace the collaboration-state helper; it recomputes a
larger health model and can call narrower helpers where they already exist.

## Public Interface

Add root scripts:

```bash
pnpm practice:substrate:check
pnpm practice:substrate:check -- --mode strict
pnpm practice:substrate:repair -- --dry-run
pnpm practice:substrate:repair -- --apply
```

Implementation lives in the `agent-tools` workspace as a Practice substrate CLI
with root package-script aliases for the public commands above. That keeps the
plan inside the agent-tooling collection boundary while still letting the CLI
inspect Practice docs, state, memory, schemas, generated read models, and git
topology from the repo root. The CLI may reuse existing `agent-tools`
collaboration-state libraries where those already own parsing.

Root aliases MUST invoke the built `agent-tools` entrypoint only. They must not
run TypeScript source directly through `tsx`, `ts-node`, ad-hoc script wrappers,
or source-relative imports. The implementation cycle may run workspace tests
against source, but every repo-level command that agents or hooks invoke goes
through the compiled package output after the `agent-tools` build step.

These scripts remain queued in this plan. Do not add root
`practice:substrate:*` aliases until the doctor implementation starts; when
they land, they must invoke built `agent-tools` output only.

Report output is structured JSON by default with a human summary on stderr:

```json
{
  "ok": false,
  "mode": "report",
  "findings": [
    {
      "id": "canonical-path-drift",
      "level": "error",
      "severity": "blocking",
      "surface": "collaboration-comms-events",
      "repair": "deterministic",
      "message": "Legacy event path contains live JSON fragments"
    }
  ]
}
```

## Phase 0: Current Defect Ledger

Create a ledger of current defects and known-good cases from live files.
Before fixture authoring, consume the transferable substrate contract
specification from
[PDR-050](../../../practice-core/decision-records/PDR-050-state-memory-substrate-contracts.md)
and the local surface-inventory instance from Phase 2 of
[`memory-state-substrate-portable-contracts.plan.md`](../../agentic-engineering-enhancements/current/memory-state-substrate-portable-contracts.plan.md).
The current host-local contract surface is
[`memory-state-substrate-contracts.md`](../../../memory/executive/memory-state-substrate-contracts.md).
The strict local data contract now lives beside it as
[`memory-state-substrate-contracts.manifest.json`](../../../memory/executive/memory-state-substrate-contracts.manifest.json)
and
[`memory-state-substrate-contracts.schema.json`](../../../memory/executive/memory-state-substrate-contracts.schema.json).
Do not author doctor fixtures against an implicit contract: Phase 0 must first
validate the strict manifest and migration ledger, or promote any future local
instance changes into the same strict data shape.

Include at least:

- canonical `comms-events/` as the single live event-fragment root and legacy
  `comms/events/` as a historical root that should contain only `.gitkeep`;
- stale references to the legacy path in live docs and plans, classified
  separately from archived historical references that must be preserved;
- the legacy event migration ledger at
  `.agent/state/collaboration/comms/archive/legacy-comms-events-migration-ledger-2026-05-07.json`,
  including original path, target path, SHA-256, byte count, source evidence,
  and rationale for every migrated fragment;
- stale live writes to `comms/events/` after the ledger date as blocking, while
  preserving archived prose references as historical evidence unless a reviewer
  classifies them as live instructions;
- generated `shared-comms-log.md` provenance header;
- `merge_class` coverage across markdown frontmatter, JSON schemas, and
  directory READMEs;
- JSON/schema parse state for active claims, closed claims, conversations,
  escalations, and event fragments;
- duplicate stable IDs across active and archive state;
- active/closed claim consistency and commit-queue state;
- conflict markers in state and memory files;
- git topology checks for memory/state merge commits.

**Acceptance criteria**:

- The ledger distinguishes live defects from archived historical references.
- Each defect has severity, repairability, and owner/reviewer route.
- Phase 0 validates the strict executive-memory manifest/schema and migration
  ledger before RED fixtures encode machine-readable assumptions.
- The command contract above is finalised before RED fixtures are written.
- The command contract names which modes are unavailable until Phase 2 report
  mode lands, so early validation does not call commands before they exist.

## Phase 1: RED Fixtures

Add fixture-driven tests before implementation, but do not commit a RED-only
state. Each fixture class either lands in the same commit as the product code
that greens it, or the whole RED batch remains local/uncommitted until the
GREEN implementation is ready. Tests describe behaviour of a pure contract
engine over literal fixture manifests; live filesystem and git access belongs
only in thin composition tests or the runtime validator script.

**Required fixture classes**:

- stale canonical path with new event written to legacy path;
- live prose reference to a retired path;
- archived historical reference to a retired path that must remain report-only;
- missing `merge_class` in markdown, schema, and directory README forms;
- duplicate stable IDs where duplicates are invalid;
- same-key semantic collision where automatic repair is forbidden;
- generated read-model drift;
- invalid JSON and schema incoherence;
- conflict markers in state/memory surfaces;
- single-parent snapshot that claims to have completed a memory/state merge;
- topology fixture that declares target ref, candidate commit, touched
  memory/state paths, and whether squash/cherry-pick workflows are report-only
  or blocking for the claim being validated;
- repair preservation cases: exact duplicate by stable identity and content,
  same prose in different historical contexts, and archive references that
  cannot be migrated automatically.

**Validation**:

```bash
pnpm test:root-scripts -- --run practice-substrate
```

Expected local RED result: tests fail for missing implementation only. Expected
committed result: the paired implementation makes the same tests green.

## Phase 2: GREEN Report Mode

Implement `practice:substrate:check` in read-only report mode.

**Checks**:

- recompute surface inventory from files, schemas, frontmatter, directory
  READMEs, generated headers, and configured roots;
- validate the surface inventory contract itself, including live roots,
  archived/historical roots, exclusions, discovery rules, owner route, and
  portability tier;
- validate JSON and schemas;
- validate `merge_class` declarations against PDR-049 values;
- detect stale canonical paths and duplicate live surfaces;
- detect generated read-model drift by invoking the renderer/source-set contract
  and comparing regenerated output with the committed read model;
- detect duplicate stable IDs and impossible active/closed transitions;
- detect conflict markers;
- inspect git topology when a merge claim or merge commit is being validated.

**Acceptance criteria**:

- The command exits non-zero on deterministic structural defects.
- Findings cite the surface contract or PDR behind the failure.
- The command does not mutate files.
- Existing collaboration-state checks remain green or are subsumed with tests.
- The implementation separates pure fixture-tested contract logic from the live
  validator that reads the repository and git state.

## Phase 3: Strict Mode and Gate Integration

Add strict mode for low-ambiguity invariants.

**Blocking in strict mode**:

- invalid JSON/schema;
- conflict markers;
- missing required surface contract metadata;
- stale canonical path used for new live writes;
- legacy event-fragment root still carrying live writes or live references after
  the migration ledger exists;
- generated read-model drift;
- duplicate IDs where the contract forbids duplicates;
- single-parent snapshot presented as a completed memory/state merge.

**Report-only in strict mode**:

- semantic same-key collisions that need judgement;
- unclear stale-vs-archive path references;
- surfaces missing a natural owner;
- repair suggestions that would delete or rewrite historical evidence.

**Acceptance criteria**:

- Strict mode is wired into the merge/readiness workflow, not broad CI, until
  the current defect ledger is clean.
- No non-blocking deterministic defect is introduced; structural errors fail.

## Phase 4: Repair Mode

Add repair mode with dry-run first.

**Permitted deterministic repairs**:

- regenerate generated read models;
- add purely mechanical `merge_class` metadata after the surface contract is
  already unambiguous;
- migrate stale live references from legacy to canonical paths;
- rehome legacy event fragments into the canonical history location only when a
  migration ledger records original path, content identity, and provenance;
- sort and exact-dedupe append-only narrative sections only when stable identity
  and content prove they are the same evidence;
- emit a prepared remediation report for semantic conflicts.

**Forbidden automatic repairs**:

- deleting historical fragments;
- leaving contradictory live event-fragment roots in place after the migration
  ledger and repair path have been established;
- trimming, compressing, or rewriting knowledge to satisfy fitness;
- migrating archived historical references merely because the text mentions a
  retired path;
- resolving same-key semantic conflicts;
- rewriting git history;
- choosing `ours` or `theirs` for memory/state files;
- suppressing a failing finding to make a gate pass.

**Acceptance criteria**:

- `--dry-run` prints the exact edits without changing files.
- `--apply` refuses ambiguous or destructive repairs.
- Every applied repair is covered by a fixture.
- The legacy event-path repair reaches a single-live-root terminal state without
  losing historical evidence.

## Phase 5: Consolidation Integration

Integrate doctor output into consolidation.

**Acceptance criteria**:

- `consolidate-docs` has a substrate-health step that consumes doctor output.
- Repeated findings are routed to napkin, pending graduations, PDR amendment,
  rule, or tooling follow-up by shape.
- State and memory entry points document the doctor as the local immune layer.
- The consolidation record names any remaining legacy event-path references as
  historical evidence, live defects, or closed migration residue; no
  contradictory live surface remains unnamed.

## Quality Gates

Run before the substrate command exists:

```bash
pnpm agent-tools:collaboration-state -- check \
  --active .agent/state/collaboration/active-claims.json \
  --closed .agent/state/collaboration/closed-claims.archive.json \
  --events-dir .agent/state/collaboration/comms-events
pnpm test:root-scripts
pnpm portability:check
pnpm practice:vocabulary
pnpm practice:fitness:informational
pnpm markdownlint:root
```

After Phase 2 lands report mode, add the substrate check to each phase:

```bash
pnpm practice:substrate:check
pnpm agent-tools:collaboration-state -- check \
  --active .agent/state/collaboration/active-claims.json \
  --closed .agent/state/collaboration/closed-claims.archive.json \
  --events-dir .agent/state/collaboration/comms-events
pnpm test:root-scripts
pnpm portability:check
pnpm practice:vocabulary
pnpm practice:fitness:informational
pnpm markdownlint:root
```

## Non-Goals

- Moving state out of git.
- Replacing the collaboration-state transaction helper.
- Cleaning historical archives destructively.
- Solving every semantic merge conflict automatically.
- Making broad custom merge drivers for all fitness-managed files; that remains
  owned by the multi-checkout merge plan.
