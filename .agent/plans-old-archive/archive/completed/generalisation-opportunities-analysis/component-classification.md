# Module Classification Report

## Executive Summary

Analysis of 25 TypeScript modules (excluding tests) reveals:

- **36% Generic MCP Components** (9 modules, 695 lines) - Immediately extractable
- **40% Mixed Components** (10 modules, 1114 lines) - Require refactoring
- **24% Notion-Specific** (6 modules, 1195 lines) - Remain in this package

Total: 3004 lines of production code

## Classification Results

### 🟢 Generic MCP Components (9 modules, 695 lines)

These modules contain no Notion-specific code and can be extracted directly to `oak-mcp-core`:

| Module                            | Lines | Purpose                      | External Dependencies |
| --------------------------------- | ----- | ---------------------------- | --------------------- |
| `src/errors/error-handler.ts`     | 190   | MCP error handling framework | -                     |
| `src/logging/file-reporter.ts`    | 100   | File logging reporter        | consola               |
| `src/logging/logger.ts`           | 66    | Logger abstraction           | consola               |
| `src/mcp/handlers.ts`             | 44    | Base MCP handler utilities   | -                     |
| `src/types/environment.ts`        | 10    | Environment type definitions | -                     |
| `src/utils/scrubbing.ts`          | 40    | PII scrubbing utilities      | -                     |
| `src/mcp/resources/uri-parser.ts` | 123   | URI parsing for resources    | -                     |
| `src/mcp/tools/schemas.ts`        | 74    | Base tool schemas            | zod                   |
| `src/mcp/tools/types.ts`          | 58    | MCP tool type definitions    | zod                   |

**Key Characteristics:**

- No imports from `@notionhq/client`
- Generic error handling, logging, and utility functions
- MCP protocol abstractions
- Could work with any MCP integration

### 🟡 Mixed Components (10 modules, 1114 lines)

These modules contain both generic and specific code, requiring refactoring before extraction:

| Module                                 | Lines | Generic % | Refactoring Strategy          |
| -------------------------------------- | ----- | --------- | ----------------------------- |
| `src/index.ts`                         | 29    | 70%       | Extract startup logic         |
| `src/server.ts`                        | 60    | 60%       | Extract base MCP server class |
| `src/server-setup.ts`                  | 68    | 50%       | Split setup vs. Notion config |
| `src/startup-logger.ts`                | 61    | 80%       | Make integration-agnostic     |
| `src/config/environment.ts`            | 87    | 40%       | Extract validation pattern    |
| `src/mcp/types.ts`                     | 51    | 70%       | Separate base types           |
| `src/types/dependencies.ts`            | 52    | 60%       | Extract interface pattern     |
| `src/test-helpers/factories.ts`        | 162   | 50%       | Split generic test utils      |
| `src/test-helpers/notion-mocks.ts`     | 305   | 0%        | Keep as Notion-specific       |
| `src/test-helpers/notion-api-mocks.ts` | 239   | 0%        | Keep as Notion-specific       |

**Refactoring Opportunities:**

- Extract MCP server lifecycle management
- Create generic configuration interfaces
- Separate test utilities from Notion mocks

### 🔴 Notion-Specific Components (6 modules, 1195 lines)

These modules are tightly coupled to the Notion API and remain in this package:

| Module                          | Lines | Purpose                          |
| ------------------------------- | ----- | -------------------------------- |
| `src/notion/formatters.ts`      | 350   | Format Notion API responses      |
| `src/notion/transformers.ts`    | 251   | Transform Notion data structures |
| `src/notion/query-builders.ts`  | 181   | Build Notion database queries    |
| `src/notion/type-guards.ts`     | 34    | Notion-specific type guards      |
| `src/mcp/resources/handlers.ts` | 211   | Notion resource handlers         |
| `src/mcp/tools/handlers.ts`     | 168   | Notion tool implementations      |

**Characteristics:**

- Heavy use of `@notionhq/client` types
- Domain-specific business logic
- Notion API response handling

## Reusability Metrics

### Lines of Code Distribution

- Generic (extractable): 695 lines (23%)
- Mixed (partially extractable): 1114 lines (37%)
- Specific (not extractable): 1195 lines (40%)

### Potential for Reuse

With refactoring of mixed components:

- **Immediate extraction**: 695 lines
- **After refactoring**: ~700 additional lines
- **Total reusable**: ~1400 lines (47%)

This falls short of the 60% target but represents a solid foundation for `oak-mcp-core`.

## Complexity Analysis

### High-Complexity Modules (candidates for breaking down)

1. `src/notion/formatters.ts` (350 lines) - Split by Notion object type
2. `src/test-helpers/notion-mocks.ts` (305 lines) - Group by test scenario
3. `src/notion/transformers.ts` (251 lines) - Separate transform types

### Low-Complexity Generic Modules (easy extraction)

1. `src/types/environment.ts` (10 lines)
2. `src/utils/scrubbing.ts` (40 lines)
3. `src/mcp/handlers.ts` (44 lines)

## Recommendations

### Phase 1: Direct Extraction (Week 1)

Extract these pure generic components with no changes:

- Error handling framework
- Logging infrastructure
- Utility functions (scrubbing)
- Type definitions
- URI parser

### Phase 2: Refactor and Extract (Week 2)

Refactor mixed components to separate concerns:

- Create `McpServerBase` class from `src/server.ts`
- Extract configuration interfaces from `src/config/environment.ts`
- Split test utilities into generic helpers

### Phase 3: Interface Design (Week 3)

Design integration points for:

- Resource handler registration
- Tool handler registration
- Configuration injection
- Error mapping

## Next Steps

1. Create detailed extraction plan document
2. Design `oak-mcp-core` API surface
3. Plan migration path for existing code
4. Document integration patterns for future MCP servers
