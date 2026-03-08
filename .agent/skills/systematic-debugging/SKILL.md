---
name: systematic-debugging
classification: passive
description: >-
  Structured debugging workflow. Use when encountering bugs, test failures,
  or unexpected behaviour. Reproduce, isolate, hypothesise, verify, fix,
  regression test.
---

# Systematic Debugging

A structured approach to diagnosing and fixing defects. Follow these steps in order — do not skip to a fix before understanding the cause.

## Workflow

### 1. Reproduce

- Confirm the failure with a concrete, repeatable case
- If a test fails, run it in isolation to rule out ordering effects
- Capture the exact error message, stack trace, or unexpected output

### 2. Isolate

- Narrow the scope: which module, function, or layer is responsible?
- Use binary search: comment out or bypass sections to locate the boundary
- Check recent changes (`git diff`, `git log`) for likely introduction points

### 3. Hypothesise

- Form a specific, falsifiable hypothesis: "X fails because Y returns Z when it should return W"
- Avoid vague hypotheses like "something is wrong with the config"
- Write the hypothesis down (napkin, comment, or PR note)

### 4. Verify

- Write a test that confirms the hypothesis (red phase of TDD)
- If the test passes when it should fail, the hypothesis is wrong — return to step 3
- Do not proceed to a fix until the test demonstrates the defect

### 5. Fix

- Make the minimal change that makes the failing test pass
- Avoid fixing adjacent issues in the same change — one fix per defect

### 6. Regression test

- Run the full test suite, not just the new test
- Confirm no existing tests broke
- If the fix is in a shared module, check downstream consumers

## References

- `.agent/directives/principles.md` — TDD discipline, fail-fast principles
- `.agent/directives/testing-strategy.md` — test pyramid, isolation requirements
