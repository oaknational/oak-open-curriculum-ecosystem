# Hook-Policy TypeScript Migration and Schema Unification — Strategic Plan

**Status**: Future (not started)
**Collection**: agent-tooling
**Thread**: [`agentic-engineering-enhancements`](../../../memory/operational/threads/agentic-engineering-enhancements.next-session.md)
**Related**:
[ADR-038 (Compilation-Time Type Embedding)](../../../../docs/architecture/architectural-decisions/038-compilation-time-type-embedding.md);
[`principles.md` §No shims, no hacks, no workarounds](../../../directives/principles.md);
[PDR-038 (Stated Principles Require Structural Enforcement)](../../../practice-core/decision-records/PDR-038-stated-principles-require-structural-enforcement.md);
[`hook-policy-substring-discipline`](../../../rules/hook-policy-substring-discipline.md)

## Problem and Intent

The agent-hook policy is authored as JSON at `.agent/hooks/policy.json` and
loaded at runtime by `agent-tools/src/hook-policy/`. Three weaknesses compound:

1. **No author-time type checking.** JSON has no `satisfies`, so an invalid
   entry shape is only discovered when the guard crashes at runtime.
2. **Inconsistent entry shapes.** The Bash `preToolUse.blocked_patterns` accept
   an object form (`pattern`, `concept`, `citation`, `reappraisal`, optional
   `match`); the content `preToolUseContent.blocked_patterns` accept only bare
   `string[]`; `scoped_blocks` use a third, richer object. An author cannot tell
   from the file which shape a given list takes.
3. **DRY violation.** The object entries repeat `concept` / `citation` /
   `reappraisal` per pattern — e.g. the six `history-destruction` /
   `worktree-destruction` git entries each restate the same reappraisal.

**Worked instance (2026-06-15).** An author added object-form entries to the
content `blocked_patterns` (which is `string[]`). The content guard's loader
threw at runtime; per the guard shim's deliberate *present-but-broken →
fail-closed* contract, every subsequent Edit/Write was blocked — including the
edit that would fix the policy. Recovery required either `git checkout`
(owner-forbidden) or manual IDE surgery, because there is **no safe transient
bypass**. This was the trigger for this plan.

## End Goal, Mechanism, and Means

**End goal.** A hook policy that (a) cannot be authored into an invalid shape,
(b) reads DRY and is grouped by intent, and (c) is recoverable from a malformed
state without history surgery.

**Mechanism.**

- **TypeScript + `satisfies`.** Move the policy to a TS module exporting a const
  `satisfies HookPolicy`. An invalid shape becomes a type error at author/
  type-check time, not a runtime crash that bricks the guard (the ADR-038
  compile-time-embedding posture applied to the policy surface). Zod is not
  required: the policy is first-party trusted source, not external input, so the
  type contract + `satisfies` is sufficient — runtime re-validation would be
  redundant.
- **One shape only.** Drop the bare-string union; every entry is the object
  form. A single shape cannot be confused for another.
- **Group by intent.** Each entry carries an `id`, `concept`, `citation`,
  `reappraisal`, and a `patterns: string[]` array. The repeated git entries
  collapse into one group per intent (`history-destruction`, `gate-bypass`,
  `worktree-destruction`, `stash-discard`, `wildcard-staging`,
  `host-dos-unbounded-load`).
- **Transient recovery bypass.** An env var
  `DANGEROUSLY_DISABLE_FORBIDDEN_PHRASES__DO_NOT_USE_THIS`, checked **before
  policy load** so it can recover a malformed policy, scoped to the
  phrase/content checks **only** (never the dangerous-git-command guards),
  logged loudly to `hook-errors.log` on every use. "Transient only" is enforced
  structurally by a repo-validator that **fails if the var appears in any
  tracked settings or env file** — it can be set inline for one operation but
  never persisted.

**Means (strategic moves; finalised at promotion).**

1. Define the `HookPolicy` TS type (intent-grouped, object-only, `id` +
   `patterns[]`).
2. Migrate `policy.json` → `policy.ts` (`satisfies HookPolicy`); decide how the
   loaders and the build-free `.claude/hooks/run-pretooluse-guard.mjs` shim
   consume a typed const versus the current runtime JSON read.
3. Refactor `policy-loader.ts`, `matchers.ts`, `types.ts` to the unified shape;
   update the hook-policy unit and integration tests.
4. Collapse the repeated Bash entries into intent groups with `patterns[]`.
5. Add the env-var transient bypass + the no-persist repo-validator.
6. Re-add the **workaround / root-cause-avoidance** content detection (carried
   forward from the 2026-06-15 session) as one intent group in the new shape:
   patterns `a workaround`, `workaround for`, `band-aid`, `kludge`, `hacky`,
   `paper over`; `include_paths` `.agent/`, `docs/`; the `exclude_paths` keep
   the naming-surfaces out of scope by design (`principles.md`, `experience/`,
   `distilled.md`, `archive/`, tests, `.agent/hooks/`); the step-back-and-reflect
   reappraisal direction.

## Domain Boundaries and Non-Goals

- **Non-goal**: changing the guard shim's fail-closed-on-broken-build / fail-open-on-missing-build contract (it is correct; this plan removes the *cause* of the broken state, not the contract).
- **Non-goal**: adding blocked concepts beyond the carried-forward workaround group.
- **Non-goal**: Zod runtime validation of the policy (first-party source; `satisfies` is the contract).
- **Non-goal**: migrating other config files to TS in this plan.

## Dependencies and Sequencing

- No `blocking` prerequisites. The work is self-contained in `agent-tools/src/hook-policy/` plus `.agent/hooks/`.
- `beneficial`: the sibling [cspell-quality-gate](./cspell-quality-gate.plan.md) plan is independent; neither blocks the other.

## Strategic Acceptance Criteria and Success Signals

- An invalid policy entry shape is a **type-check** failure, not a runtime crash (demonstrated by a deliberately-wrong fixture that `tsc` rejects).
- The policy reads DRY: no `concept`/`citation`/`reappraisal` is repeated across sibling patterns of one intent.
- A malformed-policy deadlock is recoverable: with the env var set, a guarded Edit proceeds; a test proves it.
- The no-persist validator fails when the env var is planted in a tracked settings/env file.
- The workaround detection denies a using-frame write and allows a naming-frame write (end-to-end probe), without breaking the existing owner-approval-marker and dangerous-git-command guards.

## Risks and Unknowns

- **Loader consumption change.** Moving from a runtime JSON read to importing a typed const affects the build-free shim and the dist build path. The shim is build-free *by necessity* (it is the failsafe for a missing build) — the policy data must remain reachable without the dist, or the recovery posture changes. This is the central design question to resolve at promotion.
- Over-broad content patterns risk firing on legitimate anti-pattern naming; mitigated by scoping the guard to working prose (`exclude_paths` keeps the naming-surfaces out of scope by design) and by the reappraisal model (stop and reflect, not hard-forbid).

## Promotion Trigger

Owner prioritisation, OR a second instance of policy shape-confusion / a malformed-policy deadlock, OR the next time the workaround detection is needed. Execution decisions (loader consumption mechanics, exact env-var enforcement) finalise only at promotion to `current/`.
