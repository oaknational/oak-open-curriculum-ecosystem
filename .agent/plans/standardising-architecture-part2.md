# Standardising Architecture – Part 2 Implementation Plan (Core, Providers, Explicit Injection)

Strategic context: This document is the detailed execution plan for Part 2 and complements the roadmap in `.agent/plans/standardising-architecture-high-level-plan.md`. It assumes Part 1 (mechanical normalisation) has landed per `.agent/plans/standardising-architecture-part1.md`.

This file intentionally contains no code snippets that belong in scripts; it focuses on intent, invariants, phases, acceptance, and verifiable outcomes.

British spelling applies throughout (behaviour, normalisation, rationalisation, etc.).

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
- Mechanical deconfliction rename: `src/tools/tools` → `src/tools/runtime` with import updates.
- Barrel rationalisation and naming clarity (e.g., export runtime registry as `CoreToolRegistry`; keep schema types local).

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

- `packages/mcp-core/` (name tentative: `@oaknational/mcp-core`)
  - Exposes interfaces, types, and pure utilities.
  - Provides a factory: `createRuntime(providers)` returning `{ logger, storage, clock, … }`.
  - Contains no provider imports.
- Providers:
  - `providers/node` and `providers/cloudflare` modules implementing the same contracts.
  - Selected exclusively via configuration file (e.g., `src/config/runtime.json`).
- Server wiring:
  - `src/app/bootstrap.ts` reads config, selects provider, calls core factory, and injects runtime into `src/tools/*` and `src/integrations/*`.
- Lint boundaries:
  - Core cannot depend on providers.
  - Tools/integrations consume only injected runtime or public core interfaces.
  - Alias‑only cross‑package imports.
- Mechanical rename applied:
  - `src/tools/tools` → `src/tools/runtime` with updated imports.
- Barrel rationalisation:
  - Avoid layered collisions; clarify names (e.g., `CoreToolRegistry` for runtime registry types; schema/types kept local).

---

## 5. Quality Gates (Shared)

Run at sensible intervals and before merge:

- `pnpm -r format`
- `pnpm -r type-check`
- `pnpm -r lint`
- `pnpm -r test`
- `pnpm -r build`

Part 2 adds provider contract tests and (optionally) a small e2e matrix across providers.

---

## 6. Test Strategy (TDD)

- Contract tests (first): Define a shared suite validating provider behaviour against core interfaces. Providers must pass the same tests.
- Unit tests for core utilities and factory.
- Minimal e2e smoke tests per provider (bootstrap + one tool path exercise).
- Optional CI matrix to run the suite for multiple providers.

---

## 7. ESLint & Import Hygiene

- Adopt strict `eslint-plugin-import-x` configuration:
  - Enforce alias‑only cross‑boundary imports
  - Disallow `../` parent imports across boundaries
  - Forbid `no-internal-modules` except approved public subpaths
- Maintain phenotype boundary rules from Part 1; remove legacy duplicates only after Part 2 stabilises.

---

## 8. Risks & Mitigations

| Risk                                  | Mitigation                                                  | Signal                                  |
| ------------------------------------- | ----------------------------------------------------------- | --------------------------------------- |
| Provider leakage into core            | Interface segregation; lint boundaries; contract tests      | No core→provider imports; tests pass    |
| Behaviour divergence between providers| Shared contract test suite                                  | Equal pass set across providers         |
| Config sprawl / ambiguity             | Minimal config schema, ownership documented                 | Stable minimal config footprint         |
| Performance overhead from indirection | Benchmark before/after; optimise only if indicated          | Acceptable latency and resource usage   |
| Ambiguous ownership                   | CODEOWNERS, package READMEs with roles                      | Clear ownership, fewer review loops     |
| Rename fallout (`tools/tools` → runtime)| Mechanical codemod + gates; idempotency check               | Zero or minimal diffs; gates green      |

---

## 9. Reporting & Acceptance Criteria

Report artefacts (append to Part 1 report or add a Part 2 section):

- Provider contract test summary per provider
- Lint boundary verification output (no violations)
- Config schema and example (`src/config/runtime.json`)
- Evidence of removal of detection logic
- Rename application summary (`tools/tools` → `tools/runtime`), import rewrite counts
- Barrel rationalisation notes (collisions avoided; naming clarified)

Acceptance (Part 2):

1. Core adopted; providers injected explicitly via config; no detection logic remains.
2. Strict import‑x boundary rules active (alias‑only, no parent relatives, no internal modules beyond approved public subpaths).
3. `src/tools/tools` renamed to `src/tools/runtime` with imports updated.
4. Provider contract tests pass for all providers; e2e smoke tests pass.
5. Build, lint, type‑check, and test gates green monorepo‑wide.
6. Documentation updated (core README, provider READMEs, architecture pointers). Legacy narratives archived; pointer maintained.

---

## 10. Grounding & Core References

- Read and follow `GO.md` (primary operational guidance: grounding, TODO structuring, quality gates, deep thinking). For this plan and future sub‑plans, replace any “review agent” mentions with self‑reviews.
- Read `.agent/directives-and-memory/AGENT.md` and linked documents; align behaviour accordingly.
- High‑level context: `.agent/plans/standardising-architecture-high-level-plan.md`
- Part 1 plan: `.agent/plans/standardising-architecture-part1.md`

Terminology note: Chōra (singular) and Chōrai (plural) in prose; use ASCII `chorai` in path segments.

---

## 11. Phased Execution Plan (Concise)

1) Baseline capture for Part 2

- Inventory existing detection logic and provider‑specific code paths.
- Snapshot current lint boundary config intended for Part 2 strictness.

2) Core extraction and publish (internal)

- Extract interfaces and pure utilities into `@oaknational/mcp-core`.
- Provide `createRuntime(providers)` factory.

3) Provider implementations

- Implement Node and Cloudflare providers against the core contracts.
- Ensure contract tests drive implementation.

4) Configuration introduction

- Define minimal `src/config/runtime.json` schema and ownership.
- Replace detection logic with config reading and validation.

5) Server DI refactor

- Refactor `src/app/bootstrap.ts` to assemble runtime via core factory and inject into tools/integrations.

6) Strict boundary enforcement

- Activate import‑x strict rules and phenotype boundaries.
- Fix violations; ensure alias‑only cross‑boundary usage.

7) Mechanical rename and barrels

- Apply `src/tools/tools` → `src/tools/runtime` rename and update imports.
- Rationalise barrels; clarify exported names (e.g., `CoreToolRegistry`).

8) Validation & reporting

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
   QUALITY-GATE: `pnpm -r type-check` (core package only once created).
5. ACTION: Implement provider contract tests (shared suite).  
   REVIEW: Self‑review coverage and determinism; ensure parity checks across providers.  
   QUALITY-GATE: `pnpm -r test` for the shared suite (failing until providers exist is acceptable during development).
6. GROUNDING: read GO.md and follow all instructions.
7. ACTION: Implement Node provider to satisfy the contract tests.  
   REVIEW: Self‑review for boundary adherence and no core imports.  
   QUALITY-GATE: `pnpm -r test` (provider + core).
8. ACTION: Implement Cloudflare provider to satisfy the same contract tests.  
   REVIEW: Self‑review for boundary adherence and parity with Node.  
   QUALITY-GATE: `pnpm -r test` (matrix: node, cloudflare).
9. GROUNDING: read GO.md and follow all instructions.
10. ACTION: Introduce configuration reading/validation in `src/app/bootstrap.ts`; remove detection logic; wire DI via core factory.  
    REVIEW: Self‑review diff ensures removal of detection code and explicit config path.  
    QUALITY-GATE: `pnpm -r type-check` and `pnpm -r test` (smoke paths).
11. ACTION: Enforce strict import‑x rules (alias‑only cross‑boundary; no parent relatives; no internal modules beyond approved public subpaths).  
    REVIEW: Self‑review lint rule set and fixes; document any approved public subpaths.  
    QUALITY-GATE: `pnpm -r lint` (expect clear baseline, then green).
12. GROUNDING: read GO.md and follow all instructions.
13. ACTION: Apply mechanical rename `src/tools/tools` → `src/tools/runtime`; update imports; rationalise barrels; clarify naming (e.g., `CoreToolRegistry`).  
    REVIEW: Self‑review import rewrite counts and barrel exports; confirm zero behavioural change.  
    QUALITY-GATE: Full monorepo gates `format → type-check → lint → test → build`.
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

| Potential Ambiguity                           | Resolution                                                                 |
| -------------------------------------------- | -------------------------------------------------------------------------- |
| Where to place `mcp-core` package             | Create under `packages/` with clear ownership and README.                  |
| Approved public subpaths for import‑x rules   | Document in ESLint config comments and package READMEs.                    |
| Timing of `tools/tools` → `tools/runtime`     | Execute in Part 2 per this plan with gates; strictly mechanical.           |
| Config shape and defaults                     | Keep minimal; document ownership and environment selection clearly.        |

---

## 15. Rollback Strategy

Part 2 should be delivered via small, reviewable commits grouped by phase. If a combined commit is used, maintain a branch that can be reverted as a unit. Where renames are involved, prefer `git mv` to preserve history.
