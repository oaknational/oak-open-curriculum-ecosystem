# Excluded upstream paths: are two mechanisms one too many?

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

The two sets are two classes, as the owner's second statement proposed.

- **`SKIPPED_PATHS`: not surfaced over MCP.** A decision about the MCP server. The SDK keeps
  the path.
- **`DEFERRED_PATHS`: not processed.** A statement about the pipeline's input. Generating
  from the path today gives an SDK that is broken (`check-restricted`: it does not compile)
  or untrue (the changelog pair: it compiles and describes endpoints that the file's own
  record says the live API stopped serving at spec 0.11.0).

A tool filter cannot do the second job. With `check-restricted` only tool-filtered the SDK
does not build.

The owner's first statement still holds in the form that matters: `DEFERRED_PATHS` is not
a place to keep a path off the MCP server. It is temporary by construction. Each entry
names the ticket that retires it, `applyDeferredPaths` fails generation once a listed path
has left the cached document, and the file already says to delete the constant and its
wiring when the last entry goes. At that point one tool filter is left, with no separate
piece of work to schedule. A path that becomes processable is then either served or moved
to `SKIPPED_PATHS`.

The split is therefore not debt in itself. What the first draft got wrong, and the header
comment before it left unsaid, is the reason for the split: the old comment gave it as
permanent against temporary, which is true and is not the cause. The cause is the stage at
which the exclusion has to act.

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
- **The changelog pair in the owner's list.** The owner named it as offering no value in the
  MCP. It sits in `DEFERRED_PATHS` for a second reason, that the endpoints are gone, and
  leaves the file altogether at the cache refresh, so it never needs a tool-filter entry.
