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
    const code = emitErrorDescription(
      {
        lesson: { typePrimitive: 'string', valueConstraint: false, required: true },
      },
      {
        q: { typePrimitive: 'string', valueConstraint: false, required: true },
      },
    );

    expect(code).toContain('export const describeToolArgs = (): string => {');
    expect(code).toContain('Invalid request parameters. Please match the following schema:');
    expect(code).toContain('Schema:');
    expect(code).toContain('Required:');
    expect(code).not.toContain('getValidRequestParamsDescription');

    expect(code.trim().endsWith('};')).toBe(true);

    expect(code).toContain('"lesson"');
    expect(code).toContain('"q"');

    const requiredMatch = /Required: ([^\n]*)/.exec(code);
    expect(requiredMatch).not.toBeNull();
    expect(requiredMatch?.[1]).toContain('lesson');
    expect(requiredMatch?.[1]).toContain('q');
  });
});
