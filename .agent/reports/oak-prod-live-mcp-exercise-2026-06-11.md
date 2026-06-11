# oak-prod Live MCP Exercise — Verification Record (2026-06-11)

- **Author**: Dawnlit Glimmering Orbit (cursor / Fable 5, `50c2d1`)
- **Thread**: `eef`
- **Server exercised**: `oak-prod` → `https://curriculum-mcp-alpha.oaknational.dev/mcp`
  (Cursor MCP client, OAuth-protected; `x-app-version: 1.26.1` at exercise time)
- **Doctrine applied**: [`working-with-graphs` skill](../skills/working-with-graphs/SKILL-CANONICAL.md)
  checklist, ADR-191, ADR-195

## Verdict

The TRACK-G value paths are live and behave per contract. All four graph tools,
search, fetch, orientation, and the EEF interpretation resource were exercised
end-to-end with positive and negative probes; every graph response satisfied the
working-with-graphs checklist. One material client-compatibility finding:
**`get-eef-evidence` success payloads are invisible in the Cursor MCP client**
(detail below).

## What was exercised (all live over MCP HTTP)

| Surface | Probe | Result |
| --- | --- | --- |
| `get-curriculum-model` | orientation call | 42 KB domain model + tool guidance returned |
| `get-thread-progressions` | discovery anchor `maths`+`ks2` | 10 bounded thread descriptors, no sequences, kind-qualified ids |
| `get-thread-progressions` | detail anchor `number-fractions` | 32 placements year-ordered 1→6; count matches discovery `totalUnits`; `resolvedAnchors` echoed |
| `get-prior-knowledge-graph` | `understanding-percentages`, depth 2 | 12 nodes / 17 `prerequisiteFor` edges; all edge endpoints members; depth echoed |
| `get-prior-knowledge-graph` | unknown slug + real slug, depth 1 | well-formed result; unknown reported in `unknownAnchors`, real anchor served (4 nodes / 3 edges) |
| `get-misconception-graph` | unit anchor `understanding-percentages` | 10 lessons each with misconception + teacher response |
| `get-misconception-graph` | thread window `number-fractions` offset 30 limit 10 | honest window: units 31–32 of 32, `hasMore: false`, whole structural members |
| `get-misconception-graph` | `unitOffset` with unit anchor | typed refusal: "unitOffset/unitLimit apply to the thread anchor only" |
| `get-keyword-graph` | `maths`+`ks2` narrowed to unit, limit 5 | 4 of 4 ranked keywords, honest totals, per-entry lesson decoration, `hasMoreLessons` |
| `get-keyword-graph` | `limit: 0` | typed refusal naming the valid range [1, 100] |
| `get-eef-evidence` | no selector | typed refusal naming the required selectors |
| `get-eef-evidence` | success calls (inspect-strand, evidence-for-move) | **`(omitted)` in Cursor — see finding** |
| `eef://interpretation` resource | fetch | full interpretation guide returned (strand index, methodology, caveats) |
| `search` | `units` scope, query + filters | 3 ranked units with highlights; slugs anchor the graph tools directly |
| `fetch` | `lesson:explain-what-percent-means…` | live-API lesson detail; misconception + keyword text byte-matches the bulk-corpus graph responses |

Checklist outcome: structural bounds only (anchors/depth/granularity), complete
within bound, honest windows, every response carries the keys for the next
bounded call, no server-side relevance judgement, refusal/empty in exactly the
three honest shapes — no soft stub observed anywhere.

## Finding: `get-eef-evidence` success payloads invisible in the Cursor client

- **Observed**: every successful `get-eef-evidence` call (both functions, both
  detail levels, smallest possible payload) rendered as `(omitted)` in Cursor's
  MCP tool-call result. Typed refusals from the same tool rendered fine, as did
  every other tool's success payload.
- **Root cause (source-grounded, not network-verified)**: the tool's
  owner-ratified success shape is `content: []` with the envelope only in
  `structuredContent`
  (`packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-eef-evidence.ts` —
  "Success returns `content: []` with the envelope as `structuredContent` (the
  owner-ratified structuredContent-only shape)"). Cursor's client renders only
  `content` blocks; an empty `content` array displays as `(omitted)` and the
  `structuredContent` is dropped. Every graph tool returns a serialised
  `TextContent` block *alongside* `structuredContent`, which is why they render.
- **Spec context**: MCP spec advises that tools returning structured content
  SHOULD also return the serialised JSON in a `TextContent` block for
  backwards compatibility. The structuredContent-only ratification predates
  this live evidence of a major client dropping it.
- **Impact**: any Cursor-hosted agent (and any client with the same
  content-block-only rendering) cannot consume EEF evidence from the live
  server at all — the D7 teacher-value path is dead in such clients while the
  contract-level behaviour remains correct.
- **Disposition**: owner/Director decision needed — add a serialised
  `TextContent` mirror to `get-eef-evidence` success responses (one-line change
  at the formatter boundary, consistent with the graph-tool category shape), or
  record the client limitation and hold the ratified shape. Evidence here; not
  self-executed because it reverses an owner-ratified decision.

## Secondary observations (corpus data, not tool defects)

- `keyword:convert` carries a religion-flavoured description ("to convert to a
  new religion or belief…") into maths keyword results — corpus-wide keyword
  identity shares one description across subjects (`subjects: [history, maths]`).
  Worth a look when keyword descriptions next get curation attention.
- Typo in corpus prior-knowledge text: "Interpret adn present data…" on
  `unit:understand-additive-relationships-and-apply-them-to-rearrange-equations`.
- Direct unauthenticated JSON-RPC to the prod endpoint correctly returns 401
  with a `WWW-Authenticate` PRM pointer (Clerk; OAuth protected resource
  metadata served at `/.well-known/oauth-protected-resource/mcp`).

## Coverage gaps (named, not silently skipped)

- MCP **prompts** (`continue-progression` and six others) are listed by the
  live server but Cursor's harness offers no prompt-invocation surface, so the
  prompt bodies were not exercised live this session. The descriptors match the
  shipped definitions.
- Live-API list tools (`get-key-stages-*`, `get-sequences-*`, `get-lessons-*`,
  changelog, rate-limit, user-search) were not individually probed; `fetch` and
  `search` cover the same live-API provenance path.
