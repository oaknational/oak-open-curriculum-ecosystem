# @oaknational/mcp-transport

## Overview

A transport library for MCP (Model Context Protocol) communication. This package provides a clean implementation of dependency injection and pure function patterns for reusable libraries.

## Features

- **STDIO Transport**: Communicate with MCP servers via standard input/output
- **Pure Function Core**: Message formatting and buffering as pure functions
- **Dependency Injection**: All I/O operations are injected
- **Type Safety**: Full TypeScript support with strict typing
- **Testable**: Comprehensive unit and integration tests

## Installation

```bash
pnpm add @oaknational/mcp-transport
```

## Usage

### Basic Usage

```typescript
import { StdioTransport } from '@oaknational/mcp-transport';
import { createAdaptiveLogger } from '@oaknational/mcp-logger';

// Create transport with injected dependencies
const transport = new StdioTransport(process.stdin, process.stdout, createAdaptiveLogger());

// Send a message
await transport.send({
  jsonrpc: '2.0',
  method: 'initialize',
  params: { capabilities: {} },
  id: 1,
});

// Receive messages
for await (const message of transport.receive()) {
  console.log('Received:', message);
}
```

### Pure Functions

The transport library exports pure functions for message handling:

```typescript
import {
  formatJsonRpcMessage,
  parseJsonRpcMessage,
  MessageBuffer,
} from '@oaknational/mcp-transport';

// Format a message for transmission
const formatted = formatJsonRpcMessage({
  jsonrpc: '2.0',
  method: 'test',
  id: 1,
});

// Parse a received message
const parsed = parseJsonRpcMessage(formatted);

// Use message buffering
const buffer = new MessageBuffer();
buffer.append(chunk);
const messages = buffer.extractMessages();
```

## Architecture

This library follows these patterns:

1. **Dependency Injection**: All I/O is injected through constructor
2. **Pure Functions**: Core logic extracted as pure, testable functions
3. **Interface Segregation**: Implements minimal Transport interface
4. **Adaptation**: Works with any stream-like objects

### File Structure

```text
src/
├── index.ts              # Public API
├── types.ts              # Transport-specific types
├── stdio-transport.ts    # Main transport implementation
├── message-buffer.ts     # Pure: Message buffering logic
└── message-formatter.ts  # Pure: Message formatting functions
```

## Testing

The library demonstrates best testing practices:

### Unit Tests (Pure Functions)

```bash
pnpm test tests/message-formatter.unit.test.ts
pnpm test tests/message-buffer.unit.test.ts
```

### Integration Tests

```bash
pnpm test tests/stdio-transport.integration.test.ts
```

## API Reference

### StdioTransport

```typescript
class StdioTransport implements Transport {
  constructor(stdin: NodeJS.ReadStream, stdout: NodeJS.WriteStream, logger: Logger);

  send(message: JsonRpcMessage): Promise<void>;
  receive(): AsyncIterableIterator<JsonRpcMessage>;
  close(): Promise<void>;
}
```

### Pure Functions

```typescript
// Message formatting
function formatJsonRpcMessage(message: JsonRpcMessage): string;
function parseJsonRpcMessage(data: string): JsonRpcMessage;

// Message buffering
class MessageBuffer {
  append(chunk: string): void;
  extractMessages(): JsonRpcMessage[];
}
```

## Design Decisions

This library serves as a reference implementation for reusable transport modules:

1. **No Direct Node.js Imports**: All Node.js dependencies are injected
2. **Pure Function Extraction**: Business logic separated from I/O
3. **Simple Mock Testing**: Integration tests use simple object mocks
4. **Clear Boundaries**: Transport logic separate from protocol logic

## Future Enhancements

- **HTTP Transport**: Add HTTP/WebSocket transport option
- **Compression**: Optional message compression
- **Encryption**: Optional message encryption
- **Metrics**: Performance monitoring

## Contributing

This package is part of the Oak MCP workspace. See the main repository for contribution guidelines.

## License

MIT
