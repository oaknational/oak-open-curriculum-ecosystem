import { describe, expect, it, vi } from 'vitest';
import { NextRequest, NextResponse } from 'next/server';

import { POST as runElasticSetup } from './elastic-setup/route';
import { GET as runIndexOak } from './index-oak/route';
import { GET as runRebuildRollup } from './rebuild-rollup/route';

const liveIndexOak = vi.hoisted(() =>
  vi.fn(async () => NextResponse.json({ ok: true, indexedDocs: 0 })),
);
const liveRebuildRollup = vi.hoisted(() =>
  vi.fn(async () => NextResponse.json({ ok: true, unitsProcessed: 0 })),
);

vi.mock('../../index-oak/route', () => ({ GET: liveIndexOak }));
vi.mock('../../rebuild-rollup/route', () => ({ GET: liveRebuildRollup }));

function createRequest(
  url: string,
  init?: ConstructorParameters<typeof NextRequest>[1],
): NextRequest {
  return new NextRequest(url, init);
}

describe('Admin stream fixtures', () => {
  describe('POST /api/admin/elastic-setup', () => {
    it('returns fixture output when fixtures are enabled', async () => {
      const request = createRequest('http://localhost/api/admin/elastic-setup?fixtures=on', {
        method: 'POST',
      });
      const response = await runElasticSetup(request);

      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toContain('Validating Elasticsearch configuration');
      expect(response.headers.get('set-cookie')).toContain('semantic-search-fixtures=on');
    });

    it('returns an empty fixture stream when fixtures-empty is requested', async () => {
      const request = createRequest('http://localhost/api/admin/elastic-setup?fixtures=empty', {
        method: 'POST',
      });
      const response = await runElasticSetup(request);

      expect(response.status).toBe(200);
      const text = await response.text();
      expect(text).toContain('No operations executed (fixture mode)');
      expect(response.headers.get('set-cookie')).toContain('semantic-search-fixtures=empty');
    });

    it('surfaces an error fixture when fixtures-error is requested', async () => {
      const request = createRequest('http://localhost/api/admin/elastic-setup?fixtures=error', {
        method: 'POST',
      });
      const response = await runElasticSetup(request);

      expect(response.status).toBe(503);
      expect(await response.text()).toContain('Fixture requested simulated failure');
      expect(response.headers.get('set-cookie')).toContain('semantic-search-fixtures=error');
    });
  });

  describe('GET /api/admin/index-oak', () => {
    it('returns fixture stream output without invoking the live handler', async () => {
      const request = createRequest('http://localhost/api/admin/index-oak?fixtures=on');
      const response = await runIndexOak(request);

      expect(response.status).toBe(200);
      expect(await response.text()).toContain('Starting deterministic fixture indexing run');
      expect(liveIndexOak).not.toHaveBeenCalled();
    });

    it('returns an error fixture payload when requested', async () => {
      const request = createRequest('http://localhost/api/admin/index-oak?fixtures=error');
      const response = await runIndexOak(request);

      expect(response.status).toBe(503);
      expect(await response.text()).toContain('Fixture requested simulated failure');
      expect(liveIndexOak).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/admin/rebuild-rollup', () => {
    it('streams fixture output for rebuild-rollup without invoking the live handler', async () => {
      const request = createRequest('http://localhost/api/admin/rebuild-rollup?fixtures=on');
      const response = await runRebuildRollup(request);

      expect(response.status).toBe(200);
      expect(await response.text()).toContain('Generating fixture rollup view');
      expect(liveRebuildRollup).not.toHaveBeenCalled();
    });

    it('returns an error payload when fixture error is requested', async () => {
      const request = createRequest('http://localhost/api/admin/rebuild-rollup?fixtures=error');
      const response = await runRebuildRollup(request);

      expect(response.status).toBe(503);
      expect(await response.text()).toContain('Fixture requested simulated failure');
      expect(liveRebuildRollup).not.toHaveBeenCalled();
    });
  });
});
