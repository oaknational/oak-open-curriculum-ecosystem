# Milestone 1 Release Plan (Public Alpha)

**Status**: Active  
**Last Updated**: 2026-02-28  
**Milestone**: Milestone 1 (Public Alpha)  
**Open items**: M1-S001a code complete but reindex pending. M1-S001b/S002/S003/S005/S008 complete. M1-S004 open (P3). M1-S006 open (upstream). M1-S007 deferred. Remaining M0 gates: secrets sweep, manual review, merge, make public.

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

### Milestone Progression

Three distinct milestones, in order:

| Milestone | State | Repo | HTTP Server | Key gates |
|---|---|---|---|---|
| **Closed private alpha** | CURRENT | Private | Private alpha | — |
| **Open private alpha** (M0) | NEXT | Public | Private alpha | Docs remediation (17 items) |
| **Open public alpha** (M1) | AFTER M0 | Public | Public alpha | Clerk, Sentry, rate limiting |

M0 (make repo public) requires documentation fixes only. M1 (public alpha)
additionally requires engineering/ops gates (Clerk, Sentry, rate limiting).

### Current State

All previous batches (A through E3) and Go/No-Go preparation (G1–G4) are
complete. MCP tool exploration (2026-02-28) identified 7 snag items, 2 of
which are top priority for the next session.

- **Batches A–E3**: All 35 architecture fixes (F1–F35), 4 remediation items (R1–R4), and 12 onboarding items (O1–O12) are complete. Quality gates green across all workspaces.
- **Go/No-Go G1–G3**: Complete with evidence (see §Mandatory Check Gates below).
- **G4 complete**: Onboarding rerun done (4 personas). Owner dispositions recorded for all 36 findings. No P0 blockers. See §Onboarding Snagging below.
- **MCP tool exploration (2026-02-28)**: 7 snag items triaged (M1-S001a through M1-S007). See §MCP Tool Exploration Findings below.

### Top Priorities for Next Session

**1. M1-S001a — Reindex to populate `thread_semantic` (P1)**

Code fix complete: `createThreadDocument` now populates `thread_semantic`
with `"<subjects>: <title>"`. Tests pass. But the live ES instance still
has 164 documents without the field.

Steps:

1. Run the search CLI thread ingest against the live ES deployment
2. Verify via EsCurric `platform_core_get_document_by_id` that
   `thread_semantic` is present on at least 3 sample documents
   (e.g. `algebra`, `geometry-and-measure`, `bq14-physics`)
3. Run a thread search that previously returned 0 results:
   `search(scope: 'threads', subject: 'maths')` — should now return
   maths threads via the ELSER leg
4. Run a text search: `search(scope: 'threads', text: 'algebra')` —
   should return the algebra thread with improved relevance via ELSER
5. Verify other scopes (lessons, units) are unaffected

**Validation of M1-S001b/S002/S003/S005 fixes (post-reindex):**

After reindex, re-test the scenarios from the original exploration:

- Subject-filter guidance: `search(scope: 'threads', subject: 'maths')`
  returns threads (tests M1-S001a + M1-S001b together)
- Year normalisation: `get-sequences-assets` with `year: 3` and
  `year: "3"` both work (M1-S002)
- Scope limitations: `search(scope: 'suggest', subject: 'maths')`
  works; `search(scope: 'suggest')` without filter gives validation
  error with helpful message (M1-S005)

**2. Remaining M0 gates**

- Final secrets and PII sweep (`pnpm secrets:scan:all`)
- Manual sensitive-information review (human)
- Merge `feat/semantic_search_deployment` to `main`
- Make repository public on GitHub

**3. Open P3 items (non-blocking)**

- M1-S004: Parameter naming inconsistency (`threadSlug` vs bare names)
- M1-S006: `get-rate-limit` returns 0/0/0 on preview server (upstream)
- ~~M1-S008: `callTool` overloads declare nested args but impl parses flat args~~ — **Complete (2026-02-28)**

### Remaining M0/M1 Gates

### Next Steps (historical — all complete)

**Previous documentation remediation (17 items) — COMPLETE**:

All 17 documentation remediation items from the first onboarding rerun
are complete (see commit `e1e83251`).

**Post-remediation onboarding validation — COMPLETE (2026-02-27)**:

Discovery-based onboarding rerun with 4 personas (junior dev, lead dev,
engineering manager, product owner). Each started at README.md with no
prescribed reading list. All 17 previous remediation items verified
effective. No P0 blockers. 21 new findings identified (N1-N21).

Full findings:
[onboarding-simulations-public-alpha-readiness.md](./developer-experience/onboarding-simulations-public-alpha-readiness.md)
§Post-Remediation Rerun Results.

**N1-N21 documentation fixes — COMPLETE (2026-02-27)**:

All 15 genuine fixes applied. N10 generator `as` casts resolved (both
casts in `emit-index.ts` eliminated). Two code patterns extracted to
`.agent/memory/code-patterns/`. Final onboarding validation confirmed
fixes effective. 10 new findings (V1-V10) discovered — see
§Post-Remediation Final Validation in
[onboarding-simulations-public-alpha-readiness.md](./developer-experience/onboarding-simulations-public-alpha-readiness.md).

**V1-V10 validation findings (from final onboarding validation)**:

2 P1 items (stale paths in extending.md and CONTRIBUTING.md) and 8 P2
items discovered during final validation. These are documented in the
onboarding simulations tracker. All 10 findings verified against the
filesystem (2026-02-27). 9 genuine fixes, 1 product decision (V9 —
milestones have no dates, intentional).

**Post-V-fix onboarding review — COMPLETE (2026-02-27)**:

4-persona non-prescriptive review (junior dev, lead dev, CTO, CEO).
V1-V10 fixes verified effective — no persona flagged any fixed issue.
No genuine P1 blockers. Repo name false positive recurred (4th time).
13 items identified for remediation (W1-W13) — see §Post-Review
Documentation Fixes below.

**Remaining M0 gates**:

1. ~~Fix N1-N21 documentation items~~ COMPLETE
2. ~~Final onboarding validation~~ COMPLETE
3. ~~Fix V1-V10 documentation items (9 genuine fixes)~~ COMPLETE
4. ~~Post-V-fix onboarding review~~ COMPLETE
5. ~~Fix W1-W13 documentation items~~ COMPLETE
6. Final secrets and PII sweep (`pnpm secrets:scan:all`)
7. Manual sensitive-information review (human)
8. Merge `feat/semantic_search_deployment` to `main`
9. Make repository public on GitHub

**Engineering/ops gates (M1 — blocks open public alpha)**:

| Gate | Decision needed | Owner | Status |
|------|----------------|-------|--------|
| **G5** | Accept public-alpha experience contract | Product owner | Pending |
| **G6** | Clerk production migration | Engineering/ops | Blocks M1 only |
| **G7** | Sentry observability verification | Engineering/ops | Blocks M1 only |
| **G8** | Release communications | Product owner | Pending |
| **Rate limiting** | Verify active on deployment target | Engineering/ops | Blocks M1 only |

Note: G6, G7, and rate limiting do NOT block M0 (open private alpha).
The upstream curriculum API has extensive rate limiting, providing baseline
protection.

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

- [x] **G1. Quality gates green**
  - `pnpm qg` passed: 60 tasks, 0 failures. `pnpm check` passed.
  - Evidence: commit `e397b72c` (Batch E3). All unit (950+), integration, E2E (208), UI (20) tests pass.

- [x] **G2. Generated artefacts stable**
  - `pnpm check` includes clean+build+sdk-codegen. No unexplained drift.
  - Evidence: `pnpm check` passed with zero diff after regeneration.

- [x] **G3. Secrets and security baseline**
  - `pnpm secrets:scan:all` passed: 374 commits scanned, no leaks found.
  - `.env.example` contains placeholders only (manual spot-check passed).
  - Evidence: gitleaks output at commit `e397b72c`.

- [x] **G4. Onboarding release gate**
  - **First rerun** (2026-02-26, 4 personas: junior dev, principal engineer,
    CTO, CEO). No P0 blockers. 17 docs-only items for M0. All 17 remediated.
  - **Post-remediation rerun** (2026-02-27, 4 personas: junior dev, lead dev,
    engineering manager, product owner). Discovery-based simulation — no
    prescribed reading list. All 17 previous items verified effective. No P0
    blockers. 4 new P1 docs-only items (N1-N4) block M0. Repo name mismatch
    confirmed as false positive for the third time.
  - Canonical tracker:
    [onboarding-simulations-public-alpha-readiness.md](./developer-experience/onboarding-simulations-public-alpha-readiness.md)
  - Evidence: owner dispositions recorded 2026-02-26 and 2026-02-27.

- [~] **G5. Public-alpha UX contract**
  - Public-alpha baseline confirmed and documented.
  - Contract:
    [public-alpha-experience-contract.md](./user-experience/public-alpha-experience-contract.md)
  - Evidence: acceptance checklist.

- [~] **G6. Auth migration readiness** — Blocks M1 (open public alpha) only
  - Clerk production migration decision and implementation complete for alpha scope.
  - Does NOT block M0 (open private alpha / making repo public).
  - Evidence: migration checklist and environment validation proof.

- [~] **G7. Observability minimum** — Blocks M1 (open public alpha) only
  - Basic Sentry error visibility verified for core alpha services.
  - Does NOT block M0 (open private alpha / making repo public).
  - Evidence: test event or incident-path verification.

- [~] **G8. Release communications prepared**
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
| **Status** | [x] Complete (2026-02-25, tightened 2026-02-26 by F7). Uses `paths` for bare `curriculum-sdk` and `patterns` with `/**` wildcard to block ALL subpaths. 6 unit tests added. F7 completed the tightening — search-sdk can no longer import from curriculum-sdk at any subpath. |

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
| **Status** | [x] Complete (2026-02-26). Moved all 25 synonym data files + `synonym-export.ts` to `@oaknational/sdk-codegen`. Created `@oaknational/sdk-codegen/synonyms` subpath export. Updated all consumers (search-sdk, search-cli, curriculum-sdk). Removed `@oaknational/curriculum-sdk` from search-sdk's `package.json` and `tsup.config.ts`. Tightened ESLint boundary rules to block ALL curriculum-sdk imports (including subpaths). Updated ADR-108, ADR-063, ADR-084, ADR-100, ADR-103. Fixed stale docs/READMEs. 4 integration tests added. 6 specialist reviewers (code, arch-barney, arch-fred, type, test, docs-adr) — all approved, all findings addressed. Committed in `066be0af`. |

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
| **Status** | [x] Complete (2026-02-26). Verified: `rrf-query-builders.ts` (line 10, `rank_constant: 60`) and `rrf-score-processing.ts` (`DEFAULT_MIN_SCORE: 0.02`) already contain coupling documentation via ADR-120 cross-references. No additional changes needed. Committed in `1c97d2d6`. |

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
| **Status** | [x] Complete (2026-02-26). Added isTimeoutError helper recognising AbortError, TimeoutError, HTTP 408. Unit tests added. |

#### F15: ES timeout → RetrievalError mapping

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **Problem** | `RetrievalError` has `timeout` variant, but retrieval code generally maps ES errors to `es_error` via `toRetrievalError`. Confirm whether timeouts are explicitly mapped to `timeout`; whether callers need that distinction for UX or retries. |
| **Files** | `packages/sdks/oak-search-sdk/src/retrieval/*.ts` |
| **Fix** | Verify ES timeout mapping. Add explicit timeout mapping if needed. Document caller behaviour. |
| **Status** | [x] Complete (2026-02-26). Added timeout detection to toRetrievalError mapping. Unit tests added. Committed in Batch E2. |

#### F16: OAuth proxy rate limiting

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **ADR** | ADR-115 |
| **Problem** | Proxy endpoints are unauthenticated and not rate-limited at app layer; mitigation expected at edge/WAF. |
| **Fix** | Confirm Vercel (or other WAF) rate limits are in place before production rollout. Document deployment precondition. |
| **Status** | [x] Complete (2026-02-26). Added "Deployment Preconditions" section to ADR-115 and `apps/oak-curriculum-mcp-streamable-http/README.md` documenting that rate limiting must be in place before production rollout. Committed in `1c97d2d6`. |

#### F17: Remove public/search.ts facade — direct sdk-codegen imports

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Fred |
| **Problem** | ADR-108 says "no thin runtime facade" but `curriculum-sdk/public/search.ts` is a 174-line re-export barrel that masks where types actually live. 32 search CLI files and 4 HTTP app files import from this facade instead of directly from `@oaknational/sdk-codegen/search`. This creates unnecessary coupling and hides the true dependency graph — it is not DX convenience, it is a labyrinth. |
| **Files** | `packages/sdks/oak-curriculum-sdk/src/public/search.ts` (facade), 32 files in `apps/oak-search-cli/`, 4 files in `apps/oak-curriculum-mcp-streamable-http/` |
| **Fix** | (1) Migrate all consumer imports from `@oaknational/curriculum-sdk/public/search.js` to direct `@oaknational/sdk-codegen/search` (or appropriate subpath: `/query-parser`, `/observability`, `/admin`, `/zod`). (2) Keep curriculum-sdk imports ONLY for `search-response-guards` symbols (`lessonSummarySchema`, `unitSummarySchema`, `isSequenceUnitsResponse`, etc.) — these are curriculum-sdk's own runtime code, not re-exports. (3) Update ADR-108 to remove the contradiction. (4) Consider removing or reducing `public/search.ts` itself once no external consumers remain. |
| **Status** | [x] Complete (2026-02-26). Migrated 25 consumer files to direct sdk-codegen imports. Stripped public/search.ts to search-response-guards only. Updated ADR-108, oak.ts barrel, INDEXING.md, codegen README. Code-reviewer + arch-barney + docs-adr approved. |

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
| **Status** | [x] Complete (2026-02-26). type-helpers assertion strategy audited by type-reviewer. Confirmed sound, minimal, governed. No changes needed. Committed in Batch E2. |

---

### Phase 1 Execution Report (2026-02-25)

**Completed**: F1, F2, F3, F21, F22, F23, F24 (7 of 7 items).

**Quality gates run**: `sdk-codegen`, `build`, `type-check`, `lint:fix`, `format:root`, `markdownlint:root`, `test`, `test:e2e`, `test:ui`, `smoke:dev:stub` — all passed.

**Specialist reviewers invoked**: `code-reviewer`, `architecture-reviewer-barney`, `architecture-reviewer-fred`, `architecture-reviewer-wilma`, `security-reviewer`. Findings partially addressed; remaining issues captured in §R below.

**Reference**: Execution details in [Phase 1 Cursor plan](/Users/jim/.cursor/plans/m1_release_fixes_phase_1_dbc6c9b8.plan.md) and [session transcript](../../.cursor/projects/Users-jim-code-oak-oak-open-curriculum-ecosystem/agent-transcripts/a7a67403-0cc4-4567-a320-2782d16aca7e.txt).

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

#### R4: Result pattern for deriveSelfOrigin and fetchUpstreamMetadata

| Field | Value |
|-------|-------|
| **Severity** | P2 — rules.md prefers Result over throw |
| **Rule** | `rules.md` §Code Design |
| **Problem** | Both `deriveSelfOrigin` (auth-routes.ts) and `fetchUpstreamMetadata` (oauth-and-caching-setup.ts) throw errors rather than returning `Result<T, E>`. The calling code uses try/catch. |
| **Fix** | Refactor to return `Result<T, E>`. Callers pattern-match on `ok` / `error`. |
| **Status** | [x] Complete (2026-02-26). Refactored to Result<T, E> with HostValidationError and MetadataFetchError. Callers pattern-match on ok/error. Committed in Batch E2. |

### Execution History

Completed batches (for reference — see §Current State in handoff for commit refs):

| Batch | Items | Commits |
|-------|-------|---------|
| A — Remediation + Trivial | R2, F4, F9, F26, F30, O4, O6, O7 | (pre-release session) |
| B — Small Architecture + Documentation | F6, F10, F20, F25, F28, F29, O1–O3, O5, O10 | `b85c44ec` + `9ad2d66a` |
| C — Medium Complexity | F5/F18, F8, F27, O12 | `081188a8` + `30cf9132` |
| D — ADR-108 Completion | F7 | `066be0af` |
| E1 — Trivial | F35, F11, F16 | `1c97d2d6` |

Remaining work (E2, E3, Go/No-Go) is defined in §Remaining Work in the handoff section above.

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
| **Status** | [x] Complete (2026-02-26). Regenerated API markdown, removed 9 stale TypeDoc entry points. Committed in Batch E2. |

#### F32: E2E config naming inconsistency

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Barney |
| **Problem** | `turbo.json` tracks `vitest.config.e2e.ts`; MCP apps use `vitest.e2e.config.ts`; SDKs use the former. Increases cognitive load. |
| **Files** | `turbo.json`, `apps/oak-curriculum-mcp-streamable-http/package.json`, `packages/sdks/oak-curriculum-sdk/package.json` |
| **Fix** | Standardise E2E config naming repo-wide; align turbo inputs. |
| **Status** | [x] Complete (2026-02-26). Renamed SDK vitest.config.e2e.ts to vitest.e2e.config.ts (prefix convention). Updated turbo.json, package.json scripts, eslint.config.ts, tsconfig.json. All apps and SDKs now use consistent naming. |

#### F33: SDK codegen ESLint — broad rule disables for hand-written code

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Fred |
| **Problem** | `code-generation/` and `vocab-gen/` have directory-wide disables (no-restricted-types, complexity, etc.). Hand-written code, not generated. |
| **Files** | `packages/sdks/oak-sdk-codegen/eslint.config.ts` |
| **Fix** | Progressively re-enable rules; use line-level disables where exceptions needed. |
| **Status** | [x] Complete (2026-02-26). Tightened vocab-gen/ overrides from blanket 6-rule disable to targeted 3-rule disable on 6 specific generator files. Documented code-generation/ override rationale. |

#### F34: Elasticsearch — no startup connectivity check

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **Problem** | ES client created at startup but connectivity not checked. First search tool call fails if ES unreachable. |
| **Files** | `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts`, `apps/oak-curriculum-mcp-streamable-http/src/search-retrieval-factory.ts` |
| **Fix** | Document as known trade-off. Consider future warm-up ping at startup for production. |
| **Status** | [x] Complete (2026-02-26). Documented lazy-connection trade-off in TSDoc. Fixed misleading log messages. Committed in Batch E2. |

#### F35: Dead code — createInMemoryStorage and createNodeClock

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Reviewers** | Wilma |
| **Problem** | `createInMemoryStorage` and `createNodeClock` in STDIO `wiring.ts` are dead code. They are created and assigned to `runtime.clock` and `runtime.storage` on `WiredDependencies`, but nothing in the STDIO app (or any other app) ever reads them. Vestigial from the deleted `@oaknational/mcp-providers-node` package. |
| **Files** | `apps/oak-curriculum-mcp-stdio/src/app/wiring.ts` |
| **Fix** | Delete both functions, remove `runtime` from `WiredDependencies`, remove creation/assignment in `wireDependencies`. |
| **Status** | [x] Complete (2026-02-26). Deleted `createInMemoryStorage`, `createNodeClock`, `createCoreLogger`, and the `runtime` property from `WiredDependencies` interface and its instantiation (~40 lines). Committed in `1c97d2d6`. |

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

All onboarding items (O1–O12) complete. O11 cancelled (target file removed). O8 completed by user. See §Execution History for batch assignments.

---

## Onboarding Snagging (G4 Findings)

**Source**: Onboarding simulations rerun (2026-02-26). Owner dispositions
recorded same day.

Full detail:
[onboarding-simulations-public-alpha-readiness.md](./developer-experience/onboarding-simulations-public-alpha-readiness.md)

### Summary

- **36 findings** from 4-persona rerun (junior dev, principal engineer,
  CTO, CEO).
- **6 resolved/dismissed**: R1 (false positive — repo name correct), R2
  (false positive — files exist), R11 (intentional for alpha), R20 (no
  CAB needed), R28 (not an insight), R32 (correct CI behaviour).
- **17 docs-only items** block M0 (open private alpha). Estimated effort:
  1 focused session.
- **3 engineering/ops items** block M1 only (open public alpha): Clerk
  (R9/G6), Sentry (R10/G7), rate limiting (R13).
- **2 items** block M3 (public beta): Stryker (R27), log drain (R29).
- **5 non-blocking items**: CI expansion (R14), last-reviewed dates (R24),
  health check checklist (R30), flaky test (R31), root config tidy (R34).

### Rate Limiting Assessment

Add a rate-limiting verification task before M1 (open public alpha):

- [ ] **Verify rate limiting active on deployment target**
  - ADR-115 and HTTP server README document this as a deployment
    precondition.
  - Upstream curriculum API has extensive rate limiting (baseline protection).
  - Must be confirmed active on the deployment target before M1 release.

---

## Post-Remediation Documentation Fixes (N1-N21)

**Source**: Post-remediation onboarding rerun (2026-02-27, 4 personas).
**Canonical tracker**:
[onboarding-simulations-public-alpha-readiness.md](./developer-experience/onboarding-simulations-public-alpha-readiness.md)
§Post-Remediation Rerun Results.

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

### Finding Evaluation

Each finding was verified against the filesystem. 15 are genuine fixes;
6 are non-issues.

#### Genuine Fixes (15 items)

**P1 — M0 blockers (4 items, owner disposition: all block M0):**

- [x] **N1. SDK README fabricated examples.** `OakCurriculumClient` class
  does not exist. Actual API: `createOakClient(config)` returning an
  `openapi-fetch` client. Files: `packages/sdks/oak-curriculum-sdk/README.md`,
  `packages/sdks/oak-curriculum-sdk/docs/logging-guide.md`.
  Complete (2026-02-27). Replaced all fabricated examples with real
  `createOakClient` / `.GET()` pattern in both files.
- [x] **N2. README jargon wall.** Line 14 is impenetrable for non-technical
  readers. Need audience routing near the top.
  Complete (2026-02-27). Added audience routing list and subtitle.
- [x] **N3. Curriculum Guide not linked from README.**
  `docs/domain/curriculum-guide.md` has zero inbound links from README.md.
  Complete (2026-02-27). Linked in audience routing section.
- [x] **N4. MCP not explained in plain English.** README links to the spec
  site. No plain-language definition anywhere on the non-technical path.
  Complete (2026-02-27). Added parenthetical definition.

**P2 — Should fix (7 items):**

- [x] **N5.** `.env.example` line 8 references
  `docs/development/environment-variables.md`. File is at
  `docs/operations/environment-variables.md`. One-line fix.
  Complete (2026-02-27).
- [x] **N6.** README line 67 mentions `SEARCH_API_KEY` alongside root
  `.env` vars. `SEARCH_API_KEY` is app-level only. Remove or clarify.
  Complete (2026-02-27). Removed from root env instruction.
- [x] **N7.** gitleaks: README links to GitHub releases. `brew install
  gitleaks` only in CONTRIBUTING.md. Add one-liner to README Prerequisites.
  Complete (2026-02-27). Added brew install to Prerequisites.
- [x] **N9.** ADR-030 line 255 stale link:
  `../../ecosystem/psycha/oak-curriculum-mcp/README.md` does not exist.
  Complete (2026-02-27). Updated to HTTP MCP server README.
- [x] **N10.** Generated code contains `as StatusDiscriminant<T>` casts
  (verified in 17+ tool files). **Resolved** (2026-02-27). Cast 1:
  `toStatusDiscriminant` replaced with per-tool `STATUS_DISCRIMINANTS`
  const map in `emit-index.ts`. Cast 2: `invoke` return type changed
  from `TResult` to `unknown`; payload returned without cast. Both fixes
  in generator templates, propagated via `pnpm sdk-codegen`. Zero
  non-const `as` assertions remain in generated tool files. Two code
  patterns extracted to `.agent/memory/code-patterns/`.
- [x] **N11.** `docs/README.md` has no non-technical audience entry. Add a
  "New to this project?" section.
  Complete (2026-02-27). Added non-technical entry to Getting Started.
- [x] **N14.** Node version-switch: README says "install via nvm or fnm"
  but no `nvm use`/`fnm use` command. Add one-liner.
  Complete (2026-02-27). Added nvm use / fnm use instruction.

**P3 — Polish (4 items):**

- [x] **N8.** No demo/screenshot. Add a brief note in README about what
  the project looks like in practice. Full demo is out of scope for M0.
  Complete (2026-02-27). Enhanced description with practical examples.
- [x] **N16.** Title assumes MCP knowledge. Addressed by N2+N4 fixes.
  Add a one-line subtitle/tagline under the H1.
  Complete (2026-02-27). Added plain-English subtitle.
- [x] **N17.** VISION.md introduces "Aila" at line 139 with no explanation.
  Add "(Oak's AI lesson planning assistant)" on first use.
  Complete (2026-02-27).
- [x] **N19.** VISION.md Curriculum Guide link easy to miss. Make it a
  callout or bold reference. Secondary to N3.
  Complete (2026-02-27). Converted to blockquote callout with bold.

#### Non-Issues (6 items — skip)

- **N12.** Bus factor disclosure without mitigation plan. ADR-119
  acknowledges single-engineer production. The acknowledgement IS the
  disclosure. Organisational decision, not a documentation defect.
- **N13.** "Zero-Setup Quick Start (0 minutes)" misleading. In
  `quick-start.md` this means zero API keys, which is accurate.
  Node/pnpm prereqs listed separately in README.
- **N15.** Clone/setup steps repeated in README, quick-start, CONTRIBUTING.
  Intentional: each serves a different audience. Repo name consistent.
- **N18.** Milestones in `.agent/` feels internal. The `.agent/` directory
  is explained in README and has its own README. Moving them would create
  more confusion.
- **N20.** Known test failure (`widget-rendering.spec.ts`). Already
  documented in troubleshooting.md. Tracked engineering item.
- **N21.** GitHub Issues/Discussions links may 404. They point at
  `oak-open-curriculum-ecosystem` (correct post-rename name). Links will work
  once the repo is public.

### Fix Groups and Execution Order

#### Group C: Quick Fixes (do first, ~5 minutes)

Items: N5, N9, N10, N11, N17, N19.

1. **N5** — `.env.example` line 8: change
   `docs/development/environment-variables.md` to
   `docs/operations/environment-variables.md`
2. **N9** — `docs/architecture/architectural-decisions/030-sdk-single-source-truth.md`
   line 255: fix stale link
3. **N10** — ~~Add a note to `rules.md`~~ **Resolved**: generator `as`
   casts eliminated in `emit-index.ts` (const map + unknown return).
   Patterns extracted to `.agent/memory/code-patterns/`.
4. **N11** — `docs/README.md`: add a "New to this project?" entry at the
   top of Getting Started, linking to VISION.md and Curriculum Guide
5. **N17** — `docs/foundation/VISION.md` line 139: add "(Oak's AI lesson
   planning assistant)" after "Aila"
6. **N19** — `docs/foundation/VISION.md`: make the Curriculum Guide link
   (line 56) a callout or bold reference

#### Group B: README Audience Routing (~15-20 minutes)

Items: N2, N3, N4, N6, N7, N8, N14, N16. All changes to `README.md`.

1. **N16** — Add a subtitle/tagline under H1 explaining what this is in
   plain English
2. **N2** — Add audience routing section near the top (after status banner,
   before "What's In This Repo"):
   - "For product owners, school leaders, and non-technical evaluators"
     pointing to VISION.md and Curriculum Guide
   - "For developers" pointing to Quick Start
3. **N3** — Link to `docs/domain/curriculum-guide.md` prominently in the
   audience routing section
4. **N4** — Add a plain-English MCP definition in parentheses where MCP is
   first used: "(a standard that lets AI tools like ChatGPT and Claude
   connect to data sources)"
5. **N6** — Fix line 67: remove `SEARCH_API_KEY` from the root env
   instruction (it is app-specific)
6. **N7** — Add `brew install gitleaks` (macOS) / `go install ...` to
   Prerequisites
7. **N8** — Add a brief sentence about what the project looks like in
   practice, referencing VISION.md
8. **N14** — Add `nvm use` or `fnm use` one-liner after the nvm/fnm
   mention in Prerequisites

#### Group A: SDK README Rewrite (~20-30 minutes)

Item: N1. The most substantial fix.

Replace fabricated `OakCurriculumClient` examples with real
`createOakClient` usage.

**Files:**
- `packages/sdks/oak-curriculum-sdk/README.md` — rewrite Usage and Logging
  sections
- `packages/sdks/oak-curriculum-sdk/docs/logging-guide.md` — update any
  `OakCurriculumClient` references

**Source of truth for real API:**
`packages/sdks/oak-curriculum-sdk/src/client/index.ts` exports
`createOakClient(config)` returning an `openapi-fetch` client. Methods are
`.GET('/path')`, `.POST('/path')`, not `.searchLessons()`.

Also update Features list to match actual capabilities.

#### After All Fixes

1. Run quality gates: `pnpm build && pnpm type-check && pnpm lint:fix &&
   pnpm format:root && pnpm markdownlint:root && pnpm test`
2. Update status checkboxes in this section and in
   [onboarding-simulations-public-alpha-readiness.md](./developer-experience/onboarding-simulations-public-alpha-readiness.md)
3. Proceed to §Final Onboarding Validation

---

## Post-V-Fix Onboarding Review

After all V1-V10 fixes are applied and quality gates pass, run a full
non-prescriptive onboarding review to confirm M0 readiness.

### Method

- Non-prescriptive: each reviewer starts at `README.md`, nothing else
- No access to `.agent/prompts/onboarding-rerun.prompt.md` or
  `.agent/plans/developer-experience/onboarding-simulations-public-alpha-readiness.md`
- Reviewers navigate independently, following whatever links they find
- This is the final gate before M0 — it must validate that V1-V10 fixes
  are effective and that no new P1 issues have been introduced

### Personas (4)

1. **Junior developer** — Motivated by: not looking foolish in first week.
   Anxious about complex toolchains. Wants clear, sequential instructions.
   Will follow every link that promises to help them get set up.
2. **Lead developer** — Motivated by: deciding whether to adopt this for
   the team. Evaluates developer experience, onboarding friction, and
   documentation quality. Wants to know: can my team be productive in a
   week? Will probe setup instructions, contribution guides, and
   architecture docs.
3. **CTO** — Motivated by: technical due diligence for organisational
   adoption. Evaluates architecture, security posture, dependency risk,
   and long-term maintainability. Reads ADRs, governance docs, and
   deployment architecture. Asks: is this production-ready? What are the
   risks?
4. **CEO** — Motivated by: understanding strategic value and readiness for
   public announcement. Does not read code. Evaluates by: is the value
   proposition clear in 30 seconds? Is the project presented
   professionally? Would I be confident sharing this with partners? Will
   bounce immediately if the first impression is technical jargon.

### Output

Each reviewer produces: what they did (navigation path), what worked,
what didn't, and severity-rated findings. Consolidate into a final
assessment for M0 readiness.

### Success Criteria

No new P1 findings. Any new P2/P3 findings are logged but do not block
M0.

### After Review

1. Consolidate findings into
   [onboarding-simulations-public-alpha-readiness.md](./developer-experience/onboarding-simulations-public-alpha-readiness.md)
2. Update M0 milestone status
3. Run `/jc-consolidate-docs`
4. If clean: proceed to remaining M0 gates (secrets sweep, manual review,
   merge, make public)

---

## Post-Review Documentation Fixes (W1-W13)

**Source**: Post-V-fix onboarding review (2026-02-27, 4 personas).
**Owner dispositions**: Recorded 2026-02-27. All items fix before M0.

Status key: `[ ]` not started, `[~]` in progress, `[x]` complete.

### P2 Items (fix now)

- [x] **W1. API key instructions lack public form link.**
  Source: Junior dev (P1-1, reclassified P2). Anyone can request a key
  at <https://open-api.thenational.academy/docs/about-oaks-api/api-keys>.
  Add this URL to `docs/operations/environment-variables.md` and
  `.env.example`.

- [x] **W2. README audience routing too subtle.**
  Source: CEO (P1-1/P1-3, reclassified P2). The non-technical routing
  is a blockquote — visually subordinate. Make it a heading or prominent
  section so CEOs and senior stakeholders can skip the technical content.
  Content exists; visual hierarchy needs adjustment.

- [x] **W3. Version string inconsistency.**
  Source: CTO (P3-1). `docs/engineering/release-and-publishing.md` says
  `0.1.0` in three places; `package.json` says `0.8.0`. The correct
  version is `0.8.0` (set to avoid clashes with earlier failed tag
  creation). Fix the three occurrences in the release doc.

- [x] **W4. CONTRIBUTING.md opening discouraging for internal readers.**
  Source: Lead dev (P2-3), CEO (P2-3). Opens with "not accepting external
  contributions" before any useful content. Restructure so the internal
  contributor guide is the primary framing, with the external note as
  context rather than a gatekeeper.

- [x] **W5. `.agent/` directory needs README and HUMANS.md.**
  Source: Junior dev (P2-7), CTO (P2-5). The `.agent/` directory is not
  for human developers — it is AI agent infrastructure. It needs a clear
  README explaining this and a `HUMANS.md` that tells human readers what
  they can safely ignore and where to go instead.

- [x] **W6. Quick-start doc-gen path wrong.**
  Source: Junior dev (P3-2), Lead dev (P2-4). `docs/foundation/quick-start.md`
  line 316 references `docs/index.html` — actual path is `docs/api/index.html`.

- [x] **W7. gitleaks not in setup verification.**
  Source: Lead dev (P3-3). The "Verify Your Setup" section doesn't check
  for gitleaks. Developers discover at push time after writing code.
  Add `gitleaks version` or a note to Prerequisites verification.

- [x] **W8. SEARCH_API_KEY generation unclear.**
  Source: Junior dev (P3-6). `docs/operations/environment-variables.md`
  says "Generate secure random string" without saying how. Add a command
  example: `openssl rand -hex 32`.

- [x] **W9. `pnpm clean` not in README/Quick Start.**
  Source: Lead dev (P3-5). Recovery step referenced in troubleshooting
  and build-system docs but missing from README Key Commands and
  Quick Start.

- [x] **W10. Contributor Covenant v1.4 outdated.**
  Source: CTO (P3-5). `CODE_OF_CONDUCT.md` uses v1.4; current is v2.1.
  Update to current version.

- [x] **W11. CORS `allow_all` lacks danger naming.**
  Source: CTO (P3-2). `.env.example` uses `CORS_MODE=allow_all` but the
  auth equivalent uses `DANGEROUSLY_DISABLE_AUTH`. Rename for consistency
  (e.g. `DANGEROUSLY_ALLOW_ALL_ORIGINS`). Check all consumers.

- [x] **W12. VISION.md uses "MRR" before defining it.**
  Source: CEO (P3-3). The capability status table uses "MRR 0.983" —
  the definition follows but the acronym hits first. Expand on first use.

- [x] **W13. Milestone M0 status reads like internal standup.**
  Source: CEO (P2-4). Text like "All 15 documentation N-items resolved
  (including N10 generator `as` casts)" is internal detail. Rewrite for
  an external audience.

### Disposed Findings (not fixing)

- **Repo name mismatch** (Junior P1-2): False positive, 4th recurrence.
  Rename executed on GitHub. Local remote stale.
- **README is a developer document** (CEO P1-1): It IS a technical
  repo README. Addressed by W2 (make audience routing prominent).
- **Known quality gate failure** (CTO P2-4): Deliberate and documented.
- **CI E2E gap** (CTO P2-2): Known, documented in ADR-121.
- **Bus factor** (CTO P2-1): A self-sufficient, self-documenting repo
  with 117 ADRs is the mitigation. Not an issue.
- **docs/README.md YAML frontmatter** (CEO P2-2): Short, fine as is.
- **AI-workflow dependency** (CTO P2-5): Quality gates are the fallback.

---

## MCP Tool Exploration Findings (2026-02-28)

**Source**: Systematic testing of all 32 oak-remote-preview MCP tools
using KS4 maths as the domain. Prior conversation: [KS4 maths
exploration](../../.cursor/projects/Users-jim-code-oak-oak-mcp-ecosystem/agent-transcripts/8b4b3ea0-9ca6-4b11-bbc0-4ad50bafdb00.txt).

### Snag Register

| ID | Severity | Description | Owner | Status | Decision |
|---|---|---|---|---|---|
| M1-S001a | P1 | `thread_semantic` never populated — ELSER leg dead | Engineering | Code complete (2026-02-28) | Fix implemented + tested. **Reindex not yet run.** |
| M1-S001b | P2 | Search/explore tool descriptions lack subject-filter guidance | Engineering | [x] Complete (2026-02-28) | Tool descriptions enhanced with subject-filter guidance |
| M1-S002 | P2 | `year` parameter type inconsistency across sequence endpoints | Engineering (upstream) | [x] Complete (2026-02-28) | Normalised at generator level; accepts string enum + number input |
| M1-S003 | P3 | `get-lessons-assets-by-type` description unclear on binary response | Engineering | [x] Complete (2026-02-28) | Binary-response warning added via generator enhancement |
| M1-S004 | P3 | Parameter naming inconsistency (`threadSlug` vs bare names) | Engineering | Open | Normalise at SDK accessor level |
| M1-S005 | P3 | `search` scope limitations undocumented | Engineering | [x] Complete (2026-02-28) | Scope limitations documented in search tool description |
| M1-S006 | P3 | `get-rate-limit` returns 0/0/0 on preview server | Upstream API team | Open | Track — ask upstream |
| M1-S007 | P3 | Prerequisite sub-graph fetching | Engineering | Deferred | Post-merge |
| M1-S008 | P3 | `callTool` overloads declare nested args but impl parses flat args | Engineering | [x] Complete (2026-02-28) | `ToolArgsForName` now derives from flat schema via `transformFlatToNestedArgs` parameter type |

---

#### M1-S001a: Populate `thread_semantic` at indexing time (TOP PRIORITY)

| Field | Value |
|-------|-------|
| **Severity** | P1 — thread search ELSER leg is completely dead |
| **Priority** | **TOP PRIORITY for next session** |
| **Problem** | `createThreadDocument` in `apps/oak-search-cli/src/lib/indexing/thread-document-builder.ts` builds thread documents with `thread_slug`, `thread_title`, `subject_slugs`, `unit_count`, `thread_url`, and `title_suggest` — but never sets `thread_semantic`. The mapping defines this field as `semantic_text` (ELSER inference) but every document in the index is missing it. Confirmed via EsCurric `platform_core_get_document_by_id` on three threads (algebra, geometry-and-measure, bq14-physics) — none have `thread_semantic`. The ELSER leg of the 2-way RRF retriever is completely dead across all 164 documents. |
| **ES investigation** | `oak_threads` index: 164 documents. 10 maths threads confirmed via ES|QL. Document-by-ID retrieval confirmed `thread_semantic` field absent on all sampled documents. The mapping has `thread_semantic: semantic_text` — no mapping change needed. |
| **Fix** | Populate `thread_semantic` at indexing time in `createThreadDocument` with subject-enriched content. For example: `"Maths: Algebra — a curriculum progression thread"` or `"${subjects.join(', ')}: ${threadTitle}"`. This gives ELSER the subject-to-thread association it needs. Reindex required after the fix. The query side (`buildThreadRetriever` in `retrieval-search-helpers.ts`) is already correct — it searches `thread_semantic` via ELSER. It just needs data. |
| **Files** | `apps/oak-search-cli/src/lib/indexing/thread-document-builder.ts` (createThreadDocument — populate `thread_semantic`), `apps/oak-search-cli/src/adapters/bulk-thread-transformer.ts` (bulk path adapter) |
| **Status** | Code complete (2026-02-28). `thread_semantic` populated with subject-enriched content in `createThreadDocument`. Unit tests in `thread-document-builder.unit.test.ts` and `bulk-thread-transformer.unit.test.ts`. `DATA-COMPLETENESS.md` updated. **Reindex against live ES instance not yet run** — 164 documents still missing the field. |

---

#### M1-S001b: Enhance search/explore tool descriptions for subject filtering

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Priority** | Complete |
| **Problem** | `search(scope: 'threads', text: 'maths')` and `explore-topic(text: 'maths')` return 0 thread results because BM25 only searches `thread_title` — titles like "Algebra" and "Geometry and Measure" don't contain "maths". The `subject_slugs` field holds "maths" but is only used as an optional filter parameter, not searched. When a consuming agent calls these tools with a subject name as the text, it gets nothing back. |
| **Root cause** | This is a tool-guidance problem, not a code-inference problem. The search and explore tool descriptions don't tell consuming agents that subject-based queries should use the `subject` filter parameter rather than (or in addition to) the search text. A teacher saying "what maths threads are there?" should translate to `search(scope: 'threads', subject: 'maths')`, not `search(scope: 'threads', text: 'maths')`. The consuming agent needs to know this. |
| **Fix** | Enhance the "how to use" metadata in the search and explore tool descriptions to guide consuming agents: (1) In the search tool definition (`tool-definition.ts`), add guidance that thread and sequence scopes work best with the `subject` filter — subject names should go in the `subject` parameter, not the `text` parameter. (2) In the explore-topic tool definition, add similar guidance: when the user mentions a subject, pass it as the `subject` parameter. (3) Add examples: `"What maths threads are there?" → { text: '', subject: 'maths', scope: 'threads' }` or `{ text: 'algebra', subject: 'maths', scope: 'threads' }`. These are text-only changes to tool descriptions — no code change needed. |
| **Files** | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts` (search tool description), `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts` (explore tool description) |
| **Status** | [x] Complete (2026-02-28). Subject-filter guidance added to search and explore tool descriptions. NL mapping examples added. Scope limitations (`suggest`, `sequences`) documented. |

---

#### M1-S002: `year` parameter type inconsistency across sequence endpoints

| Field | Value |
|-------|-------|
| **Severity** | P2 |
| **Problem** | The `year` parameter type is inconsistent across the sequence endpoint family. `get-sequences-units` defines `year` as a string enum (`'1' \| '2' \| ... \| '11' \| 'all-years'`). `get-sequences-assets` and `get-sequences-questions` define `year` as `number` — yet their descriptions state *"a value of all-years can also be used"*, which is impossible with a number type. This is an upstream API schema bug: the OpenAPI spec says `number` but the runtime API can accept `"all-years"`. |
| **Response side** | The response-map confirms this ambiguity: `"year":{"anyOf":[{"type":"number"},{"type":"string","description":"All years"}]}`. The API can *return* year as either number or string "all-years". |
| **Enum analysis** | Checked all generated tool enums for values that cannot be represented numerically: Key stages (`ks1`–`ks4`), subjects (17 string slugs), asset types (9 string values), search scopes (5 string values), year special value (`all-years`). **EYFS, early-years, and SEND do not appear in the current OpenAPI schema** — key stages are currently limited to ks1–ks4. If these are added in future, the string-based approach handles them naturally; numeric normalisation would break. |
| **Decision** | **Normalise on string, strictly constrained to the enum values from the OpenAPI spec.** The canonical enum (from `get-sequences-units`) is: `'1' \| '2' \| '3' \| '4' \| '5' \| '6' \| '7' \| '8' \| '9' \| '10' \| '11' \| 'all-years'`. All three sequence tools (`get-sequences-units`, `get-sequences-assets`, `get-sequences-questions`) should use this same string enum. |
| **Where to normalise** | At SDK accessor creation time, in the code generators. The `transformFlatToNestedArgs` function in each generated tool file (emitted by `mcp-tool-generator.ts`) already transforms flat MCP arguments to nested SDK format. For `year`: the MCP flat input schema should use `z.union([z.enum([...yearValues]), z.number().transform(String)])` so that both `year: 3` and `year: "3"` are accepted from MCP clients, coerced to the strict string enum, and validated. The canonical year enum should be a shared constant in the generator so all sequence tools reference the same source. |
| **Files** | `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts`, `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/build-zod-type.ts`, generated tools: `get-sequences-assets.ts`, `get-sequences-questions.ts`, `get-sequences-units.ts` |
| **Status** | [x] Complete (2026-02-28). Generator-level fix in `build-zod-type.ts` and `emit-input-schema.ts`. Flat Zod uses `z.union([z.enum([...]), z.number().int().min(1).max(11).transform(String)])`. JSON schema uses `anyOf` for string enum + number. `transformFlatToNestedArgs` converts string back to number for SDK. Runtime `zod-input-schema.ts` updated to handle `anyOf`. All four schema layers synchronised. See code pattern: `.agent/memory/code-patterns/multi-layer-schema-sync.md`. Known remaining issue: `callTool` overloads still declare nested args type (see M1-S008). |

---

#### M1-S003: `get-lessons-assets-by-type` description unclear on binary response

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Problem** | The MCP tool handler crashes with `"Unexpected token '%', '%PDF-1.4'"` when invoking `get-lessons-assets-by-type` because the upstream API returns the actual binary file (PDF, video, etc.), not JSON metadata. The tool description says *"This tool will stream the downloadable asset"* and *"returns a content attachment"* — but AI agents still attempt to invoke it and expect structured data back. |
| **Owner disposition** | This is working as intended — the endpoint IS a download endpoint. The fix is to enhance the description so agents understand this returns binary content that the MCP protocol cannot transport as structured tool output. Agents should use `get-lessons-assets` (the metadata endpoint) to get download URLs, then present those URLs to the user rather than attempting to download binary content through the MCP channel. |
| **Fix** | Update the tool description (in the OpenAPI schema or as a description override in the MCP tool registration) to explicitly state: (1) this returns binary file content (PDF/video/etc.), not JSON; (2) the MCP handler cannot transport binary responses; (3) agents should use `get-lessons-assets` for metadata/URLs instead. |
| **Files** | Upstream OpenAPI schema (description field), or `packages/sdks/oak-curriculum-sdk/src/mcp/` tool registration if we override descriptions locally |
| **Status** | [x] Complete (2026-02-28). Binary-response warning added via `appendToolEnhancements()` in `tool-description.ts`. Warning appended at `sdk-codegen` generation time for `get-lessons-assets-by-type`. Unit tests in `tool-description.unit.test.ts`. |

---

#### M1-S004: Parameter naming inconsistency (`threadSlug` vs bare names)

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Problem** | `get-threads-units` uses `threadSlug` as its parameter name, while other tools use bare names (`lesson`, `unit`, `subject`, `keyStage`, `sequence`). This inconsistency trips AI agents — the previous session's agent tried `thread` twice before reading the tool descriptor to discover `threadSlug`. The convention across the API is bare entity names for path parameters; `threadSlug` is the only parameter that appends `Slug`. |
| **Where to normalise** | At SDK accessor creation time. The code generators can emit parameter aliases or a normalisation step in `transformFlatToNestedArgs`. Alternatively, accept both `thread` and `threadSlug` in the flat input schema (with the canonical name mapped to whatever the API requires). |
| **Files** | `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts`, `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-threads-units.ts` |
| **Status** | Open |

---

#### M1-S005: `search` scope limitations undocumented

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Problem** | Two search scope behaviours are not obvious to AI agents: (1) `scope: "suggest"` requires at least one filter (`subject` or `keyStage`) — fails with a validation error without one. (2) `scope: "sequences"` returns 0 results for topic-style queries because sequences have specific structural names (e.g. "maths-secondary") not topic names. These limitations should be documented in the search tool description so agents can select the right scope. |
| **Fix** | Enhance the search tool definition in `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts` to document: (a) suggest scope requires subject or keyStage filter; (b) sequences scope works with structural names, not topic queries. |
| **Files** | `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts` |
| **Status** | [x] Complete (2026-02-28). Scope limitations documented in search tool description: `suggest` requires filter, `sequences` uses structural names. |

---

#### M1-S006: `get-rate-limit` returns 0/0/0 on preview server

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Problem** | `get-rate-limit` returns `remaining: 0, limit: 0, reset: 0` on the preview server. Either rate limiting is not configured on the preview instance, or the rate-limit headers are not being returned by the upstream API at this endpoint. This is an upstream API team concern — the MCP tool correctly reads whatever headers the API returns. |
| **Owner** | Upstream API team. Jim to raise with them. |
| **Tracking** | This item MUST remain tracked in this repo to prevent it being forgotten. The rate-limiting verification task in §Onboarding Snagging (G4) already tracks the deployment-target verification. This snag tracks the additional concern that the preview server's rate-limit endpoint returns zero values, which may indicate a configuration gap upstream. |
| **Status** | Open — awaiting upstream response |

---

#### M1-S007: Prerequisite sub-graph fetching

| Field | Value |
|-------|-------|
| **Severity** | P3 |
| **Problem** | The prerequisite graph is 1.45MB (1,607 units, 3,452 edges). Currently the only option is fetching the entire graph. The ability to fetch sub-graphs (e.g. "give me prerequisites for this specific unit") would be valuable for AI agent workflows that need targeted prerequisite information. |
| **Decision** | **Post-merge.** This is a feature enhancement, not a bug or inconsistency. It should be tracked in the post-M1 backlog, not as a release blocker. |
| **Status** | Deferred to post-merge backlog |

---

#### M1-S008: `callTool` overloads declare nested args but impl parses flat args

| Field | Value |
|-------|-------|
| **Severity** | P3 — type-safety debt, no runtime impact currently |
| **Problem** | The generated `callTool` overloads in `execute.ts` declare `rawArgs: ToolArgsForName<TName>`, which resolves to the **nested** SDK type (e.g. `{ params: { path: { sequence: string }, query?: { year?: number } } }`). But the implementation (`invokeToolByName`) parses `rawArgs` through `toolMcpFlatInputSchema.safeParse()`, which expects **flat** MCP args (e.g. `{ sequence: string, year?: string \| number }`). The overloads promise one type; the implementation expects another. This is masked by: (1) the final overload uses `rawArgs: unknown`; (2) the sole real caller (`callToolWithValidation`) always passes `unknown`; (3) nobody uses the strongly-typed overloads programmatically. Year normalisation (M1-S002) made this visible — the nested type says `year?: number` while the flat schema accepts `string \| number`. |
| **Files** | `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/runtime/execute.ts`, `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/aliases/types.ts` (defines `ToolArgsForName`) |
| **Fix** | Either (a) change `ToolArgsForName` to derive from the flat input schema type, or (b) change the overloads to use `rawArgs: unknown` since the function's contract is "validate whatever you give me." Option (b) is simpler but loses type-safe overloads; option (a) preserves them correctly. Both require generator changes in `emit-index.ts` or `generate-types-file.ts`. |
| **Status** | [x] Complete (2026-02-28). Fixed via Option A: `ToolArgsMap` in `generate-types-file.ts` now derives from `Parameters<ToolDescriptorMap[TName]['transformFlatToNestedArgs']>[0]` (flat) instead of `ToolInvokeParametersMap[TName][1]` (nested). Generator unit test + `satisfies` compile-time anchor prevent regression. All quality gates pass. |

---

### Additional Observations (Not Snagged)

These findings from the exploration are informational and do not require
action before release:

- **`browse-curriculum` tier duplication**: Returns 66 entries for KS4
  maths (preserving foundation/higher duplicates) vs 36 unique units from
  `get-key-stages-subject-units`. This is the expected behaviour of a
  faceted browse endpoint — it shows all variants. No fix needed.
- **Large response file writes**: Ontology, thread progressions,
  prerequisite graph, and bulk endpoints write to `agent-tools` files
  instead of returning inline. This is correct behaviour for large
  payloads. The file-write pattern is well-documented in tool guidance.
- **Tool hierarchy**: The tools follow a coherent ontology-driven
  hierarchy: discovery (search, explore, browse) → structure (subjects,
  sequences, units) → content (lessons, quizzes, transcripts, assets) →
  progression (threads, prerequisites). This is working as designed.

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

- **2026-02-28**: **M1-S008 complete.** `callTool` overload type alignment: `ToolArgsForName` now derives from `transformFlatToNestedArgs` parameter type (flat) instead of `invoke` parameter (nested). One-line generator change in `generate-types-file.ts`, verified by unit test + `satisfies` compile-time anchor. All quality gates pass.
- **2026-02-28**: **M1 MCP quality fixes implemented.** M1-S001a (thread_semantic population), M1-S001b (subject-filter guidance), M1-S002 (year normalisation), M1-S003 (binary-response warning), M1-S005 (scope limitations) all code-complete with TDD. Full quality gate suite passed. M1-S008 (callTool type mismatch) identified by type-reviewer and registered. M1-S001a reindex against live ES not yet run. Four-layer schema sync pattern extracted to `.agent/memory/code-patterns/multi-layer-schema-sync.md`. Session: [M1 quality fixes](../../.cursor/projects/Users-jim-code-oak-oak-mcp-ecosystem/agent-transcripts/379f5e51-f981-41f0-856d-03b025cbdd41.txt).
- **2026-02-28**: **Next-session handoff prepared.** M1-S001 split into M1-S001a (populate `thread_semantic`, P1) and M1-S001b (enhance tool descriptions for subject filtering, P2). User decision: the query-side fix is tool guidance, not auto-inference — consuming agents should be told to pass subject as a filter via tool descriptions, not have it auto-detected in code. Next Session Checklist rewritten with prioritised work items. `onboarding-rerun.prompt.md` rewritten as standalone entry point for M1 MCP search quality fixes. EsCurric MCP tools confirmed working (`user-EsCurric` server).
- **2026-02-28**: **MCP tool exploration findings triaged and refined.** Systematic testing of all 32 oak-remote-preview MCP tools using KS4 maths as domain. 7 snag items registered (M1-S001 to M1-S007). Key refined findings: (1) M1-S001 root cause is `thread_semantic` field never populated at indexing time — confirmed via EsCurric `platform_core_get_document_by_id` on three sample documents (algebra, geometry-and-measure, bq14-physics); the ELSER leg of the 2-way RRF is dead across all 164 thread documents. Fix: populate `thread_semantic` with subject-enriched content in `createThreadDocument`, reindex. (2) M1-S002: user decision — normalise `year` on string, strictly constrained to enum values from OpenAPI spec (`'1'`–`'11'` + `'all-years'`); accept both string and number input via `z.union([z.enum([...]), z.number().transform(String)])`; EYFS/early-years/SEND not in current schema. Triage: 2 quick wins (M1-S003, M1-S005 — text changes), 2 blockers (M1-S001, M1-S002 — functional gaps), 3 deferred post-merge (M1-S004, M1-S006, M1-S007). Session transcript: [KS4 maths exploration](../../.cursor/projects/Users-jim-code-oak-oak-mcp-ecosystem/agent-transcripts/8b4b3ea0-9ca6-4b11-bbc0-4ad50bafdb00.txt).
- **2026-02-27**: **N1-N21 fix plan integrated.** Evaluated all 21 post-remediation findings against the filesystem: 15 genuine fixes (4 P1, 7 P2, 4 P3), 6 non-issues (N12, N13, N15, N18, N20, N21). Organised into three fix groups: C (quick fixes, ~5 min), B (README audience routing, ~15-20 min), A (SDK README rewrite, ~20-30 min). Added final onboarding validation plan (4 personas: junior dev, senior dev, principal engineer, product owner). Cursor plans deleted; this plan and `onboarding-rerun.prompt.md` are now the sole entry point for the next session. Session transcript: [Planning session](../../.cursor/projects/Users-jim-code-oak-oak-open-curriculum-ecosystem/agent-transcripts/8b8347d4-ed4b-477b-80e7-245c643579ff.txt).
- **2026-02-27**: **Post-remediation onboarding rerun complete.** Discovery-based simulation with 4 personas (junior dev, lead dev, engineering manager, product owner). Each started at README.md with no prescribed reading list. All 17 previous remediation items verified effective. No P0 blockers. 4 new P1 docs-only items identified (N1-N4): SDK README fabricated examples, README jargon wall, Curriculum Guide not linked, MCP unexplained for non-technical readers. Owner dispositions: all 4 block M0. Repo name mismatch confirmed as false positive for the third time (rename executed on GitHub). G4 updated with post-remediation evidence. M0 milestone updated with new gate. Remaining M0 gates: fix N1-N4, secrets sweep, manual review, merge, make public.
- **2026-02-26**: **G4 complete — onboarding dispositions recorded.** Onboarding rerun complete (4 personas). Owner dispositions for all 36 findings. 6 resolved/dismissed (R1, R2 false positives; R11, R20, R28, R32 dismissed). Milestone separation introduced: closed private alpha → open private alpha (M0) → open public alpha (M1). G6/G7/rate-limiting reclassified to M1 blockers only. 17 docs-only items block M0. Added §Onboarding Snagging section and rate-limiting assessment task. Next session checklist rewritten with milestone progression table and M0/M1 work items. Session transcript: `e8c8a371-93d5-4c22-9419-420134c11dad`.
- **2026-02-26**: **Batches C-2, D, E1 complete — session handoff.** Batch C-2 committed (`30cf9132`). F7 (ADR-108 completion) committed (`066be0af`): moved 25 synonym files + `synonym-export.ts` to sdk-codegen, created `@oaknational/sdk-codegen/synonyms` subpath, removed curriculum-sdk dependency from search-sdk entirely, tightened ESLint boundaries to block ALL curriculum-sdk imports, updated 5 ADRs and multiple READMEs, 4 integration tests. Review Gate 1: 6 specialist reviewers, all findings addressed. Batch E1 committed (`1c97d2d6`): F35 dead code removal, F11 verified already documented, F16 rate limiting precondition. Also fixed pre-existing flaky timing test (`rate-limit-config.unit.test.ts` — `vi.useFakeTimers`). Open items: 9 remaining (0 P1, 1 P2, 8 P3). Working tree clean. Next: Batch E2 (6 items). Session transcript: `0103cfeb-5e37-47d5-b53f-aea7e91fbb77`.
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
