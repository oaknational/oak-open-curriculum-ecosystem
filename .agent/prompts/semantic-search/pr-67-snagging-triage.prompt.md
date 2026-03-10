---
prompt_id: pr-67-snagging-triage
title: "PR #67 Snagging Triage Session"
type: handover
status: active
last_updated: 2026-03-10
---

# PR #67 Snagging Triage Session

Use this prompt to run a full, item-by-item triage pass for PR #67.

## Scope

- Repository: `oaknational/oak-open-curriculum-ecosystem`
- PR: `#67`
- Objective: classify and action every open check/comment item
- Constraint: short-term snagging only (merge blockers first)
- Executable plan: `.agent/plans/semantic-search/active/short-term-pr-snagging.plan.md`

## Non-Negotiables

1. Re-ground first:
   - `.agent/directives/AGENT.md`
   - `.agent/directives/principles.md`
   - `.agent/directives/testing-strategy.md`
   - `.agent/directives/schema-first-execution.md` (if snagging touches generated
     schema-driven execution paths)
2. No disabled checks, no bypasses, no compatibility layers.
3. TDD for behaviour changes (RED -> GREEN -> REFACTOR).
4. Evidence beats authority: reviewer comments are inputs, not truth.
5. It is explicitly acceptable to disagree with Copilot (or any bot)
   when code/tests/spec evidence supports the disagreement.

## Step 1: Collect Current PR State

Run:

```bash
gh pr checks 67
gh pr view 67 --json comments,reviews
gh api repos/oaknational/oak-open-curriculum-ecosystem/pulls/67/comments
```

Produce one unified item list with:

- item id (check name or comment URL)
- source (`check`, `cursor`, `copilot`, `code-quality`, `adv-security`, etc.)
- severity (`blocker`, `high`, `medium`, `low`)
- status (`open`, `resolved`, `unknown`)
- affected file(s)

## Step 2: Triage Each Item (No Skips)

For each item, decide one of:

- `FIX_NOW` (merge blocker or correctness/security risk)
- `FIX_LATER` (non-blocking, documented follow-up)
- `DISAGREE` (finding not valid for this codebase/scope)

Required rationale fields per item:

Use the `Triage Item Record (Required Fields)` section from the active plan:
`.agent/plans/semantic-search/active/short-term-pr-snagging.plan.md`.

## Step 3: Validate Decisions with Evidence

Minimum validation before closure:

```bash
pnpm type-check
pnpm lint
pnpm test
pnpm qg
gh pr checks 67
```

If any gate fails, stop and fix before moving to the next item.

## Step 4: Respond in PR with Clear Outcomes

For each reviewed thread:

- if fixed: reply with what changed + validation evidence
- if disagreeing: reply with concise technical evidence and references
- if deferring: reply with explicit reason, risk, and planned follow-up location

Do not leave ambiguous silent decisions.

## Output Format (Session Deliverable)

Return a compact triage report:

1. **Blockers fixed**
2. **Items disagreed with (and why)**
3. **Deferred non-blockers**
4. **Current check status snapshot**
5. **Remaining actions to green merge**

Use the active snagging plan as the execution authority; this prompt is the
handover entry point.

## Decision Heuristic for Copilot Comments

When Copilot comments are present:

- treat them as hypotheses
- validate against current code, tests, and repository rules
- accept only when evidence confirms the claim
- otherwise mark `DISAGREE` with proof

This repo values correctness and evidence, not reviewer deference.
