# Understanding Agent Reference Materials

## Overview

The `.agent/reference-docs/` directory contains curated documentation specifically formatted for AI agents. This guide explains how these materials support both human developers and AI assistants.

## Why Agent-Specific References?

### The Challenge

- Official documentation is often spread across multiple sites
- Web content includes navigation, ads, and other noise
- AI agents work better with clean, focused content
- Developers need both curated content AND source links

### The Solution

Our reference documents provide:

1. **Clean, focused content** for AI agents to process efficiently
2. **Source links** for developers to access full documentation
3. **Curated selections** highlighting what is most relevant to our project

## Reference Structure

```text
.agent/reference-docs/
├── README.md                           # Index with links to sources
├── mcp-docs-for-agents.md             # MCP overview for AI agents
├── mcp-typescript-sdk-readme.md       # MCP TypeScript SDK reference
├── mcp-auth-spec.md                   # MCP authentication specification
├── mcp-understanding-auth-in-mcp.md   # MCP auth concepts
├── clerk-*.md                         # Clerk OAuth/auth integration docs
├── zod-3-to-4-migration-docs.md       # Zod migration guide
├── cloudflare-runtimes-docs.md        # Cloudflare runtime reference
├── nextjs-environment-variables.md    # Next.js env var patterns
└── cursor_agents.md                   # Cursor agent configuration
```

## How to Use These References

### For Human Developers

1. **Start with `.agent/reference-docs/README.md`** — contains all source links
2. **Use agent docs for quick reference** — cleaner than web pages
3. **Visit source links for deep dives** — when you need full context
4. **Cross-reference during development** — keep both open

### For AI Agents

When working with Claude or other AI assistants:

```text
"Can you explain how MCP resources work? Check the reference docs."
"Review the MCP auth spec and help me debug this authentication issue."
"Look at the Clerk SDK reference for machine-to-machine auth patterns."
```

## Key Documents Explained

### MCP Documentation

**mcp-docs-for-agents.md**

- Extracted from: <https://modelcontextprotocol.io/llms-full.txt>
- Purpose: Complete MCP overview optimised for AI processing
- Use when: Understanding MCP concepts, designing new features

**mcp-typescript-sdk-readme.md**

- Source: <https://github.com/modelcontextprotocol/typescript-sdk>
- Purpose: SDK API reference and examples
- Use when: Implementing MCP handlers, understanding SDK patterns

**mcp-auth-spec.md** / **mcp-understanding-auth-in-mcp.md**

- Purpose: MCP authentication specification and concepts
- Use when: Working on authentication flows in MCP servers

### Authentication

**clerk-\*.md** (multiple files)

- Purpose: Clerk OAuth, Express SDK, and machine auth references
- Use when: Working on Clerk integration in the streamable HTTP MCP server

## Maintaining References

### When to Update

- When official documentation changes significantly
- When new features are added to SDKs
- When our implementation needs new concepts
- When onboarding reveals documentation gaps

### How to Update

1. **Visit the source URL** (listed in `.agent/reference-docs/README.md`)
2. **Extract relevant content** — focus on what we use
3. **Clean formatting** — remove web navigation, ads
4. **Preserve code examples** — these are crucial
5. **Update README.md** — keep source links current
