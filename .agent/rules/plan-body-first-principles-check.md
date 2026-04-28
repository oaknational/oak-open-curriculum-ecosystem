# Plan-Body First-Principles Check

Before authoring tests, implementations, or doctrine prescribed by a plan body,
run the three-clause first-principles check. If any clause fails, surface the
mismatch to the owner before writing code or doctrine.

1. **Shape clause.** Is the test-shape (or implementation-shape, or doctrine-
   shape) right for the **Oak-authored behaviour** being proven, or is it a
   vendor / configuration / framework assertion in disguise? If the shape
   proves "the vendor did its job" or "the config is set", the shape is wrong.
2. **Landing-path clause.** Does the file naming carry a tooling contract
   (pre-commit hook, CI gate inclusion/exclusion, lint config, test-runner
   include pattern) that constrains how or when this artefact can land? Silent
   mismatches produce dead tests, bypassed gates, or "lands-but-never-fires"
   artefacts.
3. **Vendor-literal clause.** Does any literal token taken from the plan body
   (especially vendor API values, config keys, package-export names, file
   paths) match the current upstream surface, or is it a doc-level word the
   plan borrowed? Plan prose drifts from vendor reality between plan-write and
   plan-execute.

This rule is the first installed Family-A tripwire in the perturbation-
mechanism bundle. It is front-loaded in Session 1 Task 1.4 of the staged
doctrine-consolidation plan to cover Sessions 2–3 before the full bundle
lands.

## Why this rule exists

The `inherited-framing-without-first-principles-check` pattern names a
repeated failure mode: the agent executes a plan's prescribed shape faithfully
because it is written down, without asking whether the shape is right for the
behaviour being proven. Six instances occurred across 2026-04-20 and 2026-
04-21; three were caught only by external friction (owner in-flight review,
reading spec against directive, cross-checking vendor docs) — not by any
pre-installed tripwire. Passive guidance did not fire.

This rule converts the check from passive guidance into an always-applied
trigger at shape-entry, per the `passive-guidance-loses-to-artefact-gravity`
pattern's Heath-brothers tripwire framing.

## Related surfaces

- Pattern: [`.agent/memory/active/patterns/inherited-framing-without-first-principles-check.md`](../memory/active/patterns/inherited-framing-without-first-principles-check.md)
  — definitions, six instances, clause-by-clause attribution.
- Pattern: [`.agent/memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md`](../memory/active/patterns/passive-guidance-loses-to-artefact-gravity.md)
  — why this must be a rule, not a watchlist entry.
- **Governing PDR**: [PDR-029 Perturbation-Mechanism Bundle](../practice-core/decision-records/PDR-029-perturbation-mechanism-bundle.md)
  (ratified 2026-04-21, amended twice 2026-04-21). This rule is the
  Family-A Class-A.1 tripwire. Per PDR-029's second 2026-04-21 Amendment Log
  entry, A.1's prior-decision-recall is served by the foundation-directive
  grounding at session open (principles, ADR index, PDR tier, `.agent/rules/`
  tier) — all of which are read-at-ritual-moment active layers per the first
  2026-04-21 amendment. No dedicated "register surface" is required or
  desirable; a misc bucket admits unclassified-decision debt rather than
  enforcing classification into the proper artefact homes (ADR / PDR /
  rule / principle / plan-local).
- Testing-strategy doctrine: [`.agent/directives/testing-strategy.md`](../directives/testing-strategy.md)
  — the tests-prove-behaviour principle the shape clause operationalises.
- Principles: [`.agent/directives/principles.md`](../directives/principles.md)
  — the First Question ("could it be simpler?") that backs the shape clause's
  "single pure-function test could prove the same thing simpler" heuristic.
