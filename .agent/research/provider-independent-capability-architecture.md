# Provider-independent capability architecture and storage options

**Created**: 2026-08-13  
**Updated**: 2026-08-14 — reprovenance and panel cures  
**Status**: Complete, non-normative research  
**Decision records**:
[ADR-225](../../docs/architecture/architectural-decisions/225-provider-independent-capability-contracts.md)
and
[PDR-139](../practice-core/decision-records/PDR-139-provider-independent-capability-composition.md)

**Related repository research**: the
[web-app-deconstruction meta-analysis](../../research/web-app-deconstruction/docs/synthesis/meta-analysis.md)
independently mapped this report's problem a month earlier — its
negative-space row "tested semantic portability, exit, restoration and
retained options" and lens 30 ("adapters do not establish artefact identity
or semantic substitutability") name the gap this report's
provider-independence floor answers.

## Executive finding

The durable architectural unit is a **capability**, not a vendor and not a
technology category. A capability contract should be independent of its
provider while remaining precise about the behaviour its consumers need.
Runtime bindings then connect that contract to a local implementation, an open
protocol, a managed service, or no implementation when the capability is not
part of the composed system.

This is stronger than wrapping every SDK in an interface and narrower than
inventing a universal storage API. It requires four separate decisions:

1. which semantic capability exists;
2. which contract owns its guarantees;
3. which technology adapter and provider binding supply it in a given runtime;
   and
4. what the system means when that capability is not composed.

Provider substitution is an architectural property. It does not by itself
provide automatic failover, zero-downtime migration, or state portability.
Stateful capabilities also need an explicit authority model: authoritative
state needs portable identifiers, schemas, migrations, exports, and restore
exercises; derived state needs an exercised rebuild from its authority.

The corresponding runtime test is provider-by-provider: for any named external
provider, there is a supported system composition that does not require that
provider. It may use a compatible provider, a local or self-hosted binding, or
omit a non-constitutive capability. A capability is non-constitutive only when
its absence preserves that host's declared purpose and guarantees. This does
not require one deployment that omits every external service simultaneously,
and it does not make every capability optional.

## Research question

How can the repository add PostgreSQL support, with Neon as a candidate managed
provider, without any single named external provider becoming a condition
for the system's existence? (The constraint in that question was
subsequently owner-declared, 2026-08-14, and recorded for adoption at
ADR-225 — Proposed at this update, its obligations taking force at that
record's acceptance; this report's analysis preceded and fed that
decision.)

The question expands into six tests:

- Can a consumer name what it needs without naming who supplies it?
- Can provider types, configuration, identifiers, and lifecycle stay outside
  domain and application logic?
- Can a host choose a different binding at one composition boundary?
- Can the capability be omitted without consumers pretending it exists?
- For stateful capabilities, can the accumulated state leave with the
  capability contract?
- For each named external provider, which documented and exercised supported
  composition exists without it?

## Existing architectural direction

The repository already contains most of the supporting structure:

- [ADR-024](../../docs/architecture/architectural-decisions/024-dependency-injection-pattern.md)
  establishes constructor injection and injected I/O.
- [ADR-042](../../docs/architecture/architectural-decisions/042-runtime-adapters-folder.md)
  gives runtime and platform implementations a bounded home.
- [ADR-127](../../docs/architecture/architectural-decisions/127-documentation-as-foundational-infrastructure.md)
  treats durable architectural knowledge as infrastructure.
- [ADR-154](../../docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md)
  separates reusable semantic responsibility from consumer-specific
  implementation.
- [ADR-155](../../docs/architecture/architectural-decisions/155-decompose-at-the-tension.md)
  directs the architecture to split responsibilities that change for
  different reasons.
- [ADR-212](../../docs/architecture/architectural-decisions/212-federated-visibility-authority-and-evidence-boundaries.md)
  separates durable authority from external projections and evidence.
- [ADR-221](../../docs/architecture/architectural-decisions/221-estate-knowledge-graph.md)
  keeps authored files authoritative while allowing derived, recomputable
  graph views.

The missing statement is the cross-cutting rule that connects those decisions:
replaceable runtime capabilities depend on provider-independent semantic
contracts, and optional capabilities have explicit absence semantics.

## The four-layer distinction

| Layer | Owns | Must not own |
| --- | --- | --- |
| Authority and lifecycle | Canonical state, provenance, retention, migration, recovery | Provider SDK behaviour |
| Capability semantics | Operations, guarantees, failure meaning, availability meaning | Vendor configuration and product names |
| Technology or protocol | PostgreSQL, filesystem, S3-compatible objects, SPARQL, HTTP | Product and domain policy |
| Provider binding | Credentials, endpoints, SDK types, service lifecycle, provider extensions | Semantic authority for the capability |

“Generic” applies only across providers. The contract remains specific to the
capability. A `TransactionalStateStore`, `ObjectStore`, or `SearchIndex` can
state useful guarantees; a universal `Database` contract usually collapses
transactions, documents, graph queries, search, caching, and analytics into a
lowest-common-denominator API.

Vocabulary in this report is deliberate: a **capability contract** is the
semantic interface; a **technology adapter** implements a protocol such as
PostgreSQL or S3; a **provider binding** supplies service-specific
configuration and lifecycle; and **host composition** selects the capabilities
and bindings available in one running system.

## Capability and provider shape

| Capability | Provider-independent responsibility | Candidate bindings | Valid omission shape |
| --- | --- | --- | --- |
| Transactional state | Constraints, transactions, concurrency, query semantics, migration boundary | PostgreSQL-compatible service, self-hosted PostgreSQL, SQLite for a bounded local profile | Host or feature is not composed; never silently replaced with process memory |
| Object storage | Addressable bytes, metadata, integrity, retention | Filesystem, S3-compatible service, managed blob service | Asset-bearing feature is absent or read-only |
| Search index | Indexed projection, query and ranking contract, rebuild | Elasticsearch, OpenSearch, bounded local index | Search surface is absent or exposes a declared reduced mode |
| Graph view | Graph query and traversal over an identified dataset | In-memory graph, embedded RDF store, remote SPARQL endpoint | Graph-dependent surface is absent; canonical records remain available |
| Analytical query | Read-only analysis over snapshots or exports | DuckDB, warehouse, PostgreSQL read model | Analysis surface is absent; operational authority is unaffected |
| Cache | Disposable acceleration with bounded staleness | In-memory cache, Valkey-compatible service, runtime cache | Direct authoritative read remains correct |
| Event publication | Durable hand-off and delivery guarantees | Transactional outbox, broker, webhook adapter | Only valid when no required downstream obligation exists |
| Telemetry sink | Delivery of non-authoritative operational observations | Hosted analytics, OpenTelemetry collector, local log, no-effect binding | A no-effect binding can be correct when the contract declares telemetry optional |

The omission column is part of each capability's semantics. There is no safe
universal null provider. A no-effect telemetry sink and an absent authoritative
state store have radically different meanings.

## Storage technologies and models

No single storage technology should become the system-wide storage model. Each
option is appropriate when its guarantees match a named capability.

### Git and authored files

Best fit:

- human-reviewable doctrine, schemas, plans, configuration, and small datasets;
- provenance through commits and pull requests;
- reconstructable organisational state that must survive runtime turnover.

Constraints:

- weak fit for high-write transactional workloads and ad hoc concurrent
  queries;
- large binary artefacts and rapidly changing operational state create noisy
  history;
- indexes and graphs derived from files should remain reproducible projections.

### PostgreSQL

Best fit:

- authoritative transactional state;
- relational constraints, joins, concurrency, and durable migrations;
- a transactional outbox and other operational read models;
- JSON or vector extensions when those are bounded implementation choices.

Portability properties:

- the documented PostgreSQL wire protocol and compatibility ecosystem allow
  one technology adapter to serve managed and self-hosted deployments;
- logical export and schema migrations provide an exit path when tested;
- product-specific extensions, connection behaviour, and operational limits
  still need explicit containment.

PostgreSQL should back a semantic repository or state capability. It should not
become the interface consumed by every domain component.

### SQLite

Best fit:

- local-first, offline, development, single-process, and low-concurrency
  profiles;
- an embedded durable implementation with no external service;
- portable snapshots and small operational datasets.

Constraints:

- concurrency, replication, and operational topology differ from a networked
  PostgreSQL service;
- it is not automatically a conforming substitute for contracts that depend on
  PostgreSQL transaction or query behaviour.

SQLite is therefore a strong independent binding for bounded capabilities, not
proof that every PostgreSQL-backed capability can run unchanged on SQLite.

### Object storage and content-addressed artefacts

Best fit:

- bulk exports, media, generated artefacts, model inputs, and immutable
  evidence;
- content-addressed identity and integrity checks;
- local filesystem and S3-compatible implementations behind one object
  capability.

The authoritative record should store portable object identity and integrity
metadata, not a provider URL as the enduring identifier.

### RDF stores and graph projections

Best fit:

- standards-based semantic graphs, linked data, provenance, and federated
  graph queries;
- embedded stores such as Apache Jena TDB and remote SPARQL services;
- derived knowledge views whose source records remain independently usable.

The RDF dataset contract and named-graph semantics are more portable than a
specific graph database API. A remote graph service can be omitted when the
graph-dependent surface is non-constitutive for the host — its declared
purpose and guarantees survive — or replaced by an exercised independent
binding; the dataset remaining rebuildable from its authority is what keeps
either move cheap.

### Search indexes

Best fit:

- relevance-ranked discovery, full-text retrieval, facets, and hybrid search;
- derived data that can be regenerated from canonical inputs.

Search is not a canonical data store. That distinction makes provider changes
and full index rebuilds tractable. A search implementation can expose rich
provider features inside its adapter, but the capability contract should name
the query semantics the product depends on.

### Parquet and DuckDB

Best fit:

- portable columnar snapshots, research datasets, bulk interchange, and local
  analytical queries;
- reproducible analysis without a continuously running database service;
- a bridge between authored or operational sources and analytical consumers.

They complement rather than replace transactional storage. Parquet is an
artefact format; DuckDB is an embedded analytical execution engine.

### Event logs, outboxes, and CloudEvents

Best fit:

- durable propagation between capabilities without making a broker the
  authority;
- replayable integration history and independently replaceable consumers;
- a PostgreSQL transactional outbox for atomic state-and-event recording,
  followed by a separately composed publisher binding — omittable only in
  profiles with no required downstream obligation.

CloudEvents can standardise the event envelope. Delivery, ordering,
deduplication, and replay guarantees still belong to the capability contract.

### Valkey-compatible caches

Best fit:

- disposable acceleration, rate limits, leases, and short-lived coordination;
- an open-protocol remote cache with an in-memory implementation for bounded
  profiles.

A cache remains derived. If removing it changes authoritative meaning, it was
not only a cache.

### CRDT-based local-first state

Best fit:

- collaborative editing and intermittent connectivity;
- convergence among peers without one continuously available coordinator;
- document state whose conflict model is explicitly part of the capability.

CRDTs do not remove authority, access, retention, provenance, or semantic
validation questions. They are a data model for a collaboration capability,
not a universal continuity substrate.

## Neon and PostgreSQL

Neon is a candidate managed PostgreSQL provider, not the semantic capability.
The integration separates three surfaces.

### PostgreSQL data plane

A normal PostgreSQL connection can satisfy the repository's transactional
capability through the same PostgreSQL technology adapter used for another
compatible managed service or a self-hosted deployment. Connection pooling,
runtime constraints, and driver choice belong inside that adapter and its
provider binding.

For Node.js runtimes, a standard PostgreSQL driver preserves the broadest
technology portability. A Neon-specific serverless driver is an adapter choice
when HTTP, WebSocket, or edge-runtime constraints require it; consumers still
see the same capability contract.

### Neon control plane

Database branching, project administration, and provider metrics are not
ordinary transactional storage operations. If adopted, each belongs to a
separate optional management capability with a Neon-specific binding. Keeping
those operations off the transactional contract prevents provider features
from defining the general state interface.

### Development tooling

A provider's MCP server can help developers create or inspect provider
resources. It is operator tooling, not the application's persistence boundary
and not a runtime dependency. The running system must remain constructible
without that tool.

This separation permits Neon to add immediate operational value without
turning the Neon account, API, driver, or branching model into domain
authority.

## Behaviour portability and state portability

An interchangeable interface supplies **behaviour portability**. Stateful
continuity additionally requires **state portability**.

| Concern | Required boundary |
| --- | --- |
| Schema | Migrations and constraints are repository-owned artefacts |
| Identity | Domain identifiers do not encode provider projects, regions, URLs, or object keys |
| Data | A documented logical export exists in an open or broadly readable format |
| Restore | Restore is exercised against an independent target, not merely described |
| Extensions | Required extensions are declared; provider-only features sit behind separate capabilities |
| Secrets | Credentials and endpoints remain runtime configuration |
| Availability | Health and capability discovery report what is actually composed |
| Exit | Provider replacement is tested as configuration, adapter, and data movement together |

The exit test is behavioural: after moving state, can the independent binding
serve the same capability guarantees to unchanged consumers? A successful data
dump alone is insufficient.

## Composition and absence

Provider choice should occur once at the host's composition boundary. Consumers
receive capabilities and do not read provider environment variables or branch
on provider names.

Each capability declares one of these host relationships:

- **required**: the host is invalid without a conforming binding;
- **optional surface**: the feature, route, tool, or worker is not composed when
  the capability is absent;
- **declared reduced mode**: the contract defines a smaller observable mode and
  the host advertises it; or
- **no-effect implementation**: valid only when producing no external effect
  fulfils the contract, as with optional telemetry.

An authoritative store never falls back silently to volatile memory. An absent
publisher never drops a required obligation. An omitted capability reduces the
composed system; it does not invite a false success response.

## The provider-independence floor

The normative statement of this floor is PDR-139 parts 8–9; this section is
the research derivation.

An interface seam is necessary but does not establish service independence.
For each named external provider used by a host, one documented and exercised
supported composition must exist without that provider. The independent composition can
take one of three forms:

- the same capability through another compatible provider;
- the same capability through a local or self-hosted binding; or
- a smaller host in which a non-constitutive capability is not composed because
  its declared purpose and guarantees remain intact.

This is a per-provider test. It permits a managed production profile while
preventing any one account, service API, control plane, or proprietary runtime
from becoming a condition for the system's existence. Conformance and restore
evidence keep the independent composition real; an unexercised interface does
not satisfy the test.

## Rejected shapes

### One universal database interface

It hides the guarantees consumers rely on and drives every provider toward a
weak key-value shape. Name transactional, object, search, graph, analytical,
and cache capabilities separately.

### Vendor SDKs in domain or application logic

Provider types and error models then spread through consumers, so replacement
becomes a product rewrite rather than a binding change.

### One provider class per brand

When several providers implement the same open protocol, brand-labelled data
adapters duplicate technology semantics. Share the protocol adapter; every
provider keeps its own binding for configuration and lifecycle, and a
provider-specific adapter is justified only by genuine behavioural
divergence.

### A universal null provider

Absence is semantic. Returning success from an absent authoritative capability
loses data and hides an invalid composition. Each capability defines its own
absence behaviour.

### Provider extensions on the base contract

Branching, proprietary search operators, hosted analytics controls, and similar
features expand the base contract until only one provider can satisfy it. Model
them as separate optional capabilities.

### Multi-provider operation as the portability mechanism

Running every provider concurrently adds consistency and operational cost.
Portability is established first by boundaries, conformance, and exercised data
movement. Multi-provider failover is a separate availability decision.

### Premature polyglot persistence

Using many stores does not create independence. It creates more operating and
migration boundaries. Add a storage model only when a named capability needs
its distinct guarantees.

## Recommended decision tests

Before introducing a provider-backed capability, answer:

1. What semantic capability does the product need?
2. Which guarantees distinguish it from adjacent capabilities?
3. Is there a real provider, local, self-hosted, or omitted composition that
   makes the boundary action-changing rather than speculative?
4. Does an open protocol already provide the correct technology seam?
5. What does absence mean, and how is it visible?
6. Which provider-specific features deserve separate capabilities?
7. Where do schema, identity, export, and restore authority live?
8. Which conformance evidence proves another binding can serve unchanged
   consumers?
9. For each named external provider, what documented and exercised supported
   composition exists without it?

For the proposed PostgreSQL work, the research supports a PostgreSQL-backed
transactional capability with Neon as one configuration, plus separate optional
Neon management capabilities only when a concrete consumer needs them.

## Evidence that would change the conclusion

The pattern should be narrowed if:

- a proposed contract cannot state useful guarantees without naming one
  provider;
- another binding cannot be exercised without provider branches in consumers;
- the abstraction merely renames one SDK and has no independent or omitted
  composition;
- portability controls cannot move the state needed to preserve behaviour; or
- adapter and conformance costs repeatedly exceed the cost of an intentionally
  local capability with no replacement requirement.

The PostgreSQL recommendation should be revisited if the required workload is
primarily immutable artefacts, analytical scans, semantic graph traversal, or
offline collaborative documents rather than transactional operational state.

## Primary sources

External claims were checked against these first-party sources on
2026-08-13; the list was extended 2026-08-14 to cover the S3-compatible,
search, and collector technologies named above:

- [Neon: connection methods for Vercel](https://neon.com/docs/guides/vercel-connection-methods)
- [Neon: branching introduction](https://neon.com/docs/guides/branching-intro)
- [Neon MCP server](https://github.com/neondatabase/mcp-server-neon)
- [PostgreSQL: frontend/backend protocol](https://www.postgresql.org/docs/current/protocol.html)
- [PostgreSQL: backup and restore](https://www.postgresql.org/docs/current/backup.html)
- [SQLite: appropriate uses](https://sqlite.org/whentouse.html)
- [Apache Parquet overview](https://parquet.apache.org/docs/overview/)
- [DuckDB: querying Parquet](https://duckdb.org/docs/stable/data/parquet/overview)
- [Apache Jena documentation](https://jena.apache.org/documentation/)
- [W3C SPARQL 1.2 Query](https://www.w3.org/TR/sparql12-query/)
- [CloudEvents](https://cloudevents.io/)
- [Valkey](https://valkey.io/)
- [Automerge concepts](https://automerge.org/docs/reference/concepts/)
- [Amazon S3 REST API](https://docs.aws.amazon.com/AmazonS3/latest/API/Welcome.html)
- [Elasticsearch documentation](https://www.elastic.co/docs)
- [OpenSearch documentation](https://opensearch.org/docs/latest/)
- [OpenTelemetry Collector](https://opentelemetry.io/docs/collector/)
