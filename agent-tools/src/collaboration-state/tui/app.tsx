import { Box, Text } from 'ink';

import { type CollaborationTuiUpdateSource } from './controller.js';
import { type CollaborationTuiSnapshot } from './snapshot.js';
import { useCollaborationTuiController } from './controller.js';
import { AgentsPane, DirectedPane, MainPane, QueuePane, visible } from './panes.js';

export interface CollaborationTuiAppProps {
  readonly initialSnapshot: CollaborationTuiSnapshot;
  readonly onRefresh?: () => Promise<CollaborationTuiSnapshot>;
  readonly updateSource?: CollaborationTuiUpdateSource;
}

export function CollaborationTuiApp(props: CollaborationTuiAppProps): React.JSX.Element {
  const { activePane, offsets, snapshot, status } = useCollaborationTuiController({
    initialSnapshot: props.initialSnapshot,
    onRefresh: props.onRefresh,
    updateSource: props.updateSource,
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
      <Footer>
        <KeyHint keyName="tab" label="pane" />
        <KeyHint keyName="up/down" label="scroll" />
        <KeyHint keyName="r" label="refresh" />
        <KeyHint keyName="q" label="quit" />
      </Footer>
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
      <Text bold color="cyan">
        Agent Collaboration
      </Text>
      <Text>
        Generated {snapshot.generated_at} <Text dimColor>({status})</Text>
      </Text>
    </Box>
  );
}

function Footer({ children }: { readonly children: React.ReactNode }): React.JSX.Element {
  return (
    <Box gap={2}>
      <Text dimColor>keys</Text>
      {children}
    </Box>
  );
}

function KeyHint({
  keyName,
  label,
}: {
  readonly keyName: string;
  readonly label: string;
}): React.JSX.Element {
  return (
    <Text>
      <Text bold>{keyName}</Text> {label}
    </Text>
  );
}
