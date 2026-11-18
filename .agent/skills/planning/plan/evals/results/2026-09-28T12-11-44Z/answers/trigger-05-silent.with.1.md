I can't identify "this component" yet. The working directory (`<workspace>`) is empty. The repository around it has no commits and contains only a `.gitconfig`, so there's no code, schema, tests or documentation to read, and nothing to base a specification on.

If I wrote one anyway, I'd be inventing both the component and its obligations. That would produce a record with no real authority behind it.

To write it, I need:

1. **The component.** A file or directory path, a repository to clone, or pasted source, interface or schema. If it doesn't exist yet, a short description of what it is and what it's for works too.
2. **What the specification is for.** Discussion, building it, integrating it with something else, running it in production, or backing a specific claim. This decides how much detail and evidence the specification needs.
3. **Any existing material.** A README, API definition, tests, tickets or design notes. The specification should link to these rather than duplicate them.
4. **Who has the final say.** Who can accept an obligation or a trade-off (you, a team, an external standard).

If you only have an idea for the component, one sentence on what it should do and who relies on it is enough to start. I'll write one concrete success case and the ways it can fail first, then build the obligations from those.
