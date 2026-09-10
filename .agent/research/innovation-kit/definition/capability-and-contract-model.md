# Capability and contract model

- **Status:** proposed definition
- **Owns:** capability semantics, obligation families, contract dimensions, explicit absence and
  the semantic/adapter/binding boundary
- **Does not own:** current implementation status, package layout, provider selection, profile
  applicability or product-specific domain meaning

## Capability means a product promise

A Kit capability is not a technology noun, package, service or entry in a catalogue. It is a
stable, consumer-facing promise about meaningful operations, guarantees, failure, recovery and
authority hand-offs.

For example, “PostgreSQL” is a mechanism family. A product may need authoritative transactional
state with named identity, concurrency, migration, backup, restore and retention semantics.
PostgreSQL and a managed provider may be excellent adapters and bindings for that capability; they
do not define its domain meaning. Likewise, “vector store” does not define retrieval relevance,
source authority, projection loss, correction or evaluation.

The Kit can own a capability contract, composition path, adapter lifecycle or assurance harness.
It must not absorb the source semantics merely because it makes their implementation convenient.

## Complete capability contract envelope

Every capability considered for Kit use must answer each applicable dimension. “Not applicable”
requires a reason and, where the decision depends on specialist competence, the relevant authority.

| Dimension | Required contract question |
| --- | --- |
| **Outcome and affected people** | Who needs the capability, what progress does it enable, what claim is made, and who may be affected or excluded? |
| **Meaning and authority** | What referents, identities, claims and invariants does it preserve; who may define, act, challenge, correct and retire them? |
| **Operations and effects** | Which intents and operations exist; what preconditions, side effects, acknowledgements, idempotency and terminal states apply? |
| **State and time** | What is authoritative or derived; which clocks, ordering, concurrency, consistency, freshness and finality rules apply? |
| **Projection and loss** | What source, transformation, release and completeness identity exists; which meaning is preserved, adapted, omitted or refused? |
| **Experience truth** | What can a person do and reasonably believe; what language, accessibility, denial, progress, degradation and continuation states apply? |
| **Trust, rights and policy** | Which authentication, authorisation, privacy, consent, safeguarding, security, rights and remedy obligations apply, and who owns them? |
| **Failure, recovery and correction** | How are absence, invalidity, staleness, duplication, partial success, interruption and corruption represented, repaired and re-observed? |
| **Evidence and assurance** | What proves contract conformance and claim-specific outcome; what cannot be established; what telemetry, scenarios and human review are required? |
| **Configuration and composition** | Which choices are semantic, which are operational, which combinations are valid, and how are defaults, overrides and secret boundaries explained? |
| **Evolution and compatibility** | What constitutes compatible change; how do schema, data, projection, API and consumer migrations work; where is the rollback limit? |
| **Portability and exit** | Which adapters and bindings are supported; how are export, restore, rebuild, replacement and provider exit exercised without semantic loss? |
| **Stewardship and ending** | Who supports, versions, deprecates, preserves and retires the capability; what retention, custody, disposal and maintenance obligations remain? |

The envelope is a semantic completeness test, not a demand for one universal metadata object or
thirteen software interfaces. Individual capabilities should expose the smallest coherent contract
that makes their applicable answers legible and testable.

## Seven obligation families

These families help find omissions across a whole product. They are analytical views, not modules,
teams, packages or a mandatory build backlog.

### 1. Intent, premise and evidence

The system should support proposition and audience definition; affected-person analysis;
educational or public purpose; claim class; premise challenge; no-build and system-change
alternatives; comparator; falsifier; exact run identity; evidence; authorised disposition and
return routing.

### 2. Semantic, educational and public capability

The system should support authoritative curriculum identity and releases; teaching and
professional agency; pupil participation; assessment and feedback; public API/SDK semantics;
search and graph meaning; generated resources; media/channel projections; provenance,
contestability and correction. The Kit composes these capabilities; legitimate domain and
professional authorities retain their meaning.

### 3. Product, experience and service composition

The system should support host/control-boundary profiles; shell and navigation; public web
discovery and canonical addressing; design-system consumption; proposition-specific interaction
grammar; content and information design; accessibility; localisation; outbound notification and
messaging to people; service continuity; backstage support; experimentation and humane terminal
states.

### 4. Identity, trust, rights and human authority

The system should support principals and sessions; authorisation and delegation; accounts,
tenancy and isolation; privacy and consent; safeguarding and abuse resistance; rights and policy;
security; challenge, correction and effective human remedy. Integrating an authority-supplied
decision does not transfer that authority into the Kit.

### 5. State, data, knowledge and integration

The system should support authoritative transactional state; typed domain data access;
compatibility-aware schema and semantic migration; assets and durable objects; caches and
ephemeral acceleration; jobs, queues, events and external effects; projections such as search,
graph, vector and generated artefacts; configuration, secrets and environments; integration,
reconciliation and provider exit.

This family contains many “boring and important” foundations. They matter because a real
proposition may activate mutable state, durable effects, external dependencies or derived
knowledge—not because the Kit should prebuild every technology family.

### 6. Delivery, operation and resilience

The system should support reproducible builds; supply and provenance assurance; preview,
promotion and release identity; traffic and compatibility transitions; observability and semantic
health; objectives, performance and capacity within the profile's declared budgets; incident
response; repair; backup/restore; continuity; cost and resource controls; support and operational
retirement.

### 7. Creation, evolution and stewardship

The system should support capability discovery; proposition and profile declaration; scaffolding;
local feedback; representative scenarios and fault injection; diagnostics; documentation;
upgrades and deprecation; Kit-placement decisions; contribution and divergence; learning,
preservation, sustainability and retirement.

Assurance applies through every family. It is not a late eighth family.

## Explicit activation, absence and degradation policy

The effective capability state in a composition is one of:

| State | Required meaning |
| --- | --- |
| **Activated** | The semantic contract is applicable, bound and supported with the profile's required evidence |
| **Reduced** | A declared subset remains truthful; removed guarantees and user-visible consequences are explicit |
| **Omitted** | The capability is legitimately inapplicable to this proposition/context, with the reason and decision authority recorded |
| **Unavailable** | The proposition requires the capability but no acceptable implementation or binding exists; the composition must refuse or change its claim |
| **Unknown** | Applicability or conformance is unresolved; uncertainty cannot be silently treated as omission or support |

A no-effect telemetry sink can be legitimate in a local profile if the claim does not depend on
operational observation. Process memory cannot stand in for required authoritative persistence.
An empty search result cannot look complete when a retriever or source projection is missing.

Degradation is a runtime condition, not a static profile state. An activated or reduced capability
contract declares its supported degraded modes, user-visible truth, recovery and terminal
semantics. A particular occurrence belongs in an
[operation, outcome and repair record](core-records-and-interfaces.md#6-operation-outcome-and-repair-record).

The model must make supported combinations discoverable and invalid combinations explainable.
Declaring a capability absent is not a way to waive an obligation activated by public exposure,
personal data, professional reliance or another real fact.

## Semantic contract, adapter, binding and host

```text
intended outcome and claim
→ semantic capability contract
→ activated composition profile
→ technology adapter
→ provider binding
→ host and product-specific use
→ claim-specific evidence
```

- The **semantic contract** owns operations, guarantees, absence, failure and recovery meaning.
- The **adapter** implements a protocol or mechanism such as SQL/PostgreSQL, HTTP, object storage,
  RDF, OpenTelemetry or an in-process local implementation.
- The **binding** owns provider-specific credentials, endpoints, resource lifecycle, supported
  types, quotas and optional control-plane features.
- The **host/product** owns routes, product language, local state, proposition-specific policy,
  interaction grammar and evidence thresholds.

Provider independence is not achieved by erasing provider differences from types. It requires a
stable semantic contract, explicit provider capabilities, independent composition or valid
omission, and—for authoritative or derived state—exercised export/restore, rebuild or migration.

## Illustrative foundation mapping

This table keeps ordinary mechanisms visible without letting them define the architecture.

| Mechanism example | Enduring capability questions it may serve |
| --- | --- |
| Managed PostgreSQL such as Neon | Authoritative state, transactions, consistency, availability, backup/restore, capacity, regional/data duties and provider exit |
| SQL and typed/ORM-adjacent tooling | Domain correspondence, query semantics, transactions, compile/runtime validation, diagnostics and compatible change |
| Migration management | Schema and meaning transition, rehearsal, coexistence, forward/rollback limits, state evidence and recovery |
| Vector or search store operations | Source authority, projection definition, embedding/model identity, completeness, freshness, evaluation, correction, rebuild and cutover |
| Object storage | Object identity, representation, upload integrity, rights, metadata, versioning, delivery, retention, deletion and export |
| Queues, jobs and outbox patterns | Intent/effect identity, durable hand-off, ordering, retry, idempotency, poison handling, acknowledgement, repair and observation |
| Cache | Authority relation, key/release identity, TTL and invalidation, negative caching, degraded mode and diagnostic visibility |
| Observability service | Signal semantics, correlation, redaction, release identity, objective, response authority, remedy and retention |

Different propositions may satisfy these questions through different mechanisms or legitimately
omit them. A provider should be selected only after the proposition and capability contract make
the needed behaviour visible.

## Placement test

A recurring mechanism is a candidate for Kit ownership only when:

1. the enduring need and semantic contract are understood;
2. the Kit can own composition, lifecycle, invariant or assurance without taking upstream
   meaning;
3. the contract preserves useful mechanism-specific behaviour rather than collapsing to a lowest
   common denominator;
4. absence, reduced modes, errors and diagnostics remain honest;
5. configuration and extension points do not export hidden policy to consumers;
6. compatibility, migration, support and retirement have an accountable steward; and
7. unlike use or a meaningful counter-instance can test any claim of general reach.

Consumer count is neither a prerequisite for deliberate Kit design nor proof of generality.

## Reopening conditions

The contract envelope or families should be simplified when fields do not change decisions,
diagnosis or conformance; split when distinct authorities or lifecycles are obscured; and expanded
only when real scenarios expose an unrepresented product obligation. A family that maps mainly to
the current repository or a technology trend has failed its purpose.
