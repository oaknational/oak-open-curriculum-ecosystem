# Output-Schema MCP Plan Audit

**Status:** Stable audit · **Date:** 2026-06-02 · **Branch:** `feat/graph-tooling-tidyup`
**Subject:** `.agent/plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md`
**Method:** 61-agent fan-out audit (workflow `output-schema-plan-audit`); 40 claims verified against live code (27 TRUE, 6 FALSE, 4 PARTIAL, 3 STALE); top-stakes findings independently re-verified by hand before relay.

---

## 1. Bottom line

The plan is **materially stale** on every concrete inventory fact and its single hard sequencing gate. Its conceptual core (separating Contract A — upstream-response validation — from Contract B — MCP `structuredContent` declaration) is sound and remains correct; the rot is in the facts the executor would act on. The **single biggest correction** is the Phase 3 gate (plan lines 382-384, 412-413): it blocks on `projections.ts` / `toRegistrationConfig` / `toProtocolEntry` from the runtime-boundary-simplification plan, but those artefacts were created (commit `47624001`) and then **deliberately deleted** (commit `028dc217`, WS3 "fold metadata into definitions and list-tools") and exist on **no current branch** — the executor would block forever on a nonexistent prerequisite. Secondary but pervasive: the plan describes **34 tools (24 + 10)** and a **stdio transport**, but reality is **35 tools (24 + 11)** behind a **single StreamableHTTP transport with no stdio anywhere**, and it names a tool (`get-prerequisite-graph`) that does not exist while omitting two that do (`get-prior-knowledge-graph`, `get-misconception-graph`).

**Recommended split verdict:** the owner's four-way decomposition is **wrong at the joints**. Collapse to **three workstreams** — **S0** (shared descriptor-surface seam, the reframed "universal tools" item — a *mechanism*, not a tool category), **W1** (24 generated tools), **W2** (all 11 aggregated tools, absorbing the owner's separate "search" and "graph" sub-plans because both are subsets of aggregated). The **new EEF graph tool stays owned by the EEF plan**, not this one.

---

## 2. Claim ledger

### TRUE claims (verified, no correction needed)

`c01, c02, c08, c09, c10, c11, c12, c13, c14, c15, c16, c17, c18, c20, c21, c22, c23, c25, c26, c31, c32, c33, c34, c35, c36, c39, c40` — all confirmed against code. In summary these establish: the registration config carries only `{title, description, inputSchema, annotations}` with no `outputSchema` (c01, c20, c22, c39); there are exactly 24 generated tools (c02); generated descriptors already carry `toolOutputJsonSchema` + `zodOutputSchema` derived from the SDK-decorated schema flow (c08, c09, c10, c16, c34); `validateOutput` is fully wired end-to-end with `OUTPUT_VALIDATION_ERROR` mapping (c11, c12, c13, c14, c17); `formatToolResponse()` is the single response formatter for all tools (c15, c23, c25); `oakContextHint` is present iff `requiresDomainContext===true` (c26); the universal-tools layer never surfaces output schemas (c21, c33); search outputs are object-shaped for both scoped and suggest modes (c35); the runtime-boundary plan file exists at the cited path (c31); the registration loop is a single convergence point (c32); and aggregated/generated tool maps are well-formed (c18, c40).

### STALE / FALSE / PARTIAL claims (corrections required)

| id | verdict | corrected statement |
|----|---------|---------------------|
| c03 | STALE | **11** aggregated tools, not 10. The 11th is `get-misconception-graph` (types.ts:82; definitions.ts:125-128), added after the plan's inventory was written. |
| c04 | STALE | Total is **35** (24 generated + 11 aggregated), not 34. |
| c05 | STALE | Full aggregated list (11): search, fetch, get-curriculum-model, get-thread-progressions, get-prior-knowledge-graph, get-misconception-graph, browse-curriculum, explore-topic, download-asset, user-search, user-search-query. The plan omits `get-misconception-graph` and invents `get-prerequisite-graph`. |
| c06 | PARTIAL | Universal/HTTP exposes all **35** tools via a single loop (handlers.ts:158), not 34. |
| c07 | FALSE | **No stdio transport exists.** Only `StreamableHTTPServerTransport`, instantiated per-request (core-endpoints.ts:101). Zero grep hits for `StdioServerTransport`. The plan's claim that stdio exposes only the 24 generated tools is fiction. |
| c19 | FALSE | One transport, one unified registration path. The only branch (handlers.ts:180-183) is `isAppToolEntry` (widget vs non-widget tool **type**), not a transport distinction. handlers.ts:110 JSDoc explicitly states "No compatibility projection layer sits between the SDK registry and the transport registration step." |
| c24 | FALSE | No stdio. On the single (HTTP) success path **all** tools — including generated — return a 3-field `CallToolResult` (2-item text content array + `structuredContent` + `_meta`), never text-only. The plan's "stdio returns text content only" premise is false twice over. |
| c27 | FALSE | The fetch URL field is **`oakUrl`**, not `canonicalUrl` (aggregated-fetch/execution.ts:142-155). Plan line 274 is wrong. |
| c28 | PARTIAL | `download-asset` structuredContent has **five** fields: downloadUrl, lesson, type, summary, **oakContextHint** (always present — `includeContextHint` defaults truthy). Plan line 278 omits `oakContextHint`. There is **no** `status` field (the only aggregated tool that omits it). |
| c29 | FALSE | The Phase 3 prerequisite is **NOT** grounded in the current branch. `projections.ts` / `toRegistrationConfig` / `toProtocolEntry` do not exist (zero grep hits); handlers.ts:173-184 still hand-assembles config inline. The work was created then deleted; `feat/mcp_app` stopped at Phase 2 RED. Phase 3 is blocked on a nonexistent artefact. |
| c30 | PARTIAL | Phases 0-2 *can* begin (no blocking external dep), but Phase 2's written scope is stale: 11 aggregated tools not 10, `get-prerequisite-graph` is a phantom, stdio does not exist. Executing against the written scope would silently miss `get-misconception-graph`. |
| c37 | PARTIAL | The sequencing *rule* is correctly stated (consume canonical SDK descriptor surface, not the app-owned seam), but the **precondition is not met** — the groundwork is absent, so the gate is currently blocking. |
| c38 | FALSE | Generated output schemas **already exist** at codegen time (emit-index.ts:119-120 emits `toolOutputJsonSchema` + `zodOutputSchema` into all 24 files). The plan's framing that they must be *created* is wrong; the real gap is that they are **never forwarded** through the universal-tools layer or `registerTool()`. |

---

## 3. What changed under the plan's feet

1. **Stdio transport removed entirely.** Not deprecated, not flagged off — there is no stdio file, package, or transport instance anywhere (zero `StdioServerTransport` hits). The plan's entire "Transport Inventory," "Transport Truthfulness," and stdio-gated completion criteria (lines 101-115, 217-226, 373-378, 453-454) are dead text describing a transport that does not exist.
2. **Aggregated tool count 10 → 11.** `get-misconception-graph` was added (with the EEF / multi-source open-education integration). The plan also carries a **phantom name** `get-prerequisite-graph` that never existed in code — the real graph tools are `get-prior-knowledge-graph` and `get-misconception-graph`.
3. **Total tool count 34 → 35.**
4. **Runtime-boundary "groundwork" was built then deleted.** `projections.ts` (`toRegistrationConfig`, `toProtocolEntry`) created in `47624001`, removed in `028dc217` (WS3 "remove universal-tool projections and align servers — fold metadata into definitions and list-tools"). The runtime-boundary plan's archive status ("ALL PHASES COMPLETE 0-8") is **misleading** — Phase 8 landed only on `feat/mcp_app`, not main, and the Phase 3 projection deliverable was superseded. The real canonical seam today is `UniversalToolListEntry` + `listUniversalTools()` + `handlers.ts:173-184`, consumed directly with no projection layer.
5. **outputSchema is already SDK-capable and codegen-emitted.** MCP SDK 1.29.0 `registerTool()` accepts optional `outputSchema` and conditionally projects it into `tools/list` (mcp.d.ts:150-157). Every generated descriptor already carries the source schema data. The gap is purely Oak's non-wiring, not a missing capability or missing generation.

---

## 4. Current reality of `outputSchema`

**Where it exists today:** only at the per-descriptor level for generated tools (`toolOutputJsonSchema`, `zodOutputSchema` on `ToolDescriptor`, contract lines 55-56; emitted into all 24 tool files at emit-index.ts:119-120). These are used **solely** for `validateOutput` of the raw upstream payload — Contract A. The only string occurrences of `outputSchema` outside `node_modules` are inside the minified Zod bundle in `widget-html-content.ts` — zero hand-authored usage.

**Where it does NOT exist:** anywhere in the wire path. It is absent from `ToolRegistryDescriptor` (types.ts:31-40), `UniversalToolListEntry` (types.ts:120-142), `listUniversalTools()` (list-tools.ts:62-94), `AggregatedToolDefShape` (definitions.ts:58-70), and the config object passed to both `server.registerTool()` and `registerAppTool()` (handlers.ts:173-184). Aggregated tools have **no output-schema mechanism at all**.

**The single change that gates everything (S0):** add an **optional, transport-neutral `outputSchema`** field to the one shared seam — `ToolRegistryDescriptor` + `UniversalToolListEntry` + the `listUniversalTools()` projection + the `handlers.ts` config object + an optional slot on `AggregatedToolDefShape`. Additive: when absent, the SDK omits it from the wire response (verified SDK behaviour). Until this lands, W1 and W2 are no-ops at the wire. **This is also exactly the seam EEF D6 opens** — they are the same change.

---

## 5. Related-document gaps & overlaps

| Document | Relationship | Key finding | Recommended action |
|----------|-------------|-------------|--------------------|
| `mcp-runtime-boundary-simplification.plan.md` (archive/completed) | **Dependency (broken)** | Phase 3 deliverable (`projections.ts`) was created then deleted in WS3; archive "complete" status is unreliable against the live tree; Phase 8 landed only on `feat/mcp_app`. | **Rewrite the Phase 3 gate** to name the live seam (`UniversalToolListEntry` + `list-tools.ts` + `handlers.ts:173-184`); drop all `projections.ts`/`toRegistrationConfig`/`toProtocolEntry` references. Keep as architectural history only. |
| `schema-resilience-and-response-architecture.plan.md` (active) | **Upstream dependency** | OQ1 (`.strip()` vs `.passthrough()`) and OQ2 (remove `additionalProperties:false`) change the JSON Schema shape W1 composes from; both pending on owner. Touches same files (executor.ts:61-64, generate-zod-schemas.ts). | **Resolve OQ1/OQ2 before W1 finalises composition.** Add explicit cross-reference; Phase 1 must state its envelope-shape assumption or wait. |
| `download-asset-user-only-url.plan.md` (current, not started) | **Overlapping scope / contradiction** | Removes `downloadUrl` from `structuredContent` (moves to `_meta`); its Task 2.2 already names this plan. Plan line 278 already lists wrong fields (`downloadUrl` present, `oakContextHint` missing). | **Sequence download-asset boundary change first**, then author W2's download-asset schema against the post-boundary shape `{lesson, type, summary, oakContextHint}` (no `downloadUrl`, no `status`). |
| `upstream-api-reference-metadata.plan.md` (active, pending) | **Parallel sibling at codegen seam** | Adds `upstreamApi` to same files (emit-index.ts, generate-tool-descriptor-file.ts, mcp-protocol-types.ts, `UniversalToolListEntry`). Field names don't collide; no contradiction. | **Serialise codegen-seam work** with W1 (or single shared codegen PR). Either order valid; never concurrent at the seam. |
| `aggregated-tool-result-type-remediation.plan.md` (pending) | **Soft upstream dependency** | May rename `AggregatedToolName`/`AGGREGATED_TOOL_DEFS` and migrate composed tools to `ToolExecutionResult`, changing emitted `structuredContent`. Also confirms 11-tool stale inventory. | If it lands first, W2 schemas must match post-migration shapes. Note as sequencing risk. |
| `upstream-api-v0.7.0-alignment.plan.md` | **Orthogonal** | No bearing on output-schema sequencing; independently flags the same stale gate + inventory. | None. |
| `mcp-protocol-adoption-roadmap.plan.md` (future) | **Orthogonal** | Only indirect tie (R3b ResourceLink, explicitly out of scope here). | None. |
| `roadmap.md` / `current/README.md` | **Navigation anchors** | Both independently confirm the stale 34/10 count and broken Phase 3 gate; README "ready for renewed grounding" status is accurate. | No README change needed; corrections belong in the plan body. |

---

## 6. EEF relationship

**Is graph a special case of universal tools? Code verdict: NO.** The three existing graph tools (`get-thread-progressions`, `get-prior-knowledge-graph`, `get-misconception-graph`) are ordinary members of `AggregatedToolName` (types.ts:80-82), sit in `AGGREGATED_TOOL_DEFS` (definitions.ts:117-128) and `AGGREGATED_HANDLERS` (executor.ts:168-169), and register through the identical `listUniversalTools()` → `handlers.ts:158` loop with **no graph-specific branch**. `graph-resource-factory.ts` is a code-reuse convenience producing the same shape as any hand-authored aggregated def. The only graph-specific addition is an **additional** MCP resource registration (register-resources.ts:128-130) — additive, not a separate tool path. Both the EEF code-reality and conflict lenses return "no."

**"Universal tools" is not a peer category either** — `UniversalToolName = AggregatedToolName | ToolName` (types.ts:95), no third member. It is the shared mechanism, not a tool set.

**The EEF plan asserts graph-is-special — but only doctrinally, only for the new EEF tool that does not yet exist.** Its discipline (single-Zod-call over a named graph-native-view subset, `satisfies`-tied to `structuredContent`, root `type: object`, flag-gated `OAK_CURRICULUM_MCP_EEF_ENABLED`, structuredContent-only) is a genuinely different *construction contract* from the existing three graph tools (which simply spread `sourceData` with no output schema).

**Ownership verdict:**
- **Three existing graph tools** → owned by this plan, inside **W2** (they are aggregated tools).
- **New EEF graph tool** → **owned exclusively by the EEF plan (D3/D4/D6)**. It does not exist, is flag-gated, and its schema-derivation doctrine is intrinsic to the graph-native-view chain. Splitting it out would fracture a coherent derivation contract across two plans. **This plan must explicitly scope OUT the EEF tool.**
- **The shared seam (S0 / EEF D6) is the single coordination point** — coordinate, do not transfer ownership.

**Live state note:** ADR-157 is recorded "Corrected" in the EEF D0 ledger but shows as modified (`M`) in the current working tree — an uncommitted working-tree change, not a plan conflict, but worth committing to reconcile.

---

## 7. Recommended decomposition

**Three workstreams, seam-first. The owner's four-way split is collapsed at two wrong joints:** "universal tools" is the *enabling mechanism* (S0), not a fourth content sub-plan; and "search" + "graph" are *subsets of aggregated* (W2), not peer categories.

### S0 — Shared descriptor-surface extension *(the reframed "universal tools" item)*
- **Scope:** Add an optional, transport-neutral `outputSchema` field to `ToolRegistryDescriptor` (types.ts:31-40), `UniversalToolListEntry` (types.ts:120-142), the `listUniversalTools()` projection (list-tools.ts:62-94), the config passed to both `server.registerTool()` and `registerAppTool()` (handlers.ts:173-184), and an optional slot on `AggregatedToolDefShape` (definitions.ts:58-70). Additive only.
- **Tools:** none (infrastructure).
- **Depends on:** nothing. **Must land first.**
- **Critical:** This is the **same change as EEF D6**. EEF is active on the current branch with D3 next; this plan is queued. Let **EEF D6 land S0 as the canonical additive optional field**; this plan's S0 becomes a no-op verification that consumes the already-open seam. Do not let EEF D6 land it as an EEF-only bypass.

### W1 — Generated-tool output schemas (24 tools)
- **Scope:** Compose truthful `outputSchema` describing the **composed `structuredContent` envelope** (`{status, data}` spread + `summary` + conditional `oakContextHint`), not the raw `toolOutputJsonSchema`. The raw per-descriptor schema already exists; wrap it.
- **Tools:** all 24 in `MCP_TOOL_ENTRIES`.
- **Depends on:** S0.
- **Note:** Files live at `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/` — **NOT** `oak-curriculum-sdk` as the plan implies. Codegen-emitter change → serialise against upstream-api-metadata + schema-resilience at the codegen seam.

### W2 — Aggregated-tool output schemas (all 11) *(absorbs owner's "search" and "graph" sub-plans)*
- **Scope:** Hand-author `outputSchema` per tool matching real `structuredContent` (no forced shared envelope). Per-tool shapes are in ground truth (search: discriminated scoped vs suggest; fetch: `oakUrl` not `canonicalUrl`; download-asset: omits `status`; graph tools: spread `sourceData`).
- **Tools (11):** search, fetch, get-curriculum-model, get-thread-progressions, get-prior-knowledge-graph, get-misconception-graph, browse-curriculum, explore-topic, download-asset, user-search, user-search-query.
- **Depends on:** S0; soft-depends on download-asset-user-only-url (sequence its boundary change first) and aggregated-result-type-remediation.
- **Excludes:** the new EEF graph tool (owned by EEF plan).

### Sequencing
**S0 first, unconditionally** (via EEF D6). Before S0 can even be authored, **correct the plan's gate and inventory** (see §8). After S0: W1 and W2 are independent and parallelisable, honouring the codegen-seam exclusion (W1) and download-asset boundary sequencing (W2). The EEF graph tool runs its own D3→D7 track, never folded into W1/W2.

---

## 8. Recommended actions (ordered)

1. **Rewrite the Phase 3 gate (lines 382-384, 412-413, 237-240).** Remove all references to `projections.ts` / `toRegistrationConfig` / `toProtocolEntry` (deleted, on no branch). Replace with: "Phase 3 threads `outputSchema` through the live SDK-owned seam — `UniversalToolListEntry` (types.ts) + `listUniversalTools()` (list-tools.ts) + the `handlers.ts:173-184` registration config — which already exists; the projection layer described by the runtime-boundary plan was superseded by direct consumption (PR #76)." This unblocks the plan.
2. **Fix the tool inventory (lines 81-99, 105-115, 305, 342, 375, 448, 452).** 34 → **35**; 10 → **11** aggregated; replace `get-prerequisite-graph` with `get-prior-knowledge-graph` **and** add `get-misconception-graph`.
3. **Delete the entire stdio narrative** (Transport Inventory lines 101-115; Transport Truthfulness items 2-3 lines 224-226; Phase 3 stdio expectation lines 377-378; Completion Criterion 5 lines 453-454). There is one transport: StreamableHTTP.
4. **Reframe "What Is Missing" / Phase 1 (lines 38-41, 124-131, 318, 449).** Generated output schemas already exist at codegen time; the gap is **forwarding** them through the universal-tools layer + `registerTool()`, not generating them. State this as the actual gap.
5. **Fix the example field shapes (lines 274, 278).** fetch: `oakUrl` not `canonicalUrl`; download-asset: `{downloadUrl, lesson, type, summary, oakContextHint}` with **no** `status` (and flag that download-asset-user-only-url will remove `downloadUrl`).
6. **Add the three-workstream decomposition (S0/W1/W2)** and explicitly **scope out the EEF graph tool**, with a coordination note that S0 == EEF D6.
7. **Add cross-references** to schema-resilience (OQ1/OQ2 gate W1 composition), download-asset-user-only-url (gate W2's download-asset), and upstream-api-metadata (codegen-seam serialisation).
8. **Correct the generated-tool file path** in any task referencing it: `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/`.

**First move:** Action 1 (gate rewrite) — until that lands, the plan blocks on a nonexistent artefact and Phase 0's re-grounding (Actions 2-5) cannot legitimately mark the plan ready.

---

## Addendum — principle-driven design corrections (post-audit grounding)

After the audit, the seam files were re-read directly to author a decision-complete plan. Two of §7's recommendations were corrected against `principles.md`; the corrected forms govern the rewritten plan.

1. **`outputSchema` is REQUIRED, not optional.** §7 proposed an "optional, additive" field. But `UniversalToolListEntry.inputSchema` is already required and uniform (no-input tools expose `{}`; `types.ts:108`, `list-tools.ts:30`), every tool emits `structuredContent` via `formatToolResponse()` (`universal-tool-shared.ts:208-221`), and Strict-and-Complete forbids invented optionality. The field is required on `ToolRegistryDescriptor`, `AggregatedToolDefShape`, and `UniversalToolListEntry`.
2. **Sequencing inverts: populate first, wire last.** A required field cannot land before its producers populate it. W1 (codegen emits for 24 generated) and W2 (11 aggregated authored) land first and independently; S0 (the shared `UniversalToolListEntry` field + `list-tools` projection + `handlers.ts:173-184` registration config) lands last as the convergence. The audit's "S0 first" assumed the optional-additive shape; the required shape reverses it.
3. **W2 reuses generated sub-schemas (Cardinal Rule).** Where an aggregated tool's `structuredContent` embeds a generated payload type (e.g. `fetch`, `browse-curriculum`), its output schema references the generated Zod schema for that portion; only the aggregation-specific envelope is hand-authored.
4. **Generated envelope confirmed exact.** `executor.ts:61-63` passes `data: { status, data }`, which `formatToolResponse` spreads to `{ status, data, summary, oakContextHint }` — the audit's c25/c38 envelope is correct for generated tools. The spread nuance (`universal-tool-shared.ts:211`) affects aggregated tools, each of which spreads its own domain object at the top level; their schemas are therefore per-tool, not a shared envelope.
5. **EEF single-Zod-call doctrine is EEF-scoped.** It applies only to the new EEF graph tool (graph-native-view-derived), never retrofitted to the 35 existing tools.

These corrections are realised in the rewritten plan (`S0/W1/W2` workstreams); its single open decision is S0 / EEF-D6 ownership.
