# Gate and Workspace Adoption Feedback

During OOCE's 2026-04-05 integration pass, two incoming notes carried the
strongest net-new value:

- `canonical-gate-and-strict-foundation.md`
- `shared-strictness-requires-workspace-adoption.md`

What landed locally:

- OOCE promoted the workspace-adoption lesson into a local pattern because it
  is broadly reusable beyond this exchange.
- OOCE captured the companion gate lesson in permanent engineering docs rather
  than Practice Core because the exact command topology and task graph remain
  repo-specific.

Concrete proof the notes were useful:

- They exposed a real honesty gap in OOCE: `agent-tools` participated in the
  repo-wide clean story descriptively, but `@oaknational/agent-tools` did not
  export `clean`.
- OOCE repaired that by adding `"clean": "rm -rf dist .turbo"` to
  `agent-tools/package.json`.

Suggested write-back value for `agent-collaboration`:

- Keep the two notes paired. The strictness note is the reusable pattern; the
  gate note is the local doctrine wrapper that keeps repo-wide claims honest.
- When teaching the lesson elsewhere, anchor it on executable task exports
  rather than on root-config presence alone.
