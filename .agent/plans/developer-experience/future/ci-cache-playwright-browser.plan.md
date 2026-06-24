---
lineage:
  serves_thread: ci-and-test-efficiency
  serves_stream: developer-experience
  derives_from: "2026-06-24 CI-efficiency scan; ci.yml 'Install Playwright browsers' step"
---

# CI: cache the Playwright browser install

**Status**: FUTURE (strategic brief — not executable until promoted)
**Priority**: High (cheap, certain win)
**Created**: 2026-06-24
**Owner**: Engineering

## Problem and intent

`ci.yml` runs `pnpm exec playwright install --with-deps chromium` on **every** CI run,
before the build step. It is uncached, so the browser binary (and OS deps) are
downloaded/installed every time — ~30–90s of repeated, identical work per run, paid
even when nothing about Playwright changed.

Intent: cache the browser so the install is a near-instant no-op on the common path,
with **no change** to what the UI tests do.

## End goal · mechanism · means

- **Goal**: remove the repeated browser-download cost from every CI run.
- **Mechanism**: `actions/cache` restores the Playwright browser cache keyed on the
  resolved Playwright version; on a hit, `install` finds the browser present and exits fast.
- **Means**: add a cache step keyed on the lockfile-resolved Playwright version (e.g.
  `~/.cache/ms-playwright`) before the install; keep `--with-deps` only on a cache miss
  (OS deps are the slow apt part), or split browser-binary cache from `--with-deps`.

## Acceptance criteria (outcome, not activity)

- On an unchanged Playwright version, the install step drops from tens of seconds to ~seconds.
- On a Playwright version bump, the cache misses and a fresh install runs (correctness preserved).
- `test:ui` still runs and passes — no reduction in UI coverage.

## Dependencies and sequencing

- **Beneficial coupling**: touches `ci.yml`, same file as `ci-parallelise-static-checks`.
  Not blocking — whichever lands first, the other rebases. Sequence, don't co-branch.
- Independent of the vitest-pool and test-design plans.

## Non-goals

- Not removing or weakening the UI E2E tests.
- Not changing install behaviour on a genuine version bump (must still fetch).

## Risks and unknowns

- Wrong cache key → stale browser used after a version bump. Mitigate by keying strictly
  on the resolved Playwright version from the lockfile, not a static string.

## Promotion trigger

Owner greenlights. Small and ready; lands as its own focused branch.

## Foundation alignment

principles.md (right tool for the job; no waste), testing-strategy.md (Playwright for UI
E2E — unchanged). Pure CI-config efficiency; breadth/depth untouched.
