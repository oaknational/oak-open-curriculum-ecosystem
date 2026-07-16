import { join } from 'node:path';

import { afterEach, describe, expect, it } from 'vitest';

import {
  captureRuntimeExecutablePins,
  deployAdapterBundle,
  sha256AdapterBundle,
  verifyAdapterDeployment,
  verifyRuntimeExecutablePins,
} from '../../src/codex-hook-review/runtime-integrity.js';
import { CodexHookReviewRealFileSystem } from '../test-helpers/codex-hook-review-real-filesystem.js';

const fileSystem = new CodexHookReviewRealFileSystem();

afterEach(async () => {
  await fileSystem.cleanup();
});

describe('private adapter deployment', () => {
  it('deploys a content-addressed read-only bundle and detects content drift', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-runtime-');
    const userHome = join(root, 'home');
    const distribution = join(root, 'agent-tools', 'dist');
    await fileSystem.createDirectory(distribution, { recursive: true });
    await fileSystem.writeText(join(distribution, 'codex-hook-review-hook.bundle.mjs'), 'bundle');
    const digest = await sha256AdapterBundle(root);
    expect(digest.ok).toBe(true);
    if (!digest.ok) {
      return;
    }

    const deployment = await deployAdapterBundle({
      projectRoot: root,
      userHome,
      expectedSha256: digest.value,
    });
    expect(deployment.ok).toBe(true);
    if (!deployment.ok) {
      return;
    }

    expect(deployment.value.entryPath).toContain(digest.value);
    expect(await fileSystem.mode(deployment.value.entryPath)).toBe(0o500);
    await expect(verifyAdapterDeployment(deployment.value)).resolves.toEqual({
      ok: true,
      value: true,
    });
    await fileSystem.setMode(deployment.value.entryPath, 0o700);
    await fileSystem.writeText(deployment.value.entryPath, 'changed');
    await expect(verifyAdapterDeployment(deployment.value)).resolves.toEqual({
      ok: true,
      value: false,
    });
  });
});

describe('runtime executable pins', () => {
  it('detects identity drift and a target that is no longer executable', async () => {
    const root = await fileSystem.temporaryRoot('codex-review-runtime-');
    const node = await executable(root, 'node');
    const claude = await executable(root, 'claude');
    const codex = await executable(root, 'codex');
    const gitleaks = await executable(root, 'gitleaks');
    const pins = await captureRuntimeExecutablePins({ node, codex, gitleaks, claude });
    expect(pins.ok).toBe(true);
    if (!pins.ok) {
      return;
    }

    await expect(verifyRuntimeExecutablePins(pins.value)).resolves.toEqual({
      ok: true,
      value: true,
    });
    await fileSystem.setMode(claude, 0o600);
    await expect(verifyRuntimeExecutablePins(pins.value)).resolves.toEqual({
      ok: false,
      error: { kind: 'executable-permission-failed', path: claude },
    });
  });
});

async function executable(root: string, name: string): Promise<string> {
  const path = join(root, name);
  await fileSystem.writeText(path, name, 0o700);
  return path;
}
