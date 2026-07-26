/**
 * Regenerates the landing page's visual-regression baselines on Linux.
 *
 * @remarks
 * Screenshot baselines are platform-specific. CI renders on `ubuntu-latest`,
 * and a baseline captured on macOS compares a different font rasteriser against
 * it — so a plain local `--update-snapshots` produces files that look correct
 * and fail every CI run for a reason unrelated to the page. The browser
 * therefore runs in the Playwright image matching the installed version.
 *
 * **The server runs in the container too, and it is the built artefact.**
 * `dist/index.js` is a self-contained esbuild bundle with no external
 * requires, so plain `node` runs it with nothing installed — which means no
 * `pnpm install` inside the container (that would replace this repo's native
 * binaries with Linux ones and break the host checkout), and no cross-boundary
 * networking. Everything is `localhost` inside one container.
 *
 * Two routes were tried and rejected, recorded so they are not retried:
 * `--network=host` does not reach the host on Docker Desktop for macOS — the
 * container joins the Linux VM's namespace, so `localhost` finds nothing. And
 * reaching the host via `host.docker.internal` arrives with that Host header,
 * which the DNS-rebinding guard answers 403 to; `ALLOWED_HOSTS` does not cure
 * it because the dev harness spawns its child with a curated environment. The
 * first attempt captured eight screenshots of that 403 page, and every test
 * passed.
 *
 * Which is the standing warning: **look at the PNGs before committing them.** A
 * baseline asserts that this is what the page should look like. Three guards
 * failed to notice the page was an error, and opening the file is what caught
 * it.
 *
 * @packageDocumentation
 */

import { spawnSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';

/** Codename `ubuntu-latest` currently resolves to; keep in step with CI. */
const CI_UBUNTU_CODENAME = 'noble';

/** Port used inside the container. Matches `playwright.config.ts`. */
const PORT = 3336;

/**
 * Standard install locations for the Docker CLI, most specific first.
 *
 * @remarks
 * Resolved from a fixed list rather than found on `PATH`. A `PATH` entry that
 * anyone can write to is an entry that can shadow `docker`, and this script
 * hands the resulting binary a bind mount of the whole repository. Naming the
 * locations also produces a better failure than "command not found" when
 * Docker simply is not installed.
 */
const DOCKER_LOCATIONS = [
  '/usr/local/bin/docker', // Docker Desktop, macOS Intel and Linux installs
  '/opt/homebrew/bin/docker', // Homebrew on Apple Silicon
  '/usr/bin/docker', // distro packages
] as const;

function resolveDockerBinary(): string {
  const found = DOCKER_LOCATIONS.find((candidate) => existsSync(candidate));
  if (found === undefined) {
    throw new Error(
      `Docker CLI not found. Looked in: ${DOCKER_LOCATIONS.join(', ')}. ` +
        'Baselines must be generated in the CI-matching Linux image, so Docker is required.',
    );
  }
  return found;
}

function playwrightVersion(): string {
  const require = createRequire(import.meta.url);
  const manifest: unknown = require('@playwright/test/package.json');
  if (typeof manifest === 'object' && manifest !== null && 'version' in manifest) {
    const { version }: { version: unknown } = manifest;
    if (typeof version === 'string') {
      return version;
    }
  }
  throw new Error('Could not read @playwright/test version');
}

function run(command: string, args: readonly string[], cwd: string): void {
  const result = spawnSync(command, [...args], { cwd, stdio: 'inherit' });
  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
    throw new Error(`${command} ${args.join(' ')} exited ${String(result.status)}`);
  }
}

function main(): void {
  const version = playwrightVersion();
  const image = `mcr.microsoft.com/playwright:v${version}-${CI_UBUNTU_CODENAME}`;
  const workspace = path.resolve(import.meta.dirname, '..');
  const repoRoot = path.resolve(workspace, '..', '..');
  const workspaceInContainer = path.posix.join(
    '/repo',
    path.relative(repoRoot, workspace).split(path.sep).join('/'),
  );

  // The container runs the built server, so the baselines must be of the
  // current build rather than whatever dist happened to hold.
  process.stdout.write('Building the artefact the baselines will capture…\n');
  run('pnpm', ['build'], workspace);

  process.stdout.write(`Regenerating baselines in ${image}\n`);

  const serverEnv = [
    `PORT=${String(PORT)}`,
    'OAK_API_KEY=test-key',
    'CLERK_PUBLISHABLE_KEY=pk_test_dummy',
    'CLERK_SECRET_KEY=sk_test_dummy',
    'DANGEROUSLY_DISABLE_AUTH=true',
    'ELASTICSEARCH_URL=http://fake-es:9200',
    'ELASTICSEARCH_API_KEY=fake-api-key-for-baselines',
    'SENTRY_MODE=off',
  ].join(' ');

  const inContainer = [
    `${serverEnv} node dist/index.js &`,
    `for i in $(seq 1 60); do curl -sf http://localhost:${String(PORT)}/ >/dev/null && break; sleep 1; done`,
    `curl -sf http://localhost:${String(PORT)}/ >/dev/null || { echo "server never became ready"; exit 1; }`,
    'npx playwright test --config playwright.baselines.config.ts --grep "renders as approved" --update-snapshots',
  ].join('\n');

  const result = spawnSync(
    resolveDockerBinary(),
    [
      'run',
      '--rm',
      '-v',
      `${repoRoot}:/repo`,
      '-w',
      workspaceInContainer,
      '-e',
      'PLAYWRIGHT_BROWSERS_PATH=/ms-playwright',
      image,
      'bash',
      '-c',
      inContainer,
    ],
    { stdio: 'inherit' },
  );

  if (result.status !== 0) {
    process.exitCode = result.status ?? 1;
  }
}

main();
