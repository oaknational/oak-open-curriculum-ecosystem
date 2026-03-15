---
name: "Phase 0 - Foundation and Baseline Alignment"
overview: >
  Establish the execution baseline for security hardening so later phases are
  deterministic, prioritised, and evidence-ready.
todos:
  - id: p0-preflight
    content: "Run foundation preflight and baseline scans for current security guidance coverage."
    status: pending
  - id: p0-research-mapping
    content: "Map research controls into executable control classes and deterministic validation hooks."
    status: pending
  - id: p0-priority-contract
    content: "Confirm and encode priority order: hallucination first, evidence second, other controls deferred."
    status: pending
  - id: p0-evidence-prep
    content: "Prepare first evidence artefact for phase execution and baseline recording."
    status: pending
  - id: p0-doc-sync
    content: "Update documentation sync log with Phase 0 impacts and rationale."
    status: pending
isProject: false
---

# Phase 0 - Foundation and Baseline Alignment

## Source Strategy

- [roadmap.md](../roadmap.md)
- [developing-secure-mcp-servers.research.md](../developing-secure-mcp-servers.research.md)
- [phase-0-control-mapping.md](../future/phase-0-control-mapping.md)
- [deferred-controls-register.md](../deferred-controls-register.md)

## Preflight

Before any non-planning edits:

1. Re-read:
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md`
2. Capture baseline signal:

```bash
rg -n "non-trivial claim|verified|partially verified|unverified|evidence" \
  .agent/skills/start-right-quick/shared/start-right.md \
  .agent/skills/start-right-thorough/shared/start-right-thorough.md \
  .agent/sub-agents/templates/*reviewer*.md
```

3. Prepare evidence artefact:

```bash
cp .agent/plans/security-and-privacy/evidence-bundle.template.md \
  .agent/plans/security-and-privacy/evidence/$(date +%F)-security-hardening-phase0-run-001.evidence.md
```

## Atomic Tasks

### Task 0.1: Research-to-Execution Mapping

- Output:
  - explicit mapping from research control families to phase execution classes
    in `phase-0-control-mapping.md`
- Deterministic validation:
  - `rg -n "5\.2|6\.1|6\.2|6\.3|6\.4|6\.5|6\.6|6\.7" .agent/plans/security-and-privacy/developing-secure-mcp-servers.research.md`
  - `test -f .agent/plans/security-and-privacy/future/phase-0-control-mapping.md`
  - `rg -n "Control Class Mapping|Handoffs|Validation Checklist" .agent/plans/security-and-privacy/future/phase-0-control-mapping.md`

### Task 0.2: Priority Contract Encoding

- Output:
  - collection docs encode priority order (hallucination -> evidence -> deferred controls)
  - deferred controls are explicitly listed in `deferred-controls-register.md`
- Deterministic validation:
  - `rg -n "Prioritisation Contract|Immediate|Second|Deferred" .agent/plans/security-and-privacy/README.md .agent/plans/security-and-privacy/roadmap.md`
  - `test -f .agent/plans/security-and-privacy/deferred-controls-register.md`
  - `rg -n "Deferred Controls|Trigger to Promote|Review Cadence" .agent/plans/security-and-privacy/deferred-controls-register.md`

### Task 0.3: Evidence Baseline Prepared

- Output:
  - first phase evidence artefact created
- Deterministic validation:
  - `ls -1 .agent/plans/security-and-privacy/evidence/*.evidence.md`

### Task 0.4: Documentation Synchronisation

- Output:
  - Phase 0 entry updated in `documentation-sync-log.md`
  - required canonical docs updated or explicitly marked no-change with rationale
  - consolidation review completed using `jc-consolidate-docs`
- Deterministic validation:
  - `rg -n "## Phase 0|Status:|ADR-119 update or rationale|practice.md update or rationale|prog-frame update or rationale|Consolidation review" .agent/plans/security-and-privacy/documentation-sync-log.md`
  - `test -f docs/architecture/architectural-decisions/119-agentic-engineering-practice.md`
  - `test -f .agent/practice-core/practice.md`

## Done When

1. Security baseline mapping is explicit and deterministic.
2. Priority ordering is encoded in collection docs.
3. Evidence baseline artefact exists.
4. Documentation sync entry is complete for Phase 0.
