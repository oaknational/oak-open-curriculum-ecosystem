# --no-verify Requires Fresh Authorisation

Operationalises [`.agent/directives/principles.md` § Code Quality](../directives/principles.md) — *"Never disable any quality gates, never disable Git hooks (`--no-verify`)"*.

NEVER skip Git hooks. The prohibition is on the **act of skipping hooks**, not on any single flag spelling. Concretely, this covers (non-exhaustive):

- `--no-verify` / `-n` on `git commit` or `git push`
- `--no-pre-commit`, `--no-commit-msg`, `--no-post-commit`
- `--no-gpg-sign` / `--no-edit` when those bypass a hook-driven check
- `HUSKY=0`, `SKIP_HOOKS=1`, `LEFTHOOK=0`, or any equivalent env-var hook-skip
- `git -c core.hooksPath=/dev/null …` or `git -c core.hooksPath=…` pointed at any empty / no-op directory
- `GIT_HOOKS_PATH` environment override to a no-op location
- deleting, renaming, or chmod-ing `.husky/` (or `.git/hooks/`) to disarm hooks
- any future Git flag, env var, config setting, or filesystem manipulation that has the effect of preventing hooks from running

If the repo's hook policy refuses one mechanism (e.g. blocks `--no-verify`), **that refusal is a second signal to stop and surface**, not an obstacle to route around with a different mechanism. Reaching for a less-named workaround after a named one is refused reproduces the exact failure mode this rule blocks.

**Authorisation is per-invocation AND per-mechanism, not per-session.** A prior owner approval to skip hooks does not authorise the next skip. Owner authorisation binds to *this commit, with hooks skipped* — the syntax used to achieve the skip is the agent's responsibility, and any mechanism above counts as a skip whether the owner's authorisation language named that specific spelling or not.

If a hook is failing:

1. **Fix the cause.** The hook is failing because something is wrong. Find what.
2. **If the hook itself is wrong**, fix the hook (or the upstream config). Do not bypass it.
3. **If you genuinely cannot fix the cause now**, surface the failure to the owner with a named reason and ask for a per-invocation authorisation. Do not invent a "this one is fine" exception.

The point of pre-commit hooks is precisely to be unskippable by the agent. Skipping them silently re-introduces the failure mode the hook was installed to prevent.

## Why this rule exists

Quality-gate hooks are the operational arm of the principles in `.agent/directives/principles.md` § Code Quality. The principle prohibits `--no-verify` in foundational language. This rule converts the prohibition from passive guidance into a per-invocation gate: the agent has no implicit authority to skip a hook, regardless of how confident it is that the skip is harmless.

The pattern this rule blocks: agent encounters a hook failure, judges the failure low-stakes, skips the hook, commits anyway. Even when each individual judgement is defensible, the cumulative effect is that hooks become advisory rather than blocking. Per-invocation owner authorisation forces the friction back into the loop, which is the whole point.

## Related surfaces

- **Principle**: [`.agent/directives/principles.md` § Code Quality](../directives/principles.md) — the originating prohibition.
- **PDR-025**: [`.agent/practice-core/decision-records/PDR-025-quality-gate-dismissal-discipline.md`](../practice-core/decision-records/PDR-025-quality-gate-dismissal-discipline.md) — broader doctrine on quality-gate dismissal authority.
- **PDR-008**: [`.agent/practice-core/decision-records/PDR-008-canonical-quality-gate-naming.md`](../practice-core/decision-records/PDR-008-canonical-quality-gate-naming.md) — gate taxonomy.
