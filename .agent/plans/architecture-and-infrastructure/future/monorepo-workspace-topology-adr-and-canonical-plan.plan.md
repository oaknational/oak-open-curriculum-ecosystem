---
name: "Monorepo Workspace Topology — ADR Superseding 108 and Canonical Plan"
overview: "Strategic programme to author a new ADR superseding ADR-108 with an all-workspace topology: explicit pipeline stages (not monolithic “codegen”), a three-way split between primitive emission, library/package build, and runtime consumption, ADR-154 thin leaves, a stage×workspace matrix with multi-stage membership as a boundary signal, consolidation into one canonical plan, then enforcement handoff."
todos:
  - id: owner-topology-lock
    content: "Owner review: confirm generality axis; confirm pipeline stage list (below) and which stages admit optional/mining passes; confirm thin-leaf rule; resolve mixed-lifecycle apps and design/tooling placement."
    status: pending
  - id: pipeline-stage-inventory
    content: "For each pnpm workspace package, tag participating pipeline stages (S0–S6); flag multi-stage non-substrate packages for boundary triage; include packages/core/* explicitly."
    status: pending
  - id: source-inventory
    content: "Inventory and link all authoritative inputs: ADR-108, ADR-154, ADR-041/031/030, principles § Separate Framework from Consumer, openapi-pipeline.md, sdk-codegen README, codegen README cluster, workspace_topology_exploration, oak-surface-isolation programme, workspace-layer-separation-audit, sdk-codegen-workspace-decomposition."
    status: pending
  - id: draft-adr-supersedes-108
    content: "Draft new ADR (number TBD): supersedes ADR-108; defines pipeline stages vs monolithic codegen; 2×2 generality×role grid mapped onto stages; per-quadrant/stage refinements; API vs bulk lineages; ADR-154; ADR-117 hierarchy; non-goals."
    status: pending
  - id: canonical-topology-plan
    content: "Author single canonical topology doc: stages, three producer roles (primitive emitters, library authors, app consumers), stage matrix snapshot date; child plans link only."
    status: pending
  - id: roadmap-and-crossrefs
    content: "Update architecture-and-infrastructure roadmap and related collection indexes; add supersession notice to ADR-108; cross-link ADR-154; register thread/handoff if multi-session."
    status: pending
  - id: enforcement-handoff
    content: "After ADR acceptance: promote or refresh executable plans with acceptance criteria tied to stage boundaries — ESLint/import rules, knip, depcruise layers."
    status: pending
isProject: false
---

# Monorepo Workspace Topology — ADR Superseding 108 and Canonical Plan

**Last Updated**: 2026-05-09  
**Status**: Strategic brief — not executable until owner locks topology sketch and ADR numbering  
**Lane**: `future/`  
**Foundation alignment**: @.agent/directives/principles.md (Separate Framework from Consumer, Cardinal Rule, architectural excellence); @.agent/directives/testing-strategy.md (enforcement and migrations land with verifiable gates); @.agent/directives/schema-first-execution.md (definitions → emitted primitives → consumers; generator fixes over consumer shortcuts)

---

## Metacognition — Plan Delta (2026-05-09)

**Thinking**: Treating “codegen” as one concept blended **definition I/O**, **emission of data primitives** (types, constants, predicates), **optional data mining**, **library composition**, and **package build** into a single mental bucket. That makes it harder to reason about dependencies, ownership, and enforcement.

**Reflection**: The owner’s split matches how failures actually show up: confused boundaries between **programs that emit artefacts**, **packages that wrap those artefacts**, and **entrypoints that only consume** — plus **substrates** (e.g. `core`) that **attach at multiple stages** for legitimate reasons.

**Insight**: The ADR and matrix must use an explicit **stage list** and **three producer roles**, not a single “codegen” label. **Multi-stage membership** (outside an explicit substrate allow-list) is a **deliberate signal** to inspect for **layer confusion**, not an automatic verdict.

**Bridge to impact**: The sections below replace the monolithic “Axis A = codegen-time” band with **pipeline stages**; the 2×2 becomes **generality × where in the supply chain**, with stages **S0–S6**. Executable work then attaches **lint/depcruise** to **stage violations**, not to the word “codegen”.

---

## Problem and Intent

ADR-108 correctly decomposes the **SDK concern** along **generation-time vs runtime** and **generic vs Oak-specific**, and names **two codegen data lineages** (OpenAPI API vs bulk). It does not fully cover **non-SDK workspace types** (design, tooling, agent-tools, mixed-lifecycle apps) or a **single place** that states the **refined topology** agreed across:

- @docs/architecture/architectural-decisions/108-sdk-workspace-decomposition.md  
- @docs/architecture/architectural-decisions/154-separate-framework-from-consumer.md  
- @.agent/plans/sdk-and-mcp-enhancements/active/workspace_topology_exploration.plan.md  
- @.agent/plans/architecture-and-infrastructure/future/oak-surface-isolation-and-generic-foundation-programme.plan.md  
- @.agent/plans/architecture-and-infrastructure/current/workspace-layer-separation-audit.plan.md  
- @.agent/plans/architecture-and-infrastructure/codegen/README.md and nested `future/` / analysis docs  

**Intent**: Supersede ADR-108 with a **broader ADR** that:

1. Retains a **2×2 grid** on **generality** (generic vs named consumer) × **supply-chain role** (aligned to pipeline stages below), for **domain shipping** (SDK/MCP/search) and extensions.  
2. **Does not** collapse heterogeneous work into the single word **“codegen”** — see **Pipeline stages**.  
3. Makes **three distinctions mandatory** in documentation and enforcement: **(A)** code that **creates data primitives** from definitions; **(B)** code that **builds libraries** (hand-authored and thin glue) **from those primitives** for apps to depend on; **(C)** **runtime apps and servers** that **consume** built libraries only (except explicit operational scripts). Between (A) and (C) sit **optional mining/analysis** passes that may **gate completeness** of the artefacts libraries need.  
4. Places **all workspace categories** in the model, including **substrate** (`core`, tooling, design engine) with **per-stage participation** tags.  
5. Makes **ADR-154** explicit: named leaves stay **config + composition** where possible; mechanism and **domain-shaped logic** belong in **generic frameworks** and **S1/S2 outputs**, not duplicated in thin apps.  
6. Consolidates plan **intent** into **one canonical topology document**; children **link**, they do not restate.

---

## Pipeline stages (replaces monolithic “codegen”)

*Ordered supply chain from sources of truth to running process. Names are for the ADR — adjust for publication.*

| Stage | Short | What runs | Primary outputs |
|-------|-------|-----------|-----------------|
| **S0** | Definition acquisition | Fetch/cache/sync **data definitions**: OpenAPI, bulk snapshot manifests, synonym inputs, etc. | **Inputs** on disk or in cache — not necessarily committed TS |
| **S1** | Primitive emission | Deterministic generators: types, constants, Zod (and similar), **type predicates** / guards where generated | **Committed “data primitives”** — the static vocabulary for working with the domain |
| **S2** | Derived analysis / mining (optional) | Read **data** (not only schemas), aggregate, mine vocab/graph/fixtures; may depend on S1 or parallel definitions | **Additional committed artefacts** or reports; may **block** “complete” library surface until finished |
| **S3** | Library composition | **Hand-authored** (or thin templated) **packages** that **import S1/S2** and expose **runtime-oriented APIs** (clients, validators, tool tables) | **Library source** in version control — **not** a substitute for S1 |
| **S4** | Package build | `tsc`, `tsup`, tests that compile packages | **Built** JS/d.ts — **no new domain semantics** |
| **S5** | Runtime assembly | App entrypoints wire env, DI, servers | Deployable **bundles** / server binaries |
| **S6** | Runtime execution | MCP HTTP, search CLI **query** paths, live traffic | Responses, side effects |

**Clarifications**

- **`pnpm sdk-codegen`** today typically spans **S0–S2** depending on task (fetch OpenAPI, emit types, vocab pipeline). The ADR should **name which scripts cover which stages** instead of one blob.  
- **S3** is where **“utilities and libraries we expect runtime apps to consume”** mostly live — they **consume primitives**, they do not re-derive them ad hoc.  
- **S4** is **build**, not “codegen”: it **must not** introduce types that should have been **S1**.  
- **Mixed surfaces** (e.g. CLI with ingest + query): classify **per command** or **per entry module** by **highest stage touched**, and flag **cross-stage imports** inside one deployable unit for review.

### Three producer roles (enforcement narrative)

1. **Primitive emitters** — authors/maintainers of **S0–S2** tooling and templates.  
2. **Library authors** — **S3** (+ tests); depend on **S1/S2** outputs.  
3. **App authors** — **S5–S6**; depend on **S4** outputs of libraries.

---

## Proposed Topology (Strawman for Owner Review — Not Yet ADR Text)

*Generalises ADR-108, aligns with ADR-154, uses stages **S0–S6**.*

### Axis A — Supply-chain stages (not a single “codegen” band)

Use **S0–S6** for every classification. **Do not** use “codegen” in ADR titles as if it were one phase.

Legacy shorthand mapping (for migration prose only): previous “codegen-time” ≈ **S0–S2** (and occasionally **S3** when scripts emit glue); “runtime build” ≈ **S4**; “runtime” ≈ **S5–S6**.

### Axis B — Generality (generic framework vs named consumer)

| Band | Meaning |
|------|---------|
| **Generic** | Any consumer could adopt the contract unchanged or via config |
| **Named consumer** | Oak-branded (or future entity-branded) **thin leaf**: wires config, URLs, allowlists, composition |

**ADR-154 rule**: In every stack, push **mechanism downward**; the **named leaf** is **as thin as practicable** — ideally **configuration and composition only**; **logic** belongs in **generic** packages (**S3** frameworks and **S1/S2** emitted primitives), not in named leaves beyond justified **wiring**.

### Substrate (orthogonal to the 2×2 — “below” both axes)

Ordered by **dependency weight** and **reuse perimeter** (per workspace_topology_exploration):

1. **Primitives** — minimal deps, pure patterns (`result`, tiny helpers).  
2. **Infrastructure** — observability, logging **mechanism**, env resolution **libraries** (not Oak defaults).  
3. **Tooling** — ESLint, scripts, agent-tools host adapters (Practice portability per ADR-154/165).  
4. **Design substrate** — generic token engine vs thin brand leaf (pattern per ADR-148).

Substrate packages **are not “Oak codegen” or “Oak runtime”**; they **feed** multiple stages. The ADR must list **which stages** each substrate category is **allowed** to participate in; **substrate** is the only class that may legitimately span **many stages** without automatic triage.

### Workspace / package matrix rule

- Every **pnpm workspace** gets a **stage tag set** `{S0…S6}` and **generality** (generic / named / substrate).  
- **Multi-stage** packages **outside substrate**: **not forbidden** — **required** to carry a **short justification** in the matrix; default expectation is **split or tighten imports**.  
- **Core** (`packages/core/*`): complete the matrix first — several items are **intentionally multi-stage**; others are **historical leakage** per ADR-154.

### Inside the four quadrants (2×2: generality × dominant supply-chain band)

Quadrants describe **dominant** work; **exact stage** is always **S0–S6**.

**Q1 — Generic × Artefact production (S0–S2 dominant)**

- Definition acquisition **mechanisms**, normalisation, **S1 emitters** (types, predicates, constants, Zod)
- Hook **interfaces** only — no Oak policy
- Lineage-agnostic shared extractors used by multiple **S0** sources

**Q2 — Named consumer × Artefact production (S0–S2 dominant)**

- Oak **config** for decoration, security, naming, widget constants
- **Parallel lineages** (same stage bands, separate inputs):
  - **API lineage** — OpenAPI → **S1** primitives + MCP contract shapes
  - **Bulk lineage** — JSON snapshots → **S1/S2** (mappings, vocab, graphs)
- Policies for **who imports generated output** (barrels, lint excludes)

**Q3 — Generic × Library + runtime framework (S3 dominant, consumes S1/S2)**

- HTTP factories, MCP dispatch/validation **framework**, middleware **patterns**
- Search **mechanism** without Oak-specific field names in **generic** modules

**Q4 — Named consumer × Library + apps (S3–S6 dominant)**

- **Thin** Oak SDK leaf: URLs, keys, **wiring**; no re-derivation of **S1** primitives
- **Thin** apps: **S5–S6** composition; **S4** via dependency graph only

### Apps and libraries

- **Libraries**: tag **S3** (source) vs **S4** (artifact); **S3** imports **S1/S2**, never hand-rolled parallel types (Cardinal Rule).  
- **Apps**: ideally **S5–S6** only in **product** code; if an app embeds **S0–S2** scripts, **separate** deployable from **library** surface or document **operational exception**.  
- **Cross-stage smells**: e.g. **S6** importing **S0** fetch helpers; **S1** generators importing **S3** runtime frameworks — **triage**.

---

## Domain Boundaries and Non-Goals

**In scope**

- One **superseding ADR** + **one canonical topology narrative** + **roadmap/index cross-links**.  
- Explicit **relationship** to ADR-108 (superseded) and ADR-154 (strengthened reference, not replaced).  

**Non-goals (this strategic plan)**

- **Physical workspace moves** — owned by promoted executable plans (e.g. workspace-layer-separation-audit, codegen decomposition).  
- **Rewriting every README** — only **entrypoints** and **conflicting** statements.  
- **Resolving every mixed-lifecycle edge case in prose** — ADR names **rules**; audits name **instances**.

---

## Dependencies and Sequencing Assumptions

1. **Owner locks** the strawman topology (or a revised variant).  
2. **ADR number** assigned per repo convention (supersedes 108; **does not** silently amend 154 — **links** it).  
3. **Canonical plan** lives in **one** path; @.agent/plans/templates/README.md document hierarchy: **facts once**, links elsewhere.  
4. **Executable** migration/enforcement plans **inherit** acceptance criteria from the new ADR when promoted from `future/` to `current/`.

---

## Success Signals

- ADR **Accepted** with explicit **Supersedes: 108** and **Related: 154, 117, 031, 030**.  
- ADR (or canonical doc) defines **S0–S6**, **three producer roles**, and **substrate exception** for multi-stage `core`.  
- **Stage×workspace matrix** exists with **version date**; multi-stage non-substrate packages either **split** or have **recorded justification**.  
- **Canonical topology** document is **discoverable** from `architecture-and-infrastructure/roadmap.md` and `docs/architecture` index (as applicable).  
- Child plans **link** to canonical topology; **workspace-layer-separation-audit** cites **one** authority for stages + matrix.

---

## Risks and Unknowns

| Risk | Mitigation |
|------|------------|
| ADR becomes a **dump** of every package name | Keep ADR **taxonomic**; **matrix** lives in canonical plan or a single table with version date |
| **Stage fatigue** (S0–S6 too fine) | Allow **collapse in diagrams** only if **footnotes** preserve full list |
| **Mixed-lifecycle** apps blur boundaries | Per-command or per-module **stage** + **import direction** checks |
| Legitimate **multi-stage** packages wrongly shamed | Explicit **substrate** and **justified** lists in matrix |
| **multi-entity** (non-Oak) consumers not yet present | Frame **named consumer** generically; Oak is **first instance** |
| Plan sprawl **reappears** | **Roadmap** discipline: one canonical doc; **PR checklist** references ADR section |

---

## Promotion Trigger

Promote to `current/` as an **executable** plan when:

1. Owner **accepts** topology strawman (or records deltas).  
2. **ADR draft** is ready for review merge (or split: ADR PR + consolidation PR).  

Executable child should use **quality-fix** or **adoption-rollout** template per scope (docs-only vs enforcement).

---

## Learning Loop and Lifecycle

Reference @.agent/plans/templates/components/lifecycle-triggers.md on promotion: thread record, consolidation workflow (`/jc-consolidate-docs`) after ADR merge, update `completed-plans` only if this file moves to **archive/completed/**.

---

## Note on Execution Detail

All **implementation sequencing** (package moves, ESLint tiers, knip) is **reference context** here. **Final** task ordering and TDD obligations are fixed only in a promoted **executable** plan per @.agent/commands/plan.md.
