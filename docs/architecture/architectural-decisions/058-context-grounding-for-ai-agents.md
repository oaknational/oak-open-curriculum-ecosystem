# ADR-058: Context Grounding for AI Agents

## Status

Accepted (Revised)

> **Update (2026-03-01):** The original two-tool model (`get-ontology` + `get-help`) has been consolidated into a single `get-curriculum-model` tool. The `curriculum://ontology` resource has been replaced by `curriculum://model`. The core architectural principle — multi-layered context grounding — is unchanged; the implementation is simplified to a single orientation tool.
>
> **Update (2026-03-01):** [ADR-123](123-mcp-server-primitives-strategy.md) documents the broader MCP server primitives strategy — how all three primitive types (tools, resources, prompts) work together. This ADR continues to govern the context grounding and dual-exposure pattern specifically.
>
> **Update (2026-06-10):** Forward considerations for grounding consuming agents in pedagogical principles and Oak curriculum rigour — the surface **reliability ranking**, the **per-call token budget** on broadcast guidance, and a possible **per-tool guidance-enhancement mechanism** — are recorded in the [Addendum](#addendum-2026-06-10--pedagogical-grounding-forward-considerations) below. No implementation decision is ratified by this note; it records architectural facts and constraints to guide that work when it is scoped. See also the [process record](../../../.agent/reports/mcp-session-instructions-pedagogical-grounding-process-2026-06-10.md).

## Context

AI agents using the Oak MCP server often jump straight into calling curriculum tools without first understanding the domain model. This leads to:

- Incorrect parameter formats (e.g., wrong ID patterns like `lesson:slug`)
- Misunderstanding of entity hierarchy (subject → unit → lesson)
- Suboptimal tool selection
- Repeated trial-and-error interactions

The Oak curriculum has specific structures (key stages KS1-KS4, subjects, units, lessons) and ID formats (`type:slug`) that agents need to understand before they can effectively query the API.

### OpenAI Apps SDK Data Flow

Per the [OpenAI Apps SDK Reference](https://developers.openai.com/apps-sdk/reference#tool-results), tool responses have three fields with different visibility:

| Field               | Model Sees | Widget Sees | Purpose                       |
| ------------------- | ---------- | ----------- | ----------------------------- |
| `structuredContent` | ✅ Yes     | ✅ Yes      | Full data for model reasoning |
| `content`           | ✅ Yes     | ✅ Yes      | Human-readable summary        |
| `_meta`             | ❌ No      | ✅ Yes      | Widget-only data              |

This means any context guidance placed in `_meta` is invisible to the model—it can only be seen by the widget.

> **Client-variability note (2026-06-11):** the table above is
> **OpenAI-Apps-SDK-specific**, not a property of MCP clients in general. A
> live two-client probe (2026-06-11) found Cursor's agent harness delivers
> ONLY `content` blocks to the model (`structuredContent` never reaches it —
> a structuredContent-only response renders "(omitted)"), while Claude Code
> delivers ONLY `structuredContent` (the `content` blocks are dropped).
> "Model sees `structuredContent`" must not be assumed per-client. The only
> shape that renders in every observed client is the dual shape
> (`formatToolResponse`: `content` summary + serialised JSON, plus decorated
> `structuredContent`) — the MCP spec's backwards-compatibility SHOULD, and
> the shape every Oak tool emits (the `get-eef-evidence` exception was
> removed 2026-06-11). Evidence:
> [`oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md`](../../../.agent/reports/oak-prod-mcp-cursor-visibility-writeup-2026-06-11.md)
> and the in-repo research
> [`mcp-client-tool-result-consumption-2026-05-28.md`](../../../.agent/research/mcp-client-tool-result-consumption-2026-05-28.md).
> This ADR's model-visibility reasoning below (e.g. "reliably model-visible
> on every response") holds for both-fields clients and for
> `structuredContent`-rendering clients; guidance that must reach the model
> in EVERY client belongs in fields the dual shape carries on both channels.

### MCP Primitive Audiences

MCP primitives have different control models and audiences:

| Primitive     | Control                | Who Controls            | Model Sees Directly?                           |
| ------------- | ---------------------- | ----------------------- | ---------------------------------------------- |
| **Tools**     | Model-controlled       | LLM decides to call     | Yes (tools/list, structuredContent)            |
| **Resources** | Application-controlled | Client app surfaces     | No (unless app injects into context)           |
| **Prompts**   | User-controlled        | User explicitly invokes | No (user sees options, model receives message) |

**Implication for ChatGPT**: ChatGPT does not automatically surface resources to the model. The `curriculum://model` resource exists for other MCP clients that do surface resources (e.g., Claude Desktop, custom clients). For ChatGPT, the primary context path is through the `get-curriculum-model` tool.

**Implication for Prompts**: Prompts are user-initiated. When a user invokes a prompt, they may not know about context tools. The prompt message (which the model receives) should suggest calling `get-curriculum-model` first.

### Dual Exposure Pattern

The curriculum model is exposed via both primitive types:

- `get-curriculum-model` tool - Model-controlled, for ChatGPT and agents that request context on-demand
- `curriculum://model` resource - Application-controlled, for clients that pre-inject context

### Workflows for Agent Guidance

Agents benefit from structured workflows that show how to combine tools for common tasks. These workflows are defined once in `tool-guidance-data.ts` and imported by `curriculum-model-data.ts`, ensuring a single source of truth.

## Decision

Implement a multi-layered context grounding system that guides AI agents to call `get-curriculum-model` before using curriculum tools. The `get-curriculum-model` tool provides combined domain model and tool guidance in a single call. The guidance appears in all model-visible locations:

### 1. Tool Descriptions (tools/list)

Each tool's description includes prerequisite guidance:

```typescript
const AGGREGATED_PREREQUISITE_GUIDANCE =
  "PREREQUISITE: If unfamiliar with Oak's curriculum structure, call `get-curriculum-model` first...";
```

### 2. Widget Description (component load)

The widget resource includes guidance in `openai/widgetDescription`:

```typescript
const WIDGET_DESCRIPTION =
  'Oak curriculum explorer. For best results, call get-curriculum-model first...';
```

### 3. `oakContextHint` in structuredContent (every response)

Every tool response includes a hint in `structuredContent` (which the model sees):

```typescript
export const OAK_CONTEXT_HINT =
  'For optimal results with Oak curriculum tools, call get-curriculum-model first.' as const;
```

### 4. Workflows in `structuredContent` (agent guidance)

Workflows are returned via `get-curriculum-model` in `structuredContent`, providing agents with step-by-step guidance. The foundational workflow is `userInteractions`:

```typescript
userInteractions: {
  title: 'When finding or presenting Oak content for the user',
  steps: [
    { step: 1, action: 'Use get-curriculum-model to understand the domain model and available tools', tool: 'get-curriculum-model' },
    { step: 2, action: 'Use discovery/browsing tools to explore' },
    { step: 3, action: 'Use fetching tools to get content' },
  ],
}
```

**Single Source of Truth**: All workflows are defined in `tool-guidance-data.ts` and imported by `curriculum-model-data.ts`. This ensures:

- Consistent workflow definitions in the `get-curriculum-model` response
- New workflows automatically appear in the tool
- Workflows include `returns` field describing what each step returns

**Available Workflows**:

| Workflow           | Purpose                                     |
| ------------------ | ------------------------------------------- |
| `userInteractions` | Foundation: call get-curriculum-model first |
| `findLessons`      | Search for lessons and retrieve details     |
| `lessonPlanning`   | Gather materials for lesson planning        |
| `browseSubject`    | Explore curriculum structure by subject     |
| `trackProgression` | Follow concept development across years     |

### Implementation by Tool Type

**Aggregated Tools** (`search`, `fetch`, `get-curriculum-model`):

- Use `formatOptimizedResult()` which **always** includes `oakContextHint`
- Full data in `structuredContent` for model reasoning
- Human-readable summary in `content`

**Generated Tools** (curriculum API endpoints):

- Use `formatDataWithContext()` with `includeContextHint` flag
- Flag is set based on `requiresDomainContext` in tool descriptor
- `requiresDomainContext: true` for auth-required tools (curriculum content)
- `requiresDomainContext: false` for utility tools (`get-rate-limit`, `get-changelog`)

### Tool Descriptor Flag

The generator emits `requiresDomainContext` based on authentication requirements:

```typescript
// In emit-index.ts
const requiresDomainContext = securitySchemes[0]?.type !== NOAUTH_SCHEME_TYPE;
lines.push(`  requiresDomainContext: ${requiresDomainContext ? 'true' : 'false'},`);
```

This ensures:

- Curriculum tools → include context hint
- Utility tools → no hint (they don't need domain context)

## Rationale

1. **Multiple touchpoints**: Agents see guidance at discovery time (tool descriptions), widget load time (widget description), and every response (structuredContent). This redundancy ensures the message gets through.

2. **Model-visible placement**: All guidance is in `structuredContent` or tool descriptions—places the model actually sees. Previous approach of putting guidance in `_meta` was ineffective because the model never sees `_meta`.

3. **OpenAI Apps SDK alignment**: Following the official pattern where `structuredContent` contains data for model reasoning, `content` contains human-readable summaries, and `_meta` contains widget-only metadata.

4. **Generator-driven for generated tools**: The `requiresDomainContext` flag is determined at sdk-codegen time based on auth requirements, following the schema-first principle.

5. **Automatic for aggregated tools**: Any new aggregated tool using `formatOptimizedResult()` automatically gets context grounding without per-tool changes.

6. **Single source of truth for workflows**: Workflows are defined once in `tool-guidance-data.ts` and consumed by `get-curriculum-model`. This prevents duplication and ensures consistency.

## Consequences

### Positive

- **Better agent behaviour**: Agents are guided to call `get-curriculum-model` first, leading to more effective tool usage
- **Automatic coverage**: New tools automatically get context grounding
- **Schema-first compliance**: Generated tools get flags from the generator, not runtime code
- **Full data access**: Model gets complete data in `structuredContent` for reasoning
- **Consistent workflows**: Single source of truth ensures agents see the same workflows everywhere
- **Extensible**: New workflows can be added to `tool-guidance-data.ts` and automatically appear in responses

### Negative

- **Increased response size**: Every response includes the hint string (minimal overhead)
- **Repetitive guidance**: Agent sees the hint in every response (necessary for stateless interactions)

### Neutral

- **Utility tools excluded**: `get-rate-limit`, `get-changelog` etc. don't include hints (intentional—they don't need domain context)
- **Workflows in structuredContent only**: Workflows are for agent reasoning, not widget display

## Addendum (2026-06-10) — Pedagogical Grounding Forward Considerations

As the MCP server approaches production, consuming agents will need grounding in
**pedagogical principles and Oak curriculum rigour**, not just tool-orientation.
The multi-layer model in this ADR is the right foundation, but three facts and
constraints were not previously recorded. They are captured here to guide that
work; no implementation decision is ratified.

### 1. The grounding surfaces differ in reliability

This ADR's rationale leans on "multiple touchpoints / redundancy" but does not
state that the touchpoints are **not equally reliable**. Strongest to weakest:

| Rank | Surface                                     | Why                                                                                                                                                  |
| ---- | ------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1    | **Tool output data itself**                 | Always consumed by the model; cannot be ignored. Not currently treated as a grounding surface.                                                       |
| 2    | **`oakContextHint` in `structuredContent`** | Reliably model-visible on every response (§3).                                                                                                       |
| 3    | **Per-tool `description`**                  | Visible at discovery; may truncate in large tool lists.                                                                                              |
| 4    | **Server `instructions` field**             | Per the MCP spec the field is `"Optional instructions for the client"` — a client **MAY** fold it into the system prompt but is **not required to**. |

**Implication:** the server `instructions` field is the **weakest** lever and
shapes tool-selection, not output quality. Rigour that must be honoured belongs
in higher-reliability surfaces — most durably in the shape of the tool output
data itself. The `instructions` field is necessary framing, not sufficient
enforcement.

### 2. Per-call broadcast guidance must stay within token budgets

`oakContextHint` (§3) is **repeated in every tool response**; per-tool
descriptions are delivered once at discovery (`tools/list`) but **reside in the
consuming agent's context for the whole session**. Both consume the consuming
agent's context window — by different mechanisms — and any expansion of either
(for example richer pedagogical framing) must stay within token budgets.
Uniformly broadcasting rich guidance on every response does not scale; the
per-call cost is paid for the whole session.

### 3. A per-tool guidance-enhancement mechanism may be required

Because the per-call budget caps uniform broadcast, the likely shape is **not**
one larger broadcast string but a mechanism that lets guidance be **enhanced and
targeted per tool** — tiered or tool-specific framing applied only where it earns
its tokens — rather than the same prose on every response. This is recorded as a
consideration to evaluate when the grounding work is scoped; the generator
extension that would carry it is noted in
[ADR-060](060-agent-support-metadata-system.md).

## Related Decisions

- [ADR-030: SDK as Single Source of Truth](030-sdk-single-source-truth.md) - Type generation principles
- [ADR-035: Unified SDK-MCP Code Generation](035-unified-sdk-mcp-code-generation.md) - Generator architecture
- [ADR-037: Embedded Tool Information](037-embedded-tool-information.md) - Tool descriptor patterns

## References

- [OpenAI Apps SDK Reference - Tool Results](https://developers.openai.com/apps-sdk/reference#tool-results)
- [Context Grounding Optimization Plan](/.agent/plans/sdk-and-mcp-enhancements/archive/legacy-numbered/16-context-grounding-optimization.md)
