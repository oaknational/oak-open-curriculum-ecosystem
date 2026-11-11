---
id: reliable-atoms-workspace-shape
node_type: delivery
name: "Capability Foundations workspace shape — the declared class, its directory-cardinality validator and its stricter tiers"
overview: >-
  Give the workspaces that hold Capability Foundations a declared class, a blocking
  repository validator over their directory shape, and lint, compiler and
  assurance tiers stricter than the rest of the estate, with the values in
  one place and an edge-case ledger fed only from inside the class.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: reliable-atoms-programme
impact_areas:
  - practice-and-estate
tickets: []
depends_on: []
owner_gates: []
last_updated: 2026-10-10
---

# Capability Foundations workspace shape

## Goal

When this lands, a workspace that holds Capability Foundations says so on its
manifest, a repository validator refuses any directory in it over the class's
file caps, and its lint, compiler, coverage and mutation tiers are stricter
than the estate's strict tier — all recomputed, none recorded. The dead
ESLint rule for directory counts is gone. The owner's direction of 2026-09-14
is quoted in the programme node's amendment; this node carries the values and
the instruments, per ADR-166's rule that thresholds live in executable
configuration or a calibrated child plan.

The governing records are
[ADR-166](../../../docs/architecture/architectural-decisions/166-architectural-budget-system-across-scales.md)
(§2026-09-14 amendment: the directory scale's instrument and class-scoped
budgets),
[ADR-230](../../../docs/architecture/architectural-decisions/230-own-built-algorithm-and-data-structure-foundations.md)
§Repository interpretation, and the programme node's bar element 10. The
exploration that produced the framing is
`.agent/research/reliable-atoms-workspace-shape-exploration-2026-09-14.md`.

The workspace class and configuration names below are proposed implementation
bindings, not existing executable surfaces. Physical budgets do not establish
Primitive independence or semantic completion; the common architecture owns those
requirements. Preserve the existing plan identity and sketch status.

[ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md)
and the [CF reconstruction account](../../../docs/architecture/foundations/oce-cf-reconstruction.md)
now own the programme connection. This node supplies class-specific structural
enforcement, not the whole qualification mechanism. Its applicable outputs block
qualification of affected governed units; contract/proof design may proceed in
parallel. Neither this entire node nor the whole CF programme is a universal
app-extraction gate. No team measurements or studies are commissioned.

## User groups and value

Agents and engineers reading or authoring an atom hold its whole home in one
read: every directory small, every function short, every export explicitly
typed, every misuse the type system can close closed. Maintainers get a
class whose shape is a checked invariant, not a convention. The programme's
conformance instrument gets a container contract it can rely on. Value is
the programme's offered value under the innovation clause (owner ruling
2026-08-31).

## Mechanism

### The class declaration

A workspace joins the class by one manifest field, read by every class
instrument (proposed, closed shape — a reviewed diff to change):

```json
{ "workspaceClass": "capability-foundations" }
```

Membership is declared, never inferred from a path or a name
(validation-strategy §Validation jurisdiction). The field carries no estate
prefix: the toolkit is generic and the class is a toolkit fact. A workspace
without the field is outside this class-specific instrument; the architectural
inventory still classifies all governed code and rejects an unclassified
foundations capability. A workspace that declares the class and does not fit fails.

No workspace outside the class is evidence about the class. An existing
`packages/core/*` member that does not fit the starting parameters is, by
that fact, not a Capability Foundations workspace: its register row names what it
lacks, and it enters the class at the tranche that reshapes it to fit. It is
never measured to loosen a value.

### Axis 1 — directory cardinality (a repository validator, blocking)

`agent-tools/src/validators/reliable-atoms-workspace-shape/validate-reliable-atoms-workspace-shape.ts`,
following the framework's shape (an entrypoint, a helpers module, co-located
unit tests over pure supplied inventory values with no I/O in tests or helpers;
`Result` from the estate's result package; non-zero exit naming every
breach). Registered in the three places the framework requires: a
`validate-reliable-atoms-workspace-shape` script in `agent-tools/package.json`,
a leg appended to the root `repo-validators:check`, and a CI step — the
check-CI parity validator fails the build if the third is missing.

For every workspace declaring the class, for every directory in it
(the workspace root included), counting **tracked files only** (the git
index; build output and local artefacts are invisible by construction, so no
ignore list exists):

| Measure                                                                        | Initial value | Source                            |
| ------------------------------------------------------------------------------ | ------------- | --------------------------------- |
| TypeScript files per directory (`.ts`, `.tsx`, `.mts`, `.cts`; `.d.ts` counts) | ≤ 5           | owner, 2026-09-14                 |
| Files of any kind per directory                                                | ≤ 7           | owner, 2026-09-14                 |
| Directory depth below the workspace root                                       | ≤ 2           | proposed, same kind of constraint |

The validator carries no allowlist, no ignore globs and no per-directory
exemption. Its only scoping is the class declaration and the git index. A
breach is cured by reshaping the workspace or, when the cure would be an
artificial split (ADR-166 §Anti-gaming), by an edge-case row below — never by
a configuration escape.

The unregistered ESLint rule `max-files-per-dir` and its test in the
oak-eslint package are deleted in their own slice; the replacement is a
different instrument, so the July 2026 condition of replacement-equivalence
proof does not apply (owner ruling 2026-09-14).

### Axis 2 — length, complexity and clarity (the class's lint tier)

A `capabilityFoundations` config in the oak-eslint package, composed over `strict`
so the class can only be stricter, selected by each class workspace's
`eslint.config.ts`. It binds every TypeScript file in the workspace, test
files included: the estate's shared test relaxations do not apply inside the
class. Every rule name below exists in the installed plugins (verified at
authoring against the installed ESLint core, typescript-eslint, sonarjs and
unicorn packages); every value is an initial value derived from the atom's
nature — one responsibility, read whole — not from any existing code.

Existing budgets, stricter for the class (estate strict tier → class):

| Rule                                    | Estate | Class |
| --------------------------------------- | ------ | ----- |
| `complexity`                            | 8      | 4     |
| `max-depth`                             | 3      | 2     |
| `max-statements`                        | 20     | 10    |
| `max-lines-per-function`                | 50     | 25    |
| `max-lines`                             | 250    | 120   |
| `sonarjs/cognitive-complexity`          | 15     | 6     |
| `sonarjs/no-nested-functions` threshold | 4      | 2     |

Constraints the estate does not yet carry, added for the class (all at
`error`):

- Size and nesting: `@typescript-eslint/max-params` 3; `max-nested-callbacks`
  2; `max-classes-per-file` 1; `no-nested-ternary`;
  `sonarjs/expression-complexity` 3; `sonarjs/nested-control-flow` 2;
  `sonarjs/no-nested-conditional`; `sonarjs/no-nested-template-literals`;
  `sonarjs/max-union-size` at the rule's default; `sonarjs/regex-complexity`
  at the rule's default.
- Explicit types and contracts: `@typescript-eslint/explicit-function-return-type`
  (every function, not only module boundaries);
  `@typescript-eslint/explicit-member-accessibility`;
  `@typescript-eslint/method-signature-style` `property`;
  `@typescript-eslint/switch-exhaustiveness-check`;
  `@typescript-eslint/strict-boolean-expressions`;
  `@typescript-eslint/no-unnecessary-condition`;
  `@typescript-eslint/prefer-readonly`;
  `@typescript-eslint/prefer-readonly-parameter-types`.
- Clarity of names and values: `@typescript-eslint/naming-convention`
  (camelCase values, PascalCase types, UPPER_CASE module constants);
  `unicorn/prevent-abbreviations`; `unicorn/filename-case` kebab-case;
  `id-length` minimum 3; `@typescript-eslint/no-magic-numbers` (ignoring
  −1, 0 and 1, enums, readonly class properties and type indexes);
  `@typescript-eslint/no-shadow`; `no-param-reassign`.
- Duplication and flow: `sonarjs/no-identical-functions`;
  `sonarjs/no-duplicate-string`; `sonarjs/prefer-immediate-return`;
  `sonarjs/elseif-without-else`; `no-else-return`; `no-lonely-if`;
  `unicorn/no-negated-condition`; `no-unneeded-ternary`;
  `no-implicit-coercion`; `prefer-template`; `default-case-last`;
  `func-style` declaration; `unicorn/consistent-function-scoping`;
  `unicorn/explicit-length-check`; `unicorn/no-array-callback-reference`;
  `unicorn/no-unreadable-array-destructuring`; `unicorn/no-unreadable-iife`;
  `unicorn/switch-case-braces`; `unicorn/no-static-only-class`.

### Axis 3 — the compiler profile

The [adoption profile](../../../docs/architecture/foundations/capability-foundations-adoption.md#typescript-and-node-profile)
owns the production source, native Node 24 execution and packed-consumption
contract. A `tsconfig.capability-foundations.json` binds it to the exact pinned
compiler and source set; inheritance must not add ambient APIs, aliases, framework
settings or declaration-checking omissions. Preserve the base's `strict`,
`noUnusedLocals`, `noUnusedParameters`, `noImplicitReturns` and
`noFallthroughCasesInSwitch`, and add `noUncheckedIndexedAccess`,
`exactOptionalPropertyTypes`, `noImplicitOverride`, `verbatimModuleSyntax` and
`isolatedDeclarations` (an explicit type on every export — the clarity
constraint that also makes the committed API report of bar element 4 a pure
projection); `noPropertyAccessFromIndexSignature` is not added, the owner's
ruling excludes it (the routed note below). Keep tests/tooling
configuration separate; source checking, native execution and distribution
emission require distinct evidence. The profile's options are not a claim that
the current base already supplies them.

Routed here on 2026-10-02: `noPropertyAccessFromIndexSignature` is excluded from
this profile by the owner's ruling on the estate's target compiler set ("more
pain than it is worth"; it fights ESLint's dot-notation rule). That ruling also
has every tsconfig resolve the set from one base, with no workspace config
restating or relaxing a flag (owner direction relayed on 2026-09-16, open item
7 of the estate-coordination thread record). The seat that executes this axis
reconciles the two before writing the profile: the profile takes the shared
flags from the one base with the excluded flag kept out, or the owner rules the
profile an exception.

### Axis 4 — assurance thresholds that break

- Coverage: the class's Vitest config sets `coverage.thresholds` at 100 for
  lines, branches, functions and statements, and does not inherit the base
  config's `index.ts` exclusion — an atom's entry module is its public
  surface (R04).
- Mutation: the class's Stryker config sets `thresholds.break` to 100; every
  survivor is dispositioned per the architecture record §6, never tolerated
  by lowering the threshold. The estate's report-only mutation posture is
  unchanged outside the class.
- Public surface: bar element 8's grab-bag fence takes an initial value for
  the class of at most 10 exported symbols per public entry point; the
  conformance instrument recomputes it.

### Reader of the ledger below

The edge-case ledger's reader is the implementer of each slice at pickup,
and the owner at a card whenever a row proposes a value change (the owner
anticipated "tweaks as we discover edge cases"; a tweak to an owner-stated
value is the owner's). A row is admitted only from a workspace declaring the
class. The ledger is empty at authoring: no edge case exists before the
first atom workspace does.

## Acceptance criteria (each with a proof — required)

1. A workspace declaring the class with one directory over either cap, or
   deeper than the depth cap, fails `repo-validators:check` non-zero naming
   the directory and the measure; a workspace without the declaration is
   untouched. Proof: `repo-safe` — the validator's unit tests over
   supplied inventory values, red first; the real git/filesystem adapter is a
   separate validation surface.
2. The validator is reachable from CI. Proof: `repo-safe` — the check-CI
   parity validator green with the new leg present.
3. The oak-eslint package exports no `max-files-per-dir` rule and carries no
   file by that name. Proof: `repo-safe` — the package's build, lint, tests
   and the knip gate green after the deletion.
4. A class workspace lints at the class tier: a fixture function at the
   estate's limits but over the class's fails lint in that workspace and
   passes in a non-class workspace. Proof: `repo-safe` — the oak-eslint
   config unit tests, in the shape `strict.unit.test.ts` already uses.
5. A class workspace compiles under the class profile and breaks its
   coverage and mutation thresholds when a test is removed. Proof:
   `repo-safe` — the first class workspace's gates, red first.

## Todos

Slices at pickup, each a single-story PR within the default round budget:

- Delete the unregistered ESLint rule and its test (owner ruling; grep
  proves no consumer).
- The validator, red first: class-declaration reader, tracked-file
  inventory, the three measures, the three registrations.
- The class's lint tier, compiler profile and assurance configs, exported
  from the packages that own the estate's shared configuration.
- The first capability workspace declares the class — BinaryTreeIndices and
  its bound prerequisite contracts, a slice of
  `graph-and-queue-foundations-delivery`; its build is the first
  test of every value above and the first possible ledger row.

## Edge-case ledger

Empty at authoring. A row: date, the class workspace, the measure or rule,
what the atom's contract required, the disposition (reshaped; value change
proposed to the owner with the card's pointer; refused as an artificial
split).

## Out of scope

- Where capability workspaces sit in the tree — ADR-233 and the controlling
  architecture bind the target, with the exact coherent home selected in the
  capability slice. Existing ADR-041/ADR-154 constraints are reconciled there;
  the class binds shape, not placement, and does not perpetuate generic core.
- Reshaping existing `packages/core/*` members — the CF reconstruction account
  supplies all ten responsibility dispositions. Each is its own bounded slice;
  no whole-workspace rename or present shape establishes qualification, and none
  supplies a reference population for loosening this class.
- The repo-wide report-only directory-concentration signal proposed in July
  2026 — still an unratified proposal, unaffected by the class.
- The atom register and the conformance instrument themselves — the
  programme's tranche one; this node gives them a container contract.
