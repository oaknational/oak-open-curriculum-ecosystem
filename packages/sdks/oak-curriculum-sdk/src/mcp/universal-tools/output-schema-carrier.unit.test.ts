/**
 * c0 — universal-tools output-schema carrier proof.
 *
 * The shared registration carrier (`UniversalToolListEntry`) must be able to
 * hold a `z.object(...)` `inputSchema` and an additive optional `outputSchema`,
 * so a graph tool that registers through the universal-tools path (EEF, c1) does
 * so with no `as` cast. Before c0 the carrier's `inputSchema` is `z.ZodRawShape`
 * (a raw shape, not a `z.object` value) and there is no `outputSchema` field.
 *
 * The `satisfies UniversalToolListEntry` assertion is the red→green signal and
 * is enforced by `pnpm type-check` (`tsconfig.lint.json` type-checks
 * `**\/*.test.ts`); the vitest run transpiles the types away, so the runtime
 * block only confirms that both schemas serialise to an object root through the
 * SDK's `z.toJSONSchema`.
 */
import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import type { UniversalToolListEntry } from './types.js';

describe('universal-tools output-schema carrier (c0)', () => {
  it('holds a z.object inputSchema and an additive outputSchema with no cast', () => {
    const entry = {
      name: 'search',
      title: 'Carrier proof',
      description: 'A z.object inputSchema plus an outputSchema must type-check unaided.',
      inputSchema: z.object({ function: z.literal('inspect-strand') }),
      outputSchema: z.object({ members: z.array(z.unknown()) }),
      _meta: {},
    } satisfies UniversalToolListEntry;

    expect(z.toJSONSchema(entry.inputSchema)).toMatchObject({ type: 'object' });
    expect(z.toJSONSchema(entry.outputSchema)).toMatchObject({ type: 'object' });
  });

  it('keeps outputSchema optional — an entry without one still satisfies the carrier', () => {
    const entry: UniversalToolListEntry = {
      name: 'get-curriculum-model',
      title: 'No output schema',
      description: 'Tools without an output schema remain valid carrier entries.',
      inputSchema: {},
      _meta: {},
    };

    expect(entry.outputSchema).toBeUndefined();
  });
});
