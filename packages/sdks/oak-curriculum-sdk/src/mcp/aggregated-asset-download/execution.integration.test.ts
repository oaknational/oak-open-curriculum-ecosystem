/**
 * Integration tests for `runDownloadAssetTool` — how the execution
 * function integrates with its injected dependencies (`executeMcpTool`,
 * `createAssetDownloadUrl`) using simple recording fakes, mirroring the
 * aggregated-fetch execution integration suite.
 *
 * The load-bearing property throughout: a signed URL is a promise the
 * proxy must keep, so the URL factory is never invoked unless the assets
 * lookup has proven the lesson and the requested asset type (MCP-321).
 */
import { describe, it, expect } from 'vitest';
import { err, ok } from '@oaknational/result';
import type { CallToolResult } from '@modelcontextprotocol/sdk/types';
import type { z } from 'zod';
import type { rawCurriculumSchemas } from '@oaknational/sdk-codegen/zod';
import { McpToolError } from '../error-types.js';
import type { ToolExecutionResult } from '../execute-tool-call.js';
import { runDownloadAssetTool } from './execution.js';

type LessonAssetsResponse = z.infer<typeof rawCurriculumSchemas.LessonAssetsResponseSchema>;
type LessonAsset = NonNullable<LessonAssetsResponse['assets']>[number];

const OAK_LESSON_URL = 'https://www.thenational.academy/teachers/lessons/my-lesson';

/** Throw-guard: names the wrong content type instead of silently passing. */
function textOf(result: CallToolResult): string {
  const first = result.content[0];
  if (first?.type !== 'text') {
    throw new Error(`expected text content, got ${first?.type ?? 'nothing'}`);
  }
  return first.text;
}

const stubUrlFactory = (lesson: string, type: string): string =>
  `https://example.com/assets/download/${lesson}/${type}?sig=abc&exp=999`;

/**
 * Deps whose lookup answers with a fixed result, recording every factory
 * and lookup invocation.
 */
function makeDeps(lookupResult: ToolExecutionResult) {
  const factoryCalls: { lesson: string; type: string }[] = [];
  const lookupCalls: { name: string; args: unknown }[] = [];
  return {
    factoryCalls,
    lookupCalls,
    deps: {
      createAssetDownloadUrl: (lesson: string, type: string): string => {
        factoryCalls.push({ lesson, type });
        return stubUrlFactory(lesson, type);
      },
      executeMcpTool: (name: string, args: unknown): Promise<ToolExecutionResult> => {
        lookupCalls.push({ name, args });
        return Promise.resolve(lookupResult);
      },
    },
  };
}

/** Contract-anchored listing fixture: fails compilation if the generated schema moves. */
function listingWith(...types: LessonAsset['type'][]): ToolExecutionResult {
  const listing = {
    oakUrl: OAK_LESSON_URL,
    assets: types.map((type) => ({
      type,
      label: type,
      url: `https://open-api.thenational.academy/api/v0/lessons/my-lesson/assets/${type}`,
    })),
  } satisfies LessonAssetsResponse;
  return ok({ status: 200, data: listing });
}

describe('runDownloadAssetTool', () => {
  it('refuses to sign for a lesson the assets lookup cannot find, advising a slug check, and never mints the URL', async () => {
    const { deps, factoryCalls } = makeDeps(
      err(
        new McpToolError('No lessons found', 'get-lessons-assets', { code: 'RESOURCE_NOT_FOUND' }),
      ),
    );

    const result = await runDownloadAssetTool(
      { lesson: 'no-such-lesson', type: 'worksheet' },
      deps,
    );

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain('No lessons found');
    expect(textOf(result)).toContain('Check the lesson slug');
    expect(factoryCalls).toHaveLength(0);
  });

  it.each([
    [
      'a copyright restriction',
      'Resource unavailable due to copyright restriction',
      'CONTENT_NOT_AVAILABLE',
    ],
    ['an upstream failure', 'Upstream server error (503)', 'UPSTREAM_SERVER_ERROR'],
    ['an authentication failure', 'Authentication required', 'AUTHENTICATION_REQUIRED'],
  ])(
    'refuses on %s without slug-hunting advice, and never mints the URL',
    async (_label, message, code) => {
      const { deps, factoryCalls } = makeDeps(
        err(new McpToolError(message, 'get-lessons-assets', { code })),
      );

      const result = await runDownloadAssetTool({ lesson: 'my-lesson', type: 'worksheet' }, deps);

      expect(result.isError).toBe(true);
      expect(textOf(result)).toContain(message);
      expect(textOf(result)).not.toContain('Check the lesson slug');
      expect(factoryCalls).toHaveLength(0);
    },
  );

  it('asks the assets listing for the requested lesson before signing', async () => {
    const { deps, lookupCalls } = makeDeps(listingWith('worksheet'));

    await runDownloadAssetTool({ lesson: 'my-lesson', type: 'worksheet' }, deps);

    expect(lookupCalls).toMatchObject([
      { name: 'get-lessons-assets', args: { lesson: 'my-lesson' } },
    ]);
  });

  it('refuses when the lesson has no asset of the requested type, naming what exists and the lesson page', async () => {
    const { deps, factoryCalls } = makeDeps(listingWith('video', 'slideDeck'));

    const result = await runDownloadAssetTool({ lesson: 'my-lesson', type: 'worksheet' }, deps);

    expect(result.isError).toBe(true);
    const message = textOf(result);
    expect(message).toContain('worksheet');
    expect(message).toContain('video');
    expect(message).toContain('slideDeck');
    expect(message).toContain(OAK_LESSON_URL);
    expect(factoryCalls).toHaveLength(0);
  });

  it('refuses with "none" when the lesson lists no assets at all', async () => {
    const { deps, factoryCalls } = makeDeps(listingWith());

    const result = await runDownloadAssetTool({ lesson: 'my-lesson', type: 'worksheet' }, deps);

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain('Available asset types: none');
    expect(factoryCalls).toHaveLength(0);
  });

  it('treats a contract-legal listing with no assets key as a lesson with nothing to download', async () => {
    const listing = { oakUrl: OAK_LESSON_URL } satisfies LessonAssetsResponse;
    const { deps, factoryCalls } = makeDeps(ok({ status: 200, data: listing }));

    const result = await runDownloadAssetTool({ lesson: 'my-lesson', type: 'worksheet' }, deps);

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain('Available asset types: none');
    expect(factoryCalls).toHaveLength(0);
  });

  it('refuses to sign when the lookup returns an unrecognisable shape', async () => {
    const { deps, factoryCalls } = makeDeps(ok({ status: 200, data: { unexpected: true } }));

    const result = await runDownloadAssetTool({ lesson: 'my-lesson', type: 'worksheet' }, deps);

    expect(result.isError).toBe(true);
    expect(textOf(result)).toContain('unrecognisable listing');
    expect(factoryCalls).toHaveLength(0);
  });

  it('returns a formatted tool response with the download URL for a proven asset', async () => {
    const { deps } = makeDeps(listingWith('worksheet', 'video'));

    const result = await runDownloadAssetTool({ lesson: 'my-lesson', type: 'worksheet' }, deps);

    expect(result.isError).toBeUndefined();
    expect(textOf(result)).toContain('https://example.com/assets/download/my-lesson/worksheet');
  });

  it('includes lesson and type in the structured data for a proven asset', async () => {
    const { deps } = makeDeps(listingWith('slideDeck'));

    const result = await runDownloadAssetTool({ lesson: 'my-lesson', type: 'slideDeck' }, deps);

    expect(result.structuredContent).toBeDefined();
    expect(result.structuredContent).toHaveProperty('downloadUrl');
    expect(result.structuredContent).toHaveProperty('lesson', 'my-lesson');
    expect(result.structuredContent).toHaveProperty('type', 'slideDeck');
  });
});
