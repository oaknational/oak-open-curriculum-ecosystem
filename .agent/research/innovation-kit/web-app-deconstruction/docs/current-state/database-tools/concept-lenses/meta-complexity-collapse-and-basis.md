# Database, API and OCE through meta-architecture lenses

## Status and method

This record runs fixed portfolio lenses 56-59 from the
[Database, API and OCE concept-lens portfolio](README.md). Local lens numbers are
1-4 for validator compatibility.

Evidence is pinned to:

- `Database-Tools@3d1eff31`;
- `oak-openapi@2fb1383b`; and
- [`OCE@bd878a3a`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

The method is OCE's pinned
[`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md).
These are reflective passes over the other lenses. Repetition is not counted as
independent evidence; the purpose is to classify, challenge and compress.

### Evidence notation

- **Observed:** directly supported by a pinned source.
- **Inferred:** warranted interpretation of observations.
- **Unknown:** consequential evidence not established here.
- **Proposition:** falsifiable claim about a system or conceptual replacement.
- **Candidate explanation:** live alternative retained until discriminated.

## Perspective map

| Local lens | Fixed lens                                                 | Governing distinction                                               |
| ---------- | ---------------------------------------------------------- | ------------------------------------------------------------------- |
| 1          | 56: essential, chosen, accidental, compensating complexity | independent obligation versus replaceable or self-created machinery |
| 2          | 57: system collapse and premise challenge                  | improving components versus removing the condition that needs them  |
| 3          | 58: reversibility and option value                         | stable public commitment versus adaptable implementation            |
| 4          | 59: conceptual basis and negative space                    | smallest explanatory concepts versus unrepresented reality          |

## Lens 1: essential, chosen, accidental and compensating complexity

### Governing question

Which complexity protects an independent educational, public or operational
obligation, which is a replaceable choice, which is an avoidable defect, and
which exists to compensate for another choice?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** Oak curriculum has genuine many-to-many and ordered structure:
  programmes contain units, unit variants contain lessons, lessons can occur in
  several variants/programmes, and tier/exam-board/pathway context changes the
  placement. The API handler explicitly reconstructs and deduplicates those
  variants
  (reconstruction).
- **Observed:** content rights genuinely constrain reuse. OCE's public-release
  strategy requires the open subset and says the third-party-content filter is
  not yet proved to the required bar
  ([rights obligation](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/strategy/stream-mcp-app.md#L60-L76)).
- **Observed:** different consumers need bounded live queries, whole-corpus
  snapshots, binary delivery, search and intent-level agent tools. OCE explicitly
  targets products and additional ecosystem consumers
  ([kit intent](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/README.md#L36-L63)).
- **Observed:** implementation chooses PostgreSQL, triggers, Hasura, Hono,
  Drizzle, Zod, tRPC, Redis, Prisma, GCS, Mux, Next, OpenAPI, TypeScript, MCP and
  Elasticsearch across the chain. Source does not make those technologies
  educational obligations.
- **Observed:** Database-Tools maintains migrations, mutable SQL docs, Hasura
  metadata, generated Drizzle, hand-authored Zod and sampled tests as overlapping
  schema claims
  (workspaces).
- **Observed:** compensating mechanisms include committed rights lists and
  handler-level availability correction
  ([runtime policy](../api-runtime-contract-and-policy.md#rights-policy-as-compensating-architecture)),
  a per-unit lesson-enumeration workaround
  ([journey trace](../end-to-end-journeys.md#journey-2-enumerate-every-curriculum-placement-for-indexing)),
  static lesson-list snapshots, hard-coded subject catalogues,
  parameter-description overrides, OCE URL decoration and parallel bulk schemas.
- **Observed:** source anomalies include a sign-language join referencing the
  wrong video alias
  ([projection anomalies](../database-authority-and-projections.md#download-and-transcript-projection-anomalies)),
  direct GraphQL string construction
  ([query construction](../api-runtime-contract-and-policy.md#query-construction-ordering-and-pagination)),
  transaction callbacks that resolve a failure value after possible writes
  ([atomicity evidence](../mutation-workflow-and-control.md#atomicity-and-acknowledgement)),
  a migration-token scan finding no explicit relational-reference tokens
  ([relational graph](../database-authority-and-projections.md#relational-graph-without-relational-references)),
  manual and generated schema claims that can diverge
  ([schema divergence](../database-authority-and-projections.md#structural-and-semantic-contract-divergence)),
  and code-generation branches selected by deployment context
  ([build authority](../oce-consumer-and-generation.md#contract-input-and-build-authority)).
- **Inferred:** these are accidental-risk candidates, not proof of exploitability,
  partial commit, production integrity failure or deployed build divergence.
  Runtime probes and deployed artefact comparison remain required.

#### Inherited assumptions exposed

- **Inferred:** quantity of infrastructure does not measure essential domain
  complexity. One missing concept can cause many compensating systems.
- **Inferred:** denormalisation, caching and code generation are not inherently
  accidental. They become problematic when they silently acquire authority or
  lack correspondence evidence.
- **Inferred:** one mechanism can occupy several classes. A query gate protects
  an essential rights obligation through a compensating implementation that also
  contains accidental drift risk.

### Movement 2: define the problem space

**Problem frame:** an excellence-first kit must preserve irreducible curriculum
structure, rights, professional authority, public stewardship, temporal change,
multiple consumer needs and operational truth. It should choose implementation
freely, remove accidental defects, and retire compensations when their root cause
is made explicit.

The classification unit is not a file or technology. It is a responsibility and
the causal reason for its mechanism. “Materialized view” may be a justified read
projection; “version-named MV as public semantic identity” may be accidental;
“second handler correction over the MV” may be compensating.

Success means every major mechanism names its protected obligation, authority,
loss policy, lifecycle and removal condition. Complexity without that account is
not presumed valuable merely because it supports current impact.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the estate is large because a national curriculum
   service really has many independent concerns; aggressive simplification would
   hide them.
2. **Candidate explanation:** independent concerns are real, but several present
   systems repeat the same missing release, policy, relationship and operation
   semantics.
3. **Candidate explanation:** parallel representations are deliberate
   anti-corruption layers, so their independence is protective.
4. **Candidate explanation:** some are legitimate projections, but without
   one-way derivation or continuous correspondence they become competing
   authorities.

#### Changed assumption

The starting assumption that complexity should be reduced changed.
**Inferred:** essential complexity should be represented more explicitly, even if
that adds concepts. Accidental and compensating machinery then becomes removable
because the model is truer, not because simplicity is pursued in isolation.

### Movement 4: synthesise and propose

#### Synthesis

| Class        | Strong examples in this chain                                                                                                                                                       | OCE treatment                                                              |
| ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------- |
| essential    | entity/revision continuity; ordered variant-aware placement; publication; rights; provenance; complete release; multiple use profiles; truthful failure; teacher decision authority | model explicitly with competent authority and evidence                     |
| chosen       | PostgreSQL, Hasura, GraphQL, REST, OpenAPI, TypeScript, Zod, MCP, Redis, GCS/Mux, Elasticsearch                                                                                     | isolate behind ports/contracts; select on fitness; do not export as domain |
| accidental   | wrong aliases/casing, unbound query input, false rollback promise, missing constraints, undocumented clock/version semantics, deployment-dependent input                            | reject through design invariants and executable gates                      |
| compensating | rights lists, availability overrides, per-unit enumeration, static JSON snapshots, subject catalogue loop, parameter overrides, dual bulk schemas, entity-as-operation state        | harvest the obligation, replace root cause, retain removal evidence        |

**Inferred:** the most productive simplification is to make releases,
placements, capability policy, operations and projection watermarks first-class.
Those concepts explain and potentially remove more machinery than swapping any
technology.

| Warranted investigation or proposal                                                                                                                    | Warrant                                                                                                          | Explicit falsifier                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Create a living complexity ledger that classifies responsibilities, not files, and requires authority, evidence, dependencies and removal conditions.  | Current mechanisms frequently mix essential obligation with compensating implementation.                         | Every major mechanism already has an independently reviewed obligation and no class ambiguity affects design or retirement.   |
| Trace each workaround back to the absent concept or upstream guarantee, then prototype that concept without retaining the workaround's shape.          | Per-unit enumeration, rights corrections and parallel schemas each reveal a missing contract rather than a goal. | Each workaround remains necessary and simpler even after the proposed release/policy/contract guarantee is supplied.          |
| Treat projections and generated outputs as disposable, reproducible products with named inputs and conformance, never semantic authorities by default. | MVs, OpenAPI, Zod, MCP and bulk shapes are valuable but lossy for different purposes.                            | One such output is demonstrated to be the only competent source of an independent domain meaning and cannot be reconstructed. |

#### Unresolved evidence

- **Unknown:** organisational, legal and operational constraints that may make a
  chosen mechanism effectively mandatory.
- **Unknown:** usage and change data needed to distinguish protective
  anti-corruption from unmeasured duplication.
- **Unknown:** which compensations have owners and explicit retirement criteria.

## Lens 2: system collapse and premise challenge

### Governing question

Which several systems disappear if their shared premise, authority split or
information model changes?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** complete curriculum reads currently depend on several
  version-named MVs, grouped endpoints, handler reconstruction, per-unit crawl,
  a separate bulk pipeline and later search/graph projections.
- **Observed:** the lesson-summary handler reads one MV, reconstructs placements,
  creates links and corrects rights-sensitive availability
  (handler additions).
- **Observed:** OCE's accepted lesson-enumeration ADR requires complete
  pagination and placement context, while active code calls each unit once at
  `limit: 100` and aggregates only unit slugs
  ([workaround](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/apps/oak-search-cli/src/lib/indexing/fetch-all-lessons.ts#L106-L170)).
- **Observed:** mutation uses application commands plus caller-dependent trigger
  semantics; publication creates/static-copies relationships; MV refresh is a
  separate globally coordinated service; API and consumer caches add further
  observation clocks.
- **Observed:** the public contract crosses hand-authored GraphQL types, source
  Zod, generated/decorated OpenAPI, cached OCE input, several generated trees,
  a partial MCP compiler and authored aggregate capabilities.
- **Observed:** binary assets have an OpenAPI metadata stub and a separate real
  Next route, while OCE excludes the primitive and authors a download capability.

#### Inherited assumptions exposed

- **Inferred:** separate systems often reflect separate present workflows, not
  necessarily separate enduring concepts.
- **Inferred:** “live API versus bulk” is not inherently two curriculum
  authorities. They can be two access projections of one released relation.
- **Inferred:** “endpoint versus tool” is not inherently one-to-one. A generic
  transport executor and authored capability vocabulary can remove per-operation
  execution generation without losing protocol typing.

### Movement 2: define the problem space

**Problem frame:** premise challenge asks whether several locally reasonable
components exist because a deeper semantic decision was avoided. The objective
is not a monolith or minimum component count. It is one coherent authority per
independent concern and the fewest transformations needed to serve distinct use
profiles with evidence.

A collapse is valid only if it retains failure isolation, performance fitness,
rights, history, provenance, replaceability and human value. Combining boxes on
an architecture diagram without preserving those properties is concealment, not
simplification.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** live, bulk, search and agent surfaces have such
   different performance/interaction needs that one source model would create a
   lowest-common-denominator design.
2. **Candidate explanation:** they need different projections, but those
   projections can derive from one immutable release and placement authority.
3. **Candidate explanation:** policy lists at several delivery paths are needed
   because rights vary by channel and use.
4. **Candidate explanation:** rights genuinely depend on intended use, but one
   capability decision model can express that variance instead of duplicated
   channel repairs.

#### Changed assumption

The assumption that “simpler architecture” meant fewer deployed components
changed. **Inferred:** the highest-leverage simplification is fewer independent
semantic authorities and fewer unproved transformations. Multiple optimized
projections may remain.

### Movement 4: synthesise and propose

#### Synthesis

Five collapse hypotheses warrant experiments:

1. **Published release + placement relation:** one immutable release model yields
   live cursor relations, bulk snapshots, search/graph ingestion and curriculum
   traversal, removing endpoint-crawl completeness workarounds and independent
   bulk meaning.
2. **Capability policy:** one decision over principal, content revision,
   intended use, territory and time yields allowed capabilities/reasons, removing
   separate text/quiz/asset lists and handler corrections while preserving
   legitimate use differences.
3. **Command/operation/revision/publication:** explicit identities and transitions
   remove entity-as-workflow state, caller-dependent trigger choreography,
   ambiguous retries and refresh acknowledgement masquerading as publication.
4. **Contract IR + generic executor:** one lossless compile step yields HTTP,
   validation and adapter declarations; authored OCE capabilities compose them,
   removing partial per-operation MCP execution code and parallel manual
   contract edits.
5. **Resource descriptor + delivery capability:** immutable asset metadata plus
   authorised short-lived delivery removes the false JSON binary contract and
   separates rights from byte proxying.

| Warranted investigation or proposal                                                                                                       | Warrant                                                                                                | Explicit falsifier                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------ |
| Prototype one curriculum slice as an immutable release with placements, then derive both cursor API and signed bulk snapshot from it.     | Current live and bulk paths attempt to expose overlapping curriculum meaning through independent code. | Required live and offline semantics cannot derive from one release without lossy compromise or greater independent authority.  |
| Implement one rights decision fixture across text, quiz, asset, bulk and MCP use profiles, preserving reasons and obligations.            | Current paths repair rights independently while OCE needs the open subset consistently.                | Competent rights evidence proves the channels require irreducibly separate authorities or cannot share a decision vocabulary.  |
| Model and simulate an editor command through operation, revision, release and projection under duplicate, reorder, failure and retry.     | Current state and acknowledgement collapse these temporal identities.                                  | One simpler existing state machine proves every safety/liveness property and consumer observation without hidden coordination. |
| Compile a deliberately rich OpenAPI fixture into Contract IR and drive a generic HTTP/MCP adapter, failing every unrepresented construct. | OCE's current partial compiler preserves useful bodies/statuses but loses headers and constraints.     | Generic execution cannot retain required operation-specific semantics without regenerating equivalent bespoke machinery.       |

#### Unresolved evidence

- **Unknown:** cardinality, latency, storage and update profiles needed to test
  derived release projections at realistic scale.
- **Unknown:** competent rights model and whether policy varies by territory,
  principal, time or contractual channel.
- **Unknown:** infrastructure constraints around direct asset capabilities and
  immutable snapshot publication.

## Lens 3: reversibility and option value

### Governing question

Which choices should remain replaceable, which public commitments require
continuity, and where is deliberate irreversibility necessary?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** storage and delivery choices are embedded in PostgreSQL SQL,
  Hasura metadata/directives, Redis key behaviour, Prisma transcript search,
  GCS/Mux delivery, Vercel build selection, OpenAPI generation, MCP and
  Elasticsearch indexing.
- **Observed:** OCE deliberately defines the HTTP API as its boundary and forbids
  direct Hasura/PostgreSQL/MV coupling
  ([boundary](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/docs/architecture/openapi-pipeline.md#L7-L10)).
  This preserves some provider replaceability.
- **Observed:** the public API and OCE nevertheless expose slug/route semantics,
  response shapes, errors and capability names that consumers may persist or
  automate. These are harder to reverse than an internal library choice.
- **Observed:** Database-Tools' compacted baseline has no down migration while
  later migrations mostly do; MV evolution uses version-named coexistence, but
  consumer discovery is heuristic.
- **Observed:** OCE ordinary builds use a commit-pinned schema while Vercel can
  compile against live upstream
  ([selection](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-sdk-codegen/code-generation/resolve-schema-source.ts#L4-L16)).
  That sacrifices reproducibility without providing an intentional rollback
  point.
- **Observed:** open releases can be copied beyond Oak's control. Rights takedown,
  privacy erasure, false-content correction and historical audit have different
  and sometimes conflicting reversibility needs.

#### Inherited assumptions exposed

- **Inferred:** adapters do not automatically create reversibility. Identity,
  data, semantics, history, operations and consumer migration must all have an
  exit path.
- **Inferred:** maximum reversibility is not always excellent. Stable identifiers,
  signed releases and audit facts gain value from immutability; harmful public
  content or personal data can require controlled finality.
- **Inferred:** a mutable live generation input provides changeability, not safe
  optionality, because the chosen state may be unreconstructible.

### Movement 2: define the problem space

**Problem frame:** OCE must distinguish commitments whose continuity lets an
ecosystem trust the kit from implementation choices that should remain adaptable.
Every consequential choice needs a reversibility class, decision authority,
evidence threshold, exit window, migration/compensation path and exercised
recovery. Uncertainty should remain local; it should not leak into public
identity or build reproducibility.

Success means OCE can replace provider implementations, transports, search
engines, storage and hosts without corrupting semantic contracts or losing
history, while making intentional irreversible decisions explicit and
accountable.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** open standards and source availability already
   make the system portable enough.
2. **Candidate explanation:** protocol portability is weaker than semantic/data/
   operational portability and must be exercised.
3. **Candidate explanation:** immutable released snapshots make correction too
   difficult for evolving curriculum and rights.
4. **Candidate explanation:** supersession, revocation and warning records can
   preserve historical authenticity while directing consumers away from harmful
   or invalid releases.

#### Changed assumption

The assumption that public API stability and internal flexibility pull in
opposite directions changed. **Inferred:** strong stable domain identity and
contract snapshots let implementations change more freely because consumers are
not coupled to storage or deployment accidents.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** OCE should stabilize semantic identities, release/contract
provenance and capability behaviour; keep provider, transport, storage, search
and deployment implementations replaceable; and explicitly govern irreversible
publication, deletion, rights revocation and audit decisions.

| Warranted investigation or proposal                                                                                                                   | Warrant                                                                                               | Explicit falsifier                                                                                                             |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Create a decision/reversibility register for identities, releases, contracts, data, policy, providers, stores, search, hosts and generated artefacts. | Current mechanisms offer different partial rollback/exit properties but no chain-wide decision model. | Every consequential choice has current ownership, exercised exit/recovery and explicit finality evidence with no material gap. |
| Run provider-exit exercises for Hasura/API, GCS/Mux, Redis, search and MCP host boundaries using preserved contract and release fixtures.             | Interfaces hide syntax but do not prove semantics, data or operations can move.                       | Recent exercises show bounded migration with no semantic, identity, history, rights or service loss.                           |
| Define immutable release supersession/revocation and restricted historical-preservation semantics with competent legal/editorial authority.           | Open copying, correction, rights and audit create non-equivalent finality obligations.                | One existing policy already reconciles all cases and is enforced through every online, bulk and downstream path.               |
| Make every build consume content-addressed contract/data inputs and record them in output provenance.                                                 | Vercel live-schema selection makes one source revision potentially non-reproducible.                  | Deployment outputs are already cryptographically tied to reviewed immutable inputs despite the observed selection code.        |

#### Unresolved evidence

- **Unknown:** actual provider contracts, data export capability and recovery
  exercises.
- **Unknown:** legal/editorial rules for release withdrawal, correction,
  retention and downstream notification.
- **Unknown:** external consumers' persistence and compatibility expectations.

## Lens 4: conceptual basis and negative space

### Governing question

Which smallest concepts explain what matters across the chain, what important
reality is absent, and what present detail does not deserve conceptual status?

### Movement 1: reflect on raw observations

#### Literal observations

- **Observed:** core curriculum entity primary keys for lessons, programmes,
  units and unit variants combine their IDs with `_state`; slugs, UIDs, releases,
  cohorts and projections add further identities
  (lesson and programme keys,
  unit and variant keys).
  Hasura exposes both state-qualified and all-state edges. **Inferred:** no one
  local model explicitly separates entity, immutable revision, placement and
  public occurrence.
- **Observed:** curriculum publication copies a static lesson list into unit
  variants; MVs may be created empty and refreshed separately; API, cache, index
  and bulk clocks are not returned as one source release.
- **Observed:** rights are represented in database flags/relations plus separate
  committed API lists and handler corrections. Decisions are not returned with
  a policy revision, reason and intended-use context.
- **Observed:** mutations use command-shaped routes but lack durable command/
  operation identity, idempotency and expected revision. Audit rows cannot
  correlate a human command across all side effects.
- **Observed:** contract snapshots, generated types, validators and MCP tools are
  valuable, but transformations can silently narrow or omit meaning.
- **Observed:** OCE has an unusually valuable distinction between generated
  primitive tools and explicitly authored aggregate capabilities
  ([aggregate registry](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts#L112-L165)).
- **Unknown:** the source estate does not establish competent curriculum/rights
  authority, educational validity, representative human outcomes, deployed
  freshness, privacy/retention, complete consumer use or causal incident data.

#### Inherited assumptions exposed

- **Inferred:** table, MV, endpoint, package, repo and tool boundaries are not the
  conceptual basis. They are current decompositions.
- **Inferred:** the negative space is not merely missing documentation. Several
  absent identities and proofs explain repeated compensations.
- **Inferred:** the model must remain small enough to teach, but not collapse
  distinctions whose independent failure changes human or public outcomes.

### Movement 2: define the problem space

**Problem frame:** the OCE kit needs a basis set from which current valuable
capabilities and future consumers can be composed without inheriting current
implementation. Each basis concept must explain several observations, have a
competent authority, retain temporal/provenance meaning and be independently
testable. A concept that merely renames a current component does not qualify.

Success means the basis predicts where current failures occur, lets several
systems collapse without losing obligations, and gives developers and non-
technical authorities a shared vocabulary. Negative space becomes an explicit
research/assurance boundary rather than an assumed implementation detail.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** entity, aggregate, event, policy and projection are
   sufficient standard software concepts; curriculum-specific additions risk
   over-modeling.
2. **Candidate explanation:** curriculum placement and publication release are
   irreducible domain concepts because ordering, variants and educational context
   cannot be recovered from generic entity nesting.
3. **Candidate explanation:** OpenAPI should remain the core basis because it is
   the current public authority.
4. **Candidate explanation:** OpenAPI is one transport contract projection;
   stable OCE capabilities and released curriculum meaning must exist above it.

#### Changed assumption

The assumption that the basis should mirror domain-driven-design nouns changed.
**Inferred:** identity, time, authority, evidence and failure concepts are equally
foundational because most serious seams occur between a domain fact and the
claim that it is current, permitted, complete or durably changed.

### Movement 4: synthesise and propose

#### Synthesis

The portfolio-wide basis is declared once in the
[candidate conceptual kernel](./synthesis.md#candidate-conceptual-kernel). This
meta pass contributes collapse criteria rather than a second declaration:

1. Retain a concept only when it can have an independently changing identity,
   clock, competent authority or failure mode.
2. Publication, projection and contract releases specialise one release
   protocol but do not co-version. Mutable status is a later assertion; a
   projection definition, build, input watermark and observation remain distinct.
3. An OCE capability specialises a capability contract. Authority assignment,
   provenance, evidence, lineage and supersession are explicit relations, not
   fields whose presence makes a claim true.
4. Compilers, materialized views, links and transports are evidence-bearing
   machinery, not basis concepts. A remedy is expressed through capability,
   command, outcome and supersession or revocation; it is not evidence itself.

What does **not** currently warrant basis status:

- PostgreSQL schema names, Hasura relationship names and MV version suffixes;
- REST route decomposition, tRPC procedure names or GraphQL query shapes;
- repository/workspace/package boundaries;
- generated-file populations and intermediate schema dialects;
- Redis, Prisma, GCS, Mux, Vercel, Elasticsearch or MCP as domain concepts;
- compilers, resource links and remedy handlers as independent domain concepts;
- a single `_state` field standing for lifecycle, command and publication;
- endpoint-specific workarounds or current consumer counts.

The most consequential negative space is:

- competent educational, rights, publication and operational authority;
- distinct curriculum, projection and contract release lineages plus a
  coordination manifest which references their identities, policy decision and
  observation time;
- explicit absence/unknown/invalid/stale/withdrawn distinctions;
- completeness and closed-world evidence;
- privacy purpose, retention, correction and deletion;
- operation-to-audit-to-remedy correlation;
- runtime contract and generated-correspondence conformance;
- complete consumer registry and compatibility evidence;
- representative teacher/editor/pupil-protective/developer outcome evidence;
- incident, load, recovery and provider-exit evidence.

| Warranted investigation or proposal                                                                                                                  | Warrant                                                                                                 | Explicit falsifier                                                                                                                |
| ---------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| Build an executable thin slice using only the proposed basis, from authoring revision through release, projection, API adapter and OCE capability.   | The basis explains repeated failures but has not yet proved implementation sufficiency or teachability. | The slice requires reintroducing several current mechanism-shaped concepts to retain an independent obligation.                   |
| Create authority, identity, time and evidence diagrams in vocabulary shared with curriculum, rights, product, operations and ecosystem actors.       | Source-only technical vocabulary cannot settle institutional or educational meaning.                    | Those actors already share a more precise current model that covers every basis distinction and negative-space item.              |
| Turn each negative-space item into an evidence request or explicit non-goal before architecture commitments.                                         | Unknown evidence can otherwise be silently converted into framework policy or false certainty.          | Decisions remain correct under adversarial revelation of every unknown because none can change a concept, boundary or obligation. |
| Curator-test the basis by explaining every current valuable capability and every high-severity failure, then remove any concept with no unique work. | A basis set must compress observations without hiding independently failing distinctions.               | A smaller alternative explains and predicts all observations with equal authority, failure and evidence precision.                |

#### Unresolved evidence

- **Unknown:** whether the basis is comprehensible and useful to curriculum,
  editorial, legal, operations and independent ecosystem participants.
- **Unknown:** whether real cardinality/performance needs require another
  foundational temporal or partition concept.
- **Unknown:** which negative-space evidence exists outside these repositories
  and would split, merge or invalidate proposed concepts.
