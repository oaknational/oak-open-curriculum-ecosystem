# Database authority and projections

## Scope and core judgement

**Status:** source-grounded authority and projection model; live catalogue,
cardinality, state-alignment and freshness experiments remain open

**Pinned source:**
`Database-Tools@3d1eff31`

Database-Tools is not governed by one schema. Six overlapping representations
make different claims:

| Representation          | Strongest current claim                              | What it loses or leaves independent                                       |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------- |
| ordered migrations      | deployable database change/snapshot history          | initial history is compacted; metadata and semantic intent are separate   |
| mutable SQL schema docs | one-file definitions for reasoning and generation    | deployed status, some indexes/provenance and migration-only objects       |
| Hasura metadata         | navigable GraphQL graph, names and role capabilities | physical constraints, deployed consistency and domain authority           |
| generated Drizzle       | introspected relation/column/enum structure          | functions, triggers, constraints, semantics and deliberate lossy rewrites |
| hand-authored Zod       | selected runtime/business contracts                  | complete physical shape and automatic equivalence with live data          |
| tests                   | sampled executable claims                            | untested state space, production application and release enforcement      |

**Inferred:** This is an **authority lattice**, not harmless duplicate typing.
Each representation is independently editable or regenerable, each is lossy in a
different direction, and correspondence is partial. The architectural question
is which competent authority owns each concept and which one-way derivation or
continuous proof joins the rest.

This conflicts with both the SQL schema-doc source-of-truth claim and the
mutation API's Zod source-of-truth language
(root directive).

## Relational graph without relational references

**Observed:** The curriculum graph is principally:

```text
programmes -> programme_units -> units -> unitvariants
                                      -> unitvariant_lessons -> lessons
```

Threads, quizzes/questions, assets/videos, programme dimensions, taxonomy and
third-party-content rights extend it. The compacted baseline declares the core
tables
(baseline tables).

**Observed:** A revision-exact scan of all 37 `up.sql` files (21,201 lines) finds
zero `REFERENCES`, zero `FOREIGN KEY`, and zero `CHECK (` tokens. The measurement
was produced by the historical
[Database/API chain inventory](../../../evidence-harness-provenance.md#databaseapi-chain-inventory).

**Observed:** Hasura recreates graph edges through manual relationships, usually
with both `(id, _state)` and id-only `_all_states` variants
(programmes,
programme units,
unit variants,
lessons).

**Inferred:** PostgreSQL acts as a programmable document/graph store. Referential
and lifecycle integrity is primarily procedural: triggers, JSON validators,
Hasura navigation and application checks. A Hasura relationship makes a query
possible; it does not prevent a broken reference from being stored by another
writer.

## Identity is several different things

**Observed:** `_state` participates in core primary keys:

| Concept                      | Row key in the baseline               |
| ---------------------------- | ------------------------------------- |
| lesson                       | `(lesson_id, _state)`                 |
| programme                    | `(programme_id, _state)`              |
| programme-unit placement     | `(programme_id, unit_id, _state)`     |
| unit                         | `(unit_id, _state)`                   |
| unitvariant-lesson placement | `(unitvariant_id, lesson_id, _state)` |

The declarations are grouped near the end of the baseline
(keys).

Other identity/lifecycle fields include an optional 16-character UID, public
slug, cohort, release, deletion, expiry and projection-specific compounds.

**Inferred:** At least four concepts are currently entangled:

- stable editorial entity identity;
- immutable content revision identity;
- lifecycle/publication state;
- public route or occurrence identity.

Adding `_state` to a row key preserves multiple versions but does not explain
whether two rows are one evolving entity, two immutable revisions, or different
published occurrences. Hasura's parallel state-qualified and all-state edges are
a compensating query vocabulary for this ambiguity.

**Observed:** Programme-field expansion joins dimension rows by slug without
state or cohort, while uniqueness is scoped by slug, state and cohort
(expansion,
dimension uniqueness).

**Proposition:** Legitimate same-slug dimension rows across states/cohorts can
duplicate or ambiguously resolve programme expansion. A database invariant that
only one row can match globally would invalidate it; the direct probe is to add
valid same-slug variants and observe cardinality and selection.

## Lifecycle as state, command and choreography

**Observed:** `_state` is a free-form `varchar(12)`. Functions recognise `new`,
`published`, `suspended`, `expired` and `clone`
(state functions).
`clone` is not a durable condition: it is a command encoded as a transient state.
The generic trigger converts it into a new row and restores the original, unless
the caller is the mutation API
(clone trigger).

Lesson publication is distributed across functions for validation and derived
fields, UID/review/entity-state creation, publish/archive/delete/cascade, and
expiry/suspension propagation
(validation,
after insert,
publish,
cascade).
Those paths explicitly bypass substantial behaviour for mutation API sessions.

**Observed:** Lifecycle also spans `_deleted`, `_release_id`, `_cohort`,
`expiration_date`, `internal.entity_state`, releases, archives and review rows.
`internal.releases` has `approved` and `locked`, but the local publication
function creates and immediately publishes a release without consulting them
(release table,
publication function).

**Inferred:** State, version, command, workflow, approval and public availability
are not one dimension. Trigger choreography and caller identity compensate for a
missing explicit transition model and command boundary.

**Unknown:** An external system may enforce `approved` or `locked`. Without that
evidence, the fields are vestigial locally or document an unrepresented process.

## Structural and semantic contract divergence

**Observed:** Mutation writes validate through selected Zod and route-specific
existence checks while bypassing selected trigger validation
(content guidance,
tags).

Lesson Drizzle and Zod shapes materially differ
(physical relation,
runtime schema,
base states).
Examples include nullable physical fields required by Zod, physical
`additional_files` omitted from the base contract, `lesson_release_date` only in
Zod, and different state vocabularies.

**Observed:** Drizzle is introspected from a live local database, then transformed
through text/regex rewriting which maps unknown enums to text and repairs output
(generation model,
rewriting).

**Inferred:** Drizzle is a useful physical projection, not a semantic schema. Zod
is a useful application contract, not the complete database. Excellence requires
both generated structural truth and deliberately authored semantic truth, joined
by explicit mappings and live conformance rather than declaring either universal.

## SQL schema-doc lineage

**Observed:** Reconciliation normalises comments/whitespace, prefers a library
definition when SQL is equivalent, and iterates objects already present in the
library
(reconciler).
Library-only objects survive even when no migration contains them; migration-only
objects cannot create a destination through this loop; provenance comments can
remain stale when normalised SQL compares equal.

**Observed:** The MV parser attaches only indexes found before an intervening
`CREATE` statement
(parser).
The squashed baseline groups many indexes later. Twenty-one current baseline-
sourced MV documents therefore omit their live unique indexes, including lesson
OpenAPI, downloads and lesson-content MVs.

**Inferred:** A schema-doc-to-migration round trip can remove the concurrent-
refresh prerequisite even when both sides were locally “generated”. This is a
concrete transformation-loss example, not a general objection to code generation.

**Observed:**
`published.mv_openapi_unit_curriculum_content_1_0_2` exists in one schema-doc file
but has no current migration, Hasura metadata, Drizzle relation or test
(definition).

**Inferred:** The library mixes deployed, proposed, abandoned or historical
objects without an explicit status model.

## Projection architecture and clocks

**Observed:** Publishing a unit variant creates a `static_lesson_list` JSON
snapshot; later lesson publication edits it
(creation,
later edit).
Curriculum sequence reads this snapshot instead of rebuilding normalized
placements
(sequence view).

**Inferred:** `static_lesson_list` is both release snapshot and read cache with
business authority, but appears as ordinary mutable JSON maintained through
trigger choreography. Corruption, missed transitions and concurrent publication
need an explicit detection/rebuild contract.

**Observed:** Many initial MVs are created `WITH NO DATA`. Concurrent refresh
cannot bootstrap an unpopulated MV; CI uses a separate blocking refresh script
(CI refresh).
The runtime refresh service enumerates broad sets of MVs, acknowledges before
work, and does not expose a source release/watermark. Daily cron has zero retries.

`published.viewmanager` contains dirty/freshness-looking fields, but the service
does not use `has_updated`, `refresh_group`, `next_update` or `last_error`. No
migration/seed establishes the global source row it assumes.

**Inferred:** Freshness is an operational convention, not a consumer-visible
contract. The chain has distinct clocks for source mutation, release/publication,
static JSON update, MV refresh, Hasura cache, oak-openapi cache, OpenAPI codegen,
OCE release and application observation, but no response names them.

## Selected Database-Tools projections used by the public API

### Projection matrix

This matrix focuses on the Open API projection family and representative
composition anomalies; it is not a complete resolver inventory. The atlas
records all ten exported resolver constants, eight revision-exact database-object
matches, the OWA projection families and the two relations without current schema
documents in
[resolver registry correspondence](repository-and-contract-atlas.md#resolver-registry-correspondence).

| Object                                        | Status at the pin                                               | Important dependencies/semantics                                                  | Material question                                               |
| --------------------------------------------- | --------------------------------------------------------------- | --------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| `mv_lesson_openapi_1_2_3`                     | schema doc, migration baseline, Hasura, Drizzle; `WITH NO DATA` | legacy synthetic lesson view, quizzes, assets, videos, guidance, TPC, supervision | do omitted state predicates or joins alter cardinality/meaning? |
| `mv_openapi_downloads_1_0_0`                  | schema doc, baseline, Hasura, Drizzle; `WITH NO DATA`           | tables for lessons/assets/videos and rendition JSON                               | can fields combine different video revisions?                   |
| `mv_openapi_unit_curriculum_content_1_0_2`    | schema doc only                                                 | unit curriculum JSON                                                              | proposal, residue or environment drift?                         |
| `mv_threads_1` and `mv_threads_2`             | both tracked/introspected; v2 current doc                       | thread/unit/programme participation                                               | which consumers still require v1 and what does count mean?      |
| `mv_lesson_restriction_levels_1`              | migration/doc/Hasura/Drizzle/Zod/contract test                  | max restriction across lesson and TPC                                             | deliberate conservative cross-state maximum or leakage?         |
| `view_curriculum_sequence_b_aggregate_1`      | view over OWA sequence MV                                       | inherited snapshot/MV freshness                                                   | are counts placements or distinct entities?                     |
| `view_lesson_open_api_with_transcripts_1`     | view over two independently refreshed MVs                       | lesson OpenAPI plus lesson-content v9                                             | can a row combine different source snapshots?                   |
| `view_lesson_openapi_search_result_1`         | zero-row structural view                                        | return type for set-returning function                                            | why is transport typing encoded as a database object?           |
| `function__table__mv_lesson_openapi_search_1` | tracked Hasura function                                         | fuzzy title similarity, optional filters, top 20                                  | what relevance threshold/order promise is valid?                |

All three ordinary Open API views carry `--skip-validation` because the current
validator forbids a view depending on an MV
(rule).

**Inferred:** Necessary read-model composition exists outside the declared valid
architecture. The exception is not isolated technical debt; it reveals a mismatch
between the projection model and an invariant the validator tries to preserve.

### Lesson projection anomalies

The lesson MV combines broad curriculum and asset state
(definition).
Its source `view_synthetic_unitvariant_lessons_3` remains in the squashed baseline
and Drizzle but has no current schema-doc file.

**Observed:** The sign-language join names `sign_language_videos` but both join
predicates reference the preceding `videos` alias
(join).

**Inferred:** Depending on IDs and planner behaviour, the join can contribute no
matching sign-language row or expand cardinality. A fixture with matching and
non-matching primary/sign-language IDs is the decisive test; source inspection
alone does not establish a production symptom.

### Download and transcript projection anomalies

**Observed:** Downloads selects playback from a published video alias but static
renditions from all revisions by `video_id`
(downloads).

**Proposition:** A download record can combine fields from different revisions.
Same-ID multi-state fixtures would confirm or invalidate it.

**Observed:** The transcript view joins lesson OpenAPI v1.2.3 to independently
refreshed lesson-content v9. Its unquoted `downloadsAvailable` alias is folded by
PostgreSQL; introspected Drizzle exposes `downloadsavailable`
(view,
Drizzle).

**Inferred:** Casing and snapshot correspondence are implicit consumer contracts,
not presentation details.

## Authorization and audit authority

**Observed:** Hasura permissions are generated from schema-wide role templates
and generally apply broad CRUD with empty row filters
(rules,
application).
They distinguish schemas/roles more than semantic capabilities or resource state.

**Observed:** Mutation authentication validates human email, but the database
connection forwards service identity/current PostgreSQL role rather than that
principal
(authentication,
connection).

Audit covers selected public tables, records proposed `NEW` values in a `BEFORE`
trigger before later normalization, omits internal release/review/archive work,
and is itself mutable by broad editor permissions.

**Inferred:** This supports operational traceability but not tamper-evident
provenance, human attribution or command-level accountability.

## Assurance gaps

**Observed:** One new lesson-content contract test catches/logs validation failure
instead of failing, while its published counterpart throws
(new contract,
published contract).
Base lesson validation samples the first 100 rows per state
(sample).

Among the public-API projections, lesson restriction levels is the only one with
a hand-written Zod schema and database-wide contract test
(schema,
test).

**Inferred:** Current tests establish selected examples, not continuous
equivalence among database, metadata, generated TypeScript and consumer contracts.

## Concepts worth preserving

- a rich curriculum graph including placements, variants, taxonomy, media and
  rights;
- explicit publication/release intent and multiple content states;
- denormalized read models shaped for consumer information needs;
- database-level bulk transformation where set-based semantics are valuable;
- independently consumable runtime/type contracts;
- versioned coexistence of read models during migration; and
- rights/restriction concepts close enough to data to be consistently projected.

## Stronger basis to investigate

1. Stable entity identity, immutable revision identity, public occurrence and
   explicit release are separate first-class concepts.
2. Lifecycle changes are authorised commands/transitions, never magic state
   values interpreted differently by caller.
3. Relational integrity lives in database constraints where every writer must
   preserve it; JSON is reserved for genuine value objects and immutable payloads.
4. Each concern has one competent semantic authority. Structural types are
   generated; semantic types are deliberately authored; executable mappings
   prove correspondence.
5. Projections form an explicit DAG driven by durable change/outbox events, with
   source release IDs, watermarks, idempotency, per-node failure and atomic
   consumer cutover.
6. Consumer contracts version semantic meaning rather than MV implementation
   ancestry.
7. Authorization is capability-oriented and audit preserves principal,
   authority, command, writes, projection and repair immutably.
8. Deployed, proposed, deprecated and retired schema artefacts have explicit
   status instead of sharing an undifferentiated definition library.

These are propositions for synthesis, not a selected storage technology or a
requirement that OCE expose its database.

## Decisive experiments

| Question                                                                | Experiment                                                                                                                     | Falsifying or discriminating result                                                                                                   |
| ----------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Are all committed representations derivable from the migration result?  | build a blank database only from migrations; introspect catalogues/dependencies/indexes and compare docs, metadata and Drizzle | exact classified equality would weaken the authority-lattice concern; explicit status differences would refine it                     |
| Do mutation channels preserve the same invariants?                      | run the same lesson operation through Hasura editor, mutation API and direct SQL                                               | equal acceptance, final state, cascades, snapshots and audit would invalidate caller-dependent semantic divergence for that operation |
| Does the sign-language join alter cardinality?                          | vary primary and sign-language video IDs and compare source/MV row counts                                                      | stable intended one-row results invalidate the cardinality proposition                                                                |
| Do state-omitting joins mix revisions?                                  | introduce legitimate same-ID rows across video, TPC, programme-dimension and restriction states                                | deterministic intended selection invalidates each local mixing proposition                                                            |
| Is `static_lesson_list` self-healing?                                   | corrupt one list, publish/re-publish related content, then compare normalized placement and served sequence                    | automatic detected repair weakens the hidden-snapshot-risk claim                                                                      |
| Is the dormant Open API MV deployed anywhere?                           | query each environment with `to_regclass` and record provenance/population/indexes                                             | consistent absence classifies it as non-deployed source residue; presence establishes environment drift                               |
| Does audit represent durable final truth?                               | mutate values which triggers normalise and compare audit proposal with final rows and caller identity                          | exact final values plus immutable human attribution would invalidate the traceability-only reading                                    |
| Can every Open API projection be bootstrapped and refreshed coherently? | start blank, populate/refresh in declared path, force one node failure and inspect watermarks/consumer results                 | atomic source-release-consistent cutover would weaken the fragmented-clock model                                                      |

## Unresolved external evidence

- live database constraints, object populations, indexes, statistics and
  dependency catalogue per environment;
- current Hasura metadata application and role/ingress composition;
- entity, revision, cohort and release semantics owned by curriculum experts;
- publication approval and repair work outside this repository;
- real cardinalities, state overlaps and data-quality incidents;
- projection duration, lag, failure and consumer freshness requirements; and
- which historical/proposed schema-doc objects are intentionally retained.
