/**
 * Unit tests for the per-tool-result size measurement.
 *
 * The handler half of the outbound token health metric: a pure, total
 * measurement over the CallToolResult fields (content vs structuredContent
 * vs _meta) — the per-field split the wire-level byte counter cannot see,
 * and the diagnostic for dual-shape duplication cost. All fields are
 * serialised-JSON character counts so the units are uniform.
 */

import { describe, it, expect } from 'vitest';
import { measureCallToolResult } from './tool-result-measurement.js';

describe('measureCallToolResult', () => {
  it('measures a dual-shape (formatToolResponse) result per field', () => {
    const content = [
      { type: 'text', text: 'Summary line.' },
      { type: 'text', text: '{"a":1}' },
    ];
    const structuredContent = { a: 1, summary: 'Summary line.' };
    const meta = { toolName: 'search' };

    const measured = measureCallToolResult({ content, structuredContent, _meta: meta });

    expect(measured).toEqual({
      contentChars: JSON.stringify(content).length,
      structuredChars: JSON.stringify(structuredContent).length,
      metaChars: JSON.stringify(meta).length,
      totalChars:
        JSON.stringify(content).length +
        JSON.stringify(structuredContent).length +
        JSON.stringify(meta).length,
      tokensEst: Math.ceil(
        (JSON.stringify(content).length +
          JSON.stringify(structuredContent).length +
          JSON.stringify(meta).length) /
          4,
      ),
    });
  });

  it('measures a structuredContent-only result (empty content array still counts as [])', () => {
    const structuredContent = { answerType: 'strand-lookup', members: [] };

    const measured = measureCallToolResult({ content: [], structuredContent });

    expect(measured.contentChars).toBe('[]'.length);
    expect(measured.structuredChars).toBe(JSON.stringify(structuredContent).length);
    expect(measured.metaChars).toBe(0);
    expect(measured.totalChars).toBe(measured.contentChars + measured.structuredChars);
    expect(measured.tokensEst).toBe(Math.ceil(measured.totalChars / 4));
  });

  it('counts absent fields as zero', () => {
    const measured = measureCallToolResult({
      content: [{ type: 'text', text: 'refusal' }],
      isError: true,
    });

    expect(measured.structuredChars).toBe(0);
    expect(measured.metaChars).toBe(0);
    expect(measured.totalChars).toBe(measured.contentChars);
  });

  it('records zero, never throwing, for an unstringifiable field', () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    const measured = measureCallToolResult({ content: [], structuredContent: circular });

    expect(measured.structuredChars).toBe(0);
    expect(measured.contentChars).toBe('[]'.length);
    expect(measured.totalChars).toBe('[]'.length);
  });
});
