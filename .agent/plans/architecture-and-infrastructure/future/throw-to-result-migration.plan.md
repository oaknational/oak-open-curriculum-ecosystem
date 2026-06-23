---
name: "Throw → Result Migration and no-throw-statement Promotion"
overview: "Retrofit the repository's existing throw sites to the Result pattern (ADR-088 / use-result-pattern) and promote the front-loaded @oaknational/no-throw-statement ESLint rule from warn to error. Owner named the agent-tools throw-convention an oversight (2026-06-14); the enforcement rule was front-loaded at warn the same day, surfacing the existing-throw scope (211 in agent-tools alone). This lane closes the standard."
todos:
  - id: exemption-profile
    content: "Design the rule's false-positive profile before escalation: test files (legitimate throws / expect.fail), and the sanctioned boundary-translation pattern (a library that cannot return Result, wrapped to a Result at one named edge). Decide config-level file-scoping vs rule options vs per-site disable-with-reason (composes with @oaknational/no-eslint-disable)."
    status: pending
  - id: retrofit-agent-tools
    content: "Retrofit agent-tools throw sites to Result (211 surfaced 2026-06-14: collaboration-json-validation.ts, repo-root.ts, the CLI surface, etc.). Behaviour-preserving but TDD'd — throw→err changes caller handling, so each site is a test-first cycle, not a sweep."
    status: pending
  - id: retrofit-other-workspaces
    content: "Retrofit remaining workspaces' throw sites by count (re-derive repo-wide at execution: `pnpm lint 2>&1 | grep -c no-throw-statement`). Apps/SDKs/packages already largely follow Result; the residue is the target."
    status: pending
  - id: oak-eslint-self-lint-gap
    content: "Close the coverage gap config-expert flagged: packages/core/oak-eslint self-lints with a bespoke config (raw tseslint, not @oaknational/eslint-plugin-standards), so its own throws (e.g. boundary.ts:199, the zod .parse in createMessage) never surface under no-throw-statement. Either wire the plugin's self-lint through the rule or retrofit those sites explicitly."
    status: pending
  - id: promote-warn-to-error
    content: "Once 0 no-throw-statement warnings remain (or all residual throws are sanctioned via disable-with-reason on the frozen profile), escalate '@oaknational/no-throw-statement' from 'warn' to 'error' in configs/recommended.ts (the no-warning-toleration §rule-authoring-nuance promotion point). Update the wiring comment."
    status: pending
isProject: false
---

# Throw → Result Migration and `no-throw-statement` Promotion

**Created**: 2026-06-14 (Serval mends Murmur), under owner direction (option B: front-load
enforcement at `warn` now, bulk retrofit follows as a lane).

## Problem and intent

The repository standard (ADR-088 / [`use-result-pattern`](../../../rules/use-result-pattern.md))
is "never throw; errors are part of the type signature." The owner clarified (2026-06-14) that
`agent-tools` throwing instead of returning `Result` was an **oversight**, not a sanctioned local
convention, and that it "must be held to the same high standards as everything else." First-hand
audit found the gap is broader: there is no `no-throw`/`use-Result` lint rule anywhere — the pattern
was doctrine enforced largely by review, so non-conforming code accumulated (notably in
`agent-tools`, which predates Result adoption here).

A new custom rule `@oaknational/no-throw-statement` was front-loaded at `warn` (live repo-wide via
`recommended`→`strict`) the same day, surfacing the scope without blocking the gate. This lane
completes the standard: retrofit the surfaced throws to `Result`, then promote the rule to `error`.

## End goal, mechanism, means

- **End goal**: every production `throw` either replaced by a `Result` return or, at a genuine
  library boundary that cannot return `Result`, translated to a `Result` at one named edge (with a
  `disable-with-reason` on the residual); `@oaknational/no-throw-statement` at `error`; the standard
  enforced structurally, not just documented.
- **Mechanism**: the `warn` rule makes the full scope visible and prevents *new* non-conforming code
  from landing unnoticed; the retrofit migrates the existing surface under that visibility; the
  `warn`→`error` escalation locks it (the no-warning-toleration §"Scope and exceptions"
  rule-authoring promotion point named in `configs/recommended.ts`).
- **Means**: the frontmatter todos — design the exemption/false-positive profile, retrofit
  agent-tools, retrofit the remaining workspaces by count, close the `oak-eslint` self-lint gap,
  then promote.

## Domain boundaries and non-goals

- **Not WS7** (the comms-corpus rotation lane). WS7's own new code already meets the standard
  (Result-native); this lane is the separate, owner-sequenced follow-on.
- **Behaviour-preserving but test-first**: a `throw`→`err` change moves error handling from the
  call stack into the return type, which changes every caller — each site is a TDD cycle, never a
  mechanical sweep.
- Does **not** modify `@oaknational/result` itself.
- Does **not** re-open the Result mandate or the `warn`-first start (both owner-decided).

## Dependencies and sequencing

- **Blocking**: none — the `warn` rule is already live, so the scope is visible now.
- **Beneficial**: WS7 lands first (owner sequencing, 2026-06-14) so the rotation work is not
  derailed; the retrofit then proceeds workspace-by-workspace.

## Strategic acceptance criteria and success signals

- `pnpm lint` reports **0** `@oaknational/no-throw-statement` warnings repo-wide (or every residual
  is a sanctioned `disable-with-reason` on the frozen profile).
- `@oaknational/no-throw-statement` is wired at `error` in `configs/recommended.ts`.
- All quality gates green; no runtime behaviour regression (proven by the per-site TDD cycles).

## Risks and unknowns

- **Surface size**: 211 in agent-tools alone; the repo-wide count is unmeasured (re-derive at
  execution). The retrofit is sizeable.
- **Boundary classification**: distinguishing genuine boundary translations (sanctioned) from
  throws that should become `Result` returns requires judgement per site.
- **Caller fan-out**: each retrofitted throw changes its callers' handling; missed callers are a
  correctness risk the per-site tests must catch.

## Promotion trigger into `current/`

Owner promotes after WS7 completes (owner sequencing, 2026-06-14). On promotion, re-derive the
repo-wide throw count, mine these todos into per-workspace executable TDD cycles, and confirm the
exemption profile with `config-expert` before the `warn`→`error` escalation.
