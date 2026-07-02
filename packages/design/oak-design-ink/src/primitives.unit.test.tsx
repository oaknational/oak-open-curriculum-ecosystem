import { render } from 'ink-testing-library';
import { describe, expect, it } from 'vitest';

import {
  CommandFooter,
  EmptyState,
  KeyHint,
  OakInkThemeProvider,
  Panel,
  StatusBadge,
} from './index.js';

// The rendered frame carries ANSI colour codes only when the ambient environment reports colour
// support, and KeyHint renders its key and label as two separately-styled <Text> nodes — so the raw
// frame splits "q quit" with escape codes in a colour terminal and not in a plain one. Assert on the
// VISIBLE text (what a user reads) rather than the colour encoding (an ambient-env implementation
// detail): strip the escape sequences first so the proof is deterministic across environments.
const ansiPattern = new RegExp(String.raw`${String.fromCharCode(27)}\[[0-9;]*m`, 'g');
const visibleText = (frame: string | undefined): string =>
  (frame ?? '').replaceAll(ansiPattern, '');

describe('Oak Ink primitives', () => {
  it('renders reusable panel, status, and footer primitives', () => {
    const result = render(
      <OakInkThemeProvider mode="dark">
        <Panel title="Collaboration">
          <StatusBadge tone="success">active</StatusBadge>
          <EmptyState>No messages</EmptyState>
          <CommandFooter>
            <KeyHint keyName="q" label="quit" />
          </CommandFooter>
        </Panel>
      </OakInkThemeProvider>,
    );

    const frame = visibleText(result.lastFrame());
    expect(frame).toContain('Collaboration');
    expect(frame).toContain('[active]');
    expect(frame).toContain('No messages');
    expect(frame).toContain('q quit');
  });
});
