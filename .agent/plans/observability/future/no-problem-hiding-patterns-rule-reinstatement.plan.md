---
name: no-problem-hiding-patterns ESLint rule reinstatement
overview: >
  Re-author and activate enforcement of `principles.md` §"Don't hide problems —
  fix them or delete them" as a custom ESLint rule under clean-conditions
  authorship. The first attempt (Pelagic Flowing Dock, 2026-04-27) was authored
  under named drift conditions and deleted by Opalescent Gliding Prism the same
  day under owner direction (Decision 1B of the PR-87 architectural cleanup
  plan). This plan re-authors enforcement from scratch: rule body, test cases,
  and codebase sweep are NOT inherited from the deleted artefact.
status: future
last_updated: 2026-04-27
todos:
  - id: phase-1-design-from-principle
    content: "Phase 1: Re-derive the rule's matching scope from `principles.md` §\"Don't hide problems\" word-for-word. Name each archetype the rule must flag and the cure for each. NO inheritance from the deleted rule body, the deleted test cases, or the prior session's sweep cures."
    status: pending
  - id: phase-2-tdd-rule
    content: "Phase 2: TDD the rule. RED first: a failing test for each archetype identified in Phase 1. GREEN: minimum rule body that passes every test. REFACTOR: TSDoc the rule body with examples and the principle-text source for each branch."
    status: pending
  - id: phase-3-sweep
    content: "Phase 3: Activate the rule in `recommended.ts`. Run repo-wide lint. For each violation, re-derive the cure from first principles per-file (not from any prior cure). Serial discipline; phase-boundary re-read of `principles.md`. Narrate each cure aloud before applying."
    status: pending
  - id: phase-4-reviewers
    content: "Phase 4: Reviewer dispatch (architecture-fred for ADR-024 alignment, code-reviewer for rule body quality, test-reviewer for test coverage, assumptions-reviewer for stress-test against drift recurrence)."
    status: pending
  - id: phase-5-docs-and-adr
    content: "Phase 5: Documentation. README in `packages/core/oak-eslint/`. ADR-or-PDR if the rule embodies a new architectural decision. TSDoc on the rule and on each helper function within it."
    status: pending
---

# `no-problem-hiding-patterns` ESLint Rule Reinstatement — Plan

**Plan id**: `no-problem-hiding-patterns-rule-reinstatement`
**Status**: future (queued; PR-87 architectural cleanup work proceeds first)
**Predecessor**: PR-87 architectural cleanup plan, Decision 1B (delete + reinstate)
**Source-of-truth principle**: `.agent/directives/principles.md` §"Don't hide problems — fix them or delete them"

---

## Context

On 2026-04-27 the Pelagic Flowing Dock session authored a custom ESLint rule `@oaknational/no-problem-hiding-patterns` to enforce `principles.md` §"Don't hide problems — fix them or delete them". The same session reproduced the morning's named drift pattern three times during rule authorship — softening the rule body or its message text exactly when applying the principle would have caused friction. Owner caught each instance.

At session-close, the rule was reverted to dormant code (registered in the plugin map, not enabled in any config tier). Owner direction at the next-session opening was: keep-and-activate-with-sweep OR delete cleanly — no half-measures. Opalescent Gliding Prism's session (2026-04-27 18:21Z) chose **delete cleanly + reinstate later**, citing:

- The audit at session-close was performed by the same agent who introduced the drift.
- Owner has named "no half measures, no adapters" — activating drift-authored work repo-wide propagates the design choices of the drift state into every workspace.
- Cure is fresh authorship from clean conditions, not activation of suspect work.

This plan owns the fresh authorship.

## Non-inheritances (load-bearing)

The deleted artefact (rule body, 15 test cases, sweep cures) **MUST NOT be inherited by this plan**. Specifically:

- Do NOT copy the rule body or any helper function from the prior implementation.
- Do NOT copy the prior 15 test cases. Re-derive test cases from `principles.md` text per archetype.
- Do NOT copy the prior sweep cures (the ~17 codegen-sweep file changes that were reverted at Pelagic close).
- Do NOT inherit the prior session's allowlist debate or the `__` Node.js convention exemption discussion. Those were drift artefacts; the principle is uniform.

The prior implementation may be consulted via `git log --all -- packages/core/oak-eslint/src/rules/no-problem-hiding-patterns.ts` for *informed-by-context* understanding only — not as starting code.

## Source of truth

`principles.md` §"Don't hide problems — fix them or delete them" names two patterns explicitly:

1. **`void <expr>` to silence unused-variable lint** is banned.
2. **Underscore-prefixing unused identifiers** (e.g. renaming `foo` to `_foo`) is banned.

Plus three concrete site-cures named in the principle text:

- Destructure-rest with unused capture → restructure so the value is not produced.
- Unused function parameter → use it or delete it from the signature.
- Value-bind only to satisfy a type checker → use `satisfies` directly on the value.

The principle also names the meta-rule: "no adapters, no compatibility layers, no half measures — those are themselves problem-hiding patterns dressed differently."

## Phase 1 — Re-derive matching scope from the principle

For each archetype the principle names, write a short narrative in this plan's Phase-1 section (added during execution) capturing:

- The archetype (e.g. `void <bare-identifier>` as expression statement).
- The cure (e.g. restructure so the binding is not produced).
- A failing test fixture in TypeScript syntax that the rule must flag.
- Any edge cases that LOOK like the archetype but are legitimate (e.g. `void Promise.resolve()` for fire-and-forget — different mechanism, different intent).

The output of Phase 1 is a written archetype catalogue, not code. **Owner review before Phase 2.**

## Phase 2 — TDD the rule

Per `principles.md` §"TDD". RED first: write the failing test for each archetype from Phase 1's catalogue. GREEN: minimum rule body that passes every test. REFACTOR: TSDoc the rule body with examples and the principle-text source for each branch.

Constraint: the rule body must NOT contain allowlists, exemptions, or shorthand-destructure exceptions. Property access on a field whose schema name has a leading underscore is unaffected (member expressions are not bindings); destructure produces a binding and IS in scope.

## Phase 3 — Activate and sweep

Activate the rule in `packages/core/oak-eslint/src/configs/recommended.ts`. Run `pnpm lint` repo-wide; the violation count is the sweep size.

**Discipline**: re-derive each cure from `principles.md` per-file. Per-site investigation. Narrate the cure aloud before applying. Serial only — no parallel agents under any condition during the sweep. Phase-boundary re-read of `principles.md` at every cluster boundary.

The sweep produces multiple commits, each scoped to one architectural shape (not "fix all S7686 sites in one commit", but "fix the unused-binding pattern in the codegen templates" or similar).

## Phase 4 — Reviewer dispatch

- `architecture-reviewer-fred` — ADR-024 (DI) alignment, rule-body discipline.
- `code-reviewer` — rule-body quality, idiomatic ESLint plugin patterns.
- `test-reviewer` — test coverage of every archetype.
- `assumptions-reviewer` — stress-test against drift recurrence (specifically: are any allowlists/exemptions creeping back in? Is the rule body matching the principle text exactly, or is it softer?).

Reviewers run in parallel; reviewer findings are action items by default per `principles.md`.

## Phase 5 — Documentation and ADR

- `packages/core/oak-eslint/README.md` — add the rule to the rule index with a one-paragraph description.
- ADR-or-PDR — if the rule embodies a new architectural decision (likely yes; the principle is a recent addition).
- TSDoc on the rule and on each helper function within it; cite `principles.md` §"Don't hide problems" in the rule's `@remarks`.

## Verification

- `pnpm lint:fix` repo-wide reaches 0 violations of the rule.
- `pnpm test` passes after rule reinstatement.
- `knip` does not flag stranded export.
- Reviewer findings absorbed in follow-up commits or rejected with written rationale.

## Risks

| Risk | Mitigation |
| --- | --- |
| Drift recurrence during rule authorship | Phase-boundary re-read of `principles.md`, triggered not remembered. Narrate friction aloud. Serial-only execution. Owner corrections treated as evidence of broader drift; audit recent work for the same shape after each correction. |
| Sweep cures inherit the deleted session's framing | Per-file re-derivation. Do not consult `git log --all -- <sweep-file>` for the prior cure as starting point. |
| Rule under-enforces or over-enforces | Phase 1 produces an archetype catalogue; owner-review before Phase 2 starts the rule body. |
| Sweep size discovers an architectural concern bigger than the rule | Pause sweep, surface concern, decide whether to fix at scale or split into a separate plan. Do not soften the rule to accommodate the concern. |

## Lifecycle

- Promote to `current/` when PR-87 architectural cleanup ships and owner is ready to schedule this work.
- Open a claim covering `packages/core/oak-eslint/` + the sweep pathspecs at execution start.
- Close the claim at execution-end; archive this plan to `archive/completed/` on landing.
