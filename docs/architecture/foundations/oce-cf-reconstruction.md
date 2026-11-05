---
boundary: B2-Architecture
doc_role: reference
authority: oce-cf-reconstruction
status: programme-design
last_reviewed: 2026-10-10
---

# Capability Foundations reconstruction within the OCE programme

This is the implementation-facing CF reconstruction account for the OCE
rearchitecting programme. It preserves the existing first useful delivery,
disposes the ten mixed `packages/core` workspaces, and states the contracts,
assurance and migration obligations a fresh implementer needs. It does not
claim implemented or Qualified capabilities, published packages, or adoption of
the complete 5 October definite-architecture proposal.

The [common architecture](reliable-atoms-and-composition-architecture-2026-09-08.md)
owns grades and common assurance; the [adoption profile](capability-foundations-adoption.md)
owns the first-build and TypeScript/Node profile; the
[implementation-origin policy](algorithms-and-data-structures-governance-2026-09-08.md)
and [Engraph ADR-230](../architectural-decisions/230-own-built-algorithm-and-data-structure-foundations.md)
own authored algorithms and data structures. This account owns their application
to this reconstruction and the explicit source reconciliation below. The
specialist source editions retain research authority; repository plans own
execution sequence. Changes to a source requirement trigger a reviewed delta
here, not an independent edit to two purported canonical rules.

## 1. Settled scope and architectural distinctions

CF is the construction and assurance framework for eventual reconstruction of
every existing OCE digital capability and every admitted required capability.
The generic foundations collection is only one ownership area. Tooling,
platform, data, curriculum, learning and interaction capabilities retain named
owners and can all be constructed under CF. Apps, sites, API products and
operated services are assembled outputs above CF; their operation, publication,
accessibility, support and institutional responsibilities remain real duties.
Software does not acquire teacher or institutional authority by implementing
a supporting mechanism.

OCE keeps all mechanisms and potentially reusable material. External app
repositories own the smallest useful instance-specific configuration over
published packages. The historical source assessment's references to
application composition roots do not authorise executable roots, provider
adapters or operating scripts in external apps: execution stays in OCE and the
instance supplies declarative selections and values through the supported
contract. Nor does 'outside the generic foundations collection' mean outside
OCE or outside eventual CF reconstruction.

The unit of progress is a complete responsibility, not a package rename.
Primitive, Component and Subsystem are grades; Mechanism, Facility, Adapter,
Coordinator and Arbiter are roles. Families, local semantic layers, package
boundaries and qualification are separate dimensions. A semantic layer states
its purpose, prerequisites, added guarantee, hidden decisions, crossing
obligations, completion and reopening conditions. No empty forwarding layer or
compulsory adjacent-grade hop is required.

A Primitive has no peer estate capability dependence, including type-only and
hidden semantic dependence. A Component may consume Primitives and Components;
a Subsystem may also consume Subsystems. A standard language/runtime and
portable tools are declared substrate; an ordinary capability cannot be
relabeled substrate to evade independence. A canonical Result dependency is
real composition. Copying Result to obtain a Primitive label is forbidden.
A minimal local outcome belonging only to an independent contract can be
appropriate, subject to the adopting repository's outcome rules.

Complete definition, proof and implementation of an independently useful
concept have value before a second consumer exists. Potential reuse is enough
for OCE custody. Neither consumer count nor independent package publication is
a condition of CF admission or qualification. Conversely, membership and a
public export are not evidence of qualification or publication.

## 2. Ten-workspace disposition

All ten workspaces still existed under `packages/core` at Engraph
`efe69ff66182832dabe7f667ea0fa0ea021bc2ba`, inspected 10 October 2026. Their
manifests were private. The other eight workspaces had version
`0.0.0-development`; `oak-eslint` and `workspace-config` had `1.0.0`. These
are source observations, not registry or installability evidence. The 15
September ten-workspace analysis was pinned to
`4786abb7ff0020af397482a2afcd65348a4ad181`; its decisions are retained below
and consequential observations were selectively refreshed, not represented as
a new exhaustive correctness or consumer audit.

| Existing workspace           | Disposition and retained responsibility                                                                                                                                                                                                   | Required closure before replacement or a Qualified claim                                                                                                                                                                                                                                                                                                                 |
| ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `result`                     | Retain one coherent outcome algebra; reconstruct/qualify as an independent Primitive where the actual closure permits. Keep construction, guards, mapping, sequencing, collection and extraction together when they express that algebra. | Preserve success/error distinctions, first-error collection and applicable error-identity behaviour. Consumer domain errors and recovery policy stay downstream. Establish the full assurance record; a zero-dependency manifest alone is insufficient.                                                                                                                  |
| `type-helpers`               | Reconstruct honest object-key/entry operations as a small complete capability. Retire false narrowing rather than move it unchanged.                                                                                                      | The current own-key predicates infer `keyof T` from runtime membership, although structural values can contain extra keys. Numeric keys stringify and the current entry union loses key/value correlation. Choose an admitted validated key-space contract, or wider honest outputs; account for actual consumers and generated compatibility exports.                   |
| `graph-core`                 | Split responsibilities into RDF values, Dataset, bounded GraphView and coherent RDF-processing contracts. Preserve useful standard-vocabulary facilities; retire the mixed umbrella rather than rename it wholesale.                      | Preserve term/equality and dataset/set semantics, ownership and declared order; GraphView is composed where it uses Result. Resolve vendor-type leakage, remote-document loading policy, supported RDF/JSON-LD round-trip scope and canonicalisation/hash assumptions. Current GraphView/RDF boundaries need separate contracts, not a new graph barrel.                 |
| `safe-path`                  | Preserve one complete filesystem-resolved containment guarantee. Select either a complete independent Node-profile capability or a composition over separately owned path/realpath contracts.                                             | Lexical containment is weaker than symlink-resolved containment. A safe path string is not authority for a later race-free write. Account for existing read targets, absent write targets, ancestor checks, descriptor/link checks and concurrency/platform assumptions before consolidating stronger consumer behaviour.                                                |
| `observability`              | Separate generic value normalisation/redaction candidates, a coherent telemetry lifecycle if useful, provider bindings, and product/event policy. Retain every useful mechanism in OCE.                                                   | Define loss, cycles, finite values, aliasing, error/stack treatment and failure before generalising JSON transforms. Give OTel/Sentry/PostHog and sink selection their owners. MCP event meaning and actor/privacy policy are domain/operating contracts, not generic telemetry laws.                                                                                    |
| `env`                        | Dissolve the general environment umbrella into provider-owned schemas, reusable configuration admission/composition, and instance-selected operating profiles. Keep decoding/acquisition/validation mechanisms in OCE.                    | Remove hidden repository-layout dependence from general imports. `ROOT_PACKAGE_VERSION` still reads the root package file at import time; acquisition needs an explicit build/runtime boundary. Preserve justified cross-provider rules as owned profiles, rather than universal laws. External apps supply configuration, never bespoke validators or schema execution. |
| `build-metadata`             | Give release identity, build provenance, release selection and host naming a release/operations owner. Consider a complete SemVer value/parser/order capability only as a separately justified reconstruction.                            | Preserve shared release identity across consumers; make input precedence and value acquisition explicit. Current runtime metadata depends on env's eager root version. A regex or pure release helper is not by itself a generic SemVer capability.                                                                                                                      |
| `oak-eslint`                 | Retain as engineering tooling, with architecture policy/inventory, AST mechanisms, vendor adapters and presets as coherent responsibilities. It remains in OCE and within eventual CF construction.                                       | Reconcile old core/libs/foundation boundary categories with grade, area and exposure rules. Distinguish rule files, registered rules and effective consumer configuration. Preserve the actually applied strict and test rules and automatic boundary coverage.                                                                                                          |
| `workspace-config`           | Retain portable build/test configuration as coherent engineering tooling; preserve useful `/tsup`, `/vitest`, `/vitest-e2e` and `/no-network-setup` contracts.                                                                            | No forced package per subpath. A fetch stub is not universal no-I/O enforcement. Preserve setup ordering and make consumption work without scavenging root files; keep production source settings separate from tooling.                                                                                                                                                 |
| `openapi-zod-client-adapter` | Retain the generator/normalisation/compatibility seam as schema-generation tooling until a qualified Castr replacement consumes its responsibilities. Preserve its provenance and supported generated shape.                              | Current endpoint transformation still falls back to `z.unknown()`. Define unsupported/invalid-input behaviour explicitly; no silent widening or skipped endpoint. Account for SDK-specific rewrites and downstream generated imports before replacement. Castr integration is separately planned, not established by this disposition.                                   |

The current source refresh inspected all ten manifests and the material
`type-helpers`, `env`, `build-metadata`, `safe-path`, `graph-core` JSON-LD/term,
`graph-ingest` JSON-LD and generator-adapter seams. It confirms that key
reconstruction obligations remain. It does not re-audit every export or
transitive consumer. Each implementing slice must enumerate the complete
affected consumer and public-exposure closure before removal.

These rows are governed by the retained CF programme and the OCE reconstruction contracts. The native programme route allocates their concrete implementation receivers; no unspecified “core reconstruction” lane is assumed. Their dependent
work is apportioned to value foundations (`result`, honest object operations,
RDF values), graph/data composition (`graph-core`), filesystem guarantees
(`safe-path`), diagnostics/configuration/release (`observability`, `env`,
`build-metadata`), and engineering/generation tooling (the final three rows).
Each is picked up as a bounded contract/replacement slice; no row is abandoned
because it has no generic Primitive extraction. Exact directory and package
allocation follow those contracts, dependency closure and release
responsibility. They are not ten predetermined moves.

## 3. First useful delivery: geometry through a complete heap

The existing first-build direction is retained: finish BinaryTreeIndices
first, then the admission, storage and order responsibilities needed by two
repairs, then a composed BinaryHeap. The first stateful repair is the early
composition checkpoint. Stable priority queues, graph families, top-k and
schedulers remain later branches. This endpoint establishes one useful bounded
construction, not universal superiority or measured development savings.

### Complete supported profile

BinaryTreeIndices owns exact bounded parent/child relations. Length is an
integer from zero through `2^32 - 1`; a position must satisfy `0 <= i < n`.
Reject non-numbers, non-integral and out-of-range inputs determinately. A root
has no parent; a child outside the length is absent. For non-root positions,
parent is `floor((i - 1) / 2)`; child candidates are `2i + 1` and `2i + 2`.
Define and prove bounds, inverse relations and terminating parent chains,
including supported rejection behaviour. No 32-bit narrowing and no
maximum-size allocation is required to check maximum-domain arithmetic.

The complete heap vocabulary is empty construction, insert, peek, take and
exact size. Peek observes a least occurrence without mutation; take removes
one least occurrence. Empty is normal absence, distinct from failure and from
a retained `undefined`. Duplicate values and repeated object references are
distinct insertion occurrences. Equivalent values have no FIFO guarantee.
Operations are synchronous/sequential and heap instances are independent.

The order is fixed for an instance and is a lawful strict weak order,
deterministic, terminating, non-reentrant and non-throwing on retained values.
Ordering-relevant keys do not change while retained. The caller owns these
premises for a custom order; the owned demonstration supplies a finite-number
order, including signed-zero equivalence. Sampling cannot prove arbitrary
callback laws. Recoverable fallible comparison is outside this profile: if a
chosen public boundary admits it, specify and prove restoration, unpublished
state discard or invalidation before expanding the contract.

Construction declares a non-negative integral maximum size inside the
array-length profile. Invalid construction and capacity rejection have
distinct typed outcomes. Capacity rejection precedes mutation and preserves
contents, size and subsequent behaviour. The heap exclusively owns its storage
and exposes no representation mutator. Payload references can be shared under
the ordering contract. Removal clears obsolete collection-owned backing and
scratch references; it makes no immediate garbage-collection promise.

Peek and size are constant work; repair/comparison work for insertion and
removal is logarithmic in current length under declared lower-operation costs.
Account for growth copying, allocation, comparator cost and scratch space
separately. Legal arithmetic capacity does not promise available memory.
Fatal allocation failure, process termination and runtime corruption are
outside the qualified profile. Bulk construction, stable ties, handles,
arbitrary deletion, decrease-key, merging, concurrency and scheduling are
outside this version, not forgotten required behaviour.

### Construction and dependency gates

| Step                            | Owned output                                                                                                                                                         | Actual gate                                                                                                                                                                                                                          |
| ------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 0a: bind execution              | Repository-bound contract, outcome/grade decision, exact compiler/runtime/source/exports profile, finite proof-to-production route and boundary-enforcement profile. | A concrete first-geometry law and all supported rejection paths can be mapped to actual production operations; commands and evidence requirements have real homes. No universal proof platform or estate-wide catalogue is required. |
| 0b: connect assurance           | Smallest discriminating proof/enforcement and native/packed-consumption connection.                                                                                  | Actual production correspondence and lawful/forbidden controls work under the declared profile. A model-only proof, sampled law test or manual inspection of imports cannot qualify the implementation.                              |
| 1: finish geometry              | Complete BinaryTreeIndices with its own admission outcomes.                                                                                                          | Applicable R requirements, and C01–C08 if the chosen outcome/dependency binding makes it composed, with exact evidence and public consumption.                                                                                       |
| 2: close remaining admission    | Finite-number and bounded-count/capacity domains, failure precedence and ownership.                                                                                  | Every remaining admission decision has an owner before storage/order relies on it. Geometry's own admission was already completed, not deferred here.                                                                                |
| 3a/3b: finish storage and order | DenseOwnedBuffer and FiniteNumberOrder as separately complete contracts.                                                                                             | Density, length, indexing, append/removal, aliasing, cleanup, growth/allocation/failure and costs; finite-number order laws and domain. Neither borrows the future heap's evidence as its own qualification.                         |
| 4: append repair                | Preserve occurrences and restore order after appending one leaf to a previously valid heap.                                                                          | Public geometry/storage/order contracts suffice; ownership, termination and premises are closed. It does not repair an arbitrary bad edge.                                                                                           |
| 5: root-subtree repair          | Restore order at a subtree root whose child subtrees are already ordered.                                                                                            | Preserve occurrences within that subtree and establish termination; no unsupported claim about an external parent.                                                                                                                   |
| 6: finish heap                  | Owned state and complete construct/insert/peek/take/size histories.                                                                                                  | The heap establishes every repair premise, preserves its invariant and valid supported-failure states, and satisfies R02–R10/C01–C08.                                                                                                |
| 7: consumed form/substitution   | Independent packed consumer and one compatible lower implementation substitution.                                                                                    | Consumer source and the contract-level connecting argument remain unchanged; rerun applicable evidence. Stop before stable-queue policy.                                                                                             |

The first startable implementation tranche is 0a, 0b and geometry, with an
explicit stop at any unestablished proof or enforcement requirement. Its
consumer is the subsequent repair author; its accountable role is the CF
capability maintainer, with a separate contract/assurance reviewer. Stage 0a
must select the smallest adequate proof route and declare trusted semantics,
tooling and correspondence; it cannot silently select Lean or another system
just because it proves the abstract integer formula. Qualified geometry is
the value outcome, not a filled register. Later stages are deliberately
separate bounded increments.

CF-first is preferred sequencing. Contract work, consumer/dependency mapping,
package-release design and app thinning in place can proceed where their
actual prerequisites permit. Applicable automatic boundary enforcement blocks
qualification. Completed published package closure blocks independent app
consumption/handover. The entire heap, graph programme, complete CF catalogue
and whole Castr compiler are not universal app-extraction or data/API gates.
Any supported interim package remains explicitly not CF-qualified where its
evidence is incomplete, with a named reconstruction slice and unchanged
support obligations. This CF source analysis supplies no handover timing
evidence that warrants departing from the CF-first preference; the programme
must consider any separately evidenced consumer timing explicitly.

## 4. Qualification and the real public form

R01 applies to independent Primitives; R02–R10 apply to every grade;
C01–C08 apply to Components and Subsystems. A capability is Qualified only
for its exact contract, implementation, dependencies, execution profile and
evidence. A completed contract, adopted design, running implementation,
published package, operational service and educational benefit are different
states.

Each candidate needs a compact co-located record: responsibility/consumer,
owner, admitted observations and failures, grade/role, dependencies and
assumptions, public surfaces, obligation IDs and applicable R/C requirements,
implementation and artifact identity, evidence type/subject/instrument/result,
outstanding gaps and reopening conditions. Reuse existing owning facts and
generate views where mechanical. Do not build a second unrelated registry or
an invented universal mathematical language. The programme's qualification
view is derived from applicable evidence, never a manually enduring Boolean.

Required evidence covers definition adequacy, mathematical validity and
production correspondence separately. State exact propositions, representation
relations, actual source, guards, error paths, trusted transformations and
which proof steps are machine-checked or reviewed. Tests, source hashes,
schema-valid records and an agreeing reviewer cannot substitute for the
required proof. A trusted compiler/runtime remains an explicit premise.

Use an independent occurrence-list/history oracle for the heap, preserving
payload identities and duplicate occurrences while admitting any least member
of an equivalent-order class. Do not impose FIFO through a sorted reference
implementation or use a set that erases occurrences. Exercise empty,
singleton, refill, interleaving, repeated references, `undefined`, capacity
rejection and supported post-failure histories. Composition review must
reconstruct the new guarantee from public prerequisite contracts; needing
private lower internals reveals a boundary defect.

Mutation campaigns cover the complete owned runtime scope, including private
helpers and generated/copied production mechanism where included. Resolve
every survivor, uncovered mutant, equivalence argument, invalid/ignored case,
timeout and infrastructure failure honestly. Include manually seeded faults
where automatic operators miss relevant errors, such as narrowing arithmetic,
wrong child choice, occurrence loss and retained obsolete references. An
erased type-only responsibility instead needs its complete type/misuse
evidence; there is no invented runtime population. Reuse unchanged dependency
evidence and add the composition's own interaction evidence.

All tests and test helpers remain free of I/O. Compiler, proof-checker,
packaging and environment profiling records retain their actual acquisition
conditions; an I/O test cannot be disguised as a script. Source inspection
can expose violations but is not itself exhaustive no-I/O enforcement.
Performance claims have an analytical cost model and appropriately scoped
operation-count/runtime/allocation evidence. No team, workload or development
speed measurement is commissioned.

The adoption profile requires three distinct checks: complete static source
conformance, native execution of authored production TypeScript, and clean
consumption of emitted JavaScript/declarations outside the originating
workspace. Its recorded Node compatibility floor is 24.12.0; choose and
record a maintained execution patch and exact TypeScript compiler at pickup,
without claiming untested patches are observed. Framework/bundler tests do
not establish native source execution. Installing raw `.ts` under
`node_modules` is not the ordinary packed Node route. Bind every receipt to
source/artifact identities, compiler/configuration/input inventory, package
metadata, dependency closure and runtime invocation. Include lawful and
expected-rejection controls.

## 5. Exhaustive architectural-boundary implementation contract

The 16 September owner requirement is stricter than a directory matrix or
export map. This section conserves the material operational requirements of
the current specialist Standard §3.1 for repository implementation; the
common Standard owns the underlying requirement. These are required outcomes,
not a claim that the current repository checker already supplies them.

Every governed source/entity and emitted surface must have an owner and
classification. Record grades, roles, families/local layers, packages,
production/assurance/tooling scope, platform assumptions and consumer
audiences. Membership and directory placement grant no rights. Inventory
reconciliation detects unclassified material rather than inspecting only
voluntarily listed entries. Classification must cover generated source and
resolved declarations as well as handwritten runtime imports.

Distinguish permissions to import a runtime value; import a type/schema;
invoke/construct/implement; re-export; disclose signature or structural shape;
pass/retain/return a value or handle; observe/mutate an owned instance; supply
callbacks/providers; delegate authority; and rely on proof/tool/environment
contracts. Import permission is not onward-exposure permission. Permission
is not transitive. Publicness is relative to an audience, and a constituent
public API cannot bypass an enclosing invariant's ownership.

For each relationship, resolve exact identities, classification, action,
surface, audience, policy revision, profile and relevant instance authority.
Reject unknown/unsupported/conflicting declarations. Apply hard architectural
constraints and all applicable prohibitions before grants; denial wins over
allow, and missing grants deny. Establish every condition through the declared
enforcement. A consumer cannot grant itself rights withheld by a provider or
governing policy. More permissive membership cannot erase stricter rules.

Check dependency and public-exposure graphs separately, including aliases,
barrels, re-exports, nested/inferred/generic types, callbacks, iterators,
returned handles, source-path bypasses, generated code and admitted dynamic
loading under the actual compiler/build configuration. Ordinary supported
routes cannot be excluded merely to pass. A copied immutable projection can
be lawful when its output meaning and disclosure are authorised; computation
from private state does not itself make all derived values forbidden.

Where static analysis cannot establish ownership or authority, use a defined
runtime boundary or checker-verifiable evidence, or exclude that unsupported
construct explicitly from the promised profile. Do not waive requirements
with casts, reflective access, suppressions or manual approval. Checks fail
closed on unavailable/crashed/skipped analysis, unresolved edges and stale
inputs. Enforce in normal validation, CI and public-artifact release admission.
Receipts bind policy, membership, source, dependencies, outward surfaces,
compiler/configuration and checker identities.

Assure the policy evaluator and the source/exposure extractor separately.
Demonstrate allowed compositions and required rejection of forbidden runtime
and type imports, membership changes, aliases/re-exports, leaked types,
owned-handle bypasses, unknown ownership, contradictory grants and analysis
failure. Finite policy completeness is not proof that the source extractor
covers every admitted construct. A closed profile must be sufficient for its
promised guarantees; it does not claim protection against arbitrary hostile
modification of source/runtime.

## 6. Replacement, compatibility and retirement

For each slice, list every preserved source responsibility, old public form,
consumer and generated/re-exported surface. Establish a new contract owner
before moving code; classify actual dependencies before choosing packages.
Preserve source provenance, useful negative findings and unimplemented work.
No existing mechanism disappears because today's consumer does not use it.

Cutover requires: the replacement meets the selected complete contract;
applicable source/native/packed and supported-version checks pass; consumers
use only intended public forms; configuration and diagnosis/recovery routes
work under representative software scenarios; and release rollback is
defined. Keep behavior and provenance evidence bound to exact releases.
Do not claim CF qualification for a merely supported transitional package.

Historical compatibility exports are a migration possibility, not blanket
permission to add shims contrary to current repository policy. Prefer one
atomic in-place change where all consumers can move together. If distributed
consumer/version skew requires a transition, author a bounded migration
decision with its exact old/new forms, owner, support window, rejection and
removal condition, and reconcile it with current `replace-dont-bridge`
rules before implementation. Do not silently preserve an obsolete contract
or silently break a known supported consumer.

Rollback requires a known-good compatible package/configuration pair and
compatible data representation. When schema or meaning changes prevent that,
the slice must provide a proved reverse mapping or a forward-recovery path;
reinstalling an old package alone is not rollback. Observe cutover by resolved
consumer/public-artifact identities and required behavior checks, not by a
directory move or absence of an import string alone.

Retire an old export/workspace only after the full consumer, type/exposure,
generated, packaging and operational reference closure is migrated or has an
explicit supported disposition. Remove obsolete discovery/enforcement entries
and repair navigation. Preserve historical evidence and source attribution.
Keep completed unchanged scopes closed; changes to contracts, ownership,
policy, dependencies, toolchain or environment reopen only affected evidence
and reliance. A discovered defect is corrected, not treated as permission to
call unfinished work permanently complete.

## 7. The definite-architecture proposal: exact decision homes

The 5 October specification r2 and handoff r1 are a completed, reviewed,
incorporated but **unratified** proposal. Their own 'ready to adopt' labels are
recommendations. Their proposed rejections do not repeal adopted policy.
The handoff's 'authoring requirements now' describes the proposal's exact
later-authoring interface, not an unnoticed adoption event. This programme
does not import its complete D2 model, D3 contracts or D4 source correspondence
as ratified repository doctrine.

| Item | Proposed choice and present treatment                                                                                                                                             | Precise decision and dependent work                                                                                                                                                                                            |
| ---- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| N01  | Independent classification dimensions, identity/standing and local seven-field layers. Existing grades and meaningful layer obligations are already retained.                     | Architecture owner decides the exact common authoring representation before mandating its schema for all future entries. Existing finite first-build authoring can proceed.                                                    |
| N02  | Intersecting SH-CLOSED, SH-INTERACTION, SH-INTERPRETATION obligations, not compulsory strata.                                                                                     | CF architecture owner compares shared labels with equivalent local-only contracts. Gates tooling that requires these labels, not the underlying contract obligations.                                                          |
| N03  | LF01–15/F01–22 as discovery organisation only.                                                                                                                                    | Target-register owner decides navigational adoption when authoring the wider register. Families cannot create unit boundaries, permissions or build order.                                                                     |
| N04  | Exact typed entities/relations, BP01–16 total policy and target-entry schema.                                                                                                     | Architecture/enforcement owner binds an explicit profile sufficient for the first slice under §5; adopting the full proposed schema is a separate decision. Necessary undecided permission semantics block affected admission. |
| N05  | Connector, coherent-observation and profile-binding contracts.                                                                                                                    | Relevant data/interaction owner binds each selected provider/profile and required observation/recovery semantics before that connection is admitted. No blanket state/version envelope for stateless operations.               |
| N06  | Interpretation warrants; pure return, delivery, receiving and human action separated.                                                                                             | Domain/service owners bind actual meaning, receipt and institutional duties before relying on a service guarantee. This cannot be decided from CF arithmetic alone.                                                            |
| N07  | Role-based proof reliance: a separately owned estate theorem assumed as a capability contract counts as semantic dependency; generic mathematics/checkers are substrate premises. | CF architecture owner decides this particular classification rule before it is needed to classify a proof-dependent unit. No retroactive claim that all exact proposal semantics were established.                             |
| N08  | Baseline-plus-delta source correspondence with facet dispositions.                                                                                                                | Target-register owner decides the full source-overlay form before broad authoring. The programme already preserves responsibility/standing/provenance in its bounded dispositions.                                             |
| N09  | Exact completion/evolution and later-register interface.                                                                                                                          | Qualification/target-authoring owners bind their representation before tooling depends on it. Existing contract/implementation/evidence separation and reopening remain mandatory.                                             |
| N10  | Shared labels improve authoring/discovery; upfront completion reduces later costs. These remain empirical propositions.                                                           | No adoption as demonstrated facts and no team study commissioned. A future actual counterexample can reopen the architecture; this programme makes no numerical savings claim.                                                 |
| N11  | Reject mandatory stratum names/placement; retain optional explanatory views.                                                                                                      | Architecture owner decides itemised proposal adoption. The current programme imposes no compulsory stratum ladder.                                                                                                             |
| N12  | Reject flat bands, a universal state tier or graph-alone sufficiency; preserve the local-contract counterframe.                                                                   | Architecture owner decides the proposed disposition. Contract obligations must be complete whether represented locally or with shared labels.                                                                                  |

Further slice decisions remain precise and bounded: geometry's outcome/grade
and proof route (stage 0a); source/packed/toolchain profile and enforcement
mechanism (0a/0b); complete storage policy (before 3a); path-safety containment
versus write-authority scope (path slice); standalone JSON/telemetry and SemVer
scope (diagnostics/release slices); RDF-processing guarantee and remote-load
policy (graph/data slice); generated loss/rejection and Castr substitution
scope (generation/integrity slice); package closure, supported skew and
retirement (each publication/migration slice). Each decision names its
admitted operations, alternatives, owner, evidence and downstream blocked
work. None authorises a programme-wide pause for unrelated choices.

## 8. Provenance and limits

This account derives implementation requirements from these authored source
editions, read on 10 October 2026. Repository-native documents above remain
the execution read path; no private Library access is needed to understand
the requirements in this page.

| Source edition                          | Identity and inspected scope                                                                                                                                                                                                                                                                                                                                    |
| --------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Architecture/rework commission          | `oce-architecture-and-rework-plan-consolidation-brief-2026-10-10.md`, r0.6; `libfile_ab1e6943c7b08191b6d01b5425ef08b6`, saved v5; full brief. Current commission supersedes its preparation-only lifecycle.                                                                                                                                                     |
| CF architecture and assurance synthesis | `capability-foundations-architecture-and-assurance-2026-09-15.md`, r14; `libfile_5594bb768bf4819186390f894c03dc10`, saved v14; maintenance/authority sections, independence/profile and complete §13 dispositions, with the old source cutoff retained.                                                                                                         |
| Development policy                      | `capability-foundations-development-policy-2026-09-08.md`, body r9; `libfile_1f13f1e62d7c8191ad6741aa15c84cb4`, saved v10; full text.                                                                                                                                                                                                                           |
| First-delivery plan                     | `capability-foundations-first-delivery-plan-2026-09-16.md`, body r6; `libfile_8886cda156fc8191bbff2460c9c99038`, saved v5; full text.                                                                                                                                                                                                                           |
| Capability Assurance Standard           | `capability-foundations-architecture-and-assurance-standard-2026-09-08.md`, working definition 1.11; `libfile_ec4d4332058c8191b832700c3f6cd527`, saved v12; full text, especially R01–R10, C01–C08 and §3.1.                                                                                                                                                    |
| Development and qualification method    | `capability-foundations-development-and-qualification-method-2026-09-16.md`, r10; `libfile_32e6c8d209c481918a21055fded8bf7e`, saved v10; §§2–8 and first-instance opening; proposed operational binding, not implemented machinery.                                                                                                                             |
| Definite architecture and handoff       | `capability-foundations-definite-architecture-specification-2026-10-05.md` r2, `libfile_3bdd0b31544c819192e51cb9d07a4812`; handoff r1, `libfile_43f8d67ffd448191a5468ad711eeecdd`; both full texts read in focused delegated scrutiny. No saved version supplied by read. D2/D3/D4 companions were not independently re-audited for this account.               |
| Native CF records                       | Engraph `efe69ff66182832dabe7f667ea0fa0ea021bc2ba`: strategic `reliable-atoms-programme`, delivery `graph-and-queue-foundations-delivery` and `reliable-atoms-workspace-shape`, native adoption profile and relevant common architecture. Historical plan identities retained; a merged document is not an implementation receipt or a fabricated ratification. |

This was static desk analysis. It ran no repository builds, package managers,
proof checkers, mutation campaigns, consumer installations or deployments.
Focused reviews share source lineage and are correlated design scrutiny, not
independent empirical assurance. The source-level findings justify planning
obligations; implementation evidence remains later work.
