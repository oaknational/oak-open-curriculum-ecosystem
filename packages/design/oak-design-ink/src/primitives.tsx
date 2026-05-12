import { Box, Text } from 'ink';
import { type ComponentProps, type ReactNode } from 'react';

import { useOakInkTheme } from './theme.js';

/** Status tone names shared by terminal design primitives. */
export type StatusTone = 'active' | 'muted' | 'success' | 'warning' | 'danger';

/** Framed terminal panel for dense operational views. */
export function Panel({
  title,
  children,
}: {
  readonly title?: string;
  readonly children: ReactNode;
}): React.JSX.Element {
  const theme = useOakInkTheme();

  return (
    <Box flexDirection="column" borderStyle="round" borderColor={theme.colours.border} paddingX={1}>
      {title === undefined ? null : <PaneTitle>{title}</PaneTitle>}
      {children}
    </Box>
  );
}

/** Compact pane heading. */
export function PaneTitle({ children }: { readonly children: ReactNode }): React.JSX.Element {
  const theme = useOakInkTheme();

  return (
    <Text bold color={theme.colours.active}>
      {children}
    </Text>
  );
}

/** Small status marker with a semantic tone. */
export function StatusBadge({
  tone,
  children,
}: {
  readonly tone: StatusTone;
  readonly children: ReactNode;
}): React.JSX.Element {
  const theme = useOakInkTheme();

  return (
    <Text bold color={toneColour(theme, tone)}>
      [{children}]
    </Text>
  );
}

/** Keyboard hint label for command footers. */
export function KeyHint({
  keyName,
  label,
}: {
  readonly keyName: string;
  readonly label: string;
}): React.JSX.Element {
  const theme = useOakInkTheme();

  return (
    <Text>
      <Text bold color={theme.colours.active}>
        {keyName}
      </Text>
      <Text color={theme.colours.muted}> {label}</Text>
    </Text>
  );
}

/** Horizontal footer for terminal command hints. */
export function CommandFooter({ children }: { readonly children: ReactNode }): React.JSX.Element {
  return <Box columnGap={2}>{children}</Box>;
}

/** Quiet empty state for panes without current data. */
export function EmptyState({ children }: { readonly children: ReactNode }): React.JSX.Element {
  const theme = useOakInkTheme();

  return <Text color={theme.colours.muted}>{children}</Text>;
}

/** Oak-themed text wrapper for terminal UIs. */
export function OakText({ color, ...props }: ComponentProps<typeof Text>): React.JSX.Element {
  const theme = useOakInkTheme();

  return <Text color={color ?? theme.colours.text} {...props} />;
}

function toneColour(theme: ReturnType<typeof useOakInkTheme>, tone: StatusTone): string {
  const colours: Record<StatusTone, string> = {
    active: theme.colours.active,
    muted: theme.colours.muted,
    success: theme.colours.success,
    warning: theme.colours.warning,
    danger: theme.colours.danger,
  };

  return colours[tone];
}
