# Oak Curriculum MCP — UAT validation runbook

A repeatable, black-box **user-acceptance-test (UAT) runbook** for the Oak
Curriculum MCP server as a whole. Run it by hand — as an engineer or an AI
agent — against any running instance to gain end-to-end confidence in every
surface (transport, auth, all served tools and resources — and the deliberate prompts absence) before you trust
the server in a host or sign off a release.

This runbook is designed to be run **repeatedly and identically**: same
sections, same acceptance criteria, same record template, every time. It is a
black-box behavioural check that **complements** the automated suites
(`test`, `test:e2e`, `test:ui`, `test:widget`); it does not replace them. Those
prove the code; this proves the _deployed, reachable server_ behaves end to
end, including the protocol-shape and client-rendering concerns that only show
up over the wire.

> **Scope.** "Validate the server as a whole" is the design goal. Sections 1–13
> below cover every primitive the server exposes. You may run a **smoke subset**
> (see [Sign-off](#sign-off)) for a quick confidence pass, or the **full
> matrix** for a release gate — but the runbook always _describes_ the whole
> surface so nothing is silently skipped.

## When to run

- **Before a milestone release** (go/no-go input — see the
  [Milestone Release Runbook](../../../docs/engineering/milestone-release-runbook.md)).
- **After any preview or production deploy**, to confirm the live server is
  healthy and reachable.
- **After `pnpm sdk-codegen`** or any change to the tool/resource
  surface — the inventory self-check (Section 0) catches additions and
  removals.
- **Periodically against production** as a live regression / "is it still
  working?" pass.
- **When investigating a client-visibility report** (a tool that renders in one
  host but not another) — the [response-shape contract](#the-response-shape-contract)
  section is the diagnostic.

## What you can run it against

Any running instance — it does **not** need to be deployed:

| Target                       | MCP endpoint                | Auth                                                                                                  |
| ---------------------------- | --------------------------- | ----------------------------------------------------------------------------------------------------- |
| Local dev (no auth)          | `http://localhost:3333/mcp` | None — start with `pnpm --filter @oaknational/oak-curriculum-mcp-streamable-http dev:observe:noauth`. |
| Local dev (with auth)        | `http://localhost:3333/mcp` | Clerk OAuth (the `qa:oauth` / with-auth variant). Complete OAuth in the host when prompted.           |
| Vercel preview or production | `{origin}/mcp`              | Clerk OAuth; only Oak test users today. Copy the deployment origin from Vercel (no trailing slash).   |

Production alpha origin: `https://curriculum-mcp-alpha.oaknational.dev`.

> **Environment edits need a deployment AND a boot check.** Changing a
> deployment environment's variables can break the running functions, and a
> production redeploy cannot restore them on its own: the production build is
> gated to release commits (the `ignoreCommand` cancels any build whose root
> `package.json` version has not advanced), so recovery needs a release. After
> ANY environment change, run section 1.1 against the affected origin —
> worked instance 2026-08-03, both preview and production.

A **host** (Cursor, Claude Desktop/Code, MCPJam, ChatGPT, or this session's MCP
integration) is the easiest way to call tools — add an HTTP MCP server pointing
at the `/mcp` URL and complete OAuth if prompted.
[MCPJam](https://www.mcpjam.com/) is an MCP Apps–compatible host useful for
visual review of the widget surface. To call **without** a host, see
[Appendix B: calling with curl](#appendix-b-calling-with-curl).

**Programmatic validation (MCPJam CLI).** Beyond the GUI host, the MCPJam CLI
(`pnpm dlx @mcpjam/cli@latest …`; install and `login` per the repo README's
Prerequisites section) drives this runbook from the terminal or CI:
`protocol conformance` (MCP-spec conformance), `apps conformance` / `apps render`
(MCP Apps / widget — §13), and `eval` (hosted, cross-LLM tool-behaviour evals —
needs `mcpjam login`). It exposes the full response envelope, so the dual-shape
`content[1]` block is directly checkable — which a `structuredContent`-only
host cannot show (prompt enumeration returns none: the app serves zero
prompts, §11). Caveats: `apps conformance`
is server-side only (it does not prove host lifecycle, sandbox, or postMessage);
and run `protocol conformance` against the **no-auth** build to exercise the
Host/Origin checks, since an auth build rejects the probe at the auth layer and
masks them. See `.agent/reports/evals-and-assurance-position-2026-06-23.md` for
how conformance and evals fit the test / evaluate / assure picture, and the
machine-level `mcp-inspector` skill for reading MCPJam output conservatively.

## How to use this runbook

1. **Pick a target** and record it (URL or `localhost:3333`), plus the date and
   who/what is running the pass.
2. **Run Section 0** (inventory self-check) first — the live `tools/list` /
   `resources/list` / `prompts/list` is the source of truth, and this runbook's
   [inventory appendix](#appendix-a-expected-live-inventory) is the
   reconciliation reference.
3. **Work through the sections** you need (smoke subset or full matrix). For
   each row, apply the [response-shape contract](#the-response-shape-contract)
   _and_ the row's specific expected result.
4. **Fill in the [run-record template](#run-record-template)** as you go — mark
   each section PASS / FAIL / N-A, and log any finding with a severity from the
   [release runbook severity model](../../../docs/engineering/milestone-release-runbook.md#severity-model).
5. **Decide sign-off** against the bar in [Sign-off](#sign-off). Attach the
   completed record to the PR, deploy note, or handoff.

### Quick smoke pass (≈5 minutes)

The fastest "is it alive and serving real data?" path. Run these in order; if
all pass, the server is healthy enough to trust for most work. Run the **full
matrix** (Sections 1–13) for a release gate.

1. **0.1** `tools/list` — the expected tools are present.
2. **2.1** `get-curriculum-model` `{}` — orientation returns.
3. **2.2** `get-changelog-latest` `{}` — upstream API reachable; record the version.
4. **4.1** `search` `{ scope: 'lessons', query: 'photosynthesis', subject: 'science', keyStage: 'ks3' }` — ranked hits with fetchable slugs.
5. **5.2** `fetch` a lesson id from step 4.
6. **7.2** `get-prior-knowledge-graph` `{ unitSlugs: ['<a unit slug>'] }` — stated prior-knowledge statements, anchors echoed.
7. If EEF is present: **8.1** `get-eef-evidence` `{ function: 'inspect-strand', strandId: 'eef-tl-feedback' }` and **8.6** read `eef://interpretation`.
8. **12.2** `search` `{}` (no scope) — expect `-32602` (negative control: the server rejects bad input).

Pass = each returns the dual-content shape (or the correct error), no 5xx, no
auth loop. Then fill the [run-record template](#run-record-template).

> **Slugs are corpus keys.** Example anchors in this runbook (unit
> `understanding-percentages`, thread `number-fractions`, lesson slugs, etc.)
> are illustrative and can change as the curriculum evolves. **Resolve a live
> slug first** with `search` / `browse-curriculum` / `fetch`, then feed it to
> the downstream tool. A row that fails only because an example slug has moved
> is not a server fault — re-anchor and re-run.

## The response-shape contract

Every successful tool call from this server returns the **dual-content success
shape** (the family contract — `formatToolResponse` /
`formatStandardContent`):

```text
content:           [ TextContent(one-line summary), TextContent(JSON.stringify(data)) ]
structuredContent: { ...data, summary, status?, answerType? }
_meta:             { ...annotations (title, ui, etc.) }
```

- `content[0]` is a human-readable summary line.
- `content[1]` is the raw serialised data JSON (MCP spec SHOULD for structured
  results — backwards compatibility for content-only clients).
- `structuredContent` is the same data plus decoration keys
  (`summary` / `status` / `answerType`).

Two non-success shapes are also contract-correct:

- **Caller-driven refusal** — `content: [TextContent(message)]`, `isError: true`
  (e.g. a graph tool's `limit: 0`, EEF with no selector). The message reaches
  the agent.
- **Input-schema violation** — rejected before the handler by the MCP SDK
  layer, surfaced as JSON-RPC error `-32602` ("Invalid arguments for tool …").

**Acceptance criterion for every success row:** the response carries BOTH the
serialised `content` blocks AND the decorated `structuredContent`. This is the
contract that keeps the server renderable across the whole client population.

> **Client rendering varies — and that is exactly why the dual shape matters.**
> Different hosts surface different halves of the response: Cursor surfaces only
> `content` blocks; Claude Code surfaces only `structuredContent`; claude.ai and
> ChatGPT surface both. A tool that emitted `content: []` (structuredContent
> only) was historically invisible in content-only clients (rendered
> `(omitted)`) — the EEF tool's `content: []` shape was aligned onto the dual
> shape for this reason. When validating in a single host, judge "did the data
> arrive" by what _that host_ renders, but treat a missing `content[1]`
> serialised block on a success as a **P1 contract regression**, not a client
> quirk. Over curl (Appendix B) you always see the full envelope regardless of
> host.

---

## 0. Inventory self-check (anti-drift)

Run first. The live server is the source of truth; reconcile against
[Appendix A](#appendix-a-expected-live-inventory).

| #   | Method           | How             | Expected result                                                                                                                                 |
| --- | ---------------- | --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| 0.1 | `tools/list`     | List tools.     | The expected tool set is present (Appendix A lists 40 served: 39 live universal + 1 app-local). Note any **addition or removal**.               |
| 0.2 | `resources/list` | List resources. | `curriculum://model`, `docs://oak/getting-started.md`, the three `docs://oak/guidance/*` navigation documents, and the MCP App `ui://…` widget. |
| 0.3 | `prompts/list`   | Probe prompts.  | JSON-RPC error `-32601` Method not found — the app serves zero prompts (D11); a result listing ANY prompt is a defect.                          |

Any tool/resource/prompt **present but not covered below** must still be
exercised — add a row to your record. Any item **absent** that you expected is
a finding (availability varies by branch and by feature flag; confirm whether a
flag explains it before logging a fault).

---

## 1. Transport and auth baseline (deployed servers)

Run from a shell. Substitute `ORIGIN` for the server host (scheme + host only).
On a no-auth local server, 1.2/1.3 do not apply — auth is disabled.

**Which path to probe on which host (MCP-580).** The canonical host
(`www.thenational.academy`) forwards only `/mcp` and `/mcp/*` to this app, so a
root-level probe there reaches the main website and returns its 404 HTML. Rows
1.1 and 1.2 therefore carry both forms: use the canonical one on `www`, the root
one on the alpha host and locally. **Send no trailing slash** — `/mcp/healthz/`
reaches the same handler but matches no auth-skip entry, so it drags the auth
vendor into the liveness path (a characterised, owner-held trailing-slash class,
not a defect of this route).

| #   | What           | How                                                                                                                                                                                                                                                                                            | Expected result                                                                       |
| --- | -------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- |
| 1.1 | Liveness       | `curl -sS -o /dev/null -w '%{http_code}\n' ORIGIN/mcp/healthz` (canonical host) or `ORIGIN/healthz` (alpha host, local)                                                                                                                                                                        | `200`, `Cache-Control: no-store`                                                      |
| 1.2 | OAuth metadata | `curl -sS ORIGIN/.well-known/oauth-protected-resource/mcp` (canonical host — the path-qualified route the handshake advertises) or `ORIGIN/.well-known/oauth-protected-resource` (alpha host, local)                                                                                           | HTTP `200`; JSON includes `resource` and `authorization_servers` (PRM fields)         |
| 1.3 | Auth challenge | `curl -sS -D - -o /dev/null -X POST ORIGIN/mcp -H 'Content-Type: application/json' -H 'Accept: application/json, text/event-stream' -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-03-26","capabilities":{},"clientInfo":{"name":"uat","version":"1"}}}'` | HTTP `401`; headers include `WWW-Authenticate` with `Bearer` and `resource_metadata=` |
| 1.4 | Host guard     | Repeat 1.2 with a bogus `-H 'Host: evil.example'`.                                                                                                                                                                                                                                             | `403` on a deployed server whose `ALLOWED_HOSTS` excludes the bogus host.             |

**Infrastructure checks (once after a preview/production deploy):** Node runtime
(not Edge); required envs set (`OAK_API_KEY`, `ALLOWED_HOSTS`,
`ELASTICSEARCH_URL`, `ELASTICSEARCH_API_KEY`); a POST `/mcp` with a valid Bearer
token returns `200` SSE-wrapped JSON-RPC.

---

## 2. Orientation

Call these **first** in any session (the server requires `get-curriculum-model`
before other curriculum tools).

| #   | Tool                   | How  | Expected result                                                                                                      |
| --- | ---------------------- | ---- | -------------------------------------------------------------------------------------------------------------------- |
| 2.1 | `get-curriculum-model` | `{}` | Domain model + tool guidance (key stages, subjects, entity hierarchy, tool categories, workflows, tips). Dual shape. |
| 2.2 | `get-changelog-latest` | `{}` | Latest upstream API version string + date — confirms upstream Oak API reachability. **Record the version.**          |
| 2.3 | `get-changelog`        | `{}` | Changelog entries (list form of 2.2).                                                                                |
| 2.4 | `get-rate-limit`       | `{}` | Rate-limit status for the authenticated principal (may be unlimited for internal users).                             |

---

## 3. Discovery and browse

| #    | Tool                      | How (example args)                                         | Expected result                                                                                            |
| ---- | ------------------------- | ---------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 3.1  | `browse-curriculum`       | `{}`, then `{ subject: 'science', keyStage: 'ks3' }`       | Faceted subjects / key stages / units / lesson counts; navigable, not a stub.                              |
| 3.2  | `explore-topic`           | `{ query: 'volcanoes', subject: 'geography' }`             | Cross-scope topic map (top lessons + units + threads).                                                     |
| 3.3  | `get-subjects`            | `{}`                                                       | Subjects with stable slugs.                                                                                |
| 3.4  | `get-subjects-key-stages` | `{}`                                                       | Subject × key-stage availability matrix.                                                                   |
| 3.5  | `get-subjects-years`      | `{}`                                                       | Subject × year availability.                                                                               |
| 3.6  | `get-subject-detail`      | `{ subject: 'maths' }` (or slug from 3.3)                  | Detail payload for one subject.                                                                            |
| 3.7  | `get-key-stages`          | `{}`                                                       | Key stages present (ks1–ks4).                                                                              |
| 3.8  | `get-threads`             | `{ subject: 'maths' }` per schema                          | Thread list for the subject.                                                                               |
| 3.9  | `get-threads-units`       | a thread slug from 3.8                                     | Units belonging to the thread.                                                                             |
| 3.10 | `get-keywords`            | scope it — `{ subject, keyStage }` **plus** unit or lesson | Keyword list (most frequent first). Subject+keyStage **alone** is a very large payload (see §7 size note). |

---

## 4. Search (exercise every scope)

| #   | Tool               | How (example)                                                                                         | Expected result                                        |
| --- | ------------------ | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------ |
| 4.1 | `search` lessons   | `{ scope: 'lessons', query: 'photosynthesis', subject: 'science', keyStage: 'ks3' }`                  | Ranked lesson hits; slugs usable for `fetch`.          |
| 4.2 | `search` units     | `{ scope: 'units', query: 'fractions', subject: 'maths' }`                                            | Unit hits relevant to the query.                       |
| 4.3 | `search` threads   | `{ scope: 'threads', subject: 'maths' }` (query optional)                                             | Threads sorted by unit count, or a valid empty result. |
| 4.4 | `search` sequences | `{ scope: 'sequences', query: 'maths-secondary' }`                                                    | Sequence-level hits.                                   |
| 4.5 | `search` suggest   | `{ scope: 'suggest', query: 'photo', subject: 'science' }` — suggest **requires** subject or keyStage | Typeahead suggestions.                                 |

---

## 5. Fetch by id

Use slugs/ids from Sections 3–4. Format is `type:slug`.

| #   | Tool    | How (example)                            | Expected result                                                        |
| --- | ------- | ---------------------------------------- | ---------------------------------------------------------------------- |
| 5.1 | `fetch` | `{ id: 'subject:maths' }`                | Subject document with schema-expected fields.                          |
| 5.2 | `fetch` | a lesson id from 4.1 (`lesson:…`)        | Lesson resource; content/metadata present.                             |
| 5.3 | `fetch` | a unit id from 4.2 (`unit:…`)            | Unit resource.                                                         |
| 5.4 | `fetch` | a thread id from 4.3 (`thread:…`)        | Thread resource (thread units may show `oakUrl: null` — non-blocking). |
| 5.5 | `fetch` | a sequence id (`sequence:maths-primary`) | Sequence structure.                                                    |

---

## 6. Lesson, unit, and sequence depth

Use a lesson slug from 5.2, a unit slug from 5.3, and a sequence/key-stage
context from Section 3.

| #    | Tool                               | How                     | Expected result                         |
| ---- | ---------------------------------- | ----------------------- | --------------------------------------- |
| 6.1  | `get-lessons-summary`              | lesson slug             | Summary sections for the lesson.        |
| 6.2  | `get-lessons-quiz`                 | same lesson slug        | Quiz items or explicit empty state.     |
| 6.3  | `get-lessons-transcript`           | same lesson slug        | Transcript text / structured segments.  |
| 6.4  | `get-lessons-assets`               | same lesson slug        | Asset list / download references.       |
| 6.5  | `get-units-summary`                | unit slug               | Unit summary content.                   |
| 6.6  | `get-sequences`                    | per schema              | Sequence list/structure.                |
| 6.7  | `get-sequences-units`              | a sequence id           | Units in the sequence.                  |
| 6.8  | `get-sequences-questions`          | a sequence id           | Questions for the sequence.             |
| 6.9  | `get-sequences-assets`             | a sequence id           | Assets for the sequence.                |
| 6.10 | `get-key-stages-subject-units`     | `{ keyStage, subject }` | Units for that key stage × subject.     |
| 6.11 | `get-key-stages-subject-lessons`   | `{ keyStage, subject }` | Lessons for that key stage × subject.   |
| 6.12 | `get-key-stages-subject-questions` | `{ keyStage, subject }` | Questions for that key stage × subject. |
| 6.13 | `get-key-stages-subject-assets`    | `{ keyStage, subject }` | Assets for that key stage × subject.    |

---

## 7. Curriculum graph tools

The four anchored graph tools. Acceptance is the **`working-with-graphs`
doctrine** (see the
[skill](../../../.agent/skills/working-with-graphs/SKILL-CANONICAL.md)): every
response uses **structural bounds only** (anchors / depth / granularity), is
**complete within its bound**, reports **honest windows** (`hasMore`, totals),
**echoes the anchors** that navigate to the next bounded call, makes **no
server-side relevance judgement**, and shows **no soft stubs** — refusal/empty
arrives in the honest typed shapes only.

> **Size note.** Graph tools return the whole bounded subgraph in one response.
> A broad anchor can exceed a host's token limit; where the tool accepts
> narrowing arguments, scope the call down. "Returns without a transport error
> and satisfies the checklist" is the pass; a host-side size cap is a known
> limitation, not a server fault.

| #   | Tool                        | Positive probe                                                                                                                                                          | Negative probe                                                                                                      |
| --- | --------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| 7.1 | `get-thread-progressions`   | discovery: `{ subject: 'maths', keyStage: 'ks2' }`; detail: `{ threadSlug: 'number-fractions' }` → year-ordered units                                                   | unknown `threadSlug` → reported in `unknownAnchors`, not errored.                                                   |
| 7.2 | `get-prior-knowledge-graph` | `{ unitSlugs: ['understanding-percentages'] }` → units with stated `priorKnowledge` statements and `threadSlugs`, anchors echoed                                        | unknown slug alongside a real one → unknown in `unknownAnchors`, real anchor served.                                |
| 7.3 | `get-misconception-graph`   | unit anchor `{ … }`; thread window with `unitOffset`/`unitLimit` → honest window (`hasMore`, whole members)                                                             | `unitOffset` with a _unit_ anchor → typed refusal (offset applies to thread anchor only).                           |
| 7.4 | `get-keyword-graph`         | `{ subject: 'maths', keyStage: 'ks2', limit: 5 }` → ranked keywords, honest totals (`totalMatchingKeywords`, `hasMore`), per-entry lesson decoration (`hasMoreLessons`) | `limit: 0` → JSON-RPC `-32602` (the schema declares integer [1, 100], so the bound is enforced at the input layer). |

---

## 8. EEF evidence surface

The EEF (Education Endowment Foundation) Teaching and Learning Toolkit surface
is governed by the declarative served-surface definition
(`src/served-surface/served-surface.ts`), and its rows there are currently
**dormant**: `get-eef-evidence` and `eef://interpretation` do not appear in
the live `*/list` inventories, and enabling either is a reviewed change to
that one definition — there is no runtime flag. (The former
`OAK_CURRICULUM_MCP_EEF_ENABLED` kill-switch and the EEF prompt are gone:
the app serves no MCP prompts at all.) When the rows are dormant, every row
in this section is N-A; the section is retained because the rows below are
the acceptance contract the surface must meet whenever it is turned live.

The surface is a **deterministic projection of a fixed corpus** — the agent does
the reasoning; the tool returns only the corpus's own facts. Treat any value the
payload returns as a claim to check against the corpus chain (the strand index
in `eef://interpretation` and the
[EEF corpus source-path table](../../../.agent/plans-backlog-2026-07/sector-engagement/eef/current/eef-d2-source-path-table.md)),
never to invent.

| #   | Surface                             | How                                                                                           | Expected result                                                                                                                                                                                                                                                                                           |
| --- | ----------------------------------- | --------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 8.1 | `get-eef-evidence` (strand)         | `{ function: 'inspect-strand', strandId: 'eef-tl-feedback' }`                                 | **Dual shape** (post-alignment): summary content block + serialised-JSON block + `structuredContent`. Envelope for Feedback: `+6` months / `Very Low` cost / `Extensive` evidence; key findings; `caveats`; `frontier`; full `provenance.source` incl. `original_authors`; `answerType: 'strand-lookup'`. |
| 8.2 | `get-eef-evidence` (move, headline) | `{ function: 'evidence-for-move', priority: 'closing_disadvantage_gap', detail: 'headline' }` | Bounded list (identity + headline metrics + tags + EEF page) for that priority; `answerType: 'context-subset'`.                                                                                                                                                                                           |
| 8.3 | `get-eef-evidence` (move, full)     | `{ function: 'evidence-for-move', phase: 'primary' }`                                         | Full strands the corpus tags for primary. Axis filters focus, they do not bound coverage.                                                                                                                                                                                                                 |
| 8.4 | `get-eef-evidence` (error)          | `{ function: 'evidence-for-move' }` (no selector)                                             | `isError: true` — "requires at least one selector …". An unknown strand id / out-of-vocabulary value likewise errors at the boundary.                                                                                                                                                                     |
| 8.5 | `get-eef-evidence` (floor)          | `{ function: 'inspect-strand', strandId: 'eef-tl-learning-styles' }`                          | The honest insufficient-evidence / little-to-no-impact finding reaches you verbatim (null impact / `Insufficient`); richer fields **omitted**, never fabricated.                                                                                                                                          |
| 8.6 | `eef://interpretation`              | `resources/read` the URI                                                                      | `text/markdown` reasoning scaffold: how to read the evidence faithfully, strand index, methodology, caveats.                                                                                                                                                                                              |

**Independent ground-truth check (the value that matters).** Pick a known strand
and confirm its corpus values — caveat text, evidence strength, cost, impact —
appear **verbatim** in the payload, sourced from the corpus (not from this
guide). That proves faithful transmission, not merely field presence.

**Faithfulness when you present it.** Anything drafted from EEF evidence must
carry its source attribution, caveats, strength, cost, impact, and uncertainty,
and frame it as population-level evidence that _may inform_ a teacher's
judgement — never a guaranteed local outcome, never teacher-replacing or
single-answer language.

---

## 9. Assets and downloads

| #   | Tool                 | How                                       | Expected result                                                                             |
| --- | -------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------- |
| 9.1 | `get-lessons-assets` | lesson slug from Section 5                | Asset inventory with types (`slideDeck`, `worksheet`, `video`, quizzes, …).                 |
| 9.2 | `download-asset`     | `{ lesson: '<slug>', type: 'slideDeck' }` | A short-lived (≈5 min) clickable download URL. Validate the URL resolves (HTTP 200 / file). |

---

## 10. Resources

| #    | Resource                           | How                         | Expected result                                                                                                  |
| ---- | ---------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 10.1 | `curriculum://model`               | `resources/read`            | `application/json` domain ontology + tool guidance (resource form of 2.1).                                       |
| 10.2 | `docs://oak/getting-started.md`    | `resources/read`            | `text/markdown` intro: server, auth, first steps.                                                                |
| 10.3 | `eef://interpretation`             | `resources/read` (also 8.6) | N-A while the row is dormant in the served-surface definition; `text/markdown` EEF reasoning scaffold when live. |
| 10.4 | `ui://widget/oak-curriculum-app-*` | `resources/read`            | `text/html;profile=mcp-app` widget document (the MCP App surface).                                               |

---

## 11. Prompts (deliberately absent)

The app serves **zero MCP prompts** (decisions register D11): the primitive
is unregistered entirely. A **prompts UAT pass** is the ABSENCE contract
holding, not any prompt working:

| #    | What                      | How                                      | Expected result                                                              |
| ---- | ------------------------- | ---------------------------------------- | ---------------------------------------------------------------------------- |
| 11.1 | Capability negotiation    | `initialize`, read `capabilities`        | No `prompts` key at all (key absence — an empty `prompts: {}` is a defect).  |
| 11.2 | `prompts/list` probe      | Appendix B curl                          | JSON-RPC error `-32601` Method not found.                                    |
| 11.3 | Workflow guidance (moved) | `resources/read` `docs://oak/guidance/*` | The served (navigation) guidance documents return `text/markdown` (see §10). |

The workflow substance formerly served as prompts now ships as agent guidance
resources, governed by the served-surface definition
(`src/served-surface/served-surface.ts`).

---

## 12. Error, filter, and negative behaviour

| #    | What                   | How                                                                                                 | Expected result                                                                                                |
| ---- | ---------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| 12.1 | Missing entity         | `fetch` or a lesson tool with a deliberately invalid slug.                                          | Clear user-facing message (e.g. **Lesson not found**) via the error path — **no** 5xx / crash.                 |
| 12.2 | Input-schema violation | `search` with no `scope`.                                                                           | JSON-RPC `-32602` "Invalid arguments for tool search: …".                                                      |
| 12.3 | Caller-driven refusal  | `get-misconception-graph` `{ unitSlugs: [...], unitOffset: 5 }` (windowing on a non-thread anchor). | Handler typed refusal: "unitOffset/unitLimit apply to the thread anchor only" — the message reaches the agent. |
| 12.4 | Filter honoured        | `search` `{ scope: 'lessons', query: 'trigonometry', keyStage: 'ks4', tier: 'higher' }`             | Results respect the filter; tier metadata visible where applicable.                                            |

---

## 13. MCP App / widget surface (optional, host-dependent)

Only meaningful in an MCP Apps–compatible host (MCPJam, ChatGPT, Claude
Cowork). Skip in non-Apps hosts (the protocol degrades gracefully — tools with
`_meta.ui` return text content normally).

| #    | What              | How                                                                              | Expected result                                                  |
| ---- | ----------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------- |
| 13.1 | Widget render     | Open the Oak Curriculum App widget (10.4) in MCPJam against the server.          | Widget renders in the sandboxed iframe; Oak branding/fonts load. |
| 13.2 | App-driven search | Interact with the in-widget search (drives `user-search` / `user-search-query`). | Results populate in the widget without model mediation.          |

---

## Sign-off

Tie outcomes to the
[release runbook severity model](../../../docs/engineering/milestone-release-runbook.md#severity-model)
(P0 release stop … P3 backlog). No open **P0/P1** = eligible to trust/ship.

**Smoke subset (quick confidence):** 0.1, 2.1, 2.2, 3.1, 4.1, 5.2, 6.1, plus —
if EEF is present — 8.1 and 8.6. No 5xx / auth loop on repeated calls.

**Full matrix (release gate):** every section 1–12 (13 where an Apps host is
available), every listed tool exercised at least once, every graph tool passing
the working-with-graphs checklist, the EEF independent ground-truth check done,
and the dual-shape contract confirmed on at least one success per category.

For Sentry error-path validation (separate from curriculum behaviour), use
`scripts/probe-sentry-error-capture.sh` and the
[Sentry deployment runbook](../../../docs/operations/sentry-deployment-runbook.md).

---

## Run-record template

Copy this block into your PR, deploy note, or handoff and fill it in. **Also
save completed records in [`uat-reports/`](./uat-reports/README.md)** — kept for
now as a dated archive so recurring findings can drive improvements to this
runbook and the server. See
[`2026-06-15-prod.md`](./uat-reports/2026-06-15-prod.md) for a worked example.

```text
Oak Curriculum MCP — UAT run record
Target:        <url or localhost:3333>
Upstream API:  <version from 2.2 get-changelog-latest>
App version:   <x-app-version / get-curriculum-model build, if exposed>
Date (UTC):    <YYYY-MM-DD>
Run by:        <engineer / agent + host/client>
Mode:          <smoke subset | full matrix>

Section 0  Inventory self-check ......... PASS / FAIL / N-A   (tools: __  resources: __  prompts: 0 asserted)
Section 1  Transport & auth ............. PASS / FAIL / N-A
Section 2  Orientation .................. PASS / FAIL / N-A
Section 3  Discovery & browse ........... PASS / FAIL / N-A
Section 4  Search ....................... PASS / FAIL / N-A
Section 5  Fetch ........................ PASS / FAIL / N-A
Section 6  Lesson/unit/sequence depth ... PASS / FAIL / N-A
Section 7  Graph tools .................. PASS / FAIL / N-A
Section 8  EEF evidence ................. PASS / FAIL / N-A
Section 9  Assets & downloads ........... PASS / FAIL / N-A
Section 10 Resources .................... PASS / FAIL / N-A
Section 11 Prompts ...................... PASS / FAIL / N-A
Section 12 Error & filter behaviour ..... PASS / FAIL / N-A
Section 13 MCP App / widget (optional) .. PASS / FAIL / N-A

Findings (severity P0–P3, with repro):
- [P_] <finding> — <tool/section> — <repro> — <disposition>

Response-shape contract: dual content + structuredContent confirmed? YES / NO
Verdict: GO / NO-GO   (no open P0/P1 to ship)
```

---

## Appendix A: expected live inventory

The reconciliation reference for Section 0. The live `*/list` methods are
authoritative; this is the expected full surface (40 served tools / 6 served
resources / 0 prompts, plus the dormant rows noted inline). Tool definitions
are generated from the OpenAPI schema + aggregated tools, so this list
changes via `pnpm sdk-codegen` — update this appendix when Section 0 shows a
drift.

**Tools — orientation (4):** `get-curriculum-model`, `get-changelog-latest`,
`get-changelog`, `get-rate-limit`.

**Tools — discovery & browse (10):** `browse-curriculum`, `explore-topic`,
`get-subjects`, `get-subjects-key-stages`, `get-subjects-years`,
`get-subject-detail`, `get-key-stages`, `get-keywords`, `get-threads`,
`get-threads-units`.

**Tools — search & fetch (2):** `search`, `fetch`.

**Tools — lesson/unit/sequence depth (13):** `get-lessons-summary`,
`get-lessons-quiz`, `get-lessons-transcript`, `get-lessons-assets`,
`get-units-summary`, `get-sequences`, `get-sequences-units`,
`get-sequences-questions`, `get-sequences-assets`,
`get-key-stages-subject-units`, `get-key-stages-subject-lessons`,
`get-key-stages-subject-questions`, `get-key-stages-subject-assets`.

**Tools — curriculum graph (4):** `get-thread-progressions`,
`get-prior-knowledge-graph`, `get-misconception-graph`, `get-keyword-graph`.

**Tools — EEF (1, DORMANT):** `get-eef-evidence` — a dormant row in the
served-surface definition; absent from `tools/list` until a reviewed
definition change turns it live.

**Tools — assets (1):** `download-asset`.

**Tools — programmes (5):** `get-programmes`, `get-programmes-units`,
`get-programmes-questions`, `get-programmes-assets`,
`get-subjects-programmes`.

**Tools — orientation, app-local (1):** `oak-under-the-hood`.

**Tools — MCP App user search (2, DORMANT):** `user-search`,
`user-search-query` — dormant rows in the served-surface definition; absent
from `tools/list` until a reviewed definition change turns them live.

**Resources (6 served):** `curriculum://model`, `docs://oak/getting-started.md`,
`ui://widget/oak-curriculum-app-*.html`, and the navigation guidance three:
`docs://oak/guidance/find-lessons.md`, `docs://oak/guidance/explore-curriculum.md`,
`docs://oak/guidance/learning-progression.md`. (The creation-oriented three
guidance documents and `eef://interpretation` exist dormant and never appear in
`resources/list`; the former `docs://oak/under-the-hood.md` pointer resource was
deleted by MCP-353 — the orientation content is served inline by the
`oak-under-the-hood` tool.)

**Prompts (0):** none — the primitive is unregistered (D11). The six
workflow guidance documents live at `docs://oak/guidance/*`; the navigation
three are served, the creation-oriented three are dormant behind the
served-surface definition.

---

## Appendix B: calling with curl

When no MCP host is available, call the StreamableHTTP endpoint directly. It is
stateless, so no `initialize` handshake is needed; the reply is an SSE stream,
so parse the `data:` line. Substitute `ORIGIN` (use `http://localhost:3333` for
a local dev server). Against an authenticated server, add
`-H 'Authorization: Bearer <token>'`.

```bash
# List the surface (Section 0)
curl -sS -X POST ORIGIN/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/list"}' \
  | grep '^data:' | sed 's/^data: //' | jq '.result.tools | length'

# Call a tool (EEF strand) — shows the full envelope regardless of host
curl -sS -X POST ORIGIN/mcp \
  -H 'Content-Type: application/json' \
  -H 'Accept: application/json, text/event-stream' \
  -d '{"jsonrpc":"2.0","id":1,"method":"tools/call","params":{"name":"get-eef-evidence","arguments":{"function":"inspect-strand","strandId":"eef-tl-feedback"}}}' \
  | grep '^data:' | sed 's/^data: //' | jq
```

Swap `method`/`params` for `resources/list` or `resources/read`
(`{"uri":"eef://interpretation"}`) to exercise resources — or `prompts/list`
to prove the absence contract (expect JSON-RPC `-32601`).

## Related

- [README — manual test guide pointer](../README.md#manual-test-guide-any-server)
- [MCP primitives: intention and intended audience](./mcp-primitives-intention-and-audience.md)
- [Milestone Release Runbook](../../../docs/engineering/milestone-release-runbook.md) — severity model + go/no-go
- [Operations runbooks index](../../../docs/operations/README.md)
- [`working-with-graphs` skill](../../../.agent/skills/working-with-graphs/SKILL-CANONICAL.md) — graph-tool acceptance doctrine
- [ADR-058 context grounding](../../../docs/architecture/architectural-decisions/058-context-grounding-for-ai-agents.md)
- [ADR-123 MCP primitives](../../../docs/architecture/architectural-decisions/123-mcp-server-primitives-strategy.md)
- [ADR-121 quality-gate surfaces](../../../docs/architecture/architectural-decisions/121-quality-gate-surfaces.md) — this guide replaced the retired `pnpm smoke:remote` harness.
