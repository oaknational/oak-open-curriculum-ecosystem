'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import type { JSX } from 'react';
import { useRouter } from 'next/navigation';
import { OakTypography, OakSecondaryButton } from '@oaknational/oak-components';
import type { FixtureMode } from '../../lib/fixture-mode';
import { setFixtureMode } from '../fixture-mode-toggle.actions';
import { FixtureToggleWrapper, VisuallyHiddenStatus } from './SearchPageClient.styles';

interface SearchFixtureModeToggleProps {
  readonly initialMode: FixtureMode;
  readonly visible: boolean;
}

export function SearchFixtureModeToggle({
  initialMode,
  visible,
}: SearchFixtureModeToggleProps): JSX.Element | null {
  const state = useFixtureModeToggle(initialMode);

  if (!visible) {
    return null;
  }

  return (
    <FixtureToggleWrapper>
      <OakTypography as="span" $font="body-4" aria-live="polite">
        Search data: {state.summaryLabel}
      </OakTypography>
      <OakSecondaryButton
        type="button"
        aria-pressed={state.mode === 'fixtures'}
        onClick={state.handleToggle}
        disabled={state.isPending}
        data-testid="fixture-mode-toggle"
      >
        {state.isPending ? 'Updating…' : state.buttonLabel}
      </OakSecondaryButton>
      <VisuallyHiddenStatus aria-live="polite" role="status">
        {state.statusMessage}
      </VisuallyHiddenStatus>
    </FixtureToggleWrapper>
  );
}

function useFixtureModeToggle(initialMode: FixtureMode) {
  const router = useRouter();
  const [mode, setMode] = useState<FixtureMode>(initialMode);
  const [statusMessage, setStatusMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    setMode(initialMode);
    setStatusMessage(initialMode === 'fixtures' ? 'Fixtures enabled.' : 'Live data enabled.');
  }, [initialMode]);

  const handleToggle = useCallback(() => {
    const previousMode = mode;
    const targetMode: FixtureMode = mode === 'fixtures' ? 'live' : 'fixtures';
    setMode(targetMode);
    setStatusMessage(targetMode === 'fixtures' ? 'Fixtures enabled.' : 'Live data enabled.');

    startTransition(async () => {
      try {
        await setFixtureMode(targetMode);
        router.refresh();
      } catch (error) {
        console.error('Failed to update fixture mode', error);
        setMode(previousMode);
        setStatusMessage('Failed to update fixture mode.');
      }
    });
  }, [mode, router, startTransition]);

  const buttonLabel = mode === 'fixtures' ? 'Use live data' : 'Use fixtures';
  const summaryLabel = mode === 'fixtures' ? 'Fixtures' : 'Live';

  return {
    mode,
    buttonLabel,
    summaryLabel,
    handleToggle,
    isPending,
    statusMessage,
  } as const;
}
