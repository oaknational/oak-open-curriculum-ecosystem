# Database-Tools through semantics, information, time and state

## Status and method

This record covers fixed portfolio lenses 7-17 from the
[Database, API and OCE concept-lens portfolio](README.md). The lens numbers in
this file are local and sequential because the research validator requires each
record to begin at Lens 1; the register correspondence is explicit below.

The evidence is Database-Tools pinned to
`3d1eff31a398189a839ae68bcf69990089c31bd2`.
The method is OCE's pinned
[`concept-exploration`](https://github.com/oaknational/oak-open-curriculum-ecosystem/blob/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa/.agent/skills/concept-exploration/SKILL-CANONICAL.md)
Practice at
[`bd878a3a550c8e5e5d21163a6d0962cebdaf43fa`](https://github.com/oaknational/oak-open-curriculum-ecosystem/tree/bd878a3a550c8e5e5d21163a6d0962cebdaf43fa).

Every lens runs the four movements in order. This is current-state research for
OCE and the Oak Innovation Kit. It neither recommends changes to Database-Tools
nor assumes that its present mechanisms should survive in a future kit.

### Evidence notation

- **Observed:** directly supported by immutable source lines at the pinned
  revision.
- **Inferred:** an interpretation warranted by cited observations, not a
  declared contract.
- **Unknown:** material evidence is outside this static source pass.
- **Candidate explanation:** a plausible account which remains open.
- **Explicit falsifier:** evidence that would defeat or materially narrow the
  proposal or investigation.

Static source can establish encoded structure, accepted inputs,
transformations, branches, transaction scopes and authored tests. It cannot
establish deployed data, runtime isolation behaviour, traffic, latency,
incidents, editorial practice, organisational authority, educational validity
or whether operational signals are observed and acted upon.

## Perspective map

| Local lens | Portfolio lens                                  | Governing distinction                                             |
| ---------- | ----------------------------------------------- | ----------------------------------------------------------------- |
| 1          | 7: domain ontology and bounded authority        | meaning versus the mechanism currently declaring it               |
| 2          | 8: curriculum graph identity                    | concept versus revision, placement, sequence and address          |
| 3          | 9: epistemic state and data quality             | absent versus unknown, invalid, stale, duplicate and withdrawn    |
| 4          | 10: provenance, lineage and transformation loss | source existence versus reconstructible derivation                |
| 5          | 11: search/read-model relevance                 | available projection versus fitness for an information need       |
| 6          | 12: lifecycle, publication and retirement       | authored, approved, published, projected and supported lifecycles |
| 7          | 13: state machines and temporal logic           | state label versus valid history                                  |
| 8          | 14: transactions and consistency                | transaction syntax versus protected outcome                       |
| 9          | 15: concurrency, idempotency and ordering       | sequential happy path versus competing and repeated work          |
| 10         | 16: freshness and distributed clocks            | refresh time versus the age and release of a claim                |
| 11         | 17: failure semantics and partial success       | accepted request versus truthful durable outcome                  |

## Lens 1: domain ontology and bounded authority

### Governing question

Which kinds, invariants and meanings exist in Database-Tools, and which human or
system authority is competent to define each one?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** the repository declares migrations and Hasura metadata,
  generated SQL documentation, a published Zod/Drizzle contract package, a
  direct mutation API, an authentication function and an MV-refresh function as
  separate workspaces
  (repository structure).
- **Observed:** the documented data flow is explicitly bidirectional: migrations
  can generate schema docs and schema-doc edits can generate migrations
  (declared data flow).
- **Observed:** the schema package says its `public` types are primary consumer
  contracts, its `published` types mirror materialized views, and its `internal`
  types are not intended for external consumption
  (schema categories).
- **Observed:** the same package describes Drizzle as live-database
  introspection and Zod as a separately hand-written runtime/API contract, with
  future intent to derive the latter from the former
  (parallel representations).
- **Observed:** Hasura role generation grants permissions by PostgreSQL schema,
  including all-column, empty-filter CRUD for `editor` and `publisher`
  (permission rules),
  and applies those rules uniformly from the tracked object's schema name
  (permission projection).

#### Inherited assumptions exposed

- **Inferred:** no one representation is authoritative for every concern.
  Migration order, deployed physical shape, navigable graph, runtime validity,
  write validity and consumer meaning have different candidate authorities.
- **Inferred:** PostgreSQL schema names currently carry several meanings at
  once: storage visibility, publication intent, package category and coarse
  authorisation boundary.
- **Inferred:** calling one artefact a source of truth does not resolve which
  institution may decide the educational meaning or policy represented by a
  field.

### Movement 2: define the problem space

**Problem frame:** an Oak application kit must let additional consumers reuse
curriculum capabilities without confusing the authority to store a fact, the
authority to validate its shape, the authority to decide its meaning, and the
authority to expose it. The problem is not the number of representations; it is
an unproved correspondence between representations whose ownership and
competence differ.

This can harm an editor when one entry point accepts what another rejects, a
consumer when a generated type overstates a semantic promise, and the public
when publication or rights policy is inferred from a storage namespace.

Success does not require one universal schema. It requires one named authority
per consequential claim, explicit translations, and evidence that every
secondary representation preserves the intended meaning.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the plurality is deliberate separation of
   physical, transport and semantic contracts, but the explanatory model is
   incomplete.
2. **Candidate explanation:** repository workspaces accumulated around delivery
   needs, and their local schemas became de facto authorities without an
   explicit delegation.
3. **Candidate explanation:** PostgreSQL and Hasura are intentionally the
   semantic centre; Zod and Drizzle are merely incomplete views of that centre.
4. **Candidate explanation:** the mutation API is becoming the authoring
   authority while the older trigger/Hasura paths remain for compatibility.

#### Changed assumption

The starting assumption that this pass should identify _the_ schema authority
changed. **Inferred:** the more discriminating question is which authority owns
each kind of claim and which derivations are allowed to be lossy. A future kit
may have several authorities without reproducing this ambiguity.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools encodes an authority lattice: migration history
governs reconstruction, a live database governs Drizzle shape, SQL documents
can originate changes, Hasura governs exposed graph and role capabilities, and
Zod governs selected runtime boundaries. None of those artefacts alone is
competent to establish curriculum truth, publication legitimacy or consumer
fitness.

| Proposal or investigation                                                                                                                                  | Warrant                                                                                                                         | Explicit falsifier                                                                                                                                      |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Build a claim-authority matrix for identity, curriculum meaning, lifecycle, rights, validation, exposure and freshness before selecting any OCE mechanism. | The same field can be declared by migrations, SQL docs, Drizzle, Zod and Hasura while those artefacts serve different purposes. | Every consequential claim is already assigned to one documented competent authority and every other representation is mechanically derived and checked. |
| Trace one lesson write and one lesson read through every representation, recording where meaning is introduced rather than copied.                         | The repository explicitly combines direct mutation, trigger logic, published projections and consumer contracts.                | Both traces are lossless projections from one authority, with no locally authored semantic decisions.                                                   |
| Treat schema/package/service boundaries as hypotheses in OCE's concept model, not as inherited bounded contexts.                                           | Permission and package categories currently reuse PostgreSQL schema boundaries for concerns that need not coincide.             | Change history and ownership evidence show that each current boundary consistently contains one semantic authority and predicts change.                 |

#### Unresolved evidence

- **Unknown:** who is institutionally authorised to define curriculum,
  publication, restriction and retirement semantics.
- **Unknown:** which representation production consumers and operators treat as
  normative during disagreement.
- **Unknown:** whether a deployed conformance process exists outside this
  repository.

## Lens 2: curriculum graph identity

### Governing question

How do curriculum concept, revision, placement, sequence, slug, record and
projection identities differ, and what preserves their relationships?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** lesson, programme, unit and unitvariant records use composite
  primary keys that include `_state`; for example lessons use
  `(lesson_id, _state)` and unitvariant lessons use
  `(unitvariant_id, lesson_id, _state)`
  (core constraints).
- **Observed:** Hasura manually joins lesson resources on both the referenced ID
  and `_state`
  (state-aligned lesson relationships).
- **Observed:** lesson UID, title and slug uniqueness across non-expired IDs is
  enforced with exclusion constraints rather than by the composite primary key
  (lesson identity exclusions).
- **Observed:** a unitvariant stores an ordered `static_lesson_list` containing
  lesson UID, title, slug and state, selected by preferred lesson ID and then
  copied into JSON
  (static placement snapshot).
- **Observed:** curriculum sequence later uses that static list as its published
  lesson sequence
  (sequence projection,
  published selection).

#### Inherited assumptions exposed

- **Inferred:** `lesson_id` is not sufficient row identity, while `lesson_uid`
  and slug appear to carry different continuity and address obligations.
- **Inferred:** a curriculum placement is not merely a foreign key. It includes
  state-qualified membership, order and a publication snapshot of lesson
  identity/display fields.
- **Inferred:** projection identity can outlive or diverge from the normalized
  relationship that produced it because copied JSON is later maintained by
  separate triggers.

### Movement 2: define the problem space

**Problem frame:** an Oak curriculum capability must distinguish a durable
educational concept from a mutable revision, a placement within a programme and
unit, an ordered sequence entry, a public address and a read-model row. Those
identities need different invariants. Collapsing them can make reuse,
publication, redirects, rights decisions and change history ambiguous.

Success means every edge states what its endpoints identify, what temporal or
publication context qualifies it, and whether a copied projection remains
traceable to the exact source identities from which it was made.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** integer ID is concept identity and `_state` is a
   revision discriminator; UID and slug serve editorial and public continuity.
2. **Candidate explanation:** the state-qualified row is the real aggregate and
   equal integer IDs across states are intentionally only loose lineage.
3. **Candidate explanation:** `static_lesson_list` is an intentional immutable
   release snapshot, so duplication is a domain representation rather than a
   cache.
4. **Candidate explanation:** the snapshot is a performance workaround whose
   business authority emerged accidentally because downstream reads depend on
   it.

#### Changed assumption

The first graph sketch treated `programmes -> units -> unitvariants -> lessons`
as an ordinary relational hierarchy. **Inferred:** it is a versioned placement
graph plus copied release projections. Identity questions must be answered per
node and edge, not per table.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools preserves valuable distinctions between concept,
state-qualified record, placement, sequence and address, but represents them
through reused primitives rather than explicit identity types. OCE should
preserve the distinctions while leaving open whether they are records, graph
nodes, immutable revisions, release manifests or another mechanism.

| Proposal or investigation                                                                                                                                             | Warrant                                                                                                | Explicit falsifier                                                                                                                                              |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Produce an identity-and-edge census for every ID, UID, slug, compound key and copied JSON reference in the lesson-to-programme graph.                                 | The current model uses all five forms for different operations and projections.                        | One immutable identifier is preserved through every relevant table, projection and public address, with all other values proven to be non-authoritative labels. |
| Test whether `static_lesson_list` is a release authority or a repairable cache by comparing it with normalized edges before and after controlled publication changes. | Curriculum sequence reads the copy, and a separate lesson trigger mutates the copy after its creation. | A declared invariant and automated reconciliation prove the list is always a lossless derivation and never independently authoritative.                         |
| Model concept, revision, placement, sequence position and address as separate OCE concepts before considering storage design.                                         | The same lesson participates in state-qualified rows, ordered placements and public projections.       | Domain owners demonstrate that these are intentionally one indivisible identity with one lifecycle and one cardinality.                                         |

#### Unresolved evidence

- **Unknown:** intended cardinalities across programmes, unitvariants, cohorts
  and releases.
- **Unknown:** whether UID or slug stability is guaranteed outside the inspected
  constraints.
- **Unknown:** deployed orphan, duplicate and snapshot-divergence rates.

## Lens 3: epistemic state and data quality

### Governing question

How are absent, unknown, invalid, duplicate, stale, disputed and withdrawn facts
represented, and what evidence makes a data-quality claim trustworthy?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** database lifecycle validation accepts `new`, `published`,
  `suspended`, `expired` and the command-like `clone`
  (database state vocabulary),
  while the shared Zod state schema accepts `published`, `new`, `migration` and
  `expired`
  (package state vocabulary).
- **Observed:** JSON reference validators equate validity with array shape and a
  one-for-one count of published target IDs; this also rejects duplicated IDs
  because array length exceeds matching row count
  (tag-reference validator,
  TPC-media validator).
- **Observed:** the lesson trigger deliberately skips forbidden-character,
  structure, reference, slug and whitespace checks for mutation-API writes,
  while retaining other derived processing
  (caller-dependent validation,
  remaining processing).
- **Observed:** the new lesson-content contract test catches schema failures and
  only logs the lesson ID, whereas the published test rethrows a failure
  (new-content evidence rule,
  published-content evidence rule).
- **Observed:** lesson contract tests validate at most 100 rows in each of two
  states without an ordering criterion
  (lesson sample,
  assertions).

#### Inherited assumptions exposed

- **Inferred:** “valid” depends on both representation and write path. A value
  can be valid to the package, invalid to the state trigger, or exempt from a
  database check because of caller identity.
- **Inferred:** null, absence, not-yet-authored, deliberately unsupported and
  validation failure are not consistently represented as distinct epistemic
  states.
- **Inferred:** passing tests establish conformance for the observed sample and
  test policy, not global data quality.

### Movement 2: define the problem space

**Problem frame:** an Oak capability must communicate what is known about a
claim, not only its value. Consumers need to distinguish legitimate absence,
unknown or not-yet-processed information, invalid shape, unresolved reference,
duplicate fact, stale derivation, withdrawal and deliberate redaction. A single
nullable field, omitted row or generic validation failure cannot carry all of
those meanings truthfully.

Success means a quality claim names its population, invariant, authority,
observation time and treatment of exceptions. Unknown and invalid states remain
visible enough to support repair rather than silently becoming absence.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** draft/new data intentionally tolerates partial
   validity, while publication is the point at which strict validity matters.
2. **Candidate explanation:** validation is migrating from triggers to the
   mutation API, so temporary vocabulary and enforcement differences are
   expected.
3. **Candidate explanation:** different schemas describe deliberately different
   populations, but their names do not expose that scope clearly.
4. **Candidate explanation:** historical production data cannot satisfy new
   contracts, so sampling and caught failures are pragmatic observability rather
   than assurance.

#### Changed assumption

The initial assumption that inconsistency simply means one schema is wrong
changed. **Inferred:** several validity regimes may be legitimate, but each must
name its population and transition obligation. The defect to investigate is
unlabelled epistemic scope, not mere syntactic difference.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools contains useful quality controls but no unified
epistemic model. State, caller, target publication status, sample policy and
projection stage all alter what counts as valid. OCE should make quality and
partial knowledge explicit at capability boundaries rather than inherit a
binary valid/invalid premise.

| Proposal or investigation                                                                                                                                                | Warrant                                                                                | Explicit falsifier                                                                                                                           |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| Build a validity-regime matrix by entity state, caller, operation and projection stage.                                                                                  | Trigger bypasses, Zod vocabulary and contract-test policies differ in observable ways. | The regimes reduce to one documented invariant set with mechanically equivalent enforcement on every path.                                   |
| Run population-wide, deterministically ordered conformance queries and classify every failure as absent, unknown, invalid, duplicate, stale, withdrawn or policy-exempt. | Current tests either sample 100 rows or deliberately swallow draft failures.           | Production-scale evidence proves the sample is representative and every nonconformance already has an explicit epistemic category and owner. |
| Define an OCE-facing result vocabulary for partial knowledge before choosing nullable fields, unions or error mechanisms.                                                | Current representations cannot distinguish several consequential negative states.      | Consumers demonstrate that all negative states are intentionally equivalent for every supported outcome.                                     |

#### Unresolved evidence

- **Unknown:** actual failure distributions and whether invalid draft data is
  prevented from publication by another gate.
- **Unknown:** whether `migration`, `suspended` and `clone` are intentionally
  excluded from particular package populations.
- **Unknown:** data-quality service levels, ownership and repair workflows.

## Lens 4: provenance, lineage and transformation loss

### Governing question

Can every consequential database or projection claim be traced to its source,
transformation, authority and discarded meaning?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** schema-doc reconciliation strips comments and whitespace before
  comparison, retains a library definition when no migration exists, and only
  iterates definitions already represented in the library
  (comparison and selection,
  library-led reconciliation).
- **Observed:** generated schema docs add the chosen source path as a comment
  before writing the definition and any parsed indexes
  (source-comment generation).
- **Observed:** the materialized-view parser associates indexes only until an
  intervening `CREATE` statement, even if a later index targets that MV
  (MV/index parser).
  The squashed migration creates the lesson OpenAPI and downloads unique indexes
  much later than their views
  (separated indexes),
  while their current SQL documents end without those indexes
  (lesson projection terminus,
  downloads projection terminus).
- **Observed:** publication archives the replaced lesson and review rows as
  untyped JSON snapshots before deleting them
  (archive transition);
  the archive table records source table, integer ID, UID, release IDs and row
  JSON but no source schema version or transformation identifier
  (archive shape).
- **Observed:** audit rows preserve table name, record key, operation, changes
  and service/application identity
  (audit shape and actor extraction,
  audit write).
  The mutation API supplies a constant service actor rather than the validated
  human claim
  (database session context,
  request claim validation).

#### Inherited assumptions exposed

- **Inferred:** a source-path comment establishes file ancestry, not deployed
  provenance or semantic authority.
- **Inferred:** the bidirectional library can preserve an object without proving
  that it is deployed, and can lose operationally important adjuncts such as a
  unique index during extraction.
- **Inferred:** row archives and audit changes preserve valuable evidence but do
  not by themselves reconstruct the exact schema, caller, projection release or
  final downstream claims.

### Movement 2: define the problem space

**Problem frame:** consequential curriculum claims must be reconstructible from
named authorities through every transformation, including which version and
state were selected, which alternatives were discarded, who initiated the
change and when a projection observed it. Provenance is not merely retaining an
old row; it is preserving enough context to explain why a consumer saw a claim.

Loss can occur through state preference, JSON aggregation, aliases, omitted
fields, schema extraction, caller identity substitution and independently
refreshed projections. Success means each loss is intentional, documented and
testable against the outcome it serves.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** source comments and archives are intentionally
   operational conveniences, while authoritative provenance lives in Git and
   deployment logs.
2. **Candidate explanation:** full historical reconstruction is unnecessary;
   only current publication and limited editorial recovery are valued.
3. **Candidate explanation:** release IDs are intended to correlate the whole
   chain, but several projections and logs simply do not expose them yet.
4. **Candidate explanation:** schema docs are a working library containing both
   deployed and prospective definitions, so absence from migrations is not a
   lineage error if status is known elsewhere.

#### Changed assumption

The first framing equated lineage with “which SQL generated this row.” That
changed. **Inferred:** useful lineage must cover institutional authority,
selection and information loss as well as technical dependency. A perfect SQL
dependency graph still cannot explain why a claim was approved or what a
consumer was entitled to infer.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools retains several partial provenance systems: ordered
migrations, source comments, release IDs, archive snapshots and audit deltas.
They are valuable but do not compose into one claim lineage. OCE should preserve
the capability to explain and reproduce claims while leaving open whether that
uses manifests, events, typed transformations, generated evidence or another
mechanism.

| Proposal or investigation                                                                                                                                                                  | Warrant                                                                                 | Explicit falsifier                                                                                                            |
| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Trace one published lesson field and one rights restriction from authored row to every stored/read projection, recording release, source state, transformation and discarded alternatives. | Current projections aggregate JSON and sometimes select preferred or published states.  | A deployed lineage manifest already reconstructs every selected input and transformation for those claims.                    |
| Rebuild a blank database from migrations and compare catalog objects, indexes and dependencies with SQL docs, metadata and generated schemas.                                              | Reconciliation is library-led and MV index parsing is position-sensitive.               | The rebuilt catalog is mechanically identical in every operationally relevant respect and CI already proves that equivalence. |
| Define the minimum provenance needed by an OCE consumer to explain a curriculum answer, without prescribing storage.                                                                       | Current row audit and archives omit human principal and projection/release correlation. | Consumer and accountability research shows source release, actor and transformation are never material to supported outcomes. |

#### Unresolved evidence

- **Unknown:** deployment manifests, migration application state and live
  catalog drift.
- **Unknown:** retention, immutability and operational use of archive and audit
  records.
- **Unknown:** whether human identity and approval evidence are retained in an
  external system.

## Lens 5: search and read-model relevance

### Governing question

Which projections exist for which information need, and what makes their
selection, aggregation and ranking fit for use?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** the lesson search function ranks only title similarity, applies
  optional exact unit/subject/key-stage filters, excludes legacy and financial
  education lessons, imposes no minimum similarity and returns the top 20
  (lesson search).
- **Observed:** Hasura function tracking is enabled through a zero-row view whose
  purpose is to define `lessonSlug` and `similarity` as the set-returning shape
  (search result type).
- **Observed:** the lesson read model combines programme/unit placement,
  educational content, quizzes, resources, video, rights metadata and a derived
  supervision level in one materialized projection
  (lesson read-model start,
  projection result).
- **Observed:** the thread read model includes only published threads with
  units, excludes foundation/blank programme dimensions, and returns a distinct
  unit count per slug
  (thread relevance policy).
- **Observed:** the curriculum aggregate sums JSON lesson-list lengths grouped
  by subject and phase
  (curriculum aggregate),
  while the underlying curriculum view reads static published lesson lists
  (lesson-list input).

#### Inherited assumptions exposed

- **Inferred:** each read model embeds an information-need policy, not merely a
  performance optimisation. Exclusions, grouping unit, preferred state and
  available fields determine what can be found and what the result means.
- **Inferred:** `lessonCount` counts projected placements in JSON arrays unless
  another invariant proves one placement per concept; it need not count unique
  educational lesson concepts.
- **Inferred:** a schema-valid search result can still be irrelevant, misleading
  or unusable because relevance and completeness are outcome claims rather than
  shape claims.

### Movement 2: define the problem space

**Problem frame:** an Oak read capability must answer a named information need
for a named audience with explicit recall, precision, coverage, ordering,
freshness and rights expectations. A broad materialized row or fuzzy-match
score is only a mechanism. Relevance depends on the user's task and on which
curriculum unit the result represents.

Success means every projection declares its unit of result, included population,
selection policy and acceptable staleness, and its fitness is evaluated against
real information needs rather than inferred from implementation names.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the search function is intentionally a narrow
   title suggestion primitive, not general curriculum search.
2. **Candidate explanation:** hard exclusions encode valid product and policy
   boundaries which are authoritative elsewhere.
3. **Candidate explanation:** large lesson rows are deliberate consumer-ready
   documents which reduce downstream semantic joins.
4. **Candidate explanation:** read models reflect historical endpoint needs and
   have since acquired broader names than their actual fitness warrants.

#### Changed assumption

The first inventory grouped projections by source tables and version names.
That changed. **Inferred:** the more durable classification is by information
need, result identity and fitness criterion. Two projections can share sources
while answering different questions; two differently named MVs can duplicate
one unmet need.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools provides valuable consumer-shaped read models but
their names and schemas do not encode enough of their relevance contract.
Selection policy exists in SQL. OCE should expose reusable read capabilities
whose information need and result semantics are explicit, without assuming that
one search engine, projection topology or materialization strategy belongs in
the kit.

| Proposal or investigation                                                                                                                                | Warrant                                                                                                           | Explicit falsifier                                                                                                                 |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| Create a read-model catalogue keyed by user information need, result identity, population, selection/ranking rule and freshness requirement.             | Current SQL embeds hard exclusions, state preference, aggregation and ranking.                                    | Every projection already has an authoritative specification and evaluation corpus covering those dimensions.                       |
| Evaluate title search with task-specific ground truth, including exact, partial, ambiguous, misspelled, legacy, restricted and cross-curriculum queries. | The current function has one similarity signal and hard-coded exclusions but no source-level relevance threshold. | Product evidence shows it is only an autocomplete primitive and meets its measured quality target across the supported population. |
| Test whether counts and deduplication operate on concepts, revisions or placements before exposing analogous OCE measures.                               | Curriculum aggregates sum copied lesson-list entries.                                                             | A proved graph cardinality establishes those units are always one-to-one.                                                          |

#### Unresolved evidence

- **Unknown:** actual endpoint semantics, queries, traffic and user success
  measures.
- **Unknown:** authoritative reasons for excluded subjects, phases and legacy
  content.
- **Unknown:** whether independent read models are intended to represent one
  release snapshot.

## Lens 6: lifecycle, publication and retirement

### Governing question

What are the independent lifecycles of authored content, approval, publication,
projection, availability and support?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** `internal.releases` contains `approved`, `locked`, `_state`,
  `_deleted` and an estimated release date
  (release record).
- **Observed:** `publish_elements` creates a `new` release, assigns programme
  elements to the selected release ID and then immediately updates matching
  releases to `published`; this function does not inspect `approved` or `locked`
  (release orchestration).
- **Observed:** publishing a release updates associated programmes, units,
  threads and lessons from `new` to `published`
  (release cascade).
- **Observed:** publishing a lesson archives and deletes the previous published
  lesson/review rows, publishes linked assets, videos, quizzes and media-clip
  videos, and interprets `_deleted = true` as deletion of the new row rather
  than publication
  (lesson publication transaction).
- **Observed:** expiry and suspension invoke a separate lesson cascade, while
  transitions between published and new create or delete processing-state rows
  (post-transition lifecycle).

#### Inherited assumptions exposed

- **Inferred:** authored status, approval, release membership, public state,
  deletion intent, processing status and read-model availability are separate
  lifecycle dimensions even though several are coordinated through `_state`.
- **Inferred:** “published” on a source row does not prove that every consumer
  projection has refreshed, nor that an endpoint continues to support it.
- **Inferred:** `_deleted` during publication is a command or intent, not simply
  a persisted truth about availability.

### Movement 2: define the problem space

**Problem frame:** content moves through several independent obligations:
authorship, review, approval, coordinated release, public availability, derived
projection, withdrawal, historical preservation and consumer support. An Oak
kit must preserve these distinctions so that a state transition cannot imply an
approval, freshness or retirement promise it does not actually establish.

Success means each lifecycle has a competent authority, explicit transitions
and correlation to the others. Withdrawal and retirement remain explainable,
including what is no longer served, what remains historically addressable and
which downstream representations have converged.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** release `approved` and `locked` are controlled by
   an external authoring workflow not visible in this repository.
2. **Candidate explanation:** those columns are historical residue and current
   publication authority is entirely represented by the state transition.
3. **Candidate explanation:** `_deleted` enables atomic release-time removal
   while retaining the authored draft until that release.
4. **Candidate explanation:** source publication and MV refresh are deliberately
   asynchronous lifecycles with eventual public convergence.

#### Changed assumption

The first pass treated publication as one state machine. That changed.
**Inferred:** publication is a coordination point among several lifecycles, and
the absence of a visible link between them is more important than the particular
state labels.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools contains valuable release, archive, withdrawal and
processing concepts, but one `_state` transition performs several kinds of work
and does not establish downstream freshness. OCE should preserve lifecycle
separation and release correlation, leaving open whether coordination is a
transaction, workflow, event, manifest or another mechanism.

| Proposal or investigation                                                                                                                                      | Warrant                                                                             | Explicit falsifier                                                                                                               |
| -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Reconstruct the authored, review, approval, release, source-publication, projection and support state machines separately, then map their coordination points. | Release and lesson triggers coordinate several tables while refresh is separate.    | Domain and operational evidence proves all dimensions intentionally form one atomic lifecycle with no externally observable lag. |
| Trace `approved` and `locked` through deployed authoring and publication journeys.                                                                             | The fields exist but the inspected publication function does not consult them.      | A pinned external/deployed authority shows they reliably gate every publication path.                                            |
| Define retirement outcomes for concept, placement, route, download and generated consumer independently before designing OCE lifecycle APIs.                   | Expired, suspended, deleted and archived records have different current behaviours. | Stakeholders demonstrate one retirement event legitimately has identical semantics for every referent and consumer.              |

#### Unresolved evidence

- **Unknown:** external approval workflow and deployed permissions around release
  mutation.
- **Unknown:** intended availability of expired, suspended, deleted and archived
  content to different audiences.
- **Unknown:** lifecycle service levels from source publication to consumer
  observation.

## Lens 7: state machines and temporal logic

### Governing question

Which histories make a visible state valid, and which temporal claims cannot be
derived from the current row alone?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** transition rules permit cloning only from published or
  suspended, prohibit direct insertion into expired/suspended/clone, prohibit
  new-to-expired/suspended, constrain suspended to expired/clone and expired to
  new
  (transition predicates).
- **Observed:** cross-row rules prohibit expired alongside any other state and
  prohibit published alongside suspended for the same identity
  (state combinations).
- **Observed:** the general validator derives a proposed final state set and
  checks both the transition and combination, while relying on primary keys for
  duplicate states
  (composed state validation).
- **Observed:** setting `_state` to `clone` can instead insert a `new` copy and
  restore the original state; that behaviour is skipped for mutation-API
  sessions
  (clone transition behaviour).
- **Observed:** processing state is represented separately by
  `internal.entity_state`, including status, error location/message/time and
  ingest ID
  (processing state).

#### Inherited assumptions exposed

- **Inferred:** `_state` combines at least revision/publication state with a
  transient command (`clone`). A resulting row value alone does not reveal
  which command was attempted or which side effects occurred.
- **Inferred:** validity depends on both the old state and the set of sibling
  rows; it is a temporal and aggregate invariant, not an enum constraint.
- **Inferred:** source lifecycle and processing workflow are distinct state
  machines whose transitions can race or disagree.

### Movement 2: define the problem space

**Problem frame:** a visible curriculum state is valid only if it follows an
allowed history, satisfies aggregate invariants and coordinates correctly with
related state machines. Current-value labels cannot answer “what happened,”
“what was authorised,” “what is still processing” or “which projection has
observed it.”

Success means commands, durable states, transition evidence and temporal
predicates are distinguishable. Required history can be verified without
inferring it from mutable current rows or caller-specific trigger behaviour.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** `clone` is a concise database command protocol for
   clients that cannot call richer operations.
2. **Candidate explanation:** mutation-API bypass marks an intentional migration
   from trigger state machines to explicit application workflows.
3. **Candidate explanation:** sibling-state rows implement a compact bitemporal
   or revision model despite lacking explicit effective-time fields.
4. **Candidate explanation:** processing state is merely an operational lock and
   should not be interpreted as curriculum lifecycle.

#### Changed assumption

The first framing asked whether the allowed enum values were correct. That
changed. **Inferred:** the central question is whether the model preserves the
history and concurrency evidence necessary to justify a state claim. Enum
membership is the least discriminating part of the contract.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** the current state functions preserve important transition and
coexistence rules, but command, revision, publication and processing meanings
cross the same update paths. OCE should carry explicit temporal concepts and
preconditions while remaining neutral about whether they are implemented with
state machines, immutable revisions, workflows or database constraints.

| Proposal or investigation                                                                                                                               | Warrant                                                                                                    | Explicit falsifier                                                                                          |
| ------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- |
| Derive executable state graphs for each entity and entry point, including guards, side effects and sibling-state invariants.                            | The generic transition rules are supplemented and bypassed by table and caller-specific trigger behaviour. | Existing formal state specifications and exhaustive transition tests already prove all reachable histories. |
| Run history-based tests, not only current-state fixtures: repeated clone, publish/delete, suspend/expire, recover and competing processing transitions. | Several validities depend on old state and sibling rows.                                                   | Property tests already cover every state path and show caller-independent equivalent outcomes.              |
| Separate command, durable state, processing status and observed projection state in the OCE concept vocabulary before selecting mechanisms.             | `clone`, `_state`, `entity_status` and MV freshness express different temporal facts.                      | Domain evidence demonstrates they are intentionally one state dimension with one authority and clock.       |

#### Unresolved evidence

- **Unknown:** complete trigger order and reachable transition graph for every
  table.
- **Unknown:** duration, timeout and recovery semantics of processing states.
- **Unknown:** whether historical transition events exist outside row archives
  and audits.

## Lens 8: transactions and consistency

### Governing question

Where are atomicity and consistency required for valued outcomes, and where are
they only suggested by the presence of a transaction?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** Hasura database operations are configured at `read-committed`
  isolation
  (database connection metadata).
- **Observed:** `startCreateAsset` opens a transaction, inserts an asset, assigns
  its UID, inserts processing state and then attempts to attach the asset to the
  lesson; if that final update returns no lesson, the callback returns a normal
  failure object rather than throwing
  (asset creation sequence).
- **Observed:** the shared completion routine can update an asset and then
  return an ordinary failure if updating its processing state fails
  (asset completion sequence);
  its route returns that result from the transaction callback
  (completion transaction).
- **Observed:** `completeReplaceVideo` updates the new video, lesson reference and
  two processing-state rows before updating the review row; if the review row is
  absent it returns a normal 404-shaped result from the callback
  (replacement writes,
  transaction result).
- **Observed:** full and concurrent MV refresh each wrap the entire sequential
  list in one explicit transaction, rolling back all refreshed MVs if any one
  refresh raises an error
  (full refresh transaction,
  concurrent refresh transaction).

#### Inherited assumptions exposed

- **Inferred:** transaction boundaries are present, but the protected business
  invariant is not always explicit. A fulfilled callback carrying a failure
  value and an exception are semantically different to common transaction APIs.
- **Inferred:** under normal Drizzle transaction semantics, returning an error
  value after earlier writes would commit those writes. This is a high-impact
  hypothesis, not established runtime behaviour in this static pass.
- **Inferred:** all-MV atomicity protects “all old or all new” only if the
  projections genuinely form one release snapshot and can tolerate the shared
  transaction duration.

### Movement 2: define the problem space

**Problem frame:** atomicity must be defined around a valued outcome, not around
the lexical scope of a callback. Creating an asset, attaching it to a lesson and
claiming processing ownership may need one all-or-nothing invariant; refreshing
unrelated read models may not. Conversely, committing useful partial work can be
valid only when the response and recovery protocol name it truthfully.

Success means every multi-write operation declares its commit invariant,
isolation assumption and permitted partial outcomes. Business rejection,
technical exception and compensatable progress cannot accidentally select
different commit behaviour.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** post-write failure branches are unreachable under
   database invariants, so ordinary returns are defensive types rather than
   realistic partial-commit paths.
2. **Candidate explanation:** the transaction library or local wrapper rolls
   back on returned failure values through behaviour not visible here.
3. **Candidate explanation:** orphan assets and completed-but-unlinked resources
   are acceptable recoverable outcomes, despite the HTTP response calling the
   whole operation a failure.
4. **Candidate explanation:** one global MV refresh transaction deliberately
   defines an atomic published snapshot across all projections.

#### Changed assumption

The initial review counted explicit `transaction` calls as evidence of
consistency. That changed. **Inferred:** a transaction proves little until its
commit signal and protected invariant are tested. The operation's semantic unit
can be smaller or larger than its SQL transaction.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools deliberately uses transactions for multi-row
authoring and refresh work, but static structure exposes a possible split
between business failure signalling and rollback signalling. OCE should make
commit semantics part of the capability contract while leaving transaction,
workflow and compensation mechanisms open.

| Proposal or investigation                                                                                           | Warrant                                                                      | Explicit falsifier                                                                                                                   |
| ------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| Execute each post-write failure branch against an isolated database and inspect committed rows after the response.  | Several callbacks return ordinary failure objects after prior writes.        | The transaction runtime rolls back on those values, or proved constraints make every branch unreachable.                             |
| State an outcome-level invariant for create/complete/replace operations before choosing OCE transaction boundaries. | Current handlers coordinate lesson, asset/video, review and processing rows. | Product owners explicitly accept each partial state and a tested recovery protocol makes it truthful and convergent.                 |
| Test whether all materialized views belong to one atomic release cohort or independent consistency domains.         | The refresh service places every enumerated MV in one transaction.           | Consumer contracts require and observe one all-MV snapshot, and dependency/freshness evidence proves the transaction establishes it. |

#### Unresolved evidence

- **Unknown:** actual Drizzle version/runtime rollback behaviour for fulfilled
  failure values in this configuration.
- **Unknown:** database constraints that may make the post-write failure paths
  unreachable.
- **Unknown:** lock duration, snapshot semantics and consumer expectations during
  full MV refresh.

## Lens 9: concurrency, idempotency and ordering

### Governing question

What happens when commands are duplicated, delayed, reordered or executed
concurrently against the same curriculum referent?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** the mutation API reads an entity-state row using only entity ID
  and type, without an explicit lock
  (entity-state read).
- **Observed:** `startReplaceVideo` reads `api_neutral`, then separately updates
  the row to `api_in_progress`, and creates a new video plus a second processing
  row
  (check-then-update,
  new replacement identity).
- **Observed:** the shared entity-state update predicates only on entity ID and
  type, not the expected prior status or prior update timestamp
  (state update predicate).
- **Observed:** completing replacement validates that the submitted old video
  still equals the lesson's current video before writing the new video and
  lesson reference
  (replacement precondition).
- **Observed:** the MV trigger reads the last-update time and status, applies a
  30-second/12-hour gate and then issues a separate statement to set `started`
  (refresh admission).
  It enumerates refreshes alphabetically by materialized-view name
  (refresh ordering).

#### Inherited assumptions exposed

- **Inferred:** transactions do not eliminate check-then-act races at
  read-committed isolation. Two starts can plausibly observe `api_neutral`
  before either unconditional update becomes visible.
- **Inferred:** completion has one useful stale-command check, but request
  identity and retry semantics remain distinct from entity-state preconditions.
- **Inferred:** alphabetical refresh order is operational determinism, not
  dependency order or semantic release order.

### Movement 2: define the problem space

**Problem frame:** curriculum workflows and projections must remain correct when
clients retry after uncertainty, users compete, queues reorder work, functions
overlap and an older completion arrives after a newer start. The required
property may be rejection, deduplication, serialization, commutation or safe
compensation; “inside a transaction” is not enough to choose among them.

Success means every command has a referent, precondition, repeat semantics and
ordering rule. A duplicate or stale command has a deterministic outcome which
does not silently overwrite newer intent.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** the authoring client serializes operations and
   never retries a start command, making database contention outside the
   supported contract.
2. **Candidate explanation:** uniqueness constraints or low traffic bound the
   race even without an explicit compare-and-set predicate.
3. **Candidate explanation:** multiple replacement rows are acceptable work
   attempts, and the old/new video IDs supplied at completion select the winner.
4. **Candidate explanation:** the refresh status row is an adequate lease in
   practice because triggers are daily and manual overlap is rare.

#### Changed assumption

The first framing treated idempotency as an HTTP concern. That changed.
**Inferred:** repeat and ordering semantics attach to domain commands and
projection epochs, regardless of transport. An idempotency key alone cannot
resolve competing legitimate commands; a lock alone cannot explain retry.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools contains partial concurrency protocols: processing
statuses, transaction scopes, current-reference checks, uniqueness constraints
and refresh admission times. Their combined guarantee is not explicit. OCE
should encode command identity and precondition concepts once, while allowing
consumers to choose contention policy appropriate to the workflow.

| Proposal or investigation                                                                                                                 | Warrant                                                                                             | Explicit falsifier                                                                                                          |
| ----------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Race two start-replace requests and two refresh requests under controlled barriers; inspect created rows, status ownership and responses. | Both paths use separate read/check and update statements without a visible lock or compare-and-set. | Database/runtime evidence proves one contender is serialized or rejected before any duplicate work is committed.            |
| Enumerate retry semantics for every start/complete/error authoring command using the same and different payloads.                         | Multi-step operations expose uncertainty windows and externally supplied old/new IDs.               | Every command is already demonstrably idempotent or explicitly rejects a duplicate with a recoverable canonical result.     |
| Derive actual projection dependencies from `pg_depend` and compare them with alphabetical refresh order.                                  | The service orders names, not declared dependencies.                                                | The live graph has no inter-MV/order-sensitive dependencies and every normal-view composition tolerates independent epochs. |

#### Unresolved evidence

- **Unknown:** client-side serialization, retry and timeout behaviour.
- **Unknown:** PostgreSQL row-lock behaviour induced indirectly by triggers or
  constraints on these exact paths.
- **Unknown:** production overlap frequency and whether abandoned processing
  leases are repaired.

## Lens 10: freshness and distributed clocks

### Governing question

Which source, release, materialized-view, package and observer clocks govern the
truth of a visible claim?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** `viewmanager` stores source-level `has_updated`, `next_update`,
  trigger status, last error and timestamps; `viewmanager_mvs` stores per-MV
  refresh start/finish, status, group and timestamps
  (freshness-state tables).
- **Observed:** a source update helper only changes an existing matching
  `viewmanager` row; it does not create one
  (dirty timestamp helper).
- **Observed:** the refresh service selects all catalogued `mv_%` rows, choosing
  concurrent refresh solely from whether its catalog helper found a unique
  index
  (MV selection);
  the helper classifies any matching `CREATE UNIQUE INDEX` text as eligible
  (index classification).
- **Observed:** the scheduled trigger runs once daily, requests the
  fire-and-forget concurrent mode and has zero retries
  (refresh cron).
- **Observed:** the lesson OpenAPI MV is created `WITH NO DATA`
  (unpopulated creation),
  and the transcript view joins that MV to a separately named lesson-content MV
  (cross-MV composition).

#### Inherited assumptions exposed

- **Inferred:** last refresh completion is not source freshness. It does not
  state which source release, transaction or change watermark was included.
- **Inferred:** a normal view joining two independently refreshed MVs can expose
  a mixed epoch even when each MV is individually healthy.
- **Inferred:** dirty flags, schedules and timestamps are potential control
  signals, but the inspected refresh selection does not use per-source or
  per-MV `has_updated` or refresh groups.

### Movement 2: define the problem space

**Problem frame:** a consumer-visible curriculum claim is temporal: it reflects
particular source revisions, a projection build, a deployment and an observation
time. “Fresh” must therefore name a reference clock and acceptable lag. A recent
refresh timestamp cannot prove that all required inputs were populated, mutually
consistent or from the intended release.

Success means a consumer can determine the projection epoch or source watermark
relevant to its outcome, and operators can distinguish never populated,
refreshing, current, stale, mixed-epoch and failed states.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** all source publication happens in a daily batch,
   so one global refresh time is a sufficient operational clock.
2. **Candidate explanation:** the `viewmanager` fields anticipate a richer dirty
   dependency system which has not been completed.
3. **Candidate explanation:** mixed MV epochs are acceptable because transcript
   joins are monotonic or keyed to stable lesson identities.
4. **Candidate explanation:** production is bootstrapped through a blocking full
   refresh or restored snapshot before concurrent scheduling begins.

#### Changed assumption

The first framing called this an MV scheduling problem. That changed.
**Inferred:** scheduling is downstream of the semantic question “fresh relative
to which claim and clock?” OCE needs a vocabulary for observation and release
epochs before it needs a refresh mechanism.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools records several operational clocks but does not
carry a source release or watermark into the inspected consumer rows. Global
refresh can therefore establish completion time without establishing semantic
coherence. OCE should make freshness inspectable and capability-specific while
remaining neutral about caches, MVs, streams or on-demand computation.

| Proposal or investigation                                                                                                             | Warrant                                                                                         | Explicit falsifier                                                                                                             |
| ------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ |
| Build a clock map from source transaction/release through dirty signal, MV refresh, normal-view composition and consumer observation. | Current tables record multiple times but projections do not expose their included source epoch. | One existing release identifier or watermark is already propagated and checked through every projection and consumer response. |
| Bootstrap a blank migration-built database using only the production refresh path and classify every MV as populated/current/failed.  | Some MVs begin `WITH NO DATA`, while scheduled operation requests concurrent refresh.           | A documented, tested production bootstrap always performs a successful initial population before concurrent mode is reachable. |
| Determine freshness requirements per OCE capability rather than inherit a global daily policy.                                        | Lesson detail, search, restrictions, counts and downloads can have different harm from lag.     | Stakeholder and incident evidence establishes one shared freshness bound and atomic epoch for every supported capability.      |

#### Unresolved evidence

- **Unknown:** production bootstrap, refresh duration, source-change frequency
  and measured staleness.
- **Unknown:** whether `viewmanager` rows are seeded or maintained outside the
  pinned migrations and seeds.
- **Unknown:** consumer cache/package clocks and acceptable lag by outcome.

## Lens 11: failure semantics and partial success

### Governing question

Which failures preserve useful outcomes, uncertainty and recovery, and which
responses truthfully acknowledge durable success?

### Movement 1: reflect on the raw observations

#### Literal observations

- **Observed:** after admission, the MV trigger sends HTTP 200 “successfully
  requested” before entering the selected refresh action
  (early acknowledgement).
- **Observed:** refresh failures are caught after rollback, written to logs and
  status rows, and are not returned through the already-sent HTTP response
  (concurrent failure handling,
  fire-and-forget failure handling).
- **Observed:** the daily caller configures no retry after a failed or uncertain
  invocation
  (cron retry policy).
- **Observed:** `startCreateAsset` can return “Failed to update lesson with new
  asset” after asset and entity-state inserts have already run in its
  transaction callback
  (create partial-outcome branch).
- **Observed:** `completeReplaceVideo` can return 404 for a missing review row
  after updating the video, lesson and processing states in the callback
  (replacement partial-outcome branch).

#### Inherited assumptions exposed

- **Inferred:** accepted, started, committed, projected and observed success are
  different acknowledgements. The refresh endpoint names request acceptance but
  uses an unqualified success status/message which callers may overinterpret.
- **Inferred:** if ordinary failure returns commit earlier writes, the authoring
  API can report whole-operation failure while preserving undocumented partial
  success. If it rolls them back, static review still cannot infer that from the
  response model.
- **Inferred:** useful partial progress is not inherently wrong; hidden partial
  progress without a handle, state or recovery contract is the concern.

### Movement 2: define the problem space

**Problem frame:** an Oak capability must distinguish rejection before work,
accepted asynchronous work, committed source change, pending projection,
partial durable progress, complete observation and terminal failure. When the
caller cannot know which occurred, retry can duplicate work and users cannot
repair or safely continue.

Success means acknowledgements are monotonic and evidence-based: each response
states what has definitely happened, what may still happen, how to observe it
and which partial outcomes are recoverable. Failure containment should preserve
useful work only when that is an explicit domain choice.

### Movement 3: reflect on possible explanations

#### Competing explanations

1. **Candidate explanation:** “successfully requested” intentionally means only
   accepted asynchronous work, and operators observe terminal status elsewhere.
2. **Candidate explanation:** the refresh function sends early solely to avoid
   caller timeout, with Slack/status rows serving as an operational completion
   channel.
3. **Candidate explanation:** post-write mutation failures are unreachable or
   rolled back, so the partial-success risk is only apparent.
4. **Candidate explanation:** orphan or intermediate entities are deliberate
   workflow records which error endpoints later reconcile.

#### Changed assumption

The starting taxonomy was success versus failure. That changed. **Inferred:**
the relevant model is a progression of knowledge and durable effects. HTTP code,
transaction result, processing state and projection freshness each acknowledge
a different stage.

### Movement 4: synthesise and propose

#### Synthesis

**Inferred:** Database-Tools contains recovery-oriented processing states and
refresh status, but caller-visible acknowledgement is not demonstrably aligned
with terminal durable outcomes. OCE should make operation identity, accepted
work, commit evidence, projection observation and recoverable partial outcomes
first-class concepts without prescribing synchronous or asynchronous transport.

| Proposal or investigation                                                                                                                                   | Warrant                                                                                         | Explicit falsifier                                                                                                       |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| Build a failure-injection matrix for every boundary: before first write, between writes, commit, refresh start, individual MV and completion-status update. | Current paths have multiple catches, return-valued business failures and early acknowledgement. | Existing end-to-end tests already prove response, durable rows, status and retry behaviour for every boundary.           |
| Give each long-running or multi-step capability an observable operation identity in the OCE concept model before choosing transport.                        | Refresh and asset workflows can outlive the initiating request or end ambiguously.              | All supported operations are proven atomic and synchronously observed, so no caller can face an uncertain outcome.       |
| Distinguish rejected, accepted, committed, projected, partially completed and failed outcomes in consumer contracts.                                        | Current HTTP and status mechanisms refer to different stages of completion.                     | Consumer research proves callers neither retry nor act differently across those states and no harmful ambiguity results. |

#### Unresolved evidence

- **Unknown:** runtime transaction outcome for ordinary returned failure objects.
- **Unknown:** who observes refresh status or Slack alerts and what remediation
  follows.
- **Unknown:** actual retry behaviour after timeouts, 200 acceptance or 4xx
  responses with possible partial work.
- **Unknown:** whether public consumers can detect or recover from stale
  projections after acknowledged refresh failure.
