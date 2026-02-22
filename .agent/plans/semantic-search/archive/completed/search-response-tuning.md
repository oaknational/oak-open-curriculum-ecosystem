---
name: Search Response Tuning
overview: >
  Unify MCP tool response formatting (P1), eliminate duplicated type
  definitions (P2), and add ES _source filtering to reduce search
  payload size by 94% (P3). Prerequisite for WS5 comparison of
  search-sdk vs REST API search.
todos:
  - id: p1-red-format
    content: "P1 RED: Write tests asserting formatToolResponse() returns content array with 2 TextContent items (summary + JSON), structuredContent matches data, _meta present."
    status: completed
  - id: p1-green-format
    content: "P1 GREEN: Implement formatToolResponse() in universal-tool-shared.ts replacing both formatDataWithContext() and formatOptimizedResult()."
    status: completed
  - id: p1-migrate-generated
    content: "P1 REFACTOR: Migrate generated tool executor (mapExecutionResult in executor.ts) to use formatToolResponse(). Generated tools need a summary — use tool annotations title + status code."
    status: completed
  - id: p1-migrate-aggregated
    content: "P1 REFACTOR: Migrate all aggregated tool execution modules to use formatToolResponse()."
    status: completed
  - id: p1-delete-old
    content: "P1 CLEANUP: Delete formatDataWithContext() and formatOptimizedResult(). Update E2E tests that assert on response shape."
    status: completed
  - id: p1-e2e
    content: "P1 E2E: Update E2E tests to assert new unified response shape (2-item content array). Run full E2E + smoke suite."
    status: completed
  - id: p2-types
    content: "P2: Derive ToolAnnotations/ToolMeta from generated ToolDescriptor contract via indexed access types (approach changed from codegen emit to type-level derivation)."
    status: completed
  - id: p3-source-filtering
    content: "P3: Add _source excludes to ES requests for all indexes (lessons, units, sequences, threads). Centralised in source-excludes.ts."
    status: completed
  - id: quality-gates
    content: "Run full quality gate chain."
    status: completed
isProject: false
---

# Search Response Tuning

## Status: Completed (2026-02-19)

All three phases (P1 response unification, P2 type deduplication, P3 ES source filtering) completed.
See [phase-3a-mcp-search-integration.md](phase-3a-mcp-search-integration.md) for the parent plan.

## Problem

The MCP tool responses have three interrelated problems, ordered by
priority:

### P1: Response Format Drift Between Tool Categories

Generated tools (from OpenAPI) and aggregated tools (hand-written) use
**different response formatting functions** producing **different shapes**:

| Aspect | Generated tools | Aggregated tools |
|--------|----------------|-----------------|
| `content[0].text` | `JSON.stringify({ status, data })` | Human summary string |
| `structuredContent` shape | `{ status, data, oakContextHint? }` | `{ ...fullData, summary, oakContextHint, status? }` |
| `_meta` | Not included | Included with widget metadata |
| Formatter | `formatDataWithContext()` | `formatOptimizedResult()` |

This means:

- Generated tools: Cursor sees the data (JSON in `content[0].text`).
- Aggregated tools: Cursor sees only a one-liner summary. The data is
  invisible in `structuredContent`.
- The response contract is implicitly different depending on which
  category a tool belongs to. Clients cannot rely on a consistent shape.

### P2: Duplicated Type Definitions That Can Drift

The `annotations` and `_meta` types are defined **twice** independently:

1. **`annotations`**: Inline type in `ToolDescriptor` (generated contract,
   `tool-descriptor.contract.ts` lines 119-125) AND `ToolAnnotations`
   interface (`universal-tools/types.ts` lines 64-75). Same shape today,
   no structural link.

2. **`_meta`**: Inline type in `ToolDescriptor` (generated contract,
   `tool-descriptor.contract.ts` lines 134-147) AND `ToolMeta` interface
   (`universal-tools/types.ts` lines 88-104). Same shape today, no
   structural link.

If either definition changes, the other will silently remain out of date.
This violates the cardinal rule: types defined once, from the schema.

### P3: Bloated ES Responses in `search-sdk`

The `search-sdk` tool returns **186 KB for 5 results** because the Search
SDK passes through the entire Elasticsearch `_source` without field
filtering. Each lesson hit includes `lesson_content` (14K chars of
transcript), `lesson_content_semantic` (14K duplicate),
`lesson_structure` (1.9K), and `lesson_structure_semantic` (1.9K) —
fields needed for ES scoring but useless in the response.

### Response Comparison (current)

| Tool | Results | Payload | Per-result |
|------|---------|---------|------------|
| `search` (REST API) | 20 lessons + 4 transcripts | 9 KB | ~0.4 KB |
| `search-sdk` (ES) | 5 lessons | 186 KB | ~37 KB |
| `get-ontology` | 1 domain model | 54 KB | n/a |

---

## Phase 1: Unified Response Formatting (P1)

### Goal

One formatting function. All tools — generated and aggregated — produce
the same response shape. Cursor and every MCP client sees the data.

### Design

Per MCP spec: "For backwards compatibility, a tool that returns structured
content SHOULD also return the serialized JSON in a TextContent block."

The MCP spec also confirms the `content` array can contain multiple items.

**Unified response shape:**

```typescript
{
  content: [
    { type: "text", text: humanSummary },          // Always present
    { type: "text", text: JSON.stringify(data) }    // Always present
  ],
  structuredContent: { ...data },                   // For Apps SDK clients
  _meta: { toolName, ... }                          // Widget-only
}
```

This means:

- Cursor (reads `content`): gets both summary AND full data
- OpenAI Apps SDK (reads `structuredContent`): gets structured data
- Any MCP client: has a consistent, predictable response shape
- The model: always has access to the data regardless of client

### Summary generation for generated tools

Generated tools currently have no summary — they `JSON.stringify` the
entire response into `content[0].text`. After unification, every tool
needs a human-readable summary. Two sources:

- **Aggregated tools**: Already produce summaries (e.g. "Found 288
  lessons matching 'apples'"). Keep these.
- **Generated tools**: Use the tool's `annotations.title` from the
  descriptor plus the HTTP status. Example: `"Get Lesson Summary: 200"`
  or `"Get Key Stages: 200"`. This is minimal but informative. The full
  data follows in `content[1].text`.

The `mapExecutionResult` function in `executor.ts` already has access to
the tool name and calls `getToolFromToolName(toolName)` to get the
descriptor, which includes `annotations.title`.

### Execution (TDD)

1. **RED**: Write tests asserting that `formatToolResponse()` returns
   `content` array with exactly 2 TextContent items — summary and JSON.
   Assert `structuredContent` matches the data. Assert `_meta` is present.
2. **GREEN**: Implement `formatToolResponse()` in `universal-tool-shared.ts`
   replacing both `formatDataWithContext()` and `formatOptimizedResult()`.
3. **REFACTOR**: Migrate all callers:
   - Generated tool executor (`mapExecutionResult` in `executor.ts`) —
     pass `annotations.title` + status as summary
   - Each aggregated tool execution module — keep existing summaries
4. **RED**: Write tests asserting the old functions no longer exist (import
   failures).
5. **GREEN**: Delete `formatDataWithContext()` and `formatOptimizedResult()`.
6. **E2E**: Update E2E tests that assert on response shape to expect the
   new 2-item `content` array. Run full E2E + smoke suite.

### Files to Change

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts` | Replace two formatters with one unified `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/executor.ts` | Use `formatToolResponse()` for generated tools |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-fetch.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help/execution.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-knowledge-graph.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-thread-progressions.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-prerequisite-graph.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/execution.ts` | Use `formatToolResponse()` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/execution.ts` | Use `formatToolResponse()` |

---

## Phase 2: Unify Type Definitions (P2)

### Goal

`annotations` and `_meta` types defined ONCE. The generated contract and
the universal tools types both resolve to the same definition. Changing
one changes both.

### Design

Types flow FROM the schema (cardinal rule). The type-gen codegen emits
`ToolAnnotations` and `ToolMeta` as named exported interfaces from the
generated contract (`tool-descriptor.contract.ts`). The runtime
`universal-tools/types.ts` re-exports them. No duplication.

This is a subset of the broader aggregated tools type-gen migration
(Phase 0 of `03-mcp-infrastructure-advanced-tools-plan.md`). That plan
moves ALL aggregated tool definitions to type-gen time. This phase
addresses only the immediate type duplication — it can be done now
without waiting for the full Phase 0 migration.

### Execution (TDD)

1. **RED**: Test that `ToolAnnotations` and `ToolMeta` are exported from
   the contract module.
2. **GREEN**: Update type-gen codegen to emit named interfaces instead of
   inline types in `ToolDescriptor`. Export them from the contract.
3. **REFACTOR**: Update `universal-tools/types.ts` to re-export from the
   contract instead of duplicating. Delete the duplicated interfaces.
4. Verify: `pnpm type-gen && pnpm type-check` passes with zero drift.

### Files to Change

| File | Change |
|------|--------|
| `packages/sdks/oak-curriculum-sdk/type-gen/typegen/mcp-tools/parts/generate-tool-descriptor-file.ts` | Emit `ToolAnnotations`, `ToolMeta` as named exported interfaces instead of inline types in `ToolDescriptor` |
| `tool-descriptor.contract.ts` (generated output — do not edit directly) | Verified after `pnpm type-gen`: should contain named exports |
| `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/types.ts` | Re-export `ToolAnnotations` and `ToolMeta` from contract, delete duplicated interfaces |

---

## Phase 3: ES `_source` Filtering (P3)

### Goal

The `search-sdk` tool returns lean results by excluding transcript and
semantic fields from ES `_source`. Configurable so tools can override.

### Design

Add `_source` exclude lists to ES search requests. Fields to exclude:

- `lesson_content` — full transcript text (14K chars)
- `lesson_content_semantic` — duplicate for vector scoring (14K chars)
- `lesson_structure` — structured lesson outline (1.9K chars)
- `lesson_structure_semantic` — duplicate for vector scoring (1.9K chars)
- `title_suggest` — completion payload (not needed in results)

ES scores documents from the index, not from `_source`. Excluding these
fields does not affect relevance scoring.

Make filtering configurable via `SearchLessonsParams.sourceExcludes` so
MCP tools can request specific field sets. This follows the existing
pattern where `highlight`, `size`, `from` are already configurable.

Apply same pattern to unit/thread/sequence searches.

### Projected Response After Changes

5 lesson results: **~12 KB** (down from 186 KB, ~94% reduction).

Per-result fields (22 fields, ~2.0 KB each):

- `lesson_id`, `lesson_slug`, `lesson_title`
- `subject_slug`, `subject_title`, `key_stage`, `key_stage_title`
- `phase_slug`, `years`
- `unit_ids`, `unit_titles`, `unit_urls`, `unit_count`
- `lesson_keywords`, `key_learning_points`
- `lesson_url`
- `has_transcript`, `downloads_available`
- `misconceptions_and_common_mistakes`, `teacher_tips`
- `pupil_lesson_outcome`
- `subject_parent`

Excluded from default response:

- `lesson_content` (14K chars — fetch via `get-lessons-transcript`)
- `lesson_content_semantic` (duplicate)
- `lesson_structure` (1.9K chars)
- `lesson_structure_semantic` (duplicate)
- `title_suggest` (completion payload)
- `doc_type` (internal)

### Execution (TDD)

1. **RED**: Test that `searchLessons` result docs do NOT contain
   `lesson_content` or `lesson_content_semantic`.
2. **GREEN**: Add `_source: { excludes: [...] }` to the ES request in
   `create-retrieval-service.ts`.
3. **REFACTOR**: Extract default exclude lists to constants.
4. **RED**: Test that custom `sourceExcludes` overrides defaults.
5. **GREEN**: Add `sourceExcludes` to `SearchLessonsParams` and thread
   through to ES request.
6. Apply same pattern to `searchUnits`, `searchThreads`,
   `searchSequences`.

### Files to Change

| File | Change |
|------|--------|
| `packages/sdks/oak-search-sdk/src/retrieval/create-retrieval-service.ts` | Add `_source` excludes |
| `packages/sdks/oak-search-sdk/src/types/retrieval-params.ts` | Add `sourceExcludes` to param types |
| `packages/sdks/oak-search-sdk/src/retrieval/search-threads.ts` | Add `_source` excludes |
| `packages/sdks/oak-search-sdk/src/retrieval/suggestions.ts` | Add `_source` excludes |
| `packages/sdks/oak-search-sdk/src/retrieval/sequence-facets.ts` | Add `_source` excludes |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search-sdk/execution.ts` | Set default excludes |

---

## Success Criteria

### Phase 1

- All tools (generated and aggregated) return `content` with 2 items:
  summary + JSON
- `structuredContent` present on all responses
- `_meta` present on all responses
- Cursor receives full data via `content[1].text`
- `formatDataWithContext()` and `formatOptimizedResult()` deleted
- E2E tests updated and passing

### Phase 2

- `ToolAnnotations` and `ToolMeta` defined once in the generated contract
- `universal-tools/types.ts` re-exports, no duplication
- `pnpm type-gen && pnpm type-check` produces zero drift
- No inline type definitions for annotations or _meta in ToolDescriptor

### Phase 3

- `search-sdk` with `size: 5` returns < 15 KB (down from 186 KB)
- No change to relevance scores
- `sourceExcludes` configurable per search call
- Existing tests continue to pass
- Full quality gate chain passes

---

## Related Plans

| Plan | Relationship |
|------|-------------|
| [Phase 3a MCP Search Integration](phase-3a-mcp-search-integration.md) | Parent plan — WS5 comparison depends on lean search results |
| [03-mcp-infrastructure-advanced-tools-plan.md](../../sdk-and-mcp-enhancements/03-mcp-infrastructure-advanced-tools-plan.md) | Phase 0 moves ALL aggregated tools to type-gen. Phase 2 of this plan is a focused subset. |
| [mcp-result-pattern-unification.md](mcp-result-pattern-unification.md) | Unifies `ToolExecutionResult` and `Result<T, E>` error patterns. Complementary. |
| [env-architecture-overhaul.md](env-architecture-overhaul.md) | Prerequisite work (largely complete) |
