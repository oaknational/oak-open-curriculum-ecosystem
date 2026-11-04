# ADR-231: Organisational identity is held below the tree

- **Status:** Accepted (2026-09-08, the owner's numbered card answer "Ratify
  all six" over the strategic plans, recorded on the ratified plan's stamp
  and in the pull request that landed it). This record homes the decision so
  that permanent doctrine can cite a record rather than a plan; the plan that
  carries the outcome, the bet and the delivery sequencing cites this record.
- **Date:** 2026-09-08
- **Related:** [ADR-227](227-oak-product-in-its-own-repository.md) — the
  product band leaves with the product; this decision applies its line one
  level lower, to the platform's own estate identity;
  [ADR-131](131-self-reinforcing-improvement-loop.md) — the self-referential
  property under which every canonical rule cites the record it
  operationalises.

## Context

This repository is general mechanism that any organisation can run as its own:
first the fork this line is, then any third. The pins that broke this line's
own checkout on its first day as a fork were platform pins, not product
residue — a tracked code-quality binding, a repository constant in a
throughput register, harness client configurations naming a vendor
organisation, rules naming a bot by slug and number, and a rule naming a
branch as the pull-request base because the repository's default branch had
been another. The owner's kernel (2026-09-03): "what we are doing here is
making the repo more readily usable by other orgs, so accidentally pinned Oak
specific config should be replaced with non-pinned config, and example files";
the per-checkout merge-bot configuration landed the same day at the word "this
is per-checkout config, it should not be in version control". The standing
principle this extends is Any User, Any Machine (owner-set 2026-07-21), which
this decision gives a third reader: another organisation, on its own accounts.

## Decision

**Who runs this tree is never in the tree.** Organisational identity —
repository owner and name, the merge bot and its app, the committing author,
the code-quality organisation and project, the error-reporting organisation,
chat channels, the ticketing workspace, the default branch, the adapter prefix
— is held below the tree: derived from a source already present, read from a
per-checkout file behind a tracked example, taken from the environment, or
bound on the service side. General mechanism reads it, per rung, through one
reader at the clone's primary checkout and carries no default naming any
organisation.
The tree's declared identity homes — the canonical organisation's identity
pack, the corpus and curriculum types, the product band per ADR-227, package
provenance and the publishing scope, generated adapter carriers, dated-record
directories — remain the canonical organisation's by enumeration; everything
else is mechanism.

Three consequences bind doctrine directly:

1. **Mechanism names no organisation.** A rule, skill, validator or workflow
   states its mechanism for an unnamed organisation; a named organisation
   appears only in a worked instance, a dated record or a declared identity
   home.
2. **The default branch is derived, never a literal.** The repository's own
   default branch is the authority for what its pull requests target and its
   workflows run on; every reader derives it at the moment of use (the remote
   HEAD refreshed and read; or the repository named explicitly to the hosting
   service's query) and no tracked mechanism file writes the name down.
3. **A pin takes the first applicable rung of a fixed ladder** — derive;
   per-checkout file behind a tracked example; environment; service-side
   binding; enumerated tree-bound residue — applied to the generator of the
   pin, never instance by instance. How each rung is built is the delivery
   nodes' to design; which rung a pin takes, and why, is fixed here.

## Consequences

- The retired rule that named a branch as every pull request's base is
  replaced by a general rule on downstream checkouts (never reading or writing
  the upstream's surfaces without the owner's word; every repository-scoped
  call naming its repository; the base derived), which cites this record.
- A validator in the identity-naming family holds the set of
  organisation-identity literals still standing in mechanism layers and
  refuses growth and substitution, running strict once only the enumerated
  residue remains; its contract is the delivery nodes' to design, the property
  is fixed here.
- Adoption by another organisation costs the hours to copy examples, set
  environment and bind services; continuation costs nothing per upstream sync,
  because no tracked mechanism file carries their name or the canonical one.
- Validation maturity: at the date of this record the decision is ratified
  and its first instances are landed (the per-checkout merge-bot
  configuration; the default branch derived by the rules and skill that read
  it). Deferred, explicitly: the one shared reader per rung — today each
  reader derives its value inline; the census of identity literals still
  standing in mechanism layers; and the validator that refuses their growth
  or substitution. Until those land, "one reader" is the decided shape, not
  a satisfied invariant.

## The owner's word

The strategic plan on organisational identity below the tree was ratified on
2026-09-08 by the owner's numbered card answer, verbatim: "Ratify all six";
its kernel quotes the owner's words of 2026-09-03 given above. This record
carries the decision; the plan carries the outcome, the bet and the delivery
sequencing and cites this record; a later amendment to this record names its
date and its owner word here.
