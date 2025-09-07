/**
 * @oaknational/mcp-histos-runtime-abstraction
 *
 * Runtime abstraction layer for edge runtime compatibility
 *
 * This histoi tissue provides interfaces and factories for runtime operations.
 * The actual runtime context must be injected from the consuming organism (psycha level).
 */

// Export interfaces
export type {
  RuntimeAdapter,
  FileSystemOperations,
  EnvironmentOperations,
  CryptoOperations,
  StreamOperations,
  RuntimeInfo,
} from './interfaces';

// Export factory and context types
export type { RuntimeContext } from './factory';
export { createRuntimeAdapter } from './factory';

// Export detector utilities
export type { RuntimeType, RuntimeDetectionResult } from './detector';
export { createAdapter, hasCapability, getRuntimeName, getRuntimeVersion } from './detector';
