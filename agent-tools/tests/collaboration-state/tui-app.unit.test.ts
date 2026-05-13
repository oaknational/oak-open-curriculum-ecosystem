import { render as renderInk, type Instance } from 'ink';
import React, { act } from 'react';
import { describe, expect, it } from 'vitest';

import { type CollaborationTuiSnapshot } from '../../src/collaboration-state';
import { CollaborationTuiApp } from '../../src/collaboration-state/tui/app';
import {
  type CollaborationTuiPane,
  nextCollaborationTuiPane,
  scrollCollaborationTuiOffsets,
  type CollaborationTuiUpdateSource,
} from '../../src/collaboration-state/tui/controller';

Object.assign(globalThis, { IS_REACT_ACT_ENVIRONMENT: true });

describe('CollaborationTuiApp', () => {
  it('cycles focus through the four operator panes', () => {
    expect(nextCollaborationTuiPane('main')).toBe('agents');
    expect(nextCollaborationTuiPane('agents')).toBe('queue');
    expect(nextCollaborationTuiPane('queue')).toBe('directed');
    expect(nextCollaborationTuiPane('directed')).toBe('main');
  });

  it('keeps scroll offsets inside the visible range for the focused pane', () => {
    const snapshotWithEightRows = snapshotWithMainEntries('2026-05-13T17:00:00Z', [
      'Message 0',
      'Message 1',
      'Message 2',
      'Message 3',
      'Message 4',
      'Message 5',
      'Message 6',
      'Message 7',
    ]);
    const initialOffsets: Readonly<Record<CollaborationTuiPane, number>> = {
      main: 0,
      agents: 0,
      queue: 0,
      directed: 0,
    };
    const boundedAtBottom = Array.from({ length: 20 }).reduce<
      Readonly<Record<CollaborationTuiPane, number>>
    >(
      (offsets) =>
        scrollCollaborationTuiOffsets({
          direction: 'down',
          offsets,
          pane: 'main',
          snapshot: snapshotWithEightRows,
        }),
      initialOffsets,
    );

    expect(boundedAtBottom.main).toBe(2);

    expect(
      scrollCollaborationTuiOffsets({
        direction: 'up',
        offsets: boundedAtBottom,
        pane: 'main',
        snapshot: snapshotWithEightRows,
      }).main,
    ).toBe(1);
  });

  it('refreshes from an injected live update source without a keyboard command', async () => {
    const updates = new ManualUpdateSource();
    const result = render(
      React.createElement(CollaborationTuiApp, {
        initialSnapshot: snapshot('2026-05-13T17:00:00Z', 'Initial message'),
        onRefresh: async () => snapshot('2026-05-13T17:01:00Z', 'Live update arrived'),
        updateSource: updates,
      }),
    );
    await result.waitUntilRenderFlush();

    expect(result.lastFrame()).toContain('Initial message');

    await act(async () => {
      updates.emit();
      await Promise.resolve();
    });
    await result.waitUntilRenderFlush();

    expect(result.lastFrame()).toContain('Live update arrived');
    expect(result.lastFrame()).toContain('refreshed 2026-05-13T17:01:00Z');

    result.unmount();
  });

  it('shows refresh failure state without replacing the last good snapshot', async () => {
    const updates = new ManualUpdateSource();
    const result = render(
      React.createElement(CollaborationTuiApp, {
        initialSnapshot: snapshot('2026-05-13T17:00:00Z', 'Initial message'),
        onRefresh: async () => {
          throw new Error('refresh source unavailable');
        },
        updateSource: updates,
      }),
    );
    await result.waitUntilRenderFlush();

    await act(async () => {
      updates.emit();
      await Promise.resolve();
    });
    await result.waitUntilRenderFlush();

    expect(result.lastFrame()).toContain('Initial message');
    expect(result.lastFrame()).toContain('refresh source unavailable');

    result.unmount();
  });

  it('keeps the newest refresh when an older refresh resolves late', async () => {
    const updates = new ManualUpdateSource();
    const firstRefresh = deferred<CollaborationTuiSnapshot>();
    const secondRefresh = deferred<CollaborationTuiSnapshot>();
    const refreshes = [firstRefresh.promise, secondRefresh.promise];
    const result = render(
      React.createElement(CollaborationTuiApp, {
        initialSnapshot: snapshot('2026-05-13T17:00:00Z', 'Initial message'),
        onRefresh: async () => refreshes.shift() ?? snapshot('2026-05-13T17:03:00Z', 'Fallback'),
        updateSource: updates,
      }),
    );
    await result.waitUntilRenderFlush();

    await act(async () => {
      updates.emit();
      updates.emit();
      secondRefresh.resolve(snapshot('2026-05-13T17:02:00Z', 'Second refresh'));
      await Promise.resolve();
    });
    await result.waitUntilRenderFlush();

    expect(result.lastFrame()).toContain('Second refresh');

    await act(async () => {
      firstRefresh.resolve(snapshot('2026-05-13T17:01:00Z', 'Stale first refresh'));
      await Promise.resolve();
    });
    await result.waitUntilRenderFlush();

    expect(result.lastFrame()).toContain('Second refresh');
    expect(result.lastFrame()).not.toContain('Stale first refresh');

    result.unmount();
  });

  it('ignores a stale refresh failure after a newer refresh succeeds', async () => {
    const updates = new ManualUpdateSource();
    const firstRefresh = deferred<CollaborationTuiSnapshot>();
    const secondRefresh = deferred<CollaborationTuiSnapshot>();
    const refreshes = [firstRefresh.promise, secondRefresh.promise];
    const result = render(
      React.createElement(CollaborationTuiApp, {
        initialSnapshot: snapshot('2026-05-13T17:00:00Z', 'Initial message'),
        onRefresh: async () => refreshes.shift() ?? snapshot('2026-05-13T17:03:00Z', 'Fallback'),
        updateSource: updates,
      }),
    );
    await result.waitUntilRenderFlush();

    await act(async () => {
      updates.emit();
      updates.emit();
      secondRefresh.resolve(snapshot('2026-05-13T17:02:00Z', 'Second refresh'));
      await Promise.resolve();
    });
    await result.waitUntilRenderFlush();

    await act(async () => {
      firstRefresh.reject(new Error('stale refresh failed'));
      await Promise.resolve();
    });
    await result.waitUntilRenderFlush();

    expect(result.lastFrame()).toContain('Second refresh');
    expect(result.lastFrame()).toContain('refreshed 2026-05-13T17:02:00Z');
    expect(result.lastFrame()).not.toContain('stale refresh failed');

    result.unmount();
  });
});

class ManualUpdateSource implements CollaborationTuiUpdateSource {
  private subscribers: (() => void)[] = [];

  subscribe(onChange: () => void): () => void {
    this.subscribers = [...this.subscribers, onChange];
    return () => {
      this.subscribers = this.subscribers.filter((subscriber) => subscriber !== onChange);
    };
  }

  emit(): void {
    for (const subscriber of this.subscribers) {
      subscriber();
    }
  }
}

function render(node: React.ReactNode): {
  readonly lastFrame: () => string | undefined;
  readonly unmount: Instance['unmount'];
  readonly waitUntilRenderFlush: Instance['waitUntilRenderFlush'];
} {
  const originalWrite = process.stdout.write;
  const originalIsTty = process.stdin.isTTY;
  const originalSetRawMode = process.stdin.setRawMode;
  const frames: string[] = [];
  const captureWrite: typeof process.stdout.write = function write(
    chunk: string | Uint8Array,
    encodingOrCallback?: BufferEncoding | ((error?: Error | null) => void),
    callback?: (error?: Error | null) => void,
  ): boolean {
    frames.push(String(chunk));
    if (typeof encodingOrCallback === 'function') {
      encodingOrCallback();
    }
    callback?.();
    return true;
  };

  process.stdout.write = captureWrite;
  Object.defineProperty(process.stdin, 'isTTY', {
    configurable: true,
    value: true,
  });
  process.stdin.setRawMode = () => process.stdin;
  const instance = renderInk(node, {
    debug: true,
    exitOnCtrlC: false,
    interactive: true,
    patchConsole: false,
  });

  return {
    lastFrame: () => frames.findLast((frame) => frame.trim() !== ''),
    waitUntilRenderFlush: instance.waitUntilRenderFlush,
    unmount: () => {
      instance.unmount();
      instance.cleanup();
      process.stdout.write = originalWrite;
      Object.defineProperty(process.stdin, 'isTTY', {
        configurable: true,
        value: originalIsTty,
      });
      process.stdin.setRawMode = originalSetRawMode;
    },
  };
}

function deferred<T>(): {
  readonly promise: Promise<T>;
  readonly resolve: (value: T) => void;
  readonly reject: (error: Error) => void;
} {
  let resolveValue: ((value: T) => void) | undefined;
  let rejectValue: ((error: Error) => void) | undefined;
  const promise = new Promise<T>((resolve, reject) => {
    resolveValue = resolve;
    rejectValue = reject;
  });

  if (resolveValue === undefined || rejectValue === undefined) {
    throw new Error('deferred promise resolver was not initialised');
  }

  return { promise, resolve: resolveValue, reject: rejectValue };
}

function snapshot(generatedAt: string, body: string): CollaborationTuiSnapshot {
  return snapshotWithMainEntries(generatedAt, [body]);
}

function snapshotWithMainEntries(
  generatedAt: string,
  bodies: readonly string[],
): CollaborationTuiSnapshot {
  return {
    generated_at: generatedAt,
    main: bodies.map((body, index) => ({
      id: `${generatedAt}-${index}`,
      created_at: generatedAt,
      kind: 'narrative',
      title: 'Live collaboration note',
      body,
      author: 'Mossy Blossoming Canopy / codex / GPT-5 / 019e22',
    })),
    directed: [],
    agents: [],
    queue: [],
  };
}
