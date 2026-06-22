# Notion-Specific Components

Total modules: 6

## Modules

### /src/index.ts

- **Lines**: 41
- **Score**: 1.5/5
- **Reasoning**: No Notion SDK imports, Minimal Node.js API usage
- **Node APIs**: process.env, process.exit
- **External imports**: @modelcontextprotocol/sdk/server/stdio.js

### /src/notion/formatters.ts

- **Lines**: 383
- **Score**: 1/5
- **Reasoning**: In Notion-specific directory, No Node.js API usage
- **External imports**: @notionhq/client

### /src/notion/transformers.ts

- **Lines**: 284
- **Score**: 1/5
- **Reasoning**: In Notion-specific directory, No Node.js API usage
- **External imports**: @notionhq/client

### /src/notion/type-guards.ts

- **Lines**: 40
- **Score**: 1/5
- **Reasoning**: In Notion-specific directory, No Node.js API usage
- **External imports**: @notionhq/client/build/src/api-endpoints

### /src/test-helpers/notion-api-mocks.ts

- **Lines**: 43
- **Score**: 1/5
- **Reasoning**: No Node.js API usage
- **External imports**: @notionhq/client/build/src/api-endpoints

### /src/test-helpers/notion-mocks.ts

- **Lines**: 110
- **Score**: 1/5
- **Reasoning**: No Node.js API usage
- **External imports**: @notionhq/client
