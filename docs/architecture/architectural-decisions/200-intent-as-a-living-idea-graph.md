# ADR-200: Intent as a living idea-graph — graph-authoritative, dual human/machine embodiment, frontmatter as the connection

- **Status:** Accepted (owner-ratified, 2026-06-22). Open items and in-place resolutions recorded in §Open.
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

## Value — the final state (canonical; the other documents link here, they do not restate)

The repo's intent becomes a **living knowledge-graph of ideas** — the ideas that express what this
repository is for and why — with the human-navigable documents as their co-equal embodiment. This idea
knowledge-graph is the **first** of a family of repo knowledge-graphs (§Future state). This section is the
canonical statement of the value; `VISION.md`, the strategy corpus, and the governing plans link here
rather than restate it.

**Substrate value — what the rewrite itself delivers (the interim completion milestone).** When the idea
knowledge-graph and the rewritten corpus land, the repo's intent is **recoverable** (a human-agent team can
recover what the repo is for, how strategy becomes work, and where durable intent lives, from the records
alone), **drift-free** (documents and graph cannot silently diverge — the two drift mechanisms, §8),
**traceable** (every plan traces to a strategic choice → vision → Oak goal, machine-checked),
**dual-legible** (humans navigate the prose corpus, agents traverse the graph, neither reads the other's
form), and **conserved** (no valuable idea lost — the two-direction no-loss audit, §5; acceptance in
§Goals). **This substrate value is complete and assessable on its own** — it is the milestone that marks
"the substrate work is done," independent of any external-systems integration.

**Full value — substrate plus external evidence.** The substrate then becomes a system that **proves it
delivers value, not just claims it**: self-measuring delivery (the DORA metrics as a property of the
structure), the user-value loop closed, and the FRAME stream's core value (an openly-shared,
self-evidencing agent-first delivery framework). **This full value rests on extracting evidence from the
state of external systems** (GitHub, Linear, Sentry/OpenTelemetry, and others) into the graph as typed
edges — repo intent projects outward, services report back. That integration is a **separate architectural
decision and executable plan** (both named in §Open) and is **not** part of the substrate work; the
substrate value above stands without it.

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
  _Every good/speculative idea must reach a `home`. This home-computation is the **re-expression check**
  only (graph → new corpus); it is **not** the whole no-loss guarantee._

**No-loss is two directional checks plus a bad-pile re-screen (owner-ratified, 2026-06-22),** because the
preserved graph is the harvest's own output and cannot, alone, prove the harvest captured everything:

- **Harvest-recall (existing corpus → idea-graph):** at audit time, re-read the source documents and
  confirm every valuable source span is covered by ≥1 idea-node. The forward `provenance` pointer
  (node → source `file:line`) must be complete/invertible so the audit can enumerate source spans and
  find their nodes. This catches the larger, likelier loss — a valuable idea never extracted
  (source → no node) — to which the home-computation is structurally blind.
- **Re-expression (idea-graph → new corpus):** the `home`-computation above.
- **Bad-pile re-screen:** `class: bad` is the one labelled exit from the no-loss net, so the audit
  independently re-screens the `status: discarded` / `class: bad` set before the old estate is retired
  (the nodes are retained — history-preserving — so this is a cheap query over `status: discarded`).

Independence is **constructed, not asserted**: the audit is run by a **fresh-context reviewer that did not
perform the harvest**, cross-checking re-read sources against the graph — mirroring how the
prose↔frontmatter gate is specified as active-not-passive (§8).

The value vocabulary, the `domain` vocabulary, the edge-type set, and the `scale` granularity are all
`DISCOVERED` (V0-style: structure locked, vocabularies grounded in the corpus — see §Sequence broad-shallow
pass — never authored a priori).

These vocabularies are **living**, not frozen at discovery (§7): the broad-shallow pass closes a **V1**;
the deep harvest is the highest-signal moment for a **V2 reassessment** — it logs where V1 caused friction
(forced-misfit ideas, a missing facet/domain/edge, `scale` failing to distinguish) and additively refines
the vocabularies against the full data — and they evolve thereafter like the rest of the graph. Structure
stays locked; only vocabulary values extend.

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
  **Resolved into a reconciliation workflow (owner-ratified 2026-06-22):** because humans edit prose
  freely, the semantic mechanism is not merely detection — it is an agent workflow (triggered by a skill
  such as `session-handoff` or `plan`) that analyses the human-edited prose, extracts its ideas, matches
  them against the idea-graph, decides per §7's history-preserving evolution ops (edit in place for a minor
  wording fix, supersede for a semantic replacement, or mint a new node), updates the idea-graph and the
  document's frontmatter edges to match the prose, after which the graph resumes as the source of truth.
  This is the human-authoring side of the co-equal embodiment (§2) and actuates §7's "editing flows
  reconcile into the graph"; the match step reuses the de-duplication / same-idea mechanism (§Open).

## Goals (what this architecture serves)

Build and preserve the idea-graph as the primary asset, then project it into a **new, strategy-aligned,
human-navigable plan corpus** (`stream → thread → plan`). The flow: **observe → analyse → understand →
synthesise → write a whole new set of plans aligned with the strategy via the threads.** Acceptance is
outcome-level and co-equal across three axes: (a) **no useful idea lost**, proven by the **two-direction
audit** — harvest-recall (existing corpus → graph, against re-read sources) and re-expression (graph → new
corpus) — plus an independent re-screen of the discarded/`bad` set, run by a fresh-context reviewer (§5,
§8); (b) **per-choice effectiveness** — the corpus effectively implements each strategic
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
rewrite needs; the deterministic frontmatter↔store validator (joins `repo-validators`); the
prose↔frontmatter reconciliation workflow (the active handoff gate, sharpened to a reconciliation
agent-workflow per §8); the harvest pipeline.

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
   frontmatter↔store validator and the semantic prose↔frontmatter review) and evolution operations
   (supersede/redirect AND merge — the n:1 reference-rewrite the harvest and dedup depend on, new over
   `graph-core`'s dataset CRUD). Proceed to the full harvest only once the loop is proven. (Added in review: the
   sequence previously jumped from design straight to the full harvest with no proof — the survey's own
   lesson, placeholders-not-landed, says prove the bridge first.)
6. **Deep harvest** to the schema → the preserved idea-graph (existing thin Pass-1 idea data is enriched,
   not discarded).
7. Analyse the idea-graph → synthesise → **write the new `stream → thread → plan` corpus** → no-loss audit
   against the preserved graph → route permanent knowledge → retire the old estate.

In parallel and unblocked: high-value stream work proceeds as V0 plans (the bridge).

## Scope (the live corpus)

The idea-graph's subject is **Oak's intent _as expressed in this repository_** — not Oak's
organisation-wide intent, which is expressed in other ways and is **not our concern** (owner, 2026-06-22).
Within the repo, the live corpus is everything under `.agent/plans/` after the archive relocation, in
scope for the harvest regardless of file form. The exact count is **re-derived at harvest, not frozen**
(≈573 docs / 294 `*.plan.md` as of 2026-06-22; the corpus shifts additively as new forward-plans land, so
auditing recall against a stale snapshot would itself be a loss path). Out of scope by location only: the
relocated archive (`.agent/plans-old-archive/`, harvested later) and `.cursor/plans/` (Cursor's ephemeral
namespace). No method-doc "non-goal" overrides this; the filesystem boundary is the scope.

## Future state (owner intent; explicitly beyond this work's scope)

The idea knowledge-graph (intent) is the **first** of a family of repo knowledge-graphs, not the only one.
The architecture in this ADR is deliberately generic — the idea knowledge-graph is one domain instance over
`graph-core` — so the same pattern extends, once the idea graph is proven, implemented, and refined, to
further repo knowledge-graphs as each earns its place:

- a **code** knowledge-graph — what the codebase is and how it is structured;
- an **operations** knowledge-graph — how the running systems behave;
- a **standards & compliance** knowledge-graph — the standards the work must meet and its compliance state;
- a **governance** knowledge-graph — how decisions are made and how authority flows;
- and knowledge-graphs for other aspects of repo and product life as each earns one.

The end ambition: **the Practice and its expression through the agentic-engineering frameworks move into a
graph-native form** — the repo as a family of interlinked knowledge-graphs over one substrate. This is
recorded as the owner's desired future state and the direction this architecture is chosen to enable. It is
**out of scope for the current planning-estate rewrite and must not expand it.** The payoff is structural:
building the idea knowledge-graph well on the generic substrate makes the family-of-graphs future a set of
instances rather than a rebuild.

## Open

- **Full-value external-systems integration — separate proposed ADR + executable plan (named here per §Value).**
  The full value (self-measuring delivery; the closed user-value loop) rests on extracting evidence from
  external systems' state (GitHub, Linear, Sentry/OpenTelemetry, …) into the graph as typed edges. This is a
  distinct architectural decision — a **proposed ADR** (capability modes read/summarise/annotate/mutate; the
  direction invariant repo-intent-projects-outward / services-report-back; supervision; **no PII in version
  control**) plus an **executable plan** spelling out the idea-graph ↔ external-evidence relationship. Both
  are now authored — [ADR-201](201-external-systems-evidence-integration.md) (Proposed) and its executable
  plan `.agent/plans/product-development-governance/future/external-evidence-integration.plan.md`. Until they
  are ratified and executed, the substrate value (§Value) is the completion milestone and the full value is
  explicitly downstream.
- **Idea-store physical layout** — JSONSchema-validated JSON is decided; the on-disk shape (one file per
  node vs a consolidated store) and its directory home are a design-step choice that the validator and
  authoring tools depend on.
  **Lens-resolved direction (2026-06-22, L1):** one JSON-LD file per node — history-preserving and
  parallel-edit-safe; a consolidated store is a merge-conflict magnet in the multi-checkout reality. The
  directory home and exact file shape are WS2's call.
- **`graph-core` API + the JSON-LD↔JSONSchema bridge — RESOLVED by first-hand survey (2026-06-22).** The
  graph stack was surveyed first-hand. **Working today:** `graph-core` (RDF term/quad model, `DatasetCore`,
  DataFactory, JSON-LD 1.1 processor expand/compact/frame, RDFC-1.0 canonicalisation, 7-vocab registry, the
  `GraphView<TNode,TEdgeType>` query-interface contract); `graph-ingest`'s `jsonld-compatible`
  (JSON-LD → RDF → `DatasetCore` + source-map) and `turtle` + `source-path` modes; `graph-project`
  (RDF↔property-graph projection + adjacency); `graph-corpus-sdk` as the working domain-instance **model**
  (curriculum/EEF; `eefStrandGraph` is a working `GraphView` instance built via `createGraphView`). **The JSON-LD bridge is therefore landed,
  not open:** idea-nodes are JSON-LD (`@context`/`@id`/`@type`) ingested via `graph-ingest/jsonld-compatible`
  into `graph-core`; the only residual is precise per-`@id` source-pointer resolution (flagged future-scope
  in the impl), needed only for source-`file:line` provenance edges — root-pointer works now. **Reserved
  stubs (`export {}`):** `graph-ingest`'s `strict-jsonld` / `plain-json-tree` / `custom-mapping` /
  `node-edge-list` / `records`. **Genuinely UN-built — the idea-graph's real new work:** the idea-node JSON
  Schema + id-minting + store layout; a **new idea-graph domain SDK** (sibling to `graph-corpus-sdk`); the
  **evolution tooling** (`supersede` / `split` / `merge` / `redirect` with reference-rewrite + history —
  `graph-core` has only dataset CRUD); the frontmatter↔store validator; the harvest pipeline. The idea-graph
  is a **new domain instance over the existing substrate**, parallel to `graph-corpus-sdk` and distinct from
  the curriculum `graph-stack.plan.md` lane.
  **Lens-resolved direction (2026-06-22, L1 + `consolidate-at-third-consumer`):** build the new idea-graph
  SDK as a clean parallel instance that _reuses_ `graph-core`'s generic substrate and owns only idea-domain
  specifics; do **not** extract a shared domain-SDK abstraction across `graph-corpus-sdk` and the idea-graph
  SDK now — the family-of-knowledge-graphs (§Future state) is the future third-consumer trigger for that, not
  this build. `architecture-expert` confirms the boundary at WS2/WS4.
- **Harvest-source breadth — RESOLVED (owner, 2026-06-22).** The harvest ingests `VISION.md` +
  `docs/strategy/` in addition to everything under `.agent/plans/` — the graph spans all altitudes
  (those are the highest-altitude idea-projections) and the no-loss audit is complete end-to-end.
  `VISION.md` + the strategy corpus are **already-authored documents that stand** (tweaks at most); the
  harvest extracts their ideas, it does not re-author them.
- **Authoring model — RESOLVED (owner, 2026-06-22).** The new `stream → thread → plan` corpus is
  **co-authored (human + agent)** — the human owns higher-altitude shaping, agents draft plan-level
  documents from the synthesised ideas. The rewrite is of the **plan** corpus under the standing
  vision/strategy, not of vision/strategy themselves. The strategy's **three streams**
  (`stream-mcp-app` / `stream-engineering-tools` / `stream-agentic-framework`) derive **top-down** from
  vision/strategy and are **already specified** — the new corpus organises `thread → plan` _under_ the given
  streams; it does **not** derive or author streams bottom-up from the plan corpus (owner, 2026-06-22).
- **Idea identity minting** — how stable, IRI-able `id`s are assigned at harvest (slug / content-hash /
  sequential) so they survive re-harvest and map to RDF subject IRIs. Load-bearing for frontmatter
  references and for de-duplication.
  **Lens-resolved direction (2026-06-22, L1):** a stable, opaque, content-decoupled `id` (content-hash
  excluded — it churns on every statement edit; a slug rejected as the _primary_ id — it couples identity to
  mutable text) plus a human-readable label carried as separate metadata; minting is idempotent across
  re-harvest. WS2 fixes the algorithm.
- **De-duplication / merge mechanism** — the same idea recurs across documents; how "same idea" is
  determined and merged (the `duplicates`/`same_as` edge plus a merge operation) is the analysis pass's
  core mechanism, currently undefined.
  **Lens-resolved direction (2026-06-22, L1 + the no-loss invariant):** semantic judgement _proposes_
  merges → a deterministic merge op with reference-rewrite _executes_ → the validator _verifies_ no edge is
  left dangling; conservative, reviewer-confirmed, and history-preserving (a wrong merge silently loses a
  distinct idea — a no-loss breach). WS5 designs the empirical same-idea heuristic.
- **Projection-type schemas** — V0 covers `plan`; vision/strategy/stream/thread/high-level-plan each need
  their frontmatter-edge schema (or a unified projection-node schema). Named in §2, not yet designed.
  **Lens-resolved direction (2026-06-22, L3):** prefer a single unified projection-node schema with a
  `projection_type` discriminator, specialised only where a type genuinely diverges (closed-shape
  optionality), over five parallel schemas. WS5.
- **JSON-LD bridge constraints** (deepening the reconciliation open) — for the JSON store to consume
  cleanly into `graph-core`'s RDF: idea-node JSON carries a `@context`; `id`s are IRI-able; edge fields
  map to RDF predicates; **one** constraint source of truth (JSON Schema at authoring — no divergent
  SHACL/RDFS); closed-world JSON-Schema governs authoring, open-world RDF governs query. **Confirmed
  against the landed `graph-ingest/jsonld-compatible` path (first-hand survey 2026-06-22); the §Sequence-2
  verification is done.**
