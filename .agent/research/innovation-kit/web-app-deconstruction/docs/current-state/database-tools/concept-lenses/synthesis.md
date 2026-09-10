# Database, API and OCE multi-lens synthesis

## Status and question

**Status:** warranted synthesis over 59 fixed Concept Explorer passes, six
end-to-end journeys and revision-exact executable evidence. It is a candidate
basis for OCE exploration, not an implementation decision or a remediation plan
for the source repositories.

**Pinned evidence:**

- `Database-Tools@3d1eff31`
- `oak-openapi@2fb1383b`
- [`OCE@bd878a3a`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa)

The governing question is not how to reproduce Database-Tools, oak-openapi or
OCE's present generation machinery. It is:

> What independent truths, obligations and outcomes make a system necessary;
> which current mechanisms deliver real value; and what smaller, truer set of
> concepts would let an OCE kit deliver at least that value with stronger
> correctness, evolvability and evidence?

Static source establishes encoded structure, behaviour and declared intent. It
does not establish production state, institutional authority, legal correctness,
workload fitness, educational validity or human impact. Those limits remain part
of the conclusion.

## Synthesis corpus

| Record                                                                          | Contribution to this synthesis                                                                                      |
| ------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| [Human outcome and public value](./human-outcome-and-public-value.md)           | teacher authority, pupil protection and capability, educational validity, public stewardship and developer progress |
| [Semantics, information, time and state](./semantics-information-time-state.md) | authority, identity, epistemic state, provenance, lifecycle, clocks, concurrency, freshness and truthful failure    |
| [Contracts and public API](./contracts-and-public-api.md)                       | schema/protocol distinctions, representation profiles and transformation proof obligations                          |
| [Trust, rights and policy](./trust-rights-and-policy.md)                        | authentication, authorisation, privacy, audit/remedy, content rights and use policy                                 |
| [Operations and assurance](./operations-and-assurance.md)                       | fault domains, workload fitness, control, projection refresh, recovery, evidence and conformance                    |
| [Evolution, institutions and kit](./evolution-institutions-and-kit.md)          | change, portability, ownership, contestability, cognition and framework boundary                                    |
| [Meta-architecture](./meta-complexity-collapse-and-basis.md)                    | complexity classification, premise collapse, reversibility and candidate basis                                      |
| [End-to-end journeys](../end-to-end-journeys.md)                                | composition tests across trustworthy reads, enumeration, assets, bulk release, mutation/publication and evolution   |

The fixed register and validation contract are retained in the [portfolio control
record](./README.md). Repetition across records is triangulation, not independent
evidence.

## How the lenses relate

| Lens family                            | Relationship to the repository/runtime map | Distinct protected subject or failure                                                     |
| -------------------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------------- |
| human outcome and public value         | orthogonal expansion                       | teacher decision authority, pupil access/safety, educational validity and public-good use |
| semantics, information, time and state | orthogonal expansion                       | truth, identity, absence, lineage, clocks and transition validity                         |
| contracts and public API               | recursive deepening plus expansion         | proof across representations and protocol-specific outcomes                               |
| trust, rights and policy               | orthogonal expansion                       | permitted use, privacy, accountability and lawful/contractual distribution                |
| operations and assurance               | orthogonal expansion                       | bounded failure, load, recovery, control and warranted operational claims                 |
| evolution, institutions and kit        | orthogonal expansion                       | change across time, organisations and future consumers                                    |
| six journeys                           | triangulation                              | whether the distinctions compose into outcomes rather than local acknowledgements         |
| meta-architecture                      | collapse test                              | whether a concept explains independent work or merely renames a mechanism                 |

The passes are not 59 proposed subsystems. Their purpose is to stop one dominant
frame, such as database structure or OpenAPI shape, from deciding what matters.

## Meta-result

**Inferred:** the estate is not best understood as database, API, SDK and product
layers. It is a chain of claims and transformations with plural authorities:

```text
curriculum/editorial assertions
  + referent, revision and placement identities
  -- publication authority --> immutable curriculum release
  -- projection definition --> immutable projection release
  -- protocol authority ----> immutable contract release
  -> generated transport machinery
  + delegated authority and contextual policy decision at use time
  -> authored intent-level capability outcome
  -> teacher, pupil, public and ecosystem outcomes
```

Every arrow is a proof obligation. Every noun can have a distinct competent
authority, identity and clock. The current systems provide substantial value, but
several convenient projections and compensations carry meaning which has no
explicit upstream home. That makes local success easy to overstate and change
expensive to reason about.

The strongest simplification is therefore not fewer deployed components. It is:

1. no accidental competing authorities for the same scoped assertion;
2. fewer unproved transformations;
3. explicit identities for facts that change independently; and
4. outcomes whose evidence is no stronger or weaker than their names.

## Common threads

### 1. Authority is plural and competence-specific

A database constraint can establish relational integrity. It cannot establish
that content is educationally valid, publication is authorised, a use is rights-
permitted, or a generated capability is comprehensible. OpenAPI can declare a
protocol shape; it cannot become authority for curriculum truth merely because
consumers generate from it.

**Consequence:** every consequential assertion needs a competent authority
assignment scoped by claim/operation, role, context, jurisdiction and time. The
model distinguishes decider, steward, operator and affected consumer, and records
delegation explicitly. The OCE kit should encode the protocol for supplying and
preserving authority evidence, not appoint itself curriculum, rights or
adjudication authority. Excellence may require more explicit authorities, not
fewer.

### 2. Identity and time are the hidden architecture

Stable entity, authored revision, curriculum placement, publication release,
projection build, contract snapshot, command, operation and delivery grant are
not synonyms. They can change on different clocks and fail independently. Slugs,
row state, MV suffixes, package versions and cache timestamps currently stand in
for several of these identities without one shared meaning.

**Consequence:** identity and clock design precede storage, endpoints and code
generation. Version strings identify a typed promise, not merely a changed file
or SQL object.

### 3. Release identity and completeness are the largest negative space

Live endpoints, bulk archives, search indexes and graph projections all claim a
corpus, but no source establishes one scope-closed public curriculum release that
identifies exact revisions and placements. Nor is there a coordination manifest
which references that curriculum release alongside the independently versioned
projection release, contract release, policy decision and observation time.
Enumeration workarounds are therefore being asked to prove a closed world from
open-ended reads, while several independently changing clocks are left implicit.

**Consequence:** completeness is a property of a scoped release and manifest, not
of a successful traversal. “Open release” means its declared scope is closed and
restrictions are explicit; it does not assert that every associated asset is
redistributable.

### 4. Relationships are first-class meaning

Lesson-unit-programme-tier occurrence, revision-to-asset association,
release-to-projection derivation and command-to-audit correlation carry identity,
order, provenance and time. Nesting resources, deduplicating by slug or copying
arrays erases that meaning.

**Consequence:** OCE's semantic model should retain relationship identities and
cardinalities even when a delivery projection embeds or flattens them.

### 5. Outcomes and evidence matter more than acknowledgements

Accepted, committed, projected, published, delivered and verified are different
outcomes. HTTP `200`, a resolved transaction callback, successful refresh start,
schema parsing, code-generation completion and cache equality each prove a much
narrower fact than downstream callers can infer.

**Consequence:** name typed outcomes and attach evidence to them. Create an
addressable operation only where work is asynchronous or completion-ambiguous;
do not turn every request into workflow infrastructure.

### 6. Every transformation is a proof obligation

The chain crosses SQL, Hasura metadata, GraphQL queries/types, handler Zod,
OpenAPI, a committed cache, OCE decorations, generated types/Zod/MCP and authored
capabilities. Some transformations are partial, manual or policy-bearing. The
historical [provider/consumer comparison](../../../../evidence-harness-provenance.md#openapi-providerconsumer-comparison)
established exact structural equality only for two pinned snapshots; it did not prove
runtime conformance or future compatibility. It verifies a matching installed
lock snapshot and blocks common in-process network entry points, but does not
content-verify installed dependency files or provide OS network isolation.

**Consequence:** separate acquisition from pure transformation. Each accepted
input is immutable; each transformation declares its supported language, losses
and output identity; conformance is executable and blocks release when its claim
would otherwise be false.

### 7. Capability contracts are a candidate durable kit surface

Primitive endpoint wrappers preserve useful reachability, but future consumers
need stable intent such as finding trustworthy curriculum, enumerating a complete
release or obtaining an allowed asset. Those intents cross endpoints and OCE-
owned policy/link behaviour.

**Consequence:** test the proposition that OCE should generate protocol primitives
and author capability contracts. Do not pretend that one operation automatically
translates into one excellent tool, and do not hide authored capability semantics
or policy inside generated files.

### 8. Compensations contain knowledge

Rights lists, availability corrections, subject catalogues, parameter overrides,
static snapshots, per-unit enumeration and parallel schemas are not merely debris.
They encode missing policy, completeness, relationship, contract or release
requirements.

**Consequence:** mine the invariant, authority and counterexamples before
removing the mechanism. A compensation is retired only when its independent
obligation has another tested home.

## Unique findings which must not collapse

- **Educational validity and professional authority:** conformance cannot prove
  that content supports a sound teaching decision. Representative curriculum and
  teacher evidence is irreducible.
- **Epistemic vocabulary:** absent, unknown, invalid, duplicate, stale, withdrawn
  and policy-excluded states produce different actions and must not collapse into
  `null`, empty arrays or `404`.
- **Representation profiles:** JSON metadata, bulk archive, redirect, range
  response and streamed bytes have different contracts even for one resource.
- **Fault and workload domains:** consumer-coherent recovery boundaries and real
  workload/resource budgets are independent of semantic elegance.
- **Contestability:** a public knowledge system needs claim, challenge,
  adjudication, correction and superseding release, not only write access and an
  audit row.
- **Cognitive fitness:** an enabling kit is excellent only if additional
  consumers can discover and diagnose capabilities without reconstructing Oak's
  repositories. Primitive detail should be progressively disclosed.
- **Asset separation:** a resource descriptor, a policy-derived delivery grant
  and actual byte delivery can have different lifetimes, providers and failure
  semantics.

## Candidate conceptual kernel

This is the smallest basis currently able to explain the valuable capabilities
and the serious seams without retaining current topology. It is a grammar of
typed referents, assertions, contracts, decisions, commands, outcomes and
relations; the curriculum and delivery rows are necessary domain specialisations.

| Concept                   | Unique independently failing distinction                                                                                |
| ------------------------- | ----------------------------------------------------------------------------------------------------------------------- |
| typed referent identity   | stable identity for curriculum entities, actors/principals, institutions, decisions, releases, operations and artefacts |
| authored revision         | exact authored state of one curriculum referent at one lineage point, excluding independently versioned relations       |
| typed relation            | versioned association, ordering, derivation or equivalence whose identity/cardinality can change independently          |
| curriculum placement      | ordered, variant-aware occurrence of a revision within curriculum context                                               |
| assertion                 | claim which may be authored, derived, ranked, disputed or superseded                                                    |
| epistemic status          | explicit knowledge state rather than overloaded absence                                                                 |
| typed release             | immutable scoped payload with identity, issuing authority, lineage, digest and completeness                             |
| transformation definition | versioned declared mapping, supported language and loss/rejection policy, separate from an execution/build              |
| capability contract       | semantic intent, inputs, possible outcomes and obligations independent of transport/provider                            |
| policy decision           | principal/use/referent/context decision with reasons, obligations and policy revision                                   |
| command                   | authorised intent with stable identity, preconditions, correlation and defined duplicate-submission semantics           |
| outcome                   | typed fact: accepted, committed, projected, published, delivered, verified or failed                                    |
| operation                 | optional progress/retry identity for genuinely asynchronous or completion-ambiguous work                                |
| resource descriptor       | identity, media, integrity, size and representation metadata                                                            |
| delivery grant            | scoped, time-bound permission or credential to obtain one representation                                                |

Four cross-cutting relation families complete the kernel:

- **authority assignment and delegation:** which principal is decider, steward or
  operator for a scope, context, jurisdiction and interval, and how that authority
  was delegated or revoked;
- **provenance/derivation:** where it came from and which transformation produced
  it;
- **evidence:** what observation warrants the named assertion or outcome; and
- **lineage/supersession:** what precedes, replaces, revokes or corrects it.

Publication releases, projection releases and contract releases specialise
`typed release`; they do not co-version and do not share one clock or competent
authority. A coordination/response manifest may reference all of their identities
plus a policy-decision identity and `observedAt`, without turning them into one
release. Mutable current/withdrawn/revoked/distribution-eligible state is a later
assertion over an immutable release, not part of its payload.

A projection definition, its immutable derived release/build, its input watermark
and a consumer's observation time are four separate facts. OCE capabilities
specialise capability contracts. Remedy is a capability and command which
produces a correcting, revoking or superseding outcome; evidence is not remedy.

### Three meanings of capability

| Meaning                                 | Owner and role                                                                                                     |
| --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| semantic `CapabilityContract`           | OCE can own the stable meaning, inputs and outcomes of a kit operation                                             |
| delegated authority/security capability | a competent authority grants a principal scoped power to invoke; the kit preserves and verifies the grant protocol |
| `PolicyDecision`                        | a competent policy authority decides whether this invocation is allowed and why                                    |
| `DeliveryGrant`                         | an enforcement-ready, scoped and time-bound result/credential for one representation                               |

The kit owns protocols and conformance where appropriate. It does not silently
own grants or decisions merely because its adapter evaluates or transports them.

## Coverage of non-technical obligations

The kernel is not sufficient merely because it explains technical seams. These
obligations map to it as follows; the final column remains empirical assurance,
not another data type.

| Obligation                                 | Kernel expression                                                                                  | Evidence still required                                                     |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| educational validity and teacher authority | curriculum assertion + scoped competent-authority assignment + provenance/evidence                 | expert review and representative teacher decision-quality evidence          |
| audience, accessibility and safeguarding   | capability-contract obligations + policy decisions + typed outcomes                                | accessibility conformance, safeguarding cases and pupil/audience research   |
| purpose, retention, privacy and erasure    | scoped policy assertions/decisions + release scope + supersession/tombstone outcomes               | data inventory, lawful-purpose review and deletion/backup propagation tests |
| delegation and least authority             | principal identity + scoped delegation/revocation relation + capability contract + policy decision | allow/deny/delegation/revocation matrix across every enforcement channel    |
| representation profiles                    | resource descriptor + capability contract + transformation definition                              | JSON/archive/redirect/range/stream protocol-conformance corpus              |
| workload budgets and fault domains         | typed outcomes + optional operations + projection identities/watermarks                            | measured load, contention, failure isolation, recovery and resource budgets |
| contestability and remedy                  | assertion/evidence + challenge authority + command/outcome + lineage/supersession                  | real challenge, adjudication, correction and propagation exercises          |
| cognitive fitness                          | small capability contracts + progressive disclosure + diagnostic outcomes                          | task-based comprehension and diagnosis with independent consumers           |

## What should survive

The current implementation forms do not receive automatic design authority, but
these demonstrated values survive premise challenge:

- stable public HTTP independence from database/Hasura internals;
- explicit curriculum structure, ordering, variants and reusable identities;
- rights-aware differences between discovery, text, quiz and asset use;
- bounded online reads plus complete offline and indexing use profiles;
- immutable reviewed contract inputs and generated protocol safety;
- authored aggregate capabilities above primitive transport operations;
- optimized read/search/graph projections where workload evidence warrants them;
- auditability, release history and the ability to correct or supersede;
- accessibility, teacher agency, pupil protection and public reuse;
- a kit deliberately designed to enable consumers not yet known.

## What does not deserve conceptual status

The following are candidate implementations or present evidence, not foundations:

- PostgreSQL schema, Hasura relationship and materialized-view names;
- REST/tRPC/GraphQL/MCP route or procedure decomposition;
- repository, workspace and package boundaries;
- Redis, Prisma, GCS, Mux, Vercel, Elasticsearch or any chosen vendor;
- generated intermediate files and generator populations;
- cache TTLs, query counts and deployment-specific code paths;
- entity `_state` as a substitute for revision, workflow and publication;
- hard-coded lists, overrides, endpoint workarounds and current consumer count;
- contract compiler, resource link or remedy handler as domain concepts.

Projections do retain obligations for identity, coexistence, freshness,
compatibility and conformance. Demoting their current topology does not demote
those obligations.

## Premise-collapse hypotheses

These are experiments, not an OCE implementation commitment:

1. **Release and placement authority:** one immutable publication release and
   explicit placement relation can derive cursor reads, bulk manifests,
   search/graph ingestion and curriculum traversal without endpoint-crawl
   completeness workarounds.
2. **Capability policy:** one competent decision protocol over principal,
   referent, revision, intended use, territory and time can replace duplicated
   rights corrections while preserving legitimate channel differences.
3. **Command, outcome and projection:** explicit identities can replace entity-as-
   workflow state, caller-dependent trigger behaviour, ambiguous retries and
   refresh acknowledgement presented as publication.
4. **Contract release and transformation:** immutable acquisition plus a total
   intermediate representation can derive HTTP clients, validators and transport
   adapters while authored capabilities retain intent-level semantics.
5. **Descriptor, grant and delivery:** stable resource metadata plus policy-
   derived delivery grants can remove the false JSON/binary shadow contract and
   keep storage providers replaceable.

Each hypothesis fails if the collapsed mechanisms protect an independently
failing obligation which the proposed basis cannot represent with equal or
stronger evidence.

## Architectural consequences for OCE

The conceptual result favours an idiomatic architecture, but does not select one
without experiments:

1. **Pure semantic kernel:** dependency-free types, invariants and transition
   functions for identities, assertions, releases, policy decisions and outcomes.
2. **Ports around competent authorities:** curriculum, publication, rights and
   delivery providers implement explicit contracts; adapters do not acquire
   authority by convenience.
3. **Immutable release pipeline:** content-addressed curriculum manifests,
   independently identified projection and contract releases, explicit source
   watermarks and atomic publication make online, bulk and indexing claims
   comparable without co-versioning rights decisions.
4. **Purpose-built read models:** CQRS-style projections are permitted where
   workload contracts justify them; their release input, lag, rebuild and
   conformance remain observable.
5. **Hermetic contract pipeline:** acquisition proposes a reviewed contract
   release; pure total transformations produce protocol artefacts; compatibility
   is evaluated against protocol rules and registered capability use.
6. **Generated primitives, authored capabilities:** generated clients expose
   transport completeness while small, stable use-case APIs encode consumer
   intent and progressive disclosure.
7. **Policy-decision boundary:** one typed protocol returns decision, reasons,
   obligations and policy identity; enforcement remains local to every delivery
   channel and is checked for correspondence.
8. **Explicit asynchronous model:** ordinary commands return truthful synchronous
   outcomes; long work uses durable operations, idempotency, an outbox/event log
   where evidence warrants it, and projection watermarks.
9. **Descriptor/grant delivery:** metadata is cacheable and durable, grants are
   short-lived and contextual, and byte delivery is a replaceable representation
   adapter with HTTP-correct range/redirect/stream semantics.
10. **Evidence-bearing assurance:** property tests protect invariants, contract
    tests protect boundaries, corpus fixtures protect curriculum/rights cases,
    and end-to-end probes protect named outcomes. Test count is not evidence by
    itself.

These patterns reduce maintenance and innovation cost only as a consequence of
truthful boundaries and disciplined evidence. Cost is not the design constraint
used to select them.

## Tensions resolved explicitly

- **Projections are mechanisms, yet versioned coexistence matters:** preserve
  release identity, compatibility and migration obligations, not current MV names
  or topology.
- **Generation should be hermetic, but current generation is not always so:**
  hermeticity is a proposed invariant. Live acquisition and manual overlays are
  current counterevidence, not exceptions to rename.
- **Immutable releases meet correction and rights revocation:** preserve history
  through supersession and tombstones. Oak can prevent later controlled delivery
  but cannot recall copied open releases. Immutable public releases must exclude
  personal data whose erasure may be required; mutable/private stores need
  deletion and backup-propagation semantics.
- **The kit needs policy, but must not become policy authority:** encode decision
  protocols, reasons, evidence and enforcement conformance; obtain decisions from
  competent owners.
- **Operations improve truth, but not every call needs one:** use operation
  identity only where work crosses the response or completion is ambiguous.
- **Completeness does not imply universal redistribution:** a release closes its
  declared scope and records excluded/restricted representations explicitly.

## Highest-information investigations

These are ordered by discriminatory value, not assumed time or cost:

1. Obtain authoritative definitions and owners for entity, revision, placement,
   publication, rights decision and public release.
2. Build one executable curriculum slice using only the candidate kernel, then
   derive live cursor, bulk manifest, search input and one OCE capability.
3. Exercise one rights corpus across discovery, text, quiz, asset, bulk and MCP;
   require the same policy identity/reason and channel-correct enforcement.
4. Trace one command through retry, conflict, commit, release, projection,
   publication, audit and correction with deliberate failure at every boundary.
5. Run runtime HTTP conformance across success, error, pagination, redirect,
   range and streaming profiles, then replay additive and breaking changes through
   every generated and authored OCE surface.
6. Test realistic cardinality, skew, concurrency, refresh/rebuild and recovery
   against named workload and fault-domain contracts.
7. Reconstruct a release from backup and source manifests, verify digests and
   provenance, then exercise supersession, rights revocation and provider exit.
8. Observe representative teachers, curriculum experts, accessibility users and
   independent developers using the capability model; test comprehension,
   diagnosis and decision quality rather than satisfaction alone.
9. Establish a consumer registry and use-site compatibility evidence sufficient
   to govern deprecation without treating repository search as proof of absence.

## Predeclared discrimination contracts

A proposition is not falsifiable until its corpus, competing design, observable
invariants and categorical/quantitative failure threshold are registered before
execution. “Evidence already exists” can make an investigation unnecessary, but
does not by itself falsify the proposition.

| Proposition                                                            | Predeclared corpus and competitor                                                                                                                                                      | Candidate-favouring observation                                                                                                                          | Candidate invalidator                                                                                                                                |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| release/placement authority removes enumeration and bulk inconsistency | one scope-closed subject/phase corpus containing every revision, placement, variant and restricted descriptor; compare release-derived live/bulk/search with current independent paths | repeated builds produce exactly the same placement-ID/digest set across all three profiles, with zero unexplained missing, extra or duplicate placements | any predeclared required fact or fault boundary needs a second semantic source which cannot be represented as a projection of the curriculum release |
| capability contracts are the durable kit surface                       | register supported tasks and consumer strata before testing; compare capability API with direct provider primitives                                                                    | every registered task is expressible and diagnosable without provider-specific knowledge, while primitive escape remains explicit                        | any registered task requires leaking an undeclared provider primitive or produces a less truthful/diagnosable outcome than the direct competitor     |
| one policy protocol can unify rights reasoning                         | authority-approved matrix of content, principal, use, channel, territory and time; compare present channel decisions with the common protocol                                          | every case returns the approved decision, reason, obligations and policy identity, with zero cross-channel enforcement mismatch                          | competent authorities require irreducibly incompatible decision semantics for any registered case, rather than different data under one vocabulary   |
| immutable inputs plus total transformations reduce drift               | all constructs used by the pinned API plus adversarial header, cookie, body, response-header, binary, range and error fixtures; compare current generation                             | every construct is preserved with correspondence evidence or explicitly rejected before output; zero silent drops                                        | one required construct or registered capability cannot be expressed without an undeclared semantic branch outside the transformation definition      |
| the candidate kernel is sufficient and minimal                         | all six journeys, every non-technical obligation above and a competing smaller basis                                                                                                   | every independently changing identity, authority, clock and failure is represented, and removing any concept breaks at least one registered case         | a registered case needs another primitive, or a kernel concept can be removed/merged without losing prediction, authority or outcome precision       |
| scoped authority/evidence vocabulary improves institutional fitness    | predeclared curriculum, rights, operations and challenge scenarios with named decider, steward, operator and affected-consumer roles; compare current vocabulary                       | actors locate accountability, disagreement and challenge route for every scenario without role conflation                                                | any scenario cannot express legitimate delegation/jurisdiction/time, or the candidate creates more unresolved role ambiguity than the current model  |

## Unresolved evidence

- production topology, data shape, traffic, tail latency, contention, incidents,
  recovery objectives and actual projection freshness;
- complete runtime consumers and compatibility/support obligations;
- competent curriculum, publication, rights, privacy and adjudication authority;
- source-to-production contract and data conformance;
- representative educational, accessibility, teacher, pupil and public-value
  evidence;
- historical reasons for compensations and whether external systems already
  provide release manifests, control loops or corrective workflows;
- whether the conceptual kernel remains comprehensible under a realistic OCE
  teaching workspace and a genuinely independent consumer.

The next architecture should be chosen only after these unknowns are either
measured or made explicit design assumptions with owners and invalidators.
