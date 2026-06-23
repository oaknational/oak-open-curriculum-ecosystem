# Finer-grained control for `/keywords` (bounded + ranked parameters)

**Upstream**: `oak-openapi` (Oak Open Curriculum API). Canonical intake: the
`oak-openapi` `docs/requests/` folder. **Do not edit `oak-openapi` from this
repo** — hand this over.
**Status**: open
**Priority**: medium (token economy for LLM/MCP consumers; resolves a
documented-vs-actual contract gap)
**Affected**: the `GET /keywords` operation; every consumer that generates
types from the spec, and the MCP `get-keywords` tool that passes the endpoint
through.

## Problem

`GET /keywords` returns the **entire** keyword set for an anchor and offers no
way to bound or rank the response. Two distinct gaps:

1. **No bounding.** There is no `limit`/`offset` (or `size`/`from`) parameter.
   At coarse anchors (`subject` + `keyStage`) the result is the full keyword
   list for every non-legacy lesson in scope. LLM/MCP consumers pay for the
   whole set even when they need only the most representative terms — the exact
   token-economy pressure that has pushed this repo to plan a *separate*
   bounded, frequency-ranked local tool (deliverable G4 of the graph-tools
   redesign) as a workaround.
2. **Ranking is promised but not delivered.** The endpoint's own description
   stated the keywords are *"returned in order of frequency, with the most
   common keywords appearing first."* The handler instead sorts
   **alphabetically**, and the response carries no frequency signal, so a
   consumer cannot rank or threshold by frequency either.

   **Update 2026-06-12**: the documented-vs-actual contract gap is resolved
   at source — the upstream description rewrite (oak-openapi PR #269,
   deployed as `0.7.0-69d2b6c9…`) now states the keywords are "sorted
   alphabetically". The feature ask itself (bounding + a real frequency
   ranking signal) remains open; the evidence below cites the pre-rewrite
   description it was grounded against.

## Evidence

Grounded in `oak-openapi` at `main` HEAD `2e1a01d` (read-only).

- **Request parameters** — `subject?`, `keyStage?`, `phase?`, `unit?`,
  `lesson?` only (with refinements: at least one of `subject`/`unit` required;
  `phase` and `keyStage` mutually exclusive). No bounding or ordering
  parameter:
  `src/lib/handlers/keywords/schemas/keywordsRequest.schema.ts`.
- **Documented contract vs implementation** — the OpenAPI `description` claims
  frequency ordering:

  > "The keywords are returned in order of frequency, with the most common
  > keywords appearing first."

  but the handler sorts by the keyword string (alphabetical, not frequency) and
  returns the full set with no limit applied (verbatim, comment included):

  ```ts
  const keywords = Object.entries(keywordMap)
    .toSorted(
      // sort by the keyword
      (a, b) => a[0].localeCompare(b[0]),
    )
    .map(([keyword, { lessonSlugs, ...data }]) => ({
      keyword,
      lessonSlugs: Array.from(lessonSlugs),
      ...data,
    }));

  return keywords;
  ```

  `src/lib/handlers/keywords/keywords.ts` (description in the `openapi.meta`
  block; sort + return near the end of the `.query` handler).
- **Frequency is already computable but discarded for ordering.** The handler
  accumulates a per-keyword `lessonSlugs` set, so the lesson count
  (`lessonSlugs.size`) is a ready frequency signal — it is returned as the
  `lessonSlugs` array but never used to order, and there is no explicit
  count/frequency field: `keywords.ts` (the `keywordMap` build) +
  `src/lib/handlers/keywords/schemas/keywordsResponse.schema.ts` (response has
  `keyword`, `description`, `keyStageSlug`, `subjectSlug`, `lessonSlugs` — no
  count/rank field).
- **Downstream consumer impact (this repo).** The generated MCP `get-keywords`
  tool faithfully exposes exactly those five parameters and repeats the
  "order of frequency" description, so both the missing controls and the
  inaccurate ordering claim propagate to MCP clients:
  `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`
  (`ToolQueryParams` + `description`).

## Suggested approach

Add optional, backwards-compatible controls to `GET /keywords`:

1. **Bounding** — a `limit` parameter (and `offset` for pagination) to cap the
   returned set. All optional; omitting them preserves today's full-set
   behaviour.
2. **Ranking** — an `orderBy` parameter (`frequency` | `alphabetical`) and a
   per-keyword frequency field in the response (e.g. `lessonCount`, the size of
   the existing `lessonSlugs` set). Ordering by `frequency` would make the
   endpoint's documented contract true; exposing the count lets consumers rank
   or threshold client-side regardless of server order.

A compatibility decision sits with the upstream team: either keep the current
alphabetical default and make `frequency` opt-in, or change the default to
`frequency` so behaviour matches the published description. Aligning the
default with the documented contract is the cleaner correctness outcome; the
upstream intake owns that call.

## Impact

- **Token economy for LLM/MCP consumers** — bounded, frequency-ranked
  retrieval lets agents fetch only the most representative keywords for an
  anchor instead of the full list, the value this repo currently has to build a
  separate local tool (G4) to achieve. If the API offered server-side
  bounding + ranking, that local tool could defer to the endpoint rather than
  fetch-all-then-truncate.
- **Contract correctness** — resolves the documented-vs-actual ordering gap;
  the description's "most common first" promise becomes verifiable.
- **Backwards compatibility** — all proposed parameters are optional and the
  response field is additive; existing callers are unaffected unless the
  upstream team also realigns the default ordering with its own documentation.
