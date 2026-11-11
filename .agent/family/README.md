# The family layer

The Practice has five layers (PDR-143): general, family, contextual, accumulated and the loop.
This directory holds the family layer's declared conventions for the tooling family this
repository belongs to, and the one contextual file that binds those conventions to this host.

- `<family>/practice-operations.json` is the family's manifest: every Practice-operation root
  script with its body, the `check` skeleton with its two host slots, the family legs each
  aggregate must start with, the hook files, the CI fan-in job, the compiler base flags, the
  formatter and the package manager. `{scope}` and `{skill_prefix}` are the host placeholders.
- `<family>/hooks/` holds the family's copies of the git hook bodies; the host's `.husky/` files
  must be byte-identical to them.
- `.agent/practice-core/schemas/family-conformance.schema.json` is the JSON Schema the manifest
  and `host.json` are validated against before any comparison runs.
- `host.json` holds this host's values for the placeholders. It is the one file here that
  differs by host.

The manifest is a declaration, never a record: the family-conformance validator, a leg of
`repo-validators:check`, recomputes every item from the live tree at every run and names each
drift. Every file here except `host.json` is the same bytes in every repository of the family.
