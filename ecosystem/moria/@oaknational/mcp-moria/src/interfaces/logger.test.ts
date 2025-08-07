/**
 * @fileoverview Tests for Logger interface
 * @module moria/interfaces/logger.test
 *
 * Pure interface tests - verifying that implementations conform to the contract
 */

import { describe, it, expect } from 'vitest';
import type { Logger } from './logger.js';

describe('Logger Interface', () => {
  it('should define required logging methods', () => {
    // This test verifies that the interface is properly typed
    // It will fail to compile if the interface is incorrect
    const mockLogger: Logger = {
      trace: (message: string, context?: unknown) => {},
      debug: (message: string, context?: unknown) => {},
      info: (message: string, context?: unknown) => {},
      warn: (message: string, context?: unknown) => {},
      error: (message: string, error?: unknown, context?: unknown) => {},
      fatal: (message: string, error?: unknown, context?: unknown) => {},
    };

    expect(mockLogger.trace).toBeDefined();
    expect(mockLogger.debug).toBeDefined();
    expect(mockLogger.info).toBeDefined();
    expect(mockLogger.warn).toBeDefined();
    expect(mockLogger.error).toBeDefined();
    expect(mockLogger.fatal).toBeDefined();
  });

  it('should allow optional methods', () => {
    // Minimal implementation without optional methods
    const minimalLogger: Logger = {
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      fatal: () => {},
    };

    expect(minimalLogger.isLevelEnabled).toBeUndefined();
    expect(minimalLogger.child).toBeUndefined();
  });

  it('should support optional isLevelEnabled method', () => {
    const loggerWithLevelCheck: Logger = {
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      fatal: () => {},
      isLevelEnabled: (level: number) => level >= 20,
    };

    expect(loggerWithLevelCheck.isLevelEnabled).toBeDefined();
    expect(loggerWithLevelCheck.isLevelEnabled!(20)).toBe(true);
    expect(loggerWithLevelCheck.isLevelEnabled!(10)).toBe(false);
  });

  it('should support optional child method', () => {
    const loggerWithChild: Logger = {
      trace: () => {},
      debug: () => {},
      info: () => {},
      warn: () => {},
      error: () => {},
      fatal: () => {},
      child: (context: Record<string, unknown>) => loggerWithChild,
    };

    expect(loggerWithChild.child).toBeDefined();
    const childLogger = loggerWithChild.child!({ requestId: '123' });
    expect(childLogger).toBe(loggerWithChild); // In this mock, it returns itself
  });
});
