/**
 * Runtime detection types and utilities
 *
 * Note: Actual runtime detection must happen at the psycha level
 * where access to globals is permitted. This module only provides
 * the types and interfaces.
 */

import type { RuntimeAdapter } from './interfaces';
import type { RuntimeContext } from './factory';
import { createRuntimeAdapter } from './factory';

/**
 * Runtime type enumeration
 */
export type RuntimeType = 'node' | 'cloudflare' | 'unknown';

/**
 * Runtime detection result
 */
export interface RuntimeDetectionResult {
  runtimeName: RuntimeType;
  version: string;
  capabilities: string[];
}

/**
 * Create a runtime adapter from injected context
 *
 * This is the main entry point for creating adapters in a histoi-compliant way.
 * The consuming organism (psycha level) must provide the runtime context.
 *
 * @param context - Runtime context from the consuming organism
 * @returns Configured runtime adapter
 */
export function createAdapter(context: RuntimeContext): RuntimeAdapter {
  return createRuntimeAdapter(context);
}

/**
 * Helper to check if a runtime supports a capability
 */
export function hasCapability(adapter: RuntimeAdapter, capability: string): boolean {
  return adapter.runtime.capabilities.includes(capability);
}

/**
 * Helper to get runtime name from adapter
 */
export function getRuntimeName(adapter: RuntimeAdapter): string {
  return adapter.runtime.name;
}

/**
 * Helper to get runtime version from adapter
 */
export function getRuntimeVersion(adapter: RuntimeAdapter): string {
  return adapter.runtime.version;
}
