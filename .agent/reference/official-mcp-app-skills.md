# Official MCP App Skills

How to install and integrate the official MCP App skills from the
`modelcontextprotocol/ext-apps` repository into this monorepo's
multi-platform skill system.

## Installation

Install all 4 official MCP App skills:

```bash
npx skills add modelcontextprotocol/ext-apps --yes
```

This installs to `.agents/skills/` (the universal/Codex-standard
path). The installer auto-detects supported agent platforms
(Claude Code, Cursor, Codex, Gemini CLI, etc.) and creates
platform-appropriate entries.

## Installed Skills

| Skill | Path | Purpose |
|-------|------|---------|
| `create-mcp-app` | `.agents/skills/create-mcp-app/` | Scaffold a new MCP App with interactive UI |
| `add-app-to-server` | `.agents/skills/add-app-to-server/` | Add MCP App UI to an existing MCP tool |
| `convert-web-app` | `.agents/skills/convert-web-app/` | Convert a web app to MCP App resource |
| `migrate-oai-app` | `.agents/skills/migrate-oai-app/` | Migrate from OpenAI Apps SDK to MCP Apps |

## Multi-Platform Integration

This repo uses a three-layer agent artefact architecture (ADR-125):

1. **Canonical content** in `.agent/` (portable, platform-agnostic)
2. **Platform adapters** in `.cursor/`, `.claude/`, `.agents/`, etc.
3. **Entry points** (`CLAUDE.md`, `AGENTS.md`, etc.)

The official MCP App skills are installed as **upstream content** in
`.agents/skills/`. They are NOT duplicated into `.agent/skills/` —
instead, our routing layer (`mcp-expert` skill) points directly to
the `.agents/skills/` path. This avoids fork drift: when the upstream
skills are updated, re-running the installer brings the latest
versions without needing to manually sync custom copies.

### Routing

The `mcp-expert` skill (`.agent/skills/mcp-expert/SKILL.md`) is the
entry point for all MCP expertise. Its capability routing table
directs to the official upstream skills for specific MCP App tasks.

### Updating

To update to the latest version of the official skills:

```bash
npx skills add modelcontextprotocol/ext-apps --yes
```

This overwrites the existing `.agents/skills/` entries with the
latest upstream content.

## API Documentation

The official MCP Apps SDK documentation is at:

- API reference: <https://apps.extensions.modelcontextprotocol.io/api/>
- React hooks: <https://apps.extensions.modelcontextprotocol.io/api/modules/_modelcontextprotocol_ext-apps_react.html>
- Server module: <https://apps.extensions.modelcontextprotocol.io/api/modules/server.html>
- Quickstart: <https://apps.extensions.modelcontextprotocol.io/api/documents/quickstart.html>
- Agent skills guide: <https://apps.extensions.modelcontextprotocol.io/api/documents/agent-skills.html>
- Stable spec: <https://github.com/modelcontextprotocol/ext-apps/blob/main/specification/2026-01-26/apps.mdx>

## History

This repo previously maintained 4 custom Oak-specific skill variants
(`mcp-create-app`, `mcp-add-ui`, `mcp-convert-web`, `mcp-migrate-oai`)
in `.agent/skills/`. These were removed in favour of the official
upstream skills because the upstream versions are more comprehensive,
more current, and maintained by the MCP Apps team. Oak-specific
migration context (coupling inventory, CSP field mapping) is preserved
in the archived migration plans at
`.agent/plans/sdk-and-mcp-enhancements/archive/completed/`.
