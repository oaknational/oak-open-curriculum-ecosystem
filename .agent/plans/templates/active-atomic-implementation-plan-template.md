---
name: "[Phase Name] - Atomic Execution"
overview: >
  [One-line execution summary with deterministic outcomes.]
todos:
  - id: phase-kickoff
    content: "Prepare baseline and execution order."
    status: pending
  - id: phase-policy
    content: "[Define/update policy or contract for this phase.]"
    status: pending
  - id: phase-implementation
    content: "[Deliver implementation tasks with deterministic validation.]"
    status: pending
  - id: phase-evidence
    content: "[Capture evidence artefact(s) for non-trivial claims.]"
    status: pending
  - id: phase-doc-sync
    content: "Update documentation sync log with required canonical docs impact."
    status: pending
isProject: false
---

# [Phase Name] - Atomic Execution

## Source Strategy

- [roadmap.md](../roadmap.md)
- [[strategic-source].plan.md](../[strategic-source].plan.md)
- [[research-source].research.md](../[research-source].research.md)

## Preflight

Before any non-planning edits:

1. Re-read:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Capture baseline signal:

```bash
[deterministic baseline command]
```

3. Prepare evidence artefact:

```bash
cp .agent/plans/[collection]/evidence-bundle.template.md \
  .agent/plans/[collection]/evidence/$(date +%F)-[phase-slug]-run-001.evidence.md
```

## Atomic Tasks

### Task 1: [Task Name]

- Output: [Expected artefact(s)]
- Deterministic validation:
  - `[command]`

### Task 2: [Task Name]

- Output: [Expected artefact(s)]
- Deterministic validation:
  - `[command]`

### Step-Level Decomposition (When Needed)

For tasks where the implementation approach is known, decompose into
executable micro-steps. Each step is one action (2–5 minutes). This
is optional for simple tasks but expected for complex or multi-file
changes.

```markdown
#### Steps for Task N

1. **Write the failing test**
   - File: `[exact/path/to/test.ts]`
   - What it asserts: [behaviour]

2. **Run test to verify it fails**
   - Run: `[exact command]`
   - Expected: FAIL with "[reason]"

3. **Write minimal implementation**
   - File: `[exact/path/to/file.ts]`
   - Changes: [specific changes]

4. **Run test to verify it passes**
   - Run: `[exact command]`
   - Expected: PASS

5. **Run quality gates**
   - Run: `pnpm type-check && pnpm lint && pnpm test`
   - Expected: exit 0

6. **Commit**
   - `git add [files] && git commit -m "[message]"`
```

When the approach is known (e.g., from a deep review or prior phase),
include before/after code sketches:

```markdown
**Current** (`path/to/file.ts:42`):
// problematic code

**Target**:
// desired code
```

### Blocked Protocol

If any validation command fails or produces unexpected output during
task execution:

1. **Stop** — do not proceed to the next step or task
2. **Document** the failure: command, actual output, expected output
3. **Present** the failure to the project owner before continuing
4. **Do not guess** a workaround — ask for clarification

This applies equally to AI agents and human implementers.

### Fresh Sub-Agent Guidance

For phases with 3+ independent workspace-scoped tasks, consider
dispatching a fresh sub-agent per task. Benefits:

- No context pollution between tasks
- Enables parallelism for independent workspaces
- Each agent gets full attention on one task

Provide each sub-agent with: the specific task text, the canonical
pattern to follow, the deterministic validation commands, and the
blocked protocol above.

### Task 3: Documentation Synchronisation

- Output:
  - Phase entry updated in `documentation-sync-log.md`
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## [Phase]|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/[collection]/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

## Evidence and Claims

> See [Evidence and Claims component](components/evidence-and-claims.md)

- Every non-trivial claim in this phase must map to evidence IDs in the phase
  evidence bundle.

## Foundation Alignment

> See [Foundation Alignment component](components/foundation-alignment.md)

## Done When

1. All atomic tasks complete with deterministic validation output.
2. Evidence bundle exists and covers non-trivial claims.
3. Documentation sync entry is complete for this phase.
4. No blocked-protocol items remain unresolved (all failures presented to owner and addressed).
