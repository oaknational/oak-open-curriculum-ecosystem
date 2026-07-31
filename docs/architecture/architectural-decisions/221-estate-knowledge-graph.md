# ADR-221: The Estate Knowledge Graph — Files-Authoritative, Named-Graph Strata, Concept Scheme

## Status

**Accepted** (owner-ratified 2026-07-31, in-session ratification sitting
— card answers at the Director seat; obligations 1–5 executed in the
ratification commit)

**Date**: 2026-07-31

**Refines**: [ADR-200](200-intent-as-a-living-idea-graph.md) (intent as
a living idea-graph) and
[ADR-216](216-plan-node-estate.md) (the plan-node estate). ADR-216
discharged the plan-node schema's promised lane-model reconciliation
and left ADR-200 "deferred, not deleted" — the authority question
open. This record settles it (see §The ADR-200 reconciliation). Its
warrant is owner direction (2026-07-31, in-session: found the
knowledge estate; all repo knowledge in scope; connection to external
systems — Linear, Notion, GitHub, Slack, Sentry, PostHog — part of the
graph; a hard public/operator boundary) plus that open
ADR-200/ADR-216 tension.

**Amends**: [ADR-173](173-graph-stack-topology.md) — activated, not
superseded: topology row 7's `agent-graphs/practice-graph/` occupant
activates as this programme's consumer instance, discharging that
row's second-consumer proof; rows 3–4's `graph-enhance` (stable IRI
minting) and `graph-validate` (schema + SHACL-class constraints)
activate as the general mechanisms this work needs, in their ratified
homes — no duplicate capability homes are created (§1).
[ADR-041](041-workspace-structure-option-a.md) — the `agent-graphs/`
first-occupant note is confirmed; classifying `graph-ingest` and
`graph-project` into its foundation/adapter enumeration is a
ratification-time obligation (§The ADR-200 reconciliation, obligation
4).

**Instantiates**:
[PDR-134](../../../.agent/practice-core/decision-records/PDR-134-knowledge-strata-carriers-and-the-concept-layer.md)
(knowledge strata, carriers, and the concept layer) — the portable
contract; this record is its repo-stratum embodiment.

**Related**: [ADR-179](179-transport-agnostic-graph-substrate.md)
(transport-agnostic graph substrate);
[ADR-157](157-multi-source-open-education-integration.md)
(multi-source open-education integration — the sibling domain on the
same substrate); [ADR-201](201-external-systems-evidence-integration.md) and
[ADR-207](207-dora-delivery-metrics-as-a-structural-property.md) — both build on
ADR-200's graph: their external-evidence direction invariant and
DORA-as-projection substance survive unchanged over the derived graph
decided here, and both re-ground against this record at its
ratification.

## Context

The planning-and-intent lineage (the repo-intent-graph seed plan,
ADR-200, the paused plan-corpus refounding, the 2026-07-21 release
pivot) left a deliberate waypoint: a minimal, validator-enforced plan
estate whose schema is graph-ready; a working RDF substrate built for
the curriculum knowledge graphs; and four conserved planning corpora —
`.agent/plans-backlog-2026-07/` (the pre-pivot estate, conserved
lossless), `.agent/plans-old-archive/` (the archive tier of the
generation before it), `.agent/plans-refounding/` (the paused
refounding programme's working corpus and instruments), and
`.agent/plans-v0-sketch-2026-07-21/` (the dispositioned v0 sketch).
The corpora's file census is re-derived at ledger-open by the
executing plan, never frozen here.

The owner has now directed the next step (2026-07-31, in-session): a
governed knowledge estate covering all repo knowledge — plans,
decisions, lessons, concepts — with incremental migration of the
conserved material, connection to external systems as part of the
graph, and a hard boundary between what is general to the public repo
and what is specific to the Oak instance.

PDR-134 states the portable contract. This record decides how it lands
in this repository.

## Decision

### 1. Substrate reused; mechanisms in their ratified homes; framework and consumer split

The knowledge graph runs on the existing transport-agnostic substrate —
`graph-core` (terms, quads, DatasetCore, JSON-LD 1.1, RDFC-1.0
canonicalisation, vocab registry), `graph-ingest` (gaining one new
ingestion mode: front matter → quads), and `graph-project` (the
RDF-to-property-graph projection and adjacency primitives).

Two general capabilities this work needs are already homed by ADR-173
in substrate workspaces not yet built: **stable IRI minting**
(`graph-enhance`, topology row 3) and **schema plus SHACL-class
constraint validation** (`graph-validate`, row 4). This programme
**activates those workspaces in their ratified homes** — a
pull-forward of ADR-173's sequencing, never a duplicate capability in
the knowledge tier.

The genuinely domain-specific work then splits per
separate-framework-from-consumer:

- **`graph-knowledge-sdk`** (`packages/sdks/`) — the consumer-general
  framework for knowledge estates: the knowledge ontology and
  constraint _content_, evolution operations, the rebuild command, and
  the projections (including every human-facing view). Any Practice
  instance can consume it.
- **`agent-graphs/practice-graph/`** — the Oak instance: this
  repository's corpus wiring, exactly the occupant ADR-173 row 7
  commits and ADR-041 names as the tier's first resident. Activating
  it here discharges row 7's "second-consumer proof" obligation, which
  was otherwise unowned.

**Quads as the data model; no triplestore service.** The atomic unit
throughout is the RDF quad — the triple plus its graph name, and the
graph name is the seam (§4) — so the data model is emphatically
triple-shaped. What is rejected is a store _service_: files are the
database, the in-memory dataset is the query engine, and
canonicalisation gives deterministic diffs so graph changes review
like code. A store server is a scale decision nothing here forecloses.
`graph-core` gains only thin additive combinators for the seam's two
operations — mount (dataset union) and strip (graph-name restriction)
— plus concise-bounded-description extraction with per-node canonical
fingerprints on the existing canon; nothing built requires rework.

### 2. Files authoritative; the graph derived — the recomputability red line

Authored markdown files (reviewed in pull requests) carry content in
prose; their front matter carries identity, type, and edges. One
command rebuilds a home's graph from that home's files,
deterministically. The red line is scoped **per home**: every
statement in the loaded dataset is regenerable from the authored files
of its own home, and **no home's graph may ever hold a statement that
home's files cannot regenerate**. The loaded working dataset is the
union of homes a reader mounts (PDR-134 §1), so the union holds
statements this repository cannot regenerate — but every statement's
authority is some home's authored file, and stores everywhere remain
derived indexes. The moment any home violates this, a second source of
truth exists and the design has failed its own falsifier.

**Asserted-only.** No entailment regime (RDFS or OWL) materialises
inferred statements into any store: the dataset holds what authors
asserted, and inference — where a projection wants it — is computed at
read time and never persisted. This is the red line applied to
reasoning itself, and it keeps constraint validation defined against
exactly the asserted graphs.

### 3. Identity: persistent IRIs, minted not derived

Every node — document, concept, decision — gets a stable IRI minted at
creation and **persisted in the artifact's own front matter**: a
random unique identifier (UUID-class) written once at file creation,
so uniqueness needs no allocation registry, the rebuild reads identity
back from the files, and no mint-state exists outside them (the §2 red
line applied to identity). Identity is never content-derived, so it
survives edits. The ontology namespace is deliberately not
Oak-instance-branded, because any organisation adopting the Practice
should adopt it unchanged; instance IRIs are namespaced per stratum.
Persistent-identifier indirection decouples knowledge identity from
storage location, which is what makes stratum re-homing free. The
pattern is live in the sibling curriculum ontology (verified
first-hand 2026-07-31 against its working copy: base IRI
`https://w3id.org/uk/oak/curriculum/ontology/`); the exact minting
scheme is confirmed against the upstream at a pinned revision before
`graph-knowledge-sdk` lands — a named obligation of that increment.

**Referential stability and version pinning.** A published IRI, once
referenced from any home, resolves forever — supersession chains,
never removal (PDR-134 §2). And each home's graphs declare the
ontology version they conform to (`owl:versionInfo`-class pinning, as
the sibling ontology does), so mount-time validation reads conformance
per home rather than assuming one global schema moment.

### 4. The seam: named graphs, homes, and the direction law

The quad's graph name is the privacy and generality seam. Graphs are
homed per PDR-134's four strata: ontology and Practice-stratum graphs
in portable locations, repo-stratum graphs in this repository, operator
overlays in private homes mounted at load time. The direction law binds
every edge; a repo-stratum statement may carry an opaque external name
(`linear:MCP-63`-class identifiers — names, never resolutions) for
operator systems.

This promotes one existing manual law into structure and generalises
one narrow mechanism: the sensitivity split (schedule lives in the
operator's tracker, mechanism in the repo) is today a discipline of
authors, and the one operator-system fence that exists in code (the
Notion page fence validator) guards a single vendor surface. The
general operator-system fence — every operator binding an overlay
statement, never a public one — is what this decision **creates**; the
graph makes the boundary a property of the data rather than a
discipline of the authors.

**The clone test is a CI validator, not a hope**: the public dataset
must rebuild, validate, and render every projection from a cold clone
with zero overlay graphs present.

The seam's mathematics has a fifty-year lineage worth naming: monotone
information flow over an entitlement order is the lattice model of
secure information flow, and the clone test is its noninterference
falsifier (public outputs unaffected by private inputs). One free
generalisation follows: entitlement may become a lattice rather than a
chain (incomparable per-team overlays) with no design change — the
poset machinery already carries it.

**Union semantics and constraint scope.** Statement union is monotone,
so a mounted overlay extends but can never falsify public knowledge —
readers with more entitlement see strictly more, never different,
truth (a structural guarantee of the data model, claimed here as a
design property). Closed-world constraints are not automatically
union-stable, so every constraint declares a scope: **home-local**
(checked at that home's rebuild) or **union-scoped** (checked at
mount); an overlay violating a union-scoped constraint fails its own
mount and never the public base.

### 5. Vocabularies: reuse W3C, in the sibling ontology's image

- **PROV-O** is the spine: intent → action → state maps to
  `prov:Plan` → `prov:Activity` → `prov:Entity`; intent that never
  came to pass is a Plan no Activity ever used — first-class
  knowledge. (`prov:Plan` is not yet in the substrate's PROV vocab
  registry; it is an additive registry entry for the SDK increment,
  noted here so the gap is not discovered at build time.)
- **SKOS** carries the concept scheme (preferred/alternate labels,
  `broader`/`related`, match relations for gradual merging).
- **Dublin Core terms** carry document-level subjects and provenance
  metadata.

The sibling curriculum ontology's trisection — ontology, constraints,
instance data as separately versioned artifacts (observed first-hand
2026-07-31: `ontology/`, `ontology/*constraints*`, `data/`) — is the
layout template for the knowledge estate, and staying W3C-standard
keeps the practice graph and the curriculum graphs joinable.

**Cross-domain references are direction-lawful.** Published public
graphs and vocabularies — the W3C vocabularies above, the curriculum
ontology's IRIs — are external public homes: stable, resolvable
without credentials, at least as public as any stratum here. A
resolvable reference to an external public home is lawful from every
stratum (this record already depends on that ruling by citing PROV-O).
Operator-system identifiers remain the opaque-name class. A plan node
referencing a curriculum unit by IRI is therefore a federated query,
with neither graph knowing about the other.

### 6. The concept layer, landed

Concept nodes live as authored files under the estate (their prose the
definition, their front matter the SKOS-class identity per PDR-134's
lifecycle and two-axes rules). In-prose annotation has exactly one
form: the plain markdown link — anchor text as surface form, concept
node as target. One concept, one mechanism; a second inline syntax
would be invented optionality. (The per-user memory system's wiki-link
convention is a separate, pre-existing surface outside this estate and
is unchanged by this decision.) Anchor texts pointing at a concept are
harvested as computed evidence for alternate labels.

The seed vocabulary is adopted, not invented: the patterns index, the
rules' names, and the failure-mode classes are the Practice's
already-minted concepts, entering as `candidate`/`working` per their
observed usage. **One referent, one authored home**: a pattern file
_is_ its concept node — its front matter gains the concept keys and no
parallel concept file is minted for it (the §2 red line applied to
referents); that the patterns-index regeneration tolerates the added
keys is a named check of the SDK increment.

### 7. Validators

Composition first, because the dependency matrix constrains it: the
graph-native checks below run **in the graph tier** (the
`practice-graph` consumer's own check surface, invoking the SDK's
rebuild command) and emit a machine-readable report; the `agent-tools`
estate validators consume that report — never an SDK import — so
ADR-041's dependency matrix holds. The checks, red-first:

1. Every in-prose concept link and front matter concept entry resolves
   (extends the markdown-link validator; link resolution is file-level
   and stays in `agent-tools`).
2. `broader`/`related` and every graph edge obey the direction law
   across strata.
3. `ratified` concept status requires a complete ratification stamp.
4. Per-home recomputability: each home's graph rebuilds
   deterministically from that home's authored files, and holds
   nothing those files cannot regenerate (the red line, §2).
5. The clone test (§4).
6. Divergence between in-prose links and front matter subjects surfaces
   as advisory notes, never gates — no coverage quotas (PDR-134).
7. Union-scoped constraint validation at mount (§4): the overlay under
   mount fails on violation; the public base never does.

**Validator seeds** (recorded as pointers for delivery plans, not
committed scope — each is a mechanical check the mathematics makes
possible):

- **Fingerprint-vs-amendment**: per-node canonical fingerprints under
  stable names make content change mechanically visible — a node whose
  canonical form changed without a dated amendment note is a flag. The
  amendment discipline stops depending on author memory.
- **Preservation-class check on constraint scopes**: whether a
  constraint survives union is largely visible in its syntactic shape
  (existential-positive shapes are mount-safe; universal and counting
  shapes are not) — so a counting constraint declared home-local-only
  is itself a validator finding, and the scope declarations of §4 are
  checkable rather than trusted.
- **Match-edge provenance shape**: every `closeMatch`/`exactMatch`
  carries who asserted it, when, and on what evidence — sameness is
  always evidence-carrying (PDR-134 §The unifying schema).
- **Lifecycle × provenance consistency** (lands with the PROV spine):
  status enums cross-check against realisation edges — an
  archived-complete plan with no generating activity, or an activity
  with no plan, is a contradiction the graph itself can catch.

## Mathematical grounding (dated 2026-07-31, owner-requested)

Each load-bearing shape here is deliberately standard mathematics, so
implementations inherit proven algorithms and the falsifiers have
names:

- **Ontology/instance** is the description-logic theory/model split —
  the source of decidable validation.
- **The direction law** is stratification in the logic-programming
  sense: order-respecting references, validity preserved under
  restriction to down-sets (the strip tests), termination of cross-home
  resolution for free.
- **Homes and mounting** are restriction-and-union over the entitlement
  order (presheaf-shaped): a reader's world is the union over their
  down-set, and union monotonicity is what makes overlays unable to
  falsify public knowledge (§4).
- **Canonicalisation** (RDFC-1.0) picks canonical representatives of
  graph-isomorphism orbits — deterministic diffs, and canonical-form
  hash equality as statement-level identity.
- **The PROV spine** is a labelled transition system carrying both
  modalities — realised traces and unrealised plans — in one
  structure; the drift projections (§Consequences) are its fixed
  queries.
- **Cross-instance alignment** is the institutions shape (networks of
  theories joined by alignment morphisms), which is why alignment
  graphs are first-class with their own home (PDR-134 §5).
- **The unifying schema** (PDR-134): every law here is monotonicity of
  a flow over a declared order — generality, time, epistemic
  provenance, entitlement — so `graph-validate`'s core can be one
  order-checking engine instantiated per axis rather than a zoo of
  bespoke validators.
- **Evidence-carrying equivalence**: merging by match edges with
  provenance rather than collapse is the setoid discipline — identity
  as asserted, composable evidence — which is the same mathematics as
  supersession-never-deletion, applied to sameness.

What is deliberately not formalised — meaning inside prose — is a
fragment choice, not an omission: the graph is the decidable skeleton;
prose stays sovereign; the reading agent interprets between them.

## Alternatives considered (decision-lens run, 2026-07-31)

Recorded at owner request so the reasoning is durable, not just the
verdicts. The five decision lenses were run in order over every
load-bearing choice:

- **Graph-authoritative store, documents as projections** — rejected
  at lens 1, and not on convenience: authority must sit where
  ratification happens. Ratification is an owner act on a readable
  artifact; making the store authoritative would move the unit of
  trust away from the unit of review. The door stays open by
  construction: every statement's authority is some home's authored
  file, and stores remain derived indexes — a future store-side
  capability adds projections, never authority.
- **Two inline annotation syntaxes** (plain link + wiki short form) —
  removed at lens 2 as invented optionality; one concept, one
  mechanism.
- **Three strata instead of four** (merging ontology into the Practice
  stratum) — rejected at lens 3: the simpler shape erases the
  adopt-unchanged vs write-your-own distinction that cross-instance
  generality depends on. Simplicity would compromise function.
- **Two-state concept lifecycle** (sketch/ratified, as plans have) —
  rejected at lens 3: the `working` tier is what separates
  recurrence-proven vocabulary from noise, and the deduplication value
  this layer exists for depends on that separation.
- **A knowledge tier owning its own minting and validation** —
  rejected at lens 1 via the context-specificity gradient: ADR-173
  already homes those mechanisms in `graph-enhance`/`graph-validate`;
  duplicating them one tier up would be the second-source-of-truth
  shape this record forbids in its own §2. Activation in the ratified
  homes replaced it (§1).
- **The delivery-ticket collision** (schema requires an operator
  tracker ticket; the owner ruled this subtree carries none) — lens 4
  dissolves rather than decides it: under the strata model an
  execution-state anchor is an operator-overlay binding, so the
  public schema hard-requiring one is a stratum leak. The implied
  schema amendment — the anchor requirement becomes operator policy,
  not a public-schema constant — is **recommended to the ratification
  sitting**; the strategic node's owner gate records it beside the
  owner's alternative (a revised tracking ruling), and the choice is
  the owner's.
  - **Resolved (2026-07-31, owner-ratified at the ratification
    sitting).** The owner took the recommendation: the delivery-ticket
    requirement is operator policy, not a public-schema constant, and
    the plan-node contract now carries it as a dated amendment (the
    plan-node schema's §Enforcement); the strategic node's owner gate
    cleared at the same sitting. The realisation holds the stratum boundary this lens drew:
    a declared list of operator-tracked subtrees would itself be
    operator-stratum content left standing in the public base by an
    overlay strip (PDR-134 §1/§6), so the estate validator derives
    anchoring from the corpus's own execution anchors instead — a
    subtree is anchored when its strategic node or any live plan
    serving it already names a ticket, and only there must a ratified
    delivery plan name one. The limit is deliberate and stated so it is
    not mistaken for enforcement of the ruling: the check binds
    consistency of anchoring within a clone, never conformance to an
    operator's tracking discipline, which stays an overlay-side
    obligation.
- **Migration as relocation** — rejected at lens 4: the graph ingests
  artifacts where they live; migration is annotation plus a closed
  ledger, never file movement. The conserved planning corpora stay
  untouched as evidence.

## The ADR-200 reconciliation

Cited precisely, because ADR-200 is subtler than its shorthand:

- **Superseded**: ADR-200 §1's authority claim ("the idea-graph is the
  authoritative source of truth") and the framing of vision, strategy,
  and plans as projections _of the store_. §2 decides the opposite
  authority model.
- **Conserved and strengthened**: ADR-200 §2's co-equality of the
  human-navigable documents (which ADR-200's own non-goals protected:
  documents are "not mechanically-derived stubs") — here documents are
  not merely co-equal but authoritative. Ideas remain first-class: the
  idea layer lands as the concept scheme, and the rewrite lineage's
  "idea-node schema" becomes the concept-node schema.
- **Deferred, with homes**: ADR-200 §5's idea classification facets
  (`class`: good/speculative/bad — a candidate mapping onto the
  concept lifecycle's computed-confidence axis, decided at
  concept-schema authoring); `file:line` provenance (inherited by the
  harvest pipeline's provenance pointers); the realisation edges
  (`realised_by`/`embodied_in` — landed when the PROV spine lands,
  as `prov:Activity`/`prov:Entity` bindings); and the two-direction
  no-loss audit (inherited by the migration ledger's closure
  validator plus independent review at each corpus sweep).
- **Dropped**: nothing.

**Ratification-time obligations** (named here so they cannot be lost;
they execute in the ratification commit, not before):

1. A dated amendment block in ADR-200 pointing at this record's §2,
   plus the "← Partially superseded by ADR-221 (authority model)"
   annotation on ADR-200's index entry.
2. A dated note in ADR-216 §Relationship to ADR-200 pointing here.
3. This record added to the §Architectural decisions list of
   `graph-core`, `graph-ingest`, and `graph-project`.
4. A one-line ADR-041 amendment classifying `graph-ingest` and
   `graph-project` in its foundation/adapter enumeration, so the
   dependency permission this record's §7 composition relies on is
   determined rather than assumed.
5. The consolidation-pipeline cascade: the `consolidate-docs`
   graduation-target list gains concept nodes
   (`candidate`/`working` per observed usage) as a target class; the
   `consolidate-until-done` Conservation Invariant gains a dated
   sentence citing PDR-134's homing questions (its "portable decision
   in the PDR, not a host-local brief" test is stratum-homing already,
   stated informally); PDR-014 and PDR-130 gain dated
   cross-references (the concept lifecycle mechanises
   capture→distil→graduate at concept grain, and
   candidate/working/ratified is two-speed learning formalised); the
   dedicated-consolidation session prompt gains its one-line pointer;
   and the curator role's concept-scheme stewardship goes to the
   sitting as an owner call.

## Consequences

- Deduplication over the conserved corpora becomes concept-first and
  machine-assisted; the migration ledger's dispositions cite concepts.
- The Practice-stratum knowledge becomes loadable by a second Practice
  instance on a different stack (owner-attested 2026-07-31: TypeScript
  and Python instances exist today) as data, discharging the
  stack-generality aim at the knowledge level while each stack keeps
  native tooling.
- The curriculum graphs and the estate graph remain separate domains on
  one substrate, joinable by IRI — no shared domain code, no coupling.
- The paused refounding programme's instruments (denominator, freeze
  rule, conservation chain) are harvested as migration tooling by the
  strategic plan that executes this decision.
- Three guarantees come free from the mathematics and are claimed as
  design properties: **statement-level deduplication** beneath the
  concept level (canonical-form hash equality is identity up to
  isomorphism); **standing drift projections** from the PROV shape
  (plans never used, activities without plans, entities without
  provenance — the abandoned-intent, unplanned-work, and
  orphan-knowledge detectors are fixed queries); and **no authority
  feedback loops** (computed confidence never feeds authored status,
  so the epistemics cannot self-reinforce).
