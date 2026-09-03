---
id: oak-open-curriculum-mcp-extraction
node_type: delivery
name: "Design the extraction of the MCP app product into oak-open-curriculum-mcp"
overview: >-
  The design step of the extraction lane: cut the Oak MCP product out of
  this repository along the line that runs through every workspace it
  touches — the thin product slice above, the reusable and Oak-org parts
  below — and assemble the slices in the public repository
  oaknational/oak-open-curriculum-mcp, aimed at junior developers, building
  from registry dependencies alone and rarely needing this repository. This
  node delivers the ratified design record, the measuring instruments and
  the one-page delivery node for every later step of the lane.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: toolkit-re-architecture
impact_areas:
  - packaging-and-distribution
  - practice-and-estate
  - guidance-content
  - analytics-and-observability
  - conformance-and-standards
  - design-system
tickets:
  - MCP-661
depends_on:
  - plan: toolkit-publish-mechanism
    kind: blocking
owner_gates:
  - awaiting: owner-decision
    clears_when: >-
      The owner ratifies the design record slice D0a produces — the per-box
      dispositions under the five-class test with their measurements, the
      target workspace set of the new repository, the thinness ceilings, the
      finish list with any dated exemptions, the search instance boundary
      (including project-per-app or shared), the tool split, the template's
      form and the dip threshold the move step must meet — together with the
      delivery nodes D0a authors for the lane's later steps — or amends it on
      the ticket.
    expires: 2026-09-23
  - awaiting: owner-decision
    clears_when: >-
      At ratification the owner names who creates the public repository
      oaknational/oak-open-curriculum-mcp and says whether the existing
      error-reporting project of the same name (ADR-159, ADR-163) is renamed
      or shared; the scaffold step asserts the repository exists at its
      start, and the cut-over step's own node carries the deploy-target gate.
    expires: 2026-09-23
last_updated: 2026-09-02
---

# Design the extraction of the MCP app product into oak-open-curriculum-mcp

## Goal

This node is the design step of the extraction lane — a delivery node is one
step of a lane, never the lane itself (the plan-node schema) — and it
delivers three things: the design record the owner ratifies, the instruments
that measure the lane, and a one-page delivery node for every later step,
chained by `depends_on`, each carrying the slices and the lane criteria this
node banks for it under §The lane's steps. The later steps' contents depend
on the design decisions, which is why their nodes are this step's output and
not authored ahead of it. The lane's outcome, which those steps then land:

The Oak MCP product — the MCP server and its search instance (ruling 1) —
lives in the public repository `oaknational/oak-open-curriculum-mcp` as a
small set of thin workspaces made of the product's configuration, content and
domain logic over published packages, and builds, tests and deploys there from
registry dependencies alone. Every aspect of that repository is aimed at
junior developers (rulings 7 and 8), with a minimal, streamlined Practice of
its own, and the need to touch this repository is rare by construction and
junior-safe when it happens (ruling 13), because this repository is not
suitable for junior developers. Everything reusable, and everything Oak-wide,
stays in this repository and is published to the `@oaknational` scope: the
toolkit, the curriculum and MCP-family machinery, the Oak corpus and Oak's
curriculum types, the design system and Oak's identity pack, the demos, the
Practice and all agent tooling. A product squad makes significant product
changes in the new repository without touching this one. The owner's purpose,
verbatim: "to hand over a maintainable surface for the 'MCP App' to a squad,
without burdening them with the agentic engineering material or the libraries
etc. ... the new repo must be functional, if devs need to come to this repo to
make significant changes that is a problem. We are in no way constrained to
the workspaces we happen to have today, I am expected (sic) multiple
workspaces to be split, including non-app workspaces".

This is rung 2 of the demonstration ladder `toolkit-re-architecture` sets ("an
extracted squad consumes it from the registry — the extraction test is an oak
product workspace building in a fresh repo from registry dependencies alone"),
made the product rather than a rehearsal. It is not a move of today's
workspaces: today's apps are mechanism with a thin product layer inside them
(§Evidence), and a move would hand junior developers the mechanism.

## User groups and value

- **The product squad.** A repository they own end to end: the product's
  configuration, content and domain logic in a few thin workspaces, with
  every mechanism and every Oak-wide asset arriving as a versioned package
  they never edit. In experience terms: a product change is one PR in one
  repo with its own release; an upstream need is an issue on this repository,
  fixed and released here, and picked up there as a dependency-update PR.
  Claim boundary: the dip rate (AC8) — how often the squad needs anything
  from this repository — measured after cut-over, with the change-class map
  of the last quarter (D0b) as the authoring-time estimate.
- **Junior developers on the squad — the audience every aspect is aimed at.**
  A repository a junior developer can clone, run, change and release without
  a senior in the loop: one documented path per common task, a check behind
  each rail with a message that says what to do next, as few workspaces and
  concepts as the product needs, no mechanism to maintain, no fleet or estate
  machinery to learn, and one documented way to say "this is upstream".
- **Agents in this repository, as the platform.** The reusable and Oak-wide
  packages the product depends on are finished before the product leaves and
  maintained here afterwards under the upstream contract (§Rare dips by
  construction): an issue arrives, agents fix and release, the product's bot
  opens the update. All agent tooling stays here for that reason (ruling 6).
- **The owner.** Cost of change on both sides: the product's change surface
  becomes the squad's; the toolkit's generality stops being asserted and is
  demonstrated by a real registry consumer, and shaped against two more apps
  (§The three apps).
- **Teachers using Oak's product daily.** No change to the served surface at
  cut-over; the value routes through the squad's cycle time afterwards and is
  claimed there, never here.
- **Future non-Oak builders.** A published toolkit with an MCP server
  framework, a search framework and an app template that did not exist as
  packages before. Offered value only: rung 3 (a greenfield non-Oak service)
  remains the honest test and is out of this plan's scope.

## Mechanism

### The model — one line through every box, three bands

The owner's diagram (2026-09-02, at this seat; ruling 11): every workspace the
product touches is a box with a dotted line through it. Below the line is the
reusable part; above it is the Oak slice — Oak-specific configuration or Oak
domain logic, different in size per box, always thin, often zero at the lower
tiers. The design thought experiment of the same hour (ruling 13) splits the
Oak slice in two: Oak-the-organisation (brand, privacy posture, attribution,
Oak's curriculum types and corpus, the Practice story), shared by every Oak app
and owned here; and Oak-the-product (this app's configuration, content and
domain logic), owned by the squad. Only the product band leaves. The new
repository is the union of the product bands; this repository is everything
else, published.

The dependency direction is an invariant of the model: an Oak-org pack may
depend on the toolkit; the toolkit never depends on an Oak-org pack or on a
product; the product composes both. Generality is by injection (ADR-024): where
a toolkit package needs an Oak value, it takes it as a parameter, and the
injected type surface of each split is named in the design record (D0a). The
three seam gates (§Cut over and keep the seam honest) make the invariant a
construction fact.

### The three apps — the five-class test

The thought experiment names three apps: the Oak MCP product (extracted — rung
2), a second Oak app, a homework app (in this repository — rung 1), and a
library service built with the Innovation Kit that is not an Oak app (in this
repository — rung 3). The five-class test: for every piece of the estate the
product touches, two questions classify it — which of the three apps need it,
and who changes it when it changes — and the answers place it in one of five
classes.

| Class | Needed by | Changed by | Home |
| --- | --- | --- | --- |
| Toolkit | all three apps, and the demos | agents here | this repository, published |
| Curriculum toolkit | the two curriculum apps and the hub demo | agents here | this repository, published |
| MCP-family toolkit | the MCP product; no second consumer today | agents here | this repository, published |
| Oak-org packs | the two Oak apps and the demos | agents here | this repository, published as packs (licensed by class) |
| Product | one app | the squad | the product repository |

Toolkit: observability, error reporting, logging, the env mechanism, feature
flags and surface gating, the analytics client and its allowlist enforcement,
the design-system framework, the app shell and deploy conventions, the search
framework. Curriculum toolkit: the generic curriculum client, the codegen
pipeline. MCP-family toolkit: the server framework, OAuth-for-MCP on Clerk,
the widget kit, the conformance harness — with one consumer, its toolkit
status rests on the Atlas's probe ("could a non-Oak service consume this
unchanged?") made mechanical by the three gates, not on a second app. Oak-org
packs: Oak's curriculum types and API configuration, the Oak corpus and its
vocabulary, synonyms and ground truth, the identity pack, the privacy and PII
posture, the analytics allowlist, attribution text, the Practice tour.
Product: the served surface, the app-local MCP tools and guidance content,
the search instance, auth and env values, the app's own event names and SLOs.

Two earlier classifications map onto these five. ADR-154's framework/consumer
separation and its specificity gradient: the framework layers are the three
toolkit classes, the Oak consumer instance splits into the Oak-org packs (the
consumer every Oak app shares) and the product (the consumer one app owns);
ADR-154's unchanged-consumer test is the Atlas probe above. The census
(`.agent/reports/workspace-classification-census/matrix.md`): its
`generic-foundation` rows are toolkit; its `mixed` rows are boxes whose line
this plan cuts; its `oak-leaf` rows are Oak-org packs or product, decided per
box below.

### The decision per box — taken once, on evidence

Not every box is cut (ruling 12). Each workspace the product touches takes one
of four dispositions at the design slice (D0a), with the measurement recorded:

- **split** — the product band is thin and separable: it moves; the rest stays
  here and publishes in its class;
- **stay whole, publish** — the product band is zero: the workspace stays here
  as it is and publishes in its class;
- **stay whole with relocations** — the product band is a few values, too thin
  to be worth a seam: the values relocate into the product's configuration
  and the workspace stays here and publishes; the first cut treats a product
  band under one hundred hand-written lines as this case, and D0a sets the
  number;
- **move whole** — the box is product configuration or content through and
  through, and nothing that stays consumes it.

A box whose product band is thick and inseparable is the Atlas's falsifier for
that box (a true hybrid): it stops the line for that box and is remeasured,
never forced. The two apps are the only boxes where the split is mandatory,
because the product is their product band. The census, the co-change of the
last quarter and the line counts of §Evidence are the evidence; the five-class
test is the rule. Where a disposition differs from the census's class (the
census reads `posthog-node`, the curriculum SDK and the search SDK as
`oak-leaf` with no split), D0a records the per-row override with its
measurement, and the census regenerates from its own instrument rather than
being hand-edited. This is the Atlas's per-package classification used once as
a migration map, never as a standing activity.

Four change classes look like product work today and are dips under a naive
cut; D0b's change-class map (the last quarter's app changes, each classified
by kind and by the band it lands in under the design) must place each of them
in the product band or name the extension point that will:

- **MCP tools.** The served tool surface is generated in total from Oak's API
  specification by the codegen chain, so "add an MCP tool" is a platform
  change today. D0a splits tools into API-derived (an Oak-org pack, generated
  when the API changes) and app-local (hand-written product tools, as the
  under-the-hood tool already is), and K2 publishes the hand-written-tool
  extension point the product band uses.
- **The Oak index mapping.** Generated from the Oak schema (ADR-067): an
  Oak-org artefact with a per-instance overlay (§Search).
- **Analytics client categories.** Hand-curated today; the Oak categories are
  an Oak-org pack, the product's own events its extension (K6).
- **Response augmentation and auth shapes.** Classified per item at D0b; each
  lands in a band or names its extension point.

### Search — infrastructure, corpus, instance

The homework app would have semantic search on Elasticsearch Serverless,
populated from the same Oak data, with no need to share a service or an index
(ruling 13). That settles what search is at each band:

| Piece | Class | What a second app does differently |
| --- | --- | --- |
| Serverless client, retries, auth, observability wiring | toolkit | nothing |
| Index lifecycle: create, version, alias, roll over, verify | toolkit | its own names and versions, by configuration |
| Ingestion runtime: fetch, transform, embed, bulk write | toolkit | nothing |
| Hybrid retrieval, fusion, query building, caching | toolkit | its own weights, boosts and cache policy |
| Evaluation and benchmark harness, diagnostics | toolkit | runs against its own index, with its own reranker, fusion constants and baselines file |
| Command shell for admin, ingest, evaluate, observe | toolkit | its own command set from the same shell |
| The Oak corpus: the source-shaped documents, the canonical document model, the chunking and embedded-field contract, the field inventory, Oak's curriculum types, vocabulary and the synonym vocabulary, ground-truth query sets | Oak-org pack | consumes the same versioned pack |
| The Oak index mapping: analysers, synonym filter and field set generated from the Oak schema (ADR-067) | Oak-org artefact, with a per-instance overlay | takes the artefact; overlays its own values |
| The instance: index names and prefix, the inference endpoint, the chunk sizes and included fields as values, the synonym-set identifier, the retrieval profile, scopes, schedule, credentials, SLOs, search events | product (instance) | all of it |

Logic in the pack, values in the instance: the corpus pack carries the
chunking and embedded-field contract as code, so the squad never authors
ingestion logic, and the instance selects values over it. The pack is
source-shaped and self-sufficient — built here after the live-API
supplementation and transcript fetch that today's ingest performs on the way
to index-shaped documents, so that an instance ingests from the pack with no
Oak API in the loop — and carries a compatibility clause naming which pack
versions an instance's overlay works against. Two instances must not collide
in a shared search project: the inference endpoint is pinned per instance and
recorded in the index metadata, so two apps embedding months apart with
different models are distinguishable; the synonym set is a project-scoped
resource and is namespaced per instance; index names take an instance prefix.
Whether the two Oak apps share a Serverless project or take one each is
decided once at D0a with both costs recorded (contention and unattributable
inference spend when shared; a standing baseline charge per project when
not), because it is upstream of how much namespacing an instance needs. D0a
also names the pack's substrate (a registry package or an object store) and
its size.

The search app that goes with the MCP product is therefore its search
instance — configuration and commands, thin — and ruling 1 holds as given.
The search host is named here as a literal because the owner's ruling names
it and the instance boundary depends on its project model; every other vendor
is a class (§Where the first-principles check fires).

### First cut per box (the design slice ratifies or overrides each)

| Box | Stays here (class) | Product band (moves) | First cut |
| --- | --- | --- | --- |
| MCP server (`apps/oak-curriculum-mcp-streamable-http`) | server framework, OAuth-for-MCP on Clerk, widget kit, observability and logging glue, landing page, asset download (MCP-family and toolkit) — ~19,800 hand-written lines | served surface, the app-local tools and under-the-hood tour, generated tool metadata, auth and env values, the widget's product UI — ~700 lines plus configuration | **split** (mandatory); the workspace itself retires here at M2 |
| Search CLI (`apps/oak-search-cli`) | ingestion runtime, index lifecycle, diagnostics, evaluation harness, command shell (toolkit); the Oak data adapters, supplementation and document model (Oak-org, into the corpus pack) — ~31,500 hand-written lines between them | the MCP search instance: index configuration, scopes, schedule, its commands composed from the shell | **split** (mandatory), three ways; the workspace itself retires here at M2 |
| Curriculum SDK (`packages/sdks/oak-curriculum-sdk`) | generic client, config, validation (curriculum toolkit) — ~3,400 lines; Oak's curriculum types, API configuration and the API-derived tools (Oak-org pack) | the app-local tool layer, guidance resources and agent-support metadata — part of ~8,500 lines, co-changing with the app above everything else (379 touches) | **split**, three ways; D0a measures how much of the tool layer is API-derived, and the hub demo consumes the client |
| Search SDK (`packages/sdks/oak-search-sdk`) | retrieval and admin machinery (toolkit) — most of ~8,500 lines, with a field-mapping port for the Oak field names its queries and facets name today; Oak index contracts, scopes and synonyms (Oak-org, into the corpus pack) | the MCP instance's retrieval profile, scopes and namespace | **split**, three ways; if the port is wider than a field mapping, retrieval is Oak-org and the toolkit claim for it is dropped; the hub demo consumes the read surface |
| Codegen chain (`packages/sdks/oak-sdk-codegen`, with `search-contracts`) | the OpenAPI-to-types, Zod and MCP generation pipeline (curriculum toolkit); the Oak schema cache and generated Oak artefacts (Oak-org) | the product's generation configuration, if any remains | **split** along ADR-108's own line; a per-subpath disposition table first |
| `graph-corpus-sdk` | the corpus substrate (toolkit); the Oak curriculum subpath (Oak-org) | none | D0a decides; stays whole and publishes if the split is not worth a seam |
| Libs and core (`result`, `type-helpers`, `observability`, `safe-path`, `graph-core`, `openapi-zod-client-adapter`, `env-resolution`, `sentry-node`, `workspace-config`, `env`, `logger`, `build-metadata`, `oak-eslint`) | all of it (toolkit); Oak defaults that are Oak-wide become org configuration | per-app values: Oak env contracts, one default sink path, release-policy wording, the lint exception list | **stay whole with relocations** (R1–R4) |
| `posthog-node` | the client and allowlist enforcement (toolkit); the Oak allowlist, categories and privacy posture (Oak-org pack) | the product's own event names | **split**, three ways |
| Design tier (`oak-design-system`, `oak-design-tokens`, `oak-design-assets`, `design-tokens-core`) | the framework (toolkit); the Oak identity pack (Oak-org), shared with the demos and the homework app | none | **stay whole, publish** |
| Demos (`oak-curriculum-hub`, `oak-design-showcase`) | — | — | stay (ruling 9); the hub is the in-repo consumer of the curriculum client and the search read surface |

Outside the product's closure and untouched by this plan: `agent-tools`,
`fidelity-review`, `graph-ingest`, `graph-project`, `oak-design-ink`,
`oak-design-react`.

### Designed for junior developers — the constraint on every slice

The owner's requirement (ruling 8) binds the whole new repository, not one
slice. Each slice that touches it answers the same question before it lands:
could a junior developer, new to the product, do this task from the repository
alone?

- **Structure.** As few workspaces as the product needs, decided at D0a with
  the junior test as the criterion, and a thinness ceiling per workspace
  (hand-written, non-test, non-generated lines) recorded in the design
  record; the counts are reported at cut-over and re-measured on every
  release.
- **One app shape.** The new repository is an instance of the app template
  this repository's own apps use (§Scaffold): the same CI, deploy,
  observability wiring, flags, design-system consumption and README shape,
  so there is one documented way to build an app on the toolkit, and a drift
  check in both repositories says when they part.
- **Tooling.** Standard, widely documented tools in their default shapes
  (pnpm, turbo, ESLint from the published preset, Vitest, Playwright,
  semantic-release), configured once at the root; no bespoke wrappers, no
  hook chains that need explaining; every script named for what it does; a
  dependency-update bot so releases from here arrive as small PRs.
- **Checks and messages.** Every failing check says what failed, why it
  matters and what to do next, in plain language; a red check is a teaching
  moment, never a puzzle.
- **Documentation.** A README that gets a junior from clone to a running
  server in the fewest steps; a contributor guide that walks one change end
  to end, including the "this is upstream" path; the app tour of
  oak-under-the-hood written for the same reader.
- **Practice.** Minimal and on the rails (§Agent tooling stays here); each
  rule short, each skill a single path; nothing that presumes the estate.

### Rare dips by construction

Dips into this repository must be rare, not merely cheap, because a junior
developer cannot make them at all. Three mechanisms make them rare and one
makes the rare ones safe:

- **Knobs by construction.** Everything that varies with the product — tool
  definitions, guidance content, the search instance, auth and env values,
  event names, SLOs, themes — lives in the product band as configuration or
  content over a published extension point. D0b's change-class map classifies
  the last quarter's app changes by kind and checks each lands in the product
  band under the design; a class that does not is a missing extension point,
  fixed here before the move. The map is re-run over the thinned tree before
  M1 opens, and M1 opens only when the share of product-class changes that
  land in the product band meets the threshold D0a set — the first cut
  proposes nine in ten.
- **Oak-wide assets are platform work.** A curriculum-API schema refresh,
  a corpus rebuild, an identity change or a privacy-posture change is done
  here by agents and reaches the product as a version bump; the squad never
  regenerates types or ingests the corpus.
- **Finish before extracting.** Every package the product repository will
  depend on reaches the finishable bar (the Atlas's Change 1: a finished
  foundation, adopted where the ecosystem's canonical form exists, owned to
  the charter bar where nothing external serves) before it is published for
  the product. D0b's finish list names each package, the checks its bar
  consists of (a publishable manifest with `exports`, `files` and a licence
  word; a README written for the consumer; the suites and the packed-form
  smoke green; no import of an unpublished package), and its status. Where a
  package's bar is held by a condition outside this plan — `graph-corpus-sdk`
  carries third-party content whose licence is pending, the codegen chain's
  final shape is Castr-deferred, the design packs are the design lane's
  programme — the list records a dated exemption at the owner's word, scoped
  to the surface the product consumes, with the dip it risks named. A
  finished foundation rarely changes; an unfinished one is a dip generator.
- **The upstream contract.** The product repository's Practice carries one
  rule for the rare dip: "this is upstream" means an issue on this repository
  from a template; agents here fix and release; the product's bot opens the
  update PR. The junior's escape hatch is a version pin or a rollback, never
  a visit here. This repository commits to that response path as its platform
  contract, which is what all agent tooling staying here is for. Its terms:
  the Director seat this repository's Practice defines (PDR-117) is the
  accountable seat; an issue is acknowledged and classified within one
  working day; a fix that unblocks the product releases within one week or
  the issue goes to the owner; a breaking change in any package the product
  consumes is announced on the product repository's tracker and arrives as
  an agent-authored update PR there, never as a silent bump, because the
  shared version line (§Publish first) carries no semver signal of its own.

### Thin in place, then move the thin thing

Each cut lands here first, where the suites and CI already run: the reusable
or Oak-org part of a box becomes a published package and the box consumes it
in place, proven by the box's existing tests and by the MCP conformance check;
the box gets thinner in this repository, slice by slice, until what remains is
the product band. Only then does the band move — by a history-preserving
export of the files it is made of (`git filter-repo` per path) — into the new
repository's thin workspaces, and the extraction test proves the assembly
builds from the registry alone. Production cuts over to the new repository
while the old deploy still serves as the rollback (C1), and only then does the
retirement PR here (M2) remove the moved paths from the workspace globs,
`turbo.json`, `knip.config.ts` and the root scripts, so that at no point does
production run from a head with no served surface. The release configuration
needs no path removal: the curriculum SDK stays here, and the publish
mechanism's stamping step replaces its per-package entry. The order is
bottom-up: the libs and core publish after their relocations; the SDK and
codegen boxes cut per D0a; the corpus pack is built; the two apps' big
extractions follow; the product bands move last, together.

### Publish first — what this plan needs from the publish mechanism

Nothing the product depends on is published today (one closure member carries
a publishable manifest; none is on the registry). Everything below the line
publishes from this repository under ruling 3: every published package ships
at this repository's release version, from the existing release workflow. The
mechanism that does so is the delivery plan `toolkit-publish-mechanism`
(serving `public-packages-release`), a blocking dependency of this one; what
this plan needs from it, stated so the dependency is checkable:

- a release publishes every workspace whose manifest is publishable, in
  topological order, resolvable from a clean store, convergent on re-run;
- the release job releases only a tip whose CI run succeeded, and fails
  loudly when it cannot tell;
- every published manifest is stamped with the release version, replacing the
  curriculum SDK's own release entry;
- every published package installs and imports under a real pnpm store
  layout, not only from a tarball (the `env` package reads the repository's
  `package.json` four levels up at import today — R1 removes that; the
  widget build copies fonts and icons by path from the design system's
  package root — P3 proves they resolve from the packed tarball).

Two things this plan settles on its own side. The version discontinuity: two
packages carry their own version lines today (`oak-design-system` at 1.8.x;
the curriculum SDK at the repository's line) and both take the repository's
version at their first publish (§Decision log). The minimum shippable shape
under one version: the product pins the toolkit set to one version and its
dependency bot batches the updates on a schedule, so a release here that
touches nothing the product uses costs the squad one grouped PR, not one per
package; the separation of the toolkit's clock from the products' clock is
`public-packages-release`'s decision (its wager 3), to which this plan
contributes two observations when they occur — a second app releasing from
here daily, and a breaking change the product consumes. The release-age floor
this repository's workspace sets (a 24-hour minimum age, which silently
resolves to an older mature version when one exists and refuses loudly when
none does; its own comment names the per-package allow-list for a genuinely
needed young release) travels with the template and stays in force for the
`@oaknational` scope: a compromised publish under Oak's own scope is exactly
the case the floor's detection window exists for, so a release here reaches
the product's dependency bot the following day, inside the upstream
contract's week, and a genuinely urgent fix is allow-listed for that one
package at the owner's word, never by a standing scope exclusion.

### Scaffold the new repository functional — the app template

`oaknational/oak-open-curriculum-mcp`, public, licensed per ruling 2 (code
MIT, content OGL, Oak branding under the Oak brand usage guidelines), is the
first instance of an app template this repository's own apps also use:
repository, workspace and tooling; CI (install, build, type-check, lint,
unit, end-to-end, the MCP conformance check, preview-serves, CodeQL,
dependency review); deploy configuration and the environment contract;
observability, error reporting and analytics wiring from the toolkit; flags;
the README and contributor guide. The template's form (E7): the conventions a
package can carry travel as packages (the workspace configuration, the lint
preset, reusable CI workflows); the skeleton files an app cannot import
(root configuration, the README shape, the contributor guide) travel in a
published skeleton package whose `check` script asserts a consumer's root
files match the skeleton at the pinned version — that check is the drift
alarm on both sides. The skeleton carries a minimal example server that boots
and passes the conformance check: it is the template's proof and, after M1,
the in-repo consumer of the server framework. The new repository instantiates
the template in four single-story slices, and a release at one version per
repository is its own slice. The scaffold is proven functional before any
product code arrives.

### Agent tooling stays here; the product repository gets a minimal Practice

Owner rulings 6 and 7. Nothing of `agent-tools` moves — not the fleet and
collaboration machinery, not the validators, not the generators. Three
consequences:

- The `agent-tools` instruments that reached into the apps — the MCP-content
  current-source machinery (reviewed anchors over the served surface, the
  under-the-hood content and the SDK's guidance resources) and its two
  `repo-validators:check` entries — retire here at cut-over, because their
  subject leaves. The content discipline they enforced becomes one of the
  product repository's rails: a plain check the squad owns in that
  repository's own CI.
- The MCP conformance harness (the unattended MCPJam subset with baselines
  adjudicated by name) lives in `agent-tools` and stays. The product still
  needs a conformance check, so T1 gives it one: the harness's generic core
  published as an MCP-family toolkit package (the source stays here; the
  product consumes an artefact), with the product's baselines re-seeded in
  the new repository; the alternative, a plain MCPJam-driven check written
  there for the junior audience, is decided at T1.
- The product repository's Practice is its own slice (S3): a short
  `AGENTS.md`, a small rule set (ticket first, small PRs, review triage, never
  commit to main, design-system consumption, guidance-content provenance and
  attribution, "this is upstream"), one skill per common product task (add
  or change an app-local MCP tool; change served guidance; change the search
  instance; run the conformance check; release; raise an upstream issue),
  thin platform adapters that point at those files, and its own plain git
  hooks. "On the rails" means every common task has one documented path with
  a check behind it; the rails are the checks. No comms, claims, fleet, plan
  estate or memory machinery travels. Its content is sliced from this
  repository's Practice by subtraction and rewritten for its audience, not
  copied.

### oak-under-the-hood — the owner's open question, with a recommendation

Owner ruling 4. The tool's content is generated at build time by this
repository's tooling from its Practice files; after the move the product can
reach neither. Three options, one recommended:

- **A (recommended): two tours.** An app tour authored in the new repository
  as part of its minimal Practice (the squad owns it; plain files, no
  generator), and a Practice tour published from this repository as an
  Oak-org content pack (generated here by the existing generator at release)
  that the server installs like any dependency. Keeps the product buildable
  without `.agent/`; keeps the Practice story served; no agent tooling
  travels.
- **B: one tour, one content pack.** All content authored here and published;
  the server only renders it. Cost: the product's own orientation is authored
  outside the product repository, against the handover's purpose.
- **C: app tour only.** The Practice tour retires from the served surface.
  Cost: the served orientation loses the Practice story the tool exists to tell.

The implementer decides at the server's move and records the choice in the
decision log; the slices assume A.

### Cut over and keep the seam honest

Production moves to the new repository's deploy with the conformance check
green against it, then the old deploy retires (M2). From then on the seam is
a construction fact on both sides: this repository's CI runs the three gates
over the published toolkit set — imports (a toolkit package never imports an
Oak pack or an unpublished package, checked at subpath granularity), lexemes
and manifests (every toolkit package carries a publishable manifest) — and
reports the size of what is Oak-side here, the owner's "thinnest possible
Oak" as a number with a trend; the new repository reports its own
hand-written line counts against the ceilings and its dip rate on every
release.

The lexeme gate is scoped per class, because the Atlas's single list ("no Oak
vocabulary — brand names, curriculum terms") would refuse the curriculum
toolkit its own domain: toolkit and MCP-family sources carry neither Oak nor
curriculum vocabulary; curriculum-toolkit sources carry curriculum-domain
terms but no Oak-instance terms (brand, product names, Oak's domain names,
Oak's data field names); Oak-org packs and the product carry both. Renames the
gate forces — the search SDK's Oak field names behind the field-mapping port,
the analytics client's Oak-prefixed exported surface — are carried by K3 and
K6 explicitly, and the residue is a dated exemption list the gate reads, each
entry with the slice that retires it. The Atlas's gate text takes a dated
amendment to say so, riding A2.

### The lifecycle — this plan's proposal, and its first evidence

This plan proposes a repeatable extraction: a product born here on the
toolkit, thin by construction, leaves at handover. The second Oak app is the
next candidate, and this plan is the first evidence for or against the
proposal. The Innovation Kit node declares that it "does not select an
implementation architecture", so the proposal is this plan's, not the Kit's;
at the second run the procedure graduates to a runbook node (the estate's
rule: consolidate at the second consumer), and this plan records what the
runbook will need — the five-class test, the per-box decision, the finish
list, the app template, the upstream contract — without authoring it now.

### Where the first-principles check fires

Shape: the five-class test, the per-box decision and the first cut (a boundary
move that reshapes every surface it lived on — the retirement PR carries every
root surface that named a moved path, and ADR-041 and ADR-108 are amended with
the moves, not after them). Landing path: publish through the mechanism, thin
in place, finish the dependency set, scaffold from the template, move the
product bands, cut over, retire, each slice a two-round PR with its proof
named. Vendor literals: the deploy target, the registry, the identity
provider and the dependency-update bot are named as classes here and their
products and settings ride the ticket; the search host is the one admitted
literal (§Search); the identity provider is named in one package's name (E2)
because the package is its adapter.

## Acceptance criteria (each with a proof — required)

This node's own criteria — the design step's:

- **AC-D1 — the design record is ratified.** The record D0a produces
  carries every decision gate 1 names, with its measurements, and the
  owner's word is on it. Proof: `owner-held` — the ratification stamp on
  the record, pointed at from the ticket.
- **AC-D2 — the instruments and inputs land.** The line-count and
  change-class scripts run in this repository, and every artefact D0b names
  is committed beside the record: the two scripts' outputs, the finish list
  with each package's checks and status, the lever inventory, the codegen
  chain's per-subpath disposition table, and the per-row measurements the
  census overrides need. Proof: `repo-safe` — the scripts, and each named
  artefact present as a file beside the record.
- **AC-D3 — the lane's steps exist as nodes.** Every group under §The lane's
  steps has a one-page delivery node, chained by `depends_on`, each carrying
  its slices and the lane criteria assigned to it, and the plan-corpus
  validator accepts the set. Proof: `repo-safe` — the validator and the
  `serves:` search that enumerates the nodes.

The lane's criteria, which D0a assigns to the step nodes (each step node
carries the ones its outcome proves; the retirement step's node stays live
until the last of them is recorded):

- **AC1 — the extraction test.** A clean clone of `oaknational/oak-open-curriculum-mcp`
  installs from the registry, builds, passes its unit, end-to-end and
  conformance checks, and serves a preview, with no dependency on anything in
  this repository. Proof: `owner-held` — the new repository's CI run on its
  default branch, recorded on the ticket by the implementer (this repository's
  instruments cannot run it).
- **AC2 — the seam over the published set.** The three gates run in this
  repository's CI and refuse a seeded violation of each kind before they pass
  green. Proof: `repo-safe` — the gate jobs and their red-first seeds.
- **AC3a — thin.** Every workspace in the new repository sits under the
  thinness ceiling the design record set for it. Proof: `owner-held` — the
  line-count script (D0b) run in the new repository's CI on every release,
  recorded on the ticket.
- **AC3b — no mechanism.** No module in the new repository implements a
  mechanism a non-Oak MCP service would also need. Proof: `owner-held` — the
  import gate run in the new repository's CI (every mechanism import resolves
  to a published package; no vendored copy of a toolkit module), plus the
  readiness review of the moved bands at their move, recorded on the ticket.
- **AC4 — thinning here is real.** Each extraction slice leaves the box's own
  suites and the conformance check green and reduces the box's hand-written
  lines by the extracted part's size; the trend is reported per slice. Proof:
  `repo-safe` — the box's suites and the line-count script in this repository.
- **AC5 — production from the new repository.** The served surface is
  identical before and after cut-over, and production serves from the new
  deploy. Proof: `owner-held` — recorded on the ticket, with the owner's
  deploy word (the cut-over node's gate): a diff of the served-surface
  manifest (tools and resources, live and dormant) taken before and after;
  the conformance check against production; the server's end-to-end suite
  pointed at the new production for the auth, widget, landing-page and
  asset-download paths; and the search instance's benchmark against its
  index at the same baselines.
- **AC6 — a squad-shaped change.** The first real product change after
  cut-over lands in the new repository without a commit here. Proof:
  `owner-held` — the PR named on the ticket.
- **AC7a — the rails hold.** Two seeded mistakes (a tool without a
  conformance case; guidance content without attribution) fail their checks
  in the new repository's CI with messages that say what to do next. Proof:
  `owner-held` — the CI runs recorded on the ticket.
- **AC7b — aimed at junior developers.** Given only the product repository, a
  junior developer new to the product (or a fresh agent session without this
  repository's Practice, as the rehearsal proxy) goes from clone to a running
  server, lands a representative change — adding an app-local MCP tool
  through the published extension point — by following the documented path,
  and cuts a release. Proof: `owner-held` — the rehearsal recorded on the
  ticket, with the time taken and every point where the reader had to ask.
- **AC8 — dips are rare.** Three arms over the first quarter after cut-over,
  all `owner-held` on the ticket, which records the squad's dated roster for
  the quarter: no squad member commits to this repository (the roster
  compared against this repository's history for the quarter, bot identities
  excluded, the comparison recorded on the ticket); the squad's upstream
  issues here number at most one a month, each resolved within the upstream
  contract's week by a release here and a bot PR there; and every breaking
  change the product consumed arrived as an agent-authored update PR (the
  issue list and its resolutions on the ticket). At authoring, D0b's change-class map is the
  estimate (`repo-safe`, the classification script and its output landed
  with the design record). The retirement step's node carries AC8 and stays
  live until the quarter's third reading is recorded; nothing archives on a
  partial reading.

## Todos

This node's two slices, each a single-story PR within the PDR-132 default of
two review rounds:

1. **D0b** The instruments, landed beside this node: the line-count script and
   the change-class script (the last quarter's app changes classified by kind
   and by band, with the four dip-looking classes named above resolved), the
   finish list with each package's checks and status, the lever inventory in
   extraction order, the codegen chain's per-subpath disposition table, and
   the per-row measurements the census overrides need. Proof: AC-D2.
2. **D0a** The design record the owner ratifies (gate 1): the per-box
   dispositions with their measurements and thresholds, the target workspace
   set and file tree, the thinness ceiling per workspace, the search instance
   boundary (project per app or shared, the pack's substrate and size, the
   overlay's contents, the injected type surfaces), the tool split, the
   template's form, the finish list's exemptions, and the dip threshold the
   move step must meet — and, in the same slice, the one-page delivery nodes
   for the groups below, chained by `depends_on`, each carrying its slices,
   its proofs and the lane criteria assigned to it (the cut-over node
   carrying the deploy-target gate). Proof: AC-D1 and AC-D3.

## The lane's steps (banked here; each becomes a delivery node at D0a)

Each group below is one step of the lane and one node at D0a; each slice
inside it is a single-story PR within the PDR-132 default of two review
rounds, sliced further at its own authoring. A slice names its proof.
Execution order is the order below; the publish mechanism
(`toolkit-publish-mechanism`) lands before any publish slice.

Design (this node):

1. **D0b** and **D0a**, as §Todos above.

Finishing and relocating (this repository; each package's finish slice
precedes its publish):

1. **F** The finish list closes per package, sliced per package: the bar's
   checks pass or a dated exemption is recorded at the owner's word. Proof:
   the checks per package; the list on the ticket with each status.
2. **R1–R4** The four configuration relocations out of `env`, `logger`,
   `build-metadata` and `oak-eslint` — Oak-wide defaults into org
   configuration, per-app values into the product, the lint exception list
   made consumer-supplied — with `env` injecting the root version (ADR-024)
   instead of reading `package.json` at import. Proof: the packed core imports
   under a pnpm store layout; this repository builds and lints unchanged.

Publishing (through the mechanism):

1. **P2** The libs and core flip to publishable manifests with their licence
   words, after F and R1–R4; the mechanism publishes them at the next
   release. Proof: the dry run lists exactly that set; the first real publish;
   the packed-form smoke green for each.
2. **P3** The design packs flip to publishable with their licence words, with
   the widget's copied files proven to resolve from the packed tarball. Proof:
   as P2.
3. **P4** The three seam gates over the published toolkit set, red-first,
   with the import gate at subpath granularity and the lexeme gate scoped per
   class with its exemption list. Proof: AC2.
4. **T1** The MCP conformance check the product will run (§Agent tooling stays
   here). Proof: the check runs against a local server from the published
   artefact or the rewritten check, with the product's baselines.

Cutting the SDK boxes and building the corpus pack (per D0a):

1. **K1** The codegen chain along ADR-108's line, from D0b's per-subpath
   table: the pipeline publishes as curriculum toolkit and the Oak schema
   cache, generated artefacts and API-derived tools publish as an Oak-org
   pack — the first Oak-org pack, so A3 (ADR-041's tier amendment) rides it.
   Proof: the product's artefacts regenerate from the published pipeline; the
   SDK suites green.
2. **K2** The curriculum SDK three ways: the generic client, config and
   validation publish as curriculum toolkit; Oak's types and API configuration
   publish as an Oak-org pack; the hand-written-tool extension point is
   published and the app-local tools, guidance and metadata thin toward
   configuration and generated code as D0a measured, and what remains is the
   product's. Proof: the MCP server's and the hub demo's suites and the
   conformance check green on the split.
3. **K3** The search SDK three ways: retrieval and admin machinery publish as
   toolkit behind the field-mapping port, with the instance namespace (index
   prefix, synonym-set identifier, inference endpoint) added to the SDK's
   configuration; Oak's index contracts, scopes and synonyms join the corpus
   pack; the MCP instance's retrieval profile, scopes and namespace are the
   product's. Proof: the search suites and the hub demo's suites green on the
   split; the falsifier (a port wider than a field mapping) recorded if it
   fires.
4. **K4** `graph-corpus-sdk` per D0a's disposition (its barrel rewritten in
   the same slice if it splits, with its test pressure named). Proof: the
   corpus suites green.
5. **K5** The Oak corpus pack: the source-shaped, post-supplementation
   documents, the canonical document model, the chunking and embedded-field
   contract, the field inventory, vocabulary and synonym vocabulary,
   ground-truth query sets, versioned and published on the substrate D0a
   named; the MCP search instance ingests from it. Proof: a full ingest from
   the pack with the Oak API unreachable reproduces today's index contents at
   field level, with the inference endpoint identity compared.
6. **K6** `posthog-node` three ways: client and allowlist enforcement publish
   as toolkit under a generic exported name; the Oak allowlist, categories and
   posture publish as an Oak-org pack; the product keeps its event names.
   Proof: the MCP server's analytics suites green on the split.

Cutting the apps (sliced further at authoring; each extraction a published
package the app consumes in place):

1. **E1** The MCP server framework: composition, transport, sessions,
   registration, health. Proof: AC4 on the server.
2. **E2** OAuth-for-MCP on Clerk: the proxy and auth as the Clerk adapter for
   MCP authentication; a provider port arrives with the second provider,
   never before. Proof: AC4; the registration proof re-run.
3. **E3** The widget build kit, the landing page and asset download; the
   widget's cross-workspace token watcher goes, the registry version bump
   being the token path. Proof: AC4; the widget build from the kit.
4. **E4** The observability, logging and correlation glue folded into the
   existing cores or a small framework module. Proof: AC4.
5. **E5** The search framework: ingestion runtime, versioned ingest, index
   lifecycle, diagnostics, the command shell. Proof: AC4 on the CLI; a full
   ingest of the MCP instance from the corpus pack.
6. **E6** The evaluation and benchmark harness, with its reranker, fusion
   constants and baselines path lifted into instance configuration. Proof:
   AC4; a benchmark run from the published harness against the Oak ground
   truth with a caller-supplied baselines file.
7. **E7** The app template as toolkit in the form §Scaffold names, with its
   example server. Proof: the MCP server here passes the drift check against
   the skeleton unchanged; the example server passes the conformance check.

Scaffold (the new repository; gate 2; after E7):

1. **S1a** Repository, licences, workspace and tooling from the template, the
   workspace layout from D0a; asserts the repository exists at its start.
   Proof: install and lint green on an empty workspace set; the drift check
   green.
2. **S1b** CI jobs. Proof: green on the empty set; each job's failure message
   read for the junior audience.
3. **S1c** Deploy configuration, the environment contract, observability and
   analytics wiring. Proof: a preview deploy of an empty server responds and
   reports.
4. **S1d** README and contributor guide, including the "this is upstream"
   path and the issue template on this repository. Proof: clone to running
   server by the README alone, timed.
5. **S2** Release at one version per repository, with the dependency-update
   bot configured for the `@oaknational` scope on a batching schedule that
   runs after the release-age floor's day. Proof: a tagged pre-release from
   a no-op commit class; the bot opens one grouped PR for a toolkit release
   once it has aged.

Moves, cut-over and retirement:

1. **M1** Opens when the re-run change-class map meets D0a's dip threshold.
   The product bands move together — the server's band with the
   under-the-hood decision recorded, the search instance, and the SDK bands
   D0a assigned to the product — into the workspaces D0a set, as one PR in
   the new repository. Proof: AC1, AC3a and AC3b.
2. **S3** The product repository's minimal Practice, authored once the
   product's real tasks are in that repository. Proof: AC7a and AC7b.
3. **C1** Production deploy from the new repository, with the old deploy
   serving as rollback until AC5 is recorded. Proof: AC5. The cut-over
   node's owner gate: the production deploy project and DNS, named on the
   ticket before C1 opens.
4. **M2** The retirement PR here: the two app workspaces and every root
   surface that named them go; the old deploy retires; carries A1. Proof:
   this repository's full check green; the served surface unchanged (AC5).
5. **C2** The residue here: the two content validators whose subject left,
   onboarding pointers, and the Oak-side size report. Proof:
   `repo-validators:check` green; the number on the ticket.

Amendments:

1. **A1** Rides M2: ADR-108's dated amendment (the split executed at the
   product boundary, with the Castr composition pointer) and ADR-041's `apps/`
   line (after M2 the tier holds this repository's own apps and the layout
   describes the estate after extraction). Proof: the docs validators.
2. **A2** `toolkit-re-architecture`'s dated ordering amendment and the
   Atlas's lexeme-gate amendment, presented for the owner's word (the
   consolidation step's act), and `public-packages-release` §Alignment and
   §Delivery naming this plan and its publish-mechanism node. Proof: the
   plan-corpus validator; the owner's stamp.
3. **A3** Rides K1: ADR-041's tier amendment for the Oak-org pack class,
   whose first occupant K1 publishes (precedent: the identity-pack tier under
   `packages/design/identities/*`). Proof: the docs validators.

## Out of scope

- Executing any later step of the lane — each is its own delivery node,
  authored at D0a; this node designs and instruments.
- Moving today's apps as they are — the product is their product band, not
  the workspace.
- The publish mechanism itself — `toolkit-publish-mechanism` owns it; this
  plan states what it needs (§Publish first) and flips manifests.
- Version-config refinement and the separation of release clocks —
  `public-packages-release`'s wagers 2 and 3; this plan ships at one version.
- The demos — both stay here (ruling 9).
- The second Oak app and the library service — design inputs to this plan,
  not its deliverables; their own plans consume what this plan publishes.
- The second extraction's runbook — authored at the second run.
- The estate-wide `toolkit/` and `oak/` re-home of the members outside the
  product's closure — the strategic node's existing delivery order owns it.
- The Innovation Kit and its definition corpus — topology-neutral by its own
  declaration; it stays here as the way new apps are born.
- Castr adoption timing — owner-schedulable; the Castr fixture pack's contract
  content is not superseded here.
- A separate toolkit repository — deferred by the strategic node with its flip
  condition named.
- The design lane's identity-pack programme — continues here; the product
  consumes its output as published packs.
- Rung 3 of the demonstration ladder — a greenfield non-Oak service is its own
  plan.
- Any agent tooling in the product repository (ruling 6).
- A provider port for MCP authentication ahead of a second provider (E2).

## Decision log

This log is the durable home of the rulings below; the estate-coordination
thread record
(`.agent/memory/operational/threads/estate-coordination.next-session.md`,
§"2026-09-02 ~13:xxZ — FOLD LANDED") is their contemporaneous capture.

- **Owner rulings, verbatim (2026-09-02):** (1) "yes the search app is
  effectively part of the MCP app"; (2) "the published packages will be on
  the @oaknational org scope, public, code is MIT, content OGL, any included
  Oak branding is covered by the Oak branding usage guidelines... so same as
  everywhere else"; (3) "releases: up to the implementing person, I would go
  with one release version per repo for now"; (4) "oak-under-the-hood, leave
  it as an open question for whomever picks up the plan, maybe we split it
  into two separate skills/tours"; (5) "all Oak work is public and open by
  default, the name will be oak-open-curriculum-mcp in the oaknational github
  org"; (6) "all agent tooling stays with the primary repo, not the oak app
  repo"; (7) "the oak app repo will have a minimal, streamlined Practice
  designed for on the rails use by less experienced devs"; (8) "in fact that
  is a requirement, every aspect of the oak app repo must be aimed at junior
  devs"; (9) "all of the demos stay with the core repo, only the mcp app and
  search app and any thin but absolutely necessary layers move to the new
  repo"; (10) "there is no way that the requirements are met by shuffling
  existing workspaces, and I said that from the very beginning"; (11) the
  diagram: "the Oak parts are above the dotted lines, the reusable parts
  below, and all the different heights represent is that the oak-specific
  config or oak-specific domain logic will be different, but always thin,
  amounts in each case, often zero at the lower levels"; (12) "in each
  existing workspace it may be reasonable for the entire workspace to stay in
  this core repo, not every workspace will require a split"; (13) the design
  thought experiment — three apps (the MCP product, a second Oak homework
  app, a library service built with the Innovation Kit that is not an Oak
  app), "only the MCP app and friends go in the new repo, _but_ the need to
  dip into this repo to fix things must be strongly minimised in order to
  satisfy the 'suitable for junior devs' requirement, because this repo is not
  suitable for junior devs", and on search: "there is no need for it to be
  the same service, or have the same indexes".
- **The frame (authoring seat, 2026-09-02, after rulings 10–13).** The
  seat's first two drafts moved existing workspaces; both were shuffles. The
  product is the product band of every box it touches, today's apps are
  mechanism with that band inside them (§Evidence), and the band is thinner
  than the Oak slice because Oak-wide assets are platform work; so the plan
  cuts boxes along the owner's line under the five-class test and moves only
  the product bands, thinning in place first.
- **The ordering thesis (presented for the owner's word).** The extraction
  runs before the estate-wide seam re-home: cutting the product's boxes IS
  the seam for the part of the estate that carries most of the Oak-mixed
  mechanism, and the gates apply per package, so a published subset is
  checkable. The counterframe — the strategic node's banked "seam migration
  first" — would have the handover wait on members the squad never sees.
  Falsifiers of the ordering itself, each tested at a named slice: the
  extraction test (M1) finds the product reaching a member outside its
  closure that can be neither published nor moved; or P4 cannot enforce the
  gates per package over a published subset. Either reopens the order in
  favour of the estate-wide re-home first.
- **The lane's shape (authoring seat, after the second review suite and the
  pull request's first round).** A delivery node is one step of a lane,
  never the lane itself (the plan-node schema), so this node is the lane's
  design step and the later steps become one-page nodes at D0a, whose
  decisions their contents depend on; the lane's full sequence, slices and
  criteria are banked here so nothing is deferred to pickup. The publish
  mechanism is already its own delivery node, `toolkit-publish-mechanism`,
  serving `public-packages-release`, because it is reusable and that
  strategic node's banked order names it; this node depends on it.
- **Search: infrastructure, corpus, instance (§Search).** Ruling 1 holds as
  given: the search app that leaves is the MCP instance. The corpus is an
  Oak-org pack built once here, source-shaped and self-sufficient, carrying
  the ingestion logic; the framework is toolkit; the instance is values. The
  mapping is an Oak-org generated artefact with a per-instance overlay.
- **Tools: API-derived and app-local.** The served surface is generated in
  total from Oak's API specification today; the plan splits it so that adding
  an app-local tool is product work through a published extension point, and
  a schema-driven tool change is platform work that arrives as a version.
- **Rare dips, not cheap dips.** The seat's third draft made the upstream
  change cheap (automatic publishing, a dependency bot); ruling 13 requires
  it rare and junior-safe, hence knobs by construction, platform-owned
  Oak-wide assets, the finish list as a precondition, the upstream contract
  with its terms, and the dip rate as the criterion (AC8), measured before M1
  opens and after cut-over.
- **Publish-first at one version; the version discontinuity.** Ruling 3 read
  for this repository; the two packages with their own version lines join the
  repository's version at first publish; the separation of clocks is
  `public-packages-release`'s decision.
- **OAuth-for-MCP is named for Clerk.** The server's authentication reaches
  the provider's SDK throughout; the published package is the Clerk adapter
  for MCP authentication, and a provider port is authored at the second
  provider, not speculatively.
- **The template is a published skeleton package with a drift check**, plus
  the conventions that travel as packages; its example server is the in-repo
  consumer of the server framework after M1.
- **Agent tooling stays; the content instruments retire at cut-over; the
  conformance check is re-provided (T1).** From rulings 6 and 7 and the
  readiness reviews.
- **oak-under-the-hood: option A recommended, decided at the server's move.**
- **The lifecycle is this plan's proposal**, with the second Oak app as the
  test; the Innovation Kit's topology neutrality is unchanged.
- **Open owner item, raised with this node:** the ruled repository name is
  also the current app's error-reporting project name (ADR-159, ADR-163);
  gate 2 asks whether that project is renamed or shared.
- **Free-play seeds recorded, not decided:** the library service's identity
  could be the design lane's fourth, product-led identity, which would give
  identity-№N a production first light; the served-surface manifest
  generalises to the surface gating a marketing site with a service behind
  flags needs. Both are inputs to D0a and the design lane, not this plan's
  scope.

## Review dispositions

One dated row per routed finding (PDR-140 ledger surface); the picking-up
implementer enumerates and dispositions every row before implementation. The
two readiness suites' findings, dispositioned by ID, live in the readiness
record named under §Evidence; the rows below are the ones routed onward.

| Date | Source | Finding | Routing |
| --- | --- | --- | --- |
| 2026-09-02 | Readiness suite 1 (PR #954) | 41 findings, all cured or overtaken by the fourth draft | The readiness record, §Review 1–3; nothing routed onward |
| 2026-09-02 | Readiness suite 2, E2-5 and A2-7 | Project-per-app versus shared; the census overrides | D0a decides and records both |
| 2026-09-02 | Readiness suite 2, A2-1, B2-1, W2-3 | The Atlas's lexeme-gate text refuses the curriculum toolkit its domain | A2 carries the Atlas's dated amendment; P4 implements the per-class scope |
| 2026-09-02 | Readiness suite 2, A2-11, B2-3 | The clock trigger was a conditional; one version hides breaking changes | The clock decision to `public-packages-release` (wager 3); the breaking-change clause into the upstream contract and AC8 |
| 2026-09-02 | Readiness suite 2, docs verification note | The repository name collides with the error-reporting project name | The owner, at gate 2 |

## Evidence at authoring (2026-09-02, tree at `777e9131c`)

- The apps are mechanism with a thin product band inside. Hand-written,
  non-test, non-generated lines: the MCP server ~20,500, of which the served
  surface (285), the under-the-hood tour (181) and the generated tool metadata
  (~200) are the product band and the rest is the server framework and
  composition (~1,850), build scripts and widget build (~2,100), OAuth proxy
  and auth (~1,700), observability, logging, correlation and test-error
  plumbing (~1,800), landing page (~1,050), registration proof and asset
  download (~1,000), scripts, operations and test helpers (~2,300), and
  roughly 8,000 further hand-written lines across the remaining modules that
  the seat's ad hoc count did not categorise — D0b's line-count script
  classifies every file, and its output supersedes these figures; the search
  CLI ~31,500 across `adapters`, `cli`, `lib`, `observability` and
  `test-helpers`; the curriculum SDK ~12,000, of which the MCP tool layer,
  guidance and metadata are ~8,500 and the generic client, config and
  validation ~3,400; the search SDK ~8,500.
- Dependency map from the manifests: 33 workspace members. The two apps'
  runtime closure is 19 members (the two apps and 17 packages); with the six
  dev-time members (`design-tokens-core`, `oak-design-assets`,
  `oak-design-system`, `oak-design-tokens`, `oak-eslint` — published as
  `@oaknational/eslint-plugin-standards` — and `workspace-config`) it is 25.
  Six members sit outside it, plus the two demos; the hub demo consumes the
  curriculum SDK, the search SDK's read surface, `result` and the design
  system. One publishable manifest; nothing published. The thread record's
  earlier figure of 22 was the morning's chat-derived count and is superseded.
- Co-change, `git log` from 2026-06-04: 255 commits touched `apps/`; 75 touched
  only `apps/`; 78 also touched `packages/`, led by the curriculum SDK (379 file
  touches) and the codegen chain (305), then `graph-corpus-sdk` (46),
  `oak-eslint` (42), `oak-search-sdk` (29); every other package under 25. The
  MCP-content current-source machinery in `agent-tools` (195 touches) and its
  validators (63) co-changed with the apps more than any library did; both
  retire at cut-over. The quarter was an agent-driven build phase and
  over-represents mechanism changes; D0b's change-class map classifies it, and
  AC8 measures the truth after cut-over.
- Root couplings the template replaces and the retirement PR removes: turbo
  pipeline entries for the MCP server; three root scripts; knip entries; six
  workflows; the deploy configuration; the under-the-hood generator's reach
  into `.agent/`. The release configuration's curriculum-SDK entries are
  replaced by the publish mechanism's stamping, not removed.
- The lexeme gate's text: the Oak Toolkit Atlas
  (`.agent/reports/repo-architecture/oak-toolkit-atlas.html`, Change 3).
- Readiness reviews (dispositioned by ID) and the Atlas render record:
  `.agent/reports/repo-architecture/oak-open-curriculum-mcp-extraction-readiness-reviews-2026-09-02.md`.
