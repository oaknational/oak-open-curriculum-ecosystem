# Component: Adversarial Review Phase

After implementation is complete and all quality gates pass,
invoke specialist reviewers for an adversarial sweep.

## When to Use

- After completing a non-trivial feature or workstream
- After structural refactors touching module boundaries
- Before marking a plan as complete and archiving it

## Review Protocol

0. **Verify plan compliance** (always — before any specialist review):
   Check that every acceptance criterion from the plan is met and every
   deterministic validation command produces its expected output. If any
   criterion is unmet or any command fails, stop and fix before proceeding
   to specialist reviews. This prevents reviewing code that doesn't match
   the plan's specification.
1. **Invoke `code-reviewer`** (always — gateway reviewer)
2. **Invoke domain-specific specialists** based on change profile:

| Change Category | Specialist(s) |
|----------------|---------------|
| Structural/boundary changes | `architecture-reviewer-barney`, `architecture-reviewer-betty`, `architecture-reviewer-fred`, `architecture-reviewer-wilma` |
| Test changes | `test-reviewer` |
| Type-system complexity | `type-reviewer` |
| Auth/secrets/PII | `security-reviewer` |
| Docs/ADR changes | `docs-adr-reviewer` |
| Config/quality-gate changes | `config-reviewer` |

3. **Document findings** using this severity scheme:

| Severity | Meaning | Action |
|----------|---------|--------|
| BLOCKER | Correctness or safety gap | Must fix before considering complete |
| WARNING | Improvement opportunity | Should fix; schedule if not immediate |
| NOTE | Observation | Consider; no action required |

4. **Create follow-up plan** if BLOCKERs or significant WARNINGs found.
   Do not expand the current plan — create a new workstream.

## Findings Documentation

Document findings in the plan, then consolidate:

- **BLOCKERs become tasks** in a follow-up plan with acceptance criteria
- **WARNINGs become backlog items** with priority
- **NOTEs are recorded** but need no further action

The session prompt should reference the follow-up plan,
not duplicate the findings.
