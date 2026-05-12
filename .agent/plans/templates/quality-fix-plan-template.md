---
name: "[Plan Title]"
overview: "[One-line scope description]"
todos:
  - id: phase-0-foundation
    content: "Phase 0: Verify foundation assumptions."
    status: pending
  - id: cycle-1-resolution
    content: >
      Cycle 1: [failing test/check] + [minimal fix]. One commit.
      Tree green at end.
    status: pending
  - id: cycle-2-resolution
    content: >
      Cycle 2: [next test/check] + [minimal fix]. One commit.
      Tree green at end.
    status: pending
  - id: phase-final-hardening
    content: "Phase 2: Quality gates, documentation, and follow-up hardening."
    status: pending
---

<!-- After copying this template, replace the example cycle todo ids
     with the real TDD/refactoring cycles for the quality fix. Product
     code changes still land as test+code pairs. Pure documentation,
     evidence, and verification tasks may remain phase/task todos when
     they do not change product behaviour. -->

# [Plan Title: Brief, Action-Oriented Name]

**Last Updated**: [YYYY-MM-DD]  
**Status**: 🔴 NOT STARTED | 🟡 PLANNING | 🟢 IN PROGRESS | ✅ COMPLETE  
**Scope**: [One-line description of what this plan addresses]

---

## Context

[Describe the current situation and problems to be addressed]

### Issue 1: [Primary Problem Name]

[Detailed description of the first issue]

**Evidence**: [Concrete examples, test failures, error messages]

**Root Cause**: [Not just symptoms - what is the actual underlying problem?]

**Existing Capabilities**: [What existing code/patterns already solve or partially solve this?]

### Issue 2: [Secondary Problem Name]

[Repeat structure for additional issues]

---

## Quality Gate Strategy

**Critical**: every task or cycle names deterministic validation with
expected output. Final readiness uses the canonical aggregate gate.

See
[`components/quality-gates.md`](components/quality-gates.md)
for the current gate doctrine. Do not duplicate the full `pnpm check`
expansion into this plan; root `package.json` is the executable source
of truth.

### After Each Task or Cycle

```bash
[task-specific deterministic command]
# Expected: [exit 0 and expected output]

pnpm type-check
pnpm lint
pnpm test
```

### Final Aggregate Gate

```bash
pnpm check
```

**Rationale** (from @principles.md):

> "Run quality gates frequently to catch issues early"
> "If a change breaks something, you want to know immediately, not after 10 more changes"

---

## Problem Statement

### Current Architecture Issues

1. **[Issue Name]**: [Specific problem]

   ```typescript
   // BAD: [Example of problematic pattern]
   ```

2. **[Issue Name]**: [Another problem]

### Manifestation

[How these issues show up in practice - test failures, bugs, developer pain points]

---

## Solution Architecture

### Principle (from @principles.md and @testing-strategy.md)

> "[Quote relevant principle from foundation documents]"

### Key Insight

[What is the core realization that makes the solution elegant/simple?]

This exemplifies the first question from principles.md: **"Could it be simpler?"**

Answer: [YES/NO - explain why]

### Strategy

[High-level approach to solving the problem]

**Non-Goals** (YAGNI):

- ❌ [Thing we're explicitly NOT doing]
- ❌ [Another non-goal]
- ✅ [What we ARE doing instead]

---

## Build-vs-Buy Attestation (if vendor-touching)

Delete this section if the quality fix is purely internal. Otherwise
state vendor + first-party integrations surveyed + why bespoke was
chosen or which first-party option was adopted. Sunk-cost reasoning is
not a valid answer. Canonical prose lives in
`feature-workstream-template.md` §Build-vs-Buy Attestation.
`assumptions-expert` runs against this attestation pre-ExitPlanMode.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution**: `assumptions-expert`, plus a vendor specialist
  only for vendor-touching plans (challenges solution-class: "should
  this fix take this shape?").
- **During**: `test-expert`, `type-expert`, architecture family,
  `code-expert` gateway.
- **Post**: `docs-adr-expert`, `release-readiness-expert`.

Scheduling all reviewers at close is phase-misalignment. See
`feature-workstream-template.md` §Reviewer Scheduling for rationale.

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md` - Core principles
2. **Re-read** `.agent/directives/testing-strategy.md` - Testing philosophy
3. **Re-read** `.agent/directives/schema-first-execution.md` - Type generation flow
4. **Ask**: "Does this deliver system-level value, not just fix the immediate issue?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Lifecycle Trigger Commitment

Before the first non-planning edit:

1. Record the work shape: trivial landing target, bounded simple plan,
   or executable repo plan.
2. Run start-right and consult active claims, recent collaboration log
   entries, and relevant decision threads.
3. Register active areas before edits and close own claims at
   session-handoff.
4. Apply
   [`lifecycle-triggers.md`](components/lifecycle-triggers.md)
   for any non-trivial or multi-file fix.

---

## Documentation Propagation Commitment

Before marking a phase complete:

1. Update ADR-119 if impacted.
2. Update ADR-124 if impacted.
3. Update `.agent/practice-core/practice.md` if impacted.
4. Update any additionally impacted ADRs, `/docs/` pages, or README files.
5. Apply `/jc-consolidate-docs` so settled documentation is not trapped in plans.

If no update is needed for a required surface, record an explicit no-change rationale.

---

## Task Completion Summary

Each task has:

- **Acceptance Criteria**: Specific, checkable conditions that must be met
- **Deterministic Validation**: Commands with expected outputs and exit codes
- **Task Complete When**: Clear statement of when to proceed

**How to Use**:

1. Read the acceptance criteria before starting the task
2. Complete the implementation
3. Run the deterministic validation commands
4. Check all acceptance criteria
5. Only mark task complete when ALL criteria met AND ALL validations pass

**Red Flag**: If validation commands don't produce expected results,
STOP and fix before proceeding to next task.

---

## TDD / Refactoring Cycle Discipline

Every product-code quality fix is decomposed into cycles. A cycle is
one landing unit: the failing test or failing deterministic check, the
minimal product change that greens it, and any refactor, all committed
together. If a quality fix is verification-only or documentation-only,
state that explicitly in the task and provide deterministic validation.

Each cycle must name:

1. starting state and file scope;
2. the failing test or check;
3. the minimal product change;
4. outcome-based acceptance criteria;
5. deterministic validation commands;
6. whether it is parallel-safe or sequenced behind another cycle.

---

## Resolution Plan

### Phase 0: Verify Foundation Assumptions ([Estimated Time])

**Foundation Check-In**: Re-read [specific sections from foundation docs relevant to this phase].

**Key Principle**: [What must we verify before proceeding?]

#### Task 0.1: [Validation Task Name]

**Current Assumption**: [What are we assuming is true?]

**Validation Required**: [What do we need to confirm?]

**Acceptance Criteria**:

1. ✅ [Specific checkable condition]
2. ✅ [Another condition]
3. ✅ [Condition about what to do if issues found]
4. ✅ [Final condition]

**Deterministic Validation**:

```bash
# 1. [Description of what this checks]
[command to run]
# Expected: [What output should look like, including exit codes]

# 2. [Next check]
[command to run]
# Expected: [Expected result]

# 3. [If needed, count violations or issues]
[command to run]
# Expected: [Expected count or result]
```

**If Violations Found**:

1. **STOP** - Do not proceed to Phase 1
2. **Document** each violation: [What to document]
3. **Fix** each violation using [pattern/approach]
4. **Re-run** quality gates: `pnpm type-check && pnpm lint && pnpm test`
5. **Re-validate** - return to deterministic validation above

**If No Violations**:

Proceed directly to Phase 1.

**Task Complete When**: All [N] acceptance criteria checked and
validation shows [expected state], or violations are fixed and quality
gates pass.

**Foundation Alignment**: [How this validates core principles]

---

### Phase 1: [Phase Name] ([Estimated Time])

**Foundation Check-In**: Re-read [specific foundation doc sections].

**Key Principle**: [Core principle guiding this phase]

#### Cycle 1.1: [Cycle Name]

**Parallel-safety**: [parallel-safe with evidence | sequenced after `<cycle-id>`]

**Starting state**: [branch HEAD at dispatch | after `<cycle-id>` lands]

**File scope**:

- `[test-or-check-file]`
- `[product-file]`

**Current Implementation** (line [N]) — expected when the approach is known:

```typescript
// Show current problematic code
```

**Target Implementation** — expected when the approach is known:

```typescript
// Show desired code after fix
```

**Failing Test or Check**:

- [File and assertion/check shape]

**Product Changes**:

- [Specific change 1]
- [Specific change 2]
- [Specific change 3]

**Acceptance Criteria**:

1. ✅ [Specific checkable condition]
2. ✅ [Another condition]
3. ✅ [Behavior validation]
4. ✅ [Code quality validation]
5. ✅ [No prohibited patterns present]

**Deterministic Validation**:

```bash
# 1. [What this verifies]
[grep or other command]
# Expected: [Expected result with exit code]

# 2. [Next verification]
[command]
# Expected: [Expected result]

# 3. [Quality gates]
pnpm type-check  # Expected: exit 0, no type errors
pnpm lint        # Expected: exit 0, no lint errors
pnpm test        # Expected: exit 0, all tests pass

# 4. [Task-specific test if applicable]
[command to run specific test]
# Expected: [Expected result]
```

**Cycle Complete When**: All [N] acceptance criteria checked, all
validation commands pass, and the cycle lands as one test/check +
product-code commit.

---

#### Cycle 1.2: [Next Cycle Name]

[Repeat structure for each product-code cycle. Use task sections only
for verification-only, documentation-only, or evidence-only work.]

---

**Phase 1 Complete Validation**:

```bash
pnpm check
```

**Success Criteria**: All commands exit 0, no regressions introduced.

---

### Phase 2: [Next Phase Name] ([Estimated Time])

**Foundation Check-In**: Re-read [relevant foundation doc sections].

[Repeat cycle or verification-task structure]

---

### Phase N: Validation ([Estimated Time])

**Foundation Check-In**: Re-read all three foundation documents:
`principles.md`, `testing-strategy.md`, and
`schema-first-execution.md`. Verify all principles followed throughout
implementation.

#### Task N.1: [Primary Validation Task]

**Acceptance Criteria**:

1. ✅ [Functional validation]
2. ✅ [Performance/stability validation]
3. ✅ [Quality validation]
4. ✅ [Consistency validation]

**Deterministic Validation**:

```bash
# 1. [Primary validation]
[command]
# Expected: [Result]

# 2. [Stability check - run multiple times if needed]
for i in {1..10}; do
  echo "Run $i/10"
  [command] || break
done
# Expected: [Result - e.g., 10/10 passes]

# 3. [Quality verification]
[command]
# Expected: [Result]
```

**Task Complete When**: All [N] acceptance criteria checked AND all validation commands pass.

---

#### Task N.2: Foundation Document Compliance Checklist

**Final verification against foundation documents**:

- [ ] **principles.md - Cardinal Rule**: [Verify schema-first principle maintained]
- [ ] **principles.md - No Type Shortcuts**: Verified no `as`, `any`,
  `Record<string, unknown>` added
- [ ] **principles.md - No Global State**: [Verification relevant to this plan]
- [ ] **principles.md - No Compatibility Layers**: We replaced old approach, not wrapped it
- [ ] **principles.md - Quality Gates**: All gates pass across all workspaces
- [ ] **testing-strategy.md - Test Behavior**: Tests validate behavior, not implementation
- [ ] **testing-strategy.md - [Relevant Test Type]**: [Specific validation for this plan]
- [ ] **testing-strategy.md - Simple Mocks**: [Verification relevant to this plan]
- [ ] **schema-first-execution.md - Generator First**: [Verification relevant to this plan]
- [ ] **System-Level Impact**: [State the actual impact - velocity, reliability, etc.]

**Acceptance Criteria**:

1. ✅ All [N] checklist items verified and checked
2. ✅ Any unchecked items have documented justification OR are immediately fixed
3. ✅ Foundation documents reviewed and compliance confirmed

**Task Complete When**: All checklist items checked AND acceptance criteria met.

**If any item unchecked**: Stop and fix before proceeding.

---

## Testing Strategy

### Unit Tests

[What unit tests are needed? Or state if existing tests are sufficient]

**Existing Coverage**:

- [List existing unit tests that cover related functionality]

**New Tests Required** (if any):

- [Test name] - [What it proves]

---

### Integration Tests

[What integration tests are needed? Or state if existing tests are sufficient]

**Existing Coverage**:

- [List existing integration tests]

**New Tests Required** (if any):

- [Test name] - [What it proves]

---

### E2E Tests

[What E2E tests are affected or needed?]

**Modified Tests**:

- [Test name] - [What changes]

**New Tests Required** (if any):

- [Test name] - [What it proves]

**Validation**:

- [How to validate E2E tests work correctly]

---

## Success Criteria

### Phase 0 ([Phase Name])

- ✅ [Specific measurable outcome]
- ✅ [Another outcome]

### Phase 1 ([Phase Name])

- ✅ [Specific measurable outcome]
- ✅ [Another outcome]

### Phase N (Validation)

- ✅ [Functional success criteria]
- ✅ [Quality success criteria]
- ✅ [Stability success criteria]

### Overall

- ✅ [Primary goal achieved]
- ✅ [Secondary goal achieved]
- ✅ [Quality maintained]
- ✅ [Architecture improved]
- ✅ [Developer experience enhanced]

---

## Dependencies

**Blocking prerequisites**:

- [What must be completed before this can start, and why it is blocking]

**Related Plans**:

- [Other plan name] - [Relationship]

**Beneficial prerequisites**:

- [What improves this work but does not block it]

**Minimum shippable shape without beneficial prerequisites**:

- [What can land if beneficial prerequisites are deferred]

---

## Notes

### Why This Matters (System-Level Thinking)

**Question**: "Why are we doing this, and why does that matter?"

**Immediate Value**:

- **[Aspect]**: [How it helps immediately]
- **[Aspect]**: [Another immediate benefit]
- **[Aspect]**: [Another benefit]

**System-Level Impact**:

- **[Impact Area]**: [Long-term systemic benefit]
- **[Impact Area]**: [Another systemic benefit]
- **[Impact Area]**: [Another systemic benefit]
- **[Impact Area]**: [Final systemic benefit]

**Risk of Not Doing**:

- **[Risk]**: [What happens if we don't do this]
- **[Risk]**: [Another risk]
- **[Risk]**: [Another risk]
- **[Risk]**: [Final risk]

### Alignment with @principles.md and @testing-strategy.md

**From testing-strategy.md**:

> "[Relevant quote]"

**From principles.md**:

> "[Relevant quote]"

**This Plan**:

- ✅ [How this plan follows principle 1]
- ✅ [How this plan follows principle 2]
- ✅ [How this plan follows principle 3]
- ✅ [How this plan follows principle 4]

---

## References

- [Product code reference]: [File path or description]
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`

---

## Implementation Notes

### Key Insight

[What is the core realization that makes the implementation elegant/simple?]

### Migration Path

1. **Phase 0**: [What this phase accomplishes]
2. **Phase 1**: [What this phase accomplishes]
3. **Phase N**: [What this phase accomplishes]

### Minimal Risk

[Why this approach is low-risk]

- [Risk mitigation 1]
- [Risk mitigation 2]
- [Risk mitigation 3]
- [Risk mitigation 4]

---

## Validation Checklist

Run the task-specific deterministic checks named in the plan, then the
canonical aggregate gate:

```bash
[task-specific deterministic command]
# Expected: [exit 0 and expected output]

pnpm check

# Stability check (run multiple times if needed)
for i in {1..10}; do
  echo "Run $i/10"
  [relevant command] || break
done
```

**Expected Results**:

- ✅ Task-specific deterministic checks produce expected output
- ✅ `pnpm check` exits 0
- ✅ [Specific test count/result]
- ✅ [Stability result]

---

## Code Quality Verification

Run these checks to confirm architectural compliance:

```bash
# [Check 1 - what it validates]
[grep or other command]
# Expected: [Expected result]

# [Check 2 - what it validates]
[command]
# Expected: [Expected result]

# [Check 3 - what it validates]
[command]
# Expected: [Expected result]

# [Check 4 - what it validates]
[command]
# Expected: [Expected result]
```

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.

---

## Future Enhancements (Out of Scope)

- [Potential improvement 1 - why it's future work]
- [Potential improvement 2 - why it's future work]
- [Potential improvement 3 - why it's future work]
- [Potential improvement 4 - why it's future work]
