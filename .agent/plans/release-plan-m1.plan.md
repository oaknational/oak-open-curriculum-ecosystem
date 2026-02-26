# Milestone 1 Release Plan (Public Alpha)

**Status**: Active  
**Last Updated**: 2026-02-26  
**Milestone**: Milestone 1 (Public Alpha)  
**Open items**: 13 remaining (1 P1, 1 P2, 11 P3). O8 complete (user deleted empty dirs). F12/F13 closed (obsolete). F7 upgraded to P1, F8 fully complete. Batch E elevated: all items will be fixed before release.

---

## Plan Type

This is a **milestone release plan**.

Milestone release plans are for:

1. release-critical checks,
2. snagging and closure,
3. final go/no-go control,
4. safe rollout and rollback readiness.

They are not for opening new feature scope.

---

## Objective

Get Milestone 1 across the line safely:

- checks complete,
- release snags closed or explicitly accepted,
- release executed with controlled risk and rollback readiness.

Primary strategic reference:
[high-level-plan.md](./high-level-plan.md)

---

## Next Session Checklist (Handoff)

### Getting Started

1. Read this plan. It is self-contained.
2. Read [rules.md](../directives/rules.md), [testing-strategy.md](../directives/testing-strategy.md), and [schema-first-execution.md](../directives/schema-first-execution.md).
3. Read [distilled.md](../memory/distilled.md) and [napkin.md](../memory/napkin.md).
4. **First action**: Commit Batch C-2 (F8-Search-CLI, env-resolution enhancement) — it is complete and passing all gates but uncommitted in the working tree.
5. Then: complete F7 (ADR-108 completion — move synonym/vocabulary functions to sdk-codegen, remove search-sdk's dependency on curriculum-sdk). See §Batch D below for detailed fix steps.
6. After F7: complete Batch E (all remaining items — elevated from deferred to fix-before-release). See §Batch E below.
7. After Batch E: Go/No-Go preparation (G1–G8 evidence collection).

### Current State

- **Batch A**: Complete (8 items). All quality gates pass.
- **Batch B**: Complete (8 items — F6, F10, F20, F25, F28, F29, O5, O10). Committed in `b85c44ec` + `9ad2d66a` (reviewer fixes). All quality gates pass.
- **Batch C**: Complete (F5/F18, F8-STDIO, F8-Search-CLI, F27, O12). All quality gates pass. Batch C-1 committed in `081188a8`. Batch C-2 (F8-Search-CLI, env-resolution enhancement) uncommitted in working tree.
- **F18 is subsumed by F5** — they share the same fix (env identity + LIB_PACKAGES cleanup).

### Batch C — COMPLETE

All Batch C items complete: ~~F5/F18~~, ~~F8-STDIO~~, ~~F8-Search-CLI~~, ~~F27~~, ~~O12~~.

**Specialist reviewers**: `code-reviewer`, `architecture-reviewer-fred`, `architecture-reviewer-barney`, `type-reviewer`, `test-reviewer`, `docs-adr-reviewer`, `config-reviewer`. All passed.

### Next: Batch D — F7: Complete ADR-108 (search-sdk independence)

**F7** is not a trade-off decision. It is unfinished ADR-108 work and intention drift.

The `oak-search-sdk` still depends on `@oaknational/curriculum-sdk` for two runtime functions (`buildPhraseVocabulary`, `buildElasticsearchSynonyms`) that were temporarily allowed per ADR-108 Step 1. `oak-sdk-codegen` was created specifically to be the shared type/schema package that both SDKs import from — neither SDK should depend on the other.

**Decision (2026-02-26)**: `SearchRetrievalService` in curriculum-sdk stays. It is not a duplicate — it is the consumer-side interface (Interface Segregation Principle). curriculum-sdk defines the contract it needs; search-sdk implements a structurally compatible type. TypeScript structural typing handles the wiring. No SDK-to-SDK dependency in either direction.

**Fix** (TDD):

1. Move `buildPhraseVocabulary` and `buildElasticsearchSynonyms` (+ supporting types) from `curriculum-sdk/src/mcp/synonym-export.ts` to `@oaknational/sdk-codegen`
2. Update search-sdk imports to use `@oaknational/sdk-codegen`
3. Remove `@oaknational/curriculum-sdk` from search-sdk's `package.json` entirely
4. Add ESLint boundary rule: search-sdk cannot import from curriculum-sdk (tighten existing rules to block ALL subpaths including `/public/mcp-tools.js`)
5. Update ADR-108 revision note: lines 81 and 222 describe the coupling as "retained in Step 1" — add note that F7 completed the decoupling. Add note acknowledging `SearchRetrievalService` as ISP, not duplication.
6. Quality gates, specialist reviewers

### Batch E — All Remaining Items (Elevated 2026-02-26)

**All items to be fixed before release.** F12 and F13 closed as obsolete. O8 complete. 12 items remain.

**Sub-batch E1 — Trivial** (3 items):

- **F35**: Delete dead code (`createInMemoryStorage`, `createNodeClock`, `runtime` from `WiredDependencies` in STDIO `wiring.ts`)
- **F11**: Document RRF parameter coupling (`DEFAULT_MIN_SCORE` and `rank_constant`)
- **F16**: Document OAuth proxy rate limiting as deployment precondition

**Sub-batch E2 — Small** (6 items):

- **R4**: Result pattern for `deriveSelfOrigin` and `fetchUpstreamMetadata`
- **F14**: Search SDK integration test (builds both SDKs after codegen, runs retrieval smoke)
- **F15**: Verify/fix ES timeout → `RetrievalError.timeout` mapping
- **F19**: type-helpers assertion strategy audit
- **F31**: Fix SDK API markdown generator for current package name
- **F34**: Document ES connectivity trade-off or add warm-up ping

**Sub-batch E3 — Medium** (3 items):

- **F17**: Remove `public/search.ts` facade — migrate all consumers (32 search CLI files, 4 HTTP app files) to direct `@oaknational/sdk-codegen/search` imports. Keep curriculum-sdk imports only for `search-response-guards` symbols (curriculum-sdk's own runtime code). Update ADR-108.
- **F32**: Standardise E2E config naming repo-wide
- **F33**: Progressive ESLint re-enablement in codegen hand-written code

### Go/No-Go Preparation

After Batch E:

1. Prepare G1–G8 evidence (see §Mandatory Check Gates below).
2. Invoke `release-readiness-reviewer`.
3. Verify no open P0/P1 snags remain.
4. Record decision.

---

## Scope Boundary

### In Scope

1. Milestone 1 release checks and evidence collection.
2. Snag triage and closure for release blockers.
3. **Pre-release architecture fixes (F1–F35)** — four-reviewer consolidation plus thorough second-pass review; all findings to be addressed in a dedicated session, including low-priority items.
4. **Pre-release onboarding and documentation fixes (O1–O12)** — onboarding-reviewer audit; all findings to be addressed in the same dedicated session.
5. Public-alpha go/no-go decision.
6. Safe release execution and early-life monitoring.

### Out of Scope

1. New capability streams not required for Milestone 1 exit.
2. Milestone 2 and Milestone 3 backlog items.
3. Architecture experiments without release impact.

---

## Release Control Model

| Phase | Focus | Exit Condition |
|---|---|---|
| R0 | Freeze release candidate scope | Candidate commit identified; only release-blocker fixes allowed |
| R1 | Mandatory checks | All mandatory check gates pass with evidence |
| R2 | Snagging | No open P0/P1 snags; P2/P3 disposition recorded |
| R3 | Go/No-Go | Explicit decision recorded with owner sign-off |
| R4 | Release execution | Rollout completed and smoke verification passes |
| R5 | Early-life watch | Monitoring window completed or rollback executed |

---

## Mandatory Check Gates (M1)

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

- [ ] **G1. Quality gates green**
  - Minimum: `pnpm qg` and `pnpm check` pass for release candidate.
  - Evidence: command logs linked in release notes.

- [ ] **G2. Generated artefacts stable**
  - `check-generated-drift` passes with no unexplained drift.
  - Evidence: diff and drift-check output.

- [ ] **G3. Secrets and security baseline**
  - `pnpm secrets:scan:all` passes for candidate commit.
  - Environment examples remain placeholder-only.
  - Evidence: scan output + manual spot-check notes.

- [ ] **G4. Onboarding release gate**
  - No P0 blockers in rerun onboarding simulations.
  - Canonical tracker:
    [onboarding-simulations-public-alpha-readiness.md](./developer-experience/onboarding-simulations-public-alpha-readiness.md)
  - Evidence: persona rerun summary.

- [ ] **G5. Public-alpha UX contract**
  - Public-alpha baseline confirmed and documented.
  - Contract:
    [public-alpha-experience-contract.md](./user-experience/public-alpha-experience-contract.md)
  - Evidence: acceptance checklist.

- [ ] **G6. Auth migration readiness**
  - Clerk production migration decision and implementation complete for alpha scope.
  - Evidence: migration checklist and environment validation proof.

- [ ] **G7. Observability minimum**
  - Basic Sentry error visibility verified for core alpha services.
  - Evidence: test event or incident-path verification.

- [ ] **G8. Release communications prepared**
  - Public-alpha scope, caveats, and rollback contact path prepared.
  - Evidence: release note draft and owner approval.

---

## Snagging Protocol

### Severity Model

1. **P0**: release stop. Security, data integrity, or core-path outage risk.
2. **P1**: must fix before release unless formally accepted by milestone owner.
3. **P2**: acceptable with explicit follow-up owner/date.
4. **P3**: defer to post-release backlog.

### Snag Workflow

1. Log snag with reproducible steps and owning stream.
2. Assign severity and owner.
3. Triage daily during release phase.
4. Re-test fix and record evidence.
5. Close only when behaviour is verified and documented.

### Snag Register Template

| ID | Severity | Description | Owner | Status | Decision |
|---|---|---|---|---|---|
| M1-S001 | P1 | Example placeholder | @owner | Open | Fix before go/no-go |

---

## Pre-Release Architecture Fixes (Four-Reviewer Consolidation)

**Source**: Architecture review of `feat/semantic_search_deployment` vs `main` (2026-02-25).  
**Reviewers**: Barney, Betty, Fred, Wilma.  
**Scope**: All findings to be addressed in a fresh session before M1 release.

### Critical (P0/P1 — Must Fix Before Release)

#### F1: Search SDK imports via curriculum-sdk facade — ADR-108 violation

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Barney, Betty, Fred, Wilma |
| **ADR** | [ADR-108](../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) |
| **Problem** | `oak-search-sdk` imports types from `@oaknational/curriculum-sdk/public/search.js` instead of `@oaknational/sdk-codegen/search`. ADR-108 states: *"There is no thin runtime facade that re-exports generation artefacts. Consumers needing type infrastructure import from the generation package directly."* |
| **Files** | All imports in `packages/sdks/oak-search-sdk/src/**` referencing `@oaknational/curriculum-sdk/public/search.js`, `@oaknational/curriculum-sdk/public/mcp-tools.js`, `@oaknational/curriculum-sdk/elasticsearch.js` |
| **Fix** | Add `@oaknational/sdk-codegen` as dependency to `oak-search-sdk`. Replace all curriculum-sdk type/mapping imports with `@oaknational/sdk-codegen/search`, `@oaknational/sdk-codegen/bulk`, etc. Change peerDependency from `@oaknational/curriculum-sdk` to `@oaknational/sdk-codegen`. Replace `KeyStage`, `isKeyStage`, `isKs4ScienceVariant`, `SUBJECT_TO_PARENT` imports with `@oaknational/sdk-codegen` subpaths where applicable. |
| **Status** | [x] Complete (2026-02-25). Two runtime function imports (`buildPhraseVocabulary`, `buildElasticsearchSynonyms`) were kept in `curriculum-sdk` per ADR-108 Step 1 shared runtime allowance — now being corrected by F7 (move to sdk-codegen, remove dependency entirely). |

#### F2: Search SDK has no ESLint SDK boundary enforcement

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Barney, Fred |
| **ADR** | ADR-108, ADR-041 |
| **Problem** | `packages/sdks/oak-search-sdk/eslint.config.ts` does not call `createSdkBoundaryRules`. No `@typescript-eslint/no-restricted-imports` rules prevent imports from apps or enforce which SDK packages it can depend on. Contrast with `oak-sdk-codegen` (uses `createSdkBoundaryRules('generation')`) and `oak-curriculum-sdk` (uses `createSdkBoundaryRules('runtime')`). |
| **Files** | `packages/sdks/oak-search-sdk/eslint.config.ts` |
| **Fix** | Extend `createSdkBoundaryRules` to support a `'search'` role that: (a) blocks imports from `@oaknational/curriculum-sdk` (force direct `sdk-codegen` imports after F1), (b) blocks imports from apps, (c) allows imports from `@oaknational/sdk-codegen/*` subpaths. Alternatively create `createSearchSdkBoundaryRules`. Fix F1 first, then add rules to prevent regression. |
| **Status** | [x] Complete (2026-02-25). Uses `paths` (not `patterns`) for bare `curriculum-sdk` to permit ADR-108 `public/mcp-tools.js` subpath. 6 unit tests added. Note: F7 will tighten this to block ALL curriculum-sdk imports once the subpath dependency is eliminated. |

#### F3: OAuth Host header trust — security review gate

| Field | Value |
|-------|-------|
| **Severity** | P0 |
| **Reviewers** | Wilma |
| **ADR** | [ADR-115](../../docs/architecture/architectural-decisions/115-proxy-oauth-as-for-cursor.md) |
| **Problem** | OAuth metadata endpoints (`/.well-known/oauth-protected-resource`, `/.well-known/oauth-authorization-server`) accept any Host header. ADR-115 expects ingress (Vercel, reverse proxy) to enforce canonical host. If ingress does not enforce it, a malicious `Host: evil.com` could cause metadata to advertise incorrect endpoints. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts` (deriveSelfOrigin) |
| **Fix** | Security review: verify Vercel (or other ingress) enforces canonical host for production. Document deployment precondition. If not enforced, add host validation before deriving `selfOrigin`. |
| **Status** | [x] Complete (2026-02-25). Host validation now enforced across OAuth metadata + MCP auth challenge/resource URL generation. `deriveSelfOrigin`, `getPRMUrl`, and `getMcpResourceUrl` validate host format and allow-list (`allowedHosts`), reject malformed/disallowed host with 403, and support wildcard host patterns. Unit, integration, and E2E coverage added. |

---

### High (P1/P2 — Should Fix Before Release)

#### F4: Search CLI imports typeSafeEntries from curriculum-sdk instead of type-helpers

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Fred |
| **Problem** | `apps/oak-search-cli/src/lib/indexing/pattern-config-validator.ts` imports `typeSafeEntries` from `@oaknational/curriculum-sdk`. Creates unnecessary dependency on runtime SDK for a core utility. |
| **Files** | `apps/oak-search-cli/src/lib/indexing/pattern-config-validator.ts` |
| **Fix** | Import `typeSafeEntries` directly from `@oaknational/type-helpers`. Add `@oaknational/type-helpers` to search CLI dependencies. |
| **Status** | [x] Complete (2026-02-25). Import changed, dependency added. |

#### F5: packages/core/env has mixed identity — lib boundary rules, core location

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Barney, Fred |
| **ADR** | ADR-041 |
| **Problem** | `packages/core/env` is in `packages/core/` but ESLint uses `createLibBoundaryRules('env', getOtherLibs('env'))`. `LIB_PACKAGES` in boundary.ts lists stale entries (`storage`, `transport` no longer exist). `env` has runtime deps (`dotenv`, `node:fs`) — per docs, core is "pure abstractions with zero dependencies". |
| **Files** | `packages/core/env/eslint.config.ts`, `packages/core/oak-eslint/src/rules/boundary.ts` |
| **Fix** | Option (a): Move `env` to `packages/libs/env` if it legitimately has runtime behaviour. Option (b): Create `coreBoundaryRulesWithDeps` for core packages that need runtime deps. Update `LIB_PACKAGES` to remove `storage`, `transport` and correctly categorise packages in core vs libs. |
| **Status** | [x] Complete (2026-02-25). Split `@oaknational/env` into two packages: `@oaknational/env` (core, schemas only, `coreBoundaryRules`) and `@oaknational/env-resolution` (new in `packages/libs/`, runtime pipeline, `createLibBoundaryRules`). `LIB_PACKAGES` cleaned from 6 entries to `['logger', 'env-resolution']`. Also fixed `openapi-zod-client-adapter` ESLint config (was using `createLibBoundaryRules` despite being core). 9 consumer files migrated. All quality gates pass. Specialist reviewers: code-reviewer, arch-barney, arch-fred, config-reviewer. |

#### F6: Search retrieval wiring duplicated across MCP apps

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Barney |
| **Problem** | Both `oak-curriculum-mcp-streamable-http` and `oak-curriculum-mcp-stdio` hand-roll near-identical ES-client + Search SDK bootstrap. Duplicated composition code drifts easily (flags, index target defaults, logging semantics). |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/src/search-retrieval-factory.ts`, `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` |
| **Fix** | Extract one shared retrieval bootstrap helper. Keep app-specific concerns at the outer composition root. |
| **Status** | [x] Complete (2026-02-25). Extracted `createSearchRetrieval` to `@oaknational/oak-search-sdk`. Both apps delegate to it. 3 unit tests added. |

#### F7: Complete ADR-108 — remove search-sdk dependency on curriculum-sdk

| Field | Value |
|-------|-------|
| **Severity** | P1 (upgraded from P2 — architectural integrity) |
| **Reviewers** | Barney (initial), user correction |
| **ADR** | [ADR-108](../../docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md) |
| **Problem** | `oak-search-sdk` still depends on `@oaknational/curriculum-sdk` for two runtime functions (`buildPhraseVocabulary`, `buildElasticsearchSynonyms`). This was a temporary allowance per ADR-108 Step 1, not the target architecture. `oak-sdk-codegen` was created specifically to be the shared type/schema package that both SDKs import from — neither SDK should depend on the other. |
| **Root cause** | `buildPhraseVocabulary` and `buildElasticsearchSynonyms` in `packages/sdks/oak-curriculum-sdk/src/mcp/synonym-export.ts` are schema-derived vocabulary/synonym builders. They belong in the generation package (`@oaknational/sdk-codegen`), not in the runtime curriculum SDK. |
| **SearchRetrievalService decision** | `SearchRetrievalService` in curriculum-sdk STAYS. It is not a duplicate — it is the consumer-side interface (Interface Segregation Principle). curriculum-sdk defines the contract it needs; search-sdk implements a structurally compatible type. No SDK-to-SDK dependency. |
| **Files** | `packages/sdks/oak-search-sdk/src/retrieval/query-processing/detect-curriculum-phrases.ts` (imports `buildPhraseVocabulary`), `packages/sdks/oak-search-sdk/src/admin/create-admin-service.ts` (imports `buildElasticsearchSynonyms`), `packages/sdks/oak-curriculum-sdk/src/mcp/synonym-export.ts` (source) |
| **Fix** | (1) Move `buildPhraseVocabulary` and `buildElasticsearchSynonyms` (and their supporting types) to `@oaknational/sdk-codegen`. (2) Update search-sdk imports to use `@oaknational/sdk-codegen`. (3) Remove `@oaknational/curriculum-sdk` from search-sdk's `package.json` entirely (peer and dev deps) and from `tsup.config.ts` externals. (4) Tighten ESLint boundary rules: block ALL curriculum-sdk imports including `/public/mcp-tools.js` subpath. (5) Update ADR-108 revision note: lines 81 and 222 describe the coupling as "retained in Step 1" — add note that F7 completed the decoupling. Acknowledge `SearchRetrievalService` as ISP, not duplication. (6) Quality gates, specialist reviewers. |
| **Status** | [~] In progress (2026-02-26). Architecture review completed: Barney recommended deferral based on cycle analysis. User corrected: the cycle IS the bug — it exists because ADR-108 Step 1 work is incomplete. The functions belong in sdk-codegen, not curriculum-sdk. Reframed as architectural completion, not trade-off acceptance. |

---

### Medium (P2 — Acceptable With Follow-Up)

#### F8: Env pipeline divergence — loadAppEnv vs resolveEnv

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Barney, Fred, Wilma |
| **ADR** | [ADR-116](../../docs/architecture/architectural-decisions/116-resolve-env-pipeline-architecture.md) |
| **Problem** | HTTP app uses `resolveEnv`; stdio and Search CLI use custom `process.env` readers. `loadAppEnv` in Search CLI uses `dotenvConfig` and mutates `process.env`. Different failure semantics across apps; test isolation risk. |
| **Files** | `apps/oak-search-cli/src/lib/elasticsearch/setup/load-app-env.ts`, `apps/oak-curriculum-mcp-stdio/src/runtime-config.ts`, `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` |
| **Fix** | Migrate Search CLI and STDIO to `resolveEnv` with app-specific schemas. Retire legacy `readEnv`/direct env readers. Document any intentional exceptions. |
| **Status** | [x] Complete (2026-02-26). Both STDIO and Search CLI fully migrated. STDIO: `StdioEnvSchema` composing shared schemas, `loadRuntimeConfig` returns `Result`, `resolveEnv` pipeline, all `process.env` reads eliminated from `src/`, 10 integration tests. Search CLI: `SearchCliEnvSchema` composing shared schemas with stricter overrides, `loadRuntimeConfig` + `loadConfigOrExit`, `resolveEnv` five-source hierarchy (repo `.env` < repo `.env.local` < app `.env` < app `.env.local` < `processEnv`), deleted `loadAppEnv`, refactored all entry points and 29+ library files to DI pattern (ADR-078), `CliSdkEnv` interface segregation, updated ESLint `process.env` restriction for composition roots, 7 new integration tests, 950 total tests pass. `@oaknational/env-resolution` enhanced with `findAppRoot` and five-source merge. ADR-116 revised. Specialist reviewers: code-reviewer (approved), architecture-reviewer-barney (compliant), test-reviewer (pass), type-reviewer (at-risk — `OAK_API_KEY` type gap, `as unknown` pre-existing), config-reviewer (compliant). |

#### F9: oak-search-cli missing app boundary rules

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Barney |
| **Problem** | `apps/oak-search-cli/eslint.config.ts` does not apply `appBoundaryRules` or `appArchitectureRules`. Contrast with `oak-curriculum-mcp-streamable-http`. |
| **Files** | `apps/oak-search-cli/eslint.config.ts` |
| **Fix** | Apply `appBoundaryRules` and `appArchitectureRules` to oak-search-cli. Decide if CLI is treated as app or library-style workspace; document. |
| **Status** | [x] Complete (2026-02-25). Both rule sets added to ESLint config. |

#### F10: OAuth metadata fetch — no timeout or retry

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Wilma |
| **Problem** | `fetchUpstreamMetadata` at startup is one-shot with no timeout or retry. Clerk outage or transient network issue prevents app from starting. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/src/app/oauth-and-caching-setup.ts` |
| **Fix** | Add configurable timeout (e.g. 10s) to `fetch()`. Consider limited retry or fallback to cached metadata for resilience. |
| **Status** | [x] Complete (2026-02-25). Per-attempt timeout (10s), exponential backoff (3 attempts), transient-only retry (5xx, network, abort). 5 unit tests added. |

---

### Low (P3 — Defer to Post-Release Backlog, Include in Session)

#### F11: RRF parameter coupling — DEFAULT_MIN_SCORE and rank_constant

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **ADR** | [ADR-120](../../docs/architecture/architectural-decisions/120-per-scope-search-tuning.md) |
| **Problem** | `DEFAULT_MIN_SCORE` (0.02) and `rank_constant` (60) are mathematically coupled. Changing one without the other can weaken or over-filter results. No build-time guard. |
| **Files** | `packages/sdks/oak-search-sdk/src/retrieval/rrf-score-processing.ts`, `packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts` |
| **Fix** | Add comment in rrf-query-builders.ts referencing coupling. Consider shared constant or module. Document recalibration steps. |
| **Status** | [ ] Open |

#### F12: Search SDK → curriculum-sdk evolution path (Step 3)

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Betty |
| **Problem** | ADR-108 Step 1 permits search-sdk coupling to curriculum-sdk for shared runtime exports (`buildElasticsearchSynonyms`, `isKeyStage`, etc.). For Step 3 (Generic Extraction), consider extracting shared domain utilities into `packages/libs/oak-domain` to fully decouple. |
| **Fix** | Plan extraction. Not blocking M1. |
| **Status** | [x] Closed (2026-02-26). Concrete work (moving functions) is in F7. The remaining "oak-domain library" question is future architectural direction, not a current fix. |

#### F13: Adoption rollout — resolveEnv and Result pattern

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Betty |
| **Problem** | Apps may still use legacy inline env parsing or throwing instead of Result. Two paradigms increase cognitive load. |
| **Fix** | Create systematic adoption plan using `adoption-rollout-plan-template.md` from ADR-117. Migrate all apps to `resolveEnv` and `Result`. |
| **Status** | [x] Closed (2026-02-26). All three apps now use `resolveEnv` (F8 complete). Concrete Result pattern instances covered by R4. The "adoption plan template" is process overhead — the work is done or tracked. |

#### F14: Search SDK integration test

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Fred, Wilma |
| **Problem** | No integration test runs Search SDK against curriculum SDK after codegen. Type/schema breakage could slip through. |
| **Fix** | Add test that builds both SDKs and runs retrieval smoke test after `pnpm sdk-codegen`. |
| **Status** | [ ] Open |

#### F15: ES timeout → RetrievalError mapping

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **Problem** | `RetrievalError` has `timeout` variant, but retrieval code generally maps ES errors to `es_error` via `toRetrievalError`. Confirm whether timeouts are explicitly mapped to `timeout`; whether callers need that distinction for UX or retries. |
| **Files** | `packages/sdks/oak-search-sdk/src/retrieval/*.ts` |
| **Fix** | Verify ES timeout mapping. Add explicit timeout mapping if needed. Document caller behaviour. |
| **Status** | [ ] Open |

#### F16: OAuth proxy rate limiting

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **ADR** | ADR-115 |
| **Problem** | Proxy endpoints are unauthenticated and not rate-limited at app layer; mitigation expected at edge/WAF. |
| **Fix** | Confirm Vercel (or other WAF) rate limits are in place before production rollout. Document deployment precondition. |
| **Status** | [ ] Open |

#### F17: Remove public/search.ts facade — direct sdk-codegen imports

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Fred |
| **Problem** | ADR-108 says "no thin runtime facade" but `curriculum-sdk/public/search.ts` is a 174-line re-export barrel that masks where types actually live. 32 search CLI files and 4 HTTP app files import from this facade instead of directly from `@oaknational/sdk-codegen/search`. This creates unnecessary coupling and hides the true dependency graph — it is not DX convenience, it is a labyrinth. |
| **Files** | `packages/sdks/oak-curriculum-sdk/src/public/search.ts` (facade), 32 files in `apps/oak-search-cli/`, 4 files in `apps/oak-curriculum-mcp-streamable-http/` |
| **Fix** | (1) Migrate all consumer imports from `@oaknational/curriculum-sdk/public/search.js` to direct `@oaknational/sdk-codegen/search` (or appropriate subpath: `/query-parser`, `/observability`, `/admin`, `/zod`). (2) Keep curriculum-sdk imports ONLY for `search-response-guards` symbols (`lessonSummarySchema`, `unitSummarySchema`, `isSequenceUnitsResponse`, etc.) — these are curriculum-sdk's own runtime code, not re-exports. (3) Update ADR-108 to remove the contradiction. (4) Consider removing or reducing `public/search.ts` itself once no external consumers remain. |
| **Status** | [ ] Open |

#### F18: config-reviewer — LIB_PACKAGES and env identity

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Fred |
| **Problem** | `LIB_PACKAGES` has stale entries. Env package identity (core vs lib) unclear. |
| **Fix** | Invoke config-reviewer. Remove stale entries, decide core vs lib categorisation. |
| **Status** | [x] Subsumed by F5 — completed together (2026-02-25). `LIB_PACKAGES` now `['logger', 'env-resolution']`. Stale entries removed, all packages correctly categorised. |

#### F19: type-reviewer — type-helpers assertion strategy

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Fred |
| **Problem** | `type-helpers` package contains audited assertion overrides. Verify centralised strategy is minimal and sound. |
| **Fix** | Invoke type-reviewer for audit. |
| **Status** | [ ] Open |

---

### Phase 1 Execution Report (2026-02-25)

**Completed**: F1, F2, F3, F21, F22, F23, F24 (7 of 7 items).

**Quality gates run**: `sdk-codegen`, `build`, `type-check`, `lint:fix`, `format:root`, `markdownlint:root`, `test`, `test:e2e`, `test:ui`, `smoke:dev:stub` — all passed.

**Specialist reviewers invoked**: `code-reviewer`, `architecture-reviewer-barney`, `architecture-reviewer-fred`, `architecture-reviewer-wilma`, `security-reviewer`. Findings partially addressed; remaining issues captured in §R below.

**Reference**: Execution details in [Phase 1 Cursor plan](/Users/jim/.cursor/plans/m1_release_fixes_phase_1_dbc6c9b8.plan.md) and [session transcript](../../.cursor/projects/Users-jim-code-oak-oak-mcp-ecosystem/agent-transcripts/a7a67403-0cc4-4567-a320-2782d16aca7e.txt).

### §R: Phase 1 Remediation (TOP PRIORITY)

Release-blocking remediation items (**R1–R3**) must be completed before moving to Phase 2 fixes (F4 onwards).  
**R4** moved to Batch E2 (elevated 2026-02-26 — fix before release).

#### R1: Remove `as` type assertions from Phase 1 test files

| Field | Value |
|-------|-------|
| **Severity** | P1 — violates cardinal no-type-shortcuts rule |
| **Rule** | `no-type-shortcuts.mdc`, `rules.md` §Compiler-Time Types |
| **Problem** | Phase 1 introduced `as` type assertions in test files, violating no-type-shortcuts discipline. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/src/auth-routes.integration.test.ts`, `packages/core/oak-eslint/src/rules/sdk-boundary.unit.test.ts`, `packages/core/oak-eslint/src/rules/core-boundary.unit.test.ts` |
| **Fix** | Replaced assertion-based access with explicit runtime-safe extraction/assertions in integration and boundary tests. Removed remaining `as` shortcuts in affected files. |
| **Status** | [x] Complete (2026-02-25) |

#### R2: Add test coverage for F23 startup failure path

| Field | Value |
|-------|-------|
| **Severity** | P1 — untested behaviour |
| **Rule** | `tdd-at-all-levels.mdc`, `testing-strategy.md` |
| **Problem** | F23 implementation (try/catch around `createApp()`) was written without tests. The startup failure path — where `createApp` throws and the process should log and exit — has zero test coverage. TDD was not followed; the gap cannot be retroactively closed for the design process, but test coverage can be added. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/src/index.ts` |
| **Fix** | Add a test that verifies `createApp` rejection is caught, logged, and results in `process.exit(1)`. Consider whether this is best tested as a unit test (mocking `createApp`) or integration test (injecting a config that causes startup failure). |
| **Status** | [x] Complete (2026-02-25). Extracted `bootstrapApp<T>` function with DI (`BootstrapAppDeps`). 3 integration tests (success path, failure-logs-and-exits, call-order). `index.ts` refactored to use `bootstrapApp`. |

#### R3: Run remaining quality gates

| Field | Value |
|-------|-------|
| **Severity** | P1 — incomplete verification |
| **Rule** | `all-quality-gate-issues-are-always-blocking.mdc` |
| **Problem** | `test:e2e`, `test:ui`, and `smoke:dev:stub` were not run during Phase 1 execution. |
| **Fix** | Run `pnpm test:e2e && pnpm test:ui && pnpm smoke:dev:stub`. Fix any failures. |
| **Status** | [x] Complete (2026-02-25). All three gates executed and passed. |

#### R4: Result pattern for deriveSelfOrigin and fetchUpstreamMetadata (deferred)

| Field | Value |
|-------|-------|
| **Severity** | P2 — rules.md prefers Result over throw |
| **Rule** | `rules.md` §Code Design |
| **Problem** | Both `deriveSelfOrigin` (auth-routes.ts) and `fetchUpstreamMetadata` (oauth-and-caching-setup.ts) throw errors rather than returning `Result<T, E>`. The calling code uses try/catch. |
| **Fix** | Refactor to return `Result<T, E>`. Callers pattern-match on `ok` / `error`. |
| **Status** | [ ] Open |

### Execution Order (Batched — Updated 2026-02-26)

Batched by complexity for efficient execution. Run quality gates and commit after each batch.

~~**Batch A — Remediation + Trivial** (8 items)~~ **COMPLETE**

1. ~~R2, F4, F9, F26, F30, O4, O6, O7~~

~~**Batch B — Small Architecture + Documentation** (11 items)~~ **COMPLETE**

2. ~~F6, F10, F20, F25, F28, F29~~ (small arch/doc fixes)
3. ~~O1, O2, O3, O5, O10~~ (small onboarding fixes — O1/O2/O3 resolved by prior docs session)

~~**Batch C — Medium Complexity** (3 items + O12)~~ **COMPLETE**

4. ~~**F5** (env identity + LIB_PACKAGES; subsumes F18)~~ **COMPLETE**
5. ~~**F8** (env pipeline unification — STDIO + Search CLI)~~ **COMPLETE**
6. ~~**F27** (response-augmentation DI)~~ **COMPLETE**
7. ~~**O12** (OAuth bootstrap troubleshooting note)~~ **COMPLETE**

**Batch D — ADR-108 Completion** (1 item) ← **IN PROGRESS**:

8. **F7** (complete ADR-108: move synonym/vocab functions to sdk-codegen, remove search-sdk→curriculum-sdk dependency. `SearchRetrievalService` stays as ISP.)

**Batch E — All Remaining Items** (12 items — elevated 2026-02-26, F12/F13 closed, O8 complete):

**E1 — Trivial** (commit together):

9. **F35** (delete dead code: `createInMemoryStorage`, `createNodeClock`, `runtime` from `WiredDependencies`)
10. **F11** (document RRF parameter coupling)
11. **F16** (document OAuth proxy rate limiting deployment precondition)

**E2 — Small** (commit together):

12. **R4** (Result pattern for `deriveSelfOrigin`/`fetchUpstreamMetadata`)
13. **F14** (search SDK integration test after codegen)
14. **F15** (verify/fix ES timeout → `RetrievalError.timeout` mapping)
15. **F19** (type-helpers assertion strategy audit)
16. **F31** (fix SDK API markdown generator for current package name)
17. **F34** (document ES connectivity trade-off or add warm-up ping)

**E3 — Medium** (commit individually):

18. **F17** (remove `public/search.ts` facade — 36-file import migration + ADR-108 update)
19. **F32** (standardise E2E config naming repo-wide)
20. **F33** (progressive ESLint re-enablement in codegen hand-written code)

### Specialist Follow-Ups (Batch E)

| Finding | Reviewer | Rationale |
|---------|----------|-----------|
| F16 (rate limit) | security-reviewer | ADR-115 deployment preconditions |
| F17 (facade removal) | docs-adr-reviewer, architecture-reviewer-barney | ADR-108 alignment + import migration review |
| F18 | config-reviewer | Subsumed by F5 — **COMPLETE** |
| F19 | type-reviewer | type-helpers assertion audit |
| F33 (ESLint re-enable) | config-reviewer | Progressive rule enablement in codegen |

---

## Additional Architecture Fixes (Thorough Review 2026-02-25)

**Source**: Second-pass architecture review plus onboarding-reviewer (2026-02-25).  
**Scope**: All findings to be addressed in the same dedicated session as F1–F19, including low-priority items.

### Critical / High

#### F20: Deployment-verification docs internally contradictory

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Barney |
| **Problem** | `BUILD_VERIFICATION.md` and `TESTING_GAP_ANALYSIS.md` claim `test:e2e` was removed but still instruct running `pnpm test:e2e`. Historical notes conflict with operational content. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/docs/BUILD_VERIFICATION.md`, `apps/oak-curriculum-mcp-streamable-http/docs/TESTING_GAP_ANALYSIS.md` |
| **Fix** | Fix or archive both docs so they cannot be read as current operational truth. Remove contradictions or mark clearly as historical-only. |
| **Status** | [x] Complete (2026-02-25). Both docs archived to `docs/archive/`. Cross-references updated. |

#### F21: coreBoundaryRules does not block SDK imports

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Fred |
| **ADR** | ADR-041 |
| **Problem** | `coreBoundaryRules` blocks libs and apps but not `packages/sdks/**`. Core importing from an SDK would go undetected by ESLint. |
| **Files** | `packages/core/oak-eslint/src/rules/boundary.ts` |
| **Fix** | Add third zone: `from: '../../../packages/sdks/**'` with message "Core cannot import from SDKs. Core must remain domain-agnostic." |
| **Status** | [x] Complete (2026-02-25). TDD applied: test written first (RED), zone added (GREEN). Unit test in `core-boundary.unit.test.ts`. |

#### F22: packages/core/result and type-helpers use lib boundary rules

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Fred |
| **Problem** | Same as F5 for env: `result` and `type-helpers` use `createLibBoundaryRules` but live in `packages/core/`. Should use `coreBoundaryRules`. |
| **Files** | `packages/core/result/eslint.config.ts`, `packages/core/type-helpers/eslint.config.ts` |
| **Fix** | Update both to use `coreBoundaryRules` instead of `createLibBoundaryRules`. |
| **Status** | [x] Complete (2026-02-25). Both switched to `coreBoundaryRules` for `src/**/*.ts`; `coreTestConfigRules` applied for test/config files to allow dev dependencies. |

#### F23: HTTP index.ts — unhandled createApp() rejection

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Wilma |
| **Problem** | `await createApp({ runtimeConfig: config })` has no try/catch. Startup failures produce unhandled promise rejection instead of controlled exit. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/src/index.ts` |
| **Fix** | Wrap startup in try/catch, log error clearly, call `process.exit(1)`. |
| **Status** | [x] Complete (2026-02-25) — remediation required (see §R). try/catch added with log + `process.exit(1)`. TDD not followed: no test for startup failure path. |

#### F24: fetchUpstreamMetadata — no response.ok check

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Wilma |
| **Problem** | No `response.ok` check; 4xx/5xx bodies parsed as JSON and fail validation with confusing errors. F10 covers timeout; this adds status validation. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/src/app/oauth-and-caching-setup.ts` |
| **Fix** | Check `response.ok`, throw with status code and body; ensure timeout (F10) is also applied. |
| **Status** | [x] Complete (2026-02-25). `response.ok` check added with DI (`FetchFn` parameter). TDD applied: 4 unit tests (success, 503, 404, invalid shape). |

#### F25: deployment-architecture.md out of date

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Wilma |
| **Problem** | Docs describe sync `createApp`, `coreTransport` vs `mcpFactory`, old startup `ready` pattern vs ADR-112 per-request transport. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/docs/deployment-architecture.md` |
| **Fix** | Update for async `createApp`, `mcpFactory`, ADR-112, and current bootstrap flow. |
| **Status** | [x] Complete (2026-02-25). Updated for async `createApp`, `mcpFactory` per-request pattern, corrected middleware phase diagram. |

---

### Medium

#### F26: AGENT.md and ai-agent-guide.md — wrong package locations

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Barney, Onboarding-reviewer |
| **Problem** | `@oaknational/result` and `@oaknational/env` listed under `packages/libs/`; both are in `packages/core/`. Actual libs = `logger` only. |
| **Files** | `.agent/directives/AGENT.md`, `docs/governance/ai-agent-guide.md` |
| **Fix** | Move `@oaknational/result` and `@oaknational/env` to `packages/core/` line. Update ai-agent-guide architecture section to match. |
| **Status** | [x] Complete (2026-02-25). Both docs updated. Also added `@oaknational/oak-search-sdk` and `@oaknational/sdk-codegen` to AGENT.md SDKs line. Note: `ai-agent-guide.md` subsequently deleted as entirely redundant. |

#### F27: SDK response-augmentation reads process.env directly

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Fred |
| **ADR** | ADR-078 |
| **Problem** | Module-level logger instantiation reads `process.env` inside SDK. DI violation: env must be read at entry point and passed as config. |
| **Files** | `packages/sdks/oak-curriculum-sdk/src/response-augmentation.ts`, `packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts` |
| **Fix** | Accept logger as parameter or factory. Let consuming app provide logger configured from entry-point env. |
| **Status** | [x] Complete (2026-02-26). Removed module-level logger from `response-augmentation.ts` (pure function now throws `TypeError`). `MiddlewareOptions.logger` made required. `OakClientConfig.logger` optional with `createNoopLogger()` fallback in `BaseApiClient`. SDK no longer reads `process.env` for logging. STDIO app injects its logger via `OakClientConfig`. Duplicate test removed from middleware integration tests. Specialist reviewers: code-reviewer, architecture-reviewer-fred, type-reviewer, test-reviewer. |

#### F28: Blanket eslint-disable in search CLI ground-truth generation

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Fred |
| **Problem** | `bulk-data-parser.ts`, `generate-ground-truth-types.ts`, `type-emitter.ts` have file-level disables for max-lines, complexity, type-assertions, no-restricted-types. Violates never-disable-checks rule. |
| **Files** | `apps/oak-search-cli/ground-truths/generation/*.ts` |
| **Fix** | Refactor to comply with limits, or use narrow line-level disables with justification. Consider splitting large generators. |
| **Status** | [x] Complete (2026-02-25). Removed blanket disables from 4 files. Replaced `as Record<string, unknown>` with `in` operator narrowing in `bulk-data-parser.ts`. Structural exemptions moved to centralised `eslint.config.ts` overrides. |

#### F29: Boundary rule wording — "core depends on nothing"

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Barney |
| **Problem** | docs/architecture/README.md says "core depends on nothing", but `packages/core/env` depends on `@oaknational/result` (intra-core). Wording implies violation. |
| **Files** | `docs/architecture/README.md` |
| **Fix** | Clarify boundary rule to allow/disallow intra-core dependencies explicitly. |
| **Status** | [x] Complete (2026-02-25). Clarified to "core has no dependencies outside core; intra-core dependencies are permitted". |

#### F30: STDIO bin — redundant requireRepoRoot() call

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Wilma |
| **Problem** | `rootDir` from `requireRepoRoot()` passed to `createDefaultStartupLoggerDeps()` which also calls `requireRepoRoot()`. Redundant second call. |
| **Files** | `apps/oak-curriculum-mcp-stdio/bin/oak-curriculum-mcp.ts` |
| **Fix** | Call `requireRepoRoot()` once at entry point; pass result without duplicate call inside deps. |
| **Status** | [x] Complete (2026-02-25). Captured `createDefaultStartupLoggerDeps()` result, extracted `rootDir` from it. Removed redundant `requireRepoRoot()` import and call. |

---

### Low

#### F31: SDK API markdown — old package identity

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Barney |
| **Problem** | Generated API markdown titles still use `@oaknational/oak-curriculum-sdk`; package is now `@oaknational/curriculum-sdk`. |
| **Files** | `packages/sdks/oak-curriculum-sdk/docs/api-md/README.md` (generated) |
| **Fix** | Regenerate SDK API markdown or fix generator to use current package name. |
| **Status** | [ ] Open |

#### F32: E2E config naming inconsistency

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Barney |
| **Problem** | `turbo.json` tracks `vitest.config.e2e.ts`; MCP apps use `vitest.e2e.config.ts`; SDKs use the former. Increases cognitive load. |
| **Files** | `turbo.json`, `apps/oak-curriculum-mcp-streamable-http/package.json`, `packages/sdks/oak-curriculum-sdk/package.json` |
| **Fix** | Standardise E2E config naming repo-wide; align turbo inputs. |
| **Status** | [ ] Open |

#### F33: SDK codegen ESLint — broad rule disables for hand-written code

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Fred |
| **Problem** | `code-generation/` and `vocab-gen/` have directory-wide disables (no-restricted-types, complexity, etc.). Hand-written code, not generated. |
| **Files** | `packages/sdks/oak-sdk-codegen/eslint.config.ts` |
| **Fix** | Progressively re-enable rules; use line-level disables where exceptions needed. |
| **Status** | [ ] Open |

#### F34: Elasticsearch — no startup connectivity check

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **Problem** | ES client created at startup but connectivity not checked. First search tool call fails if ES unreachable. |
| **Files** | `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts`, `apps/oak-curriculum-mcp-streamable-http/src/search-retrieval-factory.ts` |
| **Fix** | Document as known trade-off. Consider future warm-up ping at startup for production. |
| **Status** | [ ] Open |

#### F35: Dead code — createInMemoryStorage and createNodeClock

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **Problem** | `createInMemoryStorage` and `createNodeClock` in STDIO `wiring.ts` are dead code. They are created and assigned to `runtime.clock` and `runtime.storage` on `WiredDependencies`, but nothing in the STDIO app (or any other app) ever reads them. Vestigial from the deleted `@oaknational/mcp-providers-node` package. |
| **Files** | `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` |
| **Fix** | Delete both functions, remove `runtime` from `WiredDependencies`, remove creation/assignment in `wireDependencies`. |
| **Status** | [ ] Open |

---

## Pre-Release Onboarding and Documentation Fixes

**Source**: Onboarding-reviewer (2026-02-25).  
**Scope**: All findings to be addressed in the same dedicated session as F1–F35.

### Critical (P1)

#### O1: jc-start-right.md — quality gate list incomplete

| Field | Value |
|-------|-------|
| **Severity** | P1 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | Command lists 8 gates; `start-right.prompt.md` lists 10. Missing: `pnpm test:ui` and `pnpm smoke:dev:stub`. AI agents via command skip two gates. |
| **Files** | `.cursor/commands/jc-start-right.md` |
| **Fix** | Add `pnpm test:ui` and `pnpm smoke:dev:stub` to gate list to match `start-right.prompt.md`. |
| **Status** | [x] Complete (2026-02-25). Commands reduced to thin pointers to prompts; prompts have the full 10-gate list. Gate-list divergence eliminated. |

### High (P2)

#### O2: quick-start.md — repository structure tree wrong

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | Missing `packages/core/`; missing `oak-search-sdk`; `packages/libs/` says "logger, storage, etc." but only logger exists; `docs/` shows wrong subdirs; `docs/development/` empty. |
| **Files** | `docs/foundation/quick-start.md` |
| **Fix** | Update tree to reflect actual structure including `packages/core/`, search SDK, real docs subdirs. |
| **Status** | [x] Complete (2026-02-25). Tree updated: added `packages/core/`, `oak-search-sdk/`; corrected libs to just logger; docs subdirs now match actual structure. |

#### O3: Quality gate ordering — subset context missing

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | `rules.md` and `ai-agent-guide.md` give different gate orderings without stating they are iteration-time subsets. (Previously also `onboarding.md`, now removed.) |
| **Files** | `.agent/directives/rules.md`, `docs/governance/ai-agent-guide.md` |
| **Fix** | Add brief note indicating subsets and pointer to full sequence in `start-right.prompt.md` or `docs/engineering/build-system.md`. |
| **Status** | [x] Complete (2026-02-25). `ai-agent-guide.md` deleted (entirely redundant). `rules.md` now cross-references AGENT.md. Canonical gate sequence lives in `start-right.prompt.md`. No divergent subset lists remain. |

#### O4: ai-agent-guide.md — pnpm build omitted from development gates

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | "During Development" gate list omits `pnpm build`. |
| **Files** | `docs/governance/ai-agent-guide.md` |
| **Fix** | Add `pnpm build` to development gate list. |
| **Status** | [x] Complete (2026-02-25). Added `pnpm build` and reordered gates to canonical sequence. Note: `ai-agent-guide.md` subsequently deleted as entirely redundant. |

#### O5: doc-gen and subagents:check absent from start-right sequences

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | Both gates part of `pnpm make` and `pnpm check` but not in start-right canonical lists. AI agents following only start-right skip them. |
| **Files** | `.agent/prompts/start-right.prompt.md` (commands are now thin pointers) |
| **Fix** | Add to canonical gate list in prompt, or explicitly note they are only for specific contexts (e.g. after docs/sub-agent changes). |
| **Status** | [x] Complete (2026-02-25). Added `pnpm doc-gen` and `pnpm subagents:check` to both start-right prompt files with conditional-application comments. |

#### O6: start-right-thorough.prompt.md — grammar error

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | "what value are delivering" — missing "we". |
| **Files** | `.agent/prompts/start-right-thorough.prompt.md` |
| **Fix** | Change to "what value are we delivering". |
| **Status** | [x] Complete (2026-02-25). Grammar fixed. |

#### O7: onboarding.md — add onboarding-reviewer to reviewer table

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Reviewers** | Barney, Onboarding-reviewer |
| **Problem** | Sub-agent table lists standard specialists but not `onboarding-reviewer`; invoke-code-reviewers rule adds it for onboarding-flow changes. |
| **Files** | `docs/foundation/onboarding.md` |
| **Fix** | Add `onboarding-reviewer` to table (marked situational/on-demand). |
| **Status** | [x] Complete (2026-02-25). Added `onboarding-reviewer` and `config-reviewer` to table. Note: `onboarding.md` subsequently removed; useful content integrated into quick-start.md and troubleshooting.md. |

### Low (P3)

#### O8: docs/development/ directory empty

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | Listed in quick-start tree as "Development guides" but contains no files. |
| **Files** | `docs/development/`, `docs/foundation/quick-start.md` |
| **Fix** | Populate, remove directory, or correct tree reference. |
| **Status** | [x] Complete (2026-02-26). Quick-start tree updated to show current `docs/` subdirs (2026-02-25). Empty `docs/development/` and `docs/data/` directories deleted by user (2026-02-26). |

#### O9: jc-start-right.md and start-right.prompt.md near-duplicates

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | Command duplicates prompt content; root cause of gate-list divergence. SKILL correctly references prompt. |
| **Files** | `.cursor/commands/jc-start-right.md`, `.agent/prompts/start-right.prompt.md` |
| **Fix** | Consider having command reference prompt rather than duplicating (DRY). |
| **Status** | [x] Complete (2026-02-25). Commands reduced to single-line pointers to their respective prompts. No duplication remains. |

#### O10: AGENT.md — convenience commands omitted

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | `pnpm make`, `pnpm qg`, `pnpm fix`, `pnpm doc-gen` in README Key Commands but not in AGENT.md Development Commands. |
| **Files** | `.agent/directives/AGENT.md` |
| **Fix** | Add convenience commands for reference. |
| **Status** | [x] Complete (2026-02-25). Added `pnpm make`, `pnpm qg`, `pnpm fix`, `pnpm doc-gen` to AGENT.md Development Commands. |

#### O11: onboarding.md step 9 — title ambiguous

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Onboarding-reviewer |
| **Problem** | "Quality Gate Checklist" reads like full list but is quick-iteration subset. |
| **Files** | `docs/foundation/onboarding.md` |
| **Fix** | Add "(quick iteration)" or "(local development)" to disambiguate. |
| **Status** | [x] Cancelled — `onboarding.md` is being removed. Useful content integrated elsewhere by separate agent. |

#### O12: OAuth bootstrap troubleshooting note

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **Problem** | No troubleshooting guidance for OAuth metadata fetch failures at startup. Under Clerk outage, contributors may not connect startup failures to OAuth. |
| **Files** | `apps/oak-curriculum-mcp-streamable-http/README.md` (target redirected from removed `onboarding.md`) |
| **Fix** | Add troubleshooting note to HTTP server README: "If server fails to start, ensure Clerk's `/.well-known/oauth-authorization-server` is reachable." |
| **Status** | [x] Complete (2026-02-26). Added troubleshooting note covering OAuth metadata fetch timeout, DNS/firewall/Clerk diagnostics, and F10 exponential backoff cross-reference. |

---

### Onboarding Execution Order

Onboarding items are interleaved into the main batched execution order (see §Execution Order above):

- **Batch A** (trivial): O4, O6, O7 — **COMPLETE**
- **Batch B** (small): O1, O2, O3, O5, O10 — **COMPLETE** (O8 completed in Batch E; O11 cancelled — target file removed)
- **Batch C** (medium): ~~O9~~, ~~O12~~ (O9 resolved — commands are thin pointers; O12 complete — troubleshooting note added to HTTP server README)

---

## Go/No-Go Gate

No release without an explicit recorded decision.

### Required Inputs

1. Gate checklist G1-G8 status.
2. Snag register with no open P0/P1.
3. Rollback plan validated and callable.
4. Named on-call or responsible engineer for early-life watch.

### Decision Record

| Field | Value |
|---|---|
| Decision | Go / No-Go |
| Date | YYYY-MM-DD |
| Milestone owner | name |
| Engineering approver | name |
| Product approver | name |
| Notes | rationale and risk summary |

---

## Release Execution and Safety Controls

### Controlled Rollout

1. Announce release window and freeze non-release merges.
2. Deploy release candidate.
3. Run post-deploy smoke checks on core paths.
4. Verify auth, tool execution, and search baseline behaviour.
5. Start early-life watch window.

### Rollback Readiness

Rollback triggers:

1. unresolved P0 after release,
2. sustained core-path failure,
3. security or data-risk signal requiring immediate reversal.

Rollback actions:

1. revert deployment to last known good release,
2. communicate rollback status and incident owner,
3. open post-incident snag with root-cause follow-up plan.

---

## Milestone 1 Exit Criteria

Milestone 1 release is complete when all are true:

1. G1-G8 are complete with evidence.
2. No open P0/P1 snags.
3. Go decision recorded.
4. Release executed and monitored with no unresolved critical regressions.
5. All snagging items addressed (fixed or explicitly closed with rationale).

---

## Change Log

- **2026-02-26**: **O8 complete, plan handoff preparation.** User deleted empty `docs/development/` and `docs/data/` directories. O8 marked complete. Open items: 13 remaining (1 P1, 1 P2, 11 P3). Documentation consolidation: corrected stale `SearchRetrievalService` "duplicate contract" language in `distilled.md` and `napkin.md` to reflect ISP decision. Updated experience README catalog. Fixed §R section (R4 no longer described as "deferred"). Corrected change log entry re "delete duplicate contract". Renumbered Batch E execution order.
- **2026-02-26**: **Batch E elevated — all items fix-before-release.** User rejected deferral of Batch E items (agent-decided, not user-approved). Two decisions recorded: (1) F7 step 4: `SearchRetrievalService` stays in curriculum-sdk as ISP consumer-side interface — not a duplicate, structural typing handles wiring, no SDK-to-SDK dependency. (2) F17: remove `public/search.ts` facade entirely — migrate 36 files to direct `@oaknational/sdk-codegen/search` imports; the facade masks truth and creates a labyrinth. F12 closed (concrete work in F7; remaining "oak-domain" question is future architecture). F13 closed (resolveEnv adoption done via F8; Result instances covered by R4). F35 reframed as dead code deletion. F17 expanded from "ADR text alignment" to full facade removal. Batch E restructured into E1 (trivial), E2 (small), E3 (medium). Open items: 14 remaining (1 P1, 1 P2, 12 P3).
- **2026-02-26**: **Batch C COMPLETE, F7 reframed.** F8 Search CLI fully migrated to `resolveEnv` five-source hierarchy: `SearchCliEnvSchema` composing shared schemas with stricter overrides, `loadRuntimeConfig` + `loadConfigOrExit`, deleted `loadAppEnv`, refactored 29+ files to DI pattern, 7 new integration tests, 950 total tests pass. `@oaknational/env-resolution` enhanced with `findAppRoot` and five-source merge. ADR-116 revised. F7 upgraded from P2 to P1: user identified that the contract duplication is a consequence of search-sdk depending on curriculum-sdk (unfinished ADR-108 work), not an acceptable trade-off. Architecture reviewer recommended deferral based on cycle analysis; user corrected: the cycle IS the bug, `oak-sdk-codegen` exists to solve it. F7 reframed as "complete ADR-108" — move synonym/vocab functions to sdk-codegen, remove search-sdk→curriculum-sdk dependency entirely. (Note: "delete duplicate contract" originally stated here was revised later in this session — `SearchRetrievalService` stays as ISP; see entry above.) Cursor plan integrated and deleted. Open items: 16 remaining (1 P1, 1 P2, 14 P3).
- **2026-02-26**: **Batch C near-complete** (F8-STDIO, F27, O12 done). F8: STDIO app migrated to `resolveEnv` pipeline — `StdioEnvSchema` composing shared schemas, `loadRuntimeConfig` returns `Result<RuntimeConfig, ConfigError>`, `process.env` eliminated from all `src/` modules, 10 integration tests. Search CLI deferred. F27: SDK response-augmentation DI — removed module-level logger, `MiddlewareOptions.logger` required, `createNoopLogger()` fallback in `BaseApiClient`, SDK no longer reads `process.env` for logging. O12: OAuth metadata fetch timeout troubleshooting note added to HTTP server README. STDIO README updated with env pipeline docs. SDK README updated with optional `logger` parameter. Fixed `no-empty-function` lint in `oak-base-client.ts`. All quality gates pass (build, type-check, lint:fix, format, markdownlint, test, test:e2e). Specialist reviewers: code-reviewer (approved), architecture-reviewer-fred (compliant), type-reviewer (safe), test-reviewer (pass), docs-adr-reviewer (gaps fixed). Open items: 14 remaining.
- **2026-02-25**: **F5/F18 complete** (Batch C, 1 of 3). Split `@oaknational/env` into pure schema contracts (core) and `@oaknational/env-resolution` runtime pipeline (libs). `LIB_PACKAGES` cleaned to `['logger', 'env-resolution']`. Fixed `openapi-zod-client-adapter` ESLint config (was `createLibBoundaryRules`, now `coreBoundaryRules`). 9 consumer files migrated. Updated ADR-116, architecture README, AGENT.md, rules.md, quick-start, root README. All quality gates pass. Specialist reviewers: code-reviewer, arch-barney, arch-fred, config-reviewer. Open items: 16 remaining.
- **2026-02-25**: **Batch B complete** (8 items: F6, F10, F20, F25, F28, F29, O5, O10). F6: extracted `createSearchRetrieval` to `@oaknational/oak-search-sdk` (3 unit tests). F10: per-attempt timeout + exponential backoff retry (5 unit tests). F20: archived contradictory docs. F25: updated deployment-architecture.md. F28: removed blanket eslint-disables, centralised overrides. F29: fixed "core depends on nothing" wording. O5: added `doc-gen`/`subagents:check` to start-right gates. O10: added convenience commands to AGENT.md. All quality gates pass. Committed in `b85c44ec` + `9ad2d66a` (reviewer fixes). Cursor implementation plan integrated and deleted. Open items: 18 remaining.
- **2026-02-25**: Parallel docs/onboarding session complete. Resolved 6 items: O1 (commands→pointers, gates aligned), O2 (quick-start tree fixed), O3 (ai-agent-guide deleted, no divergent gate subsets), O4 (annotated re deletion), O8 (partially — tree fixed, empty dir remains), O9 (DRY — commands are pointers). Updated F26 note. Corrected file references for O5 (commands are now pointers). ADR count updated to 116 across 3 files. `CONTRIBUTING.md` type-safety wording improved. `rules.md` architectural model corrected and cross-referenced to AGENT.md. Open items: 26 remaining.
- **2026-02-25**: Plan updated for standalone handoff. `onboarding.md` being removed by parallel agent — O11 cancelled (target file removed), O12 retargeted to HTTP server README, O8 demoted to Batch E. Next Session Checklist rewritten as self-contained entry point with Getting Started steps, Current State summary, and item-level file references. Execution Order and Onboarding Execution Order aligned. Open items: 32 remaining.
- **2026-02-25**: **Batch A complete** (8 items: R2, F4, F9, F26, F30, O4, O6, O7). R2: extracted `bootstrapApp<T>` with DI + 3 integration tests. F4: typeSafeEntries import fixed. F9: app boundary rules added to Search CLI. F26: package locations corrected in AGENT.md and ai-agent-guide. F30: redundant `requireRepoRoot()` removed. O4: `pnpm build` added to gate list. O6: grammar fixed. O7: `onboarding-reviewer` and `config-reviewer` added to table. All quality gates pass (build, type-check, lint:fix, format, markdownlint, test, test:e2e, test:ui, smoke:dev:stub).
- **2026-02-25**: Full codebase verification of all 42 open items — every problem confirmed still present. Replaced linear execution order with batched approach (A–E) grouped by complexity for efficient execution. F18 marked as subsumed by F5. Updated Next Session Checklist with batch definitions and item-level complexity estimates.
- **2026-02-25**: Phase 1 execution complete (F1, F2, F3, F21, F22, F23, F24). Added Phase 1 Execution Report, §R Remediation section (R1–R4), and updated execution order to prioritise remediation before Phase 2. Key findings: `as` assertions introduced in test files (R1), F23 startup failure path untested (R2), remaining quality gates not run (R3). Status lines updated on all 7 completed items.
- **2026-02-25**: Remediation progress update: **R1 complete** (removed assertion shortcuts in test files), **R3 complete** (ran `test:e2e`, `test:ui`, `smoke:dev:stub` all green). F3 hardening expanded to enforce host validation consistently across OAuth metadata and MCP auth challenge/resource URL generation with added unit/integration/E2E coverage. Extracted settled behavior into permanent docs by updating `apps/oak-curriculum-mcp-streamable-http/README.md` (`ALLOWED_HOSTS` semantics and 403 behavior for malformed/disallowed host headers). **R2** remains open.
- **2026-02-25**: Added Additional Architecture Fixes (F20–F35) and Pre-Release Onboarding and Documentation Fixes (O1–O12) from thorough review 2026-02-25. F20–F35 from second-pass architecture review (Barney, Fred, Wilma) and onboarding-reviewer; O1–O12 from onboarding-reviewer. Updated scope to cover all findings in dedicated session, including low-priority items. Revised execution order to include new architecture fixes.
- **2026-02-25**: Added comprehensive Pre-Release Architecture Fixes section consolidating all findings from four architecture reviewers (Barney, Betty, Fred, Wilma) comparing `feat/semantic_search_deployment` vs `main`. 19 findings (F1–F19) with severity, fix instructions, file references, and recommended execution order. All to be addressed in a fresh session including low-priority items.
- **2026-02-25**: Created milestone release plan for M1 as new plan type focused on checks, snagging, and safe release execution.
