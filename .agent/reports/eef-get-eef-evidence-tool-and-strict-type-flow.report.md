# `get-eef-evidence` — tool design, strict-type flow, and the LTAE fix

> **Status**: session synthesis (2026-06-07). Intended to **seed the formal tool
> documentation** (the tool will be demonstrated, so the type-flow diagram and the
> "how it works" section are written to be promoted into `docs/` or a tool README)
> **and** the eventual report on the tool + the further value the EEF corpus could
> enable. Authoritative execution next-steps live in
> [`eef-d6-execution.plan.md`](../plans/sector-engagement/eef/current/eef-d6-execution.plan.md);
> this report does not duplicate the cycle spec, it records the *analysis, the
> diagram, and the correct fix*.
>
> **Shape supersession (2026-06-11)**: the `content: []` /
> `structuredContent`-only success shape shown in this report's type-flow
> diagram was reversed by the owner on 2026-06-11 — `get-eef-evidence` now
> emits the family dual response shape via `formatToolResponse` (the strict
> domain result became `{ summary, envelope }` with a dedicated egress
> membrane). Read the diagram as the 2026-06-07 historical record; the live
> shape is in `aggregated-eef-evidence.ts` / `eef-evidence-egress.ts`.

## 1. What the tool is

`get-eef-evidence` exposes the EEF Teaching and Learning Toolkit corpus as an MCP
tool so a teacher's assistant can retrieve the evidence behind a pedagogical move
— strength, cost, months of additional progress, caveats, and source/citation —
as **deterministic facts to reason over, not recommendations** (ADR-191: the data
surface is deterministic; the agent is the only reasoner).

It is a **new *type* of tool within the aggregated-tools family** — and this is the
load-bearing design insight, hard-won this session:

- It is **not** an open-input tool like `search`/`fetch` (those validate and
  interpret unbounded free-text). Every EEF input field is a `z.enum` over the
  corpus's own **finite, compile-time-known** domains. **The schema *is* the input
  contract** — there is no open content to validate or interpret.
- It is **not** a no-input whole-corpus dump like `get-misconception-graph`. It
  answers a **bounded query** (one strand, or the strands matching a pedagogical
  context), returning the precise evidence envelope.

It is the first graph tool built in the bounded-query shape on the
`graph-core` + `graph-corpus-sdk` substrate (the shape the whole-corpus-dump graph
tools will migrate to).

Two functions, dispatched by a `function` field:

- `inspect-strand` — the evidence for one named strand, by `strandId`.
- `evidence-for-move` — the strands matching a pedagogical context: any of
  `phase`, `keyStage`, `priority`, or explicit `strandIds`. At least one selector
  is required (an unscoped query is contractually invalid — D3).

## 2. The absolute requirement: strict types without loss

**From the MCP input to the MCP output, the types are absolutely known at every
point, without loss. The only narrowing is the validation of the external input;
the only erasure is the JSON serialisation at the exit.** Between those two
boundaries there is no `as`, no `any`, no widening to `string`, and no
re-narrowing — because after validation nothing on the path is uncertain.

Why this is achievable here, not aspirational: everything the tool produces is a
function of two fully compile-time-known things — **the validated input** and the
**`as const` corpus snapshot** (`EEF_TOOLKIT_DATA`). The *same* corpus defines
both the input domain (the enums) and the output data (the strand shapes), so one
source of truth anchors both ends and every intermediate is exact by construction.

The bridge from this to value: between the two boundaries the **compiler proves
the whole pipeline**. A malformed envelope, a missing field, an unhandled case is
a *compile error*, not a runtime surprise. Every interior narrow/assert/widen is a
hole where that proof stops — so the strict-without-loss rule is not stylistic, it
is what makes the type checker the end-to-end correctness proof for the tool.

## 3. The type-flow diagram

```text
                ┌─────────────────────────────────────────────────────────┐
                │   EEF_TOOLKIT_DATA   ( `as const` corpus snapshot )       │
                │   the single compile-time source of truth                 │
                └──────────────┬──────────────────────────┬─────────────────┘
       derives the INPUT domain│                          │derives the OUTPUT data
                               ▼                          ▼
   EEF_STRAND_IDS: readonly EefStrandId[]      EefStrand = (typeof …strands)[number]
   OBSERVED_PHASES / KEY_STAGES / PRIORITIES   (each strand's exact literal shape)
                               │                          │
══ INPUT (untrusted) ══        │                          │
   model args: unknown ───── the ONLY `unknown` in the entire flow
        │                      │                          │
        ▼                      │                          │
 ╔═ VALIDATION — the ONLY narrowing, at the door ═════════╗
 ║ EEF_EVIDENCE_INPUT.safeParse(unknown) →                ║   enums spread from the
 ║   function : 'inspect-strand' | 'evidence-for-move'    ║◄── corpus constants, so it
 ║   strandId?: EefStrandId          (never `string`)     ║   narrows straight to the
 ║   strandIds?: EefStrandId[]                            ║   exact literal unions
 ║   phase?/keyStage?/priority?: Observed* literal unions ║
 ╚════════════════════════════════════════════════════════╝
        │   ◄────── from here on EXACT at every hop: no `as`, no widen, no re-narrow
        ▼
   inspectStrand(strandId: EefStrandId)
   evidenceForMove(selectors: EvidenceForMoveSelectors)        exact in → exact out
        │
        ▼
   resolveRoots(selectors) → readonly EefStrandId[]
        │
        ▼
   eefStrandGraph: GraphView<EefStrand, EefStrandId, 'related_strand'>  ◄─ built from the
     .subgraph({ rootIds, depth: 0 })                                      `as const` corpus
     → Result<{ nodes: readonly EefStrand[];
                edges: readonly GraphEdge<EefStrandId,'related_strand'>[] }, SubgraphError>
        │   `.ok` is control-flow over a KNOWN union — not a type-loss; the `!ok`
        │   throw is a documented broken-invariant (depth-0 over a fixed graph can't fail)
        ▼
   buildEnvelope(nodes, edges) → EefEvidenceEnvelope {
        members:    readonly EefStrand[]
        edges:      readonly GraphEdge<EefStrandId,'related_strand'>[]
        frontier:   readonly EefStrandId[]
        provenance: EefEvidenceProvenance              }      all exact
        │
        ▼
   runEefEvidenceTool(...) → EefEvidenceResult
        { content: []; structuredContent: EefEvidenceEnvelope }   ◄── EXACT (strict result type)
        │
        ▼
   AGGREGATED_HANDLERS[name]: (input) => Promise<CallToolResult>
        structuredContent:  EefEvidenceEnvelope  ⇒  Record<string, unknown>
        ███ PREMATURE LOSS — inside our own code, before the wire ███
            ( the family's "persistent error" — the ONE remaining violation )
        │
        ▼
   executor → app → server.registerTool(...) handler
        │
        ▼
══ OUTPUT ══
   serialize structuredContent → JSON → wire
        ✅ the ONLY legitimate loss: JSON has no static types — "leaving our system"
```

Grounding for every hop (file:line, verified first-hand this session):

- corpus + input domains: `graph-corpus-sdk/src/eef-strands/strand-lookup.ts:78`
  (`EEF_STRAND_IDS`), `raw-domains.ts:112-114` (`OBSERVED_*`).
- validation + handler: `oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`.
- bindings + envelope: `graph-corpus-sdk/src/eef-strands/eef-evidence.ts:57-167`
  (`EefEvidenceEnvelope`, `inspectStrand`, `evidenceForMove`, `subgraphEnvelope`).
- graph view: `graph-corpus-sdk/src/eef-strands/eef-graph.ts:34-55`.
- the loss point: the `AGGREGATED_HANDLERS` map at
  `oak-curriculum-sdk/src/mcp/universal-tools/executor.ts:164` returns
  `CallToolResult`, whose `structuredContent` is `Record<string, unknown>` (MCP SDK
  `types.d.ts:2601`).

## 4. The correct long-term-architectural-excellence fix

The diagram makes the fix unambiguous: **the loss must happen only at the wire
(JSON serialisation at `registerTool`), never earlier.** The current code erases
prematurely at the `AGGREGATED_HANDLERS` map. So the LTAE fix has two parts:

### 4a. Preserve `structuredContent`'s precise type to the wire (the carrier fix)

The aggregated-handler result carrier (`AggregatedHandler` → `CallToolResult`, in
`executor.ts`) erases `structuredContent` to `Record<string, unknown>` inside our
own code. This is the family's **persistent error** — every aggregated tool's
structured output is erased before it leaves the system. The fix is to make the
aggregated-handler chain carry the precise per-tool result type
(`EefEvidenceEnvelope` for EEF), erasing only at the genuine MCP wire boundary.

- This touches the shared `AggregatedHandler` / executor result typing, so it is a
  family-level change, not EEF-local. It is the right cure and is the reason the
  EEF tool surfaced the issue (the new bounded-query type is the first whose output
  is fully known, so it is the first to *want* a precise output type).
- `EefEvidenceEnvelope` is correctly a **`type` alias, not an `interface`**
  (`eef-evidence.ts:57`): a value that must be assignable to the JSON record
  carrier needs the implicit index signature that only a type alias gets;
  interfaces structurally cannot have it (they stay open to declaration merging).
  **Lint conflict, OWNER DECISION PENDING**: `@typescript-eslint/consistent-type-definitions`
  mandates `interface` and currently fails on this `type`. It is a style default
  that is wrong for index-signature-required JSON payloads. Resolution options:
  (a) scope/adjust that rule to permit `type` where a structural index signature
  is required; (b) the deeper carrier fix may relocate where the JSON assignment
  happens. Do **not** revert to `interface` (breaks the strict-result assignability)
  and do **not** disable the check.

**Rejected bridges (do not re-explore — tried/considered this session; each fails
the strict-without-loss test):**

- `{ ...envelope }` spread into `structuredContent` — a widen-to-fit hack; conforms
  to the erased carrier instead of preserving the type.
- the repo's `isStructuredContent` type-guard at the call site — narrows the value
  to `Record<string, unknown>`, **re-erasing** the precise type in the result and
  defeating preservation. Legitimate ONLY at the genuine wire boundary, never before.
- reverting `EefEvidenceEnvelope` to `interface` — then `EefEvidenceResult` is no
  longer assignable to `CallToolResult` at the `AGGREGATED_HANDLERS` map and the
  build breaks. The `type` alias is load-bearing.
- a mapped-type alias to dodge `consistent-type-definitions` — gaming the rule, not
  resolving it.
- "bounded fix now, carrier fix later" — a cheap-cure; the bounded fix leaves the
  loss at the map (not the wire), so it does not meet the requirement.

**Coordination note:** a parallel agent is actively editing `packages/core/oak-eslint/*`
this window (uncommitted, no claim) — including rule files like
`no-export-trivial-type-aliases.ts`. The `consistent-type-definitions` scoping
decision likely **intersects** that work; coordinate the lint-rule decision with
whoever owns `oak-eslint`, do not change it in isolation. (Non-blocking G0 note so
it is not re-investigated: installed `@modelcontextprotocol/ext-apps` is `1.7.2`,
not the plan's recorded `1.7.3` — irrelevant to EEF, which uses `server.registerTool`
not the ext-apps `registerAppTool` path; SDK `1.29.0` + zod `4.4.3` match.)

### 4b. Gate at registration, default off (the gating fix)

The flag (`OAK_CURRICULUM_MCP_EEF_ENABLED`, default off) is currently only consulted
at the very end (planned c6), so the tool is enumerated and **exposed ungated** in
the interim. That is what broke the `list_tools parity` e2e
(`apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts:138`): a
flagged feature appeared in `tools/list` by default. The fix is **structural**:
gate the tool at the point of registration, default off, in the same change that
adds it — then the parity e2e passes because EEF is not exposed by default, with no
patch to the expected-tools list. Do **not** patch the expected-tools list (that
buries the real cause).

## 5. What is done vs what is next

**Done this session (strict-typed, in the working tree, UNCOMMITTED):**

- c1 — `get-eef-evidence` in `AggregatedToolName` + `AGGREGATED_TOOL_DEFS` +
  runtime `@oaknational/graph-corpus-sdk` dependency on the SDK.
- c2 — the closed-domain input schema (`z.enum` over the corpus constants);
  `GET_EEF_EVIDENCE_INPUT_SCHEMA` is **not** annotated `: z.ZodRawShape` (that
  widened the per-field types; `as const satisfies` preserves them into the map).
- c3 — `runEefEvidenceTool`: one `safeParse` narrows `unknown`→typed, dispatches to
  `inspectStrand`/`evidenceForMove`, returns a **strict `EefEvidenceResult`**
  (`structuredContent: EefEvidenceEnvelope`), `isError` only for the no-selector /
  missing-id predicates. Citation provenance emitted verbatim (it is a deliberate
  licence-required academic citation, **not** PII — see §6).
- `EefEvidenceEnvelope` changed `interface`→`type` at its source so it is
  JSON-record-assignable with its field types intact.
- SDK type-check + lint + 736/736 tests green; graph-corpus-sdk type-check + 37/37
  + build green.

**Next (the correct order):**

1. The carrier fix (§4a) — preserve `structuredContent` to the wire; resolve the
   `consistent-type-definitions` lint decision (owner).
2. The gating fix (§4b) — gate at registration, default off.
3. c4 (`eef://interpretation` resource), c5 (`adapt-lesson` prompt) — SDK content +
   app registration, flag-co-gated.
4. Full gate green, then commit.

## 6. PII vs citation (settled)

The EEF author names in `provenance.source.original_authors` are a **deliberate,
licence-required academic citation** of a published meta-analysis — public
scholarly attribution, **not** the accidental personal data the org no-PII
instruction targets. They are emitted verbatim. (Earlier session framing that
treated them as PII-to-omit was wrong and is corrected; do not re-litigate.)

## 7. Report notes — further value the EEF corpus could enable

Seeds for the eventual report (not yet designed; captured so they are not lost):

- The corpus carries per-strand `impact_months` (incl. negative and zero —
  `eef-tl-repeating-a-year` = −2, `eef-tl-setting-and-streaming` = 0), `cost_rating`,
  `evidence_strength_rating`, and `related_strands` edges — a richer structure than
  a flat lookup; the graph substrate already exposes related-strand edges + a
  frontier, enabling "what's adjacent to this move" navigation.
- `school_context_relevance` exists on only 17/30 strands — tag-absence is **not**
  inapplicability; the strand index (all 30) is the honest discovery path, not axis
  filtering. The interpretation resource (c4) must teach this.
- Declared-vs-observed divergence is a corpus fact (some declared phases/key-stages
  carry no backing strand) — surfaced in `declaredVsObservedDivergence`.
- Future value directions to explore: cross-referencing EEF strands with Oak
  curriculum units (which approaches the evidence supports for a given topic);
  surfacing the inline `related_guidance_reports`; combining strength + cost +
  impact into agent-side (never server-side, ADR-191) calibrated option framing.
