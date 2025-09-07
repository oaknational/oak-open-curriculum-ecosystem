# Standardising Architecture – Part 2 Implementation Plan (Core, Providers, Explicit Injection)

Strategic context: This document is the detailed execution plan for Part 2 and complements the roadmap in `.agent/plans/standardising-architecture-high-level-plan.md`. It assumes Part 1 (mechanical normalisation) has landed per `.agent/plans/standardising-architecture-part1.md`.

This file intentionally contains no code snippets that belong in scripts; it focuses on intent, invariants, phases, acceptance, and verifiable outcomes.

British spelling applies throughout (behaviour, normalisation, rationalisation, etc.).

Status: IN PROGRESS. Working branch: `feat/standardising_architecture_part_2`.

Completed so far:

- Mechanical deconfliction rename applied in both servers: `src/tools/tools` → `src/tools/runtime`, all imports updated.
- Quality gates PASS after rename: format, type‑check, lint, test, build.
- Baseline detection inventory captured (adaptive env in `histos-env`; direct `process.env` usage in both servers).
- ESLint boundary snapshot captured (root `eslint-rules/boundary-rules.ts` and phenotype configs).
- Core package scaffolded at `packages/core/mcp-core` exposing minimal `createRuntime` and provider contracts (no provider imports). Build PASS.
- Added configuration file `ecosystem/psycha/oak-notion-mcp/src/config/runtime.json`; server wiring now reads config for logger level/name and server identity. Detection logic removed from wiring.
- Barrel rationalisation: renamed core registry interface to `CoreToolRegistry` to avoid schema collisions; imports/exports updated and lint PASS.
- Providers: scaffolded `packages/providers/mcp-providers-node` with minimal Node clock, console logger, and in‑memory storage; unit tests added; monorepo gates PASS.
- Provider contracts: shared helper added at `@oaknational/mcp-core/testing/provider-contract`; consumed by Node providers with unit + integration tests — PASS.
- Notion server wiring refined: static logger import (no require), minimal runtime config validation via `validateRuntimeConfig`, runtime composed via core factory; all workspaces build PASS after correcting alias policy.
- Documentation: added `docs/architecture/provider-contracts.md` and `docs/architecture/greek-ecosystem-deprecation.md`; updated core/providers READMEs.

- Workspace taxonomy progress (mechanical):
  - Apps: `ecosystem/psycha/oak-notion-mcp` → `apps/oak-notion-mcp` (gates PASS), `ecosystem/psycha/oak-curriculum-mcp` → `apps/oak-curriculum-mcp` (lint PASS; tests/build pending install relink).
  - Libs: `ecosystem/histoi/{histos-env,histos-logger,histos-storage,histos-transport}` → `packages/libs/{env,logger,storage,transport}` (gates PASS).
  - Orphan tissue identified for archival: `ecosystem/histoi/histos-runtime-abstraction` (not referenced).
  - Top-level `ecosystem/` directory removed; residual logs archived under `archive/` (DONE).

Primary objective emphasis:

- The central outcome of Part 2 is the complete removal of the Greek‑themed architecture from active code, directories, and working documentation. Replace with standard, intent‑revealing taxonomy and names: `apps/`, `packages/core`, `packages/libs`, `packages/sdks`. Only a single reference document may remain: `docs/architecture/greek-ecosystem-deprecation.md`.
  - Concretely: replace runtime interfaces imported from `@oaknational/mcp-moria` with neutral exports from `@oaknational/mcp-core` (compat surface), then remove the legacy `ecosystem/moria/moria-mcp` workspace.

---

## 1. Intent & Impact

- Intent: Decouple runtime concerns via explicit provider injection around a shared platform‑agnostic core while enforcing strict architectural boundaries and import hygiene. Replace runtime auto‑detection with configuration.
- Impact sought:
  - Clear separation of concerns (core vs providers vs server app wiring)
  - Predictable configuration‑driven behaviour (no implicit detection)
  - Stronger purity boundaries enforced by lint rules
  - Improved testability via contract tests and provider matrix

---

## 2. Scope & Non‑Goals

In scope (Part 2):

- Introduce `@oaknational/mcp-core` package containing interfaces, pure utilities, and a factory for runtime composition.
- Implement provider modules (Node, Cloudflare) that implement the core contracts.
- Replace detection logic with configuration‑driven selection (e.g. `src/config/runtime.json`).
- Refactor server bootstrap to dependency injection (construct runtime via core factory and pass into tools/integrations).
- Enforce strict import hygiene with eslint-plugin-import-x (alias‑only cross‑boundary imports; no relative parent imports; no internal modules beyond approved public subpaths).
- Mechanical deconfliction rename: `src/tools/tools` → `src/tools/runtime` with import updates. (COMPLETED)
- Barrel rationalisation and naming clarity (e.g., export runtime registry as `CoreToolRegistry`; keep schema types local).

Non‑Goals (branch focus):

- Behaviour changes or feature work. Part 2 primarily standardises naming and boundaries to improve onboarding and maintainability. Any feature drift is unacceptable and must be blocked.

Out of scope:

- Non-essential feature work unrelated to provider/core separation.
- Broad performance optimisation (measure first; limited micro‑optimisations only if indicated by benchmarks).

Note: Coding work in Part 2 must follow TDD with Vitest (repo standard). Documentation work is explicitly exempt from TDD.

---

## 3. Invariants / Guardrails

1. Configuration (not detection) selects providers / runtime.
2. The core package must not import providers (one‑way dependency).
3. Strict import hygiene (import‑x):
   - Alias‑only across boundaries
   - `no-relative-parent-imports`
   - `no-internal-modules`, except explicitly approved public subpaths
4. No behavioural regressions across providers: provider contract tests must pass equivalently.
5. British spelling in new/updated textual artefacts.
6. Prefer smaller, atomic modules and functions with no side effects.
7. For TS/Node:
   - Use Vitest for tests
   - Use `tsx` for executing TypeScript scripts
   - Do not use `any`
   - Prefer type guards over type assertions

---

## 4. Target State

- `packages/core/mcp-core/` (publish name: `@oaknational/mcp-core`)
  - Exposes interfaces, types, and pure utilities.
  - Provides a factory: `createRuntime(providers)` returning `{ logger, storage, clock, … }`.
  - Contains no provider imports.
  - Provides a temporary compatibility export surface for runtime interfaces currently sourced from `@oaknational/mcp-moria` to enable a mechanical switch without behavioural drift.
- Providers:
  - `providers/node` and `providers/cloudflare` modules implementing the same contracts.
  - Node provider present (clock/logger/storage) with unit tests; Cloudflare provider queued.
  - Selected exclusively via configuration file (e.g., `src/config/runtime.json`).
- Server wiring:
  - `src/app/wiring.ts` reads config, composes runtime via core factory, and prepares for injection into `src/tools/*` and `src/integrations/*`. (Factory composition complete; injection deferred to avoid behaviour drift)
- Lint boundaries:
  - Core cannot depend on providers.
  - Tools/integrations consume only injected runtime or public core interfaces.
  - Alias‑only cross‑package imports.
- No Greek‑themed tokens remain anywhere in active code or docs. Directory layout is `apps/*`, `packages/core/*`, `packages/libs/*`, `packages/sdks/*`. The `ecosystem/*` tree is removed from active code (archived if needed).
- Mechanical rename applied:
  - `src/tools/tools` → `src/tools/runtime` with updated imports. (COMPLETED)
- Barrel rationalisation:
  - Avoid layered collisions; clarify names (e.g., `CoreToolRegistry` for runtime registry types; schema/types kept local).

---

## 5. Quality Gates (Shared)

Run from the repository root once per gate (single invocation; wait for completion). Run at sensible intervals and before merge:

- `pnpm format`
- `pnpm type-check`
- `pnpm lint`
- `pnpm test`
- `pnpm build`

Part 2 adds provider contract tests and (optionally) a small e2e matrix across providers.

---

## 6. Test Strategy (TDD)

- Red‑Green‑Refactor; test behaviours only (never implementation or types).
- Core (Moria): Unit tests only for pure interfaces/utilities/factory; no dependencies; co-located `*.unit.test.ts`.
- Providers (Histoi): Unit tests for pure functions; in‑process integration tests for assembly; all IO mocked; simple fakes only; `*.unit.test.ts` / `*.integration.test.ts`.
- Psycha (Wiring): In‑process integration tests for dependency assembly; no process/network calls; simple fakes; `*.integration.test.ts`.
- E2E: Optional stdio smoke path; off by default (side effects/costs).
- No type assertions; prefer type guards and proper types in code and tests.

---

## 7. ESLint & Import Hygiene

- Adopt strict `eslint-plugin-import-x` configuration:
  - Enforce alias‑only cross‑boundary imports
  - Disallow `../` parent imports across boundaries
  - Forbid `no-internal-modules` except approved public subpaths
- Maintain phenotype boundary rules from Part 1; remove legacy duplicates only after Part 2 stabilises.

Alias policy clarification (per high-level plan):

- Reserve `@oaknational/*` exclusively for published packages; do not use it as an internal alias.
- Use internal `@workspace/*` aliases for cross-workspace imports only. Prefer relative imports for intra-package paths.
- For intra-repo TypeScript sources, omit `.js` in import specifiers. Keep `.js` suffix only for deep ESM imports from external packages when required by the runtime/bundler.

Snapshot (captured):

- Central boundaries in `eslint-rules/boundary-rules.ts` enforce `tools` ↔ `integrations` isolation.
- Phenotype configs import central rules; strict `no-relative-parent-imports` and `no-internal-modules` remain OFF pending alias adoption.

Aliases (internal workspace scope; distinct from publish scope):

- Reserve `@oaknational/*` for published packages only.
- Introduce `@workspace/*` aliases in `tsconfig.base.json`:
  - `@workspace/apps/*` → `apps/*/src/*`
  - `@workspace/core/*` → `packages/core/*/src/*`
  - `@workspace/libs/*` → `packages/libs/*/src/*`
  - `@workspace/sdks/*` → `packages/sdks/*/src/*`

Residual token set (must be eradicated from active code/docs; scan at PR time):

- psycha, psychon, chorai, chora, aither, stroma, phaneron, organa, moria, histoi, eidola, morphai, krypton, kanon, kratos, nomos, systema (and plurals/variants).

---

## 8. Risks & Mitigations

| Risk                                      | Mitigation                                             | Signal                                |
| ----------------------------------------- | ------------------------------------------------------ | ------------------------------------- |
| Provider leakage into core                | Interface segregation; lint boundaries; contract tests | No core→provider imports; tests pass  |
| Behaviour divergence between providers    | Shared contract test suite                             | Equal pass set across providers       |
| Config sprawl / ambiguity                 | Minimal config schema, ownership documented            | Stable minimal config footprint       |
| Performance overhead from indirection     | Benchmark before/after; optimise only if indicated     | Acceptable latency and resource usage |
| Ambiguous ownership                       | CODEOWNERS, package READMEs with roles                 | Clear ownership, fewer review loops   |
| Rename fallout (`tools/tools` → runtime)  | Mechanical codemod + gates; idempotency check          | Zero or minimal diffs; gates green    |
| Residual Greek tokens post‑rename         | Add PR‑time grep gate; delete/rename directories       | Grep clean except reference doc       |
| Curriculum app move fallout (tests/build) | Re‑link workspace (`pnpm install`); fix local paths    | Lint green; tests/build green         |
| Moria removal breaks imports              | Introduce `mcp-core` compat exports; codemod imports   | Type‑check green after rewrite        |

---

## 9. Reporting & Acceptance Criteria

Report artefacts (append to Part 1 report or add a Part 2 section):

- Provider contract test summary per provider
- Lint boundary verification output (no violations)
- Config schema and example (`src/config/runtime.json`)
- Evidence of removal of detection logic
- Rename application summary (`tools/tools` → `tools/runtime`), import rewrite counts
- Barrel rationalisation notes (collisions avoided; naming clarified)
- Export surface parity report (baseline vs post) with empty diff
- Residual token scan report confirming only the single pointer document remains: `docs/architecture/greek-ecosystem-deprecation.md`
- Workspace taxonomy report: lists of moved directories (apps/libs), archived tissues, and removal of `ecosystem/moria/moria-mcp` after import rewrite.
  - Confirmation that top-level `ecosystem/` directory has been removed; any historical assets live under `archive/`.

Acceptance (Part 2):

1. Core adopted; providers injected explicitly via config; no detection logic remains.
2. Strict import‑x boundary rules active (alias‑only, no parent relatives, no internal modules beyond approved public subpaths).
3. `src/tools/tools` renamed to `src/tools/runtime` with imports updated.
4. Provider contract tests pass for all providers; e2e smoke tests pass.
5. Build, lint, type‑check, and test gates green monorepo‑wide.
6. Documentation updated (core README, provider READMEs, architecture pointers). Legacy narratives archived; only the deprecation pointer remains.
7. Export surface parity preserved (baseline vs post equal; `default` treated separately).
8. Greek ecosystem architecture fully removed from active code/comments/imports/paths (tokens such as `psycha`, `psychon`, `chorai`, `chora`, `organa`, `moria`, `histoi`, `eidola`, `aither`, `stroma`, `phaneron`, `morphai`, `krypton`, `kanon`, `kratos`, `nomos`, `systema`). A single reference document remains explaining what it was and why it was removed (location: `docs/architecture/greek-ecosystem-deprecation.md`).
9. Imports rewritten from `@oaknational/mcp-moria` to `@oaknational/mcp-core` compat; `ecosystem/moria/moria-mcp` removed from workspace.
10. The top‑level `ecosystem/` directory is removed from the repository after moves and archival; only `apps/` and `packages/` remain. Any legacy materials are placed under `archive/`.

Abort conditions (Part 2 execution):

- Export parity diff non‑empty.
- Collision during migration.
- Idempotency re‑run produces planned operations.
- New boundary lint failures after duplication/activation.

---

## 10. Grounding & Core References

- Read and follow `GO.md` (primary operational guidance: grounding, TODO structuring, quality gates, deep thinking). For this plan and future sub‑plans, replace any “review agent” mentions with self‑reviews.
- Read `.agent/directives-and-memory/AGENT.md` and linked documents; align behaviour accordingly.
- High‑level context: `.agent/plans/standardising-architecture-high-level-plan.md`
- Part 1 plan: `.agent/plans/standardising-architecture-part1.md`

Terminology note: Chōra (singular) and Chōrai (plural) in prose; use ASCII `chorai` in path segments.

---

## 11. Phased Execution Plan (Concise)

1. Baseline capture for Part 2 (PARTIAL COMPLETE)

- Inventory existing detection logic and provider‑specific code paths. (COMPLETE)
- Snapshot current lint boundary config intended for Part 2 strictness. (COMPLETE)

2. Core extraction and publish (internal)

- Extract interfaces and pure utilities into `@oaknational/mcp-core`. (IN PROGRESS – MINIMAL CORE CREATED)
- Provide `createRuntime(providers)` factory. (DONE – MINIMAL RETURN OF PROVIDERS)
- Add temporary compat exports mirroring the `@oaknational/mcp-moria` runtime interfaces to enable import switch with zero behaviour change. (PLANNED)

3. Provider implementations

- Implement Node and Cloudflare providers against the core contracts.
- Ensure contract tests drive implementation.
  - Status: Node provider scaffolded (clock/logger/storage) with unit tests — PASS; Cloudflare provider pending.

4. Configuration introduction

- Define minimal `src/config/runtime.json` schema and ownership. (DONE – FILE ADDED; OWNERSHIP TO SERVER TEAM)
- Replace detection logic with config reading and validation. (DONE – CONFIG READ + MINIMAL VALIDATION IN WIRING)

5. Server DI refactor

- Refactor `src/app/wiring.ts` to assemble runtime via core factory and inject into tools/integrations. (PARTIAL – RUNTIME COMPOSED; injection deferred to avoid behaviour drift)

6. Strict boundary enforcement

- Activate import‑x strict rules and phenotype boundaries.
- Fix violations; ensure alias‑only cross‑boundary usage.

7. Mechanical rename and barrels (RENAME COMPLETE)

- Apply `src/tools/tools` → `src/tools/runtime` rename and update imports. (COMPLETE)
- Rationalise barrels; clarify exported names (e.g., `CoreToolRegistry`). (PARTIAL – REGISTRY RENAMED)

8. Validation & reporting

Appendix: Workspace taxonomy and aliases (Queued mechanical)

- Rename workspace taxonomy (mechanical, tracked separately):
  - DONE: `ecosystem/psycha/oak-notion-mcp` → `apps/oak-notion-mcp`
  - DONE: `ecosystem/psycha/oak-curriculum-mcp` → `apps/oak-curriculum-mcp`
  - DONE: `ecosystem/histoi/{histos-env,histos-logger,histos-storage,histos-transport}` → `packages/libs/{env,logger,storage,transport}`
  - QUEUED: `ecosystem/histoi/histos-runtime-abstraction` → archive/
  - QUEUED: Replace imports from `@oaknational/mcp-moria` with `@oaknational/mcp-core` compat and remove `ecosystem/moria/moria-mcp` from workspace
  - `packages/oak-curriculum-sdk` → `packages/sdks/oak-curriculum-sdk` (naming only; already under packages)

- Full quality gates; provider matrix; reports updated.
- Greek ecosystem deprecation reference created and linked; residual token scan confirms only that single reference remains.

---

## 12. Executable TODO (GO.md‑Aligned)

Status legend: [✓ done] [→ in progress] [ ] pending

1. ACTION: Read GO.md and AGENT.md; extract directives specific to Part 2 (grounding, TODO structure, quality gates).  
   REVIEW: Self‑review that this plan follows GO.md and replaces review agents with self‑reviews.
2. ACTION: Draft minimal config schema for `src/config/runtime.json` and document ownership + defaults.  
   REVIEW: Self‑review schema minimality and clarity; confirm no detection logic needed.  
   QUALITY-GATE: Validate schema doc links and British spelling.
3. GROUNDING: read GO.md and follow all instructions; adjust the TODO list if needed.
4. ACTION: Define core package structure and public API (interfaces, utils, factory).  
   REVIEW: Self‑review purity (no provider imports) and API clarity.  
   QUALITY-GATE: `pnpm type-check` (core package only once created).
5. ACTION: Implement provider contract tests (shared suite).  
   REVIEW: Self‑review coverage and determinism; ensure parity checks across providers.  
   QUALITY-GATE: `pnpm test` for the shared suite (failing until providers exist is acceptable during development).
6. GROUNDING: read GO.md and follow all instructions.
7. ACTION: Implement Node provider to satisfy the contract tests.  
   REVIEW: Self‑review for boundary adherence and no core imports.  
   QUALITY-GATE: `pnpm test` (provider + core).
8. ACTION: Implement Cloudflare provider to satisfy the same contract tests.  
   REVIEW: Self‑review for boundary adherence and parity with Node.  
   QUALITY-GATE: `pnpm test` (matrix: node, cloudflare).
9. GROUNDING: read GO.md and follow all instructions.
10. ACTION: Introduce configuration reading/validation in `src/app/bootstrap.ts`; remove detection logic; wire DI via core factory.  
    REVIEW: Self‑review diff ensures removal of detection code and explicit config path.  
    QUALITY-GATE: `pnpm type-check` and `pnpm test` (smoke paths).
11. ACTION: Enforce strict import‑x rules (alias‑only cross‑boundary; no parent relatives; no internal modules beyond approved public subpaths).  
    REVIEW: Self‑review lint rule set and fixes; document any approved public subpaths.  
    QUALITY-GATE: `pnpm lint` (expect clear baseline, then green).
12. GROUNDING: read GO.md and follow all instructions.
13. ACTION: Apply mechanical rename `src/tools/tools` → `src/tools/runtime`; update imports; rationalise barrels; clarify naming (e.g., `CoreToolRegistry`).  
    STATUS: Rename and import updates COMPLETE; barrels rationalisation PENDING.  
    REVIEW: Self‑review import rewrite counts and barrel exports; confirm zero behavioural change.  
    QUALITY-GATE: Full monorepo gates `format → type-check → lint → test → build` — PASSED for rename.

Progress Journal (rolling):

- 2025‑09‑05: Completed nested tools rename → runtime in both servers; updated imports; gates PASS.
- 2025‑09‑05: Captured detection inventory and ESLint boundary snapshot.
- 2025‑09‑06: Scaffolded `@oaknational/mcp-core` with minimal runtime factory; added `runtime.json`; updated Notion wiring to consume config; renamed registry type to `CoreToolRegistry`; lint/type‑check/build PASS.
- 2025‑09‑06: Scaffolded `@oaknational/mcp-providers-node` (clock/logger/storage) with unit tests; configured ESLint for typed rules; monorepo gates PASS.
- 2025‑09‑06: Refined Notion wiring: static `createAdaptiveLogger` import; extracted `validateRuntimeConfig`; composed runtime via core factory; all gates PASS; committed.
- 2025‑09‑06: Authored provider contracts documentation and Greek ecosystem deprecation reference; linked from package READMEs and acceptance criteria.
- 2025‑09‑06: Mechanical move applied for Notion app → `apps/oak-notion-mcp`; configs updated; full gates PASS. Remaining Greek directories pending rename: `ecosystem/histoi/*`, `ecosystem/moria/moria-mcp`, `ecosystem/psycha/oak-curriculum-mcp`. Docs still contain legacy nomenclature and will be consolidated into the single deprecation pointer.
  ‑ 2025‑09‑07: Archived `histos-runtime-abstraction`; switched imports to `@oaknational/mcp-core`; removed `ecosystem/moria/moria-mcp`; deleted top‑level `ecosystem/` directory. Full gates PASS.

14. ACTION: Update documentation (core README, providers READMEs, architecture pointers).  
    REVIEW: Self‑review terminology: Chōra/Chōrai in prose; `chorai` in paths.
15. QUALITY-GATE: Final monorepo gates; provider matrix; report compilation with acceptance checklist.

---

## 13. Self‑Review Rubric (replaces review agents)

- Grounding: Does the plan adhere to GO.md and AGENT.md? Are grounding steps present every third task?
- Boundaries: Are core↔provider boundaries enforced (no provider imports in core)? Are alias‑only rules applied?
- Config: Is the schema minimal and documented? Is detection logic fully removed?
- Tests: Do contract tests ensure parity across providers? Are smoke/e2e tests sufficient?
- Rename & barrels: Is the rename mechanical and idempotent? Are barrels clear and collision‑free?
- Quality gates: Are gates run frequently with clear PASS signals?
- Spelling & terminology: British spelling; Chōra/Chōrai vs `chorai` paths.

---

## 14. Ambiguity Audit

| Potential Ambiguity                         | Resolution                                                          |
| ------------------------------------------- | ------------------------------------------------------------------- |
| Where to place `mcp-core` package           | Create under `packages/` with clear ownership and README.           |
| Approved public subpaths for import‑x rules | Document in ESLint config comments and package READMEs.             |
| Timing of `tools/tools` → `tools/runtime`   | Execute in Part 2 per this plan with gates; strictly mechanical.    |
| Config shape and defaults                   | Keep minimal; document ownership and environment selection clearly. |

---

## 15. Rollback Strategy

Part 2 should be delivered via small, reviewable commits grouped by phase. If a combined commit is used, maintain a branch that can be reverted as a unit. Where renames are involved, prefer `git mv` to preserve history.
