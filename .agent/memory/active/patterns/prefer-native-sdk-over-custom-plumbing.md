---
title: "Prefer Native SDK Over Custom Plumbing"
category: architecture
barrier_met: true
source_sessions: ["2026-04-14d", "2026-04-14g"]
---

# Prefer Native SDK Over Custom Plumbing

## Pattern

When a library or SDK provides a capability natively, use it
instead of maintaining custom plumbing that reimplements the
same functionality. The native mechanism **replaces** the
custom plumbing — it does not supplement it.

## Anti-pattern

Building and maintaining a custom wrapper layer for
functionality the upstream SDK provides. Also: adopting the
native mechanism but keeping the old custom layer alongside
it with invented justifications ("test mode needs it",
"fixture mode uses it"). This is sunk-cost rationalisation —
the custom layer was superseded, but existing code feels
valuable so reasons are found to keep it.

## Application

When the upstream SDK adds native support for something you
built custom:

1. **Investigate** what the custom package provides and what
   the native mechanism replaces
2. **Determine what survives** — does anything in the custom
   package have genuine value beyond what the native mechanism
   provides? Answer with evidence, not assumption.
3. **Remove what's superseded** — don't gate on mode, don't
   keep parallel paths. If test mode needs observability
   assertions, test the actual production mechanism, not a
   parallel one.
4. If something genuinely survives, state exactly what and
   why, with evidence that the justification is not sunk-cost

The question is "what survives replacement?" not "how do we
make both coexist?"

## Evidence

`@oaknational/sentry-mcp` provided custom per-handler MCP
observation wrapping. Sentry SDK v10.47.0 added
`wrapMcpServerWithSentry()` which is a strict superset
(transport correlation, error classification, 20+ OTel
attributes). Barney: "custom plumbing where a library provides
the mechanism is a violation."

**Correction (2026-04-14g):** the original pattern said
"retain the custom layer for fixture mode" and "gate the
wrapping strategy on mode." This was itself sunk-cost
rationalisation baked into the pattern. Fixture mode tests
the adapter surface (setTag, setUser, setContext, close) —
it doesn't need a parallel wrapping mechanism that isn't
used in production. Testing a different code path in test
mode proves the test path works, not the production path.
