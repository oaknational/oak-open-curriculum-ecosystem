---
name: Dependency latest sweep
overview: Bump every workspace dependency to the latest registry versions (`pnpm update -r --latest`), refresh the lockfile, then run the repo’s canonical aggregate gate (`pnpm check`) and fix any regressions. Route specialist reviewers for Clerk, Sentry, and toolchain bumps when those surfaces change.
todos:
  - id: branch-and-update
    content: On current branch — ensure clean tree or intentional staged/untracked separation; run `pnpm update -r --latest`, resolve any pinned-major packages, `pnpm install`, refresh Playwright browsers if needed
    status: completed
  - id: pnpm-check
    content: Run `pnpm check`; fix type/build/lint/test/knip/depcruise failures iteratively
    status: completed
  - id: reviewers-pr
    content: Route Clerk/Sentry/config reviewers when relevant; open PR with frozen lockfile for CI
    status: in_progress
isProject: false
---

# Update all packages to latest with quality gates

## Scope and constraints

- **Target repo:** [oak-open-curriculum-ecosystem](/Users/jim/code/oak/oak-open-curriculum-ecosystem) (pnpm workspace, Node **24.x** per [`package.json`](package.json) `engines`).
- **Bump strategy (your choice):** `pnpm update -r --latest` so each declared dependency moves to the **latest** npm version, including majors where manifests allow or where you explicitly widen ranges if pnpm refuses without a range change.
- **Do not touch:** `workspace:*` protocol deps — they resolve inside the monorepo, not the registry. Root [`pnpm.overrides`](package.json) stay unless a failing resolution forces an intentional override adjustment (prefer fixing the consumer first).

## Execution sequence

1. **Working branch** — You are already on the appropriate branch; no checkout step. Prefer a clean working tree (or isolate unrelated edits) before bumping so diffs stay attributable.
2. **Apply updates** — From repo root:
   - `pnpm update -r --latest`
   - If any package stays stale because `package.json` pins an older major, bump that entry (or run `pnpm --filter <pkg> add <dep>@latest`) until `pnpm -r outdated --format json` is empty or only explains intentional holds.
3. **Install / native tooling** — Run `pnpm install`. If Playwright or browsers jump versions, align with [`package.json`](package.json) script `update:playwright` pattern or `pnpm exec playwright install --with-deps` so `test:ui` / CI browser steps stay consistent.
4. **Canonical quality gate** — Run **`pnpm check`** once dependencies settle. This is the repo-defined aggregate ([`package.json` scripts](package.json)): `secrets:scan`, `clean`, `test:root-scripts`, full Turbo pipeline (`sdk-codegen`, `build`, `type-check`, `doc-gen`, `lint:fix`, unit/widget/E2E/UI/a11y suites), `lint:shell`, `subagents:check`, `portability:check`, `knip`, `depcruise`, `markdownlint:root`, `format:root`.
5. **Fix regressions in dependency order** — Typical failure order:
   - **TypeScript / build** — compiler or `sdk-codegen` failures after OpenAPI/codegen-related packages move.
   - **ESLint / Prettier** — rule or parser churn after `@typescript-eslint/*`, `eslint`, or plugin bumps.
   - **Runtime tests** — Clerk, Sentry, Zod, Elasticsearch client, Vite, React/Next-adjacent tooling if any packages shifted majors.
   - **Knip / depcruise** — unused-export or boundary violations exposed by stricter analysis after upgrades.

## CI vs local `pnpm check`

- [**`.github/workflows/ci.yml`**](.github/workflows/ci.yml) runs a **subset** of what `pnpm check` runs (e.g. Turbo omits `doc-gen`, widget tests, and several a11y tasks). Treat **`pnpm check` as the bar** for “nothing breaks” locally; open a PR so CI still runs on frozen lockfile.

## Reviewer routing (Practice)

After edits stabilize, use readonly Task reviewers per [invoke-code-reviewers](.agent/rules/invoke-code-reviewers.md):

- **Clerk** — if `@clerk/*` versions changed ([invoke-clerk-reviewer](.cursor/rules/invoke-clerk-reviewer.mdc)).
- **Sentry** — if `@sentry/*` or observability wiring changed ([invoke-sentry-reviewer](.cursor/rules/invoke-sentry-reviewer.mdc)).
- **Config / ESLint** — if ESLint, TypeScript-eslint, or turbo config behaviour shifts materially ([invoke-code-reviewers](.agent/rules/invoke-code-reviewers.md) → config-reviewer).

## Deliverable

- Single coherent PR: lockfile + manifest bumps + any minimal code/config fixes required for green **`pnpm check`**, with commit message following the repo commit skill / conventional format.

## Risk note

`--latest` can introduce **multiple breaking majors at once**. If `pnpm check` surfaces unrelated failures across many stacks, a pragmatic fallback is splitting into 2–3 PRs (toolchain → runtime SDKs → app-specific) while keeping each branch green — only if a single sweep proves uneconomical.
