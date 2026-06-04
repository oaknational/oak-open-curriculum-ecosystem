# ADR-041: Workspace Structure Option A Adopted

Status: Accepted (Revised)
Date: 2025-09-08
Updated: 2026-04-02; 2026-05-11 — `agent-tools/` tier regularised
(closing the latent ADR-165/168/178 gap); `agent-graphs/` tier added
as the workspace home for `practice-graph` and future agent-tooling-
adjacent graph consumers (ADR-173 prerequisite); 2026-06-04 —
`school-data-search/` POC service tier added for the in-repo school register
service.

## Context

We compared multiple workspace layouts to improve clarity, onboarding, and long-term maintenance. Options included: conventional apps+packages, domain buckets, and a flat packages-only layout.

## Decision

Adopt Option A (conventional) with clear directories:

- `apps/` – application runtimes (MCP servers, search CLI)
- `packages/core/` – foundational shared code and provider-neutral primitives
  (result types, ESLint config, env, OpenAPI adapter, observability helpers)
- `packages/libs/` – shared runtime libraries, split into:
  - foundation libs (`env-resolution`, `logger`, `search-contracts`)
  - adapter libs (`sentry-node`)
- `packages/sdks/` – SDK packages (curriculum-sdk, oak-search-sdk)
- `packages/design/` – design token workspaces producing CSS artefacts
  (design-tokens-core, oak-design-tokens). See ADR-148.
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
- `school-data-search/` – an in-repo POC service tier for the Oak School
  Data Search service. It owns four internal workspaces: contracts, SDK,
  generated client, and API app. The tier may consume core and foundation
  library packages, but nothing outside the tier imports from it during the
  POC.

> The dependency-direction matrix below expands `packages/libs/` into
> two distinct rows (`foundation libs` and `adapter libs`) because
> the two sub-tiers carry different import constraints; the matrix
> therefore has nine rows even though the Decision list enumerates
> eight top-level directories.

Rules & relationships:

- Inter‑workspace imports use `@oaknational/*` package specifiers only.
- Production source uses those package specifiers; explicit test/config lint
  carve-outs remain allowed where repo-root tooling or fixtures require them.
- Intra‑package relative imports allowed; avoid private/internal subpaths.
- Dependency direction (imports flow upward):

| Importer           | core | foundation libs | adapter libs | sdks                                                                                         | design | apps | agent-tools                                    | agent-graphs | school-data-search | Constraint                                                                                                                                                                                  |
| ------------------ | ---- | --------------- | ------------ | -------------------------------------------------------------------------------------------- | ------ | ---- | ---------------------------------------------- | ------------ | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| core               | —    | no              | no           | no                                                                                           | no     | no   | no                                             | no           | no                 | No monorepo dependencies outside `core`; external deps must stay minimal and provider-neutral                                                                                               |
| foundation libs    | yes  | —               | no           | approved generated subpath exports only (`search-contracts` -> `@oaknational/sdk-codegen/*`) | no     | no   | no                                             | no           | no                 | No lib-to-lib back-edges; `search-contracts` is the documented generated-contract exception                                                                                                 |
| adapter libs       | yes  | yes             | —            | no                                                                                           | no     | no   | no                                             | no           | no                 | No adapter-to-adapter imports                                                                                                                                                               |
| sdks               | yes  | yes             | yes          | directed only                                                                                | no     | no   | no                                             | no           | no                 | No circular SDK-to-SDK dependencies; ADR-108 requires approved package-surface imports rather than direct runtime/search back-edges                                                         |
| design             | yes  | yes             | no           | no                                                                                           | —      | no   | no                                             | no           | no                 | CSS artefact producers; consumed via built CSS, not TS imports                                                                                                                              |
| apps               | yes  | yes             | yes          | yes                                                                                          | yes    | —    | no                                             | no           | no                 | Apps consume substrate tiers; agent-tools, agent-graphs, and the school-data-search POC tier are not runtime dependencies for root product applications                                     |
| agent-tools        | yes  | yes             | no           | no                                                                                           | no     | no   | —                                              | no           | no                 | Optional TypeScript implementation of Practice-operational tooling. Consumed as built `dist/` per ADR-178; no adapter-libs, sdks, apps, agent-graphs, or school-data-search imports         |
| agent-graphs       | yes  | yes             | no           | `graph-corpus-sdk` only                                                                      | no     | no   | identity / collaboration plumbing exports only | —            | no                 | Agent-tooling-adjacent graph consumers. Other sdks require an ADR-041 amendment; no apps, adapter-libs, design, or school-data-search imports                                               |
| school-data-search | yes  | yes             | no           | no                                                                                           | no     | no   | no                                             | no           | directed only      | POC service tier. Internal flow is `contracts` -> `sdk` and `client`, then `apps/api` composes all three. Nothing outside this tier imports from school-data-search packages during the POC |

## Rationale

- Highest familiarity and discoverability; minimal churn from current state.
- Scales cleanly for more SDKs.
- Keeps provider-neutral observability close to other foundational building
  blocks while preserving a clear distinction between reusable foundation libs
  and runtime adapters.
- Cross-SDK coupling remains legitimate where the domain truly needs it, but it must be expressed through approved package surfaces rather than ad hoc direct imports. In the current SDK decomposition, runtime and search workspaces consume generated curriculum/search artefacts from `@oaknational/sdk-codegen` per ADR-108 instead of importing `@oaknational/curriculum-sdk` internals directly. Circular dependencies remain forbidden.

### 2026-06-04 amendment rationale (school-data-search tier)

- **`school-data-search/` is a POC service tier, not a reusable substrate tier.**
  The school register service needs four internal workspaces so contracts,
  ingestion/search SDK code, generated client code, and the Next.js API app keep
  their own dependency boundaries while the POC remains in this repository.
- **No outside imports during the POC.** The tier proves the service and its
  school-picker value path before extraction or publication. Other apps do not
  import its contracts/client until an owner go/no-go decision says the service
  should move beyond POC.
- **Internal direction is narrower than the root app row.** `contracts` is
  DB-free and app-free, `sdk` and `client` may depend on contracts, and
  `apps/api` composes the three internal packages. This keeps auth/runtime
  decisions in the app while preserving a generated client surface for later
  consumers.

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

### 2026-06-04 amendment consequences

- The dependency-direction matrix now records nine importer rows and nine
  importee columns. The school-data-search row is enforced by explicit
  `pnpm-workspace.yaml` entries, dependency-cruiser path-prefix rules, and a
  role-specific ESLint boundary factory for `contracts`, `sdk`, `client`, and
  `api`.
- The school-data-search POC client package stays private/unpublished. Any
  npm publication or import by another top-level tier requires a later owner
  decision and an ADR-041 amendment.

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

## Links

- Plan (completed): `.agent/plans/archive/completed/architectural-refinements-plan.md`
- Options analysis (completed): `.agent/plans/archive/completed/workspace-structure-options.md`
- Provider system: `docs/architecture/provider-system.md`
