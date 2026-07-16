import { afterEach, describe, expect, it } from 'vitest';
import { join } from 'node:path';

import {
  ensureReviewRuntimeLayout,
  fixedReviewPrompt,
  REVIEW_INSTRUCTIONS,
  REVIEW_OUTPUT_SCHEMA,
} from '../../src/codex-hook-review/review-assets.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('review assets', () => {
  it('provisions private schema and instruction assets without creating auth', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-assets-');
    const layout = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'instructions' });
    expect(layout.ok).toBe(true);
    if (!layout.ok) {
      return;
    }

    expect(JSON.parse(await fileSystem.readText(layout.value.outputSchemaPath))).toEqual(
      REVIEW_OUTPUT_SCHEMA,
    );
    expect(await fileSystem.readText(layout.value.instructionsPath)).toBe(
      `${REVIEW_INSTRUCTIONS}\n`,
    );
    expect(await fileSystem.mode(layout.value.codexHome)).toBe(0o700);
    expect(layout.value.skillPath).toBeUndefined();
  });

  it('advertises the micro-skill only in the skill mechanism home', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-assets-');
    const skill = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'skill' });
    const inline = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'inline' });
    expect(skill.ok).toBe(true);
    expect(inline.ok).toBe(true);
    if (!skill.ok || !inline.ok) {
      return;
    }

    expect(await fileSystem.readText(skill.value.skillPath ?? '')).toContain(
      'name: codex-hook-review',
    );
    expect(inline.value.skillPath).toBeUndefined();
    expect(fixedReviewPrompt('skill')).toContain('$codex-hook-review');
    expect(fixedReviewPrompt('inline')).toBe(REVIEW_INSTRUCTIONS);
  });

  it('rejects a linked private runtime directory', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-assets-');
    const outside = await fileSystem.temporaryRoot('codex-review-assets-target-');
    await fileSystem.createSymbolicLink(outside, join(root, '.codex-hook-review'));

    const layout = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'inline' });

    expect(layout.ok).toBe(false);
    expect(await fileSystem.entries(outside)).toEqual([]);
  });

  it('rejects a linked asset without modifying its target', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-assets-');
    const outside = await fileSystem.temporaryRoot('codex-review-assets-target-');
    const initial = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'inline' });
    expect(initial.ok).toBe(true);
    if (!initial.ok) {
      return;
    }
    const target = join(outside, 'target.txt');
    await fileSystem.writeText(target, 'unchanged');
    await fileSystem.remove(initial.value.instructionsPath);
    await fileSystem.createSymbolicLink(target, initial.value.instructionsPath);

    const repeated = await ensureReviewRuntimeLayout({ userHome: root, mechanism: 'inline' });

    expect(repeated.ok).toBe(false);
    expect(await fileSystem.readText(target)).toBe('unchanged');
  });
});
