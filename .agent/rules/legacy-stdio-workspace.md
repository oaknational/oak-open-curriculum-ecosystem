# Legacy STDIO Workspace

`apps/oak-curriculum-mcp-stdio` is a legacy transitional workspace.

Do not plan or implement new feature work, product-surface evolution, or
transport strategy changes in this workspace.

Allowed work is limited to:

- strictly necessary transitional maintenance for existing local stdio users
- documentation that clarifies the legacy status and migration path
- deletion or migration work that helps consolidate stdio support into
  `apps/oak-curriculum-mcp-streamable-http`

If a request targets new behaviour in `apps/oak-curriculum-mcp-stdio`, stop and
redirect the change to the HTTP workspace and shared SDK layers unless the user
explicitly wants temporary transitional maintenance only.

Delete this rule once `apps/oak-curriculum-mcp-stdio` is removed from the
repository.

See
`docs/architecture/architectural-decisions/128-stdio-workspace-retirement-and-http-transport-consolidation.md`.
