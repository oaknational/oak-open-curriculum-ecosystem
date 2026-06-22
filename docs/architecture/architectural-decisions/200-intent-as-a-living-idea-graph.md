# ADR-200: Intent as a living idea-graph — graph-authoritative, dual human/machine embodiment, frontmatter as the connection

- **Status:** Accepted (owner-ratified, 2026-06-22). Two open items noted in §Open.
- **Thread:** `strategy-and-plan-estate-holistic-review`.
- **Supersedes/refines:** sharpens the architecture sketched in `repo-intent-graph.plan.md` and
  `plan-node-schema.v0.md` — those plans become consumers of this decision and cite it, not the reverse
  (reference direction flows toward the more fundamental artefact, PDR-105).
- **Builds on:** `packages/core/graph-core` (generic RDF/JSON-LD graph substrate), V0 plan-node-schema,
  ADR-179 (domain-generic graph-view), the substance re-aim (idea-level curation).

## Context

The planning estate grew organically into ~291 `*.plan.md` plus ~279 adjacent `.md` documents (post
archive-relocation; see §Scope), drifted, form-inconsistent, with ideas duplicated and contradictory
across prose and no canonical source. Oak is moving from "important experiment" to "important product";
the estate must _effectively implement_ the strategy. The decisive reframing this session: **ideas are the
fundamental unit of intent.** Vision, strategy, streams, threads, and plans are not the substance — they
are _projections_ over a graph of ideas. The vision is the highest-altitude expression; the strategy is
the altitude that communicates and aids decisions; streams/threads/plans organise bringing ideas to
reality. We had authored a `plan` node-schema (V0) while the more fundamental node — the idea — had no
schema at all. This effort is a **planning-estate rewrite**, not a survey-and-classify or a refactor: we
harvest every valuable idea from the current estate (raw material), preserve them as a graph, and
re-express them in a wholly new strategy-aligned corpus, losing no valuable idea.

## Decision

### 1. The intent is a graph of ideas; the idea-graph is the authoritative source of truth

The single source of truth for ideas is a machine-readable idea-graph (so it can be analysed,
transformed, projected). Ideas are nodes with typed relationships. "Authoritative" means: when the
question is "what is the canonical set of ideas," the graph answers — and every edit channel must
reconcile back into it. Authoritative does **not** mean static or write-once (see §7).

### 2. Documents are the co-equal, human-navigable embodiment

Vision, strategy, stream, thread, high-level plan, and implementation plan documents are the human
embodiment of the same intent — each a _curated traversal_ of a region of the graph, at an altitude, for
human comprehension (and, for implementation plans, execution). They are **co-equal** with the graph
(dual human/machine legibility, always-both), not lossy by-products. Each document has two layers:

- **Prose** — the human-navigable narrative.
- **Frontmatter** — typed edges into the graph: the ideas, resources, implementation-shapes, and other
  nodes the document is built on. The frontmatter edges form the document-layer graph.

### 3. The connection is the frontmatter; the intent is a layered family of graphs

The frontmatter edges are the machine connection between the human documents and the idea-graph.
Documents therefore have their own graph at the document layer; the intent is a **layered family of
graphs** (idea-layer, plan-layer, higher doc-layers) joined by inter-layer edges (a plan `realises` /
`is-built-on` the ideas it projects).

### 4. The idea-store is JSON validated by a JSON Schema in the repo

Idea-nodes are stored machine-natively as JSON, validated by a JSON Schema committed in the repo. The
format split matches the two audiences: **ideas are JSON (machine-native); documents are markdown (prose
for humans + frontmatter edges referencing idea-node IDs).** Idea-nodes carry stable `id`s (assigned at
harvest) so frontmatter edges can reference them durably.

### 5. The idea-node schema — structure decided, vocabularies discovered

Locked structure (first cut; the JSON Schema is authored after the discovery pass in §Sequence):

- **Identity/shape:** `id` · `statement` (one precise sentence) · `class` (good | speculative | bad) ·
  `domain` (what the idea is about — open vocabulary) · `scale` (a coarse, _tentative_ intrinsic hint;
  see §6).
- **Value facets (sparse):** the value an idea carries (to guide re-expression priority and placement,
  not self-congratulation). The facet _vocabulary_ is discovered, not templated.
- **Relationships (edges):** `part_of` / `composed_of` (composition) · `refines` · `depends_on` ·
  `tension_with` (locked-contradictions are a sub-case) · `duplicates` · `supersedes` · `serves` (→ a
  strategic choice / higher-altitude idea).
- **Provenance & lifecycle:** `provenance` (source doc + `file:line` + harvest pass) · `status`
  (harvested → analysed → homed → superseded/discarded) · `home` (the document that expresses it).
  _Every good/speculative idea must reach a `home` — this, computed against the preserved graph, is the
  no-loss guarantee._

The value vocabulary, the `domain` vocabulary, the edge-type set, and the `scale` granularity are all
`DISCOVERED` (V0-style: structure locked, vocabularies grounded in the corpus — see §Sequence broad-shallow
pass — never authored a priori).

### 6. Altitude is emergent (off the node); scale is a tentative node hint

**Altitude is a property of a projection/view, not of an idea** — the vision is a high-altitude view; the
same idea can surface at several altitudes. The projection-_types_ (vision → strategy → stream → thread →
high-level plan → implementation plan) _are_ the altitude/navigation levels a human walks. **Scale** (the
intrinsic size of an idea) is a coarse hint on the node — captured at harvest, _reconcilable against the
composition edges_ as the graph matures (a denormalised cache, not truth). Scale is tentative: the
discovery pass must prove it distinguishes ideas usefully, else it is dropped and composition carries it.

### 7. The graph is living; it evolves through tooling built on graph-core

Editing flows reconcile into the graph: a prose change may require a frontmatter change, which may entail
an idea change. The graph stays authoritative precisely because the tools reconcile every edit back into
it. The idea-graph is a domain instance over `packages/core/graph-core` (the generic RDF/JSON-LD
substrate — `dataset`/`graph-view`/`canon`/`jsonld`/`term`/`vocab`), mirroring how `graph-corpus-sdk` is
the curriculum instance. Evolution tooling (create / edit / split / merge / supersede / redirect / query /
project / validate) holds three invariants — each matching existing repo doctrine:

- **History-preserving:** ideas are _superseded_, not overwritten (`supersedes`/`superseded_by`); splits
  and merges leave a trail (never-delete-process discipline).
- **Identity-stable & referentially safe:** supersede/split/merge redirects referencing edges; the
  deterministic validator catches any left dangling.
- **Provenance carried through evolution.**

### 8. Two drift mechanisms, each on the right tool

- **Frontmatter ↔ graph correctness is deterministic** → a repo-validator that _recomputes_ whether every
  frontmatter edge resolves to a live node in the store (`validators-must-recompute-not-just-record`,
  `strict-validation-at-boundary`).
- **Frontmatter ↔ prose alignment is semantic** → an agent review, one document at a time, wired as an
  **active gate at authoring and session handoff** ("does this document's prose still match its
  frontmatter?"). It must be an active gate, not passive guidance — passive guidance reliably loses to
  artefact-gravity at the action moment. This is the same drift any metadata+body document already has;
  we name it and give it a cheap recurring check.

## Goals (what this architecture serves)

Build and preserve the idea-graph as the primary asset, then project it into a **new, strategy-aligned,
human-navigable plan corpus** (`stream → thread → plan`). The flow: **observe → analyse → understand →
synthesise → write a whole new set of plans aligned with the strategy via the threads.** Acceptance is
outcome-level and co-equal across three axes: (a) **no useful idea lost**, proven independently against
the preserved graph; (b) **per-choice effectiveness** — the corpus effectively implements each strategic
choice (reviewer-confirmed, effective not merely aligned), every choice served by adequate plans, gaps
closed by authored plans; (c) **human-navigability** — a person can traverse vision → strategy → stream →
thread → plan → implementation and understand the whole intent. Valuable non-plan knowledge discovered en
route is routed to its permanent home (ADRs/PDRs/docs), not lost. The bad is genuinely gone.

## Non-goals and anti-patterns to resist (named because they recurred this session)

The following conservation pulls actively corrupted the framing during this session and a successor MUST
recognise and resist them — they have artefact-gravity and return under context pressure:

- **NOT** a refactor, relabelling, or re-foldering of existing plans. The old structures are retired.
- **NOT** preserving existing plan files/structures/names because they exist (`existence is not
correctness; default-replace`).
- Plan-schema conformance of _old_ plans is **NOT** an objective; classification/measurement for its own
  sake is **NOT** the success test. "Is every valuable idea newly expressed in service of the strategy" is.
- `*.plan.md` is **NOT** the definition of a "real plan" — many older plans use other forms; everything
  under `.agent/plans/` is in scope regardless of file form.
- Scope is sourced from the **principal**, never from agent-authored method docs ("by design" requires
  _whose_ design); the default is **inclusion**; every exclusion is owner-ratified.
- Do **NOT** defer settleable foundational architecture as "downstream"; settle what first principles and
  owner intent determine, now.
- Do **NOT** template vocabularies from arbitrary example lists; discover them from the corpus.
- The graph is **co-equal** with the documents and the documents are **not** mechanically-derived stubs;
  human-navigability is a first-class constraint, not an afterthought.

## Consequences

### Incremental value delivery — V0 plans as the bridge (co-existence without compromising the graph)

We have a vision and a strategy (stable, high-altitude ideas) but no functional plan corpus, and the full
idea-graph is a large build. The full idea-graph **will** be built — that is not in question — but it must
not block other high-value streams, nor may those streams compromise the eventual graph. The bridge: **new
high-value work proceeds now as V0 plans.** V0 is pre-idea-graph but already graph-shaped (frontmatter
typed edges, `serves_strategic_choice`); a V0 plan is forward-compatible — when the idea-graph lands, it
gains idea-node edges _additively_, no rework. V0 plans are the first instances of the new corpus, not
throwaway. The constraint (do not compromise the eventual graph form/function) is honoured because V0 _is_
the plan-layer schema; V0 plans slot into the graph rather than fighting it.

**The boundary (Q3, made explicit).** _Forward, genuinely-new work_ proceeds via V0-bridge plans
(unblocked). _Rewriting the existing estate into the strategy-aligned corpus_ is gated on the idea-graph.
The two cannot conflict: V0-bridge plans are new (they do not touch the old estate being harvested) and
are graph-shaped (they slot in later). The one debt: each V0-bridge plan needs idea-node edges added when
the graph lands — an additive upgrade, not rework — so V0-bridge is scoped to high-value work that
genuinely cannot wait, to bound that backfill, never a licence to author the whole corpus ahead of the
graph. Also: V0-bridge plans must not invent a competing plan-organising taxonomy the graph would have to
fight; they serve strategic choices via frontmatter and nothing more.

### Plan triage framework (applied during the harvest, not pre-judged here)

Every document under `.agent/plans/` is idea-harvested; the _document_ then routes to one of:

- **harvest-then-retire** — its ideas are extracted; the old document is superseded by the new corpus.
- **rewrite** — carries live value but in drifted/misaligned form; re-expressed as a new strategy-aligned
  (V0) plan.
- **archive** — complete/superseded/dead; relocated to `.agent/plans-old-archive/`.
- **scan-for-residue-and-tombstones** — documents edited during recent churn (continuity records, the
  survey docs) may carry residue from the old framing; scanned and cleaned.
- **new-plan** — ideas with no fitting home seed wholly new plans (authored to V0).

### The build (downstream, sequenced in §Sequence)

A JSON Schema for idea-nodes; an idea-graph SDK over `graph-core`; the minimum evolution tooling the
rewrite needs; the deterministic frontmatter↔store validator (joins `repo-validators`); the active
prose↔frontmatter handoff gate; the harvest pipeline.

## Sequence

0. **Relocate archive — DONE** (commit `01a4b10c2`; 585 files → `.agent/plans-old-archive/`; harvested
   later). The `speculative/` directory was renamed into place (from a prior hold-vocabulary name) in the
   same commit.
1. Capture this architecture (this ADR) + ratify the goals (controlling plan).
2. **Verify `graph-core`'s current landed API first-hand** (substrate confirmed present + generic; the
   exact reuse surface for the idea-graph SDK is input-to-verify — the survey itself caught a graph
   adapter that was a placeholder, so do not assume).
3. Lock the idea-node-schema **structure** (vocabularies open); design the projection-type family.
4. **Broad-shallow discovery pass** over the live corpus → ground the value/domain/edge vocabularies and
   whether `scale` earns its place → screen/enhance/normalise → close the V1 vocabularies → author the
   JSON Schema.
5. **Prove the architecture end-to-end on a thin vertical slice BEFORE the full harvest** — harvest a
   handful of ideas from a few documents → store them as JSON-LD idea-nodes in `graph-core` → author one
   new plan that references them by frontmatter edge → exercise both drift mechanisms (the deterministic
   frontmatter↔store validator and the semantic prose↔frontmatter review) and an evolution operation
   (supersede/redirect). Proceed to the full harvest only once the loop is proven. (Added in review: the
   sequence previously jumped from design straight to the full harvest with no proof — the survey's own
   lesson, placeholders-not-landed, says prove the bridge first.)
6. **Deep harvest** to the schema → the preserved idea-graph (existing thin Pass-1 idea data is enriched,
   not discarded).
7. Analyse the idea-graph → synthesise → **write the new `stream → thread → plan` corpus** → no-loss audit
   against the preserved graph → route permanent knowledge → retire the old estate.

In parallel and unblocked: high-value stream work proceeds as V0 plans (the bridge).

## Scope (the live corpus)

Everything under `.agent/plans/` after the archive relocation: **570 documents** (291 `*.plan.md` + 279
other `.md`), all in scope for the harvest regardless of file form. Out of scope by location only: the
relocated archive (`.agent/plans-old-archive/`, harvested later) and `.cursor/plans/` (Cursor's ephemeral
namespace). No method-doc "non-goal" overrides this; the filesystem boundary is the scope.

## Future state (owner intent; explicitly beyond this work's scope)

The intent idea-graph is the **first** knowledge graph, not the only one. The architecture in this ADR is
deliberately generic — the idea-graph is one domain instance over `graph-core` — so the same pattern
extends, once the intent-graph is proven, implemented, and refined, to further knowledge graphs as they
earn their place: a **governance** knowledge graph, an **operations** knowledge graph, and others. The end
ambition: **the Practice and its expression through the agentic-engineering frameworks move into a
graph-native form.** This is recorded as the owner's desired future state and the direction this
architecture is chosen to enable. It is **out of scope for the current planning-estate rewrite and must not
expand it.** The payoff is structural: building the intent-graph well on the generic substrate makes the
family-of-graphs future a set of instances rather than a rebuild.

## Open

- **Idea-store physical layout** — JSONSchema-validated JSON is decided; the on-disk shape (one file per
  node vs a consolidated store) and its directory home are a design-step choice that the validator and
  authoring tools depend on.
- **`graph-core` exact API and gaps** — substrate confirmed (generic RDF/JSON-LD); the precise reuse
  surface and what the idea-graph SDK must add are verified first-hand at SDK-design time (§Sequence 2).
- **JSON-LD vs JSONSchema reconciliation** — `graph-core` is RDF/JSON-LD; the idea-store is decided as
  JSONSchema-validated JSON. How idea-node JSON maps into `graph-core`'s JSON-LD representation (native
  JSON-LD documents vs plain JSON projected to RDF at load) is a design-step choice; the two are not in
  conflict but the bridge must be specified.
- **Harvest-source breadth — RESOLVED (owner, 2026-06-22).** The harvest ingests `VISION.md` +
  `docs/strategy/` in addition to everything under `.agent/plans/` — the graph spans all altitudes
  (those are the highest-altitude idea-projections) and the no-loss audit is complete end-to-end.
- **Idea identity minting** — how stable, IRI-able `id`s are assigned at harvest (slug / content-hash /
  sequential) so they survive re-harvest and map to RDF subject IRIs. Load-bearing for frontmatter
  references and for de-duplication.
- **De-duplication / merge mechanism** — the same idea recurs across documents; how "same idea" is
  determined and merged (the `duplicates`/`same_as` edge plus a merge operation) is the analysis pass's
  core mechanism, currently undefined.
- **Projection-type schemas** — V0 covers `plan`; vision/strategy/stream/thread/high-level-plan each need
  their frontmatter-edge schema (or a unified projection-node schema). Named in §2, not yet designed.
- **JSON-LD bridge constraints** (deepening the reconciliation open) — for the JSON store to consume
  cleanly into `graph-core`'s RDF: idea-node JSON carries a `@context`; `id`s are IRI-able; edge fields
  map to RDF predicates; **one** constraint source of truth (JSON Schema at authoring — no divergent
  SHACL/RDFS); closed-world JSON-Schema governs authoring, open-world RDF governs query. Reasoned,
  pending the §Sequence-2 API verification.
