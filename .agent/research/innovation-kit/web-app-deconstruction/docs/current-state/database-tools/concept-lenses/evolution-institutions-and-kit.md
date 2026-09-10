# Database Tools, oak-openapi and OCE through evolution, institutional and kit lenses

## Purpose and scope

This record runs fixed lenses 45-55 from the Database Tools investigation
register. It follows the four movements in OCE's pinned
[`concept-exploration` workflow](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md#L25-L49).
The purpose is not to repair Database Tools or oak-openapi. Their mechanisms are
evidence about obligations, useful patterns and avoidable compensations. The
proposals concern an excellence-first OCE and Oak Innovation Kit intentionally
designed to enable additional consumers.

The evidence is pinned to:

- Database Tools
  `3d1eff31a398189a839ae68bcf69990089c31bd2`;
- oak-openapi
  `2fb1383bfeaeb4986ec29cef97be133b69baeef5`; and
- OCE
  [`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

Static source establishes encoded mechanisms and declared intent. It does not
establish deployed versions, live use, organisational authority, incident
history, environmental impact, user understanding or educational validity.
Those facts remain **Unknown** unless specifically evidenced.

| Local lens | Fixed lens | Primary distinction                                             |
| ---------- | ---------- | --------------------------------------------------------------- |
| 1          | 45         | reversible release transition, not merely reverse SQL           |
| 2          | 46         | typed version identities and compatibility promises             |
| 3          | 47         | semantic dependency and evidence-bearing co-change              |
| 4          | 48         | governed promise retirement rather than deletion                |
| 5          | 49         | legitimate profiles versus accidental environment authority     |
| 6          | 50         | preservation of value across suppliers and platforms            |
| 7          | 51         | whole-lifecycle resources and operational labour                |
| 8          | 52         | competent authority versus repository review routing            |
| 9          | 53         | challenge, adjudication and correction of curriculum claims     |
| 10         | 54         | a consumer's predictive and diagnostic mental model             |
| 11         | 55         | deliberate kit invariants, extension points and product freedom |

---

## Lens 1: reversible evolution and coexistence (fixed lens 45)

### Governing question

How do old and new models coexist, and what makes a change safe, recoverable or
intentionally irreversible?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools has 37 `up.sql` files and 36 `down.sql` files.
  The missing reverse migration is the 18,557-line compacted baseline, beginning
  with `--skip-validation`, although repository documentation says migrations
  contain both directions
  (baseline,
  migration guidance).
- **Observed:** database migration/metadata promotion and mutation-API promotion
  are separate mechanisms. The mutation workflow explicitly warns that a Cloud
  Build failure may leave the deployed service incompatible with the database
  (database promotion,
  service promotion).
- **Observed:** oak-openapi binds queries to literal version-named projections,
  while OCE can compile either a committed contract snapshot or a mutable live
  contract during a Vercel build
  (resolver names,
  [OCE source selection](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/resolve-schema-source.ts#L4-L16)).
- **Unknown:** whether an external release controller orders these promotions,
  proves coexistence and has exercised restoration under production conditions.

**Inherited assumption exposed:** a `down.sql` file is often treated as
rollback. It can reverse database syntax while leaving metadata, services,
generated consumers, published data and irreversible external effects at a
different generation.

### Movement 2: define the problem space

**Problem frame:** the protected unit is a consumer-visible capability across a
release transition. A change is safe when old and new producers and supported
consumers have a declared coexistence interval, data transformation is
understood, and operators can restore a truthful service outcome. Some changes
are intentionally irreversible; excellence requires naming that finality before
promotion and providing forward repair. Success is not universal reversibility.
It is a proved transition protocol whose acknowledgements match recoverable
state.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. The compacted baseline may be an excellent, deliberate new origin; complete
   archaeology and reverse SQL would add no operational value.
2. Version-named projections may already implement expand/contract by allowing
   consumers to remain on an older relation.
3. Independent deployments may reduce coupling when every boundary is backward
   compatible, rather than create release risk.
4. Hidden deployment automation may already supply the missing ordering and
   recovery evidence.

**Changed assumption:** rollback should not mean "run the inverse migration".
The stronger question is whether the last known-good capability, its data and
its evidence can be restored within a justified recovery objective, or whether
an explicit forward-only repair is safer.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** versioned projections preserve an important
coexistence option, but the pinned chain does not bind database, metadata, API,
contract and OCE adoption into one proved transition. OCE should make transition
compatibility observable without inheriting any particular migration tool.

| Proposition                                                                                                                                                                                                                 | Warrant                                                                                                                     | Explicit falsifier                                                                                                                 |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** define an OCE release-transition contract containing old/new semantic contract IDs, supported consumer capabilities, data transformation, coexistence window, promotion evidence and retirement condition. | Current release mechanisms can succeed independently while literal projection names and generated consumers remain coupled. | A complete existing release record already proves every supported consumer against both sides and prevents incompatible promotion. |
| **Proposition:** require a recovery strategy per stateful capability: restore, roll forward, compensate or declare irreversible, then exercise it across storage, provider and consumer adapters.                           | Reverse SQL alone cannot restore the distributed capability or undo external effects.                                       | Repeated drills show that database reversal alone restores every consequential outcome inside the required objective.              |
| **Proposition:** use expand/contract only where simultaneous consumer support is valuable; do not preserve compatibility layers without an observed migration need and removal condition.                                   | Coexistence protects consumers, while permanent dual models create a second authority.                                      | A dual representation has no measurable cognitive or conformance cost and remains the simplest enduring domain model.              |

**Unresolved evidence:** deployed promotion order; backup and recovery results;
consumer adoption times; destructive data transformations; external effects;
and the actual recovery objectives of public API, indexing and teaching
workspaces.

---

## Lens 2: version identity and compatibility meaning (fixed lens 46)

### Governing question

What do table, view, materialized-view, schema-package, API, release and cache
versions mean to consumers?

### Movement 1: reflect on raw observations

- **Observed:** oak-openapi's current resolver registry mixes suffix forms such
  as `1_2_3`, `5_0_0`, `2`, `0_11`, `13_0_21` and `18_2_0`; the source provides
  no common interpretation for those components
  (registry).
- **Observed:** oak-openapi separately maintains an API changelog using semantic
  looking versions and prose changes, including field removal and a changed
  blocked-content error representation
  (versions).
- **Observed:** the served OpenAPI version appends a Vercel Git SHA when present,
  while the URL major comes from the latest changelog entry
  (document identity,
  URL identity).
- **Observed:** OCE's drift check reads the OpenAPI `info.version`, but warns that
  two documents can have the same version while their content differs; all
  outcomes remain advisory
  ([version comparison](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/agent-tools/src/ci/ci-schema-drift-check.ts#L39-L64),
  [advisory outcomes](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/agent-tools/src/ci/ci-schema-drift-check.ts#L93-L127)).
- **Unknown:** which version identities are contractual, which indicate an
  implementation generation, and which deployed consumers select or observe.

**Inherited assumption exposed:** a version string is not self-describing. The
same syntax can mean database-shape succession, protocol compatibility, source
revision, deployment identity or data release.

### Movement 2: define the problem space

**Problem frame:** consumers need to know whether two things may be substituted
for a named use, not whether one number is larger. The system needs distinct,
composable identities for curriculum release, semantic contract, protocol
contract, projection build, implementation revision and artefact digest. Success
is that every compatibility decision names both the use and the rule being
applied, and every runtime observation can be traced to immutable inputs.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. Projection suffixes may be internal implementation coordinates and need no
   public semantic interpretation.
2. API semantic versions plus changelog prose may be sufficient for human
   consumers of a beta API.
3. A Git SHA may be a more exact identity than semantic versioning for generated
   clients.
4. Content-addressed artefacts may make human-readable versions unnecessary.

**Changed assumption:** OCE does not need one master version. It needs typed
identities and explicit relations between them. A digest answers equality; a
semantic version promises compatibility; a release identity names curriculum
state. None substitutes for the others.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** current names provide useful trace fragments but do
not form a consumer-readable compatibility model. Version proliferation is not
itself the problem; untyped substitution of one identity for another is.

| Proposition                                                                                                                                                                                                             | Warrant                                                                                               | Explicit falsifier                                                                                                                                |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** model `CurriculumReleaseId`, `SemanticContractVersion`, `ProtocolVersion`, `ProjectionBuildId`, `ImplementationRevision` and `ArtifactDigest` as distinct kit concepts with explicit derivation links. | Current suffixes, semver, Git SHA and cache identity answer different questions.                      | One current identifier uniquely establishes all required equality, provenance, compatibility and release-state decisions without external lookup. |
| **Proposition:** classify compatibility against registered capability uses and protocol rules, not raw document inequality or version ordering.                                                                         | OCE can detect any JSON difference but cannot distinguish prose from a broken consumer.               | A protocol-only compatibility classifier catches every real consumer break and produces no irrelevant alarms across representative history.       |
| **Proposition:** surface release and contract identities in runtime response/diagnostic envelopes where consumers need to explain an answer.                                                                            | Static build identity cannot identify which curriculum/projection/policy state produced runtime data. | Consumers can already reconstruct every consequential answer reproducibly from existing response metadata.                                        |

**Unresolved evidence:** historical meaning of MV suffixes; API compatibility
policy; live served versions; consumer version ranges; release lineage; and
whether curriculum and policy releases can currently be identified independently.

---

## Lens 3: semantic coupling and change propagation (fixed lens 47)

### Governing question

Which boundaries predict necessary co-change by reason rather than by folder or
deployment unit?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools groups six workspaces under one repository and
  shared package version, although they include migration control, Hasura,
  authentication, schema publication, mutation and refresh concerns
  (workspace declaration).
- **Observed:** oak-openapi's central client binds public handlers to named
  Hasura relations and hand-authored result interfaces in the same source module
  (database names and client).
- **Observed:** OCE describes one OpenAPI document fanning out into TypeScript,
  Zod, response maps, URL helpers and MCP tooling
  ([declared pipeline](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L23-L68)),
  yet aggregate tools are explicitly authored capabilities which combine
  multiple calls
  ([aggregate definitions](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts#L80-L165)).
- **Unknown:** actual historical co-change rates, review participants and
  incidents across the three repositories.

**Inherited assumption exposed:** repository, package and generated-file
boundaries are easy dependency proxies. They do not reveal whether two elements
share a semantic reason to change or merely share tooling and release machinery.

### Movement 2: define the problem space

**Problem frame:** the unit of analysis is a claim-to-capability dependency:
which source meaning, policy, transformation and adapter must change when a
public capability changes. Harm occurs when necessary co-change is invisible or
when unrelated modules are forced into lockstep. Success is an explicit
conceptual dependency graph whose edges state why change propagates and what
evidence proves the new correspondence.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. Co-location may be a deliberate coordination mechanism for a tightly
   collaborating team, even when deployment units differ.
2. Wide generated fan-out may be healthy mechanical coupling: one reviewed
   contract change should update every transport representation.
3. Manual aggregate capabilities may be the correct anti-corruption layer rather
   than evidence of failed generation.
4. Some literal MV-name dependencies may be temporary migration scaffolding,
   not enduring architecture.

**Changed assumption:** low coupling does not mean minimizing all dependencies.
Essential semantic dependencies should be direct, typed and testable. Accidental
dependencies through filenames, environment selection and duplicated
representations should disappear.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** the chain contains both valuable coupling, such as a
validator changing with its contract, and accidental coupling, such as public
behaviour depending on literal storage names. Folder counts cannot distinguish
them. OCE needs explicit dependency reasons and transformation evidence.

| Proposition                                                                                                                                                                                               | Warrant                                                                                                                    | Explicit falsifier                                                                                                                         |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| **Proposition:** construct a revision-history and concept-graph sample for lesson identity, complete enumeration, resource rights and one mutation outcome; compare semantic edges with actual co-change. | These slices cross every repository and contain both generated and authored meaning.                                       | Folder/package boundaries predict necessary and unnecessary co-change more accurately than the semantic graph over representative history. |
| **Proposition:** make generated artefacts carry a provenance manifest naming contract input, compiler, projection policy and supported-language coverage.                                                 | Generated fan-out is legitimate only when all outputs share an inspectable reason and transformation.                      | Existing source maps and tests already reconstruct every output's authority and detect all silent loss.                                    |
| **Proposition:** let stable capabilities depend on provider-neutral semantic ports; confine storage names, GraphQL and HTTP paths to adapters.                                                            | Literal projection names are implementation coordinates, while lesson enumeration and rights decisions are enduring needs. | Multiple excellent providers cannot implement the capability without exposing the same storage-specific concepts.                          |

**Unresolved evidence:** Git co-change history; hidden code generation; runtime
call graphs; ownership and review history; consumers outside GitHub; and which
current manual transformations are intentional domain policy.

---

## Lens 4: deprecation as promise retirement (fixed lens 48)

### Governing question

How can database, API and generated consumers coexist through semantic change
without hidden forks or permanent compatibility layers?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools tells maintainers to check a hand-maintained list
  of eleven published/internal clients before dropping MVs
  (client list).
- **Observed:** automated discovery issues one GitHub code-search query capped at
  100 results, continues after most errors, ignores generated SDK files and only
  recognises literal versioned MV names; an older unobserved version is then
  classified unused
  (search,
  parsing,
  classification).
- **Observed:** oak-openapi's changelog records a removed field and a changed
  error representation as prose entries, but exposes only version, date and an
  array of change strings
  (history,
  schema).
- **Observed:** OCE removed a transport alias after inventorying references,
  confirming tool parity and updating tests and guidance
  ([deprecation record](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/historical/openai-connector-deprecation.md#L1-L28)).
- **Unknown:** public notice periods, runtime usage, support obligations and
  owner acknowledgement for database/API retirement.

**Inherited assumption exposed:** source absence is not consumer absence, and
"deprecated" is not a complete lifecycle state. A promise can remain live in
generated, dynamic, private, cached or intermittently connected consumers.

### Movement 2: define the problem space

**Problem frame:** deprecation is a governed transition from supported promise
to retired promise. It must name the affected capability and semantics, known
consumers, successor, migration evidence, support window and authority to accept
residual risk. Success is prompt removal once evidence warrants it, without
silent breakage or indefinite compatibility forks.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. Version-named database projections may make coexistence cheap enough that a
   lightweight search is proportionate.
2. A beta public API may explicitly make no backward-compatibility promise.
3. Small, fully known consumer populations may need owner confirmation rather
   than telemetry infrastructure.
4. OCE's alias removal may demonstrate that parity plus an inventory is already
   a sufficient retirement protocol for bounded surfaces.

**Changed assumption:** the choice is not compatibility forever versus immediate
replacement. A short, evidence-bearing transition can be stricter and simpler
than both, provided the retirement condition is defined before the old surface
persists.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** OCE's recorded alias removal preserves valuable
intent: prove parity, enumerate change and leave rationale. Database/API
retirement needs stronger consumer evidence because its boundary is wider and
less observable from one repository.

| Proposition                                                                                                                                                                                                                 | Warrant                                                                              | Explicit falsifier                                                                                                                       |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** provide a capability-deprecation record in the kit with semantic delta, successor, affected contract versions, owner, notice/support dates, known consumers, adoption evidence and final removal decision. | Text search and changelog prose each omit facts required for a justified retirement. | Every current retirement can be reconstructed and authorised from existing immutable records with no unknown consumer or semantic delta. |
| **Proposition:** combine declared consumer registration, build-time compatibility and privacy-appropriate runtime use evidence; treat any incomplete source as uncertainty rather than absence.                             | Dynamic/generated/private uses evade literal bounded search.                         | A complete inventory proves all consumers are statically discoverable and current search is fail-closed and exhaustive.                  |
| **Proposition:** generate temporary adapters only from an explicit deprecation record and test them against old/new conformance fixtures; remove them at the recorded condition.                                            | Compatibility code can ease migration but otherwise becomes a permanent hidden fork. | Long-lived compatibility layers remain simpler, fully understood and cost-free across representative changes.                            |

**Unresolved evidence:** API terms and support promises; deployment telemetry;
non-GitHub consumers; owner decisions; generated uses; dormant consumers; and
the cost and retention period of current versioned projections.

---

## Lens 5: product and environment variability (fixed lens 49)

### Governing question

Which differences are legitimate product profiles, deployment bindings or
accidental drift?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools local initialization names one staging database,
  exports it to a mutable `latest` object, restores it into a destroyed local
  volume, applies metadata and marks migrations as applied
  (selection and orchestration,
  restore and ledger).
- **Observed:** oak-openapi derives its origin differently for local, Vercel
  branch, generic Vercel and production contexts, and separately permits a video
  origin override
  (base URL selection).
- **Observed:** OCE normally generates from the committed schema cache, but the
  mere presence of `VERCEL=1/true` selects live upstream instead
  ([source policy](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/resolve-schema-source.ts#L4-L40),
  [live load](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/codegen.ts#L83-L112)).
- **Unknown:** which product/environment differences are intentional, their live
  values, whether staging data is governed and whether deployment manifests
  record all effective bindings.

**Inherited assumption exposed:** production likeness is not the same as
environment fidelity. Importing a mutable staging snapshot can reproduce
incidental state while bypassing the declared evolution path; using live input
in one build environment can make platform identity a semantic switch.

### Movement 2: define the problem space

**Problem frame:** a legitimate profile is an explicit selection of capability,
policy, scale or provider binding with a declared invariant core. Accidental
variability arises when environment detection silently changes contract input,
data authority or behaviour. Success is that the same immutable release and
profile produce the same semantics everywhere, while controlled differences are
typed, reviewable and testable.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. Real staging data may reveal data-shape failures that deterministic fixtures
   cannot anticipate.
2. Branch-specific URLs and provider bindings are necessary deployment details,
   not domain variability.
3. Live schema generation on Vercel may intentionally guarantee deployment
   freshness.
4. Local, preview and production may serve legitimately different operational
   objectives and should not be identical.

**Changed assumption:** parity should mean invariant semantic outcomes from named
inputs, not identical infrastructure or copied production data. Production
replay is diagnostic evidence, not a silent source of authority.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** the pinned chain contains necessary endpoint and
credential bindings alongside semantic input changes selected by environment.
OCE should make the distinction structural: profiles select adapters and
budgets, while reviewed contract/release inputs remain immutable.

| Proposition                                                                                                                                                                                           | Warrant                                                                                        | Explicit falsifier                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** define a typed environment/product profile manifest containing immutable contract/release inputs, enabled capabilities, provider bindings, policy revisions and operational budgets. | Current environment variables can alter both location and semantic build authority.            | Existing deployment metadata already records and validates every effective input and prevents undeclared semantic variation. |
| **Proposition:** make deterministic scenarios the hermetic default and admit sanitised production-derived snapshots only as versioned, provenance-bearing test inputs.                                | A mutable staging `latest` plus a marked migration ledger cannot prove reproducible evolution. | Rebuilding from declared migrations/scenarios misses material defects that only an unversioned staging copy can reveal.      |
| **Proposition:** run the same conformance suite against in-memory/test, preview and production adapters, parameterised by explicit profile differences.                                               | Excellence permits different mechanisms but not unexplained contract divergence.               | Profile-specific semantics are all intentional product requirements and a shared suite produces no useful discrimination.    |

**Unresolved evidence:** effective deployment environment values; staging data
classification and redaction; external configuration systems; profile-specific
traffic and objectives; and whether Vercel codegen output is ultimately shipped.

---

## Lens 6: supply chain and vendor portability (fixed lens 50)

### Governing question

Can semantics, data and operation survive movement beyond Hasura, PostgreSQL,
GCP, Vercel, Redis, Sanity and npm where that movement protects enduring value?

### Movement 1: reflect on raw observations

- **Observed:** Database Cloud Build downloads the Hasura CLI from mutable
  `raw/stable` and then applies migrations and metadata to a configured endpoint
  (build steps).
- **Observed:** oak-openapi's application manifest composes GraphQL/Hasura,
  PostgreSQL/Prisma, Redis, Sanity, Google Cloud Storage, Vercel/Next and npm
  packages in one public product
  (dependencies);
  its data client embeds Hasura resolver naming and endpoint conventions
  (client).
- **Observed:** OCE explicitly declares the published HTTP API as its boundary
  and forbids SDK/application access to Hasura, PostgreSQL, MVs or Elasticsearch
  ([boundary](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L7-L10)).
- **Observed:** OCE's data-source register distinguishes external origin,
  in-repository representation, licence, attribution and consumer, and requires
  a stable attributable upstream for proposed sources
  ([source record](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/governance/DATA-SOURCES.md#L50-L86),
  [adoption criteria](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/governance/DATA-SOURCES.md#L107-L160)).
- **Unknown:** commercial terms, exit provisions, artefact attestations,
  recoverable exports, portability objectives and tested replacement times.

**Inherited assumption exposed:** portability is not maximal abstraction or the
avoidance of excellent managed services. It is the ability to preserve enduring
semantics, lawful data, evidence and operations when a supplier or platform no
longer serves the outcome.

### Movement 2: define the problem space

**Problem frame:** the protected assets are curriculum meaning, public contract,
release data, policy provenance and operational capability. Vendor-specific
adapters may be the best implementation, but no vendor coordinate should become
the only expression of those assets. Success is a tested exit or substitution
path proportional to dependency criticality, plus reproducible and attributable
software/data inputs.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. PostgreSQL and HTTP are already widely portable standards; further ports may
   be speculative abstraction.
2. Hasura, Vercel and cloud storage may supply reliability and delivery features
   whose replacement would reduce excellence.
3. OCE's public HTTP boundary may already isolate every downstream consumer from
   provider implementation.
4. Open licensing may preserve legal reuse while operational reconstitution
   remains expensive or impossible.

**Changed assumption:** a provider-neutral core is warranted for durable domain
meaning and capabilities, not for every low-level feature. Portability evidence
should be earned with a working replacement drill, not claimed from interfaces
alone.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** the HTTP boundary is valuable but protects consumers
only while the provider remains available and semantically faithful. The kit can
go further by preserving immutable contracts, releases and capability tests
independently of transport and infrastructure suppliers.

| Proposition                                                                                                                                                                                                 | Warrant                                                                                                                 | Explicit falsifier                                                                                                           |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** keep domain contracts, releases, provenance and conformance fixtures in open, provider-neutral formats; bind Hasura, PostgreSQL, search, storage and deployment through explicit adapters. | Current vendor names appear inside implementation coordinates, while OCE consumers need stable curriculum capabilities. | Provider-specific semantics are essential to the public capability and cannot be represented faithfully in an open contract. |
| **Proposition:** run one portability exercise for a complete vertical slice, including data import/export, query, operation, telemetry and recovery, before generalising adapter APIs.                      | An interface without a second working implementation cannot establish substitutability.                                 | The exercise reveals no meaningful exit risk and adapter indirection measurably harms correctness or operability.            |
| **Proposition:** require immutable dependency inputs, provenance and attestable artefacts for kit releases and contract snapshots.                                                                          | A mutable installer can change database promotion independently of reviewed source.                                     | The effective build is already content-addressed, reproducible and independently verifiable end to end.                      |

**Unresolved evidence:** source and image provenance; SBOM/signing practice;
database and object export completeness; licence/attribution obligations under
provider change; hidden platform features; and acceptable migration objectives.

---

## Lens 7: sustainability and resource externalities (fixed lens 51)

### Governing question

What whole-lifecycle compute, storage, network and operational labour accompanies
each valued outcome?

### Movement 1: reflect on raw observations

- **Observed:** the refresh service enumerates all qualifying MVs and refreshes
  them sequentially in one transaction; after success it clears every public
  dirty flag rather than selecting work from source locality
  (refresh loop,
  completion).
- **Observed:** oak-openapi applies a five-minute Hasura cache directive to bulk
  subject data while still composing several query results
  (bulk query).
- **Observed:** OCE's active complete-lesson workaround makes one request per
  supplied unit with a limit of 100, then aggregates results by lesson slug
  ([per-unit enumeration](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/src/lib/indexing/fetch-all-lessons.ts#L106-L170)).
- **Observed:** OCE also downloads whole-corpus bulk files into a local snapshot,
  but its manifest records only source, time, filename and size
  ([manifest](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/bulk-downloads/manifest.json#L1-L129)).
- **Unknown:** production cardinalities, refresh frequency, cache hit rate,
  compute/energy use, data transfer, storage retention and human operational
  effort. Static source does not establish environmental impact.

**Inherited assumption exposed:** fewer services, more caching or more
precomputation is not automatically sustainable. Each may exchange repeated
request work for refresh work, storage, invalidation, diagnosis and retained
artefacts.

### Movement 2: define the problem space

**Problem frame:** sustainability is resource and labour consumed per truthful,
useful capability outcome over its full lifecycle. It includes build, refresh,
request, storage, transfer, incident, migration and deletion work. Success is
meeting justified service and preservation obligations with measured headroom
and without externalising complexity to every ecosystem consumer.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. Materialized views and caches may dramatically reduce aggregate request cost
   and be the most sustainable design at current traffic.
2. Refreshing all projections may be intentionally rare and operationally safer
   than a dependency scheduler.
3. Per-unit enumeration may be temporary, bounded ingestion rather than a user
   request-path concern.
4. One verified bulk release may replace repeated crawling, or may instead add a
   second expensive distribution channel with few users.

**Changed assumption:** architectural simplicity and environmental economy are
related only through measurement. The smallest conceptual basis can reduce
labour, but workload and lifecycle evidence must decide physical mechanisms.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** current mechanisms expose clear work-amplification
questions but no basis for an environmental verdict. OCE should make workload,
retention and operator effort first-class design evidence rather than claim
savings from component count.

| Proposition                                                                                                                                                                                                      | Warrant                                                                                                        | Explicit falsifier                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** define capability-level workload budgets and measure database work, refresh amplification, request fan-out, bytes, storage lifetime and operator time under representative releases and demand. | Current source shows amplification mechanisms but no outcome-normalised measurement.                           | These measures do not explain material resource, reliability or maintenance differences across candidate designs.                           |
| **Proposition:** compare cursor-paged live extraction, one verified release snapshot and current per-unit choreography for complete indexing using identical semantic output.                                    | The three approaches can trade producer work, network use, storage and consumer complexity.                    | Current choreography is measurably superior across correctness, resource use, latency and operational labour.                               |
| **Proposition:** give every derived artefact a retention/supersession policy and deletion proof appropriate to recovery and public-preservation obligations.                                                     | Versioned projections, caches, snapshots and generated trees otherwise accumulate without a common value test. | Retaining every current artefact is necessary for a stated legal, recovery or reproducibility obligation and has negligible lifecycle cost. |

**Unresolved evidence:** workload traces; embodied/cloud impact methodology;
traffic; query plans; refresh duration; storage age; incident toil; consumer-side
recomputation; and public-record preservation duties.

---

## Lens 8: ownership, Conway forces and incentives (fixed lens 52)

### Governing question

Do decision, maintenance and incident responsibilities match competent semantic
and operational authority?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools assigns default code review to Data Platform and
  adds Cloud Ops for infrastructure; this is review routing over a repository
  which contains six different runtime/evolution concerns
  (CODEOWNERS,
  workspaces).
- **Observed:** oak-openapi assigns Cloud Ops to infrastructure paths but has no
  default entry in its CODEOWNERS file
  (CODEOWNERS).
- **Observed:** OCE assigns one default code owner for the whole repository
  ([CODEOWNERS](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.github/CODEOWNERS#L1-L5)),
  while its data-source policy says organisational ratification, not one person,
  is required for source governance
  ([governance status](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/governance/DATA-SOURCES.md#L130-L139)).
- **Unknown:** actual team topology, operational rotations, decision rights,
  curriculum authority, review enforcement, staffing and incentives. CODEOWNERS
  does not establish any of those facts.

**Inherited assumption exposed:** code ownership is not semantic authority and
semantic authority is not necessarily operational responsibility. A person may
be competent to approve a curriculum meaning but unable to operate its delivery;
a platform team may ensure reliability without authority to redefine it.

### Movement 2: define the problem space

**Problem frame:** every consequential concept and capability needs competent
authority to define meaning, accountable stewardship to maintain it, and an
operational owner able to detect and repair failure. These roles may differ but
their hand-offs must be explicit. Success is rapid, evidence-backed decision and
repair without making repository location or the loudest maintainer the default
authority.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. CODEOWNERS may be intentionally coarse review routing while richer authority
   and on-call systems exist elsewhere.
2. Central ownership may currently preserve coherence better than fragmented
   component ownership.
3. A small innovation repo may reasonably have one accountable maintainer while
   policy decisions remain organisational.
4. Cross-repository seams may reflect organisational hand-offs that are useful
   separation of duties rather than Conway-induced fragmentation.

**Changed assumption:** the objective is not one owner per module. It is no
orphaned decision and no authority inversion. The ownership unit should be a
semantic promise or operational outcome, with repository routing derived from
that model where useful.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** the source exposes different review topologies but
cannot establish whether curriculum, API, kit and operations decisions have
competent owners. This is a priority evidence gap because architecture cannot
compensate for unresolved authority.

| Proposition                                                                                                                                                                                                                                          | Warrant                                                                                                                                     | Explicit falsifier                                                                                                                              |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** establish an authority map for curriculum semantics, publication, rights policy, public protocol, OCE capability, contract compiler, release data and operations, distinguishing decider, steward, operator and affected consumers. | Current code-owner boundaries do not answer who may change meaning or accept outcome risk.                                                  | Existing governance lets independent participants correctly identify the same authority and escalation for every sampled decision and incident. |
| **Proposition:** run decision and incident game-days across complete enumeration, rights correction, contract change and stale projection scenarios.                                                                                                 | Authority quality is demonstrated by timely coherent action, not the existence of a matrix.                                                 | Participants already decide, communicate and restore each outcome within its objective with complete attribution and no authority conflict.     |
| **Proposition:** make kit governance federated: shared invariants have explicit maintainers and change process; products own policies they inject through declared ports.                                                                            | Centralising every decision in the kit would reproduce organisational coupling; leaving every decision local duplicates subtle obligations. | Federated ownership repeatedly causes slower, less coherent outcomes than one competent central authority for the same concerns.                |

**Unresolved evidence:** org charts; incident command and on-call records;
curriculum/editorial governance; public API product ownership; consumer support;
review rules; decision latency; and incentives around shipping versus long-term
stewardship.

---

## Lens 9: curriculum contestability and correction propagation (fixed lens 53)

### Governing question

Who may challenge a curriculum or publication claim, how is it adjudicated, and
how does a correction reach every representation and consumer?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools' audit migration records table/key, operation,
  changed values, application/role/type and time, and derives actor information
  from Hasura session or database settings
  (audit record and actor,
  change capture).
- **Observed:** oak-openapi exposes API-level change prose with version and date,
  but its changelog schema has no affected claim identity, reason, source,
  adjudicator, correction relation or propagation status
  (endpoint,
  schema).
- **Observed:** OCE's ADR-083 records that about 52% of Maths KS4 lessons were
  absent from search because an incomplete projection had been interpreted as a
  complete enumeration source; earlier quality metrics were therefore computed
  over an incomplete index
  ([discovery](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md#L8-L55)).
- **Observed:** the committed OCE bulk receipt records filenames and sizes but no
  curriculum release, record counts, hashes, source revision or correction
  lineage
  ([manifest](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/bulk-downloads/manifest.json#L1-L129)).
- **Unknown:** how teachers, subject experts, editors or downstream builders can
  challenge a public curriculum fact; adjudication rules; appeal/remedy; and the
  time required for correction across MVs, API, cache, bulk, index and apps.

**Inherited assumption exposed:** validation can prove that data has an accepted
shape; it cannot prove that a curriculum claim is correct, appropriately
contextualised or no longer disputed. Row audit can reconstruct change without
recording the claim, evidence and reason being contested.

### Movement 2: define the problem space

**Problem frame:** a consequential curriculum claim must be referable,
challengeable and correctable. The system needs stable claim/revision identity,
provenance, competent adjudication, decision reasons and propagation evidence.
Consumers must distinguish corrected, withdrawn, disputed, superseded and stale
representations. Success is timely remedy and an explainable release, not an
illusion that publication ends epistemic uncertainty.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. Editorial systems outside these repositories may already own challenge and
   adjudication; public APIs may correctly expose only approved results.
2. Item-level provenance could burden ordinary consumers and belong in an
   optional evidence capability.
3. Audit rows plus release notes may be sufficient for operational correction
   even if they are not a public contestability interface.
4. The enumeration incident may be a software completeness defect rather than a
   disputed curriculum claim, requiring different remedy but the same
   propagation evidence.

**Changed assumption:** contestability does not require every payload to carry a
full editorial history. It requires stable referents and an addressable evidence
and correction path, with compact status/provenance in ordinary representations
and richer detail on demand.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** the chain can record selected row changes and API
changes, but no pinned evidence joins a challenged public claim to adjudication,
new release, rebuilt projections and downstream observation. OCE should preserve
that relation even when upstream owns the decision.

| Proposition                                                                                                                                                                                                           | Warrant                                                                                               | Explicit falsifier                                                                                                                          |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** model stable claim/revision identity, provenance, epistemic status and correction/supersession relations in the OCE semantic core, while leaving adjudication to the competent curriculum authority. | Additional consumers need to recognise and propagate a correction without becoming curriculum judges. | Every consequential public claim is immutable/final by nature or existing IDs and metadata already support complete correction propagation. |
| **Proposition:** expose an optional evidence/correction capability and compact release/status metadata, rather than embedding editorial workflow in every payload.                                                    | Ordinary use and contestation require different detail, but must share referents.                     | Consumers either require full evidence in every response or never need to trace/challenge a claim.                                          |
| **Proposition:** run a correction drill from one source claim through publication, projection, API, snapshot, search and two consumers, measuring stale surfaces and remedy time.                                     | Repository-local audit and changelog do not establish ecosystem propagation.                          | Existing release evidence already proves bounded propagation and lets every consumer identify the corrected revision.                       |

**Unresolved evidence:** editorial challenge channels; subject-expert authority;
appeal and safeguarding obligations; existing content IDs and release semantics;
cache invalidation; downstream notification; legal correction/removal duties; and
which claims require public reasons.

---

## Lens 10: consumer cognition and teachability (fixed lens 54)

### Governing question

Can consumers use, extend and diagnose contracts without repository or database
archaeology?

### Movement 1: reflect on raw observations

- **Observed:** Database Tools documents Drizzle as introspected from a live
  database, hand-maintained Zod as a separate present authority and derivation
  between them as future work
  (current process,
  future direction).
- **Observed:** oak-openapi rules describe source Zod flowing to generated
  OpenAPI, then state that the generator is broken and source and generated files
  must be synchronised manually
  (declared flow,
  manual exception).
- **Observed:** OCE removed its Greek-inspired architectural taxonomy because it
  impeded onboarding, increased cognitive overhead and mapped inconsistently to
  runtime concerns and ownership
  ([deprecation rationale](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/historical/greek-ecosystem-deprecation.md#L1-L27)).
- **Observed:** OCE explicitly documents aggregate tools as user-oriented
  operations combining multiple API calls, distinct from generated endpoint
  tools
  ([capability catalogue](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts#L80-L165)).
- **Unknown:** task-completion evidence for external developers, teachers or
  agents; support questions; diagnostic time; and which concepts users actually
  understand.

**Inherited assumption exposed:** more reference documentation does not repair a
false mental model. If "generated", "version", "lesson" or "complete" changes
meaning across boundaries, fluent documentation may make misunderstanding more
confident rather than less likely.

### Movement 2: define the problem space

**Problem frame:** a teachable kit lets a consumer predict what a capability
does, choose the right one, interpret absence/error/freshness and diagnose the
next boundary without learning provider internals. Its conceptual vocabulary,
types, examples, diagnostics and architecture must tell the same story. Success
is independent task completion and accurate explanation, not documentation
volume or type-checking alone.

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. Curriculum structure is intrinsically complex; some learning cost cannot be
   designed away.
2. Generated clients and types may already hide most implementation complexity
   from ordinary consumers.
3. Endpoint-level tools may be useful for expert exploration even when aggregate
   capabilities are easier for common tasks.
4. Historical naming problems may have been local to contributors and say
   little about external consumer cognition.

**Changed assumption:** discoverability is not primarily a naming or docs task.
It is conceptual integrity plus staged disclosure: stable intent-level
capabilities first, exact transport and provenance when needed, and diagnostics
which preserve rather than erase boundary information.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** OCE has already learned that internally coherent
taxonomy can obstruct people and that authored capabilities convey intent better
than endpoint translation alone. The kit should make that lesson structural and
test comprehension as a quality attribute.

| Proposition                                                                                                                                                                                                         | Warrant                                                                                           | Explicit falsifier                                                                                                                     |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** publish a small literal concept vocabulary and capability catalogue generated from the same descriptors as SDK/MCP declarations, examples and diagnostics.                                         | Parallel prose and generated/manual representations currently permit contradictory mental models. | Independent consumers already form accurate, consistent models and generated documentation adds no correctness or maintenance benefit. |
| **Proposition:** test representative journeys with new developers and agent consumers: identify a lesson placement, enumerate a release, interpret restriction/staleness, recover from an error and add an adapter. | Teachability is an observed consumer outcome, not a source-code property.                         | Participants complete and explain every journey accurately within the justified threshold using the current surfaces.                  |
| **Proposition:** retain endpoint primitives as an inspectable advanced layer, while making stable domain capabilities the default entry point.                                                                      | Generated reachability and authored intent provide different real value.                          | Capability abstraction obscures essential choices or forces materially different consumers into misleading common operations.          |

**Unresolved evidence:** consumer populations and prior knowledge; API support
records; SDK/MCP usage; terminology research with teachers; accessibility of
diagnostics; agent tool-selection results; and a justified learnability target.

---

## Lens 11: intentional kit boundary and ecosystem enablement (fixed lens 55)

### Governing question

Which invariants should OCE encode, expose or generate, and which decisions must
remain with products and competent external authorities?

### Movement 1: reflect on raw observations

- **Observed:** OCE already treats the public Oak HTTP API as its provider
  boundary rather than letting applications consume database implementation
  details
  ([boundary](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L7-L10)).
- **Observed:** its source register distinguishes governed sources from
  consumers, names MCP and semantic search as present consumers, and explicitly
  anticipates more consumers without redefining the sources
  ([consumer distinction](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/governance/DATA-SOURCES.md#L90-L105)).
- **Observed:** OCE combines generated transport-level tools with explicitly
  authored capabilities for search, fetch, orientation, graph traversal,
  browsing, exploration and asset download
  ([authored capability definitions](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts#L80-L165)).
- **Observed:** the lesson-enumeration incident demonstrates a subtle obligation
  that every whole-corpus consumer could otherwise rediscover: a fast nested
  summary is not a complete placement relation
  ([incident and relation](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/architectural-decisions/083-complete-lesson-enumeration-strategy.md#L8-L81)).
- **Unknown:** the full planned consumer set, which APIs are intentionally
  public, extension compatibility policy, and which curriculum/policy decisions
  Oak wants ecosystem builders to control.

**Inherited assumption exposed:** this kit is not an application waiting for a
second consumer before extracting shared code. Enabling additional consumers is
an explicit purpose. That does not justify speculative generic abstractions; it
raises the standard for stable concepts, total extension contracts and
consumer-owned policy boundaries from the start.

### Movement 2: define the problem space

**Problem frame:** the kit should encode each difficult, product-independent
obligation once and make materially different products possible without forks.
It must not centralise product intent, pedagogy, ranking, interface or deployment
choices merely because shared infrastructure can express them. Success is a
small semantic core, lossless contract machinery, stable capabilities and
conformance tools whose extension points preserve product freedom and make
additional consumers cheaper to build correctly.

The tentative allocation is:

| Kit action                        | Candidate responsibility                                                                                                                                                                                  |
| --------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Encode**                        | stable entity/revision/release/placement identity; provenance and epistemic state; truthful result/error/operation semantics; compatibility and deprecation records                                       |
| **Expose**                        | intent-level curriculum capabilities, provider ports, resource-link/delivery ports, policy decision inputs/reasons and diagnostics                                                                        |
| **Generate**                      | transport declarations, validators, clients, fixtures, adapter descriptors and documentation from one loss-aware contract IR                                                                              |
| **Verify**                        | provider conformance, supported-language totality, snapshot integrity, capability contracts, adapter substitution and release compatibility                                                               |
| **Leave to products/authorities** | UI and workflow, ranking and recommendation objectives, deployment vendor, telemetry destination, source adoption, curriculum adjudication, and the actual rights decision behind an injected policy port |

### Movement 3: reflect on possible explanations

**Competing explanations:**

1. A thin generated HTTP SDK may be the only common layer; richer domain
   capabilities could prematurely freeze contested concepts.
2. A broad application framework may reduce duplication further by prescribing
   search, MCP, persistence, telemetry and UI together.
3. Different consumers may need such different projections that only immutable
   releases and primitive queries should be shared.
4. OCE's existing authored capabilities may already reveal a stable middle layer
   between raw endpoints and product workflows.

**Changed assumption:** the kit boundary should not be decided by code reuse or
the number of current callers. A concern belongs in the kit when it protects an
independent cross-consumer obligation and has a coherent extension contract. A
choice remains outside when competent products can legitimately disagree without
violating that obligation.

### Movement 4: synthesise and propose

**Synthesis:** **Inferred:** a truer OCE basis is neither a generated client nor
an application platform. It is an ecosystem kernel: published curriculum
release and placement semantics, immutable provider contracts, a total contract
compiler, authored capabilities, explicit policy/link ports and executable
conformance. Products compose those parts and retain their own intent.

| Proposition                                                                                                                                                                                                                                                                  | Warrant                                                                                                                                             | Explicit falsifier                                                                                                                                 |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Proposition:** organise the intentional kit as `curriculum-model`, `release-snapshot`, `contract-snapshot/compiler`, `transport`, `capabilities`, `resource-links`, `policy-ports`, `adapters` and `conformance`, with dependencies pointing inward to semantic contracts. | These responsibilities recur across live API, bulk, SDK, MCP and search but have different authorities and change reasons.                          | The split repeatedly requires cyclic dependencies, duplicated semantics or consumer-specific conditionals that a smaller coherent boundary avoids. |
| **Proposition:** design and verify three first-class consumer profiles from inception - an interactive teaching workspace, a whole-corpus/indexing consumer and an agent/MCP adapter - without treating any as the canonical application.                                    | The kit intentionally enables additional consumers; these profiles stress bounded live reads, coherent releases and intent-level tools differently. | One profile necessarily dictates the semantic core, or the common contracts contain no meaningful obligation beyond raw HTTP.                      |
| **Proposition:** require extensions to declare authority, semantic inputs/outputs, failure model, provenance, compatibility range and conformance fixtures; prefer registration/composition over framework hooks with hidden lifecycle.                                      | Additional consumers need trustworthy extension without inheriting product or platform assumptions.                                                 | A materially simpler extension mechanism provides equal static/runtime assurance and supports the same divergent consumers without forks.          |
| **Proposition:** challenge every candidate kit feature with a removal test: which independent outcome fails if it is absent, and could a premise or upstream contract eliminate the need?                                                                                    | Existing decorators, workarounds and parallel schemas often preserve knowledge while compensating for removable causes.                             | The test removes capabilities users require or repeatedly rejects mechanisms later shown to be intrinsically necessary.                            |

**Unresolved evidence:** product strategy and public support obligations; planned
consumers; curriculum-domain validation; extension governance; package/API
compatibility policy; user research; performance envelopes; and which upstream
premises can actually change.

---

## Cross-lens hand-off

These eleven passes triangulate one proposition without making it true by
repetition: OCE should preserve stable meaning, evidence and capability while
allowing implementations, products and institutions to vary under explicit
contracts. The next synthesis must still test whether the proposed concepts
collapse further, whether the institutional authority exists to sustain them,
and whether representative consumers find the kit both sufficient and
understandable.
