import { describe, expect, it } from 'vitest';

import { escapeHtml, fromReportDir } from './fidelity-html';

describe('escapeHtml', () => {
  it('escapes every markup-significant character', () => {
    expect(escapeHtml('<b> & "q"')).toBe('&lt;b&gt; &amp; &quot;q&quot;');
  });

  it('escapes the ampersand FIRST, so already-escaped input double-escapes rather than passing through', () => {
    // The ordering is load-bearing: running '&' after '<' would re-escape
    // the entities escapeHtml itself just produced, corrupting every
    // escaped character in the report. This discriminates that mutation.
    expect(escapeHtml('&lt;')).toBe('&amp;lt;');
  });

  it('leaves benign text untouched', () => {
    expect(escapeHtml('picker-oak-fold: 0.12%')).toBe('picker-oak-fold: 0.12%');
  });
});

describe('fromReportDir', () => {
  it('resolves a demo-dir-relative path from two levels down', () => {
    expect(fromReportDir('demo-evidence/live-picker-oak-fold.png')).toBe(
      '../../demo-evidence/live-picker-oak-fold.png',
    );
  });
});
