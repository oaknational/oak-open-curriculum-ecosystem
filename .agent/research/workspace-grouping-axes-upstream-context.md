# Workspace grouping axes — upstream context vs lifecycle

Date: 2026-08-17. Provenance: owner design musing, direct to the survey
lane seat (Nautilus calls Plankton, c6d48b), while reviewing the
reorganisation map artifact. Verbatim:

> I think bulk data operations belong together and possibly grouped with
> the API workspaces... I am not sure... certainly if we group by
> external service dependency the bulk data and api are two aspects of
> the same external service

This note records the exploration, the grounding evidence, and a
recommendation on the banked taxonomy question. It changes nothing by
itself: the census round-2 target inventory
(`.agent/reports/workspace-classification-census/target-inventory.json`,
owner-confirmed 2026-08-14) stands, and its first
`openQuestionsForOwner` entry — tier homes for the path-less
extractions — is exactly where this direction lands when the owner
rules.

## Grounding: the claim is the upstream's own self-description

- `apps/oak-search-cli/scripts/download-bulk.ts` downloads from
  `https://open-api.thenational.academy/api/bulk` — the bulk endpoint
  is a path **of the API**, on the same host that serves the OpenAPI
  spec the codegen chain consumes.
- Both access modes authenticate with the same `OAK_API_KEY`.
- The estate consumes this one upstream through **three taps on three
  clocks**: the OpenAPI spec (codegen clock — upstream-deploy),
  bulk downloads (ingest clock — data refresh), and live runtime
  queries via `oak-curriculum-sdk` (request time).

So "two aspects of the same external service" is verifiably true, and
understated: it is three aspects.

## The axes, separated

The tension the musing surfaces is between two grouping axes that the
round-2 inventory partially conflated because only one of them was ever
put to the owner:

1. **Lifecycle / regeneration clock** — the axis the owner's round-1
   words drove ("tidy the lifecycle of the codegen"), codified in the
   generated-separation policy's two-clocks test: artefacts on
   different regeneration clocks never share a workspace. This axis
   governs **workspace boundaries**.
2. **Upstream bounded context** — which external service's change
   breaks you. This axis was never adjudicated; the fleet distributed
   the Oak-platform acquisition surfaces across `packages/codegen/`
   (openapi-schema-source), path-less (oak-bulk-data), and
   `packages/search/` (bulk-ingest) on lifecycle-role grounds. This
   axis naturally governs **directory placement** — where siblings
   live, so one upstream's change lands in one place.

A scope limit found by trying to break the axis (free-play discard,
recorded per the confabulation guard): grouping by external dependency
only earns its keep for **proper-noun upstreams** — a specific bounded
context like the Oak curriculum platform, with its own deploy clock,
credential, and vocabulary. It fails for **commodity dependencies**
(Elasticsearch, Sentry, PostHog): an "elasticsearch/" family would
group by technology, not by change-cause, and the census already
handles those with the oak-vs-reusable dimension (es-ingest-core is
deliberately generic BECAUSE any ES cluster is substitutable; the Oak
platform is not).

## Recommendation (owner decision pending)

- **Keep the workspace boundaries as inventoried.** The two-clocks test
  holds: `openapi-schema-source` and `oak-bulk-data` stay separate
  workspaces (different regeneration clocks), as do the four generated
  artefact homes.
- **Group the Oak-platform acquisition family by upstream context at
  the directory level.** The natural shape: the two acquisition
  workspaces (`openapi-schema-source`, `oak-bulk-data`) become
  siblings under one root family (working name `packages/oak-data/` —
  the anti-corruption layer around open-api.thenational.academy), and
  this resolves `oak-bulk-data`'s open home. The `packages/generated/`
  tier stays as ratified (the DO-NOT-EDIT defect-class kill is worth
  more than family adjacency there; the `oak-api-*`/`oak-bulk-*` name
  prefixes already carry provenance inside it).
- **The sequencing hints already point this way**: the bulk-clock
  family lands as one coordinated tranche — the musing extends that
  cohesion from tranche-time to directory-time.

Decision route: the tier-homes open question is answered either at an
owner card before the first acquisition-family mint, or at that
tranche's delivery node with the owner present. This note is the
design input; the ruling is his.

## 2026-08-17 addendum — the basis panel refines this note

The owner widened the question the same day ("what are the axes we
have, and what is our best guess at the optimum basis set?"). A
four-proposer adversarial panel (Parnas/change-cause, DDD/bounded-
context, dependency-graph, Conway/navigation priors; one
cross-examiner) ran over the ratified inventory. Full output:
[`workspace-basis-panel-2026-08-17.json`](workspace-basis-panel-2026-08-17.json).
Two findings supersede parts of this note's recommendation:

1. **Upstream bounded context is not an axis** (all four proposals
   independently). A proper-noun upstream is a *source of clock
   values*: the Oak platform's three taps are three freshness events,
   and the inventory already splits on the clocks. The
   commodity-vs-proper-noun half dissolves into the Oak-specificity
   axis (depending on a swappable commodity does not brand code — the
   es-ingest-core ruling generalised).
2. **The acquisition-pair grouping lands as capability-family
   placement, not a new root.** `openapi-schema-source` and
   `oak-bulk-data` home together under the curriculum-data family at
   directory level 2; no `packages/oak-data/` root is needed. The
   cross-tap unity (one service, one credential, one migration blast
   radius) is carried by the shared env schema and a platform-
   migration runbook, not by the tree.

The panel's convergent basis — three intensive axes (change-clock,
Oak-specificity/travel, byte-authorship: exactly the census's own
`dimension` vocabulary) plus audience/deployment class carried by tree
level 1 — and the open forks (the generated tier's carrier, the
`packages/codegen/` category error, the es-ingest-core shelf, the
clock-enum refinement) are recorded in the panel JSON's `challenge`
section; the owner-facing rendering lives on the reorganisation map
artifact. Owner ruling pending on the forks.

## Pointers

- [`workspace-basis-panel-2026-08-17.json`](workspace-basis-panel-2026-08-17.json)
  — the four proposals + cross-examination, verbatim.
- `target-inventory.json` → `openQuestionsForOwner[0]` (tier homes),
  `sequencingHints` (bulk-clock family as one tranche).
- `.agent/plans/strategic/workspace-reorganisation-programme.plan.md`
  (delivery discipline: per-tranche nodes cite inventory rows).
- Reorganisation map artifact (owner-facing visual; carries the
  layered-reliance view and the basis proposal this note's analysis
  feeds).
