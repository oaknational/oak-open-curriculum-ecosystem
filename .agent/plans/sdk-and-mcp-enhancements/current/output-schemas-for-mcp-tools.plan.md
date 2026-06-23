---
name: "MCP Output Schemas and Response Validation"
overview: "Declare a truthful, REQUIRED, object-rooted `outputSchema` on EVERY MCP tool by COMPOSING it from one mechanism — never hand-authoring per-tool shapes (schema-first / generator-first doctrine, ADR-029/030/031/035/036/038). Every tool's output schema is `envelope(payloadSchema)`: the `envelope` is the single known `formatToolResponse` transform, encoded ONCE as a `composeEnvelopeSchema` utility; the `payloadSchema` is a runtime Zod schema emitted at the tool's AUTHORITATIVE SOURCE — never restated by hand. Sources are provenance-distinct: the live HTTP API (OpenAPI codegen; already emits `zodOutputSchema`), the bulk-download-derived vocab graphs (vocab-gen writer), the fixed EEF corpus (`as const`), and the search index (Elasticsearch over bulk). The same derive-from-source doctrine also single-sources the search tool's input schema (today duplicated). Thread the composed schema through the canonical universal-tools descriptor surface to `registerTool`/`registerAppTool` (the carrier seam, SDK-`registerTool` vs ext-apps-`registerAppTool` divergence solved ONCE at the infra layer), so MCP clients receive a machine-checkable contract for the `structuredContent` they get back. Work placement is HYBRID BY READINESS (owner 2026-06-09): this plan owns the composition mechanism (a `composeEnvelopeSchema` utility in `oak-sdk-codegen`) plus the source-Zod authorable now (search output derived from the generated source-of-truth schemas; EEF output Zod from corpus enums with a type-level tie); the graph-tool source-Zod stays gated on `graph-tools-value-redesign` (its post-migration shape does not exist yet). Serial delivery: (1) EEF D6/D7 first — the EEF tool ships `structuredContent` with NO output schema; (2) the graph tools migrate onto the substrate (`graph-tools-value-redesign`), shipping bounded retrieval only with NO MCP output schema (they work as today); (3) THEN this plan: emit any missing source payload Zod (W0), compose the envelope uniformly for every tool (W1 generated at codegen, W2 aggregated), wire the carrier (S0), and land the REQUIRED ratchet LAST — proven by a registry-driven conformance test that counts the schema-less surface down to zero. Discovery of unschema'd tools is that conformance test, not a red type-check; the required field is the anti-regression ratchet. Single-branch temporary red is permitted (green before merge); no optional OR hand-authored `outputSchema` is ever merged."
source_research:
  - "../../../reports/output-schema-mcp-plan-audit-2026-06-02.md"
  - "../roadmap.md"
todos:
  - id: w0-cycle-1
    content: "W0 cycle 1 (envelope utility, ATOMIC): define the single `composeEnvelopeSchema(payloadShape) -> z.ZodRawShape` in `oak-sdk-codegen` (re-exported on an approved subpath; NOT in `oak-curriculum-sdk` — that package depends on sdk-codegen, so a curriculum-sdk home would invert the SDK dependency direction). It encodes the real `formatToolResponse` envelope ONCE — object-rooted; `summary` always; `oakContextHint` present iff `includeContextHint !== false`; `status` when provided. It accepts ONLY an object-rooted payload and FAILS FAST on a non-object payload (it must NOT silently return `undefined` like a bare `extractZodShape`); a multi-status union payload is wrapped under `data` by the caller before composition. Unit tests cover each predicate, object-root, and the non-object fail-fast. Consumed by W1 (codegen) and W2 (aggregated) so the envelope contract is defined once, not restated per tool. One commit. Tree green."
    status: pending
    depends_on: []
  - id: w0-cycle-2
    content: "W0 cycle 2 (search output payload derives from the ONE source of truth): the search/fetch/user-search OUTPUT payload schema derives from the single generated source of truth — the codegen-emitted search response schemas (`generated/search/`: `SearchLessonsResponseSchema`/`…Units…`/`…Sequences…`/`…Multi…`/`…Suggestion…`, ADR-067/105), which already exist and are already consumed by `validation/types.ts`. The tools emit a transformed shape (`SearchDispatchResult`); under the Cardinal Rule that transform is itself generated/derived from the one source — so collapse any hand-maintained `search-retrieval-types` parallel to derive from the generated source, never maintain a second truth. composeEnvelopeSchema then wraps the source-derived payload. Conformance unit test against a real response fixture. One commit. Tree green."
    status: pending
    depends_on: []
  - id: w0-cycle-3
    content: "W0 cycle 3 (EEF output Zod at source): emit the `EefEvidenceEnvelope` output Zod from the corpus-derived enums (`EEF_STRAND_IDS`, `OBSERVED_*` in graph-corpus-sdk). NOTE the envelope shape landed 2026-06-09 (A-i + C): it now carries `answerType` (`z.enum(['strand-lookup','context-subset'])`) AND a full-vs-headline member union — the tool returns `EefEvidenceEnvelope<EefStrand>` by default and `EefEvidenceEnvelope<EefStrandHeadline>` when called with `detail: 'headline'` (the `evidenceForMoveHeadlines` projection in `graph-corpus-sdk/src/eef-strands/eef-headline-view.ts`). So the object-rooted output Zod models `answerType` + `members: z.array(z.union([<full-strand Zod>, <headline Zod>]))` (the union is a NESTED property value, never a root union — Principle 6) + `edges`/`frontier`/`provenance`, tied type-level to `z.infer<typeof EefEvidenceEnvelopeZod> extends EefEvidenceEnvelope<EefStrand | EefStrandHeadline>` (a `satisfies EefEvidenceEnvelope` on the Zod *value* is invalid TS — a `ZodObject` value is not an `EefEvidenceEnvelope`; the tie is type-level). A runtime `as const` corpus cannot be codegen'd, so emitting the Zod at the corpus source with this type-tie is the proportionate generator-first form. GUARDRAIL: do NOT annotate the raw shape `: z.ZodRawShape` — that widens the per-field `ZodEnum`s (the documented anti-pattern in `aggregated-eef-evidence.ts`'s input-schema comment); rely on the `definitions.ts` `satisfies` carrier guard. Unit test: the Zod accepts a real `inspect-strand`, `evidence-for-move` (full), AND `evidence-for-move` `detail:'headline'` envelope, and the type-level tie compiles (drift is a type error). One commit. Tree green."
    status: pending
    depends_on: []
  - id: w0-cycle-4
    content: "W0 cycle 4 (search input single-sourcing): collapse the search input duplication — `SEARCH_INPUT_SCHEMA` (`aggregated-search/flat-zod-schema.ts`) and `SearchSdkObjectSchema` (`validation.ts`) are two hand-written Zod surfaces for one tool. Derive both from one source (the runtime-narrowing schema tied to the SDK input contract) so the input schema is single-sourced, mirroring the output-side doctrine. Conformance unit test. One commit. Tree green."
    status: pending
    depends_on: []
  - id: w1-cycle-1
    content: "W1 cycle 1 (generated, ATOMIC): add the required MCP output-envelope field to the ToolDescriptor contract + emitter (contract template, generate-tool-descriptor-file.ts, emit-index.ts); COMPOSE the envelope via `composeEnvelopeSchema` (W0) over each tool's existing `zodOutputSchema` response descriptor — no per-tool authoring; regenerate all 24 tool files; emitter unit tests for single-status, multi-status (union nested under `data`, object root), and the `oakContextHint` conditional (predicate: include unless `requiresDomainContext === false`). Serialise at the emitter with `upstream-api-reference-metadata.plan.md` (same emitter seam). One commit. Tree green."
    status: pending
    depends_on: [w0-cycle-1]
  - id: w1-cycle-2
    content: "W1 cycle 2 (codegen): integration test asserts every generated descriptor carries an object-rooted outputSchema whose Zod raw shape accepts that tool's real formatToolResponse structuredContent and rejects a payload missing a declared field. One commit. Tree green."
    status: pending
    depends_on: [w1-cycle-1]
  - id: w2-cycle-1
    content: "W2 cycle 1 (aggregated, ATOMIC): COMPOSE every aggregated tool's output schema via `composeEnvelopeSchema` (W0) over its SOURCE-derived payload Zod — search/fetch/user-search over W0-cycle-2 generated search Zod; EEF over W0-cycle-3 corpus Zod; live-API-aggregated (`get-curriculum-model`, `browse-curriculum`, `explore-topic`, `download-asset`) over reused generated API Zod sub-schemas. No hand-authored shapes; per-tool truths (e.g. `fetch` exposes `oakUrl`; `download-asset` has no `status`; `search` is one object with mode-optional fields, never a root union) are properties of the source payload Zod. Per-tool conformance unit tests. The four migrated graph tools (`get-misconception-graph`, `get-prior-knowledge-graph`, `get-thread-progressions`, and `get-keywords` — which migrates from generated to aggregated under that plan) compose over their post-migration vocab-writer Zod and are GATED on `graph-tools-value-redesign` landing (source-Zod emitted there); the EEF portion is gated on EEF D6. One commit. Tree green."
    status: pending
    depends_on: [w0-cycle-1, w0-cycle-2, w0-cycle-3]
  - id: s0-cycle-1
    content: "S0 cycle 1 (seam + closing ratchet): add REQUIRED outputSchema (z.ZodRawShape) to ToolRegistryDescriptor and UniversalToolListEntry + a requireGeneratedToolOutputShape helper; forward outputSchema in listUniversalTools() from both the aggregated defs and generated descriptors; add `outputSchema: tool.outputSchema` to the single registerTool/registerAppTool config in handlers.ts (reconciling the SDK-registerTool vs ext-apps-registerAppTool carrier divergence once, here). The required field lands LAST as the closing ratchet, after W1 + W2 have populated every producer; it is the anti-regression lock, not the discovery instrument. Integration test: the registration config carries outputSchema for every registered tool (spy-observation pattern). One commit. Tree green."
    status: pending
    depends_on: [w1-cycle-2, w2-cycle-1]
  - id: s0-cycle-2
    content: "S0 cycle 2 (registry countdown conformance proof — discovery + closing proof): a registry-driven test iterates the LIVE tool registry and asserts every tool exposes an object-rooted outputSchema that VALIDATES its real emitted structuredContent, enumerating (counting down to zero) any tool still missing a truthful schema — so 'where the schema-less surface lives' is computed from the registry, never inferred from a red type-check. Plus: (a) tools/list exposes outputSchema for every tool; (b) the structuredContent-present invariant on every non-error return; (c) an isError:true path skips output validation. One commit. Tree green."
    status: pending
    depends_on: [s0-cycle-1]
  - id: ws-docs
    content: "Docs: remove the stale 'download-asset on stdio' TSDoc (list-tools.ts:25-26) and update the list-tools @example to include outputSchema; TSDoc on the new fields and the requireGeneratedToolOutputShape helper; update any README enumerating the tool surface to 36 (24 generated + 12 aggregated incl. EEF; `get-keywords` shifts generated→aggregated when the graph migration lands — net 36). Land alongside the cycles whose behaviour they document."
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

**Last Updated**: 2026-06-09 (EEF output-Zod clauses reconciled to the landed A-i/C envelope shape — `answerType` + full/headline member union)
**Status**: 🟢 DECISION-COMPLETE — owner-ratified 2026-06-09; serial delivery order owner-resolved 2026-06-08 (§Resolved Sequencing). The required field is the closing ratchet; discovery of unschema'd tools is the registry-driven conformance test, not a red type-check.
**Scope**: Give every MCP tool a truthful, required, object-rooted `outputSchema` — composed by one mechanism over source-derived payload Zod — and expose it through the live registration path.

---

## Context

### Problem Statement

The MCP tool surface exposes `inputSchema` but not `outputSchema`. MCP clients
and models receive no machine-checkable description of the `structuredContent`
a tool returns. The MCP spec defines `outputSchema` for exactly this, and the
installed SDK runtime-validates a tool's `structuredContent` against it when
declared. We declare nothing, so we get neither the client-facing contract nor
the runtime guarantee.

### Verified Current State (2026-06-02)

- **One transport.** `StreamableHTTPServerTransport`, instantiated per-request
  (`apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts:101`).
  **There is no stdio transport** — zero `StdioServerTransport` occurrences.
- **36 tools total** (35 at this 2026-06-02 snapshot, pre-EEF; the EEF tool
  `get-eef-evidence` shipped to production 2026-06-09, making 36 — 24 generated + 12 aggregated), all
  registered through one loop
  (`handlers.ts:158`): **24 generated** (`MCP_TOOL_ENTRIES`,
  `oak-sdk-codegen/.../mcp-tools/definitions.ts:41-66`) + **11 aggregated**
  (`AggregatedToolName`, `universal-tools/types.ts:76-87`): `search`, `fetch`,
  `get-curriculum-model`, `get-thread-progressions`, `get-prior-knowledge-graph`,
  `get-misconception-graph`, `browse-curriculum`, `explore-topic`,
  `download-asset`, `user-search`, `user-search-query`. The EEF tool
  (`get-eef-evidence`) became the 12th aggregated tool at D6 (shipped 2026-06-09), so the surface this
  plan schemas in full is **36** (24 generated + 12 aggregated). When
  `graph-tools-value-redesign` lands, `get-keywords` moves generated→aggregated
  (23 generated + 13 aggregated; net **36** unchanged).
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

## Verified Provenance Taxonomy

Every tool's `payloadSchema` is emitted at its authoritative source. Sources are provenance-distinct
(verified first-hand against source code 2026-06-09):

| Provenance | Tools | Runtime Zod for the response today | Source authority / generator |
|---|---|---|---|
| **Live HTTP API** (OpenAPI → `oak-sdk-codegen`) | the 24 generated tools | **Yes** — `zodOutputSchema` via `response-map.ts` `{ zod, json }` per operation | codegen `response-map` (already done — W1 composes over it) |
| **Bulk-download-derived** (`vocab-gen` writer) | `get-misconception-graph`, `get-prior-knowledge-graph`, `get-thread-progressions` | **No** — generated TS interfaces only (`generated/vocab/*/types.ts`) | vocab-gen writer; **source-Zod gated on `graph-tools-value-redesign`** |
| **Fixed EEF corpus** (`as const`, ADR-173) | `get-eef-evidence` | input **yes** (corpus enums); output **no** (`EefEvidenceEnvelope` TS interface) | `graph-corpus-sdk` corpus → W0-cycle-3 (`satisfies` tie) |
| **Search index** (Elasticsearch over bulk) | `search`, `fetch`, `user-search`, `user-search-query` | **Yes** — generated `Search*ResponseSchema` (`generated/search/`, ADR-067/105) are the source of truth | derive tool-output from the generated source; collapse any hand-maintained parallel (W0-cycle-2) |
| **Aggregated over live API** | `get-curriculum-model`, `browse-curriculum`, `explore-topic`, `download-asset` | reuse generated API Zod sub-schemas | `oak-sdk-codegen` API Zod (reuse in W2) |

The cure — emit a runtime Zod schema at each tool's source — differs per provenance, which is why W0
is phased by readiness.

**Landed-shape note (2026-06-11, owner decision via the
[2026-06-11 snagging plan](oak-prod-mcp-snagging-2026-06-11.plan.md) S1/PR-2,
commit `20ad83326`):** `get-eef-evidence` no longer returns the bare
`EefEvidenceEnvelope` as `structuredContent` with `content: []`. It now emits
through `formatToolResponse` like every aggregated tool — dual `content`
blocks plus the decorated `structuredContent`
(`{...envelope, summary, oakContextHint, status}`). This removes the latent
EEF special case in this plan: `composeEnvelopeSchema` applies uniformly to
EEF in W2 (envelope over the W0-cycle-3 corpus payload Zod), with no
EEF-specific bare-envelope variant needed.

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
   `structuredContent` **mandatory** on every success return of every registered
   tool. This holds today (every tool routes success through `formatToolResponse`,
   which always builds `structuredContent`); S0.2 proves it as an invariant.
   *(principles.md §Strict and Complete; "WE DON'T HEDGE".)*

2. **Populate first, wire required last.** The required field is the convergence,
   not the opener: W1 (24 generated) and W2 (every aggregated tool — the 8
   non-graph tools, EEF, and the three migrated graph tools) populate every
   producer; S0 then promotes `outputSchema` to required across the carrier and
   wires it **last**, as the closing ratchet. Declaring the field required up
   front buys nothing — it is a one-line type change either way, while the value
   is in authoring truthful schemas — and a globally-red type-check would mask
   real errors; so requiredness lands at the convergence, and discovery of
   unpopulated tools is the registry conformance test (S0.2), not the red tree.

3. **One composition mechanism, generator-first (Cardinal Rule).** Every output
   schema is `composeEnvelopeSchema(payloadSchema)` — the envelope contract is
   encoded ONCE (W0-cycle-1) and applied to all tools. The generated envelope is
   composed at `sdk-codegen` time over the existing `zodOutputSchema`; no
   per-generated-tool overrides; fix the utility or emitter if composition is
   wrong. *(principles.md §Cardinal Rule; ADR-029/030/031/035/036/038.)*

4. **Payload schema derived at the source, never hand-authored.** Each tool's
   `payloadSchema` is a runtime Zod schema emitted at its authoritative source
   (live-API codegen; search Zod generator; EEF corpus with a `satisfies` tie;
   vocab writer for graphs). The aggregation envelope is **composed** by the same
   `composeEnvelopeSchema` utility — it is not hand-authored per tool. Where a
   payload embeds a generated type, the composed schema references that generated
   Zod schema directly. *(principles.md §Context Specificity Gradient — "generated
   state beats authored state"; §schema-first; ADR-067/105 for search.)*

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
  the existing tools — that doctrine is EEF-tool-specific (see
  [§Relationship to the EEF graph-tool plan](#relationship-to-the-eef-graph-tool-plan)).
- **Not** building the new EEF graph tool (owned by the EEF plan, D6); this plan
  authors its `outputSchema` only, in W2.
- **Not** rebuilding the three existing graph tools (owned by
  `graph-tools-value-redesign`); this plan authors their `outputSchema` only, in
  W2, against their post-migration `structuredContent`.
- **Not** changing the envelope `formatToolResponse` emits. (The `status` field
  in `structuredContent` is inherited from the formatter and declared truthfully
  here, not endorsed; a separate envelope-cleanup could later remove it. Out of
  scope.)
- **Not** shipping an optional `outputSchema` as a released compatibility window:
  the field is introduced and promoted to required within one pre-merge
  integration (in-branch temporary red is permitted), and what is forbidden is
  *merging* a state where the field is optional or partially populated. No
  transport-specific output-schema path; no permanent compatibility layer.
- **Not** re-opening the `download-asset` URL placement (owned by
  `download-asset-user-only-url.plan.md`; W2 consumes its post-change shape).

---

## Resolved Sequencing (owner, 2026-06-08)

**This plan owns the S0 carrier seam ENTIRELY** — adding the `outputSchema`
field to `UniversalToolListEntry`/`AggregatedToolDefShape`/`ToolRegistryDescriptor`,
forwarding it through `listUniversalTools`, wiring the single `handlers.ts`
config line, and reconciling the SDK `registerTool`
(`ZodRawShapeCompat | AnySchema`) vs ext-apps `registerAppTool`
(`ZodRawShapeCompat | StandardSchemaWithJSON`) carrier divergence — solved ONCE
here at the infra layer. **It also owns the `outputSchema` for EVERY tool**, so
no tool is a special case (revised 2026-06-08).

**The delivery is serial across three phases:**

1. **EEF D6/D7 (priority, first).** The EEF tool ships `structuredContent` with
   **no** `outputSchema`, uniform with every other aggregated tool, and does not
   touch the carrier. EEF gains its output schema in this plan (phase 3), not at
   D6. *(Landed 2026-06-09; then revised 2026-06-11: the D6 `content: []`
   success shape was reversed by the owner — EEF now emits the
   `formatToolResponse` dual shape, PR-2 of the 2026-06-11 snagging plan. See
   the landed-shape note under §Provenance.)*
2. **The graph tools migrate (`graph-tools-value-redesign`).** Each graph tool is
   rebuilt onto the `graph-corpus-sdk` substrate with bounded retrieval, shipping
   **no MCP `outputSchema`** — they work exactly as they do today (an MCP tool
   without an `outputSchema` is valid). The migration owns substrate + retrieval;
   it does **not** touch the output-schema carrier.
3. **This plan runs last, at the point where every tool exists on its final
   substrate, and schemas them all uniformly via one composition mechanism.**
   First emit any missing source payload Zod (W0); then compose the envelope for
   generated tools at codegen (W1) and for every aggregated tool — the 8 non-graph
   tools, the EEF tool, and the three migrated graph tools — over its source-derived
   payload Zod (W2); then the carrier field is promoted to **required** and proven
   by the registry-driven conformance test (S0). The three graph tools compose over
   their post-migration vocab-writer Zod (emitted under `graph-tools-value-redesign`),
   which is why this plan runs after the migration; the EEF tool over its D6/W0-cycle-3
   corpus Zod.

**Why this avoids the special case:** composing every tool's `outputSchema` in
one place, by one mechanism, at one time, means there is no tool whose schema lives
in a different plan or arrives on a different schedule. The migration's job is the tool's data
and retrieval shape; this plan's job is the MCP output contract for all tools at
once.

**The required field is the closing ratchet, not a discovery tool.** It lands
LAST, once every producer is populated, as the anti-regression lock (no future
tool can register without a schema). The exhaustive "which tools still lack a
truthful schema" worklist is the **registry-driven conformance test** (S0.2),
which counts the schema-less surface down to zero by iterating the live
registry and validating each tool's real `structuredContent` — truth, not mere
presence, and without a globally-red type-check that would mask real errors.

**Single-branch execution.** Temporary in-branch red is permitted (the whole
sequence is green before merge), but cycles stay incrementally green where they
can, and **no optional `outputSchema` is ever merged** — the field is introduced
and promoted within one integration; what is forbidden is shipping a released
state where the field is optional.

---

## Relationship to the EEF graph-tool plan

- **The 3 existing graph tools** (`get-thread-progressions`,
  `get-prior-knowledge-graph`, `get-misconception-graph`) are ordinary aggregated
  tools (`definitions.ts:117-128`). `graph-tools-value-redesign` **rebuilds** them
  onto the substrate with bounded retrieval and ships **no MCP `outputSchema`**;
  **their output schemas are authored HERE, in W2** (revised 2026-06-08 — moved
  out of the migration to keep every tool's schema in one place), against their
  post-migration `structuredContent`. They work without a schema in the interim,
  exactly as today.
- **The new EEF graph tool** (flag-gated `OAK_CURRICULUM_MCP_EEF_ENABLED`) is
  **built** by the EEF plan (D3/D4/D6) and ships `structuredContent` with no
  output schema at D6; **its `outputSchema` is authored HERE, in W2**. The tool's
  single-Zod-call graph-native-view derivation stays with the EEF plan; only the
  MCP output contract is this plan's. **Update 2026-06-09:** the landed D6 envelope
  carries `answerType` and a full-vs-headline member union (the A-i/C increment —
  `evidenceForMoveHeadlines` + the `detail` input); W0-cycle-3 and W2 compose the
  output Zod over that real shape (a nested member union, never a root union).
  **Update 2026-06-11:** the D6 `content: []` / bare-envelope `structuredContent`
  shape is reversed (owner decision, PR-2 of the 2026-06-11 snagging plan,
  commit `20ad83326`) — EEF now emits the `formatToolResponse` dual shape, so
  W2's `composeEnvelopeSchema` applies to EEF exactly as to every other
  aggregated tool, over the same W0-cycle-3 corpus payload Zod.
- **One seam, one schema owner.** This plan owns the carrier seam AND every
  tool's `outputSchema`; the EEF and graph-migration plans own their tools'
  construction. Coordinate on the seam; ownership does not transfer.

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
| `w0-cycle-1` | unit | `composeEnvelopeSchema` unit tests (summary-always, oakContextHint `!== false` predicate, status-when-present, object-root, non-object fail-fast); `pnpm test --filter @oaknational/sdk-codegen` |
| `w0-cycle-2` | unit | search/fetch/user-search output payload derives from the generated source-of-truth schemas; conformance against a real response fixture; `pnpm type-check && pnpm test` |
| `w0-cycle-3` | unit | EEF output Zod accepts real `inspect-strand`/`evidence-for-move` envelopes; the type-level `z.infer … extends EefEvidenceEnvelope<EefStrand \| EefStrandHeadline>` tie compiles; `pnpm type-check && pnpm test` |
| `w0-cycle-4` | unit | single-sourced search input: registration shape and runtime-narrowing schema share one derived base; `pnpm type-check && pnpm test` |
| `w1-cycle-1` | unit | emitter unit tests (single/multi-status, oakContextHint predicate); `pnpm test --filter @oaknational/sdk-codegen` + `pnpm sdk-codegen && pnpm build` |
| `w1-cycle-2` | integration | conformance test over all 24 generated descriptors; `pnpm test` |
| `w2-cycle-1` | unit | per-tool conformance unit tests for every aggregated tool (8 non-graph + EEF + the 3 migrated graph tools) + `satisfies` guard holds; `pnpm type-check && pnpm test` |
| `s0-cycle-1` | integration | registration-config carries `outputSchema` for every registered tool (spy pattern); `pnpm test --filter oak-curriculum-mcp-streamable-http` |
| `s0-cycle-2` | e2e | registry countdown conformance: `tools/list` exposes `outputSchema` for every tool, real `structuredContent` validates, structuredContent-present invariant on every non-error return, `isError` skips; `pnpm test:e2e` |
| `ws-docs` | non-code | TSDoc/README accurate; `pnpm markdownlint:root` |

The plan is `complete` only when every acceptance id above is proven; a landed
slice is not completion.

---

## Cycle Dependencies and Parallelisation

> See [TDD Cycles component](../../templates/components/tdd-phases.md)

- **W0 first (mostly parallel)** — W0-cycle-1 (envelope utility) gates W1 and W2;
  W0-cycle-2/3/4 (search Zod, EEF Zod, search input dedup) are independent and
  parallel-safe (separate file scopes). The graph-tool source-Zod is emitted under
  `graph-tools-value-redesign`, not here.
- **W1 ∥ W2** — independent (codegen package vs aggregated SDK modules); both depend
  on W0-cycle-1.
- **W1 cycle 1.1 is atomic** — adding the required envelope field to the
  `ToolDescriptor` contract makes all 24 generated files fail `type-check` until
  regenerated, so the contract change + emitter + `pnpm sdk-codegen` regeneration
  land in **one** commit. Cycle 1.2 (cross-tool conformance test) follows.
- **W2 is one atomic cycle covering every aggregated tool** — `definitions.ts` is
  a shared convergence file; incremental landing forces either unused exports
  (knip) or a transient-optional field. Authoring each tool's schema is
  parallelisable *preparation*; the landing is atomic. The three graph tools'
  schemas are authored against their post-migration `structuredContent`, so W2 is
  gated on `graph-tools-value-redesign` having landed; the EEF tool's on EEF D6.
- **S0 depends on W1 + W2** — it forwards `descriptor.outputSchema` (W1) and
  `def.outputSchema` (W2), then promotes the field to required **last**, once
  every producer (including the migrated graph tools and EEF) carries a schema.
  The required promotion is the closing ratchet; S0.2 is the registry countdown
  conformance proof.

---

## W0 — Source-Zod-emission prerequisites + the composition utility

> W0 makes every tool's payload available as a runtime Zod schema at its
> authoritative source, and defines the single envelope-composition utility W1
> and W2 both consume. Phased hybrid by readiness (owner 2026-06-09): the envelope
> utility, search response Zod, EEF output Zod, and the search input dedup are
> authorable now; the graph-tool source-Zod is emitted under
> `graph-tools-value-redesign` and consumed by W2 when it lands.

### Cycle 0.1 — `composeEnvelopeSchema` utility (ATOMIC)

**File scope**: new helper in `oak-sdk-codegen` (re-exported on an approved subpath
for the W2 aggregated modules in `oak-curriculum-sdk` to consume — NOT in
`oak-curriculum-sdk`, which depends on `sdk-codegen`); `*.unit.test.ts`.

**Test (Red)**: `composeEnvelopeSchema(payloadShape)` returns an object-rooted
`z.ZodRawShape` with `summary` always present, `oakContextHint` present iff
`includeContextHint !== false`, `status` present when provided, and the payload
spread at the top level — matching `formatToolResponse` (`universal-tool-shared.ts:208-221`)
exactly. A **non-object payload fails fast** (it is not silently dropped); multi-status
union payloads are wrapped under `data` by the caller before composition.

**Product code (Green)**: the utility — it accepts an object-rooted payload and fails
fast on a non-object one (never silently returns `undefined` like a bare
`extractZodShape`). **Reviewer**: `type-expert`, `mcp-expert`.

### Cycle 0.2 — Search output payload from the ONE source of truth (authorable now)

**File scope**: `oak-curriculum-sdk/src/mcp/aggregated-search/` + `search-retrieval-types.ts`;
the generated search schemas in `oak-sdk-codegen` (`generated/search/`) are the source of
truth and are reused, not regenerated; `*.unit.test.ts`.

**Test (Red)**: the search/fetch/user-search OUTPUT payload schema derives from the single
generated source of truth — the codegen search response schemas (`SearchLessonsResponseSchema`,
`…Units…`, `…Sequences…`, `…Multi…`, `…Suggestion…`, ADR-067/105), which ALREADY exist and
are already consumed by `validation/types.ts`. The tools emit a transformed `SearchDispatchResult`;
under the Cardinal Rule that transform is itself derived from the one source — so any
hand-maintained `search-retrieval-types` parallel is collapsed to derive from the generated
source, never a second truth.

**Product code (Green)**: derive the tool-output payload schema from the generated source;
`composeEnvelopeSchema` wraps it. **Acceptance**: `pnpm type-check && pnpm test` green.
**Reviewer**: `type-expert`, `elasticsearch-expert` (response-shape fidelity).

### Cycle 0.3 — EEF output Zod at source (authorable now)

**File scope**: `graph-corpus-sdk` (corpus-enum exports) + the EEF output Zod home
(`aggregated-eef-evidence.ts` or a corpus-side module); `*.unit.test.ts`.

**Landed-shape note (2026-06-09, A-i + C):** the `EefEvidenceEnvelope` now carries
`answerType` (`'strand-lookup' | 'context-subset'`) and a full-vs-headline member
union — `evidence-for-move` returns full `EefStrand` members by default and
`EefStrandHeadline` members when `detail: 'headline'` is passed (the
`evidenceForMoveHeadlines` projection, `eef-headline-view.ts`). The output Zod is
therefore one object-rooted schema with `answerType`, `members:
z.array(z.union([<full> , <headline>]))` (nested union, not a root union — Principle 6),
`edges`, `frontier`, `provenance`. The member union is deliberately WIDER than any
single call's output — each call returns homogeneous members (all-full OR all-headline,
the generic `EefEvidenceEnvelope<TMember>`) — because one object-rooted schema must
accept both shapes and a per-shape split would need a root union the SDK silently
drops; at execution, order the union full-before-headline so the richer schema is
tried first (a real headline envelope still falls through, as the full-strand schema
requires deep fields a headline lacks).

**Test (Red)**: the `EefEvidenceEnvelope` output Zod, built from `EEF_STRAND_IDS` /
`OBSERVED_*`, accepts a real `inspect-strand`, `evidence-for-move` (full), AND
`evidence-for-move` `detail:'headline'` envelope; the TYPE-LEVEL tie
`z.infer<typeof EefEvidenceEnvelopeZod> extends EefEvidenceEnvelope<EefStrand | EefStrandHeadline>`
compiles (drift is a type error). *(A `satisfies EefEvidenceEnvelope` on the Zod value is
invalid TS — a `ZodObject` is not an `EefEvidenceEnvelope`; the tie is type-level.)*

**Product code (Green)**: emit the Zod at the corpus source with the type-level tie.
GUARDRAIL: do NOT annotate the raw shape `: z.ZodRawShape` — that widens the per-field
`ZodEnum`s (documented anti-pattern in `aggregated-eef-evidence.ts`'s input-schema
comment); rely on the `definitions.ts` `satisfies` carrier guard. *(A runtime `as const`
corpus cannot be codegen'd; emitted-at-source + type-tie is the proportionate generator-first form.
Considered alternative — make the corpus a data-driven codegen input (ADR-031/036) —
deferred to the EEF plan, which owns the corpus type model per ADR-173.)* **Reviewer**:
`type-expert`, `mcp-expert`.

### Cycle 0.4 — Search input single-sourcing (authorable now)

**File scope**: `aggregated-search/flat-zod-schema.ts`, `aggregated-search/validation.ts`; `*.unit.test.ts`.

**Test (Red)**: one source of input-schema truth drives both MCP registration and
runtime narrowing; the registration shape and the narrowing schema cannot diverge
(a conformance test asserts they share the derived base).

**Product code (Green)**: derive both from one source tied to the SDK input contract.
**Reviewer**: `type-expert`.

### Graph-tool source-Zod (gated)

Emitted at the vocab writer under `graph-tools-value-redesign` against the
post-migration `structuredContent`; **not** authorable now (the shape does not yet
exist). W2 composes over it once that plan lands. This preserves the plan's existing
graph gating.

---

## W1 — Generated-tool output schemas (24 tools, codegen)

Compose the MCP output-envelope schema at `sdk-codegen` time via
`composeEnvelopeSchema` (W0), wrapping the existing `zodOutputSchema` response
schema in the real `formatToolResponse` envelope.

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

## W2 — Aggregated-tool output schemas (ATOMIC; every aggregated tool)

> W2 covers EVERY aggregated tool — the 8 non-graph tools, the EEF tool
> (`get-eef-evidence`), and the four migrated graph tools (incl. `get-keywords`,
> which migrates generated→aggregated under `graph-tools-value-redesign`) — **composed** uniformly
> here via `composeEnvelopeSchema` (W0) over each tool's source-derived payload Zod,
> so no tool is a special case (§Resolved Sequencing). The graph-tool portion is
> gated on `graph-tools-value-redesign` having landed and the EEF portion on EEF D6,
> because each schema composes over that tool's REAL post-migration / post-D6
> `structuredContent`. Composing the schemas is parallelisable preparation; the
> landing is atomic (one commit). The required field is promoted in S0 (the closing
> ratchet), not here.

**File scope** (permitted to touch):

- `universal-tools/definitions.ts` — add `outputSchema: z.ZodRawShape` to `AggregatedToolDefShape` (`:58-70`); wire every aggregated entry.
- Each aggregated module (`aggregated-search/`, `aggregated-fetch/`,
  `aggregated-curriculum-model/`, `aggregated-browse/`, `aggregated-explore/`,
  `aggregated-asset-download/`, `aggregated-user-search/`), the four migrated
  graph-tool modules (`get-misconception-graph`, `get-prior-knowledge-graph`,
  `get-thread-progressions`, `get-keywords`), and the EEF tool module (`get-eef-evidence`) —
  export an object-rooted output raw shape. Exact module paths confirmed at
  execution against the post-migration / post-D6 tree.
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
| `get-misconception-graph`, `get-prior-knowledge-graph`, `get-thread-progressions` | the post-migration bounded-retrieval `structuredContent` defined by `graph-tools-value-redesign`; compose over the vocab-writer Zod emitted there, never a speculative shape |
| `get-keywords` | migrates generated→aggregated under `graph-tools-value-redesign`; compose over its post-migration bounded `structuredContent` / vocab-writer Zod emitted there |
| `get-eef-evidence` | the `EefEvidenceEnvelope` envelope — `answerType` + `members` (full `EefStrand`, or `EefStrandHeadline` when `detail:'headline'`; a NESTED union) + `edges`/`frontier`/`provenance` (A-i + C, landed 2026-06-09); compose over the W0-cycle-3 corpus Zod |

**Product code (Green)**: `outputSchema` on `AggregatedToolDefShape`; compose each
aggregated module's object-rooted shape via `composeEnvelopeSchema` (W0) over its
source-derived payload Zod (W0-cycle-2 search Zod; W0-cycle-3 EEF Zod; reused
generated API Zod sub-schemas for the live-API-aggregated tools); wire every entry.

**Acceptance**: all aggregated conformance tests pass; the
`as const satisfies Record<AggregatedToolName, …>` guard (`:149`) holds;
`pnpm type-check` + `pnpm test` green; tree green.

**Reviewer dispatch**: `type-expert` (the `ZodRawShape` typing; generated
sub-schema reuse type-compatibility), `mcp-expert`, `code-expert`.

---

## S0 — Seam: thread the required `outputSchema` to the wire

> S0 is the **closing ratchet** (§Resolved Sequencing): it promotes `outputSchema`
> to required and wires it **last**, after W1 + W2 have populated every producer
> (including the migrated graph tools and EEF). Depends on W1 + W2.

### Cycle S0.1 — Required field + projection + registration

**File scope**:

- `universal-tools/types.ts` — add **required** `outputSchema: z.ZodRawShape` to **both** `ToolRegistryDescriptor` (`:31-40`, the generated-descriptor narrow type — without this the generated `outputSchema` cannot cross into the universal-tools layer) **and** `UniversalToolListEntry` (`:120-142`).
- `universal-tools/descriptor-utils.ts` — add `requireGeneratedToolOutputShape`, mirroring `requireGeneratedToolInputShape` (`:47-62`) + `extractZodShape` (no `as`/`instanceof` shortcut beyond the existing guard pattern).
- `universal-tools/list-tools.ts` — forward `outputSchema` from `def.outputSchema` (aggregated) and the descriptor (generated, via the helper) in **both** map branches (`:62-94`); remove the stale `download-asset on stdio` TSDoc (`:25-26`); add `outputSchema` to the `@example` config spread (`:47-52`).
- `apps/oak-curriculum-mcp-streamable-http/src/handlers.ts` — add `outputSchema: tool.outputSchema` to the single `config` object (`:173-178`); both branches inherit it.

**Test (Red)**: extend `handlers-tool-registration.integration.test.ts` (spy
pattern, `:76-89`) to assert the captured `registerTool`/`registerAppTool` config
carries an object-rooted `outputSchema` for **every registered tool**.

**Product code (Green)**: the fields + helper + forwards + the one `config` line.

**Acceptance**: registration config carries `outputSchema` for every registered tool;
`pnpm type-check` + `pnpm test --filter oak-curriculum-mcp-streamable-http` green;
tree green.

**Reviewer dispatch**: `mcp-expert`, `architecture-expert-barney` (the
`ToolRegistryDescriptor` cross-package boundary), `test-expert` (the spy-pattern
assertion: field presence, not type shape), `code-expert`.

### Cycle S0.2 — Registry countdown conformance proof

**File scope**: integration/E2E test files only.

**Test (Red)**:

1. a registry-driven test iterates the LIVE tool registry and asserts every tool
   exposes an object-rooted `outputSchema`, counting the schema-less surface down
   to zero — the "which tools still lack a schema" worklist is computed from the
   registry, never inferred from a red type-check;
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
- Update any README enumerating the tool surface to **36** (24 generated + 12 aggregated incl. EEF; `get-keywords` shifts generated→aggregated when the graph migration lands — net 36).

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
| Required `outputSchema` makes `structuredContent` mandatory on every success return | S0.2 invariant test across every registered tool; every tool already routes success through `formatToolResponse` |
| `oakContextHint` conditionality assumed (`=== true`) instead of derived (`!== false`) | W1 derives the schema predicate off the exact runtime predicate; tested in cycle 1.1c |
| `formatToolResponse` top-level spread mis-modelled | W1/W2 schemas encode the spread envelope explicitly; per-tool tests use real emitted output |
| Schema strictness (`.strip`/`.passthrough`) interacts with envelope fields | Align with `schema-resilience…` OQ1/OQ2 before W1 finalises; envelope declares `summary`/`oakContextHint`/`status` so they are not "extra" |
| S0 collides with active EEF D6 / the graph migration on `universal-tools/` | NO collision (revised 2026-06-08): both EEF D6 and the graph migration ship WITHOUT touching the output-schema carrier, and both precede this plan in the serial order — this plan owns the seam and every schema outright. Standard active-claims coordination before editing the seam still applies. |
| W2 runs before the graph tools or EEF exist on their final substrate → nothing truthful to author against | Serial order (§Resolved Sequencing): W2's graph-tool portion is gated on `graph-tools-value-redesign` landing, its EEF portion on EEF D6 landing; schemas are authored from real post-migration / D6 `structuredContent`, never speculatively |
| `download-asset` shape changes under W2 (URL → `_meta`) | W2 consumes the post-`download-asset-user-only-url` shape; sequence that change first |

---

## Foundation Alignment

> See [Foundation Alignment component](../../templates/components/foundation-alignment.md)

- **principles.md** — §Cardinal Rule (one composition mechanism; W1 composes at
  codegen); §Strict and Complete + "WE DON'T HEDGE" (required, object-rooted, no
  optionality); §Context Specificity Gradient (W2 composes over source-derived Zod,
  generated state beats authored state); §"Misleading docs are blocking" (stdio
  TSDoc cleanup); §Fail FAST (truthful-or-error).
- **testing-strategy.md** — TDD cycle-pairs as landing units at unit /
  integration / E2E; conformance proven through public interfaces (real
  `structuredContent`); no global state in tests.
- **schema-first-execution.md + ADRs** — every tool's payload Zod is emitted at its
  authoritative source and the envelope is composed from it, never hand-authored:
  **ADR-029** (no manual API data), **ADR-030** (SDK single source of truth),
  **ADR-031** (generation-time extraction), **ADR-035/036** (unified + data-driven
  codegen), **ADR-038** (compilation-time revolution), **ADR-067/105** (SDK-generated
  search mappings / constants). The EEF corpus stays the type authority (ADR-173);
  its output Zod is emitted at the corpus source with a `satisfies` tie.

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

**Blocking**: the serial order (§Resolved Sequencing). This plan runs after EEF
D6/D7 has landed (so the EEF tool exists) and after `graph-tools-value-redesign`
has landed (so the three graph tools exist on the substrate). W2 authors every
aggregated tool's `outputSchema` against its real `structuredContent`, so those
tools must exist first. W1 (codegen) and S0.2's test design are not blocked on
them and can be prepared earlier.

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
  the new EEF graph tool. EEF D6 ships no output schema and does not touch the
  carrier, so it no longer shares the S0 seam; this plan owns the seam outright
  and authors the EEF tool's output schema as an ordinary aggregated tool.
- `../../connecting-oak-resources/knowledge-graph-integration/current/graph-tools-value-redesign.plan.md`
  — rebuilds the three existing graph tools onto the substrate (substrate +
  bounded retrieval only, **no** MCP output schema); this plan authors their
  `outputSchema` in W2 against their post-migration `structuredContent`. Blocking
  upstream for the graph-tool portion of W2.
- `../active/upstream-api-reference-metadata.plan.md` — sibling codegen-seam
  change; serialise with W1 at the emitter, never concurrent.
- `../aggregated-tool-result-type-remediation.plan.md` (collection root) — if it
  lands first, W2 schemas match the post-migration `structuredContent`.
