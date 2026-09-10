# OCE consumer and generation correspondence

## Scope and core judgement

**Status:** source-grounded static analysis plus one local, lockfile-checked and
network-guarded contract comparison; deployed generation, live data completeness
and production bulk artefacts remain untested

**Pinned sources:**

- [`OCE@bd878a3a`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa)
- `oak-openapi@2fb1383b`
- `Database-Tools@3d1eff31`

OCE makes a valuable architectural choice: it consumes Oak's published HTTP
API rather than binding applications to Hasura, PostgreSQL, materialized-view
names or Elasticsearch
([boundary](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L7-L10)).
That boundary is worth preserving. The current implementation nevertheless
shows that an HTTP boundary alone does not provide semantic independence.

The transformation is:

```text
Database-Tools release state and projections
  -> Hasura GraphQL
  -> oak-openapi handlers, policy and Zod/OpenAPI
  -> committed OCE OpenAPI cache
  -> decorated OCE schema
  -> generated HTTP types, Zod, response maps and primitive MCP tools
  -> authored SDK capabilities and aggregate MCP tools
  -> search, bulk, apps and downstream products
```

**Inferred core judgement:** OCE currently mixes four legitimate but distinct
responsibilities:

1. retaining a reviewed upstream contract snapshot;
2. compiling that contract into executable transport machinery;
3. adding OCE-owned resource links and capability semantics;
4. repairing incompleteness or awkwardness in the upstream API.

The first three deserve explicit names and contracts. The fourth is evidence
about a missing upstream capability, not a foundation for a framework.

## Contract input and build authority

### A reviewed snapshot with an unreviewed deployment branch

**Observed:** code generation normally reads the committed OpenAPI cache.
`--online`, `SDK_CODEGEN_MODE=online` or `VERCEL=1/true` selects a live fetch
instead
([selection](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/resolve-schema-source.ts#L4-L16),
[decision](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/resolve-schema-source.ts#L34-L40)).
The live URL is hard-coded in the generator
([load](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/codegen.ts#L88-L99)),
independently of the schema URL already represented in SDK configuration.

**Inferred:** the same OCE revision has two build authorities:

| Context               | OpenAPI authority                    | Review property                                      |
| --------------------- | ------------------------------------ | ---------------------------------------------------- |
| local and ordinary CI | commit-pinned cache                  | schema change appears in the source diff             |
| Vercel                | mutable live oak-openapi response    | deployment can compile a contract absent from commit |
| advisory drift check  | another independently hard-coded URL | reports any value drift, never gates                 |

This is not a freshness versus determinism trade-off that OCE needs to accept.
A release should be built from reviewed immutable inputs. Upstream discovery is
a separate update workflow that proposes a new input and supplies compatibility
evidence.

**Observed contradiction:** accepted ADR-161 says schema-drift checks that reach
the network must not run in PR/push checks
([decision](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/architectural-decisions/161-network-free-pr-check-ci-boundary.md#L65-L104)),
but the main CI build performs the live advisory check
([workflow](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.github/workflows/ci.yml#L130-L149)).

### Drift is difference, not compatibility

**Observed:** drift comparison recursively sorts object keys but otherwise
compares every JSON value
([canonicalisation](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/agent-tools/src/ci/ci-schema-drift-eval.ts#L38-L74)).
It therefore treats prose edits and breaking contract changes alike. Fetch
failures, missing cache and drift all remain advisory; the command always exits
successfully
([runner](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/agent-tools/src/ci/ci-schema-drift-check.ts#L1-L7),
[outcomes](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/agent-tools/src/ci/ci-schema-drift-check.ts#L93-L127)).

**Observed experiment:** OCE's cache names upstream revision
`8eceb702a45a5746af6a407a7a5d377ae7ec0c83`. It is an ancestor of the pinned
oak-openapi revision and is ten commits behind it. A local invocation of the
pinned oak-openapi Swagger route under a fixed environment, a matching installed
lock snapshot and an in-process network guard produced 32 paths and 32 component
schemas, the same as OCE's cache. After removing deployment metadata, prose,
examples and the cache-only `bearerFormat`, the documents were byte-identical
after sorted JSON serialization. Keeping prose exposed one changed
`downloadsAvailable` description. The historical
[provider/consumer comparison](../../../evidence-harness-provenance.md#openapi-providerconsumer-comparison)
recorded the import, sanitisation, semantic/structural projections, SHA-256
digests and exact difference paths together with the Node/lockfile boundary.
The guard covers common Node network entry points but is not OS-level isolation,
and installed dependency files are not content-verified.

**Inference:** OCE was structurally aligned with the pinned provider at those
snapshots, but its
drift check would report a non-breaking metadata edit without saying whether any
consumer can be harmed. Alignment is a compatibility relation over real uses,
not JSON inequality.

## Original contract and OCE projection

### Useful separation, implicit semantics

**Observed:** generation retains the original provider document and derives a
separate SDK schema
([separation](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/schema-separation-core.ts#L16-L27)).
The derived schema adds optional `oakUrl` properties to components selected by
name heuristics and exceptions
([selection](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts#L18-L47),
[decoration](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/schema-separation-decorators.ts#L134-L158)).
URL construction is independently authored route knowledge derived from OWA and
live behaviour, not from the OpenAPI document
([generator](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts#L1-L17),
[routes](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/routing/generate-url-helpers.ts#L94-L158)).

**Inferred:** `oakUrl` is not upstream data decoration. It is an OCE-owned link
resolution capability whose inputs include resource identity, curriculum
placement and OWA routing policy. Calling it generated OpenAPI output hides both
its authority and its conformance obligation.

A truthful separation is:

```text
provider contract snapshot
  + OCE link-policy revision
  -> OCE client contract projection
```

That projection should be tested against link-resolution examples and OWA route
conformance without requiring OWA's route implementation to become the design.

### OCE narrows open responses

**Observed:** generated Zod objects are forced strict and emitted with
`additionalProperties: false`
([configuration](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/core/openapi-zod-client-adapter/src/generate-zod-schemas.ts#L58-L90)).
Of 269 object-schema nodes counted in the cached upstream document, 253 already
declare `additionalProperties: false`. Sixteen nested quiz-question and answer
objects omit it, so OpenAPI leaves those objects open while OCE closes them. The
count and exact paths were recorded by the historical
[Database/API chain inventory](../../../evidence-harness-provenance.md#databaseapi-chain-inventory).
Runtime response augmentation handles successful JSON GETs, but validation or
augmentation failures fall back to the raw response
([middleware](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts#L27-L69),
[fallback](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/client/middleware/response-augmentation.ts#L85-L112)).

**Inferred failure mode:** an additive provider field on one of those sixteen
open nested objects can be compatible under OpenAPI, rejected by the OCE
validator, silently prevent link augmentation for a direct SDK call, and fail
strict MCP output validation. Different OCE surfaces then impose different
contracts over one HTTP response.

This is a more important compatibility seam than cache staleness. Request
objects should normally be closed. Responses should preserve unknown fields
unless the provider explicitly closes them, with one explicit error/fallback
policy at the transport boundary.

## MCP compilation correspondence

### What survives and what disappears

The upstream snapshot contains 32 GET operations. OCE generates 29 primitive
MCP tools, intentionally skipping lesson search, transcript search and binary
asset delivery
([skip set](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts#L28-L35)).

| OpenAPI concern                          | Primitive MCP result                                                                                                |
| ---------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| inline operation path/query parameters   | represented                                                                                                         |
| operation ID                             | retained as lookup metadata; tool name is path-derived                                                              |
| documented response statuses and bodies  | represented and runtime-validated                                                                                   |
| parameter enum/default/example/required  | represented                                                                                                         |
| path-level or `$ref` parameters          | ignored                                                                                                             |
| header and cookie parameters             | ignored                                                                                                             |
| request bodies                           | ignored                                                                                                             |
| format, pattern, range and length        | not carried by the parameter metadata model                                                                         |
| response headers                         | discarded by execution                                                                                              |
| security                                 | supplied from a separate authored policy                                                                            |
| read-only/idempotent/destructive meaning | hard-coded as read-only, idempotent and non-destructive, even though the operation iterator also admits write verbs |

The parameter walk and metadata model establish these limits
([operations](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/mcp-tool-generator.ts#L62-L157)).
Five current `limit` parameters declare `maximum: 100`; generated primitive MCP
input schemas contain an unconstrained `z.number()`. The generic executor returns
only status and payload
([execution](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts#L93-L112)),
so `Link: rel="next"` pagination described by upstream operations cannot be
followed through this boundary. Annotation constants are independent of the
source operation
([annotations](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts#L135-L145)).

**Inferred:** this is a partial compiler with an unstated supported language.
It happens to accept the current provider document because that document mostly
uses a small subset of OpenAPI. Excellence requires totality over a declared
subset: every relevant construct is either preserved, deliberately transformed,
or rejected at generation time with a precise diagnostic.

### Generated primitives and authored capabilities

**Observed:** OCE combines the 29 primitive tools with 13 explicitly authored
tools, including search, fetch, curriculum orientation, graph traversal,
browsing, exploration and asset download
([registry](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts#L112-L165)).
The type declaration correctly calls these hand-written tools that combine
multiple API calls
([type](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts#L65-L97)).

This distinction is real value:

- primitive operations preserve public API reachability;
- authored capabilities express user intent, composition and OCE-owned meaning;
- one universal registry lets products expose both coherently.

The better architecture makes that distinction stronger. A contract compiler
should emit transport declarations and generic execution. Domain capabilities
should be authored against the declarations, with their own stable identities,
inputs, evidence and conformance tests. They should not pretend to be automatic
translations of endpoints.

## Complete curriculum enumeration

### A workaround that reveals a missing capability

ADR-083 is unusually valuable evidence because it records a user-impact failure:
roughly half of Maths KS4 lessons had been absent from the search index when a
truncated unit-summary projection was treated as an enumeration source
([finding](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md#L8-L44)).
It requires exhaustive pagination and preservation of unit, tier and programme
relationships
([decision](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md#L57-L110),
[pagination](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md#L123-L169)).

**Observed:** the active workaround accepts a unit list and fetches each unit
once at `limit: 100`, without offset or `Link` traversal
([implementation](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/src/lib/indexing/fetch-all-lessons.ts#L106-L170)).
It is complete only if the input unit list is exhaustive and no unit has more
than 100 placement rows. Aggregation retains lesson slug/title and a set of unit
slugs, but no programme, sequence, tier, exam-board, variant or placement order
([model](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/src/lib/indexing/lesson-aggregation.ts#L15-L34),
[aggregation](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/src/lib/indexing/lesson-aggregation.ts#L61-L97)).
The tier-variant test supplies identical duplicate lesson rows intended to
simulate tier variants, but asserts only two unique lessons
([test](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/src/lib/indexing/fetch-all-lessons.unit.test.ts#L262-L293)).

**Inferred:** “all lessons” is not a trustworthy primitive in the current API.
OCE reconstructs it by joining two incomplete claims and then discards some of
the relationship identity that made the reconstruction necessary.

The OCE kit needs a first-class published placement relation:

```text
CurriculumPlacement(
  release,
  lesson revision,
  unit variant,
  programme,
  sequence,
  tier/exam-board/pathway context,
  position,
  publication state
)
```

It should be available as a cursor-paged relation and as an immutable snapshot,
with a watermark and explicit completeness claim. Whether PostgreSQL, an MV or
another store implements it is not part of the public concept.

## Bulk data is a separate contract

### Three schemas that do not derive from one another

OCE has three apparent bulk authorities:

1. the JSON Schema supplied in the downloaded archive and committed as
   `bulk-downloads/schema.json`;
2. hand-authored TypeScript template strings described as a generator;
3. generated Zod output consumed by the bulk reader.

**Observed:** `bulkgen.ts` invokes the template generator without reading the
JSON Schema
([entry point](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/bulkgen.ts#L15-L30),
[writer](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/generate-bulk-schemas.ts#L43-L75)).
The lesson and unit definitions are hand-authored source strings
([lesson](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/schema-templates-part2.ts#L13-L65),
[unit](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/schema-templates-part3.ts#L10-L90)).

Static correspondence produced counterexamples in both directions:

| Included JSON Schema                                                | Generated OCE Zod template                                       |
| ------------------------------------------------------------------- | ---------------------------------------------------------------- |
| requires lesson `oakUrl` and `canonicalUrl`                         | omits both, so strict parsing rejects them                       |
| permits lesson `restricted`                                         | omits it                                                         |
| requires unit `canonicalUrl` and `subjectSlug`                      | omits both                                                       |
| models singular `examBoard`, tier, pathway, categories and subjects | omits them but permits a plural `examBoards` field               |
| constrains integers and enums                                       | accepts broad numbers and strings in several corresponding sites |
| permits array or null `contentGuidance`                             | additionally accepts the string sentinel `"NULL"`                |

**Inferred:** a document valid against the archive's JSON Schema can fail OCE's
runtime reader, while a document accepted by OCE can be invalid against the
archive schema. The generated label provides reproducibility of the templates,
not correspondence with the producer contract.

### Snapshot integrity and completeness

**Observed:** the downloader requests 32 subject-phase files, extracts over the
existing directory and writes a manifest containing only timestamp, source,
filename and size
([request set](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/scripts/download-bulk.ts#L26-L73),
[publication](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/scripts/download-bulk.ts#L94-L164)).
The committed manifest records 30 curriculum files plus `schema.json`; both
RSHE/PSHE phases expected by the README are absent. It records no content hash,
schema digest, upstream release, query/policy revision, record or relationship
counts, source watermark, requested-versus-returned coverage, or validation
result.

**Inferred:** it is a download receipt, not a release manifest. Extraction over
an old directory also makes a mixed-generation snapshot possible. File presence
and non-empty parsing cannot prove curriculum completeness.

A robust bulk product is an immutable, content-addressed curriculum snapshot:

- producer-issued release and schema identities;
- per-file hashes and record/relationship counts;
- explicit subject-phase coverage and justified exclusions;
- source and policy watermarks;
- schema plus relational and semantic validation results;
- temporary download and validation followed by atomic publication;
- retention and supersession semantics.

This could replace separate endpoint-crawling, cache-warming and bulk ingestion
machinery for consumers that need a coherent complete corpus. Live APIs remain
valuable for bounded, current interactions; they need not be the extraction
protocol for every product.

## Concepts that survive

| Concept worth retaining                    | Why it carries independent value                                                                         |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| published HTTP boundary                    | prevents downstream binding to storage and projection implementation                                     |
| immutable reviewed provider-contract input | makes generation reproducible and changes inspectable                                                    |
| original versus consumer projection        | permits OCE-owned semantics without rewriting provider evidence                                          |
| generated transport declarations           | removes hand-written endpoint/type/validator repetition                                                  |
| runtime boundary validation                | gives external data an executable trust boundary                                                         |
| authored domain capabilities               | provides intent-level operations that no endpoint-to-tool translation can infer                          |
| complete curriculum placement relation     | preserves the many-to-many, ordered and variant-aware structure consumers actually need                  |
| coherent offline curriculum snapshot       | supports indexing, research and additional consumers without reconstructing a release request by request |
| explicit compatibility evidence            | distinguishes harmless drift from a change that breaks a real consumer                                   |

## Premises to reject or retest

| Current premise                                                | Why it is not a foundation                                                             |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| deployments should fetch the freshest schema during generation | makes a reviewed source revision compile against an unreviewed input                   |
| semantic JSON inequality is a useful drift decision            | does not classify compatibility, provenance or consumer impact                         |
| valid OpenAPI automatically yields a valid MCP capability      | the compiler accepts only a silent subset and loses headers and constraints            |
| every useful tool should correspond to one endpoint            | OCE's authored tools demonstrate that stable intent often crosses transport operations |
| all lessons can be reconstructed by endpoint choreography      | completeness depends on hidden limits, input coverage and lost placement identity      |
| “generated bulk schema” means producer-contract-derived        | current output is generated from parallel hand-written templates                       |
| endpoint crawl and bulk archive are independent products       | both can be projections of one immutable published curriculum release                  |
| an OWA URL is just another response field                      | it is an OCE-owned resource-link policy with independent authority and conformance     |

## Better architectural basis

```text
PublishedCurriculumRelease
  contains exact revision identities and CurriculumPlacements
  declares scope, lineage, digest and completeness
  yields:
    - a content-addressed snapshot for whole-corpus consumers
    - cursor-paged query relations for bounded live use

PolicyDecision
  is independently identified and contextual to principal, use, referent and time
  supplies decision, reasons, obligations and policy revision at use time

ProviderContractSnapshot
  is immutable, reviewed and compatibility-classified
  compiles through a lossless ContractIR
  yields transport declarations, validators and a generic executor

OceCapability
  has a stable domain identity and explicit result semantics
  composes transport declarations and OCE-owned services
  adapts thinly to TypeScript, MCP, apps and future consumers

ResourceLinkPolicy
  resolves public links from stable resource identity and placement context
  is versioned and conformance-tested independently of transport generation
```

“Lossless” here does not mean OCE must implement all of OpenAPI. It means the
supported subset is explicit and total: every encountered operation, parameter,
body, status, header, security rule and constraint is represented or generation
fails. An intentional transformation is recorded as a projection, never silent
loss.

## Decisive investigations

| Experiment                                                      | Claim tested                                                                   | Explicit invalidator                                                                                     |
| --------------------------------------------------------------- | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- |
| compare cached and Vercel-mode generated trees from one commit  | deployment has a second build authority                                        | infrastructure demonstrably prevents live mode or the outputs are cryptographically tied to one input    |
| compile a golden OpenAPI feature matrix                         | the MCP generator's supported language is incomplete and implicit              | all required constructs are preserved or explicitly rejected with passing totality tests                 |
| replay an additive response field through SDK and MCP           | OCE's strict narrowing makes an upstream-compatible addition surface-dependent | every surface preserves and validates the response under one documented policy                           |
| generate mutual JSON-Schema/Zod counterexamples                 | bulk validators disagree                                                       | both accept exactly the same valid corpus and reject the same invalid corpus                             |
| enumerate a unit with more than 100 placements                  | per-unit fetch can truncate silently                                           | cursor/offset exhaustion is observed or an enforced producer invariant makes the cardinality impossible  |
| replay one lesson across tier/programme variants                | indexing loses placement identity                                              | every required placement dimension survives into the index and downstream queries                        |
| verify every generated `oakUrl` against declared route cases    | link projection has hidden OWA-derived authority                               | links derive from a versioned common route contract with exhaustive conformance                          |
| classify prose, additive, narrowing, removal and security diffs | drift detection is not compatibility assurance                                 | automated classification plus consumer contract tests distinguish and gate every relevant category       |
| validate a downloaded snapshot before atomic publication        | current manifest cannot prove integrity or completeness                        | producer manifest, hashes, coverage, counts and relational checks jointly establish the advertised claim |

## Unresolved evidence

- Whether Vercel deployment configuration overrides or bypasses the observed
  live-generation branch.
- Whether oak-openapi enforces fewer than 101 lesson placements per unit through
  an invariant not represented in its public contract.
- Whether a different unpublished relation provides complete programme/tier
  placement identity.
- Whether current production bulk archives contain one lesson per unit because
  of oak-openapi's `limit: 1` bulk query; the source proposition is recorded in
  [API runtime, contract and policy](api-runtime-contract-and-policy.md), but
  deployed artefact counts have not been inspected.
- Which OCE capabilities actually require immediate freshness rather than a
  named published release, and what bounded staleness those outcomes tolerate.
