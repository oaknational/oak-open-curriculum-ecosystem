---
name: "Search SDK GitHub Release Asset Distribution"
overview: "Create a self-contained ESM distribution of @oaknational/oak-search-sdk and attach it to semantic-release GitHub releases for external consumers (including the upstream Oak Open Curriculum API repo)."
source_research:
  - "../../../../../docs/engineering/release-and-publishing.md"
  - "../../../../../.releaserc.mjs"
  - "../../../../../.github/workflows/release.yml"
  - "../../../../../packages/sdks/oak-search-sdk/package.json"
  - "../../../../../packages/sdks/oak-search-sdk/tsup.config.ts"
todos:
  - id: ws1-red-contract-tests
    content: "WS1 (RED): Define and codify the external-consumer contract with failing release-asset tests."
    status: pending
  - id: ws2-green-bundle-and-release-wiring
    content: "WS2 (GREEN): Implement bundled ESM artefact generation, package staging, and semantic-release GitHub asset upload."
    status: pending
  - id: ws3-refactor-docs-and-consumer-guidance
    content: "WS3 (REFACTOR): Tighten docs, import ergonomics, and read-only consumer guidance."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain from sdk-codegen through smoke:dev:stub."
    status: pending
  - id: ws5-adversarial-review
    content: "WS5: Architecture/security/config/test specialist review and findings closure."
    status: pending
  - id: ws6-doc-propagation
    content: "WS6: Propagate settled outcomes to roadmap, engineering docs, and relevant READMEs."
    status: pending
---

# Search SDK GitHub Release Asset Distribution

**Last Updated**: 2026-03-05  
**Status**: 📋 READY (current)  
**Scope**: Deliver a release-grade, self-contained ESM Search SDK artefact as a GitHub release asset, so downstream repositories can consume it without npm publishing.

---

## Context

The upstream Oak Open Curriculum API repository needs to consume
`@oaknational/oak-search-sdk` now, before it is integrated as a workspace in
this monorepo.

Current state evidence:

1. `packages/sdks/oak-search-sdk` is `private: true`, so no npm release path is
   currently available.
2. `tsup.config.ts` uses `bundle: false`; built output retains runtime imports
   to internal workspace packages (`@oaknational/result`,
   `@oaknational/sdk-codegen`, `@oaknational/logger`), so `dist/` is not
   self-contained.
3. Release automation already exists via semantic-release
   (`.github/workflows/release.yml` + `.releaserc.mjs`) but GitHub release
   assets are not configured.

### Problem Statement

We need an idiomatic distribution lane that:

1. Produces a self-contained ESM package suitable for direct external
   consumption.
2. Is attached automatically to every semantic-release GitHub release.
3. Preserves internal monorepo development ergonomics (fast local builds and
   current workspace dependency model).

### Option Appraisal

| Option | Summary | Why Not / Why Yes |
|---|---|---|
| A | Publish `@oaknational/oak-search-sdk` directly to npm now | Not required for current need; adds package governance and release-policy overhead immediately |
| B | Commit built artefacts to git and let downstream repo vendor them | Not idiomatic; brittle, noisy diffs, and drift-prone |
| C (Recommended) | Add a dedicated release-artefact lane that builds a bundled ESM tarball and uploads it through `@semantic-release/github` assets | Meets immediate need with minimal governance overhead; keeps semantic-release as single release control-plane |

**Recommendation**: adopt Option C now, keep npm publication as a later
promotion step when package governance is ready.

---

## Design Principles

1. **Single release source of truth** — semantic-release remains the authority
   for tags, notes, and attached artefacts.
2. **Dual build lanes, clear purpose** — keep current unbundled build for
   monorepo development; add a release-only bundled lane for external
   distribution.
3. **Consumer safety by contract** — provide explicit retrieval-first import
   guidance and enforce runtime privilege via Elasticsearch API-key scopes.
4. **No compatibility wrappers** — expose intentional package exports (including
   retrieval-focused subpath), not ad hoc downstream shims.

**Non-Goals** (YAGNI):

- npm publication of the Search SDK in this phase
- changing search runtime behaviour or retrieval logic
- introducing a separate admin-disabled build variant
- coupling release success to non-essential extra packaging channels

---

## WS1 — External Consumer Contract Tests (RED)

All tests MUST FAIL at the end of WS1.

> See [TDD Phases component](../../../templates/components/tdd-phases.md)

### 1.1 Release artefact contract test

**File**: `packages/sdks/oak-search-sdk/src/release-asset/release-asset-contract.integration.test.ts`

**Tests**:

- Running release-artefact build command emits exactly one tarball and one
  checksum file in a deterministic output directory.
- Unpacked artefact contains:
  - ESM runtime files (`dist/*.js`)
  - declarations (`dist/*.d.ts`)
  - package metadata and README
- Unpacked runtime files contain no `@oaknational/*` imports.

**Acceptance Criteria**:

1. Test compiles and references the planned release build command.
2. Test fails because release-asset tooling does not yet exist.
3. No existing SDK tests regress.

### 1.2 Export-surface contract test

**File**: `packages/sdks/oak-search-sdk/src/release-asset/release-exports.integration.test.ts`

**Tests**:

- Artefact root export resolves full SDK API (including `createSearchSdk`).
- Artefact `./retrieval` export resolves retrieval-focused entry
  (`createSearchRetrieval` + retrieval types) without importing admin types.

**Acceptance Criteria**:

1. Test compiles against staged artefact metadata.
2. Test fails before new export map exists.

### 1.3 Semantic-release asset wiring contract test

**File**: `packages/sdks/oak-search-sdk/src/release-asset/release-config.unit.test.ts`

**Tests**:

- `.releaserc.mjs` GitHub plugin contains asset entries for Search SDK tarball
  and checksum.
- Asset naming templates include `${nextRelease.gitTag}`.

**Acceptance Criteria**:

1. Test fails until release config is updated.
2. Test asserts paths and naming deterministically (no snapshots).

---

## WS2 — Bundle and Release Wiring (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1 Add release-only bundle pipeline

**Files**:

- `packages/sdks/oak-search-sdk/tsup.release.config.ts` (new)
- `packages/sdks/oak-search-sdk/package.json`

**Changes**:

1. Add release tsup config with `bundle: true` and explicit externalisation:
   - keep `@elastic/elasticsearch` as peer external
   - bundle internal workspace runtime deps (`@oaknational/*`)
2. Emit bundled artefacts to a dedicated output path (for example,
   `dist-release/`) to avoid colliding with the monorepo build lane.
3. Add scripts:
   - `build:release-bundle`
   - `build:release-asset`
   - `verify:release-asset`

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/oak-search-sdk build:release-bundle
rg -n "@oaknational/" packages/sdks/oak-search-sdk/dist-release
# Expected: no matches
```

### 2.2 Stage package metadata and tarball

**Files**:

- `packages/sdks/oak-search-sdk/scripts/build-release-asset.mjs` (new)
- `packages/sdks/oak-search-sdk/scripts/verify-release-asset.mjs` (new)
- `packages/sdks/oak-search-sdk/release/package.template.json` (new)

**Changes**:

1. Stage release package directory containing only distributable files.
2. Emit npm-installable tarball (for example, `oak-search-sdk.tgz`) plus
   `sha256` checksum.
3. Define export map including:
   - `.` (full SDK)
   - `./retrieval` (read-focused surface for downstream consumers)
4. Keep admin API exported in the full surface; read-only access is enforced by
   API-key privileges, not package mutation.

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/oak-search-sdk build:release-asset
pnpm --filter @oaknational/oak-search-sdk verify:release-asset
# Expected: exit 0, artefact contract satisfied
```

### 2.3 Wire semantic-release GitHub assets

**Files**:

- `.releaserc.mjs`
- `.github/workflows/release.yml`

**Changes**:

1. Ensure release workflow builds the Search SDK release artefact before
   `semantic-release`.
2. Configure `@semantic-release/github` `assets` to upload:
   - Search SDK tarball
   - checksum file
3. Use templated asset names with `${nextRelease.gitTag}`.

**Deterministic Validation**:

```bash
pnpm exec semantic-release --dry-run
# Expected: semantic-release validates GitHub assets config successfully
```

### 2.4 Downstream consumption proof

**Files**:

- `packages/sdks/oak-search-sdk/src/release-asset/external-consumer-smoke.integration.test.ts` (new)

**Changes**:

1. Add smoke proof that a fixture consumer can install the generated tarball
   and import retrieval API from ESM.
2. Keep this proof fully local (no network, no release upload required).

**Deterministic Validation**:

```bash
pnpm --filter @oaknational/oak-search-sdk test -- release-asset external-consumer-smoke
# Expected: exit 0
```

---

## WS3 — Documentation and Consumer Guidance (REFACTOR)

### 3.1 Search SDK README distribution section

**File**: `packages/sdks/oak-search-sdk/README.md`

**Changes**:

1. Document GitHub release-asset install path (tarball URL pattern).
2. Document retrieval-focused import path (`./retrieval`) for read-only
   integrations.
3. Clarify that admin operations remain exported; operational access must be
   enforced via Elasticsearch API-key scopes.

### 3.2 Release runbook updates

**File**: `docs/engineering/release-and-publishing.md`

**Changes**:

1. Add Search SDK release-asset section under semantic-release flow.
2. Document operator checks for artefact presence and checksum.
3. Keep npm publication status unchanged and explicit.

### 3.3 UX collection discoverability

**Files**:

- `.agent/plans/user-experience/engineering-end-users/README.md`
- `.agent/plans/user-experience/roadmap.md`

**Changes**:

1. Link this executable plan from engineering end-user boundary docs.
2. Reference it in Phase 1 engineering readiness evidence.

---

## WS4 — Quality Gates

> See [Quality Gates component](../../../templates/components/quality-gates.md)

```bash
pnpm clean
pnpm sdk-codegen
pnpm build
pnpm type-check
pnpm format:root
pnpm markdownlint:root
pnpm lint:fix
pnpm test
pnpm test:ui
pnpm test:e2e
pnpm smoke:dev:stub
```

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../../../templates/components/adversarial-review.md)

Run specialist reviews after implementation:

1. `architecture-reviewer-betty` — boundary and change-cost sanity check for
   release pipeline additions
2. `security-reviewer` — artefact integrity, checksum, and supply-chain
   concerns
3. `config-reviewer` — semantic-release and workflow config correctness
4. `test-reviewer` — release-contract test rigour and determinism

Document findings in this plan; create follow-up plan for blockers.

---

## Risk Assessment

> See [Risk Assessment component](../../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|---|---|
| Bundled artefact still leaks internal imports | Contract test (`no @oaknational/*` imports) blocks merge |
| semantic-release fails due missing asset path | Release-config unit test + dry-run validation |
| Artefact becomes too large for practical downstream use | Capture artefact size in verification script; set warning threshold and report drift |
| Downstream accidentally uses admin actions with privileged key | Provide retrieval-only import guidance and explicit least-privilege API-key documentation |
| Local and release build lanes diverge over time | Keep release build config small and test-backed; verify both lanes in CI gates |

---

## Foundation Alignment

> See [Foundation Alignment component](../../../templates/components/foundation-alignment.md)

Per-phase check-in questions:

1. Could this be simpler without compromising quality?
2. Are we keeping schema-derived types authoritative (no manual drift)?
3. Are we using TDD to prove external-consumer behaviour before implementation?

Compliance expectations at completion:

- Cardinal rule preserved (`sdk-codegen` remains source authority)
- No compatibility layers introduced
- All quality gates pass

---

## Documentation Propagation

> See [Documentation Propagation component](../../../templates/components/documentation-propagation.md)

Must update when work lands:

1. `packages/sdks/oak-search-sdk/README.md`
2. `docs/engineering/release-and-publishing.md`
3. `.agent/plans/user-experience/engineering-end-users/README.md`
4. `.agent/plans/user-experience/roadmap.md`
5. If release policy scope changes materially, evaluate ADR requirement and
   record decision in the completion note.

---

## Dependencies

**Blocking**:

1. Existing semantic-release workflow remains the only release authority.
2. Search SDK release bundle scripts must run without network side effects.

**Related Plans**:

1. `../../../developer-experience/future/sdk-publishing-and-versioning-plan.md`
   — future promotion path to formal package publishing
2. `../../../semantic-search/active/search-sdk-args-extraction.plan.md` —
   nearby search-SDK surface work that may influence final export ergonomics
