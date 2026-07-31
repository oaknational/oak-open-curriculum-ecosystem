---
id: planning-and-intent-estate
node_type: strategic
name: "Planning and intent estate — one governed knowledge graph"
overview: "Every unit of repo knowledge — plans, decisions, lessons, concepts — graph-addressable under one contract, with the conserved planning corpora incrementally absorbed and nothing lost."
status: ratified
ratified_by: "Jim Cresswell"
ratified_date: 2026-07-31
ratified_where: "In-session ratification sitting cards, 2026-07-31 (Director seat, Falcon hunts Flight 52841f); the delivery-ticket gate resolved at the same sitting via the schema-amendment answer"
serves: FRAME-1
impact_areas:
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-07-31
---

# Planning and intent estate — one governed knowledge graph

> "The knowledge flow, the learning cycle, the understanding
> pipeline… different names for one thing, that is the absolute heart
> of what the Practice is: the combination of persistence and learning
> and _improvement_ for emergent systems with foundational agentic
> elements. More poetically, a form of persistence of being for
> agents, with strands of personal memory and of shared culture,
> independent of model, vendor, effort."
>
> — the owner's kernel, ratified in-session 2026-07-31 as this
> programme's ground. The four strata are those strands made
> structural; the bimodal provenance holds what was meant beside what
> happened; forgetting stays vital and what persists is chosen.

## Outcome

The repository's knowledge — plans, architectural and practice
decisions, lessons, patterns, and the concepts they share — is one
governed estate: every artifact carries stable identity and typed
relations, a derived graph rebuilds deterministically from each home's
authored files, projections answer the questions the estate's
directory sprawl cannot (what serves what, what duplicates what, what
was intended and never came to pass), and the four conserved planning
corpora (enumerated in ADR-221 §Context; census re-derived at
ledger-open, never frozen) are fully dispositioned through a closed
migration ledger — migrated, harvested, or retained as evidence — with
the corpora themselves untouched as the loss guarantee.

The public/operator boundary is structural: a cold clone of this
repository rebuilds and validates the complete public knowledge base
with zero operator overlays present — which is what lets an external
organisation (the owner's own framing, 2026-07-31: one could clone
this repo) adopt the estate and mount its own overlays.

## The bet

Knowledge that lives only in prose duplicates silently and dies with
its context; knowledge forced wholly into structure dies of
over-formalisation. The bet is the three-carrier split stated in the
governing doctrine pair: prose carries claims, front matter carries
addresses, a concept scheme carries shared referents — the graph as
the addressing system for knowledge, never a replacement for it. The
doctrine pair is
[PDR-134](../../practice-core/decision-records/PDR-134-knowledge-strata-carriers-and-the-concept-layer.md)
(the portable contract: strata, carriers, concept lifecycle) and
[ADR-221](../../../docs/architecture/architectural-decisions/221-estate-knowledge-graph.md)
(its embodiment here: substrate, authority model, the named-graph
seam, vocabularies, validators — including the deliberate exclusions,
which live there as decision content, not here); this node governs
execution. The three artifacts are presented for ratification together
for coherence — the ADR instantiates the PDR and this node's gate
resolution rests on their strata model — but the owner may ratify
severally.

Deliberately not done in this node's own scope: no big-bang corpus
conversion, and no resurrection of conserved files as live plans —
migration is annotation plus a closed ledger, never relocation.

The migration orders concepts-first (owner direction 2026-07-31,
in-session): the shared vocabulary is harvested and ratified before
document dispositions, so the ledger can cite concepts and the overlap
map between conserved plans writes itself. The paused refounding
programme's instruments — denominator, freeze rule, conservation
chain — are harvested as the ledger's own tooling.

## Success looks like

- The per-home rebuild falsifier holds (ADR-221 §2): each home's graph
  regenerates deterministically from that home's authored files, in
  CI — and no home's store ever holds a statement its files cannot
  regenerate.
- The clone test holds as a CI validator: public completeness with zero
  overlays mounted.
- The stack-neutrality half this repository controls holds: the
  Practice-stratum graphs serialize to W3C forms and validate against
  the shared constraints under a stack-neutral loader. (The full
  cross-instance load by a second Practice instance — owner-attested
  to exist, TypeScript and Python — is the aspiration this enables,
  not an acceptance criterion this repo can discharge alone.)
- The migration ledger is closed: every file (all file types) under
  the four conserved planning corpora carries exactly one recorded
  disposition, recomputable, with the corpora themselves untouched as
  evidence.
- Projections are live: the estate board, thread and lane views, the
  concept-maturity board, and the deduplication review agenda are each
  rendered by the rebuild command in CI and reachable from a named
  entry point. (Whether they are consulted is a dated review question
  for the owner, not an acceptance criterion.)
- What this node does not claim: semantic understanding inside prose,
  annotation coverage targets, or any migration of operator-private
  material into the public repository.

## Delivery

Delivery plans serving this node declare `serves:
planning-and-intent-estate` — enumerate them by search, never by a
hand-kept list. Per the owner's tracking ruling (2026-07-31) this
subtree carries no Linear content. The delivery-ticket gate this node
carried was RESOLVED at the 2026-07-31 ratification sitting via the
design-recommended schema amendment (execution-state anchors are
operator policy, not a public-schema constant — recorded in the
plan-node schema's dated amendment; the paired validator mechanism
landed 2026-07-31 as derived anchoring consistency). Sequencing follows the
concepts-first order stated in the bet; each delivery plan is a
single-story step of its lane, sized within its round budget at
authoring time (PDR-132).

Two known estate-validator gaps are candidate first steps, both
review-verified against the code (2026-07-31): the schema promises
expired owner gates surface as drift but no instrument compares
`expires` to the clock, and the schema document claims a
sensitivity-vocabulary tripwire that is not implemented. Closing them
is exactly this node's thesis applied to itself.
