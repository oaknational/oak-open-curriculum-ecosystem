/**
 * Unit tests for `buildOakUnderTheHoodToolResult` (pointer shape), behaviour-only.
 *
 * These describe the SHAPE the tool returns — the ADR-058 dual shape carrying a
 * pointer (summary, JSON body, and a `resource_link` to the canonical), with the
 * curriculum firewall held structurally (no `oakContextHint`). They never compare
 * the result to a baked-content constant: there is no baked body to pin, and a
 * content pin would only prove the fixture, not the behaviour. The `resource_link`
 * required fields (`uri`, `name`) are enforced at compile time by the `ResourceLink`
 * type and asserted on the wire in the e2e test.
 */

import { describe, it, expect } from 'vitest';
import { buildOakUnderTheHoodToolResult } from './oak-under-the-hood-tool.js';

describe('buildOakUnderTheHoodToolResult (unit)', () => {
  it('returns a non-error ADR-058 dual shape (summary + JSON body + resource_link, with structuredContent)', () => {
    const result = buildOakUnderTheHoodToolResult();

    expect(result.isError).not.toBe(true);
    expect(result.content).toHaveLength(3);
    expect(result.content[0]?.type).toBe('text');
    expect(result.content.map((block) => block.type)).toContain('resource_link');
    expect(result.structuredContent).toBeDefined();
  });

  it('points at the canonical via a https canonicalUrl and carries no baked body', () => {
    const result = buildOakUnderTheHoodToolResult();
    const structured = result.structuredContent;

    expect(structured).toBeDefined();
    expect(typeof structured?.canonicalUrl).toBe('string');
    expect(structured?.canonicalUrl).toMatch(/^https:\/\//);
    // No baked orientation body: the tool points, it does not carry content.
    expect(structured).not.toHaveProperty('orientation');
  });

  it('does not carry oakContextHint (curriculum firewall, held structurally)', () => {
    const result = buildOakUnderTheHoodToolResult();
    expect(result.structuredContent).not.toHaveProperty('oakContextHint');
  });
});
