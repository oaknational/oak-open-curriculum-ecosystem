/**
 * STDIO transport implementation for MCP servers
 */

import type { Logger } from '@oaknational/mcp-moria';
import type { JsonRpcMessage, StdioTransport, StdioTransportOptions } from './types.js';

/**
 * Creates a STDIO transport for MCP communication
 */
export class StdioTransportImpl implements StdioTransport {
  private logger: Logger;
  private stdin: NodeJS.ReadStream;
  private stdout: NodeJS.WriteStream;
  private onMessage?: (message: JsonRpcMessage) => void;
  private buffer: string = '';
  private dataHandler?: (chunk: Buffer) => void;

  constructor(options: StdioTransportOptions) {
    this.logger = options.logger;

    if (!options.stdin || !options.stdout) {
      throw new Error('stdin and stdout are required for STDIO transport');
    }

    this.stdin = options.stdin;
    this.stdout = options.stdout;
    this.onMessage = options.onMessage;
  }

  start(): void {
    this.buffer = '';

    this.dataHandler = (chunk: Buffer) => {
      this.buffer += chunk.toString();
      this.processBuffer();
    };

    this.stdin.on('data', this.dataHandler);
    this.stdin.resume();

    this.logger.debug('STDIO transport started');
  }

  async send(message: JsonRpcMessage): Promise<void> {
    return new Promise((resolve, reject) => {
      const data = JSON.stringify(message) + '\n';

      this.stdout.write(data, (error) => {
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
      this.stdin.removeListener('data', this.dataHandler);
      this.dataHandler = undefined;
    }

    this.buffer = '';
    this.logger.debug('STDIO transport closed');
  }

  private processBuffer(): void {
    const lines = this.buffer.split('\n');

    // Keep the last incomplete line in the buffer
    this.buffer = lines.pop() || '';

    for (const line of lines) {
      if (line.trim()) {
        try {
          const message = JSON.parse(line) as JsonRpcMessage;
          this.onMessage?.(message);
        } catch (error) {
          this.logger.error('Failed to parse message:', error);
        }
      }
    }
  }
}
