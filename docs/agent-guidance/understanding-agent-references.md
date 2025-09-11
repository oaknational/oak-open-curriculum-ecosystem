# Understanding Agent Reference Materials

## Overview

The `.agent/reference/` directory contains curated documentation specifically formatted for AI agents. This guide explains how these materials support both human developers and AI assistants.

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
3. **Curated selections** highlighting what's most relevant to our project

## Reference Structure

```text
.agent/reference/
├── README.md                      # Index with links to sources
├── mcp-docs-for-agents.md        # MCP overview for AI agents
├── mcp-typescript-sdk-readme.md  # SDK documentation
├── notion-api-overview.md        # Notion API concepts
├── notion-sdk-readme.md          # Notion SDK reference
├── claude-configuration-docs.md  # Claude setup guide
└── claude-mcp-docs.md           # Claude MCP integration
```

## How to Use These References

### For Human Developers

1. **Start with README.md** - Contains all source links
2. **Use agent docs for quick reference** - Cleaner than web pages
3. **Visit source links for deep dives** - When you need full context
4. **Cross-reference during development** - Keep both open

### For AI Agents

When working with Claude or other AI assistants:

```text
"Can you explain how MCP resources work? Check the reference docs."
"Look at the Notion SDK reference and tell me how to query a database."
"Review the Claude MCP docs and help me debug this connection issue."
```

## Key Documents Explained

### MCP Documentation

**mcp-docs-for-agents.md**

- Extracted from: <https://modelcontextprotocol.io/llms-full.txt>
- Purpose: Complete MCP overview optimized for AI processing
- Use when: Understanding MCP concepts, designing new features

**mcp-typescript-sdk-readme.md**

- Source: <https://github.com/modelcontextprotocol/typescript-sdk>
- Purpose: SDK API reference and examples
- Use when: Implementing MCP handlers, understanding SDK patterns

### Notion Integration

**notion-api-overview.md**

- Source: <https://developers.notion.com/docs/getting-started>
- Purpose: Core Notion API concepts
- Use when: Understanding Notion's data model

**notion-sdk-readme.md**

- Source: <https://github.com/makenotion/notion-sdk-js>
- Purpose: JavaScript/TypeScript SDK reference
- Use when: Writing code that calls Notion API

### Claude Integration

**claude-configuration-docs.md**

- Source: <https://docs.anthropic.com/en/docs/claude-code/settings>
- Purpose: How to configure MCP servers in Claude
- Use when: Setting up or troubleshooting Claude integration

**claude-mcp-docs.md**

- Source: <https://docs.anthropic.com/en/docs/claude-code/mcp>
- Purpose: Claude's MCP implementation details
- Use when: Understanding Claude-specific MCP features

## Maintaining References

### When to Update

- When official documentation changes significantly
- When new features are added to SDKs
- When our implementation needs new concepts
- When onboarding reveals documentation gaps

### How to Update

1. **Visit the source URL** (listed in README.md)
2. **Extract relevant content** - Focus on what we use
3. **Clean formatting** - Remove web navigation, ads
4. **Preserve code examples** - These are crucial
5. **Update README.md** - Keep source links current

### What to Include

✅ DO Include:

- Core concepts and explanations
- API references we actually use
- Code examples and patterns
- Error messages and troubleshooting
- Configuration examples

❌ DON'T Include:

- Marketing content
- Unrelated features
- Web navigation elements
- Changelog details (link instead)
- Beta/experimental features we don't use

## Benefits for Development

### 1. Faster AI Assistance

AI agents can quickly understand:

- How MCP protocol works
- Notion API capabilities
- SDK usage patterns
- Configuration options

### 2. Consistent Knowledge

All team members (human and AI) work from:

- Same curated content
- Same understanding of concepts
- Same code examples

### 3. Efficient Onboarding

New developers can:

- Read focused content without web distractions
- Access source links when needed
- Use AI assistants more effectively

## Example Workflow

Here's how a developer might use these references:

1. **Question**: "How do I add pagination to a Notion query?"

2. **Check agent references**:

   ```text
   Read notion-sdk-readme.md section on pagination
   Find the iteratePaginatedAPI helper
   ```

3. **Ask AI assistant**:

   ```text
   "Looking at notion-sdk-readme.md, how would I implement
   pagination for the notion-query-database tool?"
   ```

4. **Deep dive if needed**:

   ```text
   Visit https://github.com/makenotion/notion-sdk-js
   Check examples/pagination.js
   ```

## Future Enhancements

Consider adding:

- **Performance tips** extracted from SDK issues
- **Common patterns** from successful MCP servers
- **Error catalogs** from Notion API responses
- **Migration guides** when SDKs update

## Conclusion

Agent reference materials bridge the gap between:

- What AI agents can efficiently process
- What human developers need to understand
- What official documentation provides

By maintaining this curated collection, we enable both human and AI developers to work more effectively on the project.
