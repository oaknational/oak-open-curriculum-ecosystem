# TDD Specialist Capability — Strategic Plan

**Status**: NOT STARTED
**Domain**: Agentic Engineering Enhancements
**Pattern**: [ADR-129 (Domain Specialist Capability Pattern)](../../../../docs/architecture/architectural-decisions/129-domain-specialist-capability-pattern.md)
**Refines**: [testing-strategy.md](../../../../.agent/directives/testing-strategy.md)

## Problem and Intent

The repo has a testing strategy directive, but agents still:

- Write tests after implementation (not TDD)
- Confuse test levels (calling an E2E test an "integration test")
- Use `vi.mock` and `vi.stubGlobal` despite the explicit ban
- Write tests that prove the mock works, not the product code
- Skip levels (write unit tests but forget integration/E2E for medium+ work)
- Don't scale their testing approach to the size of the task

The existing `test-reviewer` checks test quality after the fact. What's
missing is a **TDD expert** that guides the testing approach at the START of
work — choosing the right test levels, defining the Red-Green-Refactor
sequence, and ensuring multi-level coverage proportional to task size.

## Scope

### In scope — Multi-Level TDD

The specialist must guide agents to the right testing depth based on task size:

| Task Size | Test Levels Required | Example |
|-----------|---------------------|---------|
| **Small** (single function, bug fix) | Unit tests only | Fix a pure function, add missing edge case |
| **Medium** (feature within a workspace) | Unit + Integration | New MCP tool, new SDK method, new CLI command |
| **Large** (cross-workspace, new capability) | Unit + Integration + E2E | New transport, auth flow change, new workspace |
| **System** (architecture change, migration) | Unit + Integration + E2E + Smoke | Express upgrade, Sentry integration, blue-green ingest |

### In scope — Test Level Definitions (Refined)

These definitions refine `testing-strategy.md`, keeping the "if it runs in CI,
no IO" rule while aligning more closely with industry-standard terminology:

#### Unit Test (`*.unit.test.ts`)

- Tests a single pure function or small module in isolation
- NO IO, NO side effects, NO mocks (pure functions need no mocks)
- Runs in-process, imported directly
- Fast, deterministic, no setup/teardown
- **CI rule**: always runs, no IO

#### Integration Test (`*.integration.test.ts`)

- Tests how multiple units work together as composed code
- Still in-process — imports and calls code directly, NOT a running system
- May use simple injected fakes (NOT `vi.mock`, NOT `vi.stubGlobal`)
- All IO interfaces are replaced with injected fakes
- **CI rule**: always runs, no real IO — fakes replace all IO boundaries

#### E2E Test (`*.e2e.test.ts`)

- Tests a running system from the outside (separate process)
- Uses real process spawning (stdio) or HTTP (supertest/fetch)
- CAN use filesystem and stdio IO
- CANNOT use network IO to external services (for CI safety)
- May use minimal, focused mocks for external service boundaries only
- **CI rule**: runs in CI, filesystem/stdio IO allowed, no network IO

#### UI Test (`*.ui.test.ts`)

- Tests rendered UI components or widget output
- Uses React Testing Library or Playwright component mode
- Validates rendering, interaction, and accessibility
- **CI rule**: runs in CI, no network IO

#### Smoke Test (`*.smoke.test.ts`)

- Tests a deployed or locally-running system end-to-end
- CAN trigger ALL IO types including network
- Validates that the system is alive and responding correctly
- NOT safe for CI without infrastructure — run manually or in staged environments
- **CI rule**: does NOT run in standard CI; requires explicit opt-in

#### Contract Test

- Tests that API boundaries (SDK types, MCP tool schemas, env contracts)
  match their declared contracts
- Uses `satisfies`, schema validation, or snapshot comparison
- Proves that generated types, barrel exports, and public APIs haven't drifted
- **CI rule**: always runs, no IO

### In scope — TDD Workflow Guidance

The skill should guide agents through the multi-level TDD sequence:

1. **Start at the highest affected level** — if system behaviour changes,
   write/update E2E test first (RED)
2. **Work down** — write integration tests for the composition (RED),
   then unit tests for new pure functions (RED)
3. **Implement bottom-up** — make unit tests pass (GREEN), then integration
   (GREEN), then E2E (GREEN)
4. **Refactor** — improve implementation, all levels stay GREEN

### In scope — Anti-Patterns

- `vi.mock` / `vi.doMock` / `vi.stubGlobal` — banned (ADR-078)
- Tests that test the mock, not the product code
- Tests with complex setup that obscures what's being proven
- Skipped tests (`it.skip`, `describe.skip`) — banned
- Testing types at runtime (types are compile-time)
- `process.env` mutation in tests — banned
- Testing external library behaviour (not our code)

### Out of scope

- Test infrastructure and tooling (Vitest config, Playwright setup — config-reviewer)
- Code quality within tests (code-reviewer)
- Test file naming and structure auditing after the fact (test-reviewer)
- Domain-specific test patterns (each domain specialist owns its own testing advice)

## Relationship to test-reviewer

| Concern | test-reviewer | tdd-specialist |
|---------|--------------|----------------|
| **When** | After tests are written | Before/during test writing |
| **Focus** | Quality audit: naming, mock quality, TDD compliance evidence | Workflow guidance: which levels, what sequence, how to Red-Green-Refactor |
| **Mode** | Review (read-only assessment) | Active guidance (skill during implementation) |
| **Output** | Findings and violations | Test plan and TDD sequence |

The tdd-specialist GUIDES the approach. The test-reviewer AUDITS the result.

## Sub-Specialist: Mutation Testing (Stryker)

A focused sub-agent under the TDD specialist umbrella, dedicated to Stryker
mutation testing and — critically — to remediating surviving mutants through
better architecture and better tests, NOT through mutation-specific test hacks.

### Problem

Stryker is already a devDependency with a `pnpm mutate` turbo task. It was
briefly used and needs proper integration (M3 blocker). When mutants survive,
the instinct is to write a test that specifically catches the mutation. This is
fragile, wasteful, and misses the point — a surviving mutant is a signal that
the architecture or the existing tests have a gap, not that a new
mutation-specific test is needed.

### Scope

- Stryker JS configuration and execution (`stryker-mutator.io/docs/stryker-js/`)
- Interpreting mutation reports (survived, killed, no coverage, timeout)
- Remediation strategy for surviving mutants:
  1. **First**: Is the surviving mutant in dead code? Delete the code.
  2. **Second**: Does the surviving mutant reveal a missing behavioural test?
     Write a proper product test that proves the behaviour — a test that would
     be valuable even without mutation testing.
  3. **Third**: Does the surviving mutant reveal an architectural weakness
     (e.g. a side effect that's hard to observe, a branch that's unreachable
     in practice)? Fix the architecture — simplify, extract, make the behaviour
     observable.
  4. **Never**: Write a test whose only purpose is to kill a specific mutant.
     If a test wouldn't exist without mutation testing, it's the wrong test.
- Stryker configuration tuning (mutator selection, file scoping, thresholds)
- CI integration strategy (incremental mutation testing, baseline comparison)
- Mutation score interpretation (100% is not the goal — meaningful coverage is)

### Anti-Patterns (Hard Rules)

1. **No mutation-specific tests** — if a test's sole purpose is to catch a
   Stryker mutant, delete it. Tests must prove product behaviour.
2. **No score chasing** — mutation score is a diagnostic signal, not a KPI.
   A 70% score with meaningful tests beats 95% with brittle mutation catchers.
3. **No ignoring surviving mutants** — every survivor must be triaged:
   dead code (delete), missing behaviour test (write), or architecture gap (fix).
4. **No Stryker config hacks** — don't exclude files or mutators to inflate
   the score. If a mutator produces unhelpful mutations, document why and
   discuss with the team.

### Relationship to Parent TDD Specialist

| Concern | TDD specialist | Mutation testing sub-specialist |
|---------|---------------|-------------------------------|
| **When** | Before/during implementation | After tests exist, during quality hardening |
| **Focus** | Test level selection, Red-Green-Refactor sequence | Surviving mutant triage and remediation |
| **Output** | Test plan | Remediation actions: delete dead code, write behavioural test, or fix architecture |

### Deliverables

1. Canonical reviewer template: `.agent/sub-agents/templates/mutation-testing-reviewer.md`
2. Canonical skill: `.agent/skills/mutation-testing-expert/SKILL.md`
3. Canonical situational rule: `.agent/rules/invoke-mutation-testing-reviewer.md`
4. Platform adapters (Claude, Cursor, Codex)

### Doctrine Hierarchy (Mutation-Specific)

1. **Official Stryker JS documentation** — fetched live from stryker-mutator.io/docs/stryker-js/
2. **Repo testing strategy** — `.agent/directives/testing-strategy.md`
3. **Existing Stryker config** — `stryker.config.mjs` and turbo task definition
4. **Mutation testing execution plan** — `.agent/plans/agentic-engineering-enhancements/active/phase-5-mutation-testing-execution.md`

## Doctrine Hierarchy

1. **Testing strategy directive** — `.agent/directives/testing-strategy.md`
   is the primary authority for testing philosophy and rules
2. **ADR-078** — dependency injection for testability (the "no globals" rule)
3. **Test examples in the repo** — well-structured existing tests as evidence
4. **Industry TDD practice** — Kent Beck, Martin Fowler, London/Chicago schools
   as supplementary context (not authority over repo rules)

## Deliverables

1. Canonical reviewer template: `.agent/sub-agents/templates/tdd-reviewer.md`
   (or `tdd-specialist.md` — naming TBD with taxonomy plan)
2. Canonical skill: `.agent/skills/tdd-expert/SKILL.md`
3. Canonical situational rule: `.agent/rules/invoke-tdd-reviewer.md`
4. Platform adapters (Claude, Cursor, Codex)
5. Discoverability updates
6. Validation

## Workstream: Terminology Standardisation

The current `testing-strategy.md` has terminology that deviates from standard
definitions (e.g. "integration test" means "in-process composition test"
rather than the more common "tests against real external services"). This is
not just a documentation issue — it creates confusion for agents and humans
arriving from other contexts, and the non-standard usage may have propagated
inconsistently across the repo.

### Phase 1: Audit

Before creating the specialist triplet, conduct a deep audit:

1. **Grep the entire repo** for test level terms (`integration test`,
   `e2e test`, `unit test`, `smoke test`) in all contexts: test file names,
   test descriptions, ADRs, plan files, directives, comments, READMEs
2. **Catalogue every usage** and classify whether it aligns with:
   (a) the current testing-strategy.md definitions, or
   (b) industry-standard definitions, or
   (c) neither (ad-hoc/ambiguous)
3. **Map the actual test files** — do files named `*.integration.test.ts`
   actually match the directive's definition of integration test? Or do some
   actually test running systems (which would be E2E by our definition)?
4. **Identify drift** — places where the non-standard terminology has caused
   actual confusion or misclassification

### Phase 2: Remediation Plan

The audit MUST produce a concrete remediation plan before any further work
proceeds. We don't build on broken foundations. The remediation plan must:

1. **Decide on definitions** — choose one of:
   - **Option A**: Standardise on industry definitions everywhere. Rename test
     files and update all documentation. The "if it runs in CI, no IO" rule
     becomes a constraint on which test levels run in CI, not a definitional
     boundary.
   - **Option B**: Keep repo definitions but make the mapping explicit and
     consistent. Acknowledge the difference, document the rationale (CI safety),
     and ensure every usage in the repo is consistent with OUR definitions.
   - **Option C**: Hybrid — adopt standard definitions for new work, leave
     existing tests as-is with a mapping note. (Least disruption, most confusion.)
2. **List every file that needs changing** — test renames, description updates,
   documentation corrections, ADR amendments
3. **Estimate scope** — is this a 1-session fix or a multi-session migration?
4. **Define done-criteria** — grep for each test-level term returns zero
   misclassified usages

The hard invariant either way: **if it runs in CI, no real IO**.

### Phase 3: Execute Remediation

Execute the remediation plan to completion BEFORE creating the specialist
triplet. The triplet must be built on correct, consistent foundations.

### Phase 4: Propagation

After remediation, propagate the standardised definitions across:

- `.agent/directives/testing-strategy.md` (primary authority)
- All ADRs that reference test levels
- All plan files that reference test levels
- All test file descriptions and naming
- The TDD specialist's own skill and reviewer template
- `docs/governance/development-practice.md` if it references test levels
- `CONTRIBUTING.md` if it references test levels

### Phase 5: Create Specialist Triplet

Only after the foundations are clean, create the TDD specialist triplet
(deliverables listed above). The triplet then enforces and maintains the
standardised definitions going forward.

## Promotion Trigger

This plan promotes to `current/` when:

1. TDD compliance issues are recurring across sessions
2. A medium+ task is starting that would benefit from upfront test planning
3. No conflicting work is in progress on the agent artefact layer
