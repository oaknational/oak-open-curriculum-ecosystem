import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

describe('widget index.css', () => {
  it('imports the shared Oak token package CSS', () => {
    const css = readFileSync(resolve(process.cwd(), 'widget/src/index.css'), 'utf8');

    expect(css).toContain("@import '@oaknational/oak-design-tokens/index.css';");
  });
});
