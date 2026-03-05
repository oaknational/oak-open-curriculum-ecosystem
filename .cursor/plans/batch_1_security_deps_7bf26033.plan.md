---
name: Batch 1 Security Deps
overview: "Implement the remaining Batch 1 items from the security-dependency-triage plan: overrides, patch/minor dependency bumps across 7 package.json files, GitHub Actions SHA pinning in 2 workflow files, then pnpm install + quality gates."
todos:
  - id: overrides
    content: Update axios override, add rollup + qs overrides in root package.json
    status: completed
  - id: root-devdeps
    content: Bump commitlint, stryker, markdownlint-cli, turbo in root package.json
    status: completed
  - id: review-overrides
    content: "Review: security-reviewer on overrides + config-reviewer on root package.json changes"
    status: completed
  - id: elasticsearch
    content: Bump @elastic/elasticsearch to ^9.3.4 across 5 workspace package.json files
    status: completed
  - id: workspace-bumps
    content: Bump ioredis, zod-to-openapi, minimatch v10, eslint-plugin-tsdoc, openapi-typescript in their respective workspaces
    status: completed
  - id: review-deps
    content: "Review: code-reviewer on all package.json changes + architecture-reviewer-barney on dependency boundary impact"
    status: completed
  - id: pin-actions
    content: Pin 4 GitHub Actions to SHA in ci.yml and release.yml
    status: completed
  - id: review-actions
    content: "Review: security-reviewer on workflow SHA pinning + architecture-reviewer-wilma on supply chain resilience"
    status: completed
  - id: install-verify
    content: Run pnpm install then pnpm qg to verify
    status: completed
  - id: review-final
    content: "Review: architecture-reviewer-fred on overall change set against ADRs and boundary rules"
    status: completed
isProject: false
---

# Batch 1 Security and Dependency Updates

Already complete: MCP SDK update (user), CodeQL FP dismissals (previous session).

## 1. Root `package.json` — overrides + devDeps

**File**: [package.json](package.json)

Update existing override:

- `axios`: `"^1.12.2"` to `"^1.13.5"`

Add new overrides:

- `"rollup": ">=4.59.0"`
- `"qs": ">=6.14.2"`

Update devDependencies:

- `@commitlint/cli`: `"^20.4.2"` to `"^20.4.3"`
- `@commitlint/config-conventional`: `"^20.4.2"` to `"^20.4.3"`
- `@stryker-mutator/core`: `"^9.5.1"` to `"^9.6.0"`
- `@stryker-mutator/typescript-checker`: `"^9.5.1"` to `"^9.6.0"`
- `@stryker-mutator/vitest-runner`: `"^9.5.1"` to `"^9.6.0"`
- `markdownlint-cli`: `"^0.47.0"` to `"^0.48.0"`
- `turbo`: `"^2.8.10"` to `"^2.8.13"`

## Review checkpoint A

After root package.json changes (overrides + devDeps), invoke in parallel:

- **security-reviewer** (readonly) — verify overrides resolve the targeted CVEs without introducing new risk
- **config-reviewer** (readonly) — verify pnpm.overrides syntax and devDependency version consistency

## 2. `@elastic/elasticsearch` bump across 5 workspaces

`"^9.3.2"` to `"^9.3.4"` in:

- [apps/oak-curriculum-mcp-stdio/package.json](apps/oak-curriculum-mcp-stdio/package.json) (dependencies)
- [apps/oak-curriculum-mcp-streamable-http/package.json](apps/oak-curriculum-mcp-streamable-http/package.json) (dependencies)
- [apps/oak-search-cli/package.json](apps/oak-search-cli/package.json) (dependencies)
- [packages/sdks/oak-curriculum-sdk/package.json](packages/sdks/oak-curriculum-sdk/package.json) (devDependencies)
- [packages/sdks/oak-search-sdk/package.json](packages/sdks/oak-search-sdk/package.json) (devDependencies; peerDep stays at `^9.2.0`)

## 3. Workspace-specific patch/minor bumps

- [apps/oak-search-cli/package.json](apps/oak-search-cli/package.json):
  - `ioredis`: `"^5.9.3"` to `"^5.10.0"` (dependencies)
  - `@asteasolutions/zod-to-openapi`: `"^8.4.1"` to `"^8.4.3"` (devDependencies)
- [packages/core/oak-eslint/package.json](packages/core/oak-eslint/package.json):
  - `minimatch`: `"^10.2.2"` to `"^10.2.4"` (dependencies)
  - `eslint-plugin-tsdoc`: `"^0.5.0"` to `"^0.5.2"` (dependencies)
- [packages/sdks/oak-sdk-codegen/package.json](packages/sdks/oak-sdk-codegen/package.json):
  - `openapi-typescript`: `"^7.10.1"` to `"^7.13.0"` (devDependencies)

## Review checkpoint B

After all package.json dependency changes, invoke in parallel:

- **code-reviewer** (readonly) — review all package.json edits for correctness, consistency, and missed updates
- **architecture-reviewer-barney** (readonly) — assess whether dependency bumps affect architectural boundaries or simplification opportunities

## 4. Pin GitHub Actions to SHA

**File**: [.github/workflows/ci.yml](.github/workflows/ci.yml)

- `actions/checkout@v4` to `actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4`
- `pnpm/action-setup@v4` to `pnpm/action-setup@c5ba7f7862a0f64c1b1a05fbac13e0b8e86ba08c # v4`
- `actions/setup-node@v4` to `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4`

**File**: [.github/workflows/release.yml](.github/workflows/release.yml)

- `actions/create-github-app-token@v1` to `actions/create-github-app-token@d72941d797fd3113feb6b93fd0dec494b13a2547 # v1`
- `actions/checkout@v4` to `actions/checkout@34e114876b0b11c390a56381ad16ebd13914f8d5 # v4`
- `pnpm/action-setup@v4` to `pnpm/action-setup@c5ba7f7862a0f64c1b1a05fbac13e0b8e86ba08c # v4`
- `actions/setup-node@v4` to `actions/setup-node@49933ea5288caeca8642d1e84afbd3f7d6820020 # v4`

## Review checkpoint C

After workflow SHA pinning, invoke in parallel:

- **security-reviewer** (readonly) — verify all action references are correctly SHA-pinned with version comments
- **architecture-reviewer-wilma** (readonly) — adversarial review of supply chain resilience and CI failure modes

## 5. Install and verify

- `pnpm install` to regenerate lockfile with new versions
- `pnpm qg` to run full quality gate chain

## Review checkpoint D (final)

After quality gates pass, invoke:

- **architecture-reviewer-fred** (readonly) — principles-first review of the full change set against ADRs and boundary rules

## Files touched (summary)

7 package.json files, 2 workflow files, then lockfile regeneration:

- `package.json` (root)
- `apps/oak-curriculum-mcp-stdio/package.json`
- `apps/oak-curriculum-mcp-streamable-http/package.json`
- `apps/oak-search-cli/package.json`
- `packages/core/oak-eslint/package.json`
- `packages/sdks/oak-curriculum-sdk/package.json`
- `packages/sdks/oak-search-sdk/package.json`
- `packages/sdks/oak-sdk-codegen/package.json`
- `.github/workflows/ci.yml`
- `.github/workflows/release.yml`
