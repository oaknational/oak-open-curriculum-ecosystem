/**
 * Runtime abstraction interfaces
 *
 * These interfaces define the contracts for runtime operations,
 * allowing MCP applications to run across different JavaScript runtimes.
 */

/**
 * File system operations interface
 */
export interface FileSystemOperations {
  /**
   * Read a file from the file system
   */
  readFile(path: string): Promise<Buffer>;

  /**
   * Write data to a file
   */
  writeFile(path: string, data: Buffer): Promise<void>;

  /**
   * Check if a file or directory exists
   */
  exists(path: string): Promise<boolean>;

  /**
   * Create a directory
   */
  mkdir(path: string, options?: { recursive?: boolean }): Promise<void>;

  /**
   * Read directory contents
   */
  readdir(path: string): Promise<string[]>;

  /**
   * Get file or directory statistics
   */
  stat(path: string): Promise<{
    isFile(): boolean;
    isDirectory(): boolean;
    size: number;
    mtime: Date;
  }>;
}

/**
 * Environment variable operations interface
 */
export interface EnvironmentOperations {
  /**
   * Get an environment variable value
   */
  get(key: string): string | undefined;

  /**
   * Get all environment variables
   */
  getAll(): Record<string, string>;

  /**
   * Check if an environment variable exists
   */
  has(key: string): boolean;
}

/**
 * Cryptographic operations interface
 */
export interface CryptoOperations {
  /**
   * Generate a random UUID
   */
  randomUUID(): string;

  /**
   * Generate random bytes
   */
  randomBytes(size: number): Uint8Array;

  /**
   * Hash data using specified algorithm
   */
  hash(algorithm: string, data: Buffer): Promise<Buffer>;
}

/**
 * Stream operations interface
 */
export interface StreamOperations {
  /**
   * Create a readable stream from a file
   */
  createReadStream(path: string): ReadableStream;

  /**
   * Create a writable stream to a file
   */
  createWriteStream(path: string): WritableStream;

  /**
   * Pipe data from source to destination
   */
  pipe(source: ReadableStream, destination: WritableStream): Promise<void>;
}

/**
 * Runtime information
 */
export interface RuntimeInfo {
  /**
   * Runtime name (e.g., 'node', 'cloudflare')
   */
  name: string;

  /**
   * Runtime version
   */
  version: string;

  /**
   * List of supported capabilities
   */
  capabilities: string[];
}

/**
 * Complete runtime adapter interface
 */
export interface RuntimeAdapter {
  /**
   * File system operations
   */
  fs: FileSystemOperations;

  /**
   * Environment variable operations
   */
  env: EnvironmentOperations;

  /**
   * Cryptographic operations
   */
  crypto: CryptoOperations;

  /**
   * Stream operations
   */
  streams: StreamOperations;

  /**
   * Runtime information
   */
  runtime: RuntimeInfo;
}
