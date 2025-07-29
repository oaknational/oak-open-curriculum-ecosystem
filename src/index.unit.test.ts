import { describe, it, expect } from 'vitest';
import { main } from './index.js';

describe('main', () => {
  it('should be an async function', () => {
    expect(main).toBeDefined();
    expect(main).toBeInstanceOf(Function);
    expect(main.constructor.name).toBe('AsyncFunction');
  });
});
