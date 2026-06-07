---
name: "MCP Output Schemas and Response Validation"
overview: "Declare a truthful, REQUIRED, object-rooted `outputSchema` on every MCP tool — composed at codegen time for the generated tools, hand-authored (reusing generated sub-schemas) for the aggregated tools (including the EEF tool, `get-eef-evidence`), with the existing graph tools receiving theirs as part of their substrate migration — and thread it through the canonical universal-tools descriptor surface to `registerTool`/`registerAppTool` (the carrier seam, including the SDK-`registerTool` vs ext-apps-`registerAppTool` divergence, solved ONCE here at the infra layer), so MCP clients receive a machine-checkable contract for the `structuredContent` they get back. Delivery order (revised 2026-06-07, owner-ratified 2026-06-06 — EEF D6 ships NO output schema; the EEF tool gains its output schema HERE with every other tool): generated tools via codegen, aggregated tools (incl. EEF) hand-authored, graph tools at migration, required/root promotion last."
source_research:
  - "../../../reports/output-schema-mcp-plan-audit-2026-06-02.md"
  - "../roadmap.md"
todos:
  - id: w1-cycle-1
    content: "W1 cycle 1 (codegen, ATOMIC): add the required MCP output-envelope field to the ToolDescriptor contract + emitter (contract template, generate-tool-descriptor-file.ts, emit-index.ts); compose the envelope (status, data, summary, conditional oakContextHint) as an object-rooted Zod raw shape from each tool's response descriptor; regenerate all 24 tool files; emitter unit tests for single-status, multi-status (union nested under `data`, object root), and the requiresDomainContext oakContextHint conditional (predicate: include unless requiresDomainContext === false). One commit. Tree green."
    status: pending
    depends_on: []
  - id: w1-cycle-2
    content: "W1 cycle 2 (codegen): integration test asserts every generated descriptor carries an object-rooted outputSchema whose Zod raw shape accepts that tool's real formatToolResponse structuredContent and rejects a payload missing a declared field. One commit. Tree green."
    status: pending
    depends_on: [w1-cycle-1]
  - id: w2-cycle-1
    content: "W2 cycle 1 (aggregated, ATOMIC): author the in-scope aggregated tools' output shapes matching each tool's real structuredContent (reusing generated sub-schemas where the payload embeds generated types; search modelled as a single object with mode-specific fields optional, NOT a root union); per-tool conformance unit tests. Scope and the required-field landing shape follow §Resolved Sequencing: the 3 existing graph tools are excluded (their schemas land with their substrate migration), and requiredness lands at the per-type promotion point. Re-cut at execution start. One commit. Tree green."
    status: pending
    depends_on: []
  - id: s0-cycle-1
    content: "S0 cycle 1 (seam): add REQUIRED outputSchema (z.ZodRawShape) to ToolRegistryDescriptor and UniversalToolListEntry + a requireGeneratedToolOutputShape helper; forward outputSchema in listUniversalTools() from both the aggregated defs and generated descriptors; add `outputSchema: tool.outputSchema` to the single registerTool/registerAppTool config in handlers.ts. Integration test: the registration config carries outputSchema for all 35 tools (spy-observation pattern). One commit. Tree green."
    status: pending
    depends_on: [w1-cycle-2, w2-cycle-1]
    decision_gate: "Re-cut to §Resolved Sequencing (owner, 2026-06-02) before execution — S0's required promotion executes last"
  - id: s0-cycle-2
    content: "S0 cycle 2 (proof): integration/E2E test proving (a) tools/list exposes outputSchema for all 35; (b) real emitted structuredContent validates against the declared outputSchema for a representative generated and a representative aggregated tool; (c) every tool's success return carries structuredContent (the required-outputSchema invariant); (d) an isError:true path skips output validation. One commit. Tree green."
    status: pending
    depends_on: [s0-cycle-1]
  - id: ws-docs
    content: "Docs: remove the stale 'download-asset on stdio' TSDoc (list-tools.ts:25-26) and update the list-tools @example to include outputSchema; TSDoc on the new fields and the requireGeneratedToolOutputShape helper; update any README enumerating the tool surface to 35 (24 + 11). Land alongside the cycles whose behaviour they document."
    status: pending
    depends_on: [s0-cycle-2]
  - id: ws-gates
    content: "Quality gates: full canonical chain (sdk-codegen → build → type-check → format → markdownlint → lint → test → test:ui → test:e2e) on the integrated delivery."
    status: pending
    depends_on: [ws-docs]
  - id: ws-review
    content: "Adversarial review: mcp-expert, code-expert, type-expert, test-expert, docs-adr-expert. Critically analyse findings against the real code before acting; document dispositions."
    status: pending
    depends_on: [ws-gates]
  - id: ws-consolidate
    content: "Consolidation: run /oak-consolidate-docs; mine any settled contract into ADR/reference docs; archive per ADR-117."
    status: pending
    depends_on: [ws-review]
isProject: false
---

# MCP Output Schemas and Response Validation

**Last Updated**: 2026-06-02
**Status**: 🟢 DECISION-COMPLETE — S0 ownership and the delivery order are owner-resolved (2026-06-02, see [§Resolved Sequencing](#resolved-sequencing-owner-2026-06-02)). The W1/W2/S0 cycle decomposition below predates that resolution (it decomposes by populate-all-then-wire); the cycles are re-cut to the ratified order at execution-session start, before any cycle runs.
**Scope**: Give every MCP tool a truthful, required, object-rooted `outputSchema` and expose it through the live registration path.

> **Provenance**: this plan was fully re-grounded on 2026-06-02 against live
> code, then revised against five specialist reviews (mcp / assumptions / type /
> code / docs-adr) whose findings were verified against the installed SDK and
> the real seam. The claim-by-claim audit lives in
> [`output-schema-mcp-plan-audit-2026-06-02.md`](../../../reports/output-schema-mcp-plan-audit-2026-06-02.md).
> That report is the authoritative source for *why* the facts changed; this plan
> is the authoritative source for *what to build*.

---

## Context

### Problem Statement

The MCP tool surface exposes `inputSchema` but not `outputSchema`. MCP clients
and models receive no machine-checkable description of the `structuredContent`
a tool returns. The MCP spec defines `outputSchema` for exactly this, and the
installed SDK runtime-validates a tool's `structuredContent` against it when
declared. We declare nothing, so we get neither the client-facing contract nor
the runtime guarantee.

A prior version of this plan had rotted against the code (stdio transport that
no longer exists, wrong tool counts, a sequencing gate pointing at deleted
files, an inverted "must generate output schemas" framing). The audit corrected
all of it; the facts below are verified against live code.

### Verified Current State (2026-06-02)

- **One transport.** `StreamableHTTPServerTransport`, instantiated per-request
  (`apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:101`).
  **There is no stdio transport** — zero `StdioServerTransport` occurrences.
- **35 tools total**, all registered through one loop
  (`handlers.ts:158`): **24 generated** (`MCP_TOOL_ENTRIES`,
  `oak-sdk-codegen/.../mcp-tools/definitions.ts:41-66`) + **11 aggregated**
  (`AggregatedToolName`, `universal-tools/types.ts:76-87`): `search`, `fetch`,
  `get-curriculum-model`, `get-thread-progressions`, `get-prior-knowledge-graph`,
  `get-misconception-graph`, `browse-curriculum`, `explore-topic`,
  `download-asset`, `user-search`, `user-search-query`.
- **`outputSchema` is absent from the entire wire path** — not on
  `ToolRegistryDescriptor` (`types.ts:31-40`), `UniversalToolListEntry`
  (`types.ts:120-142`), `AggregatedToolDefShape` (`definitions.ts:58-70`),
  `listUniversalTools()` (`list-tools.ts:62-94`), or the `config` object passed
  to both register paths (`handlers.ts:173-184`).

### Verified Vendor Capabilities (do not re-litigate at execution)

- **Both register paths accept `outputSchema`.** `server.registerTool`
  (`@modelcontextprotocol/sdk@1.29.0`, `mcp.d.ts:150-157`,
  `outputSchema?: ZodRawShapeCompat | AnySchema`) and `registerAppTool`
  (`@modelcontextprotocol/ext-apps@1.7.2`, `index.d.ts:184-186`) both accept it;
  `registerAppTool` spreads its entire config straight into `server.registerTool`,
  so a single `outputSchema: tool.outputSchema` line on the shared `config`
  object reaches **both** branches. **There is no Oak wrapper to modify**
  (`registerAppTool` is a direct vendor import at `handlers.ts:11`; `zod-utils.ts`
  only does shape extraction).
- **The SDK runtime-validates `structuredContent` against `outputSchema`**
  (`mcp.js:185-207`): when `outputSchema` is present and the result is not an
  error, `structuredContent` is **mandatory** and is parsed against the schema;
  `isError:true` skips validation. *(This entails the invariant in Principle 1.)*
- **The SDK requires an OBJECT-ROOTED schema.** `normalizeObjectSchema`
  (`zod-compat.js:79-121`) accepts only a raw shape (object of schemas) or an
  object schema. **A union/`discriminatedUnion` at the root returns `undefined`**
  → silently dropped from `tools/list` AND throws at runtime validation. Output
  schemas are therefore object-rooted (`z.ZodRawShape`) everywhere; unions appear
  only as **nested property values** (e.g. a multi-status `data` field).

### Existing Capabilities (do not rebuild)

- **Generated tools already carry their response schema at codegen time**
  (`toolOutputJsonSchema` + `zodOutputSchema`,
  `.../mcp-tools/contract/tool-descriptor.contract.ts:55-56`, emitted into all 24
  files). These already validate the **raw upstream payload** (`validateOutput`,
  **Contract A**). This plan does **not** regenerate or replace them; it
  **composes** the MCP envelope schema from them.
- **`formatToolResponse()` is the single response formatter**
  (`universal-tool-shared.ts:208-221`): spreads object `data` at the top level,
  adds `summary` (always), `oakContextHint` (unless `includeContextHint === false`),
  and `status` (when provided). Widget routing fields (`query`, `timestamp`,
  `toolName`, `annotationsTitle`) go into `_meta`, **not** `structuredContent`.
- **`inputSchema` is already required and uniform** on `UniversalToolListEntry`
  (`types.ts:135` — a required `z.ZodRawShape`; no-input tools expose `{}`),
  extracted from the descriptor via `requireGeneratedToolInputShape`
  (`descriptor-utils.ts:47-62`) + `extractZodShape` (`zod-utils.ts:55`). This is
  the precedent — and the exact pattern — the output side mirrors.

---

## The Two Contracts (the load-bearing distinction)

### Contract A — Upstream API response validation (EXISTING, unchanged)

For generated tools the codegen emits `toolOutputJsonSchema` + `zodOutputSchema`
from the SDK-decorated response schemas, and the runtime validates the **raw
upstream payload** against them (`OUTPUT_VALIDATION_ERROR` on mismatch).
Generator-driven; **must remain intact**. This plan adds nothing to it.

### Contract B — MCP `structuredContent` declaration (NEW, this plan)

`outputSchema` describes the **final `structuredContent` object** the client
receives — the post-`formatToolResponse` envelope, not the raw upstream body.
Declaring it makes the SDK runtime-validate emitted `structuredContent` against
it, so the schema must match what is **actually emitted** or the tool errors.

**The real envelopes (verified):**

- **Generated tools** — `executor.ts:61-64` passes `data: { status, data }` and
  `includeContextHint: descriptor.requiresDomainContext`, which `formatToolResponse`
  spreads to `{ status, data: <validated payload>, summary, oakContextHint? }`.
  Multi-status tools model the `data` variation as a **union nested under `data`**
  (object root preserved). `oakContextHint` is present unless
  `requiresDomainContext === false` — W1 derives the schema's optionality off the
  **same predicate** (`!== false`), never off `=== true`.
- **Aggregated tools** — each spreads its own domain object plus `summary` and
  conditional `oakContextHint`/`status`. Shapes are **per tool** (e.g. `fetch`
  exposes `oakUrl`, not `canonicalUrl`; `download-asset` has **no** `status` and
  always includes `oakContextHint`; `search` has two real shapes — scoped
  `{ scope, total, took, results, … }` and suggest `{ suggestions, cache, … }`
  — with no shared literal discriminator, so it is modelled as **one object with
  mode-specific fields optional**, never a root union).

---

## Design Principles (with the principle checks behind them)

1. **`outputSchema` is REQUIRED and object-rooted.** Strict-and-Complete forbids
   invented optionality; `inputSchema` is already required+uniform; every tool
   emits `structuredContent`. The field is a required `z.ZodRawShape` on
   `ToolRegistryDescriptor`, `AggregatedToolDefShape`, and `UniversalToolListEntry`.
   **Entailment (SDK-enforced):** a required `outputSchema` makes a non-error
   `structuredContent` **mandatory** on every success return of all 35 tools.
   This holds today (every tool routes success through `formatToolResponse`,
   which always builds `structuredContent`); S0.2 proves it as an invariant.
   *(principles.md §Strict and Complete; "WE DON'T HEDGE".)*

2. **Populate first, wire last.** A required field cannot land before its
   producers populate it. W1 (24 generated) and W2 (the 8 in-scope aggregated —
   the 3 graph tools' schemas land with their substrate migration) populate
   independently; S0 introduces the required `UniversalToolListEntry` field and
   the wire **last**, as the convergence. *(Inverts the audit's "S0 first", which
   assumed an optional additive field.)*

3. **Generator-first for generated tools (Cardinal Rule).** The generated
   envelope schema is **composed at `sdk-codegen` time** from the existing
   response schema. No hand-authored per-generated-tool overrides; fix the
   emitter if composition is wrong. *(principles.md §Cardinal Rule; ADR-029/030/031.)*

4. **Generator-reuse for aggregated payloads.** Where an aggregated tool's
   `structuredContent` embeds a generated payload type, its output schema
   **references the generated Zod schema** for that portion (as a property value
   in the raw shape). Only the aggregation envelope is hand-authored.
   *(principles.md §Context Specificity Gradient — "generated state beats authored state".)*

5. **Truthful or absent.** A declared schema must match the real emitted
   `structuredContent`. The proof is the runtime-conformance test (S0.2), not the
   declaration. *(principles.md §"Misleading docs are blocking"; §Fail FAST.)*

6. **Object root, always.** Every `outputSchema` root is a single `type: object`
   (`z.ZodRawShape`). Multiple shapes (e.g. `search`, multi-status generated
   tools) are expressed as **optional fields** or a **nested union property** —
   never a root union, which the installed SDK silently drops and then throws on
   (`zod-compat.js:79-121`).

### Non-Goals (YAGNI)

- **Not** changing upstream API payloads or Contract A validation.
- **Not** retrofitting the EEF "single-Zod-call graph-native-view" doctrine onto
  the 35 existing tools — that doctrine is EEF-tool-specific (see §EEF).
- **Not** building the new EEF graph tool — owned by the EEF plan.
- **Not** changing the envelope `formatToolResponse` emits. (The `status` field
  in `structuredContent` is inherited from the formatter and declared truthfully
  here, not endorsed; a separate envelope-cleanup could later remove it. Out of
  scope.)
- **Not** introducing any compatibility layer, optional-then-required migration,
  or transport-specific output-schema path.
- **Not** re-opening the `download-asset` URL placement (owned by
  `download-asset-user-only-url.plan.md`; W2 consumes its post-change shape).

---

## Resolved Sequencing (owner, 2026-06-02)

**S0 ownership is resolved (revised 2026-06-07):** this plan owns the **S0
carrier seam ENTIRELY** — the carrier-widening (adding an `outputSchema` field to
`UniversalToolListEntry`/`AggregatedToolDefShape` and accepting object schemas on
`inputSchema`) AND reconciling the SDK `registerTool`
(`ZodRawShapeCompat | AnySchema`) vs ext-apps `registerAppTool`
(`ZodRawShapeCompat | StandardSchemaWithJSON`) carrier divergence — solved ONCE
here at the infra layer. **EEF D6 does NOT land any output schema or carrier
change** (owner-ratified 2026-06-06): the EEF tool's input is a `z.ZodRawShape`
that fits the existing carrier, and it returns `structuredContent` with no
`outputSchema`, uniform with every other aggregated graph tool. The shared
additive seam (`AggregatedToolName`,
`AGGREGATED_TOOL_DEFS`/`AggregatedToolDefShape` satisfies-guard,
`UniversalToolListEntry`, `listUniversalTools`, the `handlers.ts` config) is this
plan's to widen.

**The delivery order is ratified and firm:**

1. **The EEF tool's `outputSchema` is authored HERE as an ordinary aggregated
   tool** (revised 2026-06-07 — it no longer "lands first via EEF D6"; EEF D6
   ships `structuredContent` with no output schema). It carries no special
   priority; it gains its output schema with the other aggregated tools.
2. **The 3 existing graph tools** (`get-misconception-graph`,
   `get-prior-knowledge-graph`, `get-thread-progressions`) **receive their
   output schemas with their substrate migration**
   (`graph-estate-consolidation.plan.md` Judgement call 4: per tool, the
   data/type re-emission, the tool rewrite, and its `outputSchema` land as one
   replacement unit). They are untouched before that migration — they work
   today, and the schema arrives when the tool is rebuilt, never before.
3. **The remaining tools follow per tool type** (the other aggregated tools,
   then the generated/API and search tools), with the **required-field
   promotion to the root `UniversalToolListEntry` last**, once every type
   carries it. The all-35 counts in the S0 cycles describe that final state and
   are evaluated when S0 executes (last), against the tool set live at that
   time.

The governing rule in one line: **a tool's schema arrives when the tool is
built or rebuilt, never before.** The W1/W2/S0 cycles are re-cut to this order
at execution-session start, coordinated with EEF D3 verification on the shared
seam and with active-claim coordination before either side edits
`universal-tools/`.

---

## Relationship to the EEF graph-tool plan

- **The 3 existing graph tools** (`get-thread-progressions`,
  `get-prior-knowledge-graph`, `get-misconception-graph`) are ordinary aggregated
  tools (`definitions.ts:117-128`); **their output schemas land with their
  substrate migration** (`graph-estate-consolidation.plan.md` Judgement call 4 —
  per tool: data/type re-emission + tool rewrite + `outputSchema`, one
  replacement unit), not in W2. They are untouched before that migration.
- **The new EEF graph tool** (flag-gated `OAK_CURRICULUM_MCP_EEF_ENABLED`, does
  not exist yet) is owned **exclusively** by the EEF plan (D3/D4/D6). Its
  single-Zod-call graph-native-view derivation is intrinsic to its chain and must
  not be fractured across two plans. **This plan scopes it out.**
- **The shared seam** is the S0/D6 coordination above — coordinate, do not
  transfer ownership.

---

## Lifecycle Triggers

> See [Lifecycle Triggers component](../../templates/components/lifecycle-triggers.md)

Work shape: **executable repo plan** (generated artefacts + shared SDK runtime +
app registration path). Touch points: start-right at session open; register an
active claim on `packages/sdks/oak-curriculum-sdk/src/mcp/` and
`packages/sdks/oak-sdk-codegen/` before the first edit (**EEF is active in the
same area — check `active-claims` and resolve the S0 sequencing decision before
touching `universal-tools/`**); session-handoff at boundaries; consolidation at
completion.

---

## Proof Contract

Acceptance ids are the todo ids. Each names its proof level and proving command.

| Acceptance id | Proof level | Proven by |
|---------------|-------------|-----------|
| `w1-cycle-1` | unit | emitter unit tests (single/multi-status, oakContextHint predicate); `pnpm test --filter @oaknational/sdk-codegen` + `pnpm sdk-codegen && pnpm build` |
| `w1-cycle-2` | integration | conformance test over all 24 generated descriptors; `pnpm test` |
| `w2-cycle-1` | unit | per-tool conformance unit tests for the 8 in-scope aggregated tools (the 3 graph tools' schemas land with their migration) + `satisfies` guard holds; `pnpm type-check && pnpm test` |
| `s0-cycle-1` | integration | registration-config carries `outputSchema` for all 35 (spy pattern); `pnpm test --filter oak-curriculum-mcp-streamable-http` |
| `s0-cycle-2` | e2e | `tools/list` exposes `outputSchema` (35); real `structuredContent` validates; structuredContent-present invariant (35); `isError` skips; `pnpm test:e2e` |
| `ws-docs` | non-code | TSDoc/README accurate; `pnpm markdownlint:root` |

The plan is `complete` only when every acceptance id above is proven; a landed
slice is not completion.

---

## Cycle Dependencies and Parallelisation

> See [TDD Cycles component](../../templates/components/tdd-phases.md)

- **W1 ∥ W2** — independent (codegen package vs aggregated SDK modules).
- **W1 cycle 1.1 is atomic** — adding the required envelope field to the
  `ToolDescriptor` contract makes all 24 generated files fail `type-check` until
  regenerated, so the contract change + emitter + `pnpm sdk-codegen` regeneration
  land in **one** commit. Cycle 1.2 (cross-tool conformance test) follows.
- **W2 is one atomic cycle** — `definitions.ts` is a shared convergence file;
  incremental landing forces either unused exports (knip) or a
  transient-optional field (both forbidden). Authoring the in-scope schemas is
  parallelisable *preparation*; the landing is atomic, with the required-field
  landing shape set by the execution-start re-cut (§Resolved Sequencing).
- **S0 depends on W1 + W2** — it forwards `descriptor.outputSchema` (W1) and
  `def.outputSchema` (W2). `s0-cycle-1` additionally gated on the
  execution-start re-cut to **§Resolved Sequencing** (S0's required promotion
  executes last, after the migrated graph tools carry schemas).

---

## W1 — Generated-tool output schemas (24 tools, codegen)

Compose the MCP output-envelope schema at `sdk-codegen` time, wrapping the
existing response schema in the real `formatToolResponse` envelope.

### Cycle 1.1 — Emitter composition + regeneration (ATOMIC)

**Parallel-safety**: parallel-safe with W2 (codegen package only).
**Starting state**: branch HEAD after this plan lands.

**File scope** (permitted to touch):

- `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/contract/tool-descriptor.contract.ts` — add the required MCP-output-envelope field (object-rooted Zod raw shape; name confirmed against existing contract naming).
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts` — the interface-declaration template (must gain the same field, or contract and generated typing diverge).
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts` — emit the composed envelope (the `requiresDomainContext` literal is already computed here, `:46`/`:134`).
- the 24 regenerated tool descriptor files (via `pnpm sdk-codegen`; never hand-edited).
- `*.unit.test.ts` beside the emitter.

**File scope NOT to touch**: `oak-curriculum-sdk/src/mcp/**` (W2/S0).

**Test (Red)**: emitter unit tests assert the composed object-rooted shape for
(a) single-status = `{ status, data: <response shape>, summary, oakContextHint? }`;
(b) multi-status — the `data` variation is a **union nested under `data`**, root
stays `type: object`;
(c) `oakContextHint` present in the schema **iff** the descriptor's
`requiresDomainContext !== false` (the same predicate the runtime uses).

**Product code (Green)**: contract field + emitter composition + `pnpm sdk-codegen`.

**Acceptance**: `pnpm test --filter @oaknational/sdk-codegen` green;
`pnpm sdk-codegen && pnpm build` clean; tree green; commit names the cycle.

**Reviewer dispatch**: `type-expert` (the `zodOutputSchema: ZodType<TResult>` →
object-rooted raw-shape composition; no `as`/`unknown` widening), `mcp-expert`.

### Cycle 1.2 — Cross-tool conformance

**Parallel-safety**: sequenced after 1.1.

**File scope**: one integration test.

**Test (Red)**: iterate all 24 descriptors; assert each `outputSchema` is
object-rooted and **accepts** that tool's real `formatToolResponse`
`structuredContent` (from a representative fixture) and **rejects** a payload
missing a declared field.

**Acceptance**: all 24 conformant; tree green.

---

## W2 — Aggregated-tool output schemas (ATOMIC; scope per §Resolved Sequencing)

> The 3 existing graph tools are out of W2's scope — their schemas land with
> their substrate migration (§Resolved Sequencing). One commit for the in-scope
> set. Authoring the schemas is parallelisable preparation; the landing is
> atomic, and the required-field landing shape follows the per-type promotion
> order at the execution-start re-cut.

**File scope** (permitted to touch):

- `universal-tools/definitions.ts` — add `outputSchema: z.ZodRawShape` to `AggregatedToolDefShape` (`:58-70`) per the re-cut landing shape; wire the in-scope entries.
- Each in-scope aggregated module (`aggregated-search/`, `aggregated-fetch/`,
  `aggregated-curriculum-model/`, `aggregated-browse/`, `aggregated-explore/`,
  `aggregated-asset-download/`, `aggregated-user-search/`) — export an
  object-rooted output raw shape.
- `*.unit.test.ts` beside each module.

**File scope NOT to touch**: `list-tools.ts`, `types.ts`, `handlers.ts` (S0);
the codegen package (W1).

**Test (Red)** — per-tool conformance unit test: each tool's declared shape
**accepts** its real emitted `structuredContent` (built from the module's own
execution against a fixture) and **rejects** a malformed one. Tool-specific
truths:

| Tool | Output-shape truths the schema must encode |
|------|--------------------------------------------|
| `search` | single object, mode fields optional: `{ scope?, total?, took?, results?, suggestions?, cache?, summary, status, oakContextHint? }` — **not** a root union (no shared discriminator exists) |
| `fetch` | `oakUrl` (not `canonicalUrl`), `id`, `type`, `httpStatus`, `data`, `summary`, `oakContextHint?` |
| `get-curriculum-model` | `summary` + curriculum-model payload (reuse generated model sub-schema) |
| `browse-curriculum` | `summary` + browse payload (reuse generated sub-schemas) |
| `explore-topic` | `summary` + explore payload |
| `download-asset` | `{ downloadUrl, lesson, type, summary, oakContextHint }` — **no `status`**; consume post-`download-asset-user-only-url` shape if landed |
| `user-search` | `summary` + user-search payload; widget tool |
| `user-search-query` | `summary` + query payload; app-only (`_meta.ui.visibility:['app']`) |

**Product code (Green)**: `outputSchema` on `AggregatedToolDefShape` per the
re-cut landing shape; author each in-scope module's object-rooted shape
(reusing generated Zod sub-schemas as property values where the payload embeds
generated types); wire the in-scope entries.

**Acceptance**: all in-scope conformance tests pass; the
`as const satisfies Record<AggregatedToolName, …>` guard (`:149`) holds;
`pnpm type-check` + `pnpm test` green; tree green.

**Reviewer dispatch**: `type-expert` (the `ZodRawShape` typing; generated
sub-schema reuse type-compatibility), `mcp-expert`, `code-expert`.

---

## S0 — Seam: thread the required `outputSchema` to the wire

> Gated on the execution-start re-cut to **§Resolved Sequencing** — S0's
> required promotion executes last, after the migrated graph tools carry
> schemas. Depends on W1 + W2.

### Cycle S0.1 — Required field + projection + registration

**File scope**:

- `universal-tools/types.ts` — add **required** `outputSchema: z.ZodRawShape` to **both** `ToolRegistryDescriptor` (`:31-40`, the generated-descriptor narrow type — without this the generated `outputSchema` cannot cross into the universal-tools layer) **and** `UniversalToolListEntry` (`:120-142`).
- `universal-tools/descriptor-utils.ts` — add `requireGeneratedToolOutputShape`, mirroring `requireGeneratedToolInputShape` (`:47-62`) + `extractZodShape` (no `as`/`instanceof` shortcut beyond the existing guard pattern).
- `universal-tools/list-tools.ts` — forward `outputSchema` from `def.outputSchema` (aggregated) and the descriptor (generated, via the helper) in **both** map branches (`:62-94`); remove the stale `download-asset on stdio` TSDoc (`:25-26`); add `outputSchema` to the `@example` config spread (`:47-52`).
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` — add `outputSchema: tool.outputSchema` to the single `config` object (`:173-178`); both branches inherit it.

**Test (Red)**: extend `handlers-tool-registration.integration.test.ts` (spy
pattern, `:76-89`) to assert the captured `registerTool`/`registerAppTool` config
carries an object-rooted `outputSchema` for **all 35** tools.

**Product code (Green)**: the fields + helper + forwards + the one `config` line.

**Acceptance**: registration config carries `outputSchema` for all 35;
`pnpm type-check` + `pnpm test --filter oak-curriculum-mcp-streamable-http` green;
tree green.

**Reviewer dispatch**: `mcp-expert`, `architecture-expert-barney` (the
`ToolRegistryDescriptor` cross-package boundary), `test-expert` (the spy-pattern
assertion: field presence, not type shape), `code-expert`.

### Cycle S0.2 — Wire + runtime conformance proof

**File scope**: integration/E2E test files only.

**Test (Red)**:

1. `tools/list` exposes an object-rooted `outputSchema` for all 35 tools;
2. invoke a representative generated and a representative aggregated tool
   end-to-end; the emitted `structuredContent` **validates** against the
   advertised `outputSchema` (the SDK's own runtime validation must not reject a
   real success response);
3. **invariant**: every tool's non-error return carries `structuredContent`
   (the required-`outputSchema` entailment);
4. an error path returns `isError:true` and is **not** output-validated.

**Product code (Green)**: none expected — this proves S0.1 + W1 + W2 are mutually
truthful. If a real response fails its declared schema, fix the schema (W1 emitter
or W2 author), never loosen the test.

**Acceptance**: all four hold; `pnpm test:e2e` green.

**Reviewer dispatch**: `mcp-expert`, `test-expert`.

---

## Documentation and Cross-Surface Updates (`ws-docs`)

- Remove the stale `download-asset on stdio` reference (`list-tools.ts:25-26`)
  and update its `@example` to include `outputSchema` (`:53-58`).
- TSDoc on the new `outputSchema` fields and `requireGeneratedToolOutputShape`.
- Update any README enumerating the tool surface to **35** (24 + 11).

---

## Quality Gates (`ws-gates`)

> See [Quality Gates component](../../templates/components/quality-gates.md)

All gates blocking (generated artefacts + shared SDK runtime + app registration).

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e
```

Per-cycle: focused `pnpm test --filter <workspace>` plus the local gates.

---

## Adversarial Review (`ws-review`)

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

- **Plan-phase (done 2026-06-02)**: `assumptions-expert`, `mcp-expert`,
  `type-expert`, `code-expert`, `docs-adr-expert` — findings verified against the
  installed SDK and folded into this revision (object-root constraint, required→
  structuredContent invariant, verified `registerAppTool` forwarding, W1
  atomicity, `ToolRegistryDescriptor` field, search-as-object).
- **Mid-cycle**: `type-expert`, `test-expert`, `architecture-expert-barney`,
  `code-expert`.
- **Close**: `docs-adr-expert`, `release-readiness-expert`.

Per `feedback_validate_specialist_findings_before_acting`: ground every finding
against the real code before acting; relay a synthesised verified verdict.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Mitigation |
|------|------------|
| Declared schema ≠ real `structuredContent` → SDK rejects a real success response at runtime | S0.2 conformance test proves real output validates; schemas built from real fixtures |
| A root union slips into an output schema → SDK silently drops it from `tools/list` and throws on validate | Principle 6 forbids root unions; W1/W2 tests assert object root; `search` modelled as one object with optional mode fields |
| Required `outputSchema` makes `structuredContent` mandatory on every success return | S0.2 invariant test across all 35; every tool already routes success through `formatToolResponse` |
| `oakContextHint` conditionality assumed (`=== true`) instead of derived (`!== false`) | W1 derives the schema predicate off the exact runtime predicate; tested in cycle 1.1c |
| `formatToolResponse` top-level spread mis-modelled | W1/W2 schemas encode the spread envelope explicitly; per-tool tests use real emitted output |
| Schema strictness (`.strip`/`.passthrough`) interacts with envelope fields | Align with `schema-resilience…` OQ1/OQ2 before W1 finalises; envelope declares `summary`/`oakContextHint`/`status` so they are not "extra" |
| S0 collides with active EEF D6 on `universal-tools/` | NO collision (revised 2026-06-07): EEF D6 dropped its output schema and does NOT touch the carrier — this plan owns the seam outright. Standard active-claims coordination before editing the seam still applies. |
| `download-asset` shape changes under W2 (URL → `_meta`) | W2 consumes the post-`download-asset-user-only-url` shape; sequence that change first |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **principles.md** — §Cardinal Rule (W1 composes at codegen); §Strict and
  Complete + "WE DON'T HEDGE" (required, object-rooted, no optionality);
  §Context Specificity Gradient (W2 reuses generated sub-schemas); §"Misleading
  docs are blocking" (stdio TSDoc cleanup); §Fail FAST (truthful-or-error).
- **testing-strategy.md** — TDD cycle-pairs as landing units at unit /
  integration / E2E; conformance proven through public interfaces (real
  `structuredContent`); no global state in tests.
- **schema-first-execution.md** — generated type/schema flow stays codegen-driven;
  the output envelope is composed at generation time from the OpenAPI-derived
  response schemas.

### Plan-body first-principles check

> See [`plan-body-first-principles-check.md`](../../../rules/plan-body-first-principles-check.md)

- **Shape clause**: required-vs-optional and object-root-vs-union decided at
  plan-author time against the installed SDK + the `inputSchema` precedent — not
  deferred to execution.
- **Landing-path clause**: "populate first, wire last" and the W1/W2 atomic
  landings are forced by the required-field constraint, not chosen for
  convenience; every cycle lands green.
- **Vendor-literal clause**: SDK/ext-apps `outputSchema` support, runtime
  validation, and the object-root constraint are grounded in the installed
  `mcp.d.ts:150-157` / `mcp.js:185-207` / `zod-compat.js:79-121` and
  `ext-apps/.../index.d.ts:184-186`, verified during this plan's review — not
  assumed. S0.1 re-confirms the live signature before relying on it.

---

## Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

On completion, evaluate whether the Contract-A-vs-Contract-B distinction and the
required object-rooted `outputSchema` seam warrant an ADR or a reference-doc note.
Do not author a summary-of-work doc.

---

## Consolidation (`ws-consolidate`)

After gates pass and review closes, run `/oak-consolidate-docs`: mine any settled
contract into permanent docs, rotate the napkin, manage fitness, archive per
ADR-117, and update `current/README.md` + the completed-plans index.

---

## Dependencies

**Blocking**: the execution-start re-cut to §Resolved Sequencing — the EEF
tool's schema lands first via EEF D6, and the 3 graph tools' schemas land with
their substrate migration. W1, W2 (in-scope set), and S0.2's test design are
not design-blocked.

**Beneficial** (minimum shippable shape without each):

- `../current/download-asset-user-only-url.plan.md` — W2's `download-asset` schema
  should match its post-change shape. *Without it*: author against the current
  shape (`{ downloadUrl, lesson, type, summary, oakContextHint }`) and re-point
  when it lands.
- `../active/schema-resilience-and-response-architecture.plan.md` (OQ1/OQ2) —
  affects generated envelope strictness. *Without it*: W1 declares the envelope
  fields explicitly so resolution mode does not change conformance.

**Related Plans**:

- `../../sector-engagement/eef/current/eef-graph-tool-completion.plan.md` — owns
  the new EEF graph tool and the D6 half of the S0 sequencing decision.
- `../active/upstream-api-reference-metadata.plan.md` — sibling codegen-seam
  change; serialise with W1 at the emitter, never concurrent.
- `../aggregated-tool-result-type-remediation.plan.md` (collection root) — if it
  lands first, W2 schemas match the post-migration `structuredContent`.
- Superseded reference only:
  `../archive/completed/mcp-runtime-boundary-simplification.plan.md` (its
  `projections.ts` deliverable was deleted in PR #76; the live seam is
  `UniversalToolListEntry` + `list-tools.ts` + `handlers.ts:173-184`).
