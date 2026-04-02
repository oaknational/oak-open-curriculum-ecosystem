import { describe, expect, it } from 'vitest';
import { buildOakDesignTokensCss } from './build-css.js';

describe('buildOakDesignTokensCss', () => {
  it('emits light and dark theme selectors', () => {
    const css = buildOakDesignTokensCss();

    expect(css).toContain(':root {');
    expect(css).toContain("[data-theme='dark'] {");
  });

  it('keeps palette variables out of the dark theme override block', () => {
    const css = buildOakDesignTokensCss();
    const darkBlock = css.split("[data-theme='dark'] {")[1] ?? '';

    expect(darkBlock).toContain('--oak-semantic-surface-page:');
    expect(darkBlock).not.toContain('--oak-color-');
  });
});
