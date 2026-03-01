---
name: MCP Prompts Cleanup
overview: "Rationalise MCP prompts: merge the duplicate progression prompts, register the orphaned explore-curriculum prompt, and ensure every prompt earns its place through the correct MCP channel."
todos:
  - id: phase-1-red
    content: "Phase 1 RED: Update E2E and unit tests to assert final state (4 prompts, no progression-map, explore-curriculum and learning-progression registered). All tests must fail."
    status: completed
  - id: phase-2-green
    content: "Phase 2 GREEN: Remove progression-map from SDK, add Zod schemas for explore-curriculum and learning-progression, register both at app layer. All tests must pass."
    status: completed
  - id: phase-3-refactor
    content: "Phase 3 REFACTOR: Full quality gates, verify no stale references, confirm consistency invariant (SDK count = app count = schema count = E2E assertion)."
    status: completed
  - id: phase-4-docs
    content: "Phase 4 DOCS: Create ADR-123 (MCP primitives strategy), update HTTP MCP README with primitives section, add condensed primitives summary to root README."
    status: completed
isProject: false
---

# Rationalise MCP Prompts

## Context

Five prompts are defined in the SDK but only three are registered at the app layer. Two of the five (`progression-map` and `learning-progression`) are near-duplicates. One (`explore-curriculum`) is defined but never registered -- dead code that no client can invoke. Everything defined must be registered, everything registered must be tested, and duplicates must be eliminated.

### MCP Spec Control Model (verified)

| Primitive     | Controller  | Our usage                                                                                                                           |
| ------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| **Tools**     | Model       | `get-curriculum-model` -- orientation data the model calls on-demand                                                                |
| **Resources** | Application | `curriculum://model`, `curriculum://prerequisite-graph`, `curriculum://thread-progressions` -- application-driven context injection |
| **Prompts**   | User        | Parameterised workflow templates users invoke explicitly (slash commands, UI buttons)                                               |

**Verdict**: All five prompts are genuine user-initiated workflow templates that orchestrate tools. They are the correct MCP primitive. The issue is not the channel -- it is dead code, duplication, and inconsistency.

### Current State

| Prompt                 | Defined in SDK | Registered at app | Has Zod schema | E2E tested |
| ---------------------- | -------------- | ----------------- | -------------- | ---------- |
| `find-lessons`         | Yes            | Yes               | Yes            | Yes        |
| `lesson-planning`      | Yes            | Yes               | Yes            | Yes        |
| `progression-map`      | Yes            | Yes               | Yes            | Yes        |
| `explore-curriculum`   | Yes            | **No**            | **No**         | **No**     |
| `learning-progression` | Yes            | **No**            | **No**         | **No**     |

### Target State

| Prompt                 | Defined     | Registered  | Schema      | E2E         | Notes                              |
| ---------------------- | ----------- | ----------- | ----------- | ----------- | ---------------------------------- |
| `find-lessons`         | Yes         | Yes         | Yes         | Yes         | Unchanged                          |
| `lesson-planning`      | Yes         | Yes         | Yes         | Yes         | Unchanged                          |
| `explore-curriculum`   | Yes         | Yes         | Yes         | Yes         | **Register and test**              |
| `learning-progression` | Yes         | Yes         | Yes         | Yes         | **Register and test**              |
| `progression-map`      | **Removed** | **Removed** | **Removed** | **Removed** | Subsumed by `learning-progression` |

### Why `progression-map` is subsumed by `learning-progression`

Both prompts accept `(concept, subject)` and guide the model through the same workflow:

1. Search threads for the concept in the subject
2. Retrieve thread progressions / prerequisite graph
3. Map the progression across year groups
4. Suggest scaffolding

`learning-progression` additionally references `get-thread-progressions` and `get-prerequisite-graph` resources explicitly, and includes "identify gaps" guidance. It is strictly more complete. There is no user workflow that `progression-map` serves that `learning-progression` does not.

---

## Files Affected

### SDK layer (`packages/sdks/oak-curriculum-sdk/src/mcp/`)

- `[mcp-prompts.ts](packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts)` -- Remove `progression-map` from `MCP_PROMPTS` array and `getPromptMessages` switch
- `[mcp-prompt-messages.ts](packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts)` -- Remove `getProgressionMapMessages` function
- `[mcp-prompts.unit.test.ts](packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.unit.test.ts)` -- Update: expect 4 prompts, remove progression-map tests

### App layer (`apps/oak-curriculum-mcp-streamable-http/src/`)

- `[register-prompts.ts](apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts)` -- Remove `progression-map` registration, add `explore-curriculum` and `learning-progression` registrations
- `[prompt-schemas.ts](apps/oak-curriculum-mcp-streamable-http/src/prompt-schemas.ts)` -- Remove `progressionMapArgsSchema`, add `exploreCurriculumArgsSchema` and `learningProgressionArgsSchema`

### E2E tests (`apps/oak-curriculum-mcp-streamable-http/e2e-tests/`)

- `[prompts.e2e.test.ts](apps/oak-curriculum-mcp-streamable-http/e2e-tests/prompts.e2e.test.ts)` -- Remove progression-map tests, add explore-curriculum and learning-progression tests

### Public exports (unchanged)

- `[mcp-tools.ts](packages/sdks/oak-curriculum-sdk/src/public/mcp-tools.ts)` -- No changes needed; already exports `MCP_PROMPTS`, `getPromptMessages`, `McpPrompt`

---

## Phase 1: RED -- Tests Assert Final State

Tests specify the desired end state. All tests MUST fail before Phase 2.

### Task 1.1: Update E2E tests

In `[prompts.e2e.test.ts](apps/oak-curriculum-mcp-streamable-http/e2e-tests/prompts.e2e.test.ts)`:

- Remove the `progression-map` test cases
- Add test: `prompts/list` returns `explore-curriculum`
- Add test: `prompts/get` for `explore-curriculum` with `{ topic: "volcanos" }` -- response contains "volcanos" and references `explore-topic`
- Add test: `prompts/list` returns `learning-progression`
- Add test: `prompts/get` for `learning-progression` with `{ concept: "algebra", subject: "maths" }` -- response contains "algebra" and "maths"
- Add test: `prompts/list` returns exactly 4 prompts (the most important assertion -- proves no stale prompts leak through)

**Expected failures**: `explore-curriculum` and `learning-progression` are not registered, so `prompts/list` will not include them. The exact-count test will fail (3 instead of 4).

### Task 1.2: Update SDK unit tests

In `[mcp-prompts.unit.test.ts](packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.unit.test.ts)`:

- Remove `has progression-map prompt` test
- Add test: `MCP_PROMPTS has exactly 4 entries`
- Add test: `getPromptMessages('progression-map', ...)` returns empty array (prove it is gone)
- Existing `explore-curriculum` and `learning-progression` tests remain (they already pass since these are defined in SDK)

**Expected failures**: exact-count test fails (5 instead of 4), progression-map-returns-empty test fails (it still returns messages).

### Task 1.3: Run tests, confirm RED

```bash
pnpm test --filter oak-curriculum-sdk -- --testPathPattern mcp-prompts
pnpm test:e2e -- --testPathPattern prompts
```

Both MUST fail. If they pass, the tests are not asserting the right thing.

**Acceptance criteria**:

- E2E tests fail because explore-curriculum/learning-progression are not registered
- Unit test fails because MCP_PROMPTS still has 5 entries
- Unit test fails because getPromptMessages('progression-map') still returns messages

---

## Phase 2: GREEN -- Minimal Implementation

Make all RED tests pass with minimal changes.

### Task 2.1: Remove `progression-map` from SDK

In `[mcp-prompts.ts](packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompts.ts)`:

- Remove the `progression-map` entry from `MCP_PROMPTS` array
- Remove the `'progression-map'` case from `getPromptMessages` switch
- Remove the `getProgressionMapMessages` import

In `[mcp-prompt-messages.ts](packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts)`:

- Delete the `getProgressionMapMessages` function and its export

### Task 2.2: Add Zod schemas for new prompts

In `[prompt-schemas.ts](apps/oak-curriculum-mcp-streamable-http/src/prompt-schemas.ts)`:

- Remove `progressionMapArgsSchema` and its entry in `PROMPT_SCHEMAS`
- Add `exploreCurriculumArgsSchema`: `{ topic: z.string(), subject: z.string().optional() }`
- Add `learningProgressionArgsSchema`: `{ concept: z.string(), subject: z.string() }`
- Update `PROMPT_SCHEMAS` map to include both new schemas

### Task 2.3: Update prompt registration

In `[register-prompts.ts](apps/oak-curriculum-mcp-streamable-http/src/register-prompts.ts)`:

- Remove `progression-map` registration block
- Add `explore-curriculum` registration with `exploreCurriculumArgsSchema`
- Add `learning-progression` registration with `learningProgressionArgsSchema`
- Descriptions should match the SDK definitions in `MCP_PROMPTS`

### Task 2.4: Run tests, confirm GREEN

```bash
pnpm test --filter oak-curriculum-sdk -- --testPathPattern mcp-prompts
pnpm test:e2e -- --testPathPattern prompts
```

All tests MUST pass.

**Acceptance criteria**:

- SDK unit tests: 4 prompts defined, progression-map returns empty, all message generators work
- E2E tests: 4 prompts discoverable via prompts/list, prompts/get works for all 4
- No test failures anywhere

---

## Phase 3: REFACTOR -- Quality Gates and Cleanup

### Task 3.1: Run full quality gate chain

```bash
pnpm build
pnpm type-check
pnpm lint:fix
pnpm format:root
pnpm markdownlint:root
pnpm test
pnpm test:e2e
pnpm test:ui
pnpm smoke:dev:stub
```

All gates MUST pass.

### Task 3.2: Verify no stale references

Search the codebase for any remaining references to `progression-map` (excluding git history and archive files):

```bash
rg 'progression-map' --type ts --type md -l 2>/dev/null
```

Expected: no hits in active source or docs (archive files are acceptable).

### Task 3.3: Verify consistency invariant

The number of prompts defined in the SDK MUST equal the number registered at the app layer. Verify:

- `MCP_PROMPTS` in `mcp-prompts.ts` has 4 entries
- `register-prompts.ts` registers 4 prompts
- `PROMPT_SCHEMAS` in `prompt-schemas.ts` has 4 entries
- `prompts/list` E2E test asserts exactly 4

---

## Phase 4: DOCS -- ADR and README Updates

Document what the server provides through each MCP primitive type, why, and what impact each is intended to have.

### Task 4.1: Create ADR-123 -- MCP Server Primitives Strategy

New ADR at `[docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md](docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md)`.

**Context**: The MCP spec defines three server primitives with distinct control models. Our server uses all three. No existing ADR documents the overall strategy for how we map our curriculum capabilities to these primitives. ADR-058 covers context grounding (the dual-exposure pattern for orientation data) but not the broader primitives strategy.

**Decision**: Document our concrete mapping of curriculum capabilities to MCP primitives:

- **Tools** (model-controlled): 30 generated curriculum tools (search, browse, fetch) + 1 aggregated tool (`get-curriculum-model` for orientation). The model decides when to call them. Generated from the OpenAPI schema at SDK compile time. Intent: let AI assistants search, browse, and fetch curriculum data autonomously. Impact: agents can answer teacher questions about the curriculum without human tool orchestration.
- **Resources** (application-controlled): `curriculum://model` (orientation, `priority: 1.0`, `audience: ["assistant"]`), `curriculum://prerequisite-graph` (unit dependency data), `curriculum://thread-progressions` (learning progression data). The host application decides whether/how to inject these. Intent: clients that support resource auto-injection get orientation data without a tool call. Impact: reduced latency for first-turn responses in capable clients.
- **Prompts** (user-controlled): `find-lessons`, `lesson-planning`, `explore-curriculum`, `learning-progression`. Parameterised workflow templates the user explicitly invokes. Intent: structure common teacher workflows so the model follows a proven multi-step recipe instead of improvising. Impact: consistent, high-quality responses for the four most common curriculum queries. Each prompt references `get-curriculum-model` as its first step.

**Selection criteria for prompts**: A prompt earns its place when it (a) orchestrates multiple tools in a specific sequence, (b) serves a distinct user intent not covered by another prompt, and (c) adds structure the user would otherwise have to describe manually.

**Deduplication decision**: `progression-map` and `learning-progression` were near-duplicates (same args, same tool sequence, same output shape). `learning-progression` is strictly more complete. `progression-map` was removed.

**Relationship to ADR-058**: ADR-058 covers the context grounding strategy (dual exposure of orientation data as tool + resource). This ADR covers the broader question of how all three primitive types work together to serve the overall product intent.

**Acceptance criteria**:

- ADR follows the repo ADR format (Status, Context, Decision, Consequences)
- Covers all three MCP primitives with concrete examples from our server
- Documents the prompt selection criteria and deduplication rationale
- References ADR-058 for the context grounding detail
- ADR index (`docs/architecture/architectural-decisions/README.md`) updated

### Task 4.2: Update HTTP MCP server README

In `[apps/oak-curriculum-mcp-streamable-http/README.md](apps/oak-curriculum-mcp-streamable-http/README.md)`, add a new section **"What This Server Provides"** after the opening paragraph and before "Quick start (local)". This section should cover:

**MCP Primitives** -- Explain the three MCP primitive types and their control models (one short paragraph each):

- **Tools**: 30 generated curriculum tools + `get-curriculum-model`. Model-controlled. The AI decides when to call them. Generated from the OpenAPI schema. Teachers ask questions; the AI uses tools to answer.
- **Resources**: `curriculum://model`, `curriculum://prerequisite-graph`, `curriculum://thread-progressions`. Application-controlled. Host apps that support resource injection can pre-load orientation and reference data. Annotated with `priority: 1.0` and `audience: ["assistant"]` per MCP spec.
- **Prompts**: `find-lessons`, `lesson-planning`, `explore-curriculum`, `learning-progression`. User-controlled. Users invoke these as slash commands or UI actions to trigger structured multi-step workflows. Each orchestrates multiple tools in a proven sequence.

**Intent and Impact** -- One paragraph explaining the overall design intent: tools give the AI autonomous access to curriculum data, resources give capable clients pre-loaded context, and prompts give users structured entry points for common tasks. Together, they serve the goal of making Oak's curriculum discoverable and usable through AI assistants, helping teachers find, understand, and adapt high-quality curriculum resources.

Reference ADR-123 and ADR-058 for architectural detail.

**Acceptance criteria**:

- README explains all three MCP primitive types with concrete examples from our server
- States the intent and desired impact
- References the ADRs
- Does not duplicate operational content already in the README (auth, deployment, testing)
- Passes `pnpm markdownlint:root`

### Task 4.3: Update root README

In `[README.md](README.md)`, add a condensed "MCP Server Capabilities" subsection inside the existing "What This Repo Provides" section, after the capability table. Three short bullet points:

- **Tools** (model-controlled): 30+ curriculum tools generated from the OpenAPI schema, plus orientation via `get-curriculum-model`. The AI decides when to use them.
- **Resources** (application-controlled): Curriculum model, prerequisite graph, and learning progressions as pre-loadable context for MCP clients that support resource injection.
- **Prompts** (user-controlled): Four workflow templates (`find-lessons`, `lesson-planning`, `explore-curriculum`, `learning-progression`) that guide users through common curriculum tasks.

Link to the HTTP MCP README and ADR-123 for detail.

**Acceptance criteria**:

- Three concise bullet points, no more than 2-3 lines each
- References the HTTP MCP README for full detail
- Passes `pnpm markdownlint:root`

### Task 4.4: Update ADR-058 revision note

ADR-058 already documents the MCP primitive control model table and the dual-exposure pattern. Add a brief revision note referencing ADR-123 for the broader primitives strategy:

> **Update (2026-03-01):** ADR-123 documents the broader MCP server primitives strategy — how all three primitive types (tools, resources, prompts) work together. This ADR continues to govern the context grounding and dual-exposure pattern specifically.

**Acceptance criteria**:

- Revision note added below existing revision notes
- No structural changes to ADR-058 content
- Cross-reference to ADR-123

### Task 4.5: Run documentation quality gates

```bash
pnpm markdownlint:root
pnpm format:root
```

Both MUST pass.

---

## Non-Goals (YAGNI)

- Adding a new "adapt a lesson" prompt -- post-merge follow-up, not blocking
- Changing prompt message content beyond removing progression-map -- the remaining prompts already reference `get-curriculum-model` correctly
- Changing the SDK's `PromptArgs` type or message format
- Restructuring the prompt architecture (it is simple and correct)

---

## Risk Assessment

| Risk                                                  | Likelihood | Impact | Mitigation                                                                                                                           |
| ----------------------------------------------------- | ---------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------ |
| Breaking existing prompt clients                      | Low        | Medium | Only removing one prompt (`progression-map`); `learning-progression` covers the same workflow. No known clients rely on prompt names |
| Regression in E2E tests                               | Low        | High   | Full quality gate chain in Phase 3                                                                                                   |
| Schema mismatch between SDK definition and Zod schema | Low        | Medium | Zod schemas are simple string/optional -- match `MCP_PROMPTS` argument definitions directly                                          |

---

## Success Criteria

### Code (Phases 1-3)

- `prompts/list` returns exactly 4 prompts: `find-lessons`, `lesson-planning`, `explore-curriculum`, `learning-progression`
- Every prompt defined in the SDK is registered at the app layer (zero orphans)
- Every registered prompt has a Zod argument schema
- Every prompt is tested at unit, integration (existing POC), and E2E level
- `progression-map` is fully removed -- no definitions, no registrations, no schemas, no stale references
- All quality gates pass

### Documentation (Phase 4)

- ADR-123 exists, documenting the MCP server primitives strategy with concrete examples, selection criteria, and deduplication rationale
- HTTP MCP README explains what the server provides through each MCP primitive type, the intent, and the desired impact
- Root README contains a condensed 3-bullet summary of MCP server capabilities
- ADR-058 cross-references ADR-123
- ADR index updated
- All markdown linting passes

### Overall

- MCP spec alignment: tools are model-controlled (AI decides when to call), resources are application-controlled (host app decides how to inject), prompts are user-controlled (user explicitly invokes)
- A reader of the HTTP MCP README can understand what the server offers, through which channels, and why -- without reading the MCP spec
- A reader of the root README gets a concise orientation without needing to dive into the app README
