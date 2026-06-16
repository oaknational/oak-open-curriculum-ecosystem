---
name: "A Sweep Filter Is Part of the Claim — Audit It Against the Live Referent"
polarity: pattern
use_this_when: "Arming any filter that decides what a sweep sees — a grep/rg pattern, a watcher branch-name match, an exclusion glob, a monitor alternation — and you will act on its result (especially a quiet or green one)."
category: process
proven_in: "Three 2026-06-11→12 instances: rg single-line missed a multi-line Zod/fluent chain (needed rg -U); a `-v .test.ts` exclusion hid a real importer; a PR-merge watcher matched a hyphenated branch-name guess against an underscored real branch and silently never fired."
proven_date: 2026-06-16
barrier:
  broadly_applicable: true
  proven_by_implementation: true
  prevents_recurring_mistake: "Trusting a sweep's result when the filter silently never matched the thing it was meant to find — a false-negative that looks identical to 'nothing there.'"
  stable: true
---

> **POLARITY: PATTERN.** A shape to repeat. See [`README.md` § Polarity](README.md#polarity-required-every-pattern).

# A Sweep Filter Is Part of the Claim — Audit It Against the Live Referent

A filter decides what a sweep can see. If the filter silently fails to match its
referent, the sweep returns "nothing" — indistinguishable from a genuine absence.
The filter is therefore **part of the claim** the sweep makes, and must be
audited against the live referent before its result is trusted.

## Pattern

Before acting on any sweep, test the filter against the **actual referent**:

- **Multi-line constructs:** `rg` matches single lines by default — a Zod schema
  or fluent chain spanning lines is missed without `rg -U` (or an equivalent
  multi-line mode).
- **Exclusions hide real hits:** an exclusion glob (`-v .test.ts`) can hide a
  real consumer; confirm the excluded set contains nothing load-bearing.
- **Separator / naming mismatch:** a watcher matching a guessed branch name
  (`my-branch`) against the real referent (`my_branch`) never fires silently;
  verify the filter against the live name, or match separator-insensitively
  (`[-_]`).
- **Positive control:** prove the filter matches at least one known instance
  before trusting a zero result.

## Anti-pattern

Arming a filter from a guess or a single-line assumption and reading its quiet
result as confirmed absence.

## Related

- [`prove-the-checker-with-a-negative-control.md`](prove-the-checker-with-a-negative-control.md) — the dual: prove a green checker actually checks.
- [`wrapped-exit-codes-false-green.md`](wrapped-exit-codes-false-green.md) — a success surface that cannot carry the verdict.
- `verify-dont-trust` rule.
