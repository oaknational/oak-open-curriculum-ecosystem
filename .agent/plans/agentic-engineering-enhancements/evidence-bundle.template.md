# Evidence Bundle Template

Use this template for any non-trivial engineering claim in plans, reviews, or merge-readiness updates.

This is intentionally minimal: enough evidence to verify claims without bloating documentation.

## 0. Storage Convention

For this collection, store evidence bundles under:

- `.agent/plans/agentic-engineering-enhancements/evidence/`

File naming pattern:

- `YYYY-MM-DD-<plan-slug>-<phase>-<run-id>.evidence.md`

Example:

- `2026-02-24-hallucination-evidence-guards-phase1-run-003.evidence.md`

## 1. Run Context

- Run ID: `[run-id]`
- Plan: `[plan-file.md]`
- Workstream/Phase: `[phase-id]`
- Author: `[name]`
- Date (YYYY-MM-DD): `[date]`

## 2. Claim Register

| Claim ID | Claim Class | Claim Statement | Evidence Refs | Status |
|---|---|---|---|---|
| C-001 | tests-pass | `[statement]` | E-001, E-002 | verified |
| C-002 | behaviour-change | `[statement]` | E-003, E-004 | verified |
| C-003 | api-compat | `[statement]` | E-005 | partially verified |

Allowed statuses: `verified`, `partially verified`, `unverified`.

## 3. Evidence Index

| Evidence ID | Type | Summary | Location |
|---|---|---|---|
| E-001 | command-output | `pnpm type-check passed` | `[artifact path or log reference]` |
| E-002 | command-output | `targeted tests passed` | `[artifact path or log reference]` |
| E-003 | file-span | `implementation delta` | `[path/to/file.ts:line]` |
| E-004 | file-span | `behaviour assertion in test` | `[path/to/test.unit.test.ts:line]` |
| E-005 | diff-span | `API surface unchanged` | `[diff reference]` |

## 4. Command Evidence

List exact commands executed and whether they passed.

| Command | Result | Output Ref |
|---|---|---|
| `pnpm type-check` | pass | E-001 |
| `pnpm test --filter [target]` | pass | E-002 |

## 5. File-Span Evidence

Use precise file spans for implementation and test evidence.

- E-003: `[path/to/file.ts:line]` - `[what this proves]`
- E-004: `[path/to/test.unit.test.ts:line]` - `[what this proves]`

## 6. Behaviour and Risk Notes

- Behaviour change summary: `[what changed from observed evidence]`
- Known uncertainty: `[what remains uncertain]`
- Risk impact: `[none/low/medium/high + rationale]`

## 7. Open Items (if any)

- `[claim id]` remains `partially verified` because `[reason]`
- Follow-up action: `[action]`

## 8. Merge-Readiness Check

- [ ] Every non-trivial claim has at least one evidence reference
- [ ] No "tests pass" claim without command/output evidence
- [ ] Behaviour claims anchored to test or runtime evidence
- [ ] Remaining uncertainty is explicit and tracked

If any box is unchecked, the change is not merge-ready.
