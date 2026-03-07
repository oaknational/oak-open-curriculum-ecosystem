# No Skipped Tests

NEVER use `it.skip`, `describe.skip`, `it.skipIf`, or any other skipping mechanism. Fix it or delete it. External resource tests should fail fast with a helpful error, not skip.

See `.agent/directives/principles.md` §Code Quality for the full policy.
