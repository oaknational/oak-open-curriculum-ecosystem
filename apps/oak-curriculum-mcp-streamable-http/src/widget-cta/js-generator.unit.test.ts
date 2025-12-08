/**
 * Unit tests for CTA JavaScript generator, specifically template literal escaping.
 *
 * @module widget-cta/js-generator.unit.test
 */

import { describe, it, expect } from 'vitest';
import { escapeForTemplateLiteral } from './js-generator.js';

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
The response should include \`get-ontology\` and \`get-knowledge-graph\`. Call those tools now.`;

    const output = escapeForTemplateLiteral(input);

    // All backticks should be escaped
    expect(output).toContain('\\`get-help\\`');
    expect(output).toContain('\\`get-ontology\\`');
    expect(output).toContain('\\`get-knowledge-graph\\`');

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
