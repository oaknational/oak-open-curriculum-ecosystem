---
id: graph-and-queue-foundations-delivery
node_type: delivery
name: "Capability Foundations first delivery — geometry through composed heap"
overview: >-
  Finish BinaryTreeIndices, admission, storage and order contracts, then two
  public-contract repair mechanisms and a composed BinaryHeap, with bounded
  proof and architectural-enforcement bindings before qualification.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: reliable-atoms-programme
impact_areas:
  - practice-and-estate
tickets: []
depends_on:
  - plan: oce-cf-assurance-binding
    kind: blocking
  - plan: reliable-atoms-workspace-shape
    kind: beneficial
owner_gates: []
last_updated: 2026-10-10
---

# Capability Foundations first delivery

## Goal

Finish **BinaryTreeIndices** as the first delivery target and a composed
**BinaryHeap** as the first useful endpoint. Each completed constituent supplies
public guarantees the next composition can use without reopening its mechanism.
The first stateful repair is the early check that meaningful composition works.
A register entry with a failed gate records incomplete work, not delivery success.

The [adoption profile](../../../docs/architecture/foundations/capability-foundations-adoption.md)
owns the contracts, completion criteria, TypeScript/Node profile and data/API
adoption boundaries. The [common architecture](../../../docs/architecture/foundations/reliable-atoms-and-composition-architecture-2026-09-08.md)
owns the assurance bar, and [ADR-230](../../../docs/architecture/architectural-decisions/230-own-built-algorithm-and-data-structure-foundations.md)
owns implementation origin. This node owns sequence and completion evidence.
Its identity and sketch status are retained. [ADR-233](../../../docs/architecture/architectural-decisions/233-retained-framework-and-configurable-instances.md)
and the [CF reconstruction account](../../../docs/architecture/foundations/oce-cf-reconstruction.md)
connect this delivery to the retained OCE framework. The 10 October commission
authorises documentary design, not application implementation or a new ratification
stamp. The historical programme direction remains in force at its stated scope.

## User groups and value

Capability authors get a finite path from one provable law to a useful stateful
facility. Consumers get complete public contracts and evidence without maintaining
private lower invariants. Maintainers can distinguish completed work from open
obligations. Neither candidate value nor publication requires a second consumer.

**Value line, from the ratified source.** The programme node
[`reliable-atoms-programme`](../strategic/reliable-atoms-programme.plan.md)
(status ratified, the owner's "Ratify all six" of 2026-09-08) carries the owner's
direction of 2026-08-17 verbatim: "where we can factor out code, data structures,
algorithms, patterns, into small, single responsibility, well tested, well
encapsulated modules, with a strict public API, and put those in the core, I want
us to do that, each one with extensive TSDoc, including multiple positive and
negative examples... all the most fundamental building blocks standardised and
brought up to a level of true engineering and developer experience excellence...
performance tested." The programme's Delivery section names this node's scope as
the first target: "BinaryTreeIndices is the first target capability, with required
admission/outcome prerequisites closed before qualification; the composed
BinaryHeap is the first useful endpoint." This node delivers the bounded geometry-to-heap construction under that word;
contract ownership and actual dependencies determine the number of units and packages. The proof that each pull request delivers that value and
not activity: its body names the stage row it closes, the bar items (the
programme's §The bar, items 1 to 10) its evidence satisfies, and the completion-record row it is
entitled to fill; a row is filled only on recomputed evidence (criterion 5).

## Mechanism

Each stage closes one supported responsibility. Author one-step delivery nodes at
pickup under the current repository rules; a row is not an umbrella implementation
PR. Reuse assurance infrastructure and add only the missing instrument required by
the selected capability. Preserve the complete assurance bar at every stage.

| Stage                  | Work                                                                                                                                                                 | Completion gate                                                                                                                                                                                            |
| ---------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 0a — bind execution    | Bind exact source/exports, canonical outcomes, compiler/runtime matrix, proof method, production correspondence, classified entities and permitted imports/exposure. | A repository-bound contract/profile with actual commands and evidence obligations; resolve Primitive independence versus canonical Result honestly.                                                        |
| 0b — connect assurance | Demonstrate one geometry proof reaching production operations, plus positive/negative architectural controls and native/packed consumption routes.                   | Blocking automatic checks cover the whole governed source and emitted surface; forbidden imports, type exposure and unknown classification are rejected. A model-only proof or hand-check is insufficient. |
| 1 — geometry           | Finish exact bounded tree-index relations under the chosen outcome binding.                                                                                          | Applicable R requirements and C01–C08 if composed, with independent laws, production correspondence and public consumption.                                                                                |
| 2 — admission          | Close finite-number and bounded-count/capacity admission, failure precedence and their call sites.                                                                   | Every domain decision has one owner; actual runtime/type/semantic dependencies determine grade.                                                                                                            |
| 3 — storage and order  | Finish DenseOwnedBuffer and FiniteNumberOrder as separately owned contracts.                                                                                         | One selected growth/allocation/failure/lifetime policy; exact density/length/cleanup and cost evidence; lawful finite order with signed-zero equivalence.                                                  |
| 4 — append repair      | Compose public geometry/storage/order contracts under the appended-leaf premise.                                                                                     | Occurrence preservation, termination and restored order; a reviewer needs no lower private internals.                                                                                                      |
| 5 — root repair        | Establish the child-subtree premises, child choice and descending variant.                                                                                           | Complete subtree guarantee without an unsupported external-parent claim.                                                                                                                                   |
| 6 — heap               | Own state and construct/insert/peek/take/size histories; establish repair premises at every call.                                                                    | R02–R10 and C01–C08; duplicates/repeated references, stored undefined, empty/capacity outcomes and supported rejection post-states all covered.                                                            |
| 7 — public consumption | Consume the packed public form and substitute one compatible lower implementation.                                                                                   | Reproducible evidence supports the whole selected contract; stop before stable-queue policy work.                                                                                                          |

Stage 0 is finite feasibility work, not a qualified capability or a general proof
platform. Failure closes no qualification claim; resolve the affected obligation
before proceeding. Admission checks needed by geometry are specified with its
stage-0 contract and completed before geometry is called Qualified. Stage 2 closes
the remaining storage/order admission responsibilities, not a retrospective repair
of an already-qualified geometry contract.

The `beneficial` workspace-shape edge permits contract and proof design to proceed
independently. Its applicable automatic enforcement and stricter class profile
are blocking before a governed unit is Qualified. Qualification also requires the
full dependency/exposure/ownership controls in the CF reconstruction account;
file-cardinality and sample import fixtures alone do not supply them. No manual
review substitutes for required enforcement. Each governed workspace uses its
declared class and stricter budgets from its first implementation slice.

CF-first is preferred ordering, not a blanket dependency. App thinning in place,
contract design and release work may proceed on their actual closures. Completed
published package closure blocks external app consumption; this whole heap delivery,
the wider CF catalogue and unrelated graph families do not automatically block it.

## Acceptance criteria (each with a proof — required)

1. The stage-0 profile is closed and its production-correspondence and boundary
   probes discriminate the named forbidden cases. Proof: `repo-safe` — exact
   source/config identities, proof receipts, positive/negative check results and
   native-source/packed-consumer validation records.
2. Every selected constituent satisfies its whole contract and applicable common
   and composition requirements before downstream reliance. Proof: `repo-safe` —
   independently derived laws/models, deterministic public-interface tests, complete
   mutation dispositions, performance evidence and documentation/consumption checks.
3. The first repair's connecting argument uses public prerequisites only, and the
   heap preserves occurrences and valid state over its full supported histories.
   Proof: `repo-safe` — composition review, independent occurrence-model traces and
   a compatible lower-implementation substitution through public surfaces.
4. Tests and imported helpers perform no I/O; provider/runtime observations use
   their appropriate validation surfaces with explicit scope. Proof: `repo-safe` —
   classified-source and dependency/exposure checks plus the relevant evidence.
5. Status claims in the register and documentation match exact implementation,
   contract and evidence revisions. Proof: `repo-safe` — recomputed qualification
   and review against the records above. Missing evidence leaves work incomplete.

### Instruments behind the evidence

The instrument observations inherited from 2 October are historical inputs.
At pickup, bind actual source/tool versions and reuse the current instruments.
The smallest missing instrument must serve a named geometry obligation.

- Deterministic in-memory law/history examples, type/misuse checks and complete
  mutation/fault campaigns establish their declared evidence scopes. Stryker's
  existing `packages/core/type-helpers/stryker.config.mjs` is a reuse candidate,
  not evidence that a new unit's campaign has run or covers its whole contract.
- Stage 0a selects the proof route and production correspondence; stage 0b
  demonstrates its connection to actual operations, including supported rejection
  paths. Sampled law tests, hashes and test names are not the mathematical proof.
- Boundary evidence binds the full governed source and emitted surface. Extend
  existing `validate-boundaries` mechanisms only as required by that profile;
  lawful and forbidden fixtures discriminate enforcement but do not replace
  inventory reconciliation or resolved exposure/authority analysis.
- Native authored-source execution and clean packed JavaScript/declaration
  consumption are separate checks. Reuse or add one shared consumed-form
  instrument, with lawful and broken-artifact controls. A transforming runner or
  entry-point smoke check cannot supply all required compatibility evidence.
- Verified examples use reusable OCE extraction/compilation/execution machinery.
  Extraction is an acquisition operation; capability behaviour tests and helpers
  remain free of I/O. A second-consumer threshold does not govern reuse.
- No-I/O evidence covers the test/helper dependency closure and admitted source
  profile through automatic controls. A grep can identify suspect calls but an
  empty search is insufficient proof. Missing required enforcement blocks the
  affected qualification; do not rename an I/O test as a script.
- `validate-plan-corpus` validates the plan's structure. Qualification requires
  the exact contract/implementation/profile/evidence account; plan validity or
  a completed table cannot substitute for it.

## Bounded size and completion record

The ten todos below are bounded stories, not estimates or a commitment to ten
packages. Author implementation slices at pickup under the current small-PR and
review rules. Duration and waiting are unknown; no team timing, throughput,
workload collection or measurement study is commissioned. Ordinary software
assurance and review limits remain applicable.

Contract/proof authoring can start before the workspace-shape work completes.
Qualification waits for its applicable validator/tier outputs and all other
required evidence. Track each completed stage by exact revision, evidence and
remaining obligations. The implementer and reviewer use this record to decide
whether downstream reliance is permitted.

| Todo | Stage | Implementation revision | Evidence / outstanding obligations |
| --- | --- | --- | --- |
| 1 | 0a: bind contract/profile/proof | — | — |
| 2 | 0b: enforcement and consumed forms | — | — |
| 3 | 1: finish geometry | — | — |
| 4 | 2: remaining admission | — | — |
| 5 | 3a: storage | — | — |
| 6 | 3b: order | — | — |
| 7 | 4: append repair | — | — |
| 8 | 5: root repair | — | — |
| 9 | 6: heap | — | — |
| 10 | 7: public consumption/substitution | — | — |

## Todos

The design output of stage 0a is owned by `oce-cf-assurance-binding`;
this node consumes that binding and constructs/verifies the first unit and
subsequent compositions. Do not commission a duplicate competing binding.

Each todo is picked up as a bounded implementation story under the current
repository workflow. Its change description names the stage, complete supported
responsibility, applicable assurance requirements and actual evidence. Preserve
historical owner directions without inferring new implementation authorisation
from this documentary update. The first design tranche binds stage 0a once. The first construction tranche
consumes that receipt, demonstrates 0b and finishes geometry, stopping at any unresolved proof or
enforcement obligation before qualification.

1. **Receive the bound contract** (stage 0a). The
   [CF assurance binding](oce-cf-assurance-binding.plan.md) node is the sole
   design writer for this retained stage. Consume its accepted finite geometry
   domain, outcome/grade, responsibility location, toolchain, proof route and
   qualification allocation. Verify receipt consistency; do not repeat or invent
   a competing binding. No workspace construction or Qualified claim follows
   merely from accepting the receipt. The next construction action is stage 0b.
2. **Connect proof, enforcement and consumed forms** (stage 0b). Execute the
   bounded geometry correspondence probe selected in 0a, reaching production
   arithmetic, guards and supported rejection paths. Connect the declared whole
   source/emitted boundary analysis and ownership controls with positive and
   negative cases for private imports, outward types, unclassified entities,
   stale/failed analysis and permitted composition. Reuse or supply one shared
   native-source/packed-form checking route; declarations and runtime exports
   must resolve without a monorepo checkout. Acceptance: exact proof/checker,
   source/profile and artifact receipts, lawful success and expected rejection,
   including a broken export/type fixture. Required unknown or insufficient
   evidence blocks qualification; this is not a universal proof-platform build.

3. **Geometry complete** (stage 1). Both child relations, the absent-child and
   root-parent outcomes, the range and inverse laws, terminating parent chains, the
   length domain zero through `2^32 - 1` without 32-bit narrowing and without
   allocating maximum-size storage; TSDoc with positive and negative examples
   proportional to hazard (bar item 1) and the executed-examples test that runs
   the supported behavioural examples using shared OCE machinery; the
   misuse register as a README section (bar item 2); type tests for the contract
   (bar item 3); a mutation run with every surviving mutant dispositioned. Proof:
   every law, supported outcome and implementation obligation maps to its exact
   proof or executable evidence; the production-correspondence route covers the
   complete qualified scope, not only the stage-0 sample. Record the full mutation
   campaign with resolved dispositions, verified examples and static/native/packed
   receipts. A test name or a green score cannot substitute for a missing obligation.
4. **Admission** (stage 2). FiniteNumberAdmission and BoundedCountAdmission as
   separately owned contracts: non-numbers, NaN and infinities rejected with
   determinate outcomes and a stated validation precedence; exact bounds,
   fractional and out-of-range counts and signed zero; every domain decision with
   one owner and the remaining storage/order call sites bound to them. Geometry's
   stage-1 admission is already complete; changing its dependency closure requires
   an explicit contract/grade decision and affected requalification. Evidence: a test per named case;
   the precedence test (a value failing two checks reports the first); each unit's
   grade recomputed from its actual imports, type-only included, and recorded in
   the README.
5. **Storage** (stage 3). DenseOwnedBuffer: dense storage, exact length, indexed
   read and replace, append, remove-last and obsolete-reference cleanup under one
   chosen growth, allocation, failure and lifetime policy with its costs stated.
   Proof: tests for density and length after every operation sequence, the
   removed slot holding no reference after remove-last, and unchanged state after
   each supported failure; a within-run bench for the append growth curve (bar
   item 6) only where the contract declares a complexity.
6. **Order** (stage 3). FiniteNumberOrder compares admitted finite numbers
   without overflow-prone subtraction. Equality is numerical equality with signed
   zeros equivalent; the comparison defines a total order on those equivalence
   classes (a total preorder on raw representations, not antisymmetry under
   `Object.is`). State reflexivity, transitivity, totality and antisymmetry modulo
   that equivalence. The selected proof route establishes those laws over the
   complete declared domain with production correspondence. Property tests over
   signed zeros and extreme magnitudes are supporting observations, not universal
   proof; a negative fixture comparing `Number.MAX_VALUE` and its negation
   distinguishes an overflow-prone subtraction implementation.
7. **Append-leaf repair** (stage 4). Compose the public geometry, storage and
   order contracts to restore order after one appended leaf, preserving
   occurrences and terminating. Proof: the composition test imports only the
   sub-path exports of stages 1 to 3 (checked by the todo 2 boundary fixture);
   occurrence preservation by a multiset comparison before and after over
   generated histories; termination by a step bound of the tree height.
8. **Root-subtree repair** (stage 5). Child choice and descent at a subtree root
   whose child subtrees are ordered, with no claim about the external parent.
   Proof: the premise is asserted in the test setup and the post-state checks
   subtree order and occurrences only; a negative test shows an unordered
   external parent stays unordered.
9. **The heap** (stage 6). BinaryHeap owning private state with empty
   construction, insert, peek, take and size over supported histories; duplicates
   and repeated references as distinct occurrences; stored `undefined` distinct
   from empty; capacity rejection before mutation; unchanged state after each
   supported rejection; the public surface committed as the build's emitted
   declaration for the entry point with a check that it equals a fresh build (bar
   item 4's report). Evidence: an independent occurrence-list/history model
   preserves payload identity and duplicate occurrences while admitting any least
   occurrence among equivalent values; it imposes no FIFO tie order. Compare the
   full supported histories and valid post-failure states through public contracts; the
   named outcomes for empty peek and take and for capacity; mutation and type
   tests as for todo 3; the declaration check green.
10. **Public consumption** (stage 7). A consumer fixture that uses the packed
    public form through the exports map, and a second DenseOwnedBuffer-conformant
    storage substituted through the public surfaces with the todo 9 model suite
    re-run unchanged. Proof: the packed-consumer fixture passes under the todo 2
    instrument; the substitution passes the todo 9 model suite and preserves the
    contract-level connecting argument without consumer changes; the completion
    record identifies exact revisions and sufficient evidence. This observes one
    substitution, not long-term maintenance savings. Stop before stable-queue work.

## Out of scope, with homes

The [graph delivery record](../../../docs/architecture/foundations/graph-library-review-and-delivery-2026-09-08.md)
is the home of W01–W09 as graph-programme design, not prerequisites for this first
build. W01's independent core laws are selected only when required by the current
closure; its graph contracts and W02–W09 are the graph programme's own work, homed
there. The
[stable priority queue](../../../docs/architecture/foundations/oce-queue-reliable-atom-2026-09-08.md)
is the home of the composed capability adding captured priority and stable-tie
policy.

API adoption is a separate operation-specific dependency graph. It can use suitable
native providers and selected completed contracts without waiting for unrelated heap,
graph or compiler families. Latest API-version support is ordinary maintenance of
its affected mappings, not a prerequisite for completing this heap delivery.

## Out of scope

- Stable ties, handles, arbitrary deletion, decrease-key, concurrency, scheduling
  and top-k in the first heap contract.
- Implementing the complete graph programme or API catalogue in this delivery.
- A general allocator, comparator framework or universal proof platform.
- New qualification claims from documentation or source reviews alone.
- The workspace-shape node's validator and tiers, and the programme's register:
  their own nodes, their own pull requests.

## Plan-body first-principles check

- **Shape.** Complete owned laws and histories are the value. Proof, tests,
  fault sensitivity, static boundaries and consumed-form evidence have distinct
  warrants; no single green instrument establishes all obligations.
- **Landing path.** Stage 0a binds a responsibility-owned home and actual workspace
  discovery under ADR-233. Existing scripts are reuse candidates, not a claim
  that an uncreated workspace is already covered by every gate.
- **Vendor literal.** The adoption profile owns source/runtime requirements;
  exact compiler and proof/consumption tool interfaces are verified at pickup.
- **Dependencies.** Workspace-shape work is beneficial to design and its applicable
  enforcement is blocking to qualification. No whole-CF or heap gate is imposed
  on unrelated extraction. Supported publication gates external consumption.
- **Record consumer.** Implementer/reviewer read the completion record to permit
  or refuse downstream reliance. The next capability author reuses closed contracts
  and valid evidence without a new team measurement apparatus.
- **Rules.** No quality/check exclusions or invented ratification. Preserve current
  small-PR, review and change-custody rules at implementation pickup. Changes to
  generated/shared configuration retain one editing authority.
