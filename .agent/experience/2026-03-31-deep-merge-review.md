# Deep Merge Review

**Date**: 2026-03-31

The most revealing moment was discovering that three "safety net" tests had
never run. They were named `*.characterisation.test.ts` — a naming convention
that didn't match the vitest include pattern. These tests existed specifically
to catch merge regressions, and they were silent the entire time.

When activated, one test immediately failed. The assertion was wrong — not the
code. The test claimed `createMcpObservationOptions` would be called once, but
the real call count was eight (once per tool registration, once per resource,
once for prompts). The test had been written with an assumption about the
implementation that was never validated against reality.

This is the shape of false confidence: a test file exists, a comment says
"safety net," the merge plan references it as a guarantee — and none of that
matters because the runner never picked it up. Dead tests are worse than no
tests because they manufacture trust.

The broader review — 52 auto-merged files, 6 specialist reviewers — found
the two branches were genuinely complementary. Observability from main and
widget deletion from the branch operated at different layers and didn't
intersect behaviourally. The type system caught every parameter-level
mismatch; the tests caught every behavioural-level mismatch. The gap was
only in the tests themselves.
