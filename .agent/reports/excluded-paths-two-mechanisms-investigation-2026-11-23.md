# Excluded upstream paths: three reasons, two mechanisms

An investigation of 23 November 2026, by the seat Firefly mends Quench (4f7b54), at the
owner's word. It changes no behaviour. Its result is written into the header comment of
`packages/sdks/oak-sdk-codegen/code-generation/excluded-paths.ts`; this report holds the
question, what was run, and what stays open.

## The question

`excluded-paths.ts` holds two sets of upstream paths the generators do not consume.

| Path | Set |
| --- | --- |
| `/search/lessons` | `SKIPPED_PATHS` |
| `/search/transcripts` | `SKIPPED_PATHS` |
| `/lessons/{lesson}/assets/{type}` | `SKIPPED_PATHS` |
| `/key-stages/{keyStage}/subject/{subject}/check-restricted` | `DEFERRED_PATHS` |
| `/lessons/check-restricted` | `DEFERRED_PATHS` |
| `/changelog` | `DEFERRED_PATHS` |
| `/changelog/latest` | `DEFERRED_PATHS` |

`SKIPPED_PATHS` is read by the MCP tool generator only. `DEFERRED_PATHS` is applied by
`applyDeferredPaths` to the document every generator reads, so the SDK loses those paths
too.

The owner said two things on 23 November, in this order.

First, on reading the list:

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

Then, on the first draft of this record, which wrote the split down as debt:

> if the two path exclusion mechanisms exist side by side in the same file, then maybe it is not
> debt, maybe they are genuinely different classes of thing, 1. Not processed, 2. Not surfaced
> in the MCP... I think the PR needs reframing as an investigation and documentation enhancement

So the question: is `DEFERRED_PATHS` a second way of keeping paths off the MCP server, which
one tool filter could replace today, or does it do a different job?

## What was run

All from the cached schema (`schema-cache/api-schema-original.json`), with no network, in a
lane worktree cut from the default branch.

1. **Baseline.** `pnpm sdk-codegen` with the file unchanged. The working tree stayed
   identical to the commit, so generation is a fixed point and a difference in a later run
   comes from the change made for it.
2. **All four deferred paths moved to `SKIPPED_PATHS`.** Generation succeeded. Eight
   generated files changed (about 2,000 lines added). No generated MCP tool file changed.
   `pnpm type-check` in the workspace then failed with four errors, all from the
   `check-restricted` family:
   - `z.record(...)` written with one argument, twice. Both responses are maps (an object
     with `propertyNames` and a schema-valued `additionalProperties`), and the Zod writer
     emits a form the installed Zod does not accept.
   - `getLessons_postCheckRestrictedLessons_Body` used in the request-parameter map where
     it is not defined. The operation carries the document's only request body.
   - `responses` read from an undefined `get`. `/lessons/check-restricted` is the only path
     with no `get` operation.
3. **Only the changelog pair moved to `SKIPPED_PATHS`,** with the `check-restricted` pair
   still deferred. Generation succeeded and `pnpm type-check` passed. The SDK gained about
   880 lines describing `/changelog` and `/changelog/latest`.
4. **Restore.** The committed file put back and generation run again; the working tree
   matched the commit.

Not run: the workspace's tests, the downstream SDK and the MCP app, in either experiment.
Type-check failing in the generating workspace was enough for the second result, and the
third result does not depend on them.

## What it shows

The owner's second statement holds: the two sets are different classes. And the second
set holds two unlike cases, the second of which the owner named when this result was
reported:

> if paths are being skipped because they are no longer supported i.e. they no longer exist in
> the live API, that is a third reason, and it is a hack around failing to update the repo to
> use the latest API version

So there are three reasons a path is excluded, in two mechanisms.

| Reason | Paths | Mechanism | What ends it |
| --- | --- | --- | --- |
| Not surfaced over MCP: a decision about the MCP server (content policy, or no value over MCP) | the two `/search` paths, `/lessons/{lesson}/assets/{type}` | `SKIPPED_PATHS` | Nothing; it is a standing design decision |
| Not yet processable: the generators cannot emit valid code for it | the two `check-restricted` paths | `DEFERRED_PATHS` | The capability is built (MCP-214) |
| No longer in the live API: the cached schema still holds it | the two `/changelog` paths | `DEFERRED_PATHS` | The schema cache is brought up to date (MCP-630) |

- **A tool filter cannot do the second job.** With `check-restricted` only tool-filtered
  the SDK does not build. That exclusion has to act on the pipeline's input.
- **The third is a workaround for a stale cache.** The changelog entries exist only because
  the committed schema cache is behind the API Oak publishes. Nothing about those two
  endpoints needs an exclusion; the repository needs the current schema, and with it the
  paths, and the entries, are gone. The strategic node `upstream-api-currency` owns that
  outcome; the delivery plans `migrate-to-curriculum-api-v1` and `mcp-served-surface-truth`
  carry it, and the second deletes the two entries in the landing that refreshes the cache.
- **The owner's first statement holds in the form that matters.** `DEFERRED_PATHS` is not
  a place to keep a path off the MCP server. It is temporary by construction: each entry
  names the ticket that retires it, `applyDeferredPaths` fails generation once a listed
  path has left the cached document, and the file says to delete the constant and its
  wiring when the last entry goes. At that point one tool filter is left. A path that
  becomes processable is then either served or moved to `SKIPPED_PATHS`.

What is debt, then, is not that two mechanisms exist. It is the two changelog entries,
which stand in for a schema refresh, and the missing generator capability behind the
other two. Both are already tracked. What the first draft got wrong, and the header
comment before it left unsaid, is the reason for the split: the old comment gave it as
permanent against temporary, which is true and is not the cause. The cause is the stage
at which the exclusion has to act.

## What stays open

- **Which of the owner's two reasons applies to each `SKIPPED_PATHS` entry.** The owner
  named the upstream API's own search as offering no value in the MCP. That
  `/lessons/{lesson}/assets/{type}` is there for content policy is this seat's inference by
  elimination; the file's older comment says it is not transportable over MCP. It is left
  as the file has it.
- **Whether the `check-restricted` family is surfaced once it can be processed.** The owner
  counts it under the two reasons above, and a report of 26 July 2026
  (`upstream-and-bulk-alignment-concept-exploration-2026-07-26.md`) calls it a rights and
  licensing capability. That decision is MCP-215's, and if the answer is no, the entries
  move to `SKIPPED_PATHS` when MCP-214 lands.
