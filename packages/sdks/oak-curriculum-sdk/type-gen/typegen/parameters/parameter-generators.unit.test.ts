import { describe, it, expect } from 'vitest';
import { generateAllParameterConstants } from './parameter-generators';

describe('generateAllParameterConstants', () => {
  it('should generate constants for keyStage parameters', () => {
    const parameters = {
      keyStage: ['ks1', 'ks2', 'ks3', 'ks4'],
    };

    const result = generateAllParameterConstants(parameters);

    // Should generate KEY_STAGES constant with values
    expect(result).toContain('export const KEY_STAGES = [');
    expect(result).toContain('ks1');
    expect(result).toContain('ks2');
    expect(result).toContain('ks3');
    expect(result).toContain('ks4');

    // Should generate type guard
    expect(result).toContain('export function isKeyStage');
    expect(result).toContain('value is KeyStage');
  });

  it('should generate constants for subject parameters', () => {
    const parameters = {
      subject: ['maths', 'english', 'science'],
    };

    const result = generateAllParameterConstants(parameters);

    // Should generate SUBJECTS constant with values
    expect(result).toContain('export const SUBJECTS = [');
    expect(result).toContain('maths');
    expect(result).toContain('english');
    expect(result).toContain('science');

    // Should generate type guard
    expect(result).toContain('export function isSubject');
    expect(result).toContain('value is Subject');
  });

  it('should handle multiple parameter types (omit empty groups)', () => {
    const parameters = {
      keyStage: ['ks1', 'ks2'],
      subject: ['maths', 'english'],
      lesson: [],
    };

    const result = generateAllParameterConstants(parameters);

    // Should generate non-empty constants and omit empty groups
    expect(result).toContain('export const KEY_STAGES');
    expect(result).toContain('export const SUBJECTS');
    expect(result).not.toContain('export const LESSONS');
  });

  it('should handle missing parameters gracefully by omitting outputs', () => {
    const parameters = {};

    const result = generateAllParameterConstants(parameters);

    // No parameters present: nothing should be emitted
    expect(result).toBe('');
  });
});
