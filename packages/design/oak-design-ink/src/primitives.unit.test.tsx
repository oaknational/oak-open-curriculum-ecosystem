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

    expect(result.lastFrame()).toContain('Collaboration');
    expect(result.lastFrame()).toContain('[active]');
    expect(result.lastFrame()).toContain('No messages');
    expect(result.lastFrame()).toContain('q quit');
  });
});
