# Mixed Components (Refactoring Candidates)

Total modules: 10

## Modules

### /src/server-setup.ts

- **Lines**: 74
- **Score**: 2/5
- **Reasoning**: No Notion SDK imports, No Node.js API usage
- **External imports**: @modelcontextprotocol/sdk/server/stdio.js

### /src/server.ts

- **Lines**: 77
- **Score**: 2/5
- **Reasoning**: No Notion SDK imports, No Node.js API usage
- **External imports**: @modelcontextprotocol/sdk/server/index.js, @modelcontextprotocol/sdk/types.js

### /src/startup-logger.ts

- **Lines**: 72
- **Score**: 2.5/5
- **Reasoning**: No Notion SDK imports, Only utility/standard imports, Minimal Node.js API usage
- **Node APIs**: fs, path

### /src/config/environment.ts

- **Lines**: 50
- **Score**: 3/5
- **Reasoning**: No Notion SDK imports, Only utility/standard imports, No Node.js API usage

### /src/mcp/types.ts

- **Lines**: 16
- **Score**: 3/5
- **Reasoning**: No Notion SDK imports, In generic infrastructure directory, No Node.js API usage
- **External imports**: @modelcontextprotocol/sdk/types.js

### /src/notion/query-builders.ts

- **Lines**: 435
- **Score**: 3/5
- **Reasoning**: No Notion SDK imports, Only utility/standard imports, In Notion-specific directory, No Node.js API usage

### /src/test-helpers/factories.ts

- **Lines**: 32
- **Score**: 2/5
- **Reasoning**: No Notion SDK imports, No Node.js API usage
- **External imports**: vitest

### /src/types/dependencies.ts

- **Lines**: 52
- **Score**: 2/5
- **Reasoning**: No Node.js API usage, Type definition file
- **External imports**: @notionhq/client

### /src/mcp/resources/handlers.ts

- **Lines**: 205
- **Score**: 2/5
- **Reasoning**: In generic infrastructure directory, No Node.js API usage
- **External imports**: @modelcontextprotocol/sdk/types.js, @notionhq/client

### /src/mcp/tools/handlers.ts

- **Lines**: 385
- **Score**: 2/5
- **Reasoning**: In generic infrastructure directory, No Node.js API usage
- **External imports**: @notionhq/client
