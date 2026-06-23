# MCP Session Instructions — Pedagogical Grounding Process Record

**Date:** 2026-06-10
**Type:** Process record (forward-looking; no change made)
**Status:** Reference for a future production-readiness work item
**Author session:** Blooming Bending Root

## Purpose

As the Oak MCP server moves toward production, consuming agents (ChatGPT,
Claude, custom clients) will need grounding in **pedagogical principles and
Oak curriculum rigour**, not just tool-orientation. This record captures where
session-wide agent instructions live today, the architectural gap that
pedagogical grounding exposes, the process for closing it, and the verdict on
whether the governing ADRs need updating.

It is a record for a future implementer, not an authorisation to build. The
decision to add pedagogical grounding has not been ratified.

## Where session-wide instructions live today

The MCP protocol's server-level `instructions` field — returned once in the
`initialize` response — is the canonical home for whole-session agent guidance.
Oak already populates it.

| Surface | Scope | Source | Model reliably sees it? |
| --- | --- | --- | --- |
| Server `instructions` | Whole session, once at connect | `SERVER_INSTRUCTIONS` | **No — advisory** (see below) |
| Per-tool `description` | Per tool, in `tools/list` | universal tool registry | Yes (may truncate in large lists) |
| `oakContextHint` in `structuredContent` | Every tool response | `generateContextHint()` | **Yes — most reliable** |
| Tool output data itself | Every response | tool handlers / SDK | Yes — always consumed |

### The wiring (verify line numbers at implementation time — `mcp/` is under active churn)

- Attached to the server: `apps/oak-curriculum-mcp-streamable-http/src/app/core-endpoints.ts`

  ```typescript
  const server = new McpServer(
    { name: 'oak-curriculum-http', version: '0.1.0', ...OAK_SERVER_BRANDING },
    { instructions: SERVER_INSTRUCTIONS },
  );
  ```

- `SERVER_INSTRUCTIONS` constant: `packages/sdks/oak-curriculum-sdk/src/mcp/prerequisite-guidance.ts`

  ```typescript
  export const SERVER_INSTRUCTIONS = generateServerInstructions();
  ```

- Generator + single source of truth:
  `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.ts`
  (`generateServerInstructions()`, driven entirely by
  `AGENT_SUPPORT_TOOL_METADATA`).

- Pinning test:
  `packages/sdks/oak-curriculum-sdk/src/mcp/agent-support-tool-metadata.unit.test.ts`

- Governing ADRs: **ADR-058** (Context Grounding for AI Agents — the multi-layer
  strategy) and **ADR-060** (Agent Support Tool Metadata System — the generator
  pattern that produces `instructions` + `oakContextHint`).

## The architectural gap

`generateServerInstructions()` is a pure function of `AGENT_SUPPORT_TOOL_METADATA`.
Every word it emits is **tool-orientation** ("call these agent support tools at
conversation start", "read-only and idempotent", "call these first to reduce
errors"). There is **no slot for general prose**.

Pedagogical principles and curriculum rigour are a different kind of content:
they shape how an agent *reasons about and presents* curriculum output — they do
not describe a tool. So adding them is **not** a one-field metadata edit. It is
an architectural extension of the generator, governed by ADR-060 and squarely
within ADR-058's context-grounding theme.

## The load-bearing reliability fact

The MCP specification labels the `initialize` result field literally as
`"instructions": "Optional instructions for the client"`
([MCP 2025-06-18 lifecycle](https://modelcontextprotocol.io/specification/2025-06-18/basic/lifecycle)).
It is **optional and at client discretion** — a client MAY surface it (e.g. fold
it into the system prompt) but is **not required to**. ChatGPT, Claude Desktop,
and custom clients each decide independently.

The consequence for production pedagogical rigour: **the `instructions` field is
the weakest available lever.** If Oak's bar is that consuming agents *must*
respect curriculum rigour, the instructions field is necessary but not
sufficient. Reliability ranking of the grounding surfaces, strongest first:

1. **Tool output data carries its own pedagogical framing** — always consumed,
   cannot be ignored. The strongest lever, and the one ADR-058 does not yet treat
   as a grounding surface.
2. **`oakContextHint` in `structuredContent`** — reliably model-visible on every
   response (ADR-058 §3).
3. **Per-tool `description`** — visible at discovery, may truncate in large lists.
4. **Server `instructions`** — advisory, client-optional.

Do not assume placing pedagogy in the `instructions` field delivers rigour. The
bridge from "string is set" to "agent output is pedagogically sound" runs through
whichever surfaces the client actually honours.

## Process for adding pedagogical grounding (future work)

1. **Decide the surfaces deliberately.** Treat `instructions` as the
   session-level framing, but reinforce through `oakContextHint` (reliably seen)
   and — for true rigour — through the shape of the tool output itself. Decide
   per the reliability ranking above, not by default-to-instructions.

2. **Single-source the pedagogical content.** Define the grounding prose as one
   named export (e.g. `PEDAGOGICAL_GROUNDING`), not pasted into three places.
   This is the seam where pedagogy experts own the wording without touching MCP
   wiring, and it honours the metacognition structural-cure principle: one source
   feeds all surfaces, so they cannot drift.

3. **Extend the generators, not the tool metadata.** Add a pedagogical-grounding
   section to `generateServerInstructions()` (and, if the grounding must persist
   per-response, to `generateContextHint()`), sourcing from the named constant.
   Keep `AGENT_SUPPORT_TOOL_METADATA` for tool-orientation only.

4. **Update the pinning test.** Add assertions for the new section, including a
   length/budget assertion — `instructions` competes for the *consuming* agent's
   context window, so it carries the same context-budget discipline Oak applies
   to its own load surfaces.

5. **Record the decision in the ADR estate** (see verdict below) — when the
   decision is taken, not before.

6. **Verify end-to-end.** Connect a real client and confirm the grounding renders
   in the `initialize` response and in `structuredContent`. Tests-green is not
   proof the consuming agent sees it.

## Verdict: do the ADRs need updating?

**Facts and constraints: recorded now. The decision itself: not until ratified.**
ADR-058 and ADR-060 accurately describe the system as built — the `instructions`
field is governed by ADR-060 (generation) inside ADR-058's multi-layer grounding
strategy, and nothing this finding exposes is stale or wrong about the built
system. But the *reliability ranking* of the grounding surfaces, the per-call
token-budget constraint, and the generator gap are stable architectural facts
that were previously unrecorded, and they are load-bearing for any future
pedagogical-rigour work. They land alongside this report as **fact-only
addenda**: ADR-058 gains the reliability ranking, budget constraint, and
per-tool guidance-enhancement direction; ADR-060 gains the generator gap and
budget notes. Each addendum states explicitly that **no implementation decision
is ratified**.

What stays out of the ADRs until the pedagogical-grounding decision is taken:
the decision itself and the surface *choice* it implies. Writing those before
ratification would put a moving target into a permanent doc, which is excluded.
When the decision is ratified, the addenda are the prepared ground it lands on.

## Related

- ADR-058: Context Grounding for AI Agents
- ADR-060: Agent Support Tool Metadata System
- ADR-123: MCP Server Primitives Strategy (tools/resources/prompts together)
- MCP spec, Lifecycle (2025-06-18): `instructions` is an optional client hint
