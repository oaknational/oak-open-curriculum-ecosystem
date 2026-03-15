---
name: "Short-Term PR Snagging"
overview: "Resolve immediate PR snagging items for the active semantic-search delivery branch."
todos:
  - id: phase-0-triage
    content: "Phase 0 (RED): capture failing checks and classify review comments into actionable tasks."
    status: pending
  - id: phase-1-fixes
    content: "Phase 1 (GREEN): implement minimal fixes for failing checks and high-priority review findings."
    status: pending
  - id: phase-2-hardening
    content: "Phase 2 (REFACTOR): rerun full gates, close comment threads, and document residual follow-ups."
    status: pending
---

# Short-Term PR Snagging

**Last Updated**: 2026-03-10  
**Status**: 🟡 PLANNING  
**Scope**: Immediate, merge-blocking snagging only (checks + review findings) for the current active branch.

---

## Context

The active branch has open review feedback and failing remote checks. This plan
captures only the short-term snagging needed to restore merge readiness with a
clean, deterministic sequence.

### Authority and Decision Boundary

- Reviewer comments (human or bot) are hypotheses.
- Repo rules, executable tests, and deterministic command evidence are authority.
- Every open item must end with one explicit decision:
  `FIX_NOW`, `FIX_LATER`, or `DISAGREE`.
- `FIX_LATER` is only valid for non-blockers and must include an explicit
  follow-up location.

### Issue 1: Failing Remote Checks

- `CodeQL` is failing.
- `test` is failing.

These are merge blockers and must be resolved first.

### Issue 2: Open Review Feedback

Review comments include:

- logic correctness concerns in `agent-tools` runtime/session handling
- security findings around temporary file handling in tests
- lint/code quality findings and robustness concerns in type guards

Not all comments are equal priority. We prioritise merge blockers and
high-severity correctness/security findings first.

---

## Non-Goals

- No new feature scope.
- No broad refactors unrelated to failing checks/comments.
- No compatibility layers or temporary bypasses.

---

## Foundation Alignment

This plan is explicitly aligned to:

1. `.agent/directives/principles.md`
2. `.agent/directives/testing-strategy.md`
3. `.agent/directives/schema-first-execution.md`

At each phase start, re-ask: **Could it be simpler without compromising
quality?**

---

## Resolution Plan (TDD)

### Phase 0 (RED): Triage and Reproduction

#### Task 0.1: Lock the Snagging Set

**Acceptance Criteria**:

1. ✅ A complete list of open comments and check failures is captured.
2. ✅ Each item is tagged as blocker/non-blocker with rationale.
3. ✅ Reproduction commands are defined for each failing check.

**Deterministic Validation**:

```bash
gh pr checks 67
gh pr view 67 --json comments,reviews
gh api repos/oaknational/oak-open-curriculum-ecosystem/pulls/67/comments
```

**Task Complete When**: All three acceptance criteria are met and recorded in
the active session notes/plan log.

#### Task 0.2: Evidence-First Item Classification

**Acceptance Criteria**:

1. ✅ Every open item is listed with `id`, `source`, `severity`, `status`,
   and `affected file(s)`.
2. ✅ Every item has a required rationale record:
   claim, verification method, observed evidence, decision, next action.
3. ✅ No item remains unclassified (`FIX_NOW`, `FIX_LATER`, `DISAGREE`).

**Deterministic Validation**:

```bash
gh pr checks 67
gh pr view 67 --json comments,reviews
gh api repos/oaknational/oak-open-curriculum-ecosystem/pulls/67/comments
```

**Task Complete When**: The unified item ledger is complete and each item has
an explicit decision path backed by evidence.

---

### Phase 1 (GREEN): Implement Minimal Fixes

#### Task 1.1: Fix Check Blockers First

**Acceptance Criteria**:

1. ✅ Failing tests are reproduced locally and fixed via TDD.
2. ✅ CodeQL findings are reproduced (where possible) and fixed at root cause.
3. ✅ No checks are silenced or bypassed.

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

**Task Complete When**: Local gates pass and the corresponding remote checks
turn green on the PR head commit.

#### Task 1.2: Address High-Priority Review Findings

**Acceptance Criteria**:

1. ✅ Security and correctness findings are resolved with targeted tests.
2. ✅ Any deferred non-blocking items are explicitly documented with reason.
3. ✅ Changes remain within short-term snagging scope.

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
```

**Task Complete When**: Priority findings are fixed and validated by passing
tests/gates.

---

### Phase 2 (REFACTOR): Hardening and Closure

#### Task 2.1: Final Gate Sweep and PR Hygiene

**Acceptance Criteria**:

1. ✅ Full quality gates pass.
2. ✅ PR comments are answered/resolved or explicitly triaged.
3. ✅ PR description remains aligned with implemented scope.

**Deterministic Validation**:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm qg
gh pr checks 67
gh pr view 67 --json comments,reviews
```

**Task Complete When**: All checks are green and outstanding comments are either
resolved or intentionally triaged with explicit rationale.

#### Task 2.2: PR Thread Closure Protocol

**Acceptance Criteria**:

1. ✅ Fixed threads include code-change summary plus validation evidence.
2. ✅ Disagreed threads include concise technical evidence and references.
3. ✅ Deferred threads include risk statement and follow-up destination.

**Deterministic Validation**:

```bash
gh pr view 67 --json comments,reviews
gh api repos/oaknational/oak-open-curriculum-ecosystem/pulls/67/comments
```

**Task Complete When**: No ambiguous silent outcomes remain on reviewed threads.

---

## Risk Assessment

- **Risk**: Over-fixing beyond snagging scope.  
  **Mitigation**: Enforce strict non-goals and phase completion criteria.
- **Risk**: Fixes regress unrelated areas.  
  **Mitigation**: Run full `pnpm qg` before closure.
- **Risk**: Review ambiguity causes churn.  
  **Mitigation**: Classify comments by severity/blocking status before coding.

---

## Success Criteria

- ✅ All blocking checks for PR #67 pass.
- ✅ High-priority review findings are resolved with evidence.
- ✅ No quality gates are disabled or bypassed.
- ✅ Plan remains short-term, actionable, and discoverable in `active/`.

---

## Triage Item Record (Required Fields)

Use this structure for every open check/comment item:

1. `Claim summary`
2. `Verification method` (command/test/read path)
3. `Evidence observed`
4. `Decision` (`FIX_NOW` | `FIX_LATER` | `DISAGREE`)
5. `Next action` (code change, PR reply, or follow-up location)

---

## Session Prompt

- `.agent/prompts/semantic-search/pr-67-snagging-triage.prompt.md`
