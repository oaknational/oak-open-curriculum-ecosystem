---
lineage:
  serves_thread: ci-and-test-efficiency
  serves_stream: developer-experience
  derives_from: "2026-06-24 CI-efficiency scan; ci.yml single-job structure"
---

# CI: parallelise the static checks alongside build+test

**Status**: FUTURE (strategic brief — not executable until promoted)
**Priority**: Medium (bounded win; measure after the vitest-pool change)
**Created**: 2026-06-24
**Owner**: Engineering

## Problem and intent

`run-quality-gates` is a **single sequential job**. Independent fast static checks —
secret-scan, format, markdown, shell-lint, subagents, portability, repo-validators
(~1–2 min combined) — run in a line *before* the dominant `build type-check lint test`
turbo step, instead of alongside it.

Intent: overlap the fast static checks with the expensive build+test so total wall-clock
is `max(static, build+test)` not `static + build+test`, with **no check dropped**.

## End goal · mechanism · means

- **Goal**: cut total CI wall-clock by the static-check duration.
- **Mechanism**: GitHub Actions jobs run concurrently; a separate `static-checks` job
  finishes during the build+test job.
- **Means**: extract the static checks into a parallel job. Account for the per-job
  `pnpm install` overhead (mitigated by `actions/setup-node` `cache: pnpm`) — confirm the
  net is positive before landing.

## Acceptance criteria (outcome, not activity)

- Total CI wall-clock drops by ~the static-check span (net of per-job install overhead).
- Every check that ran before still runs (no gate removed or weakened).
- A failing static check still fails the overall CI status.

## Dependencies and sequencing

- **Beneficial coupling**: touches `ci.yml`, same file as `ci-cache-playwright-browser`.
  Not blocking — sequence the two on `ci.yml`, don't co-branch.
- **Sequence after** the vitest-pool change: if `threads` already cuts most of the
  build+test time, re-measure before investing here — the relative win shrinks.

## Non-goals

- Not test-sharding across runners (a separate, larger change).
- Not dropping `--continue` reporting or any individual check.

## Risks and unknowns

- Per-job `pnpm install` + turbo-setup overhead could eat the gain → measure net wall-clock
  on a trial branch before landing; abandon if not positive.

## Promotion trigger

Owner greenlights AND a post-vitest-pool measurement confirms the static-check span is
still a worthwhile fraction of total wall-clock.

## Foundation alignment

principles.md (no waste; right tool). Same checks, same depth — only their scheduling changes.
