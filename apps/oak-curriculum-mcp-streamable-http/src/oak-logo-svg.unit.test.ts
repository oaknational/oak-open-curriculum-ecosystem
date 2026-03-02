/**
 * Unit tests for Oak logo SVG.
 *
 */

import { describe, it, expect } from 'vitest';
import { OAK_LOGO_SVG } from './oak-logo-svg.js';

describe('OAK_LOGO_SVG', () => {
  it('should not contain width or height attributes', () => {
    // SVG sizing should be controlled by CSS, not inline attributes
    // Inline width/height attributes override CSS and cause sizing issues
    expect(OAK_LOGO_SVG).not.toMatch(/width="/);
    expect(OAK_LOGO_SVG).not.toMatch(/height="/);
  });

  it('should contain viewBox for aspect ratio', () => {
    // viewBox is required for proper SVG scaling
    expect(OAK_LOGO_SVG).toContain('viewBox="0 0 32 42"');
  });

  it('should be a valid SVG element', () => {
    expect(OAK_LOGO_SVG).toMatch(/^<svg[^>]*>/);
    expect(OAK_LOGO_SVG).toContain('</svg>');
  });
});
