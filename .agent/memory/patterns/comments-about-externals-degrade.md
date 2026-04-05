---
name: "Comments About External Behaviour Degrade"
use_this_when: "Code comments describe the behaviour of an external library, SDK, or service, especially when they assert what the library does NOT support"
category: process
proven_in: "apps/oak-curriculum-mcp-streamable-http/src/preserve-schema-examples.ts (line 49 — claimed MCP SDK does not honour .meta(); it does)"
proven_date: 2026-04-05
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Comments asserting external behaviour become stale after library upgrades, creating false constraints that block correct solutions"
  stable: true
---

# Comments About External Behaviour Degrade

## Problem

A comment in source code describes the behaviour of an external library
(SDK, framework, service). When the library upgrades, the comment
becomes stale — but nobody re-checks it. The stale comment then acts
as a false constraint, blocking correct solutions and justifying
workarounds that should not exist.

## Pattern

Never trust comments about what an external library *does not* support.
Verify against the library's actual source code before designing
workarounds. When you must document external behaviour:

1. Include the specific version number the claim was verified against.
2. Reference the exact file/function in the library source.
3. Document the removal condition: "This workaround can be removed when
   [library] honours [feature] — re-check on each upgrade."

## Anti-Pattern

```typescript
// The MCP SDK uses its own internal converter that does NOT honour
// .meta() data. We must override tools/list to preserve examples.
```

This comment was wrong. The MCP SDK v1.28.0 calls
`z4mini.toJSONSchema()` which *does* read the `globalRegistry` and
preserves `.meta()` data. The comment was likely correct for an earlier
version but was never re-verified. The workaround persisted for months,
compounding with other issues to prevent the MCP App from rendering.

## The Deeper Issue

External behaviour claims in comments have no mechanism for staleness
detection. Library upgrades don't trigger comment reviews. The only
mitigation is a test that exercises the claimed behaviour — if the
test passes, the workaround is unnecessary.
