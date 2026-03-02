---
name: "Phase 4 - Cross-Agent Standardisation Execution"
overview: >
  Execute committed cross-agent standardisation tasks now, and operationalise
  trigger-based handling for conditional tasks.
todos:
  - id: p4-committed-frontmatter
    content: "Committed task: normalise SKILL.md frontmatter to specification."
    status: pending
  - id: p4-committed-openai-cleanup
    content: "Committed task: remove untested openai.yaml stub and document reintroduction criteria."
    status: pending
  - id: p4-conditional-trigger-register
    content: "Create and maintain trigger register for conditional tasks."
    status: pending
  - id: p4-conditional-follow-up-mechanism
    content: "Define follow-up plan creation mechanism when triggers fire."
    status: pending
  - id: p4-doc-sync
    content: "Update documentation sync log with ADR/directive/reference-doc/README impact for Phase 4."
    status: pending
---

# Phase 4 - Cross-Agent Standardisation Execution

## Source Strategy

- [cross-agent-standardisation.plan.md](../cross-agent-standardisation.plan.md)

## Atomic Tasks

### Task 4.1: Skill Frontmatter Normalisation (Committed)

- Output:
  - SKILL frontmatter uses spec-compliant fields with `metadata` for extras
- Deterministic validation:
  - `rg -n "^name:|^description:|^metadata:" .agent/skills .cursor/skills .agents/skills 2>/dev/null`

### Task 4.2: Codex Adapter Cleanup (Committed)

- Output:
  - untested `agents/openai.yaml` stub removed (or replaced only when validated)
- Deterministic validation:
  - `find .agent/skills -path "*/agents/openai.yaml" -print`

### Task 4.3: Conditional Trigger Register

- Output:
  - trigger register document for tasks 2, 4, and 5
- Deterministic validation:
  - `rg -n "Trigger|command portability|workspace context|sub-agent wrappers" .agent/plans/agentic-engineering-enhancements`

### Task 4.4: Conditional Follow-Up Mechanism

- Output:
  - explicit mechanism: when trigger fires, create atomic active plan and link from roadmap
- Deterministic validation:
  - `rg -n "when trigger fires|follow-up plan|active/" .agent/plans/agentic-engineering-enhancements`

### Task 4.5: Documentation Synchronisation

- Output:
  - Phase 4 entry updated in documentation sync log
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 4|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/agentic-engineering-enhancements/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

## Done When

1. Committed tasks are complete and validated.
2. Conditional tasks are operationalised via explicit trigger handling.
3. No ambiguity remains about when deferred tasks become executable.
4. Documentation sync entry is complete for Phase 4.
