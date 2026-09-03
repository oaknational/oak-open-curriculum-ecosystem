# Oak reusable curriculum architecture — issues in this repository

**Date:** 14 July 2026; updated 15 July 2026 with search-exploration issues
REPO-014 through REPO-017

**Status:** Canonical issue register for this repository; architectural diagnosis,
not an implementation plan

**Report family:** [index and reading order](./README.md)

**Companion reports:** [strategic synthesis](./oak-reusable-curriculum-architecture.md)
and [current Oak data-estate issues](./oak-reusable-curriculum-architecture-current-data-estate.md)

## Executive conclusion

This repository can make substantial progress without waiting for a future
source-system redesign, a changed ontology or a new upstream bulk format. Its
immediate job is to become an honest, loss-aware compiler of the data it
actually receives.

The highest-priority corrections are:

1. stop publishing thread adjacency as prerequisite fact;
2. stop presenting associated National Curriculum statements as proof of
   complete coverage or curriculum gaps;
3. stop publishing variant-unqualified lesson associations as exact
   containment;
4. make the consumer schema genuinely derive from, and validate, the received
   schema-and-data bundle;
5. make bulk acquisition atomic and provenance-bearing;
6. replace the duplicate extraction paths with one source-complete typed
   intermediate representation;
7. make graph and non-graph projections truthful, complete inside declared
   bounds, and navigable when they intentionally return windows or pages;
8. replace aggregated MCP search with a measured curriculum-exploration
   protocol over occurrence, relationship and passage projections;
9. make search compilation source-portable so bulk bundles and specialised
   materialised views can feed the same conserved model without losing their
   distinct capabilities;
10. evaluate separate retrieval policies for agents and the primary website
    rather than treating the current equal-weight RRF as a universal ranker.

The repository is not limited to the graphs it currently emits. The bulk data
contains many more usable signals, and this repository can construct any
projection supported by them. The constraint is epistemic, not computational:
it must distinguish what the snapshot says from what has been lost upstream or
would require curriculum judgement.

The long-standing programme-to-variant complexity is the clearest example. This
repository should retain every source factor, occurrence and order signal that
it receives, but should not infer a canonical programme-to-variant relation
from a flattened payload. That structural question belongs at the authoritative
source-data boundary, whether resolved through existing governance or a future
source redesign. Until an authoritative release-qualified relation is
published, exact programme-variant graphs remain unavailable; aggregate or
retained-surface projections must say what they are.

## Authority and scope

This report is the detailed authority within this report family for defects,
obligations and acceptance conditions inside this repository. The companion
data-estate report owns the detailed producer and database issue register. The
synthesis owns the overall architectural decision. Ratified schemas,
executable contracts and ADRs retain authority in their own domains. A
same-scope conflict among the reports is a documentation defect, not permission
to select the most convenient conclusion.

The scope includes:

- bulk download acquisition and validation;
- generated bulk schemas and types;
- extraction and typed intermediate representations;
- graph-corpus construction;
- graph and non-graph SDK projections;
- Elasticsearch mappings, projection builders, retrieval policies and
  lifecycle contracts;
- MCP descriptions, exploration operations and serving contracts;
- reusable search composition for bulk and materialised-view sources;
- local tests, provenance and integrity evidence.

The current Oak Curriculum Ontology is a fixed external input for this work. No
ontology change is proposed. No non-public implementation source is used or
described. The motivating requirements are represented only by de-identified,
source-neutral concepts in the synthesis; this report contains no quotation,
identity, local path, private repository detail or private implementation fact.

## Problem frame

The local problem is not “how do we add more graph types?” It is:

> How can this repository compile a rich but imperfect bulk publication into
> truthful, complete and useful deterministic views without claiming authority
> for information the publication does not contain?

Three layers need to be kept separate:

1. **Acquired source snapshot** — the files, schema and manifest received from
   the producer, including contradictions and missing provenance.
2. **Loss-aware typed representation** — everything this repository can parse
   and preserve, with occurrence and conflict information intact.
3. **Question-led projections** — graphs, ordered projections, ranked lookups,
   tables or reports selected for a user question.

The current implementation crosses these boundaries too early. It hand-authors
a partial schema, runs two similar extraction orchestrators, discovers some
entities only through selected relationships, collapses repeated source
contexts, and gives several outputs stronger graph or curriculum names than
their construction warrants.

## Concept exploration

### Expand the options

The available choices are broader than “keep the current graph” or “wait for a
perfect upstream source”:

1. patch individual graph edges while leaving the pipeline unchanged;
2. build more graphs directly from the current ad hoc extractors;
3. pause all local work until the data estate publishes a new contract;
4. first build one loss-aware local compilation boundary, then derive the
   simplest truthful projection for each question;
5. absorb the upstream API application into this workspace and treat shared
   source code as the contract.

The fourth option is the durable local architecture. The first two preserve
hidden loss, the third prevents warranted improvements, and the fifth changes
repository topology without itself fixing semantic authority or release
provenance.

### Connect the recurring failures

The apparently separate defects share one cause: information is collapsed
before a consumer question has established that the distinction is irrelevant.

- thread membership becomes prerequisite order;
- a bare unit-slug association becomes exact containment;
- repeated metadata becomes first-seen metadata;
- contextual keyword definitions become one global definition;
- a retrieval time becomes source version;
- a ranked top-N lookup is called a graph;
- an ordered or hierarchical projection is called a subgraph;
- a partial schema template is described as source-generated.

The corrective rule is therefore general: preserve first, qualify second,
project last.

### Stress-test the candidate architecture

A sound local boundary must survive:

- the same unit slug occurring in several programme contexts;
- lesson membership varying by exam board, tier, pathway or child subject;
- contextual definitions differing for the same normalised term;
- source schema and payload disagreeing in the same download;
- repeated records containing conflicting metadata;
- a requested graph exceeding safe response bounds;
- an authoritative upstream redesign remaining unavailable to local product
  needs;
- a later bulk version introducing authoritative IDs and placements.

One loss-aware intermediate representation can survive these cases if it stores
source occurrences and conflicts rather than forcing premature identity. The
current corpus cannot reliably do so because several of those distinctions are
discarded during extraction or generation.

### Distil the local architecture

```text
immutable downloaded bundle
  -> bundle validation and evidence report
  -> source-complete, loss-aware typed snapshot
  -> question-specific deterministic projection
       -> bounded graph when traversal matters
       -> ordered projection when sequence matters
       -> page or lookup when ranking matters
       -> typed refusal when required authority is absent
```

The intermediate snapshot is not a new source of truth. It is a deterministic
record of what this repository received and how it interpreted the transport
shape.

## Issue disposition and ownership

The register separates confirmed local corrections from facts that only an
authoritative producer can supply. “Partial” means some relevant behaviour is
already correct; it does not mean the remaining defect is optional.

| Issue | Disposition | Ownership boundary |
| --- | --- | --- |
| REPO-001 | Local correction | Remove false dependency edges locally; only authoritative evidence can introduce real prerequisite edges |
| REPO-002 | Split | Qualify or withdraw local containment; exact release-qualified placement is producer-owned |
| REPO-003 | Split | Local generation must be schema-traceable and fail safely; bundle coherence is producer-owned |
| REPO-004 | Split | Atomic acquisition and local bundle identity are local; producer release identity is producer-owned |
| REPO-005 | Local correction | Shared extractors exist; align the duplicated orchestration and make intentionally different views explicit |
| REPO-006 | Local correction | Source accounting belongs in the compilation boundary, not in every graph |
| REPO-007 | Two local corrections | Entity/metadata conflicts and contextual keyword definitions are separate loss mechanisms |
| REPO-008 | Partial local correction | Thread progression is already honestly named; remaining graph-labelled projections need correction |
| REPO-009 | Partial local correction | Internal edge closure and MCP integer validation exist; other bounds and continuation gaps remain |
| REPO-010 | Local correction | Correct semantic copy independently of projection naming |
| REPO-011 | Split | Full local integrity and bundle identity are local; producer release identity is producer-owned |
| REPO-012 | Split | Correct the local node-list and coverage claims; exhaustive framework completeness needs an authoritative contract |
| REPO-013 | REPO-004 acceptance slice | Reconcile requested and returned files locally; eligibility and exclusions are producer-owned |

## Prioritised issue register

### REPO-001 — False prerequisite semantics

**Priority:** P0

The graph generator orders units in a thread by year and uses a deterministic
slug tie-break within the same year, then emits consecutive pairs as
`prerequisiteFor`. The tie-break is explicitly not a curricular ordering rule.
Thread participation and broad progression are useful source-derived signals;
neither establishes prerequisite dependency.

**Required correction:** remove `prerequisiteFor` from this derivation. The
honestly named `get-thread-progressions` projection already supplies a
year-ordered view; retain it and make clear that same-year slug ordering is
deterministic presentation, not curriculum order. Preserve authored textual
prior-knowledge requirements as text occurrences, not resolved unit-to-unit
edges.

The correction must cover the full semantic slice: corpus edge kind, generated
types, SDK operations, MCP descriptions, prompts, tests, ADRs and examples.
Renaming only the edge leaves the same overclaim elsewhere.

**Acceptance condition:** no public operation can imply that adjacency or
thread membership proves dependency. A prerequisite relation can return only
if it is source-authored or explicitly candidate/reviewed with evidence.

**Falsifier:** authoritative source evidence demonstrates that the specific
within-thread order is intentionally authored as prerequisite dependency. No
such evidence is present in the current bulk contract.

### REPO-002 — Variant-unqualified associations presented as exact containment

**Priority:** P0

Current `containsLesson` edges are generated from top-level lesson records
keyed by unit slug. That surface can aggregate across variants unless each
affected record is independently fingerprinted, and the edge retains no
programme or variant qualifier. It therefore cannot support the claim “this
exact unit variant contains this lesson”.

**Required correction:** withdraw or rename the relation to an explicitly
aggregate meaning such as `reportedUnderUnitSlug`. Do not use it for programme
or variant membership. Retain separately the ordered `sequence[].unitLessons`
surface and label it as the membership of the one flattened unit record that
was retained, not as truth for every variant.

**Acceptance condition:** each unit-lesson projection states whether it is
aggregate, retained-sequence or exact variant placement. Exact placement is a
typed refusal until a release-qualified authoritative relation exists.

**Dependency:** the authoritative source-domain owner must publish the exact
programme/unit/variant/lesson placement contract before this repository can
serve exact programme-variant graphs.

**Falsifier:** an authoritative field already present in every downloaded row
uniquely identifies the programme, unit variant and placement and reconciles
both structural surfaces. The current snapshot does not contain such a field.

### REPO-003 — Bulk schema “code generation” is hand-authored and incomplete

**Priority:** P0

[`generate-bulk-schemas.ts`](../../../packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/generate-bulk-schemas.ts)
concatenates TypeScript templates. It does not read the downloaded JSON Schema.
The templates omit or reshape fields present in the checked-in schema, while
the downloaded data and schema themselves also disagree. This creates three
uncontrolled contracts: payload, producer schema and consumer templates.

**Required correction:** treat a validated schema-and-data release bundle as
the generation input. Generate Zod schemas and TypeScript types from that
schema, with small explicit adapters only for deliberately normalised transport
quirks. Test schema parity and parse every bundle file during generation.

The checked-in generated bulk types are verification outputs, not change
authorities. Corrections belong in `generate-bulk-schemas.ts` and the
`schema-templates*.ts` inputs until a schema-driven replacement removes those
templates.

Until the producer publishes a coherent bundle, local validation should expose
the disagreement and prevent authoritative regeneration; it should not silently
choose whichever surface is easiest to type.

**Acceptance condition:** generated consumer types are reproducibly traceable
to a schema hash, and every input payload validates against that exact schema or
is rejected with a complete evidence report.

**Falsifier:** an automated comparison demonstrates that another checked-in
contract is authoritative and the templates match it exactly. The present files
do not demonstrate that.

### REPO-004 — Bulk acquisition is mutable and provenance-poor

**Priority:** P0

[`download-bulk.ts`](../../../apps/oak-search-cli/scripts/download-bulk.ts)
extracts a new ZIP into the existing destination and writes its own
`downloadedAt` timestamp. It does not stage and atomically replace the bundle,
remove stale subject files, record file hashes, retain response/object metadata,
or distinguish retrieval time from source generation and release identity.

That behaviour can produce a mixed local snapshot and currently turns a local
clock value into `sourceVersion` for the generated corpus.

**Required correction:** download to a staging directory, validate the whole
bundle, calculate hashes, record retrieval metadata separately from producer
metadata, then atomically promote it. Reject partial, stale or schema-mismatched
bundles.

**Acceptance condition:** a corpus identifies the immutable bundle and exact
files from which it was compiled. A failed download cannot alter the active
bundle.

**Dependency:** richer release and producer provenance must ultimately be
supplied by the upstream bundle; local hashes can prove local identity but
cannot invent source release identity.

### REPO-005 — Duplicate extraction orchestration exposes divergent contracts

**Priority:** P1

The public bulk processor and the vocabulary-generation processor duplicate
orchestration while calling shared extractor implementations. Only the latter
adds lessons to `GraphCorpusInput`. The defect is therefore contract and
orchestration drift, not duplicate extractor logic.

**Required correction:** define one source-accounting compilation boundary.
Make command-line, generation and public package entry points derive explicitly
named views from it. Entry points need not expose identical results, but every
intentional omission must be expressed by their contract rather than by
duplicated orchestration.

**Acceptance condition:** one end-to-end test exercises the public package
entry point from validated bundle to corpus or projection, and no parallel
orchestrator can omit a required source domain unnoticed.

**Falsifier:** the two paths have distinct, documented consumers and contracts
that make their differing fields intentional. Their current naming and
near-identical structure do not establish that.

### REPO-006 — No source-accounting compilation boundary before projections

**Priority:** P1

The current graph corpus is relationship-discovered and projection-specific.
That is not a defect merely because a projection need not contain the whole
source bundle. The defect is that no prior compilation boundary accounts for
the source records and distinctions that each projection selects or omits. The
current path does not enumerate every unit from the bulk source, drops
contextual and placement fields during extraction, and covers only the signal
families wired into the five current graph domains. Its 40,016 nodes and 74,724
edges describe one implementation selection, not the limits of the bulk source.

**Required correction:** build one source-complete typed snapshot before graph
generation. Preserve at least:

- source occurrences and restriction/missingness information;
- lessons, units and every retained placement/order surface;
- KLPs, outcomes, misconceptions and responses;
- teacher tips, content guidance and transcripts;
- contextual keyword definitions;
- prior-knowledge text and National Curriculum statement occurrences;
- thread membership without upgrading it to dependency;
- every source-native variant factor and conflict.

Source-complete means complete relative to the declared bundle, not complete
relative to the underlying database. The representation manifest must state
which upstream distinctions are absent or ambiguous.

**Acceptance condition:** the compiler manifest emits counts by source domain,
represented and omitted dimensions, source-schema hash, file hashes and
integrity results. Every source record is represented or accounted for at that
boundary. Individual projections remain intentionally scoped; a graph is
complete when it includes all qualifying nodes and internal edges inside its
declared structural bound, not when it copies the whole bundle.

### REPO-007 — Silent conflict resolution changes source meaning

**Priority:** P1

Two independent collapse mechanisms are present:

1. unit identity is keyed largely by bare slug and repeated metadata can be
   resolved by deterministic first occurrence;
2. keyword normalisation selects one definition even though many normalised
   terms have multiple contextual definitions in the snapshot.

**Required correction:** distinguish content identity from occurrence and
placement identity, and fail generation or emit a typed conflict record when
repeated source keys disagree on supposedly invariant metadata. Separately,
preserve every contextual keyword definition and its occurrences rather than
selecting a global winner.

**Acceptance condition:** no first-seen rule can silently select title,
definition, factors or placement metadata that differ across occurrences.

### REPO-008 — Remaining graph terminology overstates projections

**Priority:** P1

Internal modules already use honest names such as
`thread-progressions-projection`, `misconception-projection` and
`keyword-projection`, and the public `get-thread-progressions` operation is
already correctly named. The remaining public `get-misconception-graph` and
`get-keyword-graph` names and descriptions present a fixed hierarchy and a
ranked top-N lookup as graphs. The prior-knowledge surface is structurally
graph-shaped, but its dependency semantics remain invalid until REPO-001 is
corrected.

**Required correction:** correct the remaining public operation names, titles
and descriptions for the structure they return. Retain a graph only where
relationships and traversal are material. Version renames explicitly rather
than quietly changing an existing contract. Programme placement semantics are
owned by REPO-002 rather than this naming issue.

**Acceptance condition:** operation names, schemas and descriptions tell a
consumer whether the result is a complete subgraph, bounded structural window,
hierarchy, ordered sequence or ranked page.

### REPO-009 — Graph bounds are incomplete and inconsistently enforced

**Priority:** P1

Public root arrays remain unbounded. Core traversal accepts fractional and
`NaN` depth values and does not validate every `maxDepth` invariant, although
the MCP input schema already enforces integer depths. `createGraphView` already
returns every internal edge among members inside its structural bound, so edge
closure there is not an open defect. Keyword results report totals and
`hasMore`, but each keyword's ten-lesson decoration has no operation anchored
by the returned keyword ID to enumerate the remainder.

**Required correction:** define maximum unique-root counts per view, require
finite non-negative integer depth in the core as well as at the MCP boundary,
and validate every `maxDepth` invariant. Preserve the existing internal-edge
closure guarantee. Give each deliberate window or page totals, continuation
and a usable follow-on anchor.

**Acceptance condition:** oversize requests receive a typed refusal; unknown
anchors are explicit; no result is silently truncated while claiming graph
completeness.

### REPO-010 — Some user-facing semantics overclaim the implementation

**Priority:** P1

Tool descriptions and prompts currently ask questions such as how
misconceptions develop “along” a thread even when the projection slices an
ID-sorted unit set rather than curricular order. A technically correct SDK
paired with an inaccurate MCP description is still an incorrect system.

**Required correction:** audit generator terminology, generated schemas, SDK
names, MCP descriptions, prompt guidance, examples and ADRs as one semantic
surface. For thread-anchored windows, either use the explicitly qualified
year-ordered sequence while preserving same-year units as unordered, or remove
developmental wording. This semantic-copy defect is independent of REPO-008's
structural naming defect.

**Acceptance condition:** every user-facing claim is warranted by the exact
projection algorithm and source authority.

### REPO-011 — Corpus provenance and runtime integrity are too weak

**Priority:** P2

Unchecked generated JSON is first treated as `JsonGraphCorpus`, then partial
guards validate node kinds, ID prefixes, edge literals and sequence prefixes.
They do not fully validate fields, uniqueness, edge-endpoint closure, statistics
reconciliation or a content hash. The corpus also lacks a machine-readable
coverage declaration, schema hash and full local bundle identity.

**Required correction:** emit a corpus contract containing bundle hash, schema
hash, file hashes, transform version, represented/omitted dimensions and
integrity totals. Validate the complete generated shape at build time and
verify its hash or schema at load time. Echo source/corpus version and declared
scope in projection responses where needed for interpretation.

Local integrity and bundle identity are fixable here. Producer release identity
remains an upstream contract and must not be inferred from retrieval metadata;
that acquisition concern is owned by REPO-004.

**Acceptance condition:** a consumer can identify exactly what corpus it is
querying and what that corpus does not claim to represent.

### REPO-012 — National Curriculum associations are presented as complete coverage

**Priority:** P0 user-facing semantic risk

The curriculum-mapping prompt tells an agent to confirm National Curriculum
coverage is complete, surface gaps and diagnose coverage imbalance from the
statements associated with units. The NC dataset generator likewise describes
its output as a coverage graph for gap analysis. The source only supplies
authored statement occurrences associated with units; there is no declared
universe, exhaustiveness rule or completeness model that proves the absence of
an association is a curriculum gap.

This can directly induce an incorrect curriculum-planning recommendation. The
generated “coverage graph” is also a node list rather than a graph. These are
two defects: a useful association is given stronger authority than its source
warrants, and its structure is misnamed.

**Required correction:** change `nc-coverage-generator.ts` so generated dataset
names and descriptions describe reported or authored statement associations;
do not edit generated outputs directly. Rewrite the prompt to report the
associations Oak supplies and to state that completeness or gap claims require
an explicit framework version, expected-statement universe, aggregation rule
and evidence of exhaustive mapping. Describe the output as a node list unless
relationships are actually added.

**Acceptance condition:** no prompt, tool or dataset tells a consumer that the
current associations prove complete statutory coverage or identify gaps.

**Falsifier:** a versioned, exhaustive National Curriculum mapping contract is
shown to govern the dataset and every expected statement is represented with a
declared completeness rule.

### REPO-013 — Acquisition does not reconcile requested and returned files

**Priority:** P2 revalidation candidate

This is a concrete acceptance slice of REPO-004 rather than an independent
architectural workstream.

The current downloader requests 32 subject-and-phase keys, including two
RSHE/PSHE keys. The analysed manifest contains 30 subject data files and no
RSHE/PSHE files. That does not by itself prove a current producer omission: the
snapshot may predate the current request list or the producer may have explicit
eligibility rules. It does prove that the downloader treats any returned JSON
count as success and does not reconcile the response with the requested set.

**Required correction:** validate the returned file set against the request and
a versioned eligibility/exclusion contract. Fail on an unexplained omission or
extra file; record explicit exclusions in the manifest.

**Acceptance condition:** every requested subject-phase key is either present
and hashed or absent for a named, validated reason.

**Falsifier:** the bundle protocol already returns and the downloader already
validates a complete machine-readable eligibility result equivalent to this
contract. The current script does not.

### REPO-014 — MCP “exploration” is aggregated search, not structural exploration

**Evidence:** `explore-topic` runs small parallel searches over lessons, units
and threads, merges their first results and reports totals. It does not orient
an agent to the source capabilities, return contextual aggregations, follow an
explicit relationship, compare contexts or explain a path with provenance.

**Risk:** consuming agents can find plausible items but must improvise their own
navigation through repeated tool calls. Near-duplicate results consume context,
and a ranked list can be mistaken for a curriculum map.

**Required correction:** define a compact exploration protocol over SDK-owned
operations: orient, search, summarise, expand, compare, explain and fetch. Each
operation must be bounded, schema-derived where the OpenAPI contract applies,
progressively disclose detail and preserve source and epistemic evidence.

**Acceptance condition:** known-answer agent journeys demonstrate that the
protocol answers or refuses orientation, retrieval, relationship expansion,
comparison and explanation questions with fewer redundant results and without
increasing unsupported semantic claims. Evidence must include tool-call count,
response tokens, latency, completeness and provenance use.

**Falsifier:** independent journey evaluation shows that the current aggregate
search plus existing graph tools achieves the same correctness, evidence
quality and interaction cost.

### REPO-015 — Search compilation is not yet portable across source contracts

**Evidence:** ADR-140 correctly moves Oak-specific ingestion runtime out of the
search CLI into a reusable ingestion SDK, but its current boundary begins with
bulk acquisition and API supplementation. It does not define a source adapter
that can accept a specialised materialised-view contract, converge equivalent
records on one source-accounting representation, and retain richer
source-specific capabilities.

**Risk:** extracting the current pipeline unchanged would make bulk JSON the
permanent internal domain contract. A website-oriented materialised view would
then require a second search pipeline or would be reduced to the same losses as
bulk, recreating divergent document production and ranking behaviour.

**Required correction:** make the source-accounting representation the
portability seam. Define explicit adapters for bulk, permitted API supplements
and public materialised-view contracts. Each adapter must provide source and
release identity, validate its complete input, declare capabilities and retain
signals that are not shared by every adapter.

**Acceptance condition:** representative bulk and materialised-view fixtures
produce equivalent canonical entities and relationships where their semantics
match; capability differences remain explicit and testable; both feed the same
projection builders without importing CLI or API-application internals.

**Falsifier:** the source contracts are proven semantically identical and
equally expressive, making an adapter boundary unnecessary. Format similarity
alone does not satisfy this falsifier.

### REPO-016 — Current search projections erase structural exploration grain

**Evidence:** current indexes primarily represent entity or rollup documents.
Search can filter structural fields, but there is no general occurrence or
placement index and no explicit relationship-document index through which an
agent can inspect context-qualified curriculum structure. Dedicated facet
documents enumerate options but do not provide contextual distributions over a
matched set.

**Risk:** entity deduplication can erase placement, programme, variant, order or
release context. Search then retrieves semantically relevant entities without
being able to explain where they occur, how they relate or whether a relation
is source-authored, deterministic or heuristic.

**Required correction:** evaluate a coherent projection family generated from
the source-accounting representation: entity, occurrence or placement,
relationship, passage and analytical-rollup indexes. Promote and validate the
family atomically, with a representation and omission manifest.

**Acceptance condition:** the selected projection family answers the named
known-answer questions at the required grain; every relationship exposes type,
context, provenance, release and epistemic class; every projection declares its
source coverage and omissions. An index that does not improve a measured
question is not added.

**Falsifier:** the current entity documents can answer the same contextual and
relationship questions completely, efficiently and without reconstructing
lost occurrence information.

### REPO-017 — Retrieval policy is treated as a fixed implementation rather than an evaluated product contract

**Evidence:** lesson and unit search use fixed equal-weight four-way RRF over
lexical and ELSER content and structural retrieval. Thread and sequence search
use two-way hybrid retrieval. The repository has not established that those
weights, candidate windows and post-processing are optimal for agent
exploration, or that the same policy should serve website search.

**Risk:** additional Elastic capabilities may be adopted because they are
available rather than because they improve user outcomes. Conversely, valuable
weighted fusion, normalised linear fusion, reranking, diversification,
highlighting, contextual aggregation and editorial query rules may remain
unused. One policy can also conceal a real divergence between an agent's need
for breadth and provenance and a website user's need for rapid intent
resolution.

**Required correction:** make retrieval policy an explicit, consumer-named SDK
composition over shared primitives. Establish independent known-answer and
real-world value evidence for agent and website policies before changing fusion
or adding Elasticsearch mechanisms.

**Acceptance condition:** each policy declares its consumer, questions,
filters, candidate and ranking stages, result-shaping contract, evaluation set,
latency and cost envelope. Changes land only when independent evidence improves
the named outcome without degrading semantic honesty or source traceability.

**Falsifier:** independent evaluation demonstrates that one shared policy meets
both consumers' acceptance criteria and remains explainable. This would remove
the need for separate policy composition, not the need for evaluation.

## What this repository can improve now

These changes do not depend on resolving programme-to-variant semantics in the
database:

- retire the false prerequisite relation;
- qualify or retire `containsLesson`;
- preserve every received occurrence and contextual definition;
- unify extraction into one typed intermediate representation;
- make downloader staging, hashing and promotion atomic;
- expose current schema/data disagreement as a failed contract, not a hidden
  adapter choice;
- harden graph bounds, completeness and typed failures;
- rename list-like outputs at a version boundary;
- add KLP, outcome, misconception, tip, guidance, transcript, prior-knowledge,
  thread and statement projections supported by the current bulk;
- make tool descriptions match algorithms;
- stop deriving complete National Curriculum coverage or gaps from reported
  associations alone;
- validate requested subject coverage against returned files and explicit
  exclusions;
- establish known-answer tests for snapshot-local questions;
- define the source-adapter and conserved curriculum-compilation contract that
  allows bulk and materialised-view inputs without duplicate search pipelines;
- test occurrence, relationship, passage and analytical projections against
  agent exploration questions;
- replace top-results-only MCP exploration with progressive orientation,
  search, aggregation, structural expansion, comparison and explanation;
- evaluate hybrid fusion, semantic reranking, diversification and contextual
  aggregation rather than adopting them by feature availability;
- keep agent and website retrieval policies separate where their measured
  acceptance criteria diverge.

These changes improve truthfulness and utility even if the upstream contract
does not change immediately.

## What this repository must not solve downstream

The following require upstream authority or explicit reviewed semantics:

- canonical programme-to-unit-variant selection;
- exact variant-lesson placement when the bulk omits its identity;
- durable identity and lineage across releases;
- rename, split, merge, replacement and retirement policy;
- question-to-KLP or question-to-outcome alignment when not authored;
- semantic equivalence of KLPs;
- curriculum prerequisite dependency;
- a global definition for a context-dependent term.

For those questions the correct local behaviour is an explicitly qualified
projection, a candidate/reviewed assertion, or a typed refusal. It is not an
inference hidden inside corpus generation.

## Cross-estate interface obligations

Some defects sit at the boundary and therefore have obligations on both sides:

| Boundary issue | This repository owns | Producer/data estate owns |
| --- | --- | --- |
| Schema/data disagreement | Validate the exact bundle and refuse silent drift | Publish one atomic, validated schema-and-data release |
| Release provenance | Preserve and expose received metadata and local hashes | Supply release, generation and producer identity |
| Variant ambiguity | Retain factors; label aggregate relations; do not infer | Publish authoritative release-qualified placements through the source-domain contract |
| Stable identity | Use release-scoped identity honestly | Contract durable IDs, lineage and historical access |
| Quiz questions | Compile and project eligible published records without semantic overreach | Publish structured question and placement data only under verified public eligibility and licensing rules |
| Graph completeness | Declare and enforce consumer bounds | Supply complete records inside the published release contract |
| Materialised-view search input | Own a source adapter, conserved representation and reusable Elastic projections | Publish a stable, release-qualified view contract without requiring consumers to import database internals |
| Agent and website search | Own explicit consumer retrieval policies and evidence | Supply source facts and availability signals; do not prescribe one downstream ranking policy |

The companion [data-estate issue register](./oak-reusable-curriculum-architecture-current-data-estate.md)
describes the producer side in detail.

## Decision lenses

### 1. Long-term architectural excellence

One loss-aware compiler and explicit question-led projections can absorb a
future improved bulk contract without re-encoding today's flattening as a
permanent domain model. This is decisive.

### 2. Strict and complete

False prerequisite, unqualified containment, silent first-seen selection,
mutable downloads and unbounded or truncated graph results all fail this lens.
The repository must refuse claims it cannot construct completely.

### 3. Simpler without compromising quality

Unifying extraction at one conserved representation and deriving explicit
search and graph projections is simpler than maintaining partial graph, bulk
search and materialised-view search pipelines. It also removes semantic
ambiguity rather than hiding it.

### 4. Change the system to dissolve the problem

Exact programme-to-variant semantics should be fixed at the authoritative
source-data boundary, not reconstructed from slug collisions here. The local
system should be changed so it no longer requires that reconstruction to make
useful progress.

### 5. User value

Teachers and curriculum teams benefit from trustworthy contextual knowledge,
misconception, vocabulary, assessment and comparison views. They do not benefit
from a richer-looking graph that silently merges variants or invents
prerequisites.

## Recommended implementation sequence

This is an evidence order, not a committed delivery plan:

1. remove or qualify the false prerequisite, containment and curriculum-
   coverage claims;
2. fingerprint the current bundle's schema disagreement, cardinalities,
   duplicates and factor coverage;
3. make acquisition immutable and provenance-bearing;
4. generate the consumer contract from the validated source schema;
5. unify extraction into one loss-aware intermediate representation;
6. preserve conflicts, occurrences and contextual definitions;
7. regenerate projections and publish a representation/omission manifest;
8. harden graph roots, depth, completeness and navigation;
9. rename/version projection surfaces and align descriptions;
10. establish agent and website search journeys and independent relevance
    evidence;
11. probe occurrence, relationship, passage and analytical Elastic projections;
12. define source adapters and extract consumer-named retrieval policies;
13. add known-answer end-to-end tests across SDK, MCP and selected website
    service boundaries.

The first item can proceed before the others because removing a false claim
does not depend on a new upstream shape. The exact variant-placement projection
should remain blocked until its required authoritative fields exist.

## Completion criteria

This repository's part is complete when:

- no source-derived relation claims more authority than its input supports;
- one compiler accounts for every record in a pinned immutable bundle;
- generated types are traceable to the exact validated source schema;
- conflicts and omissions are machine-visible;
- all graph views are complete inside explicit structural bounds;
- ordered, hierarchical and ranked views are named and navigated honestly;
- release and transform provenance are exposed without conflating retrieval
  time with source version;
- exact programme-variant questions fail clearly until the authoritative
  relation is published;
- known-answer tests cover the user questions the repository actually serves;
- bulk and materialised-view inputs converge on one conserved curriculum
  contract without discarding source-specific capabilities;
- MCP exploration supports bounded orientation, search, summarisation,
  relationship expansion, comparison, explanation and detail retrieval;
- Elastic projection and retrieval choices are justified by independent agent
  or website value evidence rather than feature availability;
- agent and website policies share facts and primitives without being forced to
  share one ranking contract.

## Primary local evidence

- [Decision principles](../../../.agent/directives/principles.md)
- [Graph doctrine](../../../.agent/skills/working-with-graphs/SKILL-CANONICAL.md)
- [Verify data supports shape before building](../../../.agent/rules/verify-data-supports-shape-before-building.md)
- [Bulk schema snapshot](../../../apps/oak-search-cli/bulk-downloads/schema.json)
- [Bulk manifest](../../../apps/oak-search-cli/bulk-downloads/manifest.json)
- [Bulk downloader](../../../apps/oak-search-cli/scripts/download-bulk.ts)
- [Bulk schema generator](../../../packages/sdks/oak-sdk-codegen/code-generation/typegen/bulk/generate-bulk-schemas.ts)
- [Public bulk processor](../../../packages/sdks/oak-sdk-codegen/src/bulk/processing.ts)
- [Graph-corpus types](../../../packages/sdks/oak-sdk-codegen/src/bulk/generators/graph-corpus-types.ts)
- [Graph-corpus node generation](../../../packages/sdks/oak-sdk-codegen/src/bulk/generators/graph-corpus-nodes.ts)
- [Graph-corpus edge generation](../../../packages/sdks/oak-sdk-codegen/src/bulk/generators/graph-corpus-edges.ts)
- [Graph-corpus sequence generation](../../../packages/sdks/oak-sdk-codegen/src/bulk/generators/graph-corpus-sequences.ts)
- [Graph-view core](../../../packages/core/graph-core/src/graph-view/create-graph-view.ts)
- [Keyword view](../../../packages/sdks/graph-corpus-sdk/src/curriculum/keyword-view.ts)
- [Misconception projection](../../../packages/sdks/graph-corpus-sdk/src/curriculum/misconception-projection.ts)
- Prior-knowledge view — `prior-knowledge-view.ts`, deleted by MCP-671 (the synthesised-prerequisite view REPO-001 flags below; the edges remain in the corpus, no view reads them)
- [Curriculum-mapping guidance](../../../packages/sdks/oak-curriculum-sdk/src/mcp/guidance-resources/curriculum-mapping.ts)
- [MCP aggregated exploration](../../../packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/execution.ts)
- [Hybrid RRF query builders](../../../packages/sdks/oak-search-sdk/src/retrieval/rrf-query-builders.ts)
- [ADR-089: index everything](../../../docs/architecture/architectural-decisions/089-index-everything-principle.md)
- [ADR-140: search ingestion SDK boundary](../../../docs/architecture/architectural-decisions/140-search-ingestion-sdk-boundary.md)
- [National Curriculum association dataset generator](../../../packages/sdks/oak-sdk-codegen/src/bulk/generators/nc-coverage-generator.ts)
