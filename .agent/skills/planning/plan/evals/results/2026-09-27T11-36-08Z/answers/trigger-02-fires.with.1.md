I couldn't write a plan yet because I can't find the contract. The working directory (`<workspace>`) is empty, and the repository around it has no commits. All it holds is an untracked `.gitconfig`.

The planning skill also expects files that aren't here: the plan-node schema, the node templates, the impact-areas list and the directives (`principles.md`, `testing-strategy.md`, `schema-first-execution.md`). Without them I can't write a node the estate validator would accept, and I'd be guessing at scope and acceptance criteria.

To sequence the work I need:

1. **The contract.** Its file path, or paste the specification or interface definition. I'll treat it as settled, meaning obligations, failure behaviour and planned evidence are already decided.
2. **Where the plan should live.** The path to the repo that has `.agent/plans/` (schema, templates, impact areas). Or confirm there isn't one, and I'll write a lighter plan that doesn't follow the estate format.
3. **Its parent node.** The strategic node this delivery plan serves, if one exists.

Once I have the contract, my default is a test-first order. Each obligation becomes one slice sized to go through review in a single pass: write the failing tests from the contract's evidence plan, add the smallest implementation that passes them, then cover the failure behaviour and edge cases. Any integration or owner-verified proof comes last. The plan will start as a `sketch` and won't govern any work until you ratify it.
