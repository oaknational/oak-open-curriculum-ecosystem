import { describe, it, expect, afterEach } from 'vitest';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { findAppRoot } from '../src/repo-root.js';

describe('findAppRoot', () => {
  let cleanup: () => void;

  afterEach(() => {
    cleanup?.();
  });

  it('finds the nearest directory containing package.json', () => {
    const appRoot = mkdtempSync(join(tmpdir(), 'app-root-test-'));
    writeFileSync(join(appRoot, 'package.json'), '{}');
    const nested = join(appRoot, 'src', 'deep');
    mkdirSync(nested, { recursive: true });
    cleanup = () => rmSync(appRoot, { recursive: true, force: true });

    const result = findAppRoot(nested);

    expect(result).toBe(appRoot);
  });

  it('returns undefined when no package.json is found', () => {
    const noMarker = mkdtempSync(join(tmpdir(), 'no-pkg-'));
    cleanup = () => rmSync(noMarker, { recursive: true, force: true });

    const result = findAppRoot(noMarker);

    expect(result).toBeUndefined();
  });

  it('finds the closest package.json, not a parent one', () => {
    const repoRoot = mkdtempSync(join(tmpdir(), 'repo-'));
    writeFileSync(join(repoRoot, 'package.json'), '{"name":"root"}');
    const appDir = join(repoRoot, 'apps', 'my-app');
    mkdirSync(appDir, { recursive: true });
    writeFileSync(join(appDir, 'package.json'), '{"name":"my-app"}');
    const srcDir = join(appDir, 'src');
    mkdirSync(srcDir, { recursive: true });
    cleanup = () => rmSync(repoRoot, { recursive: true, force: true });

    const result = findAppRoot(srcDir);

    expect(result).toBe(appDir);
  });
});
