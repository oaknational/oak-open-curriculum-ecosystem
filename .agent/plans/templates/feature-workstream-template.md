---
name: "[Plan Title]"
overview: "[One-line scope description]"
todos:
  - id: ws1-red
    content: "WS1 (RED): [Describe tests to write]. Tests MUST fail."
    status: pending
  - id: ws2-green
    content: "WS2 (GREEN): [Describe implementation]. All tests MUST pass."
    status: pending
  - id: ws3-refactor
    content: "WS3 (REFACTOR): [Describe documentation, TSDoc, NL guidance, README updates]."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain (type-gen through smoke:dev:stub)."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: Adversarial specialist reviews. Document findings."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: Propagate settled outcomes to canonical ADR/directive/reference docs and relevant READMEs."
    status: pending
isProject: false
---

<!-- After copying this template, adjust component reference paths.
     From templates/ the paths use ../templates/components/.
     From .agent/plans/semantic-search/active/ use ../../templates/components/. -->

# [Plan Title]

**Last Updated**: [YYYY-MM-DD]
**Status**: 🟡 PLANNING
**Scope**: [One-line description of what this plan addresses]

---

## Context

[Describe the current situation, what exists, and what needs to change]

### Problem Statement

[What is the specific problem? Include evidence — error messages, test
failures, architectural gaps.]

### Existing Capabilities

[What already exists that this plan builds on? Do not duplicate what
the SDK, existing tools, or infrastructure already provide.]

---

## Design Principles

1. **[Principle 1]** — [Why this matters for the design]
2. **[Principle 2]** — [Why this matters for the design]

**Non-Goals** (YAGNI):

- [Thing we are explicitly NOT doing and why]

---

## WS1 — [Test Specification] (RED)

All tests MUST FAIL at the end of WS1.

> See [TDD Phases component](../templates/components/tdd-phases.md)

### 1.1: [Test Group]

**Tests**:

- `[test-file].unit.test.ts` — [What it asserts]
- `[test-file].integration.test.ts` — [What it asserts]

**Acceptance Criteria**:

1. Tests compile and run
2. All new tests fail for the expected reason
3. No existing tests broken

---

## WS2 — [Implementation] (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: [Implementation Task]

**File**: `[path/to/file.ts]`

**Changes**:

- [Specific change 1]
- [Specific change 2]

**Deterministic Validation**:

```bash
# [What this checks]
[command]
# Expected: [result]
```

---

## WS3 — [Documentation and Polish] (REFACTOR)

### 3.1: TSDoc and NL guidance

- [Tool descriptions, NL examples, workflow guidance]

### 3.2: Documentation

- [README updates, architecture docs]

---

## WS4 — Quality Gates

> See [Quality Gates component](../templates/components/quality-gates.md)

```bash
pnpm clean && pnpm type-gen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../templates/components/adversarial-review.md)

Invoke specialist reviewers. Document findings. Create follow-up
plan if BLOCKERs found.

---

## Risk Assessment

> See [Risk Assessment component](../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| [Risk 1] | [Mitigation] |
| [Risk 2] | [Mitigation] |

---

## Foundation Alignment

> See [Foundation Alignment component](../templates/components/foundation-alignment.md)

---

## Documentation Propagation

> See [Documentation Propagation component](../templates/components/documentation-propagation.md)

---

## Dependencies

**Blocking**: [What must be completed before this can start?]

**Related Plans**:

- [Plan name] — [Relationship]
