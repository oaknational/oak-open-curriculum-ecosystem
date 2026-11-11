I can't write a plan for this yet: the contract isn't anywhere I can see.

- **The working directory (`<workspace>`) is empty.** Git has no commits and no tracked files. The only untracked file is `../.gitconfig`.
- **The planning files the skill needs aren't here either.** It expects `.agent/plans/` with the plan-node schema, templates and impact-areas registry, plus `.agent/directives/`. Without them I can't fill in the plan's required frontmatter (`serves`, `impact_areas`) or have the validator check it.
- **There's no contract text.** The steps and tests depend on what it requires, and the skill rules out guessing or inventing a contract.

To go ahead I need:

1. **The contract itself:** a file path, a pasted spec, or a ticket reference.
2. **Where the plan should live:** the repo that holds `.agent/plans/`, if it's somewhere other than this directory.
3. **What it serves:** the strategic node this plan hangs off, if one exists.

Once I have the contract, I'll write a draft delivery plan (not yet approved, so it governs no work). Its steps will be one small PR each, in a fixed order. The contract's schema and types come first. Each requirement then gets its failing tests first and its implementation second, one slice at a time, ordered by what depends on what. Integration and edge-case tests come last. Each acceptance criterion will name the test or CI check that proves it.
