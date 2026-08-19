/**
 * Integration tests: the served-surface definition governs registration.
 *
 * Proves the ratified plan's acceptance criteria on the tool surface:
 * - the registered set is exactly the definition's live set (AC2's tool
 *   half / AC4's one-definition rule), and
 * - every served tool carries a title and a read-only annotation hint
 *   (AC3), walked at registration time.
 *
 * Dormant tools are structurally absent from registration — no runtime
 * flag can resurface them; tests inject a variant definition to exercise
 * dormant rows (the sanctioned test seam; production always uses the
 * canonical module-level constant).
 */

import { describe, it, expect } from 'vitest';
import { typeSafeKeys } from '@oaknational/type-helpers';
import {
  listUniversalTools,
  generatedToolRegistry,
} from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { SERVED_SURFACE, liveToolNames, type ServedSurfaceDefinition } from './served-surface.js';
import { liveResourceRegistrationNames } from '../register-resources.js';
import { walkCanonicalRegistration } from '../test-helpers/registration-walk.js';

describe('served-surface registration (integration)', () => {
  it('registers exactly the live set — dormant tools are structurally absent', () => {
    const walk = walkCanonicalRegistration();
    const registered = new Set(walk.toolConfigs.keys());

    const expectedLive = new Set<string>([
      ...Object.entries(SERVED_SURFACE.universalTools)
        .filter(([, state]) => state === 'live')
        .map(([name]) => name),
      ...Object.entries(SERVED_SURFACE.appLocalTools)
        .filter(([, state]) => state === 'live')
        .map(([name]) => name),
    ]);

    expect(registered).toEqual(expectedLive);
    expect(registered.has('user-search')).toBe(false);
    expect(registered.has('user-search-query')).toBe(false);
  });

  it('walks every registered tool and finds a title and a read-only hint', () => {
    const walk = walkCanonicalRegistration();

    expect(walk.toolConfigs.size).toBeGreaterThan(0);
    for (const [name, config] of walk.toolConfigs) {
      expect(config, `tool ${name} is missing a title`).toHaveProperty(
        'title',
        expect.stringMatching(/\S/),
      );
      expect(config, `tool ${name} is missing annotations.readOnlyHint: true`).toMatchObject({
        annotations: { readOnlyHint: true },
      });
    }
  });

  it('a test-injected definition with user-search live registers the pair (the e2e activation seam)', () => {
    const withUserSearchLive: ServedSurfaceDefinition = {
      universalTools: {
        ...SERVED_SURFACE.universalTools,
        'user-search': 'live',
        'user-search-query': 'live',
      },
      appLocalTools: SERVED_SURFACE.appLocalTools,
      resources: SERVED_SURFACE.resources,
    };
    const walk = walkCanonicalRegistration(withUserSearchLive);
    const registered = new Set(walk.toolConfigs.keys());

    expect(registered.has('user-search')).toBe(true);
    expect(registered.has('user-search-query')).toBe(true);
    // Recomputed from the injected definition: everything enumerated
    // registers except any row the definition still holds dormant (none
    // today under the canonical definition this variant inherits; the
    // recomputation keeps the pin honest if a row is gated later).
    const stillDormant = Object.values(withUserSearchLive.universalTools).filter(
      (state) => state === 'dormant',
    ).length;
    const universalCount = listUniversalTools(generatedToolRegistry).length;
    expect(registered.size).toBe(universalCount + 1 - stillDormant);
  });
});

describe('product-analytics label closure (MCP-241)', () => {
  it('liveToolNames matches exactly the tool set the real registration path registers', () => {
    const walk = walkCanonicalRegistration();

    expect(new Set(liveToolNames(SERVED_SURFACE))).toEqual(new Set(walk.toolConfigs.keys()));
  });

  // Since the MCP-337 descriptor, names and registrar calls derive from one
  // unit list, so this no longer fences two hand-maintained mirrors. It
  // still pins what no descriptor can make structural: that each entry's
  // registrar registers under the entry's name across module boundaries
  // (e.g. the widget name literal lives in register-widget-resource.ts),
  // and that handlers.ts actually drives registerAllResources with the
  // canonical definition. Multiplicity-preserving: a duplicate name cannot
  // hide inside set semantics.
  it('liveResourceRegistrationNames matches exactly the resource names the real registration path registers', () => {
    const walk = walkCanonicalRegistration();

    expect(
      [...liveResourceRegistrationNames(SERVED_SURFACE)].sort((left, right) =>
        left.localeCompare(right),
      ),
    ).toStrictEqual([...walk.resourceNameList].sort((left, right) => left.localeCompare(right)));
  });

  // Per-unit gate isolation: flipping any single resource row to its
  // opposite state must keep labels and registrations in lockstep. Under
  // the canonical surface alone, two live units could swap their
  // advertised names and still agree as sets; a flipped gate makes a
  // swapped name/registrar pairing diverge, so this sweep pins the pairing
  // unit by unit (the documentation rows also exercise the all-or-nothing
  // every-gate from both directions).
  it.each(typeSafeKeys(SERVED_SURFACE.resources))(
    'labels track registrations exactly when the %s row flips state',
    (uri) => {
      const flipped: ServedSurfaceDefinition = {
        universalTools: SERVED_SURFACE.universalTools,
        appLocalTools: SERVED_SURFACE.appLocalTools,
        resources: {
          ...SERVED_SURFACE.resources,
          [uri]: SERVED_SURFACE.resources[uri] === 'live' ? 'dormant' : 'live',
        },
      };
      const walk = walkCanonicalRegistration(flipped);

      expect(
        [...liveResourceRegistrationNames(flipped)].sort((left, right) =>
          left.localeCompare(right),
        ),
      ).toStrictEqual([...walk.resourceNameList].sort((left, right) => left.localeCompare(right)));
    },
  );
});
