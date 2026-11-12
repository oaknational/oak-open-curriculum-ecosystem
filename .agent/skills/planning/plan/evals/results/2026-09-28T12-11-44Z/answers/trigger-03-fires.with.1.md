I can't write this plan yet because I don't have the scope it's supposed to be built from.

- **Your message had no scope attached.** You referred to "this ratified scope" but didn't include a document, ticket or plan.
- **The repository has nothing to plan from.** The working directory `<workspace>` is empty. Its parent holds only `.gitconfig` and a `.git` directory with no commits.
- **The planning files the skill relies on aren't here either.** There's no `.agent/plans/` directory. That means no plan-node schema, no templates, no impact-areas registry, and no strategic node for the plan to `serve`.

The skill says not to guess scope, intent or acceptance criteria, so I've stopped rather than make up a plan.

To go ahead I need:

1. **The scope itself:** paste it, or give me the path or ticket where it lives.
2. **Where it was ratified:** who approved it and where (a PR, ticket or decision record). This goes in `ratified_by`, `ratified_date` and `ratified_where`. Until the plan carries that record, it stays `status: sketch` and doesn't govern any work.
3. **Where the planning files are:** if they're in another repo, point me at it so I can read the schema, templates, impact-areas registry and the strategic node this plan serves.

If this repo is deliberately empty and you want a plan that doesn't depend on those files, tell me. I'll write a self-contained delivery plan with the goal, user groups and value, mechanism, acceptance criteria (each with a typed proof), validation, out-of-scope and todos. I'll clearly mark every field the missing schema would normally define as unverified.
