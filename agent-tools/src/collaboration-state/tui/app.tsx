import {
  CommandFooter,
  KeyHint,
  OakInkThemeProvider,
  OakText,
  PaneTitle,
} from '@oaknational/oak-design-ink';
import { Box, Text } from 'ink';

import { type CollaborationTuiSnapshot } from './snapshot.js';
import { useCollaborationTuiController } from './controller.js';
import { AgentsPane, DirectedPane, MainPane, QueuePane, visible } from './panes.js';

export interface CollaborationTuiAppProps {
  readonly initialSnapshot: CollaborationTuiSnapshot;
  readonly onRefresh?: () => Promise<CollaborationTuiSnapshot>;
}

export function CollaborationTuiApp(props: CollaborationTuiAppProps): React.JSX.Element {
  return (
    <OakInkThemeProvider mode="dark">
      <CollaborationTuiSurface {...props} />
    </OakInkThemeProvider>
  );
}

function CollaborationTuiSurface({
  initialSnapshot,
  onRefresh,
}: CollaborationTuiAppProps): React.JSX.Element {
  const { activePane, offsets, snapshot, status } = useCollaborationTuiController({
    initialSnapshot,
    onRefresh,
  });

  return (
    <Box flexDirection="column" gap={1}>
      <Header snapshot={snapshot} status={status} />
      <Box gap={1}>
        <MainPane entries={visible(snapshot.main, offsets.main)} active={activePane === 'main'} />
        <AgentsPane
          entries={visible(snapshot.agents, offsets.agents)}
          active={activePane === 'agents'}
        />
      </Box>
      <Box gap={1}>
        <QueuePane
          entries={visible(snapshot.queue, offsets.queue)}
          active={activePane === 'queue'}
        />
        <DirectedPane
          entries={visible(snapshot.directed, offsets.directed)}
          active={activePane === 'directed'}
        />
      </Box>
      <CommandFooter>
        <KeyHint keyName="tab" label="pane" />
        <KeyHint keyName="up/down" label="scroll" />
        <KeyHint keyName="r" label="refresh" />
        <KeyHint keyName="q" label="quit" />
      </CommandFooter>
    </Box>
  );
}

function Header({
  snapshot,
  status,
}: {
  readonly snapshot: CollaborationTuiSnapshot;
  readonly status: string;
}): React.JSX.Element {
  return (
    <Box flexDirection="column">
      <PaneTitle>Agent Collaboration</PaneTitle>
      <OakText>
        Generated {snapshot.generated_at} <Text dimColor>({status})</Text>
      </OakText>
    </Box>
  );
}
