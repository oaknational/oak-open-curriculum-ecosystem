---
name: "get-curriculum-model: Replace get-ontology and get-help"
overview: "Remove get-ontology and get-help as standalone tools; get-curriculum-model is the sole agent guidance tool. Fix all known issues."
todos:
  - id: ws1-red
    content: "WS1 (RED): Tests asserting final state — old tools absent, new tool complete, annotations forwarded. Tests MUST fail."
    status: completed
  - id: ws2-green
    content: "WS2 (GREEN): Atomic removal of standalone tools, resource metadata forwarding, reference cleanup. All tests MUST pass."
    status: completed
  - id: ws3-refactor
    content: "WS3 (REFACTOR): Fix pre-existing as assertions, dependency inversion, stale comments, idempotency timestamp, documentation."
    status: completed
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain (sdk-codegen through smoke:dev:stub)."
    status: completed
  - id: ws5-adversarial-review
    content: "WS5: Adversarial specialist reviews (code, architecture, test, type). Document findings."
    status: completed
  - id: ws6-doc-propagation
    content: "WS6: Propagate outcomes to ADR-060, agent-support-tools-specification.md, READMEs, session prompt."
    status: completed
isProject: false
---


<!-- Add a note to the plan to investigate the three prompts that the mcp server provides. Prompts are supposed to be invoked by users to achieve something, all of these look like they might be more appropriate as agent facing resources, and indeed mostly might be covered by the curriculum model and pre-requisite graph. Please investigate the intention, and consider what should be kept, what should be removed, and what type of mcp thing they should be @MCP . In addition to that it would be good to have one example prompt firmly aimed at users, for instance a prompt that would help a user find and adapt a lesson -- do not do anything yet, just add todo items to the plan -->

# get-curriculum-model: Replace get-ontology and get-help

**Last Updated**: 2026-03-01
**Status**: COMPLETE. All workstreams (WS1-WS6) and follow-up #1 (upstream error handling) done. Remaining follow-ups tracked in [merge-readiness.plan.md](merge-readiness.plan.md) and [post-merge-tidy-up.plan.md](../future/post-merge-tidy-up.plan.md).
**Scope**: Remove `get-ontology` and `get-help` as standalone tools.
`get-curriculum-model` is the sole agent guidance tool. Fix all known issues.

---

## Context

### Problem Statement

Consuming AI agents had to call TWO tools (`get-ontology` + `get-help`)
for complete orientation. The CTA prompt in `widget-cta/registry.ts`
worked around this with a multi-step instruction. `get-curriculum-model`
was implemented to solve this with a single call — but the standalone
tools were never removed. Additionally:

- `composeDomainModel()` was cherry-picking 14 of 20 ontology fields,
  silently dropping 6 (fixed: now passes through all of `ontologyData`).
- Resource annotations (`priority: 1.0`, `audience: ["assistant"]`) are
  defined in SDK resource objects but silently dropped at the app
  registration boundary — affecting all resources, not just curriculum
  model.
- ~21 pre-existing `as` assertions in test files violate the
  no-type-shortcuts rule (verify exact count at execution start).

### Existing Capabilities

`get-curriculum-model` is fully implemented and tested:

| File | Purpose |
|---|---|
| `curriculum-model-data.ts` | Data composition — `ontologyData` (complete, no filtering) + `toolGuidanceData` |
| `aggregated-curriculum-model/` | Tool definition, execution, exports |
| `curriculum-model-resource.ts` | `curriculum://model` resource with annotations |
| `agent-support-tool-metadata.ts` | Entry with `callOrder: 0`, `callAtStart: true` |
| `universal-tools/definitions.ts` | Registered in `AGGREGATED_TOOL_DEFS` |
| `universal-tools/executor.ts` | Registered in `AGGREGATED_HANDLERS` |

Quality gates passed (pre content-gap fix): `sdk-codegen`, `build`,
`type-check`, `lint:fix`, `format:root`, `markdownlint:root`, `test`
(24/24), `test:e2e` (19/19), `test:ui` (15/15), `smoke:dev:stub` (20/20).

### Prior Work

- [ADR-060](../../../../docs/architecture/architectural-decisions/060-agent-support-metadata-system.md) — Agent support metadata
- [ADR-063](../../../../docs/architecture/architectural-decisions/063-sdk-domain-synonyms-source-of-truth.md) — SDK domain synonyms
- [Ontology and Graphs API Proposal](../../external/ooc-api-wishlist/22-ontology-and-graphs-api-proposal.md)

---

## Design Principles

1. **Replacement, not addition** — `get-curriculum-model` replaces both
   `get-ontology` and `get-help`. The standalone tools are removed.
   Previous sessions repeatedly drifted towards keeping them. The rules
   are explicit: "NEVER create compatibility layers, no backwards
   compatibility — replace old approaches with new approaches."

2. **One call for complete orientation** — agents call
   `get-curriculum-model` once at conversation start and receive
   everything they need.

3. **Dual exposure** — tool (universal client support) + resource
   (`curriculum://model`) with MCP spec annotations
   (`priority: 1.0`, `audience: ["assistant"]`) for auto-injection.
   The redundant `curriculum://ontology` resource is removed.

4. **No content filtering** — `domainModel` is typed as `OntologyData`
   and assigned directly from `ontologyData`. No destructuring, no
   editorialising. Synonyms were removed from `ontologyData` by the
   owner; there is nothing to exclude.

5. **Resource metadata: forward all fields** — the registration boundary
   must forward all fields from resource definition objects. The MCP spec
   and official SDK decide which fields are valid — our code must not
   filter.

6. **`tool_name` parameter** — migrated from `get-help`. Returns full
   context plus tool-specific help when provided.

7. **Payload size** — combined ~68KB (~17K tokens, 13% of 128K context).
   Acceptable. No `detail` parameter needed.

**Non-Goals** (YAGNI):

- No compatibility layer or deprecation period for `get-ontology`/`get-help`
- No glossary expansion or vocabulary overhaul (separate future plan:
  [WS2+WS3 Pedagogical Review Checkpoint](../future/ws2-ws3-pedagogical-review-checkpoint.plan.md))
- No redesign of the aggregated tool dispatch system
- No changes to non-agent-support tools (search, fetch, etc.)

---

## WS1 — Test Specification (RED)

All new/updated tests MUST FAIL at the end of WS1.

> See [TDD Phases component](../../templates/components/tdd-phases.md)

### 1.1: Tool list excludes removed tools

**Tests**:

- `universal-tools.unit.test.ts` — assert `AGGREGATED_TOOL_DEFS` does
  NOT have keys `get-ontology` or `get-help`
- `universal-tools.integration.test.ts` — assert tool dispatch rejects
  `get-ontology` and `get-help` as unknown tools

**Acceptance Criteria**:

1. Tests compile and run
2. Tests fail because `get-ontology` and `get-help` still exist in
   `AGGREGATED_TOOL_DEFS`
3. No existing tests broken

### 1.2: Resource annotations forwarded

**Tests**:

- `register-resources.integration.test.ts` — assert that
  `registerCurriculumModelResource` passes `annotations` to
  `server.registerResource`
- `register-resources.integration.test.ts` — assert that
  `registerDocumentationResources` passes all resource fields

**Acceptance Criteria**:

1. Tests fail because `annotations` is not currently forwarded
2. Pattern covers all resource registrations, not just curriculum model

### 1.3: Ontology resource removed

**Tests**:

- `register-resources.integration.test.ts` — assert that
  `registerAllResources` does NOT call `registerResource` with
  `curriculum://ontology` URI

**Acceptance Criteria**:

1. Test fails because `registerOntologyResource` is still called

### 1.4: Metadata excludes removed tools

**Tests**:

- `agent-support-tool-metadata.unit.test.ts` — assert
  `AGENT_SUPPORT_TOOL_METADATA` does NOT have keys `get-ontology`
  or `get-help`

**Acceptance Criteria**:

1. Test fails because metadata entries still exist

### 1.5: Tool-specific help for removed tools returns error

**Tests** (in `sdk:src/mcp/tool-help-lookup.unit.test.ts` — matches
the WS3.2 relocation target; import path starts as
`./aggregated-help/help-content.js`, updated to `./tool-help-lookup.js`
in WS3.2):

- assert `getToolSpecificHelp('get-ontology')` returns `isError: true`
- assert `getToolSpecificHelp('get-help')` returns `isError: true`

**Acceptance Criteria**:

1. Tests fail because `get-ontology` and `get-help` are still in
   `AGGREGATED_TOOL_NAMES`

**Deterministic Validation (end of WS1)**:

```bash
pnpm type-check
# Expected: exit 0

pnpm vitest run --reporter=verbose packages/sdks/oak-curriculum-sdk/src/mcp/ 2>&1 | grep -c 'FAIL'
# Expected: >0 (new tests failing)
```

---

## WS2 — Implementation (GREEN)

All tests MUST PASS at the end of WS2. Removals are atomic — defs,
handlers, and type expectations change together to avoid broken
intermediate states.

### 2.1: Atomic removal of standalone tools + dead modules

`AggregatedToolName` derives from `keyof typeof AGGREGATED_TOOL_DEFS`.
The handler map is typed against that union. Defs, handlers, metadata,
imports, and now-orphaned modules must change together to avoid broken
intermediate states and to satisfy the 2.4 deterministic validation
(no `get-ontology|get-help` matches in non-test source).

**Files** (atomic changeset):

| File | Change |
|---|---|
| `sdk:src/mcp/universal-tools/definitions.ts` | Remove `get-ontology` and `get-help` entries + imports |
| `sdk:src/mcp/universal-tools/executor.ts` | Remove `get-ontology` and `get-help` handler entries + imports |
| `sdk:src/mcp/agent-support-tool-metadata.ts` | Remove both metadata entries |
| `sdk:src/mcp/aggregated-help/help-content.ts` | Remove both from `AGGREGATED_TOOL_NAMES` list; update error message to reference `get-curriculum-model`; delete `getGeneralHelp()` (dead after removal — only consumer was `aggregated-help/execution.ts`) |
| `sdk:src/mcp/aggregated-ontology.ts` | **Delete** — `GET_ONTOLOGY_TOOL_DEF`, `runOntologyTool()` only consumed by definitions.ts/executor.ts (removed above). `ontologyData` is imported directly by `curriculum-model-data.ts` from `ontology-data.ts`. |
| `sdk:src/mcp/aggregated-help/definition.ts` | **Delete** — `GET_HELP_TOOL_DEF` only consumed by definitions.ts (removed above) |
| `sdk:src/mcp/aggregated-help/execution.ts` | **Delete** — `handleHelpTool`, `validateHelpArgs` only consumed by executor.ts (removed above) |
| `sdk:src/mcp/aggregated-help/index.ts` | **Delete** or reduce to re-export of `getToolSpecificHelp` only (pending 3.2 relocation) |

> **Workspace prefix convention**: `sdk:` = `packages/sdks/oak-curriculum-sdk/`,
> `app:` = `apps/oak-curriculum-mcp-streamable-http/`,
> `codegen:` = `packages/sdks/oak-sdk-codegen/`.
> **Atomic commit strategy**: WS2.1 MUST be a single commit. If
> `type-check` fails, revert the full changeset and re-apply atomically.
> Do not split across commits — the type union change makes any partial
> state uncompilable.

**Deterministic Validation**:

```bash
pnpm type-check
# Expected: exit 0 (type union updated, handler map consistent, no dangling imports)

pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/universal-tools.unit.test.ts
# Expected: new tests pass, old get-ontology/get-help descriptor tests removed
```

### 2.2: Remove ontology resource + dead module

**Files**:

| File | Change |
|---|---|
| `app:src/register-resources.ts` | Remove `registerOntologyResource` function and call, remove `ONTOLOGY_RESOURCE`/`getOntologyJson` imports |
| `sdk:src/public/mcp-tools.ts` | Remove `ONTOLOGY_RESOURCE`/`getOntologyJson` re-exports |
| `sdk:src/mcp/ontology-resource.ts` | **Delete** — `ONTOLOGY_RESOURCE`, `getOntologyJson` have no remaining consumers after above removals |

> **Public API note**: removing `ONTOLOGY_RESOURCE`/`getOntologyJson` from
> `mcp-tools.ts` is a breaking change to the SDK's public surface. This is
> intentional — these are replaced by `CURRICULUM_MODEL_RESOURCE`. Record
> in release notes.

**Deterministic Validation**:

```bash
pnpm type-check
# Expected: exit 0

pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/register-resources
# Expected: exit 0, no ontology resource assertions
```

### 2.3: Fix resource metadata forwarding

All resource registrations must forward all fields from the resource
definition object. The MCP spec and SDK decide field validity.

Currently silently dropped: `annotations` (curriculum model resource),
`title` (documentation resources). Both are defined in the SDK resource
objects but cherry-picked away at the app registration boundary.

**Pattern**: Use destructuring spread for forward compatibility:

```typescript
const { name, uri, ...metadata } = CURRICULUM_MODEL_RESOURCE;
server.registerResource(name, uri, metadata, () => ...);
```

This ensures any future fields added to resource definitions flow
through automatically.

**Files**:

| File | Change |
|---|---|
| `app:src/register-resources.ts` | Replace cherry-picked metadata with spread pattern for all resource registrations (`registerCurriculumModelResource` and `registerDocumentationResources`) |

**Deterministic Validation**:

```bash
pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/register-resources
# Expected: exit 0, annotation forwarding tests pass
```

### 2.4: Update all codebase references

All references to `get-ontology` and `get-help` as callable tools must
be updated or removed. Search for all instances:

```bash
rg 'get-ontology|get-help' --type ts -l 2>/dev/null
rg 'get-ontology|get-help' --type md -l 2>/dev/null
```

**Key source files**:

| File | Change |
|---|---|
| `sdk:src/mcp/aggregated-help/help-content.ts` | Update `toolName: 'get-help'` → `'get-curriculum-model'`, `annotationsTitle` → `'Get Curriculum Model'`, error message → reference `get-curriculum-model` |
| `sdk:src/mcp/tool-guidance-data.ts` | Update `agentSupport` category: remove old tools, update description and `whenToUse` |
| `sdk:src/mcp/prerequisite-guidance.ts` | Remove fallback references to standalone tools |
| `sdk:src/mcp/mcp-prompt-messages.ts` | Remove references to standalone tools |
| `codegen:src/mcp/property-graph-data.ts` | Update `seeOntology`, `combinedWith` cross-references |
| `sdk:src/mcp/documentation-resources.ts` | Update workflow references |
| `sdk:src/mcp/aggregated-thread-progressions.ts` | Update description cross-reference |
| `app:src/register-resources.ts` widget description | Verify references only `get-curriculum-model` |
| Codegen generators (`seeAlso` fields) | `codegen:src/bulk/generators/build-tool-definition.ts`, `codegen:src/bulk/generators/build-tool-handler.ts`, `codegen:src/bulk/generators/build-tool-input-schema.ts`, `codegen:src/vocab-gen/generators/build-vocab-tool-definition.ts`, `codegen:src/vocab-gen/generators/build-vocab-tool-handler.ts` |
| Codegen generators (`seeAlso` in prerequisite graph) | `codegen:src/bulk/generators/prerequisite-graph-generator.ts` AND `codegen:src/vocab-gen/generators/prerequisite-graph-generator.ts` — both copies contain `'Use get-ontology for the property graph.'` in `seeAlso` builder. Both must be updated in parallel (known duplication). |

**Deterministic Validation**:

```bash
rg 'get-ontology|get-help' --type ts packages/sdks/ apps/ 2>/dev/null | grep -v test | grep -v '.plan.' | grep -v archive
# Expected: NO MATCHES in non-test source files (excluding archive/plan)

rg 'get-ontology|get-help' --type md packages/sdks/ apps/ .agent/ 2>/dev/null | grep -v '.plan.' | grep -v archive | grep -v completed
# Expected: NO MATCHES in markdown source files (including .agent/, excluding archive/plan/completed)

pnpm sdk-codegen
# Expected: exit 0, generated files updated
```

### 2.5: Update and remove tests

| Test File | Change |
|---|---|
| `get-ontology.e2e.test.ts` | Delete — but first backfill coverage into `get-curriculum-model.e2e.test.ts`: (a) add ks2/ks3 key stage assertions, (b) add workflow content assertions (`findLessons`, `browseSubject`) |
| `get-help-tool.e2e.test.ts` | Delete — but first backfill: (a) unknown `tool_name` error path E2E assertion into `get-curriculum-model.e2e.test.ts` |
| `ontology-resource.unit.test.ts` | Delete |
| `universal-tools.unit.test.ts` | Remove get-ontology/get-help descriptor tests |
| `universal-tools.integration.test.ts` | Remove get-ontology/get-help tests |
| `universal-tools-executor.integration.test.ts` | Remove get-ontology call |
| `agent-support-tool-metadata.unit.test.ts` | Remove metadata tests for removed tools |
| `documentation-resources.unit.test.ts` | Update assertions |
| `mcp-prompts.unit.test.ts` | Update assertions |
| `server.e2e.test.ts` | Update tool list if still references old tools |
| `widget-metadata.e2e.test.ts` | Update aggregated tool list |
| `aggregated-help.unit.test.ts` | **Delete** — all imports point to modules deleted in 2.1. Relocate drift-detection test (lines 161-168) to `universal-tools.unit.test.ts`: iterate `AGGREGATED_TOOL_DEFS` keys, call `getToolSpecificHelp(name)`, assert no error |

**Deterministic Validation**:

```bash
pnpm vitest run packages/sdks/oak-curriculum-sdk/
# Expected: exit 0, all SDK tests pass

pnpm test:e2e
# Expected: exit 0, all E2E tests pass
```

---

## WS3 — Cleanup and Quality Fixes (REFACTOR)

Tests MUST remain green. No behavioural changes.

### 3.1: Fix pre-existing `as` assertions (~21 total)

| File | Count | Approach |
|---|---|---|
| `app:e2e-tests/server.e2e.test.ts` | ~9 | Replace with **concrete** Zod schemas matching MCP protocol shapes (e.g. `z.object({ result: z.object({ tools: z.array(ToolListItemSchema) }) })`). Do NOT use `z.record(z.string(), z.unknown())` — that replicates the same type violation. Test-only Zod schemas are test infrastructure; keep them local to the test file, do not export from SDK. |
| `app:src/register-resources.integration.test.ts` | ~12 | Root cause: `as unknown as ResourceRegistrar` double-cast at line 47. Fix by defining a `CapturedResource` interface matching what the mock stores, type the map as `Map<string, CapturedResource>`. This eliminates ~11 downstream casts. The remaining double-cast for the mock itself may need `satisfies` or a narrower fake interface matching the specific `registerResource` overload under test. |

> **Note**: `widget-metadata.e2e.test.ts` and `get-curriculum-model.e2e.test.ts`
> also have `as` assertions — out of scope for this plan but noted as
> remaining tech debt.

**Deterministic Validation**:

```bash
rg ' as ' apps/oak-curriculum-mcp-streamable-http/e2e-tests/server.e2e.test.ts 2>/dev/null | grep -v 'as const' | grep -v 'as well'
# Expected: NO MATCHES

rg ' as ' apps/oak-curriculum-mcp-streamable-http/src/register-resources.integration.test.ts 2>/dev/null | grep -v 'as const'
# Expected: NO MATCHES
```

### 3.2: Fix dependency inversion

`curriculum-model-data.ts` imports from `aggregated-help/help-content.ts`,
creating a back-edge. The circular import prevents deriving
`AGGREGATED_TOOL_NAMES` from the canonical source.

**Decision (locked)**: Move `getToolSpecificHelp` (and its helpers:
`findToolCategory`, `getRelatedWorkflows`, `buildBaseHelp`, etc.) to a
new shared module at `sdk:src/mcp/tool-help-lookup.ts`. This is
preferred over inlining because the function has ~6 helper functions —
too much logic to inline cleanly. The new module:

- Eliminates the misleading `aggregated-help/` directory name
- Resolves the dependency direction concern
- Keeps the function testable in isolation
- **Must derive tool names from `AGGREGATED_TOOL_DEFS`** — import
  `AGGREGATED_TOOL_DEFS` from `universal-tools/definitions.ts` and
  derive names via `Object.keys()` (or `typeSafeKeys`). The manual
  `AGGREGATED_TOOL_NAMES` array (`readonly string[]`) is deleted. This
  eliminates the type widening and drift risk. The circular dependency
  that previously prevented this import is broken by the relocation.

After relocation, `aggregated-help/` is fully deletable (all other
files already deleted in 2.1). Delete the directory.

> **Single commit**: In one commit: (a) create `tool-help-lookup.ts`
> with `getToolSpecificHelp` and helpers, (b) update
> `curriculum-model-data.ts` import path, (c) update
> `tool-help-lookup.unit.test.ts` import path, (d) delete
> `aggregated-help/` directory. No intermediate state where
> `curriculum-model-data.ts` imports from a deleted module.

**Deterministic Validation**:

```bash
pnpm type-check
# Expected: exit 0

pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/curriculum-model-data.unit.test.ts
# Expected: exit 0

pnpm vitest run packages/sdks/oak-curriculum-sdk/src/mcp/tool-help-lookup.unit.test.ts
# Expected: exit 0

# Confirm aggregated-help/ directory no longer exists:
test ! -d packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help && echo "PASS" || echo "FAIL"
# Expected: PASS
```

### 3.3: Fix stale comments and TSDoc

> Line numbers approximate — WS2 edits may shift them. Verify with `rg`
> at execution time.

| File | Line | Current | Should Be |
|---|---|---|---|
| `sdk:src/mcp/universal-tools/list-tools.ts` | 17 | `(search, fetch, get-ontology, get-help)` | Reflect actual tool set |
| `sdk:src/mcp/universal-tools/types.ts` | 64 | `search, fetch, get-ontology, get-help (hand-written)` | Reflect actual tool set |
| `sdk:src/mcp/universal-tools/executor.ts` | 199 | `(search, fetch, get-ontology, get-help)` | Reflect actual tool set |
| `codegen:code-generation/typegen/mcp-tools/parts/emit-index.ts` | 44 | `(get-ontology, get-help)` | Reflect actual tool set or `agent-support tools` |
| `sdk:src/mcp/tool-guidance-workflows.ts` | 6 | TSDoc: `included in...the get-help tool output` | Reference `get-curriculum-model` |

### 3.4: Verify idempotency timestamp

`execution.unit.test.ts` passes `timestamp: Date.now()` to
`formatToolResponse`. Verify timestamp does not leak into
`structuredContent` comparison. If it does, fix the boundary.

### 3.5: Verify no orphaned modules remain

Module deletion is now folded into WS2 (2.1 and 2.2) to resolve
the validation conflict between 2.4's "no matches" sweep and deferred
deletion. After 3.2 relocates `getToolSpecificHelp`, the `aggregated-help/`
directory is fully deleted.

**Surviving modules** (keep):

| Module | Reason |
|---|---|
| `sdk:src/mcp/ontology-data.ts` | Used by `curriculum-model-data.ts` |
| `sdk:src/mcp/tool-guidance-data.ts` | Used by `curriculum-model-data.ts` and `documentation-resources.ts` |
| `sdk:src/mcp/tool-help-lookup.ts` | Created in 3.2; used by `curriculum-model-data.ts` |

**Deterministic Validation**:

```bash
pnpm type-check
# Expected: exit 0 (no dangling imports)

# Confirm deleted modules are gone:
test ! -f packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-ontology.ts && echo "PASS" || echo "FAIL"
test ! -f packages/sdks/oak-curriculum-sdk/src/mcp/ontology-resource.ts && echo "PASS" || echo "FAIL"
test ! -d packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help && echo "PASS" || echo "FAIL"
# Expected: all PASS
```

---

## WS4 — Quality Gates

> See [Quality Gates component](../../templates/components/quality-gates.md)

**After each task** (WS1-WS3):

```bash
pnpm type-check && pnpm lint && pnpm test
```

**After WS3 completion** (full chain):

```bash
pnpm clean && pnpm sdk-codegen && pnpm build && pnpm type-check && \
pnpm format:root && pnpm markdownlint:root && pnpm lint:fix && \
pnpm test && pnpm test:ui && pnpm test:e2e && pnpm smoke:dev:stub
```

Every gate MUST pass. There is no such thing as an acceptable failure.

---

## WS5 — Adversarial Review

> See [Adversarial Review component](../../templates/components/adversarial-review.md)

Invoke: `code-reviewer` (gateway), `architecture-reviewer-barney`,
`architecture-reviewer-fred`, `architecture-reviewer-wilma`,
`test-reviewer`, `type-reviewer`, `docs-adr-reviewer`.

The replacement is a significant structural change: tool removal,
resource removal, metadata forwarding fix, ~21 assertion replacements,
SDK public API surface change, and cross-workspace boundary fix.

Document findings. Create follow-up plan if BLOCKERs found.

### WS5 Outcomes

**All 7 specialists invoked. No blockers found. Verdicts:**

| Specialist | Verdict | Key finding |
|---|---|---|
| `code-reviewer` | APPROVED WITH SUGGESTIONS | Pre-existing `as` casts in `widget-metadata.e2e.test.ts` (3); stale `@todo` in `universal-tools.unit.test.ts` — both addressed in WS6. Drift-detection pattern and negative testing at all levels praised. |
| `test-reviewer` | PASS (2 improvements) | Stale `@todo` (fixed in WS6). Pre-existing `as` casts in `widget-metadata.e2e.test.ts` (follow-up). TDD cycle evidence confirmed via napkin. |
| `type-reviewer` | SAFE | Zero `as Type` / `any` / `!` / `@ts-ignore` in changeset. Type flow from `AGGREGATED_TOOL_DEFS` via `keyof typeof` is mechanically sound. ISP pattern, readonly→mutable spread, Zod-first E2E validation all correct. |
| `architecture-reviewer-barney` | 2 MEDIUM, 2 LOW | (1) `ontologyData` embeds workflows AND `toolGuidance` returns workflows — duplication in payload. (2) Barrel import creates broad transitive edge (accepted — see Fred ruling below). (3) Residual rename drift in docs/tests (addressed in WS6). (4) No E2E `resources/read` for `curriculum://model` (minor gap). |
| `architecture-reviewer-fred` | ISSUES FOUND (docs only) | Runtime code COMPLIANT — all import directions correct. Barrel import ruling: KEEP for consistency across all 4 directory-based aggregated tools. All 5 ADRs with stale refs identified and prioritised (addressed in WS6). |
| `architecture-reviewer-wilma` | ISSUES FOUND (budget + type cycle) | (1) 70KB test validates `ontologyData` alone, not combined payload — a 90KB combined test exists in `curriculum-model-data.unit.test.ts` but stale `@todo` on ontology test was misleading (removed in WS6). (2) Latent type-only cycle through `tool-guidance-types` → `universal-tools/types` → `definitions` (no runtime impact, erased at compile). (3) Unknown `tool_name` returns base orientation: CORRECT — more useful than error. |
| `docs-adr-reviewer` | CRITICAL DRIFT | 54 stale references across 10 documents catalogued (3 P0, 3 P1, 4 P2). All addressed in WS6. |

**Architectural decisions confirmed by review:**

- Barrel import in `definitions.ts`: **KEEP** (Fred — consistency across all 4 barrel-based aggregated tools; tree-shaking eliminates unused `execution.ts`)
- Unknown `tool_name` returning base orientation (not error): **CORRECT** (Wilma — agent still gets full orientation and can see available tools)
- `isKnownAggregatedTool` removal: **SOUND** (Fred, Wilma — guidance data is the correct single source of truth; drift-detection test covers alignment)

**Follow-ups identified (not blocking this plan):**

1. `widget-metadata.e2e.test.ts` — 3 pre-existing `as` casts should migrate to Zod pattern (matches sibling E2E files)
2. Latent type-only cycle: `tool-guidance-types` → `universal-tools/types` → `definitions` (no runtime impact; consider breaking if adding value imports)
3. `ontologyData.workflows` duplication in combined payload (Barney — domain model and toolGuidance both carry workflows)
4. No E2E `resources/read` test for `curriculum://model` (Barney — integration tests cover registration, but E2E read would fully lock contract)

---

## WS6 — Documentation Propagation

> See [Documentation Propagation component](../../templates/components/documentation-propagation.md)

| Document | Update |
|---|---|
| **ADRs** | |
| ADR-058 (`context-grounding-for-ai-agents.md`) | **Structural rewrite** — foundational context-grounding ADR with 15+ refs to old tools. Decision, Rationale, Implementation, and Consequences sections all reference `get-ontology`/`get-help`. Core idea (multi-layered grounding) unchanged; implementation simplified to single tool. Mark "Accepted (Revised)". |
| ADR-059 (`knowledge-graph-for-agent-context.md`) | Update 3 refs: Context section, comparison table, `seeOntology` code example. Knowledge graph data now lives within `get-curriculum-model` response. |
| ADR-060 (`agent-support-metadata-system.md`) | **Structural rewrite** — code examples show three-tool metadata object, "Generated Outputs" shows three-tool instructions, "Adding a New Tool" uses old set. Pattern unchanged; tool set simplified. Mark "Accepted (Revised)". |
| ADR-061 (`widget-cta-system.md`) | Update note at line 13 ("get-ontology and get-help remain") — factually wrong after replacement. Low impact (superseded ADR) but note was added for currency. |
| ADR-108 (`sdk-workspace-decomposition.md`) | Update WS4 aggregated tools list at line 222. |
| ADR-119 (`agentic-engineering-practice.md`) | No change — affects domain tooling, not practice methodology. Confirmed: no tool name refs. |
| **Specification and reference docs** | |
| `agent-support-tools-specification.md` | **Structural rewrite** — entire doc assumes three-tool architecture (line 9-11 tool list, metadata code block, Quick Start section, tool-guidance-data examples). Simplifies significantly with one orientation tool. |
| **Prompts and templates** | |
| Session prompt (`archive/session-continuation.prompt.md`) | Archived after release completion |
| `.agent/prompts/semantic-search/semantic-search.prompt.md` | Update line 406: "agent context injection via the `get-ontology` MCP tool" → `get-curriculum-model` |
| `.agent/plans/semantic-search/templates/ground-truth-session-template.md` | Update lines 50, 405: "Call `get-help`" → `get-curriculum-model` |
| **READMEs** | |
| Collection README | Update tool count and description |
| `active/README.md` | Update plan status |
| `apps/oak-curriculum-mcp-streamable-http/docs/widget-rendering.md` | Update grounding references to `get-curriculum-model` |
| `packages/sdks/oak-sdk-codegen/src/synonyms/README.md` | **Framing rewrite** — "Architectural Framing" section built around synonyms injected into `get-ontology` response; consumer chain references `get-ontology` as primary consumer. Update to `get-curriculum-model` path. |
| `apps/oak-search-cli/src/lib/search-quality/ground-truth/GROUND-TRUTH-GUIDE.md` | Update references to `get-help` |
| **Practice** | |
| `.agent/practice-core/practice.md` | No change expected — confirmed: no tool name refs. |
| **Release** | |
| SDK release notes | Document breaking change: `ONTOLOGY_RESOURCE`/`getOntologyJson` removed from public surface, replaced by `CURRICULUM_MODEL_RESOURCE`. Include migration note: "Replace with `CURRICULUM_MODEL_RESOURCE`/`getCurriculumModelJson`." |
| Session napkin | Record outcomes |

Run `/jc-consolidate-docs` before marking complete.

---

## Risk Assessment

> See [Risk Assessment component](../../templates/components/risk-assessment.md)

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| Broken intermediate state during removal | Medium | Type-check fails, CI red | Atomic changeset in 2.1: defs + handlers + type union change together |
| Missed reference to old tool names | Medium | Stale guidance confuses agents | `rg` sweep with deterministic validation commands; codegen regeneration |
| Resource metadata forwarding breaks clients | Low | Clients receive unexpected fields | MCP SDK validates; our change is additive (forwarding what was defined but dropped) |
| Pre-existing `as` assertion replacement introduces bugs | Low | Test reliability degrades | Replace with Zod validation — stricter than `as`, catches more |
| SDK public API break (removed exports) | Medium | External consumers of `ONTOLOGY_RESOURCE`/`getOntologyJson` break | Intentional replacement; document in release notes; `CURRICULUM_MODEL_RESOURCE` is the successor |
| Payload size growth over time | Low | Ontology grows → context budget pressure | Currently ~68KB (13% of 128K). Consider adding a unit test threshold (e.g. fail if `getCurriculumModelJson().length > 100_000`) as a regression check |
| Circular dependency resurfaces after refactor | Medium | Runtime import failure | Type-check + vitest in validation; dependency inversion fix in 3.2 |
| Payload size increases from including all ontology fields | Low | Agent context budget pressure | Already measured at ~68KB (13% of 128K). Content gap fix adds 6 fields, marginal increase |

**System-Level Thinking**:

1. **Why are we doing this?** Agents get complete orientation in one
   call; two-tool workaround eliminated.
2. **Why does that matter?** Simpler agent integration, fewer failure
   modes, single source of truth for curriculum guidance.
3. **What if we don't?** Three tools doing overlapping work, guidance
   drift between them, agents confused about which to call.

---

## Dependencies

**Blocking** (must be done before WS2):

- None — `get-curriculum-model` is fully implemented and tested.

**Ordering constraints within WS2**:

- 2.1 (atomic removal) must precede 2.4 (reference updates) and 2.5
  (test updates) — type union change affects what compiles.
- 2.2 and 2.3 both modify `app:src/register-resources.ts` — conceptually
  independent but practically serial to avoid merge conflicts.
- 2.3 (metadata forwarding) is independent of tool removal.
- 2.4 and 2.5 both touch shared files — practically serial after 2.1.

**Related Plans**:

- [WS2+WS3: Pedagogical Review Checkpoint](../future/ws2-ws3-pedagogical-review-checkpoint.plan.md) — future vocabulary review, depends on production usage data from this plan's completion.

---

## Foundation Alignment

Before starting each phase, re-read and verify compliance with:

- [principles.md](../../../directives/principles.md) — TDD, quality gates, no
  type shortcuts, no compatibility layers, replace old with new
- [testing-strategy.md](../../../directives/testing-strategy.md) — test
  behaviour not implementation, no complex mocks, no skipped tests
- [schema-first-execution.md](../../../directives/schema-first-execution.md) — types from schema, validate at boundaries

**Per-phase checklist**:

- [ ] WS1: Do new tests assert behaviour, not implementation details?
- [ ] WS2: Are removals atomic? Does type-check pass at every commit?
- [ ] WS3: Do refactored tests use Zod validation, not `as` assertions?
- [ ] WS4: Did every gate pass? Were any run with `--force`?

**Compliance checklist (end of plan)**:

- [ ] Cardinal Rule: All types derive from schema via `pnpm sdk-codegen`
- [ ] No Compatibility Layers: Old tools replaced, not wrapped
- [ ] No Type Shortcuts: Zero `as` assertions (except `as const`)
- [ ] Simple Mocks: Fakes injected as arguments, no complex mock frameworks
- [ ] Generator First: Changes made in templates, not generated output

---

## Post-Completion Assessment (2026-03-01)

Live assessment of all 30 oak-local MCP tools via `CallMcpTool`.

### Verified

- `get-curriculum-model` present, returns ~40KB combined orientation (domain model + tool guidance)
- `get-curriculum-model` with `tool_name: "search"` returns base orientation + tool-specific help
- `get-curriculum-model` with unknown `tool_name` returns base orientation (no error) — confirmed WS5 decision
- `curriculum://model` resource returns identical data to the tool
- `get-ontology` and `get-help` absent from tool list
- `curriculum://ontology` absent from resource list
- SERVER_INSTRUCTIONS reference `get-curriculum-model` only
- 28/30 tools returned 200 on representative calls
- `search` across all scopes (lessons, units, threads, sequences, suggest) working
- Suggest now returns results: `search(text: "frac", scope: "suggest", subject: "maths")` returned 10 suggestions

### Issues Found

1. **`get-lessons-transcript` and `get-lessons-assets` return 400 for many lessons** —
   ROOT CAUSE IDENTIFIED (via GitHub source review of `oaknational/oak-openapi`).
   The upstream API has a **third-party copyright licensing gate** in `queryGate.ts`.
   Transcript and assets endpoints use `checkLessonAllowedAsset` which is an
   **allowlist**: only `maths` is fully supported; other subjects require explicit
   unit-level or lesson-level entries in `supportedUnits.json` / `supportedLessons.json`.
   Summary and quiz endpoints use `blockLessonForCopyrightText` / `isBlockedUnitOrSubject`
   which is a **blocklist**: only `english` and `financial-education` are blocked.

   This explains why summary/quiz return 200 but transcript/assets return 400 for
   the same lesson. `types-of-volcanoes` is in the allowlist; `volcanoes-and-their-features`
   is not. The gate throws `TRPCError({ code: 'BAD_REQUEST' })` — the response body
   should include a reason string (e.g. "Transcript not available: {slug}" with cause).

   The upstream originally used HTTP 451 (Unavailable for Legal Reasons) but reverted
   to 400 because tRPC does not support 451. The `errorResponses: []` in the OpenAPI
   metadata means the 400 is undocumented in the spec.

   The `prisma:warn In production, we recommend using prisma generate --no-engine`
   warnings visible in Vercel logs are a **separate issue** — they also appear on 200
   responses and are not related to the content gate.

   **Impact on MCP server — upstream response text is LOST**: The upstream 400 body
   includes a reason string (e.g. `"Transcript not available: \"slug\""` with cause), but
   our generated `invoke` method in the SDK discards it. The flow:
   1. `invoke` receives HTTP 400 from upstream (with reason text in body)
   2. `resolveDescriptorForStatus(400)` finds no descriptor (only 200/404 are documented)
   3. Throws `TypeError('Undocumented response status 400 ... Documented statuses: 200, 404')`
      — **response body is never extracted** (line 101 `response.data`/`response.error` is unreachable)
   4. `mapErrorToResult` catches the TypeError, wraps as `McpParameterError` with code `PARAMETER_ERROR`
   5. MCP client sees: `"Undocumented response status 400 ..."` — no upstream reason

   Two fixes needed:
   - **Generated invoke**: For undocumented error statuses, extract `response.error` (or
     `response.data`) before throwing, and include it in the error message/cause
   - **mapErrorToResult**: Classify undocumented upstream statuses as `McpToolError`
     (not `McpParameterError`) — the request parameters were valid, the upstream rejected
     the content for licensing reasons

   **Source**: `oaknational/oak-openapi` — `src/lib/queryGate.ts`, `src/lib/handlers/transcript/transcript.ts`, `src/lib/handlers/assets/assets.ts`. Code comment dates the gate to Oct 2024, described as "short term fix".

### Observations

- `get-prerequisite-graph` returns 1.4MB (1,607 units, 3,452 edges). This is a
  large static dataset suited to being an optional MCP resource with appropriate
  annotations, matching the `curriculum://model` pattern.
- `get-thread-progressions` returns 179KB (164 threads). Also a candidate for
  the same resource pattern.
- All tool descriptions include prerequisite guidance referencing `get-curriculum-model`.

### Follow-Up Items (priority order for next session)

1. **Fix upstream error handling — COMPLETE (2026-03-01)**. All four changes implemented:
   (a) Generated `invoke` now preserves upstream response body for undocumented statuses via
   `UndocumentedResponseError` class (generated by `generate-undocumented-response-error-file.ts`,
   exported from `sdk-codegen/mcp-tools`). Captures `status`, `operationId`, `documentedStatuses`,
   `responseBody`, and extracted `upstreamMessage`.
   (b) `mapErrorToResult` classifies undocumented upstream statuses as `McpToolError` with three
   codes: `UPSTREAM_SERVER_ERROR` (5xx), `CONTENT_NOT_AVAILABLE` (400 + "blocked" in cause),
   `UPSTREAM_API_ERROR` (all other undocumented). Copyright-blocked content gets a clear message:
   "Resource unavailable due to copyright restrictions. The original may be viewed at
   <https://www.thenational.academy>".
   (c) App-layer logging via `logUpstreamErrorIfPresent` in `validation-logger.ts`, called from
   `tool-handler-with-auth.ts`. Structured WARN log with `toolName`, `status`, `operationId`,
   `classified`, `upstreamMessage`. `no-console: 'warn'` added to shared ESLint config.
   (d) **Open issue on `oaknational/oak-openapi`** — NOT YET DONE. Feature request to include
   error responses (400/4XX) in OpenAPI spec metadata. Separate task.

   Live verified against dev server: 4 scenarios (blocked transcript, blocked assets, nonexistent
   lesson, non-blocked quiz) all classified correctly.

2. **Resource pattern for large datasets** — IN PROGRESS. Two new resources implemented (`curriculum://prerequisite-graph`, `curriculum://thread-progressions`) following the `curriculum://model` pattern. All resource registrations fixed to use spread metadata (no cherry-picking). Lint errors remain in quality gates — tests need architectural fix (direct source comparison instead of JSON re-parsing). Execution notes were session-local and are now represented by the canonical roadmap and follow-on plans in this collection.

3. **Investigate MCP prompts** — NOT STARTED. Three prompts (`find-lessons`, `lesson-planning`, `progression-map`) may overlap with agent-facing resources. Need to assess whether they should be resources, removed, or redesigned. Consider adding a genuinely user-facing prompt (e.g. "adapt a lesson"). Track in canonical collection plans rather than ephemeral platform plan files.

---

## Session Provenance

- Implementation: [Pedagogical context implementation](f8ef668a-57e5-41ea-83a0-5ff6936d6944)
- Review and validation: [WS1 review and validation](46ddd53e-f696-4071-99bf-9d96ccd197e4)
- Plan consolidation, content gap fix, restructuring, and 6-specialist review: [Plan review and hardening](eee143e8-dfde-41f7-b3e7-246013bd7418)
- WS1-WS6 execution: [WS1 implementation](439ca3cf-a4e8-4dcd-b9b9-140e853a1d34)
- Post-completion MCP tool assessment: [Tool assessment](7a65b4b1-1b59-46df-9aee-430c4030c019)
- Upstream error handling fix: [Error handling](7e822a76-e479-4943-90f1-ddb496e63e57)
