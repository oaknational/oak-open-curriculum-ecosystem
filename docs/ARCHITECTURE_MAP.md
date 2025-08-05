# 🗺️ Architecture Map

> **First time here?** This map shows you exactly where to find what you need in our Greek-inspired biological architecture.

## Quick Navigation Guide

| What you're looking for             | Where to find it            | Directory                                    | Greek meaning                  |
| ----------------------------------- | --------------------------- | -------------------------------------------- | ------------------------------ |
| **Types, interfaces, contracts**    | The foundational layer      | [`src/chora/stroma/`](src/chora/stroma/)     | στρῶμα: substrate, foundation  |
| **Logging, events, error handling** | System flows and signals    | [`src/chora/aither/`](src/chora/aither/)     | αἰθήρ: divine air that flows   |
| **Configuration, settings**         | Runtime configuration       | [`src/chora/phaneron/`](src/chora/phaneron/) | φανερόν: the visible, manifest |
| **Test mocks, fixtures**            | Testing utilities           | [`src/chora/eidola/`](src/chora/eidola/)     | εἴδωλα: phantoms, simulacra    |
| **Notion API integration**          | Notion-specific logic       | [`src/organa/notion/`](src/organa/notion/)   | ὄργανον: organ, instrument     |
| **MCP server handlers**             | MCP protocol implementation | [`src/organa/mcp/`](src/organa/mcp/)         | ὄργανον: organ, instrument     |
| **App startup & wiring**            | Main application entry      | [`src/psychon/`](src/psychon/)               | ψυχόν: soul, animating force   |

## Architecture Concepts

### 🌊 Chorai (Χῶραι) - Cross-cutting Concerns

These are the "fields" that flow through the entire system, like infrastructure concerns:

- **stroma** - Types and contracts (the physics of our universe)
- **aither** - Logging, events, errors (the nervous system)
- **phaneron** - Configuration (what's visible at runtime)
- **eidola** - Test infrastructure (phantom doubles for testing)

### 🫀 Organa (Ὄργανα) - Discrete Organs

Self-contained functional units with specific responsibilities:

- **notion** - Everything related to Notion API
- **mcp** - Everything related to MCP protocol

### 🎭 Psychon (Ψυχόν) - The Soul

The animating force that brings everything to life through dependency injection and wiring.

## Common Tasks

### "I want to add logging"

→ Go to [`src/chora/aither/logging/`](src/chora/aither/logging/)

### "I need to add a new type"

→ Go to [`src/chora/stroma/types/`](src/chora/stroma/types/)

### "I want to modify the Notion integration"

→ Go to [`src/organa/notion/`](src/organa/notion/)

### "I need to add a new MCP tool"

→ Go to [`src/organa/mcp/tools/`](src/organa/mcp/tools/)

### "I want to change configuration"

→ Go to [`src/chora/phaneron/config/`](src/chora/phaneron/config/)

### "I need to write tests"

→ Test mocks are in [`src/chora/eidola/`](src/chora/eidola/)

## Import Examples

```typescript
// Types and contracts
import type { CoreDependencies } from '@chora/stroma';

// Logging
import { createConsoleLogger } from '@chora/aither';

// Configuration
import { getNotionConfig } from '@chora/phaneron';

// Test mocks
import { createMockNotionClient } from '@chora/eidola';

// Notion operations
import { createNotionOperations } from '@organa/notion';

// MCP handlers
import { createMcpHandlers } from '@organa/mcp';
```

## VS Code Tips

1. **Quick file search**: Press `Cmd+P` (Mac) or `Ctrl+P` (Windows/Linux)
2. **Search by English terms**: The READMEs in each directory contain English keywords
3. **Go to symbol**: Press `Cmd+Shift+O` to navigate within a file
4. **Find all references**: Right-click on any import to see where it's used

## Further Reading

- [Full Architecture Overview](docs/architecture-overview.md) - Detailed explanation of the biological architecture
- [Naming Guide](docs/naming.md) - Complete Greek nomenclature reference
- [Development Guide](docs/development/README.md) - How to work with this codebase
