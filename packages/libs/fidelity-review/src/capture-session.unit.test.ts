import { err, ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import {
  CaptureManifestSchema,
  contentHashOf,
  verifyCohortEvidence,
  type CaptureManifest,
} from './capture-manifest';
import { createCaptureSession, type CaptureStageIo } from './capture-session';

const META = {
  base: 'http://localhost:3020',
  widthCssPx: 1440,
  deviceScaleFactor: 2,
  startedAt: '2026-08-09T17:00:00Z',
  now: () => '2026-08-09T17:03:00Z',
};

function stageIoFake(overrides: Partial<CaptureStageIo> = {}): {
  io: CaptureStageIo;
  log: string[];
} {
  const log: string[] = [];
  const io: CaptureStageIo = {
    stageWrite: (rel) => {
      log.push(`stage(${rel})`);
      return ok(undefined);
    },
    promoteFile: (rel) => {
      log.push(`promote(${rel})`);
      return ok(undefined);
    },
    writeManifest: () => {
      log.push('manifest');
      return ok(undefined);
    },
    ...overrides,
  };
  return { io, log };
}

describe('createCaptureSession', () => {
  it('stages a shot, then promotes every file BEFORE committing the manifest', () => {
    const { io, log } = stageIoFake();
    const session = createCaptureSession(io, META);

    const staged = session.stage('demo-evidence/live-a.png', Buffer.from('a'));
    const promoted = session.promote();

    expect(staged.ok).toBe(true);
    expect(promoted.ok).toBe(true);
    expect(log).toEqual([
      'stage(demo-evidence/live-a.png)',
      'promote(demo-evidence/live-a.png)',
      'manifest',
    ]);
  });

  it('refuses to stage outside demo-evidence/ — the vendor tree is unreachable by construction', () => {
    const { io, log } = stageIoFake();
    const session = createCaptureSession(io, META);

    const outcome = session.stage(
      'claude-design-canonical-export/screenshots/coursemap.png',
      Buffer.from('x'),
    );

    expect(outcome.ok).toBe(false);
    expect(log).toEqual([]);
  });

  it('commits the manifest with the session geometry and per-shot content hashes', () => {
    let committed = '';
    const { io } = stageIoFake({
      writeManifest: (json) => {
        committed = json;
        return ok(undefined);
      },
    });
    const session = createCaptureSession(io, META);
    session.stage('demo-evidence/live-a.png', Buffer.from('a'));

    const outcome = session.promote();

    expect(outcome.ok).toBe(true);
    const manifest = CaptureManifestSchema.parse(JSON.parse(committed));
    expect(manifest.base).toBe('http://localhost:3020');
    expect(manifest.promotedAt).toBe('2026-08-09T17:03:00Z');
    expect(manifest.entries).toEqual([
      {
        relativePath: 'demo-evidence/live-a.png',
        widthCssPx: 1440,
        deviceScaleFactor: 2,
        contentHash: contentHashOf(Buffer.from('a')),
      },
    ]);
  });

  it('never writes the manifest when a promotion rename fails — the previous manifest survives', () => {
    const { io, log } = stageIoFake({
      promoteFile: (rel) => err(`promotion failed at ${rel} — EACCES`),
    });
    const session = createCaptureSession(io, META);
    session.stage('demo-evidence/live-a.png', Buffer.from('a'));

    const outcome = session.promote();

    expect(outcome.ok).toBe(false);
    expect(log).not.toContain('manifest');
  });

  it('refuses to promote an empty session — no shot, no commit record', () => {
    const { io } = stageIoFake();
    const session = createCaptureSession(io, META);

    const outcome = session.promote();

    expect(outcome.ok).toBe(false);
  });

  it('records ONE entry when the same declared path is staged twice (shared-evidence pairs)', () => {
    let committed = '';
    const { io } = stageIoFake({
      writeManifest: (json) => {
        committed = json;
        return ok(undefined);
      },
    });
    const session = createCaptureSession(io, META);
    session.stage('demo-evidence/live-a.png', Buffer.from('a'));
    session.stage('demo-evidence/live-a.png', Buffer.from('a2'));

    const outcome = session.promote();

    expect(outcome.ok).toBe(true);
    const manifest = CaptureManifestSchema.parse(JSON.parse(committed));
    expect(manifest.entries).toHaveLength(1);
    expect(manifest.entries[0]?.contentHash).toBe(contentHashOf(Buffer.from('a2')));
  });
});

describe('verifyCohortEvidence', () => {
  const MANIFEST: CaptureManifest = {
    version: 1,
    base: 'http://localhost:3020',
    startedAt: '2026-08-09T17:00:00Z',
    promotedAt: '2026-08-09T17:03:00Z',
    entries: [
      {
        relativePath: 'demo-evidence/live-a.png',
        widthCssPx: 1440,
        deviceScaleFactor: 2,
        contentHash: contentHashOf(Buffer.from('a')),
      },
    ],
  };

  it('accepts canonical bytes that match the manifest', () => {
    const outcome = verifyCohortEvidence(MANIFEST, {
      exists: () => true,
      read: () => ok(Buffer.from('a')),
    });

    expect(outcome.ok).toBe(true);
  });

  it('refuses a missing canonical file despite its manifest entry', () => {
    const outcome = verifyCohortEvidence(MANIFEST, {
      exists: () => false,
      read: () => ok(Buffer.from('a')),
    });

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('missing');
  });

  it('refuses bytes that do not hash to the manifest entry — torn promotion or manual edit', () => {
    const outcome = verifyCohortEvidence(MANIFEST, {
      exists: () => true,
      read: () => ok(Buffer.from('tampered')),
    });

    expect(outcome.ok).toBe(false);
    expect(outcome.ok ? undefined : outcome.error).toContain('does not match');
  });

  it('carries an unreadable-evidence io failure through', () => {
    const outcome = verifyCohortEvidence(MANIFEST, {
      exists: () => true,
      read: () => err('evidence unreadable at demo-evidence/live-a.png — EACCES'),
    });

    expect(outcome.ok).toBe(false);
  });
});
