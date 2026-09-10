# Repository and contract atlas

## Scope and method

**Status:** revision-exact structural baseline; the linked authority, runtime,
consumer, journey and concept records complete the planned source-bounded static
pass while deployed behaviour and external outcome evidence remain open

This atlas describes the bounded chain at three clean revisions:

| Repository     | Revision                                                                                                                 | Package version |                          Tracked files |
| -------------- | ------------------------------------------------------------------------------------------------------------------------ | --------------- | -------------------------------------: |
| Database-Tools | `3d1eff31`                | `2.15.0`        |                                  1,538 |
| oak-openapi    | `2fb1383b`                   | `1.0.0`         |                                    457 |
| OCE            | [`bd878a3a`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa) | `1.73.3`        | recorded by the existing OCE inventory |

The counts and correspondence checks came from the historical
[Database/API chain inventory](../../../evidence-harness-provenance.md#databaseapi-chain-inventory).
It read Git `HEAD` trees and committed blobs, not working-tree source. Focused
parser tests accompanied it. The historical link validator checked retained
public OCE blob paths and line ranges against recorded Git objects; pinned
Database-Tools and oak-openapi anchors were reduced to plain-text citations in
this public projection, so their full anchor validation belonged to the private
master.

**Evidence limit:** A tracked path establishes source structure at one revision.
It does not establish deployed version, live database shape, endpoint traffic,
runtime conformance, freshness, ownership or impact. Regex-parsed SQL and
TypeScript populations are structural noticers; every unparsed or unmatched
item remains open evidence rather than proof of absence.

## Database-Tools topology

**Observed:** The root declares six pnpm workspaces
(workspace manifest):
database migration/Hasura control, database tools and tests, a schema package,
mutation API, MV refresh service and Hasura auth service. All workspace manifests
share version `2.15.0`, although their deployment and publication lifecycles are
not one transaction.

| Structural population                 | Revision-exact count | What it does and does not establish                             |
| ------------------------------------- | -------------------: | --------------------------------------------------------------- |
| tracked files                         |                1,538 | repository scale only                                           |
| TypeScript files                      |                  789 | includes source, tests, scripts and generated schemas           |
| SQL files                             |                  501 | includes migrations, schema docs, fixtures and tests            |
| migration directories                 |                   37 | 37 `up.sql`, 36 `down.sql`; the baseline is the missing down    |
| SQL schema documents                  |                  334 | one-file object library, not necessarily deployed objects       |
| parsed functions                      |                  270 | first matching declaration per schema-doc file                  |
| parsed materialized views             |                   35 | schema-doc objects, not live database objects                   |
| parsed ordinary views                 |                   26 | schema-doc objects, not live database objects                   |
| unparsed schema documents             |                    3 | parser limitation requiring inspection                          |
| Hasura table-entry YAML files         |                  114 | excludes the `tables.yaml` collection manifest                  |
| hand-maintained schema TypeScript     |                  121 | includes schema-local indexes; not all are independent shapes   |
| introspected Drizzle TypeScript       |                  137 | 90 published, 35 public, 9 internal and 3 schema support files  |
| mutation route files                  |                   19 | includes the hello route alongside 18 lesson commands           |
| TypeScript test/spec files            |                  242 | existence, not execution or property coverage                   |
| SQL integration-test files            |                   78 | includes templates/support as well as executable scenarios      |
| database TypeScript integration tests |                   28 | source population, not CI selection evidence                    |
| GitHub workflow files                 |                    7 | independent database, package, service and infrastructure gates |

The SQL library divides into 236 CAT functions, 36 OWA functions, 28 OWA MVs,
23 OWA views, five Open API MVs, three Open API views, one Open API function and
two Aila MVs. These names reveal historical consumers but do not establish sound
bounded contexts: oak-openapi also depends directly on several `owa-*` objects.

## Representation and authority chain

**Observed:** One curriculum fact can be represented in at least these forms:

1. migration SQL and baseline snapshot;
2. one-file SQL schema documentation;
3. PostgreSQL table/function/view/MV state;
4. Hasura metadata, relationships, permissions and resolver naming;
5. introspected Drizzle table/view types;
6. hand-maintained Zod/runtime schemas;
7. oak-openapi GraphQL query-local types and transformations;
8. handler request/response Zod schemas;
9. generated/decorated OpenAPI Zod schemas;
10. served OpenAPI JSON;
11. OCE-generated transport types, validators, URL helpers and MCP tools; and
12. authored OCE concepts which the transport schema does not contain.

**Inferred:** This is not one schema-first system. It is a chain of partially
generated, partially introspected and partially hand-maintained authorities.
The relevant question is not which file is called “the schema”, but which actor
is competent to make which claim and what executable correspondence evidence
joins each transformation.

## Database projections named for the Open API

The schema-doc library contains these parsed objects:

| Kind     | Relation                                                | Unique index present in the schema-doc file |
| -------- | ------------------------------------------------------- | ------------------------------------------- |
| function | `published.function__table__mv_lesson_openapi_search_1` | not applicable                              |
| MV       | `published.mv_lesson_openapi_1_2_3`                     | no                                          |
| MV       | `published.mv_lesson_restriction_levels_1`              | yes                                         |
| MV       | `published.mv_openapi_downloads_1_0_0`                  | no                                          |
| MV       | `published.mv_openapi_unit_curriculum_content_1_0_2`    | yes                                         |
| MV       | `published.mv_threads_2`                                | yes                                         |
| view     | `published.view_curriculum_sequence_b_aggregate_1`      | not applicable                              |
| view     | `published.view_lesson_open_api_with_transcripts_1`     | not applicable                              |
| view     | `published.view_lesson_openapi_search_result_1`         | not applicable                              |

**Evidence qualification:** Absence of an index in a schema-doc file is not
absence from the deployed database. The initial snapshot groups some index
declarations away from their MVs, and the documentation extractor can lose that
association. The database authority record traces this separately.

**Observed:** One apparent projection,
`mv_openapi_unit_curriculum_content_1_0_2`, exists in schema docs but has no
corresponding migration, Hasura metadata, generated Drizzle relation or test at
the pinned revision. It is evidence that the schema-doc library can contain a
proposal, remnant or undeployed object; its actual history remains to be
recovered.

## oak-openapi topology and public surface

**Observed:** oak-openapi is a Next.js application containing the public API,
documentation UI, playground, admin API-key route, health endpoints and bulk
export tooling. Its root manifest composes tRPC-to-OpenAPI, Zod, GraphQL, Prisma,
Redis, Sanity, GCS and Oak Components
(manifest).

| Structural population          | Count | Qualification                                                               |
| ------------------------------ | ----: | --------------------------------------------------------------------------- |
| tracked files                  |   457 | revision-exact Git tree count; the populations below are overlapping slices |
| handler domains                |    16 | directory grouping, not proven bounded contexts                             |
| active OpenAPI metadata blocks |    32 | comments removed before counting                                            |
| declared public paths          |    32 | all GET at this revision                                                    |
| handler TypeScript files       |    77 | includes schemas and helpers                                                |
| source handler schema files    |    48 | files ending `.schema.ts` under handler schema directories                  |
| generated OpenAPI schema files |    52 | files ending `.openapi.ts`                                                  |
| example JSON files             |    46 | documentation/test examples, not conformance evidence                       |
| top-level test files           |    32 | all current `__tests__/*.test.ts`                                           |
| Next API route files           |     8 | includes routes outside the generated tRPC document                         |
| GitHub workflow files          |     5 | build/test/infrastructure populations                                       |

The 32 GET paths cover catalogues, sequences, programmes, units, lessons,
questions, assets, transcripts, search, threads, change log and rate-limit
status. The router combines sixteen handler routers
(router);
`trpc-to-openapi` derives the document from that router
(document).

**Observed contradiction:** Repository rules say public shapes flow from source
Zod to generated OpenAPI output, but the same directive says the generator is
broken and source/generated files must be synchronised by hand
(directive,
exception).
The unequal source/generated file counts are not themselves drift because one
source may emit several outputs and some schemas are defined inline. They show
why filename parity is not a sufficient gate.

## Resolver registry correspondence

oak-openapi centralises database names in
`owaClient.ts`.
Normalising parsed `schema.relation` names to Hasura `schema_relation` names
matches eight of its ten resolver constants to current schema-doc objects:

| API symbol                         | Resolver                                                    | Schema-doc family | Match |
| ---------------------------------- | ----------------------------------------------------------- | ----------------- | ----- |
| `lessonView`                       | `published_mv_lesson_openapi_1_2_3`                         | Open API MV       | yes   |
| `lessonContentView`                | `published_mv_lesson_content_published_5_0_0`               | none              | no    |
| `downloadView`                     | `published_mv_openapi_downloads_1_0_0`                      | Open API MV       | yes   |
| `threadView`                       | `published_mv_threads_2`                                    | Open API MV       | yes   |
| `unitVariantLessonsView`           | `published_mv_synthetic_unitvariant_lessons_by_year_12_0_0` | none              | no    |
| `subjectPhaseView`                 | `published_mv_subject_phase_options_0_11`                   | OWA MV            | yes   |
| `sequenceView`                     | `published_mv_curriculum_sequence_b_13_0_21`                | OWA MV            | yes   |
| `lessonSearchView`                 | `published_function__table__mv_lesson_openapi_search_1`     | Open API function | yes   |
| `programmesByYearView`             | `published_mv_synthetic_programmes_by_year_18_2_0`          | OWA MV            | yes   |
| `lessonOpenApiWithTranscriptsView` | `published_view_lesson_open_api_with_transcripts_1`         | Open API view     | yes   |

**Inferred:** The two unmatched resolver constants are not evidence of missing
live objects. Both appear in generated Drizzle or the squashed baseline, while
their current one-file schema documentation is absent. They expose a
representation-correspondence gap which the authority analysis must explain.

The registry also includes three direct SQL relation names for non-Hasura paths
and one generated GraphQL boolean-expression type. Those are distinct contract
kinds and are intentionally excluded from relation matching.

## OCE consumer boundary

**Observed:** OCE's SDK default is
`https://open-api.thenational.academy/`, with the v0 schema at
`api/v0/swagger.json`
([configuration](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/config/index.ts#L1-L15)).
Its committed generator metadata records OpenAPI `3.1.0`, 32 paths, 32
operations and 32 component schemas from upstream API version
`0.7.0-8eceb702a45a5746af6a407a7a5d377ae7ec0c83`.

The committed generated API surface contains 79 files under the codegen
package, including 68 MCP-related files. This demonstrates a large mechanical
fan-out from one upstream document; it does not mean 68 independent concepts or
runtime tools.

**Observed:** OCE describes its SDK as generated rather than hand-written and
uses an `openapi-fetch` client
([SDK README](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/README.md#L1-L53)).
The wider OCE trace must still distinguish pure generated transport knowledge
from authored curriculum ontology, aggregated tools, error interpretation,
search knowledge and product policy.

## Initial seams and negative space

| Seam                               | Direct observation                                                                      | What is missing                                                       |
| ---------------------------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| migration to schema docs           | three documents do not parse; at least one Open API document has no deployment evidence | one declared authority and lossless reproducibility proof             |
| schema docs to live DB             | two API resolver relations have no current document                                     | live-schema/version comparison and history                            |
| database to Hasura                 | table metadata is separate from SQL evolution                                           | deployed metadata consistency, permission and resolver contract test  |
| Hasura to handler                  | names are manually version-pinned; query-local types include unknown `any` fields       | generated query/result correspondence and semantic ownership          |
| source schema to generated OpenAPI | generator currently broken; manual dual edits required                                  | reproducible clean generation and stale-output deletion               |
| OpenAPI document to runtime        | route implementations exist outside/alongside generated tRPC transport                  | request/output/status/binary conformance over every operation         |
| upstream document to OCE           | generated surface fans out widely                                                       | provenance manifest, compatibility policy and runtime-schema identity |
| API transport to Oak concepts      | endpoint schema carries structures, not all curriculum meaning or user intent           | explicit domain model and authored knowledge provenance               |

## Propositions and invalidators

| Proposition                                                                                     | Present warrant                                                                       | Would weaken or invalidate it                                                                          | Decisive evidence                                                                      |
| ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| No single current representation is the semantic authority                                      | mutually different migration, docs, metadata, Drizzle, Zod, handler and OpenAPI roles | a documented/executable derivation graph from one competent source                                     | clean-room regeneration and semantic equality checks across every projection           |
| Schema-doc existence cannot be used as deployed-object evidence                                 | dormant Open API MV and unmatched live-name candidates                                | proof every document is reconciled against each deployed environment                                   | compare committed docs, migration result and live catalogues with provenance           |
| oak-openapi's public contract can drift despite local type safety                               | broken generator and manual source/generated synchrony                                | a hidden mandatory generation/conformance gate                                                         | alter one source shape and observe every CI/release check and emitted artefact         |
| OCE mechanically propagates provider contract omissions as well as declared transport contracts | large schema-driven fan-out plus partial generated transformations                    | generated surfaces reject or explicitly account for every unsupported or lost construct before release | replay contract fixtures through live handler, served schema, codegen and MCP executor |
| Current repository boundaries reflect consumer history more than enduring domains               | OWA-named projections directly serve the public API                                   | recovered rationale showing stable domain ownership behind those families                              | co-change/history analysis plus owner interviews and conceptual dependency graph       |

## Next traces

1. Complete SQL dependency, identity, constraint, publication and MV freshness
   graphs.
2. Trace lesson summary, sequence units, assets and bulk export from database
   objects through runtime output and OCE execution.
3. Compare source Zod, generated OpenAPI Zod, served document, OCE schema and
   runtime response on representative success and every error class.
4. Recover release and compatibility ordering across database, metadata,
   oak-openapi and OCE code generation.
5. Obtain live/external evidence for deployed versions, traffic, latency,
   freshness, failures, ownership and human outcomes.
