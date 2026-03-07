# No Absolute Paths

All filesystem paths in the repo (documentation, plans, config, frontmatter, comments, example commands) MUST be relative: either relative to the repo root or relative to the file containing the path. No absolute paths (e.g. `/Users/...`, `C:\...`). Absolute paths expose usernames and local directory structure and do not resolve for other contributors or in CI.

See `.agent/directives/principles.md` §Code Design for the full policy.
