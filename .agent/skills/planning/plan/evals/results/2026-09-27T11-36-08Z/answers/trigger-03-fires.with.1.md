I can't write the plan yet because I don't have the ratified scope. Your message says "this ratified scope" but doesn't include one, and the working directory (`<workspace>`) is an empty git repo. It has no commits, no `.agent/plans/` estate, no plan-node schema and no templates.

Please paste or point me to:

1. **The ratified scope**, or its file path. I'll also need where the owner's ratification lives (PR, ticket or thread), so the plan's ratification stamp can point to it.
2. **The plan estate**, if it lives in another repo: the path to `.agent/plans/` (schema, templates, impact-areas registry) and the strategic node this plan serves. If this is a standalone plan with no estate, say so and I'll use the plan-node structure without the validator's frontmatter.

Once I have the scope, the plan will include:
- **Goal and mechanism:** the outcome it's after, and why the chosen approach produces it.
- **User groups and value:** who gets the outcome and what it gives each of them.
- **Acceptance criteria:** each tied to a proof. Proofs are either tests or CI checks the repo can run (naming the instrument), or states only the owner can verify (naming who checks and where the dated observation is recorded).
- **Validation sequence:** the order in which the proofs get run.
- **Out of scope:** what the plan will not do.
- **Todos:** sliced so each one fits in a single pull request.
- **Dependencies and owner gates:** each dependency marked blocking or beneficial, each gate with an absolute expiry date.

The plan will start as a sketch, and I'll raise any points in the scope that are still unclear rather than guess at them.
