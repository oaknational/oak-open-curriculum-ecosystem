---
paths:
  - '**/*.test.ts'
---

# No Skipped Tests

NEVER use `it.skip`, `describe.skip`, `it.skipIf`, or any skipping mechanism.
Fix it or delete it. External resource tests should fail fast with a helpful error, not skip.

See "No skipped tests" in `.agent/directives/rules.md`.
