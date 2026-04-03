# ADR-121: Quality Gate Surfaces

**Status**: Accepted
**Date**: 2026-02-25
**Updated**: 2026-04-02
**Related**: [ADR-013 (Husky and lint-staged)](013-husky-and-lint-staged.md), [ADR-043 (Type Generation in Build and CI)](043-codegen-in-build-and-ci.md), [ADR-111 (Secret Scanning Quality Gate)](111-secret-scanning-quality-gate.md), [ADR-147 (Browser Accessibility)](147-browser-accessibility-as-blocking-quality-gate.md)

## Context

The repository enforces quality through multiple surfaces, each triggered at
a different point in the development lifecycle. The term "CI" has been used
loosely to refer to any of these, creating confusion about what runs where
and why. Reviewer findings in Phase 7 identified gaps where checks existed
in some surfaces but not others, with no documented rationale for the
differences.

The five surfaces are:

1. **Pre-commit hook** (`.husky/pre-commit`) — runs on every `git commit`.
   Must be fast (< 60s) to avoid disrupting flow.
2. **Commit-msg hook** (`.husky/commit-msg`) — validates commit message
   format and blocks accidental breaking changes.
3. **Pre-push hook** (`.husky/pre-push`) — runs before `git push`. Can be
   thorough (2-5 min) since pushes are less frequent.
4. **GitHub CI workflow** (`.github/workflows/ci.yml`) — runs on PRs and
   pushes to `main`. Canonical remote gate. Must be self-contained (no
   local tooling assumptions).
5. **Local commands** (`pnpm check`, `pnpm qg`, `pnpm make`) — developer-
   initiated. `pnpm check` is the canonical aggregate gate and the most
   comprehensive; `pnpm qg` is verify-only; `pnpm make` is build-and-fix.

## Decision

Each surface has a defined purpose and a specific set of checks. The
principle is: **every check that runs in CI must also be catchable locally
before push**, so developers never discover failures only after pushing.

### Coverage matrix

| Check             | pre-commit | pre-push     | CI workflow     | pnpm qg | pnpm check        |
| ----------------- | ---------- | ------------ | --------------- | ------- | ----------------- |
| secrets:scan:all  | --         | Yes          | Yes             | --      | Yes               |
| clean             | --         | --           | --              | --      | Yes               |
| sdk-codegen       | --         | Yes (turbo)  | Yes (via build) | --      | Yes               |
| build             | --         | Yes          | Yes             | --      | Yes               |
| format-check      | Yes        | Yes          | Yes             | Yes     | Yes (format:root) |
| markdownlint      | Yes        | Yes          | Yes             | Yes     | Yes               |
| subagents:check   | --         | --           | Yes             | Yes     | Yes               |
| portability:check | --         | --           | Yes             | Yes     | Yes               |
| test:root-scripts | --         | --           | Yes             | Yes     | Yes               |
| type-check        | Yes        | Yes          | Yes             | Yes     | Yes               |
| lint              | Yes        | Yes          | Yes             | Yes     | Yes               |
| test              | Yes        | Yes          | Yes             | Yes     | Yes               |
| test:widget       | --         | --           | --              | Yes     | Yes               |
| test:e2e          | --         | Yes (--only) | --              | Yes     | Yes               |
| test:ui           | --         | --           | --              | Yes     | Yes               |
| test:a11y         | --         | --           | --              | Yes     | Yes               |
| smoke:dev:stub    | --         | --           | --              | Yes     | Yes               |
| doc-gen           | --         | --           | --              | --      | Yes               |

### Rationale for exclusions

- **Pre-commit excludes build/codegen/secrets**: too slow for every commit.
  These run on pre-push instead.
- **Pre-push excludes test:widget, test:ui, test:a11y, and smoke**:
  local-only widget/browser gates and dev-server smoke require the broader
  developer environment. `pnpm qg` covers these for developers who want full
  local verification.
- **CI excludes test:e2e**: E2E tests hit Elasticsearch which is not
  available in the GitHub Actions environment. Covered by pre-push
  (`--only` mode) and `pnpm qg`.
- **CI excludes test:widget, test:ui, test:a11y, and smoke:dev:stub**:
  widget/browser gates and dev server lifecycle add complexity and flakiness
  to CI. These are local-only gates covered by `pnpm qg` and `pnpm check`.
- **CI excludes doc-gen**: documentation generation is a build-time
  convenience, not a correctness gate.
- **`pnpm qg` excludes secrets scan and clean**: `qg` assumes an already-
  built working tree. `pnpm check` handles full clean rebuilds.

### Design principles

1. **No CI-only checks** — every CI check must be reproducible locally via
   at least one of: pre-push, `pnpm qg`, or `pnpm check`.
2. **Pre-commit is fast** — format, markdown, type-check, lint, and unit
   tests only. No builds or codegen.
3. **Pre-push is thorough** — secret scan, full build chain, drift check,
   and E2E tests. This is the last local gate before remote CI.
4. **CI is the canonical remote gate** — if CI passes, the PR is
   mechanically sound. It runs a strict subset of what pre-push covers.
5. **`pnpm check` is exhaustive** — the only surface that runs every check
   including clean rebuild, doc-gen, and all test types.

## Consequences

### Positive

- Clear documentation of what runs where eliminates "CI" ambiguity.
- The coverage matrix makes gaps visible and auditable.
- The "no CI-only checks" principle ensures fast local feedback.

### Negative

- test:widget, test:ui, test:a11y, and smoke:dev:stub remain local-only,
  meaning they could regress without CI catching them. Mitigation:
  `pnpm qg` and `pnpm check` cover the full local surface.
- Adding checks to more surfaces increases total developer-facing gate time.
  Mitigation: turbo caching makes repeated runs fast.

## Implementation

- `subagents:check` is not in pre-push (too noisy for push flow; covered by CI).
- CI workflow updated to include `markdownlint-check:root` and
  `subagents:check`.
- ADR-043 updated to reflect the drift-check-based freshness verification
  approach (replacing the `--only` build isolation).
- Coverage matrix maintained in this ADR and referenced from
  `docs/engineering/build-system.md` and `docs/engineering/workflow.md`.
