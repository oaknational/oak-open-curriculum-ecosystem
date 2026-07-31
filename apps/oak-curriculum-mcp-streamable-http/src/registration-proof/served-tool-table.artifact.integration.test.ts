import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { unwrap } from '@oaknational/result';
import { SERVED_SURFACE, liveToolNames } from '../served-surface/served-surface.js';
import { walkCanonicalRegistration } from '../test-helpers/registration-walk.js';
import { renderServedToolTable, type ServedToolRow } from './served-tool-table.js';

const registeredToolSchema = z.object({
  title: z.string(),
  description: z.string(),
  annotations: z.object({
    readOnlyHint: z.boolean().optional(),
    destructiveHint: z.boolean().optional(),
    idempotentHint: z.boolean().optional(),
    openWorldHint: z.boolean().optional(),
  }),
});

describe('served-tool-table artefact', () => {
  // The staleness pin: the committed artefact must equal the rendering of the
  // canonical registration walk — the same registration path the server runs —
  // so a served-surface change without a regenerated artefact fails here
  // rather than shipping a drifted reviewer-facing table (MCP-439). The
  // walk-vs-live-listTools parity is pinned separately by the registration
  // integration suite, closing the chain from artefact to served truth.
  it('the committed artefact equals the canonical registration walk rendering', () => {
    const { toolConfigs } = walkCanonicalRegistration();
    const rows: ServedToolRow[] = [...toolConfigs.entries()].map(([name, config]) => {
      const parsed = registeredToolSchema.safeParse(config);
      if (!parsed.success) {
        expect.fail(`tool ${name} registered without table fields: ${parsed.error.message}`);
      }
      return {
        name,
        title: parsed.data.title,
        description: parsed.data.description,
        annotations: parsed.data.annotations,
      };
    });
    expect(rows).toHaveLength(liveToolNames(SERVED_SURFACE).length);

    const rendered = unwrap(renderServedToolTable(rows));
    const committed = readFileSync(new URL('../../served-tool-table.md', import.meta.url), 'utf8');
    expect(committed).toBe(rendered);
  });
});
