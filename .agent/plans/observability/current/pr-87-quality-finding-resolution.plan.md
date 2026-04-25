---
name: PR #87 Quality Finding Resolution
overview: >
  Resolve all CodeQL alerts, SonarCloud issues, and Security Hotspots
  flagged on PR #87 (`feat/otel_sentry_enhancements`) so the
  SonarCloud Quality Gate, CodeQL combined check, and the CI test
  job pass. Highest leverage first: a single semver DRY consolidation
  closes 3 CodeQL alerts plus 2 Sonar hotspots; CRITICAL Sonar
  correctness bugs land before stylistic batches; rule-policy
  decisions are surfaced before mechanical sweeps to avoid wasted
  fixes.
todos:
  - id: phase-0-foundation
    content: "Phase 0: Foundation + scope decisions (verify rate-limit coverage on OAuth metadata routes; decide on stylistic-rule policy; confirm semver-DRY home; record decisions in plan body)."
    status: pending
  - id: phase-1-semver-dry
    content: "Phase 1: Semver-validation DRY consolidation. Extract canonical regex + parseSemver + isLessThanOrEqual to one home; replace inline copies in three sites. Closes CodeQL #75 #79 #80 + Sonar S5852 ×2."
    status: pending
  - id: phase-2-critical-correctness
    content: "Phase 2: CRITICAL Sonar correctness fixes. Six Array.sort comparator fixes (S2871); two cognitive-complexity refactors (S3776); three void-operator fixes (S3735); one regex DoS in max-files-per-dir.ts (S5852 third hotspot)."
    status: pending
  - id: phase-3-codeql-remaining
    content: "Phase 3: Remaining CodeQL findings. Schema-cache untrusted-data-write (#76 #77) — guard or accept with rationale; auth-routes rate-limiting (#70 #71) — confirm OAuth metadata coverage and fix gap or close alert."
    status: pending
  - id: phase-4-major-sonar
    content: "Phase 4: MAJOR Sonar fixes. shell-script [[ ]] over [ ] (9 in check-commit-message.sh + 2 stderr redirects); too-many-params (S107) in application.ts and suggestions.ts; nested ternary; nested template literals; missing return; top-level await; PATH safety in vercel-ignore."
    status: pending
  - id: phase-5-minor-policy
    content: "Phase 5: MINOR Sonar resolution. Apply the Phase 0 rule-policy decision: either disable specific rules at quality-profile level OR batch-fix the accepted rules across remaining files."
    status: pending
  - id: phase-6-verification
    content: "Phase 6: Verification + documentation. Re-run all CI gates; verify SonarCloud Quality Gate clears; verify CodeQL combined check clears; document any accepted-with-rationale findings in commit messages or ADR."
    status: pending
---

# PR #87 Quality Finding Resolution

**Last Updated**: 2026-04-25
**Status**: 🔴 NOT STARTED
**Scope**: Resolve all CodeQL, SonarCloud, and Security Hotspot
findings flagged on PR #87 so the three failing checks (CodeQL
combined, SonarCloud Quality Gate, CI test) clear and the PR is
mergeable.

---

## Context

PR #87 (`feat/otel_sentry_enhancements`) currently fails three
quality checks at HEAD `d318b8bd`:

1. **CodeQL combined**: 7 active review threads (3 categories), 3
   outdated/resolved.
2. **SonarCloud Quality Gate**: 76 OPEN issues, 4 Security Hotspots
   TO_REVIEW, 5.2% duplication on new code (required ≤ 3%).
3. **CI `test` job**: knip resolution failure on
   `@oaknational/env-resolution` (separately fixed in unpushed
   `2484066b`).

Local commit `2484066b` (not yet pushed) addresses the Vercel build
failure and the CI knip ordering. This plan addresses the remaining
two failing checks plus the Vercel ignoreCommand security hotspot
that `2484066b` introduced.

The findings cluster into four substantive categories plus one
stylistic/policy category. Treating them by category — not file by
file — exposes a high-leverage consolidation: one fix closes 3
CodeQL alerts and 2 Sonar hotspots simultaneously.

### Issue 1: Polynomial-backtracking application-version regex (CRITICAL leverage)

The same regex pattern
`/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)*$/u` appears in three places:

- `scripts/validate-root-application-version.mjs:7`
- `packages/core/build-metadata/src/runtime-metadata.ts:14`
- `apps/oak-curriculum-mcp-streamable-http/build-scripts/vercel-ignore-production-non-release-build.mjs`
  (a different regex, also semver-validation-shaped, added in
  `2484066b` and not yet pushed)

The shared pattern's alternation `[-+]` followed by `[0-9A-Za-z.-]+`
(which itself contains `-`) has overlapping matches; combined with
the trailing `*` quantifier, this is polynomial-time on
adversarial inputs (`0.0.0+--…--`). Three CodeQL alerts (75, 79,
80) and two SonarCloud Security Hotspots (`javascript:S5852`,
`typescript:S5852`) flag it.

**Evidence**:

- CodeQL alert #75 (`validate-root-application-version.mjs:7`)
- CodeQL alerts #79, #80 (`runtime-metadata.ts:14`, `:17`)
- Sonar hotspots `AZ2-Q2nDjNY6cixFXs-0` and `AZ2-Q2aLjNY6cixFXs-a`
- Sonar duplication metric (5.2% > 3% required)

**Root Cause**: shared semver-validation logic copied across three
sites instead of extracted to a shared module. The duplication
itself is the structural defect; the regex flaw is an instance of
it.

**Existing Capabilities**: `2484066b` has already inlined a
correct, non-overlapping semver regex in
`vercel-ignore-production-non-release-build.mjs` (the strict
semver.org §2 pattern with prerelease + build-metadata support and
§11 precedence comparison). That implementation is the canonical
reference; the plan is to extract it to a shared home and replace
the other two sites.

### Issue 2: Untrusted network data written to file (MEDIUM-risk)

`packages/sdks/oak-sdk-codegen/code-generation/schema-cache.ts:45`
and `:52` write `JSON.stringify(schema, undefined, 2)` to a file
where `schema: OpenAPIObject` came from a network `fetch()` upstream
without explicit downstream validation before write. Two CodeQL
alerts (#76, #77) flag the trust-boundary missing.

**Evidence**:

- CodeQL alert #76 (line 45)
- CodeQL alert #77 (line 52)

**Root Cause**: implicit trust boundary — the schema is validated
at codegen-consumption time, not at write time. CodeQL has no
sanitiser to recognise.

**Existing Capabilities**: the upstream fetcher already runs in a
controlled CI/dev context against a known endpoint
(`open-api.thenational.academy`); the consumer (`sdk-codegen`)
parses + validates the schema downstream. The validation exists; it
is just not adjacent to the write.

### Issue 3: Auth-routes rate-limiting alerts (NEEDS VERIFICATION)

CodeQL alerts #70 and #71 cite `auth-routes.ts:187` and `:193`.
Reading the local file, those line numbers are inside
`setupAuthRoutes`'s control flow, not direct route handlers. The
actual route registrations in this file:

- `/mcp` POST + GET (lines 33, 35, 113, 115): `mcpRateLimiter`
  applied ✅
- `/.well-known/oauth-protected-resource` ×2, `/oauth-authorization-server`,
  `/mcp-stub-mode` (lines 77, 78, 80, 92): no rate-limiter
  middleware visible at the registration sites.

The PR description names an OAuth rate-limit profile (30 req/15min
/IP) — needs verification that it covers the OAuth metadata
endpoints, not only token-exchange / callback. CodeQL's category is
"auth handler not rate-limited"; the *finding* is plausibly real
for the OAuth metadata routes if no path-prefix `app.use` covers
them.

### Issue 4: 76 SonarCloud OPEN issues (mixed severity, mixed validity)

| Severity | Count | Substantive themes |
|---|---|---|
| CRITICAL | ~11 | Array.sort without comparator (S2871) ×6 [real correctness], cognitive complexity (S3776) ×2, void operator (S3735) ×3 |
| MAJOR | ~16 | shell-script `[[ ]]` (S7688) ×9, too-many-params (S107) ×2, stderr-redirect (S7677) ×2, top-level-await (S7785), nested-ternary (S3358), nested-template-literals (S4624), missing-return (S7682) |
| MINOR | ~47 | export-from convention (S7763) ×12, conditional default-assign (S6644) ×4, RegExp.exec (S6594) ×4, String.raw (S7780) ×5, `unknown` overrides union (S6571) ×3, `\d` over `[0-9]` (S6353) ×3, Object.hasOwn (S6653) ×2, zero-fraction (S7748) ×2, TypeError (S7786), `??=` (S6606), negated-condition (S7735) ×3 |
| INFO | 2 | TODO comments in CLI |

The CRITICAL Array.sort findings are real correctness bugs.
`Array.prototype.sort()` without a comparator does lexical
comparison — wrong for numbers, locale-dependent for strings. Six
sites affected.

The MINOR category is largely stylistic; many of the rules are
defensible but not universally adopted. Oak may legitimately have a
different convention than Sonar's defaults (e.g., `export {x} from`
vs `export … from` is a debated style; `RegExp.exec()` over
`String.match()` is a performance micro-optimisation that doesn't
matter for non-hot paths). **A policy decision is needed in Phase
0** to avoid mechanical fix-then-revert cycles.

---

## Quality Gate Strategy

**Critical**: full-monorepo gates after each phase. Per-task gates
within a phase use the touched-workspace subset where deterministic.

### After each task

```bash
pnpm type-check
pnpm lint
pnpm test
```

### After each phase

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm knip
pnpm depcruise
pnpm test
pnpm test:e2e
pnpm format-check:root
pnpm markdownlint-check:root
pnpm portability:check
pnpm subagents:check
pnpm practice:vocabulary
pnpm practice:fitness:strict-hard
```

### After Phase 6 (final)

Push to remote; observe SonarCloud + CodeQL re-runs against the new
HEAD. Verify all three previously-failing checks now pass.

---

## Solution Architecture

### Principle (from `principles.md`)

> "All quality gates are blocking at all times, regardless of
> location, cause, or context."
>
> "Strict and complete, everywhere, all the time."
>
> "If a shortcut creates duplication across architectural layers,
> it is not a shortcut — it is a debt that compounds silently."

### Key Insight

The semver-validation triple-duplication and the
SonarCloud-duplication-metric failure share a root cause: copy-paste
between three sites. Fixing the root (a shared module) closes 3
CodeQL alerts, 2 Sonar hotspots, and contributes to clearing the
5.2% duplication metric in one commit. **Highest leverage move; do
this before anything else mechanical.**

This exemplifies the first question from `principles.md`: **"Could
it be simpler?"** Yes — one canonical implementation in one place,
consumed by three callers, instead of three copies that drift.

### Strategy

- **Phase 0**: surface and resolve scope ambiguities BEFORE
  mechanical work. Three named decisions: rate-limit verification on
  OAuth metadata; stylistic-rule policy (fix vs disable); semver-DRY
  home (`@oaknational/build-metadata` vs new lib).
- **Phase 1**: extract semver helpers to one home; replace three
  consumers; verify gates.
- **Phase 2**: real correctness bugs (CRITICAL Sonar). Highest-risk
  fixes since Array.sort changes affect ordering semantics.
- **Phase 3**: remaining security findings (CodeQL #70/#71/#76/#77).
- **Phase 4**: MAJOR Sonar fixes. Mostly mechanical.
- **Phase 5**: MINOR Sonar resolution per Phase 0 policy.
- **Phase 6**: full validation + push + observe re-runs.

**Non-Goals** (YAGNI):

- ❌ Adding new application features.
- ❌ Refactoring observability code beyond what the findings require.
- ❌ Adopting a new linter or static-analysis tool.
- ❌ Writing tests for code that has none and is not flagged.
- ❌ Fixing every Sonar rule Oak doesn't follow — disable selectively
  via quality profile per Phase 0 decision.
- ✅ Clearing the three failing PR checks and any blockers downstream.
- ✅ Removing semver-validation duplication (root-cause fix, not
  symptom-suppression).

---

## Build-vs-Buy Attestation

Not vendor-touching. The semver-validation logic is intentionally
inlined per `vercel-ignore-production-non-release-build.mjs`'s
constraint (Vercel runs the ignoreCommand BEFORE `pnpm install`,
so external `semver` package cannot be imported there). The shared
module extracted in Phase 1 must therefore have zero runtime
dependencies and consume only Node built-ins. This is a deliberate
inline-rather-than-bundle decision driven by the build-time
constraint, not a build-vs-buy substitution.

`assumptions-reviewer` runs against this attestation pre-execution.

---

## Reviewer Scheduling (phase-aligned)

- **Pre-execution (Phase 0 close)**:
  - `code-reviewer` — gateway review of the plan body itself
    (**ran 2026-04-25, dispositions table above**).
  - `assumptions-reviewer` — challenges the rule-policy decision and
    the rate-limit-verification framing (pending; runs before Phase 1).
- **During**:
  - `type-reviewer` after Phase 1 (shared module type surface).
  - `type-reviewer` after Phase 2 (S6571 fixes — verify no `as`,
    `any`, `unknown` widening introduced; `readonly string[]`
    preserved on `ParsedSemver.prerelease`).
  - `architecture-reviewer-fred` after Phase 1 (boundary placement
    of the new shared module — explicit scope: challenge whether
    `semver.ts` belongs in `@oaknational/build-metadata` or warrants
    a dedicated lib).
  - `test-reviewer` after Phase 1 (test coverage of shared
    semver helpers — explicit scope: flag any duplicated proof
    across `semver.unit.test.ts` and the retained
    `vercel-ignore-production-non-release-build.unit.test.mjs`).
  - `security-reviewer` after Phase 3 (auth-routes rate-limit
    decision and schema-cache trust-boundary decision — explicit
    scope: if dismissal-with-rationale is chosen for #76/#77, verify
    the cited downstream validation actually exists; do not accept
    a dismissal note that asserts unverified validation).
  - `config-reviewer` after Phase 5 (if Phase 0 Task 0.2's DISABLE
    path is taken — verify `.sonarcloud.properties` suppression
    syntax, scope correctness, and that no rules are suppressed
    beyond Phase 0's owner-confirmed list).
- **Post (Phase 6)**:
  - `release-readiness-reviewer` — explicit GO/NO-GO on the PR.
  - `docs-adr-reviewer` — if any rule-disable decision warrants ADR
    entry.

---

## Foundation Document Commitment

Before each phase:

1. **Re-read** `.agent/directives/principles.md` — Code Quality and
   No-warning-toleration sections.
2. **Re-read** `.agent/directives/testing-strategy.md` — TDD at all
   levels (Phase 1's shared module gets unit tests).
3. **Re-read** `.agent/directives/schema-first-execution.md` — Phase
   1's shared module is hand-written (semver is not an OpenAPI
   schema); confirm the cardinal rule still applies (no widening of
   generated types).
4. **Ask**: "Does this deliver system-level value?" Yes — closes
   three failing PR checks; root-cause fix of duplication.
5. **Verify**: no compatibility layers, no type shortcuts, no
   disabled checks.

---

## Reviewer Dispositions (2026-04-25 code-reviewer pre-execution gate)

`code-reviewer` ran on the plan body at commit `0c04e7d5` per the
plan's own Phase 0 close gate. Findings absorbed into the plan body
(this revision); the Phase 0 reviewer gate is satisfied for the
gateway-review half. `assumptions-reviewer` has not yet run; that
remains as the second Phase 0 close gate before Phase 1 starts.

| Finding | Severity | Disposition |
|---|---|---|
| 1. Task 1.3 leaves import path unresolved (could break `oak-search-cli` build) | BLOCKING | **Absorbed**. Task 1.3 now commits to **Path A** (inline + `@see` pointer), matching the `vercel-ignore` decision. Acceptance criterion added: `pnpm build --filter @oaknational/oak-search-cli` exits 0 in clean-build simulation. Hedged language removed. |
| 2. Phase 1 TDD ordering does not enforce RED-before-GREEN | BLOCKING | **Absorbed**. Task 1.1 split into 1.1a (RED — failing tests against non-existent module first) and 1.1b (GREEN — module implementation makes them pass). |
| 3. Task 1.2 depcruise scope | MAJOR | **Absorbed**. Task 1.2 now uses scoped `pnpm depcruise --include-only "build-metadata"` as primary check; full-graph run as secondary. |
| 4. Phase 4 S7785 missing import-check | MAJOR | **Absorbed**. Phase 4 acceptance now includes prerequisite check: `rg -rn "ci-schema-drift-check" apps/ packages/ scripts/ --glob "!scripts/ci-schema-drift-check.mjs"` returns no consumers before top-level-await fix lands. |
| 5. Phase 5 DISABLE-path availability not verified at boundary | MAJOR | **Absorbed**. Phase 5 acceptance criterion 0 added: verify `.sonarcloud.properties` (or per-issue dismissal) achieves the DISABLE outcome before committing to that path. If org-level profile blocks, fall back to per-issue dismissal with rationale. |
| 6. S6571 `unknown`-overrides-union (×3) is type-safety, not stylistic | MAJOR | **Absorbed**. The three S6571 sites (`server.ts:91,37`, `deploy-entry-handler.ts:19`) move from Phase 5 into Phase 2 as a new Task 2.5; `type-reviewer` dispatched after Phase 2 covers them. |
| 7. Phase 4 PATH safety pre-decided | MINOR | **Absorbed**. PATH-safety decision moved to Phase 0 Task 0.4 (new); Phase 4 references the Phase 0 finding. |
| 8. Phase 2 Task 2.1 generator-existence not verified | MINOR | **Absorbed**. Task 2.1 criterion 0 added: confirm `path-parameters.ts` is generator-produced; identify the generator file and `sdk-codegen` task before attempting a fix. |
| 9. Phase 2 complete validation omits `pnpm depcruise` | NIT | **Absorbed**. `pnpm depcruise` added to Phase 2 complete validation block. |
| 10. Build-vs-Buy attestation well-formed | POSITIVE | Acknowledged; preserved. |
| 11. Phase 0 decision-before-mechanics framing proportionate | POSITIVE | Acknowledged; preserved. |
| Additional specialists: `type-reviewer` after Phase 2 (not only Phase 1); `config-reviewer` after Phase 5 (if DISABLE path); `architecture-reviewer-fred` scope to challenge `build-metadata` vs dedicated lib; `test-reviewer` scope to flag duplicated coverage; `security-reviewer` scope to verify dismissal note accuracy | — | **Absorbed**. Reviewer Scheduling section updated with each addition and scoped delegation. |

---

## Documentation Propagation Commitment

Before marking each phase complete:

1. Update commit messages to name closed CodeQL alerts and Sonar
   findings explicitly.
2. If Phase 0's rule-policy decision disables Sonar rules, record
   the rationale in `.sonarcloud.properties` or the project's
   quality-profile config; add a one-line ADR amendment if the
   decision is broadly applicable.
3. If Phase 3's schema-cache decision is "accept with rationale,"
   document in a TSDoc `@remarks` block adjacent to the write.
4. Apply `/jc-consolidate-docs` after Phase 6.

---

## Resolution Plan

### Phase 0: Foundation + Scope Decisions (1 session)

**Foundation Check-In**: Re-read `principles.md` §Code Quality and
`no-warning-toleration.md`. Re-read the
`schema-first-execution.md` cardinal rule.

**Key Principle**: surface every decision that would change the fix
shape BEFORE mechanical work, so Phase 1+ executes deterministically.

#### Task 0.1: Verify OAuth metadata route rate-limiting coverage

**Current Assumption**: PR description states "OAuth: 30 req/15min/IP
/asset proxy: 60 req/min/IP" rate-limit profiles. CodeQL alerts
70/71 cite auth-routes.ts:187/193 as missing rate-limiting.

**Validation Required**: confirm whether OAuth metadata endpoints
(`/.well-known/oauth-protected-resource{,/mcp}`,
`/.well-known/oauth-authorization-server`,
`/.well-known/mcp-stub-mode`) are covered by an `app.use(...)`
path-prefix middleware or are intentionally unrated.

**Acceptance Criteria**:

1. ✅ `rg "oauthRateLimiter|asset.*RateLimiter|app\.use.*RateLimit" apps/oak-curriculum-mcp-streamable-http/`
   surfaces the rate-limit middleware wiring.
2. ✅ For each `.well-known/*` route in `auth-routes.ts`, document
   whether it has rate-limit coverage (yes/no/by-prefix).
3. ✅ If gap found, decision recorded: cover via path-prefix
   middleware OR accept with rationale (e.g., metadata endpoints
   serve discovery JSON only and CDN edge limits are sufficient).

**Deterministic Validation**:

```bash
rg -n "RateLimit" apps/oak-curriculum-mcp-streamable-http/src/ | head -30
rg -n "app\.use" apps/oak-curriculum-mcp-streamable-http/src/ | head -10
rg -nE "app\.(get|post|use)" apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts
```

**Task Complete When**: gap or no-gap state documented in Phase 0
findings section below.

#### Task 0.2: Decide stylistic-rule policy

**Current Assumption**: 49 MINOR Sonar findings include rules Oak
may not follow (e.g., `S7763` `export … from` convention, `S6594`
`RegExp.exec()`, `S6644` conditional default-assign, `S7780`
`String.raw` for backslashes).

**Validation Required**: for each MINOR rule with ≥ 2 instances,
decide: **accept and fix** (rule reflects Oak's style) OR **disable
in Sonar quality profile** (rule does not).

**Acceptance Criteria**:

1. ✅ Each MINOR rule with ≥ 2 instances has a recorded decision in
   the Phase 0 findings section: ACCEPT (fix all), DISABLE
   (suppress at quality-profile level), or DEFER (leave OPEN with
   rationale).
2. ✅ Each CRITICAL and MAJOR rule has decision ACCEPT (real bugs)
   or, if DISABLE, written rationale citing why the rule does not
   apply to Oak.
3. ✅ Decisions surfaced to owner for confirmation before Phase 5.

**Deterministic Validation**:

```bash
# Verify Sonar quality profile is configured for the project (or
# the project uses default profile which can't be edited).
ls .sonarcloud.properties sonar-project.properties 2>/dev/null
```

**Task Complete When**: rule-policy decisions table populated and
owner-confirmed.

#### Task 0.3: Confirm semver-DRY extraction home

**Current Assumption**: the canonical semver-validation logic
should live in `@oaknational/build-metadata` (already a workspace,
already consumed by both runtime-metadata and the vercel-ignore
script's neighbouring code). Alternative: a new lib
(`@oaknational/semver-validation`).

**Validation Required**: confirm `@oaknational/build-metadata` is
the right home given (a) zero-runtime-deps constraint for the
vercel-ignore script consumer; (b) existing dependency direction;
(c) no circular-import risk.

**Acceptance Criteria**:

1. ✅ Proposed module location identified
   (e.g., `packages/core/build-metadata/src/semver.ts`).
2. ✅ All three consumer sites can import from it without circular
   dependency.
3. ✅ The vercel-ignore script consumer can use it given the
   pre-`pnpm install` constraint (confirm whether bundling helps or
   if the file must be vendored / re-inlined).

**Deterministic Validation**:

```bash
pnpm depcruise --include-only "build-metadata|vercel-ignore" 2>&1 | head
```

**Note on the vercel-ignore constraint**: the ignoreCommand runs
BEFORE `pnpm install`, so `import` from `@oaknational/build-metadata`
will not resolve at that boundary. Two paths:

- **Path A**: extract to shared module; runtime-metadata.ts and
  validate-root-application-version.mjs consume; the vercel-ignore
  script keeps its inlined copy and adds a TSDoc `@see` pointer to
  the canonical home.
- **Path B**: extract to shared module + add a build step that
  pre-bundles the ignoreCommand script with its semver dependency
  resolved. Heavier; depends on Vercel build sequencing.

Path A is simpler and preserves the constraint without new build
machinery. Recommend Path A.

**Task Complete When**: extraction home decided and documented.

#### Task 0.4: PATH safety rationale for the Vercel ignoreCommand

**Current Assumption**: `2484066b` introduced an `execFileSync('git', …)`
call in `vercel-ignore-production-non-release-build.mjs`.
SonarCloud `javascript:S4036` flags it as a LOW-probability PATH
hijack risk.

**Validation Required**: confirm Vercel's build environment
provides `git` on a fixed, unwriteable `PATH`. If yes,
accept-with-rationale. If no, pin the absolute path or extract via
`process.env.PATH` filtering.

**Acceptance Criteria**:

1. ✅ Vercel build-environment PATH composition documented (link to
   Vercel docs or evidence).
2. ✅ Decision recorded: ACCEPT (with TSDoc rationale on the
   `execFileSync` call) OR FIX (with absolute path).

**Task Complete When**: decision recorded; Phase 4's PATH-safety
work executes per the recorded outcome.

#### Phase 0 findings (populated during execution)

```text
Task 0.1 finding: [TODO populate during execution]
Task 0.2 rule policy: [TODO populate during execution]
Task 0.3 extraction home: [TODO populate during execution]
Task 0.4 PATH safety: [TODO populate during execution]
```

#### Phase 0 Acceptance Criteria

1. ✅ All three Phase 0 tasks complete.
2. ✅ Findings section above populated with concrete decisions.
3. ✅ Owner confirms rule-policy decisions before proceeding to
   Phase 5.
4. ✅ `assumptions-reviewer` and `code-reviewer` reviews of this
   plan body recorded; findings absorbed.

---

### Phase 1: Semver-Validation DRY Consolidation (1 session)

**Foundation Check-In**: Re-read `principles.md` §Cardinal Rule
(this code is hand-written; cardinal rule does not apply but the
no-duplication discipline does); `testing-strategy.md` §Universal
testing principles.

**Key Principle**: one canonical implementation, three consumers,
zero drift.

#### Task 1.1a (RED): Write failing tests against the not-yet-existing semver module

**TDD discipline** (per `testing-strategy.md`): tests first,
proving they fail because the module does not yet exist.

**Acceptance Criteria**:

1. ✅ `packages/core/build-metadata/src/semver.unit.test.ts` exists
   with the planned ~20 cases (§2 strict X.Y.Z; prerelease forms;
   build-metadata; §11 precedence; rejection cases including
   leading zeros, invalid characters, negative numbers).
2. ✅ Tests reference imports from `./semver.js` that do not yet
   resolve.
3. ✅ Running the test file produces a controlled failure
   (compile-time module-not-found, NOT runtime undefined-reference).

**Deterministic Validation**:

```bash
cd packages/core/build-metadata
pnpm exec vitest run src/semver.unit.test.ts 2>&1 | grep -E "Cannot find module|Failed to load"
# Expected: at least one such message; tests do not pass.
```

**Task Complete When**: RED is intentional and proves the test
file exists in a failing state caused by the missing module.

#### Task 1.1b (GREEN): Extract canonical semver module

**Current Implementation**: three near-identical regex patterns at
the three sites named in §Issue 1.

**Target Implementation**: one module at the home decided in Phase
0 (recommended `packages/core/build-metadata/src/semver.ts`)
exporting:

```typescript
export const SEMVER_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;

export interface ParsedSemver {
  readonly major: number;
  readonly minor: number;
  readonly patch: number;
  readonly prerelease: readonly string[];
}

export function parseSemver(version: string): ParsedSemver | null;
export function isValidSemver(version: string): boolean;
export function isLessThanOrEqual(a: string, b: string): boolean;
```

**Changes**:

- Add new file with the canonical implementation (lifted from
  `2484066b`'s vercel-ignore script) so the Task 1.1a tests now
  pass.
- Re-export from `packages/core/build-metadata/src/index.ts` if the
  package's public surface uses an index re-export pattern.

**Acceptance Criteria**:

1. ✅ New file added; Task 1.1a tests now pass (the RED of 1.1a
   becomes GREEN here).
2. ✅ All tests pass: `pnpm --filter @oaknational/build-metadata test`.
3. ✅ Type-check clean: `pnpm --filter @oaknational/build-metadata type-check`.
4. ✅ No `as`, `any`, `unknown` widening introduced.
5. ✅ `ParsedSemver.prerelease` typed as `readonly string[]`, not
   `string[]`.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/build-metadata test
pnpm --filter @oaknational/build-metadata type-check
pnpm --filter @oaknational/build-metadata lint
```

#### Task 1.2: Replace runtime-metadata.ts consumer

**Current Implementation** (line 14):

```typescript
const APPLICATION_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)*$/u;
function isValidApplicationVersion(value: string): boolean {
  return APPLICATION_VERSION_PATTERN.test(value);
}
```

**Target Implementation**:

```typescript
import { isValidSemver } from './semver.js';
// remove APPLICATION_VERSION_PATTERN and isValidApplicationVersion
// inline-replace .test()/isValidApplicationVersion() with isValidSemver()
```

**Acceptance Criteria**:

1. ✅ No regex pattern remains at line 14 area.
2. ✅ All call sites use `isValidSemver` from the canonical home.
3. ✅ Existing tests for runtime-metadata pass unchanged
   (behaviour-preserving refactor).
4. ✅ `pnpm depcruise` shows no new circular dependency.

**Deterministic Validation**:

```bash
rg -n "APPLICATION_VERSION_PATTERN" packages/core/build-metadata/
# Expected: only in semver.ts and its test file
pnpm --filter @oaknational/build-metadata test
pnpm --filter @oaknational/build-metadata type-check
# Scoped depcruise (primary): verifies no new cycle within build-metadata
pnpm depcruise --include-only "build-metadata"
# Full-graph (secondary): verifies no cross-package regression
pnpm depcruise
```

#### Task 1.3: Apply Path A to validate-root-application-version.mjs (inline + `@see` pointer)

**Current Implementation** (line 7):

```js
const APPLICATION_VERSION_PATTERN = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)*$/u;
```

**Decision (settled by code-reviewer 2026-04-25, BLOCKING-1)**:
the script runs as a pre-step inside `oak-search-cli`'s build
script (`"build": "node ../../scripts/validate-root-application-version.mjs && tsup"`),
which executes inside `turbo run build` at a point where
`build-metadata`'s `dist/` may or may not be populated depending
on the turbo task graph. To preserve the script's
no-pre-build-needed contract (matching the `vercel-ignore` script's
Vercel-pre-install constraint), **adopt Path A**: keep the regex
inline and add a `@see` TSDoc pointer to the canonical
`packages/core/build-metadata/src/semver.ts` module.

**Target Implementation**: replace the existing pattern with the
canonical strict-semver regex (lifted verbatim from `semver.ts`)
and add a `@see` block:

```js
/**
 * @see ../packages/core/build-metadata/src/semver.ts — canonical
 * implementation. This script runs before `pnpm build` populates
 * `dist/`, so the regex is intentionally inlined rather than
 * imported. Keep both copies in sync; consolidate-docs step 7d
 * audits the cross-reference.
 */
const APPLICATION_VERSION_PATTERN = /^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*))?(?:\+[0-9A-Za-z-]+(?:\.[0-9A-Za-z-]+)*)?$/;
```

**Acceptance Criteria**:

1. ✅ Inline regex updated to the strict-semver pattern (no
   overlapping alternation).
2. ✅ TSDoc `@see` block added pointing at the canonical home.
3. ✅ Script runs successfully against root `package.json`.
4. ✅ **Clean-build simulation passes**:
   `pnpm --filter @oaknational/oak-search-cli build` exits 0 from
   a clean state (no pre-existing `dist/` artefacts in
   `build-metadata`). Simulate clean by running
   `pnpm --filter @oaknational/build-metadata exec rm -rf dist`
   first.
5. ✅ CodeQL #75 (regex DoS) resolves on next push (verified by
   pre-push grep that no overlapping-alternation pattern remains
   in the file).

#### Task 1.4: Cross-reference vercel-ignore script

**Current Implementation**: `2484066b` inlined the canonical pattern
and helpers. The script cannot import from
`@oaknational/build-metadata` because Vercel runs the ignoreCommand
BEFORE `pnpm install`.

**Target Implementation**: keep inline; add a `@see` TSDoc pointer
to the canonical home naming the constraint.

**Acceptance Criteria**:

1. ✅ `vercel-ignore-production-non-release-build.mjs` retains its
   inline implementation.
2. ✅ TSDoc `@see` block added pointing at
   `packages/core/build-metadata/src/semver.ts` and naming the
   pre-`pnpm install` constraint as the reason for non-extraction.
3. ✅ Existing 8-test unit suite still passes.

**Deterministic Validation**:

```bash
cd apps/oak-curriculum-mcp-streamable-http
pnpm exec vitest run build-scripts/vercel-ignore-production-non-release-build.unit.test.mjs
# Expected: 8 tests pass
```

#### Phase 1 Complete Validation

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm test
pnpm depcruise
pnpm knip
```

**Success Criteria**:

- All commands exit 0.
- CodeQL #75, #79, #80 will be resolved on next push (verified by
  pre-push grep: no overlapping-alternation regex remaining).
- Sonar S5852 hotspots ×2 will resolve on next scan.

---

### Phase 2: CRITICAL Sonar Correctness Fixes (1–2 sessions)

**Foundation Check-In**: Re-read `principles.md` §Strict and
Complete and §Code Quality.

**Key Principle**: real correctness bugs land first, before
mechanical batches.

#### Task 2.1: Array.sort comparator fixes (S2871 ×6)

Six sites use `Array.prototype.sort()` without a comparator:

- `packages/core/oak-eslint/src/rules/max-files-per-dir.ts:76`
- `scripts/validate-eslint-boundaries.ts:59`, `:63`, `:66`
- `packages/sdks/oak-sdk-codegen/code-generation/mcp-security-policy.unit.test.ts:97`
- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/path-parameters.ts:84`
- `packages/libs/sentry-node/src/runtime-redaction-barrier.unit.test.ts:626` (×2)

**Acceptance Criteria**:

0. ✅ **Generator existence confirmed for the generated file**: run
   `rg -n "path-parameters" packages/sdks/oak-sdk-codegen/code-generation/`
   to identify the generator and the `sdk-codegen` task that
   produces `path-parameters.ts`. If hand-written despite the
   `generated/` path, fix the file directly with a written rationale.
1. ✅ Each site uses `(a, b) => a.localeCompare(b)` for strings or
   `(a, b) => a - b` for numbers.
2. ✅ Existing tests pass for sites that have tests.
3. ✅ For the generated file (`path-parameters.ts`), fix the
   generator (per the cardinal rule) not the generated output.
   Outcome of criterion 0 above selects the target.
4. ✅ `pnpm lint` exit 0.

#### Task 2.2: Cognitive complexity refactors (S3776 ×2)

- `packages/core/oak-eslint/src/rules/require-observability-emission.ts:106`
  — function with cognitive complexity 22 (limit 15).
- `scripts/validate-practice-fitness.mjs:258` — function with
  complexity 20 (limit 15).

**Acceptance Criteria**:

1. ✅ Each function refactored to decompose conditional branches
   into named helpers.
2. ✅ Existing tests pass unchanged (behaviour-preserving).
3. ✅ Sonar re-scan reports complexity ≤ 15 for each.

#### Task 2.3: Void operator fixes (S3735 ×3)

- `apps/oak-curriculum-mcp-streamable-http/e2e-tests/helpers/test-config.ts:120`
- `apps/oak-search-cli/src/cli/admin/index.ts:73`
- `apps/oak-search-cli/src/cli/eval/index.ts:87`

The `void` operator before a Promise is often used to discard a
Promise return without awaiting. Sonar wants explicit `.catch()` or
`await`. Fix per Oak's chosen idiom.

**Acceptance Criteria**:

1. ✅ Each site replaced with explicit `.catch(...)` or `await`.
2. ✅ No silent Promise rejections introduced.

#### Task 2.5: S6571 `unknown`-overrides-union fixes (×3) — moved from Phase 5

Per code-reviewer MAJOR-6 disposition: S6571 findings are
type-safety, not stylistic, and warrant a dedicated `type-reviewer`
gate. Three sites:

- `apps/oak-curriculum-mcp-streamable-http/src/server.ts:91`
- `apps/oak-curriculum-mcp-streamable-http/src/server.ts:37`
- `apps/oak-curriculum-mcp-streamable-http/src/deploy-entry-handler.ts:19`

**Acceptance Criteria**:

1. ✅ Each site replaced with the concrete type the union was
   intended to express, not with a type assertion (`as`).
2. ✅ No `as`, `any`, `unknown` widening introduced as a fix.
3. ✅ `pnpm type-check` exit 0; existing tests pass unchanged.
4. ✅ `type-reviewer` dispatched after Phase 2 close (covers Task
   1.1b shared-module surface AND these three fixes).

#### Task 2.4: Third regex DoS hotspot (max-files-per-dir.ts:37)

**Current Implementation**: regex at line 37 of `max-files-per-dir.ts`
flagged by `typescript:S5852` (separate from the application-version
pattern).

**Acceptance Criteria**:

1. ✅ Pattern inspected; CodeQL/Sonar finding validated as real or
   accepted-with-rationale.
2. ✅ If real, replaced with non-overlapping pattern.

#### Phase 2 Complete Validation

```bash
pnpm test
pnpm lint
pnpm type-check
pnpm depcruise
```

---

### Phase 3: Remaining CodeQL Findings (1 session)

#### Task 3.1: Schema-cache untrusted-data-write (#76, #77)

**Decision required**: guard or accept-with-rationale.

**Option A — Add validation guard**: parse the about-to-write JSON
through a Zod schema (or ajv against OpenAPI 3.1 meta-schema) that
matches the consumer's expected shape. Closes the alert
mechanically; adds a small validation cost at codegen time.

**Option B — Accept with rationale**: document in TSDoc adjacent
to the write that the trust boundary is the upstream API endpoint,
and the validation occurs downstream at consumption. Mark the
CodeQL alert as accepted in the dismissal note.

**Acceptance Criteria**:

1. ✅ Decision recorded; if A, validation added; if B, dismissal
   note + TSDoc comment added.
2. ✅ Either way, CodeQL alerts #76 and #77 closed (resolved or
   dismissed).

#### Task 3.2: Auth-routes rate-limiting (#70, #71)

Per Phase 0 Task 0.1 finding:

- **If gap found** (OAuth metadata routes lack rate-limiting):
  install path-prefix `app.use('/.well-known/oauth*', oauthRateLimiter)`
  middleware OR equivalent per the existing `RateLimiterFactory`
  pattern.
- **If no gap** (rate-limiting covers them via existing wiring):
  dismiss CodeQL alerts #70 and #71 with rationale citing the
  covering middleware location.

**Acceptance Criteria**:

1. ✅ CodeQL alerts #70 and #71 closed.
2. ✅ If middleware added, integration tests verify the rate-limit
   profile applies to OAuth metadata routes.

#### Phase 3 Complete Validation

```bash
pnpm test
pnpm lint
pnpm type-check
# Confirm CodeQL alerts will resolve on push:
rg -n "RateLimit" apps/oak-curriculum-mcp-streamable-http/src/auth-routes.ts
```

---

### Phase 4: MAJOR Sonar Fixes (1 session)

**Acceptance Criteria summary** (per finding):

- 9 × `shelldre:S7688` `[[ ]]` over `[ ]` in
  `scripts/check-commit-message.sh` — mechanical replacement.
- 2 × `shelldre:S7677` stderr redirect in
  `apps/oak-curriculum-mcp-streamable-http/scripts/{dev-widget-in-host,restart-dev-server}.sh`
  — add `>&2` to error-message redirects.
- 2 × `typescript:S107` too-many-params in
  `apps/oak-curriculum-mcp-streamable-http/src/application.ts:124`
  (9 params) and `packages/sdks/oak-search-sdk/src/retrieval/suggestions.ts:104`
  (8 params) — refactor to options-object pattern.
- 1 × `javascript:S3358` nested ternary in
  `scripts/validate-practice-fitness.mjs:542-544` — extract to
  named statements.
- 1 × `typescript:S4624` nested template literals in
  `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-scopes-supported-file.unit.test.ts:13`
  — extract template parts to named consts.
- 1 × `shelldre:S7682` missing return in
  `scripts/check-commit-message.sh:33` — add explicit `return`.
- 1 × `javascript:S7785` top-level await in
  `scripts/ci-schema-drift-check.mjs:73` — convert promise-chain to
  top-level await.
  **Prerequisite check**: before changing the entry-point pattern,
  verify nothing imports this module:
  `rg -rn "ci-schema-drift-check" apps/ packages/ scripts/ --glob "!scripts/ci-schema-drift-check.mjs"`.
  Expected: no consumers; if any exist, escalate before fix
  (top-level await changes import semantics).
- 1 × `javascript:S4036` PATH safety in
  `vercel-ignore-production-non-release-build.mjs:46` — execute
  per the Phase 0 Task 0.4 finding (ACCEPT-with-rationale or FIX).

#### Phase 4 Complete Validation

```bash
pnpm lint
pnpm test
bash scripts/check-commit-message.sh -m "test(check): smoke" || echo OK
```

---

### Phase 5: MINOR Sonar Resolution per Phase 0 Policy (1 session)

**Note**: S6571 (`unknown` overrides union ×3) was reclassified to
Phase 2 Task 2.5 per code-reviewer MAJOR-6.

**Phase 5 acceptance criterion 0 (DISABLE-path verification)**:
before committing to any DISABLE outcome from Phase 0 Task 0.2,
verify the chosen suppression mechanism is achievable:

```bash
ls .sonarcloud.properties sonar-project.properties 2>/dev/null
# If files exist and are project-level, DISABLE via `sonar.issue.ignore.multicriteria`
# is achievable. Verify the syntax matches SonarCloud documentation.
# If no project-level config exists OR the project uses an
# org-level quality profile that this PR cannot edit, fall back to
# per-issue dismissal with rationale via the SonarCloud UI / API.
```

If the DISABLE path is blocked, Phase 5 falls back to: per-issue
dismissal-with-rationale on each MINOR Sonar issue marked DISABLE
in Phase 0 Task 0.2's table. Record the chosen mechanism explicitly
in the Phase 5 commit message.

Apply Phase 0 Task 0.2 decisions:

- **For ACCEPT rules**: batch-fix all instances. Mostly mechanical:
  - `S7763` `export … from` ×12.
  - `S6644` conditional default-assign ×4.
  - `S6594` `RegExp.exec()` ×4.
  - `S7780` `String.raw` ×5.
  - `S6353` `\d` over `[0-9]` ×3.
  - `S6653` `Object.hasOwn` ×2.
  - `S7748` zero-fraction ×2.
  - `S7786` `TypeError` ×1.
  - `S6606` `??=` ×1.
  - `S7735` negated condition ×3.
- **For DISABLE rules**: update `.sonarcloud.properties` (or
  equivalent) with the rule keys to suppress; record rationale in a
  comment block adjacent to the suppression.
- **For DEFER rules**: explicit FALSE_POSITIVE / ACCEPTED note on
  each Sonar issue with rationale.

**Acceptance Criteria**:

1. ✅ Each MINOR finding has a recorded outcome (fixed / disabled /
   deferred-with-note).
2. ✅ Sonar re-scan reports zero new MINOR findings (after
   accept-and-fix) OR documented disabled-rule list.

#### Phase 5 Complete Validation

```bash
pnpm lint
pnpm test
# Verify Sonar config changes (if any):
git diff .sonarcloud.properties sonar-project.properties 2>/dev/null
```

---

### Phase 6: Validation + Documentation (1 session)

#### Task 6.1: Full local quality gates

```bash
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm lint
pnpm knip
pnpm depcruise
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm format-check:root
pnpm markdownlint-check:root
pnpm portability:check
pnpm subagents:check
pnpm practice:vocabulary
pnpm practice:fitness:strict-hard
```

**Acceptance**: all commands exit 0.

#### Task 6.2: Push and observe re-runs

```bash
git push origin feat/otel_sentry_enhancements
# Wait for CI + SonarCloud + CodeQL re-runs.
gh pr checks 87
```

**Acceptance**:

1. ✅ CI `test` job passes.
2. ✅ Vercel preview deployment succeeds.
3. ✅ CodeQL combined check passes.
4. ✅ SonarCloud Quality Gate passes.
5. ✅ All previously-failing PR checks now green.

#### Task 6.3: Document accepted-with-rationale findings

For each finding accepted-with-rationale (not fixed):

- Add a TSDoc `@remarks` block adjacent to the affected code.
- Reference the CodeQL alert ID or Sonar issue key in the
  rationale.
- If the decision is broadly applicable (e.g., a rule the team
  rejects), note in the relevant ADR.

#### Task 6.4: Foundation Document Compliance Checklist

- [ ] **principles.md - Strict and Complete**: no compatibility
  shims introduced.
- [ ] **principles.md - Code Quality**: all gates pass; no rules
  weakened to dodge findings.
- [ ] **principles.md - No Type Shortcuts**: no `as`, `any`,
  `unknown` widening introduced.
- [ ] **principles.md - No-warning-toleration**: every accepted
  finding has fresh per-finding rationale; no carry-forward.
- [ ] **testing-strategy.md - TDD**: Phase 1's shared module has
  unit tests pinning §2 + §11 behaviour.
- [ ] **schema-first-execution.md**: cardinal rule respected
  (generators of generated files updated, not generated outputs).

---

## Testing Strategy

### Unit Tests

**New tests required**:

- `packages/core/build-metadata/src/semver.unit.test.ts` (Phase 1):
  pin §2 strict X.Y.Z, prerelease forms, build-metadata, and §11
  precedence rules. ~20 cases.

**Existing coverage retained**:

- `vercel-ignore-production-non-release-build.unit.test.mjs` (8
  tests) — unchanged through Phase 1 Task 1.4.
- runtime-metadata tests — unchanged through Phase 1 Task 1.2.

### Integration Tests

If Phase 3 Task 3.2 adds rate-limiting middleware:

- New integration test: `auth-routes.rate-limit.integration.test.ts`
  pinning that 31+ rapid requests to `/.well-known/oauth-*` return
  HTTP 429 within the 15-minute window.

### E2E Tests

No E2E changes anticipated.

---

## Success Criteria

### Phase 0

- ✅ Three named decisions recorded; owner-confirmed.

### Phase 1

- ✅ Three CodeQL alerts (#75, #79, #80) will close on push.
- ✅ Two Sonar S5852 hotspots will close on next scan.
- ✅ One canonical semver implementation; three consumers; zero
  drift.

### Phase 2

- ✅ All ~11 CRITICAL Sonar findings closed.
- ✅ Real correctness bugs (Array.sort comparators) fixed.

### Phase 3

- ✅ Four CodeQL alerts (#70, #71, #76, #77) closed (fixed or
  dismissed-with-rationale).

### Phase 4

- ✅ All ~16 MAJOR Sonar findings resolved.

### Phase 5

- ✅ All ~47 MINOR Sonar findings resolved per Phase 0 policy
  (fixed / disabled / deferred).

### Phase 6

- ✅ All three failing PR checks (CodeQL combined, SonarCloud
  Quality Gate, CI test) now pass.
- ✅ PR #87 mergeable.

### Overall

- ✅ Quality gates green on PR #87.
- ✅ Semver-validation duplication eliminated.
- ✅ Real correctness bugs fixed.
- ✅ Stylistic-rule policy made explicit and durable.

---

## Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| Phase 1 extraction creates circular dependency | MEDIUM | Phase 0 Task 0.3 verifies via `pnpm depcruise` before extraction. |
| vercel-ignore script consumer constraint reverses Phase 1 | LOW | Path A (keep inline + `@see` pointer) explicitly preserves the constraint. |
| Sonar quality-profile changes need org-admin access | MEDIUM | Phase 0 Task 0.2 surfaces this before Phase 5; if access blocked, fall back to per-issue dismissal with rationale. |
| Array.sort comparator changes break existing test ordering | MEDIUM | All Phase 2 fixes are behaviour-preserving in correct cases; regressions surface in existing tests. Run full suite after each fix. |
| Cognitive-complexity refactor changes behaviour | MEDIUM | Behaviour-preserving refactor with existing tests as safety net; reviewer dispatch after. |
| Phase 3 schema-cache validation guard adds unacceptable codegen cost | LOW | Option B (accept-with-rationale) is the fallback. |
| OAuth rate-limit middleware adds CDN cache fragmentation | LOW | If Phase 3 Task 3.2 adds middleware, the path-prefix is OAuth-only (low traffic); CDN cache impact minimal. |
| Push triggers parallel-track-pre-commit-gate-coupling pattern | MEDIUM | Coordinate via embryo log before push; align with Fresh Prince's WS1 work if still in flight. |

---

## Dependencies

**Blocking**:

- `2484066b` (local CI/Vercel fix commit) must push first — its
  unblock of the CI test job is a precondition for observing PR
  check state during Phase 6.

**Related plans**:

- `multi-agent-collaboration-protocol.plan.md` — Fresh Prince's WS1
  is in flight on the same branch; coordinate via embryo log.
- `gate-recovery-cadence.plan.md` — the cross-agent build-recovery
  doctrine the new build-breakage rule cites.

**Prerequisites**:

- ✅ Local working tree clean of unrelated WIP at Phase start.
- ✅ Owner approval for Phase 0 decisions before Phase 5 lands.

---

## Foundation Alignment

- **principles.md §Strict and Complete**: no rules weakened, no
  type shortcuts, no compatibility shims.
- **principles.md §Architectural Excellence**: Phase 1 fixes the
  duplication-across-layers root cause, not just the regex
  symptoms.
- **principles.md §No-warning-toleration**: every Sonar finding
  has a recorded outcome (fix / disable / accept-with-rationale);
  no silent deferrals.
- **testing-strategy.md §TDD**: Phase 1's shared module is
  test-first.
- **schema-first-execution.md §Cardinal Rule**: Phase 2 Task 2.1's
  generated-file fix targets the generator, not the output.

---

## Notes

### Why this matters (system-level thinking)

**Immediate value**:

- Unblocks PR #87 merge.
- Eliminates a real polynomial-backtracking DoS vector in three
  scripts (Phase 1).
- Fixes six real Array.sort correctness bugs (Phase 2).

**System-level impact**:

- Establishes a canonical semver-validation home, preventing future
  copy-paste drift.
- Surfaces and resolves a stylistic-rule policy decision the team
  has implicitly deferred — durable, codified.
- Phase 0's "decisions before mechanics" structure is reusable for
  future quality-gate-clearance work.

**Risk of not doing**:

- PR #87 stays unmergeable; the entire observability foundation
  blocks downstream work.
- Polynomial-backtracking regex is exploitable in adversarial
  inputs (low probability for an internal CI/build script, but
  real).
- Array.sort bugs cause silent ordering errors in
  build-output-contract verification, eslint rule evaluation, and
  search-result ordering (varying severity by consumer).
- Sonar-issue accumulation makes future PRs harder to merge as new
  thresholds compound.

---

## Adversarial Review

**Pre-execution** (before Phase 1 starts):

- `assumptions-reviewer` — proportionality of Phase 5's stylistic
  fixes vs Sonar rule disabling; validity of Phase 0 Task 0.3's
  "Path A keeps inline" decision.
- `code-reviewer` — gateway review of this plan body.

**During**:

- `type-reviewer` after Phase 1 (shared module type surface).
- `architecture-reviewer-fred` after Phase 1 (boundary placement).
- `security-reviewer` after Phase 3 (auth-routes + schema-cache
  decisions).
- `test-reviewer` after Phase 1 (shared module test coverage).

**Post (Phase 6)**:

- `release-readiness-reviewer` — explicit GO/NO-GO on the PR.
- `docs-adr-reviewer` — if any ADR-shaped decisions surface from
  Phase 0.

---

## Consolidation

After Phase 6 completes and gates pass, run `/jc-consolidate-docs`:

- Graduate any new patterns surfaced (e.g., a *no-overlap-regex*
  pattern from Phase 1).
- Update Practice Core CHANGELOG if Phase 0 Task 0.2 produced an
  ADR-shaped decision.
- Rotate napkin if pressure thresholds met.
- Verify pending-graduations register reflects this plan's
  completion.

---

## References

- PR #87: <https://github.com/oaknational/oak-open-curriculum-ecosystem/pull/87>
- Local commit `2484066b` (unpushed) — CI/Vercel fix.
- CodeQL alerts: #70, #71, #75, #76, #77, #79, #80 (active);
  #73, #74, #78 (resolved/outdated).
- Sonar project: `oaknational_oak-open-curriculum-ecosystem` PR #87.
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/testing-strategy.md`
  - `.agent/directives/schema-first-execution.md`
- Adjacent plans:
  - `gate-recovery-cadence.plan.md`
  - `multi-agent-collaboration-protocol.plan.md`

---

## Future Enhancements (Out of Scope)

- Migrate `vercel-ignore-production-non-release-build.mjs` to
  consume the canonical semver module if Vercel's build sequencing
  changes to install before ignoreCommand (Path B candidate).
- Replace SonarCloud with a self-hosted Sonar instance if rule
  policy disagreements with the default profile become routine.
- Add a pre-commit hook that runs `sonar-scanner` locally to catch
  Sonar findings before push.
