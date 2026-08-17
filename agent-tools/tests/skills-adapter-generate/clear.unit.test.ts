import { describe, expect, it } from 'vitest';

import { isMissingSurface } from '../../src/skills-adapter-generate/clear';

describe('isMissingSurface', () => {
  it('classifies an absent surface (ENOENT) as missing — read as empty, not an error', () => {
    expect(isMissingSurface({ code: 'ENOENT', message: 'no such file' })).toBe(true);
  });

  it('classifies every other failure as an error, never an empty surface', () => {
    expect(isMissingSurface({ code: 'EACCES', message: 'permission denied' })).toBe(false);
    expect(isMissingSurface({ code: 'ENOTDIR', message: 'not a directory' })).toBe(false);
    expect(isMissingSurface(new Error('plain error, no code'))).toBe(false);
    expect(isMissingSurface(undefined)).toBe(false);
  });
});
