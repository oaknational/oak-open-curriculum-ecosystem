---
name: "Oak Preview MCP Snagging — 2026-04-23 Pass"
overview: "Investigate and resolve the in-repo findings from the 2026-04-23 black-box validation of the oak-preview MCP surface. Covers explore-topic relevance tuning, the empty-questions response investigation, and a consistent MCP-side response surface for empty / no-match / unsupported cases. Upstream-only findings from the same pass are tracked separately under .agent/plans/external/ooc-issues/."
todos:
  - id: ws1-explore-topic-snagging
    content: "WS1: Reproduce the explore-topic relevance regression with a curated nonsense-input fixture set, isolate which scope (lessons / units / threads) is most permissive, and decide whether the fix sits in the search service (RRF / threshold) or in the MCP tool's headline composition."
    status: pending
  - id: ws2-questions-empty-investigation
    content: "WS2: Investigate the empty `get-key-stages-subject-questions` response for ks3 + science from the in-repo side: trace the code path from the MCP tool through the SDK to the upstream call, capture the raw upstream response, and decide whether any data-processing step is collapsing or filtering content. Cross-reference the upstream investigation report."
    status: pending
  - id: ws3-mcp-response-surface
    content: "WS3: Define and apply a consistent MCP-side response surface for empty / no-match / unsupported / upstream-failure cases across tools. Coordinate with the upstream response doctrine proposal so the MCP layer either passes the discriminator through (when upstream adds it) or synthesises one safely (until then)."
    status: pending
  - id: ws4-quality-and-review
    content: "WS4: Quality gates and reviewer pass (mcp-reviewer + elasticsearch-reviewer for WS1, code-reviewer + type-reviewer for WS2/WS3)."
    status: pending
isProject: false
---

# Oak Preview MCP Snagging — 2026-04-23 Pass

**Last Updated**: 2026-04-23
**Status**: QUEUED — work to start in a future session, not in the current PR
**Scope**: In-repo MCP and search-service findings from the 2026-04-23
black-box validation pass against the oak-preview MCP surface.

---

## Why this is queued, not active

A black-box validation pass against the deployed `oak-preview` MCP
server (deployment `0.1.0-poc`) on 2026-04-23 surfaced eight findings.
The owner has classified them as follows:

| # | Finding (short) | Disposition |
|---|-----------------|-------------|
| 1 | `get-rate-limit` returns zeros | **Not a bug** — that key has no limits. No action. |
| 2 | Threads endpoints leak Hasura 500 | Upstream only — see Issue 1 of `.agent/plans/external/ooc-issues/oak-open-curriculum-api-issues-2026-04-23.md`. |
| 3 | `download-asset` returns Vercel preview URL | **Not a bug** — that is the preview environment URL. No action. |
| 4 | `explore-topic` returns confident weak matches for nonsense input | **In-repo (this plan, WS1)** — primarily search service, possibly also MCP tool composition. |
| 5 | KS4 science lessons listing has repeated `lesson_slug` rows | Upstream investigation — see Issue 2 of the API issue report. |
| 6 | KS3 science questions returns silent `[]` | **Both** — upstream Issue 3 of the API issue report; in-repo investigation in this plan (WS2). |
| 7 | `browse-curriculum` exposes a sequence slug not listed by `/sequences` | Upstream design / data constraint — see Issue 4 of the API issue report. |
| 8 | Inconsistent shapes across empty / no-match / unsupported / failure | **Both** — upstream Issue 5 (doctrine) of the API issue report; in-repo MCP-side pass in this plan (WS3). |

This plan tracks only the in-repo work (items 4, 6, 8). It is queued
for a future session; **none of this is in the current PR**.

---

## WS1 — `explore-topic` Relevance Snagging

### Problem

`explore-topic` calls `search` in parallel across the `lessons`,
`units`, and `threads` scopes and composes a headline of the form
`Found {N} lessons, {N} units, {N} learning threads about "{query}"`.

For a curated nonsense input
(`asdfqwerzxcv-no-such-topic`) the tool returned 5 results in each
scope — none of which were "about" the topic. The hits matched on
incidental tokens (`"not"`, `"no"`, `"topic"`) because the BM25 leg of
the RRF pipeline has nothing better to fall back on, and the headline
copy presents the result with the same confidence shape as a strong
match.

### What good looks like

- A query with no strong semantic or lexical match returns either an
  empty result set or a clearly-marked "weak / no-confidence match"
  set, never a confident headline.
- Headline copy in the MCP tool reflects match confidence, not just
  result count.
- The threshold / behaviour is configurable from the search service so
  that the MCP tool does not need to second-guess it.

### Investigation steps

1. Reproduce against the search service directly (not via the MCP) to
   isolate the RRF behaviour from the MCP tool's composition.
2. Build a small adversarial fixture set:
   - genuine in-curriculum query (`"photosynthesis"`)
   - real but out-of-curriculum query (`"the war of the roses 1455"`)
   - garbage query (`"asdfqwerzxcv"`)
   - single common stop-word-heavy query (`"the not a"`)
3. Compare top-N RRF scores across the fixtures. If the garbage query
   produces top scores within the same order of magnitude as a real
   in-curriculum query, the issue is in the search service (likely a
   missing minimum-score threshold on either ELSER or BM25 before they
   are fused, or the RRF k constant being too forgiving on long-tail
   matches).
4. Decide where the fix belongs:
   - **Most likely**: search service applies a minimum match-quality
     threshold and the API surface gains a `match_quality` field
     (`exact` / `weak` / `none`).
   - **Possibly also**: the MCP `explore-topic` tool re-shapes the
     headline copy when `match_quality !== "exact"`.
5. Add regression coverage in the search service test suite for the
   nonsense-input case.

### Out of scope

- Changes to ELSER training or model selection.
- Index ingestion / document shape changes (covered elsewhere).

---

## WS2 — `get-key-stages-subject-questions` Empty-Response Investigation

### Problem

`get-key-stages-subject-questions` for `keyStage: "ks3", subject:
"science"` returns `[]`. KS3 science clearly has lessons and many of
those lessons have quiz content reachable via the per-lesson `/quiz`
endpoint.

The cause may be:

- Upstream (no bulk export populated for the combination), or
- In-repo (the MCP tool / SDK is filtering, transforming, or
  short-circuiting the response).

The wire response gives the consumer no way to distinguish these two
cases. The complementary upstream ask is Issue 3 in
`.agent/plans/external/ooc-issues/oak-open-curriculum-api-issues-2026-04-23.md`,
which asks the API team to add a discriminator on the wire.

### Investigation steps

1. Capture the raw upstream HTTP response for
   `GET /key-stages/ks3/subjects/science/questions` from the API
   client used by the MCP, with no MCP / SDK reshaping. Confirm
   whether the bytes returned are already an empty array, or whether
   something downstream is collapsing the response.
2. If the upstream response is already empty: this becomes purely an
   upstream issue (already filed). The in-repo work is then to surface
   the upstream signal to the agent in a useful way (see WS3).
3. If the upstream response is not empty: trace through the SDK
   client and tool data-processing layer, identify the step that drops
   the data, and decide whether to fix it in the SDK transform or in
   the tool result composition.
4. Either way, add coverage so that future regressions in this layer
   are caught at the SDK / tool boundary, not only via end-to-end
   smoke against a populated upstream.

### Out of scope

- Causing the upstream bulk export to be produced — that is the API
  team's call.
- Speculative re-aggregation across `/lessons/{slug}/quiz` calls
  inside the MCP tool. If the bulk endpoint is unsupported, that
  decision belongs in a separate plan with an explicit
  performance / cost analysis.

---

## WS3 — Consistent MCP-Side Response Surface

### Problem

Today, MCP tools surface the four conceptual states below using
several different shapes:

- empty input (sometimes typed error, sometimes silent acceptance),
- valid input + no matches (sometimes empty array, sometimes confident
  weak-match results),
- endpoint unsupported for the combination (silent empty),
- upstream failure (raw upstream error string forwarded).

This mirrors the inconsistency described in the upstream response
doctrine proposal (Issue 5 of
`.agent/plans/external/ooc-issues/oak-open-curriculum-api-issues-2026-04-23.md`),
but the MCP layer can begin tightening its own contract before the
upstream change lands.

### What good looks like

A single response envelope shape applied to every Oak MCP tool, with
discriminated states: `ok`, `empty`, `unsupported`, `upstream-error`.
Headline copy is selected from the discriminant, not synthesised
ad-hoc per tool.

### Investigation steps

1. Inventory every Oak MCP tool's current "no data" path (return
   `[]`, return `{ok: false, ...}`, return a textual headline, etc.).
2. Define a single discriminated envelope and a standard headline
   policy.
3. Migrate the lowest-risk tools first (search, browse, lesson detail)
   to the new envelope, keeping the existing structured payload shape
   inside the envelope.
4. Make sure raw upstream error strings are wrapped at the tool
   boundary (especially the Hasura 500 strings from the threads
   endpoints — see the upstream report) so that internal upstream
   detail never reaches the MCP client.
5. When the upstream doctrine ships, swap the synthesised
   discriminator for the upstream-provided one without changing the
   MCP-side shape.

### Out of scope

- Renaming or restructuring tool input arguments.
- Changing the MCP transport or SDK runtime boundary.

---

## WS4 — Quality Gates and Reviewers

- `pnpm check` from repo root.
- `mcp-reviewer` for WS1 and WS3 (tool surface, response shape).
- `elasticsearch-reviewer` for WS1 (RRF / threshold work in the search
  service).
- `code-reviewer` and `type-reviewer` for WS2 / WS3 implementation.
- Update ADR or `docs/operations/troubleshooting.md` if the MCP-side
  response envelope (WS3) introduces a new contract worth recording.

---

## Cross-references

- Consolidated upstream API issue report (single doc, suitable for
  passing to the API team verbatim):
  - [`../../external/ooc-issues/oak-open-curriculum-api-issues-2026-04-23.md`](../../external/ooc-issues/oak-open-curriculum-api-issues-2026-04-23.md)
- Predecessor in-repo snagging pass (provenance):
  - [`../archive/completed/oak-preview-mcp-snagging.execution.plan.md`](../archive/completed/oak-preview-mcp-snagging.execution.plan.md)
