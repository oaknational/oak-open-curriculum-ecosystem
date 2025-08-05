# Phase 3: Directory Structure Before Transformation

## Current Structure

```
src/
├── substrate/              # Will become chora/stroma/
│   ├── contracts/          # Interfaces and contracts
│   ├── event-schemas/      # Event type definitions
│   └── types/              # Core type definitions
├── systems/                # Will become chora/aither/ and chora/phaneron/
│   ├── config/             # Will become chora/phaneron/config/
│   ├── events/             # Will become chora/aither/events/
│   └── logging/            # Will become chora/aither/logging/
│       ├── colors/         # Color utilities
│       ├── formatters/     # Log formatters
│       │   └── json/       # JSON formatter
│       ├── tracing/        # Tracing utilities
│       ├── transports/     # Log transports
│       └── types/          # Logging types
└── organa/                 # Already correctly named, no change
    ├── mcp/                # MCP server organ
    └── notion/             # Notion API organ
```

## Transformation Map

- `substrate/` → `chora/stroma/` (structural matrix)
- `systems/logging/` → `chora/aither/logging/` (divine flows - logs)
- `systems/events/` → `chora/aither/events/` (divine flows - events)
- `systems/config/` → `chora/phaneron/config/` (visible manifestation)
- `organa/` → no change (already correct)

## Import Patterns to Update

### Substrate imports

- `../../substrate/` → `../../chora/stroma/`
- `../substrate/` → `../chora/stroma/`
- `./substrate/` → `./chora/stroma/`

### Systems imports

- `../../systems/logging/` → `../../chora/aither/logging/`
- `../../systems/events/` → `../../chora/aither/events/`
- `../../systems/config/` → `../../chora/phaneron/config/`
- And similar patterns for `../` and `./`
