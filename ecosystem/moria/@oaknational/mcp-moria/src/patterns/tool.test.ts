/**
 * @fileoverview Tests for Tool patterns
 * @module moria/patterns/tool.test
 */

import { describe, it, expect } from 'vitest';
import type {
  ToolExecutor,
  ToolDefinition,
  Tool,
  ToolRegistry,
  ToolValidator,
} from './tool';

describe('Tool patterns', () => {
  describe('ToolExecutor interface', () => {
    it('should define execute method', async () => {
      const mockExecutor: ToolExecutor<string, number> = {
        execute: async (input: string) => {
          return input.length;
        },
      };

      expect(mockExecutor.execute).toBeDefined();
      expect(typeof mockExecutor.execute).toBe('function');

      const result = await mockExecutor.execute('test');
      expect(result).toBe(4);
    });
  });

  describe('ToolDefinition interface', () => {
    it('should define tool metadata', () => {
      const mockDefinition: ToolDefinition = {
        name: 'test-tool',
        description: 'A test tool',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string' },
          },
          required: ['query'],
        },
      };

      expect(mockDefinition.name).toBe('test-tool');
      expect(mockDefinition.description).toBe('A test tool');
      expect(mockDefinition.inputSchema.type).toBe('object');
      expect(mockDefinition.inputSchema.properties).toBeDefined();
      expect(mockDefinition.inputSchema.required).toEqual(['query']);
    });
  });

  describe('Tool interface', () => {
    it('should combine definition and executor', async () => {
      const mockTool: Tool<string, number> = {
        definition: {
          name: 'length-calculator',
          description: 'Calculates string length',
          inputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string' },
            },
          },
        },
        executor: {
          execute: async (input: string) => input.length,
        },
      };

      expect(mockTool.definition).toBeDefined();
      expect(mockTool.executor).toBeDefined();

      const result = await mockTool.executor.execute('hello');
      expect(result).toBe(5);
    });
  });

  describe('ToolRegistry interface', () => {
    it('should manage tool collections', () => {
      const tools = new Map<string, Tool>();

      const mockRegistry: ToolRegistry = {
        register: (tool: Tool) => {
          tools.set(tool.definition.name, tool);
        },
        get: (name: string) => {
          return tools.get(name);
        },
        getAll: () => {
          return Array.from(tools.values());
        },
        has: (name: string) => {
          return tools.has(name);
        },
        clear: () => {
          tools.clear();
        },
      };

      const testTool: Tool = {
        definition: {
          name: 'test',
          description: 'Test tool',
          inputSchema: { type: 'object', properties: {} },
        },
        executor: {
          execute: async () => 'result',
        },
      };

      mockRegistry.register(testTool);
      expect(mockRegistry.has('test')).toBe(true);
      expect(mockRegistry.get('test')).toBe(testTool);
      expect(mockRegistry.getAll()).toEqual([testTool]);

      mockRegistry.clear();
      expect(mockRegistry.has('test')).toBe(false);
    });

    it('should support optional unregister method', () => {
      const mockRegistryWithUnregister: ToolRegistry = {
        register: (tool: Tool) => {},
        get: (name: string) => undefined,
        getAll: () => [],
        has: (name: string) => false,
        clear: () => {},
        unregister: (name: string) => {
          return true;
        },
      };

      expect(mockRegistryWithUnregister.unregister).toBeDefined();
      expect(mockRegistryWithUnregister.unregister!('test')).toBe(true);
    });
  });

  describe('ToolValidator interface', () => {
    it('should validate input types', () => {
      interface StringInput {
        text: string;
      }

      const mockValidator: ToolValidator<StringInput> = {
        validate: (input: unknown): input is StringInput => {
          return (
            typeof input === 'object' &&
            input !== null &&
            'text' in input &&
            typeof (input as any).text === 'string'
          );
        },
      };

      expect(mockValidator.validate).toBeDefined();
      expect(mockValidator.validate({ text: 'hello' })).toBe(true);
      expect(mockValidator.validate({ text: 123 })).toBe(false);
      expect(mockValidator.validate({})).toBe(false);
      expect(mockValidator.validate(null)).toBe(false);
    });
  });
});
