I can't write this plan yet because I can't find the contract to plan against.

The working directory (`<workspace>`) is empty. The repository around it has no commits and contains only a `.gitconfig` and git metadata. That means:

- **No contract.** I couldn't find a specification, API contract, schema or ADR to sequence work for.
- **No plan setup.** The planning skill expects a plan schema, templates, a list of allowed impact areas and a strategic plan for new work to serve. None of these exist here, so I can't produce a plan that passes its checks.

I haven't created any files. I'd have to guess the scope, the contract's obligations and the acceptance criteria, and a plan built on guesses wouldn't be worth ratifying.

To go ahead, I need:

1. **The contract.** Either its file path (it may be in a different repo or directory) or the text pasted here. I need its obligations, conditions, failure behaviour and evidence plan.
2. **The repo the plan belongs in.** This should be the one containing `.agent/plans/` with the schema and templates. If this is meant to be a new, standalone repo, tell me, and I'll write a self-contained plan document instead.
3. **The strategic plan it serves**, if there is one.

Once I have the contract, the default order is: types and schema first, then failing tests for each obligation (the normal case first, then the failure cases), then the implementation, one reviewable pull request per slice. Each acceptance criterion will be tied to the test that proves it.
