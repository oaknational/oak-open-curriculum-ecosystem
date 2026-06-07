---
title: "EEF D6 execution — MCP composition: EEF as the first graph tool on the new substrate (TDD cycles)"
status: current
lane: current
type: executable
thread: eef
date: 2026-06-06
owner_scope: >-
  Executable, cycle-level elaboration of the D6 deliverable in
  eef-graph-tool-completion.plan.md (§D6). Builds the EEF MCP composition as a
  FIRST-CLASS universal-tools entry AND — corrected 2026-06-06 (owner-directed) —
  a PEER OF THE AGGREGATED GRAPH-TOOL FAMILY (get-misconception-graph /
  get-prior-knowledge-graph): it executes through the established
  AGGREGATED_HANDLERS path (executor.ts), homed SDK-side, with NO bespoke
  handler, NO registration-loop discriminant, NO bypass of
  handleToolWithAuthInterception, and NO special auth status. EEF is simply the
  first graph tool built on the new graph-core + graph-corpus-sdk substrate, in
  the bounded-query shape the existing whole-corpus-dump graph tools will migrate
  to (graph-tools-value-redesign.plan.md). Plus the interpretation resource and
  the user-facing prompt, all co-gated behind OAK_CURRICULUM_MCP_EEF_ENABLED with
  structuredContent-only tool results. Does NOT re-open the owner-ratified D3 MCP
  contract or D4 graph capability contract: the surface names, the input subsets,
  the single-Zod-call input schema source, the isError semantics, and
  ADR-191 governance are settled.
readiness: >-
  Architecture owner-ratified (2026-06-06): get-eef-evidence is an aggregated
  graph-tool-family peer — an AGGREGATED_HANDLERS entry SDK-side, registered and
  executed uniformly, uniform auth via securitySchemes, a runtime graph-corpus-sdk
  dependency (validated acyclic). The MCP output schema was DROPPED from D6
  (owner-ratified 2026-06-06): EEF uses a RAW-SHAPE input (a z.ZodRawShape record,
  exactly like the family's SEARCH/BROWSE input schemas — NOT a z.object value) +
  structuredContent with NO outputSchema and NO shared-carrier change, so c0
  (the carrier widening) no longer exists and the registerTool/registerAppTool
  carrier divergence never arises. The universal output-schema work (every tool)
  is owned by output-schemas-for-mcp-tools.plan.md. Cycles are c1–c6 (no c0).
  Pre-execution gate G0 (re-confirm the V1–V8 input/registration anchors against
  the then-installed SDK/ext-apps) runs first; per-cycle readiness reviewers
  (code/type/test/mcp-expert by substance) run during execution.
todos:
  - id: d6-c1-eef-entry-subsets-schema-sources
    content: "oak-curriculum-sdk: add the EEF tool as a first-class aggregated-tool-family entry and define the input subsets + the input schema source. Add `get-eef-evidence` to the `AggregatedToolName` union (the D3-ratified machine name; do NOT invent). Add `@oaknational/graph-corpus-sdk` as a RUNTIME `dependency` of oak-curriculum-sdk/package.json (NOT devDependency, NOT type-only): the c3 handler calls inspectStrand/evidenceForMove at runtime, exactly as get-misconception-graph imports its data from `@oaknational/sdk-codegen/vocab-data` at runtime (aggregated-misconception-graph.ts:22). The dependency is acyclic — graph-corpus-sdk depends only on graph-core + result, and oak-curriculum-sdk is its FIRST consumer (verified first-hand 2026-06-07: oak-curriculum-sdk has no graph-corpus-sdk dep today; graph-corpus-sdk→{graph-core,result}, graph-core→{result,type-helpers,jsonld,rdf-canonize}, no back-edge). New module src/mcp/eef/. Author the input-side D4-bound names: eefStrandIdSubset, eefObservedPhaseSubset, eefObservedKeyStageSubset, eefObservedPrioritySubset, and the input schema source eefToolInputSchemaSource (typed ONLY from EefStrandId + ObservedPhase/KeyStage/Priority + the `function` dispatch literal + selector optionality). The tool's structuredContent OUTPUT is the D5 EefEvidenceEnvelope returned directly by the c3 handler — there is NO MCP outputSchema and NO authored output schema source (the universal output-schema work is output-schemas-for-mcp-tools.plan.md's; envelope/provenance shaping for the agent lives in c3/c4, not in a Zod output schema). graph-corpus-sdk references import from the `@oaknational/graph-corpus-sdk/eef-strands` subpath (the root barrel exports only GraphView/Result; the EEF bindings + types live on the /eef-strands entry — src/eef-strands/index.ts:55-58). Add the EEF AGGREGATED_TOOL_DEFS entry shell — title 'EEF Evidence (Teaching and Learning Toolkit)', description per D3 §model-facing description, annotations { readOnlyHint: true }, _meta, AND `securitySchemes` (the AGGREGATED_TOOL_DEFS shape REQUIRES securitySchemes at definitions.ts:61; declare the SAME class as the other graph tools — NO special auth status for EEF, owner-confirmed 2026-06-06; confirm the exact value against get-misconception-graph's securitySchemes). PII (org instruction: no PII): EefEvidenceProvenance.source is the whole meta.source, which carries six named academic authors — the c4 open-decision (omit individual author names, keep org-level attribution) governs what the structuredContent envelope emits too; surface to owner at c1/c4 before emitting. The inputSchema raw-shape VALUE is filled in c2; the AGGREGATED_HANDLERS handler entry is added in c3 (the satisfies-guard at executor.ts:164 forces a handler for every AggregatedToolName, so c1+c2+c3 land together in the atomic commit). MUST NOT add MCP types to graph-corpus-sdk / graph-core (ADR-179 — the input SUBSETS stay downstream, typed FROM the view). graph-corpus-sdk MAY expose additive corpus-data runtime constants — the finite-domain `EEF_STRAND_IDS` / `OBSERVED_PHASES` / `OBSERVED_KEY_STAGES` / `OBSERVED_PRIORITIES` landed there 2026-06-07 (Hidden Prowling Owl), ADR-179-clean, which c2 enumerates via `z.enum`. (The earlier absolute "do not touch graph-corpus-sdk" reading was corrected owner-directed 2026-06-07: surfacing static corpus values as runtime constants is the obvious move, not a fork.) Red: a compile-time type test asserting eefToolInputSchemaSource's payload type covers the `function` dispatch literal + the selector fields (fails — values don't exist). Done when: input source typed only from finite domains; grep shows no @modelcontextprotocol/* in substrate; oak-curriculum-sdk/package.json declares graph-corpus-sdk as a runtime dependency. Proof: `pnpm --filter @oaknational/curriculum-sdk test && pnpm type-check`."
    status: pending
    depends_on: []
  - id: d6-c2-input-raw-shape-schema
    content: "oak-curriculum-sdk: define the EEF tool INPUT schema as a `z.ZodRawShape` — a record of field→Zod validator with `.describe()`/`.meta({ examples })`, EXACTLY like the family's SEARCH_INPUT_SCHEMA / BROWSE_INPUT_SCHEMA (NOT a `z.object(...)` value; the carrier field is `z.ZodRawShape` at definitions.ts:68, so a raw shape fits with NO widening — this is why c0 is gone). File src/mcp/eef/eef-schemas.ts, over eefToolInputSchemaSource. The raw shape: a `function` dispatch field (the two literals 'inspect-strand' | 'evidence-for-move') + the selector fields (strandId/strandIds, phase, keyStage, priority) typed from the finite observed domains, tied to the input payload type via `satisfies` per the SEARCH_INPUT_SCHEMA typing precedent (confirm the exact tie at execution; no `as` cast). There is NO output schema (dropped from D6): the handler returns structuredContent typed by the D5 EefEvidenceEnvelope, unvalidated at the MCP layer exactly like every aggregated graph tool. Red: unit test asserting the input raw shape enumerates the `function` literals + all 30 strand ids + the observed axis values, and that the membership predicate (`isValidStrandKey` etc.) rejects an out-of-vocabulary value at the boundary. Green: one raw-shape definition; selector fields `.optional()` per the EvidenceForMoveSelectors optionality (verified first-hand: all four selectors optional, eef-evidence.ts:59-64). Done when: exactly ONE EEF input schema definition exists; zero `z.` in graph-corpus-sdk/graph-core; NO MCP outputSchema anywhere in the EEF surface; NO `as` cast binding schema to payload. Proof: `pnpm --filter @oaknational/curriculum-sdk test && pnpm type-check`."
    status: pending
    depends_on: [d6-c1-eef-entry-subsets-schema-sources]
  - id: d6-c3-eef-handler-aggregated-family-peer
    content: "oak-curriculum-sdk: build the EEF execution handler as an AGGREGATED_HANDLERS entry — the family pattern, NOT a bespoke bypass. New file src/mcp/aggregated-eef-evidence.ts (parallel to aggregated-misconception-graph.ts): `runEefEvidenceTool(input): Promise<CallToolResult>` performing `function` dispatch over `inspect-strand` / `evidence-for-move`, calling the D5 bindings inspectStrand(strandId) / evidenceForMove(selectors) from `@oaknational/graph-corpus-sdk/eef-strands`; returns { content: [], structuredContent } on success and { isError: true, content: [...] } on a predicate failure. Register it in src/mcp/universal-tools/executor.ts AGGREGATED_HANDLERS (:164-176): `'get-eef-evidence': (input, deps) => runEefEvidenceTool(input)` — an input-taking aggregated handler exactly like handleSearchTool/handleBrowseTool (NOT a no-input whole-corpus dump like runMisconceptionGraphTool; EEF is the first graph tool in the bounded-query shape). The EEF tool now flows through the SAME path as every aggregated tool: handleToolWithAuthInterception → createUniversalToolExecutor → executeAggregatedTool → runEefEvidenceTool. There is NO discriminant branch in the app's registerTools loop, NO bypass of handleToolWithAuthInterception, NO app-side handler — the prior bypass shape is removed entirely. `content: []` is the HANDLER's chosen return shape (the owner-ratified V8 structuredContent-only deviation), returned directly rather than via formatToolResponse; it is not a formatter bypass. isError policy (D3 §137-154, owner-decided; a D6-LAYER predicate over the TOTAL D5 substrate which never errors): evidence-for-move with NO selector → isError: true (D3: 'an empty envelope would imply searched-and-found-none'); unknown strand key → isValidStrandKey fail at the string boundary → isError: true. MUST NOT touch: the app's registerTools loop EXECUTION routing (it stays byte-for-byte unchanged — the only app change is c6's flag co-gating; the `config` is unchanged, NO outputSchema added); register-resources.ts, register-prompts.ts (c6). Red (real corpus, SDK test): inspect-strand <known id> → envelope with edges: [] + populated frontier (single-member envelope per the D5 envelope contract), content: []; evidence-for-move { phase: <observed> } → axis-matched members; no-selector → isError; unknown key → isError naming the key; error results omit structuredContent. Done when: both functions resolve through the D5 bindings (no new graph logic); inspect-strand id ≡ evidence-for-move { strandIds: [id] } at cardinality one; NO sort/score/rank/weight/recommend in the handler (ADR-191 grep stop signal); content: [] success / isError errors; the AGGREGATED_HANDLERS Record satisfies its `Record<AggregatedToolName, AggregatedHandler>` type. Proof: `pnpm --filter @oaknational/curriculum-sdk test && pnpm type-check`."
    status: pending
    depends_on: [d6-c2-input-raw-shape-schema]
  - id: d6-c4-eef-interpretation-resource
    content: "EEF interpretation resource (URI eef://interpretation, MIME text/markdown), registered via PLAIN server.registerResource (NOT registerAppResource — it is not an MCP-App HTML surface). HOMING (corrected 2026-06-06): the content builder is domain logic that projects corpus VALUES → home it SDK-side following the existing graph-tool resource precedent (misconception-graph-resource.ts / prior-knowledge-graph-resource.ts), reading the corpus via the SDK's now-runtime graph-corpus-sdk dependency (added in c1); the app REGISTERS it (register-resources.ts) behind the flag in c6. Confirm the exact SDK-content / app-registration split against the misconception-graph-resource.ts precedent at execution (do not assume — ground it). Because the corpus dep is the SDK's (c1), c4 depends on c1, NOT on any app-side dependency; the prior c4→c3-for-the-app-dependency ordering is dissolved. Content builder projects the three D3-ratified labelled layers: (1) CORPUS-CITED — the corpus's own methodology (impact-measure derivation + interpretation guidance, cost scale, evidence-strength measure), corpus caveats (meta.caveats), source/licence/coverage (meta.source/meta.licence/meta.coverage). PII OPEN DECISION (owner; ORG INSTRUCTION: no PII; also governs the structuredContent envelope the c3 handler emits, since EefEvidenceProvenance.source is the whole meta.source): meta.source.original_authors carries six named academic authors — recommendation (and the org no-PII instruction's default) is to OMIT the individual author names and keep organisation-level attribution (meta.source name/url/organisation + meta.licence.attribution_note, which satisfies the licence's required EEF attribution without emitting personal names). Since there is no output schema, this is a handler/content-emission choice (c3 envelope + c4 resource), not a schema change; surface to the owner at c1/c4 before emitting. Also project the STRAND INDEX (id, name, headline.headline_summary, tags for all 30 strands — floor fields, 30/30); (2) AGENT-SIDE (tagged, never presented as corpus evidence) — the end goals (faithful evidence transmission; options not recommendations; preserving strength/cost/impact/caveats/limits), the Oak/EEF workflow, positive+negative worked examples, and how to read sparse curation honestly (school_context_relevance exists on 17/30 strands, so tag-absence is NOT inapplicability; coverage is 3-18 year-olds; the strand index, not axis filtering, is the discovery path); (3) GRAPH-STRUCTURAL (D4/D5-bound) — the ratified field names, edge types, provenance-envelope fields, and schema-subset names. MUST NOT touch: the tool file; the always-on resource registrations (the EEF resource is co-gated in c6). Red: payload cites a known strand's headline_summary + tags verbatim (all 30 present); contains meta.caveats verbatim; tags the agent-side layer distinctly; invents NO evidence vocabulary / caveat class / strand vocabulary absent from the corpus (ADR-191). Done when: verbatim corpus projections only; no fabricated ontology; no ranking/scoring. Proof: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` (+ the SDK test if the content builder is homed SDK-side)."
    status: pending
    depends_on: [d6-c1-eef-entry-subsets-schema-sources]
  - id: d6-c5-eef-prompt
    content: "The user-facing adapt-lesson prompt (the D3-ratified name — house style per find-lessons/lesson-planning/explore-curriculum; carries NO 'with-evidence' qualifier — evidence-grounding is how Oak adapts lessons, owner-directed 2026-06-03; do NOT invent an eef-* name). HOMING: the message builder is domain logic → home SDK-side following the existing prompt-message precedent (mcp-prompt-messages.ts); the app registers it (register-prompts.ts) behind the flag in c6. Confirm the SDK-content / app-registration split at execution. prompt def + argsSchema (args: topic, yearGroup) + message builder. The argsSchema Zod is MCP prompt-argument validation, precedented by the existing prompts (register-prompts.ts:101-115) and OUTSIDE the EEF tool input-schema rule (the EEF tool has one input raw-shape and no output schema — R4 confirmed against the live code). Message instructs: convert the user's free-form topic/yearGroup into finite EEF tool inputs at the boundary; preserve caveats/attribution; present evidence as options not selections (no teacher-replacing language; D1 non-claims). MUST NOT touch: the always-on PROMPT_REGISTRATIONS list (the EEF prompt is co-gated, wired in c6). Red: the prompt produces messages that name the Oak→EEF workflow, instruct the free-form→finite-input conversion, and instruct caveat/attribution preservation + options-not-selections. Done when: args topic/yearGroup; workflow-instruction message; no server-side selection language baked in (ADR-191). Proof: the workspace test where the message builder is homed."
    status: pending
    depends_on: []
  - id: d6-c6-flag-cogating-telemetry
    content: "App (@oaknational/oak-curriculum-mcp-streamable-http): co-gate all three primitives behind OAK_CURRICULUM_MCP_EEF_ENABLED, verify inherited telemetry, assert the ADR-179 boundary (the convergence boundary). The app's registerTools loop is UNCHANGED except for flag co-gating: no discriminant, no bypass, and NO outputSchema config change — the EEF tool registers through the identical `config` (`{ title, description, inputSchema, annotations }` at handlers.ts:173-178, verified first-hand; EEF is not a widget tool so it takes the `server.registerTool` branch at :183) and executes via the SDK's AGGREGATED_HANDLERS like every aggregated tool. ONE additive app change: flag co-gating — when !runtimeConfig.eefEnabled the loop SKIPS the EEF entry's registration and the resource/prompt are not registered; when enabled, all three register. The flag-skip identifies the EEF entry by a single named constant (a flag concern — the ONE legitimate name-key, not an execution-routing discriminant). For the MCP PROTOCOL listing there is no second filter: the SDK serves tools/list from its own _registeredTools map (mcp.js:67-70) and the app defines NO ListToolsRequestSchema handler (verified), so NOT registering the entry keeps it out of tools/list. listUniversalTools (SDK-static) always enumerates the EEF entry; the protocol-surface flag filter lives in the app's loop iteration. SECOND ENUMERATION SURFACE — the human-facing landing-page HTML (render-tools-section.ts:114 calls listUniversalTools directly) is OWNER-RELAXED for D6 (2026-06-06, low impact): NOT flag-gated, MAY show the EEF entry when off; it renders through the identical renderToolItem path (escapeHtml on all dynamic text) so WCAG 2.2 AA is inherited (org instruction: artefacts WCAG 2.2 AA — if any NEW landing markup is introduced rather than inheriting renderToolItem, run accessibility-expert); add it to AGGREGATED_TOOL_ORDER (render-tools-section.ts:23-31) or it sorts last; add a positive assertion that the entry renders. Telemetry: because the EEF tool registers + executes through the shared loop on the Sentry-wrapped server (wrapMcpServerWithSentry at core-endpoints.ts:98), it AUTOMATICALLY inherits the native per-call span (mcp.tool.name=get-eef-evidence) and the loop's setTag('mcp.tool_name', tool.name) at handlers.ts:160 — NO bespoke span/telemetry; no captureException for isError validation rejections (expected agent-input mistakes; noise). Red: flag ON — the registerTool spy is called for the EEF tool with the uniform config (NO outputSchema), and the resource + prompt spies fire; flag OFF — the registerTool spy is NOT called for the EEF tool and the resource/prompt spies do not fire (co-gating total); the EEF tool is present in listUniversalTools(...) regardless of flag (first-class enumeration); runtime — the tool returns structuredContent (content: []) on success and isError on a predicate failure; the loop's setTag spy fires for the EEF tool. Reconcile src/handlers-tool-registration.integration.test.ts: its assertions that iterate listUniversalTools(generatedToolRegistry) and assert EVERY entry was registerTool-ed break once the EEF entry is enumerated SDK-side but co-gated off by the default test config (createMockRuntimeConfig → eefEnabled:false) — make them flag-aware (exclude the co-gated EEF tool under flag-off; assert its presence only under eefEnabled:true). Append an Update-Log entry to .agent/plans/observability/what-the-system-emits-today.md (eef registration file:line + this test id + date) in the SAME commit. Done when: flag on → all three register, tool executes returning structuredContent-only content:[], errors isError; flag off → none registered and none in tools/list; co-gating total; substrate imports no MCP types (grep / repo-validators); EEF invocation observable via the inherited span + tag; Update-Log appended. Proof: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` + `pnpm type-check`."
    status: pending
    depends_on: [d6-c3-eef-handler-aggregated-family-peer, d6-c4-eef-interpretation-resource, d6-c5-eef-prompt]
---

# EEF D6 execution — EEF as the first graph tool on the new substrate

> **Ready to execute (`c1`–`c6`; no `c0`).** `get-eef-evidence` is an aggregated
> graph-tool-family peer — an `AGGREGATED_HANDLERS` entry SDK-side, registered and
> executed uniformly, with uniform auth (`securitySchemes`), a runtime
> `graph-corpus-sdk` dependency, a **raw-shape input** (`z.ZodRawShape`, like the
> family) and `structuredContent` output with **NO MCP `outputSchema`** and **no
> carrier change** (owner-ratified 2026-06-06; the universal output-schema work is
> `output-schemas-for-mcp-tools.plan.md`'s). Pre-execution gate **G0** runs first;
> per-cycle readiness reviewers (code/type/test/mcp-expert by substance) run during
> execution. The EEF surface registers **only** behind
> `OAK_CURRICULUM_MCP_EEF_ENABLED` (default OFF). Next EEF step after D6 is **D7**
> (teacher-value round-trip). The design history lives in the handoff note and the
> experience corpus, not here.

## Context

D0–D5 of the EEF graph tool are complete and owner-ratified; D5 landed
2026-06-05 (commit `2e9021ff`), building the graph-native EEF view on the new
`graph-core` + `graph-corpus-sdk` substrate. **EEF is the first graph MCP tool
on that substrate.** The existing graph tools (`get-misconception-graph`,
`get-prior-knowledge-graph`) are slated to migrate onto the same substrate, and
further graph tools are planned (`graph-tools-value-redesign.plan.md`); the
generic graph-tool factory is consolidated at the second such consumer
(`consolidate-at-third-consumer`), not now. The master plan
([`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md) §D6)
carries the D6 deliverable spec; this plan adds the ordered, atomic TDD-cycle
decomposition. It does **not** re-open D3
([`eef-d3-mcp-contract.md`](eef-d3-mcp-contract.md)) or D4
([`eef-d4-graph-capability-contract.md`](eef-d4-graph-capability-contract.md)).

## Landing discipline (one docs commit, then one atomic code commit)

The contract reshape (this plan + D3 + master + output-schemas, to the
no-output-schema shape) lands first as **one docs commit**. The code then lands
as **one green commit** — `c1`+`c2`+`c3`+`c4`+`c5`+`c6` (cross-package,
**atomic**): adding `get-eef-evidence` to `AggregatedToolName` forces, in one
compile, the `AGGREGATED_TOOL_DEFS` entry (`c1`), its input raw-shape schema
(`c2`), AND its `AGGREGATED_HANDLERS` handler (`c3`, the
`Record<AggregatedToolName, AggregatedHandler>` guard at `executor.ts:164`) —
plus the app's flag co-gating (`c6`) so the entry is never registered ungated and
the app integration test stays green. Cross-package compilation is live because
both packages expose a `development` export condition over source and
`tsconfig.base.json` sets `customConditions: ['development']` (a FOCUSED app
type-check resolves SDK types via built `dist`, so run `pnpm --filter
@oaknational/curriculum-sdk build` before one; the full gate builds deps in order).

The cycles are **authoring checkpoints** (each authored test-first, brought green
during development); the **commit boundary** is after `c6`.

## End goal, mechanism, means

- **End goal:** a teacher's assistant can, behind a flag, retrieve the EEF
  Toolkit's evidence for a named pedagogical move — strength, cost, impact,
  caveats, attribution intact — as deterministic facts the agent reasons over
  (ADR-191), to adapt Oak material as evidence-calibrated options.
- **Mechanism:** expose the D5 graph-native EEF view as a first-class aggregated
  graph-tool (`get-eef-evidence`) — an `AGGREGATED_HANDLERS` peer carrying a single
  raw-shape input schema and returning `structuredContent` (no MCP `outputSchema`,
  uniform with the family) — plus the `eef-interpretation` resource and the
  `adapt-lesson` prompt, all co-gated behind `OAK_CURRICULUM_MCP_EEF_ENABLED`.
- **Means:** the six cycles below (`c1`–`c6`) plus the `G0` pre-execution gate.

## Authoritative references (read before executing; do not duplicate here)

- Master plan §D6 — `eef-graph-tool-completion.plan.md` (Do / Done-when / Proof).
- D3 MCP contract — `eef-d3-mcp-contract.md` (§Family: same family as
  get-misconception-graph / get-prior-knowledge-graph, registers through the
  universal-tools path; §the tool; §SDK/app verification record V1–V8;
  §the schema rule; §`isError` semantics lines 137-154; §the eight subsets).
- D4 graph capability contract — `eef-d4-graph-capability-contract.md`.
- D5 execution record — `eef-d5-execution.plan.md` (the substrate this consumes).
- **The execution surface (a tool plan must reference where its family executes,
  not only registration/schema):**
  `oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` (`AGGREGATED_HANDLERS`
  :164-176, `createUniversalToolExecutor` :213-230);
  `oak-curriculum-sdk/src/mcp/aggregated-misconception-graph.ts` (the local-data
  graph-tool precedent); `apps/.../src/tool-handler-with-auth.ts` and
  `tool-auth-checker.ts` (the uniform auth path).
- `graph-tools-value-redesign.plan.md` (the graph-tool family migration; EEF is
  its substrate pathfinder; factory consolidation at the second consumer).
- ADR-191 (deterministic surface; no server-side ranking/scoring), ADR-179 (no
  MCP types in substrate), ADR-141 (MCP Apps `_meta`).
- `output-schemas-for-mcp-tools.plan.md` (owns output schemas UNIVERSALLY —
  required for every tool; EEF D6 lands NO output schema and NO carrier change).

## Grounded facts inherited (re-verified first-hand 2026-06-06)

| Fact | Verdict | Evidence |
|---|---|---|
| Aggregated tools dispatch via `AGGREGATED_HANDLERS`; generated tools via `executeMcpTool` (the API). Four aggregated tools execute from LOCAL data with no API call | HOLDS | `oak-curriculum-sdk/src/mcp/universal-tools/executor.ts:164-176,223-228` |
| `get-misconception-graph` is the homing precedent: local data, SDK-side, returns `structuredContent` | HOLDS | `aggregated-misconception-graph.ts:22-23,82-84` (data from `@oaknational/sdk-codegen/vocab-data`) |
| Auth is data-driven from `securitySchemes` (deny-by-default); no per-tool special status | HOLDS | `apps/.../src/tool-auth-checker.ts:57-71` |
| `oak-curriculum-sdk → graph-corpus-sdk` is acyclic; the SDK is graph-corpus-sdk's first consumer | HOLDS | `graph-corpus-sdk/package.json` (deps: graph-core, result only); no consumer today |
| D5 substrate exports `inspectStrand` / `evidenceForMove` / `EefEvidenceEnvelope` on the `/eef-strands` subpath | HOLDS | `graph-corpus-sdk/src/eef-strands/eef-evidence.ts:51,123,159`; `eef-strands/index.ts:55-58`; root barrel exports only GraphView/Result |
| `UniversalToolListEntry.inputSchema` is `z.ZodRawShape`; `AggregatedToolDefShape.inputSchema` likewise (:68); no `outputSchema?` today; satisfies-guard at :149 | HOLDS | `oak-curriculum-sdk/src/mcp/universal-tools/types.ts:135`, `definitions.ts:68,149` |
| 11 aggregated tools today; no `get-eef-evidence` | HOLDS | `definitions.ts:104-149` |
| Flag pre-wired, default OFF; D6 wires the consumption | HOLDS | `apps/.../src/env.ts:40-47`; `runtime-config-from-validated-env.ts:39`; `eefEnabled:false` across test configs |
| SDK 1.29.0 `registerTool` accepts a `z.object` directly | HOLDS | installed `@modelcontextprotocol/sdk/dist/esm/server/mcp.d.ts:150-154` |
| `impact_months` is `number \| null`, carries `-2` (eef-tl-repeating-a-year) and `0` (eef-tl-setting-and-streaming); `number_of_studies` truly-optional | HOLDS | `graph-corpus-sdk/src/eef-strands/eef-toolkit.external-data.ts` (null×4, -2×1, 0×1) |
| `evidence-for-move` no-selector → `isError`; unknown key → `isError` | HOLDS (contract) | D3:137-154 — a D6-layer predicate over the total D5 substrate |

Versions installed (re-confirm at G0): SDK `1.29.0`, `@modelcontextprotocol/ext-apps`
`1.7.3`, `zod` `4.4.3`.

## Key design decisions (D6-owned)

1. **Aggregated graph-tool-family peer, not a special case.** `get-eef-evidence`
   is added to `AggregatedToolName` / `AGGREGATED_TOOL_DEFS` / `AGGREGATED_HANDLERS`
   and registers + executes through the SAME path as every aggregated tool. No
   discriminant branch, no bypass, no app-side handler.
2. **Homing SDK-side (corrected).** The handler, the two schemas, and the
   resource/prompt content builders live in `oak-curriculum-sdk/src/mcp/`
   (Layer Role Topology); `oak-curriculum-sdk` takes a **runtime** dependency on
   `graph-corpus-sdk` (acyclic). The app owns only registration and flag co-gating
   (no `outputSchema`-config change — the EEF tool uses the identical `config` as
   every aggregated tool).
3. **Uniform auth (no special status).** The EEF entry declares `securitySchemes`
   like every aggregated tool; the auth handler is unchanged and uniform.
4. **Bounded-query shape.** EEF is the first graph tool built input-taking
   (`handleSearchTool`-shaped), the target the whole-corpus-dump tools migrate to.
5. **One raw-shape input schema** (a `z.ZodRawShape` record like the family's
   `SEARCH_INPUT_SCHEMA`), tied to its payload by `satisfies`; **no MCP
   `outputSchema`** — the tool returns the D5 envelope as `structuredContent`,
   unvalidated at the protocol layer, uniform with every aggregated graph tool;
   universal output schemas are `output-schemas-for-mcp-tools.plan.md`'s work.
6. **`isError` is a D6-layer dispatch predicate** over the total D5 substrate
   (D3-decided).
7. **Telemetry is inherited**, not bespoke (the uniform Sentry-wrapped path +
   shared-loop `setTag`).

## Workstreams and cycles

See the frontmatter `todos` for the full per-cycle spec. Summary:

- **G0 (gate, before `c1`)** — re-confirm the V1–V8 input/registration anchors
  against the then-installed SDK/ext-apps; STOP if any version drifted from
  `sdk@1.29.0` / `ext-apps@1.7.3` / `zod@4.4.3`.
- **`c1`** — EEF aggregated-tool entry + the runtime `graph-corpus-sdk`
  dependency + `securitySchemes` + the input subsets + the input schema source (SDK).
- **`c2`** — the input raw-shape schema (a `z.ZodRawShape` record like the
  family) + `satisfies`; no output schema.
- **`c3`** — the EEF handler as an `AGGREGATED_HANDLERS` peer (SDK), no bypass.
- **`c4`** — `eef-interpretation` resource (content SDK-side; registered app-side).
- **`c5`** — `adapt-lesson` prompt (message SDK-side; registered app-side).
- **`c6`** — flag co-gating + telemetry inheritance + ADR-179 check (convergence;
  the atomic commit boundary).

### Dependency / parallelism (authoring order; landing per §Landing discipline)

```text
  one atomic cross-package commit (after the docs-reshape commit):
    serial spine:   c1 -> c2 -> c3 -> c6
    c1 -> c4        (resource reads the corpus via the SDK's c1 dependency)
    independent:    c5 -> c6   (prompt)
```

`c4` depends on `c1` (the SDK's runtime corpus dependency), not on an app
dependency.

## Quality gates

Per-cycle: the focused workspace `test` + `type-check` named in each todo's
proof (run `pnpm --filter @oaknational/curriculum-sdk build` before a focused APP
type-check — the app resolves SDK types via built `dist`). See [`../../../templates/components/quality-gates.md`](../../../templates/components/quality-gates.md).
Before the atomic code commit: the D6 integration proof
`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` plus the SDK
test, and the aggregate `pnpm check` green on a settled tree.

## Acceptance / proof contract

Proof level **integration**; command
`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` + the SDK
test. D6 is complete only when: the input raw-shape schema exists (a
`z.ZodRawShape` record, `satisfies`-tied, no `as`) and there is NO MCP
`outputSchema` on the EEF surface; `get-eef-evidence` is a first-class
aggregated-tool entry enumerated by `listUniversalTools`, executed via its
`AGGREGATED_HANDLERS` entry (no bypass, no discriminant, no special auth),
registered through the uniform `config`; flag co-gating of tool+resource+prompt is
total in both states; no MCP types in substrate; no server-side ranking/scoring;
EEF invocation observable via inherited telemetry; the Update-Log entry is
appended; `pnpm check` green. Per the master plan: **D6 is not complete until the
single-Zod-call graph-subset input rule is implemented exactly.**

## Prerequisite classification

- D4 + D5 (`blocking`) — complete and landed.
- The contract reshape (this plan + D3 + master + output-schemas, to the
  no-output-schema shape) (`blocking` for execution) — lands first as one docs
  commit.
- The universal output-schema work (`beneficial`, NOT blocking) — owned by
  `output-schemas-for-mcp-tools.plan.md`; EEF gains an output schema there, later,
  with every other tool. Minimum shippable shape without it: the EEF tool returns
  `structuredContent` with no MCP `outputSchema`, uniform with the rest of its
  family (exactly D6's shape).

## Non-goals (YAGNI)

No generic graph-tool factory (consolidated at the second graph-tool consumer per
`graph-tools-value-redesign.plan.md`, not D6); no re-opening D3/D4; no D7
teacher-value round-trip; **no EEF `outputSchema` and no shared-carrier / `c0`
change** (the universal output-schema work — including EEF's eventual output
schema — is `output-schemas-for-mcp-tools.plan.md`'s); no change to existing
aggregated/generated tools' behaviour; no migration of the existing graph tools
onto the substrate (the redesign plan owns that).

## Risk assessment

- **R1 (registration/execution path) — DISSOLVED.** There is no special path: the
  EEF tool uses the established aggregated-tool registration + execution. The
  prior discriminant-branch risk no longer exists; the carrier widening (`c0`) and
  the `registerTool`/`registerAppTool` divergence are gone with the output-schema
  drop (the input is a raw shape that fits the existing carrier).
- **R6 (enumerated ≠ registered).** `listUniversalTools` always enumerates the
  co-gated EEF entry while the loop registers it only when the flag is on, so
  `handlers-tool-registration.integration.test.ts` must be made flag-aware —
  reconciled in `c6`.
- **Cross-package atomic commit.** Mitigated by authoring order and the single
  atomic commit; for a FOCUSED app type-check, build the SDK first
  (`pnpm --filter @oaknational/curriculum-sdk build`) — the app resolves SDK types
  via built `dist`; the full `pnpm check` builds deps in order.
- **Per-cycle readiness review.** Run code/type/test/mcp-expert by substance
  during execution, grounding every finding first-hand; close with an adversarial
  review of the assembled diff.

## Foundation alignment

`principles.md` (§Layer Role Topology — domain logic lives in the SDK; §Decompose
at the Tension — the handler is homed where its family executes; schema-first,
replace-don't-bridge, no special cases, YAGNI), `testing-strategy.md` (TDD
cycles, real-corpus tests), `schema-first-execution.md`, ADR-191, ADR-179,
ADR-141, the D3 contract (§Family, the schema rule, `isError`), the D4 contract.

## Plan-body first-principles check

Fires per [`../../../../rules/plan-body-first-principles-check.md`](../../../../rules/plan-body-first-principles-check.md):
**shape** — the aggregated-tool-family architecture is the established pattern
(verified first-hand against `executor.ts` + the misconception precedent) and the
owner-ratified correction of the prior bypass. **landing-path** — one
docs-reshape commit, then one cross-package atomic code commit, each ending
all-tests-green. **vendor-literal** — the SDK `registerTool` signature, the
`config` shape (no `outputSchema`), and the `AGGREGATED_HANDLERS` dispatch were
verified first-hand; G0 re-confirms the V1–V8 anchors at execution time.

## Readiness reviewers

The architecture is owner-ratified, and the output-schema drop strictly simplifies
it (the prior readiness review GO'd the more-complex output-schema shape; this
shape removes `c0`, the carrier change, and the output-schema type concerns).
Per-cycle readiness reviewers run during execution, grounded first-hand, plus a
final adversarial review of the assembled diff:

- **mcp-expert** — the aggregated-tool-family registration + execution is
  contract-faithful (D3 §Family); the co-gating is sound.
- **architecture-expert-fred** — the SDK-side homing + the runtime
  `graph-corpus-sdk` dependency (Layer Role Topology; acyclic).
- **type-expert** — the `AGGREGATED_HANDLERS` Record typing and the input
  raw-shape `satisfies` tie (no carrier widening, no output-schema concern).

## Learning loop & lifecycle triggers

On D6 completion: run the consolidation workflow (`oak-consolidate-docs`); flip
the master plan `d6-mcp-composition-eef-surface` todo to `completed`; update
`eef.next-session.md` to point at D7; the durable lessons (EEF is an
aggregated-tool-family peer; **plans must reference the execution surface, not
just registration/schema**) route to `seam-map-plan-template-archetype.plan.md`
and the experience corpus, not re-derived here. Lifecycle triggers per
[`../../../templates/components/lifecycle-triggers.md`](../../../templates/components/lifecycle-triggers.md).
