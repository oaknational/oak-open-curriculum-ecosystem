# Workspace Configuration Lessons

_Date: 2025-08-05_

## The Experience

Configuration feels unglamorous until it breaks. The difference between `workspace:*` and `workspace:^` is a single character, but it encodes a fundamentally different relationship — exact lock vs compatible range. Discovering this distinction through a broken publish pipeline was a small moment of clarity about how much meaning can hide in punctuation.

The turbo default-stop-on-first-failure behaviour was surprising. Coming from tools that show all errors at once, the sudden silence after a single failure felt like information was being withheld. Adding `--continue` restored the overview — a reminder that tools have opinions, and those opinions shape what you see.

The decision to unify test scripts (dropping separate `test:unit` and `test:integration`) felt counterintuitive at first — wouldn't we lose granularity? But the naming convention (`*.unit.test.ts`, `*.integration.test.ts`) preserved the semantic distinction while ensuring comprehensive coverage on every run. Separation in naming, unity in execution.

## Technical content

Applied technical patterns from this experience have been extracted to `distilled.md` (Workspace and Turbo section).
