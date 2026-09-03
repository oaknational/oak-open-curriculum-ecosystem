# End-to-end authority journeys

## Purpose and method

**Status:** source-grounded static traces across pinned repositories; no deployed
traffic, live databases or production archives were inspected

These journeys follow valued outcomes across
`Database-Tools@3d1eff31`,
`oak-openapi@2fb1383b`
and
[`OCE@bd878a3a`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).
They complement the layer-specific records:

- [database authority and projections](database-authority-and-projections.md);
- [mutation workflow and control](mutation-workflow-and-control.md);
- [operations, evolution and assurance](operations-evolution-and-assurance.md);
- [API runtime, contract and policy](api-runtime-contract-and-policy.md);
- [OCE consumer and generation correspondence](oce-consumer-and-generation.md).

Each trace asks five questions:

1. What human or ecosystem outcome is being served?
2. Which authority introduces each claim?
3. Which projections preserve, narrow, repair or silently alter it?
4. What does acknowledgement actually prove at each boundary?
5. What smaller set of concepts could serve the outcome truthfully?

The purpose is not to prescribe repairs to the source repositories. Current
workarounds are evidence about obligations, missing concepts and boundary
quality for an excellence-first OCE architecture.

## Journey 1: obtain a trustworthy lesson summary

### Valued outcome

A teacher, developer or agent can identify one published lesson and receive its
pedagogical content, curriculum placements, rights-sensitive availability and
stable public links.

### Current path

```text
authored lesson/unit/programme state
  -> published_mv_lesson_openapi_1_2_3
  -> Hasura GraphQL
  -> oak-openapi copyright gate + reconstruction + correction
  -> Zod/OpenAPI response
  -> OCE contract cache + SDK projection
  -> generated HTTP client / primitive MCP tool / authored capability
```

1. **Observed:** Database-Tools joins lessons with unit variants, programmes,
   quizzes, assets, videos, content guidance, supervision and other public
   content into a version-named materialized view
   (projection).
2. **Observed:** oak-openapi first consults a committed text-rights gate, then
   queries the MV through Hasura with a five-minute cache directive
   (gate and query).
3. **Observed:** the handler reconstructs unique curriculum variants, creates
   URLs and independently corrects `hasDownloadableResources`
   (transformation).
4. **Observed:** response Zod validation then supplies the OpenAPI document
   (schema).
5. **Observed:** OCE retains the provider schema, creates an SDK projection with
   `oakUrl`, and generates types, validators, response maps and a primitive MCP
   tool. At runtime, failed augmentation can fall back to raw upstream data.

### Authority accounting

| Claim                     | Effective authority                              | Problem exposed by the trace                                                    |
| ------------------------- | ------------------------------------------------ | ------------------------------------------------------------------------------- |
| lesson and content fields | database rows plus MV SQL                        | row/revision/release correspondence is implicit                                 |
| curriculum placement      | MV, then handler reconstruction                  | one concept is shaped twice                                                     |
| text availability         | committed oak-openapi query-gate data            | policy is outside the content revision                                          |
| downloadable availability | MV flag, then handler correction                 | the later compensation is the effective answer                                  |
| canonical URL             | oak-openapi handler                              | URL identity is application policy                                              |
| `oakUrl`                  | OCE route heuristics                             | a second URL authority is described as schema decoration                        |
| cache freshness           | MV refresh, Hasura cache and OCE/runtime clocks  | no response names the source release or freshness                               |
| output validity           | oak-openapi Zod, then differently strict OCE Zod | an additive field can be valid upstream but fail or bypass behaviour downstream |

**Inferred:** the response is useful because several layers repair and enrich
it, not because one published lesson contract is authoritative. Consumers cannot
tell which curriculum release, policy revision or projection watermark produced
the answer.

### Truer basis

```text
getLesson(release, stable lesson identity, optional placement context)
  -> lesson revision
   + explicit placements
   + separately identified capability decision with policy revision/reasons
   + typed resource links
   + curriculum release, projection release, contract release and observedAt
```

The database may still use optimized read models, but the public claim should be
defined independently of them. Link resolution and capability policy are
explicit contributors, not response-field patches.

### Invalidators

- A release-aware end-to-end response contract already exists outside these
  repositories and names the independently versioned content, projection,
  contract and policy inputs for every returned claim.
- The downloadable-resource correction is proven equivalent to the MV flag for
  every published lesson and is scheduled for removal with an executable gate.
- OCE link projection is generated from one shared, versioned route contract
  rather than inferred route knowledge.

## Journey 2: enumerate every curriculum placement for indexing

### Valued outcome

Search and ecosystem consumers can build a complete index without omitting
lessons or erasing why and where each lesson occurs.

### Current path

```text
programme/unit-variant/lesson rows
  -> synthetic unit-variant lesson MV
  -> grouped key-stage/subject HTTP endpoint
  -> OCE unit catalogue
  -> one endpoint call per unit, limit 100
  -> aggregate by lesson slug and unit slug
  -> search documents and quality metrics
```

**Observed:** ADR-083 records a prior index with about 52% of expected Maths KS4
lessons missing because a truncated unit summary was used as enumeration
([incident evidence](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md#L8-L44)).
Its chosen relation is the version-named synthetic unit-variant lessons MV. The
ADR requires exhaustive pagination and preservation of tier/programme context.

**Observed:** the later workaround says the unfiltered endpoint returns 431
rather than 436 Maths KS4 lessons. It calls every supplied unit once with
`limit: 100` and no page exhaustion
([workaround](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/src/lib/indexing/fetch-all-lessons.ts#L106-L170)).
It then keeps lesson slug/title and unit slugs, discarding the other placement
dimensions the ADR named
([aggregation](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/src/lib/indexing/lesson-aggregation.ts#L15-L34)).

### Failure semantics

| Failure                                              | Current observable result                                 |
| ---------------------------------------------------- | --------------------------------------------------------- |
| unit catalogue omits a valid unit                    | no call is made; index is silently incomplete             |
| a unit has more than 100 placement rows              | excess rows are silently absent                           |
| the grouped endpoint omits rows without unit filter  | workaround masks one observed symptom                     |
| one lesson occurs in several programme/tier variants | variants collapse to lesson plus unit-slug set            |
| projection is stale                                  | internally coherent response may still describe old state |
| source changes during a multi-call crawl             | index can combine several source moments                  |

**Inferred:** completeness is being inferred from successful traversal. There is
no closed-world manifest stating what should exist, no source watermark spanning
the crawl and no relationship count to reconcile.

### Truer basis

A `CurriculumPlacement` is a first-class released relation, not a nested detail
inside unit summaries or a duplicate to discard:

```text
(release, lesson revision, unit variant, programme, sequence,
 tier/exam board/pathway, order, publication state)
```

Expose it as cursor-paged live data and as part of an immutable snapshot. Index
construction can then prove:

- the snapshot or cursor walk has one watermark;
- every advertised partition was processed;
- entity and relationship counts reconcile;
- no placement dimension was lost without a declared projection reason.

### Invalidators

- The producer enforces and publishes an invariant of at most 100 placements per
  unit, and the input catalogue has a completeness proof.
- A downstream use analysis proves programme, tier, exam-board and ordering
  context irrelevant to all OCE search and framework consumers.
- The live endpoint gains cursor pagination, release identity and a terminal
  completeness token that OCE validates.

## Journey 3: discover and deliver a lesson asset

### Valued outcome

An authorised user can discover available lesson resources and retrieve the
right revision with correct licence, attribution, cache, range and failure
semantics.

### Current path

```text
asset/video rows and rights attributes
  -> download/lesson MVs
  -> list-assets HTTP handler + policy gate
  -> OpenAPI JSON metadata
  -> OCE generated discovery tool
  -> separately authored download-asset capability
  -> real Next binary route
  -> GCS stream or Mux redirect
```

**Observed:** the database downloads projection selects static assets across
states and combines them with a published-video alias, creating a proposition
that fields from different revisions can meet in one result. See
[database authority and projections](database-authority-and-projections.md#download-and-transcript-projection-anomalies).

**Observed:** oak-openapi's OpenAPI procedure for the single binary asset path is
a metadata stub with `z.any()` output and returns `undefined`
(stub).
The real Next route independently implements authentication, errors, analytics,
GCS streaming, Mux fallback, redirects, caching, ranges and several response
types
(route).

**Observed:** OCE deliberately excludes that endpoint from generated MCP tools,
then supplies an authored `download-asset` capability.

**Inferred:** This separation is evidence that binary delivery should not be
modelled as a normal JSON endpoint translated directly into a tool. The intended
long-term contract remains a design proposition rather than an observed source
fact.

### Negative space

No one contract in the traced chain joins:

- authorised principal and intended use;
- exact lesson/content revision;
- asset identity, checksum, media type and size;
- licence, attribution and restriction reasons;
- delivery capability and expiry;
- streaming, range, redirect and cache behaviour;
- audit/correlation identity.

**Inferred:** “asset URL” currently carries too much hidden meaning. Proxying the
bytes through the curriculum API also combines authorisation, metadata and data
plane concerns that can be separated.

### Truer basis

```text
listAssets(release, lesson revision, intended use)
  -> immutable asset descriptors + rights metadata

authoriseAsset(principal, asset identity, intended use)
  -> short-lived delivery capability + policy revision + decision reasons
```

The delivery capability can target a CDN/object store directly while retaining
auditable policy. The HTTP and MCP adapters represent redirects/ranges or expose
the higher-level capability honestly; they do not invent a JSON response for a
binary route.

### Invalidators

- The binary route is fully represented by and conformant with the served
  OpenAPI contract, including all statuses, headers and bodies.
- Asset metadata is cryptographically tied to one lesson revision and every
  policy path uses one competent rights decision.
- Proxying is required by a demonstrated legal/security property that direct
  scoped capabilities cannot meet.

## Journey 4: acquire a complete offline curriculum release

### Valued outcome

A framework consumer can obtain a coherent, verifiable corpus for search,
analysis, teaching workspaces or another application without reverse-engineering
the online API.

### Current path

```text
database projections
  -> oak-openapi bulk GraphQL queries and preparation script
  -> generated JSON/JSONL and ZIP
  -> /api/bulk
  -> OCE downloader requests 32 named files
  -> extract over local directory
  -> size-only manifest
  -> hand-authored generated Zod parser
  -> index transformations
```

**Observed:** oak-openapi's combined lesson query requests `limit: 1`, while the
preparation script treats its result as all lessons in a unit
(query,
consumer).
Asset mode has independent boolean, rights-gate, return and upload anomalies
recorded in
[API runtime, contract and policy](api-runtime-contract-and-policy.md#asset-policy-and-return-contract).

**Observed:** OCE's download script does not clear or stage the destination,
compare requested and returned coverage, validate the producer schema, validate
relationships or atomically publish the result
([download](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/scripts/download-bulk.ts#L26-L164)).
The committed receipt contains 30 of 32 expected curriculum files. The included
JSON Schema and OCE generated Zod accept different document sets; see
[OCE consumer and generation correspondence](oce-consumer-and-generation.md#three-schemas-that-do-not-derive-from-one-another).

### Acknowledgement ladder

| Boundary            | What success currently proves                   | What it does not prove                                        |
| ------------------- | ----------------------------------------------- | ------------------------------------------------------------- |
| GraphQL request     | query returned rows                             | all rows for one release                                      |
| preparation process | selected files/data were written                | complete lesson/asset set or uniform rights policy            |
| bulk HTTP response  | a ZIP was returned                              | expected partitions, schema, release or integrity             |
| extraction          | archive entries could be written                | absence of stale files or mixed snapshots                     |
| manifest            | filenames and byte sizes at one local time      | hashes, provenance, counts, relationships or completeness     |
| OCE Zod parse       | document matches a parallel hand-authored shape | included JSON Schema validity or producer semantic invariants |
| index build         | available parsed records were transformed       | advertised curriculum coverage                                |

**Inferred:** no boundary upgrades “some data arrived” into “this is a complete,
coherent Oak curriculum release.” That is the missing product.

### Truer basis

Publish immutable, content-addressed release manifests with:

- release, schema and rights-policy identities;
- source/projection watermarks;
- declared partition coverage and justified omissions;
- hashes, byte sizes, entity counts and relationship counts;
- validation evidence and referential invariants;
- atomic supersession and retention rules.

Generate all consumer validators directly from the included schema or a shared
contract IR. The same release relation should serve live queries and bulk
snapshots, removing the need for two independently meaningful curriculum
products.

### Invalidators

- Production artefact inspection proves all expected lessons and assets are
  present and coherently revisioned despite the source-level query limits.
- The included JSON Schema is explicitly documentary and a different producer
  contract is identified as authoritative and equivalent to OCE Zod.
- The current extraction destination is always fresh and isolated by external
  orchestration that also verifies coverage and integrity.

## Journey 5: mutate, publish and observe a lesson change

### Valued outcome

An authorised editor performs one intentional change exactly once, receives a
truthful durable result, and downstream users observe it as part of a coherent
published release.

### Current path

```text
JWT-authenticated mutation command
  -> Drizzle transaction
  -> route validation and writes
  -> mutation_api session marker suppresses selected trigger behaviour
  -> latest entity/workflow state and audit rows
  -> release/publication functions and static lesson list
  -> dirty-MV metadata
  -> external refresh HTTP request
  -> global MV refresh transaction
  -> Hasura/API caches
  -> OCE clients, indexes and bulk snapshots
```

**Observed:** the mutation API establishes a command-shaped boundary, but several
handlers return `{ success: false }` from inside a Drizzle transaction after
earlier possible writes. Static source therefore does not establish the
documented guarantee that non-2xx means no mutation. Details and examples are in
[mutation workflow and control](mutation-workflow-and-control.md#atomicity-and-acknowledgement).

**Inferred high-impact hypothesis:** under ordinary Drizzle transaction
semantics, resolving the callback with `{ success: false }` would commit any
earlier writes. A real-database fault-injection probe remains required to
establish the runtime outcome.

**Observed:** the session is marked `mutation_api`, causing database triggers to
suppress behaviour that other writers receive. The application then reimplements
selected lifecycle semantics. There is no command ID, idempotency key, expected
version, compare-and-set transition or durable operation record.

**Observed:** publication stores a static lesson list inside a unit variant,
mixing a release snapshot with a read cache. OpenAPI MVs are created with no data
and depend on operational refresh; API and consumer responses expose neither the
source release nor projection watermark.

### Failure and uncertainty propagation

| Event                                          | Possible externally visible state                                                                                       |
| ---------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| business failure returned after an early write | caller sees failure; partial command may commit under the inferred transaction semantics; runtime outcome is unresolved |
| response lost after commit                     | retry can duplicate or conflict because no operation identity exists                                                    |
| competing edits                                | last check/write may win without a rejected expected version                                                            |
| trigger and mutation implementation diverge    | same semantic edit differs by caller                                                                                    |
| publication commits but MV refresh has not run | source is new; public read model remains old                                                                            |
| refresh request returns `200` before refresh   | caller sees acceptance as though it were outcome                                                                        |
| refresh partly fails in a global transaction   | useful progress and failure locality are lost or unclear                                                                |
| API/Redis/Hasura cache remains warm            | even a refreshed MV does not establish immediate observation                                                            |
| OCE index or bulk snapshot predates change     | different products legitimately or accidentally expose different curriculum moments                                     |

**Inferred:** mutation, publication, projection and observation are distinct
state machines, but the estate mainly represents entity state plus informal
operational clocks. “Published” cannot by itself mean visible to a named
consumer.

### Truer basis

```text
Command(commandId, principal, target, expectedRevision, intent)
  -> Operation(accepted | rejected | committed | failed, evidence)
  -> immutable entity revision
  -> explicit PublicationRelease
  -> deterministic ProjectionBuild(release, projection version, status)
  -> consumer-visible release/watermark
```

This does not demand asynchronous infrastructure everywhere. It demands explicit
identities and truthful transitions. A synchronous command may commit and return
the new revision directly. Longer publication/projection work can return an
operation resource whose completion is observable and retry-safe.

### Invalidators

- Transaction tests prove every business-failure path rolls back all earlier
  writes under the deployed Drizzle/database configuration.
- External ingress supplies idempotency, concurrency control and durable
  operation correlation that the repository does not show.
- The refresh system publishes a release/watermark atomically and all API/OCE
  consumers validate it before use.

## Journey 6: evolve a projection without silently breaking OCE

### Valued outcome

Database and API implementations can improve while every released consumer gets
an explicit compatibility promise, migration path and evidence.

### Current path

```text
SQL schema-doc or migration change
  -> version-named MV/function
  -> Hasura metadata
  -> manual oak-openapi resolver constant/query/result type
  -> source Zod plus sometimes hand-maintained generated schema
  -> served OpenAPI singleton
  -> OCE committed cache or Vercel live fetch
  -> generated trees
  -> primitive and aggregate tools/apps
```

**Observed:** Database-Tools contains independently mutable migration, SQL-doc,
Hasura, Drizzle and Zod representations. MV retirement searches a manually
maintained consumer list and a bounded GitHub result set. Database, schema and
services release independently; see
[operations, evolution and assurance](operations-evolution-and-assurance.md#consumer-retirement-evidence).

**Observed:** oak-openapi manually pins version-named database projections in
`owaClient.ts`; GraphQL result shapes are hand-written. Its schema-first
documentation conflicts with a directive that the generator is broken and both
source and generated schemas need manual editing. The Swagger route mutates a
shared schema singleton.

**Observed:** OCE's ordinary generator uses a reviewed cache while Vercel selects
live upstream. Drift is advisory value comparison, not compatibility
classification. The MCP compiler also silently loses constructs and OCE closes
otherwise open response objects.

### Change-propagation problem

Each local boundary can be internally green while the chain is false:

- SQL tests do not apply or exercise Hasura metadata.
- GraphQL interfaces are not generated from Hasura schema/query documents.
- OpenAPI validity does not prove runtime HTTP conformance or completeness.
- cache equality does not prove consumer compatibility.
- successful code generation does not prove lossless representation.
- generated types do not prove authored aggregate capabilities still mean the
  same thing.
- a consumer search cannot prove absence of a private, generated or dynamic use.

### Truer basis

Use named contracts and executable correspondence at each necessary boundary:

```text
database semantic model
  -> deterministic projection definition + live relation conformance
  -> generated GraphQL declaration/query types
  -> runtime HTTP conformance against immutable OpenAPI snapshot
  -> lossless compilation to transport ContractIR
  -> capability-level consumer contract tests
```

Compatibility is evaluated against both protocol rules and registered capability
uses. Expand/contract migration makes old and new projections coexist until
observed consumers have moved. Version numbers then identify semantic promises,
not merely object-name succession.

### Invalidators

- Existing release automation outside the repositories already binds all stages
  to one manifest, runs cross-layer conformance and records consumer adoption.
- GraphQL, generated OpenAPI and OCE artefacts are shown to be mechanically
  derived from a single authority with no independent manual edits.
- A complete runtime consumer registry and usage evidence makes retirement
  decisions sound despite current repository search limitations.

## Cross-journey common threads

### 1. Valuable derived views are being mistaken for authorities

Materialized views, grouped endpoints, generated schemas, search indexes and
bulk files are all useful projections for a particular job. Problems appear when
their convenient shape becomes the only definition of identity, completeness,
rights or lifecycle.

### 2. Release identity is the largest negative space

The chain has entity states, database releases, version-named MVs, API package
versions, OpenAPI versions, Git revisions, cache versions, download timestamps
and index moments. It lacks one public curriculum release identity for exact
content revisions and placements, plus a coordination manifest referencing the
independently versioned projection release, contract release, policy decision and
observation time. Those authorities and clocks must not be co-versioned merely to
make one response convenient.

### 3. Relationships carry more meaning than nested resources preserve

Lesson-unit-programme-tier placement, content-to-asset revision, publication-to-
projection and operation-to-audit correlation are first-class relations. Nesting,
deduplicating or joining by slug repeatedly discards their identity.

### 4. Compensating policy is real knowledge in the wrong shape

Rights gates, route corrections, parameter overrides, subject catalogues and
workarounds should not simply be deleted. They reveal requirements. Their durable
form is a competent policy/capability/link authority with provenance, reasons,
revision and conformance, not another patch list.

### 5. Acknowledgement is routinely stronger in wording than in evidence

HTTP `200`, a resolved transaction callback, successful extraction, Zod parsing,
code-generation completion and an advisory drift pass all prove narrower things
than downstream code tends to assume. Explicit operation, release, manifest and
watermark identities make those proofs composable.

## Journey contribution to the conceptual basis

The portfolio-wide basis is declared once in the
[candidate conceptual kernel](concept-lenses/synthesis.md#candidate-conceptual-kernel).
The journey analysis contributes composition obligations to that kernel rather
than a second declaration of it:

- response and manifest identities must coordinate independently versioned
  curriculum, release, policy and observation claims without forcing them to
  co-version;
- relationship and placement identities must survive traversal rather than being
  collapsed into nested response shape;
- a command, its typed outcomes and any optional addressable operation must remain
  distinguishable; and
- a resource descriptor, a delivery grant and delivered bytes must remain
  distinguishable.

Contract compilers, materialized views, resource links and transports are
evidence-bearing machinery. A remedy is expressed through capability, command,
outcome and supersession or revocation, not as a second kind of evidence.

Everything else should justify itself as an implementation of the canonical
kernel or as a distinct valued obligation. That is the journey-level premise
test for the OCE kit: not “how should the existing layers be reproduced?”, but
“which independent truths and outcomes require a system at all?”
