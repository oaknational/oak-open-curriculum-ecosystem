import { describe, it, expect } from 'vitest';
import type { PrimitiveType } from './param-utils.js';
import { emitErrorDescription } from './emit-error-description.js';

interface ParamMetadataLike {
  readonly typePrimitive: PrimitiveType;
  readonly valueConstraint: boolean;
  readonly required: boolean;
  readonly allowedValues?: readonly unknown[];
  readonly description?: string;
  readonly default?: unknown;
}

type MetaRecord = Record<string, ParamMetadataLike>;

describe('emitErrorDescription (compile-time literal emitter)', () => {
  it('produces a compact literal with schema JSON and required list', () => {
    const pathMeta: MetaRecord = {
      lesson: {
        typePrimitive: 'string',
        valueConstraint: false,
        required: true,
        description: 'Lesson slug',
      },
    };
    const queryMeta: MetaRecord = {
      subject: {
        typePrimitive: 'string',
        valueConstraint: true,
        required: false,
        allowedValues: ['maths', 'english'],
      },
    };
    const block = emitErrorDescription(pathMeta, queryMeta);

    // Basic shape (behavioural, not exact signature)
    expect(block.includes('const getValidRequestParamsDescription= ')).toBe(true);
    expect(block.trim().endsWith('};')).toBe(true);

    // Content checks
    expect(block).toContain('Invalid request parameters. Please match the following schema:');
    expect(block).toContain('Schema:');
    expect(block).toContain('Required:');

    // Compact JSON should include our keys
    expect(block).toContain('"lesson"');
    expect(block).toContain('"subject"');

    // Required should list lesson, not subject
    expect(block).toMatch(/Required: ([^\n]*)/);
  });
});
