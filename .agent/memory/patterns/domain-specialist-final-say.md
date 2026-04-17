---
name: "Domain Specialist Has Final Say on SDK Semantics"
use_this_when: "Architecture reviewers make assumptions about SDK-specific behaviour (scope models, handler ordering, API semantics) that have not been verified against official documentation"
category: process
proven_in: ".agent/plans/architecture-and-infrastructure/archive/completed/sentry-canonical-alignment.plan.md"
proven_date: 2026-04-12
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Architecture generalists assuming SDK behaviour without checking docs, leading to over-engineered or incorrect solutions"
  stable: true
---

# Domain Specialist Has Final Say on SDK Semantics

## The pattern

When a multi-specialist review involves both architecture generalists
and domain specialists, the domain specialist's assessment of
**SDK-specific behaviour** takes precedence over the generalists'
assumptions. Architecture generalists reason structurally (coupling,
boundaries, failure modes), which is correct for structural concerns
but can produce incorrect conclusions about how a specific SDK actually
behaves at runtime.

## The anti-pattern

An architecture reviewer identifies a plausible failure mode (e.g.
"ambient `setUser()` leaks scope between concurrent requests") and
recommends an engineering solution (e.g. `withScope()` callback
wrapper). The team implements the solution without checking the SDK
docs. Later, a domain specialist reveals that the SDK already handles
the concern (e.g. `@sentry/node` v8+ isolation scopes auto-fork per
request), making the solution unnecessary complexity.

## When to apply

- A reviewer flags a concern about how a third-party SDK works
- The concern leads to a design change (new wrapper, new abstraction)
- Nobody has verified the SDK's actual behaviour against official docs

**Action**: Before acting on the finding, invoke the relevant domain
specialist reviewer and ask them to verify against official
documentation. If the specialist contradicts the generalist, the
specialist's grounded assessment wins.

## Evidence

Sentry canonical alignment plan (2026-04-12): architecture-reviewer-betty
proposed `withScope()` callback pattern to prevent scope leakage.
The sentry-reviewer checked official docs and found `@sentry/node` v8+
isolation scopes already prevent the leakage. Similarly,
architecture-reviewer-wilma assumed `setupExpressErrorHandler` is
terminal — sentry-reviewer verified it passes control onward.
