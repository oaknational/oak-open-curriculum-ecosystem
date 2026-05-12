import { useApp, useInput } from 'ink';
import { useState } from 'react';

import { type CollaborationTuiSnapshot } from './snapshot.js';

export type Pane = 'main' | 'agents' | 'queue' | 'directed';

export interface CollaborationTuiController {
  readonly activePane: Pane;
  readonly offsets: Readonly<Record<Pane, number>>;
  readonly snapshot: CollaborationTuiSnapshot;
  readonly status: string;
}

interface CollaborationTuiControllerInput {
  readonly initialSnapshot: CollaborationTuiSnapshot;
  readonly onRefresh?: () => Promise<CollaborationTuiSnapshot>;
}

const panes: readonly Pane[] = ['main', 'agents', 'queue', 'directed'];

export function useCollaborationTuiController({
  initialSnapshot,
  onRefresh,
}: CollaborationTuiControllerInput): CollaborationTuiController {
  const { exit } = useApp();
  const [snapshot, setSnapshot] = useState(initialSnapshot);
  const [activePane, setActivePane] = useState<Pane>('main');
  const [offsets, setOffsets] = useState<Readonly<Record<Pane, number>>>(initialOffsets());
  const [status, setStatus] = useState('ready');

  useInput((input, key) => {
    if (input === 'q') {
      exit();
      return;
    }
    if (key.tab) {
      setActivePane(nextPane(activePane));
      return;
    }
    if (key.upArrow) {
      setOffsets((current) => decrementOffset(current, activePane));
      return;
    }
    if (key.downArrow) {
      setOffsets((current) => incrementOffset(current, activePane));
      return;
    }
    if (input === 'r' && onRefresh !== undefined) {
      refreshSnapshot({ onRefresh, setSnapshot, setStatus });
    }
  });

  return { activePane, offsets, snapshot, status };
}

function refreshSnapshot(input: {
  readonly onRefresh: () => Promise<CollaborationTuiSnapshot>;
  readonly setSnapshot: (snapshot: CollaborationTuiSnapshot) => void;
  readonly setStatus: (status: string) => void;
}): void {
  input.setStatus('refreshing');
  input
    .onRefresh()
    .then((next) => {
      input.setSnapshot(next);
      input.setStatus('refreshed');
    })
    .catch((error: unknown) => {
      input.setStatus(error instanceof Error ? error.message : String(error));
    });
}

function initialOffsets(): Readonly<Record<Pane, number>> {
  return {
    main: 0,
    agents: 0,
    queue: 0,
    directed: 0,
  };
}

function decrementOffset(
  offsets: Readonly<Record<Pane, number>>,
  pane: Pane,
): Record<Pane, number> {
  return { ...offsets, [pane]: Math.max(0, offsets[pane] - 1) };
}

function incrementOffset(
  offsets: Readonly<Record<Pane, number>>,
  pane: Pane,
): Record<Pane, number> {
  return { ...offsets, [pane]: offsets[pane] + 1 };
}

function nextPane(current: Pane): Pane {
  return panes[(panes.indexOf(current) + 1) % panes.length] ?? 'main';
}
