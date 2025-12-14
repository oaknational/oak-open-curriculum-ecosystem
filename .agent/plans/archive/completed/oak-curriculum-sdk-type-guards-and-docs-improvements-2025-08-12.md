# Oak Curriculum SDK: Type Guards Export + Docs Improvements Plan (2025-08-12)

## Core References (Grounding)

- GO.md → `./GO.md`
- Rules → `.agent/directives-and-memory/rules.md`
- Testing strategy → `.agent/directives-and-memory/testing-strategy.md`
- Current SDK doc → `packages/oak-curriculum-sdk/docs/oak-open-curriculum-api-sdk-reference.md`

## Intent

Expose existing, generated TypeScript type guards and allowed-values constants through the SDK’s public root entrypoint (additive-only change), and update the documentation to show how to use them safely. Keep API changes strictly additive. Deliver with TDD and full quality gates.

## Current State (Summary)

- Guards and constants exist in `packages/oak-curriculum-sdk/src/types/generated/api-schema/path-parameters.ts`:
  - Guards: `isValidPath`, `isAllowedMethod`, `isKeyStage`, `isSubject`, `isLesson`, `isAssetType`, `isSequenceType`, `isThreadSlug`, `isUnit`, `isValidParameterType`, `isValidPathParameter`.
  - Constants: `PATHS`, `KEY_STAGES`, `SUBJECTS`, `LESSONS`, `ASSET_TYPES`, `SEQUENCE_TYPES`, `THREAD_SLUGS`, `UNITS`, `VALID_PATHS_BY_PARAMETERS`.
- Public API root (`packages/oak-curriculum-sdk/src/index.ts`) does not re-export these.
- Documentation does not mention guards or allowed-lists.
- `package.json` exports map is root-only. We will not change this (scope: additive re-exports only).

## Success Metrics

- SDK consumers can import guards/constants from the root package (e.g., `import { isKeyStage, KEY_STAGES } from '@oaknational/oak-curriculum-sdk'`).
- New unit tests pass and prove behaviour of the guards via public API imports.
- Docs include a succinct “Type Guards and Allowed Values” section with examples, and state Node ≥ 22 support and `apiSchemaUrl`.
- Quality gates pass: format → type-check → lint → test → build.

## Scope

- Additive-only changes to public API: re-export existing guards/constants from root entrypoint.
- Documentation updates only; no breaking changes.

## Non-Goals

- No changes to `package.json` exports map (no new subpath exports).
- No introduction of new runtime validators (e.g., Zod) in this task.
- No behavioural changes to clients beyond exposure of guards/constants.

---

## Action Plan (TDD, atomic tasks)

- GROUNDING: Read GO.md and follow all instructions (this file aligns with GO.md’s ACTION/REVIEW/QUALITY-GATE structure).

1. ACTION: Add failing unit tests for public API exports (TDD)

- File: `packages/oak-curriculum-sdk/src/index.unit.test.ts`
- Tests import from root (interface-first), e.g. `import { isKeyStage, KEY_STAGES, isValidPathParameter } from '.'`.
- Prove behaviour:
  - `isKeyStage('ks2') === true`, `isKeyStage('x') === false`.
  - `KEY_STAGES` contains `'ks1' | 'ks2' | 'ks3' | 'ks4'`.
  - `isValidPathParameter('subject', 'maths') === true`; invalid subject yields `false`.
  - One path/allowed-method spot-check: `isValidPath('/key-stages') === true`.
- Naming: `*.unit.test.ts` per testing strategy.

- REVIEW: Ensure tests assert behaviour (not implementation), import from public API, no mocks, no IO.

- QUALITY-GATE: run `pnpm -w format:check && pnpm -w type-check && pnpm -w lint && pnpm -w -F @oaknational/oak-curriculum-sdk test` (expect failure initially by TDD).

2. ACTION: Publicly re-export guards/constants from root entrypoint (additive-only)

- File: `packages/oak-curriculum-sdk/src/index.ts`
- Add named exports for:
  - Guards: `isValidPath`, `isAllowedMethod`, `isKeyStage`, `isSubject`, `isLesson`, `isAssetType`, `isSequenceType`, `isThreadSlug`, `isUnit`, `isValidParameterType`, `isValidPathParameter`.
  - Constants: `PATHS`, `KEY_STAGES`, `SUBJECTS`, `LESSONS`, `ASSET_TYPES`, `SEQUENCE_TYPES`, `THREAD_SLUGS`, `UNITS`, `VALID_PATHS_BY_PARAMETERS`.
- Do not modify `package.json` exports; keep root-only mapping.

- REVIEW: Confirm export list is additive and appears in `dist/index.d.ts` after build.

- QUALITY-GATE: format → type-check → lint → test (now should pass) → build.

3. ACTION: Update SDK documentation

- File: `packages/oak-curriculum-sdk/docs/oak-open-curriculum-api-sdk-reference.md`
- Add a new section “Type Guards and Allowed Values” with concise examples:
  - Validate inputs before calling the client (`isKeyStage`, `isSubject`, `isValidPathParameter`).
  - Use allowed lists for UI choices (`KEY_STAGES`, `SUBJECTS`, `ASSET_TYPES`).
- Add “Environment & Compatibility” subsection:
  - State Node ≥ 22 (as per `package.json` engines), ESM-only.
- Add mention of `apiSchemaUrl` in Advanced usage alongside `apiUrl`.
- Clarify imports are from the package root.

- REVIEW: Proofread examples for correctness and minimalism; ensure code snippets compile conceptually and align with strict mode.

- QUALITY-GATE: run full gates again; ensure markdown lint (if configured) and no TS errors in snippets where applicable.

4. ACTION: Record experience (Kairos) and outcome

- File: `.agent/experience/2025-08-12-sdk-guards-docs-improvements.md`
- Summarise changes, signals (tests added/passing, dist types include exports), reflections, and next steps.

- REVIEW: Ensure experience log follows team conventions and links to PR/commits.

- QUALITY-GATE: N/A (text-only), but pass pre-commit hooks if any.

- GROUNDING: Re-read GO.md; prune any tasks that are now irrelevant.

---

## Acceptance Criteria

- Public API allows: `import { isKeyStage, KEY_STAGES, isValidPath, isValidPathParameter, isAllowedMethod } from '@oaknational/oak-curriculum-sdk'`.
- Unit tests exist and pass, named `index.unit.test.ts`, importing from root only.
- Docs include a “Type Guards and Allowed Values” section and mention Node ≥ 22 and `apiSchemaUrl`.
- No other public API surface changes beyond additive re-exports.
- All quality gates pass: format → type-check → lint → test → build.

## Risks & Mitigations

- Bundle size increase from re-exports → mitigated by tree-shaking; if needed, future enhancement could add an optional subpath export without breaking the root API.
- Generated file churn → tests target root API, not internals, insulating against generator layout changes.

## Out of Scope / Future Enhancements

- Optional subpath export (e.g., `@oaknational/oak-curriculum-sdk/guards`) for finer-grained tree-shaking.
- Runtime validators (Zod) for API responses and environment config, if/when required by broader plans.

## Quality Gates (Run Order)

- `pnpm -w format:check`
- `pnpm -w type-check`
- `pnpm -w lint`
- `pnpm -w -F @oaknational/oak-curriculum-sdk test`
- `pnpm -w -F @oaknational/oak-curriculum-sdk build`

## Grounding Cadence

- Every third task: “GROUNDING: read GO.md and follow all instructions.”
- Apply rules from `.agent/directives-and-memory/rules.md` throughout and adhere strictly to the testing strategy.
