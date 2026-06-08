# Oak Curriculum MCP — manual UAT guide

A rough, manual black-box walkthrough (UAT) for the Oak Curriculum MCP
server. Run it by hand — as an engineer or an AI agent — to gain
end-to-end confidence in a server before you trust it in a host.

This is **helpful guidance, not an exhaustive or prescriptive test
matrix.** Cover what is useful, skip what is not. It complements the
automated suites (`test`, `test:e2e`, `test:ui`); it does not replace
them.

## What server can this run against?

Any running instance — it does **not** need to be deployed:

| Target                       | MCP endpoint                | Auth                                                                                                  |
| ---------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| Local dev (no auth)          | `http://localhost:3333/mcp` | None — start with `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev:observe:noauth`. |
| Local dev (with auth)        | `http://localhost:3333/mcp` | Clerk OAuth (the `qa:oauth` / with-auth variant). Complete OAuth in the host when prompted.           |
| Vercel preview or production | `{origin}/mcp`              | Clerk OAuth; only Oak test users today. Copy the deployment origin from Vercel (no trailing slash).   |

A host (Cursor, Claude Desktop, MCPJam, or this Claude Code session's
MCP integration) is the easiest way to call tools. To use a host, add an
HTTP MCP server pointing at the `/mcp` URL and complete OAuth if
prompted. [MCPJam](https://www.mcpjam.com/) is an MCP Apps–compatible
host useful for visual review of widget-bearing tools. To call without a
host, see [Appendix: calling with curl](#appendix-calling-with-curl).

## Before you start

- **Run `tools/list` once.** The server's live tool list is the source
  of truth — this guide is illustrative and can lag the surface. Cover
  any tool that is present but not listed here, and skip any row whose
  tool is absent (tool availability varies by branch and by feature
  flag).
- Record the target (URL or `localhost:3333`) and the date in your PR or
  handoff note when you finish.

---

## A. HTTP baseline (optional, ~2 minutes)

Run from a shell. Substitute `ORIGIN` for the server host (scheme + host
only). On a no-auth local server, A2/A3 do not apply — auth is disabled.

| #   | What           | How                                                                                                                                                                                                                                                                                                  | Expected result                                                                                |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| A1  | Liveness       | `curl -sS -o /dev/null -w '%{http_code}\n' ORIGIN/healthz`                                                                                                                                                                                                                                           | `200`                                                                                          |
| A2  | OAuth metadata | `curl -sS ORIGIN/.well-known/oauth-protected-resource`                                                                                                                                                                                                                                               | HTTP `200`; JSON includes `resource` and `authorization_servers` (or equivalent PRM fields)    |
| A3  | Auth challenge | `curl -sS -D - -o /dev/null -X POST ORIGIN/mcp -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"checklist","version":"1"}}}'` | HTTP `401`; response headers include `WWW-Authenticate` with `Bearer` and `resource_metadata=` |

### Infrastructure checks (deployed servers only)

Worth doing once after a preview or production deploy:

- Confirm Node runtime (not Edge) in project settings.
- Verify required envs are set: `OAK_API_KEY`, `ALLOWED_HOSTS`,
  `ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`.
- POST `/mcp` with a valid Bearer token returns `200` and SSE-wrapped
  JSON-RPC.
- Disallowed or malformed `Host` headers return `403` on the OAuth
  metadata endpoints and the `/mcp` auth-challenge path.

---

## B. Orientation (required)

Call these **first** in the host chat (or via the MCP tool UI). Agents
should follow the same order on every new session.

| #   | Tool                   | How                              | Expected result                                                                                                                              |
| --- | ---------------------- | -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | `get-curriculum-model` | Invoke with `{}` (no arguments). | Success: text or structured content describing the domain model, tool guidance, key stages, and tips. No HTTP 5xx, no opaque JSON-RPC error. |
| B2  | `get-changelog-latest` | Invoke with `{}`.                | Success: API version string and date (e.g. `0.7.x` and a recent date). Confirms upstream Oak API reachability.                               |
| B3  | `get-rate-limit`       | Invoke with `{}` if listed.      | Success: rate-limit status for the authenticated principal (may show unlimited for internal users).                                          |

---

## C. Discovery

| #   | Tool                 | How (example args)                                                                                                                         | Expected result                                                                               |
| --- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| C1  | `browse-curriculum`  | Key stage `ks3`, subject `science` (or equivalent browse args your client sends).                                                          | Non-empty curriculum tree or listing; navigable structure, not an error stub.                 |
| C2  | `get-subjects`       | `{}` or key-stage scoped per tool schema.                                                                                                  | List of subjects with stable ids/slugs.                                                       |
| C3  | `get-key-stages`     | `{}`.                                                                                                                                      | Key stages present (e.g. ks1–ks4).                                                            |
| C4  | `get-subject-detail` | Subject `maths` (or slug from C2).                                                                                                         | Detail payload for one subject.                                                               |
| C5  | `get-keywords`       | Scope it — pass `unit` or `lesson` with subject + key stage. Subject + key stage **alone** returns a very large payload (see the §G note). | Keyword list (most frequent first) or an empty set with clear semantics — not a server error. |

---

## D. Search (exercise each scope your branch exposes)

| #   | Tool               | How (example)                                                                                                         | Expected result                                                                                                |
| --- | ------------------ | --------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| D1  | `search` lessons   | Query `photosynthesis`, scope lessons, filters KS3 science if supported.                                              | Ranked lesson hits; titles/slugs usable for fetch.                                                             |
| D2  | `search` units     | Query `fractions`, scope units, subject maths.                                                                        | Unit hits relevant to query.                                                                                   |
| D3  | `search` threads   | Subject maths, scope threads (query optional).                                                                        | Thread hits or valid empty result.                                                                             |
| D4  | `search` sequences | Query e.g. `maths-secondary`, scope sequences.                                                                        | Sequence-level hits.                                                                                           |
| D5  | `search` suggest   | Partial query `photo` **with `subject` or `keyStage`** — the completion index requires a context; omitting it errors. | Suggestions returned. (A formerly noted empty-`url` quirk could not be reproduced — re-check if it reappears.) |
| D6  | `explore-topic`    | Topic `volcanoes`, subject geography (cross-scope).                                                                   | Topic exploration payload, not a transport failure.                                                            |

---

## E. Fetch by id

Use slugs/ids from search or browse results.

| #   | Tool    | How (example)                                        | Expected result                                                        |
| --- | ------- | ---------------------------------------------------- | ---------------------------------------------------------------------- |
| E1  | `fetch` | Resource id `subject:maths`.                         | Subject document with fields expected by schema.                       |
| E2  | `fetch` | Lesson id from D1 (e.g. photosynthesis lesson slug). | Lesson resource; content or metadata present.                          |
| E3  | `fetch` | Unit id from D2 or browse.                           | Unit resource.                                                         |
| E4  | `fetch` | Thread id from D3.                                   | Thread resource (thread units may show `oakUrl: null` — non-blocking). |

---

## F. Lesson and unit depth

| #   | Tool                     | How                  | Expected result                         |
| --- | ------------------------ | -------------------- | --------------------------------------- |
| F1  | `get-lessons-summary`    | Lesson slug from E2. | Summary sections for the lesson.        |
| F2  | `get-lessons-quiz`       | Same lesson slug.    | Quiz items or explicit empty state.     |
| F3  | `get-lessons-transcript` | Same lesson slug.    | Transcript text or structured segments. |
| F4  | `get-lessons-assets`     | Same lesson slug.    | Asset list or download references.      |
| F5  | `get-units-summary`      | Unit slug from E3.   | Unit summary content.                   |

---

## G. Graph tools (branch-dependent)

Skip this section if `tools/list` does not include these names.

> **Large payloads — may exceed your host's token limit.** These tools return
> the entire graph in one response. Measured on this branch:
> `get-prior-knowledge-graph` ≈ 1.5 MB and `get-misconception-graph` larger
> again (`get-keywords` at subject + key-stage scope ≈ 200 KB has the same
> shape). An MCP host may reject or truncate a response this large. Treat
> "returns without a transport error" as the pass; a host-side size cap is a
> known limitation, not a server fault, and where a tool accepts narrowing
> arguments, scope the call down.

| #   | Tool                        | How                 | Expected result                                                           |
| --- | --------------------------- | ------------------- | ------------------------------------------------------------------------- |
| G1  | `get-thread-progressions`   | `{}` or per schema. | Large graph payload (order hundreds of threads on graph branches).        |
| G2  | `get-prior-knowledge-graph` | `{}`.               | Nodes/edges counts in thousands on full graph branches.                   |
| G3  | `get-misconception-graph`   | `{}`.               | Misconception graph data (tens of thousands of entries on full branches). |

---

## H. EEF evidence surface

The EEF (Education Endowment Foundation) Teaching and Learning Toolkit
surface ships **live by default** (release-pre-proof). It is co-gated by
`OAK_CURRICULUM_MCP_EEF_ENABLED`: an explicit `=false` is the
**kill-switch** that removes the tool, the resource, and the prompt
together. With the env var unset, all three are present.

The surface is a deterministic projection of a fixed corpus — the
invoking agent does the reasoning, the tool only returns the corpus's own
facts. The values below are the corpus's own (see the strand ids and
fields in `get-eef-evidence`'s input schema and the
[EEF corpus source-path table](../../../.agent/plans/sector-engagement/eef/current/eef-d2-source-path-table.md));
treat any value the payload returns as a claim to check against that
chain, not to invent.

| #   | Surface                     | How                                                                                                                                                                                                                                                                                                        | Expected result                                                                                                                                                                                                                          |
| --- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| H1  | `get-eef-evidence` (strand) | `{ "function": "inspect-strand", "strandId": "eef-tl-feedback" }`                                                                                                                                                                                                                                          | Evidence envelope for Feedback: headline `+6` months / `Very Low` cost / `Extensive` evidence; key findings; `caveats`; a `frontier` of related strands; full `provenance.source` including `original_authors`.                          |
| H2  | `get-eef-evidence` (move)   | `{ "function": "evidence-for-move", "priority": "closing_disadvantage_gap" }`                                                                                                                                                                                                                              | Strands the corpus tags for that priority. Axis filters (`phase` / `keyStage` / `priority`) focus the result; they do not bound coverage.                                                                                                |
| H3  | `get-eef-evidence` (error)  | `{ "function": "evidence-for-move" }` (no selector)                                                                                                                                                                                                                                                        | `isError: true` with a clear message ("requires at least one selector…"). An unknown strand id or finite-vocabulary value likewise errors at the boundary.                                                                               |
| H4  | Insufficient/null strand    | `{ "function": "inspect-strand", "strandId": "eef-tl-learning-styles" }`                                                                                                                                                                                                                                   | The honest "insufficient evidence / little-to-no impact" finding reaches you verbatim (null impact / `Insufficient`). A floor-only strand returns the universal floor with richer fields **omitted**, never fabricated or emitted empty. |
| H5  | `eef://interpretation`      | `resources/read` the URI `eef://interpretation`.                                                                                                                                                                                                                                                           | A `text/markdown` reasoning scaffold: how to read the evidence faithfully, the strand index, and the corpus methodology/caveats.                                                                                                         |
| H6  | `adapt-lesson` prompt       | `prompts/get` `adapt-lesson` with `topic` (e.g. `"adding fractions"`) and `yearGroup` (e.g. `"Year 4"`). Prompt invocation is host-dependent — some hosts surface MCP prompts as slash commands or a prompt picker, not an agent-callable tool; use curl (see appendix) if your host can't invoke prompts. | Workflow messages that start the evidence-grounded lesson-adaptation flow (Oak retrieval + EEF evidence).                                                                                                                                |

**Independent ground-truth check (the value that matters).** Pick a known
strand and confirm its corpus values — caveat text, evidence strength,
cost, impact — appear **verbatim** in the payload, not merely that the
fields are present. Sourcing the expected values from the corpus (not
from this guide) is what proves faithful transmission.

**Faithfulness when you present it.** Anything you draft from EEF evidence
must carry its source attribution, caveats, strength, cost, impact, and
uncertainty, and must frame it as population-level evidence that _may
inform_ a teacher's judgement — never a guaranteed local outcome, and
never teacher-replacing or single-answer selection language. Mapping a
teacher's situation to a pedagogical move and then to a strand is the
agent's reasoning, not a tool input.

---

## I. Error and filter behaviour

| #   | What           | How                                                                   | Expected result                                                                                                                           |
| --- | -------------- | --------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| I1  | Missing entity | `fetch` or a lesson tool with a deliberately invalid slug.            | Clear user-facing message (e.g. **Lesson not found**); a tool success path with `isError` or error content — **no** process crash or 5xx. |
| I2  | Tier filter    | Search with KS4 higher-tier trigonometry (or equivalent filter args). | Results respect the filter; tier metadata visible where applicable.                                                                       |

---

## Sign-off

Minimum bar for **ready to trust**:

- All of **A1–A3** (if you ran section A, against an authenticated
  server), and **B1–B3**, and at least **C1**, **D1**, **E2**, **F1**.
- If the EEF surface is present: at least **H1** and **H5**.
- No blocking 5xx or auth loop on repeated tool calls.
- Note any non-blocking quirks in the PR (empty suggest URLs, null
  `oakUrl`, etc.).

For Sentry error-path validation (separate from curriculum behaviour),
use `scripts/probe-sentry-error-capture.sh` and the
[Sentry deployment runbook](../../../docs/operations/sentry-deployment-runbook.md).

---

## Appendix: calling with curl

When no MCP host is available, call the StreamableHTTP endpoint directly.
It is stateless, so no `initialize` handshake is needed; the reply is an
SSE stream, so parse the `data:` line. Substitute `ORIGIN` (use
`http://localhost:3333` for a local dev server).

```bash
curl -sS -X POST ORIGIN/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get-eef-evidence","arguments":{"function":"inspect-strand","strandId":"eef-tl-feedback"}}}' \
  | grep '^data:' | sed 's/^data: //' | jq
```

Swap `params` for `tools/list`, `resources/read`
(`{"uri":"eef://interpretation"}`), or `prompts/get`
(`{"name":"adapt-lesson","arguments":{"topic":"…","yearGroup":"…"}}`) to
exercise the other primitives. Against an authenticated server, add
`-H 'Authorization: Bearer <token>'`.

## Related

- [README — manual test guide pointer](../README.md#manual-test-guide-any-server)
- [ADR-058 context grounding](../../../docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md)
- [ADR-123 MCP primitives](../../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md)
- [ADR-121 quality-gate surfaces](../../../docs/architecture/architectural-decisions/121-quality-gate-surfaces.md)
  — this guide replaced the retired `pnpm smoke:remote` harness.
