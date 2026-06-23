---
title: 'Knowledge as a graph, at two altitudes — repo intent and curriculum domain as one capability'
type: report
status: initial-research
stage: 'Initial landscape research — input to a future engineer''s exploration brief; decides nothing.'
date: 2026-06-23
author: 'Perseus lifts Umbra (claude-code / claude-opus-4-8[1m] / 5af536)'
audience: 'Oak engineering and product leadership; the strategy/plan-estate, curriculum, ontology, and Aila efforts'
subject: 'The single knowledge-as-graph capability seen at two altitudes — the repo''s own intent (ADR-200) and the curriculum domain (the graph-of-graphs) — the missing content-structure graph and renderers-as-projections, the cross-graph realisation edges, and identity-join as a decided thing'
thread: strategy-and-plan-estate-holistic-review
related:
  - docs/architecture/architectural-decisions/200-intent-as-a-living-idea-graph.md
  - docs/architecture/architectural-decisions/201-external-systems-evidence-integration.md
  - .agent/reports/curriculum-graph-estate-synthesis-2026-06-22.md
---

# Knowledge as a graph, at two altitudes

> **Status: initial landscape research.** This is research and understanding of the terrain —
> **not a design, a plan, or a build commitment.** An engineer is joining the project and will
> bring their own exploration brief for these features; this report is **input to that brief**.
> It maps the landscape, names the opportunities and the decisions, and grounds them in
> first-hand evidence — but it **decides none of them**. Every "decision," "recommendation," or
> "resolution" below is a *candidate for the brief to weigh*, owned by the owner and the
> incoming engineer, not a settled call.

## Purpose and scope

This report records the broad shape of a reflection held across two prompts: that
Oak's planning-substrate work (ADR-200) and Oak's curriculum graph estate are **not
two topics but one architectural stance seen at two altitudes** — the repository's
*own intent* and the curriculum *domain's knowledge*, both represented as graphs,
both over the same engine, both under the same doctrine. It captures the
first-hand findings that ground the reflection (including two corrections to
second-hand inputs), the unifying pattern, the genuinely missing pieces, and the
decisions this names for owners. It is a **broad-shape** record by intent: enough
structure to think and explore from, not a closed design.

It does not decide product or feature scope (the owner's). It names decisions and
holds its strongest claim as a model with falsifiers.

## The central thesis

There is one durable asset across all of this: **the capability to represent
knowledge as a graph and project it into the artefacts humans and agents actually
use.** The same three-part pattern recurs wherever the capability is applied:

| Authoritative graph (the knowledge) | Human/usable artefact | The projection layer |
| --- | --- | --- |
| idea-graph — the repo's intent (ADR-200) | vision / strategy / stream / thread / plan documents | a document is a *curated traversal* of the graph |
| curriculum corpus — bulk-derived graph tools | MCP tool responses | a *thin deterministic formatter* (ADR-191/195) |
| **content-structure graph — _missing today_** | **worksheet · presentation · digital quiz · web page · printable** | **a renderer is a *projection* of the content graph** |

`renderers : content-graph` is the exact analogue of `documents : idea-graph` and
`graph-tools : curriculum-corpus`. The doctrine already written for the third row —
*the intelligence lives in the corpus; the surface is a thin formatter; a
projection that cannot ride the edges is its own real operation; completeness
within a declared bound is integrity* (`working-with-graphs`, ADR-191, ADR-195) —
transfers wholesale to the other two. This is the resonance the reflection
surfaced: the graph is authoritative; the usable artefact is a rendering of it; the
projection layer is thin.

## Part 1 — the repo's intent as a graph (the planning substrate)

ADR-200 already commits the foundational move: **ideas are the fundamental unit of
intent; vision/strategy/stream/thread/plan are projections** ("curated traversals
of a region of the graph, at an altitude"). The idea-graph is the authoritative,
machine-readable source of truth (JSON-LD validated by JSON Schema, a domain
instance over `graph-core`); the documents are its co-equal human-navigable
embodiment, joined by frontmatter typed edges.

### The persistence-after-completion insight

A completed plan's ideas do not vanish. They persist by being **realised** — in the
codebase, in the Practice (ADRs/PDRs/doctrine), and in the product. This is what
makes the idea-graph a *knowledge* substrate rather than a planning tool that gets
consumed: a "plan" is a lifecycle *state* of ideas, not their container. When a plan
completes, the idea's `status` advances (harvested → analysed → homed) and its
realisation migrates from a plan document to durable substrate. ADR-200 §5 already
carries `status` and a `home` (the *document* that expresses an idea). What it does
not yet carry is the edge that captures *realisation* rather than *expression*.

### The missing edges (recorded in ADR-200 this session)

The idea-graph's current edge set (`part_of` / `refines` / `depends_on` /
`tension_with` / `duplicates` / `supersedes` / `serves`) is **intra-intent** — idea
to idea, idea to strategic choice. The missing edges are **realisation edges** that
leave the idea-graph and point at the substrate where an idea became real:

- `realised_by` / `embodied_in` — an idea → the code module, ADR/PDR, doctrine
  surface, doc, or product capability that realises it. Distinct from `home`
  (`home` is the document that *expresses* the idea; `realised_by` is where the idea
  *became real*).

These are the edges that make "where did this idea end up?" answerable, and they are
the internal counterpart to ADR-201's external evidence edges (`evidence` /
`validated_by` / `realized_by`): repo intent projects outward; the realisation
reports back. Recorded in ADR-200 §5 and §Future state (owner-directed, 2026-06-23).

### The necessity: repo self-knowledge becomes the idea-graph family

ADR-200 §Future state already names a *family* of repo knowledge-graphs (code,
operations, standards, governance) over one substrate, as an ambition. The
reflection sharpens ambition into **necessity**: the realisation edges above need
*resolvable targets*, and those targets — the ADRs, the documentation, the code, all
knowledge *about the repo* — are themselves knowledge-about-the-repo. So the ADRs and
documentation will **necessarily** become part of the idea-graph, either absorbed
into it or as **connected idea-graph instances**, because an edge needs a node at its
end. You cannot have `idea —realised_by→ ADR-200` as a live, validated edge unless
ADR-200 is (or projects to) a node in a graph the validator can resolve. The
family-of-graphs is therefore not optional polish; it is entailed by taking the
realisation edges seriously. Recorded in ADR-200 §Future state (owner-directed,
2026-06-23).

## Part 2 — the curriculum domain as a graph-of-graphs

The cross-effort synthesis (`curriculum-graph-estate-synthesis-2026-06-22.md`)
already made the hard category-correction here, and it stands: the curriculum
efforts are **one capability deployed plurally over one shared source** (the
underlying curriculum data), not fragments to merge. "Diversity, not divergence."
The graph-of-graphs framing must **not** undo this: what unifies the estate is one
capability, one substrate, and one identity convention — **not** one merged
artefact.

### The estate as it stands (verified first-hand)

- **The ontology** (`oak-curriculum-ontology`): a curated, W3C-standard semantic
  representation of curriculum **macrostructure** (Programme → Unit → UnitVariant →
  Lesson, sequencing) and a SKOS knowledge taxonomy (Discipline → Strand → SubStrand
  → ContentDescriptor), plus Keyword / Misconception / KeyLearningPoint /
  PriorKnowledgeRequirement / Thread classes. Identity is persistent `w3id.org`
  URIs. **It stops at the lesson as a leaf** — there is no class for a quiz,
  question, worksheet, image, slide, or flashcard. Confirmed first-hand against the
  ontology TTL.
- **The bulk-derived graph tools** (this repo): prior-knowledge, misconception,
  keyword, and thread-progression graphs, served live from bulk curriculum data via
  a thin formatter (ADR-191/195). The **generated** counterpart to the ontology's
  **curated** graph — complementary, not in tension.
- **The EEF evidence graph** (this repo): pedagogical-approach evidence, the
  sector-evidence facet of the same capability, already shipped.
- **Atomic Concepts** (`aila-atomic-concepts`): the finest grain — decomposes KLPs
  and DfE content descriptors into atomic items typed `fact | concept | misconception
  | skill`. This is the **pedagogical intent/impact** layer. Identity is a verified
  two-level split: `entity_id = hash(normalised text + type + subject + key_stage)`
  and `occurrence_id = hash(entity_id + source_sentence + component + lesson_id +
  parent_klp)` — meaning is the durable thing; location and wording are provenance.
  Graph-ready (deterministic ids) but does not yet emit a graph format.

### The genuinely missing piece — a content-structure graph

Oak has the **meaning** (atomic concepts), the **macrostructure** (ontology and
bulk graphs), and the **evidence** (EEF). What it lacks is a graph of the **forms**
— the structure by which meaning is *conveyed*: questions, images, key learning
points as structured content, tables, flashcards, comprehension texts, slides. The
gap is real but **not a uniform void**:

- **Questions are already typed — twice.** `oak-openapi` models four question types
  (`multiple-choice` / `short-answer` / `match` / `order`) with distractor flags and
  structured image content (url/width/height/alt/attribution); Aila models the same
  four in its quiz schema. Verified first-hand in both repos.
- **Assets exist — as opaque files.** `oak-openapi` enumerates nine asset types
  (`slideDeck` / `worksheet` / `video` / quizzes / supplementary) as **download
  references** (PDF · PPTX · ODP). The *structure inside* a worksheet or a deck is
  not modelled. Verified first-hand.
- **Renderers exist — coupled to Aila.** Aila's `packages/exports` renders a lesson
  into Google Slides / Docs / PDF, with **per-question-type** quiz table generators
  (`multipleChoice` / `matchingPairs` / `ordering` / `shortAnswer`). Verified
  first-hand by listing the package.

So the precise gap is a **unifying, typed, graph-shaped** model of content structure
that (a) covers *all* block types uniformly, not just questions; (b) is *shared*
rather than re-modelled in every repo (today oak-openapi, Aila, and the moderation
service each model content separately, and the moderation service ingests whole-
lesson free text with no shared content schema — verified first-hand); and (c)
*links out* to intent (atomic `entity_id`s) and macrostructure (lesson/unit slugs).

### Renderers as projections, not exporters

Aila's exporters prove the rendering idea but are coupled three ways:
lesson-schema-specific (not content-graph-general), Google-Suite-bound, and
generation-time (not a reusable projection layer). The content-structure graph is
what would turn "one authored content, many renderings" from an Aila feature into an
Oak capability: a worksheet, a digital quiz, a slide deck, a printable, and a web
page become *different projections of one complete content graph* — exactly as
documents are projections of the idea-graph and tool responses are formattings of
the curriculum corpus.

### Identity-join is a decided thing, not a hoped-for one

The cross-graph edges the reflection cares about — *a specific quiz instance →
assesses → a learning outcome, which is an instance of one or more atomic concepts;
that quiz → part of → a lesson → evidenced by → an EEF approach* — only work if both
ends have resolvable identity. The worked precedent is the owner's own decision: the
`curric:slug` was **added to the ontology by owner decision specifically to enable
joins between the two datasets** (the ontology and the published curriculum data).
The pattern is not "hope the ids line up"; it is "decide the join key," as was done
once. The open work for the content-structure graph and the atomic layer is to make
the *same kind of deliberate identity-join decision* for their edges out:

- the content node's own identity (a type/instance split mirroring atomic's
  entity/occurrence — the *general quiz shape* is the type/schema; the *specific
  quiz* is a node with occurrence-style identity that links out);
- how a content node references an atomic `entity_id` (intent) and a lesson slug
  (macrostructure).

### The instance/type distinction is load-bearing

The reflection's "a specific instance of a quiz rather than a general quiz shape"
is the same split appearing for a fourth time: atomic's entity/occurrence,
ADR-200's class/node, the ontology's class/individual, and now content's
type/instance. This convergence (four independent designs reaching the same identity
philosophy) is the synthesis report's strongest evidence that the abstraction is
sound — and it should govern content-structure too.

## The one fabric — how Part 1 and Part 2 join

Held as a model with its falsifier: the repository represents **its own intent** as
a graph (Part 1) and **its domain's knowledge** as a graph (Part 2), on the same
engine (`graph-core`), under the same doctrine, joined by **realisation/evidence
edges**. The idea-graph's `realised_by` edges eventually point at product
capabilities that are themselves nodes in the curriculum graph-of-graphs. The day
those two ends are joined is the day the repo can answer "did this idea deliver
value?" *structurally* rather than rhetorically — which is exactly the full-value
milestone ADR-200/201 reach toward, now seen to extend all the way out to curriculum
content. Internal-intent at one end, external-curriculum at the other, one
interlinked knowledge fabric over one substrate.

## First-hand findings ledger (and the corrections)

Every load-bearing claim below was read in source, not taken from a sub-agent.

1. `oak-openapi` questions: four typed question types with distractor flags and
   image content — **rich, typed** (`src/lib/handlers/questions/types.ts`).
2. `oak-openapi` assets: nine asset types as opaque download references (PDF/PPTX/
   ODP); inner structure not modelled (`src/lib/handlers/assets/types.ts`).
3. `oak-curriculum-ontology`: no content classes below the lesson; lesson is a leaf
   (ontology TTL).
4. Aila renderers: real `packages/exports` with per-question-type quiz generators
   (listed first-hand).
5. Atomic identity: entity/occurrence split, verified in `schemas.py`.
6. **Correction — the slug.** A sub-agent read the ontology's `rdfs:comment` ("a
   URL-safe identifier … for public-facing URLs") and I initially concluded the
   slug's *designed intent* was URL-routing only, with cross-source matching merely
   emergent — "correcting" the synthesis report. **The owner corrected this: the
   slug was added by owner decision specifically to enable joins between the two
   datasets.** Designed intent, not emergent. This *strengthens* Part 2: identity-
   join is deliberately engineered into the estate.

## The metacognition lesson

The slug error is worth conserving because of *how* it happened. An artefact
annotation (`rdfs:comment`) documents what a field **is to a consumer**, not the
**decision rationale** for adding it. Rationale lives with the decision-maker. I used
a weak source (a consumer-facing annotation) to overrule a stronger inference, and
the pull that let me do it was that "emergent, not designed" was *convenient* for the
narrative I was building — exactly the case where grounding must be strictest. When
an artefact comment and a report conflict on *rationale*, the correct move is to mark
it as owner-held knowledge and surface it as a question, not to resolve it in the
convenient direction. (Captured to per-user memory as a feedback lesson.)

## Decisions this names (owners' to make — named, not made)

1. **Where the content-structure graph lives, and what it references out to.** It is
   the largest missing member and the most cross-repo-entangled (oak-openapi
   content, Aila content + renderers, moderation input). Not separable from the open
   single-team question (repo-continuity §Open Owner-Decision Items #7).
2. **Renderers as a shared projection layer vs. per-product exporters.** Whether to
   generalise Aila's `packages/exports` into a content-graph projection layer. The
   doctrine (ADR-191/195, `working-with-graphs`) already prescribes the shape if it
   is generalised.
3. **Prove the content-graph ↔ atomic ↔ curriculum join on a thin vertical slice
   first** — mirroring ADR-200 §Sequence-5. One subject, one lesson: atomic
   `entity_id`s ← content nodes (a quiz, its questions, an image, the KLPs) → lesson
   slug, then render that slice three ways. The cheapest probe that confirms or
   falsifies the whole "one capability, joinable by identity" model.

## Highest-leverage non-obvious move

The content-structure graph is also where the synthesis report's "where epistemic
trust is made" finding lands — the candidate-vs-approved review layer it calls "the
least-built and most-scattered facet." A typed content graph carrying provenance and
a `class` (`generated` vs `curated`, mirroring ADR-200's idea `class` and atomic's
candidate/approved) is where that trust layer would live, across content, intent,
and macrostructure at once.

## Adaptation as the proof-case — enhancements a content-structure graph would enable

A live first-hand exploration of Aila (the Oak AI lesson assistant) makes this whole
thesis concrete and demonstrable. The experiment: generate a KS3 maths lesson **based
on** the real Oak lesson `calculating-the-mean`, once as-is and once with the request
*"use football as the context for all examples and questions"*, then read both against
the canonical Oak lesson pulled from the Oak API. Full transcripts of both generations
and the canonical ground truth are preserved with this report's working notes.

**What Aila already does impressively** (the hard part, and the foundation everything
below builds on): from a single sentence it produces a complete, coherent, well-formed
lesson — outcome, learning cycles, prior knowledge, key learning points, misconceptions,
keywords, a starter and exit quiz, and three fully-explained learning cycles with slide
detail, practice and feedback. It grounds generation in a real Oak lesson via "based
on". And when asked to adapt to football, it applies that context **consistently and
coherently across every section** — outcome, cycles, worked examples, and both quizzes —
which is genuinely difficult and well executed. It even enriches pedagogically (bringing
in consistency/variability when comparing teams). This is a strong base capability.

The experiment then shows, vividly, the **enhancements that a content-structure graph
linked to the atomic-concept (intent) graph would unlock on top of that base** — each is
an "a graph of type X enables capability Y" opportunity, not a critique:

| The graph that enables it | The enhancement it unlocks |
| --- | --- |
| Content nodes carrying `assesses → atomic_entity_id` / `realises → learning_outcome` edges back to the source lesson | **Intent-preserving generation.** A generated lesson can inherit the source lesson's pedagogical DNA — its specific sub-skills (e.g. *the mean from a frequency table / bar chart / line graph*), its signature misconception, its assessment coverage — as an explicit, author-visible coverage map that "based on" carries forward by construction. |
| Separate **surface** nodes (context, examples) from **intent** nodes (atomic concepts, outcomes) | **Adaptation with a visible preserved core.** "Adapt to football" becomes a rewrite of surface nodes with the intent edges held fixed, so the tool can *show* the teacher a positive confirmation: "learning intent preserved ✓; context changed to football ✓." Adaptation gains a confidence/coverage panel. |
| A `class` facet on content nodes (`from-source` vs `model-enriched`) mirroring ADR-200's idea `class` | **Generative enrichment as a labelled, opt-in addition.** When the model enriches (e.g. introducing consistency/variance when comparing teams), that appears as a new, clearly-marked concept node the author can keep or scope out — turning rich generation into transparent, teacher-controlled scope, and ensuring anything assessed has been taught. |
| **Typed vocabulary slots** in the content schema (mathematical-term vs context-term) | **Theming that enriches examples while keeping the keyword list mathematical** — context flows into worked examples and questions; the keyword taxonomy stays the lesson's critical mathematical vocabulary. |
| **Cross-graph edges** to the EEF evidence graph and to moderation outcomes | **Every lesson carries its evidence and safety provenance** as first-class edges — the integrity dimensions (evidence-backed approach; age-appropriateness) travel with the content, not alongside it. |

The unifying point: the evaluation the Aila team wants — *does an adaptation do what it
set out to do, preserving pedagogical integrity, changing only what was requested* — **is
exactly a preservation predicate over the content↔intent graph** (intent edges identical?
only the requested surface facet changed? any new concept node surfaced for opt-in?).
Today the lesson is generated as prose with no edges to the source lesson's KLPs or
atomic concepts, so that check has nothing to compute against; the graph is precisely
what turns the desired evaluation into something mechanical, teacher-visible, and
guaranteed-by-construction. This is the same pattern as the rest of the report —
renderers are projections of the content graph, documents are projections of the
idea-graph — now shown end-to-end on a real Oak product, and pointing at enhancements
that compound Aila's existing strengths rather than replace them.

### The rendered artefacts confirm it — the renderer is ready; structured content is the gap

A full set of the adapted lesson's resources (lesson plan, slide deck, worksheet, starter
and exit quiz, additional materials; DOCX + PDF) was generated and read first-hand (held
locally, not version-controlled). The renderer layer is **production-grade**: full Oak house
style, a colour-coded slide deck with a question-then-reveal rhythm and per-cycle
explanation → check → practice → feedback, clean pupil- and teacher-facing quiz layouts, and
the football context carried faithfully into every artefact. This is a real, shippable
capability and the bar any graph-native approach should aim to match.

It also shows, concretely, that the **projection layer is already waiting for structured
content**:

- the deck's explanation slides render a framed slot reading **"Insert your image here"** with
  a caption (`football match scores table`, `football teams performance graph`) — the slot and
  its label exist; the structured table/chart to fill it does not;
- the worksheet's tasks say *"using the provided dataset / league table"* with the data absent;
- the additional-materials artefact rendered as an empty shell carrying unresolved template
  tokens (`<<partner>>`, a `Lesson title` running header).

Each is the same signal: a typed content node — `data-table` / `chart` / `dataset`, plus
resolvable metadata nodes — is the missing input the existing renderer would consume.

### Build-vs-reuse — an LTAE reading of Aila's code

The Aila code is available, and this repo chooses long-term architectural excellence at every
decision point, so the reuse question is answered from the code, not from convenience or
existence. Read first-hand:

- **What encodes durable value (carry forward, as concepts/shape):** the **typed question
  model** (`quizV3`'s discriminated union over multiple-choice / short-answer / match / order,
  which independently converges with `oak-openapi`'s `questionZod` — a strong signal for a
  shared content-node shape); the **per-question-type rendering algorithms**
  (`gSuite/docs/quiz/table-generators/*` — layout rules, deterministic shuffle, instruction
  generation, blank handling encode real pedagogical-rendering knowledge); and the
  **pedagogical slide rhythm** (explanation → check → practice → feedback; question-then-reveal).
- **What is structural debt a graph-native repo should not inherit:**
  - **Google-Workspace coupling, top to bottom** — `exportSlidesFullLesson` copies a Google
    Slides template and find/replaces via the Google API; even the per-question render logic
    emits `@googleapis/docs` element structures. A medium-agnostic projection layer
    (web / print / ODP / slides) cannot ride this.
  - **Flatten-to-fixed-named-placeholders** — `lessonSlidesTemplateSchema` is position-numbered
    and shape-locked (`keyword_1..5`, `sq_q3_answer_2`, three `learning_cycle_*`, a
    `learning_cycle_1_image_prompt`). It is a bespoke per-output mapping of a fixed lesson shape
    — the antithesis of a projection over a graph; changing structure means re-authoring
    templates and placeholder maps. This is exactly the brittleness ADR-191 / `working-with-graphs`
    avoids with "a thin formatter over a smart corpus."
  - **Prompt-not-data, document-not-graph content** — images are text prompts, data is described
    not instantiated, and nothing carries edges to atomic-concept intent. This is precisely what
    the content-structure graph replaces, not extends.

None of this is a fault of Aila: it optimised — and delivers — against a different goal (ship
beautiful, coherent lessons into the Google Workspace teachers already use, fast). The
ecosystem repo's goal is different (a graph-native, medium-agnostic, intent-preserving content
substrate with projection-based renderers). **Different goal, different architecture** — naming
that is LTAE, not criticism.

**A candidate LTAE reading of "take what works / take concepts / build fresh / combination"
— for the engineer's brief to weigh, not a settled call — points to a deliberate hybrid:**

- **Adopt (concepts + shape):** the typed question model (align `quizV3` ↔ `oak-openapi` ↔ the
  content-graph question node); the per-question-type rendering algorithms, re-implemented
  medium-agnostically; the pedagogical rhythm.
- **Build fresh (the substrate):** the content-structure graph — typed content-block nodes
  including `data-table` / `chart` / `dataset`, with edges to atomic-concept intent and lesson
  slugs — and a medium-agnostic projection/renderer layer (worksheet / web / print / ODP /
  slides as projections, per ADR-191 / `working-with-graphs`).
- **Do not inherit:** the Google-Workspace lock-in, the fixed-placeholder flattening, and the
  prompt-not-data content model.

This is a named decision for the owner, not a made one; it sits with the open single-team
question (repo-continuity §Open Owner-Decision Items #7) and the renderer-projection decision
already in this report.

## Falsifiers (how this could be wrong)

- **"One capability over one substrate, joinable by shared identity" is a model.**
  It weakens if the identity schemes prove genuinely unreconcilable across graphs
  (cheap test: match one subject's identifiers across ontology, bulk, and atomic and
  confirm a clean join), or if a content-structure graph turns out to need a
  fundamentally different substrate than `graph-core`. Neither is shown false today;
  neither is proven.
- **The graph-of-graphs must not collapse into one graph.** The synthesis report's
  category-correction is the load-bearing guard; re-merging would repeat the error it
  fixed.
- **The realisation-edge necessity assumes the family-of-graphs is built.** If the
  repo's self-knowledge never graph-ifies, `realised_by` edges dangle — which is the
  point: the necessity is *entailment*, and not building the family leaves the edges
  unresolvable.

## Next exploration hooks

This is the broad shape. Open seams to explore from: the content-structure block-type
vocabulary and how a content node references an atomic `entity_id`; the thin-slice
identity-join proof (decision 3, the cheapest probe); the shape of the realisation
edges in ADR-200's evolution tooling; and the relationship between this report's
Part 2 and the open single-team decision.
