import { render } from 'ink-testing-library';
import React from 'react';
import { describe, expect, it } from 'vitest';

import { type CollaborationTuiSnapshot } from '../../src/collaboration-state';
import { CollaborationTuiApp } from '../../src/collaboration-state/tui/app';
import {
  type CollaborationTuiPane,
  nextCollaborationTuiPane,
  scrollCollaborationTuiOffsets,
} from '../../src/collaboration-state/tui/controller';

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

  it('renders the initial snapshot body through the Ink render path', () => {
    const result = render(
      React.createElement(CollaborationTuiApp, {
        initialSnapshot: snapshot('2026-05-13T17:00:00Z', 'Hello from Ink'),
      }),
    );

    expect(result.lastFrame()).toContain('Hello from Ink');
    expect(result.lastFrame()).toContain('Generated 2026-05-13T17:00:00Z');

    result.unmount();
  });
});

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
