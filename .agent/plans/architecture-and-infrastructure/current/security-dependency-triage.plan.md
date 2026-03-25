---
name: "Security and Dependency Triage — March 2026"
overview: >
  Comprehensive triage of Dependabot alerts (22 open), CodeQL code scanning
  alerts (52 open), and outdated dependencies (29 packages). Prioritised into
  safe immediate fixes (Batch 1) and major-version migrations (Batch 2).
status: "queued"
created: 2026-03-05
todos:
  - id: batch-1-overrides
    content: "Add pnpm.overrides for axios >=1.13.5, rollup >=4.59.0, qs >=6.14.2"
    status: pending
  - id: batch-1-mcp-sdk
    content: "Update @modelcontextprotocol/sdk to 1.27.1 across all workspaces"
    status: pending
  - id: batch-1-markdownlint
    content: "Update markdownlint-cli to 0.48.0"
    status: pending
  - id: batch-1-patch-minor
    content: "Update remaining patch/minor packages (elasticsearch, turbo, commitlint, stryker, ioredis, minimatch v10, eslint-plugin-tsdoc, zod-to-openapi, openapi-typescript)"
    status: pending
  - id: batch-1-pin-actions
    content: "Pin GitHub Actions to SHA in ci.yml and release.yml"
    status: pending
  - id: batch-1-dismiss-fps
    content: "Dismiss CodeQL false positives with rationale"
    status: pending
  - id: batch-1-quality-gates
    content: "Run full quality gate chain after Batch 1 changes"
    status: pending
  - id: batch-2-eslint-10
    content: "Migrate eslint 9 → 10 (resolves 13 Dependabot alerts)"
    status: pending
  - id: batch-2-clerk-v3
    content: "Migrate @clerk/backend 2→3, @clerk/express 1→2"
    status: pending
  - id: batch-2-remaining-majors
    content: "Evaluate remaining major upgrades (types/node 25, openapi-fetch 0.17, vite-tsconfig-paths 6, zod 4 for adapter)"
    status: pending
  - id: rate-limiting-decision
    content: "Decide on app-level rate limiting vs document Vercel as compensating control"
    status: pending
isProject: false
---

# Security and Dependency Triage — March 2026

**Triggered by**: Dependabot + CodeQL review on 2026-03-05
**Source data**: GitHub security tab for `oaknational/oak-open-curriculum-ecosystem`

---

## Dependabot — 22 Open Alerts

All alerts reference `pnpm-lock.yaml`. 8 further alerts were auto-fixed
on 2026-03-02 (fast-xml-parser, @modelcontextprotocol/sdk, brace-expansion,
next).

### Group 1: hono / @hono/node-server (5 alerts, via @modelcontextprotocol/sdk@1.27.0)

| Alert | Package | Severity | Patched | CVE Summary |
|-------|---------|----------|---------|-------------|
| #69 | @hono/node-server | HIGH | >= 1.19.10 | Auth bypass via encoded slashes in serveStatic |
| #67 | hono | HIGH | >= 4.12.4 | Arbitrary file access via serveStatic |
| #68 | hono | MEDIUM | >= 4.12.4 | Cookie attribute injection in setCookie() |
| #66 | hono | MEDIUM | >= 4.12.4 | SSE control field injection in writeSSE() |
| #65 | hono | LOW | — | Timing comparison hardening |

**Actual risk**: Low-Medium. Our app uses Express, not Hono's serveStatic/setCookie.
The MCP SDK instantiates Hono internally for Streamable HTTP transport.

**Fix**: Update `@modelcontextprotocol/sdk` to 1.27.1. The SDK declares
`"hono": "^4.11.4"` and `"@hono/node-server": "^1.19.9"`, so a fresh
lockfile resolution pulls patched versions.

### Group 2: axios (1 alert, HIGH)

| Alert | Package | Severity | Patched | CVE Summary |
|-------|---------|----------|---------|-------------|
| #44 | axios | HIGH | >= 1.13.5 | DoS via `__proto__` key in mergeConfig |

Currently pinned as `pnpm.overrides` to `^1.12.2`.

**Fix**: Bump override to `^1.13.5`.

### Group 3: rollup (1 alert, HIGH)

| Alert | Package | Severity | Patched | CVE Summary |
|-------|---------|----------|---------|-------------|
| #55 | rollup | HIGH | >= 4.59.0 | Arbitrary file write via path traversal |

Transitive via vite (vitest) and tsup. Build tooling only.

**Fix**: Add `pnpm.overrides` for `rollup >= 4.59.0`.

### Group 4: minimatch (11 alerts, all HIGH)

| Alert(s) | Package | Severity | Patched | CVE Summary |
|----------|---------|----------|---------|-------------|
| #49–#64 | minimatch | HIGH | >= 3.1.3 | Various ReDoS patterns |

Transitive via eslint 9 → `@eslint/config-array`, `@eslint/eslintrc`,
and eslint plugins. Dev-only.

**Fix (immediate)**: Add `pnpm.overrides` for `minimatch >= 3.1.3`.
**Fix (permanent)**: Migrate to eslint 10 — drops `@eslint/eslintrc`
entirely and uses `minimatch@^10.2.1`.

### Group 5: ajv (2 alerts, MEDIUM)

| Alert(s) | Package | Severity | Patched | CVE Summary |
|----------|---------|----------|---------|-------------|
| #47, #48 | ajv | MEDIUM | >= 6.14.0 | ReDoS with `$data` option |

Transitive via eslint → `@eslint/eslintrc`. Dev-only.

**Fix (immediate)**: Add `pnpm.overrides` for `ajv >= 6.14.0`.
**Fix (permanent)**: eslint 10 pins `ajv@^6.14.0` directly.

### Group 6: markdown-it (1 alert, MEDIUM)

| Alert | Package | Severity | Patched | CVE Summary |
|-------|---------|----------|---------|-------------|
| #41 | markdown-it | MEDIUM | >= 14.1.1 | ReDoS |

Transitive via `markdownlint-cli@0.47.0`.

**Fix**: Update `markdownlint-cli` to 0.48.0 (ships `markdown-it@~14.1.1`).

### Group 7: qs (1 alert, LOW)

| Alert | Package | Severity | Patched | CVE Summary |
|-------|---------|----------|---------|-------------|
| #40 | qs | LOW | >= 6.14.2 | arrayLimit bypass |

Two versions in lockfile: `6.14.0` (vulnerable) and `6.15.0` (patched).
The vulnerable `6.14.0` is pulled by transitive dependencies.

**Fix**: Add `pnpm.overrides` for `qs >= 6.14.2`.

---

## CodeQL — 52 Open, 3 Dismissed

### True Positives Requiring Action

| # | Rule | Severity | File | Assessment |
|---|------|----------|------|------------|
| #1 | actions/unpinned-tag | MEDIUM | `.github/workflows/ci.yml:24` | Pin Actions to SHA |
| #2 | actions/unpinned-tag | MEDIUM | `.github/workflows/release.yml:34` | Pin Actions to SHA |
| #4–#8 | js/missing-rate-limiting | HIGH | `auth-routes.ts`, `oauth-proxy-routes.ts`, `widget-preview-server.ts` | Mitigated by Vercel edge + Clerk. #4 is dev-only. Evaluate app-level rate limiting or document as accepted |

### False Positives — Dismissed with Rationale

| #(s) | Rule | Count | Location | Reason |
|------|------|-------|----------|--------|
| #40, #41 | js/user-controlled-bypass | 2 | `mcp-auth.ts` | Standard Bearer auth middleware per RFC 6750 |
| #42–#54 | js/regex/missing-regexp-anchor | 13 | `*.unit.test.ts` | Test assertions using `expect().toMatch()` |
| #9, #10 | js/incomplete-hostname-regexp | 2 | Test files | Test assertions |
| #12 | js/bad-tag-filter | 1 | Test file | Test assertion |
| #30–#32, #34 | js/polynomial-redos | 4 | `path-utils.ts`, `synonym-miner.ts`, `analysis-report-generator.ts` | Simple non-backtracking patterns on controlled input |
| #11 | js/double-escaping | 1 | `html-encoding.ts` | Correct decode order (specific entities first, `&amp;` last) |
| #13–#28 | js/incomplete-sanitization | 14 | Code generators, `host-header-validation.ts`, scripts | Sequential `.replace()` on controlled input from OpenAPI schema or compile-time constants |
| #29 | js/bad-code-sanitization | 1 | `build-zod-type.ts` | `JSON.stringify` on hardcoded `CANONICAL_YEAR_VALUES` |

### Low Risk — Dismissed or Backlogged

| #(s) | Rule | Count | Location | Assessment |
|------|------|-------|----------|------------|
| #55 | js/log-injection | 1 | `widget-preview-server.ts` | Local dev script, not deployed |
| #35–#37 | js/http-to-file-access | 3 | Smoke tests, sitemap scanner | Dev/test tooling intentionally writes fetched data |

---

## Outdated Dependencies — 29 Packages

### Batch 1 — Patch/Minor (No Breaking Changes)

| Package | Current | Target | Workspaces | Security Fix? |
|---------|---------|--------|------------|---------------|
| `@modelcontextprotocol/sdk` | 1.27.0 | 1.27.1 | mcp-stdio, mcp-streamable-http, sdk-codegen, curriculum-sdk | Yes (5 alerts) |
| `markdownlint-cli` | 0.47.0 | 0.48.0 | root | Yes (1 alert) |
| `@elastic/elasticsearch` | 9.3.2 | 9.3.4 | mcp-stdio, mcp-streamable-http, search-cli, curriculum-sdk, search-sdk | No |
| `turbo` | 2.8.10 | 2.8.13 | root | No |
| `@commitlint/cli` + `config-conventional` | 20.4.2 | 20.4.3 | root | No |
| `@stryker-mutator/*` (3 pkgs) | 9.5.1 | 9.6.0 | root | No |
| `ioredis` | 5.9.3 | 5.10.0 | search-cli | No |
| `minimatch` (direct, v10) | 10.2.2 | 10.2.4 | eslint-plugin-standards | No |
| `eslint-plugin-tsdoc` | 0.5.0 | 0.5.2 | eslint-plugin-standards | No |
| `@asteasolutions/zod-to-openapi` | 8.4.1 | 8.4.3 | search-cli | No |
| `openapi-typescript` | 7.10.1 | 7.13.0 | sdk-codegen | No |

### Overrides (Batch 1)

| Override | Value | Security Fix? |
|----------|-------|---------------|
| `axios` | `^1.13.5` (was `^1.12.2`) | Yes (1 alert) |
| `rollup` | `>=4.59.0` (new) | Yes (1 alert) |
| `qs` | `>=6.14.2` (new) | Yes (1 alert) |

### Batch 2 — Major Version Upgrades

| Package | Current | Target | Risk | Security Fix? |
|---------|---------|--------|------|---------------|
| `eslint` + `@eslint/js` | 9.39.1 | 10.0.2 | Medium | Yes (13 alerts — minimatch + ajv) |
| `eslint-plugin-sonarjs` | 3.0.5 | 4.0.0 | Medium | Companion to eslint 10 |
| `globals` | 16.5.0 | 17.4.0 | Low | Companion to eslint 10 |
| `@clerk/backend` | 2.32.1 | 3.0.1 | Medium-High | No |
| `@clerk/express` | 1.7.74 | 2.0.1 | Medium-High | Paired with backend v3 |
| `@types/node` | 24.10.13 | 25.3.3 | Low-Medium | No |
| `@types/supertest` | 6.0.3 | 7.2.0 | Low | No |
| `openapi-fetch` | 0.15.0 | 0.17.0 | Medium | No |
| `vite-tsconfig-paths` | 5.1.4 | 6.1.1 | Low | No |
| `zod` (openapi-zod-client-adapter) | 3.25.76 | 4.3.6 | Medium | No |

---

## Summary Scorecard

| Category | Total | Batch 1 (safe) | Batch 2 (major) | Dismiss/Accept |
|----------|-------|-----------------|------------------|----------------|
| Dependabot open | 22 | 9 resolved | 13 resolved (eslint 10) | 0 |
| CodeQL open | 52 | 2 fixed (Actions SHA) | 0 | ~45 dismissed; 5 track/accept |
| Outdated packages | 29 | 15 updated | 14 (majors) | 0 |

## Priority Order

1. **Pin GitHub Actions by SHA** — supply chain risk
2. **pnpm.overrides** for axios, rollup, qs — one-line fixes
3. **@modelcontextprotocol/sdk** → 1.27.1 — resolves 5 hono alerts
4. **markdownlint-cli** → 0.48.0 — resolves markdown-it alert
5. **Remaining patch/minor updates** — quality posture
6. **eslint 10 migration** — resolves 13 alerts, dedicated branch
7. **Clerk v3 migration** — separate effort
8. **Rate limiting decision** — document or implement
