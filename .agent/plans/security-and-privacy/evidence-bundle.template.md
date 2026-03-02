# Security Evidence Bundle Template

Use this template for non-trivial security claims in plans, reviews, and
merge-readiness updates.

## 0. Storage Convention

For this collection, store evidence bundles under:

- `.agent/plans/security-and-privacy/evidence/`

File naming pattern:

- `YYYY-MM-DD-<plan-slug>-<phase>-<run-id>.evidence.md`

Example:

- `2026-02-24-security-hardening-phase1-run-001.evidence.md`

## 1. Run Context

- Run ID: `[run-id]`
- Plan: `[plan-file.md]`
- Workstream/Phase: `[phase-id]`
- Author: `[name]`
- Date (YYYY-MM-DD): `[date]`

## 2. Claim Register

| Claim ID | Claim Class | Claim Statement | Evidence Refs | Status |
|---|---|---|---|---|
| C-001 | security-control-enabled | `[statement]` | E-001, E-002 | verified |
| C-002 | policy-enforced | `[statement]` | E-003 | verified |
| C-003 | tests-pass | `[statement]` | E-004 | partially verified |
| C-004 | risk-reduced | `[statement]` | E-005 | unverified |

Allowed statuses: `verified`, `partially verified`, `unverified`.

## 3. Evidence Index

| Evidence ID | Type | Summary | Location |
|---|---|---|---|
| E-001 | command-output | `validation command passed` | `[artifact path or log reference]` |
| E-002 | file-span | `control implementation location` | `[path/to/file.ts:line]` |
| E-003 | policy-doc | `policy update with explicit rule` | `[path/to/doc.md:line]` |
| E-004 | command-output | `tests passed` | `[artifact path or log reference]` |
| E-005 | risk-note | `residual risk analysis` | `[path/to/risk-note.md:line]` |

## 4. Command Evidence

List exact commands executed and whether they passed.

| Command | Result | Output Ref |
|---|---|---|
| `[command]` | pass/fail | E-001 |
| `[command]` | pass/fail | E-004 |

## 5. Security and Risk Notes

- Threat(s) addressed: `[threat ids or summary]`
- Behaviour change summary: `[what changed from observed evidence]`
- Residual risk: `[none/low/medium/high + rationale]`
- Follow-up needed: `[yes/no + action]`

## 6. Merge-Readiness Check

- [ ] Every non-trivial security claim has at least one evidence reference
- [ ] No "control enabled" claim without command/output or file-span evidence
- [ ] Policy claims anchor to an explicit policy source
- [ ] Remaining uncertainty is explicit and tracked

If any box is unchecked, the change is not merge-ready.
