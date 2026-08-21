# ADR-041: Workspace Structure Option A Adopted

Status: Accepted (Revised)
Date: 2025-09-08
Updated: 2026-04-02; 2026-05-11 — `agent-tools/` tier regularised
(closing the latent ADR-165/168/178 gap); `agent-graphs/` tier added
as the workspace home for `practice-graph` and future agent-tooling-
adjacent graph consumers (ADR-173 prerequisite).

## Context

We compared multiple workspace layouts to improve clarity, onboarding, and long-term maintenance. Options included: conventional apps+packages, domain buckets, and a flat packages-only layout.

## Decision

Adopt Option A (conventional) with clear directories:

- `apps/` – application runtimes (MCP servers, search CLI)
- `packages/core/` – foundational shared code and provider-neutral primitives
  (result types, ESLint config, env, OpenAPI adapter, observability helpers)
- `packages/libs/` – shared runtime libraries, split into:
  - foundation libs (`env-resolution`, `logger`, `search-contracts`;
    dated amendment 2026-07-31 per ADR-221 obligation 4: `graph-ingest`
    and `graph-project` classify as foundation libs — transport-agnostic
    substrate, no vendor adapter nature; dated amendment 2026-08-09:
    `fidelity-review` classifies as a foundation lib — the demo apps'
    shared fidelity capture/diff/report core, extracted when its second
    consumer arrived, depending on core packages and npm only. It is
    dev-time tooling consumed as a devDependency — the tier's "runtime
    libraries" phrase describes the common case, not a gate, and the
    tier's test is dependency shape, not ship surface. It is also the
    first lib whose consumers are `demos/` workspaces; the lib boundary
    rules now guard the reverse libs→demos edge)
  - adapter libs (`sentry-node`)
- `packages/sdks/` – SDK packages (curriculum-sdk, oak-search-sdk)
- `packages/design/` – design-tier workspaces (row trued 2026-08-02; the
  original two-name enumeration had gone stale by three): `design-tokens-core`,
  `oak-design-system`, `oak-design-tokens`, `oak-design-ink`,
  `oak-design-assets`, and `oak-design-react` (the ADR-213 §3 React binding
  tier). See ADR-148 and ADR-213. Nested below it (dated amendment
  2026-08-18), `packages/design/identities/*` is the identity-pack tier:
  data-only pack workspaces, deliberately OUTSIDE `DESIGN_PACKAGE_IMPORTS`
  and invisible to the depth-1 design scan — the tier carries no
  hand-declared inventory (the identity-№N property: adding a pack is a
  data act), is validated structurally by the `validate-boundaries`
  identity-pack leg (presence, homogeneity, data-only anatomy), and its
  packs reach consumers only as `workspace:*` dependencies, never by
  entering the design boundary tuple. Governed by the
  `tango-identity-pack` delivery plan.
- `demos/` – demonstration apps consuming workspace package surfaces only
  (`oak-curriculum-hub`, `oak-design-showcase`). Recorded intent: never
  imported by packages — no boundary rule enforces the inbound direction
  yet; enforcement lands at need, mirroring the design-inventory leg (row
  added 2026-08-02 — the directory predates it).
- `agent-tools/` – optional TypeScript implementation of Practice-
  operational tooling (collaboration-state, commit-queue, agent-
  identity, comms CLIs). The phenotype boundary is set by ADR-165;
  build isolation is governed by ADR-178. Consumed as built `dist/`
  artefacts only, never source-on-each-invocation.
- `agent-graphs/` – agent-tooling-adjacent graph consumers (first
  occupant: `practice-graph` per ADR-173 Topology row 7). Workspaces
  here consume the graph substrate (`packages/core/graph-core`,
  `packages/libs/graph-*`, `packages/sdks/graph-corpus-sdk`) but are
  not themselves substrate libraries. `agent-graphs/` ships no MCP
  primitives (ADR-173 MCP-agnostic principle); surfacing is a
  separate consumer concern. The tier exists to keep agent-side
  graph consumers out of the substrate package tiers without
  forcing them into `apps/`.

> The dependency-direction matrix below expands `packages/libs/` into
> two distinct rows (`foundation libs` and `adapter libs`) because
> the two sub-tiers carry different import constraints; the matrix
> therefore has eight rows even though the Decision list enumerates
> seven top-level directories.

Rules & relationships:

- Inter‑workspace imports use `@oaknational/*` package specifiers only.
- Production source uses those package specifiers; explicit test/config lint
  carve-outs remain allowed where repo-root tooling or fixtures require them.
- Intra‑package relative imports allowed; avoid private/internal subpaths.
- Dependency direction (imports flow upward):

| Importer        | core | foundation libs | adapter libs | sdks                                                                                         | design | apps | agent-tools                                    | agent-graphs | Constraint                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| --------------- | ---- | --------------- | ------------ | -------------------------------------------------------------------------------------------- | ------ | ---- | ---------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| core            | —    | no              | no           | no                                                                                           | no     | no   | no                                             | no           | No monorepo dependencies outside `core`; external deps must stay minimal and provider-neutral                                                                                                                                                                                                                                                                                                                                                                      |
| foundation libs | yes  | —               | no           | approved generated subpath exports only (`search-contracts` -> `@oaknational/sdk-codegen/*`) | no     | no   | no                                             | no           | No lib-to-lib back-edges; `search-contracts` is the documented generated-contract exception                                                                                                                                                                                                                                                                                                                                                                        |
| adapter libs    | yes  | yes             | —            | no                                                                                           | no     | no   | no                                             | no           | No adapter-to-adapter imports                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| sdks            | yes  | yes             | yes          | directed only                                                                                | no     | no   | no                                             | no           | No circular SDK-to-SDK dependencies; ADR-108 requires approved package-surface imports rather than direct runtime/search back-edges                                                                                                                                                                                                                                                                                                                                |
| design          | yes  | no              | no           | no                                                                                           | —      | no   | no                                             | no           | CSS artefact producers; consumed via built CSS, plus the sanctioned terminal-theme TS contract (ADR-148); intra-design direction per the 2026-07-19 amendment below. Foundation-libs cell corrected yes→no 2026-07-20: the enforced boundary (`createDesignBoundaryRules`) forbids `packages/libs/**` to design workspaces and no design workspace consumes one — the matrix now matches the enforcement                                                           |
| apps            | yes  | yes             | yes          | yes                                                                                          | yes    | —    | no                                             | no           | Apps consume substrate tiers; agent-tools and agent-graphs are out-of-band coordination/consumer tooling, not runtime dependencies for product applications                                                                                                                                                                                                                                                                                                        |
| agent-tools     | yes  | yes             | no           | no                                                                                           | no     | no   | —                                              | no           | Optional TypeScript implementation of Practice-operational tooling (ADR-165 phenotype boundary). Consumed as built `dist/` per ADR-178. No adapter-libs (no product-runtime adapter need); no sdks; no apps; no agent-graphs                                                                                                                                                                                                                                       |
| agent-graphs    | yes  | yes             | no           | `graph-corpus-sdk` only                                                                      | no     | no   | identity / collaboration plumbing exports only | —            | Agent-tooling-adjacent graph consumers. Consume graph substrate (`graph-core`, `graph-*` libs) and the typed corpus adapter (`graph-corpus-sdk`); other sdks (`curriculum-sdk`, `oak-search-sdk`, etc.) are out of scope and require an ADR-041 amendment to permit. Import from `agent-tools` is scoped to identity/collaboration plumbing exports; widening the permitted agent-tools surface requires an ADR-041 amendment. No apps; no adapter-libs; no design |

## Rationale

- Highest familiarity and discoverability; minimal churn from current state.
- Scales cleanly for more SDKs.
- Keeps provider-neutral observability close to other foundational building
  blocks while preserving a clear distinction between reusable foundation libs
  and runtime adapters.
- Cross-SDK coupling remains legitimate where the domain truly needs it, but it must be expressed through approved package surfaces rather than ad hoc direct imports. In the current SDK decomposition, runtime and search workspaces consume generated curriculum/search artefacts from `@oaknational/sdk-codegen` per ADR-108 instead of importing `@oaknational/curriculum-sdk` internals directly. Circular dependencies remain forbidden.

### 2026-05-11 amendment rationale (agent-tools + agent-graphs tiers)

- **`agent-tools/` regularisation closes a latent gap**. The workspace
  has been referenced by ADR-165 (phenotype boundary), ADR-168
  (workspace-script rules), and ADR-178 (build isolation) without an
  ADR-041 row recording its dependency-direction constraints. The
  amendment closes that gap: agent-tools imports from `core` and
  `foundation libs` only, has no importer back-edges from substrate
  tiers (an agent's coordination CLIs do not become a runtime
  dependency for product code), and is consumed as built `dist/`
  artefacts per ADR-178.
- **`agent-graphs/` is a distinct tier from substrate packages** per
  ADR-173 Design Principle 6 / Topology row 7. `practice-graph` is
  an agent-tooling-adjacent consumer that proves the graph substrate
  works for non-curriculum data; it is not a substrate library.
  Placing it under `packages/*` would obscure that distinction and
  open the door to substrate-vs-consumer ambiguity in future graph
  consumers. A dedicated tier preserves the boundary by construction.
  `agent-graphs/` may import `agent-tools` for identity/collaboration
  plumbing because graph consumers running inside agent workflows
  need the same coordination affordances as other agent processes;
  substrate tiers do not.

## Consequences

- Architecture README and onboarding updated to reflect Option A.
- SDKs moved under `packages/sdks/` as part of the workspace tidy-up.
- `packages/libs/` now has an explicit two-tier model, and
  `@oaknational/observability` lives in `packages/core/observability`.

### 2026-05-11 amendment consequences

- The dependency-direction matrix now records eight importer rows
  and eight importee columns. `depcruise`, `knip`, and any lint
  rules deriving allowed-import sets from this ADR must be re-
  generated to reflect the new tiers; the executable update is
  sequenced in the implementing plan, not in this ADR.
- `agent-tools/` is now a first-class workspace tier in this ADR's
  matrix; the previously-implicit constraints (per ADR-165 / ADR-178)
  are now explicit. Future agent-tools imports outside the permitted
  set fail the same way as substrate-tier violations.
- `agent-graphs/` ratifies as a workspace tier prior to ADR-173
  ratification. The `practice-graph` workspace placement is matrix-
  recorded; ADR-173's §Open Questions:1 can now resolve against this
  row. Subsequent `agent-graphs/` occupants follow the same tier
  rules without per-workspace ADR amendments.

### 2026-07-19 amendment (intra-design dependency direction, ADR-213)

[ADR-213](213-design-system-integration-and-component-architecture.md) adds a
fourth workspace to the design tier (`oak-design-system`, the integrated design
system — the estate's design source of truth; added by the implementing plan's
Stage A) and makes the tier's internal edges explicit for the first time. Intra-design direction ("may be imported by", no back-edges):

```text
design-tokens-core ──┐
                     ├→ oak-design-tokens → oak-design-ink
oak-design-system ───┘
```

(Corrected 2026-07-21: the earlier linear chain drew a
`design-tokens-core → oak-design-system` edge that does not exist — the
tier's two upstream workspaces are both direct inputs to
`oak-design-tokens`, which is the only intra-design join point.)

- `design-tokens-core` imports nothing from the design tier; its only
  monorepo import is the foundation library `@oaknational/result`
  (Result-typed validation seams — a runtime `dependency`, verified in
  `package.json` and source). It is consumed by
  `oak-design-tokens` as a runtime `dependency` (the built
  `dist/terminal-theme.js` imports it). `oak-design-system` carries NO
  `design-tokens-core` edge (corrected 2026-07-20 twice: an earlier revision
  called both edges devDependencies; a later one kept a phantom
  build/validation edge — the DTCG↔CSS consistency validation actually lives
  in `oak-design-tokens`' validator script, which reads `oak-design-system`
  output without `oak-design-system` depending on the tokens core).
- `oak-design-system` has zero runtime monorepo dependencies; its public
  surface is built CSS plus the generated DTCG export artefact — no React on
  the export surface.
- `oak-design-tokens` depends on `oak-design-system` (validator consumer of
  the DTCG export from ADR-213's PR3 dual-gate window, 2026-07-20; token data
  source from ADR-213 Stage B) and `design-tokens-core`.
- `oak-design-ink` depends on `oak-design-tokens` only.

The design row's constraint wording is also corrected: "consumed via built
CSS, not TS imports" was already contradicted by the sanctioned
terminal-theme TypeScript contract (ADR-148 §Output Formats) that
`oak-design-ink` consumes; the constraint now reads "consumed via built CSS,
plus the sanctioned terminal-theme TS contract". `depcruise` and any lint
rules deriving allowed-import sets must be regenerated for the new workspace;
the executable update is sequenced in the implementing plan
(design-system-integration, AIP-137), not in this ADR.

Dated amendment (2026-08-02, the ADR-213 §3 tier landing — design-lane
PR-2): `oak-design-react` joins `packages/design/` as the React binding
tier, its name settled at this landing per ADR-213 §3. Edges:

- `oak-design-react` may depend on `oak-design-system` only (the ADR-213 §4
  tier edge). At this landing the edge is contract-only — the theme-store
  adapter re-declares the `oakTheme` runtime interface rather than importing
  the package (the kit ships no type declarations); the package import
  materialises with the tier's first component.
- No design workspace imports `oak-design-react`; the kit's zero-runtime
  enumeration now names it (and `oak-design-assets`) in both boundary forms.
- The demos consume `oak-design-react` for the shared `useSyncExternalStore`
  theme-store adapter; the two prior in-demo copies are deleted at this
  landing.
- The design boundary inventory is machine-checked from this landing:
  `DESIGN_PACKAGE_IMPORTS` (`packages/core/oak-eslint/src/rules/boundary.ts`)
  must equal the live `packages/design/` inventory (the validate-boundaries
  design leg). _(Dated amendment 2026-08-18: "live inventory" means the
  depth-1 workspaces — the nested `packages/design/identities/*` pack tier
  is deliberately excluded from the tuple and carries its own structural
  leg; see the directory row above.)_

## Links

- Plan (completed): `.agent/plans/archive/completed/architectural-refinements-plan.md`
- Options analysis (completed): `.agent/plans/archive/completed/workspace-structure-options.md`
- Provider system: `docs/architecture/provider-system.md`
