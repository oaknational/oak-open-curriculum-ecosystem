# Database Tools, oak-openapi and OCE through contract and public-API lenses

## Purpose and scope

This record runs fixed lenses 18-26 from the Database Tools investigation
register. It follows the four movements in OCE's
[`concept-exploration` workflow](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md#L25-L49)
and asks what OCE should learn from the existing contract chain, not how to
repair any source repository.

The evidence is pinned to:

- Database Tools
  `3d1eff31a398189a839ae68bcf69990089c31bd2`;
- oak-openapi
  `2fb1383bfeaeb4986ec29cef97be133b69baeef5`; and
- OCE
  [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

This is a static current-state exploration. Source existence does not establish
production behaviour, user value, or conformance. It deliberately separates:

- **Observed:** directly present in a pinned tree, or a stated reproducible
  comparison of artefacts generated from those trees;
- **Inferred:** an interpretation warranted by observations but not yet proved
  by causal or runtime evidence; and
- **Unknown:** evidence not present or not gathered in this pass.

The nine local lens numbers below map in order to fixed register lenses 18-26.

| Local lens | Fixed lens | Primary distinction                                                |
| ---------- | ---------- | ------------------------------------------------------------------ |
| 1          | 18         | schema authority -> derived representation -> correspondence proof |
| 2          | 19         | storage/read mechanism -> semantic read contract                   |
| 3          | 20         | HTTP mutation request -> durable command outcome                   |
| 4          | 21         | provider package -> public contract -> consumer capability         |
| 5          | 22         | authored source -> reproducible document -> observed runtime       |
| 6          | 23         | route shape and prose -> coherent operation semantics              |
| 7          | 24         | upstream description -> generated OCE behaviour                    |
| 8          | 25         | domain meaning -> representation and media profile                 |
| 9          | 26         | domain outcome -> transport status, error and retry semantics      |

---

## Lens 1: schema correspondence and generation (fixed lens 18)

### Governing question

Which schema is authoritative for each boundary, how are other representations
derived, and what proves that generation preserves the intended meaning?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools describes hand-maintained Zod contracts and a
  separately generated Drizzle schema introspected from a live database, with
  derivation of Zod from Drizzle stated as a future direction
  (schema relationship lines 191-202).
- **Observed:** SQL documentation reconciliation chooses between library SQL
  and the highest migration version; equal versions with different normalized
  SQL select the migration copy
  (reconciliation rules and implementation lines 60-111).
- **Observed:** oak-openapi keeps a handler request schema and a generated
  OpenAPI request schema as distinct committed files; the latter adds example
  metadata
  (source request lines 1-9,
  generated request lines 1-8).
- **Observed:** OCE declares the OpenAPI document to be the only definition
  from which TypeScript, Zod, MCP metadata, URL helpers and validators derive
  ([pipeline lines 23-68](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L23-L68)).

**Inherited assumption exposed:** "single source of truth" is not a property of
one file format. Database structure, write invariants, public response meaning,
examples and consumer affordances can have different competent authorities.
Making any one of them universal can turn derivation into accidental policy.

### Movement 2: define the problem space

**Problem frame:** OCE needs every public capability to have a named semantic
authority and every derived representation to retain the authority's constraints
and meaning. The present chain contains several generation and reconciliation
steps, but its proof obligations are local: database introspection proves shape,
Zod proves accepted values, OpenAPI describes transport, and OCE codegen proves
only that artefacts can be emitted. Consumers are harmed when shared names imply
correspondence that no executable evidence establishes. Success is an authority
graph with explicit transformations and conformance evidence at each edge, not
one universal schema.

### Movement 3: reflect on possible explanations

**Competing explanation:** parallel schemas may be deliberate anti-corruption
layers. A public lesson is not a database row, and a generated OpenAPI schema
legitimately adds examples and transport metadata which do not belong in storage
definitions. Independent representations are not drift if their relationship is
intentional and tested.

**Changed assumption:** generation is not inherently more authoritative than
hand authoring. A generated artefact is trustworthy only to the extent that its
input is competent for the target boundary and the transformation has proved
semantic preservation.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** Database Tools has at least database-observed, SQL-library,
  migration, Drizzle, Zod and public projection schema authorities; they are not
  reducible to one concern.
- **Inferred:** oak-openapi adds a public semantic layer rather than merely
  serialising database shapes, so OCE should consume its public contract without
  inheriting its internal schema topology.
- **Unknown:** field-level correspondence coverage between current materialized
  views, Hasura results, handler schemas, served OpenAPI and live responses.

The OCE basis should be **authority per semantic boundary plus total,
evidence-bearing transformations**, not "database first" or "OpenAPI first" as
an unqualified slogan.

| Warranted investigation or proposal                                                                                                                                        | Warrant                                                                                                       | Explicit falsifier                                                                                                            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Define an OCE contract authority graph which names the authority, derivation, loss policy and executable proof for every public field.                                     | The pinned chain has multiple competent but non-equivalent schema sources.                                    | Every public field is already generated through one lossless, tested path from one semantically competent authority.          |
| Prototype a contract compiler around a small vertical slice: domain meaning -> provider response -> OpenAPI -> OCE type/validator/tool, retaining provenance at each edge. | File generation alone cannot show that descriptions, nullability, ordering and policy meaning survived.       | The prototype adds no stronger defect detection or explanation than the existing type and runtime tests.                      |
| Keep storage schemas outside the default OCE consumer surface unless a separately governed capability requires them.                                                       | OCE already defines HTTP as its consumer boundary, while storage contracts encode provider-specific concerns. | A required OCE capability cannot be expressed or verified through a public semantic contract without direct storage coupling. |

**Unresolved evidence:** a complete field lineage; production payload samples;
nullability and coercion behaviour at Hasura; generator test coverage; ownership
of descriptions and examples; and which current divergences are intentional
anti-corruption rather than unmeasured drift.

---

## Lens 2: GraphQL and read contracts (fixed lens 19)

### Governing question

What read semantics must OCE preserve independently of Hasura, GraphQL and
materialized-view implementation choices?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools defines a versioned lesson materialized view as a
  wide public projection and creates it with `NO DATA`
  (projection output lines 238-301);
  Hasura grants several roles unfiltered selection over every column
  (metadata lines 1-29).
- **Observed:** oak-openapi hard-codes versioned Hasura resolver and table names
  for lesson, content, download, thread, sequence, programme and search surfaces
  (resolver registry lines 5-39).
- **Observed:** a lesson-summary handler queries that resolver, then assembles
  units, canonical URLs and an availability override before returning the public
  response
  (query and assembly lines 96-205).
- **Observed:** OCE explicitly forbids its SDKs and applications from connecting
  to Hasura, PostgreSQL or materialized-view names, defining the published HTTP
  API as the consumer boundary
  ([consumer boundary lines 7-9](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L7-L9)).

**Inherited assumption exposed:** a read contract is not the GraphQL query or the
shape of one projection. It also includes identity, cardinality, order,
pagination, policy filtering, freshness, completeness and failure meaning.

### Movement 2: define the problem space

**Problem frame:** an OCE consumer needs stable curriculum capabilities even as
the provider changes projections, GraphQL schema names or query composition.
The current provider boundary does add semantic assembly, but the static
OpenAPI shape cannot by itself express all read guarantees. Consumers are harmed
when an implementation detail becomes an identifier they must know, or when an
array's apparent type conceals unstable order, post-query filtering or stale
materialization. Success is a transport-neutral read contract whose observable
semantics can be tested against any provider adapter.

### Movement 3: reflect on possible explanations

**Competing explanation:** explicit versioned resolver names may be a sound
compatibility strategy. They pin the adapter to a known projection while the
public HTTP surface remains stable, and therefore absorb rather than export
database evolution.

**Changed assumption:** hiding GraphQL is necessary but insufficient. A clean
HTTP boundary still exports implementation behaviour unless semantic guarantees
such as ordering, completeness, policy and freshness are specified and tested.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** the valuable seam is the oak-openapi assembly layer, where
  provider-shaped rows become public curriculum operations; the GraphQL client
  and MV names are replaceable adapters.
- **Inferred:** OCE's existing prohibition on direct data-store access is a
  strong boundary worth preserving.
- **Unknown:** which current route behaviours are contractual, incidental to
  Hasura defaults, or accepted temporary compromises.

| Warranted investigation or proposal                                                                                                                                 | Warrant                                                                                                         | Explicit falsifier                                                                                                         |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Specify OCE read capabilities in terms of identities, cardinality, ordering, page boundaries, policy effects, freshness and error outcomes, independent of GraphQL. | These semantics affect consumers but are not captured by response field shapes alone.                           | Consumer tasks remain correct under adversarial changes to all of those semantics without additional contract information. |
| Define a provider-port conformance suite which can run against fixtures and a live HTTP provider without exposing MV or resolver names to OCE applications.         | OCE's boundary rule already separates consumer code from provider internals.                                    | The suite cannot distinguish a conforming substitute provider from a behaviourally incompatible one.                       |
| Investigate snapshot/cursor semantics for traversals that must be exhaustive or ordered.                                                                            | Offset/limit over changing or policy-filtered results cannot guarantee a stable traversal merely through types. | Production evidence shows no OCE workflow requires stable order, completeness or repeatable traversal.                     |

**Unresolved evidence:** refresh schedules and lag bounds; live Hasura schema;
ordering defaults; duplicate-row semantics; policy-filter cardinality; stable
pagination requirements; and provider substitution tests.

---

## Lens 3: mutation API contracts (fixed lens 20)

### Governing question

If OCE later enables writes, what durable command and workflow semantics must
exist beyond request and response schemas?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools registers lesson mutation routes around explicit
  start, complete and error phases and publishes a separate OpenAPI 3.1 document
  for them
  (application composition lines 48-111).
- **Observed:** the endpoint standard claims that all error conditions are
  raised inside a transaction and that any non-2xx response means no mutation
  occurred
  (atomicity contract lines 232-238).
- **Observed:** a start-create handler can insert and update an asset and insert
  entity state, then return a business-failure value when the later lesson
  update is absent rather than throw
  (handler lines 24-106).
- **Observed:** a shared complete operation likewise returns failure values
  after earlier updates
  (core operation lines 23-60);
  the repository separately documents response validation after transaction
  completion as a known unsafe-retry condition
  (known issue lines 1-29).
- **Observed:** the durable entity-state record stores one current status plus
  last-error and ingest fields, keyed by entity ID and type
  (Zod contract lines 6-40,
  database shape lines 7-18).
- **Observed:** OCE declares the v0 Swagger-published HTTP API as its sole data
  boundary; that boundary statement does not name Database Tools' mutation API
  ([boundary lines 7-9](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L7-L9)).

**Inherited assumption exposed:** wrapping writes in an HTTP handler and database
transaction does not define a command protocol. Retries, duplicate delivery,
concurrent edits, partial external work and outcome discovery remain part of the
contract even when request and response values validate.

### Movement 2: define the problem space

**Problem frame:** a future OCE write capability would need to tell a caller
whether a requested intent was rejected, accepted, completed, failed, superseded
or already performed, and make retry behaviour deterministic. The observed
start/complete/error shape indicates real multi-step work, while the transaction
and entity-state evidence does not establish an operation identity, idempotency
key, expected version or immutable history. Consumers are harmed when transport
failure leaves committed state unknowable or concurrent commands silently
overwrite intent. Success is a durable, observable command protocol whose
outcomes remain unambiguous across retries and process boundaries.

### Movement 3: reflect on possible explanations

**Competing explanation:** these endpoints may serve a small set of tightly
controlled applications with externally serialised workflows. Upstream job IDs,
single-writer discipline or operational reconciliation could supply guarantees
which are not visible in this repository.

**Changed assumption:** "transactional" is not a binary property of an API.
Database atomicity, command idempotency, external side-effect completion,
workflow state and response delivery are separate guarantees and need separate
proof.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** ordinary transaction semantics make return-valued business
  failures after earlier writes a credible contradiction of the documented
  no-mutation guarantee; a runtime database test is still required to establish
  the actual outcome.
- **Inferred:** start/complete/error phases represent a workflow resource even
  though the current state model is entity-centred rather than operation-centred.
- **Unknown:** caller retry discipline, concurrency frequency, external workflow
  IDs, production reconciliation and whether OCE will ever own write capability.

| Warranted investigation or proposal                                                                                                                                      | Warrant                                                                                                         | Explicit falsifier                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Before exposing writes in OCE, model commands with caller-supplied idempotency, expected aggregate version, stable operation identity and queryable terminal outcome.    | The observed workflows span phases and can leave the caller uncertain after response failure.                   | All prospective writes are provably single-shot, synchronous, database-local and never retried or concurrent.  |
| Specify one transaction callback outcome algebra in which every non-success aborts, then prove it with a real-database fault matrix rather than transaction mocks alone. | Current handlers mix returned failures and thrown failures while the documented guarantee depends on rollback.  | Integration evidence proves every return-valued failure after every write is rolled back by the actual driver. |
| Treat external work as a durable workflow with an append-only transition history, not merely the latest entity status.                                                   | Start/complete/error routes encode temporal intent that one mutable status cannot fully explain or deduplicate. | Existing external orchestration provides durable, correlated, queryable history with equivalent guarantees.    |

**Unresolved evidence:** real transaction behaviour for returned failures;
idempotency and operation IDs at callers; optimistic locking; queue delivery
semantics; external asset lifecycle; audit reconstruction; and OCE's intended
write scope.

---

## Lens 4: package and consumer contracts (fixed lens 21)

### Governing question

Which contracts belong in provider packages, which belong at the public HTTP
boundary, and which should the OCE kit expose to additional consumers?

### Movement 1: reflect on raw observations

- **Observed:** `@oaknational/oak-curriculum-schema` describes itself as Zod and
  TypeScript contracts between applications and PostgreSQL, including public,
  published and internal schema categories
  (purpose lines 1-14,
  categories lines 91-95).
- **Observed:** its source manifest exposes both a root package and `./drizzle`
  subpath
  (manifest lines 9-17),
  while the generated distribution manifest constructs only the root export
  (distribution manifest lines 37-57).
- **Observed:** oak-openapi depends on the schema package but defines and exports
  its public endpoint schemas independently
  (dependencies lines 36-51,
  router composition lines 1-37).
- **Observed:** OCE requires every consumer to obtain curriculum data only
  through the public HTTP contract
  ([boundary lines 7-9](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L7-L9))
  and wraps generated API types in a configured client with authentication,
  retry and rate-limit middleware
  ([base client lines 80-146](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/oak-base-client.ts#L80-L146)).

**Inherited assumption exposed:** a published package is not automatically a
public domain contract, and reuse is not automatically sound sharing. Storage
types, provider query types, transport types and consumer task types have
different compatibility and ownership horizons.

### Movement 2: define the problem space

**Problem frame:** the OCE kit must let additional consumers use Oak capabilities
without learning provider storage, framework or release topology. At the same
time, consumers should not each rebuild authentication, transport reliability,
validation, pagination and semantic helpers. The gap is not a shortage of shared
types; it is the absence of an explicit classification of which contracts are
provider-private, publicly stable, generated transport detail or intentionally
curated consumer capability. Success is narrow, cohesive, versioned consumer
surfaces whose dependencies and compatibility promises match their purpose.

### Movement 3: reflect on possible explanations

**Competing explanation:** a broad schema package can be useful inside one
provider estate because it catches drift at compile and runtime, while OCE's
separate HTTP-only boundary already prevents that implementation package from
leaking to external consumers.

**Changed assumption:** the OCE "kit" should be deliberately reusable, but not
maximally shared. It should centralise stable capability and protocol knowledge
while keeping provider implementation representations and product policy behind
their competent boundaries.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** OCE's HTTP-only rule is a stronger consumer contract than direct
  reuse of the database schema package.
- **Inferred:** generated endpoint types are necessary transport contracts but
  insufficient as an ergonomic, semantically stable kit surface.
- **Unknown:** the intended compatibility policy, consumer segmentation and
  publication boundaries for each OCE package.

| Warranted investigation or proposal                                                                                                                                                   | Warrant                                                                                                             | Explicit falsifier                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Classify every prospective OCE export as protocol primitive, generated transport type, domain capability, policy adapter or product composition, and assign compatibility separately. | The source estate shows that one "schema" package can span concerns with different audiences.                       | The classification never changes dependency, release, ownership or consumer decisions in representative features.    |
| Expose task-level OCE capability ports over generated transport code, preserving generated escape hatches for advanced consumers.                                                     | Consumers need stable intent and shared protocol discipline, while OpenAPI operations can evolve or remain awkward. | Direct generated clients are equally ergonomic and stable across all identified consumer tasks.                      |
| Add package-surface conformance tests which install packed artefacts and exercise every documented export and runtime peer combination.                                               | Source manifests and emitted distribution manifests can differ even when source type-checks.                        | Existing publication gates already prove installed consumer behaviour for all supported module systems and subpaths. |

**Unresolved evidence:** OCE's future external consumers; semver policy;
supported runtimes; package install tests; bundle boundaries; required escape
hatches; and ownership of domain-level convenience APIs.

---

## Lens 5: OpenAPI document authority and reproducibility (fixed lens 22)

### Governing question

What makes the OpenAPI document an authoritative, reproducible and
behaviourally credible contract rather than merely a generated description?

### Movement 1: reflect on raw observations

- **Observed:** oak-openapi generates its document at module load from the tRPC
  router and OpenAPI-ready Zod schemas
  (document generation lines 1-38);
  the Swagger route filters tags by mutating that shared document before
  returning it
  (route lines 1-25).
- **Observed:** one repository directive says the OpenAPI document is the single
  source and schemas must be regenerated
  (schema-first directive lines 6-29);
  another says the generator is broken and source and generated schemas must be
  synchronised manually
  (agent directive lines 79-88).
- **Observed:** the generator guide names `trpc-to-openapi` 2.1.5 as fixed
  (guide lines 3-20),
  while the manifest uses 3.1.0 with Zod 4
  (dependencies lines 72-79).
- **Observed:** OCE codegen reads a committed OpenAPI cache by default, validates
  it, and fetches/writes the live document only in online mode
  ([codegen lines 34-99](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/codegen.ts#L34-L99));
  its drift check is explicitly advisory and always exits successfully
  ([runbook lines 145-159](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/engineering/upstream-api-alignment-runbook.md#L145-L159)).
- **Observed (reproduced at the pins):** invoking the pinned Swagger `GET` route
  with inert client environment values produced 32 paths and 32 schemas; OCE's
  committed cache has the same counts. After removing deployment metadata,
  prose/examples and `bearerFormat`, canonical structural JSON was identical.
  Keeping prose exposed one cached-only hackathon note on
  `downloadsAvailable`
  (served source description lines 117-120,
  [cached description lines 8471-8473](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/schema-cache/api-schema-original.json#L8471-L8473)).

**Inherited assumption exposed:** a deterministic document is not necessarily
authoritative, and a document generated from runtime schemas is not necessarily
conformant to runtime behaviour. Authority, reproducibility, freshness and
behavioural correspondence are independent properties.

### Movement 2: define the problem space

**Problem frame:** OCE makes far-reaching generated decisions from one upstream
document. It therefore needs to know exactly which commit, generator, environment
and transformation produced that document, whether the same inputs reproduce it,
whether it matches live responses, and whether its cached copy is intentionally
current. Consumers are harmed when a valid but stale or semantically inaccurate
document generates confident types and tools. Success is a content-addressed,
hermetic contract build with independently gated behavioural conformance and an
explicit cache adoption decision.

### Movement 3: reflect on possible explanations

**Competing explanation:** runtime generation is useful because the router and
validation schemas are close to actual handlers, while OCE's committed cache is
useful because it makes builds hermetic. The two-stage approach can be excellent
if provenance and conformance are explicit.

**Changed assumption:** "OpenAPI is authoritative" should mean "the accepted
public compatibility commitment," not "the latest bytes a route happened to
emit." Generation location does not settle the authority question.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** OCE's cache gives reproducible generation but deliberately
  decouples consumer builds from upstream freshness.
- **Inferred:** oak-openapi's duplicate/manual generation path weakens any claim
  that runtime schema proximity alone prevents drift.
- **Unknown:** live-document equivalence to the pinned source, response
  conformance coverage, and the governance decision that promotes a fetched
  document into OCE's accepted cache.

| Warranted investigation or proposal                                                                                                                                   | Warrant                                                                                                                  | Explicit falsifier                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------- |
| Treat an accepted OpenAPI contract as an immutable release artefact carrying provider commit, generator version, content digest and compatibility classification.     | Current versions and caches identify some state but do not fully attest the build lineage.                               | Existing artefacts already reproduce byte-for-byte from declared inputs and expose equivalent provenance to every consumer. |
| Gate three different relations separately: source -> document reproducibility, document -> runtime conformance, and upstream document -> accepted OCE cache adoption. | Each relation has a different failure mode and current evidence covers them unevenly.                                    | One existing test demonstrably detects every divergence across all three relations without false equivalence.               |
| Make cache refresh a reviewed contract-adoption event with semantic diff and representative live proofs, while retaining hermetic default builds.                     | OCE's current workflow has the right hermetic substrate, but advisory drift alone cannot establish intentional adoption. | Automatic adoption is shown to be equally auditable and cannot break or mislead any consumer.                               |

**Unresolved evidence:** exact production build provenance; byte reproducibility;
live response validation coverage; compatibility policy; cache review history;
and whether mutation and bulk documents share the same authority discipline.

---

## Lens 6: endpoint semantic coherence (fixed lens 23)

### Governing question

Do operation names, descriptions, inputs, outputs, ordering and failure behaviour
express one coherent task contract?

### Movement 1: reflect on raw observations

- **Observed:** `/subjects` describes rich subject records but its resolver
  returns the committed `subjectSlugs` string array
  (handler lines 22-40).
- **Observed:** that slug catalogue is generated by calling the same local
  `/subjects` route and then fetching each subject
  (catalogue builder lines 26-70);
  runtime request enums are subsequently derived from the committed catalogue
  (catalogue exports lines 1-25).
- **Observed:** the sequence-question description promises unit-sequence order,
  but its second GraphQL query pages an `_in` set with `distinct_on` and no
  `order_by`, then iterates that result order
  (operation and queries lines 137-217,
  assembly lines 232-284).
- **Observed:** another paged question route filters policy-blocked rows after
  database offset/limit and comments that this changes pagination numbers
  (post-page filtering lines 373-442).
- **Observed:** OCE records a swapped upstream `offset`/`limit` description which
  its generator faithfully propagated into TSDoc, JSON Schema and Zod metadata
  ([finding lines 7-24](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/spikes/upstream-offset-limit-description-swap.md#L7-L24),
  [impact lines 144-156](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/spikes/upstream-offset-limit-description-swap.md#L144-L156)).

**Inherited assumption exposed:** endpoint coherence cannot be established by
schema validation or grammatical documentation. The prose, value shape,
ordering, filtering, pagination and discoverability graph must describe the same
operation.

### Movement 2: define the problem space

**Problem frame:** OCE turns endpoints into APIs and agent tools whose users
select operations and parameters largely from names and descriptions. A locally
valid shape can still be semantically false, circularly sourced or impossible to
page correctly. Consumers are harmed through incomplete crawls, unstable order,
wrong tool selection and confident automation of a different task from the one
implemented. Success is an operation contract with executable semantic
invariants and examples that prove the described task end to end.

### Movement 3: reflect on possible explanations

**Competing explanation:** some prose may describe an intended near-term shape,
and post-filtering may be a deliberate confidentiality trade-off. The correct
response may be to narrow the public guarantee rather than force a mechanism to
match aspirational wording.

**Changed assumption:** documentation is executable consumer input, especially
for generated agent tools. Description defects are behavioural defects even when
types and handlers compile.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** several endpoint contracts conflate intent, current mechanism
  and future expectation.
- **Inferred:** OCE's faithful code generation amplifies semantic defects across
  consumers rather than containing them.
- **Unknown:** production outputs, actual ordering stability, downstream reliance
  on current behaviour and which description or implementation is intended.

| Warranted investigation or proposal                                                                                                                                | Warrant                                                                    | Explicit falsifier                                                                                                    |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| Give every OCE capability an executable semantic example covering selection, order, pagination, policy filtering and terminal conditions, not only shape examples. | The observed contradictions survive schema validation and type generation. | Shape-only tests detect every seeded semantic contradiction with equivalent clarity.                                  |
| Define task-oriented operation laws such as stable identity, deterministic ordering and lossless traversal, then test provider adapters against them.              | These laws are what consumers need but OpenAPI field types do not express. | Representative consumers neither depend on nor benefit from any such law.                                             |
| Add a generated-tool review gate which compares description claims to operation laws and black-box fixtures before adoption.                                       | OCE deliberately propagates descriptions into machine decision surfaces.   | The gate produces no distinct failures across a corpus containing the known swapped-description and pagination cases. |

**Unresolved evidence:** canonical intended outputs; live endpoint samples;
consumer task logs; ordering and pagination requirements; policy disclosure
constraints; and the ownership process for public semantic wording.

---

## Lens 7: OCE code-generation correspondence (fixed lens 24)

### Governing question

What does OCE generation preserve, transform or amplify, and how can consumers
know that generated affordances correspond to the accepted public contract?

### Movement 1: reflect on raw observations

- **Observed:** OCE codegen defaults to a committed cache, validates the parsed
  document, optionally refreshes online, and generates artefacts from separate
  original, validated and SDK schema values
  ([codegen lines 34-112](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/codegen.ts#L34-L112)).
- **Observed:** its architecture states that one OpenAPI change should regenerate
  types, validators and tools without manual consumer changes
  ([principle lines 66-83](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L66-L83)).
- **Observed:** OCE's alignment runbook distinguishes the OpenAPI surface from a
  bulk surface whose schema is not committed and whose types are still template
  authored
  ([surface table and gap lines 32-46](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/engineering/upstream-api-alignment-runbook.md#L32-L46)).
- **Observed:** OCE's recorded offset/limit incident shows that an upstream
  generated file manually diverged from its source schema and that OCE reproduced
  the resulting descriptions on three generated consumer surfaces
  ([upstream pipeline and divergence lines 72-99](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/spikes/upstream-offset-limit-description-swap.md#L72-L99),
  [consumer impact lines 144-156](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/spikes/upstream-offset-limit-description-swap.md#L144-L156)).

**Inherited assumption exposed:** faithful generation is not the same as correct
generation. It can remove downstream transcription drift while perfectly
amplifying upstream semantic error or generator policy error.

### Movement 2: define the problem space

**Problem frame:** OCE must turn an accepted provider contract into several
consumer forms without undocumented loss, invention or contradiction. Structural
code generation is strong at syntax and weak at deciding whether descriptions,
examples, media types, pagination or policy claims are true. Consumers are harmed
when generated consistency creates unjustified confidence. Success is a
provenance-preserving pipeline whose transformations are total, deterministic
and tested, with semantic review and runtime conformance kept as explicit
additional obligations.

### Movement 3: reflect on possible explanations

**Competing explanation:** the known incident demonstrates that the pipeline is
doing its job: preserve the upstream contract exactly, diagnose the defect at
its source and regenerate. Consumer-side "correction" could create worse,
untraceable divergence.

**Changed assumption:** "derive, never author" is sound for duplicated structure,
but it cannot eliminate authored meaning. Descriptions, capability grouping,
task guidance and semantic laws still need a competent source and accountable
review; they should not be hidden as ad hoc generated-file edits.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** OCE's cached, deterministic generation is a valuable foundation
  and should survive.
- **Inferred:** generated consistency needs provenance and semantic conformance,
  not downstream patches, to become trustworthy.
- **Unknown:** the complete transformation-loss inventory, generator mutation
  coverage, and whether all runtime applications import only generated contract
  types as claimed.

| Warranted investigation or proposal                                                                                                                                           | Warrant                                                                                | Explicit falsifier                                                                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Introduce a typed intermediate contract representation carrying source pointers, transformations, warnings and unsupported constructs before emitting SDK, Zod and MCP forms. | Multiple targets need the same semantics and a way to explain loss or augmentation.    | Direct generators already prove total, equivalent transformations and expose actionable provenance for every emitted element. |
| Test generators with mutation and metamorphic suites: renamed fields, nullability, unions, media types, errors, pagination and deliberately misleading prose.                 | Happy-path snapshots do not establish preservation across contract classes.            | Existing tests detect every injected loss and contradiction with equivalent fault localisation.                               |
| Make semantic augmentations first-class, scoped records which cite the upstream operation and cannot contradict structural facts.                                             | Some agent-facing meaning cannot be inferred, but silent generated edits create drift. | All useful task guidance is fully derivable from accepted machine-readable operation laws.                                    |

**Unresolved evidence:** supported OpenAPI feature matrix; generator test suite;
transformation losses; augmentation ownership; runtime validation rate and
failures; and a schema-derived bulk pipeline.

---

## Lens 8: interoperability and representation (fixed lens 25)

### Governing question

Which representations preserve curriculum meaning across systems, media and
runtimes, and which are merely local encodings?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools exports snake-case schemas matching database
  columns and derived camel-case schemas for applications, while documenting
  four manually redefined camel-case exceptions
  (conversion lines 204-228,
  exceptions lines 243-252).
- **Observed:** the provider's combined lesson/transcript view aliases one field
  to `downloadsAvailable` while leaving transcript fields snake-case
  (view lines 2-26).
- **Observed:** oak-openapi represents a streamed lesson asset in the tRPC/OpenAPI
  router as `z.any()` with an empty object example and a resolver that returns
  `undefined`
  (metadata stub lines 815-840,
  generated response lines 1-5);
  a separate route actually returns object-store bytes, video redirects or
  proxied range responses
  (file streaming lines 163-229,
  video outcomes lines 230-325).
- **Observed:** the bulk endpoint returns a ZIP containing a JSON Schema and
  subject files
  (bulk assembly lines 62-113),
  while OCE records bulk as a distinct, not-yet-schema-derived surface
  ([runbook lines 32-46](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/engineering/upstream-api-alignment-runbook.md#L32-L46)).

**Inherited assumption exposed:** interoperability is not achieved by choosing
JSON or camelCase. The contract must distinguish domain identity from naming
convention and model JSON values, binary streams, redirects, ranges and archives
as different representations with explicit equivalence and loss rules.

### Movement 2: define the problem space

**Problem frame:** OCE should let consumers obtain the same curriculum meaning
through appropriate online, bulk and media representations without pretending
those transports are identical. Current seams include automatic key conversion,
mixed naming, `any` for a binary outcome and a separately governed bulk schema.
Consumers are harmed when a generated client expects JSON for bytes, when key
conversion changes accepted input semantics, or when bulk and online records
cannot be reconciled by stable identity and version. Success is one semantic
model with explicit representation profiles, content types, loss budgets and
cross-profile correspondence tests.

### Movement 3: reflect on possible explanations

**Competing explanation:** different representations are intrinsically useful:
bulk archives optimise complete transfer, GraphQL-backed JSON supports queries,
redirects preserve efficient media delivery and snake-case reflects PostgreSQL.
Forcing one physical representation would reduce interoperability.

**Changed assumption:** "one model" should mean shared semantic identity and
laws, not one wire shape. Several first-class serialisation profiles are simpler
than a false universal schema surrounded by exceptions.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** representation conversion is distributed across database views,
  schema helpers, handlers, storage routes and OCE generators.
- **Inferred:** binary, redirect and archive responses need first-class contract
  forms rather than JSON-shaped placeholders.
- **Unknown:** lossless equivalence between online and bulk data, stable content
  IDs, supported range semantics and the runtime behaviour generated clients
  expose for non-JSON responses.

| Warranted investigation or proposal                                                                                                                      | Warrant                                                                                                                         | Explicit falsifier                                                                                          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Define OCE representation profiles for online JSON, bulk records, downloadable files and streamed/redirected media over shared semantic identities.      | The observed transports have irreducibly different operational properties but should reconcile to the same curriculum concepts. | Consumers never need to correlate concepts or versions across any two representations.                      |
| Model response bodies as discriminated outcomes including JSON, bytes, redirect, partial content and archive, then generate clients from those outcomes. | `any` plus an empty JSON example cannot describe the actual asset behaviours.                                                   | The accepted OpenAPI and generated clients already preserve and safely expose every observed media outcome. |
| Add round-trip and cross-profile fixtures that prove key conversion, nullability, IDs and version provenance or explicitly record loss.                  | Automatic and manual case conversion plus mixed aliases create plausible hidden mismatch.                                       | A field inventory proves there is no semantic transformation or loss across profiles.                       |

**Unresolved evidence:** online/bulk reconciliation; content-addressing strategy;
media negotiation and range requirements; schema-format support; conversion edge
cases; accessibility metadata; and external consumer runtime constraints.

---

## Lens 9: transport, status and error semantics (fixed lens 26)

### Governing question

How should domain outcomes map to HTTP status, error bodies, headers and retry
behaviour so every OCE consumer reaches the same safe conclusion?

### Movement 1: reflect on raw observations

- **Observed:** oak-openapi's shared documented error responses list 400, 401
  and 404 only
  (error map lines 1-5).
- **Observed:** protection can throw 429 and sets rate-limit headers plus
  `X-Retry-After`
  (protection lines 19-56);
  its error formatter emits a message with optional cause/trace rather than a
  shared discriminated public error type
  (formatter lines 60-106).
- **Observed:** the asset route has separate manual error mapping and returns an
  additional `code` field for tRPC errors
  (asset error mapping lines 352-405).
- **Observed:** a lesson handler deliberately distinguishes absent content with
  404 from existing-but-policy-blocked content with 400, despite its comment
  discussing information leakage
  (lesson outcomes lines 61-93).
- **Observed:** OCE's SDK retries network exceptions and 429/503 responses using
  exponential backoff based on status, without consulting a response retry
  header
  ([retry implementation lines 44-119](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/middleware/retry.ts#L44-L119),
  [default policy lines 43-56](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/config/retry-config.ts#L43-L56)).
- **Observed:** Database Tools' mutation standard assigns structured meanings to
  200/201/400/401/403/404 and success booleans
  (status table lines 221-230),
  but the observed mutation workflow makes "safe to retry" a stronger question
  than status alone.

**Inherited assumption exposed:** an HTTP status is not a complete failure
contract. Consumers also need stable error identity, retry safety, visibility
policy, correlation, rate-limit timing and whether the operation may already
have taken effect.

### Movement 2: define the problem space

**Problem frame:** OCE centralises transport behaviour for many future consumers,
so an incorrect generic retry or error mapping is multiplied across the kit.
The current provider uses different error-body paths, documents fewer outcomes
than runtime can emit and exposes a non-standard retry header which the SDK does
not use. Consumers are harmed through retries at the wrong time, loss of domain
distinctions, inconsistent diagnostics and unsafe assumptions after ambiguous
failure. Success is one explicit outcome algebra mapped consistently to standard
HTTP semantics and generated consumer result types, with retry policy derived
from operation traits and server signals.

### Movement 3: reflect on possible explanations

**Competing explanation:** all current public OpenAPI operations are reads, and
simple status-based exponential retry may be an effective conservative default.
The separate asset route has materially different streaming requirements and may
justify a specialised adapter while retaining equivalent public errors.

**Changed assumption:** transport abstractions should not erase HTTP. Standard
status and headers are interoperable protocol facts; domain outcome types should
make them easier to handle consistently, not replace them with one generic
exception.

### Movement 4: synthesise and propose

**Synthesis:**

- **Inferred:** the provider and OCE SDK currently share an implicit rather than
  fully specified retry contract.
- **Inferred:** status-only retries are acceptable only for operations whose
  safety and idempotency are known; that assumption cannot automatically extend
  to future mutation capabilities.
- **Unknown:** production error distribution, exact response headers, consumer
  handling, retry amplification and information-disclosure policy.

| Warranted investigation or proposal                                                                                                                                                    | Warrant                                                                                                                                                | Explicit falsifier                                                                                                                                |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| Define a versioned public problem-details algebra with stable machine code, human detail, correlation ID, retry classification and optional field violations.                          | Current paths emit related failures through different body shapes and incomplete documentation.                                                        | Every consumer task can already distinguish and handle all failures safely using the existing shapes without route-specific logic.                |
| Generate SDK results and retry policy from explicit operation traits (`safe`, `idempotent`, `retryable`) plus status and standard `Retry-After`, with bounded jitter and cancellation. | Status alone cannot establish whether repeating a future command is safe, and the server already supplies timing information under a different header. | Measured behaviour shows the existing fixed exponential policy is optimal, standards-compatible and safe for every present and planned operation. |
| Build a transport conformance matrix covering status, body, headers, CORS, ranges, redirects, rate limits and ambiguous upstream failure for each response class.                      | JSON, manual streaming and future mutation routes have different adapters but must preserve coherent outcomes.                                         | One existing end-to-end suite already proves the complete matrix across every adapter.                                                            |

**Unresolved evidence:** live headers and bodies by route; standard versus custom
rate-limit semantics; retry volume and budgets; cancellation; correlation and
trace policy; disclosure rules; SDK error ergonomics; and mutation idempotency.

---

## Cross-lens synthesis

The common thread is not "schemas." It is a chain of claims:

`domain obligation -> provider authority -> projection -> public operation ->`
`accepted OpenAPI release -> generated OCE capability -> observed consumer outcome`.

Each arrow is a distinct transformation and therefore a distinct proof
obligation. The most valuable ideas to preserve are:

1. versioned provider projections as replaceable implementation adapters;
2. a strict public HTTP boundary for OCE consumers;
3. hermetic, schema-derived OCE generation;
4. runtime validation at trust boundaries; and
5. explicit workflow phases where work is genuinely asynchronous.

The concepts which should not survive as OCE foundations are:

1. a universal "single source of truth" without boundary competence;
2. generated consistency as a substitute for semantic or runtime conformance;
3. provider resolver, MV or package topology as consumer vocabulary;
4. JSON object schemas standing in for binary, redirect or archive behaviour;
   and
5. generic status-based retry detached from operation safety and durable outcome.

The truer OCE basis is **semantic capability contracts, plural competent
authorities, provenance-preserving derivation, executable operation laws and
first-class outcome protocols**. This basis can enable many consumers without
requiring a second-consumer trigger, while keeping the kit responsible only for
knowledge that should be correct once for all of them.
