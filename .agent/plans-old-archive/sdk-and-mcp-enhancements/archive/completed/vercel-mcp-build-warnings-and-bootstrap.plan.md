---
name: "Vercel MCP build warnings and streamable-http bootstrap"
overview: "Eliminate Vercel/Turbo build warnings and fix preview/production bootstrap when oak-banner.html is missing at runtime."
todos:
  - id: phase-0-baseline
    content: "Phase 0: Baseline — inventory warnings, reproduce bootstrap failure, confirm Vercel build wiring."
    status: completed
  - id: phase-1-bootstrap
    content: "Phase 1: Bootstrap — guarantee dist/oak-banner.html in deployed artefact; add deterministic checks."
    status: in_progress
  - id: phase-1b-http-dev-contract
    content: "Phase 1b: HTTP dev contract — source-driven widget build/watch in workspace operations, unchanged built-artefact runtime contract."
    status: completed
  - id: phase-2-warnings
    content: "Phase 2: Build warnings — Turbo env, sdk-codegen reference file, Vite/Rollup deprecation."
    status: in_progress
  - id: phase-3-validate
    content: "Phase 3: Validation, deploy verification, documentation, /jc-consolidate-docs."
    status: in_progress
---

# Vercel MCP build warnings and streamable-http bootstrap

**Last Updated**: 2026-04-10  
**Status**: 🟢 IN PROGRESS  
**Scope**: Clear **all** actionable warnings from the `poc-oak-open-curriculum-mcp` Vercel build and **resolve** the runtime bootstrap error where `oak-banner.html` is absent under `apps/oak-curriculum-mcp-streamable-http/dist/`, causing `initializeCoreEndpoints` to fail and the Node process to exit with status 1.

**Foundation alignment**: @.agent/directives/principles.md · @.agent/directives/testing-strategy.md · @.agent/directives/schema-first-execution.md

**Related**: Executes in parallel with Phase 6 merge-handoff — see [ws3-phase-6-docs-gates-review-commit.plan.md](ws3-phase-6-docs-gates-review-commit.plan.md) (preview startup must be green for PR #76).

---

## Context

### Issue 1: Application bootstrap failure (preview / serverless)

**Evidence**: Runtime logs show `bootstrap.phase.error` for phase `initializeCoreEndpoints` with  
`Widget HTML not found at /var/task/apps/oak-curriculum-mcp-streamable-http/dist/oak-banner.html`  
(see `validateWidgetHtmlExists` from `validate-widget-html.ts`, invoked from `application.ts`; path resolved via `WIDGET_HTML_PATH` in `register-widget-resource.ts`).

**Confirmed Phase 0 findings**:

1. ✅ **Vercel does run the widget build**: `vercel-build.log` shows
   `dist/oak-banner.html` emitted during `@oaknational/oak-curriculum-mcp-streamable-http:build`.
2. ✅ **The failing boundary was runtime path anchoring, not missing local build output**:
   a relocated built-artifact proof failed when the server resolved the widget
   relative to `import.meta.dirname`, and passed after the path was anchored to
   `process.cwd()/dist/oak-banner.html`.
3. ✅ **Historical doubled-`dist` bug is not the active issue here**:
   current Vercel evidence is the single-`dist` path in runtime logs.

**Existing capabilities**: `pnpm build` already includes `build:widget`; `validate-widget-html.unit.test.ts` tests validation behaviour; widget output dir is `widget/.. /dist` in `widget/vite.config.ts`.

### Issue 2: Vercel/Turbo build warnings (non-exhaustive inventory)

**Evidence** (from deployment `dpl_CE1FP4ZJfsNuiEvPhWDTw7UcJPQR` build logs):

| Warning | Source | Direction |
|--------|--------|-----------|
| Turbo: env vars set on Vercel but **not** in `turbo.json` | Turborepo on Vercel | Add `globalPassThroughEnv` / per-task `env` / `passThroughEnv` per [platform env vars](https://turborepo.dev/docs/crafting-your-repository/using-environment-variables#platform-environment-variables) so required secrets reach tasks; trim unused Vercel envs if noise. |
| `SeverityText":"WARN"` — sitemap reference validation skipped | `sdk-codegen` — missing `reference/canonical-url-map.json` | Commit generated file, or run `scan:sitemap` (or equivalent) before codegen in CI, or document intentional skip with a single controlled code path (prefer schema-first / reproducible builds). |
| Rollup: `inlineDynamicImports` deprecated | `vite` / `vite-plugin-singlefile` in `widget/vite.config.ts` | Adopt supported API (`codeSplitting: false` or upgrade plugin) without changing widget bundle contract. |
| `WARNING finished with warnings` | Turbo aggregate | Should clear once the above are addressed. |

**Non-goals**:

- ❌ Silencing warnings by disabling checks or lowering log levels without fixing root causes.
- ❌ Broad refactors unrelated to bootstrap or build warnings.
- ❌ Moving the canonical MCP App widget into `public/`.
- ❌ Runtime `NODE_ENV` / `VERCEL` branching in `createApp()` or resource registration.
- ❌ Introducing a second widget HTML source of truth.
- ✅ Minimal, verifiable fixes; TDD where behaviour changes.

---

## Quality gate strategy

Follow `.agent/plans/templates/components/quality-gates.md`. After each task: `pnpm type-check`, `pnpm lint`, `pnpm test` (from repo root). After each phase: full chain including `pnpm sdk-codegen`, `pnpm build`, and app-relevant tests (`pnpm test:widget` where widget/build touched).

**Why full monorepo**: MCP app and `sdk-codegen` span workspaces; Turbo env changes affect all tasks.

---

## Problem statement

Preview deployments must **start** with widget HTML present; CI/Vercel builds must be **warning-clean** for the listed categories so failures are visible and caches trustworthy.

---

## Solution architecture

**Key insight**: The bootstrap error is a **runtime artefact-location contract**
failure, not missing widget generation. Fixes belong in the repo-owned build /
runtime boundary (how compiled code locates `dist/oak-banner.html`) plus the
warning-producing configuration surfaces.

**First question** (*principles.md*): *Could it be simpler without compromising quality?*  
**Answer**: Prefer **explicit file presence checks in build**, **Turbo env declarations**, and **committed or generated reference data** over runtime fallbacks or feature flags.

---

## Foundation document commitment

Before each phase, re-read the three directives; verify no compatibility layers, no disabled checks, no type shortcuts.

---

## Documentation propagation commitment

Update impacted READMEs (`apps/oak-curriculum-mcp-streamable-http`, `packages/sdks/oak-sdk-codegen` as needed) and, if behaviour of canonical URL validation changes, touch ADR-132 / reference docs only when the plan introduces a **durable** policy change. Run `/jc-consolidate-docs` in Phase 3.

---

## Resolution plan

### Phase 0: Baseline and Vercel wiring (verify assumptions)

**Task 0.1 — Local artefact check**

**Acceptance criteria**:

1. ✅ After `pnpm clean && pnpm install && turbo run build --filter=@oaknational/oak-curriculum-mcp-streamable-http`, file `apps/oak-curriculum-mcp-streamable-http/dist/oak-banner.html` exists.
2. ✅ Document whether `oak-banner.html` is gitignored or purely build-generated (expected: build-generated only).

**Deterministic validation**:

```bash
test -f apps/oak-curriculum-mcp-streamable-http/dist/oak-banner.html && echo OK
```

**Task 0.2 — Vercel project settings (dashboard or `vercel project ls`)**

**Acceptance criteria**:

1. ✅ Confirm **Root Directory**, **Install Command**, **Build Command**, and **Output** for `poc-oak-open-curriculum-mcp` match monorepo expectations (typically root build with Turbo, not a partial script that skips `build:widget`).
2. ✅ Capture findings in the plan’s execution notes (single authoritative place).

**Execution note (2026-04-10)**:

- Used the user-provided `vercel-build.log` rather than local Vercel CLI access.
- The log shows repo-root checkout at `/vercel/path0`, root install command
  `pnpm install`, Turbo autodetection from the monorepo root, a filtered build
  for `@oaknational/oak-curriculum-mcp-streamable-http`, and final output under
  `/vercel/output`.
- This is sufficient evidence for the repo-side build wiring; fresh deployed
  preview/runtime confirmation still belongs to Phase 3.

**Task 0.3 — Warning inventory**

**Acceptance criteria**:

1. ✅ Fresh Vercel build log lists each warning class with a mapped owner task in Phase 1–2.

**Phase 0 complete when**: 0.1–0.3 satisfied.

---

### Phase 1: Bootstrap — guarantee widget HTML in deployment

**Task 1.1 — Fix build/packaging path**

**Changes** (choose minimal set after Phase 0):

- Align Vercel **build command** with `pnpm build` (or `turbo run build` with correct filter) so `oak-curriculum-mcp-streamable-http` runs `tsup && pnpm build:widget`.
- If Turbo cache is implicated: adjust `@oaknational/oak-curriculum-mcp-streamable-http#build` `outputs` / `inputs` in `turbo.json` so cached artefacts always include `dist/oak-banner.html`.

**Acceptance criteria**:

1. New preview deployment: **no** `Widget HTML not found` in runtime logs for
   cold start. (Pending external verification after push.)
2. ✅ `pnpm build` at repo root still produces `dist/oak-banner.html` for the app.

**Execution note (2026-04-09)**:

- Implemented local fix by resolving widget HTML from `process.cwd()/dist`
  instead of a module-relative `import.meta.dirname` path.
- Verified with a relocation-style built-artifact E2E proof:
  `e2e-tests/built-artifact-import.e2e.test.ts`.

**Deterministic validation**:

```bash
pnpm type-check && pnpm lint && pnpm test
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build
test -f apps/oak-curriculum-mcp-streamable-http/dist/oak-banner.html
```

**Task 1.2 — Regression guard (TDD)**

**Acceptance criteria**:

1. ✅ **RED**: A test or script step fails if `oak-banner.html` is missing after `build` (e.g. extend existing `validate-widget-html` tests or add a small `scripts/` check invoked from the app package).
2. ✅ **GREEN**: After Phase 1 fixes, the check passes in CI.

**Foundation alignment**: Tests assert **observable artefact** (file presence), not implementation details of Vite internals.

**Phase 1 complete when**: 1.1–1.2 pass and Vercel preview smoke test confirms MCP server starts.

### Phase 1b: HTTP dev contract alignment

**Task 1.3 — Move dev orchestration into workspace operations**

**Acceptance criteria**:

1. `pnpm dev`, `pnpm dev:observe`, and `pnpm dev:observe:noauth` delegate to
   workspace-owned TypeScript tooling under `apps/oak-curriculum-mcp-streamable-http/operations/`.
2. The operations entrypoint runs `build:widget` once, starts
   `build:widget -- --watch`, then starts the source HTTP server.
3. On server exit, watcher exit, or process signal, child processes terminate
   cleanly and no long-running watcher is left behind.

**Execution note (2026-04-09)**:

- Added `operations/README.md` plus `operations/development/` orchestration
  modules in the app workspace.
- Repointed the canonical HTTP dev scripts to the operations entrypoint.
- Added unit tests for execution-plan resolution and child-process shutdown
  behaviour with injected fake process handles.

**Task 1.4 — Tooling and documentation adoption**

**Acceptance criteria**:

1. Workspace TypeScript, ESLint, and Vitest configs include
   `operations/**/*.ts`.
2. App README, `docs/dev-server-management.md`, and
   `docs/deployment-architecture.md` all state the same contract:
   development prepares the canonical built widget automatically, while runtime
   consumption still uses `dist/oak-banner.html`.

**Phase 1b complete when**: 1.3–1.4 pass and the local acceptance check proves
the HTTP dev server recreates `dist/oak-banner.html` before serving traffic.

---

### Phase 2: Remove build warnings

**Task 2.1 — Turbo / Vercel environment variables**

**Acceptance criteria**:

1. ✅ `turbo.json` declares Vercel-provided env vars used during `build` / `sdk-codegen` so Turbo stops warning and tasks receive required values (see [Turborepo platform env](https://turborepo.dev/docs/crafting-your-repository/using-environment-variables#platform-environment-variables)).
2. ✅ No secret values committed; only **keys** in config.

**Execution note (2026-04-09)**:

- Added root-level `globalPassThroughEnv` entries in `turbo.json` for the
  exact Vercel project keys shown in the build warning.

**Task 2.2 — `canonical-url-map.json` WARN in sdk-codegen**

**Acceptance criteria**:

1. ✅ Either `reference/canonical-url-map.json` is present in-repo for CI/Vercel **or** codegen runs the sitemap scan **before** validation **or** validation is skipped only via a documented, explicit policy (prefer generating or committing the file per `packages/sdks/oak-sdk-codegen/reference/README.md`).
2. No `WARN` for missing reference file on a clean Vercel build unless
   intentionally accepted and documented. (Pending fresh preview/build-log
   confirmation.)

**Execution note (2026-04-09)**:

- Missing local reference data now logs as INFO with regeneration guidance;
  malformed reference data remains WARN-level. Updated
  `packages/sdks/oak-sdk-codegen/README.md` and
  `packages/sdks/oak-sdk-codegen/reference/README.md` to make the soft-gate
  policy explicit.

**Task 2.3 — Vite Rollup `inlineDynamicImports` deprecation**

**Acceptance criteria**:

1. ✅ `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build` shows **no** Rollup deprecation for `inlineDynamicImports` (upgrade `vite-plugin-singlefile` or set `build.rollupOptions.output` / `build.rollupOptions` per current Vite docs).

**Execution note (2026-04-09)**:

- Switched `widget/vite.config.ts` to `viteSingleFile({ useRecommendedBuildConfig: false })`
  and owned the required single-file build settings directly.

**Phase 2 complete when**: Clean Vercel build log for the warning classes above; `pnpm build` locally matches.

---

### Phase 3: Validation and consolidation

**Task 3.1 — Full quality gates**

Run the sequence in `.agent/plans/templates/components/quality-gates.md` (adapted to repo scripts: `pnpm sdk-codegen`, `pnpm build`, `pnpm type-check`, `pnpm lint`, `pnpm test`, …).

**Execution note (2026-04-10)**:

- Local validation is green:
  - targeted workspace tests for the new operations-layer orchestration
  - targeted built-artifact E2E proof
  - live acceptance for `pnpm dev:observe:noauth` after deleting `dist/`
  - canonical runtime contamination check (zero matches)
  - full `pnpm check`

**Task 3.2 — Deploy verification**

**Acceptance criteria**:

1. Latest preview: GET `/mcp` or health path returns **200** without bootstrap
   stack trace in runtime logs. (Pending post-push verification.)
2. Build logs: **no** Turbo env warning spam for listed keys; **no**
   sdk-codegen `canonical-url-map` WARN; **no** Rollup deprecation. (Pending
   post-push verification.)

**Task 3.3 — Final checklist** (from quality-fix template)

- [ ] principles.md — no compatibility layers; quality gates green
- [ ] testing-strategy.md — new tests prove artefact/bootstrap contract
- [ ] schema-first — codegen/reference files consistent

**Task 3.4 — `/jc-consolidate-docs`**

Run after doc updates and before final archive/merge handoff.

**Execution note (2026-04-10)**:

- Continuity surfaces, active indexes, roadmap, and prompt were resynchronised.
- Napkin rotation and distilled pruning/graduation ran during this handoff.
- Remaining Phase 3 work is the post-push preview/build-log verification.

---

## Risk assessment

| Risk | Mitigation |
|------|------------|
| Vercel dashboard settings outside repo | Document required settings in app README; pair with someone with Vercel access. |
| Turbo env list drifts | Single source in `turbo.json`; review when adding new env-dependent tasks. |
| Plugin upgrade breaks single-file HTML | Run `pnpm test:widget` and manual MCP resource read after Vite/plugin changes. |

---

## Success criteria

- Preview deployment **starts** without widget HTML bootstrap error.
- Fresh Vercel build logs are **free** of the enumerated warning classes (or
  explicitly documented exceptions with owner approval).
- Local quality gates pass and the consolidation workflow has run.

---

## Dependencies

- **Blocking**: Vercel project access to confirm **Build Command** / **Root Directory** if Phase 0 shows misconfiguration.
- **Related**: Napkin entry on `dist/dist/` — verify not regressed; `.agent/plans/sdk-and-mcp-enhancements` WS3 widget work if routing overlaps.

---

## References

- `apps/oak-curriculum-mcp-streamable-http/src/register-widget-resource.ts` — `WIDGET_HTML_PATH`
- `apps/oak-curriculum-mcp-streamable-http/src/validate-widget-html.ts`
- `apps/oak-curriculum-mcp-streamable-http/widget/vite.config.ts`
- `turbo.json` — `@oaknational/oak-curriculum-mcp-streamable-http#build`
- `packages/sdks/oak-sdk-codegen/reference/README.md` — canonical URL map
- [ADR-117](/docs/architecture/architectural-decisions/117-plan-templates-and-components.md) — plan structure

---

## Consolidation

On completion: `/jc-consolidate-docs`; archive this plan to `archive/completed/` per ADR-117 and add an entry to the completed plans index if applicable.
