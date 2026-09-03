# Database-Tools and oak-openapi authority-chain deconstruction

## Status and purpose

**Status:** historical investigation snapshot

**Opened:** 2026-07-19

**Source revisions:**

- Database-Tools:
  `SHA: 3d1eff31a398189a839ae68bcf69990089c31bd2`
  (`v2.15.0-1-g3d1eff31`; clean at investigation open)
- oak-openapi:
  `SHA: 2fb1383bfeaeb4986ec29cef97be133b69baeef5`
  (`v0.5.0-2fa4d6b-522-g2fb1383`; clean when added to the investigation)

**Target beneficiary:** Oak Open Curriculum Ecosystem (OCE) and the Oak
Innovation Kit

**Private-source citations:** Database-Tools and oak-openapi are private Oak
repositories. In this public projection their pinned source permalinks are
reduced to plain-text citations; resolve them via the stable index in the
private master (`web-app-deconstruction/docs/oce-projection-and-private-source-index.md`).
See the record README's publication note for detail.

This investigation recovers what the Database-Tools to oak-openapi authority
chain enables, which knowledge and obligations it encodes, where truth and
authority actually live, how database claims become a public contract and then
OCE capability, and which complexity is essential, chosen, accidental,
compensating or still unknown. It does not propose repairs to either source
repository and does not presume that OCE should copy their database, Hasura,
API, package, deployment or repository shapes.

The governing question is:

> What human, curriculum, service, information and operational outcomes depend
> on the chain from authored database state through published projections and
> the Oak Open Curriculum API into OCE, and what is the smallest truthful set of
> concepts, authorities, transitions, contracts and evidence an excellent Oak
> ecosystem must preserve after every current mechanism is open to challenge?

The bounded chain under investigation is:

`database and publication model -> SQL views and materialized views -> Hasura`
`GraphQL -> oak-openapi queries and handlers -> Zod/OpenAPI public contract ->`
`OCE schema acquisition and code generation -> SDK, MCP and application value`.

The arrows are hypotheses about transformations and dependencies, not a claim
that authority should flow in one direction or that each current node should
survive.

## Evidence contract

All source claims must be tied to the relevant immutable revision above. Each
substantive statement is labelled:

- **Observed:** directly established by pinned source, configuration, generated
  artefact, test or Git history;
- **Inferred:** a bounded interpretation which names its supporting
  observations;
- **Unknown:** material evidence which is absent from the repository; or
- **Proposition:** a falsifiable explanation or OCE-facing claim.

Source existence is not outcome evidence. A migration does not establish that it
ran in production; metadata does not establish applied permissions; a test does
not establish release enforcement; a schema does not establish semantic
authority; telemetry does not establish control; documentation does not
establish current consumer behaviour.

Generated files are evidence of a pipeline output. The investigation must trace
their generator, inputs, transformations and regeneration/release path before
treating them as an authority.

Both source checkouts were kept read-only. Research records remain in this
corpus; the retired inventories, fixtures and experiments are described in the
[evidence-harness provenance](../../../evidence-harness-provenance.md).

## OCE workflows used during the investigation

The investigation uses the pinned OCE revision already recorded by this research
repository:
[`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

| Workflow                        | Adaptation for this investigation                                                                                                                                                                                                          |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `start-right-thorough`          | Pin source and research state, make the work shape durable before analysis, re-ground at each major boundary, and validate one gate at a time. OCE collaboration-state mutation is not imported into this repository.                      |
| `under-the-hood`                | Trace representative outcomes through clients, transport, auth, schemas, handlers, SQL, triggers, views, refresh, deployment and observations; inspect generators behind generated artefacts.                                              |
| `working-with-graphs`           | Build complete bounded graphs for workspaces, SQL objects, projections, schema generation and consumers. Bounds are structural, never arbitrary top-N truncation.                                                                          |
| `concept-exploration`           | Run all four movements for every retained lens: raw observation and inherited assumptions; mechanism-neutral problem; reopened explanations; warranted synthesis with falsifiers and unresolved evidence.                                  |
| `metacognition` and `reason`    | Treat fluent architectural explanations as hypotheses, retain the observation-to-model reliability ladder, and make every proposal falsifiable.                                                                                            |
| `ground-truth` discipline       | Use known-answer-first probes where executable comparison is appropriate. Search-specific ground-truth design/evaluation rules are not applied to a database investigation.                                                                |
| `gates` and reviewer discipline | Validate research links, structure, reproducibility, formatting and tests sequentially; use independent adversarial review before synthesis is accepted. Database-Tools' own gates describe its assurance surface but will not be changed. |
| `curator-pass`                  | At synthesis boundaries, route stable findings into current-state maps, capability coverage, hypotheses, premise records or teaching material rather than leaving them only in a journal.                                                  |

## Initial source topology

The root documentation describes six workspaces. This is an initial routing map,
not yet a finding about enduring boundaries.

| Surface                 | Declared role                                                         | Authority questions to resolve                                                                                     |
| ----------------------- | --------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `hasura-engine`         | PostgreSQL migrations, seeds and Hasura metadata/deployment           | Which objects, permissions and publication contracts are authoritative; what is applied per environment?           |
| `database-tools`        | SQL schema docs, fixtures, tests, experiments and operational scripts | Are schema docs source, projection or bidirectional peer; which checks establish which claims?                     |
| `oak-curriculum-schema` | Published Zod/TypeScript contracts plus introspected Drizzle schemas  | Which database, API and consumer meanings are canonical; how do manual and generated models correspond and evolve? |
| `mutation-api`          | Direct Hono/Drizzle mutation boundary and authoring business logic    | Which writes bypass Hasura, who may perform them, what state machine and acknowledgement they implement?           |
| `oak-mv-triggers`       | Authenticated materialized-view refresh function                      | What freshness promise exists, how refresh order/concurrency/failure work, and who observes completion?            |
| `hasura-auth`           | Hasura authentication webhook                                         | How identity, API keys, roles and row/operation permissions compose across deployed boundaries?                    |

Declared clients include the curriculum API, website, Aila, internal tools and
Create Squad. Their actual versions, query/mutation use, outcome requirements,
failure tolerance and ownership remain external evidence.

The expanded boundary adds these initially observed surfaces. They are routing
categories, not endorsed architecture.

| Surface                                       | Declared or observed role                                                                                                                       | Authority questions to resolve                                                                                             |
| --------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Database-Tools Open API views and MVs         | Published database projections exposed through Hasura                                                                                           | Which projection is used by which endpoint; what meaning, identity, version and freshness promise does each name encode?   |
| `oak-openapi/src/lib/owaClient.ts`            | Central GraphQL client and resolver/materialized-view name registry                                                                             | Does central naming establish a contract or merely concentrate coupling; how are schema and deployed resolver checked?     |
| `oak-openapi/src/lib/handlers`                | Endpoint queries, composition, transformation, gating and input/output validation                                                               | Which domain decisions live here, which are compensations for projections, and which output claims are independently true? |
| `oak-openapi/src/lib/zod-openapi`             | Public schema decoration and OpenAPI document generation                                                                                        | What is authored, transformed, generated or duplicated; can the public contract be reproduced without manual synchrony?    |
| `oak-openapi/src/app/api`                     | Next.js transport, tRPC-to-OpenAPI adapter, health, bulk and administration routes                                                              | Which HTTP, error, streaming, authentication and operational semantics are stable contract versus framework consequence?   |
| oak-openapi Redis, Sanity, GCS and direct SQL | Rate-limit/account state, documentation, bulk assets and selected non-Hasura data access                                                        | Why does one public product compose several authorities; what consistency, privacy and failure semantics result?           |
| OCE schema and SDK pipeline                   | Uses a committed OpenAPI cache by default; explicit online and Vercel modes can fetch live, then generate types, validators, URLs and MCP tools | Which upstream details become OCE authority; which semantics are absent from OpenAPI and therefore authored elsewhere?     |
| OCE SDK, MCP and applications                 | Turn generated transport contracts plus authored knowledge into reusable capability                                                             | Which valued outcomes require richer concepts than endpoints; where does upstream drift become downstream failure?         |

## Investigation sequence

The sequence is ordered by evidence dependency, not delivery cost.

1. **Repository and history atlas.** Classify every tracked source family,
   workspace, generator, deployment surface and decision record in both source
   repositories; quantify language/object/test/migration/endpoint structure and
   sample co-change history.
2. **Authority and information model.** Reconstruct PostgreSQL schemas, tables,
   views, materialized views, functions, triggers, metadata, relationships,
   permissions, versioning, identity, provenance and lifecycle as bounded graphs.
3. **API projection and contract correspondence.** Trace database objects
   through Hasura resolver names, oak-openapi GraphQL queries and transformations,
   handler input/output Zod schemas, generated OpenAPI metadata and the served
   document. Trace every manual or generated representation to its inputs and
   regeneration gate.
4. **OCE consumption correspondence.** Trace schema acquisition through OCE
   code generation into transport types, validators, URL helpers, MCP tools,
   authored domain knowledge and applications. Identify what the public contract
   can and cannot carry.
5. **Mutation journeys.** Trace representative create, update, asset workflow,
   approval, publication and error/recovery paths from request to durable state,
   audit record, derived projection, public endpoint and OCE observation.
6. **Freshness and control.** Trace materialized-view dependencies, refresh
   triggering, ordering, uniqueness/concurrency assumptions, cron/manual paths,
   cache behaviour, health evidence, status, failure reporting and downstream
   observation.
7. **Trust, operation and evolution.** Examine authentication, authorization,
   secrets, transactions, concurrency, performance, recovery, migrations,
   rollback, API keys, rate limits, deployment, observability, assurance,
   ownership, release and provider portability.
8. **Multi-lens concept exploration.** Run and record every warranted lens in the
   register below, collapsing only those which do not change the protected
   subject, authority, unit, failure signal, horizon or falsifier.
9. **Cross-system synthesis.** Identify common threads, negative space,
   contradictions, essential distinctions, compensating mechanisms, premises to
   challenge, OCE implications and decisive next evidence without selecting an
   architecture prematurely.
10. **Adversarial closure.** Reconcile every register row, validate every pinned
    source link and generated measurement, independently audit claims and limits,
    then route findings into the research index and capability ledger.

## Initial lens register

The register is intentionally broader than database technology. A lens survives
only if its full pass changes the problem frame or evidence required.

| Family            | Lens                                                      | Distinguishing question                                                                                   |
| ----------------- | --------------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| Purpose and value | Teleology and jobs-to-be-done                             | What human, curriculum or service progress is the data system actually for?                               |
| Purpose and value | Educational validity                                      | Which database claims participate in valid curriculum or assessment inference?                            |
| Purpose and value | Teacher/editor workflow                                   | What human work, recovery and judgement are enabled, displaced or hidden?                                 |
| Purpose and value | Pupil capability and safeguarding                         | Which data states or projections affect vulnerable users, agency and harm?                                |
| Purpose and value | Public value, equity and commons                          | How do publication and reuse become equitable capability and sustainable public benefit?                  |
| Purpose and value | Public API product and developer progress                 | What can an external builder accomplish, and which contract qualities make that progress dependable?      |
| Semantics         | Domain ontology and bounded authority                     | Which kinds, invariants and meanings exist, and who is competent to define them?                          |
| Semantics         | Curriculum graph identity                                 | How do concept, placement, sequence, version, slug, record and projection identities differ?              |
| Semantics         | Epistemic state and data quality                          | How are absent, unknown, invalid, duplicate, stale, disputed and withdrawn facts represented?             |
| Semantics         | Provenance, lineage and transformation loss               | Can every consequential claim be traced to source, transformation and discarded meaning?                  |
| Semantics         | Search/read-model relevance                               | Which projections exist for which information need, and what makes them fit for use?                      |
| Time and state    | Lifecycle, publication and retirement                     | What are the independent lifecycles of authored data, approval, publication, projection and support?      |
| Time and state    | State machines and temporal logic                         | Which histories make a visible state valid?                                                               |
| Time and state    | Transactions and consistency                              | Where are atomicity and consistency required, and where are they only assumed?                            |
| Time and state    | Concurrency, idempotency and ordering                     | What happens under duplicate, delayed, reordered and competing operations?                                |
| Time and state    | Freshness and distributed clocks                          | Which source, cache, MV, package and observer clocks govern a claim?                                      |
| Time and state    | Failure semantics and partial success                     | Which failures preserve useful outcomes, uncertainty, recovery and truthful acknowledgement?              |
| Contracts         | Schema correspondence and generation                      | How do PostgreSQL, SQL docs, Hasura, Drizzle, Zod, OpenAPI and consumer types correspond?                 |
| Contracts         | GraphQL and read contracts                                | What source, runtime, permission, freshness and compatibility promise does Hasura expose?                 |
| Contracts         | Mutation API contracts                                    | What semantic operation, validation, authority, commit and response does each route promise?              |
| Contracts         | Package/consumer contracts                                | What does the published schema package make stable for which consumers?                                   |
| Contracts         | OpenAPI document authority and reproducibility            | Can every served operation, schema, example and error be regenerated from named authorities?              |
| Contracts         | Endpoint semantic coherence                               | Do operation boundaries, names and response units reflect domain work rather than query convenience?      |
| Contracts         | OCE code-generation correspondence                        | Which API claims survive into types, validators, tools and applications, and where are they altered?      |
| Contracts         | Interoperability and representation                       | Which casing, format, protocol and channel transformations preserve meaning?                              |
| Contracts         | Transport, status and error semantics                     | Which HTTP, tRPC and stream behaviours let consumers distinguish absence, denial, invalidity and failure? |
| Trust             | Authentication and capability security                    | Which principal can exercise which operation on which referent, through what delegation?                  |
| Trust             | Authorization and policy placement                        | Are role, row, workflow and state-dependent policies aligned with competent authority?                    |
| Trust             | Privacy, retention and data dignity                       | What person-linked data exists, for what purpose, lifetime, access, correction and disposal?              |
| Trust             | Auditability, accountability and remedy                   | Can a consequential decision be reconstructed, challenged, corrected and attributed?                      |
| Trust             | Legal, licensing and content restrictions                 | How do rights and restrictions survive mutation, projection, export and retirement?                       |
| Trust             | API-key, rate-limit and abuse policy                      | Are identity, quotas and remedies fair, explicit, privacy-preserving and fit for public reuse?            |
| Operations        | Reliability and fault containment                         | Which outcomes survive database, provider, refresh, deployment and consumer failure?                      |
| Operations        | Performance, queueing and resource budgets                | What deadlines, contention, connection and refresh costs govern valued outcomes?                          |
| Operations        | Observability and control                                 | Which claim-to-signal-to-authorised-action loops actually close?                                          |
| Operations        | Materialized-view dependency and refresh                  | What dependency order, snapshot semantics and convergence guarantee make read models truthful?            |
| Operations        | Online, bulk and cache consistency                        | When do endpoint, Redis, generated catalogue and bulk-export answers legitimately differ?                 |
| Operations        | Query composition and amplification                       | Which endpoint request becomes how many database, storage or third-party operations under load?           |
| Operations        | Backup, recovery and preservation                         | What can be restored or historically reconstructed, with what authenticity and lawful bounds?             |
| Assurance         | Invariant-enforcement placement                           | Which constraints live in PostgreSQL, triggers, Hasura, Zod, handlers, tests or convention, and why?      |
| Assurance         | Claims-to-evidence epistemology                           | What does each unit, pgTAP, integration, contract, fixture and deployment check really prove?             |
| Assurance         | Fixture and test-data representativeness                  | Which valid, invalid, boundary and historical states are absent from the evidence?                        |
| Assurance         | Generated/manual drift                                    | Where can parallel representations diverge despite local correctness?                                     |
| Assurance         | Contract conformance and consumer compatibility           | Does runtime output conform to the served schema, and do upstream changes preserve real OCE uses?         |
| Evolution         | Migration, rollback and expand/contract                   | How do old/new models coexist, and what makes change safe or irreversible?                                |
| Evolution         | Versioning and compatibility                              | What do table/view/MV, schema package and API versions mean to consumers?                                 |
| Evolution         | Coupling and change propagation                           | Which boundaries predict co-change by reason rather than folder?                                          |
| Evolution         | Endpoint and schema deprecation                           | How can database, API and generated consumers coexist through semantic change without hidden forks?       |
| Evolution         | Product-line and environment variability                  | Which differences are legitimate profiles, deployment bindings or accidental drift?                       |
| Evolution         | Supply chain and vendor portability                       | Can semantics, data and operation move beyond Hasura, PostgreSQL, GCP, Vercel and npm?                    |
| Evolution         | Sustainability and resource externalities                 | What whole-lifecycle resource use and operational labour accompanies each outcome?                        |
| Institutions      | Ownership, Conway forces and incentives                   | Do decision, maintenance and incident responsibilities match semantic authority?                          |
| Institutions      | Curriculum contestability                                 | Who may challenge a data claim, how is it decided, and how do corrections propagate?                      |
| Institutions      | Consumer cognition and teachability                       | Can consumers use and diagnose contracts without repository or database archaeology?                      |
| Institutions      | Kit boundary and ecosystem enablement                     | Which invariants should OCE encode, expose, generate or deliberately leave to products?                   |
| Meta              | Essential, chosen, accidental and compensating complexity | Which machinery protects an independent obligation, and which compensates for another system choice?      |
| Meta              | System-collapse and premise challenge                     | Could policy, authority, workflow or data-model changes remove several current systems at once?           |
| Meta              | Reversibility and option value                            | Which choices should remain adaptable, and which require explicit finality?                               |
| Meta              | Conceptual basis and negative space                       | Which few concepts explain the estate, and what important reality is missing from its source?             |

## Planned durable records

This index will link records as they are created. Planned boundaries may change
when evidence shows a better decomposition.

- repository, workspace and history atlas;
- database authority and information model;
- database-to-API projection and contract correspondence;
- oak-openapi runtime, policy and API-product atlas;
- API-to-OCE generation and consumer correspondence;
- mutation, lifecycle and acknowledgement journeys;
- materialized-view freshness and control model;
- trust, assurance, operations and evolution map;
- Concept Explorer lens portfolio;
- cross-system and OCE-facing synthesis;
- executable inventory/graph/anchor evidence; and
- unresolved external-evidence and premise register.

## Current records

- [Repository and contract atlas](./repository-and-contract-atlas.md): pinned
  topology, revision-exact populations, representation chain, resolver
  correspondence, OCE generation boundary, seams and invalidators.
- [Database authority and projections](./database-authority-and-projections.md):
  authority lattice, graph and identity, lifecycle, integrity placement,
  schema-doc lineage, public API projections, clocks and decisive experiments.
- [API runtime, contract and policy](./api-runtime-contract-and-policy.md): public
  façade, lesson trace, schema generation/alignment, binary and bulk contracts,
  rights, search, pagination, identity, versioning and experiments.
- [OCE consumer and generation](./oce-consumer-and-generation.md): immutable/live
  input authority, executable provider/cache comparison, strictness, lossy MCP
  compilation, authored capabilities, enumeration, bulk contracts and release
  implications.
- [End-to-end journeys](./end-to-end-journeys.md): trustworthy lesson,
  enumeration, asset, offline release, mutation/publication and projection-change
  traces with premise tests and invalidators.
- [Mutation workflow and control](./mutation-workflow-and-control.md): command
  semantics, atomicity, concurrency, state, trigger split, authority, audit,
  assurance, propositions and decisive experiments.
- [Operations, evolution and assurance](./operations-evolution-and-assurance.md):
  CI truthfulness, refresh control, migration/schema evolution, environments,
  consumer retirement, release composition and falsifying probes.
- [Concept lens portfolio](./concept-lenses/README.md): fixed 59-lens register,
  evidence/orthogonality rules, completed passes and validation contract.
- [Multi-lens synthesis](./concept-lenses/synthesis.md): common threads, unique
  findings, negative space, candidate conceptual kernel, premise-collapse
  hypotheses and OCE architectural consequences.

## Progress journal

### 2026-07-19: investigation opened

**Observed:** The clean pinned repository contains 1,538 tracked files and
declares six workspaces spanning database migration and metadata, developer and
CI tooling, published schemas, direct mutations, authentication and MV refresh.
Root documentation describes both migration-first and schema-doc-first change
paths, hand-written and introspected schema representations, Hasura read access,
and a direct mutation API.

**Changed assumption:** `Database-Tools` is not usefully bounded as database
DDL. It appears to participate in curriculum semantics, authoring workflow,
publication, API contracts, trust, derived read models, package governance and
production control. Those are hypotheses about system participation, not yet
proof that the repository owns each concern.

**Unknown:** Applied production topology and controls, complete consumers,
actual data volumes and workloads, authoritative domain ownership, historical
reasons for boundaries, live failure modes, support work, educational outcomes
and whether declared bidirectional schema workflows are both currently used.

**Next discriminating evidence:** complete repository classification, SQL object
and dependency inventory, representative end-to-end mutation/read/refresh
traces, generated-source provenance and a history/co-change sample.

### 2026-07-19: oak-openapi added to the system boundary

**Observed:** The clean pinned oak-openapi repository contains 457 tracked files.
It declares a Next.js/tRPC public API which reads OWA Hasura through GraphQL,
defines endpoint input/output with Zod, emits an OpenAPI document, manages API
keys and rate limits in Redis, incorporates Sanity documentation, and implements
bulk-data paths using database and object-storage access. OCE identifies that
served OpenAPI document as an external source for generated SDK types,
validators and MCP tools. Structural populations in the atlas overlap and are
not a partition of the 457-file total.

**Observed contradiction:** oak-openapi's core directive says public shapes
should flow from source Zod schemas into generated OpenAPI output, but also says
`pnpm generate:openapi` is currently broken and requires source and generated
schemas to be kept in sync by hand. This establishes a present duplication and
drift opportunity; it does not yet establish actual contract divergence.

**Changed assumption:** the upstream dependency is not one materialized view or
one API adapter. The bounded product composes several versioned materialized
views, ordinary Hasura tables/views, handler-level joins and transformations,
generated and manually synchronised schemas, Redis policy state, content gates,
CMS material and bulk-export infrastructure. Each needs a separate authority and
failure analysis before any can be collapsed.

**Unknown:** Which materialized view/version supplies every endpoint in each
environment; whether the served production document matches pinned source and
runtime responses; freshness and compatibility promises observed by OCE;
consumer traffic and failure tolerance; and whether OCE's checked-in/generated
schema is updated automatically, by review or by convention.

**Next discriminating evidence:** build a revision-exact API surface and
GraphQL-object inventory, trace at least one endpoint from SQL projection to OCE
tool execution, and compare source Zod, generated OpenAPI, served-schema fixture
and OCE-generated representations.

### 2026-07-19: authority chain and lens portfolio completed

**Observed:** Revision-exact inventory now spans Database-Tools migrations and
SQL objects, oak-openapi routes/projection locks/policy lists, OCE's cached schema,
generated primitives and bulk receipt. A local, lockfile-checked and
network-guarded executable comparison
finds the pinned provider and OCE cache structurally identical across 32 paths,
32 GET operations and 32 component schemas, with one prose difference. This is
snapshot correspondence, not runtime or future-compatibility evidence.

**Changed assumption:** The durable boundary is not “database to API to SDK”. It
is a chain from competence-specific assertions through typed releases,
projections, contract snapshots and authored capabilities to named human and
ecosystem outcomes. Every transformation requires correspondence evidence, and
no convenient projection acquires semantic authority merely by being consumed.

**Unknown:** Production conformance, release completeness, organisational
authority, workload/recovery behaviour, full consumer use and human/educational
outcomes remain external evidence. The synthesis turns each into an explicit
investigation or falsifier rather than inferring it from repository structure.

### 2026-07-20: adversarial semantic closure

**Observed:** An adversarial audit of the pre-correction corpus revalidated all
637 then-existing pinned GitHub `blob` links across the 17 Database research
records at their declared revisions. Every target path and every declared line
span resolved. Four unanchored links identified the Concept Explorer method
rather than substantive evidence lines. Structural link, format and test gates
still do not establish the semantic truth of prose claims.

The post-correction rerun validated all 640 links in the same 17-record tree,
including 636 line-anchored references, against clean pinned source revisions.
The four unanchored method links remain deliberate.

**Corrected evidence classes:** Static source establishes failure-valued
transaction callbacks after possible writes, not the runtime commit result. A
projection matrix labelled complete was only a selected Open API family. A
universal-authority formulation contradicted the competence-specific authority
graph. One error-propagation proposition had its warrant and invalidator at the
wrong semantic level. Resolver usage counted only handler files and omitted bulk
consumers. Two lens records repeated the canonical kernel. The OCE summary
described live acquisition as the default even though normal generation uses the
committed cache.

**Changed assumption:** Completing the planned static pass means the bounded
source population has been traversed, not that every interpretation has been
accepted. The multi-lens synthesis is the sole canonical kernel; other records
contribute evidence, qualifications and lens-specific deltas.

**Unknown:** Real-database transaction outcomes, deployed singleton lifetime,
production projection completeness, generated-contract loss handling and live
authority correspondence still require the decisive runtime and organisational
probes named in the research records.
