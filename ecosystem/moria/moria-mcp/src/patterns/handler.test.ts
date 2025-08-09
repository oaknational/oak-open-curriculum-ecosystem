/**
 * @fileoverview Tests for Handler patterns
 * @module moria/patterns/handler.test
 */

import { describe, it, expect, vi } from 'vitest';
import type {
  Handler,
  AsyncHandler,
  ErrorHandler,
  ChainableHandler,
  HandlerContext,
  HandlerMiddleware,
  HandlerPipeline,
} from './handler';

describe('Handler patterns', () => {
  describe('Handler interface', () => {
    it('should define a synchronous handler', () => {
      const handler: Handler<string, number> = {
        handle: (input: string) => {
          return input.length;
        },
      };

      expect(handler.handle).toBeDefined();
      expect(handler.handle('test')).toBe(4);
      expect(handler.handle('')).toBe(0);
    });

    it('should support void return type', () => {
      const sideEffects: string[] = [];
      const handler: Handler<string, void> = {
        handle: (input: string) => {
          sideEffects.push(input);
        },
      };

      handler.handle('test');
      expect(sideEffects).toEqual(['test']);
    });

    it('should support generic input and output types', () => {
      interface User {
        name: string;
        age: number;
      }

      interface Greeting {
        message: string;
        formal: boolean;
      }

      const handler: Handler<User, Greeting> = {
        handle: (user: User) => {
          return {
            message: `Hello, ${user.name}`,
            formal: user.age >= 18,
          };
        },
      };

      const result = handler.handle({ name: 'Alice', age: 25 });
      expect(result).toEqual({
        message: 'Hello, Alice',
        formal: true,
      });
    });
  });

  describe('AsyncHandler interface', () => {
    it('should define an asynchronous handler', async () => {
      const handler: AsyncHandler<string, number> = {
        handle: async (input: string) => {
          await new Promise((resolve) => setTimeout(resolve, 1));
          return input.length;
        },
      };

      expect(handler.handle).toBeDefined();
      const result = await handler.handle('test');
      expect(result).toBe(4);
    });

    it('should handle async errors', async () => {
      const handler: AsyncHandler<string, number> = {
        handle: async (input: string) => {
          if (input === 'error') {
            throw new Error('Test error');
          }
          return input.length;
        },
      };

      await expect(handler.handle('error')).rejects.toThrow('Test error');
      await expect(handler.handle('valid')).resolves.toBe(5);
    });
  });

  describe('ErrorHandler interface', () => {
    it('should handle errors and return results', () => {
      const errorHandler: ErrorHandler<string, number> = {
        handle: (input: string) => {
          if (input === '') {
            return { success: false, error: new Error('Empty input') };
          }
          return { success: true, value: input.length };
        },
      };

      const successResult = errorHandler.handle('test');
      expect(successResult.success).toBe(true);
      if (successResult.success) {
        expect(successResult.value).toBe(4);
      }

      const errorResult = errorHandler.handle('');
      expect(errorResult.success).toBe(false);
      if (!errorResult.success) {
        expect(errorResult.error).toBeInstanceOf(Error);
        expect(errorResult.error.message).toBe('Empty input');
      }
    });

    it('should support custom error types', () => {
      class ValidationError extends Error {
        constructor(
          public field: string,
          message: string,
        ) {
          super(message);
        }
      }

      const handler: ErrorHandler<{ email: string }, string, ValidationError> = {
        handle: (input) => {
          if (!input.email.includes('@')) {
            return {
              success: false,
              error: new ValidationError('email', 'Invalid email format'),
            };
          }
          return { success: true, value: `Welcome ${input.email}` };
        },
      };

      const result = handler.handle({ email: 'invalid' });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error).toBeInstanceOf(ValidationError);
        expect(result.error.field).toBe('email');
      }
    });
  });

  describe('ChainableHandler interface', () => {
    it('should support handler chaining', () => {
      const handler: ChainableHandler<string, string> = {
        handle: (input: string) => input.toUpperCase(),
        chain: function (next: Handler<string, string>) {
          const self = this;
          return {
            handle: (input: string) => {
              const result = self.handle(input);
              return next.handle(result);
            },
            chain: this.chain,
          };
        },
      };

      const reverseHandler: Handler<string, string> = {
        handle: (input: string) => input.split('').reverse().join(''),
      };

      const chained = handler.chain(reverseHandler);
      expect(chained.handle('hello')).toBe('OLLEH');
    });

    it('should support multiple chaining', () => {
      const trimHandler: ChainableHandler<string, string> = {
        handle: (input: string) => input.trim(),
        chain: function (next) {
          const self = this;
          return {
            handle: (input) => next.handle(self.handle(input)),
            chain: this.chain,
          };
        },
      };

      const upperHandler: ChainableHandler<string, string> = {
        handle: (input: string) => input.toUpperCase(),
        chain: function (next) {
          const self = this;
          return {
            handle: (input) => next.handle(self.handle(input)),
            chain: this.chain,
          };
        },
      };

      const exclamationHandler: Handler<string, string> = {
        handle: (input: string) => `${input}!`,
      };

      const chained = trimHandler.chain(upperHandler).chain(exclamationHandler);
      expect(chained.handle('  hello world  ')).toBe('HELLO WORLD!');
    });
  });

  describe('HandlerContext interface', () => {
    it('should pass context through handlers', () => {
      interface RequestContext {
        userId: string;
        timestamp: Date;
        metadata?: Record<string, unknown>;
      }

      const contextHandler: Handler<HandlerContext<string, RequestContext>, string> = {
        handle: ({ input, context }) => {
          return `User ${context.userId} said: ${input}`;
        },
      };

      const result = contextHandler.handle({
        input: 'Hello',
        context: {
          userId: 'user123',
          timestamp: new Date(),
        },
      });

      expect(result).toBe('User user123 said: Hello');
    });
  });

  describe('HandlerMiddleware interface', () => {
    it('should wrap handler execution', async () => {
      const logs: string[] = [];

      const loggingMiddleware: HandlerMiddleware<string, string> = {
        wrap: (handler: Handler<string, string>) => ({
          handle: (input: string) => {
            logs.push(`Before: ${input}`);
            const result = handler.handle(input);
            logs.push(`After: ${result}`);
            return result;
          },
        }),
      };

      const upperHandler: Handler<string, string> = {
        handle: (input: string) => input.toUpperCase(),
      };

      const wrapped = loggingMiddleware.wrap(upperHandler);
      const result = wrapped.handle('test');

      expect(result).toBe('TEST');
      expect(logs).toEqual(['Before: test', 'After: TEST']);
    });

    it('should support async middleware', async () => {
      const timingMiddleware: HandlerMiddleware<string, string> = {
        wrap: (handler: Handler<string, string>) => ({
          handle: (input: string) => {
            const start = Date.now();
            const result = handler.handle(input);
            const duration = Date.now() - start;
            return `${result} (${duration}ms)`;
          },
        }),
      };

      const handler: Handler<string, string> = {
        handle: (input: string) => `Processed: ${input}`,
      };

      const wrapped = timingMiddleware.wrap(handler);
      const result = wrapped.handle('test');

      expect(result).toMatch(/^Processed: test \(\d+ms\)$/);
    });
  });

  describe('HandlerPipeline interface', () => {
    it('should execute handlers in sequence', () => {
      const pipeline: HandlerPipeline<string> = {
        handlers: [],
        add: function (handler) {
          this.handlers.push(handler);
          return this;
        },
        execute: function (input) {
          return this.handlers.reduce((result, handler) => {
            return handler.handle(result);
          }, input);
        },
      };

      pipeline
        .add({ handle: (s: string) => s.trim() })
        .add({ handle: (s: string) => s.toUpperCase() })
        .add({ handle: (s: string) => `[${s}]` });

      expect(pipeline.execute('  hello  ')).toBe('[HELLO]');
    });

    it('should support async pipeline execution', async () => {
      const asyncPipeline: HandlerPipeline<string, Promise<string>> = {
        handlers: [],
        add: function (handler) {
          this.handlers.push(handler);
          return this;
        },
        execute: async function (input) {
          let result = input;
          for (const handler of this.handlers) {
            result = await (handler as AsyncHandler<string, string>).handle(result);
          }
          return result;
        },
      };

      asyncPipeline
        .add({
          handle: async (s: string) => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            return s.trim();
          },
        })
        .add({
          handle: async (s: string) => {
            await new Promise((resolve) => setTimeout(resolve, 1));
            return s.toUpperCase();
          },
        });

      const result = await asyncPipeline.execute('  test  ');
      expect(result).toBe('TEST');
    });
  });
});
