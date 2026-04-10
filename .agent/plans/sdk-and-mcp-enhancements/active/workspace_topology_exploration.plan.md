---
name: Workspace Topology Exploration
overview: "Define a four-tier layered architecture (primitives, infrastructure, codegen-time, runtime), deeply analyse every package down to the function level using knip and dependency-cruiser, determine optimal placement, and move code to minimise coupling and maximise architectural excellence."
todos:
  - id: define-tier-model
    content: "Finalise the four-tier layered architecture model: primitives, infrastructure, codegen-time, runtime. Define import direction rules and classification tests. Resolve open questions (env tier, design tier, type-helpers placement)."
    status: pending
  - id: knip-analysis
    content: "Run knip across the monorepo. Identify dead exports, unused dependencies, unused files. Remove dead code first — it makes tier classification cleaner."
    status: pending
  - id: dependency-cruiser-analysis
    content: "Run dependency-cruiser with tier direction rules. Detect all violations: Tier 0 importing anything, Tier 1 importing Tier 2, runtime importing codegen internals. Produce a violation report."
    status: pending
  - id: function-level-caller-trace
    content: "For every export from primitives and infrastructure packages, trace all callers and classify each as codegen-time or runtime. Confirm genuine sharing vs false sharing at the function level."
    status: pending
  - id: synonym-codegen-conversion
    content: "Convert synonym builder functions (buildElasticsearchSynonyms, buildPhraseVocabulary, buildSynonymLookup, serialiseElasticsearchSynonyms) from runtime-called exports to codegen-time generators that produce committed TypeScript constants."
    status: pending
  - id: logger-reclassification
    content: "Move packages/libs/logger to infrastructure tier. Update pnpm-workspace.yaml and ESLint boundary rules. Package name stays @oaknational/logger (zero import changes)."
    status: pending
  - id: physical-structure-decision
    content: "Based on analysis evidence, decide on physical directory structure (3 roots, 4 roots, or refined current structure). Record as a new ADR."
    status: pending
  - id: eslint-tier-enforcement
    content: "Extend ESLint boundary rules to enforce the four-tier import direction law across all workspace categories, not just SDK-to-SDK."
    status: pending
  - id: migration-execution
    content: "Move packages to their correct tiers. Update pnpm-workspace.yaml, Turbo config, ESLint, docs. Verify all quality gates."
    status: pending
  - id: framework-consumer-audit
    content: "Systematic audit of existing workspaces against the 'Separate Framework from Consumer' principle. Identify violations and create follow-up items."
    status: pending
  - id: widget-migration-trigger
    content: "Document the trigger for creating a dedicated mcp-app-ui workspace: arrival of the second widget."
    status: pending
isProject: false
---

# Workspace Topology: Codegen-time vs Runtime Separation

**Status**: Strategic exploration plan — execute in a dedicated session
**Informed by**: ADR-041 (historical), ADR-108 (2x2 grid), surface isolation programme, user architectural questions

ADR-041 and ADR-108 are historical records of past decisions. They inform this analysis but do not constrain it.

---

## Terminology

**Codegen time** — when `pnpm sdk-codegen` or `pnpm vocab-gen` runs. Processes source data (OpenAPI specs, bulk downloads, synonym definitions) to produce committed TypeScript artifacts. Currently runs locally; will run in CI/CD and remote environments at GA.

**Runtime** — when a request is being handled by the MCP server or search operations are being served by the search CLI.

**Runtime build** — when `pnpm build` / tsup bundles runtime code into deployable artifacts. This is NOT codegen time. Both codegen-time and runtime workspaces have build steps.

Avoid "build time" without qualification — it's ambiguous between codegen time and runtime build.

## Analysis Tools

Beyond manual import tracing, use these for thorough analysis:
- **knip** — detects unused exports, unused dependencies, and unused files. Can reveal which exports from a workspace are actually consumed, and which are dead.
- **dependency-cruiser** — traces the full import graph with cycle detection and layer violation reporting. Can enforce codegen→runtime direction rules at the module level.
- **ESLint boundary rules** — `createSdkBoundaryRules()` in `oak-eslint` already enforces SDK-to-SDK direction. Can be extended for cross-category enforcement.

---

## Problem Statement

Two critical architectural boundaries are invisible in the current directory structure:

1. **Lifecycle** — `oak-sdk-codegen` sits next to `oak-curriculum-sdk` in `packages/sdks/`, but one runs at codegen time producing committed artifacts, the other at request time handling HTTP.

2. **Dependency weight** — `result` (zero deps, pure, stateless) sits next to `observability` (workspace deps, OTel integration, stateful) in `packages/core/`. Importing `result` is always safe; importing `observability` carries operational weight. These are qualitatively different things conflated under "core."

The direction: deeply analyse every package down to the function level, determine the optimal organisation to minimise coupling and maximise architectural excellence, define the principles, and then move code accordingly.

## Current Workspace Lifecycle Classification

This is the first gap: no formal document classifies workspaces by lifecycle.

- **Codegen-time only** (runs during `pnpm sdk-codegen` / `pnpm vocab-gen`, produces committed artifacts):
  - `packages/sdks/oak-sdk-codegen` — codegen scripts, bulk data processing, synonym data, committed output. Contains synonym builder functions currently called at runtime that should be converted to codegen-time generators (see work items below).
  - `packages/core/openapi-zod-client-adapter` (used only by codegen, misclassified as core)

- **Runtime only** (runs during request handling or CLI query execution):
  - `apps/oak-curriculum-mcp-streamable-http` — contains widget codegen step (`build:widget`); plan A converts widget HTML to committed constant
  - `apps/oak-search-cli` — mixed: search queries are runtime, but ingestion/index-setup commands are codegen-time/operational. The CLI is a mixed-lifecycle app.
  - `packages/sdks/oak-curriculum-sdk`
  - `packages/sdks/oak-search-sdk`
  - `packages/libs/env-resolution`
  - `packages/libs/logger` — **MISCLASSIFIED: used extensively by codegen** (codegen legitimately needs logging; at GA codegen runs remotely and needs structured logs. Should be reclassified as core.)
  - `packages/libs/sentry-mcp`
  - `packages/libs/sentry-node`
  - `packages/libs/search-contracts`

- **Genuinely lifecycle-agnostic** (verified at the import level):
  - `packages/core/result` — used by 2 codegen files AND 50+ runtime files
  - `packages/core/observability` — used by 2 codegen files AND 15+ runtime files

- **Falsely classified as lifecycle-agnostic** (import analysis disproves):
  - `packages/core/type-helpers` — zero codegen usage; "codegen" imports come from runtime code collocated in `oak-sdk-codegen/src/`
  - `packages/core/env` — zero codegen usage; only consumed by app entry points

- **Tooling** (developer tooling, neither codegen nor runtime):
  - `packages/core/oak-eslint`
  - `agent-tools`

- **Design** (build-time CSS generation, runtime consumption):
  - `packages/design/design-tokens-core`
  - `packages/design/oak-design-tokens`

## Function-Level Sharing Analysis

Import-level tracing of what each "lifecycle-agnostic" package actually provides to codegen-time code (scripts in `code-generation/` and `vocab-gen/`, NOT runtime code collocated in `src/`).

### `result` — GENUINELY SHARED

Codegen imports (2 files):
- `code-generation/sitemap-scanner.ts` — `ok`, `err`, `Result` (value + type)
- `code-generation/typegen/routing/validate-canonical-urls.ts` — `ok`, `err`, `Result`

These are real codegen operations using the Result monad for error handling. Would remain after ADR-108 decomposition. Cannot be eliminated without worse engineering (replacing Result with try/catch).

Runtime imports: 50+ files across all runtime workspaces. Heavy use of `ok`, `err`, `unwrap`, `isErr`, `isOk`, `Result`.

**Verdict**: Fundamental primitive. Correctly classified as core.

### `observability` — GENUINELY SHARED (thin usage)

Codegen imports (2 files):
- `code-generation/create-codegen-logger.ts` — `getActiveSpanContextSnapshot` (value)
- `vocab-gen/run-vocab-gen.ts` — `getActiveSpanContextSnapshot` (value)

These create loggers that participate in OTel spans during the codegen pipeline. This is a valid use — codegen produces telemetry.

Runtime imports: 15+ files across HTTP app, search CLI, sentry-node, sentry-mcp, logger. Uses `getActiveSpanContextSnapshot`, `redactHeaderValue`, `redactTelemetryObject`, `redactTelemetryValue`, `REDACTED_VALUE`, plus types.

**Verdict**: Genuinely shared. Single function used by codegen. Correctly classified as core.

### `type-helpers` — NOT GENUINELY SHARED

Codegen imports (0 files in `code-generation/` or `vocab-gen/`): **None.**

The 2 "codegen" imports come from `src/` files that are **convenience barrels/re-exports for runtime consumers**, not codegen scripts:
- `src/types/helpers/type-helpers.ts` — a barrel re-export consumed by curriculum-sdk at runtime
- `src/synonym-export.ts` — functions consumed by search-sdk and search-cli at runtime (candidates for conversion to codegen-time generators, see work item 1)

Neither is a codegen script — they exist in `src/` to be exported via public subpaths. Codegen scripts in `code-generation/` and `vocab-gen/` never import `type-helpers`.

Runtime imports: 15+ files across curriculum-sdk, search-sdk, HTTP app, search CLI, logger, search-contracts, sentry-node.

**Verdict**: Not shared. Correctly belongs in core (used by many runtime workspaces) but the "codegen usage" is a classification artifact of the mixed workspace.

### `logger` — GENUINELY SHARED but MISCLASSIFIED

Codegen imports (~15 files in `code-generation/` and `vocab-gen/`):
- `normalizeError` — 7 files (value)
- `logLevelToSeverityNumber`, `parseLogLevel`, `buildResourceAttributes` — 2 files (value)
- `Logger` type — 5 files (type-only)
- `UnifiedLogger`, `createNodeStdoutSink` from `@oaknational/logger/node` — 2 files (value)

This is **heavy, genuine codegen usage**. The codegen pipeline creates structured loggers, normalises errors, and sets log levels. This usage would remain after any decomposition. At GA, codegen runs remotely (CI/CD, Vercel) — these logs are essential for operational visibility, not just local development convenience.

Runtime imports: Used by HTTP app, search CLI, and all runtime libs.

**Misclassification**: Logger is classified as `packages/libs/` (runtime) but `oak-sdk-codegen` lists it as a **production `dependency`** in `package.json` and uses it in 15+ codegen files. The boundary rules for libs say "no lib-to-lib back-edges" but don't explicitly ban codegen importing from libs.

**Verdict**: Logger is genuinely lifecycle-agnostic. Should be reclassified as `packages/core/logger`.

### `env` — NOT SHARED

Zero codegen imports. Only consumed by app entry points (HTTP app, search CLI). Could be reclassified as runtime-only, but keeping it in core is defensible for future extensibility.

### `env-resolution` — NOT SHARED

Zero codegen imports. Runtime only. Classification as `packages/libs/` is correct.

---

## Work Required for Strict Lifecycle Separation

### 1. Convert synonym functions from runtime to codegen-time — MEDIUM IMPACT

`src/synonym-export.ts` contains functions that process **static synonym data defined in the codebase**:
- `buildElasticsearchSynonyms()` — produces ES synonym set JSON
- `buildPhraseVocabulary()` — produces a `ReadonlySet<string>` of multi-word curriculum terms
- `buildSynonymLookup()` — produces a `ReadonlyMap<string, string>` of alternative→canonical
- `serialiseElasticsearchSynonyms()` — JSON serialisation of the ES set

These are currently called at runtime by search-sdk (e.g., `buildPhraseVocabulary()` runs at module load in `detect-curriculum-phrases.ts`; `buildElasticsearchSynonyms()` runs during admin/setup operations in search-sdk and search-cli). But the source data is static — it only changes when someone edits the synonym definitions in `src/synonyms/`.

**Correct approach**: Convert these to codegen-time generators (same pattern as `generateWidgetConstants`, thread progressions, concept graphs). Run during `pnpm sdk-codegen`, produce committed TypeScript constants, consume the constants at runtime. This follows the cardinal rule: "ALL the heavy lifting MUST happen at sdk-codegen time."

**Work**:
- Create generators in `code-generation/` or `vocab-gen/` that run the existing functions and write committed constants to `src/types/generated/`
- Update search-sdk and search-cli to import committed constants instead of calling builder functions
- The builder functions themselves can stay as internal utilities used by the generators — they just stop being exported to runtime consumers
- Update `@oaknational/sdk-codegen/synonyms` public subpath to export constants instead of builder functions

**Scale**: Medium — existing functions are correct, just need to run at codegen time instead of runtime. Same pattern used elsewhere in the codebase.

**Note**: `buildElasticsearchSynonyms()` is also used operationally by the search CLI for ES index setup. The committed constant serves this use case equally well — the setup code imports the constant instead of calling the builder.

### 1b. Corrected classification of `src/bulk/` — NO WORK NEEDED

Previously misclassified as "runtime code in the codegen workspace." Correction: bulk data is downloaded as a prerequisite for the codegen pipeline. The `src/bulk/` utilities (readers, extractors, generators) are **codegen-time/operational code** that processes downloaded bulk data to produce committed artifacts (thread progression graphs, prerequisite graphs, vocabulary, ES mappings) and populate search indices. This is correctly placed in the codegen workspace.

The search CLI's ingestion commands use `readAllBulkFiles()` during index population — this is an operational/codegen-time step, not request-time code.

### 1c. `oak-sdk-codegen` decomposition (ADR-108) — future, unchanged

The ADR-108 4-workspace decomposition remains a valid future target for separating Generic from Oak-specific concerns. However, the lifecycle analysis shows less runtime contamination than initially assessed:

**Correctly codegen-time in `src/`:**
- `src/bulk/` — bulk data processing for codegen pipeline
- `src/synonyms/` — static synonym data (input to codegen)
- `src/types/generated/` — committed codegen output

**Convert to codegen-time (item 1 above):**
- `src/synonym-export.ts` — synonym builder functions → committed constants

**Convenience re-exports (lifecycle-neutral barrels):**
- `src/types/helpers/type-helpers.ts` — re-export of `@oaknational/type-helpers`
- Various `src/*.ts` barrels (`api-schema.ts`, `search.ts`, `mcp-tools.ts`) — re-export committed generated types for runtime consumers via public subpaths

The decomposition scope under ADR-108 is about Generic vs Oak separation (the 2x2 grid), not lifecycle correction. The lifecycle violations are smaller than assessed.

### 2. Logger reclassification — LOW IMPACT

Move `packages/libs/logger` to `packages/core/logger`.

**Why**: Logger is genuinely lifecycle-agnostic — used by 15+ codegen files and all runtime workspaces. Current placement in `libs/` (runtime) is incorrect.

**Work**:
- Move directory: `packages/libs/logger/` → `packages/core/logger/`
- Update `pnpm-workspace.yaml`: change `packages/libs/logger` to `packages/core/logger`
- Update ESLint boundary rules: remove `@oaknational/logger` from `LIB_PACKAGE_IMPORTS`, ensure it's permitted from core
- Package name stays `@oaknational/logger` — **zero import changes** anywhere
- Update documentation references

**Risk**: Very low. Package name doesn't change, only filesystem location.

### 3. `openapi-zod-client-adapter` reclassification — LOW IMPACT (future)

Currently in `packages/core/` but only consumed by codegen. Should move to a codegen workspace when ADR-108 Step 3 executes. No immediate work needed — it doesn't violate anything being in core (core is permitted by all consumers).

### 4. Widget build in app workspace — ADDRESSED BY PLAN A

The `build:widget` script (Vite + React) is a codegen step living in a runtime app. Plan A decouples it by making the output a committed constant. The widget sources remain in the app (proportional for one widget; trigger for extraction is the second widget).

### 5. No work needed (correctly classified)

- `result` — genuinely shared, correctly in core
- `observability` — genuinely shared, correctly in core
- `env` — runtime-only but core classification is defensible
- `env-resolution` — runtime-only, correctly in libs
- `sentry-node`, `sentry-mcp`, `search-contracts` — runtime-only, correctly in libs
- `oak-curriculum-sdk`, `oak-search-sdk` — runtime-only, correctly in sdks
- `oak-eslint` — tooling, correctly in core
- Design packages — build-time CSS generation, runtime consumption (Tranche 2)

---

## Four-Tier Layered Architecture

Derived from actual dependency evidence (`package.json` analysis of all packages).

### The Tiers

```
Tier 0  PRIMITIVES     Zero workspace deps, pure, stateless. Importing one
                       cannot transitively pull in any project code.

Tier 1  INFRASTRUCTURE Depends on Tier 0. Cross-cutting services with
                       operational character (configuration, side effects,
                       environmental needs). Both codegen and runtime use these.

Tier 2a CODEGEN-TIME   Depends on Tier 0+1. Produces committed TypeScript
                       artifacts. Codegen scripts and their input data.

Tier 2b RUNTIME        Depends on Tier 0+1 + committed artifacts from 2a.
                       Request handling, CLI queries.

Tier 3  APPS           Depends on everything below. Thin entry points.
                       Never imported by anything.
```

### Import Direction Law

Higher tiers may import from lower tiers. Lower tiers MUST NOT import from higher. 2a and 2b are **peers** — 2b imports 2a's committed output via public subpath exports, never 2a's internal codegen scripts. 2a never imports 2b.

### Classification criteria

**Primitive test**: Can it be extracted as a standalone npm package with zero project dependencies? AND is it pure and stateless — no configuration, no environment, no side effects?

**Infrastructure test**: Does it provide cross-cutting concerns (logging, telemetry, configuration, visual tokens) used by multiple lifecycle categories? Does it have operational character — configuration, environmental needs, or side effects? If yes, apply the **Framework/Consumer decomposition**: split the generic mechanism (Tier 1) from the deployment/project-specific instance (Tier 2b or wherever the consumer lives).

**Lifecycle test**: Does it produce committed artifacts (codegen-time), or handle requests/queries (runtime)?

### Current packages mapped to tiers (from dependency evidence)

**Tier 0 — Primitives** (verified zero deps):
- `result` — zero deps, pure Result monad
- `type-helpers` — zero deps, pure type utilities

**Tier 1 — Infrastructure** (verified workspace deps or operational character):
- `observability` → `type-helpers` + `@opentelemetry/api`. Reads OTel span context (stateful). **Decomposition question**: are redaction patterns generic or Oak-specific?
- `logger` → `observability`, `type-helpers` + `express` peer. Creates sinks, manages levels (configured). **Decomposition required**: `buildResourceAttributes` (Vercel-specific), Express middleware are consumer instances, not framework. Generic framework stays T1; consumer instances move to T2b.
- `env` → `zod` only (zero workspace deps). But reads `process.env` (environmental). **Decomposition question**: generic validation mechanism vs Oak-specific env var schemas.
- `design-tokens-core` → `result`. Generic token framework. Shared visual infrastructure. **Already decomposed**: `oak-design-tokens` is the Oak consumer instance (correctly in T2b).

**Tier 2a — Codegen-time**:
- `oak-sdk-codegen` — the codegen machine. Dependencies include `logger`, `observability`, `result`, `type-helpers` + many external.
- `openapi-zod-client-adapter` → `openapi-zod-client` only. Currently in `core/` but used exclusively by codegen.

**Tier 2b — Runtime libs**:
- `env-resolution` → `result` + `dotenv`, `zod`. Runtime configuration loading.
- `sentry-node` → `logger`, `observability`, `result`, `type-helpers` + `@sentry/node`. Error monitoring.
- `sentry-mcp` → `observability` + `@opentelemetry/api`. MCP-specific telemetry.
- `search-contracts` → `sdk-codegen` (committed types subpath), `type-helpers` + `zod`. Shared schemas.
- `oak-curriculum-sdk` — runtime SDK.
- `oak-search-sdk` — runtime SDK.

**Tier 3 — Apps**:
- `oak-curriculum-mcp-streamable-http` — MCP HTTP server. Contains widget codegen step.
- `oak-search-cli` — mixed: queries=runtime, ingestion/index-setup=codegen-time/operational.

**Tier 1 — Infrastructure (design)**:
- `design-tokens-core` → `result`. Generic token framework. Generates CSS/TS constants from token definitions. Shared visual infrastructure used by multiple UIs.
- `oak-design-tokens` → `design-tokens-core`, `result`. Oak-specific token consumer instance. (Framework/Consumer pattern already correctly applied here.)

### The dependency DAG confirms the tiers

```
result (T0)  ←  observability (T1)  ←  logger (T1)  ←  sentry-node (T2b)
                                                    ←  sdk-codegen (T2a)
type-helpers (T0)  ←  observability (T1)  ←  logger (T1)
                   ←  search-contracts (T2b)
                   ←  sentry-node (T2b)
result (T0)  ←  env-resolution (T2b)
             ←  design-tokens-core (T1)
```

No cycles. All arrows point downward (higher tier → lower tier). The model is consistent.

### Physical structure options

Tooling (`oak-eslint`, `agent-tools`) is orthogonal — it stays at the monorepo root and is not part of the tier structure.

After applying Framework/Consumer decomposition, infrastructure packages may split (e.g., logger-framework + oak-logger-vercel), increasing the package count in Tiers 1 and 2b.

**Option A: Four product roots**:
```
primitives/           # Tier 0 — zero deps, pure, stateless
  result/
  type-helpers/
infrastructure/       # Tier 1 — cross-cutting services, shared by codegen + runtime
  logger/             # generic framework (after decomposition)
  observability/      # generic framework (after decomposition)
  design-tokens-core/ # generic token framework
  env/                # if classified as infra (after decomposition)
codegen/              # Tier 2a — produces committed artifacts
  oak-sdk-codegen/    # codegen engine only (scripts + input data)
  openapi-zod-client-adapter/
runtime/              # Tier 2b + Tier 3
  apps/
    oak-curriculum-mcp-streamable-http/
    oak-search-cli/
  sdks/
    oak-curriculum-sdk/
    oak-search-sdk/
    oak-generated-types/    # committed codegen output (consumed by all runtime)
  libs/
    oak-logger-vercel/      # logger consumer instance (after decomposition)
    oak-design-tokens/      # design token consumer instance
    env-resolution/
    sentry-node/
    sentry-mcp/
    search-contracts/
```

**Option B: Three product roots (primitives inside infrastructure)**:
```
shared/               # Tier 0 + 1
  primitives/         # result, type-helpers — zero deps sublayer
  services/           # logger-framework, observability-framework, design-tokens-core
codegen/              # Tier 2a
  oak-sdk-codegen/
  openapi-zod-client-adapter/
runtime/              # Tier 2b + 3
  apps/...
  sdks/...            # including oak-generated-types
  libs/...            # including consumer instances (oak-logger-vercel, oak-design-tokens)
```

**Option C: Three product roots (explicit primitives root)**:
```
core/                 # Tier 0 — primitives only, zero deps guaranteed
  result/
  type-helpers/
infrastructure/       # Tier 1 — frameworks with deps, shared by codegen + runtime
  logger/
  observability/
  design-tokens-core/
codegen/              # Tier 2a
runtime/              # Tier 2b + 3
```

The choice depends on:
1. How many packages land in each tier after the deep analysis + Framework/Consumer decomposition
2. Whether the primitives/infrastructure distinction is worth a physical root (or a sublayer suffices)
3. The total churn cost vs. the architectural clarity gained

The **principles and direction rules are the same** regardless of physical layout. Phase 2 analysis determines the optimal layout.

### Architectural tensions and their foundational solutions

Each tension below was identified by pushing past "classify around the compromise" toward solutions that eliminate the root cause.

#### Tension 1: Barrel re-exports are false neutrality

`oak-sdk-codegen/src/` contains barrels that re-export from other packages (e.g., `type-helpers` re-exported so runtime consumers can import from `@oaknational/sdk-codegen`). Classifying these as "lifecycle-neutral" masks the real problem: **the codegen workspace serves as a distribution hub for runtime consumers**.

**Cause**: Everything is in one workspace because "the codegen produces it, so it lives there." Runtime consumers import generated types AND hand-written utilities AND re-exported primitives all from `@oaknational/sdk-codegen`.

**Foundational solution**: Separate the codegen engine from its output distribution. Runtime consumers should:
- Import primitives directly from their source packages (`@oaknational/type-helpers`, not via `@oaknational/sdk-codegen`)
- Import committed codegen output from a package that contains ONLY committed output, not codegen scripts

**Analysis task**: Map every public subpath of `@oaknational/sdk-codegen`. For each, classify as: "committed output", "hand-written runtime utility", "re-export of another package", or "codegen input/utility". Determine what needs to move and where.

#### Tension 2: Complex infrastructure conflates framework and instance

`@oaknational/logger` contains both generic logging infrastructure (`UnifiedLogger`, error normalisation, JSON sanitisation, sink interfaces, OTel format) AND deployment-specific logic (`buildResourceAttributes` knows about `VERCEL_ENV`, `VERCEL_REGION`, `VERCEL_DEPLOYMENT_ID`; Express middleware is Express-specific).

**Cause**: The package grew organically. Generic mechanisms and deployment-specific adaptations were added to the same package because they're "all about logging."

**Foundational solution**: Apply the "Separate Framework from Consumer" principle. Ask: "Could a non-Oak, non-Vercel, non-Express consumer use this component unchanged?"
- **Generic logging framework** (Tier 1): `UnifiedLogger`, error normalisation, JSON sanitisation, log levels, severity mapping, OTel format, sink interfaces, context merging.
- **Deployment-specific adaptations** (Tier 2b): `buildResourceAttributes` (Vercel env var detection), `getDeploymentEnvironment`, Express middleware.

**Analysis task**: Apply this decomposition question to every infrastructure package:
- `observability` — are redaction rules generic or Oak-specific?
- `env` — is the validation mechanism generic, or are the schemas Oak-specific?
- `sentry-node`, `sentry-mcp` — already consumer instances, or do they contain reusable framework logic?

#### Tension 3: Design is shared infrastructure

Design tokens generate CSS constants consumed by multiple UIs (the widget, potentially other MCP App views). This is cross-cutting visual infrastructure, not a separate category outside the tier model.

**Foundational solution**: Design tokens belong in Tier 1 (infrastructure). `design-tokens-core` is already the generic framework; `oak-design-tokens` is already the Oak consumer instance. This pair correctly follows the Framework/Consumer principle. Placing them in infrastructure alongside logger and observability makes the pattern consistent and visible.

#### Tension 4: Tooling is orthogonal to the product tier model

ESLint rules, test configurations, agent tools — these serve the entire monorepo. They enforce quality gates for ALL tiers. They're not product code.

**Foundational solution**: Tooling remains at the monorepo level. The tier model governs product code organisation; tooling governs the development process. These are orthogonal concerns. Don't try to classify tooling alongside product tiers.

### Open questions for Phase 2 analysis

These cannot be answered by reasoning alone — they require function-level import tracing.

1. **`env`** — zero workspace deps but reads `process.env`. Apply the Framework/Consumer decomposition: is the validation mechanism generic? Are the env var names Oak-specific?
2. **`env-resolution`** — runtime only today. Will remote codegen at GA need `.env` file resolution?
3. **`search-contracts`** — depends on `sdk-codegen` committed types. If committed output moves to a separate package, contracts depend on THAT instead.
4. **`type-helpers`** — passes the primitive test. Not imported by codegen. Classify by nature (primitive — it CAN be used anywhere) or current usage (runtime-only)?
5. **`openapi-zod-client-adapter`** — used exclusively by codegen, misplaced in `core/`. Move to codegen tier.
6. **`oak-search-cli`** — mixed lifecycle. Keep whole, or extract ingestion to codegen tier?
7. **`observability`** — apply Framework/Consumer decomposition to each export.
8. **`sentry-node`**, **`sentry-mcp`** — consumer instances of Sentry, or do they contain reusable framework logic?
9. **Logger decomposition** — `buildResourceAttributes` (Vercel-specific) vs `UnifiedLogger` (generic). How cleanly does the package split along framework/instance lines? What would the dependency graph look like after the split?

---

## Deep Analysis Plan

Direction: "Deeply analyse the code down to the function level, figure out the optimal organisational principles to minimise coupling and maximise architectural excellence, and then move code as appropriate."

### Phase 1: Establish principles (current work)

Define the four-tier layered architecture. Define import direction rules. Define classification tests. This is happening in this plan.

### Phase 2: Function-level analysis

For each package, answer: does every exported function/type align with its tier? Are there exports that should move?

**Tools**:
- `knip` — find unused exports, unused dependencies, unused files. Reveals which exports from each package are actually consumed and by whom.
- `dependency-cruiser` — trace the full import graph. Enforce tier direction rules at the module level. Detect violations.
- Manual grep/read — for specific function-level questions that tools can't answer.

**Specific analysis tasks**:

1. **Run knip across the monorepo** — identify dead exports in each package. Dead exports are noise that makes tier classification harder. Remove them first.

2. **Run dependency-cruiser with tier rules** — define allowed/forbidden import patterns:
   - Tier 2b (runtime) → Tier 2a (codegen) internal scripts: FORBIDDEN
   - Tier 2a → Tier 2b: FORBIDDEN
   - Tier 1 → Tier 2a or 2b: FORBIDDEN
   - Tier 0 → anything: FORBIDDEN
   - Validate every import edge in the graph

3. **For each "shared" function, trace all callers**:
   - Every export from `result`, `type-helpers`, `observability`, `logger`, `env`
   - Classify each caller as codegen-time or runtime
   - Confirm genuine sharing or identify false sharing

4. **Map every public subpath of `@oaknational/sdk-codegen`**:
   - Classify each export as: committed output, hand-written runtime utility, re-export of another package, or codegen input/utility
   - Identify which exports should move to a separate codegen output package
   - Identify which re-exports should be eliminated (consumers import from source package directly)

5. **Framework/Consumer decomposition of each infrastructure package**:
   - For each export, ask: "Could a non-Oak, non-Vercel consumer use this unchanged?"
   - Logger: generic framework vs Vercel-specific resource attributes, Express middleware
   - Observability: generic redaction vs Oak-specific patterns
   - Env: generic validation mechanism vs Oak-specific schemas
   - Design tokens: already decomposed (design-tokens-core + oak-design-tokens). Verify correctness.
   - Produce a split plan for each package that needs decomposition

6. **For each package's deps, verify tier compliance**:
   - A Tier 0 package must not depend on any workspace package
   - A Tier 1 package must only depend on Tier 0
   - A Tier 2a/2b package may depend on Tier 0 + 1
   - Flag violations. Each violation is either a misclassification or a decomposition trigger.

7. **Identify functions that should shift lifecycle**:
   - Functions that process static data but are called at runtime → candidates for codegen-time generators (synonym builders already identified)
   - Functions that could be computed once and committed → candidates for codegen-time constants
   - Barrel re-exports that create false coupling → candidates for elimination

### Phase 3: Optimal placement decisions

Based on Phase 2 evidence:
- Final tier assignment for each package
- List of functions/exports that need to move between packages or tiers
- Decision on physical directory structure (informed by package counts per tier)
- New ADR documenting the layered architecture and physical structure decision

### Phase 4: Migration execution

- Move packages to their correct tiers
- Convert synonym functions to codegen-time generators
- Update `pnpm-workspace.yaml`, ESLint boundary rules, Turbo config
- Verify all quality gates
- Update documentation

## Widget HTML Placement

User question: "Should we use a separate `codegen-time/lib/mcp-app-ui` workspace for handling the UIs?"

### Analysis

- Widget HTML is **Oak-specific** (Oak branding, Oak design tokens, Oak logo)
- Building it requires **React + Vite + design tokens** — dependencies the codegen workspace doesn't have
- `WIDGET_URI` and `WIDGET_TOOL_NAMES` are in `oak-sdk-codegen`, but they're metadata *about* the widget, not the widget itself
- The widget source code currently lives in `apps/.../widget/`
- There is currently **one widget** — a branding banner

### Options

1. **Stay in app workspace** (plan A approach): Widget sources stay in `apps/.../widget/`, committed constant in `apps/.../src/generated/`. Proportional for one widget.
2. **Move to `oak-sdk-codegen`**: Couples React/Vite to codegen. Architecturally wrong — codegen processes OpenAPI specs, not React components.
3. **New `mcp-app-ui-codegen` workspace**: Clean separation. Right when multiple widgets exist. Wrong now (YAGNI for one widget).

### Recommendation

**Option 1 for now, Option 3 when the second widget arrives.** The second widget is the trigger for creating a dedicated workspace. Plan A proceeds with Option 1.

## What Are Apps, Packages, Core, Libs, SDKs?

Current definitions from [principles.md](/.agent/directives/principles.md) and ADR-041:

- **apps/** — thin user interfaces that compose SDK capabilities. Never reimplement domain logic. Runtime only.
- **packages/sdks/** — own domain-specific logic and mechanisms. Mixed lifecycle (codegen + runtime sit here today).
- **packages/core/** — shared low-level code, provider-neutral primitives. Lifecycle-agnostic.
- **packages/libs/** — shared runtime libraries (foundation + adapter tiers). Runtime only.
- **packages/design/** — design token workspaces producing CSS artifacts.

**Gaps**: The definitions conflate two independent dimensions:
1. **Concern** (what the code does): SDK vs lib vs primitive vs infrastructure vs design vs tooling
2. **Lifecycle** (when the code runs): codegen-time vs runtime vs lifecycle-agnostic

Current `packages/core/` conflates two qualitatively different things:
- **Primitives** (`result`, `type-helpers`) — zero deps, pure, stateless. Safe for anything.
- **Infrastructure** (`observability`, `env`) — has deps, configuration, or environmental needs. Carries operational weight.

Current `packages/sdks/` conflates codegen and runtime SDKs in the same directory.

**Proposed refinement using the tier model**:

- **Tier 0 / Primitives** — zero-dep, pure, stateless. Universal import target. (`result`, `type-helpers`)
- **Tier 1 / Infrastructure** — cross-cutting services with operational character. Shared by codegen and runtime. (`logger`, `observability`, `env`, and potentially `design-tokens`)
- **Tier 2a / Codegen** — produces committed TypeScript artifacts from source data. (`oak-sdk-codegen`, `openapi-zod-client-adapter`)
- **Tier 2b / Runtime** — handles requests, queries, operations. Contains SDKs (`curriculum-sdk`, `search-sdk`), libs (`env-resolution`, `sentry-*`, `search-contracts`), and apps.
- **Tooling** — dev tools outside the product (`oak-eslint`, `agent-tools`).

The deep analysis (Phase 2) will confirm each package's tier and determine the optimal physical structure.

## Gap Analysis: What We Don't Know We Don't Have

1. **Formal tier classification** — no document classifies workspaces by tier. The four-tier model above (with import-level evidence) should become the authoritative reference.
2. **Framework/Consumer decomposition of infrastructure** — `logger` conflates generic framework and Vercel-specific instance. Other infrastructure packages may have similar issues. No systematic audit exists.
3. **Codegen workspace as distribution hub** — `oak-sdk-codegen` serves as both codegen engine and runtime type distribution. Barrel re-exports create false coupling. No clear separation of producer from consumer.
4. **Cross-category ESLint enforcement** — boundary rules cover SDK-to-SDK but not tier direction violations (e.g., codegen importing from a runtime lib — the logger case).
5. **Synonym functions as runtime-called codegen** — `buildElasticsearchSynonyms`, `buildPhraseVocabulary`, `buildSynonymLookup` process static data at runtime. Should be codegen-time generators producing committed constants.
6. **Widget build outside the `sdk-codegen` pipeline** — the Vite widget build is conceptually codegen but not part of `pnpm sdk-codegen` and not documented as such.
7. **Workspace definition document** — definitions live in `principles.md` prose but not as a formal reference mapped to the tier model.
8. **TDD in principles.md** — confirmed present and prominent (line 67-72 of principles.md, extensive in testing strategy).

## Relationship to Plan A (Widget Crash Fix)

Plan A ([`embed-widget-html-at-build-time.plan.md`](.agent/plans/sdk-and-mcp-enhancements/archive/completed/embed-widget-html-at-build-time.plan.md)) is **COMPLETE** (ADR-156). This exploration confirmed:

- Committed constant in the app workspace is proportional
- DI preservation is correct
- The codegen pattern (Vite build then embed script then committed TS) is sound
- No topology restructure is needed before implementing A
- A note should be added to A's documentation acknowledging that widget HTML generation may migrate to a dedicated workspace when additional widgets arrive

## Dev/Prod Divergence Concern

User question: "At one point there was a separation in how the HTML injection was handled in dev servers and prod servers."

Plan A **eliminates this**. Both `src/index.ts` (production) and `operations/development/http-dev.ts` (dev) import the same committed TypeScript constant. No `readFileSync` in dev mode, no special loaders in prod mode. Same constant, same DI seam, same code path.
