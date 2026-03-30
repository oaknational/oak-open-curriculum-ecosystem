# Keywords Endpoint Ordering Mismatch

Observed behaviour from the Oak Open Curriculum API `GET /keywords` appears to contradict the endpoint description.

Discovered: 28 March 2026, during MCP server behaviour validation.

## Issue

**Endpoint**: `GET /keywords`  
**MCP tool**: `get-keywords`

The documented behaviour says:

> "The keywords are returned in order of frequency, with the most common keywords appearing first."

However, the returned list appears to be alphabetical (at least at the start), not frequency-ordered.

## Reproduce

### Via MCP (oak-local)

Call:

```json
{ "subject": "science", "keyStage": "ks3" }
```

with tool `get-keywords`.

### Via API

```bash
# Requires OAK_API_KEY
curl -s -H "Authorization: Bearer $OAK_API_KEY" \
  "https://open-api.thenational.academy/api/v0/keywords?subject=science&keyStage=ks3"
```

## Evidence

The start of the returned list begins:

- `abiotic`
- `absorb`
- `absorption`
- `acceleration`
- `accurate`

This strongly suggests lexical ordering rather than descending frequency.

## Expected Behaviour

Either:

1. Return keywords genuinely ordered by descending frequency across the filtered lesson set, **or**
2. Update endpoint/tool documentation if the intended order is alphabetical.

## Independent Verification (2026-03-28)

Direct `curl` to the upstream API confirms the ordering is alphabetical at
source — our MCP server passes the response through without any sorting or
transformation.

```bash
source .env && curl -s \
  "https://open-api.thenational.academy/api/v0/keywords?keyStage=ks3&subject=science" \
  -H "Authorization: Bearer $OAK_API_KEY" | jq '.[:10] | .[].keyword'
```

Returns:

```text
"abiotic"
"absorb"
"absorption"
"acceleration"
"accurate"
"acid"
"acid rain"
"acidic"
"adaptation"
"Adaptation"
```

Note also: `"adaptation"` (lowercase) and `"Adaptation"` (capitalised) appear
as separate entries — suggesting case-sensitive deduplication is not applied
upstream.

### Code path verified

- Generated tool descriptor at
  `packages/sdks/oak-sdk-codegen/src/types/generated/api-schema/mcp-tools/tools/get-keywords.ts`
  — no sorting, filtering, or reordering logic. Description string is copied
  verbatim from the OpenAPI spec.
- SDK client (`oak-base-client.ts`) passes API response through without
  transformation.
- The description claiming "order of frequency" originates in the upstream
  OpenAPI spec, not in any Oak MCP code.

## Impact

- Agents and users relying on "most common first" receive potentially misleading prioritisation.
- Any downstream ranking, curriculum summaries, or keyword-driven guidance may be skewed.
- Case-sensitive duplicates (`adaptation` / `Adaptation`) inflate the keyword count and may confuse keyword-driven workflows.
