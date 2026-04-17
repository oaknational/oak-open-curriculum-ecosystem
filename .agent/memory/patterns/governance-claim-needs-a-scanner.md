---
name: "Governance Claim Needs a Scanner"
use_this_when: "An ADR or governance document asserts that some property holds 'everywhere' across a set of live surfaces (one vocabulary, a required citation, a mandatory field, a platform-adapter parity), and prose alone is the only enforcement."
category: agent
proven_in: "scripts/validate-fitness-vocabulary.mjs"
proven_date: 2026-04-17
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Universal governance claims drifting out of compliance silently because prose says 'must' but no scanner enforces it"
  stable: true
---

# Governance Claim Needs a Scanner

## Pattern

When a governance document asserts that a property holds **universally**
across a set of live surfaces — "every rule cites its ADR", "the zone
vocabulary appears on every surface", "every governed file declares four
fitness metrics", "every canonical artefact has a platform adapter" —
back the claim with an automated scanner that walks those surfaces and
exits non-zero if the property fails.

Prose-only universality drifts. A scanner that exits `1` when the claim
fails is the only mechanism that keeps doctrine aligned with reality as
the codebase evolves.

## Anti-Pattern

An ADR, rule, or governance doc that mandates "X must appear on every
live surface" with no scanner enforcing the "every" quantifier.
Individual surfaces drift one at a time, each drift invisible until a
session happens to grep the full estate. By then, the doctrine has
accumulated several incompatible teachings simultaneously.

## Application

The scanner is small, zero-dependency, and runs as a wired pnpm script:

1. Enumerate the live surfaces the claim applies to (markdown, code,
   config). Exclude archives, backups, and the governing document itself
   where its prose necessarily discusses the banned state.
2. For each surface, test the universal predicate.
3. Emit a readable report pointing to the exact file and line where the
   claim fails. Exit `1` if any surface fails.
4. Wire the scanner into `pnpm check` and / or the relevant closure
   command so drift can't ship without an explicit override.

Materialised examples in this repo:

| Scanner | Governing ADR | Universal claim enforced |
|---|---|---|
| `scripts/validate-portability.mjs` | ADR-125 | Every canonical artefact has a platform adapter on each supported platform |
| `scripts/validate-subagents.mjs` | ADR-114 / ADR-129 | Every sub-agent template has conformant wrappers and matching descriptions |
| `scripts/validate-practice-fitness.mjs` | ADR-144 | Every fitness-managed file declares the four required metrics and stays within zone |
| `scripts/validate-fitness-vocabulary.mjs` | ADR-144 §Key Principles #1 | Every live surface uses the three-zone vocabulary verbatim; no retired phrases leak |

## Why This Matters

A governance claim that says "must be true everywhere" is a universal
quantifier over a live, growing set of surfaces. Universal quantifiers
without mechanical enforcement degrade as the set grows — the claim
moves from description to aspiration without anyone noticing. Adding a
scanner closes the gap between doctrine and reality. It also makes
future ADR amendments cheaper: when doctrine changes, the scanner fails
first, and the translation work becomes a concrete punch-list instead
of an open-ended sweep.

## Related

- **Drift Detection Test** — narrower: detects drift between a manually
  maintained list and its canonical source. This pattern generalises
  the idea to "any universal governance claim".
- **Check Driven Development** — about picking the right assertion tool
  for a RED phase. This pattern is about picking a scanner to enforce
  a governance claim in CI.
- ADR-131 §The Self-Referential Property — if rules about rule creation
  can't be enforced through the same loop, the enforcement stage is
  exempt from its own governance. A scanner is how the loop closes.
