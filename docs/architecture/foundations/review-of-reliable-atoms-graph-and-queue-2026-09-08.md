---
boundary: B2-Architecture
doc_role: record
authority: reliable-atoms-graph-and-queue-review-record
status: active
last_reviewed: 2026-09-09
---

# Review of Reliable Atoms, graph architecture and queue specification

8 September 2026 · review record revision 2 · initial findings and current design dispositions

## 1. Assessment and current authority

The three original documents established a coherent working architecture: small mechanisms, meaningful compositions, model-specific semantics and assurance at the boundaries introducing guarantees. The initial review identified five concrete design seams. The current architecture and worked examples now resolve those seams at the design level, with implementation qualification still outstanding.

The [governing development policy](algorithms-and-data-structures-governance-2026-09-08.md) records Jim's current decision: author our graph and non-graph algorithms and data structures as SMALL Reliable Atoms and compositions, informed by the best openly licensed references. It owns implementation origin and research/provenance policy. The [general architecture](reliable-atoms-and-composition-architecture-2026-09-08.md) owns common requirements; the [graph architecture](comprehensive-graph-library-capability-architecture-2026-09-08.md) owns their graph application; the [queue specification](oce-queue-reliable-atom-2026-09-08.md) owns its exact public contract.

This review records the reasoning and disposition of its original findings. It does not redefine those contracts, impose a fixed implementation sequence or qualify any implementation. Subsequent source review and draft repository integration have their own evidence in the [bundle index](foundations-bundle-index-2026-09-08.md) and [source review](foundations-source-review-2026-09-08.md).

## 2. Original scope and evidence

The initial review read exactly these three supplied snapshots. The ten older project documents and other Library material were outside that initial review.

| Reference | Document                                                                                | Original supplied status                                         | Role                                                                     |
| --------- | --------------------------------------------------------------------------------------- | ---------------------------------------------------------------- | ------------------------------------------------------------------------ |
| R         | [General architecture](reliable-atoms-and-composition-architecture-2026-09-08.md)       | Working definition 1.0; 206 lines.                               | Definitions, common quality requirements, composition and qualification. |
| G         | [Graph architecture](comprehensive-graph-library-capability-architecture-2026-09-08.md) | Working definition 1.0; inquiry revision 3; 281 lines.           | Models, capabilities, identity, views, execution and delivery.           |
| Q         | [Queue specification](oce-queue-reliable-atom-2026-09-08.md)                            | Revision 1; proposed design/acceptance specification; 206 lines. | A stable priority queue candidate and its original design questions.     |

Initial findings were document observations and architectural deductions. No implementation, test, mutation campaign, benchmark, live repository audit or external-source revalidation ran in that review. Package maintenance, licensing and standards-status claims were not refreshed.

G delegated capability coverage and support-entry schema to the [capability catalogue](graph-library-capability-contracts-2026-09-08.md), and inquiry/delivery history to the [delivery record](graph-library-review-and-delivery-2026-09-08.md). Neither companion was among the three original attachments, so the initial review did not assess their completeness. Their later inclusion in the coordinated bundle does not retroactively enlarge the initial evidence scope.

The current disposition pass read the revised common/graph/queue documents and both worked-example documents. It checked how those texts address the original findings, under the new governing policy. The observations below distinguish design closure from evidence still required on production code.

## 3. Findings and current dispositions

### 3.1 Constrained-model validation and dependency direction

**Initial finding.** G placed constrained graph values/builders at L2, publication at L3, and graph algorithms/validation at L4, while dependencies pointed toward lower capabilities. An L2 DAG constructor calling an L4 cycle operation would invert that direction. The architecture permitted sound solutions but had not worked through one.

The proposed discriminating journey was an edit that closes a directed cycle: it must return an edge-bearing cycle witness and leave the published graph/indexes unchanged. An accepted edit must publish the exact state described by its validation evidence.

**Current design.** R §3 and G §§3/3.3 distinguish lawful base models from stronger validated refinements. A checker accepts an unrefined lawful candidate with sufficient read/coverage premises. A composition above the checker and publication capability owns acyclicity and exclusive write access. It issues evidence bound to the exact candidate and publishes only through the declared revision protocol. The checker does not require the DAG witness it is meant to establish.

[Graph example GEX01](graph-library-worked-examples-2026-09-08.md#gex01--a-constrained-graph-update) supplies cycle rejection, accepted publication and stale-revision conflict. It explicitly separates candidate identity from committed revision and prevents an unconstrained write alias from bypassing the invariant owner. The placement of a narrower checker remains a justified boundary decision, not a requirement to put all graph algorithms into L0.

**Qualification still required.** Cycle/self-loop/parallel-edge oracles, source-edge witness checking, incomplete-access refusal, forged/stale evidence misuse, publication races and failure-state observations. Reversing every edge preserves cycle existence, so a boolean-only test cannot detect that error; the witness must be checked against actual edge directions.

### 3.2 Failure translation and retained-state validity

**Initial finding.** Original Q admitted a lawful nonthrowing comparator premise, R rejected unproved callback recovery, and G required extension exceptions to become declared outcomes. Those statements were compatible, but an implementation could mistakenly treat catching and translating a throw as proof that a partially mutated structure remained usable.

The motivating counterexample was a comparator throwing after an in-place heap insertion had started changing state. A returned error alone would not establish a normal rejected insertion. This was a design warning, not an observed implementation defect.

**Current design.** R C04–C05 and its failure-validity contract distinguish unchanged valid state, explicit invalidation and indeterminate effects. G §3.4 applies that rule to extensions: establish premises, contain/discard unpublished work, prove restoration, or enforce invalidation before ordinary reuse. External effects outside the boundary are not implicitly rolled back.

The current queue owns finite numerical ordering and invokes no caller comparator. [General example §5](reliable-atoms-worked-examples-2026-09-08.md#5-a-separate-scoring-composition-owns-callback-failure) places fallible scoring in a separate composition before queue mutation. It preserves returned/thrown causes and states the scorer's termination, nonreentrancy and result-shape premises. Its unchanged-state promise concerns the privately owned queue, not arbitrary scorer side effects.

**Qualification still required.** Faults must distinguish rejection from partial mutation, dropped cause, duplicate admission and invalid-state reuse. Other fallible graph extensions still need their own supported failure/state contracts; removing the queue callback does not qualify them.

### 3.3 Immutable data, current access policy and custody

**Initial finding.** G promised meaningful retained snapshots and current disclosure policy under declared history rules. Those can coexist, but a managed read handle and an already disclosed payload copy have different revocation capabilities. The initial text needed to identify data revision, policy revision, retained-object kind, in-flight reads and the actual custody boundary.

**Current design.** R C05 and G §6 explicitly separate immutable data from permission to disclose it. Managed reads, caches, witnesses, diagnostics, iterator items and terminal outcomes pass through the relevant release boundary. The profile declares authorisation/disclosure ordering, including policy changes before a release. Values already outside that custody cannot be made unread by changing a policy record.

[Graph example GEX03](graph-library-worked-examples-2026-09-08.md#gex03--immutable-data-current-policy-and-custody) works the data/policy distinction through revocation, cached routes, in-flight iteration and terminal summaries. It also distinguishes a complete negative in an authorised view from a claim about the full source, without exposing hidden existence through diagnostics or counts.

**Qualification still required.** Race and release-boundary tests, cache/iterator/terminal disclosure probes, mixed-policy result checks, authorised-unavailable outcomes and explicit enforcement/custodian assumptions. A network transport requires its own precise release and in-flight delivery contract. Pure local snapshots do not need an invented ambient policy service.

### 3.4 FIFO and stable priority are different contracts

**Initial finding.** G's original “Queue” candidate described FIFO globally; Q described priority ordering with FIFO only among equal priorities; R explicitly named a stable priority queue. The generic name invited accidental substitution even though two different atoms could legitimately exist.

**Current design.** G §3.1 names separate FIFO and stable-priority candidates and links the latter to Q. Q specifies ascending numerical priority and arrival order within equal priorities. [General example §1](reliable-atoms-worked-examples-2026-09-08.md#1-priority-and-arrival-answer-different-questions) shows why an earlier A at priority 2 follows a later B at priority 1, while A remains ahead of later occurrences at priority 2.

**Qualification still required.** Mixed-priority, equal-priority and interleaved occurrence traces over the consumed implementation. Queue stability does not establish scheduler lifecycle or a top-k composition's admission/cutoff policy. No mode switch is needed to conceal the distinction.

### 3.5 Captured priority, exact API and numerical bounds

**Initial finding.** Original Q required captured ordering information but left its key domain and comparison open. Copying an object does not preserve a comparator that distinguishes reference identity, and `Readonly<K>` does not create ownership. The key representation, public API, ordinal arithmetic, storage bounds and supported runtime failures needed concrete closure.

**Current design.** Q §§1–4 chooses finite primitive numerical priorities captured by value. It defines invalid inputs without coercion, the equality of signed zero for ordering, relational rather than subtractive comparison, opaque shared payloads and bound instance callables. It distinguishes normal empty/present outcomes from typed construction/enqueue errors and uses the canonical estate Result type.

Capacity is explicit and bounded; arrival ordinals have exact allocation, exhaustion and drain-reset semantics; input-failure precedence is defined before mutation. The runtime profile distinguishes supported admission rejection from allocation/process failure. [General examples §§2–4](reliable-atoms-worked-examples-2026-09-08.md#2-captured-priority-shared-payload-and-explicit-presence) expose caller mutation, valid undefined payloads, rejection precedence and lifetime exhaustion. The reduced ordinal model is labelled as a specification device and cannot substitute for evidence about the actual production constant/guard.

**Qualification still required.** Public API/type consumption, complete numeric/ownership/misuse traces, actual arithmetic-bound evidence, every meaningful fault class and declared performance/retention evidence. A use requiring a different equality/order or precision domain can reopen the working queue contract; the current API does not silently admit generic comparators.

## 4. Current readiness and implementation origin

| Concern                       | Current disposition                                                                                                                       | Evidence still required                                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Common and graph architecture | Working requirements with explicit invariant/layer ownership.                                                                             | Qualified mechanisms and complete capability journeys under exact profiles.                                           |
| Queue semantic contract       | Finite numerical priority, API, outcomes, capacity, ordinals and runtime assumptions are closed for the working baseline.                 | Conformance of an actual implementation, public type/consumption evidence and runtime/mutation qualification.         |
| Implementation origin         | Owner-selected authored algorithms/data structures informed by openly licensed references.                                                | Honest reference/provenance records for each implementation; research does not transfer source quality automatically. |
| Composition examples          | Concrete expected traces for validation/publication, failure handling, custody, assertion identity and non-graph arithmetic/window state. | Executed examples and broader fault/contract evidence on their actual compositions.                                   |
| Comprehensive graph coverage  | Owned by the capability catalogue and support register.                                                                                   | Coverage of every required minimum; one successful binary or RDF journey does not qualify the whole library.          |

The original review considered implementation-origin alternatives as an open question. The current policy settles that decision separately from public semantics and qualification. Research now helps choose the authored mechanism, contract, representation and composition; it does not keep package adoption or selective source adaptation active as the production baseline.

## 5. Architectural strengths preserved

**Granularity is assessed at both scales.** R §5 and G §3.2 consider internal and ensemble reasoning/change cost together. They distinguish repeated syntax from repeated knowledge, permit intermediate compositions and treat “entropy” as a useful working concept rather than a calibrated scalar with guaranteed convergence.

**Compositions add obligations.** Qualified constituents do not automatically qualify coordination, model validity, coherent publication, algorithm results or domain conclusions. A small facade cannot make a large store/engine an atom. Each boundary must justify what reasoning it owns and removes from consumers.

**Graph meaning survives representation choices.** Narrow capabilities, native models and explicit transformations preserve required identities, content, assertions, occurrences and lifecycle distinctions. Reconstructability alone does not justify transporting an algorithm's answer. [GEX02 and GEX04](graph-library-worked-examples-2026-09-08.md) expose assertion-target collapse, raw representation-hop distance and misleading binary reachability for conjunctive hyperarcs.

**Assurance remains comprehensive.** The common architecture requires independent semantic models where useful, bounded exhaustive/generated traces, type/misuse checks, consumed-form evidence, full runtime mutation scope and justified dispositions. It rejects score gaming and distinguishes fault discrimination from proof that a specification contains every necessary requirement. References and AI assistance do not alter that bar.

**Non-graph composition has a concrete witness.** The exact count-window example separates checked arithmetic from membership/expiry/publication. It tests final-window admission after proposed expiry, and unchanged membership/total after a rejected update. Correct arithmetic alone cannot establish the composition's state law or a domain claim about measured values.

## 6. Continuing from the review

Implementation planning should select a small coherent journey from the required capability envelope, close any remaining local contract choices and qualify each owned responsibility. Keep common facts in their authoritative documents and turn relevant worked cases into executed public examples. Reference research should target uncertainties that could change the design and retain independent counterexamples and cost assumptions.

The review's five initial seams are resolved as design definitions and worked expectations. A failing implementation observation, an unsupported execution premise, a bypassable invariant owner or a changed contract reopens the affected qualification. The next evidence is concrete implementation and composition assurance, not a declaration that the entire architecture has been proven.

## 7. Review provenance

The initial primary reviewer reconciled two parallel conceptual reviews: queue/general contracts and graph architecture across the same three attachments. Their sources were shared; agent count did not provide independent empirical corroboration. Earlier work on project-background material was stopped and did not support that initial assessment. Source attachments were not edited during the initial review.

Original attachment SHA-256 fingerprints:

| Reference | SHA-256                                                            |
| --------- | ------------------------------------------------------------------ |
| R         | `e8e90701125efe66662fa99e4cffcb46825b4db773b34023ad7b2c7e90edd37d` |
| G         | `0abf336ced644625efd367a44dbeb258b7725779cca2f2beeecb12030e367d28` |
| Q         | `2fccd66cb6745e987ea5cc9bfe9372e1b1ee472f36a24b1735e489f64d1ee2ba` |

This revision preserves those original observations and records their current dispositions from the coordinated document bundle and owner decision. It reports no new implementation execution, benchmark, standards verification or qualification campaign. The wider historical/current-source review is separately recorded in the bundle source review rather than attributed to the initial three-document assessment.
