/**
 * @fileoverview Generic stream interfaces for runtime-agnostic IO
 * @module moria/interfaces/streams
 *
 * These interfaces define the minimal contract needed for stream-based IO,
 * allowing Histoi tissues to be truly transplantable across runtimes.
 */

/**
 * Generic readable stream interface
 * Minimal contract for reading data from a stream
 */
export interface ReadableStream {
  /**
   * Register a handler for data events
   */
  on(event: 'data', handler: (chunk: Buffer | string) => void): void;
  on(event: 'error', handler: (error: Error) => void): void;
  on(event: 'end', handler: () => void): void;

  /**
   * Remove a previously registered event handler
   */
  removeListener(event: 'data', handler: (chunk: Buffer | string) => void): this;
  removeListener(event: 'error', handler: (error: Error) => void): this;
  removeListener(event: 'end', handler: () => void): this;
  removeListener(event: string, handler: (...args: unknown[]) => void): this;

  /**
   * Pause the stream
   */
  pause(): void;

  /**
   * Resume the stream
   */
  resume(): void;
}

/**
 * Generic writable stream interface
 * Minimal contract for writing data to a stream
 */
export interface WritableStream {
  /**
   * Write data to the stream
   */
  write(chunk: string | Buffer, callback?: (error?: Error | null) => void): boolean;

  /**
   * End the stream
   */
  end(callback?: () => void): void;
}

/**
 * Combined readable and writable stream
 */
export interface DuplexStream extends ReadableStream, WritableStream {}
