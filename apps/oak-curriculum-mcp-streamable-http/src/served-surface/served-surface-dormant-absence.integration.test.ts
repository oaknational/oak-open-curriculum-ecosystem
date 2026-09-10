/**
 * Cross-surface dormant-absence invariant (owner standing invariant,
 * recorded on MCP-101, 2026-07-23): the served-surface definition is a
 * set of switches — no code deletion — and EVERY rendered surface
 * respects the state. For each dormant entry, this walk asserts absence
 * from each surface that renders or serves inventory.
 *
 * The surfaces are enumerated in ONE place (`TOOL_SURFACES` /
 * `RESOURCE_SURFACES`) so a future surface joins the walk by adding one
 * entry. Known future joiner: the MCP-121 instruction-tier generation
 * (server instructions / context hints) joins the same walk when it
 * lands — add its rendered text as a surface here.
 *
 * The two landing-page surfaces this walk used to cover left with the page
 * itself (2026-08-20: this host serves no HTML). The invariant is
 * unchanged; it now has two fewer places to be violated.
 *
 * The generated widget content does not enumerate tools or resources
 * (verified 2026-07-23: its only matches are minified-JS tokens), so it
 * carries no surface entry yet; if it ever renders inventory, it joins
 * the walk like any other surface. SERVER_INSTRUCTIONS (served at
 * initialize) names tools in prose and is currently clean of dormant
 * names — it joins the walk with the MCP-121 instruction tier. The
 * appLocalTools map is not walked (no dormant app-local tool exists);
 * a first dormant app-local row adds its surface here.
 */

import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import { getCurriculumModelJson } from '@oaknational/curriculum-sdk/public/mcp-tools.js';
import { SERVED_SURFACE } from './served-surface.js';
import { filterCurriculumModelJson } from './filter-guidance-content.js';
import { walkCanonicalRegistration } from '../test-helpers/registration-walk.js';

/** Tool names the canonical definition holds dormant. */
const DORMANT_TOOLS = Object.entries(SERVED_SURFACE.universalTools)
  .filter(([, state]) => state === 'dormant')
  .map(([name]) => name);

/** Resource URIs the canonical definition holds dormant. */
const DORMANT_RESOURCES = Object.entries(SERVED_SURFACE.resources)
  .filter(([, state]) => state === 'dormant')
  .map(([uri]) => uri);

/** One registration walk under the canonical definition, computed once. */
function walkRegistration(): {
  readonly tools: ReadonlySet<string>;
  readonly resources: ReadonlySet<string>;
} {
  const walk = walkCanonicalRegistration();
  return {
    tools: new Set(walk.toolConfigs.keys()),
    resources: walk.resourceUris,
  };
}

const registration = walkRegistration();

/**
 * Structured tool references in the SERVED curriculum-model guidance —
 * read through the same serve-boundary filter the resource and tool
 * legs apply (interim cure; the MCP-121 statement model replaces it
 * structurally, and this surface entry then probes the model's own
 * served projection). Category `tools` arrays are the structured
 * references; workflow steps and prose are MCP-121 territory.
 */
const GUIDANCE_TOOL_REFS: ReadonlySet<string> = (() => {
  const MODEL = z
    .object({
      toolGuidance: z
        .object({
          toolCategories: z.record(
            z.string(),
            z.object({ tools: z.array(z.string()).optional() }).loose(),
          ),
        })
        .loose(),
    })
    .loose();
  const parsed = MODEL.parse(JSON.parse(filterCurriculumModelJson(getCurriculumModelJson())));
  return new Set(
    Object.values(parsed.toolGuidance.toolCategories).flatMap((category) => category.tools ?? []),
  );
})();

/**
 * The single enumeration of tool-rendering surfaces. A surface maps a
 * tool name to "does this surface present it?", and names one LIVE
 * control whose presence proves the probe still matches the surface's
 * real rendering (a drifted probe must fail the control, never
 * vacuously pass the absences).
 */
const TOOL_SURFACES: readonly {
  surface: string;
  presents: (name: string) => boolean;
  liveControl: string;
}[] = [
  {
    surface: 'MCP registration (tools/list)',
    presents: (name) => registration.tools.has(name),
    liveControl: 'search',
  },
  {
    surface: 'served guidance content (curriculum-model tool references)',
    presents: (name) => GUIDANCE_TOOL_REFS.has(name),
    liveControl: 'search',
  },
];

/** The single enumeration of resource-rendering surfaces (same shape). */
const RESOURCE_SURFACES: readonly {
  surface: string;
  presents: (uri: string) => boolean;
  liveControl: string;
}[] = [
  {
    surface: 'MCP registration (resources/list)',
    presents: (uri) => registration.resources.has(uri),
    liveControl: 'curriculum://model',
  },
];

describe('dormant-absence invariant (every surface respects the definition)', () => {
  it('has dormant entries to walk (the invariant is not vacuous)', () => {
    expect(DORMANT_TOOLS.length).toBeGreaterThan(0);
    expect(DORMANT_RESOURCES.length).toBeGreaterThan(0);
  });

  for (const { surface, presents, liveControl } of TOOL_SURFACES) {
    it(`${surface}: probe sees the live control, and no dormant tool`, () => {
      expect(presents(liveControl), `${surface} probe lost ${liveControl} — probe drift`).toBe(
        true,
      );
      for (const name of DORMANT_TOOLS) {
        expect(presents(name), `${surface} presents dormant tool ${name}`).toBe(false);
      }
    });
  }

  for (const { surface, presents, liveControl } of RESOURCE_SURFACES) {
    it(`${surface}: probe sees the live control, and no dormant resource`, () => {
      expect(presents(liveControl), `${surface} probe lost ${liveControl} — probe drift`).toBe(
        true,
      );
      for (const uri of DORMANT_RESOURCES) {
        expect(presents(uri), `${surface} presents dormant resource ${uri}`).toBe(false);
      }
    });
  }
});
