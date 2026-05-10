# Official MCP App Skills

How to install and use the official MCP App skills from the
`modelcontextprotocol/ext-apps` repository.

## Installation

Install all four official MCP App skills via the open skills CLI:

```bash
npx skills add modelcontextprotocol/ext-apps --yes
```

This installs to `.agents/skills/<id>/` (the portable cross-tool path,
unprefixed). The installer auto-detects supported agent platforms
(Claude Code, Cursor, Codex, Gemini CLI, etc.) and surfaces each skill
through whichever discovery path that platform reads.

Do **not** vendor these into `.agent/skills/` or generate `jc-`
prefixed adapters for them. Per PDR-051, ingested skills retain their
upstream identity in adapters and receive no local prefix; the
`skills-adapter-generate` pipeline is owned-skill-only.

## Available skills

| Skill | Purpose |
|-------|---------|
| `create-mcp-app` | Scaffold a new MCP App with interactive UI |
| `add-app-to-server` | Add MCP App UI to an existing MCP tool |
| `convert-web-app` | Convert a web app to an MCP App resource |
| `migrate-oai-app` | Migrate from the OpenAI Apps SDK to MCP Apps |

## Routing

The `mcp-expert` skill (`.agent/skills/mcp-expert/SKILL-CANONICAL.md`)
remains the entry point for active MCP expertise in this repo. It does
not duplicate the upstream skills' content; when an upstream skill
covers the task, the working agent invokes it directly via its
unprefixed slash name.

## Updating

Re-run the installer:

```bash
npx skills add modelcontextprotocol/ext-apps --yes
```

It overwrites the `.agents/skills/<id>/` entries with the latest
upstream content. No further wrapper-restoration step is required.

## API documentation

- API reference: <https://apps.extensions.modelcontextprotocol.io/api/>
- React hooks: <https://apps.extensions.modelcontextprotocol.io/api/modules/_modelcontextprotocol_ext-apps_react.html>
- Server module: <https://apps.extensions.modelcontextprotocol.io/api/modules/server.html>
- Quickstart: <https://apps.extensions.modelcontextprotocol.io/api/documents/quickstart.html>
- Agent skills guide: <https://apps.extensions.modelcontextprotocol.io/api/documents/agent-skills.html>
- Stable spec: <https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx>

## History

A previous attempt managed these skills by canonicalising them into
`.agent/skills/`, recording entries in `skills-lock.json`, and emitting
`jc-`-prefixed adapters. That pattern was removed: it duplicated
upstream content statically, drifted under the unprefixed-ingested
rule of PDR-051, and required a custom installer that was never built.
The current path is `npx skills add` directly into `.agents/skills/`.
