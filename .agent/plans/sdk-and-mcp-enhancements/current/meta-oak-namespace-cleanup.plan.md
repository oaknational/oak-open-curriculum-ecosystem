---
name: "Replace _meta.securitySchemes with Oak-namespaced metadata"
overview: "Remove unused securitySchemes from _meta, replace with oak-www and oak-guidance namespace fields"
todos:
  - id: phase-0-audit
    content: "Phase 0: Audit all _meta.securitySchemes usage and confirm no runtime consumer exists."
    status: pending
  - id: phase-1-type-and-codegen
    content: "Phase 1: Update ToolMeta type and codegen to emit oak-namespaced fields instead of securitySchemes."
    status: pending
  - id: phase-2-aggregated-defs
    content: "Phase 2: Update all hand-written aggregated tool definitions."
    status: pending
  - id: phase-3-tests-and-gates
    content: "Phase 3: Update tests, regenerate, and pass all quality gates."
    status: pending
---

# Replace `_meta.securitySchemes` with Oak-Namespaced Metadata

**Last Updated**: 2026-04-12
**Status**: 🔴 NOT STARTED
**Scope**: Remove the unused `securitySchemes` field from `_meta` across all tools (generated and aggregated) and replace it with two Oak-namespaced fields: `oak-www` and `oak-guidance`.

---

## Context

### Issue: Non-standard `_meta.securitySchemes` on the wire

Every tool (generated and aggregated) mirrors its `securitySchemes` into `_meta`. This field:

- Is **not part of the MCP or MCP Apps spec** — `_meta.ui` is the only spec-defined sub-object
- Is **not consumed by any MCP host** (Claude, ChatGPT, etc.)
- Is **not consumed by any Oak runtime code** — `toolRequiresAuth()` reads the top-level `securitySchemes`, not `_meta.securitySchemes`
- Adds ~50 bytes per tool to every `tools/list` response for no benefit

The top-level `securitySchemes` on each tool definition is functional and stays — only the `_meta` mirror is removed.

### Replacement: Oak-namespaced metadata

Instead of dead `securitySchemes`, `_meta` should carry genuinely useful Oak-specific metadata using namespaced keys (per MCP's open `_meta` convention):

| Key | Value | Purpose |
|-----|-------|---------|
| `oak-www` | `"https://www.thenational.academy"` | Oak website URL — discoverable by hosts for branding/linking |
| `oak-guidance` | `OAK_CONTEXT_HINT` constant | Agent guidance text telling the model to call `get-curriculum-model` first |

The `oak-guidance` value MUST use the existing `OAK_CONTEXT_HINT` constant (generated from `AGENT_SUPPORT_TOOL_METADATA` via `generateContextHint()`), not custom text. This ensures the guidance stays in sync with the single source of truth.

**Root Cause**: `_meta.securitySchemes` was added aspirationally (ADR-141) for hypothetical future hosts that might read auth metadata from `_meta`. No such host materialised.

---

## Quality Gate Strategy

**Why full monorepo?** Changes touch sdk-codegen (generated files), curriculum-sdk (aggregated defs, types), and the MCP app (registration, tests). Cross-workspace verification is essential.

### After Each Task

```bash
pnpm type-check && pnpm lint && pnpm test
```

### After Each Phase

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint && pnpm test
```

---

## Solution Architecture

### Key Insight

`_meta` is the right place for Oak-specific metadata — the MCP spec explicitly allows arbitrary keys. But the content should be **useful**, not a mirror of data already available elsewhere. `oak-www` gives hosts a clickable link; `oak-guidance` gives models a consistent prerequisite reminder.

### Strategy

1. Update the `ToolMeta` type to replace `securitySchemes` with `oak-www` and `oak-guidance`
2. Update the codegen emitter to output the new fields for all generated tools
3. Update all aggregated tool definitions to use the new fields
4. Update the graph resource factory
5. Regenerate all generated tool files
6. Update tests to assert the new shape

**Non-Goals** (YAGNI):

- ❌ Removing top-level `securitySchemes` from tool definitions (it's functional — used by `toolRequiresAuth()`)
- ❌ Capability-gated tool registration (separate concern)
- ❌ Changing the `_meta.ui` shape (already correct per MCP Apps spec)
- ❌ Touching `_meta.attribution` (separate concern, already namespaced)

**Extracted from `mcp-app-ui-preview-regression.plan.md`** (closed
2026-04-12): Consider introducing a `buildToolMeta()` factory that
derives `_meta` from tool name — uses `WIDGET_TOOL_NAMES.has(name)`
for widget UI, always includes base metadata, returns `ToolMeta`
(never `undefined`). This factory naturally fits this plan's scope
since both address `_meta` architecture. Also: the `emit-index.ts`
`WIDGET_TOOL_NAMES.has(toolName)` check for generated tools is dead
code (no generated tool is a widget tool) — clean up or document.

---

## Foundation Document Commitment

Before beginning work and at the start of each phase:

1. **Re-read** `.agent/directives/principles.md`
2. **Re-read** `.agent/directives/schema-first-execution.md` — codegen changes must follow generator-first
3. **Ask**: "Could it be simpler?"
4. **Verify**: No type assertions, no compatibility layers

---

## Resolution Plan

### Phase 0: Audit `_meta.securitySchemes` consumers (~5 min)

**Foundation Check-In**: Re-read principles.md — verify before acting.

#### Task 0.1: Confirm no runtime consumer reads `_meta.securitySchemes`

**Acceptance Criteria**:

1. ✅ `grep -r '_meta.*securitySchemes' apps/` returns only test files and the registration path (which writes, not reads)
2. ✅ `toolRequiresAuth()` reads from top-level `securitySchemes`, not `_meta`
3. ✅ No external package imports or reads `_meta.securitySchemes`

**Deterministic Validation**:

```bash
# 1. No runtime reads of _meta.securitySchemes in app src (excluding tests)
grep -r '_meta.*securitySchemes\|_meta\.securitySchemes' apps/*/src/ --include='*.ts' -l | grep -v '.test.' | grep -v '.spec.'
# Expected: empty (no matches) or only handlers.ts which WRITES it

# 2. toolRequiresAuth reads top-level, not _meta
grep -n 'securitySchemes' apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts
# Expected: references to AGGREGATED_TOOL_DEFS[name].securitySchemes and getToolFromToolName(name).securitySchemes — not _meta
```

**Task Complete When**: Confirmed zero runtime consumers of `_meta.securitySchemes`.

---

### Phase 1: Update type and codegen (~15 min)

**Foundation Check-In**: Re-read schema-first-execution.md — types first, then codegen, then consumers.

#### Task 1.1: Update `ToolMeta` type

**File**: `packages/sdks/oak-sdk-codegen/src/types/mcp-protocol-types.ts`

**Changes**:

- Remove `readonly securitySchemes?: readonly SecurityScheme[];` from `ToolMeta`
- Add `readonly 'oak-www'?: string;`
- Add `readonly 'oak-guidance'?: string;`

**Acceptance Criteria**:

1. ✅ `ToolMeta` no longer has `securitySchemes`
2. ✅ `ToolMeta` has `'oak-www'` and `'oak-guidance'` as optional string fields
3. ✅ `pnpm type-check` passes (will fail until codegen + consumers updated)

#### Task 1.2: Update codegen emitter

**File**: `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts`

**Current** (lines 151–164):

```typescript
// _meta with securitySchemes only (no widget UI).
lines.push('  _meta: {');
lines.push(`    securitySchemes: ${securitySchemesLiteral},`);
lines.push('  },');
```

**Target**:

```typescript
lines.push('  _meta: {');
lines.push(`    'oak-www': ${JSON.stringify(OAK_WWW_URL)},`);
lines.push(`    'oak-guidance': OAK_CONTEXT_HINT,`);
lines.push('  },');
```

Where `OAK_WWW_URL` is the constant `'https://www.thenational.academy'` (likely already available as `OAK_SERVER_BRANDING.websiteUrl` or defined as a new cross-domain constant), and `OAK_CONTEXT_HINT` is imported from `prerequisite-guidance.ts` (or the cross-domain constant equivalent accessible at codegen time).

**Note**: The codegen emitter produces *source code* as strings, so `OAK_CONTEXT_HINT` must be emitted as a reference to the constant (not its runtime value). The generated file must import the constant. Alternatively, the literal text can be emitted inline if import mechanics are too complex — but using the constant is preferred.

**Acceptance Criteria**:

1. ✅ Emitter no longer outputs `securitySchemes` into `_meta`
2. ✅ Emitter outputs `'oak-www'` and `'oak-guidance'` for all generated tools
3. ✅ Widget tools still get `ui: { resourceUri: ... }` in addition to the oak fields

#### Task 1.3: Update codegen test

**File**: `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/generate-tool-descriptor-file.unit.test.ts`

**Changes**: Update assertions that check for `securitySchemes` in `_meta` to check for `oak-www` and `oak-guidance` instead.

#### Task 1.4: Regenerate all generated tool files

```bash
pnpm sdk-codegen
```

**Acceptance Criteria**:

1. ✅ All ~24 generated tool files updated with new `_meta` shape
2. ✅ No generated file contains `_meta.*securitySchemes`

**Deterministic Validation**:

```bash
grep -r 'securitySchemes' packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/ | grep '_meta'
# Expected: no matches
```

---

### Phase 2: Update aggregated tool definitions (~15 min)

**Foundation Check-In**: Re-read principles.md — full-stack means full-stack.

#### Task 2.1: Define Oak namespace constants

Create or update a constants file (likely in `packages/sdks/oak-curriculum-sdk/src/mcp/` or extend `prerequisite-guidance.ts`) to export:

```typescript
/** Oak website URL for _meta.oak-www */
export const OAK_WWW = 'https://www.thenational.academy' as const;
```

`OAK_CONTEXT_HINT` already exists in `prerequisite-guidance.ts` — reuse it directly.

#### Task 2.2: Update all aggregated tool `_meta` objects

**Files** (each tool definition):

- `aggregated-curriculum-model/definition.ts`
- `aggregated-search/tool-definition.ts`
- `aggregated-browse/tool-definition.ts`
- `aggregated-explore/tool-definition.ts`
- `aggregated-user-search/tool-definition.ts` (both `user-search` and `user-search-query`)
- `aggregated-fetch/` (find definition file)
- `aggregated-asset-download/definition.ts`
- `aggregated-thread-progressions.ts`
- `aggregated-prior-knowledge-graph.ts`
- `aggregated-misconception-graph.ts`

**Pattern — widget tools** (search, get-curriculum-model, user-search, user-search-query):

```typescript
_meta: {
  ui: { resourceUri: WIDGET_URI, visibility: [...] },
  'oak-www': OAK_WWW,
  'oak-guidance': OAK_CONTEXT_HINT,
},
```

**Pattern — non-widget aggregated tools**:

```typescript
_meta: {
  'oak-www': OAK_WWW,
  'oak-guidance': OAK_CONTEXT_HINT,
},
```

**Acceptance Criteria**:

1. ✅ No aggregated tool has `securitySchemes` in `_meta`
2. ✅ All aggregated tools have `'oak-www'` and `'oak-guidance'`
3. ✅ Widget tools retain their `ui` field unchanged

#### Task 2.3: Update `AggregatedToolDefShape` interface

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts`

Update the interface and the ADR-141 TSDoc comment to reflect the new shape.

#### Task 2.4: Update graph resource factory

**File**: `packages/sdks/oak-curriculum-sdk/src/mcp/graph-resource-factory.ts`

Replace `securitySchemes` in `_meta` with `'oak-www'` and `'oak-guidance'`.

---

### Phase 3: Update tests and pass all gates (~15 min)

**Foundation Check-In**: Re-read testing-strategy.md — tests prove behaviour.

#### Task 3.1: Update unit and integration test assertions

**Files to update** (assertions that check `_meta.securitySchemes`):

- `graph-resource-factory.unit.test.ts` — update "includes securitySchemes in _meta" tests
- `universal-tools.unit.test.ts` — update fake tool `_meta`
- `universal-tools-executor.integration.test.ts` — update fake tool `_meta`
- `universal-tools.integration.test.ts` — update "generated tools have _meta.securitySchemes" test
- `handlers-tool-registration.integration.test.ts` — may need update if it checks `_meta` shape
- `emit-index.invoke.unit.test.ts` — update codegen output assertions
- `widget-metadata.e2e.test.ts` — update if it checks `_meta.securitySchemes`
- `mcp-app-pipeline.e2e.test.ts` — update if it checks `_meta.securitySchemes`
- `tool-descriptor.contract.ts` — update contract if it asserts `securitySchemes`

**Pattern**: Replace `expect(x._meta.securitySchemes).toBeDefined()` with `expect(x._meta['oak-www']).toBe('https://www.thenational.academy')` and `expect(x._meta['oak-guidance']).toBeDefined()`.

#### Task 3.2: Run full quality gates

```bash
pnpm sdk-codegen && pnpm build && pnpm type-check && pnpm lint && pnpm test
```

**Acceptance Criteria**:

1. ✅ All commands exit 0
2. ✅ Zero references to `_meta.*securitySchemes` remain (excluding top-level `securitySchemes`)

**Deterministic Validation**:

```bash
# No _meta.securitySchemes anywhere in the codebase
grep -r 'securitySchemes' packages/sdks/ apps/ --include='*.ts' | grep '_meta'
# Expected: no matches

# oak-www and oak-guidance present in a sample generated tool
grep -A2 '_meta' packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-subjects.ts
# Expected: 'oak-www': '...', 'oak-guidance': ...

# Wire output verification
node --import tsx -e "
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerHandlers } from './src/handlers.js';
// ... (same dump script from audit session)
" 2>&1 | grep -E 'oak-www|oak-guidance|securitySchemes'
# Expected: oak-www and oak-guidance present, securitySchemes absent
```

#### Task 3.3: Update ADR-141 TSDoc references

Update the ADR-141 comment block in `definitions.ts` to document the new `_meta` contract:

- Widget tools: `_meta: { ui: { resourceUri, visibility }, 'oak-www', 'oak-guidance' }`
- Non-widget tools: `_meta: { 'oak-www', 'oak-guidance' }`
- Graph tools with attribution: `_meta: { 'oak-www', 'oak-guidance', attribution }`

---

## Testing Strategy

### Existing Tests (to update, not delete)

- `graph-resource-factory.unit.test.ts` — rename "includes securitySchemes in _meta" → "includes oak-www and oak-guidance in _meta"
- `universal-tools.integration.test.ts` — rename "generated tools have _meta.securitySchemes" → "generated tools have _meta oak-www and oak-guidance"
- Contract test in `tool-descriptor.contract.ts` — update shape assertion

### No New Tests Required

The existing test coverage is sufficient — we're changing the shape of `_meta`, not adding new behaviour. Existing tests updated to assert the new shape provide full coverage.

---

## Success Criteria

### Phase 0

- ✅ Confirmed zero runtime consumers of `_meta.securitySchemes`

### Phase 1

- ✅ `ToolMeta` type updated, codegen emits new shape, all generated files regenerated

### Phase 2

- ✅ All aggregated tool `_meta` objects use `oak-www` and `oak-guidance`

### Phase 3

- ✅ All tests updated and passing
- ✅ `pnpm check` passes
- ✅ Zero `_meta.securitySchemes` references remain in codebase

### Overall

- ✅ `tools/list` response contains `oak-www` and `oak-guidance` on every tool
- ✅ `tools/list` response contains no `securitySchemes` in `_meta`
- ✅ Top-level `securitySchemes` on tool definitions unchanged (auth still works)

---

## Dependencies

**Blocking**: None — this is a standalone cleanup.

**Related Plans**:

- `mcp-app-extension-migration.plan.md` — the broader MCP Apps migration context

**Prerequisites**:

- ✅ `OAK_CONTEXT_HINT` constant already exists in `prerequisite-guidance.ts`
- ✅ `toolRequiresAuth()` already reads top-level `securitySchemes` (not `_meta`)

---

## Notes

### Why This Matters

**Immediate Value**:

- **Wire cleanliness**: Remove non-standard metadata that no host reads
- **Discoverability**: `oak-www` gives hosts a clickable link to Oak's website
- **Agent grounding**: `oak-guidance` ensures every tool carries the prerequisite reminder, even if the host doesn't read server instructions

**Risk of Not Doing**:

- Non-standard `_meta` fields may confuse future MCP tooling or spec validation
- Missed opportunity to carry genuinely useful metadata on the wire

---

## References

- `packages/sdks/oak-sdk-codegen/src/types/mcp-protocol-types.ts` — `ToolMeta` type
- `packages/sdks/oak-sdk-codegen/code-generation/typegen/mcp-tools/parts/emit-index.ts` — codegen emitter
- `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts` — `OAK_CONTEXT_HINT`, `OAK_WWW` constants
- `packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools/definitions.ts` — `AggregatedToolDefShape`
- `apps/oak-curriculum-mcp-streamable-http/src/tool-auth-checker.ts` — runtime auth (reads top-level, not `_meta`)
- MCP Apps spec types: `@modelcontextprotocol/ext-apps` `spec.types.d.ts`
- Foundation documents:
  - `.agent/directives/principles.md`
  - `.agent/directives/schema-first-execution.md`

---

## Consolidation

After all work is complete and quality gates pass, run `/jc-consolidate-docs`
to graduate settled content, extract reusable patterns, rotate the napkin,
manage fitness, and update the practice exchange.

---

## Future Enhancements (Out of Scope)

- Capability-gated tool registration (`getUiCapability()` check) — separate plan
- Removing `search` from the widget tool allowlist — separate concern raised in audit
- Adding `oak-guidance` variant per tool category (different guidance for progression vs discovery tools)
