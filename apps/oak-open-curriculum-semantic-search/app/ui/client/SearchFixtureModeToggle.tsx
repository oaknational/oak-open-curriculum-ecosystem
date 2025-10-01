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
  readonly onModeChange?: (mode: FixtureMode) => void;
}

export function SearchFixtureModeToggle({
  initialMode,
  visible,
  onModeChange,
}: SearchFixtureModeToggleProps): JSX.Element | null {
  const state = useFixtureModeToggle(initialMode, onModeChange);

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

function useFixtureModeToggle(
  initialMode: FixtureMode,
  onModeChange?: (mode: FixtureMode) => void,
) {
  const router = useRouter();
  const [mode, setMode] = useState<'fixtures' | 'live'>(normaliseToggleMode(initialMode));
  const [statusMessage, setStatusMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const normalised = normaliseToggleMode(initialMode);
    setMode(normalised);
    setStatusMessage(resolveStatusMessage(initialMode));
    onModeChange?.(initialMode);
  }, [initialMode, onModeChange]);

  const handleToggle = useCallback(() => {
    const previousMode = mode;
    const targetMode: 'fixtures' | 'live' = mode === 'fixtures' ? 'live' : 'fixtures';
    const targetFixtureMode: FixtureMode = targetMode;
    setMode(targetMode);
    setStatusMessage(resolveStatusMessage(targetFixtureMode));
    onModeChange?.(targetFixtureMode);

    startTransition(async () => {
      try {
        await setFixtureMode(targetMode);
        router.refresh();
      } catch (error) {
        console.error('Failed to update fixture mode', error);
        setMode(previousMode);
        setStatusMessage('Failed to update fixture mode.');
        onModeChange?.(previousMode);
      }
    });
  }, [mode, onModeChange, router, startTransition]);

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

function normaliseToggleMode(mode: FixtureMode): 'fixtures' | 'live' {
  return mode === 'live' ? 'live' : 'fixtures';
}

function resolveStatusMessage(mode: FixtureMode): string {
  switch (mode) {
    case 'fixtures':
      return 'Deterministic fixtures enabled.';
    case 'fixtures-empty':
      return 'Deterministic empty fixtures enabled.';
    case 'fixtures-error':
      return 'Error fixtures enabled.';
    case 'live':
    default:
      return 'Live data enabled.';
  }
}
