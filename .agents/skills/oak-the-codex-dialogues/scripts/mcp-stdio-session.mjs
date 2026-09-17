/**
 * Minimal newline-delimited JSON-RPC client over a child process's stdio,
 * used by the codex mcp-server probe. Deliberately dependency-free: the
 * probe must run on a fresh checkout before any build.
 *
 * Adapts the MCP stdio transport's framing — JSON-RPC messages delimited
 * by newlines on the child's stdin/stdout, no embedded newlines — from
 * the MCP specification:
 * https://modelcontextprotocol.io/specification/2025-06-18/basic/transports#stdio
 * Divergences from the full transport: dependency-free and probe-scoped,
 * so no message batching, no logging of the server's stderr (drained and
 * discarded, see below), and no capability negotiation beyond what the
 * probe itself asserts at initialize time.
 *
 * stderr is drained and discarded — a piped-but-unconsumed stderr can fill,
 * block the child, and deadlock an otherwise valid probe run.
 */
import { spawn } from 'node:child_process';

export class McpStdioSession {
  #child;
  #buffer = '';
  #nextId = 1;
  #pending = new Map();
  #callTimeoutMs;
  #terminalReason;
  #ended;
  #endedResolve;

  constructor(command, args, cwd, callTimeoutMs) {
    this.#callTimeoutMs = callTimeoutMs;
    // The child runs with inherited GIT_* variables stripped, matching
    // the workspace isolation guard: GIT_DIR / GIT_WORK_TREE could
    // redirect the server's own git activity into a checkout even
    // though the temp-root check passed.
    const env = Object.fromEntries(
      Object.entries(process.env).filter(([name]) => !name.startsWith('GIT_')),
    );
    this.#child = spawn(command, args, { cwd, env, stdio: ['pipe', 'pipe', 'pipe'] });
    this.#child.stderr.resume();
    this.#child.stdout.setEncoding('utf8');
    this.#child.stdout.on('data', (chunk) => this.#onData(chunk));
    // #ended resolves on 'exit', plus on 'error' ONLY for a child
    // that never spawned (no pid): a spawn failure (ENOENT) is never
    // guaranteed a later 'exit', so a dispose() awaiting 'exit' alone
    // can hang forever on a process that never started. A post-spawn
    // 'error' is NOT proof the process ended — Node also emits it
    // when killing an already-spawned child fails, and 'exit' may
    // never follow — so treating it as termination would let
    // dispose() return while the server is still alive, reopening the
    // inspect-after-termination race it exists to close; that path
    // surfaces through dispose()'s bounded deadline instead.
    this.#ended = new Promise((resolve) => {
      this.#endedResolve = resolve;
    });
    this.#child.on('exit', (code) => {
      this.#endedResolve();
      this.#failAllPending(`server exited (code ${code})`);
    });
    this.#child.on('error', (error) => {
      if (this.#child.pid === undefined) {
        this.#endedResolve();
      }
      this.#failAllPending(`server error: ${error.message}`);
    });
    // A write callback receives its own failure, but the stream ALSO
    // emits 'error' (e.g. an async EPIPE when the child closes stdin
    // between the terminal check and a write) — unhandled, that event
    // crashes the process outside the controlled PROBE FAIL path.
    this.#child.stdin.on('error', (error) => {
      this.#failAllPending(`stdin error: ${error.message}`);
    });
  }

  request(method, params) {
    if (this.#terminalReason !== undefined) {
      return Promise.reject(new Error(`session already terminal: ${this.#terminalReason}`));
    }
    const id = this.#nextId;
    this.#nextId += 1;
    const payload = JSON.stringify({ jsonrpc: '2.0', id, method, params });
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.#pending.delete(id);
        reject(new Error(`timeout after ${this.#callTimeoutMs}ms waiting for ${method}`));
      }, this.#callTimeoutMs);
      this.#pending.set(id, { resolve, reject, timer, method });
      this.#child.stdin.write(`${payload}\n`, (writeError) => {
        if (writeError !== null && writeError !== undefined && this.#pending.has(id)) {
          this.#pending.delete(id);
          clearTimeout(timer);
          reject(new Error(`stdin write failed for ${method}: ${writeError.message}`));
        }
      });
    });
  }

  /**
   * Notification writes report failure through the returned promise —
   * a fire-and-forget write to a dead child's stdin emits an unhandled
   * EPIPE that bypasses the probe's controlled PROBE FAIL path.
   */
  notify(method, params) {
    if (this.#terminalReason !== undefined) {
      return Promise.reject(new Error(`session already terminal: ${this.#terminalReason}`));
    }
    const payload = JSON.stringify({ jsonrpc: '2.0', method, params });
    return new Promise((resolve, reject) => {
      this.#child.stdin.write(`${payload}\n`, (writeError) => {
        if (writeError !== null && writeError !== undefined) {
          reject(new Error(`stdin write failed for notification ${method}: ${writeError.message}`));
          return;
        }
        resolve();
      });
    });
  }

  /**
   * Terminates the child and resolves only once it has actually ended:
   * SIGTERM first, bounded SIGKILL escalation after 5s, and a hard
   * 15s deadline after which disposal FAILS LOUDLY instead of
   * returning — a kill failure must never read as termination, or the
   * workspace inspection that follows disposal races a live server.
   * An unawaited kill() lets a slow or SIGTERM-ignoring server outlive
   * disposal the same way. Awaits the constructor's
   * exit-or-spawn-failure promise, so a spawn-failed child (which may
   * never emit 'exit') cannot hang disposal.
   */
  async dispose() {
    this.#failAllPending('session disposed');
    if (this.#child.exitCode !== null || this.#child.signalCode !== null) {
      return;
    }
    this.#child.kill();
    const killTimer = setTimeout(() => this.#child.kill('SIGKILL'), 5_000);
    let deadlineTimer;
    const deadline = new Promise((_, reject) => {
      deadlineTimer = setTimeout(() => {
        // The undead child's piped stdio keeps this process's event
        // loop referenced, which would turn the loud failure into an
        // announced HANG (the process never exits). Releasing the
        // parent-side pipes and unref-ing frees the probe to exit
        // non-zero; the child itself stays untouched as evidence.
        this.#child.stdin.destroy();
        this.#child.stdout.destroy();
        this.#child.stderr.destroy();
        this.#child.unref();
        reject(
          new Error(
            'dispose: child still running 15s after SIGTERM (SIGKILL escalation failed) — ' +
              'not treating as terminated',
          ),
        );
      }, 15_000);
    });
    try {
      await Promise.race([this.#ended, deadline]);
    } finally {
      clearTimeout(killTimer);
      clearTimeout(deadlineTimer);
    }
  }

  #onData(chunk) {
    this.#buffer += chunk;
    let newlineIndex = this.#buffer.indexOf('\n');
    while (newlineIndex !== -1) {
      const line = this.#buffer.slice(0, newlineIndex).trim();
      this.#buffer = this.#buffer.slice(newlineIndex + 1);
      if (line.length > 0) {
        this.#onLine(line);
      }
      newlineIndex = this.#buffer.indexOf('\n');
    }
  }

  #onLine(line) {
    let message;
    try {
      message = JSON.parse(line);
    } catch {
      this.#failAllPending(
        `non-protocol line on stdout (MCP stdio requires every line to be a message): ${line.slice(0, 120)}`,
      );
      return;
    }
    if (typeof message !== 'object' || message === null || !('id' in message)) {
      return;
    }
    const entry = this.#pending.get(message.id);
    if (entry === undefined) {
      return;
    }
    this.#pending.delete(message.id);
    clearTimeout(entry.timer);
    if ('error' in message && message.error !== undefined) {
      entry.reject(new Error(`${entry.method} failed: ${JSON.stringify(message.error)}`));
      return;
    }
    entry.resolve(message.result);
  }

  /**
   * Terminal transport failures persist: pending requests reject now,
   * and every LATER request rejects immediately instead of queuing
   * against a dead child until its timeout.
   */
  #failAllPending(reason) {
    this.#terminalReason = reason;
    for (const [id, entry] of this.#pending) {
      this.#pending.delete(id);
      clearTimeout(entry.timer);
      entry.reject(new Error(reason));
    }
  }
}
