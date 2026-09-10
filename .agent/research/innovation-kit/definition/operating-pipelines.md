# Operating pipelines

- **Status:** proposed definition
- **Owns:** the temporal closure of product creation, operation, authority/release change and Kit
  evolution
- **Does not own:** one workflow engine, organisation chart, provider, implementation sequence or
  claim-specific decision

## A pipeline is closed only when responsibility returns

An arrow sequence is not an operating model unless it names authority, inputs, outputs, gates,
failure/recovery, evidence and the legitimate destination of learning. The Kit should make these
loops cheap and inspectable; it does not need to centralise them in one orchestrator.

The pipelines share identities and record interfaces from
[core records and interfaces](core-records-and-interfaces.md). That common grammar prevents
“working demo,” “successful write,” “valid projection,” “deployed release” and “reusable
capability” from becoming unrelated assertions.

## 1. Proposition to evidence and disposition

```text
consequential idea or question
→ audience, affected people, outcome and claim class
→ premise challenge and genuinely different alternatives
→ comparator, falsifier and evidence boundary
→ obligation profile and composition
→ real experience and applicable assurance
→ observation and competent interpretation
→ authorised disposition
→ learning returned to its legitimate layer
→ retain, elevate, reshape, stop or retire
```

| Closure field | Contract |
| --- | --- |
| Authority | Proposition owner frames; semantic/professional authorities govern meaning; method owner governs interpretation; disposition owner decides |
| Input | Bounded proposition, source evidence, unresolved assumptions and decision sought |
| Output | Retained evidence, explicit disposition and routed learning |
| Gates | Premise/alternative, claim boundary, applicability/profile, comparator/falsifier and claim-specific quality/evidence gates |
| Failure/recovery | Narrow, reshape, stop, defer or mark unresolved; missing evidence never becomes positive evidence |
| Evidence | Exact configuration and run, representative states, comparator result, negative/ambiguous findings, limitations and decision record |
| Return routes | Product proposition, curriculum/domain authority, method, Kit, Practice, provider or portfolio strategy as legitimately owned |

The loop is incomplete when the endpoint is “demo shipped,” “stakeholders impressed” or “tests
passed.” Those can be observations within a bounded claim.

## 2. Principal intent to observed outcome and repair

```text
principal intent
→ identity, authority and precondition decision
→ command/request identity and truthful acknowledgement
→ authoritative commit or explicit durable acceptance
→ projection and external effects
→ human-visible state and last asserted success stage
→ correlated observation and semantic health
→ authorised interpretation and response
→ retry, reconcile, repair, correct, escalate or remedy
→ re-observation and retained learning
```

| Closure field | Contract |
| --- | --- |
| Authority | Principal owns intent; semantic capability owner defines outcome; rights/policy authorities govern permission; runtime/service owner operates and responds |
| Input | Authorised intent, expected state/version, idempotency and correlation identity |
| Output | Truthful terminal outcome or explicit continuing/failed state, reconciled effects and retained operation evidence |
| Gates | Authentication/authorisation, validation, precondition, concurrency, atomicity or durable acceptance, downstream hand-off and semantic-health gates |
| Failure/recovery | Safe retry, cancellation, reconciliation, compensation/correction, quarantine, escalation or effective remedy; never acknowledge a staged effect as complete |
| Evidence | Audit/correlation trail, state/effect record, visible acknowledgement, telemetry/objective evidence, repair and re-observation |
| Return routes | Product/service, capability contract, adapter/binding, rights/policy authority and support learning |

This loop is where transactional persistence, queues, outbox, idempotency, observability and support
may become applicable. The proposition's effect semantics determine which mechanisms are needed.
Each consequential occurrence should remain traceable through the
[operation, outcome and repair interface](core-records-and-interfaces.md#6-operation-outcome-and-repair-record),
whether or not one system stores the whole record.

## 3. Authority to projection, activation and correction

```text
identified authoritative release or event
→ validate identity, scope, rights and applicability
→ deterministic or explicitly bounded transformation
→ isolated generation with provenance and loss record
→ structural, semantic, completeness and capacity evidence
→ atomic activation with consumer-visible release/freshness identity
→ observation under real queries or use
→ correction, withdrawal, deletion, rebuild or forward repair
→ safe retirement of prior generations and non-resurrection evidence
```

| Closure field | Contract |
| --- | --- |
| Authority | Source/domain authority owns meaning and correction; transformation owner owns declared mapping/loss; projection operator owns generation and activation |
| Input | Source identity/release, rights, transformation definition, profile and target binding |
| Output | Activated projection with visible release, completeness, freshness, loss and retirement state |
| Gates | Source identity/rights, deterministic equivalence where claimed, semantic/completeness checks, resource limits and atomic cutover |
| Failure/recovery | Hold last-good, quarantine, rebuild, withdraw, propagate correction, forward-repair or refuse activation |
| Evidence | Source/projection manifests, counts/digests, sampled semantics, loss/coverage, cutover observation, correction/rebuild drill |
| Return routes | Source authority, projection contract, adapter/provider, consuming products and evidence ledger |

Search indexes, graphs, vector stores, generated SDKs, exports and cached views are instances of
this loop. Their shared concern is not one storage API; it is honest derivation and correction.

## 4. Contract or schema change to compatible release

```text
authorised semantic or contract decision
→ immutable reviewed change and explicit compatibility intent
→ schema, migration and transformation definitions
→ blank construction plus representative old/new scenarios
→ semantic diff and generated projections
→ coexistence or expand/contract evidence
→ preview composition and conformance
→ promotion with release identity
→ post-activation semantic probes
→ restore, rollback where safe, or forward recovery
→ retirement of obsolete forms
```

| Closure field | Contract |
| --- | --- |
| Authority | Domain/contract authority owns meaning; data/projection owners own transition integrity; release/service owners own activation and recovery |
| Input | Reviewed change, compatibility class, existing states/consumers, migration and recovery constraints |
| Output | Compatible release, migrated state/projections, visible compatibility window and explicit rollback limit |
| Gates | Semantic diff, blank construction, deterministic scenarios, old/new coexistence, migration rehearsal, preview and conformance |
| Failure/recovery | Reject before promotion, maintain coexistence, restore when valid, forward-repair when rollback is unsafe, or retire the proposed change |
| Evidence | Generated diff, compatibility results, migration rehearsal, counts/invariants, post-release probes and recovery proof |
| Return routes | Domain contract, capability, adapters/bindings, consumer upgrade guidance and stewardship record |

A migration library can automate mechanics. It cannot decide semantic compatibility or whether
rollback would corrupt meaning.

## 5. Local burden to governed Kit capability

```text
concept-specific implementation, friction, incident or repeated burden
→ observation of the underlying need and difficult cases
→ purpose, authority, specificity and ownership test
→ candidate capability contract and alternatives
→ unlike use, independent composition or meaningful counter-instance
→ conformance, consumer-outcome and lifecycle evidence
→ admit, retain local, split, reject, deprecate or retire
→ version, support, migration and stewardship
→ continued observation of reach and divergence
```

| Closure field | Contract |
| --- | --- |
| Authority | Proposition owner owns local work; semantic-layer authority protects meaning; Kit steward judges composition/lifecycle placement; owner ratification applies where strategy changes |
| Input | Observed recurring burden/risk, worked mechanism, source contract, consumer friction and alternatives |
| Output | Governed Kit capability, deliberately local mechanism, split responsibility, rejection or retirement |
| Gates | Enduring need, legitimate authority, seam/invariant, context specificity, consumer experience, unlike-use/counter-instance, conformance and stewardship |
| Failure/recovery | Keep local, permit governed divergence, split, reverse placement, deprecate or retire; do not universalise by renaming |
| Evidence | Implemented use or independent proof, counter-instances, conformance, recurring/novel effort, divergence, maintenance and lifecycle ownership |
| Return routes | Kit definition/contract, source authority, product, Practice, design system, provider or retained local documentation |

The Kit should be deliberate, but its scope should remain corrigible. Reuse is evidence about reach,
not authority.

## Cross-pipeline invariants

Every pipeline must preserve:

- stable identity across intent, source, release, operation, evidence and disposition;
- one legitimate authority per semantic claim, with explicit delegation and hand-off;
- honest distinction between accepted, committed, reconciled, delivered and realised outcome;
- negative, ambiguous, failed-observation and unknown states;
- resumability, cancellation or a truthful terminal state;
- correction propagation and non-resurrection where claims or data are withdrawn;
- direct reachability from derived evidence to source and method;
- an explicit destination for learning and a future reopening condition; and
- an ending: retirement, preservation, disposal or continued stewardship.

## Pipeline quality test

A pipeline is useful when consumers can see who owes the next action, what state the world is in,
what can be safely retried, what evidence closes the claim and where learning returns. It is
ceremony when it adds stages without changing authority, failure handling, evidence or decisions.
