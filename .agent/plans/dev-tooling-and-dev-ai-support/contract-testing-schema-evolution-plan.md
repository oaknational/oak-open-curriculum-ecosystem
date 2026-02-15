# Contract Testing with API Schema Evolution Plan

## Core References

- [AGENT.md](../../directives/AGENT.md)
- [rules.md](../../directives/rules.md)
- [.agent/directives/testing-strategy.md](../../directives/testing-strategy.md)
- [ADR-029: No Manual API Data](../../docs/architecture/architectural-decisions/029-no-manual-api-data.md)
- [ADR-030: SDK as Single Source of Truth](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md)
- [ADR-031: Generation-Time Extraction](../../docs/architecture/architectural-decisions/031-generation-time-extraction.md)
- [ADR-048: Shared Parse Schema Helper](../../docs/architecture/architectural-decisions/048-shared-parse-schema-helper.md)

## Intent

Validate the Cardinal Rule through automated contract testing: prove that when the Oak Curriculum API schema evolves, running `pnpm type-gen` followed by `pnpm build` produces working artefacts across the SDK, MCP servers, and Semantic Search application **without any manual code changes**. The contract test suite must exercise realistic schema evolution scenarios, detect violations of the "zero manual changes" principle, and restore the repository to its original state after each test run while preserving results.

## Success Criteria

- **Contract test harness** that exercises ≥7 realistic schema evolution scenarios (field additions/removals, type changes, enum updates, new endpoints, parameter modifications, response shape changes, breaking changes)
- **Working tree validation** ensures tests abort immediately if the repository has uncommitted changes
- **Automated restoration** returns repository to original state after test runs, preserving results in `.contract-test-results/` (untracked)
- **Full-stack validation** covers SDK type generation, MCP tool catalogue updates, and Semantic Search mapping adjustments
- **Violation detection** pinpoints any hardcoded paths, duplicate type definitions, manual validation logic, or schema-dependent code that fails to adapt
- **Documentation completeness** explains synthetic schema design, how to add new scenarios, and interpreting test results

## Success Metrics

- **Execution speed**: Complete contract test suite runs in ≤8 minutes on a development machine
- **Coverage depth**: Each scenario exercises SDK generation, at least one MCP server (stdio or HTTP), and Search service integration where schema impacts indexing or queries
- **Detection accuracy**: Zero false positives (legitimate manual changes are not flagged), zero false negatives (violations are caught)
- **Reproducibility**: Test results are deterministic; repeated runs with same schema produce identical outcomes
- **Restoration reliability**: Repository state restored to original commit in 100% of test runs, even on failure
- **Scenario authoring flow**: New evolution scenario added and validated by following the standard template without ad-hoc steps or manual fixes; documented in contribution guide with concrete examples

## Milestones

| Milestone                           | Description                                                                                                                          | Exit Criteria                                                                                                                                            |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **M1 – Foundation**                 | Audit type-gen pipeline, design working tree validation, implement restoration mechanism, create synthetic schema repository         | Audit document merged; working tree guard implemented; restoration tested manually; schema repo structure defined with ≥3 example scenarios              |
| **M2 – Core Scenarios**             | Implement 7 priority evolution scenarios with SDK, MCP, and Search validation; automated assertion framework                         | 7 scenarios pass with current schema; SDK types, MCP tools, Search mappings validated; violations detected for intentionally broken scenarios            |
| **M3 – Integration & Reporting**    | Integrate with existing test infrastructure, generate structured test reports, add scenario contribution guide                       | Contract tests invokable via `pnpm test:contract`; JSON + markdown reports in `.contract-test-results/`; contribution guide merged                       |
| **M4 – Documentation & Governance** | ADR documenting strategy, README updates, quality gate integration guidance (local fail-fast), CI preparation (future consideration) | ADR-0XX published; README and onboarding docs reference contract tests; high-level-plan.md updated; backlog item closed; CI integration guide documented |

## Prerequisites: Understanding Current Infrastructure

### 1. Type-Gen Pipeline Audit

**Objective**: Map the complete OpenAPI → SDK → Apps transformation pipeline to identify injection points for synthetic schemas.

- **Audit current process**:
  - `pnpm type-gen` at repo root triggers `turbo run --continue type-gen`
  - SDK workspace (`packages/sdks/oak-curriculum-sdk/`) executes:
    - `pregenerate:types` → `pnpm generate:clean` (removes `src/types/generated`)
    - `generate:types` → `pnpm generate:openapi && pnpm generate:zod`
    - `generate:openapi` → `tsx type-gen/typegen.ts`
    - `generate:zod` → `tsx type-gen/zodgen.ts`
    - `posttype-gen` → `pnpm -w format:root`
- **Schema flow**:
  - Original schema fetched/cached in `packages/sdks/oak-curriculum-sdk/schema-cache/`
  - Decoration applied (canonical URLs, derived metadata) → `src/types/generated/api-schema/api-schema-sdk.json`
  - Types generated → `src/types/generated/api-schema/`
  - Zod schemas generated → `src/types/generated/zod/`
  - MCP tools generated via `type-gen/mcp-toolgen.ts`
- **Downstream consumption**:
  - MCP servers import SDK types, tool metadata, validators
  - Semantic Search imports SDK schemas, validation helpers
  - Changes propagate via TypeScript compiler and import resolution
- **Documentation**: Record findings in `.contract-tests/docs/pipeline-audit.md` with sequence diagrams showing schema → generated artefact → consumer flow

### 2. Working Tree State Management

**Objective**: Ensure contract tests operate only on clean repositories and restore state reliably.

- **Clean working tree validation**:
  - Implement pre-flight check: `git status --porcelain` must return empty output
  - Fail immediately with actionable error: "Contract tests require clean working tree. Commit or stash changes before running `pnpm test:contract`."
  - Check for untracked files in generated paths (`src/types/generated/`, `dist/`) and warn if present
  - Verify no ongoing merge/rebase/cherry-pick operations (check `.git/MERGE_HEAD`, `.git/REBASE_HEAD`, `.git/CHERRY_PICK_HEAD`)
- **State capture mechanism**:
  - Record current HEAD commit: `git rev-parse HEAD`
  - Create temporary branch: `git checkout -b contract-test-temp-$(date +%s)`
  - Tag entry point: `git tag contract-test-entry-$(date +%s)`
- **Restoration strategy**:
  - On success or failure: `git checkout <original-branch>` and `git reset --hard <original-commit>`
  - Delete temporary branch/tag: `git branch -D contract-test-temp-*` and `git tag -d contract-test-entry-*`
  - Verify restoration: re-run `git status --porcelain` to confirm clean state
  - Handle edge cases: detached HEAD, dirty index, merge conflicts (abort and fail loudly)
- **Results preservation**:
  - Write all test outputs to `.contract-test-results/` (added to `.gitignore`)
  - Include: JSON report, markdown summary, synthetic schemas used, diff outputs, error logs
  - Timestamp each run: `.contract-test-results/run-2025-09-30-13-15-07/`

### 3. Synthetic Schema Repository Design

**Objective**: Create a library of realistic schema evolution scenarios that can be injected into the type-gen pipeline.

- **Schema storage structure**:

  ```text
  .contract-tests/
    schemas/
      baseline/
        oak-openapi-v0.5.0.json          # Current production schema (reference)
      scenarios/
        01-add-optional-field/
          description.md                 # Intent, expected outcome, validation criteria
          schema.json                    # Evolved schema
          expected-changes.md            # Which files should change (e.g., Zod schemas, MCP tools)
        02-add-required-parameter/
          description.md
          schema.json
          expected-changes.md
        03-remove-deprecated-endpoint/
          ...
        04-enum-value-addition/
          ...
        05-response-shape-change/
          ...
        06-new-endpoint-addition/
          ...
        07-breaking-type-change/
          ...
  ```

- **Scenario design principles**:
  - Each scenario is self-contained with clear intent documentation
  - Scenarios mirror real API evolution patterns (not contrived edge cases)
  - Expected changes documented to guide validation assertions
  - Scenarios include both non-breaking (backward-compatible) and breaking changes
  - A helper script (`.contract-tests/bin/refresh-scenarios.ts`) diffs the
    latest published OpenAPI schema against the baseline snapshot and produces
    guidance for updating synthetic scenarios while keeping history intact
  - Scenario READMEs cross-reference [.agent/directives/testing-strategy.md](../../directives/testing-strategy.md)
    and [docs/agent-guidance/development-practice.md](../../docs/agent-guidance/development-practice.md)
    so contributors follow repository-wide testing and TDD expectations
- **Schema decoration simulation**:
  - Contract test harness applies canonical URL decoration to synthetic schemas
  - Ensures decorated schema matches production decoration logic
  - Validates that decoration process itself is schema-driven
- **Schema sync workflow**:
  - Run `.contract-tests/bin/refresh-scenarios.ts` after `pnpm type-gen` updates production schema
  - Utility pulls latest schema from `schema-cache/`, compares against baseline in `.contract-tests/schemas/baseline/`, computes checksum
  - Writes guidance report to `.contract-test-results/schema-sync-report-YYYY-MM-DD.md` (untracked) listing detected changes and suggested scenario updates
  - Review report monthly; manually update scenario snapshots and descriptions based on guidance
  - Update baseline snapshot checksum in `.contract-tests/schemas/baseline/metadata.json` after synchronisation
  - Document rationale for updates in scenario READMEs per contribution guide
  - Utility is read-only: never modifies tracked files, only emits recommendations

### 4. Violation Detection Strategy

**Objective**: Define clear criteria for "zero manual changes" and implement automated checks to detect violations.

- **Prohibited patterns (from ADR-029)**:
  - Hardcoded API paths (regex: `['"]/[a-z-/]+/{[a-z]+}[/'"]`)
  - Manual parameter definitions (search for Zod schemas outside `src/types/generated/`)
  - Duplicate type definitions (compare type names in generated vs non-generated files)
  - Manual validation logic (functions matching `validate[A-Z]` outside SDK validation module)
  - Manual enum definitions (TypeScript enums outside generated files)
- **Permitted patterns**:
  - Decorative metadata keyed by `operationId` (e.g., enhanced descriptions, examples, categories)
  - SDK imports and re-exports
  - Tool generation consuming SDK exports
  - Test fixtures and mocks (clearly marked)
- **Detection implementation**:
  - Stage 1 – Static analysis (ts-morph): traverse source tree once, flag
    prohibited constructs with file/line context; reuse AST to avoid repeated
    parsing (aligns with [ADR-030](../../docs/architecture/architectural-decisions/030-sdk-single-source-truth.md))
  - Stage 2 – Git diff heuristics: compare working tree against baseline
    commit; generated paths (`src/types/generated/**`) may change while
    hand-authored code must remain untouched (fixtures excluded via allowlist)
  - Stage 3 – Runtime smoke assertions: execute MCP server smoke tests to
    confirm tool catalogue reflects schema-driven updates (leverages
    `smoke-tests/smoke-suite.ts` live-mode semantics invoked via
    `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http smoke:dev:live`)
  - Stage 4 – Aggregation: merge findings into a single JSON report with
    severity labels and remediation tips referencing relevant ADRs/test docs
- **Reporting**:
  - List violations with file path, line number, code snippet, violation type
  - Classify by severity: CRITICAL (blocks Cardinal Rule), WARNING (potential
    issue), INFO (allowed pattern) and cross-reference remediation guidance in
    [.agent/directives/testing-strategy.md](../../directives/testing-strategy.md)

### 5. Downstream Validation Scope

**Objective**: Define which consuming applications and integration points must be validated for each scenario.

- **SDK validation** (always required):
  - Types generated in `src/types/generated/api-schema/`
  - Zod schemas generated in `src/types/generated/zod/`
  - MCP tools generated in `src/types/generated/api-schema/mcp-tools.ts`
  - Validation helpers remain functional (parseSchema, parseEndpointParameters, etc.)
  - Build succeeds: `pnpm build` in SDK workspace
  - Type-check passes: `pnpm type-check` in SDK workspace
  - Tests pass: `pnpm test` in SDK workspace
- **MCP server validation** (stdio or HTTP, alternating per scenario):
  - Tool catalogue updates reflect new/changed endpoints
  - Server builds successfully: `pnpm build` in MCP workspace
  - Smoke tests pass with stub executors: validate tool invocation without API calls
  - Integration tests pass: MCP protocol compliance maintained
- **Semantic Search validation** (selective, based on scenario impact):
  - If schema affects search endpoints: validate search response parsing
  - If schema affects indexed entities: validate enrichment transforms
  - Build and type-check pass in Search workspace
  - Relevant unit tests pass
- **Cross-cutting validation**:
  - Root type-check: `pnpm type-check` at repo root succeeds
  - Turbo build: `pnpm build` at repo root succeeds
  - Quality gates (format, lint) pass on generated code

### Scenario Validation Matrix

| Scenario archetype           | SDK assertions                                          | MCP assertions                                               | Search assertions                                        |
| ---------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------- |
| Add optional/required fields | Regenerate types/Zod; ensure no manual patches needed   | Verify tool input/output schemas update automatically        | If response consumed, ensure enrichment transform adapts |
| Add/remove endpoints         | Confirm new/removed operations in generated catalogue   | Tool list parity reflects change; smoke test can invoke tool | Update query mappings only if schema drives behaviour    |
| Enum evolution               | Union/validator expands or shrinks as expected          | Tool validation rejects unsupported values automatically     | Spotlight search facets updated when schema-driven       |
| Response reshape             | Interfaces & Zod match new shape; helper functions pass | Tool success payload serialisation reflects new structure    | Search indexing code consumes new fields via schema maps |
| Breaking type changes        | Type-check intentionally fails in dependent samples     | Tool metadata reflects new types; smoke captures errors      | Downstream query builders fail fast until schema adapted |

The matrix should be refined per scenario. Each scenario README must list the
exact SDK packages, MCP servers, and Search modules it exercises so reviewers
can audit coverage quickly.

## Strategic Roadmap

### Phase 0 – Discovery & Foundation (Readiness: Baseline)

**Objective**: Complete prerequisite audits, design core infrastructure, establish governance.

1. ACTION: Execute type-gen pipeline audit following methodology in Prerequisites §1, documenting schema flow, script execution order, decoration logic, and downstream consumers in `.contract-tests/docs/pipeline-audit.md`.
2. REVIEW: Self-review audit document ensuring all touchpoints identified, sequence diagrams clear, and no assumptions about schema structure made.
3. ACTION: Design working tree state management system following Prerequisites §2, implementing clean-state validation, restoration mechanism, and results preservation strategy in `.contract-tests/lib/state-manager.ts`.
4. REVIEW: Self-review state manager design for edge case handling (detached HEAD, merge state, stash conflicts) and fail-safe behaviour (always restore or abort).
5. QUALITY-GATE: Implement state manager and verify with manual tests: run on clean repo, dirty repo, detached HEAD, mid-merge; confirm restoration works in all cases.
6. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; assess whether current approach aligns with First Question (could it be simpler?).
7. ACTION: Design synthetic schema repository structure following Prerequisites §3, creating directory layout, scenario template, baseline schema snapshot in `.contract-tests/schemas/`, and a sync utility (`.contract-tests/bin/refresh-scenarios.ts`) that: pulls the latest official OpenAPI schema from `schema-cache/`, compares against the baseline snapshot in `.contract-tests/schemas/baseline/`, computes a checksum, and writes a guidance report to `.contract-test-results/schema-sync-report-YYYY-MM-DD.md` (untracked) listing detected changes and suggested scenario updates without modifying any tracked files.
8. REVIEW: Self-review schema repository design ensuring scenarios are realistic, self-documenting, maintainable by future contributors, and that the sync utility records provenance (schema version, date) without mutating tracked files unexpectedly.
9. ACTION: Document violation detection strategy following Prerequisites §4, defining prohibited patterns, detection algorithms, and reporting format in `.contract-tests/docs/violation-detection.md`.
10. REVIEW: Self-review violation strategy confirming alignment with ADR-029 and Cardinal Rule; verify detection approach is automatable via static analysis.
11. QUALITY-GATE: Validate synthetic schema structure by manually copying baseline schema, applying one simple modification (add optional field), and confirming schema parses correctly.
12. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; update Foundation phase approach if insights suggest simplification.

**Exit Criteria**: Audit document merged; state manager tested; schema repository scaffolded with baseline + 1 example scenario; violation detection strategy documented and approved.

### Phase 1 – Test Harness Implementation (Readiness: Harness Operational)

**Objective**: Build core test harness that orchestrates schema injection, generation, validation, and restoration.

13. ACTION: Implement contract test runner framework in `.contract-tests/runner/` exposing `runContractTest(scenarioPath)` function that: validates clean working tree, captures state, injects synthetic schema, runs type-gen, runs build, validates outputs, restores state, preserves results.
14. REVIEW: Self-review test runner for proper error handling, atomic operations (all-or-nothing), and clear logging at each step.
15. ACTION: Implement schema injection mechanism in `.contract-tests/lib/schema-injector.ts` that: backs up original schema-cache, copies synthetic schema to schema-cache, triggers decoration process, verifies decorated schema written to `src/types/generated/api-schema/api-schema-sdk.json`.
16. REVIEW: Self-review schema injector ensuring decoration logic mirrors production behaviour and injection is reversible.
17. QUALITY-GATE: Execute test runner against baseline schema (no changes); verify: clean tree validated, state captured, schema injected, type-gen runs, build succeeds, state restored, results written to `.contract-test-results/`.
18. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; confirm test runner adheres to TDD principles and testing strategy guidance.
19. ACTION: Implement violation detector in `.contract-tests/lib/violation-detector.ts` using ts-morph to parse generated and non-generated files, applying detection patterns from Prerequisites §4, emitting structured violation reports.
20. REVIEW: Self-review violation detector for correctness of AST traversal, false positive minimisation, and clear error messages.
21. QUALITY-GATE: Test violation detector with intentionally broken code (hardcoded path, manual enum) in a temporary branch; confirm violations detected and reported accurately.
22. ACTION: Implement downstream validator in `.contract-tests/lib/downstream-validator.ts` that: runs `pnpm build` in SDK/MCP/Search workspaces, executes smoke tests, runs type-check, collects outcomes, reports success/failure per workspace.
23. REVIEW: Self-review downstream validator ensuring workspace isolation (failures in one don't block others), parallel execution where safe, and comprehensive error capture.
24. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; reassess harness complexity and consider simplification opportunities.

**Exit Criteria**: Test harness functional end-to-end with baseline schema; state management verified; schema injection working; violation detection operational; downstream validation covering SDK + one MCP server.

### Phase 2 – Core Scenario Implementation (Readiness: Scenario Coverage)

**Objective**: Implement 7 priority schema evolution scenarios with full validation.

25. ACTION: Create Scenario 01 "Add Optional Field" – add optional field to existing response schema in synthetic JSON (e.g., `Lesson.estimatedDuration?: number`), document expected changes (Zod schema update, TypeScript interface extended, no MCP tool inputSchema changes), implement test assertions per validation matrix, include cross-references to testing-strategy.md.
26. REVIEW: Self-review scenario ensuring schema modification is realistic, expected changes documented clearly, and test assertions validate correct outcomes.
27. QUALITY-GATE: Execute Scenario 01 via test harness; verify: SDK types updated, Zod schema includes new field, MCP tools unchanged, build succeeds, type-check passes, violation detector reports zero issues.
28. ACTION: Create Scenario 02 "Add Required Parameter" – add required query parameter to endpoint (e.g., `GET /lessons/{lesson}/transcript?format=string` where `format` is required), document expected changes (parameter types updated, MCP tool inputSchema includes new required field, consumer type-check fails if parameter omitted), implement assertions validating fail-fast behaviour per validation matrix.
29. REVIEW: Self-review scenario confirming breaking change is correctly modelled and downstream impact (compilation failures) is expected and acceptable.
30. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; validate that scenario design aligns with real API evolution patterns observed in Oak API history.
31. QUALITY-GATE: Execute Scenario 02; verify: SDK parameter types updated, MCP tool definitions include new parameter, consumers lacking parameter fail type-check (expected), manual updates NOT required in SDK or MCP layers.
32. ACTION: Create Scenario 03 "Remove Deprecated Endpoint" – remove deprecated endpoint from schema (e.g., legacy `GET /search/transcripts`), document expected changes (operation types removed from SDK, MCP tool absent from catalogue, no orphaned imports), implement assertions confirming clean removal without manual edits per validation matrix.
33. REVIEW: Self-review scenario ensuring removed types/tools leave no orphaned references in generated code.
34. QUALITY-GATE: Execute Scenario 03; verify: endpoint types gone from SDK, MCP tool absent from catalogue, dependent tests updated or removed automatically (if designed to be schema-driven), build succeeds.
35. ACTION: Create Scenario 04 "Enum Value Addition" – add value to existing enum (e.g., `KeyStage` union adds `'eyfs'`), document expected changes (TypeScript union type extended, Zod enum validator accepts new value, existing values remain valid), validate backward compatibility per validation matrix.
36. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; ensure scenario suite remains balanced between breaking and non-breaking changes.
37. REVIEW: Self-review scenario confirming enum extension is non-breaking (existing values still valid) and downstream code handles new value gracefully.
38. QUALITY-GATE: Execute Scenario 04; verify: enum types extended, Zod validators accept new value, MCP tool schemas updated, existing valid values still work.
39. ACTION: Create Scenario 05 "Response Shape Change" – modify nested object structure in response (e.g., flatten `Lesson.metadata.subject` to `Lesson.subjectSlug`), document expected changes (interface reshaping, Zod schema updates, Search enrichment adapts if schema-driven or flagged for manual review), validate propagation per validation matrix.
40. REVIEW: Self-review scenario ensuring shape change is realistic (e.g., flattening nested objects, renaming fields) and tests confirm all consumers adapt.
41. QUALITY-GATE: Execute Scenario 05; verify: SDK types reflect new shape, Zod validation enforces new structure, Search enrichment logic adapts if schema-driven (or is flagged as requiring manual update if not), type-check passes.
42. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; assess whether scenario coverage is sufficient to validate Cardinal Rule across diverse change types.
43. ACTION: Create Scenario 06 "New Endpoint Addition" – add entirely new endpoint (e.g., `GET /sequences/{sequence}/questions`), document expected changes (new operation types generated, new MCP tool appears in catalogue with correct inputSchema/outputSchema, smoke test can invoke tool), validate automatic integration per validation matrix.
44. REVIEW: Self-review scenario confirming new endpoint is fully integrated without manual configuration, including tool catalogue registration.
45. QUALITY-GATE: Execute Scenario 06; verify: new types generated, new MCP tool appears in catalogue, tool metadata includes correct inputSchema/outputSchema, smoke test invokes new tool successfully.
46. ACTION: Create Scenario 07 "Breaking Type Change" – change existing field type (e.g., `Lesson.order: string` → `Lesson.order: number`), document expected changes (SDK types updated, Zod validators enforce new type, downstream consumers using old type fail type-check with clear error messages), validate fail-fast behaviour per validation matrix and testing-strategy.md expectations.
47. REVIEW: Self-review scenario confirming breaking change is correctly identified, compilation errors are intentional and expected, and SDK/MCP layers adapt without manual edits.
48. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; finalize scenario suite and prepare for integration phase.
49. QUALITY-GATE: Execute Scenario 07; verify: SDK types changed, Zod validators enforce new type, consumers using old type fail type-check (expected), SDK and MCP layers compile successfully.

**Exit Criteria**: 7 scenarios implemented and passing; each scenario validated across SDK + at least one MCP server; violation detector confirms zero prohibited patterns; test results documented in `.contract-test-results/`.

### Phase 3 – Integration & Reporting (Readiness: Reporting Complete)

**Objective**: Integrate contract tests into repo workflow, implement structured reporting, enable contribution.

50. ACTION: Add `test:contract` script to root `package.json` invoking test harness: `tsx .contract-tests/runner/cli.ts --all`, document usage in repo README and testing-strategy.md.
51. REVIEW: Self-review script integration ensuring tests abort on dirty working tree, emit clear pass/fail output, and don't interfere with existing test commands.
52. QUALITY-GATE: Run `pnpm test:contract` from clean repo; verify: all 7 scenarios execute, results written to `.contract-test-results/`, repo restored to original state, exit code reflects pass/fail.
53. ACTION: Implement structured reporting in `.contract-tests/lib/reporter.ts` generating JSON report (machine-readable) and markdown summary (human-readable) with: scenario outcomes, violated patterns, downstream validation results, timing metrics, recommendations.
54. REVIEW: Self-review reporter ensuring outputs are actionable, violations are clearly explained with remediation guidance, and reports link to relevant ADRs and documentation.
55. QUALITY-GATE: Generate reports for all scenarios; verify: JSON is valid and parseable, markdown is well-formatted, metrics match success criteria, zero false positives/negatives.
56. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; confirm integration aligns with repo quality gate philosophy and contributor workflow.
57. ACTION: Write scenario contribution guide in `.contract-tests/docs/contributing-scenarios.md` explaining: how to design realistic evolution (with examples from Scenarios 01-07), synthetic schema authoring workflow (baseline snapshot → modify → document → validate), expected changes documentation template, test assertion creation referencing validation matrix, validation criteria aligned with testing-strategy.md, when to run `refresh-scenarios.ts` to detect drift.
58. REVIEW: Self-review contribution guide for clarity, completeness, and accessibility to developers and AI agents; ensure alignment with British spelling and documentation conventions.
59. QUALITY-GATE: Ask external reviewer (or simulate with self-review) to follow guide and create one new scenario; validate guide is sufficient without additional context.
60. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; finalize integration phase deliverables.

**Exit Criteria**: Contract tests invokable via `pnpm test:contract`; reports generated automatically; contribution guide merged and tested; integration documented in testing-strategy.md.

### Phase 4 – Documentation & Governance (Readiness: Operationalised)

**Objective**: Formalize contract testing strategy, update governance documents, prepare for CI integration (future).

61. ACTION: Draft ADR-0XX "Contract Testing Strategy for Schema Evolution" documenting: motivation (Cardinal Rule validation), approach (synthetic schemas + full-stack validation), design decisions (working tree requirements, restoration mechanism), governance (fail-fast local execution, future CI integration), alternatives considered.
62. REVIEW: Self-review ADR ensuring alignment with existing ADRs (029, 030, 031, 048), clear justification for design choices, and British spelling throughout.
63. QUALITY-GATE: Submit ADR for review (self-review or team review); address feedback; merge to `docs/architecture/architectural-decisions/`.
64. ACTION: Update root README.md and `docs/development/onboarding.md` with contract testing section: purpose, when to run (`pnpm test:contract`), interpreting results, adding scenarios, troubleshooting.
65. REVIEW: Self-review documentation updates for consistency with existing structure, clarity for new contributors, and appropriate level of detail.
66. QUALITY-GATE: Run `pnpm doc-gen` and verify generated docs include contract testing references; check for broken links via `pnpm markdownlint-check:root`.
67. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; prepare final deliverables and close-out review.
68. ACTION: Update `.agent/plans/high-level-plan.md` adding milestone entry: "M5: Contract Testing – Schema evolution validation automated via synthetic scenarios, fail-fast local execution, future CI integration planned."
69. REVIEW: Self-review high-level plan update ensuring contract testing milestone is correctly positioned and linked to relevant documentation.
70. ACTION: Update `.agent/plans/backlog.md` removing general "contract testing" item and replacing with link to this plan; mark as "COMPLETED – see contract-testing-schema-evolution-plan.md".
71. QUALITY-GATE: Run full quality gate suite (`pnpm qg`) excluding contract tests (to avoid dirty tree issues); verify all gates pass; confirm contract tests remain invokable separately via `pnpm test:contract`.
72. GROUNDING: Read `.agent/prompts/GO.md` and follow all instructions; conduct final self-review of entire deliverable against Intent and Success Criteria.
73. ACTION: Write CI integration preparation guide in `.contract-tests/docs/ci-integration.md` documenting: requirements for CI environment (clean checkout, restoration reliability, result artifact upload), recommended cadence (nightly builds, post-merge to main), failure notification strategy.
74. REVIEW: Self-review CI guide ensuring it provides clear path for future CI integration without requiring immediate implementation; document trade-offs and considerations.
75. QUALITY-GATE: Final acceptance test – run `pnpm test:contract` on clean repo, verify all scenarios pass, confirm results in `.contract-test-results/`, validate repo restored, review markdown report for completeness.

**Exit Criteria**: ADR-0XX published; README and onboarding docs updated; high-level-plan.md and backlog.md updated; CI preparation guide documented; all quality gates pass; contract testing fully operational and documented.

## Governance & Reporting

- **Weekly self-review cadence**: Summarize progress against milestones, identify blockers, update risk register (working tree edge cases, schema decoration complexity, downstream validation scope creep).
- **Quality gate discipline**: Run `pnpm format:root`, `pnpm type-check`, `pnpm lint:fix`, `pnpm test` after each action cluster (every 3-5 tasks) to ensure incremental deliverables remain in green state.
- **Documentation currency**: Update `.contract-tests/docs/progress.md` after each phase with: completed tasks, lessons learned, design decisions, deferred items.
- **Scenario validation checkpoints**: After implementing each scenario (Phase 2), run full test harness and validate outcomes match expected changes documentation before proceeding.
- **Change control**: Any modifications to synthetic schema structure or test harness API require: update to contribution guide, validation via one test scenario, approval via self-review or plan amendment.

## Risk Register

| Risk                                                        | Likelihood | Impact | Mitigation                                                                                                                                                                                                                           |
| ----------------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Schema decoration logic differs between production and test | Medium     | High   | Reuse production decoration scripts in test harness; add unit tests for decoration logic; validate decorated schema shape                                                                                                            |
| Working tree restoration fails due to merge conflicts       | Low        | High   | Implement pre-flight check for merge state; abort contract tests if repo in merge/rebase; document in troubleshooting                                                                                                                |
| Violation detector produces false positives                 | Medium     | Medium | Maintain allowed patterns whitelist; include test fixtures exemption; tune detection rules based on initial results                                                                                                                  |
| Downstream validation scope creep (too many workspaces)     | Medium     | Medium | Start with SDK + one MCP server per scenario; expand coverage incrementally; document validation matrix                                                                                                                              |
| Synthetic schema scenarios become stale as API evolves      | High       | Medium | Run `refresh-scenarios.ts` after each `pnpm type-gen`; review guidance report monthly; store schema version and checksum in baseline metadata; document sync workflow in contribution guide; add quarterly scenario audit to backlog |
| Test harness complexity exceeds maintainability threshold   | Low        | Medium | Follow TDD strictly; extract pure functions; comprehensive inline docs; contribution guide with examples                                                                                                                             |
| CI integration blocked by environment constraints (future)  | Low        | Low    | Document CI requirements early; validate restoration in isolated containers; design for CI-agnostic execution                                                                                                                        |
| Scenario authoring time exceeds success metric (45 minutes) | Medium     | Low    | Provide scenario template with examples; automate schema diffing; include validation helper CLI                                                                                                                                      |

## Deferred Items & Future Enhancements

- **CI Integration**: Plan documents requirements, but implementation deferred until local execution proven stable and scenarios mature (estimated 3-6 months post-rollout).
- **Automated schema diffing**: Enhance `refresh-scenarios.ts` to generate expected-changes.md templates by analysing OpenAPI diffs (accelerates scenario authoring).
- **Mutation testing for contract tests**: Validate that intentionally broken scenarios (manual code edits) are detected by violation detector (meta-testing the tests).
- **Cross-repository validation**: Extend contract tests to downstream consumers outside this monorepo (e.g., external applications using published SDK package).
- **Performance benchmarking**: Track type-gen + build times across schema versions to detect performance regressions introduced by schema complexity growth.
- **Schema evolution analytics**: Aggregate contract test results over time to identify API evolution patterns and inform schema design best practices.

## Related Work & Dependencies

- **Stryker Integration Plan** (`.agent/plans/stryker-integration-plan.md`) – mutation testing validates quality of unit tests; contract testing validates adherence to Cardinal Rule; complementary strategies.
- **OpenAPI Framework Extraction Plan** (`.agent/plans/openapi-to-mcp-framework-extraction-plan.md`) – contract testing provides validation evidence that OpenAPI → SDK → Apps pipeline is robust; supports extraction roadmap.
- **Semantic Search Target Alignment Plan** (`.agent/plans/semantic-search/semantic-search-target-alignment-plan.md`) – contract scenarios must include Search service validation where schema affects indexed entities or query responses.
- **ADR-029, ADR-030, ADR-031** – contract testing operationalizes these architectural decisions; provides continuous validation that principles are maintained.

## Success Validation Checklist

Before marking this plan as COMPLETE, verify:

- [ ] All 7 core scenarios implemented and passing consistently
- [ ] Test harness executes in ≤8 minutes on development machine
- [ ] Working tree validation and restoration tested across edge cases (clean, dirty, detached HEAD, merge state)
- [ ] Violation detector validated with intentionally broken code (zero false positives/negatives)
- [ ] Downstream validation covers SDK + at least two MCP servers + Search (selective)
- [ ] Results preservation in `.contract-test-results/` working reliably
- [ ] Structured reports (JSON + markdown) generated and actionable
- [ ] Contribution guide tested by creating one new scenario following documented process
- [ ] ADR-0XX published and referenced in relevant docs
- [ ] README, onboarding, testing-strategy, high-level-plan, backlog all updated
- [ ] `pnpm test:contract` invokable from repo root with clear pass/fail output
- [ ] Full quality gate suite (`pnpm qg`) passes (excluding contract tests to avoid dirty tree)
- [ ] CI integration preparation guide documented for future implementation
- [ ] Zero open questions or unresolved design decisions
- [ ] All deliverables reviewed per `.agent/prompts/GO.md` cadence (self-review + grounding steps)

---

**Priority**: P1 (Detailed planning phase; implementation deferred pending capacity and prioritisation)

**Effort Classification**: Large, multi-phase initiative covering foundation, scenario implementation, reporting, and governance readiness; estimated 10-12 weeks with TDD discipline and quality gate adherence

**Dependencies**: None blocking; enhances existing infrastructure; complements Stryker integration and OpenAPI framework extraction plans

**Owner**: TBD (plan ready for assignment)

**Status**: REVIEWED (second-pass review complete; ready for sign-off and incorporation into high-level-plan.md)
