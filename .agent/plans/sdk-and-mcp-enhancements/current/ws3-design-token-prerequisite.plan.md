---
name: "WS3 Design Token Infrastructure Prerequisite"
overview: "Replace the temporary widget shell with the canonical MCP Apps React runtime and land the minimal two-workspace design-token foundation required before WS3 Phases 4-5."
todos:
  - id: ws1-red
    content: "WS1 (RED): Write failing tests for tier validation, CSS emission, workspace wiring, and widget CSS consumption."
    status: completed
  - id: ws2-green
    content: "WS2 (GREEN): Implement design-tokens-core, oak-design-tokens, the canonical widget runtime replacement, and the repo wiring that lets the widget consume package CSS."
    status: completed
  - id: ws3-refactor
    content: "WS3 (REFACTOR): Tighten package READMEs, build scripts, and plan/README references without widening scope."
    status: completed
  - id: ws4-quality-gates
    content: "WS4: Run focused workspace validation plus pnpm check and capture any follow-up before Phase 4 starts."
    status: completed
  - id: ws5-adversarial-review
    content: "WS5: Invoke design-system, config, test, and code reviewers; add MCP review only if token delivery changes app resource/CSP behaviour."
    status: completed
  - id: ws6-doc-propagation
    content: "WS6: Propagate settled outcomes to WS3 plans, collection indexes, widget docs, and continuity surfaces."
    status: completed
isProject: false
---

# WS3 Design Token Infrastructure Prerequisite

**Last Updated**: 2026-04-02
**Status**: 🟢 ACTIVE
**Scope**: Replace the temporary widget shell with the canonical MCP Apps React
runtime and establish the smallest viable DTCG-to-CSS token foundation needed
before WS3 Phases 4-5 build widget UI.

---

## Context

WS3 Phase 3 is now complete, including the non-UI host fallback proof. The next
product work is Phase 4 (curriculum-model view) and Phase 5 (interactive
user-search view). This prerequisite started from a repo state with no
`packages/design/` workspaces and only a temporary widget shell, so there was
no canonical package-level source for Oak brand tokens, theme selectors, or
CSS custom properties.

### Problem Statement

The repo accepted
[ADR-148](../../../../docs/architecture/architectural-decisions/148-design-token-architecture.md)
and the governance rules in
[docs/governance/design-token-practice.md](../../../../docs/governance/design-token-practice.md),
and the implementation prerequisite therefore had to create and replace all of
the following:

- `packages/design/design-tokens-core`
- `packages/design/oak-design-tokens`
- `pnpm-workspace.yaml` workspace inclusion for `packages/design/*`
- `turbo.json` hashing for token JSON/build inputs
- replacement of the temporary widget shell with the canonical
  `useApp(...)` + `onAppCreated` + `useHostStyleVariables(...)` runtime
- removal of temporary local brand values from the widget in favour of a token
  package import

Phases 4-5 should not invent permanent styling inside `widget/src/index.css`
while the canonical token delivery path is absent.

### Existing Capabilities

- ADR-148 already defines the token architecture: DTCG JSON, three tiers,
  `packages/design/`, and CSS custom-property delivery
- `docs/governance/design-token-practice.md` already defines light/dark theme
  expectations and the component → semantic → palette rule
- `apps/oak-curriculum-mcp-streamable-http/widget/` already has a Vite build
  that can inline imported CSS into `mcp-app.html`
- WS3 parent and Phase 4/5 plans already isolate the widget UI work that will
  consume the token package

---

## Design Principles

1. **DTCG JSON plus three-tier enforcement** — the source of truth stays in
   token JSON, and component tokens must never skip semantic tokens.
2. **CSS-only consumption for v1** — `@oaknational/oak-design-tokens` exports
   `dist/index.css`; the widget imports CSS rather than a runtime theming API.
3. **Keep v1 deliberately small** — support the curriculum-model and
   user-search widget alpha only; do not widen into a full design system or a
   Phase 4/5 feature build.
4. **Prefer simple in-repo tooling** — use small TypeScript build helpers inside
   `design-tokens-core`; do not introduce Style Dictionary unless a concrete
   blocker appears.
5. **Keep dependency direction clean** — the widget depends on
   `@oaknational/oak-design-tokens`; neither token package depends on
   `oak-components`.

**Non-Goals** (YAGNI):

- Add a CDN or CSP delivery path for tokens
- Add a runtime JavaScript theming layer
- Add automatic `prefers-color-scheme` handling in the prerequisite slice
- Rebuild Oak’s entire visual language before the first widget views exist
- Introduce `oak-components` as a dependency of either token workspace

---

## WS1 — Token Contracts and Failing Proofs (RED)

All tests MUST FAIL at the end of WS1.

> See [TDD Phases component](../../templates/components/tdd-phases.md)

### 1.1: Token build and tier-validation tests

**Tests**:

- `packages/design/design-tokens-core/src/*.unit.test.ts` — CSS emission for
  palette, semantic, and component tokens; explicit rejection of
  component-to-palette shortcuts
- `packages/design/oak-design-tokens/src/*.integration.test.ts` — generated
  `dist/index.css` includes `:root` and `[data-theme='dark']`
- `apps/oak-curriculum-mcp-streamable-http/widget/*.test.ts` or build-focused
  verification — widget can import package CSS, replace the scaffold with the
  canonical MCP Apps React runtime, and avoid permanent local brand values

**Acceptance Criteria**:

1. New tests compile and run from the intended workspaces
2. Failures point to the missing packages/build pipeline, not unrelated drift
3. The RED set proves the v1 contract: CSS output, tier enforcement, and
   widget-consumption wiring

---

## WS2 — Minimal Token Infrastructure (GREEN)

All tests MUST PASS at the end of WS2.

### 2.1: Create `@oaknational/design-tokens-core`

**Files**:

- `packages/design/design-tokens-core/package.json`
- `packages/design/design-tokens-core/src/**/*`

**Changes**:

- Add TypeScript helpers for reading DTCG JSON, validating tier direction, and
  emitting CSS custom properties
- Keep light theme on `:root` and dark overrides on `[data-theme='dark']`
- Export build-time helpers only; no runtime UI code

### 2.2: Create `@oaknational/oak-design-tokens`

**Files**:

- `packages/design/oak-design-tokens/package.json`
- `packages/design/oak-design-tokens/src/**/*`
- `packages/design/oak-design-tokens/dist/index.css`

**Changes**:

- Author the minimal Oak token set needed for the curriculum-model and
  user-search views
- Build importable CSS at `dist/index.css`
- Keep public surface CSS-only for v1

### 2.3: Wire the repo and widget consumer

**Files**:

- `pnpm-workspace.yaml`
- `turbo.json`
- `apps/oak-curriculum-mcp-streamable-http/package.json`
- `apps/oak-curriculum-mcp-streamable-http/widget/src/index.css`

**Changes**:

- Add both design workspaces to the workspace graph
- Add any token JSON/build inputs Turbo needs for deterministic caching
- Add `@oaknational/oak-design-tokens` as a dependency of the HTTP app
- Replace temporary widget brand values with a package CSS import

### 2.4: Replace the temporary widget shell

**Files**:

- `apps/oak-curriculum-mcp-streamable-http/widget/src/main.tsx`
- `apps/oak-curriculum-mcp-streamable-http/widget/src/App.tsx`
- `apps/oak-curriculum-mcp-streamable-http/widget/src/app-runtime-state.ts`

**Changes**:

- Rewrite the placeholder shell into a live `@modelcontextprotocol/ext-apps/react`
  app using `useApp(...)`
- Register runtime lifecycle handlers in `onAppCreated`
- Use `useHostStyleVariables(app, app?.getHostContext())` for theme/style sync
  while keeping Oak typography in the token package
- Remove scaffold-only copy and leave the widget as a thin consumer of package
  CSS plus structural layout rules

**Deterministic Validation**:

```bash
# Token core tests
pnpm --filter @oaknational/design-tokens-core test

# Token package build
pnpm --filter @oaknational/oak-design-tokens build

# Widget consumer build
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build:widget
```

---

## WS3 — Scope Guardrails and Documentation (REFACTOR)

### 3.1: Package and workspace documentation

- Add succinct READMEs for the two token workspaces
- Document the CSS import path and the v1 non-goals
- Record any no-change rationale if ADR-148 and the governance doc stay
  accurate without edits

### 3.2: WS3 propagation

- Update WS3 parent and Phase 4/5 plans to consume the token package path, not
  local permanent brand values, and to treat shell replacement as completed in
  this prerequisite
- Keep the current plan as the authoritative execution surface for token work;
  do not restate implementation detail across other documents

---

## WS4 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

Run the required gates one at a time while iterating. When aggregate
readiness proof is needed, use:

```bash
pnpm check
```

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Required reviewers:

- `design-system-reviewer`
- `config-reviewer`
- `test-reviewer`
- `code-reviewer`

Conditional reviewer:

- `mcp-reviewer` if token delivery changes app resource registration, MIME, or
  CSP behaviour

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| Scope expands from prerequisite tokens into a full design-system rewrite | Limit v1 to the token set needed for the two widget views and keep extra requests in follow-up plans |
| Theme or tier rules drift into ad hoc CSS inside the widget | Make the widget import `@oaknational/oak-design-tokens` and test tier validation in `design-tokens-core` |
| Tooling complexity grows faster than value | Start with simple TypeScript helpers; only introduce Style Dictionary if a concrete blocker is documented |
| Token package couples back to component libraries | Keep `oak-components` reference-only and enforce package dependency direction in review |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

This plan stays aligned by:

- keeping schema-like token data in DTCG JSON rather than ad hoc CSS literals
- making the widget a thin consumer of package CSS, not the owner of token
  logic
- using TDD for build helpers, theme selectors, and integration wiring
- avoiding compatibility layers, runtime theming shims, and cross-package
  shortcuts

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

Before this plan closes, update:

- `ws3-widget-clean-break-rebuild.plan.md`
- `ws3-phase-4-curriculum-model-view.plan.md`
- `ws3-phase-5-interactive-user-search-view.plan.md`
- collection `README.md`, `current/README.md`, and `roadmap.md`
- widget build/development docs if the import path or local workflow changes

---

## Consolidation

After this plan is complete and the quality gates pass, run `/jc-consolidate-docs`
to graduate the settled token-delivery guidance, rotate the napkin, and keep
the practice records aligned.

---

## Dependencies

**Blocking**:

- `active/ws3-phase-3-canonical-contracts-and-runtime.plan.md` — now complete;
  Phase 4/5 can move once this prerequisite exists
- `../archive/completed/ws3-merge-main-into-branch.plan.md` — merge-main
  closure, security hardening, and consolidation are complete; this
  prerequisite is the next queued WS3 delivery step

**Related Plans**:

- `../active/ws3-widget-clean-break-rebuild.plan.md` — parent orchestration
- `../active/ws3-phase-4-curriculum-model-view.plan.md` — first UI consumer
- `../active/ws3-phase-5-interactive-user-search-view.plan.md` — second UI
  consumer
- `output-schemas-for-mcp-tools.plan.md` — separate current-lane follow-on that
  should remain independent of token delivery
