---
pdr_kind: governance
---

# PDR-143: The Practice as a Standalone Entity — What Is Extracted, What Is Installed, and How It Keeps Learning

**Status**: Accepted (the owner's direction, stated 2026-10-02 and recorded verbatim below, is
standing; the definition in §Decision was ratified by the owner on 2026-10-04 as the canonical
definition of the Practice, by card answer to the Director seat Crucible binds Slag, "Ratify as
canonical"; the Amendment Log entry of that date carries the ratified text and the review that
is its evidence)
**Date**: 2026-10-02
**Related**: [PDR-142](PDR-142-the-best-of-each-practice.md) (the exchange that defines excellent;
its §Two axes names the scopes this record uses, and its §Boundaries reserves the package's shape
for a record of its own, which is this one);
[PDR-125](PDR-125-inter-practice-collaboration-protocol.md) (the peer exchange protocol, whose
clauses §Consequences names, and whose posture this record changes from peer repair to a fold);
[PDR-005](PDR-005-wholesale-practice-transplantation.md) (the portability gradient: its
fully-portable position maps to the Practice-wide scope below, portable-with-adaptation to the
language binding, hybrid to what §2 decomposes, local to repo-local);
[PDR-007](PDR-007-promoting-pdrs-and-patterns-to-first-class-core.md) (the Core-package contract
this record grows); [PDR-079](PDR-079-pdr-vs-adr-portability-distinction.md) (the migration test,
which becomes the entity's membership test);
[PDR-014](PDR-014-consolidation-and-knowledge-flow-discipline.md) (capture, distil, graduate: the
loop whose steps this record places);
[PDR-119](PDR-119-agent-memory-as-an-event-graph-with-renderers.md) (events and renderers: the
substrate distillation and the install stand on);
[PDR-141](PDR-141-operator-profile-in-the-home-directory.md) (the machine-local scope);
[PDR-130](PDR-130-two-speed-learning.md) (every graduation carries its prediction and its
falsifier).

## Context

### The owner's words

2026-10-02, verbatim, given in the second estate's session:

> "The Practice will be extracted as a standalone entity from both repos, but what that means has
> not yet been defined; it must preserve the ability to learn, but it is not clear how once it
> becomes a centralised thing with a single canonical definition, and it is not clear what is the
> separate, installable Practice, what is the Practice installed in the context of a specific
> repo, and what belongs in the repos that the installed Practice supports."

And of the second estate, the same day: it "is thinner, but still real, this is my professional
identity repo and does genuinely matter in its own right."

Earlier owner words this record stands on, carried by PDR-142: "Once the Practice contains the
best of both it will be extracted into an installable entity" (2026-09-25); "nothing is delayed
or avoided because of the future extraction"; and the scopes, "Practice wide , Typescript Practice
wide, repo-local and machine-local doctrine, memories, state", with "it is doubtful that
everything will be in the Package, although likely all contracts will be". PDR-142's own ratified
sentence on code, in §How each kind travels: "Code is shared as one installed package, which the
owner has chosen as the route".

### What the Core says of itself today

`practice.md` §Plasmid Exchange: "Each repo carries its own Practice instance — there is no
hierarchy." The Core's README calls the Core the memotype and the applied Practice the phenotype.
The Core's travel contract carries the trinity, the verification companion, the entry points, the
changelog, the provenance file, the decision records and the Practice Box; the rules, the skills, the reviewer
templates, the hooks and the tooling travel at a transplant on PDR-005's gradient, copied verbatim
where fully portable, and then evolve apart in each repository with no mechanism keeping them the
same. Learning crosses between instances by exchange: transformation (a Core taken up at a pin)
and conjugation (two live seats repairing each other's drift).

### What two instances showed

The two instances were measured on 2026-10-02; the counts are in each estate's Practice inventory
report of that date, which the delivery node `practice-parity-for-extraction` names.

Code travelled between the estates in those lanes as copied bytes under the Director's ruling on
shared changes (three changes carried by seven pull requests, one seat, one day; an observation,
not a class), while PDR-142 §How each kind travels says code does not travel by copy and the
receiver authors. PDR-142's clause governs the reading, and none of the seven landings declared
the copy in its integrating commit as PDR-125 clause 7 asks. This record is that declaration:
the arc-metrics tool, the merge tooling's push and the push's tests are copied mechanisms owed to
the package the owner chose, and each later port of code names the same debt in its integrating
commit.

## Frames considered

- **Peer repair as the end state** (the standing posture of PDR-125 and PDR-142: every repository
  a full instance, drift repaired by exchange). Kept as the governing posture until the entity
  exists; rejected as the end state by the owner's word that the Practice will be extracted.
- **A central entity rendered into each repository at install time, uncommitted.** Rejected: the
  forge's review bot reads the repository as it is, with no install step, and PDR-142's
  merged-text clause already relies on that reader; a cold clone reads the same tree before any
  install (the engineering principles' any-user, any-machine lens).
- **Overrides as the edge's variation.** Rejected by the rules-have-no-exceptions discipline and
  the engineering principles' no-escape-hatch clause: a repository that changes what a canonical
  rule means is a fork the entity cannot see.
- **A central entity with a committed, checked render and additive extensions.** Adopted below.

## Decision

The direction is recorded as standing: the Practice will be extracted from the repositories that
carry it into one standalone entity, the single canonical definition, installed into each
repository it supports.

**The definition, ratified by the owner on 2026-10-04.** The Practice is one system of
engineering practice that governs how work is planned, decided, implemented, reviewed, delivered
and learned from in every repository that carries it. It has five layers. The **general** layer
is tooling-agnostic policy and strict universal contracts: the principles, rules, skills,
decision records, patterns, reviewer templates and hook policy; the schemas of its state, memory
and plan surfaces; the vocabulary of its gates. Each of those kinds also has instances in the
family and contextual layers (a host rule, a family pattern), placed by the membership tests of
§2, so the kind names the layer's content and the test places the instance. The **family** layer binds those contracts to
one tooling ecosystem (TypeScript, Python, Rust and their like): the Practice-operation scripts
and quality gates, their placement at commit, push and CI, the toolchain and configuration
baselines, the CI skeleton; it is implemented per family only where a universal approach is not
efficient or appropriate, and every repository of a family shares it. The **contextual** layer
binds the family layer to one host: the package scope and workspaces, the product's tasks, the
required checks beyond the family's, deployment, the host's reviewers, rules and decision
records, the operator's profile. The **accumulated** layer is what an instance accrues as it
runs and learns from: the napkin, the registers, claims, comms, handoffs, plan nodes, reports,
experience; it is created empty in a new context and never transmitted. The **loop** is the set
of mechanisms by which the accumulated layer becomes general, family or contextual (capture,
distillation, graduation, enforcement by gates and reviewers) and by which one instance's
learning reaches another, the last an open design question of the extraction. An instance of the
Practice is all five layers in one repository; the Practice itself is the general layer, its
family bindings and the loop; the product is what an instance produces and is no part of it.
The owner's direction for the shape across families, verbatim: "tooling agnostic policy, strict
universal contracts, tooling specific implementations where a universal approach is not
efficient or appropriate".

The scopes below are the layers read along the owner's scope axis: Practice-wide is the general
layer; language-wide is the family layer; repo-local authored and rendered are the contextual
layer; repo-local instances are the accumulated layer; repo-local host is not the Practice;
machine-local is contextual. The axis adds one distinction the layers need.

### 1. The scopes, in the owner's words

| Scope | Holds | Lives in |
| --- | --- | --- |
| Practice-wide | principles, rules, skills, decision records, reviewer templates, hook policy, the schemas of every state and memory surface, the learning protocol, the tooling's contracts, and the set of platforms the entity can render adapters for | the entity |
| Language-wide (today, TypeScript) | the binding of each Practice-wide contract to one ecosystem: gate names, test conventions, the tooling's implementation | the entity, as a binding beside the contract it binds |
| Repo-local, the installed Practice, authored | the bridge index, the bindings this host chooses (bot identity, package scope, default branch, claim areas, adaptation level, the platforms enabled), the adoption record and its deliberate omissions, repo-local extensions | the repository |
| Repo-local, the installed Practice, rendered | the canonical content and the platform adapters, rendered from the pinned revision and committed, checked against the pin | the repository, derived |
| Repo-local, the installed Practice, instances | every state and memory instance: claims, comms, handoffs, continuity records, napkin, registers, experience, plans | the repository |
| Repo-local, the host | product code, content, product decision records, product docs and tests, and the gates the host exposes for the Practice to stand on | the repository |
| Machine-local | the operator profile (PDR-141) | the home directory |

The one distinction added: repo-local splits into the installed Practice (content with a Practice
schema that names this host) and the host (content about the product). Without the split a host
binding is written into the canonical, where it drifts, or into the product, where it couples. The
engineering principles' sentence that agent-work capabilities are Practice-owned and "host-local
tooling implements them" changes on acceptance: the entity's tooling implements them, bound per
host.

### 2. The membership tests

An artefact belongs to the entity when it passes the migration test of PDR-079, "could this record
land unchanged in another repository adopting the same practice?", read for every artefact kind,
and, for tooling, the framework test of the engineering principles, "Could another consumer use
this component unchanged?". A tooling consumer that cannot is the falsifier of the artefact's
generality, and the cure is a binding or a parameter, never a second copy. An artefact that passes
neither test cleanly is decomposed at the tension before it is placed; a compromise label
("shared", "cross-cutting") names coupling, not a home.

The pairing of PDR-079, a portable record in the entity and a repo-bound record in the host with
the pairing held in the bridge index, is the installed-Practice pattern for every artefact kind,
not for decision records alone.

### 3. Learning once the definition is centralised

The loop is PDR-014's: capture, distil, graduate. The extraction changes where graduation lands
and how a distilled claim reaches the entity, and nothing else about the loop.

- **Capture stays at the edge, unchanged.** Observations are made where the Practice meets a
  repository and a session: the napkin, the experience records, the friction register, the
  learning signals. Each becomes, under PDR-119 (Proposed), an immutable event in that
  repository.
- **Distillation stays at the edge.** It becomes PDR-119's render-time curation over the
  repository's own event set, and its registers are memory instances that live in the repository
  (§1).
- **Graduation splits by destination.** A lesson whose home is repo-local graduates at the edge,
  into a repo-local extension or a host record. A lesson whose home is Practice-wide graduates at
  the entity, where PDR-130's prediction, falsifier and slow lane apply. What crosses to the entity
  is the distilled claim with its instance count and its falsifier; the events stay in the
  repository and are cited as instances, because memories and state never travel (PDR-142).
- **Variation stays at the edge as extensions, never as overrides.** An installed Practice adds a
  repo-local rule, skill or reviewer when the entity lacks one; it never changes what a canonical
  rule means. An extension is the Practice's mutation space.
- **Promotion is the second-consumer rule applied across installations.** An extension grown in
  two installed Practices, or one owner ruling, changes the entity; one installation's extension
  stays an observation (one instance is an observation). The entity changes only from distilled
  claims and owner rulings; it has no life of its own.
- **No silent fork.** The installed Practice is a committed render of the pinned revision beside
  the repo-local content, and a check fails when the render drifts from the pin. The edit that
  used to be learning in place fails loudly and routes to the entity, which is the discipline
  PDR-014 and PDR-130 already require of durable change.
- **The entity is installed in itself.** The repository that holds the canonical definition runs
  under the Practice: its own seats, claims, comms and gates. It is the reference installation, and
  anything it needs that is not in the entity is by that fact repo-local.

### 4. Materialisation

Entry points, the pin, the repo-local authored content and the instances are authored in the
repository; the canonical content and the platform adapters are rendered from the pinned revision,
committed, and checked against the pin. The render is committed because readers of the tree as it
is exist: the review bot that reads a repository's doctrine during a review runs no install step,
and a cold clone is read before one.

### 5. What this record does not decide

The entity's name, home, licence, publishing route and version scheme; whether repositories
outside the owner's adopt it, which changes only how distilled claims reach the entity (a
consolidation seat reading each repository, or adopters sending them); the relation between an
installed Practice and a repository's upstream when the repository is a fork that carries the
Practice; and the extraction's date, since its order is the owner's already ("Once the Practice
contains the best of both it will be extracted"). Each is the owner's, and each lands in this
record's amendment log or in a record of its own.

## Consequences

- `practice.md` §Plasmid Exchange's sentence "there is no hierarchy" is replaced: there is one
  definition and many installations. Transformation becomes the install and conjugation becomes
  the fold; the provenance chains become the entity's history; the Practice Box's integration flow
  runs at the entity over what each installation sends.
- PDR-125 is amended in five places: its §Context's "independently-evolving repos, not clones"
  (one definition, many installations); clause 5's derived identity names, which it keeps as
  repo-local derivations, and the clone-pressure its clause 5 and §Non-Goals name for converging
  them (one wordlist in one package gives one seed one name everywhere, and that convergence is
  wanted); clause 6's union posture, as PDR-142 §Boundaries foresaw (an innovation lands once, in
  the entity); and the non-goal that neither estate implements the other's phenotype (the entity
  implements it for both).
- PDR-142's third-reason rendition, under which a receiver writes a shared concept in its own
  words, ends: a host whose context does not fit the canonical text has a parameter missing or an
  extension to add.
- PDR-007's Core-package contract grows to the entity's content.
- The twin lane ends for code and for shared text: a change lands once in the entity and reaches
  each repository by its bump. Until the entity exists, PDR-142 governs.
- The exchange's concept-level comparison becomes the promotion review.

## Prediction and falsifiers

Prediction: with the definition applied, the shared paths of the two estates reach zero differing
files at the first install, and a Practice-wide claim distilled in either repository reaches the
entity within one lane's time.

Falsifiers, each reopening the clause it names with the owner:

- An extension awaits promotion for longer than a coordination branch's lifetime (24 hours) while a
  second installation has grown the same shape: the fold's latency has become the bound (§3's
  promotion rule; the fold-latency mechanics it tests are held in the parity node's §Inputs).
- A repo-local need that is neither configuration nor an additive extension, one that requires the
  canonical to mean different things per host: the content is not Practice at all, or the entity
  is missing a parameter (§1, §2).
- One rule or skill whose Practice-wide text must change for a host: the Practice-wide scope was
  narrower than §1's inventory claims, and the language-wide binding is larger (§1).
- Every reader of the tree the estate relies on, the review bot and the cold clone included,
  renders before it reads: the committed render is then unnecessary, and §4 changes to a render
  at install (§4).

## Provenance

The owner's words of 2026-10-02, given in the second estate's session to the implementer seat
Crucible binds Slag, who authored this record after reflecting with the Practice's cognition
skills on an analysis first given in conversation, and revised it on two reviews before it was
committed. Corrections made in the reflection and the reviews: the route for code was already the
owner's choice in PDR-142, not an open question; the scopes are the owner's axis, not a seat's
layers; the first draft sized every two-estate lane against the extraction, which the owner's
ratified word in PDR-142 forbids, and the clause is gone; the first draft claimed the whole
phenotype was already the same bytes in both estates, and the measurement above replaced the
claim; the first draft moved distillation to the entity, against PDR-119 and this record's own §1.
Numbering allotted from the lineage, where both estates' sets ended at PDR-142. Lands as the same
bytes in both estates.

## Amendment Log

### 2026-10-02 — trimmed under PDR-019's amendment of the same date

**Context.** PDR-019, amended 2026-10-02 on the owner's word, holds that a decision record carries
the decision, its context and its consequences, and that a plan node carries sequence, size and
proof. Read under it, three passages of this record were planning: in §Context "What two instances
showed", the paragraph of measured counts (a load-bearing number in a record is a moving target);
in §3, the bullets "The bump is the consolidation moment" and "The fold's latency bounds the
learning rate"; in §4, the gate placement ("at every gate, the pattern the platform adapters
already follow") and the per-revision cost ("A committed render costs a diff in every repository
at every revision of the entity; the check is what keeps that diff a render and never an edit").

**Decision.** The three passages leave this record and are held verbatim, host-side, in the delivery
node of the two estates that made this decision (`practice-parity-for-extraction`, §Inputs) until
the extraction's design node takes them; a repository that hydrates this record takes it without
them, as planning content, and loses nothing it needs to apply the decision. The counts become one
dated line pointing at the inventory report. The record's status and its
decision are unchanged: the direction, the scopes, the membership tests, §3's constraints and its
installed-in-itself decision, §4's committed and checked render, and §5 stand as written.

**Falsifier.** A reader applying §3 or §4 needs one of the moved passages to know what is decided,
or the design node is authored without them: then the trim cut a decision, not planning, and the
passage returns here with this log saying so.

### 2026-10-04 — the definition ratified as canonical; the family layer added; the owner's words of 2026-10-03

**Context.** Two days of aligning the two estates' Practice instances by bytes ended at the owner's
word of 2026-10-03, heard first-hand by the Director seat Crucible binds Slag (7b999c), verbatim:
"there are two estates with one system of development and value provision and contracts and
authority and so on, and that system currently has divergences that we are trying to resolve."
And: "There is the Practice in general, the Practice in a context, and the ephemeral state and
memory and records that the Practice accumulates over time in a context and _learns from_. There
is the learning loop itself. I don't think we have a definition of what the Practice is." The
review that followed read both estates side by side from what runs (scripts, hooks, workflows,
configuration, the Practice directory, the tooling, the records) and derived the layers from the
reading; on 2026-10-04 the owner added the family layer ("between the general Practice and a
contextual instance in a repo, there is the repo tooling family, e.g. Typescript, Python, Rust,
each family has conventions, for instance I would expect all Typescript family repos to have the
same package.json scripts, at least for Practice operations, which includes all quality gates")
and a Python-family instance confirmed it. The review's evidence is each estate's own report
of that month on the Practice system, an estate record cited here as evidence and never carried
by this Core.

**Decision.** The definition in §Decision is the owner's, ratified 2026-10-04 by card answer
("Ratify as canonical"); the status reads Accepted. The seven scopes of §1 stand, read as the five
layers. Six placements the review found are decided with the owner's words recorded in the
report: patterns are general-layer content and a core part of the memory loop, each to be placed
in a layer, with their reachability from rules, directives, skills and records the measure of
their value; the Core changelog is Core text, its two copies merged; the fourteen
reviewer-invocation rules become one rule and a roster table in every instance; one CI shape
(the fan-in) per family; the implementation of the Practice's own runtime across families is the
extraction's first design question, under the direction quoted in §Decision; the family layer's
falsifier was met. The open question the owner named for another day stands as §3's successor:
how learning feeds from a repository's operations into its local Practice and then the central
one.

**Falsifier.** A mechanism both estates rely on that fits no layer or two, found by a seat
applying the definition and not placed by a decision within the next review; or a repository of
a family whose Practice-operation scripts the family's contract cannot name. One such instance
reopens this entry with the owner, and this log says so.
