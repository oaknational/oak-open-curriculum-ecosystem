# Quick Reference

For experienced developers who want to jump straight in.

## 🤖 Working with AI Agents

When assigning tasks to AI agents, always include:

```
"[Task description]. Read GO.md and follow all instructions"
```

This ensures the agent maintains focus, quality, and regular grounding. See [AI Agent Guide](ai-agent-guide.md) for details.

## Architecture TL;DR

```
Claude/AI Agent → MCP Protocol → Our Server → Notion API
                                       ↓
                              Pure Functions Core
```

## Key Concepts

**MCP (Model Context Protocol)**: Like REST API but for AI-to-tool communication

- **Resources**: URI-based data access (`notion://pages/123`)
- **Tools**: Callable functions (`notion-search`, `notion-get-page`)
- **Transport**: stdio (JSON-RPC over stdin/stdout)

## Code Map

```
src/
├── index.ts          # Entry point - starts server
├── server.ts         # MCP server setup, handler registration
├── mcp/
│   ├── handlers.ts   # Top-level request routing
│   ├── resources/    # Resource handlers (notion://...)
│   └── tools/        # Tool handlers (notion-search, etc.)
├── notion/
│   ├── client.ts     # Notion SDK wrapper
│   ├── transformers.ts # Pure functions: Notion → MCP format
│   └── query-builders.ts # Pure functions: Build Notion queries
└── utils/
    └── scrubbing.ts  # PII protection (email scrubbing)
```

## Quick Start

```bash
# Setup
git clone <repo> && cd oak-notion-mcp
pnpm install
cp .env.example .env  # Add NOTION_API_KEY
pnpm dev             # Start server

# Development
pnpm test:watch      # TDD mode
pnpm test           # Run all tests
pnpm format && pnpm lint && pnpm type-check  # Quality gates
```

## Adding a New Tool

1. **Define Zod Schema** in `src/mcp/tools/handlers.ts`:

```typescript
const MyToolArgsSchema = z.object({
  param: z.string().min(1),
});
```

2. **Add Handler Function**:

```typescript
async function handleMyTool(args: unknown, deps: Dependencies) {
  const validated = MyToolArgsSchema.parse(args);
  // Implementation using deps.notionClient
}
```

3. **Register Tool**:

```typescript
tools.set('notion-my-tool', {
  description: 'Does something useful',
  inputSchema: zodToJsonSchema(MyToolArgsSchema),
  handler: handleMyTool,
});
```

4. **Write Tests** in `handlers.integration.test.ts`

## Adding a New Resource

1. **Add URI Pattern** in `src/mcp/resources/handlers.ts`
2. **Implement Handler** using pure functions from transformers
3. **Update Tests**

## Testing Strategy

```typescript
// Unit test (pure function) - *.unit.test.ts
test('scrubEmail hides PII', () => {
  expect(scrubEmail('john@example.com')).toBe('joh...@example.com');
});

// Integration test (with mocks) - *.integration.test.ts
test('search returns formatted results', async () => {
  const mockClient = { search: vi.fn().mockResolvedValue(mockResults) };
  const result = await handleSearch({ query: 'test' }, { notionClient: mockClient });
  expect(result).toMatchSnapshot();
});
```

## Common Patterns

### Pure Functions First

```typescript
// ❌ Avoid
async function getPageTitle(pageId: string) {
  const page = await notion.pages.retrieve({ page_id: pageId });
  return page.properties.title.title[0].plain_text;
}

// ✅ Prefer
function extractPageTitle(page: PageObjectResponse): string {
  return getPlainTextFromRichText(page.properties.title.title);
}
```

### Dependency Injection

```typescript
interface Dependencies {
  notionClient: NotionClientWrapper;
  logger: Logger;
}

async function handleTool(args: unknown, deps: Dependencies) {
  // Use deps instead of imports
}
```

### Error Handling

```typescript
try {
  const result = await notion.pages.retrieve({ page_id });
  return { content: [{ type: 'text', text: formatPage(result) }] };
} catch (error) {
  const handled = ErrorHandler.handle(error);
  throw new McpError(handled.code, handled.message);
}
```

## Type Safety Rules

- **Never use `any`** - Use `unknown` at boundaries
- **Never use `as`** - No type assertions
- **Always validate** - Zod schemas at all boundaries
- **Use type guards** - `is` functions for narrowing

## Git Workflow

```bash
git checkout -b feat/your-feature
# Make changes with TDD
pnpm test:watch

# Before commit - quality gates
pnpm format && pnpm type-check && pnpm lint && pnpm test && pnpm build

# Commit with conventional format
git commit -m "feat: add amazing feature"
git push origin feat/your-feature
# Create PR
```

## Debugging

```bash
# Enable debug logs
LOG_LEVEL=debug pnpm dev

# Test specific tool
echo '{"method":"tools/call","params":{"name":"notion-search","arguments":{"query":"test"}}}' | pnpm dev

# Check types
pnpm type-check --noEmit --watch
```

## Performance Notes

- Pure functions are cached by tests
- Notion API has rate limits (3 req/sec)
- Default page size is 10, max is 100
- E2E tests require real API key

## Security Reminders

- Never log API keys
- All emails are auto-scrubbed
- Read-only operations only (Phase 2)
- Validate all inputs with Zod

## Where to Contribute

1. **Tests**: Add edge cases
2. **Types**: Remove any `unknown` types with proper guards
3. **Performance**: Add caching TODO comments
4. **Docs**: Improve examples
5. **Features**: See Phase 2.5 plan

## Getting Unstuck

1. **Read the tests** - They document behavior
2. **Check types** - Let TypeScript guide you
3. **Use pure functions** - Easier to test and reason about
4. **Ask questions** - Create GitHub issues

Ready? Pick an issue and start coding! 🚀
