'use client';

import { useCallback, useEffect, useId, useState, useTransition } from 'react';
import type { ChangeEvent, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { OakTypography, OakRadioGroup, OakRadioButton } from '@oaknational/oak-components';
import type { FixtureMode } from '../../../lib/fixture-mode';
import { setFixtureMode } from './fixture-mode-toggle.actions';
import { FixtureToggleWrapper, VisuallyHiddenStatus } from './FixtureToggle.styles';

interface SearchFixtureModeToggleProps {
  readonly initialMode: FixtureMode;
  readonly visible: boolean;
  readonly onModeChange?: (mode: FixtureMode) => void;
  readonly label?: string;
}

const FIXTURE_MODE_OPTIONS: readonly {
  readonly value: FixtureMode;
  readonly label: string;
}[] = [
  { value: 'live', label: 'Live data' },
  { value: 'fixtures', label: 'Fixtures (success)' },
  { value: 'fixtures-empty', label: 'Fixtures (empty)' },
  { value: 'fixtures-error', label: 'Fixtures (error)' },
];

const DEFAULT_GROUP_LABEL = 'Search data';

export function SearchFixtureModeToggle({
  initialMode,
  visible,
  onModeChange,
  label,
}: SearchFixtureModeToggleProps): JSX.Element | null {
  const state = useFixtureModeToggle(initialMode, onModeChange);

  if (!visible) {
    return null;
  }

  return (
    <FixtureToggleWrapper>
      <OakRadioGroup
        name="search-fixture-mode"
        label={label ?? DEFAULT_GROUP_LABEL}
        aria-label={label ?? DEFAULT_GROUP_LABEL}
        value={state.mode}
        aria-describedby={state.summaryId}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          const value = event.target.value;
          if (!isFixtureModeChoice(value)) {
            return;
          }
          state.handleSelect(value);
        }}
        $gap="spacing-4"
      >
        {FIXTURE_MODE_OPTIONS.map((option) => (
          <OakRadioButton
            key={option.value}
            id={`search-fixture-mode-${option.value}`}
            value={option.value}
            label={option.label}
            disabled={state.isPending}
          />
        ))}
      </OakRadioGroup>
      <OakTypography as="span" $font="body-4" id={state.summaryId} aria-live="polite">
        Using {state.summaryLabel}
      </OakTypography>
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
  const [mode, setMode] = useState<FixtureMode>(initialMode);
  const [statusMessage, setStatusMessage] = useState(resolveStatusMessage(initialMode));
  const [isPending, startTransition] = useTransition();
  const summaryId = useId();
  useEffect(() => {
    setMode(initialMode);
    setStatusMessage(resolveStatusMessage(initialMode));
    onModeChange?.(initialMode);
  }, [initialMode, onModeChange]);

  const handleSelect = useCallback(
    (nextMode: FixtureMode) => {
      if (nextMode === mode) {
        return;
      }
      const previousMode = mode;
      setMode(nextMode);
      setStatusMessage(resolveStatusMessage(nextMode));
      onModeChange?.(nextMode);
      startTransition(async () => {
        try {
          await setFixtureMode(nextMode);
          router.refresh();
        } catch (error) {
          console.error('Failed to update fixture mode', error);
          setMode(previousMode);
          setStatusMessage('Failed to update fixture mode.');
          onModeChange?.(previousMode);
        }
      });
    },
    [mode, onModeChange, router, startTransition],
  );

  const summaryLabel = resolveSummaryLabel(mode);
  return {
    mode,
    summaryLabel,
    summaryId,
    handleSelect,
    isPending,
    statusMessage,
  } as const;
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

function resolveSummaryLabel(mode: FixtureMode): string {
  switch (mode) {
    case 'fixtures':
      return 'fixtures (success)';
    case 'fixtures-empty':
      return 'fixtures (empty)';
    case 'fixtures-error':
      return 'fixtures (error)';
    case 'live':
    default:
      return 'live data';
  }
}

function isFixtureModeChoice(value: string): value is FixtureMode {
  return FIXTURE_MODE_OPTIONS.some((option) => option.value === value);
}
