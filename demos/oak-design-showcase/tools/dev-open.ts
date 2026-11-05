/**
 * Start the showcase dev server and open it in the default browser once it
 * answers — the root `design:showcase` script's target (MCP-166 walk item 7:
 * one command from the repo root, server up, page in front of you).
 *
 * The open attempt is best-effort (headless environments just skip it); the
 * dev server is the long-lived foreground process either way. The poll loop
 * aborts the moment the server process exits, so a failed startup (for
 * example the port already held) returns the shell immediately instead of
 * spinning out the deadline.
 */
import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { platform } from 'node:os';

import { openerCommand } from './opener-command.js';

// Keep in step with the `dev`/`start` scripts in package.json.
const PORT = 3020;
const URL_TO_OPEN = `http://localhost:${PORT}`;
const POLL_INTERVAL_MS = 500;
const OPEN_DEADLINE_MS = 60_000;

async function serverAnswers(): Promise<boolean> {
  try {
    const response = await fetch(URL_TO_OPEN, { signal: AbortSignal.timeout(POLL_INTERVAL_MS) });
    return response.ok;
  } catch {
    return false;
  }
}

async function openWhenReady(devExited: AbortSignal): Promise<void> {
  const deadline = Date.now() + OPEN_DEADLINE_MS;
  while (Date.now() < deadline && !devExited.aborted) {
    if (await serverAnswers()) {
      const { command, args } = openerCommand(URL_TO_OPEN, platform());
      const opener = spawn(command, [...args], { stdio: 'ignore', detached: true });
      opener.on('error', () => {
        // Headless environment without an opener — the server is still up.
      });
      // Without unref a long-lived URL handler would keep this wrapper's
      // event loop alive after the dev server exits.
      opener.unref();
      return;
    }
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
  if (!devExited.aborted) {
    process.stderr.write(
      `design-showcase: no answer on ${URL_TO_OPEN} within ${OPEN_DEADLINE_MS / 1000}s — open it manually once the server is up.\n`,
    );
  }
}

// The Next CLI is this package's own dependency: its entry is resolved
// from node_modules and run under the current node binary.
const nextBin = createRequire(import.meta.url).resolve('next/dist/bin/next');

const devExit = new AbortController();
const dev = spawn(process.execPath, [nextBin, 'dev', '-p', String(PORT)], { stdio: 'inherit' });
dev.on('exit', (code, signal) => {
  devExit.abort();
  // A signal-killed server (OOM, kill) is a failure, never a success.
  process.exitCode = code ?? (signal === null ? 0 : 1);
});
await openWhenReady(devExit.signal);
