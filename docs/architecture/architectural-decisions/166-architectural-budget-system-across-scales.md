# ADR-166: Architectural Budget System Across Scales

**Status**: Accepted
**Date**: 2026-04-29
**Related**:
[ADR-019](019-domain-driven-file-splitting.md),
[ADR-041](041-workspace-structure-option-a.md),
[ADR-121](121-quality-gate-surfaces.md),
[ADR-144](144-two-threshold-fitness-model.md),
[ADR-154](154-separate-framework-from-consumer.md),
[ADR-155](155-decompose-at-the-tension.md)

## Context

The repository already enforces several local complexity bounds. ESLint owns
function, statement, depth, and file-size limits. Dependency-cruiser owns graph
shape for circular dependencies, orphans, and layer direction. Knip owns unused
code and dependency hygiene in the aggregate quality gate.

Those controls are useful, but they create an architectural pressure problem:
when one scale becomes constrained, complexity can move to the next scale up.
Short functions can accumulate into bloated files. Short files can accumulate
inside one directory. Small directories can accumulate inside one workspace.
Extra workspaces can become artificial splits if they do not create a real
capability boundary, public API, and one-way dependency story.

The owner direction is to make these controls work together so no conceptual
layer absorbs all the complexity removed from another layer. The goal is a
monorepo of well-structured workspaces, clear package APIs, and enforceable
architectural boundaries.

The budget system must also resist passive drift. Visibility reports,
allowlists, and baseline exceptions are useful only when they are lifecycle-
managed evidence with owners, expiry or removal triggers, and a named consumer
plan. Otherwise they become another way to hide complexity instead of fixing
it.

This ADR borrows the "architectural fitness function" vocabulary from
evolutionary architecture, especially Thoughtworks' Technology Radar entry on
[architectural fitness functions](https://www.thoughtworks.com/en-us/radar/techniques/architectural-fitness-function)
and the framing in _Building Evolutionary Architectures_. Oak adapts that
vocabulary narrowly: a budget is a strict architectural bound or diagnostic
pressure signal, not a tolerated quota of violations.

## Decision

Adopt an architectural budget system across scales.

An architectural budget is a fitness-function bound over one architectural
scale. It is not permission to spend complexity or tolerate violations. Where
an existing gate is blocking, the budget is a hard bound. Where a scale is
diagnostic only, the budget produces a named structural response: split, move,
delete, generate, or route an owner-visible follow-up.

The system covers these scales:

| Scale            | Canonical owner                                            | Current enforcement                                                                                      | Overrun meaning                               | Required response                                         |
| ---------------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- | --------------------------------------------- | --------------------------------------------------------- |
| Function         | ESLint shared config                                       | Blocking lint                                                                                            | One function owns too many decisions          | Extract named, tested responsibilities                    |
| File             | ESLint shared config                                       | Blocking lint                                                                                            | One module owns too much behaviour            | Split by responsibility with clear exports                |
| Directory        | Repository validator framework (see §Amendment 2026-09-14) | Planned: a blocking validator for the Reliable Atoms workspace class, not yet landed; no check elsewhere | One intra-layer area may hide sub-domains     | Extract cohesive intra-layer directories                  |
| Workspace        | ADR-154 and workspace audit                                | Visible now, future enforcement                                                                          | One workspace may host multiple layers        | Split by layer, move code down, or thin the leaf          |
| Package API      | Package manifests and boundary checks                      | Future enforcement candidate                                                                             | Public surface may hide coupling or internals | Narrow `exports`; remove deep imports and proxy barrels   |
| Dependency graph | ADR-041 and dependency-cruiser                             | Blocking graph checks                                                                                    | Direction, cycle, or orphan invariant failed  | Remove the edge, cycle, orphan, or wrong layer dependency |

Directory decomposition is only an intra-layer response. It never satisfies
framework/consumer separation, lifecycle separation, or context-specificity
separation. Those tensions require workspace boundaries per ADR-154.

Workspace count is not capped. The workspace budget is that mixed layers per
workspace should be zero, not that the repo should have few workspaces. More
workspaces are correct when they represent real capability boundaries with
clear package APIs and one-way dependency direction.

Once a budget scale is blocking, new or changed work at that scale must fail
non-zero when it breaches the rule. Existing baseline failures may only pass as
temporary exceptions when they name an owner, expiry or removal trigger, and
the tranche that will remove the exception.

## Anti-Gaming Rules

The budget system rejects mechanical compliance:

1. Do not split files, directories, or workspaces only to satisfy a count.
2. Do not create packages that only proxy or re-export another package.
3. Do not use barrels to bridge bad coupling or expose internals.
4. Do not replace a boundary violation with a compatibility facade.
5. Do not use wildcard exports to hide an unbounded public API.
6. Do not create nested package markers inside a workspace except fixtures or
   generated test artefacts with an explicit allowlist and owner.
7. Do not treat a directory split as adequate when ADR-154 requires workspace
   separation.

Every split must improve at least one architectural property: cohesion,
testability, public API clarity, dependency direction, generated/authored
separation, or framework/consumer separation.

Tests and documentation cannot redeem a hollow package. A package must own a
real contract, implementation, or capability boundary. If it only proxies or
re-exports another package, remove it or fold it into the real owner.

Wildcard exports are public API surfaces. They are allowed only when they are
intentional, documented, and owned, or when a temporary allowlist has an owner,
expiry or removal trigger, and rationale. A generic "future narrowing" note is
not sufficient.

## Rollout Doctrine

Visibility comes before enforcement for new budget scales.

The rollout order is:

1. Document the invariant and scale vocabulary in this ADR.
2. Baseline current state with read-only visibility reports.
3. Route findings into existing architecture plans or tranche-specific child
   plans.
4. Promote a check only after the baseline, remediation path, and failure mode
   are deterministic.
5. Update ADR-121 and build-system documentation only when a check actually
   runs on a gate surface.

This ADR does not update the quality-gate matrix by itself. It creates the
doctrine that later visibility and enforcement plans must operationalise.

Every generated visibility report must record the command and version used to
produce it, the git SHA, timestamp, exclusions version, output path, and the
owning consumer plan and phase. Any consumer that relies on the report must
cite that report version and either update its plan or record an explicit
no-op disposition.

A future check has only two stable states: informational with a named consumer,
or blocking with deterministic non-zero failure behaviour. Warning-only gates
are not acceptable terminal states.

## Consequences

### Positive

- Complexity controls reinforce each other instead of displacing work upward.
- Directory, workspace, package API, and graph concerns are handled at the
  scale that actually owns the architectural failure.
- Existing strict gates remain strict; budget vocabulary does not weaken them.
- Future enforcement can be staged from evidence rather than guessed thresholds.
- Artificial workspace splits become visible as coupling failures rather than
  accepted compliance.

### Trade-offs

- The repo gains another architectural vocabulary layer. To keep it useful,
  each plan must name the consumer, trigger, and promotion path for any new
  visibility or enforcement artefact.
- Some future migrations will create more workspaces. That is acceptable when
  the split represents a real layer or capability boundary.
- Numeric thresholds must remain in executable configuration or calibrated
  child plans, not copied into doctrine.

## Implementation Status

| Surface                       | Status                                                                                                                                                                  | Owner                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| Concept and vocabulary        | Accepted in this ADR                                                                                                                                                    | Architecture doctrine                                               |
| Directory-cardinality rollout | Blocking validator for the Reliable Atoms workspace class, planned in that programme's delivery node; the estate-wide report-only signal remains an unratified proposal | Reliable Atoms programme (class); architecture doctrine (elsewhere) |
| Workspace layer matrix        | Queued audit                                                                                                                                                            | Architecture and infrastructure                                     |
| Visibility layer              | Strategic future plan                                                                                                                                                   | Architecture and infrastructure                                     |
| Enforcement layer             | Strategic future plan                                                                                                                                                   | Architecture and infrastructure                                     |
| Quality-gate matrix           | Not changed by this ADR                                                                                                                                                 | ADR-121 and build-system docs                                       |

## Amendment — 2026-09-14 (owner-ruled): class-scoped budgets and the directory scale's instrument

The owner ruled three things for the Reliable Atoms programme (the strategic
node quotes the words; ADR-230 §Repository interpretation records the
programme-side consequence):

1. **The directory scale's instrument is a repository validator**, in the
   estate's validator framework, recomputed from the tracked tree — never an
   ESLint rule and never a test. A per-file AST rule can only see a
   directory through an injected inventory and is silent without one; a test
   proves product behaviour, and a directory's shape is a structural
   invariant of the repository, not behaviour of any product. The
   unregistered `max-files-per-dir` rule in the shared ESLint package is
   retired; because the replacement is a different instrument, the earlier
   condition that retirement wait for replacement-equivalence proof no longer
   applies.
2. **A budget may bind at a stricter value for a declared workspace
   class.** Workspaces that hold Reliable Atoms declare the class on their
   manifest (declared membership, never a name or path pattern); inside the
   class the directory budget is blocking, and the function-, file- and
   clarity-scale budgets bind at stricter values than the estate's strict
   tier. Outside the class nothing changes: the estate-wide report-only
   directory signal proposed in July 2026 remains an unratified proposal.
   The values live in the class's executable configuration and the
   programme's delivery node, per §Trade-offs above.
3. **A new class has an empty baseline by construction.** The rollout order
   in §Rollout Doctrine assumes an existing population that needs a
   visibility baseline before enforcement. A class whose first workspace is
   built to fit its parameters has no such population; enforcement from the
   first workspace is the rollout, and the visibility step is vacuous. A
   workspace outside the class that does not fit the class's parameters is
   not evidence about the class: it is outside the class until reshaped, and
   its non-fit is recorded as its own fact. §Anti-Gaming Rules bind inside
   the class in full — a breach is cured by reshaping or by a recorded
   edge case routed to the owner, never by an exemption or a raised value.
