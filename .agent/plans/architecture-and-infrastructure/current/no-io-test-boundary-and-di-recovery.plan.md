---
name: "No-IO Test Boundary and DI Recovery"
overview: "Executable architecture plan to restore ADR-078 dependency-injection boundaries so unit, integration, and E2E tests directly prove domain/application behaviour with simple fakes and no IO."
todos:
  - id: ws0-inventory-and-boundary-map
    content: "Inventory unit, integration, and E2E tests that import IO, spawn processes, read env, use temp dirs, or require production adapters; classify each by the product boundary that made IO feel necessary."
    status: pending
  - id: ws1-testable-use-case-extraction
    content: "Extract direct domain/application use-case surfaces for each high-priority offender, with explicit dependency arguments and no production defaults on imported testable code."
    status: pending
    depends_on: [ws0-inventory-and-boundary-map]
  - id: ws2-test-rewrite-with-simple-fakes
    content: "Rewrite the affected unit, integration, and E2E tests to call code under test directly with trivial fakes; remove temp dirs, filesystem reads/writes, network, child-process, env, timer, and watcher effects."
    status: pending
    depends_on: [ws1-testable-use-case-extraction]
  - id: ws3-enforcement-hardening
    content: "Promote no-IO-in-tests enforcement from partial warning coverage to hard failure for unit, integration, and E2E tests, while routing any true adapter smoke checks outside those suites."
    status: pending
    depends_on: [ws2-test-rewrite-with-simple-fakes]
  - id: ws4-doctrine-and-consolidation
    content: "Update ADR-078/testing-strategy-adjacent docs only where needed, record any smoke-test routing, run consolidation, and publish the completion verdict from deterministic evidence."
    status: pending
    depends_on: [ws3-enforcement-hardening]
---

# No-IO Test Boundary and DI Recovery

**Last Updated**: 2026-05-13
**Status**: QUEUED
**Collection**: architecture-and-infrastructure
**Source findings**:
[no-io-tests-and-di-boundary-report.md](../../../reports/agentic-engineering/deep-dive-syntheses/no-io-tests-and-di-boundary-report.md)

---

## End Goal

Unit, integration, and E2E tests in this repo prove only our domain and
application logic. They do not prove the filesystem, network, process model,
environment, timers, watchers, stdout, or other OS services.

## Mechanism

The plan restores the ADR-078 dependency-injection model:

1. product behaviour is exposed as direct domain/application use-case
   functions;
2. those functions accept every dependency as an explicit argument;
3. tests pass simple fakes directly to the function under test;
4. production IO is wired only in composition roots and adapters;
5. lint prevents future unit, integration, or E2E tests from importing or
   triggering IO.

## Means

The work is a repo-wide architecture recovery lane, separate from P5. It uses
the current P5 finding as the seed but does not make P5 responsible for every
historical offender.

## Prerequisite Classification

| Prerequisite | Classification | Minimum shippable shape without it |
| --- | --- | --- |
| ADR-078 and `.agent/directives/testing-strategy.md` remain authoritative. | blocking | None. This plan exists to restore those boundaries. |
| Current P5 no-IO findings are recorded. | blocking | None. They are the triggering evidence. |
| Every workspace can be repaired in one pass. | beneficial | Start with `agent-tools/`, then promote additional workspace slices. |
| Adapter smoke-test routing is fully designed before cleanup starts. | beneficial | Move obvious adapter checks out of unit/integration/E2E first; document remaining unknowns. |

## Non-Goals

- Do not test filesystem, network, OS process, watcher, timer, UUID, or stdout
  correctness.
- Do not hide IO behind test helpers.
- Do not use complex mocks.
- Do not preserve production defaults on imported code under test.
- Do not require a single mega-commit; each TDD/refactor cycle lands with all
  tests green.

## Foundation Alignment

- `.agent/directives/principles.md`: pure functions first; strict and
  complete; architectural excellence over expediency.
- `.agent/directives/testing-strategy.md`: unit and integration tests do not
  trigger IO; E2E tests use only the system protocol channel and not filesystem
  or network setup.
- `docs/architecture/architectural-decisions/078-dependency-injection-for-testability.md`:
  product code accepts configuration and dependencies explicitly; entrypoints
  read ambient state once and pass it down.
- `.agent/directives/schema-first-execution.md`: boundary validation remains
  strict and generated/schema-derived where relevant.

## Workstreams

### WS0 — Inventory And Boundary Map

**Goal**: identify every current unit, integration, and E2E test that uses or
requires IO, and classify the product boundary that caused it.

**Acceptance ids**:

| ID | Acceptance | Proof level | Proof |
| --- | --- | --- | --- |
| `NIO-0.1` | Offending tests are listed by file, test level, IO kind, and owning product boundary. | non-code | Inventory table committed in this plan or a linked evidence note. |
| `NIO-0.2` | Each offender is classified as domain extraction, use-case extraction, composition-root move, or smoke routing. | non-code | Inventory has a classification column with no blanks. |

**Validation**:

```bash
rg -n "from 'node:fs|from 'node:fs/promises|from 'node:child_process|process\\.env|mkdtemp|tmpdir|fetch\\(" \
  agent-tools apps packages
```

### WS1 — Testable Use-Case Extraction

**Goal**: make direct invocation of code under test possible without IO.

**Acceptance ids**:

| ID | Acceptance | Proof level | Proof |
| --- | --- | --- | --- |
| `NIO-1.1` | Each selected offender has a named domain or application use-case function. | unit | Focused tests import the function directly. |
| `NIO-1.2` | Every external dependency is an explicit argument. | integration | Type-check and focused tests fail if the dependency argument is absent. |
| `NIO-1.3` | Production defaults live only in composition/adapters. | non-code | Source audit and lint rule evidence. |

**TDD shape**: for each offender, first write or adapt the behaviour test so it
fails against the current boundary, then extract the use case and pass the
simple fake that makes the test green.

### WS2 — Test Rewrite With Simple Fakes

**Goal**: remove IO from the affected tests without weakening behavioural
proof.

**Acceptance ids**:

| ID | Acceptance | Proof level | Proof |
| --- | --- | --- | --- |
| `NIO-2.1` | Unit tests contain no fakes and only pure values. | unit | Focused unit tests pass and lint rejects IO imports. |
| `NIO-2.2` | Integration tests pass only simple fakes as arguments. | integration | Focused integration suites pass without IO warnings. |
| `NIO-2.3` | E2E tests do not prepare or inspect filesystem/network state. | e2e | E2E suites use only their protocol channel or are reclassified as smoke. |

### WS3 — Enforcement Hardening

**Goal**: prevent recurrence structurally.

**Acceptance ids**:

| ID | Acceptance | Proof level | Proof |
| --- | --- | --- | --- |
| `NIO-3.1` | Real IO imports and ambient env access are hard errors in unit, integration, and E2E tests. | integration | ESLint focused rule tests or fixture checks fail on offenders. |
| `NIO-3.2` | Existing warning-only coverage is either promoted or replaced by a stricter rule. | non-code | Lint output has no no-IO warnings; violations are errors. |
| `NIO-3.3` | Adapter smoke checks are outside the forbidden suites. | non-code | README or plan evidence names the smoke surface. |

### WS4 — Doctrine And Consolidation

**Goal**: make the repaired boundary durable.

**Acceptance ids**:

| ID | Acceptance | Proof level | Proof |
| --- | --- | --- | --- |
| `NIO-4.1` | ADR-078/testing-strategy wording remains consistent with the implemented boundary. | non-code | Markdownlint and source review. |
| `NIO-4.2` | The completion verdict distinguishes fixed slices from repo-wide completion. | non-code | Plan todo statuses and evidence table match. |
| `NIO-4.3` | Consolidation captures the lesson without duplicating doctrine. | non-code | `jc-consolidate-docs` or an explicit no-change rationale. |

## Quality Gates

Focused validation runs after each cycle:

```bash
pnpm --filter @oaknational/agent-tools lint
pnpm --filter @oaknational/agent-tools type-check
pnpm --filter @oaknational/agent-tools test
```

Final validation:

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm check
```

Use the canonical gate component:
[`quality-gates.md`](../../templates/components/quality-gates.md).

## Risk Assessment

| Risk | Mitigation |
| --- | --- |
| Cleanup becomes a mechanical lint chase. | Every offender must name the product boundary that caused IO-shaped testing. |
| Fakes become complex mocks. | Stop and redesign the use-case boundary if the fake needs real behaviour. |
| Adapter smoke checks are deleted silently. | Re-home true smoke checks explicitly and keep them out of unit/integration/E2E. |
| P5 absorbs repo-wide scope. | Keep P5 repair in `agent-tooling`; keep this plan as the wider architecture lane. |

## Lifecycle Triggers

Before implementation starts:

1. run start-right grounding;
2. check active claims and shared comms;
3. register a claim for the selected slice;
4. land each TDD/refactor cycle with green tests;
5. run session handoff and consolidation before completion language.

See
[`lifecycle-triggers.md`](../../templates/components/lifecycle-triggers.md).

## Completion Policy

This plan is complete only when all acceptance ids are satisfied and lint
enforces no IO in unit, integration, and E2E tests as hard errors. A fixed P5
slice, a fixed workspace, or an inventory is not repo-wide completion.
