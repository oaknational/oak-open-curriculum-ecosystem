# API runtime, contract and policy

## Scope and core judgement

**Status:** source-grounded public API model plus local schema comparison;
networked dependencies, live responses, bulk artefacts and traffic remain untested

**Pinned sources:**

- `oak-openapi@2fb1383b`
- `Database-Tools@3d1eff31`
- [`OCE@bd878a3a`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa)

oak-openapi is a public compatibility façade across several independently
versioned systems:

| Data/control plane                            | Local evidence                                                                                                                         | Public responsibility introduced                                      |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Hasura and version-named database projections | `owaClient.ts` | curriculum reads, joins, cache directives and projection-version lock |
| Redis                                         | `apikeys.ts`   | API-key identity, usage mutation and rate limiting                    |
| separate Prisma/Accelerate database           | `schema.prisma`       | transcript search corpus and ranking                                  |
| GCS and Mux                                   | asset route and bulk scripts                                                                                                           | binary delivery, redirects, ranges and offline packages               |
| committed query-gate JSON                     | `queryGate.ts` | text, quiz and asset rights decisions                                 |
| Sanity                                        | CMS client and queries                                                                                                                 | public documentation content                                          |
| PostHog/Datadog                               | analytics/logging modules                                                                                                              | usage and operational evidence                                        |

**Inferred:** `owaClient.ts` is a manually maintained dependency lockfile for
data meaning. It pins independently versioned MVs/functions but no one upstream
curriculum release or source snapshot. Hand-written GraphQL result interfaces
include explicitly unknown `any` shapes
(lesson types);
there is no generated GraphQL query/result contract to fail when a projection
changes.

## Representative trace: lesson summary

`GET /api/v0/lessons/{lesson}/summary` crosses these authorities:

1. The Next catch-all adapter invokes tRPC-to-OpenAPI
   (route).
2. `protectedProcedure` performs Redis identity lookup, usage writes and rate
   limiting through request context/protection
   (context,
   protection).
3. A committed copyright-text policy runs before the main query
   (gate).
4. Hasura reads `published_mv_lesson_openapi_1_2_3` with a five-minute cache
   directive
   (query).
5. The handler reconstructs unique unit/programme variants and adds canonical/Oak
   URLs
   (transformation).
6. A second rights decision can override the MV's
   `hasDownloadableResources`
   (override).
7. Runtime output is parsed through the handler Zod/OpenAPI schema
   (schema).
8. The database MV combines synthetic curriculum placements, quizzes, assets,
   videos, TPC, guidance and supervision into a denormalized relation created
   `WITH NO DATA`
   (projection).
9. The OpenAPI document carries the result into OCE generation, which emits path
   types, response maps, Zod and an MCP tool.

**Inferred:** Database-Tools publishes a broad read model, but the façade still
owns domain reconstruction, URL identity and rights correction. This is split
semantic authority, not a simple data-access/application layering.

**Observed contradiction:** A comment claims the extra existence query avoids
revealing blocked versus missing lessons, but absent lessons return `404` and
existing blocked lessons return `400` with an explicit copyright message
(branch).
Accurate absence classification may be valuable; the claimed privacy property is
not implemented.

## Public schema production

**Observed:** Thirty-two active GET procedures combine through sixteen routers.
Source handler schemas, generated/decorated schemas and examples are committed as
separate populations. `trpc-to-openapi` derives a document from the composed
router
(generation).

**Observed contradiction:** The repository's schema-first directive says Zod
drives handler, documentation and generated output, while its core directive says
the generator is broken and both source and generated schemas must be edited by
hand
(intended path,
current exception).
The generator also does not establish stale-output deletion.

**Observed experiment:** The historical
[provider/consumer comparison](../../../evidence-harness-provenance.md#openapi-providerconsumer-comparison)
fixed the child environment, verified that oak-openapi's installed pnpm lock
snapshot matched its committed lockfile, blocked common Node network entry
points, generated the pinned provider document in memory, filtered it through
the served Swagger route, read OCE's cached input from its pinned Git object,
and compared canonical projections. Both documents contained 32 paths, 32 GET
operations and 32 component schemas. Their structural projections had the same
SHA-256 digest.
The semantic projection has one difference: removal of an obsolete
`downloadsAvailable` description. OCE is therefore structurally aligned with this
provider pin at those pinned revisions.

**Evidence limit:** The harness does not call Hasura, Redis, Prisma or a deployed
HTTP route. It cannot detect runtime/output divergence, policy failure,
incomplete data, ordering, binary semantics or misleading prose. Equality at
these two revisions is snapshot correspondence, not a compatibility policy or a
claim that future generation is lossless. The in-process network guard is not OS
isolation, and lockfile equality does not content-verify installed dependency
files; the evidence records that residual environment boundary explicitly.

**Observed:** The Swagger route removes internal operations by mutating the
shared imported document
(route).

**Proposition:** The served representation and other users of the imported
singleton can become call-order dependent in a long-lived process. A repeated
route invocation and import-order test would establish whether that state is
observable in the deployed runtime.

## Binary assets are a shadow contract

**Observed:** The tRPC procedure for
`/lessons/{lesson}/assets/{type}` exists to emit metadata, returns `undefined`,
and uses `z.any()` output
(stub).
The real Next route separately implements authentication, errors, analytics, GCS
streaming, Mux fallback, redirect, cache/range handling and multiple response
types
(runtime route).

**Inferred:** The emitted OpenAPI JSON response is not the executable binary
contract. Runtime may return octet-stream, video, redirect, not-modified or range
errors, while auth/error logic is duplicated outside the generated path.

The valuable concept is an authorised asset capability. It does not imply API
proxying: an asset manifest plus short-lived direct object/CDN authority may make
stream/range/caching semantics both simpler and more truthful.

## Bulk export is a separate, currently divergent product

### Completeness

**Observed:** The combined lesson-data query requests `limit: 1`
(query),
while bulk preparation treats the result as every lesson for a unit
(consumer).
History shows the preceding direct-SQL implementation had no such limit. The
live test asserts non-empty/type shape but not expected completeness
(test).

**Inferred:** Scheduled metadata exports can contain one lesson per unit. This is
a high-confidence source proposition; inspecting current production artefact
counts is decisive.

### Asset policy and return contract

**Observed:** Any non-empty `INCLUDE_ASSETS` value, including the string `false`,
enables asset mode
(configuration).
The rights-gate set is populated only in the no-assets branch, then asset mode
checks the still-empty set
(branch).
The asset query has no equivalent gate
(asset data).

Only no-assets mode pushes into the returned lesson array. Asset mode writes
JSONL but returns an empty array, causing the main JSON to contain no lessons and
the later `if (lessons.length)` upload branch not to run
(write/return,
upload guard).

**Observed:** A bulk checker performs schema validation followed by referential
integrity checks
(checker).
The root package exposes it as a separate `bulk:schema-check` command; neither
the `test` nor `bulk` script invokes it
(scripts).
A lesson-count invariant is commented out
(invariant).

**Inferred:** Online API and bulk are separate code paths without a shared
release/snapshot, rights decision or completeness proof. OCE should preserve
complementary live and offline capability while generating both from one
deterministic published release.

## Rights policy as compensating architecture

**Observed:** `queryGate.ts` calls itself a short-term October 2024 solution but
remains the policy boundary in July 2026
(header).
Separate committed datasets implement text, assets and quiz decisions with
different allow/deny defaults. Database flags are then corrected in handlers.

**Inferred:** The lists preserve real rights knowledge and user protection, but
their role is compensating: authority is not expressed as one explainable
capability decision on a published content revision. Policy repairs have
accumulated because different delivery paths need separate correction.

A stronger concept is:

```text
decide(principal, content revision, intended use, territory, time)
  -> allowed capabilities + reasons + attribution obligations + policy revision
```

The exact policy engine/storage remains open. Reconciliation against competent
rights records and historical decisions is the discriminating experiment.

## Catalogue and search authority

### Circular subject generation

**Observed:** The subject/key-stage generator calls the local `/subjects`
endpoint for slugs
(generator),
while `/subjects` derives its result from the already committed catalogue
(handler).

**Inferred:** A new upstream subject cannot enter through this generation loop.
The file is a manually advanced product catalogue despite its generated label.

### Separate transcript-search plane

**Observed:** Transcript search queries the Prisma database rather than Hasura
(search).
Relevance restoration compares lesson IDs with lesson slugs, so intended ordering
cannot work unless those values happen to coincide. Raw `to_tsquery` construction
also receives unnormalised public text.

**Inferred:** “Search” is not a projection of the same release model. Corpus
identity, indexing watermark, ranking semantics and result-to-curriculum
correspondence are separate and invisible to the response.

## Query construction, ordering and pagination

**Observed:** One public `unit` string is interpolated directly into a GraphQL
document rather than bound as a variable
(query);
its Zod schema accepts an unrestricted string
(input).

**Proposition:** Crafted input can alter GraphQL query structure or impose
unexpected work. A parser-level crafted-input test is required before claiming
exploitability; the unsafe construction itself is observed.

**Observed:** Questions pagination computes `Link` from raw rows and then removes
blocked/no-question results; the source warns of the mismatch
(pagination).
Sequence questions promise curriculum order but use `_in`, `distinct_on`,
offset/limit and no `order_by`
(sequence query).

**Inferred:** Sparse pages, phantom next links and unstable ordering are natural
consequences of post-query policy filtering and offset pagination without a total
order. Deterministic cursor pagination must operate on the final authorised
result relation, not raw candidates.

## Contract inaccuracies and status semantics

Observed examples establish different failure modes:

| Contract claim                                  | Runtime/source behaviour                        | Evidence                                                                                                                                                                                                           |
| ----------------------------------------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/subjects` rich subject objects                | handler returns strings                         | subjects                                                                 |
| programme description is authoritative          | inline note says it references hallucinations   | programme metadata                                                   |
| missing programme has a documented client error | vanilla `Error` produces server failure         | missing path                                                       |
| pagination descriptions match fields            | generated offset/limit descriptions are swapped | generated schema |
| changelog is public at runtime                  | OpenAPI defaults it bearer-protected            | public procedure                                                        |

**Inferred:** OpenAPI can be structurally valid and generate excellent clients
while teaching false semantics. Contract excellence needs executable HTTP
conformance, status taxonomy and representative semantic assertions, not only
schema generation.

## Identity, rate policy and observability

**Observed:** API keys appear in plaintext Redis key names/values. Authentication
also increments usage and writes `lastRequest`, so identity verification depends
on successful Redis mutation
(key flow).
Analytics hashes API keys before attribution, but records full URLs, query strings
and parsed request arguments
(analytics).

**Inferred:** Authentication, accounting, quota and analytics are tightly coupled.
A write outage can become an auth outage; high-cardinality arguments may carry
more person/content context than the operational purpose needs. Actual retention,
access and downstream redaction are external unknowns.

**Observed:** Health checks resolver queryability, not freshness, counts,
semantic validity or response conformance
(health).
Pingdom queries the lesson-search function with only `limit`, while the SQL
function requires `search_term`
(probe,
function).

**Proposition:** That probe persistently fails unless Hasura/default behaviour
supplies the missing argument. A live request is decisive.

## Version and release meaning

The system exposes independent version axes:

- each MV/function name;
- public API/changelog version `0.7.0`;
- package version `1.0.0`;
- Git tag lineage around `v0.5.0`;
- deployment commit SHA in the OpenAPI document;
- rights-list commit;
- OCE cached schema version and release; and
- unreported curriculum/search/bulk source snapshots.

**Inferred:** None is a coherent curriculum release identity. Compatibility can
be true at the transport shape while data planes represent different source
times or policy revisions.

## Concepts worth preserving

- a strict public HTTP boundary for independent consumers;
- task-oriented curriculum discovery rather than exposing generic database CRUD;
- canonical public links and explicit source attribution;
- runtime request/output validation and machine-readable contracts;
- complementary low-latency query and complete offline/bulk access;
- API-key/quota capability for fair public service protection; and
- hermetic downstream code generation from a reviewed public contract.

## Stronger basis to investigate

1. An explicit curriculum model distinguishes programme, sequence, unit variant,
   placement/occurrence, lesson content revision, assessment, asset and rights
   capability.
2. A coherent published release carries snapshot ID, semantic schema version,
   source revisions, generated time, rights-policy revision, counts and checksums.
3. One deterministic projection pipeline produces query/API and bulk artefacts
   from that release, with atomic publication and reconciliation evidence.
4. One executable contract definition derives handlers, OpenAPI, validators,
   examples, clients and tests; exceptional binary protocols have first-class
   representations rather than metadata stubs.
5. Typed ports isolate curriculum data, search, identity/quota, rights policy,
   object storage and telemetry. Domain services do not know MV or provider names.
6. Rights decisions return capabilities, reasons and obligations for a principal,
   revision, intended use, territory and time.
7. Ordering and cursor pagination are explicit semantic contracts over the final
   authorised relation.
8. Liveness, readiness, dependency health, projection freshness and semantic
   canaries are different signals.
9. Hermetic unit tests, adapter contracts, HTTP conformance, consumer contracts
   and separately labelled live smoke tests establish different claims.

## Decisive experiments

| Question                                    | Direct probe                                                                                                   | Discriminating result                                                                                         |
| ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Are current bulk artefacts complete?        | compare expected published lesson set per unit/release with every production export                            | any omission confirms the `limit: 1` consequence; complete artefacts require locating a different active path |
| Do runtime responses honour OpenAPI?        | exercise success, each error class, binary, redirect, range and pagination through an HTTP conformance harness | exact status/header/body conformance invalidates local mismatch propositions for tested paths                 |
| Are rights paths coherent?                  | reconcile all gate lists and endpoint/bulk decisions with authoritative rights metadata                        | complete agreement plus one policy revision weakens the compensating-policy reading                           |
| Do pinned views form one release?           | record refresh/source watermarks and cross-entity counts for all resolver constants                            | common atomic release ID invalidates the fragmented-snapshot proposition                                      |
| Is GraphQL interpolation exploitable?       | submit quotes, braces, directives and expensive filters under controlled limits                                | parser-safe rejection and bounded work would narrow the risk to maintainability                               |
| Does transcript ranking preserve relevance? | compare returned order for IDs distinct from slugs and punctuation-rich queries                                | correct deterministic ranking would invalidate the ID/slug reading                                            |
| Which endpoints are real consumer jobs?     | trace representative OCE and external workflows through all 32 operations                                      | endpoints with no independent job may be compensating query shapes rather than enduring kit capabilities      |

## Unresolved external evidence

- deployed dependency versions and environment bindings;
- operation traffic, latency, error and rate-limit distribution;
- production bulk contents and consumers;
- live rights authority, exception rationale and review process;
- current search corpus identity, freshness and relevance evidence;
- API-key retention, operational access and telemetry governance;
- post-deploy conformance or platform-level controls outside the repository; and
- user/developer evidence for the public API's 32 task boundaries.
