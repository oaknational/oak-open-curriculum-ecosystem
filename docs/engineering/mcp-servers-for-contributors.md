---
fitness_line_target: 140
fitness_line_limit: 200
fitness_char_limit: 9000
fitness_line_length: 100
split_strategy: 'Keep this surface concise. Per-server detail belongs in the linked rule files (.agent/rules/) or vendor docs. Add a server only when it is part of the sanctioned working set; remove when retired.'
---

# MCP Servers for Contributors

The set of Model Context Protocol (MCP) servers a contributor working with an
AI coding agent (Claude Code, Cursor, Codex, Gemini CLI, Copilot, Windsurf)
should enable when working in this repository. The list is curated and
sanctioned at the team level; per-agent personal extras are out of scope.

This is the _contributor-facing_ MCP surface. The repository also publishes
its own MCP server for end users — see the
[HTTP MCP server workspace](../../apps/oak-curriculum-mcp-streamable-http/README.md).

## Sanctioned servers

| Server                              | Purpose                                                                    | How to enable                                                                                                                                            |
| ----------------------------------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **SonarQube**                       | Code quality and security scanning aligned with Oak's SonarQube project    | `/sonarqube:sonar-integrate` (Claude Code) installs the CLI and integration; ask the team for the project access token                                   |
| **Vercel**                          | Deployments, environment variables, build logs for Oak-hosted apps         | Project-scoped Vercel MCP plugin, signed in to the Oak Vercel team. **The Vercel CLI is forbidden** — the project-scoped MCP is the only sanctioned path |
| **Sentry (Oak Open Curriculum)**    | Sentry issues, events, releases, and Seer for the Open Curriculum projects | Sentry MCP plugin authenticated against the Oak Sentry organisation; ask the team for org access                                                         |
| **GitHub**                          | PRs, issues, reviews, branches                                             | GitHub MCP plugin authenticated via `gh auth login`; works against the standard Oak GitHub access                                                        |
| **Oak local dev**                   | Local-dev introspection while a workspace dev server is running            | Runs alongside `pnpm dev` from the workspace; no extra credentials required                                                                              |
| **Oak National Academy public MCP** | Read-only Oak curriculum data via the public MCP server                    | No setup; available to any agent that supports MCP                                                                                                       |

## Forbidden / out-of-scope tooling

- **Vercel CLI** — never use directly. All Vercel operations go through the
  project-scoped MCP plugin. See the relevant rule under
  [`.agent/rules/`](../../.agent/rules/) and the per-user feedback memory.

## Verifying setup

There is no single command that lists active MCP servers across all agent
platforms. Each agent surfaces them differently:

- **Claude Code**: `/mcp` lists active servers and their auth state
- **Cursor**: MCP settings panel
- **Codex / Gemini CLI / Copilot / Windsurf**: per-platform configuration files

If a tool call to a sanctioned server fails with an authentication error, the
first action is to re-authenticate that server, not to bypass it.

## When to update this document

Add a server when it becomes part of the sanctioned working set. Remove a
server when it is retired or replaced. Per-server _operational_ detail
(token rotation, troubleshooting, advanced flags) belongs in the relevant
rule file, vendor docs, or a dedicated runbook — not here.
