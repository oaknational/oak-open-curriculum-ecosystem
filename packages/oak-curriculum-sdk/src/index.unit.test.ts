import { describe, it, expect } from 'vitest';

// Import from the package public entrypoint (root of src)
import { isKeyStage, KEY_STAGES, isValidPathParameter, isValidPath, isAllowedMethod } from '.';

describe('Public API: type guards and allowed values', () => {
  it('exposes isKeyStage and KEY_STAGES with correct behaviour', () => {
    expect(isKeyStage('ks2')).toBe(true);
    expect(isKeyStage('nope')).toBe(false);
    expect(KEY_STAGES).toContain('ks1');
    expect(KEY_STAGES).toContain('ks2');
  });

  it('validates subject via isValidPathParameter', () => {
    expect(isValidPathParameter('subject', 'maths')).toBe(true);
    expect(isValidPathParameter('subject', 'invalid-subject')).toBe(false);
  });

  it('validates paths and methods', () => {
    expect(isValidPath('/key-stages')).toBe(true);
    expect(isValidPath('/definitely-not-a-path')).toBe(false);

    expect(isAllowedMethod('get')).toBe(true);
    expect(isAllowedMethod('post')).toBe(false);
  });
});
