---
name: "Rename search/explore-topic `text` parameter to `query`"
overview: "Rename the MCP search and explore-topic tools' `text` input parameter to `query` for better LLM discoverability, with a decision on whether to propagate through the search SDK or map at the MCP boundary."
todos:
  - id: decide-scope
    content: "DECISION: Choose Option A (MCP-only rename + mapping) or Option B (full stack rename through oak-search-sdk)."
    status: pending
  - id: ws1-red
    content: "WS1 (RED): Update test expectations for `query` parameter name in all affected test files. Tests MUST fail."
    status: pending
  - id: ws2-green
    content: "WS2 (GREEN): Rename parameter in schema, types, validation, execution, prompts, docs. All tests MUST pass."
    status: pending
  - id: ws3-explore-topic
    content: "WS3: Apply same rename to explore-topic tool for consistency (if decided in scope)."
    status: pending
  - id: ws4-quality-gates
    content: "WS4: Full quality gate chain (build, type-check, lint, test, e2e)."
    status: pending
  - id: ws5-scope-description
    content: "WS5: Improve `scope` parameter discoverability — front-load required params in tool description."
    status: pending
isProject: false
---

# Rename search/explore-topic `text` parameter to `query`

**Last Updated**: 2026-03-06
**Status**: DRAFT — investigation complete, open questions to resolve before execution.
**Scope**: Rename the `text` input parameter on the `search` and `explore-topic` MCP tools to `query`, improving first-guess success for LLM agents.

---

## Context

### Problem Statement

When an LLM agent calls the `search` MCP tool for the first time, it consistently guesses `query` (or `q`) as the parameter name for the search string. The actual parameter is `text`, which causes validation failures and wasted round-trips. This was observed during live testing on 2026-03-06 — three failed attempts before reading the schema.

The `explore-topic` tool has the same `text` parameter and would benefit from the same rename for consistency.

**Evidence**: In a live session, an agent attempted `{ "query": "angles KS4 maths" }` three times before discovering the correct parameter name `text`. The tool description itself uses the word "query" 8+ times while the parameter is named `text`.

### Why `query` is better

- "query" is the overwhelmingly standard name for a search tool's main text parameter (Google, Elasticsearch, OpenAI, Anthropic tool examples all use `query` or `q`)
- The tool's own description says "Search query text" — reinforcing the `query` mental model while the parameter is named `text`
- `text` is ambiguous — it could mean body text, transcript text, etc.

---

## Open Questions

### Q1: Option A (MCP-only) vs Option B (full stack)?

**Option A — MCP boundary rename + mapping layer:**
- Rename `text` → `query` only in the MCP tool schema, types, validation, and execution
- Add a one-line mapping in execution: `params.text = args.query`
- `SearchParamsBase.text` and all SDK/CLI internals unchanged
- ~13–18 files touched
- Zero risk to search SDK consumers
- Introduces a naming seam (MCP says `query`, SDK says `text`)

**Option B — Full stack rename:**
- Rename `text` → `query` everywhere: MCP tools, `SearchParamsBase`, `oak-search-sdk`, `oak-search-cli`, ES query builders
- ~25–30 files touched
- Cleaner — no naming seam
- Technically a breaking change to `@oaknational/oak-search-sdk` exports, but only Oak-internal consumers exist
- More churn but eliminates future confusion

**Recommendation**: Option A is lower risk and faster. Option B is cleaner long-term. Since `oak-search-sdk` is internal-only, Option B is viable. **Decision needed before execution.**

### Q2: Rename `explore-topic` too?

The `explore-topic` tool has the same `text` parameter. If we rename `search.text` → `search.query` but leave `explore-topic.text`, agents will face inconsistency.

**Recommendation**: Yes, rename both. The explore-topic tool's execution calls through to search internally, so the mapping layer (Option A) or type rename (Option B) covers it.

### Q3: Should we also improve `scope` discoverability?

The `scope` parameter is required but easy to miss in the long description. This isn't a rename — just restructuring the description text.

**Recommendation**: Yes, include as WS5. Front-load "Required parameters: `scope`, `query`" at the top of the description, before the detailed scope guidance.

### Q4: Branch strategy

Should this go on the current `fix/links_and_downloads` branch or a new branch?

**Recommendation**: New branch. The current PR is about asset downloads and canonical URLs — mixing in a parameter rename muddies the review.

---

## Impact Analysis

### Files to change (Option A — MCP-only)

#### Schema & Types (~3 files)
| File | Change |
|---|---|
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/tool-definition.ts` | Rename `text` property to `query` in `SEARCH_INPUT_SCHEMA`, update description and examples |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/types.ts` | Rename `SearchSdkArgs.text` → `SearchSdkArgs.query` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/search-retrieval-types.ts` | No change (keeps `text` internally) |

#### Validation & Execution (~2 files)
| File | Change |
|---|---|
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.ts` | Zod schema: `text` → `query`, mapping to internal `text` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.ts` | `args.query` instead of `args.text`, map to `params.text` for SDK calls |

#### Tests (~3 files)
| File | Change |
|---|---|
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/validation.unit.test.ts` | `{ text: ... }` → `{ query: ... }` in test inputs |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-search/execution.integration.test.ts` | Same |
| `apps/oak-curriculum-mcp-streamable-http/e2e-tests/tool-examples-metadata.e2e.test.ts` | `getPropertyExamples(searchTool, 'text')` → `'query'` |

#### Prompts & Documentation (~6 files)
| File | Change |
|---|---|
| `packages/sdks/oak-curriculum-sdk/src/mcp/mcp-prompt-messages.ts` | `search({ text: "..." })` → `search({ query: "..." })` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/tool-guidance-workflows.ts` | Same pattern |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-browse/tool-definition.ts` | Cross-reference text |
| `packages/sdks/oak-curriculum-sdk/docs/architecture.md` | Tool mapping table |
| `.agent/analysis/request-response-examples.md` | SDK request payload examples |

#### Explore-topic (if included, ~5 files)
| File | Change |
|---|---|
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/tool-definition.ts` | `text` → `query` |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/validation.ts` | Same |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/execution.ts` | Same |
| `packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-explore/*.test.ts` | Test inputs |

### Additional files for Option B

All of the above, plus:
- `packages/sdks/oak-search-sdk/src/types/retrieval-params.ts` — `SearchParamsBase.text` → `.query`
- `packages/sdks/oak-search-sdk/src/types/observability.ts` — `ZeroHitPayload.text` (separate concern, may keep as-is)
- `packages/sdks/oak-search-sdk/src/retrieval/*.ts` — `params.text` → `params.query` in query builders
- `apps/oak-search-cli/src/cli/search/*.ts` — CLI command mapping
- `apps/oak-search-cli/src/adapters/*.ts` — if they reference `text`
- `packages/sdks/oak-search-sdk/README.md` — API examples

---

## Risks

| Risk | Likelihood | Mitigation |
|---|---|---|
| Existing MCP clients have `text` cached in conversation context | Medium | MCP clients re-fetch tool schemas on reconnect; no persistent coupling |
| Agents still guess wrong with a different name | Low | `query` is the industry standard; validated by observation |
| Option A naming seam causes future confusion | Low | Well-documented in code; the seam is a single mapping line |

---

## Non-Goals

- Renaming parameters on other tools (e.g. `fetch.id`, `download-asset.lesson`)
- Changing the Elasticsearch field names
- Changing the Oak REST API's `q` parameter
