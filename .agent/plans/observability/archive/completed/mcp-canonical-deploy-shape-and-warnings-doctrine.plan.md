---
name: "MCP Post-Root-Green Follow-Through"
status: completed
status_reason: >
  Repo-owned corrective work for this bounded lane is complete. The
  strict sitemap/env/package/runtime fixes landed on 2026-04-23 and the
  remaining manual validation stages were explicitly externalised to the
  owner, so they no longer keep this plan active.
overview: >
  Closure record for the bounded repo-owned corrective lane that
  followed the root-green rerun: strict sitemap validation restored,
  wrapper/fallback drift removed, the configured Sentry build gate
  aligned to canonical env loading, and the repo left ready for
  owner-run validation stages that remain outside this plan.
parent_plan: "../../active/sentry-observability-maximisation-mcp.plan.md"
related_plans:
  - "../../future/mcp-http-runtime-canonicalisation.plan.md"
supersedes:
  - "../superseded/mcp-canonical-deploy-shape-and-warnings-doctrine.plan.pre-bounded-follow-through-2026-04-23.md"
branch: "feat/otel_sentry_enhancements"
depends_on:
  - "../../active/sentry-observability-maximisation-mcp.plan.md"
todos:
  - id: remove-principle-breaking-follow-through
    content: "Remove the EYFS special treatment, the `oaksearch` wrapper, the JS-specific lint override path, the partial export-surface workaround set, and any other compatibility-layer decisions introduced in this lane."
    status: completed
    priority: next
  - id: define-fixed-export-surface-contract
    content: "Write and apply one fixed package export-surface contract across internal workspaces: ESM only, no CJS, `exports` authoritative, no partial/per-workspace improvisation."
    status: completed
    priority: next
  - id: rerun-strict-sitemap-validation
    content: "Rerun `pnpm -F @oaknational/sdk-codegen scan:sitemap` and `pnpm sdk-codegen` after removing fallback logic, then trace and fix the actual cause of the five invalid programme URLs with no EYFS special casing."
    status: completed
    priority: next
  - id: resolve-multiple-projects-diagnostic
    content: "Root-cause and fix the `Multiple projects found ...` lint diagnostic structurally in `@oaknational/oak-curriculum-mcp-streamable-http`."
    status: completed
    priority: next
  - id: resolve-vercel-oaksearch-bin-shape
    content: "Fix the actual package/install/build contract behind the Vercel `oaksearch` bin-link warning without wrappers, JS shim entrypoints, or compatibility layers."
    status: completed
    priority: next
  - id: fix-sentry-env-loading-contract
    content: "Fix the configured-arm Sentry build gate so it loads its canonical env source honestly; the app-local `.env.local` currently contains `SENTRY_AUTH_TOKEN`, but the command path does not load it."
    status: completed
    priority: next
  - id: add-built-code-product-proof
    content: "Add one realistic product proof that executes built artefact code only, to complement source-first dev-script execution."
    status: completed
    priority: next
  - id: rerun-authoritative-validation
    content: "Rerun the full repo-root validation sequence after the reset, plus the strict sitemap scrape and the built-code proof."
    status: completed
  - id: handoff-to-owner-directed-preview
    content: "Close the repo-owned corrective lane and hand remaining manual validation stages to the owner without claiming them from this plan."
    status: completed
---

# MCP Post-Root-Green Follow-Through

**Last Updated**: 2026-04-23  
**Status**: 🟢 COMPLETED — the bounded repo-owned corrective lane is
closed; manual preview/validation stages remain owner-handled  
**Scope**: Strict repo-owned follow-through before any owner-directed
preview work

## Completion Note

This plan is archived as completed because the repo-owned corrective
work landed on 2026-04-23. The remaining preview `/healthz`,
preview-release, and preview-traffic validation stages were then
explicitly externalised by owner direction, so they no longer belong in
an active repo plan.

## Reset Context

The previous rerun through `pnpm format:root` is still useful evidence
about what executed, but it cannot be treated as the final handoff
state for this lane because it depended on changes that violate the
repository principles:

1. EYFS-specific fallback logic was added to sitemap validation.
2. A CLI wrapper was added for `oaksearch`.
3. JS-specific lint overrides were introduced.
4. The package export-surface changes were partial rather than a single
   repo-wide contract.
5. The clean/generation assumptions drifted away from the deliberate
   workspace behaviour.

Those decisions turned real problems into compatibility-layer
behaviour. This plan resets the lane so the next session fixes the
actual problems instead.

Two concrete facts from the previous run remain important:

1. `pnpm -F @oaknational/sdk-codegen scan:sitemap` **was** rerun.
2. `apps/oak-curriculum-mcp-streamable-http/.env.local` contains
   `SENTRY_AUTH_TOKEN`, but
   `pnpm -F @oaknational/oak-curriculum-mcp-streamable-http build:sentry:configured`
   still failed because the command path did not load that env file.

Per owner direction, this plan still stops at the repo-owned boundary.
Preview deployment checks, `/healthz`, and preview/Sentry proof remain
manual owner-directed steps after this plan leaves the repo in an
honest pre-preview state.

## Problem Statement

### 1. Strict URL validation was weakened

The five invalid programme URLs are still a real issue. The previous
implementation did not fix them; it introduced EYFS-specific fallback
handling that converted the mismatch into accepted validation.

That makes the current green `pnpm sdk-codegen` result non-authoritative
for this question, because the check was no longer strict.

The next session must restore a strict validator, rerun the sitemap
scrape, and determine the actual defect at source. No EYFS special
treatment is allowed in the validator.

### 2. The package export contract is inconsistent across workspaces

The previous implementation moved towards source-first dev execution,
but did it piecemeal. Some internal packages now expose a
`development` condition while others follow different shapes, and there
is no single fixed doctrine for package surfaces.

This is architecturally wrong. The repo needs one constant package
export-surface contract across internal workspaces:

- ESM only
- no CJS / no `require`
- `exports` is the authoritative public surface
- no workspace-by-workspace improvisation
- no partial rollout of special conditions

If source-first development resolution is part of the contract, it must
be part of the contract everywhere relevant. If it is not, it should
not exist anywhere.

### 3. Source-first dev execution and built-code proof were conflated

Making dev scripts run source code consistently is directionally good.
What is still missing is one explicit product proof that executes built
artefact code only.

The repo needs both:

1. a coherent source-first dev contract, and
2. one realistic built-code-only proof so we know product artefacts are
   actually sound after `pnpm build`.

### 4. The `oaksearch` package/install shape is still wrong

The Vercel warning is real:

`ENOENT ... @oaknational/search-cli/dist/bin/oaksearch.js`

The previous response added a wrapper. That is precisely the wrong type
of fix: a compatibility layer around the actual install/build contract
problem.

The next session must fix the actual `oaksearch` package shape so that
dev execution and built execution are each honest, with no JS shim
entrypoint and no wrapper layer.

### 5. The Sentry configured-arm gate has an env-loading defect

The configured-arm Sentry gate currently fails in a shell without an
exported token even though the app-local `.env.local` contains
`SENTRY_AUTH_TOKEN`.

That means the current command contract is incomplete. If this is a
repo-owned local gate, it must load its canonical env source honestly
or define an explicit invocation contract that matches reality. The
problem is not the token's absence in the repo-local app config; the
problem is that the script is not loading it.

### 6. The MCP HTTP lint warning still needs a structural fix

The `Multiple projects found ...` diagnostic still needs a truthful,
structural resolution. This item survives unchanged from the previous
plan shape.

## Design Principles

1. **No fallbacks, no wrappers, no overrides** — no EYFS special
   treatment, no CLI wrapper, no JS lint override escape hatch, no
   compatibility layers.
2. **Strict validators stay strict** — if the sitemap mismatch is real,
   the validator must surface it plainly rather than normalising it.
3. **One export contract, everywhere** — internal workspaces need one
   fixed ESM-only public-surface doctrine.
4. **Deliberate clean/generation behaviour stays deliberate** — fixes
   must work with the intended clean/regeneration contract, not by
   weakening it.
5. **Source-first dev and built-code proof are different concerns** —
   support both, but do not blur them.
6. **TS source, ESM output** — new repo-owned fixes in this lane should
   be TypeScript source, with JavaScript only as emitted build output.
7. **Owner-directed preview boundary is explicit** — this plan ends at
   an honest repo-owned handoff.

**Non-Goals**:

- Preview deployment, `/healthz`, or any owner-directed preview check
- Manual Sentry preview evidence capture
- Monitor setup or uptime validation operations
- Broader MCP HTTP runtime canonicalisation

## Resolution Plan

### Phase 0 — Reset the Bad Decisions

#### Task 0.1 — Remove the principle-breaking follow-through changes

**Acceptance Criteria**:

1. EYFS fallback logic is removed.
2. The `oaksearch` wrapper is removed.
3. The JS-specific lint override path is removed.
4. Any other compatibility-layer decisions introduced in this lane are
   removed rather than extended.
5. No replacement shims are added.

**Deterministic Validation**:

```bash
rg -n "fallback|wrapper|override" \
  packages/sdks/oak-sdk-codegen/code-generation/typegen/routing \
  apps/oak-search-cli \
  apps/oak-curriculum-mcp-streamable-http
# Expected: no newly introduced compatibility-layer path remains as the
# answer to these four bounded problems
```

### Phase 1 — Re-establish the Architecture

#### Task 1.1 — Define one fixed package export-surface contract

**Acceptance Criteria**:

1. The repo documents one fixed export-surface doctrine for internal
   packages.
2. The doctrine is ESM only.
3. `exports` is the authoritative public surface.
4. There is no `require` / CJS branch.
5. There is no partial rollout of special conditions across workspaces.
6. Apps do not pretend to be libraries just to patch over local
   execution problems.

**Deterministic Validation**:

```bash
rg -n '"exports"|\"main\"|\"types\"|\"type\": \"module\"|\"require\"' \
  packages apps -g 'package.json'
# Expected: one deliberate, repo-wide ESM contract shape with no CJS
# branch and no accidental per-workspace drift
```

#### Task 1.2 — Preserve the deliberate clean/regeneration contract

**Acceptance Criteria**:

1. The fix path works with the intended clean/regeneration behaviour.
2. Generated-source deletion used to prevent stale artefacts is not
   relaxed merely to make source execution easier.
3. Any previous clean-contract drift is removed or justified against the
   documented contract.

### Phase 2 — Re-run Strict Diagnosis at Source

#### Task 2.1 — Rerun the sitemap scrape under a strict validator

**Acceptance Criteria**:

1. `pnpm -F @oaknational/sdk-codegen scan:sitemap` is rerun after the
   fallback code is removed.
2. `pnpm sdk-codegen` is rerun with no EYFS special treatment.
3. The result names the actual cause of the five invalid programme
   URLs.
4. The repo response fixes the actual problem at source or leaves the
   strict mismatch visible; it does not encode an EYFS exception.

**Deterministic Validation**:

```bash
pnpm -F @oaknational/sdk-codegen scan:sitemap
pnpm sdk-codegen
# Expected: strict output with no EYFS validation fallback path
```

#### Task 2.2 — Root-cause `Multiple projects found ...`

**Acceptance Criteria**:

1. The exact emitting tool/config path is named.
2. The warning reproduces both from the workspace and from the repo
   root.
3. The landed fix is structural.
4. No suppressive workaround is used unless it is itself the explicit
   architectural contract.

**Deterministic Validation**:

```bash
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http lint
pnpm lint:fix
# Expected: both surfaces are aligned and the warning is gone for a
# structural reason
```

#### Task 2.3 — Fix the actual `oaksearch` package/install/build contract

**Acceptance Criteria**:

1. The Vercel bin-link warning producer is named exactly.
2. The fix is at the actual package/install/build boundary.
3. No wrapper, shim, adapter, or compatibility entrypoint is used.
4. No JS-specific source override is introduced.
5. Dev execution and built execution are both honest under the chosen
   contract.

**Deterministic Validation**:

```bash
pnpm build
test -f apps/oak-search-cli/dist/bin/oaksearch.js && echo built || echo missing
# Expected: built product shape is correct without requiring a wrapper
```

#### Task 2.4 — Fix the Sentry gate env-loading contract

**Acceptance Criteria**:

1. The configured-arm gate loads its canonical env source honestly.
2. The app-local `.env.local` case is handled by contract rather than
   by assuming the parent shell already exported the token.
3. The gate still fails fast when the canonical source truly lacks the
   required token.
4. The gate continues to prove the configured arm and not the disabled
   or skipped arm.

**Deterministic Validation**:

```bash
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http build:sentry:configured
# Expected: the command sees the canonical local token source when it is
# present, and still fails honestly when the token is genuinely absent
```

### Phase 3 — Prove Both Execution Modes

#### Task 3.1 — Keep source-first dev execution under the fixed contract

**Acceptance Criteria**:

1. Dev scripts use source code consistently under the repo-wide export
   contract.
2. The contract is the same across the relevant workspaces.
3. The implementation does not rely on one-off workspace exceptions.

#### Task 3.2 — Add one built-code-only product proof

**Acceptance Criteria**:

1. One repo-owned test or smoke command executes realistic built
   product code only.
2. The proof uses built artefacts after `pnpm build`, not `tsx` or
   source-first resolution.
3. The proof is part of the authoritative validation story.

**Deterministic Validation**:

```bash
pnpm build
# followed by one built-code-only product proof command
```

### Phase 4 — Rerun Authoritative Validation and Hand Off

#### Task 4.1 — Rerun authoritative validation after the reset

**Acceptance Criteria**:

1. The principle-breaking follow-through changes are gone.
2. The export-surface contract is fixed and uniform.
3. The sitemap scrape has been rerun under a strict validator.
4. The `Multiple projects found ...` diagnostic is fixed structurally.
5. The `oaksearch` install/build contract is fixed without wrappers.
6. The configured-arm Sentry gate loads env honestly and passes.
7. One built-code-only product proof passes.
8. The full repo-root validation sequence passes again.
9. Continuity surfaces point to owner-directed preview work rather than
   claiming preview proof from this plan.

**Deterministic Validation**:

```bash
pnpm secrets:scan:all
pnpm clean
pnpm test:root-scripts
pnpm -F @oaknational/sdk-codegen scan:sitemap
pnpm sdk-codegen
pnpm build
# plus one built-code-only product proof
pnpm type-check
pnpm doc-gen
pnpm lint:fix
pnpm test
pnpm test:widget
pnpm test:e2e
pnpm test:ui
pnpm test:a11y
pnpm test:widget:ui
pnpm test:widget:a11y
pnpm smoke:dev:stub
pnpm subagents:check
pnpm portability:check
pnpm markdownlint:root
pnpm format:root
pnpm -F @oaknational/oak-curriculum-mcp-streamable-http build:sentry:configured
```

## Acceptance

This plan is complete only when:

- the bad decisions from the previous follow-through have been removed;
- the repo has one fixed ESM-only export-surface contract across
  internal workspaces;
- the five invalid programme URLs are rechecked under a strict
  validator with no EYFS special treatment;
- the MCP HTTP lint warning is fixed structurally;
- the `oaksearch` install/build problem is fixed without wrappers or JS
  override paths;
- the Sentry configured-arm gate loads its canonical env source
  honestly;
- one built-code-only product proof passes;
- the authoritative repo-root sequence passes again;
- the handoff point is clear: repo-owned follow-through complete,
  owner-directed preview validation next.
