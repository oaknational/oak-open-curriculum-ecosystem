---
name: "Accessibility as a Blocking Gate"
use_this_when: "A project ships user-facing HTML and needs to prove WCAG compliance automatically"
category: testing
proven_in: "opal-connection-site/tests/accessibility.spec.ts"
proven_date: 2026-03-28
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Accessibility regressions shipped silently because audits were advisory, not blocking"
  stable: true
---

## Principle

Treat automated accessibility auditing as a blocking quality gate with
the same severity as type-checking or build failure. No merge, no
deploy if WCAG violations exist. The gate runs against rendered output,
not source code.

## Pattern

1. Choose an automated WCAG auditing tool (axe-core, Lighthouse CI,
   or equivalent).
2. Wire it into the quality gate sequence alongside type-check, lint,
   and build. It must block — not warn, not report, block.
3. Run against all themes/modes (light, dark, high contrast) because
   contrast failures are often mode-specific.
4. Maintain zero-violation policy — no "known violations" lists that
   grow over time.
5. Run locally for fast feedback, not only in CI.

## Anti-pattern

- Running accessibility checks in CI only — too slow a feedback loop
  for iterative UI work.
- Allowing "known violations" lists — the gate must stay at zero.
- Testing only one theme or viewport — failures are often mode- or
  size-specific.
- Treating accessibility as a best-effort suggestion rather than a
  structural correctness check.

## When to Apply

Any project shipping user-facing HTML. The tooling choice is secondary
to the principle: WCAG compliance is a blocking gate, analogous to
type-checking for rendered output.
