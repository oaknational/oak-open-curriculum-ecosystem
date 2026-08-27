import { describe, expect, it } from 'vitest';
import { z } from 'zod';

import { readRepoDocument } from '../../src/collaboration-state/test-helpers/repo-doc.js';

/**
 * The shipped plugin's MCP server binding must name the production endpoint.
 *
 * @remarks
 * MCP-302. `plugins/oak-open-curriculum/.mcp.json` is not repo configuration —
 * it is the binding every installing user receives, so a non-production host
 * there points the public plugin at an invite-only surface. The alpha host is
 * still the correct target for internal development config (`.mcp.json.example`,
 * `.cursor/mcp.json`) and for the recorded conformance fixtures, which is why
 * this guard is scoped to the shipped plugin rather than sweeping the repo.
 *
 * The canonical URL is stated literally here on purpose. The app resolves its
 * own origin from the `CANONICAL_HOST` environment variable, so there is no
 * source constant to derive from — for the shipped plugin's binding, this test
 * is the authority rather than a copy of one.
 *
 * Repointed from `www.thenational.academy/mcp` to `mcp.thenational.academy/mcp`
 * at the owner's domain move (MCP-622, decided 2026-08-19; plugin repoint
 * MCP-638). The www host no longer serves the MCP protocol.
 *
 * Learned from MCP-509: a guard that reads an absent value asserts nothing.
 * The config is parsed through a schema so a shape change fails loudly instead
 * of quietly comparing `undefined` against `undefined`.
 *
 * ADR-078 helper-mediated committed-artefact reads.
 */

const CANONICAL_MCP_ENDPOINT = 'https://mcp.thenational.academy/mcp';

const PLUGIN_MCP_CONFIG_PATH = 'plugins/oak-open-curriculum/.mcp.json';
const MCP_ENABLED_SKILL_PATH =
  'plugins/oak-open-curriculum/skills/oak-curriculum-principles-mcp-enabled/SKILL.md';

/**
 * The server key the plugin registers; renaming it is a breaking change for installed users.
 *
 * @remarks
 * Renamed from `oak-curriculum` to `oak-open-curriculum` by owner decision
 * (MCP-536, 2026-08-10), accepting that break. The reason is accuracy, not
 * tidiness: what this plugin publishes is Oak's *open* curriculum, licensed
 * under the Open Government Licence — not Oak's copyrighted material — so the
 * key names the thing correctly and matches the plugin's own name.
 *
 * The key is not private to the plugin. It is duplicated in the landing page's
 * copy-paste config snippet (`create-snippet.ts`), which is the manual install
 * path, and anchored there as audited content item C354. A future rename must
 * move every surface together — renaming only one de-synchronises the two
 * installation routes, which is worse than the inconsistency it would fix.
 */
const SERVER_KEY = 'oak-open-curriculum';

const PluginMcpConfigSchema = z.object({
  mcpServers: z
    .record(
      z.string(),
      z.object({
        type: z.string(),
        url: z.url(),
      }),
    )
    .refine((servers) => Object.keys(servers).length > 0, {
      message: 'the plugin declares no MCP servers — this guard would otherwise pass vacuously',
    }),
});

async function readPluginMcpConfig() {
  return PluginMcpConfigSchema.parse(JSON.parse(await readRepoDocument(PLUGIN_MCP_CONFIG_PATH)));
}

describe('shipped plugin MCP server binding', () => {
  it('points the installed plugin at the production endpoint', async () => {
    const config = await readPluginMcpConfig();

    expect(Object.keys(config.mcpServers)).toContain(SERVER_KEY);
    expect(config.mcpServers[SERVER_KEY]).toStrictEqual({
      type: 'http',
      url: CANONICAL_MCP_ENDPOINT,
    });
  });

  it('names no non-production host in any declared server', async () => {
    const config = await readPluginMcpConfig();

    const nonProduction = Object.entries(config.mcpServers)
      .filter(([, server]) => new URL(server.url).origin !== new URL(CANONICAL_MCP_ENDPOINT).origin)
      .map(([key, server]) => `${key} -> ${server.url}`);

    expect(
      nonProduction,
      `these servers would ship to installing users pointed away from ${CANONICAL_MCP_ENDPOINT}`,
    ).toStrictEqual([]);
  });

  it('keeps the MCP-enabled skill compatibility note in step with the binding', async () => {
    const skill = await readRepoDocument(MCP_ENABLED_SKILL_PATH);
    const compatibility = /^compatibility: >-\n((?:[ ]{2}.*\n)+)/m.exec(skill)?.[1];

    expect(
      compatibility,
      `no compatibility block found in ${MCP_ENABLED_SKILL_PATH}`,
    ).toBeDefined();
    // The note is prose for a human reader, so it carries the host rather than the full URL.
    expect(compatibility).toContain(new URL(CANONICAL_MCP_ENDPOINT).host);
    expect(
      compatibility,
      'the skill still tells users to connect to a non-production host',
    ).not.toMatch(/oaknational\.dev/);
  });
});
