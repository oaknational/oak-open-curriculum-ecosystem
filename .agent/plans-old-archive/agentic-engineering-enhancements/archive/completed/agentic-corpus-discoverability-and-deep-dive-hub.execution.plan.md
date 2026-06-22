---
name: Agentic Corpus Discoverability and Deep-Dive Hub - Execution
overview: >
  Deliver the hub, named lanes, docs cross-links, and documentation-sync proof
  for the agentic-engineering corpus discoverability restructure.
todos:
  - id: phase-kickoff
    content: "Create the source plan, active execution plan, and local .agent mesh."
    status: completed
  - id: phase-execution-review
    content: "Run the execution-checkpoint docs review on the local .agent mesh."
    status: completed
  - id: phase-docs-surfaces
    content: "Update selected /docs discovery surfaces and re-review them."
    status: completed
  - id: phase-doc-sync
    content: "Record documentation propagation and no-change rationale in the sync log."
    status: completed
  - id: phase-validation
    content: "Run validation gates and final docs review."
    status: completed
isProject: false
---

# Agentic Corpus Discoverability and Deep-Dive Hub - Execution

## Source Strategy

- [roadmap.md](../roadmap.md)
- [current/agentic-corpus-discoverability-and-deep-dive-hub.plan.md](../current/agentic-corpus-discoverability-and-deep-dive-hub.plan.md)
- [../../reference/agentic-engineering/README.md](../../reference/agentic-engineering/README.md)

## Preflight

Before edits:

1. Re-read:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Confirm worktree safety:

```bash
git status --short
```

3. Keep the hub index-only:
   - route to canon
   - do not restate ADR decisions as a second source of truth
   - treat `.agent/experience/**` as extraction-only source material

## Atomic Tasks

### Task 1: Build the local `.agent` mesh

**Output**

- source plan in `current/`
- active execution plan in `active/`
- hub README in `.agent/reference/agentic-engineering/`
- deep-dive seed docs
- research lane root + named lane READMEs
- reports lane root + named lane READMEs
- reciprocal links from collection README, reference README, research README,
  analysis README, and practice index

**Deterministic validation**

- `test -f .agent/reference/agentic-engineering/README.md`
- `test -f .agent/reference/agentic-engineering/deep-dives/README.md`
- `find .agent/research/agentic-engineering -type f -name README.md | sort`
- `find .agent/reports/agentic-engineering -type f -name README.md | sort`

### Task 2: Execution checkpoint review

**Output**

- `docs-adr-reviewer` findings on the local `.agent` mesh
- any required structural corrections applied before `/docs/**` changes

**Deterministic validation**

- reviewer feedback absorbed into the changed files
- no orphaned lane READMEs

### Task 3: Update selected `/docs/**` discovery surfaces

**Output**

- root docs index links to the hub
- foundation README links to the hub
- `agentic-engineering-system.md` points to the hub as the agent-facing
  corpus and deep-dive surface
- governance README and ADR index either updated with clear value or left
  unchanged with explicit rationale recorded later

**Deterministic validation**

- `rg -n "agentic-engineering/README.md" docs/README.md docs/foundation/README.md docs/foundation/agentic-engineering-system.md`

### Task 4: Mid-execution review

**Output**

- `docs-adr-reviewer` on the docs-surface pass
- `onboarding-reviewer` on the affected root/foundation onboarding path
- findings absorbed into the authoritative files

**Deterministic validation**

- changed docs surfaces reflect reviewer corrections

### Task 5: Documentation sync and validation

**Output**

- documentation-sync-log entry for this adjacent work
- explicit no-change rationale for ADR-119 and `.agent/practice-core/practice.md`
  if unchanged
- explicit no-change rationale for governance/ADR index surfaces if left
  untouched

**Deterministic validation**

- `rg -n "Agentic Corpus Discoverability Hub|ADR-119 update or rationale|practice.md update or rationale" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
- `pnpm markdownlint:root`
- `pnpm practice:fitness:informational`
- `pnpm check`

## Reviewer Checkpoints

1. **Execution checkpoint** — `docs-adr-reviewer` after Task 1
2. **Mid-execution checkpoint** — `docs-adr-reviewer` + `onboarding-reviewer`
   after Task 3
3. **Final checkpoint** — `docs-adr-reviewer` on the full diff plus
   documentation sync log

## Evidence and Claims

- Claim: the hub is discoverable from the plan collection README, reference
  README, research/report lane READMEs, practice index, and selected docs
  surfaces.
- Claim: analysis/report authority is separated cleanly.
- Claim: the seed deep dives are present and route back to canon and source
  lanes rather than duplicating them.

These claims are verified by reciprocal link checks, reviewer feedback, and
the close-out validation commands above.

## Documentation Propagation

Required surfaces:

- `.agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
- `.agent/plans/agentic-engineering-enhancements/README.md`
- `.agent/reference/README.md`
- `.agent/research/README.md`
- `.agent/analysis/README.md`
- `.agent/reports/README.md`
- `.agent/reports/agentic-engineering/README.md`
- `.agent/practice-index.md`
- `docs/README.md`
- `docs/foundation/README.md`
- `docs/foundation/agentic-engineering-system.md`

No-change rationale is required if these stay untouched:

- `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
- `.agent/practice-core/practice.md`
- `docs/governance/README.md`
- `docs/architecture/architectural-decisions/README.md`

## Done When

1. The local `.agent` mesh exists and passes the execution checkpoint review.
2. The selected `/docs/**` discovery surfaces link to the hub and pass the
   mid-execution review.
3. Documentation propagation is recorded with explicit no-change rationale
   where appropriate.
4. Validation gates pass.
5. Final `docs-adr-reviewer` feedback is absorbed.
