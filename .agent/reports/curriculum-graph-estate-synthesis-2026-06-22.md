---
title: 'Oak''s curriculum graph estate — a cross-effort synthesis'
type: report
status: complete
date: 2026-06-22
author: 'Skipper tracks Reef (claude / claude-opus-4-8[1m] / 87a7bb)'
audience: 'Oak engineering and product leadership; the curriculum, ontology, and Aila teams'
subject: 'What emerges across the Learning Commons Knowledge Graph, the Oak Open Curriculum Ecosystem, the Oak Curriculum Ontology, and aila-atomic-concepts'
---

# Oak's curriculum graph estate — a cross-effort synthesis

## Purpose and scope

This report synthesises four bodies of work that occupy the same conceptual
space — representing curriculum knowledge as graphs — and sets out what emerges
when they are read together. It records both the findings and the reasoning
behind them, including a correction that materially reshaped the analysis
part-way through.

The four bodies are:

1. **The Learning Commons Knowledge Graph** — an external, US-focused education
   knowledge graph (standards, learning components, crosswalks, learning
   progressions, curriculum), reviewed via a deep-dive of its public
   documentation and changelog.
2. **The Oak Open Curriculum Ecosystem** — this repository: the MCP server and
   app, the TypeScript SDK, semantic search, the curriculum graph tools served
   from bulk data, the EEF evidence graph, and the ADR-200 planning idea-graph.
3. **The Oak Curriculum Ontology** (`oak-curriculum-ontology`) — a published,
   W3C-standard semantic ontology (RDF/OWL/SKOS/SHACL) of Oak's curriculum and
   its alignment to the National Curriculum for England (2014).
4. **Atomic Concepts** (`aila-atomic-concepts`) — a technical-viability proof
   that decomposes curriculum statements into the smallest teachable units and
   tests them on prior-knowledge generation and Oak–DfE alignment.

All findings about the four repositories were read first-hand. Claims about the
external Learning Commons product are sourced from its own documentation and are
treated as input-to-verify, not as established fact about that product.

> **A note on certainty.** The strongest claim here — that these are facets of
> one capability — is held as a model with named falsifiers (see
> [Limitations and falsifiers](#limitations-and-falsifiers)), not as a settled
> conclusion. The decision questions in [The decision
> space](#the-decision-space-named-not-made) are named for owners to decide;
> this report does not decide them.

## Executive summary

Four efforts, three of them inside Oak, have independently converged on the same
way of representing curriculum knowledge. They are not a fragmented duplication
to be consolidated into one artefact; they share a single source of truth — the
underlying curriculum data — and sit above it as deliberately diverse
explorations of it. What they have in common is not a graph but a **method**:
representing knowledge as graphs. That method is becoming a transferable Oak
capability, already deployed across curriculum, sector evidence (the EEF graph),
and the way Oak plans and runs its own work.

The most useful framing that emerges is therefore at the level of capability,
not architecture. The durable asset Oak is building is the competence to
represent knowledge as graphs and apply it across domains. Distinct products
built with one capability no more form a single graph than distinct documents
written in one format form a single document.

Two integration points are real and worth pursuing: **at the source** (unifying
the underlying data, with cross-source matching already enabled by the slugs
added to the ontology) and **at the surface** (presenting the combined value in
the MCP app). Between those points, plurality is healthy and intended.

## The four bodies of work

### Learning Commons Knowledge Graph (external)

A US education knowledge graph that has assembled, as one product, a stack Oak
is building in parts: academic standards, granular **learning components** that
decompose standards into teachable skills, **crosswalks** that map state
standards to Common Core using shared-component overlap (a Jaccard score),
learning progressions, and curriculum alignment. It distributes as graph-native
JSONL (`nodes.jsonl` + `relationships.jsonl`), a REST API, and an MCP server,
and its roadmap turns explicitly toward agentic uses.

Its relationship to Oak is **open and parallel**: it is aware of Oak's work, has
access to Oak's materials, and has discussed MCP and graphs with Oak. It is best
read as a peer that arrived at similar solutions to the same problems
independently — mutual validation, not a target to match.

Two of its lessons transfer directly. First, its own documentation warns that
similarity scores (its Jaccard crosswalks) are a useful ranking aid but not an
alignment truth. Second, its changelog is full of the costs of an immature
distribution discipline — version-number inconsistencies, duplicate edges
distorting scores, edge-direction corrections — a concrete checklist for anyone
publishing a versioned graph.

### The Oak Open Curriculum Ecosystem (this repository)

Delivers Oak's curriculum three ways: an MCP app putting Oak inside the AI
assistants teachers already use; engineering tools for the wider ecosystem (a
typed SDK, semantic search, curriculum graph tools); and an openly documented
agent-first engineering Practice. Its curriculum graph tools — prior knowledge,
misconceptions, keywords, thread progressions — are derived from Oak's bulk
curriculum data and served live. It also hosts the EEF evidence graph (cross-
source curriculum-to-evidence work, already shipped) and, separately, the
ADR-200 **intent idea-graph** for Oak's own planning estate.

### The Oak Curriculum Ontology

A formal, published, W3C-standard semantic representation: 26 OWL classes, 40+
properties, 26 SHACL validation shapes, 12 subjects, aligned to the National
Curriculum (2014), under the Open Government Licence. It models programme
structure (programme, unit, unit variant, lesson, sequencing, optionality) and a
SKOS knowledge taxonomy (discipline, strand, sub-strand, content descriptor,
sub-content descriptor), and it already carries the misconception, keyword,
prior-knowledge-requirement, and thread classes. It distributes to multiple
targets — RDF (four formats), property-graph JSONL, relational (Postgres and
SQLite), and Neo4j — and its roadmap heads toward a public SPARQL endpoint,
learning-resource integration, and AI positioning.

### Atomic Concepts

A technical-viability proof that decomposes curriculum-authored statements (Oak
Key Learning Points and DfE Content Descriptors) into **atomic items** — the
smallest independently meaningful units, each one of fact, concept,
misconception, or skill. It gives each item a deterministic, graph-ready
identity (an entity identity over normalised text, type, subject, and key stage;
an occurrence identity adding provenance) and tests two applications: generating
prior knowledge for the next unit, and Oak–DfE alignment with a graded
human-in-the-loop triage workflow. Its findings are honest and instructive:
generated prior knowledge is genuinely useful; embedding-similarity metrics do
not correlate with human judgement; lower key stages fail structurally because
prior knowledge draws from several earlier units, not one. Its stated goal is
for atomic items to become the **building blocks** of the ontology and of other
Oak curriculum systems.

## What converges (mechanism)

### One granularity ladder

Laid side by side, the four data models occupy a single vertical axis of
granularity:

| Grain | Ontology | Atomic Concepts | Learning Commons |
| --- | --- | --- | --- |
| Subject / discipline | `Discipline` | subject facet | framework |
| Strand / sub-strand | `Strand` / `SubStrand` | scoping | strand |
| Programme / unit / lesson | `Programme`→`Lesson` | unit pairs | curriculum |
| Statement | `ContentDescriptor` | KLP / DfE descriptor | standard |
| Atomic | *(absent today)* | **atomic item** | **learning component** |

The atomic layer is where the knowledge-graph efforts converge as the finest
unit — and it is the layer the published ontology does not yet have. Atomic
Concepts decomposes a content descriptor or key learning point into one or more
atomic items, so its grain sits strictly below the ontology's leaf. This is
exactly the seam the two are meant to join, and it is what "atomic items as the
building blocks of the ontology" describes.

### One identity philosophy

Four independent designs reached the same conclusion: the durable thing is the
meaning; location and wording are provenance.

- The ontology uses persistent `w3id.org` URIs over SKOS concepts.
- Atomic Concepts splits a deterministic entity identity from an occurrence
  identity (its ADR-0002).
- Learning Commons uses UUID join-keys and external interoperable identifiers.
- ADR-200's planning graph treats ideas as the fundamental node and documents as
  co-equal embodiments.

No coordination produced this. Convergent evolution toward the same identity
split is the strongest evidence in this report that the abstraction is sound.

### One distribution shape

Learning Commons and the ontology both publish node/relationship property-graph
JSONL alongside other formats; the ecosystem serves graph tools over bulk data.
All three arrive at "one authoritative source, many distribution shapes, an
agent surface on top."

### Alignment as a three-way plurality

"Map our content to an external standard" is performed three different ways:
hand-curated edges (the ontology's National Curriculum links), a graded LLM
judgement (Atomic Concepts' Oak–DfE alignment), and deterministic set-overlap
(Learning Commons' Jaccard crosswalks). These are three complementary lenses
with different trust-and-coverage trade-offs, not a fork demanding a single
winner.

## The correction that reshaped the analysis

An earlier draft of this synthesis repeatedly reached for unification — a single
identity spine, a missing single source of truth, a latent single system. That
framing was wrong, and correcting it is itself a finding.

Oak's curriculum estate already has its single source of truth: **the underlying
curriculum data**. The several graphs above it are deliberately plural
derivations of that one source. That is **diversity, not divergence**. Two
representations of the same misconception or prior-knowledge fact — one in the
hand-curated ontology, one in the bulk-derived graph tools — are not a drift to
reconcile; they are different explorations of a shared source, each useful on its
own, and able to complement as readily as compete. Cross-source matching is
already engineered for, not missing: slugs were added to the ontology
specifically so sources can be matched, in service of presenting combined value,
not collapsing graphs into one.

The deeper correction is a category one. "These efforts all use graphs" is
evidence of a shared **method**, not a latent single **artefact**. There is no
one graph; there is the approach of using graphs — exactly as many documents
written in one plain-text format are not one document, and a shared graph engine
is shared tooling, not a merged graph. Oak may use graphs for planning,
governance, operations, and curriculum knowledge, and they may share concepts,
without any of that implying a single graph.

## What emerges

### Capability, not artefact

The highest-altitude finding is that the durable asset is a capability. What Oak
is growing is the competence to represent knowledge as graphs and deploy it
across domains — curriculum, sector evidence (the EEF graph, already shipped),
AI-enhanced development, and the way Oak runs its own work. The asset is the way
of working, and it travels to the next problem. This capability needs no
unification to be real, and it is the honest unit of value across all four
efforts.

### A source-and-surface shape, plural in the middle

The efforts come together at two points: at the **source** (work to unify the
underlying data, with slug-based matching already enabling it) and at the
**surface** (the MCP app, where each can be surfaced to provide combined value).
Between those points, diverse exploration is healthy and intended.

### Curated and generated graphs are complementary

The hand-curated, high-trust ontology and the AI-generated atomic and bulk-
derived graphs are not in tension; they learn from each other. Machine
extraction proposes candidate atoms and coverage; human curation approves them
into the governed ontology; the ontology's structure constrains and validates
further extraction. "Atomic items as the building blocks of the ontology" is the
concrete expression of this loop.

### Where epistemic trust is actually made

Across Atomic Concepts and Learning Commons alike, the move from machine-
generated structure to a trustworthy curriculum claim runs through a deliberate
review layer — candidate versus approved judgement, exploratory versus validated
output, Subject Lead triage, attribution preservation. This layer, not the graph
itself, is where credibility is manufactured, and it is currently the least-built
and most-scattered facet across the efforts.

## The decision space (named, not made)

Product, feature, and organisational shaping are owners' decisions. The questions
that emerge, for owners to weigh:

1. Which alignment lens (curated, LLM-judged, set-overlap) is used where, and
   with what trust model.
2. How the atomic layer becomes the building blocks of the ontology in practice.
3. Whether, and how, the data-source unification and the MCP-app surfacing are
   resourced as deliberate integration work rather than incidental overlap.
4. Whether bringing the efforts under one team for a focused period would turn
   parallel exploration into compounding capability (argued separately in the
   leadership brief).

## Limitations and falsifiers

- **"One capability" is a model, not a proof.** It would weaken if the efforts'
  grains and trust models proved genuinely incompatible rather than merely
  distinct. The cheapest test is to match one subject's identifiers across the
  ontology, the bulk data, and the atomic layer and confirm a clean join.
- **The ontology as a source-of-truth backbone is a candidacy, not a fact.** Its
  maturity and open licensing suggest the role; this report did not verify that
  its hand-curated data is complete or current enough to be canonical, nor that
  the teams intend it as such.
- **Learning Commons claims are second-hand.** They are sourced from that
  product's documentation and should be re-verified before any become
  load-bearing for an Oak decision.
- **The ADR-200 planning graph is deliberately not merged into the curriculum
  picture.** It shares the method and possibly the engine; treating it as part of
  one curriculum system would repeat the category error this report corrects.

## Sources

- Learning Commons Knowledge Graph deep-dive research
  (`.agent/research/wider-ecosystem/learning-commons-kg-agent-tools.md`).
- The Oak Open Curriculum Ecosystem repository (this repo): VISION, strategy
  corpus, MCP graph tools, the EEF evidence graph, and ADR-200.
- The Oak Curriculum Ontology repository (`oak-curriculum-ontology`): the
  ontology and constraints TTL, distribution scripts, and README.
- The Atomic Concepts repository (`aila-atomic-concepts`): its domain context,
  data model, ADRs, alignment package, and findings report.
