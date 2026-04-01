# Accessibility as a Blocking Gate

> **Origin**: opal-connection-site, 2026-03-28
> **Source evidence**: Playwright + axe-core WCAG 2.2 AA gate, blocking since
>   initial Practice hydration
> **Status**: Transferable pattern for UI-shipping repos

## Pattern

Treat automated accessibility auditing as a blocking quality gate with the same
severity as type-checking or build failure. No merge, no deploy if WCAG
violations exist.

## How It Works Here

```
pnpm test:a11y → Playwright → axe-core → WCAG 2.2 AA
```

The test suite (`tests/accessibility.spec.ts`) runs axe-core against the
rendered page in Chromium, for both light and dark themes. It also verifies
theme-toggle behaviour and colour contrast changes across modes. All four tests
are blocking — zero violations permitted.

This is wired into the gate sequence:

```
pnpm check → typecheck + build + test:a11y + practice:validate + practice:fitness
```

The accessibility gate runs against the dev server (fast feedback), while
`pnpm build` proves the static output is shippable. Both are blocking.

## Why It Works

1. **Catches regressions early.** Adding a section, reordering headings, or
   changing colour tokens can break WCAG compliance. The gate catches this
   before review.
2. **Removes ambiguity.** "Check accessibility" becomes a pass/fail gate, not
   a judgment call. Agents and humans get the same signal.
3. **Scales with content.** As pages grow, the gate covers new content
   automatically — no manual test expansion needed.
4. **Theme-aware by default.** Testing both themes catches contrast failures
   that single-theme audits miss (e.g., accent colours that flip luminance
   between light and dark).

## When to Adopt

Any project that ships user-facing HTML. The tooling choice (Playwright +
axe-core, Cypress + axe, Lighthouse CI) is secondary to the principle: WCAG
compliance is a blocking gate, not a best-effort suggestion.

## Anti-Patterns

- Running accessibility checks in CI only, not locally — too slow a feedback
  loop for iterative UI work
- Allowing "known violations" lists that grow over time — the gate must stay
  at zero violations
- Testing only one theme or viewport — accessibility failures are often
  mode-specific or size-specific
