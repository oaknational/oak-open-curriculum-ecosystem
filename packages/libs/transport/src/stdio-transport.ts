/**
 * STDIO transport implementation for MCP servers
 * Uses Node.js stream types directly
 */

import type { Readable, Writable } from 'stream';
import type { JsonRpcMessage, StdioTransport, StdioTransportOptions, Logger } from './types.js';
import { MessageBuffer } from './message-buffer.js';
import { formatMessage, parseMessage } from './message-formatter.js';

/**
 * Type predicate to check if value is a Buffer
 * Buffers have specific methods that distinguish them from plain objects
 */
function isBuffer(value: unknown): value is Buffer {
  return (
    value !== null &&
    typeof value === 'object' &&
    'toString' in value &&
    'slice' in value &&
    'length' in value
  );
}

/**
 * Creates a STDIO transport for MCP communication
 * Uses Node.js stream types directly
 */
export class StdioTransportImpl implements StdioTransport {
  private logger: Logger;
  private stdin: Readable;
  private stdout: Writable;
  private onMessage?: (message: JsonRpcMessage) => void;
  private messageBuffer: MessageBuffer;
  // Store as generic handler to work with removeListener's generic overload
  private dataHandler?: (...args: unknown[]) => void;

  constructor(options: StdioTransportOptions) {
    if (!options.stdin) {
      throw new Error('stdin is required for StdioTransport');
    }
    if (!options.stdout) {
      throw new Error('stdout is required for StdioTransport');
    }

    this.logger = options.logger;
    this.stdin = options.stdin;
    this.stdout = options.stdout;
    this.onMessage = options.onMessage;
    this.messageBuffer = new MessageBuffer();
  }

  start(): void {
    this.messageBuffer.clear();

    // Create handler that accepts the stream's data events
    // The first argument will be the chunk (Buffer | string)
    this.dataHandler = (...args: unknown[]) => {
      const chunk = args[0];
      if (!chunk) return;

      // Handle both string and Buffer data using type predicates
      // The stream contract guarantees chunk is Buffer | string
      let data: string;
      if (typeof chunk === 'string') {
        data = chunk;
      } else if (isBuffer(chunk)) {
        // Buffer has a toString method that we can safely call
        data = chunk.toString();
      } else {
        // Should never happen with a valid stream implementation
        this.logger.error('Invalid chunk type received from stream', { chunk });
        return;
      }

      this.messageBuffer.append(data);
      this.processMessages();
    };

    this.stdin.on('data', this.dataHandler);
    this.stdin.resume();

    this.logger.debug('STDIO transport started');
  }

  async send(message: JsonRpcMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = formatMessage(message);

      this.stdout.write(data, (error?: Error | null) => {
        if (error) {
          this.logger.error('Failed to write to stdout:', error);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  close(): void {
    if (this.dataHandler) {
      this.stdin.pause();
      // Use the generic overload with explicit event string
      // This is safe because we control both the registration and removal
      const eventName = 'data';
      const handler: (...args: unknown[]) => void = this.dataHandler;
      this.stdin.removeListener(eventName, handler);
      this.dataHandler = undefined;
    }

    this.messageBuffer.clear();
    this.logger.debug('STDIO transport closed');
  }

  private processMessages(): void {
    const lines = this.messageBuffer.extractMessages();

    for (const line of lines) {
      const message = parseMessage(line);
      if (message) {
        this.onMessage?.(message);
      } else if (line.trim()) {
        this.logger.error('Failed to parse message:', { line });
      }
    }
  }
}
