'use client';

import { useCallback, useEffect, useMemo, useState, type JSX } from 'react';
import type { FixtureMode } from '../../../lib/fixture-mode';
import { SearchFixtureModeToggle } from './FixtureModeToggle';
import { FixtureToggleCluster, FixtureBanner, FixtureNoticeText } from './FixtureToggle.styles';
import { STRUCTURED_FIXTURE_OUTAGE_MESSAGE } from '../../search/content/structured-search-messages';

type FixtureNoticeCopy = Partial<Record<FixtureMode, string | null>>;

const DEFAULT_FIXTURE_NOTICE_COPY: Record<FixtureMode, string | null> = {
  fixtures:
    'Showing deterministic fixture results. Switch to live data to inspect production behaviour.',
  'fixtures-empty':
    'Showing deterministic fixtures without results so you can review empty-state messaging.',
  'fixtures-error': STRUCTURED_FIXTURE_OUTAGE_MESSAGE,
  live: null,
};

interface SearchFixtureNoticeProps {
  readonly initialFixtureMode: FixtureMode;
  readonly visible: boolean;
  readonly label?: string;
  readonly messages?: FixtureNoticeCopy;
  readonly onModeChange?: (mode: FixtureMode) => void;
}

export function SearchFixtureNotice({
  initialFixtureMode,
  visible,
  label,
  messages,
  onModeChange,
}: SearchFixtureNoticeProps): JSX.Element | null {
  const { notice, handleModeChange } = useFixtureNotice(initialFixtureMode, messages, onModeChange);

  if (!visible && !notice) {
    return null;
  }

  return (
    <FixtureToggleCluster>
      <SearchFixtureModeToggle
        initialMode={initialFixtureMode}
        visible={visible}
        onModeChange={handleModeChange}
        label={label}
      />
      {notice ? (
        <FixtureBanner role="status" aria-live="polite">
          <FixtureNoticeText as="p" $font="body-3">
            {notice}
          </FixtureNoticeText>
        </FixtureBanner>
      ) : null}
    </FixtureToggleCluster>
  );
}

function useFixtureNotice(
  initialFixtureMode: FixtureMode,
  messages: FixtureNoticeCopy | undefined,
  onModeChange: ((mode: FixtureMode) => void) | undefined,
) {
  const [noticeMode, setNoticeMode] = useState<FixtureMode>(initialFixtureMode);

  useEffect(() => {
    setNoticeMode(initialFixtureMode);
  }, [initialFixtureMode]);

  const handleModeChange = useCallback(
    (mode: FixtureMode) => {
      setNoticeMode(mode === 'fixtures' ? 'fixtures' : mode);
      onModeChange?.(mode);
    },
    [onModeChange],
  );

  const notice = useMemo(() => resolveFixtureNotice(noticeMode, messages), [noticeMode, messages]);

  return { notice, handleModeChange } as const;
}

function resolveFixtureNotice(
  mode: FixtureMode,
  overrides: FixtureNoticeCopy | undefined,
): string | null {
  if (overrides && Object.prototype.hasOwnProperty.call(overrides, mode)) {
    return overrides[mode] ?? null;
  }
  return DEFAULT_FIXTURE_NOTICE_COPY[mode];
}
