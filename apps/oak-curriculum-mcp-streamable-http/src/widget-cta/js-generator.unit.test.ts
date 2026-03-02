/**
 * Unit tests for CTA JavaScript generator.
 *
 * Covers template literal escaping and safe JS generation
 * for CTA config entries with special characters.
 *
 * @see ./js-generator.ts
 */

import { describe, it, expect } from 'vitest';
import { escapeForTemplateLiteral, generateCtaHandlerJs } from './js-generator.js';

describe('escapeForTemplateLiteral', () => {
  it('should escape backticks', () => {
    const input = 'Use `get-help` tool';
    const output = escapeForTemplateLiteral(input);

    // Backticks should be escaped with backslash
    expect(output).toBe('Use \\`get-help\\` tool');

    // Verify it's safe to embed in a template literal
    const embedded = `prompt: \`${output}\``;
    expect(embedded).toBe('prompt: `Use \\`get-help\\` tool`');
  });

  it('should escape backslashes', () => {
    const input = 'Path: C:\\Users\\file.txt';
    const output = escapeForTemplateLiteral(input);

    // Each backslash should be doubled
    expect(output).toBe('Path: C:\\\\Users\\\\file.txt');
  });

  it('should escape template expression syntax', () => {
    const input = 'Variable: ${name}';
    const output = escapeForTemplateLiteral(input);

    // ${} should be escaped
    expect(output).toBe('Variable: \\${name}');
  });

  it('should escape multiple special characters in one string', () => {
    const input = 'Call `get-help` and ${process.env.VAR}';
    const output = escapeForTemplateLiteral(input);

    expect(output).toBe('Call \\`get-help\\` and \\${process.env.VAR}');
  });

  it('should handle empty string', () => {
    expect(escapeForTemplateLiteral('')).toBe('');
  });

  it('should handle string with no special characters', () => {
    const input = 'Hello world';
    expect(escapeForTemplateLiteral(input)).toBe('Hello world');
  });

  it('should escape backslash before backtick correctly', () => {
    // Edge case: \` should become \\`
    const input = 'Escaped backtick: \\`';
    const output = escapeForTemplateLiteral(input);

    // Backslash doubled, then backtick escaped
    expect(output).toBe('Escaped backtick: \\\\\\`');
  });

  it('should handle the actual CTA prompt with multiple backticks', () => {
    const input = `First, call the \`get-help\` tool to get an overview of the resources.
The response should include \`get-ontology\`. Call those tools now.`;

    const output = escapeForTemplateLiteral(input);

    // All backticks should be escaped
    expect(output).toContain('\\`get-help\\`');
    expect(output).toContain('\\`get-ontology\\`');

    // Verify no unescaped backticks remain
    const unescapedBacktickPattern = /(?<!\\)`/g;
    const matches = output.match(unescapedBacktickPattern);
    expect(matches).toBeNull();
  });

  it('should produce valid JavaScript when embedded in template literal', () => {
    const input = 'Use `tool` and ${var}';
    const escaped = escapeForTemplateLiteral(input);

    // Simulate how it's used in generated code
    const jsCode = `const prompt = \`${escaped}\`;`;

    // This should be valid JavaScript (no syntax error when evaluated)
    expect(() => {
      new Function(jsCode);
    }).not.toThrow();

    // And the result should have the escaped characters
    expect(jsCode).toBe('const prompt = `Use \\`tool\\` and \\${var}`;');
  });

  it('should handle consecutive special characters', () => {
    const input = '```${test}```';
    const output = escapeForTemplateLiteral(input);

    expect(output).toBe('\\`\\`\\`\\${test}\\`\\`\\`');
  });

  it('should handle newlines and maintain them', () => {
    const input = `Line 1 with \`backtick\`
Line 2 with \${var}`;
    const output = escapeForTemplateLiteral(input);

    expect(output).toContain('\n');
    expect(output).toBe('Line 1 with \\`backtick\\`\nLine 2 with \\${var}');
  });
});

describe('generateCtaHandlerJs', () => {
  const domStubs = [
    'const document = { readyState: "complete", getElementById: () => null, addEventListener: () => {} };',
    'const window = { openai: null };',
  ].join('\n');

  function evalCtaJs(js: string): unknown {
    const factory = new Function(`${domStubs}\n${js}\nreturn CTA_CONFIGS;`);
    return factory();
  }

  it('generates parseable JavaScript', () => {
    const js = generateCtaHandlerJs();
    expect(() => new Function(`${domStubs}\n${js}`)).not.toThrow();
  });

  it('generates CTA_CONFIGS array that is valid JavaScript', () => {
    const configs = evalCtaJs(generateCtaHandlerJs());
    expect(Array.isArray(configs)).toBe(true);
  });

  it('returns a non-empty CTA_CONFIGS array with required string fields', () => {
    const configs = evalCtaJs(generateCtaHandlerJs());
    expect(Array.isArray(configs)).toBe(true);
    expect(configs).toHaveProperty('length');
    expect(configs).toHaveProperty('[0].id');
    expect(configs).toHaveProperty('[0].buttonText');
    expect(configs).toHaveProperty('[0].loadingText');
    expect(configs).toHaveProperty('[0].understoodText');
  });
});
