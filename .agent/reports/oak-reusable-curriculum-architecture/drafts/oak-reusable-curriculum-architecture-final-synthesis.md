# Oak reusable curriculum architecture — final synthesis

> Historical draft. Superseded by the canonical report in the parent directory.

**Date:** 2026-07-14  
**Status:** Final synthesis of this concept exploration; a strategic recommendation, not a ratified architecture or implementation plan  
**Scope:** Curriculum meaning, authoring, review, assessment, alignment, release management, AI assistance, and deterministic graph serving

## The recommendation

We should test a **governed curriculum evidence architecture**. It should help
curriculum teams and teachers see:

- what a lesson or unit is intended to build;
- what knowledge and vocabulary it depends on;
- how questions check that intended learning;
- which parts are core in this context and which can be adapted safely;
- how content aligns to a framework; and
- what changed between curriculum releases, with the reason and evidence.

This isn't a larger KLP record. It isn't an ontology-first rewrite. It isn't a
requirement to break all curriculum content into atomic facts. It's a set of
shared rules for preserving authored curriculum, identifying reusable meaning
where that is useful, recording each contextual use, governing reviewed
relationships, and publishing immutable releases.

The evidence supports six strategic moves:

1. **Keep authored curriculum artefacts intact.** KLPs, prior-knowledge
   requirements, pupil outcomes, questions, misconceptions, content
   descriptors and takeaways have different purposes. Do not collapse them
   into one generic class.
2. **Introduce reusable semantic identity only where subject experts can
   identify it consistently.** A smaller reusable meaning is a candidate layer,
   not a mandatory decomposition of every KLP.
3. **Separate a meaning from each place it is used.** Placement, expected depth,
   pedagogical role, source wording and release belong to the contextual use,
   not permanently to the reusable meaning.
4. **Treat prerequisite, assessment, alignment and equivalence as reviewed
   relationships.** When a relationship needs evidence, status, provenance or
   release scope, give it first-class identity.
5. **Qualify authority by concern.** The authoring source, ontology, OpenAPI,
   analytical pipelines and this consumer repository have different jobs. No
   repository becomes authoritative for everything.
6. **Correct semantic overclaim before adding more graph data.** The current
   local corpus calls year-ordered thread adjacency `prerequisiteFor`, including
   same-year pairs ordered by an arbitrary identifier. Its own source says that
   order is not curricular. Sequence, thread participation and reviewed
   dependency must be separate in data and product language.

The sixth move is the immediate integrity issue. The other five describe the
candidate architecture to test.

## What this report brings together

This report synthesises:

- the standalone
  [initial concept exploration](./oak-reusable-curriculum-architecture.md);
- the
  [cross-estate reflection](./oak-reusable-curriculum-architecture-cross-estate-reflection.md);
- the original private discussion, handled only through PII-safe abstraction
  and a fixed-vocabulary coverage check;
- the Oak Curriculum Ontology, Atomic Concepts and Oak OpenAPI repositories;
- the generated schema, graph corpus and architecture decisions in this
  repository; and
- Oak's curriculum principles, curriculum-mapping guidance and editorial tone
  guidance.

No quotation, identity, attribution or personal information from the private
source is reproduced here.

The external source snapshots are fixed so that later readers can distinguish
evidence drift from a change in interpretation:

| Source | Snapshot | What it contributes |
| --- | --- | --- |
| [`oak-curriculum-ontology`](https://github.com/oaknational/oak-curriculum-ontology/tree/610ba79a96bbfa5148e4a50360b05c12e79aaf83) | `610ba79a96bbfa5148e4a50360b05c12e79aaf83` | Persistent URIs, authored curriculum classes, subject taxonomy, inclusion nodes, constraints and release formats |
| [`aila-atomic-concepts`](https://github.com/oaknational/aila-atomic-concepts/tree/4265cca29410caf5871a3af2ac5e6d417cee3dc4) | `4265cca29410caf5871a3af2ac5e6d417cee3dc4` | Experimental decomposition, entity/occurrence identity, staged resolution, alignment evidence and human review boundaries |
| [`oak-openapi`](https://github.com/oaknational/oak-openapi/tree/f64b8f3fe8bee849016c61e60cc0a454d424369b) | `f64b8f3fe8bee849016c61e60cc0a454d424369b` | Current public delivery shapes for lessons, units, questions, threads and variants |
| [`oak-skills`](https://github.com/oaknational/oak-skills/tree/14feebc466b1c7fb6aaae737d0e72383443a5ec4) | `14feebc466b1c7fb6aaae737d0e72383443a5ec4` | Curriculum-value, mapping and editorial lenses |
| This repository | `5d552cd99e22692af49f1727201ee9b2b14568f6` | Generated consumers, graph emission, bounded views, teacher-authority and deterministic-serving decisions |

## The kind of problem we are solving

This is a complex curriculum, product and data-governance problem. It isn't
just a complicated schema-design task.

The technical model affects how curriculum teams express professional
judgement, how teachers adapt materials, how AI-generated candidates are
reviewed, and what later consumers mistake for fact. A technically tidy model
can still fail if it increases authoring work, flattens subject differences, or
turns a model curriculum into a mandate.

### Problem frame

| Element | Frame |
| --- | --- |
| Gap | Important curriculum meanings are exposed as text, coarse membership or derived adjacency without enough stable identity, provenance, review state or release scope. |
| Who it affects | Curriculum teams reviewing and revising content; teachers adapting and assessing; technical consumers joining releases; AI agents explaining or proposing changes; pupils indirectly through curriculum coherence and assessment quality. |
| Causal mechanism | Distinct things are compressed into KLP text and lesson-level lists; ordering is allowed to stand in for dependency; candidate analysis is not always structurally separate from approved decisions; authority and versioning are split across repositories. |
| Constraints | Preserve authored wording and subject expertise; keep teachers in control of local decisions; support existing and refreshed curriculum releases; avoid a new local source of semantic truth; keep servers deterministic; expose only complete declared graph views. |
| Success | Known curriculum questions can be answered with stable identifiers, source evidence, review status and release scope; teams can adapt or revise without losing rationale; candidate automation remains reversible; users can tell current facts from proposals. |

The success criterion isn't “we have a knowledge graph”. It's that a person
can make a better-informed curriculum decision and see why the data supports
it.

## How the exploration changed the model

The initial report and cross-estate report are not competing conclusions. They
sit at different stages of the evidence ladder.

| Stage | What it established | What the next stage changed |
| --- | --- | --- |
| Initial observations | KLPs are carrying too many meanings; takeaways, subject classification, core/supporting role, checkpoints, assessment, alignment, audit and release change need clearer structure. | The initial placeholder `CurriculumClaim` was only one possible answer. |
| Initial model | Preserve authored KLPs, add reusable meanings, contextual uses and reviewed relationships; serve lesson, unit, sequence and release views. | External evidence showed that several candidate classes already exist and do not yet have reconciled semantics. |
| Cross-estate reflection | Ontology KLPs and content descriptors, atomic entities and occurrences, OpenAPI delivery shapes and local graph projections can inform different parts of the design. | Compatible evidence does not prove that four repositories should remain four components of the target system. Authority and generation still need an explicit decision. |
| Final synthesis | Lead with practical curriculum value; preserve domain-specific authored artefacts; make reusable meaning optional and evidence-gated; separate relationship evidence from approval; qualify authority; correct current semantic overclaim first. | This is the candidate architecture to test, not an identity to defend. |

Three corrections matter most.

### Don't add a generic `CurriculumClaim` yet

The ontology already distinguishes lesson-specific KLPs, prior-knowledge
requirements, pupil outcomes and content descriptors. Atomic Concepts explores
a smaller semantic layer. A progression or cross-time takeaway has another
purpose again.

Adding a generic claim class now would name the uncertainty rather than resolve
it. The architecture should first define the questions each existing type
answers and test whether shared identity below those types creates practical
value.

### Don't make atomisation compulsory

The experimental pipeline supports the value of separating an entity from its
curriculum occurrence. It does not show that every subject, KLP or curriculum
statement has one objective atomic decomposition.

Facts, concepts, skills and misconceptions are useful candidate kinds. They are
not a complete account of disciplinary knowledge. Interpretive, creative,
practical, linguistic and physical subjects may depend on integrated practices,
representations and narratives that lose meaning when split too far.

### Don't confuse a data relationship with an approved curriculum decision

Order, co-membership and similarity can all retrieve useful candidates. None
proves dependency, equivalence, coverage or assessment intent. Those stronger
relationships need explicit source evidence and review.

## What value should this create?

The earlier reports describe the data model in detail but understate the human
value. The final architecture should be judged through this impact chain.

| Audience | Potential value | Condition and risk |
| --- | --- | --- |
| Teachers | See what a lesson is intended to build, what it draws on, how questions check it, and what can be adapted without losing coherence. Compare curriculum releases without reverse-engineering text. | The interface must hide model complexity, save time and preserve teacher judgement. Extra tagging and review queues could add work or make a model feel mandatory. |
| Pupils | Potentially experience clearer vocabulary development, fewer hidden prerequisite gaps, more coherent progression and better-targeted checks for understanding. | These are mediated outcomes to evaluate, not benefits established by the architecture. Over-atomisation or ability-based use could fragment knowledge or lower ambition. |
| Curriculum teams | Reuse reviewed mappings, find gaps and duplication, trace release changes, compare coverage, and govern merges, splits and alignment decisions. | This needs identity stewardship, review capacity, subject authority and measurable agreement. A technically complete graph can still be operationally unusable. |
| Technical and AI consumers | Retrieve stable, versioned, provenance-preserving facts and distinguish approved data from candidates. | Conceptual relationships must exist in the emitted release. Derived or inferred data must be labelled honestly. |

For canonical Oak curriculum, curriculum experts approve curriculum content and
relationships. For classroom use, teachers decide how to adapt and teach. AI
can propose, compare and explain. It does not inherit either authority.

## The candidate architecture

The architecture needs shared mechanics, not one universal curriculum
vocabulary. The terms below describe responsibilities. They are not final class
names.

### 1. Authored curriculum artefact

Preserve the object a curriculum expert intentionally authored for a particular
purpose. Examples include:

- KLP;
- prior-knowledge requirement;
- pupil outcome;
- unit or sequence takeaway;
- misconception and response;
- question and answer set;
- content descriptor; and
- vocabulary term and definition.

Each retains its original type, wording, scope, authoring provenance and
release. A KLP is still a KLP. A content descriptor does not become an atomic
item simply because both contain knowledge language.

### 2. Candidate reusable meaning

Where evidence shows value, an authored artefact can refer to one or more
reusable meanings. This layer supports reuse across lessons, units, curriculum
releases or frameworks without using mutable text as identity.

The key word is **candidate**. A reusable meaning becomes published curriculum
data only after subject review. Some authored artefacts may remain the right
target without decomposition.

Production identity should use governed, opaque persistent identifiers. The
current Atomic Concepts hashes are useful provisional identifiers for a
technical proof, not a final semantic-identity policy.

### 3. Contextual use

A contextual use records where and how a meaning appears. It can carry:

- source artefact and source span;
- lesson, unit, programme and curriculum release;
- expected depth or stage;
- role here, such as core, supporting or illustrative;
- classification in a subject-owned scheme;
- authoring or extraction method; and
- review state.

This is the general pattern shared by ontology inclusion nodes and atomic item
occurrences: keep reusable identity separate from placement and provenance.

### 4. Reviewed relationship

Some relationships are curriculum decisions in their own right. Give them
identity when they need evidence, status, release scope or history.

| Relationship | What it should mean | What is not enough evidence |
| --- | --- | --- |
| `requires` / `buildsOn` | A reviewed dependency between intended learning | Earlier year, immediate predecessor, shared thread or embedding similarity alone |
| `assesses` / `checks` | An intended evidence relationship between a question or checkpoint and a learning target | Appearing in the same lesson or quiz alone |
| `alignsWith` | A scoped relationship between an Oak artefact/meaning and a versioned framework descriptor | Similar wording alone |
| `isEquivalentTo` | A reviewed identity decision between two meanings | Automatic clustering alone |
| `realises` | An authored takeaway or progression statement draws together specified meanings | Thread membership alone |
| `supersedes` / `derivedFrom` | A release-to-release lineage relationship | Reusing a slug or title alone |

A reviewed relationship should record its source and target, relationship kind,
direction, evidence, rationale, method, reviewer role, decision state, release
scope and lineage. “Reviewed” is not automatically “evidence-informed”; the
rationale and evidence still need to be inspectable.

### 5. Subject-owned scheme

Subjects need their own ways to classify knowledge, practice and curriculum
structure. The shared architecture should provide stable scheme identity,
versioning, hierarchy and contextual application. Subject teams should own the
vocabulary and definitions.

This allows broad cross-subject queries without forcing one subject's
categories onto all others.

### 6. Immutable release

An immutable release records exactly which authored artefacts, contextual uses,
reviewed relationships and schemes were published together.

It should distinguish four version axes that are easy to conflate:

| Version axis | What changed |
| --- | --- |
| Curriculum content release | The curriculum wording, placement or reviewed relationships |
| Semantic schema version | The ontology classes, properties or constraints |
| Delivery contract version | The OpenAPI response shapes and endpoint contract |
| Analysis run | The model, prompt, inputs or matching method used to create candidates |

One shared curriculum release identifier across semantic and delivery
projections would make joins and provenance safer. An ontology schema version
or repository commit is not a substitute for that content-release identity.

## Takeaways, KLPs and reusable meanings

The original observations return repeatedly to takeaways. The final model
should keep three ideas separate.

### KLP

A KLP is a lesson-specific authored statement about core knowledge or skill. It
supports lesson design and communication. It can remain compound when that is
the useful authored form.

### Takeaway

A takeaway is an explicitly authored statement of what pupils should retain
across a declared scope. That scope might be a lesson, unit, sequence or thread
stage. A takeaway must not be inferred from thread membership.

A takeaway may bring together several reusable meanings. Its value is
pedagogical and curricular, not simply analytical granularity.

### Reusable meaning

A reusable meaning is a governed semantic identity that can link several
authored artefacts or contextual uses. It supports comparison, reuse and
mapping. It does not replace the authored statement that makes sense to a
teacher or curriculum expert.

The relationship between these three is therefore many-to-many, reviewed and
release-specific where needed.

## Vocabulary must stay in the model

Oak's curriculum principles treat vocabulary as knowledge to teach
deliberately, not decoration. The current runtime graph includes keyword nodes,
but a keyword node alone does not show:

- the intended definition;
- where the word is introduced;
- how its meaning develops;
- where pupils retrieve or use it again; or
- whether the same form has a different subject meaning.

Vocabulary progression should be a known-answer use case for the architecture.
It may reuse the same entity/context pattern, but it should not be silently
folded into generic semantic items without testing the subject and language
implications.

## Narrative devices and checkpoints are extensions, not kernel

Narrative devices, lesson beats and checkpoints may be valuable in some
subjects or authoring workflows. They do not yet have enough cross-subject
evidence to belong in the shared core.

If a checkpoint must refer to a place inside a lesson, that place needs stable
instructional identity. A mutable label such as “after narrative beat” is not a
durable anchor. Add lesson segments only when repeated user needs justify the
authoring and governance cost.

## The graph shape

```text
CurriculumRelease
  ├─ includes → authored curriculum artefacts
  ├─ includes → programme/unit/lesson inclusions and their recorded order
  ├─ includes → subject-owned schemes
  └─ includes → accepted reviewed relationships

KLP / Takeaway / PriorKnowledgeRequirement / ContentDescriptor
  └─ may refer to → ContextualUse ─ is use of → ReusableMeaning

QuestionOccurrence ─ assessed-by-reviewed-relationship → learning target
DependencyRelationship ─ source/target → learning targets
AlignmentRelationship ─ source/target → Oak target and framework descriptor
LineageRelationship ─ source/target → release-specific revisions

Unit ─ participates in → Thread
Programme ─ ordered inclusion → UnitVariant
UnitVariant ─ ordered inclusion → Lesson
```

This diagram is deliberately not a claim that every node exists today. A
published graph must distinguish current, proposed, candidate and accepted
relationships.

## Three relations that must never collapse

### Authored order

The ontology's inclusion nodes model where a unit variant or lesson is placed
and carry sequence position. This is an authored structural fact.

### Thread participation

A thread says that units develop a recurring theme, skill or big idea. It is a
cross-cutting organisational relationship.

### Knowledge dependency

A prerequisite relationship says that specified learning is needed for other
learning. This is a stronger curriculum judgement and needs evidence and
review.

These relations can support each other. They are not interchangeable.

## A current semantic-integrity gap

The local graph corpus currently crosses that boundary.

[`graph-corpus-edges.ts`](../../../../packages/sdks/oak-sdk-codegen/src/bulk/generators/graph-corpus-edges.ts)
builds `prerequisiteFor` edges from consecutive units in each thread's
year-ordered projection. It also preserves same-year adjacency by sorting on a
unit identifier. The source explicitly says that same-year tie-break is
arbitrary and not a pedagogical or curricular claim.

`prior-knowledge-view.ts` (deleted by MCP-671)
described these edges as real prerequisites and exposed their predecessors
as prior knowledge. The curriculum-mapping guidance previously consumed that graph as an
ordering input; MCP-671 rewrote it to consume the stated prior-knowledge
statements.

This is more than imprecise wording. A typed graph edge is a claim. The current
edge claims dependency where the source data establishes, at most, year-ordered
thread adjacency. The Atomic Concepts sequencing ADR independently states that
curriculum order is evidence about dependency, not proof of it.

The architecture should preserve:

- year-ordered thread placement as an honest sequence projection;
- derived adjacency as a labelled retrieval candidate if it remains useful;
  and
- `requires` or `prerequisiteFor` for authored or reviewed dependency only.

Until stronger source evidence exists, consumers should not present every
current `prerequisiteFor` edge as an approved prerequisite. This finding should
be resolved before the graph becomes the substrate for more authoritative
curriculum audit or mapping.

## Assessment needs four identities

The public API currently returns question content and answers grouped into
starter and exit quizzes. It does not expose a stable question-to-learning-
target relationship.

A durable assessment model should distinguish:

1. **question entity or revision** — the wording, media and answer logic;
2. **question occurrence** — its placement in a quiz or assessment form;
3. **learning target** — an authored artefact or reviewed reusable meaning;
4. **assessment relationship** — the intended evidence link, with review and
   release scope.

This supports one question checking several targets and one target being
checked in several contexts. It also avoids treating “starter” or “exit” as a
complete statement of what a question assesses.

The ontology does not currently supply this assessment layer, and the local
runtime corpus does not emit question or KLP nodes. This is a real gap, not a
reason to invent the final schema before a mapping study.

## Alignment is a decision with evidence

Alignment should connect stable, versioned source and target identities through
a reviewed relationship. It must support:

- one-to-many and many-to-one mappings;
- partial, composite and no-alignment decisions;
- differences in expected depth or scope;
- candidate, accepted, rejected and superseded states; and
- different curriculum and framework releases.

The Atomic Concepts workflow provides a useful boundary: automated comparison
creates candidate evidence and suggested actions; review creates the curriculum
decision. Text similarity and provisional semantic clustering should never
silently merge identities or publish coverage.

“Complete national-curriculum coverage” is therefore an aggregation over
current, reviewed, versioned mappings with explicit rules. A list of statements
on unit records is useful evidence, but it is not enough to establish complete
coverage by itself.

## Authority is specific to the concern

Calling one repository “the source of truth” hides important distinctions. The
candidate authority split is:

| Concern | Candidate authority | Boundary |
| --- | --- | --- |
| Editable curriculum wording, placement and rationale | The authoring source behind published curriculum data | This source was not inspected and its identity/version workflow remains open. |
| Public endpoint and payload shape | OpenAPI contract | Delivery shape is not semantic authority merely because clients generate from it. |
| Published semantic identity, typed relationships and constraints | A versioned ontology publication | This is a recommendation to test, not a settled upstream ownership decision. |
| Automated decomposition, matching and suggested action | Candidate-analysis pipeline | It owns method and run provenance, not curriculum approval. |
| Reviewed dependency, assessment, alignment and merge decisions | Named curriculum-review process and published relationship set | Approval needs subject authority, evidence and release scope. |
| MCP and SDK views | This repository's pinned deterministic projections | Consumers must not fork upstream semantics or expose absent relationships as present. |
| Classroom adaptation | Teacher or school context | Local adaptation should not rewrite the identity of the published Oak release. |

The ontology is a credible candidate for semantic publication because it
already provides persistent URIs, SHACL constraints, faithful RDF/property-
graph distributions and metadata-bearing inclusion nodes. That does not make
it the editable authoring source or prove that all future classes belong there.

OpenAPI can remain authoritative for delivery shape while exposing stable
semantic identifiers or links. This repository can combine pinned projections
without becoming a second semantic-authority estate.

## Candidate publication flow

```text
Authoring workspace
  └─ approves → immutable curriculum content release
        ├─ publishes → OpenAPI delivery projection
        └─ publishes → ontology semantic projection

Analysis pipeline
  └─ produces → candidate meanings and relationships + run provenance
        └─ curriculum review → accept / amend / reject / defer
              └─ accepted decisions become eligible for a later release

Pinned content, API and ontology releases
  └─ generated ingestion in this repository
        └─ complete, bounded, deterministic resources and tools

Teacher or school adaptation
  └─ contextual overlay that cites the source release without rewriting it
```

The target topology doesn't have to preserve four repositories. What matters
is that each transition has one declared authority, a release identifier and a
reproducible projection.

## AI assists; people decide

AI can help with high-volume comparison and explanation:

- propose KLP decomposition;
- find exact duplicates and candidate semantic matches;
- suggest classifications;
- propose question-to-target mappings;
- identify possible prerequisite gaps;
- compare curriculum and framework descriptors;
- explain release diffs; and
- assemble evidence for review.

AI should not independently:

- decide the canonical meaning or granularity of curriculum knowledge;
- merge or split published entities;
- turn order into dependency;
- approve assessment intent or framework coverage;
- decide what is core in a curriculum context; or
- make a teacher's pedagogical decision.

Each proposal should record the input release, method, model or rule version,
evidence and confidence where meaningful. Review actions should remain
separate, explicit and reversible. The deterministic data surface should serve
the accepted facts and, where useful, a clearly partitioned candidate set. It
should not hide a score or recommendation behind factual-looking output.

## Fit with Oak's curriculum principles

The architecture can support the principles. It cannot guarantee them.

| Curriculum principle | How the architecture can help | What remains a curriculum decision |
| --- | --- | --- |
| Knowledge and vocabulary rich | Make intended knowledge, vocabulary, definitions and contextual reuse easier to inspect. | Which knowledge and vocabulary pupils should learn, and how richly it should be taught. |
| Sequenced and coherent | Keep authored order, thread participation and reviewed dependency visible and distinct. | The professional judgement that a sequence is coherent and right for its subject and pupils. |
| Evidence-informed | Preserve rationale, evidence, provenance and review history. | How evidence and subject expertise are weighed. |
| Flexible | Show dependencies, core/contextual roles and source release so teachers can adapt without losing the rationale. | The teacher's local adaptation and pedagogical decision. |
| Diverse | Allow subject-owned schemes and make selection or mapping decisions inspectable. | Whether the curriculum offers genuine breadth, windows and mirrors, and diverse authorship. |
| Accessible | Help reveal prerequisites, checks and intended outcomes; support accessible authoring views. | Scaffolding, explanation, representation, inclusive design and the same ambitious destination for all pupils. |

Semantic granularity must not be used to create lower-expectation tracks. A
smaller data item is not an easier curriculum. Accessibility is about the route
to ambitious learning, not shrinking the intended learning.

## Graph-serving contract

If this architecture is served as a graph, each response must be honest about
what it contains.

- Every node and edge has stable, navigable identity.
- Edge names express only the relationship the source evidence supports.
- A graph view declares its anchors, depth, node kinds, edge kinds, release and
  decision-state partition.
- The view is complete inside that declared structural bound.
- Nodes or edges are never post-traversal samples or truncated pages.
- Ordered projections remain explicit operations when order cannot ride a
  simple edge.
- Unknown anchors return a well-formed empty result or typed refusal, not a
  degraded list.
- The server retrieves and formats deterministic data. The consuming agent can
  reason over it, show options and explain trade-offs.

A schema-level diagram, an emitted corpus and a served resource are three
different claims. Documentation and product language should say which one is
present.

## Alternatives considered

### Enrich KLP and stop there

This is the simplest route. It may be sufficient for a narrow set of
lesson-level queries.

It becomes fragile when contextual role, many-to-many assessment, cross-release
identity or reviewed alignment are required. Those concerns are relationships
or contextual uses, not intrinsic KLP fields.

### Add a universal `CurriculumClaim`

This creates a convenient centre for the graph. It also risks duplicating or
flattening KLP, content descriptor, prior-knowledge requirement, takeaway and
atomic item semantics before their boundaries are understood.

The recommendation is to keep this as a working abstraction, not a production
class.

### Make the ontology the whole application model

The ontology is the most mature semantic publication candidate. Its persistent
URIs, constraints and inclusion pattern solve real problems.

It does not yet prove the authoring workflow, assessment model, reusable-
meaning granularity or ownership agreement. Ontology should not replace product
discovery or authoring design.

### Make atomic items canonical

This offers fine-grained reuse and mapping. The experimental evidence supports
further testing, not universal adoption. Extraction quality, subject scope,
entity resolution and reviewer agreement remain open.

Atomic items are a candidate analytical and semantic layer, not the starting
authority.

### Keep the current projections and let AI infer the rest

This avoids schema work. It leaves mutable text, missing assessment identity,
release ambiguity and overstated dependency edges in place. An agent can reason
over honest facts; it should not be asked to repair an ambiguous data contract
on every request.

### Layered, governed evidence architecture

This preserves authored content, adds optional reusable identity, records
context separately, governs strong relationships, and keeps publication roles
explicit. It adds modelling and review cost, so it should advance only through
known-answer, cross-subject workflow evidence.

This is the recommended candidate because it preserves the most options while
the high-cost identity and governance decisions are still open.

## Proportionate evidence programme

These are discovery gates, not an implementation plan.

| Probe | Warrant | Falsifier or stop condition | Measure |
| --- | --- | --- | --- |
| 1. Audit current dependency semantics | The local graph and mapping guidance currently overstate year adjacency as prerequisite. | Upstream authored evidence proves each edge has the stronger meaning; otherwise the current label must not stand. | Edge provenance, same-year cases, consumer wording and affected journeys. |
| 2. Prove identity and release round trip | Cross-estate reuse needs stable joins and one content-release context. | KLP, question or relationship identity cannot survive authoring → ontology/OpenAPI → consumer → diff without hidden state. | Join coverage, lost fields, ambiguous matches and reproducibility. |
| 3. Run a cross-subject semantic study | Reusable meanings and subject-owned schemes must work beyond the experimental subject scope. | Reviewers cannot identify useful reusable meanings consistently, or decomposition harms integrated disciplinary meaning. | Agreement, unresolved rate, review time, changes by subject and stage. |
| 4. Test KLP, takeaway and vocabulary questions | These are central user concepts that the generic model could flatten or omit. | The proposed distinctions do not help known teacher or curriculum-team tasks. | Task success, explanation quality, vocabulary progression coverage and authoring burden. |
| 5. Map questions to targets | Assessment relationships appear many-to-many but current public data is lesson-level. | Stable target mapping is too subjective or costly, or lesson-level grouping answers the chosen use cases. | Cardinality, agreement, review time, ambiguous targets and maintenance across revisions. |
| 6. Compare prerequisite retrieval methods | Order and thread membership may retrieve candidates without proving dependency. | Broader retrieval adds noise without finding reviewed dependencies or source identity is insufficient. | Precision/recall against reviewed examples, variation by stage and subject, explanation quality. |
| 7. Round-trip versioned alignment | Alignment needs evidence, review state and release scope. | A reviewed decision cannot be reconstructed after RDF/property-graph/API projection. | Information loss, reversibility, partial/composite mapping support and review effort. |
| 8. Test authoring projections | The model creates value only if lesson, unit, sequence and release views support real work. | It increases task time, disagreement or cognitive load without improving decisions. | Teacher and curriculum-team task time, confidence, adaptation errors, duplicated mapping avoided and unresolved queue size. |
| 9. Specify bounded graph questions | New graph data needs an honest, useful serving contract. | A complete view cannot fit an affordable structural bound or the user question does not need graph traversal. | Known-answer accuracy, completeness, response size, navigability and refusal behaviour. |

Only a later evaluated intervention should claim an effect on pupil outcomes.
The architecture itself can make curriculum intent and evidence clearer; it
doesn't by itself improve learning.

## Promotion gates

Before this becomes an implementation architecture, four conditions should be
met:

1. **Semantic-integrity gate:** current order, thread and dependency contracts
   are reconciled, including product and skill wording.
2. **Authority-and-release gate:** editable identity, semantic publication,
   delivery projection and candidate-analysis roles are agreed, with a shared
   content-release contract.
3. **Cross-subject gate:** reviewers show that any reusable-meaning layer and
   classification mechanism work across materially different subjects without
   flattening them.
4. **Workflow-value gate:** lesson, unit, sequence and release prototypes save
   or improve real work enough to justify their authoring and governance cost.

Entity merges, mass atomisation and irreversible migration should wait for
those gates. Small, versioned pilots and alias-based joins are easier to reverse
and should carry the learning first.

## What not to do

- Don't add every desired concern as an optional field on KLP.
- Don't use mutable text, generated hashes or public slugs as the sole
  production identity for reusable meaning.
- Don't create a universal claim class before reconciling existing authored
  statement types.
- Don't infer takeaways from thread membership.
- Don't label deterministic order as prerequisite dependency.
- Don't treat same-lesson or same-quiz placement as assessment intent.
- Don't publish automated similarity, clustering or recommendations as
  reviewed curriculum decisions.
- Don't treat “reviewed” as evidence without storing rationale and source.
- Don't force one subject's categories onto every subject.
- Don't let a semantic model become a prescribed teaching route.
- Don't use atomisation to lower expectations or create ability tracks.
- Don't describe conceptual graph nodes as current runtime capability.
- Don't page, sample or truncate the internal members of a declared subgraph.
- Don't make this repository a fork of upstream semantic identity.
- Don't conflate content release, ontology schema, API contract and analysis
  run versions.

## Assumptions that changed

| Inherited assumption | Final position |
| --- | --- |
| The task is KLP schema enrichment. | The task is governed curriculum meaning, evidence and change across several authored artefacts. |
| A generic curriculum claim is the missing centre. | It is a working abstraction only; existing KLP, descriptor, takeaway and atomic-item semantics must be reconciled first. |
| Smaller always means more reusable. | Reuse is useful only where subject experts can identify a stable meaning without destroying context. |
| A reviewed graph edge is enough. | A relationship also needs rationale, evidence, release scope and decision lineage. |
| Threads and prior-knowledge graphs establish sequence. | Thread participation, authored order and reviewed dependency are separate; the current local prerequisite contract overclaims its source. |
| Keyword nodes cover vocabulary. | Vocabulary also needs definition, introduction, development and reuse questions. |
| Four relevant repositories imply a four-repository target. | They provide compatible evidence and possible responsibilities; target topology remains open. |
| Semantic architecture produces curriculum quality. | It can make intent and evidence visible; people still make curriculum and pedagogical decisions, and value must be measured in workflow. |
| AI is mainly a reasoning consumer. | AI can also create useful candidates and explanations, but every authoritative change remains governed and reviewable. |
| Existing and refreshed curricula are a compatibility problem. | They need explicit release identity, lineage and release-scoped relationships. |

## Unresolved decisions and evidence

- Which upstream authoring system owns stable editable identity and release
  membership.
- Whether ontology maintainers intend the ontology to own published semantic
  identity for the proposed relationship families.
- How a curriculum content release identifier is shared across ontology,
  OpenAPI, bulk data and consumer projections.
- Slug and persistent-URI coverage for lessons, KLPs, questions, variants and
  other join-critical entities.
- Whether KLP identity is stable across releases or represents one
  release-specific lesson statement.
- The exact boundary between content descriptor, KLP, takeaway,
  prior-knowledge requirement and candidate reusable meaning.
- Which subjects and stages benefit from decomposition, and how reviewer
  agreement changes across them.
- Whether stable question identity or richer target mapping already exists
  upstream but is omitted from public delivery.
- Governance for semantic merges, splits, redirects, reversals and disputed
  equivalence.
- Which reviewed relationships belong in the ontology release and which remain
  authoring-workflow data.
- The evidence and aggregation rules required to claim complete framework
  coverage.
- Whether lesson segments, narrative devices and checkpoints earn their
  authoring burden.
- How teacher or school adaptation overlays should be represented, if they are
  persisted at all.
- The acceptable authoring time, review disagreement and unresolved-candidate
  rate.
- The prioritised teacher, curriculum-team and open-data questions that justify
  each new semantic layer.

## Final conclusion

The durable opportunity is to make curriculum intent, evidence and change
clear without flattening the curriculum or displacing professional judgement.

The evidence supports a layered, governed architecture to test:

- preserve the statements curriculum experts author;
- add stable reusable meaning only where review shows it helps;
- record each contextual use separately;
- make strong relationships evidence-backed, versioned decisions;
- publish semantic and delivery views from declared authorities;
- keep AI proposals separate from accepted curriculum data; and
- serve complete, deterministic graph views whose labels do not overclaim their
  source.

The first step is not adding more semantic classes. It is restoring the
distinction between order and dependency, then proving the identity, release
and workflow contracts on known teacher and curriculum-team questions across
subjects.

If those probes show practical value, the resulting architecture can support
safer adaptation, clearer assessment intent, reusable mapping and more
explainable curriculum change. If they do not, the smaller existing models
should remain. That reversibility is a feature of the recommendation, not a
lack of conviction.

## Primary references

### Reports in this exploration

- [Initial concept exploration](./oak-reusable-curriculum-architecture.md)
- [Cross-estate reflection](./oak-reusable-curriculum-architecture-cross-estate-reflection.md)

### Oak Curriculum Ontology

- [Ontology README](https://github.com/oaknational/oak-curriculum-ontology/blob/610ba79a96bbfa5148e4a50360b05c12e79aaf83/README.md)
- [Ontology schema](https://github.com/oaknational/oak-curriculum-ontology/blob/610ba79a96bbfa5148e4a50360b05c12e79aaf83/ontology/oak-curriculum-ontology.ttl)
- [SHACL constraints](https://github.com/oaknational/oak-curriculum-ontology/blob/610ba79a96bbfa5148e4a50360b05c12e79aaf83/ontology/oak-curriculum-constraints.ttl)
- [Faithful property-graph format](https://github.com/oaknational/oak-curriculum-ontology/blob/610ba79a96bbfa5148e4a50360b05c12e79aaf83/docs/property-graph-format.md)

### Atomic Concepts

- [Repository README](https://github.com/oaknational/aila-atomic-concepts/blob/4265cca29410caf5871a3af2ac5e6d417cee3dc4/README.md)
- [Atomic item schema](https://github.com/oaknational/aila-atomic-concepts/blob/4265cca29410caf5871a3af2ac5e6d417cee3dc4/atomic_concepts/schemas.py)
- [Sequence and dependency ADR](https://github.com/oaknational/aila-atomic-concepts/blob/4265cca29410caf5871a3af2ac5e6d417cee3dc4/docs/adr/0001-separate-curriculum-sequencing-from-prerequisite-dependency.md)
- [Entity and occurrence ADR](https://github.com/oaknational/aila-atomic-concepts/blob/4265cca29410caf5871a3af2ac5e6d417cee3dc4/docs/adr/0002-separate-atomic-item-identity-from-curriculum-occurrence.md)
- [Staged entity-resolution ADR](https://github.com/oaknational/aila-atomic-concepts/blob/4265cca29410caf5871a3af2ac5e6d417cee3dc4/docs/adr/0003-use-staged-entity-resolution.md)
- [Alignment workflow](https://github.com/oaknational/aila-atomic-concepts/blob/4265cca29410caf5871a3af2ac5e6d417cee3dc4/atomic_concepts/alignment/README.md)

### OpenAPI and local serving contracts

- [Lesson summary schema](https://github.com/oaknational/oak-openapi/blob/f64b8f3fe8bee849016c61e60cc0a454d424369b/src/lib/handlers/lesson/schemas/lessonSummaryResponse.schema.ts)
- [Question schema](https://github.com/oaknational/oak-openapi/blob/f64b8f3fe8bee849016c61e60cc0a454d424369b/src/lib/handlers/questions/types.ts)
- [Unit summary schema](https://github.com/oaknational/oak-openapi/blob/f64b8f3fe8bee849016c61e60cc0a454d424369b/src/lib/handlers/units/schemas/unitSummaryResponse.schema.ts)
- [Local graph edge generation](../../../../packages/sdks/oak-sdk-codegen/src/bulk/generators/graph-corpus-edges.ts)
- Local prior-knowledge view — `prior-knowledge-view.ts`, deleted by MCP-671
- [Local thread-progression projection](../../../../packages/sdks/graph-corpus-sdk/src/curriculum/thread-progressions-projection.ts)
- [Deterministic data surface ADR](../../../../docs/architecture/architectural-decisions/191-deterministic-data-surface-agent-reasons.md)
- [Teacher-as-expert ADR](../../../../docs/architecture/architectural-decisions/194-teacher-as-expert-product-boundary.md)

### Curriculum and editorial lenses

- [Oak curriculum principles](https://github.com/oaknational/oak-skills/blob/14feebc466b1c7fb6aaae737d0e72383443a5ec4/skills/oak-curriculum-principles/SKILL.md)
- [Oak curriculum mapper](https://github.com/oaknational/oak-skills/blob/14feebc466b1c7fb6aaae737d0e72383443a5ec4/skills/oak-curriculum-mapper/SKILL.md)
- [Oak tone of voice](https://github.com/oaknational/oak-skills/blob/14feebc466b1c7fb6aaae737d0e72383443a5ec4/skills/oak-tone-of-voice/SKILL.md)
