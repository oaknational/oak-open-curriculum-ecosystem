# WS3 Resume Evidence — `sentry-release-identifier-single-source-of-truth.plan.md`

**Authored**: 2026-04-25 (Jazzy / claude-code / claude-sonnet-4-6)
**Purpose**: capture the pause-time state of WS3 so the next session
can resume from explicit context. The 15-item amendment substance is
already applied to ADR-163 in the staged working tree; this file records
ONLY the things a resuming agent needs that are not visible in the diff.

---

## Pause Status (one-line)

WS3 substance is staged in the git index (8 files); pre-commit
**knip** gate blocks on a **parallel-track unresolved import**
(`apps/oak-curriculum-mcp-streamable-http/smoke-tests/modes/local-stub-env.unit.test.ts:3`
imports `./local-stub-env.js` which the parallel
`mcp-local-startup-release-boundary.plan.md` agent has not yet
landed). HEAD is unchanged at `015ac99b`.

## Pause-Time Git State

```text
Staged (WS3 substance — preserves git mv rename detection):
  M  apps/.../build-scripts/vercel-ignore-production-non-release-build.mjs
  A  apps/.../build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs
  M  apps/.../package.json
  M  docs/architecture/architectural-decisions/163-...md
  M  docs/architecture/architectural-decisions/README.md
  D  packages/core/build-metadata/build-scripts/vercel-ignore-...mjs
  D  packages/core/build-metadata/build-scripts/vercel-ignore-...unit.test.mjs
  M  pnpm-lock.yaml

Unstaged WS3 dependency (must fold into WS3 commit on resume):
   M knip.config.ts        (added 'build-scripts/**/*.mjs' to app's
                            entry + project globs so knip detects
                            semver/@types/semver as used)

Unstaged parallel-track WIP (do NOT touch):
   M .agent/memory/active/napkin.md
   M .agent/memory/operational/repo-continuity.md
   M .agent/memory/operational/threads/agentic-engineering-enhancements.next-session.md
   M .agent/memory/operational/threads/observability-sentry-otel.next-session.md
   D .agent/plans/observability/current/mcp-local-startup-release-boundary.plan.md
   M apps/.../operations/development/http-dev-contract.unit.test.ts
   M packages/libs/sentry-node/src/config.unit.test.ts
   ?? .agent/plans/observability/active/mcp-local-startup-release-boundary.{plan,phase-0-evidence,phase-1-red-evidence}.md
   ?? .cursor/plans/promote_startup_boundary_*.plan.md
   ?? .cursor/plans/startup_boundary_phase1_*.plan.md
   ?? apps/.../smoke-tests/modes/local-stub-env.unit.test.ts          ← knip blocker
   ?? apps/.../src/app/app-version-header.unit.test.ts
   ?? apps/.../src/landing-page/render-landing-page.unit.test.ts
   ?? apps/.../src/observability/http-observability.integration.test.ts
   ?? apps/.../src/runtime-config.integration.test.ts
```

## What WS3 Already Did (substance is in the staged diff)

1. **Relocated** the cancellation script + unit test from
   `packages/core/build-metadata/build-scripts/` into
   `apps/oak-curriculum-mcp-streamable-http/build-scripts/` (single
   consumer; `git mv` preserved rename detection in the index).
2. **Deleted** the in-app shim in-place; deleted the dead `.d.ts`
   companion (untracked anyway under `**/*.d.ts` gitignore).
3. **Added** `semver@^7.7.4` + `@types/semver@^7.7.1` as
   `devDependencies` of `apps/oak-curriculum-mcp-streamable-http`;
   lockfile refreshed by `pnpm install`.
4. **Rewrote** the script body (~205 → ~127 lines after Prettier; ~50
   lines of decision logic). Branch gate
   (`VERCEL_GIT_COMMIT_REF !== 'main'`), asymmetric current/previous
   handling, `semver.valid` + `semver.lte`, default-export CLI
   entrypoint guarded by `pathToFileURL` is-main check.
5. **Rewrote** the unit tests as 8 tests: one per row of the new
   5-row truth table plus 2 fetch-fallback variants (`pnpm vitest run`
   on the file alone: 8/8 green at pause time).
6. **Applied** all 15 amendment items to ADR-163 + the ADR index
   `README.md` entry. Reviewer Dispositions block renamed to
   `(2026-04-24 first amendment)` and a new
   `(2026-04-24 second amendment)` block was appended with the §3.0
   reviewer dispositions verbatim.

## §3.0 Reviewer Gate Outcome

Both `docs-adr-reviewer` and `assumptions-reviewer` were dispatched on
the drafted amendment per plan §3.0. Both reported **two BLOCKING
findings** in the original 13-item enumeration:

- `assumptions-reviewer` Disposition #6 was not retracted but
  references the "primary anti-drift gate" claim that Item 10
  retracts from §1 and Item 11 retracts from Enforcement §5.
- `architecture-reviewer-fred` Disposition #3 (devDep edge for the
  cross-resolver contract test) and two sub-clauses of its
  positive-note #4 (boundary discipline for retracted test
  placements) were not retracted but reference the same surfaces.

Enumeration was expanded **13 → 15 items** (Items 14, 15a, 15b added).
Cross-check Matrix in the staged ADR diff documents all 15 items with
their target line ranges. MAJOR findings (Item 1 line range
preservation; Item 10 trailing blockquote separator) and MINORs (Item
11 retract-with-note framing; Item 7 final bullet-order note; Item 9
grep-friendly placeholder; Item 2 phrasing softened per I3) were all
absorbed before the staged diff was finalised. Full disposition
record is in the ADR's
`## Reviewer Dispositions (2026-04-24 second amendment)` block.

## Resume Instructions (next session)

### Step 1 — Verify state has not drifted

```bash
git status --short
git rev-parse HEAD                           # should still be 015ac99b
                                              # (or advanced by parallel agent)
git diff --cached --stat                      # 8 staged files; rename detection
                                              # for the script + unit-test moves
```

If a parallel-agent commit advanced HEAD and modified ADR-163 or
streamable-http app files, re-verify the staged WS3 substance still
applies cleanly. The 15-item amendment is in the staged diff; if any
target line ranges drifted, audit before continuing.

### Step 2 — Stage the knip config fix

```bash
git add knip.config.ts
```

This folds the `'build-scripts/**/*.mjs'` glob fix into the WS3
commit. Without it, knip flags `semver` + `@types/semver` as unused.

### Step 3 — Confirm parallel-track unresolved import is resolved

The pre-commit knip gate blocked at pause time on:

```text
Unresolved imports (1)
  ./local-stub-env.js  apps/.../smoke-tests/modes/local-stub-env.unit.test.ts:3:43
```

Re-run `pnpm knip` and check whether
`apps/.../smoke-tests/modes/local-stub-env.js` (or `.ts`) now exists
in the working tree. If yes, proceed to Step 4. If no, ask the owner
whether to: (a) wait for parallel agent to land it, or (b) request
fresh `--no-verify` authorisation per
`.agent/rules/no-verify-requires-fresh-authorisation.md`.

### Step 4 — Run the WS3 commit

The commit message body (drafted, validated against commitlint at
pause time) is preserved in the conversation transcript that produced
this evidence file. If that transcript is lost, the message body
should enumerate the 15 amendment items inline (assumptions-reviewer
I2). Subject:

```text
refactor(mcp-http,adr-163): relocate cancellation script, simplify via semver, second amendment
```

Use `git commit -F - <<'EOF' … EOF` (HEREDOC), validated first via
`./scripts/check-commit-message.sh -F -`. The drafted message hits
zero commitlint errors (one cosmetic `footer-leading-blank` warning).

### Step 5 — Follow-up commit: fill the WS3 hash placeholder

The new History entry contains `[[TODO:FILL_WS3_COMMIT_HASH]]`. After
the WS3 commit lands, run a one-line follow-up commit:

```bash
WS3_HASH=$(git log -1 --format=%h)
sed -i '' "s/\[\[TODO:FILL_WS3_COMMIT_HASH\]\]/${WS3_HASH}/" \
  docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md
git add docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md
# Commit message: docs(adr-163): fill second-amendment commit hash in history entry
```

### Step 6 — Run quality gates (plan §WS5)

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test
pnpm --filter @oaknational/build-metadata test
pnpm type-check
pnpm lint
pnpm knip
pnpm depcruise
pnpm markdownlint:root
```

`pnpm check` will likely still fail in the streamable-http
`smoke:dev:stub`, `test:ui`, `test:a11y` paths — that is the parallel
`mcp-local-startup-release-boundary.plan.md` lane, not a WS3 issue.
Confirm failure mode matches the known blocker; do not paper over.

## Behavioural Carry-Forward (read before resuming)

- **Pippin's spiral** (2026-04-24): plan-revision absorption became
  inflation. Do NOT re-plan the 15-item enumeration — it has been
  reviewed at the §3.0 gate, BLOCKING findings absorbed, and applied.
  If a resuming agent finds a surface the enumeration missed, that is
  a finding for a follow-up amendment, not a re-draft of WS3.
- **Frodo's voluntary stop** (2026-04-24): when a refactor surfaces a
  natural commit boundary under accumulating context, volunteer the
  pause. This session followed that discipline at the
  knip-gate-blocker boundary — the blocker is parallel-track coupling,
  not a WS3 defect, and pushing through with `--no-verify` would
  bypass a gate that is genuinely catching state.
- **Don't touch parallel-track WIP**. The streamable-http app +
  `.agent/memory/` files unstaged at pause time are the parallel
  `mcp-local-startup-release-boundary.plan.md` agent's working set.
  Resume must use explicit pathspec on `git add` (never `git add -A`)
  to preserve the parallel-track surface.

## Files Of Interest

- ADR (full diff in working tree): `docs/architecture/architectural-decisions/163-sentry-release-identifier-and-vercel-production-attribution.md`
- ADR index: `docs/architecture/architectural-decisions/README.md`
- Script: `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`
- Tests: `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs`
- Knip glob fix (unstaged): `knip.config.ts`
- Plan §WS3 (authoritative): `.agent/plans/observability/current/sentry-release-identifier-single-source-of-truth.plan.md` lines 945–1352
