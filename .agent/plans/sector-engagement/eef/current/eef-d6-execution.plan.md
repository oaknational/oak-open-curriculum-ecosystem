---
title: "EEF D6 execution — MCP composition: first-class EEF tool + resource + prompt (TDD cycles)"
status: current
lane: current
type: executable
thread: eef
date: 2026-06-06
owner_scope: >-
  Executable, cycle-level elaboration of the D6 deliverable in
  eef-graph-tool-completion.plan.md (§D6). Builds the EEF MCP composition as a
  FIRST-CLASS universal-tools entry (D3 §Family / §"the registry carries one
  entry … exactly like every other aggregated tool" — registered through the
  universal-tools path, NOT a bespoke bypass), plus the interpretation resource
  and the user-facing prompt, all co-gated behind OAK_CURRICULUM_MCP_EEF_ENABLED
  with structuredContent-only tool results. Does NOT re-open the owner-ratified
  D3 MCP contract or D4 graph capability contract: the surface names, the eight
  subsets, the two single-Zod-call schema-source values, the isError semantics,
  and ADR-191 governance are settled. Adds the one layer the deliverable spec
  leaves open — the ordered, atomic TDD-cycle decomposition with per-cycle
  files, acceptance, and deterministic validation. Authored by Dusky Dimming
  Candle (claude/Opus 4.8); dual-reviewed before execution (mcp-expert,
  architecture-expert-fred, type-expert, assumptions-expert, sentry-expert) +
  mcp-expert re-confirmation after the BLOCK fix (see Readiness reviewers /
  Review disposition).
readiness: >-
  DECISION-COMPLETE — dual-reviewed and re-confirmed (BLOCK resolved). Ready for
  execution; NOT yet executed. Pre-execution gate G0 (re-run V1–V8 against the
  then-installed SDK/ext-apps) runs first.
todos:
  - id: d6-c0-sdk-universal-tools-output-schema-seam
    content: "oak-curriculum-sdk (@oaknational/curriculum-sdk): make the universal-tools descriptor surface able to carry an output schema and accept a z.object value for inputSchema, so the EEF tool registers through the universal-tools path with no `as` cast (Sharp Edge #2; S0 seam first use per output-schemas-for-mcp-tools.plan.md §Resolved Sequencing — additive, generated/aggregated tools unchanged; Sharp Edge #4). UNCONDITIONAL (D3 mandates the first-class path). Files: src/mcp/universal-tools/types.ts — widen `UniversalToolListEntry.inputSchema` (today `z.ZodRawShape` at :135) to `ZodRawShapeCompat | AnySchema` (the SDK-aligned carrier, imported from @modelcontextprotocol/sdk server/zod-compat — type-expert C2) and ADD optional `outputSchema?: AnySchema` (output schemas are always constructed z.object values, never raw shapes — type-expert Warning 3); src/mcp/universal-tools/definitions.ts — widen `AggregatedToolDefShape.inputSchema` (:68) in lock-step and add optional `outputSchema?` (type-expert C3 — without this the EEF AGGREGATED_TOOL_DEFS entry breaks the `as const satisfies Record<AggregatedToolName, AggregatedToolDefShape>` guard at :149); src/mcp/universal-tools/list-tools.ts — forward `outputSchema` when present; *.unit.test.ts beside them. MUST NOT touch: existing AGGREGATED_TOOL_DEFS entry VALUES (the EEF entry is added in c1); the codegen package; the optional→required promotion (output-schemas plan owns it — outputSchema stays OPTIONAL in D6). Carrier reconciliation: record that the widened union is the carrier S0 inherits, superseding output-schemas S0.1's 'REQUIRED z.ZodRawShape' line; coordinate the field-shape (not just the active-claim) with the output-schemas plan owner. Red: a types/list-tools unit test constructs an entry with a z.object(...) inputSchema AND an outputSchema, asserts it type-checks with NO `as` cast and forwards unchanged (fails today). Done when: a z.object value assigns to inputSchema with no cast; outputSchema is optional/additive; the 11 aggregated + all generated tools compile and register unchanged; the definitions.ts satisfies-guard holds. Proof: `pnpm --filter @oaknational/curriculum-sdk test && pnpm type-check`. Coordinate: register an active claim on universal-tools/ before editing (co-owned with output-schemas-for-mcp-tools.plan.md)."
    status: pending
    depends_on: []
  - id: d6-c1-eef-entry-subsets-schema-sources
    content: "oak-curriculum-sdk: define the first-class EEF tool entry + the eight named subsets + the two schema-source values as type-level projections (NO Zod yet). New module src/mcp/eef/. Add `get-eef-evidence` to the `AggregatedToolName` union (the D3-ratified machine name; do NOT invent). Author the eight D4-bound names: eefStrandIdSubset, eefObservedPhaseSubset, eefObservedKeyStageSubset, eefObservedPrioritySubset, eefEvidenceEnvelopeSubset (member payload + edges + frontier), eefProvenanceSubset (meta.source/licence/caveats), and the two source values — eefToolInputSchemaSource (typed ONLY from EefStrandId + ObservedPhase/KeyStage/Priority + the `function` dispatch literal + selector optionality) and eefToolOutputSchemaSource (typed ONLY from the envelope/provenance types). All graph-corpus-sdk references use `import type` (TYPE-ONLY — the SDK gains NO runtime dependency on graph-corpus-sdk and no corpus bloat for SDK consumers). Add the EEF AGGREGATED_TOOL_DEFS entry shell (title 'EEF Evidence (Teaching and Learning Toolkit)', description per D3 §model-facing description, annotations { readOnlyHint: true }, _meta) — the inputSchema/outputSchema VALUES are filled in c2/c3. MUST NOT touch: graph-corpus-sdk / graph-core (ADR-179 — subsets typed FROM the view, defined downstream); no RUNTIME graph-corpus-sdk import in the SDK. Red: a compile-time type test asserting eefToolOutputSchemaSource's payload type is assignable from a real EefEvidenceEnvelope value (fails — values don't exist). Done when: input source typed only from finite domains; output source only from envelope/provenance; data-supports-shape verified against the real corpus (R5: headline.impact_months is `number | null`, carries -2 on eef-tl-repeating-a-year and 0 on eef-tl-setting-and-streaming — z.nullable(z.number()), NO .min/.nonnegative, NEVER .optional; number_of_studies truly-absent on most strands → .optional(), not null); grep shows no @modelcontextprotocol/* in substrate and no runtime graph-corpus-sdk import in the SDK (only `import type`). Proof: `pnpm --filter @oaknational/curriculum-sdk test && pnpm type-check`."
    status: pending
    depends_on: []
  - id: d6-c2-two-zod-schemas-satisfies-equality
    content: "oak-curriculum-sdk: derive inputSchema and outputSchema by ONE z.object(...) call each over the two source values, each tied to its payload type by `satisfies` AND an expectTypeOf equality assertion. File src/mcp/eef/eef-schemas.ts — the ONLY Zod in the entire EEF graph stack (D3 Decision 2). Red: unit test asserting (a) inputSchema root serialises to `type: object` and enumerates all 30 strand ids + the observed axis values; (b) outputSchema root `type: object`; (c) outputSchema accepts a real inspectStrand(<known id>) envelope and rejects an envelope missing a required floor field; (d) outputSchema accepts impact_months null / -2 / 0 and REJECTS impact_months absent (required-but-nullable); PLUS expectTypeOf(z.infer<typeof outputSchema>).toEqualTypeOf<EefEvidenceEnvelope>() (type-expert C1 — `satisfies z.ZodType<T>` proves SUBTYPE only; the expectTypeOf equality catches drift in BOTH directions). Green: two single z.object(...) calls, each `... satisfies z.ZodType<Payload>` (payload via `import type`); impact_months z.nullable(z.number()) with no min/nonnegative, never optional; number_of_studies .optional(); non-floor member fields .optional() per the graph-native view optionality. Done when: exactly TWO z.object( calls exist in the EEF stack (grep == 2); zero `z.` in graph-corpus-sdk/graph-core; both roots `type: object` (via z.toJSONSchema); the satisfies + expectTypeOf tie makes schema↔payload drift a type error; NO `as` cast binding schema to payload. Proof: `pnpm --filter @oaknational/curriculum-sdk test && pnpm type-check`."
    status: pending
    depends_on: [d6-c1-eef-entry-subsets-schema-sources]
  - id: d6-c3-eef-handler-and-shared-loop-discriminant
    content: "App (@oaknational/oak-curriculum-mcp-streamable-http): build the EEF local-projection dispatch handler and the bounded discriminant branch in the shared registration loop. Add `@oaknational/graph-corpus-sdk: workspace:*` to the app's package.json (ADDITIVE — the app does NOT depend on it today; VERIFIED). New file src/eef/eef-tool-handler.ts — the dispatch handler: `function` dispatch over `inspect-strand` / `evidence-for-move`, calling the D5 bindings inspectStrand(strandId)/evidenceForMove(selectors) from graph-corpus-sdk; returns { content: [], structuredContent } on success and { isError: true, content: [...] } on a predicate failure. Edit src/handlers.ts registerTools (152-186): add a typed discriminant branch — when the iterated entry is the EEF local-projection kind, route to the EEF handler (BYPASSING handleToolWithAuthInterception + the API executor + formatToolResponse's 2-item content shape) and assemble config WITH outputSchema; existing entries' branch (the auth-intercepted API path) stays byte-for-byte unchanged. isError policy (D3 §137-154, owner-decided; a D6-LAYER predicate over the TOTAL D5 substrate which never errors): evidence-for-move with NO selector → isError: true (D3: rejection over an empty result — 'an empty envelope would imply searched-and-found-none'); unknown strand key → isValidStrandKey fail at the string boundary → isError: true. MUST NOT touch: register-resources.ts, register-prompts.ts (wired in c6). Red (real corpus): inspect-strand <known id> → envelope with edges: [] + populated frontier (single-member envelope per the D5 envelope contract), content: []; evidence-for-move { phase: <observed> } → axis-matched members; no-selector → isError; unknown key → isError naming the key; error results omit structuredContent; a regression assertion that an existing aggregated tool's registration path is unchanged. Done when: both functions resolve through the D5 bindings (no new graph logic); inspect-strand id ≡ evidence-for-move { strandIds: [id] } at cardinality one; NO sort/score/rank/weight/recommend in the handler (ADR-191 grep stop signal); content: [] success / isError errors. Record the content: [] MCP SHOULD-deviation (the spec SHOULD also return serialised JSON in a TextContent block; content: [] is the owner-ratified V8 deviation — hosts reading only content see nothing; conscious, not a defect). Proof: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`."
    status: pending
    depends_on: [d6-c2-two-zod-schemas-satisfies-equality]
  - id: d6-c4-eef-interpretation-resource
    content: "App: build the static eef-interpretation resource (URI eef://interpretation, MIME text/markdown), registered via PLAIN server.registerResource (NOT registerAppResource — it is not an MCP-App HTML surface). New file src/eef/eef-interpretation-resource.ts. Content builder projects the three D3-ratified labelled layers: (1) CORPUS-CITED — the corpus's own methodology (impact-measure derivation + interpretation guidance, cost scale, evidence-strength measure), corpus caveats (meta.caveats), source/licence/coverage (meta.source/meta.licence/meta.coverage), and the STRAND INDEX (id, name, headline.headline_summary, tags for all 30 strands — floor fields, 30/30, a deterministic ~7KB projection carrying the impact-for-cost one-liner per strand); (2) AGENT-SIDE (tagged, never presented as corpus evidence) — the end goals (faithful evidence transmission; options not recommendations; preserving strength/cost/impact/caveats/limits), how to reach them through the Oak/EEF workflow, positive+negative worked examples of faithful vs unfaithful evidence use, and how to read sparse curation honestly (school_context_relevance exists on 17/30 strands, so tag-absence is NOT inapplicability; coverage is 3-18 year-olds; the strand index, not axis filtering, is the discovery path); (3) GRAPH-STRUCTURAL (D4/D5-bound) — the ratified field names, edge types, provenance-envelope fields, and schema-subset names so the agent can navigate returned envelopes. MUST NOT touch: the tool file; register-resources.ts (wired in c6). Red: payload cites a known strand's headline_summary + tags verbatim from the corpus (all 30 present); contains meta.caveats verbatim; tags the agent-side layer distinctly; invents NO evidence vocabulary / caveat class / strand vocabulary absent from the corpus (ADR-191). Done when: verbatim corpus projections only; no fabricated ontology; no ranking/scoring. Proof: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`."
    status: pending
    depends_on: [d6-c1-eef-entry-subsets-schema-sources]
  - id: d6-c5-eef-prompt
    content: "App: build the user-facing adapt-lesson prompt (the D3-ratified name — house style per find-lessons/lesson-planning/explore-curriculum; carries NO 'with-evidence' qualifier — evidence-grounding is how Oak adapts lessons, owner-directed 2026-06-03; do NOT invent an eef-* name). New file src/eef/eef-prompt.ts — prompt def + argsSchema (args: topic, yearGroup) + message builder. The argsSchema Zod is MCP prompt-argument validation, precedented by the existing prompts (register-prompts.ts:101-115) and OUTSIDE the 'only two Zod schemas in the EEF graph stack' rule (which scopes to the tool input/output — R4 confirmed against the live code). Message instructs: convert the user's free-form topic/yearGroup into finite EEF tool inputs at the boundary; preserve caveats/attribution; present evidence as options not selections (no teacher-replacing language; D1 non-claims). MUST NOT touch: the always-on PROMPT_REGISTRATIONS list (the EEF prompt is co-gated, wired in c6). Red: the prompt produces messages that name the Oak→EEF workflow, instruct the free-form→finite-input conversion, and instruct caveat/attribution preservation + options-not-selections. Done when: args topic/yearGroup; workflow-instruction message; no server-side selection language baked in (ADR-191). Proof: `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`."
    status: pending
    depends_on: []
  - id: d6-c6-flag-cogating-listing-registration-telemetry
    content: "App: co-gate all three primitives behind OAK_CURRICULUM_MCP_EEF_ENABLED, verify inherited telemetry, assert the ADR-179 boundary (the convergence + commit boundary). A SINGLE flag-gated act: when !runtimeConfig.eefEnabled the app SKIPS the EEF entry's iteration in the registerTools loop (so it is never registerTool-ed on the server) and does not register the resource/prompt; when enabled, all three register. There is NO second listing surface to filter — the SDK serves tools/list from its own _registeredTools map (mcp.js:67-70) and the app defines NO ListToolsRequestSchema handler (verified), so NOT registering the entry is what keeps it out of the listing. listUniversalTools (SDK-static) always enumerates the EEF entry; the flag filter lives in the app's loop iteration. One call site for the resource + prompt co-gating inside registerHandlers (after registerPrompts). Telemetry (Sharp Edge #5 — SIMPLIFIED): because the EEF tool registers through the shared loop on the Sentry-wrapped server (wrapMcpServerWithSentry at core-endpoints.ts:98, before registerHandlers), it AUTOMATICALLY inherits (a) the native per-call span (mcp.tool.name=get-eef-evidence, mcp.tool.result.is_error) and (b) the loop's setTag('mcp.tool_name', tool.name) at handlers.ts:160. NO bespoke span/telemetry code (a manual span would be a redundant synthetic span — wrong). Do NOT captureException for isError validation rejections (expected agent-input mistakes; noise). Resource + prompt are auto-instrumented by the same wrap. Red: flag-INDEPENDENT — assert the EEF entry is present in listUniversalTools(...) output (proves first-class enumeration, NOT a bypass — the anti-regression guard against the original BLOCK); flag ON — the registerTool spy is called for the EEF tool with an object-rooted outputSchema, and the resource + prompt spies fire; flag OFF — the registerTool spy is NOT called for the EEF tool and the resource/prompt spies do not fire (co-gating total); runtime — malformed structuredContent rejected, isError skips output validation; the loop's setTag spy fires for the EEF tool (the inherited mechanism — NOT a native-span assertion the recording harness cannot make). Append an Update-Log entry to .agent/plans/observability/what-the-system-emits-today.md (eef registration file:line + this test id + date) in the SAME commit — the Engineering/MCP cell is already populated, so the empty→populated trigger does not fire. Done when (maps to master plan §D6 'Done when'): flag on → all three register, outputSchema reaches the real register call (spy-verified), tool executes returning structuredContent-only content:[], errors isError; flag off → none registered and none in tools/list; co-gating total (single flag decision); substrate imports no MCP types (grep / repo-validators); EEF invocation observable via the inherited span + tag; Update-Log appended. Proof (the D6 integration proof): `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` + `pnpm type-check`."
    status: pending
    depends_on: [d6-c3-eef-handler-and-shared-loop-discriminant, d6-c4-eef-interpretation-resource, d6-c5-eef-prompt]
---

# EEF D6 execution — MCP composition: first-class EEF tool + resource + prompt

> **DECISION-COMPLETE, dual-reviewed (see Readiness reviewers). NOT yet
> executed.** Pre-execution gate **G0** runs first (re-run V1–V8 against the
> then-installed SDK/ext-apps). The EEF surface registers **only** behind
> `OAK_CURRICULUM_MCP_EEF_ENABLED` (default OFF). Next EEF step after D6 is
> **D7** (teacher-value round-trip).

## Context

D0–D5 of the EEF graph tool are complete and owner-ratified; D5 landed
2026-06-05 (commit `2e9021ff`). The master plan
([`eef-graph-tool-completion.plan.md`](eef-graph-tool-completion.plan.md) §D6)
carries the D6 deliverable spec (Do / Done-when / Proof); this plan adds the one
layer it leaves open — the **ordered, atomic TDD cycle decomposition** with
per-cycle files, acceptance, and deterministic validation. It does **not**
re-open the owner-ratified D3 MCP contract
([`eef-d3-mcp-contract.md`](eef-d3-mcp-contract.md)) or D4 graph capability
contract ([`eef-d4-graph-capability-contract.md`](eef-d4-graph-capability-contract.md)):
the surface (`get-eef-evidence` tool, `eef-interpretation` resource,
`adapt-lesson` prompt), the eight subsets, the two single-Zod-call schema
sources, the `isError` semantics, and ADR-191 governance are settled.

This plan is **read-grounded, not relayed**: the author re-verified every
load-bearing readiness claim first-hand against the live tree (see §Grounded
facts), and the plan was dual-reviewed before this record was authored (see
§Readiness reviewers / §Review disposition). The dual-review caught and fixed a
contract violation in the first draft (a "bespoke bypass"); this record carries
the corrected first-class-entry architecture.

## Landing discipline (two green commits)

The D5 single-green-commit direction was session-scoped and does **not**
auto-extend. D6 lands as **two green commits**, each ending with all tests
green:

1. **Commit 1 — `c0`**: the additive SDK type-widening alone (backward-compatible,
   unit-tested, coordinated on `universal-tools/` with
   [`output-schemas-for-mcp-tools.plan.md`](../../../sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md)).
2. **Commit 2 — `c1`+`c2`+`c3`+`c4`+`c5`+`c6`** (cross-package: SDK def+schemas +
   app handler/registration/resource/prompt/flag): **atomic**, because the moment
   the EEF entry exists in the enumerated registry it MUST carry its local
   handler, its default-OFF flag filter, and its co-gated resource+prompt — any
   split leaves the server advertising or mis-registering an ungated EEF tool.

The seven cycles are **authoring checkpoints** (each authored test-first, brought
green during development); the **commit boundaries** are after `c0` and after `c6`.

## End goal, mechanism, means

- **End goal:** a teacher's assistant can, behind a flag, retrieve the EEF
  Toolkit's evidence for a named pedagogical move — strength, cost, impact,
  caveats, attribution intact — as deterministic facts the agent reasons over
  (ADR-191), to adapt Oak material as evidence-calibrated options.
- **Mechanism:** expose the D5 graph-native EEF view as a first-class MCP
  universal tool (`get-eef-evidence`) carrying two single-Zod-call schemas, plus
  the `eef-interpretation` resource (the reasoning scaffold) and the
  `adapt-lesson` prompt (the workflow starter), all co-gated behind
  `OAK_CURRICULUM_MCP_EEF_ENABLED`.
- **Means:** the seven cycles below (`c0`–`c6`) plus the `G0` pre-execution gate.

## Authoritative references (read before executing; do not duplicate here)

- Master plan §D6 — `eef-graph-tool-completion.plan.md` (Do / Done-when / Proof).
- D3 MCP contract — `eef-d3-mcp-contract.md` (§Surface, §Family, §the tool,
  §the resource, §the prompt, §SDK/app verification record V1–V8, §the schema
  rule, §`isError` semantics lines 137-154, §the eight subsets).
- D4 graph capability contract — `eef-d4-graph-capability-contract.md`.
- D5 execution record — `eef-d5-execution.plan.md` (the substrate this consumes).
- ADR-191 (deterministic surface; no server-side ranking/scoring), ADR-179 (no
  MCP types in substrate), ADR-141 (MCP Apps `_meta`).
- `output-schemas-for-mcp-tools.plan.md` §Resolved Sequencing (the S0 seam this
  lands the first use of).

## Grounded facts inherited (re-verified first-hand, 2026-06-05)

| Fact | Verdict | Evidence |
|---|---|---|
| D5 substrate exports `inspectStrand` / `evidenceForMove` / `EefEvidenceEnvelope` + finite input domains | HOLDS | `graph-corpus-sdk/src/eef-strands/eef-evidence.ts:51,123,159`; barrel `index.ts:56-58`; `raw-domains.ts` literal unions |
| Flag pre-wired, default OFF; D6 wires the consumption | HOLDS | `apps/.../src/env.ts:40-47`; `runtime-config-from-validated-env.ts:39`; `runtime-config-support.ts:14`; `eefEnabled:false` across test configs |
| `UniversalToolListEntry.inputSchema` is `z.ZodRawShape` (Sharp Edge #2 real); no `outputSchema?` today | HOLDS | `oak-curriculum-sdk/src/mcp/universal-tools/types.ts:135` |
| SDK 1.29.0 `registerTool` accepts a `z.object` directly (`ZodRawShapeCompat \| AnySchema`) | HOLDS | installed `@modelcontextprotocol/sdk/dist/esm/server/mcp.d.ts:150-154` |
| The EEF tool must be a **first-class** universal-tools entry, not a bypass | HOLDS (contract) | D3 §Family (53-57) + §"exactly like every other aggregated tool" (312-315) |
| `evidence-for-move` no-selector → `isError`; unknown key → `isError` | HOLDS (contract) | D3:137-154 (rejection over empty result) — a D6-layer predicate over the total D5 substrate |
| The app does **not** depend on `graph-corpus-sdk` today | HOLDS | absent from `apps/oak-curriculum-mcp-streamable-http/package.json` (c3 adds it, additive) |
| `@oaknational/curriculum-sdk` depends only on `@oaknational/result`, not graph-corpus-sdk | HOLDS | `oak-curriculum-sdk/package.json` (forces type-only def+schemas) |
| `impact_months` is `number \| null`, carries `-2` (1 strand) and `0` (1 strand); `number_of_studies` truly-optional | HOLDS | corpus `eef-toolkit.external-data.ts` (null×4, -2×1, 0×1) |

Versions installed (re-confirm at G0): SDK `1.29.0`, `@modelcontextprotocol/ext-apps`
`1.7.3`, `zod` `4.4.3`.

## Key design decisions (D6-owned)

1. **First-class entry, not a bypass.** `get-eef-evidence` is added to
   `AggregatedToolName` / `AGGREGATED_TOOL_DEFS` and enumerated by
   `listUniversalTools`; a **bounded typed discriminant branch** in the shared
   `registerTools` loop routes it to a local-projection handler (no auth/API/
   `formatToolResponse`) while leaving existing tools byte-for-byte unchanged.
2. **Homing split (forced by constraints):** the tool **def + the two schemas**
   live SDK-side (`oak-curriculum-sdk/src/mcp/eef/`) via `import type` from
   graph-corpus-sdk (type-only — so `listUniversalTools` can enumerate them with
   no runtime corpus dependency on the SDK); the **runtime handler** lives
   app-side, where `c3` adds the `graph-corpus-sdk` runtime dependency.
3. **Two single-Zod-call schemas only**, each tied to its payload by `satisfies`
   **and** an `expectTypeOf` equality assertion.
4. **`isError` is a D6-layer dispatch predicate** over the total D5 substrate
   (D3-decided behaviour).
5. **Telemetry is inherited**, not bespoke (the Sentry-wrapped server +
   shared-loop `setTag`).

## Workstreams and cycles

See the frontmatter `todos` for the full, executable per-cycle specification
(owned files, must-not-touch, red test, done-when, proof command). Summary:

- **G0 (gate, before `c1`)** — re-run V1–V8 against the then-installed
  SDK/ext-apps; STOP if any version drifted from `sdk@1.29.0` / `ext-apps@1.7.3`
  / `zod@4.4.3`. R1 (registration path) is closed at plan time (first-class +
  discriminant); build-time escalation: if the discriminant branch requires a
  NON-additive change to the shared loop affecting existing tools, STOP and seek
  owner sign-off (a D3 amendment). The expected shape is additive.
- **`c0`** — SDK universal-tools output-schema seam + `inputSchema` widening
  (UNCONDITIONAL; commit 1).
- **`c1`** — first-class EEF entry + eight subsets + two schema sources (SDK,
  type-only).
- **`c2`** — the two Zod schemas (single call each) + `satisfies` + `expectTypeOf`.
- **`c3`** — EEF local-projection handler (app) + the shared-loop discriminant
  branch (+ add the app→graph-corpus-sdk dependency).
- **`c4`** — `eef-interpretation` resource (app; three labelled layers).
- **`c5`** — `adapt-lesson` prompt (app).
- **`c6`** — flag co-gating (single act) + telemetry inheritance + ADR-179 check
  (convergence; commit 2 boundary).

### Dependency / parallelism (authoring order; landing per §Landing discipline)

```text
        c1 (SDK: entry+subsets+sources) ──► c2 (SDK: 2 Zod) ──► c3 (app: handler+discriminant) ──┐
          └────────────────────────────► c4 (app: resource) ─────────────────────────────────────┤
        c5 (app: prompt, independent) ─────────────────────────────────────────────────────────────┼─► c6 (app: flag co-gating + telemetry)
        c0 (SDK: type widening, independent) ──────────────────────────────────────────────────────┘  (commit 1)
```

Serial spine: `c1 → c2 → c3 → c6`. Parallel: `c4` (after `c1`), `c5`
(independent), `c0` (independent).

## Quality gates

Per-cycle: the focused workspace `test` + `type-check` named in each todo's
proof. See [`../../../templates/components/quality-gates.md`](../../../templates/components/quality-gates.md).
Before commit 1 (`c0`): `pnpm --filter @oaknational/curriculum-sdk test && pnpm type-check`.
Before commit 2 (`c1`–`c6`): the D6 integration proof
`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test` + the
aggregate `pnpm check` green on a settled tree.

## Acceptance / proof contract

Proof level **integration**; command
`pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http test`. D6 is
complete only when: the two single-Zod-call schemas exist (satisfies +
expectTypeOf, root `type: object`); `get-eef-evidence` is a first-class
universal-tools entry enumerated by `listUniversalTools`, with `outputSchema`
reaching the real `server.registerTool`/`registerAppTool` call via the bounded
discriminant branch (no bypass, no auth/API routing, `content: []`); flag
co-gating of tool+resource+prompt is total in both states; no MCP types in
substrate; no server-side ranking/scoring; EEF invocation observable via
inherited telemetry; the Update-Log entry is appended; `pnpm check` green. Per
the master plan: **D6 is not complete until the single-Zod-call graph-subset
rule is implemented exactly; failure blocks D6 and requires correction of the
D3/D4 contract.**

## Prerequisite classification

- D4 + D5 (`blocking`) — complete and landed.
- The `c0` SDK widening (`blocking` for `c3`/`c6`'s tool registration) — owned
  here, lands commit 1.
- The output-schemas plan's S0 required-promotion (`beneficial`, not blocking) —
  D6 lands the seam's first use additively; the promotion is the output-schemas
  plan's later work. Minimum shippable shape without it: `outputSchema?` stays
  optional (exactly D6's shape).

## Non-goals (YAGNI)

No generic corpus-tool factory (no second consumer yet); no re-opening D3/D4; no
D7 teacher-value round-trip (separate deliverable); no required-promotion of the
universal-tools `outputSchema` field (output-schemas plan owns it); no change to
existing aggregated/generated tools' behaviour; no runtime `graph-corpus-sdk`
dependency added to the SDK (type-only).

## Risk assessment

- **R1 (registration path) — CLOSED at plan time.** The first-class +
  discriminant-branch shape is contract-verified (D3) and re-confirmed by
  mcp-expert. Build-time trigger above.
- **R5 (`impact_months` trap).** `z.nullable(z.number())`, no `.min`/`.nonnegative`,
  never `.optional` — baked into `c1`/`c2` acceptance and the `c2` red test.
- **Cross-package commit 2.** Mitigated by authoring order (SDK `c1`/`c2` green
  before app `c3`–`c6`) and the single atomic commit ending all-tests-green.
- **Coordination on `universal-tools/`** with the output-schemas plan — register
  an active claim before `c0`; coordinate the carrier field-shape.

## Foundation alignment

`principles.md` (schema-first, replace-don't-bridge, YAGNI), `testing-strategy.md`
(TDD cycles, real-corpus tests), `schema-first-execution.md` (types flow from the
graph-native view derived from the corpus), ADR-191, ADR-179, ADR-141, the D3
contract (first-class entry, schema rule, `isError` semantics), the D4 contract.

## Plan-body first-principles check

Fires per [`../../../../rules/plan-body-first-principles-check.md`](../../../../rules/plan-body-first-principles-check.md):
**shape** — the first-class universal-tools-entry architecture is owner-ratified
(D3) and verified first-hand; the discriminant branch is the bounded
"segment-replacement" the contract anticipates. **landing-path** — two green
commits, commit 2 cross-package atomic, each ending all-tests-green.
**vendor-literal** — the SDK `registerTool` signature was verified first-hand
(`mcp.d.ts:150-154`); G0 re-runs V1–V8 at execution time.

## Readiness reviewers (verdicts recorded)

Dual-reviewed before execution (Sharp Edge #6); every finding grounded against
the artefact before acceptance.

- **mcp-expert — BLOCK (upheld; resolved).** The first draft's separate
  `eef-surface.ts` calling `registerTool` directly was the "bespoke bypass" D3
  forbids. Rewritten to the first-class entry + discriminant branch.
  Re-confirmation: **APPROVE-WITH-CONDITIONS — BLOCK resolved** (two local
  corrections applied; see Review disposition).
- **architecture-expert-fred — APPROVE-WITH-CONDITIONS.** Homing re-adjudicated
  to the forced split (def+schemas SDK type-only; handler app-side); ADR-179
  boundary sufficient; two-commit shape confirmed; prompt name `adapt-lesson`.
- **type-expert — APPROVE-WITH-CONDITIONS.** `satisfies` + `expectTypeOf`
  equality; `ZodRawShapeCompat | AnySchema` carrier; widen `AggregatedToolDefShape`
  lock-step; R5 corpus claims verified.
- **assumptions-expert — APPROVE-WITH-CONDITIONS (PROPORTIONAL).** Six-edge →
  cycle mapping complete; R1 blocking-classification legitimate; the `isError`
  semantics are D6-layer over a total substrate (D3-decided).
- **sentry-expert — APPROVE-WITH-CONDITIONS.** Telemetry inherited from the
  Sentry-wrapped server + shared-loop `setTag`; no bespoke span; no
  `captureException` for `isError`; Update-Log entry (not empty→populated).
- **pair — owner** at the plan-approval gate.

## Review disposition (each finding resolved)

- **BLOCK (mcp-expert):** verified D3:53-57/312-315 uphold the first-class
  mandate → rewrote the architecture; `c0` unconditional; `c6` test asserts
  `listUniversalTools` enumeration; G0 escalation condition stated.
- **Condition 1 (mcp-expert re-confirm):** the app does NOT depend on
  graph-corpus-sdk (an earlier ungrounded "already depends" claim — verified
  false) → `c3` adds the dependency as an explicit additive step.
- **Condition 2 (mcp-expert re-confirm):** co-gating is a SINGLE registration-loop
  act (the app has no own `tools/list` handler — verified) → `c6` rewritten.
- **fred conditions:** homing split adopted; c0/S0 carrier reconciliation noted
  in `c0`; prompt name `adapt-lesson` in `c5`.
- **type-expert C1/C2/C3 + R5:** all folded into `c0`/`c1`/`c2`.
- **assumptions-expert C1/C2/C3:** `isError` predicate owned in `c3` (D3-decided);
  inspect-strand `edges:[]`+frontier in `c3`; R1 positive-branch decided.
- **sentry-expert C1/C2/C3:** telemetry simplified in `c6`.

## Learning loop & lifecycle triggers

On D6 completion: run the consolidation workflow (`oak-consolidate-docs`); flip
the master plan `d6-mcp-composition-eef-surface` todo to `completed`; update
`eef.next-session.md` to point at D7; mine any durable lessons (the first-class
discriminant-branch pattern; the type-only SDK / runtime-app homing split) into
patterns/ADRs if they recur. Lifecycle triggers per
[`../../../templates/components/lifecycle-triggers.md`](../../../templates/components/lifecycle-triggers.md).
