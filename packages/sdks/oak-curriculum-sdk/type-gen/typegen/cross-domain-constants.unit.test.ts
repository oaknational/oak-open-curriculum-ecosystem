import { describe, it, expect } from 'vitest';
import { BASE_WIDGET_URI } from './cross-domain-constants.js';

describe('BASE_WIDGET_URI', () => {
  it('should have format ui://widget/oak-json-viewer-<hash>.html', () => {
    expect(BASE_WIDGET_URI).toMatch(/^ui:\/\/widget\/oak-json-viewer-[a-f0-9]{8}\.html$/);
  });

  it('should include 8-character hex hash', () => {
    const match = BASE_WIDGET_URI.match(/-([a-f0-9]{8})\.html$/);
    expect(match).not.toBeNull();
    expect(match).toHaveLength(2);
    if (match) {
      expect(match[1]).toHaveLength(8);
    }
  });

  it('should start with ui://widget/oak-json-viewer- prefix', () => {
    expect(BASE_WIDGET_URI).toMatch(/^ui:\/\/widget\/oak-json-viewer-/);
  });

  it('should end with .html extension', () => {
    expect(BASE_WIDGET_URI).toMatch(/\.html$/);
  });
});
