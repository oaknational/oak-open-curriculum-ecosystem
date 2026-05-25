# Agent preview test checklist

Manual black-box verification for a **deployed** Oak Curriculum MCP server
(Vercel preview or production). Use this after a preview deploy and before you
trust a new URL in Cursor or another MCP host.

Replaces the retired `pnpm smoke:remote` harness (ADR-121, 2026-05-04). This is
operational documentation only — no ADR required.

## Before you start

| Item         | Action                                                                                                                            |
| ------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| Preview URL  | Copy the deployment origin from Vercel (no trailing slash). MCP endpoint is `{origin}/mcp`.                                       |
| Cursor       | Add or update an HTTP MCP server in `.cursor/mcp.json` (or Cursor UI) with that `/mcp` URL.                                       |
| Auth         | Complete OAuth in the host when prompted. Preview uses Clerk; only Oak test users today.                                          |
| Branch tools | Tool names vary by branch (e.g. graph tools on graph-support branches). Run `tools/list` once and skip rows that are not present. |

Record the preview URL and date in your PR or handoff note when you finish.

---

## A. HTTP baseline (optional, ~2 minutes)

Run from a shell. Substitute `ORIGIN` for your deployment host (scheme + host only).

| #   | What           | How                                                                                                                                                                                                                                                                                                  | Expected result                                                                                |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| A1  | Liveness       | `curl -sS -o /dev/null -w '%{http_code}\n' ORIGIN/healthz`                                                                                                                                                                                                                                           | `200`                                                                                          |
| A2  | OAuth metadata | `curl -sS ORIGIN/.well-known/oauth-protected-resource`                                                                                                                                                                                                                                               | HTTP `200`; JSON includes `resource` and `authorization_servers` (or equivalent PRM fields)    |
| A3  | Auth challenge | `curl -sS -D - -o /dev/null -X POST ORIGIN/mcp -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"checklist","version":"1"}}}'` | HTTP `401`; response headers include `WWW-Authenticate` with `Bearer` and `resource_metadata=` |

---

## B. Cursor / agent MCP — orientation (required)

Call these **first** in the host chat (or via MCP tool UI). Agents should follow
the same order on every new session.

| #   | Tool                   | How                              | Expected result                                                                                                                          |
| --- | ---------------------- | -------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------- |
| B1  | `get-curriculum-model` | Invoke with `{}` (no arguments). | Success: text or structured content describing domain model, tool guidance, key stages, and tips. No HTTP 5xx, no opaque JSON-RPC error. |
| B2  | `get-changelog-latest` | Invoke with `{}`.                | Success: API version string and date (e.g. `0.7.x` and a recent date). Confirms upstream Oak API reachability.                           |
| B3  | `get-rate-limit`       | Invoke with `{}` if listed.      | Success: rate-limit status for the authenticated principal (may show unlimited for internal users).                                      |

---

## C. Discovery

| #   | Tool                 | How (example args)                                                                | Expected result                                                               |
| --- | -------------------- | --------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| C1  | `browse-curriculum`  | Key stage `ks3`, subject `science` (or equivalent browse args your client sends). | Non-empty curriculum tree or listing; navigable structure, not an error stub. |
| C2  | `get-subjects`       | `{}` or key-stage scoped per tool schema.                                         | List of subjects with stable ids/slugs.                                       |
| C3  | `get-key-stages`     | `{}`.                                                                             | Key stages present (e.g. ks1–ks4).                                            |
| C4  | `get-subject-detail` | Subject `maths` (or slug from C2).                                                | Detail payload for one subject.                                               |
| C5  | `get-keywords`       | Subject + key stage per schema.                                                   | Keyword list or empty set with clear semantics (not a server error).          |

---

## D. Search (exercise each scope your branch exposes)

| #   | Tool               | How (example)                                                            | Expected result                                                        |
| --- | ------------------ | ------------------------------------------------------------------------ | ---------------------------------------------------------------------- |
| D1  | `search` lessons   | Query `photosynthesis`, scope lessons, filters KS3 science if supported. | Ranked lesson hits; titles/slugs usable for fetch.                     |
| D2  | `search` units     | Query `fractions`, scope units, subject maths.                           | Unit hits relevant to query.                                           |
| D3  | `search` threads   | Subject maths, scope threads (query optional).                           | Thread hits or valid empty result.                                     |
| D4  | `search` sequences | Query e.g. `maths-secondary`, scope sequences.                           | Sequence-level hits.                                                   |
| D5  | `search` suggest   | Partial query `photo` with science context if required.                  | Suggestions returned (known quirk: `url` may be empty — non-blocking). |
| D6  | `explore-topic`    | Topic `volcanoes`, subject geography (cross-scope).                      | Topic exploration payload, not a transport failure.                    |

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

| #   | Tool                        | How                 | Expected result                                                           |
| --- | --------------------------- | ------------------- | ------------------------------------------------------------------------- |
| G1  | `get-thread-progressions`   | `{}` or per schema. | Large graph payload (order hundreds of threads on graph branches).        |
| G2  | `get-prior-knowledge-graph` | `{}`.               | Nodes/edges counts in thousands on full graph branches.                   |
| G3  | `get-misconception-graph`   | `{}`.               | Misconception graph data (tens of thousands of entries on full branches). |

---

## H. Error and filter behaviour

| #   | What           | How                                                                   | Expected result                                                                                                                              |
| --- | -------------- | --------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| H1  | Missing entity | `fetch` or lesson tool with a deliberately invalid slug.              | Clear user-facing message (e.g. **Lesson not found**); HTTP/tool success path with `isError` or error content — **no** process crash or 5xx. |
| H2  | Tier filter    | Search with KS4 higher-tier trigonometry (or equivalent filter args). | Results respect filter; tier metadata visible where applicable.                                                                              |

---

## Sign-off

Minimum bar for **preview ready**:

- All of **A1–A3** (if you ran section A), and **B1–B3**, and at least **C1**, **D1**, **E2**, **F1**.
- No blocking 5xx or auth loop on repeated tool calls.
- Note any non-blocking quirks in the PR (empty suggest URLs, null `oakUrl`, etc.).

For Sentry error-path validation (separate from curriculum behaviour), use
`scripts/probe-sentry-error-capture.sh` and the
[Sentry deployment runbook](../../../docs/operations/sentry-deployment-runbook.md).

## Related

- [README smoke-test checklist](../README.md#smoke-test-checklist-post-deploy)
- [ADR-058 context grounding](../../../docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md)
- [ADR-123 MCP primitives](../../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md)
