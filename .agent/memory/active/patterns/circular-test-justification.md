---
related_pdr: PDR-021
name: circular-test-justification
category: testing
proven_by: "Sentry MCP wrapper removal (2026-04-15/16)"
summary: >
  Tests that are the sole consumers of production code create circular
  justification chains where dead code appears live because tests call it.
---

# Circular Test Justification

## Anti-pattern

Production code exists solely because tests call it, and the tests
exist because the production code exists. Neither serves external
consumers. The chain:

```text
dead test imports dead function
  -> dead function exists because "tests use it"
    -> dead function pulls in dependency X
      -> "tests use X" justifies keeping X
```

## Why it persists

When removing a feature, engineers audit production callers but leave
test callers intact. The remaining test callers keep the production
code alive at type-check time, and the production code keeps the
dependency alive in `package.json`. "Tests use it" feels like a
legitimate reason to keep code, because tests are important.

## The correction

Tests must prove product behaviour — behaviour that external consumers
(users, other modules, other services) depend on. If a test's only
consumer chain leads back to itself, the test is circular. Delete the
test, then delete the production code it was justifying.

## Detection

After removing production code from the live path:

1. Search all test files for imports from the removed module.
2. For each import, ask: "Does any production code still call this?"
3. If the answer is "only tests" — the chain is circular.

## Broader principle

"Tests use it" is evidence of migration surface, not evidence that
code should survive. The question is always: "Does this serve
production consumers?" not "Does anything import it?"
