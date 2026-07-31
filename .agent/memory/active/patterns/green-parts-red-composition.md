---
name: Green Parts, Red Composition
polarity: anti-pattern
use_this_when: Changing any mechanism whose OUTPUT another mechanism consumes (rulesets, release automation, build caches, ignore scripts, codegen), or diagnosing a silent production/pipeline failure where every individual component reports healthy
category: process
proven_in: >-
  2026-07-23 release-flow incident chain (three compositions in one day):
  ruleset-split × semantic-release bypass; Vercel ignore-script × missing
  version bump; turbo cache-miss × live-API SDK regeneration (MCP-130)
proven_date: 2026-07-23
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Silent pipeline death where each mechanism works exactly as designed but their composition is dead — and nothing watches compositions, so the failure surfaces days later as stale production or a red build on an unrelated change"
  stable: true
---

> **POLARITY: ANTI-PATTERN.** The failure shape is composition blindness:
> verifying parts, never the chain. The cures are the paired positive
> moves below.
>
> See [`patterns/README.md` § Polarity](README.md#polarity-required-every-pattern).

## Failure shape

Two (or more) mechanisms each work exactly as designed, their composition
is dead or broken, and nothing watches compositions — so the failure is
silent and surfaces far from its cause. Three instances in one day
(2026-07-23):

- **Ruleset × release bot**: a ruleset split omitted the
  semantic-release app from one ruleset's bypass list. The ruleset
  enforced correctly; semantic-release pushed correctly; the composition
  (bump push through the gate) died with GH013 — production sat two
  days stale while every merge looked green.
- **Ignore script × version bump**: the Vercel ignore script cancels
  production builds unless the root version advanced — by design.
  Composed with the missing bump above, every production deploy was
  auto-CANCELED, silently, all day.
- **Build cache × live-API codegen**: `sdk-codegen` regenerates types
  from the live API on a turbo cache miss (by design); the live schema
  drifted. Every deploy riding the cache stayed green; the first PR to
  invalidate the core chain failed its Vercel check on code nobody
  wrote (MCP-130).
- **Token × token (fourth instance, late July 2026, design domain)**: every
  design token passed its individual contrast/focus check; the COMPOSED
  focus ring — token layered on token — failed accessibility. The class is
  not pipeline-specific: any domain where per-part checks exist and the
  behaviour lives in the composition qualifies. (This instance's surfaces
  are values, not derive-chains, so the refinement-watch split below does
  not fire on it.)

The connecting property: each part's health check answers "is this part
working?"; no surface answers "is the chain working?". Green parts are
therefore not evidence of a live composition.

## Cures

- **Composition-level documentation**: one runbook that draws the chain
  end to end (who produces what, who consumes it, what breaks if a link
  changes). Without it there is nothing to validate a config change
  against — the 2026-07-23 diagnosis was slow precisely because no
  document described the working state.
- **Composition-level observability**: a loud failure signal on the
  chain's OUTCOME (e.g. release-failure alert), not only on parts.
  Silent cancellation/skip paths ("ignore", "bypass", "cache hit") are
  the priority instrumentation points — they are where compositions die
  quietly.
- **Walk the composition at change time**: before changing any part
  (a ruleset, a bypass list, a cache key, an ignore condition), ask
  "who consumes this part's output, and what silently depends on its
  current behaviour?" — and verify the chain end-to-end once after the
  change, not just the part.

The discriminating question: *every part is green — what watches the
composition?*

**Refinement watch (2026-07-23, from the cure-side synthesis)**: the three
cures that day shared one shape — one authoritative state definition, every
surface DERIVES, and a one-place walk enumerates the deriving surfaces. The
open joint is that walk-JOINING is itself a discipline: completeness is not
self-certifiable (that day's underived surfaces were found by types, review,
and the owner — never by self-scan; MCP-121 holds the walk socket). If a
fourth composition-failure instance arrives whose surfaces DO all derive,
split this pattern into state-divergence vs write-blockage sub-classes (the
2026-07-23 release stall was the latter).
