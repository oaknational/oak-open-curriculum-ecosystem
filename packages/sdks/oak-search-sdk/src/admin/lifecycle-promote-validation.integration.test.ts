/**
 * Integration tests for post-swap alias validation in the promote flow (ADR-130).
 *
 * Verifies that promote validates all 6 aliases point to the expected
 * versioned indexes after atomicAliasSwap, before writing metadata.
 * Uses injected fakes — no vi.mock, no vi.stubGlobal (ADR-078).
 */

import { describe, it, expect, vi } from 'vitest';
import { ok, err } from '@oaknational/result';
import { createIndexLifecycleService } from './index-lifecycle-service.js';
import type { AdminError } from '../types/admin-types.js';
import type { AliasTargetMap } from '../types/index-lifecycle-types.js';
import {
  DEFAULT_ALIAS_TARGETS,
  buildPostSwapAliasTargets,
  createFakeDeps,
} from './lifecycle-test-helpers.js';

describe('promote — post-swap alias validation', () => {
  it('returns err with per-alias details when aliases point to wrong indexes after swap', async () => {
    const version = 'v2026-03-07-143022';
    const correctPostSwap = buildPostSwapAliasTargets(version, 'primary');
    const partiallySwapped: AliasTargetMap = {
      ...correctPostSwap,
      threads: {
        isAlias: true,
        targetIndex: 'oak_threads_v2026-03-01-120000',
        isBareIndex: false,
      },
      sequences: {
        isAlias: true,
        targetIndex: 'oak_sequences_v2026-03-01-120000',
        isBareIndex: false,
      },
    };
    const deps = createFakeDeps({
      resolveCurrentAliasTargets: vi
        .fn()
        .mockResolvedValueOnce(ok(DEFAULT_ALIAS_TARGETS))
        .mockResolvedValue(ok(partiallySwapped)),
    });
    const service = createIndexLifecycleService(deps);

    const result = await service.promote(version);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('threads');
      expect(result.error.message).toContain('sequences');
      expect(result.error.message).toContain('oak_threads_v2026-03-01-120000');
      expect(result.error.message).toContain('oak_sequences_v2026-03-01-120000');
    }
    expect(deps.writeIndexMeta).not.toHaveBeenCalled();
  });

  it('returns err when post-swap alias resolution fails', async () => {
    const version = 'v2026-03-07-143022';
    const resolveError: AdminError = { type: 'es_error', message: 'cluster unavailable' };
    const deps = createFakeDeps({
      resolveCurrentAliasTargets: vi
        .fn()
        .mockResolvedValueOnce(ok(DEFAULT_ALIAS_TARGETS))
        .mockResolvedValue(err(resolveError)),
    });
    const service = createIndexLifecycleService(deps);

    const result = await service.promote(version);

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error.message).toContain('cluster unavailable');
    }
    expect(deps.writeIndexMeta).not.toHaveBeenCalled();
  });

  it('proceeds to metadata write when all aliases are confirmed correct', async () => {
    const version = 'v2026-03-07-143022';
    const correctPostSwap = buildPostSwapAliasTargets(version, 'primary');
    const deps = createFakeDeps({
      resolveCurrentAliasTargets: vi
        .fn()
        .mockResolvedValueOnce(ok(DEFAULT_ALIAS_TARGETS))
        .mockResolvedValue(ok(correctPostSwap)),
    });
    const service = createIndexLifecycleService(deps);

    const result = await service.promote(version);

    expect(result.ok).toBe(true);
    expect(deps.writeIndexMeta).toHaveBeenCalledOnce();
  });
});
