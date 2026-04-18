---
name: test-claim-assertion-parity
category: testing
proven_by: "Sentry wrapping-order test rewrite (2026-04-16)"
summary: >
  A test's documentation and assertions must prove the same thing.
  When a test header claims regression detection but the assertion
  cannot distinguish the regressed state from the correct state,
  the test creates false confidence.
---

# Test Claim-Assertion Parity

## Anti-pattern

A test's describe/it text or JSDoc claims to guard against a specific
regression, but the actual `expect()` calls would pass regardless of
whether the regression occurred. The narrative creates confidence
that the assertion cannot deliver.

## Example

```typescript
// Claims to detect ordering regressions
describe('wrap is called before register', () => {
  it('handlers registered through patched method', () => {
    wrapMcpServerWithSentry(server);
    registerHandlers(server, opts);
    // This assertion passes whether wrapping happens
    // before OR after registration
    expect(registerToolSpy).toHaveBeenCalled();
  });
});
```

## The correction

Before writing the test narrative, ask: "If I introduce the exact
regression this test claims to prevent, does the assertion fail?"
If the answer is no, either:

1. Redesign the assertion to actually detect the regression, or
2. Rewrite the narrative to honestly describe what the test proves.

Option 2 is acceptable when the regression is not detectable in-
process (e.g. internal library patching). Honest documentation is
better than false confidence.

## Detection

Read the `describe`/`it` text, then read only the `expect()` calls.
If the expects would pass in the regressed scenario, the claim and
the assertion are mismatched.

## Further Evidence

**2026-04-17 Sentry L-0b close** (commit `d08c6969`). The L-0b
conformance test file declared
`const BYPASS_CANDIDATES: readonly BarrierHookName[] = BARRIER_HOOKS;`
followed by
`expect(new Set(BYPASS_CANDIDATES)).toEqual(new Set(BARRIER_HOOKS))`.
The assertion is structurally always true because the two names
point at the same array — it tests aliasing, not coverage. The test
narrative claimed "BYPASS_CANDIDATES covers every BARRIER_HOOKS
entry"; the assertion could not distinguish the correct state from
any regression. Code-reviewer flagged it. The correction: replace
the runtime tautology with a type-level set-equality gate against
`keyof SentryRedactionHooks` (the exported return type of
`createSentryHooks`). That check genuinely fails at `pnpm type-check`
when the adapter adds or removes a hook without a `BARRIER_HOOKS`
update. General lesson from this instance: when two names point at
the same constant, comparing them tests aliasing, not behaviour —
trace the invariant you want to enforce back to something
structurally independent.
