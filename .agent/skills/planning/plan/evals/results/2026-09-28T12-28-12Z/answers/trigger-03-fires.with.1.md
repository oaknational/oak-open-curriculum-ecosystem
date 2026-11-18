I can't write the plan yet, because I don't have the scope. You didn't paste or link it, and the working directory (`<workspace>`) is an empty repository with no commits. There's no scope document, strategic node, ticket, or plan estate (`.agent/plans/`, schema, templates, impact-area registry) for me to read.

I won't guess the scope. The acceptance criteria and their proofs have to come from what the owner actually ratified, so a made-up scope would produce a plan that looks valid but has nothing behind it.

To go ahead, I need:

1. **The scope itself.** Paste it, give a file path, or point to the ticket or PR where it lives.
2. **Where it was ratified.** I need the owner's approval and a pointer to it. The plan will still start as a `sketch`. This pointer shows the scope is settled, so I can build on it rather than reopen it.
3. **The plan estate.** Tell me where the repo containing `.agent/plans/` is (plan-node schema, templates, `impact-areas.md`), and which strategic node this work serves. If this directory is meant to be that repo, it's currently empty.

Once I have the scope, I'll check the node type (delivery vs runbook). Then I'll write the full body: goal, user groups and value, mechanism, and acceptance criteria, each with a `repo-safe` or `owner-held` proof. After that come out of scope, `depends_on` classifications, and owner gates with absolute expiry dates. Last, I'll add todos split into single-PR slices.
