---
name: "Result-Seam So Test Fakes Need Not Throw"
polarity: pattern
use_this_when: "Testing an error path that wraps a throwing dependency (execFileSync, a path resolver, a vendor call), and a throwing test-fake would trip the no-throw warn rule — lift the seam to return Result and translate the throw at the single real boundary, so the fake returns err() and never throws."
category: testing
layer: family
proven_in: "agent-tools spawn-flow / collaboration-state error-path tests (2026-06-28) — supervisor-liveness and coordination-home resolvers"
proven_date: 2026-06-28
related_pattern: "interface-segregation-for-test-fakes (the sibling: narrow the type a fake must satisfy; this one removes the throw a fake must mimic)"
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Writing a throwing test-fake to exercise an error path, which trips the no-throw warn rule and pushes test code onto the no-throw backlog."
  stable: true
---

> **POLARITY: PATTERN.** This is a shape to repeat: move the throw to one real
> boundary so neither production code nor the test fake has to throw.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern) for the polarity discipline.

# Result-Seam So Test Fakes Need Not Throw

To test an error path, the fake must produce the error. When the dependency
under the seam *throws* (`execFileSync`, a resolver, a vendor call), the obvious
fake throws too — which trips the repo's `no-throw-statement` warn rule
(ADR-088 (`088-result-pattern-for-error-handling.md`, a file OCE holds))
and pushes test code onto the no-throw backlog. The cure is not to suppress the
rule on the test; it is to move the throw out of the seam.

## Pattern

Lift the seam so it returns `Result<T, E>` and translate the throw to `err(...)`
at the **single real boundary** where the throwing dependency is actually
called. Everything above the boundary — production callers and the test fake
alike — speaks `Result`. The fake then returns `err(...)`; it never throws.

```typescript
// Seam returns Result; the throw is translated once, at the real boundary.
interface SpawnGitRunner {
  readonly run: (args: readonly string[]) => Result<string, SpawnGitError>;
}

// Real implementation: the ONE place a throw becomes an err.
const realRunner: SpawnGitRunner = {
  run: (args) => {
    try {
      return ok(execFileSync('git', [...args], { encoding: 'utf8' }));
    } catch (e) {
      return err(toSpawnGitError(e));
    }
  },
};

// Test fake: returns err — never throws, never trips no-throw.
const failingRunner: SpawnGitRunner = {
  run: () => err({ kind: 'git-failed', detail: 'simulated' }),
};
```

## Why it works

The error path is now exercised by data (`err(...)`), not by control flow (a
throw). Production code stays off the no-throw backlog, the test fake stays
warning-clean, and the error type is explicit at every layer instead of being an
untyped exception that could originate anywhere.

## Composition

- **Watch the function-size caps.** Wrapping a previously-throwing call in
  `try/catch` + `Result` translation inflates the boundary function; if it grows
  past the `max-lines-per-function` / statement caps, extract a `validate*` /
  `execute*` helper (see [`honest-restructure-over-band-aid`](honest-restructure-over-band-aid.md)).
- **Narrow the fake's type too** with
  [`interface-segregation-for-test-fakes`](interface-segregation-for-test-fakes.md):
  the two patterns compose into a fake that is both minimal in shape and
  non-throwing in behaviour.
- **First decide whether the throw is real.** This pattern applies when the
  dependency genuinely throws and you need to exercise its error arm. If instead
  the throw exists *only* to narrow a too-wide upstream type (its error arm is
  unreachable), the fix is to strengthen the type and delete the throw — see
  [`throw-as-narrowing-artifact-strengthen-the-type`](throw-as-narrowing-artifact-strengthen-the-type.md).
  Result-seam moves a real throw to one boundary; that pattern removes a false one.
