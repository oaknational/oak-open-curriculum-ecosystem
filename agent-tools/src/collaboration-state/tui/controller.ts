import { useApp, useInput } from 'ink';
import {
  type Dispatch,
  type SetStateAction,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
} from 'react';

import {
  initialRefreshState,
  reduceRefreshState,
  type RefreshEvent,
} from './reduce-refresh-state.js';
import { type CollaborationTuiSnapshot } from './snapshot.js';

export type CollaborationTuiPane = 'main' | 'agents' | 'queue' | 'directed';

export interface CollaborationTuiController {
  readonly activePane: CollaborationTuiPane;
  readonly offsets: Readonly<Record<CollaborationTuiPane, number>>;
  readonly snapshot: CollaborationTuiSnapshot;
  readonly status: string;
}

export interface CollaborationTuiUpdateSource {
  readonly subscribe: (onChange: () => void) => () => void;
}

interface CollaborationTuiControllerInput {
  readonly initialSnapshot: CollaborationTuiSnapshot;
  readonly onRefresh?: () => Promise<CollaborationTuiSnapshot>;
  readonly updateSource?: CollaborationTuiUpdateSource;
}

const panes: readonly CollaborationTuiPane[] = ['main', 'agents', 'queue', 'directed'];
const visibleRows = 6;

export function useCollaborationTuiController({
  initialSnapshot,
  onRefresh,
  updateSource,
}: CollaborationTuiControllerInput): CollaborationTuiController {
  const { exit } = useApp();
  const [refresh, dispatchRefresh] = useReducer(
    reduceRefreshState,
    initialSnapshot,
    initialRefreshState,
  );
  const [activePane, setActivePane] = useState<CollaborationTuiPane>('main');
  const [offsets, setOffsets] =
    useState<Readonly<Record<CollaborationTuiPane, number>>>(initialOffsets());
  const runRefresh = useLiveRefresh({
    onRefresh,
    dispatchRefresh,
    updateSource,
  });

  useConstrainedOffsets({ setOffsets, snapshot: refresh.snapshot });
  useCollaborationTuiInput({
    activePane,
    exit,
    onRefresh,
    runRefresh,
    setActivePane,
    setOffsets,
    snapshot: refresh.snapshot,
  });

  return {
    activePane,
    offsets,
    snapshot: refresh.snapshot,
    status: refresh.status,
  };
}

function useCollaborationTuiInput(input: {
  readonly activePane: CollaborationTuiPane;
  readonly exit: () => void;
  readonly onRefresh?: () => Promise<CollaborationTuiSnapshot>;
  readonly runRefresh: () => void;
  readonly setActivePane: Dispatch<SetStateAction<CollaborationTuiPane>>;
  readonly setOffsets: Dispatch<SetStateAction<Readonly<Record<CollaborationTuiPane, number>>>>;
  readonly snapshot: CollaborationTuiSnapshot;
}): void {
  useInput((keyInput, key) => {
    if (keyInput === 'q') {
      input.exit();
      return;
    }
    if (key.tab) {
      input.setActivePane(nextCollaborationTuiPane(input.activePane));
      return;
    }
    if (key.upArrow) {
      input.setOffsets((current) =>
        scrollCollaborationTuiOffsets({
          direction: 'up',
          offsets: current,
          pane: input.activePane,
          snapshot: input.snapshot,
        }),
      );
      return;
    }
    if (key.downArrow) {
      input.setOffsets((current) =>
        scrollCollaborationTuiOffsets({
          direction: 'down',
          offsets: current,
          pane: input.activePane,
          snapshot: input.snapshot,
        }),
      );
      return;
    }
    if (keyInput === 'r' && input.onRefresh !== undefined) {
      input.runRefresh();
    }
  });
}

function useConstrainedOffsets(input: {
  readonly setOffsets: Dispatch<SetStateAction<Readonly<Record<CollaborationTuiPane, number>>>>;
  readonly snapshot: CollaborationTuiSnapshot;
}): void {
  const { setOffsets, snapshot } = input;
  useEffect(() => {
    setOffsets((current) => clampOffsets(current, snapshot));
  }, [setOffsets, snapshot]);
}

function useLiveRefresh(input: {
  readonly onRefresh?: () => Promise<CollaborationTuiSnapshot>;
  readonly dispatchRefresh: Dispatch<RefreshEvent>;
  readonly updateSource?: CollaborationTuiUpdateSource;
}): () => void {
  const attemptCounter = useRef(0);
  const runRefresh = useCallback(() => {
    if (input.onRefresh === undefined) {
      return;
    }
    attemptCounter.current += 1;
    const attemptId = attemptCounter.current;
    input.dispatchRefresh({ kind: 'refresh-started', attemptId });
    input
      .onRefresh()
      .then((snapshot) => {
        input.dispatchRefresh({ kind: 'refresh-succeeded', attemptId, snapshot });
      })
      .catch((error: unknown) => {
        input.dispatchRefresh({
          kind: 'refresh-failed',
          attemptId,
          error: error instanceof Error ? error : new Error(String(error)),
        });
      });
  }, [input]);

  useEffect(() => {
    if (input.updateSource === undefined) {
      return undefined;
    }

    return input.updateSource.subscribe(runRefresh);
  }, [runRefresh, input.updateSource]);

  return runRefresh;
}

function initialOffsets(): Readonly<Record<CollaborationTuiPane, number>> {
  return {
    main: 0,
    agents: 0,
    queue: 0,
    directed: 0,
  };
}

export function scrollCollaborationTuiOffsets(input: {
  readonly direction: 'up' | 'down';
  readonly offsets: Readonly<Record<CollaborationTuiPane, number>>;
  readonly pane: CollaborationTuiPane;
  readonly snapshot: CollaborationTuiSnapshot;
}): Record<CollaborationTuiPane, number> {
  const nextOffset =
    input.direction === 'up'
      ? Math.max(0, input.offsets[input.pane] - 1)
      : Math.min(maxOffset(input.snapshot, input.pane), input.offsets[input.pane] + 1);

  return { ...input.offsets, [input.pane]: nextOffset };
}

export function nextCollaborationTuiPane(current: CollaborationTuiPane): CollaborationTuiPane {
  return panes[(panes.indexOf(current) + 1) % panes.length] ?? 'main';
}

function clampOffsets(
  offsets: Readonly<Record<CollaborationTuiPane, number>>,
  snapshot: CollaborationTuiSnapshot,
): Record<CollaborationTuiPane, number> {
  return {
    main: Math.min(offsets.main, maxOffset(snapshot, 'main')),
    agents: Math.min(offsets.agents, maxOffset(snapshot, 'agents')),
    queue: Math.min(offsets.queue, maxOffset(snapshot, 'queue')),
    directed: Math.min(offsets.directed, maxOffset(snapshot, 'directed')),
  };
}

function maxOffset(snapshot: CollaborationTuiSnapshot, pane: CollaborationTuiPane): number {
  return Math.max(0, paneEntries(snapshot, pane).length - visibleRows);
}

function paneEntries(
  snapshot: CollaborationTuiSnapshot,
  pane: CollaborationTuiPane,
): readonly unknown[] {
  return snapshot[pane];
}
