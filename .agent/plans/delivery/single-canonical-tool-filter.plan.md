---
id: single-canonical-tool-filter
node_type: delivery
name: One canonical tool filter for the upstream paths the MCP server does not serve
overview: >-
  Move every excluded upstream path into one filter on which paths become MCP tools, and stop
  removing paths from the OpenAPI document the SDK is generated from.
status: sketch
ratified_by: null
ratified_date: null
ratified_where: null
serves: upstream-api-currency
impact_areas:
  - served-surface
tickets: []
depends_on: []
last_updated: 2026-11-23
---

# One canonical tool filter for the upstream paths the MCP server does not serve

This node records a piece of architectural debt and the direction that pays it. It is
unscheduled: the owner said on 23 November 2026 that it is not a current priority. It is a
sketch and governs no work.

## The owner's statement

The owner, 23 November 2026, in the session of Firefly mends Quench (4f7b54), after reading the
list of excluded paths:

> Each of those removals or ignores are because of
>
> 1. Oak policy around content, or
> 2. Endpoints that offer no value in the MCP (changelog, the old API search)
>
> The fact that they are split over two exclusion mechanisms is architectural debt. I added the
> filter to prevent unwanted paths becoming tools, someone else later took the route of modifying
> the OpenAPI spec. I chose the tool filter approach because the SDK is a separate product from
> the MCP server. They should all be moved to a single, canonical tool filter at a later date,
> but that is not a current priority.

## What exists today

`packages/sdks/oak-sdk-codegen/code-generation/excluded-paths.ts` holds two sets, read on
23 November 2026.

| Path | Set | Effect |
| --- | --- | --- |
| `/search/lessons` | `SKIPPED_PATHS` | Stays in the SDK; never becomes an MCP tool |
| `/search/transcripts` | `SKIPPED_PATHS` | Stays in the SDK; never becomes an MCP tool |
| `/lessons/{lesson}/assets/{type}` | `SKIPPED_PATHS` | Stays in the SDK; never becomes an MCP tool |
| `/key-stages/{keyStage}/subject/{subject}/check-restricted` | `DEFERRED_PATHS` | Removed from the document the SDK is generated from |
| `/lessons/check-restricted` | `DEFERRED_PATHS` | Removed from the document the SDK is generated from |
| `/changelog` | `DEFERRED_PATHS` | Removed from the document the SDK is generated from |
| `/changelog/latest` | `DEFERRED_PATHS` | Removed from the document the SDK is generated from |

- `SKIPPED_PATHS` is the tool filter. Only the MCP tool generator reads it.
- `DEFERRED_PATHS` is the modification of the OpenAPI document. `applyDeferredPaths` removes its
  paths before anything is generated, so the SDK's types, Zod schemas and maps lose them as well
  as the MCP tools.

Which reason applies to which path: the owner named the changelog pair and the upstream API's own
search as endpoints that offer no value in the MCP. The seat that wrote this node infers, by
elimination and not from the owner's words, that the two `check-restricted` paths and
`/lessons/{lesson}/assets/{type}` fall under content policy. An implementer confirms that mapping
with the owner before relying on it.

## Goal

One mechanism holds every upstream path the MCP server does not serve: a filter on which paths
become MCP tools. The document the SDK is generated from is the upstream document with nothing
removed, so the SDK carries the whole API and the MCP server alone decides what it serves.

## User groups and value

- **Developers using the SDK** get every endpoint Oak publishes. Today four paths are missing
  from the SDK because of decisions made about the MCP server.
- **Seats and contributors changing the served surface** find one list, with one reason beside
  each entry, where today they must know that two lists exist and that they act at different
  stages.
- **Teachers using Oak through an AI assistant** see no change: the same tools are served.

## Mechanism

A sketch only; the implementer writes the mechanism at pickup. The constraints it starts from:

- The tool filter is the surviving mechanism, because the SDK is a separate product from the MCP
  server.
- Each entry states its reason, one of the two the owner named.
- The self-retiring behaviour the changelog entries have today (generation fails when a listed
  path is no longer in the upstream document) is worth keeping in the single filter.
- The MCP content audit anchors the text of `DEFERRED_PATHS`
  (`agent-tools/src/mcp-content-current-source/current-source-addition-definitions.ts`), so the
  move carries a re-attestation.
- The changelog pair may already be gone by pickup: `mcp-served-surface-truth` deletes those two
  entries when the schema cache is refreshed.

## Acceptance criteria (each with a proof — required)

Written by the implementer at pickup, with this node's ratification. The outcome they must prove,
each `repo-safe`:

- No code removes a path from the OpenAPI document before SDK generation.
- The generated SDK contains every path of the cached upstream document.
- The served tool table is unchanged by the move.

## Out of scope

- Building or serving the usage-licence capability (the `check-restricted` family). That is
  tracked separately; this node only changes where its exclusion is written.
- Any change to which tools are served.
- Scheduling. No trigger promotes this node; it waits for the owner's word.
