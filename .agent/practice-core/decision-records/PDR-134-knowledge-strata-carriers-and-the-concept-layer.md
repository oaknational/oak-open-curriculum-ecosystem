---
pdr_kind: contract
---

# PDR-134: Knowledge Strata, Carriers, and the Concept Layer

**Status**: Accepted (owner-ratified 2026-07-31, in-session ratification
sitting — card answers at the Director seat, Falcon hunts Flight 52841f)
**Date**: 2026-07-31
**Related**:
[PDR-105](PDR-105-reference-direction-invariants.md)
(reference-direction invariants — this record extends its portability
axis from file references to graph edges and concept relations);
[PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md)
(PDR-vs-ADR portability — this record is portable: it names strata,
carriers, and lifecycle obligations, never a host's packages, paths,
or tooling; each host instantiates it through its own architectural
decision records);
[PDR-018](PDR-018-planning-discipline.md)
(planning discipline — plans are one artifact family this record's
carrier split governs);
[PDR-125](PDR-125-inter-practice-collaboration-protocol.md)
(inter-practice collaboration protocol — the cross-instance consumer
this record's stack-neutrality clause exists for).

## Context

A Practice accumulates knowledge in prose: plans, decision records,
lessons, patterns, letters. Three structural facts about that knowledge
have so far been carried by convention rather than contract:

1. **Generality varies by stratum.** Some knowledge is true of every
   Practice instance (practice decision records, named patterns); some
   is true only of one host repository (architectural decisions, that
   repo's plans); some is true only of one operator's running instance
   (schedule, private bindings to external systems). These strata
   already exist in practice — this record names them and binds their
   boundaries.
2. **Meaning and machine-readable structure have different carriers.**
   Prose carries the claims; structured front matter carries identity
   and relations. Without a contract, structure creeps into prose and
   prose leaks into structure, and both drift.
3. **Recurring ideas lack first-class identity.** The Practice mints
   concepts continuously (named patterns, failure-mode classes,
   discipline names) but they have no shared referent artifacts, so
   duplication between documents is invisible and deduplication is
   manual archaeology.

Multiple Practice instances now exist on different technology stacks.
Knowledge must travel between them; tooling need not.

## Decision

### 1. Four knowledge strata, homed by generality

| Stratum | Holds | Truth test (the homing question) |
| --- | --- | --- |
| Ontology | What kinds of things exist (types, properties, constraints) | Valid for any instance that adopts the Practice |
| Practice instance | The Practice's own knowledge: practice decision records, patterns, portable rules, practice concepts | True in another Practice-bearing repository |
| Repo instance | Knowledge about one host repository: its architectural decisions, plans, lessons, repo concepts | True in a stranger's clone of that repository |
| Operator overlay | One operator's running instance: schedule, credentials-adjacent bindings, non-public strategy | True only of that operator's deployment |

Every statement of knowledge belongs to exactly one stratum, decided by
the homing questions in order. The stratum determines the artifact's
**home**: ontology and Practice strata live in portable locations; the
repo stratum lives in the host repository; operator overlays live in
private homes outside the public repository and are **mounted at load
time** — the working knowledge base is the union of the strata a reader
is entitled to hold.

### 2. The direction law

The law governs **resolvable references** — file links, graph edges,
and concept relations, anything a reader can follow to a target. These
flow only from the more specific stratum toward the at-least-as-general:
operator → repo → Practice → ontology, never backwards. An **opaque
external name** — an identifier that names without resolving — carries
no resolution and therefore no dependency, so a public artifact may
name an external thing while remaining whole without it. Reference is
not access, and naming is not reference.

This is PDR-105's portability axis, extended: a portable artifact may
reference only artifacts at least as general as itself, and the same
law now binds every edge in the knowledge graph, including a concept's
`broader`/`related` relations.

**Referential stability**: a published identifier, once referenced
from any home, resolves forever — evolution supersedes nodes, never
removes them, so a resolution target may be superseded (with its
successor named) but never absent. Citation permanence is a structural
property of the estate, not a promise.

### 3. Three carriers, one addressing principle

- **Prose carries claims** — the full semantic content, irreducible,
  human-first. The knowledge structure never attempts to represent
  what prose means.
- **Front matter carries assertions about the document** — identity,
  type, lifecycle, and edges: document-to-document and
  document-to-concept.
- **The concept scheme carries shared referents** — named ideas with
  authored definitions and authored relations.

The governing principle: **the graph is not a representation of the
knowledge; it is the addressing system for the knowledge.** Prose is
where meaning lives; concepts are how meaning is addressed; front
matter is where addresses are written down. The reading agent bridges
meaning at read time.

Corollary — **annotate the reference, never the meaning**: in-prose
concept annotation links a mention to its referent (a plain link whose
anchor text is the surface form and whose target is the concept node).
Semantic markup inside sentences — typed spans, inline relation
annotations — is prohibited; the sentence stays sovereign.

### 4. The concept layer

- A **concept node** is a small authored file obeying the same carrier
  split at concept grain: its prose is the definition; its front matter
  carries stable identity, preferred and alternate labels, lifecycle
  status, stratum, and `broader`/`related` relations (SKOS-class
  semantics).
- **Lifecycle**: `candidate → working → ratified`, plus terminal
  `deprecated`/`superseded`. Minting a `candidate` is cheap and open to
  any author or harvest process. **Second consumer promotes to
  `working`** — recurrence proven by use in two independent artifacts.
  **`ratified` requires an owner ratification stamp** — commitment is
  decided, never counted. A dead candidate is itself knowledge (intent
  that never came to pass) and archives rather than deletes.
- **Two epistemic axes, never conflated**: *computed confidence*
  (usage counts, distinct documents, distinct strata — always derived
  from the graph, never authored) and *authored status* (the lifecycle
  above — always decided, never derived).
- **Concepts stratify** like all knowledge, under the same direction
  law: a Practice-stratum concept never points at a repo-stratum one.
- **Extraction proposes; authors ratify.** Harvest tooling may mint
  candidates and propose annotations; no extracted artifact becomes
  authoritative without an authored, reviewed change.
- **No coverage quotas, ever.** Annotation-integrity checks (links
  resolve; declared concepts exist) may gate; annotation-coverage
  measures are advisory only. A quota manufactures annotation garbage.

### 5. Knowledge is stack-neutral data; machinery is per-stack

Knowledge artifacts serialize to open W3C-standard forms so that any
Practice instance, on any technology stack, can load, validate, and
extend another instance's ontology and Practice-stratum graphs. Each
instance implements its own tooling (ingestion, validation, projection)
natively. The interoperability falsifier: a second instance on a
different stack loads the first instance's Practice-stratum knowledge
and validates it against the shared constraints.

Cross-instance concept alignments (match relations asserted between
two instances' schemes) are their own graphs with their own home — a
deferred home class, named now so the first alignment does not
improvise one. An alignment belongs to neither instance's stratum
lattice; it relates them.

### 6. Privacy by home; falsifiers by stratum

Visibility is decided by which home carries a graph, never by redacting
a mixed store. Each stratum boundary carries a strip test: with every
stratum above X removed, everything at or below X still rebuilds,
validates, and renders (external references displaying as unresolved
names). The outermost instance is the clone test: a cold public clone
is complete and valid with zero operator overlays present.

**Union semantics are monotone by construction**: mounting a more
specific stratum extends but can never falsify a more general one —
readers with more entitlement see strictly more, never different,
knowledge. Constraints therefore declare a scope: **home-local**
(checked at each home's rebuild) or **union-scoped** (checked at
mount); a mount that violates a union-scoped constraint fails that
mount, never the more general base.

## Consequences

- Deduplication becomes graph-visible: two documents sharing a concept
  with no edge between them is a machine-generated review candidate;
  near-duplicate concepts merge gradually through match relations with
  history preserved.
- Corpus migration orders concepts-first: harvest and ratify the
  vocabulary, then document dispositions can cite it, and the overlap
  map writes itself.
- Whole strata can re-home as generality is proven (a Practice-stratum
  artifact moving to a shared home at its second consuming instance)
  without reference rewrites, because identity is persistent and
  independent of storage location.
- Host repositories instantiate this contract through their own
  architectural decision records; this record deliberately names no
  host machinery.

## The unifying schema (one law, four axes)

Examined together, this record's laws share a single schema: **every
binding law is the monotonicity of a flow over a declared order.**
Four orders are in play — **generality** (the strata; references flow
toward the general), **time** (versions; resolution flows along
supersession and never breaks), **epistemic provenance** (authored
precedes derived; statistics, inference, and extraction read the
authored layer and never mechanically enter it — the two-axes rule,
the asserted-only commitment, and harvest-proposes-authors-ratify are
one membrane stated three times), and **entitlement** (mounting;
readers see the union over their down-set). Every falsifier in this
record is a monotonicity check over one of these orders, so an
implementation may enforce the whole family with one engine
instantiated per axis — and extensions (new strata, new derivation
kinds, entitlement lattices rather than chains) inherit the law by
declaring their order, with no new doctrine.

The epistemic-provenance order also decides mutability, so no separate
policy is needed: **immutability follows epistemic kind.**
Observations — event records, provenance, evidence, version history —
are immutable: they record the past, and mutating the past is lying.
Authored current-state is mutable *with history*, at two grains kept
distinct: byte-grain history (the version-control substrate,
automatic) and semantic-grain history (supersession edges and dated
amendment notes, deliberate) — working surfaces are never
event-sourced per edit. Derived state is freely rebuilt: its history
is derivable from its sources' history, so preserving it would be a
category error.

One further shared discipline, named so it stays deliberate: the
estate prefers **evidence-carrying equivalence over collapse** —
concepts merge by match edges with provenance, nodes evolve by
supersession edges, and nothing is ever rewritten into identity.
Sameness is asserted with evidence and composed; it is never imposed
by deletion.

## Mathematical grounding (deliberately standard)

The shapes above are chosen to be proven mathematics, not novel
design, so any implementing stack can lean on existing results and
algorithms: the strata with the direction law are a stratified
knowledge base (order-respecting references; validity preserved under
restriction to down-sets); the mount is a monotone union over the
entitlement order; ontology-versus-instance is the classical
theory/model split with decidable validation; identity-versus-content
is rigid naming with a version category over it; and the
intended-versus-actual split is a bimodal provenance structure. Host
records name the concrete frameworks and algorithms; this record fixes
only the properties.

And the grounding is itself subject to the membrane: **formal
grounding is evidence, never authority.** A mathematical claim in
doctrine is a claim like any other — it carries its falsifier, invites
refutation, and cannot promote anything to ratified. Comprehension and
ratification remain human acts on readable artifacts; the mathematics
guards that arrangement and never replaces it.

## What this record forbids

Backwards resolvable references across stratum boundaries; extracted
but unratified artifacts treated as authoritative; annotation-coverage
quotas; semantic markup inside prose; authored fields whose values are
derivable from the graph.
