I can't sequence this yet because the contract isn't anywhere I can see.

The working directory (`<workspace>`) is empty, and the repo has no commits. Apart from git internals, the only file is `~/.gitconfig`. There's no specification or contract to sequence. The planning setup the skill relies on is missing too: the plan-node schema, the templates, the impact-areas registry and the directives aren't here.

I haven't written anything yet. The planning skill says not to make up a contract and plan around it. If I did, every step, test and proof would rest on guesses, and that's worse than no plan.

To go ahead I need one of these:

1. **The contract itself.** Paste it, or give me a path or repo where it lives. I need its obligations, conditions, failure behaviour and evidence plan. Once I have that I can set the order: fixtures and test harness first, then tests for each obligation before its implementation, then adverse and failure cases, then integration. Each slice will be sized as a single-story PR with a typed proof (checked by tests/CI in the repo, or verified by a named owner).
2. **Where the plan should live.** If this is meant to be a delivery node in an existing plan estate (`.agent/plans/delivery/`), point me at that repo. The node needs its `serves:` parent, impact areas and schema to be valid. If you just want a plain ordered checklist with no plan-node formalities, say so and I'll keep it light.

If the "settled" contract turns out to still have open obligations, I'll send those to `specify` first and schedule only the parts that are actually settled.
