# Phase 6 Plans Consistency Review (2025-08-10)

This report reviews the following documents for internal consistency, cross-consistency, and alignment with the rules and guidance:

- `.agent/plans/phase-6-oak-curriculum-api.md`
- `.agent/plans/high-level-plan.md`
- `.agent/directives/principles.md`
- `.agent/directives/testing-strategy.md`
- Other guidance under `docs/agent-guidance/` (notably `architecture.md`, `development-practice.md`, `typescript-practice.md`, `safety-and-security.md`, `ai-agent-guide.md`)

## Executive Summary

- Overall, both plans align well with the biological architecture and TDD principles.
- There are several specific inconsistencies and gaps to address to fully align with the rules and guidance:
  1. Runtime Isolation (Phase 5.5) gating clarified by lead decision: defer 5.5 until after SDK integration but before exposing SDK as MCP tools; plans must reflect this gate explicitly.
  2. Quality gate order and contents in `high-level-plan.md` diverge from guidance.
  3. Test filename conventions in examples within `phase-6-oak-curriculum-api.md` diverge from testing strategy.
  4. Runtime validation at external boundaries (Zod) is not explicit in Phase 6 plan.
  5. Type-only imports are not emphasized in examples.
  6. Type generation workflow needs explicit build integration and offline fallback clarity.
  7. Minor terminology and success criteria tightening recommended.

Each issue below includes concrete, minimal edits to make in the plans.

---

## Findings and Actionable Recommendations

### 1) Runtime Isolation (Phase 5.5) Gating Status

- Evidence
  - Lead agent decision: defer Phase 5.5 consistency work to after integrating the Oak Open Curriculum API but before exposing the SDK as MCP tools.
  - Current plan text shows “MITIGATED,” which does not precisely communicate the new gate timing.
- Impact
  - Without explicit gating language, there is risk of exposing tools before isolation and inconsistent expectations across teams.
- Recommendation
  - Update both plans to state: “Phase 5.5 ⏭️ Deferred until after SDK integration; MUST be completed before MCP tool exposure (BLOCKER).”
  - During integration, require interim acceptance criteria: Node-specific code isolated in adapters; no Node globals in core; boundary integration tests prove isolation. MCP exposure remains blocked until 5.5 completion.

### 2) Quality Gates: Order and Contents

- Evidence
  - `high-level-plan.md` Quality Gates (Sequential):
    - 1. `pnpm format`
    - 2. `pnpm lint`
    - 3. `pnpm type-check`
    - 4. `pnpm test`
    - 5. `pnpm test:e2e`
  - Guidance in `AGENT.md` and `development-practice.md`:
    - AGENT.md “Development Commands” (order): format → type-check → lint → test → build.
    - `development-practice.md` “Quality Gates” (order): format → type-check → lint → test → build.
- Impact
  - Inconsistent order and the omission of `build` in the high-level plan.
- Recommendation
  - Update `high-level-plan.md` to use: `pnpm format` → `pnpm type-check` → `pnpm lint` → `pnpm test` → `pnpm build`.
  - Mention `pnpm test:e2e` as a manual/optional step (not part of default CI), consistent with `testing-strategy.md`.

### 3) Test Filename Conventions in Phase 6 Plan Examples

- Evidence
  - `phase-6-oak-curriculum-api.md` examples include filenames like `scripts/typegen.test.ts` and `client.test.ts`.
  - `.agent/directives/testing-strategy.md` requires:
    - Unit tests: `*.unit.test.ts`
    - Integration tests: `*.integration.test.ts`
    - E2E tests: `*.e2e.test.ts`
- Impact
  - Divergence may cause confusion and inconsistent CI matching.
- Recommendation
  - Adjust example filenames in `phase-6-oak-curriculum-api.md` to:
    - `scripts/typegen.unit.test.ts` (pure transformation)
    - `client.unit.test.ts` (pure data transformation)
    - keep `*.integration.test.ts` and `*.e2e.test.ts` as already shown.

### 4) Runtime Validation at External Boundaries (Zod)

- Evidence
  - `typescript-practice.md` and `safety-and-security.md` require Zod validation at external boundaries (API responses, env, etc.).
  - Phase 6 plan emphasizes generated types (compile-time) but lacks explicit Zod runtime validation of Oak API responses and environment configuration.
- Impact
  - Without runtime validation, incorrect external data may flow into the trusted zone.
- Recommendation
  - In `phase-6-oak-curriculum-api.md`, add explicit tasks to:
    - Define Zod schemas for the subset of Oak API responses consumed (or auto-generate validators from OpenAPI if feasible).
    - Validate API responses in the adapters/boundary layer before passing into core.
    - Validate environment/config via Zod in `chora/phaneron` for the MCP server.

### 5) Type-Only Imports

- Evidence
  - `principles.md`/`typescript-practice.md`: “Type imports must be labelled with `type`”.
  - Phase 6 examples don’t highlight `import type` usage.
- Impact
  - Missed opportunity to reinforce required practice in new code.
- Recommendation
  - Add a brief note and code snippet in `phase-6-oak-curriculum-api.md` illustrating `import type { Logger } from '...'` and enforcing type-only imports in SDK and MCP layers.

### 6) Type Generation: Build Integration and Offline Fallback

- Evidence
  - Phase 6 plan includes typegen, a cached OpenAPI copy, and ignoring generated types.
  - Guidance encourages reproducible builds and minimal friction.
- Impact
  - Ambiguity about when typegen runs, and how offline fallback is triggered.
- Recommendation
  - In `phase-6-oak-curriculum-api.md`, clarify:
    - Where the cached OpenAPI spec lives (e.g., `packages/oak-curriculum-sdk/scripts/openapi-cache/swagger.json`).
    - Build step ordering: typegen runs before `type-check`/`build`.
    - Generated types are committed per decision; ensure deterministic generation and include a regeneration script (prebuild or release) so committed artifacts stay in sync.

### 7) Success Criteria Tightening for SDK and MCP

- Evidence
  - Both plans list success criteria, but they can be more specific to align with guidance.
- Impact
  - Clearer exit criteria reduce ambiguity.
- Recommendation
  - Add/clarify success checks such as:
    - “All external signals validated with Zod at boundaries (SDK adapters and MCP config).”
    - “No `any`, no type assertions; all shared types derive from generated OpenAPI types.”
    - “Unit tests named `*.unit.test.ts` prove pure logic; integration tests named `*.integration.test.ts` prove assembly without I/O; E2E tests live in `e2e-tests/`.”
    - “Quality gates pass in documented order; E2E tests run on-demand.”

### 8) Terminology Consistency (Minor)

- Evidence
  - Phase 6 uses biological terms properly (chorai, stroma, aither, phaneron; organa; psychon).
- Recommendation
  - Keep consistent capitalization and pluralization as in `architecture.md`. No changes required beyond proofreading; examples already look consistent.

### 9) Runtime Validation Approach: generated `is` predicates vs Zod (evaluation)

- Context
  - The OpenAPI generator provides TypeScript types and `is` type predicate functions.
  - Repo guidance favors Zod at external boundaries for runtime validation and error clarity.
- Option A — Use generated `is` only
  - Pros: zero new deps; minimal complexity; no schema duplication.
  - Cons: validator coverage/ergonomics vary by generator; weaker error messages; harder composition/refinement; diverges from repo-wide practice.
- Option B — Zod at boundaries
  - Pros: consistent with repo; strong error messages and `.parse()` semantics; transformations/refinements; easy schema composition.
  - Cons: adds dependency; potential duplication unless generating Zod from OpenAPI; small runtime cost.
- Option C — Hybrid (recommended)
  - Use generated `is` within the SDK adapter during initial integration to minimize friction.
  - Use Zod at MCP boundary (config, tool IO) immediately for consistency and safety.
  - Optionally adopt OpenAPI→Zod generation later to unify; revisit after Phase 5.5 completes.
- Recommendation
  - Adopt Hybrid now. Keep a follow-up to evaluate switching SDK boundary validation to Zod via codegen once 5.5 is complete.

---

## Cross-Document Consistency Matrix (Summary)

| Topic              | phase-6 plan     | high-level plan                  | rules/testing/guidance                    | Status                       |
| ------------------ | ---------------- | -------------------------------- | ----------------------------------------- | ---------------------------- |
| Phase 5.5 gating   | “MITIGATED”      | “MITIGATED/Proceed”              | Prior decision: hard prerequisite         | Needs decision/clarification |
| Quality gate order | Not explicit     | Lint before type-check; no build | format → type-check → lint → test → build | Align to guidance            |
| Test filenames     | Some `*.test.ts` | Consistent at high level         | Strict suffixes per testing strategy      | Align examples to strategy   |
| Zod at boundaries  | Not explicit     | Not explicit                     | Required                                  | Add explicit tasks           |
| Type-only imports  | Not explicit     | Not explicit                     | Required                                  | Add explicit note            |
| Typegen workflow   | Present          | Present                          | OK but clarify build/offline              | Clarify details              |

---

## Proposed Minimal Edits (Copy-ready)

Apply the following minimal edits to the plans (no code changes):

1. In both plans (dependencies section for Phase 6)

- Replace: “Phase 5.5 🚧 MITIGATED”
- With:
  - “Phase 5.5 ⏭️ Deferred until after SDK integration; MUST be completed before MCP tool exposure (BLOCKER). Interim acceptance criteria during integration: Node-specific code isolated in adapters; no Node globals in core; boundary integration tests enforce isolation.”

2. In `/.agent/plans/high-level-plan.md` Quality Gates

- Replace the list with:
  - 1. `pnpm format`
  - 2. `pnpm type-check`
  - 3. `pnpm lint`
  - 4. `pnpm test`
  - 5. `pnpm build`
- Add note: “`pnpm test:e2e` is manual/on-demand (not in default CI).”

3. In `/.agent/plans/phase-6-oak-curriculum-api.md` test filenames in examples

- Replace occurrences of `*.test.ts` intended as unit tests with `*.unit.test.ts` (e.g., `scripts/typegen.unit.test.ts`, `client.unit.test.ts`).
- Keep `*.integration.test.ts` and `*.e2e.test.ts` as-is.

4. In `/.agent/plans/phase-6-oak-curriculum-api.md` add runtime validation tasks

- For SDK adapters during initial integration: it is acceptable to rely on generated `is` predicates for API response validation; add tests to assert failure modes and error reporting. Add a follow-up to migrate to Zod (or generate Zod from OpenAPI) post-5.5 to align with repo practices.
- For MCP `chora/phaneron`: Validate configuration (API keys, endpoints) with Zod at startup (required for boundary), consistent with repo guidance.

5. In `/.agent/plans/phase-6-oak-curriculum-api.md` add type-only import note

- Add a short note: “Use `import type { … } from '…'` for all type-only imports (required by rules).”

6. In `/.agent/plans/phase-6-oak-curriculum-api.md` clarify typegen workflow

- Add bullets:
  - “Cached OpenAPI spec location: `packages/oak-curriculum-sdk/scripts/openapi-cache/swagger.json`.”
  - “Typegen runs before `type-check` and `build` (CI ensures generation).”
  - “Generated files are committed; add a regeneration step (prebuild or release) to keep artifacts in sync and ensure determinism in CI. Update any ignore patterns if present.”

---

## Open Questions

- Confirm validation approach for SDK boundaries during Phase 6: generated `is` only, Zod at boundaries, or Hybrid (recommended above).
- Confirm generated artifacts commit policy details (exact paths and any `.gitignore` updates), and when regeneration runs (prebuild, release).

---

## Checklist for Follow-up PR(s)

- [ ] Update dependency gating language in both plans.
- [ ] Align quality gates order and include `build` step in the high-level plan; move E2E to an on-demand note.
- [ ] Rename unit test examples in Phase 6 plan to use `*.unit.test.ts`.
- [ ] Add runtime validation tasks: use generated `is` for SDK boundary during initial integration; use Zod for MCP config; add a follow-up to unify via Zod/codegen post-5.5.
- [ ] Add note on type-only imports in Phase 6 plan examples.
- [ ] Clarify type generation workflow (cached spec location; pre-build step; CI behavior).
- [ ] Commit generated types; adjust ignore patterns if any; add regeneration script and CI check to ensure determinism.

---

## Sources Consulted

- `/.agent/plans/phase-6-oak-curriculum-api.md`
- `/.agent/plans/high-level-plan.md`
- `/.agent/directives/principles.md`
- `/.agent/directives/testing-strategy.md`
- `/docs/agent-guidance/architecture.md`
- `/docs/agent-guidance/development-practice.md`
- `/docs/agent-guidance/typescript-practice.md`
- `/docs/agent-guidance/safety-and-security.md`
- `/docs/agent-guidance/ai-agent-guide.md`

End of report.
