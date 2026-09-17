# ADR-227: The Oak MCP product is built in its own repository from packages published here

- **Status:** Accepted (2026-09-03, the owner's word "Ratify all thirteen" over
  the numbered list of the pull request that landed it, item 1). This record
  carries rulings the owner gave on 2026-09-02 and 2026-09-03, quoted in full
  below. Nothing in it is validated by a built consumer yet — see
  §Consequences, validation maturity.
- **Date:** 2026-09-03
- **Related:** [ADR-041](041-workspace-structure-option-a.md) — the workspace
  tiers of this repository, which stay for everything that remains;
  [ADR-108](108-sdk-workspace-decomposition.md) — the SDK decomposition
  whose generic and Oak halves publish separately;
  [ADR-154](154-separate-framework-from-consumer.md) — the principle this
  decision applies at repository scale;
  [ADR-159](159-per-workspace-vendor-cli-ownership.md) and
  [ADR-163](163-sentry-release-identifier-and-vercel-production-attribution.md)
  — the error-reporting project that already carries the new repository's
  name, an owner item before that repository is created.

## Context

This repository builds, tests, releases and deploys the Oak MCP product —
the HTTP MCP server and the search service it depends on — in the same tree
as the reusable toolkit, Oak's organisation-wide packs, the demos, the
agentic engineering Practice and all agent tooling: some fifty workspaces,
and not a tree suited to junior developers. Oak intends to hand the product
to a product squad. The owner's purpose, verbatim (2026-09-02): "to hand over
a maintainable surface for the 'MCP App' to a squad, without burdening them
with the agentic engineering material or the libraries etc. ... the new repo
must be functional, if devs need to come to this repo to make significant
changes that is a problem. We are in no way constrained to the workspaces we
happen to have today, I am expected (sic) multiple workspaces to be split,
including non-app workspaces".

On 2026-08-19 the owner ratified the shape the estate is heading for: two
families of code — a generic toolkit, publishable by default, and Oak's
packs and assemblies, enumerable and measurably thin — held apart by one
seam of three mechanical gates (imports, vocabulary, manifests), with a
demonstration ladder whose second rung is an Oak product built in a fresh
repository from registry dependencies alone. On 2026-09-02 he ruled how that
rung is built (thirteen rulings, §The owner's rulings) and on 2026-09-03
when (two rulings, same section). The design and sequencing of the work
live in the plan estate under `.agent/plans/`, whose index is the entry
point; those plans cite this record.

Until this record those decisions lived only in plan nodes, strategy pages
and thread records. Plans are execution instructions, safe to delete once
their work is done; a decision that lives only there has no durable home.
This record is the home.

## Decision

1. **Two repositories, one product boundary.** The Oak MCP product — the
   MCP server together with its search instance, which the owner ruled
   "effectively part of the MCP app" (ruling 1) — is built, tested,
   released and deployed from its own public repository,
   `oaknational/oak-open-curriculum-mcp` in the `oaknational` GitHub
   organisation (ruling 5), as a small set of thin workspaces carrying only
   the product's configuration, content and domain logic. This repository
   is the platform beneath it: the toolkit, the curriculum and MCP-family
   machinery, the Oak corpus and Oak's curriculum types, the design system
   and Oak's identity pack, the demos (ruling 9), the Practice and all
   agent tooling (ruling 6).
2. **The boundary is published packages.** Everything the product consumes
   from here reaches it as a versioned package on the public `@oaknational`
   npm scope — code under MIT, content under the Open Government Licence,
   any included Oak branding under Oak's branding usage guidelines (ruling
   2). The product repository builds from registry dependencies alone: no
   path, workspace or git-URL import of this repository. Its need to come
   here is rare by construction and, when it happens, takes one shape — an
   issue on this repository, a fix and release here, a dependency-update
   pull request there (ruling 13).
3. **Not a move of today's workspaces.** Each box the product touches is
   cut along one line — the thin product band above, the reusable and
   Oak-wide mechanism below (ruling 11) — decided per box on evidence at
   the lane's design step; what leaves is the product band, assembled as
   new thin workspaces, and a box may stay whole here (rulings 10 and 12).
   ADR-041's tiers stay for what remains.
4. **The product repository is for junior developers.** Every aspect of it
   is aimed at them (rulings 7 and 8): a minimal, streamlined Practice of
   its own, on rails. This repository is not suited to junior developers,
   and the design is judged by how rarely the squad needs it (ruling 13).
5. **One release version per repository, for now** (ruling 3). Separating
   the toolkit's clock from the products' clock is a later decision,
   recorded here by dated amendment when it is taken.
6. **The extraction runs before the estate-wide seam migration, and it is
   the seam's second-rung proof, not a rehearsal** (the 2026-09-03 order
   ruling). That word reverses the delivery order the owner had banked on
   2026-08-19, which put the seam migration first; the remainder of the
   estate re-homes after the product has left. The order reopens only if
   one of the lane's own falsifiers fires: the extraction test finds a
   member of the product's closure that can be neither published nor
   moved, or the seam's gates cannot be enforced per package over a
   published subset.

The public statement of this commitment sits on the strategy index at the
owner's word of the same day (the 2026-09-03 priority ruling). The ranking
of this lane against the estate's other lanes lives there, dated, and never
in this record.

## Consequences

- **What this repository becomes.** A platform whose generality is
  demonstrated by a real registry consumer rather than asserted: the
  toolkit, Oak's packs and the Practice stay; the product's change surface
  becomes the squad's. The ladder's third rung — a non-Oak service
  assembled from published packages alone — remains the honest test and is
  not claimed by this decision.
- **Publishing becomes an obligation.** Today no package is published:
  `npmPublish: false` on both npm plugin entries of `.releaserc.mjs`, and
  `npm view @oaknational/curriculum-sdk version` returned not-found on
  2026-09-03. The first publish and the per-package finish checks the
  product depends on are prerequisites of the boundary, not consequences of
  it.
- **Two repositories to keep honest.** The upstream contract — an issue
  here, a fix and release here, an update there — replaces co-editing. The
  rate at which the squad needs this repository is measured after cut-over
  and is this decision's own success metric.
- **Records that change at the lane's slices**, each by dated amendment
  when the tree changes and never before: ADR-041's apps tier, at the
  retirement of the moved product workspaces; ADR-108, at the first
  Oak-organisation pack; the release-process runbook's rollback clause,
  which today rests on publishing being disabled; the operations pages that
  name the deploy target. The error-reporting project that already carries
  the new repository's name (ADR-159, ADR-163) is renamed or shared at the
  owner's word before the repository is created.
- **Open, deliberately.** Where the `oak-under-the-hood` orientation content
  lives after the split is the owner's open question for the lane's
  implementer (ruling 4). Whether the product's search instance shares this
  repository's service or its indexes is required neither way (ruling 13).
- **Validation maturity.** Decided is not validated: at this record's date
  nothing has moved, nothing is published, and the product repository does
  not exist. Acceptance binds the shape; the lane's owner gates — the
  ratified design record, the repository's creation and its name, publish
  rights for the scope — bind the execution. The means (order, slices,
  criteria, instruments) live in the plan estate, which cites this record
  and whose nodes are safe to archive when their work is done.

## The owner's rulings

Verbatim, as captured on the day each was given; this record is their
durable home.

Shape, 2026-09-02:

1. "yes the search app is effectively part of the MCP app"
2. "the published packages will be on the @oaknational org scope, public,
   code is MIT, content OGL, any included Oak branding is covered by the
   Oak branding usage guidelines... so same as everywhere else"
3. "releases: up to the implementing person, I would go with one release
   version per repo for now"
4. "oak-under-the-hood, leave it as an open question for whomever picks up
   the plan, maybe we split it into two separate skills/tours"
5. "all Oak work is public and open by default, the name will be
   oak-open-curriculum-mcp in the oaknational github org"
6. "all agent tooling stays with the primary repo, not the oak app repo"
7. "the oak app repo will have a minimal, streamlined Practice designed for
   on the rails use by less experienced devs"
8. "in fact that is a requirement, every aspect of the oak app repo must be
   aimed at junior devs"
9. "all of the demos stay with the core repo, only the mcp app and search
   app and any thin but absolutely necessary layers move to the new repo"
10. "there is no way that the requirements are met by shuffling existing
    workspaces, and I said that from the very beginning"
11. On the diagram: "the Oak parts are above the dotted lines, the reusable
    parts below, and all the different heights represent is that the
    oak-specific config or oak-specific domain logic will be different,
    but always thin, amounts in each case, often zero at the lower levels"
12. "in each existing workspace it may be reasonable for the entire
    workspace to stay in this core repo, not every workspace will require
    a split"
13. On the design thought experiment — three apps (the MCP product, a
    second Oak homework app, a library service built with the Innovation
    Kit that is not an Oak app): "only the MCP app and friends go in the
    new repo, _but_ the need to dip into this repo to fix things must be
    strongly minimised in order to satisfy the 'suitable for junior devs'
    requirement, because this repo is not suitable for junior devs"; and on
    search: "there is no need for it to be the same service, or have the
    same indexes"

Order and priority, 2026-09-03:

- "Extraction first. That change of priority is the point of this planning
  work."
- "Also state it as the current priority" — the public statement on the
  strategy index.
