# Database Tools, oak-openapi and OCE through operations and assurance lenses

## Purpose and scope

This record runs fixed portfolio lenses 33-44 from the
[Database, API and OCE concept-lens portfolio](README.md). The lens numbers in
this file are local and sequential because the research validator requires each
record to begin at Lens 1; the register correspondence is explicit below.

The method is OCE's pinned
[`concept-exploration` workflow](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md#L25-L49).
Evidence is pinned to:

- Database Tools
  `3d1eff31a398189a839ae68bcf69990089c31bd2`;
- oak-openapi
  `2fb1383bfeaeb4986ec29cef97be133b69baeef5`;
  and
- OCE
  [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

This is current-state research for OCE and the Oak Innovation Kit. It does not
propose repairs to the source repositories, treat their mechanisms as
requirements, or assume that an operational feature is justified merely
because it exists. The concern is the capability or assurance that may matter
to future consumers, followed by the simplest architecture that can prove it.

### Evidence notation

- **Observed:** directly supported by immutable source lines at a pinned
  revision.
- **Inferred:** an interpretation warranted by cited observations, not a
  declared or measured runtime fact.
- **Unknown:** material evidence is absent from this static source pass.
- **Candidate explanation:** a plausible account which remains open.
- **Explicit falsifier:** evidence that would defeat or materially narrow a
  proposal or investigation.

Static source can establish encoded control flow, transaction callbacks,
generated artefacts, validation rules, query composition and authored tests. It
cannot establish deployed transaction semantics, data distributions, query
plans, latency, traffic, incidents, backup fitness, operator response, runtime
payloads or user impact. Those limits are part of the findings rather than
gaps to conceal.

## Perspective map

| Local lens | Portfolio lens                               | Governing distinction                                       |
| ---------- | -------------------------------------------- | ----------------------------------------------------------- |
| 1          | 33: reliability and fault containment        | component failure versus truthful bounded outcome           |
| 2          | 34: performance, queueing and budgets        | fast example versus bounded work under demand               |
| 3          | 35: observability and control                | emitted signal versus effective feedback loop               |
| 4          | 36: MV dependency and refresh                | refreshed objects versus coherent projection release        |
| 5          | 37: online, bulk and cache consistency       | multiple delivery clocks versus named snapshot semantics    |
| 6          | 38: query composition and amplification      | one capability request versus total induced work            |
| 7          | 39: backup, recovery and preservation        | restorable infrastructure versus recoverable meaning        |
| 8          | 40: invariant enforcement placement          | repeated validation versus one authoritative fact           |
| 9          | 41: claims-to-evidence epistemology          | green check versus the precise claim it warrants            |
| 10         | 42: fixture and test-data representativeness | available examples versus relevant evidence population      |
| 11         | 43: generated and manual drift               | generated files versus reproducible semantic correspondence |
| 12         | 44: runtime and consumer conformance         | declared contract versus behaviour at every consumer edge   |

---

## Lens 1: reliability and fault containment (fixed lens 33)

### Governing question

What is the smallest meaningful unit whose outcome must be truthful,
recoverable and isolated when a dependency or step fails?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** the MV trigger records a request and sends HTTP 200 before it
  dispatches the selected refresh action
  (request acknowledgement and dispatch).
- **Observed:** both full-refresh implementations iterate the selected
  materialized views inside one transaction; an exception rolls that transaction
  back, records error state and then closes the client
  (blocking full refresh,
  concurrent full refresh).
- **Observed:** the scheduled Hasura trigger calls the action once per day with
  zero retries, a 600-second timeout and a six-hour tolerance
  (cron policy).
- **Observed:** one mutation transaction inserts an asset and its state record,
  then can return an ordinary `{ success: false }` value if the subsequent
  lesson update finds no row
  (asset transaction).
- **Observed:** another transaction performs several video, lesson and state
  writes, then can return an ordinary failure value when the final review update
  finds no row
  (video replacement transaction).

#### Inherited assumptions exposed

- **Inferred:** the words "transaction", "concurrent" and "fire and forget"
  do not by themselves state the externally meaningful failure boundary.
- **Inferred, high-impact hypothesis:** if the transaction library commits a
  fulfilled callback regardless of a returned domain-failure value, some
  handlers can durably perform early writes while returning failure. Static
  control flow warrants the probe, but does not prove deployed commit behaviour.
- **Inferred:** an accepted refresh request, a completed refresh batch and a
  coherent public projection are three distinct outcomes.

### Movement 2: define the problem space

**Problem frame:** OCE needs reliability at capability boundaries, not a generic
promise that every component retries or never fails. For each command, query,
projection release and bulk publication it must state what can fail together,
what can succeed independently, what the caller is told, and what evidence
makes retry safe. Acknowledging work before its durable outcome is legitimate
only when the protocol gives the caller a stable operation identity and a way
to learn the terminal result.

The harm is semantic: a caller can receive failure after durable partial work,
success before work later fails, or a retry can duplicate an outcome. Success
means every externally relevant outcome is explicit and testable, while failure
is contained at a boundary chosen for the domain rather than inherited from a
process, query or database connection.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the early refresh response intentionally keeps a
   scheduler connection short, while Slack and status rows are the real
   completion channel.
2. **Candidate explanation:** transaction helpers translate returned failure
   values into rollback elsewhere, or the apparently late failures are
   unreachable under enforced data invariants.
3. **Candidate explanation:** all materialized views deliberately form one
   release unit, so batch rollback is the required containment boundary.
4. **Candidate explanation:** the mechanisms grew independently and their
   different meanings of completion have never been modelled as one protocol.

#### Changed assumption

The initial assumption that reliability could be evaluated by finding retries,
transactions and error handlers changed. **Inferred:** reliability begins with
a domain outcome algebra and declared fault domains; those mechanisms are
evidence only after their relationship to the outcome is proved.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** current code contains both synchronous-looking HTTP outcomes and
work whose completion happens after the response, plus mutation callbacks where
failure values and database rollback may not be coupled. These are useful
signals about required outcomes, not an architecture for OCE to inherit.

| Warranted investigation or proposal                                                                                                                           | Warrant                                                                                                                          | Explicit falsifier                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| Define capability-specific outcome types for accepted, committed, published, partially completed, rejected and retryable work before choosing infrastructure. | Current endpoints collapse distinct request, database and projection outcomes into HTTP success/failure plus mutable status.     | A smaller outcome model covers every observed caller decision without ambiguity, duplication or loss of recovery information.          |
| Run integration fault injection at every post-write failure return in mutation transactions and inspect committed state, response and retry effect.           | Static control flow permits a fulfilled failure value after earlier writes; actual transaction-library behaviour is unproved.    | Every injected failure provably rolls back all writes and repeated requests have the intended outcome under the deployed adapter.      |
| Model refresh or publication as an addressable operation only if asynchronous completion is genuinely required; otherwise keep the capability synchronous.    | The trigger acknowledges before dispatch and exposes status through separate mutable records.                                    | All necessary refresh work reliably completes within the caller protocol and the accepted response already proves the terminal result. |
| Partition failure domains by consumer-visible coherence rather than by process or table count.                                                                | One failed view currently affects a transaction spanning the selected refresh set, but the required release boundary is unknown. | Product semantics require every projection to advance atomically and an executable snapshot test proves that boundary.                 |

#### Unresolved evidence

- **Unknown:** deployed Drizzle transaction behaviour for fulfilled failure
  values and whether database constraints make those branches unreachable.
- **Unknown:** caller retry behaviour, operation idempotency keys and whether
  the scheduler or operators reconcile an accepted refresh with its final
  state.
- **Unknown:** incident history and which partial outcomes have caused user or
  editorial harm.

---

## Lens 2: performance, queueing and resource budgets (fixed lens 34)

### Governing question

How much work may one capability induce, under what concurrency and data shape,
before it violates an explicitly justified service objective?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** the mutation API configures a connection pool maximum of one in
  serverless mode and ten otherwise, with five-second connection and ten-second
  idle timeouts
  (mutation pool).
- **Observed:** Hasura metadata configures `read-committed` isolation, a total
  maximum of 350 connections and prepared statements disabled
  (Hasura connection settings).
- **Observed:** refresh code enumerates materialized views by name and awaits
  each refresh in sequence inside the batch transaction
  (enumeration,
  sequential work).
- **Observed:** the lesson OpenAPI materialized view builds a wide projection
  through joins, aggregations and correlated subqueries, then is created without
  initial data
  (projection construction,
  projection output).
- **Observed:** selected oak-openapi GraphQL reads use a five-minute Hasura
  cache directive
  (subject query cache).

#### Inherited assumptions exposed

- **Inferred:** pool sizes, cache duration and batch shape are operational
  decisions, but no capacity claim follows from their presence alone.
- **Inferred:** database connection supply, query service time, lock duration,
  refresh work and downstream cache behaviour interact as queues even when no
  explicit queue product exists.
- **Unknown:** production cardinalities, query plans, cache hit rates,
  concurrency, tail latency, saturation, lock contention and refresh duration.

### Movement 2: define the problem space

**Problem frame:** OCE should define performance as bounded work for a named
capability under representative demand and data, with resource budgets derived
from user and operational outcomes. It should not freeze arbitrary connection
counts, caching periods or precomputation strategies into a framework. A fast
single example is insufficient when work amplifies with curriculum size,
request fan-out or a synchronized refresh.

Consumers are harmed by long or unpredictable response time, starvation,
stale fallbacks and cascading failure. Operators are harmed when a nominally
successful feature has no workload model explaining which resource saturates
first. Success is observable headroom and graceful degradation against explicit
service objectives, whatever mechanism meets them most simply.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the large Hasura pool is justified by measured
   read concurrency while mutation serialization is a deliberate serverless
   safety boundary.
2. **Candidate explanation:** materialized projections shift expensive but
   stable composition out of user request paths and are the simplest way to
   meet latency needs.
3. **Candidate explanation:** cache and projection layers compensate for query
   shapes whose underlying domain contract could instead be simplified.
4. **Candidate explanation:** the settings are conservative defaults without a
   current, evidence-backed capacity model.

#### Changed assumption

The initial assumption that this lens should judge whether current SQL or pool
settings are efficient changed. **Inferred:** the first question is the maximum
justified work and latency of each capability; query, cache, pool and projection
choices can then compete against that budget.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database Tools encodes substantial read precomputation and two
very different connection envelopes, while oak-openapi adds response caching.
None of the pinned source establishes whether those choices are necessary,
adequate or excessive for real demand. OCE needs a workload contract, not
copied tuning.

| Warranted investigation or proposal                                                                                                          | Warrant                                                                                                              | Explicit falsifier                                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Define capability-level service objectives and resource budgets from user-visible outcomes, including data-size and concurrency envelopes.   | Existing pool and cache numbers are mechanisms without pinned workload or objective evidence.                        | The objectives cannot distinguish viable designs or reveal overload before users experience it.                             |
| Capture query plans, row counts, lock time, cache behaviour and end-to-end traces for representative online, mutation and refresh workloads. | Static SQL complexity does not establish actual cost, while queueing depends on service-time distributions.          | Repeated representative measurements show those variables do not explain latency, saturation or failure for the capability. |
| Compare direct normalized reads, purpose-built queries and derived projections for one vertical slice using the same semantic contract.      | Current MVs may deliver real value, but their necessity cannot be inferred from their existence.                     | Only the current projection shape meets the justified objectives and alternatives fail for intrinsic semantic reasons.      |
| Specify overload behaviour and admission control at the capability boundary before selecting pool sizes or caches.                           | Fixed connection supplies and refresh batches create finite queues whose rejection and degradation semantics matter. | Measured peak demand remains safely bounded by invariant upstream limits and no queue can approach harmful saturation.      |

#### Unresolved evidence

- **Unknown:** justified service objectives, peak concurrency and acceptable
  degradation for each OCE consumer class.
- **Unknown:** production plans, cardinality estimates, index use, database
  headroom and the cost of keeping each projection current.
- **Unknown:** whether cache hits preserve the freshness semantics consumers
  actually need.

---

## Lens 3: observability and control (fixed lens 35)

### Governing question

Which signals let an authorised actor compare actual state with intended state
and take a timely, effective and auditable corrective action?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** Database Tools defines view-management state including dirty
  flags, next update, trigger status, error, refresh start and finish, and
  refresh group
  (view-manager state).
- **Observed:** the timestamp helper updates only an existing view-manager row;
  it does not create a missing control record
  (timestamp helper).
- **Observed:** refresh admission reads last-update time and trigger status,
  rejects a recent or apparently running request, and separately sets status to
  started
  (refresh admission).
- **Observed:** the repository creates a row-level audit table plus functions
  which capture operation, table, timestamp, actor and old/new row JSON
  (audit records,
  trigger installation).
- **Observed:** oak-openapi's health route selects a subset of registered views,
  while the Pingdom route selects all registered names and returns HTTP 200 even
  when its response body reports an error
  (health selection,
  Pingdom selection and response).

#### Inherited assumptions exposed

- **Inferred:** logs, status rows, audit history and health endpoints answer
  different questions; their existence does not make them one observability
  model.
- **Inferred:** a signal becomes control only when something senses it, compares
  it with a declared target, has authority to act and can verify the action.
- **Unknown:** which signals are collected, retained, alerted upon, reviewed or
  connected to operational decisions in deployed environments.

### Movement 2: define the problem space

**Problem frame:** OCE needs evidence that important capability outcomes remain
inside their intended operating envelope and a closed loop for restoring them
when they do not. Telemetry should be derived from the domain outcome and
decision it supports, not from every implementation detail that can emit a log.
Audit evidence has a different integrity and retention purpose from debugging
telemetry, and readiness has a different purpose from liveness or dependency
diagnosis.

The negative space is as important as the signals: no static endpoint proves
that anyone notices a stale projection, can identify affected consumers, has
authority to intervene, or can confirm recovery. Success is a small set of
high-information signals connected to explicit decisions and tested responses.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** mutable view-manager rows form an intentional
   controller state and Slack supplies the human action loop.
2. **Candidate explanation:** health endpoints are deployment-platform probes,
   so their HTTP semantics are deliberately independent of diagnostic detail.
3. **Candidate explanation:** audit logging is for editorial accountability,
   not operations, and should remain a separately governed evidence stream.
4. **Candidate explanation:** observability accumulated per component without a
   shared model of capability health or operator decisions.

#### Changed assumption

The initial assumption that more instrumentation would close the evidence gap
changed. **Inferred:** the better basis is fewer, outcome-oriented signals with
named targets, consumers, authority and response; instrumentation volume is not
assurance.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** the source has useful raw material for control, including refresh
state, admission checks, audit rows and health queries. Their semantics are not
shown as one closed loop, and the two health surfaces do not establish a single
definition of healthy. OCE should model the decision before choosing metrics,
logs, traces or alerts.

| Warranted investigation or proposal                                                                                                      | Warrant                                                                                                        | Explicit falsifier                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| For each critical capability, write the target state, observable deviation, decision owner, permitted action and recovery confirmation.  | Current signals expose state but pinned source does not connect all of them to a corrective loop.              | Every critical deviation already has a tested automatic or human loop with named ownership and verified recovery.                 |
| Separate service telemetry, control state and audit evidence, with different integrity, access, retention and failure requirements.      | Mutable refresh status, diagnostic logs and old/new-row records serve materially different assurance purposes. | One existing evidence stream satisfies all three purposes without weakening integrity, operability or privacy.                    |
| Define readiness, liveness, dependency health, data freshness and semantic correctness as distinct probes composed into consumer health. | Current health routes select different targets and can encode failure in a successful HTTP response.           | Consumers and deployment controllers require only one binary property, and that property is already measured without ambiguity.   |
| Exercise one stale-data, one dependency-failure and one corrupted-control-state scenario end to end, including detection and recovery.   | Static signal presence cannot prove detection latency, action authority or successful control.                 | The scenarios are impossible by construction and executable invariants demonstrate that impossibility at every relevant boundary. |

#### Unresolved evidence

- **Unknown:** alert routing, dashboards, signal retention, audit access policy
  and operator response practice.
- **Unknown:** whether view-manager rows can be missing, stale or concurrently
  updated in production and how that state is reconciled.
- **Unknown:** the consumer-facing definition of health and which dependencies
  are allowed to degrade independently.

---

## Lens 4: materialized-view dependency and refresh (fixed lens 36)

### Governing question

What coherent fact set must a derived projection represent, and what dependency
and release protocol proves that coherence to its consumers?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** the SQL-document validator requires materialized views to live
  in `published`, rejects references matching another materialized-view name,
  and requires a unique index
  (materialized-view requirements,
  dependency and index checks).
- **Observed:** the corresponding view validator rejects references matching
  materialized-view names
  (view dependency rule).
- **Observed:** a tracked OpenAPI support view opts out of that validation and
  joins two independently named published materialized views
  (transcript support view).
- **Observed:** runtime refresh discovery orders materialized views by name,
  selecting either all views or only those classified as uniquely indexed
  (runtime discovery).
- **Observed:** clean-database CI applies migrations, loads two fixture sets and
  runs a SQL block which refreshes every catalogued materialized view in
  schema/name order
  (CI refresh step,
  catalog refresh loop).

#### Inherited assumptions exposed

- **Inferred:** regex rejection of names in tracked SQL is a policy check, not
  an authoritative runtime dependency graph.
- **Inferred:** avoiding MV-to-MV references simplifies direct refresh ordering,
  yet a consumer view joining independently refreshed projections can still
  expose a mixed logical snapshot.
- **Inferred:** alphabetical refresh order and unique-index eligibility express
  operational convenience, not consumer-visible coherence by themselves.

### Movement 2: define the problem space

**Problem frame:** a derived read model is valuable only when it answers a
specific information need more reliably or simply than direct derivation. If it
is justified, OCE needs to know its authoritative inputs, dependency graph,
snapshot boundary, refresh trigger, terminal outcome and safe consumer switch.
The problem is not how to refresh PostgreSQL materialized views. It is how to
publish a coherent derived claim without exposing combinations that never
coexisted in an authoritative state.

This affects search, lesson reads, bulk generation and any capability composed
from multiple projections. Success may be independent per-projection release or
an atomic group, but that choice must follow consumer semantics and be visible
as a release identity rather than inferred from timestamps.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** current projections are intentionally independent
   and consumers tolerate mixed refresh times because the underlying facts
   change slowly.
2. **Candidate explanation:** the single outer refresh transaction provides the
   necessary group snapshot even though dependencies are ordered by name.
3. **Candidate explanation:** validator exceptions are narrow, reviewed
   anti-corruption points needed for public compatibility.
4. **Candidate explanation:** the absence of an executable dependency and
   release model leaves coherence as an accidental property of refresh timing.

#### Changed assumption

The initial assumption that the important graph was materialized-view-to-view
dependency changed. **Inferred:** the graph that matters connects authoritative
facts, transformations, released snapshots and consumer capabilities; SQL
objects are only one implementation of its nodes.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database Tools deliberately constrains direct projection
dependencies and performs comprehensive refreshes, which provides real
operational value. It does not statically prove the snapshot semantics of views
which compose independently refreshed outputs. OCE should preserve explicit,
testable projection releases, not the MV mechanism or naming convention.

| Warranted investigation or proposal                                                                                                     | Warrant                                                                                                          | Explicit falsifier                                                                                                             |
| --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Extract the live dependency graph from PostgreSQL catalogues and compare it with parser-derived policy and consumer query dependencies. | Regex validation and tracked SQL cannot prove deployed transitive dependencies or dynamic objects.               | Catalog, tracked definitions and consumer dependencies are identical and an automated check already prevents divergence.       |
| Define a snapshot/release identity for every justified derived model, including its input watermarks and completeness conditions.       | Timestamps and per-view status cannot prove that a multi-projection result belongs to one coherent release.      | Consumers require no cross-record or cross-projection coherence, and independent freshness is explicitly part of the contract. |
| Test whether one OCE vertical slice meets its objectives with direct authoritative reads before introducing a maintained projection.    | Existing projections show required outcomes but do not prove that precomputation is intrinsic to those outcomes. | Direct derivation fails justified objectives while a minimal derived model passes them with measured, acceptable complexity.   |
| If grouped publication is required, build it as prepare, verify and atomically expose rather than relying on traversal order.           | Name ordering is not a semantic dependency order and partial visibility is a consumer concern.                   | The datastore supplies a proved snapshot boundary that makes each intermediate refresh state unobservable to all consumers.    |

#### Unresolved evidence

- **Unknown:** the deployed `pg_depend` graph, refresh duration and whether
  consumers can observe intermediate or mixed releases.
- **Unknown:** the curriculum changes which require atomic visibility across
  projections.
- **Unknown:** whether each current projection remains justified by measured
  capability outcomes.

---

## Lens 5: online, bulk and cache consistency (fixed lens 37)

### Governing question

When the same curriculum capability is delivered live, cached or in bulk, what
does it mean for those channels to describe the same release?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** oak-openapi's lesson summary performs Hasura reads bearing a
  five-minute cache directive
  (cached lesson reads).
- **Observed:** the bulk route selects separately stored subject JSON files,
  embeds its committed schema into a streamed ZIP, and records request success
  before returning that stream to the caller
  (bulk assembly and event).
- **Observed:** the bulk-data helper named `getAllLessonData` queries the
  transcript support view with `limit: 1` and then deduplicates the returned
  rows by lesson slug
  (lesson bulk query).
- **Observed:** its storage helper returns `void`, starts a non-resumable gzip
  upload stream and reports failures only through event callbacks
  (bulk upload).
- **Observed:** OCE's bulk downloader emits a size-oriented manifest and extracts
  into the existing destination rather than publishing a validated temporary
  snapshot by atomic replacement
  ([download and manifest construction](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/scripts/download-bulk.ts#L26-L73),
  [extraction and publication](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/scripts/download-bulk.ts#L94-L164)).

#### Inherited assumptions exposed

- **Inferred:** a database projection refresh, Hasura cache entry, generated
  subject file, object-store upload, streamed archive and extracted OCE directory
  can each represent a different clock.
- **Inferred:** shared slugs and schemas do not establish that online and bulk
  channels contain the same records, relationships or release.
- **Inferred:** transport completion, successful publication and consumer-ready
  snapshot are separate outcomes.

### Movement 2: define the problem space

**Problem frame:** OCE needs either channel equivalence or explicitly different
channel semantics. A consumer must be able to identify the release, schema,
coverage, integrity and freshness of what it reads, then decide whether a live
response, cache entry and bulk snapshot may be combined. "Latest" is not a
release identifier, and individual file success is not snapshot completeness.

The harm is silent incoherence: missing subjects, relationships crossing
releases, a schema that does not describe the files beside it, or a partially
replaced local corpus. Success is an immutable, verifiable snapshot contract
with an atomic publication boundary where bulk is required, and a deliberate
freshness contract for live and cached reads.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** bulk is intentionally a best-effort convenience
   and no consumer may assume parity with the live API.
2. **Candidate explanation:** generation orchestration outside the inspected
   helpers waits for every upload and supplies the missing release boundary.
3. **Candidate explanation:** five-minute online staleness is acceptable while
   bulk is a less frequent but internally coherent curriculum snapshot.
4. **Candidate explanation:** independent delivery mechanisms have acquired an
   implicit shared contract without evidence that they remain aligned.

#### Changed assumption

The initial assumption that consistency meant making caches refresh more often
changed. **Inferred:** the decisive property is named release and combination
semantics. A deliberately older immutable snapshot can be more trustworthy than
individually fresh records from unrelated clocks.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** the chain spans database projections, cache TTLs, generated files,
object storage, streamed ZIP assembly and local extraction. Each mechanism can
be reasonable in isolation, but the pinned code does not provide one atomic,
content-verifiable release identity across them. OCE should make snapshots a
first-class contract only where consumers need offline or corpus-wide work.

| Warranted investigation or proposal                                                                                                                  | Warrant                                                                                                                  | Explicit falsifier                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| Define live, cached and bulk semantics separately, including whether records from their releases may be combined.                                    | Multiple clocks exist and no shared slug or timestamp proves channel equivalence.                                        | Every consumer uses exactly one channel per operation and no result can be combined, compared or persisted across releases.      |
| For justified bulk delivery, publish an immutable manifest with content hashes, schema digest, upstream revision, coverage, counts and completeness. | The current assembly and OCE manifest do not prove file identity, relational completeness or source release.             | The transport already supplies equivalent cryptographic identity and completeness evidence which every consumer verifies.        |
| Generate a small cross-channel conformance corpus and compare identity, cardinality, relationships, policy fields and absence semantics.             | Online and bulk paths select and transform data independently, including a helper whose plural contract queries one row. | Product semantics explicitly require divergent fields or coverage, and those differences are fully declared and consumer-tested. |
| Publish a snapshot through a temporary verified location followed by one atomic pointer or directory switch.                                         | Stream and extraction callbacks expose completion boundaries which are not the same as a ready corpus.                   | The underlying storage and extraction layer already gives readers snapshot isolation and rejects every incomplete publication.   |

#### Unresolved evidence

- **Unknown:** bulk generation orchestration, expected subject coverage,
  publication cadence and whether uploads are awaited elsewhere.
- **Unknown:** whether callers combine online and bulk data or require a stable
  corpus across a long-running computation.
- **Unknown:** acceptable freshness and staleness disclosure for each
  capability.

---

## Lens 6: query composition and amplification (fixed lens 38)

### Governing question

What total downstream work does one consumer capability cause, and is each
round trip, row and transformation necessary to its semantics?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** a lesson-summary request first executes a copyright gate; when
  blocked it makes a separate existence query, while an allowed request then
  performs the main lesson query
  (lesson request composition).
- **Observed:** gate support contains its own cached lookup from lesson slug to
  subject and unit
  (gate lookup).
- **Observed:** lesson search first calls a search function for ranked slugs,
  then constructs and sends a second query for display records before grouping
  them in application code
  (rank query,
  detail query).
- **Observed:** asset retrieval makes one GraphQL request for downloads and a
  second for attribution fields before combining them
  (asset query composition).
- **Observed:** the health surface builds one GraphQL operation containing a
  field selection for each selected resolver name
  (health fan-out).

#### Inherited assumptions exposed

- **Inferred:** multiple queries may be the correct composition of policy,
  ranking and detail capabilities; query count alone is not a defect.
- **Inferred:** a single GraphQL HTTP request can still amplify into many
  resolver, database and row operations, so transport request count is not the
  workload boundary.
- **Unknown:** actual fan-out, payload sizes, database plans, cache interactions
  and whether repeated gate/detail facts share a release.

### Movement 2: define the problem space

**Problem frame:** OCE needs capability composition whose total work is visible,
bounded and semantically necessary. The unit of analysis is the consumer
outcome, across policy checks, transport requests, resolvers, queries, rows,
decoding and post-processing. Collapsing every operation into one query can
weaken boundaries just as uncontrolled fan-out can exhaust dependencies.

Success means composition preserves policy and domain clarity while avoiding
work that scales unexpectedly with result size or graph shape. It also means a
health check does not become a high-impact workload against the system it is
trying to diagnose.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** gate, rank and detail reads are deliberately
   separate capabilities with different caching and disclosure rules.
2. **Candidate explanation:** materialized views make each additional query
   cheap and predictable, so explicit composition is clearer than a larger
   coupled projection.
3. **Candidate explanation:** GraphQL resolver naming hides repeated database
   work whose amplification grows with the registry or response graph.
4. **Candidate explanation:** current composition reflects provider internals
   which OCE can replace with stable, coarser domain capabilities.

#### Changed assumption

The initial assumption that fewer queries necessarily meant a better
architecture changed. **Inferred:** better composition minimizes unnecessary
work subject to preserving meaningful policy, consistency and ownership
boundaries, and proves the resulting workload envelope.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** oak-openapi composes useful public outcomes from several private
reads, which is evidence that the public capability is not identical to one
database object. OCE should preserve that semantic composition while making its
amplification measurable and replaceable; neither GraphQL nor a particular
query count belongs in the kit contract.

| Warranted investigation or proposal                                                                                                               | Warrant                                                                                                | Explicit falsifier                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------- |
| Trace one request per public capability through policy, transport, resolver, database, rows and transformations, recording bounded cardinality.   | Existing handlers contain visible multi-stage work while GraphQL can conceal further amplification.    | End-to-end tracing shows one bounded operation per capability and no workload grows with uncontrolled graph or result size.     |
| Express policy gates as composable domain decisions with declared required facts, then test co-location and separation against the same contract. | Gate lookups are semantically valuable but can repeat facts fetched for the main response.             | Reuse would weaken non-disclosure or consistency guarantees, and independent reads meet the resource budget with clearer proof. |
| Preserve ranked-search semantics in one capability contract while allowing retrieval strategy to change behind it.                                | Current two-stage search separates relevance ranking from record projection, a meaningful distinction. | Consumers require direct access to both stages and cannot use a stable composed search-result contract.                         |
| Give diagnostic operations their own strict work and timeout budget rather than deriving health by querying every registered data surface.        | Registry-wide checks can amplify precisely when dependencies are unhealthy.                            | The diagnostic query is constant-work, isolated and cannot consume resources required by normal or recovery traffic.            |

#### Unresolved evidence

- **Unknown:** database queries and rows induced by Hasura for each composed
  GraphQL operation.
- **Unknown:** whether rank/detail queries share snapshot semantics and preserve
  ranking order under concurrent publication.
- **Unknown:** which composition stages dominate latency or provide measurable
  consumer value.

---

## Lens 7: backup, recovery and preservation (fixed lens 39)

### Governing question

Which irreplaceable facts and histories must survive loss, and what executable
evidence proves that they can be restored into a trustworthy service?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** the local initialization workflow can export the staging
  database, download a dump, restore it and optionally refresh materialized
  views
  (initialization choices).
- **Observed:** staging export starts a Google Cloud SQL export to object
  storage and waits for the discovered running operation
  (staging export).
- **Observed:** the downloaded dump is transformed for local use by replacing
  the cloud superuser and commenting out published materialized-view refreshes
  before replacing the local dump file
  (dump transformation).
- **Observed:** local restoration removes and recreates the Docker database
  volume, loads the dump, reapplies roles and metadata, then marks migrations as
  applied
  (local restoration).
- **Observed:** generated rollback SQL drops newly added versioned objects with
  `CASCADE`; for non-versioned objects it restores the preceding migration
  definition when available
  (rollback generation,
  restoration rules).

#### Inherited assumptions exposed

- **Inferred:** a staging-to-local development seed demonstrates useful export
  and reconstruction machinery, but it is not evidence of production backup
  coverage, retention or recovery fitness.
- **Inferred:** rollback of schema objects, recovery of authoritative content,
  reconstruction of projections and preservation of audit history are different
  capabilities.
- **Inferred:** generated objects need reproducible inputs and procedures, while
  irreplaceable authored facts need durable preservation; backing both up in the
  same way is not automatically simpler.

### Movement 2: define the problem space

**Problem frame:** OCE must first classify what is authoritative and
irreplaceable, what is a reproducible derivation, and what is disposable
operational state. Recovery objectives should then follow the educational,
editorial, legal and service harm of losing or delaying each class. The concern
is not possession of a dump. It is restoration of a semantically valid system,
including identities, relationships, publication state, provenance, rights,
contracts and consumer-visible snapshots.

Success is a regularly exercised recovery argument: known source artefacts,
verified integrity, a deterministic reconstruction path, validation of restored
meaning and an explicit point at which consumers can safely resume. Preservation
may demand longer-lived, independently readable records than operational
recovery.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** production backup and recovery are fully managed
   outside these repositories, while the tracked workflow is intentionally only
   a developer bootstrap.
2. **Candidate explanation:** migration history plus source content can
   deterministically rebuild every projection, so database snapshots mainly
   shorten restoration.
3. **Candidate explanation:** audit and archive rows carry irreplaceable history
   whose guarantees differ from current curriculum records.
4. **Candidate explanation:** rollback scripts are deployment convenience, not
   a recovery strategy, and `CASCADE` effects are acceptable only before public
   use of a new version.

#### Changed assumption

The initial assumption that backup quality could be inferred from dump and
restore scripts changed. **Inferred:** the primary artefact is a recoverability
model tied to semantic authorities and harm; storage copies and rollback SQL
are implementations to test against it.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database Tools contains a practical reconstruction path for a
local database and explicit reversal rules for generated schema changes. This
is valuable evidence about reconstructability, but it does not establish
production preservation, recovery objectives or restored semantic validity.
OCE should minimize irreplaceable state and make every derivation reproducible
from content-addressed authorities.

| Warranted investigation or proposal                                                                                                                | Warrant                                                                                                                 | Explicit falsifier                                                                                                                   |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Create a recoverability ledger classifying authoritative content, history, policy, secrets, generated projections, caches and control state.       | Current restore machinery treats a database dump as a large unit while the contained facts have different value.        | All state has one identical loss, retention and restoration requirement and no derived state can be rebuilt independently.           |
| Derive recovery point and recovery time requirements from concrete harm scenarios rather than adopting infrastructure defaults.                    | No justified production objectives are present in the pinned repository.                                                | Existing governed objectives trace every state class to impact and are exercised against the actual service.                         |
| Perform a clean-room restore from preserved authorities, then run identity, relationship, publication, rights, audit and consumer-contract checks. | Loading SQL and applying metadata proves execution, not that the restored system means the same thing.                  | A lower-level datastore restore supplies and continuously verifies all of those semantic properties without additional checks.       |
| Make derived OCE artefacts reproducible and content-addressed; preserve transformation version and inputs rather than treating outputs as primary. | Materialized views, generated schemas and SDK artefacts can in principle be reconstructed, while authored facts cannot. | Reconstruction cannot meet justified recovery requirements or a required derivation is nondeterministic and cannot be made explicit. |

#### Unresolved evidence

- **Unknown:** production backup topology, retention, encryption, geographic
  independence and restore-drill results.
- **Unknown:** required preservation period and tamper-evidence for curriculum,
  rights, audit and provenance history.
- **Unknown:** whether migrations plus preserved source data reproduce all
  deployed functions, metadata, projections and consumer contracts.

---

## Lens 8: invariant enforcement placement (fixed lens 40)

### Governing question

Where can each consequential invariant be enforced once, closest to its
authority, so every write path receives the same protection and explanation?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** a database function validates allowed lifecycle values, calls a
  transition rule and validates the resulting set of states
  (state invariant).
- **Observed:** the lesson trigger identifies mutation-API writes by session
  actor and bypasses selected database character, JSON-structure and slug checks
  because the API performs its own validation
  (actor-specific validation delegation,
  bypassed JSON checks).
- **Observed:** a mutation handler checks that requested tag IDs refer to
  published tag rows before updating a lesson
  (tag reference validation).
- **Observed:** a later migration adds database exclusion constraints for lesson
  UID, title and slug, with state and cohort predicates
  (lesson uniqueness invariants).
- **Observed:** generated Hasura roles allow broad table operations with empty
  row filters and checks for selected schemas
  (role policy).

#### Inherited assumptions exposed

- **Inferred:** validation at multiple layers can be legitimate when the layers
  serve syntax, domain decision, persistent fact and user-feedback concerns.
  Calling it defense in depth does not prove that their rules correspond.
- **Inferred:** actor-dependent bypass makes the validity of a stored row depend
  on the identity and behaviour of the writer unless a deeper invariant remains.
- **Inferred:** JSON arrays containing identifiers can move referential integrity
  into application or trigger code, changing both concurrency and deletion
  semantics.

### Movement 2: define the problem space

**Problem frame:** OCE needs an invariant catalogue which distinguishes
representational validity, domain facts, workflow policy, authorization and
consumer compatibility. A fact that must hold for all durable states should be
protected at the narrowest authoritative write boundary every ingress shares.
A policy that depends on actor, intent or time belongs in an explicit domain
decision, while outer schemas should reject malformed requests early without
pretending to secure storage.

The aim is not to put every rule in a database or in TypeScript. It is to make
each rule have one semantic authority, deliberately derived enforcement points
and adversarial evidence that no alternate ingress can violate it. Success also
requires failures that users and operators can understand.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** API bypass removes expensive duplicate checks
   while Zod gives better errors and exclusive write access makes it safe.
2. **Candidate explanation:** database triggers remain necessary because Hasura
   and direct SQL are still supported mutation paths.
3. **Candidate explanation:** exclusion constraints represent a move toward
   declarative facts after trigger-only checks proved insufficient under
   concurrency.
4. **Candidate explanation:** broad role generation is intentionally paired
   with database invariants, so authorization controls capability while the
   datastore protects truth.

#### Changed assumption

The initial assumption that duplicate validation should simply be removed
changed. **Inferred:** some repetition is a useful projection of one rule for
feedback or type narrowing. The defect is independently authored meaning or a
deeper layer trusting an outer writer without an executable exclusivity proof.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** current invariants are distributed among declarative constraints,
state functions, actor-sensitive triggers, Hasura permissions and mutation
handlers. That distribution reveals the kinds of truth OCE must protect, but
not the boundaries it should copy. The truer basis is invariant authority plus
derived enforcement, tested through every ingress and under concurrency.

| Warranted investigation or proposal                                                                                                                | Warrant                                                                                                     | Explicit falsifier                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Build a field-level invariant catalogue naming semantic owner, scope, enforcement point, derivations, error and adversarial test.                  | Current rules are split across mechanisms and some are explicitly skipped by writer identity.               | Every consequential invariant already has one documented authority and exhaustive cross-ingress conformance evidence.            |
| Place unconditional durable facts in declarative datastore constraints where expressible; keep actor/time workflow policy in domain commands.      | Exclusion constraints protect concurrent uniqueness, while lifecycle and authorization need richer context. | A proposed placement cannot express the rule without harmful coupling or supplies materially worse correctness evidence.         |
| Generate outer request validators and consumer types from the authoritative rule where semantics coincide, while allowing intentional projections. | Hand-copied constraints can drift, but transport and persistence contracts are not always identical.        | Generation loses necessary boundary-specific meaning or independent authoring has stronger automated correspondence proof.       |
| Attempt invalid and racing writes through every supported ingress, including privileged and direct paths, and compare durable outcomes.            | Broad roles and actor-specific bypass mean happy-path API tests cannot prove global invariants.             | Architecture makes one write boundary physically exclusive and verifies that no alternate ingress can reach authoritative state. |

#### Unresolved evidence

- **Unknown:** every production write ingress and whether mutation-API actor
  identity is forgeable outside its intended connection.
- **Unknown:** field-level correspondence between Zod checks, triggers,
  constraints and Hasura policy.
- **Unknown:** which rules are enduring curriculum facts versus temporary
  workflow or compatibility policy.

---

## Lens 9: claims-to-evidence epistemology (fixed lens 41)

### Governing question

For every engineering claim OCE relies on, what observation would warrant it,
and what counterexample would prove the claim too strong?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** migration validation selects only newly added `up.sql` files in
  the branch diff and applies object validation to those files
  (migration validation scope).
- **Observed:** clean-database CI rebuilds migrations, loads fixtures and
  refreshes projections, then runs affected integration tests while excluding
  staging and contract test directories
  (database test evidence).
- **Observed:** affected-test selection includes directly changed tests and
  tests which statically reference entities extracted from changed migrations;
  only allowlisted test directories are indexed and parity tests are
  deliberately omitted
  (affected-test model).
- **Observed:** one materialized-view contract test catches schema assertion
  failures per row and logs them without failing the test
  (non-failing contract observation).
- **Observed:** an ADR records that a killed test process can leave pgTAP views
  installed and contaminate subsequent Drizzle introspection, motivating a
  second consumer-side filter
  (test contamination evidence).

#### Inherited assumptions exposed

- **Inferred:** "CI passes" is not one proposition. Each check supports a
  bounded claim about selected files, fixtures, paths, assertions and failure
  propagation.
- **Inferred:** a test which records counterexamples without failing may be
  valuable reconnaissance, but cannot warrant conformance.
- **Inferred:** the evidence environment can alter generated outputs, so test
  isolation and provenance are part of the proof.

### Movement 2: define the problem space

**Problem frame:** OCE's strict engineering discipline requires claims no
stronger than their evidence. "Schema valid", "migration safe", "consumer
compatible", "bulk complete" and "recoverable" each need a declared system
boundary, evidence population, oracle, failure propagation and falsifier. A
green check is trustworthy when its name and documentation state exactly that
bounded claim and stronger claims require stronger evidence.

This is not an argument to run every test on every change. Selection itself can
be excellent when the dependency model is complete and tested. The risk is
unknown exclusion presented as proof. Success is an inspectable claim-evidence
graph where skipped, advisory and sampled evidence cannot silently become a
release guarantee.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** affected testing gives complete coverage for the
   repository's explicit entity dependencies and keeps feedback focused.
2. **Candidate explanation:** contract and parity suites are intentionally
   observational because new or staging data is expected to violate incomplete
   schemas.
3. **Candidate explanation:** clean migration replay is the strongest available
   evidence for database reconstruction, while live-data compatibility belongs
   to a separate release gate.
4. **Candidate explanation:** check names and green status have gradually become
   broader claims than their actual selection and assertions warrant.

#### Changed assumption

The initial assumption that assurance meant adding missing tests changed.
**Inferred:** the prior task is to make claims precise, then choose the smallest
independent evidence set capable of falsifying them. Some existing checks may be
excellent for narrower claims than their consumers currently infer.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database Tools has meaningful defense layers: migration replay,
object policy, affected tests, contract observations and explicit handling of
test-environment contamination. Their selection and failure semantics mean they
do not collectively prove every schema or live-data claim. OCE should treat
assurance as a typed relationship between claim and evidence.

| Warranted investigation or proposal                                                                                                                | Warrant                                                                                                          | Explicit falsifier                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Maintain a claim-evidence register for every release gate: claim, boundary, oracle, population, exclusions, provenance and failure mode.           | Existing workflows differ materially in file selection, test selection and whether counterexamples fail.         | Every check already exposes machine-readable scope and no downstream decision relies on a stronger interpretation.                |
| Test the affected-test selector itself with mutation fixtures that alter indirect dependencies, dynamic SQL, permissions and generated contracts.  | Static name/reference mapping can be excellent only if its dependency model is complete for the claims it gates. | The selector is mechanically derived from a total dependency graph and mutation tests find no reachable omitted evidence.         |
| Split exploratory observations from release assertions in names, output and exit status; never aggregate advisory evidence into a green guarantee. | One contract test deliberately swallows assertion failures, while other workflows exclude that suite.            | No release, consumer or operator treats the observational result as conformance and its advisory status is impossible to misread. |
| Use independent oracles for high-consequence transformations, including runtime replay rather than only comparing generated files to themselves.   | Shared generators and contaminated environments can make two artefacts agree while both are wrong.               | A single implementation is formally or mechanically sufficient and the independent oracle adds no new falsification power.        |

#### Unresolved evidence

- **Unknown:** branch protection and which checks are required for each release
  path.
- **Unknown:** false-negative history for affected-test selection and whether
  advisory failures have reached consumers.
- **Unknown:** the explicit claims reviewers and downstream repositories infer
  from current check names.

---

## Lens 10: fixture and test-data representativeness (fixed lens 42)

### Governing question

Which evidence populations are capable of exposing the semantic, structural
and operational failures claimed by each test?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** the primary fixture file contains deliberately synthetic
  published subjects such as Transfiguration, Charms and Potions, plus test
  programmes and units in a named cohort
  (synthetic dimensions,
  synthetic curriculum records).
- **Observed:** the programme-factor fixture identifies itself as a PostgreSQL
  dump and contains dated, recognizable exam-board, key-stage, phase and subject
  dimension records
  (dump provenance,
  dimension sample).
- **Observed:** clean-database CI loads both fixture files before refreshing all
  materialized views
  (fixture loading).
- **Observed:** the documented local environment instead restores a staging
  export into the local database before applying migrations
  (local staging seed).
- **Observed:** the same CI workflow excludes staging and contract test suites
  from its affected integration-test invocation
  (excluded evidence populations).

#### Inherited assumptions exposed

- **Inferred:** synthetic scenarios, copied reference dimensions, a staging
  snapshot and production traffic are distinct evidence populations with
  different provenance, coverage, age, privacy and reproducibility.
- **Inferred:** realistic names do not make data representative, and deliberately
  artificial fixtures can be superior evidence for boundary cases and minimal
  causal explanations.
- **Inferred:** loading fixtures through every migration and projection is strong
  reconstruction evidence for those rows, but cannot by itself warrant
  compatibility with unrepresented shapes or cardinalities.

### Movement 2: define the problem space

**Problem frame:** OCE should choose test data from the failure claim, not from a
generic desire to resemble production. Domain rules need minimal named
counterexamples; compatibility needs representative value shapes and absence
states; migrations need historical schema/data transitions; performance needs
cardinality and skew; privacy and security need adversarial inputs. Every corpus
must state origin, intended coverage, transformations, age and permissible use.

The danger is both false confidence and accidental coupling: tests pass over a
small happy graph, or fixtures encode today's identifiers and turn them into
framework assumptions. Success is layered evidence which remains reproducible
and intelligible while sampled live data, where justified, challenges the model
without becoming the source of expected behaviour.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** fantasy fixtures deliberately make accidental
   production coupling obvious and cover a designed relational scenario set.
2. **Candidate explanation:** copied programme-factor rows supply stable domain
   vocabulary whose combinatorics would be costly to hand-author accurately.
3. **Candidate explanation:** staging-backed local work catches compatibility
   gaps which deterministic CI cannot, with separate manual suites carrying
   that evidence.
4. **Candidate explanation:** the fixture sets grew around specific tests and
   no current coverage model says which semantic or statistical classes they
   represent.

#### Changed assumption

The initial assumption that fixtures should become more production-like
changed. **Inferred:** excellence requires purpose-built evidence populations.
Production samples are useful for discovery and compatibility, while minimal,
generated and adversarial corpora are often better for deterministic proof.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database Tools sensibly uses both synthetic and historically
sourced data, and developers can work against a staging-derived database. The
pinned source does not map those populations to explicit claims or show their
coverage of state, relationship, nullability, rights and scale classes. OCE
should preserve the plurality while making each corpus's epistemic role explicit.

| Warranted investigation or proposal                                                                                                              | Warrant                                                                                                           | Explicit falsifier                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Catalogue every test corpus by provenance, age, privacy class, transformations, intended claims and known exclusions.                            | Current fixture and staging populations differ materially but their claim boundaries are not encoded together.    | Every test already selects a documented corpus whose provenance and coverage exactly match its assertion.                     |
| Derive a minimal scenario matrix from the invariant and lifecycle models, including absent, null, duplicate, retired and conflicting placements. | Hand-authored happy graphs cannot establish coverage of consequential semantic states.                            | Model-based coverage shows the existing deterministic fixtures exercise every relevant equivalence class and transition.      |
| Generate high-cardinality, skewed and adversarial data from domain constraints for operational tests rather than enlarging semantic fixtures.    | Performance and robustness require distributions that a readable domain scenario set need not carry.              | Production bounds are invariant, small and uniform, and executable constraints prove generated stress shapes are impossible.  |
| Add a governed compatibility lane over de-identified representative snapshots, reporting drift separately from deterministic correctness.        | Staging-derived evidence can expose unmodelled values, but its mutability makes it unsuitable as the only oracle. | No external data shape can differ from generated constraints, and conformance is already proved at ingestion for all records. |

#### Unresolved evidence

- **Unknown:** fixture design documentation, coverage metrics and the dates and
  transformations of all copied data.
- **Unknown:** production distributions for nulls, graph degree, state
  combinations, legacy cohorts, rights fields and large payloads.
- **Unknown:** privacy governance for staging-derived development data.

---

## Lens 11: generated and manual drift (fixed lens 43)

### Governing question

Can every derived artefact be reproduced from an identified semantic authority,
and can change be classified by compatibility rather than mere textual difference?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** Database Tools reconciles schema-document SQL against the
  highest matching migration version; for equal versions with different
  normalized SQL it chooses the migration definition
  (reconciliation policy).
- **Observed:** its Drizzle freshness check runs only when branch differences
  include a migration path; inability to determine branch or diff returns the
  same `false` result as no migration change
  (change detection,
  regeneration comparison).
- **Observed:** OCE code generation defaults to a committed OpenAPI cache, but
  switches to live upstream input automatically for a Vercel build
  ([schema-source decision](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/resolve-schema-source.ts#L4-L16),
  [source implementation](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/resolve-schema-source.ts#L34-L40)).
- **Observed:** OCE's schema-drift command describes itself as advisory and
  always successful, including when upstream fetch fails; its evaluator compares
  canonicalized JSON values without classifying compatibility
  ([advisory contract](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/agent-tools/src/ci/ci-schema-drift-check.ts#L1-L7),
  [failure and drift reporting](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/agent-tools/src/ci/ci-schema-drift-check.ts#L93-L127),
  [comparison semantics](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/agent-tools/src/ci/ci-schema-drift-eval.ts#L38-L74)).
- **Observed:** OCE's bulk Zod generator writes code assembled from authored
  template constants, including an explicit list of fields and sentinel
  differences, rather than reading the bulk archive's included JSON Schema
  ([bulk generator](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/generate-bulk-schemas.ts#L38-L75),
  [authored deltas](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/schema-templates.ts#L10-L35)).

#### Inherited assumptions exposed

- **Inferred:** "generated" describes how a file was emitted, not whether its
  semantics came from an authoritative source. A template generator can merely
  relocate manual policy.
- **Inferred:** the same OCE commit can select cached or live upstream schema by
  build environment, so source revision alone does not identify generated
  output.
- **Inferred:** textual drift can be harmless prose, additive compatibility,
  narrowing, removal or policy change; one boolean does not support all release
  decisions.

### Movement 2: define the problem space

**Problem frame:** OCE needs reproducible semantic correspondence across every
authority-to-projection edge. Each generated artefact must identify exact input
content, transformation version, options and intentional loss policy. Generation
should be hermetic for a release and idempotent for a source tree; upstream
change should enter through an explicit acquisition and compatibility decision,
not an environment-dependent build.

Manual artefacts remain appropriate when humans own meaning, but they should be
named as authorities or overlays and checked against what they claim to mirror.
Success is not a perpetually clean Git tree. It is the ability to explain every
difference, reproduce every release and fail on unsupported semantic loss.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** live generation on Vercel deliberately ensures
   deployed clients track the freshest provider contract, while committed cache
   keeps local work reproducible.
2. **Candidate explanation:** advisory drift is appropriate because upstream
   changes require human compatibility review rather than automatic rejection.
3. **Candidate explanation:** bulk templates are an intentional consumer
   projection whose semantics differ from the archive schema and therefore
   require human authorship.
4. **Candidate explanation:** multiple bidirectional and environment-sensitive
   generation paths make provenance and authority ambiguous.

#### Changed assumption

The initial assumption that generated artefacts should replace manual ones
changed. **Inferred:** excellence comes from an explicit authority and a total,
reproducible transformation. Human-owned policy should stay manual and visible;
mechanical repetition should be generated and proved.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** both Database Tools and OCE have valuable automation, but also
arbitration, conditional regeneration and authored transformation policy. Their
weakest shared basis is the word "generated"; their strongest potential basis
is a provenance-bearing transformation graph. OCE should make acquisition a
reviewed input change and make builds pure over that input.

| Warranted investigation or proposal                                                                                                                     | Warrant                                                                                                                     | Explicit falsifier                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Separate upstream acquisition from hermetic generation; pin content digest and revision, then produce identical artefacts in every environment.         | Cached local and live Vercel inputs can make the same source commit produce different outputs.                              | Environment-dependent generation is an explicit product requirement and every deployed artefact records and verifies its input.      |
| Add provenance manifests and an idempotent regenerate-and-diff gate for every committed derivative, failing closed when prerequisites cannot be read.   | Current checks can skip on missing Git evidence and output files do not inherently reveal all transformation inputs.        | Reproduction from a release identifier already yields byte-identical outputs and failed prerequisites cannot result in a release.    |
| Introduce a semantic compatibility classifier for request, response, status, security, bulk and projection changes, with golden counterexamples.        | Canonical JSON difference cannot distinguish prose from a breaking change or explain consumer impact.                       | All drift has identical release consequences and no consumer projection narrows or transforms the upstream contract.                 |
| Represent authored overlays as named inputs with ownership, rationale and removal/conformance tests rather than embedding them invisibly in generators. | OCE bulk templates and other codegen stages introduce consumer-specific semantics not derivable from upstream syntax alone. | Every authored value is already authoritative for its target capability and cannot plausibly be mistaken for derived upstream truth. |

#### Unresolved evidence

- **Unknown:** deployed build configuration and whether production actually
  exercises the Vercel live-input branch.
- **Unknown:** generated-tree idempotence, provenance and compatibility gates in
  release infrastructure outside the pinned source.
- **Unknown:** ownership and intended lifetime of every authored transformation
  override.

---

## Lens 12: runtime and consumer conformance (fixed lens 44)

### Governing question

Does observed provider behaviour satisfy the declared capability contract at
every transport, generated client and tool boundary without silent narrowing or
loss?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** oak-openapi protection can raise a rate-limit error and emit
  limit/reset headers, while the shared declared error-response map lists only
  400, 401 and 404
  (runtime rate limit,
  declared errors).
- **Observed:** the OpenAPI-facing lesson-asset procedure returns `undefined`
  against a generated `z.any()` response, while a separate route streams files,
  redirects video, proxies upstream statuses and handles range-related bodies
  (contract stub,
  generated response,
  runtime stream and redirect).
- **Observed:** OCE's OpenAPI-to-Zod adapter forces strict object validation and
  treats unspecified additional-properties behaviour as closed
  ([strict response schemas](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/core/openapi-zod-client-adapter/src/generate-zod-schemas.ts#L58-L90)).
- **Observed:** OCE's MCP generation explicitly skips lesson search, transcript
  search and binary asset paths, ignores referenced operation parameters, and
  extracts only inline operation-level path/query parameters
  ([skipped operations](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts#L28-L35),
  [parameter projection](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts#L62-L85),
  [reference and location handling](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts#L134-L157)).
- **Observed:** OCE response augmentation applies only to successful JSON GETs
  and returns the original response when parsing, schema matching or URL
  augmentation fails
  ([augmentation boundary](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts#L27-L69),
  [best-effort failure](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts#L85-L112)).

#### Inherited assumptions exposed

- **Inferred:** provider runtime, served OpenAPI, generated transport client,
  runtime validator, SDK augmentation and MCP tool are distinct contracts even
  when all originate from one document.
- **Inferred:** strict response objects can turn a normally compatible additive
  provider field into a consumer failure when upstream did not explicitly close
  the object.
- **Inferred:** unsupported operations and constructs can be legitimate, but
  silent omission is not conformance; it creates a smaller capability surface
  which needs an explicit contract.

### Movement 2: define the problem space

**Problem frame:** OCE aims to enable additional consumers, so the kit must
preserve public capability meaning through every adapter. A contract compiler
must represent or explicitly reject operations, media types, parameters,
constraints, statuses, headers, links, errors and security. Runtime conformance
must be observed at the actual deployed boundary, including binary and streaming
responses, then replayed through each generated consumer surface.

Success does not mean mirroring every provider quirk. It means stable OCE domain
capabilities with a lossless transport model beneath them, explicit adaptation
above them, and one failure vocabulary that never silently returns an
unvalidated shape as though it satisfied a stronger contract.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the asset stub is a necessary documentation bridge
   for a route that the tRPC/OpenAPI generator cannot execute.
2. **Candidate explanation:** MCP intentionally exposes only agent-suitable
   operations and substitutes separate search capabilities, so omissions are
   product policy rather than generator loss.
3. **Candidate explanation:** strict output validation deliberately detects any
   upstream addition until OCE reviews and republishes its supported projection.
4. **Candidate explanation:** the nominal one-source pipeline obscures several
   independently authored and differently permissive runtime contracts.

#### Changed assumption

The initial assumption that sharing OpenAPI was sufficient for conformance
changed. **Inferred:** conformance is an executable relation among observed
runtime behaviour, a semantically competent declaration and each consumer
projection. Generation supplies candidates for that relation, not proof.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** the chain provides valuable public descriptions and substantial
generation, but known runtime-only statuses, an opaque binary contract,
strictness added downstream, skipped operations and best-effort augmentation
mean no single artefact describes every consumer outcome. OCE should build a
contract compiler which fails on unrepresented semantics, then expose stable
capabilities whose transport remains replaceable.

| Warranted investigation or proposal                                                                                                                       | Warrant                                                                                                                   | Explicit falsifier                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| Build a lossless internal contract representation and require each upstream construct to be represented, deliberately adapted or rejected with rationale. | Current MCP and binary paths omit or weaken constructs while still appearing in one generated pipeline.                   | The supported OpenAPI subset is already complete for every required OCE capability and omissions are machine-checked policy.          |
| Run black-box conformance matrices over representative success/error statuses, headers, media, streaming and malformed responses through SDK and MCP.     | Static schemas cannot establish served runtime behaviour or downstream validator and augmentation outcomes.               | Provider deployment and every consumer adapter are generated from one executable contract and existing end-to-end tests prove parity. |
| Preserve unknown response fields unless the authoritative provider contract explicitly closes the object; keep request validation strict by default.      | OCE currently narrows unspecified response objects, making additive fields a possible compatibility break.                | Consumers require a deliberately closed projection and the boundary contract explicitly promises rejection of all additional fields.  |
| Give every generated consumer a typed transport result containing status, data/error, headers, links and trace identity before domain adaptation.         | Rate-limit and pagination/retry semantics can live in headers, while generated tool execution can otherwise discard them. | No required capability decision depends on response metadata and raw headers would expose only unstable provider detail.              |
| Treat MCP, SDK and bulk as explicit capability projections with coverage manifests and conformance tests, not as automatic synonyms for the HTTP API.     | Operations, constraints and fields are intentionally transformed or omitted for each surface.                             | Every surface is demonstrably isomorphic to the provider contract and has no independently authored semantics.                        |

#### Unresolved evidence

- **Unknown:** live served OpenAPI and payload conformance, including all
  statuses, headers, binary media and edge cases.
- **Unknown:** which omitted operations and narrowed fields are deliberate OCE
  product decisions versus generator limitations.
- **Unknown:** behaviour of direct SDK, augmented SDK and MCP consumers when an
  additive field, undocumented status or malformed payload is replayed.

---

## Cross-lens synthesis

The twelve perspectives converge on a smaller set of operational concepts than
the present mechanism count suggests:

1. **Named capability outcome:** request acceptance, durable command, projection
   release, bulk publication and consumer receipt are separate facts.
2. **Authority and invariant:** each consequential claim needs one competent
   semantic owner, deliberately projected enforcement and adversarial proof.
3. **Release and provenance:** derived data and generated code need exact input,
   transformation, completeness and compatibility identity.
4. **Bounded work and fault domain:** the consumer capability, not the process,
   query or table, defines resource and recovery boundaries.
5. **Claim-bearing evidence:** telemetry, tests, fixtures, audit and recovery
   drills warrant different, explicitly limited propositions.
6. **Explicit projection:** SDK, MCP, bulk and online APIs may differ, but every
   loss or addition must be governed and conformance-tested.

The negative space is equally consistent. Pinned source does not establish
production workload, live dependency graphs, operational response, recovery
fitness, data representativeness or end-to-end runtime conformance. OCE should
not fill those spaces with copied infrastructure or confident defaults. It
should turn them into executable discovery probes, then retain only mechanisms
which prove a required outcome more simply than the alternatives.

The resulting architectural basis is mechanism-open: stable domain
capabilities; explicit command and query outcomes; authoritative invariants;
immutable, content-addressed contract and data inputs; pure reproducible
transformations; snapshot publication where corpus coherence is required;
typed transport metadata; and assurance expressed as claims with falsifiers.
PostgreSQL, materialized views, GraphQL, REST, object storage, caches and
generators remain eligible implementations, never premises.
