---
boundary: B2-Architecture
doc_role: reference
authority: capability-foundations-adoption
status: active
last_reviewed: 2026-09-25
---

# Capability Foundations: completion and adoption

This record receives the owner's September 2026 Capability Foundations direction
and the 25 September adoption review. The [governing policy](algorithms-and-data-structures-governance-2026-09-08.md)
owns implementation origin; the [common architecture](reliable-atoms-and-composition-architecture-2026-09-08.md)
owns grades and R01–R10/C01–C08. This record owns the selected first-build contracts,
TypeScript execution profile and data/API adoption criteria. These are design
requirements, not claims of implemented or Qualified capabilities.

## Completion at a useful boundary

A complete unit has one intelligible responsibility, determinate observations,
owned laws, explicit dependencies, defined state/failure behaviour and a feasible
assurance route. Its complete supported scope has no planned development left.
Extract a distinct concept when a contained definition, provable contract and
finished implementation supply useful value. Consumer count is not an admission,
qualification, publication or retention criterion.

Finish the selected scope permanently: later functionality has a new contract or
profile; a defect reopens the affected claim. Preserve valid evidence for unchanged
lower contracts. The initial investment includes definition, proof correspondence,
implementation, exhaustive interface evidence, mutation, performance and docs.
Savings over the lifetime of the system remain an empirical hypothesis.

## First-build contracts

BinaryTreeIndices is the first target capability, with required admission/outcome
prerequisites closed before qualification. A composed BinaryHeap is the first
useful endpoint; its first stateful repair tests whether public contracts suffice
to establish the next guarantee. The stable priority queue and comprehensive graph
programme are later scopes.

| Unit                  | Complete responsibility                                                                                                                                                                                       | Closure evidence                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| BinaryTreeIndices     | Exact parent/child relations for an array-backed binary tree. Length is an integer from zero through `2^32 - 1`; positions satisfy `0 <= i < n`. Define invalid input, root-parent and absent-child outcomes. | Range and inverse laws, terminating parent chains and correspondence to production arithmetic, without 32-bit narrowing or allocating maximum-size storage. |
| FiniteNumberAdmission | Decide membership of the finite-number domain and preserve admitted values.                                                                                                                                   | Explicit rejection of non-numbers, NaN and infinities; determinate outcomes and validation precedence.                                                      |
| BoundedCountAdmission | Decide membership of the declared non-negative integer count/capacity domain.                                                                                                                                 | Exact bounds, invalid/fractional/out-of-range cases and signed-zero treatment.                                                                              |
| DenseOwnedBuffer      | Own dense storage, exact length, indexed read/replace, append, remove-last and obsolete-reference cleanup.                                                                                                    | One closed capacity/growth/allocation policy, supported failure post-states, mutation commit points, alias/lifetime laws and material costs.                |
| FiniteNumberOrder     | Compare admitted finite numbers lawfully, treating signed zeros as equivalent.                                                                                                                                | Total-order laws on the admitted domain; avoid subtraction that can overflow. Admission has an explicit owner.                                              |
| AppendLeafRepair      | Restore heap order after one leaf is appended to an otherwise valid heap; preserve occurrences.                                                                                                               | Public geometry/storage/order contracts imply termination, preservation and restored order. This is not arbitrary bad-edge repair.                          |
| RootSubtreeRepair     | Restore order at a subtree root whose child subtrees are ordered; preserve that subtree's occurrences.                                                                                                        | Child-selection and descent laws; no promise to repair the relation to an external parent.                                                                  |
| BinaryHeap            | Own private state and empty construction, insertion, peek, take and exact size across supported histories.                                                                                                    | Establish every repair premise; independently check occurrence histories, empty/capacity outcomes and unchanged state after supported rejection.            |

Geometry, admission and order are Primitive candidates only while independent of
peer capabilities. Storage's grade follows its actual dependencies. Repairs are
Component/Mechanisms; the heap is a Component/Facility. A canonical Result import,
including a type-only import, makes the importing capability composed. Reuse the
canonical contract; do not duplicate it to obtain a Primitive label.

Parent is `floor((i - 1) / 2)` for a non-root position; child candidates are
`2i + 1` and `2i + 2`, present only below `n`. Storage has one invariant owner:
splitting assignments into packages does not create independently useful contracts.
Close one supported storage policy before repairs rely on it; no general allocator
framework is required.

The heap preserves duplicate insertions and repeated references as distinct
occurrences. Stored `undefined` is distinct from empty. Capacity rejection precedes
mutation. Ordering is fixed, lawful, deterministic, terminating, non-throwing and
non-reentrant; ordering-relevant keys remain unchanged while retained. Those are
explicit caller premises where callers supply ordering. Logical bounds do not
promise available memory or recovery from process/allocation failure.

Stable ties, handles, arbitrary deletion, decrease-key, concurrency, scheduling and
top-k are outside this heap contract. Repair/comparison complexity is distinct from
allocation, growth and comparator cost. Qualification covers the actual public
source and delivered package forms and a compatible lower-implementation substitution.

## TypeScript and Node profile

The agreed production baseline is ESM executable by Node 24's built-in type
stripping, without a compilation prerequisite, transformation loader, JSX or
decorators. The compatibility floor is Node 24.12.0; select a maintained execution
patch and record the tested runtime matrix, including floor evidence. Pin the exact
TypeScript compiler (at least 5.8 for this option set) and resolved inputs/config.
No compiler or runtime execution is asserted by this record.

The independent production source-checking baseline is:

```json
{
  "compilerOptions": {
    "noEmit": true,
    "target": "ES2024",
    "lib": ["ES2024"],
    "module": "NodeNext",
    "allowImportingTsExtensions": true,
    "erasableSyntaxOnly": true,
    "verbatimModuleSyntax": true,
    "types": [],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedSideEffectImports": true,
    "noImplicitReturns": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

`noEmit` separates checking from distribution emission. ES2024 fixes the language
and declaration baseline without the DOM. NodeNext and explicit source extensions
bind Node module resolution; erasable syntax and verbatim modules avoid hidden
transformations. `types: []` closes automatic ambient type inclusion, not explicit
imports. Strict checking, indexed absence, exact optional properties and checked
side-effect imports preserve distinctions; return, override and switch checks
expose accidental control-flow/inheritance errors. Declaration checking remains
enabled: do not add `skipLibCheck`. No paths, framework bootstrap or runner ambient
types widen this production profile.

Native source execution and packed consumption are separate evidence obligations.
Ordinary installed Node packages expose reproducibly emitted JavaScript and
declarations; source type stripping is not an installed-package distribution
strategy. Check every public export and runtime/declaration specifier in the packed
form outside the originating workspace. Relevant substrate references are
[Node's pinned TypeScript documentation](https://nodejs.org/download/release/v24.12.0/docs/api/typescript.html)
and [TypeScript compiler options](https://www.typescriptlang.org/tsconfig/).

## Proof and architectural enforcement

Bind the selected contract/profile first, then demonstrate the minimum executable
proof and enforcement connection for geometry. A model-only proof does not qualify
production arithmetic. Reuse existing instruments; the first build does not require
a general proof platform.

Automatic blocking checks cover all governed entities, source and emitted surfaces:
capabilities, grades, roles, layers, packages, public values/types, tooling and
providers. Define who may import, reference, call, construct, expose or re-export
each surface, including type-only and dynamic dependencies, aliases, callbacks and
ownership escape. Unknown classification and unsupported governed constructs fail
closed within the selected source profile. Positive and negative controls establish
that allowed use works and forbidden imports/exposure fail. File counts and a
successful entry-point load do not establish these boundaries.

Tests and every helper they import perform no I/O. Pure laws and compositions use
deterministic in-process evidence. Provider, native-loading and packed-artifact
observations use the repository's appropriate validation surfaces, with their real
scope declared; relabelling an I/O test does not satisfy the invariant. Missing
provider evidence leaves the corresponding service claim open.

## Data and API adoption

Select one complete contextual operation and its actual dependency closure. Keep
contract derivation separate from runtime composition: shared semantics need not
imply a shared database, service or deployment. Neither the complete capability
catalogue, the graph programme, the heap nor a whole schema compiler is an automatic
dependency of an API read. Use native provider mechanisms where they discharge the
declared contract.

Small relations and transition decisions own local guarantees. Schema compilers,
artifact correspondence, transactions and publication own larger composed guarantees;
finite caps alone do not make those responsibilities small. State exact admitted
size/depth/reference bounds, the work bound and the evidence that it is acceptable.
Keep an admitted-record field-presence operation separate from arbitrary-object
inspection; keep prefix admission separate from final response-envelope accounting.
Bytes and model tokens are different quantities.

For the new Oak-data API, one authoritative semantic definition supplies the full,
comprehensive OpenAPI specification and generated consumer contracts. The spec uses
the latest standard, carries a UUID and last-updated datetime, and includes each
MCP tool's request/response schemas or definitions trivially transformable into
them. The serving endpoint sends ETag and last-updated headers. Bind identity
lifetime, revision/update meaning, representation validation and conditional-request
behaviour in its endpoint contract; those detailed choices are not settled here.
Validate final tool input/output shapes after projection and envelope construction.

Moving to the latest API specification version is routine recurring maintenance.
Pin the supported release, inspect the delta, check affected mappings and preserve
valid evidence for unchanged laws. Version upgrades do not reopen unrelated
completed capabilities or create a general adoption blocker.

Semantic cases include missing versus zero, duplicated versus independent evidence,
correction versus later change, and supported subset versus complete population.
For protected profiles, current disclosure authority reaches derived stores, caches,
exports and restores. Final schemas do not alone prove service outcomes; agent
discovery, interpretation, latency and human value need their own evidence where
claimed. Assess the data-heavy educator/design use cases separately from tutorial
systems whose interactions may require much less data transfer.

## Source and decision basis

This repository-owned synthesis receives the owner's 15–16 September decisions on
small completed Primitives, purposeful composition, upfront completion investment
and TypeScript/Node compatibility; the 20 September clarification that a second
consumer is not required; and the 25 September adoption review and API-version
correction. The user requested a PR carrying these changes on 25 September.

External Capability Foundations records consulted: development policy, assurance
standard, architecture guide, finished-Primitives/layers exploration, first-delivery
brief (revision 5), general data-infrastructure map and Oak API decomposition.
The adoption review is `capability-foundations-adoption-and-finishability-review-2026-09-25.md`
(revision 1, Library identity `libfile_929c5d47b7f88191b5ff054820670618`). Its API
sampling, D08/D13 inheritance and MCP evaluation evidence retain their stated
limits. This synthesis carries the actionable contracts here; it does not require
Library access to execute them or claim a fresh full-catalogue audit.
