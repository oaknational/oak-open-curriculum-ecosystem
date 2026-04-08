---
name: "MCP Server Info Branding"
overview: "Add title, description, icons, and websiteUrl to the MCP server Implementation object. Blocking for PR #76 merge."
specialist_reviewer: "mcp-reviewer, code-reviewer"
isProject: false
todos:
  - id: t1-server-info
    content: "Add title, description, icons, and websiteUrl to McpServer constructor in application.ts"
    status: done
  - id: t2-oak-logo-data-uri
    content: "Generate Oak logo SVG data URIs for light and dark themes"
    status: done
  - id: t3-tool-titles
    content: "Audit all tools — ensure annotations.title is human-friendly (not kebab-case tool name)"
    status: done
  - id: t4-tool-top-level-title
    content: "Add top-level title field to generated tools (spec 2025-11-25 BaseMetadata)"
    status: done
  - id: t5-test-update
    content: "Update E2E test to verify serverInfo fields in initialize response"
    status: done
  - id: t6-resource-prompt-titles
    content: "Audit resources and prompts for human-friendly title fields"
    status: done
---

# MCP Server Info Branding

**Status**: DONE — all tasks complete, pending `pnpm check` + reviewer sign-off
**Last Updated**: 2026-04-08
**Branch**: `feat/mcp_app_ui`

## Context

The MCP server presents itself to hosts (Claude Desktop, Cursor, ChatGPT,
MCPJam) with only `name: 'oak-curriculum-http'` and `version: '0.1.0'`.
The 2025-11-25 spec added `title`, `description`, `icons`, and `websiteUrl`
to the `Implementation` schema. The SDK v1.28.0 already supports these.

Every MCP host renders server info in its UI. Without branding, the Oak
server appears as a generic technical identifier.

## Decision

Add full branding metadata to the server `Implementation` object and audit
all tools, resources, and prompts for human-friendly naming.

## Tool naming fields (MCP spec)

The spec provides two distinct naming surfaces:

| Field | Location | Purpose | Audience |
|-------|----------|---------|----------|
| `name` | `Tool.name` | **Machine identifier** — used for `tools/call` invocation | Model + protocol |
| `title` | `Tool.title` (BaseMetadata) | **Human-friendly display name** — shown in tool pickers | Users |
| `annotations.title` | `Tool.annotations.title` | **Human-friendly annotation title** — older location, same purpose | Users |
| `description` | `Tool.description` | **Detailed description** — shown in tool detail views | Users + model |

The `name` field (e.g. `get-lessons-summary`) is the tool ID — it must be
stable for API compatibility. The `title` field (e.g. "Get Lesson Summary")
is for human display. Currently:

- **Aggregated tools**: Have `annotations.title` (e.g. "Get Prerequisite
  Graph") but no top-level `title` field
- **Generated tools**: Have neither `annotations.title` nor top-level `title`
  — the projection falls back to `tool.name` (kebab-case)

The spec's `BaseMetadata.title` (top-level) is the canonical location since
2025-11-25. `annotations.title` is the older location from 2025-06-18 and
remains supported.

## Implementation

### T1: Server Implementation metadata

**File**: `apps/oak-curriculum-mcp-streamable-http/src/application.ts` (~line 225)

```typescript
const server = new McpServer(
  {
    name: 'oak-curriculum-http',
    version: '0.1.0',
    title: 'Oak National Academy',
    description: 'Curriculum tools, lesson content, and semantic search for Oak National Academy.',
    websiteUrl: 'https://www.thenational.academy',
    icons: [
      { src: OAK_LOGO_LIGHT_DATA_URI, mimeType: 'image/svg+xml', theme: 'light' },
      { src: OAK_LOGO_DARK_DATA_URI, mimeType: 'image/svg+xml', theme: 'dark' },
    ],
  },
  { instructions: SERVER_INSTRUCTIONS },
);
```

### T2: Oak logo data URIs

Extract the Oak logo SVG from the widget's `BrandBanner.tsx` and encode as
`data:image/svg+xml;base64,...` URIs. Two variants:

- **Light theme**: Green logo on transparent (for light host backgrounds)
- **Dark theme**: White logo on transparent (for dark host backgrounds)

Place in a `server-branding.ts` module next to `application.ts`.

### T3: Audit tool titles

Verify every tool has a human-friendly `annotations.title`:

- Aggregated: already present (e.g. "Get Prerequisite Graph")
- Generated: need to add via the codegen template

### T4: Top-level `title` on tools

Add `title` to the `UniversalToolListEntry` type and populate from
`annotations.title`. Update `toRegistrationConfig()` to pass it through
to the SDK. This makes the title available at both spec locations.

### T5: E2E test update

Verify `serverInfo` in the initialize response includes `title`,
`description`, `icons`, and `websiteUrl`.

### T6: Resource and prompt titles

Audit resources (`CURRICULUM_MODEL_RESOURCE`, etc.) and prompts for
`title` field. Resources already have `title`. Prompts may need it added.

## Sequencing

```text
T2 logo URIs ──▶ T1 server info ──▶ T5 E2E test
T3 tool title audit ──▶ T4 top-level title
T6 resource/prompt titles (independent)
```

## Exit criteria

1. `tools/list` shows human-friendly titles for all tools
2. `initialize` response includes `title`, `description`, `icons`, `websiteUrl`
3. Oak logo visible in Claude Desktop and MCPJam server lists
4. `pnpm check` passes
5. No generated tool falls back to kebab-case `name` for display
