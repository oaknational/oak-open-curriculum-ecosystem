/**
 * @fileoverview Integration tests for request tracing with AsyncLocalStorage
 * @module @oak-mcp-core/logging
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { AsyncLocalStorage } from 'node:async_hooks';

describe('Request Tracing Integration', () => {
  describe('RequestTracer with AsyncLocalStorage', () => {
    interface TraceContext {
      requestId: string;
      traceId?: string;
      spanId?: string;
      parentSpanId?: string;
      userId?: string;
      sessionId?: string;
      [key: string]: unknown;
    }

    // Mock logger for testing
    interface MockLogger {
      logs: { message: string; context?: Record<string, unknown> }[];
      info(message: string, context?: Record<string, unknown>): void;
    }

    function createMockLogger(): MockLogger {
      const logs: { message: string; context?: Record<string, unknown> }[] = [];
      return {
        logs,
        info: (message: string, context?: Record<string, unknown>) => {
          logs.push({ message, context });
        },
      };
    }

    let storage: AsyncLocalStorage<TraceContext>;
    let mockLogger: MockLogger;

    beforeEach(() => {
      storage = new AsyncLocalStorage<TraceContext>();
      mockLogger = createMockLogger();
    });

    it('should maintain trace context across async operations', async () => {
      // Simulate RequestTracer behavior
      const runWithTrace = async <T>(context: TraceContext, fn: () => Promise<T>): Promise<T> => {
        return storage.run(context, fn);
      };

      const getTraceContext = (): TraceContext | undefined => {
        return storage.getStore();
      };

      const logWithTrace = (message: string, additionalContext?: Record<string, unknown>) => {
        const trace = getTraceContext();
        const context = trace ? { ...trace, ...additionalContext } : additionalContext;
        mockLogger.info(message, context);
      };

      await runWithTrace({ requestId: 'req-123', userId: 'user-456' }, async () => {
        logWithTrace('Start processing');

        await new Promise((resolve) => setTimeout(resolve, 10));

        logWithTrace('After delay', { step: 1 });

        await Promise.all([
          new Promise((resolve) => {
            setTimeout(() => {
              logWithTrace('Async task 1');
              resolve(void 0);
            }, 5);
          }),
          new Promise((resolve) => {
            setTimeout(() => {
              logWithTrace('Async task 2');
              resolve(void 0);
            }, 5);
          }),
        ]);

        logWithTrace('Processing complete');
      });

      expect(mockLogger.logs).toHaveLength(5);
      expect(
        mockLogger.logs.every(
          (log) =>
            log.context?.['requestId'] === 'req-123' && log.context?.['userId'] === 'user-456',
        ),
      ).toBe(true);
    });

    it('should support nested trace contexts with span IDs', async () => {
      const createSpan = (parentContext: TraceContext, spanId: string): TraceContext => {
        return {
          ...parentContext,
          parentSpanId: parentContext.spanId,
          spanId,
        };
      };

      const runWithSpan = async <T>(spanId: string, fn: () => Promise<T>): Promise<T> => {
        const parentContext = storage.getStore();
        if (!parentContext) {
          throw new Error('No parent trace context');
        }

        const spanContext = createSpan(parentContext, spanId);
        return storage.run(spanContext, fn);
      };

      await storage.run(
        { requestId: 'req-123', traceId: 'trace-456', spanId: 'span-001' },
        async () => {
          const ctx1 = storage.getStore();
          expect(ctx1).toMatchObject({
            requestId: 'req-123',
            traceId: 'trace-456',
            spanId: 'span-001',
          });

          await runWithSpan('span-002', async () => {
            const ctx2 = storage.getStore();
            expect(ctx2).toMatchObject({
              requestId: 'req-123',
              traceId: 'trace-456',
              parentSpanId: 'span-001',
              spanId: 'span-002',
            });

            await runWithSpan('span-003', async () => {
              const ctx3 = storage.getStore();
              expect(ctx3).toMatchObject({
                requestId: 'req-123',
                traceId: 'trace-456',
                parentSpanId: 'span-002',
                spanId: 'span-003',
              });
            });
          });

          // Back to original span
          const ctxBack = storage.getStore();
          expect(ctxBack?.spanId).toBe('span-001');
          expect(ctxBack?.parentSpanId).toBeUndefined();
        },
      );
    });

    it('should handle trace context updates', async () => {
      await storage.run({ requestId: 'req-123', userId: 'guest' }, async () => {
        const initial = storage.getStore();
        expect(initial?.userId).toBe('guest');

        if (!initial) {
          throw new Error('Expected initial trace context to exist');
        }

        // Simulate authentication
        await storage.run(
          { ...initial, userId: 'user-789', sessionId: 'session-456' },
          async () => {
            const updated = storage.getStore();
            expect(updated).toMatchObject({
              requestId: 'req-123',
              userId: 'user-789',
              sessionId: 'session-456',
            });
          },
        );
      });
    });

    it('should extract trace headers from HTTP request', async () => {
      const extractTraceFromHeaders = (
        headers: Record<string, string | string[] | undefined>,
      ): Partial<TraceContext> => {
        const trace: Partial<TraceContext> = {};

        const getValue = (value: string | string[] | undefined): string | undefined => {
          if (!value) return undefined;
          return Array.isArray(value) ? value[0] : value;
        };

        const requestId = getValue(headers['x-request-id']);
        const traceId = getValue(headers['x-trace-id']);
        const spanId = getValue(headers['x-span-id']);

        if (requestId) trace.requestId = requestId;
        if (traceId) trace.traceId = traceId;
        if (spanId) trace.spanId = spanId;

        return trace;
      };

      const handleRequest = async (
        headers: Record<string, string | string[] | undefined>,
        handler: () => Promise<void>,
      ): Promise<void> => {
        const extractedTrace = extractTraceFromHeaders(headers);
        const context: TraceContext = {
          requestId: extractedTrace.requestId || `req-${Date.now()}`,
          ...extractedTrace,
        };

        return storage.run(context, handler);
      };

      const headers = {
        'x-request-id': 'external-req-123',
        'x-trace-id': 'external-trace-456',
        'x-span-id': 'external-span-789',
      };

      await handleRequest(headers, async () => {
        const context = storage.getStore();
        expect(context).toMatchObject({
          requestId: 'external-req-123',
          traceId: 'external-trace-456',
          spanId: 'external-span-789',
        });
      });
    });

    it('should propagate trace context to child processes', async () => {
      const serializeTraceContext = (context: TraceContext): string => {
        return JSON.stringify({
          requestId: context.requestId,
          traceId: context.traceId,
          spanId: context.spanId,
          parentSpanId: context.parentSpanId,
        });
      };

      const deserializeTraceContext = (serialized: string): TraceContext => {
        const parsed: unknown = JSON.parse(serialized);
        // Build a proper TraceContext from parsed data
        if (typeof parsed !== 'object' || parsed === null || !('requestId' in parsed)) {
          throw new Error('Invalid serialized trace context');
        }

        // Extract properties without type assertions
        // We know parsed is an object with requestId from the check above
        // In a test environment, we control the data shape
        const result: TraceContext = {
          requestId: '',
        };

        // Use Object.entries to safely access properties
        Object.entries(parsed).forEach(([key, value]) => {
          if (key === 'requestId' && typeof value === 'string') {
            result.requestId = value;
          } else if (key === 'traceId' && typeof value === 'string') {
            result.traceId = value;
          } else if (key === 'spanId' && typeof value === 'string') {
            result.spanId = value;
          } else if (key === 'parentSpanId' && typeof value === 'string') {
            result.parentSpanId = value;
          }
        });

        if (!result.requestId) {
          throw new Error('Missing required requestId');
        }

        return result;
      };

      // Simulate parent process
      let serializedContext = '';

      await storage.run({ requestId: 'req-123', traceId: 'trace-456' }, async () => {
        const context = storage.getStore();
        if (!context) {
          throw new Error('Expected trace context to exist in storage');
        }
        serializedContext = serializeTraceContext(context);
      });

      // Simulate child process
      const childContext = deserializeTraceContext(serializedContext);

      await storage.run(childContext, async () => {
        const context = storage.getStore();
        expect(context).toMatchObject({
          requestId: 'req-123',
          traceId: 'trace-456',
        });
      });
    });

    it('should handle missing trace context gracefully', async () => {
      const getTraceOrDefault = (): TraceContext => {
        const existing = storage.getStore();
        if (existing) return existing;

        // Generate new context if none exists
        return {
          requestId: `req-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        };
      };

      // Outside any context
      const context1 = getTraceOrDefault();
      expect(context1.requestId).toMatch(/^req-\d+-[a-z0-9]+$/);

      // Inside context
      await storage.run({ requestId: 'existing-123' }, async () => {
        const context2 = getTraceOrDefault();
        expect(context2.requestId).toBe('existing-123');
      });
    });

    it('should support trace sampling decisions', async () => {
      interface SampledTraceContext extends TraceContext {
        sampled: boolean;
        sampleRate?: number;
      }

      const shouldSample = (sampleRate = 0.1): boolean => {
        return Math.random() < sampleRate;
      };

      const createSampledContext = (
        base: Partial<TraceContext>,
        sampleRate?: number,
      ): SampledTraceContext => {
        const sampled = shouldSample(sampleRate);
        return {
          requestId: base.requestId || `req-${Date.now()}`,
          ...base,
          sampled,
          sampleRate,
        };
      };

      let sampledCount = 0;
      const iterations = 1000;
      const targetRate = 0.1;

      for (let i = 0; i < iterations; i++) {
        const context = createSampledContext({}, targetRate);
        if (context.sampled) sampledCount++;
      }

      // Should be approximately 10% (with some variance)
      const actualRate = sampledCount / iterations;
      expect(actualRate).toBeGreaterThan(0.05);
      expect(actualRate).toBeLessThan(0.15);
    });
  });
});
