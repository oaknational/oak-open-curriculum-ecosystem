import { act, render, screen } from '@testing-library/react';
import type { JSX } from 'react';
import { describe, expect, it } from 'vitest';

import type { FixtureMode } from '../../../lib/fixture-mode';
import { FixtureModeProvider, useFixtureMode } from './FixtureModeContext';

describe('FixtureModeContext', () => {
  it('provides the initial mode to descendants', () => {
    render(
      <FixtureModeProvider initialMode="fixtures">
        <FixtureModeConsumer />
      </FixtureModeProvider>,
    );

    expect(screen.getByTestId('fixture-mode')).toHaveTextContent('fixtures');
  });

  it('updates mode when setMode is invoked', () => {
    render(
      <FixtureModeProvider initialMode="live">
        <FixtureModeConsumer />
      </FixtureModeProvider>,
    );

    act(() => {
      screen.getByRole('button', { name: 'set-fixtures' }).click();
    });

    expect(screen.getByTestId('fixture-mode')).toHaveTextContent('fixtures');
  });
});

function FixtureModeConsumer(): JSX.Element {
  const { mode, setMode } = useFixtureMode();

  return (
    <div>
      <span data-testid="fixture-mode">{mode}</span>
      <button type="button" onClick={() => setMode(nextMode(mode))}>
        set-fixtures
      </button>
    </div>
  );
}

function nextMode(current: FixtureMode): FixtureMode {
  return current === 'fixtures' ? 'live' : 'fixtures';
}
