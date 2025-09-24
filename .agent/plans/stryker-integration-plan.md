# Stryker Mutation Testing Integration Plan

## Core References

- [GO.md](../../GO.md)
- [.agent/directives-and-memory/AGENT.md](../../.agent/directives-and-memory/AGENT.md)
- [.agent/directives-and-memory/rules.md](../../.agent/directives-and-memory/rules.md)
- [docs/agent-guidance/testing-strategy.md](../../docs/agent-guidance/testing-strategy.md)

## Intent

Deliver a dependable mutation-testing capability across all pnpm workspaces so that `pnpm test` quality gates gain mutation coverage (via `pnpm mutate`) without disrupting existing Vitest unit and integration suites. The plan ensures every workspace inherits consistent configuration, dev dependency management, and task orchestration while respecting repository rules and testing philosophy.

## Current Context Snapshot

- **Testing topology**: `package.json` defines `test` as `turbo run --continue test`, delegating to workspace-level `vitest run` scripts. E2E suites execute through the separate `test:e2e` Turbo task and are not invoked by `pnpm test`. No `mutate` script is registered yet.
- **Configuration state**: Most workspaces import `vitest.config.base.ts`. Custom overrides exist in `apps/oak-notion-mcp/vitest.config.ts` (adds `**/*.api.test.ts`), `apps/oak-open-curriculum-semantic-search/vitest.config.ts` (JS DOM environment), and `apps/oak-curriculum-mcp-streamable-http/vitest.config.ts` (mixes unit and E2E include globs). No Stryker configuration files are present anywhere in the repo.
- **Dependency posture**: The root lists `vitest` under `devDependencies`. Several workspaces (`packages/libs/{env,logger,storage,transport}/`, `packages/providers/mcp-providers-node/`, `apps/oak-notion-mcp/`) rely on hoisted Vitest rather than declaring it locally.
- **Tooling cadence**: Quality gates follow format → type-check → lint → test → build, as enforced by `package.json` scripts such as `qg`.

### Latest repository observations (2025-09-24)

- **Root orchestration confirmed**: `package.json` orchestrates `pnpm test` via Turbo; no mutation-testing or `pnpm mutate` placeholders exist yet at the root.
- **Workspace script coverage**: Every workspace listed in `pnpm-workspace.yaml` exposes a `test` script (Vitest) but none define `mutate` or similar commands. `packages/providers/mcp-providers-node/package.json` lacks lint/type-check/test helper dependencies beyond `pnpm`.
- **Vitest glob drift**: `apps/oak-curriculum-mcp-streamable-http/vitest.config.ts` currently includes `src/**/*.e2e.test.ts` in the default test set. Libraries inheriting the base config still match generic `*.test.ts`/`*.spec.ts` patterns rather than the stricter `*.unit.test.ts` naming recommended for mutation scoping.
- **Dev dependency gaps**: Libraries and the Notion MCP app omit local `vitest`, relying on root hoisting. Adding Stryker packages solely at the root will follow the existing pattern but should be documented.
- **Stryker absence**: Searches confirm no `stryker.config.*` files or `@stryker-mutator/*` dependencies; greenfield integration is required.

### Progress update (2025-09-24)

- **`@oaknational/mcp-providers-node` mutation run**: Local Stryker configuration now exists (`stryker.config.ts`, `vitest.config.ts`, `mutate` script). Initial run succeeded via `pnpm --filter @oaknational/mcp-providers-node mutate --logLevel trace`, producing a mutation score of **53.57%** (15 killed, 13 survived). Surviving mutants cluster around console logging branches (`src/index.ts`), highlighting missing behavioural assertions for logging outputs.
- **Vitest configuration duplication**: To unblock the mutation run under Stryker's sandbox, the workspace now carries a self-contained `vitest.config.ts` mirroring `vitest.config.base.ts`. This confirms the need for a dedicated configuration workspace that can be imported from both regular runs and sandboxed environments without fragile relative paths.

## Audit findings (2025-09-24)

### Root tooling

- **Scripts**: `package.json` defines `test`, `test:e2e`, and `qg`, but there is no `mutate` entry or related Turbo task. Quality gates currently end at `pnpm test` before e2e/smoke add-ons.
- **Turbo tasks**: `turbo.json` contains definitions for `test`, `test:e2e`, and other pipelines, but lacks a `mutate` task. Inputs reference shared configs (`vitest.config.base.ts`, `vitest.e2e.config.base.ts`). No mutation-specific caching or env pass-through is prepared.
- **Workspace manifest**: `pnpm-workspace.yaml` references `packages/libs/mcp-server-kit`, which does not exist under `packages/libs/`; clarify whether the package is pending or the entry is stale before wiring Stryker to all workspaces.
- **Base configs**: `vitest.config.base.ts` targets Node environment with broad include patterns. Mutation scoping will require either narrowing these patterns or overriding includes per workspace.
- **Dependencies**: Root `devDependencies` host `vitest` and testing utilities, but no Stryker packages. Hoisted usage is feasible and consistent with current practice.

### Workspace inventory

- **`apps/oak-notion-mcp/`**: `package.json` provides `test: "vitest run"` yet omits `vitest` in `devDependencies`, depending on hoisting. `vitest.config.ts` merges the base config and narrows includes to `**/*.unit.test.ts`, `**/*.integration.test.ts`, `**/*.api.test.ts`.
- **`apps/oak-curriculum-mcp-stdio/`**: `vitest.config.ts` re-exports the base configuration. `devDependencies` include `vitest`. No E2E patterns leak into the default suite.
- **`apps/oak-curriculum-mcp-streamable-http/`**: Custom `vitest.config.ts` includes both `src/**/*.unit.test.ts` and `src/**/*.e2e.test.ts`; mutation runs must exclude the E2E glob or adjust the config. Dev dependencies include `vitest`.
- **`apps/oak-open-curriculum-semantic-search/`**: `vitest.config.ts` configures JS DOM, includes `**/*.unit.test.{ts,tsx}` and `**/*.integration.test.{ts,tsx}`. Dev dependencies already pin `vitest`. Mutation tooling must honour the JS DOM environment and `test.setup.ts`.
- **`packages/libs/{env,logger,storage,transport}/`**: Each `package.json` defines `test: "vitest run"`, imports `vitest.config.base.ts`, and lacks local `vitest` in `devDependencies`. Mutation config can rely on hoisting but should confirm the shared base provides correct include/exclude patterns (currently broad `*.test.ts`/`*.spec.ts`).
- **`packages/providers/mcp-providers-node/`**: `package.json` exposes `test: "vitest run"` but has no local `vitest` dependency and no `vitest.config.ts`. It will rely entirely on root defaults; adding a workspace config may be necessary to tune mutation scope.
- **Update (2025-09-24)**: Workspace now owns `vitest.config.ts`, `stryker.config.ts`, and a `mutate` script. Mutation score data above should inform follow-up test enhancements (assertions around logging providers).
- **`packages/sdks/oak-curriculum-sdk/`**: `vitest.config.ts` is standalone with extensive include patterns (`src/**/*.test.ts`, `scripts/**/*.test.ts`). Dev dependencies include `vitest`. Mutation targeting may need to narrow to unit/integration naming conventions.
- **Missing workspace directory**: `packages/libs/mcp-server-kit` is absent despite being declared in `pnpm-workspace.yaml`; confirm whether the package is planned or the workspace file needs updating before Stryker integration attempts to cover it.

## Prerequisites: Configuration Alignment & Dev Dependency Strategy

### 1. Baseline Configuration Audit

- **Inventory**: Catalogue Vitest configs, TypeScript targets, lint rules, and Turbo tasks for each workspace to confirm inheritance from shared bases (`vitest.config.base.ts`, `tsconfig.base.json`, `eslint.config.base.ts`). Include explicit notes where workspaces add custom glob patterns (`apps/oak-notion-mcp`, `apps/oak-open-curriculum-semantic-search`) or lack explicit configs (`packages/providers/mcp-providers-node`).
- **Gap analysis**: Prioritise correcting `apps/oak-curriculum-mcp-streamable-http/vitest.config.ts`, which currently pulls `src/**/*.e2e.test.ts` into the unit/integration pipeline; tighten library workspaces currently matching generic `*.test.ts`/`*.spec.ts` patterns; and resolve the `packages/libs/mcp-server-kit` workspace reference if the package remains absent.
- **Documentation**: Record findings in `.agent/plans/mutation-testing/config-alignment-notes.md`, capturing evidence links (file paths, commit hashes) for future reference.

### 2. Dev Dependency Standardisation

- **Hoisting policy**: Continue the established pattern by hoisting shared tooling (Vitest currently) and add the core Stryker packages (`@stryker-mutator/core`, `@stryker-mutator/vitest-runner`, `@stryker-mutator/typescript-checker`) to the root `devDependencies` so workspaces that lack local `vitest` still resolve tooling. Document the expectation that hoisted Stryker binaries remain accessible to script runners.
- **Workspace overrides**: Document exceptions where local devDependencies remain necessary (e.g., `apps/oak-open-curriculum-semantic-search` already pinning `vitest` to satisfy JS DOM requirements) and specify when additional Stryker adapters should live alongside them.
- **Version governance**: Align Stryker package versions with the monorepo Vitest major version (currently `^3.2.4`) and codify upgrade procedures via root lockfile updates.
- **Automation**: Evaluate adding a lint or script check that flags workspaces with `test` scripts but missing `mutate` scripts once rollout begins.

### 3. Vitest Configuration Normalisation

- **Include patterns**: Standardise unit/integration globs so Stryker targets only in-process tests. Update configs that currently match `*.e2e.test.ts` to exclude E2E suites.
- **Environment settings**: Ensure JS DOM environments (Next.js app) and Node environments declare setup files explicitly so Stryker can resolve them.
- **Shared utilities → configuration workspace**: Replace the single `vitest.config.base.ts` file with a dedicated configuration workspace (e.g., `packages/config/testing/`) exporting reusable `vitest`, `stryker`, and related helpers. This workspace must:
  - Publish ESM modules that can be imported via package specifiers (`@oaknational/testing-config/vitest`) from both workspaces and Stryker sandboxes.
  - Expose typed factory functions (e.g., `createNodeVitestConfig`, `createJsDomVitestConfig`) so consuming workspaces can compose includes/excludes without duplicating objects.
  - Provide Stryker helper exports (mutate glob factories, checker presets) to minimise duplication across workspace-specific configs.
  - Maintain zero runtime side effects to respect testing strategy guidance (pure config generators, no environment mutation).

### 4. Turbo Task Extensions

- **Task template**: Draft a shared `mutate` task in `turbo.json` modelled on `test`, specifying inputs, outputs, dependency order, and environment pass-through requirements.
- **Root command**: Define `pnpm mutate` at the root to call `turbo run --continue mutate`, mirroring the existing `pnpm test` pattern while remaining optional for contributors during early rollout.
- **Quality gate alignment**: Decide whether `mutate` runs as part of `pnpm qg`, a nightly pipeline, or both, documenting the rationale and expected run cadence.

### 5. Workspace Readiness Checklist

- **Pure function emphasis**: Reaffirm TDD and pure-function-first expectations per `docs/agent-guidance/testing-strategy.md` so mutants fail meaningfully.
- **Test determinism**: Verify suites avoid flaky timing, uncontrolled IO, or reliance on global state that could mask mutants.
- **Resource constraints**: Profile long-running suites to gauge mutation-testing feasibility and identify candidates for selective mutant scopes.
- **Command wiring**: Ensure each workspace adds a `mutate` script that runs `stryker run` with its local config before enabling the Turbo pipeline.
- **Config hygiene**: Add workspace-level `vitest.config.ts` files where missing (e.g., `packages/providers/mcp-providers-node`) so mutation config can mirror vitest behaviour without depending on implicit defaults.
- **Configuration workspace adoption**: Schedule migration of all workspaces to consume the shared testing configuration package once it exists, removing bespoke copies and preventing future sandbox path regressions.

## Strategic Roadmap

### Phase 0 – Foundation & Governance

- **Outcome**: Shared standards for configuration, dev dependency management, and quality gates are ratified and documented.
- **Highlights**:
  - Publish configuration alignment report and remediation backlog.
  - Land root-level Stryker dependencies and base config template with agreed thresholds.
  - Introduce root-level `pnpm mutate` (Turbo-backed) and document workspace `mutate` scripts alongside contribution guidance.
  - Update `CONTRIBUTING.md` and quality-gate guidance to include mutation testing expectations.

### Phase 1 – Pilot Workspaces

- **Outcome**: Mutation testing operational in one library (`packages/libs/logger/`) and one app (`apps/oak-notion-mcp/`), validating Node and JS DOM pathways.
- **Highlights**:
  - Implement workspace-specific `stryker.config.ts` files that merge the base template.
  - Integrate `mutate` scripts and Turbo tasks for pilot workspaces.
  - Capture performance metrics, mutant survival hotspots, and remediation guidance.

### Phase 2 – Monorepo Roll-out

- **Outcome**: All workspaces invoked by `pnpm test` expose mutation coverage, with opt-in toggles for slower suites.
- **Highlights**:
  - Add configs for remaining workspaces, aligning mutate globs with local source layouts.
  - Roll out workspace-level `mutate` scripts and ensure `pnpm mutate` covers the entire workspace set.
  - Update `pnpm qg` (or companion command) to include mutation testing once runtimes stabilise.
  - Establish reporting/dashboards to surface mutation results in CI.
  - Build and publish the shared testing configuration workspace; migrate existing `vitest.config.ts` files to import from it, then deprecate raw `vitest.config.base.ts` usage.

### Phase 3 – Optimisation & Automation

- **Outcome**: Mutation testing integrates seamlessly into CI/CD with automated guardrails.
- **Highlights**:
  - Introduce incremental mutant runs (e.g., touched-files mode) to reduce feedback loop time.
  - Automate detection of missing `stryker.config.ts` in new workspaces.
  - Document remediation patterns and coaching materials for contributors.

## Success Metrics

- **Coverage adoption**: 100% of workspaces triggered by `pnpm test` have active `mutate` tasks wired into Turbo and callable via `pnpm mutate`.
- **Quality gate integration**: Mutation testing runs as part of nightly CI or release pipelines without exceeding agreed SLAs.
- **Surviving mutants**: Critical workspaces maintain ≤ 5% surviving mutants after remediation passes.
- **Developer experience**: Mutation runs complete within 2× the baseline unit-test runtime for pilot workspaces.

## Risks & Mitigations

- **Performance overhead**: Long mutation runs could hinder feedback loops.
  - Mitigation: Phase roll-out, configure incremental modes, and schedule nightly full runs.
- **Flaky tests**: Existing flakiness will be amplified.
  - Mitigation: Enforce deterministic test design before enabling Stryker; block roll-out until suites stabilise.
- **Config drift**: Divergent workspace configs may erode consistency.
  - Mitigation: Maintain shared base config, run periodic config audits, and add lint checks.
- **Resource limits**: CI runners may require more powerful instances.
  - Mitigation: Profile resource usage during pilots and adjust CI infrastructure accordingly.

## GO Cadence Todo List

1. ACTION: Reconfirm GO.md, AGENT.md, rules, and testing strategy directives prior to each planning review. REMINDER: UseBritish spelling.
2. REVIEW: Self-review grounding notes and adjust planning assumptions as needed.
3. ACTION: Catalogue vitest, Turbo, and TypeScript config inheritance across all workspaces.
4. REVIEW: Validate the catalogue captures every workspace declared in `pnpm-workspace.yaml`.
5. QUALITY-GATE: Cross-check catalogue findings against repository rules without executing commands.
6. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
7. ACTION: Draft Stryker base configuration and dev dependency policy proposal.
8. REVIEW: Self-review proposal for alignment with testing strategy and dependency governance.
9. ACTION: Produce Phase 0 remediation backlog covering all prerequisite gaps.
10. REVIEW: Ensure backlog items map cleanly to workspaces and reference supporting evidence.
11. QUALITY-GATE: Present backlog and dependency policy to maintainers for sign-off.
12. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
13. ACTION: Execute pilot workspace implementation (config, scripts, Turbo tasks, CI wiring).
14. REVIEW: Assess pilot results, capturing runtime metrics and mutant reports.
15. QUALITY-GATE: Confirm pilot workspaces pass full quality gates including mutation runs.
16. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
17. ACTION: Roll out Stryker configuration to remaining workspaces in batches, incorporating lessons from pilots.
18. REVIEW: Evaluate batch roll-outs, recording issues and resolutions per workspace.
19. QUALITY-GATE: Verify monorepo-wide mutation command succeeds and integrates with CI.
20. GROUNDING: read GO.md and follow all instructions. REMINDER: UseBritish spelling.
21. ACTION: Document optimisation tactics, automation hooks, and contributor guidance.
22. REVIEW: Finalise documentation, ensuring alignment with repository standards.

## Reporting & Follow-up

- **Artifacts**: Maintain a living backlog in `.agent/plans/mutation-testing/config-alignment-notes.md` and update the main plan upon each phase completion.
- **Reviews**: Schedule periodic self-reviews after each ACTION/QUALITY-GATE step; invoke specialist sub-agents only if additional assurance is required.
- **Communication**: Share status updates via repo discussions or dedicated documentation updates, ensuring mutation testing becomes part of the default engineering cadence.
