---
name: "Oak Surface Isolation and Generic Foundation Programme"
overview: "Strategic umbrella for separating Oak-specific surfaces from generic foundations across all affected workspaces, with public rename scope included."
todos:
  - id: workspace-classification-matrix
    content: "Complete and keep current the authoritative workspace classification matrix, including leakage types, target states, and tranche ownership."
    status: pending
  - id: tranche-1-platform-runtime
    content: "Promote the platform/runtime tranche covering env contracts, env resolution, observability, logger, Sentry wrappers, and neutral runtime defaults."
    status: pending
  - id: tranche-2-design-system
    content: "Promote the design-system tranche covering a generic token engine/CSS emitter and a thin Oak token leaf package."
    status: pending
  - id: tranche-3-tooling-governance
    content: "Promote the tooling/governance tranche covering generic ESLint rule primitives and an Oak repo policy pack."
    status: pending
  - id: tranche-4-sdk-codegen
    content: "Promote the SDK/codegen tranche covering generic OpenAPI/codegen/runtime infrastructure and Oak curriculum generators/augmenters."
    status: pending
  - id: tranche-5-search
    content: "Promote the search tranche covering generic retrieval/admin/index infrastructure and Oak search model/contracts."
    status: pending
  - id: tranche-6-app-surfaces
    content: "Promote the app-surface tranche covering thin Oak HTTP/search leaves and retirement of peer workspace drift."
    status: pending
---

# Oak Surface Isolation and Generic Foundation Programme

**Last Updated**: 2026-04-28
**Status**: Strategic brief — not yet executable
**Lane**: `future/`
**Related plans**:

- `current/workspace-layer-separation-audit.plan.md`
- `codegen/future/sdk-codegen-workspace-decomposition.md`
- `current/config-architecture-standardisation-plan.md`
- `future/stdio-http-server-alignment.md`
- `current/doc-architecture-phase-a-immediate.plan.md` — C4 diagrams and fitness functions must align with this programme's direction
- `current/doc-architecture-phase-b-dependent.plan.md` — boundary enforcement evaluation and operability practice must account for new services/structure
- `future/architectural-budget-system-across-scales.plan.md` — companion
  visibility and anti-gaming lens; topology migrations remain owned here

## Problem and Intent

The repository already has a strong architectural direction towards standard
layers and thin wrappers, but Oak-specific identity still leaks into
foundational workspaces through names, defaults, emitted surfaces, telemetry
namespaces, ownership metadata, and domain assumptions.

The leakage is not limited to obvious Oak leaf packages. Current examples in
foundational or mixed workspaces include:

- `OakApiKeyEnvSchema` and curriculum/bulk assumptions in `packages/core/env`
- `--oak-*` CSS variable emission in `packages/design/design-tokens-core`
- `oak.mcp.*` span names in `packages/libs/sentry-mcp`
- `oak.local` URL fallback in `packages/core/observability`
- `apps/oak-search-cli/*` ownership strings in `packages/libs/search-contracts`
- Oak curriculum generators and runtime-adjacent code sharing one workspace in
  `packages/sdks/oak-sdk-codegen`

Intent: every non-Oak capability becomes generic first, and every Oak package
becomes a thin instance, brand pack, composition root, or domain leaf over
that generic capability.

**2026-04-28 owner clarification:** this programme is not only about naming or
removing Oak strings from otherwise generic packages. Most code in the repo is
not yet properly separated into layers. Distinct architectural layers MUST live
in distinct workspaces. A same-workspace directory, module, barrel, or package
split is not sufficient when the concerns differ by generality, lifecycle,
dependency weight, or consumer specificity. The current executable audit plan
owns the immediate layer/workspace matrix and migration-map work.

This is a strategic umbrella, not a single executable refactor. Execution
belongs in tranche-specific `current/` and `active/` plans once sequencing,
rename maps, and deterministic validation are locked.

The architectural budget system is a companion lens over this programme, not a
replacement owner. Budget signals help find concentration, artificial splits,
and public-API pressure; this programme still owns one-layer-per-workspace
topology and tranche migrations.

## Public Interface Rule

The programme adopts a single public naming rule:

1. generic packages get generic names
2. Oak-specific packages keep or adopt `oak-` names
3. all packages remain under the `@oaknational/` scope
4. package and import renames are in scope wherever the capability is not
   Oak-specific

No compatibility facades, alias exports, or long-lived dual names are allowed.
Each tranche lands as a clean break.

## Mandatory Target Pattern

Every affected area must end in the same structural shape:

1. **One layer per workspace**
   - every workspace owns one coherent architectural layer
   - modules/directories organise within a layer; they do not separate layers
   - mixed-layer workspaces split, move code down, or move thin wrappers up
2. **Generic foundation workspace**
   - generic name
   - no Oak strings, Oak defaults, Oak telemetry namespaces, Oak brand
     emission, curriculum-specific assumptions, or app-path ownership
     metadata
3. **Thin Oak leaf workspace**
   - explicit `oak-` identity
   - owns Oak-only brand values, curriculum semantics, Oak URL behaviour,
     Oak search/domain assets, and final composition
4. **One-way dependency direction**
   - generic foundations never import Oak leaves
   - Oak leaves may depend on generic foundations

Explicit non-goal: "generic" does not mean "abstract for abstraction's sake".
Each generic package must still own a real capability boundary, not a hollow
wrapper.

## Authoritative Workspace Classification Matrix

This matrix is the authoritative inventory for the programme. Every promotion
decision starts here.

| Workspace | Classification | Oak-specific elements today | Target state | Tranche |
|---|---|---|---|---|
| `agent-tools` | `generic` | README examples point at Oak repo paths/workspaces | Keep generic; scrub Oak-only examples where they stop being helpful | 3 |
| `packages/core/result` | `generic` | No behavioural leakage found; only repo/package identity | Keep generic; no split required | 1 |
| `packages/core/type-helpers` | `generic` | No behavioural leakage found; only repo/package identity | Keep generic; no split required | 1 |
| `packages/core/openapi-zod-client-adapter` | `generic` | Docs and examples reference Oak codegen paths; runtime is generic | Keep generic; neutralise docs/examples | 4 |
| `packages/core/observability` | `generic` | `oak.local` URL fallback; docs frame package around Oak runtimes | Keep generic; replace Oak defaults with neutral/caller-supplied values | 1 |
| `packages/libs/env-resolution` | `generic` | Docs/examples point at Oak env contracts; runtime pipeline is generic | Keep generic; keep runtime generic and move Oak contract examples to leaf docs where possible | 1 |
| `packages/libs/logger` | `generic` | Docs/examples use Oak service names such as `oak-http` | Keep generic; neutralise examples and service-name guidance | 1 |
| `packages/libs/sentry-node` | `generic` | Docs frame helpers around Oak runtimes and examples | Keep generic; neutralise docs/examples | 1 |
| `packages/core/env` | `mixed` | `OakApiKeyEnvSchema`, curriculum API framing, bulk curriculum assumptions in a foundational package | Split generic runtime/env contracts from Oak curriculum env leaf contracts | 1 |
| `packages/core/oak-eslint` | `mixed` | Workspace/package identity is Oak-specific; rule set encodes Oak repo boundary doctrine and package exceptions | Split generic rule primitives from an Oak repo policy pack | 3 |
| `packages/design/design-tokens-core` | `mixed` | Core emitter hardcodes `--oak-*` variable naming; docs describe Oak as primary consumer | Split generic token/CSS engine from Oak-prefixed naming and brand concerns | 2 |
| `packages/libs/sentry-mcp` | `mixed` | Span names and attributes hardcode `oak.mcp.*` namespace | Replace hardcoded Oak namespace with caller-owned naming contract | 1 |
| `packages/libs/search-contracts` | `mixed` | Stage owner metadata hardcodes `apps/oak-search-cli/*`; field semantics are tied to Oak search model | Split generic search contract primitives from Oak search ownership/model registry | 5 |
| `packages/sdks/oak-sdk-codegen` | `mixed` | Generic OpenAPI/codegen/runtime infrastructure shares a workspace with Oak curriculum/search generators, vocab assets, and Oak-named exports | Split generic OpenAPI/codegen/runtime foundations from Oak curriculum/search generator leaves | 4 |
| `packages/design/oak-design-tokens` | `oak-leaf` | Oak brand palette, Oak CSS entrypoint, Oak-consumer-facing design assets | Keep as a thin Oak brand/token leaf over a generic token engine | 2 |
| `packages/sdks/oak-curriculum-sdk` | `oak-leaf` | Oak curriculum API identity, Oak URL augmentation, curriculum semantics, package identity | Keep as a thin Oak curriculum SDK leaf over generic OpenAPI/runtime foundations | 4 |
| `packages/sdks/oak-search-sdk` | `oak-leaf` | Oak search model, Oak curriculum index semantics, package identity | Keep as a thin Oak search leaf over generic retrieval/admin/index foundations | 5 |
| `apps/oak-curriculum-mcp-streamable-http` | `oak-leaf` | Canonical Oak HTTP app, Oak branding, Oak curriculum resources/prompts/tools | Keep as the canonical Oak app leaf over generalised server/runtime/design foundations | 6 |
| `apps/oak-curriculum-mcp-stdio` | `oak-leaf` | Legacy Oak stdio app; parallel app surface creates peer-workspace drift | Retire as a peer workspace; any future stdio support comes from the generalised HTTP composition seam | 6 |
| `apps/oak-search-cli` | `oak-leaf` | Oak curriculum ingestion, Oak search operations/evaluation assets, Oak UX/domain assumptions | Keep as a thin Oak operator leaf over generic search/runtime foundations | 5 / 6 |

## Programme Tranches

### Tranche 1 — Platform and Runtime Foundations

Scope:

- `packages/core/env`
- `packages/libs/env-resolution`
- `packages/core/observability`
- `packages/libs/logger`
- `packages/libs/sentry-node`
- `packages/libs/sentry-mcp`

Intent:

- remove Oak-specific defaults and namespaces from foundational runtime code
- establish the first generic-to-Oak leaf pattern in the lowest-risk area
- produce the first authoritative rename map and boundary tests

### Tranche 2 — Design System

Scope:

- `packages/design/design-tokens-core`
- `packages/design/oak-design-tokens`

Intent:

- move prefixing, brand values, and Oak-facing CSS identity into the Oak leaf
- leave the core workspace as a generic token validation/emission engine

### Tranche 3 — Tooling and Governance

Scope:

- `packages/core/oak-eslint`
- `agent-tools` where examples or automation assume Oak-only topology

Intent:

- separate generic rule mechanics from Oak repo policy
- prevent Oak boundary doctrine from leaking into packages meant to be generic

### Tranche 4 — SDK and Codegen

Scope:

- `packages/core/openapi-zod-client-adapter`
- `packages/sdks/oak-sdk-codegen`
- `packages/sdks/oak-curriculum-sdk`

Intent:

- establish generic OpenAPI/codegen/runtime foundations
- push Oak curriculum generation, Oak URL behaviour, and curriculum semantics
  into explicit Oak leaves
- align with `codegen/future/sdk-codegen-workspace-decomposition.md` rather
  than creating a competing decomposition

### Tranche 5 — Search

Scope:

- `packages/libs/search-contracts`
- `packages/sdks/oak-search-sdk`
- `apps/oak-search-cli`

Intent:

- separate generic retrieval/admin/index infrastructure from Oak search model,
  curriculum fields, operator workflows, and evaluation assets

### Tranche 6 — App Surfaces

Scope:

- `apps/oak-curriculum-mcp-streamable-http`
- `apps/oak-curriculum-mcp-stdio`
- thin-leaf consolidation across the Oak apps

Intent:

- leave one canonical Oak HTTP app surface
- ensure any later stdio support is derived from generalised server
  composition rather than a parallel Oak app
- complete the "thin Oak leaf" target shape at the application boundary

## Dependencies and Sequencing Assumptions

1. The active M2 blocker work in this collection remains higher priority than
   this programme.
2. Tranche 1 should be first because it establishes the neutral-default and
   one-way-dependency pattern in the smallest foundational slice.
3. Tranche 4 must explicitly incorporate the existing SDK codegen
   decomposition strategy rather than duplicating it.
4. Tranche 6 depends on ADR-128 remaining in force: no renewed investment in
   the standalone stdio workspace as a peer surface.
5. Each tranche must finish its documentation propagation and consolidation
   before the next tranche promotes.

## Promotion Trigger Into `current/`

The immediate executable child is now
[`current/workspace-layer-separation-audit.plan.md`](../current/workspace-layer-separation-audit.plan.md).
Promote tranche implementation plans only when all of the following are true:

1. this workspace classification matrix is complete and current
2. every workspace in the tranche has an agreed target state
3. the tranche has an authoritative rename map covering workspace names,
   package names, and import-path changes
4. the tranche has a deterministic validation set with no unresolved
   dependency-cycle risk
5. discoverability remains wired through `README.md`, `future/README.md`,
   `roadmap.md`, and the session prompt

## Validation Requirements For Promoted Tranches

Every executable child plan derived from this programme must include:

1. RED tests that prove the generic seam before extraction
2. package-boundary tests proving generic packages contain no Oak-specific
   contracts, defaults, namespaces, or emitted surfaces
3. import-graph checks proving generic foundations never import Oak leaves
4. deterministic rename-map verification for package and import-path moves
5. `pnpm check` as the aggregate readiness gate
6. `pnpm portability:check` and `pnpm subagents:check` whenever tooling,
   prompts, or platform surfaces change

## Success Signals

This programme is succeeding when:

1. foundational packages are free of Oak-prefixed constants, Oak-only
   defaults, Oak telemetry names, Oak brand emission, and app-specific owner
   metadata
2. every Oak package is visibly a thin leaf over generic foundations
3. generic foundations never depend on Oak leaves
4. the repo has enforcement rules that prevent Oak leakage from returning

## Risks and Mitigations

| Risk | Severity | Mitigation |
|---|---|---|
| Repo-wide rename churn across imports, docs, CI, and plans | High | Promote by tranche, make rename maps authoritative before execution, and keep docs propagation inside completion criteria |
| False-generic extractions creating unstable boundaries | High | Extract by capability boundary, not by file count or shared utility enthusiasm |
| Codegen/search/app dependency cycles during partial migration | High | Require dependency-cycle review before tranche promotion and make import-graph validation explicit |
| Discoverability drift after adding the strategic umbrella | Medium | Wire the plan through collection README, future index, roadmap, and session prompt from day one |
| Existing active work being disrupted by structural ambition | Medium | Keep this programme behind current M2 blockers and promote only one tranche at a time |

## Reference-Context Rule

Any implementation detail captured in this strategic brief is reference context
only. Execution commitments become binding only when a tranche is promoted into
`current/` or `active/`.
