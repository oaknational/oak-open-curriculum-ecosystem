import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const repoRoot = fileURLToPath(new URL('../../..', import.meta.url));
const builtCliPath = resolve(repoRoot, 'agent-tools', 'dist', 'src', 'bin', 'agent-identity.js');

describe('agent-identity built CLI', () => {
  beforeAll(() => {
    const build = spawnSync('pnpm', ['--filter', '@oaknational/agent-tools', 'build'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(build.status).toBe(0);
    expect(existsSync(builtCliPath)).toBe(true);
  });

  it('prints help through plain Node', () => {
    const result = spawnSync(builtCliPath, ['--help'], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('Usage: agent-identity');
  });

  it('prints deterministic display output through plain Node', () => {
    const first = spawnSync(
      'node',
      [builtCliPath, '--seed', 'example-session-id-001', '--format', 'display'],
      {
        cwd: repoRoot,
        encoding: 'utf8',
      },
    );
    const second = spawnSync(
      'node',
      [builtCliPath, '--seed', 'example-session-id-001', '--format', 'display'],
      {
        cwd: repoRoot,
        encoding: 'utf8',
      },
    );

    expect(first.status).toBe(0);
    expect(second.status).toBe(0);
    expect(first.stdout).toBe(second.stdout);
    expect(first.stdout.trim()).toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+ [A-Z][a-z]+$/u);
  });

  it('reports bad usage through the built bin', () => {
    const result = spawnSync(builtCliPath, [], {
      cwd: repoRoot,
      encoding: 'utf8',
    });

    expect(result.status).toBe(2);
    expect(result.stderr).toBe(
      'Error: missing seed; pass --seed or set CLAUDE_SESSION_ID or OAK_AGENT_SEED\n',
    );
  });

  it('honours override through plain Node', () => {
    const result = spawnSync(
      process.execPath,
      [builtCliPath, '--seed', 'any', '--format', 'display'],
      {
        cwd: repoRoot,
        encoding: 'utf8',
        env: {
          OAK_AGENT_IDENTITY_OVERRIDE: 'Frolicking Toast',
        },
      },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toBe('Frolicking Toast\n');
  });

  it('runs the advertised root script against the built CLI', () => {
    const result = spawnSync(
      'pnpm',
      ['agent-tools:agent-identity', '--seed', 'example-session-id-001', '--format', 'kebab'],
      {
        cwd: repoRoot,
        encoding: 'utf8',
      },
    );

    expect(result.status).toBe(0);
    expect(result.stdout).toContain('gnarled-sprouting-fern\n');
  });
});
