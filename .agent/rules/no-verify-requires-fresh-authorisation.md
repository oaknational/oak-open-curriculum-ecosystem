# --no-verify Requires Fresh Authorisation

Operationalises [`.agent/directives/principles.md` § Code Quality](../directives/principles.md) — *"Never disable any quality gates, never disable Git hooks (`--no-verify`)"*.

NEVER pass `--no-verify` (or any equivalent hook-skip flag — `--no-pre-commit`, `HUSKY=0`, `SKIP_HOOKS=1`, etc.) to `git commit`, `git push`, or any other Git operation that would normally trigger a pre-commit, commit-msg, pre-push, or post-commit hook.

**Authorisation is per-invocation, not per-session.** A prior owner approval to skip hooks does not authorise the next skip. Each `--no-verify` invocation requires fresh, explicit, in-the-moment owner authorisation naming this specific commit or push.

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
