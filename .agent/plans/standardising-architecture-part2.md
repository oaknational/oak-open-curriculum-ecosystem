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
- Providers:
  - `providers/node` and `providers/cloudflare` modules implementing the same contracts.
  - Selected exclusively via configuration file (e.g., `src/config/runtime.json`).
- Server wiring:
  - `src/app/bootstrap.ts` reads config, selects provider, calls core factory, and injects runtime into `src/tools/*` and `src/integrations/*`. (WIRING UPDATED TO READ CONFIG; FACTORY INTEGRATION PENDING)
- Lint boundaries:
  - Core cannot depend on providers.
  - Tools/integrations consume only injected runtime or public core interfaces.
  - Alias‑only cross‑package imports.
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

---

## 8. Risks & Mitigations

| Risk                                     | Mitigation                                             | Signal                                |
| ---------------------------------------- | ------------------------------------------------------ | ------------------------------------- |
| Provider leakage into core               | Interface segregation; lint boundaries; contract tests | No core→provider imports; tests pass  |
| Behaviour divergence between providers   | Shared contract test suite                             | Equal pass set across providers       |
| Config sprawl / ambiguity                | Minimal config schema, ownership documented            | Stable minimal config footprint       |
| Performance overhead from indirection    | Benchmark before/after; optimise only if indicated     | Acceptable latency and resource usage |
| Ambiguous ownership                      | CODEOWNERS, package READMEs with roles                 | Clear ownership, fewer review loops   |
| Rename fallout (`tools/tools` → runtime) | Mechanical codemod + gates; idempotency check          | Zero or minimal diffs; gates green    |

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
- Residual token scan report confirming only archived/pointer occurrences

Acceptance (Part 2):

1. Core adopted; providers injected explicitly via config; no detection logic remains.
2. Strict import‑x boundary rules active (alias‑only, no parent relatives, no internal modules beyond approved public subpaths).
3. `src/tools/tools` renamed to `src/tools/runtime` with imports updated.
4. Provider contract tests pass for all providers; e2e smoke tests pass.
5. Build, lint, type‑check, and test gates green monorepo‑wide.
6. Documentation updated (core README, provider READMEs, architecture pointers). Legacy narratives archived; pointer maintained.
7. Export surface parity preserved (baseline vs post equal; `default` treated separately).
8. Legacy tokens (`psychon/`, `chorai/`, `organa/mcp`, `eidola/`) appear only in archived docs or pointer docs; no active code/comments/imports.

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

3. Provider implementations

- Implement Node and Cloudflare providers against the core contracts.
- Ensure contract tests drive implementation.

4. Configuration introduction

- Define minimal `src/config/runtime.json` schema and ownership. (DONE – FILE ADDED; OWNERSHIP TO SERVER TEAM)
- Replace detection logic with config reading and validation. (PARTIAL – CONFIG READ IN WIRING; VALIDATION PENDING)

5. Server DI refactor

- Refactor `src/app/bootstrap.ts` to assemble runtime via core factory and inject into tools/integrations. (PENDING)

6. Strict boundary enforcement

- Activate import‑x strict rules and phenotype boundaries.
- Fix violations; ensure alias‑only cross‑boundary usage.

7. Mechanical rename and barrels (RENAME COMPLETE)

- Apply `src/tools/tools` → `src/tools/runtime` rename and update imports. (COMPLETE)
- Rationalise barrels; clarify exported names (e.g., `CoreToolRegistry`). (PARTIAL – REGISTRY RENAMED)

8. Validation & reporting

Appendix: Workspace taxonomy and aliases (Queued mechanical)

- Rename workspace taxonomy (mechanical, tracked separately):
  - `ecosystem/psycha/<server>` → `apps/<server>`
  - `ecosystem/moria/moria-mcp` → `packages/core/mcp-core`
  - `ecosystem/histoi/histos-logger` → `packages/libs/logger`
  - `ecosystem/histoi/histos-transport` → `packages/libs/transport`
  - `ecosystem/histoi/histos-storage` → `packages/libs/storage`
  - `ecosystem/histoi/histos-env` → `packages/libs/env`
  - `ecosystem/histoi/histos-runtime-abstraction` → `packages/libs/runtime`
  - `packages/oak-curriculum-sdk` → `packages/sdks/oak-curriculum-sdk`

- Full quality gates; provider matrix; reports updated.

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
