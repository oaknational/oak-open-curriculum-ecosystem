import { describe, it, expect } from 'vitest';
import {
  escapeHtmlForScript,
  escapeJsForScriptTag,
  wrapInScriptTag,
} from './widget-script-escaping.js';

describe('escapeHtmlForScript', () => {
  it('should escape </script> tags', () => {
    expect(escapeHtmlForScript('<p>Text</script>')).toBe('<p>Text<\\/script>');
  });

  it('should escape case-insensitive', () => {
    // Regex replacement lowercases the result
    expect(escapeHtmlForScript('</SCRIPT>')).toBe('<\\/script>');
  });

  it('should handle multiple occurrences', () => {
    const result = escapeHtmlForScript('<div></script><span></script>');
    expect(result).toBe('<div><\\/script><span><\\/script>');
  });

  it('should preserve other HTML', () => {
    expect(escapeHtmlForScript('<p>Normal</p>')).toBe('<p>Normal</p>');
  });
});

describe('escapeJsForScriptTag', () => {
  it('should escape </script> in JS strings', () => {
    const jsCode = "const html = '<p>Test</script>';";
    expect(escapeJsForScriptTag(jsCode)).toBe("const html = '<p>Test<\\/script>';");
  });

  it('should be safe to embed in HTML', () => {
    const jsCode = "const html = '<div></script>';";
    const escaped = escapeJsForScriptTag(jsCode);
    const fullHtml = `<script type="module">${escaped}</script>`;

    const scriptTags = fullHtml.match(/<\/script>/gi) || [];
    expect(scriptTags.length).toBe(1); // Only closing tag
  });
});

describe('wrapInScriptTag', () => {
  it('should wrap with escaping', () => {
    const result = wrapInScriptTag("const x = '</script>';");
    expect(result).toBe('<script type="module">const x = \'<\\/script>\';</script>');
  });

  it('should produce valid HTML', () => {
    const jsCode = `
      const html1 = '<p></script>';
      const html2 = '<div></script></div>';
    `;
    const output = wrapInScriptTag(jsCode);

    const closingTags = output.match(/<\/script>/gi) || [];
    expect(closingTags.length).toBe(1);
    expect(output).toContain('<\\/script>');
  });
});

describe('Real-world: Renderer HTML generation', () => {
  it('should handle renderer code safely', () => {
    const rendererCode = `
function renderHelp(data) {
  let h = '<div class="help">';
  h += '<p>Call get-help</script>';
  h += '</div>';
  return h;
}`;

    const escaped = escapeJsForScriptTag(rendererCode);
    const wrapped = wrapInScriptTag(escaped);

    const matches = wrapped.match(/<\/script>/gi) || [];
    expect(matches.length).toBe(1);
  });
});
