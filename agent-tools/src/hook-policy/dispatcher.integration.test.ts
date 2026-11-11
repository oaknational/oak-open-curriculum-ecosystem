import { ok } from '@oaknational/result';
import { describe, expect, it } from 'vitest';

import { claudePolicyRoutes } from './claude-adapter.js';
import {
  dispatchPreToolUse,
  type PolicyRoute,
  type PolicyRouteContext,
  type RenderPolicyDecision,
} from './dispatcher.js';
import type { PolicyDecision } from './evaluate.js';
import type { PolicySnapshot } from './policy-snapshot.js';

async function* stdinFromJson(payload: unknown): AsyncGenerator<Buffer> {
  yield Buffer.from(JSON.stringify(payload));
}

async function* stdinFromText(text: string): AsyncGenerator<Buffer> {
  yield Buffer.from(text);
}

/** Collect writes, preserving call boundaries. */
function collector(): { write(text: string): void; chunks: string[] } {
  const chunks: string[] = [];
  return {
    write(text: string): void {
      chunks.push(text);
    },
    chunks,
  };
}

/** Synthetic route with an evaluation call counter. */
function countingRoute(
  name: string,
  shouldMatch: boolean,
  evaluate?: (context: PolicyRouteContext) => Promise<PolicyDecision>,
): { readonly route: PolicyRoute; readonly evaluateCalls: () => number } {
  let calls = 0;
  const route: PolicyRoute = {
    name,
    matches: () => shouldMatch,
    evaluate: (context) => {
      calls += 1;
      return evaluate === undefined ? Promise.resolve({ kind: 'allow' }) : evaluate(context);
    },
  };
  return { route, evaluateCalls: () => calls };
}

/** Synthetic renderer that records the decisions it was asked to render. */
function countingRender(): {
  readonly render: RenderPolicyDecision;
  readonly rendered: PolicyDecision[];
} {
  const rendered: PolicyDecision[] = [];
  return {
    render: (decision, stdout) => {
      rendered.push(decision);
      stdout.write(`RENDERED:${decision.kind}\n`);
    },
    rendered,
  };
}

/** A renderer that throws on every decision, so the dispatcher's fail-closed path is reached from the render step. */
const throwingRender: RenderPolicyDecision = () => {
  throw new Error('renderer exploded');
};

/** Counting loadSnapshot seam serving a fully-populated synthetic snapshot. */
function countingLoadSnapshot(): {
  readonly loadSnapshot: (policyUrl: URL) => Promise<PolicySnapshot>;
  readonly calls: () => number;
} {
  let calls = 0;
  return {
    loadSnapshot: () => {
      calls += 1;
      return Promise.resolve({
        bashPatterns: ok([]),
        contentPatterns: ok([]),
        scopedBlocks: ok([]),
      });
    },
    calls: () => calls,
  };
}

describe('dispatchPreToolUse', () => {
  it('fails closed with a truthful error when zero routes match', async () => {
    const stdout = collector();
    const stderr = collector();
    const miss = countingRoute('bash', false);
    const renderer = countingRender();

    const result = await dispatchPreToolUse([miss.route], renderer.render, {
      stdin: stdinFromJson({}),
      stdout,
      stderr,
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(stdout.chunks).toStrictEqual([]);
    expect(stderr.chunks).toHaveLength(1);
    expect(stderr.chunks[0]).toContain('did not match any policy route');
    expect(miss.evaluateCalls()).toBe(0);
    expect(renderer.rendered).toStrictEqual([]);
  });

  it('fails closed with a truthful error when two routes match', async () => {
    const stdout = collector();
    const stderr = collector();
    const first = countingRoute('bash', true);
    const second = countingRoute('claude-content', true);
    const renderer = countingRender();

    const result = await dispatchPreToolUse([first.route, second.route], renderer.render, {
      stdin: stdinFromJson({ command: 'x', new_string: 'y' }),
      stdout,
      stderr,
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(stdout.chunks).toStrictEqual([]);
    expect(stderr.chunks).toHaveLength(1);
    expect(stderr.chunks[0]).toContain('matched 2 policy routes');
    expect(stderr.chunks[0]).toContain('bash');
    expect(stderr.chunks[0]).toContain('claude-content');
    expect(first.evaluateCalls()).toBe(0);
    expect(second.evaluateCalls()).toBe(0);
  });

  it('runs exactly one evaluate and one render when exactly one route matches', async () => {
    const stdout = collector();
    const stderr = collector();
    const miss = countingRoute('bash', false);
    const hit = countingRoute('claude-content', true, () =>
      Promise.resolve({ kind: 'deny-content-pattern', pattern: 'secret-marker' }),
    );
    const renderer = countingRender();

    const result = await dispatchPreToolUse([miss.route, hit.route], renderer.render, {
      stdin: stdinFromJson({ tool_input: { new_string: 'x', old_string: 'y' } }),
      stdout,
      stderr,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(hit.evaluateCalls()).toBe(1);
    expect(miss.evaluateCalls()).toBe(0);
    expect(renderer.rendered).toStrictEqual([
      { kind: 'deny-content-pattern', pattern: 'secret-marker' },
    ]);
    expect(stdout.chunks).toStrictEqual(['RENDERED:deny-content-pattern\n']);
    expect(stderr.chunks).toStrictEqual([]);
  });

  it('fails closed when the renderer throws', async () => {
    const stdout = collector();
    const stderr = collector();
    const hit = countingRoute('bash', true);

    const result = await dispatchPreToolUse([hit.route], throwingRender, {
      stdin: stdinFromJson({ command: 'git status' }),
      stdout,
      stderr,
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(stderr.chunks).toStrictEqual(['renderer exploded\n']);
  });

  it('fails closed when the matched route rejects during evaluation', async () => {
    const stderr = collector();
    const hit = countingRoute('copilot-compat-string', true, () =>
      Promise.reject(new Error('PreToolUse apply_patch payload was invalid: bad patch')),
    );
    const renderer = countingRender();

    const result = await dispatchPreToolUse([hit.route], renderer.render, {
      stdin: stdinFromJson({ tool_input: 'not a patch' }),
      stdout: collector(),
      stderr,
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(stderr.chunks).toStrictEqual([
      'PreToolUse apply_patch payload was invalid: bad patch\n',
    ]);
    expect(renderer.rendered).toStrictEqual([]);
  });

  it('loads the snapshot at most once per request through the memoised accessor', async () => {
    const seam = countingLoadSnapshot();
    const hit = countingRoute('claude-content', true, async (context) => {
      await context.getSnapshot();
      await context.getSnapshot();
      return { kind: 'allow' };
    });
    const renderer = countingRender();

    const result = await dispatchPreToolUse([hit.route], renderer.render, {
      stdin: stdinFromJson({ tool_input: { new_string: 'x' } }),
      stdout: collector(),
      stderr: collector(),
      loadSnapshot: seam.loadSnapshot,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(seam.calls()).toBe(1);
  });

  it('never loads the snapshot when the matched route does not ask for it', async () => {
    const seam = countingLoadSnapshot();
    const hit = countingRoute('bash', true);
    const renderer = countingRender();

    const result = await dispatchPreToolUse([hit.route], renderer.render, {
      stdin: stdinFromJson({ command: 'git status' }),
      stdout: collector(),
      stderr: collector(),
      loadSnapshot: seam.loadSnapshot,
    });

    expect(result).toStrictEqual({ exitCode: 0 });
    expect(seam.calls()).toBe(0);
  });

  it('fails closed on invalid JSON stdin with the unchanged parse error', async () => {
    const stderr = collector();
    const renderer = countingRender();

    const result = await dispatchPreToolUse([countingRoute('bash', true).route], renderer.render, {
      stdin: stdinFromText('not valid json {{{'),
      stdout: collector(),
      stderr,
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(stderr.chunks).toHaveLength(1);
    expect(stderr.chunks[0]).toContain('Claude PreToolUse hook input was not valid JSON:');
  });

  // Ported from the MCP-150 branch's router suite (PR #707 at f96149836,
  // MCP-183 secondary port), re-homed at the seam that actually delivers
  // the system-level guarantee: a Copilot lifecycle batch matches ZERO of
  // the real production routes, so the dispatcher refuses it before any
  // extraction runs. The unit-level companion in hook-input.unit.test.ts
  // pins only the extractor's own refusal.
  it('fails closed on a Copilot lifecycle batch: no production route matches it', async () => {
    const stderr = collector();
    const renderer = countingRender();

    const result = await dispatchPreToolUse([...claudePolicyRoutes], renderer.render, {
      stdin: stdinFromJson({
        sessionId: 'copilot-session',
        cwd: '/repo',
        toolCalls: [
          {
            id: 'call-create',
            name: 'create',
            args: JSON.stringify({ path: '/repo/new-file.md', file_text: 'new file content' }),
          },
        ],
      }),
      stdout: collector(),
      stderr,
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(renderer.rendered).toStrictEqual([]);
    expect(stderr.chunks).toHaveLength(1);
    expect(stderr.chunks[0]).toContain('did not match any policy route');
  });

  it('fails closed on the Copilot toolArgs envelope: no production route matches it', async () => {
    const stderr = collector();
    const renderer = countingRender();

    const result = await dispatchPreToolUse([...claudePolicyRoutes], renderer.render, {
      stdin: stdinFromJson({
        sessionId: 'copilot-session',
        timestamp: 1_753_426_800_000,
        cwd: '/repo',
        toolName: 'create',
        toolArgs: JSON.stringify({ path: '/repo/new-file.md', file_text: 'new file content' }),
      }),
      stdout: collector(),
      stderr,
    });

    expect(result).toStrictEqual({ exitCode: 2 });
    expect(renderer.rendered).toStrictEqual([]);
    expect(stderr.chunks).toHaveLength(1);
    expect(stderr.chunks[0]).toContain('did not match any policy route');
  });
});
