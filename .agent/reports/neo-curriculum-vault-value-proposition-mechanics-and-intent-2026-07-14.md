# NEO Curriculum Vault: value proposition, mechanics, and intent

- **Date:** 2026-07-14
- **Status:** public-source research report
- **Primary artefact:**
  [`nudgeeducation/neo-curriculum-vault`](https://github.com/nudgeeducation/neo-curriculum-vault/tree/d9786484e676b154e25a65806d70dbd385c017ad)
  at `d9786484e676b154e25a65806d70dbd385c017ad`
- **Public site:** [curriculum.nudgeeducation.online](https://curriculum.nudgeeducation.online/)

## Meta: document intent and review contract

### Purpose

This document exists to give Oak an evidence-bounded understanding of:

1. what value NEO is actually providing through the public Curriculum Vault
   and the wider operating model it expresses;
2. how the vault works, including what is implemented, partial, prospective,
   or not evidenced;
3. how NEO's use of Oak curriculum identifiers relates to Oak's ontology,
   graph, MCP/search, and external-adoption work; and
4. which forms of mutual support may be worth exploring, without implying a
   partnership, endorsement, implementation commitment, or transfer of source
   authority.

### Intended impact

A reader should be able to distinguish NEO's demonstrated public value from
its stated offer and future architecture; understand the authority boundaries
among DfE, Oak, NEO, awarding bodies, and learner evidence; and evaluate the
proposed mutual-support probes using their warrants and falsifiers.

### Review questions

Review this document against whether it:

- separates observed, offered, partially implemented, prospective, and
  outcome-unverified claims;
- explains Curriculum × Overlay mechanics accurately enough to support the
  value analysis;
- identifies NEO's distinctive contribution without mistaking source
  curriculum or qualification content for NEO-created value;
- relates NEO to current Oak work without collapsing `natcurric:`, Oak
  programmes, NEO canonical nodes, assessment overlays, or learner evidence;
- keeps every opportunity potential, reciprocal, reversible, and paired with
  a warrant, falsifier, and cheapest useful probe;
- preserves the public-only scope and makes inferences and unresolved evidence
  visible; and
- avoids implementation planning, partnership commitments, Oak endorsement,
  private-material inference, learner-data exchange, or ingestion of NEO
  content into Oak authority.

### Evidence and authority

- Primary evidence is public, source-linked, and pinned where possible.
- Corpus counts and link findings describe the reviewed NEO commit, not its
  future state.
- NEO service claims are treated as documented offers unless independent
  outcome or usage evidence exists.
- Proposals are exploratory research outputs, not decisions, delivery
  recommendations, or support commitments.
- Any partnership, plan promotion, engineering work, or external communication
  requires separate owner-ratified action.

### Definition of a successful review

A review succeeds when it identifies a specific mismatch between this contract
and the report, validates that the report meets the contract, or names missing
evidence that would materially change the synthesis. Stylistic preference
alone is not a substantive verdict.

## Executive synthesis

The NEO Curriculum Vault is most usefully understood as a **public curriculum
translation graph**.

Its distinctive proposition is not that it publishes curriculum pages. It is
that it gives four different things separate identities and then relates them:

1. what NEO believes is worth learning;
2. how an awarding body assesses some of that learning;
3. what evidence a learner produces and how securely it demonstrates the
   learning; and
4. how the same activity can be made legible to learners, practitioners,
   families, commissioners, and external systems.

The architectural move is called **Curriculum × Overlay**. Canonical curriculum
nodes express learning in NEO's own voice. Overlay nodes express the outcomes
or assessment objectives of qualifications and link back to the canonical
learning they test. Multiple qualifications can therefore point to the same
learning, while valuable learning can exist without a qualification overlay at
all. The repository states this distinction directly in its
[README](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/README.md#L7-L17)
and makes its educational rationale explicit in the
[tagging schema](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/tagging-schema.md#L18-L42).

This is a meaningful conceptual contribution. It resists allowing examination
specifications to become the de facto definition of learning, without denying
that learners still need qualifications and commissioners still need
traceability. It also fits NEO's public teaching-and-learning stance that
assessment should serve learning rather than define the learner.

The public artefact already demonstrates more than a paper design: it has a
live Quartz site, 99 typed canonical outcomes, 49 typed overlay outcomes,
resolved overlay-to-curriculum mappings, a KS3-to-KS4 precursor network, and a
small working interoperability exemplar using identifiers from the Oak
Curriculum Ontology. However, the evidence and portfolio flow described by the
schema is still an intended downstream system, not a capability demonstrated by
this repository. Taxonomy, mastery coverage, node identity, and branch
granularity are also uneven.

The analysis therefore converges on this maturity statement:

> The vault is a credible editorial graph and a strong prototype of a
> curriculum-assessment translation layer. It is not yet a fully normalised
> curriculum knowledge graph or an end-to-end learner-evidence system.

A second concept-exploration pass changes the emphasis. NEO's differentiated
value is not primarily the possession of curriculum content: much of the
academic and qualification material originates in public curricula or
awarding-body specifications. Its contribution is the **integration** of
relationship-first alternative provision, flexible qualification routes,
broader-than-exam learning, and commissioner-facing legibility for learners who
may not be well served by mainstream structures. The vault makes that
integration inspectable.

The public evidence proves that the map exists. It does not yet prove learner
outcomes, practitioner adoption, reduced pathway-switching cost, or automated
portfolio value. For Oak, NEO is therefore best treated as a concrete external
consumer of curriculum identifiers and a possible co-learning partner—not as
another graph for Oak to ingest or a source whose local curriculum claims
should become Oak authority.

## Scope and method

This report evaluates the value proposition, mechanics, and apparent intent of
the public curriculum vault. It does not inspect, describe, or infer the
contents of private Nudge repositories or private curriculum material.

Public sibling repositories are used only where they clarify the vault's
operating context. The principal contextual source is NEO's public
[Teaching and Learning Policy](https://github.com/nudgeeducation/nudge-policy-vault/blob/73d59c491ee42b2e9e4794324aeb78b1e7c4f406/content/neo-only/neo-teaching-and-learning-policy.md#L29-L70).
The report does not attempt an organisation-wide governance, security, or
software audit.

The investigation combined:

- close reading of the README, schema, representative canonical and overlay
  nodes, publication configuration, and interoperability proposal;
- a census of the pinned Markdown corpus, excluding fenced schema examples
  from typed-node counts;
- resolution of the explicit wikilink graph using the repository's configured
  relative-link semantics;
- comparison of stated architecture with instantiated metadata and page
  content; and
- checks against the public NEO policy and the Department for Education's
  statutory National Curriculum sources where the vault's rationale depends on
  them.

The figures in this report are a snapshot of the pinned commit, not claims
about future coverage.

## 1. The concept being explored

The vault sits at the intersection of several familiar artefact types, but is
not identical to any one of them.

| It resembles | What the vault adds or changes |
| --- | --- |
| A curriculum website | It models relationships between curriculum, assessment, pathways, needs, and evidence rather than only publishing prose. |
| A qualification catalogue | Qualifications are overlays on learning, not the organising authority for all learning. |
| A curriculum map | Nodes are intended to be independently addressable, reusable, and connected across stages and assessment systems. |
| A knowledge graph | Relationships are explicit and navigable, but much of the documented taxonomy is not yet instantiated or validated as a formal graph model. |
| A learner portfolio schema | It defines how curriculum metadata could travel with evidence, but this repository does not implement the portfolio or its evidence lifecycle. |
| A commissioner evidence pack | It contains the ingredients for traceability, but the automated audit and reporting outputs remain prospective. |

The concept's centre of gravity is the **translation function**. The vault
tries to preserve educational meaning while allowing that meaning to be read
through the different vocabularies of an exam board, a teacher, a learner, a
commissioner, or a machine.

## 2. The problem it is trying to solve

### 2.1 Qualifications easily become the curriculum by accident

When a provision supports multiple boards and routes, it is operationally easy
to organise teaching around separate specification documents. That duplicates
content, makes equivalence hard to see, and allows what is assessable to crowd
out what is educationally valuable.

The vault's response is to maintain a canonical curriculum spine and treat
qualification specifications as mappings onto it. Its own summary is concise:
the curriculum is “what learning is”; overlays are “how learning gets
assessed.” A
[canonical KS4 English comprehension node](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/02-curriculum/ks4/english/comprehension.md#L1-L40),
for example, links the same underlying learning to Edexcel IGCSE, AQA GCSE, and
Functional Skills outcomes.

### 2.2 NEO's offer is broader than a National Curriculum or exam-board view

The canonical layer deliberately includes life-and-work learning,
relational-and-symbolic courses, and statutory RSHE alongside key-stage
curriculum. The schema's reasoning is that treating these branches as
derivatives of the National Curriculum would wrongly make the National
Curriculum the only legitimate definition of learning
([schema lines 86–109](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/tagging-schema.md#L86-L109)).

This matches the public NEO policy's wider intent: academic, creative,
technological, and personal development learning; preparation for study, work,
and life; and success measures that are not solely external qualifications
([policy lines 40–58](https://github.com/nudgeeducation/nudge-policy-vault/blob/73d59c491ee42b2e9e4794324aeb78b1e7c4f406/content/neo-only/neo-teaching-and-learning-policy.md#L40-L58),
[112–120](https://github.com/nudgeeducation/nudge-policy-vault/blob/73d59c491ee42b2e9e4794324aeb78b1e7c4f406/content/neo-only/neo-teaching-and-learning-policy.md#L112-L120)).

### 2.3 Different audiences need different entry points into the same truth

The schema names homeschoolers, local authorities, schools, online schools,
and NEO itself as audiences with different relationships to assessment. The
proposed answer is not a separate content estate for each audience; it is one
connected estate with different routes through it. The live site already
offers navigation by curriculum, overlay, pathway, and need, while Quartz adds
search, backlinks, and local graph views.

### 2.4 Evidence loses meaning when it is detached from what was learned

The intended downstream flow lets a piece of learner evidence carry a
canonical outcome, an optional overlay outcome, and a mastery judgement. The
same work could then say both “what the learner learned” and “how this counts
towards a particular qualification.” The schema extends this to PDF,
spreadsheet, and learner-controlled portfolio views
([schema lines 397–420](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/tagging-schema.md#L397-L420)).

That downstream flow is the largest prospective source of value and the least
implemented part of the public repository.

## 3. Value proposition

### 3.1 For learners

- **Learning is not reduced to a test specification.** A learner can pursue
  canonical learning with no overlay, or connect the same learning to one or
  more qualifications.
- **Routes can change without erasing prior learning.** If the canonical node
  is stable, movement from one awarding body or pathway to another becomes a
  remapping exercise rather than a restart.
- **Different forms of evidence can remain meaningful.** The intended model is
  compatible with written, spoken, visual, project, and conversational
  evidence, consistent with NEO's public commitment to multimodal
  demonstration of understanding.
- **The long-term record can be learner-centred.** The schema's structural
  inversion is that NEO owns curriculum data while the learner owns evidence
  data; overlay annotations make that evidence externally legible without
  allowing the external assessment system to define the learner.

The first two benefits are visible in the content model. The evidence ownership
and portability claim remains architectural intent.

### 3.2 For teachers and practitioners

- One canonical outcome can become the stable planning anchor across several
  qualifications.
- Precursor and parallel links can make stage progression and cross-curriculum
  connections visible.
- Suggested evidence and mastery descriptors can turn a curriculum statement
  into a practical planning object.
- Mode and Cornerstone metadata can connect subject intent to NEO's delivery
  model rather than leaving pedagogy in a separate policy document.

The public policy defines six Cornerstones and live, asynchronous, and
independent modes
([policy lines 31–38](https://github.com/nudgeeducation/nudge-policy-vault/blob/73d59c491ee42b2e9e4794324aeb78b1e7c4f406/content/neo-only/neo-teaching-and-learning-policy.md#L31-L38),
[61–70](https://github.com/nudgeeducation/nudge-policy-vault/blob/73d59c491ee42b2e9e4794324aeb78b1e7c4f406/content/neo-only/neo-teaching-and-learning-policy.md#L61-L70));
the vault carries these dimensions into curriculum metadata.

### 3.3 For families

- The public site provides a browsable explanation of both learning and
  qualification routes.
- Canonical language can make an offer easier to understand than a collection
  of awarding-body documents.
- A future evidence view could show progress without reducing it to grades.

The first two are present as editorial content. The third depends on a
downstream portfolio or reporting consumer.

### 3.4 For commissioners and local authorities

- Overlay mappings can answer which formal outcomes a programme covers without
  making the awarding-body specification the only curriculum view.
- PfA, area-of-need, and OEAS metadata are intended to make the same curriculum
  legible for SEND outcomes, accreditation, and reporting.
- A canonical-plus-overlay evidence table could support auditability across
  learner-specific routes.

This is a potentially strong proposition for alternative provision because it
joins educational intent and accountability rather than forcing a choice
between them. Its strength depends on mapping coverage, provenance, and the
existence of report-producing consumers.

### 3.5 For NEO as an organisation

- The vault can provide a shared conceptual model across curriculum design,
  delivery, qualification preparation, progress evidence, and public
  explanation.
- Repeated learning can be maintained once while board-specific mappings change
  around it.
- Explicit links can make curriculum gaps, duplicate mappings, and the effect
  of an external curriculum change inspectable.
- Public publication makes the offer visible and potentially reusable.

### 3.6 For external curriculum systems

The optional `nc_ref` field is a deliberately low-cost interoperability move.
It keeps the vault in Markdown while giving selected canonical nodes stable
references into the Oak Curriculum Ontology. The proposal explicitly describes
this as “a reference, not a restructure” and uses the absence of an Oak
National Curriculum reference to express where NEO's curriculum is broader
than the National Curriculum
([extension lines 10–22](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/nc-ref-extension.md#L10-L22)).

The current exemplar is small but concrete: four KS3 English pages carry seven
references, and the supplied validator resolves all seven against the pinned
Oak ontology release. That validates identifier existence, not semantic fit.
It demonstrates an interoperability seam, not yet an interoperability layer.

## 4. How it works

### 4.1 Authoring and publication substrate

The vault is an Obsidian-compatible Markdown corpus published with Quartz 4 to
GitHub Pages. This gives it:

- low-friction Markdown authoring;
- YAML frontmatter for structured fields;
- wikilinks for explicit relationships;
- folder navigation and full-text search;
- backlinks and a local graph on content pages; and
- static public deployment without an application database.

The configured page layout renders explorer, search, graph, and backlinks
([`quartz.layout.ts`](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/quartz.layout.ts#L12-L38)).
Quartz therefore turns editorial links into visible navigation with little
custom software.

### 4.2 Content layers

| Layer | Mechanical role |
| --- | --- |
| `01-cornerstones` | NEO's six framing concepts for how learning is experienced. |
| `02-curriculum` | The canonical learning spine: KS3, KS4, future KS5, life-and-work, relational-and-symbolic, and statutory branches. |
| `03-overlays` | Qualification and programme outcomes mapped to canonical learning. |
| `04-pathways` | Routes through qualifications, Preparing for Adulthood, and OEAS context. |
| `05-needs` | The four broad SEND areas of need, framed as delivery relevance rather than learner deficit. |
| `06-resources` | Supporting platforms and resource-sourcing notes. |
| `_schema` | The intended taxonomy, examples, maintenance model, and interoperability proposal. |

### 4.3 Canonical nodes

A canonical node has a NEO-authored statement of the learning and structured
fields such as:

- `type: canonical-outcome`;
- curriculum branch, domain, and strand;
- Cornerstone fit;
- delivery mode;
- OEAS relevance;
- whether a mastery scale applies; and
- optionally, `nc_ref` identifiers.

Its body can include qualification overlays that test it, suggested evidence,
mastery descriptors, and stage precursors. The
[KS4 comprehension example](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/02-curriculum/ks4/english/comprehension.md#L1-L40)
instantiates the intended shape particularly clearly.

### 4.4 Overlay nodes

An overlay node retains the awarding-body identity and outcome code, then links
to one or more canonical nodes under `Tests canonical`. It can also link to
rough equivalents in other overlays and record assessment-specific details.
The
[Edexcel IGCSE AO1 example](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/03-overlays/edexcel-igcse/english-language-a/ao1.md#L1-L32)
shows the pattern.

The canonical node is the semantic pivot. Two overlay outcomes do not have to
claim exact equivalence to become navigable from the same underlying learning.
This is more robust than flattening every board into one synthetic outcome
scheme, provided the mappings are curated carefully.

### 4.5 The link graph

The schema defines four connective patterns:

1. overlay outcomes to the canonical learning they test;
2. precursor and parallel links across curriculum branches;
3. optional direct equivalents across overlays; and
4. Cornerstone clusters
   ([schema lines 270–280](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/tagging-schema.md#L270-L280)).

At the pinned snapshot, a local link census found:

- 80 distinct resolved overlay-to-curriculum edges;
- 46 of 49 typed overlay nodes with at least one resolved curriculum link;
- 54 resolved KS3-to-KS4 precursor edges; and
- one large weakly connected component containing 252 of the 253 Markdown
  pages.

Those figures show that the Curriculum × Overlay idea is instantiated, not
only described. They do not establish that every mapping is semantically
correct or that every branch has equivalent depth.

### 4.6 The intended evidence lifecycle

The schema proposes this sequence:

```text
canonical outcomes selected for planning
  -> applicable overlays surfaced
  -> both references inherited by an assignment
  -> learner evidence produced in any suitable medium
  -> mastery judgement attached
  -> evidence exported as a portable, attributable bundle
  -> learner, family, practitioner, and commissioner views rendered
```

This is the point where the vault would become more than a curriculum
publication system. The public repository defines the semantics, but it does
not contain evidence records, a portfolio application, the described
`manifest.json` bundles, or a demonstrated consumer of the complete flow.

## 5. The underlying intent

### 5.1 Educational intent

The vault encodes an explicit claim: **assessment is a view onto learning, not
the definition of learning**. This is consonant with NEO's public policy:
assessment is described as affirming, relational, and learner-led; external
assessment is used where appropriate; and progress towards learner-defined
goals sits alongside academic achievement
([policy lines 95–120](https://github.com/nudgeeducation/nudge-policy-vault/blob/73d59c491ee42b2e9e4794324aeb78b1e7c4f406/content/neo-only/neo-teaching-and-learning-policy.md#L95-L120)).

The architecture operationalises that intent by making the curriculum side
canonical and the assessment side optional and many-to-one.

### 5.2 Inclusion intent

The model tries to support learners whose pathway may not be linear, purely
academic, or immediately qualification-led. Life-and-work and NEO-original
learning are given canonical status; modes and Cornerstones sit alongside
subject metadata; and needs are meant to describe suitable delivery rather
than define an outcome or label a learner.

### 5.3 Accountability intent

The architecture does not reject qualifications, accreditation, or
commissioner scrutiny. It tries to make them traceable without giving them
exclusive authority over the curriculum. Overlay IDs, OEAS fields, PfA fields,
and prospective evidence tables are the accountability mechanisms.

### 5.4 Openness and interoperability intent

The public repository and live site make the curriculum inspectable. The Oak
reference experiment adds a machine-resolvable vocabulary without requiring
authors to work directly in RDF. The intended posture is a lightweight open
content system that can acquire graph semantics incrementally.

## 6. What is real, partial, and prospective

| State | Evidence at the pinned snapshot |
| --- | --- |
| **Implemented** | Public Markdown vault; live static site; Curriculum × Overlay folder model; 99 typed canonical outcomes; 49 typed overlay outcomes; substantial resolved mapping and precursor links; graph and backlinks in the page UI; seven `nc_ref` identifiers across four KS3 English nodes. |
| **Partially implemented** | Structured frontmatter; curriculum and overlay coverage; suggested evidence; mastery descriptors; cross-board mappings; formal node identity; external vocabulary alignment. |
| **Prospective** | Metadata flowing automatically from planning into assignments and learner evidence; evidence triples; portable signed bundles; PDF, spreadsheet, and network portfolio rendering; automated commissioner or OEAS packs; broad JSON-LD export. |

Coverage illustrates the distinction:

- all 99 typed canonical outcomes carry `curriculum`, `mode`,
  `mastery_scale`, and OEAS metadata;
- 95 of 99 carry a Cornerstone value;
- 59 of 99 contain suggested-evidence material;
- 32 of 99 have a mastery heading; and
- 21 of 99 instantiate all four documented mastery labels.

Several subjects are represented as rich overview pages rather than normalised
outcomes, while other branches contain typed leaves. Some qualification
branches are placeholders or await demand. This is compatible with a staged,
cohort-led working draft, but it means the graph does not yet offer uniform
granularity.

## 7. Movement 1 — what value NEO is actually providing

The word “actual” needs an evidence boundary. Public artefacts can establish
what NEO has built, published, and formally offered. They cannot establish
whether learners have benefited, practitioners use the vault in planning, or
commissioners rely on its reports without outcome or usage evidence.

| Value claim | What is publicly observed | Evidence ceiling |
| --- | --- | --- |
| NEO offers relationship-first, trauma-informed, neurodivergent-affirming online alternative provision with a named practitioner and several learning modes. | The live Teaching and Learning Policy and public curriculum site define this operating model consistently. | **Offered and documented**, not independently outcome-verified. |
| Learners can follow or combine academic, Functional Skills, ASDAN, life-and-work, and NEO-original routes. | The public site exposes these routes and the vault contains their curriculum and overlay branches. | **Offer and content structure verified**; actual route uptake and switching are not. |
| The curriculum is broader than examination specifications. | Life-and-work, relational-and-symbolic, Cornerstones, RSHE, and need/pathway content exist as first-class public branches. | **Editorial proposition verified**; curriculum impact is not. |
| The same learning is related to several assessment regimes. | Resolved overlay-to-canonical links exist across IGCSE, GCSE, and Functional Skills nodes. | **Mapping mechanism verified**; semantic correctness is only partly assured. |
| Families, practitioners, and commissioners can inspect the offer. | The public Quartz site is live, searchable, linked, and navigable by curriculum, overlay, pathway, and need. | **Public legibility verified**; audience comprehension and use are not. |
| Learner evidence will remain portable and meaningful across pathways. | The schema defines canonical-overlay-mastery triples and export views. | **Prospective architecture only**; no public end-to-end evidence consumer is demonstrated. |
| NEO interoperates with Oak curriculum data. | Seven `natcurric:` references on four KS3 English pages resolve against Oak Ontology v0.1.3. | **Identifier-existence proof**; semantic fit and operational reuse remain open. |

### The value beneath the artefact

The actual distinctive value is **contextual integration**:

1. **A relational wrapper around education.** NEO's offer starts with safety,
   continuity, and a named practitioner rather than assuming a learner can
   immediately consume a conventional timetable.
2. **Pathway plurality without curricular fragmentation.** GCSE, IGCSE,
   Functional Skills, ASDAN, and non-qualification learning can be represented
   as different routes through related learning rather than isolated silos.
3. **Legitimacy for broader learning.** Life-and-work, relational, statutory,
   and wellbeing dimensions are allowed to be curriculum in their own right,
   not weak substitutes for an examination route.
4. **Translation for accountability.** The same learning can be explained in
   learner-facing, teaching, awarding-body, and commissioner vocabularies.
5. **Public inspectability.** NEO has made its model and a substantial part of
   its content available for scrutiny and reuse rather than leaving the offer
   inside brochures or private planning documents.

This is more an **operating-model contribution** than a claim of wholly novel
academic subject matter. The vault is valuable because it makes the operating
model explicit, connected, and potentially machine-readable.

## 8. Movement 2 — the NEO–Oak problem space

### Problem frame

- **Gap:** curriculum requirements, teaching resources, qualification
  specifications, local provision, and learner evidence use different identity
  systems and are usually connected by prose or practitioner memory.
- **Who bears the cost:** learners whose routes change; practitioners who
  repeatedly interpret specifications; families and commissioners who need
  legible progress; and data consumers who cannot tell whether two labels refer
  to the same learning.
- **Causal mechanism:** assessment documents become accidental curriculum
  authorities, while local curriculum models and evidence records lack stable
  external anchors.
- **Constraints:** the National Curriculum, Oak programmes, NEO curriculum,
  awarding-body outcomes, and learner evidence have different owners and must
  not be collapsed; Oak's ontology is an early release; no pupil data is needed
  or appropriate for discovery; and a link proves neither equivalence nor
  pedagogical quality.
- **Success:** each source retains its authority, relationships are explicit and
  reviewable, external identifiers survive change predictably, and a user can
  move from a bounded curriculum question to relevant next sources without a
  false claim of equivalence.

### The adjacent roles

| Concern | Oak's role | NEO's role | Boundary that must remain visible |
| --- | --- | --- | --- |
| National Curriculum vocabulary | Publish an open, versioned, machine-readable representation with persistent identifiers and provenance. | Reference Oak's `natcurric:` identifiers where a NEO canonical node genuinely corresponds. | Oak's representation is not the official DfE publication; NEO's mapping is not Oak validation of its curriculum. |
| Teaching programmes and resources | Model and expose Oak programmes, units, lessons, threads, and supporting content. | Select or link teaching resources appropriate to NEO's learners and delivery model. | An NC correspondence does not create a direct edge to a particular Oak lesson. |
| Local curriculum intent | No ownership role. Oak may provide reusable primitives. | Own the meaning, granularity, pedagogy, and governance of NEO canonical nodes, including content beyond the NC. | NEO-original branches should not be forced into Oak's National Curriculum namespace. |
| Qualification assessment | Oak's ontology contains programme/exam-board structure where relevant, but Oak does not own awarding-body specifications. | Own the local canonical-to-overlay mapping and its source confidence. | NEO mappings should not silently become Oak or awarding-body authority. |
| Learner evidence | Potentially supply curriculum identifiers and open resources. | Own evidence semantics, consent, safeguarding, mastery, reporting, and any portfolio system. | No learner data exchange is required for ontology or mapping collaboration. |
| Graph serving | Provide deterministic, provenance-preserving, bounded graph and search surfaces. | Act as a real consumer and evaluate whether those surfaces answer authoring and navigation questions. | Oak's deterministic data surfaces should not decide learner relevance or NEO pathway choice; those judgements remain with the user and NEO. |

### How this relates to current Oak work

NEO has already exercised the external-adoption path anticipated by Oak's
[knowledge-graph adoption estate](../plans/sector-engagement/knowledge-graph-adoption/README.md):
it pinned ontology release v0.1.3 in its public schema, used public identifiers
in a separate product, and wrote a local validator. A replay against the pinned
release resolves all seven identifiers. That is stronger evidence than a
hypothetical adopter persona.

It does **not** by itself fire every Oak plan:

- The strategic
  [external-adoption brief](../plans/sector-engagement/knowledge-graph-adoption/future/oak-knowledge-graph-external-adoption.plan.md)
  still requires Oak to choose an adopter scenario and support commitment.
- The
  [NC knowledge-taxonomy surface](../plans/connecting-oak-resources/knowledge-graph-integration/future/nc-knowledge-taxonomy-surface.plan.md)
  promotes on documented demand for taxonomy traversal. Seven identifiers show
  use, but NEO has not publicly asked Oak for a traversal service.
- The
  [cross-source journeys plan](../plans/connecting-oak-resources/knowledge-graph-integration/future/cross-source-journeys.plan.md)
  is still demand- and substrate-gated. A NEO use case could test it, but should
  not be used to bypass those gates.

The relationship is therefore adjacent and reciprocal:

```text
DfE statutory sources
  -> Oak's machine-readable National Curriculum representation
    -> NEO's local canonical curriculum references
      -> NEO qualification overlays
        -> prospective NEO learner evidence

Oak programmes/resources remain a separate branch from the shared
National Curriculum reference point; they are discoverable next sources,
not automatically equivalent nodes.
```

This separation is a strength. NEO tests whether Oak identifiers work outside
Oak without requiring Oak to absorb NEO's curriculum or NEO to adopt Oak's
programme structure.

## 9. Movement 3 — reopening the mutual-support space

The fluent first answer is “integrate the two graphs.” Reflection changes that
answer. The useful relationship begins with **consumer feedback, semantic
review, and release compatibility**, not data ingestion or a new platform.

| Inherited or tempting assumption | Revised understanding |
| --- | --- |
| NEO is mainly another source graph Oak might ingest. | NEO is more valuable initially as an external adopter and adversarial consumer of Oak identifiers. Its local mappings remain under NEO authority. |
| A valid Oak URI establishes a correct NEO mapping. | The validator establishes existence only. Phase, granularity, and semantic correspondence still require review. |
| Oak curriculum resources can simply fill NEO's canonical nodes. | `natcurric:` references anchor statutory concepts; Oak programmes and lessons use a separate `oakcurric:` model. Resource discovery needs an explicit search or mapping step. |
| NEO's broader curriculum reveals gaps Oak should add to the NC ontology. | Absence of an NC reference is meaningful. Life-and-work and NEO-original content should retain separate identities unless a genuinely shared external vocabulary exists. |
| A partnership requires a formal API or bespoke service. | The cheapest reciprocal probes are a mapping review, upgrade rehearsal, and documented consumer questions using existing public artefacts. |
| The portfolio vision is the immediate shared opportunity. | It is strategically interesting but premature until NEO demonstrates one evidence consumer and settles identifier governance. |

### Non-opportunities at the current evidence level

- **Do not ingest the NEO vault into Oak as an authoritative curriculum source.**
  Oak can learn from it without assuming stewardship of its local content or
  assessment mappings.
- **Do not exchange learner records.** Synthetic records are sufficient for
  every interoperability question currently visible.
- **Do not imply Oak endorsement.** Reference resolution or technical support
  does not validate NEO's curriculum, mastery model, qualification claims, or
  educational outcomes.
- **Do not promise URI stability beyond the ontology's declared release
  status.** Oak Ontology v0.1 explicitly says its structure, URIs, and data are
  subject to change
  ([README lines 55–65](https://github.com/oaknational/oak-curriculum-ontology/blob/c07f4ee7b967a0b55f619401bb000b4ed02e81b6/README.md#L55-L65)).
- **Do not create a bespoke graph endpoint before testing the existing release
  artefacts.** NEO already proves that a Markdown consumer plus local validator
  can achieve something useful without an always-on service.

## 10. Movement 4 — potential mutual-support opportunities

These are discovery proposals, not commitments or an implementation plan. Each
starts with the cheapest reversible probe that could falsify it.

| Candidate | Mutual exchange | Warrant | Falsifier | Cheapest probe |
| --- | --- | --- | --- | --- |
| **1. External-adopter discovery note** | NEO shares its actual authoring workflow, maintenance burden, and support questions; Oak explains release status, provenance, and intended consumption paths. | NEO is already a public consumer with a pinned release and working validation script, matching the adopter class Oak's future brief anticipates. | NEO does not intend to maintain or extend the references, or has no unmet support need. | One structured conversation or public issue using the seven existing references; record needs without promising delivery. |
| **2. Seven-reference semantic review** | NEO supplies the intended meaning of its four KS3 English nodes; Oak supplies ontology structure and identifier provenance. Both gain a small reviewed mapping fixture. | The current validator proves existence but explicitly leaves phase and sub-strand fit open. | Review finds no ambiguity and produces no reusable test or guidance beyond the existing file. | Review all seven mappings against DfE text and Oak taxonomy; publish conclusions without learner data. |
| **3. Release-upgrade rehearsal** | NEO tests its validator against the next Oak release; Oak receives concrete consumer-breakage evidence and migration questions. | NEO pins v0.1.3 precisely because early-release URI change is expected. | The next release has no relevant changes, or NEO will not upgrade. | On the next release, run the existing validator and a URI diff before changing any NEO content. |
| **4. Taxonomy-traversal demand probe** | NEO tests whether Discipline → Strand → SubStrand → ContentDescriptor navigation improves curriculum authoring; Oak gains real evidence for or against promoting its parked taxonomy surface. | NEO currently selects references manually, while Oak's promotion tripwire explicitly awaits an external consumer question that Threads cannot answer. | Raw Turtle, static documentation, or current local tooling already answers the authoring questions cheaply enough. | Choose three real NEO authoring questions and answer them using the release artefact; only prototype a surface if that path is materially poor. |
| **5. Bounded cross-source journey** | Oak supplies a deterministic NC neighbourhood plus separate resource search; NEO supplies one canonical anchor, overlay links, and practitioner evaluation. | A concrete journey could test whether shared identifiers reduce movement between statutory text, NEO curriculum, qualifications, and teaching resources. | It is no clearer or faster than ordinary search, or users interpret discovered Oak resources as formally equivalent to the NEO node. | Prototype one KS3 English journey: complete within a declared NC taxonomy bound, followed by a clearly separate ranked resource-search projection. |
| **6. Minimal evidence-reference profile** | NEO contributes the canonical-overlay-mastery use case; Oak contributes stable public curriculum identifiers and provenance practice. | Portable evidence is NEO's highest-leverage prospective value, and external use is a real test of whether Oak identifiers remain intelligible outside Oak. | NEO has no real evidence consumer, or identifier governance and privacy concerns dominate before the profile is used. | Model one synthetic evidence record containing a NEO canonical ID, optional `natcurric:` reference, overlay ID, mastery, source version, and provenance—no pupil data or platform build. |
| **7. Public mapping export experiment** | NEO exposes a tiny, provenance-rich canonical-to-NC and canonical-to-overlay crosswalk under its own authority; Oak tests whether external mapping examples improve adoption guidance. | The current mappings are trapped in Markdown links, while other adopters could learn from a machine-readable example without Oak adopting the data. | Source licensing, mapping confidence, or granularity is too inconsistent for responsible reuse. | Export three English canonical nodes with explicit relation type, source, confidence, reviewer, and version; assess before scaling. |

### Opportunity ordering

1. **Low-cost now:** external-adopter discovery, semantic review, and the next
   release-upgrade rehearsal. These learn from existing work and create no new
   support promise.
2. **Promote only on observed need:** taxonomy traversal and one bounded
   cross-source journey. NEO could supply the demand evidence currently missing
   from Oak's parked plans.
3. **Later, after a real consumer exists:** the evidence-reference profile and
   any reusable mapping export.

The bounded journey must obey Oak's graph contract: the graph portion is
complete within its declared anchor, depth, node kinds, and edge types; it is
never truncated or top-N sampled. Ranked Oak resource discovery is a separate
list projection, not a partial graph passed off as a neighbourhood. This is the
relevant implication of Oak's
[graph-tool category doctrine](../../docs/architecture/architectural-decisions/195-graph-tools-first-class-tool-category.md).

### Unresolved evidence that could materially change the synthesis

- Whether NEO practitioners use the vault for planning or maintain it mainly as
  a publication surface.
- Whether families or commissioners understand and use the canonical-overlay
  distinction.
- Whether NEO intends to extend `nc_ref` beyond the seven-item exemplar and has
  capacity to maintain mappings across releases.
- Whether Oak wants NEO, or any alternative-provision organisation, as an
  explicit first adopter scenario with a defined support boundary.
- What changes in the next ontology release, particularly to label-derived
  `natcurric:` identifiers.
- Whether NEO can publish assessment mappings with sufficient provenance,
  licensing clarity, and semantic confidence for third-party reuse.
- Whether a synthetic evidence profile is adopted by an actual planning or
  portfolio consumer.

Any of the first four could change the opportunity ordering. Evidence that the
vault is not used operationally would narrow mutual support to publication and
identifier feedback; evidence of repeated practitioner use would strengthen the
case for taxonomy and journey probes.

## 11. Tensions that matter to the proposition

These are not a general defect inventory. They are the points that affect
whether the stated value proposition can hold.

### 11.1 The KS4 rationale needs a more accurate statutory base

The schema says that KS4 has no standalone National Curriculum document and
that canonical KS4 learning is therefore defined by the union of qualification
overlays
([schema lines 182–194](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/tagging-schema.md#L182-L194)).

That premise is too broad. The Department for Education publishes a
[statutory National Curriculum framework for key stages 1–4](https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4)
and specific KS4 programmes of study for
[English](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study),
[mathematics](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study),
and
[science](https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study).
Other KS4 entitlements and subjects have different statutory shapes, and
qualification specifications do add necessary detail, but the canonical spine
should not be described as arising solely from the union of overlays.

This does not invalidate Curriculum × Overlay. A more defensible formulation
would make statutory KS4 programmes and entitlements part of the canonical
base, with qualification overlays extending, interpreting, and assessing that
base. That version actually strengthens the separation of curriculum from
assessment.

### 11.2 The documented taxonomy is richer than the operative metadata model

The schema specifies normative tag families and namespaced outcome IDs. The
corpus mostly uses custom scalar frontmatter and file paths instead. Quartz's
visible tag system therefore does not currently operationalise the documented
taxonomy for outcome nodes, and the namespaced outcome examples are not an
enforced identity layer.

The current graph works through folders and links. Calling it a curriculum
knowledge graph is directionally fair; treating it as a validated semantic
model would overstate its present mechanics.

### 11.3 The evidence proposition has no public end-to-end consumer yet

The intended portfolio flow is compelling because it is where the same
curriculum model would produce value for learners and commissioners. At
present, it is described in the schema rather than demonstrated across a
planning tool, assignment, evidence record, and exported view.

Until one complete consumer path exists, the vault's proven value is primarily
editorial, navigational, and conceptual.

### 11.4 Mastery is both central and under-instantiated

Mastery is the bridge between an outcome and evidence of learning, yet only a
minority of canonical nodes currently contain the complete four-level set.
There is also a provenance tension: the schema says the four-level scale is
lifted unchanged from §5 of the public Teaching and Learning Policy, while the
published policy's §5 describes assessment principles and contains no such
four-level scale. The scale may have another valid source, but that source is
not established by the public documents reviewed here.

### 11.5 Interoperability currently proves existence, not semantic fit

The `nc_ref` validator checks whether identifiers exist in pinned Oak data. It
does not determine whether a selected identifier is the right phase,
granularity, or semantic match. The extension acknowledges this limitation in
its own exemplar
([lines 57–80](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/nc-ref-extension.md#L57-L80)).

The implementation is therefore a sound existence-checking proof of concept,
with semantic review still a human responsibility.

## 12. Warrants and falsifiers

The proposition depends on several claims that can be tested.

| Warrant | What supports it now | What would falsify or materially weaken it |
| --- | --- | --- |
| Canonical learning is stable enough to anchor multiple assessment regimes. | The same English nodes already receive links from IGCSE, GCSE, and Functional Skills overlays. | Mappings repeatedly require canonical nodes so vague that they lose educational meaning, or so board-specific that they reproduce the overlays. |
| A graph reduces duplication and improves pathway movement. | Shared canonical nodes and cross-overlay navigation exist in the corpus. | Practitioners continue to plan from separate specification documents because the canonical layer is less useful or less current. |
| One model can serve several audiences. | The live site already exposes curriculum, overlay, pathway, and need entry points. | Audience research shows that the shared model obscures rather than clarifies, or that each audience requires materially different content rather than different views. |
| Metadata can preserve meaning as evidence moves between systems. | The schema defines coherent canonical-overlay-mastery triples. | No planning, evidence, or reporting consumer adopts the identifiers, or identifiers drift faster than evidence can remain interpretable. |
| External identifiers can add interoperability without forcing RDF authoring. | The four-page Oak exemplar validates seven references while retaining Markdown authoring. | Identifier churn, granularity mismatch, or mapping cost exceeds the operational value received by consumers. |
| A broader-than-exam curriculum can remain accountable. | OEAS, PfA, needs, overlay, and mastery dimensions provide candidate traceability. | The branches cannot be governed consistently enough for commissioners or educators to trust what a canonical node means. |

These falsifiers suggest useful evaluation measures without prematurely turning
the concept into an implementation plan: mapping maintenance effort, planning
reuse, pathway-switch cost, identifier stability, evidence-consumer adoption,
and audience comprehension.

## 13. Conditions under which the value proposition becomes durable

The concept does not require every page to be complete before it is useful. It
does require a few invariants to remain true as the corpus grows:

1. **Canonical and overlay meanings remain distinct.** Canonical nodes cannot
   quietly become paraphrased exam objectives, and overlays cannot be detached
   from the learning they assess.
2. **Statutory and source provenance is accurate.** The canonical layer needs
   an explicit source policy for National Curriculum, statutory, consensus,
   and NEO-original content.
3. **Node identity is stable.** File moves and label changes must not silently
   break old evidence or external references.
4. **Mappings are inspectable and governed.** A resolved link is not by itself
   proof of semantic correspondence.
5. **Coverage is measured by capability, not page count.** Outcome depth,
   evidence guidance, mastery coverage, mappings, and source confidence are
   more informative than the number of Markdown files.
6. **At least one end-to-end evidence flow is demonstrated.** A real planning
   selection, assignment, learner artefact, mastery judgement, and exported
   audience view would test the vault's highest-value claim.
7. **External references remain deliberately narrow.** The `nc_ref` approach
   is valuable precisely because it references the National Curriculum where
   correspondence is genuine and does not force NEO-original learning into an
   external vocabulary.

## 14. Overall assessment

The vault's central idea is coherent, differentiated, and well aligned with
NEO's stated educational intent. Its value lies in a separation that many
curriculum systems blur: **learning, assessment, evidence, and accountability
are related, but they are not the same thing**.

Mechanically, Markdown, frontmatter, wikilinks, and Quartz are a sensible way
to prototype that idea. They make the graph inspectable, keep authoring costs
low, and allow the content model to grow before a bespoke platform exists. The
public corpus contains enough real links to show that the model can be used,
not merely diagrammed.

The main interpretive caution is to distinguish three altitudes:

- the **educational proposition** is already clear;
- the **editorial graph** is real but uneven; and
- the **portable evidence architecture** remains an intended next system.

If those altitudes are kept explicit, the project can be described without
either understating it as “a website” or overstating it as a finished knowledge
graph and portfolio platform.

For Oak, the proportionate conclusion is similarly bounded. NEO is already a
small but real external consumer of Oak's National Curriculum identifiers. That
makes it potentially valuable to Oak's external-adoption learning loop and to
the demand tests governing taxonomy and cross-source work. It does not create a
case for ingesting NEO's graph, endorsing its mappings, or committing to bespoke
support. The mutual opportunity is to let one real consumer sharpen Oak's
identifiers and adoption model while Oak's open, versioned vocabulary reduces
NEO's cost of maintaining external curriculum anchors.

## Reasoning and metacognitive trace

### Initial frame

The first research pass treated the repository as one part of a wider public
organisation and therefore surfaced governance, publishing, and software
questions. The owner's clarification changed the consequence test: sibling
repositories matter only insofar as they explain the curriculum vault's
purpose or use.

### Reframe

The first analysis was recast around three questions:

1. What is the vault trying to make possible that an ordinary curriculum site
   does not?
2. Which mechanics actually instantiate that proposition?
3. Which claims are implemented, partial, or still expressions of intent?

The second concept-exploration pass introduced a further correction: a
feature-oriented value proposition is not the same as actual value. It applied
the reliability ladder separately to built artefacts, documented service
offers, prospective architecture, and evidenced outcomes, then asked:

1. What does NEO contribute that is distinct from the curriculum and
   qualification sources it cites?
2. Which part of that contribution is publicly delivered now?
3. Where do NEO's and Oak's authority boundaries meet without collapsing?
4. What reversible probes could reveal mutual value before either party makes a
   support or integration commitment?

### Counterinterpretation considered

A sceptical reading is that this is simply an early Markdown website with an
ambitious schema. That reading is partly supported by uneven content depth,
partial mastery coverage, and the lack of a public evidence consumer. It is
not sufficient, because the overlay mappings and precursor net are materially
instantiated and navigable.

The opposite reading—that this is already a curriculum knowledge graph and
portable evidence architecture—is also too strong. Much of the normative
taxonomy is not enforced, and the evidence flow is described rather than
executed.

The partnership-shaped counterinterpretation was also tested: because NEO uses
Oak identifiers, Oak should integrate NEO data or build a bespoke service. That
would climb from a seven-reference observation to an institutional commitment
without demand evidence. Treating NEO as an external adopter first preserves
both organisations' authority and creates cheaper ways to learn.

### Synthesis

The most evidence-conserving interpretation is the maturity statement used in
the executive synthesis: a functioning editorial graph and a strong prototype
of a curriculum-assessment translation layer, with the end-to-end evidence
system still prospective. The corresponding Oak relationship is a consumer
feedback loop first, a possible support relationship second, and an integration
project only if later evidence warrants it.

## Primary public sources

- [NEO Curriculum Vault README at the reviewed commit](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/README.md)
- [Curriculum Vault tagging schema v0.3](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/tagging-schema.md)
- [`nc_ref` schema extension](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/_schema/nc-ref-extension.md)
- [Representative canonical KS4 English node](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/02-curriculum/ks4/english/comprehension.md)
- [Representative Edexcel IGCSE overlay node](https://github.com/nudgeeducation/neo-curriculum-vault/blob/d9786484e676b154e25a65806d70dbd385c017ad/content/03-overlays/edexcel-igcse/english-language-a/ao1.md)
- [NEO Teaching and Learning Policy at the reviewed commit](https://github.com/nudgeeducation/nudge-policy-vault/blob/73d59c491ee42b2e9e4794324aeb78b1e7c4f406/content/neo-only/neo-teaching-and-learning-policy.md)
- [Department for Education: National Curriculum framework for key stages 1–4](https://www.gov.uk/government/publications/national-curriculum-in-england-framework-for-key-stages-1-to-4)
- [Department for Education: English programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-english-programmes-of-study)
- [Department for Education: mathematics programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-mathematics-programmes-of-study/national-curriculum-in-england-mathematics-programmes-of-study)
- [Department for Education: science programmes of study](https://www.gov.uk/government/publications/national-curriculum-in-england-science-programmes-of-study/national-curriculum-in-england-science-programmes-of-study)
- [Oak Curriculum Ontology v0.1.3](https://github.com/oaknational/oak-curriculum-ontology/releases/tag/v0.1.3)
- [Oak Knowledge Graph external-adoption estate](../plans/sector-engagement/knowledge-graph-adoption/README.md)
- [Oak knowledge-graph integration hub](../plans/connecting-oak-resources/knowledge-graph-integration/README.md)
- [Oak graph-tool category doctrine](../../docs/architecture/architectural-decisions/195-graph-tools-first-class-tool-category.md)
