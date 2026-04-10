---
name: "Drift Detection Test"
use_this_when: "A manually maintained list should match a canonical source but cannot be derived due to structural constraints, or repo-state drift needs detecting between maintained copies and canonical sources"
category: code
proven_in: "packages/sdks/oak-curriculum-sdk/src/mcp/aggregated-help.unit.test.ts"
proven_date: 2026-03-01
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Manual lists silently drifting from canonical sources when derivation is structurally blocked"
  stable: true
---

# Drift Detection Test

When a manually maintained list duplicates information from a canonical
source but cannot be derived from it (due to circular imports, module
boundary constraints, or architectural limitations), add a test that
iterates the canonical source and verifies the system works for each
entry.

## Pattern

```typescript
import { typeSafeKeys } from './type-helpers.js';
import { CANONICAL_SOURCE } from './canonical-module.js';

it('handles every entry in canonical source (drift detection)', () => {
  const canonicalNames = typeSafeKeys(CANONICAL_SOURCE);
  for (const name of canonicalNames) {
    const result = systemUnderTest(name);
    expect(result).toBeDefined();
  }
});
```

## Anti-Pattern

Silently maintaining a duplicate list without any mechanism to detect
when the lists diverge:

```typescript
const MANUAL_LIST = ['a', 'b', 'c'];
```

If the canonical source adds `'d'`, the manual list silently falls
behind. No test fails. The drift is only discovered when a consumer
hits a runtime error.

## Choosing the Right Checker

Choose the checker that matches the concern:

- **Tests** — when the drift concerns imported code behaviour or runtime contracts
- **Repo-audit or filesystem inspection** — when the drift concerns tracked repo state
  (file layout, wrapper parity, link estates, surface matrices)

Do not force repo-state or wrapper-parity checks into a test runner just because it is already
available. The failure message should explain what drifted and where the canonical truth lives.

## When Derivation Is Better

If the structural constraint can be removed (refactoring to eliminate
the circular import, extracting shared constants to a leaf module),
derivation is always preferable to a drift-detection test. The test
is a compensating control, not a first choice.
