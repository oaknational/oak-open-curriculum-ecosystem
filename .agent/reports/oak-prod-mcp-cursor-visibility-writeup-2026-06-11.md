# oak-prod MCP × Cursor Client — Response-Visibility Write-Up (2026-06-11)

- **Author**: Dawnlit Glimmering Orbit (cursor / Fable 5, `50c2d1`)
- **Audience**: the next agent on this work, which will NOT be a Cursor
  instance. This document is deliberately self-contained: every load-bearing
  claim carries its evidence inline, and Cursor-specific behaviour is
  described precisely so a non-Cursor agent can reason about it without
  access to a Cursor seat.
- **Status**: write-up only — no fixes applied, by owner direction
  (2026-06-11 evening). The tracker is
  [`oak-prod-mcp-snagging-2026-06-11.plan.md`](../plans/sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md).
- **Outcome addendum (2026-06-11, late evening)**: the owner decided S1 the
  same day — `get-eef-evidence` aligns onto the family dual response shape
  (§7 option 1, strengthened: full `formatToolResponse` delegation, not just a
  TextContent mirror), superseding the D6/D7 structuredContent-only
  ratification. Executed as PR-2 (`feat/eef-dual-shape-alignment`, commit
  `20ad83326`). A live Claude Code probe completed the client matrix the same
  session — see §3a. Shape B no longer leaves the server: post-PR-2, every
  `get-eef-evidence` success is Shape A.
- **Companion evidence**: the full live-exercise verification record
  `oak-prod-live-mcp-exercise-2026-06-11.md` lives on branch
  `docs/graph-team-direction-2026-06-10` (commit `ae5372e2c`, pushed to
  origin) — NOT on this branch. The Cursor-specific evidence is reproduced
  here so this document stands alone.

## 1. Setup under test

- **Server**: oak-prod MCP at `https://curriculum-mcp-alpha.oaknational.dev/mcp`,
  `x-app-version: 1.26.1`, Streamable HTTP, Clerk OAuth (unauthenticated
  JSON-RPC returns 401 with
  `WWW-Authenticate: Bearer resource_metadata=…/.well-known/oauth-protected-resource/mcp`).
- **Client**: Cursor's built-in MCP client (IDE Composer session), which
  authenticated via OAuth. The agent (model) calls tools through Cursor's
  `CallMcpTool` harness and fetches resources through `FetchMcpResource`.
- **Date**: 2026-06-11, ~17:30–18:30 UTC.

## 2. Server-side wire shapes (source-grounded)

Three response shapes leave the server. File references are the source of
truth a successor can verify directly.

### Shape A — dual-content success (every graph/universal tool)

`formatToolResponse` in
`packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts` (~line
208) returns:

```text
content:            [ TextContent(summary line), TextContent(JSON.stringify(data)) ]
structuredContent:  { ...data, summary, oakContextHint?, status? }
_meta:              { ...annotations (title etc.) }
```

Key detail for §4: `content[1]` is the RAW serialised data;
`structuredContent` is the same data PLUS the `summary` / `oakContextHint` /
`status` decoration keys. The presence or absence of those keys identifies
which of the two payloads a client surfaced. The code comment on the
prior-knowledge tool (`aggregated-prior-knowledge-graph.ts` ~line 126) names
the intent: "summary and serialised JSON alongside as TextContent (MCP spec
SHOULD for structured results)".

Used by: `get-curriculum-model`, all four graph tools
(`get-thread-progressions`, `get-prior-knowledge-graph`,
`get-misconception-graph`, `get-keyword-graph`), `search`, `fetch`, and the
other universal/live-API tools.

### Shape B — structuredContent-only success (`get-eef-evidence` ONLY)

`packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts`
(lines 202, 218, 247):

```text
content:            []          ← empty by design
structuredContent:  EefEvidenceEnvelope
```

The doc comment (~line 187) records this as "the owner-ratified
structuredContent-only shape". Confirmed by unit tests in
`aggregated-eef-evidence.unit.test.ts`. `rg -n 'content: \[\]'` over
`packages/sdks/oak-curriculum-sdk/src/mcp` confirms `get-eef-evidence` is the
ONLY tool with this shape.

### Shape C — typed refusal / error

`formatError` (same shared module): `content: [TextContent(message)]`,
`isError: true`. Used by every tool for caller-driven violations. Separately,
input-schema violations are rejected before the handler by the MCP SDK layer
and surface as JSON-RPC `-32602` errors.

## 3. What the Cursor AGENT (model) actually received — observed matrix

Every row below was observed live this session. "Agent sees" is the literal
content delivered into the model context by Cursor's harness.

| # | Call | Server shape | Agent sees |
|---|------|--------------|------------|
| 1 | `get-curriculum-model` (success, ~42 KB) | A | `content[0]` summary line inline, verbatim; then the harness line `Large output has been written to: …/agent-tools/<uuid>.txt (42.2 KB, 1 lines)`. The file contains `content[1]` — the RAW data JSON. Proof: zero occurrences of `oakContextHint`/`summary`/`status` keys in the file (grep count 0), and the file ends `…}]}}}` with no envelope keys; structuredContent would have carried them. |
| 2 | Graph tools, `search`, `fetch` (success, ~2–17 KB) | A | BOTH text blocks inline: the summary line and the raw-data JSON, as two separate output blocks. The JSON again lacks `summary`/`oakContextHint`/`status` keys → it is `content[1]`, not `structuredContent`. |
| 3 | `get-eef-evidence` success — ALL variants tried: `inspect-strand` single strand; `evidence-for-move` full; `evidence-for-move` headline (smallest possible payload, single strandId) | B | The literal string `(omitted)` and NOTHING else. No file diversion (the harness output folder gained no new file — only the §1-row-1 dump exists from this session). Four independent calls, identical result. |
| 4 | `get-eef-evidence` with no selector (typed refusal) | C | Full refusal text inline: `evidence-for-move requires at least one selector: strandIds, phase, keyStage, or priority.` |
| 5 | `get-keyword-graph` `limit: 0`; `get-misconception-graph` `unitOffset` with unit anchor (typed refusals) | C | Full refusal text inline. |
| 6 | `search` called without `scope` (input-schema violation) | JSON-RPC `-32602` | `MCP error -32602: Input validation error: Invalid arguments for tool search: [ …zod issue JSON… ]` inline. |
| 7 | Resource `eef://interpretation` via `FetchMcpResource` | resource read | Full markdown body inline (~10 KB). |

### Conclusions the matrix licenses

1. **Cursor's agent harness surfaces ONLY `content` blocks.** In every
   observed success, what reached the model was `content[0]`/`content[1]`;
   the `structuredContent` decoration keys never appeared anywhere, and
   `_meta` never appeared. There is no evidence Cursor delivers
   `structuredContent` to the model under any condition.
2. **Shape B is therefore fully invisible to the Cursor agent.** With
   `content: []` there is nothing for the harness to render; it prints
   `(omitted)`. This is shape-based, not size-based — the smallest possible
   success payload (row 3) was also omitted, while a large Shape-A payload
   (row 1) was file-diverted, not omitted.
3. **This resolves the "surely all graph tools would fail" challenge**
   (owner, 2026-06-11 19:21): the graph tools do not depend on
   `structuredContent` being rendered. They render in Cursor because of
   their `content[1]` serialised-JSON mirror. The EEF tool is the only tool
   without that mirror, and it is the only tool that vanishes. The
   observations are fully consistent.
4. **Errors always reach the agent** (rows 4–6), because both error paths
   carry text content.
5. **Large-output handling**: Shape-A payloads ≲17 KB arrived inline; the
   42 KB payload was diverted to a file the agent can read. The exact
   threshold was not probed. Note for successors: file diversion is a
   Cursor-harness behaviour, not server behaviour.

### 3a. Addendum (2026-06-11, same session): the Claude Code matrix row

A live Claude Code probe against oak-prod (session 2c0c4b, Dusky Passing
Mist) established the opposite half of the visibility split:

| # | Call | Server shape | Agent sees (Claude Code) |
|---|------|--------------|--------------------------|
| 8 | Shape-A dual-content success | A | ONLY `structuredContent` — the decorated JSON (with `summary`/`oakContextHint`/`status` keys present); the `content` text blocks are NOT delivered to the model. |
| 9 | `get-eef-evidence` Shape-B success | B | The `structuredContent` envelope renders fine — the EEF tool was never broken for Claude Code. |

So the two clients surface **opposite halves** of the response: Cursor only
`content`, Claude Code only `structuredContent`; claude.ai and ChatGPT
surface both (in-repo research
`mcp-client-tool-result-consumption-2026-05-28.md`). Only the dual shape
renders everywhere — the basis of the owner's S1 decision (see the Outcome
addendum at the top).

## 4. The prompt layer — who can invoke what in Cursor

- **Agent-side**: Cursor's agent harness exposes MCP **tools** (via
  `CallMcpTool`) and **resources** (via `FetchMcpResource`/`ListMcpResources`).
  It exposes NO prompt-invocation surface to the model. The agent can read
  the prompt descriptors (Cursor mirrors them to disk, see §5) but cannot
  execute `prompts/get`.
- **User-side**: MCP prompts ARE exposed to the human as slash commands
  (`/<server>/<prompt-name>`). Verified live: the owner invoked
  `/…oak-prod/adapt-lesson` with no arguments; the call reached the live
  server and returned a spec-correct `-32602` listing the missing required
  `topic` and `yearGroup` args — exactly matching the prompt descriptor.
- **Visibility loop-back**: the result (or error) of a user-invoked prompt
  is injected into the AGENT's context as a `<cursor_commands>` block inside
  the next user message. So prompt outputs do reach the model — but only via
  user invocation, after the fact, as conversation context rather than as a
  tool result.
- An earlier claim in the companion exercise report ("Cursor's harness
  offers no prompt-invocation surface") was corrected to the above split:
  agent-side no, user-side yes.

## 5. Cursor specifics a non-Cursor successor should know

1. **Descriptor mirror**: Cursor writes per-server tool/prompt/resource
   descriptors to disk under
   `~/.cursor/projects/<project>/mcps/<server>/{tools,prompts,resources}/*.json`.
   The schemas quoted in this write-up came from that mirror and matched the
   live server's behaviour wherever probed.
2. **`(omitted)`** is a Cursor-harness rendering, not a server string. Do
   not search server code for it.
3. **OAuth seat**: Cursor held the Clerk OAuth session. A non-Cursor
   successor replaying against prod needs its own authenticated MCP client
   (PRM discovery per the 401 header), or use the local no-auth server
   (`apps/oak-curriculum-mcp-streamable-http`, port 3333 — the `eef` thread
   record's EXERCISE RECIPE banner carries the start command and working
   JSON-RPC calls).
4. **What was NOT determined from the Cursor seat** (open questions for the
   successor):
   - whether Cursor's human-facing UI renders `structuredContent` for Shape
     B calls (the owner can answer in one click by expanding a
     `get-eef-evidence` call from the 2026-06-11 session transcript);
   - the file-diversion size threshold (between ~17 KB and ~42 KB);
   - whether ANY content-block-only behaviour exists in other major clients
     (Claude Code, Codex, Gemini CLI…) — worth a one-call probe each before
     deciding S1, since the fix decision should rest on the client
     population, not Cursor alone. *(Answered for Claude Code the same
     session — see §3a: it surfaces ONLY `structuredContent`, the opposite
     half. The owner closed S0 on this matrix; Codex/Gemini probes remain an
     optional annex, not gates.)*

## 6. Replay recipe for a non-Cursor agent

Local (no auth), from repo root:

```bash
pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http build
# dist/index.js is the Node LISTENER entry; dist/server.js is the serverless
# export and exits 0 silently when run directly (replay-verified 2026-06-12).
# Run from the app directory so .env.local resolves.
(cd apps/oak-curriculum-mcp-streamable-http && node dist/index.js)  # port 3333
```

Then over JSON-RPC (`initialize` → `tools/call`):

- Shape A control: `get-prior-knowledge-graph`
  `{"unitSlugs":["understanding-percentages"],"depth":1}` → expect
  `content[0]` summary + `content[1]` JSON + `structuredContent` with
  `summary`/`oakContextHint`/`status`.
- Shape B subject: `get-eef-evidence`
  `{"function":"evidence-for-move","strandIds":["eef-tl-feedback"],"detail":"headline"}`
  → expect `content: []` + `structuredContent` only. Whatever your client
  surfaces (or drops) of this response IS the finding's reproduction.
- Shape C control: `get-eef-evidence` `{"function":"evidence-for-move"}` →
  expect `isError: true` with the selector-refusal text.

## 7. Disposition options for S1 (decision is the owner's)

> **Decided (owner, 2026-06-11):** option 1, strengthened — full
> `formatToolResponse` delegation (dual `content` blocks + decorated
> `structuredContent`), executed as PR-2, commit `20ad83326`. The §3a matrix
> made option 2 untenable: holding the ratified shape would have kept the
> tool dead for the content-block-only client population. The coherence note
> (option 3) is reconciled in
> [`output-schemas-for-mcp-tools.plan.md`](../plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md)
> §Provenance landed-shape note: `composeEnvelopeSchema` now applies to EEF
> uniformly.

1. **Add a serialised TextContent mirror to `get-eef-evidence` success**
   (one change at the handler boundary in `aggregated-eef-evidence.ts`,
   mirroring `formatToolResponse`'s `content[1]`; the MCP spec's
   backwards-compatibility SHOULD; makes the tool consistent with every
   other tool on the server). Cost: reverses the ratified
   structuredContent-only decision; envelope duplication on the wire.
2. **Hold the ratified shape and record the client limitation** — defensible
   only if the agent-client population that matters renders
   `structuredContent` (see §5.4 third bullet: gather that evidence first).
3. **Coherence note**: whatever is chosen should be reconciled with
   [`output-schemas-for-mcp-tools.plan.md`](../plans/sdk-and-mcp-enhancements/current/output-schemas-for-mcp-tools.plan.md)
   (`composeEnvelopeSchema` owns the long-term success-shape contract).

## 8. Remaining snags (tracked, not expanded here)

See the
[snagging plan](../plans/sdk-and-mcp-enhancements/current/oak-prod-mcp-snagging-2026-06-11.plan.md)
findings register: keyword description leakage (`keyword:convert` serving a
religion-flavoured description into maths results), the "Interpret adn
present data" corpus typo, the `get-keyword-graph` `limit` schema declaring
bare `type: number` while doc + runtime enforce integer [1, 100], and the
argless-prompt raw-zod UX observation.
