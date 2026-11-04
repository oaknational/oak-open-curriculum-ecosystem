---
id: organisational-identity-below-the-tree
node_type: strategic
name: "Organisational identity below the tree — any organisation is configuration"
overview: "The repository is general mechanism that any organisation runs as its own; who is running it — repository owner, bot, code-quality and error-reporting accounts, chat and ticketing homes, default branch, adapter prefix — is configuration held below the tree, never a literal in mechanism, with a validator that holds the count at zero."
status: ratified
ratified_by: Jim Cresswell (owner)
ratified_date: 2026-09-08
ratified_where: "PR #85 (2026-09-08), whose body quotes the owner's card answer verbatim: 'Ratify all six'"
serves: FRAME-2
impact_areas:
  - practice-and-estate
  - design-system
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-09-08
---

# Organisational identity below the tree — any organisation is configuration

## Kernel (owner words, 2026-09-03)

- "In general, what we are doing here is making the repo more readily usable by other
  orgs, so accidentally pinned Oak specific config should be replaced with non-pinned
  config, and example files."
- The per-checkout merge-bot configuration landed the same day at the owner's word ("this
  is per-checkout config, it should not be in version control"): an untracked file behind
  a tracked example, a strict schema, resolution at the clone's primary checkout, an error
  that names the template. That instance is the shape this node generalises.
- The standing principle it extends is Any User, Any Machine (owner-set 2026-07-21): a
  surface that silently assumes its author's identity or host is a portability defect even
  while it works perfectly for them. This node adds the third reader to that principle's
  three: another organisation, on its own accounts.

## Outcome

Who runs this tree is never in the tree. A clone of this repository under any
organisation's name runs every local gate, tool, workflow and IDE integration with no
tracked-file edit beyond one enumerated, validated residue. Organisational identity —
repository owner and name, the merge bot and its app, the committing author, the
code-quality organisation and project, the error-reporting organisation, chat channels,
the ticketing workspace, the default branch, the adapter prefix — is held below the tree:
derived from a source already present, read from a per-checkout file behind a tracked
example, taken from the environment, or bound on the service side. General mechanism reads
it through one resolver at the clone's primary checkout and carries no default naming any
organisation. The tree's declared identity homes remain the canonical organisation's by
enumeration; everything else is mechanism.

This is the design-system node's split — general mechanism below, identity data above,
the canonical organisation as thin configuration — transposed from visual identity to
organisational identity, and ADR-227's line applied one level lower: the product band
leaves with the product; what stays is the platform, and the platform's own estate identity
is what moves below the tree.

## User groups and value

- **An organisation running this repository as its own** (first the fork this line is,
  then any third): adoption costs the hours it takes to copy examples, set environment and
  bind services, and continuation costs nothing per upstream sync because no tracked
  mechanism file carries their name or the canonical one.
- **Contributors on any machine**: a fresh clone works cold; no surface assumes the
  author's organisation.
- **The platform's own maintainers**: one tree shape for every identity file, one resolver
  among the agent-tools readers, one validator; the extraction census under ADR-227 gains
  one column ("estate literal found: leaves or stays") so extraction and portability share
  a census instead of keeping two.
- **The consumer of published packages** (ADR-227's registry reader) gets nothing directly
  from this node and is served by that record.

## The bet

Why this outcome: the pins that broke this line's own checkout on its first day as a fork
were platform pins, not product residue — a tracked code-quality binding, a repository
constant in the PR-throughput register, harness client configs naming a vendor
organisation, rules naming a bot by slug and number. An inquiry over the tree at the node's
authoring found the mechanism-read pins few in number and every one of them curable by a
first-applicable rung of a fixed ladder; the bulk of the count is one generator fact (the
adapter prefix) and the rest is prose and records that are read by people and stay as
written.

Why this way, the rung ladder, applied to the generator rather than the instance:

- **Derive** the value from a source already present in the checkout, the manifest or the
  CI event, so that nothing restates what something else already knows.
- **Per-checkout file**: a file the tree never tracks, behind a tracked example, read the
  same way by every reader that needs it; the merge-bot instance is the proven shape, and
  the delivery nodes carry its mechanics. Where the reader is an IDE or a vendor CLI rather
  than agent tooling, the tree-side shape is the same and no shared reader is needed: the
  readers are heterogeneous, the tree shape is one.
- **Environment** where the value is deployment-time.
- **Service-side binding** where the service owns the relationship: repository variables,
  the code-quality project bound to the repository, the repository's own default branch as
  the authority for what its workflows run on.
- **Tree-bound residue**: the few surfaces the platform reads from the tree with no lower
  home (code-owner routing, README badges, manifest provenance, licence attribution),
  enumerated in one adoption note written for an unnamed reader, edited once and
  deliberately, and held under the validator so the list cannot grow unnoticed.

How each rung is built — file formats, schemas, resolution points, trigger shapes — is the
delivery nodes' to design at pickup; this node fixes only which rung a pin takes and why.

Declared identity homes are exempt by enumeration, never by per-file allowlist: the Oak
identity pack, the corpus and curriculum types, the product band per ADR-227, package
provenance and the publishing scope, generated adapter carriers, and dated-record
directories. Genericising any of these is the frame misapplied. `.example` files are
templates, not homes: the validator holds them to placeholder-only values instead of
exempting them, so a canonical key cannot creep back into what a cold clone copies.

The ratchet is structure, not vigilance: a validator in the existing identity-naming
family that knows the set of organisation-identity literals still standing in mechanism
layers and refuses both growth and substitution — a new literal, or one organisation's
literal swapped for another's in the same place, reddens at pre-push and on the PR — and
that runs strict once only the enumerated residue remains. It sits in the aggregate the
pre-push hook and CI already run, beside the machine-local-paths and identity-naming
validators: the three arms of Any User, Any Machine. Its contract is the delivery node's to
design; the property it must hold is stated here.

What we deliberately do not do: build a per-fork re-identification tool that rewrites
tracked files from a manifest (it makes the fork the permanent carrier of divergence, a
cost already measured on this line); genericise the canonical organisation's identity
pack, corpus, product band, package provenance or publishing scope (those are the design
system working and ADR-227's rulings; thin configuration, not zero); build mechanism for
product-band pins that extraction deletes; tokenise or sweep prose with a rewriter (prose
names canonical ids and a generated index carries the projected names); adopt the alias-
prefix proposal (it leaves the prefix hand-pinned, doubles the adapter set against the
listing budget, and has no ratchet); re-true dated records; name any fork on upstream
surfaces; or accept a checklist without a validator.

Sequencing: these cures are independent of the extraction lane and cheap now; they proceed
beside it, and the product-band deletions ride the extraction lane's per-box design step.

## Success looks like

- The owner-named instance is done: the code-quality binding is untracked behind a
  tracked example, this checkout's copy names its own organisation and project, and the
  rule that names the key now points at the binding file.
- Every cured tool, given a fixture identity naming a never-used organisation, emits that
  organisation's values; given no identity file, it fails naming the example. A silent
  fallback to the canonical organisation anywhere is the defect restated.
- Every agent-tools reader takes identity the same way, from the same per-checkout source;
  the IDE and vendor-CLI files share the tree shape.
- The validator's standing set shrinks to the enumerated residue and runs strict from
  there; a re-introduced or substituted literal reddens at pre-push or on the PR, never
  first on a contributor's machine.
- A cold clone under a third organisation's name reaches green on the local gate estate
  through the adoption note alone, with a clean working tree. This is the executable proof
  of the outcome; until it is run, the outcome is asserted, not measured.
- The adapter prefix changes with one edit plus regeneration, and a fresh session on each
  host, given a rule that names a skill by canonical id, invokes the projected name.

Not claimed: that a cold clone of upstream runs credentialed surfaces without its own
credentials (the reader served is an organisation on its own line with its own service
bindings); ADR-227's registry reader; the product band's own pins until cut-over (a
fork's app-level error-reporting configuration still names the canonical organisation
until the product leaves, and this node names that rather than building for it); removal
of the canonical organisation from its declared identity homes; a scope rename or
publishing under another scope; the tree-bound residue reaching zero rather than an
enumerated minimum. One measure the inquiry proposed is dropped as uninformative: the
fork's tracked divergence from upstream in mechanism files is already empty today while
every pin is live, because the fork runs on the canonical organisation's pins; the signal
of this node's success is the per-checkout files differing, not the tracked ones.

## Why strategic

Serves FRAME-2: the framework is a value stream others adopt, and adoption means running
the repository as one's own. The same split serves TOOLS-2 (open by default, no lock-in)
through the design-system node; the two are one architecture seen from the framework side
and the toolkit side, and this node takes the framework side because the pins it cures are
the estate's — agent tooling, root dotfiles and workflows, harness client configs, rules
and skills — not the toolkit's packages. It converts the 2026-09-03 concept exploration
("estate identity lives below the tree") from a memory into ratified structure, and it is
the third arm of Any User, Any Machine.

## Falsifiability

- **Identity-№N transposed.** Adding an organisation requires a tree change. A clone
  under a third organisation's name, after only copying each tracked `.example` to its
  untracked twin, filling the environment from `.env.example`, and setting service-side
  bindings and repository variables, runs the full local gate estate, connects its IDE
  binding, mints its merge bot and measures its own PR register with a clean working tree.
  Any tracked-file edit needed outside the enumerated residue falsifies the node and names
  a missed pin.
- **Ratchet.** The validator's standing set grows, a literal is substituted for another
  organisation's in place, or a literal lands in a mechanism layer with the validator
  green; any of these means the vocabulary or the scope is wrong. The delivery node that
  builds the validator carries the mechanical form: a known-positive test over the
  pre-cure tree that reports exactly the censused pins and nothing in the exempt homes.
- **Per-tool proof.** A cured tool given no identity file falls back to the canonical
  organisation instead of failing with the example's name, or given a fixture identity
  emits any value it did not read from it.
- **The constrained surface grows.** The residue list gains a member, or a second
  mechanism is minted for a class one already serves — the design node's "constrained
  surface growing faster than the mechanism beneath it".
- **Sync cost.** The next three upstream syncs conflict inside the identity set, or the
  fork needs a regeneration-and-commit step per sync for a tracked identity value. A
  conflict in a tracked identity file is a pin; recurring regeneration re-opens the
  tracked-versus-per-checkout decision below.

## Decisions for the owner (presented, not absorbed)

**Note (2026-09-08, at ratification).** The owner ratified this node on 2026-09-08 ("Ratify all
six"), which is the first item below, "Ratify the node", resolved: it ratifies the outcome and
the bet — not a choice among the five remaining decisions. Each of those five stays owner-held
and is taken at pickup: the delivery node that instantiates it carries it as an `owner_gates`
row (awaiting, clears_when, an absolute expiry) and governs no work until it clears. The decision this node carries is recorded permanently as ADR-231 (organisational
identity is held below the tree); permanent doctrine cites that record, and this node cites it.

- **Ratify the node.** The tree carries nothing organisation-specific outside its declared
  identity homes and an enumerated residue; organisational identity lives below the tree
  by the rung ladder; the validator holds it.
- **The adapter prefix's home.** A tracked setting (the canonical tree says its prefix; a
  fork carries one deliberate line plus regenerated files and regenerates after every
  upstream sync that touches a skill) or a per-checkout setting with install-time,
  untracked projections and settings block (the merge-bot shape; amends ADR-125's
  committed-adapters decision and changes what hosts that read the tree without an install
  can see). The pending `oak-` to `e-` ask is subsumed by this decision; the alias proposal
  is refuted.
- **The Skill permission block** in the tracked harness settings: generate a managed block
  of documented-form entries (pre-approval convenience; the harness does not require them)
  or delete the entries; whether the undocumented `:*` twins survive awaits a live trial.
- **The publishing scope.** Other organisations consume the published packages (ADR-227,
  no change) or fork-and-publish under their own scope (the scope becomes one config value
  and provenance derives from it). This node treats the scope as canonical identity unless
  ruled otherwise.
- **The fork's branch on upstream surfaces.** Upstream's workflow triggers and one rule
  have named this fork's working branch since 2026-08-22, by the owner's own commit. The
  derived trigger shape (default branch from the event) removes the need; whether upstream
  keeps naming the fork is the owner's, against the later ruling that forks are never named
  on the canonical organisation's surfaces.
- **Sequencing against the extraction-first priority.** Confirm these platform cures run
  beside the extraction lane, with the product-band pins deleted by extraction and the one
  skill-name collision with a served product tool resolved at that lane's boundary.

## Delivery

Delivery plans serving this node declare `serves: organisational-identity-below-the-tree`
— enumerate them by search, never by a hand-kept list. The first, owner-named, is the
code-quality binding; the shape it lands is the shape every later slice reuses. Milestones
live in Linear as named observable states; this node points at them, never mirrors them.
