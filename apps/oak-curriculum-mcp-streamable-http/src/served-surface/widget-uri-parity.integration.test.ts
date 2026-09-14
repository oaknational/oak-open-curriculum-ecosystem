/**
 * Advertised ⊆ registered: every registered live tool advertising an MCP
 * Apps UI via `_meta.ui.resourceUri` must have that URI registered as a
 * resource on the same served surface (MCP-187).
 *
 * Advertisement and registration key both dereference the one generated
 * `WIDGET_URI` constant (ADR-141, widget URI identity amendment), so this
 * parity holds by construction. The
 * structural guard against a hand-frozen copy of the address is the
 * `no-restricted-syntax` ban on `ui://widget/` literals in this app's
 * `eslint.config.ts` (a re-frozen key is a lint error, not a test failure);
 * this test stands as the forward guard for any divergence visible at
 * registration time.
 *
 * Deliberate semantics: flipping the widget resource dormant while a
 * widget-advertising tool stays live FAILS this test by design — the
 * coherent move is removing the advertisement at its source, the two
 * handwritten definitions (`aggregated-curriculum-model/definition.ts`,
 * `aggregated-user-search/tool-definition.ts` in the SDK).
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { walkCanonicalRegistration } from '../test-helpers/registration-walk.js';

/** Narrow schema for the advertisement shape this suite cares about. */
const UI_ADVERTISING_CONFIG = z
  .object({
    _meta: z.object({ ui: z.object({ resourceUri: z.string() }).loose() }).loose(),
  })
  .loose();

describe('widget URI parity (advertised ⊆ registered)', () => {
  const walk = walkCanonicalRegistration();
  const advertised = [...walk.toolConfigs.entries()].flatMap(([name, config]) => {
    const parsed = UI_ADVERTISING_CONFIG.safeParse(config);
    return parsed.success ? [{ name, uri: parsed.data._meta.ui.resourceUri }] : [];
  });

  it('has at least one live UI-advertising tool (non-vacuity guard)', () => {
    expect(advertised.length).toBeGreaterThan(0);
    expect(advertised.map((entry) => entry.name)).toContain('get-curriculum-model');
  });

  it('registers every advertised _meta.ui.resourceUri as a resource', () => {
    for (const { name, uri } of advertised) {
      expect(
        walk.resourceUris.has(uri),
        `tool ${name} advertises ${uri}, which is not among registered resources: ${[...walk.resourceUris].join(', ')}`,
      ).toBe(true);
    }
  });
});
