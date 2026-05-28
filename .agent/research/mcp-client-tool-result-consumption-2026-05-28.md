---
title: "What claude.ai and ChatGPT.com actually read from MCP tool responses"
date: 2026-05-28
status: research-findings (empirical, source-cited)
author: Tidal Drifting Hull (claude / claude-opus-4-7 / 67a170)
context: >
  Resolves the "client research" open question (Q4) in
  graph-tooling-rebuild-foundation-2026-05-28.md §10 and validates principle 8
  ("graph tools return structuredContent only, and no context hint"). Driven by
  Deep Fathoming Harbour; research + reporting by Tidal Drifting Hull.
supersedes_premise: >
  The prior "Claude = Claude Code" premise and the "structuredContent is
  model-invisible" belief encoded in
  packages/sdks/oak-curriculum-sdk/src/mcp/universal-tool-shared.ts comments.
---

# What claude.ai and ChatGPT.com actually read from MCP tool responses

## Why this exists

The graph-tooling rebuild foundation (principle 8) proposes that graph tools
return **`structuredContent` only** and drop the Oak context hint, *"to be
validated by the client research."* This is that research. The narrow question:

> When an MCP tool returns a result, what do **claude.ai** (the Claude
> desktop/web app — **not** Claude Code) and **ChatGPT.com** (web/desktop)
> actually read — `content`, `structuredContent`, or both — and who is the
> audience for each?

The answer determines whether "structuredContent only" delivers the graph to
the model, delivers nothing, or something in between.

## TL;DR verdict

1. **The model reads BOTH `content` and `structuredContent` on claude.ai and
   ChatGPT.com** when both are present (empirically verified cross-client). This
   **corrects** the simplistic "structuredContent is model-invisible" belief.
   The owner's instinct that graph data belongs in `structuredContent`, where
   the model can consume it as typed data, is **sound** for these two clients.
2. **But "structuredContent only" (no `content`) is spec-deviant, vendor-
   counter-recommended, and not confirmed working on either target client.** The
   MCP spec (current, 2025-11-25) and OpenAI's own connector guide both say to
   ALSO return the serialized JSON in a `content` text block. No public source
   demonstrates structuredContent-only succeeding on claude.ai web or ChatGPT
   chat-mode.
3. **Neither extreme is robust.** content-only breaks on Claude Code CLI (it
   drops `content`); structuredContent-only breaks on plain content-only clients
   and errors in VS Code. **Returning BOTH is the only robust shape.**
4. **Recommended revision to principle 8:** keep `structuredContent` as the
   canonical, `outputSchema`-validated graph payload, AND keep a **thin
   `content` narration block** (not the full JSON dump). Drop `oakContextHint`
   from the payload; if model-facing guidance is still wanted, put it in the
   tool *description*, never in `_meta` (which the model never sees).
5. **ChatGPT-specific constraint that the framing missed:** ChatGPT.com's
   **standard** connector still requires `search` + `fetch` tools in 2026
   (Developer Mode lifts this). A graph-explore tool is not search/fetch-shaped,
   so on a standard ChatGPT connector it will not surface at all unless under
   Developer Mode or alongside compliant `search`/`fetch` tools. This shapes the
   whole ChatGPT delivery path, independently of the content/structuredContent
   question.

## Regime constraint (owner clarification, 2026-05-28): MCP-App-only

The owner clarified (2026-05-28) that **Oak's tools are only ever surfaced
inside an MCP App** — specifically a **standard MCP App** (the open
`io.modelcontextprotocol/ui` extension — a `ui://` widget rendered inline),
**not** a ChatGPT-specific "ChatGPT App" / Apps-SDK submission, and never as
plain conversational tools. (The OpenAI Apps SDK docs cited below describe how
ChatGPT's *runtime* consumes MCP Apps; they are evidence of ChatGPT's rendering
behaviour, not something Oak authored to.) This is the regime with the
**strongest, most specific evidence**, and it changes the verdict:

- The residual "does claude.ai forward `structuredContent` for *plain* tools?"
  uncertainty is **moot** — we are always in the Apps regime, where it is
  documented that the model reads `structuredContent` (OpenAI Apps SDK:
  *"structuredContent — concise JSON the widget uses **and the model reads**"*;
  ext-apps#380: content + structuredContent model-visible, `_meta` iframe-only).
- The "breaks on plain content-only / older clients" objection to
  structuredContent-only **falls away** — those are not our targets, and our two
  targets (claude.ai, ChatGPT.com) both support MCP Apps and read
  `structuredContent`.
- In the Apps SDK, **`content` is explicitly "optional narration."** So
  **principle 8 ("structuredContent only") is substantially viable in this
  regime** — the model gets the data via `structuredContent`, the widget renders
  it, and the backwards-compat SHOULD's rationale (non-structuredContent
  clients) does not apply to our target set.

**Revised Apps-regime verdict:**

1. **`structuredContent` is the canonical, reliable channel** — read by both the
   widget and the model on both targets. Make it the home for the graph.
2. **A thin `content` narration is cheap insurance, not a requirement.** It is
   the one extra robustness against the bugs below and aids the conversational
   turn, but Apps marks it optional and the model can reason from
   `structuredContent` alone. Dropping it is a deliberate, documented deviation
   from the spec SHOULD — worth a one-line ADR note (rationale: target set all
   support structuredContent).
3. **The Apps bridges are currently buggy around exactly `content` / `_meta`**
   — ChatGPT Apps bridge (May 2026) rewrites `content[0].text` from
   `structuredContent` and **drops `_meta`**; Claude Code CLI drops `content`.
   `structuredContent` is the channel both reliably deliver to the model →
   structuredContent-canonical is the **robust** choice against these bugs, not
   the fragile one.
4. **Unlocked architecture (design option, not imposed):** the Apps regime
   enables a three-way split that directly serves the foundation doc's
   completeness-vs-budget tension —
   - `_meta`: full integrity-preserving graph → widget renders it richly to the
     human, **zero model-token cost**, "full detail is reachable" (foundation
     principle 5) satisfied by the widget;
   - `structuredContent`: a concise, integrity-preserving model-facing subgraph
     (relationships always represented, caveats travel with claims);
   - `content`: optional thin narration.

   **Caveat:** the current ChatGPT bug that drops `_meta` makes
   `_meta`-for-primary-data fragile **today**, so near-term the safer home for
   the (appropriately-scoped) graph is `structuredContent`. Revisit the
   `_meta`-split once the ChatGPT bridge bug is confirmed fixed.
5. **ChatGPT supports MCP Apps — assume it renders our standard MCP App
   (owner, 2026-05-28).** The client matrix lists ChatGPT as supporting
   `io.modelcontextprotocol/ui`, and the owner directs us to take that at face
   value: ChatGPT renders the `ui://` widget for a standard MCP App. The earlier
   "Developer Mode vs Apps-submission surfacing" detour is **moot and dropped**.
   The `search`/`fetch` mandate (ChatGPT's *connector / Deep Research* path) does
   **not** apply to MCP Apps. **No open ChatGPT surfacing gap remains** — both
   target clients render our app and feed the model `content` + `structuredContent`.

The general-case analysis below remains accurate for context; the section above
is the operative verdict for Oak's actual (Apps-only) regime.

## The audience of each output field (the direct answer)

| Field | Model sees it? | User sees it (in chat)? | Widget/iframe sees it? | Role |
|---|---|---|---|---|
| `content` (text block) | **Yes** (both clients) | **Yes** — rendered as conversation text / narration | Yes | Narration / human-readable summary. **Dropped by Claude Code CLI today (bug).** |
| `structuredContent` (one JSON object) | **Yes** (both clients, when present) | Indirectly (model narrates it; widget renders it) | Yes — drives the widget | Canonical typed data; validated against `outputSchema`. |
| `_meta` | **No — never** | No | Yes — iframe only | Widget routing / large-or-sensitive data. **Never put model-relevant data here.** |
| content-block `annotations.audience` (`["user"]` / `["assistant"]`) | hint | hint | hint | Advisory hint to the client about who a block is for; honoring is client-dependent. |

## Evidence

### Spec anchor (FIRM)

The MCP spec — confirmed identical in **2025-06-18** and the **latest
2025-11-25** revision — defines two result payloads and states, verbatim:

> "For backwards compatibility, a tool that returns structured content SHOULD
> also return the serialized JSON in a TextContent block."

The spec's own canonical example for a tool with `outputSchema` returns **both**
`content` (the JSON serialized as text) and `structuredContent` (the typed
object). `outputSchema` rules: servers **MUST** return conforming structured
results; clients **SHOULD** validate them.

### Fact 1 — both fields reach the model on the two target clients

- **Empirical cross-client test** (anthropics/claude-code issue #55677): one MCP
  server returning both `content[].text` and `structuredContent`, exercised from
  three clients on the same authenticated session:
  - **claude.ai (web): model receives both parts** ✅
  - **ChatGPT (MCP enabled): model receives both parts** ✅
  - Claude Code CLI: **only `structuredContent` reaches the model** ❌ (the bug
    the issue reports — `content[].text` is silently dropped).
  - The issue cites the MCP Apps visibility rule (ext-apps#380): *"`content` and
    `structuredContent` are model-visible; `_meta` is iframe-only."*
- **OpenAI Apps SDK docs** (verbatim): *"`structuredContent` — concise JSON the
  widget uses **and the model reads**."*; *"`content` — optional narration
  (Markdown or plaintext) for the model's response."*; *"`_meta` never reaches
  the model."* Apps SDK Reference: *"Only `structuredContent` and `content`
  appear in the conversation transcript."*
- **Client matrix**: Claude (web), Claude Desktop, and ChatGPT all support the
  MCP Apps extension (`io.modelcontextprotocol/ui`).
- Confidence: **HIGH** that both fields are model-visible on these clients when
  present. Caveat: the strongest empirical evidence sits in an MCP-Apps context
  (server declaring a UI resource); the Oak server is MCP-Apps-capable, so this
  is the relevant regime.

### Fact 2 — `_meta` is iframe-only, never model-visible

OpenAI: *"`_meta` never reaches the model."* ext-apps#380 agrees. Oak's own
`universal-tool-shared.ts` comment ("`_meta`: Widget ONLY sees this") is correct.

### Fact 3 — structuredContent-only is documented-risky and untested on the targets

- Spec SHOULD (above) explicitly recommends a serialized-JSON `content` block.
- OpenAI standard-connector guide: *"return this object as `structuredContent`
  and include the same value as a JSON-encoded string in the content array for
  compatibility."*
- No public source shows structuredContent-only succeeding on claude.ai web or
  ChatGPT chat-mode. Apps SDK marks `content` "Optional", but an active **May
  2026** ChatGPT Apps-bridge bug rewrites `content[0].text` from
  `structuredContent` and drops `_meta`, indicating fragile handling. VS Code
  (non-target) throws `TypeError: content is not iterable` on content-absent
  responses — an ecosystem signal.
- Confidence: **MEDIUM-HIGH** that structuredContent-only is risky/spec-deviant;
  the precise outcome on the two target clients is **untested in public sources**
  (honest gap).

### Fact 4 — content-only is also fragile (Claude Code CLI drops content)

Per #55677, Claude Code CLI forwards only `structuredContent`. So content-only
would fail there. Claude Code is not a "target client" for this question, but it
is an Oak-relevant consumer. Net: **only "both" is robust across the ecosystem.**

### Fact 5 — ChatGPT.com standard connector requires `search` + `fetch`

- Still active in 2026 for **standard** connectors **not** in Developer Mode
  (and for the Deep Research / "Company Knowledge" path regardless). Developer
  Mode does **not** require search/fetch.
- Required shapes (official OpenAI MCP guide):

  ```json
  // search →
  { "results": [ { "id": "...", "title": "...", "url": "..." } ] }
  // fetch →
  { "id": "...", "title": "...", "text": "...", "url": "...", "metadata": { } }
  ```

  each returned as `structuredContent` plus the same value JSON-encoded in a
  `content` text block.
- Implication: a graph-explore tool is not search/fetch-shaped → invisible on a
  standard ChatGPT connector unless under Developer Mode or alongside compliant
  `search`/`fetch` tools.

## Implications for the graph-tooling rebuild

### On principle 8 ("structuredContent only, drop context hint")

- **Revise to "structuredContent (canonical, `outputSchema`-validated) + a thin
  `content` narration block."** structuredContent is the right home for the
  graph and the model does read it on both targets — but dropping `content` to
  zero is spec-deviant, untested on the targets, and breaks content-only/older
  clients.
- **What goes in `content`?** Two options, an owner/Deep design call:
  - (a) *Spec-literal:* the full serialized graph JSON. Robust for
    content-only/chat-mode clients, but **doubles the graph on the wire** and the
    model (on claude.ai/ChatGPT) sees it **twice** — token waste and possible
    confusion. Poor fit for a large graph.
  - (b) *Apps-SDK-aligned (recommended):* a **concise narration** —
    e.g. "Subgraph: N strands, M relationships, scoped to <context>; full
    structured graph attached" — with the full graph in `structuredContent`.
    Token-efficient; matches OpenAI's "content = narration, structuredContent =
    the data the model reads." Cost: content-only/old clients get the summary,
    not the full graph (acceptable if those are explicitly non-target).
  - This is consistent with the rebuild's "completeness = integrity +
    traceability, not maximalism": `content` carries the human-facing pointer;
    `structuredContent` carries the integrity-preserving whole subgraph. The old
    shape's `content[1]` full-JSON dump + field-masked summary + cap was the
    list-thinking; structuredContent-canonical is correct.
- **`oakContextHint`:** dropping it from the response payload is defensible
  (Oak-specific cruft). But clarify its audience first: if it is guidance **for
  the model**, it cannot move to `_meta` (never model-visible) — the tool
  *description* (in `tools/list`) is the right home. If it is genuinely
  redundant, drop it outright.

### On "ChatGPT.com support" more broadly

Decide explicitly whether ChatGPT.com support means **standard connector**
(then `search`/`fetch` compliance is mandatory and the graph tool needs a
Developer-Mode or search/fetch-wrapped path) or **Developer Mode only** (arbitrary
tools, narrower audience). The existing compliance plan
(`.agent/plans/compliance/current/claude-and-chatgpt-app-submission-compliance.plan.md`)
is the place to reconcile this.

## Residual uncertainties (do not over-claim)

- Whether claude.ai forwards `structuredContent` to the model for **plain
  (non-MCP-Apps) tools** specifically — strong evidence in the Apps context, not
  cleanly documented for plain tools. Mitigated by "emit both" (safe either way).
- The exact behavior of each target client when `content` is **truly absent**
  (untested in public sources).
- The ChatGPT Apps-bridge bug (May 2026) may still be in flux.

## Sources

- [MCP Tools spec — 2025-06-18 (structuredContent, outputSchema, backwards-compat SHOULD)](https://modelcontextprotocol.io/specification/2025-06-18/server/tools)
- [MCP Tools spec — 2025-11-25 (latest; identical SHOULD language)](https://modelcontextprotocol.io/specification/2025-11-25/server/tools)
- [MCP Extension Support Matrix (Claude web + Desktop + ChatGPT support MCP Apps)](https://modelcontextprotocol.io/extensions/client-matrix)
- [MCP Apps extension overview](https://modelcontextprotocol.io/extensions/apps/overview)
- [anthropics/claude-code #55677 — cross-client empirical test (claude.ai web + ChatGPT receive both; Claude Code CLI drops content)](https://github.com/anthropics/claude-code/issues/55677)
- [OpenAI Apps SDK — build your MCP server (structuredContent "the model reads"; content "narration"; _meta never reaches the model)](https://developers.openai.com/apps-sdk/build/mcp-server)
- [OpenAI Apps SDK — reference ("Only structuredContent and content appear in the conversation transcript")](https://developers.openai.com/apps-sdk/reference)
- [OpenAI — Building MCP servers for ChatGPT (search/fetch shapes; structuredContent + JSON content)](https://developers.openai.com/api/docs/mcp)
- [OpenAI — ChatGPT Developer Mode (search/fetch not required under Developer Mode)](https://developers.openai.com/api/docs/guides/developer-mode)
- [SEP-1624 — clarify structuredContent vs content usage](https://github.com/modelcontextprotocol/modelcontextprotocol/issues/1624)
- [microsoft/vscode #297669 — structuredContent-only causes TypeError (ecosystem signal)](https://github.com/microsoft/vscode/issues/297669)
- [OpenAI community — Apps bridge drops _meta / rewrites content (May 2026)](https://community.openai.com/t/chatgpt-mcp-apps-bridge-drops-custom-meta-from-tool-results-in-ui-notifications-tool-result/1378047)
