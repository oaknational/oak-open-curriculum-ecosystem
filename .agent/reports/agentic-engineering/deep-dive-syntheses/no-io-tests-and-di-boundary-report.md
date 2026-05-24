# No-IO Tests and Dependency-Injection Boundary Report

**Date**: 2026-05-13
**Status**: Findings recorded; routed to P5 repair and a separate
repo-wide architecture plan
**Trigger**: P5 unified comms tests exposed real filesystem IO in unit and
integration tests.

## Executive Finding

The immediate lint warnings were not the real defect.

The real defect is that some imported product surfaces still make production
IO look like the natural way to prove domain behaviour. That muddies the
architecture required by ADR-078 and `.agent/directives/testing-strategy.md`:
tests should directly invoke the code under test, and that code should accept
simple fakes as explicit arguments.

The repo is not responsible for proving that the operating system,
filesystem, network, process spawning, timers, or stdout work. The repo is
responsible for proving domain and application logic that decides when and how
to call those services.

## What Happened

During P5 unified comms work, the first repair removed direct test imports of
`node:fs/promises` by adding an injectable CLI runtime and an in-memory fake.
That removed the two lint warnings, but the shape was still too permissive:

- imported command paths could still fall back to production filesystem
  defaults;
- tests still exercised argv-shaped CLI paths rather than the narrower
  use-case functions in several places;
- path strings such as `--comms-dir`, `--seen-file`, and `--output` still
  leaked filesystem concepts into behaviour tests;
- production adapters and testable application logic were not clearly
  separated.

That repair was useful as a diagnostic slice. It is not enough to claim P5
architectural completion.

## Correct Principle

The correct boundary is:

1. **Domain functions** are pure: input values in, output values out.
2. **Application/use-case functions** directly express the operation and
   accept dependencies as arguments.
3. **Tests** invoke domain or use-case functions directly, with trivial fakes.
4. **Composition roots** parse argv/env and wire real IO adapters.
5. **Adapters** call OS services, but are not behaviour-tested as though the
   repo owns OS correctness.

The production CLI may use filesystem, environment, clock, UUID, process, and
watcher services. Imported code under unit, integration, or E2E tests must not
silently acquire those services.

## Architectural Smell

The smell is not merely:

> test imports `node:fs/promises`

The stronger smell is:

> the code under test requires a filesystem-shaped setup before its behaviour
> can be observed.

When that happens, the product boundary is too low-level. The response is to
extract a use-case surface whose dependency contract is explicit enough that a
small fake can be passed as an argument.

## P5-Specific Findings

P5 unified comms still needs a repair pass before it can be called complete:

- `runCollaborationStateCli` and command handlers must not own production IO
  defaults when imported into tests.
- The testable comms operations should be named use cases, not filesystem
  path workflows.
- Filesystem path options belong to CLI composition and adapters, not the
  application behaviour proof.
- `comms watch` behaviour should depend on an injected update source, not a
  real watcher or timer in in-process tests.
- Migration behaviour should operate on record collections and an output sink;
  filesystem directory traversal is adapter wiring.
- The P5 proof contract must include a no-IO test evidence check, not merely
  "lint exits 0".

## Wider Findings

Current evidence shows the issue is wider than P5:

- some `agent-tools/tests` unit and integration files still import `node:fs`
  or `node:fs/promises`;
- some tests use temp directories to create the world the product code
  expects;
- some tests classify themselves as unit or integration while proving adapter
  wiring;
- the current warning-level rule is not enough as an architectural guard.

These should not be patched by moving IO behind test helpers. They should be
fixed by extracting explicit use-case dependency contracts and moving OS wiring
to composition roots.

## Required Routing

1. **P5 repair** belongs in
   `.agent/plans/agent-tooling/current/cost-of-collaboration.plan.md`.
   It should repair the current unified-comms implementation before P5
   completion is recomputed.
2. **Repo-wide no-IO test recovery** belongs in a separate architecture plan,
   because it touches ADR-078, testing strategy, ESLint enforcement, and
   multiple workspaces.
3. **Completion claims** must treat the current P5 slice as useful but not
   complete until the repair proof is green.

## Non-Goals

- Do not test filesystem, network, clocks, UUID generation, stdout, process
  spawning, or watchers.
- Do not hide IO behind test helpers.
- Do not add complex mocks.
- Do not keep production defaults reachable from imported use-case tests.
- Do not call adapter smoke evidence unit, integration, or E2E proof.

## Acceptance Shape For Future Work

A corrected workstream can claim compliance only when:

- behaviour tests directly call domain or use-case functions;
- every dependency needed by the function under test is an explicit argument;
- fakes are small value stores or literal functions, not behavioural
  simulations of OS services;
- production IO appears only in composition roots and adapters;
- lint fails on real IO imports in unit, integration, and E2E test files;
- any remaining adapter smoke checks are outside the Vitest unit/integration
  and E2E suites.
