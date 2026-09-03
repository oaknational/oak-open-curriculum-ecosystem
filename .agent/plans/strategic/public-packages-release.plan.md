---
id: public-packages-release
node_type: strategic
name: "Public packages — clock-aligned versioning and automatic publishing"
overview: >-
  Public packages ship from the existing conventional-commit pipeline
  with versions that mean something: internal-only change stops minting
  releases, publishing is fully automatic, and version lockstep follows
  lifecycle-clock groupings once the estate splits along them.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: TOOLS-2
impact_areas:
  - packaging-and-distribution
  - practice-and-estate
gate_expiry_default: P21D
depends_on: []
owner_gates: []
tickets: []
last_updated: 2026-08-26
---

# Public packages — clock-aligned versioning and automatic publishing

## Outcome

Consumers install Oak's public packages from the registry, and every
version number they see is honest: a release exists because something a
consumer can feel changed, its semver grade matches the change, and the
whole chain — analyse, version, changelog, tag, publish — runs with zero
manual steps on merge. Version lockstep is scoped to groups of packages
that genuinely change together (one lifecycle clock per group), so a
bump never ripples into a package whose contents did not move. The
owner's commissioning requirement, verbatim (2026-08-26, direct to the
authoring seat): "fully automatic, with excellent developer experience".

## The bet

Serving TOOLS-2 (open by default, no lock-in): openly licensed code is
only open in practice when it is consumable, and consumable means
published with versions a stranger can trust. Three linked wagers:

1. **The tool we have is the tool we need.** Versioning is already
   fully automatic here — semantic-release over enforced conventional
   commits, chained behind green CI (`.releaserc.mjs`,
   `.github/workflows/release.yml`, the ratified `release-process`
   runbook). One recorded defect qualifies that chain and stands as a
   publish-day precondition: the release workflow's checkout pins no
   `ref`, so it releases the default branch's current tip rather than
   the CI-validated `workflow_run` head SHA — a merge racing the CI
   run could be versioned unvalidated. Tolerable while nothing
   publishes; the checkout is pinned to the triggering SHA (or the
   tip revalidated) before the first real publish. Neither pnpm
   workspaces nor Turbo does version
   computation, and no third tool (Changesets, Lerna-family,
   multi-semantic-release) earns admission while the estate publishes
   nothing: Changesets trades away full automation by design
   (hand-authored changeset files, a human-merged version PR), and the
   multi-package semantic-release forks are community glue with a poor
   maintenance record. A new tool is admitted only on evidence — a
   real external consumer measurably hurt by the lockstep grouping of
   the day — the second-consumer discipline applied to release
   engineering.
2. **Churn is a configuration defect, not a tooling one.** Today's
   release rules mint a patch for nearly every commit type (`docs`,
   `chore`, `style`, `test`, `ci`, `build` all bump — hence a 1.175.x
   counter). That is fine for an internal release identity and wrong
   for a published stream, where every bump is a notification to
   consumers. The refined policy has two conjuncts, both required: a
   published package's version moves only when a change actually
   reaches that package's shipped surface (releaseability derives from
   the affected published packages — an internal `fix` or `feat` that
   touches no published package mints nothing, whatever its type), and
   the conventional-commit type then grades the bump for the packages
   the change does reach. Type alone gates nothing: narrowing the
   type→release mapping without the affected-package test would keep
   minting public releases from internal fixes.
   The internal release-identity chain (deploy attribution, Sentry
   release identifiers per ADR-163) keeps whatever counter it needs —
   refining the public stream must not blind the internal one.
3. **Lockstep is honest exactly within a lifecycle clock.** A shared
   version among packages that tick together is truthful and cheap; a
   shared version across unrelated clocks is noise. The Oak Toolkit
   Atlas (`.agent/reports/repo-architecture/oak-toolkit-atlas.html`,
   §8) designs "one clock per package" (Change 2) and defers exactly
   one residue from its absorbed delivery-plane change (Change 4):
   "the release mechanism itself — per-package versioning and
   publishing against today's single-version pipeline". This node is
   that residue's home. As the estate splits along clock groupings,
   versioning groups follow the same seams — one version stream per
   clock-group, lockstep within, independent across — so the grouping
   decision is made once, structurally, instead of per release.

Deliberately not doing: adopting a second versioning/publishing tool
now; publishing before a package carries a publishable manifest and a
deliberate licence surface; independent per-package semver ahead of any
consumer who needs it; re-deciding the repo-split question (that
decision and its flip condition live with the toolkit re-architecture,
not here).

## Alignment — the survey line this node rides

Dated provenance, so the sequencing is checkable rather than
remembered. The workspace survey line ran census (owner-carded
2026-08-14) → basis regrounding (owner correction 2026-08-17: the
34→66 target rejected as a constraint) → the Oak Toolkit Atlas change
set (owner-ruled 2026-08-19), whose successor strategic node
`toolkit-re-architecture` was ratified 2026-08-19 superseding
`workspace-reorganisation-programme`. At this node's authoring date
that ratified successor lives on the upstream coordination branch
`coordination/2026-08-19-1651ad` (draft fold PR oaknational#915) and
has not yet reached either repository's main line; this fork's estate
still carries `workspace-reorganisation-programme` as the standing
programme node. When the successor lands here, this node's clock-group
wager binds to its seam and carrier contract by name; until then the
Atlas §8 record is the design authority this node cites.

Sequencing consequence: the version-config refinement (wager 2) is
independent and can deliver first; publishing (wager 1's proof) waits
on the seam's manifest gate or a deliberate per-package equivalent;
clock-group versioning (wager 3) waits on the clock-aligned split
itself.

## Success looks like

- A releasable merge to the default line publishes the public packages
  with no human step, and failure handling is honest about npm's
  non-transactional registry: a failed publish is loud (the existing
  release-failure alerting) and convergent — per-package publishes are
  idempotent to retry, so an interrupted multi-package group resumes to
  completion on re-run rather than claiming an atomicity npm does not
  offer.
- The published stream's bump rate matches real change — measurable as
  zero releases minted from internal-only merges (docs, chore, CI)
  after the refinement lands, against ~every-merge today.
- Each public package's version is shared exactly with its clock-group
  and moves independently of other groups; the grouping is documented
  where consumers look (the package READMEs), not only in this estate.
- The toolkit re-architecture's extraction rehearsal (its rung-2
  proof: an Oak product workspace built in a fresh repo from registry
  dependencies alone) consumes versions this pipeline published —
  publishing is the exercised proof of separability, not a claim.
- Developer experience stays at today's bar: contributors write
  conventional commits and nothing else; no per-PR release ceremony
  exists.
- Not claimed: npm package naming and per-package licence edges (owner
  questions at their migration tranches); that today's semantic-release
  remains the mechanism forever (the admission trigger for a
  replacement is named in wager 1); any date for the clock-aligned
  split itself.

## Delivery

Delivery plans serving this node declare
`serves: public-packages-release` — enumerate them by search, never by
a hand-kept list. The banked order from §Alignment: version-config
refinement first (deliverable against the current single-version
estate), then first-publish behind the manifest gate, then clock-group
version streams at the split. Milestones live in Linear as named
observable states; this node points at them, never mirrors them.
