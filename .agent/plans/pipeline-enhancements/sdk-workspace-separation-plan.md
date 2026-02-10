# SDK Workspace Separation Plan

**Status**: PROPOSED  
**Created**: 08/11/2025  
**Owner**: Engineering

---

## 1. Intent & Impact

### 1.1 Intent

- Separate the Oak Curriculum SDK into two workspaces with explicit, enforceable boundaries:
  1. `@oaknational/oak-curriculum-sdk-generation` – owns schema ingestion, type generation, validators, constants, and MCP descriptors.
  2. `@oaknational/oak-curriculum-sdk` – consumes the generated artefacts to provide runtime clients, validation, and MCP facades.
- Establish the separation as a prerequisite for the `@oaknational/openapi-to-tooling` integration, ensuring the generation workspace becomes the single extraction target.

### 1.2 Goals

- **G1**: Relocate all type-gen code, schema caches, and generated artefacts into a dedicated generation workspace without altering behaviour.
- **G2**: Introduce a comprehensive public API in the generation workspace that satisfies the schema-first execution directive.
- **G3**: Update the runtime workspace to consume only the new package exports, backed by ESLint/Turborepo rules enforcing the boundary.
- **G4**: Publish updated documentation and CI workflows reflecting the new workspace ownership.

### 1.3 Impact

- Simplifies downstream extraction of generator logic into `@oaknational/openapi-to-tooling`.
- Reinforces schema-first execution by making generated artefacts consumable via a single package boundary.
- Reduces cognitive load in the runtime workspace—only runtime code remains.

---

## 2. Context & References

- `.agent/directives/AGENT.md`
- `.agent/directives/rules.md`
- `.agent/directives/schema-first-execution.md`
- `docs/architecture/architectural-decisions/029-no-manual-api-data.md`
- `docs/architecture/architectural-decisions/030-sdk-single-source-truth.md`
- `docs/architecture/architectural-decisions/031-generation-time-extraction.md`
- `docs/architecture/architectural-decisions/038-compilation-time-revolution.md`
- `.agent/plans/replacing_openapi_ts_and_openapi_zod_client/openapi-to-tooling-integration-plan.md`
- `.agent/plans/replacing_openapi_ts_and_openapi_zod_client/mcp_ecosystem_integration_requirements.md`
- `.agent/plans/replacing_openapi_ts_and_openapi_zod_client/openapi-to-mcp-framework-extraction-plan.md`

---

## 3. Definitions

- **Generation Workspace**: The package containing schema ingestion, transforms, generators, generated artefacts, and public exports.
- **Runtime Workspace**: The package exposing API clients, MCP facades, and validation built on the generation workspace outputs.
- **Manifest**: The file/output descriptor emitted by the forthcoming generator; in this plan we rely on the current artefact set but anticipate manifest-based exports.
- **Boundary Rules**: ESLint and Turborepo configuration that prevent cross-package imports outside the declared public API.

---

## 4. Deliverables

1. `packages/sdks/oak-curriculum-sdk-generation` workspace (package.json, tsconfig, lint config, docs).
2. `packages/sdks/oak-curriculum-sdk` runtime workspace updated to depend on the generation package only via public exports.
3. Generation workspace public API (`src/index.ts`) exporting all schema-first execution artefacts.
4. ESLint/Turborepo rule updates enforcing package boundaries.
5. Updated CI scripts, README files, and migration notes.
6. ADR documenting the separation decision.

---

## 5. Phase Plan

### Phase 0 – Foundations

- Review ADRs and directives; confirm alignment with schema-first execution.
- Inventory current type-gen outputs and runtime dependencies.
- Capture current CI pipelines and identify required updates.

### Phase 1 – Public API Blueprint

- Document every `src/types/generated/**` export the runtime currently consumes.
- Group exports into categories (OpenAPI types, path constants, MCP descriptors, Zod schemas, search assets, helpers).
- Draft the barrel export layout and update of docs to reflect planned API sections.

### Phase 2 – Workspace Scaffolding

- Create `oak-curriculum-sdk-generation` workspace structure; move `type-gen`, `schema-cache`, and generated artefacts using git-aware moves.
- Set up `package.json`, `tsconfig.json`, `eslint` config, `tsup` config, and `README`.
- Define script pipeline (`type-gen`, `build`, `lint`, `test`, `docs`), anticipating future use of `@oaknational/openapi-to-tooling`.

### Phase 3 – Barrel Export & Boundary Enforcement

- Build `src/index.ts` with comprehensive exports and TSDoc.
- Configure ESLint rules to forbid runtime workspace imports from generation internals.
- Update `turbo.json` and `pnpm-workspace.yaml` to reflect new packages and pipelines.

### Phase 4 – Runtime Workspace Updates

- Switch runtime imports to the new package.
- Remove duplicated generated artefacts from runtime workspace.
- Verify runtime tests, build, and CI pipelines.

### Phase 5 – Documentation & ADR

- Write ADR for workspace separation.
- Update workspace READMEs and migration guide.
- Align logging/setup docs with new package boundaries.

### Phase 6 – Validation & Metrics

- Execute validation plan (Section 8).
- Capture metrics (build latency, coverage, CI gate timings) pre- and post-separation.
- Log onboarding dry-run results.

---

## 6. Acceptance Criteria

1. Generation workspace contains all type-gen logic, schema caches, and generated artefacts; runtime workspace contains no generated files.
2. Runtime workspace builds, tests, and linting succeed using only public exports from the generation package.
3. ESLint boundary rules and Turborepo pipelines prevent cross-package leakage.
4. Generation public API exports all schema-first artefacts required by the runtime, with TSDoc.
5. CI pipelines run deterministically and record build/test timings for both workspaces.
6. Documentation reflects the new workspace structure and provides migration guidance.
7. Cross-schema smoke test (Oak schema + minimal reference schema) passes using the generation workspace.

---

## 7. Definition of Done

- [ ] Workspace restructuring tasks completed and merged with git history preserving file provenance.
- [ ] All acceptance criteria satisfied and documented.
- [ ] ADR published and linked from the relevant plans.
- [ ] CI dashboards updated with new build/test timings and coverage metrics.
- [ ] Onboarding dry-run log available demonstrating setup in < 4 hours.
- [ ] Sign-off recorded in project governance log.

---

## 8. Validation Strategy

### 8.1 Structural Validation

- Verify file moves via `git status` ensuring no content modifications.
- Run `pnpm lint` with boundary rules to confirm no illegal imports.
- Check `pnpm build` orchestrates generation → runtime builds in sequence.

### 8.2 Behavioural Validation

- Execute runtime integration tests (request/response validation, MCP execution) to confirm unchanged behaviour.
- Run cross-schema generation on:
  - Oak production schema.
  - Minimal reference schema (e.g. simple CRUD spec) to ensure vendor-neutral readiness.

### 8.3 Determinism & Metrics

- Run generation twice and diff outputs to confirm determinism.
- Record build durations, test durations, and coverage percentages for both workspaces.
- Measure `pnpm docs:verify` and Lighthouse accessibility score (target ≥ 95%).

### 8.4 Documentation & Onboarding

- Validate updated READMEs through a fresh checkout dry-run; document time taken (< 4 hours goal).
- Ensure ADR and migration guides pass lint/markdown checks.

### 8.5 Governance

- Update governance log with separation status, metrics, and open risks.
- Cross-reference integration plan to confirm prerequisite satisfied.

---

## 9. Impacted Artefacts

- `packages/sdks/oak-curriculum-sdk/type-gen/**` → moved to generation workspace.
- `packages/sdks/oak-curriculum-sdk/src/types/generated/**` → moved to generation workspace.
- `packages/sdks/oak-curriculum-sdk/src/**` → updated imports and removed generated files.
- `pnpm-workspace.yaml`, `turbo.json`, `tsconfig.base.json`, ESLint configs.
- Workspace READMEs, logging guide, and docs referencing generated types.

---

## 10. Risks & Mitigations

- **Risk**: Hidden coupling between runtime code and generated internals.  
  **Mitigation**: Audit imports before move, add ESLint rules & tests covering expected exports.

- **Risk**: CI complexity increases with two workspaces.  
  **Mitigation**: Centralise scripts via Turborepo, share metrics dashboard, monitor build times.

- **Risk**: Incomplete documentation leading to onboarding friction.  
  **Mitigation**: Dry-run onboarding and record findings; ensure migration guide is explicit.

- **Risk**: Future generator upgrade introduces breaking API changes.  
  **Mitigation**: Public API references the manifest-based exports planned in integration requirements; add TODO markers for `@oaknational/openapi-to-tooling` adoption.

---

## 11. Open Questions

1. Should the generation workspace publish a CLI entry point, or remain library-only until `@oaknational/openapi-to-tooling` lands?
2. Do we require additional reference schemas for cross-validation beyond the minimal CRUD example?
3. How will versioning be handled for consumers if the generation package becomes public (semver policy)?

---

## 12. Next Actions

1. Confirm inventory of generated artefacts and runtime import list.
2. Draft ADR outline and gather stakeholder approval.
3. Begin Phase 2 scaffolding with git-aware moves.
4. Update integration plan to mark this separation as “in progress”.

---

## 13. Revision History

- **08/11/2025** – Plan rewritten to include goals, impacts, acceptance criteria, validation, metrics, and alignment with the openapi-to-tooling roadmap.
