---
name: "[Plan Title]"
overview: "[One-line scope description]"
todos:
  - id: phase-0-foundation
    content: "Phase 0: Verify foundation assumptions."
    status: pending
  - id: phase-1-resolution
    content: "Phase 1: Implement and validate fixes."
    status: pending
  - id: phase-2-hardening
    content: "Phase 2: Quality gates, documentation, and follow-up hardening."
    status: pending
---

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

**Critical**: Run ALL quality gates across ALL workspaces after EACH sub-task to catch regressions immediately.

**Why Not `--filter`?** [Explain why we need full monorepo verification - e.g., SDK changes affect multiple workspaces]

### After Each Task

```bash
# Run all quality gates across all workspaces
pnpm type-check  # Type check ALL workspaces
pnpm lint        # Lint ALL workspaces
pnpm test        # Test ALL workspaces
```

### After Each Phase

```bash
# Full quality gate sequence
pnpm sdk-codegen # Regenerate types (SDK changes)
pnpm build       # Build ALL workspaces
pnpm type-check  # Type check ALL workspaces
pnpm lint        # Lint ALL workspaces
pnpm test        # Test ALL workspaces
pnpm test:e2e    # E2E tests for ALL apps (if applicable)
```

**Rationale** (from @rules.md):

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

### Principle (from @rules.md and @testing-strategy.md)

> "[Quote relevant principle from foundation documents]"

### Key Insight

[What is the core realization that makes the solution elegant/simple?]

This exemplifies the first question from rules.md: **"Could it be simpler?"**

Answer: [YES/NO - explain why]

### Strategy

[High-level approach to solving the problem]

**Non-Goals** (YAGNI):

- ❌ [Thing we're explicitly NOT doing]
- ❌ [Another non-goal]
- ✅ [What we ARE doing instead]

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/rules.md` - Core principles
2. **Re-read** `.agent/directives/testing-strategy.md` - Testing philosophy
3. **Re-read** `.agent/directives/schema-first-execution.md` - Type generation flow
4. **Ask**: "Does this deliver system-level value, not just fix the immediate issue?"
5. **Verify**: No compatibility layers, no type shortcuts, no disabled checks

---

## Documentation Propagation Commitment

Before marking a phase complete:

1. Update `docs/architecture/architectural-decisions/119-agentic-engineering-practice.md` if impacted
2. Update `.agent/directives/practice.md` if impacted
3. Update `.agent/reference-docs/prog-frame/agentic-engineering-practice.md` if impacted
4. Update any additionally impacted ADRs, `/docs/` pages, or README files
5. Apply `.cursor/commands/jc-consolidate-docs.md` to ensure settled documentation is not trapped in plans

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

**Red Flag**: If validation commands don't produce expected results, STOP and fix before proceeding to next task.

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

**Task Complete When**: All [N] acceptance criteria checked AND validation shows [expected state] OR violations fixed and quality gates pass.

**Foundation Alignment**: [How this validates core principles]

---

### Phase 1: [Phase Name] ([Estimated Time])

**Foundation Check-In**: Re-read [specific foundation doc sections].

**Key Principle**: [Core principle guiding this phase]

#### Task 1.1: [Task Name]

**Current Implementation** (line [N]):

```typescript
// Show current problematic code
```

**Target Implementation**:

```typescript
// Show desired code after fix
```

**Changes**:

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

**Task Complete When**: All [N] acceptance criteria checked AND all validation commands pass.

---

#### Task 1.2: [Next Task Name]

[Repeat structure for each task in the phase]

---

**Phase 1 Complete Validation**:

```bash
# Run full quality gate after Phase 1
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
```

**Success Criteria**: All commands exit 0, no regressions introduced.

---

### Phase 2: [Next Phase Name] ([Estimated Time])

**Foundation Check-In**: Re-read [relevant foundation doc sections].

[Repeat phase structure with tasks]

---

### Phase N: Validation ([Estimated Time])

**Foundation Check-In**: Re-read all three foundation documents (rules.md, testing-strategy.md, schema-first-execution.md). Verify all principles followed throughout implementation.

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

- [ ] **rules.md - Cardinal Rule**: [Verify schema-first principle maintained]
- [ ] **rules.md - No Type Shortcuts**: Verified no `as`, `any`, `Record<string, unknown>` added
- [ ] **rules.md - No Global State**: [Verification relevant to this plan]
- [ ] **rules.md - No Compatibility Layers**: We replaced old approach, not wrapped it
- [ ] **rules.md - Quality Gates**: All gates pass across all workspaces
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

**Blocking**: [What must be completed before this can start?]

**Related Plans**:

- [Other plan name] - [Relationship]

**Prerequisites**:

- ✅ [What must already exist]
- ✅ [Another prerequisite]

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

### Alignment with @rules.md and @testing-strategy.md

**From testing-strategy.md**:

> "[Relevant quote]"

**From rules.md**:

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
  - `.agent/directives/rules.md`
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

Run these commands to verify all fixes:

```bash
# Full quality gate sequence
cd /Users/jim/code/oak/oak-mcp-ecosystem
pnpm sdk-codegen # Generate types
pnpm build      # Build all packages
pnpm type-check # Type check
pnpm lint       # Lint
pnpm test       # Unit & integration tests
pnpm test:e2e   # E2E tests (if applicable)

# Stability check (run multiple times if needed)
for i in {1..10}; do
  echo "Run $i/10"
  [relevant command] || break
done
```

**Expected Results**:

- ✅ All commands exit 0
- ✅ No type errors
- ✅ No lint errors
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

## Future Enhancements (Out of Scope)

- [Potential improvement 1 - why it's future work]
- [Potential improvement 2 - why it's future work]
- [Potential improvement 3 - why it's future work]
- [Potential improvement 4 - why it's future work]
