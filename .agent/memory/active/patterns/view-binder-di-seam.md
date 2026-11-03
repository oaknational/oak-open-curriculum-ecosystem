---
name: "Views Take State as Props; a Two-Line Binder Owns the Hook"
polarity: pattern
use_this_when: "A React component both fetches/derives async state (via a hook) and renders it — and its tests are reaching for vi.mock, module mocking, or fetch stubbing to control what renders."
category: testing
layer: family
proven_in: "curriculum-hub-demo 2026-07-02: three test-expert rulings converged in one day — the search-core DI extraction (ruled house doctrine), HubResultsView (the vi.mock shape ruled BLOCKING with proof the mock was not load-bearing under the hook's debounce), use-curriculum-search's injectable fetchFn (abort-lifecycle tests). The jest-axe suite then consumed the same seams to render 8 surface states mock-free — the pattern paid twice (testability + a11y-audit surface)."
proven_date: 2026-07-06
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Components that bind their own async state are untestable without prohibited mechanisms (vi.mock on modules, ambient env, non-injectable singletons) — which produces audit-shaped tests or no tests. The seam makes every view state renderable as a literal."
  stable: true
---

# Views Take State as Props; a Two-Line Binder Owns the Hook

> **POLARITY: PATTERN.** This is a shape to repeat.

## The shape

1. **The view** is exported and pure over its inputs: it takes the async
   state as a **prop** (a discriminated state union — `idle | loading |
   ok | empty | error`), never calls the hook itself.
2. **The binder** is a near-two-line component (often the default
   export or the page-level consumer) whose only job is
   `<View state={useTheHook(input)} …/>`.
3. **Hooks that fetch** take their transport as an injectable parameter
   with the real default (`fetchFn: typeof fetch = fetch`) so lifecycle
   tests (abort, debounce, stale-state) inject a controlled fake.
4. **Tests render the VIEW with literal states — zero mocks.** Every
   branch of the state union is a one-line fixture. Axe/a11y suites
   consume the same seam to render every surface state.

## Why it works

The seam splits "does the view render each state correctly" (pure,
literal-driven, exhaustive) from "does the hook produce the right state
sequence" (tested via the injectable transport). Neither test needs
module mocking, and untestability-without-prohibited-mechanisms — a
product-code DI defect per the test-expert ruling — cannot arise.

## Worked instances

- `demos/oak-curriculum-hub`: `components/HubResults.tsx`
  (`HubResultsView`; the binder later hoisted to `HubLanding`),
  `components/curriculum/CurriculumShowcase.tsx`,
  `lib/use-curriculum-search.ts` (injectable `fetchFn`),
  `components/a11y-axe.test.tsx` (8 states rendered mock-free).

## Related

- `.agent/directives/testing-strategy.md` (DI-seam and mock-simplicity
  doctrine; this is its React-view instance).
- `tdd-as-design` — "tests would be audit-shaped" signals a product-code
  injectability defect, not a reason to skip tests.
