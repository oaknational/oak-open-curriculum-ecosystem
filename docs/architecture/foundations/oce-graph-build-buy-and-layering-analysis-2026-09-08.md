---
boundary: B2-Architecture
doc_role: record
authority: oce-graph-construction-and-composition-analysis
status: active
last_reviewed: 2026-09-09
---

# OCE graph capability: reference-informed construction and composition

8 September 2026 · revision 5 · design analysis under the owner-established development policy

Historical OCE inspection basis: `engraph` at `dcb4eb6d545e1011237d0ae4b181324693ad4635`

**OCE will author its graph and non-graph algorithms and data structures as SMALL Reliable Atoms and meaningful compositions, using the best openly licensed examples as inspiration. This analysis contributes an incidence-collection boundary hypothesis, pinned mechanism observations and a concrete keyword-selection journey. It does not select a universal first graph atom, package topology or qualified implementation.**

The [governing development policy](algorithms-and-data-structures-governance-2026-09-08.md) owns implementation origin, reference research and provenance. The [general architecture](reliable-atoms-and-composition-architecture-2026-09-08.md) owns atom smallness, composition and comprehensive assurance. The [graph architecture](comprehensive-graph-library-capability-architecture-2026-09-08.md) and [capability catalogue](graph-library-capability-contracts-2026-09-08.md) own graph requirements. This document supplies design evidence and candidate comparisons within those contracts.

## 1. Purpose and inspected plan estate

The goal is to reduce the cost of dependable, broadly useful OCE graph capability while preserving required semantics and long-term architectural quality. Smallness, precise definition and comprehensive testing, mutation testing and documentation remain fixed requirements. Current code supplies evidence and integration examples; it does not bound future capability.

The earlier investigation retrieved and searched 99 non-archive, non-template Markdown plan files and closely read the decision-bearing plans. Its refresh at the pinned OCE revision observed [PR 86](https://github.com/EngraphCode/open-curriculum-ecosystem/pull/86) ratifying the Reliable Atoms programme. Relative to the prior inspected commit `7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e`, that refresh found a plan-status change rather than changed graph source. These are dated observations, not a fresh repository survey in this revision.

| Inspected source                                                                                                                                                                                                                                                                                                                                                                                   | Enduring consequence for design                                                                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Reliable Atoms programme (the strategic plan node the owner ratified on 2026-09-08; its decision is recorded in [ADR-230](../architectural-decisions/230-own-built-algorithm-and-data-structure-foundations.md))                                                                                                                                                                                   | Small responsibilities, strict APIs, executable examples, type/misuse proofs, meaningful mutation tests, public consumption and declared dependencies. Performance claims need evidence. |
| [Foundations first](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/docs/architecture/foundations-first.md) and [building blocks frame](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/.agent/reports/typescript-estate-consolidation-review/foundational-building-blocks-frame.md) | Small dependable mechanisms compose into libraries and domain capabilities. Lower boundaries should remove repeated consumer reasoning.                                                  |
| Toolkit re-architecture plan (ADR-041 and ADR-154 govern package placement)                                                                                                                                                                                                                                                                                                                        | Responsibility, dependency and lifecycle evidence informs workspace placement. A past package inventory is not a fixed decomposition.                                                    |
| Extraction plan for the MCP server (its published decisions live in the architectural decision records)                                                                                                                                                                                                                                                                                            | Generic graph responsibilities and corpus/domain responsibilities require explicit owners. Integration sites need current liveness and dependency review during delivery.                |
| Earlier EEF projection, planning/intent, Innovation Kit and showcase plan inspection                                                                                                                                                                                                                                                                                                               | Provides domain and product journeys at different maturity levels without defining the whole graph envelope.                                                                             |

The owner's graph investment establishes the capability scope. Consumer journeys test semantics and sequence implementation; they do not reopen whether broad graph foundations are needed.

## 2. Decomposition method

The earlier [metacognition pass](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/dcb4eb6d545e1011237d0ae4b181324693ad4635/.agent/directives/metacognition.md) separated four axes: public API size, invariant responsibility, composition depth and package lifecycle. A small API can conceal a large mechanism. Several useful composition layers can live in one package. Equal-scope comparisons must preserve the same capability and assurance obligations.

The current rule is to identify the stable meaning and bounded assurance case, determine the coordination added by composition, then choose the authored mechanism and implementation location. A small algorithm can be an atom. A coherent collection with several maintained indexes can be a useful composition without becoming an atom merely because its facade is compact.

Reference surveys should challenge boundaries as well as explain algorithms. A conventional solution is acceptable when it best satisfies the contract. The governing policy does not require mechanism novelty or divergence from good examples. Research and conceptual review do not qualify the resulting code.

## 3. An incidence-collection boundary hypothesis

| Candidate boundary                            | Law or responsibility                                                                                   | Question for comparison                                                                                                      |
| --------------------------------------------- | ------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| Checked endpoint/occurrence value             | Exact admitted fields, identity roles and ownership.                                                    | Does a separately useful validation or encoding responsibility justify an atom, or is this a record within another contract? |
| One keyed association mechanism               | Exact membership and lookup under one equality domain.                                                  | Which laws are independently useful and small enough to qualify once?                                                        |
| Incidence multirelation with coherent indexes | Preserve identified occurrences and expose exact ordered projections by incidence, relation and member. | Which smaller mechanisms does it compose, and where is cross-index agreement owned?                                          |
| Direct directed graph index                   | Vertex/edge domains, source/target closure and exact incoming/outgoing access.                          | Does its specialised representation simplify the intended binary journeys enough to justify a different composition?         |
| Rich model and operation suite                | Legal model values, traversal, transformation and algorithms.                                           | How do its distinct contracts decompose while retaining a usable public capability?                                          |

The incidence multirelation is a candidate **structural composition** under the current graph architecture. Its contained mechanisms still require qualification against the common smallness rules. It is neither a universal physical representation nor a fixed first graph atom. The following contract sketch makes its potential value and costs reviewable.

### Proposed occurrence contract

Each occurrence contains distinct typed identities:

```typescript
{
  (incidenceId, relationId, memberId);
}
```

The sketch uses exact string equality, without normalisation. Different incidence IDs may have identical relation/member endpoints; both occurrences remain present. Empty input is valid. Relation and member identities can repeat. Empty strings are admitted in this illustrative identity profile; a different external identifier scheme must establish its own validation. Brands distinguish roles in typed code, not scope or instance identity automatically.

The central law is:

> A lookup returns exactly the owned occurrences whose selected identity matches, preserving occurrence identity, multiplicity and input order.

| Proposed operation                            | Observable outcome                                                                                                    |
| --------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Construct from an ordered occurrence sequence | Complete immutable collection, or a duplicate-incidence failure identifying the first repeated ID and input position. |
| Enumerate                                     | Every owned occurrence in input order.                                                                                |
| Find by incidence ID                          | Exact occurrence, or explicit normal absence.                                                                         |
| Find by relation ID                           | Matching occurrences in input order; empty when none.                                                                 |
| Find by member ID                             | Matching occurrences in input order; empty when none.                                                                 |

Construction owns captured primitive identity fields and published collection values; mutable maps and arrays remain private. Later caller mutation and mutation attempts through outputs must not change subsequent observations. Readonly types alone do not establish that property. The eventual concrete specification must close its exact API, dynamic-input boundary, capacity and allocation assumptions, outcomes and public consumption. The sketch does not invent a second Result type or require absence to be treated as an error.

The collection has no vertex or edge universe. An isolated vertex and a nonexistent member both have no incidence rows. The graph model owns their distinction. Direction, arity, roles, weights, domain payloads, editing, provenance and model constraints remain separate responsibilities.

Cross-index consistency is supplied once by the collection owner. Consumers do not maintain the indexes separately or repair them. Qualification must demonstrate whether this composition removes repeated reasoning without imposing excessive joins and identities on simpler uses.

### Three model witnesses

These are design witnesses, not executed tests.

| Model                             | Incidence rows                                     | Additional model guarantee                                                                                                         |
| --------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Two parallel directed edges A→B   | `i1=(e1,A)`, `i2=(e1,B)`, `i3=(e2,A)`, `i4=(e2,B)` | Explicit source/target roles; one source and target per edge; membership in declared domains. Looking up A retains both e1 and e2. |
| Undirected loop at A              | `i5=(loop,A)`, `i6=(loop,A)`                       | Two endpoint occurrences refer to one vertex. The model defines their degree interpretation.                                       |
| Role-bearing hyperedge on A, B, C | `i7=(h,A)`, `i8=(h,B)`, `i9=(h,C)`                 | The model defines roles, arity, repetition and semantic order. Incidence alone supplies no conjunctive traversal semantics.        |

An isolated Z belongs to a separately owned vertex domain. An empty relation, if allowed by a model, similarly needs an explicit relation domain. A model constructor validates domains, roles and model laws before publication; algorithms and SDKs should not repeat that work. Stronger constraints are established by compositions above the checkers they consume, as in the [constrained-update example](graph-library-worked-examples-2026-09-08.md#gex01--a-constrained-graph-update).

For E binary edges this representation carries 2E endpoint occurrences plus role information. A direct directed index can store E source/target records. The incidence design therefore has a real storage/join cost. A direct representation can also encode richer models through explicit mappings; incidence is not uniquely expressive. Compare the actual journeys and costs rather than choosing on generality alone.

### Mechanism and assurance questions

Native maps and arrays provide a straightforward candidate mechanism for an authored finite collection. The earlier analysis used the [ECMAScript Map contract](https://tc39.es/ecma262/multipage/keyed-collections.html#sec-map-objects) as its runtime assumption: average sublinear access is not a universal constant-time guarantee. Persistent-collection examples, including [Immutable Map](https://immutable-js.com/docs/v5/Map/), can inform retained-update design and structural-sharing trade-offs; they do not supply the selected production implementation or graph/ownership semantics.

Required evidence includes:

- Each grouped lookup equals a simple ordered filter over the owned occurrence list.
- Every occurrence appears once in each relevant index, with no missing or extraneous entry.
- Repeated endpoints, duplicate-ID rejection, empty and absent groups preserve their distinct meanings.
- Input/output alias attempts cannot change later observations.
- Positive/negative type cases and public consumption establish the actual admitted API.
- Mutation/fault evidence detects wrong keys, omitted/duplicated occurrences, order changes, accepted duplicate IDs and alias leakage.
- Declared growth, retained memory and construction/update costs have corresponding evidence.

The common architecture owns the full assurance bar, including composition mutation scope. Bounded exhaustive traces, generated properties and regressions discriminate different fault classes; coverage alone is not a proof of correctness.

## 4. The stable priority queue

The [queue specification](oce-queue-reliable-atom-2026-09-08.md) owns its exact public API, numerical domain, bounds, state transitions and qualification criteria. The working contract uses captured finite primitive numerical priorities in ascending order, with FIFO among numerically equal priorities, explicit presence/absence and unchanged state after supported rejection. Payloads remain opaque shared values. It exposes no caller comparator.

Implementation origin is settled by the governing policy: author the queue against that contract, informed by openly licensed reference knowledge. The binary heap is a candidate mechanism. Its chosen source of inspiration does not alter queue semantics, bring in unrelated selection APIs or establish implementation qualification.

Scoring, cancellation, scheduling, mutable priorities, arbitrary removal and top-k selection belong to separately specified responsibilities. The [general worked examples](reliable-atoms-worked-examples-2026-09-08.md) distinguish priority order, FIFO ties, captured values, lifetime exhaustion and scoring failure before mutation. Domain comparisons that do not fit finite scalar priorities require their own justified mechanism or a deliberate contract decision; they cannot be hidden inside this queue.

## 5. Pinned reference observations

### Heap-js mechanism study

The earlier bounded study inspected **heap-js 2.7.1**, commit `41206f64eea8c771fb58c93b3c151e6ba627619b`: [manifest](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/package.json), [BSD-3-Clause licence](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/LICENSE), [Heap.ts](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/src/Heap.ts), [public-method tests](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/tests/heap/heap-public-methods.test.ts) and [sift tests](https://github.com/ignlg/heap-js/blob/41206f64eea8c771fb58c93b3c151e6ba627619b/tests/heap/heap-private-methods.test.ts). These are dated source observations, not a refreshed maintenance or legal assessment.

| Observed mechanism                              | Knowledge relevant to our contract                                                                     |
| ----------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| Private array and comparator                    | State ownership and order must be explicit; our numerical ordering policy avoids arbitrary callbacks.  |
| Append, sift-up, parent-index calculation       | Heap restoration has a small dependency closure; parent arithmetic must satisfy our full index domain. |
| Root and array length                           | Peek and size need no public representation access.                                                    |
| Last-entry removal, root replacement, sift-down | Empty/singleton transitions and removed-reference release need distinct evidence.                      |

The inspected closure needed no imported runtime helper; a whole-file async re-export was outside those operations. Aliases, iteration, arbitrary removal, batching, top/bottom selection and size-limit policy supplied additional upstream responsibilities. Their absence from our queue is explained by our contract rather than by a source-pruning task.

The source study exposed useful counterexample targets: signed-32-bit index narrowing; receiver-dependent callables; empty sentinels conflated with payload `undefined`; an insertion hook with separate limit semantics; and comparator failure after in-place mutation. Our contract addresses each responsibility explicitly. Upstream tests contain useful cases, but their setup uses extra APIs and shares implementation lineage. Author our tests from the declared laws and independently understandable list model; record any actual test-material use honestly under the governing provenance policy.

No source extraction was executed. The study reduces mechanism uncertainty and supplies fault hypotheses. It does not establish that a resulting authored implementation is correct, legally cleared as a whole, or cheaper to maintain.

### Higher graph-operation references

The earlier research examined [Effect Graph at `effect@4.0.0-rc.112`](https://github.com/Effect-TS/effect/blob/effect@4.0.0-rc.112/packages/effect/src/Graph.ts) as a broad representation and algorithm example. The research recorded numeric handles, shared payload objects, topology-copying costs and a Bellman–Ford Infinity-barrier defect. Its finite nonnegative Dijkstra evidence did not qualify all weighted-path behaviour. These claims remain tied to that examined profile and the original probe record; they have not been rerun for this revision.

The useful questions are how representation and algorithm premises interact, where repeated conversion is paid, what updates retain, and which exceptional numerical cases alter answers. A shared computational representation may amortise setup across several operations, while per-query reconstruction can dominate an otherwise efficient algorithm. Our own compositions must account for those costs and preserve identity/witness mappings. No engine-selection decision follows from this dated comparison.

## 6. Compare designs at equal responsibility and assurance

| Required capability                      | Authored alternatives worth comparing                                                                        | Evidence needed                                                                                                         |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Identified incidence with ordered lookup | Small association mechanisms composed into coherent indexes; direct ordered filtering for a bounded profile. | Exact projection laws, ownership and construction/query/retention costs.                                                |
| Binary models and graph algorithms       | Specialised endpoint representation; incidence access; different narrow operation interfaces.                | Same public results and witnesses, explicit conversions, model constraints and full algorithm premises.                 |
| Frequent edits with retained versions    | Authored copying, persistent structures, incremental indexes or deliberate rebuilds.                         | Coherence, historical meaning, memory retention and incremental-versus-cold equivalence.                                |
| Broad graph capabilities                 | Native model structures and operation-specific computational views.                                          | Coverage of required models/operations; explicit loss, representation mappings and operation-specific result transport. |

Research, specification, implementation, assurance, documentation, integration, diagnosis and maintenance all contribute to effort. Fewer source lines or runtime dependencies alone do not establish a saving. AI-assisted research, authoring and fault generation may reduce mechanical work, but their savings remain unmeasured here.

An owned library permits coherent choices about equality, numerical policies, output witnesses and evolution. Those benefits coexist with responsibility for every supported mechanism. Existing implementations teach us about mechanisms and contracts at atom and composition scales; our implementation and its qualification remain our responsibility.

## 7. Composition responsibilities and possible integration sites

| Responsibility                       | Dependencies                                                                        | Added guarantee                                                          |
| ------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| Small value/association mechanism    | Declared language/runtime and canonical facilities.                                 | Exact local identity, membership, arithmetic or ownership laws.          |
| Incidence/registry composition       | Relevant mechanisms and one state owner.                                            | Coherent occurrence domains and indexed projections.                     |
| Graph model                          | Relevant structures and explicit domains/roles.                                     | Legal directed, undirected or richer structure under its profile.        |
| Structural operation                 | Only the access and algebraic capabilities it needs; queue where its semantics fit. | Correct result/witness and explicit failure/completion scope.            |
| View or interoperability composition | Source/target profile contracts and mappings.                                       | Declared fidelity, loss, identity translation and lifecycle.             |
| Domain composition                   | Relevant models, operations and evidence.                                           | Curriculum/planning meaning, source scope and public response semantics. |

These are responsibility relationships, not a uniform pipeline or prescribed package set. A structural algorithm need not own arbitrary domain payloads. The owner of observed attributes establishes their coherence over the operation's lifetime.

The inspected graph-core/graph-project and corpus SDK are possible integration sites. Current dependency, liveness and release evidence must determine their eventual arrangement. Several internal layers can live in a generic graph workspace, and a domain SDK can compose them, but neither two composition homes nor existing package names are binding. Empty forwarding packages and forced conversions add no value.

## 8. A concrete keyword-selection journey

The pinned [graph-view constructor](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/packages/core/graph-core/src/graph-view/create-graph-view.ts) combines indexes, bad-incidence rejection, bounded BFS and induced selection. [Graph-project adjacency](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/packages/libs/graph-project/src/adjacency/index.ts) and corpus [projection helpers](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/packages/sdks/graph-corpus-sdk/src/curriculum/projection-helpers.ts) supply further examples of related mechanisms with different domain/ordering obligations. At that inspection, corpus indexes built once at module load. Consolidation could reduce maintenance without demonstrating a per-query build saving.

The [keyword view](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/packages/sdks/graph-corpus-sdk/src/curriculum/keyword-view.ts) provides a specific semantic comparison target. Incidence establishes scoped candidates and counts; selection owns ordering/admission/cutoff behaviour; the SDK owns scoring meaning and response semantics.

The pinned behaviour includes limit validation before anchors; every active scope intersection; empty versus unknown-only anchors; first-appearance deduplication; scoped count descending then the existing keyword-ID comparator; exact totals/hasMore; limits 25 default and 100 maximum; and ID-sorted lesson decorations capped at 10 with exact counts. These are observations of that domain contract, not universal graph-library rules. A deliberate domain contract change requires its own decision.

The [extractor](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/packages/sdks/oak-sdk-codegen/src/bulk/extractors/keyword-extractor.ts) retained unique lesson slugs, and the [builder](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/packages/sdks/oak-sdk-codegen/src/bulk/generators/graph-corpus-keyword-nodes.ts) emitted one pair per retained lesson. Domain composition therefore preserves unique placements while the generic incidence collection preserves every identified occurrence.

### The queue is not a substitute for the full selection contract

Suppose candidates arrive as `(z, count=5)` then `(a, count=5)`, with the domain comparator placing `a` before `z`. Enqueueing both at numerical priority `-5` returns `z` first through FIFO ties. That is correct queue behaviour and incorrect keyword order. The numeric queue cannot accept the domain comparator, and an arbitrary lexical tuple cannot be compressed into a number without an ordering-preservation proof.

One composition could first order candidates by the full secondary comparator, then exploit stable numerical priorities for count order. It must prove cutoff retention and include that preparatory sorting cost. That construction does not establish the hoped-for bounded-selection saving. Another separately specified authored selection mechanism can directly support the full required order. The reference full sort remains a simple semantic oracle and may be the appropriate implementation for small candidate sets.

Complete scoped counts are required before exact top-k; a bounded heap cannot stop scanning early while promising exact totals. For K completed candidates and bound k, a suitable comparison-based selection design can have `O(K log k)` selection work plus `O(k log k)` result ordering, assuming constant-cost comparisons. Count accumulation and its memory remain additional; lexical-comparison and preparation costs must be included. No latency improvement is claimed.

Compare complete outputs against the [pinned integration reference](https://github.com/EngraphCode/open-curriculum-ecosystem/blob/7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e/packages/sdks/graph-corpus-sdk/src/curriculum/keyword-view.integration.test.ts). Sortedness alone misses anchor validation, totals, decoration, deduplication and cutoff semantics. If the full comparator also returns equality, preserve the defined encounter order rather than relying on an incidental data structure.

## 9. Capability preservation and continuation

| Concern                                             | Preservation obligation                                                                                                                       |
| --------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| Direction, multiplicity, loops and repeated members | Occurrences remain distinct; each model defines roles, arity, degree and traversal.                                                           |
| RDF and evidence                                    | Computational structures preserve the required term, graph/context, assertion, lexical and occurrence distinctions through explicit mappings. |
| Implicit or large graphs                            | Algorithms request suitable narrow access and declare termination/resource premises; one materialised representation is not mandatory.        |
| Editing and history                                 | Choose copying, mutation, persistence or rebuilding under an explicit lifecycle and publication contract.                                     |
| Other domains                                       | A typed planning-dependency journey tests generalisation; curriculum vocabulary stays outside reusable foundations.                           |

The first relevant implementation increment should compare the incidence composition with a direct binary representation on the same public journey, including role/storage overhead and consumer obligations. Qualify the selected small constituents and the composition's added laws. The incidence boundary should change if callers must reconstruct roles, closure or index agreement, or if its costs dominate without useful shared semantics. It is not necessary for every graph capability to pass through it.

Qualify the queue at its own contract, then choose a selection composition only if that contract meets the full selection premises. Use each opened design uncertainty to bound reference research. Review the first consumed-form implementation, complete domain journey and later meaningful change for semantic preservation, repeated conversion, retained state, leakage of private invariants and architecture cost. Jim owns policy changes; delivery assigns implementation and review ownership.

## 10. Evidence and operating boundary

This revision reconciles design recommendations with the owner-established authorship policy and the current architecture/example bundle. It reports no new implementation, compiler execution, behavioural probe, benchmark, mutation campaign or packed-package test. The incidence and keyword constructions are analytical expectations.

The earlier intake verified 75 outer hashes, 69 research hashes and 70 inner-archive files. The source research recorded six entrypoints and 49 expected outcomes, including deliberate defect reproductions; those executions were not rerun here. Research, handoff and reference are one evidence lineage.

Earlier inquiry used OCE metacognition, reason, proportionality and Parallax decision/audit guidance. Two agents challenged granularity and equal-scope economics; a later bounded study traced the heap-js source closure. Those were correlated conceptual/source reviews, not independent empirical assurance. The original estate grounding recorded 74 core rules, six situational rules and foundational/reviewer surfaces in a 91-file receipt. Those receipts describe the historical investigation; native repository-session conformance is not claimed by this document revision.

Historical source identities: OCE refresh `dcb4eb6d545e1011237d0ae4b181324693ad4635`; code inspection `7081ee9c043606bf89f5c4bdc2c6abafc6efdc6e`; transfer SHA-256 `2b4caf504886f37de18fd1d639639c191ef68cedd12c61bdf4fd90e335ea3a3a`; research decision report revision 3 SHA-256 `83a78c07f0c8cb00a7351d6ccc07fd91b1861aa07bad6b0af585748da7b6d1a1`; attached handoff and TypeScript Graphs reference v1.4. The August records inform identity, fidelity, lifecycle and revision obligations as dated research.

Inquiry `oce-graph-atoms-composition-2026-09-08`, revision 7. The current decision basis is owner-established capability and authorship, atomic assurance and total development/change cost. This document conserves source observations while keeping present decisions in their governing homes. The [bundle source review](foundations-source-review-2026-09-08.md) provides the wider evidence and disposition map.
