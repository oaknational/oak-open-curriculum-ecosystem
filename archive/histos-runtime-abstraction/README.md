# @oaknational/mcp-histos-runtime-abstraction

Runtime abstraction layer for edge runtime compatibility in MCP applications.

## Overview

This tissue provides a runtime abstraction layer that enables MCP applications to run across different JavaScript runtimes, including Node.js and Cloudflare Workers. It abstracts away runtime-specific APIs for file system access, environment variables, crypto operations, and streams.

## Architecture

Following the biological architecture pattern:

- **Interfaces** - Pure runtime operation contracts (from moria)
- **Adapters** - Runtime-specific implementations (Node.js, Cloudflare Workers)
- **Detector** - Runtime detection and adapter loading logic

## Key Features

- Zero Node.js globals in core logic
- Runtime detection and automatic adapter selection
- Support for Node.js and Cloudflare Workers
- Type-safe runtime operations
- Tree-shakeable for optimal bundle sizes

## Usage

```typescript
import { getRuntimeAdapter } from '@oaknational/mcp-histos-runtime-abstraction';

const runtime = getRuntimeAdapter();

// Use runtime operations
const envValue = await runtime.env.get('API_KEY');
const data = await runtime.fs.readFile('config.json');
```

## Development

```bash
pnpm install
pnpm test
pnpm build
```

## Testing

Tests follow TDD approach with separate unit and integration tests:

- Unit tests for pure functions and interfaces
- Integration tests for adapter implementations
