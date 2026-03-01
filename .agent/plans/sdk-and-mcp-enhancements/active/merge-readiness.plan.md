---
name: "Merge readiness: feat/semantic_search_deployment → main"
overview: "Three blocking items, then commit, gates, and merge."
todos:
  - id: prompt-investigation
    content: "Investigate MCP prompts: keep, remove, or redesign the three existing prompts; consider adding a user-facing prompt"
    status: done
  - id: verify-preview
    content: "Verify the preview branch Vercel deploy works end-to-end"
    status: pending
  - id: onboarding-review
    content: "Final onboarding review: junior dev and lead dev personas"
    status: done
  - id: commit-and-gates
    content: "Commit outstanding work, run full quality gates, secrets sweep"
    status: done
  - id: merge
    content: "Merge feat/semantic_search_deployment to main"
    status: pending
isProject: false
---

# Merge Readiness: `feat/semantic_search_deployment` → `main`

**Last Updated**: 2026-03-01
**Status**: Verify deploy and merge remaining. Prompts, onboarding, and commit done.
**Branch**: `feat/semantic_search_deployment`

---

## Blocking Items

### 1. ~~Investigate MCP prompts~~ DONE

Completed. See [ADR-123](../../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md).

- All prompts confirmed as correct MCP primitive (user-controlled workflow templates).
- `progression-map` removed (subsumed by `learning-progression`).
- `explore-curriculum` and `learning-progression` registered and tested.
- 4 prompts: `find-lessons`, `lesson-planning`, `explore-curriculum`, `learning-progression`.
- ADR-123 documents the primitives strategy, prompt selection criteria, and deduplication rationale.
- HTTP MCP README and root README updated with MCP primitives sections.

### 2. Verify preview branch Vercel deploy

- Confirm the Vercel preview deployment of `feat/semantic_search_deployment`
  is live and functional.
- Smoke-test: healthcheck, MCP endpoint, at least one tool call.
- If broken, diagnose and fix before merge.

### 3. ~~Final onboarding review~~ DONE

Completed. Junior dev and lead dev personas ran discovery-based from README.md.

- 5 P0/P1 fixes applied: stale CLI commands, ghost env vars, env example gap.
- 8 P2 items actioned: docs annotations, widget cast TODOs, test count removal.
- ESLint-disable audit: 3 search CLI `as` casts fixed (template literal types),
  remaining items (REFACTOR markers, test fake casts, max-lines) added to post-merge plan.

---

## After Blocking Items

### 4. ~~Commit and gates~~ DONE

Committed as single combined commit. Pre-commit hooks ran full quality gate
chain (type-check, lint, test across 13 packages). All gates green.

Remaining:
- `pnpm secrets:scan:all` — final secrets sweep (human decision).
- Manual sensitive-information review (human decision).

### 5. Merge

- Merge `feat/semantic_search_deployment` to `main`.
- Make repository public on GitHub (M0 gate).

---

## References

- [ws1 plan](ws1-get-curriculum-model.plan.md) — completed, follow-ups tracked here and in post-merge plan
- [Release plan](../../release-plan-m1.plan.md) — M0/M1 gates and full history
- [Post-merge plan](../future/post-merge-tidy-up.plan.md) — non-blocking follow-ups
